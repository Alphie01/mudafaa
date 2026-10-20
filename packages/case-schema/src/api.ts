import { z } from 'zod';
import { Action } from './action.js';
import { CharacterRole } from './character.js';
import { OutcomeClass, ResultTone } from './outcome.js';
import { Hex, Id, Rect, Tone } from './primitives.js';
import { SpriteDef } from './sprite.js';
import { ActionResult, ClueCard, EvidenceCard, SessionView } from './view.js';

// REST API'nin istemciye dönen DTO'ları (docs/plan.md §8). Oyun ekranının görünümü (SessionView) ve rapor
// (CaseReport) view.ts'tedir; burada katalog, kullanıcı, oturum özeti, aksiyon isteği ve hata zarfı vardır.

/** Hata zarfı: `error` makine kodu, `reason` motorun ret kodu (action_rejected), `errors` alan hataları. */
export const ErrorEnvelope = z.strictObject({
  message: z.string(),
  error: z.string(),
  requestId: z.string(),
  errors: z.array(z.strictObject({ path: z.string(), message: z.string() })).optional(),
  reason: z.string().optional(),
});
export type ErrorEnvelope = z.infer<typeof ErrorEnvelope>;

export const RankDto = z.strictObject({ key: Id, label: z.string(), shortLabel: z.string(), minXp: z.int().min(0) });
export type RankDto = z.infer<typeof RankDto>;

const OutcomeCounts = z.strictObject({
  ACQUITTAL: z.int().min(0),
  REDUCED: z.int().min(0),
  CONVICTION: z.int().min(0),
  RECHARACTERIZED: z.int().min(0),
  OTHER: z.int().min(0),
});

const isoDate = z.iso.datetime();

/** Oturum özeti (liste ve başlık bilgisi). */
export const SessionSummary = z.strictObject({
  id: z.uuid(),
  caseId: z.uuid(),
  caseNumber: z.int().min(0),
  caseTitle: z.string(),
  mode: z.enum(['NORMAL', 'TEST']),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ABANDONED']),
  stateVersion: z.int().min(0),
  progressLabel: z.string().optional(),
  outcomeKey: Id.optional(),
  finalScore: z.int().optional(),
  xpEarned: z.int().min(0).optional(),
  startedAt: isoDate,
  completedAt: isoDate.optional(),
});
export type SessionSummary = z.infer<typeof SessionSummary>;

// ─── Satın alma (docs/iap.md) ───
/** Mağaza ürün kimlikleri (Play Console ve App Store Connect'te aynı). */
export const PRODUCT_CASE_UNLOCK = 'dava_kilidi';
export const PRODUCT_PREMIUM = 'premium_aylik';
export const ProductId = z.enum([PRODUCT_CASE_UNLOCK, PRODUCT_PREMIUM]);
export type ProductId = z.infer<typeof ProductId>;
export const StorePlatform = z.enum(['ANDROID', 'IOS']);
export type StorePlatform = z.infer<typeof StorePlatform>;
/** Davaya erişim: ücretsiz (#01–#02), sahip olunan (satın alma / premium seçimi) ya da ücretli ve kilitli. */
export const CaseAccess = z.enum(['FREE', 'OWNED', 'PAID_LOCKED']);
export type CaseAccess = z.infer<typeof CaseAccess>;

/** Premium durumu: `picksLeft` bu fatura dönemindeki kalan dava seçme hakkıdır (abonelik yoksa 0). */
export const PremiumStatus = z.strictObject({
  active: z.boolean(),
  expiresAt: isoDate.nullable(),
  picksLeft: z.int().min(0),
});
export type PremiumStatus = z.infer<typeof PremiumStatus>;

/** `POST /purchases`: Android'de `token` = purchaseToken, iOS'ta transactionId; `dava_kilidi` için `caseId` zorunlu. */
export const PurchaseRequest = z
  .strictObject({
    platform: StorePlatform,
    productId: ProductId,
    token: z.string().min(1).max(4096),
    caseId: z.uuid().optional(),
  })
  .refine((r) => r.productId !== PRODUCT_CASE_UNLOCK || r.caseId !== undefined, {
    path: ['caseId'],
    message: 'dava_kilidi için caseId gerekir',
  });
export type PurchaseRequest = z.infer<typeof PurchaseRequest>;

export const PurchaseResponse = z.strictObject({
  purchaseId: z.uuid(),
  productId: ProductId,
  status: z.enum(['VERIFIED', 'REVOKED']),
  caseId: z.uuid().optional(),
  access: CaseAccess.optional(),
  premium: PremiumStatus,
  adFree: z.boolean(),
});
export type PurchaseResponse = z.infer<typeof PurchaseResponse>;

export const PremiumPickRequest = z.strictObject({ caseId: z.uuid() });
export type PremiumPickRequest = z.infer<typeof PremiumPickRequest>;

export const PremiumPickResponse = z.strictObject({ caseId: z.uuid(), access: CaseAccess, premium: PremiumStatus });
export type PremiumPickResponse = z.infer<typeof PremiumPickResponse>;

