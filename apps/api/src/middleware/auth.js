import { getDb } from '../db.js';
import { serialize } from '../lib/ids.js';

const ROLES = {
	admin: 'Administrador de plataforma',
	visitas: 'Gestor de visitas escolares',
	relaciones: 'Gestor de relaciones institucionales',
	admin_apoyos: 'Responsable de administración y apoyos',
	institucion: 'Representante de institución',
	directivo: 'Directivo o consultor de resultados',
	sistemas: 'Responsable de sistemas'
};

export { ROLES };

export async function optionalAuth(req, _res, next) {
	const header = req.headers.authorization || '';
	const token = header.startsWith('Bearer ') ? header.slice(7) : null;
	if (!token) {
		req.user = null;
		return next();
	}
	const session = await getDb().collection('sessions').findOne({ token, expiresAt: { $gt: new Date() } });
	if (!session) {
		req.user = null;
		return next();
	}
	const user = await getDb().collection('users').findOne({ _id: session.userId, activo: true });
	req.user = user ? serialize(user) : null;
	next();
}

export function requireAuth(req, res, next) {
	if (!req.user) return res.status(401).json({ error: 'No autenticado' });
	next();
}

export function requireRoles(...roles) {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ error: 'No autenticado' });
		if (roles.length && !roles.includes(req.user.rol)) {
			return res.status(403).json({ error: 'Sin permiso para esta operación' });
		}
		next();
	};
}
