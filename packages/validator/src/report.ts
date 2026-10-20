import type { Action, CasePackage, Category } from '@mudafaa/case-schema';
import { ENGINE_VERSION, compile } from '@mudafaa/engine';
import { runGoldenPaths } from './golden.js';
import type { GoldenResult } from './golden.js';
import { error, info, warning } from './issues.js';
import type { Issue } from './issues.js';
import { explore } from './simulate/explore.js';
import type { ExploreResult } from './simulate/explore.js';
import { staticChecks } from './static/index.js';

export interface ValidationReport {
  status: 'PASSED' | 'FAILED';
  slug?: string;
  title?: string;
  packageHash?: string;
  engineVersion: number;
  summary: { errors: number; warnings: number; infos: number };
  issues: Issue[];
  simulation?: ExploreResult;
  goldenPaths?: GoldenResult[];
  /** Yayında `case_versions.analysis`'e yazılır; rapor beceri tavsiyeleri `categoryMax`'ı kullanır. */
  analysis?: { categoryMax: Record<Category, number>; finalMin: number; finalMax: number };
}

export interface ValidateOptions {
  strict?: boolean;
  maxStates?: number;
  maxMs?: number;
  walks?: number;
}

/** Bu statik hatalar varken motor güvenle çalıştırılamaz (tür hatası, rotasız DECISION, döngü…): simülasyon atlanır. */
const SIMULATION_BLOCKERS: ReadonlySet<string> = new Set([
  'RESERVED_ID',
  'TYPE_MISMATCH',
  'DECISION_NO_DEFAULT',
  'DECISION_CYCLE',
  'MISSING_FALLBACK',
]);

/** Tanık aksiyon dizisinin kısa gösterimi. */
export function formatActions(actions: readonly Action[]): string {
  return actions
    .map((a) => {
      switch (a.kind) {
        case 'CHOOSE':
          return a.variant === undefined ? a.choiceId : `${a.choiceId}/${a.variant}`;
        case 'TAP':
          return `TAP(${a.x},${a.y})`;
        case 'EXAMINE':
          return `${a.tool}×${a.target}`;
        case 'COMBINE':
          return `${a.a}+${a.b}`;
        case 'PRESS':
          return `PRESS ${a.statementId}`;
        case 'PRESENT':
          return a.statementId === undefined ? `PRESENT ${a.evidenceId}` : `PRESENT ${a.evidenceId}→${a.statementId}`;
        case 'OBJECT':
          return a.statementId === undefined ? `OBJECT ${a.groundId}` : `OBJECT ${a.groundId}→${a.statementId}`;
      }
    })
    .join(' › ');
}

function finish(issues: Issue[], extra: Partial<ValidationReport> = {}): ValidationReport {
  const count = (s: Issue['severity']): number => issues.filter((i) => i.severity === s).length;
  const summary = { errors: count('ERROR'), warnings: count('WARNING'), infos: count('INFO') };
  return {
    status: summary.errors === 0 ? 'PASSED' : 'FAILED',
    engineVersion: ENGINE_VERSION,
    summary,
    issues,
    ...extra,
  };
}

/**
 * Bir CasePackage'ı uçtan uca doğrular (docs/plan.md §9): derleme (şema, kimlik, referans), statik kontroller, durum
 * uzayı simülasyonu ve golden path'ler. ERROR yoksa PASSED. Yayın kapısı: her sonuç simülasyonla ya da bir golden
 * path ile ulaşılabilir; softlock, çıkmaz, skor döngüsü ve görünüm sızıntısı yok.
 */
