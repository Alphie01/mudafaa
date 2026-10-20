import { Category } from '@mudafaa/case-schema';
import type { CaseReport, Effect, Tone } from '@mudafaa/case-schema';
import { EngineError } from './errors.js';
import { evalCond } from './expr/eval.js';
import { getOwn } from './own.js';
import { computeScore } from './scoring.js';
import type { CompiledCase, SessionState } from './types.js';

/** Bir kategoriye ait pozitif literal SCORE tutarlarının toplamı (doğrulayıcının `categoryMax`'ı yoksa üst sınır). */
function staticCategoryMax(c: CompiledCase): Record<Category, number> {
  const max = Object.fromEntries(Category.options.map((k) => [k, 0])) as Record<Category, number>;
  const walk = (effects: readonly Effect[] | undefined): void => {
    for (const e of effects ?? []) {
      if (e.type === 'SCORE' && typeof e.amount === 'number' && e.amount > 0) max[e.category] += e.amount;
      if (e.type === 'IF') {
        walk(e.then);
        walk(e.else);
      }
    }
  };
  for (const n of c.pkg.nodes) {
    walk(n.onEnter);
    walk(n.onFirstEnter);
    for (const ch of n.choices) {
      walk(ch.effects);
      for (const v of ch.variants ?? []) walk(v.effects);
    }
  }
  for (const s of c.pkg.scenes) for (const o of s.objects) walk(o.effects);
  for (const t of c.pkg.triggers) walk(t.effects);
  return max;
}

const toneOf = (value: number): Tone => (value > 0 ? 'success' : value < 0 ? 'error' : 'neutral');

/** Dava sonu raporu (tamamen kural tabanlı): işaretler, kaçırılanlar, alternatif yollar, beceri tavsiyeleri, döküm. */
export function report(
  c: CompiledCase,
  s: SessionState,
  opts: { categoryMax?: Partial<Record<Category, number>> } = {},
): CaseReport {
  if (s.status !== 'COMPLETED' || s.outcome === undefined) throw new EngineError('TYPE', 'Dava henüz bitmedi');
  const outcome = c.outcomes.find((o) => o.id === s.outcome?.id);
  if (outcome === undefined) throw new EngineError('TYPE', `Bilinmeyen sonuç: ${s.outcome.id}`);
  const score = computeScore(c, s);
  const ctx = { c, s, final: s.outcome.final };
  const reasoning = outcome.reasoning.filter((r) => r.when === undefined || evalCond(r.when, ctx)).map((r) => r.text);

  const missed: { text: string; category?: Category }[] = [];
  const seen = new Set<string>();
  const addMissed = (text: string, category?: Category): void => {
    if (seen.has(text)) return;
    seen.add(text);
    missed.push(category === undefined ? { text } : { text, category });
  };
  for (const h of c.pkg.report.hints) if (evalCond(h.when, ctx)) addMissed(h.text, h.category);
  for (const [id, def] of c.evidence) {
    if (def.missedHint !== undefined && getOwn(s.evidence, id) === undefined) addMissed(def.missedHint);
  }

  const fallbackMax = staticCategoryMax(c);
  const skills = c.pkg.config.scoring.categories.map((cat) => {
    const earned = Math.max(0, s.score.cat[cat.id] ?? 0);
    const max = Math.max(0, opts.categoryMax?.[cat.id] ?? fallbackMax[cat.id]);
    const ratio = max === 0 ? 1 : earned / max;
    const level: 'weak' | 'medium' | 'strong' = ratio < 0.4 ? 'weak' : ratio <= 0.75 ? 'medium' : 'strong';
    const advice =
      level === 'weak'
        ? cat.advice.weak
        : level === 'medium'
          ? (cat.advice.medium ?? cat.advice.weak)
          : (cat.advice.strong ?? cat.advice.medium ?? cat.advice.weak);
    return { category: cat.id, label: cat.label, earned, max, level, advice };
  });

  const markOf = (m: SessionState['marks'][number]) =>
    m.category === undefined
      ? { source: m.source, feedback: m.feedback }
      : { source: m.source, feedback: m.feedback, category: m.category };

  return {
    outcome: {
      id: outcome.id,
      class: outcome.class,
      stamp: outcome.stamp,
      stampTone: outcome.stampTone,
      ...(outcome.header === undefined ? {} : { header: outcome.header }),
      sentence: outcome.sentence,
      verdictText: outcome.verdictText,
      reasoning,
      legalBasis: outcome.legalBasis,
      ...(outcome.ethicsCard === undefined ? {} : { ethicsCard: outcome.ethicsCard }),
    },
    raw: s.outcome.raw,
    final: s.outcome.final,
    breakdown: [
      ...score.lines.map((l) => ({ label: l.label, value: l.value, tone: toneOf(l.value) })),
      ...score.bonuses.map((b) => ({ label: b.label, value: b.value, tone: toneOf(b.value) })),
    ],
    good: s.marks.filter((m) => m.quality === 'GOOD').map(markOf),
    bad: s.marks.filter((m) => m.quality === 'BAD').map(markOf),
    missed,
    alternatives: c.outcomes
      .filter((o) => o.id !== outcome.id)
      .map((o) => ({ outcomeId: o.id, howToReach: o.howToReach })),
    skills,
    xp: s.outcome.xp,
  };
}
