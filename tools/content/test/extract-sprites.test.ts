import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SpriteDef } from '@mudafaa/case-schema';
import { describe, expect, it } from 'vitest';
import { extractSprites } from '../src/extract-sprites.js';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const html = readFileSync(join(repoRoot, 'design/reference/project/Sprite.dc.html'), 'utf8');
const sprites = extractSprites(html);

describe('extractSprites', () => {
  it('extracts 21 sprites with 20 rows', () => {
    expect(Object.keys(sprites)).toHaveLength(21);
    for (const sprite of Object.values(sprites)) {
      expect(sprite.rows).toHaveLength(20);
      for (const row of sprite.rows) expect(row).toHaveLength(16);
    }
  });

  it("muvekkil row 10 is '...kkoowwookk...'", () => {
    expect(sprites.muvekkil?.rows[10]).toBe('...kkoowwookk...');
  });

  it("polis skin 'Q', huseyin noMouth, hakim noEyes", () => {
    expect(sprites.polis?.skin).toBe('Q');
    expect(sprites.huseyin?.noMouth).toBe(true);
    expect(sprites.hakim?.noEyes).toBe(true);
    expect(sprites.bilirkisi).toMatchObject({ skin: 'Q', noEyes: true });
    expect(sprites.avukat?.skin).toBeUndefined();
  });

  it('every sprite parses as SpriteDef', () => {
    for (const sprite of Object.values(sprites)) expect(SpriteDef.parse(sprite)).toEqual(sprite);
  });

  it('never evaluates code outside the allowed node types', () => {
    const evil = html.replace('const M = {', 'const M = { x: globalThis.process.exit(1), ');
    expect(() => extractSprites(evil)).toThrow(/extractSprites:/);
  });

  it('committed sprite files match the design', () => {
    const dir = join(repoRoot, 'content/shared/sprites');
    const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
    expect(files.sort()).toEqual(
      Object.keys(sprites)
        .map((id) => `${id}.json`)
        .sort(),
    );
    for (const file of files) {
      const id = file.replace(/\.json$/, '');
      expect(JSON.parse(readFileSync(join(dir, file), 'utf8'))).toEqual(sprites[id]);
    }
  });
});
