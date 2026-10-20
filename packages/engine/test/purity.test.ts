import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SRC = fileURLToPath(new URL('../src/', import.meta.url));

describe('purity', () => {
  it('engine sources are pure', () => {
    const files = readdirSync(SRC, { recursive: true, encoding: 'utf8' }).filter((f) => f.endsWith('.ts'));
    expect(files.length).toBeGreaterThan(10);
    for (const f of files) {
      const text = readFileSync(`${SRC}${f}`, 'utf8');
      expect(text, f).not.toMatch(/\bDate\b|Math\.random|performance\.|from 'node:/);
    }
  });
});
