import { Router } from 'express';
import { getDb } from '../db.js';
import { oid, serialize, now } from '../lib/ids.js';
import { requireAuth, requireRoles } from '../middleware/auth.js';
import { audit } from '../lib/audit.js';

const router = Router();

/** Regla simple: más días en espera → mayor urgencia (prioridad numérica menor = primero). */
export function suggestedPriority(daysWaiting) {
	const d = Number(daysWaiting) || 0;
	if (d >= 30) return 1;
	if (d >= 14) return 2;
	if (d >= 7) return 3;
	return 4;
}

function daysSince(date) {
	if (!date) return 0;
	const t = new Date(date).getTime();
	if (Number.isNaN(t)) return 0;
	return Math.max(0, Math.floor((Date.now() - t) / 86400000));
}

async function enrichWaitlist(rows) {
	const ids = [...new Set(rows.map((r) => r.institutionId).filter(Boolean))];
	const oids = ids.map((id) => oid(id)).filter(Boolean);
	const institutions = oids.length
		? await getDb()
				.collection('institutions')
				.find({ _id: { $in: oids } })
				.toArray()
		: [];
	const byId = Object.fromEntries(institutions.map((i) => [String(i._id), i]));

	return rows.map((row) => {
		const inst = row.institutionId ? byId[String(row.institutionId)] : null;
		const daysWaiting = daysSince(row.requestDate);
		const suggested = suggestedPriority(daysWaiting);
		return {
			...serialize(row),
			institutionNombre: inst?.nombre || row.institutionNombre || '—',
			nivelEducativo: inst?.nivelEducativo || '',
			zona: inst?.zona || '',
			daysWaiting,
			suggestedPriority: suggested,
			priorityOutdated: Number(row.priority) !== suggested
		};
	});
}

function sortEnriched(list, sort) {
	const mode = String(sort || 'priority');
	const copy = [...list];
	if (mode === 'wait') {
		copy.sort((a, b) => b.daysWaiting - a.daysWaiting || a.priority - b.priority);
	} else if (mode === 'suggested') {
		copy.sort(
			(a, b) =>
				a.suggestedPriority - b.suggestedPriority || b.daysWaiting - a.daysWaiting
		);
	} else {
		// priority: menor número primero, luego más días esperando
		copy.sort((a, b) => a.priority - b.priority || b.daysWaiting - a.daysWaiting);
	}
	return copy;
}

router.get('/', requireAuth, async (req, res) => {
	const q = {};
	if (req.query.status) q.status = String(req.query.status);
	else if (req.query.all !== '1' && req.query.all !== 'true') q.status = 'activa';

	const rows = await getDb().collection('waitlist').find(q).toArray();
	const enriched = await enrichWaitlist(rows);
	res.json(sortEnriched(enriched, req.query.sort));
});

router.get('/rules', requireAuth, (_req, res) => {
	res.json({
		description: 'Prioridad sugerida según días en espera (1 = más urgente)',
		rules: [
			{ minDays: 30, priority: 1 },
			{ minDays: 14, priority: 2 },
			{ minDays: 7, priority: 3 },
			{ minDays: 0, priority: 4 }
		]
	});
});

/** Aplica prioridades sugeridas a entradas activas (no pisa las ya alineadas). */
router.post('/recalculate', requireAuth, requireRoles('admin', 'visitas'), async (req, res) => {
	const force = req.body?.force === true;
	const rows = await getDb().collection('waitlist').find({ status: 'activa' }).toArray();
	let updated = 0;
	for (const row of rows) {
		const days = daysSince(row.requestDate);
		const suggested = suggestedPriority(days);
		if (!force && Number(row.priority) === suggested) continue;
		await getDb()
			.collection('waitlist')
			.updateOne(
				{ _id: row._id },
				{ $set: { priority: suggested, updatedAt: now(), prioritySource: 'rules' } }
			);
		updated += 1;
	}
	await audit(req, 'recalculate', 'waitlist', null, { updated, force: !!force });
	const refreshed = await enrichWaitlist(
		await getDb().collection('waitlist').find({ status: 'activa' }).toArray()
	);
	res.json({ updated, items: sortEnriched(refreshed, 'priority') });
});

router.patch('/:id', requireAuth, requireRoles('admin', 'visitas'), async (req, res) => {
	const id = oid(req.params.id);
	if (!id) return res.status(400).json({ error: 'id inválido' });
	const patch = { updatedAt: now() };
	if (req.body?.priority !== undefined) {
		patch.priority = Number(req.body.priority) || 3;
		patch.prioritySource = 'manual';
	}
	if (req.body?.status) patch.status = String(req.body.status);
	if (req.body?.notes !== undefined) patch.notes = String(req.body.notes);
	await getDb().collection('waitlist').updateOne({ _id: id }, { $set: patch });
	await audit(req, 'update', 'waitlist', id, patch);
	const row = await getDb().collection('waitlist').findOne({ _id: id });
	const [enriched] = await enrichWaitlist([row]);
	res.json(enriched);
});

export default router;
