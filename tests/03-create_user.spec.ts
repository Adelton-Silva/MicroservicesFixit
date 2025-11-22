import { expect, test } from '@playwright/test';
import { nonCriticalTest } from './criticalAndnonCriticalTest';

test.describe.serial('Automatic Tests Create User', () => {

nonCriticalTest('Fail to create user without confirm password required', async ({ page }) => {
  // Pre required valid login
  await page.goto('http://localhost:3000/login');
  await page.fill('#username', 'Rafael');  
  await page.fill('#password', '123456789');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/);

  // Navegate to New User
  await page.click('text=Users'); 
  await page.click('text=New User');
  await expect(page).toHaveURL('http://localhost:3000/admin/users?tab=newUser');

  // Fill the form without confirm password
  await page.fill('input[placeholder="Username"]', 'adelton10');
  await page.fill('input[placeholder="email@example.com"]', 'adelton10@gmail.com');
  await page.fill('input[placeholder="Password"]', '123');
  
  // Verifier atribut type of the password input
  const passwordInput = page.locator('input[placeholder="Password"]');
  await expect(passwordInput).toHaveAttribute('type', 'password');

  // Confirm Password not filled
  await page.fill('input[placeholder="Confirm Password"]', '');

  // Verifier the input Confirm Password has required
  const confirmInput = page.locator('input[placeholder="Confirm Password"]');
  await expect(confirmInput).toHaveAttribute('required', '');

  // Try to submit the form
  const saveButton = page.locator('button:has-text("Save")');
  const isDisabled = await saveButton.isDisabled();
  expect(isDisabled).toBe(false); 

  // Use the checkValidity() method to check if the form is valid
  const formInvalid = await page.$eval('form', form => !(form as HTMLFormElement).checkValidity());
  expect(formInvalid).toBe(true);
});

nonCriticalTest('Successfully create user', async ({ page }) => {
    

  const rand = Math.floor(100 + Math.random() * 900);
  const username = `adelton_${rand}`;
  const email = `adelton_${rand}@gmail.com`;

  // Pré-requisito: login válido
  await page.goto('http://localhost:3000/login');
  await page.fill('#username', 'Rafael');  
  await page.fill('#password', '123456789');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/dashboard/);

  // Navegate to New User
  await page.click('text=Users'); 
  await page.click('text=New User');
  await expect(page).toHaveURL('http://localhost:3000/admin/users?tab=newUser');

  // Fill the form
  await page.fill('input[placeholder="Username"]', username);
  await page.fill('input[placeholder="email@example.com"]', email);
  await page.fill('input[placeholder="Password"]', '123456789');


  // Verifier atribut type of the password input
  const passwordInput = page.locator('input[placeholder="Password"]');
  await expect(passwordInput).toHaveAttribute('type', 'password');
  
  await page.fill('input[placeholder="Confirm Password"]', '123456789');

  // Verifier the input Confirm Password has required
  const confirmInput = page.locator('input[placeholder="Confirm Password"]');
  await expect(confirmInput).toHaveAttribute('required', '');

  // Try to submit the form
  const saveButton = page.locator('button:has-text("Save")');
  await saveButton.click();

  // Veriier modal
  const modal = page.locator('.modal');
  await expect(modal).toBeVisible();
  await expect(modal).toContainText('User registered successfully!');

});

});
