import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers.js';

const rutas = [
	{ path: '/instituciones', heading: /Catálogo de instituciones/i },
	{ path: '/solicitudes', heading: /Solicitudes y lista de espera/i },
	{ path: '/visitas', heading: /Reservaciones y visitas/i },
	{ path: '/patrocinio', heading: /Patrocinadores, campañas y metas/i },
	{ path: '/mapa', heading: /Mapa de cobertura/i },
	{ path: '/usuarios', heading: /Usuarios y roles/i },
	{ path: '/bitacora', heading: /Bitácora/i },
	{ path: '/permisos', heading: /Matriz de permisos/i }
];

test.describe('Navegación interna', () => {
	test.beforeEach(async ({ page }) => {
		await loginAsAdmin(page);
	});

	for (const r of rutas) {
		test(`abre ${r.path}`, async ({ page }) => {
			await page.goto(r.path);
			await expect(page.getByRole('heading', { name: r.heading }).first()).toBeVisible();
			await expect(page.locator('p.text-red-600')).toHaveCount(0);
		});
	}

	test('mapa muestra filtros y panel de zona', async ({ page }) => {
		await page.goto('/mapa');
		await expect(page.getByText(/Cobertura por zona/i)).toBeVisible();
		await expect(page.getByRole('combobox').first()).toBeVisible();
		await expect(page.locator('.leaflet-container')).toBeVisible();
	});
});
