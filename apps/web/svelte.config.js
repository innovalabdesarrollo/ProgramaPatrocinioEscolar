import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// SPA: el routing lo resuelve el cliente; Vercel sirve index.html en fallback
			fallback: 'index.html',
			strict: false
		})
	}
};

export default config;
