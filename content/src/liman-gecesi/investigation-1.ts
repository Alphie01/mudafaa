import {
  all,
  any,
  back,
  cmp,
  conversation,
  cont,
  costOf,
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
  interview,
  meet,
  mood,
  nav,
  not,
  option,
  raise,
  recipe,
  ref,
  row,
  sceneSearch,
  score,
  set,
  story,
  tool,
  topic,
  v,
  visited,
  chosen,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef, Cond, Effect } from '../../../tools/content/src/kit/index.js';
import { B, O, T, W } from './dsl.js';
import { INV, p1 } from './shared.js';

// 50-investigation: 4 gün × 3 EP. Olay yeri fotoğrafları (rıhtım, B sahası), iskele büfesi (Nail Usta + arama),
// cezaevi görüşmesi, Gülay (etik tuzak), Şükrü Usta, vardiya şefi, emekli adli tıpçı; arşiv: ön rapor, telefon
// tutanağı, turnike dökümü (dilekçeyle), delil dilekçesi, çıkarım tahtası, Leyla.

const dayDeliveries = deliver('INV_DAY_END', [
  {
    evidence: 'ev_turnike',
    requires: flag('dil_turnike'),
    hint: 'Turnike ve araç kapısı kayıtlarını dilekçeyle iste (CMK 177).',
  },
  { evidence: 'ev_kantin', requires: flag('dil_kantin'), hint: 'Kantinin kart okuyucu kaydını dilekçeyle iste.' },
]);
const nightDeliveries = deliver('INV_GECE_1', [
  {
    evidence: 'ev_turnike',
    requires: flag('dil_turnike'),
    hint: 'Turnike ve araç kapısı kayıtlarını dilekçeyle iste (CMK 177).',
  },
  { evidence: 'ev_kantin', requires: flag('dil_kantin'), hint: 'Kantinin kart okuyucu kaydını dilekçeyle iste.' },
]);

/** Tahtada bir çıkarımı yalnızca ilk kurulumda ödüllendirir (alternatif tarifler ve ara tahtası için). */
export const firstTime = (ded: string, amount = 300): Effect[] => [
  ifThen(not(has(ded)), [discover(ded), score('DELIL_ANALIZI', amount)]),
];

const feedbackNew = (title: string, text: string, label = 'YENİ DELİL · +300 SKOR') => ({
  title,
  text,
  label,
  tone: 'success' as const,
});

/** Soruşturma tarifleri; ara tahtasında da aynı kimlik önekleriyle (ön ek `pre`) yeniden kullanılır. */
export function invRecipes(pre: string): ChoiceDef[] {
  return [
    recipe(`${pre}_CIKIS`, 'clue_cikis', 'clue_pos', {
      effects: firstTime('ded_cikis'),
      feedback: feedbackNew(
        'Tarık geri dönmedi',
        '23.18’de turnikeden çıktı, 23.37’de iskele büfesinde kartla ödedi. Vardiya şefinin 23.40’taki “B sahasının ağzı” ile arada yirmi dakikalık yol var.',
      ),
    }),
    recipe(`${pre}_BUF`, 'clue_nail', 'clue_radyo', {
      effects: firstTime('ded_buf'),
      feedback: feedbackNew(
        'Gece yarısına kadar iskelede',
        'Nail Usta onu ağlarken gördü; gece haberleri başladığında hâlâ taburedeydi. 23.37’den 00.00’a kadar iskele.',
      ),
    }),
    recipe(`${pre}_ISIK`, 'clue_kenan_isik', 'clue_projektor', {
      effects: firstTime('ded_isik'),
      feedback: feedbackNew(
        'Projektörler sönüktü',
        '“Gündüz gibiydi” diyor. Etikete göre B sahasının projektörleri 23.00–02.00 bakımdaydı. Gece, sisli, ışıksız bir sahada yirmi metreden yüz.',
      ),
    }),
    recipe(`${pre}_KAN`, 'clue_baba_kan', 'clue_basit', {
      effects: firstTime('ded_kan'),
      feedback: feedbackNew(
        'Yumruk başı vurdurmadı',
        'Kan babanın gövdesinde, oturma hizasında; rapor burun ve dudağı basit tıbbi müdahalelik sayıyor. Baş babaya çarpmadı; burun kanadı.',
      ),
    }),
    recipe(`${pre}_DARBE`, 'clue_desen', 'clue_kontrkup', {
      effects: firstTime('ded_darbe'),
      feedback: feedbackNew(
        'Düşme değil, darbe',
        'Küçük, dairesel, keskin kenarlı bir çökme ve karşı tarafta hiçbir şey. Hareket eden baş değil, hareket eden cisim.',
      ),
    }),
    recipe(`${pre}_SAAT`, 'clue_mide', 'clue_kantin', {
      effects: firstTime('ded_saat'),
      feedback: feedbackNew(
        'Ölüm 23.34’ten sonra',
        'Midede yarı sindirilmiş ekmek, peynir ve süt ürünü. Kantinde 23.34’te tost ve ayran. Ercan yedikten sonra öldü; yemek henüz midesindeydi.',
      ),
    }),
    recipe(`${pre}_CANLI`, 'clue_arama2341', 'clue_cikis', {
      effects: firstTime('ded_canli'),
      feedback: feedbackNew(
        '23.41’de yaşıyordu',
        'Tarık 23.18’de limandan çıktı. Ercan 23.41’de iki dakika yedi saniye telefonda konuştu. Kimle?',
      ),
    }),
    recipe(`${pre}_TASIMA`, 'clue_surukleme', 'clue_lastik', {
      effects: firstTime('ded_tasima'),
      feedback: feedbackNew(
        'Araçla gelen biri onu taşıdı',
        'Topuk izleri bir kamyonetin dönüş izinin hemen yanında başlıyor. Ercan oraya yürümedi.',
      ),
    }),
    recipe(`${pre}_TASIMA2`, 'clue_kan_yolu', 'clue_lastik', {
      effects: firstTime('ded_tasima'),
      feedback: feedbackNew(
        'Araçla gelen biri onu taşıdı',
        'Rıhtımdan B sahasına tek damla kan yok; B sahasında taze bir kamyonet izi. Ercan oraya yürümedi.',
      ),
    }),
  ];
}

export const INV_POOL = [
  'clue_baba_kan',
  'clue_basit',
  'clue_projektor',
  'clue_kenan_isik',
  'clue_desen',
  'clue_kontrkup',
  'clue_mide',
  'clue_kantin',
  'clue_arama2341',
  'clue_cikis',
  'clue_pos',
  'clue_nail',
  'clue_radyo',
  'clue_surukleme',
  'clue_lastik',
  'clue_kan_yolu',
  'clue_matara',
  'clue_kafes',
  'clue_pamuk',
  'clue_servis_arac',
];

// --- Hub ---

