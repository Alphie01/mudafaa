import type { Val } from '@mudafaa/case-schema';
import { EngineError, malformed } from '../errors.js';
import type { CompiledCase } from '../types.js';

/**
 * Değer ifadesinin türü: `int`, `bool`, `string` ya da `enum:<değişken kimliği>`. Enum tipi, enum'u tanımlayan
 * değişkenin kimliğini taşır (şemada ayrı bir enum tanımı yok); metin sabiti `string`'tir.
 */
export type ExprType = 'int' | 'bool' | 'string' | `enum:${string}`;

const isEnum = (t: ExprType): boolean => t.startsWith('enum:');

/** Sayısal işlemin işlenenleri `int` olmalı (aksi TYPE); `nonEmpty` verilirse liste boş olamaz. */
function intOperands(parts: readonly Val[], c: CompiledCase, nonEmpty?: 'min' | 'max'): 'int' {
  if (nonEmpty !== undefined && parts.length === 0) {
    throw new EngineError('TYPE', `${nonEmpty} en az bir değer içermeli`);
  }
  for (const part of parts) {
    const type = typeOf(part, c);
    if (type !== 'int') throw new EngineError('TYPE', `Sayı bekleniyordu, ${type} bulundu`);
  }
  return 'int';
}

/**
 * Değer ifadesinin türünü çıkarır; doğrulayıcı `cmp` işlenenlerini bununla karşılaştırır. Kurallar:
 * - Sayı sabiti, `score`, `count`, `uses`, `visits` ve her sayısal işlem (`add`, `sub`, `mul`, `div`, `min`, `max`,
 *   `round`) `int`'tir; işlemlerin işlenenlerinin hepsi `int` olmalıdır.
 * - `{var}` değişkenin tanımına göre `int`, `bool` ya da `enum:<kimlik>`'tir.
 * - `if`, dallarının ortak türüdür; enum değişken ile metin sabiti uyumludur ve sonuç enum olur.
 * Tür hatası (sayısal işlemde sayı olmayan işlenen, uyumsuz `if` dalları, boş `min`/`max`) TYPE, tanımsız değişken
 * UNKNOWN_VAR fırlatır. `cmp` işlenenlerinin birbiriyle uyumunu çağıran denetler: aynı tür ya da enum ile metin uyumludur;
 * `<`, `<=`, `>`, `>=` yalnızca `int` işlenen ister (`evalCond` da aynı kuralı TYPE ile uygular).
 */
export function typeOf(v: Val, c: CompiledCase): ExprType {
  if (typeof v === 'number') return 'int';
  if (typeof v === 'boolean') return 'bool';
  if (typeof v === 'string') return 'string';
  if (typeof v !== 'object' || v === null) return malformed('değer ifadesi', v);

  if ('var' in v) {
    const def = c.vars.get(v.var);
    if (def === undefined) throw new EngineError('UNKNOWN_VAR', v.var);
    return def.type === 'enum' ? `enum:${def.id}` : def.type;
  }
  if ('score' in v || 'count' in v || 'uses' in v || 'visits' in v) return 'int';
  if ('add' in v) return intOperands(v.add, c);
  if ('sub' in v) return intOperands(v.sub, c);
  if ('mul' in v) return intOperands(v.mul, c);
  if ('div' in v) return intOperands(v.div, c);
  if ('min' in v) return intOperands(v.min, c, 'min');
  if ('max' in v) return intOperands(v.max, c, 'max');
  if ('round' in v) return intOperands([v.round], c);
  if ('if' in v) {
    const then = typeOf(v.if.then, c);
    const other = typeOf(v.if.else, c);
    if (then === other) return then;
    if (isEnum(then) && other === 'string') return then;
    if (isEnum(other) && then === 'string') return other;
    throw new EngineError('TYPE', `if dalları uyumsuz: ${then} ile ${other}`);
  }
  return malformed('değer ifadesi', v);
}
