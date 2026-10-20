import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { main } from '../src/index.js';
import { choice, withPatch } from './helpers/mini.js';

const MINI = fileURLToPath(new URL('../../case-schema/fixtures/mini-case.json', import.meta.url));
const FAST = ['--max-states', '3000', '--walks', '30'];

function capture(): {
  io: { out: (t: string) => void; err: (t: string) => void };
  out: () => string;
  err: () => string;
} {
  let out = '';
  let err = '';
  return {
    io: { out: (t) => void (out += t), err: (t) => void (err += t) },
    out: () => out,
    err: () => err,
  };
}

describe('cli', () => {
  it('cli exit codes', { timeout: 120_000 }, async () => {
    const ok = capture();
    expect(await main([MINI, ...FAST], ok.io)).toBe(0);
    expect(ok.out()).toContain('PASSED');

    const dir = mkdtempSync(join(tmpdir(), 'mudafaa-validate-'));
    const broken = join(dir, 'broken.json');
    writeFileSync(broken, JSON.stringify(withPatch((p) => delete choice(p, 'n_story_good', 'ch_good_next').next)));
    const bad = capture();
    expect(await main([broken, ...FAST], bad.io)).toBe(1);
    expect(bad.out()).toContain('FAILED');

    const garbled = join(dir, 'garbled.json');
    writeFileSync(garbled, '{ "format": ');
    expect(await main([garbled], capture().io)).toBe(1);

    const typed = join(dir, 'typed.json');
    writeFileSync(
      typed,
      JSON.stringify(
        withPatch(
          (p) => (choice(p, 'n_hub', 'ch_go_board').effects = [{ type: 'VAR', var: 'trust', op: 'set', value: true }]),
        ),
      ),
    );
    const typedOut = capture();
    expect(await main([typed, ...FAST], typedOut.io)).toBe(1);
    expect(typedOut.out()).toContain('TYPE_MISMATCH');

    const missing = capture();
    expect(await main([join(dir, 'yok.json')], missing.io)).toBe(2);
    expect(missing.err()).toContain('bulunamadı');
    expect(await main([], capture().io)).toBe(2);
    expect(await main([MINI, '--max-states', 'x'], capture().io)).toBe(2);
  });

  it('json output parses and directories merge parts', { timeout: 120_000 }, async () => {
    const dir = mkdtempSync(join(tmpdir(), 'mudafaa-parts-'));
    const p = withPatch(() => {});
    const { nodes, ...rest } = p;
    writeFileSync(join(dir, '00-meta.json'), JSON.stringify(rest));
    writeFileSync(join(dir, '10-nodes.json'), JSON.stringify({ nodes }));
    const cap = capture();
    expect(await main([dir, '--json', ...FAST], cap.io)).toBe(0);
    const report = JSON.parse(cap.out()) as { status: string; slug: string };
    expect(report).toMatchObject({ status: 'PASSED', slug: 'mini-case' });
    writeFileSync(join(dir, 'case.json'), '{}');
    expect(await main([dir, ...FAST], capture().io)).toBe(1);
  });
});
