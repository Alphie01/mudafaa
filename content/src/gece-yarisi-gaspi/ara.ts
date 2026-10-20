import {
  all,
  any,
  cmp,
  conversation,
  cont,
  dec,
  decisionNode,
  deductionBoard,
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
  raise,
  rawChoice,
  recipe,
  ref,
  row,
  sceneSearch,
  score,
  set,
  story,
  tool,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef, Effect } from '../../../tools/content/src/kit/index.js';
import { B, O, W, retarget } from './dsl.js';
import { invRecipes, uedasDoc } from './investigation.js';
import { ARA, ARA_AP, ARA_DAYS, T_TESLIM } from './shared.js';

// 65-ara: 1. ve 2. celse arası (3 gün × 3 EP; yığınsız). HızlıPaket kayıtları gelir: müvekkilin hesabı olay
// yerinde. Telefon raporu, özçekim, Barış’la yüzleşme, Derya’nın sırrı, kebapçı, tanık hazırlığı ve ne yapılacağı kararı.

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
  { evidence: 'ev_gps' },
  { evidence: 'ev_tel' },
  {
    evidence: 'ev_selfie',
    requires: flag('selfie_istendi'),
    hint: 'İlk celsede kayıt talebine giriş cihazı ve kimlik doğrulama özçekimini de ekleyebilirdin.',
  },
]);
const gunSonu = deliver('ARA_DAY_END', [
  { evidence: 'ev_selfie', requires: flag('ara_selfie_istendi'), hint: 'HızlıPaket’ten doğrulama özçekimini iste.' },
  { evidence: 'ev_uedas', requires: flag('ara_uedas'), hint: 'Kesinti kaydını iste.' },
]);
const son = deliver('ARA_SON_1', [
  { evidence: 'ev_selfie', requires: flag('ara_selfie_istendi'), hint: 'HızlıPaket’ten doğrulama özçekimini iste.' },
  { evidence: 'ev_uedas', requires: flag('ara_uedas'), hint: 'Kesinti kaydını iste.' },
]);

const firstTime = (ded: string, amount = 300): Effect[] => [
  ifThen(not(has(ded)), [discover(ded), score('DELIL_ANALIZI', amount)]),
];

// --- Giriş ---

const girisNodes = [
  decisionNode('ARA_GIRIS_1', [{ to: 'ARA_GIRIS_2' }], {
    ...ARA,
    title: 'Ara',
    onEnter: [set('in_court', false), set('ara_day', 1), set('ara_ap', ARA_AP), ...giris.effects],
    lines: B(`
# İKİ GÜN SONRA · SALI 18.40 — ARSLAN HUKUK [bg:buro_gece]
> Mahkemenin müzekkeresine cevaplar çabuk geldi. Şirketler, mahkemeye geç kalmayı sevmez; avukatlara geç kalmayı sever.
`),
  }),
  decisionNode('ARA_GIRIS_2', [{ to: 'ARA_GIRIS' }], {
    lines: [
      W(
        all(not(flag('released')), flag('koridor_durust')),
        `
> Barış hâlâ içerideydi. Sevim Hanım her gün arıyordu. “Sen söylemiştin kızım, bugün bitmez diye. Söylemiştin.” Bir kızgınlık değildi bu; bir tutunma.
`,
      ),
      W(
        flag('released'),
        `
> Barış iki gündür evdeydi. Her sabah karakola imzaya gidiyor, öğlen yatıyor, akşam balkonda oturuyormuş. Derya söyledi: “Konuşmuyor canım. Bir şey düşünüyor.”
`,
      ),
      O(`
> Barış hâlâ içerideydi. Derya her gün arıyordu; ben her gün aynı şeyi söylüyordum: “Kayıtlar geliyor.”
`),
    ],
  }),
  story('ARA_GIRIS', {
    ...ARA,
    title: 'Kayıtlar',
    background: 'buro_gece',
    lines: B(`
> Leyla odama girdi. Elinde bir CD ve iki zarf. CD’yi masaya bıraktı; zarfları bırakmadı.
leyla: HızlıPaket’in cevabı. Bir de telefon inceleme raporu. Önce şu sayfaya bak.
> Bir tablo. Saatler, koordinatlar. Bir satırın altını kırmızı kalemle çizmişti.
leyla: Müvekkilinin hesabı. 23.41. Sırmakeş merdivenlerinin dibinde. Dört dakika hareketsiz.
> Sandalyeye oturdum. Ayağa kalktım. Yeniden oturdum.
~ Bir an, yalnızca bir an, kendi müvekkilimden şüphelendim. Ateşli bir çocuk, bir motor, “aşağıdaydı” derken masanın vidasına inen gözler.
~ Sonra o an geçmedi. Avukatlığın en kötü yanı budur: şüphe bir kere gelince, gitmesi için bir kanıt ister.
leyla: Savcı bu sayfayı okudu Deniz. İkinci celsede bunu kürsüye koyacak. Sen ne koyacaksın?
- Bilmiyorum.
leyla: Güzel. “Bilmiyorum” iyi bir başlangıç. Kayıt hesabın yerini gösterir. Kişinin yerini göstermez. Bu iki şey arasındaki boşluğu doldur.
> Kapıdan çıkarken durdu.
leyla: Bir de şunu bil: bir şey bulursan ve o şey birini işaret ederse, peşinden koşma. Yaz. Savcıya yaz. Biz avukatız, kolluk değil.
> Leyla gitti. Odada CD’nin plastik kutusu, bir telefon raporu ve ben kaldık.
~ Hesap. Bir uygulamanın içindeki bir isim, bir şifre, bir yüz. Barış “motor aşağıdaydı” dedi. Hesaptan hiç söz etmedi; ben de hiç sormadım.
~ Sormadığım soru, şimdi bir savcının elindeki en güçlü cevap. Bu dosyada sormamak bir hastalık gibi; polisten bana da bulaştı.
> Pencereden aşağı baktım. Sokakta sarı kutulu bir motor geçti, kırmızı ışıkta durdu, yeşilde gitti. Sürücünün yüzü kaskın içindeydi. Kimdi? Kimse bilmez.
`),
    choices: [cont('ARA_GIRIS_DEVAM', 'Kayıtları aç', HUB, { role: 'PRIMARY' })],
  }),
];

// --- Hub ---

