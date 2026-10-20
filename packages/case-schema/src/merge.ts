/** Parçalar birleştirilemediğinde fırlatılır; `path` sorunlu değerin noktalı yoludur (parçanın kökü için boş metin). */
export class MergeError extends Error {
  readonly path: string;

  constructor(path: string, message: string) {
    super(message);
    this.name = 'MergeError';
    this.path = path;
  }
}

type JsonObject = Record<string, unknown>;

// Prototip kirliliğine yol açabilecek anahtarlar hiçbir derinlikte kabul edilmez ve hedefe asla atanmaz (Ruling 23).
const FORBIDDEN_KEYS: ReadonlySet<string> = new Set(['__proto__', 'constructor', 'prototype']);

/** Düz nesne: prototipi `Object.prototype` ya da `null` olan nesne (JSON.parse'ın ürettiği biçim). */
const isPlainObject = (value: unknown): value is JsonObject => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const proto: unknown = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

const isScalar = (value: unknown): value is string | number | boolean | null =>
  value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';

const join = (path: string, key: string | number): string => (path === '' ? String(key) : `${path}.${key}`);

/** Hata mesajı için kısa tanım: metinler tırnaklı (uzunsa kısaltılmış), diziler ve nesneler türüyle. */
const describe = (value: unknown): string => {
  if (Array.isArray(value)) return 'bir dizi';
  if (isPlainObject(value)) return 'bir nesne';
  if (typeof value === 'string') return JSON.stringify(value.length > 40 ? `${value.slice(0, 40)}…` : value);
  if (isScalar(value)) return String(value);
  return typeof value;
};

const kindOf = (value: unknown, path: string, part: number): 'array' | 'object' | 'scalar' => {
  if (Array.isArray(value)) return 'array';
  if (isPlainObject(value)) return 'object';
  if (isScalar(value)) return 'scalar';
  throw new MergeError(path, `JSON olmayan değer: ${path} (${part + 1}. parça, ${describe(value)})`);
};

/** JSON değerinin derin kopyası; yasak anahtarları ve JSON olmayan değerleri reddeder. */
const copyValue = (value: unknown, path: string, part: number): unknown => {
  switch (kindOf(value, path, part)) {
    case 'array':
      return (value as unknown[]).map((item, index) => copyValue(item, join(path, index), part));
    case 'object': {
      const copy: JsonObject = {};
      mergeObject(copy, value as JsonObject, path, part);
      return copy;
    }
    case 'scalar':
      return value;
  }
};

/** `source`'u `target`'a katar. `target` her zaman bu modülün kurduğu bir kopyadır; girdi nesnelerine yazılmaz. */
const mergeObject = (target: JsonObject, source: JsonObject, path: string, part: number): void => {
  for (const key of Object.keys(source)) {
    const at = join(path, key);
    if (FORBIDDEN_KEYS.has(key)) {
      throw new MergeError(
        at,
        `Yasak anahtar: ${at} (${part + 1}. parça). __proto__, constructor ve prototype prototip kirliliğine yol açabileceği için kullanılamaz`,
      );
    }
    const incoming = source[key];
    // JSON'daki gibi: `undefined` değer, anahtar hiç yokmuş gibi atlanır.
    if (incoming === undefined) continue;
    const incomingKind = kindOf(incoming, at, part);
    // Object.hasOwn: `toString` gibi kalıtılan adlar "zaten var" sayılmaz (Ruling 18).
    if (!Object.hasOwn(target, key)) {
      target[key] = copyValue(incoming, at, part);
      continue;
    }
    const existing = target[key];
    if (incomingKind === 'array' && Array.isArray(existing)) {
      for (const item of copyValue(incoming, at, part) as unknown[]) existing.push(item);
    } else if (incomingKind === 'object' && isPlainObject(existing)) {
      mergeObject(existing, incoming as JsonObject, at, part);
    } else if (!(incomingKind === 'scalar' && existing === incoming)) {
      throw new MergeError(
        at,
        `Birleştirme çakışması: ${at} önceki parçalarda ${describe(existing)}, ${part + 1}. parçada ${describe(incoming)}`,
      );
    }
  }
};

/**
 * İçerik parçalarını (ör. `NN-*.json` dosyaları) verilen sırayla tek bir CasePackage girdisine birleştirir:
 * - diziler sırayla uç uca eklenir (öğeler birleştirilmez, kopyalanır);
 * - düz nesneler derin birleştirilir;
 * - aynı yoldaki iki farklı skaler değer ya da tür uyuşmazlığı (dizi / nesne / skaler) `MergeError` fırlatır; aynı skalerin
 *   tekrarı çakışma sayılmaz.
 * Her parça bir JSON nesnesi olmalıdır. `__proto__`, `constructor`, `prototype` anahtarları ve JSON olmayan değerler
 * reddedilir. Hatanın `path`'i sorunlu değerin parçadaki yoludur (dizi indisleri parçadaki sırayladır); mesaj parçanın
 * sırasını da (1'den başlayarak) verir. Girdiler değiştirilmez ve sonuç girdilerle yapı paylaşmaz.
 */
export function mergeCaseParts(parts: readonly unknown[]): unknown {
  const merged: JsonObject = {};
  parts.forEach((part, index) => {
    if (!isPlainObject(part)) {
      throw new MergeError('', `${index + 1}. parça bir JSON nesnesi olmalı (${describe(part)} verildi)`);
    }
    mergeObject(merged, part, '', index);
  });
  return merged;
}
