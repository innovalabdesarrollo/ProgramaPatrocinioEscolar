import { Router } from 'express';
import { getDb } from '../db.js';
import { oid } from '../lib/ids.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function periodBounds(req) {
	const from = req.query.from ? new Date(String(req.query.from)) : null;
	let to = req.query.to ? new Date(String(req.query.to)) : null;
	if (to && String(req.query.to).length <= 10) {
		to = new Date(to);
		to.setUTCHours(23, 59, 59, 999);
	}
	const hasPeriod = Boolean(from || to);
	const fecha = {};
	if (from) fecha.$gte = from;
	if (to) fecha.$lte = to;
	const visitQ = hasPeriod ? { fecha } : {};
	const createdQ = {};
	if (from) createdQ.$gte = from;
	if (to) createdQ.$lte = to;
	const requestQ = hasPeriod ? { createdAt: createdQ } : {};
	return { from, to, hasPeriod, visitQ, requestQ };
}

router.get('/dashboard', requireAuth, async (req, res) => {
	const db = getDb();
	const { from, to, hasPeriod, visitQ, requestQ } = periodBounds(req);

	/** Instituciones tocadas por visitas del periodo (si hay filtro). */
	let instScope = {};
	if (hasPeriod) {
		const touch = await db
			.collection('visits')
			.find(visitQ)
			.project({ institutionId: 1 })
			.limit(5000)
			.toArray();
		const ids = [
			...new Set(touch.map((v) => String(v.institutionId || '')).filter(Boolean))
		]
			.map((id) => oid(id))
			.filter(Boolean);
		instScope = ids.length ? { _id: { $in: ids } } : { _id: { $in: [] } };
	}

	const [
		institutionsTotal,
		beneficiadas,
		enEspera,
		noAtendidas,
		visitasPagadas,
		visitasPatrocinadas,
		solicitudesPendientes,
		personasAgg,
		campaigns,
		byZona,
		byNivel
	] = await Promise.all([
		db.collection('institutions').countDocuments(instScope),
		db.collection('institutions').countDocuments({
			...instScope,
			statusAtencion: { $in: ['beneficiada_pagada', 'beneficiada_patrocinada'] }
		}),
		db.collection('institutions').countDocuments({ ...instScope, statusAtencion: 'en_espera' }),
		db.collection('institutions').countDocuments({ ...instScope, statusAtencion: 'no_atendida' }),
		db.collection('visits').countDocuments({ ...visitQ, modalidad: 'pagada', status: 'realizada' }),
		db.collection('visits').countDocuments({
			...visitQ,
			modalidad: 'patrocinada',
			status: 'realizada'
		}),
		db.collection('requests').countDocuments({
			...requestQ,
			status: { $in: ['recibida', 'en_revision', 'pendiente_contacto', 'lista_espera'] }
		}),
		db
			.collection('visits')
			.aggregate([
				{ $match: { ...visitQ, status: 'realizada' } },
				{
					$group: {
						_id: null,
						personas: { $sum: { $ifNull: ['$asistentesReales', '$asistentesEstimados'] } }
					}
				}
			])
			.toArray(),
		db.collection('campaigns').find({}).toArray(),
		db
			.collection('institutions')
			.aggregate([
				...(Object.keys(instScope).length ? [{ $match: instScope }] : []),
				{ $group: { _id: '$zona', total: { $sum: 1 } } },
				{ $sort: { total: -1 } }
			])
			.toArray(),
		db
			.collection('institutions')
			.aggregate([
				...(Object.keys(instScope).length ? [{ $match: instScope }] : []),
				{ $group: { _id: '$nivelEducativo', total: { $sum: 1 } } },
				{ $sort: { total: -1 } }
			])
			.toArray()
	]);

	const campaignResults = [];
	for (const c of campaigns) {
		const campMatch = { ...visitQ, campaignId: String(c._id), status: 'realizada' };
		const visits = await db.collection('visits').countDocuments(campMatch);
		const personas = await db
			.collection('visits')
			.aggregate([
				{ $match: campMatch },
				{
					$group: {
						_id: null,
						n: { $sum: { $ifNull: ['$asistentesReales', '$asistentesEstimados'] } }
					}
				}
			])
			.toArray();
		const meta = c.metaAtencion || 0;
		const personasN = personas[0]?.n || 0;
		const pct = meta > 0 ? Math.round((personasN / meta) * 100) : null;
		campaignResults.push({
			id: String(c._id),
			nombre: c.nombre,
			metaAtencion: meta,
			metaFinanciera: c.metaFinanciera || 0,
			visitasRealizadas: visits,
			personasAtendidas: personasN,
			faltantePersonas: meta > 0 ? Math.max(0, meta - personasN) : null,
			pctCumplimiento: pct,
			pctBar: pct == null ? 0 : Math.min(100, pct),
			nivelCumplimiento:
				pct == null ? 'sin_meta' : pct >= 100 ? 'cumplida' : pct >= 70 ? 'en_curso' : 'rezagada',
			estado: c.estado
		});
	}

	res.json({
		updatedAt: new Date(),
		period: {
			from: from ? from.toISOString() : null,
			to: to ? to.toISOString() : null,
			active: hasPeriod
		},
		institutionsTotal,
		institutionsBeneficiadas: beneficiadas,
		institutionsEnEspera: enEspera,
		institutionsNoAtendidas: noAtendidas,
		visitasPagadas,
		visitasPatrocinadas,
		solicitudesPendientes,
		personasAtendidas: personasAgg[0]?.personas || 0,
		byZona: byZona.map((z) => ({ zona: z._id || 'Sin zona', total: z.total })),
		byNivel: byNivel.map((z) => ({ nivel: z._id || 'Sin nivel', total: z.total })),
		campaigns: campaignResults
	});
});

