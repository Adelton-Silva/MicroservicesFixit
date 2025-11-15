import { expect, test } from '@playwright/test';
import { nonCriticalTest } from './criticalAndnonCriticalTest';

test.describe.serial('Automatic Tests Create User', () => {

nonCriticalTest('Fail to create user without confirm password required', async ({ page }) => {
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
  await page.fill('input[placeholder="Username"]', 'adelton10');
  await page.fill('input[placeholder="email@example.com"]', 'adelton10@gmail.com');
  await page.fill('input[placeholder="Password"]', '123');
  
  // Verificar atributo type do campo password
  const passwordInput = page.locator('input[placeholder="Password"]');
  await expect(passwordInput).toHaveAttribute('type', 'password');

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

nonCriticalTest('Successfully create user', async ({ page }) => {
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

  // Preencher campos
  await page.fill('input[placeholder="Username"]', 'adelton10');
  await page.fill('input[placeholder="email@example.com"]', 'adelton10@gmail.com');
  await page.fill('input[placeholder="Password"]', '123456789');


  // Verificar atributo type do campo password
  const passwordInput = page.locator('input[placeholder="Password"]');
  await expect(passwordInput).toHaveAttribute('type', 'password');

  const confirmInputCP = page.locator('input[placeholder="Confirm Password"]');
  await expect(confirmInputCP).toHaveAttribute('type', 'password');

  await page.fill('input[placeholder="Confirm Password"]', '123456789');

  // Verificar que o input Confirm Password tem required
  const confirmInput = page.locator('input[placeholder="Confirm Password"]');
  await expect(confirmInput).toHaveAttribute('required', '');

  // Tentar submeter o formulário
  const saveButton = page.locator('button:has-text("Save")');
  await saveButton.click();

  // Verificar se o formulário foi submetido com sucesso
  const modal = page.locator('.modal');
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('User registered successfully!');

});

});
