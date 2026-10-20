import { z } from 'zod';
import { Cond } from './expr.js';
import { Category, Id } from './primitives.js';

/** Dava sonu raporundaki kaçırılan ipucu: `when` koşulu tutuyorsa `text` "kaçırdıkların" arasında görünür. */
export const ReportHint = z.strictObject({
  id: Id,
  when: Cond,
  text: z.string(),
  category: Category.optional(),
});
export type ReportHint = z.infer<typeof ReportHint>;
