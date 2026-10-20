import { describe, expect, it } from 'vitest';
import { CaseReport } from '@mudafaa/case-schema';
import { EngineError, act, compile, computeScore, migrateState, report, start, stateHash, view } from '../src/index.js';
import { breakdownRows } from '../src/scoring.js';
import { GP_MID, GP_WIN, at, choose, compiled, miniPkg, play, present } from './helpers/run.js';

type Loose = Record<string, unknown> & { choices: Record<string, unknown>[] };
const nodeOf = (pkg: ReturnType<typeof miniPkg>, id: string): Loose => {
  const n = (pkg.nodes as unknown as Loose[]).find((x) => x.id === id);
  if (n === undefined) throw new Error(id);
  return n;
};
const choiceOf = (pkg: ReturnType<typeof miniPkg>, nodeId: string, id: string): Record<string, unknown> => {
  const ch = nodeOf(pkg, nodeId).choices.find((x) => x.id === id);
  if (ch === undefined) throw new Error(id);
  return ch;
};
const issueCodes = (pkg: unknown): string[] => {
  const r = compile(pkg);
  return r.ok ? [] : r.issues.map((i) => i.code);
};
const META = { sessionId: 's', caseId: 'c', stateVersion: 0, mode: 'NORMAL' as const };

describe('compile references', () => {
  it('END outcome must exist', () => {
    const pkg = miniPkg();
    choiceOf(pkg, 'n_choice', 'cl_b').effects = [{ type: 'END', outcome: 'o_typo' }];
    expect(issueCodes(pkg)).toContain('DANGLING_REF');
  });

  it('END requires a RESULT node', () => {
    const pkg = miniPkg();
    choiceOf(pkg, 'n_choice', 'cl_b').effects = [{ type: 'END' }];
    nodeOf(pkg, 'n_result').type = 'STORY';
    expect(issueCodes(pkg)).toContain('DANGLING_REF');
  });

  it('COMBINE inputs must be in the node pool', () => {
    const pkg = miniPkg();
    choiceOf(pkg, 'n_board', 'cb_ab').match = { a: 'c_a', b: 'e_key' };
    expect(issueCodes(pkg)).toContain('DANGLING_REF');
  });

  it('prompt speakers must exist', () => {
    const pkg = miniPkg();
    nodeOf(pkg, 'n_choice').prompt = { speaker: 'k_typo', text: 'Ne diyeceksin?' };
    expect(issueCodes(pkg)).toContain('DANGLING_REF');
  });

  it('ignored fields produce warnings', () => {
    const pkg = miniPkg();
    Object.assign(choiceOf(pkg, 'n_court1', 'fb_ps'), { maxUses: 1, repeat: 'NOOP' });
    const r = compile(pkg);
    expect(r.ok && r.warnings.map((w) => w.code)).toEqual(['IGNORED_FIELD', 'IGNORED_FIELD']);
  });

  it('compiled package is frozen and results do not alias it', () => {
    const c = compiled();
    expect(Object.isFrozen(c.pkg.nodes[0])).toBe(true);
    const s = play(c, [choose('ch_str_a'), choose('ch_go_talk')]);
    const r = act(c, s, choose('tp_night', 'soft'));
    if (!r.ok) throw new Error(r.code);
    expect(r.state.last).not.toBe(r.result);
    expect(() => {
      (r.result.lines[0] as { text: string }).text = 'X';
    }).toThrow(TypeError);
  });
});

describe('END, stack and DECISION', () => {
  it('END forces the outcome, enters RESULT and clears the stack', () => {
    const pkg = miniPkg();
    choiceOf(pkg, 'n_talk', 'ch_talk_end').effects = [{ type: 'END', outcome: 'o_mid' }];
    const c = compiled(pkg);
    const s = play(c, [choose('ch_str_a'), choose('ch_go_talk')]);
    expect(s.stack).toEqual(['n_hub']);
    const done = play(c, [choose('ch_talk_end')], s);
    expect(done).toMatchObject({ status: 'COMPLETED', nodeId: 'n_result', stack: [] });
    expect(done.outcome?.id).toBe('o_mid');
  });

  it('push deeper than the stack limit rejects without side effects', () => {
    const pkg = miniPkg();
    for (let i = 1; i <= 5; i++) {
      (pkg.nodes as unknown[]).push({
        id: `n_p${i}`,
        type: 'CHOICE',
        title: `Kat ${i}`,
        choices: [{ id: `ch_p${i}`, kind: 'NAVIGATE', label: 'İn', next: { push: `n_p${i + 1 > 5 ? 1 : i + 1}` } }],
      });
    }
    choiceOf(pkg, 'n_hub', 'ch_go_board').next = { push: 'n_p1' };
    const c = compiled(pkg);
    const s = play(c, [choose('ch_str_a'), choose('ch_go_board'), choose('ch_p1'), choose('ch_p2'), choose('ch_p3')]);
    expect(s.stack).toHaveLength(4);
    const before = stateHash(s);
    expect(act(c, s, choose('ch_p4'))).toMatchObject({ ok: false, code: 'LOOP_LIMIT' });
    expect(stateHash(s)).toBe(before);
  });

  it('DECISION without a matching route throws instead of saving an unviewable state', () => {
    const pkg = miniPkg();
    nodeOf(pkg, 'n_dec').routes = [{ when: { ref: 'p_strong' }, to: 'n_story_good' }];
    const c = compiled(pkg);
    const s = at(c, 'n_ev');
    expect(() => act(c, s, choose('ev_ok'))).toThrow(EngineError);
  });
});

