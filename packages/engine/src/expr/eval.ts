import { Category } from '@mudafaa/case-schema';
import type { Cond, Val } from '@mudafaa/case-schema';
import { EngineError, malformed } from '../errors.js';
import { getOwn } from '../own.js';
import type { EvalCtx } from '../types.js';

// İfade değerlendirici: saf ve I/O'suzdur; durumu değiştirmez. Kimlik anahtarlı her durum okuması `getOwn` ile yapılır
// (içerik kimliği `constructor` gibi bir sözcük olabilir); tanımlar `CompiledCase`'in Map'lerinden gelir.

type Scalar = number | string | boolean;
type CmpOp = '==' | '!=' | '<' | '<=' | '>' | '>=';

const CATEGORIES: readonly string[] = Category.options;

/** −0'ı 0'a çevirir: sayı sonuçları durumda ve hash'te işaretli sıfır taşımasın. */
const norm = (n: number): number => (n === 0 ? 0 : n);

/**
 * Varyantlı seçimin `uses` anahtarı (`ch#variant`). Kimlik kalıbı `#` içermediği için başka bir seçenek kimliğiyle
 * çakışamaz. `{chosen, variant}` bu anahtarı okur; seçimi sayan etki uygulayıcı da aynı yardımcıyla yazar.
 */
export const variantKey = (choiceId: string, variantId: string): string => `${choiceId}#${variantId}`;

/** Değeri hesaplar ve sayı olmasını ister. */
function num(v: Val, ctx: EvalCtx): number {
  const x = evalVal(v, ctx);
  if (typeof x !== 'number') throw new EngineError('TYPE', `Sayı bekleniyordu, ${typeof x} bulundu: ${String(x)}`);
  return x;
}

/** `min`/`max`: şema boş listeyi reddeder ama TS tipi izin verir; ±Infinity yerine TYPE. */
function extreme(name: 'min' | 'max', parts: readonly Val[], ctx: EvalCtx): number {
  if (parts.length === 0) throw new EngineError('TYPE', `${name} en az bir değer içermeli`);
  const pick = name === 'min' ? Math.min : Math.max;
  return norm(parts.map((part) => num(part, ctx)).reduce((a, b) => pick(a, b)));
}

function readVar(id: string, ctx: EvalCtx): Scalar {
  const value = getOwn(ctx.s.vars, id);
  if (value === undefined) throw new EngineError('UNKNOWN_VAR', id);
  return value;
}

/** `{score}`: `raw` kategori toplamı, `final` yalnızca `ctx.final` doluyken, `cat:X` tek kategori. */
function readScore(which: string, ctx: EvalCtx): number {
  if (which === 'raw') {
    let sum = 0;
    for (const category of Category.options) sum += getOwn(ctx.s.score.cat, category) ?? 0;
    return norm(sum);
  }
  if (which === 'final') {
    // 0 ve negatif final geçerlidir; yalnızca `undefined` "hesaplanmadı" demektir.
    if (ctx.final === undefined) {
      throw new EngineError('FINAL_UNAVAILABLE', '{score:"final"} yalnızca sonuç hesaplanırken kullanılabilir');
    }
    return norm(ctx.final);
  }
  if (which.startsWith('cat:')) {
    const category = which.slice('cat:'.length);
    if (CATEGORIES.includes(category)) return getOwn(ctx.s.score.cat, category as Category) ?? 0;
  }
  return malformed('skor', which);
}

/** `{count:'evidence'}`: bulunmuş delillerden `kind` ve `tag` süzgecine uyanların sayısı. */
function countEvidence(filter: { kind?: string; tag?: string }, ctx: EvalCtx): number {
  const filtered = filter.kind !== undefined || filter.tag !== undefined;
  let count = 0;
  // Yalnızca sayılır: anahtar sırası sonucu etkilemez, bu yüzden sıralamaya gerek yok.
  for (const id of Object.keys(ctx.s.evidence)) {
    if (filtered) {
      const def = ctx.c.evidence.get(id);
      if (def === undefined) continue; // tanımı olmayan delil süzgece uyamaz
      if (filter.kind !== undefined && def.kind !== filter.kind) continue;
      if (filter.tag !== undefined && !(def.tags ?? []).includes(filter.tag)) continue;
    }
    count += 1;
  }
  return count;
}

/**
 * Değer ifadesini hesaplar. Sayısal işlemler yalnızca sayı kabul eder (aksi TYPE). Davranış kuralları:
 * - `div` aşağı yuvarlar (`7/2 = 3`, `−7/2 = −4`); sıfıra bölme 0 verir.
 * - `round` yarımı +∞ yönüne yuvarlar (`2.5 → 3`, `−2.5 → −2`).
 * - Boş `add` 0, boş `mul` 1 verir; boş `min`/`max` tanımsızdır (şema reddeder) ve TYPE fırlatır.
 * - `if` yalnızca seçilen dalı hesaplar.
 * - `{var}` durumda olmayan değişken için UNKNOWN_VAR; `{score:'final'}` `ctx.final` boşken FINAL_UNAVAILABLE fırlatır.
 * - Sonuçta −0 oluşmaz.
 */
