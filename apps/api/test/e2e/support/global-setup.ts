import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// E2E paketinden önce bir kez: test veritabanına bekleyen migration'lar (referans verisi dahil) uygulanır.
export default function setup(): void {
  const cwd = fileURLToPath(new URL('../../..', import.meta.url));
  execSync('node scripts/migrate-test.mjs', { cwd, stdio: 'pipe' });
}
