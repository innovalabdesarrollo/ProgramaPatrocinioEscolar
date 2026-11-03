import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { getDb } from '../db.js';
import { oid, serialize, now } from '../lib/ids.js';
import { requireAuth, requireRoles, ROLES } from '../middleware/auth.js';
import { audit } from '../lib/audit.js';
import { MODULES, DEFAULT_MATRIX, normalizeMatrix } from '../lib/permissions.js';

const router = Router();
const writable = ['admin', 'sistemas'];

router.get('/', requireAuth, requireRoles(...writable, 'directivo'), async (_req, res) => {
	const list = await getDb().collection('users').find({}).sort({ nombre: 1 }).toArray();
	res.json(list.map(serialize));
});

router.get('/roles', requireAuth, (_req, res) => res.json(ROLES));

router.get('/permissions', requireAuth, async (_req, res) => {
	const doc = await getDb().collection('settings').findOne({ _id: 'permission_matrix' });
	const matrix = normalizeMatrix(doc?.matrix);
	res.json({ modules: MODULES, roles: ROLES, matrix, updatedAt: doc?.updatedAt || null });
});

router.put('/permissions', requireAuth, requireRoles(...writable), async (req, res) => {
	const matrix = normalizeMatrix(req.body?.matrix);
	const updatedAt = now();
	await getDb()
		.collection('settings')
		.updateOne(
			{ _id: 'permission_matrix' },
			{ $set: { matrix, updatedAt }, $setOnInsert: { createdAt: updatedAt } },
			{ upsert: true }
		);
	await audit(req, 'update', 'permission_matrix', 'permission_matrix', { roles: Object.keys(matrix) });
	res.json({ modules: MODULES, roles: ROLES, matrix, updatedAt });
});

router.post('/permissions/reset', requireAuth, requireRoles(...writable), async (req, res) => {
	const matrix = structuredClone(DEFAULT_MATRIX);
	const updatedAt = now();
	await getDb()
		.collection('settings')
		.updateOne(
			{ _id: 'permission_matrix' },
			{ $set: { matrix, updatedAt }, $setOnInsert: { createdAt: updatedAt } },
			{ upsert: true }
		);
	await audit(req, 'reset', 'permission_matrix', 'permission_matrix');
	res.json({ modules: MODULES, roles: ROLES, matrix, updatedAt });
});

router.post('/', requireAuth, requireRoles(...writable), async (req, res) => {
	const { nombre, email, area, rol, password } = req.body || {};
	if (!nombre || !email || !rol || !password) {
		return res.status(400).json({ error: 'nombre, email, rol y password requeridos' });
	}
	if (!ROLES[rol]) return res.status(400).json({ error: 'Rol inválido' });
	const emailNorm = String(email).trim().toLowerCase();
	const exists = await getDb().collection('users').findOne({ email: emailNorm });
	if (exists) return res.status(409).json({ error: 'Ya existe un usuario con ese correo' });

	const doc = {
		nombre: String(nombre).trim(),
		email: emailNorm,
		area: String(area || '').trim(),
		rol,
		passwordHash: await bcrypt.hash(String(password), 10),
		activo: true,
		ultimoAcceso: null,
		createdAt: now(),
		updatedAt: now()
	};
	const { insertedId } = await getDb().collection('users').insertOne(doc);
	await audit(req, 'create', 'user', insertedId, { email: emailNorm, rol });
	res.status(201).json(serialize({ ...doc, _id: insertedId }));
});

router.patch('/:id', requireAuth, requireRoles(...writable), async (req, res) => {
	const id = oid(req.params.id);
	if (!id) return res.status(400).json({ error: 'id inválido' });
	const user = await getDb().collection('users').findOne({ _id: id });
	if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

	const patch = { updatedAt: now() };
	for (const k of ['nombre', 'area', 'rol']) {
		if (req.body?.[k] !== undefined) patch[k] = String(req.body[k]).trim();
	}
	if (req.body?.rol && !ROLES[req.body.rol]) return res.status(400).json({ error: 'Rol inválido' });
	if (typeof req.body?.activo === 'boolean') patch.activo = req.body.activo;
	if (req.body?.password) patch.passwordHash = await bcrypt.hash(String(req.body.password), 10);

	await getDb().collection('users').updateOne({ _id: id }, { $set: patch });
	await audit(req, 'update', 'user', id, patch);
	const updated = await getDb().collection('users').findOne({ _id: id });
	res.json(serialize(updated));
});

export default router;
