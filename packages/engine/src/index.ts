// Müdafaa oyun motoru: deterministik ve I/O'suz (docs/plan.md §4). Sonraki görevler (compile, effects, act, view,
// report…) bu girişe eklenir.
export { EngineError } from './errors.js';
export type { EngineErrorCode } from './errors.js';
export { getOwn } from './own.js';
export type { CNode, CompiledCase, EvalCtx, SessionState } from './types.js';
export { evalCond, evalVal, variantKey } from './expr/eval.js';
export { collectRefs, newRefSet } from './expr/refs.js';
export type { RefSet } from './expr/refs.js';
export { typeOf } from './expr/typecheck.js';
export type { ExprType } from './expr/typecheck.js';
