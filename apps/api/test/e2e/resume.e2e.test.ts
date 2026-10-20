import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { bootstrapApp, client, type TestApp } from './support/app.js';
import { publishFixture, type Published } from './support/cases.js';
import { emulatorUser } from './support/emulator.js';
import { dava07 } from './support/fixtures.js';
import { goldenPath, playActions, startCase } from './support/play.js';

// Kaydet/devam: uygulama kapatılıp aynı veritabanı ve Redis ile yeniden açılınca oturum kaldığı yerden sürer.
describe('resume after restart', () => {
  let t: TestApp;
  let d07: Published;

  beforeAll(async () => {
    t = await bootstrapApp();
    d07 = await publishFixture(t, await dava07(), { prefix: 'res' });
  });
  afterAll(() => t?.close());

  it('current-node after restart equals the last view; start resumes with 200', async () => {
    const u = await emulatorUser();
    const started = await startCase(client(t.app, u.idToken), d07.caseId);
    expect(started.status).toBe(201);
    const id = started.body.session.id;
    const last = await playActions(client(t.app, u.idToken), id, 0, goldenPath(d07.pkg, 'G1').slice(0, 10));

    await t.close();
    t = await bootstrapApp();
    const c = client(t.app, u.idToken);
    const current = await c.get(`/sessions/${id}/current-node`);
    expect(current.status).toBe(200);
    expect(current.body).toEqual(last.view);
    const again = await startCase(c, d07.caseId);
    expect(again.status).toBe(200);
    expect(again.body.session.id).toBe(id);
    expect(again.body.view).toEqual(last.view);
  });
});