const hubChoices = {
  olay: [
    p1.activity('H_RIHTIM', 'Rıhtım fotoğraflarını incele', 'INV_RIHTIM', {
      once: true,
      description: '4 no’lu rıhtım · 41 fotoğraf · büyüteç 5',
    }),
    p1.activity('H_BSAHA', 'B sahası fotoğraflarını incele', 'INV_BSAHA', {
      once: true,
      description: 'Cesedin bulunduğu yer · büyüteç 5',
    }),
    p1.activity('H_BUFE', 'İskele büfesine git', 'INV_BUFE_G', {
      once: true,
      description: 'Mudanya iskelesi · Nail Usta',
      visibleWhen: any(flag('fact_donus'), has('ev_hesap'), flag('fact_saat_0010')),
    }),
  ],
  cezaevi: [
    p1.activity('H_GORUS', 'Tarık’la görüş', 'INV_GORUSME_G', {
      description: 'Görüş salonunun kapanışına 12 dk',
      visibleWhen: not(visited('INV_GORUSME')),
    }),
    p1.activity('H_GORUS2', 'Tarık’la tekrar görüş', 'INV_GORUSME_G', {
      description: 'Görüş salonunun kapanışına 8 dk',
      visibleWhen: visited('INV_GORUSME'),
      maxUses: 1,
    }),
  ],
  insanlar: [
    p1.activity('H_GULAY', 'Gülay’ın evine git', 'INV_GULAY_G', {
      once: true,
      description: 'Güzelyalı · dikiş makinesi',
    }),
    p1.activity('H_SUKRU', 'Şükrü Usta', 'INV_SUKRU', { once: true, description: 'Forklift garajı · görgü tanığı' }),
    p1.activity('H_KENAN', 'Vardiya şefi Kenan Aksoy', 'INV_KENAN', {
      once: true,
      description: 'Liman · prefabrik ofis',
    }),
    p1.activity('H_ORHAN', 'Dr. Orhan Beyaz', 'INV_ORHAN', {
      once: true,
      description: 'Emekli adli tıpçı · Leyla’nın eski dostu',
      visibleWhen: any(visited('INV_ONRAPOR'), visited('INV_LEYLA')),
    }),
  ],
  arsiv: [
    p1.activity('H_ONRAPOR', 'Ön otopsi raporunu incele', 'INV_ONRAPOR', {
      once: true,
      description: 'Dört sayfa, bir dipnot',
    }),
    p1.activity('H_TELEFON', 'Telefon tutanağını incele', 'INV_TELEFON', {
      once: true,
      description: 'Kimsenin okumadığı kâğıt',
    }),
    p1.activity('H_TURNIKE', 'Turnike dökümünü incele', 'INV_TURNIKE', {
      once: true,
      description: 'Liman işletmesinin cevabı geldi',
      visibleWhen: has('ev_turnike'),
    }),
    p1.free('H_IFADE', 'Kolluk ifadelerini yeniden oku', 'INV_IFADE', {
      once: true,
      description: '0 EP · üç ifade, bir daktilo',
    }),
    p1.activity('H_DIL', 'Delil dilekçesi (CMK 177)', 'INV_DIL', { once: true, description: '2 talep hakkı' }),
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
# GÜN 1/4 · BİRİNCİ CELSEYE 14 GÜN
> Hedef: Tarık’ın o gece ne yaptığını ve ne yapmadığını ayır. Yumruk bir şey; ölüm başka bir şey.
~ Panoya üç kâğıt iğneledim. 23.04: yumruk. 23.40: vardiya şefinin gördüğü. 06.10: ceset. Arada boşluklar, boşlukların içinde bir adam.
`,
  ),
  W(
    cmp(v('day'), '==', 2),
    `
# GÜN 2/4 · BİRİNCİ CELSEYE 12 GÜN
> Hedef: Ercan kavgadan sonra ne kadar yaşadı? Kim gördü, ne kanıtlar?
~ Dün gece rüyamda bir turnike gördüm. Dönüyordu, dönüyordu; kimse geçmiyordu. Sabah ilk iş kahve, ikinci iş pano.
`,
  ),
  W(
    cmp(v('day'), '==', 3),
    `
# GÜN 3/4 · BİRİNCİ CELSEYE 10 GÜN
> Hedef: kâğıtlar konuşmaya başladı. Rapor, telefon, kart. Bir de kürsüye çıkacak iki adam.
~ Leyla sabah masama bir not bırakmış: “İnsanlar yanılır. Makineler unutur. Sen ikisini de hatırla.”
`,
  ),
  O(`
# GÜN 4/4 · BİRİNCİ CELSEYE 8 GÜN
> Hedef: son gün. Tahta, dilekçe, eksik kalan ne varsa. Duruşmada kürsüye vardiya şefi ve Şükrü Usta çıkacak.
`),
];

// --- Görüşme ---

const toneEffects = {
  soft: [inc('trust', 4), set('tone', 'soft')],
  hard: [dec('trust', 8), set('tone', 'hard')],
};
const lowTrust: Cond = cmp(v('trust'), '<', 40);
const openTrust: Cond = cmp(v('trust'), '>=', 60);

const gorusmeGiris = decisionNode('INV_GORUSME_G', [{ to: 'INV_GORUSME' }], {
  ...INV,
  title: 'Cezaevi',
  onFirstEnter: [meet('cevdet'), ifThen(flag('deniz_durust'), [inc('trust', 4)])],
  onEnter: [ifThen(visited('INV_GORUSME'), [set('min', 8)])],
  lines: [
    W(
      not(visited('INV_GORUSME')),
      `
# BURSA H TİPİ CEZAEVİ — AVUKAT GÖRÜŞ ODASI [bg:gorus_odasi]
> Üç kapı, iki arama, bir imza. Her kilit arkamdan kapandıkça koridor biraz daha daraldı. Çamaşır suyu ve soğumuş mercimek kokusu.
> İnfaz koruma memuru Cevdet, ellisinde, iri, az konuşan biri. Görüş odasının kapısını açarken bana değil, koridorun sonuna baktı.
cevdet: Bu adam her gece kızının resmine bakıyor. Bir fotoğraf var elinde, buruşmuş. Ondan başka bir şey yapmıyor.
cevdet: Görüş salonu beşte kapanıyor. Camdan bakarım; konuştuğunuzu duymam.
> Masa vidalıydı, sandalyeler vidalıydı. Tarık içeri girdi ve oturdu. Geniş omuzlu, kısa kesilmiş saç, iki aydır güneş görmemiş bir yüz.
> Ellerini masanın üstüne koydu. Sağ elin boğumlarında solmuş, sararmış bir iz. Elini fark edince masanın altına çekti.
tarik: Avukat hanım… Gülay mı gönderdi? Ha. Ben ona demiştim, para harcama diye.
~ Kendi ellerine bakarak konuşan bir adam. Ellerinin ne yaptığını hâlâ anlamaya çalışan.
`,
    ),
    O(`
# CEZAEVİ — AVUKAT GÖRÜŞ ODASI [bg:gorus_odasi]
> Aynı kapılar. Cevdet başıyla selam verdi, kapıyı açtı. Tarık bu kez gözlerini kaldırdı; gelenin ben olduğumu görünce omuzları biraz indi.
tarik: Gülay nasıl? Elif? Ha… iyi. İyi.
`),
  ],
});

const gorusme = interview('INV_GORUSME', {
  ...INV,
  title: 'Müvekkil görüşmesi',
  hud: ['min', 'trust'],
  background: 'gorus_odasi',
  room: { label: 'CEZAEVİ · GÖRÜŞ ODASI', character: 'tarik' },
  lines: [
    W(cmp(v('min'), '==', 8), `> Görüş salonunun kapanışına 8 dakika var.`),
    O(`> Görüş salonunun kapanışına 12 dakika var. Cevdet camın ardında; görür ama duymaz.`),
  ],
  tones: [
    { id: 'soft', label: 'Yumuşak', hint: '+4 güven' },
    { id: 'hard', label: 'Sert', hint: '−8 güven · daha fazla bilgi' },
  ],
  toneEffects,
  moodRules: [
    mood('Çözülüyor', 'success', 'uzgun', flag('fact_yumruk')),
    mood('Savunmada', 'error', 'kizgin', lowTrust),
    mood('Gergin', 'neutral', 'kizgin', cmp(v('tone'), '==', 'hard')),
    mood('Temkinli', 'neutral', 'normal'),
  ],
  objectives: [
    {
      id: 'obj_gece',
      when: flag('fact_gece'),
      known: 'Kavga 23.00 sularında; Kenan ayırdı, eve yolladı.',
      unknown: 'O gece ne oldu?',
    },
    {
      id: 'obj_yumruk',
      when: flag('fact_yumruk'),
      known: 'Bir kez vurdu; utandığı için “ittim” dedi.',
      unknown: 'Yalnızca itti mi?',
    },
    {
      id: 'obj_donus',
      when: flag('fact_donus'),
      known: 'Limandan çıktı; iskelede oturup ağladı.',
      unknown: 'Kavgadan sonra nereye gitti?',
    },
    {
      id: 'obj_kardes',
      when: flag('fact_kardes'),
      known: 'Ercan ölen ağabeyi Emre’yle alay etti, tükürdü.',
      unknown: 'Yumruktan önce ne oldu?',
    },
  ],
  topics: [
    topic('TP_GECE', 'O gece', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 20 },
      effects: [raise('fact_gece')],
      tones: {
        soft: {
          prompt: 'O geceyi baştan anlatır mısın? Acele etmiyoruz.',
          responses: [
            W(
              lowTrust,
              `
tarik/kizgin: Anlattım. Polise anlattım, savcıya anlattım. Ne değişti? Herkes yazdı, herkes gitti.
~ Duvar. Duvara vurulmaz; kapısı aranır.
`,
            ),
            O(`
tarik: Sekizde girdim vardiyaya. Dört numarada gemi vardı, konteyner bağlıyorduk. Yağmur, poyraz. Normal.
tarik: On bire doğru Ercan geldi. Elinde matara. Hep öyleydi gece vardiyasında, herkes bilir. Sataştı. Ben karışmadım ilk.
tarik: Sonra… kavga oldu. Kenan abi geldi, ayırdı. “Eve git” dedi. Ben de gittim. Ha, bu kadar.
- Ercan yerdeyken nasıldı?
tarik: Küfrediyordu. Bağırıyordu. Burnu kanıyordu. Ölen adam öyle bağırmaz abla. Ben onu öyle bıraktım. Bağırırken.
> Bunu söylerken ellerine baktı. Sonra masanın kenarına.
`),
          ],
        },
        hard: {
          prompt: 'Saat saat anlat. Kaçta çıktın limandan?',
          says: T(`
tarik/kizgin: Saat mi? Saat bakan mı olur o hâlde? Çıktım işte. Kenan abi “git” dedi, çıktım.
tarik: Turnikeden geçtim. Kartımı okuttum. Kartı okutmadan çıkılmaz zaten, kapı açılmaz.
~ Kart. Okutulan her kart bir saat bırakır. Kimsenin istemediği bir saat.
`),
          effects: [raise('fact_kart')],
        },
      },
    }),
    topic('TP_ERCAN', 'Ercan', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 15 },
      tones: {
        soft: {
          prompt: 'Ercan nasıl biriydi? Aranızda bir şey var mıydı?',
          says: T(`
tarik: Puantördü. Gemiye giren çıkan kutuyu sayardı. İçerdi. İçince herkese sataşırdı; bana daha çok.
tarik: Neden bana bilmem. Belki Karadenizliyim diye. Belki… belki başka şeyden.
~ “Başka şeyden.” Cümlenin yarısında bir kapı kapandı.
`),
        },
        hard: {
          prompt: 'Sana ne dedi de vurdun? Söyle.',
          says: T(`
tarik/kizgin: Vurdum demedim!
> Bir sessizlik. Sonra çenesi titredi, sesi alçaldı.
tarik: Ağabeyimi dedi. Emre’yi. İki yıl önce gece yüklemesinde konteyner altında kaldı. Ercan dedi ki “kardeşin de senin gibi ayağına bakmazdı, o yüzden ezildi.”
tarik: Sonra tükürdü. Yüzüme. İtti beni babaya. Sonra… sonra işte.
~ Bir ölü kardeş, bir tükürük, bir itiş. Kanunun “haksız fiil” dediği şeyin üç parçası.
`),
          effects: [discover('clue_kardes'), raise('fact_kardes'), score('ARASTIRMA', 40)],
        },
      },
    }),
    topic('TP_VARDIYA', 'Twistlock', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 15 },
      effects: [raise('fact_iz')],
      tones: {
        soft: {
          prompt: 'Twistlock üstünde izin çıkmış. Bunu nasıl açıklarsın?',
          says: T(`
tarik: Abla ben laşingciyim. Gece boyunca dört yüz kilit geçer elimden. Takarsın, çevirirsin, sökersin, kafese atarsın.
tarik: O kafesteki kilitlerin hepsinde benim izim vardır. Ali’nin de vardır, Hüsnü’nün de. Bizim işimiz o.
- Kilitler hep aynı tip mi?
tarik: Dört numarada yeni tip, yarı otomatik. Sarı olanlar. Eskiler kalktı, iki yıl oldu. Ağabeyim öldükten sonra değiştirdiler zaten.
~ Bir iz, bir meslek. Kriminal rapor izi buldu; mesleği yazmadı.
`),
        },
        hard: {
          prompt: 'O kilitle adama vurdun mu?',
          says: T(`
tarik/kizgin: Kilitle mi? Ben adama kilitle mi vurayım? Elimle vurdum!
> Söylediğini duydu. Gözleri büyüdü. Sustu.
tarik/uzgun: Elimle… Bir kere.
~ Bir itiraf, kendinden habersiz. Sert soru kapıyı kırdı; ama kırılan kapı geri kapanmaz.
`),
          effects: [raise('fact_yumruk'), raise('yumruk_sert')],
        },
      },
    }),
    topic('TP_YUMRUK', 'Yumruk', {
      cost: costOf('min', 2),
      visibleWhen: all(flag('fact_gece'), not(flag('fact_yumruk'))),
      score: { SORGULAMA: 30 },
      tones: {
        soft: {
          prompt: 'Tarık, ifadende “ittim” yazıyor. Gülay “vurmuş” diyor. Hangisi?',
          responses: [
            W(
              any(openTrust, has('clue_baba_kan'), has('clue_basit')),
              `
> Uzun bir sessizlik. Cevdet camın ardında yer değiştirdi.
tarik/uzgun: Vurdum. Bir kere. Burnuna.
tarik/uzgun: Polise “ittim” dedim. Utandım abla. Babam derdi ki “elini kaldıran adam değildir.” Ben elimi kaldırdım. Kızımın babası elini kaldırdı.
tarik: Ama bir kere. Bir kere vurdum, düştü, oturdu. Kalkmaya çalışıyordu. Kafasını vurmadı, ben gördüm. Oturdu.
- Bunu mahkemede söyleyebilir misin?
tarik: Söylerim. Doğrusu bu. Yalan söyleyerek çıkmak istemem. Elif büyüyünce sorar.
~ “Vurdum.” Bir kelime. Bu dosyanın bütün savunması o kelimenin üstüne kurulacaktı. Ya da o kelimenin altında kalacaktı.
`,
            ),
            O(`
tarik: İttim. Yazdığı gibi. İttim, düştü.
> Gözlerini kaçırdı. Masanın altındaki eli bir an yumruk oldu, sonra açıldı.
~ Yalan söylemiyor. Yalanı saklıyor. Ona güvenmeden bir şey söylemeyecek; ya da elimde onu yalanlayacak bir şey olmadan.
`),
          ],
          effects: [ifThen(any(openTrust, has('clue_baba_kan'), has('clue_basit')), [raise('fact_yumruk')])],
        },
        hard: {
          prompt: 'Yalan söylüyorsun. Vurdun, değil mi?',
          says: T(`
tarik/kizgin: Evet! Vurdum! Bir kere! Mutlu musun?
> Masaya vurmak için elini kaldırdı; havada durdurdu. Eline baktı. Yavaşça indirdi.
tarik/uzgun: Bir kere vurdum. Utandım. Polise ittim dedim. Bunu yazacak mısın şimdi?
~ Yazacağım. Ama onun ağzından değil, benim kâğıdımdan; o kendisi söyleyene kadar.
`),
          effects: [raise('fact_yumruk'), raise('yumruk_sert')],
        },
      },
    }),
    topic('TP_DONUS', 'Eve dönüş', {
      cost: costOf('min', 2),
      visibleWhen: any(has('ev_hesap'), flag('fact_saat_0010'), flag('fact_kart')),
      score: { SORGULAMA: 25 },
      effects: [raise('fact_donus')],
      tones: {
        soft: {
          prompt: 'Turnikeden çıktın. Sonra? Eve 00.10’da varmışsın.',
          says: T(`
tarik: Gülay söyledi demek. Ha… Eve gidemedim hemen. Ayaklarım götürmedi.
tarik: İskeleye indim. Nail Usta’nın büfesi açıktı, hep açıktır. İki çay aldım, kartla. Birini içtim, biri soğudu.
tarik/uzgun: Oturdum. Ağladım abla. Erkek adam ağlamaz derler, ağladım. Ağabeyim için mi, kendim için mi, bilmiyorum.
tarik: Haberler başladı radyoda. Nail Usta “git evine oğlum” dedi. Kalktım, yürüdüm.
- Bunu neden kimseye söylemedin?
tarik: Kim sordu ki? Polis “kaçta çıktın” dedi, “on bir buçuk gibi” dedim. Başka bir şey sormadı.
~ Kimse sormadı. Bu dosyanın en uzun cümlesi.
`),
        },
        hard: {
          prompt: 'Bir saat neredeydin? Kimse görmedi mi seni?',
          says: T(`
tarik/kizgin: İskeledeydim! Büfede! Nail Usta gördü!
tarik: Ağlıyordum, gördü. Bunu da mı söyleyeyim mahkemede? “Ağladım” mı diyeyim?
~ Evet. Belki de tam olarak bunu.
`),
        },
      },
    }),
    topic('TP_EMRE', 'Ağabeyin', {
      cost: costOf('min', 2),
      visibleWhen: any(has('clue_kardes'), flag('fact_sukru_emre')),
      score: { SORGULAMA: 20 },
      effects: [inc('trust', 6), raise('fact_kardes'), ifThen(not(has('clue_kardes')), [discover('clue_kardes')])],
      tones: {
        soft: {
          prompt: 'Emre’yi anlatır mısın?',
          says: T(`
tarik/uzgun: Benden üç yaş büyüktü. Beni Rize’den o getirdi buraya. “Liman ekmek verir” dedi.
tarik: Gece yüklemesiydi. Eski tip kilitlerden biri açık kalmış. Konteyner kaydı. Emre altında kaldı.
tarik: Soruşturma oldu, kimse ceza almadı. “Ayağına bakmamış” dediler. Ercan da öyle dedi işte. O gece.
- Ercan o gece tam olarak ne dedi?
tarik/uzgun: “Kardeşin de senin gibiydi, ayağına bakmazdı, o yüzden ezildi.” Sonra tükürdü. Sonra itti.
~ Bir yumruktan önce bir ölü. Bir hakaret, bir tükürük, bir itiş. Mahkeme buna bir ad verecek; ben önce adını doğru koymalıyım.
`),
        },
        hard: {
          prompt: 'Ağabeyin için mi vurdun?',
          says: T(`
tarik/kizgin: Ağabeyim için mi? Ağabeyim öldü abla! Onun için ne yapabilirim ki?
tarik/uzgun: Adam onunla dalga geçti. “Ezildi” dedi. Tükürdü yüzüme. Ben… ben dayanamadım. Bir kere.
`),
        },
      },
    }),
    topic('TP_KENAN', 'Vardiya şefi', {
      cost: costOf('min', 2),
      visibleWhen: visited('INV_KENAN'),
      score: { SORGULAMA: 15 },
      tones: {
        soft: {
          prompt: 'Kenan Bey seni 23.40’ta B sahasında gördüğünü söylüyor.',
          says: T(`
tarik/saskin: Kenan abi mi? B sahasında mı? Ben B sahasına hiç gitmedim abla. O tarafta işim yok, orası istif.
tarik: Kenan abi iyi adamdır. Bana iş o buldu. Ağabeyim ölünce “sen de burada kal evlat” dedi. Yanlış görmüştür. Gece, yağmur…
tarik: Ben turnikeden çıktım, iskeleye indim. Ondan sonrasını bilmem.
~ Müvekkilim, aleyhine tanıklık eden adamı savunuyor. Bu dosyada herkes birini koruyor.
`),
        },
        hard: {
          prompt: 'Vardiya şefi neden yalan söylesin?',
          says: T(`
tarik/kizgin: Yalan mı? Kenan abi yalan söylemez. Yanlış görmüştür.
tarik: Bilmiyorum abla. Herkes bir şey görmüş, ben görmemişim. Ben sadece eve gittim.
`),
        },
      },
    }),
  ],
  choices: [
    option('G_RESIM', 'Elif’in resmini cama tut', {
      visibleWhen: not(chosen('G_RESIM')),
      effects: [inc('trust', 8)],
      responses: B(`
> Katlanmış kâğıdı çantamdan çıkardım ve masanın üstünde açtım. Mavi bir gemi. Bacasından duman. Güvertede iki çöp adam.
> Tarık bir süre baktı. Dokunmadı. Elini kâğıdın yanına, masanın üstüne koydu; kâğıdın değil.
tarik/uzgun: Gemiyi bana çizmiş. Ben ona “babam gemide çalışıyor” dedim, gemiye bindiğimi sanıyor.
tarik: Elindeki ne bunun? Vinç mi? Ha… kalp. Kalp çizmiş.
> Gözlerini kapadı. Bir süre öyle kaldı.
tarik: Sor abla. Ne sorarsan sor.
`),
    }),
  ],
  finish: { id: 'G_BITIR' },
});

// --- Sahne aramaları ---

const searchMiss = (id: string) =>
  fallback(id, 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  });

const rihtim = sceneSearch('INV_RIHTIM', {
  ...INV,
  title: '4 no’lu rıhtım · olay yeri fotoğrafları',
  hud: ['taps'],
  exposeCounts: true,
  scene: 'sc_rihtim',
  background: 'liman_gece',
  instruction: 'Fotoğrafta şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps',
  lines: B(`
# ARŞİV · 15 KASIM 06.40 — RIHTIM 4 FOTOĞRAFLARI [bg:liman_gece]
> Kırk bir fotoğraf. Flaşla, yağmurda çekilmiş. Islak beton beyaz patlıyor, konteynerlerin arası simsiyah.
~ Fotoğraf kimseye bir şey anlatmaz; yalnızca gösterir. Asıl soru, kimin neye bakmadığıdır.
> Kavga burada oldu. Ceset ise üç yüz metre ötede, B sahasında bulundu. Kolluk iki yeri tek bir hikâyeyle birleştirmiş: kavga, dönüş, darbe.
> Fotoğrafçı her kareye bir numara yazmış, yanına kurşun kalemle küçük notlar: “kan?”, “iz?”, “matara.” Kimse bu notlara cevap vermemiş.
~ Bir fotoğrafçı bir şeyi merak etmiş ve bir soru işareti koymuş. İki ay sonra o soruyu ben soruyorum.
`),
  miss: searchMiss('FB_RIHTIM'),
  finish: { id: 'RIHTIM_BITIR' },
});

const bsaha = sceneSearch('INV_BSAHA', {
  ...INV,
  title: 'B sahası · cesedin bulunduğu yer',
  hud: ['taps2'],
  exposeCounts: true,
  scene: 'sc_bsaha',
  background: 'depo_gece',
  instruction: 'Fotoğrafta şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps2',
  lines: B(`
# ARŞİV · 15 KASIM 06.55 — B SAHASI FOTOĞRAFLARI [bg:depo_gece]
> İki kırmızı konteynerin arasında bir dar koridor. Ceset yüzüstü, başı içeri doğru. Turuncu yelek ıslak ve kararmış.
> Fotoğrafçı her şeyi çekmiş; kimse fotoğraflara dönüp bakmamış. Dosyada tek satır: “Olay yerinde dikkat çeken başka bulguya rastlanmadı.”
~ “Dikkat çeken.” Kimin dikkatini? Dikkati çekilmek istenmeyen biri için çok rahat bir cümle.
> Cesedin yeri rıhtımdan üç yüz metre. Arada iki sıra konteyner, bir forklift yolu, bir drenaj kanalı. Kolluğa göre Ercan bu yolu kendi yürümüş.
~ Burnu kanayan, sarhoş, söylenen bir adam. Üç yüz metre. Ne için? Kime?
`),
  miss: searchMiss('FB_BSAHA'),
  finish: { id: 'BSAHA_BITIR' },
});

const bufeGiris = decisionNode('INV_BUFE_G', [{ to: 'INV_NAIL' }], {
  ...INV,
  title: 'İskele büfesi',
  onFirstEnter: [meet('nail')],
  lines: B(`
# SALI 19.20 — MUDANYA İSKELESİ [bg:sokak_yagmur]
> İskelenin ucunda kırk yıllık bir büfe. Buğulu cam, içeride sarı bir ampul, bir semaver, bir radyo. Radyo hava durumunu okuyordu.
> Tezgâhın arkasında yetmişlerinde bir adam. Kasketinin altından seyrek beyaz saçlar, iki gözünün altında uykusuzluğun mor çanakları.
nail: Hoş geldin kızım. Çay mı? Poyraz yarın da sürecekmiş, radyo öyle diyor. Radyo yalan söylemez, hava söyler.
`),
});

const nail = conversation('INV_NAIL', {
  ...INV,
  title: 'Nail Usta',
  background: 'kafe',
  room: { label: 'İSKELE BÜFESİ', character: 'nail' },
  lines: B(`
> Çayı önüme koydu. İnce belli bardak, kulpsuz, sıcak. İskelenin ötesinde feribotun ışıkları sise karışıyordu.
nail: Avukat mısın? Tarık’ın avukatı mı? Ha. Ben de bekliyordum biri gelsin. İki ay oldu. Kimse gelmedi.
nail: Kırk yıldır bu iskeledeyim. Feribot gelir, gider. İnsanlar gelir, gider. Kimse bir şey sormaz; ben de anlatmam. Ama sorsan anlatırım.
`),
  choices: [
    option('NL_GECE', '“14 Kasım gecesini hatırlıyor musunuz?”', {
      discovers: 'clue_nail',
      score: { SORGULAMA: 40 },
      responses: B(`
nail: Hatırlamaz mıyım. Kasımın on dördü, cuma. Lodos döndü poyraza o gece. On bir buçuğu geçiyordu.
nail: Çocuk geldi, iki çay istedi. Kartla ödedi; ben kart sevmem ama aldım. Oturdu şu tabureye, denize baktı.
nail/uzgun: Ağlıyordu kızım. Erkek adam öyle ağlamaz. Ağladı. Sesini çıkarmadan, omuzları sarsıla sarsıla.
nail: Elinde bir peçete vardı, kanlı. Kendi kanı değildi; eli kanamıyordu. Boğumları şişmişti sadece.
nail: Sordum, “ne oldu oğlum” dedim. “Bir adama vurdum usta” dedi. “Ağabeyime laf etti.” Başka bir şey demedi.
~ Kavgadan yarım saat sonra, limanın dışında, bir ihtiyarın tezgâhında, kendi ağzından: “Bir adama vurdum.” Kimse sormamış.
`),
    }),
    option('NL_SAAT', '“Ne zamana kadar kaldı?”', {
      visibleWhen: chosen('NL_GECE'),
      score: { SORGULAMA: 20 },
      responses: B(`
nail: Gece haberlerine kadar. Haberler başladı, ben dedim “oğlum git evine, karın merak eder.” Kalktı, gitti.
nail: Haberler on ikide başlar. Yayın akışı orada, duvarda. Yıllardır aynı. Ben saate bakmam, radyoya bakarım.
`),
    }),
    option('NL_POLIS', '“Polis size geldi mi?”', {
      score: { SORGULAMA: 10 },
      responses: B(`
nail: Kimse gelmedi. Ben de gitmedim. Yetmiş iki yaşındayım kızım; karakolun kapısı benim için yokuş.
nail: Bir de… Tarık’ı tutukladılar diye duydum. Gitsem ne diyecektim? “Ağladı” mı? Ağlamak kimseyi kurtarmaz dedim.
- Belki kurtarır.
nail: Belki. Hava bile değişiyor. Belki.
`),
    }),
    cont('NL_BAK', 'Büfeye ve fişlere bak', 'INV_BUFE', { visibleWhen: chosen('NL_GECE') }),
    back('NL_BITIR', 'Teşekkür et ve ayrıl'),
  ],
});

const bufe = sceneSearch('INV_BUFE', {
  ...INV,
  title: 'İskele büfesi',
  hud: ['taps3'],
  exposeCounts: true,
  scene: 'sc_bufe',
  background: 'kafe',
  instruction: 'Büfede dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps3',
  lines: B(`
nail: Bak kızım, ne istersen. Benim burada saklayacak bir şeyim yok; olsa olsa kırk yıllık fiş.
`),
  miss: searchMiss('FB_BUFE'),
  finish: { id: 'BUFE_BITIR', label: 'Büfeden ayrıl' },
});

// --- Gülay ---

const gulayGiris = decisionNode('INV_GULAY_G', [{ to: 'INV_GULAY' }], {
  ...INV,
  title: 'Güzelyalı',
  lines: B(`
# ÇARŞAMBA 11.00 — GÜZELYALI [bg:ev]
> Denize bakan eski bir apartman, üçüncü kat. Merdivende ıslak paspas, kapıda bir çocuk ayakkabısı.
> Salonda bir dikiş makinesi, yanında yarım kalmış bir gelinlik, toplu iğneyle tutturulmuş. Duvarda mavi bir gemi resmi daha; bu kez renkli.
gulay: Gelin avukat hanım. Elif okulda, öğlen gelir. Çay koydum. Kusura bakmayın, ortalık…
> Ortalık tertemizdi. Yalnızca makinenin etrafında iplik kırpıntıları.
`),
});

const gulay = conversation('INV_GULAY', {
  ...INV,
  title: 'Gülay Demirel',
  background: 'ev',
  room: { label: 'GÜZELYALI · EV', character: 'gulay' },
  lines: B(`
gulay: Ne sormak istiyorsanız sorun. Ben de bilmek istiyorum. İki aydır herkes bir şey biliyor, bir ben bilmiyorum.
`),
  choices: [
    option('GL_SAAT', '“Tarık o gece eve kaçta geldi?”', {
      effects: [raise('fact_saat_0010')],
      score: { SORGULAMA: 20 },
      responses: B(`
gulay: On ikiyi on geçe. Biliyorum, çünkü Elif’in öksürük şurubunu on ikide verdim, sonra saate baktım, “nerede kaldı” dedim.
gulay: Kapıyı açtığımda eli böyleydi, şişmiş. Yüzü… ağlamış. On yıldır ağladığını görmedim. Bir şey demedi, yattı.
gulay/uzgun: Polis sabah sekizde geldi.
`),
    }),
    option('GL_KART', '“Hesap dökümünüze bakabilir miyiz? Kartını kullandı mı?”', {
      discovers: 'ev_hesap',
      score: { ARASTIRMA: 60 },
      responses: B(`
gulay: Döküm mü? Telefonda var, dur. Ortak hesap, bir kartı onda.
> Telefonu çevirdi. Kasım. 14. Bir satır.
gulay/saskin: “23.37 · İSKELE BÜFE MUDANYA · 30,00.” İskele? Büfe? O saatte iskelede ne işi var?
~ 23.37. Vardiya şefinin onu B sahasında gördüğü saatten üç dakika önce. Limandan yirmi dakika uzakta.
gulay: Bunu yazdırayım mı? Bankadan çıktısını alırım, kaşeli.
- Alın. Kaşeli.
`),
    }),
    option('GL_EMRE', '“Emre kimdi?”', {
      score: { SORGULAMA: 10 },
      effects: [raise('fact_emre_gulay')],
      responses: B(`
gulay/uzgun: Ağabeyi. İki yıl önce limanda öldü. Konteyner altında. Tarık o günden sonra başka adam oldu; gece uyanır, su içer, balkona çıkar.
gulay: O gece Ercan denen adam Emre’ye laf etmiş. Şükrü Usta söylemiş birine, o birisi bana. Herkes biliyor bunu, bir mahkeme bilmiyor.
`),
    }),
    option('GL_TEKLIF', 'Gülay’ın susuşunu sor', {
      visibleWhen: chosen('GL_SAAT'),
      responses: B(`
> Gülay çayını karıştırdı. Kaşık bardağa çarptı, bir daha, bir daha.
gulay: Avukat hanım… On ikiyi on geçe çok geç değil mi? Savcı “nerede kaldı bir saat” demez mi?
gulay: Ben… “on bir buçukta geldi” desem? Kimse bilmez. Elif uyuyordu. Komşular uyuyordu. Ben bilirim, bir de Allah.
~ İşte. “Ne derseniz.” Bürodaki o cümle, şimdi bir teklif olarak masanın üstünde.
`),
    }),
    option('GL_DOGRU', '“Gördüğünüz saati söyleyin. Başka bir şey söylerseniz ikinizi de yakar.”', {
      visibleWhen: chosen('GL_TEKLIF'),
      score: { USUL_BILGISI: 40 },
      effects: [raise('gulay_durust'), inc('trust', 4)],
      good: 'Tanığa yalan söylemesini öğütlemedin; doğru saati söylemesini istedin. Yalan tanıklığa azmettirme hem TCK 272 ve 38’e hem Av.K. 34’e aykırı olurdu.',
      category: 'USUL_BILGISI',
      responses: B(`
- Gülay Hanım, mahkemede yalnızca gördüğünüzü söyleyeceksiniz. On ikiyi on geçe. Bir dakika eksik değil.
- Yalan söylerseniz, hem siz suç işlemiş olursunuz hem de Tarık’ın doğru söylediği her şey şüpheli olur. O bir saati ben açıklayacağım.
> Gülay kaşığı bıraktı. Bir süre pencereye baktı.
gulay: Açıklayabilir misiniz?
- Az önce açıkladık. Telefonunuzda yazıyor: 23.37, iskele büfesi.
gulay/uzgun: Peki. On ikiyi on geçe. Doğrusu bu.
`),
    }),
    option('GL_YALAN', '“Öyle deyin. Kimse bilmez.”', {
      visibleWhen: chosen('GL_TEKLIF'),
      score: { USUL_BILGISI: -150 },
      effects: [inc('ethics', 2), raise('etik_gulay')],
      bad: 'Tanığa yalan beyan öğütledin: yalan tanıklığa azmettirme (TCK 272, 38) ve avukatlık meslek kurallarına aykırılık (Av.K. 34). Üstelik hesap dökümü bu yalanı çürütür.',
      category: 'USUL_BILGISI',
      responses: B(`
- Öyle deyin. On bir buçuk. Kimse bilmez.
> Gülay başını salladı. Rahatlamış gibiydi. Ben değildim.
~ Bir saati sildim. Bir kalem darbesiyle değil, bir cümleyle. Cümleler kalemden daha zor silinir.
`),
    }),
    option('GL_GEC', '“Bunu duymamış olayım.”', {
      visibleWhen: chosen('GL_TEKLIF'),
      score: { USUL_BILGISI: -20 },
      effects: [raise('gulay_kararsiz')],
      neutral: 'Duymazdan gelmek yalanı engellemez; tanığa doğruyu söyleme yükümlülüğünü açıkça hatırlatmak gerekirdi.',
      responses: B(`
- Bunu duymamış olayım, Gülay Hanım.
> Gülay bana baktı. Ne dediğimi anlamadı; ya da fazlasıyla anladı.
~ Bir kapıyı kapatmadım. Aralık bıraktım. Aralık kapılar rüzgârda çarpar.
`),
    }),
    option('GL_ELIF', '“Elif babasını soruyor mu?”', {
      score: { SORGULAMA: 10 },
      effects: [inc('trust', 4)],
      responses: B(`
gulay/uzgun: Her akşam. “Babam gemiden ne zaman inecek?” Ben de “uzun sefer” diyorum. Haritadan bir yer seçtik, oraya gittiğini sanıyor.
gulay: Odasında bir harita var, okuldan getirdi. Bir toplu iğne taktı: babası orada. Her gün iğneyi biraz daha eve doğru oynatıyor.
> Makinenin yanında bir toplu iğne kutusu. Gülay bir iğne aldı, parmaklarının arasında çevirdi, geri koydu.
~ Bir haritada bir iğne. Benim panomda kırmızı iplikler. Hepimiz aynı şeyi yapıyoruz: bir adamı eve getirmeye çalışıyoruz.
`),
    }),
    back('GL_BITIR', 'Teşekkür et ve çık'),
  ],
});

// --- Şükrü Usta ---

const sukru = conversation('INV_SUKRU', {
  ...INV,
  title: 'Şükrü Usta',
  background: 'depo',
  onFirstEnter: [meet('sukru')],
  room: { label: 'FORKLİFT GARAJI', character: 'sukru' },
  lines: B(`
# PERŞEMBE 13.10 — LİMAN, FORKLİFT GARAJI [bg:depo]
> Mazot, yanık yağ, demir. Bir forkliftin çatalının altında altmışlarında bir adam, elinde bir kaşık, bir kap yemek. Kulağının arkasında ten rengi bir cihaz.
sukru: Ha? Avukat mı? Kimin avukatı? Tarık’ın mı? Otur kızım, otur. Yüksek konuş ama, kulak yok bende.
> Kabının kapağını kapattı, bir bezle çatalını sildi. Forkliftin yanındaki tahtada bir takvim: emekliliğine kalan günler, çarpılarla.
sukru: Dört ay. Yüz on iki gün. Kırk yıl forklift sürdüm, bir kere bir kutu düşürmedim. Bir kere bir yalan da söylemedim. Ne sorarsan sor.
`),
  choices: [
    option('SK_GECE', '“O gece ne gördünüz, Usta?”', {
      score: { SORGULAMA: 20 },
      responses: B(`
sukru: Ha? O gece mi? Gördüm tabii. Forkliftin kabinindeydim, şuradan şuraya, yirmi metre. Yağmur, far.
sukru: Ercan sataştı çocuğa. Ercan’ı bilirsin… bilmezsin. İçerdi. Çocuk durdu, durdu, sonra bir tane vurdu.
sukru: Ercan yere oturdu. Sonra biri bağırdı: “Seni gebertirim!” Ben polise “Tarık bağırdı” dedim.
`),
    }),
    option('SK_KIM', '“Bağıranın ağzını gördünüz mü?”', {
      visibleWhen: chosen('SK_GECE'),
      discovers: 'clue_pil',
      score: { SORGULAMA: 40 },
      responses: B(`
sukru: Ha?
- Bağıranın ağzını gördünüz mü, Usta? Kim bağırdı?
> Kaşığı bıraktı. Kulağının arkasındaki cihaza dokundu, sanki şimdi açılacakmış gibi.
sukru: O gece pil bitikti kızım. Akşam fark ettim, yedeği evde kaldı. Sesi duydum, kafamın içinde bir uğultu gibi. Kimin ağzından çıktı, görmedim.
sukru: Polis sordu, “kim bağırdı” dedi. Ben de… çocuk ayaktaydı, Ercan yerdeydi. “Ayaktaki bağırır” dedim. Öyle yazdılar.
~ Dürüst bir adam, dürüst bir tahmin. Kolluk tutanağında tahmin, kesinlik olarak yazılmış.
`),
    }),
    option('SK_KANTIN', '“Ercan sonra nereye gitti?”', {
      visibleWhen: chosen('SK_GECE'),
      discovers: 'clue_kantin',
      score: { SORGULAMA: 30 },
      responses: B(`
sukru: Kantine. Kenan Bey gönderdi. Ben de on bir buçuk gibi kantine gittim, çay için.
sukru: Ercan oradaydı. Burnuna pamuk tıkamış, tost yiyordu. Ayran içiyordu. Söylenip duruyordu, “o Karadenizliyi bitireceğim” diye.
sukru: Ölü adam tost yemez kızım. Bunu ben de söyledim polise. Yazmadılar galiba.
~ 23.34 sularında Ercan bir tost yiyordu. Kavgadan yarım saat sonra, burnunda pamukla, ağzında küfür.
`),
    }),
    option('SK_EMRE', '“Emre’yi tanır mıydınız?”', {
      score: { SORGULAMA: 15 },
      effects: [raise('fact_sukru_emre')],
      responses: B(`
sukru/uzgun: Emre’yi… Tanımaz mıyım. İyi çocuktu. Gece yüklemesinde eski tip bir kilit açık kalmış, kutu kaydı. Ben oradaydım.
sukru: Ercan o gece Emre’ye laf etti, duydum. Pil bitikti ama o lafı duydum; “ezildi” dedi, güldü. Ben olsam ben de vururdum. Yaşım olmasa.
`),
    }),
    option('SK_TELKIN', '“O zaman bağıranın Tarık olmadığını söyleyin; emin değilsiniz zaten.”', {
      visibleWhen: chosen('SK_KIM'),
      score: { USUL_BILGISI: -60 },
      effects: [inc('ethics'), raise('sukru_telkin')],
      bad: 'Tanığa ne söyleyeceğini öğütledin. Tanık “emin değilim” diyebilir; ama avukat ona bir cümle veremez (TCK 277; Av.K. 34). Doğrusu: kürsüde yalnızca gördüğünü söylemesini istemek.',
      category: 'USUL_BILGISI',
      responses: B(`
sukru/kizgin: Ha? Ne diyeyim? “Tarık değildi” mi diyeyim? Ben onu da görmedim ki kızım!
sukru: Bana ne diyeceğimi söyleme. Kırk yıl kimse söylemedi, sen de söyleme. Gördüğümü derim, görmediğimi demem.
~ Dürüst bir adama kendi tahminimi verdim. O geri itti. Utanması gereken o değildi.
`),
    }),
    option('SK_KABIN', '“Kabinden kavganın olduğu yer ne kadar uzaktı?”', {
      visibleWhen: chosen('SK_GECE'),
      score: { SORGULAMA: 15 },
      responses: B(`
sukru: Yirmi metre. Belki yirmi beş. Arada bir baba, bir kafes. Yağmur cama vuruyordu, silecek de bozuk.
sukru: Farı onlara çevirdim, gördüm. Ama far ışığı ne kadar gösterir? Siluet. İki turuncu yelek. Biri iri, biri ince.
~ Siluet. İki yelek. Bir yumruk. Ve bir ses, kimin olduğunu kimsenin görmediği.
`),
    }),
    back('SK_BITIR', 'Teşekkür et ve ayrıl'),
  ],
});

// --- Vardiya şefi ---

const kenan = conversation('INV_KENAN', {
  ...INV,
  title: 'Vardiya şefi',
  background: 'depo',
  onFirstEnter: [meet('kenan')],
  room: { label: 'LİMAN · VARDİYA OFİSİ', character: 'kenan' },
  lines: B(`
# LİMAN — VARDİYA OFİSİ [bg:depo]
> Prefabrik bir oda. Masada bir termos, iki bardak, bir telsiz. Duvarda gelgit tablosu, bir gemi takvimi, rıhtımların el çizimi bir planı.
> Ellilerinde, kır sakallı, iri bir adam. Lacivert kazak. Konuşurken ellerini cebinden çıkardığı bir bez parçasına siliyordu; yağ, mürekkep, belki yalnızca alışkanlık.
kenan: Gel kızım, gel. Kahve? Termos kahvesi, acıdır ama ısıtır. Limanda iyi gün herkesin; poyrazda adam belli olur.
kenan: Tarık’ın avukatısın. Bilirim. Yazık oldu o çocuğa. Yazık oldu Ercan’a da. İkisi de benim vardiyamdı.
kenan: Yirmi yıldır bu limandayım. Kutuları sayarız, adamları sayarız, geceleri sayarız. Liman insanı bırakmaz kızım; kıyıya çeker, orada tutar.
`),
  choices: [
    option('KN_GECE', '“O gece neler gördünüz?”', {
      discovers: 'clue_kenan_isik',
      score: { SORGULAMA: 30 },
      responses: B(`
kenan: Kavgayı ben ayırdım. Fenerle geldim, ikisini ayırdım. Tarık’a “eve git evlat” dedim, Ercan’ı kantine yolladım.
kenan: Sonra ofise döndüm, defter yazdım. On bire yirmi var gibi, bir tur attım. B sahasının ağzında Tarık’ı gördüm.
kenan/uzgun: Elinde bir şey vardı, demir gibi. Seslenmedim. Keşke seslenseydim. Belki o zaman…
- Gece, yağmurda, yüzünü nasıl seçtiniz?
kenan: Projektörler yanıyordu kızım. Gündüz gibiydi. Yirmi yıldır bu limandayım; her işçiyi yürüyüşünden tanırım.
~ “Gündüz gibiydi.” Kesin bir adam, kesin bir ışık. Kesinliğin bir faturası olur; kim ödeyecek?
`),
    }),
    option('KN_ERCAN', '“Ercan nasıl biriydi?”', {
      score: { SORGULAMA: 15 },
      responses: B(`
kenan: Puantördü. Gemiye giren çıkan kutuyu sayardı. İyi sayardı. Bazen fazla sayardı.
> Bez parçasını katladı, cebine koydu.
kenan: İçerdi. Dili kötüydü. Ama kimse ölmeyi hak etmez. Kimse.
~ “Bazen fazla sayardı.” Bir puantör için tuhaf bir kusur.

`),
    }),
    option('KN_TARIK', '“Tarık nasıl biridir?”', {
      score: { SORGULAMA: 10 },
      responses: B(`
kenan: İyi çocuk. Ağabeyini burada kaybetti; ben işe aldım onu. “Kal evlat” dedim. Babası gibiyim.
kenan/uzgun: Ama içinde bir yangın vardı o çocuğun. Ağabeyi meselesi. Ercan o yangına benzin döktü. Ne yapsın?
~ Sanığı seven bir tanık. Aleyhine ifade veren bir baba. Kürsüde en çok inanılan tanık budur.
`),
    }),
    option('KN_ARAMA', '“Ercan o gece 23.41’de birini aramış. Sizi mi?”', {
      visibleWhen: has('clue_arama2341'),
      score: { SAVUNMA_STRATEJISI: -80 },
      effects: [raise('kenan_uyarildi')],
      bad: 'Tanığa elindeki kaydı gösterdin; kim olduğunu bilmediğin bir numarayı bir tanığın ağzına verdin. Bilgi önce mahkemeye ve savcılığa gitmeli (CMK 158, 177).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
kenan: Beni mi? Yok kızım. Telefonum ofiste şarjdaydı. Ercan herkesi arardı içince; karısını, anasını, ölmüş babasını.
kenan: Sen bunlarla yorma kendini. Çocuğun bir yumruğu var, onu savun. Gerisi polisin işi.
~ Kimin olduğunu bilmediğim bir numarayı, mahkemeden önce bir tanığın masasına koydum. Bir kaydın değeri, kimin elinde ilk durduğuyla ölçülür.
`),
    }),
    option('KN_FENER', '“Kavgayı ayırırken Ercan ne diyordu?”', {
      visibleWhen: chosen('KN_GECE'),
      score: { SORGULAMA: 20 },
      responses: B(`
kenan: Küfrediyordu. Ne diyecek? Burnu kanıyordu, yerde oturuyordu. “Bitireceğim onu” diyordu, “görürsün.”
kenan: Ben kaldırdım onu. Kolundan tuttum, ayağa diktim. “Yürü kantine, yüzünü yıka” dedim. Yürüdü. Sallanarak ama yürüdü.
- Yani kendi ayağıyla gitti.
kenan: Gitti tabii. O zaman ölmemişti ki kızım. Sonra… sonra ne olduysa.
> Termosu açtı, bardağına kahve doldurdu. Bana doldurmadı; bardağım hâlâ doluydu.
~ “Sonra ne olduysa.” Bu dosyanın bütün sorusu o cümlenin içinde. Kimse o cümlenin devamını yazmamış.
`),
    }),
    back('KN_BITIR', 'Kahve için teşekkür et'),
  ],
});

