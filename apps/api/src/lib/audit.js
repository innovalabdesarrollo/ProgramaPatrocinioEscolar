import { getDb } from '../db.js';
import { now } from './ids.js';

export async function audit(req, action, entity, entityId, detail = {}) {
	try {
		await getDb().collection('audit').insertOne({
			userId: req.user?.id || null,
			userEmail: req.user?.email || null,
			action,
			entity,
			entityId: entityId ? String(entityId) : null,
			detail,
			at: now()
		});
	} catch (err) {
		console.error('audit failed', err.message);
	}
}
