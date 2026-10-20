import type { Backdrop, Cond, Expression, Line, LineFx, LineStyle, ResponseBlock } from '../../../tools/content/src/kit/index.js';

// Dava #09'a özgü kısa satır yazımı. Her satır `baş: metin` biçimindedir. Baş:
//   konuşmacı[.ifade][@biçim][#arkaplan][!efekt]
// Kısaltmalar: N = anlatıcı, P = Deniz (konuşma), T = Deniz'in iç sesi (thought), C = başlık kartı (card),
// ?AD_SOYAD = kimliği gizli ses (anlatıcı + name; `_` boşluğa döner). Boş satırlar ve `//` ile başlayanlar atlanır.
// Satır 220 karakteri geçerse derleme durur (stil kuralı).

const EXPR = new Set(['normal', 'mutlu', 'kizgin', 'saskin', 'uzgun']);
const STYLE = new Set(['card', 'whisper', 'thought', 'phone']);
const FX = new Set(['shake', 'flash', 'fade']);
export const MAX_LINE = 220;

function parseLine(raw: string): Line {
  const i = raw.indexOf(': ');
  if (i < 0) throw new Error(`Satır biçimi "baş: metin" olmalı: ${raw}`);
  const head = raw.slice(0, i).trim();
  const text = raw.slice(i + 2).trim();
  if (text.length > MAX_LINE) throw new Error(`Satır ${text.length} karakter (> ${MAX_LINE}): ${text.slice(0, 60)}…`);
  const m = /^([^.@#!]+)((?:[.@#!][A-Za-z_]+)*)$/u.exec(head);
  if (m === null) throw new Error(`Geçersiz satır başı: ${head}`);
  const who = m[1] ?? '';
  const mods = m[2] ?? '';
  const line: Line = { speaker: 'narrator', text };
  if (who === 'N') line.speaker = 'narrator';
  else if (who === 'P') line.speaker = 'player';
  else if (who === 'T') {
    line.speaker = 'player';
    line.style = 'thought';
  } else if (who === 'C') line.style = 'card';
  else if (who.startsWith('?')) line.name = who.slice(1).replaceAll('_', ' ');
  else line.speaker = who;
  for (const mm of mods.matchAll(/([.@#!])([A-Za-z_]+)/gu)) {
    const [, k, v] = mm;
    if (v === undefined) continue;
    if (k === '.') {
      if (!EXPR.has(v)) throw new Error(`Geçersiz ifade ${v}: ${raw}`);
      line.expression = v as Expression;
    } else if (k === '@') {
      if (!STYLE.has(v)) throw new Error(`Geçersiz biçim ${v}: ${raw}`);
      line.style = v as LineStyle;
    } else if (k === '#') line.bg = v as Backdrop;
    else if (k === '!') {
      if (!FX.has(v)) throw new Error(`Geçersiz efekt ${v}: ${raw}`);
      line.fx = v as LineFx;
    }
  }
  // Alan sırası şemadaki gibi kalsın (JSON okunur olsun).
  const out: Line = { speaker: line.speaker };
  if (line.expression !== undefined) out.expression = line.expression;
  out.text = line.text;
  if (line.name !== undefined) out.name = line.name;
  if (line.bg !== undefined) out.bg = line.bg;
  if (line.fx !== undefined) out.fx = line.fx;
  if (line.style !== undefined) out.style = line.style;
  return out;
}

/** Çok satırlı senaryo → satırlar. */
export function S(script: string): Line[] {
  return script
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '' && !l.startsWith('//'))
    .map(parseLine);
}

/** Koşulsuz tek blok. */
export const B = (script: string): ResponseBlock[] => [{ lines: S(script) }];
/** Koşullu blok. */
export const W = (when: Cond, script: string): ResponseBlock => ({ when, lines: S(script) });
/** Koşulsuz blok (blok listesinin sonu). */
export const O = (script: string): ResponseBlock => ({ lines: S(script) });
/** Tek satır. */
export const S1 = (script: string): Line => {
  const ls = S(script);
  if (ls.length !== 1 || ls[0] === undefined) throw new Error(`S1 tek satır ister: ${script}`);
  return ls[0];
};