export const MeResponse = z.strictObject({
  user: z.strictObject({
    id: z.uuid(),
    displayName: z.string(),
    email: z.string().nullable(),
    isAnonymous: z.boolean(),
    provider: z.string(),
    role: z.enum(['PLAYER', 'EDITOR', 'ADMIN']),
  }),
  profile: z.strictObject({
    lawyerName: z.string().optional(),
    office: z.string().optional(),
    city: z.string().optional(),
    settings: z.record(z.string(), z.unknown()),
  }),
  stats: z.strictObject({
    xp: z.int().min(0),
    rank: RankDto,
    nextRank: RankDto.optional(),
    progressPct: z.int().min(0).max(100),
    closedCases: z.int().min(0),
    outcomeCounts: OutcomeCounts,
  }),
  activeSession: SessionSummary.optional(),
  newCases: z.int().min(0),
  premium: PremiumStatus,
  adFree: z.boolean(),
});
export type MeResponse = z.infer<typeof MeResponse>;

export const ProfilePatch = z.strictObject({
  displayName: z.string().trim().min(1).max(40).optional(),
  lawyerName: z.string().trim().max(60).optional(),
  office: z.string().trim().max(60).optional(),
  city: z.string().trim().max(40).optional(),
  settings: z.record(z.string(), z.unknown()).optional(),
});
export type ProfilePatch = z.infer<typeof ProfilePatch>;

/** Dava kartı (Dava Dosyaları ekranı). */
export const CaseCard = z.strictObject({
  id: z.uuid(),
  slug: z.string(),
  number: z.int().min(0),
  title: z.string(),
  crimeLabel: z.string(),
  lawRef: z.string(),
  possibleSentence: z.string(),
  difficulty: z.int().min(1).max(5),
  category: z.strictObject({ key: Id, label: z.string() }),
  estimatedMinutes: z.int().positive(),
  summary: z.string(),
  cover: z.strictObject({ name: z.string(), accent: Hex, sprite: SpriteDef.omit({ id: true }) }),
  status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED', 'LOCKED']),
  // Ücret kilidi rütbe kilidinden (status LOCKED) bağımsızdır.
  access: CaseAccess,
  lockReason: z.string().optional(),
  requiredRank: RankDto.optional(),
  activeSessionId: z.uuid().optional(),
  best: z
    .strictObject({
      outcomeKey: Id,
      outcomeClass: OutcomeClass,
      stamp: z.string(),
      stampTone: ResultTone,
      final: z.int(),
    })
    .optional(),
  legalReviewPending: z.boolean(),
});
export type CaseCard = z.infer<typeof CaseCard>;

export const CaseDetail = CaseCard.extend({ demandText: z.string(), completedCount: z.int().min(0) });
export type CaseDetail = z.infer<typeof CaseDetail>;

export const CaseListResponse = z.strictObject({
  items: z.array(CaseCard),
  counts: z.strictObject({ active: z.int().min(0), closed: z.int().min(0), locked: z.int().min(0) }),
});
export type CaseListResponse = z.infer<typeof CaseListResponse>;

export const StartResponse = z.strictObject({ session: SessionSummary, view: SessionView });
export type StartResponse = z.infer<typeof StartResponse>;

/** Aksiyon isteği: `clientActionId` idempotency anahtarı, `expectedStateVersion` iyimser eşzamanlılık sürümü. */
export const ActionRequest = z.strictObject({
  clientActionId: z.uuid(),
  expectedStateVersion: z.int().min(0),
  action: Action,
});
export type ActionRequest = z.infer<typeof ActionRequest>;

export const ChooseResponse = z.strictObject({ result: ActionResult, view: SessionView });
export type ChooseResponse = z.infer<typeof ChooseResponse>;

export const ProgressResponse = z.strictObject({
  xp: z.int().min(0),
  rank: RankDto,
  nextRank: RankDto.optional(),
  progressPct: z.int().min(0).max(100),
  outcomeCounts: OutcomeCounts,
  cases: z.array(
    z.strictObject({
      caseId: z.uuid(),
      status: z.enum(['NEW', 'IN_PROGRESS', 'COMPLETED']),
      bestOutcomeKey: Id.optional(),
      bestOutcomeClass: OutcomeClass.optional(),
      bestFinal: z.int().optional(),
      xpCredited: z.int().min(0),
    }),
  ),
});
export type ProgressResponse = z.infer<typeof ProgressResponse>;

export const EvidenceListResponse = z.strictObject({ bag: z.array(EvidenceCard), notebook: z.array(ClueCard) });
export type EvidenceListResponse = z.infer<typeof EvidenceListResponse>;

export const ScenesResponse = z.strictObject({
  scenes: z.array(
    z.strictObject({
      id: Id,
      title: z.string(),
      description: z.string().optional(),
      imageUrl: z.string().min(1),
      width: z.int().positive(),
      height: z.int().positive(),
      found: z.array(z.strictObject({ objectId: Id, rect: Rect, label: z.string(), badge: z.string().optional() })),
    }),
  ),
});
export type ScenesResponse = z.infer<typeof ScenesResponse>;

export const CharactersResponse = z.strictObject({
  characters: z.array(
    z.strictObject({
      id: Id,
      name: z.string(),
      shortLabel: z.string(),
      role: CharacterRole,
      accent: Hex,
      sprite: SpriteDef.omit({ id: true }),
    }),
  ),
});
export type CharactersResponse = z.infer<typeof CharactersResponse>;

export const ScoreResponse = z.strictObject({
  status: z.enum(['ACTIVE', 'COMPLETED', 'ABANDONED']),
  raw: z.int(),
  final: z.int().optional(),
  breakdown: z.array(z.strictObject({ label: z.string(), value: z.int(), tone: Tone })).optional(),
  outcomeKey: Id.optional(),
});
export type ScoreResponse = z.infer<typeof ScoreResponse>;
