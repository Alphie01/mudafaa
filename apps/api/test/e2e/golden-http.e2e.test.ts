import { compile } from '@mudafaa/engine';
import { runGoldenPaths } from '@mudafaa/validator';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { bootstrapApp, client, type TestApp } from './support/app.js';
import { publishFixture, type Published } from './support/cases.js';
import { emulatorUser } from './support/emulator.js';
import { dava07 } from './support/fixtures.js';
import { startAndPlay } from './support/play.js';

// Dava #07'nin golden path'leri HTTP'den: her adım ActionRequest, expectedStateVersion bir önceki yanıttan.
describe('Dava #07 golden paths over HTTP', () => {
  let t: TestApp;
  let d07: Published;
  let engine: Map<string, { outcome?: string; final?: number }>;

  beforeAll(async () => {
    t = await bootstrapApp();
    d07 = await publishFixture(t, await dava07(), { prefix: 'gold' });
    const r = compile(d07.pkg);
    if (!r.ok) throw new Error('Dava #07 derlenemedi');
    engine = new Map(runGoldenPaths(r.c).map((g) => [g.name, g]));
  });
  afterAll(() => t?.close());

  const paths = ['G1', 'G2', 'G3', 'G4', 'G5', 'W'];

  it('has the six golden paths', () => {
    expect(d07.pkg.tests?.goldenPaths.map((g) => g.name)).toEqual(paths);
  });

  for (const name of paths) {
    it(`${name} reaches the expected outcome`, async () => {
      const g = d07.pkg.tests?.goldenPaths.find((p) => p.name === name);
      if (g === undefined) throw new Error(name);
      const c = client(t.app, (await emulatorUser()).idToken);
      const { sessionId, last } = await startAndPlay(c, d07.caseId, g.actions);
      expect(last.result.completed).toBe(true);
      const node = last.view.node;
      if (node.type !== 'RESULT') throw new Error(`RESULT bekleniyordu: ${node.type}`);
      expect(node.outcome.id).toBe(g.expect.outcome);
      const score = await c.get(`/sessions/${sessionId}/score`);
      const final = score.body.final as number;
      if (g.expect.finalMin !== undefined) expect(final).toBeGreaterThanOrEqual(g.expect.finalMin);
      if (g.expect.finalMax !== undefined) expect(final).toBeLessThanOrEqual(g.expect.finalMax);
      expect(final).toBe(engine.get(name)?.final);
      const clamp = d07.pkg.config.scoring.displayClampMin; // ekranda gösterilen toplam alttan kırpılabilir
      expect(node.total).toBe(clamp === undefined ? final : Math.max(clamp, final));
      expect((await c.get(`/sessions/${sessionId}/result`)).status).toBe(200);
    });
  }
});
