import type { Action } from '@mudafaa/case-schema';
import mini from '@mudafaa/case-schema/fixtures/mini-case.json' with { type: 'json' };
import { act, compile, start } from '../../src/index.js';
import type { CompiledCase, SessionState } from '../../src/index.js';

// Motor testlerinin ortak yardımcıları (dosya adı `.test.ts` ile bitmediği için test olarak çalışmaz).

export type Pkg = typeof mini;
export const miniPkg = (): Pkg => JSON.parse(JSON.stringify(mini)) as Pkg;

export function compiled(pkg: unknown = miniPkg()): CompiledCase {
  const r = compile(pkg);
  if (!r.ok) throw new Error(`compile: ${JSON.stringify(r.issues)}`);
  return r.c;
}

export const choose = (choiceId: string, variant?: string): Action =>
  variant === undefined ? { kind: 'CHOOSE', choiceId } : { kind: 'CHOOSE', choiceId, variant };
export const tap = (x: number, y: number): Action => ({ kind: 'TAP', x, y });
export const examine = (tool: string, target: string): Action => ({ kind: 'EXAMINE', tool, target });
export const combine = (a: string, b: string): Action => ({ kind: 'COMBINE', a, b });
export const press = (statementId: string): Action => ({ kind: 'PRESS', statementId });
export const present = (evidenceId: string, statementId?: string): Action =>
  statementId === undefined ? { kind: 'PRESENT', evidenceId } : { kind: 'PRESENT', evidenceId, statementId };

/** Aksiyonları sırayla uygular; reddedilen aksiyonda hata fırlatır. */
export function play(c: CompiledCase, actions: readonly Action[], from?: SessionState): SessionState {
  let s = from ?? start(c).state;
  for (const a of actions) {
    const r = act(c, s, a);
    if (!r.ok) throw new Error(`${JSON.stringify(a)} reddedildi: ${r.code} ${r.message}`);
    s = r.state;
  }
  return s;
}

/** Durumu doğrudan düzenleyerek bir node'a getirir (yalnızca testlerde). */
export function at(c: CompiledCase, nodeId: string, patch: (s: SessionState) => void = () => {}): SessionState {
  const s = start(c).state;
  s.nodeId = nodeId;
  patch(s);
  return s;
}

export const GP_WIN: Action[] = [
  choose('ch_str_a'),
  choose('ch_go_scene'),
  tap(15, 15),
  tap(70, 70),
  choose('ch_scene_end'),
  choose('ch_go_board'),
  combine('c_a', 'c_b'),
  choose('ch_board_end'),
  choose('ch_go_court'),
  present('i_ab', 'st1'),
  choose('ch_court_next'),
  choose('ob_a'),
  choose('cl_a'),
  choose('ev_ok'),
  choose('ch_good_next'),
];
export const GP_MID: Action[] = [
  choose('ch_str_b'),
  choose('ch_go_court'),
  choose('ch_court_next'),
  choose('ob_a'),
  choose('cl_b'),
  choose('ev_ok'),
];
export const GP_LOSE: Action[] = [
  choose('ch_str_b'),
  choose('ch_go_court'),
  present('e_key', 'st1'),
  present('e_key', 'st1'),
  present('e_key', 'st1'),
  choose('ch_collapse_next'),
];
