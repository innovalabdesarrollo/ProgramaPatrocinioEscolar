/**
 * Smoke estratégico contra la app real + Atlas.
 * Solo flujos críticos de lectura/auth (sin ensuciar datos).
 */
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { connectDb, pingDb, closeDb } from '../../src/db.js';
import { createApp } from '../../src/app.js';

const DEMO = { email: 'admin@museo.local', password: 'admin123' };

describe('API smoke', () => {
	/** @type {import('http').Server} */
	let server;
	/** @type {string} */
	let base;
	/** @type {string} */
	let token = '';

	before(async () => {
		await connectDb();
		const info = await pingDb();
		assert.ok(info.dbName, 'DB sin nombre');
		server = http.createServer(createApp());
		await new Promise((resolve, reject) => {
			server.listen(0, '127.0.0.1', resolve);
			server.on('error', reject);
		});
		const { port } = server.address();
		base = `http://127.0.0.1:${port}`;
	});

	after(async () => {
		await new Promise((resolve) => server.close(resolve));
		await closeDb();
	});

	async function req(path, opts = {}) {
		const headers = { ...(opts.headers || {}) };
		if (opts.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
		if (token) headers.Authorization = `Bearer ${token}`;
		const res = await fetch(`${base}${path}`, {
			...opts,
			headers,
			body: opts.body ? JSON.stringify(opts.body) : undefined
		});
		const text = await res.text();
		let json = null;
		try {
			json = text ? JSON.parse(text) : null;
		} catch {
			json = { raw: text };
		}
		return { status: res.status, json };
	}

	it('health responde', async () => {
		const { status, json } = await req('/api/health');
		assert.equal(status, 200);
		assert.equal(json.ok, true);
		assert.equal(json.service, 'mapa-cobertura-api');
	});

	it('login demo y rechaza sin token', async () => {
		const bad = await req('/api/institutions');
		assert.equal(bad.status, 401);

		const { status, json } = await req('/api/auth/login', {
			method: 'POST',
			body: DEMO
		});
		assert.equal(status, 200);
		assert.ok(json.token);
		token = json.token;
	});

	it('tablero, mapa y permisos', async () => {
		const dash = await req('/api/indicators/dashboard');
		assert.equal(dash.status, 200);
		assert.ok(typeof dash.json.institutionsTotal === 'number');
		assert.ok(Array.isArray(dash.json.campaigns));

		const alerts = await req('/api/indicators/alerts');
		assert.equal(alerts.status, 200);
		assert.ok(Array.isArray(alerts.json.alerts));

		const map = await req('/api/map/coverage');
		assert.equal(map.status, 200);
		assert.ok(Array.isArray(map.json));

		const zones = await req('/api/map/zones');
		assert.equal(zones.status, 200);
		assert.ok(Array.isArray(zones.json.zones));

		const perms = await req('/api/users/permissions');
		assert.equal(perms.status, 200);
		assert.ok(perms.json.matrix.admin);
	});

	it('instituciones, visitas meta y público', async () => {
		const inst = await req('/api/institutions');
		assert.equal(inst.status, 200);
		assert.ok(inst.json.length >= 1);

		const meta = await req('/api/visits/meta/statuses');
		assert.equal(meta.status, 200);
		assert.ok(Array.isArray(meta.json.statuses));

		const pub = await req('/api/public/my-records?email=maria@escuela.local');
		assert.equal(pub.status, 200);
		assert.ok(Array.isArray(pub.json.institutions));
		assert.ok(Array.isArray(pub.json.visits));
	});
});
