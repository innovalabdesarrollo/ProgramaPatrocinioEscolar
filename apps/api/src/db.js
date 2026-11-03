import { MongoClient } from 'mongodb';

/** Reutilizar cliente entre invocaciones serverless (Vercel). */
let client;
let db;
/** @type {Promise<import('mongodb').Db> | undefined} */
let connecting;

export async function connectDb() {
	if (db) return db;
	if (connecting) return connecting;

	connecting = (async () => {
		const uri = process.env.MONGODB_URI;
		if (!uri) throw new Error('MONGODB_URI requerido en .env');

		client = new MongoClient(uri);
		await client.connect();
		db = client.db();
		if (!db.databaseName) {
			throw new Error('La URI debe incluir el nombre de DB (/mapa_cobertura_patrocinio_escolar)');
		}
		await ensureIndexes(db);
		return db;
	})();

	try {
		return await connecting;
	} catch (err) {
		connecting = undefined;
		db = undefined;
		client = undefined;
		throw err;
	}
}

async function ensureIndexes(d) {
	await d.collection('users').createIndex({ email: 1 }, { unique: true });
	await d.collection('sessions').createIndex({ token: 1 }, { unique: true });
	await d.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
	await d.collection('institutions').createIndex({ nombre: 1 });
	await d.collection('institutions').createIndex({ statusAtencion: 1 });
	await d.collection('requests').createIndex({ status: 1 });
	await d.collection('visits').createIndex({ institutionId: 1 });
	await d.collection('visits').createIndex({ fecha: 1 });
}

export function getDb() {
	if (!db) throw new Error('DB no conectada');
	return db;
}

export async function closeDb() {
	if (client) {
		await client.close();
		client = undefined;
		db = undefined;
		connecting = undefined;
	}
}

export async function pingDb() {
	const d = getDb();
	await d.command({ ping: 1 });
	return { dbName: d.databaseName, atlas: /mongodb\.net/.test(process.env.MONGODB_URI || '') };
}
