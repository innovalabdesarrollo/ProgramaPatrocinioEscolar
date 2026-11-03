import { Router } from 'express';
import { getDb } from '../db.js';
import { oid, serialize, now } from '../lib/ids.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { audit } from '../lib/audit.js';

const router = Router();
const managers = ['admin', 'visitas', 'sistemas'];

export const REQUEST_STATUS = [
	'recibida',
	'en_revision',
	'pendiente_contacto',
	'lista_espera',
	'visita_programada',
	'visita_confirmada',
	'visita_realizada',
	'cancelada'
];

router.get('/meta/statuses', requireAuth, (_req, res) => res.json(REQUEST_STATUS));

router.get('/', requireAuth, async (req, res) => {
	const q = {};
	if (req.query.status) q.status = String(req.query.status);
	if (req.query.institutionId) q.institutionId = String(req.query.institutionId);
	const list = await getDb().collection('requests').find(q).sort({ createdAt: -1 }).limit(500).toArray();
	res.json(list.map(serialize));
});

router.post('/', requireAuth, requireRoles(...managers, 'institucion', 'relaciones'), async (req, res) => {
	const b = req.body || {};
	if (!b.institutionId && !b.institutionNombre) {
		return res.status(400).json({ error: 'institutionId o institutionNombre requerido' });
	}
	const doc = {
		institutionId: b.institutionId ? String(b.institutionId) : null,
		institutionNombre: String(b.institutionNombre || '').trim(),
		solicitanteNombre: String(b.solicitanteNombre || '').trim(),
		solicitanteEmail: String(b.solicitanteEmail || '').trim(),
		solicitanteTelefono: String(b.solicitanteTelefono || '').trim(),
		nivelEducativo: String(b.nivelEducativo || '').trim(),
		cantidadEstimada: Number(b.cantidadEstimada) || 0,
		modalidadPreferida: String(b.modalidadPreferida || '').trim(),
		fechaPreferida: b.fechaPreferida ? new Date(b.fechaPreferida) : null,
		notas: String(b.notas || '').trim(),
		status: 'recibida',
		createdAt: now(),
		updatedAt: now(),
		createdBy: req.user.id
	};
	const { insertedId } = await getDb().collection('requests').insertOne(doc);
	await audit(req, 'create', 'request', insertedId);
	res.status(201).json(serialize({ ...doc, _id: insertedId }));
});

router.patch('/:id', requireAuth, requireRoles(...managers), async (req, res) => {
	const id = oid(req.params.id);
	if (!id) return res.status(400).json({ error: 'id inválido' });
	const existing = await getDb().collection('requests').findOne({ _id: id });
	if (!existing) return res.status(404).json({ error: 'No encontrada' });

	const patch = { updatedAt: now() };
	if (req.body?.status) {
		if (!REQUEST_STATUS.includes(req.body.status)) {
			return res.status(400).json({ error: 'status inválido' });
		}
		patch.status = req.body.status;
	}
	for (const k of ['notas', 'solicitanteNombre', 'solicitanteEmail', 'solicitanteTelefono', 'modalidadPreferida']) {
		if (req.body?.[k] !== undefined) patch[k] = String(req.body[k]).trim();
	}
	if (req.body?.cantidadEstimada !== undefined) patch.cantidadEstimada = Number(req.body.cantidadEstimada) || 0;
	if (req.body?.fechaPreferida !== undefined) {
		patch.fechaPreferida = req.body.fechaPreferida ? new Date(req.body.fechaPreferida) : null;
	}
	/** Mensaje de lo que falta por complementar (lado institución / público) */
	if (req.body?.infoRequested !== undefined) {
		patch.infoRequested = String(req.body.infoRequested).trim();
		if (patch.infoRequested && !patch.status) patch.status = 'pendiente_contacto';
		if (patch.infoRequested) patch.infoRequestedAt = now();
	}
	if (req.body?.clearInfoRequest === true) {
		patch.infoRequested = '';
		patch.infoRequestedAt = null;
	}

	await getDb().collection('requests').updateOne({ _id: id }, { $set: patch });

	if (patch.status === 'lista_espera') {
		const wait = {
			institutionId: existing.institutionId,
			requestId: String(id),
			requestDate: now(),
			priority: Number(req.body?.priority) || 3,
			status: 'activa',
			notes: String(req.body?.waitNotes || ''),
			createdAt: now()
		};
		await getDb().collection('waitlist').insertOne(wait);
		if (existing.institutionId) {
			await getDb()
				.collection('institutions')
				.updateOne(
					{ _id: oid(existing.institutionId) },
					{ $set: { statusAtencion: 'en_espera', updatedAt: now() } }
				);
		}
	}

	await audit(req, 'update', 'request', id, patch);
	res.json(serialize(await getDb().collection('requests').findOne({ _id: id })));
});

export default router;
