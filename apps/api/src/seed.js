import bcrypt from 'bcryptjs';
import { connectDb, getDb, pingDb } from './db.js';
import { now } from './lib/ids.js';

await connectDb();
const info = await pingDb();
console.log(`Seed en DB ${info.dbName}`);

const db = getDb();
const hash = await bcrypt.hash('admin123', 10);

const users = [
	{
		email: 'admin@museo.local',
		nombre: 'Admin Plataforma',
		area: 'Sistemas',
		rol: 'admin',
		passwordHash: hash,
		activo: true
	},
	{
		email: 'visitas@museo.local',
		nombre: 'Gestor Visitas',
		area: 'Visitas Escolares',
		rol: 'visitas',
		passwordHash: hash,
		activo: true
	},
	{
		email: 'relaciones@museo.local',
		nombre: 'Gestor Relaciones',
		area: 'Relaciones Institucionales',
		rol: 'relaciones',
		passwordHash: hash,
		activo: true
	},
	{
		email: 'directivo@museo.local',
		nombre: 'Directivo',
		area: 'Dirección',
		rol: 'directivo',
		passwordHash: hash,
		activo: true
	}
];

for (const u of users) {
	await db.collection('users').updateOne(
		{ email: u.email },
		{ $set: { ...u, updatedAt: now() }, $setOnInsert: { createdAt: now(), ultimoAcceso: null } },
		{ upsert: true }
	);
}

const institutions = [
	{
		nombre: 'Escuela Primaria Benito Juárez',
		tipo: 'escuela',
		nivelEducativo: 'primaria',
		turno: 'matutino',
		direccion: 'Av. Juárez 120',
		ciudad: 'Ciudad Juárez',
		estado: 'Chihuahua',
		codigoPostal: '32000',
		zona: 'Centro',
		contactoNombre: 'María López',
		contactoEmail: 'maria@escuela.local',
		contactoTelefono: '6561112233',
		latitud: 31.6904,
		longitud: -106.4245,
		statusAtencion: 'beneficiada_patrocinada',
		validated: true
	},
	{
		nombre: 'Secundaria Técnica 45',
		tipo: 'escuela',
		nivelEducativo: 'secundaria',
		turno: 'vespertino',
		direccion: 'Calle Tecnológico 88',
		ciudad: 'Ciudad Juárez',
		estado: 'Chihuahua',
		codigoPostal: '32310',
		zona: 'Norte',
		contactoNombre: 'Juan Pérez',
		contactoEmail: 'juan@sec45.local',
		contactoTelefono: '6562223344',
		latitud: 31.7385,
		longitud: -106.485,
		statusAtencion: 'en_espera',
		validated: true
	},
	{
		nombre: 'Preparatoria Federal 8',
		tipo: 'escuela',
		nivelEducativo: 'preparatoria',
		turno: 'matutino',
		direccion: 'Blvd. Zaragoza 500',
		ciudad: 'Ciudad Juárez',
		estado: 'Chihuahua',
		codigoPostal: '32575',
		zona: 'Sur',
		contactoNombre: 'Ana Ruiz',
		contactoEmail: 'ana@prep8.local',
		contactoTelefono: '6563334455',
		latitud: 31.6542,
		longitud: -106.405,
		statusAtencion: 'no_atendida',
		validated: true
	},
	{
		nombre: 'Asociación Cultural Frontera',
		tipo: 'asociacion',
		nivelEducativo: 'mixto',
		turno: 'completo',
		direccion: 'Calle Comercio 15',
		ciudad: 'Ciudad Juárez',
		estado: 'Chihuahua',
		codigoPostal: '32040',
		zona: 'Centro',
		contactoNombre: 'Luis Ortega',
		contactoEmail: 'luis@frontera.local',
		contactoTelefono: '6564445566',
		latitud: 31.702,
		longitud: -106.45,
		statusAtencion: 'beneficiada_pagada',
		validated: true
	}
];

const instIds = {};
for (const i of institutions) {
	const r = await db.collection('institutions').findOneAndUpdate(
		{ nombre: i.nombre },
		{ $set: { ...i, updatedAt: now() }, $setOnInsert: { createdAt: now(), notas: '' } },
		{ upsert: true, returnDocument: 'after' }
	);
	instIds[i.nombre] = String(r._id);
}

await db.collection('sponsors').updateOne(
	{ nombre: 'Fundación Educativa Norte' },
	{
		$set: {
			tipo: 'organizacion',
			nombre: 'Fundación Educativa Norte',
			personaContacto: 'Carmen Díaz',
			email: 'contacto@fundnorte.local',
			telefono: '6565556677',
			estaActivo: true,
			esDonante: true,
			updatedAt: now()
		},
		$setOnInsert: { createdAt: now() }
	},
	{ upsert: true }
);

