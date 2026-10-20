import type {
  ChoiceDef,
  ChoiceView,
  ClueCard,
  Cond,
  Cost,
  EvidenceCard,
  EvidenceDef,
  Expression,
  HudItem,
  Line,
  NodeDef,
  SceneDef,
  SceneObject,
} from '@mudafaa/case-schema';
import { choiceStatus, isPlayerChoice } from '../act.js';
import { evalCond } from '../expr/eval.js';
import { getOwn } from '../own.js';
import type { CNode, CompiledCase, EvalCtx, SessionState } from '../types.js';

/** `view()`'in API'den aldığı oturum bilgisi. `assetUrl` varlık yolunu istemcinin indireceği adrese çevirir. */
export interface ViewMeta {
  sessionId: string;
  caseId: string;
  stateVersion: number;
  mode: 'NORMAL' | 'TEST';
  assetUrl?: (asset: { id: string; path: string }) => string;
}

/** Görünüm üretimi sırasında paylaşılan bağlam; `addCast` ekranda görünen karakterleri toplar. */
export interface ViewCtx {
  c: CompiledCase;
  s: SessionState;
  ctx: EvalCtx;
  node: CNode;
  meta: ViewMeta;
  cast: Map<string, Expression | undefined>;
}

export function addCast(vc: ViewCtx, id: string, expression?: Expression): void {
  if (!vc.c.characters.has(id)) return;
  if (expression !== undefined || !vc.cast.has(id)) vc.cast.set(id, expression ?? vc.cast.get(id));
}

/** Satırların konuşmacılarını kadroya ekler (karakterin son satırdaki yüz ifadesiyle). */
export function addSpeakers(vc: ViewCtx, lines: readonly Line[]): void {
  for (const l of lines) if (l.speaker !== 'player' && l.speaker !== 'narrator') addCast(vc, l.speaker, l.expression);
}

/** İçerik nesnesinin bağımsız kopyası (görünüm derlenmiş davayla nesne paylaşmaz). */
export const copy = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

export const discovered = (vc: ViewCtx, id: string): boolean => getOwn(vc.s.evidence, id) !== undefined;
export const usedOnce = (vc: ViewCtx, id: string): boolean => (getOwn(vc.s.uses, id) ?? 0) >= 1;
export const holds = (vc: ViewCtx, when: Cond | undefined): boolean => when === undefined || evalCond(when, vc.ctx);
export const activeObject = (vc: ViewCtx, o: SceneObject): boolean => holds(vc, o.activeWhen);

/** Node'daki oyuncu seçeneği şu an görünür mü (tab, hızlı konuşma ve ipucu listeleri yalnızca bunları gösterir). */
export function visibleChoice(vc: ViewCtx, id: string): boolean {
  const ch = vc.node.choices.get(id);
  return ch !== undefined && isPlayerChoice(ch) && choiceStatus(vc.c, vc.s, ch).visible;
}

/** Sahne görseli: varlık yolu `assetUrl` ile adrese çevrilir (verilmezse dava dizinine göre göreli yol). */
export function sceneImage(vc: ViewCtx, scene: SceneDef): { imageUrl: string; width: number; height: number } {
  const asset = vc.c.pkg.assets.find((a) => a.id === scene.image);
  const path = asset?.path ?? scene.image;
  const imageUrl = vc.meta.assetUrl === undefined ? path : vc.meta.assetUrl({ id: scene.image, path });
  return { imageUrl, width: scene.width, height: scene.height };
}

const TYPE_LABEL: Record<EvidenceDef['type'], string> = {
  FIZIKSEL: 'Fiziksel delil',
  DIJITAL: 'Dijital delil',
  TANIK_IFADESI: 'Tanık ifadesi',
  KAMERA_KAYDI: 'Kamera kaydı',
  TELEFON_KAYDI: 'Telefon kaydı',
  ADLI_RAPOR: 'Adli rapor',
  BELGE: 'Belge',
  FOTOGRAF: 'Fotoğraf',
};

export function evidenceCard(ev: EvidenceDef): EvidenceCard {
  return {
    id: ev.id,
    title: ev.title,
    shortText: ev.shortText,
    description: ev.description,
    kindLabel: ev.tagLabel ?? TYPE_LABEL[ev.type],
    sourceLabel: ev.sourceLabel,
    icon: ev.icon,
    ...(ev.legalNote === undefined ? {} : { legalNote: ev.legalNote }),
  };
}

export const clueCard = (ev: EvidenceDef): ClueCard => ({
  id: ev.id,
  title: ev.title,
  sourceLabel: ev.sourceLabel,
  icon: ev.icon,
});

/** Node'un `hud` listesindeki görünür değişkenler; `low`, değer uyarı eşiğine (`display.lowAt`) inince true. */
export function hudOf(vc: ViewCtx, def: NodeDef): HudItem[] {
  const items: HudItem[] = [];
  for (const id of def.hud ?? []) {
    const v = vc.c.vars.get(id);
    const value = getOwn(vc.s.vars, id);
    if (v === undefined || v.visibility !== 'VISIBLE' || v.display === undefined || value === undefined) continue;
    const max = v.display.max ?? v.max;
    const lowAt = v.display.lowAt;
    items.push({
      id,
      label: v.display.label,
      widget: v.display.widget,
      value,
      ...(max === undefined ? {} : { max }),
      ...(lowAt === undefined || typeof value !== 'number' ? {} : { low: value <= lowAt }),
    });
  }
  return items;
}

/** Maliyet etiketi: değişkenin `display.format` şablonu (`{n}`) ya da "<tutar> <label>". */
function costLabel(vc: ViewCtx, cost: Cost): string {
  const display = vc.c.vars.get(cost.var)?.display;
  if (display?.format !== undefined) return display.format.replaceAll('{n}', String(cost.amount));
  return `${cost.amount} ${display?.label ?? cost.var}`;
}

function choiceView(vc: ViewCtx, ch: ChoiceDef): ChoiceView {
  const st = choiceStatus(vc.c, vc.s, ch);
  const available = st.enabled && st.affordable && (!st.exhausted || ch.repeat === 'NOOP');
  return {
    id: ch.id,
    kind: ch.kind as ChoiceView['kind'],
    ...(ch.group === undefined ? {} : { group: ch.group }),
    label: ch.label ?? '',
    ...(ch.description === undefined ? {} : { description: ch.description }),
    ...(ch.tags === undefined ? {} : { tags: copy(ch.tags) }),
    ...(ch.variants === undefined ? {} : { variants: ch.variants.map((v) => ({ id: v.id, label: v.label })) }),
    ...(ch.cost === undefined
      ? {}
      : { cost: ch.cost.map((k) => ({ var: k.var, amount: k.amount, label: costLabel(vc, k) })) }),
    available,
    ...(available || ch.lockedReason === undefined ? {} : { lockedReason: ch.lockedReason }),
    used: usedOnce(vc, ch.id),
    ...(ch.confirm === undefined ? {} : { confirm: ch.confirm }),
  };
}

/** Görünür oyuncu seçenekleri (kurallar, FALLBACK ve görünmez seçenekler hiç gönderilmez). */
export function choiceViews(vc: ViewCtx): ChoiceView[] {
  return vc.node.def.choices
    .filter((ch) => isPlayerChoice(ch) && choiceStatus(vc.c, vc.s, ch).visible)
    .map((ch) => choiceView(vc, ch));
}
