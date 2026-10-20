import type { ChoiceDef, Line, Next, NodeDef, Route } from '@mudafaa/case-schema';
import { withNext } from './choices.js';
import { N } from './text.js';

// Genel node yardımcıları. Her biri bir NodeDef döndürür; ek ham alanlar (`onEnter`, `hud`, `lines`…) `spec` içinde
// olduğu gibi geçer.

type NodeOf<T extends NodeDef['type']> = Extract<NodeDef, { type: T }>;
/** Node'un tür, kimlik ve seçenek dışındaki alanları. */
export type NodeSpec<T extends NodeDef['type']> = Omit<NodeOf<T>, 'type' | 'id' | 'choices'> & {
  choices?: ChoiceDef[];
};

/**
 * Bölüm etiketi: `chapter` ilerleme etiketini (session.progressLabel) verir, `eyebrow` başlığın üstündeki satırdır.
 * Node'lara yayılarak kullanılır: `story('X', { ...C1, title: '…' })`.
 */
export const chapter = (label: string, eyebrow?: string): { chapter: string; eyebrow?: string } =>
  eyebrow === undefined ? { chapter: label } : { chapter: label, eyebrow };

/** STORY: anlatı / brifing ekranı. */
export const story = (id: string, spec: NodeSpec<'STORY'>): NodeOf<'STORY'> => ({
  id,
  type: 'STORY',
  ...spec,
  choices: spec.choices ?? [],
});

/**
 * CHOICE: genel A–D karar ekranı. `prompt` metin verilirse anlatıcı satırı olur. `next` verilirse `next`'i olmayan
 * seçenekler oraya gider (yinelenen `next` alanlarını kaldırır).
 */
export const choiceNode = (
  id: string,
  spec: Omit<NodeSpec<'CHOICE'>, 'prompt'> & { prompt?: Line | string; next?: Next },
): NodeOf<'CHOICE'> => {
  const { prompt, next, choices, ...rest } = spec;
  return {
    id,
    type: 'CHOICE',
    ...rest,
    ...(prompt === undefined ? {} : { prompt: typeof prompt === 'string' ? N(prompt) : prompt }),
    choices: withNext(choices ?? [], next),
  };
};

/** EVIDENCE: delil kartı + A–D inceleme. */
export const evidenceNode = (
  id: string,
  evidence: string,
  spec: Omit<NodeSpec<'EVIDENCE'>, 'evidence' | 'prompt'> & { prompt?: Line | string; next?: Next },
): NodeOf<'EVIDENCE'> => {
  const { prompt, next, choices, ...rest } = spec;
  return {
    id,
    type: 'EVIDENCE',
    evidence,
    ...rest,
    ...(prompt === undefined ? {} : { prompt: typeof prompt === 'string' ? N(prompt) : prompt }),
    choices: withNext(choices ?? [], next),
  };
};

/** DECISION: görünmez yönlendirici. Son rota koşulsuz olmalıdır (doğrulayıcı DECISION_NO_DEFAULT). */
export const decisionNode = (
  id: string,
  routes: Route[],
  spec: Omit<NodeSpec<'DECISION'>, 'routes'> = {},
): NodeOf<'DECISION'> => ({ id, type: 'DECISION', ...spec, routes, choices: spec.choices ?? [] });

/** RESULT: karar ekranı (seçenek taşımaz). */
export const resultNode = (id: string, spec: Omit<NodeSpec<'RESULT'>, 'choices'> = {}): NodeOf<'RESULT'> => ({
  id,
  type: 'RESULT',
  ...spec,
  choices: [],
});
