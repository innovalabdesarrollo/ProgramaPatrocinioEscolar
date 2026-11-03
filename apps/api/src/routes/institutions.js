import { Router } from 'express';
import { getDb } from '../db.js';
import { oid, serialize, now } from '../lib/ids.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { audit } from '../lib/audit.js';

const router = Router();
const editors = ['admin', 'relaciones', 'visitas', 'sistemas'];

const STATUS = [
	'no_atendida',
	'en_espera',
	'programada',
	'beneficiada_pagada',
	'beneficiada_patrocinada',
	'pendiente_revision',
	'descartada'
];

router.get('/meta/statuses', requireAuth, (_req, res) => res.json(STATUS));

router.get('/', requireAuth, async (req, res) => {
	const q = {};
	if (req.query.pendingReview === '1' || req.query.pendingReview === 'true') {
		q.statusAtencion = 'pendiente_revision';
		q.validated = { $ne: true };
		q.discarded = { $ne: true };
	} else {
		if (req.query.status) q.statusAtencion = String(req.query.status);
		if (req.query.includeDiscarded !== '1' && req.query.includeDiscarded !== 'true') {
			q.discarded = { $ne: true };
		}
	}
	if (req.query.nivel) q.nivelEducativo = String(req.query.nivel);
	if (req.query.tipo) q.tipo = String(req.query.tipo);
	if (req.query.zona) q.zona = String(req.query.zona);
	if (req.query.search) {
		q.$or = [
			{ nombre: { $regex: String(req.query.search), $options: 'i' } },
			{ ciudad: { $regex: String(req.query.search), $options: 'i' } }
		];
	}
	const list = await getDb().collection('institutions').find(q).sort({ nombre: 1 }).limit(500).toArray();
	res.json(list.map(serialize));
});

router.get('/:id/duplicates', requireAuth, async (req, res) => {
	const id = oid(req.params.id);
	if (!id) return res.status(400).json({ error: 'id inválido' });
	const inst = await getDb().collection('institutions').findOne({ _id: id });
	if (!inst) return res.status(404).json({ error: 'No encontrada' });
	res.json(await findPossibleDuplicates(inst));
});

router.get('/:id', requireAuth, async (req, res) => {
	const id = oid(req.params.id);
	if (!id) return res.status(400).json({ error: 'id inválido' });
	const inst = await getDb().collection('institutions').findOne({ _id: id });
	if (!inst) return res.status(404).json({ error: 'No encontrada' });

	const [visits, requests, supports, communications, observations, duplicates, changeHistory] =
		await Promise.all([
			getDb()
				.collection('visits')
				.find({ institutionId: String(id) })
				.sort({ fecha: -1 })
				.toArray(),
			getDb()
				.collection('requests')
				.find({ institutionId: String(id) })
				.sort({ createdAt: -1 })
				.toArray(),
			getDb()
				.collection('supports')
				.find({ institutionId: String(id) })
				.sort({ fechaOtorgamiento: -1 })
				.toArray(),
			getDb()
				.collection('communications')
				.find({ institutionId: String(id) })
				.sort({ communicationDate: -1 })
				.toArray(),
			getDb()
				.collection('admin_observations')
				.find({ institutionId: String(id) })
				.sort({ createdAt: -1 })
				.toArray(),
			findPossibleDuplicates(inst),
			getDb()
				.collection('audit')
				.find({ entity: 'institution', entityId: String(id) })
				.sort({ at: -1 })
				.limit(40)
				.toArray()
		]);

	const payload = {
		institution: serialize(inst),
		visits: visits.map(serialize),
		requests: requests.map(serialize),
		supports: supports.map(serialize),
		communications: communications.map(serialize),
		observations: observations.map(serialize),
		duplicates,
		changeHistory: changeHistory.map(serialize)
	};
	payload.timeline = buildInstitutionTimeline(payload);
	res.json(payload);
});

router.post('/', requireAuth, requireRoles(...editors), async (req, res) => {
	const b = req.body || {};
	if (!b.nombre) return res.status(400).json({ error: 'nombre requerido' });
	const doc = buildInstitution(b);
	doc.createdAt = now();
	doc.updatedAt = now();
	doc.validated = b.validated !== false;
	const { insertedId } = await getDb().collection('institutions').insertOne(doc);
	await audit(req, 'create', 'institution', insertedId, { nombre: doc.nombre });
	res.status(201).json(serialize({ ...doc, _id: insertedId }));
});

