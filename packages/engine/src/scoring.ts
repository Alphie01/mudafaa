import { Category } from '@mudafaa/case-schema';
import type { OutcomeDef, Tone } from '@mudafaa/case-schema';
import { EngineError } from './errors.js';
import { evalCond, evalVal } from './expr/eval.js';
import { getOwn } from './own.js';
import type { CompiledCase, SessionState } from './types.js';

export interface ScoreSummary {
  raw: number;
  bonuses: { id: string; label: string; value: number }[];
  final: number;
  lines: { id: string; label: string; value: number }[];
  /** Genel çarpanın skora kattığı fark (`base − raw`; çarpan yoksa 0). */
  adjust: number;
}

const toInt = (v: number | string | boolean, what: string): number => {
  if (typeof v !== 'number') throw new EngineError('TYPE', `${what} sayı olmalı`);
  return Math.trunc(v);
};

/** Etiket şablonu: `{{count.evidence:TAG}}`, `{{total.tag:TAG}}`, `{{var.NAME}}`. */
export function renderLabel(template: string, c: CompiledCase, s: SessionState): string {
  return template.replace(
    /\{\{(count\.evidence:|total\.tag:|var\.)([A-Za-z][A-Za-z0-9_]*)\}\}/g,
    (_m, kind: string, arg: string) => {
      if (kind === 'count.evidence:') {
        let n = 0;
        for (const [id, def] of c.evidence)
          if (getOwn(s.evidence, id) !== undefined && (def.tags ?? []).includes(arg)) n++;
        return String(n);
      }
      if (kind === 'total.tag:') {
        let n = 0;
        for (const def of c.evidence.values()) if ((def.tags ?? []).includes(arg)) n++;
        return String(n);
      }
      const v = getOwn(s.vars, arg);
      return v === undefined ? '' : String(v);
    },
  );
}

/** Ham skor (kategori toplamı), bonuslar, final ve döküm satırları. `final = raw + Σ bonus` (çarpan varsa önce uygulanır). */
export function computeScore(c: CompiledCase, s: SessionState): ScoreSummary {
  const scoring = c.pkg.config.scoring;
  const raw = Category.options.reduce((sum, k) => sum + (s.score.cat[k] ?? 0), 0);
  const ctx = { c, s };
  const bonuses = scoring.bonuses.map((b) => ({
    id: b.id,
    label: renderLabel(b.label, c, s),
    value: toInt(evalVal(b.value, ctx), `${b.id} bonusu`),
  }));
  const bonusSum = bonuses.reduce((sum, b) => sum + b.value, 0);
  const base =
    scoring.multiplierPct === undefined
      ? raw
      : Math.round((raw * toInt(evalVal(scoring.multiplierPct, ctx), 'multiplierPct')) / 100);
  const lines = scoring.lines.map((l) => ({
    id: l.id,
    label: renderLabel(l.label, c, s),
    value: getOwn(s.score.line, l.id) ?? 0,
  }));
  return { raw, bonuses, final: base + bonusSum, lines, adjust: base - raw };
}

const toneOf = (value: number): Tone => (value > 0 ? 'success' : value < 0 ? 'error' : 'neutral');

/** Karar dökümü: önce skor satırları, sonra bonuslar; işarete göre renk. */
export function breakdownRows(score: ScoreSummary): { label: string; value: number; tone: Tone }[] {
  const rows = [...score.lines, ...score.bonuses];
  if (score.adjust !== 0) rows.push({ id: 'multiplier', label: 'Çarpan', value: score.adjust });
  return rows.map((r) => ({ label: r.label, value: r.value, tone: toneOf(r.value) }));
}

/** Önceliğe göre `when` koşulunu tutan ilk sonuç (son sonuç `{all:[]}` olduğundan her zaman bir sonuç vardır). */
export function selectOutcome(c: CompiledCase, s: SessionState, final: number): OutcomeDef {
  const outcome = c.outcomes.find((o) => evalCond(o.when, { c, s, final })) ?? c.outcomes[c.outcomes.length - 1];
  if (outcome === undefined) throw new EngineError('TYPE', 'Davada sonuç tanımı yok');
  return outcome;
}
