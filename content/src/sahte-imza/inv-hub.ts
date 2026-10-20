import {
  all,
  back,
  cmp,
  cont,
  dec,
  decisionNode,
  deductionBoard,
  discover,
  fallback,
  flag,
  has,
  ifThen,
  inc,
  nav,
  not,
  option,
  raise,
  recipe,
  ref,
  sceneSearch,
  score,
  set,
  story,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef, Effect } from '../../../tools/content/src/kit/index.js';
import { docNodes } from './inv-docs.js';
import { peopleNodes } from './inv-people.js';
import { vedatNodes } from './inv-vedat.js';
import { B, O, W } from './lib.js';
import { INV, p1 } from './shared.js';

// 50-investigation-1: 4 gün × 3 EP. Hub, sahne aramaları, dilekçe, çıkarım tahtası, Leyla, akşamlar, duruşma gecesi.

/** Tahtada bir çıkarımı yalnızca ilk kurulumda ödüllendirir (alternatif tarifler için). */
export const firstTime = (ded: string, amount = 300): Effect[] => [
  ifThen(not(has(ded)), [discover(ded), score('DELIL_ANALIZI', amount)]),
];

export const newDed = (title: string, text: string) => ({
  title,
  text,
  label: 'YENİ DELİL · +300 SKOR',
  tone: 'success' as const,
});

export const wrongPair = (id: string, a: string, b: string, text: string): ChoiceDef =>
  recipe(id, a, b, {
    score: { DELIL_ANALIZI: -50 },
    feedback: { title: 'Yanlış iz', text, label: 'BAĞLANTI YOK · −50 SKOR', tone: 'error' },
  });

// --- Hub ---

const hubChoices = {
  olay: [
    p1.activity('H_MATBAA', 'Matbaayı ara', 'INV_ARAMA_M', {
      once: true,
      description: 'Ateş Matbaası · büyüteç 6',
    }),
    p1.activity('H_HISAR', 'Hisar’daki eve git', 'INV_HISAR', {
      once: true,
      description: 'Boş ev · yan komşu Fikriye Hanım',
    }),
    p1.activity('H_HUZUR', 'Hayriye Hanım’ı ziyaret et', 'INV_HAYRIYE', {
      once: true,
      description: 'Çekirge · huzurevi',
    }),
  ],
  kisiler: [
    p1.activity('H_VEDAT', 'Vedat’la görüş', 'INV_VEDAT_G', {
      description: 'Matbaanın arka odası · 12 dk',
      visibleWhen: not(visited('INV_VEDAT')),
    }),
    p1.activity('H_VEDAT2', 'Vedat’la yeniden görüş', 'INV_VEDAT_G', {
      once: true,
      description: 'Matbaanın arka odası · 8 dk',
      visibleWhen: visited('INV_VEDAT'),
    }),
    p1.activity('H_TARIK', 'Tarık', 'INV_TARIK', { once: true, description: 'Yeğen · dijital baskı' }),
    p1.activity('H_EMRE', 'Emre', 'INV_EMRE', { once: true, description: 'Çırak · 19 yaşında' }),
    p1.activity('H_NERMIN', 'Nermin Kurt', 'INV_NERMIN', { once: true, description: 'Şikâyetçi · Mudanya' }),
    p1.activity('H_EROL', 'Erol Kılınç', 'INV_EROL', { once: true, description: 'Alıcı · Setbaşı' }),
  ],
  arsiv: [
    p1.activity('H_SENET', 'Tapu senedini incele', 'INV_SENET', { once: true, description: 'Resmî senet · 412/9' }),
    p1.activity('H_SURET', 'Sahte sureti incele', 'INV_SURET', { once: true, description: 'Emanetteki asıl' }),
    p1.activity('H_RAPOR', 'Grafolog raporunu oku', 'INV_RAPOR', { once: true, description: 'On iki sayfa ve ekleri' }),
    p1.activity('H_IRSALIYE', 'İrsaliye klasörünü incele', 'INV_IRSALIYE', {
      once: true,
      description: 'Matbaadaki karbonlar',
      visibleWhen: flag('fact_irsaliye'),
    }),
    p1.activity('H_NOTER', 'Notere git', 'INV_NOTER', { once: true, description: 'Bursa 14. Noterliği · arşiv' }),
    p1.activity('H_TAPU', 'Tapu müdürlüğüne git', 'INV_TAPU', { once: true, description: 'Osmangazi · usul' }),
    p1.activity('H_DIL', 'Delil talebi dilekçesi', 'INV_DIL', {
      description: '3 talep hakkı',
      visibleWhen: not(flag('dil_verildi')),
    }),
    p1.free('H_CIKARIM', 'Çıkarım tahtası', 'INV_CIKARIM', {
      description: '0 EP · ipuçlarını birleştir',
      enabledWhen: ref('kart2'),
      lockedReason: 'En az 2 ipucu gerekli.',
    }),
    p1.free('H_LEYLA', 'Leyla’ya danış', 'INV_LEYLA', {
      description: '0 EP · günde bir kez',
      visibleWhen: cmp(v('leyla_gun'), '<', v('day')),
      effects: [set('leyla_gun', v('day'))],
    }),
  ],
};

