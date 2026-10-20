import type {
  ChoiceDef,
  Cond,
  CourtSessionDef,
  CourtStageType,
  Line,
  Next,
  NodeDef,
  ObjectionGround,
  Statement,
} from '@mudafaa/case-schema';
import { cont, rawChoice, withNext } from './choices.js';
import type { OptionSpec } from './choices.js';
import { always } from './expr.js';
import type { NodeSpec } from './nodes.js';
import { N } from './text.js';

// Duruşma: celse tanımı, ortak kürsü düzeniyle COURTROOM node'ları (STAGE / OBJECTION / TESTIMONY), tanık ifadesi ve
// BASTIR / DELİL SUN / İTİRAZ kuralları. Dava #07'de her duruşma node'unda yinelenen `stage`, `hud`, `chapter` ve
// `eyebrow` alanları `court()` ile bir kez yazılır; node başına ayrıca verilen alan önceliklidir.

type Courtroom = Extract<NodeDef, { type: 'COURTROOM' }>;
type Stage = Courtroom['stage'];

/** Kürsüdeki kişi: `[karakter, etiket, xFrac]`. */
export type BenchSeat = readonly [character: string, label: string, xFrac: number];

export interface CourtConfig {
  banner?: string;
  bench: readonly BenchSeat[];
  counsel: string;
  hud?: string[];
  chapter?: string;
  eyebrow?: string;
}

/** COURTROOM node alanları; `stage` yerine kısaltmalar (`witness`, `stage` kısmi). */
type CourtNodeSpec = Omit<NodeSpec<'COURTROOM'>, 'mode' | 'stage'> & {
  witness?: string;
  stage?: Partial<Stage>;
};

export interface ObjectionSpec extends CourtNodeSpec {
  /** Kısa yol: tek koşulsuz konuşma bloğu (`lines` ile birlikte kullanılamaz). */
  say?: Line[];
  options: ChoiceDef[];
  /** `next`'i olmayan seçeneklerin gideceği node. */
  next?: Next;
}

export interface TestimonySpec extends CourtNodeSpec {
  witness: string;
  say?: Line[];
  statements: Statement[];
  /** PRESS / PRESENT / OBJECT kuralları (yazım sırası eşleşme önceliğidir). */
  rules: ChoiceDef[];
  /** PRESENT fallback'i (yanlış delil). */
  presentMiss: ChoiceDef;
  /** OBJECT fallback'i: `objectionGrounds` doluysa zorunlu. */
  objectMiss?: ChoiceDef;
  finish: { id: string; label?: string; next: Next };
}

/** Bir duruşma salonunun bağlı yardımcıları. */
export interface Court {
  /** STORY/CHOICE gibi duruşma içi diğer node'lara yayılacak ortak alanlar (`chapter`, `eyebrow`, `hud`). */
  base: { chapter?: string; eyebrow?: string; hud?: string[] };
  stage(id: string, spec?: CourtNodeSpec): Courtroom;
  /** OBJECTION: A–D usul/esas kararı (savcı delili, itiraz, ek savunma, mütalaaya cevap…). */
  objection(id: string, spec: ObjectionSpec): Courtroom;
  /** TESTIMONY: tanık ifadesi + çapraz sorgu kuralları + fallback'ler + bitiş. */
  testimony(id: string, spec: TestimonySpec): Courtroom;
}

