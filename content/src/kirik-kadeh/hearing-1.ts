import {
  P,
  all,
  any,
  choiceNode,
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
  meet,
  not,
  objectRule,
  option,
  otherwise,
  presentRule,
  pressRule,
  raise,
  says,
  score,
  statement,
  story,
  when,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { D, HEAR1, Nx, S, T, card, court1, fx, wrongEvidence } from './shared.js';

// 60-hearing-1: 1. celse. Koridor, açılış, iddianame, Bora'nın savunması (oyuncu yönlendirir), boksörlük sorusuna
// itiraz, katılan Serkan'ın beyanı (K1–K5: bastır / sun / itiraz), delil talepleri, ara karar ve erteleme.

/** Savcılık dosyasındaki belgeler: savunma lehine sunulamaz (cezalı kural, en çok üç kez). */
export const prosecutionPapers = ['ev_tutanak', 'ev_onur_ifade', 'ev_gecici_rapor', 'ev_kadeh', 'ev_bora_ifade'];

export const hearing1: CasePart = {
  config: {
    objectionGrounds: [
      ground('g_kanaat', 'Görmediğini kanaatle ya da duyumla aktarıyor', 'CMK 217/1 (takdir)'),
      ground('g_ilgisiz', 'Olayla ilgisiz, kişiliği hedef alan soru ya da beyan', 'CMK 201/2'),
    ],
  },
  court: {
    sessions: [
      courtSession('cs_1', '1. Celse', [
        ['s1_acilis', 'ACILIS', 'H1_00'],
        ['s1_iddianame', 'IDDIANAME', 'H1_01'],
        ['s1_savunma', 'SANIK_SAVUNMASI', 'H1_02'],
        ['s1_beyan', 'TANIK_DINLEME', 'H1_04'],
        ['s1_delil', 'DELIL_TARTISMA', 'H1_05'],
      ]),
    ],
  },
  nodes: [
    // --- Koridor ---
    decisionNode('H1_00G', [{ to: 'H1_00G2' }], {
      ...HEAR1,
      title: 'Adliye koridoru',
      background: 'adliye',
      lines: says(
        card('ÇARŞAMBA 09.20 — BURSA ADLİYESİ, 3. KAT', 'adliye'),
        Nx(
          'Adliye koridorları sabah dokuzda bir tren garı gibidir: herkes bir yere geç kalmış, kimse nereye gittiğini söylemez.',
        ),
        Nx(
          'Bora bankta oturuyordu. Kasket dizinde, sargısız kolu ceketinin içinde. Beni görünce kalktı. Kalkması uzun sürdü.',
        ),
        S('bora', 'Erken geldim. Ev dar geldi.'),
        Nx(
          'Koridorun öbür ucunda burnunda ten rengi bir bantla Serkan Aydemir. Yanında, iki adım arkasında, kol saatini düzelten biri.',
        ),
      ),
    }),
    decisionNode('H1_00G2', [{ to: 'H1_00K' }], {
      ...HEAR1,
      lines: [
        when(
          has('ded_tanidik'),
          T('İki adım arkasında. Ne çok yakın ne çok uzak. Bir patronla çalışanı arasındaki mesafe tam olarak budur.'),
          Nx('Serkan bir şey söyledi, Onur güldü. Gülmesi bir saniye fazla sürdü.'),
        ),
        otherwise(
          T('Tanık ile müşteki aynı koridorda, aynı bankın iki ucunda. Tesadüf. Adliyede her şey tesadüftür.'),
          Nx('Serkan bir şey söyledi, Onur güldü. Gülmesi bir saniye fazla sürdü.'),
        ),
      ],
    }),
    story('H1_00K', {
      ...HEAR1,
      title: 'Adliye koridoru',
      background: 'adliye',
      lines: [
        when(
          any(flag('onur_tehdit'), flag('serkan_temas'), flag('bora_yuzlesti')),
          Nx('Tolga Şen yanımıza geldi. Cübbesi ütülü, gülümsemesi daha da ütülü.'),
          S(
            'tolga',
            'Meslektaşım, günaydın. Küçük bir not: dosyaya bir dilekçe verdim. Tanığımla, müvekkilimle yaşanan… temaslar hakkında.',
          ),
          S('tolga', 'Kişisel bir şey değil. Hâkim hanım bilsin istedim. Başarılar.'),
          T('Kişisel değil. Ama hâkim beni ilk kez bu dilekçeyle tanıyacak.'),
        ),
        otherwise(
          Nx('Tolga Şen yanımıza geldi. Cübbesi ütülü, gülümsemesi daha da ütülü.'),
          S('tolga', 'Meslektaşım, günaydın. Bora Bey. Bugün sadece tanışma, değil mi? Asıl dans gelecek celsede.'),
          S('bora', '…'),
          T('Bora ona bakmadı bile. Bakmamak, bazı adamların bildiği tek kibar hakarettir.'),
          Nx('Tolga gidince Bora kasketini iki eliyle tuttu, çevirdi. Leyla’nın sigara paketini çevirişi gibi.'),
          S('bora', 'İçeride ne olacak? Bana ne soracaklar?'),
          D(
            'Ne olduğunu. Sen ne gördüysen. Ben sana ne diyeceğini söylemeyeceğim; ama neyin bedelini ödeyeceğini söyleyeceğim.',
          ),
          S('bora', 'Bedel. Bedeli biliyorum. Bar kapalı.'),
        ),
      ],
      choices: [cont('H100K_DEVAM', 'Salona gir', 'H1_00', { role: 'PRIMARY' })],
    }),

    // --- Açılış ---
    court1.stage('H1_00', {
      title: 'Duruşma · 1. Celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onFirstEnter: [
        raise('in_court'),
        meet('hakim'),
        meet('savci'),
        meet('mubasir'),
        ifThen(any(flag('onur_tehdit'), flag('serkan_temas'), flag('bora_yuzlesti')), [dec('cred')]),
      ],
      lines: says(
        card('BURSA 7. ASLİYE CEZA MAHKEMESİ — 1. CELSE', 'durusma_salonu'),
        S('mubasir', 'Bora Yalçııın dosyasııı! Taraflar salonaaa!'),
        Nx(
          'Rıza Bey dosya adını şarkı gibi uzattı; son heceyi koridorun sonuna kadar taşıdı. Otuz yıldır böyle çağırıyormuş.',
        ),
        Nx(
          'Salon küçüktü. Bir hâkim, bir savcı, bir zabıt kâtibi, pencereden giren gri bir ışık. Bora kasketini çıkarıp dizine koydu.',
        ),
        Nx(
          'Hâkim Selma Karaca dosyayı açtı, ilk sayfayı okudu, son sayfayı okudu, sonra ortadan bir sayfa açıp onu da okudu. Kimseye bakmadan.',
        ),
        T(
          'Ortadan bir sayfa. Hangisi? Hastane evrakı mı, tutanak mı? Bir hâkimin hangi sayfayı açtığı bazen bir dosyanın kaderidir.',
        ),
        S('hakim', 'Sanığın kimliği tespit edildi. Katılan ve vekili hazır. Müdafi hazır. Açık yargılamaya başlandı.'),
        S(
          'hakim',
          'Sanık, size yöneltilen suçlamayı dinleyeceksiniz. Susma hakkınız var; söyledikleriniz aleyhinize de kullanılabilir. Anladınız mı?',
        ),
        S('bora', 'Anladım.'),
      ),
      choices: [cont('H100_DEVAM', 'Devam', 'H1_01')],
    }),
    court1.stage('H1_01', {
      title: 'İddianame',
      courtStage: 'IDDIANAME',
      lines: says(
        S(
          'savci',
          'İddianame özetle şöyledir: 3 Kasım gecesi saat 01.40 sularında, sanık işlettiği barda müşteki Serkan Aydemir ile tartışmış…',
        ),
        S(
          'savci',
          '…tezgâhta bulunan rakı kadehini kırarak müştekinin yüzüne vurmuş, yere düşen müştekiye tekme atmış; müştekide burun kemiği kırığı oluşmuştur.',
        ),
        S(
          'savci',
          'Sanığın eylemine uyan TCK 86/1, 86/3-e ve 87/3 maddeleri uyarınca cezalandırılması talep olunmuştur.',
        ),
        Nx(
          'Savcı Orhan Baysal iddianameyi kendisi yazmamıştı ama kendisi yazmış gibi okudu. Yorgun bir adamdı; yorgun adamlar tutanağa güvenir.',
        ),
        T('Kadeh. Yüz. Tekme. Üç kelime. Bora on dakikada üç kelimeye sığdırılmıştı.'),
        S('hakim', 'Sanık, savunmanızı alacağım. Müdafinizle görüşmek ister misiniz?'),
        S('bora', 'Bir dakika.'),
        Nx('Bora bana eğildi. Nefesinde nane ve uykusuzluk. “Ne diyeyim?” diye fısıldadı.'),
      ),
      choices: [cont('H101_DEVAM', 'Bora’ya fısılda', 'H1_02')],
    }),

    // --- Sanığın savunması ---
    court1.objection('H1_02', {
      title: 'Sanığın savunması',
      courtStage: 'SANIK_SAVUNMASI',
      say: [
        T('Ne diyeceğini ben söyleyemem. Ama neyin bedelini ödeyeceğini söyleyebilirim. Bir cümle. Hâkim bekliyor.'),
      ],
      next: 'H1_02R',
      options: [
        option('H102_A', '“Olduğu gibi anlat. Kolunu da, o geceyi de; ne gördüysen.”', {
          score: { SAVUNMA_STRATEJISI: 80 },
          effects: [raise('bora_durust'), inc('pers'), inc('trust', 4)],
          good: 'Doğru: müdafi sanığa ne söyleyeceğini kurgulamaz; doğruyu söylemesinin sonuçlarını anlatır, kararı ona bırakır (Av.K. md. 34; CMK 147/1-e: sanık susabilir, konuşursa kendi anlatımıdır).',
        }),
        option('H102_B', '“Kızdan söz etme. Onu korumak senin kararın; ama bedelini bil.”', {
          visibleWhen: flag('ece_itiraf'),
          effects: [raise('bora_ece_gizli'), raise('bora_durust')],
          neutral:
            'Müvekkilin bir tanığı anmama kararı onun hakkıdır; ama tanık sonradan ortaya çıkarsa karşı taraf bunu “saklanan tanık” diye kullanabilir.',
        }),
        option('H102_C', '“Vurmadığını söyle. Onun sözüne karşı senin sözün; kimse göremedi.”', {
          score: { SAVUNMA_STRATEJISI: -100 },
          effects: [raise('bora_yalan'), inc('ethics'), dec('cred', 2), dec('trust', 10)],
          bad: 'Müdafi müvekkiline gerçeğe aykırı savunma kurgulayamaz (Av.K. md. 34; TBB Meslek Kuralları md. 3). Üstelik darp raporu sağ eldeki yumruk ödemini gösteriyor: yalan ilk belgeyle çöker.',
        }),
        option('H102_D', '“Susma hakkını kullan. Yazılı savunmayı ben veririm.”', {
          effects: [raise('bora_sustu'), dec('pers')],
          neutral:
            'Susma hakkı meşrudur (CMK 147/1-e) ve aleyhe yorumlanamaz; ama meşru müdafaa iddiasının olayı ilk anlatanı sanığın kendisidir. Hâkim olayı bir kez daha yalnızca tanıktan dinleyecek.',
        }),
      ],
    }),
    story('H1_02R', {
      ...court1.base,
      title: 'Sanığın savunması',
      background: 'durusma_salonu',
      lines: [
        when(
          flag('bora_yalan'),
          S('bora', 'Ben… vurmadım. Adam kendisi düştü. Tabureye çarptı.', 'saskin'),
          S(
            'savci',
            'Sayın Başkan, sanığın kendi darp raporunda sağ elinde yumruk darbesiyle uyumlu ödem var. Kollukta da “vurdum” demiş.',
          ),
          S('hakim', 'Sanık, kollukta “vurdum, bir kere” demişsiniz. Bugün “vurmadım” diyorsunuz. Hangisi?'),
          Nx('Bora bana baktı. Ben kâğıtlarıma baktım. Hâkim ikimize de baktı.'),
          S('bora', '…Vurdum. Bir kere.', 'uzgun'),
          fx(T('Bir cümleyle müvekkilimi yalancı, kendimi de onun yalancısı yaptım.'), 'shake'),
        ),
        when(
          flag('bora_sustu'),
          S('bora', 'Susacağım. Avukatım yazar.'),
          S('hakim', 'Tutanağa geçsin: sanık susma hakkını kullandı. Müdafi, yazılı savunma için süre verilecek.'),
          T('Hakkını kullandı. Ama salonda olayı anlatan tek ses şimdi tanığın sesi.'),
        ),
        when(
          all(flag('bora_ece_gizli'), flag('kamera_yalan')),
          S(
            'bora',
            'Adam tezgâha geldi. Bağırdı. Kadehi tezgâha vurdu, kırık tarafıyla bana savurdu. Kolumu kaldırdım. Kesildi.',
          ),
          S(
            'bora',
            'Bileğini tuttum. Bir kere vurdum. Düştü. Yerde camı yine kaldırdı. Ayağımla bileğine bastım, bıraktı.',
          ),
          S('bora', 'Kamera bozuktu. O gece çekmiyordu.'),
          T('Kamera bozuktu. Dilimin altında bir taş gibi duruyordu bu cümle. Şimdi tutanakta.'),
        ),
        when(
          flag('bora_ece_gizli'),
          S(
            'bora',
            'Adam tezgâha geldi. Bağırdı. Kadehi tezgâha vurdu, kırık tarafıyla bana savurdu. Kolumu kaldırdım. Kesildi.',
          ),
          S(
            'bora',
            'Bileğini tuttum. Bir kere vurdum. Düştü. Yerde camı yine kaldırdı. Ayağımla bileğine bastım, bıraktı. Tekme yok.',
          ),
          S('hakim', 'Barda sizden başka çalışan var mıydı?'),
          S('bora', '…Yalnızdım.'),
          T('Yalnızdım. Bir kızı korumak için söylenen küçük bir yalan. Küçük yalanlar mahkemede büyür.'),
        ),
        when(
          all(flag('ece_itiraf'), flag('kamera_yalan')),
          S('bora', 'Masa dörtteki adam tezgâha geldi. Garson kızın bileğini tuttu. “Bırak” dedim. Bırakmadı.'),
          S(
            'bora',
            'Kadehi tezgâha vurdu, kırık tarafıyla bana savurdu. Kolumu kaldırdım. Bileğini tuttum, bir kere vurdum. Düştü.',
          ),
          S('bora', 'Kızı arka kapıdan gönderdim. Polis gelmeden. Sigortasızdı. Benim suçum.'),
          S('bora', 'Kamera bozuktu.'),
          T('Her şeyi doğru söyledi. Biri hariç. O biri, bana söz verdirdiği şeydi.'),
        ),
        when(
          flag('ece_itiraf'),
          S('bora', 'Masa dörtteki adam tezgâha geldi. Garson kızın bileğini tuttu. “Bırak” dedim. Bırakmadı.'),
          S(
            'bora',
            'Kadehi tezgâha vurdu, kırık tarafıyla bana savurdu. Kolumu kaldırdım. Kesildi. Bileğini tuttum, bir kere vurdum. Düştü.',
          ),
          S('bora', 'Yerde camı yine kaldırdı. Ayağımla bileğine bastım. Bıraktı. Tekme dedikleri o.'),
          S(
            'bora',
            'Sonra geri çekildim. Gözlüklü arkadan tuttu beni, ittim. Sonra polisi aradım. Ambulansı da. Havlu sardım koluma. Kapıda bekledim.',
          ),
          S(
            'bora',
            'Kızı arka kapıdan gönderdim. Polis gelmeden. Sigortasızdı, babası bilmiyor. O benim suçum. Gerisi değil.',
          ),
          Nx('Salonda bir kıpırtı. Tolga Şen kalemini bıraktı. Savcı ilk kez başını dosyadan kaldırdı.'),
          S('hakim', 'Kızın adı ne? Nerede şimdi?'),
          S('bora', 'Ece. Öğrenci. Adını avukatım bilir. Ben… onu bu işe karıştırmak istemedim. Karıştırdım galiba.'),
          S(
            'hakim',
            'Tutanağa geçsin: olay sırasında barda bir garson bulunduğu, sanık tarafından olaydan önce gönderildiği.',
          ),
          T(
            'Kendi aleyhine bir şeyi, kimse sormadan söyledi. Hâkimler bunu not eder. Ben de ettim. Tolga Şen de etti; ama başka bir sütuna.',
          ),
        ),
        otherwise(
          S(
            'bora',
            'Adam tezgâha geldi. Bağırdı. Kadehi tezgâha vurdu, kırık tarafıyla bana savurdu. Kolumu kaldırdım. Kesildi.',
          ),
          S(
            'bora',
            'Bileğini tuttum. Bir kere vurdum. Düştü. Yerde camı yine kaldırdı. Ayağımla bileğine bastım, bıraktı. Tekme yok.',
          ),
          S('hakim', 'Barda sizden başka çalışan var mıydı?'),
          S('bora', '…', 'uzgun'),
          S('bora', 'O saatte… yalnızdım.'),
          T('Bir an durdu. O bir an, bir cümleden uzundu. Neyi saklıyor?'),
        ),
      ],
      choices: [cont('H102R_DEVAM', 'Devam', 'H1_03')],
    }),

    // --- Boksörlük sorusu ---
    court1.objection('H1_03', {
      title: 'Katılan vekilinin sorusu',
      courtStage: 'SANIK_SAVUNMASI',
      say: [
        S('hakim', 'Katılan vekili, sanığa sorunuz var mı?'),
        S(
          'tolga',
          'Bir tane, Sayın Başkan. Sanık, 1996’da genç milli boks takımının kampındaydınız, değil mi? Yumruğunuzun bir insana ne yapacağını herkesten iyi bilirsiniz.',
        ),
        S('tolga', 'Yirmi beş yıl ringde öğrendiğiniz şeyi o gece bir müşterinin yüzünde denediniz mi?'),
        T('Fotoğrafı duvarda görmüştü ya da biri ona anlatmıştı. Soru olayla değil, Bora’nın gençliğiyle ilgili.'),
      ],
      next: 'H1_03R',
      options: [
        option('H103_A', 'İtiraz: soru olayla ilgisiz, sanığın geçmişini hedef alıyor', {
          score: { USUL_BILGISI: 100 },
          effects: [raise('boks_itiraz'), inc('legal_hits'), inc('pers')],
          good: 'Yerinde: soruların kabul edilebilirliğine mahkeme karar verir (CMK 201/2). Yirmi beş yıl önceki amatör spor geçmişi, olay anındaki saldırının kimden geldiğini göstermez; sanığı “tehlikeli kişi” diye etiketlemeye yöneliktir.',
        }),
        option('H103_B', 'Bora cevap versin: “Bildiğim için bir kere vurdum.”', {
          score: { SAVUNMA_STRATEJISI: 40 },
          effects: [ifThen(flag('fact_oranti'), [inc('pers'), score('SAVUNMA_STRATEJISI', 40)])],
          good: 'Riskli ama savunulabilir: orantıyı bilen bir elin tek darbesi. Yine de soru ilgisizdi; itiraz daha temiz olurdu (CMK 201/2).',
        }),
        option('H103_C', 'İtiraz: soru yönlendirici, cevabı kendi içinde veriyor', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Yanlış gerekçe: soru sanığa soruldu ve telkin değil, olayla ilgisiz bir karakter sorusuydu. Doğru dayanak, sorunun ilgisizliğidir (CMK 201/2).',
        }),
        option('H103_D', 'Etiketi büyütmeyelim; itiraz etmiyoruz', {
          effects: [dec('pers')],
          neutral:
            'Soru itirazsız kaldı; susmak etiketi küçültmedi, “eski boksör” etiketi tutanağa girdi (CMK 201/2 itiraz yolu açıktı).',
        }),
      ],
    }),
    story('H1_03R', {
      ...court1.base,
      title: 'Katılan vekilinin sorusu',
      background: 'durusma_salonu',
      lines: [
        when(
          flag('boks_itiraz'),
          P(
            'İtiraz ediyorum Sayın Başkan. Soru olayla değil, sanığın yirmi beş yıl önceki gençliğiyle ilgili. Sabıkası yok. Bu bir soru değil, bir etiket.',
          ),
          S('hakim', 'İtiraz yerinde. Soru reddedildi. Katılan vekili, olayla ilgili sorunuz varsa sorun.'),
          S('tolga', 'Başka sorum yok Sayın Başkan. Meslektaşım uyanık; not ettim.', 'mutlu'),
          T('Tolga’nın gülümsemesi değişmedi. Ama kalemini bir kez masaya vurdu.'),
        ),
        when(
          flag('fact_oranti'),
          S('bora', 'Biliyorum. O yüzden bir kere vurdum. Bilmeyen beş kere vurur.'),
          Nx('Salonda biri hafifçe güldü. Hâkim kalemini kaldırdı; gülme kesildi.'),
          S('hakim', 'Tutanağa geçsin: sanık “bir kere vurdum, bildiğim için” dedi.'),
          T('Riskliydi. Ama doğruydu; doğru şeyler bazen risklidir.'),
        ),
        otherwise(
          S('bora', 'Doksan altı. Kaybettim, bıraktım. Yirmi beş yıl kimseye vurmadım.'),
          S('tolga', 'Ama o gece vurdunuz. Teşekkürler, başka sorum yok.'),
          T('Bir etiket tutanağa girdi: eski boksör. Etiketler silinmez; üstüne başka şeyler yazılır.'),
        ),
      ],
      choices: [cont('H103R_DEVAM', 'Devam', 'H1_03S')],
    }),

    court1.objection('H1_03S', {
      title: 'Savcının sorusu',
      courtStage: 'SANIK_SAVUNMASI',
      say: [
        S('hakim', 'Sayın Savcı?'),
        S(
          'savci',
          'Sanık, bir şey merak ediyorum. Müşteki yere düştükten sonra neden tezgâhtan çıktınız? Olay bitmişti. Tezgâhın arkasında kalabilirdiniz.',
        ),
        Nx('Yorgun bir sesle sordu; ama yorgun sesler en zor soruları sorar. Tanığın “tekme” dediği an tam bu andı.'),
        T(
          'Doğru soru. Savcı tutanağı okumuş; tutanağın sormadığını soruyor. Bora’nın cevabı ya bu dosyanın en ağır cümlesini taşıyacak ya da onu kıracak.',
        ),
      ],
      next: 'H1_04V',
      options: [
        option('H103S_A', 'Soru yerinde; Bora cevaplasın', {
          effects: [
            ifThen(
              any(flag('fact_bilek_anlati'), all(flag('bora_durust'), not(flag('bora_sustu')))),
              [
                score('SAVUNMA_STRATEJISI', 60),
                inc('pers'),
                mark(
                  'GOOD',
                  'Savcının sorusu yerindeydi (CMK 201/1); sanık yerdeki hareketi kendi sözleriyle açıkladı.',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
              [score('SAVUNMA_STRATEJISI', 10)],
            ),
          ],
          responses: [
            when(
              flag('bora_sustu'),
              S('bora', 'Susacağım dedim. Susuyorum.'),
              S('savci', 'Tutanağa geçsin. Sanık soruya cevap vermedi.'),
              T('Hakkıydı. Ama savcı sorusunu tutanağa yazdırdı ve soru orada, cevapsız, bekliyor.'),
            ),
            when(
              any(flag('fact_bilek_anlati'), flag('bora_durust')),
              S('bora', 'Bitmemişti. Yerde camı yine kaldırdı. Sapı. Sağ elinde.'),
              S(
                'bora',
                'Tezgâhtan çıktım. Ayağımla bileğine bastım. Bıraktı. Sapı ayağımla uzağa ittim. Sonra geri çekildim. Sonra polisi aradım.',
              ),
              S('savci', 'Tekme atmadınız mı?'),
              S('bora', 'Yerde yatana vurmam. Ringde bile vurmam.'),
              Nx('Savcı bir şey not etti. Kalemi uzun süre kâğıdın üstünde kaldı.'),
              T(
                'Bora’nın yerdeki hareketi artık tutanakta, kendi ağzından. Şimdi bunu kâğıtla göstermem gerek: bir bilek, bir iz.',
              ),
            ),
            otherwise(
              S('bora', 'Bitmemişti.'),
              S('savci', 'Nasıl bitmemişti?'),
              S('bora', '…Bitmemişti işte.'),
              T('Bir cümle eksik kaldı. Neyin bitmediğini Bora biliyor; ben bilmiyorum, savcı da bilmiyor.'),
            ),
          ],
        }),
        option('H103S_B', 'İtiraz: soru sanığı suçlamaya yönelik', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Dayanaksız: savcı sanığa doğrudan soru yöneltebilir (CMK 201/1); olayın akışına dair soru suçlayıcı olduğu için ilgisiz sayılmaz.',
          responses: says(
            P('İtiraz ediyorum Sayın Başkan, soru sanığı suçlamaya yönelik.'),
            S('hakim', 'Bütün sorular bir yere yöneliktir müdafi. Soru olayla ilgili; reddedildi. Sanık, cevap verin.'),
            S('bora', 'Bitmemişti.'),
            T('İtirazım cevabın önüne bir duvar ördü; hâkim duvarı yıktı ve cevabı yarım bıraktı.'),
          ),
        }),
        option('H103S_C', '“Müvekkilim bu soruya cevap vermeyecek.”', {
          effects: [dec('pers')],
          neutral:
            'Sanık tek tek sorulara cevap vermeyebilir (CMK 147/1-e); ama meşru savunma iddiasının merkezindeki soruyu cevapsız bırakmak hâkimin aklında bir boşluk bırakır.',
          responses: says(
            S('savci', 'Peki. Tutanağa geçsin.'),
            T('Bir soru cevapsız kaldı. Cevapsız sorular salonda cevaplanmış sorulardan daha uzun yaşar.'),
          ),
        }),
      ],
    }),
    // --- Katılanın beyanı ---
    story('H1_04V', {
      ...court1.base,
      title: 'Katılan',
      background: 'durusma_salonu',
      onFirstEnter: [meet('serkan')],
      lines: says(
        S(
          'hakim',
          'Katılan Serkan Aydemir. Yemin ettirilmeden dinleneceksiniz; ama gerçeği söylemeniz beklenir. Olayı anlatın.',
        ),
        Nx(
          'Serkan kürsüye geldi. Takım elbise, açık renk gömlek, burnundaki bant. Elini kürsünün kenarına koydu, bir mağdurun nasıl durması gerektiğini çok düşünmüş gibi.',
        ),
        S('serkan', 'Sayın hâkimim, ben… bakın şimdi. Ben medeni bir insanım. Sigortacıyım. Hayatımda kavga etmedim.'),
        S(
          'serkan',
          'O gece bir kadeh içmeye gittim. Hesabımı sordum. Bu adam bağırdı, kadehi kırdı, yüzüme vurdu. Yere düştüm. Tekmeledi. Onur Bey olmasa… bilmiyorum.',
        ),
        Nx('Sesi “bilmiyorum”da titredi. Tam zamanında. Arka sırada biri, belki Serkan’ın annesi, mendilini çıkardı.'),
        T('“Bakın şimdi.” Bir hikâyeyi baştan sona ezberleyen insanlar ilk cümleye hep bir kapı koyar.'),
      ),
      choices: [cont('H104V_DEVAM', 'Beyanı dinle', 'H1_04')],
    }),
    court1.testimony('H1_04', {
      title: 'Katılanın beyanı',
      courtStage: 'TANIK_DINLEME',
      witness: 'serkan',
      witnessLabel: 'KATILAN · SERKAN AYDEMİR',
      say: [S('hakim', 'Katılan beyanını kesintisiz verdi. Müdafi, sorularınız?')],
      rulesText:
        'Önce bastır, sonra doğru delili doğru ifadeye sun. Katılanın acısı gerçek olabilir; çelişkisi de. Yanlış delil güvenilirliği düşürür.',
      objectionGrounds: ['g_kanaat', 'g_ilgisiz'],
      statements: [
        statement('K1', 1, [
          'O gece ',
          hl('bir iki kadeh içmiştim, o kadar', any(flag('press_k1'), has('clue_alkol'))),
          '. Ayıktım.',
        ]),
        statement('K2', 2, [
          'Onur Bey’i ',
          hl('o gece orada tanıdım', has('ded_tanidik')),
          '. Allah razı olsun, ayırmaya çalıştı.',
        ]),
        statement('K3', 3, [
          hl('Elimde hiçbir şey yoktu', any(flag('press_k3'), has('ded_kadeh_serkan'))),
          '. Avucumu yere düşünce camlara basıp kestim.',
        ]),
        statement('K4', 4, [
          'Kadehi tezgâhta kırdı, ',
          hl('kırık tarafıyla yüzüme vurdu', any(flag('press_k4'), has('ded_yumruk'))),
          '.',
        ]),
        statement('K5', 5, [
          'Ben sadece hesabımı soruyordum, ',
          hl('kimseye dokunmadım', any(flag('press_k5'), flag('fact_ece_gordu'), flag('fact_serkan_taciz'))),
          '. O eski boksör ',
          hl('zaten kavga arar, herkes bilir'),
          '.',
        ]),
      ],
      rules: [
        presentRule('PS_K_SAVCILIK', undefined, prosecutionPapers, {
          maxUses: 3,
          effects: [
            ...wrongEvidence,
            score('SORGULAMA', -150, 'hatali'),
            mark('BAD', 'İddianın kendi belgesini katılana karşı sunmak bir çelişki doğurmaz.', 'SORGULAMA'),
          ],
          responses: says(
            S('savci', 'Sayın Başkan, müdafi bizim dosyamızı okuyor.'),
            S('hakim', 'Müdafi, bunun beyanla ilgisi ne?'),
          ),
        }),
        pressRule('PR_K1', 'K1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k1')],
          responses: [
            when(
              flag('fact_bora_ayik'),
              P('Bir iki kadeh. Masanızın hesabında altı duble rakı var. Kaç kişiydiniz?'),
              S(
                'serkan',
                'Kaç kişi… Ben yalnızdım. Yani masada… bakın şimdi, ben kendi içtiğimi bilirim. İki kadeh.',
                'saskin',
              ),
              T(
                'Yalnızdı. Masada iki ceket, iki tabak vardı. Ve o gece salonda alkolü sıfır olan tek kişi tezgâhın arkasındaki adamdı; raporu öyle diyor.',
              ),
            ),
            otherwise(
              P('Bir iki kadeh. Masanızın hesabında altı duble rakı var. Kaç kişiydiniz?'),
              S(
                'serkan',
                'Kaç kişi… Ben yalnızdım. Yani masada… bakın şimdi, ben kendi içtiğimi bilirim. İki kadeh.',
                'saskin',
              ),
              T('Yalnızdı. Masada iki ceket, iki tabak vardı.'),
            ),
          ],
        }),
        presentRule('PS_K1', 'K1', ['ev_hastane', 'ded_saldirgan'], {
          score: { SORGULAMA: 250 },
          effects: [
            inc('pers'),
            raise('contra_k1'),
            mark('GOOD', 'Acil kaydı: 02.25’te kan alkolü 1,9 promil. “Bir iki kadeh” değil.', 'SORGULAMA'),
          ],
          responses: says(
            P('Sayın Başkan, katılanın acil servis kaydı: olaydan kırk beş dakika sonra kan alkolü 1,9 promil.'),
            P('Bir iki kadehle 1,9 promile çıkılmaz. Katılan o gece ayakta zor duran biriydi.'),
            S('serkan', 'Onlar… hastanede yanlış ölçmüşlerdir. Bakın şimdi, ben…', 'saskin'),
            S('hakim', 'Tutanağa geçsin: acil kaydında kan alkolü 1,9 promil.'),
            T('Bir kadeh daha kırıldı. Bu sefer kâğıt üstünde.'),
          ),
        }),
        presentRule('PS_K2', 'K2', ['ded_tanidik', 'ev_eczane'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_k2'),
            mark(
              'GOOD',
              'Masa 4: iki kişi, tek hesap, ödeme Onur Kılıç’ın kartından. “O gece tanıdım” diyen katılan, tanıkla aynı masadaydı.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P(
              'Gölge’nin adisyonu, masa 4: iki kişi, açılış 22.10, altı duble rakı. Hesap tek, ödeme O. KILIÇ adına kayıtlı bir karttan.',
            ),
            P('Katılan, o gece tanıdığınızı söylediğiniz adam rakınızın parasını ödemiş. Nasıl oluyor?'),
            S('serkan', 'O… ben… ikram etti. Barda tanıştık, ikram etti.', 'saskin'),
            S('tolga', 'Sayın Başkan, bir hesap fişinden tanışıklık çıkarılamaz.'),
            S('hakim', 'Çıkarılıp çıkarılamayacağına ben karar veririm. Katılan, Onur Kılıç’la nerede çalışıyorsunuz?'),
            Nx('Uzun bir sessizlik. Serkan vekiline baktı. Tolga Şen bakmadı.'),
            S('serkan', '…Aynı şirkette. Ama bu, bakın şimdi, onun gördüğünü değiştirmez ki.', 'kizgin'),
            fx(Nx('Salonun arkasında Onur Kılıç kol saatini düzeltti. Bu sefer iki kez.'), 'shake'),
            S('hakim', 'Tutanağa geçsin: katılan, tanık Onur Kılıç ile aynı şirkette çalıştığını beyan etti.'),
            T(
              'Bir tanık, kürsüye çıkmadan yaralandı. Gelecek celse o yarayla gelecek; ya kapatmaya çalışacak ya da açacak.',
            ),
          ),
        }),
        pressRule('PR_K3', 'K3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k3')],
          responses: says(
            P('Avucunuzu nasıl kestiniz? Elinizin üstünü mü, içini mi?'),
            S('serkan', 'İçini. Düşünce elimi yere koydum, camlar vardı. Ne yapayım?'),
            T(
              'Düşen adam elini yere açık koyar. Avuç boyunca enine bir kesi, açık bir elden değil, sıkılmış bir yumruktan çıkar.',
            ),
          ),
        }),
        presentRule('PS_K3', 'K3', ['ded_kadeh_serkan', 'ev_kriminal'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_k3'),
            mark(
              'GOOD',
              'Fotoğraf 7 ve acil kaydı: sap, katılanın sağ elinin yanında; avuçtaki enine kesi kavramayla uyumlu.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P(
              'Kolluk fotoğrafı 7, katılan sedyeye alınmadan önce: kırık sap yerde, katılanın sağ elinin hemen yanında. Kan izi elden sapa uzanıyor.',
            ),
            P(
              'Acil kaydı: sağ el ayasında enine dört santimlik kesi. Yere açık el konursa böyle kesilmez. Kırık bir camı sıkıca tutan el böyle kesilir.',
            ),
            S('serkan', 'Ben… yerde bir şey tuttum belki, kalkmak için. Ne bileyim!', 'kizgin'),
            S('savci', 'Sayın Başkan, fotoğrafın aslını görmek istiyorum.'),
            Nx('Savcı fotoğrafa uzun uzun baktı. Sonra tutanağa. Sonra yine fotoğrafa.'),
            S(
              'savci',
              'Tutanakta “tezgâh önü” yazıyor. Fotoğrafta sap, yerdeki elin yanında. Bunu not ediyorum Sayın Başkan.',
            ),
            T('Yorgun savcı ilk kez yorgunluğunu unuttu.'),
          ),
        }),
        presentRule('PS_K3B', 'K3', ['ev_hastane'], {
          enabledWhen: flag('press_k3'),
          maxUses: 1,
          score: { SORGULAMA: 100 },
          effects: [
            mark(
              'GOOD',
              'Kısmi: kesinin yeri bir soru açar ama sapın kimin elinde olduğunu tek başına göstermez.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P('Acil kaydı: kesi avucun içinde, enine. Yere düşen biri için tuhaf bir yer.'),
            S('serkan', 'Tuhafsa tuhaf. Düştüm, kestim.'),
            T('Bir yara tek başına konuşmaz. Yanına bir fotoğraf lazım.'),
          ),
        }),
        pressRule('PR_K4', 'K4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k4')],
          responses: says(
            P('Kırık kadeh yüzünüze geldi. Yüzünüzde kaç dikiş var?'),
            S('serkan', 'Dikiş… yok. Burnum kırıldı! Burnum! Bu yetmiyor mu?', 'kizgin'),
            T('Kırık bir kadeh yüze vurulup tek çizik bırakmaz mı? Bırakır.'),
          ),
        }),
        presentRule('PS_K4', 'K4', ['ded_yumruk'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_k4'),
            mark('GOOD', 'Katılan acilde kendi ağzıyla “yumrukla vuruldum” demiş; yüzünde kesi yok.', 'SORGULAMA'),
          ],
          responses: says(
            P(
              'Acil servisin triyaj notu, olaydan kırk beş dakika sonra, sizin ağzınızdan: “Kavgada yumrukla vuruldum.”',
            ),
            P('Kadehten söz yok. Ve yüzünüzde tek bir kesi yok. Kırık cam yüze vurulup iz bırakmaz mı?'),
            S('serkan', 'O an… şoktaydım. Ne dediğimi bilmiyordum.', 'uzgun'),
            S('hakim', 'Katılan, acildeki beyanınız mı doğru, bugünkü mü?'),
            S('serkan', 'Yumruk da attı! Yani… önce kadeh, sonra yumruk. Ya da… bakın şimdi…', 'saskin'),
            S(
              'tolga',
              'Sayın Başkan, katılan travma altında. Darbenin hangi nesneyle geldiğini o an ayırt etmesi beklenemez.',
            ),
            S('hakim', 'Acil serviste ayırt etmiş ama, avukat bey. Yumruk demiş.'),
            T(
              '“Ya da.” Kürsüde bir mağdurun ağzından çıkabilecek en pahalı iki kelime. Hâkim onları ücretsiz bırakmadı.',
            ),
          ),
        }),
        presentRule('PS_K4B', 'K4', ['ev_hastane'], {
          enabledWhen: flag('press_k4'),
          maxUses: 1,
          score: { SORGULAMA: 100 },
          effects: [
            mark(
              'GOOD',
              'Kısmi: yüzde kesi olmaması anlatımı sarsar; katılanın ilk beyanı tahtada bağlanmadı.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P('Acil kaydında yüzde kesi yok.'),
            S('serkan', 'Kadeh burnuma geldi, kırık tarafı değil. Ne bileyim hangi tarafı!'),
            T('Hikâyesini benim elimdeki kâğıda göre düzeltiyor. Kâğıdın tamamını göstermem lazım.'),
          ),
        }),
        pressRule('PR_K5', 'K5', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k5')],
          responses: [
            when(
              any(flag('fact_ece_gordu'), flag('fact_serkan_taciz')),
              P('Hesabınızı sorarken garson kızın bileğini tutmadınız mı?'),
              S('serkan', 'Ne kızı? Bakın şimdi… şakalaştık. Kız güldü. Bu adam kıskançlık yaptı.', 'kizgin'),
              S('tolga', 'Sayın Başkan, dosyada böyle bir garson yok. Müdafi hayali tanıklar üretiyor.'),
              T('Dosyada yok. Ama Serkan “ne kızı” dedikten sonra “kız güldü” dedi.'),
            ),
            otherwise(
              P('Hesabınızı sorarken tezgâha ne kadar yaklaştınız?'),
              S('serkan', 'Normal. Tezgâhın önüne. Hesap sordum, bu adam bağırdı.'),
              T('Tezgâhın önüne. Kadehin kırıldığı yer de orasıydı.'),
            ),
          ],
        }),
        presentRule('PS_K5', 'K5', ['ded_savunma', 'ded_saldirgan', 'ev_darp'], {
          score: { SORGULAMA: 250 },
          effects: [
            inc('pers'),
            raise('contra_k5'),
            mark(
              'GOOD',
              'Sanığın kesisi kolunu siper etmesiyle uyumlu, kan tezgâhın içinde başlıyor: ilk kesilen tezgâhın arkasındaki sanıktı.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P(
              'Sanığın darp raporu: sol önkolun dış kenarında altı santimlik kesi. Yüzüne gelen bir şeye kolunu kaldıran birinin yarası.',
            ),
            P(
              'Ve kolluk fotoğrafı 3: kan tezgâhın iç tarafında başlıyor. İlk kanayan tezgâhın arkasındaki adamdı. Kimseye dokunmadıysanız onu kim kesti?',
            ),
            S('serkan', 'Kendi kesmiştir! Kadehi kırarken kendi kesmiştir!', 'kizgin'),
            S('hakim', 'Sanık kadehi kırarken kendi önkolunun dış kenarını mı kesti, katılan?'),
            S('serkan', '…Bilmiyorum.', 'uzgun'),
          ),
        }),
        objectRule('OB_K5', 'K5', 'g_kanaat', {
          maxUses: 1,
          score: { USUL_BILGISI: 50 },
          effects: [
            inc('pers'),
            inc('legal_hits'),
            mark('GOOD', 'İtiraz yerinde: “herkes bilir” bir gözlem değil, duyum ve kanaattir.', 'USUL_BILGISI'),
          ],
          responses: says(
            P(
              'İtiraz ediyorum Sayın Başkan. “Herkes bilir” bir gözlem değil. Katılan görmediği bir şeyi kanaat olarak aktarıyor.',
            ),
            S('hakim', 'İtiraz yerinde. Katılan, yalnızca o gece gördüklerinizi ve yaşadıklarınızı anlatın.'),
            S('serkan', 'Peki. Peki efendim.'),
          ),
        }),
      ],
      presentMiss: fallback('FB_H104_PRESENT', 'PRESENT', {
        effects: [
          ...wrongEvidence,
          score('SORGULAMA', -150, 'hatali'),
          mark('BAD', 'Sunulan delil bu beyanla çelişmiyor.', 'SORGULAMA'),
        ],
        responses: says(
          S('hakim', 'Müdafi, bunun beyanla ilgisini göremiyorum.'),
          S('serkan', 'Ne alakası var bunun?'),
        ),
      }),
      objectMiss: fallback('FB_H104_OBJECT', 'OBJECT', {
        effects: [
          dec('cred'),
          score('SORGULAMA', -50, 'hatali'),
          mark('BAD', 'Dayanaksız itiraz: katılan burada kendi yaşadığını anlatıyor.', 'SORGULAMA'),
        ],
        responses: says(S('hakim', 'İtiraz reddedildi. Katılan kendi yaşadığını anlatıyor.')),
      }),
      finish: { id: 'H104_BITIR', label: 'Sorularım bu kadar', next: 'H1_04R' },
    }),
    story('H1_04R', {
      ...court1.base,
      title: 'Katılan',
      background: 'durusma_salonu',
      lines: [
        when(
          any(flag('contra_k2'), flag('contra_k3'), flag('contra_k4')),
          Nx('Serkan kürsüden indi. Yerine oturduğunda burnundaki bandı kaşıdı; parmakları titriyordu.'),
          S(
            'tolga',
            'Sayın Başkan, katılan travma yaşamış bir mağdurdur. Ayrıntılarda yanılması doğaldır. Asıl tanığı gelecek celse dinleyeceğiz.',
          ),
          T(
            'Asıl tanık. Kol saatli, kibar, net. Bugün bir yara aldı; gelecek celse kürsüye ben ne götürürsem o kadar kanayacak.',
          ),
          Nx(
            'Arka sırada Onur Kılıç dizlerine bakıyordu. Bir kez başını kaldırdı, Serkan’ın ensesine baktı; sonra yine dizlerine.',
          ),
          T(
            'Tanık, katılanın ensesine bakıyor. O bakışta korku mu vardı, yorgunluk mu? İkisi de bir tanığı konuşturabilir. Ya da susturabilir.',
          ),
        ),
        otherwise(
          Nx(
            'Serkan kürsüden indi. Vekiline başıyla teşekkür etti, sonra Bora’ya baktı. Bir zafer bakışıydı; erken ama yine de zafer.',
          ),
          S('tolga', 'Sayın Başkan, katılanın anlatımı tanık beyanıyla tam bir uyum içindedir.'),
          T(
            'Uyum. İki kişi aynı hikâyeyi anlatınca uyum, iki kişi aynı masada oturunca ezber denir. Bunu henüz ispatlayamadım.',
          ),
        ),
      ],
      choices: [cont('H104R_DEVAM', 'On dakika ara', 'H1_MOLA')],
    }),

    story('H1_MOLA', {
      ...HEAR1,
      title: 'On dakika',
      background: 'adliye',
      lines: [
        when(
          any(flag('contra_k2'), flag('contra_k3'), flag('contra_k4')),
          card('KORİDOR — ON DAKİKALIK ARA', 'adliye'),
          Nx(
            'Hâkim on dakika ara verdi. Koridorda Bora pencereye gitti, alnını cama dayadı. Cam buğulandı, sildi, yine buğulandı.',
          ),
          S('bora', 'Adam bocaladı. Gördüm. Ama inanmadılar, değil mi? Kimse inanmadı.'),
          D('Hâkim not aldı. İnanmak ayrı, not almak ayrı. Not almak daha önemli.'),
          S('bora', 'Sen bilirsin.'),
          Nx(
            'Koridorun öbür ucunda Tolga Şen Serkan’la konuşuyordu; alçak sesle, ama elleriyle. Serkan bir kez Onur’a döndü, bir şey söyledi. Onur başını salladı, çok hızlı.',
          ),
          T('Biri bir şey söyledi, öbürü başını salladı; fazla hızlı. Bunu kürsüye taşıyamam. Ama aklıma not ettim.'),
          S('bora', 'Avukat hanım. O gözlüklü. Bir şey diyecek gibi bakıyor bana.'),
          D('Ona bakma, Bora. Ne o sana, ne sen ona. Konuşacaksa salonda konuşur.'),
          Nx('Mübaşir kapıyı açtı. “Bora Yalçııın!” On dakika dokuz dakika sürmüştü.'),
        ),
        otherwise(
          card('KORİDOR — ON DAKİKALIK ARA', 'adliye'),
          Nx(
            'Hâkim on dakika ara verdi. Koridorda Bora pencereye gitti, alnını cama dayadı. Cam buğulandı, sildi, yine buğulandı.',
          ),
          S('bora', 'Yalan söyledi. Kürsüde, yüzüme baka baka. Ve kimse bir şey demedi.'),
          D('Ben bir şey diyecektim. Elimde söyletecek kâğıt yoktu.'),
          S('bora', 'Kâğıt. Hep kâğıt.'),
          Nx(
            'Koridorun öbür ucunda Tolga Şen Serkan’ın omzuna dokundu. Serkan güldü; ilk kez bütün gün. Onur gülmedi.',
          ),
          T('Bir mağdurun kürsüden sonra gülmesi. Bunu kürsüye taşıyamam. Ama hatırlayacağım.'),
          Nx('Mübaşir kapıyı açtı. “Bora Yalçııın!”'),
        ),
      ],
      choices: [cont('H1MOLA_DEVAM', 'Salona dön', 'H1_05')],
    }),

    // --- Delil talepleri ---
    choiceNode('H1_05', {
      ...court1.base,
      title: 'Delil talepleri',
      background: 'durusma_salonu',
      hud: ['h1_hak', 'pers'],
      lines: [
        when(
          any(flag('req_kriminal'), flag('req_eczane'), flag('req_ece')),
          S(
            'hakim',
            'Müdafinin yazılı delil dilekçesi dosyada; okundu. Adli Tıp’tan kesin rapor mahkememizce zaten istenecek. Ek talebiniz var mı?',
          ),
          T('Dilekçe işini gördü. Burada iki hakkım daha var; boşa harcamamalıyım.'),
        ),
        otherwise(
          S('hakim', 'Müdafi, delil talepleriniz? Adli Tıp’tan kesin rapor mahkememizce zaten istenecek.'),
          T(
            'Dilekçe vermemiştim ya da yetmemişti. Şimdi, burada, ağızdan. Hâkim iki talebi dinler; üçüncüsünde saatine bakar.',
          ),
        ),
      ],
      prompt: 'Duruşmada ne talep edeceksin? (İki talep hakkı)',
      choices: [
        option('H105_KRIM', 'Emanetteki kırık kadehin Kriminal incelemesi', {
          visibleWhen: not(flag('req_kriminal')),
          cost: [{ var: 'h1_hak', amount: 1 }],
          score: { USUL_BILGISI: 70 },
          effects: [raise('h1_kriminal')],
          good: 'Yerinde: delilin toplanması duruşmada da istenebilir (CMK 206/1). Sap üzerindeki izler, sapı kimin nasıl tuttuğunu gösterir.',
          responses: says(S('hakim', 'Kabul. Kadehin Kriminal Polis Laboratuvarına gönderilmesine.')),
          next: '$stay',
        }),
        option('H105_ECZ', 'Gökdere Eczanesi’nin 3 Kasım kaydının celbi', {
          visibleWhen: all(flag('eczane_usb'), not(flag('req_eczane'))),
          cost: [{ var: 'h1_hak', amount: 1 }],
          score: { USUL_BILGISI: 70 },
          effects: [raise('h1_eczane')],
          good: 'Yerinde: kaybolma tehlikesi olan kayıt mahkeme kanalıyla istendi (CMK 206/1).',
          responses: says(S('hakim', 'Kabul. Eczanedeki kaydın bilirkişi incelemesiyle birlikte celbine.')),
          next: '$stay',
        }),
        option('H105_ECE', 'Garson Ece Tan’ın tanık olarak dinlenmesi', {
          visibleWhen: all(
            any(
              flag('ece_tanik_olur'),
              flag('ece_dusunecek'),
              flag('ece_cekildi'),
              all(flag('ece_itiraf'), not(flag('bora_ece_gizli'))),
            ),
            not(flag('req_ece')),
          ),
          cost: [{ var: 'h1_hak', amount: 1 }],
          score: { USUL_BILGISI: 60 },
          effects: [raise('h1_ece')],
          good: 'Yerinde: olayı gören ve dosyada adı geçmeyen tanığın dinlenmesi istendi (CMK 206/1).',
          responses: [
            when(
              flag('bora_ece_gizli'),
              S(
                'tolga',
                'Sayın Başkan! Sanık az önce “yalnızdım” dedi. Şimdi bir garson mu çıktı? Bu tanık nereden geliyor?',
              ),
              S('hakim', 'Gelecek celse görürüz. Kabul. Tanığın çağrılmasına.'),
              T('Bora’nın küçük yalanı tutanakta. Ece gelirse onun da sırtında olacak.'),
            ),
            otherwise(S('hakim', 'Kabul. Tanık Ece Tan’ın gelecek celse dinlenmesine.')),
          ],
          next: '$stay',
        }),
        option('H105_KESIF', 'Olay yerinde keşif: masa 4’ten tezgâhın görüş açısı', {
          cost: [{ var: 'h1_hak', amount: 1 }],
          score: { USUL_BILGISI: 20 },
          neutral:
            'Keşif (CMK 83) mümkündür ama mahkeme fotoğrafların yeterli olduğunu düşünebilir; görüş açısını kendi tespitinle de gösterebilirdin.',
          responses: says(S('hakim', 'Fotoğraflar dosyada. Gerek görülürse sonra karar verilir. Şimdilik ret.')),
          next: '$stay',
        }),
        option('H105_KARAKTER', 'Mahalle esnafının sanığın kişiliğine dair dinlenmesi', {
          cost: [{ var: 'h1_hak', amount: 1 }],
          score: { USUL_BILGISI: -20 },
          bad: 'Olayı görmemiş kişilerin “iyi adamdır” beyanı ispata yaramaz; mahkeme ilgisiz delil talebini reddedebilir (CMK 206/2-b).',
          category: 'USUL_BILGISI',
          responses: says(S('hakim', 'Olayı görmüşler mi? Hayır. Ret.')),
          next: '$stay',
        }),
        cont('H105_BITIR', 'Taleplerimiz bu kadar', 'H1_ARA1'),
      ],
    }),

    // --- Ara karar (koşullu hafıza zinciri) ---
    decisionNode('H1_ARA1', [{ to: 'H1_ARA2' }], {
      ...court1.base,
      title: 'Ara karar',
      lines: says(
        S(
          'hakim',
          'Ara karar: Adli Tıp Kurumundan katılan hakkında kesin rapor alınmasına. Tanık Onur Kılıç’ın gelecek celse dinlenmesine.',
        ),
      ),
    }),
    decisionNode('H1_ARA2', [{ to: 'H1_ARA3' }], {
      ...court1.base,
      lines: [
        when(
          all(any(flag('req_kriminal'), flag('h1_kriminal')), any(flag('req_eczane'), flag('h1_eczane'))),
          S('hakim', 'Kırık kadehin Kriminal incelemesine; Gökdere Eczanesi kaydının celbine.'),
        ),
        when(any(flag('req_kriminal'), flag('h1_kriminal')), S('hakim', 'Kırık kadehin Kriminal incelemesine.')),
        when(any(flag('req_eczane'), flag('h1_eczane')), S('hakim', 'Gökdere Eczanesi kaydının celbine.')),
        otherwise(T('Kadeh emanette kalacak. İncelenmemiş, sorulmamış. Bir delil, istenmezse yalnızca bir eşyadır.')),
      ],
    }),
    decisionNode('H1_ARA3', [{ to: 'H1_ARA' }], {
      ...court1.base,
      lines: [
        when(
          any(flag('req_ece'), flag('h1_ece')),
          S('hakim', 'Tanık Ece Tan’ın çağrılmasına. Duruşmanın bir ay sonraya ertelenmesine.'),
        ),
        otherwise(S('hakim', 'Duruşmanın bir ay sonraya ertelenmesine.')),
      ],
    }),
    story('H1_ARA', {
      ...HEAR1,
      title: 'Erteleme',
      background: 'adliye',
      lines: says(
        Nx('Tokmak bir kez indi. Salon boşaldı; boşalan salonlar her zaman olduğundan daha büyük görünür.', {
          fx: 'shake',
        }),
        card('ADLİYE KORİDORU — ÖĞLE', 'adliye'),
        S('tolga', 'Güzel başladınız meslektaşım. Gerçekten. Leyla Hanım gurur duyar.'),
        S('tolga', 'Ama bilirsiniz: başlangıçlar kolaydır. Bitiş başka.'),
        Nx(
          'Merdivenlere yürüdü. Onur Kılıç onu takip etti; bir ara durdu, dönüp bana baktı. Bir şey söyleyecekmiş gibi. Söylemedi.',
        ),
        S('bora', 'Ne oldu şimdi? Bitti mi?'),
        D('Hayır. Bir ay. Bir ay daha.'),
        S('bora', 'Bir ay. Bar kapalı bir ay daha.'),
        Nx('Kasketini taktı. Yağmur başlamıştı; adliyenin camlarından aşağı ince ince akıyordu.'),
        T('Bir ay. Bir tanığın vicdanı için kısa, bir barın kirası için uzun bir süre.'),
        Nx(
          'Telefon titredi. Leyla; başka bir duruşmadan, koridordan arıyordu. Arkada bir mübaşir birinin adını uzatıyordu.',
        ),
        { speaker: 'leyla', style: 'phone', text: 'Nasıl geçti? Kısa anlat. Kısa anlatamıyorsan iyi geçmemiştir.' },
        D('Katılan bocaladı. Tolga gülümsedi. Hâkim dinledi.'),
        {
          speaker: 'leyla',
          style: 'phone',
          text: 'Hâkim dinlediyse iyi. Gülümseyen avukattan değil, susan hâkimden kork. Bir ayın var. Raporları bekle, tanıkları bekleme; onlar seni beklemez.',
        },
      ),
      choices: [cont('H1ARA_DEVAM', 'Ara dönem', 'ARA_GIRIS_1', { role: 'PRIMARY' })],
    }),
  ],
};
