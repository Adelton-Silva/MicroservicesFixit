import { test, Page } from '@playwright/test';

let stopExecution = false;

// Permite que outros ficheiros vejam o estado
export const shouldStop = () => stopExecution;

export const criticalTest = (name: string, fn: (args: { page: Page }) => Promise<void>) => {
  test(name, async ({ page }) => {
    if (stopExecution) test.skip();

    try {
      await fn({ page });
    } catch (err) {
      stopExecution = true;
      console.error(` Teste crítico falhou: ${name}`);
      throw err;
    }
  });
};

export const nonCriticalTest = (name: string, fn : (args: { page: Page }) => Promise<void>) => {
  test(name, async ({ page }) => {
    if (stopExecution) test.skip();
    await fn({ page });
  });
};

