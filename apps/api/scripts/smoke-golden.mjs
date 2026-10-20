// Duman testi: çalışan API'de (localhost:3000, Auth Emulator 9099) bir davanın golden path'ini HTTP'den oynatır.
// Kullanım: node scripts/smoke-golden.mjs <dava dizini> [yol adı]
import { randomUUID } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const [dir, name] = process.argv.slice(2);
const tests = JSON.parse(
  readFileSync(
    join(
      dir,
      readdirSync(dir).find((f) => f.includes('tests')),
    ),
    'utf8',
  ),
).tests;
const path = tests.goldenPaths.find((g) => g.name === (name ?? tests.goldenPaths[0].name));
const API = 'http://localhost:3000/v1';
const { idToken } = await (
  await fetch('http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"returnSecureToken":true}',
  })
).json();
const h = { Authorization: `Bearer ${idToken}`, 'Content-Type': 'application/json' };
const cases = await (await fetch(`${API}/cases`, { headers: h })).json();
const card = cases.items.find((c) => c.slug === JSON.parse(readFileSync(join(dir, '00-meta.json'), 'utf8')).meta.slug);
let { session, view } = await (
  await fetch(`${API}/cases/${card.id}/start`, { method: 'POST', headers: h, body: '{}' })
).json();
for (const action of path.actions) {
  const res = await fetch(`${API}/sessions/${session.id}/choose`, {
    method: 'POST',
    headers: h,
    body: JSON.stringify({ clientActionId: randomUUID(), expectedStateVersion: view.session.stateVersion, action }),
  });
  const body = await res.json();
  if (res.status !== 200) {
    console.error('HATA', res.status, body, action);
    process.exit(1);
  }
  view = body.view;
}
const me = await (await fetch(`${API}/me`, { headers: h })).json();
console.log(
  path.name,
  view.node.type,
  view.node.outcome?.id,
  'total',
  view.node.total,
  'beklenen',
  path.expect.outcome,
  '· xp',
  me.stats.xp,
);
const rep = await fetch(`${API}/sessions/${session.id}/result`, { headers: h });
console.log('rapor', rep.status);
