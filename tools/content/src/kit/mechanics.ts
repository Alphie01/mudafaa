import type {
  ActionKind,
  ChoiceDef,
  Effect,
  IconKey,
  NodeDef,
  Rect,
  SceneDef,
  SceneObject,
  Shape,
  Tone,
} from '@mudafaa/case-schema';
import { back, rawChoice } from './choices.js';
import type { OptionSpec } from './choices.js';
import { discover, scores } from './expr.js';
import type { ScoreMap } from './expr.js';
import type { NodeSpec } from './nodes.js';

// Araştırma mekanikleri: olay yeri araması (SCENE + SceneDef), belge incelemesi (DOCUMENT + EXAMINE kuralları) ve
// çıkarım tahtası (DEDUCTION + COMBINE kuralları). Her ekran kendi FALLBACK'ini ve "bitir" (BACK, `$return`) seçeneğini
// zorunlu alır; doğrulayıcının MISSING_FALLBACK hatası böylece yazım anında önlenir.

type NodeOf<T extends NodeDef['type']> = Extract<NodeDef, { type: T }>;

/** FALLBACK: hiçbir kurala uymayan girdi (ıska, yanlış alet, yanlış çift, yanlış delil…). */
export const fallback = (id: string, kind: ActionKind, spec: OptionSpec = {}): ChoiceDef =>
  rawChoice('FALLBACK', id, undefined, { fallbackFor: kind, ...spec });

/** Dikdörtgen şekil kısaltması. */
export const rect = (x: number, y: number, w: number, h: number): Shape => ({ rect: { x, y, w, h } });

/** Bir dikdörtgenin merkezi (golden path'teki TAP için). */
export const centerOf = (r: Rect): { x: number; y: number } => ({
  x: r.x + Math.floor(r.w / 2),
  y: r.y + Math.floor(r.h / 2),
});

export interface SceneObjectSpec extends Omit<SceneObject, 'id' | 'name' | 'shapes' | 'feedback' | 'marker'> {
  /** Bulunca gösterilen metin ve kısa etiket. */
  text: string;
  short: string;
  /** Varsayılan HIDDEN (gizli ipucu); hub önizlemesindeki işaretler için VISIBLE. */
  marker?: SceneObject['marker'];
  discovers?: string | readonly string[];
  score?: ScoreMap;
}

/** Sahne nesnesi: `discovers` ve `score` etkileri (bu sırayla) `effects`'in önüne eklenir. */
export function sceneObject(id: string, name: string, shapes: Shape | Shape[], spec: SceneObjectSpec): SceneObject {
  const { text, short, marker, discovers, score, effects, ...rest } = spec;
  const found = discovers === undefined ? [] : typeof discovers === 'string' ? [discovers] : [...discovers];
  const all: Effect[] = [...found.map(discover), ...scores(score), ...(effects ?? [])];
  return {
    id,
    name,
    marker: marker ?? 'HIDDEN',
    shapes: Array.isArray(shapes) ? shapes : [shapes],
    ...rest,
    ...(all.length > 0 ? { effects: all } : {}),
    feedback: { text, short },
  };
}

/** SceneDef: `image` bir varlık kimliğidir (`asset()` ile tanımlanır). */
export const sceneDef = (id: string, spec: Omit<SceneDef, 'id'>): SceneDef => ({ id, ...spec });

/** Sahne görseli varlığı: `content/cases/<slug>/assets/scenes/<dosya>@4x.png` (case:scenes üretir). */
export const sceneAsset = (id: string, file: string) => ({
  id,
  kind: 'IMAGE' as const,
  path: `assets/scenes/${file}@4x.png`,
});

export interface SceneSearchSpec extends Omit<NodeSpec<'SCENE'>, 'scene' | 'actionCosts'> {
  scene: string;
  /** Her dokunuşun düştüğü sayaç (görünür, display tanımlı). */
  costVar?: string;
  /** Iska FALLBACK'i (ör. `fallback('FB_ARAMA', 'TAP', {...})`). */
  miss: ChoiceDef;
  finish: { id: string; label?: string };
}