const hubLines = [
  W(
    cmp(v('day'), '==', 1),
    `
C: GÜN 1/4 · BİRİNCİ CELSEYE 21 GÜN
N: Hedef: senedi imzalayan kimdi? O sabah Vedat neredeydi?
T: Masamda dört kâğıt ve üç hafta. Bir kâğıdı okumak bir saat sürer; anlamak bir ömür. Bugün okumakla başlayacağım.
`,
  ),
  W(
    cmp(v('day'), '==', 2),
    `
C: GÜN 2/4 · BİRİNCİ CELSEYE 18 GÜN
N: Hedef: suret nereden çıktı? Noterin arşivi ne diyor?
T: Dün bir imzaya baktım. Bugün o imzanın dayandığı kâğıda bakacağım. Sahte bir kâğıt, sahte bir imzadan daha çok şey anlatır; çünkü onu biri tasarlamıştır.
`,
  ),
  W(
    cmp(v('day'), '==', 3),
    `
C: GÜN 3/4 · BİRİNCİ CELSEYE 15 GÜN
N: Hedef: raporun dayandığı kâğıtlar. Bilirkişi neye baktı, kim verdi?
T: Bir rapor, bir binanın çatısı gibidir. Herkes çatıya bakar. Ben temele bakacağım: ekler, listeler, tutanaklar.
`,
  ),
  O(`
C: GÜN 4/4 · BİRİNCİ CELSEYE 12 GÜN
N: Hedef: dilekçe ve tahta. Mahkemeden ne isteyeceksin? Kürsüde neyi göstereceksin?
T: Son gün. Bildiklerimi mahkemenin bilebileceği şeylere çevirmem gerek. Bir avukatın bildiği, kâğıda dönüşmedikçe bir sırdır.
`),
];

// --- Sahneler ---

const aramaM = sceneSearch('INV_ARAMA_M', {
  ...INV,
  title: 'Ateş Matbaası',
  hud: ['taps_m'],
  exposeCounts: true,
  scene: 'sc_matbaa',
  background: 'depo',
  instruction: 'Dükkânda dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps_m',
  lines: B(`
C#depo: ATEŞ MATBAASI — ÖĞLEDEN SONRA
N: Vedat makinenin başında. Tarık camlı odasında, ekrana eğilmiş. Emre bir koli taşıyor. Kimse bana bakmıyor; bu iyi.
vedat: Ne isterseniz açın avukat hanım. Çekmeceler, raflar, hepsi. Ben burada makinedeyim.
T: Bir dükkân, her gün aynı işi yapan insanların bıraktığı izlerle doludur. Alışkanlıklar. Bir alışkanlık bozulduğunda, orada bir hikâye vardır.
`),
  miss: fallback('FB_ARAMA_M', 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Kâğıt tozu ve mürekkep. Başka bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  }),
  finish: { id: 'ARAMA_M_BITIR', label: 'Dükkândan çık' },
});

const aramaH = sceneSearch('INV_ARAMA_H', {
  ...INV,
  title: 'Hisar · boş ev',
  hud: ['taps_h'],
  exposeCounts: true,
  scene: 'sc_hisar',
  background: 'ev',
  instruction: 'Evde dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps_h',
  lines: B(`
C#ev: HİSAR — HAYRİYE ATEŞ’İN EVİ, İÇERİSİ
N: Arka kapı gıcırdadı. İçeride beş aylık toz, naftalin ve soğuk bir soba. Duvarlarda dikiş kalıpları, bir köşede örtülü bir makine.
fikriye: Ben burada beklerim evladım. İçeri girersem ağlarım. Kırk yıl bu evde çay içtim.
T: Boş bir ev, sahibinin sesini saklar. Bu evin sahibi şimdi bir huzurevinde düğme ayırıyor ve evinin yerinde durduğunu sanıyor.
`),
  miss: fallback('FB_ARAMA_H', 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Toz ve naftalin. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  }),
  finish: { id: 'ARAMA_H_BITIR', label: 'Evden çık' },
});

// --- Dilekçe ---

