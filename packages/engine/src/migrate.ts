import { EngineError } from './errors.js';
import { cloneState } from './state.js';
import type { SessionState } from './types.js';

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

const RECORDS = ['vars', 'evidence', 'characters', 'visits', 'uses', 'paramUses', 'found', 'latches'] as const;

/**
 * Saklanmış oturum durumunu bu motor sürümünün biçimine getirir. Şimdilik yalnızca `schema: 1` vardır: biçimi
 * denetlenir ve kopyası döner; bilinmeyen şema ya da bozuk biçim `EngineError('TYPE')` fırlatır. Durum biçimi değişince
 * (`ENGINE_VERSION` ile birlikte) yükseltme adımları buraya eklenir.
 */
export function migrateState(s: unknown): SessionState {
  if (!isRecord(s)) throw new EngineError('TYPE', 'Oturum durumu bir nesne olmalı');
  if (s.schema !== 1) throw new EngineError('TYPE', `Bilinmeyen durum şeması: ${JSON.stringify(s.schema)}`);
  const { seq, status, nodeId, stack, score, marks } = s;
  const valid =
    typeof seq === 'number' &&
    Number.isInteger(seq) &&
    seq >= 0 &&
    (status === 'ACTIVE' || status === 'COMPLETED') &&
    typeof nodeId === 'string' &&
    Array.isArray(stack) &&
    stack.every((x) => typeof x === 'string') &&
    RECORDS.every((k) => isRecord(s[k])) &&
    isRecord(score) &&
    isRecord(score.cat) &&
    isRecord(score.line) &&
    Array.isArray(marks);
  if (!valid) throw new EngineError('TYPE', 'Oturum durumu schema 1 biçimine uymuyor');
  return cloneState(s as unknown as SessionState);
}
