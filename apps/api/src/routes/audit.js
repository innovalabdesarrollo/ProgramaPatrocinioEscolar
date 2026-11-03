import { Router } from 'express';
import { getDb } from '../db.js';
import { serialize } from '../lib/ids.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, requireRoles('admin', 'sistemas', 'directivo'), async (req, res) => {
	const q = {};
	if (req.query.entity) q.entity = String(req.query.entity);
	if (req.query.userEmail) q.userEmail = String(req.query.userEmail);
	const list = await getDb().collection('audit').find(q).sort({ at: -1 }).limit(200).toArray();
	res.json(list.map(serialize));
});

export default router;