const slotCost = [{ var: 'slots', amount: 1 }];
const dil = story('INV_DIL', {
  ...INV,
  title: 'Delil talebi dilekçesi',
  hud: ['slots'],
  background: 'buro',
  lines: [
    W(
      not(flag('dil_any')),
      `
C#buro: ARSLAN HUKUK — DİLEKÇE
N: Boş bir sayfa. “Bursa 7. Asliye Ceza Mahkemesi Hâkimliği’ne.” İmleç yanıp sönüyor.
T: Üç talep. Mahkeme her talebi kabul etmez; her gereksiz talep, gerçek talebin ağırlığını azaltır.
leyla: Ne istediğini değil, neden istediğini yaz. Hâkim “bu delil neyi ispat edecek” diye sorar; cevabın dilekçede olsun.
leyla: Kanun, taleplerin duruşmadan önce verilmesini ister. Duruşmada sözlü de istersin; ama hâkim celseye hazırlıksız gelir. Hazırlıksız hâkim, “bir sonraki celseye bakarız” der.
`,
    ),
    O(`
N: Dilekçe uzuyor. İmleç hâlâ yanıp sönüyor.
`),
  ],
  choices: [
    option('DIL_BILIRKISI', 'Resmî mukayese imzalarıyla Adli Tıp’tan yeni imza incelemesi', {
      visibleWhen: has('clue_mukayese_ozel'),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 80 },
      effects: [raise('dil_bilirkisi'), raise('dil_any'), ifThen(has('ded_mukayese'), [raise('bk_gerekce')])],
      responses: [
        W(
          has('ded_mukayese'),
          `
T: Birinci talep: Adli Tıp Kurumu, resmî mukayese imzaları. Noterdeki imza beyannamesi, bankadaki imza kartonu, nüfustaki başvuru formu. Kimin attığı belli olan imzalar.
T: Gerekçe: “Bilirkişiye verilen irsaliyelerde iki ayrı el vardır; karbonlar ektedir.” Bu cümleyi üç kez yazdım, ikisini sildim.
`,
        ),
        O(`
T: Birinci talep: Adli Tıp Kurumu, resmî makam önünde atılmış imzalarla yeni inceleme. Hangi makam, hangi imza? Bunu henüz bilmiyorum.
T: “Mukayese belgeleri özel belgedir.” Doğru bir cümle. Ama bir hâkime neden yetmediğini anlatmıyor.
`),
      ],
      good: 'Mukayese imzası tartışmasız olmalıdır: resmî makam önünde atılmış ya da sanıkça kabul edilmiş imzalarla yeni inceleme istenir (CMK 63, 67/5, 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_KARGO', 'Kargo şirketinden 18 Şubat teslim kaydı ve GPS dökümü', {
      visibleWhen: has('clue_takvim'),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 60 },
      effects: [raise('dil_kargo'), raise('dil_any')],
      responses: B(`
T: İkinci talep: kargo şirketinin 18 Şubat kaydı. Terminal saati, konum, teslim imzası. “Sanığın işlem saatinde işyerinde bulunduğunun tespiti için.”
T: Bir takvim notunu bir şirketin sunucusuna bağlamak. Belki boş döner. Belki bir adamın sabahını geri getirir.
`),
      good: 'Mazereti bağımsız bir kayda bağlamak doğru talep; özel şirket kaydı mahkeme yazısıyla istenir (CMK 177, 332).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_RANDEVU', 'Tapu randevu kaydı ve teyit araması (ALO 181)', {
      visibleWhen: flag('fact_randevu_tel'),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 60 },
      effects: [raise('dil_randevu'), raise('dil_any')],
      good: 'Randevuyu alan numara, işlemi yaptıran kişinin izini taşır; kamu kurumundan mahkeme yazısıyla istenir (CMK 177, 332).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_TUTANAK', 'Mukayese belgelerinin asıl teslim tutanağı', {
      visibleWhen: has('clue_tutanak_ad'),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 50 },
      effects: [raise('dil_tutanak'), raise('dil_any')],
      responses: B(`
T: Üçüncü talep: mukayese belgelerinin kolluğa teslim tutanağının aslı. Faksta okunmayan bir ad; aslında okunur.
T: Bilirkişiye giden kâğıtları kim seçti? Bu sorunun cevabı bir tutanağın en alt satırında duruyor.
`),
      good: 'Mukayese belgelerinin kaynağı, raporun güvenilirliğini belirler; asıl tutanak istenir (CMK 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_HTS', 'Nermin Kurt’un telefon kayıtları', {
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: -40 },
      effects: [raise('dil_any')],
      bad: 'Somut bir şüphe olmadan şikâyetçinin iletişim kayıtlarını istemek ölçüsüzdür; mahkeme reddeder (CMK 135 eşiği). Bir talep hakkı boşa gitti.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_HAYRIYE', 'Hayriye Ateş’in tanık olarak dinlenmesi', {
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: -40 },
      effects: [raise('dil_any')],
      bad: 'Orta evre Alzheimer’lı ve vasi altındaki mağdurun beyanı ispat değeri taşımaz; onu kürsüye çağırmak yalnızca onu yorar.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_BANKA', 'Erol Kılınç’ın banka hesap hareketleri', {
      cost: slotCost,
      maxUses: 1,
      effects: [raise('dil_any')],
      neutral: 'Bedel “nakden” ödenmiş görünüyor; banka kaydı büyük olasılıkla boş döner. Talep yerinde ama verimsiz.',
      next: '$stay',
    }),
    cont('DIL_VER', 'Dilekçeyi ver', '$return', {
      role: 'PRIMARY',
      effects: [raise('dil_verildi')],
      enabledWhen: flag('dil_any'),
    }),
    back('DIL_GERI', 'Sonra yazarım'),
  ],
});

// --- Tahta ---

export const POOL1 = [
  'clue_tel_liste',
  'clue_yazici',
  'clue_takvim',
  'clue_makas',
  'clue_kase',
  'clue_aski',
  'clue_doblo',
  'clue_bos_dosya',
  'clue_ruhsat',
  'clue_aile_foto',
  'clue_sivanma',
  'clue_senet_saat',
  'clue_foto_kapali',
  'clue_toner_muhur',
  'clue_kagit',
  'clue_ekli_satir',
  'clue_noter_arsiv',
  'clue_mukayese_ozel',
  'clue_tutanak_ad',
  'clue_iki_el',
  'clue_sag_el',
  'clue_ceket',
  'clue_mesaj',
];

