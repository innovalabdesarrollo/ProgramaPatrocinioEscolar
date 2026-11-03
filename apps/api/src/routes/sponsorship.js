import { Router } from 'express';
import { getDb } from '../db.js';
import { oid, serialize, now } from '../lib/ids.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { audit } from '../lib/audit.js';

const router = Router();
const editors = ['admin', 'relaciones', 'admin_apoyos'];

// —— Sponsors / Donantes ——
router.get('/sponsors', requireAuth, async (_req, res) => {
	const list = await getDb().collection('sponsors').find({}).sort({ nombre: 1 }).toArray();
	res.json(list.map(serialize));
});

router.post('/sponsors', requireAuth, requireRoles(...editors), async (req, res) => {
	const b = req.body || {};
	if (!b.nombre || !b.tipo) return res.status(400).json({ error: 'nombre y tipo requeridos' });
	const doc = {
		tipo: String(b.tipo), // persona | organizacion | donante
		nombre: String(b.nombre).trim(),
		personaContacto: String(b.personaContacto || '').trim(),
		email: String(b.email || '').trim(),
		telefono: String(b.telefono || '').trim(),
		estaActivo: b.estaActivo !== false,
		esDonante: Boolean(b.esDonante),
		createdAt: now(),
		updatedAt: now()
	};
	const { insertedId } = await getDb().collection('sponsors').insertOne(doc);
	await audit(req, 'create', 'sponsor', insertedId);
	res.status(201).json(serialize({ ...doc, _id: insertedId }));
});

router.patch('/sponsors/:id', requireAuth, requireRoles(...editors), async (req, res) => {
	const id = oid(req.params.id);
	if (!id) return res.status(400).json({ error: 'id inválido' });
	const patch = { updatedAt: now() };
	for (const k of ['tipo', 'nombre', 'personaContacto', 'email', 'telefono']) {
		if (req.body?.[k] !== undefined) patch[k] = String(req.body[k]).trim();
	}
	if (typeof req.body?.estaActivo === 'boolean') patch.estaActivo = req.body.estaActivo;
	if (typeof req.body?.esDonante === 'boolean') patch.esDonante = req.body.esDonante;
	await getDb().collection('sponsors').updateOne({ _id: id }, { $set: patch });
	await audit(req, 'update', 'sponsor', id, patch);
	res.json(serialize(await getDb().collection('sponsors').findOne({ _id: id })));
});

// —— Campañas ——
router.get('/campaigns', requireAuth, async (_req, res) => {
	const list = await getDb().collection('campaigns').find({}).sort({ fechaInicio: -1 }).toArray();
	res.json(list.map(serialize));
});

router.post('/campaigns', requireAuth, requireRoles(...editors), async (req, res) => {
	const b = req.body || {};
	if (!b.nombre || !b.fechaInicio) return res.status(400).json({ error: 'nombre y fechaInicio requeridos' });
	const doc = {
		nombre: String(b.nombre).trim(),
		descripcion: String(b.descripcion || '').trim(),
		fechaInicio: new Date(b.fechaInicio),
		fechaFin: b.fechaFin ? new Date(b.fechaFin) : null,
		metaFinanciera: Number(b.metaFinanciera) || 0,
		metaAtencion: Number(b.metaAtencion) || 0,
		estado: String(b.estado || 'activa'),
		createdAt: now(),
		updatedAt: now()
	};
	const { insertedId } = await getDb().collection('campaigns').insertOne(doc);
	await audit(req, 'create', 'campaign', insertedId);
	res.status(201).json(serialize({ ...doc, _id: insertedId }));
});

router.patch('/campaigns/:id', requireAuth, requireRoles(...editors), async (req, res) => {
	const id = oid(req.params.id);
	if (!id) return res.status(400).json({ error: 'id inválido' });
	const patch = { updatedAt: now() };
	for (const k of ['nombre', 'descripcion', 'estado']) {
		if (req.body?.[k] !== undefined) patch[k] = String(req.body[k]).trim();
	}
	if (req.body?.fechaInicio) patch.fechaInicio = new Date(req.body.fechaInicio);
	if (req.body?.fechaFin !== undefined) patch.fechaFin = req.body.fechaFin ? new Date(req.body.fechaFin) : null;
	if (req.body?.metaFinanciera !== undefined) patch.metaFinanciera = Number(req.body.metaFinanciera) || 0;
	if (req.body?.metaAtencion !== undefined) patch.metaAtencion = Number(req.body.metaAtencion) || 0;
	await getDb().collection('campaigns').updateOne({ _id: id }, { $set: patch });
	await audit(req, 'update', 'campaign', id, patch);
	res.json(serialize(await getDb().collection('campaigns').findOne({ _id: id })));
});

