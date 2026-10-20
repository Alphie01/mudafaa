import type { NodeDef, NodeView } from '@mudafaa/case-schema';
import { EngineError } from '../errors.js';
import { evalCond } from '../expr/eval.js';
import { breakdownRows, computeScore } from '../scoring.js';
import { usedOnce } from './common.js';
import type { ViewCtx } from './common.js';

/** Strateji etiketi: ilk strateji grubunun (choiceGroup bloğu) seçilmiş seçeneğinin etiketi. */
function strategyLabel(vc: ViewCtx): string | undefined {
  for (const n of vc.c.pkg.nodes) {
    if (n.type !== 'STORY') continue;
    const group = n.blocks?.find((b) => b.type === 'choiceGroup');
    if (group === undefined || group.type !== 'choiceGroup') continue;
    return n.choices.find((ch) => ch.group === group.group && usedOnce(vc, ch.id))?.label;
  }
  return undefined;
}

/** Karar ekranı: hesaplanmış sonuç, koşulu tutan gerekçeler, döküm (satırlar `final`'e toplanır) ve eşik çubuğu. */
export function resultView(vc: ViewCtx, def: Extract<NodeDef, { type: 'RESULT' }>): NodeView {
  const done = vc.s.outcome;
  const outcome = done === undefined ? undefined : vc.c.outcomes.find((o) => o.id === done.id);
  if (done === undefined || outcome === undefined) throw new EngineError('TYPE', 'RESULT görünümü için sonuç yok');
  const scoring = vc.c.pkg.config.scoring;
  const ctx = { c: vc.c, s: vc.s, final: done.final };
  const strategy = strategyLabel(vc);
  return {
    type: 'RESULT',
    id: def.id,
    outcome: { id: outcome.id, class: outcome.class, stamp: outcome.stamp, tone: outcome.stampTone },
    ...(strategy === undefined ? {} : { strategyLabel: strategy }),
    sentence: { demand: vc.c.pkg.meta.demandText, result: outcome.sentence },
    verdictText: outcome.verdictText,
    reasoning: outcome.reasoning.filter((r) => r.when === undefined || evalCond(r.when, ctx)).map((r) => r.text),
    breakdown: breakdownRows(computeScore(vc.c, vc.s)),
    total: scoring.displayClampMin === undefined ? done.final : Math.max(scoring.displayClampMin, done.final),
    thresholds: {
      scaleMax: scoring.scaleMax,
      bands: scoring.thresholdBar.map((b) => ({ label: b.label, from: b.from, tone: b.tone })),
    },
    xp: { gained: done.xp },
  };
}
