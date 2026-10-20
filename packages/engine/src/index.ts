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
export { compile, formatPath } from './compile.js';
export type { CompileResult, Issue } from './compile.js';
export { canonicalJson, fnv1a64, stateHash } from './hash.js';
export { ENGINE_VERSION, cloneState, initialState } from './state.js';
export { newDraft, formatSigned } from './draft.js';
export type { Draft, EngineEvent, FxItem } from './draft.js';
export { applyEffects } from './effects.js';
export { computeScore, renderLabel, selectOutcome } from './scoring.js';
export type { ScoreSummary } from './scoring.js';
export { boundingRect, clampRect, hitTest } from './resolve/hit-test.js';
export { MAX_HOPS, MAX_STACK } from './transitions.js';
export type { RejectCode } from './transitions.js';
export { act, acceptedKinds, affordable, maxUsesOf } from './act.js';
export type { ActOk, ActReject } from './act.js';
export { start } from './start.js';
export { report } from './report.js';
