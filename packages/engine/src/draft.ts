import type { Category, Line } from '@mudafaa/case-schema';
import { cloneState } from './state.js';
import type { CompiledCase, EvalCtx, SessionState } from './types.js';

/** Animasyon/geri bildirim için görünür değişiklik (UI yalnızca bunlarla efekt oynatır; durum `view`'dan gelir). */
export interface FxItem {
  kind: 'VAR' | 'SCORE' | 'EVIDENCE' | 'CHARACTER' | 'SHOUT' | 'VERDICT';
  label: string;
  delta?: number;
  id?: string;
}

/** Motor olay günlüğü (API `session_events`'e yazar; rapor ve analitik kullanır). */
export type EngineEvent =
  | { type: 'VAR'; var: string; from: unknown; to: unknown }
  | { type: 'SCORE'; category: Category; amount: number; line?: string; source: string }
  | { type: 'DISCOVER'; evidence: string; source: string }
  | { type: 'MEET'; character: string }
  | { type: 'MARK'; quality: 'GOOD' | 'BAD' | 'NEUTRAL'; feedback: string; category?: Category; source: string }
  | { type: 'NODE_ENTER'; node: string }
  | { type: 'TRIGGER'; id: string }
  | { type: 'OUTCOME'; id: string; raw: number; final: number; xp: number };

/**
 * Bir aksiyonun çalışma kopyası. `s` girdinin derin kopyasıdır; aksiyon reddedilirse atılır, girdi durumu değişmez.
 * `source`, uygulanan etkinin kaynağıdır (seçenek, kural, nesne, tetikleyici ya da node kimliği; Ruling 7).
 */
export interface Draft {
  c: CompiledCase;
  s: SessionState;
  fx: FxItem[];
  events: EngineEvent[];
  discovered: string[];
  lines: Line[];
  source: string;
  goto?: string;
  end?: { outcome?: string };
  hops: number;
  triggerFires: number;
  nodeChanged: boolean;
}

export function newDraft(c: CompiledCase, s: SessionState, source: string): Draft {
  return {
    c,
    s: cloneState(s),
    fx: [],
    events: [],
    discovered: [],
    lines: [],
    source,
    hops: 0,
    triggerFires: 0,
    nodeChanged: false,
  };
}

export const ctxOf = (d: Draft, final?: number): EvalCtx =>
  final === undefined ? { c: d.c, s: d.s } : { c: d.c, s: d.s, final };

/** 300 → "+300", −150 → "−150" (U+2212), 0 → "0". */
export function formatSigned(n: number): string {
  if (n > 0) return `+${n}`;
  if (n < 0) return `−${-n}`;
  return '0';
}