const hubTabs = [
  {
    id: 't_ara_kayit',
    label: 'KAYITLAR',
    kind: 'ARCHIVE' as const,
    choices: [
      act('A_GPS', 'HızlıPaket dökümünü incele', 'ARA_GPS', { once: true, description: 'Hesap, oturum, konum' }),
      act('A_TEL', 'Telefon inceleme raporunu oku', 'ARA_TEL', { once: true, description: 'Barış’ın telefonu' }),
      act('A_SELFIE', 'Doğrulama özçekimine bak', 'ARA_SELFIE', {
        once: true,
        description: 'HızlıPaket ek dosyası',
        visibleWhen: has('ev_selfie'),
      }),
      act('A_UEDAS', 'Kesinti kaydını incele', 'ARA_UEDAS', {
        once: true,
        description: 'UEDAŞ cevabı',
        visibleWhen: all(has('ev_uedas'), not(visited('INV_UEDAS'))),
      }),
      act('A_DIL', 'Ek delil talebi', 'ARA_DIL', {
        description: 'Mahkemeye ek dilekçe',
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
      act('A_BARIS', 'Barış’la yüzleş', 'ARA_BARIS_G', { once: true, description: 'Kayıtlar elinde' }),
      act('A_DERYA', 'Derya’nın salonuna git', 'ARA_DERYA', {
        once: true,
        description: 'Yıldırım · kuaför',
        visibleWhen: flag('fact_tolga'),
      }),
      act('A_KADIR', 'Kadir Usta’yı hazırla', 'ARA_KADIR', {
        once: true,
        description: 'Tanık · duruşmaya üç gün',
        visibleWhen: flag('kadir_tanik'),
      }),
    ],
  },
  {
    id: 't_ara_yer',
    label: 'OLAY YERİ',
    kind: 'SCENE' as const,
    choices: [
      act('A_KEBAP', 'Tophane Kebap Salonu', 'ARA_KEBAP_G', {
        once: true,
        description: '23.31 siparişi · arka kapı',
        visibleWhen: visited('ARA_GPS'),
      }),
    ],
  },
  {
    id: 't_ara_karar',
    label: 'KARAR',
    kind: 'ARCHIVE' as const,
    choices: [
      act('A_KARAR', 'Bildiklerinle ne yapacaksın?', 'ARA_KARAR', {
        description: 'Bir isim var',
        visibleWhen: all(flag('fact_tolga'), not(flag('karar_verildi'))),
      }),
      free('A_ZARF', 'Tolga’nın zarfı', 'ARA_ZARF', {
        description: '0 EP · masandaki zarf',
        visibleWhen: all(flag('zarf_aldi'), flag('fact_tolga'), not(flag('zarf_karar'))),
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
# ARA · GÜN 1/3 · İKİNCİ CELSEYE 19 GÜN
> Hedef: hesabın o gece nerede olduğunu biliyorsun. Hesabı kimin taşıdığını bul.
`,
    ),
    W(
      all(cmp(v('ara_day'), '==', 2), flag('fact_tolga')),
      `
# ARA · GÜN 2/3 · İKİNCİ CELSEYE 12 GÜN
> Hedef: bir isim var. İsim bir kanıt değildir. Kayıtlar, tanıklar ve doğru yol.
`,
    ),
    W(
      cmp(v('ara_day'), '==', 2),
      `
# ARA · GÜN 2/3 · İKİNCİ CELSEYE 12 GÜN
> Hedef: kayıtlar hâlâ müvekkilini gösteriyor. Hesabı kim taşıyordu?
`,
    ),
    O(`
# ARA · GÜN 3/3 · İKİNCİ CELSEYE 5 GÜN
> Hedef: tanıklar, talepler, karar. İkinci celsede neyi, kimi, hangi sırayla?
`),
  ],
  tabs: hubTabs.map((t) => ({ id: t.id, label: t.label, kind: t.kind, choices: t.choices.map((c) => c.id) })),
  scenePreview: { scene: 'sc_kebap' },
  choices: [
    ...hubTabs.flatMap((t) => t.choices),
    nav('A_DURUSMA', 'DURUŞMAYA GİT · 2. CELSE', 'ARA_SON_1', {
      role: 'PRIMARY',
      confirm: 'Duruşmaya gidersen ara evresi biter. Emin misin?',
    }),
  ],
};

// --- Belgeler ---

const gps = retarget(
  documentExam('ARA_GPS', {
    ...ARA,
    title: 'HızlıPaket hesap ve konum dökümü',
    hud: ['gps_left'],
    background: 'buro_gece',
    lines: B(`
> Yedi satır. Bir gece, bir hesap, bir şehir. Kırmızı kalemle çizilmiş satır sayfanın ortasında bir yara gibi duruyor.
~ Bir alet seç ve satırlara dokun. Savcı bu kâğıdı bir kez okudu. Ben üç kez okuyacağım.
`),
    header: { left: 'HIZLIPAKET · HESAP K-20417 (B. KILINÇ)', right: '18.01' },
    columns: [
      { label: 'SAAT', flex: 0.9 },
      { label: 'OLAY', flex: 1.1 },
      { label: 'AYRINTI', flex: 2 },
    ],
    rows: [
      row('g_oturum', ['22.58', 'Oturum açıldı', 'Kimlik doğrulama: onaylı (%91)']),
      row('g_cihaz', ['22.58', 'Giriş cihazı', 'Redmi Note 11 · …7741']),
      row('g_kayitli', ['—', 'Kayıtlı cihaz', 'Samsung A54 · …2210']),
      row('g_alim', ['23.31', 'Sipariş alımı', 'Tophane Kebap Salonu']),
      row('g_durak', ['23.41–23.44', 'Konum', 'Sırmakeş merdiveni alt başı · hareketsiz']),
      row('g_teslim', ['23.55', 'Teslim', 'Kayhan Mah.']),
      row('g_cikis', ['00.20', 'Oturum kapandı', '—']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Karşılaştır', 'compare')],
    costVar: 'gps_left',
    rules: [
      examine('EX_G_CIHAZ', 'compare', 'g_cihaz', {
        effects: [ifThen(not(has('clue_cihaz')), [discover('clue_cihaz'), score('DELIL_ANALIZI', 150)])],
        feedback: {
          title: 'YENİ İPUCU · CİHAZ',
          text: 'Oturum Redmi …7741’den açılmış. Barış’ın kayıtlı ve el konulan telefonu Samsung …2210. O gece hesap başka bir telefondaydı.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
        responses: B(`
~ Hesap bir kimlik değil, bir uygulama. Uygulama, onu açan telefondadır. Ve o telefon Barış’ın değildi.
`),
      }),
      examine('EX_G_KAYITLI', 'compare', 'g_kayitli', {
        effects: [ifThen(not(has('clue_cihaz')), [discover('clue_cihaz'), score('DELIL_ANALIZI', 150)])],
        feedback: {
          title: 'KAYITLI CİHAZ',
          text: 'Kayıtlı cihaz Samsung …2210: polisin 19 Ocak sabahı Barış’ın evinde el koyduğu telefon. O gece giriş başka bir cihazdan.',
          label: 'Not defterine eklendi',
          tone: 'success',
        },
      }),
      examine('EX_G_DURAK', 'mag', 'g_durak', {
        discovers: 'clue_durak',
        score: { DELIL_ANALIZI: 40 },
        feedback: {
          title: 'SAVCILIĞIN KARTI',
          text: 'Dört dakika hareketsiz, merdivenin tam dibinde. Hesap oradaydı. Bunu inkâr edemem; edersem heyet bana inanmaz.',
          label: '+40 SKOR · Not defterine eklendi',
          tone: 'neutral',
        },
      }),
      examine('EX_G_OTURUM', 'mag', 'g_oturum', {
        score: { DELIL_ANALIZI: 20 },
        effects: [raise('fact_dogrulama')],
        feedback: {
          title: 'KİMLİK DOĞRULAMA',
          text: 'Her oturumda zorunlu özçekim; yüz eşleştirme %91 “onaylı.” Özçekimin kendisi bu dökümde yok; ayrı bir dosyada tutuluyor.',
          label: '+20 SKOR',
          tone: 'neutral',
        },
      }),
      examine('EX_G_TESLIM', 'mag', 'g_teslim', {
        score: { DELIL_ANALIZI: 10 },
        feedback: {
          title: '23.55',
          text: 'Olaydan on üç dakika sonra Kayhan’da bir teslimat. Kim çanta kapıp sonra soğumuş bir kebabı kapıya götürür? Ya çok soğukkanlı biri ya da çok çaresiz biri.',
          label: '+10 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: fallback('FB_GPS', 'EXAMINE', {
      score: { DELIL_ANALIZI: -20 },
      feedback: { title: 'SONUÇ YOK', text: 'Bu satırda bu aletle bir şey çıkmadı.', label: '−20 SKOR', tone: 'error' },
    }),
    finish: { id: 'GPS_BITIR' },
  }),
  HUB,
);

const tel = retarget(
  documentExam('ARA_TEL', {
    ...ARA,
    title: 'Telefon inceleme raporu',
    hud: ['tel_left'],
    background: 'buro_gece',
    lines: B(`
> Kriminal raporu kuru bir dille yazılmış: “İnceleme kapsamı mahkeme kararıyla 18 Ocak 20.00 – 19 Ocak 08.10 aralığıyla sınırlandırılmıştır.”
~ Savcı bu raporu suç ortağı bulmak için istedi. Belki buldu da; kimi bulduğunu bilmiyor.
`),
    header: { left: 'KRİMİNAL · TELEFON İNCELEME RAPORU', right: 'Samsung A54 …2210' },
    columns: [
      { label: 'SAAT', flex: 0.9 },
      { label: 'KAYIT', flex: 1.3 },
      { label: 'AYRINTI', flex: 1.8 },
    ],
    rows: [
      row('t1', ['22.31', 'Gelen mesaj', 'Kayıtlı kişi: “T.” · içerik ek-3’te']),
      row('t2', ['23.39–23.44', 'Ekran', 'Açık · el feneri uygulaması']),
      row('t3', ['23.40', 'Giden arama · 186', '1 dk 40 sn · baz: Yıldırım']),
      row('t4', ['00.38', 'Gelen mesaj', 'Kayıtlı kişi: “T.” · içerik ek-3’te']),
      row('t5', ['08.10', 'Son hareket', 'Cihaz kapatıldı (el koyma)']),
    ],
    tools: [tool('mag', 'Ek-3’ü aç', 'magnifier'), tool('compare', 'Karşılaştır', 'compare')],
    costVar: 'tel_left',
    rules: [
      examine('EX_TEL_MESAJ', 'mag', 't1', {
        discovers: 'clue_mesaj',
        score: { DELIL_ANALIZI: 150 },
        effects: [raise('fact_tolga')],
        feedback: {
          title: 'YENİ İPUCU · MESAJ',
          text: 'Ek-3, 22.31. Gönderen kayıtlı: “Tolga”. “Hesabı ben açıyorum bu gece, sen yat kanka.”',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
        responses: B(`
~ Tolga. Bir gece kapımda sırılsıklam duran, zarf uzatan genç. Haftalığını bir avukata bırakan kuzen.
~ Bir mesaj kimin suçlu olduğunu söylemez. Kimin orada olduğunu söyler. Bu dosyada bu ikisini ilk kez karıştırmayacak olan kişi ben olmalıyım.
`),
      }),
      examine('EX_TEL_186', 'compare', 't3', {
        discovers: 'clue_186',
        score: { DELIL_ANALIZI: 150 },
        effects: [ifThen(flag('fact_186'), [score('DELIL_ANALIZI', 30)])],
        feedback: {
          title: 'YENİ İPUCU · 186',
          text: '23.40’ta elektrik arıza hattı aranmış; 1 dakika 40 saniye. Baz istasyonu Yıldırım. Kesintide arayan kırk bir kişiden biri, Barış’ın telefonu.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_TEL_EKRAN', 'mag', 't2', {
        score: { DELIL_ANALIZI: 20 },
        feedback: {
          title: 'EL FENERİ',
          text: '23.39–23.44 arası ekran açık, el feneri uygulaması çalışıyor. Karanlıkta biri telefonunun ışığıyla yolunu buluyordu.',
          label: '+20 SKOR',
          tone: 'neutral',
        },
      }),
      examine('EX_TEL_ANAHTAR', 'mag', 't4', {
        score: { DELIL_ANALIZI: 40 },
        effects: [raise('fact_anahtar'), raise('fact_tolga')],
        feedback: {
          title: '00.38',
          text: 'Ek-3, 00.38. “Tolga”: “Anahtarı paspasın altına koydum.” Hangi anahtar? Barış uyuyordu; mesaj okunmamış.',
          label: '+40 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: fallback('FB_TEL', 'EXAMINE', {
      score: { DELIL_ANALIZI: -20 },
      feedback: { title: 'SONUÇ YOK', text: 'Bu satırda bu aletle bir şey çıkmadı.', label: '−20 SKOR', tone: 'error' },
    }),
    finish: { id: 'TEL_BITIR' },
  }),
  HUB,
);

const selfie = retarget(
  documentExam('ARA_SELFIE', {
    ...ARA,
    title: 'Kimlik doğrulama özçekimi',
    hud: ['sel_left'],
    background: 'buro_gece',
    lines: B(`
> Tek bir görüntü. 640×480, flaşsız, bir sokak lambasının sarı ışığında. Bir yüz, bir bere, yağmurdan ıslanmış bir yaka.
~ İlk bakışta Barış. İkinci bakışta… ikinci bakışlar için avukat olunur.
`),
    header: { left: 'HIZLIPAKET · KİMLİK DOĞRULAMA', right: '18.01 · 22.58' },
    columns: [
      { label: 'ALAN', flex: 1 },
      { label: 'DEĞER', flex: 1.6 },
      { label: 'NOT', flex: 1.2 },
    ],
    rows: [
      row('s1', ['Görüntü', 'Özçekim, flaşsız', 'Bere, koyu mont']),
      row('s2', ['Eşleştirme', '%91 · onaylı', 'Referans: kasım vesikalığı']),
      row('s3', ['Sol kulak', 'Görüntünün sağ kenarı', 'bulanık'], {
        zoom: { cells: ['Sol kulak', 'Kulak memesinde küçük metal halka', 'ışığı yansıtıyor'], tone: 'special' },
      }),
      row('s4', ['Cihaz', 'Redmi Note 11 · …7741', '—']),
    ],
    tools: [
      tool('mag', 'Büyüteç', 'magnifier'),
      tool('zoom', 'Yakınlaştır', 'camera'),
      tool('compare', 'Vesikalıkla karşılaştır', 'compare'),
    ],
    costVar: 'sel_left',
    rules: [
      examine('EX_S_KULAK', 'zoom', 's3', {
        discovers: 'clue_selfie',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · HALKA',
          text: 'Yakınlaştırınca sol kulak memesinde küçük, metal bir halka. Sokak lambasının ışığını yansıtıyor.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
        responses: B(`
~ Parlayan bir şey. Sol kulakta. Bir kadının 112’de söylediği, ertesi sabah unutturulan şey, burada, bir makinenin hafızasında duruyordu.
`),
      }),
      examine('EX_S_ESLES', 'compare', 's2', {
        score: { DELIL_ANALIZI: 50 },
        effects: [raise('selfie_sakal')],
        feedback: {
          title: '%91',
          text: 'Makine bu yüzü kasımdaki vesikalıkla eşleştirmiş. Ama vesikalıkta uzun saç ve sakal var; özçekimde yüz tıraşlı, saçlar berenin altında. Yüz benziyor. Aynı değil.',
          label: '+50 SKOR',
          tone: 'success',
        },
        responses: B(`
~ Bir makine bile bu iki yüzü ayıramamış. Bir kadın, acıyla, yağmurda, bir saniyede nasıl ayırsın?
`),
      }),
      examine('EX_S_CIHAZ', 'compare', 's4', {
        score: { DELIL_ANALIZI: 20 },
        feedback: {
          title: 'CİHAZ',
          text: 'Özçekim, oturumu açan Redmi …7741’den çekilmiş. Aynı telefon, aynı gece.',
          label: '+20 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: fallback('FB_SELFIE', 'EXAMINE', {
      score: { DELIL_ANALIZI: -20 },
      feedback: { title: 'SONUÇ YOK', text: 'Bu alanda bu aletle bir şey çıkmadı.', label: '−20 SKOR', tone: 'error' },
    }),
    finish: { id: 'SELFIE_BITIR' },
  }),
  HUB,
);

// --- Barış ---

const barisGiris = decisionNode('ARA_BARIS_G', [{ to: 'ARA_BARIS' }], {
  ...ARA,
  title: 'Barış',
  lines: [
    W(
      flag('released'),
      `
# ÇARŞAMBA 17.20 — YILDIRIM, BALKON [bg:ev]
> Barış balkonda oturuyordu; aynı balkonda. Üst katta Kadir Usta’nın perdesi kıpırdadı.
> Dökümün kırmızı çizgili sayfasını masaya koydum. Barış sayfaya baktı. Uzun uzun. Sonra çay bardağını bıraktı.
sevim: Kızım çay getireyim mi? Barış üç gündür ağzına bir şey koymuyor; sen gelince belki…
- Sağ olun Sevim Hanım. Biraz yalnız konuşabilir miyiz?
> Sevim Hanım balkon kapısını arkasından çekti. Camın ardında bir gölge olarak kaldı; gitmedi, biliyorum.
~ Bu balkonda bir gece bir mum yanmıştı, bir öksürük duyulmuştu. Şimdi aynı balkonda bir kâğıt duruyor ve o kâğıt başka bir şey söylüyor.
`,
    ),
    O(`
# ÇARŞAMBA 14.10 — CEZAEVİ, AVUKAT GÖRÜŞ ODASI [bg:gorus_odasi]
> Hasan kapıyı açtı, bir şey söylemedi. Barış daha da zayıflamıştı.
> Dökümün kırmızı çizgili sayfasını vidalı masanın üstüne koydum. Barış sayfaya baktı. Uzun uzun.
hasan: Avukat hanım, bugün yirmi dakika. Sayım var.
> Barış sayfaya eğildi, saçları yüzüne düştü. Parmakları kırmızı çizginin üstünde durdu ve orada kaldı.
~ İnsan kendi adını bir suç tutanağında görünce ilk önce adını okur. Sonra saati. Sonra bir daha adını.
`),
  ],
});

const baris = conversation('ARA_BARIS', {
  ...ARA,
  title: 'Barış',
  room: { label: 'YÜZLEŞME', character: 'baris' },
  lines: B(`
- Hesabın, Barış. 23.41. Sırmakeş merdivenlerinin dibinde. Dört dakika.
> Barış gözlerini kapadı.
`),
  choices: [
    option('BQ_GPS', '“Açıkla. Şimdi. Doğrusunu.”', {
      score: { SORGULAMA: 40 },
      effects: [raise('fact_tolga'), raise('baris_itiraf')],
      responses: [
        W(
          cmp(v('trust'), '<', 40),
          `
baris/kizgin: Ne açıklayayım? Bana inanmıyorsun zaten! Sen de onlar gibisin!
> Masaya vurdu. Sonra yüzünü ellerine gömdü. Uzun bir sessizlik.
baris/uzgun: Tolga’ydı. Tamam mı? Hesabımı ona veriyorum. Dört aydır. Ehliyeti yok, alkolden aldılar. Benim hesabımla, benim motorumla çalışıyor.
baris/uzgun: O gece de o çalıştı. Ben yattım. Ama o yapmaz abla. O benim kardeşim.
~ Güvenini kaybettiğim bir müvekkilden bir gerçek aldım. Pahalı bir alışveriş.
`,
        ),
        O(`
baris/uzgun: Tolga’ydı.
> Bunu söylemek için bütün gücünü toplamıştı. Sonra kelimeler bir bentten boşalır gibi geldi.
baris: Amcamın oğlu. Ehliyetini alkolden aldılar, dört ay önce. İş yok, borç var. “Kanka, hesabını ver, akşamları ben çalışayım, yarı yarıya” dedi.
baris: Şirket bilse beni atar. Hesap kişiye özel. O yüzden kimseye söylemedim. Motoru da o alıyor, yedek anahtar onda.
baris/uzgun: O gece ateşim vardı. Mesaj attı: “Hesabı ben açıyorum.” Ben yattım. Bu kadar.
baris: Ama abla… o yapmaz. Tolga bir kadını itmez. O benim kardeşim. Beraber büyüdük.
~ “Beraber büyüdük.” İnsanlar en çok, en iyi tanıdıklarını sandıkları insanlar hakkında yanılır.
`),
      ],
    }),
    option('BQ_HALKA', '“Tolga’nın kulağında halka var mı?”', {
      visibleWhen: all(flag('fact_tolga'), any(has('clue_halka'), has('clue_ali_halka'), has('clue_selfie'))),
      score: { SORGULAMA: 40 },
      effects: [raise('fact_tolga_halka')],
      responses: B(`
> Barış bana baktı. Sonra pencereye. Sonra yine bana. Bir şey anlamaya başlamıştı ve anlamak istemiyordu.
baris: Var… Sol kulağında. Askerden sonra taktı. Ben dalga geçiyordum onunla, “korsan” diyordum.
baris/uzgun: Abla… O kadın… halka mı dedi? Sol kulağında mı?
> Cevap vermedim. Vermem gerekmiyordu.
baris/uzgun: Hayır. Hayır abla. Tolga değil. Tolga…
> Cümlesini bitiremedi. Başını balkonun demirine, ya da masanın soğuk yüzeyine, dayadı; hangisi olduğu fark etmezdi.
~ Bir gerçeğe varmak bir zaferdir derler. Kimse, o gerçeğin başka birinin evini yıktığını söylemez.
`),
    }),
    option('BQ_NEDEN', '“Neden ilk gün söylemedin?”', {
      visibleWhen: flag('fact_tolga'),
      score: { SORGULAMA: 20 },
      responses: [
        W(
          flag('motor_soruldu'),
          `
baris/uzgun: Mahkemede de sordun. Motor nerede dedin. “Aşağıdaydı” dedim. Yalan değildi; sabah aşağıdaydı.
baris: Söyleseydim işten atılırdım, Tolga hesap yüzünden yanardı. Bir de… bir de aklıma bile gelmedi abla. Tolga’yla bir kadının çantası aynı cümleye sığmıyor.
`,
        ),
        O(`
baris: Söyleseydim işten atılırdım. Tolga hesap yüzünden yanardı. İkimiz birden.
baris: Bir de… aklıma bile gelmedi abla. Tolga’yla bir kadının çantası aynı cümleye sığmıyor kafamda. Hâlâ sığmıyor.
`),
      ],
    }),
    option('B_DOGRU', '“Bunu mahkemede sen anlatacaksın. Ben kayıtlarla göstereceğim.”', {
      visibleWhen: flag('fact_tolga'),
      score: { SAVUNMA_STRATEJISI: 50 },
      effects: [raise('baris_hazir'), inc('trust', 6)],
      good: 'Müvekkile ne söyleyeceğini değil, doğruyu söylemesini tavsiye ettin; anlatı kayıtlarla desteklenecek.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Hesabı paylaştığını mahkemede sen anlatacaksın Barış. Ben de kayıtlarla göstereceğim. Kimin suçlu olduğuna mahkeme karar verir; bizim işimiz neyin doğru olduğunu söylemek.
baris/uzgun: Tolga’yı mı satacağım yani?
- Hayır. Doğruyu söyleyeceksin. Gerisi Tolga’nın kendi hikâyesi.
> Uzun bir sessizlik. Sonra başını salladı. Bir kez.
baris: Abla… Tolga’ya bir şey olacak mı?
- Bilmiyorum Barış. Bu benim kararım değil. Senin de değil.
baris/uzgun: O benim yerime çalışıyordu. Benim hesabımla, benim motorumla. Bana para getiriyordu, ilaç parası. Annemin ilacını o aldı geçen ay.
~ Bir aile bir hesabı paylaşıyor; bir motoru, bir ilacı, bir sofrayı. Şimdi bir suçu da paylaşmak zorunda kalıyorlar; ama suç paylaşılmaz.
`),
      next: HUB,
    }),
    option('B_SAKLA', '“Şimdilik Tolga’dan kimseye söz etme.”', {
      visibleWhen: flag('fact_tolga'),
      score: { SAVUNMA_STRATEJISI: -40 },
      effects: [raise('baris_sakla')],
      bad: 'Hesabı paylaştığını saklamak, savcılığın kayıtlarını cevapsız bırakır; savunmanın en güçlü gerçeğini gömersin.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Şimdilik Tolga’dan kimseye söz etme. Önce kayıtları toparlayayım.
baris: Sağ ol abla. Sağ ol.
> Rahatladı. Ben rahatlamadım.
~ Bir gerçeği ertelemek, onu bir başkasının ağzından duymaya razı olmaktır. Genellikle savcının.
`),
      next: HUB,
    }),
    toHub('BARIS_BITIR', 'Şimdilik bu kadar'),
  ],
});

// --- Derya ---

const derya = conversation('ARA_DERYA', {
  ...ARA,
  title: 'Derya',
  background: 'kafe',
  room: { label: 'KUAFÖR · DERYA', character: 'derya' },
  lines: B(`
# PERŞEMBE 20.30 — YILDIRIM, DERYA KUAFÖR [bg:kafe]
> Salon kapanmıştı. Kepenk yarıya kadar indirilmiş, içeride tek lamba. Aynalar karşılıklı; Derya her yönden sonsuz kez çoğalıyordu.
> Bir sandalyenin üstünde oturuyor, bir makası açıp kapatıyordu. Tık. Tık.
derya: Barış aradı. Tolga’yı söyledi. Hesabı. Sen biliyorsun artık, değil mi canım?
- Biliyorum.
> Makas durdu.
derya: Ben de biliyordum.
> Aynada gözlerimiz buluştu. Gerçek yüzlerimizden önce.
derya: 19 Ocak. Sabah altıya on var. Salonu açmadan annemlere uğradım, Barış’ın ilacı için. Merdivende Tolga. Sırılsıklam. Kolu yırtık.
derya: “Ne oldu” dedim. “Düştüm abla” dedi. Paspası kaldırdı, bir anahtar koydu, gitti. İkişer ikişer indi merdiveni.
derya: İki saat sonra polis geldi, Barış’ı aldı. Gasp dediler. Merdiven dediler. Ben… ben o paspasa baktım.
> Makası tezgâha bıraktı. Elleri titriyordu; sigara yakmak istedi, çakmağı bulamadı.
derya: Sustum canım. Bir kardeşi kurtarmak için öbürünü yakmak istemedim. Tolga da benim kardeşim gibi. Annesi öldüğünde ben büyüttüm onu da.
derya: Salonun parasıyla seni tuttum. Belki… belki Tolga’yı hiç söylemeden kurtarırsın diye. Kurtarabilirdin, değil mi? Söylemeden?
~ “Bir şey daha… yok, boş ver.” Büroda yarım bıraktığı cümle buydu.
`),
  choices: [
    option('D_SAVCI', '“Bunu savcıya sen anlatabilirsin. Ben seni yönlendiremem.”', {
      score: { SAVUNMA_STRATEJISI: 60 },
      effects: [raise('derya_konustu')],
      good: 'Tanık olabilecek aile üyesine ne yapacağını dikte etmedin; savcılığa başvurma yolunu gösterdin (CMK 158). Tanıklıktan çekinme hakkı onun kararı.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Derya Hanım, ben Barış’ın avukatıyım. Size ne yapacağınızı söyleyemem; söylememeliyim de.
- Ama bildiğinizi savcılığa siz anlatabilirsiniz. Ya da anlatmayabilirsiniz; bu sizin hakkınız. Tolga’yla konuşmak da sizin hakkınız.
derya: Sen ne yapacaksın?
- Bildiğimi yazacağım. Savcıya. Kayıtlarla.
> Derya uzun uzun aynaya baktı. Kendine değil; aynadaki sonsuz Derya’lardan birine.
derya: Tolga’yla ben konuşurum. Ben. Senden önce, polisten önce. Ona bunu borçluyum.
`),
      next: HUB,
    }),
    option('D_TOLGA', '“Tolga’yı ikna edin; teslim olsun.”', {
      score: { SAVUNMA_STRATEJISI: -40 },
      effects: [raise('derya_konustu'), dec('trust', 10)],
      bad: 'Amacın meşru; ama müvekkilin avukatı olarak üçüncü kişinin ailesine ne yapması gerektiğini söylemek bir yönlendirmedir. Bilgiyi savcılığa sen bildirirsin (CMK 158); aile kendi kararını verir.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Tolga’yı ikna edin Derya Hanım. Teslim olsun. Hem Barış için hem kendisi için.
derya/kizgin: Kolay mı canım? Annesiz büyümüş bir çocuğa “git hapse gir” mi diyeyim?
> Sustu. Makası yeniden eline aldı. Tık.
derya: Konuşurum. Ama ne diyeceğime ben karar veririm.
> Salondan çıkarken telefonum titredi. Leyla. Derya’nın sesinden anlamış; Derya önce onu aramış.
leyla: Bir aileye kimi teslim edeceğini söyleyemezsin Deniz. Sen bildiğini savcıya yazarsın; kim ne yapacak, kendisi karar verir. [phone]
leyla: Yoksa yarın o çocuk “avukat beni ailemle sıkıştırdı” der ve haklı olur. [phone]
`),
      next: HUB,
    }),
    option('D_SUS', '“Şimdilik bunu kimseye anlatmayın.”', {
      score: { SAVUNMA_STRATEJISI: -40 },
      effects: [raise('derya_sus')],
      bad: 'Delil olabilecek bir bilgiyi saklamasını istedin; savunma gerçeği göstermek yerine örtmeye başladı.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Şimdilik bunu kimseye anlatmayın. Kayıtlarla ilerleyeceğim.
derya: Peki canım. Sen bilirsin.
> Rahatlamıştı. Kepengi kaldırırken bana teşekkür etti. Ben karşılık vermedim.
~ Bir kadına sus dedim. Kırk gündür zaten susuyordu.
`),
      next: HUB,
    }),
  ],
});

