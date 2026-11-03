import { Router } from 'express';
import { getDb } from '../db.js';
import { oid, serialize } from '../lib/ids.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/meta', requireAuth, async (_req, res) => {
	const db = getDb();
	const [zonas, turnos, tipos, niveles] = await Promise.all([
		db.collection('institutions').distinct('zona'),
		db.collection('institutions').distinct('turno'),
		db.collection('institutions').distinct('tipo'),
		db.collection('institutions').distinct('nivelEducativo')
	]);
	res.json({
		zonas: zonas.filter(Boolean).sort(),
		turnos: turnos.filter(Boolean).sort(),
		tipos: tipos.filter(Boolean).sort(),
		niveles: niveles.filter(Boolean).sort()
	});
});

/** Resumen agregado de cobertura por zona territorial. */
router.get('/zones', requireAuth, async (req, res) => {
	const db = getDb();
	const match = {
		latitud: { $ne: null, $type: 'number' },
		longitud: { $ne: null, $type: 'number' }
	};
	if (req.query.from || req.query.to || req.query.sponsorId || req.query.campaignId) {
		const vq = {};
		if (req.query.sponsorId) vq.sponsorId = String(req.query.sponsorId);
		if (req.query.campaignId) vq.campaignId = String(req.query.campaignId);
		if (req.query.from || req.query.to) {
			vq.fecha = {};
			if (req.query.from) vq.fecha.$gte = new Date(String(req.query.from));
			if (req.query.to) {
				const end = new Date(String(req.query.to));
				end.setUTCHours(23, 59, 59, 999);
				vq.fecha.$lte = end;
			}
		}
		const visits = await db
			.collection('visits')
			.find(vq)
			.project({ institutionId: 1 })
			.limit(5000)
			.toArray();
		const objectIds = [
			...new Set(visits.map((v) => String(v.institutionId || '')).filter(Boolean))
		]
			.map((id) => oid(id))
			.filter(Boolean);
		if (!objectIds.length) return res.json({ zones: [], total: 0 });
		match._id = { $in: objectIds };
	}

	const rows = await db
		.collection('institutions')
		.aggregate([
			{ $match: match },
			{
				$group: {
					_id: { $ifNull: ['$zona', 'Sin zona'] },
					total: { $sum: 1 },
					beneficiadas: {
						$sum: {
							$cond: [
								{
									$in: [
										'$statusAtencion',
										['beneficiada_patrocinada', 'beneficiada_pagada']
									]
								},
								1,
								0
							]
						}
					},
					enEspera: {
						$sum: { $cond: [{ $eq: ['$statusAtencion', 'en_espera'] }, 1, 0] }
					},
					noAtendidas: {
						$sum: { $cond: [{ $eq: ['$statusAtencion', 'no_atendida'] }, 1, 0] }
					},
					programadas: {
						$sum: { $cond: [{ $eq: ['$statusAtencion', 'programada'] }, 1, 0] }
					},
					latAvg: { $avg: '$latitud' },
					lngAvg: { $avg: '$longitud' }
				}
			},
			{ $sort: { total: -1, _id: 1 } }
		])
		.toArray();

	const zones = rows.map((r) => ({
		zona: r._id,
		total: r.total,
		beneficiadas: r.beneficiadas,
		enEspera: r.enEspera,
		noAtendidas: r.noAtendidas,
		programadas: r.programadas,
		latAvg: r.latAvg,
		lngAvg: r.lngAvg
	}));

	res.json({
		updatedAt: new Date(),
		total: zones.reduce((n, z) => n + z.total, 0),
		zones
	});
});

router.get('/coverage', requireAuth, async (req, res) => {
	const db = getDb();
	const q = {
		latitud: { $ne: null, $type: 'number' },
		longitud: { $ne: null, $type: 'number' }
	};
	if (req.query.status) q.statusAtencion = String(req.query.status);
	if (req.query.nivel) q.nivelEducativo = String(req.query.nivel);
	if (req.query.tipo) q.tipo = String(req.query.tipo);
	if (req.query.zona) {
		const z = String(req.query.zona);
		if (z === '__none__') {
			q.$or = [{ zona: null }, { zona: '' }, { zona: { $exists: false } }];
		} else {
			q.zona = z;
		}
	}
	if (req.query.turno) q.turno = String(req.query.turno);

	const sponsorId = req.query.sponsorId ? String(req.query.sponsorId) : '';
	const campaignId = req.query.campaignId ? String(req.query.campaignId) : '';
	const from = req.query.from ? String(req.query.from) : '';
	const to = req.query.to ? String(req.query.to) : '';

	if (sponsorId || campaignId || from || to) {
		const vq = {};
		if (sponsorId) vq.sponsorId = sponsorId;
		if (campaignId) vq.campaignId = campaignId;
		if (from || to) {
			vq.fecha = {};
			if (from) vq.fecha.$gte = new Date(from);
			if (to) {
				const end = new Date(to);
				end.setUTCHours(23, 59, 59, 999);
				vq.fecha.$lte = end;
			}
		}
		const visits = await db
			.collection('visits')
			.find(vq)
			.project({ institutionId: 1 })
			.limit(5000)
			.toArray();
		const idStrs = [...new Set(visits.map((v) => String(v.institutionId || '')).filter(Boolean))];
		const objectIds = idStrs.map((id) => oid(id)).filter(Boolean);
		if (!objectIds.length) {
			return res.json([]);
		}
		q._id = { $in: objectIds };
	}

	const list = await db.collection('institutions').find(q).limit(2000).toArray();
	res.json(
		list.map((i) => ({
			...serialize(i),
			color: colorForStatus(i.statusAtencion)
		}))
	);
});

function colorForStatus(status) {
	switch (status) {
		case 'beneficiada_patrocinada':
			return '#15803d';
		case 'beneficiada_pagada':
			return '#1d4ed8';
		case 'en_espera':
			return '#ca8a04';
		case 'programada':
			return '#7c3aed';
		case 'pendiente_revision':
			return '#ea580c';
		default:
			return '#64748b';
	}
}

export default router;
