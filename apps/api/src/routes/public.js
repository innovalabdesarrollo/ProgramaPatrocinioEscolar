import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db.js';
import { serialize, now } from '../lib/ids.js';

const router = Router();

function publicRequestView(r) {
	return {
		id: String(r._id),
		institutionNombre: r.institutionNombre,
		status: r.status,
		createdAt: r.createdAt,
		fechaPreferida: r.fechaPreferida,
		cantidadEstimada: r.cantidadEstimada,
		modalidadPreferida: r.modalidadPreferida,
		solicitanteNombre: r.solicitanteNombre,
		solicitanteTelefono: r.solicitanteTelefono,
		nivelEducativo: r.nivelEducativo,
		notas: r.notas || '',
		infoRequested: r.infoRequested || '',
		needsComplement: Boolean(r.infoRequested) || r.status === 'pendiente_contacto'
	};
}

/** Formulario externo: registro/actualización + solicitud (sin auth, sujeto a revisión) */
router.post('/institution-request', async (req, res) => {
	const b = req.body || {};
	if (!b.nombre || !b.contactoEmail) {
		return res.status(400).json({ error: 'nombre y contactoEmail requeridos' });
	}

	const institutionDoc = {
		nombre: String(b.nombre).trim(),
		tipo: String(b.tipo || 'escuela').trim(),
		nivelEducativo: String(b.nivelEducativo || '').trim(),
		turno: String(b.turno || '').trim(),
		direccion: String(b.direccion || '').trim(),
		ciudad: String(b.ciudad || '').trim(),
		estado: String(b.estado || '').trim(),
		codigoPostal: String(b.codigoPostal || '').trim(),
		zona: String(b.zona || '').trim(),
		contactoNombre: String(b.contactoNombre || '').trim(),
		contactoEmail: String(b.contactoEmail).trim().toLowerCase(),
		contactoTelefono: String(b.contactoTelefono || '').trim(),
		latitud: b.latitud !== undefined && b.latitud !== '' ? Number(b.latitud) : null,
		longitud: b.longitud !== undefined && b.longitud !== '' ? Number(b.longitud) : null,
		statusAtencion: 'pendiente_revision',
		validated: false,
		notas: String(b.notas || '').trim(),
		createdAt: now(),
		updatedAt: now(),
		source: 'formulario_publico'
	};

	const { insertedId } = await getDb().collection('institutions').insertOne(institutionDoc);

	let request = null;
	if (b.enviarSolicitud) {
		const reqDoc = {
			institutionId: String(insertedId),
			institutionNombre: institutionDoc.nombre,
			solicitanteNombre: institutionDoc.contactoNombre,
			solicitanteEmail: institutionDoc.contactoEmail,
			solicitanteTelefono: institutionDoc.contactoTelefono,
			nivelEducativo: institutionDoc.nivelEducativo,
			cantidadEstimada: Number(b.cantidadEstimada) || 0,
			modalidadPreferida: String(b.modalidadPreferida || '').trim(),
			fechaPreferida: b.fechaPreferida ? new Date(b.fechaPreferida) : null,
			notas: String(b.solicitudNotas || '').trim(),
			status: 'recibida',
			createdAt: now(),
			updatedAt: now(),
			createdBy: null,
			source: 'formulario_publico'
		};
		const r = await getDb().collection('requests').insertOne(reqDoc);
		request = serialize({ ...reqDoc, _id: r.insertedId });
	}

	res.status(201).json({
		ok: true,
		message: 'Registro recibido. Queda pendiente de revisión interna.',
		institution: serialize({ ...institutionDoc, _id: insertedId }),
		request
	});
});

router.get('/request-status', async (req, res) => {
	const email = String(req.query.email || '')
		.trim()
		.toLowerCase();
	const code = String(req.query.id || '').trim();
	if (!email && !code) return res.status(400).json({ error: 'email o id requerido' });

	const q = {};
	if (code) {
		try {
			q._id = new ObjectId(code);
		} catch {
			return res.status(400).json({ error: 'id inválido' });
		}
		if (email) q.solicitanteEmail = email;
	} else {
		q.solicitanteEmail = email;
	}

	const list = await getDb().collection('requests').find(q).sort({ createdAt: -1 }).limit(20).toArray();
	res.json(list.map(publicRequestView));
});

