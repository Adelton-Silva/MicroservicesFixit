import { expect, test } from './fixtures';
import { nonCriticalTest } from './criticalAndnonCriticalTest';

test.describe.serial('Automatic Tests Edit Service', () => {

    nonCriticalTest('Successfully edit service', async ({ authenticatedPage }) => {
        
        const page = authenticatedPage;
        
        await expect(page).toHaveURL(/dashboard/);
        
        //Go to dahsboard and select the frist element
        await page.click('text=Services'); 
        await expect(page).toHaveURL('http://localhost:3000/admin/service?tab=dashboard');

        
        //edit service
        await page.locator('tbody tr').first().locator('svg').nth(2).click();
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todayString = today.toISOString().split("T")[0];
        const tomorrowString = tomorrow.toISOString().split("T")[0];
        await page.fill('input[name="dateStarted"]', todayString);
        await page.fill('input[name="dateFinished"]', tomorrowString);
        
        await page.click('button[type="submit"]');
        
        //check result
        const feedbackModal = page.getByRole('dialog').filter({
            hasText: 'Service updated successfully!'
        });

        await expect(feedbackModal).toBeVisible();
    });

    nonCriticalTest('Failed to edit service due to the start date being greater than the finish date.', async ({ authenticatedPage}) => {
        
        const page = authenticatedPage;

        await expect(page).toHaveURL(/dashboard/);
        
        //Go to dahsboard and select the frist element
        await page.click('text=Services'); 
        await expect(page).toHaveURL('http://localhost:3000/admin/service?tab=dashboard');
        
        //edit service
        await page.locator('tbody tr').first().locator('svg').nth(2).click();
        const today = new Date();
        const dayBefore = new Date(today);
        dayBefore.setDate(dayBefore.getDate() - 1);
        const todayString = today.toISOString().split("T")[0];
        const dayBeforeString = dayBefore.toISOString().split("T")[0];
        await page.fill('input[name="dateStarted"]', todayString);
        await page.fill('input[name="dateFinished"]', dayBeforeString);
        
        await page.click('button[type="submit"]');
        
        //check result
        const feedbackModal = page.getByRole('dialog').filter({
            hasText: 'Failed to update service. Please try again.'
        });
        await expect(feedbackModal).toBeVisible();

    });
});