export const invRecipes = (p: string): ChoiceDef[] => [
  recipe(`${p}_SOLAK`, 'clue_sivanma', 'clue_sag_el', {
    effects: firstTime('ded_solak'),
    feedback: newDed(
      'Solak imza, sağlak sanık',
      'Sağa sıvanmış mürekkep sol eli gösteriyor; Vedat sağ eliyle yazıyor.',
    ),
    responses: B(`
T: Senedi imzalayan el, mürekkebin üstünden geçmiş. Vedat’ın eli geçmez; o, yazdığını arkasında bırakır.
`),
  }),
  recipe(`${p}_SURET`, 'clue_toner_muhur', 'clue_noter_arsiv', {
    effects: firstTime('ded_suret_sahte'),
    feedback: newDed('Asıldan kopyalanmış sahte suret', 'Noterin asıl nüshasında satış yok; suretteki mühür basılmış.'),
    responses: B(`
T: Gerçek bir vekâletname, gerçek bir yevmiye numarası, ve araya sıkıştırılmış bir cümle. Sistem numaraya baktı; cümleye kimse bakmadı.
`),
  }),
  recipe(`${p}_SURET2`, 'clue_ekli_satir', 'clue_noter_arsiv', {
    effects: firstTime('ded_suret_sahte'),
    feedback: newDed(
      'Asıldan kopyalanmış sahte suret',
      'Asıl nüshada olmayan satış satırı, surette başka bir yazı tipiyle araya sıkıştırılmış.',
    ),
  }),
  recipe(`${p}_MUKAYESE`, 'clue_mukayese_ozel', 'clue_iki_el', {
    effects: firstTime('ded_mukayese'),
    feedback: newDed(
      'Kirli mukayese malzemesi',
      'Bilirkişinin “Vedat’ın imzası” saydığı kâğıtları iki ayrı el imzalamış.',
    ),
    responses: B(`
T: Rapor yanlış değil. Rapor başka bir soruya doğru cevap vermiş: senetteki imzayı atan el, irsaliyelerin çoğunu da atmış. O el kimin?
`),
  }),
  recipe(`${p}_KIMLIK`, 'clue_ceket', 'clue_mesaj', {
    effects: firstTime('ded_kimlik'),
    feedback: newDed(
      'O sabah kayıp kimlik',
      '09.52’de kimlik kayıp; 11.22’de tapuda kullanılıyor; ertesi sabah aynı cepte.',
    ),
    responses: B(`
T: Bir kimlik bir gece cepten çıktı ve bir gece cebe döndü. Arada bir adam onunla bir ev sattı.
`),
  }),
  recipe(`${p}_KURYE`, 'clue_takvim', 'clue_senet_saat', {
    effects: firstTime('ded_kurye', 200),
    feedback: {
      title: 'Kurye çakışması',
      text: 'Kurye 11.30’da matbaaya gelecekti; senet 11.24’te imzalandı. Kayıt bulunursa bir mazeret.',
      label: 'YENİ DELİL · +200 SKOR',
      tone: 'success',
    },
  }),
  recipe(`${p}_BASKI`, 'clue_yazici', 'clue_toner_muhur', {
    effects: firstTime('ded_baski', 200),
    feedback: {
      title: 'Gece basılan suret',
      text: 'Basılmış mühür, 6 Şubat 02.14’teki iki sayfalık renkli işle örtüşüyor. Suret bu dükkânda basıldı.',
      label: 'YENİ DELİL · +200 SKOR',
      tone: 'success',
    },
    responses: B(`
T: Suret bu dükkânda basıldı. Savcı bunu duysa sevinirdi: bir matbaacı, bir matbaa, bir sahte suret. Ama gece ikide burada kim vardı?
`),
  }),
  recipe(`${p}_BASKI2`, 'clue_yazici', 'clue_kagit', {
    effects: firstTime('ded_baski', 200),
    feedback: {
      title: 'Gece basılan suret',
      text: '90 gramlık sıradan kâğıt ve gece 02.14’te 90 grama basılmış iki sayfa. Suret bu dükkânda basıldı.',
      label: 'YENİ DELİL · +200 SKOR',
      tone: 'success',
    },
  }),
];

export const invDecoys = (p: string): ChoiceDef[] => [
  wrongPair(
    `${p}_X_DOBLO`,
    'clue_doblo',
    'clue_aski',
    'Beyaz bir araç ve bir askı. Dükkândaki herkes ikisine de yakın. Hiçbir şeyi ayırmıyor.',
  ),
  wrongPair(
    `${p}_X_KASE`,
    'clue_kase',
    'clue_toner_muhur',
    'Polimer kaşe ıslak mürekkep basar; suretteki mühür toner. Makine burada masum.',
  ),
  wrongPair(
    `${p}_X_RUHSAT`,
    'clue_ruhsat',
    'clue_senet_saat',
    'Alıcının aceleciliği bir sahtecilik delili değil; sadece acelecilik.',
  ),
  wrongPair(
    `${p}_X_AILE`,
    'clue_aile_foto',
    'clue_bos_dosya',
    'Bir aile ve boş bir dosya. Duygusal bir çift; mahkemede bir şey söylemez.',
  ),
];

const cikarim = deductionBoard('INV_CIKARIM', {
  ...INV,
  title: 'Çıkarım tahtası',
  background: 'buro_gece',
  lines: B(`
N: İki ipucunu seç. Birbirini tamamlıyorsa duruşmada kullanabileceğin bir delil doğar.
T: Pano, raptiyeler, kırmızı ip. Leyla bununla dalga geçer. Sonra gelip uzun uzun bakar.
`),
  pool: POOL1,
  recipes: [...invRecipes('CB'), ...invDecoys('CB')],
  miss: fallback('FB_CIKARIM', 'COMBINE', {
    repeat: 'ONCE_PER_PARAMS',
    score: { DELIL_ANALIZI: -50 },
    feedback: {
      title: 'Bu ikisi birbirini açıklamıyor',
      text: 'Başka bir ipucu dene.',
      label: 'BAĞLANTI YOK · −50 SKOR',
      tone: 'error',
    },
  }),
  finish: { id: 'CIKARIM_BITIR' },
});

// --- Leyla ---

