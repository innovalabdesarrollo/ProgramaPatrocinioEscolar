import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './helpers.js';

test.describe('Auth y tablero', () => {
	test('login incorrecto muestra error', async ({ page }) => {
		await page.goto('/login');
		await page.getByLabel('Correo').fill('admin@museo.local');
		await page.getByLabel('Contraseña').fill('clave-mala');
		await page.getByRole('button', { name: 'Entrar' }).click();
		await expect(page.locator('p.text-red-600')).toContainText(/Credenciales inválidas|inválid/i);
		await expect(page).toHaveURL(/login/);
	});

	test('login admin llega al tablero con alertas e indicadores', async ({ page }) => {
		await loginAsAdmin(page);
		await expect(page.getByRole('heading', { name: /Tablero ejecutivo/i })).toBeVisible();
		await expect(page.getByRole('heading', { name: /Alertas de seguimiento/i })).toBeVisible();
		await expect(page.getByRole('heading', { name: /Cumplimiento de metas/i })).toBeVisible();
		await expect(page.getByRole('button', { name: /Instituciones[\s\S]*Ver detalle/i })).toBeVisible();
	});

	test('drill-down de indicador abre detalle', async ({ page }) => {
		await loginAsAdmin(page);
		await page.getByRole('button', { name: /Instituciones[\s\S]*Ver detalle/i }).click();
		await expect(page.getByRole('heading', { name: /Detalle · Instituciones/i })).toBeVisible();
		await page.getByRole('button', { name: 'Cerrar' }).click();
	});
});
