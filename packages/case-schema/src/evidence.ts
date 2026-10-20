import { z } from 'zod';
import { Cond } from './expr.js';
import { EvidenceKind, Id } from './primitives.js';

/** Delil kartı ve belge aracı simgeleri. */
export const IconKey = z.enum([
  'key',
  'document',
  'receipt',
  'bulb',
  'camera',
  'phone',
  'fingerprint',
  'boot',
  'cigarette',
  'magnifier',
  'uv',
  'dust',
  'compare',
  'lock',
  'check',
]);
export type IconKey = z.infer<typeof IconKey>;

/** Delilin gücü: `EvidenceDef.strength` ile `strengthList` bloğunun öğeleri bu şemayı paylaşır. */
export const Strength = z.enum(['STRONG', 'MEDIUM', 'WEAK']);
export type Strength = z.infer<typeof Strength>;

/**
 * Delil, ipucu ya da çıkarım (`kind`). Dört bayrak zorunludur: `presentable` duruşmada sunulabilir,
 * `combinable` çıkarım tahtasına girer, `countsInBag` delil çantası sayacına girer, `initiallyKnown` başlangıçta
 * bulunmuştur. `legalValidity` ve `legalNote` hukuki durumu tutar (dışlanabilir, dışlanmış…).
 */
export const EvidenceDef = z.strictObject({
  id: Id,
  kind: EvidenceKind,
  type: z.enum([
    'FIZIKSEL',
    'DIJITAL',
    'TANIK_IFADESI',
    'KAMERA_KAYDI',
    'TELEFON_KAYDI',
    'ADLI_RAPOR',
    'BELGE',
    'FOTOGRAF',
  ]),
  title: z.string(),
  shortText: z.string(),
  description: z.string(),
  sourceLabel: z.string(),
  tagLabel: z.string().optional(),
  icon: IconKey,
  side: z.enum(['DEFENSE', 'PROSECUTION', 'NEUTRAL']).optional(),
  strength: Strength.optional(),
  legalValidity: z.enum(['VALID', 'EXCLUDABLE', 'EXCLUDED', 'UNKNOWN']),
  legalNote: z.string().optional(),
  presentable: z.boolean(),
  combinable: z.boolean(),
  countsInBag: z.boolean(),
  initiallyKnown: z.boolean(),
  relatedCharacters: z.array(Id).optional(),
  relatedEvents: z.array(z.string()).optional(),
  tags: z.array(Id).optional(),
  missedHint: z.string().optional(),
});
export type EvidenceDef = z.infer<typeof EvidenceDef>;

/** İki delil arasındaki ilişki (`from` → `to`). */
export const EvidenceRelation = z.strictObject({
  from: Id,
  to: Id,
  type: z.enum(['SUPPORTS', 'CONTRADICTS', 'DERIVED_FROM', 'REFUTES']),
});
export type EvidenceRelation = z.infer<typeof EvidenceRelation>;

/**
 * Delilin bulunma yolu. Her `DISCOVER` etkisinin bir yolu olur (doğrulayıcı 1:1 eşleşme ister); `source.id`
 * yolu açan nesnenin, seçeneğin, kuralın, tetikleyicinin ya da node'un kimliğidir (`INITIAL` için yoktur).
 */
export const DiscoveryPath = z.strictObject({
  evidence: Id,
  source: z.strictObject({
    type: z.enum(['INITIAL', 'OBJECT', 'CHOICE', 'RULE', 'TRIGGER', 'NODE']),
    id: Id.optional(),
  }),
  requires: Cond.optional(),
  hint: z.string().optional(),
});
export type DiscoveryPath = z.infer<typeof DiscoveryPath>;
