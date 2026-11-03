import { browser } from '$app/environment';

// Local: PUBLIC_API_URL=http://localhost:3061 · Vercel: vacío → mismo origen (/api)
const BASE =
	import.meta.env.PUBLIC_API_URL ||
	(import.meta.env.DEV ? 'http://localhost:3061' : '');

function token() {
	if (!browser) return null;
	return localStorage.getItem('mc_token');
}

export function setSession(t, user) {
	localStorage.setItem('mc_token', t);
	localStorage.setItem('mc_user', JSON.stringify(user));
}

export function clearSession() {
	localStorage.removeItem('mc_token');
	localStorage.removeItem('mc_user');
}

export function getUser() {
	if (!browser) return null;
	try {
		return JSON.parse(localStorage.getItem('mc_user') || 'null');
	} catch {
		return null;
	}
}

export async function api(path, options = {}) {
	const headers = { ...(options.headers || {}) };
	if (!(options.body instanceof FormData)) {
		headers['Content-Type'] = 'application/json';
	}
	const t = token();
	if (t) headers.Authorization = `Bearer ${t}`;

	const res = await fetch(`${BASE}${path}`, {
		...options,
		headers,
		body: options.body
			? options.body instanceof FormData
				? options.body
				: JSON.stringify(options.body)
			: undefined
	});

	const ct = res.headers.get('content-type') || '';
	if (ct.includes('text/csv')) {
		if (!res.ok) throw new Error('Error al exportar');
		return res;
	}
	const data = ct.includes('application/json') ? await res.json() : await res.text();
	if (!res.ok) throw new Error(data?.error || res.statusText || 'Error');
	return data;
}

export { BASE as API_BASE };
