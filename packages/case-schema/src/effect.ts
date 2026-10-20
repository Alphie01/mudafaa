import { z } from 'zod';
import { Cond, Val } from './expr.js';
import { Category, Id } from './primitives.js';

// IF kendi türünden etkiler taşır; Val/Cond'daki gibi tip elle yazılır, şema onunla işaretlenir.

/** Kalite işareti: `MARK` etkisinin `quality` alanı ile seçeneğin `quality.q` alanı bu şemayı paylaşır. */
export const MarkQuality = z.enum(['GOOD', 'BAD', 'NEUTRAL']);
export type MarkQuality = z.infer<typeof MarkQuality>;

/** Oyun durumunu değiştiren etki. */
export type Effect =
  | { type: 'VAR'; var: Id; op: 'set' | 'inc' | 'dec'; value: Val }
  /** `amount` bir ifade olabilir (ör. strateji çarpanı); `line` Karar ekranındaki döküm satırıdır. */
  | { type: 'SCORE'; category: Category; amount: Val; line?: Id }
  | { type: 'DISCOVER'; evidence: Id }
  | { type: 'MEET'; character: Id }
  | { type: 'MARK'; quality: 'GOOD' | 'BAD' | 'NEUTRAL'; feedback: string; category?: Category }
  | { type: 'IF'; when: Cond; then: Effect[]; else?: Effect[] }
  | { type: 'GOTO'; node: Id }
  | { type: 'END'; outcome?: Id };

export const Effect: z.ZodType<Effect> = z.lazy(() =>
  z.discriminatedUnion('type', [
    z.strictObject({ type: z.literal('VAR'), var: Id, op: z.enum(['set', 'inc', 'dec']), value: Val }),
    z.strictObject({ type: z.literal('SCORE'), category: Category, amount: Val, line: Id.optional() }),
    z.strictObject({ type: z.literal('DISCOVER'), evidence: Id }),
    z.strictObject({ type: z.literal('MEET'), character: Id }),
    z.strictObject({
      type: z.literal('MARK'),
      quality: MarkQuality,
      // Boş metni şema değil doğrulayıcı raporlar (MISSING_TEXT); bu yüzden `.min(1)` yok.
      feedback: z.string(),
      category: Category.optional(),
    }),
    z.strictObject({ type: z.literal('IF'), when: Cond, then: z.array(Effect), else: z.array(Effect).optional() }),
    z.strictObject({ type: z.literal('GOTO'), node: Id }),
    z.strictObject({ type: z.literal('END'), outcome: Id.optional() }),
  ]),
);
