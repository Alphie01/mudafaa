import { chapter, court, phase, rawChoice } from '../../../tools/content/src/kit/index.js';
import type { Backdrop, ChoiceDef, Effect, Expression, Line, LineFx } from '@mudafaa/case-schema';
import type { OptionSpec } from '../../../tools/content/src/kit/index.js';

// Dava #08 genelinde paylaşılan tanımlar: bölüm etiketleri, soruşturma evreleri, duruşma salonu ve satır kısaltmaları.

export const PRO = chapter('Soğuk açılış', 'DAVA #08 · GECE');
export const BRIEF = chapter('Bölüm 1 · Dosya', 'DAVA #08 · DOSYA');
export const INV1 = chapter('Bölüm 2 · Soruşturma', 'DAVA #08 · SORUŞTURMA');
export const HEAR1 = chapter('Bölüm 3 · Birinci celse', 'DURUŞMA · 1. CELSE');
export const ARA = chapter('Bölüm 4 · Ara', 'DAVA #08 · ARA');
export const TRIAL = chapter('Bölüm 5 · İkinci celse', 'DURUŞMA · 2. CELSE');
export const VERDICT = chapter('Karar', 'DAVA #08 · HÜKÜM');

/** 1. evre: 1. celseden önce, 3 gün × 4 eylem puanı (push + $return). */
export const p1 = phase({
  hub: 'INV_HUB',
  dayEnd: 'INV_DAY_END',
  trigger: 'tg_inv_day',
  dayVar: 'day',
  apVar: 'ap',
  days: 3,
  ap: 4,
});

/** Ara evresi: 2 gün × 4 eylem puanı; etkinlikler yığınsız, doğrudan ARA_HUB'a döner (motor sınırı, Dava #07 notu 2). */
export const p2 = phase({
  hub: 'ARA_HUB',
  dayEnd: 'ARA_DAY_END',
  trigger: 'tg_ara_day',
  dayVar: 'ara_day',
  apVar: 'ara_ap',
  days: 2,
  ap: 4,
});

/** Ara evresi etkinliği: NAVIGATE + maliyet, doğrudan hedefe (push yok), bir kez. */
export const araAct = (id: string, label: string, to: string, opts: OptionSpec = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { cost: [{ var: 'ara_ap', amount: 1 }], next: to, maxUses: 1, ...opts });

/** Asliye ceza: tek hâkim; zabıt kâtibi ve savcı kürsüde (katılan vekili salonda konuşur). */
const bench = [
  ['katip', 'ZABIT KÂTİBİ', 0.15],
  ['hakim', 'HÂKİM', 0.5],
  ['savci', 'C. SAVCISI', 0.85],
] as const;

export const court1 = court({
  bench,
  counsel: 'deniz',
  hud: ['cred', 'pers'],
  ...HEAR1,
});
export const court2 = court({
  bench,
  counsel: 'deniz',
  hud: ['cred', 'pers'],
  ...TRIAL,
});

// --- Satır kısaltmaları ---

type Extra = { bg?: Backdrop; fx?: LineFx };

/** Karakter satırı (ifade + isteğe bağlı arka plan/efekt). */
export const S = (speaker: string, text: string, expression?: Expression, extra: Extra = {}): Line => ({
  speaker,
  ...(expression === undefined ? {} : { expression }),
  text,
  ...extra,
});
/** Anlatıcı. */
export const Nx = (text: string, extra: Extra = {}): Line => ({ speaker: 'narrator', text, ...extra });
/** Mekân/saat kartı. */
export const card = (text: string, bg: Backdrop, fx?: LineFx): Line => ({
  speaker: 'narrator',
  text,
  style: 'card',
  bg,
  ...(fx === undefined ? {} : { fx }),
});
/** Deniz'in iç sesi. */
export const T = (text: string, extra: Extra = {}): Line => ({ speaker: 'player', text, style: 'thought', ...extra });
/** Deniz konuşur. */
export const D = (text: string, extra: Extra = {}): Line => ({ speaker: 'player', text, ...extra });
/** Kimliği gizli ses. */
export const voice = (name: string, text: string, style?: 'whisper' | 'phone', extra: Extra = {}): Line => ({
  speaker: 'narrator',
  name,
  text,
  ...(style === undefined ? {} : { style }),
  ...extra,
});
/** Telefon sesi (bilinen karakter). */
export const ph = (speaker: string, text: string): Line => ({ speaker, text, style: 'phone' });

/** Satıra efekt ekler. */
export const fx = (line: Line, effect: LineFx): Line => ({ ...line, fx: effect });

/** Yanlış delil sunumunun ortak bedeli (güvenilirlik, ikna, sayaç). */
export const wrongEvidence: Effect[] = [
  { type: 'VAR', var: 'cred', op: 'dec', value: 1 },
  { type: 'VAR', var: 'wrong', op: 'inc', value: 1 },
];