const leyla = story('INV_LEYLA', {
  ...INV,
  title: 'Leyla’ya danış',
  background: 'buro',
  lines: [
    W(
      all(cmp(v('day'), '==', 1), not(has('clue_sivanma'))),
      `
C#buro: ARSLAN HUKUK — LEYLA’NIN ODASI
leyla: Senedi okudun mu? Okumak değil; baktın mı? Bir imza bir resimdir Deniz. Resmin bir de nasıl çizildiği vardır.
leyla: Islak mürekkep, kalemin gidişini saklamaz. Hız, basınç, hangi yöne sürüklendiği. Büyüteç al, mürekkebe bak; harflere değil.
leyla: Bir de müvekkilinin elini izle. Kalemi nasıl tuttuğunu. İnsanlar kendi ellerine bakmazlar; avukatlar bakmalı.
T: Mürekkebe bak, harflere değil. Leyla’nın cümleleri iki kere okunur; ikincisinde anlaşılır.
`,
    ),
    W(
      cmp(v('day'), '==', 1),
      `
C#buro: ARSLAN HUKUK — LEYLA’NIN ODASI
leyla: Bir şey buldun. Sevinme. Bir imzanın atan eli göstermesi, bir hâkimi ikna etmeye yetmez; hâkim bilirkişiye inanır.
leyla: Bilirkişiyi çürütmek istiyorsan bilirkişiyle kavga etme. Ona yanlış kâğıtlar verildiğini göster. Raporun eklerine bak.
leyla: Bir de kimlik. Bir kimlik kendiliğinden yürümez. Kimliğin nerede durduğunu ve kimin o kadar yakınında olduğunu düşün.
`,
    ),
    W(
      all(cmp(v('day'), '==', 2), not(has('clue_noter_arsiv'))),
      `
C#buro: ARSLAN HUKUK — LEYLA’NIN ODASI
leyla: Suret. Noter sureti resmî belgedir; aslı noterin arşivinde durur. Sen suretle tartışma; aslıyla karşılaştır.
leyla: Vekil olarak müvekkilin o işlemin tarafı. Avukatı olarak sen de arşivi görebilirsin. Noterin başkâtipleri usulü sever; usulle git.
leyla: Bir de kâğıdın kendisi. Noter suretleri sıradan kâğıda basılmaz. Işık tut, bak.
`,
    ),
    W(
      cmp(v('day'), '==', 2),
      `
C#buro: ARSLAN HUKUK — LEYLA’NIN ODASI
leyla: Asıl nüsha bir şey söylüyor, suret başka bir şey. Güzel. Şimdi sor: bu suret nerede basıldı?
leyla: Dikkatli ol. Bir matbaacının dosyasında “sahte belge bir yazıcıdan çıktı” demek, savcıya hediye vermektir. Yazıcı kimin, gece kim oradaydı? Bilmeden kürsüye götürme.
leyla: Ve sakın birini suçlamak için acele etme. Bir şüphe, bir isim olmadan da bir müvekkili kurtarabilir.
`,
    ),
    W(
      cmp(v('day'), '==', 3),
      `
C#buro: ARSLAN HUKUK — LEYLA’NIN ODASI
leyla: Bilirkişi raporu. CMK 67: taraflar rapora karşı görüş bildirebilir, yeni bilirkişi isteyebilir. 63: hâkim gerekli görürse bilirkişi atar.
leyla: Ama mahkeme “neden yeni rapor” der. Cevabın kâğıtta olmalı: mukayese imzaları tartışmasız değil. Kimin attığı belli olan imzalar ister; noterde, bankada, nüfusta.
leyla: Bir de şu: o kâğıtları kolluğa kim verdi? Bir belgenin kaynağı, belgenin kendisi kadar önemlidir. Bazen daha da önemli.
`,
    ),
    O(`
C#buro: ARSLAN HUKUK — LEYLA’NIN ODASI
leyla: Dilekçe günü. Duruşmadan önce ver; hâkim celseye hazırlıklı gelsin. Taleplerini sırala: önce bilirkişi, sonra kayıtlar.
leyla: İlk celsede tapu memuru dinlenecek. Kadın yalan söylemeyecek; günde altmış işlem yapıyor, hatırladığını sanıyor. Onu yenmeye çalışma.
leyla: Ona ne gördüğünü sor. Ne görmüş olması gerektiğini değil. Kimse bir memura “kalemi hangi eliyle tuttu” diye sormamış. Sen sor.
`),
  ],
  choices: [back('LEYLA_DON', 'Teşekkür et')],
});

// --- Gün sonları ---

const dayEnd = decisionNode(
  'INV_DAY_END',
  [
    { when: cmp(v('day'), '==', 2), to: 'INV_AKSAM1' },
    { when: all(cmp(v('day'), '==', 3), flag('fact_erol_ziyaret')), to: 'INV_AKSAM2E' },
    { when: cmp(v('day'), '==', 3), to: 'INV_AKSAM2S' },
    { to: 'INV_AKSAM3' },
  ],
  {
    ...INV,
    title: 'Gün sonu',
    onEnter: [inc('day', 1), set('ap', 3)],
  },
);

const aksam1 = story('INV_AKSAM1', {
  ...INV,
  title: 'Akşam',
  background: 'buro_gece',
  lines: B(`
C#buro_gece: GECE 22.10 — ARSLAN HUKUK
N: Büroda Leyla’yla ikimiz kaldık. Yağmur camda. Leyla gözlüğünü çıkardı, burnunun kemerini ovuşturdu.
leyla: Bugün bir imzanın peşindeydin. Sana bir soru: bir insanı imzasında ne tanımlar?
T: Leyla’nın akşam soruları bir sınav değil; günün özeti. Ne cevap verirsem, yarın o cevabın içinde yürüyeceğim.
N: Çaycı çoktan gitmişti. Leyla kendi çayını kendisi demledi, iki bardak koydu, birini bana uzattı. Ellerim soğuktu; bardak sıcaktı.
`),
  choices: [
    option('AK1_EL', '“Eli. Kalemi tutan el.”', {
      effects: [set('aksam1', 'EL')],
      responses: B(`
leyla: Güzel. El, insanın kâğıda bıraktığı en dürüst iz. Bir adı herkes yazabilir; bir eli kimse taklit edemez. Edenler de yakalanır, er geç.
leyla: Ama eli bulmak, sahibini bulmak değildir. Bunu da unutma.
`),
      next: 'INV_HUB',
    }),
    option('AK1_AD', '“Adı. Yazdığı şey.”', {
      effects: [set('aksam1', 'AD')],
      responses: B(`
leyla: Ad bir etikettir Deniz. Tapu memuru da ada baktı; kimliğe, ada, numaraya. Sonuç ortada.
leyla: Bu dosyada ad yalan söylemiyor. Ad doğru. Yalan, adın altındaki çizgide.
T: Ad doğru. Çizgi yalan. Bunu bir yere yazdım.
`),
      next: 'INV_HUB',
    }),
    option('AK1_HIC', '“Hiçbir şey. İmza bir formalite.”', {
      effects: [set('aksam1', 'HIC')],
      responses: B(`
leyla: Formalite. Bir kadın evini bir formaliteyle kaybetti. Bir adam bir formaliteyle sanık oldu.
leyla: Formaliteleri hafife alan avukat, en çok formalitelerle kaybeder.
N: Leyla kapıdan çıkarken ışığı kapattı. Kasıtlı mı bilmiyorum.
`),
      next: 'INV_HUB',
    }),
  ],
});

