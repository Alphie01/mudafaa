import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { SpriteDef } from '@mudafaa/case-schema';
import type { CasePackage } from '@mudafaa/case-schema';
import { canonicalJson, compile } from '@mudafaa/engine';
import { loadCase, validatePackage } from '@mudafaa/validator';
import type { ValidateOptions, ValidationReport } from '@mudafaa/validator';
import { buildCase, issueLine } from './lib/build.js';
import { durationReport, formatDuration } from './lib/duration.js';
import { UsageError, assertSlug, caseOutDir, caseSrcDir, repoRoot, sharedSpritesDir } from './lib/paths.js';
import { scaffoldCase } from './lib/scaffold.js';
import { renderSceneHtml } from './lib/scenes.js';
import { checkSprite, renderSpritePreview } from './lib/sprite.js';

// Yazım kiti komutları (kökten `npm run case:<komut> -- …`):
//   new <slug> <numara> · build <slug> · validate <slug> · duration <slug> · scenes <slug> · sprite-preview <dosya>
// Çıkış kodu: 0 başarılı, 1 içerik hatası / hedef dışı süre, 2 kullanım ya da dosya hatası.

export interface Io {
  out: (text: string) => void;
  err: (text: string) => void;
}

const defaultIo: Io = { out: (t) => void process.stdout.write(t), err: (t) => void process.stderr.write(t) };

/**
 * Uzun davalar (90–120 dk) için doğrulayıcı bütçeleri. Sayı bütçeleri deterministiktir; `maxMs` yalnızca sert
 * güvenlik sınırıdır. Gerekçe ve ölçümler: docs/content/kit-report.md.
 */
export const LONG_CASE_BUDGETS: Required<Pick<ValidateOptions, 'maxStates' | 'walks' | 'maxMs'>> = {
  maxStates: 20_000,
  walks: 400,
  maxMs: 600_000,
};

/** `--anahtar değer` ve bayrakları ayırır. */
function parseArgs(argv: readonly string[], numeric: readonly string[], bools: readonly string[]) {
  const positional: string[] = [];
  const nums: Record<string, number> = {};
  const flagsOn = new Set<string>();
  const strs: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i] ?? '';
    if (!a.startsWith('--')) {
      positional.push(a);
      continue;
    }
    const key = a.slice(2);
    if (bools.includes(key)) flagsOn.add(key);
    else if (numeric.includes(key)) {
      const n = Number(argv[++i]);
      if (!Number.isInteger(n) || n <= 0) throw new UsageError(`${a} pozitif tamsayı ister`);
      nums[key] = n;
    } else if (key === 'out') strs.out = argv[++i] ?? '';
    else throw new UsageError(`Bilinmeyen seçenek: ${a}`);
  }
  return { positional, nums, flags: flagsOn, strs };
}

function humanReport(path: string, r: ValidationReport): string {
  const lines = [
    `${path}: ${r.status} — ${r.summary.errors} hata, ${r.summary.warnings} uyarı, ${r.summary.infos} bilgi`,
  ];
  const sim = r.simulation;
  if (sim !== undefined) {
    const outcomes = Object.entries(sim.outcomes)
      .map(([id, o]) => `${id} ${o.reached ? '✓' : '✗'}`)
      .join(', ');
    lines.push(
      `  simülasyon: ${sim.states} durum, ${sim.edges} geçiş, ${sim.walks} yürüyüş, BFS ${sim.complete ? 'tam' : 'kesildi'}; sonuçlar: ${outcomes}`,
    );
    const cov = sim.coverage;
    lines.push(
      `  kapsam: node ${cov.nodes.reached}/${cov.nodes.total}, seçenek ${cov.choices.reached}/${cov.choices.total}, kural ${cov.rules.reached}/${cov.rules.total}, delil ${cov.evidence.reached}/${cov.evidence.total}`,
    );
    lines.push(`  final skor aralığı: ${sim.finalMin}…${sim.finalMax}`);
  }
  if (r.goldenPaths !== undefined) {
    lines.push(`  golden path: ${r.goldenPaths.filter((g) => g.passed).length}/${r.goldenPaths.length}`);
    for (const g of r.goldenPaths) {
      lines.push(
        `    ${g.passed ? '✓' : '✗'} ${g.name}: ${g.outcome ?? '—'} ${g.final ?? ''}${g.error ? ` (${g.error})` : ''}`,
      );
    }
  }
  for (const i of r.issues) lines.push(issueLine(i));
  return `${lines.join('\n')}\n`;
}

