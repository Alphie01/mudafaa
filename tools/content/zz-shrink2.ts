import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { mergeCaseParts } from '@mudafaa/case-schema';
import { act, compile, start, enumerateActions } from '@mudafaa/engine';
const [startFile, goalsArg, outFile, seedArg] = process.argv.slice(2);
const goals = goalsArg!.split(',');
const dir = 'content/cases/zarf';
const files = (await readdir(dir)).filter((f) => /^\d{2}-.*\.json$/.test(f)).sort();
const pkg = mergeCaseParts(await Promise.all(files.map(async (f) => JSON.parse(await readFile(join(dir, f), 'utf8')))));
const c = (compile(pkg) as any).c;
let seed = Number(seedArg ?? 1);
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
function run(actions: any[]) { let s: any = start(c).state; const used: any[] = [];
  for (const a of actions) { if (s.status === 'COMPLETED') break; const r: any = act(c, s, a); if (!r.ok) continue; s = r.state; used.push(a); }
  return { used, out: s.status === 'COMPLETED' ? s.outcome?.id : null }; }
let cur: any[] = JSON.parse(await readFile(startFile!, 'utf8'));
const ok = (cand: any[]) => { const r = run(cand); return r.out && goals.includes(r.out) ? r.used : null; };
let improved = true;
while (improved) {
  improved = false;
  // swap: replace action i by an alternative available at that state, then delete-shrink
  for (let i = 0; i < cur.length; i++) {
    let s: any = start(c).state; for (const a of cur.slice(0, i)) s = act(c, s, a).state;
    const alts = enumerateActions(c, s).filter((a: any) => JSON.stringify(a) !== JSON.stringify(cur[i]));
    for (const alt of alts) {
      for (const del of [0, 1, 2, 3]) {
        const cand = [...cur.slice(0, i), alt, ...cur.slice(i + 1 + del)];
        const u = ok(cand);
        if (u && u.length < cur.length) { cur = u; improved = true; break; }
      }
      if (improved) break;
    }
    if (improved) break;
  }
  if (!improved) {
    const idx = cur.map((_, i) => i).sort(() => rnd() - 0.5);
    for (const i of idx) { const u = ok([...cur.slice(0, i), ...cur.slice(i + 1)]); if (u && u.length < cur.length) { cur = u; improved = true; break; } }
  }
}
const r = run(cur);
console.log(`MIN2 ${startFile} -> ${r.out}: ${cur.length}`);
if (outFile) await writeFile(outFile, JSON.stringify(cur));
