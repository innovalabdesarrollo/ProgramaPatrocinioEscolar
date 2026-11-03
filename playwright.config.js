import { defineConfig } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL || 'http://127.0.0.1:5210';

export default defineConfig({
	testDir: 'e2e',
	timeout: 45_000,
	expect: { timeout: 10_000 },
	fullyParallel: false,
	retries: 0,
	workers: 1,
	reporter: [['list']],
	use: {
		baseURL,
		headless: true,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'off'
	},
	projects: [{ name: 'chromium', use: { browserName: 'chromium' } }]
});
