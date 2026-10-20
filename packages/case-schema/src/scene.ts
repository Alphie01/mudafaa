import { z } from 'zod';
import { Effect } from './effect.js';
import { Cond } from './expr.js';
import { Id, Rect } from './primitives.js';

/** Sahne nesnesinin dokunma alanı; koordinatlar sahnenin kendi tamsayı birimindedir. */
export const Shape = z.union([
  z.strictObject({ rect: Rect }),
  z.strictObject({ circle: z.strictObject({ cx: z.int(), cy: z.int(), r: z.int().positive() }) }),
  z.strictObject({ polygon: z.array(z.tuple([z.int(), z.int()])).min(3, 'polygon en az 3 köşe içermeli') }),
]);
export type Shape = z.infer<typeof Shape>;

/**
 * Sahnede dokunulabilen nesne. TAP, `z` değeri en büyük olan aktif nesneye isabet eder (eşitlikte yazım sırası).
 * `marker` nesnenin sahnede önceden görünüp görünmediğini söyler; `feedback.short` etiket, `feedback.text` bulunca
 * gösterilen metindir.
 */
export const SceneObject = z.strictObject({
  id: Id,
  name: z.string(),
  marker: z.enum(['HIDDEN', 'VISIBLE']),
  shapes: z.array(Shape).min(1, 'shapes en az bir şekil içermeli'),
  z: z.int().optional(),
  activeWhen: Cond.optional(),
  effects: z.array(Effect).optional(),
  feedback: z.strictObject({ text: z.string(), short: z.string() }),
  badge: z.string().optional(),
  inspectNode: Id.optional(),
  maxUses: z.int().positive().optional(),
});
export type SceneObject = z.infer<typeof SceneObject>;

/** Olay yeri: `width` × `height` sahne birimidir; `image` bir `assets` kimliğidir. */
export const SceneDef = z.strictObject({
  id: Id,
  title: z.string(),
  description: z.string().optional(),
  width: z.int().positive(),
  height: z.int().positive(),
  image: Id,
  touchPadding: z.int().min(0).optional(),
  unlockWhen: Cond.optional(),
  objects: z.array(SceneObject),
});
export type SceneDef = z.infer<typeof SceneDef>;
