import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { bootstrapApp, client, type TestApp } from './support/app.js';
import { publishFixture, type Published } from './support/cases.js';
import { emulatorUser } from './support/emulator.js';
import { miniCase } from './support/fixtures.js';
import { goldenPath, playActions, startCase } from './support/play.js';

// API sözleşme fikstürleri (Flutter istemcisi aynı dosyaları okur): temsilî yanıtlar normalleştirilip
// packages/case-schema/fixtures/api/*.json ile karşılaştırılır; UPDATE_API_FIXTURES=1 dosyaları yeniden yazar.
const DIR = fileURLToPath(new URL('../../../../packages/case-schema/fixtures/api/', import.meta.url));
const UPDATE = process.env.UPDATE_API_FIXTURES === '1';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

/**
 * Oynak değerleri sabitler: uuid → sıra numaralı uuid (ilk görülme sırasıyla, dosya başına), tarih → sabit,
 * `requestId` → "req", benzersiz test kimliği (slug, numara, e-posta) → mini-case değerleri, `newCases` → 0.
 */
function normalize(value: unknown, ctx: { slug: string; number: number; email: string | null }): unknown {
  const ids = new Map<string, string>();
  const walk = (v: unknown, key?: string): unknown => {
    if (Array.isArray(v)) return v.map((x) => walk(x));
    if (v !== null && typeof v === 'object') {
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(v).sort()) out[k] = walk((v as Record<string, unknown>)[k], k);
      return out;
    }
    if (key === 'requestId') return 'req';
    if (key === 'newCases') return 0;
    if ((key === 'number' || key === 'caseNumber') && v === ctx.number) return 0;
    if (typeof v === 'string') {
      if (UUID.test(v)) {
        if (!ids.has(v)) ids.set(v, `00000000-0000-7000-8000-${String(ids.size + 1).padStart(12, '0')}`);
        return ids.get(v);
      }
      if (ISO.test(v)) return '2026-10-20T00:00:00.000Z';
      if (v === ctx.slug) return 'mini-case';
      if (ctx.email !== null && v === ctx.email) return 'oyuncu@test.mudafaa';
    }
    return v;
  };
  return walk(value);
}

describe('API contract fixtures', () => {
  let t: TestApp;
  let mini: Published;
  const captured = new Map<string, unknown>();
  let ctx: { slug: string; number: number; email: string | null };

  beforeAll(async () => {
    t = await bootstrapApp();
    mini = await publishFixture(t, miniCase(), { prefix: 'contract' });
    const u = await emulatorUser();
    ctx = { slug: mini.pkg.meta.slug, number: mini.pkg.meta.number, email: u.email };
    const c = client(t.app, u.idToken);

    captured.set('me', (await c.get('/me')).body);
    const list = (await c.get('/cases')).body as { items: { id: string; status: string }[] };
    // Paylaşılan test veritabanında başka davalar da olabilir: yalnızca fikstür davası tutulur.
    const items = list.items.filter((x) => x.id === mini.caseId);
    captured.set('case-list', { items, counts: { active: items.length, closed: 0, locked: 0 } });
    captured.set('case-detail', (await c.get(`/cases/${mini.caseId}`)).body);
    const started = await startCase(c, mini.caseId);
    captured.set('start', started.body);
    const id = started.body.session.id;
    const win = goldenPath(mini.pkg, 'gp_win');
    const first = await playActions(c, id, 0, win.slice(0, 1));
    captured.set('choose', first);
    const mid = await playActions(c, id, first.view.session.stateVersion, win.slice(1, 7));
    captured.set('evidence', (await c.get(`/sessions/${id}/evidence`)).body);
    captured.set('scenes', (await c.get(`/sessions/${id}/scenes`)).body);
    captured.set('characters', (await c.get(`/sessions/${id}/characters`)).body);
    await playActions(c, id, mid.view.session.stateVersion, win.slice(7));
    captured.set('score', (await c.get(`/sessions/${id}/score`)).body);
    captured.set('report', (await c.get(`/sessions/${id}/result`)).body);
    captured.set('progress', (await c.get('/me/progress')).body);
    captured.set('error', (await c.get(`/sessions/${randomUUID()}`)).body);
  });
  afterAll(() => t?.close());

  const NAMES = [
    'me',
    'case-list',
    'case-detail',
    'start',
    'choose',
    'progress',
    'evidence',
    'scenes',
    'characters',
    'score',
    'report',
    'error',
  ];

  for (const name of NAMES) {
    it(`${name}.json matches the live response`, () => {
      const actual = normalize(captured.get(name), ctx);
      const file = `${DIR}${name}.json`;
      if (UPDATE || !existsSync(file)) {
        mkdirSync(DIR, { recursive: true });
        writeFileSync(file, `${JSON.stringify(actual, null, 2)}\n`);
      }
      expect(actual).toEqual(JSON.parse(readFileSync(file, 'utf8')));
    });
  }
});
