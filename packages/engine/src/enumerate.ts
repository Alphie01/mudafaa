import type { Action, Cost, NodeDef, SceneDef, SceneObject } from '@mudafaa/case-schema';
import {
  acceptedKinds,
  affordable,
  choiceStatus,
  fallbackSpent,
  isPlayerChoice,
  matchRule,
  maxUsesOf,
  objectUsable,
  paramKey,
} from './act.js';
import type { ParamAction } from './act.js';
import { evalCond } from './expr/eval.js';
import { getOwn } from './own.js';
import { boundingRect, hitTest } from './resolve/hit-test.js';
import type { CNode, CompiledCase, SessionState } from './types.js';

/** Aksiyon bir kurala ya da harcanmamış bir fallback'e düşüyor ve maliyeti karşılanıyor mu (NOOP ve ret hariç). */
function resolvable(c: CompiledCase, s: SessionState, node: CNode, a: ParamAction, costs?: readonly Cost[]): boolean {
  const rule = matchRule({ c, s }, node, a);
  if (rule !== undefined) {
    return (getOwn(s.uses, rule.id) ?? 0) < maxUsesOf(rule) && (a.kind === 'PRESS' || affordable(s, costs));
  }
  if (a.kind === 'PRESS') return false;
  const fb = node.fallbacks[a.kind];
  return fb !== undefined && !fallbackSpent(s, fb, paramKey(a)) && affordable(s, costs);
}

/** Nesneye gerçekten isabet eden ilk nokta: ilk şeklin merkezi, örtülüyse şekillerin kutularında satır satır tarama. */
function probeFor(scene: SceneDef, obj: SceneObject, active: (o: SceneObject) => boolean): [number, number] | null {
  const inScene = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < scene.width && y < scene.height;
  const hits = (x: number, y: number): boolean => inScene(x, y) && hitTest(scene, x, y, active) === obj;
  const first = obj.shapes[0];
  if (first !== undefined) {
    const center: [number, number] =
      'circle' in first
        ? [first.circle.cx, first.circle.cy]
        : (() => {
            const r = boundingRect(first);
            return [r.x + Math.floor(r.w / 2), r.y + Math.floor(r.h / 2)];
          })();
    if (hits(center[0], center[1])) return center;
  }
  for (const shape of obj.shapes) {
    const r = boundingRect(shape);
    for (let y = Math.max(0, r.y); y < Math.min(scene.height, r.y + r.h); y++) {
      for (let x = Math.max(0, r.x); x < Math.min(scene.width, r.x + r.w); x++) if (hits(x, y)) return [x, y];
    }
  }
  return null;
}

function tapActions(c: CompiledCase, s: SessionState, node: CNode, def: Extract<NodeDef, { type: 'SCENE' }>): Action[] {
  const scene = c.scenes.get(def.scene);
  if (scene === undefined || !affordable(s, def.actionCosts?.TAP)) return [];
  const active = (o: SceneObject): boolean => o.activeWhen === undefined || evalCond(o.activeWhen, { c, s });
  const out: Action[] = [];
  for (const obj of scene.objects) {
    if (!active(obj) || !objectUsable(s, obj)) continue;
    const p = probeFor(scene, obj, active);
    if (p !== null) out.push({ kind: 'TAP', x: p[0], y: p[1] });
  }
  const fb = node.fallbacks.TAP;
  if (fb === undefined) return out;
  for (let y = 0; y < scene.height; y++) {
    for (let x = 0; x < scene.width; x++) {
      if (hitTest(scene, x, y, active) === null && !fallbackSpent(s, fb, paramKey({ kind: 'TAP', x, y }))) {
        out.push({ kind: 'TAP', x, y });
        return out;
      }
    }
  }
  return out;
}

/**
 * Durumda anlamlı sonucu olan aksiyonlar (doğrulayıcının simülasyonu için): görünür ve kullanılabilir seçenekler (her
 * varyant ayrı), her kullanılabilir nesneye isabet eden bir dokunuş ve tek bir ıska noktası, alet × satır, bulunmuş
 * havuz kartlarının sırasız çiftleri, ifadelere BASTIR / DELİL SUN / İTİRAZ. NOOP'a düşecek (tükenmiş kural,
 * harcanmış fallback) ve reddedilecek (karşılanamayan maliyet, kuralsız ve fallback'siz girdi) aksiyonlar dışarıda kalır.
 */
export function enumerateActions(c: CompiledCase, s: SessionState): Action[] {
  const node = c.nodes.get(s.nodeId);
  if (s.status !== 'ACTIVE' || node === undefined) return [];
  const def = node.def;
  const out: Action[] = [];
  if (acceptedKinds(def).includes('CHOOSE')) {
    for (const ch of def.choices) {
      if (!isPlayerChoice(ch)) continue;
      const st = choiceStatus(c, s, ch);
      if (!st.visible || !st.enabled || !st.affordable || st.exhausted) continue;
      if (ch.variants !== undefined && ch.variants.length > 0) {
        for (const v of ch.variants) out.push({ kind: 'CHOOSE', choiceId: ch.id, variant: v.id });
      } else out.push({ kind: 'CHOOSE', choiceId: ch.id });
    }
  }
  const push = (a: ParamAction, costs?: readonly Cost[]): void => {
    if (resolvable(c, s, node, a, costs)) out.push(a);
  };
  const found = [...c.evidence.values()].filter((ev) => getOwn(s.evidence, ev.id) !== undefined);
  switch (def.type) {
    case 'SCENE':
      out.push(...tapActions(c, s, node, def));
      break;
    case 'DOCUMENT':
      for (const tool of def.tools) {
        for (const row of def.rows) push({ kind: 'EXAMINE', tool: tool.id, target: row.id }, def.actionCosts?.EXAMINE);
      }
      break;
    case 'DEDUCTION': {
      const cards = def.pool.filter((id) => getOwn(s.evidence, id) !== undefined && c.evidence.get(id)?.combinable);
      for (let i = 0; i < cards.length; i++) {
        for (let j = i + 1; j < cards.length; j++) {
          const a = cards[i];
          const b = cards[j];
          if (a !== undefined && b !== undefined) push({ kind: 'COMBINE', a, b });
        }
      }
      break;
    }
    case 'COURTROOM': {
      if (def.mode !== 'TESTIMONY') break;
      const statements = (def.statements ?? []).filter(
        (st) => st.visibleWhen === undefined || evalCond(st.visibleWhen, { c, s }),
      );
      for (const st of statements) push({ kind: 'PRESS', statementId: st.id });
      for (const ev of found) {
        if (!ev.presentable) continue;
        for (const st of statements) push({ kind: 'PRESENT', evidenceId: ev.id, statementId: st.id });
      }
      for (const groundId of def.objectionGrounds ?? []) {
        for (const st of statements) push({ kind: 'OBJECT', groundId, statementId: st.id });
      }
      break;
    }
    case 'DIALOGUE':
      if (def.allowPresent === true) for (const ev of found) push({ kind: 'PRESENT', evidenceId: ev.id });
      break;
    default:
      break;
  }
  return out;
}