// --- Kebapçı ---

const kebapGiris = decisionNode('ARA_KEBAP_G', [{ to: 'ARA_KEBAP' }], {
  ...ARA,
  title: 'Tophane Kebap Salonu',
  onFirstEnter: [meet('cemal')],
  lines: B(`
# CUMA 23.25 — TOPHANE KEBAP SALONU, ARKA KAPI [bg:sokak_gece]
> Saat 23.25. O geceyle aynı saat. Arka kapıda üç kurye bekliyor; sarı kutular yağmurda parlıyor. Biri sigarasını avucunun içinde saklıyor.
> Izgaranın dumanı kapıdan dışarı taşıyor. Cemal Usta şişleri çeviriyor; bana bakmadan “Avukat mısın, sipariş mi?” diyor.
~ Bir kurye nerede sipariş alırsa, orada biri onu görmüştür. Kayıtlar bir hesabı gösterir; insanlar bir yüzü.
- Avukatım. Ocak’ta bir gece, 23.31’de buradan sipariş alan kuryeyi soruyorum.
cemal: Ocak mı? Ocakta her gece yağmur, her gece kurye. Hangisini hatırlayayım abla?
- 18 Ocak. Kayhan’a bir sipariş. Kurye bir saat sonra soğuk teslim etmiş.
cemal: Kayhan… Dur. Müşteri ertesi gün aradı, bağırdı. “Kebap buz gibiydi” dedi. Ben de kuryeye kızdım, bulamadım. Kim olduğunu bilmiyordum ki.
~ Bir şikâyet. Bir soğuk kebap. Bir aşçının öfkesi. Hafızalar böyle şeylere tutunur; tarihlere değil.
`),
});