/** Registros que sustentan un indicador del tablero. */
router.get('/drilldown', requireAuth, async (req, res) => {
	const db = getDb();
	const metric = String(req.query.metric || '');
	const { hasPeriod, visitQ, requestQ } = periodBounds(req);
	const limit = Math.min(Number(req.query.limit) || 50, 100);

	let instScope = {};
	if (hasPeriod) {
		const touch = await db
			.collection('visits')
			.find(visitQ)
			.project({ institutionId: 1 })
			.limit(5000)
			.toArray();
		const ids = [
			...new Set(touch.map((v) => String(v.institutionId || '')).filter(Boolean))
		]
			.map((id) => oid(id))
			.filter(Boolean);
		instScope = ids.length ? { _id: { $in: ids } } : { _id: { $in: [] } };
	}

	const serializeLite = (doc, extra = {}) => ({
		id: String(doc._id),
		...extra
	});

	if (['institutions', 'beneficiadas', 'en_espera', 'no_atendidas'].includes(metric)) {
		const q = { ...instScope };
		if (metric === 'beneficiadas') {
			q.statusAtencion = { $in: ['beneficiada_pagada', 'beneficiada_patrocinada'] };
		} else if (metric === 'en_espera') {
			q.statusAtencion = 'en_espera';
		} else if (metric === 'no_atendidas') {
			q.statusAtencion = 'no_atendida';
		}
		const rows = await db.collection('institutions').find(q).sort({ nombre: 1 }).limit(limit).toArray();
		return res.json({
			metric,
			kind: 'institutions',
			total: await db.collection('institutions').countDocuments(q),
			items: rows.map((r) =>
				serializeLite(r, {
					nombre: r.nombre,
					zona: r.zona,
					nivelEducativo: r.nivelEducativo,
					statusAtencion: r.statusAtencion,
					href: '/instituciones'
				})
			)
		});
	}

	if (['visitas_pagadas', 'visitas_patrocinadas', 'personas'].includes(metric)) {
		const q = { ...visitQ, status: 'realizada' };
		if (metric === 'visitas_pagadas') q.modalidad = 'pagada';
		if (metric === 'visitas_patrocinadas') q.modalidad = 'patrocinada';
		const rows = await db.collection('visits').find(q).sort({ fecha: -1 }).limit(limit).toArray();
		return res.json({
			metric,
			kind: 'visits',
			total: await db.collection('visits').countDocuments(q),
			items: rows.map((r) =>
				serializeLite(r, {
					fecha: r.fecha,
					horario: r.horario,
					modalidad: r.modalidad,
					status: r.status,
					asistentes: r.asistentesReales ?? r.asistentesEstimados,
					institutionId: r.institutionId,
					campaignId: r.campaignId,
					href: '/visitas'
				})
			)
		});
	}

	if (metric === 'solicitudes') {
		const q = {
			...requestQ,
			status: { $in: ['recibida', 'en_revision', 'pendiente_contacto', 'lista_espera'] }
		};
		const rows = await db.collection('requests').find(q).sort({ createdAt: -1 }).limit(limit).toArray();
		return res.json({
			metric,
			kind: 'requests',
			total: await db.collection('requests').countDocuments(q),
			items: rows.map((r) =>
				serializeLite(r, {
					institutionNombre: r.institutionNombre,
					status: r.status,
					solicitanteNombre: r.solicitanteNombre,
					createdAt: r.createdAt,
					href: '/solicitudes'
				})
			)
		});
	}

	if (metric === 'campaign' && req.query.campaignId) {
		const campMatch = {
			...visitQ,
			campaignId: String(req.query.campaignId),
			status: 'realizada'
		};
		const rows = await db.collection('visits').find(campMatch).sort({ fecha: -1 }).limit(limit).toArray();
		return res.json({
			metric,
			kind: 'visits',
			total: await db.collection('visits').countDocuments(campMatch),
			items: rows.map((r) =>
				serializeLite(r, {
					fecha: r.fecha,
					horario: r.horario,
					modalidad: r.modalidad,
					status: r.status,
					asistentes: r.asistentesReales ?? r.asistentesEstimados,
					institutionId: r.institutionId,
					campaignId: r.campaignId,
					href: '/visitas'
				})
			)
		});
	}

	return res.status(400).json({
		error:
			'metric inválido (institutions|beneficiadas|en_espera|no_atendidas|visitas_pagadas|visitas_patrocinadas|personas|solicitudes|campaign)'
	});
});

