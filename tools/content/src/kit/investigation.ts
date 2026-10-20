import type {
  ChoiceDef,
  Cond,
  Cost,
  DiscoveryPath,
  Effect,
  NodeDef,
  ResponseBlock,
  TriggerDef,
  VariableDef,
} from '@mudafaa/case-schema';
import { cont, rawChoice } from './choices.js';
import type { OptionSpec } from './choices.js';
import { all, cmp, discover, inc, set, v } from './expr.js';
import type { NodeSpec } from './nodes.js';
import { N } from './text.js';

// Soruşturma evresi: hub (INVESTIGATION), eylem puanlı etkinlikler, gün sonu node'u + tetikleyicisi ve gecikmeli delil
// teslimi. Dava #07'deki kalıbın aynısını üretir; birden çok evre (ör. 1. celseden önce ve sonra) ayrı değişkenlerle ya da
// aynı değişkenleri `start()` ile sıfırlayarak kurulur.

type Investigation = Extract<NodeDef, { type: 'INVESTIGATION' }>;

/** Gecikmeli teslim edilen delil: `requires` tutuyorsa `at` node'una girişte bulunur (DISCOVER + bulunma yolu). */
export interface Delivery {
  evidence: string;
  requires?: Cond;
  hint?: string;
}

/**
 * Bir node'da gecikmeli delil teslimi: node'un `onEnter`/`onFirstEnter`'ına konacak DISCOVER etkileri ve
 * `discoveryPaths`'e konacak `{source: NODE}` yolları. Motor, DISCOVER'ı yolun `requires` koşulu tutmuyorsa yok sayar.
 */
export function deliver(at: string, list: readonly Delivery[]): { effects: Effect[]; discoveryPaths: DiscoveryPath[] } {
  return {
    effects: list.map((d) => discover(d.evidence)),
    discoveryPaths: list.map((d) => ({
      evidence: d.evidence,
      source: { type: 'NODE', id: at },
      ...(d.requires === undefined ? {} : { requires: d.requires }),
      ...(d.hint === undefined ? {} : { hint: d.hint }),
    })),
  };
}

export interface PhaseSpec {
  /** Hub node'unun kimliği. */
  hub: string;
  /** Gün sonu node'unun kimliği. */
  dayEnd: string;
  /** Gün devri tetikleyicisinin kimliği. */
  trigger: string;
  /** Gün ve eylem puanı değişkenleri (görünür int; `variables()` tanımlarını üretir). */
  dayVar: string;
  apVar: string;
  /** Evredeki gün sayısı ve günlük eylem puanı. */
  days: number;
  ap: number;
  /** HUD etiketleri (varsayılan "Gün" / "Eylem puanı"). */
  dayLabel?: string;
  apLabel?: string;
}

export interface HubTab {
  id: string;
  label: string;
  kind: Investigation['tabs'][number]['kind'];
  choices: ChoiceDef[];
}

export interface HubSpec extends Omit<NodeSpec<'INVESTIGATION'>, 'tabs' | 'quickTalk'> {
  tabs: HubTab[];
  /** Hızlı konuşma kartı; `choices` seçenek kimlikleridir (sekmelerdeki seçeneklerden). */
  quickTalk?: Investigation['quickTalk'];
}

export interface DayEndSpec extends Omit<NodeSpec<'STORY'>, 'choices'> {
  /** O günün sonunda gelen deliller (bulunma yolu bu node'dan). */
  deliveries?: Delivery[];
  /** CONTINUE seçeneğinin kimliği ve etiketi. */
  continueId: string;
  continueLabel?: string;
}

