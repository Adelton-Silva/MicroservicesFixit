import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',      // pasta com os testes
  timeout: 30000,          // timeout padrão de cada teste
  retries: 0,              // sem tentativas automáticas
  reporter: [['list'], ['html']], // console + relatório HTML
  workers: 1,              // garante que testes críticos parem os outros
  projects: [
    {
      name: 'Chromium',
      use: {
        channel: 'chrome',           // Chrome oficial
        viewport: { width: 1280, height: 720 },
        headless: false
      }
    },
    {
      name: 'Edge',
      use: {
        channel: 'msedge',           // Microsoft Edge
        viewport: { width: 1280, height: 720 },
        headless: false
      }
    },
    {
      name: 'Firefox',
      use: {
        browserName: 'firefox',      // Firefox
        viewport: { width: 1280, height: 720 },
        headless: false,
      },
    },
  ],
});
