import {
  any,
  cmp,
  cont,
  dec,
  deductionBoard,
  documentExam,
  examine,
  fallback,
  flag,
  has,
  raise,
  recipe,
  row,
  score,
  tool,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef } from '../../../tools/content/src/kit/index.js';
import { B } from './dsl.js';
import { INV } from './shared.js';

// 56-investigation-arsiv: üç belge incelemesi (emanet, aktarım formu + CD, banka dökümü), delil dilekçesi (CMK 177) ve
// birinci evrenin çıkarım tahtası (7 tarif + çeldiriciler).

const wrongTool = (id: string) =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle burada dikkat çeken bir şey bulamadın.',
      label: '−20 SKOR',
      tone: 'error',
    },
  });

const found = (title: string, text: string, label: string) => ({ title, text, label, tone: 'special' as const });

export const POOL1 = [
  'clue_dort_kamera',
  'clue_koltuk_boslugu',
  'clue_cikartma',
  'clue_dokuz_koltuk',
  'clue_atm_fisi',
  'clue_153_arama',
  'clue_fb_mesaj',
  'clue_kira',
  'clue_fis_notu',
  'clue_bufe_kamera',
  'clue_kart_yok',
  'clue_zarf',
  'clue_sari_not',
  'clue_kaynak_dosya',
  'clue_bozuk_segment',
  'clue_ilk_kare',
  'clue_son_kare',
  'clue_harcama_saat',
  'clue_gozluk',
  'clue_gri_kapuson',
  'clue_defter',
  'clue_olay_klasoru',
];

/** Birinci evre tarifleri; ara tahtasında da kurulabilir (puan yalnızca ilk kurulumda; ara-board.ts). */
export const RECIPES1: [string, string, string, string, string][] = [
  [
    'CB_KART',
    'clue_son_kare',
    'clue_harcama_saat',
    'ded_kart_baskasi',
    '18.44.30’da Arda Beşevler’e giden otobüsteydi. 18.49’da kartlar kilometrelerce geride kullanıldı. O değil.',
  ],
  [
    'CB_ZARF',
    'clue_atm_fisi',
    'clue_zarf',
    'ded_zarf',
    '17.52’de çekilen 600 TL, “ARDA – kira” yazılı banka zarfında. Kadının parası değil.',
  ],
  [
    'CB_TESLIM',
    'clue_sari_not',
    'clue_153_arama',
    'ded_teslim',
    '19.18’de belediyeye üç dakikalık çağrı, gece masada “Yarın 9 — karakol.” Saklayan biri kendine hatırlatma yazmaz.',
  ],
  [
    'CB_KAYIT',
    'clue_dort_kamera',
    'clue_kaynak_dosya',
    'ded_eksik_kayit',
    'Dört kamera, bir saatlik dört kanallı kaynak. CD’de tek kanal ve iki buçuk dakika. Gerisi arşivde.',
  ],
  [
    'CB_HAYRI',
    'clue_gozluk',
    'clue_dokuz_koltuk',
    'ded_hayri_gormedi',
    'Arkaya bakan koltukta gözlüksüz gazete okuyan miyop biri, başını kaldırınca üç metre ötede bulanık bir kalabalık görür.',
  ],
  [
    'CB_BULDU',
    'clue_koltuk_boslugu',
    'clue_ilk_kare',
    'ded_buldu',
    'Ayağı takılıyor, eğiliyor, koltuğun altındaki boşluktan alıyor. Bir alma değil, bir bulma.',
  ],
  [
    'CB_KLASOR',
    'clue_olay_klasoru',
    'clue_dort_kamera',
    'ded_eksik_kayit',
    'Dört kamera var; her olayda bir saatlik, dört kanallı bir klasör açılıyor. CD ise tek kanal ve iki buçuk dakika. Gerisi klasörde.',
  ],
  [
    'CB_BERE',
    'clue_kart_yok',
    'clue_fis_notu',
    'ded_bereli',
    'Kartlar cüzdanda yoktu. 18.49’da büfede “yeşil bere” not edilmiş biri üç ayrı çekim yaptı. Kim olduğunu bilmiyoruz.',
  ],
];