const aksam2E = story('INV_AKSAM2E', {
  ...INV,
  title: 'Gizli numara',
  background: 'sokak_yagmur',
  lines: B(`
C#sokak_yagmur: GECE 23.05 — ALTIPARMAK, EVİN ÖNÜ
N: Arabadan inmiştim ki telefon çaldı. Gizli numara. Açtım. Bir süre yalnızca nefes sesi, arkada bir televizyon.
?BİR_SES@phone: Avukat hanım. Bazı evler satılınca satılmış kalır. Bazı dosyalar da kapanınca kapanmış.
?BİR_SES@phone: Herkesin kendi soğuğu var demiştim, değil mi? Atkınızı unutmayın.
N!shake: Hat kapandı. Yağmur şemsiyemin kenarından boynuma aktı.
T: “Herkesin kendi soğuğu var.” Bu cümleyi bugün birinden duymuştum. Cilalı ayakkabılı birinden.
`),
  choices: [
    option('AK2_BILDIR', 'Sabah savcılığa git; tutanakla bildir', {
      score: { SAVUNMA_STRATEJISI: 50 },
      effects: [raise('tehdit_bildirildi')],
      good: 'Tehdidi kayda geçirmek doğru: kendi başına araştırmak yerine savcılığa bildirdin (TCK 106; CMK 158).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
N: Sabah dokuzda adliyedeydim. Nöbetçi savcı dinledi, not aldı, “numarayı tespit ederiz” dedi. Etmeyeceklerdi belki. Ama kayıt vardı.
T: Bir avukat korkusunu kâğıda yazar. Kâğıt korkmaz.
`),
      next: 'INV_HUB',
    }),
    option('AK2_EROL', 'Erol’u hemen ara; tehdidin hesabını sor', {
      score: { SAVUNMA_STRATEJISI: -30 },
      effects: [dec('trust', 5)],
      bad: 'Şüphelendiğin kişiyi arayıp hesap sormak hem riskli hem verimsiz; tehdidi savcılığa bildirmek gerekirdi.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
erol@phone: Avukat hanım? Bu saatte? Telefon mu? Ne telefonu? Ben yatmıştım. Siz de yatın, yağmur var.
N: Gülerek kapattı. Sesi bir şey kanıtlamadı; benim sesim ise ona çok şey anlattı.
`),
      next: 'INV_HUB',
    }),
    option('AK2_UNUT', 'Bir şaka say ve unut; yarın uzun gün', {
      responses: B(`
T: Bir telefon. Bir ses. Bir atkı. Belki bir şaka. Belki değil. Uyumadım.
`),
      next: 'INV_HUB',
    }),
  ],
});

const aksam2S = story('INV_AKSAM2S', {
  ...INV,
  title: 'Sevgi’nin telefonu',
  background: 'buro_gece',
  lines: B(`
C#buro_gece: GECE 22.40 — ARSLAN HUKUK
sevgi@phone: Deniz Hanım, rahatsız ediyorum. Vedat uyuyamıyor. Gece kalkıp mutfakta imza atıyor; bir kâğıda, yüz kere. Kendi imzasını tanımaya çalışıyor sanki.
sevgi@phone: Bir şey daha… Yok. Yok, boş verin. Aile işleri. Sonra anlatırım belki.
T: “Sonra anlatırım belki.” Bir öğretmen her şeyi madde madde anlatır. Bu madde listede yoktu.
sevgi@phone: Bugün matbaaya gitmişsiniz. Tarık söyledi; “avukat hanım her yere baktı” dedi. İyi. Her yere bakın.
`),
  choices: [
    option('AK2S_DINLE', '“Ne zaman isterseniz. Ben buradayım.”', {
      effects: [raise('sevgi_kapi')],
      responses: B(`
sevgi@phone: Sağ olun. Bazen bir şeyi söylemek, onu gerçek yapıyor. Henüz gerçek olmasını istemiyorum.
`),
      next: 'INV_HUB',
    }),
    option('AK2S_ISRAR', '“Şimdi söyleyin. Önemli olabilir.”', {
      effects: [dec('trust', 5)],
      responses: B(`
sevgi@phone: Hayır. Hayır, şimdi değil. İyi geceler.
N: Telefon kapandı. Biraz fazla hızlı.
`),
      next: 'INV_HUB',
    }),
  ],
});

