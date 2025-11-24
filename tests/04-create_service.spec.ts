import { expect, test } from '@playwright/test';
import { nonCriticalTest } from './criticalAndnonCriticalTest';

test.describe.serial('Automatic Tests Create Service', () => {
    
    nonCriticalTest('Fail to create service due to missing information', async ({ page }) => {
    
        //login
        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'Rafael');  
        await page.fill('#password', '123456789');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/dashboard/);

        //Go to new service page and fill the form
        await page.click('text=Services'); 
        await page.click('text=New Service');
        await expect(page).toHaveURL('http://localhost:3000/admin/service?tab=newTicket');
        
        //TODO: escolher os dados
        const today = new Date().toISOString().split("T")[0];
        await page.selectOption('select[name="category"]', { label: 'Preventive maintenance' });
        await page.selectOption('select[name="machine"]', { label: 'CNC' });
        await page.selectOption('select[name="workerId"]', { label: 'Rafael' });
        await page.fill('input[name="dateStarted"]', today);
        await page.fill('input[name="dateFinished"]', today);
        await page.fill('textarea[name="observation"]', 'manutenção');

        await page.click('button[type="submit"]');


        const formInvalid = await page.$eval('form', form => !(form as HTMLFormElement).checkValidity());
        expect(formInvalid).toBe(true);
    });

    nonCriticalTest('Successfully create service', async ({ page }) => {
        
        //login
        await page.goto('http://localhost:3000/login');
        await page.fill('#username', 'Rafael');  
        await page.fill('#password', '123456789');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/dashboard/);

        //Go to new service page and fill the form
        await page.click('text=Services'); 
        await page.click('text=New Service');
        await expect(page).toHaveURL('http://localhost:3000/admin/service?tab=newTicket');
        
        
        //TODO: escolher os dados await page.selectOption('.category', {label: 'Preventive maintenance'});
        const today = new Date().toISOString().split("T")[0];
        await page.selectOption('select[name="clientId"]', { label: 'TechMech Ltd.' });
        await page.selectOption('select[name="priority"]', { label: 'Urgent' });
        await page.selectOption('select[name="category"]', { label: 'Preventive maintenance' });
        await page.selectOption('select[name="machine"]', { label: 'CNC' });
        await page.selectOption('select[name="workerId"]', { label: 'Rafael' });
        await page.fill('input[name="dateStarted"]', today);
        await page.fill('input[name="dateFinished"]', today);
        await page.fill('textarea[name="observation"]', 'manutenção');
        
        await page.click('button[type="submit"]');

        
        const modal = page.locator('.modal-content');
        await expect(modal).toBeVisible();
        await expect(modal).toContainText(/Service added successfully!/i);
    });
});