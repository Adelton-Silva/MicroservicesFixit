import { test, Page } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const STOP_FILE = path.join(__dirname, '.stopExecution');

// Retorna se devemos parar os testes
export function shouldStop(): boolean {
  return fs.existsSync(STOP_FILE);
}

// Limpa o estado de stopExecution (para iniciar novos testes)
export function clearStop() {
  if (fs.existsSync(STOP_FILE)) fs.unlinkSync(STOP_FILE);
}

export function criticalTest(
  name: string,
  fn: ({ page }: { page: Page }) => Promise<void>
) {
  test(name, async ({ page }) => {
    if (shouldStop()) test.skip(true, 'Teste crítico anterior falhou — ignorando.');

    try {
      await fn({ page });
    } catch (err) {
      fs.writeFileSync(STOP_FILE, '1'); // marca que um crítico falhou
      throw err; // mantém falha visível no relatório
    }
  });
}

export function nonCriticalTest(
  name: string,
  fn: ({ page }: { page: Page }) => Promise<void>
) {
  test(name, async ({ page }) => {
    if (shouldStop()) test.skip(true, 'Teste crítico falhou — ignorando não críticos.');
    await fn({ page });
  });
}
