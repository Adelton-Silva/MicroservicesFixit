import { test, expect } from '@playwright/test';

test.describe('Login - FixIt App', () => {

  // Teste de Falha
  test('Deve mostrar mensagem de erro com username ou password inválidos', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    // Verifica se a página de login é exibida
    await expect(page).toHaveURL(/login/);

    await page.fill('#username', 'Rafaelll');
    await page.fill('#password', '123456789');

    // Verifica se o campo de password oculta o texto
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');

    await page.click('button[type="submit"]');

    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/invalid credencials|Login failed/i);
  });

  // Teste de Sucesso
  test('Deve autenticar com username válido e redirecionar para o dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/login');

    // Verifica se a página de login é exibida
    await expect(page).toHaveURL(/login/);

    await page.fill('#username', 'Rafael');
    await page.fill('#password', '123456789');

    // Verifica se o campo de password oculta o texto
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');

    await page.click('button[type="submit"]');

    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/.*dashboard.*/);
  });
});