/**
 * La institución complementa datos de una solicitud (sin auth).
 * Requiere folio + email del solicitante. Sin envío de correo.
 */
router.post('/complement-request', async (req, res) => {
	const b = req.body || {};
	const email = String(b.email || '')
		.trim()
		.toLowerCase();
	let id;
	try {
		id = new ObjectId(String(b.id || ''));
	} catch {
		return res.status(400).json({ error: 'id de solicitud inválido' });
	}
	if (!email) return res.status(400).json({ error: 'email requerido' });

	const existing = await getDb().collection('requests').findOne({ _id: id, solicitanteEmail: email });
	if (!existing) return res.status(404).json({ error: 'Solicitud no encontrada para ese folio y email' });

	const canEdit =
		Boolean(existing.infoRequested) ||
		['recibida', 'en_revision', 'pendiente_contacto'].includes(existing.status);
	if (!canEdit) {
		return res.status(409).json({
			error: 'Esta solicitud ya no admite complementos en su estado actual'
		});
	}

	const patch = {
		updatedAt: now(),
		infoCompletedAt: now(),
		infoRequested: '',
		infoRequestedAt: null,
		status: existing.status === 'pendiente_contacto' ? 'en_revision' : existing.status
	};

	for (const k of ['solicitanteNombre', 'solicitanteTelefono', 'modalidadPreferida', 'nivelEducativo', 'notas']) {
		if (b[k] !== undefined) patch[k] = String(b[k]).trim();
	}
	if (b.cantidadEstimada !== undefined) patch.cantidadEstimada = Number(b.cantidadEstimada) || 0;
	if (b.fechaPreferida !== undefined) {
		patch.fechaPreferida = b.fechaPreferida ? new Date(b.fechaPreferida) : null;
	}
	if (b.complementNotes !== undefined) {
		const extra = String(b.complementNotes).trim();
		if (extra) {
			patch.notas = [existing.notas, `[Complemento] ${extra}`].filter(Boolean).join('\n');
		}
	}

	await getDb().collection('requests').updateOne({ _id: id }, { $set: patch });
	const updated = await getDb().collection('requests').findOne({ _id: id });
	res.json({
		ok: true,
		message: 'Información actualizada. Queda en revisión interna.',
		request: publicRequestView(updated)
	});
});

/** Listado público por email: instituciones, solicitudes y visitas vinculadas. */
router.get('/my-records', async (req, res) => {
	const email = String(req.query.email || '')
		.trim()
		.toLowerCase();
	if (!email) return res.status(400).json({ error: 'email requerido' });
	const db = getDb();

	const institutions = await db
		.collection('institutions')
		.find({ contactoEmail: email, discarded: { $ne: true } })
		.project({
			nombre: 1,
			tipo: 1,
			nivelEducativo: 1,
			turno: 1,
			direccion: 1,
			ciudad: 1,
			estado: 1,
			zona: 1,
			contactoNombre: 1,
			contactoEmail: 1,
			contactoTelefono: 1,
			statusAtencion: 1,
			validated: 1,
			pendingPublicUpdate: 1
		})
		.limit(20)
		.toArray();

	const requests = await db
		.collection('requests')
		.find({ solicitanteEmail: email })
		.sort({ createdAt: -1 })
		.limit(20)
		.toArray();

	const instIds = institutions.map((i) => String(i._id));
	const visitQ = {
		$or: [
			...(instIds.length ? [{ institutionId: { $in: instIds } }] : []),
			{ solicitanteEmail: email }
		]
	};
	if (!instIds.length) {
		visitQ.$or = [{ solicitanteEmail: email }];
	}
	const visits = await db
		.collection('visits')
		.find(visitQ)
		.sort({ fecha: -1 })
		.limit(30)
		.toArray();

	res.json({
		institutions: institutions.map((i) => ({
			id: String(i._id),
			nombre: i.nombre,
			tipo: i.tipo,
			nivelEducativo: i.nivelEducativo,
			turno: i.turno,
			direccion: i.direccion,
			ciudad: i.ciudad,
			estado: i.estado,
			zona: i.zona,
			contactoNombre: i.contactoNombre,
			contactoEmail: i.contactoEmail,
			contactoTelefono: i.contactoTelefono,
			statusAtencion: i.statusAtencion,
			validated: i.validated,
			pendingPublicUpdate: Boolean(i.pendingPublicUpdate)
		})),
		requests: requests.map(publicRequestView),
		visits: visits.map((v) => ({
			id: String(v._id),
			institutionId: v.institutionId,
			fecha: v.fecha,
			horario: v.horario,
			actividad: v.actividad,
			modalidad: v.modalidad,
			status: v.status,
			canModify: ['programada', 'confirmada'].includes(v.status)
		}))
	});
});

