import { z } from 'zod';
import { CharacterRole } from './character.js';
import { ChoiceKind, ChoiceTag, Cost, Feedback, Line } from './choice.js';
import { IconKey } from './evidence.js';
import { Block, CourtroomMode, DialogueMode, InvestigationTabKind, StoryPhase, ToolVisualMode } from './node.js';
import { OutcomeClass, ResultTone } from './outcome.js';
import { ObjectionGround } from './package.js';
import { Category, Expression, Hex, Id, Rect, Tone } from './primitives.js';
import { SpriteDef } from './sprite.js';
import { VariableWidget } from './variable.js';

// API ↔ istemci sözleşmesi (docs/plan.md §6): `GET /v1/sessions/:id` → SessionView; aksiyon → {result: ActionResult,
// view: SessionView}; rapor → CaseReport. UI = f(view): metinler motorda çözülmüş, gösterilecek hâldedir. Bütün nesneler
// `z.strictObject`'tir: içerikten bir alan (koşul, etki, `next`, kural, yazar notu…) görünüme sızarsa parse reddeder.
// Sayaçlar (`hiddenTotal`, `hiddenRemaining`, `recipesTotal`, `bag.total`) yalnızca node `exposeCounts` ise gelir.

/** Delil çantasındaki kart (EVIDENCE ve INSIGHT). */
export const EvidenceCard = z.strictObject({
  id: Id,
  title: z.string(),
  shortText: z.string(),
  description: z.string(),
  kindLabel: z.string(),
  sourceLabel: z.string(),
  icon: IconKey,
  legalNote: z.string().optional(),
});
export type EvidenceCard = z.infer<typeof EvidenceCard>;

/** Not defterindeki ipucu kartı (CLUE). */
export const ClueCard = z.strictObject({ id: Id, title: z.string(), sourceLabel: z.string(), icon: IconKey });
export type ClueCard = z.infer<typeof ClueCard>;

/**
 * HUD göstergesi: node'un `hud` listesindeki görünür bir değişken. `value` değişkenin değeridir (int, bool ya da enum
 * değeri), `max` göstergenin üst sınırı; `low`, değerin uyarı eşiğine (`display.lowAt`) indiğini sunucunun söylediği
 * bayraktır.
 */
export const HudItem = z.strictObject({
  id: Id,
  label: z.string(),
  widget: VariableWidget,
  value: z.union([z.int(), z.boolean(), z.string()]),
  max: z.int().optional(),
  low: z.boolean().optional(),
});
export type HudItem = z.infer<typeof HudItem>;

/**
 * Görünür seçenek. Yalnızca oyuncunun seçebildiği türler gelir; kurallar (EXAMINE…OBJECT) ve FALLBACK hiç gönderilmez.
 * `available` = etkin ∧ maliyeti karşılanabilir ∧ kullanılabilir; `used` en az bir kez seçildiğini söyler. `cost[].label`
 * gösterilecek metindir (ör. "1 EP"); `confirm` seçimden önce sorulacak onay metnidir (ör. DURUŞMAYA GİT).
 */
export const ChoiceView = z.strictObject({
  id: Id,
  kind: ChoiceKind.extract(['OPTION', 'TOPIC', 'NAVIGATE', 'CONTINUE']),
  group: Id.optional(),
  label: z.string(),
  description: z.string().optional(),
  tags: z.array(ChoiceTag).optional(),
  variants: z.array(z.strictObject({ id: Id, label: z.string() })).optional(),
  cost: z.array(Cost.extend({ label: z.string() })).optional(),
  available: z.boolean(),
  lockedReason: z.string().optional(),
  used: z.boolean(),
  confirm: z.string().optional(),
});
export type ChoiceView = z.infer<typeof ChoiceView>;

/**
 * Bir aksiyonun sonucu. `fx` yalnızca animasyon tetikler (kaçırılan bir efekt durumu bozmaz); `discovered` bu aksiyonda
 * bulunan delillerin kimlikleridir; `hit` sahnede isabet edilen nesnenin sınır dikdörtgenidir.
 */
