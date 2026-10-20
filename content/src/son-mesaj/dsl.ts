import type { Cond, Line, ResponseBlock } from '../../../tools/content/src/kit/index.js';

// Dava #06 için kısa sahne yazımı. Her satır bir konuşma satırıdır:
//   # METİN            → kart (anlatıcı, style card)
//   > METİN            → anlatıcı
//   ~ METİN            → Deniz'in iç sesi (player, style thought)
//   P: METİN           → Deniz'in konuşması
//   ?AD: METİN         → kimliği gizli ses (narrator + name)
//   kimlik: METİN      → karakter; kimlik/ifade: METİN ile yüz ifadesi (normal|mutlu|kizgin|saskin|uzgun)
// Satır sonuna ` |bg=ad`, ` |fx=shake|flash|fade`, ` |style=phone|whisper|thought|card` eklenebilir.
// Her satır en çok 220 karakterdir (derleme hatası).

const EXPRESSIONS = new Set(['normal', 'mutlu', 'kizgin', 'saskin', 'uzgun']);
const MAX = 220;

function parseLine(raw: string): Line {
  const parts = raw.split(' |');
  let head = (parts.shift() ?? '').trim();
  const opts: Record<string, string> = {};
  for (const p of parts) {
    const [k, v] = p.split('=');
    if (k === undefined || v === undefined) throw new Error(`Geçersiz satır seçeneği: ${raw}`);
    opts[k.trim()] = v.trim();
  }
  let line: Line;
  if (head.startsWith('# ')) line = { speaker: 'narrator', text: head.slice(2).trim(), style: 'card' };
  else if (head.startsWith('> ')) line = { speaker: 'narrator', text: head.slice(2).trim() };
  else if (head.startsWith('~ ')) line = { speaker: 'player', text: head.slice(2).trim(), style: 'thought' };
  else if (head.startsWith('P: ')) line = { speaker: 'player', text: head.slice(3).trim() };
  else if (head.startsWith('?')) {
    const i = head.indexOf(': ');
    if (i < 0) throw new Error(`Geçersiz isimli ses: ${raw}`);
    line = { speaker: 'narrator', name: head.slice(1, i).trim(), text: head.slice(i + 2).trim() };
  } else {
    const m = /^([a-z][a-z0-9_]*)(?:\/([a-z]+))?: (.*)$/.exec(head);
    if (m === null) throw new Error(`Çözülemeyen satır: ${raw}`);
    const [, speaker, expr, text] = m;
    line = { speaker: speaker ?? '', text: (text ?? '').trim() };
    if (expr !== undefined) {
      if (!EXPRESSIONS.has(expr)) throw new Error(`Bilinmeyen ifade "${expr}": ${raw}`);
      line.expression = expr as Line['expression'];
    }
  }
  head = line.text;
  if (head.length > MAX) throw new Error(`Satır ${head.length} karakter (en çok ${MAX}): ${head.slice(0, 60)}…`);
  if (head.length === 0) throw new Error(`Boş satır: ${raw}`);
  if (opts.bg !== undefined) line.bg = opts.bg as Line['bg'];
  if (opts.fx !== undefined) line.fx = opts.fx as Line['fx'];
  if (opts.style !== undefined) line.style = opts.style as Line['style'];
  return line;
}

/** Senaryo metnini satırlara çevirir. */
export function S(src: string): Line[] {
  return src
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '' && !l.startsWith('//'))
    .map(parseLine);
}

/** Koşulsuz tek blok. */
export const B = (src: string): ResponseBlock[] => [{ lines: S(src) }];

/** Koşullu blok. */
export const W = (when: Cond, src: string): ResponseBlock => ({ when, lines: S(src) });

/** Koşulsuz (son) blok. */
export const O = (src: string): ResponseBlock => ({ lines: S(src) });
