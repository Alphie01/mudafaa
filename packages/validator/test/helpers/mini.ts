import mini from '@mudafaa/case-schema/fixtures/mini-case.json' with { type: 'json' };
import { compile } from '@mudafaa/engine';
import type { CompiledCase } from '@mudafaa/engine';

// Doğrulayıcı testlerinin ortak yardımcıları: mini-case'in yamalı kopyaları.

/** Yamalanan JSON düğümü: testler fikstürü serbestçe değiştirdiği için tipsizdir. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = any;

/** mini-case'in derin kopyası (JSON düzeyinde yamalanır). */
export type Json = Record<string, Loose> & { nodes: Record<string, Loose>[] };
export const fresh = (): Json => JSON.parse(JSON.stringify(mini)) as Json;

/** mini-case'i kopyalar, `mutate` ile yamalar. */
export function withPatch(mutate: (p: Json) => void): Json {
  const p = fresh();
  mutate(p);
  return p;
}

export const node = (p: Json, id: string): Record<string, Loose> => {
  const n = p.nodes.find((x) => x.id === id);
  if (n === undefined) throw new Error(`node yok: ${id}`);
  return n;
};
export const choice = (p: Json, nodeId: string, id: string): Record<string, Loose> => {
  const ch = (node(p, nodeId).choices as Record<string, Loose>[]).find((x) => x.id === id);
  if (ch === undefined) throw new Error(`seçenek yok: ${id}`);
  return ch;
};

export function compiled(p: unknown): CompiledCase {
  const r = compile(p);
  if (!r.ok) throw new Error(`compile: ${JSON.stringify(r.issues)}`);
  return r.c;
}

/** Testlerde hızlı simülasyon: küçük BFS bütçesi ve az yürüyüş (sayı bütçeleri; süre yalnızca sert sınır). */
export const FAST = { maxStates: 4_000, walks: 60, maxMs: 120_000 } as const;

/** Başlangıca, `n_brief`'e giden seçenekleri olan yeni bir node ekler. */
export function preStart(p: Json, choices: Record<string, unknown>[]): void {
  p.nodes.unshift({ id: 'n_pre', type: 'CHOICE', title: 'Ön', choices });
  p.config.startNode = 'n_pre';
}