/**
 * Actualización de datos de institución existente (sujeta a revisión interna).
 * Requiere email del contacto registrado.
 */
router.post('/update-institution', async (req, res) => {
	const b = req.body || {};
	const email = String(b.email || '')
		.trim()
		.toLowerCase();
	let id;
	try {
		id = new ObjectId(String(b.institutionId || ''));
	} catch {
		return res.status(400).json({ error: 'institutionId inválido' });
	}
	if (!email) return res.status(400).json({ error: 'email requerido' });

	const db = getDb();
	const existing = await db.collection('institutions').findOne({
		_id: id,
		contactoEmail: email,
		discarded: { $ne: true }
	});
	if (!existing) {
		return res.status(404).json({ error: 'Institución no encontrada para ese email' });
	}

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
		'contactoTelefono'
	];
	const changes = {};
	const patch = {};
	for (const k of fields) {
		if (b[k] === undefined) continue;
		const next = String(b[k]).trim();
		const prev = existing[k] == null ? '' : String(existing[k]);
		if (next !== prev) {
			changes[k] = { from: existing[k] ?? null, to: next };
			patch[k] = next;
		}
	}
	if (b.latitud !== undefined && b.latitud !== '') {
		const lat = Number(b.latitud);
		if (!Number.isNaN(lat) && lat !== existing.latitud) {
			changes.latitud = { from: existing.latitud ?? null, to: lat };
			patch.latitud = lat;
		}
	}
	if (b.longitud !== undefined && b.longitud !== '') {
		const lng = Number(b.longitud);
		if (!Number.isNaN(lng) && lng !== existing.longitud) {
			changes.longitud = { from: existing.longitud ?? null, to: lng };
			patch.longitud = lng;
		}
	}

	if (!Object.keys(changes).length) {
		return res.status(400).json({ error: 'No hay cambios para enviar' });
	}

	Object.assign(patch, {
		updatedAt: now(),
		validated: false,
		pendingPublicUpdate: true,
		statusAtencion:
			existing.statusAtencion === 'descartada' ? 'pendiente_revision' : existing.statusAtencion,
		publicUpdateAt: now(),
		publicUpdateNote: String(b.motivo || '').trim()
	});
	if (existing.validated) {
		patch.statusAtencion = 'pendiente_revision';
	}

	await db.collection('institutions').updateOne({ _id: id }, { $set: patch });
	await db.collection('audit').insertOne({
		userId: null,
		userEmail: email,
		action: 'public_update',
		entity: 'institution',
		entityId: String(id),
		detail: { changes, source: 'formulario_publico', motivo: patch.publicUpdateNote },
		at: now()
	});

	const updated = await db.collection('institutions').findOne({ _id: id });
	res.json({
		ok: true,
		message: 'Cambios recibidos. Quedan sujetos a revisión interna.',
		institution: {
			id: String(updated._id),
			nombre: updated.nombre,
			statusAtencion: updated.statusAtencion,
			pendingPublicUpdate: true,
			validated: updated.validated
		}
	});
});

/**
 * Solicitud de modificación o cancelación de visita desde el externo.
 * Verifica email contra contacto de la institución.
 */
