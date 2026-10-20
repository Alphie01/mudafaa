import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { mergeCaseParts } from '@mudafaa/case-schema';
import { act, compile, start, view } from '@mudafaa/engine';
const [name] = process.argv.slice(2);
const dir = 'content/cases/zarf';
const files = (await readdir(dir)).filter((f) => /^\d{2}-.*\.json$/.test(f)).sort();
const pkg = mergeCaseParts(await Promise.all(files.map(async (f) => JSON.parse(await readFile(join(dir, f), 'utf8')))));
const c = (compile(pkg) as any).c;
const acts = pkg.tests!.goldenPaths.find((g: any) => g.name === name)!.actions;
const st: any = start(c);
let s: any = st.state;
const pr = (ls: any[]) => { for (const l of ls ?? []) console.log(`${l.speaker ?? ''}${l.name ? '(' + l.name + ')' : ''}${l.style ? '[' + l.style + ']' : ''}: ${l.text}`); };
const v0: any = view(c, s, {} as any); console.log('##', s.nodeId); pr(v0.lines);
for (const a of acts) { const r: any = act(c, s, a); s = r.state; console.log('>>', JSON.stringify(a)); pr(r.result?.lines); const v: any = view(c, s, {} as any); console.log('##', s.nodeId); pr(v.lines); }
