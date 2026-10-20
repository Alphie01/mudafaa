import type { CasePackage, Cond } from '@mudafaa/case-schema';
import type { CompiledCase } from '@mudafaa/engine';
import { error, warning } from '../issues.js';
import type { Issue } from '../issues.js';
import { allEffects, eachCondLeaf } from '../walk.js';

const isFinal = (v: unknown): boolean =>
  typeof v === 'object' && v !== null && (v as { score?: unknown }).score === 'final';

/** Sonuç koşullarında final skorla karşılaştırılan eşikler (`final >= n` için n, `final > n` için n+1). */
function finalThresholds(conds: readonly Cond[]): Set<number> {
  const out = new Set<number>();
  for (const cond of conds) {
    eachCondLeaf(cond, (leaf) => {
      if (!('cmp' in leaf)) return;
      const [l, op, r] = leaf.cmp;
      if (isFinal(l) && typeof r === 'number') out.add(op === '>' ? r + 1 : r);
      if (isFinal(r) && typeof l === 'number') out.add(op === '<' ? l + 1 : l);
    });
  }
  return out;
}

/** Skor: her SCORE bir döküm satırına düşmeli; eşik çubuğunun bantları sonuç koşullarındaki eşiklerle uyumlu olmalı. */
export function scoringChecks(pkg: CasePackage, c: CompiledCase): Issue[] {
  const out: Issue[] = [];
  for (const { effect, path } of allEffects(pkg)) {
    if (effect.type === 'SCORE' && effect.line === undefined && !c.lineByCategory.has(effect.category)) {
      out.push(
        error('SCORE_LINE_UNMAPPED', path, `${effect.category} hiçbir döküm satırına bağlı değil ve line verilmemiş`),
      );
    }
  }
  const bands = pkg.config.scoring.thresholdBar;
  const thresholds = finalThresholds(pkg.outcomes.map((o) => o.when));
  const lowest = Math.min(...bands.map((b) => b.from));
  bands.forEach((b, i) => {
    if (i > 0 && (bands[i - 1]?.from ?? -Infinity) >= b.from) {
      out.push(warning('THRESHOLD_MISMATCH', `config.scoring.thresholdBar[${i}]`, 'Eşik bantları artan sırada olmalı'));
    }
    if (b.from !== lowest && !thresholds.has(b.from)) {
      out.push(
        warning(
          'THRESHOLD_MISMATCH',
          `config.scoring.thresholdBar[${i}].from`,
          `${b.label} bandı (${b.from}) hiçbir sonuç koşulunun eşiği değil`,
        ),
      );
    }
  });
  return out;
}
