import type { NodeDef, NodeView } from '@mudafaa/case-schema';
import { EngineError } from '../errors.js';
import { addSpeakers, copy, evidenceCard } from './common.js';
import type { ViewCtx } from './common.js';

/** Genel A–D seçim ekranı. */
export function choiceNodeView(vc: ViewCtx, def: Extract<NodeDef, { type: 'CHOICE' }>): NodeView {
  if (def.prompt !== undefined) addSpeakers(vc, [def.prompt]);
  return { type: 'CHOICE', id: def.id, ...(def.prompt === undefined ? {} : { prompt: copy(def.prompt) }) };
}

/** Delil kartı + A–D inceleme: node'un konusu olan delil gösterilir. */
export function evidenceNodeView(vc: ViewCtx, def: Extract<NodeDef, { type: 'EVIDENCE' }>): NodeView {
  const ev = vc.c.evidence.get(def.evidence);
  if (ev === undefined) throw new EngineError('TYPE', `Bilinmeyen delil: ${def.evidence}`);
  if (def.prompt !== undefined) addSpeakers(vc, [def.prompt]);
  return {
    type: 'EVIDENCE',
    id: def.id,
    ...(def.prompt === undefined ? {} : { prompt: copy(def.prompt) }),
    evidence: evidenceCard(ev),
  };
}
