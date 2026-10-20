import type { Action, CasePackage, SessionView } from '@mudafaa/case-schema';
import { act, start, view } from '@mudafaa/engine';
import type { CompiledCase } from '@mudafaa/engine';
import { TYPICAL_PATH } from '../kit/golden.js';

// Oynama süresi tahmini: golden path motorla baştan oynatılır, oyuncuya YENİ gösterilen sözcükler sayılır (her yol
// içinde aynı metin bir kez sayılır) ve aksiyon başına sabit bir düşünme/dokunma süresi eklenir.

/**
 * Kalibrasyon sabitleri. Okuma hızı (dakikada sözcük) ve aksiyon başına saniye; tahmin
 * `dakika = sözcük / READING_WPM + aksiyon × SECONDS_PER_ACTION / 60`. Gerçek oyun testleriyle ölçülüp yalnızca
 * burada ayarlanır (bütün davalar aynı sabitlerle ölçülür).
 */
export const READING_WPM = 160;
export const SECONDS_PER_ACTION = 6;

/** Hedef aralık: tipik yol 90–120 dakika (docs/content/lineup.md). */
export const TARGET_MINUTES = { min: 90, max: 120 } as const;

/** Harf ya da rakam içeren boşlukla ayrılmış parçalar. */
export const countWords = (text: string): number => text.split(/\s+/u).filter((t) => /[\p{L}\p{N}]/u.test(t)).length;

/**
 * Görünümde oyuncuya gösterilen metinler:
 * - satırlar (`lines`), CHOICE/EVIDENCE sorusu ve hub'ın hızlı konuşma satırı;
 * - STORY bloklarının metinleri;
 * - tanık ifadelerinin parçaları (ifade başına birleştirilmiş);
 * - sunulan seçeneklerin etiket ve açıklamaları;
 * - görüşme hedefleri;
 * - belge hücreleri;
 * - son aksiyonun satırları ve geri bildirimi (`last`);
 * - RESULT'ta ceza, hüküm metni ve gerekçe.
 */
export function viewTexts(v: SessionView): string[] {
  const out: string[] = [];
  const push = (t: string | undefined): void => {
    if (t !== undefined && t.trim() !== '') out.push(t);
  };
  for (const l of v.last?.lines ?? []) push(l.text);
  push(v.last?.feedback?.title);
  push(v.last?.feedback?.text);
  push(v.last?.feedback?.label);
  push(v.last?.hit?.text);
  for (const l of v.lines) push(l.text);
  for (const ch of v.choices) {
    push(ch.label);
    push(ch.description);
  }
  const n = v.node;
  switch (n.type) {
    case 'STORY':
      for (const b of n.blocks) {
        if (b.type === 'profileCard') [b.label, ...b.lines, b.charge, b.demand].forEach(push);
        if (b.type === 'sentenceRange') [...b.labels, b.demandLabel].forEach(push);
        if (b.type === 'paragraph') [b.title, b.text].forEach(push);
        if (b.type === 'strengthList') [b.title, ...b.items.map((i) => i.label)].forEach(push);
        if (b.type === 'choiceGroup') [b.title, ...Object.values(b.hints ?? {})].forEach(push);
      }
      break;
    case 'CHOICE':
    case 'EVIDENCE':
      push(n.prompt?.text);
      break;
    case 'INVESTIGATION':
      push(n.quickTalk?.line);
      break;
    case 'DIALOGUE':
      for (const o of n.objectives) push(o.text);
      break;
    case 'DOCUMENT':
      for (const r of n.rows) r.cells.forEach(push);
      break;
    case 'COURTROOM':
      for (const st of n.statements ?? []) push(st.segments.map((s) => s.text).join(''));
      break;
    case 'RESULT':
      push(n.sentence.result);
      push(n.verdictText);
      n.reasoning.forEach(push);
      break;
    default:
      break;
  }
  return out;
}

export interface PathEstimate {
  name: string;
  words: number;
  actions: number;
  minutes: number;
  outcome?: string;
  final?: number;
  /** Yol oynatılamadıysa nedeni (süre yine o ana kadar hesaplanır). */
  error?: string;
}