router.patch('/:id', requireAuth, requireRoles(...editors), async (req, res) => {
	const id = oid(req.params.id);
	if (!id) return res.status(400).json({ error: 'id inválido' });
	const existing = await getDb().collection('institutions').findOne({ _id: id });
	if (!existing) return res.status(404).json({ error: 'No encontrada' });
	const patch = buildInstitution(req.body || {}, true);
	if (req.body?.statusAtencion && !STATUS.includes(req.body.statusAtencion)) {
		return res.status(400).json({ error: 'statusAtencion inválido' });
	}
	const changes = fieldChanges(existing, patch);
	patch.updatedAt = now();
	await getDb().collection('institutions').updateOne({ _id: id }, { $set: patch });
	if (Object.keys(changes).length) {
		await audit(req, 'update', 'institution', id, { changes });
	}
	res.json(serialize(await getDb().collection('institutions').findOne({ _id: id })));
});

/** Aprobar o descartar registro del formulario público → catálogo oficial */
router.post('/:id/review', requireAuth, requireRoles(...editors), async (req, res) => {
	const id = oid(req.params.id);
	if (!id) return res.status(400).json({ error: 'id inválido' });
	const existing = await getDb().collection('institutions').findOne({ _id: id });
	if (!existing) return res.status(404).json({ error: 'No encontrada' });

	const action = String(req.body?.action || '').trim();
	if (action !== 'approve' && action !== 'reject') {
		return res.status(400).json({ error: 'action debe ser approve o reject' });
	}

	const notes = String(req.body?.notes || '').trim();
	const patch =
		action === 'approve'
			? {
					validated: true,
					discarded: false,
					pendingPublicUpdate: false,
					statusAtencion:
						existing.statusAtencion === 'pendiente_revision' || existing.statusAtencion === 'descartada'
							? 'no_atendida'
							: existing.statusAtencion,
					validatedAt: now(),
					validatedBy: req.user.id,
					reviewNotes: notes || existing.reviewNotes || '',
					updatedAt: now()
				}
			: {
					validated: false,
					discarded: true,
					pendingPublicUpdate: false,
					statusAtencion: 'descartada',
					validatedAt: null,
					validatedBy: null,
					reviewNotes: notes || existing.reviewNotes || '',
					updatedAt: now()
				};

	await getDb().collection('institutions').updateOne({ _id: id }, { $set: patch });
	await audit(req, action === 'approve' ? 'validate' : 'reject', 'institution', id, {
		notes,
		changes: fieldChanges(existing, patch)
	});
	res.json(serialize(await getDb().collection('institutions').findOne({ _id: id })));
});

router.post('/:id/communications', requireAuth, requireRoles('admin', 'visitas', 'relaciones'), async (req, res) => {
	const id = oid(req.params.id);
	if (!id) return res.status(400).json({ error: 'id inválido' });
	const { channel, subject, summary, followUpDate } = req.body || {};
	if (!channel || !subject || !summary) {
		return res.status(400).json({ error: 'channel, subject y summary requeridos' });
	}
	const doc = {
		institutionId: String(id),
		communicationDate: now(),
		channel: String(channel),
		subject: String(subject),
		summary: String(summary),
		followUpDate: followUpDate ? new Date(followUpDate) : null,
		createdBy: req.user.id,
		createdAt: now()
	};
	const { insertedId } = await getDb().collection('communications').insertOne(doc);
	await audit(req, 'create', 'communication', insertedId);
	res.status(201).json(serialize({ ...doc, _id: insertedId }));
});

const OBS_TYPES = ['control', 'aclaracion', 'hallazgo', 'otra'];

