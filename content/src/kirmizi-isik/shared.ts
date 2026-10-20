import { chapter, cmp, court, phase, v } from '../../../tools/content/src/kit/index.js';
import type { Backdrop, ChoiceDef, Cond, Effect, Line, LineFx, Next } from '../../../tools/content/src/kit/index.js';

// Dava #03 genelinde paylaşılan tanımlar: bölüm etiketleri, soruşturma evreleri, duruşma salonları ve satır kısaltmaları.

export const PRO = chapter('Soğuk açılış', 'DAVA #03 · GECE');
export const BRIEF = chapter('Bölüm 1 · Dosya', 'DAVA #03 · DOSYA');
export const INV = chapter('Bölüm 2 · Soruşturma', 'DAVA #03 · SORUŞTURMA');
export const HEAR1 = chapter('Bölüm 3 · İkinci celse', 'DURUŞMA · 2. CELSE');
export const ARA = chapter('Bölüm 4 · Ara', 'DAVA #03 · ARA');
export const TRIAL = chapter('Bölüm 5 · Üçüncü celse', 'DURUŞMA · 3. CELSE');
export const VERDICT = chapter('Karar', 'DAVA #03 · HÜKÜM');

/** Soruşturma: 4 gün × 4 eylem puanı (yığınlı hub, alt ekranlar `$return` ile döner). */
export const p1 = phase({
  hub: 'INV_HUB',
  dayEnd: 'INV_DAY_END',
  trigger: 'tg_inv_day',
  dayVar: 'day',
  apVar: 'ap',
  days: 4,
  ap: 4,
});

/** Ara evresi: 2 gün × 4 eylem puanı (yığınsız; her etkinlik doğrudan ARA_HUB'a döner). */
export const p2 = phase({
  hub: 'ARA_HUB',
  dayEnd: 'ARA_DAY_END',
  trigger: 'tg_ara_day',
  dayVar: 'ara_day',
  apVar: 'ara_ap',
  days: 2,
  ap: 4,
  dayLabel: 'Ara günü',
});

/** Asliye ceza: tek hâkim; savcı ve katılan vekili. */
const bench = [
  ['katip', 'ZABIT KÂTİBİ', 0.18],
  ['hakim', 'HÂKİM', 0.5],
  ['savci', 'C. SAVCISI', 0.82],
] as const;

export const court1 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...HEAR1 });
export const court2 = court({ bench, counsel: 'deniz', hud: ['cred', 'pers'], ...TRIAL });

// --- Satır kısaltmaları ---

/** Deniz'in iç sesi. */
export const T = (text: string): Line => ({ speaker: 'player', text, style: 'thought' });
/** Yer/saat kartı (yeni mekân). */
export const card = (text: string, bg?: Backdrop, fx?: LineFx): Line => ({
  speaker: 'narrator',
  text,
  style: 'card',
  ...(bg === undefined ? {} : { bg }),
  ...(fx === undefined ? {} : { fx }),
});
/** İsimsiz ses (soğuk açılış, telefon): `speaker: narrator` + görünen ad. */
export const V = (name: string, text: string, style?: Line['style']): Line => ({
  speaker: 'narrator',
  name,
  text,
  ...(style === undefined ? {} : { style }),
});
/** Satıra efekt ekler. */
export const fx = (line: Line, effect: LineFx): Line => ({ ...line, fx: effect });
/** Satırla arka plan değiştirir. */
export const bg = (line: Line, backdrop: Backdrop): Line => ({ ...line, bg: backdrop });

/** Ara evresinde yığınsız etkinlik: NAVIGATE + eylem puanı + doğrudan hedef. */
export const araAct = (
  id: string,
  label: string,
  to: string,
  opts: { description?: string; visibleWhen?: Cond; effects?: Effect[]; once?: boolean } = {},
): ChoiceDef => ({
  id,
  kind: 'NAVIGATE',
  label,
  cost: [{ var: 'ara_ap', amount: 1 }],
  next: to as Next,
  ...(opts.description === undefined ? {} : { description: opts.description }),
  ...(opts.visibleWhen === undefined ? {} : { visibleWhen: opts.visibleWhen }),
  ...(opts.effects === undefined ? {} : { effects: opts.effects }),
  ...(opts.once === false ? {} : { maxUses: 1 }),
});

/** `v(x) >= n` kısaltması. */
export const atLeastVar = (id: string, n: number): Cond => cmp(v(id), '>=', n);

/** Yanlış delil sunumunun ortak bedeli. */
export const wrongEvidence: Effect[] = [
  { type: 'VAR', var: 'cred', op: 'dec', value: 1 },
  { type: 'VAR', var: 'wrong', op: 'inc', value: 1 },
];
