import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { describe, expect, it } from 'vitest';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const assets = join(repoRoot, 'content/cases/gece-bekcisinin-sirri/assets/scenes');
const size = (file: string) => {
  const png = PNG.sync.read(readFileSync(join(assets, file)));
  return { width: png.width, height: png.height };
};

describe('scene PNGs', () => {
  it('scene PNGs have expected sizes', () => {
    expect(size('olay-yeri-depo@4x.png')).toEqual({ width: 1376, height: 856 });
    expect(size('depo-sokagi@4x.png')).toEqual({ width: 1376, height: 1520 });
    for (const name of ['depo3-ic', 'cay-ocagi', 'kulube'])
      expect(size(`${name}@4x.png`), name).toEqual({ width: 1376, height: 1520 });
  });

  it('scene HTML keeps only decorative layers', () => {
    for (const name of ['olay-yeri-depo', 'depo-sokagi', 'depo3-ic', 'cay-ocagi', 'kulube']) {
      const html = readFileSync(join(repoRoot, `tools/content/scenes/${name}.html`), 'utf8').replace(
        /<!--[\s\S]*?-->/g,
        '',
      );
      expect(html).toContain('id="scene"');
      expect(html).not.toMatch(/<button|<script|>42<|incelenmedi|https?:/);
    }
  });
});
