import {
  all,
  any,
  cmp,
  cont,
  conversation,
  deductionBoard,
  decisionNode,
  deliver,
  discover,
  documentExam,
  examine,
  fallback,
  flag,
  has,
  ifThen,
  inc,
  meet,
  nav,
  not,
  option,
  rawChoice,
  raise,
  recipe,
  ref,
  row,
  sceneSearch,
  score,
  set,
  story,
  tool,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef } from '../../../tools/content/src/kit/index.js';
import { B, O, W, retarget } from './dsl.js';
import { INV_POOL, boardMiss, feedbackNew, firstTime, invDecoys, invRecipes } from './inv-docs.js';
import { kemalKararNode } from './inv-people.js';
import { ARA, ARA_AP, ARA_DAYS } from './shared.js';

// 65-ara: 1. ve 2. celse arası (2 gün × 4 EP; yığınsız). Kayıtlar gelir (Kentkart, Z raporu, kayıt cihazı, sesli mesaj);
// İskele durağı gece; garson Cansu; katılan Gülay; emanette not bloğu; Emir’le görüşme; Kemal’in “ikrar” önerisi;
// ek dilekçe; tahta; Leyla; duruşmadan önceki gece ve kapıdaki tanık.

const HUB = 'ARA_HUB';

const act = (id: string, label: string, to: string, opts: Partial<ChoiceDef> & { once?: boolean } = {}): ChoiceDef => {
  const { once, ...rest } = opts;
  return rawChoice('NAVIGATE', id, label, {
    cost: [{ var: 'ara_ap', amount: 1 }],
    next: to,
    ...(once === true ? { maxUses: 1 } : {}),
    ...rest,
  });
};
const free = (id: string, label: string, to: string, opts: Partial<ChoiceDef> = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { next: to, ...opts });
const toHub = (id: string, label = 'Büroya dön') => cont(id, label, HUB, { role: 'BACK' });

const giris = deliver('ARA_GIRIS_1', [
  {
    evidence: 'ev_kentkart',
    requires: any(flag('dil_kent'), flag('h1_kent')),
    hint: 'Kentkart binişlerini dilekçeyle ya da duruşmada iste.',
  },
  {
    evidence: 'ev_dvr',
    requires: any(flag('dil_dvr'), flag('h1_dvr')),
    hint: '“Arızalı” denen kayıt cihazının incelenmesini iste.',
  },
  { evidence: 'ev_z', requires: any(flag('dil_z'), flag('h1_z')), hint: 'Kasanın Z raporunu iste.' },
  {
    evidence: 'ev_sesli',
    requires: any(flag('dil_sesli'), flag('h1_sesli')),
    hint: 'Sesli mesajın bilirkişi incelemesini iste.',
  },
]);
const son = deliver('ARA_SON_1', [
  { evidence: 'ev_kentkart', requires: flag('ara_dil_kent'), hint: 'Kentkart binişlerini ek dilekçeyle iste.' },
  { evidence: 'ev_dvr', requires: flag('ara_dil_dvr'), hint: 'Kayıt cihazının incelenmesini ek dilekçeyle iste.' },
  { evidence: 'ev_z', requires: flag('ara_dil_z'), hint: 'Z raporunu ek dilekçeyle iste.' },
]);

const exMiss = (id: string) =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle bu satırda bir şey görünmüyor.',
      label: '−20 SKOR',
      tone: 'error',
    },
  });

// --- Giriş ---

const girisNodes = [
  decisionNode('ARA_GIRIS_1', [{ to: 'ARA_GIRIS_2' }], {
    ...ARA,
    title: 'Ara',
    onEnter: [set('in_court', false), set('ara_day', 1), set('ara_ap', ARA_AP), ...giris.effects],
    lines: B(`
# BİR HAFTA SONRA · SALI 19.20 — ARSLAN HUKUK [bg:buro_gece]
> Mahkemenin yazılarına cevaplar geldi. Kurumlar mahkemeye geç kalmayı sevmez; avukatlara geç kalmayı sever.
`),
  }),
  decisionNode('ARA_GIRIS_2', [{ to: 'ARA_GIRIS' }], {
    lines: [
      W(
        flag('h1_tahliye_dayanak'),
        `
~ Başkan “yeniden değerlendirilecek” demişti. Bir ret içinde bir kapı aralığı. O kapının açılması ikinci celsede baş tanığın kürsüdeki on beş dakikasına bağlı.
`,
      ),
      O(`
~ Tutukluluk sürüyor. İkinci celsede tahliye isteyeceksem elimde bir dilekten fazlası olmalı: bir tanığın çöken saatleri, bir tasarlamanın çöken ayakları.
`),
    ],
  }),
  story('ARA_GIRIS', {
    ...ARA,
    title: 'Kayıtlar',
    background: 'buro_gece',
    lines: [
      W(
        any(has('ev_kentkart'), has('ev_dvr'), has('ev_z'), has('ev_sesli')),
        `
> Masamda bir yığın zarf. Kurum logoları, mühürler, “GİZLİ” damgaları. Leyla’nın kapısı kapalıydı; ışığı yanıyordu.
~ Bir zarf bir kapıdır. İçinde ne olduğunu bilmeden açarsın; açtıktan sonra kapatamazsın.
> Zarfları tek tek dizdim. Her birinin içinde bir makinenin hafızası vardı: bir kart okuyucu, bir kasa, bir kayıt cihazı, bir telefon.
~ İnsanlar unutur, yanılır, korkar. Makineler unutmaz. Ama makinelerin hafızasını da bir insan okur; bu gece o insan benim.
> Telefon titredi. Meral: “Emir ilk celseden sonra uyuyabilmiş. Gardiyan söyledi. Allah razı olsun.”
`,
      ),
      O(`
> Masam boştu. Gelen bir zarf yoktu; çünkü istenmiş bir şey yoktu.
~ Bir dilekçe yazmadım. Duruşmada da istemedim. Şimdi elimde savcının kâğıtları ve kendi aklım var.
> Leyla’nın kapısı kapalıydı; ışığı yanıyordu. Telefon titredi. Meral: “Emir uyuyamıyormuş. Gardiyan söyledi.”
~ Üç hafta. Kayıtları ek bir dilekçeyle hâlâ isteyebilirim; ama her gün bir gün.
`),
    ],
    choices: [cont('ARA_GIRIS_DEVAM', 'Masaya otur', HUB, { role: 'PRIMARY' })],
  }),
];

// --- Hub ---

const hubTabs = [
  {
    id: 't_ara_kayit',
    label: 'KAYITLAR',
    kind: 'ARCHIVE' as const,
    choices: [
      act('A_KENT', 'Kentkart dökümünü incele', 'ARA_KENT', {
        once: true,
        description: 'BURULAŞ cevabı',
        visibleWhen: has('ev_kentkart'),
      }),
      act('A_Z', 'Z raporunu incele', 'ARA_Z', { once: true, description: 'Mali hafıza', visibleWhen: has('ev_z') }),
      act('A_DVR', 'Kayıt cihazı raporunu oku', 'ARA_DVR', {
        once: true,
        description: 'Bilirkişi raporu',
        visibleWhen: has('ev_dvr'),
      }),
      act('A_SESLI', 'Sesli mesaj raporunu oku', 'ARA_SESLI', {
        once: true,
        description: 'Ses bilirkişisi',
        visibleWhen: has('ev_sesli'),
      }),
      act('A_EMANET', 'Emanette not bloğunu incele', 'ARA_EMANET', {
        once: true,
        description: 'Mahkeme izni · kâtip huzurunda',
        visibleWhen: has('clue_not_bloku'),
      }),
      act('A_DIL', 'Ek delil talebi', 'ARA_DIL', {
        description: '2 talep hakkı',
        visibleWhen: not(flag('ara_dil_verildi')),
      }),
      free('A_CIKARIM', 'Çıkarım tahtası', 'ARA_CIKARIM', {
        description: '0 EP · ipuçlarını birleştir',
        enabledWhen: ref('kart2'),
        lockedReason: 'En az 2 ipucu gerekli.',
      }),
      free('A_LEYLA', 'Leyla’ya danış', 'ARA_LEYLA', {
        description: '0 EP · günde bir kez',
        visibleWhen: cmp(v('leyla_ara'), '<', v('ara_day')),
        effects: [set('leyla_ara', v('ara_day'))],
      }),
    ],
  },
  {
    id: 't_ara_insan',
    label: 'İNSANLAR',
    kind: 'PEOPLE' as const,
    choices: [
      act('A_EMIR', 'Emir’le görüş', 'ARA_EMIR_G', { once: true, description: 'İlk celseden sonra' }),
      act('A_CANSU', 'Cansu Güler', 'ARA_CANSU', { once: true, description: 'Garson · o gece erken çıktı' }),
      act('A_GULAY', 'Gülay Toker', 'ARA_GULAY', { once: true, description: 'Katılan · maktulün eşi' }),
      act('A_KEMAL', 'Kemal’le konuş', 'ARA_KEMAL', { once: true, description: 'Hamitler · vardiya öncesi' }),
    ],
  },
  {
    id: 't_ara_yer',
    label: 'OLAY YERİ',
    kind: 'SCENE' as const,
    choices: [
      act('A_DURAK', 'İskele durağı · gece', 'ARA_DURAK_G', {
        once: true,
        description: 'Son 1/M · 23.52',
      }),
    ],
  },
];