// --- Emekli adli tıpçı ---

const orhan = conversation('INV_ORHAN', {
  ...INV,
  title: 'Dr. Orhan Beyaz',
  background: 'buro',
  onFirstEnter: [meet('orhan')],
  room: { label: 'ÇEKİRGE · ÇALIŞMA ODASI', character: 'orhan' },
  lines: B(`
# CUMA 17.00 — ÇEKİRGE, BİR APARTMAN DAİRESİ [bg:buro]
> Kitaplarla dolu bir oda. Masada bir kafatası maketi, bir büyüteç, soğumuş bir çay. Çaya hiç dokunmuyor; yalnızca ara ara bardağı çeviriyor.
orhan: Leyla aradı. “Çocuğum geliyor” dedi. Otur. Kırk yıl kesip biçtim; artık yalnızca anlatıyorum. Anlatmak daha zor.
> Duvarda eski bir fotoğraf: otopsi salonunda genç bir adam, yanında daha genç bir kadın, elinde not defteri. Kadının yüzü bana tanıdık geldi.
orhan: Leyla. Otuz yıl önce. Stajyerdi; her otopside en ön sırada dururdu, hiç bayılmazdı. Bir davada bana öyle bir soru sordu ki raporumu yeniden yazdım.
orhan: O dava… neyse. O başka bir hikâye. Senin dosyana bakalım.
~ Leyla’nın masasındaki ters çerçeve. Burada, bir duvarda, düz duruyor. Sormadım.
`),
  choices: [
    option('OR_DERS', '“Düşme ile darbeyi raporda nasıl ayırırız?”', {
      score: { HUKUKI_BILGI: 30 },
      effects: [raise('fact_coup')],
      responses: [
        W(
          has('clue_desen'),
          `
orhan: Coup ve contrecoup. Hareketli baş, sabit zemin: baş durur, beyin durmaz, karşı tarafa çarpar. Ensen yere vurursa alnının arkasında da kanama olur.
orhan: Sabit baş, hareketli cisim: darbe neredeyse iz orada kalır. Karşı tarafta bir şey olmaz.
> Maketi çevirdi, ensesini gösterdi.
orhan: Raporunda üç virgül iki santimlik dairesel bir çökme diyorsun. Yuvarlak, keskin kenarlı. Düz bir babaya ya da betona düşen kafa böyle küçük bir delik açmaz; çatlar, yayılır.
orhan: Karşı tarafa bak. Frontalde bir şey yazıyor mu?
~ Yazıyor. Dipnotta, küçük harflerle. Okumak için büyüteç gerekmişti.
`,
        ),
        O(`
orhan: Coup ve contrecoup. Hareketli baş, sabit zemin: baş durur, beyin durmaz, karşı tarafa çarpar. Ensen yere vurursa alnının arkasında da kanama olur.
orhan: Sabit baş, hareketli cisim: darbe neredeyse iz orada kalır. Karşı tarafta bir şey olmaz.
orhan: Önce raporu oku. Kırığın şekline bak, ölçüsüne bak, karşı tarafa bak. Sonra gel; birlikte konuşuruz.
`),
      ],
    }),
    option('OR_MIDE', '“Mide içeriğinden ölüm saati çıkar mı?”', {
      score: { HUKUKI_BILGI: 30 },
      effects: [raise('fact_mide')],
      responses: B(`
orhan: Kesin saat çıkmaz. Kim sana kesin saat derse yalan söyler. Ama sıra çıkar.
orhan: Bir öğün midede yarım ila iki saat kalır; yarı sindirilmiş, tanınabilir parçalar varsa ölüm yemekten kısa süre sonradır.
orhan: Adamın son yemeğini ne zaman yediğini bulursan, ölümün ondan sonra olduğunu bilirsin. İki saatlik aralık daralır. Bir saate, belki yarım saate.
~ Son yemek. Kimse sormamış: Ercan son yemeğini ne zaman yedi?
`),
    }),
    option('OR_ALET', '“Yaradan aletin ölçüsü çıkar mı?”', {
      score: { HUKUKI_BILGI: 20 },
      effects: [raise('fact_olcu')],
      responses: B(`
orhan: Çökme kırığı aletin parmak izidir. Aletin vuran yüzü küçükse, kırık o yüzün şeklini alır. Yuvarlaksa yuvarlak, köşeliyse köşeli.
orhan: Emanetteki aletle kırığın ölçüsünü karşılaştır. Tutmuyorsa, savcının elinde alet yok demektir. Bir iz var, o kadar.
`),
    }),
    back('OR_BITIR', 'Teşekkür et'),
  ],
});

