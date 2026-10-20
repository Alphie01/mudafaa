import type { ChoiceDef, Effect, NodeDef, NodeView } from '@mudafaa/case-schema';
import { discovered, usedOnce } from './common.js';
import type { ViewCtx } from './common.js';

const firstDiscovery = (effects: readonly Effect[] | undefined): string | undefined => {
  for (const e of effects ?? []) if (e.type === 'DISCOVER') return e.evidence;
  return undefined;
};

/** Çıkarım tahtası: bulunmuş havuz kartları ve çözülmüş tarifler; tarif sayısı `exposeCounts` ise. */
export function deductionView(vc: ViewCtx, def: Extract<NodeDef, { type: 'DEDUCTION' }>): NodeView {
  const titleOf = (id: string): string => vc.c.evidence.get(id)?.title ?? id;
  const solvedOf = (r: ChoiceDef): { title: string; hits: string }[] => {
    if (r.match === undefined || !('a' in r.match) || !usedOnce(vc, r.id)) return [];
    const insight = firstDiscovery(r.effects);
    const title = insight === undefined ? (r.label ?? r.feedback?.title ?? r.id) : titleOf(insight);
    return [{ title, hits: `${titleOf(r.match.a)} + ${titleOf(r.match.b)}` }];
  };
  return {
    type: 'DEDUCTION',
    id: def.id,
    cards: def.pool.flatMap((id) => {
      const ev = vc.c.evidence.get(id);
      return ev === undefined || !discovered(vc, id) ? [] : [{ id, source: ev.sourceLabel, text: ev.shortText }];
    }),
    solved: vc.node.rules.COMBINE.flatMap(solvedOf),
    ...(def.exposeCounts === true ? { recipesTotal: vc.node.rules.COMBINE.length } : {}),
  };
}
