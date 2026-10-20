import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { z } from 'zod';
import {
  CaseDetail,
  CaseListResponse,
  CaseReport,
  CharactersResponse,
  ChooseResponse,
  ErrorEnvelope,
  EvidenceListResponse,
  MeResponse,
  ProgressResponse,
  ScenesResponse,
  ScoreResponse,
  StartResponse,
} from '../src/index.js';

// API sözleşme fikstürleri (apps/api contract-fixtures e2e testi üretir): her dosya ilgili DTO şemasından geçmeli.
const FIXTURES: Record<string, z.ZodType> = {
  me: MeResponse,
  'case-list': CaseListResponse,
  'case-detail': CaseDetail,
  start: StartResponse,
  choose: ChooseResponse,
  progress: ProgressResponse,
  evidence: EvidenceListResponse,
  scenes: ScenesResponse,
  characters: CharactersResponse,
  score: ScoreResponse,
  report: CaseReport,
  error: ErrorEnvelope,
};

const read = (name: string): unknown =>
  JSON.parse(readFileSync(new URL(`../fixtures/api/${name}.json`, import.meta.url), 'utf8'));

describe('API contract fixtures', () => {
  for (const [name, schema] of Object.entries(FIXTURES)) {
    it(`${name}.json parses with its DTO`, () => {
      const r = schema.safeParse(read(name));
      expect(r.success, r.success ? '' : JSON.stringify(r.error.issues.slice(0, 3))).toBe(true);
    });
  }

  it('fixtures carry no live identifiers', () => {
    for (const name of Object.keys(FIXTURES)) {
      const text = JSON.stringify(read(name));
      for (const m of text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi) ?? []) {
        expect(m.startsWith('00000000-0000-7000-8000-'), `${name}: ${m}`).toBe(true);
      }
    }
  });
});
