import type { Line, NodeView, SessionView } from '@mudafaa/case-schema';
import { choiceStatus, isPlayerChoice } from '../act.js';
import { EngineError } from '../errors.js';
import { getOwn } from '../own.js';
import type { CompiledCase, SessionState } from '../types.js';
import { choiceNodeView, evidenceNodeView } from './choice.js';
import { addSpeakers, choiceViews, clueCard, copy, evidenceCard, holds, hudOf } from './common.js';
import type { ViewCtx, ViewMeta } from './common.js';
import { courtroomView } from './courtroom.js';
import { deductionView } from './deduction.js';
import { dialogueView } from './dialogue.js';
import { documentView } from './document.js';
import { investigationView } from './investigation.js';
import { resultView } from './result.js';
import { sceneView } from './scene.js';
import { storyView } from './story.js';

export type { ViewMeta } from './common.js';

function nodeView(vc: ViewCtx): NodeView {
  const def = vc.node.def;
  switch (def.type) {
    case 'STORY':
      return storyView(vc, def);
    case 'CHOICE':
      return choiceNodeView(vc, def);
    case 'EVIDENCE':
      return evidenceNodeView(vc, def);
    case 'INVESTIGATION':
      return investigationView(vc, def);
    case 'DIALOGUE':
      return dialogueView(vc, def);
    case 'SCENE':
      return sceneView(vc, def);
    case 'DOCUMENT':
      return documentView(vc, def);
    case 'DEDUCTION':
      return deductionView(vc, def);
    case 'COURTROOM':
      return courtroomView(vc, def);
    case 'RESULT':
      return resultView(vc, def);
    case 'DECISION':
      throw new EngineError('TYPE', `DECISION node'unun görünümü yok: ${def.id}`);
  }
}

/** İlerleme etiketi: mevcut node'un `chapter`'ı; yoksa paket sırasında ondan önce gelen en yakın node'unki. */
function progressLabel(c: CompiledCase, nodeId: string): string | undefined {
  let label: string | undefined;
  for (const n of c.pkg.nodes) {
    if (n.chapter !== undefined) label = n.chapter;
    if (n.id === nodeId) return label;
  }
  return undefined;
}

function castOf(vc: ViewCtx): SessionView['cast'] {
  const entries = [...vc.cast].flatMap(([id, expression]) => {
    const ch = vc.c.characters.get(id);
    const sp = ch === undefined ? undefined : vc.c.sprites.get(ch.spriteId);
    if (ch === undefined || sp === undefined) return [];
    const sprite = {
      rows: [...sp.rows],
      ...(sp.skin === undefined ? {} : { skin: sp.skin }),
      ...(sp.noEyes === undefined ? {} : { noEyes: sp.noEyes }),
      ...(sp.noMouth === undefined ? {} : { noMouth: sp.noMouth }),
    };
    const member = {
      name: ch.name,
      shortLabel: ch.shortLabel,
      role: ch.role,
      accent: ch.accent,
      sprite,
      ...(expression === undefined ? {} : { expression }),
    };
    return [[id, member] as const];
  });
  return Object.fromEntries(entries);
}

/**
 * Oturumun temizlenmiş görünümü (docs/plan.md §6). Yalnızca oyuncunun görmesi gerekenler gider: görünür seçenekler,
 * görünür HUD değişkenleri, bulunmuş deliller ve sahne nesneleri, görünür ifadeler. Koşullar, etkiler, `next`, kurallar,
 * gizli değişkenler ve yazar notları hiçbir zaman görünüme girmez.
 */
export function view(c: CompiledCase, s: SessionState, meta: ViewMeta): SessionView {
  const node = c.nodes.get(s.nodeId);
  if (node === undefined) throw new EngineError('TYPE', `Bilinmeyen node: ${s.nodeId}`);
  const vc: ViewCtx = { c, s, ctx: { c, s }, node, meta, cast: new Map() };
  const def = node.def;
  const block = (def.lines ?? []).find((b) => holds(vc, b.when));
  const lines: Line[] = block === undefined ? [] : copy(block.lines);
  if (s.last !== undefined) addSpeakers(vc, s.last.lines);
  addSpeakers(vc, lines);
  const payload = nodeView(vc);
  const byRole = (role: 'PRIMARY' | 'BACK') =>
    def.choices.find((ch) => ch.role === role && isPlayerChoice(ch) && choiceStatus(c, s, ch).visible);
  const back = byRole('BACK');
  const primary = byRole('PRIMARY');
  const all = [...c.evidence.values()];
  const inBag = all.filter((ev) => ev.kind !== 'CLUE' && ev.countsInBag);
  const clues = all.filter((ev) => ev.kind === 'CLUE');
  const found = (id: string): boolean => getOwn(s.evidence, id) !== undefined;
  const counts = def.exposeCounts === true;
  const label = progressLabel(c, s.nodeId);
  return {
    session: {
      id: meta.sessionId,
      caseId: meta.caseId,
      caseNumber: c.pkg.meta.number,
      caseTitle: c.pkg.meta.title,
      stateVersion: meta.stateVersion,
      status: s.status,
      mode: meta.mode,
      ...(label === undefined ? {} : { progressLabel: label }),
    },
    header: {
      ...(def.eyebrow === undefined ? {} : { eyebrow: def.eyebrow }),
      ...(def.title === undefined ? {} : { title: def.title }),
      ...(back === undefined ? {} : { back: { a11yLabel: back.label ?? 'Geri', choiceId: back.id } }),
    },
    hud: hudOf(vc, def),
    cast: castOf(vc),
    lines,
    choices: choiceViews(vc),
    ...(primary === undefined ? {} : { primary: { choiceId: primary.id, label: primary.label ?? '', tone: 'gold' } }),
    bag: {
      items: inBag.filter((ev) => found(ev.id)).map(evidenceCard),
      ...(counts ? { total: inBag.length } : {}),
    },
    notebook: {
      items: clues.filter((ev) => found(ev.id)).map(clueCard),
      ...(counts ? { total: clues.length } : {}),
    },
    ...(s.last === undefined ? {} : { last: copy(s.last) }),
    node: payload,
  };
}
