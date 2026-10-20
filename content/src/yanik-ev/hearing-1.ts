import {
  all,
  any,
  cont,
  courtSession,
  dec,
  decisionNode,
  fallback,
  flag,
  ground,
  has,
  hl,
  ifThen,
  inc,
  mark,
  met,
  not,
  objectRule,
  option,
  presentRule,
  pressRule,
  raise,
  score,
  statement,
  story,
  choiceNode,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { HEAR1, card, court1, me, n, s, th, wrongEvidence } from './shared.js';

// 60-hearing-1: birinci celse. Koridor, açılış, iddianame, Halil'in savunması ve müdafiin soruları, ekspertiz raporunun
// okunmasına itiraz, Saadet Koru'nun çapraz sorgusu, bilirkişiye telkin edici soru, Dr. Tezel'in çapraz sorgusu, CMK 206/1
// talepleri ve ara karar (tutukluluk incelemesi).

const savcilikDelili = (id: string) =>
  presentRule(id, undefined, ['ev_fis', 'ev_icra', 'ev_ekspertiz'], {
    maxUses: 3,
    effects: [
      ...wrongEvidence,
      score('SORGULAMA', -150, 'hatali'),
      mark(
        'BAD',
        'İddianın delilini kendi tanığına “çelişki” diye sundun: fiş, icra kayıtları ve ekspertiz raporu savcılığın dayanaklarıdır; tanığın anlatımını çürütmez.',
        'SORGULAMA',
      ),
    ],
    responses: [
      {
        lines: [
          s('katilan', 'Sayın Hâkim, müdafi bizim delilimizi bize sunuyor. Teşekkür ederiz.'),
          s('hakim', 'Müdafi, bu belgenin tanığın beyanıyla çelişkisini göremedim. Devam edin.'),
        ],
      },
    ],
  });

const presentMiss = (id: string) =>
  fallback(id, 'PRESENT', {
    effects: [
      ...wrongEvidence,
      score('SORGULAMA', -150, 'hatali'),
      mark('BAD', 'Yanlış delil: sunduğun belge bu ifadeyle çelişmiyor.', 'SORGULAMA'),
    ],
    responses: [{ lines: [s('hakim', 'Bu delilin beyanla ilgisini göremedim, müdafi.')] }],
  });

const objectMiss = (id: string) =>
  fallback(id, 'OBJECT', {
    effects: [
      dec('cred'),
      inc('wrong'),
      score('SORGULAMA', -50, 'hatali'),
      mark('BAD', 'Dayanaksız itiraz.', 'SORGULAMA'),
    ],
    responses: [{ lines: [s('hakim', 'İtiraz reddedildi. Devam edelim.')] }],
  });

export const hearing1: CasePart = {
  config: {
    objectionGrounds: [
      ground('g_kanaat', 'Tanığın kişisel kanaati', 'CMK 52, 217'),
      ground('g_uzmanlik', 'Bilirkişinin hukuki değerlendirme yapması', 'CMK 67/3'),
      ground('g_duyum', 'Görmediğini duyuma dayanarak aktarma', 'CMK 210, 217'),
    ],
  },
  court: {
    sessions: [
      courtSession('cs_1', '1. Celse', [
        ['s1_acilis', 'ACILIS', 'H1_00'],
        ['s1_iddianame', 'IDDIANAME', 'H1_01'],
        ['s1_savunma', 'SANIK_SAVUNMASI', 'H1_02'],
        ['s1_tanik', 'TANIK_DINLEME', 'H1_04'],
        ['s1_delil', 'DELIL_TARTISMA', 'H1_07'],
      ]),
    ],
  },
  nodes: [
    decisionNode('H1_00K', [{ to: 'H1_00K2' }], {
      ...HEAR1,
      title: 'Adliye koridoru',
      onEnter: [raise('in_court')],
      lines: [
        {
          lines: [
            card('14 NİSAN · PAZARTESİ 09.05 — BURSA ADLİYESİ, KORİDOR', 'adliye'),
            n(
              'Koridor ıslak şemsiyeler, telaşlı cübbeler ve bir çaycının tepsisiyle doluydu. Yedinci Asliye Ceza’nın kapısında bir liste: dokuz dosya, bizimki dördüncü.',
            ),
            n(
              'Zehra bir bankın ucunda oturuyordu, kucağında katlanmış bir ceket. Nöbetten çıkmıştı; formasının yakası paltosunun altından görünüyordu.',
            ),
          ],
        },
      ],
    }),
    decisionNode('H1_00K2', [{ to: 'H1_00K3' }], {
      ...HEAR1,
      lines: [
        {
          when: flag('zehra_sor'),
          lines: [
            s('zehra', 'Sordum. Cuma günü. Gözlerinin içine bakıp sordum: “Baba, evi sen mi yaktın?”'),
            s(
              'zehra',
              'Ağladı. Annem öldüğünden beri ilk kez. “Ben o evin tozunu bile almaya kıyamazdım” dedi. İnandım. Bilmiyorum neden; inandım.',
              'uzgun',
            ),
          ],
        },
      ],
    }),
    decisionNode('H1_00K3', [{ to: 'H1_00K4' }], {
      ...HEAR1,
      lines: [
        {
          when: flag('mektup'),
          lines: [
            me('Bunu babanız istedi. Sandıktaydı.'),
            n(
              'Kurdeleli bir mektup destesi. Zehra annesinin el yazısını görünce elini ağzına götürdü; desteyi açmadı, çantasına koydu.',
            ),
            s('zehra', 'Sonra okuyacağım. Bugün değil. Bugün babamın yüzüne bakmam lazım.', 'uzgun'),
          ],
        },
      ],
    }),
    story('H1_00K4', {
      ...HEAR1,
      title: 'Adliye koridoru',
      background: 'adliye',
      lines: [
        {
          lines: [
            n(
              'Koridorun ucunda ring aracının kapısı açıldı. Halil iki jandarmanın arasında, kelepçesiz ama yürüyüşü kelepçeliydi. Zehra ayağa kalktı; ceketi uzattı.',
            ),
            s('halil', 'Omuzları dar, kızım. Ama olur. Annen de hep bir beden küçük alırdı; “büyürsün” derdi.'),
            n(
              'Bankların birinde takım elbiseli, kırklarında bir adam dosyasını dizine koymuş, notlar alıyordu. Kusursuz bir kravat, kusursuz bir sessizlik. Katılan vekilinin yanına geçip bir şey fısıldadı.',
            ),
            th(
              'Kalkan Sigorta’nın eksperi. Raporun altındaki imza. Benimle göz göze geldi ve kibarca başını eğdi. Ben de eğdim. Kibarlık, bazen bir silahın kılıfıdır.',
            ),
            n(
              'Pencerenin önünde Saadet Hanım, siyah bir manto, elinde bir tespih. Beni görünce tespihi çantasına soktu; bir suç aletini saklar gibi. Savcılığın tanığıydı ve bunu biliyordu.',
            ),
            th(
              'Bugün o kadının hafızasını sınayacağım. Yalancı çıkarmadan. Leyla’nın cümlesi: “Hatırladığı şeyi kimin ona hatırlattığını göster.” Bir hafıza da bir olay yeri gibidir; kimin bastığına bakarsın.',
            ),
            n('Halil’le iki dakikam vardı. Jandarma saatine baktı.'),
          ],
        },
      ],
      choices: [
        option('K_DOGRU', 'İçeride ne sorulursa doğrusunu, kısa söyleyin. Bilmediğinizi bilmiyorum deyin.', {
          effects: [raise('halil_hazir'), inc('trust', 3)],
          responses: [
            {
              lines: [
                s('halil', 'Kısa. Doğru. Kumaşı keserken de öyle yaparım; bir kere ölç, bir kere kes.'),
                th('Bir müvekkile söylenecek en iyi şey, en kısa olanıdır.'),
              ],
            },
          ],
          next: 'H1_00',
        }),
        option('K_BORC', 'Borçlardan hiç söz etmeyin; sorulursa da geçiştirin.', {
          effects: [raise('borc_gizle'), dec('trust', 3)],
          bad: 'Dosyada zaten olan bir gerçeği müvekkile “geçiştirmesini” söylemek, onu duruşmada yalan söyleyen ya da kaçamak cevap veren biri gibi gösterir. Avukat müvekkile susma hakkını anlatır; kaçamak cevap öğretmez.',
          category: 'SAVUNMA_STRATEJISI',
          responses: [
            {
              lines: [
                s('halil', 'Geçiştireyim mi? Peki… Siz bilirsiniz.', 'uzgun'),
                th('“Siz bilirsiniz.” Bir müvekkilin, avukatına en çok güvendiği ve en çok yalnız kaldığı cümle.'),
              ],
            },
          ],
          next: 'H1_00',
        }),
        option('K_SUS', 'Bugün susma hakkınızı kullanın; konuşmayı sonraki celseye bırakalım.', {
          effects: [raise('halil_sustu')],
          neutral:
            'Susma hakkı sanığın anayasal hakkıdır (Anayasa 38/5, CMK 147/1-e) ve aleyhe yorumlanamaz; ama hâkim sanığın kendi anlatımını ilk celsede duymamış olur.',
          responses: [
            {
              lines: [s('halil', 'Susayım mı? İki aydır susuyorum zaten. Bir gün daha susarım.', 'uzgun')],
            },
          ],
          next: 'H1_00',
        }),
      ],
    }),
    court1.stage('H1_00', {
      title: 'Açılış',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      lines: [
        {
          lines: [
            card('14 NİSAN · 09.30 — BURSA 7. ASLİYE CEZA MAHKEMESİ', 'durusma_salonu'),
            s('mubasir', 'Halil Bozkurt dosyası! Halil Bozkuuurt! Taraflar içeri!'),
            n(
              'Salon küçüktü: tek bir kürsü, bir kâtip masası, savcı sağda, katılan vekili solda. Pencereden adliye bahçesinin ıslak çamları görünüyordu.',
            ),
            n(
              'Hâkim Nilgün Aksoy dosyayı açtı, gözlüğünü taktı, salona bir kez baktı. Bakışı bir terazi gibiydi: önce bir kefe, sonra öteki.',
            ),
            s(
              'hakim',
              'Duruşmaya başlandı. Tutuklu sanık Halil Bozkurt hazır, müdafii Av. Deniz Arslan hazır. Katılan Kalkan Sigorta vekili hazır. Cumhuriyet savcısı hazır.',
            ),
            s(
              'hakim',
              'Sanık, kimlik bilgilerinizi doğruladık. Size yöneltilen suçlamayı dinleyeceksiniz; susma hakkınız var, müdafiinizle görüşme hakkınız var. Anladınız mı?',
            ),
            s('halil', 'Anladım, hâkim hanım.'),
            th('Tek hâkim. Bir vicdan. Leyla’nın sözü: “İkna edeceğin vicdan da tek.”'),
          ],
        },
      ],
      choices: [cont('H100_DEVAM', 'Devam', 'H1_01')],
    }),
    court1.stage('H1_01', {
      title: 'İddianame',
      courtStage: 'IDDIANAME',
      background: 'durusma_salonu',
      lines: [
        {
          lines: [
            s('hakim', 'İddianame özetlensin. Sayın Savcı.'),
            s(
              'savci',
              'Sanık, Muradiye Kalem Sokak 9’daki ahşap evini 30 Kasım’da sigortalatmış, 3 Ocak’ta teminatı bir milyon iki yüzden bir milyon sekiz yüze çıkarmıştır.',
            ),
            s(
              'savci',
              '9 Ocak’ta eşyalarını taşımış, 12 Ocak’ta bidonla benzin almış, 15 Ocak gecesi evinde bulunmamış. Yangın, bilirkişi raporuna göre salonda, benzinle çıkarılmıştır.',
            ),
            s(
              'savci',
              'Yangın yan binaya sıçramış, iki aile tahliye edilmiştir. Sanık ertesi gün hasar ihbarında bulunmuş; bedel, şirketin şüphesi üzerine ödenmemiştir.',
            ),
            s(
              'savci',
              'Tek tek bakınca her şeyin bir açıklaması var, Sayın Hâkim. Yan yana koyunca yok. TCK 170/1-a ve 158/1-k ile 35 uyarınca cezalandırılmasını talep ediyoruz.',
            ),
            th('“Yan yana koyunca.” Leyla’nın halatı. Savcı onu kürsüye astı; şimdi sırada iplikleri ayırmak var.'),
          ],
        },
      ],
      choices: [cont('H101_DEVAM', 'Devam', 'H1_02')],
    }),
    court1.stage('H1_02', {
      title: 'Sanığın savunması',
      courtStage: 'SANIK_SAVUNMASI',
      background: 'durusma_salonu',
      lines: [
        {
          when: flag('halil_sustu'),
          lines: [
            s('hakim', 'Sanık, iddianameyi dinlediniz. Savunmanız?'),
            s('halil', 'Hâkim hanım, avukatımla konuştum. Bugün susma hakkımı kullanıyorum.'),
            n(
              'Savcı kalemini masaya bıraktı. Katılan vekili bir şey not etti. Hâkim başını salladı; yüzünde bir şey kıpırdamadı.',
            ),
            s('hakim', 'Susma hakkınız saklıdır. Müdafi, sanığa sorunuz var mı?'),
            th(
              'Susma hakkı bir kalkan. Ama kalkanın arkasında bir yüz görünmez. Hâkim Halil’in yüzünü bugün görmeyecek.',
            ),
          ],
        },
        {
          lines: [
            s('hakim', 'Sanık, iddianameyi dinlediniz. Savunmanız?'),
            n(
              'Halil ayağa kalktı. Ceketin omuzları gerildi. Ellerini önünde birleştirdi, sonra çözdü; ne yapacaklarını bilmeyen eller.',
            ),
            s('halil', 'Hâkim hanım, o ev karımın eviydi. Nermin’in. Dedesinden kalma. İki yıl önce o evde öldü.'),
            s(
              'halil',
              'Ben döşemeciyim. Otuz yıldır kumaş gererim. O evin kapılarını, tavanlarını, merdiven korkuluğunu kendi elimle cilaladım.',
            ),
            s(
              'halil',
              'Kredi çektim; evi Nermin’in istediği gibi yapacaktım. Usta tuttum. Ocakta başlayacaktık. Eşyaları usta istedi diye taşıdım.',
            ),
            s('halil', 'O gece atölyedeydim. Bir otelin sandalyelerini kaplıyordum. Sabah kızım aradı.', 'uzgun'),
            s('halil', 'Ben o evi yakmadım. O evin tozunu almaya kıyamazdım. Bu kadar.', 'uzgun'),
            n('Salonda bir sessizlik. Kâtibin klavyesi durdu, sonra yeniden başladı.'),
            s('hakim', 'Müdafi, sanığa sorunuz var mı?'),
          ],
        },
      ],
      choices: [cont('H102_DEVAM', 'Sanığa sorular', 'H1_02Q')],
    }),
    choiceNode('H1_02Q', {
      ...court1.base,
      title: 'Müdafiin soruları',
      background: 'durusma_salonu',
      lines: [
        {
          lines: [
            th(
              'Bir müvekkile mahkemede soru sorarken tek kural: cevabını bildiğin soruyu sor. Ve hâkimin duymasını istediğin cevabı.',
            ),
          ],
        },
      ],
      prompt: 'Sanığa hangi soruları yöneltiyorsun?',
      choices: [
        option('Q_BENZIN', '12 Ocak’ta aldığınız benzin ne içindi, şimdi nerede?', {
          visibleWhen: any(has('clue_jenerator'), has('clue_bidon')),
          score: { SORGULAMA: 40 },
          effects: [raise('q_benzin')],
          responses: [
            {
              lines: [
                s(
                  'halil',
                  'Atölyedeki jeneratör için. Sanayide elektrik çok kesiliyor. Bir litre koydum; bidon atölyede duruyor, jeneratörün yanında.',
                ),
                s('savci', 'Bidonu gören oldu mu, sanık?'),
                s('halil', 'Kimse sormadı ki, Sayın Savcı. Avukatım gördü.'),
                n('Savcı bir şey not etti. Bu sefer kalemini bırakmadı.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('Q_ESYA', 'Eşyaları neden taşıdınız, hangilerini?', {
          visibleWhen: any(flag('fact_esya'), has('clue_restorasyon')),
          score: { SORGULAMA: 40 },
          effects: [raise('q_esya')],
          responses: [
            {
              lines: [
                s('halil', 'Restorasyon ustası odaların on beşine kadar boşalmasını istedi. Sözleşmede yazıyor.'),
                s(
                  'halil',
                  'Karımın çeyiz sandığını, babamın konsolunu, bir dikiş makinesini taşıdım. Televizyon, buzdolabı, yeni koltuklar evde kaldı; yandı.',
                ),
                th('Değerli olan kaldı, sevilen gitti. Hâkim bunu not etti mi, göremedim.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('Q_ELEKTRIK', 'Evin elektrik tesisatı hakkında size bir şey söylenmiş miydi?', {
          visibleWhen: flag('fact_elektrikci'),
          score: { SORGULAMA: 20 },
          effects: [raise('q_elektrik')],
          responses: [
            {
              lines: [
                s(
                  'halil',
                  'Elektrikçi Necati Usta aralıkta baktı. “Eski, koridordaki kutu ısınmış, restorasyonda yenileyelim” dedi.',
                ),
                s('katilan', 'Yani sanık tesisatın tehlikeli olduğunu biliyordu. Kayda geçsin.'),
                th(
                  'Kapı açıldı; savcı tarafına da. Ardından gelecek soruyu sormazsam bu cümle başka bir suçun anahtarı olur.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('Q_ONLEM', 'Bu uyarıdan sonra ne yaptınız?', {
          visibleWhen: { chosen: 'Q_ELEKTRIK' },
          score: { SORGULAMA: 40 },
          effects: [raise('q_onlem')],
          responses: [
            {
              lines: [
                s(
                  'halil',
                  'Usta “ağır yük çekme” dedi; çekmedim. Restorasyonun ilk haftasına tesisatı koyduk. On dokuz ocakta başlayacaktı.',
                ),
                s('halil', 'Son hafta evde de yaşamıyordum zaten. Fişler çekiliydi; bir tek buzdolabı.'),
                th('Uyarı, sonra önlem. Bir kapıyı açtım, öbürünü hemen kapattım. Şimdilik.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('Q_GECE', 'Yangın gecesi nerede olduğunuzu kim bilir?', {
          score: { SORGULAMA: 20 },
          effects: [ifThen(flag('fact_alibi'), [raise('alibi_kayit'), score('SORGULAMA', 40), inc('pers')])],
          responses: [
            {
              when: flag('fact_alibi'),
              lines: [
                s(
                  'halil',
                  'Atölyedeydim, hâkim hanım. Sanayinin kapısı on birde kilitlenir, altıda açılır. Bekçi gece birde, üçte tur attı; makinenin sesini duymuş. Sabah beşte çay getirdi.',
                ),
                me(
                  'Sayın Hâkim, sitenin kapı defterinin o geceki sayfası: “23.00 kilit, 06.00 açık, giriş-çıkış yok.” Örneğini sunuyoruz; bekçi gerekirse dinlenebilir.',
                ),
                s('savci', 'Bir mazeret bir yangının nasıl çıktığını açıklamaz, Sayın Hâkim.'),
                s('hakim', 'Ama bir sanığın o gece nerede olduğunu açıklar. Defter örneği dosyaya konsun.'),
                th('Bir kalkan değil; bir ağırlık. Hâkimin terazisine konan küçük, düzgün, kâğıttan bir ağırlık.'),
              ],
            },
            {
              lines: [
                s('halil', 'Atölyenin bekçisi. Sabah beşte çay getirdi. Kimse ona sormadı.'),
                s('savci', 'Sanığın evde bulunmaması, Sayın Hâkim, iddianamenin bir parçası zaten.'),
                th(
                  'Mazeret bu dosyada bir kalkan değil. Kundakçılar evde durmaz. Asıl soru başka: ateş nasıl başladı?',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('Q_BITIR', 'Sorularım bu kadar', {
          responses: [
            {
              when: flag('borc_gizle'),
              lines: [
                s('savci', 'Benim bir sorum var. Sanık, hakkınızda icra takipleri var mı?'),
                s('halil', 'Şey… yani… önemli değil, Sayın Savcı. Bir şey yok.', 'uzgun'),
                s('savci', 'Dosyada iki icra dosyası var, toplam seksen dört bin lira. “Bir şey yok” mu?'),
                n('Halil yere baktı. Hâkim gözlüğünü çıkardı ve ona uzun uzun baktı. Bir kefe ağırlaştı.'),
                th('Ona geçiştirmesini ben söyledim. Ve geçiştirmek, bir mahkemede yalanın kuzenidir.'),
              ],
            },
            {
              lines: [
                s('savci', 'Benim bir sorum var. Sanık, hakkınızda icra takipleri var mı?'),
                s(
                  'halil',
                  'Var. İki dosya. Pandemide iki otel siparişi iptal oldu. Kızımdan bile sakladım; utandım.',
                  'uzgun',
                ),
                s('savci', 'Teşekkür ederim.'),
                th('Utandım. Mahkemelerde nadir duyulan bir kelime. Hâkim duydu.'),
              ],
            },
          ],
          effects: [ifThen(flag('borc_gizle'), [dec('pers'), dec('cred')])],
          next: 'H1_03',
        }),
      ],
    }),
    court1.objection('H1_03', {
      title: 'Ekspertiz raporu',
      courtStage: 'DELIL_TARTISMA',
      lines: [
        {
          lines: [
            s(
              'katilan',
              'Sayın Hâkim, müvekkil şirketin eksperi Tarık Sönmez’in ekspertiz raporunun okunmasını ve bilirkişi raporuyla birlikte değerlendirilmesini talep ediyoruz.',
            ),
            s(
              'katilan',
              'Rapor olay yerinin ilk saatlerdeki durumunu tespit ediyor. Eksper ayrıca dinlenmeye gerek yoktur; yazdıkları ortada.',
            ),
            th('Bir eksperin kürsüye çıkmadan hüküm kâğıdına girmesi. Raporu okutup yazarını saklamak.'),
          ],
        },
      ],
      next: 'H1_04',
      options: [
        option('H103_A', 'İtiraz: bu katılanın uzman görüşü, bilirkişi raporu değil; eksper dinlensin', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers'), raise('tarik_istendi'), raise('h1_eksper_itiraz')],
          good: 'Doğru. Taraflar uzmandan bilimsel mütalaa alabilir (CMK 67/6), ama bu, mahkemenin atadığı bilirkişinin raporu değildir. Olayın ispatı bir kişinin algısına dayanıyorsa o kişi duruşmada dinlenir; yazılı açıklama okunarak dinlemenin yerine konamaz (CMK 210/1). Uzmanın dinlenmesi CMK 68/3 ile istenir.',
          responses: [
            {
              lines: [
                s(
                  'hakim',
                  'İtiraz yerinde. Rapor katılanın sunduğu bir uzman görüşü olarak dosyada kalır; bilirkişi raporu yerine geçmez.',
                ),
                s(
                  'hakim',
                  'Raporu düzenleyen kişinin olay yerindeki gözlemleri için tanık olarak dinlenmesine karar verilmesi değerlendirilecektir.',
                ),
                n(
                  'Katılan vekili oturdu. Arka sırada takım elbiseli adam bir şey yazdı, sonra yazdığının üstünü çizdi.',
                ),
              ],
            },
          ],
        }),
        option('H103_B', 'Talep: rapor usulsüz düzenlendiğinden delil olarak dosyadan tamamen çıkarılsın', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Katılanın sunduğu bir belge dosyadan “çıkarılmaz”; değeri hükümde takdir edilir (CMK 217). Doğru yol, raporun bilirkişi raporu yerine geçemeyeceğini ve yazarının dinlenmesi gerektiğini ileri sürmektir (CMK 67/6, 210/1).',
          responses: [
            {
              lines: [
                s('hakim', 'Talebin dayanağı yok, müdafi. Belge dosyada kalacak; değerini ben takdir ederim.'),
                th('Yanlış kapı. Raporu yıkmak istedim; yazarını kürsüye çağırmak varken.'),
              ],
            },
          ],
        }),
        option('H103_C', 'Bir şey söyleme; raporun zayıflığını esas hakkındaki savunmada ortaya koy', {
          effects: [dec('pers')],
          neutral:
            'Ekspertiz raporu itirazsız okundu; hâkim onu bilirkişi raporunun yanında, onunla aynı ağırlıkta dinledi.',
          responses: [
            {
              lines: [
                s('hakim', 'Rapor okunsun.'),
                n(
                  'Kâtip raporu okudu: “salon zemininde düzensiz kenarlı, zemine nüfuz etmiş döküntü izi…” Kelimeler salona bir koku gibi yayıldı.',
                ),
              ],
            },
          ],
        }),
        option('H103_D', 'İtiraz: rapor gerçeğe aykırıdır; eksper hakkında suç duyurusunda bulunuyoruz', {
          score: { USUL_BILGISI: -80 },
          effects: [dec('cred'), dec('pers')],
          bad: 'Elinde delil yokken duruşmada bir kişiyi sahtecilikle suçlamak, savunmanın güvenilirliğini harcar ve stratejini erkenden ele verir. Önce dinlenmesini iste; iddia delille kurulur.',
          responses: [
            {
              lines: [
                s('hakim', 'Müdafi, ağır bir iddia. Delilleriniz varsa sunarsınız; yoksa bu salonda böyle konuşulmaz.'),
                s('katilan', 'Kayda geçmesini istiyorum, Sayın Hâkim.'),
                th('Arka sırada takım elbiseli adam gülümsedi. İlk kez.'),
              ],
            },
          ],
        }),
      ],
    }),
    court1.testimony('H1_04', {
      title: 'Çapraz sorgu · Saadet Koru',
      courtStage: 'TANIK_DINLEME',
      witness: 'saadet',
      witnessLabel: 'TANIK · SAADET KORU',
      onEnter: [ifThen(flag('saadet_telkin'), [dec('cred'), dec('pers')])],
      lines: [
        {
          when: flag('saadet_telkin'),
          lines: [
            s('mubasir', 'Tanık Saadet Koru! Saadet Koruuu!'),
            n('Saadet Hanım bastonuyla geldi, kürsüye tutundu. Yemin ederken iki kez durdu.'),
            s('savci', 'Tanık, duruşmadan önce sizi ziyaret eden oldu mu?'),
            s(
              'saadet',
              'Avukat hanım geldi. Çok tatlı bir kız. “Kablo kokusuydu, değil mi teyze” dedi. Ben de “olabilir” dedim.',
            ),
            n(
              'Savcı bana döndü; bir şey söylemedi. Söylemesine gerek yoktu. Hâkim kaşlarını kaldırdı ve bir şey yazdı.',
            ),
            th('Tanığa cevabı ben vermiştim. Şimdi o cevap bana geri döndü; bu sefer hâkimin önünde.'),
            s(
              'saadet',
              'Gece birde kapıda el fenerli biri vardı. Benzin kokusu aldım ben, burnum köpek gibidir. O hafta eşyalarını taşıdı.',
            ),
            s('hakim', 'Müdafi, sorularınız?'),
          ],
        },
        {
          lines: [
            s('mubasir', 'Tanık Saadet Koru! Saadet Koruuu!'),
            n(
              'Saadet Hanım bastonuyla geldi, kürsüye tutundu. Yemin ederken iki kez durdu, sonra kendi kendine “tamam” dedi.',
            ),
            s(
              'saadet',
              'Kırk yıl tütün ayıkladım, hâkim hanım. Gözlerim gitti, burnum kaldı. Halil’in karşı komşusuyum.',
            ),
            s(
              'saadet',
              'Gece birde kapısında el fenerli biri vardı. Yangın başlayınca benzin kokusu aldım. O hafta eşyalarını taşıdı; bir gün de elinde bidon gördüm.',
            ),
            s('saadet', 'Bir de borcu varmış. İnsan borçla neler yapmaz, bilirsiniz.'),
            n('Halil başını önüne eğdi. Saadet Hanım ona bakmadı.'),
            s('hakim', 'Müdafi, sorularınız?'),
          ],
        },
      ],
      rulesText:
        'İpucu: Tanık yalan söylemiyor; hatırladığı şeyi kimin, nasıl hatırlattığına bak. Önce bastır, sonra doğru delille vur.',
      objectionGrounds: ['g_kanaat', 'g_uzmanlik', 'g_duyum'],
      statements: [
        statement('S1', 1, [
          'Gece birde Halil’in kapısında ',
          hl('el fenerli bir adam', any(flag('press_s1'), has('ded_fener'))),
          ' gördüm.',
        ]),
        statement('S2', 2, [
          'Yangın başlayınca ',
          hl('benzin kokusu aldım', any(flag('press_s2'), has('clue_koku_yok'))),
          '; burnum köpek gibidir.',
        ]),
        statement('S3', 3, [
          'O hafta ',
          hl('değerli eşyalarını taşıdı', any(flag('press_s3'), has('ded_tasima'))),
          '; belli ki biliyordu.',
        ]),
        statement('S4', 4, [
          'Benim ',
          hl('televizyonum bile', flag('press_s4')),
          ' o gece bozuldu; dumandan herhalde.',
        ]),
        statement('S5', 5, ['Borcu varmış. ', hl('Borçlu adam neler yapmaz'), ', bilirsiniz.']),
        statement('S6', 6, [
          'Bir gün de elinde ',
          hl('kırmızı bir benzin bidonu', any(flag('press_s6'), has('ded_bidon'))),
          ' gördüm.',
        ]),
      ],
      rules: [
        savcilikDelili('PS_SAV_S'),
        pressRule('PR_S1', 'S1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s1')],
          responses: [
            {
              lines: [
                me('Adamın yüzünü gördünüz mü, Saadet Hanım?'),
                s('saadet', 'Yok. Yağmur, karanlık. Feneri vardı. Kapıyı yokladı, gitti. Boyu posu Halil gibiydi.'),
                me('Kapıyı yokladı ve gitti. İçeri girdi mi?'),
                s(
                  'saadet',
                  'Girmedi. Kapıyı yokladı… sonra sokağın sonuna yürüdü. Düdük çaldı galiba. Düdük mü? Bilmem.',
                ),
              ],
            },
          ],
        }),
        presentRule('PS_S1', 'S1', ['ded_fener', 'ev_cizelge'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_s1')],
          quality: {
            q: 'GOOD',
            feedback:
              'Bekçinin devriye çizelgesi 01.30’da kapı kontrolünü gösteriyor: el fenerli adam, devriyedeki bekçi.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                me(
                  'Sayın Hâkim, mahalle bekçisi Cevdet Alkan’ın devriye çizelgesi: “01.30 Kalem Sokak 9, kapı kontrol, kilitli, olağan.”',
                ),
                me('Saadet Hanım, fenerli, düdüklü, kapıları yoklayıp geçen biri. Kim olabilir?'),
                s('saadet', 'Cevdet… Cevdet’miş. Her gece geçer. Ah, ben… polis “Halil miydi” deyince…', 'saskin'),
                s(
                  'hakim',
                  'Tanığın beyanı, gördüğü kişinin yüzünü görmediği ve kişinin bekçi olabileceği şeklinde tutanağa geçsin.',
                ),
                th('Bir siluetin adı değişti. Halil’in halatından bir iplik daha gevşedi.'),
              ],
            },
          ],
        }),
        pressRule('PR_S2', 'S2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s2')],
          responses: [
            {
              when: flag('saadet_koku'),
              lines: [
                me('Kokuyu kendi kelimelerinizle tarif eder misiniz? Bana anlattığınız gibi.'),
                s('saadet', 'Keskin. Boğaz yakan. Yanık kablo gibi… Sigorta atınca olan koku.'),
                me('Kolluk ifadenizde “benzin” yazıyor.'),
                s('saadet', 'Polis “benzin gibi mi teyze” dedi. “Evet, öyle bir şey” dedim. Keskin işte.'),
                th('Bir kelimeyi kimin önerdiği, kelimenin kendisinden önemlidir.'),
              ],
            },
            {
              lines: [
                me('Kokuyu tarif eder misiniz? Kendi kelimelerinizle.'),
                s(
                  'saadet',
                  'Keskin. Boğazı yakan. Plastik gibi… Polis “benzin gibi mi” dedi, ben de evet dedim. Öyle bir şey.',
                ),
                th('“Öyle bir şey.” Bir tanığın emin olmadığını söylemesinin en kibar yolu.'),
              ],
            },
          ],
        }),
        presentRule('PS_S2', 'S2', ['ev_itfaiye'], {
          enabledWhen: flag('press_s2'),
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_s2')],
          quality: {
            q: 'GOOD',
            feedback:
              'İtfaiye: “akaryakıt kokusu alınmamıştır; yoğun plastik ve kablo yanığı kokusu.” Tanığın kendi tarifi itfaiyeninkiyle aynı; “benzin” kelimesi kolluğun sorusundan.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                me(
                  'İtfaiye ekip amirinin raporu, Sayın Hâkim: “Müdahale sırasında akaryakıt kokusu alınmamıştır. Yoğun plastik ve kablo yanığı kokusu.”',
                ),
                me(
                  'Saadet Hanım, “plastik gibi, yanık kablo gibi” dediniz. İtfaiyeciler de aynısını yazmış. “Benzin” kelimesi kimindi?',
                ),
                s(
                  'saadet',
                  'Polisin. Polis söyledi, ben kabul ettim. Ama ben… ben benzin demedim aslında. Keskin dedim.',
                  'uzgun',
                ),
                n('Savcı itfaiye raporunu dosyadan çıkarıp okudu. Uzun okudu.'),
              ],
            },
          ],
        }),
        presentRule('PS_S2_ERKEN', 'S2', ['ev_itfaiye'], {
          enabledWhen: not(flag('press_s2')),
          score: { SORGULAMA: 100 },
          effects: [inc('pers')],
          quality: {
            q: 'GOOD',
            feedback:
              'İtfaiyenin tespitini gösterdin; ama tanığın “benzin” kelimesini nereden aldığını önce sorsaydın, çelişki onun ağzından çıkardı.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                s('saadet', 'İtfaiye ne bilir? Onlar maskeliydi. Benim burnum köpek gibidir.', 'kizgin'),
                th('Belgeyi gösterdim ama tanığa kendi kelimesini sormadım. Önce bastırmalıydım.'),
              ],
            },
          ],
        }),
        pressRule('PR_S3', 'S3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s3')],
          responses: [
            {
              lines: [
                me('Hangi eşyaları taşıdı, hatırlıyor musunuz?'),
                s('saadet', 'Nermin’in çeyiz sandığını. Bir konsol. Dikiş makinesi. Gözüm doldu, ondan hatırlıyorum.'),
                me('Televizyonu, buzdolabını, yeni koltukları?'),
                s('saadet', 'Yok, onlar kaldı. Yandı onlar. Ne değerliyse kaldı aslında… Sandık eski bir şey.'),
              ],
            },
          ],
        }),
        presentRule('PS_S3', 'S3', ['ded_tasima'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers'), raise('contra_s3')],
          quality: {
            q: 'GOOD',
            feedback:
              'Restorasyon sözleşmesi odaların 15 Ocak’a kadar boşaltılmasını istiyor; taşınan eşyalar etiketli. Taşıma bir hazırlık değil, bir takvim.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                me(
                  'Restorasyon sözleşmesi, Sayın Hâkim: “Odalar 15 Ocak’a kadar boşaltılacaktır.” Taşınan eşyaların örtüsündeki etiket: “Restorasyon bitince geri.”',
                ),
                s('saadet', 'Usta mı istemiş? Ben… ben bilmiyordum. Bana sormadı ki kimse.', 'saskin'),
                s('hakim', 'Belgenin bir örneği dosyaya konsun.'),
                th('“Belli ki biliyordu.” Biliyordu, evet: ustanın takvimini.'),
              ],
            },
          ],
        }),
        presentRule('PS_S3_K', 'S3', ['ev_cagri'], {
          score: { SORGULAMA: 60 },
          effects: [raise('motif_artis')],
          quality: {
            q: 'GOOD',
            feedback: 'Acentenin çağrı kaydı teminat artışını açıklıyor; ama tanığın sözü eşyalarla ilgiliydi.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                s(
                  'hakim',
                  'Teminat artışını acentenin teklif ettiği kayda geçsin. Ama tanık eşyalardan söz ediyor, müdafi.',
                ),
              ],
            },
          ],
        }),
        pressRule('PR_S4', 'S4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s4'), raise('fact_tv')],
          responses: [
            {
              lines: [
                me('Televizyonunuz ne zaman bozuldu? Yangından önce mi, sonra mı?'),
                s(
                  'saadet',
                  'Önce. Yatmıştım, “pat” dedi, karardı. Kızdım, kalkıp fişini çektim. Sonra pencereden baktım; karşıda turuncu ışık.',
                ),
                s(
                  'saadet',
                  'Dumandan değilmiş yani. Duman sonra geldi. Modemim de gitti o gece, torunum yenisini taktı.',
                ),
                th('Yangından önce bir pat. Bir modem. Bir sokak. Kimsenin bakmadığı bir şey; bir televizyonun ölümü.'),
              ],
            },
          ],
        }),
        objectRule('OB_S5', 'S5', 'g_kanaat', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers')],
          quality: {
            q: 'GOOD',
            feedback:
              'Tanık gördüğünü ve duyduğunu anlatır; sanığın kişiliği ya da niyeti hakkında kanaati delil değildir (CMK 52, 217).',
            category: 'USUL_BILGISI',
          },
          responses: [
            {
              lines: [
                me('İtiraz, Sayın Hâkim. Tanık bir algıyı değil, bir kanaati anlatıyor.'),
                s(
                  'hakim',
                  'Kabul. Tanığın bu sözü kanaat olarak değerlendirilecek. Tanık, gördüğünüzü anlatın lütfen.',
                ),
                s('saadet', 'Haklısın kızım. Ağzımdan çıktı. Halil’e kızgındım. Başka bir şeye.', 'uzgun'),
              ],
            },
          ],
        }),
        pressRule('PR_S6', 'S6', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s6')],
          responses: [
            {
              lines: [
                me('Bidonu nereye götürdü?'),
                s('saadet', 'Arabasına koydu. Sanayiye gitti herhalde; hep oraya gider.'),
                me('Bidonu eve soktuğunu gördünüz mü?'),
                s('saadet', 'Yok. Arabaya koydu, gitti.'),
              ],
            },
          ],
        }),
        presentRule('PS_S6', 'S6', ['ded_bidon'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers'), raise('contra_s6')],
          quality: {
            q: 'GOOD',
            feedback:
              'Fişteki beş litrenin dört litresi atölyede, jeneratörün yanında. Bidon evin yolunu hiç tutmamış.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                me(
                  'Sayın Hâkim, o bidon bugün sanıktaki atölyede, jeneratörün yanında duruyor. İçinde dört litre benzin var. Fotoğrafı ve atölye bekçisinin beyanı ekte.',
                ),
                s('saadet', 'Arabaya koydu dedim ya. Sanayiye götürdü.'),
                s('savci', 'Sayın Hâkim, bu bidonun incelenmesini talep ederiz.'),
                s('hakim', 'Kolluk marifetiyle tespit yapılsın.'),
                th('Savcı bidonu incelettirmek istiyor. İyi. Bir bidon ancak açılınca konuşur.'),
              ],
            },
          ],
        }),
      ],
      presentMiss: presentMiss('FB_H104_PRESENT'),
      objectMiss: objectMiss('FB_H104_OBJECT'),
      finish: { id: 'H104_BITIR', next: 'H1_04S' },
    }),
    story('H1_04S', {
      ...court1.base,
      title: 'Tanık çekiliyor',
      background: 'durusma_salonu',
      lines: [
        {
          when: any(flag('contra_s1'), flag('contra_s2')),
          lines: [
            s('hakim', 'Tanık, teşekkür ederiz. Çekilebilirsiniz.'),
            n(
              'Saadet Hanım bastonuna yaslanıp kürsüden indi. Sanık sırasının önünden geçerken durdu. Halil başını kaldırdı.',
            ),
            s('saadet', 'Yanlış burunla konuştum, Halil. Kusura bakma. Polis sordu, ben… neyse.', 'uzgun'),
            s('hakim', 'Tanık, sanıkla konuşmayın lütfen.'),
            n(
              'Saadet Hanım dinleyici sırasına oturdu; Zehra’nın yanına. Bir süre sonra Zehra’nın elini tuttu. Zehra çekmedi.',
            ),
            th(
              'Bir tanık yalan söylemedi. Yalnızca birinin ona verdiği kelimeyi taşıdı. Kelimeyi geri aldı; ağırlığı Halil’in omzundan bir parça azaldı.',
            ),
          ],
        },
        {
          lines: [
            s('hakim', 'Tanık, teşekkür ederiz. Çekilebilirsiniz.'),
            n(
              'Saadet Hanım bastonuna yaslanıp kürsüden indi. Halil’e bakmadı. Dinleyici sırasının en arkasına oturdu.',
            ),
            th('“Benzin kokusu.” Bir kelime tutanakta duruyor. Ben onu yerinden oynatamadım.'),
          ],
        },
      ],
      choices: [cont('H104S_DEVAM', 'Devam', 'H1_05')],
    }),
    court1.objection('H1_05', {
      title: 'Bilirkişiye soru',
      courtStage: 'TANIK_DINLEME',
      witness: 'tezel',
      witnessLabel: 'BİLİRKİŞİ · DR. ORHAN TEZEL',
      lines: [
        {
          lines: [
            s('mubasir', 'Bilirkişi Dr. Orhan Tezel!'),
            n(
              'Altmışlarında, beyaz sakallı, tüvit ceketli bir adam. Kürsüye bir kürsüye değil, bir kateder gibi çıktı. Dosyasını açmadı; ezbere biliyordu.',
            ),
            s('tezel', 'Otuz bir yıldır yangın incelerim, hâkim hanım. Yangın bir kitaptır; bilen okur.'),
            s(
              'katilan',
              'Sayın bilirkişi, salon zeminindeki döküntü izi ve laboratuvardaki benzin birlikte, yangının kasten çıkarıldığını kesin olarak gösterir, değil mi?',
            ),
            th('“Değil mi?” Cevabı sorunun içinde. Bilirkişiye “evet” demekten başka bir yol bırakılmamış.'),
          ],
        },
      ],
      next: 'H1_06',
      options: [
        option('H105_A', 'İtiraz: soru cevabı içinde taşıyor; bilirkişiye sonucu söyletiyor', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers')],
          good: 'Yerinde. Soruların yöneltilmesi hâkimin yönetimindedir (CMK 192, 201); cevabı içeren soru bilirkişinin kendi incelemesini anlatmasını engeller. Ayrıca “kasten” sorusu bilirkişiye değil hâkime aittir (CMK 67/3).',
          responses: [
            {
              lines: [
                s(
                  'hakim',
                  'İtiraz yerinde. Bilirkişi, ne gördüğünüzü ve neye dayandığınızı anlatın. Kastı ben değerlendiririm.',
                ),
                s('tezel', 'Elbette, hâkim hanım. Bulgularımı anlatayım.'),
              ],
            },
          ],
        }),
        option('H105_B', 'Sus; cevabı çapraz sorguda kendi sorularınla çürüt', {
          effects: [dec('pers')],
          neutral: 'Telkin edici soru cevaplandı: bilirkişi “kesin” kelimesini katılanın ağzından aldı.',
          responses: [
            {
              lines: [
                s(
                  'tezel',
                  'Evet. Kesin olarak gösterir. Bulgular birlikte değerlendirildiğinde başka bir açıklama kalmaz.',
                ),
                th('“Kesin.” Bir bilirkişinin ağzından bir kelime. O kelimeyi koyan katılan vekiliydi.'),
              ],
            },
          ],
        }),
        option('H105_C', 'Bilirkişinin reddini talep ediyoruz: tarafgir bir görüş bildiriyor', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Bilirkişinin reddi ancak hâkimin reddini gerektiren sebeplerle mümkündür (CMK 69/1); aleyhe görüş bir ret sebebi değildir. Görüş çapraz sorguda ve gerekirse yeni bilirkişiyle sınanır.',
          responses: [
            {
              lines: [
                s('hakim', 'Ret sebebi göstermediniz, müdafi. Talep reddedildi. Bilirkişi, devam edin.'),
                s('tezel', 'Teşekkür ederim. Bulgular açıktır.'),
              ],
            },
          ],
        }),
        option('H105_D', 'Soruyu müdafi olarak şimdi ben sormak istiyorum, Sayın Hâkim', {
          neutral:
            'Soru sırası katılandadır; müdafi kendi sırasında sorar. Talep reddedildi, telkin edici soru cevaplandı.',
          responses: [
            {
              lines: [
                s('hakim', 'Sıranız gelecek, müdafi. Bilirkişi, cevap verin.'),
                s('tezel', 'Bulgular birlikte değerlendirildiğinde kasıt dışında bir açıklama zordur.'),
              ],
            },
          ],
        }),
      ],
    }),
    court1.testimony('H1_06', {
      title: 'Çapraz sorgu · Dr. Orhan Tezel',
      courtStage: 'TANIK_DINLEME',
      witness: 'tezel',
      witnessLabel: 'BİLİRKİŞİ · DR. ORHAN TEZEL',
      lines: [
        {
          lines: [
            s(
              'tezel',
              'Olay yerini inceledim. Yangın salonun ortasında, zeminde başlamıştır; zeminde tipik bir döküntü izi vardı.',
            ),
            s(
              'tezel',
              'Laboratuvar, olay yerinden alınan iki numunede kurşunsuz benzin tespit etmiştir. Elektrik kaynaklı bir iz yoktur.',
            ),
            s(
              'tezel',
              'Benzin bu yoğunlukta ve tazelikte bulunduysa bol miktarda dökülmüş demektir. Poliçe ve borç tablosuyla birlikte kasıt açıktır.',
            ),
            th(
              'Akıcı, emin, ezber. Bir kitap gibi okuyor. Ama kitabın bazı sayfaları başkası tarafından yazılmış; onları bulmam lazım.',
            ),
            s('hakim', 'Müdafi, sorularınız?'),
          ],
        },
      ],
      rulesText:
        'İpucu: Bilirkişinin ne gördüğünü değil, neyi ne zaman ve kimin elinden gördüğünü sına. Raporun eklerine bak.',
      objectionGrounds: ['g_kanaat', 'g_uzmanlik', 'g_duyum'],
      statements: [
        statement('B1', 1, [
          'Yangın ',
          hl('salon zemininde başlamıştır', any(flag('press_b1'), has('ded_temizlenmis'))),
          '; zeminde döküntü izi vardı.',
        ]),
        statement('B2', 2, [
          'Laboratuvar, ',
          hl('olay yerinden alınan numunelerde', any(flag('press_b2'), has('ded_zincir'))),
          ' benzin tespit etti.',
        ]),
        statement('B3', 3, [
          'Olay yerinde ',
          hl('elektrik kaynaklı bir iz yoktur', any(flag('press_b3'), has('ded_pano'))),
          '.',
        ]),
        statement('B4', 4, [
          'Benzin bu kadar ',
          hl('yoğun ve taze', any(flag('press_b4'), has('ded_taze'))),
          ' bulunduysa bol miktarda dökülmüştür.',
        ]),
        statement('B5', 5, ['Poliçe ve borç tablosuyla birlikte ', hl('kasıt açıktır'), '.']),
      ],
      rules: [
        savcilikDelili('PS_SAV_B'),
        pressRule('PR_B1', 'B1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b1')],
          responses: [
            {
              lines: [
                me('Döküntü izini siz kendi gözünüzle ne zaman gördünüz?'),
                s('tezel', 'Keşifte. 21 Ocak. Ayrıca ek-3’teki fotoğrafta açıkça görülüyor.'),
                me('Ek-3’teki fotoğrafı kim çekti?'),
                s('tezel', 'Raporda yazılı. Olay yerinin ilk saatlerine ait bir fotoğraf.', 'saskin'),
                th('Kimin çektiğini söylemedi. Söylemek istemedi mi, düşünmedi mi?'),
              ],
            },
          ],
        }),
        presentRule('PS_B1', 'B1', ['ded_temizlenmis'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_b1')],
          quality: {
            q: 'GOOD',
            feedback:
              'Kolluğun 04.30 karesinde zemin çökmüş tavanla örtülü; “döküntü izi” eksperin 09.40’taki fotoğrafında, moloz kaldırıldıktan sonra görünüyor. Bilirkişi zemini altı gün sonra gördü.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                me('Olay yeri albümü, kare 21, saat 04.30. Salonun zemini görünüyor mu, sayın bilirkişi?'),
                n('Tezel fotoğrafı aldı. Gözlüğünü taktı. Uzun süre baktı.'),
                s('tezel', 'Hayır. Tavan çökmüş. Zemin tahtalarla örtülü.', 'saskin'),
                me(
                  'Ek-3, saat 09.40. Aynı zemin. Tertemiz, ortada ıslak bir leke. Arada beş saat var. Bu beş saatte zemini kim açtı?',
                ),
                s(
                  'tezel',
                  'Ek-3’ü… katılan şirketin eksperi çekmiş. Ben… 04.30 karesini görmemiştim. Bana dosya bu fotoğrafla geldi.',
                  'uzgun',
                ),
                n('Hâkim iki fotoğrafı yan yana koydu. Bir süre hiçbir şey söylemedi.'),
                th('Bir zemin, iki fotoğraf. Arada bir el. Bilirkişi kitabı okudu; ama bir sayfa yerine konmuştu.'),
              ],
            },
          ],
        }),
        presentRule('PS_B1_K', 'B1', ['ded_koken'], {
          score: { SORGULAMA: 100 },
          effects: [inc('pers')],
          quality: {
            q: 'GOOD',
            feedback:
              'İtfaiye ve V izi başlangıcı mutfak–koridor duvarına koyuyor; ama bilirkişinin “zemin izi” dayanağı fotoğrafın kendisi.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                s(
                  'tezel',
                  'İtfaiyenin ilk değerlendirmesini okudum. Ama zemindeki iz, başlangıcı salona koyuyor. Fotoğraf ortada.',
                ),
                th('Başlangıcı gösterdim; ama onun dayanağı bir fotoğraf. Fotoğrafı sorgulamalıyım.'),
              ],
            },
          ],
        }),
        pressRule('PR_B2', 'B2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b2')],
          responses: [
            {
              lines: [
                me('Numuneleri kim, ne zaman aldı?'),
                s('tezel', 'Numuneler savcılık kanalıyla, mühürlü olarak bana ulaştı. Ben laboratuvara gönderdim.'),
                me('Olay yerinden kim aldı? Kolluk mu?'),
                s('tezel', 'Raporun materyal bölümünde yazılı.', 'saskin'),
              ],
            },
          ],
        }),
        presentRule('PS_B2', 'B2', ['ded_zincir'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_b2'), inc('legal_hits')],
          quality: {
            q: 'GOOD',
            feedback:
              'Numuneleri kolluk değil, muhafaza altındaki olay yerine 09.20–10.05 arasında refakatsiz giren eksper getirdi; elde edilişine dair resmî tutanak yok. Delilin güvenilirliği zincirine bağlıdır (CMK 217).',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                me(
                  'Raporunuzun materyal satırının ekindeki teslim tutanağı: numuneleri savcılığa teslim eden, katılan şirketin eksperi.',
                ),
                me(
                  'Bekçinin devriye çizelgesi: “09.20 sigorta eksperi T.S. olay yerine girdi, 10.05 çıktı.” Olay yeri o saatte muhafaza altında. Kolluk yok.',
                ),
                me('Sayın bilirkişi, bu numunelerin o zeminden alındığını kim gördü?'),
                n('Tezel bir süre sustu. Sonra dosyasını açtı; ilk kez.'),
                s('tezel', 'Numuneleri ben almadım. Kolluk da almamış. Eksperin teslim ettiği tenekelerdi.', 'uzgun'),
                s(
                  'tezel',
                  'Ben… zinciri sorgulamadım. Bir numune bana mühürlü gelince, mühürden önceki hayatını sormam. Sormalıymışım.',
                ),
                n('Salonda bir uğultu. Hâkim tokmağa uzanmadı; sadece başını kaldırdı ve uğultu dindi.', {
                  fx: 'shake',
                }),
                n('Arka sırada takım elbiseli adam kalemini kapattı, cebine koydu ve bir şey yazmayı bıraktı.'),
                th(
                  'Bir sayfa yerinden çıktı. Kitap hâlâ duruyor; ama artık herkes bir sayfanın yerine konduğunu biliyor.',
                ),
              ],
            },
          ],
        }),
        presentRule('PS_B2_K', 'B2', ['ev_cizelge'], {
          score: { SORGULAMA: 100 },
          effects: [inc('pers')],
          quality: {
            q: 'GOOD',
            feedback:
              'Eksperin olay yerine girdiğini gösterdin; ama numunelerin ondan geldiğini raporun kendi satırıyla bağlamadın.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                s('tezel', 'Eksperin olay yerine girmesi olağandır. Sigorta şirketleri hasarı inceler.'),
                th('Girdiğini gösterdim. Numunelerin onun elinden geldiğini göstermedim. İki kart, bir cümle eksik.'),
              ],
            },
          ],
        }),
        pressRule('PR_B3', 'B3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b3')],
          responses: [
            {
              lines: [
                me('Elektrik tesisatını incelediniz mi? Sigorta panosunu, koridor hattını?'),
                s(
                  'tezel',
                  'Pano kolluk emanetindeydi. İncelenmesi istenmedi. Olay yerinde elektrik kaynaklı bir iz görmedim.',
                ),
                me('Görmediniz mi, bakmadınız mı?'),
                s('tezel', 'Bu… ayrı bir uzmanlık alanı. Ben makine mühendisiyim.', 'saskin'),
              ],
            },
          ],
        }),
        presentRule('PS_B3', 'B3', ['ded_pano'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers'), raise('contra_b3')],
          quality: {
            q: 'GOOD',
            feedback:
              'İtfaiyenin şüphesi üzerine pano emanete alınmış ama hiç incelenmemiş; “elektrik izi yok” cümlesi incelenmemiş bir şeyin yokluğunu ilan ediyor.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                me(
                  'İtfaiye panoyu “elektrik kaynaklı olabilir” diye söküp kolluğa vermiş. Evdeki boş yuva burada, fotoğrafta. Pano emanette. Kimse incelememiş.',
                ),
                me('“Elektrik kaynaklı iz yoktur” mu, yoksa “elektrik kaynaklı iz aranmamıştır” mı?'),
                s('tezel', 'Aranmamıştır. Doğru ifade bu olmalıydı.', 'uzgun'),
                s('hakim', 'Bilirkişinin bu beyanı aynen tutanağa geçsin.'),
              ],
            },
          ],
        }),
        presentRule('PS_B3_K', 'B3', ['ded_buat', 'ded_koken'], {
          score: { SORGULAMA: 100 },
          effects: [inc('pers')],
          quality: {
            q: 'GOOD',
            feedback:
              'Başlangıç bölgesini ve ısınan buatı gösterdin; ama bilirkişinin cümlesinin zayıflığı, panoya hiç bakmamış olmasıdır.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                s(
                  'tezel',
                  'Eriyik bakır yangının sonucu da olabilir. Birincil mi ikincil mi, ayrıca incelenmesi gerekir.',
                ),
                th('“Ayrıca incelenmesi gerekir.” Kendi ağzıyla. Bunu birazdan bir talebe çevireceğim.'),
              ],
            },
          ],
        }),
        pressRule('PR_B4', 'B4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b4')],
          responses: [
            {
              lines: [
                me('Yangın ne kadar sürdü, söndürme ne kadar?'),
                s('tezel', 'Bir buçuk saat kadar yangın, seksen dakika su. Ahşap bir yapı.'),
                me('Bu süreden sonra zemindeki benzinin büyük kısmı buharlaşmaz mı?'),
                s('tezel', 'Genel olarak… evet. Ama çok dökülmüşse kalıntı kalır.'),
              ],
            },
          ],
        }),
        presentRule('PS_B4', 'B4', ['ded_taze'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers'), raise('contra_b4')],
          quality: {
            q: 'GOOD',
            feedback:
              'Laboratuvarın kendi dipnotu: “düşük buharlaşma derecesi.” Saatlerce ateş ve seksen dakika sudan sonra neredeyse taze benzin, numunenin yangından sonra kirlendiği ihtimalini doğurur.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                me(
                  'Laboratuvarın dipnotu: “düşük buharlaşma derecesinde.” Bir buçuk saat ateş, seksen dakika su. Ve neredeyse taze benzin.',
                ),
                me(
                  'Sayın bilirkişi, bu bir yangının kalıntısına mı benziyor, yoksa yangından sonra oraya konmuş bir şeye mi?',
                ),
                s(
                  'tezel',
                  'Bu… dipnotu yangının yoğunluğuna yordum. Ama haklısınız; bu profil, yangından geçmiş bir numuneden beklenmez.',
                  'uzgun',
                ),
              ],
            },
          ],
        }),
        objectRule('OB_B5', 'B5', 'g_uzmanlik', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers')],
          quality: {
            q: 'GOOD',
            feedback:
              'Bilirkişi uzmanlık gerektiren konular dışında açıklama yapamaz; kast gibi hukuki değerlendirme hâkime aittir (CMK 67/3).',
            category: 'USUL_BILGISI',
          },
          responses: [
            {
              lines: [
                me('İtiraz, Sayın Hâkim. Bilirkişi poliçeden ve borçtan kasıt çıkarıyor. Bu onun uzmanlığı değil.'),
                s('hakim', 'Kabul. Bilirkişi, hukuku bana bırakın.'),
                s('tezel', 'Haklısınız. Kendi alanımda kalayım.'),
              ],
            },
          ],
        }),
      ],
      presentMiss: presentMiss('FB_H106_PRESENT'),
      objectMiss: objectMiss('FB_H106_OBJECT'),
      finish: { id: 'H106_BITIR', next: 'H1_06R' },
    }),
    decisionNode('H1_06R', [{ when: flag('contra_b2'), to: 'H1_06K' }, { to: 'H1_07' }], { ...court1.base }),
    story('H1_06K', {
      ...court1.base,
      title: 'Bilirkişi',
      background: 'durusma_salonu',
      lines: [
        {
          lines: [
            s('hakim', 'Bilirkişi, bu durumda raporunuzun sonucunu nasıl değerlendiriyorsunuz?'),
            n(
              'Tezel gözlüğünü çıkardı. Sakalını sıvazladı. Otuz bir yılın ağırlığı bir an omuzlarına çöktü, sonra kalktı.',
            ),
            s(
              'tezel',
              'Laboratuvar sonucu, o tenekelerin içeriğine dair bir sonuçtur, hâkim hanım. Bu yangına dair değil.',
            ),
            s(
              'tezel',
              'Numunelerin olay yerinden, o zeminden alındığı bağımsız olarak doğrulanamıyorsa, raporumun sonucu bu dayanakla ayakta durmaz.',
            ),
            s(
              'tezel',
              'Yangın bir kitaptır dedim. Sayfaları yerinden oynatılmışsa bilen de yanılır. Ben yanılmış olabilirim.',
            ),
            n(
              'Savcı Kemal Dinçer arkasına yaslandı ve tavana baktı. Katılan vekili bir şey fısıldamak için arkaya döndü; arka sıra boştu.',
            ),
            th(
              'Eksper salondan çıkmıştı. Kimse fark etmedi; ben fark ettim. Bir adamın sessizce gidişi, bazen bağırarak gelişinden daha çok şey söyler.',
            ),
          ],
        },
      ],
      choices: [cont('H106K_DEVAM', 'Devam', 'H1_07')],
    }),
    choiceNode('H1_07', {
      ...court1.base,
      title: 'Talepler',
      background: 'durusma_salonu',
      hud: ['h1_hak', 'cred', 'pers'],
      lines: [
        {
          lines: [
            s('hakim', 'Taraflar, delil talepleriniz? Müdafi.'),
            th('Bu celse bitmeden mahkemeye neyi getirtmesini istiyorum? Üç talep; hâkimin sabrı da bir kaynak.'),
          ],
        },
      ],
      prompt: 'Mahkemeden ne talep ediyorsun? (en çok üç delil talebi; tahliye talebi ayrıca)',
      choices: [
        option('T1_PANO', 'Emanetteki sigorta panosunun ve hattın elektrik bilirkişisine incelettirilmesi', {
          visibleWhen: not(flag('pano_istendi')),
          cost: [{ var: 'h1_hak', amount: 1 }],
          score: { USUL_BILGISI: 60 },
          effects: [raise('pano_istendi')],
          good: 'Kabul: incelenmemiş emanet materyal için yeni bilirkişi incelemesi (CMK 63, 67/5, 206/1).',
          next: '$stay',
        }),
        option('T1_ARIZA', 'Dağıtım şirketinden yangın gecesinin hat arıza kayıtlarının getirtilmesi', {
          visibleWhen: all(flag('fact_tv'), not(flag('ariza_istendi'))),
          cost: [{ var: 'h1_hak', amount: 1 }],
          score: { USUL_BILGISI: 60 },
          effects: [raise('ariza_istendi')],
          good: 'Kabul: tanığın beyanıyla bağlantılı, somut ve ulaşılabilir bir kurum kaydı (CMK 206/1).',
          next: '$stay',
        }),
        option('T1_LAB', 'Laboratuvarın ham verilerinin ve numune kabul tutanağının getirtilmesi', {
          visibleWhen: all(any(has('clue_taze'), flag('contra_b4'), flag('contra_b2')), not(flag('lab_istendi'))),
          cost: [{ var: 'h1_hak', amount: 1 }],
          score: { USUL_BILGISI: 40 },
          effects: [raise('lab_istendi')],
          good: 'Kabul: sonucun dayandığı ham veri ve numunenin kabul koşulları (CMK 206/1).',
          next: '$stay',
        }),
        option('T1_TARIK', 'Sigorta eksperi Tarık Sönmez’in tanık olarak dinlenmesi', {
          visibleWhen: not(flag('tarik_istendi')),
          cost: [{ var: 'h1_hak', amount: 1 }],
          score: { USUL_BILGISI: 40 },
          effects: [raise('tarik_istendi')],
          good: 'Kabul: numuneleri getiren ve gözlemine dayanılan kişi duruşmada dinlenmelidir (CMK 210/1).',
          next: '$stay',
        }),
        option('T1_CEVDET', 'Bekçi Cevdet Alkan’ın tanık olarak dinlenmesi', {
          visibleWhen: all(met('cevdet'), not(flag('cevdet_istendi'))),
          cost: [{ var: 'h1_hak', amount: 1 }],
          score: { USUL_BILGISI: 40 },
          effects: [raise('cevdet_istendi')],
          good: 'Kabul: olay yerini muhafaza eden ve girişleri kaydeden kişi (CMK 206/1).',
          next: '$stay',
        }),
        option('T1_HEYET', 'Yeni bir yangın bilirkişi heyetinden, tesisatı ve zemini de kapsayan rapor alınması', {
          cost: [{ var: 'h1_hak', amount: 1 }],
          score: { USUL_BILGISI: 10 },
          neutral:
            'Yerinde ama geniş bir talep (CMK 67/5); heyet raporu iki ay sürer ve bir sonraki celseye yetişmez. Hedefli talepler daha hızlı sonuç verir.',
          next: '$stay',
        }),
        option('T1_TAHLIYE', 'Sanığın tahliyesini talep ediyoruz', {
          visibleWhen: not(flag('tahliye_istendi')),
          effects: [raise('tahliye_istendi')],
          responses: [
            {
              when: flag('contra_b2'),
              lines: [
                me(
                  'Sayın Hâkim, tutuklamanın dayanağı olan bilirkişi raporunun temel dayanağı bugün sarsılmıştır. Kaçma şüphesi yok; sabit ikametgâh, bir atölye, bir kız. Tahliyesini talep ediyorum.',
                ),
                th('Kâğıt tek başına tahliye etmez. Ama bugün bir kâğıt değil, bir bilirkişinin kendi ağzı var.'),
              ],
            },
            {
              lines: [
                me('Sayın Hâkim, müvekkilim sabıkasızdır, sabit ikametgâhı vardır. Tahliyesini talep ediyorum.'),
                th('Bir talep, bir umut. Hâkimin önünde sarsılmamış bir rapor duruyor.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('T1_BITIR', 'Taleplerimiz bu kadar', { next: 'H1_08' }),
      ],
    }),
    story('H1_08', {
      ...court1.base,
      title: 'Ara karar',
      background: 'durusma_salonu',
      onEnter: [ifThen(all(flag('tahliye_istendi'), flag('contra_b2')), [raise('halil_tahliye')])],
      lines: [
        {
          when: flag('halil_tahliye'),
          lines: [
            s(
              'hakim',
              'Ara karar: Taleplerin kabulüne; ilgili kurumlara müzekkere yazılmasına, dinlenecek tanıkların davetine.',
            ),
            s(
              'hakim',
              'Sanığın tutukluluk hâli incelendi. Delil durumundaki değişim ve tutuklulukta geçen süre gözetilerek adli kontrol şartıyla tahliyesine; yurt dışı çıkış yasağına.',
            ),
            s('hakim', 'Duruşmanın 5 Mayıs saat 09.30’a ertelenmesine.'),
            n(
              'Halil anlamadı. Jandarma koluna dokundu; “gidiyorsun abi” dedi. Halil Zehra’ya baktı. Zehra ağlamadı; hemşireler ağlamaz. Sonra ağladı.',
              { fx: 'fade' },
            ),
          ],
        },
        {
          lines: [
            s(
              'hakim',
              'Ara karar: Taleplerin kabulüne; ilgili kurumlara müzekkere yazılmasına, dinlenecek tanıkların davetine.',
            ),
            s(
              'hakim',
              'Sanığın tutukluluk hâli incelendi. Mevcut delil durumu ve atılı suçun niteliği gözetilerek tutukluluğunun devamına.',
            ),
            s('hakim', 'Duruşmanın 5 Mayıs saat 09.30’a ertelenmesine.'),
            n(
              'Halil başını salladı. Jandarma koluna dokundu. Kapıda döndü, Zehra’ya baktı, ceketin dar omuzlarını düzeltti.',
              { fx: 'fade' },
            ),
          ],
        },
      ],
      choices: [cont('H108_DEVAM', 'Adliyeden çık', 'H1_09', { role: 'PRIMARY' })],
    }),
    story('H1_09', {
      ...court1.base,
      title: 'Koridor',
      background: 'adliye',
      lines: [
        {
          when: flag('contra_b2'),
          lines: [
            card('14 NİSAN · 12.10 — ADLİYE KORİDORU', 'adliye'),
            n('Koridorda biri adımı söyledi. Dr. Orhan Tezel, tüvit ceketi kolunda, dosyası koltuğunun altında.'),
            s('tezel', 'Av. Arslan. Bir dakikanızı alabilir miyim? Kürsüde söyleyemediğim bir şey var.'),
            me(
              'Hocam, siz mahkemenin bilirkişisisiniz. Dosya hakkında sizinle salon dışında konuşamam. Söyleyeceğiniz bir şey varsa mahkemeye yazın; ben de okurum, savcı da.',
            ),
            n('Bir an durdu. Sonra, otuz bir yılın bütün ağırlığıyla, başını salladı.'),
            s(
              'tezel',
              'Haklısınız. Yazacağım. Bana gelen numunenin kimden geldiğini hiç sormadım; mühür bana yeterdi. Bunu mahkemeye yazacağım. Altmış bir yaşında. Geç.',
              'uzgun',
            ),
            n('Gitti. Ayakkabılarının sesi Tarık Sönmez’inki gibi düzenli değildi; yorgun ve dürüst.'),
            th('Bir bilirkişinin kendi raporuna yazdığı en dürüst dipnot, bir koridorda söylediği cümleydi.'),
          ],
        },
        {
          lines: [
            card('14 NİSAN · 12.10 — ADLİYE KORİDORU', 'adliye'),
            n(
              'Koridorda Dr. Tezel’le karşılaştık. Başıyla selam verdi, durmadı. Bir bilirkişinin selamı bir onay değildir; bir nezakettir.',
            ),
            n('Koridorun ucunda takım elbiseli adam katılan vekiliyle gülüşüyordu. Raporu ayakta kalmıştı; adamı da.'),
            th('Bugün bir tanığı sarstım, bir bilirkişiyi değil. Üç hafta var. Ve hâlâ okunmamış ekler.'),
          ],
        },
      ],
      choices: [cont('H109_DEVAM', 'Adliyeden çık', 'ARA_GIRIS_1', { role: 'PRIMARY' })],
    }),
  ],
};
