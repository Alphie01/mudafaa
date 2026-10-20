import { z } from 'zod';
import { Effect } from './effect.js';
import { Cond } from './expr.js';
import { Id } from './primitives.js';

/**
 * Tetikleyici: `when` koşulu false'tan true'ya döndüğünde `effects` uygulanır ve varsa `goto` node'una geçilir.
 * `scope` verilirse yalnızca o node'dayken çalışır (yoksa dava geneli); `once` bir kez çalışmasını sağlar;
 * `priority` artan sırayla işlenir.
 */
export const TriggerDef = z.strictObject({
  id: Id,
  scope: Id.optional(),
  priority: z.int(),
  when: Cond,
  once: z.boolean().optional(),
  effects: z.array(Effect).optional(),
  goto: Id.optional(),
});
export type TriggerDef = z.infer<typeof TriggerDef>;
