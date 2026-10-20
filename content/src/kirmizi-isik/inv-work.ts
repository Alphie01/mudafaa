import {
  N,
  any,
  choiceNode,
  cont,
  deductionBoard,
  documentExam,
  examine,
  fallback,
  has,
  not,
  option,
  raise,
  recipe,
  row,
  says,
  sceneSearch,
  tool,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef } from '../../../tools/content/src/kit/index.js';
import { INV, T, card } from './shared.js';

// 50-investigation-2: olay yeri aramaları, belge incelemeleri, delil dilekçesi ve çıkarım tahtası.

const missTap = (id: string) =>
  fallback(id, 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  });

const missExam = (id: string) =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle bu satırda yeni bir şey çıkmadı.',
      label: '−20 SKOR · −1 deneme',
      tone: 'error',
    },
  });

const found = (title: string, text: string, label: string) => ({ title, text, label, tone: 'special' }) as const;

/** INV ve ARA tahtalarının ortak tarifleri (ARA'da yalnızca ilk kurulum puan verir). */
export const baseRecipes = (prefix: string): ChoiceDef[] => {
  const r = (id: string, a: string, b: string, ded: string, title: string, text: string) =>
    recipe(`${prefix}${id}`, a, b, {
      effects: [
        {
          type: 'IF',
          when: not(has(ded)),
          then: [{ type: 'SCORE', category: 'DELIL_ANALIZI', amount: 300 }],
        },
        { type: 'DISCOVER', evidence: ded },
      ],
      feedback: { title, text, label: 'YENİ DELİL · +300 SKOR', tone: 'success' },
    });
  return [
    r(
      'FREN',
      'clue_fren',
      'clue_abs',
      'ded_fren',
      'İz başka bir aracın',
      'ABS’li bir araç sert frende tekerleği kilitlemez; on sekiz metrelik kesintisiz kilit izi bırakmaz. Raporun 68 km/s hesabı yanlış araca dayanıyor.',
    ),
    r(
      'CAM',
      'clue_cam',
      'clue_far',
      'ded_cam',
      'Camlar başka bir aracın',
      'Volkan’ın farları sağlam. Yaya geçidinin ilerisindeki far camı ondan dökülmedi. O camın sahibi kim?',
    ),
    r(
      'YUKSEKLIK',
      'clue_kirik56',
      'clue_tampon44',
      'ded_yukseklik',
      'İlk darbe yüksek tampondan',
      'Ayaktaki bir insanın bacağı, ona çarpan tamponun hizasından kırılır. 56 santimi 44 santimlik bir tampon kıramaz.',
    ),
    r(
      'GOREMEZ',
      'clue_arka',
      'clue_necati_yer',
      'ded_goremez',
      'Taksici o ışığı göremezdi',
      'Çınarlı’da bekleyen bir taksiden Gökdere başlığının yalnızca siyah sırtı görünür. Necati’nin gördüğü kırmızı, kendi önündeki lambaydı.',
    ),
    r(
      'ARIZA',
      'clue_kabin',
      'clue_is_emri',
      'ded_ariza',
      'Arıza önceden biliniyordu',
      'İş emri kazadan dört gün önce açılmış, “malzeme yok” diye ertelenmiş; kart kazadan bir gün sonra sessizce değiştirilmiş.',
    ),
    r(
      'SAAT',
      'clue_titreme',
      'clue_uedas',
      'ded_saat',
      'Yedi saniye önce geçen araç',
      'Lambaların söndüğü an UEDAŞ’a göre 00.58.12, kameraya göre 01.05.12: kamera yedi dakika ileri. Koyu araç 01.11.41’de, Volkan 01.11.48’de geçmiş.',
    ),
  ];
};

export const boardMiss = (id: string) =>
  fallback(id, 'COMBINE', {
    repeat: 'ONCE_PER_PARAMS',
    score: { DELIL_ANALIZI: -50 },
    feedback: {
      title: 'Bu ikisi birbirini açıklamıyor',
      text: 'İki kart yan yana duruyor ama aralarında bir cümle kurulmuyor. Başka bir kart dene.',
      label: 'BAĞLANTI YOK · −50 SKOR',
      tone: 'error',
    },
  });

