import { all, any, chosen, cmp, not, v } from '../../../tools/content/src/kit/index.js';
import type { CaseParts } from '../../../tools/content/src/kit/index.js';
import type { ChoiceDef, Cond, NodeDef } from '@mudafaa/case-schema';

// Çıkış kapıları: bir ziyaretin, bir çapraz sorgunun "bitir" seçeneği ancak ziyaretin asıl işi yapıldıktan sonra açılır.
// - Belge, sahne ve konuşma ziyaretleri (eylem puanı harcayanlar): en az iki inceleme, dokunuş ya da soru (seçenekleri
//   koşullu olan ya da tek cevap bekleyen konuşmalarda bir). Bir ziyaret zaman alır; tek bakışla kapı kapanmaz.
// - Çapraz sorgular (H1_04, T_03): tanığın her beyanı en az bir kez bastırılır. Bu bir usul adımıdır (CMK 201): müdafi
//   tanığın anlattığı her olguyu sorar; delil sunmak ve itiraz etmek isteğe bağlı kalır.
// Kapılar hükmü değiştirmez (hüküm kayda bağlıdır, bkz. 90-outcomes); yalnızca bir ziyaretin içi boş geçilemez.

/** Bir node'daki oyuncu seçenekleri (inceleme kuralları, sorular, ıska) toplam en az `min` kez kullanıldı mı? */
function actedIn(node: NodeDef, exitId: string, min: number): Cond {
  const ids = node.choices
    .filter((c) => c.id !== exitId && c.role !== 'BACK' && ['EXAMINE', 'OPTION', 'TOPIC', 'FALLBACK'].includes(c.kind))
    .map((c) => c.id);
  if (ids.length === 0) throw new Error(`${node.id}: kapı için seçenek yok`);
  return min === 1 ? any(...ids.map((id) => chosen(id))) : cmp({ add: ids.map((id) => ({ uses: id })) }, '>=', min);
}

interface Gate {
  exit: string;
  /** Verilmezse node'un kendi seçeneklerinden türetilir (`actedIn`, varsayılan en az iki kullanım). */
  when?: Cond;
  min?: number;
  reason: string;
  /** Sorulacak konu kalmadıysa (her TOPIC ya seçildi ya da görünmüyor) çıkış serbest. */
  orNothingLeft?: boolean;
}

/** Node'daki her TOPIC ya seçildi ya da görünmüyor mu? */
function topicsLeftNone(node: NodeDef): Cond {
  return all(
    ...node.choices
      .filter((c) => c.kind === 'TOPIC')
      .map((c) => (c.visibleWhen === undefined ? chosen(c.id) : any(chosen(c.id), not(c.visibleWhen)))),
  );
}

const LOOK = 'Belgeye en az iki kez bak (inceleme ya da karşılaştırma); tek bakışla dosya kapanmaz.';
const ASK = 'En az iki şey sor ya da dinle.';
const ASK1 = 'Önce bir şey sor ya da dinle.';
const TAP = 'Fotoğrafta en az iki yere bak.';

