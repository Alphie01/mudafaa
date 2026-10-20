import type { Backdrop, Cond, Expression, Line, LineFx, ResponseBlock } from '../../../tools/content/src/kit/index.js';

// Dava #01'in satır DSL'i: sahneler düz metin olarak yazılır, her satır bir `Line` olur. Kit yardımcılarının (L, N, P)
// kısaltmasıdır; çıktı şemadaki nesnenin aynısıdır.
//
//   # buro_gece | 13 EKİM · 21.10 — ARSLAN HUKUK     → başlık kartı (style card + bg)
//   > Bursa'da yağmur…                                → Deniz'in iç sesi (player + thought)
//   P: Buyurun, oturun.                               → Deniz konuşur
//   N: Kapı çaldı.   ya da yalnızca metin             → anlatıcı
//   @BİR SES: Bitti mi?   @BİR SES~phone: …           → isimsiz ses (narrator + name [+ style])
//   arda: Hocam…   arda.uzgun: …   leyla~whisper: …   → kadro üyesi (ifade ve stil isteğe bağlı)
//   satır sonu [shake] [flash] [fade]                 → efekt;  {bg=karakol} → bu satırdan itibaren arka plan
//
// Konuşmacı yalnızca CAST listesindeyse tanınır; böylece "Hedef: …" gibi anlatı satırları yanlışlıkla konuşmacıya dönmez.

export const CAST = new Set([
  'deniz',
  'leyla',
  'arda',
  'zehra',
  'gulten',
  'hayri',
  'recep',
  'volkan',
  'cemil',
  'ozan',
  'orhan',
  'serkan',
  'hakim',
  'savci',
  'katip',
  'mubasir',
]);

const EXPRESSIONS = new Set(['normal', 'mutlu', 'kizgin', 'saskin', 'uzgun']);
const STYLES = new Set(['card', 'whisper', 'thought', 'phone']);

/** Satır uzunluğu sınırı (kılavuz: ~220 karakter). */
export const MAX_LINE = 220;

function parseLine(raw: string): Line {
  let text = raw.trim();
  let fx: LineFx | undefined;
  let bg: Backdrop | undefined;
  const fxm = /\s*\[(shake|flash|fade)\]\s*$/.exec(text);
  if (fxm) {
    fx = fxm[1] as LineFx;
    text = text.slice(0, fxm.index).trim();
  }
  const bgm = /\s*\{bg=([a-z_]+)\}\s*$/.exec(text);
  if (bgm) {
    bg = bgm[1] as Backdrop;
    text = text.slice(0, bgm.index).trim();
  }
  let line: Line;
  if (text.startsWith('#')) {
    const m = /^#\s*([a-z_]+)\s*\|\s*(.+)$/.exec(text);
    if (!m) throw new Error(`Kart satırı "# bg | METİN" biçiminde olmalı: ${raw}`);
    line = { speaker: 'narrator', text: m[2]!.trim(), bg: m[1] as Backdrop, style: 'card' };
  } else if (text.startsWith('>')) {
    line = { speaker: 'player', text: text.slice(1).trim(), style: 'thought' };
  } else if (text.startsWith('@')) {
    const m = /^@([^:~]+?)(?:~([a-z]+))?:\s*(.+)$/.exec(text);
    if (!m) throw new Error(`İsimsiz ses "@AD: metin" biçiminde olmalı: ${raw}`);
    line = { speaker: 'narrator', name: m[1]!.trim(), text: m[3]!.trim() };
    if (m[2]) {
      if (!STYLES.has(m[2])) throw new Error(`Bilinmeyen stil ${m[2]}: ${raw}`);
      line.style = m[2] as Line['style'];
    }
  } else {
    const m = /^([a-zP]+)(?:\.([a-z]+))?(?:~([a-z]+))?:\s+(.+)$/.exec(text);
    if (m && (m[1] === 'P' || m[1] === 'N' || CAST.has(m[1]!))) {
      const who = m[1] === 'P' ? 'player' : m[1] === 'N' ? 'narrator' : m[1]!;
      line = { speaker: who, text: m[4]!.trim() };
      if (m[2]) {
        if (!EXPRESSIONS.has(m[2])) throw new Error(`Bilinmeyen ifade ${m[2]}: ${raw}`);
        line = { speaker: who, expression: m[2] as Expression, text: m[4]!.trim() };
      }
      if (m[3]) {
        if (!STYLES.has(m[3])) throw new Error(`Bilinmeyen stil ${m[3]}: ${raw}`);
        line.style = m[3] as Line['style'];
      }
    } else {
      line = { speaker: 'narrator', text };
    }
  }
  if (bg !== undefined) line.bg = bg;
  if (fx !== undefined) line.fx = fx;
  if (line.text.length > MAX_LINE) throw new Error(`Satır ${line.text.length} karakter (> ${MAX_LINE}): ${line.text}`);
  return line;
}

/** Çok satırlı sahne metni → Line[]. Boş satırlar ve `//` ile başlayan satırlar atlanır. */
export function S(src: string): Line[] {
  return src
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '' && !l.startsWith('//'))
    .map(parseLine);
}

/** Koşulsuz tek yanıt bloğu. */
export const B = (src: string): ResponseBlock[] => [{ lines: S(src) }];

/** Koşullu yanıt bloğu. */
export const W = (when: Cond, src: string): ResponseBlock => ({ when, lines: S(src) });

/** Koşulsuz (varsayılan) yanıt bloğu. */
export const O = (src: string): ResponseBlock => ({ lines: S(src) });

/** Tek satır. */
export const one = (src: string): Line => {
  const ls = S(src);
  if (ls.length !== 1) throw new Error(`Tek satır bekleniyordu: ${src}`);
  return ls[0]!;
};
