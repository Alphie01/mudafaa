import type { Action } from '@mudafaa/case-schema';
import { act, compile, start } from '@mudafaa/engine';
import { describe, expect, it } from 'vitest';
import { center, mergedCase } from './helpers/dava07.js';

// Motor düzeyindeki Dava #07 soruşturma testleri (Plan A Task 19). @mudafaa/engine ile çalışır.

const compiled = compile(mergedCase());
if (!compiled.ok) throw new Error(`Dava #07 derlenemedi: ${JSON.stringify(compiled.issues, null, 2)}`);
const c = compiled.c;

type State = ReturnType<typeof start>['state'];
const choose = (choiceId: string, variant?: string): Action =>
  variant === undefined ? { kind: 'CHOOSE', choiceId } : { kind: 'CHOOSE', choiceId, variant };

/** Aksiyonları baştan (ya da verilen durumdan) oynatır; reddedilen aksiyon testi düşürür. */
const play = (actions: Action[], from: State = start(c).state): State =>
  actions.reduce((s, a) => {
    const r = act(c, s, a);
    if (!r.ok) throw new Error(`${JSON.stringify(a)} reddedildi: ${r.code} ${r.message}`);
    return r.state;
  }, from);

const reject = (s: State, a: Action) => {
  const r = act(c, s, a);
  if (r.ok) throw new Error(`${JSON.stringify(a)} kabul edilmemeliydi`);
  return r.code;
};

// v2: soğuk açılış (PR_00, PR_01), Saniye (BR_00), dosya devri (BR_01, BR_01B), strateji, depo sokağı sabahı.
const PROLOG: Action[] = [choose('PR00_DEVAM'), choose('PR01_DEVAM'), choose('BR00_B')];
const BRIEF: Action[] = [
  ...PROLOG,
  choose('BR01_A'),
  choose('BR01B_DEVAM'),
  choose('STR_MASUMIYET'),
  choose('SABAH_DEVAM'),
];
// Bir günün dört eylem puanını bitiren kısa yol (gün sonu tetiklenir).
const DVR: Action[] = [choose('H_DVR'), choose('INV_DVR_BITIR')];
const TAP = {
  lamba: center(244, 44, 64, 52),
  kamera: center(144, 76, 56, 90),
  iz: center(180, 302, 60, 66),
  cop: center(292, 236, 52, 62),
};

