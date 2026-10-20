import { MeResponse, RankDto } from '@mudafaa/case-schema';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { bootstrapApp, client, type TestApp } from './support/app.js';
import { emulatorUser } from './support/emulator.js';

// Firebase kimliği (Auth Emulator), JIT kullanıcı, profil, hesap silme ve rütbeler.
describe('auth and /me', () => {
  let t: TestApp;

  beforeAll(async () => {
    t = await bootstrapApp();
  });
  afterAll(() => t?.close());

  it('emulator user is JIT-created as PLAYER "Deniz Arslan"', async () => {
    const u = await emulatorUser();
    const res = await client(t.app, u.idToken).get('/me');
    expect(res.status).toBe(200);
    const me = MeResponse.parse(res.body);
    expect(me.user).toMatchObject({ displayName: 'Deniz Arslan', role: 'PLAYER', isAnonymous: false, email: u.email });
    expect(me.stats.xp).toBe(0);
    expect(me.stats.rank.key).toBe('STAJYER');
    expect(typeof me.newCases).toBe('number');
    expect(await t.prisma.user.findUnique({ where: { firebaseUid: u.uid } })).not.toBeNull();
  });

  it('anonymous user is JIT-created', async () => {
    const u = await emulatorUser({ anonymous: true });
    const res = await client(t.app, u.idToken).get('/me');
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({ isAnonymous: true, provider: 'anonymous', email: null });
  });

  it('missing or bogus token → 401 envelope', async () => {
    const none = await t.http().get('/v1/me');
    expect(none.status).toBe(401);
    expect(none.body).toMatchObject({ error: 'unauthorized', requestId: expect.any(String) });
    const bogus = await client(t.app, 'not-a-token').get('/me');
    expect(bogus.status).toBe(401);
    expect(bogus.body.error).toBe('unauthorized');
  });

  it('profile patch updates /me', async () => {
    const u = await emulatorUser();
    const c = client(t.app, u.idToken);
    const res = await c.patch('/me/profile', { displayName: 'Av. Elif', city: 'İzmir', settings: { sound: false } });
    expect(res.status).toBe(200);
    const me = MeResponse.parse((await c.get('/me')).body);
    expect(me.user.displayName).toBe('Av. Elif');
    expect(me.profile).toMatchObject({ city: 'İzmir', settings: { sound: false } });
    expect((await c.patch('/me/profile', { displayName: '' })).status).toBe(400);
  });

  it('deleted account token → 401', async () => {
    const u = await emulatorUser();
    const c = client(t.app, u.idToken);
    expect((await c.get('/me')).status).toBe(200);
    expect((await c.delete('/me')).status).toBe(204);
    const after = await c.get('/me');
    expect(after.status).toBe(401);
    expect(await t.prisma.user.findUnique({ where: { firebaseUid: u.uid } })).toBeNull();
  });

  it('GET /ranks lists the four ranks (public)', async () => {
    const res = await t.http().get('/v1/ranks');
    expect(res.status).toBe(200);
    const ranks = (res.body as unknown[]).map((r) => RankDto.parse(r));
    expect(ranks.map((r) => r.key)).toEqual(['STAJYER', 'AVUKAT', 'KIDEMLI', 'ORTAK']);
    expect(ranks.map((r) => r.minXp)).toEqual([0, 1000, 3000, 6000]);
  });
});
