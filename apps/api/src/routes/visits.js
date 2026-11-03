import { Router } from 'express';
import { getDb } from '../db.js';
import { oid, serialize, now } from '../lib/ids.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { audit } from '../lib/audit.js';

const router = Router();
const managers = ['admin', 'visitas'];

const VISIT_STATUS = ['programada', 'confirmada', 'realizada', 'cancelada', 'reprogramada'];
const MODALIDADES = ['pagada', 'patrocinada'];
const ACTIVE_STATUSES = ['programada', 'confirmada'];

function dailyCap() {
	const n = Number(process.env.VISITS_DAILY_CAP);
	return Number.isFinite(n) && n > 0 ? Math.floor(n) : 3;
}

function dayBounds(dateInput) {
	const d = new Date(dateInput);
	if (Number.isNaN(d.getTime())) return null;
	const start = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
	const end = new Date(start);
	end.setUTCDate(end.getUTCDate() + 1);
	return { start, end, key: start.toISOString().slice(0, 10) };
}

async function countActiveOnDay(fecha, excludeId = null) {
	const bounds = dayBounds(fecha);
	if (!bounds) return { error: 'fecha inválida' };
	const q = {
		fecha: { $gte: bounds.start, $lt: bounds.end },
		status: { $in: ACTIVE_STATUSES }
	};
	if (excludeId) q._id = { $ne: excludeId };
	const count = await getDb().collection('visits').countDocuments(q);
	return { count, ...bounds, cap: dailyCap(), remaining: Math.max(0, dailyCap() - count) };
}

router.get('/meta/statuses', requireAuth, (_req, res) =>
	res.json({ statuses: VISIT_STATUS, modalidades: MODALIDADES, dailyCap: dailyCap() })
);

/** Disponibilidad / cupos por día en un rango (calendario simple). */
router.get('/availability', requireAuth, async (req, res) => {
	const fromStr = String(req.query.from || '');
	const toStr = String(req.query.to || '');
	const from = fromStr ? new Date(fromStr) : new Date();
	const to = toStr ? new Date(toStr) : new Date(from);
	if (!toStr) {
		to.setUTCMonth(to.getUTCMonth() + 1);
		to.setUTCDate(0); // last day of month of `from`
	}
	if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
		return res.status(400).json({ error: 'from/to inválidos (YYYY-MM-DD)' });
	}

	const start = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
	const endExclusive = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate() + 1));
	const cap = dailyCap();

	const visits = await getDb()
		.collection('visits')
		.find({
			fecha: { $gte: start, $lt: endExclusive },
			status: { $in: [...ACTIVE_STATUSES, 'realizada'] }
		})
		.project({ fecha: 1, horario: 1, status: 1, institutionId: 1, actividad: 1, modalidad: 1 })
		.toArray();

	const byDay = {};
	for (const v of visits) {
		const key = new Date(v.fecha).toISOString().slice(0, 10);
		if (!byDay[key]) byDay[key] = { date: key, active: 0, done: 0, visits: [] };
		if (ACTIVE_STATUSES.includes(v.status)) byDay[key].active += 1;
		if (v.status === 'realizada') byDay[key].done += 1;
		byDay[key].visits.push(serialize(v));
	}

	const days = [];
	for (let t = start.getTime(); t < endExclusive.getTime(); t += 86400000) {
		const key = new Date(t).toISOString().slice(0, 10);
		const row = byDay[key] || { date: key, active: 0, done: 0, visits: [] };
		days.push({
			date: key,
			active: row.active,
			done: row.done,
			cap,
			remaining: Math.max(0, cap - row.active),
			full: row.active >= cap,
			visits: row.visits
		});
	}

	res.json({ from: start.toISOString().slice(0, 10), to: to.toISOString().slice(0, 10), cap, days });
});

router.get('/', requireAuth, async (req, res) => {
	const q = {};
	if (req.query.status) q.status = String(req.query.status);
	if (req.query.modalidad) q.modalidad = String(req.query.modalidad);
	if (req.query.institutionId) q.institutionId = String(req.query.institutionId);
	if (req.query.from || req.query.to) {
		q.fecha = {};
		if (req.query.from) q.fecha.$gte = new Date(String(req.query.from));
		if (req.query.to) q.fecha.$lte = new Date(String(req.query.to));
	}
	const list = await getDb().collection('visits').find(q).sort({ fecha: -1 }).limit(500).toArray();
	res.json(list.map(serialize));
});

