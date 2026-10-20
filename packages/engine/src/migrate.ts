import { ActionResult, Category } from '@mudafaa/case-schema';
import { EngineError } from './errors.js';
import { cloneState } from './state.js';
import type { SessionState } from './types.js';

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const isInt = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v);
const recordOf = (v: unknown, check: (x: unknown) => boolean): boolean => isRecord(v) && Object.values(v).every(check);
const QUALITIES: ReadonlySet<unknown> = new Set(['GOOD', 'BAD', 'NEUTRAL']);
const CATEGORIES: ReadonlySet<unknown> = new Set(Category.options);

/** schema 1 durumunun biçimi: kayıt değerlerinin türleri, altı kategori, işaretler, son sonuç ve dava sonucu. */
function validSchema1(s: Record<string, unknown>): boolean {
  const { seq, status, nodeId, stack, score, marks, last, outcome } = s;
  return (
    isInt(seq) &&
    seq >= 0 &&
    (status === 'ACTIVE' || status === 'COMPLETED') &&
    typeof nodeId === 'string' &&
    Array.isArray(stack) &&
    stack.every((x) => typeof x === 'string') &&
    recordOf(s.vars, (v) => isInt(v) || typeof v === 'boolean' || typeof v === 'string') &&
    recordOf(s.evidence, (v) => isRecord(v) && isInt(v.seq) && typeof v.via === 'string') &&
    recordOf(s.characters, isInt) &&
    recordOf(s.visits, isInt) &&
    recordOf(s.uses, isInt) &&
    recordOf(s.found, isInt) &&
    recordOf(s.paramUses, (v) => Array.isArray(v) && v.every((x) => typeof x === 'string')) &&
    recordOf(s.latches, (v) => typeof v === 'boolean') &&
    isRecord(score) &&
    isRecord(score.cat) &&
    Category.options.every((k) => isInt((score.cat as Record<string, unknown>)[k])) &&
    recordOf(score.line, isInt) &&
    Array.isArray(marks) &&
    marks.every(
      (m) =>
        isRecord(m) &&
        isInt(m.seq) &&
        typeof m.source === 'string' &&
        QUALITIES.has(m.quality) &&
        typeof m.feedback === 'string' &&
        (m.category === undefined || CATEGORIES.has(m.category)),
    ) &&
    (last === undefined || ActionResult.safeParse(last).success) &&
    (outcome === undefined ||
      (isRecord(outcome) &&
        typeof outcome.id === 'string' &&
        isInt(outcome.raw) &&
        isInt(outcome.final) &&
        isInt(outcome.xp)))
  );
}

/**
 * Saklanmış oturum durumunu bu motor sürümünün biçimine getirir. Şimdilik yalnızca `schema: 1` vardır: biçimi
 * (kayıt değerlerinin türleri dahil) denetlenir ve kopyası döner; bilinmeyen şema ya da bozuk biçim `EngineError('TYPE')`
 * fırlatır. Durum biçimi değişince (`ENGINE_VERSION` ile birlikte) yükseltme adımları buraya eklenir.
 */
export function migrateState(s: unknown): SessionState {
  if (!isRecord(s)) throw new EngineError('TYPE', 'Oturum durumu bir nesne olmalı');
  if (s.schema !== 1) throw new EngineError('TYPE', `Bilinmeyen durum şeması: ${JSON.stringify(s.schema)}`);
  if (!validSchema1(s)) throw new EngineError('TYPE', 'Oturum durumu schema 1 biçimine uymuyor');
  return cloneState(s as unknown as SessionState);
}
