import {
  all,
  any,
  back,
  choiceNode,
  cmp,
  cont,
  decisionNode,
  deductionBoard,
  dec,
  fallback,
  flag,
  has,
  inc,
  nav,
  not,
  option,
  raise,
  recipe,
  ref,
  set,
  story,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef } from '../../../tools/content/src/kit/index.js';
import { B, O, S, W, minus } from './dsl.js';
import { INV1, p1 } from './shared.js';

// 50-inv1-hub: soruşturma hub'ı (3 gün × 4 EP), Leyla'ya danış (günde bir, 0 EP), CMK 177 dilekçesi, çıkarım tahtası,
// gün sonu ve akşam sahneleri, duruşmadan önceki gece.

const dayEnd = p1.dayEnd({ ...INV1, title: 'Gün sonu', continueId: 'INV1_DAY_NEXT' });

/** Tahta tarifi: +300; `id` ve kart çifti. */
export const deduce = (id: string, a: string, b: string, ded: string, title: string, text: string): ChoiceDef =>
  recipe(id, a, b, {
    discovers: ded,
    score: { DELIL_ANALIZI: 300 },
    feedback: { title, text, label: 'YENİ DELİL · +300 SKOR', tone: 'success' },
  });

export const INV1_RECIPES: [string, string, string, string, string, string][] = [
  [
    'CB_SURE',
    'clue_sure',
    'clue_kayit14',
    'ded_sure_disi',
    'Süresi bitmiş bir kapı',
    'Karar 4 Mart’ta bitti; uzatılmadı. “Zarf yarın masada” 11 Mart’ta kaydedilmiş. Anahtar deliği, kapı kapandıktan bir hafta sonra hâlâ açıkmış.',
  ],
  [
    'CB_HAT',
    'clue_hedef_hat',
    'clue_kayit9',
    'ded_hat_disi',
    'Kararda olmayan hat',
    'Karar tek bir hattı gösteriyor: müteahhidinkini. “Dosyana bakarım” cümlesi Halil’in kendi hattından. O hat için hiçbir hâkim imza atmamış.',
  ],
  [
    'CB_CAGRI',
    'clue_takvim_214',
    'clue_rehber_214',
    'ded_sahte_cagri',
    'Makamdan gelmeyen çağrı',
    'Halil “Müdür Hanım çağırıyor” diye indi. Takvimine arayanın numarasını yazmıştı: 214. Makamın dahilisi 201. Biri onu odasından uzaklaştırdı.',
  ],
  [
    'CB_BOS',
    'clue_saat_tutanak',
    'clue_kayit_durdu',
    'ded_bos_oda',
    'Sahibi yokken',
    'Muhbirin kaydı 10.39’da kesildi. Polis 10.44’te odaya girdi; oda boştu. Zarf çekmeceye girerken Halil orada değildi.',
  ],
  [
    'CB_YETKI',
    'clue_dosya_devir2',
    'clue_ihbar_icbar',
    'ded_yetkisiz',
    'Bekletilemeyecek dosya',
    'Muhbir “dosyamı bekletiyordu” diyor. Dosya Devir-2’de duruyor; kontrol servisine hiç sevk edilmemiş. Halil’in bekletebileceği bir dosya yoktu.',
  ],
  [
    'CB_CELISKI',
    'clue_ihbar_icbar',
    'clue_savcilik_anlasma',
    'ded_iki_hikaye',
    'İki hikâye',
    '11 Mart’ta “zorla istedi”; 13 Mart’ta “anlaştık, kendi elimle verdim.” Biri irtikabın, öbürü rüşvetin hikâyesi. Muhbir hangisine inanacağını iki gün içinde değiştirmiş.',
  ],
  [
    'CB_HEDEF',
    'clue_inat',
    'clue_uyari_notu',
    'ded_hedef',
    'Masasından kaldırılacak adam',
    'Şubatta, kararın içindeki bir kayıtta: “Masasından kaldırırız onu.” Aynı ay Halil’in cebinde bir not: “Her dosyayı durduran, bir gün kendisi durur.”',
  ],
];

export const POOL_INV1 = [
  'clue_sure',
  'clue_kayit14',
  'clue_hedef_hat',
  'clue_kayit9',
  'clue_takvim_214',
  'clue_rehber_214',
  'clue_saat_tutanak',
  'clue_kayit_durdu',
  'clue_dosya_devir2',
  'clue_ihbar_icbar',
  'clue_savcilik_anlasma',
  'clue_inat',
  'clue_uyari_notu',
  'clue_kilit',
  'clue_kamera_var',
  'clue_zarf_stok',
  'clue_barkod',
  'clue_sinan_arsiv',
];