export const invPool = [
  'clue_fren',
  'clue_abs',
  'clue_cam',
  'clue_far',
  'clue_kirik56',
  'clue_tampon44',
  'clue_arka',
  'clue_necati_yer',
  'clue_kabin',
  'clue_is_emri',
  'clue_titreme',
  'clue_uedas',
  'clue_boya',
  'clue_sirt',
  'clue_tek_stop',
  'clue_cicek',
  'clue_yagmur',
  'clue_yorgun',
];

export const invWork: CasePart = {
  nodes: [
    // --- Olay yeri aramaları ---
    sceneSearch('INV_ARAMA', {
      ...INV,
      title: 'Polis fotoğrafları · 14 Kasım',
      background: 'sokak_yagmur',
      hud: ['taps'],
      exposeCounts: true,
      scene: 'sc_gece',
      instruction: 'Fotoğrafta şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps',
      lines: says(
        card('ARŞİV — 14 KASIM 02.10 FOTOĞRAFLARI', 'sokak_yagmur'),
        N(
          'Kırk iki fotoğraf. Flaşın beyazı, yağmurun griliği, sodyum lambaların turuncusu. Kimse bu fotoğraflara benden önce dikkatle bakmamış gibiydi.',
        ),
        T('Bilirkişi olay yerine gitmedi. Bunlar onun hiç görmediği şeyler.'),
        N(
          'Fotoğrafların arkasında kurşun kalemle numaralar: 1’den 42’ye. Bazıları bulanık, bazıları fazla net. Bir fotoğrafta bir polisin postalı, bir başkasında bir metre şeridi.',
        ),
        T(
          'Bir olay yerini anlamanın yolu, onu fotoğrafçıdan farklı bir yerden görmektir. Fotoğrafçı ne çekeceğini seçti; ben neye bakacağımı seçeceğim.',
        ),
      ),
      miss: missTap('FB_ARAMA'),
      finish: { id: 'ARAMA_BITIR' },
    }),
    sceneSearch('INV_ARAMA2', {
      ...INV,
      title: 'Kavşak · bugün',
      background: 'sokak_sabah',
      hud: ['taps2'],
      exposeCounts: true,
      scene: 'sc_sabah',
      instruction: 'Kavşakta o geceden kalan bir şey ara. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps2',
      lines: says(
        card('GÖKDERE–ÇINARLI KAVŞAĞI — ÖĞLEN', 'sokak_sabah'),
        N('Kavşağın ortasında durdum. Bir kamyonet korna çaldı; bir simitçi “abla oradan çekil” dedi. Çekilmedim.'),
        T(
          'Üç ay geçti. Asfalt yenilenmemiş, ama yağmur her şeyi yıkadı. Kalan ne varsa duvarlarda, direklerde, kabinlerde olmalı.',
        ),
        N(
          'Köşede bir büfe, karşıda bir eczane, direğin dibinde solmuş çiçekler. Gri bir kontrol kabini, üstünde belediyenin arması.',
        ),
      ),
      miss: missTap('FB_ARAMA2'),
      finish: { id: 'ARAMA2_BITIR' },
    }),
    sceneSearch('INV_ARAMA3', {
      ...INV,
      title: 'Yediemin otoparkı',
      background: 'depo',
      hud: ['taps3'],
      exposeCounts: true,
      scene: 'sc_otopark',
      instruction: 'Arabada o geceyi anlatan bir şey ara. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps3',
      lines: says(
        card('KESTEL YOLU — YEDİEMİN OTOPARKI', 'depo'),
        N(
          'Tel örgü, çamurlu bir avlu, kulübede radyo dinleyen bir görevli. “Avukatsanız bakın, dokunmayın, ben de bakarım” dedi ve bakmadı.',
        ),
        N('Beyaz sedan üç aydır aynı yerde duruyordu. Tozun altında hâlâ yeni bir araba kokusu vardı.'),
        N(
          'Arka camda bir çıkartma: “Bebek var.” Yeni yapıştırılmış, köşesi kalkmamış. O gece arabada bebek yoktu; yalnızca bekleniyordu.',
        ),
        T('Bir araba, sahibinden daha az şey unutur. Tamponu, farı, ekranı. Hepsine bakacağım.'),
      ),
      miss: missTap('FB_ARAMA3'),
      finish: { id: 'ARAMA3_BITIR' },
    }),

    // --- Belgeler ---
    documentExam('INV_RAPOR', {
      ...INV,
      title: 'Bilirkişi Raporu',
      background: 'buro',
      hud: ['rapor_left'],
      lines: says(
        N('Dört sayfa, iki fotoğraf, bir sonuç paragrafı. Müh. Cengiz Ateş’in imzası her sayfada aynı açıyla eğik.'),
        N('Bir alet seç, sonra şüpheli satıra dokun. Doğru alet + doğru yer = bulgu.'),
        T(
          'Leyla’nın sözü: “Bu adamın raporları birbirine benzer.” Benzeyen raporlar, bir yerde başka bir dosyadan kalan bir cümle taşır. O cümleyi bulmam gerek.',
        ),
      ),
      header: { left: 'BİLİRKİŞİ RAPORU · MÜH. C. ATEŞ', right: '12 ARALIK' },
      columns: [
        { label: 'KONU', flex: 1 },
        { label: 'TESPİT', flex: 2.4 },
      ],
      rows: [
        row('r_isik', ['Işık durumu', 'Kavşağın sinyal planına göre sanık yönü kırmızı']),
        row('r_hiz', ['Hız', '18 m fren izinden ~68 km/s']),
        row('r_carpma', ['Çarpma şekli', 'Araç yayaya sağ ön köşesiyle çarpmıştır']),
        row('r_iz', ['Diğer izler', 'Olay yerinde başka araca ait iz yoktur']),
        row('r_kusur', ['Kusur', 'Sanık asli kusurlu (%100); yaya kusursuz']),
        row('r_sonuc', ['Sonuç', 'Sanık bilinçli taksirle hareket etmiştir']),
      ],
      tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
      costVar: 'rapor_left',
      rules: [
        examine('EX_R_ISIK', 'mag', 'r_isik', {
          score: { DELIL_ANALIZI: 100 },
          effects: [raise('rapor_plan')],
          feedback: found(
            'PLAN, ÖLÇÜM DEĞİL',
            'Bilirkişi ışığın o gece ne yaktığını değil, kâğıttaki programı yazmış. Denetleyicinin kaydına bakılmamış.',
            '+100 SKOR · Bulgu',
          ),
        }),
        examine('EX_R_HIZ', 'cmp', 'r_hiz', {
          score: { DELIL_ANALIZI: 100 },
          effects: [raise('rapor_iz')],
          feedback: found(
            'KİMİN İZİ?',
            'Rapor izi doğrudan sanığın aracına bağlıyor; izin hangi araca ait olduğu hiçbir yerde tespit edilmemiş.',
            '+100 SKOR · Bulgu',
          ),
        }),
        examine('EX_R_CARPMA', 'cmp', 'r_carpma', {
          score: { DELIL_ANALIZI: 150 },
          effects: [raise('rapor_kopya')],
          feedback: found(
            'SAĞ MI, SOL MU?',
            'Tutanağa göre Volkan’ın aracında hasar sol ön tamponda. Rapor “sağ ön köşe” diyor. Ya yanlış okunmuş ya başka bir dosyadan kopyalanmış.',
            '+150 SKOR · Bulgu',
          ),
        }),
        examine('EX_R_IZ', 'mag', 'r_iz', {
          score: { DELIL_ANALIZI: 50 },
          effects: [raise('rapor_cam')],
          feedback: found(
            'SUSKUN PARAGRAF',
            'Tutanaktaki cam kırıklarından tek kelime yok. “İz yoktur” demek, bakılmadı demekle aynı şey değil.',
            '+50 SKOR · Bulgu',
          ),
        }),
        examine('EX_R_SONUC', 'mag', 'r_sonuc', {
          score: { HUKUKI_BILGI: 50 },
          effects: [raise('rapor_yorum')],
          feedback: found(
            'MÜHENDİSİN HUKUKU',
            '“Bilinçli taksir” bir hukuki nitelendirme. Bilirkişi hâkimin yapacağı nitelendirmeyi yapamaz (CMK 67/3).',
            '+50 SKOR · Bulgu',
          ),
        }),
      ],
      miss: missExam('FB_RAPOR'),
      finish: { id: 'RAPOR_BITIR' },
    }),
    documentExam('INV_TUTANAK', {
      ...INV,
      title: 'Kaza Tespit Tutanağı',
      background: 'buro',
      hud: ['tutanak_left'],
      lines: says(
        N('Tutanak el yazısıyla doldurulmuş, sonra daktilo edilmiş. Krokide oklar, metreler, bir insan silueti.'),
        T('Bilirkişi bunu okudu. Ama okumak, görmek değildir.'),
        N(
          'Krokinin köşesinde, kurşun kalemle yazılıp silinmiş ama hâlâ okunan iki harf ve bir soru işareti. Kimin yazdığı belli değil.',
        ),
        T('Bir tutanakta silinmiş bir soru işareti, bir avukat için bir davetiyedir.'),
      ),
      header: { left: 'KAZA TESPİT TUTANAĞI · 14.11 · 01.24', right: 'POL. MEM. A. YURT' },
      columns: [
        { label: 'BÖLÜM', flex: 1 },
        { label: 'NOT', flex: 2.6 },
      ],
      rows: [
        row('t_iz', ['Fren izi', '18 m; geçitten 4 m önce başlıyor; tek parça']),
        row('t_bulgu', ['Bulgular', 'Geçidin 9 m ilerisinde cam ve plastik parçalar (emanete alınmadı)']),
        row('t_arac', ['Araç', '16 AVE 712 · beyaz sedan · sol ön tamponda sürtünme · farlar sağlam']),
        row('t_tanik', ['Tanık', 'N.B., taksi, Çınarlı Sk. çıkışında ilk sırada bekliyor']),
        row('t_hava', ['Hava/zemin', 'Yağışlı, zemin ıslak, aydınlatma var']),
        row('t_saat', ['Saat', 'İhbar 01.12 · ekip 01.24 · ambulans 01.26']),
      ],
      tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('olc', 'Cetvel', 'compare')],
      costVar: 'tutanak_left',
      rules: [
        examine('EX_T_IZ', 'olc', 't_iz', {
          discovers: 'clue_fren',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'YENİ İPUCU',
            'On sekiz metre, tek parça. Kesik yok, aralık yok. Kilitlenmiş tekerlek böyle yazar.',
            '+100 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_T_BULGU', 'mag', 't_bulgu', {
          discovers: 'clue_cam',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'YENİ İPUCU',
            'Cam ve plastik parçalar, Volkan’ın aracının durduğu yerin çok önünde. Ve emanete alınmamış.',
            '+100 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_T_ARAC', 'mag', 't_arac', {
          discovers: 'clue_far',
          score: { DELIL_ANALIZI: 150 },
          feedback: found(
            'YENİ İPUCU',
            'Sol ön tamponda sürtünme. Farlar sağlam. Tek hasar bu.',
            '+150 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_T_TANIK', 'mag', 't_tanik', {
          discovers: 'clue_necati_yer',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'YENİ İPUCU',
            'Taksi Çınarlı’dan çıkışta, ilk sırada, kendi ışığında bekliyormuş. Yani kavşağa dik.',
            '+100 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_T_HAVA', 'mag', 't_hava', {
          discovers: 'clue_yagmur',
          feedback: found(
            'NOT',
            'Yağmur. Herkes için yağıyordu. Bunu savcı da kullanır, ben de.',
            'Not defterine eklendi',
          ),
        }),
      ],
      miss: missExam('FB_TUTANAK'),
      finish: { id: 'TUTANAK_BITIR' },
    }),
    documentExam('INV_OTOPSI', {
      ...INV,
      title: 'Otopsi Ön Raporu',
      background: 'buro',
      hud: ['otopsi_left'],
      lines: says(
        N(
          'Otopsi raporlarını okumak için bir yöntemim var: önce ad, sonra yaş, sonra hiç durmadan sona kadar. Durursam bir insanı okuduğumu hatırlıyorum.',
        ),
        N('Hatice Durmaz, 54. Durmadım.'),
        N(
          'Raporun ekinde fotoğraflar. Bej bir mont, bir ayakkabı, bir hastane kartı: “H. DURMAZ · TEMİZLİK · KAT 3.” Kartın kenarı kırılmış.',
        ),
        T(
          'Ölüm sebebi tek satır. Ama bir ölüm birden çok yarayla gelir. Hangi yaranın nereden geldiğini rapor söylemiyor; ben soracağım.',
        ),
      ),
      header: { left: 'OTOPSİ ÖN RAPORU · H. DURMAZ', right: '14.11 · ADLİ TIP ŞUBE' },
      columns: [
        { label: 'BÖLGE', flex: 1 },
        { label: 'BULGU', flex: 2.6 },
      ],
      rows: [
        row('o_olum', ['Ölüm sebebi', 'Kafa travmasına bağlı beyin kanaması']),
        row('o_bacak', ['Sağ alt bacak', 'Tibia kırığı; topuktan 56 cm yükseklikte']),
        row('o_sirt', ['Sırt ve omuz', 'Sürüklenme sıyrıkları; kanama az']),
        row('o_mont', ['Giysi', 'Bej mont; sağ yanda yabancı boya parçası (emanette)']),
        row('o_kan', ['Kan', 'Alkol ve uyuşturucu negatif']),
      ],
      tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
      costVar: 'otopsi_left',
      rules: [
        examine('EX_O_BACAK', 'mag', 'o_bacak', {
          discovers: 'clue_kirik56',
          score: { DELIL_ANALIZI: 150 },
          feedback: found(
            'YENİ İPUCU',
            'Elli altı santim. Ayakta duran bir insanın bacağına çarpan şeyin yüksekliği.',
            '+150 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_O_SIRT', 'cmp', 'o_sirt', {
          discovers: 'clue_sirt',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'YENİ İPUCU',
            'Sıyrıklar sırtta ve omuzda; kanama az. Kafadaki travmayla aynı anda mı oldular, sonra mı? Rapor söylemiyor.',
            '+100 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_O_MONT', 'mag', 'o_mont', {
          discovers: 'clue_boya',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'YENİ İPUCU',
            'Ekteki fotoğrafta tırnak büyüklüğünde, koyu yeşil, metalik bir boya parçası. Volkan’ın arabası beyaz.',
            '+100 SKOR · Not defterine eklendi',
          ),
        }),
      ],
      miss: missExam('FB_OTOPSI'),
      finish: { id: 'OTOPSI_BITIR' },
    }),
    documentExam('INV_BUFE', {
      ...INV,
      title: 'Büfe kamerası kaydı',
      background: 'kafe',
      hud: ['bufe_left'],
      lines: says(
        N('Görüntü bulanık, siyah beyaz, köşede bir saat. Yağmur damlaları lensin üstünde büyüyüp akıyor.'),
        N('“Kare kare” ile bir anı dondur; “oynat” ile akışı izle.'),
        T(
          'Kamera saatinin ileri olduğunu Sevim Hanım söyledi. Ne kadar ileri? Bunu bilmeden bu kayıt bir saat değil, bir tahmindir.',
        ),
      ),
      header: { left: 'BÜFE KAMERASI · KANAL 2', right: 'KAMERA SAATİ' },
      columns: [
        { label: 'SAAT (KAMERA)', flex: 1.2 },
        { label: 'GÖRÜNTÜ', flex: 2.4 },
      ],
      rows: [
        row('b_titreme', ['01.05.12', 'Kavşak, yağmur'], {
          kare: { cells: ['01.05.12', 'Sokak lambaları bir an söner, yanar'], tone: 'special' },
        }),
        row('b_1830', ['01.18.30', 'Boş yol']),
        row('b_1841', ['01.18.41', 'Farlar, hareket'], {
          kare: { cells: ['01.18.41', 'Koyu renkli hafif ticari araç; fren; sağ stop yanmıyor'], tone: 'special' },
        }),
        row('b_1848', ['01.18.48', 'Farlar, hareket'], {
          kare: { cells: ['01.18.48', 'Beyaz sedan; fren lambaları; duruyor'], tone: 'info' },
        }),
        row('b_1900', ['01.19.00', 'Bir adam koşuyor']),
      ],
      tools: [tool('oynat', 'Oynat', 'camera'), tool('kare', 'Kare kare', 'magnifier')],
      costVar: 'bufe_left',
      rules: [
        examine('EX_B_TITREME', 'kare', 'b_titreme', {
          discovers: 'clue_titreme',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'YENİ İPUCU',
            'Bütün sokak lambaları aynı anda söner, bir saniye sonra yanar. Kameranın saati 01.05.12 diyor.',
            '+100 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_B_1841', 'kare', 'b_1841', {
          discovers: 'clue_tek_stop',
          score: { DELIL_ANALIZI: 150 },
          feedback: found(
            'YENİ İPUCU',
            'Kare kare: kutu gibi bir gövde, koyu renk. Fren yapıyor; sol stop yanıyor, sağ stop karanlık.',
            '+150 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_B_1848', 'kare', 'b_1848', {
          score: { DELIL_ANALIZI: 50 },
          effects: [raise('bufe_volkan')],
          feedback: found(
            'BULGU',
            'Volkan’ın beyaz arabası. Yedi saniye sonra. Fren lambaları yanıyor, duruyor.',
            '+50 SKOR · Bulgu',
          ),
        }),
      ],
      miss: missExam('FB_BUFE'),
      finish: { id: 'BUFE_BITIR' },
    }),
    documentExam('INV_SINYAL', {
      ...INV,
      title: 'Denetleyici olay günlüğü',
      background: 'buro',
      hud: ['sinyal_left'],
      lines: says(
        N(
          'Belediyenin cevabı: bir üst yazı, iki sayfa makine dökümü, bir Beyaz Masa çıktısı. Üst yazıda “herhangi bir arızaya rastlanmamıştır” yazıyor.',
        ),
        T('Üst yazılar özettir. Özetler, yazanın görmek istediğini özetler.'),
        N(
          'Döküm bir makinenin dilinde: saatler, kodlar, büyük harfler. Kodların anlamı ekteki bir tabloda; tablo, kimse okumasın diye en sona konmuş gibi.',
        ),
      ),
      header: { left: 'KAVŞAK 112 · GÖKDERE–ÇINARLI', right: 'OLAY GÜNLÜĞÜ' },
      columns: [
        { label: 'ZAMAN', flex: 1.1 },
        { label: 'KAYIT', flex: 2.6 },
      ],
      rows: [
        row('s_ihbar', ['09.11 19.40', 'Beyaz Masa: “yaya ve araç yeşili birlikte yanıyor”']),
        row('s_isemri', ['10.11 09.15', 'İş emri 4471 · ERTELENDİ (malzeme)']),
        row('s_restart', ['14.11 00.58.12', 'GÜÇ KESİNTİSİ · YENİDEN BAŞLATMA']),
        row('s_cakisma', ['14.11 00.58.40', 'UYARI 07 · BASTIRILDI']),
        row('s_kart', ['15.11 10.30', 'Kart değişimi · rutin bakım']),
      ],
      tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
      costVar: 'sinyal_left',
      rules: [
        examine('EX_S_ISEMRI', 'mag', 's_isemri', {
          discovers: 'clue_is_emri',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'YENİ İPUCU',
            'Kazadan dört gün önce açılmış iş emri. Konu: “Gökdere–Çınarlı çatışma kartı.” Durum: ertelendi.',
            '+100 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_S_CAKISMA', 'mag', 's_cakisma', {
          score: { DELIL_ANALIZI: 150 },
          effects: [raise('sinyal_cakisma')],
          feedback: found(
            'UYARI 07',
            'Kodlar listesine baktım: UYARI 07 “çatışan yeşil”. Yani yaya ve araç yeşilinin birlikte yanması. Bastırılmış; makine uyarmış, biri susturmuş.',
            '+150 SKOR · Bulgu',
          ),
        }),
        examine('EX_S_KART', 'cmp', 's_kart', {
          score: { DELIL_ANALIZI: 50 },
          effects: [raise('sinyal_kart')],
          feedback: found(
            '“RUTİN”',
            'Rutin bakım takvimi altı ayda bir. Son bakım eylülde. Bu kart değişimi rutin değil; kazanın ertesi günü.',
            '+50 SKOR · Bulgu',
          ),
        }),
      ],
      miss: missExam('FB_SINYAL'),
      finish: { id: 'SINYAL_BITIR' },
    }),

    // --- Delil dilekçesi ---
    choiceNode('INV_DIL', {
      ...INV,
      title: 'Delil dilekçesi (CMK 177)',
      background: 'buro',
      hud: ['slots'],
      prompt:
        'Mahkemeye savunma delillerinin toplanması için dilekçe. Üç talep hakkın var; her talebin hangi olayı ispatlayacağını yazmalısın.',
      choices: [
        option('DIL_SINYAL', 'Belediyeden kavşak denetleyici kayıtları ve ihbar dökümü', {
          cost: [{ var: 'slots', amount: 1 }],
          score: { USUL_BILGISI: 40 },
          effects: [raise('dil_sinyal')],
          good: 'Işığın o gece ne yaktığını kâğıttaki plan değil, denetleyicinin kaydı gösterir.',
          next: '$stay',
        }),
        option('DIL_UEDAS', 'UEDAŞ’tan 14 Kasım gece gerilim/kesinti kaydı', {
          cost: [{ var: 'slots', amount: 1 }],
          score: { USUL_BILGISI: 30 },
          effects: [raise('dil_uedas')],
          visibleWhen: any(has('clue_titreme'), has('clue_bufe_kamera'), has('ev_bufe')),
          good: 'Kesin saatli bir şebeke kaydı, saati yanlış bir kamerayı düzeltmenin tek yoludur.',
          next: '$stay',
        }),
        option('DIL_EDR', 'Aracın hava yastığı modülündeki olay verisinin (EDR) bilirkişice okunması', {
          cost: [{ var: 'slots', amount: 1 }],
          score: { USUL_BILGISI: 40 },
          effects: [raise('dil_edr')],
          good: 'EDR çarpışma öncesi hız ve fren verisini saklar; 68 km/s iddiasını doğrudan sınar.',
          next: '$stay',
        }),
        option('DIL_BOYA', 'Montta bulunan boya parçasının kriminal incelemesi', {
          cost: [{ var: 'slots', amount: 1 }],
          score: { USUL_BILGISI: 40 },
          effects: [raise('dil_boya')],
          visibleWhen: has('clue_boya'),
          good: 'Emanetteki incelenmemiş bir delil: boyanın hangi araca ait olduğu sorusu.',
          next: '$stay',
        }),
        option('DIL_ATK', 'Adli Tıp Kurumu Trafik İhtisas Dairesinden yaralanma mekanizması raporu', {
          cost: [{ var: 'slots', amount: 1 }],
          score: { USUL_BILGISI: 40 },
          effects: [raise('dil_atk')],
          good: 'Hangi yaralanmanın hangi temastan doğduğunu ve ölüme hangisinin yol açtığını uzman kurum söyler.',
          next: '$stay',
        }),
        option('DIL_SABIKA', 'Maktulün sağlık kayıtları ve geçmiş kaza dosyaları', {
          cost: [{ var: 'slots', amount: 1 }],
          score: { USUL_BILGISI: -30 },
          bad: 'İspatlanacak olayla ilgisi olmayan, maktulü suçlamaya dönük bir talep; reddedilir (CMK 206/2-b).',
          next: '$stay',
        }),
        option('DIL_KESIF', 'Kavşakta gündüz keşif', {
          cost: [{ var: 'slots', amount: 1 }],
          neutral:
            'Gündüz keşfi gecenin ışığını, yağmurunu ve o geceki arızayı göstermez; yine de mahkeme bir gün keşif isteyebilir.',
          next: '$stay',
        }),
        cont('DIL_VER', 'Dilekçeyi ver', '$return', {
          role: 'PRIMARY',
          effects: [raise('dil_verildi')],
          responses: says(
            N('Dilekçeyi UYAP’tan gönderdim. Kurumlara müzekkere yazılması için hâkimin önüne düşecek.'),
            T(
              'Kâğıt gitti. Şimdi kâğıtların cevap vermesini bekleyeceğim. Kâğıtlar insanlardan yavaştır ama daha az yalan söyler.',
            ),
          ),
        }),
      ],
    }),

    // --- Çıkarım tahtası ---
    deductionBoard('INV_CIKARIM', {
      ...INV,
      title: 'Çıkarım tahtası',
      background: 'buro_gece',
      lines: says(N('İki kartı seç. Birbirini açıklıyorsa duruşmada kullanabileceğin bir çıkarım doğar.')),
      pool: invPool,
      recipes: baseRecipes('CB_'),
      miss: boardMiss('FB_CIKARIM'),
      finish: { id: 'CIKARIM_BITIR' },
    }),
  ],
};