export const ActionResult = z.strictObject({
  resolution: z.enum(['CHOICE', 'RULE', 'FALLBACK', 'NOOP', 'HIT', 'MISS']),
  feedback: Feedback.optional(),
  lines: z.array(Line),
  fx: z.array(
    z.strictObject({
      kind: z.enum(['VAR', 'SCORE', 'EVIDENCE', 'CHARACTER', 'SHOUT', 'VERDICT']),
      label: z.string(),
      delta: z.int().optional(),
      id: Id.optional(),
    }),
  ),
  discovered: z.array(Id),
  hit: z.strictObject({ objectId: Id, rect: Rect, text: z.string() }).optional(),
  nodeChanged: z.boolean(),
  completed: z.boolean(),
});
export type ActionResult = z.infer<typeof ActionResult>;

/** Karar dökümünün bir satırı: skor satırı ya da bonus. Satırların toplamı her zaman `final`'dir. */
const BreakdownRow = z.strictObject({ label: z.string(), value: z.int(), tone: Tone });

/** Sahne görseli: `width` × `height` sahne birimidir (TAP koordinatları bu birimde gönderilir). */
const sceneImage = { imageUrl: z.string().min(1), width: z.int().positive(), height: z.int().positive() };

/**
 * Ekranın node'a özgü yükü; `type` ile ayrışır ve her türde `id` node kimliğidir. DECISION anında yönlendirdiği için
 * görünümü yoktur; istemcinin tanımadığı tür için gösterdiği UNSUPPORTED ekranı istemcinin işidir.
 * - INVESTIGATION `scenePreview.markers`: yalnızca görünür ya da bulunmuş nesneler; `state` incelendi mi.
 * - DIALOGUE `room.expression` ve `mood` ruh hâli kurallarından çözülür; `objectives[].text` bilinen/bilinmeyen metindir.
 * - SCENE `found`: yalnızca bulunan nesneler (geometri sınır dikdörtgenine indirgenir).
 * - DOCUMENT `solved`: uygulanmış inceleme kurallarının alet × satır çiftleri.
 * - DEDUCTION `cards`: bulunmuş havuz kartları; `solved`: çözülmüş tariflerin başlığı ve isabet etiketi.
 * - COURTROOM `statements`: yalnızca görünür ifadeler, vurgu sunucuda hesaplanır; `presentable` sunulabilecek kartlar;
 *   `witnessLabel` tanık kürsüsünün etiketi.
 * - RESULT `reasoning`: koşulu tutan gerekçe parçaları; `xp.rankLabel` / `progressPct` kariyer verisidir (API ekler).
 */
