import type { SessionState } from './types.js';

/**
 * Kanonik JSON: nesne anahtarları sıralı, boşluksuz; `undefined` alanlar atlanır (dizide `null` olur). Aynı içerik,
 * anahtarların eklenme sırasından bağımsız olarak hep aynı metni üretir (paket hash'i, durum hash'i, doğrulayıcı anahtarı).
 */
export function canonicalJson(x: unknown): string {
  if (x === null || typeof x !== 'object') return JSON.stringify(x) ?? 'null';
  if (Array.isArray(x)) return `[${x.map((v) => (v === undefined ? 'null' : canonicalJson(v))).join(',')}]`;
  const record = x as Record<string, unknown>;
  const keys = Object.keys(record)
    .filter((k) => record[k] !== undefined)
    .sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalJson(record[k])}`).join(',')}}`;
}

/** Metnin UTF-8 baytları üzerinde 64 bit FNV-1a; 16 haneli küçük harf onaltılık. 16 bitlik dört limble (BigInt'siz). */
export function fnv1a64(text: string): string {
  // Ofset tabanı 0xcbf29ce484222325, en düşük limb önce.
  let h0 = 0x2325;
  let h1 = 0x8422;
  let h2 = 0x9ce4;
  let h3 = 0xcbf2;
  const mix = (byte: number): void => {
    h0 ^= byte;
    // Asal 0x100000001b3 = (0x0100 << 32) + 0x01b3: yalnızca p0 = 0x1b3 ve p2 = 0x100 sıfır değil.
    const t0 = h0 * 0x1b3;
    let t1 = h1 * 0x1b3;
    let t2 = h2 * 0x1b3 + (h0 << 8);
    const t3 = h3 * 0x1b3 + (h1 << 8);
    t1 += t0 >>> 16;
    h0 = t0 & 0xffff;
    t2 += t1 >>> 16;
    h1 = t1 & 0xffff;
    h3 = (t3 + (t2 >>> 16)) & 0xffff;
    h2 = t2 & 0xffff;
  };
  for (const ch of text) {
    const cp = ch.codePointAt(0) ?? 0;
    if (cp < 0x80) mix(cp);
    else if (cp < 0x800) {
      mix(0xc0 | (cp >> 6));
      mix(0x80 | (cp & 63));
    } else if (cp < 0x10000) {
      mix(0xe0 | (cp >> 12));
      mix(0x80 | ((cp >> 6) & 63));
      mix(0x80 | (cp & 63));
    } else {
      mix(0xf0 | (cp >> 18));
      mix(0x80 | ((cp >> 12) & 63));
      mix(0x80 | ((cp >> 6) & 63));
      mix(0x80 | (cp & 63));
    }
  }
  const hex = (n: number): string => n.toString(16).padStart(4, '0');
  return `${hex(h3)}${hex(h2)}${hex(h1)}${hex(h0)}`;
}

/** Oturum durumunun kararlı hash'i (anahtar sırasından bağımsız). */
export const stateHash = (s: SessionState): string => fnv1a64(canonicalJson(s));