export function validatePackage(input: unknown, opts: ValidateOptions = {}): ValidationReport {
  const compiled = compile(input);
  if (!compiled.ok) return finish(compiled.issues);
  const c = compiled.c;
  const pkg = c.pkg as CasePackage;
  const meta = { slug: pkg.meta.slug, title: pkg.meta.title, packageHash: c.hash };
  const issues: Issue[] = [...compiled.warnings, ...staticChecks(pkg, c, opts)];
  const golden = runGoldenPaths(c);
  golden.forEach((g, i) => {
    if (!g.passed)
      issues.push(error('GOLDEN_PATH_FAILED', `tests.goldenPaths[${i}]`, `${g.name}: ${g.error ?? 'başarısız'}`));
  });
  if (issues.some((i) => i.severity === 'ERROR' && SIMULATION_BLOCKERS.has(i.code))) {
    issues.push(info('SIMULATION_SKIPPED', '', 'Statik hatalar motoru güvensiz kıldığı için simülasyon atlandı'));
    return finish(issues, { ...meta, goldenPaths: golden });
  }

  let sim: ExploreResult;
  try {
    sim = explore(c, {
      ...(opts.maxStates === undefined ? {} : { maxStates: opts.maxStates }),
      ...(opts.maxMs === undefined ? {} : { maxMs: opts.maxMs }),
      ...(opts.walks === undefined ? {} : { walks: opts.walks }),
      scripts: (pkg.tests?.goldenPaths ?? []).map((g) => g.actions),
    });
  } catch (e) {
    issues.push(error('SIMULATION_ERROR', '', `Simülasyon çalışmadı: ${e instanceof Error ? e.message : String(e)}`));
    return finish(issues, { ...meta, goldenPaths: golden });
  }
  if (sim.aborted) {
    issues.push(
      error('SIMULATION_ABORTED', '', `Süre sınırı aşıldı (${sim.states} durum); sonuç eksik, yeniden çalıştırın`),
    );
  } else if (!sim.complete) {
    issues.push(
      warning(
        'SIMULATION_INCOMPLETE',
        '',
        `BFS durum bütçesinde kesildi (${sim.states} durum); derin durumlar ${sim.walks} yürüyüş ve kaçış aramasıyla ` +
          `örneklendi, ${sim.frontierUnchecked} sınır durumu denetlenmedi`,
      ),
    );
  }
  pkg.outcomes.forEach((o, i) => {
    if (!sim.outcomes[o.id]?.reached && !golden.some((g) => g.passed && g.outcome === o.id)) {
      issues.push(error('OUTCOME_UNREACHABLE', `outcomes[${i}]`, `${o.id} sonucuna hiçbir yolla ulaşılamıyor`));
    }
  });
  for (const d of sim.rejected) {
    issues.push(
      error(
        'ACTION_REJECTED',
        d.key,
        `Sunulan aksiyon motorca reddedildi (${d.code}: ${d.message}); tanık: ${formatActions(d.witness)}`,
      ),
    );
  }
  for (const d of sim.engineErrors) {
    issues.push(error('ENGINE_ERROR', d.key, `Motor hatası: ${d.message}; tanık: ${formatActions(d.witness)}`));
  }
  for (const d of sim.deadEnds) {
    issues.push(error('DEAD_END', d.key, `Seçeneksiz durum; tanık: ${formatActions(d.witness)}`));
  }
  for (const d of sim.softlocks) {
    issues.push(error('SOFTLOCK', d.key, `Bu durumdan dava sonuna ulaşılamıyor; tanık: ${formatActions(d.witness)}`));
  }
  const unverifiedLevel = opts.strict === true ? error : warning;
  for (const d of sim.unverified) {
    issues.push(
      unverifiedLevel(
        'SOFTLOCK_UNVERIFIED',
        d.key,
        `Kaçış araması bütçesinde dava sonuna ulaşılamadı; tanık: ${formatActions(d.witness)}`,
      ),
    );
  }
  for (const key of sim.scoreLoops)
    issues.push(error('SCORE_LOOP', key, 'Tekrarlanabilen döngü skoru sınırsız artırıyor'));
  for (const key of sim.penaltyLoops) {
    issues.push(warning('PENALTY_LOOP', key, 'Kaynak tüketmeden tekrarlanabilen döngü skoru düşürüyor'));
  }
  for (const l of sim.leaks) issues.push(error('LEAK', l.key, `Görünümde gizli bilgi: ${l.token}`));
  const unreachedLevel = sim.complete ? error : warning;
  const unreached = (code: string, ids: readonly string[], what: string): void => {
    if (ids.length > 0) {
      issues.push(unreachedLevel(code, '', `Ulaşılamayan ${what} (${ids.length}): ${ids.slice(0, 20).join(', ')}`));
    }
  };
  unreached('UNREACHED_NODE', sim.coverage.nodes.missing, "node'lar");
  unreached('UNREACHED_CHOICE', [...sim.coverage.choices.missing, ...sim.coverage.variants.missing], 'seçenekler');
  unreached('UNREACHED_RULE', [...sim.coverage.rules.missing, ...sim.coverage.fallbacks.missing], 'kurallar');
  return finish(issues, {
    ...meta,
    simulation: sim,
    goldenPaths: golden,
    analysis: { categoryMax: sim.categoryMax, finalMin: sim.finalMin, finalMax: sim.finalMax },
  });
}