const hub = {
  id: HUB,
  type: 'INVESTIGATION' as const,
  ...ARA,
  title: 'Ara · üç hafta',
  background: 'buro' as const,
  hud: ['ara_day', 'ara_ap'],
  lines: [
    W(
      cmp(v('ara_day'), '==', 1),
      `
# ARA · GÜN 1/2 · İKİNCİ CELSEYE 14 GÜN
> Hedef: baş tanık ikinci celsede kürsüde olacak. Onun saatlerini makinelerin saatleriyle yan yana koy.
`,
    ),
    O(`
# ARA · GÜN 2/2 · İKİNCİ CELSEYE 6 GÜN
> Hedef: kim, ne gördü, ne zaman? Kürsüye neyle, hangi sırayla çıkacaksın?
`),
  ],
  tabs: hubTabs.map((t) => ({ id: t.id, label: t.label, kind: t.kind, choices: t.choices.map((c) => c.id) })),
  scenePreview: { scene: 'sc_durak' },
  choices: [
    ...hubTabs.flatMap((t) => t.choices),
    nav('A_DURUSMA', 'DURUŞMAYA GİT · 2. CELSE', 'ARA_SON_1', {
      role: 'PRIMARY',
      confirm: 'Duruşmaya gidersen ara evresi biter. Emin misin?',
    }),
  ],
};

// --- Belgeler ---