export function evalVal(v: Val, ctx: EvalCtx): number | string | boolean {
  if (typeof v === 'number') return norm(v);
  if (typeof v === 'string' || typeof v === 'boolean') return v;
  if (typeof v !== 'object' || v === null) return malformed('değer ifadesi', v);

  if ('var' in v) return readVar(v.var, ctx);
  if ('score' in v) return readScore(v.score, ctx);
  if ('count' in v) return countEvidence(v, ctx);
  if ('uses' in v) return getOwn(ctx.s.uses, v.uses) ?? 0;
  if ('visits' in v) return getOwn(ctx.s.visits, v.visits) ?? 0;
  if ('add' in v) {
    let sum = 0;
    for (const part of v.add) sum += num(part, ctx);
    return norm(sum);
  }
  if ('sub' in v) return norm(num(v.sub[0], ctx) - num(v.sub[1], ctx));
  if ('mul' in v) {
    let product = 1;
    for (const part of v.mul) product *= num(part, ctx);
    return norm(product);
  }
  if ('div' in v) {
    const dividend = num(v.div[0], ctx);
    const divisor = num(v.div[1], ctx);
    return divisor === 0 ? 0 : norm(Math.floor(dividend / divisor));
  }
  if ('min' in v) return extreme('min', v.min, ctx);
  if ('max' in v) return extreme('max', v.max, ctx);
  if ('round' in v) return norm(Math.round(num(v.round, ctx)));
  if ('if' in v) return evalCond(v.if.when, ctx) ? evalVal(v.if.then, ctx) : evalVal(v.if.else, ctx);
  return malformed('değer ifadesi', v);
}

/** `==`/`!=` aynı türden iki değer ister; sıralama işleçleri yalnızca sayılarla çalışır. Aksi TYPE. */
function compare(left: Scalar, op: CmpOp, right: Scalar): boolean {
  if (op === '==' || op === '!=') {
    if (typeof left !== typeof right) {
      throw new EngineError('TYPE', `${typeof left} ile ${typeof right} karşılaştırılamaz (${op})`);
    }
    return (left === right) === (op === '==');
  }
  if (typeof left !== 'number' || typeof right !== 'number') {
    throw new EngineError('TYPE', `${op} yalnızca sayılarla kullanılır (${typeof left}, ${typeof right})`);
  }
  switch (op) {
    case '<':
      return left < right;
    case '<=':
      return left <= right;
    case '>':
      return left > right;
    case '>=':
      return left >= right;
    default:
      return malformed('karşılaştırma işleci', op);
  }
}

/**
 * Koşulu hesaplar. `all` ve `any` kısa devre yapar; `{all:[]}` doğru, `{any:[]}` yanlıştır. Durum okumaları:
 * - `hasEvidence` / `met` / `found`: kaydın varlığına bakar (0 değeri de "var" sayılır).
 * - `visited`: node en az bir kez girilmiş. `atNode`: oyuncu şu an o node'da (`nodeId`).
 * - `chosen`: seçenek en az bir kez seçilmiş; `variant` verilirse `uses['ch#variant']` ≥ 1.
 * - `flag`: değişken `true`. Durumda olmayan değişken UNKNOWN_VAR fırlatır; bool olmayan değişken `true` olamaz.
 * - `ref`: `c.predicates`'tan çözülür; tanımsız ad UNKNOWN_PREDICATE fırlatır (döngüleri `compile` reddeder).
 */
export function evalCond(c: Cond, ctx: EvalCtx): boolean {
  if (typeof c !== 'object' || c === null) return malformed('koşul', c);

  if ('all' in c) {
    for (const part of c.all) if (!evalCond(part, ctx)) return false;
    return true;
  }
  if ('any' in c) {
    for (const part of c.any) if (evalCond(part, ctx)) return true;
    return false;
  }
  if ('not' in c) return !evalCond(c.not, ctx);
  if ('cmp' in c) return compare(evalVal(c.cmp[0], ctx), c.cmp[1], evalVal(c.cmp[2], ctx));
  if ('hasEvidence' in c) return getOwn(ctx.s.evidence, c.hasEvidence) !== undefined;
  if ('met' in c) return getOwn(ctx.s.characters, c.met) !== undefined;
  if ('visited' in c) return (getOwn(ctx.s.visits, c.visited) ?? 0) > 0;
  if ('atNode' in c) return ctx.s.nodeId === c.atNode;
  if ('chosen' in c) {
    const key = c.variant === undefined ? c.chosen : variantKey(c.chosen, c.variant);
    return (getOwn(ctx.s.uses, key) ?? 0) >= 1;
  }
  if ('found' in c) return getOwn(ctx.s.found, c.found) !== undefined;
  if ('flag' in c) return readVar(c.flag, ctx) === true;
  if ('ref' in c) {
    const predicate = ctx.c.predicates.get(c.ref);
    if (predicate === undefined) throw new EngineError('UNKNOWN_PREDICATE', c.ref);
    return evalCond(predicate, ctx);
  }
  return malformed('koşul', c);
}
