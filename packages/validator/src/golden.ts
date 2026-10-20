import { act, start } from '@mudafaa/engine';
import type { CompiledCase } from '@mudafaa/engine';

export interface GoldenResult {
  name: string;
  passed: boolean;
  outcome?: string;
  final?: number;
  error?: string;
}

/** `tests.goldenPaths`'i baştan oynatır: dava bitmeli, sonuç beklenen olmalı, final skor pencerenin içinde kalmalı. */
export function runGoldenPaths(c: CompiledCase): GoldenResult[] {
  return (c.pkg.tests?.goldenPaths ?? []).map((g) => {
    try {
      let s = start(c).state;
      for (const [i, a] of g.actions.entries()) {
        const r = act(c, s, a);
        if (!r.ok)
          return {
            name: g.name,
            passed: false,
            error: `${i + 1}. aksiyon reddedildi (${r.code}): ${JSON.stringify(a)}`,
          };
        s = r.state;
      }
      if (s.status !== 'COMPLETED' || s.outcome === undefined) {
        return { name: g.name, passed: false, error: `Dava bitmedi (son node: ${s.nodeId})` };
      }
      const { id, final } = s.outcome;
      const problems: string[] = [];
      if (id !== g.expect.outcome) problems.push(`sonuç ${id}, beklenen ${g.expect.outcome}`);
      if (g.expect.finalMin !== undefined && final < g.expect.finalMin)
        problems.push(`final ${final} < ${g.expect.finalMin}`);
      if (g.expect.finalMax !== undefined && final > g.expect.finalMax)
        problems.push(`final ${final} > ${g.expect.finalMax}`);
      return {
        name: g.name,
        passed: problems.length === 0,
        outcome: id,
        final,
        ...(problems.length === 0 ? {} : { error: problems.join('; ') }),
      };
    } catch (e) {
      return { name: g.name, passed: false, error: e instanceof Error ? e.message : String(e) };
    }
  });
}
