import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { repoRoot } from './paths.js';

// Sahne HTML'lerini PNG'ye çevirir. Sahne dosyası kendi yazdığımız statik HTML'dir: `#scene` elementi sahnenin
// kendisidir ve boyutu sahne birimidir (SceneDef.width × height). Ağ erişimi kapalı bir Chromium'da
// deviceScaleFactor 4 ile açılır; `#scene`'in ekran görüntüsü `<ad>@4x.png` olarak yazılır. Pixelify Sans yazı tipi
// depodaki dosyadan data: URL olarak eklenir (yoksa monospace'e düşülür). Çıktı yalnızca HTML'e bağlıdır.

export interface SceneInput {
  name: string;
  html: string;
  /** Beklenen boyut (sahne birimi); verilirse `#scene` bununla aynı olmalı. */
  width?: number;
  height?: number;
}

export interface RenderedScene {
  name: string;
  width: number;
  height: number;
  file: string;
}

const fontPath = join(repoRoot, 'apps/mobile/assets/fonts/PixelifySans-VariableFont_wght.ttf');

/** Pixelify Sans'ı data: URL olarak tanımlayan stil bloğu (font dosyası yoksa boş). */
export const fontFaceStyle = (): string => {
  if (!existsSync(fontPath)) return '';
  const data = readFileSync(fontPath).toString('base64');
  return `<style>@font-face{font-family:'Pixelify Sans';src:url(data:font/ttf;base64,${data}) format('truetype');font-weight:100 900}</style>`;
};

/** Sahne HTML'si için içerik denetimi: betik, düğme ve ağ adresi yok; `#scene` var. Sorun listesi döner. */
export function checkSceneHtml(html: string): string[] {
  const body = html.replace(/<!--[\s\S]*?-->/g, '');
  const errs: string[] = [];
  if (!/id=["']scene["']/.test(body)) errs.push('id="scene" elementi yok');
  if (/<script\b/i.test(body)) errs.push('<script> kullanılamaz (sahne statik olmalı)');
  if (/<button\b/i.test(body)) errs.push('<button> kullanılamaz (dokunma alanları SceneDef nesneleridir)');
  if (/https?:\/\//i.test(body)) errs.push('ağ adresi kullanılamaz (çevrimdışı render)');
  return errs;
}

/** Sahneleri `outDir/<ad>@4x.png` olarak render eder. */
export async function renderSceneHtml(inputs: readonly SceneInput[], outDir: string): Promise<RenderedScene[]> {
  mkdirSync(outDir, { recursive: true });
  const fonts = fontFaceStyle();
  const browser = await chromium.launch();
  const out: RenderedScene[] = [];
  try {
    const context = await browser.newContext({
      deviceScaleFactor: 4,
      viewport: { width: 400, height: 420 },
      offline: true,
    });
    // Ağ erişimi kapalı: sayfanın yapabileceği her istek (data: URL'ler dışında) iptal edilir.
    await context.route('**/*', (route) => route.abort());
    const page = await context.newPage();
    for (const scene of inputs) {
      const problems = checkSceneHtml(scene.html);
      if (problems.length > 0) throw new Error(`${scene.name}: ${problems.join('; ')}`);
      await page.setContent(scene.html.replace('</head>', `${fonts}</head>`), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      const box = await page.locator('#scene').boundingBox();
      if (box === null || !Number.isInteger(box.width) || !Number.isInteger(box.height) || box.width <= 0) {
        throw new Error(`${scene.name}: #scene tamsayı boyutlu olmalı, ${JSON.stringify(box)} bulundu`);
      }
      if (
        (scene.width !== undefined && box.width !== scene.width) ||
        (scene.height !== undefined && box.height !== scene.height)
      ) {
        throw new Error(
          `${scene.name}: #scene ${scene.width}×${scene.height} olmalı, ${box.width}×${box.height} bulundu`,
        );
      }
      // Büyük sahneler için görüş alanı genişletilir (küçükler varsayılan 400×420'de kalır).
      const viewport = { width: Math.max(400, box.x + box.width + 16), height: Math.max(420, box.y + box.height + 16) };
      await page.setViewportSize(viewport);
      const file = join(outDir, `${scene.name}@4x.png`);
      await page.locator('#scene').screenshot({ path: file });
      out.push({ name: scene.name, width: box.width, height: box.height, file });
    }
  } finally {
    await browser.close();
  }
  return out;
}
