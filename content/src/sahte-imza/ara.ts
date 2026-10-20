import {
  all,
  any,
  cmp,
  cont,
  conversation,
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
  row,
  sceneSearch,
  set,
  story,
  tool,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef, Cond, NodeDef } from '../../../tools/content/src/kit/index.js';
import { firstTime, invDecoys, invRecipes, newDed, wrongPair } from './inv-hub.js';
import { B, O, W } from './lib.js';
import { ARA, ARA_AP, ARA_DAYS } from './shared.js';

// 70-ara: birinci ve ikinci celse arası (3 gün × 3 EP; yığınsız: her etkinlik doğrudan ARA_HUB'a döner).
// Müzekkere cevapları gelir: kargo kaydı, randevu kaydı, asıl teslim tutanağı. Kurye, Sevgi'nin sırrı, Emre'nin
// cevabı (ve etik tuzağı), Nermin'in yumuşaması, Hayriye'nin berrak anı, emlak bürosu, suç duyurusu, gece matbaa.

const HUB = 'ARA_HUB';

const act = (id: string, label: string, to: string, opts: Partial<ChoiceDef> = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { cost: [{ var: 'ara_ap', amount: 1 }], next: to, maxUses: 1, ...opts });
const free = (id: string, label: string, to: string, opts: Partial<ChoiceDef> = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { next: to, ...opts });
const toHub = (id: string, label = 'Büroya dön') => cont(id, label, HUB, { role: 'BACK' });

/** `$return` geçişlerini ARA_HUB'a çevirir (yığınsız evre). */
function retarget<N extends { choices: { next?: unknown }[] }>(node: N): N {
  return { ...node, choices: node.choices.map((c) => (c.next === '$return' ? { ...c, next: HUB } : c)) };
}

/** Tarık'a giden somut bir halka. */
export const halka: Cond = any(has('ded_randevu'), has('ev_tutanak'), flag('fact_solak_tarik'));

const giris = deliver('ARA_GIRIS_1', [
  {
    evidence: 'ev_kargo',
    requires: any(flag('dil_kargo'), flag('h1_kargo')),
    hint: 'Takvimdeki “kargo 11.30” notu bir mazeretin ucuydu; kargo kaydını dilekçeyle ya da ilk celsede iste.',
  },
  {
    evidence: 'ev_randevu',
    requires: any(flag('dil_randevu'), flag('h1_randevu')),
    hint: 'Tapu randevusunu kimin aldığı kayıtlıydı; mahkemeden yazı yazılmasını iste.',
  },
  {
    evidence: 'ev_tutanak',
    requires: any(flag('dil_tutanak'), flag('h1_tutanak')),
    hint: 'Raporun ekindeki teslim tutanağının aslını iste; teslim edenin adı okunmuyordu.',
  },
]);

// --- Giriş ---

const girisNodes: NodeDef[] = [
  decisionNode('ARA_GIRIS_1', [{ to: 'ARA_GIRIS_2' }], {
    ...ARA,
    title: 'Ara',
    onEnter: [set('in_court', false), set('ara_day', 1), set('ara_ap', ARA_AP), ...giris.effects],
    lines: B(`
C#buro_gece: 20 EKİM · 18.40 — ARSLAN HUKUK
N: Müzekkerelere cevaplar beklediğimden çabuk geldi. Şirketler mahkemeye geç kalmayı sevmez; avukatlara geç kalmayı sever.
N: Üç gün sonra. Bursa’da yağmur bir an bile dinmemişti. Büronun penceresinde aynı çizgiler; masamda yeni bir yığın.
`),
  }),
  decisionNode('ARA_GIRIS_2', [{ to: 'ARA_GIRIS' }], {
    lines: [
      W(
        all(has('ev_kargo'), has('ev_randevu'), has('ev_tutanak')),
        `
N: Masamda üç zarf: kargo şirketinin cevabı, tapu müdürlüğünün randevu dökümü, kolluğun asıl teslim tutanağı. Üçü de mühürlü, üçü de ince.
`,
      ),
      W(
        any(has('ev_kargo'), has('ev_randevu'), has('ev_tutanak')),
        `
N: Masamda birkaç zarf. İstediğim her şey gelmemişti; istemediğim hiçbir şey de gelmemişti. Dilekçeler böyledir.
`,
      ),
      O(`
N: Masam boştu. Hiçbir kurumdan zarf gelmemişti; çünkü hiçbir kuruma bir şey sormamıştım.
T: Soru sorulmayan kurum cevap vermez. Bu dosyanın ilk dersi buydu; ikinci kez öğreniyorum.
`),
    ],
  }),
  story('ARA_GIRIS', {
    ...ARA,
    title: 'Zarflar',
    background: 'buro_gece',
    lines: B(`
N: Leyla odama girdi. Elinde iki bardak çay. Birini masama bıraktı, öbürünü kendi avuçlarının arasında tuttu.
leyla: Birinci celse iyi geçti mi, kötü mü? Sorma; ben söyleyeyim. Bir şey değişti. Neyin değiştiğini bulmak için üç günün var.
leyla: Zarfları aç. Ama önce bir şey: bir şey bulursan ve o şey birini işaret ederse, peşinden koşma. Yaz. Savcıya yaz. Mahkemeye yaz.
leyla: Biz avukatız, kolluk değil. Kimseyle yüzleşmeyiz, kimseyi takip etmeyiz. Kâğıtlarımız yüzleşir.
T: Leyla’nın uyarıları tuhaftır; henüz olmamış şeyler hakkında gelir. Sonra olur.
`),
    choices: [cont('ARA_GIRIS_DEVAM', 'Zarfları aç', HUB, { role: 'PRIMARY' })],
  }),
];

// --- Hub ---

const hubTabs = [
  {
    id: 't_ara_arsiv',
    label: 'ARŞİV',
    kind: 'ARCHIVE' as const,
    choices: [
      act('A_KARGO', 'Kargo kaydını incele', 'ARA_KARGO', {
        description: 'Terminal ve GPS dökümü',
        visibleWhen: has('ev_kargo'),
      }),
      act('A_RANDEVU', 'Randevu kaydını incele', 'ARA_RANDEVU', {
        description: 'ALO 181 dökümü',
        visibleWhen: has('ev_randevu'),
      }),
      free('A_TUTANAK', 'Asıl teslim tutanağını oku', 'ARA_TUTANAK', {
        description: '0 EP · kolluk tutanağı',
        maxUses: 1,
        visibleWhen: has('ev_tutanak'),
      }),
      act('A_TANIK', 'Tanık listesi dilekçesi', 'ARA_TANIK', { description: 'İkinci celseye kimi çağıracaksın?' }),
      act('A_SUC', 'Suç duyurusu', 'ARA_SUC', { description: 'Bursa Cumhuriyet Başsavcılığı’na', visibleWhen: halka }),
      free('A_CIKARIM', 'Çıkarım tahtası', 'ARA_CIKARIM', { description: '0 EP · ipuçlarını birleştir' }),
      free('A_LEYLA', 'Leyla’ya danış', 'ARA_LEYLA', {
        description: '0 EP · günde bir kez',
        visibleWhen: cmp(v('leyla_ara'), '<', v('ara_day')),
        effects: [set('leyla_ara', v('ara_day'))],
      }),
    ],
  },
  {
    id: 't_ara_kisi',
    label: 'KİŞİLER',
    kind: 'PEOPLE' as const,
    choices: [
      act('A_SINAN', 'Kurye Sinan Öztürk', 'ARA_SINAN', {
        description: 'Kargo deposu · Nilüfer',
        visibleWhen: has('clue_kargo_saat'),
      }),
      act('A_SEVGI', 'Sevgi', 'ARA_SEVGI', { description: 'Evde · akşam' }),
      act('A_EMRE', 'Emre', 'ARA_EMRE', { description: 'Matbaa · okul çıkışı' }),
      act('A_NERMIN', 'Nermin Kurt', 'ARA_NERMIN', { description: 'Mudanya · eczane' }),
      act('A_HAYRIYE', 'Hayriye Hanım', 'ARA_HAYRIYE', { description: 'Çekirge · huzurevi' }),
      act('A_EROL', 'Kılınç Gayrimenkul', 'ARA_EROL_G', {
        description: 'Erol seni çağırdı',
        visibleWhen: any(has('ded_randevu'), has('ev_tutanak'), has('clue_bahis')),
      }),
      act('A_TARIK', 'Gece matbaaya uğra', 'ARA_TARIK', {
        description: 'Işık yanıyor',
        visibleWhen: any(has('ded_randevu'), flag('fact_solak_tarik')),
      }),
    ],
  },
];

