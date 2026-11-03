import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { getDb } from '../db.js';
import { serialize, now } from '../lib/ids.js';
import { requireAuth, ROLES } from '../middleware/auth.js';
import { audit } from '../lib/audit.js';

const router = Router();
const SESSION_DAYS = 7;

router.post('/login', async (req, res) => {
	const email = String(req.body?.email || '')
		.trim()
		.toLowerCase();
	const password = String(req.body?.password || '');
	if (!email || !password) return res.status(400).json({ error: 'Email y contraseña requeridos' });

	const user = await getDb().collection('users').findOne({ email });
	if (!user || !user.activo) return res.status(401).json({ error: 'Credenciales inválidas' });
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

	const token = nanoid(48);
	const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000);
	await getDb().collection('sessions').insertOne({
		token,
		userId: user._id,
		expiresAt,
		createdAt: now()
	});
	await getDb()
		.collection('users')
		.updateOne({ _id: user._id }, { $set: { ultimoAcceso: now() } });

	req.user = serialize(user);
	await audit(req, 'login', 'user', user._id);

	res.json({ token, user: serialize(user), roles: ROLES });
});

router.post('/logout', requireAuth, async (req, res) => {
	const header = req.headers.authorization || '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : null;
	if (token) await getDb().collection('sessions').deleteOne({ token });
	await audit(req, 'logout', 'user', req.user.id);
	res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
	res.json({ user: req.user, roles: ROLES });
});

export default router;
