import {
  any,
  back,
  cont,
  deductionBoard,
  discover,
  documentExam,
  examine,
  fallback,
  flag,
  flags,
  has,
  ifThen,
  not,
  option,
  raise,
  recipe,
  row,
  score,
  story,
  tool,
} from '../../../tools/content/src/kit/index.js';
import type { ChoiceDef, CasePart, Effect } from '../../../tools/content/src/kit/index.js';
import { B, O, W } from './dsl.js';
import { INV } from './shared.js';

// 56-investigation-arsiv: iptal kayıtları, turnike dökümü, teslim tutanakları (karbonla karşılaştırma), banka ve
// tapu, delil dilekçesi (CMK 177) ve çıkarım tahtası.

/** Tahtada bir çıkarımı yalnızca ilk kurulumda ödüllendirir. */
export const firstTime = (ded: string, amount = 300): Effect[] => [
  ifThen(not(has(ded)), [discover(ded), score('DELIL_ANALIZI', amount)]),
];

export const feedbackNew = (title: string, text: string, label = 'YENİ DELİL · +300 SKOR') => ({
  title,
  text,
  label,
  tone: 'success' as const,
});

const miss = (id: string) =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle bu satırda bir şey görünmüyor.',
      label: '−20 SKOR',
      tone: 'error',
    },
  });

// --- İptal kayıtları ---

const terminalFb = {
  title: 'YENİ İPUCU · TERMİNAL',
  text: 'Kırk yedi satırın kırk yedisinde terminal aynı: MHM-PC03. Orhan’ın veznesindeki bilgisayar VZ-02. İptallerin hiçbiri vezne camının arkasından yapılmamış.',
  label: '+150 SKOR · Not defterine eklendi',
  tone: 'special' as const,
};
const saatFb = {
  title: 'YENİ İPUCU · SAAT',
  text: 'Vezne 17.00’de kapanıyor. İptallerin en erkeni 17.38, en geçi 17.56. Hiçbiri mesai içinde değil.',
  label: '+150 SKOR · Not defterine eklendi',
  tone: 'success' as const,
};

