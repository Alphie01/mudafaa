import type { ChoiceDef, Cond, Cost, Effect, Expression, Line, NodeDef, Tone, Variant } from '@mudafaa/case-schema';
import { back, rawChoice } from './choices.js';
import type { OptionSpec } from './choices.js';
import type { NodeSpec } from './nodes.js';

// Görüşme (DIALOGUE INTERVIEW: konu × ton) ve serbest konuşma (CONVERSATION).

type Dialogue = Extract<NodeDef, { type: 'DIALOGUE' }>;

/** Bilinen tonların varsayılan etiketleri. */
export const TONE_LABELS: Readonly<Record<string, string>> = { soft: 'Yumuşak', hard: 'Sert' };

/** Bir tonun (varyantın) içeriği. `says` kısaltması koşulsuz tek yanıt bloğudur; koşullu yanıt için `responses`. */
export interface ToneSpec extends Omit<Variant, 'id' | 'label'> {
  label?: string;
  says?: Line[];
}

/** Maliyet kısaltması: `costOf('min', 3)` → `[{ var: 'min', amount: 3 }]`. */
export const costOf = (variable: string, amount: number): Cost[] => [{ var: variable, amount }];

/**
 * TOPIC: konu × ton. Ortak etkiler ve maliyet konuda, tona özgü soru/etki/yanıt varyantlardadır. `tones` anahtarları
 * varyant kimlikleridir (ör. `soft`, `hard`); etiket verilmezse TONE_LABELS kullanılır.
 */
export function topic(id: string, label: string, spec: OptionSpec & { tones: Record<string, ToneSpec> }): ChoiceDef {
  const { tones, ...rest } = spec;
  const variants: Variant[] = Object.entries(tones).map(([toneId, t]) => {
    const { label: toneLabel, says, responses, ...vrest } = t;
    const resolved = toneLabel ?? TONE_LABELS[toneId];
    if (resolved === undefined) throw new Error(`${id}: "${toneId}" tonunun etiketi yok`);
    if (says !== undefined && responses !== undefined) throw new Error(`${id}/${toneId}: says ile responses birlikte`);
    return {
      id: toneId,
      label: resolved,
      ...vrest,
      ...(says === undefined ? {} : { responses: [{ lines: says }] }),
      ...(responses === undefined ? {} : { responses }),
    };
  });
  return rawChoice('TOPIC', id, label, { ...rest, variants });
}

/** Ruh hâli kuralı (ilk tutan geçerli; sonuncusu koşulsuz olmalı). */
export const mood = (label: string, tone: Tone, expression: Expression, when?: Cond) =>
  when === undefined ? { label, tone, expression } : { when, label, tone, expression };

/** OLAYI ANLA hedefi: `when` tutunca `known`, tutmadıkça `unknown` metni görünür. */
export const objective = (id: string, when: Cond, known: string, unknown: string) => ({ id, when, known, unknown });

export interface InterviewSpec extends Omit<NodeSpec<'DIALOGUE'>, 'mode' | 'tones'> {
  /** Ton düğmeleri; varsayılan Yumuşak / Sert (ipucu metinsiz). */
  tones?: Dialogue['tones'];
  /**
   * Her tonun konulara eklenen ortak etkileri (ör. güven ±, `tone` değişkeni). Yazılırsa her TOPIC'in o kimlikli
   * varyantının etkilerinin ÖNÜNE eklenir; çıktıda açıkça görünür.
   */
  toneEffects?: Record<string, Effect[]>;
  topics: ChoiceDef[];
  /** "Görüşmeyi bitir" (BACK, `$return`). */
  finish: { id: string; label?: string };
}

/** DIALOGUE/INTERVIEW: konular, ek seçenekler (ör. İPUCU GÖSTER), bitiş. */
export function interview(id: string, spec: InterviewSpec): Dialogue {
  const { tones, toneEffects, topics, finish, choices, ...rest } = spec;
  const withTone = topics.map((ch) =>
    toneEffects === undefined || ch.variants === undefined
      ? ch
      : {
          ...ch,
          variants: ch.variants.map((vr) => {
            const extra = toneEffects[vr.id] ?? [];
            return extra.length === 0 ? vr : { ...vr, effects: [...extra, ...(vr.effects ?? [])] };
          }),
        },
  );
  return {
    id,
    type: 'DIALOGUE',
    mode: 'INTERVIEW',
    tones: tones ?? [
      { id: 'soft', label: 'Yumuşak' },
      { id: 'hard', label: 'Sert' },
    ],
    ...rest,
    choices: [...withTone, ...(choices ?? []), back(finish.id, finish.label ?? 'Görüşmeyi bitir')],
  };
}

/** DIALOGUE/CONVERSATION: tanık ziyareti ya da sanık kürsüsü gibi serbest konuşma. */
export const conversation = (id: string, spec: Omit<NodeSpec<'DIALOGUE'>, 'mode'>): Dialogue => ({
  id,
  type: 'DIALOGUE',
  mode: 'CONVERSATION',
  ...spec,
  choices: spec.choices ?? [],
});