/** Alertas de seguimiento institucional — solo UI, sin correo. */
router.get('/alerts', requireAuth, async (_req, res) => {
	const db = getDb();
	const waitDays = Number(process.env.ALERT_WAIT_DAYS) || 14;
	const campaignPct = Number(process.env.ALERT_CAMPAIGN_PCT) || 70;
	const nowMs = Date.now();
	const alerts = [];

	const pendingInstitutions = await db
		.collection('institutions')
		.find({
			statusAtencion: 'pendiente_revision',
			validated: { $ne: true },
			discarded: { $ne: true }
		})
		.project({ nombre: 1 })
		.limit(20)
		.toArray();
	for (const i of pendingInstitutions) {
		alerts.push({
			id: `inst-review-${i._id}`,
			severity: 'medium',
			category: 'institucion',
			title: 'Registro pendiente de validación',
			detail: i.nombre,
			href: '/instituciones',
			refId: String(i._id)
		});
	}

	const infoRequests = await db
		.collection('requests')
		.find({
			$or: [{ status: 'pendiente_contacto' }, { infoRequested: { $exists: true, $nin: ['', null] } }]
		})
		.project({ institutionNombre: 1, infoRequested: 1, status: 1 })
		.limit(20)
		.toArray();
	for (const r of infoRequests) {
		alerts.push({
			id: `req-info-${r._id}`,
			severity: 'medium',
			category: 'solicitud',
			title: 'Solicitud espera complemento de la institución',
			detail: `${r.institutionNombre || '—'} · ${r.infoRequested || r.status}`,
			href: '/solicitudes',
			refId: String(r._id)
		});
	}

	const waitRows = await db.collection('waitlist').find({ status: 'activa' }).limit(50).toArray();
	const waitInstIds = [...new Set(waitRows.map((w) => w.institutionId).filter(Boolean))];
	const waitInstMap = new Map();
	if (waitInstIds.length) {
		const insts = await db
			.collection('institutions')
			.find({ _id: { $in: waitInstIds } })
			.project({ nombre: 1 })
			.toArray();
		for (const i of insts) waitInstMap.set(String(i._id), i.nombre);
	}
	for (const w of waitRows) {
		const days = Math.max(
			0,
			Math.floor((nowMs - new Date(w.requestDate).getTime()) / 86400000)
		);
		if (days < waitDays) continue;
		const nombre =
			waitInstMap.get(String(w.institutionId)) || w.institutionNombre || w.institutionId || '—';
		alerts.push({
			id: `wait-${w._id}`,
			severity: days >= 30 ? 'high' : 'medium',
			category: 'espera',
			title: `Lista de espera: ${days} días`,
			detail: `${nombre} · prioridad ${w.priority}`,
			href: '/solicitudes',
			refId: String(w._id)
		});
	}

	const startToday = new Date();
	startToday.setUTCHours(0, 0, 0, 0);
	const overdueVisits = await db
		.collection('visits')
		.find({
			status: { $in: ['programada', 'confirmada'] },
			fecha: { $lt: startToday }
		})
		.project({ fecha: 1, horario: 1, institutionId: 1, status: 1 })
		.limit(20)
		.toArray();
	for (const v of overdueVisits) {
		alerts.push({
			id: `visit-overdue-${v._id}`,
			severity: 'high',
			category: 'visita',
			title: 'Visita vencida sin cerrar',
			detail: `${new Date(v.fecha).toISOString().slice(0, 10)} ${v.horario || ''} · ${v.status}`,
			href: '/visitas',
			refId: String(v._id)
		});
	}

	const campaigns = await db.collection('campaigns').find({ estado: { $ne: 'cerrada' } }).toArray();
	for (const c of campaigns) {
		const meta = c.metaAtencion || 0;
		if (meta <= 0) continue;
		const personas = await db
			.collection('visits')
			.aggregate([
				{ $match: { campaignId: String(c._id), status: 'realizada' } },
				{
					$group: {
						_id: null,
						n: { $sum: { $ifNull: ['$asistentesReales', '$asistentesEstimados'] } }
					}
				}
			])
			.toArray();
		const n = personas[0]?.n || 0;
		const pct = Math.round((n / meta) * 100);
		if (pct >= campaignPct) continue;
		alerts.push({
			id: `camp-${c._id}`,
			severity: pct < 40 ? 'high' : 'medium',
			category: 'campaña',
			title: `Campaña rezagada (${pct}%)`,
			detail: `${c.nombre}: ${n}/${meta} personas`,
			href: '/',
			refId: String(c._id)
		});
	}

	const pendingSupports = await db
		.collection('supports')
		.find({ autoGenerated: true, validado: { $ne: true } })
		.project({ tipoBeneficio: 1, institutionId: 1, visitaId: 1 })
		.limit(20)
		.toArray();
	for (const s of pendingSupports) {
		alerts.push({
			id: `support-${s._id}`,
			severity: 'low',
			category: 'apoyo',
			title: 'Apoyo automático pendiente de validar',
			detail: `${s.tipoBeneficio} · visita ${s.visitaId || '—'}`,
			href: '/patrocinio',
			refId: String(s._id)
		});
	}

	const order = { high: 0, medium: 1, low: 2 };
	alerts.sort((a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9));

	res.json({
		updatedAt: new Date(),
		thresholds: { waitDays, campaignPct },
		counts: {
			total: alerts.length,
			high: alerts.filter((a) => a.severity === 'high').length,
			medium: alerts.filter((a) => a.severity === 'medium').length,
			low: alerts.filter((a) => a.severity === 'low').length
		},
		alerts: alerts.slice(0, 60)
	});
});

