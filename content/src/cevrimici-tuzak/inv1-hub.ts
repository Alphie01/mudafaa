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
    'CB_KAAN',
    'clue_hr_no',
    'clue_satici_no',
    'ded_kaan',
    'Aynı numara',
    'Ece’ye iş veren “Kaan Bey” ile Nurettin’e araba satan “Kaan” aynı hattı kullanıyor. İş ilanı bir işe alım değil, bir av.',
  ],
  [
    'CB_DONGU',
    'clue_avans',
    'clue_mdemir_cikis',
    'ded_dongu',
    'Para geri döndü',
    '“Kira bedeli” denen 4.500 TL’yi gönderen hesap, kaporadan 15.000 TL’yi geri almış. Yem, oltaya geri sarılmış.',
  ],
  [
    'CB_ALDATMA',
    'clue_sgk_mesaj',
    'ev_not',
    'ded_aldatma',
    'SGK sanılan kod',
    'Mesaj “SGK işe giriş kodu” diyor; Ece notuna “SGK” yazmış. Kodu okudu, ama neyi okuduğunu bilmiyordu.',
  ],
  [
    'CB_KESINTI',
    'clue_kvkk_mesaj',
    'ev_sim_dokum',
    'ded_kesinti',
    'Kesinti haber verilmiş',
    'Akşam “hattınız kesilebilir” diyen kişi, ertesi sabah hattın başka bir bayide kopyalanacağını biliyordu.',
  ],
  [
    'CB_BINA',
    'clue_ding_ece',
    'clue_ding_nurettin',
    'ded_bina',
    'Aynı asansör',
    'İki ayrı görüşme, iki ayrı kurban, aynı kayıtlı ses: “Dördüncü kat.” Kaan iki görüşmede de aynı binadaydı.',
  ],
  [
    'CB_SIM',
    'clue_simyok',
    'ev_sim_dokum',
    'ded_sim',
    'Hat elinden alındı',
    '10.12’de başka bir bayide kopya SIM; 10.13’te Ece’nin ekranında “SIM yok”. Banka SMS’leri artık başka bir cebe gidiyordu.',
  ],
];

