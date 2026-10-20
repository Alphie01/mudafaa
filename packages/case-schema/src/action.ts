import { z } from 'zod';
import { Id } from './primitives.js';

/**
 * Oyuncunun sunucuya gönderdiği aksiyon; `kind` ile ayrışır ve varyantları `ActionKind` sırasını izler.
 * - CHOOSE `{choiceId, variant?}`: görünür bir seçenek; varyantlı TOPIC'te `variant` gerekir.
 * - TAP `{x, y}`: sahnenin kendi biriminde tamsayı nokta. Sahne sınırlarını motor denetler (`INVALID_PARAMS`).
 * - EXAMINE `{tool, target}`, COMBINE `{a, b}`, PRESS `{statementId}`.
 * - PRESENT `{evidenceId, statementId?}`, OBJECT `{groundId, statementId?}`: ifade TESTIMONY'de gerekir.
 * Kimlikler içerik kimliği kalıbına uyar; kalıba uymayan bir kimlik hiçbir içerikle eşleşemeyeceği için sınırda reddedilir.
 */
export const Action = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('CHOOSE'), choiceId: Id, variant: Id.optional() }),
  z.strictObject({ kind: z.literal('TAP'), x: z.int(), y: z.int() }),
  z.strictObject({ kind: z.literal('EXAMINE'), tool: Id, target: Id }),
  z.strictObject({ kind: z.literal('COMBINE'), a: Id, b: Id }),
  z.strictObject({ kind: z.literal('PRESS'), statementId: Id }),
  z.strictObject({ kind: z.literal('PRESENT'), evidenceId: Id, statementId: Id.optional() }),
  z.strictObject({ kind: z.literal('OBJECT'), groundId: Id, statementId: Id.optional() }),
]);
export type Action = z.infer<typeof Action>;
