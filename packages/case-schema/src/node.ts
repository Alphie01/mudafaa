import { z } from 'zod';
import { ChoiceDef, Cost, Line, ResponseBlock, Route } from './choice.js';
import { CourtStageType, Statement } from './court.js';
import { Effect } from './effect.js';
import { IconKey, Strength } from './evidence.js';
import { Cond } from './expr.js';
import { Expression, Id, Tone } from './primitives.js';

/** STORY node'unun (brifing ve dosya ekranı) içerik bloğu; `type` ile ayrışır. */
export const Block = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal('profileCard'),
    character: Id,
    label: z.string(),
    lines: z.array(z.string()),
    charge: z.string(),
    demand: z.string(),
  }),
  z.strictObject({
    type: z.literal('sentenceRange'),
    segments: z.array(z.enum(['green', 'gold', 'red', 'darkred'])).length(8, 'segments tam 8 parça içermeli'),
    markerPct: z.number().min(0, 'markerPct 0..100 aralığında olmalı').max(100, 'markerPct 0..100 aralığında olmalı'),
    labels: z.array(z.string()).length(4, 'labels tam 4 etiket içermeli'),
    demandLabel: z.string(),
  }),
  z.strictObject({ type: z.literal('paragraph'), title: z.string(), text: z.string() }),
  z.strictObject({
    type: z.literal('strengthList'),
    title: z.string(),
    items: z.array(z.strictObject({ label: z.string(), strength: Strength })),
  }),
  z.strictObject({
    type: z.literal('choiceGroup'),
    title: z.string(),
    group: Id,
    hints: z.record(Id, z.string()).optional(),
  }),
]);
export type Block = z.infer<typeof Block>;

// Her node türü bu ortak alanları taşır. `choices` zorunludur (boş olabilir). `hud` yalnızca VISIBLE değişkenleri
// adlandırmalıdır; bu kural değişken tanımına bakmayı gerektirdiği için şemada denetlenmez.
const nodeBase = {
  id: Id,
  title: z.string().optional(),
  eyebrow: z.string().optional(),
  chapter: z.string().optional(),
  background: z.string().optional(),
  hud: z.array(Id).optional(),
  onEnter: z.array(Effect).optional(),
  onFirstEnter: z.array(Effect).optional(),
  lines: z.array(ResponseBlock).optional(),
  choices: z.array(ChoiceDef),
  exposeCounts: z.boolean().optional(),
};

/**
 * Hikâye node'u; `type` ile ayrışır ve her tür kendi yükünü taşır (yukarıdaki ortak alanlara ek olarak):
 * - STORY `{phase?, blocks?}`, CHOICE `{prompt?}`, EVIDENCE `{prompt?, evidence}`
 * - INVESTIGATION `{tabs, scenePreview?, quickTalk?}`
 * - DIALOGUE `{mode, room, moodRules?, objectives?, tones?, allowPresent?}`
 * - SCENE `{scene, instruction, actionCosts?}`, DOCUMENT `{title, header, columns, rows, tools, actionCosts?}`
 * - DEDUCTION `{pool}`, COURTROOM `{mode, stage, statements?, …}`
 * - DECISION `{routes}` (anında yönlendirir), RESULT `{}`
 */
export const NodeDef = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal('STORY'),
    ...nodeBase,
    phase: z.literal('BRIEFING').optional(),
    blocks: z.array(Block).optional(),
  }),
  z.strictObject({ type: z.literal('CHOICE'), ...nodeBase, prompt: Line.optional() }),
  z.strictObject({ type: z.literal('EVIDENCE'), ...nodeBase, prompt: Line.optional(), evidence: Id }),
  z.strictObject({
    type: z.literal('INVESTIGATION'),
    ...nodeBase,
    tabs: z.array(
      z.strictObject({
        id: Id,
        label: z.string(),
        kind: z.enum(['SCENE', 'PEOPLE', 'ARCHIVE']),
        choices: z.array(Id),
      }),
    ),
    scenePreview: z.strictObject({ scene: Id }).optional(),
    quickTalk: z.strictObject({ character: Id, line: z.string(), choices: z.array(Id) }).optional(),
  }),
  z.strictObject({
    type: z.literal('DIALOGUE'),
    ...nodeBase,
    mode: z.enum(['CONVERSATION', 'INTERVIEW']),
    room: z.strictObject({ label: z.string(), character: Id, expression: Expression.optional() }),
    moodRules: z
      .array(z.strictObject({ when: Cond.optional(), label: z.string(), tone: Tone, expression: Expression }))
      .optional(),
    objectives: z.array(z.strictObject({ id: Id, when: Cond, known: z.string(), unknown: z.string() })).optional(),
    tones: z.array(z.strictObject({ id: Id, label: z.string(), hint: z.string().optional() })).optional(),
    allowPresent: z.boolean().optional(),
  }),
  z.strictObject({
    type: z.literal('SCENE'),
    ...nodeBase,
    scene: Id,
    instruction: z.string(),
    actionCosts: z.strictObject({ TAP: z.array(Cost).optional() }).optional(),
  }),
  z.strictObject({
    type: z.literal('DOCUMENT'),
    ...nodeBase,
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
    tools: z.array(
      z.strictObject({ id: Id, label: z.string(), icon: IconKey, visualMode: z.literal('UV').optional() }),
    ),
    actionCosts: z.strictObject({ EXAMINE: z.array(Cost).optional() }).optional(),
  }),
  z.strictObject({ type: z.literal('DEDUCTION'), ...nodeBase, pool: z.array(Id) }),
  z.strictObject({
    type: z.literal('COURTROOM'),
    ...nodeBase,
    mode: z.enum(['STAGE', 'TESTIMONY', 'OBJECTION']),
    stage: z.strictObject({
      banner: z.string(),
      bench: z.array(
        z.strictObject({
          character: Id,
          label: z.string(),
          xFrac: z.number().min(0, 'xFrac 0..1 aralığında olmalı').max(1, 'xFrac 0..1 aralığında olmalı'),
        }),
      ),
      witness: Id.optional(),
      counsel: Id,
    }),
    statements: z.array(Statement).optional(),
    witnessLabel: z.string().optional(),
    prosecutionEvidence: Id.optional(),
    rulesText: z.string().optional(),
    objectionGrounds: z.array(Id).optional(),
    courtStage: CourtStageType.optional(),
  }),
  z.strictObject({
    type: z.literal('DECISION'),
    ...nodeBase,
    routes: z.array(Route).min(1, 'routes en az bir rota içermeli'),
  }),
  z.strictObject({ type: z.literal('RESULT'), ...nodeBase }),
]);
export type NodeDef = z.infer<typeof NodeDef>;
