/** @param {import('@playwright/test').Page} page */
export async function loginAsAdmin(page) {
	await page.goto('/login');
	await page.getByLabel('Correo').fill('admin@museo.local');
	await page.getByLabel('Contraseña').fill('admin123');
	await page.getByRole('button', { name: 'Entrar' }).click();
	await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15_000 });
}
