import express from 'express';
import cors from 'cors';
import { optionalAuth } from './middleware/auth.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import institutionsRouter from './routes/institutions.js';
import requestsRouter from './routes/requests.js';
import waitlistRouter from './routes/waitlist.js';
import visitsRouter from './routes/visits.js';
import sponsorshipRouter from './routes/sponsorship.js';
import mapRouter from './routes/map.js';
import indicatorsRouter from './routes/indicators.js';
import publicRouter from './routes/public.js';
import auditRouter from './routes/audit.js';

function corsOrigins() {
	const raw = process.env.CORS_ORIGIN || 'http://localhost:5210,http://127.0.0.1:5210';
	const list = raw
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
	const expanded = new Set(list);
	for (const o of list) {
		if (o.includes('://localhost')) expanded.add(o.replace('://localhost', '://127.0.0.1'));
		if (o.includes('://127.0.0.1')) expanded.add(o.replace('://127.0.0.1', '://localhost'));
	}
	// Preview / producción en Vercel (mismo proyecto web+API)
	if (process.env.VERCEL_URL) {
		expanded.add(`https://${process.env.VERCEL_URL}`);
	}
	if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
		expanded.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
	}
	return [...expanded];
}

export function createApp() {
	const app = express();
	const origins = corsOrigins();

	app.use(
		cors({
			origin(origin, cb) {
				if (!origin || origins.includes(origin)) return cb(null, true);
				return cb(null, false);
			},
			credentials: true
		})
	);
	app.use(express.json({ limit: '1mb' }));
	app.use(optionalAuth);

	app.get('/api/health', (_req, res) => {
		res.json({
			ok: true,
			service: 'mapa-cobertura-api',
			port: Number(process.env.PORT) || null,
			node: process.version
		});
	});

	app.use('/api/auth', authRouter);
	app.use('/api/users', usersRouter);
	app.use('/api/institutions', institutionsRouter);
	app.use('/api/requests', requestsRouter);
	app.use('/api/waitlist', waitlistRouter);
	app.use('/api/visits', visitsRouter);
	app.use('/api/sponsorship', sponsorshipRouter);
	app.use('/api/map', mapRouter);
	app.use('/api/indicators', indicatorsRouter);
	app.use('/api/public', publicRouter);
	app.use('/api/audit', auditRouter);

	app.use((err, _req, res, _next) => {
		console.error(err);
		res.status(err.status || 500).json({ error: err.message || 'Error interno' });
	});

	return app;
}
