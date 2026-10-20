import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { PNG } from 'pngjs';
import { describe, expect, it } from 'vitest';
import { EXPRESSIONS, FACES, PALETTE, checkSprite, renderSpritePreview, spriteGrid } from '../src/lib/sprite.js';
import { repoRoot } from './helpers/dava07.js';

// Sprite önizlemesi: palet ve yüz katmanları tasarımın Sprite.dc.html'iyle aynı; 16×20 satır ve palet harfi denetimi.

const dc = readFileSync(join(repoRoot, 'design/reference/project/Sprite.dc.html'), 'utf8');
const sprites = join(repoRoot, 'content/shared/sprites');
const avukat = JSON.parse(readFileSync(join(sprites, 'avukat.json'), 'utf8')) as { id: string; rows: string[] };

describe('sprite önizleme', () => {
  it('palet tasarımdaki P nesnesiyle aynı', () => {
    const block = /const P = \{([\s\S]*?)\};/.exec(dc)?.[1] ?? '';
    const design = Object.fromEntries([...block.matchAll(/([A-Za-z]): '(#[0-9a-f]{6})'/g)].map((m) => [m[1], m[2]]));
    expect(Object.keys(design)).toHaveLength(42);
    expect(PALETTE).toEqual(design);
  });

  it('yüz katmanları tasarımdaki FACES ile aynı', () => {
    const block = /const FACES = \{([\s\S]*?)\n {4}\};/.exec(dc)?.[1] ?? '';
    for (const expr of EXPRESSIONS) {
      const line = new RegExp(`${expr}: (\\[.*\\])`).exec(block)?.[1] ?? '';
      expect(JSON.parse(line.replaceAll("'", '"'))).toEqual(FACES[expr]);
    }
  });

  it('ortak sprite’ların hepsi geçerli', () => {
    for (const f of readdirSync(sprites).filter((x) => x.endsWith('.json'))) {
      expect(checkSprite(JSON.parse(readFileSync(join(sprites, f), 'utf8'))), f).toEqual([]);
    }
  });

  it('16×20 kuralı ve palet harfleri denetlenir', () => {
    expect(checkSprite({ ...avukat, rows: avukat.rows.slice(1) })).toContain('rows tam 20 satır olmalı (19 var)');
    const bad = [...avukat.rows];
    bad[3] = '...k#sssssshk...';
    bad[4] = 'kkkkkkkkkkkkkkkkk';
    expect(checkSprite({ ...avukat, rows: bad })).toEqual([
      'satır 4: palette olmayan harf(ler): #',
      'satır 5: 1–16 karakter olmalı',
    ]);
    expect(checkSprite({ ...avukat, skin: '!' })).toContain('skin tek bir palet harfi olmalı');
  });

  it('ifade katmanı ten rengini kullanır; noEyes göz satırını atlar', () => {
    // avukat 8. satırı '....kssssssk....'; mutlu ağzı [8, 6, 'kkkk'].
    expect(spriteGrid(avukat, 'mutlu')[8]?.join('')).toBe('....kskkkksk....');
    expect(
      spriteGrid({ ...avukat, skin: 'Q' }, 'kizgin')[4]
        ?.slice(4, 12)
        .join(''),
    ).toBe('QkkQQkkQ');
    expect(spriteGrid({ ...avukat, noEyes: true }, 'mutlu')[5]).toEqual(spriteGrid(avukat, 'normal')[5]);
  });

  it('önizleme PNG’si beş ifadeyi yan yana, deterministik çizer', () => {
    const a = renderSpritePreview(avukat, 4);
    expect(renderSpritePreview(avukat, 4).equals(a)).toBe(true);
    const png = PNG.sync.read(a);
    expect({ w: png.width, h: png.height }).toEqual({ w: 4 + 5 * (64 + 4), h: 80 + 8 });
  });
});
