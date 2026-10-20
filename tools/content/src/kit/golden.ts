import type { Action, CasePackage, Rect, Shape } from '@mudafaa/case-schema';

// Golden path: aksiyon dizisi + beklenen sonuç. Adımlar iç içe dizi olarak gruplanabilir (gün, celse…); düzleştirilir.

type GoldenPath = NonNullable<CasePackage['tests']>['goldenPaths'][number];

/** Tipik oyunun golden path adı: `case:duration` bunu 90–120 dakika hedefiyle ölçer. */
export const TYPICAL_PATH = 'TIPIK';

const centerOfShape = (s: Shape | Rect): { x: number; y: number } => {
  if ('w' in s) return { x: s.x + Math.floor(s.w / 2), y: s.y + Math.floor(s.h / 2) };
  if ('rect' in s) return centerOfShape(s.rect);
  if ('circle' in s) return { x: s.circle.cx, y: s.circle.cy };
  throw new Error('tapCenter: çokgen için tap(x, y) kullanın');
};

/** Aksiyon kurucuları. */
export const step = {
  choose: (choiceId: string, variant?: string): Action =>
    variant === undefined ? { kind: 'CHOOSE', choiceId } : { kind: 'CHOOSE', choiceId, variant },
  tap: (x: number, y: number): Action => ({ kind: 'TAP', x, y }),
  /** Dikdörtgen ya da daire şeklin merkezine dokunuş. */
  tapCenter: (shape: Shape | Rect): Action => ({ kind: 'TAP', ...centerOfShape(shape) }),
  examine: (tool: string, target: string): Action => ({ kind: 'EXAMINE', tool, target }),
  combine: (a: string, b: string): Action => ({ kind: 'COMBINE', a, b }),
  press: (statementId: string): Action => ({ kind: 'PRESS', statementId }),
  present: (evidenceId: string, statementId?: string): Action =>
    statementId === undefined ? { kind: 'PRESENT', evidenceId } : { kind: 'PRESENT', evidenceId, statementId },
  object: (groundId: string, statementId?: string): Action =>
    statementId === undefined ? { kind: 'OBJECT', groundId } : { kind: 'OBJECT', groundId, statementId },
};

/** Birden çok CHOOSE: `chooseAll('A', 'B', ['T', 'soft'])`. */
export const chooseAll = (...ids: (string | readonly [string, string])[]): Action[] =>
  ids.map((id) => (typeof id === 'string' ? step.choose(id) : step.choose(id[0], id[1])));

type Steps = readonly (Action | Steps)[];
const flatten = (steps: Steps): Action[] =>
  steps.flatMap((s) => (Array.isArray(s) ? flatten(s as Steps) : [s as Action]));

/** Golden path: `goldenPath('TIPIK', { outcome: 'BERAAT_E' }, gun1, gun2, celse1, …)`. */
export const goldenPath = (name: string, expect: GoldenPath['expect'], ...steps: Steps): GoldenPath => ({
  name,
  actions: flatten(steps),
  expect,
});