const sponsor = await db.collection('sponsors').findOne({ nombre: 'Fundación Educativa Norte' });

await db.collection('campaigns').updateOne(
	{ nombre: 'Patrocinio Escolar 2026' },
	{
		$set: {
			nombre: 'Patrocinio Escolar 2026',
			descripcion: 'Campaña anual de visitas patrocinadas',
			fechaInicio: new Date('2026-01-01'),
			fechaFin: new Date('2026-12-31'),
			metaFinanciera: 500000,
			metaAtencion: 2000,
			estado: 'activa',
			updatedAt: now()
		},
		$setOnInsert: { createdAt: now() }
	},
	{ upsert: true }
);
const campaign = await db.collection('campaigns').findOne({ nombre: 'Patrocinio Escolar 2026' });

await db.collection('programs').updateOne(
	{ nombre: 'Visitas Patrocinadas Museo' },
	{
		$set: {
			nombre: 'Visitas Patrocinadas Museo',
			descripcion: 'Programa de visitas educativas patrocinadas',
			modalidadVisita: 'patrocinada',
			objetivoAtencion: 'Escuelas de bajos recursos',
			metaAtencion: 1500,
			fechaInicio: new Date('2026-01-01'),
			fechaFin: new Date('2026-12-31'),
			updatedAt: now()
		},
		$setOnInsert: { createdAt: now() }
	},
	{ upsert: true }
);
const program = await db.collection('programs').findOne({ nombre: 'Visitas Patrocinadas Museo' });

await db.collection('commitments').deleteMany({ patrocinadorNombre: 'Fundación Educativa Norte' });
await db.collection('commitments').insertOne({
	programaApoyoId: String(program._id),
	sponsorId: String(sponsor._id),
	patrocinadorNombre: 'Fundación Educativa Norte',
	descripcion: 'Financiar 500 visitas escolares',
	montoComprometido: 250000,
	fechaCompromiso: new Date('2026-02-01'),
	fechaCumplimiento: null,
	estado: 'pendiente',
	createdAt: now(),
	updatedAt: now()
});

const visitCount = await db.collection('visits').countDocuments({});
if (visitCount === 0) {
	await db.collection('visits').insertMany([
		{
			institutionId: instIds['Escuela Primaria Benito Juárez'],
			requestId: null,
			fecha: new Date('2026-03-15'),
			horario: '10:00',
			actividad: 'Recorrido permanente',
			modalidad: 'patrocinada',
			campaignId: String(campaign._id),
			sponsorId: String(sponsor._id),
			asistentesEstimados: 40,
			asistentesReales: 38,
			observaciones: 'Visita exitosa',
			status: 'realizada',
			createdAt: now(),
			updatedAt: now(),
			createdBy: null
		},
		{
			institutionId: instIds['Asociación Cultural Frontera'],
			requestId: null,
			fecha: new Date('2026-04-10'),
			horario: '12:00',
			actividad: 'Taller creativo',
			modalidad: 'pagada',
			campaignId: null,
			sponsorId: null,
			asistentesEstimados: 25,
			asistentesReales: 25,
			observaciones: '',
			status: 'realizada',
			createdAt: now(),
			updatedAt: now(),
			createdBy: null
		}
	]);
}

const reqCount = await db.collection('requests').countDocuments({});
if (reqCount === 0) {
	const { insertedId } = await db.collection('requests').insertOne({
		institutionId: instIds['Secundaria Técnica 45'],
		institutionNombre: 'Secundaria Técnica 45',
		solicitanteNombre: 'Juan Pérez',
		solicitanteEmail: 'juan@sec45.local',
		solicitanteTelefono: '6562223344',
		nivelEducativo: 'secundaria',
		cantidadEstimada: 35,
		modalidadPreferida: 'patrocinada',
		fechaPreferida: new Date('2026-11-20'),
		notas: 'Primera solicitud',
		status: 'lista_espera',
		createdAt: now(),
		updatedAt: now(),
		createdBy: null
	});
	await db.collection('waitlist').insertOne({
		institutionId: instIds['Secundaria Técnica 45'],
		requestId: String(insertedId),
		requestDate: now(),
		priority: 2,
		status: 'activa',
		notes: 'Prioridad media',
		createdAt: now()
	});
}

console.log('Seed OK');
console.log('Usuarios: admin@museo.local / visitas@museo.local / relaciones@museo.local / directivo@museo.local');
console.log('Password: admin123');
process.exit(0);
