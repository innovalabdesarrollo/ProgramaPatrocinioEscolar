import { test, expect } from '@playwright/test';

test.describe('Flujos públicos', () => {
	test('formulario de registro se muestra', async ({ page }) => {
		await page.goto('/formulario');
		await expect(page.getByRole('heading', { name: /Registro de institución/i })).toBeVisible();
		await expect(page.getByLabel(/Nombre de la institución/i)).toBeVisible();
		await expect(page.getByRole('button', { name: /Enviar|Registrar/i })).toBeVisible();
	});

	test('consulta por email carga secciones', async ({ page }) => {
		await page.goto('/consulta');
		await expect(page.getByRole('heading', { name: /Consulta institucional/i })).toBeVisible();
		await page.getByLabel(/Email/i).fill('maria@escuela.local');
		await page.getByRole('button', { name: 'Consultar' }).click();
		await expect(page.getByRole('heading', { name: 'Instituciones' })).toBeVisible();
		await expect(page.getByText(/Escuela Primaria Benito Juárez/i)).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Visitas' })).toBeVisible();
	});

	test('registro público crea institución pendiente', async ({ page }) => {
		const stamp = Date.now();
		await page.goto('/formulario');
		await page.getByLabel(/Nombre de la institución/i).fill(`E2E Escuela ${stamp}`);
		await page.getByLabel(/^Contacto$/i).fill('Contacto E2E');
		await page.getByLabel(/^Email$/i).fill(`e2e.${stamp}@prueba.local`);
		await page.getByLabel(/^Teléfono$/i).fill('6560001111');
		await page.getByLabel(/También enviar solicitud de visita/i).uncheck();
		await page.getByRole('button', { name: 'Enviar' }).click();
		await expect(page.locator('p.text-green-700')).toContainText(/Registro recibido|pendiente de revisión/i, {
			timeout: 15_000
		});
	});
});
