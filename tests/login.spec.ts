import { test, expect } from '@playwright/test';
import { criticalTest, nonCriticalTest } from './criticalAndnonCriticalTest.spec';

// Agrupando tudo
test.describe.serial('Testes Automáticos Login', () => {

  //  Teste crítico: Recuperação de password (falha esperada)
  criticalTest('Deve mostrar mensagem de erro com "Failed to send reset link"', async ({ page }) => {

    await page.goto('http://localhost:3000/login');

    await page.click('text=Forgot password');

    await expect(page).toHaveURL('http://localhost:3000/forgot-password');

    await page.fill('#email', 'teste1@recuperar.com');

    await page.click('button[type="submit"]');
    
    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/Failed to send reset link/i);
  });

  //  Teste crítico: Recuperação de password (sucesso)
  criticalTest('Deve mostrar mensagem de sucesso com "Check your email for reset link"', async ({ page }) => {

    await page.goto('http://localhost:3000/login');

    await page.click('text=Forgot password');

    await expect(page).toHaveURL('http://localhost:3000/forgot-password');

    await page.fill('#email', 'adeltonair@gmail.com');

    await page.click('button[type="submit"]');
    
     // Verifica se a mensagem de sucesso apareceu
    const successMessage = page.locator('.success-message');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText(/check your email/i);
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
