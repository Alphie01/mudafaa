import { z } from 'zod';
import { Hex, Id } from './primitives.js';

/** Karakterin hikâyedeki rolü. `COUNSEL` oyuncunun avukat avatarıdır (COURTROOM `stage.counsel` bu karakteri gösterir). */
export const CharacterRole = z.enum([
  'CLIENT',
  'DEFENDANT',
  'VICTIM',
  'WITNESS',
  'COUNSEL',
  'PROSECUTOR',
  'JUDGE',
  'POLICE',
  'EXPERT',
  'CLERK',
  'USHER',
  'GUARD',
  'MENTOR',
  'ASSISTANT',
  'FAMILY',
  'SUSPECT',
  'OTHER',
]);
export type CharacterRole = z.infer<typeof CharacterRole>;

/**
 * Kadro üyesi. `spriteId` bir `SpriteDef`'e işaret eder; `accent` karakterin vurgu rengidir. `notes` yazar
 * notudur: oyuncuya gönderilmez.
 */
export const CharacterDef = z.strictObject({
  id: Id,
  name: z.string(),
  shortLabel: z.string(),
  role: CharacterRole,
  age: z.int().min(0).optional(),
  occupation: z.string().optional(),
  bio: z.string().optional(),
  accent: Hex,
  spriteId: Id,
  notes: z.string().optional(),
  initiallyKnown: z.boolean().optional(),
});
export type CharacterDef = z.infer<typeof CharacterDef>;
