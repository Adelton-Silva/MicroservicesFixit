import { test } from './fixtures';
import fs from 'fs';
import path from 'path';

const STOP_FILE = path.join(__dirname, '.stopExecution');

export function shouldStop(): boolean {
  return fs.existsSync(STOP_FILE);
}

export function clearStop() {
  if (fs.existsSync(STOP_FILE)) fs.unlinkSync(STOP_FILE);
}

export function criticalTest(
  name: string,
  fn: (fixtures: any, testInfo: any) => Promise<void>
) {
  test(name, async ({ authenticatedPage, page }, testInfo) => {
    if (shouldStop()) test.skip(true, 'Critical test failed — ignoring non-critical tests.');

    try {
      await fn({ authenticatedPage, page }, testInfo);
    } catch (err) {
      fs.writeFileSync(STOP_FILE, '1');
      throw err;
    }
  });
}

export function nonCriticalTest(
  name: string,
  fn: (fixtures: any, testInfo: any) => Promise<void>
) {
  test(name, async ({ authenticatedPage, page }, testInfo) => {
    if (shouldStop()) test.skip(true, 'Critical test failed — ignoring non-critical tests.');

    await fn({ authenticatedPage, page }, testInfo);
  });
}