const kent = retarget(
  documentExam('ARA_KENT', {
    ...ARA,
    title: 'Kentkart biniş dökümü',
    hud: ['ex_kent'],
    background: 'buro',
    lines: B(`
> BURULAŞ’ın cevabı tek sayfa. Bir kartın bir haftası: sabah işe, gece eve. Bir hayatın ritmi, kuruşlarla.
`),
    header: { left: 'BURULAŞ · KİŞİSELLEŞTİRİLMİŞ KART · E. YALÇIN', right: '13–15.11' },
    columns: [
      { label: 'TARİH · SAAT', flex: 1.1 },
      { label: 'HAT · DURAK', flex: 1.8 },
    ],
    rows: [
      row('k1', ['13.11 23.49.05', '1/M · Mudanya İskele']),
      row('k2', ['14.11 07.48.30', '1/M · Emek → Mudanya']),
      row('k3', ['14.11 23.52.40', '1/M · Mudanya İskele']),
      row('k4', ['15.11 00.41.12', 'Metro · Emek']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Baş tanığın ifadesiyle karşılaştır', 'compare')],
    costVar: 'ex_kent',
    rules: [
      examine('EX_K_K3', 'compare', 'k3', {
        discovers: 'clue_kent',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · 23.52',
          text: 'Kart 23.52.40’ta İskele durağında okunmuş. Baş tanığa göre o saatten üç dakika sonra sanık ofisten elinde bıçakla koşarak çıkıyor.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
        responses: B(`
~ Bir kart okuyucunun saati ile bir tanığın saati. Okuyucunun bir çıkarı yok.
`),
      }),
      examine('EX_K_K4', 'mag', 'k4', {
        score: { DELIL_ANALIZI: 40 },
        effects: [raise('fact_metro')],
        feedback: {
          title: '00.41 · EMEK',
          text: 'Otobüs Emek’e 00.35 gibi varır; kart 00.41’de metroda. Arada geri dönen bir yolculuk yok.',
          label: '+40 SKOR',
          tone: 'neutral',
        },
      }),
      examine('EX_K_K1', 'mag', 'k1', {
        score: { DELIL_ANALIZI: 20 },
        feedback: {
          title: 'BİR ÖNCEKİ GECE',
          text: 'Bir gece önce 23.49’da aynı durak. Her gece son otobüs; bir alışkanlık.',
          label: '+20 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: exMiss('FB_KENT'),
    finish: { id: 'KENT_BITIR' },
  }),
  HUB,
);

const zRapor = retarget(
  documentExam('ARA_Z', {
    ...ARA,
    title: 'Kasa Z raporu ve POS dökümü',
    hud: ['ex_z'],
    background: 'buro',
    lines: B(`
> Gelir İdaresi’nin mali hafıza çıktısı: termal kâğıdın fotokopisi, saat damgaları, toplamlar. Bir meyhanenin bir gecesi, kuruşu kuruşuna.
`),
    header: { left: 'YAZAR KASA · MALİ HAFIZA · TOKER BALIK', right: '14.11' },
    columns: [
      { label: 'KAYIT', flex: 1.2 },
      { label: 'SAAT', flex: 0.8 },
      { label: 'AÇIKLAMA', flex: 1.6 },
    ],
    rows: [
      row('z1', ['Son POS işlemi', '23.21.08', 'Nişan masası · kredi kartı']),
      row('z2', ['Z raporu no 2231', '23.48.11', 'Gün sonu · kasa kapanışı']),
      row('z3', ['Kasa çekmecesi', '23.48.14', 'Açıldı']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Baş tanığın ifadesiyle karşılaştır', 'compare')],
    costVar: 'ex_z',
    rules: [
      examine('EX_Z_Z2', 'compare', 'z2', {
        discovers: 'clue_z',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · 23.48',
          text: 'Gün sonu raporu 23.48.11’de basılmış. Tanığa göre o, 23.55’ten 00.15’e kadar kasada sayım yapıyordu.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_Z_Z3', 'mag', 'z3', {
        score: { DELIL_ANALIZI: 30 },
        feedback: {
          title: 'ÇEKMECE',
          text: 'Raporun üç saniye ardından çekmece açılmış; para alınmış. Sayım bitmiş, kasa kapanmış.',
          label: '+30 SKOR',
          tone: 'neutral',
        },
      }),
      examine('EX_Z_Z1', 'mag', 'z1', {
        score: { DELIL_ANALIZI: 10 },
        feedback: { title: '23.21', text: 'Son müşteri 23.21’de ödedi.', label: '+10 SKOR', tone: 'neutral' },
      }),
    ],
    miss: exMiss('FB_Z'),
    finish: { id: 'Z_BITIR' },
  }),
  HUB,
);

const dvr = retarget(
  documentExam('ARA_DVR', {
    ...ARA,
    title: 'Kayıt cihazı teknik raporu',
    hud: ['ex_dvr'],
    background: 'buro',
    lines: B(`
> Bilişim bilirkişisinin raporu: dört sayfa, bir şema, bir tablo. Bir kutunun anlattıkları.
`),
    header: { left: 'BİLİRKİŞİ RAPORU · DVR OLAY GÜNLÜĞÜ', right: '11–14.11' },
    columns: [
      { label: 'ZAMAN', flex: 1.2 },
      { label: 'OLAY', flex: 2 },
    ],
    rows: [
      row('d1', ['11.11 00.00 – 14.11 23.44', 'Sürekli kayıt · 4 kanal · hata yok']),
      row('d2', ['14.11 23.44.10', 'GÜÇ KESİNTİSİ (harici) · UPS yok']),
      row('d3', ['Disk', 'Sağlık kritik · görüntüler kurtarılamadı']),
      row('d4', ['Servis kaydı', 'Son servis çağrısı: 03.06']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Baş tanığın ifadesiyle karşılaştır', 'compare')],
    costVar: 'ex_dvr',
    rules: [
      examine('EX_D_D1', 'compare', 'd1', {
        discovers: 'clue_dvr',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · KESİNTİSİZ',
          text: '“Üç gündür arızalı” denen cihaz üç gündür kesintisiz kayıt yapıyordu. 23.44.10’da elektriği gitti; harici. Bir fiş.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_D_D4', 'mag', 'd4', {
        score: { DELIL_ANALIZI: 30 },
        feedback: {
          title: 'SERVİS',
          text: 'Son servis çağrısı mart ayında. Kasımda servis çağrılmamış.',
          label: '+30 SKOR',
          tone: 'neutral',
        },
      }),
      examine('EX_D_D3', 'mag', 'd3', {
        score: { DELIL_ANALIZI: 10 },
        feedback: {
          title: 'DİSK',
          text: 'Görüntü yok. Disk eski; üç ayda bir kenarda, nemli bir rafta. Günlük ayrı bir yongada tutulur; o sağlam.',
          label: '+10 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: exMiss('FB_DVR'),
    finish: { id: 'DVR_BITIR' },
  }),
  HUB,
);

const sesli = retarget(
  documentExam('ARA_SESLI', {
    ...ARA,
    title: 'Sesli mesaj bilirkişi raporu',
    hud: ['ex_sesli'],
    background: 'buro_gece',
    lines: B(`
> Bilirkişinin raporu ince; ama ekinde bir CD ve bir dalga formu çıktısı var. Bir ölünün sesi, frekanslara bölünmüş.
`),
    header: { left: 'SES VE GÖRÜNTÜ BİLİRKİŞİSİ · KEMAL YALÇIN HATTI', right: '14.11 23.58' },
    columns: [
      { label: 'İNCELEME', flex: 1.2 },
      { label: 'BULGU', flex: 2 },
    ],
    rows: [
      row('s1', ['Kayıt başlangıcı', '14.11.2025 23.58.07 (operatör kaydıyla uyumlu)']),
      row('s2', ['Ses karşılaştırması', 'Maktulün kayıtlı sesleriyle yüksek uyum']),
      row('s3', ['Kurgu / kesinti', 'Tespit edilmedi']),
      row('s4', ['Son dört saniye', 'Kapı sesi; ikinci bir kişinin kısa sözü (anlaşılamadı)']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Kentkart saatiyle karşılaştır', 'compare')],
    costVar: 'ex_sesli',
    rules: [
      examine('EX_S_S1', 'compare', 's1', {
        effects: [ifThen(not(has('clue_sesli')), [discover('clue_sesli')]), raise('fact_sesli_saat')],
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'SAAT',
          text: '23.58.07: maktul konuşuyor. Bir kart okuyucuya göre sanık o saatte iskeleden kalkmış bir otobüsün içinde.',
          label: '+150 SKOR',
          tone: 'special',
        },
      }),
      examine('EX_S_S4', 'mag', 's4', {
        score: { DELIL_ANALIZI: 60 },
        effects: [raise('fact_ikinci_ses')],
        feedback: {
          title: 'İKİNCİ SES',
          text: 'Bir kapı ve kısa bir söz. Bilirkişi kime ait olduğunu söyleyemiyor; kelimeyi de. Ama bir ses var; ve sanık o odada değil.',
          label: '+60 SKOR',
          tone: 'success',
        },
      }),
      examine('EX_S_S3', 'mag', 's3', {
        score: { DELIL_ANALIZI: 30 },
        feedback: { title: 'KURGU YOK', text: 'Kayıt kesintisiz, tek parça.', label: '+30 SKOR', tone: 'neutral' },
      }),
    ],
    miss: exMiss('FB_SESLI'),
    finish: { id: 'SESLI_BITIR' },
  }),
  HUB,
);

const emanet = retarget(
  documentExam('ARA_EMANET', {
    ...ARA,
    title: 'Emanette not bloğu',
    hud: ['ex_emanet'],
    background: 'adliye',
    lines: B(`
# ADLİYE — EMANET BÜROSU [bg:adliye]
> Başkanın izin yazısı, bir kâtip, bir eldiven, bir masa lambası. Emanet memuru torbayı açtı; içinden spiralli bir not bloğu çıktı.
@EMANET MEMURU: Dokunmak yok. Kâtip hanım yazar, siz bakarsınız. On beş dakika.
~ Bir alet seç, sonra sayfaya dokun. Koparılmış bir sayfa, altındaki sayfaya bir iz bırakır; kalemin bastırdığı kadar.
`),
    header: { left: 'EMANET · DELİL NO 14 · NOT BLOĞU', right: 'inceleme tutanağı' },
    columns: [
      { label: 'SAYFA', flex: 1 },
      { label: 'GÖRÜNÜM', flex: 2.2 },
    ],
    rows: [
      row('b1', ['Üst', 'Koparılmış · spiralde kırpıntı']),
      row('b2', ['İkinci sayfa', 'Boş görünüyor'], {
        isik: {
          cells: ['İkinci sayfa', '“Kemal… o terazi senin değildi… dolap benimdi, mal T…ık’ın… susan bendim… yarın…”'],
          tone: 'special',
        },
      }),
      row('b3', ['Kalem', 'Kurşun kalem · ucu sert, bastırılarak yazılmış']),
      row('b4', ['Arka kapak', 'Bir telefon numarası: 0532 *** ** 17']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('isik', 'Yan ışık', 'uv', 'UV')],
    costVar: 'ex_emanet',
    rules: [
      examine('EX_E_B2', 'isik', 'b2', {
        discovers: ['clue_iz', 'ev_iz_yazisi'],
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · İZ YAZISI',
          text: 'Lamba yana yatınca kâğıdın kabartıları gölge verdi. Kâtip kelimeleri tek tek tutanağa geçirdi: “…terazi senin değildi… dolap benimdi, mal T…ık’ın… susan bendim…”',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
        responses: B(`
~ Bir mektubun gölgesi. Mektubun kendisi o gece bir masadan kalktı. Birinin cebine, birinin sobasına.
~ “T…ık.” İki harf ve bir boşluk. Bir boşluğa bir ad yazmak kolaydır; bir mahkemede kanıtlamak zordur.
`),
      }),
      examine('EX_E_B4', 'mag', 'b4', {
        score: { DELIL_ANALIZI: 30 },
        feedback: {
          title: 'NUMARA',
          text: 'Arka kapakta Kemal Yalçın’ın numarası, kalemle, üç kez üstünden geçilmiş. Aylarca aranmış bir numara.',
          label: '+30 SKOR',
          tone: 'neutral',
        },
      }),
      examine('EX_E_B1', 'mag', 'b1', {
        score: { DELIL_ANALIZI: 10 },
        feedback: {
          title: 'KIRPINTI',
          text: 'Sayfa aceleyle koparılmış; spiralde üç diş kalmış.',
          label: '+10 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: exMiss('FB_EMANET'),
    finish: { id: 'EMANET_BITIR', label: 'Torbayı memura ver' },
  }),
  HUB,
);

// --- İskele durağı ---

const durakGiris = decisionNode('ARA_DURAK_G', [{ to: 'ARA_DURAK' }], {
  ...ARA,
  title: 'İskele durağı',
  lines: B(`
# PERŞEMBE 23.30 — MUDANYA [bg:liman_gece]
> Toker Balık’ın arka kapısında durdum; saat 23.40’ı gösterdiğinde yürümeye başladım. Ellerim cebimde, başım önde, yağmurun içinden.
> Balıkçı barınağı, kapalı bir simitçi, iki sokak lambası. Denizin kokusu, yosun, mazot.
> Durağa vardığımda telefonumun kronometresi dokuz dakika on saniye gösteriyordu. Son otobüs henüz gelmemişti; çizelgeye göre 23.52.
~ Bir çocuk o gece bu yolu koşarak geldi. Ben yürüdüm. İkimiz de otobüse yetiştik.
`),
});

const durak = retarget(
  sceneSearch('ARA_DURAK', {
    ...ARA,
    title: 'Mudanya İskele durağı',
    hud: ['taps4'],
    exposeCounts: true,
    scene: 'sc_durak',
    background: 'liman_gece',
    instruction: 'Durakta dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
    costVar: 'taps4',
    miss: fallback('FB_DURAK', 'TAP', {
      score: { ARASTIRMA: -10 },
      feedback: { text: 'Islak bir kaldırım. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
    }),
    finish: { id: 'DURAK_BITIR', label: 'Otobüse bin' },
  }),
  HUB,
);

// --- Cansu ---

const cansu = conversation('ARA_CANSU', {
  ...ARA,
  title: 'Cansu Güler',
  background: 'kafe',
  room: { label: 'MUDANYA · İSKELE KAFE', character: 'cansu' },
  onFirstEnter: [meet('cansu')],
  lines: B(`
# CUMA 15.10 — MUDANYA, İSKELE KAFE [bg:kafe]
> Cansu Güler artık Toker Balık’ta çalışmıyordu; iskelenin öbür ucundaki bir kafede tepsi taşıyordu. Molasında karşıma oturdu, telefonunu masaya ters koydu.
cansu: Beş dakika abla. Patron kızar. Bu da patron; her yerde bir patron var.
cansu: Ben bir şey görmedim ki. Erkenden çıktım. Polis de sormadı zaten; kimse garsona soru sormaz, garson soru sorar: “Başka bir şey?”
cansu: Bir de abla, ben Toker’den çıktım. O geceden sonra duramadım. Mutfağa girince Ercan abinin ofisinin kapısına bakıyordum; hep kapalı.
cansu: Tarık abi “kal” dedi, maaşı artırdı bile. Kalmadım. Bilmiyorum neden. Bir şey içimi sıktı.
~ Hızlı, alaycı, korkmuş. Telefonunu ters koyan biri bir şey saklar; ya da bir şeyin ona bakmasından korkar.
`),
  choices: [
    option('CQ_ERKEN', '“O gece kaçta çıktınız?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('fact_cansu_erken')],
      responses: B(`
cansu: 23.25. Tarık abi “sen çık kızım, kasayı ben kapatırım” dedi. Normalde kasayı ben kapatırım, o kontrol eder. O gece tersini yaptı.
cansu: Ben de sevindim açıkçası; yüz yirmi kişi, ayaklarım şişmişti. Şimdi sevindiğime üzülüyorum.
`),
    }),
    option('CQ_FOTO', '“O geceden telefonunuzda fotoğraf var mı?”', {
      score: { SORGULAMA: 30 },
      effects: [
        ifThen(not(flag('tarik_uyarildi')), [
          discover('ev_cansu_foto'),
          discover('clue_lacivert'),
          score('ARASTIRMA', 60),
        ]),
      ],
      responses: [
        W(
          flag('tarik_uyarildi'),
          `
cansu: Vardı. Sildim. Geçen hafta Tarık abi aradı; “polis telefonuna bakarsa nişan fotoğrafları falan, uğraşma” dedi. Sildim işte.
> Telefonunu çevirdi, galeriyi açtı, bana gösterdi: boş bir klasör. Sonra durdu.
cansu: “Son silinenler”de olabilir ama. Otuz gün tutuyor.
`,
        ),
        O(`
cansu: Nişan masasının fotoğrafını çektim, pastayı keserlerken. Gelin istedi; ben de çektim, gönderdim.
> Telefonu çevirdi. Bir masa, bir pasta, gülen yüzler. Arkada, mutfak kapısının önünde, Tarık Sezer; koyu lacivert, uzun kollu bir gömlek. Fotoğrafın bilgisi: 14.11, 23.12.
cansu: Bunu mu istiyorsunuz? Alın. Ne olacak ki bundan?
~ Bir nişan fotoğrafı. Kimse onun arkasındaki adama bakmaz; pastaya bakar.
`),
      ],
    }),
    option('CQ_SILINEN', '“Son silinenlere bakalım.”', {
      visibleWhen: all(flag('tarik_uyarildi'), not(has('ev_cansu_foto'))),
      discovers: ['ev_cansu_foto', 'clue_lacivert'],
      score: { ARASTIRMA: 40 },
      responses: B(`
> Cansu “Son silinenler”i açtı. Yirmi üç fotoğraf. Biri nişan masası: pasta, gelin, gülen yüzler. Arkada Tarık Sezer, koyu lacivert bir gömlekle. 23.12.
cansu: Bunu… bunu neden silmemi istedi ki?
~ Neden, diye soruyor. Ben de soruyorum. Cevabı bir fotoğrafın arka planında duruyor olabilir.
`),
    }),
    option('CQ_PERSEMBE', '“Ercan Bey ile Tarık Bey arasında bir sorun var mıydı?”', {
      visibleWhen: any(flag('fact_muhasebe'), has('clue_z'), has('clue_dvr'), flag('fact_hesaplar')),
      score: { SORGULAMA: 40 },
      effects: [raise('fact_fatura')],
      responses: B(`
cansu: Perşembe akşamı. Ofisten bağırış geldi. Ercan abi bağırmaz; o gece bağırdı. “Sezer Gıda’nın faturaları ne?” dedi. “Pazartesi muhasebeciye gidiyoruz” dedi.
cansu: Tarık abi çıktı ofisten, yüzü kireç gibi. Bana “sen bir şey duymadın” dedi, gülerek. Ben de bir şey duymadım. Şimdi duydum mu?
~ Sezer Gıda. Bir tedarikçinin adı ve bir ortağın soyadı. Bir pazartesi randevusu; o pazartesi gelmedi.
`),
    }),
    cont('CANSU_KARAR', 'Mahkemeyi konuş', 'ARA_CANSU_K', { role: 'PRIMARY', enabledWhen: has('ev_cansu_foto') }),
    toHub('CANSU_BITIR', 'Teşekkür et, çık'),
  ],
});

const cansuKarar = conversation('ARA_CANSU_K', {
  ...ARA,
  title: 'Cansu Güler',
  background: 'kafe',
  room: { label: 'MUDANYA · İSKELE KAFE', character: 'cansu' },
  lines: B(`
cansu: Mahkemeye mi çağıracaksınız beni? Abla ben bu işi kaybedersem kiramı ödeyemem. Bir de… Tarık abi Mudanya’da herkesi tanır.
`),
  choices: [
    option('CK_TANIK', '“Tanık olarak bildireceğim. Gördüğünüzü anlatırsınız.”', {
      score: { USUL_BILGISI: 50 },
      effects: [raise('cansu_tanik')],
      good: 'Fotoğrafı çeken ve o geceki değişikliği bilen kişiyi tanık olarak bildirdin; fotoğrafın kaynağı duruşmada sınanabilir (CMK 177–178).',
      category: 'USUL_BILGISI',
      responses: B(`
- Sizi tanık olarak bildireceğim Cansu Hanım. Fotoğrafı ne zaman çektiğinizi, o gece kaçta çıktığınızı anlatırsınız. O kadar.
cansu: O kadar mı? Peki. Saat, fotoğraf, kasa. Bunları söylerim. Gerisini siz söylersiniz.
`),
      next: HUB,
    }),
    option('CK_IS', '“İşinizi kaybederseniz size iş bulurum; yeter ki mahkemeye gelin.”', {
      effects: [inc('ethics'), raise('cansu_vaat'), raise('cansu_tanik'), score('SAVUNMA_STRATEJISI', -50)],
      bad: 'Tanığa tanıklığı karşılığında menfaat vaat ettin: meslek kurallarına aykırıdır (Av.K. 34) ve tanığı etkileme olarak değerlendirilebilir (TCK 277). Karşı taraf bunu duyarsa tanıklık değersizleşir.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- İşinizi kaybederseniz size iş bulurum. Tanıdığım çok. Yeter ki gelin.
cansu: Sahi mi? Tamam o zaman. Gelirim.
~ Bir tanığa bir iş vaat ettim. Bir savcı bunu öğrenirse tanığın her cümlesi bir maaş bordrosuna dönüşür.
`),
      next: HUB,
    }),
    option('CK_FOTO', '“Yalnızca fotoğrafı sunarım; size gerek yok.”', {
      neutral: 'Fotoğraf tek başına da bir belgedir; ama çekeni dinlenmezse kaynağı ve saati tartışmaya açık kalır.',
      responses: B(`
- Size yük olmasın. Yalnızca fotoğrafı sunarım.
cansu: Sağ olun abla. Gerçekten.
`),
      next: HUB,
    }),
  ],
});

// --- Gülay ---

const gulay = conversation('ARA_GULAY', {
  ...ARA,
  title: 'Gülay Toker',
  background: 'ev',
  room: { label: 'GÜZELYALI · TOKER EVİ', character: 'gulay' },
  lines: B(`
# CUMARTESİ 11.00 — GÜZELYALI [bg:ev]
> Denize bakan bir apartman dairesi. Kapıyı Gülay Toker açtı; siyahlar içinde, saçları toplanmış. Beni görünce kapıyı kapatmak istedi; kapatmadı.
gulay/kizgin: Siz. Katilin avukatı. Ne cesaret. Avukatım “konuşma” dedi; ben de konuşmayacağım.
> Ama kapıyı da kapatmadı. Arkasında bir salon; duvarda bir düğün fotoğrafı, bir de Ercan’ın gülümsediği bir vesikalık, siyah kurdeleli.
gulay: Beş dakika. Kocamın evinde, kocamın fotoğrafının önünde, beş dakika. Sonra gidersiniz.
`),
  choices: [
    option('GQ_TAZIYE', '“Başınız sağ olsun. Ercan Bey’i anlatır mısınız?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('gulay_yumusadi')],
      responses: B(`
gulay/uzgun: Üç yıldır içmiyordu. Bir sabah kalktı, “bitti” dedi. Bitti. Her pazartesi bir toplantıya gidiyordu; ayık kalanların toplantısı.
gulay: Orada bir şey öğrenmiş: borçlarını ödemek. Para borcu değil. Eski borçlar. “Birine borcum var Gülay” dedi. Kime, söylemedi.
`),
    }),
    option('GQ_MEKTUP', '“Son haftalarda neyle meşguldü?”', {
      score: { SORGULAMA: 40 },
      discovers: 'clue_mektup_kayip',
      responses: B(`
gulay: Mektup yazıyordu. Geceleri, ofiste. Kurşun kalemle; “silebileyim” diyordu, sonra silmiyordu. Eski bir arkadaşına.
gulay: Polis eşyalarını geri verdi. Cüzdan, saat, anahtarlar. Mektup yoktu. Sordum; “olay yerinde kâğıt yok” dediler.
> Duvardaki vesikalığa baktı. Kurdeleyi düzeltti.
gulay: Kime yazıyordu, bilmiyorum. Belki o çocuğun babasına. Belki o yüzden öldü. Bilmiyorum.
`),
    }),
    option('GQ_TARIK', '“Ercan Bey ile ortağı arasında bir sorun var mıydı?”', {
      visibleWhen: flag('gulay_yumusadi'),
      score: { SORGULAMA: 20 },
      effects: [raise('fact_hesaplar')],
      responses: B(`
gulay: Tarık mı? On altı yıllık ortak. Düğünümüzde sağdıçtı. Son ay az konuşuyorlardı; Ercan “hesaplar tutmuyor” diyordu. Meyhane hesabı işte.
gulay/kizgin: Ne ima ediyorsunuz? Tarık o gece kocamı kollarında buldu. Siz şimdi de onu mu suçlayacaksınız? Katilin avukatısınız, unutmayın.
`),
    }),
    option('GQ_SERT', '“Kocanız o çocuğu ofise neden çağırdı, biliyor musunuz?”', {
      score: { SORGULAMA: -30 },
      bad: 'Yas tutan katılana, maktulü suçlar gibi bir soru sordun; konuşmayı bitirdin.',
      category: 'SORGULAMA',
      responses: B(`
gulay/kizgin: Çağırdı mı? Ne demek çağırdı? Kocam kimseyi çağırmazdı gece yarısı! Çıkın evimden!
> Kapı arkamdan kapandı. Merdivende bir komşu kapısı aralandı, kapandı. {shake}
`),
      next: HUB,
    }),
    toHub('GULAY_BITIR', 'Teşekkür et, çık'),
  ],
});

// --- Emir ---

const emirGiris = decisionNode('ARA_EMIR_G', [{ to: 'ARA_EMIR' }], {
  ...ARA,
  title: 'Emir',
  lines: B(`
# CEZAEVİ — AVUKAT GÖRÜŞ ODASI [bg:gorus_odasi]
> Cemil kapıyı açarken bir şey söyledi: “İlk celseden sonra yemek yemeye başladı.” Söylemesi gerekmeyen bir şey.
`),
});

const emir = conversation('ARA_EMIR', {
  ...ARA,
  title: 'Emir',
  background: 'gorus_odasi',
  room: { label: 'CEZAEVİ · GÖRÜŞ ODASI', character: 'emir' },
  lines: [
    W(
      flag('kemal_teklif'),
      `
> Emir bu kez oturmadı. Masanın kenarına tutundu.
emir: Babam dün görüşe geldi abla. İlk kez. Camın arkasından. Bir şey söyledi.
emir: “Yaptım de” dedi. “Tahrik oldum de. On iki yıl. Müebbetten iyidir.” Ağlıyordu. Babam ağlamaz.
emir: Sen ne dersin abla? Sen ne dersen onu yapacağım.
~ Yirmi iki yıl önce bir avukat bir çocuğa bir şey söyledi. Şimdi bir çocuk, bir avukata, aynı soruyu soruyor.
`,
    ),
    O(`
> Emir oturdu. İlk celseden sonra yüzüne bir renk gelmişti.
emir: Süleyman Abi geldi abla. Kürsüye çıktı. “Elleri boştu” dedi. Kimse sormamış ona. Sen sordun.
emir: Babam… babam salonun arkasındaydı. Leyla Hanım da. Babam ona bir şey dedi merdivende, gördüm camdan. Ne dedi?
`),
  ],
  choices: [
    option('AE_DOGRU', '“Yapmadıysan yaptım deme. Ne baban için, ne benim için; kimse için.”', {
      visibleWhen: flag('kemal_teklif'),
      score: { SAVUNMA_STRATEJISI: 100 },
      effects: [raise('emir_kararli'), inc('trust', 10)],
      good: 'Masumiyetini söyleyen müvekkili gerçeğe aykırı bir ikrardan uzak tuttun; savunmanın yönünü müvekkilin gerçeği belirler (Av.K. 34; CMK 147/1-e: susma ve kendini suçlamama hakkı).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Emir. Yapmadıysan “yaptım” deme. Ne baban için, ne annen için, ne benim için.
- Bir insan yapmadığı bir şeyi ikrar ettiğinde, o ikrar onu ömür boyu takip eder. Babana sor. Babanın yirmi iki yılına sor.
emir/uzgun: Babam da mı… babam da mı öyle yaptı?
- Bunu ona sen sor. Ben söyleyemem.
> Emir uzun süre konuşmadı. Sonra sol eliyle masanın vidasına dokundu.
emir: Yaptım demem abla. Yapmadım.
`),
      next: HUB,
    }),
    option('AE_IKRAR', '“İkrar edersen tahrikle on iki yıl… müebbetten iyidir. Düşün.”', {
      visibleWhen: flag('kemal_teklif'),
      effects: [inc('ethics', 2), raise('ikrar_onerisi'), score('SAVUNMA_STRATEJISI', -200)],
      bad: 'Masum olduğunu söyleyen müvekkiline gerçeğe aykırı bir ikrarı önerdin. Bu, avukatın doğruluk ve özen yükümlülüğüne aykırıdır (Av.K. 34) ve yirmi iki yıl önce Kemal’e söylenen cümlenin aynısıdır.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Emir… Haksız tahrik kabul edilirse on iki yıl. İyi hâlle daha az. Müebbet bir ömür. Düşün.
> Emir bana baktı. Gözlerinde bir şey söndü; yavaş yavaş, bir mutfak ocağının alevi gibi.
emir: Sen de mi abla?
emir: Peki. Düşünürüm. Babam da düşünmüş herhalde.
~ Leyla’nın masasındaki çerçeve. Şimdi neden ters durduğunu biliyorum. Ve bu gece kendi masamda bir yer açıldığını.
`),
      next: HUB,
    }),
    option('AE_SEN', '“Karar senin. Ben sana yalnızca sonuçlarını anlatabilirim.”', {
      visibleWhen: flag('kemal_teklif'),
      neutral:
        'Müvekkile hukuki sonuçları anlatmak meşrudur; ama masumiyetini söyleyen birine bir ikrarı “seçenek” diye sunmak, o seçeneğin ağırlığını ona yükler.',
      responses: B(`
- Karar senin Emir. Ben yalnızca sonuçlarını anlatırım: ikrar edersen…
emir: Yapmadım abla. Yapmadığım şeyi nasıl anlatayım? Hangi elimle, kaç kere, nereye? Ben bilmiyorum ki.
~ Bir çocuk, bir yalanı anlatamayacağını söyledi. Bu, bu dosyada duyduğum en güçlü savunmaydı.
`),
      next: HUB,
    }),
    option('AE_BABA', '“Babanla Leyla Hanım’ın arasında eski bir hesap var.”', {
      visibleWhen: not(flag('kemal_teklif')),
      score: { SORGULAMA: 20 },
      effects: [inc('trust', 5)],
      responses: B(`
emir: Yirmi iki yıl önce… onun avukatı mıydı? Babam hiç söylemedi.
emir: Ercan abi de bir şey söyledi o gece. “Avukatı da inanmadı ona” dedi. O kadın mı?
- O kadın, bu dosyayı okuyan ilk kişiydi. Bana verdi.
emir: Babam bilse kızar. Bilsin. Ben kızmıyorum.
`),
      next: HUB,
    }),
    option('AE_UMUT', '“İkinci celsede baş tanık gelecek. Ona hazırım.”', {
      visibleWhen: not(flag('kemal_teklif')),
      effects: [inc('trust', 5)],
      responses: B(`
emir: Tarık abi mi? O gece… o gece beni görmüş. Elimde bıçakla mı? Ben bıçağı hiç almadım ki.
emir: Tarık abi iyi adamdır. Bana hep çay koyardı. Neden öyle dedi, bilmiyorum. Belki karanlıktı. Belki başkasını gördü.
~ “Belki başkasını gördü.” Bir çocuğun iyiliği, bir tanığın yalanına bile bir mazeret buluyor.
`),
      next: HUB,
    }),
  ],
});

// --- Kemal ---

const kemal = conversation('ARA_KEMAL', {
  ...ARA,
  title: 'Kemal',
  background: 'ev',
  room: { label: 'HAMİTLER · YALÇIN EVİ', character: 'kemal' },
  lines: B(`
# PAZAR 18.00 — HAMİTLER [bg:ev]
> Kemal mutfak masasındaydı; önünde soğumuş bir çay, yanında vardiya çizelgesi. Meral salonda dikiş dikiyordu; makinenin sesi bir aşağı bir yukarı.
kemal: O kadın salondaydı. Arkada. Her celse gelecek mi?
- Gelecek. Dinleyici olarak.
kemal: Dinlesin. Yirmi iki yıl önce dinlemedi.
`),
  choices: [
    rawChoice('OPTION', 'AK_SESLI', 'Sesli mesaj', {
      visibleWhen: all(has('clue_son_arama'), not(flag('sesli_korundu'))),
      next: 'ARA_KEMAL_K',
      responses: B(`
- Kemal Bey, telefonunuzdaki sesli mesaj. Dinlemediniz, değil mi?
kemal: Dinlemedim. Dinlersem… Ercan’ın sesini duymak istemedim. Yirmi iki yıldır.
`),
    }),
    option('AK_EMIR', '“Emir’e ne diyeceksiniz?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('kemal_yumusadi')],
      responses: B(`
kemal/uzgun: Ne diyeceğim? Yirmi iki yıl önce ne olduğunu mu? Bir dolap, bir terazi, bir avukat. Bir de… bir görüş odası.
kemal: Emir ilk adımını bir görüş odasında attı. Meral getirmişti. Masadan masaya, iki adım. Gardiyan alkışladı.
kemal: Şimdi o görüş odasının öbür tarafında o. Ben camın bu tarafındayım. Ne diyeceğim ona? “Benim yüzümden” mi?
~ Bir baba bir cümle arıyor. Yirmi iki yıldır aynı cümleyi.
`),
    }),
    option('AK_GEMLIK', '“O evdeki Gemlikli kimdi?”', {
      visibleWhen: flag('fact_gemlikli'),
      score: { SORGULAMA: 20 },
      responses: B(`
kemal: Gemlikli mi? Bilmem. Ercan’ın arkadaşı. Hafta sonları gelirdi; iyi giyinirdi, öğrenci değildi. Bir arabası vardı, o zamanlar kimsenin yoktu.
kemal: Baskın gecesi orada mıydı? Hatırlamıyorum. Yirmi iki yıl. Ben o gecenin yalnızca kapıyı hatırlıyorum; kırıldığı anı.
~ Bir adsız adam, yirmi iki yıl önce bir bodrum katında. Bir ad bir yerde yazılıdır; bir tutanakta, bir arşivde.
`),
    }),
    toHub('KEMAL_BITIR', 'Kalk, çık'),
  ],
});

const kemalKarar = kemalKararNode('ARA_KEMAL_K', 'AKS', HUB, ARA, { bg: 'ev', label: 'HAMİTLER · YALÇIN EVİ' });

// --- Ek dilekçe ---

const slot2 = [{ var: 'slots2', amount: 1 }];
const dil = story('ARA_DIL', {
  ...ARA,
  title: 'Ek delil talebi',
  hud: ['slots2'],
  background: 'buro',
  lines: B(`
> İkinci celseye iki haftadan az var. Kanun dilekçeyi en geç beş gün önce ister. İki talep; fazlası gürültü.
`),
  choices: [
    option('AD_KENT', 'Kentkart binişleri', {
      visibleWhen: all(not(has('ev_kentkart')), any(flag('fact_otobus'), flag('fact_otobus_emir'))),
      cost: slot2,
      maxUses: 1,
      score: { USUL_BILGISI: 40 },
      effects: [raise('ara_dil_kent'), raise('ara_dil_any')],
      good: 'Sanığın çıkış saatini makine kaydına bağlayan talep (CMK 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_DVR', 'Kayıt cihazının incelenmesi', {
      visibleWhen: all(not(has('ev_dvr')), any(flag('fact_dvr'), has('clue_tarik_ariza'))),
      cost: slot2,
      maxUses: 1,
      score: { USUL_BILGISI: 40 },
      effects: [raise('ara_dil_dvr'), raise('ara_dil_any')],
      good: 'İncelenmemiş cihazın bilirkişiye gönderilmesi (CMK 63, 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_Z', 'Kasanın Z raporu', {
      visibleWhen: all(not(has('ev_z')), flag('fact_z')),
      cost: slot2,
      maxUses: 1,
      score: { USUL_BILGISI: 40 },
      effects: [raise('ara_dil_z'), raise('ara_dil_any')],
      good: 'Tanığın sayım saatini mali hafızadan istedin (CMK 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_SESLI', 'Sesli mesajın bilirkişi incelemesi', {
      visibleWhen: all(flag('sesli_korundu'), not(has('ev_sesli'))),
      cost: slot2,
      maxUses: 1,
      score: { USUL_BILGISI: 60 },
      effects: [raise('ara_dil_sesli'), raise('ara_dil_any')],
      good: 'Kaydın aslının rızayla ve operatör kaydıyla bilirkişiye gönderilmesi (CMK 63, 177). Rapor ikinci celseden sonra gelecek.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_CANSU', 'Garson Cansu Güler’in tanık olarak dinlenmesi', {
      visibleWhen: all(has('ev_cansu_foto'), not(flag('cansu_tanik'))),
      cost: slot2,
      maxUses: 1,
      score: { USUL_BILGISI: 40 },
      effects: [raise('cansu_tanik'), raise('ara_dil_any')],
      good: 'Fotoğrafın kaynağını duruşmada sınanabilir kıldın (CMK 177–178).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_DOLAP', 'Baş tanığın meyhanedeki kişisel dolabının mahkemece aranması', {
      cost: slot2,
      maxUses: 1,
      score: { USUL_BILGISI: -30 },
      effects: [raise('ara_dil_any')],
      bad: 'Arama kararı makul şüphe ister ve kovuşturmada mahkeme bunu bir tanık hakkında savunmanın soyut talebiyle vermez (CMK 116, 119). Talep reddedildi; bir hak gitti.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    cont('AD_VER', 'Dilekçeyi ver', HUB, {
      role: 'PRIMARY',
      effects: [raise('ara_dil_verildi')],
      enabledWhen: flag('ara_dil_any'),
    }),
    toHub('AD_GERI', 'Sonra yazarım'),
  ],
});

// --- Tahta ---

const ARA_POOL = [
  ...INV_POOL,
  'clue_kent',
  'clue_mesafe',
  'clue_durak_kamera',
  'clue_z',
  'clue_dvr',
  'clue_lacivert',
  'clue_iz',
  'clue_mektup_kayip',
];

const araRecipes: ChoiceDef[] = [
  recipe('AC_KASA', 'clue_z', 'clue_tarik_sayim', {
    effects: firstTime('ded_kasa'),
    feedback: feedbackNew('Sayım 23.48’de bitmişti', 'Z raporu 23.48.11; tanık “00.15’e kadar sayım” diyor.'),
    responses: B(`
~ Yirmi sekiz dakika. Bir kasanın kapandığı an ile bir telefonun 112’yi aradığı an arasında yirmi sekiz dakika var. Tanık o dakikaları saydığını söylüyor; saydığı para çoktan çekmecedeydi.
`),
  }),
  recipe('AC_KAMERA', 'clue_dvr', 'clue_tarik_ariza', {
    effects: firstTime('ded_kamera'),
    feedback: feedbackNew('Kamera arızalı değildi', 'Üç gün kesintisiz kayıt; 23.44.10’da fiş.'),
    responses: B(`
~ Arızalı denen bir cihaz, sanığın çıkışından dört dakika sonra sustu. Kendi kendine değil; bir el onu susturdu.
`),
  }),
  recipe('AC_YOL', 'clue_kent', 'clue_mesafe', {
    effects: firstTime('ded_yol'),
    feedback: feedbackNew('Emir 23.52’de otobüsteydi', 'Arka kapıdan durağa dokuz dakika; kart 23.52.40.'),
    responses: B(`
~ 23.40 kapı, dokuz dakika, 23.52 kart. Bir dakika bile boşluk yok. 23.55’te ofisten koşan biri bu otobüste olamaz.
`),
  }),
  recipe('AC_YOL2', 'clue_kent', 'clue_dolmus', {
    effects: firstTime('ded_yol'),
    feedback: feedbackNew('Emir 23.52’de otobüsteydi', 'Bulaşıkçı onu 23.40’ta kapıda gördü; kart 23.52’de İskele’de.'),
    responses: B(`
~ Bir dolmuş tarifesi ve bir kart okuyucu. İki makine, bir yaşlı adamın hafızasını aynı dakikaya bağlıyor.
`),
  }),
  recipe('AC_CANLI', 'clue_sesli', 'clue_kent', {
    effects: firstTime('ded_canli', 400),
    feedback: feedbackNew(
      'Ercan 23.58’de yaşıyordu',
      'Kart 23.52’de otobüste; maktul 23.58’de konuşuyor. Kapıda biri.',
      'YENİ DELİL · +400 SKOR',
    ),
    responses: B(`
~ Emir otobüsteyken Ercan konuşuyordu. “Kapıda biri var. Gel, otur.” Ercan’ı öldüren kişi o kapıdan girdi. O kapıdan giren, Emir değildi.
`),
  }),
  recipe('AC_GOMLEK', 'clue_lacivert', 'clue_beyaz', {
    effects: firstTime('ded_gomlek'),
    feedback: feedbackNew('Gömlek değişmiş', '23.12 lacivert; 00.52 ütülü, temiz beyaz.'),
    responses: B(`
~ Bir adam bir gecede gömlek değiştirir. Belki terlediği için. Belki döktüğü bir şey için. Değiştirdiği gömlek o gecenin dosyasında yok.
`),
  }),
  recipe('AC_MEKTUP', 'clue_iz', 'clue_mektup_kayip', {
    effects: firstTime('ded_mektup'),
    feedback: feedbackNew(
      'Mektup olay yerinden alındı',
      'Haftalarca yazılan bir mektup; masada izi var, eşyalarda kendisi yok.',
    ),
    responses: B(`
~ Bir mektup bir masadan kendi kalkmaz. O gece onu bir el aldı. O el, mektupta adı geçen birinin eli olabilir.
`),
  }),
  recipe('AC_X_KAMERA', 'clue_durak_kamera', 'clue_davet', {
    score: { DELIL_ANALIZI: -50 },
    feedback: {
      title: 'Yanlış iz',
      text: 'Bir durak kamerası ve bir davet. Kayıt yok; davet zaten kanıtlı. İkisi bir şey kurmuyor.',
      label: 'BAĞLANTI YOK · −50 SKOR',
      tone: 'error',
    },
  }),
];

const cikarim = retarget(
  deductionBoard('ARA_CIKARIM', {
    ...ARA,
    title: 'Çıkarım tahtası',
    background: 'buro_gece',
    lines: B(`
> Pano genişledi. İlk celseden önce bir iskeletti; şimdi bir harita: bir ofis, bir kasa, bir durak, bir otobüs.
`),
    pool: ARA_POOL,
    recipes: [...invRecipes('AB'), ...araRecipes, ...invDecoys('AB')],
    miss: boardMiss('FB_ARA_CIKARIM'),
    finish: { id: 'ARA_CIKARIM_BITIR' },
  }),
  HUB,
);

// --- Leyla ---

const leyla = story('ARA_LEYLA', {
  ...ARA,
  title: 'Leyla’ya danış',
  background: 'buro',
  lines: [
    W(
      cmp(v('ara_day'), '==', 1),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: İkinci celsede savcı belki beni de çağırmak isteyecek. Kemal’in yirmi iki yıllık öfkesini anlatmam için. Husumetin derecesi.
leyla: Avukat, mesleği sırasında öğrendiği şeyler hakkında tanıklıktan çekinebilir. Sır benim değil, müvekkilimindir. Kemal izin vermedikçe o sırrın kapısı kapalıdır.
leyla: Bunu sana söylüyorum çünkü o an geldiğinde ayağa kalkacak olan sensin. Beni korumak için değil; Kemal’i korumak için.
leyla: Bir de makineler. Bir kart okuyucunun, bir kasanın, bir kayıt cihazının saati. Tanığın saatini onlarla yan yana koy. Tanık yanılabilir; yalan söyleyen tanık ise ayrıntı ekler. Ayrıntılara bak.
`,
    ),
    W(
      flag('kemal_teklif'),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
> Leyla kapıyı kapattı. Oturmadı.
leyla: Kemal dün akşam buradaydı. Duydum. Ne dediğini de duydum.
leyla: Yirmi iki yıl önce ben o cümleyi ona söyledim Deniz. Şimdi o, aynı cümleyi oğluna söyletmek istiyor. Yalnızca kanaldan geçecek; senden.
leyla: Bir müvekkil masumum diyorsa, avukat onun masumiyetini taşır. Ağır gelirse bırakır; ama başka bir yük koymaz sırtına.
> Sigara paketini avucuna aldı. Açmadı. Bu kez bir süre öyle tuttu.
leyla: Ben koydum. Bir kere. Hâlâ taşıyorum.
`,
    ),
    O(`
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Baş tanık ikinci celsede kürsüde olacak. Onu yenmeye çalışma; ona kendi ifadesini okut.
leyla: Her yalanın bir saati vardır. Her saatin de bir makinesi. Senin işin onu kürsüde o makinenin önüne getirmek; sırayla, sakin, kâğıtla.
leyla: Ve bir şey daha: bir şey bulursan, o şey birini işaret ederse, peşinden koşma. Yaz. Savcıya yaz. Biz avukatız, kolluk değil.
`),
  ],
  choices: [toHub('ARA_LEYLA_DON', 'Teşekkür et')],
});

// --- Gün sonu: Kemal’in önerisi ---

const dayEnd = decisionNode('ARA_DAY_END', [{ to: 'ARA_AKSAM' }], {
  ...ARA,
  title: 'Gün sonu',
  onEnter: [inc('ara_day', 1), set('ara_ap', ARA_AP)],
});

const aksam = story('ARA_AKSAM', {
  ...ARA,
  title: 'Kemal’in önerisi',
  background: 'buro_gece',
  lines: B(`
# GECE 23.40 — ARSLAN HUKUK [bg:buro_gece]
> Kapı çalınmadı yine; açıldı. Kemal. Montu sırılsıklam, gözleri kırmızı. Vardiyası iptal olmuş; ya da iptal etmiş.
kemal: Müebbet. Ağırlaştırılmış. Kaç yıl demek bu? Otuz mu? Otuz yıl sonra Emir elli iki yaşında.
kemal: Ben düşündüm. Tahrik diye bir şey var, öğrendim. On iki yıl. İyi hâlle sekiz, dokuz. Otuz yerine dokuz.
> Masama eğildi. Elleri masanın kenarındaydı; yirmi iki yıl önce bir görüş odasının masasına tutunduğu gibi.
kemal: Oğlum “yaptım” desin. “Babamı yaktı, delirdim” desin. Yalan da değil ki; adam babasını yaktı.
> Koridorun ucunda bir kapı açıldı. Leyla eşikteydi.
leyla: Kemal…
kemal/kizgin: Sen sus! Sen yirmi iki yıl önce konuştun! Bu sefer o konuşacak!
> Leyla sustu. Kapının pervazına tutundu. Kemal bana döndü.
kemal: Söyle ona. Sen söylersen dinler. Bana inanmaz; sana inanır.
`),
  choices: [
    option('AKS_RED', '“Hayır. Yapmadığı bir şeyi ona söyletmem.”', {
      score: { SAVUNMA_STRATEJISI: 100 },
      effects: [raise('teklif_red')],
      good: 'Müvekkilin ailesinin baskısına rağmen masumiyetini söyleyen müvekkile gerçeğe aykırı bir ikrar önermeyi reddettin (Av.K. 34).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Hayır Kemal Bey. Oğlunuz yapmadığını söylüyor. Ona yapmadığı bir şeyi söyletmem. Siz de söyletmeyin.
- Yirmi iki yıl önce size söylendi. Dört yıl yattınız ve hâlâ yatıyorsunuz. Emir’in otuz yılını da bir yalanın içinde geçirmesini mi istiyorsunuz?
> Kemal bir şey söyleyecekti. Ağzı açıldı, kapandı. Sandalyeye çöktü; ilk kez bu büroda oturdu.
kemal/uzgun: Ne yapacağım o zaman? Ben ne yapacağım?
- Bekleyeceksiniz. Ben de çalışacağım.
> Leyla kapıda durmaya devam etti. Sonra yavaşça geri çekildi; kapıyı kapatmadı.
`),
      next: HUB,
    }),
    option('AKS_DUSUN', '“Emir’le konuşurum; seçenekleri, riskleriyle birlikte tek tek anlatırım.”', {
      effects: [raise('kemal_teklif')],
      neutral:
        'Müvekkile seçenekleri anlatmak avukatın işidir; ama aileden gelen bir “ikrar” planını taşımak, o planı müvekkilin önüne koymaktır.',
      responses: B(`
- Emir’le konuşurum Kemal Bey. Seçenekleri anlatırım. Karar onun.
kemal: Anlat. Anlat ona. Otuz yıl ile dokuz yıl arasındaki farkı anlat.
> Leyla kapıyı yavaşça kapattı. Kapanırken bir şey söyledi mi, duymadım.
`),
      next: HUB,
    }),
    option('AKS_EVET', '“Haklısınız; müebbet riski çok büyük, bunu düşünmek gerek.”', {
      effects: [inc('ethics'), raise('kemal_teklif'), raise('teklif_kabul'), score('SAVUNMA_STRATEJISI', -100)],
      bad: 'Masumiyetini söyleyen müvekkil için ailenin “ikrar” planını onayladın; bu, gerçeğe aykırı bir savunmaya ilk adımdır (Av.K. 34).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Haklısınız Kemal Bey. Müebbet riski çok büyük. Emir’le konuşacağım.
> Kemal başını salladı. Yüzünde bir rahatlama; bir yükü başkasına devretmenin rahatlaması.
> Koridorun ucunda Leyla’nın kapısı kapandı. Sessizce. Hiç bu kadar sessiz kapandığını duymamıştım.
`),
      next: HUB,
    }),
  ],
});

// --- Duruşmadan önceki gece ---

const sonNodes = [
  decisionNode('ARA_SON_1', [{ to: 'ARA_SON_2' }], {
    ...ARA,
    title: 'Duruşmadan önceki gece',
    onEnter: [...son.effects],
    lines: B(`
# PAZARTESİ 22.50 — ARSLAN HUKUK [bg:buro_gece]
> Panoyu ikinci kez topluyordum. İlk celseden önce bir iskeletti; şimdi bir haritaydı: bir ofis, bir kasa, bir durak, bir otobüs.
`),
  }),
  decisionNode('ARA_SON_2', [{ to: 'ARA_SON_3' }], {
    lines: [
      W(
        has('ded_canli'),
        `~ 23.58. “Kapıda biri var. Gel, otur.” Emir o saatte bir otobüsün içindeydi. Ercan’ı öldüren o kapıdan girdi.`,
      ),
      W(
        any(has('ded_yol'), has('ev_kentkart')),
        `~ 23.52. Bir kart okuyucu, bir otobüs. Baş tanığın 23.55’i yarın bir makinenin karşısına oturacak.`,
      ),
      O(`~ Baş tanığın saatleri hâlâ yalnızca onun saatleri. Karşısına koyacak bir makinem yok.`),
    ],
  }),
  decisionNode('ARA_SON_3', [{ to: 'ARA_SON_4' }], {
    lines: [
      W(
        all(has('ded_kasa'), has('ded_kamera')),
        `~ Kasa 23.48’de kapandı. Kamera 23.44’te sustu. Biri bu iki saatin arasında, kendi söylediğinden başka bir şey yapıyordu.`,
      ),
      W(has('ded_gomlek'), `~ Lacivert bir gömlek ve beyaz bir gömlek. Bir gecede değişen bir şey.`),
      W(has('ded_mektup'), `~ Bir mektubun gölgesi. “T…ık’ın.” İki harf ve bir boşluk.`),
      W(flag('ikrar_onerisi'), `~ Emir’in sesi: “Sen de mi abla?” Yarın o kürsüde ne diyecek, bilmiyorum.`),
      W(flag('cansu_vaat'), `~ Cansu’ya bir iş vaat ettim. Yarın savcı ona “neden geldiniz” diye sorarsa…`),
      O(`~ Yarın ikinci celse. Leyla’nın sesi: “Ona kendi ifadesini okut.”`),
    ],
  }),
  decisionNode('ARA_SON_4', [{ to: 'ARA_SON_5' }], {
    lines: [
      W(
        all(flag('fact_sesli_saat'), flag('fact_ikinci_ses')),
        `~ Bilirkişinin dalga formu: 23.58.07’de bir adamın sesi, son dört saniyede bir kapı ve bir başkasının kısa bir sözü. Kelimesi anlaşılmıyor; varlığı anlaşılıyor.`,
      ),
      W(
        any(flag('fact_metro'), flag('fact_sefer')),
        `~ Son 1/M 23.52’de kalkar; ondan sonra İskele’den Bursa’ya toplu taşıma yok. Kart 00.41’de Emek’te. Geri dönen bir yolculuk yok; yalnızca eve giden bir çocuk.`,
      ),
      W(
        any(flag('fact_cansu_erken'), flag('fact_fatura')),
        `~ Bir garson 23.25’te eve gönderildi. Perşembe bir ofisten “faturalar” diye bir bağırış yükseldi. İki küçük şey; ikisi de aynı adamın etrafında.`,
      ),
      O(`~ Makineler konuşmaya başladı. İnsanlar hâlâ susuyor.`),
    ],
  }),
  decisionNode('ARA_SON_5', [{ to: 'ARA_SON_T' }], {
    lines: [
      W(
        flag('sesli_kopya'),
        `~ Kemal’in telefonundaki sesin bir kopyası benim telefonumda. Bir bilirkişi bana “bu ne” diye sorsa, utanırım. Aslı bir babanın avucunda; orada kalmalıydı.`,
      ),
      W(
        flag('emir_kararli'),
        `~ Emir’in sesi: “Yaptım demem abla. Yapmadım.” Bir çocuk, babasının yirmi iki yıl önce veremediği cevabı verdi.`,
      ),
      W(
        flag('teklif_red'),
        `~ Kemal benim büromda ilk kez oturdu. “Ne yapacağım?” dedi. Bekleyecek. Ben de çalışacağım. Bu dosyada en zor iş bekleyenlerin işi.`,
      ),
      W(
        flag('kemal_yumusadi'),
        `~ Kemal’in sesi: “İlk adımını bir görüş odasında attı.” Bir baba bir cümle arıyor; yirmi iki yıldır aynı cümleyi.`,
      ),
      O(`~ Leyla’nın kapısı bütün gün kapalıydı. Bir kez açıldı; Kemal’in adı geçtiğinde. Sonra yine kapandı.`),
    ],
  }),
  story('ARA_SON_T', {
    ...ARA,
    title: 'Gece yarısı ziyaret',
    background: 'buro_gece',
    lines: B(`
> Gece yarısına on dakika kala kapı çalındı. Bu kez gerçekten çalındı; iki kez, nazikçe.
> Kapıda Tarık Sezer. Bir şemsiye, bir paltonun altında ütülü bir gömlek; bu kez gri. Elinde bir zarf.
tarik: Avukat hanım, kusura bakmayın. Geçiyordum, ışığınız yanıyordu. Ercan’ın bir fotoğrafı; ofiste bulduk. Gülay Hanım’a ulaşamadım, siz verirsiniz belki.
> Zarfı uzattı. İçinde Ercan’ın, meyhanenin açılış gününden bir fotoğrafı: iki genç adam, bir kurdele, bir makas. Yanındaki Tarık.
tarik: Yarın mahkemede görüşeceğiz. Ne gördüysem söyleyeceğim; biliyorsunuz. Siz de işinizi yapacaksınız. Saygı duyarım.
tarik: Bir şey soracaktım ama… Yarın ne soracaksınız bana? Hazırlıklı olayım diye. Ben bu işleri bilmem.
~ Gece yarısı, bir tanık, bir fotoğraf ve bir soru. Bir ev sahibi, misafirinin ne yiyeceğini önceden sorar.
`),
    choices: [
      option('TS_SUS', '“Fotoğrafı Gülay Hanım’a iletirim. Mahkemede görüşürüz Tarık Bey; iyi geceler.”', {
        score: { SORGULAMA: 40 },
        good: 'Tanıkla dosyayı konuşmadın; kürsüdeki sorunu kürsüde sorarsın.',
        category: 'SORGULAMA',
        responses: B(`
- Fotoğrafı Gülay Hanım’a iletirim. Mahkemede görüşürüz Tarık Bey. İyi geceler.
> Tarık bir an bekledi; bir cevap bekler gibi. Sonra gülümsedi.
tarik: Tabii. İyi geceler.
> Merdivenden indi. Şemsiyesini açtı, sokağın ucunda bir arabaya bindi. Farlar bir an pencereme vurdu.
`),
        next: 'ARA_SON',
      }),
      option('TS_SOR', '“Size Z raporunu soracağım.”', {
        effects: [raise('tarik_uyarildi2')],
        score: { SORGULAMA: -40 },
        bad: 'Tanığa kürsüde göstereceğin kâğıdı gece yarısı kapıda söyledin; artık hazırlıklı gelecek.',
        category: 'SORGULAMA',
        responses: B(`
- Size kasanın Z raporunu soracağım Tarık Bey. Saatini.
> Tarık’ın yüzünde hiçbir şey kıpırdamadı. Yalnızca şemsiyenin sapını öbür eline aldı.
tarik: Z raporu. Tabii. Hatırlarım. İyi geceler avukat hanım.
~ Bir saat verdim. Yarın o saate hazır bir cevapla gelecek.
`),
        next: 'ARA_SON',
      }),
      option('TS_TEHDIT', '“Yarın yalan söylerseniz bunun bir bedeli olur.”', {
        score: { SORGULAMA: -40 },
        bad: 'Tanığı kapıda uyarmak bir avukatın işi değil; yalan tanıklığın bedelini kanun ve savcı belirler.',
        category: 'SORGULAMA',
        responses: B(`
- Yarın yalan söylerseniz bunun bir bedeli olur Tarık Bey.
tarik: Yalan mı? Ben mi? Avukat hanım, ben ortağımı kollarımda buldum. İyi geceler.
> Kapıyı kendisi kapattı. Ben değil.
`),
        next: 'ARA_SON',
      }),
    ],
  }),
  story('ARA_SON', {
    ...ARA,
    title: 'Duruşmadan önceki gece',
    background: 'sokak_yagmur',
    lines: B(`
> Fotoğrafı masaya koydum. İki genç adam, bir kurdele. Biri gülüyor, öbürü objektife değil, yanındakine bakıyor.
> Leyla’nın odasının ışığı yanıyordu. Kapı aralıktı. Masasında çerçeveyi elinde tutuyordu; beni görünce yavaşça, yüzü aşağı gelecek şekilde bıraktı.
leyla: Uyu. Yarın uyanık olman gerek. Bir de: o adama bakarken, ona kendi gözleriyle değil, kendi kâğıtlarıyla bak.
~ Sormadım çerçeveyi. Bir gün anlatacaktı. Belki yakında.
`),
    choices: [cont('ARA_SON_DEVAM', 'Adliyeye git', 'T2_00G_1', { role: 'PRIMARY' })],
  }),
];

export const ara: CasePart = {
  nodes: [
    ...girisNodes,
    hub,
    kent,
    zRapor,
    dvr,
    sesli,
    emanet,
    durakGiris,
    durak,
    cansu,
    cansuKarar,
    gulay,
    emirGiris,
    emir,
    kemal,
    kemalKarar,
    dil,
    cikarim,
    leyla,
    dayEnd,
    aksam,
    ...sonNodes,
  ],
  triggers: [
    {
      id: 'tg_ara_day',
      scope: HUB,
      priority: 1,
      when: all(cmp(v('ara_ap'), '<=', 0), cmp(v('ara_day'), '<', ARA_DAYS)),
      goto: 'ARA_DAY_END',
    },
  ],
  discoveryPaths: [...giris.discoveryPaths, ...son.discoveryPaths],
};
