import http from 'node:http';
import { connectDb, pingDb } from './db.js';
import { createApp } from './app.js';

const PORT = Number(process.env.PORT);
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
	console.error('PORT inválido en .env — define PORT (ej. 3061) para esta app');
	process.exit(1);
}

await connectDb();
const dbInfo = await pingDb();
console.log(
	`[MapaCobertura] DB ok · ${dbInfo.dbName}${dbInfo.atlas ? ' (Atlas)' : ''} · Node ${process.version}`
);

const app = createApp();
const server = http.createServer(app);

server.on('error', (err) => {
	if (err.code === 'EADDRINUSE') {
		console.error(
			`[MapaCobertura] Puerto ${PORT} en uso por otro proceso. ` +
				`No se tocó ese proceso. Cambia PORT en .env a uno libre y alinea PUBLIC_API_URL.`
		);
		process.exit(1);
	}
	console.error(err);
	process.exit(1);
});

server.listen(PORT, '127.0.0.1', () => {
	console.log(`API MapaCobertura en http://127.0.0.1:${PORT}`);
});