export const NodeView = z.discriminatedUnion('type', [
  z.strictObject({ type: z.literal('STORY'), id: Id, phase: StoryPhase.optional(), blocks: z.array(Block) }),
  z.strictObject({
    type: z.literal('INVESTIGATION'),
    id: Id,
    tabs: z.array(z.strictObject({ id: Id, label: z.string(), kind: InvestigationTabKind, choiceIds: z.array(Id) })),
    scenePreview: z
      .strictObject({
        ...sceneImage,
        markers: z.array(
          z.strictObject({ id: Id, label: z.string(), rect: Rect, state: z.enum(['UNEXAMINED', 'EXAMINED']) }),
        ),
      })
      .optional(),
    quickTalk: z.strictObject({ characterKey: Id, line: z.string(), choiceIds: z.array(Id) }).optional(),
  }),
  z.strictObject({
    type: z.literal('DIALOGUE'),
    id: Id,
    mode: DialogueMode,
    room: z.strictObject({ label: z.string(), characterKey: Id, expression: Expression }),
    mood: z.strictObject({ label: z.string(), tone: Tone }).optional(),
    objectives: z.array(z.strictObject({ text: z.string(), known: z.boolean() })),
    tones: z.array(z.strictObject({ id: Id, label: z.string(), hint: z.string().optional() })),
    allowPresent: z.boolean(),
  }),
  z.strictObject({ type: z.literal('CHOICE'), id: Id, prompt: Line.optional() }),
  z.strictObject({ type: z.literal('EVIDENCE'), id: Id, prompt: Line.optional(), evidence: EvidenceCard }),
  z.strictObject({
    type: z.literal('SCENE'),
    id: Id,
    ...sceneImage,
    instruction: z.string(),
    found: z.array(z.strictObject({ objectId: Id, rect: Rect, label: z.string(), badge: z.string().optional() })),
    hiddenTotal: z.int().min(0).optional(),
  }),
  z.strictObject({
    type: z.literal('DOCUMENT'),
    id: Id,
    title: z.string(),
    header: z.strictObject({ left: z.string(), right: z.string() }),
    columns: z.array(z.strictObject({ label: z.string(), flex: z.number().positive() })),
    rows: z.array(
      z.strictObject({
        id: Id,
        cells: z.array(z.string()),
        lens: z.record(Id, z.strictObject({ cells: z.array(z.string()), tone: Tone })).optional(),
      }),
    ),
    tools: z.array(z.strictObject({ id: Id, label: z.string(), icon: IconKey, visualMode: ToolVisualMode.optional() })),
    solved: z.array(z.strictObject({ tool: Id, target: Id })),
    hiddenRemaining: z.int().min(0).optional(),
  }),
  z.strictObject({
    type: z.literal('DEDUCTION'),
    id: Id,
    cards: z.array(z.strictObject({ id: Id, source: z.string(), text: z.string() })),
    solved: z.array(z.strictObject({ title: z.string(), hits: z.string() })),
    recipesTotal: z.int().min(0).optional(),
  }),
  z.strictObject({
    type: z.literal('COURTROOM'),
    id: Id,
    mode: CourtroomMode,
    stage: z.strictObject({
      banner: z.string(),
      bench: z.array(
        z.strictObject({
          characterKey: Id,
          label: z.string(),
          xFrac: z.number().min(0, 'xFrac 0..1 aralığında olmalı').max(1, 'xFrac 0..1 aralığında olmalı'),
        }),
      ),
      witness: Id.optional(),
      counsel: Id,
    }),
    statements: z
      .array(
        z.strictObject({
          id: Id,
          segments: z.array(z.strictObject({ text: z.string(), highlight: z.boolean() })),
          pressed: z.boolean(),
        }),
      )
      .optional(),
    presentable: z.array(EvidenceCard).optional(),
    objectionGrounds: z.array(ObjectionGround).optional(),
    prosecutionEvidence: EvidenceCard.optional(),
    rulesText: z.string().optional(),
    witnessLabel: z.string().optional(),
  }),
  z.strictObject({
    type: z.literal('RESULT'),
    id: Id,
    outcome: z.strictObject({ id: Id, class: OutcomeClass, stamp: z.string(), tone: ResultTone }),
    strategyLabel: z.string().optional(),
    sentence: z.strictObject({ demand: z.string(), result: z.string() }),
    verdictText: z.string(),
    reasoning: z.array(z.string()),
    breakdown: z.array(BreakdownRow),
    total: z.int(),
    thresholds: z.strictObject({
      scaleMax: z.int().positive(),
      bands: z.array(z.strictObject({ label: z.string(), from: z.int(), tone: ResultTone })),
    }),
    xp: z.strictObject({
      gained: z.int().min(0),
      rankLabel: z.string().optional(),
      progressPct: z
        .number()
        .min(0, 'progressPct 0..100 aralığında olmalı')
        .max(100, 'progressPct 0..100 aralığında olmalı')
        .optional(),
    }),
  }),
]);
export type NodeView = z.infer<typeof NodeView>;