const log = documentExam('INV_LOG', {
  ...INV,
  title: 'İptal kayıtları',
  hud: ['ex_log'],
  background: 'buro_gece',
  lines: B(`
# ARSLAN HUKUK — GECE [bg:buro_gece]
> Döküm otuz bir sayfa. Teftiş raporu bunu iki sütuna indirmiş: kullanıcı ve tutar. Ben altı sütunun hepsini açtım.
~ Rakamlardan korkarım. Leyla bilir; o yüzden bu dosyayı bana verdi. Korktuğun şeye bakmanın tek yolu, satır satır bakmaktır.
~ Bir alet seç, sonra şüpheli satıra dokun. Doğru alet, doğru yer: yeni bir ipucu.
`),
  header: { left: 'VEZNE PROGRAMI · İŞLEM GÜNLÜĞÜ · İPTALLER', right: '03.11.2025 – 27.02.2026' },
  columns: [
    { label: 'TARİH', flex: 0.9 },
    { label: 'SAAT', flex: 0.7 },
    { label: 'KULLANICI', flex: 0.9 },
    { label: 'TERMİNAL', flex: 1 },
    { label: 'TUTAR', flex: 0.8 },
    { label: 'AÇIKLAMA', flex: 1.3 },
  ],
  rows: [
    row('r03', ['03.11', '17.41', 'okilic', 'MHM-PC03', '8.400', 'mükerrer tahsilat']),
    row('r21', ['21.11', '17.52', 'okilic', 'MHM-PC03', '9.950', 'mükerrer tahsilat']),
    row('r09', ['09.01', '17.46', 'okilic', 'MHM-PC03', '9.150', 'mükerrer tahsilat']),
    row('r14', ['14.01', '17.44', 'okilic', 'MHM-PC03', '7.900', 'mükerrer tahsilat']),
    row('r12', ['12.02', '17.47', 'okilic', 'MHM-PC03', '6.850', 'mükerrer tahsilat']),
    row('r27', ['27.02', '17.56', 'okilic', 'MHM-PC03', '9.700', 'mükerrer tahsilat']),
    row('rtop', ['TOPLAM', '23 gün', '47 iptal', '—', '386.400', '—']),
  ],
  tools: [
    tool('mag', 'Büyüteç', 'magnifier'),
    tool('vz', 'Vezne terminalleriyle karşılaştır', 'compare'),
    tool('mesai', 'Mesai saatiyle karşılaştır', 'check'),
  ],
  costVar: 'ex_log',
  rules: [
    examine('EX_LOG_TERM', 'vz', 'r21', {
      effects: [ifThen(not(has('clue_terminal')), [discover('clue_terminal'), score('DELIL_ANALIZI', 150)])],
      feedback: terminalFb,
    }),
    examine('EX_LOG_TERM2', 'vz', 'r03', {
      effects: [ifThen(not(has('clue_terminal')), [discover('clue_terminal'), score('DELIL_ANALIZI', 150)])],
      feedback: terminalFb,
    }),
    examine('EX_LOG_SAAT', 'mesai', 'r27', {
      effects: [ifThen(not(has('clue_saat')), [discover('clue_saat'), score('DELIL_ANALIZI', 150)])],
      feedback: saatFb,
    }),
    examine('EX_LOG_SAAT2', 'mesai', 'r03', {
      effects: [ifThen(not(has('clue_saat')), [discover('clue_saat'), score('DELIL_ANALIZI', 150)])],
      feedback: saatFb,
    }),
    examine('EX_LOG_9', 'mag', 'r09', {
      score: { DELIL_ANALIZI: 40 },
      effects: [raise('fact_9ocak_log')],
      feedback: {
        title: '9 OCAK, CUMA',
        text: 'Bir cuma akşamı, 17.46’da iki iptal; toplam 18.300 TL. Satırın yanında kimse bir not düşmemiş.',
        label: '+40 SKOR',
        tone: 'neutral',
      },
    }),
    examine('EX_LOG_TOP', 'mag', 'rtop', {
      score: { DELIL_ANALIZI: 40 },
      effects: [raise('fact_10bin')],
      feedback: {
        title: 'HEPSİ 10.000 TL ALTINDA',
        text: 'Kırk yedi iptalin hiçbiri on bin lirayı geçmiyor. En büyüğü 9.950. Biri bir sınırı biliyor; o sınırın altında kalıyor.',
        label: '+40 SKOR',
        tone: 'neutral',
      },
    }),
    examine('EX_LOG_12', 'mag', 'r12', {
      score: { DELIL_ANALIZI: 20 },
      feedback: {
        title: 'MAKBUZ 0027719',
        text: '12 Şubat, 17.47. Altı bin sekiz yüz elli lira: Hayri Bey’in makbuzu. İki dakika sonra 1.550 liralık bir iptal daha. Bu dosyayı açan akşam.',
        label: '+20 SKOR',
        tone: 'neutral',
      },
    }),
    examine('EX_LOG_ACIK', 'mag', 'r21', {
      score: { DELIL_ANALIZI: 10 },
      feedback: {
        title: '“MÜKERRER TAHSİLAT”',
        text: 'Her iptalin açıklaması aynı. Savcılık buna “hileli davranış” diyor: iptali gerekçeli göstermek. Kimin yazdığını söylemiyor.',
        label: '+10 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: miss('FB_LOG'),
  finish: { id: 'LOG_BITIR' },
});

// --- Turnike dökümü ---

const pdks = documentExam('INV_PDKS', {
  ...INV,
  title: 'Orhan’ın turnike dökümü',
  hud: ['ex_pdks'],
  background: 'buro',
  lines: B(`
> İnsan kaynaklarının çıktısı: bir sütunda giriş, bir sütunda çıkış. Orhan her satırın yanına kurşun kalemle küçük bir tik atmış; kendi dökümünü bile denetlemiş.
`),
  header: { left: 'PDKS · PERSONEL DEVAM KONTROL · O. KILIÇ', right: 'KASIM 2025 – ŞUBAT 2026' },
  columns: [
    { label: 'TARİH', flex: 1 },
    { label: 'GİRİŞ', flex: 0.8 },
    { label: 'ÇIKIŞ', flex: 0.8 },
    { label: 'NOT', flex: 1.4 },
  ],
  rows: [
    row('p03', ['03.11 Pzt', '08.21', '17.04', '—']),
    row('p21', ['21.11 Cum', '08.18', '17.07', '—']),
    row('p09', ['09.01 Cum', '—', '—', 'YILLIK İZİN (1 gün)']),
    row('p14', ['14.01 Çar', '08.33', '17.06', '—']),
    row('p12', ['12.02 Per', '08.19', '17.03', '—']),
    row('p27', ['27.02 Cum', '08.24', '17.09', '—']),
    row('pozet', ['İptal günleri (23)', 'en erken 08.12', 'en geç 17.09', 'izin: 1 gün']),
  ],
  tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('log', 'İptal saatleriyle karşılaştır', 'compare')],
  costVar: 'ex_pdks',
  rules: [
    examine('EX_PDKS_CIKIS', 'log', 'pozet', {
      discovers: 'clue_cikis',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · ÇIKIŞ',
        text: 'İptal günlerinin yirmi üçünde de Orhan turnikeden en geç 17.09’da çıkmış. En erken iptal 17.38’de. Arada en az yirmi dokuz dakika ve bir turnike var.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_PDKS_IZIN', 'mag', 'p09', {
      discovers: 'clue_izin',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · İZİN',
        text: '9 Ocak: giriş yok, çıkış yok. “Yıllık izin.” Orhan o gün belediyeye hiç girmemiş.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_PDKS_IZIN2', 'log', 'p09', {
      effects: [ifThen(not(has('clue_izin')), [discover('clue_izin'), score('DELIL_ANALIZI', 150)])],
      feedback: {
        title: 'İZİNLİ GÜN',
        text: '9 Ocak’ta Orhan izinli. İptal kayıtlarında aynı akşam 17.46’da onun kullanıcısıyla iki iptal var.',
        label: 'Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_PDKS_12', 'log', 'p12', {
      score: { DELIL_ANALIZI: 40 },
      effects: [raise('fact_12subat')],
      feedback: {
        title: '12 ŞUBAT',
        text: '16.40’ta Hayri Bey’in parasını iki kez saydı. 17.03’te turnikeden çıktı. 17.47’de makbuz iptal edildi.',
        label: '+40 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: miss('FB_PDKS'),
  finish: { id: 'PDKS_BITIR' },
});

// --- Teslim tutanakları ---

const tutanak = documentExam('INV_TUTANAK', {
  ...INV,
  title: 'Teslim tutanakları',
  hud: ['ex_tut'],
  background: 'buro_gece',
  lines: B(`
> Dosyadaki beyaz asılları bir yana, Orhan’ın sarı karbonlarını öbür yana dizdim. Yirmi üç gün, iki yığın. İkisinin aynı olması gerekiyordu.
~ Önce 12 Şubat. Hayri Bey’in günü. Bir tarih seçince ötekiler de konuşmaya başlar.
`),
  header: { left: 'KASA TESLİM TUTANAĞI · 12.02.2026', right: 'ASIL ↔ KARBON' },
  columns: [
    { label: 'SATIR', flex: 1.1 },
    { label: 'DOSYADAKİ ASIL', flex: 1.3 },
    { label: 'KARBON KOPYA', flex: 1.3 },
  ],
  rows: [
    row('t_tutar', ['Teslim edilen tutar', '32.850,00 TL', '41.250,00 TL']),
    row('t_rapor', ['Ekli gün sonu raporu', 'basım saati 17.56', 'basım saati 16.58']),
    row('t_eden', ['Teslim eden', 'O. Kılıç (imza)', 'O. Kılıç (imza)'], {
      uv: { cells: ['Teslim eden', 'toner · kabartı yok', 'mürekkep · kalem izi var'], tone: 'special' },
    }),
    row('t_alan', ['Teslim alan', 'E. Tunalı (imza)', '— boş —']),
    row('t_torba', ['Torba sayısı', '3 mühürlü', '3 mühürlü']),
  ],
  tools: [
    tool('mag', 'Büyüteç', 'magnifier'),
    tool('compare', 'Nüshaları karşılaştır', 'compare'),
    tool('uv', 'Eğik ışık', 'uv', 'UV'),
  ],
  costVar: 'ex_tut',
  rules: [
    examine('EX_TUT_TUTAR', 'compare', 't_tutar', {
      discovers: 'clue_tutar_fark',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · TUTAR',
        text: 'Aynı tutanağın iki nüshası. Karbonda 41.250 TL, asılda 32.850 TL. Fark 8.400 TL: o akşam iptal edilen iki makbuzun toplamı. Asıl, iptallerden sonra yeniden düzenlenmiş.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_TUT_RAPOR', 'mag', 't_rapor', {
      discovers: 'clue_basim',
      score: { DELIL_ANALIZI: 100 },
      feedback: {
        title: 'YENİ İPUCU · BASIM SAATİ',
        text: 'Gün sonu raporlarının altındaki küçük satır: “Basım: 16.58” (Orhan’ın nüshası) ve “Basım: 17.56” (dosyadaki). Rapor, kasa teslim edildikten bir saat sonra yeniden basılmış.',
        label: '+100 SKOR · Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_TUT_IMZA', 'uv', 't_eden', {
      discovers: 'clue_imza_kopya',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · İMZA',
        text: 'Eğik ışıkta karbondaki imzanın altında kalemin bastırdığı oluk görünüyor. Asıldaki imzada oluk yok; çizgiler parlak ve düz. Mürekkep değil, toner. İmza yazılmamış, basılmış.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_TUT_ALAN', 'mag', 't_alan', {
      score: { DELIL_ANALIZI: 40 },
      effects: [raise('fact_imza_bos')],
      feedback: {
        title: 'TESLİM ALAN',
        text: 'Asılda teslim alan imzası var; Orhan’ın nüshasında yok. Teslim anında imzalanmamış. Ne zaman imzalandı?',
        label: '+40 SKOR',
        tone: 'neutral',
      },
    }),
    examine('EX_TUT_TORBA', 'mag', 't_torba', {
      score: { DELIL_ANALIZI: -10 },
      feedback: {
        title: 'ÜÇ TORBA',
        text: 'Torba sayısı iki nüshada da aynı. Mühürlü torba açılmaz; ama torbanın içine ne konduğunu tutanak söyler.',
        label: '−10 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: miss('FB_TUT'),
  finish: { id: 'TUT_BITIR' },
});

// --- Banka ve tapu ---

const banka = documentExam('INV_BANKA', {
  ...INV,
  title: 'Banka dökümü',
  hud: ['ex_banka'],
  background: 'buro',
  lines: B(`
> MASAK yazısının eki: Orhan Kılıç’ın maaş hesabının altı aylık dökümü. Savcılık bir satırı sarıyla boyamış. Ben bütün satırları okudum.
`),
  header: { left: 'BANKA HESAP DÖKÜMÜ · O. KILIÇ', right: 'TEMMUZ – ARALIK 2025' },
  columns: [
    { label: 'TARİH', flex: 0.9 },
    { label: 'AÇIKLAMA', flex: 2 },
    { label: 'TUTAR', flex: 0.9 },
  ],
  rows: [
    row('b_maas', ['15.11', 'Maaş · Hisarönü Belediyesi', '+38.400']),
    row('b_kart', ['Kasım–Aralık', 'Kart: market, eczane, servis', '−21.300']),
    row('b_havale', ['18.12 09.12', 'Gelen havale · İnegöl Noterliği emanet', '+215.000']),
    row('b_kredi', ['18.12 11.40', 'İhtiyaç kredisi erken kapama', '−212.000']),
    row('b_eczane', ['20.12', 'Eczane · kardiyoloji ilacı', '−2.140']),
  ],
  tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('tapu', 'Tapu senediyle karşılaştır', 'compare')],
  costVar: 'ex_banka',
  rules: [
    examine('EX_BNK_KREDI', 'mag', 'b_kredi', {
      discovers: 'clue_kredi',
      score: { DELIL_ANALIZI: 100 },
      feedback: {
        title: 'YENİ İPUCU · KREDİ',
        text: 'Savcılığın sarıyla boyadığı satır: 212.000 TL, tek ödeme, 18 Aralık 11.40. Bir satır yukarısına kimse bakmamış.',
        label: '+100 SKOR · Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_BNK_TAPU', 'tapu', 'b_havale', {
      enabledWhen: has('ev_tapu'),
      discovers: 'clue_tapu',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · TAPU',
        text: 'Tapu senedi: 17 Aralık, 215.000 TL. Ertesi sabah 09.12’de noter emanetinden aynı tutar hesaba girmiş; iki buçuk saat sonra kredi kapanmış.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_BNK_TAPU_YOK', 'tapu', 'b_havale', {
      feedback: {
        title: 'ELİNDE SENET YOK',
        text: 'Noter emanetinden gelen bir havale. Neyin bedeli olduğunu gösterecek belge elinde değil; Orhan’ın evrakına bakmalısın.',
        label: 'Bilgi',
        tone: 'neutral',
      },
      maxUses: 3,
    }),
    examine('EX_BNK_ECZ', 'mag', 'b_eczane', {
      score: { DELIL_ANALIZI: 10 },
      feedback: {
        title: 'İLAÇ',
        text: 'Kardiyoloji ilacı, her ay aynı gün. Bir babanın düzeni.',
        label: '+10 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: miss('FB_BANKA'),
  finish: { id: 'BANKA_BITIR' },
});

// --- Dilekçe ---

const slotCost = [{ var: 'slots', amount: 1 }];

const dil = story('INV_DIL', {
  ...INV,
  title: 'Delil dilekçesi',
  hud: ['slots'],
  background: 'buro',
  lines: [
    W(
      not(flag('dil_any')),
      `
# BÜRO — DİLEKÇE [bg:buro]
> Boş bir sayfa: “Bursa 6. Ağır Ceza Mahkemesi Başkanlığı’na.” İmleç yanıp sönüyor.
~ Üç talep. Mahkeme gereksiz talebi reddeder; her gereksiz talep, gerçek talebin ağırlığını eksiltir. Neyi ispat edeceğini yazamadığın şeyi isteme.
`,
    ),
    O(`
> Dilekçe uzuyor. Her talebin altına “ispat edilecek husus” satırını yazıyorum.
`),
  ],
  choices: [
    option('DIL_BILIRKISI', 'Bilişim bilirkişisi: yetkiler, terminal, kimlik doğrulama', {
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 60 },
      effects: [raise('bilirkisi_istendi'), raise('dil_any')],
      good: 'Log kayıtlarının, terminal yetkilerinin ve kimlik doğrulamanın incelenmesi özel ve teknik bilgi gerektirir; bilişim bilirkişisi istenir (CMK 63, 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_KASA', 'Güvenlik firmasından kasa odası alarm kayıtları', {
      visibleWhen: flag('fact_kasa_kod'),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 60 },
      effects: [raise('dil_kasa'), raise('dil_any')],
      good: 'Paranın kasadan ne zaman, hangi kodla alındığını gösterecek kayıt; ispat edilecek husus açık (CMK 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_PDKS', 'Müdürlük personelinin iptal günlerindeki turnike kayıtları', {
      visibleWhen: any(flag('fact_turnike'), has('clue_cikis')),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 60 },
      effects: [raise('dil_pdks'), raise('dil_any')],
      good: 'İptal saatlerinde binada kimin bulunduğu; sanığın çıkışını başkalarınınkiyle karşılaştırma imkânı (CMK 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_TICKET', 'Bilgi işlemden Ocak ayı şifre sıfırlama talepleri', {
      visibleWhen: flag('fact_14ocak'),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 60 },
      effects: [raise('dil_ticket'), raise('dil_any')],
      good: 'Sanığın şifresinin kimin talebiyle sıfırlandığını gösterecek kayıt (CMK 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_MELEK', 'Melek Yavuz’un banka hesap hareketleri', {
      visibleWhen: has('clue_araba'),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: -40 },
      effects: [raise('dil_any')],
      bad: 'Hakkında hiçbir somut bulgu olmayan bir tanığın hesapları istenmez; talep ilgisiz bulunarak reddedilir (CMK 206/2-b) ve özel hayata müdahale sayılır.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_KAMERA', 'Vezne salonu kamera kayıtları', {
      visibleWhen: has('clue_kamera'),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: -20 },
      effects: [raise('dil_any')],
      bad: 'Kayıtlar otuz gün sonra üzerine yazılıyor; aylar sonra istenen delil elde edilemez (CMK 206/2-c). Kamera ekranları da görmüyordu.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_MUFETTIS', 'Müfettişin tanık olarak dinlenmesi', {
      cost: slotCost,
      maxUses: 1,
      effects: [raise('dil_any')],
      neutral:
        'Müfettiş raporunu anlatır; raporda olmayan sütunları anlatamaz. Bir talep hakkı ağır bir sonuç getirmedi.',
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

export const INV_POOL = [
  'clue_terminal',
  'clue_saat',
  'clue_cikis',
  'clue_izin',
  'clue_yonerge',
  'ev_talimat',
  'clue_defter',
  'clue_tutar_fark',
  'clue_basim',
  'clue_imza_kopya',
  'clue_kredi',
  'clue_tapu',
  'clue_postit',
  'clue_kamera',
  'clue_araba',
  'clue_satranc',
];

const wrong = (title: string, text: string) => ({
  score: { DELIL_ANALIZI: -50 },
  feedback: { title, text, label: 'BAĞLANTI YOK · −50 SKOR', tone: 'error' as const },
});

export const invRecipes = (prefix: string): ChoiceDef[] => [
  recipe(`${prefix}_BASKASI`, 'clue_terminal', 'clue_cikis', {
    effects: firstTime('ded_baskasi'),
    feedback: feedbackNew(
      'İptaller Orhan çıktıktan sonra, başka bir bilgisayardan',
      'Orhan turnikeden en geç 17.09’da çıkmış. İptaller 17.38’den sonra, ön odadaki MHM-PC03’ten.',
    ),
    responses: B(`
~ Kayıtlar bir isim yazıyor. O ismin sahibi o saatte serviste, eve giden yolda. Klavyede başka bir el vardı.
`),
  }),
  recipe(`${prefix}_IZIN`, 'clue_saat', 'clue_izin', {
    effects: firstTime('ded_izin'),
    feedback: feedbackNew(
      'İzinli gününde bile kullanıcı adı çalışmış',
      '9 Ocak’ta Orhan izinli; aynı akşam 17.46’da onun kullanıcısıyla iki iptal.',
    ),
    responses: B(`
~ Bir adam hastane koridorunda, kızının elini tutuyor. Aynı saatte onun adı, boş bir odada, bir ekranda “Evet”e basıyor.
`),
  }),
  recipe(`${prefix}_ZARF`, 'clue_yonerge', 'ev_talimat', {
    effects: firstTime('ded_zarf'),
    feedback: feedbackNew(
      'Şifre kişiye özel değildi',
      'Yönerge zarfı yasaklıyor; müdürlükten gelen el yazısı not zarfı istiyor.',
    ),
    responses: B(`
~ Bir kural ve o kuralı çiğneten bir not. İkisi de aynı müdürlüğün kâğıdı. Kullanıcı adı artık bir kişi değil; bir zarfın içindeki bir satır.
`),
  }),
  recipe(`${prefix}_TESLIM`, 'clue_defter', 'clue_tutar_fark', {
    effects: firstTime('ded_teslim'),
    feedback: feedbackNew(
      'Para Orhan’ın elinden tam çıktı',
      'Defter ve karbon kopya aynı tutarı söylüyor; dosyadaki tutanak daha az. Eksilme teslimden sonra.',
    ),
    responses: B(`
~ Saat beşte kasa tamdı. Orhan saydı, yazdı, teslim etti. Para o andan sonra başka birinin koruması altındaydı. Leyla’nın kelimesi: zilyetlik.
`),
  }),
  recipe(`${prefix}_TUTANAK`, 'clue_imza_kopya', 'clue_basim', {
    effects: firstTime('ded_sahte_tutanak'),
    feedback: feedbackNew(
      'Tutanaklar sonradan değiştirilmiş',
      'Rapor 17.56’da yeniden basılmış; tutanaktaki Orhan imzası toner. Asıl, Orhan çıktıktan sonra hazırlanmış.',
    ),
    responses: B(`
~ Biri Orhan’ın imzasını bir fotokopi makinesinden geçirmiş. Bir imza bir insanın en küçük parçasıdır; onu çoğaltan, insanı da çoğaltmış olur.
`),
  }),
  recipe(`${prefix}_KREDI`, 'clue_kredi', 'clue_tapu', {
    effects: firstTime('ded_kredi'),
    feedback: feedbackNew(
      'Kredi, tarlanın parasıyla kapandı',
      'Satış 17 Aralık, havale 18 Aralık 09.12, kapanış 11.40. Kaynak belli.',
    ),
    responses: B(`
~ Savcılığın “sebep” dediği şey, bir ölünün tarlası ve bir kızın kalbi. Kasadan tek kuruş değil.
`),
  }),
  recipe(
    `${prefix}_X_POSTIT`,
    'clue_postit',
    'clue_yonerge',
    wrong(
      'Yanlış iz',
      'Bir not kâğıdı şifre olabilir; ama Melek’in kullanıcısıyla tek bir iptal yok. Bu iki kart birbirini açıklamıyor.',
    ),
  ),
  recipe(
    `${prefix}_X_ARABA`,
    'clue_araba',
    'clue_kredi',
    wrong('Yanlış iz', 'İki kredi, iki insan. Biri araba, biri ameliyat. Birinin borcu ötekinin suçunu göstermez.'),
  ),
  recipe(
    `${prefix}_X_KAMERA`,
    'clue_kamera',
    'clue_terminal',
    wrong(
      'Yanlış iz',
      'Kamera sıraya bakıyor; ön oda kör noktada ve kayıtlar silinmiş. Bu bağlantı mahkemede bir şey göstermez.',
    ),
  ),
  recipe(
    `${prefix}_X_SATRANC`,
    'clue_satranc',
    'clue_defter',
    wrong('Yanlış iz', 'Düzenli bir adamın iki alışkanlığı. Karakter anlatır, olay anlatmaz.'),
  ),
];

const cikarim = deductionBoard('INV_CIKARIM', {
  ...INV,
  title: 'Çıkarım tahtası',
  background: 'buro_gece',
  lines: B(`
> İki ipucunu seç. Birbirini tamamlıyorsa duruşmada kullanabileceğin bir delil doğar.
~ Pano, raptiyeler, kırmızı ip. Leyla bununla dalga geçer. Sonra gelip uzun uzun bakar.
`),
  pool: INV_POOL,
  recipes: invRecipes('CB'),
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

export const invDocs: CasePart = {
  variables: flags(
    'fact_9ocak_log',
    'fact_10bin',
    'fact_12subat',
    'bilirkisi_istendi',
    'dil_kasa',
    'dil_pdks',
    'dil_ticket',
    'dil_any',
    'dil_verildi',
  ),
  nodes: [log, pdks, tutanak, banka, dil, cikarim],
};