const kebap = retarget(
  sceneSearch('ARA_KEBAP', {
    ...ARA,
    title: 'Tophane Kebap Salonu · arka kapı',
    hud: ['taps4'],
    exposeCounts: true,
    scene: 'sc_kebap',
    background: 'sokak_gece',
    instruction: 'Dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
    costVar: 'taps4',
    miss: fallback('FB_KEBAP', 'TAP', {
      score: { ARASTIRMA: -10 },
      feedback: { text: 'Yağ, duman, yağmur. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
    }),
    finish: { id: 'KEBAP_BITIR', label: 'Kebapçıdan ayrıl' },
  }),
  HUB,
);

// --- Kadir (tanık hazırlığı) ---

const kadir = conversation('ARA_KADIR', {
  ...ARA,
  title: 'Kadir Usta',
  background: 'ev',
  room: { label: 'ÜST KAT · TERZİ', character: 'kadir' },
  lines: B(`
# CUMARTESİ 10.00 — YILDIRIM, ÜST KAT [bg:ev]
> Kadir Usta bir ceketin kolunu söküyordu. Makas, iğne, tebeşir. Beni görünce gözlüğünü çıkardı.
kadir: Mahkeme kâğıdı geldi. Salı günü. Üç gündür uyumuyorum avukat; zaten uyumuyordum, şimdi hiç uyumuyorum.
kadir: Savcı bana ne soracak? Gözlerimi soracak, biliyorum. Karanlığı soracak. Ben ne diyeceğim?
kadir: Bir de bir şey var avukat. Dün akşam merdivende seni gördüm sandım; “Avukat hanım” dedim. Derya’ymış. Güldü. Ben gülemedim.
kadir: Gördüm mü görmedim mi bilmediğim şeyi mahkemede söylemem. Onu sana söylüyorum ki bil: bu gözler her şeyi görmez.
~ Dürüst bir tanığın en büyük gücü, neyi görmediğini bilmesidir.
`),
  choices: [
    option('KA_DOGRU', '“Ne hatırlıyorsanız onu. Bilmediğinizi bilmiyorum deyin.”', {
      score: { SAVUNMA_STRATEJISI: 50 },
      effects: [raise('kadir_hazir')],
      good: 'Tanığı içerik bakımından yönlendirmeden yalnızca usul hakkında bilgilendirdin; dürüst bir “bilmiyorum” tanığı güçlendirir.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Hatırladığınızı anlatacaksınız Kadir Usta. Bilmediğiniz bir şeyi sorarlarsa “bilmiyorum” diyeceksiniz. Gözlerinizi sorarlarsa, bana söylediğiniz gibi söyleyeceksiniz.
kadir: Bilmiyorum demek ayıp değil mi mahkemede?
- Mahkemede en ayıp şey, bilmediğini bilir gibi yapmaktır.
kadir: Hı. Terzilikte de öyle. Ölçüyü bilmeyen “olur olur” der; ceket olmaz.
kadir: Gözlerimi sorarlarsa ne diyeyim? Katarakt mı diyeyim, bulanık mı?
- Ne ise onu. Katarakt. Ameliyat bekliyorsunuz. Uzağı bulanık, yakını net. Ve siz yüz demediniz; ses dediniz.
kadir: Ses dedim. Ses yalan söylemez avukat. Yüzler değişir; öksürük değişmez.
`),
      next: HUB,
    }),
    option('KA_SAAT', '“Saati sorarlarsa 23.40 deyin; kayıt öyle.”', {
      effects: [inc('ethics'), raise('kadir_kocluk'), score('SAVUNMA_STRATEJISI', -50)],
      bad: 'Tanığa bilmediği bir saati söyletmeye çalıştın: tanığı yönlendirmek meslek kurallarına aykırıdır (Av.K. 34), yalan tanıklığa azmettirme riski taşır (TCK 272, 38) ve tanıklığı çürütür.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Saati sorarlarsa 23.40 deyin. Kayıt zaten öyle.
kadir: 23.40. Peki.
> Bir şey diyecekti. Demedi. Ceketin kolunu söktüğü yere iğneyi sapladı; biraz sert.
`),
      next: HUB,
    }),
    option('KA_GELME', '“Gelmek istemezseniz anlarım.”', {
      score: { SAVUNMA_STRATEJISI: -20 },
      effects: [raise('kadir_gelmez')],
      neutral:
        'Çağrılan tanık gelmekle yükümlüdür (CMK 44); korkusunu meşrulaştırmak, mazeretin tek bağımsız sesini kaybettirebilir.',
      responses: B(`
- Gelmek istemezseniz anlarım Kadir Usta. Zorlamam.
kadir: Sağ ol avukat. Ben… doktor raporu alırım belki. Gözlerimden.
~ Korkusunu kolaylaştırdım. Mazeretin tek bağımsız sesini de kendi elimle kıstım.
`),
      next: HUB,
    }),
  ],
});