describe('OBJECT and parameter checks', () => {
  const withObjection = () => {
    const pkg = miniPkg();
    (pkg.config.objectionGrounds as unknown[]).push({ id: 'g_telkin', label: 'Telkin edici soru' });
    const court = nodeOf(pkg, 'n_court1');
    court.objectionGrounds = ['g_telkin'];
    court.choices.push(
      {
        id: 'obj_st2',
        kind: 'OBJECT',
        match: { statement: 'st2', ground: 'g_telkin' },
        effects: [{ type: 'SCORE', category: 'USUL_BILGISI', amount: 100 }],
      },
      {
        id: 'fb_obj',
        kind: 'FALLBACK',
        fallbackFor: 'OBJECT',
        effects: [{ type: 'VAR', var: 'cred', op: 'dec', value: 1 }],
      },
    );
    return compiled(pkg);
  };

  it('OBJECT rule, fallback and invalid grounds', () => {
    const c = withObjection();
    const s = at(c, 'n_court1');
    const hit = act(c, s, { kind: 'OBJECT', groundId: 'g_telkin', statementId: 'st2' });
    expect(hit.ok && hit.result.resolution).toBe('RULE');
    expect(hit.ok && hit.state.score.cat.USUL_BILGISI).toBe(100);
    const miss = act(c, s, { kind: 'OBJECT', groundId: 'g_telkin', statementId: 'st1' });
    expect(miss.ok && miss.result.resolution).toBe('FALLBACK');
    expect(miss.ok && miss.state.vars.cred).toBe(2);
    expect(act(c, s, { kind: 'OBJECT', groundId: 'g_yok', statementId: 'st1' })).toMatchObject({
      ok: false,
      code: 'INVALID_PARAMS',
    });
    expect(act(c, s, { kind: 'OBJECT', groundId: 'g_telkin' })).toMatchObject({ ok: false, code: 'INVALID_PARAMS' });
  });

  it('statementId outside the courtroom is rejected', () => {
    const pkg = miniPkg();
    const talk = nodeOf(pkg, 'n_talk');
    talk.allowPresent = true;
    talk.choices.push({
      id: 'fb_show',
      kind: 'FALLBACK',
      fallbackFor: 'PRESENT',
      repeat: 'ONCE_PER_PARAMS',
      effects: [{ type: 'SCORE', category: 'SORGULAMA', amount: -10 }],
    });
    const c = compiled(pkg);
    const s = play(c, [choose('ch_str_a'), choose('ch_go_talk')]);
    expect(act(c, s, present('e_key')).ok).toBe(true);
    expect(act(c, s, present('e_key', 'st1'))).toMatchObject({ ok: false, code: 'INVALID_PARAMS' });
  });
});

describe('result lines, breakdown and report', () => {
  it('landing node narration is not repeated in the action result', () => {
    const c = compiled();
    const s = play(c, GP_WIN.slice(0, 13));
    const r = act(c, s, choose('ev_ok'));
    if (!r.ok) throw new Error(r.code);
    expect(r.state.nodeId).toBe('n_story_good');
    const narration = 'Heyet, tanığın çelişkisini not etti.';
    expect(r.result.lines.map((l) => l.text)).not.toContain(narration);
    expect(view(c, r.state, META).lines.map((l) => l.text)).toEqual([narration]);
  });

  it('lines of nodes passed through stay in the result', () => {
    const pkg = miniPkg();
    nodeOf(pkg, 'n_dec').lines = [{ lines: [{ speaker: 'narrator', text: 'Heyet müzakereye çekildi.' }] }];
    const c = compiled(pkg);
    const r = act(c, play(c, GP_WIN.slice(0, 13)), choose('ev_ok'));
    expect(r.ok && r.result.lines.map((l) => l.text)).toEqual(['Heyet müzakereye çekildi.']);
  });

  it('breakdown sums to final with a multiplier', () => {
    const pkg = miniPkg();
    (pkg.config.scoring as Record<string, unknown>).multiplierPct = 150;
    const c = compiled(pkg);
    const s = play(c, GP_WIN);
    const score = computeScore(c, s);
    expect(breakdownRows(score).reduce((sum, row) => sum + row.value, 0)).toBe(score.final);
    expect(score.final).toBe(s.outcome?.final);
  });

  it('skills with a zero maximum are weak unless earned', () => {
    const c = compiled();
    const s = play(c, GP_MID);
    const r = report(c, s, { categoryMax: { ARASTIRMA: 0 } });
    expect(CaseReport.safeParse(r).success).toBe(true);
    expect(r.skills.find((k) => k.category === 'ARASTIRMA')?.level).toBe('weak');
  });
});

describe('migrateState values', () => {
  it('rejects malformed record values', () => {
    const s = start(compiled()).state;
    const bad = [
      { ...s, score: { ...s.score, cat: { ...s.score.cat, ARASTIRMA: '40' } } },
      { ...s, evidence: { e_key: { seq: 'x', via: 'INITIAL' } } },
      { ...s, marks: [{ seq: 1, source: 'x', quality: 'GREAT', feedback: 'f' }] },
      { ...s, outcome: { id: 'o', raw: 1, final: '2', xp: 0 } },
      { ...s, last: { resolution: 'CHOICE' } },
    ];
    for (const b of bad) expect(() => migrateState(JSON.parse(JSON.stringify(b)))).toThrow(EngineError);
  });
});
