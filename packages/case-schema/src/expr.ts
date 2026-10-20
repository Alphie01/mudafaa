import { z } from 'zod';
import { Category, Id } from './primitives.js';

// Val ve Cond birbirini çağırır (`if` bir Cond taşır, `cmp` iki Val). Zod bu döngüden tip çıkaramaz; bu yüzden
// tipler elle yazılır ve şemalar bunlarla işaretlenir (`z.ZodType<Val>`). Şema tipin dışına çıkarsa derleme
// hata verir; tipte olup şemada olmayan bir biçimi test tabloları (test/expr.test.ts) yakalar.

/** `{count:'evidence'}` süzgeci: EvidenceDef.kind ile aynı değerler. */
const EvidenceKind = z.enum(['EVIDENCE', 'CLUE', 'INSIGHT']);

const CmpOp = z.enum(['==', '!=', '<', '<=', '>', '>=']);

/** Değer ifadesi: motor (`evalVal`) bunu sayıya, metne ya da bool'a indirger. */
export type Val =
  | number
  | string
  | boolean
  | { var: Id }
  /** `raw` kategori toplamı; `final` yalnızca sonuç hesaplanırken (sonuç koşulu, xp) kullanılabilir. */
  | { score: 'raw' | 'final' | `cat:${Category}` }
  /** Bulunmuş delil sayısı; `kind` ve `tag` süzer. */
  | { count: 'evidence'; kind?: 'EVIDENCE' | 'CLUE' | 'INSIGHT'; tag?: Id }
  /** Seçeneğin kaç kez seçildiği. */
  | { uses: Id }
  /** Node'a kaç kez girildiği. */
  | { visits: Id }
  | { add: Val[] }
  | { sub: [Val, Val] }
  | { mul: Val[] }
  | { div: [Val, Val] }
  | { min: Val[] }
  | { max: Val[] }
  | { round: Val }
  | { if: { when: Cond; then: Val; else: Val } };

/** Koşul ifadesi. `{all:[]}` her zaman doğrudur (varsayılan sonucun koşulu). */
export type Cond =
  | { all: Cond[] }
  | { any: Cond[] }
  | { not: Cond }
  | { cmp: [Val, '==' | '!=' | '<' | '<=' | '>' | '>=', Val] }
  /** Delil bulunmuş. */
  | { hasEvidence: Id }
  /** Karakterle tanışılmış (MEET). */
  | { met: Id }
  /** Node ziyaret edilmiş. */
  | { visited: Id }
  /** Oyuncu şu an bu node'da. */
  | { atNode: Id }
  /** Seçenek seçilmiş; `variant` verilirse o varyantla. */
  | { chosen: Id; variant?: Id }
  /** Sahne nesnesi bulunmuş. */
  | { found: Id }
  /** Bool değişken `true`. */
  | { flag: Id }
  /** Adlandırılmış yüklem (`predicates`); derleme sırasında çözülür. */
  | { ref: Id };

export const Val: z.ZodType<Val> = z.lazy(() =>
  z.union([
    z.number(),
    z.string(),
    z.boolean(),
    z.strictObject({ var: Id }),
    z.strictObject({ score: z.union([z.literal('raw'), z.literal('final'), z.templateLiteral(['cat:', Category])]) }),
    z.strictObject({ count: z.literal('evidence'), kind: EvidenceKind.optional(), tag: Id.optional() }),
    z.strictObject({ uses: Id }),
    z.strictObject({ visits: Id }),
    z.strictObject({ add: z.array(Val) }),
    z.strictObject({ sub: z.tuple([Val, Val]) }),
    z.strictObject({ mul: z.array(Val) }),
    z.strictObject({ div: z.tuple([Val, Val]) }),
    // Boş listenin en küçüğü/en büyüğü tanımsızdır (motor ±Infinity üretirdi); şema boş listeyi reddeder.
    z.strictObject({ min: z.array(Val).min(1) }),
    z.strictObject({ max: z.array(Val).min(1) }),
    z.strictObject({ round: Val }),
    z.strictObject({ if: z.strictObject({ when: Cond, then: Val, else: Val }) }),
  ]),
);

export const Cond: z.ZodType<Cond> = z.lazy(() =>
  z.union([
    z.strictObject({ all: z.array(Cond) }),
    z.strictObject({ any: z.array(Cond) }),
    z.strictObject({ not: Cond }),
    z.strictObject({ cmp: z.tuple([Val, CmpOp, Val]) }),
    z.strictObject({ hasEvidence: Id }),
    z.strictObject({ met: Id }),
    z.strictObject({ visited: Id }),
    z.strictObject({ atNode: Id }),
    z.strictObject({ chosen: Id, variant: Id.optional() }),
    z.strictObject({ found: Id }),
    z.strictObject({ flag: Id }),
    z.strictObject({ ref: Id }),
  ]),
);
