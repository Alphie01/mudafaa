import type { Block, NodeDef, NodeView } from '@mudafaa/case-schema';
import { addCast, copy, visibleChoice } from './common.js';
import type { ViewCtx } from './common.js';

/** Brifing / anlatı: bloklar olduğu gibi gider; strateji grubunun ipuçları yalnızca görünür seçenekler için. */
export function storyView(vc: ViewCtx, def: Extract<NodeDef, { type: 'STORY' }>): NodeView {
  const blocks = (def.blocks ?? []).map((b): Block => {
    if (b.type === 'profileCard') addCast(vc, b.character);
    if (b.type === 'choiceGroup' && b.hints !== undefined) {
      const hints = Object.fromEntries(Object.entries(b.hints).filter(([id]) => visibleChoice(vc, id)));
      return { ...copy(b), hints };
    }
    return copy(b);
  });
  return { type: 'STORY', id: def.id, ...(def.phase === undefined ? {} : { phase: def.phase }), blocks };
}