const aksam3 = story('INV_AKSAM3', {
  ...INV,
  title: 'Börek',
  background: 'buro_gece',
  lines: B(`
C#buro_gece: GECE 21.30 — ARSLAN HUKUK
N: Zil çaldı. Kapıda Tarık; elinde bir tepsi börek, üstü alüminyum folyo. Saçları ıslak.
tarik: Avukat hanım, rahatsız etmiyorum. Yengem gönderdi. Kayhan Böreği; sıcak. Amcam “avukat hanım aç kalmasın” dedi.
N: Tepsiyi masaya bıraktı, paltosundaki yağmuru kapının önünde silkeledi. Saçından damlayan su folyonun üstünde boncuklandı.
tarik: Nasıl gidiyor? Duruşma ne zaman, tam? Amcam uyuyamıyor; yengem de. Dükkân benim de evim sayılır; ben de bilmek istiyorum.
T: Sıcak bir börek, ıslak saçlar ve bir soru. Bu dosyanın sırrı benim değil; müvekkilimin.
tarik: Bir şey lazımsa söyleyin. Yengem “avukat hanıma ne lazımsa götür” dedi. Ben getiririm.
`),
  choices: [
    option('AK3_SAKLA', '“Sağ ol Tarık. Dosyayı yalnızca Vedat Bey’le konuşurum.”', {
      score: { SAVUNMA_STRATEJISI: 50 },
      good: 'Avukat, müvekkilinin sırlarını üçüncü kişilere —aileden de olsa— açamaz (Av.K. 36). Doğru tutum.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
tarik: Haklısınız. Tabii. Yengem de öyle der; “avukatın işine karışılmaz.” Afiyet olsun.
N: Kapıyı arkasından çekti. Merdivenlerde adımları; sonra sokakta bir motorun öksürüğü.
T: Bir börek, bir aile, bir kapı. Bu ailede herkes yardım etmek istiyor. Yardımın da bir ağırlığı var; bazen bir dosyadan ağır.
`),
      next: 'INV_HUB',
    }),
    option('AK3_ANLAT', '“Otur Tarık. Anlatayım; belki dükkânda bir şey hatırlarsın.”', {
      score: { SAVUNMA_STRATEJISI: -80 },
      effects: [inc('ethics'), raise('tarik_sir')],
      bad: 'Dosyanın ayrıntılarını müvekkilin izni olmadan üçüncü bir kişiye anlattın: sır saklama yükümlülüğünün ihlali (Av.K. 36). Üstelik o kişinin dosyadaki yerini bilmiyordun.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
N: Anlattım. İmzayı, mürekkebi, raporu, irsaliyeleri. Tarık dinledi; çok iyi dinledi. Arada bir “hı” dedi, bir kere “vay” dedi.
tarik: Demek mürekkebe bakıyorsunuz. Hiç aklıma gelmezdi. Siz çok iyi avukatsınız.
N: Gitti. Börek soğudu. Ben tepsinin başında, ne kadar çok şey anlattığımı fark ederek oturdum.
T: Bir avukatın en tehlikeli hâli, dinlendiğini sandığı andır.
`),
      next: 'INV_HUB',
    }),
  ],
});

// --- Duruşmadan önceki gece ---

const gece = [
  decisionNode('INV_GECE_1', [{ to: 'INV_GECE_2' }], {
    ...INV,
    title: 'Duruşmadan önceki gece',
    lines: B(`
C#buro_gece: 13 EKİM · 23.10 — ARSLAN HUKUK
N: Panoyu son kez toparladım. Raptiyeler, ipler, bir yığın fotokopi. Bir davanın iskeleti.
N: Cübbem kapının arkasında asılıydı; kuru temizlemeden yeni gelmiş, naylonu üstünde. Naylonu çıkarmadım. Sabah çıkarırım; o zamana kadar dava bir kâğıt kalsın.
N: Aşağıda bir çöp kamyonu caddeyi tarıyordu. Şoför camı indirmiş, radyoda gece yarısı haberleri: yağış yarın da sürecek; Uludağ’a ilk kar.
T: İlk celse. Bir tanık, bir rapor, bir savcı. Ve benim sorularım; bir memurun beş aydır kimseye anlatmadığı bir ânı açabilecek kadar doğru olmaları gerekiyor.
`),
  }),
  decisionNode('INV_GECE_2', [{ to: 'INV_GECE_3' }], {
    lines: [
      W(
        has('ded_solak'),
        `T: Bir mürekkep izi ve bir sağ el. Senedi imzalayan el, Vedat’ın eli değil. Bunu yarın bir memura sormam gerekiyor.`,
      ),
      W(
        has('clue_sivanma'),
        `T: Mürekkep sağa sıvanmış. Vedat’ın hangi elle yazdığını hâlâ sormadım. Yarın soracaklar.`,
      ),
      O(`T: Senedin imzasına hâlâ yalnızca bir ad gibi bakıyorum. Bir şeyi kaçırdım mı?`),
    ],
  }),
  decisionNode('INV_GECE_3', [{ to: 'INV_GECE_4' }], {
    lines: [
      W(
        has('ded_mukayese'),
        `T: Bilirkişi doğru bir cevap vermiş, yanlış bir soruya. Yirmi kâğıt, iki el. Raporun ekleri raporun kendisinden daha çok konuşuyor.`,
      ),
      W(
        has('clue_mukayese_ozel'),
        `T: Mukayese belgelerinin hepsi özel belge. Kimin attığı belli değil. Kim attı? Henüz bilmiyorum.`,
      ),
      W(
        flag('fact_baskasi_imza'),
        `T: “Herkes imzalar o kâğıtları.” Vedat bunu öfkeyle söyledi. Öfke bazen bir delilin adresini verir.`,
      ),
      O(`T: “Aynı elin ürünü.” Rapordaki o cümle hâlâ kalın harflerle duruyor. Onu inceltecek bir şey bulamadım.`),
    ],
  }),
  decisionNode('INV_GECE_4', [{ to: 'INV_GECE_5' }], {
    lines: [
      W(
        has('ded_suret_sahte'),
        `T: Gerçek bir numara, sahte bir cümle. Suret, noterin arşivine yalan söylüyor. Bunu bir noter mührü söylüyor; ben değil.`,
      ),
      W(
        has('clue_toner_muhur'),
        `T: Suretteki mühür basılmış. Basılmış bir mühür neyin kopyası? Asıl nüshayı görmedim.`,
      ),
      W(
        flag('fact_nermin_yetki'),
        `T: Nermin oradaydı: “Satış yoktu.” Bir kız kardeşin hafızası. Bunu bir noter mührüyle karşılaştırmadım.`,
      ),
      O(`T: Suret. Herkes onu sahte diyor; kimse nasıl sahte olduğunu göstermiyor. Ben de.`),
    ],
  }),
  decisionNode('INV_GECE_5', [{ to: 'INV_GECE_6' }], {
    lines: [
      W(
        flag('hayriye_imza'),
        `T: Hayriye Hanım’ın kalemi tuttuğu an. “Ben imzamı kimseye vermem.” Yırttığım kâğıt hâlâ çöp kutusunda.`,
      ),
      W(flag('tarik_sir'), `T: Bir tepsi börek. Her şeyi anlattım. Tarık iyi dinledi. Neden içim rahat değil?`),
      W(flag('nermin_baski'), `T: Nermin Hanım’ın eczanesinin kapısı. Yarın koridorda bana nasıl bakacak?`),
      W(cmp(v('aksam1'), '==', 'AD'), `T: Ad doğru, çizgi yalan. Leyla’nın cümlesi panonun ortasında asılı gibi.`),
      O(
        `T: Leyla’nın sorusu aklımda: bir insanı ne tanımlar? Yarın bir kürsüde bunu biri bana soracak, başka kelimelerle.`,
      ),
    ],
  }),
];

