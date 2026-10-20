import { Category } from '@mudafaa/case-schema';
import type { CompiledCase, SessionState } from './types.js';

/** Motor sürümü: her oturuma yazılır; davranış değişirse artırılır ve `migrateState` eski durumları yükseltir. */
export const ENGINE_VERSION = 1;

/**
 * Davanın başlangıç durumu: değişkenler başlangıç değerinde, başlangıçta bilinen deliller (`via: 'INITIAL'`, seq 0) ve
 * karakterler hazır, mevcut node `config.startNode`. Başlangıç node'unun giriş etkilerini `start()` uygular.
 */
export function initialState(c: CompiledCase): SessionState {
  const vars: SessionState['vars'] = {};
  for (const v of c.pkg.variables) vars[v.id] = v.initial;
  const evidence: SessionState['evidence'] = {};
  for (const e of c.pkg.evidence) if (e.initiallyKnown) evidence[e.id] = { seq: 0, via: 'INITIAL' };
  const characters: SessionState['characters'] = {};
  for (const ch of c.pkg.characters) if (ch.initiallyKnown === true) characters[ch.id] = 0;
  const cat = Object.fromEntries(Category.options.map((k) => [k, 0])) as SessionState['score']['cat'];
  return {
    schema: 1,
    seq: 0,
    status: 'ACTIVE',
    nodeId: c.pkg.config.startNode,
    stack: [],
    vars,
    evidence,
    characters,
    visits: {},
    uses: {},
    paramUses: {},
    found: {},
    latches: {},
    score: { cat, line: {} },
    marks: [],
  };
}

/** Durumun derin kopyası (durum JSON'a serileştirilebilir olduğu için JSON klonu yeterlidir). */
export const cloneState = (s: SessionState): SessionState => JSON.parse(JSON.stringify(s)) as SessionState;