async function cmdNew(args: string[], io: Io): Promise<number> {
  const { positional } = parseArgs(args, [], []);
  const { files } = await scaffoldCase(positional[0], positional[1]);
  io.out(
    `İskelet yazıldı (${files.length} dosya):\n${files.map((f) => `  ${f.slice(repoRoot.length + 1)}`).join('\n')}\n`,
  );
  io.out(`Sonraki adım: npm run case:build -- ${positional[0] ?? ''}\n`);
  return 0;
}

async function cmdBuild(args: string[], io: Io): Promise<number> {
  const slug = assertSlug(parseArgs(args, [], []).positional[0]);
  const r = await buildCase(slug);
  io.out(`${r.files.length} parça yazıldı: content/cases/${slug}/{${r.files.join(', ')}}\n`);
  for (const w of r.warnings) io.out(`${issueLine(w)}\n`);
  if (!r.ok) {
    io.err(`Derleme hatası (${r.issues.length}):\n${r.issues.map(issueLine).join('\n')}\n`);
    return 1;
  }
  io.out('Derleme: OK\n');
  return 0;
}

/** Kaynak varsa yeniden üretip yazılı JSON'la karşılaştırır (eski derleme uyarısı). */
async function staleCheck(slug: string, loaded: unknown): Promise<string | undefined> {
  if (!existsSync(join(caseSrcDir(slug), 'index.ts'))) return undefined;
  const fresh = await buildCase(slug, { write: false });
  return canonicalJson(fresh.merged) === canonicalJson(loaded)
    ? undefined
    : `UYARI: content/cases/${slug} kaynaktan eski; önce npm run case:build -- ${slug}\n`;
}

async function cmdValidate(args: string[], io: Io): Promise<number> {
  const { positional, nums, flags } = parseArgs(
    args,
    ['max-states', 'walks', 'max-ms'],
    ['strict', 'no-duration-gate'],
  );
  const slug = assertSlug(positional[0]);
  const dir = caseOutDir(slug);
  const loaded = await loadCase(dir);
  const stale = await staleCheck(slug, loaded);
  if (stale !== undefined) io.out(stale);
  const opts: ValidateOptions = {
    maxStates: nums['max-states'] ?? LONG_CASE_BUDGETS.maxStates,
    walks: nums.walks ?? LONG_CASE_BUDGETS.walks,
    maxMs: nums['max-ms'] ?? LONG_CASE_BUDGETS.maxMs,
    ...(flags.has('strict') ? { strict: true } : {}),
  };
  const began = Date.now();
  const report = validatePackage(loaded, opts);
  io.out(humanReport(`content/cases/${slug}`, report));
  io.out(
    `  süre: ${((Date.now() - began) / 1000).toFixed(1)} sn (bütçe: ${opts.maxStates} durum, ${opts.walks} yürüyüş)\n`,
  );
  let durationOk = true;
  const compiled = compile(loaded);
  if (compiled.ok) {
    const d = durationReport(compiled.c);
    io.out(formatDuration(d));
    durationOk = d.inRange || flags.has('no-duration-gate');
  }
  return report.status === 'PASSED' && durationOk ? 0 : 1;
}

async function cmdDuration(args: string[], io: Io): Promise<number> {
  const slug = assertSlug(parseArgs(args, [], []).positional[0]);
  const compiled = compile(await loadCase(caseOutDir(slug)));
  if (!compiled.ok) {
    io.err(`Derleme hatası:\n${compiled.issues.map(issueLine).join('\n')}\n`);
    return 1;
  }
  const d = durationReport(compiled.c);
  io.out(`content/cases/${slug}\n${formatDuration(d)}`);
  return d.inRange ? 0 : 1;
}

