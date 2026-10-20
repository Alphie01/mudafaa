import { z } from 'zod';
import { Id } from './primitives.js';

/** Değişkenin HUD göstergesi: `VariableDef.display.widget` ile görünümdeki `HudItem.widget` bu şemayı paylaşır. */
export const VariableWidget = z.enum([
  'meter10',
  'hearts',
  'percentBar',
  'minutes',
  'pips',
  'counter',
  'score',
  'label',
]);
export type VariableWidget = z.infer<typeof VariableWidget>;

const VariableDisplay = z.strictObject({
  label: z.string(),
  widget: VariableWidget,
  max: z.int().positive().optional(),
  lowAt: z.int().optional(),
  /** Maliyet etiketi şablonu: `{n}` tutarla değişir (ör. "{n} EP"); yoksa "<tutar> <label>". */
  format: z.string().optional(),
});

/**
 * Oturum değişkeninin tanımı. `type` hangi alanların anlamlı olduğunu belirler:
 * - `int`: `min`/`max` (ikisi de isteğe bağlı) `initial`'ı sınırlar; motor değeri `[min, max]` aralığına sıkıştırır.
 * - `bool`: `initial` true/false.
 * - `enum`: `enumValues` zorunludur ve `initial` bu listeden biridir.
 * Mesajlar alan adlarını (`initial`, `min`, `max`, `enumValues`) olduğu gibi içerir.
 */
export const VariableDef = z
  .strictObject({
    id: Id,
    type: z.enum(['int', 'bool', 'enum']),
    initial: z.union([z.number(), z.boolean(), z.string()]),
    min: z.int().optional(),
    max: z.int().optional(),
    enumValues: z.array(z.string().min(1)).min(1).optional(),
    visibility: z.enum(['HIDDEN', 'VISIBLE']),
    analysis: z.enum(['resource', 'counter']).optional(),
    display: VariableDisplay.optional(),
  })
  .superRefine((def, ctx) => {
    const fail = (key: string, message: string) => ctx.addIssue({ code: 'custom', path: [key], message });
    const { type, initial, min, max, enumValues } = def;

    if (type !== 'int') {
      if (min !== undefined) fail('min', `min yalnızca int değişkenlerde kullanılır (type: ${type})`);
      if (max !== undefined) fail('max', `max yalnızca int değişkenlerde kullanılır (type: ${type})`);
    }
    if (type !== 'enum' && enumValues !== undefined) {
      fail('enumValues', `enumValues yalnızca enum değişkenlerde kullanılır (type: ${type})`);
    }

    switch (type) {
      case 'int':
        if (typeof initial !== 'number' || !Number.isInteger(initial)) {
          fail('initial', `int değişkenin initial değeri tamsayı olmalı: ${JSON.stringify(initial)}`);
        }
        if (min !== undefined && max !== undefined && min > max) {
          fail('max', `max (${max}) min (${min}) değerinden küçük olamaz`);
        }
        if (typeof initial === 'number') {
          if (min !== undefined && initial < min) {
            fail('initial', `initial (${initial}) min (${min}) değerinin altında`);
          }
          if (max !== undefined && initial > max) {
            fail('initial', `initial (${initial}) max (${max}) değerinin üstünde`);
          }
        }
        break;
      case 'bool':
        if (typeof initial !== 'boolean') {
          fail('initial', `bool değişkenin initial değeri true ya da false olmalı: ${JSON.stringify(initial)}`);
        }
        break;
      case 'enum':
        if (enumValues === undefined) {
          fail('enumValues', 'enum değişken enumValues listesi taşımalı');
        } else if (new Set(enumValues).size !== enumValues.length) {
          fail('enumValues', 'enumValues yinelenen değer içeriyor');
        }
        if (typeof initial !== 'string') {
          fail('initial', `enum değişkenin initial değeri enumValues üyesi (metin) olmalı: ${JSON.stringify(initial)}`);
        } else if (enumValues !== undefined && !enumValues.includes(initial)) {
          fail('initial', `initial (${JSON.stringify(initial)}) enumValues içinde yok: ${enumValues.join(', ')}`);
        }
        break;
    }
  });
export type VariableDef = z.infer<typeof VariableDef>;
