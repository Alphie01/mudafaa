import type { Cond, Expression, Line, ResponseBlock } from '@mudafaa/case-schema';

// Konuşma satırı ve yanıt bloğu kısaltmaları. Hepsi şemadaki nesneyi birebir üretir; ham `{speaker, text}` nesnesi
// her yerde aynı şekilde kullanılabilir.

/** Konuşma satırı: `L('kerem', 'Ben yapmadım.', 'kizgin')`. `speaker` karakter kimliği, `player` ya da `narrator`. */
export const L = (speaker: string, text: string, expression?: Expression): Line =>
  expression === undefined ? { speaker, text } : { speaker, expression, text };

/** Anlatıcı satırı. */
export const N = (text: string): Line => ({ speaker: 'narrator', text });

/** Oyuncunun (avukatın) kendi satırı. */
export const P = (text: string): Line => ({ speaker: 'player', text });

/** Koşulsuz tek yanıt bloğu: `says(L(...), L(...))` → `[{lines:[…]}]`. */
export const says = (...lines: Line[]): ResponseBlock[] => [{ lines }];

/** Koşullu yanıt bloğu: `when(flag('x'), L(...))`. Bloklar yazım sırasıyla denenir; ilk tutan gösterilir. */
export const when = (cond: Cond, ...lines: Line[]): ResponseBlock => ({ when: cond, lines });

/** Koşulsuz (varsayılan) yanıt bloğu; `when` bloklarının sonuna konur. */
export const otherwise = (...lines: Line[]): ResponseBlock => ({ lines });