export function court(cfg: CourtConfig): Court {
  const base = {
    ...(cfg.chapter === undefined ? {} : { chapter: cfg.chapter }),
    ...(cfg.eyebrow === undefined ? {} : { eyebrow: cfg.eyebrow }),
    ...(cfg.hud === undefined ? {} : { hud: cfg.hud }),
  };
  const stageOf = (witness: string | undefined, over: Partial<Stage> | undefined): Stage => ({
    banner: cfg.banner ?? 'ADALET MÜLKÜN TEMELİDİR',
    bench: cfg.bench.map(([character, label, xFrac]) => ({ character, label, xFrac })),
    ...(witness === undefined ? {} : { witness }),
    counsel: cfg.counsel,
    ...over,
  });
  const node = (id: string, mode: Courtroom['mode'], spec: CourtNodeSpec, choices: ChoiceDef[]): Courtroom => {
    const { witness, stage, ...rest } = spec;
    return { id, type: 'COURTROOM', mode, ...base, ...rest, stage: stageOf(witness, stage), choices };
  };
  const linesOf = (id: string, say: Line[] | undefined, lines: Courtroom['lines']) => {
    if (say !== undefined && lines !== undefined) throw new Error(`${id}: say ile lines birlikte kullanılamaz`);
    return say === undefined ? (lines === undefined ? {} : { lines }) : { lines: [{ lines: say }] };
  };
  return {
    base,
    stage: (id, spec = {}) => node(id, 'STAGE', spec, spec.choices ?? []),
    objection: (id, spec) => {
      const { say, lines, options, next, choices, ...rest } = spec;
      return node(id, 'OBJECTION', { ...rest, ...linesOf(id, say, lines) }, [
        ...withNext(options, next),
        ...(choices ?? []),
      ]);
    },
    testimony: (id, spec) => {
      const { say, lines, statements, rules, presentMiss, objectMiss, finish, choices, ...rest } = spec;
      if (presentMiss.kind !== 'FALLBACK' || presentMiss.fallbackFor !== 'PRESENT')
        throw new Error(`${id}: presentMiss bir PRESENT fallback'i olmalı`);
      if ((rest.objectionGrounds ?? []).length > 0 && objectMiss === undefined)
        throw new Error(`${id}: itiraz gerekçeleri var; objectMiss (OBJECT fallback'i) gerekli`);
      return node(id, 'TESTIMONY', { ...rest, ...linesOf(id, say, lines), statements }, [
        ...rules,
        presentMiss,
        ...(objectMiss === undefined ? [] : [objectMiss]),
        ...(choices ?? []),
        cont(finish.id, finish.label ?? 'Çapraz sorguyu bitir', finish.next),
      ]);
    },
  };
}

/** Vurgulanabilir ifade parçası; `when` verilmezse hep vurgulu. */
export const hl = (text: string, when: Cond = always) => ({ text, highlightWhen: when });

/** Tanık ifadesi: parçalar metin ya da `hl(…)`. */
export function statement(
  id: string,
  order: number,
  segments: readonly (string | { text: string; highlightWhen?: Cond })[],
  visibleWhen?: Cond,
): Statement {
  return {
    id,
    order,
    ...(visibleWhen === undefined ? {} : { visibleWhen }),
    segments: segments.map((s) => (typeof s === 'string' ? { text: s } : s)),
  };
}

/** BASTIR kuralı. */
export const pressRule = (id: string, statementId: string, spec: OptionSpec = {}): ChoiceDef =>
  rawChoice('PRESS', id, undefined, { match: { statement: statementId }, ...spec });

/** DELİL SUN kuralı: `statementId` undefined ise her ifadede geçerli; `evidence` listesindekilerden biri yeter. */
export const presentRule = (
  id: string,
  statementId: string | undefined,
  evidence: readonly string[],
  spec: OptionSpec = {},
): ChoiceDef =>
  rawChoice('PRESENT', id, undefined, {
    match:
      statementId === undefined ? { evidence: [...evidence] } : { statement: statementId, evidence: [...evidence] },
    ...spec,
  });

/** İTİRAZ kuralı (ifade × gerekçe). */
export const objectRule = (id: string, statementId: string | undefined, ground: string, spec: OptionSpec = {}) =>
  rawChoice('OBJECT', id, undefined, {
    match: statementId === undefined ? { ground } : { statement: statementId, ground },
    ...spec,
  });

/** İtiraz gerekçesi (`config.objectionGrounds`). */
export const ground = (id: string, label: string, legalBasis?: string): ObjectionGround =>
  legalBasis === undefined ? { id, label } : { id, label, legalBasis };

/** Celse: aşamalar `[aşama kimliği, tür, giriş node'u]`. */
export const courtSession = (
  id: string,
  title: string,
  stages: readonly (readonly [id: string, type: CourtStageType, entryNode: string])[],
): CourtSessionDef => ({ id, title, stages: stages.map(([sid, type, entryNode]) => ({ id: sid, type, entryNode })) });

/** Mübaşir çağrısı + başkanın uyarısı gibi açılış satırları için kısa yol. */
export const announce = (...texts: string[]): Line[] => texts.map(N);
