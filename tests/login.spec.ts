import { test, expect } from '@playwright/test';

test.describe('Login - FixIt App', () => {

  // TESTE — Login inválido (utilizador ou palavra-passe errados)
  test('Deve mostrar mensagem de erro com username ou password inválidos', async ({ page }) => {
    // Abre a página de login
    await page.goto('http://localhost:3000/login');

    // Preenche username e password errados
    await page.fill('#username', 'Rafaell');
    await page.fill('#password', 'teste');

    // Clica no botão de login
    await page.click('button[type="submit"]');

    // Espera pela mensagem de erro
    const errorMessage = page.locator('.error-message');

    // Verifica se o erro é exibido
    await expect(errorMessage).toBeVisible();

    // Verifica o texto da mensagem (ajusta conforme o texto que aparece na tua app)
    await expect(errorMessage).toContainText(/invalid credencials|Login failed/i);
  });

  // TESTE — Login válido
  test('Deve autenticar com username válido e redirecionar para o dashboard', async ({ page }) => {
    // Abre a página de login
    await page.goto('http://localhost:3000/login');

    // Preenche dados válidos
    await page.fill('#username', 'Rafael');
    await page.fill('#password', '123456789');

    // Clica no botão de login
    await page.click('button[type="submit"]');

    // Espera redirecionamento
    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });

    // Confirma que o dashboard foi carregado
    await expect(page).toHaveURL(/.*dashboard.*/);
  });
});