const gece6 = decisionNode('INV_GECE_6', [{ to: 'INV_GECE' }], {
  lines: B(`
N: Telefon çaldı. Vedat. Sesi uykusuz, arkada bir makinenin tıkırtısı.
vedat@phone: Avukat hanım, rahatsız ediyorum. Dükkândayım. Uyuyamadım, makineyi çalıştırdım. Yarın ne giyeyim? Takım mı, önlük mü? Şaka yapıyorum.
vedat@phone: Babam derdi ki, mahkemeye temiz gömlekle gidilir, temiz vicdanla dönülür. Gömleğim temiz. Vicdanım da. Arası nasıl olacak, bilmiyorum.
P: Arası bizim işimiz Vedat Bey. Siz yarın doğruyu söyleyin. Bilmediğinizi bilmiyorum deyin.
vedat@phone: Bilmediğim çok şey var. En çok da o imzayı kimin attığını bilmiyorum. Bunu da söyleyeyim mi?
P: Onu da söyleyin.
N: Bir süre sessizlik; sonra makinenin tıkırtısı. Vedat telefonu kapatmadan önce bir şey mırıldandı; duyamadım. Belki bir dua, belki bir harf dizisi.
`),
});

const geceSon = story('INV_GECE', {
  ...INV,
  title: 'Duruşmadan önceki gece',
  background: 'sokak_yagmur',
  lines: B(`
N: Telefon titredi. Leyla’dan tek bir mesaj, gece yarısına beş kala.
leyla@phone: Yarın tanık ne hatırlıyorsa onu sor. Ne hatırlamasını istediğini değil.
N: Pencereyi açtım. Yağmur Kayhan’ın damlarına, Hisar’ın cumbalarına, Çekirge’deki bir huzurevinin penceresine, hepsine aynı anda yağıyordu.
N!flash: Bir şimşek. Bir an bütün şehir bir fotokopi gibi beyazladı.
T: Bir imza. Bir el. Yarın sabah dokuzda biri bana soracak: “Müdafi, diyeceğiniz?”
N: Masamda Sevgi’nin bıraktığı kartvizit duruyordu. Köşesi mürekkepten mosmor. ATEŞ MATBAASI · 1971. Altında küçük harflerle: “Her harf doğrudur.”
T: Her harf doğru. Yarın bir harfin yanlış elden çıktığını kanıtlamaya çalışacağım.
`),
  choices: [cont('GECE_DEVAM', 'Adliyeye git', 'C1_00G', { role: 'PRIMARY' })],
});

export const investigation1: CasePart = {
  nodes: [
    p1.hub({
      ...INV,
      title: 'Soruşturma',
      background: 'buro',
      lines: hubLines,
      scenePreview: { scene: 'sc_matbaa' },
      tabs: [
        { id: 't_olay', label: 'OLAY YERİ', kind: 'SCENE', choices: hubChoices.olay },
        { id: 't_kisi', label: 'KİŞİLER', kind: 'PEOPLE', choices: hubChoices.kisiler },
        { id: 't_arsiv', label: 'ARŞİV', kind: 'ARCHIVE', choices: hubChoices.arsiv },
      ],
      quickTalk: {
        character: 'vedat',
        line: '“Ben o gün dükkândaydım avukat hanım. Kâğıt bunu bilir; kâğıda sorun.”',
        choices: ['H_VEDAT', 'H_VEDAT2'],
      },
      choices: [
        nav('H_DURUSMA', 'DURUŞMAYA GİT · 1. CELSE', 'INV_GECE_1', {
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen soruşturma biter. Emin misin?',
        }),
      ],
    }),
    dayEnd,
    aksam1,
    aksam2E,
    aksam2S,
    aksam3,
    aramaM,
    aramaH,
    ...vedatNodes,
    ...peopleNodes,
    ...docNodes,
    dil,
    cikarim,
    leyla,
    ...gece,
    gece6,
    geceSon,
  ],
  triggers: [
    {
      id: 'tg_day_end',
      scope: 'INV_HUB',
      priority: 1,
      when: all(cmp(v('ap'), '<=', 0), cmp(v('day'), '<', 4)),
      goto: 'INV_DAY_END',
    },
  ],
};
