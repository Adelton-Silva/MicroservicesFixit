import { test, expect } from '@playwright/test';

let stopExecution = false; // Flag global para parar execução após falha crítica


// Função para definir testes críticos
export const criticalTest = (name: string, fn: ({ page }: { page: any }) => Promise<void>) => {
  test(name, async ({ page }) => {
    if (stopExecution) test.skip(); // ignora se já houve falha crítica
    try {
      await fn({ page });
    } catch (error) {
      stopExecution = true; // marca que um teste crítico falhou
      console.error(` Teste crítico "${name}" falhou! Todos os próximos testes serão ignorados.`);
      throw error; // mantém a falha visível no relatório
    }
  });
};

// Função para testes não críticos
export const nonCriticalTest = (name: string, fn: ({ page }: { page: any }) => Promise<void>) => {
  test(name, async ({ page }) => {
    if (stopExecution) {
      console.warn(` Testes críticos falharam — "${name}" será ignorado.`);
      test.skip();
    }
    await fn({ page });
  });
};