import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { actionBody, bootstrapApp, client, type Client, type TestApp } from './support/app.js';
import { publishFixture, type Published } from './support/cases.js';
import { emulatorUser } from './support/emulator.js';
import { miniCase } from './support/fixtures.js';
import { goldenPath, startAndPlay } from './support/play.js';

// Oturum sahipliği: başkasının oturumu ile var olmayan oturum aynı 404'ü alır; PLAYER /admin'de 403 alır.
describe('ownership', () => {
  let t: TestApp;
  let mini: Published;
  let alice: Client;
  let bob: Client;
  let aliceSession: string;

  beforeAll(async () => {
    t = await bootstrapApp();
    mini = await publishFixture(t, miniCase(), { prefix: 'own' });
    alice = client(t.app, (await emulatorUser()).idToken);
    bob = client(t.app, (await emulatorUser()).idToken);
    aliceSession = (await startAndPlay(alice, mini.caseId, goldenPath(mini.pkg, 'gp_win'))).sessionId;
  });
  afterAll(() => t?.close());

  const calls = (c: Client, id: string) => [
    () => c.get(`/sessions/${id}`),
    () => c.get(`/sessions/${id}/current-node`),
    () => c.get(`/sessions/${id}/evidence`),
    () => c.get(`/sessions/${id}/scenes`),
    () => c.get(`/sessions/${id}/characters`),
    () => c.get(`/sessions/${id}/score`),
    () => c.get(`/sessions/${id}/result`),
    () => c.post(`/sessions/${id}/choose`, actionBody(0, { kind: 'CHOOSE', choiceId: 'ch_str_a' })),
    () => c.post(`/sessions/${id}/abandon`),
  ];
  const strip = (body: Record<string, unknown>) => ({ ...body, requestId: undefined });

  it('foreign session 404 everywhere, identical to an unknown id', async () => {
    const foreign = calls(bob, aliceSession);
    const unknown = calls(bob, randomUUID());
    for (let i = 0; i < foreign.length; i++) {
      const [a, b] = [await foreign[i]?.(), await unknown[i]?.()];
      expect(a?.status, `çağrı ${i}`).toBe(404);
      expect(b?.status, `çağrı ${i}`).toBe(404);
      expect(strip(a?.body as Record<string, unknown>)).toEqual(strip(b?.body as Record<string, unknown>));
    }
    // Sahibi için hepsi erişilebilir (oturum bitti: choose/abandon 409).
    expect((await alice.get(`/sessions/${aliceSession}/result`)).status).toBe(200);
  });

  it('PLAYER gets 403 on every admin route', async () => {
    const id = randomUUID();
    const routes: [string, string][] = [
      ['post', '/admin/cases'],
      ['get', '/admin/cases'],
      ['get', `/admin/cases/${id}`],
      ['patch', `/admin/cases/${id}`],
      ['delete', `/admin/cases/${id}`],
      ['post', '/admin/cases/import'],
      ['get', `/admin/cases/${id}/versions`],
      ['post', `/admin/cases/${id}/versions`],
      ['get', `/admin/cases/${id}/versions/${id}/package`],
      ['put', `/admin/cases/${id}/versions/${id}/package`],
      ['get', `/admin/cases/${id}/export`],
      ['post', `/admin/cases/${id}/validate`],
      ['get', `/admin/validations/${id}`],
      ['post', `/admin/cases/${id}/publish`],
      ['post', `/admin/cases/${id}/test-sessions`],
      ['post', '/admin/assets'],
      ['get', '/admin/audit-logs'],
      ['patch', `/admin/users/${id}/role`],
    ];
    for (const [method, path] of routes) {
      const res = await (
        bob as unknown as Record<string, (p: string) => Promise<{ status: number; body: { error: string } }>>
      )[method]?.(path);
      expect(res?.status, `${method} ${path}`).toBe(403);
      expect(res?.body.error).toBe('forbidden');
    }
  });
});
