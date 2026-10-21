import type { Cond, Line, ResponseBlock } from '../../../tools/content/src/kit/index.js';
import type { CaseParts } from '../../../tools/content/src/kit/index.js';

// Satır DSL'i: uzun diyalogları okunur bir şablonla yazmak için. Her boş olmayan satır bir `Line` olur.
//
//   = 22 EKİM · 21.10 — ARSLAN HUKUK @buro_gece      → başlık kartı (narrator, style card, bg)
//   - Yağmur camda.                                  → anlatıcı
//   ~ Eskiden dolandırıcı kapıyı çalardı.            → Deniz'in iç sesi (player, thought)
//   > Ne zaman?                                      → Deniz konuşur (player)
//   ?SATICI{phone}: Hocam, kaporayı atın.            → isimsiz ses (narrator + name; style isteğe bağlı)
//   ece/uzgun: Ben aptal değilim.                    → karakter (ifade ve {style} isteğe bağlı)
//
// Satır sonunda ` !shake` / ` !flash` / ` !fade` efekti, ` @bg` arka plan değişimi verir.
// Satır 220 karakteri aşarsa derleme durur. Tipografi (’ ve “ ”) `typography()` ile paketin tamamına uygulanır.

const BACKDROPS = new Set([
  'siyah',
  'buro',
  'buro_gece',
  'gorus_odasi',
  'durusma_salonu',
  'adliye',
  'karakol',
  'sokak_gece',
  'sokak_yagmur',
  'sokak_karanlik',
  'sokak_sabah',
  'depo',
  'depo_gece',
  'cay_ocagi',
  'ev',
  'kafe',
  'hastane',
  'liman_gece',
  'arac',
]);
const EXPRESSIONS = new Set(['normal', 'mutlu', 'kizgin', 'saskin', 'uzgun']);
const STYLES = new Set(['card', 'whisper', 'thought', 'phone']);
const FX = new Set(['shake', 'flash', 'fade']);
export const MAX_LINE = 220;

function parseLine(raw: string): Line {
  let text = raw.trim();
  let fx: string | undefined;
  let bg: string | undefined;
  // Sondaki değiştiriciler (sırası serbest).
  for (;;) {
    const m = /\s+(!|@)([a-z_]+)$/.exec(text);
    if (m === null) break;
    const [all, sigil, word] = m as unknown as [string, string, string];
    if (sigil === '!' && FX.has(word)) fx = word;
    else if (sigil === '@' && BACKDROPS.has(word)) bg = word;
    else break;
    text = text.slice(0, text.length - all.length);
  }
  let line: Line;
  const head = text.slice(0, 2);
  if (head === '= ') line = { speaker: 'narrator', text: text.slice(2), style: 'card' };
  else if (head === '- ') line = { speaker: 'narrator', text: text.slice(2) };
  else if (head === '~ ') line = { speaker: 'player', text: text.slice(2), style: 'thought' };
  else if (head === '> ') line = { speaker: 'player', text: text.slice(2) };
  else {
    const m = /^(\?[^:{/]+|[a-z][a-z0-9_]*)(?:\/([a-z]+))?(?:\{([a-z]+)\})?: (.+)$/.exec(text);
    if (m === null) throw new Error(`DSL: çözülemeyen satır: ${raw}`);
    const [, who = '', expr, style, body = ''] = m as unknown as (string | undefined)[];
    if (expr !== undefined && !EXPRESSIONS.has(expr)) throw new Error(`DSL: bilinmeyen ifade "${expr}": ${raw}`);
    if (style !== undefined && !STYLES.has(style)) throw new Error(`DSL: bilinmeyen biçim "${style}": ${raw}`);
    line = who.startsWith('?')
      ? { speaker: 'narrator', name: who.slice(1).trim(), text: body }
      : { speaker: who, text: body };
    if (expr !== undefined && !who.startsWith('?')) line.expression = expr as Line['expression'];
    if (style !== undefined) line.style = style as Line['style'];
  }
  if (bg !== undefined) line.bg = bg as Line['bg'];
  if (fx !== undefined) line.fx = fx as Line['fx'];
  if (line.text.length > MAX_LINE) throw new Error(`DSL: satır ${line.text.length} karakter (> ${MAX_LINE}): ${raw}`);
  if (line.text.trim() === '') throw new Error(`DSL: boş satır metni: ${raw}`);
  return line;
}

/** Şablondan satırlar: S`...` → Line[]. */
export function S(strings: TemplateStringsArray, ...vals: unknown[]): Line[] {
  const src = strings.reduce((acc, s, i) => acc + s + (i < vals.length ? String(vals[i]) : ''), '');
  return src
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '' && !l.startsWith('//'))
    .map(parseLine);
}

/** Koşulsuz tek blok. */
export const B = (lines: Line[]): ResponseBlock[] => [{ lines }];
/** Koşullu blok. */
export const W = (when: Cond, lines: Line[]): ResponseBlock => ({ when, lines });
/** Koşulsuz blok (bir `W` dizisinin sonuna). */
export const O = (lines: Line[]): ResponseBlock => ({ lines });

// --- Tipografi: ASCII ' → ’ ve "…" → “…” (yalnızca metin değerlerinde; kimlikler tırnak içermez). ---

const fixQuotes = (s: string): string => {
  if (!s.includes("'") && !s.includes('"')) return s;
  let out = s.replace(/'/g, '’');
  let open = true;
  out = out.replace(/"/g, () => {
    const q = open ? '“' : '”';
    open = !open;
    return q;
  });
  return out;
};

const deep = (x: unknown): unknown => {
  if (typeof x === 'string') return fixQuotes(x);
  if (Array.isArray(x)) return x.map(deep);
  if (x !== null && typeof x === 'object') {
    return Object.fromEntries(Object.entries(x as Record<string, unknown>).map(([k, v]) => [k, deep(v)]));
  }
  return x;
};

/** Paketin bütün metinlerine tipografi uygular. */
export const typography = (parts: CaseParts): CaseParts => deep(parts) as CaseParts;

/** Düz ASCII '-' yerine eksi işareti (U+2212) ile skor etiketi. */
export const minus = (n: number): string => `−${n}`;

/** Boş ziyaret yok: çıkış seçeneği, ziyarette en az bir şey yapılana dek kilitli kalır. */
export const askedOne = (...topicIds: string[]): Cond => ({ any: topicIds.map((id) => ({ chosen: id })) });
export const ASKED_REASON = 'Buraya bir eylem puanı harcadın; çıkmadan en az bir şey sor.';
export const LOOKED_REASON = 'Çıkmadan en az bir ayrıntıya bak.';

/** Bir node'un `id` kimlikli seçeneğine kilit koşulu ekler (kit'in `finish` alanı koşul almadığı için). */
export function gateChoice<T extends { choices: readonly { id: string }[] }>(
  node: T,
  id: string,
  enabledWhen: Cond,
  lockedReason: string,
): T {
  return { ...node, choices: node.choices.map((ch) => (ch.id === id ? { ...ch, enabledWhen, lockedReason } : ch)) };
}
