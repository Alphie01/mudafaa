import { z } from 'zod';
import { Action } from './action.js';
import { CharacterDef } from './character.js';
import { CourtSessionDef } from './court.js';
import { DiscoveryPath, EvidenceDef, EvidenceRelation } from './evidence.js';
import { Cond } from './expr.js';
import { NodeDef } from './node.js';
import { OutcomeDef } from './outcome.js';
import { Id } from './primitives.js';
import { ReportHint } from './report.js';
import { SceneDef } from './scene.js';
import { ScoringConfig } from './scoring.js';
import { SpriteDef } from './sprite.js';
import { TriggerDef } from './trigger.js';
import { VariableDef } from './variable.js';

/** İçerik formatının kimliği: her CasePackage'ın `format` alanı bu değeri taşır. */
export const CASE_FORMAT = 'mudafaa.case/v1' as const;

/** İtiraz gerekçesi: COURTROOM node'larının `objectionGrounds` listesi bu kimliklere bakar. */
export const ObjectionGround = z.strictObject({ id: Id, label: z.string(), legalBasis: z.string().optional() });
export type ObjectionGround = z.infer<typeof ObjectionGround>;

/** Dava dizinine göre göreli varlık yolu: `/` ile ayrılmış parçalar; mutlak yol, `.` ile başlayan parça ve `\` yok. */
const AssetPath = z
  .string()
  .regex(
    /^[A-Za-z0-9_@-][A-Za-z0-9._@-]*(?:\/[A-Za-z0-9_@-][A-Za-z0-9._@-]*)*$/,
    'Geçersiz varlık yolu: dava dizinine göre göreli olmalı; parçalar harf/rakam/._@- içerir ve . ile başlayamaz',
  );

/** Golden path: aksiyonlar baştan oynatılır; sonuç `expect.outcome` olmalı, final skor varsa pencerenin içinde kalmalı. */
const GoldenPath = z.strictObject({
  name: Id,
  actions: z.array(Action),
  expect: z
    .strictObject({ outcome: Id, finalMin: z.int().optional(), finalMax: z.int().optional() })
    .superRefine(({ finalMin, finalMax }, ctx) => {
      if (finalMin !== undefined && finalMax !== undefined && finalMin > finalMax) {
        ctx.addIssue({
          code: 'custom',
          path: ['finalMax'],
          message: `finalMax (${finalMax}) finalMin (${finalMin}) değerinden küçük olamaz`,
        });
      }
    }),
});

/**
 * Bir davanın tüm içeriği (seed, içe/dışa aktarım, AI çıktısı ve doğrulayıcı girdisi aynı biçimi kullanır). Şema
 * yalnızca biçimi denetler: kimliklerin tekilliği ve referansların çözülmesi (DUPLICATE_ID, DANGLING_REF) motorun
 * `compile` adımının işidir. İçerik `NN-*.json` parçaları hâlinde yazılır ve `mergeCaseParts` ile birleştirilir.
 * - `meta.legalReview`: yayın için hukuki inceleme; `at` takvim tarihidir (YYYY-AA-GG).
 * - `config.display.showRunningScore`: oyun sırasında anlık skor gösterilsin mi.
 * - `predicates`: koşullarda `{ref}` ile çağrılan adlandırılmış koşullar.
 * - `relationships[].type`: serbest ilişki etiketi (ör. KOMSU); motor yorumlamaz.
 * - `assets`: sahne görselleri ve dosyalar; `sha256` küçük harfli onaltılık özet.
 * - `tests.goldenPaths`: doğrulayıcının yeniden oynattığı aksiyon dizileri.
 */
export const CasePackage = z.strictObject({
  format: z.literal(CASE_FORMAT),
  meta: z.strictObject({
    slug: z.string().regex(/^[a-z0-9-]+$/, 'Geçersiz slug: yalnızca küçük harf, rakam ve - içermeli'),
    number: z.int().min(0),
    title: z.string(),
    crimeLabel: z.string(),
    lawRef: z.string(),
    demandText: z.string(),
    possibleSentence: z.string(),
    difficulty: z.int().min(1, 'difficulty 1..5 aralığında olmalı').max(5, 'difficulty 1..5 aralığında olmalı'),
    category: z.literal('CEZA'),
    estimatedMinutes: z.int().positive(),
    requiredRank: Id.optional(),
    summary: z.string(),
    coverCharacter: Id,
    legalReview: z.strictObject({
      status: z.enum(['PENDING', 'APPROVED']),
      by: z.string().optional(),
      at: z.iso.date('legalReview.at YYYY-AA-GG biçiminde bir tarih olmalı').optional(),
    }),
  }),
  config: z.strictObject({
    startNode: Id,
    scoring: ScoringConfig,
    objectionGrounds: z.array(ObjectionGround),
    display: z.strictObject({ showRunningScore: z.boolean() }),
    chronology: z.array(z.strictObject({ id: Id, time: z.string(), text: z.string() })).optional(),
  }),
  predicates: z.array(z.strictObject({ id: Id, label: z.string(), when: Cond })),
  variables: z.array(VariableDef),
  sprites: z.array(SpriteDef),
  characters: z.array(CharacterDef),
  relationships: z.array(
    z.strictObject({
      from: Id,
      to: Id,
      type: z.string(),
      description: z.string(),
      hidden: z.boolean().optional(),
      revealWhen: Cond.optional(),
    }),
  ),
  evidence: z.array(EvidenceDef),
  evidenceRelations: z.array(EvidenceRelation),
  discoveryPaths: z.array(DiscoveryPath),
  scenes: z.array(SceneDef),
  court: z.strictObject({ sessions: z.array(CourtSessionDef) }),
  nodes: z.array(NodeDef),
  triggers: z.array(TriggerDef),
  outcomes: z.array(OutcomeDef),
  report: z.strictObject({ hints: z.array(ReportHint) }),
  assets: z.array(
    z.strictObject({
      id: Id,
      kind: z.enum(['IMAGE', 'FILE']),
      path: AssetPath,
      sha256: z
        .string()
        .regex(/^[0-9a-f]{64}$/, 'sha256 64 küçük harfli onaltılık karakter olmalı')
        .optional(),
    }),
  ),
  tests: z.strictObject({ goldenPaths: z.array(GoldenPath) }).optional(),
});
export type CasePackage = z.infer<typeof CasePackage>;
