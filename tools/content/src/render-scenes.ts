import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

// tools/content/scenes/*.html dosyaları, tasarımdaki sahne <section>'larının yalnızca dekoratif div'leridir (kendi
// yazdığımız statik HTML; betik yok). Ağ erişimi kapalı bir Chromium'da deviceScaleFactor 4 ile açılır ve '#scene'
// elementinin ekran görüntüsü PNG olarak yazılır. "DEPO 3" tabelasının yazı tipi (Pixelify Sans) ağdan değil, depodaki
// font dosyasından data: URL olarak eklenir; dosya yoksa tarayıcının monospace yazı tipine düşülür.

export const SCENES = [
  { name: 'olay-yeri-depo', width: 344, height: 214 },
  { name: 'depo-sokagi', width: 344, height: 380 },
] as const;

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const scenesDir = join(repoRoot, 'tools/content/scenes');
const fontPath = join(repoRoot, 'apps/mobile/assets/fonts/PixelifySans-VariableFont_wght.ttf');

/** Pixelify Sans'ı data: URL olarak tanımlayan stil bloğu (font dosyası yoksa boş). */
const fontFaceStyle = (): string => {
  if (!existsSync(fontPath)) return '';
  const data = readFileSync(fontPath).toString('base64');
  return `<style>@font-face{font-family:'Pixelify Sans';src:url(data:font/ttf;base64,${data}) format('truetype');font-weight:100 900}</style>`;
};

/** Sahne HTML'lerini `outDir/<ad>@4x.png` olarak render eder. */
export async function renderScenes(outDir: string): Promise<void> {
  mkdirSync(outDir, { recursive: true });
  const fonts = fontFaceStyle();
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({
      deviceScaleFactor: 4,
      viewport: { width: 400, height: 420 },
      offline: true,
    });
    // Ağ erişimi kapalı: sayfanın yapabileceği her istek (data: URL'ler dışında) iptal edilir.
    await context.route('**/*', (route) => route.abort());
    const page = await context.newPage();
    for (const scene of SCENES) {
      const html = readFileSync(join(scenesDir, `${scene.name}.html`), 'utf8').replace('</head>', `${fonts}</head>`);
      await page.setContent(html, { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      const box = await page.locator('#scene').boundingBox();
      if (box === null || box.width !== scene.width || box.height !== scene.height) {
        throw new Error(`${scene.name}: #scene ${scene.width}×${scene.height} olmalı, ${JSON.stringify(box)} bulundu`);
      }
      await page.locator('#scene').screenshot({ path: join(outDir, `${scene.name}@4x.png`) });
    }
  } finally {
    await browser.close();
  }
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const outDir = join(repoRoot, 'content/cases/gece-bekcisinin-sirri/assets/scenes');
  await renderScenes(outDir);
  console.log(`Sahneler yazıldı: ${outDir}`);
}
