/** Módulos de la app y matriz por defecto alineada a los roles actuales. */
export const MODULES = [
	{ id: 'tablero', label: 'Tablero', href: '/' },
	{ id: 'instituciones', label: 'Instituciones', href: '/instituciones' },
	{ id: 'solicitudes', label: 'Solicitudes', href: '/solicitudes' },
	{ id: 'visitas', label: 'Visitas', href: '/visitas' },
	{ id: 'patrocinio', label: 'Patrocinio', href: '/patrocinio' },
	{ id: 'mapa', label: 'Mapa', href: '/mapa' },
	{ id: 'usuarios', label: 'Usuarios', href: '/usuarios' },
	{ id: 'bitacora', label: 'Bitácora', href: '/bitacora' },
	{ id: 'permisos', label: 'Permisos', href: '/permisos' }
];

const rw = { read: true, write: true };
const ro = { read: true, write: false };
const no = { read: false, write: false };

function all(level) {
	const out = {};
	for (const m of MODULES) out[m.id] = { ...level };
	return out;
}

export const DEFAULT_MATRIX = {
	admin: all(rw),
	sistemas: all(rw),
	visitas: {
		tablero: ro,
		instituciones: rw,
		solicitudes: rw,
		visitas: rw,
		patrocinio: ro,
		mapa: ro,
		usuarios: no,
		bitacora: no,
		permisos: no
	},
	relaciones: {
		tablero: ro,
		instituciones: rw,
		solicitudes: rw,
		visitas: ro,
		patrocinio: rw,
		mapa: ro,
		usuarios: no,
		bitacora: no,
		permisos: no
	},
	admin_apoyos: {
		tablero: ro,
		instituciones: ro,
		solicitudes: ro,
		visitas: ro,
		patrocinio: rw,
		mapa: ro,
		usuarios: no,
		bitacora: no,
		permisos: no
	},
	institucion: {
		tablero: no,
		instituciones: ro,
		solicitudes: ro,
		visitas: ro,
		patrocinio: no,
		mapa: no,
		usuarios: no,
		bitacora: no,
		permisos: no
	},
	directivo: {
		tablero: ro,
		instituciones: ro,
		solicitudes: ro,
		visitas: ro,
		patrocinio: ro,
		mapa: ro,
		usuarios: ro,
		bitacora: ro,
		permisos: no
	}
};

export function normalizeMatrix(input) {
	const base = structuredClone(DEFAULT_MATRIX);
	if (!input || typeof input !== 'object') return base;
	for (const rol of Object.keys(base)) {
		if (!input[rol] || typeof input[rol] !== 'object') continue;
		for (const mod of MODULES) {
			const cell = input[rol][mod.id];
			if (!cell || typeof cell !== 'object') continue;
			base[rol][mod.id] = {
				read: Boolean(cell.read),
				write: Boolean(cell.write)
			};
		}
	}
	return base;
}
