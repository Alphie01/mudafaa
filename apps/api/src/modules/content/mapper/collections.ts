import type { Prisma } from '../../../generated/prisma/client.js';

/** Eşleyicinin çalıştığı transaction istemcisi. */
export type Tx = Prisma.TransactionClient;

/**
 * Satıra dönüşen isteğe bağlı koleksiyonlar. Paket bunları `[]` olarak verdiyse sahibin `emptyCollections` dizisine
 * adı yazılır; dışa aktarımda satır yoksa ad listede ise `[]` geri gelir, değilse alan hiç yazılmaz (varlık ile boşluk
 * ayrımı kaybolmaz).
 */
export const ROW_COLLECTIONS = [
  'effects',
  'responses',
  'variants',
  'onEnter',
  'onFirstEnter',
  'lines',
  'statements',
] as const;
export type RowCollection = (typeof ROW_COLLECTIONS)[number];

/** Nesnede `[]` olarak verilmiş satır koleksiyonlarının adları. */
export function emptyCollections(owner: object, names: readonly RowCollection[]): string[] {
  const rec = owner as Record<string, unknown>;
  return names.filter((n) => Array.isArray(rec[n]) && (rec[n] as unknown[]).length === 0);
}

/** Dışa aktarımda koleksiyonu geri koyar: satır varsa satırlar, yoksa ad `empties` içindeyse `[]`, değilse hiçbir şey. */
export function restore<T>(
  target: Record<string, unknown>,
  name: RowCollection,
  rows: T[],
  empties: readonly string[],
) {
  if (rows.length > 0) target[name] = rows;
  else if (empties.includes(name)) target[name] = [];
}

/** İsteğe bağlı JSON kolon değeri (`undefined` → NULL). */
export const json = (v: unknown): Prisma.InputJsonValue | undefined =>
  v === undefined ? undefined : (v as Prisma.InputJsonValue);

/** NULL kolonu paketteki "alan yok" anlamına çevirir. */
export const opt = <T>(v: T | null): T | undefined => (v === null ? undefined : v);

/** `undefined` değerli anahtarları atar (sığ); dışa aktarılan nesne girdiyle anahtar anahtar aynı olur. */
export function defined<T extends Record<string, unknown>>(o: T): T {
  for (const k of Object.keys(o)) if (o[k] === undefined) delete o[k];
  return o;
}

/** Bir satır kümesini `ownerId` → sıralı liste olarak gruplar. */
export function groupBy<T>(rows: readonly T[], key: (r: T) => string | null): Map<string, T[]> {
  const out = new Map<string, T[]>();
  for (const r of rows) {
    const k = key(r);
    if (k === null) continue;
    const list = out.get(k);
    if (list === undefined) out.set(k, [r]);
    else list.push(r);
  }
  return out;
}

/** `createManyAndReturn` sonucunu `key` → `id` haritasına çevirir (Postgres RETURNING sırasına güvenmeden). */
export const idsByKey = (rows: readonly { id: string; key: string }[]): Map<string, string> =>
  new Map(rows.map((r) => [r.key, r.id] as const));

/** Haritada olmayan anahtar eşleyicinin bir iç hatasıdır (paket önceden derlenmiş olmalı). */
export function must(map: ReadonlyMap<string, string>, key: string, what: string): string {
  const id = map.get(key);
  if (id === undefined) throw new Error(`İçerik eşleyici: bilinmeyen ${what} anahtarı: ${key}`);
  return id;
}
