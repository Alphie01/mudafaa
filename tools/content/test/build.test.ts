import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { canonicalJson } from '@mudafaa/engine';
import { loadCase } from '@mudafaa/validator';
import { check } from 'prettier';
import { afterAll, describe, expect, it } from 'vitest';
import { DuplicateIdError } from '../src/kit/index.js';
import { buildParts, formatJson } from '../src/lib/build.js';
import { caseOutDir } from '../src/lib/paths.js';
import { miniParts } from './fixtures/mini-case.js';
import { repoRoot } from './helpers/dava07.js';

// case:build: parçalar NN-ad.json olarak, Prettier'ın yazacağı biçimde yazılır; loadCase ile geri okunan paket
// kaynaktaki birleşimle aynıdır; eski parçalar silinir; yinelenen kimlik yazmadan önce durdurur.

const root = mkdtempSync(join(tmpdir(), 'mudafaa-build-'));
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe('case:build', () => {
  it('örnek davayı yazar, geri okur ve derler', async () => {
    const parts = miniParts();
    const out = caseOutDir('mini', root);
    const r = await buildParts('mini', parts, { root });
    expect(r.ok, JSON.stringify(r.issues)).toBe(true);
    expect(r.files).toEqual(
      Object.keys(parts)
        .sort()
        .map((n) => `${n}.json`),
    );
    expect(readdirSync(out).sort()).toEqual(r.files);
    expect(canonicalJson(await loadCase(out))).toBe(canonicalJson(r.merged));
    for (const f of r.files) {
      const path = join(out, f);
      // Depo ayarlarıyla `prettier --check` temiz: yazılan metin Prettier'ın sabit noktası.
      expect(
        await check(readFileSync(path, 'utf8'), {
          singleQuote: true,
          trailingComma: 'all',
          printWidth: 120,
          filepath: path,
        }),
      ).toBe(true);
    }
  });

  it('eski adlı parçaları siler, başka dosyalara dokunmaz', async () => {
    const out = caseOutDir('mini', root);
    writeFileSync(join(out, '55-eski.json'), '{}\n');
    writeFileSync(join(out, 'NOT.md'), 'not\n');
    await buildParts('mini', miniParts(), { root });
    expect(readdirSync(out)).not.toContain('55-eski.json');
    expect(readdirSync(out)).toContain('NOT.md');
  });

  it('yinelenen kimlikte ve geçersiz parça adında hiçbir şey yazmadan durur', async () => {
    const parts = { ...miniParts(), '41-ikinci': { nodes: [{ id: 'BR', type: 'RESULT' as const, choices: [] }] } };
    await expect(buildParts('dup', parts, { root })).rejects.toThrow(DuplicateIdError);
    await expect(buildParts('bad', { meta: {} }, { root })).rejects.toThrow(/Geçersiz parça adı/);
    expect(readdirSync(join(root, 'content/cases'))).toEqual(['mini']);
  });

  it('derleme hatasını raporlar (yazılır ama ok: false)', async () => {
    const parts = miniParts();
    const broken = {
      ...parts,
      '41-kirik': {
        nodes: [
          {
            id: 'X',
            type: 'STORY' as const,
            choices: [{ id: 'XC', kind: 'CONTINUE' as const, label: 'x', next: 'YOK' }],
          },
        ],
      },
    };
    const r = await buildParts('kirik', broken, { root, write: false });
    expect(r.ok).toBe(false);
    expect(r.issues.map((i) => i.code)).toContain('DANGLING_REF');
  });

  it('formatJson Dava #07 parçalarında da Prettier sabit noktası üretir', async () => {
    const dir = join(repoRoot, 'content/cases/gece-bekcisinin-sirri');
    const path = join(dir, '60-trial.json');
    const text = await formatJson(JSON.parse(readFileSync(path, 'utf8')), path);
    expect(await formatJson(JSON.parse(text), path)).toBe(text);
    expect(JSON.parse(text)).toEqual(JSON.parse(readFileSync(path, 'utf8')));
  });
});