/** SCENE: olay yeri araması. */
export function sceneSearch(id: string, spec: SceneSearchSpec): NodeOf<'SCENE'> {
  const { costVar, miss, finish, choices, ...rest } = spec;
  if (miss.kind !== 'FALLBACK' || miss.fallbackFor !== 'TAP') throw new Error(`${id}: miss bir TAP fallback'i olmalı`);
  return {
    id,
    type: 'SCENE',
    ...rest,
    ...(costVar === undefined ? {} : { actionCosts: { TAP: [{ var: costVar, amount: 1 }] } }),
    choices: [miss, ...(choices ?? []), back(finish.id, finish.label ?? 'Aramayı bitir')],
  };
}

type DocumentNode = NodeOf<'DOCUMENT'>;

/** Belge satırı; `lens` alet kimliğine göre farklı görünümdür (ör. UV ışıkta silinti). */
export const row = (
  id: string,
  cells: string[],
  lens?: Record<string, { cells: string[]; tone: Tone }>,
): DocumentNode['rows'][number] => (lens === undefined ? { id, cells } : { id, cells, lens });

/** Belge aleti. */
export const tool = (id: string, label: string, icon: IconKey, visualMode?: 'UV'): DocumentNode['tools'][number] =>
  visualMode === undefined ? { id, label, icon } : { id, label, icon, visualMode };

/** EXAMINE kuralı: alet × satır. */
export const examine = (id: string, toolId: string, target: string, spec: OptionSpec = {}): ChoiceDef =>
  rawChoice('EXAMINE', id, undefined, { match: { tool: toolId, target }, ...spec });

export interface DocumentSpec extends Omit<NodeSpec<'DOCUMENT'>, 'actionCosts'> {
  costVar?: string;
  rules: ChoiceDef[];
  /** EXAMINE fallback'i. */
  miss: ChoiceDef;
  finish: { id: string; label?: string };
}

/** DOCUMENT: belge incelemesi. */
export function documentExam(id: string, spec: DocumentSpec): DocumentNode {
  const { costVar, rules, miss, finish, choices, ...rest } = spec;
  if (miss.kind !== 'FALLBACK' || miss.fallbackFor !== 'EXAMINE')
    throw new Error(`${id}: miss bir EXAMINE fallback'i olmalı`);
  return {
    id,
    type: 'DOCUMENT',
    ...rest,
    ...(costVar === undefined ? {} : { actionCosts: { EXAMINE: [{ var: costVar, amount: 1 }] } }),
    choices: [...rules, miss, ...(choices ?? []), back(finish.id, finish.label ?? 'Belgeyi kapat')],
  };
}

/** COMBINE kuralı: iki havuz kartı (sırasız). */
export const recipe = (id: string, a: string, b: string, spec: OptionSpec = {}): ChoiceDef =>
  rawChoice('COMBINE', id, undefined, { match: { a, b }, ...spec });

export interface DeductionSpec extends NodeSpec<'DEDUCTION'> {
  recipes: ChoiceDef[];
  /** COMBINE fallback'i (genellikle `repeat: 'ONCE_PER_PARAMS'`). */
  miss: ChoiceDef;
  finish: { id: string; label?: string };
}

/** DEDUCTION: çıkarım tahtası. */
export function deductionBoard(id: string, spec: DeductionSpec): NodeOf<'DEDUCTION'> {
  const { recipes, miss, finish, choices, ...rest } = spec;
  if (miss.kind !== 'FALLBACK' || miss.fallbackFor !== 'COMBINE')
    throw new Error(`${id}: miss bir COMBINE fallback'i olmalı`);
  return {
    id,
    type: 'DEDUCTION',
    ...rest,
    choices: [...recipes, miss, ...(choices ?? []), back(finish.id, finish.label ?? 'Tahtadan ayrıl')],
  };
}