async function cmdScenes(args: string[], io: Io): Promise<number> {
  const slug = assertSlug(parseArgs(args, [], []).positional[0]);
  const srcDir = join(caseSrcDir(slug), 'scenes');
  if (!existsSync(srcDir)) throw new UsageError(`${srcDir} yok`);
  const names = readdirSync(srcDir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => f.replace(/\.html$/, ''))
    .sort();
  // Derlenmiş dava varsa beklenen boyut SceneDef'ten gelir (görseli `assets/scenes/<ad>@4x.png` olan sahneler).
  const expected = new Map<string, { width: number; height: number }>();
  const outDir = join(caseOutDir(slug), 'assets/scenes');
  if (existsSync(join(caseOutDir(slug), '00-meta.json'))) {
    const pkg = (await loadCase(caseOutDir(slug))) as Partial<CasePackage>;
    for (const sc of pkg.scenes ?? []) {
      const asset = (pkg.assets ?? []).find((a) => a.id === sc.image);
      const m = asset === undefined ? null : /^assets\/scenes\/(.+)@4x\.png$/.exec(asset.path);
      if (m?.[1] !== undefined) expected.set(m[1], { width: sc.width, height: sc.height });
    }
    for (const name of expected.keys())
      if (!names.includes(name)) io.err(`UYARI: ${name}.html yok (SceneDef görseli)\n`);
  }
  const rendered = await renderSceneHtml(
    names.map((name) => ({ name, html: readFileSync(join(srcDir, `${name}.html`), 'utf8'), ...expected.get(name) })),
    outDir,
  );
  for (const r of rendered) io.out(`  ${r.file.slice(repoRoot.length + 1)} (${r.width}×${r.height} → ×4)\n`);
  return 0;
}

async function cmdSpritePreview(args: string[], io: Io): Promise<number> {
  const { positional, strs } = parseArgs(args, [], []);
  const arg = positional[0];
  if (arg === undefined)
    throw new UsageError('Kullanım: npm run case:sprite-preview -- <dosya | content/shared/sprites içindeki ad>');
  const candidates = [resolve(arg), join(sharedSpritesDir(), arg), join(sharedSpritesDir(), `${arg}.json`)];
  const file = candidates.find((p) => existsSync(p) && p.endsWith('.json'));
  if (file === undefined) throw new UsageError(`Sprite dosyası bulunamadı: ${arg}`);
  const value: unknown = JSON.parse(readFileSync(file, 'utf8'));
  const problems = checkSprite(value);
  const parsed = SpriteDef.safeParse(value);
  if (!parsed.success && problems.length === 0) problems.push(...parsed.error.issues.map((i) => i.message));
  if (problems.length > 0 || !parsed.success) {
    io.err(`${file}: geçersiz sprite\n${problems.map((p) => `  ${p}`).join('\n')}\n`);
    return 1;
  }
  const outDir = strs.out ?? join(tmpdir(), 'mudafaa-sprite-preview');
  mkdirSync(outDir, { recursive: true });
  const out = join(outDir, `${basename(file, '.json')}.png`);
  writeFileSync(out, renderSpritePreview(parsed.data));
  io.out(`Önizleme (normal · mutlu · kızgın · şaşkın · üzgün): ${out}\n`);
  return 0;
}

const COMMANDS: Record<string, (args: string[], io: Io) => Promise<number>> = {
  new: cmdNew,
  build: cmdBuild,
  validate: cmdValidate,
  duration: cmdDuration,
  scenes: cmdScenes,
  'sprite-preview': cmdSpritePreview,
};

export async function main(argv: readonly string[], io: Io = defaultIo): Promise<number> {
  const [command, ...rest] = argv;
  const run = command === undefined ? undefined : COMMANDS[command];
  if (run === undefined) {
    io.err(`Kullanım: cli.ts <${Object.keys(COMMANDS).join(' | ')}> …\n`);
    return 2;
  }
  try {
    return await run(rest, io);
  } catch (e) {
    if (e instanceof UsageError || (e instanceof Error && e.name === 'LoadError')) {
      io.err(`${e.message}\n`);
      return 2;
    }
    io.err(`${e instanceof Error ? e.message : String(e)}\n`);
    return 1;
  }
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = await main(process.argv.slice(2));
}