// --- Belgeler ---

const onrapor = documentExam('INV_ONRAPOR', {
  ...INV,
  title: 'Ön otopsi raporu',
  hud: ['exam_left'],
  background: 'buro',
  lines: B(`
> Dört sayfa. Sade, kuru bir dil. Bir alet seç, sonra şüpheli satıra dokun. Doğru alet + doğru satır = yeni ipucu.
~ Raporu iki kişi okumuş: yazan ve imzalayan. Üçüncüsü benim.
> İlk sayfada bir vücut şeması, üstünde kırmızı kalemle iki işaret: yüz ve ense. Kimse aradaki mesafeyi sormamış.
`),
  header: { left: 'BURSA ATŞ · ÖN OTOPSİ RAPORU', right: '15.11 · E. YAVUZ' },
  columns: [
    { label: 'BÖLÜM', flex: 1.2 },
    { label: 'BULGU', flex: 2.4 },
  ],
  rows: [
    row('o1', ['Dış muayene · yüz', 'Burunda kanama, alt dudakta 1 cm kesi; basit tıbbi müdahale ile giderilebilir']),
    row('o2', ['Kafatası · oksipital', 'Çökme kırığı, ~3 cm, kenarları keskin; altında subdural kanama']),
    row('o3', ['Kafatası · frontal', 'Bkz. dipnot ¹'], {
      mag: { cells: ['Kafatası · frontal', '¹ Karşı darbe (contrecoup) lezyonu saptanmadı.'], tone: 'special' },
    }),
    row('o4', ['Mide içeriği', 'Yarı sindirilmiş ekmek, peynir parçaları, süt ürünü (~250 ml)']),
    row('o5', ['Toksikoloji', 'Kanda etil alkol 1,1 promil']),
    row('o6', ['Ölüm zamanı', '23.00–01.00 arası (rijidite, livor)']),
  ],
  tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('ruler', 'Cetvel', 'compare')],
  costVar: 'exam_left',
  rules: [
    examine('EX_O1', 'mag', 'o1', {
      discovers: 'clue_basit',
      score: { DELIL_ANALIZI: 100 },
      feedback: {
        title: 'YENİ İPUCU',
        text: '“Basit tıbbi müdahale ile giderilebilir.” Yumruğun bıraktığı iz bu: burun ve dudak. Bir kırık, bir çatlak yok.',
        label: '+100 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_O2', 'ruler', 'o2', {
      discovers: 'clue_desen',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU',
        text: 'Ekteki fotoğrafa cetvel tuttum: 3,2 santim, yusyuvarlak, kenarları zımba gibi. Yere düşen bir kafa böyle küçük ve düzgün bir çukur açmaz.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_O3', 'mag', 'o3', {
      discovers: 'clue_kontrkup',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU',
        text: 'Sayfanın dibinde, küçük harflerle: “Karşı darbe lezyonu saptanmadı.” Ensesinden düşen bir başın alnının arkasında da kanama olurdu.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_O4', 'mag', 'o4', {
      discovers: 'clue_mide',
      score: { DELIL_ANALIZI: 100 },
      feedback: {
        title: 'YENİ İPUCU',
        text: 'Ekmek, peynir, süt ürünü; yarı sindirilmiş. Ercan ölmeden kısa süre önce bir şey yemiş. Ne zaman?',
        label: '+100 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
  ],
  miss: fallback('FB_ONRAPOR', 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle burada dikkat çeken bir şey bulamadın.',
      label: '−20 SKOR',
      tone: 'error',
    },
  }),
  finish: { id: 'ONRAPOR_BITIR' },
});

const telefon = documentExam('INV_TELEFON', {
  ...INV,
  title: 'Telefon inceleme tutanağı',
  hud: ['tel_left'],
  background: 'buro',
  lines: B(`
> Kolluğun tutanağı: cesedin cebinden çıkan telefonun son aramaları. Altında bir imza ve “herhangi bir hususa rastlanmamıştır.”
~ “Herhangi bir husus.” Bir hususun hangisi olduğuna kim karar verdi?
> Tutanağın altında tek bir imza; kontrol eden ikinci bir göz yok. Altı satır, iki dakikada okunmuş.
`),
  header: { left: 'TELEFON İNCELEME TUTANAĞI · E. YAVUZ', right: '16.11' },
  columns: [
    { label: 'SAAT', flex: 0.8 },
    { label: 'YÖN', flex: 0.9 },
    { label: 'NUMARA / REHBER', flex: 2 },
    { label: 'SÜRE', flex: 0.9 },
  ],
  rows: [
    row('t1', ['22.15', 'gelen', '0544 … 08 21 · “Sevim”', '1 dk 12 sn']),
    row('t2', ['22.58', 'giden', '0224 … 33 10 · “Ev”', 'cevapsız']),
    row('t3', ['23.41', 'giden', '0532 … 41 17 · “Kptn”', '2 dk 07 sn']),
    row('t4', ['23.47', '—', 'ekran kilidi açıldı', '—']),
    row('t5', ['00.02', 'gelen', '0544 … 08 21 · “Sevim”', 'cevapsız']),
    row('t6', ['00.31', 'gelen', '0544 … 08 21 · “Sevim”', 'cevapsız']),
  ],
  tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Karşılaştır', 'compare')],
  costVar: 'tel_left',
  rules: [
    examine('EX_T3', 'mag', 't3', {
      discovers: 'clue_arama2341',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU',
        text: '23.41, giden arama, iki dakika yedi saniye. Rehberde kısaltma: “Kptn.” Tarık turnikeden 23.18’de çıktı. Ercan ondan yirmi üç dakika sonra telefonda konuşuyordu.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_T5', 'compare', 't5', {
      discovers: 'clue_cevapsiz',
      score: { DELIL_ANALIZI: 60 },
      feedback: {
        title: 'YENİ İPUCU',
        text: '22.15’te karısının aramasını açmış. 00.02’de açmamış, 00.31’de de. 23.41 ile 00.02 arasında bir şey olmuş.',
        label: '+60 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
  ],
  miss: fallback('FB_TELEFON', 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu satırda bu aletle dikkat çeken bir şey yok.',
      label: '−20 SKOR',
      tone: 'error',
    },
  }),
  finish: { id: 'TELEFON_BITIR' },
});

const turnike = documentExam('INV_TURNIKE', {
  ...INV,
  title: 'Turnike ve araç kapısı dökümü',
  hud: ['turn_left'],
  background: 'buro',
  lines: B(`
> Liman işletmesinin cevabı: iki sayfa döküm, bir kapak yazısı. “Mahkemenizin müzekkeresi üzerine…”
~ Bir makinenin hafızası. Kimseyi sevmez, kimseden korkmaz; yalnızca saat tutar.
> Kapak yazısında bir cümle daha: “Kayıtlar altı ay saklanmaktadır.” Dilekçeyi birkaç ay geç verseydim, bu kâğıt hiç olmayacaktı.
`),
  header: { left: 'MUDANYA LİMANI · GEÇİŞ KAYITLARI', right: '14–15.11' },
  columns: [
    { label: 'SAAT', flex: 0.9 },
    { label: 'KAPI', flex: 1.2 },
    { label: 'KART / PLAKA', flex: 1.6 },
    { label: 'YÖN', flex: 0.8 },
  ],
  rows: [
    row('g1', ['23.02', 'Personel 1', 'Ş. BALCI', 'giriş']),
    row('g2', ['23.18', 'Personel 2', 'T. DEMİREL', 'çıkış']),
    row('g3', ['23.26', 'Personel 1', 'M. ÖZ', 'çıkış']),
    row('g3b', ['23.21', 'Araç kapısı', '16 LMN 07 · servis', 'çıkış']),
    row('g4', ['23.49 / 00.14', 'Araç kapısı', '16 LMN 07 · servis', 'giriş / çıkış']),
    row('g5', ['06.02', 'Personel 1', 'H. KARA', 'giriş']),
  ],
  tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Karşılaştır', 'compare')],
  costVar: 'turn_left',
  rules: [
    examine('EX_G2', 'compare', 'g2', {
      discovers: 'clue_cikis',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU',
        text: 'Tarık’ın kartıyla 23.18.42’de çıkış. Sabaha kadar bu kartla başka hiçbir geçiş yok. Liman tel örgüyle çevrili; içeri turnikesiz girilmez.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_G4', 'mag', 'g4', {
      discovers: 'clue_servis_arac',
      score: { DELIL_ANALIZI: 100 },
      feedback: {
        title: 'YENİ İPUCU',
        text: 'Gece yarısına doğru limana giren tek araç: 16 LMN 07, bir servis kamyoneti. 23.21’de çıkmış, 23.49’da geri girmiş, 00.14’te yeniden çıkmış. Kimin kullandığı yazmıyor.',
        label: '+100 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
  ],
  miss: fallback('FB_TURNIKE', 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu satırda bu aletle dikkat çeken bir şey yok.',
      label: '−20 SKOR',
      tone: 'error',
    },
  }),
  finish: { id: 'TURNIKE_BITIR' },
});

const ifade = documentExam('INV_IFADE', {
  ...INV,
  title: 'Kolluk ifadeleri',
  hud: ['ifade_left'],
  background: 'buro',
  lines: B(`
> Üç ifade, üç ayrı saat, aynı daktilo. Kolluk ifadeleri bir hikâyenin ilk taslağıdır; sonra herkes o taslağı ezberler.
~ İlk taslakta sonradan silinen cümleler olur. Bazen de hiç yazılmayan cümleler.
`),
  header: { left: 'BURSA EMNİYET · CİNAYET BÜRO · İFADE TUTANAKLARI', right: '15–16.11' },
  columns: [
    { label: 'KİŞİ · SAAT', flex: 1.1 },
    { label: 'BEYAN', flex: 2.8 },
  ],
  rows: [
    row('i1', ['K. Aksoy · 15.11 08.00', '“23.40’ta B sahasının ağzında Tarık’ı gördüm. Projektörler yanıyordu.”']),
    row('i2', ['Ş. Balcı · 15.11 10.30', '“Tarık seni gebertirim diye bağırdı. Ercan’ın kafası babaya çarptı.”'], {
      mag: {
        cells: ['Ş. Balcı · 15.11 10.30', 'Kenarda kurşun kalem: “tanık cihaz kullanıyor, tekrar sor.”'],
        tone: 'special',
      },
    }),
    row('i3', ['T. Demirel · 15.11 14.00', '“Ağzını bozdu, ittim, düştü. On bir buçuk gibi çıktım.”']),
    row('i4', ['K. Aksoy · 15.11 08.00 (devamı)', '“Sonra ofise döndüm. Sabaha kadar ofisteydim.”']),
  ],
  tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Karşılaştır', 'compare')],
  costVar: 'ifade_left',
  rules: [
    examine('EX_I2', 'mag', 'i2', {
      score: { DELIL_ANALIZI: 60 },
      effects: [raise('fact_ifade_cihaz')],
      feedback: {
        title: 'KENAR NOTU',
        text: 'İfadeyi alan memur bir şey fark etmiş: tanık işitme cihazı kullanıyor. “Tekrar sor” yazmış. Kimse tekrar sormamış.',
        label: '+60 SKOR',
        tone: 'special',
      },
    }),
    examine('EX_I1', 'compare', 'i1', {
      score: { DELIL_ANALIZI: 60 },
      effects: [raise('fact_ifade_saat')],
      feedback: {
        title: 'SAATLER',
        text: 'Vardiya şefi ifadesini cesedin bulunmasından iki saat sonra, herkesten önce vermiş. Saati dakikasına kadar söylüyor: 23.40. Kavganın saatini ise “on bir gibi” diyor.',
        label: '+60 SKOR',
        tone: 'special',
      },
    }),
  ],
  miss: fallback('FB_IFADE', 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu satırda bu aletle dikkat çeken bir şey yok.',
      label: '−20 SKOR',
      tone: 'error',
    },
  }),
  finish: { id: 'IFADE_BITIR' },
});
// --- Dilekçe ---

const dilekce = story('INV_DIL', {
  ...INV,
  title: 'Delil dilekçesi (CMK 177)',
  background: 'buro',
  lines: B(`
> Duruşmadan önce mahkemeden delil toplanmasını isteyebilirdim. Ama mahkeme her talebi okumaz; iki talep, gerekçesiyle, yeter.
~ Bir dilekçe bir kapıyı açmaz. Kapıyı açacak kişiye anahtarın nerede olduğunu söyler.
`),
  choices: [
    option('DIL_TURNIKE', 'Liman turnike ve araç kapısı kayıtları (14 Kasım 22.00–01.00)', {
      enabledWhen: cmp(v('dil_n'), '<', 2),
      score: { USUL_BILGISI: 50 },
      effects: [raise('dil_turnike'), inc('dil_n')],
      good: 'Sanığın çıkış saatini ve limana giren araçları gösterecek kayıt; somut, ilgili ve elde edilebilir (CMK 177, 332).',
      responses: B(
        `- Sanığın limandan çıkış saati ve olay saatlerinde limana giren araçlar. Kayıt işletmede tutuluyor; silinmeden istenmesi gerekir.`,
      ),
    }),
    option('DIL_KANTIN', 'Kantinin kart okuyucu kayıtları (14 Kasım 23.00–00.00)', {
      enabledWhen: cmp(v('dil_n'), '<', 2),
      score: { USUL_BILGISI: 40 },
      effects: [raise('dil_kantin'), inc('dil_n')],
      good: 'Maktulün kavgadan sonra yaşadığını ve ne zaman yemek yediğini gösterecek kayıt (CMK 177, 332).',
      responses: B(
        `- Maktulün kavgadan sonra kantinde olup olmadığı. Kart okuyucu saat tutar; ölüm saatini daraltmak için gerekli.`,
      ),
    }),
    option('DIL_KESIF', 'Olay yerinde keşif', {
      enabledWhen: cmp(v('dil_n'), '<', 2),
      effects: [inc('dil_n')],
      neutral:
        'Üç ay sonra yapılacak keşif izleri göstermez; fotoğraflar zaten dosyada. Talep hakkını başka bir kayda harcayabilirdin.',
      responses: B(`- Olay yerinde keşif. Mesafeleri ve aydınlatmayı görmek için.`),
    }),
    option('DIL_HTS', 'Liman güvenlik kamerası kayıtları (B sahası ve rıhtımlar)', {
      enabledWhen: cmp(v('dil_n'), '<', 2),
      score: { USUL_BILGISI: -40 },
      effects: [inc('dil_n')],
      bad: 'Kolluğun olay yeri tutanağı B sahasında ve 4 no’lu rıhtımda kamera bulunmadığını yazıyordu; dosyayı okumadan istenen kayıt bir talep hakkını boşa harcar (CMK 177).',
      responses: B(`- Liman güvenlik kamerası kayıtları; B sahası ve rıhtımlar.
~ Dilekçeyi gönderdikten sonra olay yeri tutanağını yeniden açtım. Üçüncü sayfa, son satır: “Olay mahallinde kamera bulunmamaktadır.” Okumuştum. Unutmuştum.`),
    }),
    back('DIL_GONDER', 'Dilekçeyi gönder'),
  ],
});

// --- Tahta ---

const cikarim = deductionBoard('INV_CIKARIM', {
  ...INV,
  title: 'Çıkarım tahtası',
  background: 'buro_gece',
  lines: B(`
> İki ipucunu seç. Birbirini tamamlıyorsa duruşmada kullanabileceğin bir DELİL doğar.
~ Her ipucu bir cümle. İki cümle yan yana gelince bazen bir hikâye olur; bazen yalnızca iki cümle.
`),
  pool: INV_POOL,
  recipes: invRecipes('CB'),
  miss: fallback('FB_CIKARIM', 'COMBINE', {
    repeat: 'ONCE_PER_PARAMS',
    score: { DELIL_ANALIZI: -50 },
    feedback: {
      title: 'Bu ikisi birbirini açıklamıyor',
      text: 'Başka bir çift dene.',
      label: 'BAĞLANTI YOK · −50 SKOR',
      tone: 'error',
    },
  }),
  finish: { id: 'CIKARIM_BITIR' },
});

// --- Leyla ---

const leyla = story('INV_LEYLA', {
  ...INV,
  title: 'Leyla',
  background: 'buro',
  lines: [
    W(
      all(cmp(v('day'), '==', 1), has('ded_darbe')),
      `
# LEYLA’NIN ODASI [bg:buro]
leyla: Düşme değil, darbe. Güzel. Şimdi savcı ne der, biliyor musun? “Darbe olabilir; sanık geri döndü ve vurdu.”
leyla: Darbe, ölümün nasıl olduğunu söyler. Kimin vurduğunu söylemez. Senin ikinci sorun saat. Ercan ne zaman öldü?
leyla: Kural şu: ceza davasında şüphe sanık lehine. Ama hâkim şüpheyi senin yerine kurmaz. Önüne iki saat koy; arasına bir adam sığmasın.
`,
    ),
    W(
      cmp(v('day'), '==', 1),
      `
# LEYLA’NIN ODASI [bg:buro]
> Leyla pencerenin önünde, kapalı sigara paketi elinde. Dışarıda Uludağ bulutların içinde kaybolmuştu.
leyla: Dosyada iki adam var: biri vurdu, biri gördü. İkisinin de bir saati var. Vuranın saati 23.04. Görenin saati 23.40.
leyla: Saatleri kâğıda bağla. Turnike, kart, telefon. İnsanlar yanılır; makineler yanılmaz, yalnızca eksik kalır.
leyla: Delil toplamak için mahkemeye dilekçe verebilirsin; CMK 177. Ne istediğini, neden istediğini yaz. Gerekçesiz talep, okunmamış talep demektir.
`,
    ),
    W(
      all(cmp(v('day'), '==', 2), flag('fact_yumruk')),
      `
# LEYLA’NIN ODASI [bg:buro]
leyla: “Vurdum” dedi demek. Kolluk ifadesinde “ittim” vardı.
leyla: Kürsüde ne diyecek? İnkâr ederse forkliftçi onu yalancı çıkarır; yalancı çıkan sanığın doğru söylediği hiçbir şeye inanılmaz.
leyla: Dürüst bir savunma bir taviz değildir Deniz. Haksız tahrik ancak sanığın kendi anlatımıyla kurulur: neye kızdı, ne duydu, ne yaptı. TCK 29 bir duygunun hukukudur; duyguyu anlatacak olan o.
leyla: Kanun der ki haksız bir fiilin yarattığı hiddetle suç işleyene ceza indirilir. Ölmüş bir ağabeyle alay etmek, yüze tükürmek, itmek: üçü de haksız fiil. Ama üçünü de birinin anlatması gerekir.
`,
    ),
    W(
      cmp(v('day'), '==', 2),
      `
# LEYLA’NIN ODASI [bg:buro]
leyla: Bugün tanıklarla konuşacaksın. Bir kural: tanığa soru sorarsın, cevap vermezsin.
leyla: Bir tanığa “şöyle hatırlıyorsunuz, değil mi” dediğin an, onu kendi hafızasından çıkarıp seninkine sokarsın. Mahkeme bunu anlar; kanun da buna bir ad verir: tanığı etkileme, TCK 277.
leyla: Bir de aile. Karısı, annesi, kardeşi seni sever ve sana yardım etmek ister. Yardım etmek isteyen tanık en tehlikelisidir; çünkü doğruyu biraz düzeltmeye hazırdır.
`,
    ),
    W(
      all(cmp(v('day'), '==', 3), any(has('ded_saat'), has('ded_canli'))),
      `
# LEYLA’NIN ODASI [bg:buro]
leyla: Ercan kavgadan sonra yaşıyordu. Yemek yedi, telefon etti. Bunu gösterebilirsen savcının hikâyesi bir yerinden yırtılır.
leyla: Ama yırtığa elini sokma. 23.41’de biri aranmışsa, o kişiyi bulmak senin işin değil. Mahkemeden iste. Savcılığa bildir. Biz kolluk değiliz.
leyla: Bir de şunu düşün: savcı geri çekilirse nereye çekilir? Yumruğa. Yumruktan ölüm çıktı derse, kastın yaralamaya yönelik olduğunu kabul etmiş olursun.
leyla: Yaralama sonucu ölümde ceza, failin o netice bakımından en az taksirle hareket edip etmediğine göre kurulur; TCK 23. Ölüm o yumruktan gelmediyse, 87/4 bile değil.
`,
    ),
    W(
      cmp(v('day'), '==', 3),
      `
# LEYLA’NIN ODASI [bg:buro]
leyla: Kolluk ifadesi bir başlangıçtır, bir son değil. Duruşmada tanık yeniden yemin eder ve yeniden anlatır; heyet ikisini karşılaştırır.
leyla: İki anlatım arasındaki fark bir çelişkidir. Ama çelişkiyi kürsüde sen yaratmazsın; kâğıtta zaten vardır. Sen yalnızca gösterirsin.
`,
    ),
    O(`
# LEYLA’NIN ODASI [bg:buro]
leyla: Son gün. Yarından sonra kürsüye iki adam çıkacak: biri dürüst ve yanılan, biri babacan ve kesin. Hangisi daha tehlikeli?
- Kesin olan.
leyla: Evet. Kesinlik kürsüde bulaşıcıdır. Heyet kesin bir tanığa inanmak ister; çünkü inanmak, düşünmekten kolaydır.
leyla: Sorularını kısa tut. Önce bastır, bırak kendisi anlatsın. Kâğıdı en son göster. Tanığa soru sorma hakkın var, CMK 201; tanığı tartışmaya açma hakkın da var, CMK 215. İkisini karıştırma.
leyla: Bir de ara karar. Celsenin sonunda mahkeme sana “talepleriniz” diyecek. O an, ikinci celsede elinde ne olacağına karar verdiğin andır. Hazırlıksız gitme.
`),
  ],
  choices: [back('LEYLA_DON', 'Teşekkür et')],
});

// --- Gün sonları ---

const dayEnd = decisionNode(
  'INV_DAY_END',
  [
    { when: cmp(v('day'), '==', 2), to: 'INV_AKSAM1' },
    { when: cmp(v('day'), '==', 3), to: 'INV_AKSAM2' },
    { to: 'INV_AKSAM3' },
  ],
  {
    ...INV,
    title: 'Gün sonu',
    onEnter: [...dayDeliveries.effects, inc('day', 1), set('ap', 3)],
  },
);

const aksam1 = story('INV_AKSAM1', {
  ...INV,
  title: 'Akşam',
  background: 'buro_gece',
  lines: [
    W(
      any(has('ev_turnike'), has('ev_kantin')),
      `
# GECE 22.10 — ARSLAN HUKUK [bg:buro_gece]
> Masamda bir zarf: liman işletmesinin cevabı. Mahkeme müzekkereyi bir günde yazmış, işletme bir günde cevap vermiş. Kimse avukatı beklemez; mahkemeyi bekler.
> Telefon titredi. Gülay. [phone]
gulay: Avukat hanım, rahatsız etmiyorum değil mi? Elif sordu. “Babam gemiden ne zaman inecek” dedi. Ne diyeyim? [phone]
- Yakında deyin. Ama söz vermeyin.
gulay: Söz vermem. Siz de vermediniz zaten. Ona güveniyorum. [phone]
> Kapattıktan sonra zarfı açtım. Bir döküm, saatler, kart numaraları. Kâğıt soğuktu; makineden yeni çıkmış gibi değil, buzdolabından çıkmış gibi.
~ Bir limanın hafızası. Kimseyi sevmez, kimseden korkmaz. Yarın okuyacağım; bu gece yalnızca masaya koydum.
`,
    ),
    O(`
# GECE 22.10 — ARSLAN HUKUK [bg:buro_gece]
> Telefon titredi. Gülay. [phone]
gulay: Avukat hanım, Elif sordu. “Babam gemiden ne zaman inecek” dedi. Ne diyeyim? [phone]
- Yakında deyin. Ama söz vermeyin.
> Telefonu kapattıktan sonra uzun süre panoya baktım. Üç saat, üç kâğıt, aralarında boşluk.
~ Bir çocuk babasının gemide olduğunu sanıyor. Bir bakıma doğru: hepimiz aynı gemideyiz ve kimse iskeleyi görmüyor.
> Panoya bir kâğıt daha iğneledim. Üstüne büyük harflerle: “ERCAN NE YEDİ? KİMİ ARADI?” Altını iki kez çizdim.
`),
  ],
  choices: [
    option('AK1_A', '“Babası uzun bir seferde deyin. Bir sefer daha.”', {
      effects: [inc('trust', 2)],
      next: 'INV_HUB',
      responses: B(`
- Uzun bir sefer deyin, Gülay Hanım. Bir sefer daha. Çocuklar beklemeyi bizden iyi bilir.
gulay: Uzun sefer… Peki. Haritada bir iğne var, biliyor musunuz? Her gün biraz oynatıyor. Yarın da oynatır.
> Telefonu kapattıktan sonra Elif’in gemi resmini masamın camının altına koydum. Gemi, iki çöp adam, bir kalp.
~ Bir çocuğa yalan söylemek mi, doğruyu ertelemek mi? Bu meslekte ikisinin farkını her gün yeniden öğreniyorum.
`),
    }),
    option('AK1_B', '“Ona doğruyu söyleyin; yaşına göre, kısa.”', {
      effects: [inc('trust', 4)],
      next: 'INV_HUB',
      responses: B(`
- Doğruyu söyleyin, Gülay Hanım. Kısa ve yaşına göre: “Baban bir hata yaptı, şimdi büyükler o hatanın ne kadar büyük olduğunu konuşuyor.”
gulay/uzgun: Hata… Peki. Ama “baban adam öldürdü diyorlar” demem. Onu demem.
- Demeyin. Çünkü bilmiyoruz. Ben bilmiyorum, siz bilmiyorsunuz. Bildiğimizi söyleyin.
~ Bir çocuğa söylenecek doğrunun boyu, bir mahkemeye söylenecek doğrunun boyuyla aynı: yalnızca bilinen kadar.
`),
    }),
  ],
});

const aksam2 = story('INV_AKSAM2', {
  ...INV,
  title: 'Akşam',
  background: 'sokak_yagmur',
  lines: [
    W(
      flag('kenan_uyarildi'),
      `
# GECE 23.20 — SETBAŞI [bg:sokak_yagmur]
> Eve yürürken telefonum çaldı. Bilinmeyen bir numara. Açtım.
kenan: Kızım, Kenan ben. Vardiya şefi. Numaranı kapıdaki çocuktan aldım, kusura bakma. [phone]
kenan: Kendini yorma diye aradım. Bu iş polisin işi. Sen çocuğun yumruğunu savun; bir yumruk kimseyi öldürmez, değil mi? Hayırlı geceler. [phone]
> Hat kapandı. Yağmur şemsiyenin kenarından damlıyordu.
~ Babacan bir telefon. Gece yarısı. Neden şimdi?
`,
    ),
    O(`
# GECE 23.20 — SETBAŞI [bg:sokak_yagmur]
> Eve yürüyerek döndüm. Gökdere köprünün altında bulanık akıyordu. Bir yerde bir köpek havladı, sonra sustu.
~ Bir limanın gecesi, bir şehrin gecesinden uzundur. Gemiler uyumaz; vinçler, kantinler, turnikeler uyumaz. Bir de vicdanlar.
~ O gece birisi uyumadı. Ercan değil; o gece Ercan uyudu, hiç uyanmadı. Uyumayan başka biri.
> Eve vardığımda kapının altından bir fatura atılmıştı, bir de bir apartman duyurusu: “Asansör bakımdadır.” Gülümsedim; bakım etiketleri bu dosyanın kaderi.
`),
  ],
  choices: [
    option('AK2_A', 'Leyla’yı ara', {
      next: 'INV_HUB',
      responses: B(`
leyla: Gecenin bu saatinde? Ne oldu? [phone]
- Hiçbir şey. Yürüyorum. Bir limanı düşünüyorum.
leyla: Limanlar düşünülmez Deniz, sayılır. Kaç kişi girdi, kaç kişi çıktı, kim kaçta. Say. Sonra uyu. [phone]
> Hat kapandı. Yağmur hafifledi. Leyla haklıydı; ama saymak için önce saymayı bilen birini bulmak gerekiyordu.
`),
    }),
    option('AK2_B', 'Büroya dön, panoyu yeniden kur', {
      score: { DELIL_ANALIZI: 10 },
      next: 'INV_HUB',
      responses: B(`
> Eve gitmedim. Büroya döndüm, ışığı yaktım, panonun önünde durdum. Kırmızı iplikleri söküp yeniden diktim.
> Bir iplik 23.04’ten 23.18’e, turnikeye. Bir iplik 23.04’ten 06.10’a, cesede. İkisi aynı noktadan çıkıyor; aynı yere varmıyor.
~ Kolluk tek bir iplik çekmiş. Bir ipliğin iki ucu olur. Kimse öbür ucuna bakmamış.
`),
    }),
  ],
});

const aksam3 = story('INV_AKSAM3', {
  ...INV,
  title: 'Akşam',
  background: 'buro_gece',
  lines: B(`
# GECE 21.40 — ARSLAN HUKUK [bg:buro_gece]
> Leyla gitmeden kapımda durdu. Paltosu koluna atılı.
leyla: Yarın son gün. Ne eksik?
- Her şey. Ve hiçbir şey. Her kâğıt bir şey söylüyor; hiçbiri tek başına yeterli değil.
leyla: Hiçbir kâğıt tek başına yeterli değildir. Kâğıtlar birbirine yaslanır. Yaslanacak duvarı sen örersin.
> Şemsiyesini açtı, kapıda bir an bekledi.
leyla: Uyu biraz. Yorgun avukat tanığa değil kendine soru sorar.
> Leyla gittikten sonra bir saat daha oturdum. Panodaki kırmızı iplikleri yeniden gerdim. Bir iplik, bir yumruktan bir taburede ağlayan bir adama gidiyordu.
~ Bir iplik de bir yumruktan iki konteynerin arasındaki bir cesede. Kolluk ikisini aynı iplikle bağlamış. Ben iki iplik görüyorum.
`),
  choices: [
    option('AK3_A', 'Tarık’ın kürsüde ne söyleyebileceğini düşün', {
      score: { SAVUNMA_STRATEJISI: 10 },
      next: 'INV_HUB',
      responses: B(`
~ Bir sanık kürsüde iki şey yapabilir: susar ya da anlatır. Susarsa hakkını kullanır. Anlatırsa hikâyesini kullanır.
~ Tarık’ın hikâyesi: bir ağabey, bir tükürük, bir yumruk, bir tabure, bir radyo. Hiçbirinde bir kilit yok. Hiçbirinde B sahası yok.
~ Ona ne diyeceğini söylemeyeceğim. Ne demenin ne anlama geldiğini söyleyeceğim. Aradaki çizgi, bu mesleğin en ince çizgisi.
`),
    }),
    option('AK3_B', 'Kâğıtları bir kez daha baştan oku', {
      score: { DELIL_ANALIZI: 10 },
      next: 'INV_HUB',
      responses: B(`
> İddianameyi baştan okudum. Sonra ön raporu. Sonra ifadeleri. Her seferinde başka bir kelimeye takıldım: “dönmüş”, “oluşabilir”, “gibi.”
~ Bir iddianame kesin cümlelerle yazılır. Altındaki kâğıtlar ise “gibi” ile, “olabilir” ile doludur. Kesinlik yukarıda; şüphe aşağıda.
`),
    }),
  ],
});

// --- Duruşmadan önceki gece (koşullu hafıza zinciri) ---

const geceNodes = [
  decisionNode('INV_GECE_1', [{ to: 'INV_GECE_2' }], {
    ...INV,
    title: 'Duruşmadan önceki gece',
    onEnter: [...nightDeliveries.effects],
    lines: B(`
# PAZARTESİ 23.10 — ARSLAN HUKUK [bg:buro_gece]
> Pano dolmuştu. Fotoğraflar, fotokopiler, kırmızı iplikler. Bir yumruktan bir cesede, bir saatten bir saate.
`),
  }),
  decisionNode('INV_GECE_2', [{ to: 'INV_GECE_3' }], {
    lines: [
      W(
        any(has('ded_cikis'), has('ev_hesap')),
        `~ 23.18 turnike. 23.37 iskele. Tarık geri dönmedi; bunu artık bir makine ve bir banka söylüyor.`,
      ),
      O(`~ Tarık’ın 23.18’den sonrası hâlâ boş. Bir adamın bir saatini kimse görmedi; ya da gören kimseye söylemedi.`),
    ],
  }),
  decisionNode('INV_GECE_3B', [{ to: 'INV_GECE_4' }], {
    lines: [
      W(
        flag('fact_ifade_cihaz'),
        `~ Bir memurun kenar notu: “tanık cihaz kullanıyor, tekrar sor.” İki ay sonra o soruyu ben soracağım.`,
      ),
      W(
        flag('fact_ifade_saat'),
        `~ Kavganın saati “on bir gibi.” Gördüğünün saati “23.40.” Bir adam bir saati neden dakikasına kadar bilir?`,
      ),
      O(`~ Üç ifade, bir daktilo. Yarın üçü de kürsüde yeniden anlatılacak; daktilonun yazmadıklarıyla birlikte.`),
    ],
  }),
  decisionNode('INV_GECE_3', [{ to: 'INV_GECE_3B' }], {
    lines: [
      W(
        any(has('ded_isik'), has('clue_projektor')),
        `~ “Gündüz gibiydi.” Bir etiket: enerji yok. Yarın bir adam yemin edip ışıktan söz edecek.`,
      ),
      O(`~ Vardiya şefi yarın yemin edecek. Bir adamı yürüyüşünden tanıdığını söyleyecek. Neye bakarak?`),
    ],
  }),
  decisionNode('INV_GECE_4B', [{ to: 'INV_GECE_5' }], {
    lines: [
      W(
        flag('fact_olcu'),
        `~ Dr. Beyaz: “Çökme kırığı aletin parmak izidir.” Emanetteki kilidin ölçüsü bilinmiyor. Henüz.`,
      ),
      W(
        flag('fact_coup'),
        `~ Hareketli baş, sabit zemin; sabit baş, hareketli cisim. Bir maketin ensesinde, yaşlı bir adamın parmağı.`,
      ),
      W(flag('fact_mide'), `~ “Kesin saat çıkmaz; sıra çıkar.” Son yemek. Kimse sormamış.`),
      W(flag('fact_iz'), `~ Dört yüz kilit bir gecede. Bir iz bir meslekse, bir delil değildir.`),
      O(`~ Bir rapor dört sayfa. Dört sayfanın içinde bir ölüm. Kimse ikinci kez okumamış.`),
    ],
  }),
  decisionNode('INV_GECE_4', [{ to: 'INV_GECE_4B' }], {
    lines: [
      W(has('ded_darbe'), `~ Düşme değil, darbe. Ölüm bir yumruktan değil, küçük, yuvarlak, sert bir şeyden geldi.`),
      W(has('clue_desen'), `~ 3,2 santim. Yuvarlak bir çukur. Bir beton zemin böyle bir şey bırakmaz.`),
      O(`~ Ön rapor iki ihtimal diyor: düşme ya da darbe. Savcı kendine uygun olanı seçti.`),
    ],
  }),
  decisionNode('INV_GECE_5', [{ to: 'INV_GECE_6' }], {
    lines: [
      W(
        any(has('ded_saat'), has('ded_canli')),
        `~ Ercan kavgadan sonra yaşıyordu: bir tost, bir ayran, bir telefon. Bu üç şey bir ölü adamın yapacağı şeyler değil.`,
      ),
      W(has('clue_arama2341'), `~ 23.41, “Kptn”. İki dakika. Ercan’ın son konuşması. Ne konuştu, kiminle?`),
      O(`~ Ölüm saati iki saatlik bir aralık. İki saatin içine bir adam da sığar, iki adam da.`),
    ],
  }),
  decisionNode('INV_GECE_6B', [{ to: 'INV_GECE' }], {
    lines: [
      W(
        flag('gulay_kararsiz'),
        `~ “Bunu duymamış olayım.” Gülay’a böyle dedim. Bir kapıyı aralık bıraktım; yarın o kapıdan rüzgâr girer mi, bilmiyorum.`,
      ),
      W(
        flag('fact_emre_gulay'),
        `~ Gülay: “Herkes biliyor bunu, bir mahkeme bilmiyor.” Yarın mahkeme de bilecek; Emre’nin adı tutanağa girecek.`,
      ),
      W(
        flag('gulay_sozlesme'),
        `~ Gülay’ın imzaladığı sözleşme dosyanın en altında. Kâğıt, korkan insana söz vermekten daha dürüst bir güvence.`,
      ),
      W(
        flag('gulay_minnet'),
        `~ Bir bilezik, bir mendil, kaldırılmış. “Ne derseniz” demişti. Yarın ona hiçbir şey dememeyi başarmalıyım.`,
      ),
      O(`~ Gülay yarın koridorda olacak. Ona ne söyleyeceğimi değil, neyi söylemeyeceğimi biliyorum.`),
    ],
  }),
  decisionNode('INV_GECE_6', [{ to: 'INV_GECE_6B' }], {
    lines: [
      W(
        flag('etik_gulay'),
        `~ Gülay’ın kaşığı bardağa çarpıyordu. “On bir buçuk.” Bir saati sildim. Yarın değil; ama bir gün o saat geri gelecek.`,
      ),
      W(
        all(flag('fact_yumruk'), flag('yumruk_sert')),
        `~ “Vurdum.” Ona bağırarak söylettim. Yarın kürsüde kendi sesiyle söyleyebilecek mi, yoksa benim sesimi mi hatırlayacak?`,
      ),
      W(flag('fact_yumruk'), `~ “Vurdum. Bir kere.” Yarın bunu kürsüde söyleyecek mi? Söylemesini mi istiyorum?`),

      O(`~ Tarık hâlâ “ittim” diyor. Yarın ne diyecek, ben de bilmiyorum.`),
    ],
  }),
  story('INV_GECE', {
    ...INV,
    title: 'Duruşmadan önceki gece',
    background: 'buro_gece',
    lines: B(`
> Leyla’nın odasının ışığı yanıyordu. Kapıyı çalmadan girdim. Masasında benim dosyamın bir kopyası vardı; kırmızı kalemle işaretlenmiş.
leyla: Yarın birinin elinde bir yumruk var, birinin elinde bir ölüm. Karıştırma.
leyla: Savcı ikisini aynı cümlede söyleyecek: “kavga etti, döndü, öldürdü.” Senin işin o cümleyi üçe bölmek.
> Paketi çevirdi. Bir tur. Durdu.
leyla: Bir de vardiya şefine dikkat et. İyi bir adam gibi görünüyor, iyi bir adam gibi konuşuyor. İyi adamlar kürsüde en tehlikeli tanıklardır; çünkü onlara inanılır.
leyla: İnanılan bir tanığı yalancı çıkarmaya çalışma. Yanıldığını göster. Kâğıtla.
- Ya yanılmıyorsa?
leyla: O zaman da aynı. Kürsüde “yalancı” diyen avukat salonu kaybeder. “Kâğıt başka bir saat söylüyor” diyen avukat salonu kazanır. Gerisini heyet düşünür.
leyla: Bir de Tarık. Yarın ilk kez herkesin önünde konuşacak. Ne diyeceğine o karar verir; ama ne demenin ne anlama geldiğini ona sen anlatırsın. Telkin değil; bilgi.
~ Pencereyi açtım. Yağmur dinmişti; poyraz dinmemişti. Uzakta, limanın vinçleri kırmızı ışıklarıyla göz kırpıyordu.
`),
    choices: [cont('GECE_DEVAM', 'Adliyeye git', 'H1_00G', { role: 'PRIMARY' })],
  }),
];

// --- Hub ---

const hub = p1.hub({
  ...INV,
  title: 'Liman Gecesi · soruşturma',
  background: 'buro',
  lines: hubLines,
  scenePreview: { scene: 'sc_rihtim' },
  tabs: [
    { id: 't_olay', label: 'OLAY YERİ', kind: 'SCENE', choices: hubChoices.olay },
    { id: 't_cezaevi', label: 'CEZAEVİ', kind: 'PEOPLE', choices: hubChoices.cezaevi },
    { id: 't_insanlar', label: 'İNSANLAR', kind: 'PEOPLE', choices: hubChoices.insanlar },
    { id: 't_arsiv', label: 'ARŞİV', kind: 'ARCHIVE', choices: hubChoices.arsiv },
  ],
  quickTalk: {
    character: 'tarik',
    line: '“Bir kere vurdum. Bir kere. Ölen adam öyle bağırmaz.”',
    choices: ['H_GORUS'],
  },
  choices: [
    nav('GO_H1', 'DURUŞMAYA GİT · 1. CELSE', 'INV_GECE_1', {
      role: 'PRIMARY',
      confirm: 'Duruşmaya gidersen soruşturma biter. Emin misin?',
    }),
  ],
});

export const investigation: CasePart = {
  nodes: [
    hub,
    dayEnd,
    aksam1,
    aksam2,
    aksam3,
    gorusmeGiris,
    gorusme,
    rihtim,
    bsaha,
    bufeGiris,
    nail,
    bufe,
    gulayGiris,
    gulay,
    sukru,
    kenan,
    orhan,
    onrapor,
    telefon,
    turnike,
    ifade,
    dilekce,
    cikarim,
    leyla,
    ...geceNodes,
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
  discoveryPaths: [...dayDeliveries.discoveryPaths, ...nightDeliveries.discoveryPaths],
};