router.post('/', requireAuth, requireRoles(...managers), async (req, res) => {
	const b = req.body || {};
	if (!b.institutionId || !b.fecha) {
		return res.status(400).json({ error: 'institutionId y fecha requeridos' });
	}
	const modalidad = b.modalidad || 'pagada';
	if (!MODALIDADES.includes(modalidad)) return res.status(400).json({ error: 'modalidad inválida' });

	const slot = await countActiveOnDay(b.fecha);
	if (slot.error) return res.status(400).json({ error: slot.error });
	if (slot.remaining <= 0) {
		return res.status(409).json({
			error: `Cupo lleno el ${slot.key} (${slot.count}/${slot.cap} visitas activas). Elige otro día.`
		});
	}

	const doc = {
		institutionId: String(b.institutionId),
		requestId: b.requestId ? String(b.requestId) : null,
		fecha: new Date(b.fecha),
		horario: String(b.horario || '').trim(),
		actividad: String(b.actividad || '').trim(),
		modalidad,
		campaignId: b.campaignId ? String(b.campaignId) : null,
		sponsorId: b.sponsorId ? String(b.sponsorId) : null,
		asistentesEstimados: Number(b.asistentesEstimados) || 0,
		asistentesReales: null,
		observaciones: String(b.observaciones || '').trim(),
		status: 'programada',
		scheduleHistory: [],
		createdAt: now(),
		updatedAt: now(),
		createdBy: req.user.id
	};
	const { insertedId } = await getDb().collection('visits').insertOne(doc);

	await getDb()
		.collection('institutions')
		.updateOne(
			{ _id: oid(b.institutionId) },
			{ $set: { statusAtencion: 'programada', updatedAt: now() } }
		);

	if (b.requestId) {
		await getDb()
			.collection('requests')
			.updateOne(
				{ _id: oid(b.requestId) },
				{ $set: { status: 'visita_programada', updatedAt: now() } }
			);
	}

	await audit(req, 'create', 'visit', insertedId);
	res.status(201).json(serialize({ ...doc, _id: insertedId }));
});

router.patch('/:id', requireAuth, requireRoles(...managers), async (req, res) => {
	const id = oid(req.params.id);
	if (!id) return res.status(400).json({ error: 'id inválido' });
	const existing = await getDb().collection('visits').findOne({ _id: id });
	if (!existing) return res.status(404).json({ error: 'No encontrada' });

	const patch = { updatedAt: now() };
	if (req.body?.status) {
		if (!VISIT_STATUS.includes(req.body.status)) return res.status(400).json({ error: 'status inválido' });
		patch.status = req.body.status;
	}
	if (req.body?.fecha) patch.fecha = new Date(req.body.fecha);
	for (const k of ['horario', 'actividad', 'observaciones', 'modalidad']) {
		if (req.body?.[k] !== undefined) patch[k] = String(req.body[k]).trim();
	}
	if (req.body?.asistentesEstimados !== undefined) {
		patch.asistentesEstimados = Number(req.body.asistentesEstimados) || 0;
	}
	if (req.body?.asistentesReales !== undefined) {
		patch.asistentesReales = Number(req.body.asistentesReales) || 0;
	}
	if (req.body?.campaignId !== undefined) patch.campaignId = req.body.campaignId ? String(req.body.campaignId) : null;
	if (req.body?.sponsorId !== undefined) patch.sponsorId = req.body.sponsorId ? String(req.body.sponsorId) : null;

	await getDb().collection('visits').updateOne({ _id: id }, { $set: patch });

	let linkedSupport = null;
	if (patch.status === 'realizada') {
		const modalidad = patch.modalidad || existing.modalidad;
		const statusAtencion =
			modalidad === 'patrocinada' ? 'beneficiada_patrocinada' : 'beneficiada_pagada';
		await getDb()
			.collection('institutions')
			.updateOne(
				{ _id: oid(existing.institutionId) },
				{ $set: { statusAtencion, updatedAt: now() } }
			);
		if (existing.requestId) {
			await getDb()
				.collection('requests')
				.updateOne(
					{ _id: oid(existing.requestId) },
					{ $set: { status: 'visita_realizada', updatedAt: now() } }
				);
		}
		const closed = { ...existing, ...patch };
		linkedSupport = await ensureSupportForSponsoredVisit(req, closed, id);
	}
	if (patch.status === 'confirmada' && existing.requestId) {
		await getDb()
			.collection('requests')
			.updateOne(
				{ _id: oid(existing.requestId) },
				{ $set: { status: 'visita_confirmada', updatedAt: now() } }
			);
	}
	if (patch.status === 'cancelada' && existing.requestId) {
		await getDb()
			.collection('requests')
			.updateOne(
				{ _id: oid(existing.requestId) },
				{ $set: { status: 'cancelada', updatedAt: now() } }
			);
	}

	await audit(req, 'update', 'visit', id, patch);
	const visit = serialize(await getDb().collection('visits').findOne({ _id: id }));
	res.json(linkedSupport ? { ...visit, linkedSupport: serialize(linkedSupport) } : visit);
});