router.get('/export', requireAuth, async (req, res) => {
	const type = String(req.query.type || 'institutions');
	const db = getDb();
	const { hasPeriod, visitQ } = periodBounds(req);
	const status = req.query.status ? String(req.query.status) : '';
	const campaignId = req.query.campaignId ? String(req.query.campaignId) : '';
	const sponsorId = req.query.sponsorId ? String(req.query.sponsorId) : '';

	if (type === 'institutions') {
		const q = {};
		if (status) q.statusAtencion = status;
		if (hasPeriod || campaignId || sponsorId) {
			const vq = { ...visitQ };
			if (campaignId) vq.campaignId = campaignId;
			if (sponsorId) vq.sponsorId = sponsorId;
			const touch = await db
				.collection('visits')
				.find(vq)
				.project({ institutionId: 1 })
				.limit(5000)
				.toArray();
			const ids = [
				...new Set(touch.map((v) => String(v.institutionId || '')).filter(Boolean))
			]
				.map((id) => oid(id))
				.filter(Boolean);
			q._id = { $in: ids };
		}
		const rows = await db.collection('institutions').find(q).sort({ nombre: 1 }).toArray();
		res.setHeader('Content-Type', 'text/csv; charset=utf-8');
		res.setHeader('Content-Disposition', 'attachment; filename=instituciones.csv');
		const header =
			'nombre,tipo,nivel,turno,ciudad,estado,zona,status,lat,lng,contacto,email,telefono\n';
		const body = rows
			.map((r) =>
				[
					r.nombre,
					r.tipo,
					r.nivelEducativo,
					r.turno,
					r.ciudad,
					r.estado,
					r.zona,
					r.statusAtencion,
					r.latitud,
					r.longitud,
					r.contactoNombre,
					r.contactoEmail,
					r.contactoTelefono
				]
					.map(csv)
					.join(',')
			)
			.join('\n');
		return res.send(header + body);
	}

	if (type === 'visits') {
		const q = { ...visitQ };
		if (status) q.status = status;
		if (campaignId) q.campaignId = campaignId;
		if (sponsorId) q.sponsorId = sponsorId;
		const rows = await db.collection('visits').find(q).sort({ fecha: -1 }).limit(5000).toArray();
		res.setHeader('Content-Type', 'text/csv; charset=utf-8');
		res.setHeader('Content-Disposition', 'attachment; filename=visitas.csv');
		const header =
			'institutionId,fecha,horario,actividad,modalidad,status,estimados,reales,campaignId,sponsorId\n';
		const body = rows
			.map((r) =>
				[
					r.institutionId,
					r.fecha?.toISOString?.() || r.fecha,
					r.horario,
					r.actividad,
					r.modalidad,
					r.status,
					r.asistentesEstimados,
					r.asistentesReales,
					r.campaignId,
					r.sponsorId
				]
					.map(csv)
					.join(',')
			)
			.join('\n');
		return res.send(header + body);
	}

	return res.status(400).json({ error: 'type debe ser institutions o visits' });
});

function csv(v) {
	const s = v == null ? '' : String(v);
	if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
	return s;
}

export default router;