const hub = {
  id: HUB,
  type: 'INVESTIGATION' as const,
  ...ARA,
  title: 'Ara',
  background: 'buro' as const,
  hud: ['ara_day', 'ara_ap'],
  lines: [
    W(
      cmp(v('ara_day'), '==', 1),
      `
C: ARA · GÜN 1/3 · İKİNCİ CELSEYE 15 GÜN
N: Hedef: gelen kayıtları oku. Vedat o saatte neredeydi? Randevuyu kim aldı?
T: Birinci celse bir kapıyı araladı. Arkasında bir zincir gerildi. Şimdi o zincirin öbür ucunu tutan eli bulmam gerek; ona dokunmadan.
`,
    ),
    W(
      cmp(v('ara_day'), '==', 2),
      `
C: ARA · GÜN 2/3 · İKİNCİ CELSEYE 12 GÜN
N: Hedef: senedi imzalayan el kimin? Kayıtları insanlara, insanları kayıtlara bağla.
T: Bir kayıt bir insanı göstermez; bir insanın bıraktığı izi gösterir. İzi insana bağlamak benim işim değil; ama izleri yan yana koymak benim işim.
`,
    ),
    O(`
C: ARA · GÜN 3/3 · İKİNCİ CELSEYE 9 GÜN
N: Hedef: tanık listesi, suç duyurusu, tahta. Kürsüde kimi dinleyeceksin; neyi göstereceksin?
T: Son gün. Dokuz gün sonra bir kürsü. Ne kadar çok şey bildiğim önemli değil; kürsüye neyi taşıyabileceğim önemli.
`),
  ],
  tabs: hubTabs.map((t) => ({ id: t.id, label: t.label, kind: t.kind, choices: t.choices.map((c) => c.id) })),
  quickTalk: {
    character: 'vedat',
    line: '“Sol el. Bir memur hatırladı. Beş ay sonra. Avukat hanım, bir insan beş ay neden bekler?”',
    choices: ['A_SEVGI'],
  },
  choices: [
    ...hubTabs.flatMap((t) => t.choices),
    nav('A_DURUSMA', 'DURUŞMAYA GİT · 2. CELSE', 'ARA_SON_1', {
      role: 'PRIMARY',
      confirm: 'Duruşmaya gidersen ara evre biter. Emin misin?',
    }),
  ],
};

// --- Belgeler ---

const miss = (id: string): ChoiceDef =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: { title: 'SONUÇ YOK', text: 'Bu aletle burada bir şey görünmüyor.', label: '−20 SKOR', tone: 'error' },
  });

