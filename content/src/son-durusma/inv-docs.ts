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
import type { ChoiceDef, Effect } from '../../../tools/content/src/kit/index.js';
import { B, O, W } from './dsl.js';
import { INV } from './shared.js';

// 50-investigation (arşiv): baş tanığın ifadesi, maktulün HTS’i, sanığın telefon raporu, delil dilekçesi, tahta.

/** Tahtada bir çıkarımı yalnızca ilk kurulumda ödüllendirir (alternatif tarifler ve iki evre için). */
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

export const ifade = documentExam('INV_IFADE', {
  ...INV,
  title: 'Tarık Sezer’in kolluk ifadesi',
  hud: ['ex_ifade'],
  background: 'buro',
  lines: B(`
# BÜRO — DOSYANIN ASLI [bg:buro]
> İki sayfa. Saat 01.30’da, olaydan bir buçuk saat sonra alınmış. Saatler, adlar, bir kaçış; kolluğun daktilosundan çıkmış her ifade gibi kuru.
~ Bir alet seç, sonra belgede şüpheli satıra dokun. Bu dosyanın bütün yükü bu iki sayfanın üstünde.
`),
  header: { left: 'BURSA EMNİYET · CİNAYET BÜRO · TANIK İFADESİ', right: '15.11 · 01.30' },
  columns: [
    { label: 'KONU', flex: 0.8 },
    { label: 'BEYAN', flex: 2.4 },
  ],
  rows: [
    row('r1', ['Kapanış', '“Emir kapanışta gitmedi; ofisin önünde dolandı.”']),
    row('r2', ['Bağırış', '“23.55 gibi ofisten bağırış duydum: ‘Babamın hayatını çaldın!’”']),
    row('r3', ['Çıkış', '“Emir ofisten koşarak çıktı; elinde bıçak, önlüğünde kan vardı. Arka kapıdan kaçtı.”']),
    row('r4', ['Sayım', '“Korktum. Sayımı bitirdim, 00.15’te ofise girdim, Ercan’ı yerde buldum.”']),
    row('r5', ['Kamera', '“Kamera sistemi üç gündür arızalıydı.”']),
    row('r6', ['Kin', '“Emir pazartesiden beri kin güdüyordu. Ercan da bana ‘bu çocuk bir şey yapacak’ dedi.”']),
  ],
  tools: [
    tool('mag', 'Büyüteç', 'magnifier'),
    tool('compare', 'Olay yeri tutanağıyla karşılaştır', 'compare'),
    tool('law', 'Mevzuat', 'check'),
  ],
  costVar: 'ex_ifade',
  rules: [
    examine('EX_I_R3', 'compare', 'r3', {
      discovers: 'clue_tarik_bicak',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · ÇIKIŞ',
        text: 'Tanık bıçağı sanığın elinde, kanı önlüğünde görmüş. Olay yeri tutanağı: bıçak ofiste, önlük koridorda askıda. İkisi aynı gecenin tutanağı.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
      responses: B(`
~ Ya tutanak yanlış, ya tanık. Tutanak fotoğraflı.
`),
    }),
    examine('EX_I_R2', 'compare', 'r2', {
      discovers: 'clue_tarik_saat',
      score: { DELIL_ANALIZI: 100 },
      feedback: {
        title: 'YENİ İPUCU · SAAT',
        text: 'Dosyada bağırışın saatini söyleyen tek kişi bu tanık: 23.55. Bulaşıkçının ifadesinde saat yok; kimse sormamış.',
        label: '+100 SKOR · Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_I_R1', 'mag', 'r1', {
      discovers: 'clue_dolandi',
      score: { DELIL_ANALIZI: 100 },
      feedback: {
        title: 'YENİ İPUCU · BEKLEYİŞ',
        text: '“Gitmedi, dolandı.” İddianame bu cümleyi “kararında sebat ederek maktulü bekledi” diye okumuş. Neden kaldığını kimse sormamış.',
        label: '+100 SKOR · Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_I_R4', 'mag', 'r4', {
      discovers: 'clue_tarik_sayim',
      score: { DELIL_ANALIZI: 100 },
      feedback: {
        title: 'YENİ İPUCU · SAYIM',
        text: 'Tanık, bağırıştan sonra yirmi dakika daha kasada saymış; korktuğu hâlde. Sonra ofise girmiş. Sayımın bir kâğıdı olmalı.',
        label: '+100 SKOR · Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_I_R5', 'compare', 'r5', {
      effects: [ifThen(not(has('clue_tarik_ariza')), [discover('clue_tarik_ariza'), score('DELIL_ANALIZI', 100)])],
      feedback: {
        title: 'KAMERA',
        text: 'Tutanak: “Kayıt cihazı çalışmıyor.” Cihaz açılmamış, teknik inceleme yok. Arızayı söyleyen tek kişi bu tanık.',
        label: 'Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_I_R6', 'law', 'r6', {
      score: { DELIL_ANALIZI: 20 },
      effects: [raise('fact_duyum')],
      feedback: {
        title: 'DUYUM',
        text: '“Ercan bana dedi ki…” Tanık ölmüş birinden duyduğunu aktarıyor. Bir tanık gördüğünü anlatır; duyduğunu aktarması doğrudan delil değildir (CMK 210 ruhu, 217 takdiri).',
        label: '+20 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: miss('FB_IFADE'),
  finish: { id: 'IFADE_BITIR' },
});

export const hts = documentExam('INV_HTS', {
  ...INV,
  title: 'Maktulün arama dökümü',
  hud: ['ex_hts'],
  background: 'buro_gece',
  lines: B(`
# BÜRO — GECE [bg:buro_gece]
> Üç sayfa, sütun sütun numara. Savcılık istemiş, gelmiş, dosyaya konmuş. İddianamede bir satırı bile yok.
~ Ölü bir adamın son gecesi, saniye cinsinden. Kimse okumamış; çünkü kimse bir soru sormamış.
`),
  header: { left: 'BTK · HTS · ERCAN TOKER', right: '14.11' },
  columns: [
    { label: 'SAAT', flex: 0.8 },
    { label: 'YÖN · KARŞI TARAF', flex: 2 },
    { label: 'SÜRE', flex: 0.6 },
  ],
  rows: [
    row('h1', ['21.02', 'Gelen · Gülay Toker', '2 dk']),
    row('h2', ['22.10', 'Giden · S. Öztürk (mali müşavir)', '1 dk']),
    row('h3', ['22.47', 'Mesaj · Emir Yalçın', '—']),
    row('h4', ['23.58', 'Giden · 0532 *** ** 17', '52 sn']),
    row('h5', ['00.20–00.41', 'Gelen · Gülay Toker (3)', 'cevapsız']),
  ],
  tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Vekâletnamedeki numarayla karşılaştır', 'compare')],
  costVar: 'ex_hts',
  rules: [
    examine('EX_H_H4', 'compare', 'h4', {
      discovers: 'clue_son_arama',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · SON ARAMA',
        text: '0532 *** ** 17: vekâletname formunda Kemal Yalçın’ın yazdığı numara. Maktulün son araması 23.58’de, sanığın babasına. Elli iki saniye.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
      responses: B(`
~ Elli iki saniye. Açılmamış bir telefon elli iki saniye boyunca neyi dinler? Ya bir zil sesini, ya bir sesli mesajı.
`),
    }),
    examine('EX_H_H2', 'mag', 'h2', {
      score: { DELIL_ANALIZI: 30 },
      effects: [raise('fact_muhasebe')],
      feedback: {
        title: 'MALİ MÜŞAVİR',
        text: 'Cuma gecesi saat onda bir mali müşavirle bir dakikalık konuşma. Bir meyhane sahibi nişan yemeğinin ortasında muhasebecisini neden arar?',
        label: '+30 SKOR',
        tone: 'neutral',
      },
    }),
    examine('EX_H_H3', 'mag', 'h3', {
      score: { DELIL_ANALIZI: 20 },
      feedback: {
        title: 'MESAJ',
        text: '22.47’de sanığa bir mesaj. HTS içeriği göstermez; yalnızca gönderildiğini.',
        label: '+20 SKOR',
        tone: 'neutral',
      },
    }),
    examine('EX_H_H5', 'mag', 'h5', {
      score: { DELIL_ANALIZI: 10 },
      feedback: {
        title: 'ÜÇ ARAMA',
        text: 'Eşi üç kez aramış; biri 00.20’de, biri 00.31’de, biri 00.41’de. Kimse açmamış.',
        label: '+10 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: miss('FB_HTS'),
  finish: { id: 'HTS_BITIR' },
});

export const tel = documentExam('INV_TEL', {
  ...INV,
  title: 'Emir’in telefon raporu',
  hud: ['ex_tel'],
  background: 'buro',
  lines: B(`
# BÜRO — BİLİŞİM RAPORU [bg:buro]
> Bilişim büronun raporu: kırk iki sayfa ekran görüntüsü. İddianame bunlardan yalnızca birini alıntılamış; o da yarım.
~ Bir telefon bir insanın son haftasıdır. Savcı bu haftanın bir cümlesini okumuş. Ben hepsini okuyacağım.
`),
  header: { left: 'BİLİŞİM SUÇLARI · İNCELEME RAPORU · EMİR YALÇIN', right: '10–15.11' },
  columns: [
    { label: 'ZAMAN', flex: 0.9 },
    { label: 'KİMDEN → KİME', flex: 1 },
    { label: 'METİN', flex: 2.2 },
  ],
  rows: [
    row(
      't1',
      [
        '10.11 21.14',
        'Emir → Onur',
        '“Patronun kim olduğunu öğrendim. Babamın hayatını yakan adammış. Bu hafta hesabını soracağım. […]”',
      ],
      {
        mag: {
          cells: [
            '10.11 21.14',
            'Emir → Onur',
            '“…Bu hafta hesabını soracağım. Neden yaptığını yüzüne soracağım. Babamın yüzüne nasıl baktığını.”',
          ],
          tone: 'special',
        },
      },
    ),
    row('t2', [
      '12.11 08.03',
      'Şef Nuri → Mutfak (grup)',
      '“Cuma nişan, 120 kişi. Herkes taşını alsın, bıçaklar bileylensin.”',
    ]),
    row('t3', [
      '14.11 22.47',
      'Ercan Toker → Emir',
      '“Kapanıştan sonra ofise uğra. Baban hakkında konuşmamız lazım. E.”',
    ]),
    row('t4', [
      '14.11 23.46',
      'Emir → Onur',
      '“Otobüse yetişeceğim. Kafam yandı abi. Babam suçsuzmuş.” (baz: Mudanya İskele)',
    ]),
    row('t5', ['15.11 00.47', 'Emir → Annem', '“Geliyorum.”']),
  ],
  tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'İddianameyle karşılaştır', 'compare')],
  costVar: 'ex_tel',
  rules: [
    examine('EX_T_T1', 'mag', 't1', {
      discovers: 'clue_mesaj_tam',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · MESAJIN SONU',
        text: 'İddianame mesajı “hesabını soracağım”da kesmiş. Devamı: “Neden yaptığını yüzüne soracağım. Babamın yüzüne nasıl baktığını.”',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
      responses: B(`
~ Bir cümleyi nerede kestiğin, o cümlenin ne dediğini belirler. Savcı burada kesmiş. Ben devamını okuyacağım; yüksek sesle.
`),
    }),
    examine('EX_T_T3', 'compare', 't3', {
      discovers: 'clue_davet',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · DAVET',
        text: 'İddianame: “sanık kapanıştan sonra kendi isteğiyle iş yerinde kalarak maktulü beklemiştir.” Rapor: kalmasını isteyen maktulün kendisi.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_T_T2', 'compare', 't2', {
      effects: [ifThen(not(has('clue_nisan')), [discover('clue_nisan'), score('DELIL_ANALIZI', 100)])],
      feedback: {
        title: 'ŞEFİN MESAJI',
        text: 'Çarşamba sabahı bütün mutfağa: “Herkes taşını alsın.” Fiş aynı gün 16.20. İddianame bu mesajdan söz etmiyor.',
        label: 'Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_T_T4', 'mag', 't4', {
      score: { DELIL_ANALIZI: 40 },
      effects: [raise('fact_otobus_emir')],
      feedback: {
        title: '23.46',
        text: 'Sanığın telefonu 23.46’da iskele baz istasyonundan bir mesaj göndermiş: otobüse koşuyor. Baz istasyonu bir yeri değil, bir bölgeyi gösterir; ama bir yönü gösterir.',
        label: '+40 SKOR',
        tone: 'neutral',
      },
    }),
    examine('EX_T_T5', 'mag', 't5', {
      score: { DELIL_ANALIZI: 10 },
      feedback: { title: '00.47', text: 'Annesine tek kelime. Eve geliyor.', label: '+10 SKOR', tone: 'neutral' },
    }),
  ],
  miss: miss('FB_TEL'),
  finish: { id: 'TEL_BITIR' },
});

// --- Dilekçe ---

const slotCost = [{ var: 'slots', amount: 1 }];
export const dil = story('INV_DIL', {
  ...INV,
  title: 'Delil talebi dilekçesi',
  hud: ['slots'],
  background: 'buro',
  lines: [
    W(
      not(flag('dil_any')),
      `
# BÜRO — DİLEKÇE [bg:buro]
> Boş bir sayfa: “Bursa 3. Ağır Ceza Mahkemesi Başkanlığı’na.” İmleç yanıp sönüyor.
~ Üç talep. Mahkeme her talebi kabul etmez; her boş talep, dolu talebin ağırlığını eksiltir. Kanun dilekçeyi duruşmadan en az beş gün önce ister.
`,
    ),
    O(`
> Dilekçe uzuyor. İmleç yanıp sönüyor.
`),
  ],
  choices: [
    option('DIL_KENT', 'BURULAŞ’tan sanığın Kentkart binişleri', {
      visibleWhen: any(flag('fact_otobus'), flag('fact_otobus_emir')),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 60 },
      effects: [raise('dil_kent'), raise('dil_any')],
      good: 'Sanığın anlatısını bağımsız bir makine kaydına bağlayan doğru talep (CMK 177; kurum kaydı mahkeme yazısıyla istenir).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_DVR', 'Kayıt cihazının teknik incelemesi', {
      visibleWhen: any(flag('fact_dvr'), has('clue_tarik_ariza')),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 60 },
      effects: [raise('dil_dvr'), raise('dil_any')],
      good: '“Arızalı” denen cihaz hiç incelenmemiş; olay günlüğü bilirkişi incelemesiyle okunur (CMK 63, 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_Z', 'Yazar kasanın Z raporu ve POS dökümü', {
      visibleWhen: flag('fact_z'),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 60 },
      effects: [raise('dil_z'), raise('dil_any')],
      good: 'Mali hafıza kaydı tanığın “sayım” saatini bağımsız olarak gösterir (CMK 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_SESLI', 'Sesli mesajın bilirkişi incelemesi', {
      visibleWhen: flag('sesli_korundu'),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 80 },
      effects: [raise('dil_sesli'), raise('dil_any')],
      good: 'Kemal Yalçın’ın rızasıyla telefonun ve operatör kaydının incelenmesi; kaydın tarihi, sesin aidiyeti ve kurgu olmadığı bilirkişiyle kanıtlanır (CMK 63–67, 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_TARIK_HTS', 'Baş tanığın HTS kaydı ve baz istasyonu dökümlerinin getirtilmesi', {
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: -30 },
      effects: [raise('dil_any')],
      bad: 'Tanığın iletişim kaydı için somut bir dayanak göstermedin; mahkeme “delil avcılığı” sayar, talep reddedilir (CMK 135’in ölçülülük ölçütü). Bir talep hakkı gitti.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_DNA', 'Bıçak sapında DNA ve parmak izi incelemesi', {
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: -20 },
      effects: [raise('dil_any')],
      bad: 'Bıçak zaten sanığın; DNA’sı da çıkacak. Sonuç ne olursa olsun savunmaya bir şey kazandırmaz.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_KESIF', 'Olay yerinde keşif', {
      cost: slotCost,
      maxUses: 1,
      effects: [raise('dil_any')],
      neutral: 'Ofis yerinde duruyor; keşif mesafeyi gösterir, o gece kimin orada olduğunu göstermez.',
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
  'clue_dolandi',
  'clue_tarik_saat',
  'clue_tarik_bicak',
  'clue_tarik_sayim',
  'clue_tarik_ariza',
  'clue_bicak_ofiste',
  'clue_onluk',
  'clue_not_bloku',
  'clue_beyaz',
  'clue_raki',
  'clue_nisan',
  'clue_canta',
  'clue_tas',
  'clue_boks',
  'clue_dolmus',
  'clue_kavga',
  'clue_mesaj_tam',
  'clue_davet',
  'clue_son_arama',
  'clue_sesli',
];

export const invRecipes = (p: string): ChoiceDef[] => [
  recipe(`${p}_DAVET`, 'clue_davet', 'clue_dolandi', {
    effects: firstTime('ded_davet'),
    feedback: feedbackNew(
      'Kalmasını maktul istedi',
      '“Gitmedi, dolandı” denen çocuk, 22.47’de gelen bir mesajla ofise çağrılmıştı.',
    ),
    responses: B(`
~ İddianame bir bekleyiş görüyor: kararında sebat eden bir katil, kapının önünde. Telefon başka bir şey gösteriyor: bir patron, bir çağrı, “baban hakkında.”
`),
  }),
  recipe(`${p}_BILEME`, 'clue_nisan', 'clue_tas', {
    effects: firstTime('ded_bileme'),
    feedback: feedbackNew(
      'Bileği taşı mutfağın talimatıydı',
      'Çarşamba sabahı şef bütün mutfağa “taşını al” dedi; taş aynı gün alındı.',
    ),
    responses: B(`
~ Bir hazırlık değil, bir iş emri. Yedi aşçı o gün taş aldı ya da bıçağını bileyledi. Savcının “plan”ı bir mutfak tahtasında yazılı.
`),
  }),
  recipe(`${p}_BILEME2`, 'clue_nisan', 'clue_canta', {
    effects: firstTime('ded_bileme'),
    feedback: feedbackNew(
      'Bileği taşı mutfağın talimatıydı',
      'Şefin talimatı ve her gün gelip giden bıçak çantası: bir aşçının sıradan haftası.',
    ),
    responses: B(`
~ Bıçağını her gün taşıyan biri o gün de taşıdı. Şefin dediği gibi bileyledi. Bunun adı plan değil, meslek.
`),
  }),
  recipe(`${p}_NIYET`, 'clue_mesaj_tam', 'clue_kavga', {
    effects: firstTime('ded_niyet'),
    feedback: feedbackNew(
      '“Hesap sormak” bir yüzleşmeydi',
      'Babasından tek cümle duyan bir çocuk, patronuna “neden” diye sormak istemiş.',
    ),
    responses: B(`
~ Bir karar mı, bir soru mu? Kesilmemiş hâliyle mesaj bir soruyu söylüyor. Soru soran biri, cevabını duymak için karşısındakinin yaşamasını ister.
`),
  }),
  recipe(`${p}_ONLUK`, 'clue_onluk', 'clue_tarik_bicak', {
    effects: firstTime('ded_onluk'),
    feedback: feedbackNew('Kanlı önlük yok', 'Tanık “önlüğünde kan” dedi; önlük askıda, lekesiz.'),
    responses: B(`
~ Kanlı bir önlükle kaçan biri önlüğünü geri dönüp askıya asmaz. Ya askıdaki önlük o gece hiç giyilmedi, ya tanık başka bir şey gördü.
`),
  }),
  recipe(`${p}_BICAK`, 'clue_bicak_ofiste', 'clue_tarik_bicak', {
    effects: firstTime('ded_bicak_yeri'),
    feedback: feedbackNew('Bıçak ofisten çıkmamış', 'Tanık “elinde bıçakla kaçtı” dedi; bıçak cesedin yanında.'),
    responses: B(`
~ Bir bıçak aynı anda iki yerde olamaz: arka kapıdan kaçan bir elde ve ofisin halısında. Fotoğraf yalan söylemez.
`),
  }),
  recipe(`${p}_SAAT`, 'clue_dolmus', 'clue_tarik_saat', {
    effects: firstTime('ded_saat'),
    feedback: feedbackNew(
      'Emir 23.40’ta çıkmıştı',
      'Bulaşıkçı 23.45 dolmuşundan beş dakika önce gördü; baş tanık 23.55 diyor.',
    ),
    responses: B(`
~ On beş dakika. Bir dolmuşun saati ile bir tanığın saati arasında on beş dakika var. O on beş dakikada ne oldu?
`),
  }),
];

export const invDecoys = (p: string): ChoiceDef[] => [
  recipe(`${p}_X_RAKI`, 'clue_raki', 'clue_son_arama', {
    score: { DELIL_ANALIZI: -50 },
    feedback: {
      title: 'Yanlış iz',
      text: 'Dolu bir kadeh ve bir telefon. İkisi de o gecenin; ama biri öbürünü açıklamıyor.',
      label: 'BAĞLANTI YOK · −50 SKOR',
      tone: 'error',
    },
  }),
  recipe(`${p}_X_BOKS`, 'clue_boks', 'clue_mesaj_tam', {
    score: { DELIL_ANALIZI: -50 },
    feedback: {
      title: 'Yanlış iz',
      text: 'Eski boks eldivenleri ve bir mesaj: “kavgacı bir genç” hikâyesi savcının hikâyesidir, seninki değil.',
      label: 'BAĞLANTI YOK · −50 SKOR',
      tone: 'error',
    },
  }),
  recipe(`${p}_X_BEYAZ`, 'clue_beyaz', 'clue_onluk', {
    score: { DELIL_ANALIZI: -50 },
    feedback: {
      title: 'Yanlış iz',
      text: 'İki beyaz giysi, iki kare. Renk aynı; bir şey söylemiyor.',
      label: 'BAĞLANTI YOK · −50 SKOR',
      tone: 'error',
    },
  }),
];

export const boardMiss = (id: string) =>
  fallback(id, 'COMBINE', {
    repeat: 'ONCE_PER_PARAMS',
    score: { DELIL_ANALIZI: -50 },
    feedback: {
      title: 'Bu ikisi birbirini açıklamıyor',
      text: 'Başka bir ipucu dene.',
      label: 'BAĞLANTI YOK · −50 SKOR',
      tone: 'error',
    },
  });

export const cikarim = deductionBoard('INV_CIKARIM', {
  ...INV,
  title: 'Çıkarım tahtası',
  background: 'buro_gece',
  lines: B(`
> İki ipucunu seç. Birbirini tamamlıyorsa duruşmada kullanabileceğin bir çıkarım doğar.
~ Pano, iğneler, kırmızı ip. Leyla bununla dalga geçer. Sonra gelip uzun uzun bakar.
`),
  pool: INV_POOL,
  recipes: [...invRecipes('CB'), ...invDecoys('CB')],
  miss: boardMiss('FB_CIKARIM'),
  finish: { id: 'CIKARIM_BITIR' },
});