// --- Karar ---

const karar = story('ARA_KARAR', {
  ...ARA,
  title: 'Bir isim',
  background: 'buro_gece',
  hud: ['ara_day', 'ara_ap'],
  lines: [
    W(
      any(has('ded_baskasi'), has('ded_hesap')),
      `
# BÜRO — GECE [bg:buro_gece]
> Panonun ortasında bir boşluk vardı; şimdi orada bir isim yazmak istiyordum. Yazmadım.
~ Kayıtlar, bir özçekim, bir mesaj. Hesabı o gece başkası taşıyordu ve o başkasının bir adı var.
~ Ne yapacağım? Bu soru bir avukatın değil, bir insanın sorusu. Cevabı bir avukatınki olmalı.
`,
    ),
    O(`
# BÜRO — GECE [bg:buro_gece]
> Panonun ortasında bir boşluk. Bir isim duydum; Barış’ın ağzından. Henüz bir kanıt değil, bir isim.
~ Ne yapacağım? Bu soru bir avukatın değil, bir insanın sorusu. Cevabı bir avukatınki olmalı.
`),
  ],
  choices: [
    option('K_BILDIR', 'Bildiklerini savcıya yaz', {
      score: { USUL_BILGISI: 100, SAVUNMA_STRATEJISI: 50 },
      effects: [
        raise('bildirdi'),
        raise('karar_verildi'),
        inc('legal_hits'),
        // Savcının harekete geçmesi için bildirim kayıtlara bağlı olmalı: cihaz+mesaj, özçekim+halka ve bütün bir dosya.
        ifThen(all(has('ded_baskasi'), has('ded_hesap'), ref('dosya_butun')), [raise('bildirim_guclu')]),
      ],
      good: 'Başka bir kişinin faili olabileceğine dair bilgiyi Cumhuriyet savcılığına bildirdin (CMK 158, 160) ve kayıtların, usulüne uygun teşhisin istenmesini talep ettin. Şüpheliyi aramak kolluğun işidir.',
      category: 'USUL_BILGISI',
      next: 'ARA_BILDIR',
    }),
    option('K_YUZLES', 'Tolga’yı bul, onunla konuş', {
      score: { SAVUNMA_STRATEJISI: -80 },
      effects: [raise('tolga_kacti'), raise('karar_verildi')],
      bad: 'Avukat şüpheliyi kovalamaz ve sorgulamaz; bilgiyi savcılığa bildirir (CMK 158–160). Yüzleşme şüpheliyi uyardı.',
      category: 'SAVUNMA_STRATEJISI',
      next: 'ARA_YUZLES',
    }),
    option('K_NERMIN', 'Özçekimi Nermin Hanım’a göster', {
      visibleWhen: has('ev_selfie'),
      effects: [inc('ethics', 2), raise('etik_kirlik'), raise('karar_verildi'), score('SAVUNMA_STRATEJISI', -150)],
      bad: 'Tanıklık eden mağdura tek bir fotoğraf göstermek, kolluğun hatasını savunma eliyle tekrarlamaktır: meslek kurallarına aykırıdır (Av.K. 34), tanığı etkileme olarak değerlendirilebilir (TCK 277); yeni “teşhis” değersizdir (PVSK ek md. 6).',
      category: 'SAVUNMA_STRATEJISI',
      next: 'ARA_NERMIN',
    }),
    toHub('K_BEKLE', 'Şimdilik bekle, kayıt topla'),
  ],
});

