import {
  all,
  any,
  atLeast,
  cmp,
  cont,
  courtSession,
  dec,
  decisionNode,
  deliver,
  fallback,
  flag,
  has,
  hl,
  ifThen,
  inc,
  mark,
  not,
  objectRule,
  option,
  presentRule,
  pressRule,
  raise,
  ref,
  resultNode,
  score,
  statement,
  story,
  strategyAmount,
  choiceNode,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { TRIAL, VERDICT, card, court2, me, n, s, th, wrongEvidence } from './shared.js';

// 80-trial: ikinci celse (cs_2: gelen raporlar, bekçi, eksperin çapraz sorgusu ve kırılması) ve üçüncü oturum (cs_3: ek
// savunma hatırlatması, mütalaa ve cevap, esas savunmanın dayanakları, esas savunma, son söz, hüküm). Çöküş kesintisi.

const elkoyma = deliver('T_00', [
  {
    evidence: 'ev_elkoyma',
    requires: all(flag('suc_duyurusu'), not(flag('eksper_uyarildi'))),
    hint: 'Eksper hakkında savcılığa suç duyurusunda bulunsaydın, aracında el koyma yapılabilirdi.',
  },
]);

const contraU = [
  flag('contra_u1'),
  flag('contra_u2'),
  flag('contra_u3'),
  flag('contra_u4'),
  flag('contra_u5'),
  flag('contra_u6'),
];

const dayanak = (id: string, label: string, ok: ReturnType<typeof flag>, yes: string, no: string) =>
  option(id, label, {
    cost: [{ var: 'dayanak', amount: 1 }],
    effects: [ifThen(ok, [score('SAVUNMA_STRATEJISI', 40), inc('pers')], [score('SAVUNMA_STRATEJISI', -40)])],
    responses: [{ when: ok, lines: [th(yes)] }, { lines: [th(no)] }],
    next: '$stay',
  });

export const trial: CasePart = {
  court: {
    sessions: [
      courtSession('cs_2', '2. Celse', [
        ['s2_acilis', 'ACILIS', 'T_00'],
        ['s2_tanik', 'TANIK_DINLEME', 'T_01'],
      ]),
      courtSession('cs_3', '2. Celse · ikinci oturum', [
        ['s3_ek', 'EK_SAVUNMA', 'T_05'],
        ['s3_mutalaa', 'MUTALAA', 'T_05M'],
        ['s3_savunma', 'SAVUNMA', 'T_06P'],
        ['s3_sonsoz', 'SON_SOZ', 'T_07'],
        ['s3_karar', 'KARAR', 'T_08'],
      ]),
    ],
  },
  nodes: [
    decisionNode('T_00K', [{ to: 'T_00K2' }], {
      ...court2.base,
      title: 'Adliye koridoru',
      onEnter: [raise('in_court')],
      lines: [
        {
          lines: [
            card('5 MAYIS · PAZARTESİ 09.10 — BURSA ADLİYESİ, KORİDOR', 'adliye'),
            n(
              'Yağmur dinmişti ama koridor hâlâ ıslak şemsiye kokuyordu. Yedinci Asliye Ceza’nın kapısında aynı liste, aynı çaycı, farklı bir sabah.',
            ),
          ],
        },
      ],
    }),
    decisionNode('T_00K2', [{ to: 'T_00K3' }], {
      ...court2.base,
      lines: [
        {
          when: flag('halil_tahliye'),
          lines: [
            n(
              'Halil kendi ayaklarıyla gelmişti; kendi ceketiyle. Omuzları tam oturuyordu. Zehra yanında, nöbet dönüşü değil, izinli.',
            ),
            s(
              'halil',
              'Otuz dokuz sandalye bitti, avukat hanım. Sonuncusunu bugünden sonraya bıraktım. Uğur getirsin diye.',
            ),
          ],
        },
        {
          lines: [
            n(
              'Halil iki jandarmanın arasında geldi. Zehra’nın aldığı ceket hâlâ dar; ama Halil bu sefer omuzlarını düzeltmedi. Dik durdu.',
            ),
            s(
              'halil',
              'Koğuşta herkes “bugün çıkarsın” diyor. Ben bir şey demiyorum. Dua da etmiyorum; Nermin ederdi.',
            ),
          ],
        },
      ],
    }),
    story('T_00K3', {
      ...court2.base,
      title: 'Adliye koridoru',
      background: 'adliye',
      lines: [
        {
          when: flag('fact_acil_degil'),
          lines: [
            n(
              'Bankın ucunda bekçi Cevdet, şapkası dizinde, defteri elinde. Gülsüm Hanım dinleyici sırasına geçmişti; başörtüsünü düzeltip bekliyordu.',
            ),
            n(
              'Pencerenin önünde Necati Usta, tulumunun üstüne bir ceket geçirmiş, elindeki keşif defterini ikide bir açıp kapatıyordu. Dün akşam telefonda “gelirim kızım, doğruyu söylemeye gelinir” demişti.',
            ),
            s('necati', 'Avukat hanım, ben ne diyeceğim? Bana bir şey söyleyin.'),
            me(
              'Size ne soracaklarını söyleyemem, usta. Ne gördüyseniz onu anlatın. Hatırlamıyorsanız “hatırlamıyorum” deyin.',
            ),
            s('necati', 'Ondan kolay ne var. Ben kabloya yalan söylemem; insana hiç söylemem.'),
            n('Koridorun öbür ucunda Tarık Sönmez katılan vekiliyle konuşuyordu. Bana baktı; bu sefer başını eğmedi.'),
            th(
              'İkinci celse. Raporlar geldi, tanıklar geldi. Bugün bir adamın kitabını açacağım; o kitabın sayfalarını kendi eliyle yazdığını göstermek için.',
            ),
          ],
        },
        {
          lines: [
            n(
              'Bankın ucunda bekçi Cevdet, şapkası dizinde, defteri elinde. Gülsüm Hanım dinleyici sırasına geçmişti; başörtüsünü düzeltip bekliyordu.',
            ),
            n('Koridorun öbür ucunda Tarık Sönmez katılan vekiliyle konuşuyordu. Bana baktı; bu sefer başını eğmedi.'),
            th(
              'İkinci celse. Raporlar geldi, tanıklar geldi. Bugün bir adamın kitabını açacağım; o kitabın sayfalarını kendi eliyle yazdığını göstermek için.',
            ),
          ],
        },
      ],
      choices: [cont('T00K_DEVAM', 'Salona gir', 'T_00', { role: 'PRIMARY' })],
    }),
    decisionNode('T_00', [{ to: 'T_00T' }], {
      ...court2.base,
      title: 'Açılış',
      onEnter: elkoyma.effects,
      lines: [
        {
          lines: [
            card('5 MAYIS · 09.30 — BURSA 7. ASLİYE CEZA MAHKEMESİ, İKİNCİ CELSE', 'durusma_salonu'),
            s('mubasir', 'Halil Bozkurt dosyası! Taraflar içeri!'),
            s(
              'hakim',
              'Duruşmaya devam olunuyor. Ara kararı gereği gelen yazı ve raporlar okundu. Taraflara örnekleri verildi.',
            ),
          ],
        },
      ],
    }),
    decisionNode('T_00T', [{ to: 'T_00A' }], {
      ...court2.base,
      lines: [
        {
          when: flag('contra_b2'),
          lines: [
            s(
              'hakim',
              'Bilirkişi Dr. Orhan Tezel’in kendiliğinden sunduğu ek rapor okundu: “Numunelerin olay yerinden kim tarafından ve nasıl alındığını incelemedim.”',
            ),
            s('hakim', '“Hızlandırıcı tespitim, numunelerin olay yerinden alındığı varsayımına dayanmaktadır.”'),
            s(
              'hakim',
              '“Sigorta panosu ve koridor hattı tarafımca incelenmemiştir. Bu inceleme yapılmadan yangının elektrik kaynaklı olmadığı sonucuna varılamaz.”',
            ),
            n(
              'Katılan vekili ek raporu iki kez okudu. Savcı bir kez okudu ve kalemini bıraktı. Ben okumadım; ezbere biliyordum, çünkü ilk celsede kürsüde söylenmişti.',
            ),
          ],
        },
      ],
    }),
    decisionNode('T_00A', [{ to: 'T_00B' }], {
      ...court2.base,
      lines: [
        {
          when: all(has('ev_ark'), has('ev_ariza')),
          lines: [
            s(
              'hakim',
              'Elektrik bilirkişisinin raporu: koridor hattında birincil ark izi. Dağıtım şirketinin yazısı: yangın gecesi 02.08’de sokak hattında nötr kopması.',
            ),
            n('Savcı iki kâğıdı yan yana koydu. Katılan vekili bir şey fısıldamak için arkaya döndü.'),
          ],
        },
        {
          when: has('ev_ark'),
          lines: [
            s(
              'hakim',
              'Elektrik bilirkişisinin raporu okundu: koridor hattında birincil ark izi; yangının elektrik kaynaklı başlamasıyla uyumlu bulgular.',
            ),
          ],
        },
        {
          when: has('ev_ariza'),
          lines: [
            s(
              'hakim',
              'Dağıtım şirketinin yazısı okundu: yangın gecesi 02.08’de sokak hattında nötr iletken kopması, komşu abonelerde aşırı gerilim.',
            ),
          ],
        },
        { lines: [s('hakim', 'Delil durumunda başka bir yazı gelmemiştir.')] },
      ],
    }),
    decisionNode('T_00B', [{ to: 'T_00C' }], {
      ...court2.base,
      lines: [
        {
          when: has('ev_elkoyma'),
          lines: [
            s(
              'savci',
              'Sayın Hâkim, savunmanın suç duyurusu üzerine başsavcılığımızca bir soruşturma başlatılmıştır. Eksperin aracında yapılan aramada bir tutanak düzenlenmiştir; dosyaya sunuyorum.',
            ),
            s(
              'savci',
              'Bagajda yarım bidon kurşunsuz benzin, olay yeri numunelerindekiyle aynı tip boş metal tenekeler ve doldurulmamış numune etiketleri.',
            ),
            n(
              'Salonda bir sessizlik. Katılan vekili kalemini bıraktı. Tarık Sönmez’in yüzünde hiçbir şey kıpırdamadı; sadece bir parmağı dizinin üstünde ritim tuttu.',
            ),
          ],
        },
        {
          when: flag('suc_duyurusu'),
          lines: [
            s(
              'savci',
              'Sayın Hâkim, savunmanın eksper hakkındaki suç duyurusu üzerine başsavcılığımızca soruşturma başlatıldığını bildiririm. Henüz bir sonuç yoktur.',
            ),
          ],
        },
        { lines: [n('Savcı dosyasını kapattı. Kâtip bir sonraki sayfaya geçti.')] },
      ],
    }),
    decisionNode('T_00C', [{ when: flag('cevdet_istendi'), to: 'T_01' }, { to: 'T_02' }], {
      ...court2.base,
      lines: [
        {
          when: flag('sahte_rapor'),
          lines: [
            s(
              'katilan',
              'Sayın Hâkim, savunmanın sunduğu “uzman raporu”nu düzenleyen kişiyle ilgili bir beyanımız var.',
            ),
            s(
              'katilan',
              'Raporu yazan kişi müvekkil şirketin daha önce çalıştığı bir eksper. Dün bize ulaştı: raporu kırk bin lira karşılığında, kendisine söylenen sonuca göre yazdığını yazılı olarak beyan etti.',
            ),
            n('Hâkim gözlüğünü çıkardı ve bana baktı. Uzun uzun. Bir kefe yere değdi.'),
            th('Onlar sahte rapor yazdı; biz de yazdık. Hâkim aradaki farkı soracaktı. Fark yoktu.'),
          ],
        },
        {
          when: flag('mutalaa'),
          lines: [
            me(
              'Sayın Hâkim, savunma olarak üniversiteden bir elektrik mühendisinden bilimsel mütalaa aldık. Mütalaa, mahkemenin bilirkişisinin bulgularıyla aynı yönde. Gerekirse uzmanın dinlenmesini talep ederiz.',
            ),
            s('hakim', 'Mütalaa dosyaya konsun.'),
          ],
        },
        {
          when: flag('deniz_tehdit'),
          lines: [
            s(
              'katilan',
              'Sayın Hâkim, dün gece müdafi, dinlenecek tanığa büronun önünde gözdağı vermiştir. Ses kaydı elimizdedir.',
            ),
            s('hakim', 'Müdafi, tanıklara yaklaşmayın. Bu bir uyarıdır.'),
            th('Bir cümle. Gece yarısı, öfkeyle. Şimdi bir kayıtta.'),
          ],
        },
        {
          when: flag('basin'),
          lines: [
            s(
              'katilan',
              'Sayın Hâkim, tanığımız hakkında yerel basına yansıyan haberlerin kaynağının savunma olduğunu düşünüyoruz. Yargılamayı etkileme girişimidir.',
            ),
            s('hakim', 'Taraflar dosyayı basında değil burada tartışsın. Bu bir uyarıdır, müdafi.'),
          ],
        },
        {
          when: flag('tehdit_bildirildi'),
          lines: [
            me(
              'Sayın Hâkim, dün gece dinlenecek tanık bürom önünde benimle konuştu. Saatiyle tutanağa geçirip savcılığa bildirdim; bilginize sunarım.',
            ),
            s('hakim', 'Kayda geçsin. Tanıklar duruşma öncesi taraflarla temas etmesin.'),
          ],
        },
        { lines: [s('hakim', 'Tanıkları dinleyeceğiz.')] },
      ],
      onEnter: [
        ifThen(flag('sahte_rapor'), [dec('cred', 2), dec('pers', 3)]),
        ifThen(flag('deniz_tehdit'), [dec('pers')]),
      ],
    }),
    choiceNode('T_01', {
      ...court2.base,
      title: 'Bekçinin dinlenmesi',
      background: 'durusma_salonu',
      onEnter: [ifThen(flag('cevdet_telkin'), [dec('cred', 2), dec('pers', 2)])],
      lines: [
        {
          when: flag('cevdet_telkin'),
          lines: [
            s('mubasir', 'Tanık Cevdet Alkan!'),
            n('Cevdet kürsüye çıktı, şapkasını göğsüne bastırdı. Yemin etti.'),
            s('savci', 'Tanık, müdafi sizinle duruşmadan önce görüştü mü? Bir şey söylemenizi istedi mi?'),
            s(
              'cevdet',
              'Görüştü. “Eksperin içeride bir şey döktüğünü gördüm dersen işimize yarar” dedi. Ben görmedim. Söyledim de. Görmediğimi söylerim.',
            ),
            n('Hâkim kalemini bıraktı. Savcı bana döndü; söyleyecek bir şeyi yoktu, çünkü her şey söylenmişti.'),
            th('Bir bekçi, bir avukatı mesleğine geri çağırdı. Bir mahkemenin önünde.'),
          ],
        },
        {
          when: flag('cevdet_hazir'),
          lines: [
            s('mubasir', 'Tanık Cevdet Alkan!'),
            n(
              'Cevdet kürsüye çıktı, şapkasını göğsüne bastırdı. Defterini hâkime uzattı; hâkim inceleyip kâtibe verdi.',
            ),
            s(
              'cevdet',
              'Bildiğimi dosdoğru söyleyeceğime namusum ve vicdanım üzerine yemin ederim. Defter ne diyorsa, gözüm ne gördüyse.',
            ),
            s('hakim', 'Müdafi, sorularınız.'),
          ],
        },
        {
          lines: [
            s('mubasir', 'Tanık Cevdet Alkan!'),
            n(
              'Cevdet kürsüye çıktı, şapkasını göğsüne bastırdı. Defterini hâkime uzattı; hâkim inceleyip kâtibe verdi.',
            ),
            s('cevdet', 'Bildiğimi dosdoğru söyleyeceğime namusum ve vicdanım üzerine yemin ederim.'),
            s('hakim', 'Müdafi, sorularınız.'),
          ],
        },
      ],
      prompt: 'Bekçiye ne soracaksın? (Soruyu sor; cevabı tanığa bırak.)',
      choices: [
        option('CV_Q1', '15 Ocak sabahı olay yerinin muhafazası kimdeydi?', {
          score: { SORGULAMA: 30 },
          responses: [
            {
              lines: [
                s(
                  'cevdet',
                  'Bendeydi. Beşte polis şeridi çekti, “Cevdet sen bekle” dedi. Onda teslim ettim. Arada polis yoktu.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('CV_Q2', 'Arada olay yerine giren oldu mu?', {
          score: { SORGULAMA: 50 },
          responses: [
            {
              lines: [
                s(
                  'cevdet',
                  'Bir kişi. Dokuz yirmide. Kartını gösterdi, “sigorta eksperiyim, şirket gönderdi” dedi. Şuradaki bey.',
                ),
                n('Parmağıyla gösterdi. Tarık Sönmez bacak bacak üstüne attı.'),
                s(
                  'cevdet',
                  'On sıfır beşte çıktı. Deftere yazdım. Polis yoktu yanında. Ben kapıdaydım. Hata ettim belki; yazdım ama.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('CV_Q3', 'Elinde ne vardı?', {
          visibleWhen: has('clue_teneke'),
          score: { SORGULAMA: 60 },
          responses: [
            {
              lines: [
                s(
                  'cevdet',
                  'Omzunda spor çanta. İki teneke çıkardı. Bir litrelik. Girerken ağırdı; boş teneke öyle tutulmaz.',
                ),
                s(
                  'cevdet',
                  'İçeride ne yaptığını görmedim. Kürek sesi duydum, tahta sürüklendi. Çıkınca kapakları kapalıydı.',
                ),
                th(
                  'Görmediğini görmediğini söyledi. Duyduğunu duyduğunu. Bu mahkemede bundan daha temiz bir tanık olmaz.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('CV_QBITIR', 'Sorularım bu kadar', {
          responses: [
            {
              lines: [
                s('katilan', 'Tanığa sorumuz yok.'),
                s('savci', 'Tanık, o sabah eksperin girdiğini neden polise hemen bildirmediniz?'),
                s(
                  'cevdet',
                  'Bildirdim savcı bey. Deftere yazdım, onda gelen polise defteri gösterdim. “Tamam” dedi. Okudu mu, bilmem. Ben yazdım; okumak benim işim değil.',
                ),
                n('Savcı başını salladı ve bir not aldı. Uzun bir not. Kâtip bekledi.'),
                s('hakim', 'Tanık çekilebilir. Sıradaki tanık, Tarık Sönmez.'),
                n(
                  'Cevdet kürsüden inerken şapkasını yeniden taktı, sonra salonda olduğunu hatırlayıp çıkardı. Dinleyici sırasında bir yer bulup oturdu; defteri dizinin üstünde, kapalı.',
                ),
              ],
            },
          ],
          next: 'T_02',
        }),
      ],
    }),
    court2.objection('T_02', {
      title: 'Katılan vekilinin sorusu',
      courtStage: 'TANIK_DINLEME',
      witness: 'tarik',
      witnessLabel: 'TANIK · TARIK SÖNMEZ',
      lines: [
        {
          when: not(flag('tarik_istendi')),
          lines: [
            s(
              'hakim',
              'Eksper Tarık Sönmez’in tanık olarak dinlenmesine dair bir talep olmadığından katılan vekili kendisini bilgi vermek üzere hazır etmiş. Tanık olarak dinleyeceğiz.',
            ),
            s(
              'katilan',
              'Sayın tanık, olay yerine usulüne uygun girdiniz, numuneleri usulüne uygun aldınız, değil mi?',
            ),
          ],
        },
        {
          lines: [
            s('mubasir', 'Tanık Tarık Sönmez!'),
            n(
              'Kürsüye bir takım elbisenin kürsüye çıkabileceği kadar kusursuz çıktı. Yemin metnini ezberden söyledi; tek kelime atlamadan.',
            ),
            s(
              'katilan',
              'Sayın tanık, olay yerine usulüne uygun girdiniz, numuneleri usulüne uygun aldınız, değil mi?',
            ),
          ],
        },
      ],
      next: 'T_03',
      options: [
        option('T02_A', 'İtiraz: soru yönlendirici; cevabı tanığa hazır veriyor', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers')],
          good: 'Yerinde. Cevabı içeren soru tanığın kendi algısını değil, sorunun sonucunu kayda geçirir; hâkim soruyu değiştirtir (CMK 192, 201).',
          responses: [
            {
              lines: [
                s('hakim', 'İtiraz yerinde. Vekil, açık sorun.'),
                s('katilan', 'Peki. Olay yerine nasıl girdiniz, numuneleri nasıl aldınız?'),
                s('tarik', 'Şirketimin talimatıyla, sabah. Numuneleri usulüne uygun aldım ve mühürledim.'),
              ],
            },
          ],
        }),
        option('T02_B', 'Sus; cevabı çapraz sorguda kayıtla çürütürsün', {
          effects: [dec('pers')],
          neutral:
            'Telkin edici soru cevaplandı; “usulüne uygun” kelimesi tanığın değil katılan vekilinin ağzından kayda geçti.',
          responses: [{ lines: [s('tarik', 'Elbette. Usulüne uygun. Yirmi yıldır böyle çalışırım.')] }],
        }),
        option('T02_C', 'İtiraz: tanık katılanın çalışanı; yeminle dinlenemez', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Taraflarla iş ilişkisi tanıklığa engel değildir; yemin yasağı CMK 54’te sayılı hâllerle sınırlıdır. Tarafgirlik çapraz sorguda delille gösterilir.',
          responses: [
            {
              lines: [
                s('hakim', 'Böyle bir yasak yok, müdafi. Tanık yeminli dinlenecek.'),
                s('tarik', 'Usulüne uygun girdim, usulüne uygun aldım.'),
              ],
            },
          ],
        }),
        option('T02_D', 'Talep: tanık hakkında derhal gözaltı kararı verilsin, Sayın Hâkim', {
          score: { USUL_BILGISI: -80 },
          effects: [dec('cred'), dec('pers')],
          bad: 'Duruşmada tanık hakkında gözaltı talebinin dayanağı yok; şüphe varsa yol savcılığa bildirmektir (CMK 158). Bu talep hâkimin gözünde savunmayı öfkeli gösterir.',
          responses: [
            {
              lines: [
                s('hakim', 'Müdafi, burası bir soruşturma bürosu değil. Oturun.'),
                s('tarik', 'Usulüne uygun girdim, usulüne uygun aldım.'),
              ],
            },
          ],
        }),
      ],
    }),
    court2.testimony('T_03', {
      title: 'Çapraz sorgu · Tarık Sönmez',
      courtStage: 'TANIK_DINLEME',
      witness: 'tarik',
      witnessLabel: 'TANIK · TARIK SÖNMEZ',
      lines: [
        {
          lines: [
            s(
              'tarik',
              'Olay yerine sabah, polis izniyle girdim. Salon zeminindeki döküntü izini, molozun altında ilk ben tespit ettim.',
            ),
            s(
              'tarik',
              'Numuneleri o zeminden aldım, mühürledim, şirket aracılığıyla savcılığa teslim ettim. Yirmi yıldır raporlarım hep doğrulanmıştır.',
            ),
            s(
              'tarik',
              'Şirketten bir beklentim yoktur; ücretim sabittir. Elektrik kaynaklı bir yangın olsaydı ben görürdüm. Panoya baktım.',
            ),
            th('Akıcı. Kibar. Her cümlesi bir sigorta poliçesi gibi: geniş teminat, küçük punto.'),
            s('hakim', 'Müdafi, sorularınız?'),
          ],
        },
      ],
      rulesText:
        'İpucu: Tanık kendi yazdığı kitabı okuyor. Her sayfayı bir kayıtla sına: çizelge, fotoğraf, laboratuvar, tahkim, şirket yazısı, pano.',
      objectionGrounds: ['g_kanaat', 'g_uzmanlik', 'g_duyum'],
      statements: [
        statement('U1', 1, [
          'Olay yerine sabah, ',
          hl('polis izniyle', any(flag('press_u1'), has('ev_cizelge'))),
          ' girdim.',
        ]),
        statement('U2', 2, [
          'Döküntü izini ',
          hl('molozun altında ilk ben', any(flag('press_u2'), has('ded_temizlenmis'))),
          ' tespit ettim.',
        ]),
        statement('U3', 3, [
          'Numuneleri ',
          hl('o zeminden aldım', any(flag('press_u3'), has('ded_ekilmis'), has('ev_elkoyma'))),
          ' ve mühürledim.',
        ]),
        statement('U4', 4, [
          'Yirmi yıldır ',
          hl('raporlarım hep doğrulanmıştır', any(flag('press_u4'), has('ev_tahkim'))),
          '.',
        ]),
        statement('U5', 5, [
          'Şirketten ',
          hl('bir beklentim yoktur', any(flag('press_u5'), has('ded_kopya'))),
          '; ücretim sabittir.',
        ]),
        statement('U6', 6, [
          'Elektrik kaynaklı olsaydı ',
          hl('ben görürdüm; panoya baktım', any(flag('press_u6'), has('ev_ark'), has('ev_ariza'), has('ded_pano'))),
          '.',
        ]),
      ],
      rules: [
        presentRule('PS_SAV_U', undefined, ['ev_fis', 'ev_icra', 'ev_ekspertiz'], {
          maxUses: 3,
          effects: [
            ...wrongEvidence,
            score('SORGULAMA', -150, 'hatali'),
            mark(
              'BAD',
              'İddianın delilini tanığa “çelişki” diye sundun; bu belgeler tanığın anlatımını çürütmez.',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              lines: [
                s('tarik', 'Teşekkür ederim, avukat hanım. Benim raporumu bana sunuyorsunuz.'),
                s('hakim', 'Devam edin, müdafi.'),
              ],
            },
          ],
        }),
        pressRule('PR_U1', 'U1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_u1')],
          responses: [
            {
              when: flag('fact_eksper_hizli'),
              lines: [
                me(
                  'Hasar ihbarı öğlen ikide yapıldı. Siz sabah dokuz yirmide olay yerindeydiniz. İhbardan beş saat önce sizi kim gönderdi?',
                ),
                s('tarik', 'Şirket gece haber aldı. Büyük dosyalara hızlı bakarız.'),
                me('Size kim izin verdi? Hangi polis?'),
                s('tarik', 'Olay yerindeki görevli. Kartımı gösterdim, içeri aldılar. İçeride… gerek görülmedi.'),
              ],
            },
            {
              lines: [
                me('Size kim izin verdi? Hangi polis? Adı?'),
                s('tarik', 'Olay yerindeki görevli. İsmini hatırlamıyorum. Kartımı gösterdim, içeri aldılar.'),
                me('Yanınızda polis var mıydı?'),
                s('tarik', 'Kapıda biri vardı. İçeride… gerek görülmedi.'),
              ],
            },
          ],
        }),
        presentRule('PS_U1', 'U1', ['ev_cizelge'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_u1')],
          quality: {
            q: 'GOOD',
            feedback:
              'Olay yeri muhafaza altındaydı; içeri polis değil bekçi aldı ve refakat eden olmadı: 09.20–10.05, tek başına.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                me(
                  'Bekçinin çizelgesi: “09.20 sigorta eksperi T.S. olay yerine girdi. 10.05 çıktı.” Sizi içeri alan polis değil, bekçiydi. Ve içeride yalnızdınız.',
                ),
                s('tarik', 'Bekçi bir kamu görevlisidir. İzin aldım.', 'kizgin'),
                me('Bekçi kapıda kaldı. Kırk beş dakika boyunca, muhafaza altındaki bir olay yerinde, sizi kim gördü?'),
                n('Tarık cevap vermedi. Hâkim bir şey yazdı ve altını çizdi.'),
              ],
            },
          ],
        }),
        pressRule('PR_U2', 'U2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_u2')],
          responses: [
            {
              lines: [
                me('Molozun altındaki izi nasıl gördünüz? Moloz yerinde miydi?'),
                s('tarik', 'Molozu kaldırmak gerekti tabii. Bir eksper ancak zemine inerek okur.'),
                me('Kaldırdınız. Siz.'),
                s('tarik', 'İncelemenin gereği.', 'saskin'),
              ],
            },
          ],
        }),
        presentRule('PS_U2', 'U2', ['ded_temizlenmis'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_u2')],
          quality: {
            q: 'GOOD',
            feedback:
              '04.30’da zemin örtülü, 09.40’ta temizlenmiş ve ıslak: zemini açan da, “izi” fotoğraflayan da eksper; bunu kimse görmedi.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                me(
                  '04.30, kolluğun karesi: zemin tavanla örtülü. 09.40, sizin kareniz: zemin tertemiz, ortada ıslak bir leke. Arada yalnız siz varsınız.',
                ),
                me('Islak. İtfaiye üç saat önce gitmişti; salonda su yoktu artık. Leke neden ıslaktı?'),
                s('tarik', 'Söndürme suyu… zeminde kalır. Bilirsiniz.', 'saskin'),
                me('Kare 30’da su var. Kare 21’de zemin yok. Sizin karenizde zemin var, su yok, bir tek leke ıslak.'),
                n('Tarık’ın parmağı dizinin üstünde durdu.'),
              ],
            },
          ],
        }),
        pressRule('PR_U3', 'U3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_u3')],
          responses: [
            {
              when: flag('fact_muhur'),
              lines: [
                me(
                  'Laboratuvarın kabul tutanağı: tenekeler sizin şahsi mührünüzle mühürlü, numune alma tutanağı yok. Kimin önünde mühürlediniz?',
                ),
                s('tarik', 'Kendi formumu doldurdum. Mühür benim mührüm. Sektörde böyledir.'),
                me('Kendi mührünüz. Kendi formunuz. Kendi tanıklığınız.'),
              ],
            },
            {
              lines: [
                me('Numune alma tutanağı düzenlediniz mi?'),
                s('tarik', 'Kendi formumu doldurdum. Mühürledim. Şahsi mührümle.'),
                me('Kendi mührünüzle. Tutanağı kim imzaladı?'),
                s('tarik', 'Ben.'),
              ],
            },
          ],
        }),
        presentRule('PS_U3', 'U3', ['ded_ekilmis', 'ev_elkoyma'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_u3')],
          quality: {
            q: 'GOOD',
            feedback:
              'Numunede yanma ürünü yok, benzin taze, tenekeler içeri ağır girdi; aracında aynı tip tenekeler ve benzin. Numune olay yerinden alınmamış, getirilmiş.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              when: has('ev_elkoyma'),
              lines: [
                me(
                  'Laboratuvar: yanma ürünü yok, benzin taze. Bekçi: tenekeler içeri ağır girdi. Savcılık: aracınızın bagajında yarım bidon benzin ve aynı tip boş tenekeler.',
                ),
                me('Bu tenekeler o zemine mi gitti, yoksa o zeminden mi geldi, Tarık Bey?'),
                n(
                  'Tarık bir şey söylemek için ağzını açtı. Kapattı. Katılan vekiline baktı; katılan vekili dosyasına bakıyordu.',
                ),
              ],
            },
            {
              lines: [
                me(
                  'Laboratuvarın ham verisi: numunelerde yanmış ahşabın piroliz ürünleri yok. Benzin neredeyse taze. Bekçi: tenekeler içeri girerken ağırdı.',
                ),
                me(
                  'Bir buçuk saat yanmış bir zeminden alınan talaşta yanma izi yok. Bu talaş o yangını hiç görmedi, değil mi?',
                ),
                s('tarik', 'Laboratuvar analizlerinin yorumu… benim alanım değil.', 'saskin'),
              ],
            },
          ],
        }),
        presentRule('PS_U3_K', 'U3', ['ev_lab', 'ded_taze'], {
          score: { SORGULAMA: 100 },
          effects: [inc('pers')],
          quality: {
            q: 'GOOD',
            feedback:
              'Benzinin tazeliği bir kuşku; ama tenekelerin olay yerine dolu girdiğini gösteren halkayı (yanma ürünü yokluğu + bekçinin gözlemi) kurmadın.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                s('tarik', 'Benzin bol dökülmüşse kalıntı taze kalır. Bilirkişi de böyle yazdı.'),
                th('Bir halka eksik. Taze benzin bir kuşku; dolu girmiş bir teneke bir kanıt.'),
              ],
            },
          ],
        }),
        pressRule('PR_U4', 'U4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_u4')],
          responses: [
            {
              lines: [
                me('Hiçbir raporunuz bir hakem heyetinde ya da mahkemede reddedilmedi mi?'),
                s('tarik', 'Benim bildiğim kadarıyla, hayır.'),
                n('Dinleyici sırasında bir başörtüsü kıpırdadı.'),
              ],
            },
          ],
        }),
        presentRule('PS_U4', 'U4', ['ev_tahkim'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_u4')],
          quality: {
            q: 'GOOD',
            feedback:
              'Sigorta Tahkim Komisyonu, aynı eksperin aynı türden “döküntü izi” raporunu iki yıl önce bilimsel dayanaktan yoksun bulmuş.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                me(
                  'Sigorta Tahkim Komisyonu, Yaşar dosyası. Sizin raporunuz: “Hızlandırıcı tespiti bilimsel dayanaktan yoksundur.” Şirket ödemeye mahkûm edildi.',
                ),
                n('Gülsüm Hanım dinleyici sırasında doğruldu. Bir şey söylemedi; sadece baktı.'),
                s('tarik', 'Hakem heyetleri… teknik konularda her zaman isabetli değildir.', 'kizgin'),
                s('hakim', 'Tanık, sorulana cevap verin. Bu karar sizin raporunuz hakkında mı?'),
                s('tarik', 'Evet.'),
              ],
            },
          ],
        }),
        pressRule('PR_U5', 'U5', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_u5')],
          responses: [
            {
              lines: [
                me('Ücretiniz sabit mi? Hiçbir ek ödeme almıyor musunuz?'),
                s('tarik', 'Dosya başına sabit bir ücret. Sektör böyle çalışır.'),
              ],
            },
          ],
        }),
        presentRule('PS_U5', 'U5', ['ded_kopya'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_u5')],
          quality: {
            q: 'GOOD',
            feedback:
              'Bölge müdürlüğünün yazısı: suiistimalle reddedilen hasarda eksper ücretine ek prim. İki ayrı yangında virgülüne kadar aynı “döküntü izi” paragrafı.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                me(
                  'Kalkan Sigorta bölge müdürlüğünün yazısı: “Suiistimal tespitiyle reddedilen hasar dosyalarında eksper ücretine ek prim uygulanacaktır.”',
                ),
                me(
                  'Ve iki raporunuz, iki ayrı yangın: “düzensiz kenarlı, zemine nüfuz etmiş, tipik döküntü izi.” Kelimesi kelimesine. Bir gözlem mi, bir kalıp mı?',
                ),
                s('katilan', 'İtiraz! Müvekkil şirketin iç yazışmaları…'),
                s('hakim', 'Reddedildi. Tanığın tarafsızlığıyla doğrudan ilgili. Tanık, cevap verin.'),
                s('tarik', 'Ben… sektördeki uygulamalardan haberdarım. Benim raporlarımı etkilemez.', 'kizgin'),
              ],
            },
          ],
        }),
        pressRule('PR_U6', 'U6', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_u6')],
          responses: [
            {
              lines: [
                me('Panoya baktınız. Pano o sabah neredeydi?'),
                s('tarik', 'Girişte… yani, yuvasında.', 'saskin'),
                me('İtfaiye panoyu 03.50’de söküp kolluğa teslim etmiş. Siz 09.20’de girdiniz.'),
                s('tarik', 'Yuvasına baktım demek istedim. Kabloları.'),
              ],
            },
          ],
        }),
        presentRule('PS_U6_ARK', 'U6', ['ev_ark', 'ded_elektrik'], {
          score: { SORGULAMA: 250 },
          effects: [inc('pers'), raise('contra_u6'), raise('contra_u6_ark')],
          quality: {
            q: 'GOOD',
            feedback:
              'Pano o sabah emanetteydi; eksper ona bakamazdı. Mahkemenin elektrik bilirkişisi koridor hattında birincil ark buldu: “ben görürdüm” dediği iz, bakmadığı yerdeydi.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                me(
                  'Pano o sabah emanetteydi; ona bakmanız mümkün değildi. Mahkemenin elektrik bilirkişisi baktı: koridor hattında birincil ark.',
                ),
                me('“Ben görürdüm” dediğiniz şey, siz bakmadığınız için görünmedi.'),
                s('tarik', 'Elektrik bilirkişisinin bulguları… ikincil ark da olabilir.', 'kizgin'),
                s('hakim', 'Bilirkişi raporu “birincil” diyor, tanık. Sizin bir inceleme yapmadığınız anlaşılıyor.'),
              ],
            },
          ],
        }),
        presentRule('PS_U6_NOTR', 'U6', ['ev_ariza', 'ded_notr'], {
          score: { SORGULAMA: 250 },
          effects: [inc('pers'), raise('contra_u6'), raise('contra_u6_notr')],
          quality: {
            q: 'GOOD',
            feedback:
              'Dağıtım şirketinin kaydı: yangın gecesi sokak hattında nötr kopması ve komşu abonelerde aşırı gerilim. Eksperin raporunda bu kaydın adı bile geçmiyor.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                me(
                  'Dağıtım şirketinin kaydı: o gece sokağın hattında nötr kopması. Komşuların cihazları aynı dakikada yandı. Raporunuzda bu kayıt var mı?',
                ),
                s('tarik', 'Şebeke kayıtları… benim incelememin konusu değildi.', 'saskin'),
                me('Elektrik kaynaklı olsaydı görürdünüz, dediniz. Görmek için hangi kayda baktınız?'),
                n('Tarık cevap vermedi. Kâtip bir süre bekledi, sonra “cevap yok” yazdı.'),
              ],
            },
          ],
        }),
        presentRule('PS_U6_K', 'U6', ['ded_pano', 'ded_buat'], {
          score: { SORGULAMA: 100 },
          effects: [inc('pers')],
          quality: {
            q: 'GOOD',
            feedback:
              'Panonun emanette olduğunu gösterdin; ama elektrik kaynağının bir rapor ya da kayıtla doğrulanması gerekiyordu.',
            category: 'SORGULAMA',
          },
          responses: [
            {
              lines: [
                s('tarik', 'Yuvasına baktım. Elektrik kaynaklı bir iz yoktu. Bu benim gözlemim.'),
                th('Bir gözlem. Kayıt olmadan, gözlem gözleme karşı.'),
              ],
            },
          ],
        }),
        objectRule('OB_U_KANAAT', undefined, 'g_kanaat', {
          maxUses: 1,
          effects: [dec('cred'), inc('wrong'), score('SORGULAMA', -50, 'hatali')],
          quality: {
            q: 'BAD',
            feedback: 'Tanık kendi gözlemini anlatıyor; buna kanaat diye itiraz edilmez. Gözlem, kayıtla çürütülür.',
            category: 'SORGULAMA',
          },
          responses: [{ lines: [s('hakim', 'Tanık gözlemini anlatıyor, müdafi. İtiraz reddedildi.')] }],
        }),
      ],
      presentMiss: fallback('FB_T03_PRESENT', 'PRESENT', {
        effects: [
          ...wrongEvidence,
          score('SORGULAMA', -150, 'hatali'),
          mark('BAD', 'Yanlış delil: sunduğun belge bu ifadeyle çelişmiyor.', 'SORGULAMA'),
        ],
        responses: [
          {
            lines: [
              s('tarik', 'Bunun benim söylediğimle ne ilgisi var, avukat hanım?'),
              s('hakim', 'Müdafi, ilgisini göremedim.'),
            ],
          },
        ],
      }),
      objectMiss: fallback('FB_T03_OBJECT', 'OBJECT', {
        effects: [
          dec('cred'),
          inc('wrong'),
          score('SORGULAMA', -50, 'hatali'),
          mark('BAD', 'Dayanaksız itiraz.', 'SORGULAMA'),
        ],
        responses: [{ lines: [s('hakim', 'İtiraz reddedildi.')] }],
      }),
      finish: { id: 'T03_BITIR', next: 'T_03R' },
    }),
    decisionNode('T_03R', [{ when: atLeast(3, ...contraU), to: 'T_03K' }, { to: 'T_04' }], { ...court2.base }),
    story('T_03K', {
      ...court2.base,
      title: 'Susma',
      background: 'durusma_salonu',
      onEnter: [raise('eksper_kirildi')],
      lines: [
        {
          lines: [
            me('Son bir soru, Tarık Bey. O sabah salona girerken o iki tenekenin içinde ne vardı?'),
            n('Salon sustu. Kâtibin klavyesi sustu. Pencerenin dışında bir martı bağırdı, o da sustu.'),
            s('hakim', 'Tanık, bir dakika. Size bir hakkınızı hatırlatmam gerekiyor.'),
            s(
              'hakim',
              'Kendinizi ceza soruşturmasına uğratabilecek nitelikteki sorulara cevap vermeyebilirsiniz. Bu hakkınızı kullanıp kullanmadığınızı soruyorum.',
            ),
            n('Tarık Sönmez kravatını düzeltti. Yirmi yılda ilk kez, düzeltecek bir şey bulamadı.'),
            s('tarik', 'Bu soruya… cevap vermeyeceğim.', 'uzgun'),
            n(
              'Bir susuş. Bir itiraftan daha gürültülü. Dinleyici sırasında Gülsüm Hanım gözlerini kapadı; dudakları kıpırdadı.',
              { fx: 'shake' },
            ),
            s(
              'hakim',
              'Tanığın beyanları ve bu celsenin tutanak örneğinin, gereği için Cumhuriyet Başsavcılığına gönderilmesine.',
            ),
            s('savci', 'Başsavcılığımızda zaten bir soruşturma var, Sayın Hâkim. Tutanağı ekleyeceğiz.'),
            th('Kitap kapandı. Yazarı kendi kitabını okumayı reddetti. Halil’in halatından en kalın iplik koptu.'),
            n(
              'Katılan vekili ayağa kalktı. “Sayın Hâkim, tanığın sağlık durumu…” dedi. Hâkim ona baktı. Vekil cümlesini bitirmeden oturdu.',
            ),
            th(
              'Bir avukatın en zor işi müvekkilinin yanından ayrılmaktır; Kalkan Sigorta’nın vekili bunu bir oturuşla yaptı. Şirket eksperini kürsüde bıraktı. Şirketler hep bırakır.',
            ),
            n('Halil sanık sırasında oturuyordu. Bana bakmadı; ellerine baktı. Elleri ilk kez durgundu.'),
            n(
              'Tarık Sönmez kürsüden indi. Katılan vekilinin yanından geçerken vekil ona bakmadı. Dinleyici sırasının önünden geçerken Gülsüm Hanım’la göz göze geldi. Adımlarının düzeni bir an bozuldu; sonra yeniden düzeldi.',
            ),
            th(
              'Yirmi yıl. Kusursuz kravatlar, kusursuz paragraflar. Bir bekçinin defteri, bir dulun naylon dosyası ve bir fotokopi makinesinin sıcak kâğıdı. Bir adamın yirmi yılı bu kadar ince kâğıtlara yazılıymış.',
            ),
          ],
        },
      ],
      choices: [cont('T03K_DEVAM', 'Devam', 'T_04')],
    }),
    decisionNode('T_04', [{ to: 'T_04T' }], {
      ...court2.base,
      title: 'İkinci oturum',
      lines: [
        {
          lines: [
            s('hakim', 'Öğle arası veriyoruz. 13.40’ta devam edilecek.'),
            card('ÖĞLE ARASI — ADLİYE KORİDORU', 'adliye'),
            n(
              'Öğle arasında kimse yemek yemedi. Zehra kantinden iki simit aldı; ikisi de dokunulmadan bankın üstünde kaldı.',
            ),
            n(
              'Koridorun penceresinden adliyenin otoparkı görünüyordu. Tarık Sönmez arabasına bindi; çalıştırmadı. Bir süre direksiyona bakıp oturdu, sonra indi ve yürüyerek gitti.',
            ),
          ],
        },
      ],
    }),
    decisionNode('T_04T', [{ to: 'T_04B' }], {
      ...court2.base,
      lines: [
        {
          when: visited('INV_KADER'),
          lines: [
            n(
              'Merdiven sahanlığında bir kadın, elinde bir dosya, yağmurluğunun yakası kalkık: acente Kader Acar. Dinleyici sırasında oturduğunu fark etmemiştim.',
            ),
            s(
              'kader',
              'Avukat hanım, kimse beni çağırmadı. Kendim geldim. Kırk yedi gün, on iki gün; o rakamları ben ürettim. Kampanyayı ben teklif ettim, aramayı ben yaptım.',
            ),
            s(
              'kader',
              'Bölgeden telefon geldi geçen hafta: “Siz ifade vermeyin, şirket konuşur.” Ben de buraya geldim. Gerekirse dinlesinler. Kayıtlar zaten sizde.',
            ),
            me('Teşekkür ederim, Kader Hanım. Mahkeme sizi dinlemek isterse ne gördüyseniz onu anlatırsınız. O kadar.'),
            s('kader', 'O kadar. Bir sigortacının tek sermayesi kaydıdır. Benimki temiz.'),
            th(
              'Bir acente bir sigorta şirketinin öğle arasında, şirketin avukatının üç metre ötesinde duruyordu. Bazen cesaret bir merdiven sahanlığında, yağmurluk yakasının arkasında durur.',
            ),
          ],
        },
      ],
    }),
    story('T_04B', {
      ...court2.base,
      title: 'İkinci oturum',
      background: 'durusma_salonu',
      lines: [
        {
          when: not(flag('eksper_kirildi')),
          lines: [
            s('halil', 'Avukat hanım, o adam hâlâ dimdik oturuyor. Kravatı bile kaymadı. Şimdi ne olacak?', 'uzgun'),
            me('Şimdi hâkim sizi soracak, Halil Bey. Kasıt yoksa dikkatsizlik var mı, diye.'),
            n(
              'Leyla bir mesaj atmıştı: “Hâkim şimdi dikkatsizliği soracak. Kapıyı kapat.” Altında bir nokta; Leyla’nın nokta koyduğu mesajlar ciddiydi.',
            ),
            card('13.40 — İKİNCİ OTURUM', 'durusma_salonu'),
            s('hakim', 'Duruşmaya devam olunuyor.'),
          ],
        },
        {
          lines: [
            n(
              'Gülsüm Hanım yanıma geldi. Elimi tuttu; bir şey söylemedi. Elinde iki yıl önceki kararın bir fotokopisi vardı, buruşmuş. Onu bana verdi, sanki artık taşımasına gerek yokmuş gibi.',
            ),
            s('halil', 'Avukat hanım, şimdi ne olacak? O adam sustu. Susmak… susmak bir şey midir?'),
            me('Mahkemede susmak bir hak, Halil Bey. Ama bazen bir haktan daha yüksek sesle konuşur.'),
            s('halil', 'Ben iki aydır susuyorum. Benimki ne söyledi peki?', 'uzgun'),
            th(
              'Halil’in susuşu utançtı. Tarık’ınki başka bir şey. İkisini aynı kelimeyle anmak haksızlık; ama mahkemelerin elinde tek bir kelime var: susmak.',
            ),
            n(
              'Leyla bir mesaj atmıştı: “Hâkim şimdi dikkatsizliği soracak. Kapıyı kapat.” Altında bir nokta; Leyla’nın nokta koyduğu mesajlar ciddiydi.',
            ),
            card('13.40 — İKİNCİ OTURUM', 'durusma_salonu'),
            s('hakim', 'Duruşmaya devam olunuyor.'),
          ],
        },
      ],
      choices: [cont('T04_DEVAM', 'Devam', 'T_05')],
    }),
    court2.objection('T_05', {
      title: 'Ek savunma',
      courtStage: 'EK_SAVUNMA',
      lines: [
        {
          when: flag('halil_ek_hazir'),
          lines: [
            s(
              'hakim',
              'Sanığa hatırlatıyorum: dosyadaki deliller karşısında eyleminiz, taksirle yangına neden olarak genel güvenliği tehlikeye sokma suçu kapsamında da değerlendirilebilir. Ek savunmanız?',
            ),
            th(
              'Leyla haklıydı. Kasıt düşüyorsa hâkimin önünde ikinci bir kapı var: dikkatsizlik. Elektrikçinin notu o kapının anahtarı.',
            ),
            s(
              'halil',
              'Hâkim hanım, elektrikçi “eski, ağır yük çekme, restorasyonda yenileyelim” dedi. Çekmedim. Restorasyonun ilk haftasına koyduk. Son hafta evde değildim. Bu kadar.',
            ),
          ],
        },
        {
          lines: [
            s(
              'hakim',
              'Sanığa hatırlatıyorum: dosyadaki deliller karşısında eyleminiz, taksirle yangına neden olarak genel güvenliği tehlikeye sokma suçu kapsamında da değerlendirilebilir. Ek savunmanız?',
            ),
            th(
              'Leyla haklıydı. Kasıt düşüyorsa hâkimin önünde ikinci bir kapı var: dikkatsizlik. Elektrikçinin notu o kapının anahtarı.',
            ),
            s(
              'halil',
              'Ben… ben evi yakmadım, hâkim hanım. Dikkatsiz miydim? Bilmiyorum. Usta ne dediyse yaptım.',
              'uzgun',
            ),
          ],
        },
      ],
      next: 'T_05M',
      options: [
        option('T05_A', 'Uyarı alındı, yenileme takvime kondu; özen yükümlülüğü yerine getirildi', {
          visibleWhen: has('ded_onlem'),
          score: { HUKUKI_BILGI: 100, SAVUNMA_STRATEJISI: 60 },
          effects: [raise('taksir_cevap'), inc('pers'), inc('legal_hits')],
          good: 'Taksir, dikkat ve özen yükümlülüğüne aykırılıkla öngörülebilir neticenin gerçekleşmesidir (TCK 22/2). Uzmanın “acil değil, restorasyonla yenileyin” dediği tesisatta yenilemeyi takvime koyan ve yükü azaltan kişi özen yükümlülüğünü yerine getirmiştir. Duruşmada hazır edilen tanık, delil ikamesi talebiyle dinlenebilir (CMK 178, 206).',
          responses: [
            {
              when: flag('fact_acil_degil'),
              lines: [
                me(
                  'Sayın Hâkim, elektrikçinin notu: “acil değil, yenileme restorasyonun ilk haftası, ağır yük çekmeyin.” Sözleşme: 19 Ocak, ilk iş tesisat.',
                ),
                me('Notu yazan elektrikçi Necati Usta koridorda hazır, Sayın Hâkim. Dinlenmesini talep ediyoruz.'),
                s('hakim', 'Hazır tanık dinlensin. Kısa tutalım.'),
                n(
                  'Necati Usta kürsüye iş tulumunun üstüne giydiği bayramlık ceketle çıktı. Ellerini nereye koyacağını bilemedi; sonunda arkasında kavuşturdu, okul çocuğu gibi.',
                ),
                s(
                  'necati',
                  'Otuz yıllık elektrikçiyim, hâkim hanım. O evin tesisatına aralıkta baktım. Eskiydi, kumaş kaplı kablo. Koridor buatı ılıktı. Yanık değil; ılık.',
                ),
                s(
                  'necati',
                  'Halil Abi’ye dedim: “Ağır yük çekme, soba yerine elektrikli ısıtıcı koyma, restorasyonun ilk haftası hepsini sökeriz.” Takvime yazdık. On dokuz ocak.',
                ),
                s('savci', 'Usta, tehlikeli olduğunu düşünseydiniz ne yapardınız?'),
                s(
                  'necati',
                  'Sigortayı indirirdim, savcı bey. Bir dakika beklemezdim. Ben o gün sigortayı indirmedim. Çünkü normal kullanımda yıllarca giderdi. Ben öyle gördüm.',
                ),
                n(
                  'Necati Usta kürsüden inerken Halil’e baktı. “Kusura bakma abi” der gibi bir bakış. Halil başını iki yana salladı: kusur yok.',
                ),
                me(
                  'Müvekkilim uyarıyı duydu, ustanın dediğini yaptı, yükü kaldırdı, evden çıktı. Uzmanın “acil değil” dediği yerde, uzmandan daha dikkatli olması beklenemez.',
                ),
                s('hakim', 'Kayda geçsin.'),
              ],
            },
            {
              lines: [
                me(
                  'Sayın Hâkim, elektrikçinin notu: “acil değil, yenileme restorasyonun ilk haftası, ağır yük çekmeyin.” Sözleşme: 19 Ocak, ilk iş tesisat.',
                ),
                me(
                  'Müvekkilim uyarıyı duydu, ustanın dediğini yaptı, yükü kaldırdı, evden çıktı. Bir uzmanın “acil değil” dediği yerde, uzmandan daha dikkatli olması beklenemez.',
                ),
                s('hakim', 'Kayda geçsin.'),
              ],
            },
          ],
        }),
        option('T05_B', 'Yangını 02.08’deki nötr kopması çıkardı; netice sanığın kusuruna bağlanamaz', {
          visibleWhen: has('ded_notr'),
          score: { HUKUKI_BILGI: 120, SAVUNMA_STRATEJISI: 60 },
          effects: [raise('taksir_cevap'), raise('taksir_dis'), inc('pers', 2), inc('legal_hits')],
          good: 'Taksirli sorumluluk için netice failin özen yükümlülüğüne aykırılığına bağlanabilmelidir. Dağıtım hattındaki nötr kopmasının yarattığı aşırı gerilim, normal kullanımda yıllarca dayanacak bir tesisatı yakmıştır: netice, sanığın değil üçüncü kişinin alanındaki bir arızaya bağlıdır.',
          responses: [
            {
              lines: [
                me(
                  'Sayın Hâkim, dağıtım şirketinin kaydı: 02.08, nötr kopması. Komşuların cihazları aynı dakikada yandı. Elektrikçi “normal kullanımda yıllarca gider” dedi.',
                ),
                me(
                  'Bu yangını eski bir tesisat değil, sokağın hattından gelen aşırı gerilim çıkardı. Müvekkilim ne o hattı biliyordu ne de ona dokunabilirdi.',
                ),
                s('savci', 'Sayın Hâkim, bu kayıt karşısında taksir değerlendirmemizi gözden geçireceğiz.'),
              ],
            },
          ],
        }),
        option('T05_C', 'Sanık o gece evde değildi; olay yerinde olmayan kişi taksirle yangın çıkaramaz', {
          score: { HUKUKI_BILGI: -50 },
          effects: [dec('pers')],
          bad: 'Taksir için failin olay anında orada bulunması gerekmez; özen yükümlülüğüne aykırılık önceden de gerçekleşebilir (bakımsız tesisat gibi). Savunma bu noktada özen yükümlülüğünün yerine getirildiğini ya da illiyetin kesildiğini göstermeliydi.',
          responses: [
            {
              lines: [
                s('hakim', 'Taksirli suçlarda failin olay anında orada olması şart değildir, müdafi. Kayda geçti.'),
              ],
            },
          ],
        }),
        option('T05_D', 'Nitelik değişti; ek savunmayı hazırlamak için CMK 226 uyarınca süre istiyoruz', {
          neutral:
            'Sanık, nitelik değişikliği hatırlatmasında ek savunma için süre isteyebilir (CMK 226/4); ama delillerin hazır olduğu bir celsede süre istemek, cevabın olmadığı izlenimini verir.',
          responses: [
            {
              lines: [
                s(
                  'hakim',
                  'Talep tutanağa geçti. Delil durumu hazır olduğundan mütalaa alınacak; ek savunmanızı esas hakkındaki savunmanızla birlikte yapabilirsiniz.',
                ),
              ],
            },
          ],
        }),
      ],
    }),
    decisionNode(
      'T_05M',
      [
        { when: all(ref('hizlandirici_coktu'), flag('eksper_kirildi'), ref('elektrik_ispat')), to: 'T_05B' },
        { when: ref('hizlandirici_coktu'), to: 'T_05E' },
        { to: 'T_05N' },
      ],
      { ...court2.base },
    ),
    story('T_05B', {
      ...court2.base,
      title: 'Mütalaa',
      background: 'durusma_salonu',
      lines: [
        {
          lines: [
            s('hakim', 'Esas hakkındaki mütalaa. Sayın Savcı.'),
            n('Kemal Dinçer ayağa kalktı. Dosyasını açmadı. Bir süre pencereye baktı, sonra hâkime.'),
            s('savci', 'Sayın Hâkim, iddianameyi ben yazmadım ama bu masada ben savunuyorum. Bugün savunamıyorum.'),
            s(
              'savci',
              'Hızlandırıcı tespitinin dayanağı olan numuneler, olay yerine muhafaza altındayken giren eksperden gelmiştir; eksper bugün sorulara cevap vermemiştir.',
            ),
            s(
              'savci',
              'Elektrik bilirkişisi birincil ark bulmuştur; dağıtım şirketi aşırı gerilimi kaydetmiştir. Yangın elektrik kaynaklıdır.',
            ),
            s(
              'savci',
              'Sanığın yüklenen suçları işlemediği anlaşılmıştır. Beraatini talep ediyorum. Eksper hakkında başsavcılığımızda soruşturma sürmektedir.',
            ),
            n('Katılan vekili ayağa kalktı, bir şey söyleyecekti; söylemedi, oturdu.'),
            th(
              'Bir savcının “savunamıyorum” demesi. Bu meslekte bunu duymak, bir yıldızın düşüşünü görmek gibi: nadir ve sessiz.',
            ),
          ],
        },
      ],
      choices: [cont('T05B_DEVAM', 'Mütalaaya cevap', 'T_05R')],
    }),
    story('T_05E', {
      ...court2.base,
      title: 'Mütalaa',
      background: 'durusma_salonu',
      lines: [
        {
          lines: [
            s('hakim', 'Esas hakkındaki mütalaa. Sayın Savcı.'),
            s(
              'savci',
              'Sayın Hâkim, hızlandırıcı tespitinin dayanağı olan numunelerin elde ediliş zinciri güvenilir değildir. Kasten yangın çıkarıldığı şüpheden uzak ispatlanamamıştır.',
            ),
            s(
              'savci',
              'Ancak sanık, elektrikçisinin uyarısına rağmen eski tesisatı kullanmaya devam etmiştir. Yangın yan binaya sıçramış, iki aile tehlikeye girmiştir.',
            ),
            s(
              'savci',
              'Sanığın eylemine uyan taksirle genel güvenliği tehlikeye sokma suçundan cezalandırılmasını; dolandırıcılığa teşebbüsten beraatini talep ediyorum.',
            ),
            s('katilan', 'Katılan olarak sanığın dolandırıcılıktan cezalandırılması talebimizi tekrar ediyoruz.'),
            n(
              'Katılan vekili oturmadan önce dosyasından bir sayfa çıkardı, baktı, geri koydu. Eksperin raporuydu. Bir daha açmadı.',
            ),
            s(
              'hakim',
              'Katılan vekili, dolandırıcılık talebinizin dayanağı bilirkişi raporu mudur, başka bir delil midir? Kayda geçsin diye soruyorum.',
            ),
            s('katilan', 'Dosyanın bütünü, Sayın Hâkim.', 'saskin'),
            th('Dosyanın bütünü. Bir avukatın elinde tek bir kâğıt kalmadığında söylediği cümle.'),
            th('Kasıt düştü. Savcı ikinci kapıya yürüdü: dikkatsizlik. Şimdi o kapıyı kapatmam gerek.'),
          ],
        },
      ],
      choices: [cont('T05E_DEVAM', 'Mütalaaya cevap', 'T_05R')],
    }),
    story('T_05N', {
      ...court2.base,
      title: 'Mütalaa',
      background: 'durusma_salonu',
      lines: [
        {
          lines: [
            s('hakim', 'Esas hakkındaki mütalaa. Sayın Savcı.'),
            s(
              'savci',
              'Sayın Hâkim, bilirkişi raporu, poliçenin zamanlaması, teminat artışı, eşyaların taşınması, benzin alımı ve sanığın borçları bir bütün olarak değerlendirildiğinde kasıt açıktır.',
            ),
            s(
              'savci',
              'Tek tek bakınca her şeyin bir açıklaması var. Yan yana koyunca yok. Sanığın iddianamedeki gibi cezalandırılmasını talep ediyorum.',
            ),
            s('katilan', 'Katılıyoruz, Sayın Hâkim.'),
            th('Halat hâlâ kürsüde asılı. İpliklerin bir kısmını gevşettim; koparamadım.'),
          ],
        },
      ],
      choices: [cont('T05N_DEVAM', 'Mütalaaya cevap', 'T_05R')],
    }),
    choiceNode('T_05R', {
      ...court2.base,
      title: 'Mütalaaya cevap',
      background: 'durusma_salonu',
      lines: [
        {
          lines: [
            s('hakim', 'Müdafi, mütalaaya karşı diyecekleriniz?'),
            th('Savcının ipliklerini sayıyorum. Hangisini burada, şimdi, bir kâğıtla koparabilirim?'),
          ],
        },
      ],
      prompt: 'Mütalaadaki hangi noktalara cevap veriyorsun?',
      choices: [
        option('R_BANKA', 'Poliçe bir kredinin şartıydı; tazminat önce bankaya gidecekti', {
          visibleWhen: has('ded_banka'),
          score: { SAVUNMA_STRATEJISI: 60 },
          effects: [raise('motif_banka')],
          good: 'Poliçenin bankanın kullandırım şartı olması ve dain-i mürtehin kaydı, “zamanlama” ipliğini masum bir açıklamaya bağlar.',
          responses: [
            {
              lines: [
                me(
                  'Poliçeyi müvekkilim aramadı; banka şart koştu. Ve özel şart: tazminat kredi bakiyesi kadar önce bankaya. Kırk yedi gün, bir kredinin yaşıdır, bir planın değil.',
                ),
                s('katilan', 'Sayın Hâkim, kredi şartı olması poliçeden yararlanma iradesini ortadan kaldırmaz.'),
                me(
                  'Kaldırmaz. Ama tazminatın önce bankaya gideceği bir poliçe, borçlu bir adama parasal bir kurtuluş vaat etmez. Kurtulacak olan banka.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('R_ARTIS', 'Teminat artışını acente kampanyayla teklif etti; arayan acenteydi', {
          visibleWhen: any(has('ded_artis'), has('ev_cagri')),
          score: { SAVUNMA_STRATEJISI: 60 },
          effects: [raise('motif_artis')],
          good: 'Acentenin giden araması ve kampanya kodu, artışın sigortalıdan değil acenteden geldiğini gösterir.',
          responses: [
            {
              lines: [
                me(
                  'Teminat artışı: acentenin sistemi, giden arama, 3 Ocak 11.12, kampanya kodu KMP-RST. Müvekkilim sigortacıya “olur” dedi. Bu bir suç değil.',
                ),
                n(
                  'Dinleyici sırasında yağmurluklu bir kadın başını bir kez salladı. Acente Kader Acar. Kimse onu çağırmamıştı; sistem saatini o basmıştı.',
                ),
                s(
                  'savci',
                  'Acentenin kaydını gördüm, Sayın Hâkim. Artışın sanıktan geldiğine dair dosyada başka bir delil yoktur; bunu kayda geçirmek isterim.',
                ),
                th(
                  'Bir savcının kendi ipliğini kendi eliyle koparması. Dürüst savcılar da vardır; bu dosyada biri var.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('R_BIDON', 'Benzin hâlâ atölyede; fişteki beş litrenin dördünü kolluk da tespit etti', {
          visibleWhen: flag('contra_s6'),
          score: { SAVUNMA_STRATEJISI: 40 },
          responses: [
            {
              lines: [
                me(
                  'Fişteki beş litrenin dördü atölyede, jeneratörün yanında. Kolluk tespit etti. Bir litre jeneratörün deposunda. Evin yolunu tutan benzin yok.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('R_BITIR', 'Cevabım bu kadar', { next: 'T_06P' }),
      ],
    }),
    choiceNode('T_06P', {
      ...court2.base,
      title: 'Esas savunmanın dayanakları',
      background: 'durusma_salonu',
      hud: ['dayanak', 'cred', 'pers'],
      lines: [
        {
          lines: [
            n(
              'Hâkim esas hakkındaki savunma için söz vermeden önce dosyasını kapattı ve bekledi. Salonda yalnızca kaloriferin tıkırtısı.',
            ),
            th(
              'Notlarım önümde. Bir ayın notları. Hepsini söyleyemem. Hâkim en çok üç şeyi hatırlar. İspatlamadığım bir cümle, ispatladığım üç cümleyi de götürür.',
            ),
          ],
        },
      ],
      prompt:
        'Esas savunmadan önce en çok üç dayanak seç. Duruşmada ispatlanmış dayanak hâkimi ikna eder; ispatlanmamış dayanak seni zayıflatır.',
      choices: [
        dayanak(
          'D_ZINCIR',
          'Numuneler olay yerinden değil, eksperin elinden geldi',
          flag('contra_b2'),
          'Bilirkişi kendi ağzıyla söyledi: numuneleri ben almadım. Zincir kayıtta kopuk.',
          'Tenekelerin kimin elinden geldiğini kürsüde kimseye söyletemedim. Bu dayanak boşlukta.',
        ),
        dayanak(
          'D_ZEMIN',
          'Zemin izi moloz kaldırıldıktan sonra ortaya çıktı',
          any(flag('contra_b1'), flag('contra_u2')),
          'İki fotoğraf, beş saat, bir el. Zemin izinin doğum saati kayıtta.',
          'Zemin izini sorgulayamadım. Fotoğraflar dosyada ama kimse onlara bakmadı.',
        ),
        dayanak(
          'D_ELEKTRIK',
          'Yangın elektrik kaynaklı: birincil ark ve 02.08’deki aşırı gerilim',
          ref('elektrik_ispat'),
          'Ark boncuğu ve bir sokak hattının kaydı. Yangının sebebi bir kibrit değil, bir tel.',
          'Elektrik kaynağını bir ihtimal olarak bıraktım. İhtimal bir dayanak değildir.',
        ),
        dayanak(
          'D_IPLIK',
          'Poliçe, artış, eşyalar, benzin: her ipliğin belgeli bir açıklaması var',
          ref('motif_coktu'),
          'İplikler tek tek yerde: bir kredi, bir kampanya, bir takvim, bir jeneratör.',
          'İpliklerin çoğu hâlâ kürsüde asılı. Bunu söylemek, onları hâkime hatırlatmak olur.',
        ),
        dayanak(
          'D_KOMSU',
          'Komşunun anlatımı çöktü: el fenerli adam bekçi, koku kablo',
          any(flag('contra_s1'), flag('contra_s2')),
          'Saadet Hanım’ın gece gördüğü adam bekçiydi; aldığı koku kablo kokusuydu. Kendi ağzıyla.',
          'Saadet Hanım’ın “benzin” kelimesi tutanakta hâlâ duruyor. Bu dayanak boşa düşer.',
        ),
        dayanak(
          'D_EKSPER',
          'Eksperin raporu bir kalıptır; kendisi sorulara cevap vermedi',
          flag('eksper_kirildi'),
          'Bir kitap, yazarının okumayı reddettiği bir kitap. Susuş kayıtta.',
          'Eksper kürsüde ayakta kaldı. Onu suçlamak, kanıtı olmayan bir öfke olur.',
        ),
        dayanak(
          'D_TAKSIR',
          'Dikkatsizlik de yok: uyarı alındı, önlem takvime kondu ya da sebep dış etkendi',
          flag('taksir_cevap'),
          'Hâkimin ikinci kapısı da kapandı. Kayıtla.',
          'Taksire cevabım kayıtta değil. Bu dayanak, açık bir kapıyı gösteriyor.',
        ),
        option('D_BITIR', 'Dayanaklar bu kadar; savunmaya geç', { next: 'T_06' }),
      ],
    }),
    choiceNode('T_06', {
      ...court2.base,
      title: 'Esas hakkında savunma',
      background: 'durusma_salonu',
      prompt: s('hakim', 'Müdafi, esas hakkındaki savunmanızı yapın.'),
      next: 'T_07',
      choices: [
        option(
          'T06_B',
          'Suç işlenmemiştir: yangın elektrik arızasıyla çıkmış, hızlandırıcı izi sonradan getirilmiştir (CMK 223/2-b)',
          {
            effects: [
              ifThen(
                all(ref('hizlandirici_coktu'), flag('eksper_kirildi'), ref('elektrik_ispat'), flag('taksir_cevap')),
                [
                  score('SAVUNMA_STRATEJISI', strategyAmount(200, 'MASUMIYET')),
                  inc('pers'),
                  raise('gercek'),
                  raise('beraat_savunma'),
                  mark(
                    'GOOD',
                    'Savunma delillerle örtüşüyor: elektrik kaynağı raporla ve kayıtla, hızlandırıcının kaynağı numune zinciri ve eksperin susuşuyla ortaya kondu.',
                    'SAVUNMA_STRATEJISI',
                  ),
                ],
                [
                  score('SAVUNMA_STRATEJISI', -100),
                  dec('pers'),
                  mark(
                    'BAD',
                    'Suçun işlenmediği iddiası duruşmada ispatlanmadı: elektrik kaynağı ya da hızlandırıcının kaynağı “sabit” değil.',
                    'SAVUNMA_STRATEJISI',
                  ),
                ],
              ),
            ],
            responses: [
              {
                when: all(ref('elektrik_ispat'), any(flag('contra_u3'), flag('contra_b4'))),
                lines: [
                  me(
                    'Sayın Hâkim. Bu dosya bir kokuyla başladı. Bir komşu “benzin” dedi; bir polis o kelimeyi ona vermişti. Bir eksper “döküntü izi” dedi; o izi kendi eliyle açmıştı.',
                  ),
                  me(
                    'Bugün o kokunun yerinde bir bakır boncuk var. Koridor hattında, yangından önce oluşmuş. Bir sokağın hattında 02.08’de kopan bir tel var. Komşuların yanan cihazları var.',
                  ),
                  me(
                    'Ve laboratuvarın ölçtüğü benzin, o yangını hiç görmemiş bir talaşın içinde. İçeri dolu giren iki tenekenin içinde.',
                  ),
                  me(
                    'Kalem Sokak 9 kundaklanmadı. Yandı. Müvekkilim karısının evini yakmadı; o evin yangınında, bir başkasının hikâyesine yakıldı. Beraatini talep ediyorum.',
                  ),
                ],
              },
              {
                when: ref('elektrik_ispat'),
                lines: [
                  me(
                    'Sayın Hâkim. Bu dosya bir kokuyla başladı. Bir komşu “benzin” dedi; bir polis o kelimeyi ona vermişti. Bir eksper “döküntü izi” dedi; o izi kendi eliyle açmıştı.',
                  ),
                  me(
                    'Bugün o kokunun yerinde bir bakır boncuk var. Koridor hattında, yangından önce oluşmuş. Bir sokağın hattında 02.08’de kopan bir tel var. Komşuların yanan cihazları var.',
                  ),
                  me(
                    'Kalem Sokak 9 kundaklanmadı. Yandı. Müvekkilim karısının evini yakmadı; o evin yangınında, bir başkasının hikâyesine yakıldı. Beraatini talep ediyorum.',
                  ),
                ],
              },
              {
                lines: [
                  me(
                    'Sayın Hâkim. Bu dosya bir kokuyla başladı. Bir komşu “benzin” dedi; bir eksper “döküntü izi” dedi. Ama o koku da o iz de kimsenin önünde ortaya çıkmadı.',
                  ),
                  me(
                    'Ev eskiydi, tesisatı eskiydi. Yangın bir kibritle değil, bir telle başlamış olmalı. Kalem Sokak 9 kundaklanmadı; yandı. Beraatini talep ediyorum.',
                  ),
                  th('“Olmalı.” Bir esas savunmada en pahalı kelime. Hâkim kalemini oynatmadı.'),
                ],
              },
            ],
          },
        ),
        option(
          'T06_E',
          'Kasıtla yangın çıkarıldığı ve sigortacının aldatıldığı sabit değildir; şüphe sanık lehinedir (CMK 223/2-e)',
          {
            effects: [
              ifThen(
                all(ref('hizlandirici_coktu'), ref('motif_coktu')),
                [
                  score('SAVUNMA_STRATEJISI', strategyAmount(200, 'USUL')),
                  inc('pers'),
                  raise('beraat_savunma'),
                  mark(
                    'GOOD',
                    'Hızlandırıcı tespiti dayanaksız kaldı, dolaylı delillerin iplikleri belgeli açıklamalarla çözüldü: kalan şüphe sanık lehine (Anayasa 38/4).',
                    'SAVUNMA_STRATEJISI',
                  ),
                ],
                [
                  score('SAVUNMA_STRATEJISI', -100),
                  mark(
                    'BAD',
                    'Şüphe savunması için yeterli bulgu ortaya konmadı: hızlandırıcı tespiti ya da dolaylı delillerin halatı ayakta kaldı.',
                    'SAVUNMA_STRATEJISI',
                  ),
                ],
              ),
            ],
            responses: [
              {
                when: all(ref('hizlandirici_coktu'), ref('motif_coktu'), flag('alibi_kayit')),
                lines: [
                  me(
                    'Sayın Hâkim. Savcılık bir halat ördü: poliçe, artış, eşyalar, benzin, borç. Ve ucunu bir rapora bağladı.',
                  ),
                  me(
                    'O raporun dayanağı olan numuneleri kimse o zeminden alırken görmedi. Bilirkişi “ben almadım” dedi. Zemin izi, molozu kaldıranın fotoğrafında doğdu.',
                  ),
                  me(
                    'O gece müvekkilim kilitli bir sanayi sitesinin içindeydi. Kapı on birde kilitlendi, altıda açıldı; anahtar bekçideydi, defter de. Bir otelin kırk sandalyesi tanık.',
                  ),
                  me(
                    'İplikler belgeli: kâğıdı olan her ipliği tek tek çözdük. Borç gerçek; ama borç bir yangın değildir.',
                  ),
                  me(
                    'Tek tek bakınca her şeyin açıklaması var, dedi savcı. Yan yana koyunca da var. Halat çözüldü; elde ipler kaldı. Kuşku varsa, o kuşku Halil Bozkurt’undur. Beraatini talep ediyorum.',
                  ),
                ],
              },
              {
                when: all(ref('hizlandirici_coktu'), ref('motif_coktu')),
                lines: [
                  me(
                    'Sayın Hâkim. Savcılık bir halat ördü: poliçe, artış, eşyalar, benzin, borç. Ve ucunu bir rapora bağladı.',
                  ),
                  me(
                    'O raporun dayanağı olan numuneleri kimse o zeminden alırken görmedi. Bilirkişi “ben almadım” dedi. Zemin izi, molozu kaldıranın fotoğrafında doğdu.',
                  ),
                  me(
                    'İplikler belgeli: kâğıdı olan her ipliği tek tek çözdük. Borç gerçek; ama borç bir yangın değildir.',
                  ),
                  me(
                    'Tek tek bakınca her şeyin açıklaması var, dedi savcı. Yan yana koyunca da var. Halat çözüldü; elde ipler kaldı. Kuşku varsa, o kuşku Halil Bozkurt’undur. Beraatini talep ediyorum.',
                  ),
                ],
              },
              {
                lines: [
                  me(
                    'Sayın Hâkim. Savcılık bir halat ördü: poliçe, artış, eşyalar, benzin, borç. Ve ucunu bir rapora bağladı.',
                  ),
                  me(
                    'Ben o halatın her ipliğini koparamadım; biliyorum. Ama hiçbir iplik, bir insanın evini yaktığını tek başına göstermez. Kuşku sanık lehinedir. Beraatini talep ediyorum.',
                  ),
                  th('Bir ilke okudum; bir delil değil. Hâkim ilkeyi biliyordu. Benden delil bekliyordu.'),
                ],
              },
            ],
          },
        ),
        option('T06_T', 'Öncelikle beraat; aksi hâlde eylem olsa olsa taksirle yangına neden olmadır (TCK 171/1-a)', {
          score: { SAVUNMA_STRATEJISI: strategyAmount(150, 'INDIRIM') },
          effects: [raise('terditli')],
          good: 'Terditli savunma meşrudur: önce beraat, olmazsa daha hafif nitelendirme. Ama kasıt düşmüşken taksiri kendin önermek, hâkime ikinci kapıyı gösterir.',
          responses: [
            {
              lines: [
                me(
                  'Sayın Hâkim. Öncelikle müvekkilimin beraatini talep ediyorum: yangının kasten çıkarıldığı ispat edilemedi.',
                ),
                me(
                  'Mahkemeniz aksi kanaatteyse, eylem olsa olsa eski bir tesisatın yol açtığı bir kazadır; taksirle yangına neden olmadır. Hükmün açıklanmasının geri bırakılmasını talep ederiz.',
                ),
              ],
            },
          ],
        }),
        option(
          'T06_D',
          'Sanık karısını da evini de kaybetmiştir; hakkaniyet ve şahsi durumu gözetilerek cezalandırılmamalıdır (TCK 62)',
          {
            score: { SAVUNMA_STRATEJISI: -50 },
            effects: [dec('pers')],
            bad: 'Duygusal söylem delilin yerini tutmaz; TCK 62 bir cezayı indirir, bir beraatin dayanağı olmaz. Esas savunma delillerin tartışılmasıdır.',
            responses: [
              {
                lines: [
                  me(
                    'Sayın Hâkim, karşınızda karısını kaybetmiş, şimdi de karısının evini kaybetmiş bir adam var. Bir de özgürlüğünü almayın.',
                  ),
                  s('katilan', 'Herkesin bir hikâyesi var, Sayın Hâkim. Dosyada bir laboratuvar raporu var.'),
                ],
              },
            ],
          },
        ),
      ],
    }),
    choiceNode('T_07', {
      ...court2.base,
      title: 'Son söz',
      background: 'durusma_salonu',
      prompt: s('hakim', 'Sanık, son sözünüz?'),
      next: 'T_08',
      choices: [
        option('T07_A', '“O evin her tahtasını ben cilaladım. Yakmadım. Bu kadar.”', {
          score: { SAVUNMA_STRATEJISI: 50 },
          effects: [ifThen(any(flag('halil_hazir'), flag('halil_ek_hazir')), [inc('pers')])],
          good: 'Kısa, doğru, kendi sesiyle bir son söz (CMK 216/3).',
          responses: [
            {
              lines: [
                n('Halil ayağa kalktı. Ceketin omuzları gerildi; bu sefer düzeltmedi.'),
                s(
                  'halil',
                  'Hâkim hanım. O evin her tahtasını ben cilaladım. Kapı kollarını söküp tek tek temizlerdim. Nermin gülerdi.',
                ),
                s('halil', 'Yakmadım. Bu kadar.'),
                n(
                  'Oturdu. Ellerini dizlerinin üstüne koydu; avuçları yukarı, boş. Zehra’nın elindeki çanta bu sefer hışırdamadı.',
                ),
              ],
            },
          ],
        }),
        option('T07_B', '“Hâkim hanım, merhamet edin; yaşlı bir adamım, bir kızım var.”', {
          neutral:
            'Merhamet talebi tek başına bir indirim nedeni değildir (TCK 62/2); son söz kendini anlatmanın yeridir.',
          responses: [{ lines: [s('halil', 'Hâkim hanım, ben yaşlı bir adamım. Merhamet edin.', 'uzgun')] }],
        }),
        option('T07_C', '“O eksper yaktı benim evimi! Kalemiyle yaktı, hâkim hanım!”', {
          score: { SAVUNMA_STRATEJISI: -25 },
          bad: 'Son söz bir başkasını suçlamanın değil kendini anlatmanın yeridir; eksper evi yakmadı, raporu yazdı. Hâkim bunu öfke olarak okudu.',
          responses: [
            {
              lines: [
                s('halil', 'O eksper yaktı benim evimi! Kalemiyle!', 'kizgin'),
                s('hakim', 'Kayda geçti, sanık. Oturun.'),
              ],
            },
          ],
        }),
      ],
    }),
    decisionNode('T_08', [{ to: 'T_08L' }], {
      ...TRIAL,
      lines: [
        {
          lines: [
            s('hakim', 'Hüküm için ara veriyoruz.'),
            n(
              'Kırk dakika. Koridorda bir çaycı, bir bekçi, bir dul, bir hemşire. Pencerenin dışında güneş mayısın ilk günleri gibi utangaç çıktı; kimse fark etmedi.',
            ),
            n(
              'Halil bankın ucunda oturuyordu. Cebinden bir iğne ve bir makara iplik çıkarmış, ceketinin dar omzunun dikişini söküyordu. Yavaşça, bir ilmek, bir ilmek.',
            ),
            s(
              'halil',
              'Omzu genişletiyorum. Kızım bir beden küçük almış; annesi gibi. Hangi karar çıkarsa çıksın, ceket oturmalı.',
            ),
            n('Zehra babasının elinden ceketi almadı. Yanına oturdu, makarayı tuttu. İplik bir elden ötekine geçti.'),
            th(
              'Müzakere odasının kapısı kapalıyken bir avukatın elinde hiçbir şey yoktur. Bütün dosya artık bir başkasının vicdanında. En dürüst kırk dakika.',
            ),
          ],
        },
      ],
    }),
    decisionNode('T_08L', [{ to: 'T_08M' }], {
      ...TRIAL,
      lines: [
        {
          when: not(flag('cokus')),
          lines: [
            n(
              'Müzakere odasının kapısı açılmadan önce Leyla koridorun ucunda belirdi. Gelmeyeceğini söylemişti. Sigara paketi elinde, açılmamış.',
            ),
            s('leyla', 'Ne olursa olsun, Deniz, bugün dosyayı sen taşıdın. Karar senin değil; dosya senindi.'),
            th('Leyla’nın “ne olursa olsun” dediği günler, bir şeyin olacağını bildiği günlerdi. Hangisi, söylemedi.'),
          ],
        },
      ],
    }),
    decisionNode('T_08M', [{ to: 'R_KARAR' }], {
      ...TRIAL,
      lines: [{ lines: [s('mubasir', 'Ayağa kalkın!'), s('hakim', 'Hüküm fıkrası ayakta dinlenir.')] }],
    }),
    story('T_COKUS', {
      ...court2.base,
      title: 'Çöküş',
      background: 'durusma_salonu',
      lines: [
        {
          lines: [
            n(
              'Hâkim gözlüğünü çıkardı ve masaya bıraktı. Bir hâkim gözlüğünü çıkardığında, artık okuyacak bir şey kalmamıştır.',
            ),
            s(
              'hakim',
              'Müdafi, sunduğunuz delillerin hiçbiri ileri sürdüğünüz şeyi göstermedi. Sabrın bir sınırı var. Sanığın son sözünü alıp hükme geçeceğim.',
            ),
            th(
              'Fotoğrafları buldum, çizelgeyi buldum, bidonu buldum. Ama onları yanlış kapılara taşıdım; her yanlış kapı biraz daha güven götürdü.',
            ),
          ],
        },
      ],
      choices: [cont('COKUS_SON', 'Son söz: “Ben yakmadım.”', 'T_08')],
    }),
    resultNode('R_KARAR', { ...VERDICT, title: 'Karar' }),
  ],
  triggers: [
    {
      id: 'tg_cokus',
      priority: 0,
      once: true,
      when: all(flag('in_court'), cmp(v('cred'), '<=', 0)),
      effects: [raise('cokus')],
      goto: 'T_COKUS',
    },
  ],
  discoveryPaths: elkoyma.discoveryPaths,
};