/** Observación administrativa en la ficha (control / aclaración / hallazgo). */
router.post(
	'/:id/observations',
	requireAuth,
	requireRoles('admin', 'visitas', 'relaciones', 'admin_apoyos', 'sistemas'),
	async (req, res) => {
		const id = oid(req.params.id);
		if (!id) return res.status(400).json({ error: 'id inválido' });
		const exists = await getDb().collection('institutions').findOne({ _id: id }, { projection: { _id: 1 } });
		if (!exists) return res.status(404).json({ error: 'Institución no encontrada' });

		const text = String(req.body?.text || '').trim();
		const tipo = String(req.body?.tipo || 'control').trim();
		if (!text) return res.status(400).json({ error: 'text requerido' });
		if (!OBS_TYPES.includes(tipo)) {
			return res.status(400).json({ error: `tipo debe ser: ${OBS_TYPES.join(', ')}` });
		}

		const doc = {
			institutionId: String(id),
			tipo,
			text,
			createdBy: req.user.id,
			createdByEmail: req.user.email,
			createdAt: now()
		};
		const { insertedId } = await getDb().collection('admin_observations').insertOne(doc);
		await audit(req, 'create', 'admin_observation', insertedId, {
			institutionId: String(id),
			tipo
		});
		res.status(201).json(serialize({ ...doc, _id: insertedId }));
	}
);

const TRACKED_FIELDS = [
	'nombre',
	'tipo',
	'nivelEducativo',
	'turno',
	'direccion',
	'ciudad',
	'estado',
	'codigoPostal',
	'zona',
	'contactoNombre',
	'contactoEmail',
	'contactoTelefono',
	'statusAtencion',
	'notas',
	'latitud',
	'longitud',
	'validated',
	'discarded',
	'reviewNotes'
];

function buildInstitution(b, partial = false) {
	const fields = [
		'nombre',
		'tipo',
		'nivelEducativo',
		'turno',
		'direccion',
		'ciudad',
		'estado',
		'codigoPostal',
		'zona',
		'contactoNombre',
		'contactoEmail',
		'contactoTelefono',
		'statusAtencion',
		'notas'
	];
	const doc = {};
	for (const f of fields) {
		if (b[f] !== undefined) doc[f] = b[f] == null ? '' : String(b[f]).trim();
		else if (!partial) doc[f] = '';
	}
	if (b.latitud !== undefined || !partial) {
		doc.latitud = b.latitud !== undefined && b.latitud !== '' ? Number(b.latitud) : null;
	}
	if (b.longitud !== undefined || !partial) {
		doc.longitud = b.longitud !== undefined && b.longitud !== '' ? Number(b.longitud) : null;
	}
	if (typeof b.validated === 'boolean') doc.validated = b.validated;
	if (!partial && !doc.statusAtencion) doc.statusAtencion = 'no_atendida';
	return doc;
}

function fieldChanges(before, patch) {
	const changes = {};
	for (const key of TRACKED_FIELDS) {
		if (!(key in patch)) continue;
		const from = before?.[key] ?? null;
		const to = patch[key] ?? null;
		if (JSON.stringify(from) !== JSON.stringify(to)) {
			changes[key] = { from, to };
		}
	}
	return changes;
}

/** Un solo feed cronológico a partir de lo que ya existe (sin colección nueva). */
function buildInstitutionTimeline({
	visits = [],
	requests = [],
	supports = [],
	communications = [],
	observations = [],
	changeHistory = []
}) {
	const items = [];

	for (const v of visits) {
		items.push({
			at: v.fecha || v.createdAt || v.updatedAt,
			type: 'visit',
			title: `Visita · ${v.status}`,
			summary: [v.modalidad, v.horario, v.actividad].filter(Boolean).join(' · '),
			refId: v.id
		});
		for (const h of v.scheduleHistory || []) {
			items.push({
				at: h.at,
				type: 'visit_reschedule',
				title: 'Visita reprogramada',
				summary: `antes ${h.fecha ? new Date(h.fecha).toISOString().slice(0, 10) : '—'} ${h.horario || ''}${h.motivo ? ` · ${h.motivo}` : ''}`,
				refId: v.id
			});
		}
	}

	for (const r of requests) {
		items.push({
			at: r.createdAt || r.updatedAt,
			type: 'request',
			title: `Solicitud · ${r.status}`,
			summary: [r.solicitanteNombre, r.modalidadPreferida, r.infoRequested ? `info pedida: ${r.infoRequested}` : '']
				.filter(Boolean)
				.join(' · '),
			refId: r.id
		});
	}

	for (const s of supports) {
		items.push({
			at: s.fechaOtorgamiento || s.createdAt,
			type: 'support',
			title: `Apoyo · ${s.tipoBeneficio || 'beneficio'}`,
			summary: s.montoOtorgado != null ? `$${s.montoOtorgado}${s.validado ? ' · validado' : ''}` : '',
			refId: s.id
		});
	}

	for (const c of communications) {
		items.push({
			at: c.communicationDate || c.createdAt,
			type: 'communication',
			title: `Comunicación · ${c.channel || 'canal'}`,
			summary: [c.subject, c.summary].filter(Boolean).join(' — '),
			refId: c.id
		});
	}

	for (const o of observations) {
		items.push({
			at: o.createdAt,
			type: 'observation',
			title: `Observación · ${o.tipo || 'admin'}`,
			summary: o.text || '',
			refId: o.id
		});
	}

	for (const h of changeHistory) {
		const changeKeys = h.detail?.changes ? Object.keys(h.detail.changes) : [];
		items.push({
			at: h.at,
			type: 'audit',
			title: `Cambio · ${h.action}`,
			summary: [
				h.userEmail,
				changeKeys.length ? changeKeys.join(', ') : h.detail?.notes || h.detail?.nombre || ''
			]
				.filter(Boolean)
				.join(' · '),
			refId: h.id
		});
	}

	items.sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));
	return items.slice(0, 100);
}

