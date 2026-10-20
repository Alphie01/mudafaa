import type { Effect, NodeDef, NodeView } from '@mudafaa/case-schema';
import { copy, usedOnce } from './common.js';
import type { ViewCtx } from './common.js';

/** Etki listesi (IF dalları dahil) bir delil keşfediyor mu. */
export const discovers = (effects: readonly Effect[] | undefined): boolean =>
  (effects ?? []).some((e) => e.type === 'DISCOVER' || (e.type === 'IF' && (discovers(e.then) || discovers(e.else))));

/** Belge inceleme: uygulanmış alet × satır çiftleri; keşif yapan kalan kural sayısı `exposeCounts` ise. */
export function documentView(vc: ViewCtx, def: Extract<NodeDef, { type: 'DOCUMENT' }>): NodeView {
  const rules = vc.node.rules.EXAMINE;
  return {
    type: 'DOCUMENT',
    id: def.id,
    title: def.title,
    header: { left: def.header.left, right: def.header.right },
    columns: copy(def.columns),
    rows: copy(def.rows),
    tools: copy(def.tools),
    solved: rules.flatMap((r) =>
      r.match !== undefined && 'tool' in r.match && usedOnce(vc, r.id)
        ? [{ tool: r.match.tool, target: r.match.target }]
        : [],
    ),
    ...(def.exposeCounts === true
      ? { hiddenRemaining: rules.filter((r) => discovers(r.effects) && !usedOnce(vc, r.id)).length }
      : {}),
  };
}