const META = { sessionId: 'duration', caseId: 'duration', stateVersion: 0, mode: 'TEST' as const };

/** Dakika tahmini (bir ondalık). */
export const minutesOf = (words: number, actions: number): number =>
  Math.round((words / READING_WPM + (actions * SECONDS_PER_ACTION) / 60) * 10) / 10;

/** Bir aksiyon dizisini oynatır ve yeni gösterilen sözcükleri sayar. */
export function estimateActions(c: CompiledCase, name: string, actions: readonly Action[]): PathEstimate {
  const seen = new Set<string>();
  let words = 0;
  const take = (v: SessionView): void => {
    for (const t of viewTexts(v)) {
      if (seen.has(t)) continue;
      seen.add(t);
      words += countWords(t);
    }
  };
  let s = start(c).state;
  take(view(c, s, META));
  let done = 0;
  let error: string | undefined;
  for (const a of actions) {
    const r = act(c, s, a);
    if (!r.ok) {
      error = `${done + 1}. aksiyon reddedildi (${r.code}): ${JSON.stringify(a)}`;
      break;
    }
    s = r.state;
    done += 1;
    take(view(c, s, META));
  }
  if (error === undefined && s.status !== 'COMPLETED') error = `dava bitmedi (son node: ${s.nodeId})`;
  return {
    name,
    words,
    actions: done,
    minutes: minutesOf(words, done),
    ...(s.outcome === undefined ? {} : { outcome: s.outcome.id, final: s.outcome.final }),
    ...(error === undefined ? {} : { error }),
  };
}

/** Bütün golden path'lerin tahmini. */
export const estimateGoldenPaths = (c: CompiledCase): PathEstimate[] =>
  ((c.pkg as CasePackage).tests?.goldenPaths ?? []).map((g) => estimateActions(c, g.name, g.actions));

export interface DurationReport {
  paths: PathEstimate[];
  typical?: PathEstimate;
  /** Tipik yol var, oynatılabiliyor ve 90–120 dakika içinde. */
  inRange: boolean;
}

export function durationReport(c: CompiledCase): DurationReport {
  const paths = estimateGoldenPaths(c);
  const typical = paths.find((p) => p.name === TYPICAL_PATH);
  const inRange =
    typical !== undefined &&
    typical.error === undefined &&
    typical.minutes >= TARGET_MINUTES.min &&
    typical.minutes <= TARGET_MINUTES.max;
  return { paths, ...(typical === undefined ? {} : { typical }), inRange };
}

/** İnsan okunur süre raporu. */
export function formatDuration(r: DurationReport): string {
  const row = (p: PathEstimate): string =>
    `  ${p.name.padEnd(12)} ${p.minutes.toFixed(1).padStart(6)} dk  ${String(p.words).padStart(6)} sözcük  ` +
    `${String(p.actions).padStart(4)} aksiyon  ${p.outcome ?? '—'}${p.final === undefined ? '' : ` (${p.final})`}` +
    (p.error === undefined ? '' : `  HATA: ${p.error}`);
  const lines = [
    `Süre tahmini (dakika = sözcük / ${READING_WPM} + aksiyon × ${SECONDS_PER_ACTION} sn / 60):`,
    ...r.paths.map(row),
  ];
  if (r.typical === undefined) {
    lines.push(
      `  ✗ TİPİK YOL YOK: "${TYPICAL_PATH}" adlı golden path ekleyin (hedef ${TARGET_MINUTES.min}–${TARGET_MINUTES.max} dk).`,
    );
  } else {
    const verdict = r.inRange ? '✓ hedefte' : `✗ HEDEF DIŞI (${TARGET_MINUTES.min}–${TARGET_MINUTES.max} dk)`;
    lines.push(`  ==> TİPİK YOL (${TYPICAL_PATH}): ${r.typical.minutes.toFixed(1)} dk  ${verdict}`);
  }
  return `${lines.join('\n')}\n`;
}