const GATES: Record<string, Gate> = {
  // 1. evre: sahneler (büyüteç sayacı ilk dokunuşta düşer), belgeler, konuşmalar.
  INV_ARKA: { exit: 'ARKA_BITIR', when: cmp(v('taps_a'), '<=', 3), reason: TAP },
  INV_ON: { exit: 'ON_BITIR', when: cmp(v('taps_o'), '<=', 4), reason: TAP },
  INV_BINA: { exit: 'BINA_BITIR', when: cmp(v('taps_b'), '<=', 2), reason: 'Girişte en az iki yere bak.' },
  // Görüşme: ilk ziyarette en az iki konu (konu başına 2 dk); ikinci ziyarette (8 dk) en az bir konu, sorulacak konu
  // kalmadıysa serbest (bkz. `withExitGates`, konu tükenme koşulu node'dan türetilir).
  INV_GORUSME: {
    exit: 'G_BITIR',
    when: any(cmp(v('min'), '<=', 10), all(cmp({ visits: 'INV_GORUSME' }, '>', 1), cmp(v('min'), '<', 8))),
    reason: 'Kaan karşında oturuyor. Bir şey sormadan kalkamazsın.',
    orNothingLeft: true,
  },
  INV_DEFNE: { exit: 'DF_BITIR', reason: ASK },
  INV_NESRIN: { exit: 'NS_BITIR', min: 1, reason: ASK1 },
  INV_TUTANAK: { exit: 'TUTANAK_BITIR', reason: LOOK },
  INV_KARAR: { exit: 'KARAR_BITIR', reason: LOOK },
  INV_MESAJ: { exit: 'MESAJ_BITIR', reason: LOOK },
  INV_KRIMINAL: { exit: 'KRIMINAL_BITIR', reason: LOOK },
  INV_TOLGA: { exit: 'TOLGA_BITIR', reason: LOOK },
  INV_EMANET: { exit: 'EMANET_BITIR', reason: LOOK },
  // Ara evre.
  ARA_SELIM: { exit: 'SL_BITIR', reason: ASK },
  ARA_KAAN: { exit: 'KA_BITIR', reason: ASK },
  ARA_DEFNE: { exit: 'DN_BITIR', min: 1, reason: 'Defne hatta. Bir cevap bekliyor.' },
  ARA_NESRIN: { exit: 'NS2_BITIR', reason: ASK },
  ARA_UZMAN: { exit: 'UZ_BITIR', min: 1, reason: ASK1 },
  ARA_GPS: { exit: 'GPS_BITIR', reason: LOOK },
  ARA_ZRAPOR: { exit: 'Z_BITIR', reason: LOOK },
  ARA_MUTALAA: { exit: 'MUTALAA_BITIR', reason: LOOK },
  // Çapraz sorgular: her beyan en az bir kez bastırılır.
  H1_04: {
    exit: 'H104_BITIR',
    when: all(
      chosen('PR_S1'),
      chosen('PR_S2'),
      chosen('PR_S3'),
      any(chosen('PR_S4_A'), chosen('PR_S4_B')),
      chosen('PR_S5'),
      chosen('PR_S6'),
    ),
    reason: 'Tanığın her beyanını en az bir kez sor (BASTIR); sonra çapraz sorguyu bitirebilirsin.',
  },
  T_03: {
    exit: 'T03_BITIR',
    when: all(chosen('PR_T1'), chosen('PR_T2'), chosen('PR_T3'), chosen('PR_T4'), chosen('PR_T5')),
    reason: 'Muhbirin her beyanını en az bir kez sor (BASTIR); sonra çapraz sorguyu bitirebilirsin.',
  },
};

function gate(node: NodeDef, g: Gate): NodeDef {
  const base = g.when ?? actedIn(node, g.exit, g.min ?? 2);
  const when = g.orNothingLeft === true ? any(base, topicsLeftNone(node)) : base;
  let hit = false;
  const choices: ChoiceDef[] = node.choices.map((c) => {
    if (c.id !== g.exit) return c;
    hit = true;
    return {
      ...c,
      enabledWhen: c.enabledWhen === undefined ? when : all(c.enabledWhen, when),
      lockedReason: g.reason,
    };
  });
  if (!hit) throw new Error(`${node.id}: çıkış seçeneği ${g.exit} bulunamadı`);
  return { ...node, choices } as NodeDef;
}

/** Parçalardaki node'lara çıkış kapılarını uygular; tanımlı her kapının node'u bulunmalıdır. */
export function withExitGates(parts: CaseParts): CaseParts {
  const seen = new Set<string>();
  const out: CaseParts = {};
  for (const [name, part] of Object.entries(parts)) {
    const nodes = part.nodes as NodeDef[] | undefined;
    if (nodes === undefined) {
      out[name] = part;
      continue;
    }
    out[name] = {
      ...part,
      nodes: nodes.map((n) => {
        const g = GATES[n.id];
        if (g === undefined) return n;
        seen.add(n.id);
        return gate(n, g);
      }),
    } as typeof part;
  }
  const missing = Object.keys(GATES).filter((id) => !seen.has(id));
  if (missing.length > 0) throw new Error(`Kapı node'u bulunamadı: ${missing.join(', ')}`);
  return out;
}
