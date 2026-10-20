import type { Action, CasePackage, Category } from '@mudafaa/case-schema';
import { ENGINE_VERSION, compile } from '@mudafaa/engine';
import { runGoldenPaths } from './golden.js';
import type { GoldenResult } from './golden.js';
import { error, warning } from './issues.js';
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
  if (issues.some((i) => i.code === 'RESERVED_ID')) return finish(issues, meta);

  const sim = explore(c, {
    ...(opts.maxStates === undefined ? {} : { maxStates: opts.maxStates }),
    ...(opts.maxMs === undefined ? {} : { maxMs: opts.maxMs }),
    ...(opts.walks === undefined ? {} : { walks: opts.walks }),
    scripts: (pkg.tests?.goldenPaths ?? []).map((g) => g.actions),
  });
  const golden = runGoldenPaths(c);
  if (!sim.complete) {
    issues.push(
      warning(
        'SIMULATION_INCOMPLETE',
        '',
        `BFS sınırda kesildi (${sim.states} durum); derin durumlar ${sim.walks} yürüyüş ve kaçış aramasıyla örneklendi`,
      ),
    );
  }
  pkg.outcomes.forEach((o, i) => {
    if (!sim.outcomes[o.id]?.reached && !golden.some((g) => g.passed && g.outcome === o.id)) {
      issues.push(error('OUTCOME_UNREACHABLE', `outcomes[${i}]`, `${o.id} sonucuna hiçbir yolla ulaşılamıyor`));
    }
  });
  for (const d of sim.deadEnds) {
    issues.push(error('DEAD_END', d.key, `Seçeneksiz durum; tanık: ${formatActions(d.witness)}`));
  }
  for (const d of sim.softlocks) {
    issues.push(error('SOFTLOCK', d.key, `Bu durumdan dava sonuna ulaşılamıyor; tanık: ${formatActions(d.witness)}`));
  }
  for (const d of sim.unverified) {
    issues.push(
      warning(
        'SOFTLOCK_UNVERIFIED',
        d.key,
        `Kaçış araması bütçesinde dava sonuna ulaşılamadı; tanık: ${formatActions(d.witness)}`,
      ),
    );
  }
  for (const key of sim.scoreLoops) issues.push(error('SCORE_LOOP', key, 'Döngüyle sınırsız büyüyen skor'));
  for (const l of sim.leaks) issues.push(error('LEAK', l.key, `Görünümde gizli bilgi: ${l.token}`));
  golden.forEach((g, i) => {
    if (!g.passed)
      issues.push(error('GOLDEN_PATH_FAILED', `tests.goldenPaths[${i}]`, `${g.name}: ${g.error ?? 'başarısız'}`));
  });
  return finish(issues, {
    ...meta,
    simulation: sim,
    goldenPaths: golden,
    analysis: { categoryMax: sim.categoryMax, finalMin: sim.finalMin, finalMax: sim.finalMax },
  });
}
