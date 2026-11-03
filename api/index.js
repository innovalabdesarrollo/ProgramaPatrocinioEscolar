/**
 * Entrada serverless para Vercel (un solo proyecto: web estática + esta función /api).
 * Reutiliza la app Express del monorepo.
 */
import { createApp } from '../apps/api/src/app.js';
import { connectDb } from '../apps/api/src/db.js';

const app = createApp();

/** @type {Promise<unknown> | null} */
let ready = null;

function ensureDb() {
	if (!ready) {
		ready = connectDb().catch((err) => {
			ready = null;
			throw err;
		});
	}
	return ready;
}

export default async function handler(req, res) {
	await ensureDb();
	return app(req, res);
}
