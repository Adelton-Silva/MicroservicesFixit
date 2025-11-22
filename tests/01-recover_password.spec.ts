import { test, expect } from '@playwright/test';
import { criticalTest, clearStop } from './criticalAndnonCriticalTest';

// clear stop flag before each test
clearStop();

test.describe.serial('Automatic Tests Recover Password', () => {

  //  critical test failed password reset
  criticalTest('Should show error message with "Failed to send reset link"', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.click('text=Forgot password');
    await expect(page).toHaveURL('http://localhost:3000/forgot-password');

    await page.fill('#email', 'teste1@recuperar.com');
    await page.click('button[type="submit"]');

    const errorMessage = page.locator('.error-message');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/Failed to send reset link/i);
  });

  //  critical test success password reset
  criticalTest('Should show success message with "Check your email for reset link"', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.click('text=Forgot password');
    await expect(page).toHaveURL('http://localhost:3000/forgot-password');

    await page.fill('#email', 'adeltonair@gmail.com');
    await page.click('button[type="submit"]');

    const successMessage = page.locator('.success-message');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toContainText(/check your email/i);
  });

});