const bildir = story('ARA_BILDIR', {
  ...ARA,
  title: 'Savcılık',
  background: 'adliye',
  onFirstEnter: [meet('orhan')],
  lines: [
    W(
      flag('bildirim_guclu'),
      `
# PAZARTESİ 09.30 — BURSA CUMHURİYET BAŞSAVCILIĞI [bg:adliye]
> Savcı Orhan Bayar’ın odası küçüktü; dosya yığınları, bir saksı, sararmış bir takvim. Dilekçemi okudu. İki kez. Ekleri tek tek çevirdi.
orhan: Kayıtlar, saatler, ekler. Oturum başka bir telefondan açılmış. Hesabı o gece başkası kullanıyormuş.
orhan: Bunu bana getirdiniz. Mahkemede sürpriz yapmak yerine.
- Bu bir sürpriz değil Sayın Savcım. Bir suç duyurusu. Şüpheliyi bulmak benim işim değil.
> Savcı gözlüğünü çıkardı. İlk kez gülümsediğini gördüm; yorgun, kısa.
orhan: Değil. Benim işim. Kayıtları ben isterim, kişiyi ben çağırırım. Teşhis gerekirse usulüyle yapılır; bu sefer usulüyle.
orhan: Siz müvekkilinizi savunun avukat hanım. Ben de gerçeği. Bazen aynı yere çıkar bu iki yol.
> Kapıya kadar yürüdüm. Savcı arkamdan seslendi.
orhan: Avukat hanım. Teşhis tutanağını ben de okudum. Dün gece. İlk kez dikkatle.
orhan: İddianameyi yazarken okumamıştım. Bir polis “usulüne uygun” dedi, ben de yazdım. Bunu size söylememem gerekir; söylüyorum.
~ Okunmamış bir kâğıt. Bu dosyada herkes bir sayfayı atlamış. Polis, savcı, önceki avukat, belki ben de. Önemli olan, şimdi okumak.
`,
    ),
    O(`
# PAZARTESİ 09.30 — BURSA CUMHURİYET BAŞSAVCILIĞI [bg:adliye]
> Savcı Orhan Bayar dilekçemi okudu. Bir isim, bir mesaj; ama kayıtlarla bağlanmamış.
orhan: Bir kuzen. Bir hesap. Bir mesaj. Avukat hanım, bu bir suç duyurusu mu, yoksa bir aile hikâyesi mi?
- Bir suç duyurusu Sayın Savcım. Kayıtların istenmesini talep ediyorum.
orhan: İsterim. Çağırırım. Ama mahkemede bana bundan fazlasını getirmeniz gerekecek.
`),
  ],
  choices: [cont('BILDIR_DON', 'Büroya dön', HUB, { role: 'PRIMARY' })],
});

const yuzles = story('ARA_YUZLES', {
  ...ARA,
  title: 'Demirtaş',
  background: 'sokak_karanlik',
  lines: B(`
# PAZARTESİ 22.50 — DEMİRTAŞ, BİR İŞÇİ PANSİYONU [bg:sokak_karanlik]
> Derya’dan adresi almıştım; ne için istediğimi söylemeden. İkinci katta bir ışık. Merdiven boşluğunda kızartma yağı ve rutubet.
> Kapıyı çaldım. İçeride bir şey devrildi. Ayak sesleri. Pencere.
- Tolga! Konuşmak istiyorum. Sadece konuşmak!
> Pencere açıldı ve kapandı. Arka bahçede biri çite tırmandı. Bir motor değil; koşan adımlar. Sonra hiçbir şey. {shake}
> Telefonum titredi. Leyla.
leyla: Neredesin? Derya aradı, Demirtaş’a gittiğini söyledi. [phone]
- Tolga kaçtı.
leyla: Tabii kaçtı. Bir avukat gece yarısı kapısını çalarsa sen de kaçardın. [phone]
leyla: Kovalamak avukatın işi değildir Deniz. Biz kolluk değiliz. Bildiğini savcıya yazarsın; arayan o olur, bulan o olur. [phone]
leyla: Şimdi bulunacak bir adam yok. Bir de “avukat beni uyardı” diyecek bir adam var. Yarın sabah dilekçeni yine yazacaksın; bu sefer geç. [phone]
~ Merdivenin ortasında durdum. Bir adamı yakalamak istemedim; sadece onun ağzından duymak istedim. Şimdi kimse onun ağzından hiçbir şey duymayacak.
`),
  choices: [cont('YUZLES_DON', 'Büroya dön', HUB, { role: 'PRIMARY' })],
});

const nermin = story('ARA_NERMIN', {
  ...ARA,
  title: 'Setbaşı',
  background: 'sokak_yagmur',
  lines: B(`
# PAZARTESİ 19.10 — SETBAŞI [bg:sokak_yagmur]
> Bu sefer kapı zincirsiz açıldı. Nermin Hanım yorgundu; kürsüdeki o anı bırakmamıştı onu.
nermin: Avukat kızım. Gel. Uyuyamıyorum zaten.
> Telefonumu çıkardım. Özçekimi açtım. Ekranı onun yüzüne doğru tuttum.
- Bu kişiyi tanıyor musunuz Nermin Hanım?
> Kadın ekrana baktı. Ekran ona baktı. Ve aynı şey oldu; acil servisteki gibi, perdenin arkasındaki gibi.
nermin/saskin: Bu… Bu o mu? Bu da mı? Kulağında… Bilmiyorum. Bir fotoğraf daha. Bir yüz daha.
nermin/uzgun: Neden herkes bana bir fotoğraf gösteriyor evladım? Ben hangi yüzü gördüm? Söyle bana, hangisini?
> Telefonu indirdim. Elim titriyordu.
~ Bir polisin yaptığını yaptım. Daha iyi bir niyetle. Niyet, bir hafızayı temizlemez.
`),
  choices: [cont('NERMIN_DON', 'Büroya dön', HUB, { role: 'PRIMARY' })],
});

const zarf = story('ARA_ZARF', {
  ...ARA,
  title: 'Zarf',
  background: 'buro_gece',
  lines: B(`
> Masamın çekmecesinde Tolga’nın zarfı. Islak lekesi kurumuş, kenarları dalgalanmış.
~ Ücretimin bir kısmını, müvekkilimin yerine yargılanması gereken kişi ödemiş olabilir. Bu cümleyi kafamda iki kez kurdum; ikisinde de midem bulandı.
`),
  choices: [
    option('Z_IADE', 'İade et; Barış’a ve Derya’ya açıkla', {
      score: { SAVUNMA_STRATEJISI: 40 },
      effects: [raise('zarf_karar')],
      good: 'Menfaati müvekkilinle çatışabilecek bir kişiden alınan ücreti iade ettin ve müvekkilini bilgilendirdin (Av.K. 34; meslek kurallarında çıkar çatışması).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
> Zarfı bir makbuzla birlikte Derya’ya teslim ettim; ne olduğunu anlattım. Derya zarfa baktı, açmadı.
derya: Tolga… Senin ücretini mi ödemiş? Allah’ım. Bu çocuk ne yapmış böyle?
~ Bir avukatın ilk borcu müvekkilinedir. Bazen bu borç, bir zarfı geri vermekle ödenir.
`),
      next: HUB,
    }),
    option('Z_TUT', 'Şimdilik çekmecede kalsın', {
      effects: [raise('zarf_karar'), raise('zarf_tuttu'), inc('ethics'), score('SAVUNMA_STRATEJISI', -50)],
      bad: 'Müvekkilinle çıkar çatışması içindeki birinden alınan ücreti saklamak meslek kurallarına aykırıdır (Av.K. 34).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
> Çekmeceyi kapattım. Kilitledim.
~ Kimse bilmiyor. Bu cümle her etik ihlalin ilk cümlesidir.
`),
      next: HUB,
    }),
  ],
});

// --- Dilekçe ---

