import { newDraft } from './draft.js';
import type { EngineEvent } from './draft.js';
import { EngineError } from './errors.js';
import { initialState } from './state.js';
import { Reject, enterNode, settle } from './transitions.js';
import type { CompiledCase, SessionState } from './types.js';

/** Yeni oturum: başlangıç durumu, başlangıç node'una giriş (giriş etkileri) ve ilk tetikleyici turu. */
export function start(c: CompiledCase): { state: SessionState; events: EngineEvent[] } {
  const d = newDraft(c, initialState(c), c.pkg.config.startNode);
  try {
    enterNode(d, c.pkg.config.startNode);
    settle(d);
  } catch (e) {
    if (e instanceof Reject) throw new EngineError('TYPE', `Başlangıçta ${e.code}: ${e.message}`);
    throw e;
  }
  return { state: d.s, events: d.events };
}
