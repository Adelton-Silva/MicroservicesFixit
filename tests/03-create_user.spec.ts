import { expect } from '@playwright/test';
import { nonCriticalTest } from './criticalAndnonCriticalTest';

nonCriticalTest('Falha ao registar utilizador sem Confirm Password', async ({ page }) => {
  // Pré-requisito: login válido
  await page.goto('http://localhost:3000/login');
  await page.fill('#username', 'Rafael');  
  await page.fill('#password', '123456789');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/);

  // Navegar para New User
  await page.click('text=Users'); 
  await page.click('text=New User');
  await expect(page).toHaveURL('http://localhost:3000/admin/users?tab=newUser');

  // Preencher campos exceto Confirm Password
  await page.fill('input[placeholder="Username"]', 'TesteUser');
  await page.fill('input[placeholder="email@example.com"]', 'testeuser@example.com');
  await page.fill('input[placeholder="Password"]', 'Senha123!');
  // Confirm Password NÃO preenchido

  // Verificar que o input Confirm Password tem required
  const confirmInput = page.locator('input[placeholder="Confirm Password"]');
  await expect(confirmInput).toHaveAttribute('required', '');

  // Tentar submeter o formulário
  const saveButton = page.locator('button:has-text("Save")');
  const isDisabled = await saveButton.isDisabled();
  expect(isDisabled).toBe(false); // botão não é desabilitado, mas HTML impede o submit

  // Usar evaluate para checar se o form é inválido
  const formInvalid = await page.$eval('form', form => !(form as HTMLFormElement).checkValidity());
  expect(formInvalid).toBe(true); // ✅ Formulário é inválido porque faltou o confirm password
});
