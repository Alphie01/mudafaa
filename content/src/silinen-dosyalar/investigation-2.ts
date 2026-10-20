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
  documentExam,
  examine,
  fallback,
  flag,
  has,
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
import type { CasePart, ChoiceDef } from '../../../tools/content/src/kit/index.js';
import { B, O, W, retarget } from './dsl.js';
import { firstTime, invRecipes, newDed, tamDoc } from './investigation-1.js';
import { ARA, ARA_AP, ARA_DAYS } from './shared.js';

// 70-investigation-2: 1. ve 2. celse arası (3 gün × 3 EP; yığınsız). Bilirkişi ön inceleme, kart kaydı, operatör
// cevabı, poliçe zeyilnamesi; Nalan, Yaşar hazırlığı, Hakan; Selim’in eski şifre teklifi; eksper fotoğrafları;
// karar (savcılığa yaz / yüzleş / bekle).

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

const giris = deliver('ARA_GIRIS_1', [
  { evidence: 'ev_sema', requires: flag('bilirkisi_atandi'), hint: 'İlk celsede bilirkişi atanmasını isteyebilirdin.' },
  { evidence: 'ev_tam_log', requires: flag('tam_istendi') },
  { evidence: 'ev_turnike', requires: flag('kart_istendi'), hint: 'İlk celsede kart geçiş kayıtlarını isteyebilirdin.' },
  { evidence: 'ev_operator', requires: flag('opr_istendi'), hint: 'Silme oturumunun GSM hattını operatörden isteyebilirdin.' },
  { evidence: 'ev_zeyil', requires: flag('zeyil_istendi'), hint: 'Sigorta poliçesini isteyebilirdin.' },
]);

// --- Giriş ---

