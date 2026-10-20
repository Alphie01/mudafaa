import { examine, fallback, has, ifThen, not, recipe, score } from '../../../tools/content/src/kit/index.js';
import type { Category, ChoiceDef, NodeDef } from '../../../tools/content/src/kit/index.js';

// Davaya özgü küçük yardımcılar.

/** BACK rolündeki bitiş seçeneklerini `$return` yerine doğrudan bir hub'a yönlendirir (ara evresi yığınsızdır). */
export function toHub<T extends NodeDef>(node: T, hub: string): T {
  return {
    ...node,
    choices: node.choices.map((ch: ChoiceDef) => (ch.role === 'BACK' ? { ...ch, next: hub } : ch)),
  };
}

/** Belge isabeti: ipucunu bulur, skor verir, özel geri bildirim gösterir. */
export function hit(
  id: string,
  toolId: string,
  target: string,
  clueId: string | undefined,
  amount: number,
  title: string,
  text: string,
  category: Category = 'DELIL_ANALIZI',
): ChoiceDef {
  return examine(id, toolId, target, {
    ...(clueId === undefined ? {} : { discovers: clueId }),
    ...(amount === 0 ? {} : { score: { [category]: amount } }),
    feedback: {
      title,
      text,
      label: amount === 0 ? (clueId === undefined ? 'NOT ALINDI' : 'Not defterinde') : `+${amount} SKOR · Not defterine eklendi`,
      tone: amount === 0 ? 'info' : 'special',
    },
  });
}

/** Belge ıskası. */
export const docMiss = (id: string): ChoiceDef =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle burada dikkat çeken bir şey bulamadın.',
      label: '−20 SKOR',
      tone: 'error',
    },
  });

/** Tarif: çıkarımı doğurur; puan yalnızca çıkarım ilk kez kurulduğunda verilir (iki tahta, iki tarif aynı çıkarım). */
export function rec(
  id: string,
  a: string,
  b: string,
  ded: string,
  amount: number,
  title: string,
  text: string,
): ChoiceDef {
  return recipe(id, a, b, {
    effects: [
      ifThen(not(has(ded)), [score('DELIL_ANALIZI', amount)]),
      { type: 'DISCOVER', evidence: ded },
    ],
    feedback: { title, text, label: `YENİ DELİL · +${amount} SKOR (ilk kurulumda)`, tone: 'success' },
  });
}

/** Tahta ıskası. */
export const boardMiss = (id: string): ChoiceDef =>
  fallback(id, 'COMBINE', {
    repeat: 'ONCE_PER_PARAMS',
    score: { DELIL_ANALIZI: -50 },
    feedback: {
      title: 'Bu ikisi birbirini açıklamıyor',
      text: 'Bir bağ kurmaya çalıştın; iki kart yan yana durdu ve hiçbir şey söylemedi.',
      label: 'BAĞLANTI YOK · −50 SKOR',
      tone: 'error',
    },
  });
