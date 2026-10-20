import type { NodeDef, NodeView } from '@mudafaa/case-schema';
import { addCast, holds } from './common.js';
import type { ViewCtx } from './common.js';

/** Görüşme: ruh hâli ve odadaki yüz ifadesi kurallardan, hedeflerin metni bilinip bilinmediğine göre çözülür. */
export function dialogueView(vc: ViewCtx, def: Extract<NodeDef, { type: 'DIALOGUE' }>): NodeView {
  const mood = (def.moodRules ?? []).find((r) => holds(vc, r.when));
  const expression = mood?.expression ?? def.room.expression ?? 'normal';
  addCast(vc, def.room.character, expression);
  return {
    type: 'DIALOGUE',
    id: def.id,
    mode: def.mode,
    room: { label: def.room.label, characterKey: def.room.character, expression },
    ...(mood === undefined ? {} : { mood: { label: mood.label, tone: mood.tone } }),
    objectives: (def.objectives ?? []).map((o) => {
      const known = holds(vc, o.when);
      return { text: known ? o.known : o.unknown, known };
    }),
    tones: (def.tones ?? []).map((t) => ({
      id: t.id,
      label: t.label,
      ...(t.hint === undefined ? {} : { hint: t.hint }),
    })),
    allowPresent: def.allowPresent ?? false,
  };
}
