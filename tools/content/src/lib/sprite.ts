import type { Expression } from '@mudafaa/case-schema';
import { PNG } from 'pngjs';

// Karakter sprite'ının denetimi ve önizleme PNG'si. Palet ve yüz ifadesi katmanları tasarımdaki
// design/reference/project/Sprite.dc.html'in (`P` ve `FACES`) birebir kopyasıdır; test, kopyanın tasarımla aynı
// kaldığını denetler. Önizleme Flutter'daki PixelSprite ile aynı kuralı izler: satırlar 16'ya `.` ile tamamlanır,
// ifade katmanında `*` ten rengidir, `noEyes` 5. satırı, `noMouth` 7–8. satırları atlar.

export const SPRITE_WIDTH = 16;
export const SPRITE_HEIGHT = 20;

/** Ortak palet: harf → renk (`.` saydam). */
// prettier-ignore
export const PALETTE: Readonly<Record<string, string>> = {
  k: '#120d1c', e: '#120d1c', s: '#f2b38a', S: '#c9805e', Q: '#a86d45', J: '#7c4c2c',
  h: '#3a2a24', H: '#7a4a2a', y: '#cfc9c1', Y: '#e6c46a', q: '#c96f2a', w: '#f4efe6',
  b: '#2f5a96', B: '#1d3a66', r: '#c4413a', R: '#c0392b', g: '#e8b13c', m: '#7b4fb0',
  n: '#25222e', N: '#4a4656', p: '#7a2f45', P: '#4a1a2b', o: '#e2802f', O: '#a8521b',
  c: '#2c3e66', A: '#1c2846', C: '#9cc3e6', v: '#5c5a66', x: '#b08463', z: '#7d8590',
  Z: '#4f5560', u: '#6a4a9c', U: '#45306a', f: '#b0496b', F: '#7d2e48', j: '#3b2f2a',
  d: '#3d5a80', D: '#2a3f5c', i: '#6a8a3e', I: '#4a6428', t: '#3f8a62', T: '#2a5e44',
};

/** Yüz ifadesi katmanları: `[satır, sütun, metin]`; `*` ten rengi. */
// prettier-ignore
export const FACES: Readonly<Record<Expression, readonly (readonly [number, number, string])[]>> = {
  normal: [],
  mutlu: [[5, 4, '*e****e*'], [7, 4, '*k****k*'], [8, 6, 'kkkk']],
  kizgin: [[4, 4, '*kk**kk*'], [5, 4, '*e****e*'], [7, 4, '**kkkk**']],
  saskin: [[4, 4, '*k****k*'], [5, 4, '*ee**ee*'], [7, 4, '***kk***'], [8, 7, 'kk']],
  uzgun: [[4, 4, '**k**k**'], [5, 4, '*e****e*'], [7, 4, '**kkkk**'], [8, 5, 'k'], [8, 10, 'k']],
};

export const EXPRESSIONS: readonly Expression[] = ['normal', 'mutlu', 'kizgin', 'saskin', 'uzgun'];

export interface SpriteLike {
  id: string;
  rows: string[];
  skin?: string;
  noEyes?: boolean;
  noMouth?: boolean;
}

/** Sprite JSON'unu denetler; sorun listesi döner (boşsa geçerli). */
export function checkSprite(value: unknown): string[] {
  const errs: string[] = [];
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return ['sprite bir JSON nesnesi olmalı'];
  const s = value as Record<string, unknown>;
  const known = new Set(['id', 'rows', 'skin', 'noEyes', 'noMouth']);
  for (const k of Object.keys(s)) if (!known.has(k)) errs.push(`bilinmeyen alan: ${k}`);
  if (typeof s.id !== 'string' || !/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(s.id)) errs.push('id geçerli bir kimlik olmalı');
  if (!Array.isArray(s.rows)) return [...errs, 'rows bir dizi olmalı'];
  if (s.rows.length !== SPRITE_HEIGHT) errs.push(`rows tam ${SPRITE_HEIGHT} satır olmalı (${s.rows.length} var)`);
  s.rows.forEach((row: unknown, i: number) => {
    if (typeof row !== 'string') {
      errs.push(`satır ${i + 1}: metin değil`);
      return;
    }
    if (row.length < 1 || row.length > SPRITE_WIDTH) errs.push(`satır ${i + 1}: 1–${SPRITE_WIDTH} karakter olmalı`);
    const bad = [...new Set([...row].filter((ch) => ch !== '.' && PALETTE[ch] === undefined))];
    if (bad.length > 0) errs.push(`satır ${i + 1}: palette olmayan harf(ler): ${bad.join(' ')}`);
  });
  if (s.skin !== undefined && (typeof s.skin !== 'string' || PALETTE[s.skin] === undefined)) {
    errs.push('skin tek bir palet harfi olmalı');
  }
  for (const k of ['noEyes', 'noMouth'])
    if (s[k] !== undefined && typeof s[k] !== 'boolean') errs.push(`${k} bool olmalı`);
  return errs;
}

/** İfade katmanı uygulanmış 16 × 20 hücre ızgarası (palet harfleri; `.` saydam). */
export function spriteGrid(sprite: SpriteLike, expression: Expression = 'normal'): string[][] {
  const skin = sprite.skin ?? 's';
  const grid = sprite.rows.map((r) => (r + '.'.repeat(SPRITE_WIDTH)).slice(0, SPRITE_WIDTH).split(''));
  for (const [row, col, str] of FACES[expression]) {
    if (sprite.noEyes === true && row === 5) continue;
    if (sprite.noMouth === true && (row === 7 || row === 8)) continue;
    for (let i = 0; i < str.length; i++) {
      const target = grid[row];
      if (target !== undefined) target[col + i] = str[i] === '*' ? skin : (str[i] ?? '.');
    }
  }
  return grid;
}

const rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

/**
 * Önizleme PNG'si: beş ifade yan yana, her piksel `scale` × `scale`, aralarda ve kenarda 1 sprite pikseli boşluk; saydam
 * pikseller dama desenli zeminde görünür. Deterministiktir (yalnızca girdiye bağlı).
 */
export function renderSpritePreview(sprite: SpriteLike, scale = 8): Buffer {
  const gap = scale;
  const cellW = SPRITE_WIDTH * scale;
  const width = gap + EXPRESSIONS.length * (cellW + gap);
  const height = SPRITE_HEIGHT * scale + 2 * gap;
  const png = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const light = (Math.floor(x / 4) + Math.floor(y / 4)) % 2 === 0;
      const i = (y * width + x) * 4;
      png.data[i] = png.data[i + 1] = png.data[i + 2] = light ? 0x3a : 0x2b;
      png.data[i + 3] = 255;
    }
  }
  EXPRESSIONS.forEach((expr, n) => {
    const ox = gap + n * (cellW + gap);
    spriteGrid(sprite, expr).forEach((row, gy) =>
      row.forEach((ch, gx) => {
        const hex = PALETTE[ch];
        if (hex === undefined) return;
        const [r, g, b] = rgb(hex);
        for (let dy = 0; dy < scale; dy++) {
          for (let dx = 0; dx < scale; dx++) {
            const i = ((gap + gy * scale + dy) * width + ox + gx * scale + dx) * 4;
            png.data[i] = r;
            png.data[i + 1] = g;
            png.data[i + 2] = b;
            png.data[i + 3] = 255;
          }
        }
      }),
    );
  });
  return PNG.sync.write(png);
}