const dil = story('ARA_DIL', {
  ...ARA,
  title: 'Ek delil talebi',
  background: 'buro',
  lines: [
    W(cmp(v('ara_day'), '==', 1), `> Duruşmaya on dokuz gün var. Mahkemenin cevapları istemesi için zaman yeter; dilekçe erken giderse.`),
    W(cmp(v('ara_day'), '==', 2), `> Duruşmaya on iki gün var. Müzekkere bugün çıkarsa cevap yetişir; yarın çıkarsa belki.`),
    O(`> Duruşmaya beş gün var. Müzekkere bugün çıkarsa cevap duruşma sabahı gelir; ancak yetişir.`),
  ],
  choices: [
    option('AD_SELFIE', 'HızlıPaket’ten giriş cihazı ve doğrulama özçekimi', {
      visibleWhen: all(not(flag('selfie_istendi')), not(has('ev_selfie'))),
      responses: [
        W(flag('fact_dogrulama'), `~ Dökümde “kimlik doğrulama: onaylı” yazıyordu. Onaylanan yüzü görmek istiyorum.`),
        O(`~ Bir hesap nasıl açılır? Biri telefonuna bakar, bir yüz gösterir. O yüzü görmek istiyorum.`),
      ],
      maxUses: 1,
      score: { USUL_BILGISI: 60 },
      effects: [raise('ara_selfie_istendi'), raise('ara_dil_any')],
      good: 'Hesabı kimin kullandığını gösterecek kaydı ayrıca istedin (CMK 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_UEDAS', 'UEDAŞ’tan 18 Ocak kesinti kaydı', {
      visibleWhen: all(flag('fact_kesinti'), not(has('ev_uedas')), not(flag('dil_uedas'))),
      maxUses: 1,
      score: { USUL_BILGISI: 40 },
      effects: [raise('ara_uedas'), raise('ara_dil_any')],
      good: 'Mazeret tanığının anlatısını kayda bağlayacak belgeyi istedin.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_GAMZE', 'Hemşire Gamze Ateş’in tanık olarak dinlenmesi', {
      visibleWhen: all(has('clue_gamze_beyan'), not(flag('gamze_tanik'))),
      maxUses: 1,
      score: { USUL_BILGISI: 40 },
      effects: [raise('gamze_tanik'), raise('ara_dil_any')],
      good: 'Tek fotoğraf gösterimini gören tanığın dinlenmesini istedin (CMK 177–178).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_CEMAL', 'Cemal Usta’nın tanık olarak dinlenmesi', {
      visibleWhen: has('clue_cemal'),
      maxUses: 1,
      score: { USUL_BILGISI: 30 },
      effects: [raise('cemal_tanik'), raise('ara_dil_any')],
      good: 'Siparişi teslim eden kuryenin görünüşünü gören tanığın dinlenmesini istedin.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_KAMERA', 'Kebapçının kamera kaydı', {
      maxUses: 1,
      score: { USUL_BILGISI: -20 },
      effects: [raise('ara_dil_any')],
      bad: 'Kayıt yirmi günde üstüne yazılıyor; üç ay sonra istenen görüntü yok.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    cont('AD_VER', 'Dilekçeyi ver', HUB, {
      role: 'PRIMARY',
      effects: [raise('ara_dil_verildi')],
      enabledWhen: flag('ara_dil_any'),
    }),
    toHub('AD_GERI', 'Vazgeç'),
  ],
});

// --- Tahta ---

const POOL2 = [
  'clue_cam',
  'clue_aski',
  'clue_motor',
  'clue_ates',
  'clue_aile_foto',
  'clue_vesikalik',
  'clue_gamze_beyan',
  'clue_halka',
  'clue_bicak_yok',
  'clue_foto_farkli',
  'clue_tarif_sonra',
  'clue_tek_tekrar',
  'clue_kulak',
  'clue_eski_foto',
  'clue_kadir',
  'clue_ali_halka',
  'clue_ferhat',
  'clue_kesinti',
  'clue_selfie',
  'clue_cihaz',
  'clue_durak',
  'clue_mesaj',
  'clue_186',
  'clue_siparis',
  'clue_cemal',
  'clue_bahis',
];

const newDed = (title: string, text: string) => ({
  title,
  text,
  label: 'YENİ DELİL · +300 SKOR',
  tone: 'success' as const,
});

const cikarim = retarget(
  deductionBoard('ARA_CIKARIM', {
    ...ARA,
    title: 'Çıkarım tahtası',
    background: 'buro_gece',
    lines: B(`
> Pano büyüdü. Yeni kâğıtlar, yeni iğneler. Kırmızı ip artık merdivenden kebapçıya, kebapçıdan bir telefona uzanıyor.
`),
    pool: POOL2,
    recipes: [
      recipe('AC_BASKASI', 'clue_selfie', 'clue_halka', {
        effects: firstTime('ded_baskasi'),
        feedback: newDed(
          'Hesabı taşıyan, mağdurun tarif ettiği kişiydi',
          'Özçekimdeki sol kulak halkası, 112’deki halkayla aynı.',
        ),
        responses: B(`
~ Bir makinenin hafızası ile bir kadının ilk sözleri, aynı kulağı gösteriyor. Sol kulak. Halka. Ve Barış’ın kulakları hiç delinmemiş.
`),
      }),
      recipe('AC_BASKASI2', 'clue_cemal', 'clue_halka', {
        effects: firstTime('ded_baskasi'),
        feedback: newDed(
          'Hesabı taşıyan, mağdurun tarif ettiği kişiydi',
          'Siparişi alan kuryenin kulağı halkalıydı; 112’deki fail de öyle.',
        ),
        responses: B(`
~ Kebapçı ustası bir yüzü değil, bir halkayı hatırladı. Mağdur da. On bir dakika arayla, iki farklı yerde, aynı halka.
`),
      }),
      recipe('AC_HESAP', 'clue_cihaz', 'clue_mesaj', {
        effects: firstTime('ded_hesap'),
        feedback: newDed('O gece hesap başkasının telefonundaydı', '22.31 mesajı ve Redmi …7741: hesabı başkası açtı.'),
        responses: B(`
~ Kayıt hesabın yerini gösterir. Mesaj ve cihaz, hesabın elini gösteriyor. O el Barış’ın değil.
`),
      }),
      recipe('AC_EVDE', 'clue_186', 'clue_kesinti', {
        effects: firstTime('ded_evde'),
        feedback: newDed(
          '23.40’ta Yıldırım’dan arıza hattı arandı',
          'Kesintinin ortasında Barış’ın telefonu evinden 186’yı aradı.',
        ),
        responses: B(`
~ 23.40’ta Yıldırım’da bir telefon arıza hattını arıyor. 23.42’de dört kilometre ötede bir kadın itiliyor. Aynı insan iki dakikada ikisini yapamaz.
`),
      }),
      ...invRecipes('AC'),
      recipe('AC_X_DURAK', 'clue_durak', 'clue_motor', {
        score: { DELIL_ANALIZI: -50 },
        feedback: {
          title: 'Doğru ama eksik',
          text: 'Hesap oradaydı, motor da. Bunu savcı zaten söylüyor. Sorulması gereken başka: hesabı kim taşıyordu?',
          label: 'BAĞLANTI YOK · −50 SKOR',
          tone: 'error',
        },
      }),
      recipe('AC_X_BAHIS', 'clue_bahis', 'clue_aile_foto', {
        score: { DELIL_ANALIZI: -50 },
        feedback: {
          title: 'Tahmin, kanıt değil',
          text: 'Bir bahis borcu ve eski bir aile fotoğrafı. Bir hikâye kuruyor; bir kanıt kurmuyor.',
          label: 'BAĞLANTI YOK · −50 SKOR',
          tone: 'error',
        },
      }),
    ],
    miss: fallback('FB_CIKARIM2', 'COMBINE', {
      repeat: 'ONCE_PER_PARAMS',
      score: { DELIL_ANALIZI: -50 },
      feedback: {
        title: 'Bu ikisi birbirini açıklamıyor',
        text: 'Başka bir ipucu dene.',
        label: 'BAĞLANTI YOK · −50 SKOR',
        tone: 'error',
      },
    }),
    finish: { id: 'CIKARIM2_BITIR' },
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
leyla: Kırmızı çizgiye bakıp duruyorsun. Çizgiye değil, çizginin üstündeki satırlara bak. Bir hesap nasıl açılır? Kim açar? Neyle açar?
leyla: Kayıtlar her zaman bir şey söyler. Ama kayıtların ne söylediği ile savcının ne okuduğu aynı şey değildir.
leyla: Bir de şunu düşün: bir şirket bir kurye hesabını neden kişiye özel tutar? Çünkü başkası kullanmasın diye. Peki başkası kullanmasın diye ne yapar?
leyla: Bir yüz ister. Bir telefon ister. Bu şirket o gece hangi yüzü, hangi telefonu görmüş? Savcı bunu sormadı. Sen sor.
~ Leyla bir soruyla cevap verir. Cevabı vermez; cevabın nerede olduğunu gösterir.
`,
    ),
    W(
      all(cmp(v('ara_day'), '==', 2), flag('fact_tolga')),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Bir isim duydun. Şimdi iki yol var. Birincisi: o ismi savcıya kayıtlarla yazarsın, CMK 158. Gerisini o yapar.
leyla: İkincisi: kendin bir dedektif olursun, kapı çalarsın, fotoğraf gösterirsin. İkinci yol hep daha hızlı görünür. Hiçbir zaman değildir.
leyla: Bir de aile var. Onlara ne yapacaklarını söyleme. Ne yapabileceklerini söyle. Fark küçük görünür; meslek o farktır.
leyla: Yıllar önce bir dosyam vardı. Bir müvekkil, bir kardeş, bir sır. Ben o kardeşin kapısını çaldım; çünkü daha hızlıydı. Kardeş kaçtı. Müvekkil… neyse.
> Masasının köşesindeki ters çerçeveye bir an baktı. Sonra bakmadı.
leyla: Hızlı yol, avukatı kahraman yapar. Doğru yol, müvekkili kurtarır. Bazen ikisi aynı yoldur. Çoğu zaman değil.
`,
    ),
    W(
      cmp(v('ara_day'), '==', 2),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Hâlâ müvekkilini gösteren bir kayıt var elinde. Ondan kaçma. Onu müvekkilinin önüne koy. Gerçeği en iyi, kaçamayacağı bir kâğıdın karşısında söyler insan.
`,
    ),
    O(`
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: İkinci celse. Savcı kaydı okuyacak, polisi dinletecek. Sen ne yapacaksın?
leyla: Polise kızma. Acele etmiş, baskı altında, bir kadının acısını bir yüzle doldurmuş. Onu yalancı çıkarma; usulü göster. Usul kendini anlatır.
leyla: Esas savunmanda üç şey yeter: teşhis neden değersiz, müvekkil o saatte nerede, hesabı kim taşıyordu. Fazlası gürültüdür.
leyla: Bir de Barış. Son söz onun. Ona ne söyleyeceğini söyleme. Sadece şunu söyle: doğru, en kısa cümledir.
leyla: Hükmü ayakta dinleyecek. Sen de ayakta dinleyeceksin. Ne gelirse gelsin, oturma; o otururken sen ayakta kal.
`),
  ],
  choices: [toHub('LEYLA2_DON', 'Teşekkür et')],
});

// --- Gün sonları ---

const dayEnd = decisionNode(
  'ARA_DAY_END',
  [{ when: cmp(v('ara_day'), '==', 2), to: 'ARA_AKSAM1' }, { to: 'ARA_AKSAM2' }],
  {
    ...ARA,
    title: 'Gün sonu',
    onEnter: [...gunSonu.effects, inc('ara_day', 1), set('ara_ap', ARA_AP)],
  },
);

const aksam1 = story('ARA_AKSAM1', {
  ...ARA,
  title: 'Akşam',
  background: 'buro_gece',
  lines: [
    W(
      flag('fact_tolga'),
      `
# GECE 23.00 — ARSLAN HUKUK [bg:buro_gece]
> Leyla gitmeden kapımda durdu. Paltosu koluna atılı, şemsiyesi elinde.
leyla: Bugün müvekkilinden şüphelendin mi?
- Bir an.
leyla: Güzel. Hiç şüphelenmeyen avukat, müvekkilinin hikâyesini değil kendi hikâyesini savunur.
leyla: Şimdi bir başkasından şüpheleniyorsun. Aynı kuralı ona da uygula. Bir an şüphelen; sonra kâğıda bak.
leyla: Bir de… o çocuğun bir ailesi var. Senin müvekkilinin ailesi aynı zamanda. Bir kuzen, bir abla, bir anne. Hepsi aynı sofrada büyümüş.
leyla: Sen o sofraya oturmayacaksın. Kapıda duracaksın. Avukatlık, bazen bir eşikte durmayı bilmektir.
> Şemsiyesini açtı, kapıda bir an bekledi, sonra merdivenlere yürüdü. Topuk sesleri, sonra sokak kapısı, sonra yağmur.
`,
    ),
    O(`
# GECE 23.00 — ARSLAN HUKUK [bg:buro_gece]
> Leyla gitmeden kapımda durdu.
leyla: Bugün müvekkilinden şüphelendin mi?
- Bir an. Belki hâlâ.
leyla: “Hâlâ” uzun bir kelime. Yarın onu kısaltacak bir şey bul.
`),
  ],
  choices: [cont('ARA_AKSAM1_DEVAM', 'Yeni gün', HUB, { role: 'PRIMARY' })],
});

const aksam2 = story('ARA_AKSAM2', {
  ...ARA,
  title: 'Gece',
  background: 'sokak_yagmur',
  lines: [
    W(
      flag('tolga_kacti'),
      `
# GECE 01.10 — SETBAŞI KÖPRÜSÜ [bg:sokak_yagmur]
> Eve yürüyerek döndüm. Gökdere’nin suyu köprünün altında bulanık akıyordu. Tolga’nın telefonu kapalıydı; Derya iki kez aradı, açmadım.
~ Bir adamı kaçırdım. Kendi elimle kapısını çalarak. Bunu bir dilekçeyle düzeltemem.
`,
    ),
    W(
      flag('bildirdi'),
      `
# GECE 01.10 — SETBAŞI KÖPRÜSÜ [bg:sokak_yagmur]
> Eve yürüyerek döndüm. Dilekçem savcının masasındaydı; bir isim, ekleriyle. Ne olacağını bilmiyordum.
~ İyi bir dilekçe bir kapıyı açmaz. Kapıyı açacak kişiye anahtarın nerede olduğunu söyler.
~ Barış’ı düşündüm. Balkonda, kırmızı çizgili bir kâğıdın karşısında. “O benim kardeşim.” Dilekçemde o kardeşin adı yazıyor.
~ Bir avukat müvekkilinin ailesini korumaz; müvekkilini korur. Bunu bir ders kitabında okumuştum. Ders kitapları balkonlarda yazılmaz.
`,
    ),
    O(`
# GECE 01.10 — SETBAŞI KÖPRÜSÜ [bg:sokak_yagmur]
> Eve yürüyerek döndüm. Yağmur köprünün korkuluklarından damlıyordu. Bir yerlerde bir motor geçti; sarı bir kutu, bir an, sonra karanlık.
~ Bu şehirde gece yarısı yüzlerce sarı kutu dolaşır. Hepsinin altında bir yüz var. Hepsi birbirine benziyor.
`),
  ],
  choices: [cont('ARA_AKSAM2_DEVAM', 'Son gün', HUB, { role: 'PRIMARY' })],
});

// --- Duruşmadan önceki gece ---

const sonNodes = [
  decisionNode('ARA_SON_1', [{ to: 'ARA_SON_2' }], {
    ...ARA,
    title: 'Duruşmadan önceki gece',
    onEnter: [
      ...son.effects,
      ifThen(
        all(
          flag('bildirim_guclu'),
          flag('derya_konustu'),
          not(flag('tolga_kacti')),
          cmp({ score: 'raw' }, '>=', T_TESLIM),
        ),
        [raise('tolga_teslim')],
      ),
    ],
    lines: B(`
# PAZARTESİ 22.40 — ARSLAN HUKUK [bg:buro_gece]
> Panoyu ikinci kez topluyordum. İlk celseden önce bu bir iskeletti; şimdi bir haritaya dönüşmüştü. Merdivenden kebapçıya, kebapçıdan bir balkona.
`),
  }),
  decisionNode('ARA_SON_2', [{ to: 'ARA_SON_3' }], {
    lines: [
      W(
        flag('tolga_teslim'),
        `
> Telefon çaldı. Derya. Sesi düz, yorgun; ağlamaktan sonra gelen o düzlük.
derya: Tolga’yı savcılığa ben götürdüm canım. Bugün öğleden sonra. Kendi ayağıyla girdi; ben kapıda bekledim. [phone]
derya: Anlattı. Her şeyi. Bahis borcu, adamlar, o gece… Saati de verdi. Kadının saatini. Odasında, bir çorabın içinde saklamış. Satamamış. [phone]
derya: Barış’a söyledim. Hiçbir şey demedi. Balkona çıktı. Hâlâ orada. [phone]
~ Bir dilekçe, bir ablanın sesi ve bir çorabın içinde on iki yıllık bir saat. Adalet bazen böyle görünür: yorgun, ıslak, geç.
`,
      ),
      W(
        flag('tolga_kacti'),
        `
> Derya mesaj attı: “Tolga’nın odası boş. Telefonu kapalı. Annemin emekli maaşından bir miktar çekmiş.” Başka bir şey yazmamıştı.
~ Kaçan bir adam suçlu olduğunu kanıtlamaz. Ama mahkemede kimse onun ağzından bir şey duymayacak.
`,
      ),
      W(
        flag('fact_tolga'),
        `
> Tolga’nın telefonu kapalıydı. Derya’nın da. Bir isim biliyordum; bir mahkeme ise isimlerle değil, kanıtlarla konuşur.
`,
      ),
      O(`
> Kayıtlar hâlâ müvekkilimi gösteriyordu. Ve ben, o kayıtların arkasında ne olduğunu tam bilmeden duruşmaya giriyordum.
`),
    ],
  }),
  decisionNode('ARA_SON_3', [{ to: 'ARA_SON' }], {
    lines: [
      W(
        flag('etik_kirlik'),
        `~ Nermin Hanım’ın sesi kulağımda: “Neden herkes bana bir fotoğraf gösteriyor?” Yarın bunu mahkemede de soracak. Bana.`,
      ),
      W(
        flag('kadir_kocluk'),
        `~ Kadir Usta’nın iğneyi ceketin koluna saplayışı. Bir saat ezberlettim; o da ezberledi. Yarın savcı ona saati soracak.`,
      ),
      W(flag('zarf_tuttu'), `~ Çekmece kilitli. Anahtarı cebimde. Ağırlığı bir zarfın ağırlığı değil.`),
      W(
        flag('fact_anahtar'),
        `~ “Anahtarı paspasın altına koydum.” 00.38. Bir motorun anahtarı, bir gecenin sonu, okunmamış bir mesaj.`,
      ),
      W(
        flag('fact_tolga_halka'),
        `~ “Sol kulağında. Askerden sonra taktı.” Barış bunu söylerken sesi bir kuzenin değil, bir kardeşin sesiydi.`,
      ),
      W(
        has('ded_baskasi'),
        `~ Bir halka. Sol kulakta. Bir makinenin hafızasında, bir kebapçının hafızasında, bir kadının ilk sözünde. Üçü aynı yeri gösteriyor.`,
      ),
      W(
        has('ded_evde'),
        `~ 23.40, Yıldırım, 186. Bir telefon, bir kesinti, bir balkon. Barış evdeydi; bunu artık bir makine de söylüyor.`,
      ),
      O(`~ Yarın ikinci celse. Elimde olanlar yeterli mi? Bunu yarın bir başkası söyleyecek.`),
    ],
  }),
  story('ARA_SON', {
    ...ARA,
    title: 'Duruşmadan önceki gece',
    background: 'sokak_yagmur',
    lines: B(`
> Pencereyi açtım. Yağmur dinmek üzereydi; ilk kez. Uludağ’ın üstünde bulutlar yırtılmış, arasından bir yıldız görünüyordu. Bursa’da nadir bir şey.
leyla: Uyu. Yarın uyanık olman gerek. Bir de: o kadına bakarken, ona üç ay önce kimsenin bakmadığı gibi bak. [phone]
> Masamın üstünde dosya, dosyanın üstünde kırmızı kalem. Leyla’nın ilk gün bıraktığı kalem. Kapağını kapattım.
~ Yarın bir polis yemin edecek. Bir terzi ölçtüğünü söyleyecek. Bir savcı bir kâğıt okuyacak. Ve ben, o kâğıdın okunmayan satırlarını okuyacağım.
~ Bir yüz değil, bir kayıt. Bir eminlik değil, bir saat. Bunu söylemek için üç ay ve altmış dört basamak gerekti.
`),
    choices: [cont('ARA_SON_DEVAM', 'Adliyeye git', 'T_00G_1', { role: 'PRIMARY' })],
  }),
];

export const ara: CasePart = {
  nodes: [
    ...girisNodes,
    hub,
    gps,
    tel,
    selfie,
    uedasDoc('ARA_UEDAS', ARA, HUB),
    barisGiris,
    baris,
    derya,
    kebapGiris,
    kebap,
    kadir,
    karar,
    bildir,
    yuzles,
    nermin,
    zarf,
    dil,
    cikarim,
    leyla,
    dayEnd,
    aksam1,
    aksam2,
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
  discoveryPaths: [...giris.discoveryPaths, ...gunSonu.discoveryPaths, ...son.discoveryPaths],
};