const recipeRule = ([id, a, b, ded, text]: [string, string, string, string, string]): ChoiceDef =>
  recipe(id, a, b, {
    discovers: ded,
    score: { DELIL_ANALIZI: 300 },
    feedback: { title: 'YENİ ÇIKARIM', text, label: 'YENİ DELİL · +300 SKOR', tone: 'success' },
  });

const dil = (
  id: string,
  label: string,
  spec: Partial<ChoiceDef> & { good?: string; bad?: string; neutral?: string },
) => {
  const { good, bad, neutral, effects, ...rest } = spec;
  const quality = good
    ? { q: 'GOOD' as const, feedback: good, category: 'USUL_BILGISI' as const }
    : bad
      ? { q: 'BAD' as const, feedback: bad, category: 'USUL_BILGISI' as const }
      : neutral
        ? { q: 'NEUTRAL' as const, feedback: neutral }
        : undefined;
  const c: ChoiceDef = {
    id,
    kind: 'OPTION',
    label,
    enabledWhen: cmp(v('dil_hak'), '>', 0),
    lockedReason: 'Talep hakkın kalmadı.',
    effects: [
      dec('dil_hak'),
      ...(good ? [score('USUL_BILGISI', 40)] : bad ? [score('USUL_BILGISI', -20)] : []),
      ...(effects ?? []),
    ],
    next: '$stay',
    ...rest,
  };
  if (quality) c.quality = quality;
  return c;
};

