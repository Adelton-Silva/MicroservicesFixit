import { test, expect } from '@playwright/test';
import { criticalTest, nonCriticalTest, shouldStop } from './criticalAndnonCriticalTest';

test.describe.serial('Automatic Tests Login', () => {

  // Ignora todos os testes se algum crítico anterior falhou
  test.beforeEach(() => {
    if (shouldStop()) {
      test.skip(true, 'Test failure. Ignoring all tests.');
    }
  });

  //  Teste crítico: Login inválido
  criticalTest('Should show error message with invalid credencials. Please try again.', async ({ page }) => {
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
  criticalTest('Should navigate to dashboard', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('#username', 'Rafael');
    await page.fill('#password', '123456789');

    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    await page.click('button[type="submit"]');

    await page.waitForURL('**/admin/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/dashboard/);
  });

});