const leylaFree = p1.free('A_LEYLA', 'Leyla’ya danış', 'INV1_LEYLA', {
  description: '0 EP · günde bir kez',
  enabledWhen: cmp(v('leyla_gun'), '<', v('day')),
  lockedReason: 'Leyla bugün duruşmada. Yarın.',
});

export const inv1Hub: CasePart = {
  nodes: [
    p1.hub({
      ...INV1,
      title: 'Soruşturma',
      background: 'buro',
      lines: p1.dayLines([
        'GÜN 1/3 · 1. celseye 17 gün. Kayıt hangi kapının deliğinden alındı? Zarf o çekmeceye nasıl girdi?',
        'GÜN 2/3 · 1. celseye 14 gün. 12 Mart 10.35 ile 10.46 arası: Halil neredeydi, oda kimindi?',
        'GÜN 3/3 · 1. celseye 11 gün. Delil dilekçesi için son gün; duruşmadan en az beş gün önce verilmeli.',
      ]),
      scenePreview: { scene: 'sc_oda' },
      tabs: [
        {
          id: 't_kisi',
          label: 'KİŞİLER',
          kind: 'PEOPLE',
          choices: [
            p1.activity('A_HALIL', 'Halil ile görüş', 'INV1_HALIL', {
              description: 'Cezaevi · görüş odası · 16 dk',
              visibleWhen: not(visited('INV1_HALIL')),
              effects: [set('min', 16)],
            }),
            p1.activity('A_HALIL2', 'Halil ile yeniden görüş', 'INV1_HALIL', {
              description: 'Cezaevi · 10 dk',
              visibleWhen: visited('INV1_HALIL'),
              maxUses: 1,
              effects: [set('min', 10)],
            }),
            p1.activity('A_ZEHRA', 'Zehra’yı hastanede gör', 'INV1_ZEHRA', {
              once: true,
              description: 'Şehir Hastanesi · gece nöbeti',
            }),
            p1.activity('A_MUDUR', 'Tapu Müdürü Ferda Yalçın', 'INV1_MUDUR', {
              once: true,
              description: 'Nilüfer Tapu Müdürlüğü · makam',
            }),
            p1.activity('A_SINAN', 'Devir Servisi-2', 'INV1_SINAN', {
              once: true,
              description: 'Halil’in kattaki mesai arkadaşları',
              visibleWhen: visited('INV1_MUDUR'),
            }),
            p1.activity('A_KOMISER', 'Kom. Levent Arı', 'INV1_KOMISER', {
              once: true,
              description: 'Emniyet · Mali Suçlarla Mücadele',
            }),
          ],
        },
        {
          id: 't_yer',
          label: 'YERLER',
          kind: 'SCENE',
          choices: [
            p1.activity('A_ODA', 'Kontrol odası', 'INV1_ODA', {
              once: true,
              description: 'Halil’in masası · büyüteç 6',
              visibleWhen: flag('oda_izin'),
            }),
            p1.activity('A_KORIDOR', 'İkinci kat koridoru', 'INV1_KORIDOR', {
              once: true,
              description: 'Pano, dolap, kamera · büyüteç 5',
              visibleWhen: visited('INV1_MUDUR'),
            }),
          ],
        },
        {
          id: 't_kayit',
          label: 'KAYITLAR',
          kind: 'ARCHIVE',
          choices: [
            p1.activity('A_KARAR', 'Dinleme kararını incele', 'INV1_KARAR', {
              once: true,
              description: 'Karar ve çözüm tutanakları · 6 deneme',
            }),
            p1.activity('A_TUTANAK', 'Yakalama tutanağını incele', 'INV1_TUTANAK', {
              once: true,
              description: 'Tutanak ve ekleri · 5 deneme',
            }),
            p1.activity('A_IFADE', 'Muhbirin ifadelerini incele', 'INV1_IFADE', {
              once: true,
              description: 'İki ifade, iki tarih · 5 deneme',
            }),
            p1.activity('A_DIL', 'Delil dilekçesi (CMK 177)', 'INV1_DIL', {
              description: '3 talep hakkı',
              visibleWhen: not(flag('dil_verildi')),
            }),
            p1.free('A_CIKARIM', 'Çıkarım tahtası', 'INV1_CIKARIM', {
              description: '0 EP · iki kartı birleştir',
              enabledWhen: ref('kart2'),
              lockedReason: 'Tahtada en az iki kart olmalı.',
            }),
            leylaFree,
          ],
        },
      ],
      quickTalk: {
        character: 'halil',
        line: '“Kayda geçsin, avukat hanım: ben o sabah odamda değildim.”',
        choices: ['A_HALIL', 'A_HALIL2'],
      },
      choices: [
        nav('GO_H1', 'DURUŞMAYA GİT · 1. CELSE', 'INV1_GECE_1', {
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen bu evre biter; açık kalan işler kapanır. Emin misin?',
        }),
      ],
    }),
    decisionNode(
      'INV1_DAY_END',
      [
        { when: cmp(v('day'), '==', 2), to: 'INV1_AKSAM1' },
        { when: any(visited('INV1_SINAN'), visited('INV1_KOMISER')), to: 'INV1_AKSAM2' },
        { to: 'INV1_AKSAM2B' },
      ],
      { ...INV1, onEnter: dayEnd.node.onEnter },
    ),
    story('INV1_AKSAM1', {
      ...INV1,
      title: 'Kapıdaki adam',
      background: 'buro_gece',
      lines: B(S`
        = 1. GÜNÜN AKŞAMI · 21.20 — ARSLAN HUKUK @buro_gece
        - Büro boşalmıştı. Kâğıtları dizerken telefonum çaldı. Zehra. Arkada bir monitörün bip sesi, bir sedyenin tekerleği.
        zehra{phone}: Kısa konuşacağım, triyajda üç kişi var. Komşumuz aradı. Bugün öğleden sonra eve biri gelmiş. Ben nöbetteydim.
        zehra{phone}: "Müdürlükten geliyorum" demiş. "Halil Bey'in evde kuruma ait evrakı var mı? Bir defter, dosya, ne varsa. Teslim alalım, kayıp olmasın."
        zehra{phone}: Komşu kapıyı açmamış; anahtar bende. Adam kapıda biraz beklemiş, sonra gitmiş. Takım elbise, şemsiye. Adını söylememiş.
        zehra{phone}: Bir de... merdivende oynayan komşunun çocuğuna bir şeker vermiş. Nane şekeri. Çocuk hâlâ anlatıyor; o kadar.
        zehra{phone}: Babamın evde kuruma ait hiçbir şeyi olmaz. Bir kurşun kalemi bile eve getirmez. Ne arıyorlar?
        ~ Bir defter. "Ne varsa" diyen biri, ne aradığını tam olarak biliyordu. Ve kurum, bir memurun evine adını söylemeyen birini evrak toplamaya göndermez.
      `),
      choices: [
        option('AK1_A', 'Kimseye bir şey vermeyin. Saati ve tarifi yazın; yarın savcılığa bildiririz.', {
          good: 'Şüpheli bir kişinin evrak toplamaya çalışması belgelenir ve soruşturma makamına bildirilir (CMK 158). Avukat kişinin peşine düşmez.',
          category: 'USUL_BILGISI',
          score: { USUL_BILGISI: 20 },
          effects: [raise('evrak_bildirildi'), inc('trust', 3)],
          responses: B(S`
            zehra{phone}: Tamam. Komşuya da söylerim; kapıyı açmasın. Yazarım: on beş otuz, takım elbise, şemsiye. Hemşireyiz, not almayı biliriz.
            - Telefonu kapattıktan sonra büro bir süre sessiz kaldı. Leyla'nın odasından radyonun cızırtısı geliyordu; gece haberleri. Bir belediyede bir ihale soruşturması daha.
            ~ Her gece bir yerde bir zarf bulunuyor. Kimse zarfın hangi elden geldiğini haber yapmıyor.
          `),
          next: 'INV1_HUB',
        }),
        option('AK1_B', 'Belki gerçekten kurum evrakıdır. Gelirlerse verin, sorun çıkmasın.', {
          bad: 'Kimliğini söylemeyen birine evrak teslim etmek, sanığın lehine olabilecek bir belgenin kaybolmasına yol açabilir. Kurum, evrakı resmî yazıyla ister.',
          category: 'USUL_BILGISI',
          effects: [dec('trust', 4)],
          responses: B(S`
            zehra{phone}: Babamın evrakını adını söylemeyen birine mi vereyim? Babam duysa... Neyse. Peki. Anladım.
            ~ Yanlış cümle. Zehra'nın sesi bir derece soğudu; acil servis hemşiresi gibi: her şeyi yapar, ama artık güvenmez.
          `),
          next: 'INV1_HUB',
        }),
        option('AK1_C', 'Yarın sizin sokağa gidip kim olduğunu ben öğrenirim.', {
          neutral:
            'Avukat şüpheli kişileri kendisi izlemez; gördüğünü belgeler ve bildirir. Bu seçim bir şey kazandırmaz, yalnızca zaman yer.',
          responses: B(S`
            zehra{phone}: Siz mi? Avukat hanım, adam bir daha gelmez. Gelse de size adını söylemez. Ben size zaman yemeyin derim.
            ~ Haklı. Bir şemsiyenin peşine düşmek, dosyanın peşine düşmek değil.
          `),
          next: 'INV1_HUB',
        }),
      ],
    }),
    story('INV1_AKSAM2', {
      ...INV1,
      title: 'Kapının altından',
      background: 'buro_gece',
      lines: B(S`
        = 2. GÜNÜN AKŞAMI · 22.05 — ARSLAN HUKUK @buro_gece
        - Büroya döndüğümde kapının altında bir zarf vardı. Kahverengi değil; beyaz, sıradan, pulsuz. İçinde tek satır, yazıcı çıktısı.
        - "Tapu işleri uzun sürer, avukat hanım. Bazen ömür boyu." !shake
        - Leyla odasından çıktı, kâğıdı elimden aldı, ışığa tuttu. Filigran yok, imza yok, bir şey yok.
        leyla: Aynı yazıcı mı, bilmiyorum. Ama aynı cümle kuruluşu. Halil'in cebindeki notu yazan, sana da yazmış.
        leyla: Bugün birinin kapısını çaldın, Deniz. Biri de seninkini çaldı. Kimin olduğunu tahmin etme; tahmin, dilekçeye yazılmaz.
        ~ Komiser mi, Devir-2 mi, müdürlükteki herhangi biri mi? Bilmiyorum. Bildiğim şu: biri tedirgin. Tedirgin insanlar hata yapar.
      `),
      choices: [
        option('AK2_A', 'Notu poşetle; yarın savcılığa tehdit olarak bildir.', {
          good: 'Avukata yönelik örtülü tehdit belgelenir ve savcılığa bildirilir (TCK 106; CMK 158). Faili avukat kendisi aramaz.',
          category: 'USUL_BILGISI',
          score: { USUL_BILGISI: 30 },
          effects: [raise('tehdit_bildirildi')],
          responses: B(S`
            - Kâğıdı şeffaf bir dosya poşetine koydum, poşetin üstüne saati yazdım. Leyla başını salladı; onay değil, bir not almaydı bu.
            leyla: Korkuyu kâğıda geçirince küçülmez. Ama başkası da okuyabilir.
          `),
          next: 'INV1_HUB',
        }),
        option('AK2_B', 'Görmezden gel. Duruşmaya on dört gün var; dikkatim dağılmasın.', {
          neutral: 'Belgelenmeyen tehdit sonradan delil olarak kullanılamaz.',
          responses: B(S`
            - Kâğıdı çöpe attım. Sonra çöpten alıp çekmeceye koydum. Sonra çekmeceyi kapattım.
            ~ Bir çekmeceye konan kâğıt kaybolmaz. Ama kimse de onu okumaz. Bu dosyada bunu bilen ilk kişi ben değilim.
          `),
          next: 'INV1_HUB',
        }),
      ],
    }),
    story('INV1_AKSAM2B', {
      ...INV1,
      title: 'Soğuk çay',
      background: 'buro_gece',
      lines: B(S`
        = 2. GÜNÜN AKŞAMI · 22.05 — ARSLAN HUKUK @buro_gece
        - Leyla iki bardak çay koydu, birini soğumaya bıraktı. Masasındaki ters çerçeveye bir an baktı, sonra bana.
        leyla: Bugün ne öğrendin?
        > Bir memurun yirmi yedi yıl boyunca çekmecesini kilitlemediğini. Bir binanın sabahları nasıl koktuğunu. Bir kararın ne kadar dar bir delik olduğunu.
        leyla: İyi. Delik dar olursa, bakan çok şey kaçırır. Kaçırılanı bulmak senin işin.
        leyla: Kural adamlarını savunmak zordur, Deniz. Çünkü bir kez eğildiklerinde, kendilerini affetmezler. Seni de affetmezler, o eğilişi mahkemede söylersen.
        ~ Halil bir şey saklıyor mu? Henüz bilmiyorum. Ama Leyla bir şey biliyor gibi bakıyor. Hep öyle bakar.
      `),
      choices: [
        option('AK2B_A', '“Eğildiyse, bunu ondan duymak isterim. Savcıdan değil.”', {
          effects: [inc('trust', 2)],
          responses: B(S`
            leyla: Doğru sıra bu. Önce müvekkil, sonra mahkeme. Yanlış sırada duyulan doğru, yalan gibi okunur.
          `),
          next: 'INV1_HUB',
        }),
        option('AK2B_B', '“Müvekkilin eğilişi beni ilgilendirmez; ben delile bakarım.”', {
          responses: B(S`
            leyla: Delile bak. Ama delil de bir gün o eğilişi bulur. O gün hazırlıksız olma.
          `),
          next: 'INV1_HUB',
        }),
      ],
    }),
    story('INV1_LEYLA', {
      ...INV1,
      title: 'Leyla’nın odası',
      background: 'buro_gece',
      onEnter: [set('leyla_gun', v('day'))],
      lines: [
        W(
          all(flag('fact_sira_itiraf'), cmp(v('leyla_sira'), '==', 0)),
          S`
            - Leyla, Halil'in sıra dışı randevuyu anlattığı kısmı dinledi. Gözlüğünü çıkarmadı; çıkarmadığında iyi haber değildir, ama kötü de değildir.
            leyla: Bir iyilik, rüşvet değildir. Rüşvet bir karşılık ister: bir iş için bir menfaat. Halil bir şey aldı mı? Almadıysa, o randevu rüşvetin konusu değil, bir yetki aşımıdır.
            leyla: Ama savcı bunu bulursa "işte iş, işte menfaat" der. Önce sen anlat. Belgeyle, gerekçeyle. Bir memurun kendi ağzından duyulan eğilme, kayıttan okunan eğilmeden hafiftir.
            leyla: Ona ne söyleyeceğini söyleme. Doğrunun bedelini ve faydasını anlat. Kararı o versin.
          `,
        ),
        W(
          cmp(v('day'), '==', 1),
          S`
            - Leyla çayını soğumaya bırakmıştı. Masasında eski bir ceza dergisi, sayfası bir AİHM kararında açık.
            leyla: Polis bir muhbire para verip içeri gönderiyorsa iki soru sorarsın. Bir: polis zaten var olan bir suçu mu izledi, yoksa suçu kendisi mi kurdu?
            leyla: İki: o muhbir polisin talimatıyla mı hareket etti? Ettiyse, artık sıradan bir vatandaş değil; devletin eli. Devletin eli bir suçu kışkırtırsa, o delil adil yargılanmayı zehirler.
            leyla: Strazburg bunu defalarca söyledi. Bizim kanunda gizli soruşturmacı var; ama rüşvet o listede yok ve gizli soruşturmacı bir kamu görevlisidir, bir takipçi değil.
            > Yani polis Bayram'ı kendi aleti yaptı.
            leyla: Bunu sen söyleyeceksin; ben söylemedim. Ama tutanağa bak: para kimden çıkmış, cihaz kimden çıkmış, plan kimden çıkmış.
          `,
        ),
        W(
          cmp(v('day'), '==', 2),
          S`
            leyla: Dinleme kararı sana üç şey söyler: hangi suç, hangi hat, hangi süre. Rüşvet, dinlenebilecek suçların listesinde var; savcı bunu söyleyecek. Doğru.
            leyla: Ama liste kapının hangi kapı olduğunu söyler, deliğin büyüklüğünü değil. Süre iki aydır; bir ay uzatılabilir. Uzatılmadıysa, iki ayın ertesi günü kayıt yoktur.
            leyla: Başka bir suça dair tesadüfen bir şey duyulursa, o da kullanılabilir; ama yalnızca kararın içinde, kararın hattında, kararın süresinde duyulduysa. Kararın dışında tesadüf yoktur.
            leyla: Bir de şu: dinleme bittiğinde biri bitiş saatini tutanağa yazmak zorunda. O tutanağı ara. Bulamazsan, yokluğunu dilekçene yaz.
          `,
        ),
        O(S`
          leyla: Rüşvet ile irtikap kardeştir, Deniz; ama biri suç ortaklığıdır, öbürü zorbalık. Rüşvette veren de suçludur; irtikapta veren mağdurdur.
          leyla: Muhbirin bir ifadesi "zorla istedi" diyorsa, o hikâyede muhbir mağdurdur. Öbürü "anlaştık" diyorsa, muhbir suç ortağıdır ve kendini ancak önceden bildirerek kurtarır.
          leyla: Bir adam iki gün arayla iki ayrı rol oynuyorsa, ikisinden birinde yalan söylüyordur. Ya da ikisinde de.
          - Leyla çekmecesinden eski bir dosya çıkardı, kapağına bakmadan geri koydu. Bazı dosyalar açılmak için değil, orada durduklarını bilmek için saklanır.
        `),
      ],
      choices: [
        back('LEYLA_GERI', 'Masana dön', {
          effects: [ifLeylaSira()],
        }),
      ],
    }),
    choiceNode('INV1_DIL', {
      ...INV1,
      title: 'Delil dilekçesi (CMK 177)',
      prompt:
        'Ağır ceza mahkemesine delil dilekçesi. Üç talep hakkın var; her birini dikkatle seç. Seçtiğin talep geri alınmaz.',
      hud: ['dil_hak'],
      choices: [
        option('DIL_KAMERA', '2. kat koridor kamerası, 12 Mart 10.30–10.50 görüntüleri', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 30 },
          effects: [raise('dl_kamera')],
          good: 'Kamera kaydı doksan gün saklanıyor; süre dolmadan istemek gerekir. Talep kabul edildi; kayıt ara karar cevabıyla gelir (CMK 177).',
          next: '$stay',
        }),
        option('DIL_SANTRAL', 'Müdürlük santralinin dahili arama dökümü ve personel izin çizelgesi', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 30 },
          effects: [raise('dl_santral')],
          good: 'Halil’i odasından indiren çağrının hangi dahiliden geldiği santral kaydında yazar. Talep kabul edildi.',
          next: '$stay',
        }),
        option('DIL_CIHAZ', 'İhbarcıya takılan ses kayıt cihazının bilirkişi incelemesi', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 30 },
          effects: [raise('dl_cihaz')],
          good: '“Teknik arıza” bir tespittir, bir varsayım değil; cihazın iç günlüğü bilirkişiyle incelenebilir (CMK 63). Talep kabul edildi.',
          next: '$stay',
        }),
        option('DIL_KARAR', 'Dinleme kararının uzatma kararı ve tedbirin sonlandırma yazısı', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 30 },
          effects: [raise('dl_karar')],
          good: 'Tedbirin bitiş tarihi ve saati tutanağa geçirilmek zorundadır (CMK 137/1). Uzatma yoksa, sonlandırma yazısının tarihi süre dışı kaydı belgeler.',
          next: '$stay',
        }),
        option('DIL_CENGIZ', 'Ateşoğlu hakkındaki soruşturmanın bütün dinleme kayıtları', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          neutral:
            'Başka bir soruşturmanın gizli kayıtlarının tamamı istenemez; mahkeme yalnızca bu davaya ilişkin olanları dosyaya koyar. Talep bu hâliyle reddedildi.',
          next: '$stay',
        }),
        option('DIL_KESIF', 'Kontrol odasında keşif yapılması', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          neutral:
            'Oda yeniden düzenlendi, yedi hafta geçti; keşif yeni bir şey göstermez. Mahkeme talebi reddetti (CMK 206/2-b: karara etkisi yok).',
          next: '$stay',
        }),
        cont('DIL_VER', 'Dilekçeyi ver', '$return', {
          role: 'PRIMARY',
          enabledWhen: cmp(v('dil_hak'), '<', 3),
          lockedReason: 'En az bir talep seç.',
          effects: [raise('dil_verildi')],
        }),
        back('DIL_GERI', 'Şimdilik vazgeç'),
      ],
    }),
    deductionBoard('INV1_CIKARIM', {
      ...INV1,
      title: 'Çıkarım Tahtası',
      background: 'buro_gece',
      lines: B(S`
        - Mantar panoya iğneler, iğnelere kırmızı ip. Leyla bunu "çocuk oyuncağı" diye küçümser, sonra geçerken bir ipi düzeltir.
        ~ İki kartı yan yana koy. Birbirini açıklıyorsa, duruşmada kullanabileceğim bir şey doğar. Açıklamıyorsa, kendimi kandırıyorumdur.
      `),
      pool: POOL_INV1,
      recipes: INV1_RECIPES.map(([id, a, b, ded, title, text]) => deduce(id, a, b, ded, title, text)),
      miss: fallback('FB_CIKARIM', 'COMBINE', {
        repeat: 'ONCE_PER_PARAMS',
        score: { DELIL_ANALIZI: -50 },
        feedback: {
          title: 'Bu ikisi birbirini açıklamıyor',
          text: 'İp gerildi, ama bir şey bağlanmadı. Başka bir çift dene.',
          label: `BAĞLANTI YOK · ${minus(50)} SKOR`,
          tone: 'error',
        },
      }),
      finish: { id: 'CIKARIM_BITIR' },
    }),
    decisionNode('INV1_GECE_1', [{ to: 'INV1_GECE_2' }], {
      ...INV1,
      lines: [
        W(
          all(has('ded_sure_disi'), has('ded_hat_disi')),
          S`
            = 9 MAYIS 2027 · 23.40 — ARSLAN HUKUK @buro_gece
            - Duruşmadan önceki gece. Panoda iki kayıt, iki kırmızı ip: biri süresi bitmiş bir karardan, öbürü hiç karar olmayan bir hattan. İddianamenin iki cümlesi de kapının dışında.
          `,
        ),
        W(
          any(has('ded_sure_disi'), has('ded_hat_disi')),
          S`
            = 9 MAYIS 2027 · 23.40 — ARSLAN HUKUK @buro_gece
            - Duruşmadan önceki gece. Kayıtlardan birinin kapının dışında kaldığını biliyorum. Öbürü hâlâ dosyada, hâlâ konuşuyor.
          `,
        ),
        O(S`
          = 9 MAYIS 2027 · 23.40 — ARSLAN HUKUK @buro_gece
          - Duruşmadan önceki gece. Panoda kayıtların çözümleri var, ama hangi kapıdan alındıklarını hâlâ bilmiyorum. Yarın savcı onları okuyacak.
        `),
      ],
    }),
    decisionNode('INV1_GECE_2', [{ to: 'INV1_GECE_3' }], {
      ...INV1,
      lines: [
        W(
          has('ded_bos_oda'),
          S`- Tutanağın saatleri dosyamda: 10.39 kayıt kesiliyor, 10.44 polis boş odaya giriyor, 10.46 Halil dönüyor. Muhbirin "kendi elimle verdim"i bu saatlere sığmıyor.`,
        ),
        O(
          S`- Zarfın o çekmeceye ne zaman girdiğini hâlâ söyleyemiyorum. Savcı "sanık başındayken" diyecek. Şimdilik haklı görünecek.`,
        ),
      ],
    }),
    decisionNode('INV1_GECE_3', [{ to: 'INV1_GECE_4' }], {
      ...INV1,
      lines: [
        W(
          flag('halil_durust'),
          S`- Halil yarın sıra dışı randevuyu kendisi anlatacak. Bunu ona ben söyletmedim. Ama söyleyebileceğini ben gösterdim. Kürsüde gururu mu konuşacak, kendisi mi, yarın göreceğim.`,
        ),
        W(
          flag('halil_inkar'),
          S`- Halil yarın randevuyu inkâr edecek. Ona bunu ben söyledim. Midemde bir taş var; adı etik.`,
        ),
        W(
          flag('halil_sus'),
          S`- Halil yarın randevu sorulursa susacak. Hakkı. Ama susmak da bir cevaptır; savcı onu kendi cümlesiyle dolduracak.`,
        ),
        O(
          S`- Halil bir şey saklıyor. Bunu hissediyorum ama elimde değil. Yarın kürsüde ne söyleyeceğini ben de ilk kez duyacağım.`,
        ),
      ],
    }),
    decisionNode('INV1_GECE_4', [{ to: 'INV1_GECE_5' }], {
      ...INV1,
      lines: [
        W(
          any(flag('dl_kamera'), flag('dl_santral'), flag('dl_cihaz'), flag('dl_karar')),
          S`- Dilekçe verildi. Kamera, santral, cihaz, karar: neyi istediysem ara kararla gelecek. Gelecek; ama ikinci celseye. Yarın elimde yalnızca bugün olan var.`,
        ),
        O(S`- Mahkemeden hiçbir şey istemedim. Yarın isterim; ama yarın, dünden pahalıdır.`),
      ],
    }),
    decisionNode('INV1_GECE_5', [{ to: 'INV1_GECE_6' }], {
      ...INV1,
      lines: [
        W(
          has('ded_sahte_cagri'),
          S`- Takvimde bir numara: 214. Rehberde iki isim. Halil'i odasından indiren çağrı makamdan gelmedi. Kim aradıysa, Halil'in o dakika odada olmamasını istedi.`,
        ),
        W(
          flag('fact_para_emniyet'),
          S`- Komiserin cümlesi aklımda: "Para bizden, usul bu." Usul. Muhbirin cebindeki her kuruş, devletin cebinden çıkmış.`,
        ),
        W(
          has('ded_yetkisiz'),
          S`- Muhbir "dosyamı bekletiyordu" diyor. Dosya Halil'in masasına hiç gelmemiş. Bekletemeyeceğin bir dosya için zorla para istenmez.`,
        ),
        W(
          flag('ilk_kagit'),
          S`- İlk gün "kâğıt insanlardan önce" demiştim. Kâğıtlar konuştu; şimdi sıra, kâğıdı yarın salonda kimin okuyacağında.`,
        ),
        W(
          flag('ilk_insan'),
          S`- İlk gün "hafıza beklemez" demiştim. Herkesin hafızası bir yere kadar konuştu; geri kalanını yarın kâğıtlar söyleyecek.`,
        ),
        W(
          flag('br01_dogru'),
          S`- Leyla ilk gece bir kez "doğru" demişti. Dört ile on iki. Yarın o dört yılın altına bir çizgi çekmeye çalışacağım.`,
        ),
      ],
    }),
    decisionNode('INV1_GECE_6', [{ to: 'INV1_GECE' }], {
      ...INV1,
      lines: [
        W(
          all(flag('fact_mudur_cagirmadi'), flag('fact_takvim_aliskanlik')),
          S`- Müdür kimseyi çağırmamış. Halil arayanın numarasını yazmış; Zehra'nın dediği gibi, "unutmamak için değil, inkâr etmemek için." Bir alışkanlık, bir alibiden daha sağlam bir tanık.`,
        ),
        W(
          flag('fact_mudur_cagirmadi'),
          S`- Müdür o sabah kimseyi çağırmamış. Biri onun adını kullanmış. Bir binada müdür adına konuşabilen kaç ses var?`,
        ),
        W(
          all(flag('fact_kilitsiz'), flag('fact_ev_ziyaret')),
          S`- Yirmi yedi yıl kilitlenmemiş bir çekmece. Ve Halil'in evine evrak toplamaya gelen, adını söylemeyen biri. Biri bir şey arıyor; ve henüz bulamadı.`,
        ),
        W(
          flag('fact_kilitsiz'),
          S`- Yirmi yedi yıl kilitlenmemiş bir çekmece. Katta herkes biliyordu. Bilen herkes, açabilirdi.`,
        ),
      ],
    }),
    story('INV1_GECE', {
      ...INV1,
      title: 'Gece yarısı',
      background: 'buro_gece',
      lines: B(S`
        - Pano bitmişti; ya da benim bitirebileceğim kadar bitmişti. Kartlar, iğneler, ipler. Ortada bir boşluk: zarfı çekmeceye koyan el.
        - Leyla ceketini giyerken kapıda durdu.
        leyla: Yarın savcı kayıtları okuyacak. Okumadan önce kalk. Okuduktan sonra kalkan, tutanağa "itiraz edildi" diye geçer; itirazın kendisi geçmez.
        - Gitti. Büroda tek başıma kaldım. Masada soğumuş bir çay, ekranda UYAP'ın gri penceresi, camda yağmur.
        - Saat biri geçerken çantamdan bir zarf çıktı. Bu sabah görüş odasında Sabri Bey vermişti: "Halil Bey size yazmış, okuyun dedi."
        - Kurallı, dik, eğilmeyen bir el yazısı. Kâğıdın kenarları masanın kenarıyla hizalanmış gibi düzgün katlanmış.
        ?MEKTUP: Avukat Hanım. Yarın beni değil, kâğıtları dinletin. Ben yirmi yedi yıl kâğıt dinledim; kâğıt yalan söylemez, onu okuyan söyler. Saygılarımla. H. Ekinci.
        ~ Kâğıt yalan söylemez. Ama kâğıdı kimin yazdığını da söylemez. Yarın o boşluğu doldurmam gerekecek.
      `),
      choices: [
        option('GECE_A', 'Mektubu dosyanın en üstüne koy ve uyu.', {
          effects: [inc('trust', 3), raise('gece_mektup')],
          responses: B(S`
            - Mektubu dosyanın en üstüne koydum. Yarın sabah ilk o görünecek; savcının kâğıtlarından önce.
          `),
          next: 'H1_KORIDOR',
        }),
        option('GECE_B', 'Panoya dön; sabaha kadar bir kez daha bak.', {
          effects: [raise('gece_pano')],
          responses: B(S`
            - Sabaha kadar panoya baktım. İplerin hiçbiri yer değiştirmedi. Ama sabah altıda, bir kartın köşesinde yazdığım bir saati yeniden okudum. 10.35.
            ~ Uykusuz bir avukat yeni bir şey bulmaz. Ama bulduğunu unutmaz.
          `),
          next: 'H1_KORIDOR',
        }),
      ],
    }),
  ],
  triggers: [dayEnd.trigger],
  discoveryPaths: dayEnd.discoveryPaths,
};

function ifLeylaSira() {
  return {
    type: 'IF' as const,
    when: flag('fact_sira_itiraf'),
    then: [set('leyla_sira', 1)],
  };
}