/** Bir soruşturma evresinin bağlı yardımcıları. */
export interface Phase {
  spec: PhaseSpec;
  /** Gün ve eylem puanı değişken tanımları (VISIBLE, pips). */
  variables(): VariableDef[];
  /** Evreye girerken uygulanacak etkiler: gün = 1, eylem puanı = tam. */
  start(): Effect[];
  /** Hub'ın gün başlığı: gün başına bir anlatı satırı; son metin koşulsuz (son gün). */
  dayLines(texts: readonly string[]): ResponseBlock[];
  /** Eylem puanı harcayan etkinlik: NAVIGATE + `cost` + `next: {push: to}`. `once` → `maxUses: 1`. */
  activity(id: string, label: string, to: string, opts?: OptionSpec & { ap?: number; once?: boolean }): ChoiceDef;
  /** Eylem puanı harcamayan etkinlik (ör. çıkarım tahtası). */
  free(id: string, label: string, to: string, opts?: OptionSpec & { once?: boolean }): ChoiceDef;
  /** INVESTIGATION node'u: sekmelerin seçenek listeleri seçeneklerden türetilir; HUD varsayılanı [gün, eylem puanı]. */
  hub(spec: HubSpec): Investigation;
  /** Gün sonu: STORY node'u, gün devri tetikleyicisi ve teslimatların bulunma yolları. */
  dayEnd(spec: DayEndSpec): { node: NodeDef; trigger: TriggerDef; discoveryPaths: DiscoveryPath[] };
}

/** Soruşturma evresi kurar. Bütün kimlikler `spec`'tedir; yardımcılar kimlik üretmez. */
export function phase(spec: PhaseSpec): Phase {
  const pips = (id: string, label: string, initial: number, min: number, max: number): VariableDef => ({
    id,
    type: 'int',
    initial,
    min,
    max,
    visibility: 'VISIBLE',
    display: { label, widget: 'pips', max },
  });
  const nav = (id: string, label: string, to: string, opts: OptionSpec & { once?: boolean }, cost?: Cost[]) => {
    const { once, ...rest } = opts;
    return rawChoice('NAVIGATE', id, label, {
      ...(cost === undefined ? {} : { cost }),
      next: { push: to },
      ...(once === true ? { maxUses: 1 } : {}),
      ...rest,
    });
  };
  return {
    spec,
    variables: () => [
      pips(spec.dayVar, spec.dayLabel ?? 'Gün', 1, 1, spec.days),
      pips(spec.apVar, spec.apLabel ?? 'Eylem puanı', spec.ap, 0, spec.ap),
    ],
    start: () => [set(spec.dayVar, 1), set(spec.apVar, spec.ap)],
    dayLines: (texts) =>
      texts.map((text, i) =>
        i === texts.length - 1 ? { lines: [N(text)] } : { when: cmp(v(spec.dayVar), '==', i + 1), lines: [N(text)] },
      ),
    activity: (id, label, to, opts = {}) => {
      const { ap, ...rest } = opts;
      return nav(id, label, to, rest, [{ var: spec.apVar, amount: ap ?? 1 }]);
    },
    free: (id, label, to, opts = {}) => nav(id, label, to, opts),
    hub: (hubSpec) => {
      const { tabs, choices, ...rest } = hubSpec;
      return {
        id: spec.hub,
        type: 'INVESTIGATION',
        hud: [spec.dayVar, spec.apVar],
        ...rest,
        tabs: tabs.map((t) => ({ id: t.id, label: t.label, kind: t.kind, choices: t.choices.map((c) => c.id) })),
        choices: [...tabs.flatMap((t) => t.choices), ...(choices ?? [])],
      };
    },
    dayEnd: (endSpec) => {
      const { deliveries, continueId, continueLabel, onEnter, ...rest } = endSpec;
      const d = deliver(spec.dayEnd, deliveries ?? []);
      const node: NodeDef = {
        id: spec.dayEnd,
        type: 'STORY',
        lines: [{ lines: [N('Gün bitti. Gelen evrak dosyaya eklendi; yarın sabah yeni bir gün.')] }],
        ...rest,
        // Sıra Dava #07'deki gibi: teslimatlar, yazarın ek etkileri, gün + 1, eylem puanı tam.
        onEnter: [...d.effects, ...(onEnter ?? []), inc(spec.dayVar, 1), set(spec.apVar, spec.ap)],
        choices: [cont(continueId, continueLabel ?? 'Yeni güne başla', spec.hub, { role: 'PRIMARY' })],
      };
      const trigger: TriggerDef = {
        id: spec.trigger,
        scope: spec.hub,
        priority: 1,
        when: all(cmp(v(spec.apVar), '<=', 0), cmp(v(spec.dayVar), '<', spec.days)),
        goto: spec.dayEnd,
      };
      return { node, trigger, discoveryPaths: d.discoveryPaths };
    },
  };
}
