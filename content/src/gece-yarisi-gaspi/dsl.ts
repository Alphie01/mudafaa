import type {
  Backdrop,
  Cond,
  Expression,
  Line,
  LineFx,
  LineStyle,
  ResponseBlock,
} from '../../../tools/content/src/kit/index.js';

// Dava #05 satır kısaltması. Her satır bir konuşma satırıdır (boş satırlar atlanır):
//   # METİN [bg:depo]      yer/saat kartı (anlatıcı, style card)
//   > METİN                anlatıcı
//   ~ METİN                Deniz'in iç sesi (player, style thought)
//   - METİN                Deniz'in kendi sözü (player)
//   @AD: METİN             kimliği gizli ses (anlatıcı + gösterilen ad)
//   kimlik: METİN          karakter; kimlik/ifade: METİN (ör. baris/uzgun: …)
// Satır sonundaki ekler: {shake} {flash} {fade} · [bg:ad] · [phone] [whisper] [thought]

const FX = /\s*\{(shake|flash|fade)\}\s*$/;
const BG = /\s*\[bg:([a-z_]+)\]\s*$/;
const STYLE = /\s*\[(phone|whisper|thought|card)\]\s*$/;

function parse(raw: string): Line {
  let s = raw.trim();
  let fx: LineFx | undefined;
  let bg: Backdrop | undefined;
  let style: LineStyle | undefined;
  for (let changed = true; changed;) {
    changed = false;
    const f = FX.exec(s);
    if (f) {
      fx = f[1] as LineFx;
      s = s.slice(0, f.index);
      changed = true;
    }
    const b = BG.exec(s);
    if (b) {
      bg = b[1] as Backdrop;
      s = s.slice(0, b.index);
      changed = true;
    }
    const st = STYLE.exec(s);
    if (st) {
      style = st[1] as LineStyle;
      s = s.slice(0, st.index);
      changed = true;
    }
  }
  let line: Line;
  const head = s[0];
  if (head === '#') line = { speaker: 'narrator', text: s.slice(1).trim(), style: 'card' };
  else if (head === '>') line = { speaker: 'narrator', text: s.slice(1).trim() };
  else if (head === '~') line = { speaker: 'player', text: s.slice(1).trim(), style: 'thought' };
  else if (head === '-') line = { speaker: 'player', text: s.slice(1).trim() };
  else if (head === '@') {
    const i = s.indexOf(':');
    line = { speaker: 'narrator', name: s.slice(1, i).trim(), text: s.slice(i + 1).trim() };
  } else {
    const m = /^([a-z_]+)(?:\/(normal|mutlu|kizgin|saskin|uzgun))?:\s*(.*)$/.exec(s);
    if (!m) throw new Error(`Satır çözümlenemedi: ${raw}`);
    line = { speaker: m[1] as string, text: (m[3] as string).trim() };
    if (m[2]) line = { speaker: line.speaker, expression: m[2] as Expression, text: line.text };
  }
  if (style !== undefined && line.style === undefined) line = { ...line, style };
  if (bg !== undefined) line = { ...line, bg };
  if (fx !== undefined) line = { ...line, fx };
  if (line.text === '') throw new Error(`Boş satır: ${raw}`);
  return line;
}

/** Çok satırlı kaynaktan satır dizisi. */
export const T = (src: string): Line[] =>
  src
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '' && !l.startsWith('//'))
    .map(parse);

/** Koşulsuz tek yanıt bloğu. */
export const B = (src: string): ResponseBlock[] => [{ lines: T(src) }];
/** Koşullu yanıt bloğu. */
export const W = (when: Cond, src: string): ResponseBlock => ({ when, lines: T(src) });
/** Varsayılan yanıt bloğu. */
export const O = (src: string): ResponseBlock => ({ lines: T(src) });

/** Düğümdeki `$return` geçişlerini `to` node'una yönlendirir (yığınsız ara evresi için). `to` yoksa olduğu gibi. */
export function retarget<N extends { choices: { next?: unknown }[] }>(node: N, to?: string): N {
  if (to === undefined) return node;
  return {
    ...node,
    choices: node.choices.map((c) => (c.next === '$return' ? { ...c, next: to } : c)),
  };
}
