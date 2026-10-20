import { z } from 'zod';
import { Cond, Val } from './expr.js';
import { Id } from './primitives.js';

/** Dava sonucunun sınıfı (beraat, indirim, mahkûmiyet…). */
export const OutcomeClass = z.enum(['ACQUITTAL', 'REDUCED', 'CONVICTION', 'RECHARACTERIZED', 'OTHER']);
export type OutcomeClass = z.infer<typeof OutcomeClass>;

/** Karar damgasının ve eşik çubuğu bantlarının rengi: `OutcomeDef.stampTone` ile `thresholdBar[].tone` paylaşır. */
export const ResultTone = z.enum(['green', 'amber', 'red']);
export type ResultTone = z.infer<typeof ResultTone>;

/**
 * Dava sonucu. Motor, `priority` artan sırayla `when` koşulunu tutan ilk sonucu seçer; listedeki son sonuç
 * varsayılandır (koşulu `{all: []}`). `reasoning` parçalarından `when`'i tutanlar gerekçeyi oluşturur; `xp` bir
 * ifadedir (ör. skorun yüzdesi). `howToReach`, ulaşılamayan sonuç için raporda "nasıl ulaşılır" metni olur.
 */
export const OutcomeDef = z.strictObject({
  id: Id,
  class: OutcomeClass,
  priority: z.int(),
  when: Cond,
  stamp: z.string(),
  stampTone: ResultTone,
  header: z.string().optional(),
  sentence: z.string(),
  verdictText: z.string(),
  reasoning: z
    .array(z.strictObject({ when: Cond.optional(), text: z.string() }))
    .min(1, 'reasoning en az bir gerekçe içermeli'),
  legalBasis: z.string(),
  xp: Val,
  howToReach: z.string(),
  ethicsCard: z.string().optional(),
});
export type OutcomeDef = z.infer<typeof OutcomeDef>;
