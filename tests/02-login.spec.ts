import { test, expect } from '@playwright/test';
import { criticalTest, nonCriticalTest, shouldStop } from './criticalAndnonCriticalTest';


// Agrupando tudo
test.describe.serial('Testes Automáticos Login', () => {
   test.beforeEach(() => {
    if (shouldStop()) {
      console.warn('Teste de recuperação de password falhou — testes de login ignorados.');
      test.skip();
    }
  });

  //  Teste crítico: Login inválido
  criticalTest('Deve mostrar mensagem de erro com invalid credencials. Please try again.', async ({ page }) => {

    await page.goto('http://localhost:3000/login');

    await page.fill('#username', 'Rafaelll');
    await page.fill('#password', '123456789');

    await expect(page.locator('#password')).toHaveAttribute('type', 'password');

    await page.click('button[type="submit"]');

    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/invalid credencials. Please try again.|Login failed/i);
  });

  //  Teste crítico: Login válido
  criticalTest('Deve autenticar com username válido e redirecionar para o dashboard', async ({ page }) => {

    await page.goto('http://localhost:3000/login');

    await page.fill('#username', 'Rafael');
    await page.fill('#password', '123456789');

    await expect(page.locator('#password')).toHaveAttribute('type', 'password');

    await page.click('button[type="submit"]');

    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });

    await expect(page).toHaveURL(/dashboard/);
  });

  //  Teste não crítico: UI / título da página
  nonCriticalTest('Teste de UI opcional', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page).toHaveTitle(/FixIt/);
  });
});