/** Kadrodaki bir karakterin istemciye giden hâli: sprite satırları ve o anki yüz ifadesiyle (yazar notu gitmez). */
const CastMember = z.strictObject({
  name: z.string(),
  shortLabel: z.string(),
  role: CharacterRole,
  accent: Hex,
  sprite: SpriteDef.omit({ id: true }),
  expression: Expression.optional(),
});

/**
 * Oturumun tam görünümü. `session.id` / `caseId` API'nin opak kimlikleridir; `stateVersion` iyimser eşzamanlılık
 * sürümüdür. `cast` karakter kimliğiyle anahtarlıdır (`lines[].speaker` ve node'daki `characterKey`'ler buraya bakar);
 * `header.back` ve `primary` sunucunun seçeneklerini gösterir. `bag` ve `notebook` yalnızca bulunanları taşır.
 */
export const SessionView = z.strictObject({
  session: z.strictObject({
    id: z.string().min(1),
    caseId: z.string().min(1),
    caseNumber: z.int().min(0),
    caseTitle: z.string(),
    stateVersion: z.int().min(0),
    status: z.enum(['ACTIVE', 'COMPLETED', 'ABANDONED']),
    mode: z.enum(['NORMAL', 'TEST']),
    progressLabel: z.string().optional(),
  }),
  header: z.strictObject({
    eyebrow: z.string().optional(),
    title: z.string().optional(),
    back: z.strictObject({ a11yLabel: z.string(), choiceId: Id }).optional(),
  }),
  hud: z.array(HudItem),
  cast: z.record(Id, CastMember),
  lines: z.array(Line),
  choices: z.array(ChoiceView),
  primary: z
    .strictObject({
      choiceId: Id,
      label: z.string(),
      tone: z.enum(['gold', 'red', 'blue', 'objection', 'secondary']),
    })
    .optional(),
  bag: z.strictObject({ items: z.array(EvidenceCard), total: z.int().min(0).optional() }),
  notebook: z.strictObject({ items: z.array(ClueCard), total: z.int().min(0).optional() }),
  last: ActionResult.optional(),
  node: NodeView,
});
export type SessionView = z.infer<typeof SessionView>;

/** Rapordaki iyi / kötü hamle: işaretin kaynağı (seçenek, kural, nesne… kimliği) ve hazır geri bildirimi. */
const ReportMark = z.strictObject({ source: Id, feedback: z.string(), category: Category.optional() });

/**
 * Dava sonu raporu (tamamen kural tabanlı). `final = raw + Σ bonus` ve `breakdown` satırları `final`'e toplanır;
 * `missed` kaçırılan ipuçları, `alternatives` ulaşılmayan sonuçlar, `skills` kategori başına kazanılan / en yüksek skor
 * ve tavsiyedir (`earned` literal tutarlardan hesaplanan `max`'ı aşabilir).
 */
export const CaseReport = z.strictObject({
  outcome: z.strictObject({
    id: Id,
    class: OutcomeClass,
    stamp: z.string(),
    stampTone: ResultTone,
    header: z.string().optional(),
    sentence: z.string(),
    verdictText: z.string(),
    reasoning: z.array(z.string()),
    legalBasis: z.string(),
    ethicsCard: z.string().optional(),
  }),
  raw: z.int(),
  final: z.int(),
  breakdown: z.array(BreakdownRow),
  good: z.array(ReportMark),
  bad: z.array(ReportMark),
  missed: z.array(z.strictObject({ text: z.string(), category: Category.optional() })),
  alternatives: z.array(z.strictObject({ outcomeId: Id, howToReach: z.string() })),
  skills: z.array(
    z.strictObject({
      category: Category,
      label: z.string(),
      earned: z.int().min(0),
      max: z.int().min(0),
      level: z.enum(['weak', 'medium', 'strong']),
      advice: z.string(),
    }),
  ),
  xp: z.int().min(0),
});
export type CaseReport = z.infer<typeof CaseReport>;
