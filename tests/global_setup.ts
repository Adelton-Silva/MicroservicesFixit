import fs from 'fs';
import path from 'path';

const STOP_FILE = path.join(__dirname, 'tests/.stopExecution');

export default async function globalSetup() {
  if (fs.existsSync(STOP_FILE)) fs.unlinkSync(STOP_FILE);
}