function normalizeText(s) {
	return String(s || '')
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{M}/gu, '')
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();
}

function escapeRegex(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Coincidencias simples por nombre, email o domicilio (sin libs extras). */
async function findPossibleDuplicates(inst) {
	const email = String(inst.contactoEmail || '')
		.trim()
		.toLowerCase();
	const phone = String(inst.contactoTelefono || '').replace(/\D/g, '');
	const nombreNorm = normalizeText(inst.nombre);
	const dirNorm = normalizeText(inst.direccion);
	const nombreWords = nombreNorm.split(' ').filter((w) => w.length > 2).slice(0, 4);
	const dirWords = dirNorm.split(' ').filter((w) => w.length > 2).slice(0, 3);

	const or = [];
	if (email) or.push({ contactoEmail: email });
	if (phone.length >= 8) or.push({ contactoTelefono: { $regex: escapeRegex(phone.slice(-8)) } });
	if (nombreWords.length >= 2) {
		or.push({
			nombre: { $regex: nombreWords.map(escapeRegex).join('.*'), $options: 'i' }
		});
	} else if (nombreNorm.length >= 5) {
		or.push({ nombre: { $regex: escapeRegex(nombreNorm), $options: 'i' } });
	}
	if (dirWords.length >= 2) {
		or.push({
			direccion: { $regex: dirWords.map(escapeRegex).join('.*'), $options: 'i' }
		});
	}
	if (!or.length) return [];

	const candidates = await getDb()
		.collection('institutions')
		.find({
			_id: { $ne: inst._id },
			discarded: { $ne: true },
			$or: or
		})
		.limit(25)
		.toArray();

	const scored = [];
	for (const c of candidates) {
		const reasons = [];
		const cEmail = String(c.contactoEmail || '')
			.trim()
			.toLowerCase();
		const cPhone = String(c.contactoTelefono || '').replace(/\D/g, '');
		const cNombre = normalizeText(c.nombre);
		const cDir = normalizeText(c.direccion);

		if (email && cEmail && email === cEmail) reasons.push('mismo email');
		if (phone.length >= 8 && cPhone.endsWith(phone.slice(-8))) reasons.push('mismo teléfono');
		if (nombreNorm && cNombre && (cNombre.includes(nombreNorm) || nombreNorm.includes(cNombre))) {
			reasons.push('nombre similar');
		} else if (nombreWords.length >= 2 && nombreWords.every((w) => cNombre.includes(w))) {
			reasons.push('nombre similar');
		}
		if (dirWords.length >= 2 && dirWords.every((w) => cDir.includes(w))) {
			reasons.push('domicilio similar');
		}

		if (!reasons.length) continue;
		scored.push({
			...serialize(c),
			matchReasons: reasons,
			score: reasons.length
		});
	}

	scored.sort((a, b) => b.score - a.score);
	return scored.slice(0, 8);
}

export default router;