const POOL_INV1 = [
  'clue_hr_no',
  'clue_satici_no',
  'clue_avans',
  'clue_mdemir_cikis',
  'clue_sgk_mesaj',
  'ev_not',
  'clue_kvkk_mesaj',
  'ev_sim_dokum',
  'clue_ding_ece',
  'clue_ding_nurettin',
  'clue_simyok',
  'clue_qr_atm',
  'clue_lamba',
  'clue_iphone_imei',
  'ev_sozlesme',
  'clue_kartvizit',
  'clue_asansor',
  'clue_levha',
  'clue_kiraci',
  'clue_cv',
  'clue_vesikalik',
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
        'GÜN 1/3 · 1. celseye 12 gün. Kaan Bey kim? Para hesaptan nasıl çıktı?',
        'GÜN 2/3 · 1. celseye 9 gün. 4 Kasım 2025’te telefon kimin elindeydi?',
        'GÜN 3/3 · 1. celseye 6 gün. Delil dilekçesi için son gün; duruşmadan en az beş gün önce verilmeli.',
      ]),
      scenePreview: { scene: 'sc_oda' },
      tabs: [
        {
          id: 't_yer',
          label: 'YERLER',
          kind: 'SCENE',
          choices: [
            p1.activity('A_ODA', 'Ece’nin odasına bak', 'INV1_ODA', {
              once: true,
              description: 'Masa, telefon, laptop · büyüteç 6',
            }),
          ],
        },
        {
          id: 't_kisi',
          label: 'KİŞİLER',
          kind: 'PEOPLE',
          choices: [
            p1.activity('A_ECE', 'Ece ile konuş', 'INV1_ECE', {
              description: 'Sevim Hanım dönmeden 16 dk',
              visibleWhen: not(visited('INV1_ECE')),
              effects: [set('min', 16)],
            }),
            p1.activity('A_ECE2', 'Ece ile yeniden konuş', 'INV1_ECE', {
              description: '8 dk',
              visibleWhen: visited('INV1_ECE'),
              maxUses: 1,
              effects: [set('min', 8)],
            }),
            p1.activity('A_SEVIM', 'Sevim Hanım’ı atölyede gör', 'INV1_SEVIM', {
              once: true,
              description: 'Demirtaş · konfeksiyon atölyesi',
            }),
            p1.activity('A_OM', 'OM İş Merkezi', 'INV1_OM', {
              once: true,
              description: 'İlandaki adres · Osmangazi',
              visibleWhen: flag('fact_nova'),
            }),
            p1.activity('A_BAYI', 'Mavi İletişim bayisi', 'INV1_BAYI', {
              once: true,
              description: 'Kent Meydanı · GSM bayisi',
              visibleWhen: has('ev_sim_dokum'),
            }),
            p1.activity('A_BURAK', 'Burak Toprak', 'INV1_BURAK', {
              once: true,
              description: 'Yıldırım · telefon tamircisi',
              visibleWhen: flag('fact_burak'),
            }),
            p1.activity('A_GOKHAN', 'Kom. Yrd. Gökhan Ateş', 'INV1_GOKHAN', {
              once: true,
              description: 'Emniyet · Siber Şube',
            }),
          ],
        },
        {
          id: 't_kayit',
          label: 'KAYITLAR',
          kind: 'ARCHIVE',
          choices: [
            p1.activity('A_HESAP', 'Hesap hareketlerini incele', 'INV1_HESAP', {
              once: true,
              description: 'Banka yazısı · 6 deneme',
            }),
            p1.activity('A_SIKAYET', 'Şikâyet dilekçesini incele', 'INV1_SIKAYET', {
              once: true,
              description: 'Katılanın dilekçesi ve ekleri · 5 deneme',
            }),
            p1.activity('A_OPERATOR', 'Ece’yle operatör mağazasına git', 'INV1_OPERATOR', {
              once: true,
              description: 'Abonenin kendi kayıtları',
              visibleWhen: flag('fact_operator'),
            }),
            p1.activity('A_DIL', 'Delil dilekçesi (CMK 177)', 'INV1_DIL', {
              description: '3 talep hakkı',
              visibleWhen: not(any(flag('dil_verildi'))),
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
        character: 'ece',
        line: '“Ben aptal değilim avukat hanım. Sadece bir iş istedim.”',
        choices: ['A_ECE', 'A_ECE2'],
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
        { when: any(visited('INV1_OM'), visited('INV1_BAYI'), visited('INV1_BURAK')), to: 'INV1_AKSAM2' },
        { to: 'INV1_AKSAM2B' },
      ],
      { ...INV1, onEnter: dayEnd.node.onEnter },
    ),
    story('INV1_AKSAM1', {
      ...INV1,
      title: 'Telefon',
      background: 'buro_gece',
      lines: B(S`
        = 1. GÜNÜN AKŞAMI · 20.40 — ARSLAN HUKUK @buro_gece
        - Büro boşalmıştı. Kâğıtları dizerken masadaki sabit telefon çaldı. Ekranda tanımadığım bir numara.
        nurettin{phone}: Avukat Deniz Arslan mı? Ben Nurettin Aksoy. Şikâyetçiyim; daha doğrusu, katılmak istiyorum. Adınızı kâtipten öğrendim.
        nurettin{phone}: Size bir şey soracağım; kesmeyin lütfen. O kız benim paramı nereye götürdü? Eşim haftada üç gün diyalize giriyor. Araba onun içindi.
        nurettin{phone}: Ben öğretmendim. Kırk yıl çocuklara "yalan söylemeyin" dedim. Şimdi bir çocuk bana yalan söylemiş. Bunu nasıl anlatayım kendime?
        nurettin{phone}: Bir yıldır her sabah bankanın uygulamasını açıyorum. Belki geri gelir diye. Gelmiyor. Uygulama bana her sabah "Günaydın Nurettin Bey" diyor. Para demiyor.
        nurettin{phone}: Siz genç bir avukatsınız. Sesinizden belli. Ben de genç bir öğretmendim bir zamanlar. İlk yılımda bir çocuğa haksız not vermiştim. Hâlâ unutmam.
        ~ Karşı taraf. Avukatı yok. Öfkesi haklı, hedefi yanlış olabilir. Ve ne söylersem söyleyeyim, duruşmada yeniden duyacağım.
      `),
      choices: [
        option('AK1_A', 'Dinlerim. Ama dosyayı sizinle konuşamam; söyleyecekleriniz mahkemede.', {
          good: 'Avukatı olmayan karşı tarafla nazik ama mesafeli konuşmak doğrudur: yanıltmadan, söz vermeden, mahkemeyi göstererek (TBB Meslek Kuralları).',
          category: 'USUL_BILGISI',
          score: { USUL_BILGISI: 20 },
          effects: [raise('nurettin_saygi')],
          responses: B(S`
            - Hatta uzun bir sessizlik oldu. Nefesi, kırk yıl tahta silgisi tozu solumuş birinin nefesiydi.
            nurettin{phone}: Peki. Mahkemede. Dürüst bir cevap; hoşuma gitmedi ama dürüst. İyi akşamlar.
            ~ Kapatmadan önce bir an durdu. Bir şey daha söyleyecek gibi oldu. Söylemedi.
            - Telefonu kapattıktan sonra büro bir süre sessiz kaldı. Leyla'nın odasından radyonun cızırtısı geliyordu; gece haberleri. Bir dolandırıcılık çetesi daha çökertilmiş, başka bir şehirde.
            ~ Her gece bir çete çökertiliyor. Her sabah yeni bir ilan veriliyor. Nurettin Bey'in parası bu iki cümlenin arasında bir yerde.
          `),
          next: 'INV1_HUB',
        }),
        option('AK1_B', 'Paranızı geri almanız için elimden geleni yapacağım.', {
          bad: 'Karşı tarafa söz vermek, müvekkilin suçunu kabul ediyormuş gibi okunur ve onu yanıltır; avukat karşı tarafı yanıltamaz.',
          category: 'USUL_BILGISI',
          effects: [raise('nurettin_soz')],
          responses: B(S`
            nurettin{phone}: Demek o kız aldı. Demek kabul ediyorsunuz.
            > Öyle demedim, ben…
            nurettin{phone}: Dediniz, hanımefendi. Ben kırk yıl kompozisyon okudum; ne demek istediğinizi anlarım. Mahkemede görüşürüz.
            ~ Bir cümle. Yanlış bir cümle. Duruşmada bunu tekrar duyacağım.
          `),
          next: 'INV1_HUB',
        }),
        option('AK1_C', 'Kapat. Katılanla konuşmak bana düşmez.', {
          neutral: 'Konuşmamak hukuken hatalı değildir; ama sert bir kapanış, duruşmadaki öfkeyi besler.',
          responses: B(S`
            - Telefonu yavaşça yerine koydum. Hat kesilmeden önce bir kelime duydum: "Ayıp."
            ~ Haklıydı belki. Ama onun haklılığı, benim müvekkilimin suçu değil.
          `),
          next: 'INV1_HUB',
        }),
      ],
    }),
    story('INV1_AKSAM2', {
      ...INV1,
      title: 'Tek satır',
      background: 'buro_gece',
      lines: B(S`
        = 2. GÜNÜN AKŞAMI · 22.15 — ARSLAN HUKUK @buro_gece
        - Sevim Hanım bir tencere sarmayla gelmişti. "Avukat aç kalmaz ama yorgun kalır" dedi, tencereyi masama koydu ve gitmedi.
        sevim: Ece bir şey göstermemi istedi. Kendisi utandı, gelmedi.
        - Telefonunu uzattı. Bilinmeyen bir numaradan, gece yarısı gelmiş tek satırlık bir mesaj:
        ?BİLİNMEYEN NUMARA{phone}: Avukatına çok konuşma. İşin yine olur.
        sevim/kizgin: O Burak'tır. Başka kim olacak? "İşin yine olur" ne demek?
        - Mesajın numarası on bir haneli, tanımadığım bir numaraydı. Arayınca "kullanılmayan numara" diyordu. Bir gece için açılmış, bir cümle için kullanılmış, sonra atılmış bir numara.
        ~ Burak'ın numarasını biliyorum; bu o değil. Ama bu, Burak olmadığını da göstermez. Bir numara bir insan değildir. Bir numara bir kapı; arkasında kim olduğunu bilmiyorum.
        sevim: Gece yarısı geldi. Ece uyuyordu, ben gördüm. Telefonu titredi, ekran yandı. Ben okudum. Annesiyim, okurum.
        ~ Bugün sahaya çıktım; birilerinin kapısını çaldım. Ve bu akşam biri, kızın kapısını çaldı. Kim olduğunu bilmiyorum. Ama biri tedirgin.
      `),
      choices: [
        option('AK2_A', 'Mesajın ekran görüntüsünü alalım; savcılığa bildirelim.', {
          good: 'Müvekkile yönelik tehdit belgelenir ve savcılığa bildirilir (TCK 106; CMK 158). Avukat faili kendisi aramaz.',
          category: 'USUL_BILGISI',
          score: { USUL_BILGISI: 30 },
          effects: [raise('tehdit_bildirildi')],
          responses: B(S`
            - Ekran görüntüsünü aldık. Sevim'in eli titriyordu ama telefonu bırakmadı.
            > Yarın sabah savcılığa bir dilekçe veririz. Kim olduğunu aramak bizim işimiz değil; bildirmek bizim işimiz.
            - Sevim ekran görüntüsünü bir kez daha büyüttü, sanki harflerin arasında bir yüz görecekmiş gibi. Sonra telefonu çantasına koydu, tencereyi masada bırakıp gitti.
            sevim: Siz bilirsiniz. Ama ben o çocuğu biliyorum.
          `),
          next: 'INV1_HUB',
        }),
        option('AK2_B', 'Ciddiye almayın; böyle mesajlar çok gelir.', {
          neutral: 'Tehdit belgelenmezse sonradan delil olarak kullanılamaz.',
          responses: B(S`
            sevim: Siz ciddiye almayın. Ben annesiyim, ben alırım.
            - Tencereyi bıraktı, kapağını almadan gitti.
          `),
          next: 'INV1_HUB',
        }),
      ],
    }),
    story('INV1_AKSAM2B', {
      ...INV1,
      title: 'Sarma',
      background: 'buro_gece',
      lines: B(S`
        = 2. GÜNÜN AKŞAMI · 22.15 — ARSLAN HUKUK @buro_gece
        - Sevim Hanım bir tencere sarmayla gelmişti. "Avukat aç kalmaz ama yorgun kalır" dedi, tencereyi masama koydu ve gitmedi.
        sevim: Ece bütün gün odasında. Tabloyu açıp açıp kapatıyor. Yüz kırk üç satır. "Anne, yüz kırk dördüncüyü kim yazacak?" diyor.
        sevim/uzgun: Ona ben dedim "ne iş bulursan gir" diye. Ben dedim. Şimdi bana bakmıyor bile.
        ~ Bazı annelerin dikişi hiç sökülmez. Sadece içeriden, kimse görmeden, gerilir.
        sevim: Ece size bir şey anlattı mı? Bana anlatmıyor. Gözlerinden anlıyorum, bir şey var. Kızım bir şey saklarken hep tırnağını kazır.
        ~ Tırnak. Kırık bir oje. Anneler her şeyi görür; ama gördüklerinin adını koyamazlar.
      `),
      choices: [
        option('AK2B_A', 'Sizin suçunuz değil, Sevim Hanım. Bir iş istemek suç değil.', {
          effects: [inc('trust', 4)],
          responses: B(S`
            - Sevim başını salladı. İnanmadı, ama tencerenin kapağını da bıraktı.
            sevim: Kapağı yarın alırım. Siz yiyin.
          `),
          next: 'INV1_HUB',
        }),
        option('AK2B_B', 'Bunu Ece’yle konuşmanız lazım; bana değil.', {
          responses: B(S`
            sevim: Haklısınız. Ama bazen bir yabancıya söylemek daha kolay.
            - Gitti. Tencere masamda kaldı; buharı camı buğuladı.
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
          all(flag('fact_kod_itiraf'), cmp(v('leyla_kod'), '==', 0)),
          S`
            - Leyla, Ece'nin itirafını dinledi. Gözlüğünü çıkarmadı; çıkarmadığında iyi haber değildir, ama kötü de değildir.
            leyla: Aldatılarak verilen bir kod kast değildir. Dolandırıcılığa katılmak için, neye katıldığını bilmek gerekir.
            leyla: Ama inkâr ederse, inkârın kendisi delil olur. Savcı bankanın saatini masaya koyduğunda, yalan doğrudan daha ağır gelir.
            leyla: Ona ne söyleyeceğini söyleme. Doğruyu söylemenin bedelini ve faydasını anlat. Kararı o versin.
          `,
        ),
        W(
          cmp(v('day'), '==', 1),
          S`
            - Leyla çayını soğumaya bırakmıştı; soğuk çayı sever, kimse nedenini bilmez.
            leyla: Savcının iddianamesinde müvekkilin "fail". Birlikte işlemiş, yani. Bunun bir ağır, bir hafif hâli var.
            leyla: Fiili birlikte yapan faildir. Yalnızca araç sağlayan, yolu gösteren yardım edendir; onun cezası yarıya iner.
            leyla: Ama ikisi de bir şeyi şart koşar: bilmek. Bilmeden verilen hesap, iştirak değildir. Önce "biliyor muydu"yu bul. Sonra hangi kutuya gireceğini düşünürsün.
            leyla: Bilmeden suça katılmak diye bir şey yoktur, Deniz. Kast, neyi yaptığını bilmek ve istemektir. Hesabını bir dolandırıcıya kaptıran, dolandırıcılığın ortağı olmaz; kurbanı olur.
            > Ya bildiğini bulursam?
            leyla: O zaman ona yalan söyletmezsin. Ve yine de onu savunursun. İşimiz bu.
          `,
        ),
        W(
          cmp(v('day'), '==', 2),
          S`
            leyla: Telefon kayıtları istiyorsun. İyi. Ama kimin telefonu?
            leyla: Sanığın hattı için mahkeme karar verebilir; hat müvekkilinin, yani sanığın. Tanığın ya da tanımadığın birinin hattı için bu yol kapalı.
            leyla: Başkasının hattına ancak o kişi şüpheli olursa, bir soruşturmada bakılır. Yani önce bir suç duyurusu. Somut, belgeli. Dedikoduyla değil.
            leyla: Bir de şu: bir hat bir kartın içinde yaşar, ama kart bir telefonun içinde. Telefonun da bir kimliği vardır. Unutma.
            leyla: Ben bunları gençken dinleme kayıtlarından öğrendim. Kasetlerden. Şimdi her şey bir ekranda, ama mantık aynı: kim, nerede, hangi aletle.
          `,
        ),
        O(S`
          leyla: Yarın değil, öbür hafta sanığın sorgusu var. Müvekkilin kürsüde ilk kez kendi ağzıyla konuşacak.
          leyla: Avukat müvekkiline yalan söyletmez. Susma hakkını hatırlatır; doğrunun bedelini anlatır. Gerisi onun.
          leyla: Ve dilekçeni bugün ver. Beş gün kuralı, beş gün değil; senin unutkanlığına verilmiş son şanstır.
          - Leyla çekmecesinden eski bir dosya çıkardı, kapağına bakmadan geri koydu. Bazı dosyalar açılmak için değil, orada durduklarını bilmek için saklanır.
        `),
      ],
      choices: [
        back('LEYLA_GERI', 'Masana dön', {
          effects: [ifLeylaKod()],
        }),
      ],
    }),
    choiceNode('INV1_DIL', {
      ...INV1,
      title: 'Delil dilekçesi (CMK 177)',
      prompt: 'Mahkemeye delil dilekçesi. Üç talep hakkın var; her birini dikkatle seç. Seçtiğin talep geri alınmaz.',
      hud: ['dil_hak'],
      choices: [
        option('DIL_LOG', 'Bankadan mobil şubeye tanımlı cihazlar ve oturum kayıtları', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 30 },
          effects: [raise('dl_log')],
          good: 'İşlemlerin hangi cihazdan yapıldığı, hesabın kimin elinde olduğunu gösterir. Talep kabul edildi; kayıt 1. celsede okunacak.',
          next: '$stay',
        }),
        option('DIL_HTS', 'Müvekkilin hattı için 3–5 Kasım iletişim tespiti, IMEI dahil', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 30 },
          effects: [raise('dl_hts')],
          good: 'Sanığın kendi hattı için kovuşturmada mahkeme kararıyla iletişimin tespiti yapılabilir (CMK 135/6). Kayıt ara karar cevabıyla gelir.',
          next: '$stay',
        }),
        option('DIL_BAYI', 'Operatörden SIM değişikliğinde kullanılan belgeler', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 30 },
          effects: [raise('dl_bayi')],
          good: 'Bayi SIM değişikliğinde kimlik ve varsa vekâletnameyi sisteme yükler; mahkeme yazısıyla istenebilir. Belgeler ara karar cevabıyla gelir.',
          next: '$stay',
        }),
        option('DIL_ATM', 'Bankadan ATM kamera görüntüleri', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 20 },
          effects: [raise('dl_atm')],
          good: 'Kartsız çekimi yapan kişinin görüntüsü sanığın kendisi olup olmadığını gösterir. Görüntü ara karar cevabıyla gelir.',
          next: '$stay',
        }),
        option('DIL_KESIF', 'Para çekilen ATM’nin bulunduğu yerde keşif', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          neutral:
            'Bir yıl sonra ATM’nin önünde keşif hiçbir şey göstermez; mahkeme talebi reddeder (CMK 177; keşfin konusu kalmamış).',
          next: '$stay',
        }),
        option('DIL_NOVA', '“Nova Dijital” yetkilisinin tanık olarak çağrılması', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          neutral: 'Kimliği ve adresi belirsiz bir kişiye davetiye çıkarılamaz; talep bu hâliyle sonuçsuz kalır.',
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
          has('ded_kaan'),
          S`
            = 3 KASIM 2026 · 23.50 — ARSLAN HUKUK @buro_gece
            - Duruşmadan önceki gece. Panoda iki numara, aynı ipin iki ucunda: işveren ve satıcı aynı adam. Ece bir işe değil, bir tuzağa başvurmuştu.
          `,
        ),
        O(S`
          = 3 KASIM 2026 · 23.50 — ARSLAN HUKUK @buro_gece
          - Duruşmadan önceki gece. Panoda kartlar var, ama ortası boş: Kaan Bey bir isim, bir ses, bir numara. Kim olduğunu hâlâ bilmiyorum.
        `),
      ],
    }),
    decisionNode('INV1_GECE_2', [{ to: 'INV1_GECE_3' }], {
      ...INV1,
      lines: [
        W(
          any(has('ded_sim'), has('ev_sim_dokum')),
          S`- Operatörün dökümü dosyamda: 4 Kasım 10.12'de hat başka bir bayide, bir vekille değiştirilmiş. Savcının "SMS'ler sanığa gitti" cümlesinin altı oyuk.`,
        ),
        O(
          S`- 4 Kasım'da banka SMS'lerinin hangi telefona gittiğini hâlâ kanıtlayamıyorum. Savcı "sanığın hattına" diyecek. Şimdilik haklı görünecek.`,
        ),
      ],
    }),
    decisionNode('INV1_GECE_3', [{ to: 'INV1_GECE_4' }], {
      ...INV1,
      lines: [
        W(
          flag('ece_durust'),
          S`- Ece yarın doğruyu anlatacak: kodu okuduğunu, neyi okuduğunu bilmediğini. Bunu ona ben söyletmedim. Ama söyleyebileceğini ben gösterdim.`,
        ),
        W(
          flag('ece_inkar'),
          S`- Ece yarın inkâr edecek. "Kimseyle kod paylaşmadım." Ona bunu ben söyledim. Midemde bir taş var; adı etik.`,
        ),
        W(
          flag('ece_sus'),
          S`- Ece yarın kod sorulursa susacak. Hakkı. Ama susmak da bir cevaptır; savcı onu kendi cümlesiyle dolduracak.`,
        ),
        O(
          S`- Ece bir şey saklıyor. Bunu hissediyorum ama elimde değil. Yarın kürsüde ne söyleyeceğini ben de ilk kez duyacağım.`,
        ),
      ],
    }),
    decisionNode('INV1_GECE_4', [{ to: 'INV1_GECE_5' }], {
      ...INV1,
      lines: [
        W(
          flag('dl_log'),
          S`- Bankanın cihaz kayıtları yarın açılacak. Ne yazdığını bilmiyorum; ama bir yıl boyunca kimse sormamıştı.`,
        ),
        O(S`- Bankaya hangi cihazdan girildiğini sormadım. Yarın duruşmada sorarım; ama yarın, dünden pahalıdır.`),
      ],
    }),
    decisionNode('INV1_GECE_5', [{ to: 'INV1_GECE_6' }], {
      ...INV1,
      lines: [
        W(
          all(flag('fact_polis_eksik'), flag('fact_gokhan_mantik')),
          S`- Gökhan'ın mantığı sağlam, öncülü çürük: "Kod paylaşılmadıysa cihazı sanık tanımlamıştır." Ve polis cihazı hiç sormamış. Yarın o öncül kürsüye çıkacak.`,
        ),
        W(
          flag('fact_polis_eksik'),
          S`- Polis bankadan cihaz kaydını hiç istememiş. "Mobil kanal" iki kelime; bir yıl boyunca kimse ikinci kelimeyi sormamış.`,
        ),
        W(
          flag('fact_imei'),
          S`- Burak'ın cümlesi aklımda: kart değişir, telefon değişmez. Sevim Hanım'ın kutusunda on beş hane. Bir gün işe yarayacak.`,
        ),
        W(flag('fact_bayi_yol'), S`- Bayideki genç haklıydı: belgeler operatörde. Tezgâhta değil, mahkeme yazısında.`),
      ],
    }),
    decisionNode('INV1_GECE_6', [{ to: 'INV1_GECE' }], {
      ...INV1,
      lines: [
        W(
          flag('fact_sevim_arama'),
          S`- Sevim Hanım'ın telefonu 4 Kasım 11.05'te bir numarayı aramış. Ece'nin ekran görüntüsündeki numara. Kaan, kızın annesinin telefonuna da cevap vermiş; sesi yumuşak, "sistem göçü."`,
        ),
        W(
          flag('br01_dogru'),
          S`- Leyla ilk gün bir kez "doğru" demişti. Ceza aralığı için. Dört yıl. Yarın o dört yılın altına bir çizgi çekmeye çalışacağım.`,
        ),
      ],
    }),
    story('INV1_GECE', {
      ...INV1,
      title: 'Gece yarısı',
      background: 'buro_gece',
      lines: B(S`
        - Pano bitmişti; ya da benim bitirebileceğim kadar bitmişti. Kartlar, iğneler, ipler. Ortada bir boşluk: Kaan. Etrafında Ece, Nurettin, bir bayi, bir iş merkezi.
        - Leyla ceketini giyerken kapıda durdu.
        leyla: Yarın Ece kürsüde ne söylerse, sen onu duy. İstediğini değil.
        - Büroda tek başıma kaldım. Masada soğumuş bir çay, ekranda bankanın yazısını bekleyen bir UYAP sekmesi, camda yağmur. Bursa'nın gece yarısı sesi: uzaklarda bir siren, yakınlarda bir oluk.
        - Gitti. Saat biri geçerken telefonum titredi. Ece'den bir mesaj.
        ece{phone}: Uyuyamadım. Yarın ne giyeyim? İş görüşmesine gider gibi mi?
        ~ Bir yıl önce bir iş görüşmesine giderken her şeyini kaybetti. Şimdi aynı kıyafeti mahkemeye giymek istiyor.
      `),
      choices: [
        option('GECE_A', '“Kendin gibi gel. Ve ne olursa olsun, doğruyu söyle.”', {
          effects: [inc('trust', 4), raise('gece_mesaj')],
          responses: B(S`
            ece{phone}: Tamam. Kendim gibi. Kendim nasıldı, onu da hatırlamaya çalışacağım.
          `),
          next: 'H1_KORIDOR',
        }),
        option('GECE_B', '“Koyu renk bir şey. Ciddi görün; gerisini bana bırak.”', {
          responses: B(S`
            ece{phone}: Tamam. Ciddi. Sizin gibi.
            ~ Benim gibi. Bilmiyor ki ben de bu gece ciddi değil, korkmuş görünüyorum.
          `),
          next: 'H1_KORIDOR',
        }),
        option('GECE_C', 'Cevap verme. Uyu.', {
          effects: [dec('trust', 2)],
          responses: B(S`
            - Telefonu ters çevirdim. Ekranın ışığı masanın üstünde bir süre yandı, sonra söndü.
          `),
          next: 'H1_KORIDOR',
        }),
      ],
    }),
  ],
  triggers: [dayEnd.trigger],
  discoveryPaths: dayEnd.discoveryPaths,
};

function ifLeylaKod() {
  return {
    type: 'IF' as const,
    when: flag('fact_kod_itiraf'),
    then: [set('leyla_kod', 1)],
  };
}