const girisNodes = [
  decisionNode('ARA_GIRIS_1', [{ to: 'ARA_GIRIS_2' }], {
    ...ARA,
    title: 'Ara',
    onEnter: [set('in_court', false), set('ara_day', 1), set('ara_ap', ARA_AP), ...giris.effects],
    lines: B(`
# İKİ GÜN SONRA · ÇARŞAMBA 18.40 — ARSLAN HUKUK [bg:buro_gece]
> Müzekkerelere cevaplar sırayla geldi. Kurumlar mahkemeye geç kalmayı sevmez; avukatlara geç kalmayı sever.
`),
  }),
  decisionNode('ARA_GIRIS_2', [{ to: 'ARA_GIRIS' }], {
    lines: [
      W(
        flag('bilirkisi_atandi'),
        `
> Mahkeme bir bilirkişi atamış: Dr. Sema Uçar. Bugün şirkete gidip orijinal disklere el koymuş, imaj almış. İlk tutanak elimde.
`,
      ),
      W(
        flag('koridor_umut'),
        `
> Gül her gün arıyordu. “Kapanır demiştiniz.” Bir kızgınlık değildi; bir tutunma. Her seferinde aynı şeyi söylüyordum: “Kayıtlar geliyor.”
`,
      ),
      O(`
> Selim balkonda oturuyormuş, sigarayı yeniden bırakmış, yine başlamış. Gül söyledi: “Konuşmuyor avukat hanım. Bir şey hesaplıyor.”
`),
    ],
  }),
  story('ARA_GIRIS', {
    ...ARA,
    title: 'Kayıtlar',
    background: 'buro_gece',
    lines: B(`
> Leyla odama girdi. Elinde bir dosya tomarı. Masaya bıraktı; üstüne avucunu koydu, bir an öyle durdu.
leyla: Müzekkerelerin cevapları. Oku. Ama önce şunu düşün: bu dosyada bir isim arıyorsun. İsmi kayıt verecek, sen değil.
> Oturdum. İlk sayfa. Sonra ikinci. Sonra geri döndüm, birincisine.
~ Bir kullanıcı adı, bir cihaz adı, bir hat, bir poliçe. Dört ayrı kurumdan dört ayrı kâğıt. Her biri tek başına bir şey söylemiyor. Yan yana koyunca bir yüz beliriyor; henüz bulanık.
leyla: Bir yüz görmeye başladın, değil mi? Yüzünden belli.
- Belki.
leyla: “Belki” iyi. Bir yüzü “belki” ile taşı. Kesinlik, kâğıt masaya geldiğinde gelir; bir dakika önce değil.
leyla: Ve şunu unutma: o yüz kimi gösterirse göstersin, sen onun peşinden koşmayacaksın. Yazacaksın. Savcıya yazacaksın. Biz avukatız; kolluk değil, kahraman hiç değil.
> Kapıdan çıkarken durdu.
leyla: Bir de müvekkilin. Kayıtlar onu akladıkça rahatlayacak. Rahatlayan insan konuşur. Konuştukça da bir şey daha anlatabilir. Dinle.
> Kapının eşiğinde bir an daha durdu. Masamdaki sigara paketine değil; pencereye baktı.
leyla: Dört yıl önce bir dosyam vardı. Bir kaydın “bu adam” dediği bir dosya. Ben de inandım o kayda. İnsan bir makineye inanınca rahatlar; sorumluluk makinede sanır.
leyla: Sonra o adamın masum olduğu çıktı. Çıktığında ben başka bir şehirdeydim, başka bir dosyadaydım. Ona bunu kimse söylemedi bile.
- Ne yaptınız?
leyla: Hiçbir şey. Yapamadım. O yüzden sana söylüyorum: kayda değil, kaydın kenarındaki boşluğa bak. Boşluklar konuşur; makineler sadece tekrar eder.
> Leyla gitti. Masanın köşesindeki ters çerçeveye baktım; yıllardır orada. Belki o dosyaydı, belki değil. Sormadım.
> Odada dört kurumun kâğıdı ve ben kaldım. Dışarıda yağmur, her zamanki gibi, herkesin üstüne aynı anda; suçlunun da, suçsuzun da, henüz hangisi olduğu belli olmayanın da.
~ Dört kâğıt. Bir yüz. Ve bir mentorun dört yıl taşıdığı bir pişmanlık. Bu dosyayı yalnızca ben kazanmayacağım; o da benimle kazanmak istiyor.
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
      act('A_SEMA', 'Bilirkişi tutanağını incele', 'ARA_SEMA', {
        once: true,
        description: 'Orijinal diskten imaj',
        visibleWhen: has('ev_sema'),
      }),
      act('A_TAM', 'Ham VPN kaydını incele', 'ARA_TAM', {
        once: true,
        description: 'Şirketin ham kaydı',
        visibleWhen: all(has('ev_tam_log'), not(visited('INV_TAM'))),
      }),
      act('A_TURNIKE', 'Kart geçiş kaydını incele', 'ARA_TURNIKE', {
        once: true,
        description: 'Geçişler ve zimmetler',
        visibleWhen: has('ev_turnike'),
      }),
      act('A_OPR', 'Operatör cevabını incele', 'ARA_OPR', {
        once: true,
        description: '02.14 hattı kimin?',
        visibleWhen: has('ev_operator'),
      }),
      act('A_ZEYIL', 'Poliçe zeyilnamesini incele', 'ARA_ZEYIL', {
        once: true,
        description: 'Sigorta cevabı',
        visibleWhen: has('ev_zeyil'),
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
      act('A_SELIM', 'Selim’le görüş', 'ARA_SELIM', { once: true, description: 'Kayıtlar onu aklıyor' }),
      act('A_NALAN', 'Nalan Korkmaz’la buluş', 'ARA_NALAN', {
        once: true,
        description: 'Gizli numara sahibi',
        visibleWhen: flag('nalan_ipucu'),
      }),
      act('A_YASAR', 'Yaşar Usta’yı hazırla', 'ARA_YASAR', {
        once: true,
        description: 'Tanık · duruşmaya üç gün',
        visibleWhen: flag('yasar_tanik'),
      }),
      act('A_HAKAN', 'Hakan Ilgaz’la konuş', 'ARA_HAKAN', {
        once: true,
        description: 'Orijinal diskler nerede?',
        visibleWhen: not(flag('fact_disk')),
      }),
    ],
  },
  {
    id: 't_ara_yer',
    label: 'OLAY YERİ',
    kind: 'SCENE' as const,
    choices: [
      act('A_EKSPER', 'Eksper raporu fotoğraflarını ara', 'ARA_EKSPER', {
        once: true,
        description: 'Sigorta dosyasındaki kareler',
        visibleWhen: has('ev_zeyil'),
      }),
    ],
  },
  {
    id: 't_ara_karar',
    label: 'KARAR',
    kind: 'ARCHIVE' as const,
    choices: [
      act('A_KARAR', 'Bildiklerinle ne yapacaksın?', 'ARA_KARAR', {
        description: 'Bir isim beliriyor',
        visibleWhen: all(flag('fact_gm'), not(flag('karar_verildi'))),
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
> Hedef: silme oturumunu kimin açtığını biliyorsun — bir kullanıcı adı. Hangi cihazdan, hangi hattan, kimin eliyle?
`,
    ),
    W(
      all(cmp(v('ara_day'), '==', 2), flag('fact_gm')),
      `
# ARA · GÜN 2/3 · İKİNCİ CELSEYE 12 GÜN
> Hedef: bir yüz belirdi. Bir yüz bir kanıt değildir. Kayıtlar, tanıklar ve doğru yol: savcılığa yaz.
`,
    ),
    W(
      cmp(v('ara_day'), '==', 2),
      `
# ARA · GÜN 2/3 · İKİNCİ CELSEYE 12 GÜN
> Hedef: cihaz ve hat kimi gösteriyor? Yedeği kim, ne zaman devre dışı bıraktı?
`,
    ),
    O(`
# ARA · GÜN 3/3 · İKİNCİ CELSEYE 5 GÜN
> Hedef: tanıklar, karar, son hazırlık. İkinci celsede kimi, neyi, hangi sırayla?
`),
  ],
  tabs: hubTabs.map((t) => ({ id: t.id, label: t.label, kind: t.kind, choices: t.choices.map((c) => c.id) })),
  scenePreview: { scene: 'sc_eksper' },
  choices: [
    ...hubTabs.flatMap((t) => t.choices),
    nav('A_DURUSMA', 'DURUŞMAYA GİT · 2. CELSE', 'ARA_SON_1', {
      role: 'PRIMARY',
      confirm: 'Duruşmaya gidersen ara evresi biter. Emin misin?',
    }),
  ],
};

// --- Belgeler ---

const sema = retarget(
  documentExam('ARA_SEMA', {
    ...ARA,
    title: 'Bilirkişi ön inceleme tutanağı',
    hud: ['sema_left'],
    background: 'buro_gece',
    lines: B(`
> Dört sayfa, sade bir dil. Mahkemenin bilirkişisi Dr. Sema Uçar. “Bulgu” ve “kanaat” ayrı başlıklar altında; bir mühendisin titizliği.
> Tutanağın ekinde bir not: “İnceleme, taraf vekillerine bildirilen saatte, şirket sunucu odasında başlamış; orijinal diske el konulmuş, kopya alınmış, özet değer tutanağa yazılmıştır.”
~ Taraf huzurunda, bildirilerek, tutanakla. DataKale’nin raporunda bu üç sözcüğün hiçbiri yoktu.
> Sema Uçar’ı bir kez gördüm, adliyenin bilirkişi odasında. Gözlüğünü alnına itmiş, bir disk kutusunun etiketini okuyordu. “Bulgularımı yazarım avukat hanım; kanaatimi mahkeme sorarsa söylerim.”
~ İlk tarafsız göz. Bir alet seç, satırlara dokun.
`),
    header: { left: 'BİLİRKİŞİ · ÖN İNCELEME TUTANAĞI', right: 'orijinal disk' },
    columns: [
      { label: 'BÖLÜM', flex: 1 },
      { label: 'BULGU', flex: 2.2 },
    ],
    rows: [
      row('s1', ['Usul', 'Orijinal diske el kondu · imaj alındı · özet değer tutanakta']),
      row('s2', ['02.14 oturumu', 'Cihaz adı: NOS-GM-LT · kaynak: GSM']),
      row('s3', ['18–19.10', 'Diskte kurtarma yazılımı yazma izleri (DataKale)']),
      row('s4', ['DataKale imajı', 'Bazı “silme izleri” kurtarma yazılımının kendi kayıtları']),
      row('s5', ['Kanaat', 'Silmenin sanığın cihazından yapıldığı söylenemez']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Emniyet raporuyla karşılaştır', 'compare')],
    costVar: 'sema_left',
    rules: [
      examine('EX_S_CIHAZ', 'compare', 's2', {
        discovers: 'clue_sema_cihaz',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · ORİJİNALDE CİHAZ ADI',
          text: 'Bilirkişi orijinal diskten okudu: 02.14 oturumunun cihaz adı NOS-GM-LT. DataKale’nin özetinde bu sütun hiç yoktu.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_S_YAZMA', 'mag', 's4', {
        discovers: 'clue_sema_yazma',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · SAHTE İZLER',
          text: 'DataKale raporundaki bazı “silme izleri” aslında kurtarma yazılımının kendi yazdığı kayıtlar. İmaj, olay gecesini değil, iki günlük kurcalamayı gösteriyor.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_S_KANAAT', 'mag', 's5', {
        score: { DELIL_ANALIZI: 60 },
        effects: [raise('fact_sema_kanaat')],
        feedback: {
          title: 'BİLİRKİŞİ KANAATİ',
          text: '“Silmenin sanığın cihazından yapıldığı söylenemez.” Bu cümle, bir şirketin değil, mahkemenin atadığı bir mühendisin.',
          label: '+60 SKOR',
          tone: 'success',
        },
      }),
      examine('EX_S_USUL', 'compare', 's1', {
        score: { DELIL_ANALIZI: 40 },
        feedback: {
          title: 'USULÜNE UYGUN',
          text: 'El koyma, imaj, özet değer, tutanak: emniyet raporundaki gibi. DataKale’de olmayan her güvence burada var.',
          label: '+40 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: fallback('ARA_SEMA_FB', 'EXAMINE', {
      score: { DELIL_ANALIZI: -20 },
      feedback: { title: 'SONUÇ YOK', text: 'Bu satırda bir şey yok.', label: '−20 SKOR', tone: 'error' },
    }),
    finish: { id: 'ARA_SEMA_BITIR' },
  }),
  HUB,
);

const turnike = retarget(
  documentExam('ARA_TURNIKE', {
    ...ARA,
    title: 'Kart geçiş kaydı ve zimmet listesi',
    hud: ['turn_left'],
    background: 'buro',
    lines: B(`
> İki sayfa. Birincide kart geçişleri, saat saat. İkincide demirbaş zimmet listesi; bilgisayarların adları ve kime zimmetli olduğu.
~ Kim girdi, kim çıktı. Yaşar Usta’nın sorusunun makineyle yazılmış hâli.
> Üst yazıyı şirketin insan kaynakları imzalamış; altında “mahkemenin talebi üzerine eksiksiz sunulmuştur” cümlesi. Eksiksiz sözcüğünün altı çizilmiş.
~ Bir kâğıt “eksiksiz” diye bağırıyorsa ya gerçekten eksiksizdir ya da birileri eksiği arayacak diye korkmuştur. Satırlara bakacağım.
`),
    header: { left: 'NİLÜFER ÖRME · KART GEÇİŞ VE ZİMMET', right: '17–18.10' },
    columns: [
      { label: 'SAAT / KALEM', flex: 1 },
      { label: 'AYRINTI', flex: 2.2 },
    ],
    rows: [
      row('p1', ['17.10 23.08', 'İdari bina girişi · kart: T. SEZER']),
      row('p2', ['17.10 23.11', 'Sunucu odası girişi · kart: T. SEZER']),
      row('p3', ['17.10 23.31', 'İdari bina çıkışı · kart: T. SEZER']),
      row('p4', ['Zimmet', 'NOS-GM-LT · dizüstü · T. Sezer']),
      row('p5', ['Zimmet', 'SELIM-PC · dizüstü · S. Aktaş (30.09 iade)']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Ham kayıtla karşılaştır', 'compare')],
    costVar: 'turn_left',
    rules: [
      examine('EX_P_GM', 'mag', 'p2', {
        discovers: 'clue_turnike_gm',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · SUNUCU ODASI',
          text: 'Cuma gece 23.11’de sunucu odasına girilmiş. Kart: T. Sezer. Yedeğin kablosu o gece, o odada çekildi.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_P_ZIMMET', 'compare', 'p4', {
        discovers: 'clue_zimmet',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · ZİMMET',
          text: '02.14 oturumunu açan cihaz NOS-GM-LT, genel müdürün zimmetinde. Silme oturumunun cihazı artık bir kişiye bağlı.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_P_SELIM', 'compare', 'p5', {
        score: { DELIL_ANALIZI: 60 },
        feedback: {
          title: 'KART İADE',
          text: 'SELIM-PC 30 Eylül’de iade edilmiş; Selim’in kartı da. İşten çıktıktan sonra o turnikeden geçemez.',
          label: '+60 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: fallback('ARA_TURN_FB', 'EXAMINE', {
      score: { DELIL_ANALIZI: -20 },
      feedback: { title: 'SONUÇ YOK', text: 'Bu satırda bir şey yok.', label: '−20 SKOR', tone: 'error' },
    }),
    finish: { id: 'ARA_TURN_BITIR' },
  }),
  HUB,
);

const opr = retarget(
  documentExam('ARA_OPR', {
    ...ARA,
    title: 'GSM operatörü cevabı',
    hud: ['opr_left'],
    background: 'buro',
    lines: B(`
> Operatörün mahkemeye cevabı. Tek bir oturum, tek bir saat; kanun dışına çıkmayan, dar bir cevap.
> Mahkeme yazısında yalnızca tek bir saat ve tek bir bağlantı sorulmuştu. Cevap da o kadar: ne bir konuşma kaydı ne bir rehber; bir hat, bir abone, bir baz istasyonu.
~ Dar sordum; dar cevap geldi. Bir avukatın istediği kadarı, hakkı olan kadardır. Fazlası başkasının hayatı.
~ Kaynağı “GSM” görünen oturum. Şimdi o GSM’in kime ait olduğunu okuyacağım.
`),
    header: { left: 'GSM OPERATÖRÜ · MAHKEME CEVABI', right: '18.10 02.14' },
    columns: [
      { label: 'ALAN', flex: 1 },
      { label: 'DEĞER', flex: 2.2 },
    ],
    rows: [
      row('o1', ['Bağlantı', '18.10 02.14 · adres ataması']),
      row('o2', ['Abone', 'Nilüfer Örme Tekstil A.Ş. (kurumsal hat)']),
      row('o3', ['Hat kullanıcısı', 'T. Sezer (genel müdür hattı)']),
      row('o4', ['Konum', 'Görükle baz istasyonu']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier')],
    costVar: 'opr_left',
    rules: [
      examine('EX_O_HAT', 'mag', 'o3', {
        discovers: 'clue_hat_gm',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · HAT',
          text: '02.14 bağlantısı şirketin kurumsal hattından; hat genel müdüre tahsisli. Silme oturumu Selim’in değil, o hattın bulunduğu yerden açıldı.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_O_KONUM', 'mag', 'o4', {
        score: { DELIL_ANALIZI: 60 },
        effects: [raise('fact_gorukle')],
        feedback: {
          title: 'GÖRÜKLE',
          text: 'Bağlantı Görükle’den. Selim’in evi Nilüfer’de, dört kilometre ötede; genel müdürün evi Görükle’de.',
          label: '+60 SKOR',
          tone: 'success',
        },
      }),
      examine('EX_O_ABONE', 'mag', 'o2', {
        score: { DELIL_ANALIZI: 40 },
        feedback: {
          title: 'KURUMSAL HAT',
          text: 'Abone bir kişi değil, şirket. Ama hat bir kişiye tahsisli. Şirket hatları birine zimmetlenir.',
          label: '+40 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: fallback('ARA_OPR_FB', 'EXAMINE', {
      score: { DELIL_ANALIZI: -20 },
      feedback: { title: 'SONUÇ YOK', text: 'Bu satırda bir şey yok.', label: '−20 SKOR', tone: 'error' },
    }),
    finish: { id: 'ARA_OPR_BITIR' },
  }),
  HUB,
);

const zeyil = retarget(
  documentExam('ARA_ZEYIL', {
    ...ARA,
    title: 'Siber poliçe ve zeyilnamesi',
    hud: ['zey_left'],
    background: 'buro',
    lines: B(`
> Sigorta şirketinin cevabı: ana poliçe ve bir zeyilname. Zeyilname bir sayfa; iki değişiklik, iki imza, bir tarih.
~ Bir zararın dayanağı bir poliçedir. Poliçenin dayanağı da bazen bir plan.
> Ana poliçe yıllardır aynı: aynı acente, aynı prim, aynı küçük limit. Sonra, bir yaz günü, tek sayfalık bir ek. Acentenin notu: “Müşteri talebiyle.”
~ Müşteri talebiyle. Bir şirket yangından önce yangın sigortasını artırırsa sigortacılar buna bir ad verir. Ben henüz bir ad vermeyeceğim; önce satırlar.
`),
    header: { left: 'SİBER RİSK POLİÇESİ · ZEYİLNAME', right: '03.08' },
    columns: [
      { label: 'ALAN', flex: 1 },
      { label: 'DEĞER', flex: 2.2 },
    ],
    rows: [
      row('z1', ['Zeyilname tarihi', '3 Ağustos (olaydan 2,5 ay önce)']),
      row('z2', ['Teminat limiti', '2.000.000 TL → 20.000.000 TL']),
      row('z3', ['Kapsam eklemesi', '“Mevcut/eski çalışanın kasıtlı eylemleri”']),
      row('z4', ['İmza', 'T. Sezer · N. Korkmaz']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('law', 'Mevzuat', 'check')],
    costVar: 'zey_left',
    rules: [
      examine('EX_Z_LIMIT', 'mag', 'z2', {
        discovers: 'clue_limit',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · LİMİT',
          text: 'Teminat limiti olaydan iki buçuk ay önce on katına çıkarılmış: iki milyondan yirmi milyona. Zarar beyanı da tam yirmi milyon.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_Z_TEMINAT', 'law', 'z3', {
        discovers: 'clue_teminat',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · TEMİNAT',
          text: 'Aynı gün poliçeye “çalışan kötü niyeti” teminatı eklenmiş. Sigortanın ödemesi için bir çalışanın suçlu olması gerekiyor. Selim o çalışan.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_Z_IMZA', 'mag', 'z4', {
        score: { DELIL_ANALIZI: 40 },
        effects: [raise('fact_zeyil_imza')],
        feedback: {
          title: 'İMZALAR',
          text: 'Zeyilnamede iki imza: genel müdür ve mali işler müdürü. Gizli numaralı kadın “ağustosta bir şey imzaladım” demişti.',
          label: '+40 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: fallback('ARA_ZEY_FB', 'EXAMINE', {
      score: { DELIL_ANALIZI: -20 },
      feedback: { title: 'SONUÇ YOK', text: 'Bu satırda bir şey yok.', label: '−20 SKOR', tone: 'error' },
    }),
    finish: { id: 'ARA_ZEY_BITIR' },
  }),
  HUB,
);

const eksper = retarget(
  sceneSearch('ARA_EKSPER', {
  ...ARA,
  title: 'Eksper raporu fotoğrafları',
  hud: ['taps4'],
  exposeCounts: true,
  scene: 'sc_eksper',
  background: 'buro',
  instruction: 'Fotoğrafta dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps4',
  lines: B(`
# BÜRO — SİGORTA HASAR DOSYASI [bg:buro]
> Sigorta eksperi de fotoğraf çekmiş; aynı oda, başka bir göz. Bu fotoğraflar hasar dosyasında, zeyilnamenin yanında geldi.
~ Şirketin fotoğrafları “zarar” diyordu. Eksperin fotoğrafları “ne zaman” diyor. Aynı odada iki ayrı saat.
> Eksper raporunun ilk cümlesi: “Sigortalının ihbarı üzerine 18.10 cumartesi sabahı mahalde inceleme yapılmıştır.” Polisin adı ilk kez iki gün sonra geçiyor.
~ Hırsız girmiş bir eve önce polis değil sigortacı çağrılır mı? Çağrılabilir. Ama bu, sorulmaya değer bir sıralama.
`),
  miss: fallback('ARA_EKS_FB', 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  }),
  finish: { id: 'ARA_EKS_BITIR', label: 'Dosyayı kapat' },
  }),
  HUB,
);

// --- İnsanlar ---

const selim2 = conversation('ARA_SELIM', {
  ...ARA,
  title: 'Selim',
  background: 'ev',
  room: { label: 'NİLÜFER · BALKON', character: 'selim' },
  onFirstEnter: [inc('trust', 4)],
  lines: [
    W(
      any(has('ded_cihaz'), has('ded_gm_cihaz'), flag('fact_gm')),
      `
# PAZAR 15.00 — AKTAŞLARIN BALKONU [bg:ev]
> Selim beni bu kez içeri aldı. Defne masada boyama yapıyordu; “Avukat teyze!” deyip bir kalem uzattı, sonra utanıp geri çekti.
> Mutfakta çay. Selim ilk kez gülümsedi; yorgun, kısa.
selim: Kayıtlar geldi diye duydum. Gül söyledi. İlk kez bir hafta uyudum avukat hanım.
selim: O cihaz… NOS-GM-LT. Ben o makineyi kurdum. Genel müdürün dizüstüsü. Adını ben verdim: Nilüfer Örme Sunucu, GM, laptop.
~ Bir isim. Bir kullanıcı adının arkasına bir cihaz, cihazın arkasına bir zimmet. Zincir tamamlanıyor; ama zinciri ben çekmeyeceğim.
`,
    ),
    O(`
# AKTAŞLARIN BALKONU [bg:ev]
> Selim balkonda, elinde soğumuş bir çay. Defne içeride çizgi film izliyordu.
selim: Bir şey çıktı mı avukat hanım? Gül her gün soruyor; ben soramıyorum. Sormaya korkuyorum.
`),
  ],
  choices: [
    option('SQ_CIHAZ', '“NOS-GM-LT sana bir şey ifade ediyor mu?”', {
      visibleWhen: any(has('clue_cihaz_adi'), has('clue_sema_cihaz')),
      score: { SORGULAMA: 30 },
      effects: [raise('fact_nos')],
      responses: B(`
selim: Benim koyduğum ad o. Nilüfer Örme Sunucu — GM — laptop. Genel müdürün dizüstüsü. Üç yıl önce ben kurdum, VPN’ini ben ayarladım.
selim: Yani o gece benim kullanıcı adımla ama Tarık Bey’in makinesinden mi bağlanılmış? Ben… ben bunu söyleyemem avukat hanım. Kanıtım yok. Kayıt var, ben yokum.
- Kayıt yeter. Senin bir şey söylemene gerek yok. Kayıt söylüyor.
~ Müvekkilim bir ismi telaffuz etmekten korkuyor. İyi. Korkan müvekkil, kürsüde iftira atmaz.
`),
    }),
    option('SQ_YEDEK', '“Yedeğin kablosu nasıl çekilir? Anlat.”', {
      visibleWhen: has('clue_bos_yuva'),
      score: { SORGULAMA: 20 },
      responses: B(`
selim: O kablo mandallı. Uzaktan çekemezsin; orada olman, eğilmen, mandala basman gerekir. Ben kendim takmıştım, elimle.
selim: Yani silme uzaktan yapılmış olabilir; ama yedeği durduran, o odada bulunmuş. İki ayrı şey. Bir el uzakta, bir el içeride.
~ “Bir el uzakta, bir el içeride.” Aynı el olabilir mi? Bir kart kaydı bunu söyler.
`),
      effects: [raise('fact_iki_el')],
    }),
    option('SQ_SON', '“Son söz için hazırlan. Ne söylemek istersin?”', {
      score: { SORGULAMA: 15 },
      effects: [raise('selim_hazir')],
      responses: B(`
selim: Ne söyleyeyim? “Yapmadım” desem, herkes zaten öyle der. “Masumum” desem, ispatı sizin işiniz.
> Bir süre düşündü. İçeride Defne gülüyordu.
selim: Ben şunu söylerim: ben o şirketin hafızasıydım. Kimse bir hafızayı silmek için kendi hafızasını vermez. Bu kadar.
~ “Hafızayı silmek için kendi hafızasını vermez.” Bunu bir yere yazdım. Kendi cümlesi; benimki değil. En iyisi de bu.
`),
    }),
    cont('SELIM_BITIR', 'Vedalaş', HUB, { role: 'BACK' }),
  ],
});

const selimTeklif = conversation('ARA_SELIM_T', {
  ...ARA,
  title: 'Selim · teklif',
  background: 'ev',
  room: { label: 'NİLÜFER · BALKON', character: 'selim' },
  lines: B(`
> Tam kalkıyordum ki Selim kolumu tuttu. Sesini alçalttı; Defne duymasın diye.
selim: Avukat hanım, bir şey diyeceğim. Belki saçma. O yedek yönetici hesabı… hâlâ açık olabilir. Ben girersem, gerçek kayıtları indiririm. Hepsini. Kim ne zaman girmiş, görürsünüz.
selim: Bir gece. Kimse bilmez. Ben iz bırakmam; dokuz yıl o sistemi ben kurdum.
~ Bir müvekkil, suçlandığı şeyi yapmayı teklif ediyor; beni kurtarmak için. Hayatımın en tehlikeli iyi niyeti.
`),
  choices: [
    option('ST_RED', '“Asla. Bir daha o sisteme girmeyeceksin; ben de girdirmeyeceğim.”', {
      score: { SAVUNMA_STRATEJISI: 60 },
      effects: [raise('selim_red'), inc('trust', 6)],
      good: 'Müvekkilini suç işlemekten alıkoydun: izinsiz girişi yapmak da yaptırmak da suçtur (TCK 243; TCK 38). Delili mahkeme kanalıyla isteriz.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Asla Selim. Bir daha o sisteme girmeyeceksin. Girersen suçlandığın şeyi gerçekten yapmış olursun; ben de seni savunamam, kendimi de.
- O kayıtları mahkeme ister; usulüyle gelir. Senin elinle getirilen bir kayıt, bu dosyayı kazandırmaz; batırır.
selim: Haklısınız. Özür dilerim. Ben… çaresizlikten.
- Çaresizlik anlıyorum. Ama bu kapıdan geçmeyeceğiz. Söz ver.
selim: Söz.
~ Bir müvekkili bir suçtan alıkoymak, onu bir celsede savunmaktan daha önemli olabilir. Bugün öyleydi.
`),
      next: HUB,
    }),
    option('ST_KABUL', '“Dikkatli ol. Kimse bilmesin.”', {
      effects: [inc('ethics'), raise('selim_giris'), score('SAVUNMA_STRATEJISI', -60), dec('cred')],
      bad: 'Müvekkiline izinsiz sistem girişi yaptırmak; hem yeni bir suça azmettirmek (TCK 243, 244; TCK 38) hem de hukuka aykırı delil üretmektir (CMK 206/2-a, 217/2). Felakete giden yol.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Dikkatli ol. Kimse bilmesin. İndirdiğin kayıtları bana getir.
selim: Tamam. Bu gece.
> Çıkarken içim rahat değildi. Bir avukat, müvekkiline suçlandığı suçu yeniden işletiyordu. Bir kere daha, “iyi” bir sebeple.
~ İyi sebepler en tehlikeli sebeplerdir; çünkü insan onlara inanır.
`),
      next: HUB,
    }),
  ],
});

const nalan = conversation('ARA_NALAN', {
  ...ARA,
  title: 'Nalan Korkmaz',
  background: 'kafe',
  room: { label: 'SAHİL · BİR ÇAY BAHÇESİ', character: 'nalan' },
  onFirstEnter: [meet('nalan')],
  lines: B(`
# CUMA 17.30 — MUDANYA SAHİLİ, BİR ÇAY BAHÇESİ [bg:kafe]
> Beni şehrin dışında, sahilde bir çay bahçesine çağırdı. Masanın en uzak köşesi; denize, kapıya ve girişe aynı anda bakan yer. Bir muhasebeci masa seçer gibi masa seçmiş.
nalan: Oturun. Çabuk konuşalım. Beni kimse görmesin istedim; onun için buradayız. Deniz kenarında kimse kimseyi tanımaz.
nalan: Nalan Korkmaz. Mali işler. On bir yıldır o şirketteyim. Selim’i tanırım; dürüst çocuktur, fişsiz bir kuruş harcamaz.
nalan: Size bir şey söyleyeceğim, sonra kalkacağım. Ağustosta genel müdür bir zeyilname istedi. Siber poliçe. “Limiti yükselt” dedi. “Bir de şu teminatı ekle.”
nalan: Ben imzaladım. Sormadım. Benim işim imzalamak; sormak değil. Sonra ekim geldi. Şimdi geceleri o imzayı görüyorum.
~ Bir muhasebecinin vicdanı bir deftere benzer: her şey yazılıdır, ama toplamı en sonda görünür.
`),
  choices: [
    option('NQ_POLICE', '“O zeyilname tam olarak neyi değiştirdi?”', {
      score: { SORGULAMA: 30 },
      effects: [raise('fact_nalan_police')],
      discovers: 'clue_nalan',
      responses: B(`
nalan: Limiti iki milyondan yirmi milyona çıkardı. Bir de bir cümle: “eski ya da mevcut çalışanın kasıtlı eylemleri.” O cümle olmadan sigorta bu olayı ödemez.
nalan: Şirket temmuzda krediyi zor yapılandırdı. Maaşlar iki kez gecikti. Yirmi milyon… o para bu şirketi ayakta tutar. Ama ancak biri suçluysa gelir.
- Bunu mahkemede anlatır mısınız?
nalan: Anlatırım. Korkuyorum; ama anlatırım. Bir imzanın altında kalmaktan, bir kürsüde durmak yeğdir.
`),
    }),
    option('NQ_GM', '“Genel müdür o gece nerede olabilir?”', {
      visibleWhen: flag('fact_nalan_police'),
      score: { SORGULAMA: 20 },
      responses: B(`
nalan: Bilmem. Ama şunu bilirim: Tarık Bey teknik adam değilim der, oysa her sabah kendi dizüstüsüyle gelir, kimseye dokundurmaz. “Benim bilgisayarım benim kasam” der.
nalan: Bir de golf. Bülent’le golf. İkisi de aynı kulüpte. Raporu yazan da o kulüpte.
~ Bir kasa, bir golf sahası, bir rapor. Üçü de aynı adamın etrafında dönüyor.
`),
      effects: [raise('fact_golf')],
    }),
    option('NQ_KANAL', '“Bunu bana değil, savcılığa ve mahkemeye anlatmalısınız.”', {
      score: { SAVUNMA_STRATEJISI: 50 },
      effects: [raise('nalan_kanal'), raise('nalan_tanik')],
      good: 'Çalışanı belge kaçırmaya değil, bildiğini resmî kanaldan tanık olarak anlatmaya yönlendirdin (CMK 158; Av.K. 34).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Nalan Hanım, bana belge getirmeyin; getirirseniz hem siz zarar görürsünüz hem o belge mahkemede kullanılamaz. Bildiklerinizi tanık olarak anlatın; poliçeyi mahkeme sigortadan zaten ister.
nalan: Tanık olmak… adım dosyaya geçer. Ama olsun. Kızıma “doğruyu söyledim” diyebilmek, bir işten iyidir.
nalan: Çağırın beni. Gelirim. Ama lütfen, poliçeyi mahkeme istesin; benim elimle değil.
~ Doğru yol bazen daha yavaştır. Ama yalnızca doğru yoldan gelen delil, kürsüde ayakta kalır.
`),
    }),
    option('NQ_BELGE', '“Poliçe dosyasını fotokopiyle getirebilir misiniz?”', {
      effects: [inc('ethics'), raise('nalan_belge'), score('SAVUNMA_STRATEJISI', -50)],
      bad: 'Çalışandan işvereninin belgesini gizlice getirmesini istemek; onu riske atar ve hukuka aykırı yolla elde edilmiş delil üretir (CMK 206/2-a, 217/2; Av.K. 34). Poliçe mahkeme kanalıyla istenir.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Poliçe dosyasını fotokopiyle getirebilir misiniz? Bana lazım.
nalan: Getiririm. Risk alırım sizin için. Selim için.
> Bir an durdu. Çayını karıştırdı; kaşık fincana değdi, bir kez.
nalan: Ama yakalanırsam? Ben de mi suçlu olurum?
~ Onu bir suça sürüklüyordum. Hem de gereksiz yere; o belgeyi mahkeme bir yazıyla isteyebilirdi.
`),
      next: HUB,
    }),
    cont('NALAN_BITIR', 'Teşekkür et, ayrıl', HUB, { role: 'BACK' }),
  ],
});

const yasar2 = conversation('ARA_YASAR', {
  ...ARA,
  title: 'Yaşar Usta',
  background: 'depo_gece',
  room: { label: 'FABRİKA KAPISI · KULÜBE', character: 'yasar' },
  lines: [
    W(
      flag('tarik_ziyaret'),
      `
# PERŞEMBE 22.00 — NİLÜFER ÖRME, KULÜBE [bg:depo_gece]
> Yaşar Usta’nın yüzü bu kez gergindi. Çayı koymadı; elleri cebindeydi.
yasar: Kızım, beni gündüz vardiyasına aldılar. “Yaşlandın, gece zor” dediler. Otuz yıl gece bekledim, şimdi yaşlandım.
yasar: Sen o müdürle konuştuktan sonra oldu bu. Belki tesadüf. Belki değil. Ben bir şey demiyorum; ama defteri de kimse benden isteyemez. Defter mahkemenin.
~ Bir ziyaretin bedelini bir bekçi ödüyor. Benim çayımın bedelini.
`,
    ),
    O(`
# PERŞEMBE 22.00 — NİLÜFER ÖRME, KULÜBE [bg:depo_gece]
> Yaşar Usta çay koydu; eli alışkanlıkla.
yasar: Mahkeme kâğıdı geldi kızım. Salı günü. Ömrümde ikinci kez mahkemeye gideceğim. İlkinde tarla gitti.
> Kulübenin içinde küçük bir radyo; türkü kısık sesle çalıyordu. Yaşar Usta radyoyu kapattı, sonra yeniden açtı; sessizlik ona daha ağır geldi.
yasar: Hanım dedi ki “Sen karışma, ekmeğimizden olmayalım.” Oğlan dedi ki “Baba, gördüğünü söyle.” İkisi de haklı. Ben ortada kaldım.
yasar: Otuz yıl bu kapıda durdum. Kimseye yalan yazmadım o deftere. Şimdi o defter beni mahkemeye çağırıyor.
yasar: Ne diyeyim orada? Korkuyorum.
`),
  ],
  choices: [
    option('YA_DOGRU', '“Defterinizde ne yazıyorsa onu. Fazlası değil.”', {
      score: { SAVUNMA_STRATEJISI: 50 },
      effects: [raise('yasar_hazir')],
      good: 'Tanığı içerikçe yönlendirmeden yalnızca usul hakkında bilgilendirdin; defterin kendisi en sağlam dayanak.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Defterinizde ne yazıyorsa onu söyleyeceksiniz Yaşar Usta. “GM aracı, 23.05, evrak.” Gördüğünüzü. Bilmediğinizi sorarlarsa “bilmiyorum” diyeceksiniz.
yasar: Bilmiyorum demek ayıp değil mi?
- En ayıp şey, bilmediğini bilir gibi yapmaktır. Defter yalan söylemez dediniz; siz de söylemeyin, yeter.
yasar: Defter benim namusum. Namusumu söylerim.
> Çayı bu kez içtim. Sıcaktı.
`),
      next: HUB,
    }),
    option('YA_EZBER', '“Mahkemede ‘silik adamı Selim değildi’ deyin.”', {
      effects: [inc('ethics'), raise('yasar_kocluk'), raise('yasar_hazir'), score('SAVUNMA_STRATEJISI', -50)],
      bad: 'Tanığa görmediği bir şeyi söyletmek; tanığı yönlendirmek (Av.K. 34) ve yalan tanıklığa azmettirmektir (TCK 272, 38).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Mahkemede “o gece gelen Selim değildi, başkasıydı” deyin. İşimiz kolaylaşır.
yasar: Ama ben yüzünü görmedim ki kızım. Arabayı gördüm, sesi duydum. Yüzü karanlıktı.
yasar: Görmediğimi nasıl derim? Defterde öyle yazmıyor.
~ Bir bekçiye namusunu çiğnetmeye çalıştım. Reddetti. Benden daha iyi bir hukukçu çıktı.
`),
      next: HUB,
    }),
    cont('YASAR2_BITIR', 'Vedalaş', HUB, { role: 'BACK' }),
  ],
});

const hakan2 = conversation('ARA_HAKAN', {
  ...ARA,
  title: 'Hakan Ilgaz',
  background: 'karakol',
  room: { label: 'EMNİYET ÖNÜ', character: 'hakan' },
  lines: B(`
# ÇARŞAMBA 12.30 — EMNİYET ÖNÜ [bg:karakol]
> Hakan yine simitle, yine güvercinlerle. Beni görünce başıyla selam verdi.
hakan: Bilirkişi gitmiş şirkete, duydum. İyi. Biz de isterdik ama bize “acele etmeyin” dediler. Kim dedi, sormayın.
hakan: Orijinal diskler oradaydı, söylemiştim. Bilirkişi oradan alınca gerçek ortaya çıkar. Benim raporumda bir eksik yok; sadece dosyanın yarısı bana hiç gelmedi.
~ Dürüst bir polis, kendi dosyasının yarısının eksik olduğunu söyleyen polistir.
`),
  choices: [
    option('HA_DISK', '“Bilirkişi diskte ne buldu, duydunuz mu?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('fact_disk')],
      responses: B(`
hakan: Resmî olarak bir şey diyemem. Gayriresmî olarak: cihaz adı diyorlar. Silme oturumunun cihazı, sanığınki değilmiş.
hakan: Ben olsam o cihazın kime zimmetli olduğuna bakardım. Şirket zimmet tutar; her demirbaş birine yazılıdır.
- Zimmeti mahkemeden istedim.
hakan: İyi. O zaman benim söyleyeceğim bir şey kalmadı. Kayıt sizin olsun; ben kendiminkini yaptım.
`),
    }),
    cont('HAKAN2_BITIR', 'Teşekkür et', HUB, { role: 'BACK' }),
  ],
});

// --- Karar ---

const karar = decisionNode(
  'ARA_KARAR',
  [
    { when: flag('bildirdi'), to: 'ARA_KARAR_BILDIRILDI' },
    { to: 'ARA_KARAR_SEC' },
  ],
  {
    ...ARA,
    title: 'Karar',
    onEnter: [raise('karar_verildi')],
  },
);

const kararSec = story('ARA_KARAR_SEC', {
  ...ARA,
  title: 'Bir isim',
  background: 'buro_gece',
  lines: B(`
# GECE — ARSLAN HUKUK [bg:buro_gece]
> Pano önümde. Kırmızı ipler bir yerde düğümleniyor: sunucu odası kartı, zimmet, hat, poliçe. Hepsi aynı adı gösteriyor.
~ Bir isim. Artık “belki” değil. Ama ben bir avukatım. Bir ismi bulmak başka, onunla ne yapacağını bilmek başka.
leyla: (telefonda) Ne buldun?
- Bir isim buldum Leyla Hanım. Kayıtlar söylüyor.
leyla: Peki şimdi ne yapacaksın? Üç seçeneğin var; ikisi yanlış.
`),
  choices: [
    option('K_BILDIR', 'Savcılığa yazılı suç duyurusunda bulun; delilleri ekle', {
      score: { USUL_BILGISI: 100, SAVUNMA_STRATEJISI: 60 },
      effects: [raise('bildirdi'), inc('legal_hits'), inc('pers')],
      good: 'Başka bir kişinin fail olabileceğini gösteren delilleri savcılığa yazılı olarak bildirmek doğru yoldur (CMK 158, 160); araştırmayı savcı yürütür, avukat kovalamaz.',
      category: 'USUL_BILGISI',
      responses: B(`
- Savcılığa yazacağım. Bütün delillerle: kart kaydı, zimmet, hat, poliçe. Bir suç duyurusu.
leyla: Doğru. Biz bir ismi mahkemede haykırmayız; savcıya yazarız. Savcı soruşturur. Böylece hem müvekkilini kurtarırsın, hem bir iftiracı olmazsın.
leyla: Bir de şunu kazanırsın: ikinci celsede savcı senin yanında durabilir. Bir savcıyı ikna etmek, bir hâkimi ikna etmenin yarısıdır.
> Dilekçeyi o gece yazdım. Ekler: dört kurumun kaydı. İmza: ortak avukat sıfatıyla. İlk kez.
~ Bir ismi bir zarfa koydum, savcılığa. Haykırmadım. Yazdım. Fark buydu işte; dört yılda öğrendiğim fark.
`),
      next: 'ARA_KARAR_BILDIRILDI',
    }),
    option('K_YUZLES', 'Genel müdürle yüzleş; itiraf ettirmeye çalış', {
      effects: [inc('ethics'), raise('tarik_yuzles'), score('SAVUNMA_STRATEJISI', -40), dec('pers')],
      bad: 'Olası faille yüzleşmek bir avukatın işi değildir; delil kaybına, karşı suçlamalara yol açar ve araştırmayı savcıdan alır. Doğru yol savcılığa yazmaktır (CMK 158).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Genel müdürlüğe gideceğim. Yüzüne söyleyeceğim. Belki çözülür.
leyla: Deniz. Dur. Sen savcı değilsin, polis değilsin, dedektif değilsin. Avukatsın.
- Ama kanıtım var.
leyla: Kanıtın varsa savcıya götür. Bir faili uyarırsan, kayıtları temizler, hattı kapatır, cihazı “kaybeder.” Sen de elindeki her şeyi uyardığın adama hediye edersin.
> Dinlemedim. Ertesi gün genel müdürlüğe gittim. Tarık Sezer gülümsedi, çay söyledi, dinledi. Ertesi gün NOS-GM-LT dizüstüsünün “çalındığına” dair bir tutanak tuttu.
~ Leyla haklıydı. Bir faili uyardım. En iyi delilim bir “çalıntı” tutanağına dönüştü.
`),
      next: HUB,
    }),
    option('K_BEKLE', 'Hiçbir şey yapma; ikinci celsede sun', {
      score: { SAVUNMA_STRATEJISI: -20 },
      effects: [raise('tarik_bekle')],
      neutral:
        'Delili saklayıp celsede sunmak mümkündür; ama savcılığa önceden bildirmezsen fail bu sürede delil karartabilir ve savcıyı yanına çekemezsin (CMK 158).',
      responses: B(`
- Bekleyeceğim. İkinci celsede, herkesin önünde sunacağım. Daha etkili olur.
leyla: Belki daha gösterişli olur. Ama fail üç hafta boyunca serbest. Bir hat kapatılır, bir cihaz “kaybolur.”
leyla: Sen bir sahne mi istiyorsun, bir sonuç mu? Sahne senin; sonuç müvekkilinin.
~ Bir sahne mi, bir sonuç mu? Kendime bu soruyu sormalıydım; sormadım.
`),
      next: HUB,
    }),
  ],
});

const kararBildirildi = story('ARA_KARAR_BILDIRILDI', {
  ...ARA,
  title: 'Karar verildi',
  background: 'buro_gece',
  lines: B(`
# ERTESİ SABAH 09.10 — ADLİYE, BAŞSAVCILIK BÜROSU [bg:adliye]
> Suç duyurusu dilekçesi savcılığa gitti. Ekler tamam. Kalem memuru evrak numarasını dilekçenin köşesine yazdı, damgaladı, başını kaldırmadan “sıradaki” dedi.
> Koridorda Savcı Ferda Yalın’ın kapısı aralıktı. Beni gördü; başıyla selam verdi. Bir şey söylemedi. Söylemesi de gerekmiyordu.
~ Bir ismi yazdım, imzaladım, gönderdim. Gerisi benim elimde değil. İyi bir avukat, elinde olmayanı bırakmayı da bilir.
`),
  choices: [cont('ARA_KB_DON', 'Büroya dön', HUB, { role: 'BACK' })],
});

// --- Leyla ---

const leyla = story('ARA_LEYLA', {
  ...ARA,
  title: 'Leyla’ya danış',
  background: 'buro',
  lines: [
    W(
      all(cmp(v('ara_day'), '==', 1), not(flag('fact_gm'))),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Kayıtlar geldi. Şimdi onları oku; ama ayrı ayrı değil. Yan yana koy. Bir cihaz adı, bir kart kaydı, bir hat, bir poliçe.
leyla: Her biri tek başına “belki.” Dördü bir araya gelince “kim.” Tahtayı kullan; iki kâğıt bir isim yapar.
`,
    ),
    W(
      cmp(v('ara_day'), '==', 1),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Bir isim buldun. Gözlerinden belli. Şimdi dikkat: o isimle ne yapacağın, onu bulmandan daha önemli.
leyla: Bir avukat bir fail bulduğunda üç şey yapabilir. İkisi kariyer bitirir. Üçüncüsü bir dilekçedir: savcılığa.
`,
    ),
    O(`
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: İkinci celse yakın. Bir bilirkişin var, bir savcın belki yanında. Esas savunmada üç dayanaktan fazlasını söyleme; fazlası gürültüdür.
leyla: Ve müvekkilin. Kürsüde bir isim haykırmasın. “Ben yapmadım” yeter; “o yaptı” değil. İftira, beraati bile kirletir.
leyla: Bir de kendini hatırla. Bu dosya seni tartıyordu. Terazi şu ana kadar dengede. Son celsede bir kefeye kibir koyma.
`),
  ],
  choices: [cont('ARA_LEYLA_DON', 'Teşekkür et', HUB, { role: 'BACK' })],
});

// --- Tahta ---

const POOL2 = [
  'clue_cihaz_adi',
  'clue_emn_cihaz',
  'clue_sema_cihaz',
  'clue_sema_yazma',
  'clue_zimmet',
  'clue_turnike_gm',
  'clue_hat_gm',
  'clue_bos_yuva',
  'clue_son_yedek',
  'clue_limit',
  'clue_teminat',
  'clue_eksper',
  'clue_ziyaretci',
  'clue_nalan',
  'clue_gsm',
  'clue_kurtarma',
  'clue_hash',
  'clue_sifre_zarf',
  'clue_hesap_acik',
  'ev_eposta',
  'clue_imaj_tarih',
  'clue_bulent',
  'clue_emn_yok',
  'clue_modem',
  'clue_2130',
  'clue_kisisel',
];

const cikarim = retarget(
  deductionBoard('ARA_CIKARIM', {
    ...ARA,
    title: 'Çıkarım tahtası',
    background: 'buro_gece',
    lines: B(`
> Pano büyüdü. Kırmızı ip artık sunucu odasından bir karta, karttan bir cihaza, cihazdan bir hatta ve bir poliçeye uzanıyor.
`),
    pool: POOL2,
    recipes: [
      recipe('AC_GM_ODA', 'clue_turnike_gm', 'clue_bos_yuva', {
        effects: firstTime('ded_gm_oda'),
        feedback: newDed('Yedeği söken, cuma gecesi odaya giren kişiydi', 'Yedek 22.00’de çalışıyor; 23.11’de odaya bir kart giriyor; sabah kablo yerinde değil.'),
        responses: B(`
~ Bir kart, bir kablo, bir saat. Silme uzaktan yapılabilir; ama yedeği durdurmak için o odada eğilmek gerek. O gece o odaya bir kart girdi.
`),
      }),
      recipe('AC_GM_CIHAZ', 'clue_cihaz_adi', 'clue_zimmet', {
        effects: firstTime('ded_gm_cihaz'),
        feedback: newDed('Silme oturumu genel müdürün dizüstüsünden açıldı', 'NOS-GM-LT genel müdürün zimmetinde.'),
        responses: B(`
~ Aynı kullanıcı adı, başka bir cihaz; ve o cihaz bir kişiye zimmetli. Kayıt bir ismi söylemiyor; iki kayıt birlikte söylüyor.
`),
      }),
      recipe('AC_GM_CIHAZ2', 'clue_sema_cihaz', 'clue_zimmet', {
        effects: firstTime('ded_gm_cihaz'),
        feedback: newDed('Silme oturumu genel müdürün dizüstüsünden açıldı', 'Bilirkişi de aynı cihaz adını buldu; zimmet onu bir kişiye bağlıyor.'),
      }),
      recipe('AC_GM_HAT', 'clue_hat_gm', 'clue_gsm', {
        effects: firstTime('ded_gm_hat'),
        feedback: newDed('Silme oturumu genel müdürün hattından geldi', 'Kaynak “GSM”; o hat genel müdüre tahsisli.'),
        responses: B(`
~ Bir cep hattı. Kurumsal, ama bir kişiye zimmetli. Operatör bir ismi söyledi; benim söylememe gerek yok.
`),
      }),
      recipe('AC_MOTIF', 'clue_limit', 'clue_teminat', {
        effects: firstTime('ded_motif'),
        feedback: newDed('Poliçe bir çalışanın suçlanmasına göre büyütülmüştü', 'Limit on katı, teminat “çalışan kötü niyeti.”'),
        responses: B(`
~ Ödemenin şartı bir çalışanın suçlu olması. Poliçe iki buçuk ay önce, tam bu şarta göre yazılmış. Bir plan, bir takvim gibi okunuyor.
`),
      }),
      recipe('AC_MOTIF2', 'clue_limit', 'clue_nalan', {
        effects: firstTime('ded_motif'),
        feedback: newDed('Poliçe bir çalışanın suçlanmasına göre büyütülmüştü', 'Şirket nakit sıkıntısında; limit tam zararın tutarına çıkarılmış.'),
      }),
      recipe('AC_ONCE', 'clue_eksper', 'clue_ziyaretci', {
        effects: firstTime('ded_once_sigorta'),
        feedback: newDed('Sigortaya polisten önce haber verildi', 'Eksper 18 Ekim’de odadaydı; şikâyet ve imaj 20 Ekim.'),
        responses: B(`
~ İlk telefon sigortaya, ikinci bilgisayarcıya, en son polise. Bir kaza böyle yönetilmez; bir hasar dosyası böyle yönetilir.
`),
      }),
      ...invRecipes('AC'),
      recipe('AC_X_EKS', 'clue_eksper', 'clue_son_yedek', {
        score: { DELIL_ANALIZI: -50 },
        feedback: {
          title: 'Doğru ama eksik',
          text: 'Eksperin tarihi ve yedeğin saati. İkisi de doğru; ama birbirini açıklamıyor.',
          label: 'BAĞLANTI YOK · −50 SKOR',
          tone: 'error',
        },
      }),
      recipe('AC_X_HASH2', 'clue_hash', 'clue_hat_gm', {
        score: { DELIL_ANALIZI: -50 },
        feedback: {
          title: 'İki ayrı iz',
          text: 'Bir imajın bütünlüğü ve bir telefon hattı. İkisi de güçlü; ama farklı şeyleri kanıtlar. Yan yana koyma.',
          label: 'BAĞLANTI YOK · −50 SKOR',
          tone: 'error',
        },
      }),
    ],
    miss: fallback('ARA_FB_CIKARIM', 'COMBINE', {
      repeat: 'ONCE_PER_PARAMS',
      score: { DELIL_ANALIZI: -50 },
      feedback: { title: 'Bu ikisi birbirini açıklamıyor', text: 'Başka bir ipucu dene.', label: 'BAĞLANTI YOK · −50 SKOR', tone: 'error' },
    }),
    finish: { id: 'ARA_CIKARIM_BITIR' },
  }),
  HUB,
);

// --- Dilekçe ---

const dil = story('ARA_DIL', {
  ...ARA,
  title: 'Ek delil talebi',
  hud: ['slots2'],
  background: 'buro',
  lines: [
    W(
      not(flag('ara_dil_any')),
      `
# BÜRO — EK DİLEKÇE [bg:buro]
> Boş bir dilekçe. İkinci celseye birkaç gün. Bu kez elimde daha çok şey var; ama her talep hâlâ bir gerekçe ister.
~ İlk dilekçeyi korkuyla yazmıştım; her talebin reddedileceğini sanarak. Bu kez korkum başka: fazla isteyip mahkemenin sabrını tüketmek.
~ Bir avukatın mahkemeden istediği her kâğıt, karşı tarafın da okuyacağı bir kâğıttır. Ne istediğim, ne düşündüğümü ele verir. Az ve isabetli.
`,
    ),
    O(`> Dilekçe uzuyor.`),
  ],
  choices: [
    option('AD_OPR', '02.14 GSM hattının abone ve adres kaydı', {
      visibleWhen: all(has('clue_gsm'), not(has('ev_operator')), not(flag('opr_istendi'))),
      cost: [{ var: 'slots2', amount: 1 }],
      maxUses: 1,
      score: { USUL_BILGISI: 60 },
      effects: [raise('ara_opr_istendi'), raise('opr_istendi'), raise('ara_dil_any')],
      good: 'Silme oturumunun GSM hattını operatörden istemek; tek oturum, tek saatle sınırlı, ölçülü (CMK 332).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_ZEYIL', 'Sigortadan poliçe ve zeyilnameleri', {
      visibleWhen: all(flag('nalan_ipucu'), not(has('ev_zeyil')), not(flag('zeyil_istendi'))),
      cost: [{ var: 'slots2', amount: 1 }],
      maxUses: 1,
      score: { USUL_BILGISI: 50 },
      effects: [raise('ara_zeyil_istendi'), raise('zeyil_istendi'), raise('ara_dil_any')],
      good: 'Zarar beyanının dayandığı poliçenin geçmişi olayla ilgilidir (CMK 177, 332).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_TANIK', 'Nalan Korkmaz ve Yaşar Kılıç’ın tanık olarak dinlenmesi', {
      visibleWhen: any(flag('nalan_kanal'), flag('yasar_tanik')),
      cost: [{ var: 'slots2', amount: 1 }],
      maxUses: 1,
      score: { USUL_BILGISI: 50 },
      effects: [raise('tanik_istendi'), raise('ara_dil_any')],
      good: 'Bilgisi olan tanıkların bildirilmesi (CMK 177–178); beyan duruşmada doğrudan dinlenir.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_GM', 'Genel müdürün gözaltına alınması', {
      visibleWhen: any(has('clue_turnike_gm'), has('clue_zimmet'), has('clue_hat_gm'), flag('fact_gm')),
      cost: [{ var: 'slots2', amount: 1 }],
      maxUses: 1,
      score: { USUL_BILGISI: -40 },
      effects: [raise('ara_dil_any')],
      bad: 'Bir avukat üçüncü kişinin gözaltına alınmasını talep edemez; bu savcının ve soruşturmanın işidir (CMK 158). Suç duyurusu yolu doğru olandır.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    cont('AD_VER', 'Dilekçeyi ver', HUB, {
      role: 'PRIMARY',
      effects: [raise('ara_dil_verildi')],
      enabledWhen: flag('ara_dil_any'),
    }),
    cont('AD_GERI', 'Sonra yazarım', HUB, { role: 'BACK' }),
  ],
});

// --- Gün sonları ---

const dayEnd = decisionNode(
  'ARA_DAY_END',
  [{ when: cmp(v('ara_day'), '==', 2), to: 'ARA_AKSAM1' }, { to: 'ARA_AKSAM2' }],
  {
    ...ARA,
    title: 'Gün sonu',
    onEnter: [inc('ara_day', 1), set('ara_ap', ARA_AP)],
  },
);

const aksam1 = story('ARA_AKSAM1', {
  ...ARA,
  title: 'Akşam',
  background: 'buro_gece',
  lines: [
    W(
      flag('fact_gm'),
      `
# GECE 23.00 — ARSLAN HUKUK [bg:buro_gece]
> Leyla gitmeden kapımda durdu; paltosu koluna atılı.
leyla: Bugün bir isim buldun. Nasıl bir his?
- Kötü. İyi bir delil, kötü bir his.
leyla: Doğru. İyi avukat, bir ismi bulduğunda sevinmez. Çünkü bilir: o ismin de bir annesi, bir kızı, bir sabahı var. Sen yalnızca doğruyu arıyorsun; onu yargılamak senin işin değil.
leyla: Yarın değil, iki gün sonra o adam kürsüde olabilir. Ona da bir kaydı okut; haykırma. Kayıt haykırmaz; en ağır böyle konuşur.
`,
    ),
    O(`
# GECE 23.00 — ARSLAN HUKUK [bg:buro_gece]
> Leyla gitmeden kapımda durdu; elinde iki bardak çay, birini masama bıraktı.
leyla: Bugün ne kadar yaklaştın?
- Bir adım. Belki iki.
leyla: İki adım, üç haftada iyi. Ama celse yaklaşıyor. Yarın adımlarını büyüt.
leyla: Bir şey daha. Bu ara evresinde herkes sana bir şey getirecek: bir telefon, bir fotokopi, bir “bildiğim var”. Hepsini al; hiçbirini kucağına koyma.
leyla: Delil mahkemeye mahkemenin yolundan gelir. Arka kapıdan gelen her kâğıt, ön kapıdan girerken seni de yanında sürükler.
~ Çayı içtim. Leyla’nın çayı her zaman biraz fazla demli. Uyutmamak için mi, uyandırmak için mi, hiç sormadım.
`),
  ],
  choices: [cont('ARA_AKSAM1_DEVAM', 'Yeni gün', HUB, { role: 'PRIMARY' })],
});

const aksam2 = story('ARA_AKSAM2', {
  ...ARA,
  title: 'Akşam',
  background: 'buro_gece',
  lines: [
    W(
      flag('bildirdi'),
      `
# GECE 22.30 — ARSLAN HUKUK [bg:buro_gece]
> Savcılıktan bir havale yazısı geldi: suç duyurum ana dosyayla birleştirilmiş. Savcı Ferda Yalın’ın adı altında.
~ Bir dilekçe bir dosyaya dönüştü. Yarın celsede savcı, kendi soruşturduğu bir isimle gelecek. Belki de ilk kez bir savcı benim yanımda.
`,
    ),
    W(
      flag('tarik_yuzles'),
      `
# GECE 22.30 — ARSLAN HUKUK [bg:buro_gece]
> Bir faks geldi: katılan şirketin vekilinden. “Müvekkilimin dizüstü bilgisayarı çalınmıştır; gerekli şikâyet yapılmıştır.” NOS-GM-LT.
~ Uyardığım adam cihazı kayıp gösterdi. En iyi delilim bir “çalıntı” tutanağına dönüştü. Leyla haklıydı; keşke haklı olmasaydı.
`,
    ),
    O(`
# GECE 22.30 — ARSLAN HUKUK [bg:buro_gece]
> Büronun camına yağmur değil, dolu vurdu bir an; sonra yine yağmur. Sokakta bir taksi uzun uzun korna çaldı, kimse binmedi.
leyla: Celseye iki gün. Hazır mısın?
- Olmaya çalışıyorum.
leyla: Çalışmak yeter. Hazır olduğunu sananlar hata yapar.
leyla: Kürsüye çıkacak her tanığı bir kez daha düşün. Ne bildiğini değil, nereden bildiğini. Mahkeme bilgiyi değil, bilginin yolunu tartar.
- Bir kaydın da yolu var. Kim tuttu, kim özetledi, kim getirdi.
leyla: İşte. İki hafta önce bunu bana ben söylüyordum.
~ Masamdaki kâğıtlar artık bir boşlukta bitmiyor. Bir yere varıyor. Nereye vardığını yüksek sesle söylemekten hâlâ korkuyorum.
`),
  ],
  choices: [cont('ARA_AKSAM2_DEVAM', 'Devam', HUB, { role: 'PRIMARY' })],
});

// --- Son: celseye hazırlık ---

const sonNodes = [
  decisionNode('ARA_SON_1', [{ to: 'ARA_SON_2' }], {
    ...ARA,
    title: 'İkinci celseden önce',
    onEnter: [set('ara_ap', 0)],
    lines: B(`
# PAZARTESİ 23.20 — ARSLAN HUKUK [bg:buro_gece]
> Panoyu söktüm, dosyaya dizdim. Üç haftada pano bir aileden bir şirkete, bir şirketten bir poliçeye uzadı.
`),
  }),
  decisionNode('ARA_SON_2', [{ to: 'ARA_SON_3' }], {
    lines: [
      W(flag('bildirdi'), `~ Savcılığa yazdım. Yarın savcı belki benim yanımda. Bir ismi haykırmadım; bir zarfa koydum.`),
      W(flag('tarik_yuzles'), `~ Cihaz “çalındı.” Uyardığım adam bir adım öne geçti. Yarın elimde bir zimmet var; ama cihaz yok.`),
      W(flag('tarik_bekle'), `~ Hiçbir şey yapmadım; sakladım. Yarın bir sahne kuracağım. Umarım sahneden bir sonuç çıkar.`),
      O(`~ Üç hafta geçti. Bir isim buldum, bir yol seçtim. Yarın o yolun nereye çıktığını göreceğim.`),
    ],
  }),
  decisionNode('ARA_SON_3', [{ to: 'ARA_SON' }], {
    lines: [
      W(flag('selim_giris'), `~ Selim’e o sisteme girmesini söyledim. İndirdiği kayıtlar çantamda. Kullanırsam... kullanırsam ikimiz de biteriz.`),
      W(flag('nalan_tanik'), `~ Nalan Hanım gelecek. Bir muhasebeci, bir imzanın altından çıkıp kürsüye. Cesaret, bazen bir rakamın yanında durmaktır.`),
      W(flag('yasar_hazir'), `~ Yaşar Usta defterini getirecek. Kurşun kalemiyle konuşacak. Bir bekçi, otuz yıllık namusu.`),
      O(`~ Tanık listem hazır. Dayanaklarım hazır. Hazır olmayan tek şey benim; her celse öncesi olduğu gibi.`),
    ],
  }),
  story('ARA_SON', {
    ...ARA,
    title: 'İkinci celseden önce',
    background: 'sokak_yagmur',
    lines: B(`
# GECE 23.55 — DENİZ’İN EVİ [bg:sokak_yagmur]
> Cübbem kapının arkasında asılı; Leyla’nın ilk duruşmamda bana verdiği, kolunun dikişi iki kez yenilenmiş cübbe.
> Masada dosyanın son hâli: renkli ayraçlar, kenar notları, bir çay lekesi. İlk gün altı kâğıttı. Şimdi bir parmak kalınlığında.
~ Dosyalar büyüdükçe hafifler. Çünkü her yeni kâğıt bir soruyu cevaplar; sorular kâğıtlardan ağırdır.
> Telefon titredi. Leyla’dan, gece yarısına beş kala.
leyla: Yarın bir isim kürsüye oturabilir. Oturursa, ona acımadan, ama insafla davran. İnsaf, avukatın gücüdür; acımasızlık savcının. [phone]
> Pencereyi açtım. Yağmur organize sanayinin bacalarına, Nilüfer’in balkonlarına, Görükle’nin villalarına, adliyenin taş merdivenlerine aynı anda yağıyordu. {flash}
~ Bir kullanıcı adı. Bir cihaz. Bir hat. Bir poliçe. Yarın bütün bunları bir cümlede toplayacağım. Ya da dağıtacağım.
`),
    choices: [cont('ARA_SON_DEVAM', 'Adliyeye git', 'T_00G_1', { role: 'PRIMARY' })],
  }),
];

export const investigation2: CasePart = {
  nodes: [
    ...girisNodes,
    hub,
    sema,
    turnike,
    opr,
    zeyil,
    tamDoc('ARA_TAM', ARA, HUB),
    eksper,
    selim2,
    selimTeklif,
    nalan,
    yasar2,
    hakan2,
    karar,
    kararSec,
    kararBildirildi,
    cikarim,
    dil,
    leyla,
    dayEnd,
    aksam1,
    aksam2,
    ...sonNodes,
  ],
  predicates: [
    {
      id: 'fact_gm_pred',
      label: 'Silme oturumu genel müdürü işaret ediyor',
      when: any(has('ded_gm_cihaz'), has('ded_gm_hat'), has('ded_gm_oda')),
    },
  ],
  triggers: [
    {
      id: 'tg_ara_day',
      scope: HUB,
      priority: 1,
      when: all(cmp(v('ara_ap'), '<=', 0), cmp(v('ara_day'), '<', ARA_DAYS)),
      goto: 'ARA_DAY_END',
    },
    {
      id: 'tg_fact_gm',
      scope: HUB,
      priority: 2,
      when: any(has('ded_gm_cihaz'), has('ded_gm_hat')),
      effects: [set('fact_gm', true)],
    },
    {
      id: 'tg_selim_teklif',
      scope: HUB,
      priority: 3,
      once: true,
      when: all(visited('ARA_SELIM'), any(has('ded_gm_cihaz'), has('ded_gm_hat')), not(flag('selim_teklif_g'))),
      effects: [set('selim_teklif_g', true)],
      goto: 'ARA_SELIM_T',
    },
  ],
  discoveryPaths: [...giris.discoveryPaths],
};
