import {
  discover,
  documentExam,
  examine,
  fallback,
  has,
  ifThen,
  not,
  row,
  score,
  tool,
} from '../../../tools/content/src/kit/index.js';
import type { ChoiceDef, NodeDef } from '../../../tools/content/src/kit/index.js';
import { B } from './lib.js';
import { INV } from './shared.js';

// 1. evre belge incelemeleri: sahte suret, tapu senedi, grafolog raporu, irsaliye klasörü.

const miss = (id: string): ChoiceDef =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: { title: 'SONUÇ YOK', text: 'Bu aletle burada bir şey görünmüyor.', label: '−20 SKOR', tone: 'error' },
  });

const found = (title: string, text: string, label = '+150 SKOR · Not defterine eklendi') => ({
  title,
  text,
  label,
  tone: 'special' as const,
});

const suret = documentExam('INV_SURET', {
  ...INV,
  title: 'Vekâletname sureti',
  hud: ['ex_suret'],
  background: 'buro_gece',
  lines: B(`
C#buro_gece: ARSLAN HUKUK — GECE
N: Tapuya verilen suretin dosyadaki renkli fotokopisi değil; adliye emanetinden mahkeme izniyle getirilen aslı. Şeffaf bir poşetin içinde, iki sayfa.
T: Bir kâğıdın sahte olduğunu anlamak için ona inanmayı bırakmak gerekir. Sonra yavaşça, satır satır, yeniden inanmaya çalışmak.
N: Bir alet seç, sonra şüpheli satıra dokun. Her deneme bir hak yer.
`),
  header: { left: 'BURSA 14. NOTERLİĞİ · VEKÂLETNAME SURETİ', right: 'YEV. 08817' },
  columns: [
    { label: 'SATIR', flex: 1 },
    { label: 'İÇERİK', flex: 2 },
  ],
  rows: [
    row('baslik', ['Başlık', 'Bursa 14. Noterliği · 10.05.2023 · yevmiye 08817']),
    row('taraf', ['Vekâlet veren / vekil', 'Hayriye Ateş → Vedat Ateş']),
    row('yetki1', ['Yetkiler (1)', 'Bankalar, emekli maaşı, kira tahsili, abonelikler']),
    row('yetki2', ['Yetkiler (2)', 'Hisar Mah. 412 ada 9 parseldeki taşınmazı dilediği bedelle satmaya']),
    row('muhur', ['Noter mührü ve imza', 'Yuvarlak mühür, mavi; imza']),
    row('sert', ['Onay şerhi', '“Aslı gibidir” · 12.02.2026']),
    row('kagit', ['Kâğıt', 'Beyaz, 90 gr']),
  ],
  tools: [
    tool('mag', 'Büyüteç', 'magnifier'),
    tool('uv', 'UV ışık', 'uv', 'UV'),
    tool('compare', 'Karşılaştır', 'compare'),
  ],
  costVar: 'ex_suret',
  rules: [
    examine('EX_S_MUHUR', 'mag', 'muhur', {
      discovers: 'clue_toner_muhur',
      score: { DELIL_ANALIZI: 150 },
      feedback: found(
        'YENİ İPUCU · MÜHÜR',
        'Mühür ve imza büyüteç altında binlerce küçük noktaya ayrılıyor: toner. Islak mürekkep kâğıda işler, kenarları dağılır; burada kenarlar keskin. Mühür basılmış.',
      ),
      responses: B(`
T: Bir mühür, bir makineden çıkmış. Noterin elinden değil.
`),
    }),
    examine('EX_S_KAGIT', 'uv', 'kagit', {
      discovers: 'clue_kagit',
      score: { DELIL_ANALIZI: 100 },
      feedback: found(
        'YENİ İPUCU · KÂĞIT',
        'UV ışıkta kâğıt sönük ve düz. Ne parlayan lif var ne filigran ne seri numarası. Sıradan bir fotokopi kâğıdı; 90 gram.',
        '+100 SKOR · Not defterine eklendi',
      ),
    }),
    examine('EX_S_YETKI', 'compare', 'yetki2', {
      discovers: 'clue_ekli_satir',
      score: { DELIL_ANALIZI: 100 },
      feedback: found(
        'YENİ İPUCU · SATIR',
        'Satış yetkisi satırının harfleri öteki satırlardan biraz daha sıkışık; “a” harfinin kuyruğu farklı. Sanki satır sonradan, başka bir yazı tipiyle araya sıkıştırılmış.',
        '+100 SKOR · Not defterine eklendi',
      ),
    }),
    examine('EX_S_SERT', 'mag', 'sert', {
      score: { DELIL_ANALIZI: 20 },
      feedback: {
        title: 'TARİH',
        text: 'Onay şerhinin tarihi 12 Şubat. Satıştan altı gün önce. Kâğıt aceleyle hazırlanmış bir işin parçası gibi.',
        label: '+20 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: miss('FB_SURET'),
  finish: { id: 'SURET_BITIR' },
});

const senet = documentExam('INV_SENET', {
  ...INV,
  title: 'Tapu resmî senedi',
  hud: ['ex_senet'],
  background: 'buro',
  lines: B(`
C#buro: ARSLAN HUKUK — SABAH
N: Senedin onaylı örneği. Fotoğraf, kimlik bilgileri, bedel, imzalar. Altında sistemin bastığı küçük zaman damgaları.
T: Resmî senet, devletin bir anı dondurmasıdır. 18 Şubat, 11.24. O anda o masada kim vardı? Senet biliyor; sormayı bilene söyler.
`),
  header: { left: 'OSMANGAZİ TAPU MÜDÜRLÜĞÜ · RESMÎ SENET', right: '412/9 · 18.02.2026' },
  columns: [
    { label: 'SATIR', flex: 1 },
    { label: 'İÇERİK', flex: 2 },
  ],
  rows: [
    row('satici', ['Satıcı', 'Hayriye Ateş · vekili Vedat Ateş']),
    row('alici', ['Alıcı', 'Erol Kılınç']),
    row('bedel', ['Bedel', '1.600.000 TL · “nakden ve tamamen alındı”']),
    row('foto', ['Fotoğraf', 'Vekil · kepli, gözlüklü']),
    row('imza', ['Vekil imzası', '“V. Ateş” · mavi tükenmez']),
    row('zaman', ['Zaman damgası', 'Fotoğraf 11.22.08 · onay 11.24.51']),
    row('memur', ['Düzenleyen', 'Gülten Yazıcı, tapu memuru']),
  ],
  tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Karşılaştır', 'compare')],
  costVar: 'ex_senet',
  rules: [
    examine('EX_N_IMZA', 'mag', 'imza', {
      discovers: 'clue_sivanma',
      score: { DELIL_ANALIZI: 150 },
      feedback: found(
        'YENİ İPUCU · MÜREKKEP',
        'Vekil imzasının son harflerinde mürekkep sağa doğru sürüklenmiş; ince bir gölge gibi. Soldan sağa yazan el, yazdığı satırın üstünden geçmiş.',
      ),
      responses: B(`
T: Sağ elle yazan biri yazdığı yeri arkasında bırakır. Mürekkebin üstünden geçen el, genellikle sol eldir.
`),
    }),
    examine('EX_N_ZAMAN', 'mag', 'zaman', {
      discovers: 'clue_senet_saat',
      score: { DELIL_ANALIZI: 100 },
      feedback: found(
        'YENİ İPUCU · SAAT',
        'Fotoğraf 11.22.08’de, onay 11.24.51’de. İki dakika kırk üç saniye. Bir adam o saatte o gişedeydi.',
        '+100 SKOR · Not defterine eklendi',
      ),
    }),
    examine('EX_N_FOTO', 'compare', 'foto', {
      discovers: 'clue_foto_kapali',
      score: { DELIL_ANALIZI: 100 },
      feedback: found(
        'YENİ İPUCU · YÜZ',
        'Fotoğrafı kimlikteki fotoğrafla karşılaştırınca: kep siperi alnı, koyu camlar gözleri, atkı çeneyi örtüyor. Görünen yalnızca bir burun ve bir ağız.',
        '+100 SKOR · Not defterine eklendi',
      ),
    }),
    examine('EX_N_BEDEL', 'compare', 'bedel', {
      score: { DELIL_ANALIZI: 20 },
      feedback: {
        title: 'BEDEL',
        text: 'Hisar’da benzer evler üç buçuk milyona satılıyor. Bu ev bir milyon altı yüz bine, “nakden” gitmiş. Ya alıcı şanslı ya da para hiç el değiştirmemiş.',
        label: '+20 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: miss('FB_SENET'),
  finish: { id: 'SENET_BITIR' },
});

const rapor = documentExam('INV_RAPOR', {
  ...INV,
  title: 'Grafolog raporu',
  hud: ['ex_rapor'],
  background: 'buro',
  lines: B(`
C#buro: ARSLAN HUKUK — LEYLA’NIN MASASI
N: On iki sayfa. Büyütülmüş imza fotoğrafları, oklar, açı ölçümleri. Son sayfada tek cümle, kalın harflerle: “AYNI ELİN ÜRÜNÜDÜR.”
leyla: Raporu sonuç cümlesinden okuma. Ekinden oku. Bilirkişi ne kadar iyi olursa olsun, önüne konan kâğıt kadar iyidir.
leyla: Bir de şu: bilirkişi, savcının sorduğu soruya cevap verir. Savcı “bu imzalar aynı elden mi” diye sormuş. “Bu imza sanığın mı” diye sormamış. Fark ince; ama ceza bu incelikte yaşar.
T: Doğru bir cevap, yanlış bir soruya. Raporun eklerini önüme çektim.
`),
  header: { left: 'GRAFOLOJİ RAPORU · Ö. FARUK DEMİRTAŞ', right: '02.04.2026' },
  columns: [
    { label: 'BÖLÜM', flex: 1 },
    { label: 'İÇERİK', flex: 2 },
  ],
  rows: [
    row('konu', ['İnceleme konusu', 'Tapu senedindeki “V. Ateş” imzası']),
    row('mukayese', ['Mukayese belgeleri', '14 sevk irsaliyesi + 6 kargo fişi (Ateş Matbaası)']),
    row('yontem', ['Yöntem', 'Morfolojik ve dinamik karşılaştırma, 20 örnek']),
    row('sonuc', ['Sonuç', 'Senetteki imza mukayese imzalarıyla aynı elin ürünüdür']),
    row('tutanak', ['Ek-3 · Teslim tutanağı', 'Kolluk · 20.03.2026 · faks kopyası']),
  ],
  tools: [
    tool('mag', 'Büyüteç', 'magnifier'),
    tool('compare', 'Karşılaştır', 'compare'),
    tool('law', 'Mevzuat', 'check'),
  ],
  costVar: 'ex_rapor',
  rules: [
    examine('EX_R_MUKAYESE', 'law', 'mukayese', {
      discovers: 'clue_mukayese_ozel',
      score: { DELIL_ANALIZI: 150 },
      feedback: found(
        'YENİ İPUCU · MUKAYESE',
        'Yirmi belgenin hepsi özel belge: irsaliye ve kargo fişi. Hiçbiri noterde, bankada, nüfusta, bir memurun önünde atılmamış; sanık bu imzaları kabul de etmemiş. Kimin attığı belli değil.',
      ),
      responses: B(`
T: Bilirkişi bir imzayı, kimin attığı belli olmayan yirmi imzayla karşılaştırmış. Aynı el. Kimin eli?
`),
    }),
    examine('EX_R_TUTANAK', 'mag', 'tutanak', {
      discovers: 'clue_tutanak_ad',
      score: { DELIL_ANALIZI: 100 },
      feedback: found(
        'YENİ İPUCU · TESLİM',
        'Faks kopyası. “Teslim eden” satırında bir imza ve silik bir soyadı: “… Ateş”. Ad okunmuyor. Bu belgeleri kolluğa kim verdi?',
        '+100 SKOR · Not defterine eklendi',
      ),
    }),
    examine('EX_R_SONUC', 'compare', 'sonuc', {
      score: { DELIL_ANALIZI: 20 },
      feedback: {
        title: 'SONUÇ',
        text: 'Rapor “aynı el” diyor; “Vedat Ateş’in eli” demiyor. Bilirkişi dürüst davranmış. Ama savcı iki cümlenin arasındaki boşluğu fark etmemiş.',
        label: '+20 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: miss('FB_RAPOR'),
  finish: { id: 'RAPOR_BITIR' },
});

const irsaliye = documentExam('INV_IRSALIYE', {
  ...INV,
  title: 'İrsaliye klasörü',
  hud: ['ex_irs'],
  background: 'depo',
  lines: B(`
C#depo: ATEŞ MATBAASI — ARKA ODA
N: Matbaadaki irsaliye klasörünün kalan nüshaları. Polisin aldıklarının karbon kopyaları da arada. Her birinin altında “V. Ateş”.
T: Aynı ad, yüzlerce kez. Bir ad bir imza değildir. İmza bir elin alışkanlığıdır; ad, bir kimliğin.
`),
  header: { left: 'ATEŞ MATBAASI · SEVK İRSALİYELERİ (KARBON)', right: 'OCAK–MART 2026' },
  columns: [
    { label: 'TARİH', flex: 1 },
    { label: 'MÜŞTERİ', flex: 1.4 },
    { label: 'İMZA', flex: 1.4 },
  ],
  rows: [
    row('i1', ['08.01', 'Çekirge Termal Otel', 'Akıcı, sağa yatık']),
    row('i2', ['15.01', 'Kayhan Esnaf Odası', 'Yavaş, kalın, sola yatık']),
    row('i3', ['22.01', 'Nilüfer Kırtasiye', 'Yavaş, kalın, sola yatık']),
    row('i4', ['03.02', 'Bursa Spor Kulübü', 'Akıcı, sağa yatık']),
    row('i5', ['12.02', 'Osmangazi Belediyesi', 'Yavaş, kalın, sola yatık']),
    row('i6', ['27.02', 'Mudanya Balıkçılar Koop.', 'Yavaş, kalın, sola yatık']),
  ],
  tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Karşılaştır', 'compare')],
  costVar: 'ex_irs',
  rules: [
    examine('EX_I_IKI', 'compare', 'i2', {
      effects: [ifThen(not(has('clue_iki_el')), [discover('clue_iki_el'), score('DELIL_ANALIZI', 150)])],
      feedback: found(
        'YENİ İPUCU · İKİ EL',
        'Yan yana koyunca açık: “V. Ateş” imzaları iki gruba ayrılıyor. Az sayıdaki akıcı ve sağa yatık; çoğunluk yavaş, kalın, harfleri sola yatık. İki ayrı el.',
      ),
      responses: B(`
T: Bir dükkân, iki el. Polise hangileri verildi? Karbonlara bakınca anlaşılıyor: çoğunlukla ikinci grup.
`),
    }),
    examine('EX_I_IKI2', 'compare', 'i5', {
      effects: [ifThen(not(has('clue_iki_el')), [discover('clue_iki_el'), score('DELIL_ANALIZI', 150)])],
      feedback: found(
        'YENİ İPUCU · İKİ EL',
        'Osmangazi Belediyesi irsaliyesini Çekirge Termal’inkiyle yan yana koyunca: iki ayrı el. Biri akıcı ve sağa yatık; öbürü yavaş, kalın, sola yatık.',
      ),
    }),
    examine('EX_I_MAG', 'mag', 'i1', {
      score: { DELIL_ANALIZI: 20 },
      feedback: {
        title: 'AKICI İMZA',
        text: 'Tek hamlede bir “V”, sona doğru sağa kıvrılan bir kuyruk. Bu imzayı bir yerde görmüştüm.',
        label: '+20 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: miss('FB_IRSALIYE'),
  finish: { id: 'IRSALIYE_BITIR' },
});

export const docNodes: NodeDef[] = [suret, senet, rapor, irsaliye];
