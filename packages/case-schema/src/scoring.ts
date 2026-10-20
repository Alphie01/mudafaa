import { z } from 'zod';
import { Val } from './expr.js';
import { ResultTone } from './outcome.js';
import { Category, Id } from './primitives.js';

/** Bir kategorinin etiketi ve beceri tavsiyeleri (zayıf <%40, orta %40–75, güçlü >%75). */
const CategoryScoring = z.strictObject({
  id: Category,
  label: z.string(),
  advice: z.strictObject({ weak: z.string(), medium: z.string().optional(), strong: z.string().optional() }),
});

/**
 * Skor yapılandırması. `categories` her `Category` için tam bir giriş içerir (tam 6, yinelenmeden); `lines` Karar
 * ekranındaki döküm satırlarıdır (`SCORE.line` bunlardan birini adlandırır), `bonuses` ham skora eklenen
 * değerlerdir, `thresholdBar` sonuç bantlarını `from` skorundan başlatır.
 */
export const ScoringConfig = z.strictObject({
  categories: z
    .array(CategoryScoring)
    .length(
      Category.options.length,
      `categories tam ${Category.options.length} kategori içermeli (her Category bir kez)`,
    )
    .superRefine((items, ctx) => {
      const seen = new Set<string>();
      items.forEach((item, index) => {
        if (seen.has(item.id)) {
          ctx.addIssue({
            code: 'custom',
            path: [index, 'id'],
            message: `${item.id} kategorisi birden fazla tanımlanmış`,
          });
        }
        seen.add(item.id);
      });
      const missing = Category.options.filter((category) => !seen.has(category));
      if (missing.length > 0) {
        ctx.addIssue({ code: 'custom', message: `categories eksik kategori içeriyor: ${missing.join(', ')}` });
      }
    }),
  lines: z.array(z.strictObject({ id: Id, label: z.string(), categories: z.array(Category).optional() })),
  bonuses: z.array(z.strictObject({ id: Id, label: z.string(), value: Val, line: Id.optional() })),
  multiplierPct: Val.optional(),
  scaleMax: z.int().positive(),
  thresholdBar: z.array(z.strictObject({ label: z.string(), from: z.int(), tone: ResultTone })),
  displayClampMin: z.int().optional(),
});
export type ScoringConfig = z.infer<typeof ScoringConfig>;
