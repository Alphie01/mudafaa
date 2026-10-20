import { z } from 'zod';
import { Cond } from './expr.js';
import { Id } from './primitives.js';

/** Duruşmanın aşaması: `CourtSessionDef.stages` ile COURTROOM node'unun `courtStage` alanı bu değerleri kullanır. */
export const CourtStageType = z.enum([
  'ACILIS',
  'IDDIANAME',
  'SANIK_SAVUNMASI',
  'EK_SAVUNMA',
  'TANIK_DINLEME',
  'DELIL_TARTISMA',
  'MUTALAA',
  'SAVUNMA',
  'SON_SOZ',
  'KARAR',
]);
export type CourtStageType = z.infer<typeof CourtStageType>;

/**
 * Tanığın bir ifadesi. `segments` ifadeyi parçalar; `highlightWhen` koşulu tutan parça vurgulanır (çelişki
 * ancak ilgili çıkarımdan ya da BASTIR'dan sonra görünür). `visibleWhen` yoksa ifade baştan görünür.
 */
export const Statement = z.strictObject({
  id: Id,
  order: z.int(),
  visibleWhen: Cond.optional(),
  segments: z
    .array(z.strictObject({ text: z.string(), highlightWhen: Cond.optional() }))
    .min(1, 'segments en az bir parça içermeli'),
});
export type Statement = z.infer<typeof Statement>;

/** Bir celse: aşamalar sırayla gelir, her aşama bir giriş node'una bağlanır. */
export const CourtSessionDef = z.strictObject({
  id: Id,
  title: z.string(),
  stages: z.array(z.strictObject({ id: Id, type: CourtStageType, entryNode: Id })),
});
export type CourtSessionDef = z.infer<typeof CourtSessionDef>;