/**
 * Reprogramar: guarda fecha/horario previos en scheduleHistory y deja la visita en programada.
 */
router.post('/:id/reschedule', requireAuth, requireRoles(...managers), async (req, res) => {
	const id = oid(req.params.id);
	if (!id) return res.status(400).json({ error: 'id inválido' });
	const existing = await getDb().collection('visits').findOne({ _id: id });
	if (!existing) return res.status(404).json({ error: 'No encontrada' });

	if (['realizada', 'cancelada'].includes(existing.status)) {
		return res.status(409).json({ error: 'No se puede reprogramar una visita realizada o cancelada' });
	}
	if (!req.body?.fecha) return res.status(400).json({ error: 'fecha nueva requerida' });

	const newFecha = new Date(req.body.fecha);
	if (Number.isNaN(newFecha.getTime())) return res.status(400).json({ error: 'fecha inválida' });

	const slot = await countActiveOnDay(newFecha, id);
	if (slot.error) return res.status(400).json({ error: slot.error });
	if (slot.remaining <= 0) {
		return res.status(409).json({
			error: `Cupo lleno el ${slot.key} (${slot.count}/${slot.cap} visitas activas). Elige otro día.`
		});
	}

	const newHorario =
		req.body.horario !== undefined ? String(req.body.horario).trim() : existing.horario || '';
	const motivo = String(req.body.motivo || '').trim();

	const historyEntry = {
		fecha: existing.fecha,
		horario: existing.horario || '',
		status: existing.status,
		motivo: motivo || null,
		at: now(),
		by: req.user.id,
		byEmail: req.user.email
	};

	await getDb().collection('visits').updateOne(
		{ _id: id },
		{
			$set: {
				fecha: newFecha,
				horario: newHorario,
				status: 'programada',
				updatedAt: now(),
				lastRescheduledAt: now()
			},
			$push: { scheduleHistory: historyEntry }
		}
	);

	await audit(req, 'reschedule', 'visit', id, {
		changes: {
			fecha: { from: existing.fecha, to: newFecha },
			horario: { from: existing.horario || '', to: newHorario },
			status: { from: existing.status, to: 'programada' }
		},
		motivo
	});

	if (existing.requestId) {
		await getDb()
			.collection('requests')
			.updateOne(
				{ _id: oid(existing.requestId) },
				{ $set: { status: 'visita_programada', updatedAt: now() } }
			);
	}

	res.json(serialize(await getDb().collection('visits').findOne({ _id: id })));
});

/**
 * Si la visita cerrada es patrocinada, crea (idempotente) un apoyo ligado a la visita.
 */
async function ensureSupportForSponsoredVisit(req, visit, visitObjectId) {
	const modalidad = visit.modalidad;
	if (modalidad !== 'patrocinada') return null;

	const visitaId = String(visitObjectId);
	const existingSupport = await getDb().collection('supports').findOne({ visitaId });
	if (existingSupport) return existingSupport;

	const program =
		(await getDb().collection('programs').findOne({
			modalidadVisita: { $regex: /^patrocinada$/i }
		})) || (await getDb().collection('programs').findOne({}));

	let compromisoPatrocinioId = null;
	if (visit.sponsorId) {
		const commitment = await getDb().collection('commitments').findOne({
			sponsorId: String(visit.sponsorId)
		});
		if (commitment) compromisoPatrocinioId = String(commitment._id);
	}

	const doc = {
		programaApoyoId: program ? String(program._id) : 'sin_programa',
		compromisoPatrocinioId,
		institutionId: String(visit.institutionId),
		visitaId,
		tipoBeneficio: 'visita_patrocinada',
		montoOtorgado: 0,
		fechaOtorgamiento: visit.fecha ? new Date(visit.fecha) : now(),
		validado: false,
		autoGenerated: true,
		campaignId: visit.campaignId ? String(visit.campaignId) : null,
		sponsorId: visit.sponsorId ? String(visit.sponsorId) : null,
		asistentes: visit.asistentesReales ?? visit.asistentesEstimados ?? 0,
		createdAt: now(),
		updatedAt: now()
	};

	const { insertedId } = await getDb().collection('supports').insertOne(doc);
	await getDb()
		.collection('visits')
		.updateOne({ _id: visitObjectId }, { $set: { supportId: String(insertedId), updatedAt: now() } });
	await audit(req, 'create', 'support', insertedId, { auto: true, visitaId });
	return { ...doc, _id: insertedId };
}

export default router;