export const invArchive: CasePart = {
  nodes: [
    {
      id: 'INV_EMANET_SON',
      type: 'STORY',
      ...INV,
      title: 'Emanet bürosu',
      background: 'adliye',
      lines: B(`
Melek Hanım poşetleri tek tek numaralarına göre rafa dizdi. Sarı notun poşetini en son kaldırdı, bir an baktı.
katip: Yedi aydır burada. Kimse sormadı. Polis de okumadı, ben de okumadım. Okumak bizim işimiz değil, saklamak bizim işimiz.
katip: Siz okudunuz. Avukatlar bazen okur. Bazen.
> “Saklamak bizim işimiz.” Bir emanet bürosu ile bir kayıp eşya bürosu arasında fark var mı? İkisi de sahibini bekleyen şeyleri tutuyor.
`),
      choices: [
        {
          id: 'EMS_ORNEK',
          kind: 'OPTION',
          label: '“Tutanağın onaylı örneğini istiyorum.”',
          effects: [raise('tutanak_ornek')],
          next: '$return',
          responses: B(`
katip: Dilekçe verin, harcını yatırın, yarın alırsınız. Dosya inceleme hakkınız var, örnek hakkınız da var. Ama sırası var.
`),
        },
        {
          id: 'EMS_GIT',
          kind: 'OPTION',
          label: 'Teşekkür edip çık',
          next: '$return',
          responses: B(`
> Bodrumdan çıkarken merdivenlerde bir avukatın kâtibe bağırdığını duydum. Melek Hanım’a bir çikolata almayı not ettim.
`),
        },
      ],
    },
    documentExam('INV_EMANET', {
      ...INV,
      title: 'El koyma tutanağı · emanet',
      background: 'adliye',
      hud: ['exam_left'],
      lines: B(`
# adliye | 10.00 — BURSA ADLİYESİ, EMANET BÜROSU
Bodrum kat. Metal raflar, numaralı poşetler, nem. Masada bir kayıt defteri ve soğumuş bir simit.
katip: Melek Şen, kâtip. Dosya numarası? Tamam. Dokunmak yok, bakmak serbest. Eldiven şurada. Yarım saat.
Masaya beş poşet dizildi. Her biri tutanaktaki bir satır. Bir hayatın yedi ay önceki sabahı, şeffaf naylonun içinde.
Bir alet seç, sonra şüpheli satıra dokun. Doğru alet ve doğru satır yeni bir ipucu verir; boş deneme bir hak götürür.
`),
      header: { left: 'EMANET 2026/1184 · EL KOYMA TUTANAĞI', right: '7 MART · 08.15' },
      columns: [
        { label: 'SIRA', flex: 0.5 },
        { label: 'EŞYA', flex: 1.6 },
        { label: 'AÇIKLAMA', flex: 2 },
      ],
      rows: [
        row('e1', ['1', 'Kahverengi deri kadın cüzdanı', 'İçinde: kimlik, sağlık kartı, eczane fişi, 1 fotoğraf'], {
          cmp: {
            cells: ['1', 'Kahverengi deri kadın cüzdanı', 'Müşteki: 1.200 TL + 2 kart · Emanette: YOK'],
            tone: 'special',
          },
        }),
        row('e2', ['2', 'Zarf içinde 600 TL', 'Sırt çantasının ön gözünde'], {
          mag: { cells: ['2', 'Banka zarfı, bantlı', 'Üstünde el yazısı: “ARDA – kira”'], tone: 'special' },
        }),
        row('e3', ['3', 'El yazılı not kâğıdı (sarı)', 'Masa üzerinde'], {
          mag: { cells: ['3', 'Sarı yapışkan not', '“Yarın 9 — karakol. G. Sarı cüzdan.”'], tone: 'special' },
        }),
        row('e4', ['4', 'Cep telefonu', 'İnceleme sonrası iade edildi']),
        row('e5', ['5', 'Öğrenci kartı (kişiye özel)', 'Fotokopisi alındı, iade edildi']),
      ],
      tools: [
        tool('mag', 'Büyüteç', 'magnifier'),
        tool('cmp', 'Karşılaştır', 'compare'),
        tool('uv', 'UV ışık', 'uv', 'UV'),
      ],
      costVar: 'exam_left',
      rules: [
        examine('EX_E_CMP1', 'cmp', 'e1', {
          discovers: 'clue_kart_yok',
          score: { DELIL_ANALIZI: 150 },
          feedback: found(
            'YENİ İPUCU',
            'Müşteki 1.200 TL ve iki kart diyor. Emanetteki cüzdanda ikisi de yok; Arda’nın üstünden ve evinden de çıkmamış.',
            '+150 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_E_MAG2', 'mag', 'e2', {
          discovers: 'clue_zarf',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'YENİ İPUCU',
            'Bantlı bir banka zarfı. Üstünde Arda’nın el yazısı: “ARDA – kira.” Banknotlar düz, sıralı.',
            '+100 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_E_MAG3', 'mag', 'e3', {
          discovers: 'clue_sari_not',
          score: { DELIL_ANALIZI: 150 },
          feedback: found(
            'YENİ İPUCU',
            '“Yarın 9 — karakol. G. Sarı cüzdan.” Tutanakta yalnızca “el yazılı not” diye geçiyor. Yedi aydır kimse okumamış.',
            '+150 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_E_UV3', 'uv', 'e3', {
          score: { DELIL_ANALIZI: -20 },
          feedback: {
            title: 'GEREK YOK',
            text: 'Not silinmemiş, kazınmamış; UV bir şey eklemiyor. Bazen kâğıdın söylediği şey, yazanın yazdığından ibarettir.',
            label: '−20 SKOR',
            tone: 'error',
          },
        }),
      ],
      miss: wrongTool('FB_EMANET'),
      finish: { id: 'EMANET_BITIR', label: 'Poşetleri kâtibe geri ver' },
    }),

    documentExam('INV_KLIP', {
      ...INV,
      title: 'CD ve aktarım formu',
      background: 'buro',
      hud: ['klip_left'],
      lines: B(`
# buro | ARSLAN HUKUK · TOPLANTI ODASI
CD’nin örneğini dizüstüne taktım. Ekranda gri, gürültülü bir görüntü belirdi. Köşede saat: 18.42.00. Ses yok.
Arda oturuyor. Eğiliyor. Bir şey alıyor. Açıyor. Kapatıyor. Çantasına koyuyor. Görüntü 18.44.30’da kararıyor.
> İki buçuk dakika. Savcılığın en güçlü delili. Bir kez izledim, iki kez, beş kez. Altıncıda görüntüye değil, köşedeki rakamlara bakmaya başladım.
CD’nin yanında Kent Ulaşım’ın tek sayfalık aktarım formu. Teknisyenin imzası, bir kaşe, bir dipnot.
`),
      header: { left: 'KENT ULAŞIM A.Ş. · KAYIT AKTARIM FORMU', right: '6 MART 23.40 · V. SEZER' },
      columns: [
        { label: 'ALAN', flex: 1 },
        { label: 'DEĞER', flex: 2 },
      ],
      rows: [
        row('k1', ['Kaynak dosya', 'SEFER_0306_1810-1910'], {
          mag: { cells: ['Kaynak dosya', 'SEFER_0306_1810-1910 · 4 kanal · “olay klasörüne alındı”'], tone: 'special' },
        }),
        row('k2', ['Aktarılan kanal', 'KAM-2 (orta)']),
        row('k3', ['Aktarılan aralık', '18.42.00–18.44.30']),
        row('k4', ['Aktarım notu', '*1 segment (bkz. dipnot)'], {
          mag: {
            cells: ['Aktarım notu', 'Dipnot: 18.43.00–18.43.59 yazma hatası, yeniden denenmedi'],
            tone: 'special',
          },
        }),
        row('k5', ['CD · ilk kareler', '18.42.00–18.42.20'], {
          play: {
            cells: ['CD · ilk kareler', '18.42.05 oturur, ayağı takılır, koltuk altından bir cisim alır'],
            tone: 'special',
          },
        }),
        row('k6', ['CD · son kare', '18.44.30'], {
          play: { cells: ['CD · son kare', 'Durak ekranı: “SIRADAKİ DURAK: BEŞEVLER”'], tone: 'special' },
        }),
        row('k7', ['Talep eden', 'Pol. Mem. S. Ulu · “olay anı yeterli”']),
      ],
      tools: [
        tool('mag', 'Büyüteç', 'magnifier'),
        tool('play', 'Kareleri izle', 'camera'),
        tool('lock', 'Bütünlük', 'lock'),
      ],
      costVar: 'klip_left',
      rules: [
        examine('EX_K_MAG1', 'mag', 'k1', {
          discovers: 'clue_kaynak_dosya',
          score: { DELIL_ANALIZI: 150 },
          feedback: found(
            'YENİ İPUCU',
            'CD’nin kaynağı bir saatlik, dört kanallı bir sefer kaydı: 18.10–19.10. “Olay klasörüne alındı.” Tam kayıt arşivde duruyor.',
            '+150 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_K_MAG4', 'mag', 'k4', {
          discovers: 'clue_bozuk_segment',
          score: { DELIL_ANALIZI: 150 },
          feedback: found(
            'YENİ İPUCU',
            '18.43’ün bütün dakikası CD’ye yazılamamış. Klipte 18.42.59’dan 18.44.00’e atlanıyor. Kimse fark etmemiş; ya da etmiş, yazmamış.',
            '+150 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_K_LOCK4', 'lock', 'k4', {
          discovers: 'clue_bozuk_segment',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'YENİ İPUCU',
            'Zaman damgaları sürekli değil: 18.42.59 → 18.44.00. Bir dakika eksik. Formun dipnotu bunu doğruluyor.',
            '+100 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_K_PLAY5', 'play', 'k5', {
          discovers: 'clue_ilk_kare',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'YENİ İPUCU',
            '18.42.05: oturuyor, ayağı takılıyor, eğilip koltuğun altından alıyor. Cüzdan çantadan ya da cepten çıkmıyor.',
            '+100 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_K_PLAY6', 'play', 'k6', {
          discovers: 'clue_son_kare',
          score: { DELIL_ANALIZI: 150 },
          feedback: found(
            'YENİ İPUCU',
            'Son kare, 18.44.30: tavandaki durak ekranında “SIRADAKİ DURAK: BEŞEVLER”. Arda hâlâ otobüste, hâlâ oturuyor.',
            '+150 SKOR · Not defterine eklendi',
          ),
        }),
      ],
      miss: wrongTool('FB_KLIP'),
      finish: { id: 'KLIP_BITIR', label: 'CD’yi çıkar' },
    }),

    documentExam('INV_BANKA', {
      ...INV,
      title: 'Kart hareketleri',
      background: 'buro',
      hud: ['banka_left'],
      lines: B(`
# buro | ARSLAN HUKUK · DOSYA, EK-4
Bankanın gönderdiği döküm tek sayfa: saat, işyeri, tutar. Kimin harcadığı yazmıyor. Kartın kimin olduğu yazıyor.
> Savcılık bu sayfayı “zarar” diye dosyaya koymuş. Ben buna bir harita gibi bakıyorum.
`),
      header: { left: 'BANKA · KART HAREKETLERİ (EK-4)', right: '6 MART 2026' },
      columns: [
        { label: 'SAAT', flex: 0.7 },
        { label: 'İŞYERİ', flex: 2 },
        { label: 'TUTAR', flex: 1 },
      ],
      rows: [
        row('b1', ['18.49', 'ALTIPARMAK TEKEL BÜFE', '3 × 246,66 TL'], {
          mag: { cells: ['18.49', 'ALTIPARMAK TEKEL BÜFE · 3 ayrı temassız', '18.49.10 / .31 / .52'], tone: 'special' },
        }),
        row('b2', ['18.55', 'ALTIPARMAK GSM AKSESUAR', '1.450,00 TL']),
        row('b3', ['19.06', 'KÜLTÜRPARK PETROL', '750,00 TL']),
        row('b4', ['19.31', 'KART BLOKE (müşteri talebi)', '—']),
      ],
      tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
      costVar: 'banka_left',
      rules: [
        examine('EX_B_MAG1', 'mag', 'b1', {
          discovers: 'clue_harcama_saat',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'YENİ İPUCU',
            'İlk harcama 18.49’da Altıparmak’ta, yirmişer saniye arayla üç ayrı temassız çekim. Şifresiz sınırın altında kalmak için.',
            '+100 SKOR · Not defterine eklendi',
          ),
        }),
        examine('EX_B_CMP1', 'cmp', 'b1', {
          discovers: 'clue_harcama_saat',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'YENİ İPUCU',
            '18.49, Altıparmak. CD’deki saatlerle yan yana koyunca soru kendiliğinden doğuyor: Arda o sırada neredeydi?',
            '+100 SKOR · Not defterine eklendi',
          ),
        }),
      ],
      miss: wrongTool('FB_BANKA'),
      finish: { id: 'BANKA_BITIR', label: 'Dosyayı kapat' },
    }),

    {
      id: 'INV_DIL',
      type: 'CHOICE',
      ...INV,
      title: 'Delil dilekçesi (CMK 177)',
      background: 'buro',
      hud: ['dil_hak'],
      prompt: {
        speaker: 'narrator',
        text: 'Duruşmadan en az beş gün önce, ispat edilecek olayı göstererek. Üç talep hakkın var; her talebi neden istediğini bilerek seç.',
      },
      lines: B(`
# buro | ARSLAN HUKUK · DİLEKÇE
> Boş bir sayfa, bir imleç, bir mahkeme başkanlığı başlığı. “Sayın Hâkim, sanık müdafii olarak aşağıdaki delillerin toplanmasını talep ederim.”
> Her satır bir hak. Yanlış satır, doğru satırın yerini kaplar.
`),
      choices: [
        dil('DIL_KAYIT', 'Kent Ulaşım arşivindeki tam sefer kaydı (dört kamera, 18.10–19.10)', {
          visibleWhen: any(has('clue_kaynak_dosya'), has('clue_dort_kamera'), has('clue_olay_klasoru')),
          effects: [raise('kayit_istendi')],
          good: 'İspat edilecek olay belli (cüzdanın sanıktan önce kimde olduğu, sanığın teslim girişimi), delilin yeri belli (olay klasörü). CMK 177’ye uygun, somut bir talep.',
        }),
        dil('DIL_153', '153 Çözüm Merkezi’nin 6 Mart 19.18 çağrı kaydı', {
          visibleWhen: any(has('clue_153_arama'), flag('fact_153_anlatti')),
          effects: [raise('cagri_istendi')],
          good: 'Teslim niyetini gösteren, üçüncü kişinin elindeki tarafsız bir kayıt. Saati ve numarası belli; talep somut.',
        }),
        dil('DIL_OZAN', 'Tanık: Ozan Kaplan (sabahki not ve geceki konuşma)', {
          visibleWhen: any(flag('fact_ozan'), has('clue_sari_not')),
          effects: [raise('ozan_istendi')],
          good: 'Notun ne zaman ve neden yazıldığını gören bir tanık. Doğrudan gözleme dayanır.',
        }),
        dil('DIL_BILIRKISI', 'CD’nin bilirkişiye incelettirilmesi', {
          neutral:
            'Bilirkişi CD’nin oynanıp oynanmadığını söyleyebilir ama eksik kamerayı ve dakikaları tamamlayamaz; asıl delil kaynaktaki tam kayıttır.',
        }),
        dil('DIL_BUFE', 'Altıparmak’taki büfenin kamera kaydı', {
          neutral:
            'Kayıt otuz günde silinmiş; istem sonuçsuz kalır. Delilin ispata elverişsiz olduğu talepler CMK 206/2 uyarınca reddedilebilir.',
        }),
        dil('DIL_FB', 'Müştekinin bütün Facebook yazışmalarının getirtilmesi', {
          bad: 'Ölçüsüz ve özel hayatın gizliliğine dokunan bir talep; ispat edilecek olay için gerekli olanla sınırlı değil. Reddedilir ve mahkemenin gözünde savunmanın ciddiyetini zedeler.',
        }),
        cont('DIL_VER', 'Dilekçeyi ver', '$return', {
          enabledWhen: cmp(v('dil_hak'), '<', 3),
          lockedReason: 'En az bir talep seç.',
          effects: [raise('dil_verildi')],
          role: 'PRIMARY',
        }),
      ],
    },

    deductionBoard('INV_CIKARIM', {
      ...INV,
      title: 'Çıkarım tahtası',
      background: 'buro',
      lines: B(`
Mantar panoya iğnelenmiş kartlar, aralarında kırmızı iplik bekleyen boşluklar.
İki kart seç. Birbirini tamamlıyorsa duruşmada sunabileceğin bir çıkarım doğar. Birbirini açıklamayan çiftler skor götürür.
`),
      pool: POOL1,
      recipes: RECIPES1.map(recipeRule),
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
    }),
  ],
};

// Emanet incelemesinin bitişi kâtiple kısa bir sahneye bağlanır (oradan hub'a `$return`).
for (const n of invArchive.nodes ?? []) {
  if (n?.id === 'INV_EMANET' && n.choices) {
    n.choices = n.choices.map((c) => (c?.id === 'EMANET_BITIR' ? { ...c, next: 'INV_EMANET_SON' } : c));
  }
}
