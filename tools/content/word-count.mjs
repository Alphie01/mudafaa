// Dava metin ölçümü: golden path'leri motorla baştan oynatır ve oyuncunun gördüğü satırları sayar.
// Kullanım: npm run build && node tools/content/word-count.mjs [dava-dizini] [--path AD] [--chapters]
//  - Yol başına: görülen satırların sözcükleri (view.lines + view.last.lines + karar ekranındaki epilog; aynı satır
//    bir kez sayılır), bölüm (chapter) dökümü ve en uzun satır.
//  - Paket toplamı: bütün satırlar (node satırları, yanıtlar, varyant yanıtları, CHOICE soruları, epiloglar) ve
//    ekran metinleri (etiketler, geri bildirimler, ifadeler, hüküm/gerekçe) ayrı ayrı.
import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { mergeCaseParts } from '../../packages/case-schema/dist/index.js';
import { act, compile, start, view } from '../../packages/engine/dist/index.js';

const args = process.argv.slice(2);
const onlyPath = args.includes('--path') ? args[args.indexOf('--path') + 1] : undefined;
const positional = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--path');
const dir = resolve(positional[0] ?? 'content/cases/gece-bekcisinin-sirri');
const showChapters = args.includes('--chapters');

const countWords = (text) => text.split(/\s+/u).filter((t) => /[\p{L}\p{N}]/u.test(t)).length;
const META = { sessionId: 'wc', caseId: 'wc', stateVersion: 0, mode: 'TEST' };

const files = (await readdir(dir)).filter((f) => /^\d{2}-.*\.json$/.test(f)).sort();
const parts = await Promise.all(files.map(async (f) => JSON.parse(await readFile(join(dir, f), 'utf8'))));
const pkg = mergeCaseParts(parts);
const compiled = compile(pkg);
if (!compiled.ok) {
  console.error('Derleme hatası:', compiled.issues.slice(0, 5));
  process.exit(1);
}
const c = compiled.c;

function replay(gp) {
  const seen = new Set();
  const byChapter = new Map();
  let words = 0;
  let longest = 0;
  let s = start(c).state;
  const take = (v) => {
    const chapter = v.header.chapter ?? v.session.progressLabel ?? '—';
    const lines = [...(v.last?.lines ?? []), ...v.lines, ...(v.node.type === 'RESULT' ? (v.node.epilogue ?? []) : [])];
    for (const l of lines) {
      const key = `${l.speaker}|${l.text}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const n = countWords(l.text);
      words += n;
      longest = Math.max(longest, l.text.length);
      byChapter.set(chapter, (byChapter.get(chapter) ?? 0) + n);
    }
  };
  take(view(c, s, META));
  let actions = 0;
  for (const a of gp.actions) {
    const r = act(c, s, a);
    if (!r.ok) return { name: gp.name, error: `${actions + 1}. aksiyon reddedildi: ${r.code} ${JSON.stringify(a)}` };
    s = r.state;
    actions += 1;
    take(view(c, s, META));
  }
  return { name: gp.name, words, actions, longest, outcome: s.outcome?.id, final: s.outcome?.final, byChapter };
}

function packageTotals() {
  let lineWords = 0;
  let screenWords = 0;
  let lines = 0;
  let longest = { len: 0, text: '' };
  const addLines = (ls) => {
    for (const l of ls ?? []) {
      lines += 1;
      lineWords += countWords(l.text);
      if (l.text.length > longest.len) longest = { len: l.text.length, text: l.text };
    }
  };
  const addBlocks = (bs) => (bs ?? []).forEach((b) => addLines(b.lines));
  const addScreen = (t) => {
    if (typeof t === 'string') screenWords += countWords(t);
  };
  for (const n of pkg.nodes) {
    addBlocks(n.lines);
    if (n.prompt) addLines([n.prompt]);
    for (const ch of n.choices) {
      addBlocks(ch.responses);
      for (const v of ch.variants ?? []) {
        addBlocks(v.responses);
        addScreen(v.label);
        addScreen(v.prompt);
        addScreen(v.quality?.feedback);
      }
      [ch.label, ch.description, ch.prompt, ch.quality?.feedback, ch.feedback?.title, ch.feedback?.text].forEach(
        addScreen,
      );
    }
    for (const st of n.statements ?? []) addScreen(st.segments.map((x) => x.text).join(''));
    if (n.quickTalk) addScreen(n.quickTalk.line);
  }
  for (const o of pkg.outcomes) {
    addBlocks(o.epilogue);
    [o.verdictText, o.howToReach, o.ethicsCard, ...o.reasoning.map((r) => r.text)].forEach(addScreen);
  }
  for (const sc of pkg.scenes) for (const ob of sc.objects) addScreen(ob.feedback?.text);
  return { lines, lineWords, screenWords, longest };
}

const paths = (pkg.tests?.goldenPaths ?? []).filter((g) => onlyPath === undefined || g.name === onlyPath);
console.log(`${pkg.meta.title} — golden path başına görülen satır sözcükleri:`);
for (const gp of paths) {
  const r = replay(gp);
  if (r.error !== undefined) {
    console.log(`  ${r.name.padEnd(6)} HATA: ${r.error}`);
    continue;
  }
  console.log(
    `  ${r.name.padEnd(6)} ${String(r.words).padStart(6)} sözcük  ${String(r.actions).padStart(4)} aksiyon  ` +
      `en uzun satır ${r.longest} kr  → ${r.outcome} (${r.final})`,
  );
  if (showChapters) for (const [ch, n] of r.byChapter) console.log(`           ${String(n).padStart(6)}  ${ch}`);
}
const t = packageTotals();
console.log(
  `Paket: ${t.lines} satır, ${t.lineWords} satır sözcüğü; ekran metinleri ${t.screenWords} sözcük; ` +
    `toplam ${t.lineWords + t.screenWords}. En uzun satır ${t.longest.len} kr.`,
);