// —— Programas ——
router.get('/programs', requireAuth, async (_req, res) => {
	const list = await getDb().collection('programs').find({}).sort({ nombre: 1 }).toArray();
	res.json(list.map(serialize));
});

router.post('/programs', requireAuth, requireRoles(...editors), async (req, res) => {
	const b = req.body || {};
	if (!b.nombre || !b.modalidadVisita || !b.fechaInicio) {
		return res.status(400).json({ error: 'nombre, modalidadVisita y fechaInicio requeridos' });
	}
	const doc = {
		nombre: String(b.nombre).trim(),
		descripcion: String(b.descripcion || '').trim(),
		modalidadVisita: String(b.modalidadVisita).trim(),
		objetivoAtencion: String(b.objetivoAtencion || '').trim(),
		metaAtencion: Number(b.metaAtencion) || 0,
		fechaInicio: new Date(b.fechaInicio),
		fechaFin: b.fechaFin ? new Date(b.fechaFin) : null,
		createdAt: now(),
		updatedAt: now()
	};
	const { insertedId } = await getDb().collection('programs').insertOne(doc);
	await audit(req, 'create', 'program', insertedId);
	res.status(201).json(serialize({ ...doc, _id: insertedId }));
});

// —— Compromisos ——
router.get('/commitments', requireAuth, async (_req, res) => {
	const list = await getDb().collection('commitments').find({}).sort({ fechaCompromiso: -1 }).toArray();
	res.json(list.map(serialize));
});

router.post('/commitments', requireAuth, requireRoles(...editors), async (req, res) => {
	const b = req.body || {};
	if (!b.programaApoyoId || !b.patrocinadorNombre || !b.descripcion || !b.fechaCompromiso) {
		return res.status(400).json({ error: 'Campos requeridos incompletos' });
	}
	const doc = {
		programaApoyoId: String(b.programaApoyoId),
		sponsorId: b.sponsorId ? String(b.sponsorId) : null,
		patrocinadorNombre: String(b.patrocinadorNombre).trim(),
		descripcion: String(b.descripcion).trim(),
		montoComprometido: Number(b.montoComprometido) || 0,
		fechaCompromiso: new Date(b.fechaCompromiso),
		fechaCumplimiento: b.fechaCumplimiento ? new Date(b.fechaCumplimiento) : null,
		estado: String(b.estado || 'pendiente'),
		createdAt: now(),
		updatedAt: now()
	};
	const { insertedId } = await getDb().collection('commitments').insertOne(doc);
	await audit(req, 'create', 'commitment', insertedId);
	res.status(201).json(serialize({ ...doc, _id: insertedId }));
});

// —— Apoyos otorgados ——
router.get('/supports', requireAuth, async (req, res) => {
	const q = {};
	if (req.query.institutionId) q.institutionId = String(req.query.institutionId);
	const list = await getDb().collection('supports').find(q).sort({ fechaOtorgamiento: -1 }).toArray();
	res.json(list.map(serialize));
});

router.post('/supports', requireAuth, requireRoles(...editors), async (req, res) => {
	const b = req.body || {};
	if (!b.programaApoyoId || !b.institutionId || !b.tipoBeneficio || !b.fechaOtorgamiento) {
		return res.status(400).json({ error: 'Campos requeridos incompletos' });
	}
	const doc = {
		programaApoyoId: String(b.programaApoyoId),
		compromisoPatrocinioId: b.compromisoPatrocinioId ? String(b.compromisoPatrocinioId) : null,
		institutionId: String(b.institutionId),
		visitaId: b.visitaId ? String(b.visitaId) : null,
		tipoBeneficio: String(b.tipoBeneficio).trim(),
		montoOtorgado: Number(b.montoOtorgado) || 0,
		fechaOtorgamiento: new Date(b.fechaOtorgamiento),
		validado: Boolean(b.validado),
		createdAt: now(),
		updatedAt: now()
	};
	const { insertedId } = await getDb().collection('supports').insertOne(doc);
	await audit(req, 'create', 'support', insertedId);
	res.status(201).json(serialize({ ...doc, _id: insertedId }));
});

router.patch('/supports/:id', requireAuth, requireRoles(...editors), async (req, res) => {
	const id = oid(req.params.id);
	if (!id) return res.status(400).json({ error: 'id inválido' });
	const patch = { updatedAt: now() };
	if (typeof req.body?.validado === 'boolean') patch.validado = req.body.validado;
	if (req.body?.tipoBeneficio) patch.tipoBeneficio = String(req.body.tipoBeneficio).trim();
	if (req.body?.montoOtorgado !== undefined) patch.montoOtorgado = Number(req.body.montoOtorgado) || 0;
	await getDb().collection('supports').updateOne({ _id: id }, { $set: patch });
	await audit(req, 'update', 'support', id, patch);
	res.json(serialize(await getDb().collection('supports').findOne({ _id: id })));
});

export default router;
