import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { repoRoot } from './lib/paths.js';
import { renderSceneHtml } from './lib/scenes.js';

// Dava #07'nin sahneleri: tools/content/scenes/*.html, tasarımdaki sahne <section>'larının yalnızca dekoratif
// div'leridir. Render genel `renderSceneHtml` ile yapılır (yeni davalar: npm run case:scenes -- <slug>).

export const SCENES = [
  { name: 'olay-yeri-depo', width: 344, height: 214 },
  { name: 'depo-sokagi', width: 344, height: 380 },
] as const;

const scenesDir = join(repoRoot, 'tools/content/scenes');

/** Dava #07 sahne HTML'lerini `outDir/<ad>@4x.png` olarak render eder. */
export async function renderScenes(outDir: string): Promise<void> {
  await renderSceneHtml(
    SCENES.map((s) => ({ ...s, html: readFileSync(join(scenesDir, `${s.name}.html`), 'utf8') })),
    outDir,
  );
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const outDir = join(repoRoot, 'content/cases/gece-bekcisinin-sirri/assets/scenes');
  await renderScenes(outDir);
  console.log(`Sahneler yazıldı: ${outDir}`);
}
