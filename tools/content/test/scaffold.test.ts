import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { compile } from '@mudafaa/engine';
import { runGoldenPaths } from '@mudafaa/validator';
import { check } from 'prettier';
import { afterAll, describe, expect, it } from 'vitest';
import { buildParts, loadSource } from '../src/lib/build.js';
import { scaffoldCase } from '../src/lib/scaffold.js';
import { checkSceneHtml } from '../src/lib/scenes.js';
import { main } from '../src/cli.js';

// case:new: iskelet geçici bir köke yazılır (kit gerçek depodan göreli yolla içe aktarılır), case:build ile derlenir ve
// bütün golden path'leri geçer. Tam doğrulayıcı (≈12 sn) testte çalıştırılmaz; kit raporundaki ölçüme bakın.

const root = mkdtempSync(join(tmpdir(), 'mudafaa-scaffold-'));
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe('case:new', () => {
  it('iskelet yazar; kaynak derlenir ve golden path’ler geçer', { timeout: 60_000 }, async () => {
    const { files } = await scaffoldCase('ornek-dava', '42', root);
    expect(files.map((f) => f.slice(root.length + 1))).toEqual(
      expect.arrayContaining([
        'content/src/ornek-dava/index.ts',
        'content/src/ornek-dava/scenes/olay-yeri.html',
        'docs/content/ornek-dava.md',
        'docs/legal/ornek-dava.md',
      ]),
    );
    const index = readFileSync(join(root, 'content/src/ornek-dava/index.ts'), 'utf8');
    expect(index).not.toMatch(/__(SLUG|NUMBER|NN|KIT)__/);
    expect(readFileSync(join(root, 'docs/content/ornek-dava.md'), 'utf8')).toContain('Dava #42');
    for (const f of files.filter((p) => /\.(ts|html)$/.test(p))) {
      const opts = { singleQuote: true, trailingComma: 'all' as const, printWidth: 120, filepath: f };
      expect(await check(readFileSync(f, 'utf8'), opts), f).toBe(true);
    }
    expect(checkSceneHtml(readFileSync(join(root, 'content/src/ornek-dava/scenes/olay-yeri.html'), 'utf8'))).toEqual(
      [],
    );

    const parts = await loadSource('ornek-dava', root);
    const r = await buildParts('ornek-dava', parts, { root });
    expect(r.ok, JSON.stringify(r.issues, null, 2)).toBe(true);
    expect(existsSync(join(root, 'content/cases/ornek-dava/00-meta.json'))).toBe(true);
    const c = compile(r.merged);
    if (!c.ok) throw new Error('derlenmedi');
    expect((r.merged as { meta: { number: number; slug: string } }).meta).toMatchObject({
      number: 42,
      slug: 'ornek-dava',
    });
    const golden = runGoldenPaths(c.c);
    expect(golden.map((g) => g.name)).toEqual(['TIPIK', 'G_B', 'G_I', 'G_M', 'W']);
    for (const g of golden) expect(g, JSON.stringify(g)).toMatchObject({ passed: true });
    expect(new Set(golden.map((g) => g.outcome))).toEqual(new Set(['BERAAT_E', 'BERAAT_B', 'INDIRIM', 'MAHKUMIYET']));
  });

  it('var olan davanın üzerine yazmaz; geçersiz ad ve numarayı reddeder', async () => {
    await expect(scaffoldCase('ornek-dava', '42', root)).rejects.toThrow(/Zaten var/);
    await expect(scaffoldCase('Kötü Ad', '1', root)).rejects.toThrow(/Geçersiz dava adı/);
    await expect(scaffoldCase('iyi-ad', '0', root)).rejects.toThrow(/Geçersiz dava numarası/);
  });

  it('CLI: bilinmeyen komut ve eksik argüman kullanım hatasıdır (çıkış 2)', async () => {
    const io = { out: () => undefined, err: () => undefined };
    expect(await main(['bilinmeyen'], io)).toBe(2);
    expect(await main(['build'], io)).toBe(2);
    expect(await main(['validate', 'yok-boyle-dava'], io)).toBe(2);
  });
});
