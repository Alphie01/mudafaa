import type { Action, CasePackage } from '@mudafaa/case-schema';
import { act, compile, report, start } from '@mudafaa/engine';
import { runGoldenPaths, validatePackage } from '@mudafaa/validator';
import { describe, expect, it } from 'vitest';
import { mergedCase } from './helpers/dava07.js';

// Dava #07'nin tamamı (Plan A Task 20): golden path'ler, doğrulayıcı, rapor ve çöküş yolu. @mudafaa/engine ve
// @mudafaa/validator ile çalışır.

const merged = mergedCase();
const compiled = compile(merged);
if (!compiled.ok) throw new Error(`Dava #07 derlenemedi: ${JSON.stringify(compiled.issues, null, 2)}`);
const c = compiled.c;
const goldenPaths = (merged as CasePackage).tests?.goldenPaths ?? [];

type State = ReturnType<typeof start>['state'];
const replay = (name: string): State => {
  const path = goldenPaths.find((p) => p.name === name);
  if (path === undefined) throw new Error(`golden path yok: ${name}`);
  return path.actions.reduce((s: State, a: Action) => {
    const r = act(c, s, a);
    if (!r.ok) throw new Error(`${name}: ${JSON.stringify(a)} reddedildi: ${r.code} ${r.message}`);
    return r.state;
  }, start(c).state);
};

describe('Dava #07 golden paths and validator', () => {
  it('all golden paths reach expected outcomes within windows', () => {
    const results = runGoldenPaths(c);
    expect(results.map((r) => r.name).sort()).toEqual(['G1', 'G2', 'G3', 'G4', 'G5', 'W']);
    for (const r of results) expect(r, JSON.stringify(r)).toMatchObject({ passed: true });
  });

  it('validator passes Dava #07', { timeout: 180_000 }, () => {
    const r = validatePackage(merged);
    expect(r.status, JSON.stringify(r.issues, null, 2)).toBe('PASSED');
    // Simülasyon alanları ExploreResult şeklini izler (Plan A Task 17).
    const sim = r.simulation;
    expect(sim.coverage.nodes.missing).toEqual([]);
    expect(sim.coverage.choices.missing).toEqual([]);
    expect(sim.coverage.outcomes.missing).toEqual([]);
    expect(sim.softlocks).toEqual([]);
    expect(sim.deadEnds).toEqual([]);
    expect(sim.leaks).toEqual([]);
    const legal = r.issues.filter((i) => i.code === 'LEGAL_REVIEW_PENDING');
    expect(legal.every((i) => i.severity === 'INFO')).toBe(true);
  });

  it('report for G2', () => {
    const s = replay('G2');
    expect(s.outcome?.id).toBe('BERAAT_E');
    const rep = report(c, s);
    expect(rep.missed.map((m) => m.text)).toContain("Bot izini Kerem'e göstermedin; sakladığı bilgi açığa çıkmadı.");
    const beraatB = (merged as CasePackage).outcomes.find((o) => o.id === 'BERAAT_B');
    expect(rep.alternatives).toContainEqual({ outcomeId: 'BERAAT_B', howToReach: beraatB?.howToReach });
  });

  it('collapse path', () => {
    const s = replay('W');
    expect(s.vars.cokus).toBe(true);
    expect(s.outcome?.id).toBe('MAHKUMIYET');
    expect(s.visits.C_INT_COKUS).toBe(1);
  });
});