router.post('/visit-action', async (req, res) => {
	const b = req.body || {};
	const email = String(b.email || '')
		.trim()
		.toLowerCase();
	const action = String(b.action || '').trim();
	if (!email) return res.status(400).json({ error: 'email requerido' });
	if (action !== 'cancel' && action !== 'reschedule') {
		return res.status(400).json({ error: 'action debe ser cancel o reschedule' });
	}
	let visitId;
	try {
		visitId = new ObjectId(String(b.visitId || ''));
	} catch {
		return res.status(400).json({ error: 'visitId inválido' });
	}

	const db = getDb();
	const visit = await db.collection('visits').findOne({ _id: visitId });
	if (!visit) return res.status(404).json({ error: 'Visita no encontrada' });
	if (!['programada', 'confirmada'].includes(visit.status)) {
		return res.status(409).json({ error: 'Solo visitas programadas o confirmadas admiten cambio' });
	}

	let allowed = false;
	if (visit.solicitanteEmail && String(visit.solicitanteEmail).toLowerCase() === email) {
		allowed = true;
	} else if (visit.institutionId) {
		let instOid;
		try {
			instOid = new ObjectId(String(visit.institutionId));
		} catch {
			instOid = null;
		}
		if (instOid) {
			const inst = await db.collection('institutions').findOne({ _id: instOid });
			if (inst && String(inst.contactoEmail || '').toLowerCase() === email) allowed = true;
		}
	}
	if (!allowed) return res.status(403).json({ error: 'Email no autorizado para esta visita' });

	const motivo = String(b.motivo || '').trim();
	const historyEntry = {
		at: now(),
		by: email,
		source: 'formulario_publico',
		action,
		from: {
			fecha: visit.fecha,
			horario: visit.horario,
			status: visit.status
		}
	};

	if (action === 'cancel') {
		const patch = {
			status: 'cancelada',
			updatedAt: now(),
			cancelReason: motivo || 'Cancelación solicitada por la institución',
			cancelledAt: now(),
			cancelledByPublic: true
		};
		historyEntry.to = { status: 'cancelada' };
		await db.collection('visits').updateOne(
			{ _id: visitId },
			{ $set: patch, $push: { scheduleHistory: historyEntry } }
		);
		await db.collection('audit').insertOne({
			userId: null,
			userEmail: email,
			action: 'public_cancel',
			entity: 'visit',
			entityId: String(visitId),
			detail: { motivo },
			at: now()
		});
		return res.json({
			ok: true,
			message: 'Visita cancelada a solicitud de la institución.',
			visit: { id: String(visitId), status: 'cancelada' }
		});
	}

	if (!b.nuevaFecha) return res.status(400).json({ error: 'nuevaFecha requerida para reprogramar' });
	const nuevaFecha = new Date(b.nuevaFecha);
	if (Number.isNaN(nuevaFecha.getTime())) return res.status(400).json({ error: 'nuevaFecha inválida' });
	const nuevoHorario = b.horario !== undefined ? String(b.horario).trim() : visit.horario;

	const patch = {
		fecha: nuevaFecha,
		horario: nuevoHorario,
		status: 'programada',
		updatedAt: now(),
		rescheduleNote: motivo || 'Reprogramación solicitada por la institución',
		rescheduledByPublic: true
	};
	historyEntry.to = { fecha: nuevaFecha, horario: nuevoHorario, status: 'programada' };
	await db.collection('visits').updateOne(
		{ _id: visitId },
		{ $set: patch, $push: { scheduleHistory: historyEntry } }
	);
	await db.collection('audit').insertOne({
		userId: null,
		userEmail: email,
		action: 'public_reschedule',
		entity: 'visit',
		entityId: String(visitId),
		detail: { motivo, nuevaFecha, horario: nuevoHorario },
		at: now()
	});

	res.json({
		ok: true,
		message: 'Visita reprogramada. El museo puede confirmar el nuevo horario.',
		visit: {
			id: String(visitId),
			status: 'programada',
			fecha: nuevaFecha,
			horario: nuevoHorario
		}
	});
});

export default router;