const kargo = retarget(
  documentExam('ARA_KARGO', {
    ...ARA,
    title: 'Kargo teslim kaydı',
    hud: ['ex_kargo'],
    background: 'buro_gece',
    lines: B(`
C#buro_gece: ARSLAN HUKUK — KARGO ŞİRKETİNİN CEVABI
N: Dört sayfa. Terminal kaydı, GPS dökümü, teslim imzasının ekran görüntüsü. Bir şirketin bir sabahı nasıl hatırladığı.
N: Ön yazı kısa: “Sayın Mahkemenizin müzekkeresi üzerine ilgili gönderiye ait kayıtlar ekte sunulmuştur. Saygılarımızla.” Altında bir imza; okunaksız, sağa yatık.
T: İnsan hafızası unutur, süsler, korkar. Bir el terminali yalnızca kaydeder. Bazen bu bir eksiklik; bugün bir lütuf.
`),
    header: { left: 'HIZLI KARGO · EL TERMİNALİ KAYDI', right: '18.02.2026' },
    columns: [
      { label: 'ALAN', flex: 1 },
      { label: 'KAYIT', flex: 2 },
    ],
    rows: [
      row('gonderi', ['Gönderi', 'Çekirge Termal Otel · 5 koli broşür']),
      row('varis', ['Varış', '11.19.40 · GPS: Kayhan, Ateş Matbaası önü']),
      row('teslim', ['Teslim', '11.37.05 · teslim alan: Vedat Ateş']),
      row('imza', ['Teslim imzası', 'Ekrana parmakla · görüntü ekte']),
      row('kurye', ['Kurye', 'Sinan Öztürk · Nilüfer şubesi']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Karşılaştır', 'compare')],
    costVar: 'ex_kargo',
    rules: [
      examine('EX_K_VARIS', 'mag', 'varis', {
        discovers: 'clue_kargo_saat',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · ON SEKİZ DAKİKA',
          text: 'Varış 11.19.40, teslim 11.37.05. Arada terminal yerinden kıpırdamamış: Kayhan, matbaanın önü. Senet 11.24’te tapuda imzalandı.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
        responses: B(`
T: On sekiz dakika. Bir kurye, bir terminal, beş koli. Ve o on sekiz dakikanın tam ortasında, dört kilometre ötede bir imza.
`),
      }),
      examine('EX_K_IMZA', 'compare', 'imza', {
        discovers: 'clue_kargo_imza',
        score: { DELIL_ANALIZI: 100 },
        feedback: {
          title: 'YENİ İPUCU · TERMİNAL İMZASI',
          text: 'Ekrandaki imza hızlı, sağa yatık; “V” tek hamlede. Vedat’ın büroda attığı imzaya benziyor; senettekine değil.',
          label: '+100 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_K_KURYE', 'mag', 'kurye', {
        score: { DELIL_ANALIZI: 20 },
        feedback: {
          title: 'KURYE',
          text: 'Sinan Öztürk, Nilüfer şubesi. Bir telefon numarası. Bir insan; terminali o tutuyordu.',
          label: '+20 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: miss('FB_KARGO'),
    finish: { id: 'KARGO_BITIR' },
  }),
);

const randevu = retarget(
  documentExam('ARA_RANDEVU', {
    ...ARA,
    title: 'Tapu randevu kaydı',
    hud: ['ex_randevu'],
    background: 'buro_gece',
    lines: B(`
C#buro_gece: ARSLAN HUKUK — TAPU MÜDÜRLÜĞÜNÜN CEVABI
N: Tek sayfa. Bir tablo; beş satır. Bir randevunun doğumu ve teyidi.
T: Birileri bir ev satmaya karar verdi ve bir numarayı çevirdi. O an kimse onu görmedi. Ama santral duydu.
`),
    header: { left: 'ALO 181 · RANDEVU KAYDI', right: '412 ADA 9 PARSEL' },
    columns: [
      { label: 'ALAN', flex: 1 },
      { label: 'KAYIT', flex: 2 },
    ],
    rows: [
      row('islem', ['İşlem', 'Satış · Hisar 412/9 · vekâleten']),
      row('tarih', ['Randevu alındı', '10.02.2026 · 10.12']),
      row('arayan', ['Arayan numara', '0532 418 77 47']),
      row('teyit', ['Teyit araması', '18.02.2026 · 11.06.12 · yanıtlandı · 41 sn']),
      row('randevu', ['Randevu', '18.02.2026 · 11.15']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Karşılaştır', 'compare')],
    costVar: 'ex_randevu',
    rules: [
      examine('EX_R_ARAYAN', 'mag', 'arayan', {
        discovers: 'clue_randevu_no',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · NUMARA',
          text: 'Randevuyu 10 Şubat 10.12’de 0532 418 77 47 numaralı hat almış. Bu numarayı bir yerde gördüm mü?',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_R_TEYIT', 'mag', 'teyit', {
        discovers: 'clue_teyit',
        score: { DELIL_ANALIZI: 100 },
        feedback: {
          title: 'YENİ İPUCU · TEYİT',
          text: '18 Şubat 11.06’da çağrı merkezi aynı numarayı aramış; 41 saniye konuşulmuş. Randevudan dokuz dakika önce o hat birinin cebindeydi.',
          label: '+100 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_R_TARIH', 'compare', 'tarih', {
        score: { DELIL_ANALIZI: 20 },
        feedback: {
          title: 'SIRA',
          text: 'Randevu 10 Şubat’ta; suret 6 Şubat gecesi basılmış, kapora 9 Şubat’ta alınmış. Biri adım adım ilerlemiş; acele etmeden.',
          label: '+20 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: miss('FB_RANDEVU'),
    finish: { id: 'RANDEVU_BITIR' },
  }),
);

const tutanak = story('ARA_TUTANAK', {
  ...ARA,
  title: 'Asıl teslim tutanağı',
  background: 'buro_gece',
  lines: [
    W(
      flag('fact_tarik_polis'),
      `
N: Kolluğun asıl tutanağı. 20 Mart 2026. “…yeğeni Tarık Ateş tarafından teslim edilmiştir. Şüpheli hastanededir.”
T: Tarık. “O işlerle amcam ilgilendi herhalde” demişti bana, camlı odasında. Amcası hastanedeydi.
T: Küçük bir yalan mı, bir unutkanlık mı? Bir kürsü ikisini birbirinden ayırır.
`,
    ),
    O(`
N: Kolluğun asıl tutanağı. Faks değil; mürekkepli, imzalı, okunaklı. 20 Mart 2026.
N: “Şüphelinin imzasını taşıyan on dört sevk irsaliyesi ve altı kargo fişi, şüphelinin işyerinde çalışan yeğeni Tarık Ateş tarafından teslim edilmiştir. Şüpheli hastanededir.”
T: Bilirkişiye “Vedat Ateş’in imzaları” diye verilen kâğıtları Vedat Ateş seçmemiş. Seçen el, başka bir el.
T: Bu bir suçlama değil. Bir tutanak. Ama bir tutanak, bir soruyu soracak hakkı verir. Kürsüde.
`),
  ],
  choices: [toHub('TUTANAK_DON', 'Tutanağı dosyaya koy')],
});

// --- Kişiler ---

const sinan = conversation('ARA_SINAN', {
  ...ARA,
  title: 'Sinan Öztürk',
  eyebrow: 'KİŞİLER',
  background: 'depo',
  onFirstEnter: [meet('sinan')],
  room: { label: 'HIZLI KARGO · NİLÜFER DEPOSU', character: 'sinan' },
  lines: B(`
C#depo: NİLÜFER — HIZLI KARGO DEPOSU
N: Bant sistemleri, koliler, sarı yelekler. Sinan Öztürk bir bankta sandviç yiyordu; beni görünce sandviçi kâğıdına sardı.
sinan: Avukat mısınız? Şirket aradı, “bir avukat gelecek” dedi. Ne oldu, biri mi şikâyet etti? Ben kimsenin kolisini kırmadım abla, yemin ederim.
sinan: Ben insanı koliden tanırım. Kim kırılgan yollar, kim kitap yollar, kim annesine yün çorap yollar. Çok şey bilirim.
`),
  choices: [
    option('SQ_SABAH', '“18 Şubat’ta Kayhan’daki matbaaya gittiniz. Hatırlıyor musunuz?”', {
      score: { SORGULAMA: 40 },
      effects: [raise('sinan_gorustu')],
      responses: B(`
sinan: Matbaa… Kayhan… Termal broşür! Beş koli! Hatırlamaz mıyım; usta bana çay koydu. Kim koyar bugün kuryeye çay?
sinan: Erken gittim, on bir buçuk demiştim, yirmi gibi oradaydım. Koliler bantlanmamıştı. Usta “bekle oğlum” dedi, beraber bantladık. On beş, yirmi dakika.
sinan: Usta anlattı durdu: babası, makine, kurşun harfler. Ben de dinledim. Terminale parmağıyla imza attı, güldü, “kalem olsa daha güzel atardım” dedi.
P: Dükkânda başka kim vardı?
sinan: Kimse. Usta tek başınaydı. Bir çocuk vardı bazen, çırak; o gün yoktu. Camlı odada da kimse yoktu, ışığı kapalıydı.
T: On sekiz dakika, bir çay, bir parmak imzası. Ve camlı odanın kapalı ışığı.
`),
    }),
    option('SQ_TANIK', '“Mahkemede bunları anlatır mısınız? Yalnızca hatırladığınızı.”', {
      visibleWhen: flag('sinan_gorustu'),
      score: { SAVUNMA_STRATEJISI: 50 },
      good: 'Tanığa ne söyleyeceğini değil, yalnızca hatırladığını anlatmasını istedin (Av.K. 34).',
      category: 'SAVUNMA_STRATEJISI',
      effects: [raise('sinan_razi')],
      responses: B(`
sinan: Anlatırım abla. Ne gördüysem. Usta iyi adam; çay koydu. Ama iyi adam olduğu için değil, doğru olduğu için anlatırım.
`),
    }),
    option('SQ_KOCLUK', '“Saati hatırlamazsanız ‘on bir yirmi beş gibi’ deyin; o saat önemli.”', {
      visibleWhen: flag('sinan_gorustu'),
      score: { SAVUNMA_STRATEJISI: -80 },
      effects: [inc('ethics'), raise('sinan_kocluk'), raise('sinan_razi')],
      bad: 'Tanığa söyleyeceği saati önerdin. Tanığı yönlendirmek meslek kurallarına aykırıdır (Av.K. 34); tanığın değerini yok eder. Saat zaten terminal kaydındaydı.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
sinan: On bir yirmi beş. Tamam abla. On bir yirmi beş derim. Siz bilirsiniz.
T: Terminal saati yazmıştı. Ben yine de bir insanın ağzına bir saat koydum. Neden?
`),
    }),
    option('SQ_IMZA', '“Terminale imzayı nasıl attı?”', {
      visibleWhen: flag('sinan_gorustu'),
      score: { SORGULAMA: 20 },
      responses: B(`
sinan: Parmağıyla. Herkes öyle atar ama o güldü, “kalem olsa daha güzel atardım” dedi. Sağ elinin işaret parmağıyla; sol elinde bant vardı.
sinan: Ben imzaya bakmam abla; adresi doğru mu, ona bakarım. Ama o gün baktım, çünkü usta güldü. Kuryeye kimse gülmez.
T: Sol elinde bant, sağ elinde imza. Bir kurye, kimsenin sormadığı bir ayrıntıyı hatırlıyor; çünkü biri ona gülmüş.
`),
    }),
    toHub('SINAN_BITIR', 'Teşekkür et, çık'),
  ],
});

const sevgi = conversation('ARA_SEVGI', {
  ...ARA,
  title: 'Sevgi',
  eyebrow: 'KİŞİLER',
  background: 'ev',
  room: { label: 'ATEŞLERİN EVİ · MUTFAK', character: 'sevgi' },
  lines: [
    W(
      flag('sevgi_kapi'),
      `
C#ev: YILDIRIM — ATEŞLERİN EVİ
N: Sevgi kapıyı açtı; beni görünce bir an durdu. “Ne zaman isterseniz” demiştim. O da bunu hatırlıyordu.
sevgi: Gelin. Vedat uyuyor. Siz bekleyeceğinizi söylemiştiniz; ben de konuşacağıma kendime söz vermiştim.
`,
    ),
    O(`
C#ev: YILDIRIM — ATEŞLERİN EVİ
N: Küçük bir mutfak. Masada ödev defterleri; kırmızı kalemle düzeltilmiş. Vedat içeride uyuyordu; Sevgi kapıyı aralık bıraktı.
sevgi: Uyuyabildi sonunda. Duruşmadan sonra ilk kez. “Sol el” deyip duruyor. “Sol el, Sevgi.”
sevgi: Çay koyayım. Sizi bekliyordum aslında. Telefonda yarım bıraktığım şeyi.
`),
  ],
  choices: [
    option('VQ_SIR', '“Telefonda bir şey söyleyecektiniz.”', {
      score: { SORGULAMA: 30 },
      effects: [ifThen(halka, [discover('clue_bahis'), raise('sevgi_anlatti')])],
      responses: [
        W(
          halka,
          `
N: Sevgi bardağı tabağına bıraktı. Tabak tıkırdadı.
sevgi.uzgun: Ocakta. Halit ağabeyin anma yemeğinde. Tarık’ın telefonu masadaydı, ekranı yukarı. Mesajlar geliyordu, peş peşe. “Vadesi geçen bakiyeniz…” “Son uyarı…”
sevgi: Bir bahis sitesi. Bir de bir isim, “E. Kılınç”. Ben bakmamış gibi yaptım. Tarık telefonu ters çevirdi. Gözlerimiz buluştu.
sevgi: Vedat’a söylemedim. Tarık onun ağabeyinin yadigârı; Vedat ona oğlu gibi bakar. Söyleseydim… Söyleseydim belki bunların hiçbiri…
T: “E. Kılınç.” Bir bahis borcu, bir alacaklı ve bir ev. Bu üçünü bir masaya koymak benim işim değil; bir savcının işi. Ama masayı kurmak benim işim.
`,
        ),
        O(`
sevgi: Aile meselesi Deniz Hanım. Davayla ilgisi yok. Ya da var mı, bilmiyorum. Ben bir şey gördüm, yanlış görmüş olabilirim.
sevgi: Bir şey bulursanız, söylerim. Bulmazsanız… bir öğretmenin vehmi olarak kalsın.
T: Bir şey bulursam. Sevgi bir kapının arkasında duruyor ve kapıyı ben açmadıkça açmayacak.
`),
      ],
    }),
    option('VQ_VEDAT', '“Vedat Bey nasıl?”', {
      score: { SORGULAMA: 10 },
      responses: B(`
sevgi: Geceleri mutfakta imza atıyor. Sağ elle, sol elle. Sonra kâğıtları yakıyor; ocakta. Ben sabah küllerini topluyorum.
sevgi: Dün “Tarık dükkâna gelmedi” dedi, “hasta”. Tarık hiç hastalanmaz. On dört yıldır bir gün hastalanmadı.
`),
    }),
    option('VQ_KARAR', '“Vedat Bey’e söyleyecek misiniz?”', {
      visibleWhen: flag('sevgi_anlatti'),
      score: { SAVUNMA_STRATEJISI: 20 },
      responses: B(`
sevgi: Bilmiyorum. Siz ne dersiniz?
P: Bu sizin kararınız Sevgi Hanım. Ben size ne yapacağınızı söyleyemem. Ama bunun mahkemede bir gün konuşulabileceğini bilmenizi isterim.
sevgi.uzgun: Mahkemede. Vedat’ın önünde. Bir öğretmen olarak hayatım boyunca çocuklara “doğruyu söyle” dedim. Kendi mutfağımda söyleyemedim.
N: Kalktı, içerideki odanın kapısını biraz daha araladı. Vedat uyuyordu; sağ eli yastığın altında.
sevgi: Uyansın. Uyanınca söylerim. Belki.
`),
    }),
    toHub('SEVGI_BITIR', 'Vedalaş'),
  ],
});

const emreHazir: Cond = any(not(flag('emre_kapandi')), flag('emre_acildi'));

const emre = conversation('ARA_EMRE', {
  ...ARA,
  title: 'Emre',
  eyebrow: 'KİŞİLER',
  background: 'depo',
  room: { label: 'MATBAA · KOLİ MASASI', character: 'emre' },
  lines: [
    W(
      flag('fact_emre_davetiye'),
      `
C#depo: ATEŞ MATBAASI — OKUL ÇIKIŞI
N: Emre beni görünce kulaklığını hemen çıkardı. Davetiyelerin sırrını bana söylemişti; artık aramızda bir şey vardı.
emre: Abla, Vedat abiye söylemediniz, değil mi? Davetiyeleri. Sağ olun. Duruşmayı duydum; sol el diye bağırıyormuş koridorda.
`,
    ),
    O(`
C#depo: ATEŞ MATBAASI — OKUL ÇIKIŞI
N: Emre okul çantasını bir kolinin üstüne fırlattı. Dijital odanın ışığı kapalıydı; Tarık iki gündür gelmiyormuş.
emre: Abla, duruşmayı duydum. Vedat abi sol el diye bağırıyormuş koridorda. Ne demek o?
`),
  ],
  choices: [
    option('MQ_OZUR', '“Geçen sefer sert konuştum. Özür dilerim.”', {
      visibleWhen: all(flag('emre_kapandi'), not(flag('emre_acildi'))),
      effects: [raise('emre_acildi')],
      responses: B(`
emre: …Tamam abla. Ben de korktum. Davetiyeler yüzünden. Vedat abi bilmiyor.
`),
    }),
    option('MQ_SOLAK', '“Dükkânda solak biri var mı?”', {
      visibleWhen: has('ded_solak'),
      score: { SORGULAMA: 60 },
      effects: [ifThen(emreHazir, [raise('fact_solak_tarik')])],
      responses: [
        W(
          emreHazir,
          `
emre: Solak mı? Tarık abi. Makası bile kendine göre çevirdi, kesim masasındakini. Biz hep geri çeviririz, o yine sola takar.
emre: Bir de irsaliyeleri o imzalar çoğu zaman. Vedat abi makinedeyken. “V. Ateş” diye. Sol eliyle, böyle yamuk yamuk. Herkes bilir.
N: Söyledikten sonra sustu. Ne söylediğini anlamış gibi.
emre.saskin: Abla… Ben bir şey demedim, değil mi? Ben sadece makas dedim.
T: Bir makas. Bir irsaliye. Bir çocuğun bilmeden söylediği cümle. Bu cümleyi kürsüye taşımak bir çocuğu kürsüye taşımaktır. Başka bir yol bulmalıyım.
`,
        ),
        O(`
emre: Bilmiyorum abla. Bana sormayın. Ben bir şey bilmiyorum.
N: Kulaklığını taktı. Geçen seferki kapı hâlâ kapalıydı.
`),
      ],
    }),
    option('MQ_YALAN', '“Mahkemede o sabah dükkânda olduğunu, Vedat abini gördüğünü söyler misin?”', {
      score: { SAVUNMA_STRATEJISI: -200 },
      effects: [inc('ethics'), raise('etik_kirlik')],
      bad: 'O sabah okulda olan bir çocuğa, görmediği bir şeyi tanık olarak söylemesini istedin: yalan tanıklığa azmettirme (TCK 272, 38) ve meslekten çıkarmayı gerektirebilecek bir meslek kuralı ihlali (Av.K. 34).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
emre.saskin: Ama abla, ben okuldaydım. Salı. Atölye dersi.
P: Kimse bilmez. Vedat abin için.
emre: …Vedat abi için. Tamam. Söylerim.
N: Kulaklığını takmadı. Bir koliyi bantlamaya başladı; bant iki kere koptu.
T: Az önce bir çocuğu bir yalanın içine koydum. Bir dava kazanmak için. Bunu kimse görmedi. Ben gördüm.
`),
    }),
    option('MQ_GECE', '“6 Şubat gecesi dükkâna geldin mi?”', {
      visibleWhen: all(flag('fact_emre_davetiye'), emreHazir),
      score: { SORGULAMA: 20 },
      responses: B(`
emre: Yok abla. O hafta sınav vardı. Ama… sabah geldiğimde kesim masasında kırpıntı vardı. Beyaz, ince kâğıt. 90 gram gibi. Ben kuşe keserim, kalın.
emre: Bir de makinenin sayacı. Ben her gece sayacı yazarım bir kâğıda, Vedat abi fark etmesin diye. Sabah iki fazlaydı.
T: Bir çırağın gizli defteri, bir başkasının gizli işini kaydetmiş. Bunu kürsüye taşımayacağım; bir çocuğun sırrı bir savunmanın taşı olmamalı.
`),
    }),
    toHub('EMRE2_BITIR', 'Çık'),
  ],
});

const nermin = conversation('ARA_NERMIN', {
  ...ARA,
  title: 'Nermin Kurt',
  eyebrow: 'KİŞİLER',
  background: 'kafe',
  room: { label: 'MUDANYA · KURT ECZANESİ', character: 'nermin' },
  lines: [
    W(
      flag('nermin_baski'),
      `
C#kafe: MUDANYA — KURT ECZANESİ
nermin.kizgin: Siz yine mi? Şikâyetimi geri çekmemi isteyen avukat. Kapı orada.
T: Bir kez yanlış kapı çaldım. İkinci kez çalmak, birincisini geri almıyor.
`,
    ),
    O(`
C#kafe: MUDANYA — KURT ECZANESİ
N: Eczane kapanmak üzereydi. Nermin kepengi yarıya indirmiş, içeride kasayı sayıyordu. Beni görünce saymayı bıraktı.
nermin: Duruşmayı duydum. Sol el. Kardeşim sağ elini masaya koymuş, öyle mi? Avukatım anlattı.
nermin: Ben otuz yıl eczacılık yaptım. Bir reçetedeki imza sahte mi değil mi, anlarım. Ama kardeşimin imzasına hiç bakmadım. Bakmak aklıma gelmedi.
`),
  ],
  choices: [
    option('NQ2_SURET', '“Noterin arşivinde satış yetkisi yok; suret basılmış bir kopya.”', {
      visibleWhen: all(has('ded_suret_sahte'), not(flag('nermin_baski'))),
      score: { SORGULAMA: 40 },
      effects: [raise('fact_erol_teklif')],
      responses: B(`
nermin: Biliyorum. Ben oradaydım, söyledim size. Satış yoktu.
N: Bir süre sustu. Kasanın çekmecesini kapattı.
nermin: Bir şey söylemedim size. Geçen kasımda o emlakçı, Kılınç, bana geldi. Evi iki milyon yüz bine istedi. “Nakit” dedi. Ben güldüm, “üç buçuk eder” dedim.
nermin: Gitti. Şubatta ev bir milyon altı yüze satıldı; ona. Ben o gün bir şey anlamadım. Şimdi… şimdi bir şey anlıyorum ama ne anladığımı bilmiyorum.
T: Erol evi istiyordu; Nermin satmadı. Sonra biri sattı. Erol kime gitti?
`),
    }),
    option('NQ2_TARIK', '“Tarık evle ya da kâğıtlarla ilgili bir şey sordu mu hiç?”', {
      visibleWhen: all(halka, not(flag('nermin_baski'))),
      score: { SORGULAMA: 50 },
      effects: [raise('fact_tarik_tapu')],
      responses: B(`
nermin: Tarık mı? Halit’in oğlu? …Ocakta aradı. Annemin tapu fotokopisini istedi, “banka için, babaannemin hesabı” dedi. Ben de verdim; vasiyim, bankayla ben uğraşırım, garip geldi ama verdim.
nermin.uzgun: Halit ölünce onu ben de büyüttüm avukat hanım. Okul harçlarını ben ödedim. Siz şimdi bana ne diyorsunuz?
P: Hiçbir şey demiyorum. Yalnızca soruyorum.
T: Soru sormak bir suçlama değildir. Ama bu kadının yüzünde, sorunun cevabını kendi kendine verdiğini gördüm.
`),
    }),
    toHub('NERMIN2_BITIR', 'Çık'),
  ],
});

const hayriye = conversation('ARA_HAYRIYE', {
  ...ARA,
  title: 'Hayriye Ateş',
  eyebrow: 'KİŞİLER',
  background: 'hastane',
  room: { label: 'ÇEKİRGE · HUZUREVİ', character: 'hayriye' },
  lines: [
    W(
      flag('hayriye_imza'),
      `
C#hastane: ÇEKİRGE — GÜNEŞ HUZUREVİ
N: Bakıcı kapıda durdurdu beni. “Vasisi talimat verdi; avukatlar yalnızca refakatle.” Refakatle girdim. Hayriye Hanım beni tanımadı; iyi ki.
`,
    ),
    W(
      flag('hayriye_eslik'),
      `
C#hastane: ÇEKİRGE — GÜNEŞ HUZUREVİ
N: Pencerenin önü. Düğme kutusu kapalı. Hayriye Hanım beni görünce kutuyu bana doğru çevirdi; düğme ayırdığımızı hatırlıyordu.
hayriye: Sen geldin mi kızım? Sedefleri ayırmıştık seninle. Gel otur.
`,
    ),
    O(`
C#hastane: ÇEKİRGE — GÜNEŞ HUZUREVİ
N: Pencerenin önü. Düğme kutusu. Bu kez kutu kapalı; Hayriye Hanım ellerini kutunun üstünde birleştirmiş, bahçeye bakıyordu.
hayriye: Sen kimsin kızım? Nermin’in arkadaşı mısın? Otur.
`),
  ],
  choices: [
    option('HQ2_ESLIK', 'Yanına otur; bahçeyi birlikte seyret', {
      score: { SAVUNMA_STRATEJISI: 30 },
      effects: [ifThen(halka, [raise('fact_hayriye_resim')])],
      responses: [
        W(
          halka,
          `
N: Uzun bir süre bahçeyi seyrettik. Bir bahçıvan yaprakları süpürüyordu. Hayriye Hanım birden bana döndü; gözleri berrak, sesi genç.
hayriye: Halit’in oğlu kâğıtlarımın resmini çekerdi. Telefonla. “Bankaya babaanne” derdi. Noterden gelince de çekti. Ben “ne güzel” dedim, “akıllı çocuk”.
hayriye: Halit’e benzemez o. Halit sağ elle yazardı, o hep öbür elle. Okulda öğretmen bağlardı elini, ben çözerdim. “Bırakın çocuğu” derdim.
N: Sonra gözleri yeniden bulandı. Bahçıvana el salladı.
hayriye: Halit geliyor mu? Çorbasını koydum.
T: Bir büyükanne, bir torunun sol elini çözerken. Kırk yıl önce. Bunu bir mahkemeye taşımayacağım; bu onun anısı. Ama artık biliyorum.
`,
        ),
        O(`
N: Uzun bir süre bahçeyi seyrettik. Bir bahçıvan yaprakları süpürüyordu.
hayriye: Evim yerinde mi kızım? Cumbadaki perde… Yıkanması lazım.
P: Yerinde, Hayriye Hanım.
T: Yalan söyledim. Bazı yalanlar bir insanın onuruna yazılmış borçlardır. Bunu bir gün ödeyeceğim; tapu iptal davasıyla.
`),
      ],
    }),
    toHub('HAYRIYE2_BITIR', 'Vedalaş'),
  ],
});

const erolG = story('ARA_EROL_G', {
  ...ARA,
  title: 'Kılınç Gayrimenkul',
  background: 'buro',
  lines: B(`
C#buro: SETBAŞI — KILINÇ GAYRİMENKUL
N: Erol beni kendisi aramıştı: “Bir uğrayın avukat hanım, bir çay içelim, uzlaşalım.” Uzlaşmak. Tapu iptal edilirse parasını kimden alacağını düşünüyordu.
erol: Hoş geldiniz! Hacı, çay. Bakın avukat hanım, bu iş uzamasın. Ben mağdurum. Siz de müvekkilinizi kurtarmak istiyorsunuz. Belki bir yolu vardır.
N: Telefonu çaldı. Ekrana baktı, yüzü bir an değişti. “Bir dakika” dedi ve arka odaya geçti. Kapı aralık kaldı.
T: Masasının üstü açıktı. Bir avukat çekmece açmaz, kasa kurcalamaz. Ama gözlerini kapatması da gerekmez.
`),
  choices: [cont('EROLG_DEVAM', 'Masaya bak', 'ARA_EROL', { role: 'PRIMARY' })],
});

const erolScene = retarget(
  sceneSearch('ARA_EROL', {
    ...ARA,
    title: 'Erol’un masası',
    hud: ['taps_e'],
    exposeCounts: true,
    scene: 'sc_emlak',
    background: 'buro',
    instruction: 'Masada ve odada açıkta duran şeylere bak. Boş yere dokunmak bir büyüteç hakkı yer.',
    costVar: 'taps_e',
    miss: fallback('FB_EROL', 'TAP', {
      score: { ARASTIRMA: -10 },
      feedback: { text: 'Deri, cila, sigara külü. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
    }),
    finish: { id: 'EROL2_BITIR', label: 'Erol dönmeden çık' },
  }),
);

const tarikGece = story('ARA_TARIK', {
  ...ARA,
  title: 'Gece, matbaa',
  background: 'depo_gece',
  lines: B(`
C#depo_gece: 22.40 — ATEŞ MATBAASI, KAYHAN
N: Sokak boştu. Börekçinin kepengi inik, bakırcının vitrini karanlık. Matbaanın camlı odasında bir ışık yanıyordu.
N: Camın ardında Tarık. Bilgisayarın başında, sol elinde bir fare; sağ eliyle yüzünü ovuşturuyordu. Masada bir yığın kâğıt ve bir çakmak.
T: Yanan bir ışık, bir çakmak, bir yığın kâğıt. Kapıyı çalabilirim. Kapıyı çalmayabilirim. Leyla’nın sesi kulağımda.
`),
  choices: [
    option('TG_YUZLES', 'Kapıyı çal; yüzleş', {
      score: { SAVUNMA_STRATEJISI: -100 },
      effects: [inc('ethics'), raise('tarik_uyarildi'), dec('cred')],
      bad: 'Şüphelendiğin kişiyle duruşma dışında yüzleştin: avukat kolluk değildir; delilleri karartma riski doğurdun ve tanığı etkiledin (Av.K. 34; CMK 158 yolu varken).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
N: Kapıyı çaldım. Tarık irkildi; çakmağı cebine soktu, kâğıtları bir çekmeceye itti. Kapıyı açtı.
tarik: Avukat hanım? Bu saatte? Bir şey mi oldu? Amcam iyi mi?
P: Randevuyu alan numara senin numaran Tarık.
N: Bir an hiçbir şey olmadı. Sonra Tarık gülümsedi; yorgun, kibar, alçak sesli.
tarik: Telefonum o hafta dükkânda kaldı avukat hanım. Herkes kullandı. Bunu mahkemede de söylerim. Siz söyletmeden.
N: Kapıyı yavaşça kapattı. Işığı söndürdü.
T: Bir soru sordum ve bir cevabı hazırlattım. Kürsüde artık bir yalan değil, bir prova dinleyeceğim.
`),
      next: HUB,
    }),
    option('TG_TAKIP', 'Bekle; çıkınca arabasını takip et', {
      score: { SAVUNMA_STRATEJISI: -80 },
      effects: [inc('ethics'), dec('cred')],
      bad: 'Bir şüpheliyi takip etmek avukatın işi değildir; kendini ve dosyayı tehlikeye attın. Bilgini savcılığa bildirmek gerekirdi (CMK 158).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
N: Bir saat bekledim. Tarık çıktı, Doblo’ya bindi. Takip ettim; iki sokak sonra kırmızıda durdu, aynasından bana baktı. Sonra yeşilde sağa döndü.
N: Ertesi sabah Vedat aradı: “Tarık gece biri onu takip ediyor demiş. Korkmuş. Kim yapar böyle bir şey?”
T: Ben yaparım. Yapmamam gereken her şeyi, bir gecede.
`),
      next: HUB,
    }),
    option('TG_GIT', 'Kapıyı çalma; büroya dön ve yaz', {
      score: { SAVUNMA_STRATEJISI: 80 },
      effects: [raise('tarik_dokunma')],
      good: 'Doğru tutum: şüpheyi kovalamadın; bildiklerini somut delillerle savcılığa ve mahkemeye taşımaya karar verdin (CMK 158; Av.K. 34).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
N: Işığa bir süre daha baktım. Sonra arabaya döndüm. Büroya gittim, bilgisayarı açtım ve yazmaya başladım: tarih, saat, numara, tutanak.
T: Bir avukatın silahı bir dilekçedir. Ağır değildir; ama doğru yere düşerse bir kapıyı açar. Kapıyı ben açmam; savcı açar.
N: Gece yarısı Leyla’ya bir mesaj attım: “Kapıyı çalmadım.” Cevap bir dakika sonra geldi: “Biliyorum. Çalsaydın ben de bilirdim.”
T: Leyla her şeyi bilir. Ya da bilmiyormuş gibi yapmanın ne işe yaradığını bilir.
`),
      next: HUB,
    }),
  ],
});

// --- Dilekçe ve suç duyurusu ---

const tanik = story('ARA_TANIK', {
  ...ARA,
  title: 'Tanık listesi',
  background: 'buro',
  lines: B(`
C#buro: ARSLAN HUKUK — TANIK LİSTESİ
N: İkinci celseye kimi çağıracağım? Erol Kılınç savcılık tanığı olarak zaten gelecek. Gerisi bana kalmış.
leyla: Bir tanığı ne söyleyeceği için çağırma. Ne gördüğü için çağır. Bir de: çağırdığın her tanık kürsüde sana da döner.
leyla: Tanığı kendin götürmek istersen o da mümkün: doğrudan davet. Ama mahkemeye önceden söyle; hâkimler sürprizi sevmez.
`),
  choices: [
    option('TN_SINAN', 'Kurye Sinan Öztürk', {
      visibleWhen: flag('sinan_razi'),
      score: { USUL_BILGISI: 60 },
      effects: [raise('sinan_tanik')],
      responses: B(`
T: Bir kurye. Bir çay. On sekiz dakika. Mahkemeden onu dinlemesini istiyorum; ne söyleyeceğini değil, ne gördüğünü anlatsın diye.
`),
      good: 'Mazereti bağımsız bir tanıkla desteklemek için tanığın davetini istedin (CMK 177; gerekirse doğrudan davet, CMK 178).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('TN_TARIK', 'Mukayese belgelerini teslim eden Tarık Ateş', {
      visibleWhen: halka,
      score: { USUL_BILGISI: 60 },
      effects: [raise('tarik_tanik')],
      responses: B(`
T: “Mukayese belgelerini teslim eden ve dükkânda bu belgelerin düzenlenişini bilen Tarık Ateş’in tanık olarak dinlenmesi.” Bir cümle; içinde bir suçlama yok. Bir soru var.
T: Hâkim ona haklarını hatırlatacak. Susabilir. Bunu biliyorum; yine de yazıyorum.
`),
      good: 'Mukayese malzemesinin kaynağını açıklayabilecek kişinin tanık olarak dinlenmesini istedin (CMK 177). Akraba tanığın çekinme hakkı mahkemece hatırlatılacak (CMK 45).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('TN_EMRE', 'Çırak Emre Kaya', {
      score: { USUL_BILGISI: -20 },
      effects: [raise('emre_tanik')],
      neutral: 'Emre olay sabahı okuldaydı; tanıklığı mazereti ispat etmez.',
      next: '$stay',
    }),
    option('TN_HAYRIYE', 'Hayriye Ateş', {
      score: { USUL_BILGISI: -40 },
      bad: 'Vasi altındaki, orta evre Alzheimer’lı mağduru kürsüye çağırmak ispata bir şey katmaz; onu yalnızca yorar.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    toHub('TANIK_VER', 'Dilekçeyi ver'),
  ],
});

const suc = story('ARA_SUC', {
  ...ARA,
  title: 'Suç duyurusu',
  background: 'buro',
  lines: B(`
C#buro: ARSLAN HUKUK — SUÇ DUYURUSU
N: “Bursa Cumhuriyet Başsavcılığı’na.” Bir boş sayfa daha. Bu kez bir mahkemeye değil, bir savcıya; bir talep değil, bir ihbar.
leyla: Kimin hakkında yazdığına dikkat et. Somut olmayan bir suçlama, iftiraya bir adım uzaktır. Somut olan ise, adını koymasan da bir kişiyi gösterir.
leyla: Delillerini say. Tarih, saat, numara, belge. Kanaatini değil.
`),
  choices: [
    option('SUC_SOMUT', 'Tarık Ateş hakkında: randevu numarası, teslim tutanağı ve diğer somut halkalarla', {
      visibleWhen: all(
        has('ded_randevu'),
        any(has('ded_borc'), flag('fact_solak_tarik'), flag('fact_tarik_tapu'), has('ev_tutanak')),
      ),
      score: { USUL_BILGISI: 150 },
      effects: [raise('suc_duyurusu'), inc('legal_hits')],
      good: 'Somut delillere dayanan suç duyurusu (CMK 158): savcılık üçüncü kişinin resmî imza ve yazı örneklerini toplayıp Adli Tıp’a gönderebilir. Kovalamadın; bildirdin.',
      category: 'USUL_BILGISI',
      responses: B(`
N: Dört sayfa yazdım. Randevu kaydı, numara çizelgesi, teyit araması, asıl teslim tutanağı; varsa ötekiler. Hiçbir yerde “o yaptı” demedim. Kâğıtlar dedi.
N: Ertesi sabah adliyede. Nöbetçi savcı okudu, bir sayfayı iki kez okudu. “Örneklerini isteriz” dedi. “Adli Tıp’taki dosyaya ekletiriz.”
T: Bir dilekçe, bir kapıyı açtı. Kapının ardında ne olduğunu ben değil, savcı görecek.
`),
      next: HUB,
    }),
    option('SUC_BELIRSIZ', 'Kimliği belirsiz kişi hakkında: sahte suret ve sol elle atılan imza', {
      score: { USUL_BILGISI: 50 },
      effects: [raise('suc_belirsiz')],
      neutral: 'Faili meçhul suç duyurusu yerinde ama yönsüz; savcılık kimin örneklerini toplayacağını bilmez.',
      responses: B(`
N: Kısa bir dilekçe. “Senetteki imzayı sol elini kullanan, kimliği belirsiz bir kişi atmıştır.” Savcılık kayda aldı. Kimin peşine düşeceğini sormadı; ben de söylemedim.
`),
      next: HUB,
    }),
    option('SUC_NERMIN', 'Nermin Kurt hakkında: evi isteyen oydu', {
      score: { USUL_BILGISI: -100 },
      effects: [inc('ethics'), dec('cred'), raise('suc_nermin')],
      bad: 'Dayanaksız bir suç duyurusu iftira riskidir (TCK 267) ve meslek kurallarına aykırıdır. Nermin’i işaret eden tek bir delil yoktu.',
      category: 'USUL_BILGISI',
      responses: B(`
N: Yazdım. Bir sebep, bir öfke, bir şikâyet. Delil yok. Savcı okudu, bana baktı: “Avukat hanım, bu bir suç duyurusu mu, bir intikam mı?”
T: Cevap veremedim. Cevap vermem gereken soru buydu.
`),
      next: HUB,
    }),
    option('SUC_EROL', 'Erol Kılınç hakkında: tefecilik şüphesi', {
      visibleWhen: has('clue_mahsup'),
      score: { USUL_BILGISI: 30 },
      effects: [raise('suc_erol')],
      neutral: 'Erol’un takvimindeki not başka bir suçun ucu olabilir; ama bu dosyanın sorusu imzanın kime ait olduğu.',
      responses: B(`
N: Bir sayfa: takvimdeki “mahsup”, piyasanın yarısına satılan ev. Savcı not aldı. “Ayrı dosya” dedi. Haklıydı.
`),
      next: HUB,
    }),
    toHub('SUC_GERI', 'Şimdi değil'),
  ],
});

// --- Tahta ---

// Ara tahtası yalnızca ara evrenin kartlarını ve onlara bağlanan birkaç eski kartı taşır (durum uzayı küçük kalsın).
const POOL2 = [
  'clue_tel_liste',
  'clue_senet_saat',
  'clue_iki_el',
  'clue_doblo',
  'clue_ruhsat',
  'clue_sivanma',
  'clue_sag_el',
  'clue_mukayese_ozel',
  'clue_toner_muhur',
  'clue_noter_arsiv',
  'clue_kargo_saat',
  'clue_kargo_imza',
  'clue_randevu_no',
  'clue_teyit',
  'clue_mahsup',
  'clue_bahis',
];

const cikarim = retarget(
  deductionBoard('ARA_CIKARIM', {
    ...ARA,
    title: 'Çıkarım tahtası',
    background: 'buro_gece',
    lines: B(`
N: İki ipucunu seç. Birbirini tamamlıyorsa duruşmada kullanabileceğin bir delil doğar.
T: Pano kalabalıklaştı. İplerin bazıları aynı raptiyeye bağlanmaya başladı. Bundan korkuyorum.
`),
    pool: POOL2,
    recipes: [
      ...invRecipes('AB').filter((r) => ['AB_SOLAK', 'AB_SURET', 'AB_MUKAYESE'].includes(r.id)),
      recipe('AB_MAZERET', 'clue_kargo_saat', 'clue_senet_saat', {
        effects: firstTime('ded_mazeret'),
        feedback: newDed(
          'Kurye saatiyle mazeret',
          '11.19–11.37 arası Vedat matbaadaydı; senet 11.24’te tapuda imzalandı.',
        ),
        responses: B(`
T: Bir adam aynı anda iki yerde olamaz. Biri bir terminal, öbürü bir tapu sistemi. İkisi de makine; ikisi de yalan söylemez.
`),
      }),
      recipe('AB_RANDEVU', 'clue_randevu_no', 'clue_tel_liste', {
        effects: firstTime('ded_randevu'),
        feedback: newDed(
          'Randevu numarasının sahibi',
          'Randevuyu alan 0532 418 77 47, matbaanın çizelgesinde Tarık Ateş’in numarası.',
        ),
        responses: B(`
T: Duvardaki yağlı kâğıt. Altı numara. Üçüncü satır. Bunu ilk gün gördüm ve hiçbir şey düşünmedim.
T: Bir numara bir insan değildir. Ama bir numaranın cebinde taşındığı insan, kürsüde ona bir açıklama borçludur.
`),
      }),
      recipe('AB_RANDEVU2', 'clue_teyit', 'clue_tel_liste', {
        effects: firstTime('ded_randevu'),
        feedback: newDed(
          'Randevu numarasının sahibi',
          'Teyit aramasını 11.06’da yanıtlayan hat, çizelgede Tarık Ateş’in numarası.',
        ),
      }),
      recipe('AB_IMZA', 'clue_kargo_imza', 'clue_iki_el', {
        effects: firstTime('ded_imza_farki', 200),
        feedback: {
          title: 'Gerçek imza başka el',
          text: 'Vedat’ın 11.37’de terminale attığı imza irsaliyelerdeki akıcı gruba ait; sola yatık gruba değil.',
          label: 'YENİ DELİL · +200 SKOR',
          tone: 'success',
        },
      }),
      recipe('AB_BORC', 'clue_mahsup', 'clue_bahis', {
        effects: firstTime('ded_borc'),
        feedback: newDed(
          'Borca mahsup edilen ev',
          '“T. · mahsup 1.400” ve bahis borcunun alacaklısı “E. Kılınç”. Ev nakitle değil, borçla el değiştirmiş.',
        ),
        responses: B(`
T: Bir milyon dört yüz bin. Bir ev, bir borcun karşılığı olmuş. Kimin borcunun?
`),
      }),
      ...invDecoys('AB').filter((r) => r.id === 'AB_X_RUHSAT'),
      wrongPair(
        'AB_X_TEYIT',
        'clue_teyit',
        'clue_doblo',
        'Bir telefon araması ve beyaz bir araç. İkisi de bir yerde; ama aynı yerde değil.',
      ),
      wrongPair(
        'AB_X_MAHSUP',
        'clue_mahsup',
        'clue_ruhsat',
        'Alıcının hesabı ve acelesi. Erol’u anlatır; senedi imzalayanı değil.',
      ),
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
C#buro: ARSLAN HUKUK — LEYLA’NIN ODASI
leyla: Mazeret bir hikâyedir Deniz. Hâkim onu dinler ve sorar: bunu anlatanın bir çıkarı var mı? Bir terminalin çıkarı yoktur. Bir kuryenin de pek yoktur.
leyla: Ama kayıt tek başına konuşmaz; onu bir saate, bir imzaya bağla. Tahtaya git.
leyla: Bir de: kayıtlarda bir numara gördüysen, o numaranın sahibini bir yerde zaten görmüşsündür. Dükkânın duvarlarına geri dön; aklında.
`,
    ),
    W(
      all(cmp(v('ara_day'), '==', 2), halka),
      `
C#buro: ARSLAN HUKUK — LEYLA’NIN ODASI
leyla: Bir isim buldun. Yüzünden belli. Şimdi en zor kısım: o ismi bir müvekkili kurtarmak için kullanacaksın, ama o isme bir şey yapmayacaksın.
leyla: Suç duyurusu yaz; somut yaz. Savcı onun resmî imza örneklerini toplar, Adli Tıp’a gönderir. Biz yapamayız; o yapabilir.
leyla: Mahkemeden tanık olarak dinlenmesini iste. Akrabadır; hâkim çekinme hakkını hatırlatacak. Susarsa susar. Susması bir delil değildir; ama sorulan sorular tutanakta kalır.
`,
    ),
    W(
      cmp(v('ara_day'), '==', 2),
      `
C#buro: ARSLAN HUKUK — LEYLA’NIN ODASI
leyla: Senedi imzalayan el Vedat’ın değilse, birinin. Bunu kanıtlamak zorunda değilsin. Ceza davasında şüphe sanık lehinedir.
leyla: Ama hâkim bir boşluğu sevmez. “Kimin eli” sorusuna cevap veremiyorsan, en azından “Vedat’ın eli değil” cümlesini taş gibi sağlam kur.
`,
    ),
    O(`
C#buro: ARSLAN HUKUK — LEYLA’NIN ODASI
leyla: İkinci celse. Erol kürsüde olacak. Kaygan bir adam; her sorudan bir atasözüyle kaçar. Atasözlerine cevap verme; kâğıtlarını göster.
leyla: Mütalaadan sonra esas savunman. Üç dayanak seç; en güçlü üçünü. Bir savunma, söylediği her şey kadar söylemediği şeylerle de ölçülür.
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
    onEnter: [inc('ara_day', 1), set('ara_ap', ARA_AP)],
  },
);

const aksam1 = story('ARA_AKSAM1', {
  ...ARA,
  title: 'Kurşun harfler',
  background: 'buro_gece',
  lines: B(`
C#buro_gece: GECE 21.50 — ARSLAN HUKUK
N: Kapı çaldı. Vedat. Elinde küçük bir kutu; kutunun içinde dört kurşun harf, bir tahtaya dizilmiş, iple bağlanmış: Ş, E, T, A.
vedat: Ters dizilir. Kâğıda basınca doğru okunur. ATEŞ. Babam bana ilk bunu öğretmişti. Size getirdim; bir hatıra.
vedat: Avukat hanım, dürüst söyleyin. Kurtulur muyum?
T: Kurşun harfler elimde soğuk ve ağır. Bir soru, ondan da ağır.
`),
  choices: [
    option('AA1_DURUST', '“Bilmiyorum. Ama imzanızın sizin olmadığını kanıtlayacak kâğıtlarımız var.”', {
      effects: [inc('trust', 10), raise('vedat_durust')],
      responses: B(`
vedat: Bilmiyorum. İyi. Herkes “olur olur” diyor; kimse bilmiyor. Siz bilmediğinizi biliyorsunuz. Bu iyi.
N: Kapıdan çıkarken döndü.
vedat: Tarık iki gündür gelmiyor. Hasta, dedi. Hiç hastalanmazdı. Neyse.
`),
      next: HUB,
    }),
    option('AA1_SOZ', '“Kurtulursunuz. Merak etmeyin.”', {
      effects: [raise('soz_verdi')],
      responses: B(`
vedat.mutlu: İnşallah. İnşallah. Sevgi de öyle dedi; siz söylemişsiniz.
N: Gitti. Kurşun harfler masamda kaldı; ters, ağır, sabırlı.
T: İkinci kez söz verdim. Sözler kurşun gibi dizilir; ters. Kâğıda basılınca okunur.
`),
      next: HUB,
    }),
  ],
});

const aksam2 = story('ARA_AKSAM2', {
  ...ARA,
  title: 'Gece',
  background: 'buro_gece',
  lines: [
    W(
      flag('suc_duyurusu'),
      `
C#buro_gece: GECE 22.30 — ARSLAN HUKUK
leyla@phone: Savcılıktan haber var. Tarık Ateş’in noter ve banka imza örnekleri istenmiş. Adli Tıp’taki dosyaya eklenecek. Sana söylemedim say.
leyla@phone: Bir şey daha: Tarık bugün ifadeye çağrılmış; avukatıyla gelmiş, susmuş. Hakkı. Senin dosyan değil o; unutma.
T: Bir kapı açıldı. Ardında ne olduğunu ben görmeyeceğim. Ama Vedat görecek; bir mahkeme kararında, bir cümle olarak.
`,
    ),
    W(
      flag('suc_nermin'),
      `
C#buro_gece: GECE 22.30 — ARSLAN HUKUK
leyla@phone: Nermin Kurt’un avukatı aradı. Hakkında bir suç duyurusu yazmışsın. İftiradan şikâyet edeceklermiş. Yarın konuşacağız Deniz. Uzun konuşacağız.
T: Bir kadının öfkesine öfkeyle cevap verdim. Kâğıda.
`,
    ),
    W(
      any(flag('suc_belirsiz'), flag('suc_erol')),
      `
C#buro_gece: GECE 22.30 — ARSLAN HUKUK
leyla@phone: Dilekçen kayda girmiş. Savcılık bir dosya açtı; kimin peşine düşeceğini bilmiyorlar. Sen de söylemedin.
T: Bir kapıyı araladım; içine bir isim koymadım. Belki doğru, belki eksik.
`,
    ),
    O(`
C#buro_gece: GECE 22.30 — ARSLAN HUKUK
N: Büroda yalnızdım. Leyla gitmiş, ışığını açık bırakmıştı. Masasında ters duran çerçeve. Hiç sormadım; bu gece de sormadım.
T: Yarın son gün. Sonra bir kürsü, bir savcı, bir hâkim ve bir soru: kimin eli?
N: Telefonuma Sevgi’den bir mesaj düştü: “Vedat bu gece mutfakta imza atmıyor. Uyudu.” Altında bir kalp; öğretmenler kalp koymaz, diye düşündüm.
`),
  ],
  choices: [cont('AA2_DEVAM', 'Yeni güne başla', HUB, { role: 'PRIMARY' })],
});

// --- Duruşmadan önceki gece ---

const sonNodes: NodeDef[] = [
  decisionNode('ARA_SON_1', [{ to: 'ARA_SON_2' }], {
    ...ARA,
    title: 'Duruşmadan önceki gece',
    lines: B(`
C#buro_gece: 3 KASIM · 23.20 — ARSLAN HUKUK
N: Pano. Kurşun harfler panonun önünde: ŞETA. Kâğıda basılınca ATEŞ.
`),
  }),
  decisionNode('ARA_SON_2', [{ to: 'ARA_SON_3' }], {
    lines: [
      W(
        has('ded_mazeret'),
        `T: On sekiz dakika. Bir terminal ve bir tapu sistemi aynı anda iki ayrı yerde bir Vedat görüyor. Biri yalan söylüyor; yalan söyleyen makine değil.`,
      ),
      W(has('ev_kargo'), `T: Kargo kaydı masamda. Saatleri biliyorum; tapudaki saatle hiç yan yana koymadım.`),
      O(`T: Vedat o sabah dükkândaydı. Bunu biliyorum. Bunu bir kâğıda yazdıramadım.`),
    ],
  }),
  decisionNode('ARA_SON_3', [{ to: 'ARA_SON_4' }], {
    lines: [
      W(
        all(has('ded_randevu'), flag('suc_duyurusu')),
        `T: Bir numara, bir tutanak, bir dilekçe. Savcı Tarık’ın örneklerini Adli Tıp’a gönderdi. Yarın kürsüde, belki bir rapor, belki bir sessizlik.`,
      ),
      W(
        has('ded_randevu'),
        `T: Randevuyu alan numara Tarık’ın. Bunu biliyorum. Ne yapacağımı bilmiyorum; yarın kürsüde öğreneceğim.`,
      ),
      O(`T: Senedi imzalayan el hâlâ bir el. Bir isim değil. Belki de böyle kalmalı; şüphe, sanığın lehinedir.`),
    ],
  }),
  decisionNode('ARA_SON_4', [{ to: 'ARA_SON_5' }], {
    lines: [
      W(
        flag('etik_kirlik'),
        `T: Emre’nin bant makinesi. İki kere kopan bant. Yarın o çocuk kürsüde olacak; benim yüzümden.`,
      ),
      W(
        flag('tarik_uyarildi'),
        `T: Bir kapıyı çaldım; bir cevabı hazırlattım. Yarın Tarık’ın sesi bir prova gibi olacak.`,
      ),
      W(
        flag('sinan_kocluk'),
        `T: “On bir yirmi beş derim.” Bir kuryenin ağzına bir saat koydum. Terminal zaten biliyordu.`,
      ),
      W(flag('soz_verdi'), `T: “Kurtulursunuz.” Bir söz, kurşun harfler gibi masamda duruyor; ters.`),
      O(`T: Leyla’nın sesi: “Yarın birinin hayatı bozulacak.” Ya müvekkilimin ya da başkasının.`),
    ],
  }),
  decisionNode('ARA_SON_5', [{ to: 'ARA_SON' }], {
    lines: [
      W(
        flag('sevgi_anlatti'),
        `T: “E. Kılınç.” Bir öğretmenin bir masada gördüğü bir isim. Ocaktan beri susuyordu; bu hafta konuştu.`,
      ),
      W(
        flag('fact_hayriye_resim'),
        `T: “Okulda öğretmen bağlardı elini, ben çözerdim.” Bir büyükannenin anısı. Onu bir kürsüye taşımayacağım.`,
      ),
      W(
        flag('fact_erol_teklif'),
        `T: Erol geçen kasım evi Nermin’e istemiş, alamamış. Şubatta başka bir kapıdan almış. Hangi kapıdan?`,
      ),
      W(flag('tarik_dokunma'), `T: Camlı odanın ışığı. Kapıyı çalmadım. Bunu bir gün doğru bulacağım; bu gece değil.`),
      W(
        flag('vedat_durust'),
        `T: “Bilmiyorum” dedim Vedat’a. Kurşun harfleri bıraktı. Bir doğruyu taşımak, bir sözü taşımaktan hafiftir.`,
      ),
      W(
        cmp(v('ara_odak'), '==', 'INSAN'),
        `T: “İnsanların peşine düşeceğim” dedim Leyla’ya. Düştüm. Her biri bana bir parça verdi; hiçbiri bütünü vermedi.`,
      ),
      O(`T: Pano. Raptiyeler. Bir yığın kâğıt. Ve bir el; hâlâ havada, bir kalem tutar gibi.`),
    ],
  }),
  story('ARA_SON', {
    ...ARA,
    title: 'Duruşmadan önceki gece',
    background: 'sokak_yagmur',
    lines: B(`
N: Leyla odasının kapısında durdu. Paltosunu giymiş, şemsiyesi elinde.
leyla: Yarın birinin hayatı bozulacak Deniz. Ya müvekkilinin ya da başkasının. Kâğıtların sana hangisini söylediğini dinle.
leyla: Otuz yıl önce ben de bir gece böyle oturdum. Bir dosya, bir isim, bir sabah. Ertesi gün kazandım. Kazandığım günün akşamı da bir kapı kapandı; bir daha açılmadı.
N: Masasındaki ters çerçeveye bakmadı. Bakmamaya çalıştı.
leyla: Ve kimseyi kürsüde kırmaya çalışma. Kâğıtlarını göster; gerisini o kendisi yapar. Ya da yapmaz.
N!flash: Dışarıda şimşek. Bir an bütün şehir bir fotokopi gibi beyazladı; sonra yeniden yağmur.
`),
    choices: [cont('ARA_SON_DEVAM', 'Adliyeye git', 'C2_00G', { role: 'PRIMARY' })],
  }),
];

export const ara: CasePart = {
  nodes: [
    ...girisNodes,
    hub,
    kargo,
    randevu,
    tutanak,
    sinan,
    sevgi,
    emre,
    nermin,
    hayriye,
    erolG,
    erolScene,
    tarikGece,
    tanik,
    suc,
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
  discoveryPaths: [...giris.discoveryPaths],
};
