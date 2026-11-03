import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, '../..', '');
	const webPort = Number(env.WEB_PORT) || 5210;

	return {
		plugins: [tailwindcss(), sveltekit()],
		envDir: '../../',
		envPrefix: ['VITE_', 'PUBLIC_'],
		server: {
			port: webPort,
			strictPort: true,
			host: '127.0.0.1',
			// Evita EMFILE cuando hay muchas apps Innovalab abiertas
			watch: { usePolling: true, interval: 1000 }
		},
		preview: {
			port: webPort,
			strictPort: true
		}
	};
});