describe('Dava #07 investigation (engine)', () => {
  it('case compiles without errors', () => {
    expect(compiled.ok).toBe(true);
  });

  it('briefing quiz and strategy', () => {
    const quiz = play([...PROLOG, choose('BR01_A')]);
    expect(quiz.score.cat.HUKUKI_BILGI).toBe(50);
    expect(quiz.nodeId).toBe('BR_01B');
    const s = play([choose('BR01B_DEVAM'), choose('STR_MASUMIYET')], quiz);
    expect(s.vars).toMatchObject({ strategy: 'MASUMIYET', strategy_pct: 150, day: 1, ap: 4 });
    expect(s.nodeId).toBe('INV_SABAH');
    expect(play([choose('SABAH_DEVAM')], s).nodeId).toBe('INV_HUB');
  });

  it('interview soft topics', () => {
    const s = play([...BRIEF, choose('H_GORUS'), choose('TP_ANAHTAR', 'soft'), choose('TP_HUSEYIN', 'soft')]);
    expect(s.vars).toMatchObject({
      fact_anahtar_ortak: true,
      fact_rizasiz_arama: true,
      fact_mazeret: true,
      trust: 70,
      min: 10,
    });
    expect(s.evidence.ev_fis).toBeDefined();

    const second = play([
      ...BRIEF,
      choose('H_GORUS'),
      choose('TP_GECE', 'soft'),
      choose('G_BITIR'),
      choose('H_GORUS2'),
    ]);
    expect(second.nodeId).toBe('INV_GORUSME');
    expect(second.vars.min).toBe(8);
  });

  it('boot print present gated', () => {
    const before = play([...BRIEF, choose('H_GORUS')]);
    expect(reject(before, choose('G_IZ'))).toBe('CHOICE_UNAVAILABLE');

    const searched = play([...BRIEF, choose('H_ARAMA'), TAP.iz, choose('ARAMA_BITIR'), choose('H_GORUS')]);
    expect(searched.vars.trust).toBe(62);
    const s = play([choose('G_IZ')], searched);
    expect(s.score.cat.ARASTIRMA - searched.score.cat.ARASTIRMA).toBe(200);
    expect(s.vars.suspect_murat).toBe(true);
  });

  it('scene taps follow design rects', () => {
    const s = play([...BRIEF, choose('H_ARAMA'), TAP.lamba, TAP.kamera, TAP.iz, TAP.cop]);
    for (const id of ['clue_ampul', 'clue_kablo', 'clue_iz42', 'clue_izmarit'])
      expect(s.evidence[id], id).toBeDefined();
    expect(s.vars.taps).toBe(2);
    const miss = play([{ kind: 'TAP', x: 5, y: 370 }], s);
    expect(miss.vars.taps).toBe(1);
    expect(miss.score.cat.ARASTIRMA - s.score.cat.ARASTIRMA).toBe(-10);
  });

  it('document UV and dust', () => {
    const uv = play([...BRIEF, choose('H_INCELEME'), { kind: 'EXAMINE', tool: 'uv', target: 'selin' }]);
    expect(uv.evidence.clue_uv_silinti).toBeDefined();
    const dust = play([{ kind: 'EXAMINE', tool: 'dust', target: 'kerem' }], uv);
    expect(dust.score.cat.DELIL_ANALIZI - uv.score.cat.DELIL_ANALIZI).toBe(-20);
    expect(dust.marks.at(-1)).toMatchObject({ quality: 'BAD', source: 'EX_DUST_KEREM' });
  });

  it('day end delivers municipal record', () => {
    const s = play([
      ...BRIEF,
      choose('H_BEL'),
      choose('BEL_A'),
      choose('H_T_SEL'),
      choose('TSEL_GORUS'),
      choose('H_T_HUS'),
      choose('THUS_YAZILI'),
      ...DVR,
    ]);
    // INV_DAY_END bir DECISION: teslimleri yapar, ilk akşam sahnesine yönlendirir.
    expect(s.visits.INV_DAY_END).toBe(1);
    expect(s.nodeId).toBe('INV_AKSAM1');
    expect(s.evidence.ev_ariza_kaydi).toBeDefined();
    expect(s.vars).toMatchObject({ day: 2, ap: 4 });
    expect(play([choose('AK1_SAAT')], s).nodeId).toBe('INV_HUB');
  });

  it('deduction lamba', () => {
    const s = play([
      ...BRIEF,
      choose('H_ARAMA'),
      TAP.lamba,
      choose('ARAMA_BITIR'),
      choose('H_BEL'),
      choose('BEL_A'),
      choose('H_T_SEL'),
      choose('TSEL_GORUS'),
      ...DVR,
      choose('AK1_SAAT'),
      choose('H_CIKARIM'),
    ]);
    const after = play([{ kind: 'COMBINE', a: 'clue_ampul', b: 'ev_ariza_kaydi' }], s);
    expect(after.evidence.ded_lamba).toBeDefined();
    expect(after.score.cat.DELIL_ANALIZI - s.score.cat.DELIL_ANALIZI).toBe(300);
  });

  it('illegal HTS', () => {
    const s = play([...BRIEF, choose('H_HTS'), choose('HTS_OP')]);
    expect(s.vars.ethics).toBe(1);
    expect(s.marks.at(-1)).toMatchObject({ quality: 'BAD' });
    expect(s.evidence.ev_hts_illegal).toBeDefined();
  });

  it('petition slots', () => {
    const open = play([...BRIEF, choose('H_DIL')]);
    expect(reject(open, choose('DIL_VER'))).toBe('CHOICE_UNAVAILABLE');
    const full = play([choose('DIL_HUSEYIN'), choose('DIL_BILIRKISI'), choose('DIL_SELIN_HTS')], open);
    expect(full.vars.slots).toBe(0);
    expect(reject(full, choose('DIL_KESIF'))).toBe('CHOICE_UNAVAILABLE');
    const back = play([choose('DIL_VER')], full);
    expect(back.nodeId).toBe('INV_HUB');
    expect(back.vars).toMatchObject({ huseyin_summoned: true, bilirkisi_present: true });
  });
});
