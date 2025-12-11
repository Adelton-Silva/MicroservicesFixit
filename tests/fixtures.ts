import { test as base, Page } from '@playwright/test';

// Definir o tipo da nova fixture
type MyFixtures = {
  authenticatedPage: Page;
};

// Create a test fixture
export const test = base.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {

    // Login only once per spec
    await page.goto('http://localhost:3000/login');
    await page.fill('#username', 'Rafael');
    await page.fill('#password', '123456789');
    await page.click('button[type="submit"]');

    await page.waitForURL(/dashboard/);

    // Submit the logged-in page for testing
    await use(page);
  }
});

export const expect = test.expect;
