import { randomUUID } from 'node:crypto';
import { CaseCard, CaseDetail, CaseListResponse } from '@mudafaa/case-schema';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { bootstrapApp, client, type TestApp } from './support/app.js';
import { publishFixture, type Published } from './support/cases.js';
import { emulatorUser } from './support/emulator.js';
import { dava07, miniCase } from './support/fixtures.js';

// Dava kataloğu: kart durumu, rütbe kilitleri, sekmeler ve spoiler'sız ayrıntı.
describe('case catalogue', () => {
  let t: TestApp;
  let mini: Published;
  let d07: Published;
  let locked: Published;

  beforeAll(async () => {
    t = await bootstrapApp();
    mini = await publishFixture(t, miniCase(), { prefix: 'cat-mini' });
    d07 = await publishFixture(t, await dava07(), { prefix: 'cat-07' });
    locked = await publishFixture(t, miniCase(), { prefix: 'cat-lock', requiredRank: 'KIDEMLI' });
  });
  afterAll(() => t?.close());

  it('tabs, statuses and locks for a new user', async () => {
    const c = client(t.app, (await emulatorUser()).idToken);
    const active = CaseListResponse.parse((await c.get('/cases?tab=active')).body);
    const ids = active.items.map((x) => x.id);
    expect(ids).toEqual(expect.arrayContaining([mini.caseId, d07.caseId]));
    expect(ids).not.toContain(locked.caseId);
    for (const card of active.items) expect(['NEW', 'IN_PROGRESS']).toContain(CaseCard.parse(card).status);
    const numbers = active.items.map((x) => x.number);
    expect([...numbers].sort((a, b) => a - b)).toEqual(numbers);

    const lockedTab = CaseListResponse.parse((await c.get('/cases?tab=locked')).body);
    const card = lockedTab.items.find((x) => x.id === locked.caseId);
    expect(card).toMatchObject({
      status: 'LOCKED',
      lockReason: 'Kıdemli Avukat rütbesi gerekir',
      requiredRank: { key: 'KIDEMLI' },
    });
    expect(active.counts.locked).toBe(lockedTab.items.length);
    expect((await c.get('/cases?tab=nope')).status).toBe(400);
  });

  it('Dava #07 card carries the package meta and the legal review flag', async () => {
    const c = client(t.app, (await emulatorUser()).idToken);
    const list = CaseListResponse.parse((await c.get('/cases')).body);
    const card = list.items.find((x) => x.id === d07.caseId);
    expect(card).toMatchObject({
      lawRef: d07.pkg.meta.lawRef,
      title: d07.pkg.meta.title,
      legalReviewPending: true,
      status: 'NEW',
    });
    const cover = d07.pkg.characters.find((ch) => ch.id === d07.pkg.meta.coverCharacter);
    expect(card?.cover).toMatchObject({ name: cover?.name, accent: cover?.accent });
    expect(list.items.find((x) => x.id === mini.caseId)?.legalReviewPending).toBe(false);
  });

  it('case detail has no spoilers', async () => {
    const c = client(t.app, (await emulatorUser()).idToken);
    const res = await c.get(`/cases/${d07.caseId}`);
    expect(res.status).toBe(200);
    const detail = CaseDetail.parse(res.body);
    expect(detail).toMatchObject({ demandText: d07.pkg.meta.demandText, completedCount: 0 });
    const text = JSON.stringify(res.body);
    for (const n of d07.pkg.nodes) expect(text).not.toContain(`"${n.id}"`);
    for (const e of d07.pkg.evidence) expect(text).not.toContain(`"${e.id}"`);
    for (const o of d07.pkg.outcomes) expect(text).not.toContain(o.id);
    // Kilitli dava da görüntülenir (kilit nedeniyle).
    const lockedDetail = await c.get(`/cases/${locked.caseId}`);
    expect(lockedDetail.body).toMatchObject({ status: 'LOCKED', lockReason: 'Kıdemli Avukat rütbesi gerekir' });
  });

  it('unknown case → 404', async () => {
    const c = client(t.app, (await emulatorUser()).idToken);
    expect((await c.get(`/cases/${randomUUID()}`)).status).toBe(404);
    expect((await c.get('/cases/yok')).body).toMatchObject({ error: 'not_found' });
  });
});
