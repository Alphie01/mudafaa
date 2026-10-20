import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { mergeCaseParts } from '@mudafaa/case-schema';
import { act, compile, start } from '@mudafaa/engine';
import { estimateActions } from './src/lib/duration.js';
const [name, goalsArg, outFile] = process.argv.slice(2);
const goals = goalsArg!.split(',');
const dir = 'content/cases/zarf';
const files = (await readdir(dir)).filter((f) => /^\d{2}-.*\.json$/.test(f)).sort();
const pkg = mergeCaseParts(await Promise.all(files.map(async (f) => JSON.parse(await readFile(join(dir, f), 'utf8')))));
const c = (compile(pkg) as any).c;
const base = pkg.tests!.goldenPaths.find((g: any) => g.name === name)!.actions;
function run(actions: any[]) { let s: any = start(c).state; const used: any[] = [];
  for (const a of actions) { if (s.status === 'COMPLETED') break; const r: any = act(c, s, a); if (!r.ok) continue; s = r.state; used.push(a); }
  return { used, out: s.status === 'COMPLETED' ? s.outcome?.id : null, final: s.outcome?.final }; }
let cur = run(base).used;
for (const size of [64, 32, 16, 8, 4, 2, 1]) { let i = 0;
  while (i < cur.length) { const cand = [...cur.slice(0, i), ...cur.slice(i + size)]; const r = run(cand);
    if (r.out && goals.includes(r.out) && r.used.length < cur.length) cur = r.used; else i += size; } }
const r = run(cur); const est: any = estimateActions(c, name + '-min', cur);
console.log(`MIN ${name} -> ${goals}: ${cur.length} actions, ${r.out}, final ${r.final}, words ${est.words}, ${est.minutes?.toFixed?.(1) ?? est.minutes} min`);
if (outFile) await writeFile(outFile, JSON.stringify(cur));
