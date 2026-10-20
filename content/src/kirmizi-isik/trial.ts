import {
  L,
  N,
  P,
  all,
  any,
  choiceNode,
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
  says,
  score,
  statement,
  story,
  strategyAmount,
  v,
  when,
  otherwise,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, Cond, Effect } from '../../../tools/content/src/kit/index.js';
import { T, TRIAL, VERDICT, card, court2, fx, wrongEvidence } from './shared.js';

// 70-trial: 3. celse — koridor, raporlar ve savcılık yazısı, teknisyenin ve bilirkişinin çapraz sorgusu, polise sorular,
// delillerin tartışılması, mütalaa ve cevap, esas savunmanın dayanakları, esas savunma, son söz, hüküm.

const arrivals = deliver('T_00G1', [
  {
    evidence: 'ev_savcilik',
    requires: all(flag('suc_dayanakli'), not(flag('etik_garaj'))),
    hint: 'Kaçan aracı tarif eden somut bir suç duyurusu (CMK 158) savcılığı harekete geçirirdi.',
  },
  {
    evidence: 'ev_far_parca',
    requires: flag('ayten_teslim'),
    hint: 'Ayten’in sakladığı parçanın savcılığa tutanakla teslimi.',
  },
]);

const papers = ['ev_bilirkisi', 'ev_hts', 'ev_volkan_ifade', 'ev_necati_ifade'];
const penalty = (id: string, who: 'hakim' | 'savci') =>
  presentRule(id, undefined, papers, {
    maxUses: 4,
    effects: [
      ...wrongEvidence,
      score('SORGULAMA', -150, 'hatali'),
      mark(
        'BAD',
        'İddianın kendi belgesini sunmak bir çelişki doğurmaz; yalnızca güvenilirlik kaybettirir.',
        'SORGULAMA',
      ),
    ],
    responses: says(
      who === 'savci'
        ? L('savci', 'Sayın Başkan, bu bizim delilimiz.')
        : L('hakim', 'Müdafi, bunun buradaki ifadeyle ilgisi ne?'),
    ),
  });

const mutalaaBeraat: Cond = all(has('ev_savcilik'), has('ded_olum'));
const mutalaaBasit: Cond = all(ref('kusur_yok'), any(flag('arg_edr'), flag('contra_c2')));

/** Kanıtlanmış ise +40, değilse −40 (esas savunmanın dayanağı). */
const dayanak = (id: string, label: string, proven: Cond, okText: string): ReturnType<typeof option> =>
  option(id, label, {
    cost: [{ var: 'noktalar', amount: 1 }],
    effects: [
      ifThen(
        proven,
        [score('SAVUNMA_STRATEJISI', 40, 'savunma'), mark('GOOD', okText, 'SAVUNMA_STRATEJISI')],
        [
          score('SAVUNMA_STRATEJISI', -40, 'savunma'),
          mark(
            'BAD',
            'Bu dayanak duruşmada ispatlanmadı; hâkim ispatlanmamış dayanağı savunmanın zayıflığı sayar.',
            'SAVUNMA_STRATEJISI',
          ),
        ],
      ),
    ],
    responses: [
      when(proven, P(`${okText}`)),
      otherwise(L('savci', 'Sayın Başkan, bu dosyada buna dair bir delil yok.')),
    ],
  });

const eff = (...e: Effect[]) => e;

export const trial: CasePart = {
  court: {
    sessions: [
      courtSession('cs_3', '3. Celse', [
        ['s3_acilis', 'ACILIS', 'T_00'],
        ['s3_tanik', 'TANIK_DINLEME', 'T_01'],
        ['s3_delil', 'DELIL_TARTISMA', 'T_07'],
        ['s3_mutalaa', 'MUTALAA', 'T_08'],
        ['s3_savunma', 'SAVUNMA', 'T_09'],
        ['s3_son_soz', 'SON_SOZ', 'T_10'],
        ['s3_karar', 'KARAR', 'T_11'],
      ]),
    ],
  },
  nodes: [
    story('T_00Y', {
      ...TRIAL,
      title: 'Sabah',
      background: 'sokak_sabah',
      lines: says(
        card('ÜÇÜNCÜ CELSE GÜNÜ — 08.40, ADLİYE OTOPARKI', 'sokak_sabah'),
        N(
          'Gece yağmuru dinmiş, asfalt hâlâ ıslaktı. Adliyenin otoparkında bir belediye kamyoneti, kapısında armayla. Yanında Hamdi Kocabaş sigara içiyordu; beni görünce sigarayı söndürmedi, ama başını eğdi.',
        ),
        N(
          'Merdivenlerde üniformalı biri: Ayten Yurt. Elinde bir dosya, üstünde savcılığın damgası. Göz göze geldik. Bir şey demedi; başını hafifçe salladı ve içeri girdi.',
        ),
        N(
          'Kapının yanında kasketli bir adam termosundan kahve içiyordu. Necati Bulut. Tanık değildi artık; dinleyiciydi. Bana bardağı kaldırdı, selam gibi.',
        ),
        T(
          'Üç hafta önce bu merdivenlerde herkes bir tarafı tutuyordu. Bugün herkes bir şeyi tutuyor: bir dosya, bir termos, bir sigara. Taraflar inceliyor; sorular kalınlaşıyor.',
        ),
        N('Leyla’nın kalemi ceketimin iç cebindeydi. Elimi göğsüme koydum; oradaydı.'),
      ),
      choices: [cont('T00Y_DEVAM', 'Koridora çık', 'T_00K', { role: 'PRIMARY' })],
    }),
    story('T_00K', {
      ...TRIAL,
      title: 'Koridor',
      background: 'adliye',
      lines: [
        when(
          flag('bebek_ela'),
          card('ADLİYE · 3. KAT — 09.30', 'adliye'),
          N(
            'Gül bir bebek taşıyıcısıyla gelmişti. İçinde pembe bir battaniye, battaniyenin içinde Ela. Volkan taşıyıcının sapını iki eliyle tutuyordu; direksiyon tutar gibi.',
          ),
          L('gul', 'Doktor “daha erken” dedi. Ben “babasının celsesi var” dedim. Doktor sustu.'),
          N(
            'Koridorun öbür ucunda Serkan Durmaz. Bu sefer elinde çerçeve yoktu; yalnızca bir telefon. Ekranına bakmıyordu, tutuyordu.',
          ),
          T(
            'Üç hafta önce bu koridorda bir adam “kabul edeceğim” diyordu. Bugün bir taşıyıcının sapını tutuyor. Bazı kararları insanlar değil, bebekler verir.',
          ),
        ),
        otherwise(
          card('ADLİYE · 3. KAT — 09.30', 'adliye'),
          N(
            'Gül bir bebek taşıyıcısıyla gelmişti. İçinde pembe bir battaniye. Volkan taşıyıcının sapını iki eliyle tutuyordu; direksiyon tutar gibi.',
          ),
          L('gul', 'Doktor “daha erken” dedi. Ben “babasının celsesi var” dedim. Doktor sustu.'),
          N(
            'Koridorun öbür ucunda Serkan Durmaz. Bu sefer elinde çerçeve yoktu; yalnızca bir telefon. Ekranına bakmıyordu, tutuyordu.',
          ),
          T(
            'Üç hafta önce bu koridorda bir adam “kabul edeceğim” diyordu. Bugün bir taşıyıcının sapını tutuyor. Bazı kararları insanlar değil, bebekler verir.',
          ),
        ),
      ],
      choices: [
        option('K2_SERKAN', 'Koridorun öbür ucundaki Serkan’a başınla selam ver.', {
          responses: [
            when(
              flag('serkan_teslim'),
              N(
                'Serkan başını salladı. Sonra taşıyıcıya baktı, bebeğe. Uzun uzun. Bir şey söylemedi; yüzü bir anlığına yumuşadı.',
              ),
            ),
            when(
              flag('serkan_saygi'),
              N('Serkan selamımı aldı. Kısa, ölçülü. Bir düşmanın değil, bir yabancının selamı.'),
            ),
            otherwise(N('Serkan görmezden geldi. Ya da gördü ve bakmamayı seçti. İkisi aynı şey.')),
          ],
          next: 'T_00G1',
        }),
        option('K2_VOLKAN', 'Volkan’ın yanına git: “Bugün de ne gördüyseniz.”', {
          effects: [inc('trust', 2)],
          responses: says(
            L('volkan', 'Ne gördüysem. Ela da duyacak. Büyüyünce. Anlatacağım ona.'),
            N('Mübaşirin sesi koridorda yankılandı. Volkan taşıyıcıyı Gül’e verdi, ceketini düzeltti.'),
          ),
          next: 'T_00G1',
        }),
      ],
    }),
    decisionNode('T_00G1', [{ to: 'T_00G2' }], {
      ...TRIAL,
      onEnter: [...arrivals.effects],
      lines: [
        when(
          has('ev_savcilik'),
          card('BURSA 7. ASLİYE CEZA MAHKEMESİ — 3. CELSE', 'durusma_salonu'),
          L('mubasir', 'Volkan Eren dosyası! Taraflar salona!'),
          L(
            'savci',
            'Sayın Başkan, söz almadan önce bir bilgi: müdafiin suç duyurusu üzerine yürütülen ayrı soruşturmada Altın Başak Fırını’na ait bir panelvan tespit edilmiştir.',
          ),
          L(
            'savci',
            'Aracın sağ ön köşesi kazanın ertesi günü faturasız onarılmış; kriminal incelemede maktulün montundaki boya ile eşleşmiştir. Sürücü Tarık Sezer şüpheli sıfatıyla ifade vermiştir. Yazı dosyaya sunulmuştur.',
          ),
          fx(
            N('Salon bir an tamamen sustu. Sonra Serkan ayağa kalktı, oturdu, yine kalktı. Vekili kolunu tuttu.'),
            'shake',
          ),
          T(
            'Bir isim. Üç ay boyunca bu dosyada olmayan bir isim. Ben bulmadım; bir kamera, bir boya, bir dilekçe buldu.',
          ),
          N(
            'Volkan başını kaldırdı. Gül’e baktı, sonra bana. Ağzı bir şey söylemek ister gibi açıldı; söylemedi. Gözleri doldu ve ilk kez ağlamaktan utanmadı.',
          ),
        ),
        otherwise(
          card('BURSA 7. ASLİYE CEZA MAHKEMESİ — 3. CELSE', 'durusma_salonu'),
          L('mubasir', 'Volkan Eren dosyası! Taraflar salona!'),
          N(
            'Salon bu sefer daha doluydu. Fabrikadan iki işçi, hastaneden üç temizlik görevlisi. Önlükleriyle gelmişlerdi.',
          ),
        ),
      ],
    }),
    decisionNode('T_00G2', [{ to: 'T_00' }], {
      ...TRIAL,
      onEnter: [ifThen(flag('necati_dilekce'), [inc('pers', 1)])],
      lines: [
        when(
          flag('necati_dilekce'),
          L(
            'hakim',
            'Tanık Necati Bulut’un mahkememize hitaben verdiği dilekçe okundu. Tanık, gümbürtüden önce uzun ve sesli bir fren, sonra kısa ve tıkırtılı ikinci bir fren duyduğunu bildirmektedir.',
          ),
          T('Necati yazmış. Kızı yazmış, o imzalamış. Benim tek kelimem yok içinde. İyi.'),
        ),
        when(
          has('ev_far_parca'),
          L(
            'hakim',
            'Polis memuru Ayten Yurt’un savcılığa teslim ettiği far camı parçası ve kriminal ön inceleme tutanağı dosyaya girmiştir.',
          ),
        ),
        otherwise(N('Hâkim dosyanın sayfalarını çevirdi. Kalınlaşmıştı; üç hafta önceye göre iki parmak.')),
      ],
    }),
    court2.stage('T_00', {
      title: '3. Celse · Açılış',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      lines: [
        when(
          has('ev_heyet'),
          L(
            'hakim',
            'Taraflar hazır. Bilirkişi heyeti raporu ile Adli Tıp ve olay veri kaydedicisi raporları dosyaya girmiş, taraflara tebliğ edilmiştir.',
          ),
          L(
            'hakim',
            'Heyet raporu, sanığa kırmızı ışık ihlali atfedilemeyeceğini ve fren izinin sanığın aracına ait olmadığını bildirmektedir. Ayrıca sanığa tali kusur izafe etmektedir.',
          ),
          L('hakim', 'Tanıkları dinleyeceğiz. Önce belediye teknisyeni.'),
          T('“Tali kusur.” Mahkemenin ağzından bir kez çıktı. Şimdi her cümlede yankılanacak.'),
        ),
        otherwise(
          L('hakim', 'Taraflar hazır. Bekleyen müzekkere cevapları dosyaya girmiş, taraflara tebliğ edilmiştir.'),
          L('hakim', 'Tanıkları ve bilirkişiyi dinleyeceğiz. Önce belediye teknisyeni.'),
        ),
      ],
      choices: [cont('T00_DEVAM', 'Devam', 'T_00S')],
    }),
    choiceNode('T_00S', {
      ...court2.base,
      title: 'Sanığın yeni delillere diyecekleri',
      background: 'durusma_salonu',
      prompt: L('hakim', 'Sanık, dosyaya giren yeni raporlar size okundu. Diyeceğiniz var mı?'),
      choices: [
        option('S0_GORDUGU', 'Volkan’a dön: “Raporları değil, kendi gördüğünüzü anlatın.”', {
          score: { SAVUNMA_STRATEJISI: 30 },
          effects: [ifThen(any(flag('volkan_dogru'), flag('volkan_hazir')), [inc('pers', 1)])],
          good: 'Sanığa her delilden sonra diyeceği sorulur (CMK 215); savunmanın işi onun ağzına rapor cümlesi koymak değil, kendi anlatımını korumaktır.',
          responses: [
            when(
              any(flag('volkan_dogru'), flag('volkan_hazir')),
              L(
                'volkan',
                'Raporları anlamıyorum efendim. Rakamları anlamıyorum. Ben o gece yeşil gördüm, yerde koyu bir şey gördüm, frene bastım. Hepsi bu.',
              ),
              L(
                'volkan',
                'Raporlar benim hakkımda bir şey söylüyorsa, umarım doğrusunu söylüyordur. Ben de doğrusunu söyledim.',
              ),
              T('Ne eksik ne fazla. Hastanedeki camın önünde verdiği söz.'),
            ),
            otherwise(
              L('volkan', 'Ne diyeyim efendim. Raporlar ne diyorsa. Ben… bilmiyorum.', 'uzgun'),
              T('“Bilmiyorum” doğru bir cevap. Ama hâkimin kulağında “umurumda değil” gibi de çınlayabilir.'),
            ),
          ],
          next: 'T_01',
        }),
        option('S0_RAPOR', 'Volkan’a heyet raporunu özetlet: “Rapor sizi haklı çıkarıyor, değil mi?”', {
          score: { SAVUNMA_STRATEJISI: -30 },
          bad: 'Sanığa raporun yorumunu söyletmek hem telkindir hem de onun kendi anlatımının yerine bir kâğıdı koyar; hâkim sanığın sesini değil, avukatın sesini duyar.',
          responses: says(
            L('volkan', 'Evet… rapor… kırmızı yokmuş. Avukat hanım öyle dedi.', 'saskin'),
            L('savci', 'Avukat hanım öyle demiş. Tutanağa geçsin.'),
          ),
          next: 'T_01',
        }),
      ],
    }),
    court2.stage('T_01', {
      title: 'Tanık: teknisyen',
      courtStage: 'TANIK_DINLEME',
      witness: 'hamdi',
      witnessLabel: 'TANIK · HAMDİ KOCABAŞ',
      lines: [
        when(
          flag('hamdi_cagrildi'),
          L('mubasir', 'Tanık Hamdi Kocabaş!'),
          N(
            'Hamdi baretsiz, ütülü bir gömlekle girdi. Ellerini nereye koyacağını bilemedi; sonunda kürsünün kenarını tuttu.',
          ),
          T(
            'Müdürü ona “hatırlamıyorum de” demişti. Babası yemin etmeyi bilen adammış. Bugün hangisinin oğlu olduğunu göreceğiz.',
          ),
          L('hakim', 'Gerçeği söyleyeceğinize yemin eder misiniz?'),
          L('hamdi', 'Ederim. Babam yemin etmeyi bilen adamdı. Ben de bilirim.'),
        ),
        otherwise(
          L('mubasir', 'Tanık Hamdi Kocabaş!'),
          N('Hamdi girdi, salona bakmadı. Gözleri yerde; bir tornavida arar gibi.'),
          L('hakim', 'Gerçeği söyleyeceğinize yemin eder misiniz?'),
          L('hamdi', 'Ederim efendim.'),
        ),
      ],
      choices: [cont('T01_DEVAM', 'Savcının sorularını dinle', 'T_02')],
    }),
    court2.objection('T_02', {
      title: 'Savcının sorusu',
      courtStage: 'TANIK_DINLEME',
      witness: 'hamdi',
      witnessLabel: 'TANIK · HAMDİ KOCABAŞ',
      say: [
        L('savci', 'Tanık, belediyenin üst yazısına göre kavşakta arıza tespit edilmemiş.'),
        L(
          'savci',
          'Yani o gece ışıkların normal çalıştığı, sanığın yönünün kırmızı yandığı sonucuna varabiliriz, değil mi?',
        ),
      ],
      next: 'T_03',
      options: [
        option('O2_TELKIN', 'İtiraz: soru tanığa bir sonucu onaylatıyor; telkin edici (CMK 201/1).', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers', 1)],
          good: 'Tanığa bir sonuç onaylatan soru telkin edicidir; başkan sorunun gerekip gerekmediğine karar verir (CMK 201/1).',
          responses: says(
            L('hakim', 'Kabul. Sayın savcı, tanığa gözlemini sorun.'),
            L('savci', 'Peki. Tanık, o gece kavşakta ne oldu, biliyor musunuz?'),
            L('hamdi', 'O gece ben yoktum. Ertesi gün vardım.'),
          ),
        }),
        option('O2_SUS', 'Sessiz kal; çapraz sorguda düzeltirsin.', {
          effects: [dec('pers', 1)],
          neutral: 'Telkinli soru cevaplandı; çapraz sorguda düzeltmek daha pahalıdır.',
          responses: says(
            L('hamdi', 'Üst yazı öyle diyorsa… öyledir herhalde.'),
            T('“Herhalde.” Bu dosyada en çok kullanılan kelime.'),
          ),
        }),
        option('O2_SALDIR', 'Sayın savcı tanığı yönlendiriyor; belediye bir şeyleri örtüyor!', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Kurum ve savcı hakkında dayanaksız suçlama itiraz değildir; dayanak bir usul kuralı olmalı.',
          responses: says(L('hakim', 'Müdafi! Salonda suçlama yok, itiraz var. Uyarıyorum.')),
        }),
      ],
    }),
    court2.testimony('T_03', {
      title: 'Teknisyenin çapraz sorgusu',
      courtStage: 'TANIK_DINLEME',
      witness: 'hamdi',
      witnessLabel: 'TANIK · HAMDİ KOCABAŞ',
      say: [L('hakim', 'Tanık, kavşak hakkında bildiklerinizi anlatın. Müdafi, ardından sorularınızı sorabilirsiniz.')],
      rulesText: 'Teknisyen müdüründen korkuyor; yalancı değil. Kayıtla ve onun kendi iş emriyle yüzleştir.',
      objectionGrounds: ['g_kanaat'],
      statements: [
        statement('TH1', 1, [
          'Gökdere–Çınarlı kavşağındaki sistem o gece ',
          hl('sağlamdı', any(flag('press_h1'), has('ev_sinyal_log'), has('ded_ariza'))),
          '.',
        ]),
        statement('TH2', 2, [
          hl('Kayıtta herhangi bir arıza görünmüyor', any(flag('press_h2'), flag('sinyal_cakisma'))),
          '; üst yazıda da öyle.',
        ]),
        statement('TH3', 3, [
          'Kart, ',
          hl('rutin bakımda', any(has('ded_ariza'), flag('sinyal_kart'), flag('fact_kart'))),
          ' değiştirildi.',
        ]),
        statement('TH4', 4, [
          'Arıza olsaydı yayalar fark ederdi. ',
          hl('Kimse şikâyet etmedi', any(has('ev_sesli'), has('ev_sinyal_log'))),
          '.',
        ]),
      ],
      rules: [
        penalty('PS_T3_SAVCILIK', 'savci'),
        pressRule('PR_TH1', 'TH1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_h1')],
          responses: [
            when(
              flag('hamdi_cagrildi'),
              P('Sağlamdı derken: lambalar yanıyordu mu, yoksa doğru yanıyordu mu?'),
              L('hamdi', 'Yanıyordu. Doğru yanıyor muydu… o ayrı soru abla. Pardon, avukat hanım.'),
            ),
            otherwise(
              P('Sağlamdı derken neyi kastediyorsunuz?'),
              L('hamdi', 'Lambalar yanıyordu. Elektrik vardı. Sağlam işte.'),
            ),
          ],
        }),
        presentRule('PS_TH1', 'TH1', ['ev_sinyal_log'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_h'),
            mark(
              'GOOD',
              'Denetleyici günlüğü: 00.58 yeniden başlatma ve bastırılmış “çatışan yeşil” uyarısı.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P(
              'Tanık, belediyenin kendi gönderdiği olay günlüğü. 14 Kasım 00.58.40: “UYARI 07, bastırıldı.” UYARI 07 nedir?',
            ),
            N('Hamdi kâğıda baktı. Tornavidası olmayan eli, olmayan bir vidayı çevirdi.'),
            L(
              'hamdi',
              'Çatışan yeşil. Yaya yeşili ile araç yeşilinin aynı anda yanması. Kart bunu görünce sistemi flaşöre almalıydı. Almamış. Bastırılmış.',
              'uzgun',
            ),
            L(
              'hamdi',
              'Ben 10 Kasım’da yazdım bunu. Kart yorgun dedim. Malzeme yok dediler. Ben söyledim. Kimse okumadı.',
              'uzgun',
            ),
            fx(
              L('hakim', 'Tanık, yani o gece Gökdere yönü ile yaya ışığı aynı anda yeşil yanmış olabilir mi?'),
              'shake',
            ),
            L('hamdi', 'Olabilir değil efendim. Kayıt öyle diyor. Yanmış.'),
            N(
              'Savcı kalemini bıraktı. Katılan vekili bir şey söyleyecek gibi oldu; Serkan onun koluna dokundu. Salonda yalnızca radyatörün tıkırtısı.',
            ),
            T('Bir teknisyen, bir makineden daha dürüst çıktı. Makine susturulmuştu; o susmadı.'),
          ),
        }),
        pressRule('PR_TH2', 'TH2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_h2')],
          responses: says(
            P('Kayıtta “görünmüyor” mu, “yok” mu?'),
            L('hamdi', 'Görünmüyor dedim. Üst yazıda yok. Makinenin dökümüne bakan olmadı.'),
          ),
        }),
        presentRule('PS_TH2', 'TH2', ['ev_sinyal_log'], {
          enabledWhen: flag('sinyal_cakisma'),
          score: { SORGULAMA: 200 },
          effects: [
            inc('pers', 1),
            raise('contra_h'),
            mark('GOOD', 'Üst yazı ile makine dökümü çelişiyor.', 'SORGULAMA'),
          ],
          responses: says(
            P('Üst yazı “arıza yok” diyor; döküm “uyarı bastırıldı” diyor. Hangisi doğru?'),
            L('hamdi', 'Döküm. Döküm yalan söylemez. Üst yazıyı müdürlük yazar.', 'uzgun'),
          ),
        }),
        presentRule('PS_TH3', 'TH3', ['ded_ariza'], {
          score: { SORGULAMA: 250 },
          effects: [
            inc('pers', 1),
            raise('contra_h'),
            mark(
              'GOOD',
              'İş emri kazadan dört gün önce açılmış, ertelenmiş; kart kazanın ertesi günü değişmiş: “rutin” değil.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P(
              'İş emri 4471: 10 Kasım’da açılmış, malzeme yok diye ertelenmiş. Kabindeki etiket: 15 Kasım. Bu rutin bakım mı?',
            ),
            L(
              'hamdi',
              'Değil. Rutin altı ayda bir. Bu arıza değişimiydi. Kazanın ertesi günü malzeme geldi. Ben taktım.',
              'uzgun',
            ),
          ),
        }),
        presentRule('PS_TH4', 'TH4', ['ev_sesli'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_h'),
            mark(
              'GOOD',
              'Maktulün 01.05’teki sesli mesajı: “Işıklar yine bozuk, yeşil yanıyor ama arabalar da geçiyor.”',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P('Sayın Başkan, katılanın savcılığa teslim ettiği sesli mesaj. 01.05. Kazadan altı dakika önce.'),
            {
              speaker: 'narrator',
              name: 'HATİCE DURMAZ',
              text: 'Serkan, oğlum… Işıklar yine bozuk. Yeşil yanıyor ama arabalar da geçiyor. Ben bekliyorum, sen merak etme.',
              style: 'phone',
            },
            fx(N('Salonda kimse kıpırdamadı. Serkan gözlerini kapadı. Volkan başını ellerinin arasına aldı.'), 'fade'),
            L(
              'hamdi',
              '“Yine” diyor. Yine. Demek ki daha önce de görmüş. Kimse şikâyet etmedi demiştim. Etmiş. Bir kadın etmiş, bir sesli mesajla.',
              'uzgun',
            ),
          ),
        }),
        presentRule('PS_TH4B', 'TH4', ['ev_sinyal_log'], {
          score: { SORGULAMA: 150 },
          effects: [
            inc('pers', 1),
            raise('contra_h'),
            mark('GOOD', '9 Kasım Beyaz Masa ihbarı: biri şikâyet etmiş.', 'SORGULAMA'),
          ],
          responses: says(
            P('9 Kasım, 19.40, Beyaz Masa: “yaya ve araç yeşili birlikte yanıyor.” Kimse şikâyet etmedi mi?'),
            L('hamdi', 'Etmiş. Ben o ihbar yüzünden gittim zaten.', 'uzgun'),
          ),
        }),
        pressRule('PR_TH4', 'TH4', {
          score: { SORGULAMA: 25 },
          responses: [
            when(
              flag('fact_hastane_isik'),
              P(
                'Kimse mi? Hatice Hanım’ın vardiya arkadaşları, kazadan bir hafta önce ondan bu kavşağın ışıklarının “delirdiğini” duymuş.',
              ),
              L('hamdi', 'Ben… ben bunu bilmiyordum. Ama şaşırmadım.', 'uzgun'),
            ),
            otherwise(
              P('Kimse şikâyet etmedi mi, yoksa siz mi duymadınız?'),
              L('hamdi', 'Ben duymadım. Benim kulağım makinede.'),
            ),
          ],
        }),
        objectRule('OB_TH4', 'TH4', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('legal_hits'),
            mark('GOOD', 'Tanık kimsenin şikâyet etmediğini bilemez; bu bir kanaat.', 'SORGULAMA'),
          ],
          responses: says(
            P('Sayın Başkan, tanık kimin şikâyet edip etmediğini bilemez; kanaatini aktarıyor.'),
            L('hakim', 'Tanık, bildiğinizi söyleyin.'),
          ),
        }),
      ],
      presentMiss: fallback('FB_T03_PRESENT', 'PRESENT', {
        effects: [
          ...wrongEvidence,
          score('SORGULAMA', -150, 'hatali'),
          mark('BAD', 'Bu delil teknisyenin ifadesiyle çelişmiyor.', 'SORGULAMA'),
        ],
        responses: says(L('hamdi', 'Bunu ben bilmem abla… avukat hanım.'), L('hakim', 'Müdafi, ilgisini göremiyorum.')),
      }),
      objectMiss: fallback('FB_T03_OBJECT', 'OBJECT', {
        effects: [dec('cred'), score('SORGULAMA', -50, 'hatali'), mark('BAD', 'Dayanaksız itiraz.', 'SORGULAMA')],
        responses: says(L('hakim', 'Reddedildi.')),
      }),
      finish: { id: 'T03_BITIR', next: 'T_04' },
    }),
    court2.stage('T_04', {
      title: 'Bilirkişi',
      courtStage: 'TANIK_DINLEME',
      witness: 'cengiz',
      witnessLabel: 'BİLİRKİŞİ · MÜH. CENGİZ ATEŞ',
      onFirstEnter: [
        { type: 'MEET', character: 'cengiz' },
        { type: 'MEET', character: 'nalan' },
      ],
      lines: [
        when(
          has('ev_heyet'),
          L('mubasir', 'Bilirkişi Cengiz Ateş!'),
          N(
            'Cengiz Ateş gri bir takım elbise, kırmızı bir kravat. Çantasını kürsüye koydu, açmadı. Dinleyici sırasında Doç. Dr. Nalan Güneş, bacak bacak üstüne, not defteri dizinde.',
          ),
          T(
            'İki bilirkişi aynı salonda. Biri kürsüde, biri dinleyicide. Biri rakamları savunacak, biri rakamların ne söylediğini biliyor.',
          ),
          L(
            'cengiz',
            'Otuz bir yıllık bilirkişiyim Sayın Başkan. Heyetin raporunu okudum. Saygı duyarım. Ama tecrübe başka şey söyler.',
          ),
        ),
        otherwise(
          L('mubasir', 'Bilirkişi Cengiz Ateş!'),
          N('Cengiz Ateş gri bir takım elbise, kırmızı bir kravat. Çantasını kürsüye koydu, açmadı.'),
          L('cengiz', 'Otuz bir yıllık bilirkişiyim Sayın Başkan. Raporumun arkasındayım. Tecrübeyle sabittir.'),
        ),
      ],
      choices: [cont('T04_DEVAM', 'Bilirkişiyi sorgula', 'T_05')],
    }),
    court2.testimony('T_05', {
      title: 'Bilirkişinin sorgusu',
      courtStage: 'TANIK_DINLEME',
      witness: 'cengiz',
      witnessLabel: 'BİLİRKİŞİ · MÜH. CENGİZ ATEŞ',
      say: [L('hakim', 'Bilirkişi raporunu özetledi. Müdafi, sorularınız?')],
      rulesText:
        'Bilirkişinin her cümlesinin bir dayanağı olmalı. Dayanağı yoksa göster; hukuki nitelendirme yapıyorsa itiraz et.',
      objectionGrounds: ['g_yorum', 'g_kanaat'],
      statements: [
        statement('C1', 1, [
          'Sanık kırmızı ışıkta geçmiştir; ',
          hl('bu, bilinçli taksirdir', any(flag('press_c1'), flag('rapor_yorum'))),
          '.',
        ]),
        statement('C2', 2, [
          hl('18 metrelik fren izi 68 km/s', any(has('ded_fren'), has('ev_edr'), flag('rapor_iz'))),
          ' hıza karşılık gelir.',
        ]),
        statement('C3', 3, [
          'Olay yerinde ',
          hl('başka bir araca ait iz yoktur', any(flag('press_c3'), has('ded_cam'), flag('rapor_cam'))),
          '.',
        ]),
        statement('C4', 4, [
          'Araç yayaya ',
          hl('sağ ön köşesiyle', any(flag('rapor_kopya'), has('ded_yukseklik'))),
          ' çarpmıştır.',
        ]),
      ],
      rules: [
        penalty('PS_T5_SAVCILIK', 'hakim'),
        presentRule('PS_GARAJ', undefined, ['ev_garaj'], {
          effects: [
            raise('garaj_sunuldu'),
            dec('cred'),
            dec('pers', 1),
            score('SORGULAMA', -100, 'hatali'),
            mark(
              'BAD',
              'İzinsiz girilen işyerinde çekilen fotoğraf hukuka aykırı delildir; hükme esas alınamaz (CMK 206/2-a, 217/2).',
              'SORGULAMA',
            ),
          ],
          responses: says(
            L(
              'savci',
              'Sayın Başkan, bu fotoğraflar nasıl elde edildi? Hakkında şikâyet dilekçesi bulunan bir işyerinde mi?',
            ),
            L(
              'hakim',
              'Fotoğraflar hukuka aykırı yoldan elde edildiğinden delil olarak değerlendirilmeyecek. Müdafi hakkında ayrıca suç duyurusunda bulunulmasına.',
            ),
          ),
        }),
        pressRule('PR_C1', 'C1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_c1')],
          responses: says(
            P('Işığın kırmızı olduğunu nasıl tespit ettiniz?'),
            L('cengiz', 'Kavşağın sinyal planı belli. O saatte o fazda o yön kırmızıdır. Mühendislik budur.'),
            P('Planı mı okudunuz, kaydı mı?'),
            L('cengiz', 'Plan kayıttır hanımefendi.'),
          ),
        }),
        objectRule('OB_C1', 'C1', 'g_yorum', {
          score: { USUL_BILGISI: 100 },
          effects: [
            inc('pers', 1),
            inc('legal_hits'),
            raise('yorum_itiraz'),
            mark(
              'GOOD',
              'Bilirkişi hukuki nitelendirme yapamaz (CMK 67/3); “bilinçli taksir” mahkemenin değerlendirmesidir.',
              'USUL_BILGISI',
            ),
          ],
          responses: says(
            P(
              'Sayın Başkan, “bilinçli taksir” bir hukuki nitelendirmedir. Bilirkişi teknik konular dışında açıklama yapamaz (CMK 67/3).',
            ),
            L('hakim', 'Yerinde. Bilirkişi, hukuki nitelendirmeyi mahkemeye bırakın.'),
            L('cengiz', 'Ben… tabii. Teknik olarak söyledim.', 'saskin'),
          ),
        }),
        presentRule('PS_C1', 'C1', ['ev_sinyal_log', 'ev_heyet', 'ded_ariza', 'ev_sesli'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_c1'),
            mark('GOOD', 'Planı değil kaydı esas almak gerekirdi: kavşak o gece arızalıydı.', 'SORGULAMA'),
          ],
          responses: says(
            P(
              'Bilirkişi bey, plan değil kayıt: o gece 00.58’de denetleyici yeniden başlamış ve “çatışan yeşil” uyarısı bastırılmış. Bunu incelediniz mi?',
            ),
            L('cengiz', 'Bu kayıt bana gönderilmedi.', 'saskin'),
            P('İstediniz mi?'),
            L('cengiz', '…İstemedim. Gerek görmedim.', 'uzgun'),
            N('Dinleyici sırasında Doç. Dr. Güneş not defterine bir şey yazdı ve defteri kapattı.'),
          ),
        }),
        pressRule('PR_C2', 'C2', {
          score: { SORGULAMA: 25 },
          responses: says(
            P('O iz sanığın aracına mı ait?'),
            L('cengiz', 'Olay yerinde sanığın aracı vardı. İz de vardı. Mühendislik budur.'),
          ),
        }),
        presentRule('PS_C2', 'C2', ['ded_fren', 'ev_edr'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_c2'),
            mark(
              'GOOD',
              'ABS’li araç kilit izi bırakmaz; EDR 38 km/s gösteriyor. Raporun hız hesabı yanlış araca dayanıyor.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P('Sanığın aracı ABS’li. ABS’li bir araç 18 metre kesintisiz kilit izi bırakır mı?'),
            L('cengiz', 'Bırakmaz. Normal şartlarda… bırakmaz.', 'saskin'),
            P(
              'Aracın olay veri kaydedicisi: temastan önceki beş saniyede 38–39 km/s. Fren temastan 1,2 saniye önce, ABS aktif.',
            ),
            L('cengiz', 'O hâlde iz… iz başka bir araca ait olmalı. Ben… dosyada başka araç yoktu.', 'uzgun'),
            P('Dosyada başka araç olmaması, kavşakta başka araç olmadığı anlamına mı geliyor?'),
            L('cengiz', 'Hayır.', 'uzgun'),
            N('Cengiz Ateş çantasını açtı, kapattı. Dinleyici sırasında Doç. Dr. Güneş bir şey yazdı.'),
          ),
        }),
        pressRule('PR_C3', 'C3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_c3')],
          responses: says(
            P('Tutanakta geçidin 9 metre ilerisinde far camı kırıkları var. Raporda neden yok?'),
            L('cengiz', 'Eski bir kazanın kalıntısı olabilir. Kavşaklarda hep cam olur.'),
          ),
        }),
        presentRule('PS_C3', 'C3', ['ded_cam', 'ev_far_parca', 'ev_tutanak'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 1),
            raise('contra_c3'),
            ifThen(has('ev_far_parca'), [inc('pers', 1)]),
            mark('GOOD', 'Sanığın farları sağlam; olay yerindeki far camı başka bir araçtan.', 'SORGULAMA'),
          ],
          responses: [
            when(
              has('ev_far_parca'),
              P(
                'Polis memurunun tutanakla savcılığa teslim ettiği parça: 2006–2010 model bir hafif ticari aracın sağ ön far camı. Sanığın farları sağlam.',
              ),
              L('cengiz', 'Bu parçayı görmedim.', 'saskin'),
              P('Tutanağı okudunuz mu?'),
              L('cengiz', 'Okudum. Cam yazıyordu. Ben… önemsemedim.', 'uzgun'),
            ),
            otherwise(
              P('Tutanak: sanığın aracında farlar sağlam. Geçidin ilerisinde far camı. Bu cam hangi aracın?'),
              L('cengiz', 'Sanığın değil. Bunu kabul ederim. Kimin olduğunu bilemem.', 'uzgun'),
              T('“Bilemem.” Bir bilirkişinin ağzından en dürüst kelime. Raporunda olmayan kelime.'),
            ),
          ],
        }),
        presentRule('PS_C3B', 'C3', ['ev_boya', 'ded_saat', 'ev_bufe', 'ded_arac'], {
          score: { SORGULAMA: 150 },
          effects: [
            inc('pers', 1),
            mark(
              'GOOD',
              'Kısmi: o gece başka bir aracın varlığına işaret ediyor; bilirkişinin “iz yoktur” cümlesini zayıflatıyor.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P(
              'Maktulün montunda koyu yeşil boya; kamerada yedi saniye önce geçen koyu bir araç. Başka araç izi yok mu?',
            ),
            L('cengiz', 'Bunlar benim incelemem dışında kaldı. Bana gönderilmedi.'),
          ),
        }),
        pressRule('PR_C4', 'C4', {
          score: { SORGULAMA: 25 },
          responses: says(
            P('Sağ ön köşe mi?'),
            L('cengiz', 'Sağ ön… ön. Ön kısmıyla. Sol ya da sağ, ayrıntı.', 'saskin'),
          ),
        }),
        presentRule('PS_C4', 'C4', ['ded_yukseklik', 'ev_savcilik', 'ev_atk', 'ded_olum'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_c4'),
            mark(
              'GOOD',
              'Ayaktaki yayaya ilk darbe 56 cm’de, yüksek tamponlu bir araçtan; sanığın tamponu 44 cm, hasarı sol altta.',
              'SORGULAMA',
            ),
          ],
          responses: [
            when(
              has('ev_savcilik'),
              P(
                'Sağ ön köşe. Haklısınız aslında, bilirkişi bey. Sağ ön köşesiyle çarpan bir araç var. Altın Başak Fırını’nın panelvanı. Ertesi gün sağ ön köşesi onarılmış.',
              ),
              L(
                'cengiz',
                '…O cümleyi ben başka bir dosyadan… yani, kalıp bir cümle. Sanığın aracında hasar sol önde.',
                'uzgun',
              ),
              fx(
                N('Dinleyici sırasından biri güldü; acı bir gülüş. Hâkim başını kaldırdı, kimse gülmedi bir daha.'),
                'shake',
              ),
            ),
            otherwise(
              P(
                'Otopsi: tibia kırığı topuktan 56 cm. Sanığın tamponu yerden 44 cm, hasarı sol alt kenarda. 44 santimlik bir tampon 56 santimde kırık oluşturur mu?',
              ),
              L('cengiz', 'Oluşturmaz. Ayakta bir insanda… oluşturmaz.', 'uzgun'),
              P('O hâlde ilk darbeyi yapan araç sanığın aracı değil.'),
              L('cengiz', 'Bunu Adli Tıp söyler. Ben söyleyemem. Ama… teknik olarak, oluşturmaz.', 'uzgun'),
            ),
          ],
        }),
        presentRule('PS_C4B', 'C4', ['ev_otopsi', 'ev_edr'], {
          score: { SORGULAMA: 100 },
          effects: [inc('pers', 1), mark('GOOD', 'Kısmi: raporun çarpma tarifi belgelerle uyuşmuyor.', 'SORGULAMA')],
          responses: says(
            P('Bu belgeyle sizin “sağ ön köşe” tarifiniz uyuşuyor mu?'),
            L('cengiz', 'Tam uyuşmuyor. Ama sonuç değişmez.'),
          ),
        }),
        objectRule('OB_C3', 'C3', 'g_kanaat', {
          enabledWhen: flag('press_c3'),
          score: { SORGULAMA: 50 },
          effects: [inc('legal_hits'), mark('GOOD', '“Olabilir” bir teknik tespit değil, bir tahmin.', 'SORGULAMA')],
          responses: says(
            P('Sayın Başkan, “eski bir kaza olabilir” bir tespit değil, bir tahmin.'),
            L('hakim', 'Not edildi. Bilirkişi, tespitlerinizle sınırlı kalın.'),
          ),
        }),
      ],
      presentMiss: fallback('FB_T05_PRESENT', 'PRESENT', {
        effects: [
          ...wrongEvidence,
          score('SORGULAMA', -150, 'hatali'),
          mark('BAD', 'Bu delil bilirkişinin bu cümlesini çürütmüyor.', 'SORGULAMA'),
        ],
        responses: says(
          L('cengiz', 'Bunun konuyla ilgisi yok Sayın Başkan.'),
          L('hakim', 'Katılıyorum. Devam edin müdafi.'),
        ),
      }),
      objectMiss: fallback('FB_T05_OBJECT', 'OBJECT', {
        effects: [
          dec('cred'),
          score('SORGULAMA', -50, 'hatali'),
          mark('BAD', 'Dayanaksız itiraz: bilirkişi burada teknik bir tespit aktarıyor.', 'SORGULAMA'),
        ],
        responses: says(L('hakim', 'Reddedildi. Bu teknik bir tespit.')),
      }),
      finish: { id: 'T05_BITIR', next: 'T_05D' },
    }),
    decisionNode('T_05D', [{ when: has('ev_heyet'), to: 'T_05N' }, { to: 'T_06' }], { ...TRIAL }),
    choiceNode('T_05N', {
      ...court2.base,
      title: 'Heyet başkanı',
      background: 'durusma_salonu',
      onFirstEnter: [{ type: 'MEET', character: 'nalan' }],
      prompt: L(
        'hakim',
        'Heyet başkanı Doç. Dr. Nalan Güneş açıklamalarda bulunmak üzere dinlendi. Müdafi, sorunuz var mı?',
      ),
      choices: [
        option('NQ_ISIK', '“Işık konusundaki tespitinizin dayanağı nedir?”', {
          score: { SORGULAMA: 30 },
          responses: says(
            L(
              'nalan',
              'Denetleyicinin olay günlüğü. 00.58’de yeniden başlatma, 00.58.40’ta çatışma uyarısı ve bastırılması. Bu, taşıt ve yaya yeşilinin birlikte yanabileceği bir durum.',
            ),
            L(
              'nalan',
              'Bir sinyal planı, bir makinenin ne yapması gerektiğini söyler. Günlük, ne yaptığını söyler. Biz ikincisine baktık.',
            ),
          ),
        }),
        option('NQ_KUSUR', '“Raporunuzdaki ‘tali kusur’ değerlendirmesi hangi veriye dayanıyor?”', {
          score: { SORGULAMA: 30 },
          effects: [ifThen(flag('contra_heyet'), [inc('pers', 1), score('SORGULAMA', 70)])],
          responses: [
            when(
              flag('contra_heyet'),
              P(
                'EDR 38 km/s gösteriyor; fren temastan 1,2 saniye önce. “Hızını yeterince azaltmamıştır” cümlesi hangi hızdan, hangi hesaba dayanıyor?',
              ),
              N('Nalan Güneş not defterini açtı, kapattı.'),
              L(
                'nalan',
                'Raporu yazarken EDR verisi heyete ulaşmamıştı. Bu veriyle birlikte değerlendirildiğinde o paragrafı sürdüremeyiz. Islak zemin ve gece genel bir özen gerektirir; ama veri bir özensizlik göstermiyor.',
              ),
              L('nalan', 'Bunu söylemek kolay değil. Ama veri bunu söylüyor, fazlasını değil.'),
              T(
                'Bir bilirkişinin kendi raporundan geri adım atması. Leyla bunu otuz yılda üç kez gördüğünü söylemişti. Dördüncüsü bugün.',
              ),
            ),
            otherwise(
              L(
                'nalan',
                'Yağışlı havada, gece, yaya geçidine yaklaşan bir sürücüden beklenen genel özen. Sayısal bir hesaba değil, mesleki deneyime dayanıyor.',
              ),
              T(
                'Mesleki deneyim. Cengiz Ateş’in “tecrübe”sinin daha kibar bir hâli. Ama elimde onu sınayacak bir veri yok.',
              ),
            ),
          ],
        }),
        option('NQ_ILK', '“İlk temasın hangi araçla olduğu konusunda heyet ne düşünüyor?”', {
          score: { SORGULAMA: 20 },
          responses: says(
            L(
              'nalan',
              'Yaralanma mekanizması Adli Tıp’ın alanı. Biz yalnızca şunu söyleyebiliriz: sanığın aracındaki hasarın yüksekliği ve konumu, ayaktaki bir yetişkine önden çarpmayla uyumlu değil.',
            ),
          ),
        }),
        option('NQ_TAKDIR', '“Sizce sanık bu ölümden sorumlu mu?”', {
          score: { SORGULAMA: -40 },
          effects: [dec('pers', 1)],
          bad: 'Bilirkişiye hukuki değerlendirme sorulamaz (CMK 67/3); bu soru heyetin değil mahkemenin işidir.',
          responses: says(
            L('nalan', 'Bu soruyu cevaplamam. Cevaplarsam raporumun değeri kalmaz.'),
            L('hakim', 'Müdafi, bilirkişiye hukuki soru yöneltmeyin.'),
          ),
        }),
        cont('T05N_BITIR', 'Sorularım bu kadar', 'T_06'),
      ],
    }),
    choiceNode('T_06', {
      ...court2.base,
      title: 'Tanık: polis memuru',
      background: 'durusma_salonu',
      prompt: L(
        'hakim',
        'Tanık Ayten Yurt yemin ederek dinlendi; tutanağın arkasında olduğunu söyledi. Müdafi, sorularınız?',
      ),
      choices: [
        option('AT_CAM', '“Geçidin ilerisindeki far camı kırıklarını anlatır mısınız?”', {
          score: { SORGULAMA: 40 },
          effects: [ifThen(flag('ayten_teslim'), [inc('pers', 1)])],
          responses: [
            when(
              flag('ayten_teslim'),
              L(
                'ayten',
                'Fotoğrafladım, tutanağa yazdım. Emanete alınmadı. Bir parçasını ben sakladım ve geçen hafta tutanakla savcılığa teslim ettim. Saklamam usule uygun değildi; teslimim uygundu.',
              ),
              L('hakim', 'Neden sakladınız?'),
              L('ayten', 'Biri sorar diye efendim. Sordular.'),
            ),
            when(
              flag('ayten_kayip'),
              L('ayten', 'Fotoğrafladım, tutanağa yazdım. Emanete alınmadı. Başka bir şey söyleyemem.'),
              T('Bir parça bir dolabın dibinde kaldı. Benim yüzümden.'),
            ),
            otherwise(
              L(
                'ayten',
                'Fotoğrafladım, tutanağa yazdım. Emanete alınmadı; ekip amiri eski bir kaza kalıntısı olabileceğini değerlendirdi.',
              ),
            ),
          ],
        }),
        option('AT_IZ', '“Fren izinin hangi araca ait olduğunu tespit ettiniz mi?”', {
          score: { SORGULAMA: 30 },
          responses: says(
            L('ayten', 'Hayır. İz ölçüldü. Hangi araca ait olduğu tespit edilmedi. Tutanakta da öyle yazar.'),
          ),
        }),
        option('AT_AMIR', '“Amiriniz delili neden emanete almadı? Bir şey mi saklıyordu?”', {
          score: { SORGULAMA: -30 },
          effects: [dec('pers', 1)],
          bad: 'Tanığı kendi amirine karşı konuşmaya zorlamak bilgi değil savunma refleksi getirir; ima ile suçlama da hâkimi rahatsız eder.',
          responses: says(
            L('ayten', 'Amirim hakkında bir şey söylemem doğru olmaz. Tutanağım ortada.'),
            L('hakim', 'Müdafi, tanığa olay hakkında soru sorun.'),
          ),
        }),
        cont('T06_BITIR', 'Sorularım bu kadar', 'T_07'),
      ],
    }),
    choiceNode('T_07', {
      ...court2.base,
      title: 'Delillerin tartışılması',
      background: 'durusma_salonu',
      prompt: L('hakim', 'Raporlar ve tanık beyanları hakkında diyeceklerinizi alayım. Müdafi?'),
      choices: [
        option(
          'ARG_EDR',
          'EDR: 38 km/s, fren 1,2 sn önce, ABS aktif. Hız ve özensizlik iddiası çürük; bilinçli taksirin öngörü unsuru yok.',
          {
            enabledWhen: has('ev_edr'),
            lockedReason: 'EDR raporu dosyada yok.',
            score: { HUKUKI_BILGI: 100 },
            effects: [raise('arg_edr'), inc('pers', 1)],
            good: 'Bilinçli taksir neticenin öngörülmesini ister (TCK 22/3); sınırın altında hız ve normal tepki süresi bu öngörüyü kurmaz.',
            responses: says(
              P(
                'Sayın Başkan, sanığın aracı 38 km/s ile gidiyordu; şehir içi sınırın çok altında. Engeli görünce 1,2 saniyede frene bastı.',
              ),
              P(
                'Altmış sekiz kilometre bir izden, yanlış bir araçtan hesaplanmış. Bilinçli taksirin “öngördüğü hâlde devam etme” unsuru bu verilerle kurulamaz.',
              ),
              L(
                'savci',
                'Sayın Başkan, EDR verisi bilirkişice okunmuştur; savcılık olarak verinin doğruluğuna itirazımız yoktur.',
              ),
              T('Savcı “itirazımız yoktur” dedi. Bir savcının “haklısınız” demesinin resmî hâli.'),
            ),
          },
        ),
        option(
          'ARG_ATK',
          'ATK: ölüme yol açan travma birincil çarpmada; sanığın teması ikincil. İlliyet bağı kurulamıyor.',
          {
            enabledWhen: has('ev_atk'),
            lockedReason: 'ATK raporu dosyada yok.',
            effects: [
              ifThen(
                has('ded_olum'),
                [
                  score('HUKUKI_BILGI', 150),
                  raise('arg_atk'),
                  inc('pers', 1),
                  mark(
                    'GOOD',
                    'Taksirli suçta netice faile ancak davranışı ile netice arasında illiyet bağı varsa yüklenebilir; ölümcül travma ilk çarpmada.',
                    'HUKUKI_BILGI',
                  ),
                ],
                [
                  score('HUKUKI_BILGI', 30),
                  mark(
                    'NEUTRAL',
                    'Rapor okunmuş ama ölümcül yaralanma ile sanığın teması arasındaki bağ tahtada kurulmamış; argüman yarım kaldı.',
                  ),
                ],
              ),
            ],
            responses: [
              when(
                has('ded_olum'),
                P(
                  'Adli Tıp: kafa travması ve 56 santimdeki kırık, ayakta duran yayaya yüksek tamponlu bir aracın birincil çarpmasıyla uyumlu. Sırttaki az kanamalı sıyrıklar ikincil temas.',
                ),
                P(
                  'Sanığın aracı oradaydı. Hatice Hanım’a dokundu. Ama onu öldüren darbe o değildi. Bir sonucun faile yüklenebilmesi için o sonuca onun davranışının yol açtığı gösterilmelidir.',
                ),
                L('savci', 'Not ediyorum Sayın Başkan.'),
              ),
              otherwise(
                P('Adli Tıp raporu yaralanmaların birden fazla temastan kaynaklandığını gösteriyor.'),
                L('hakim', 'Hangisinin ölüme yol açtığını söylüyor musunuz, müdafi?'),
                P('…Rapor bunu değerlendiriyor, Sayın Başkan.'),
              ),
            ],
          },
        ),
        option('ARG_HEYET', 'Heyetin “tali kusur” paragrafı hiçbir veriye dayanmıyor.', {
          enabledWhen: has('ev_heyet'),
          lockedReason: 'Heyet raporu dosyada yok.',
          effects: [
            ifThen(
              flag('contra_heyet'),
              [
                score('DELIL_ANALIZI', 100),
                raise('arg_heyet'),
                inc('pers', 1),
                mark(
                  'GOOD',
                  'Heyetin kusur paragrafı EDR verisiyle çelişiyor; bilirkişi görüşü gerekçesiyle denetlenir (CMK 217/1).',
                  'DELIL_ANALIZI',
                ),
              ],
              [
                score('DELIL_ANALIZI', -30),
                mark(
                  'BAD',
                  'Heyet raporunun hangi verisine itiraz ettiğini göstermeden yapılan itiraz boşlukta kalır.',
                  'DELIL_ANALIZI',
                ),
              ],
            ),
          ],
          responses: [
            when(
              flag('contra_heyet'),
              P(
                'Heyet “sürücü hızını yeterince azaltmamıştır” diyor. Hangi hızdan? EDR 38 km/s gösteriyor. Rapor bu cümleye hiçbir hesap, hiçbir veri bağlamamış.',
              ),
              N('Dinleyici sırasında Doç. Dr. Güneş hafifçe başını salladı. Kendi raporuna. Hayır anlamında değil.'),
            ),
            otherwise(
              P('Heyetin kusur değerlendirmesine katılmıyoruz.'),
              L('hakim', 'Gerekçeniz?'),
              P('…Saklı tutuyoruz.'),
            ),
          ],
        }),
        option('ARG_DUYGU', 'Sanık iyi bir insan; bir haftalık bir kızı var.', {
          score: { SAVUNMA_STRATEJISI: -30 },
          effects: [dec('pers', 1)],
          bad: 'Kişisel koşullar delil tartışmasının değil, olsa olsa ceza takdirinin konusudur (TCK 62).',
          responses: says(
            L('vekil', 'Annemin… pardon, müvekkilimin annesinin de bir oğlu vardı Sayın Başkan.'),
            L('hakim', 'Delile dönelim, müdafi.'),
          ),
        }),
        cont('T07_BITIR', 'Diyeceklerimiz bu kadar', 'T_08'),
      ],
    }),
    court2.objection('T_08', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      onFirstEnter: [
        ifThen(
          mutalaaBeraat,
          [raise('mutalaa_beraat'), inc('pers', 1)],
          [ifThen(mutalaaBasit, [raise('mutalaa_basit')])],
        ),
      ],
      lines: [
        when(
          mutalaaBeraat,
          L('hakim', 'Esas hakkındaki mütalaanız, Sayın Savcı?'),
          L(
            'savci',
            'Sayın Başkan. Dosyaya giren Adli Tıp raporu, savcılık yazısı ve çapraz sorgularla birlikte, ölüme yol açan çarpmanın başka bir araca ait olduğu anlaşılmıştır.',
          ),
          L(
            'savci',
            'Sanığın aracının teması ikincildir ve ölümle illiyet bağı kurulamamıştır. Sanığın atılı suçu işlemediği anlaşıldığından CMK 223/2-b uyarınca beraatine karar verilmesini talep ederim.',
          ),
          fx(
            N('Serkan’ın vekili ayağa kalktı, bir şey söyleyecekti; Serkan kolunu tuttu ve başını iki yana salladı.'),
            'shake',
          ),
          L('hakim', 'Müdafi, mütalaaya karşı diyeceğiniz?'),
        ),
        when(
          mutalaaBasit,
          L('hakim', 'Esas hakkındaki mütalaanız, Sayın Savcı?'),
          L(
            'savci',
            'Sayın Başkan. Kırmızı ışık ve hız iddiaları duruşmada desteklenmemiştir; bilinçli taksir unsurları oluşmamıştır.',
          ),
          L(
            'savci',
            'Ancak sanık yağışlı havada yaya geçidine yaklaşırken gerekli özeni göstermemiştir. Sanığın TCK 85/1 uyarınca, basit taksirle, kusuru oranında cezalandırılmasını talep ederim.',
          ),
          L('hakim', 'Müdafi, mütalaaya karşı diyeceğiniz?'),
        ),
        otherwise(
          L('hakim', 'Esas hakkındaki mütalaanız, Sayın Savcı?'),
          L(
            'savci',
            'Sayın Başkan. Sanık kırmızı ışıkta, hızlı ve dikkati dağılmış biçimde kavşağa girmiş, neticeyi öngördüğü hâlde devam etmiştir.',
          ),
          L('savci', 'Sanığın TCK 85/1 ve 22/3 uyarınca bilinçli taksirle cezalandırılmasını talep ederim.'),
          L('hakim', 'Müdafi, mütalaaya karşı diyeceğiniz?'),
        ),
      ],
      next: 'T_09P',
      options: [
        option('M_ILLIYET', 'Cevap: ölümcül darbe başka bir araca ait; illiyet bağı yok (CMK 216/2).', {
          effects: [
            ifThen(
              all(has('ded_olum'), ref('ikinci_arac')),
              [
                score('USUL_BILGISI', 100),
                inc('legal_hits'),
                inc('pers', 1),
                mark('GOOD', 'Mütalaaya cevap hakkı (CMK 216/2) delile dayanarak kullanıldı.', 'USUL_BILGISI'),
              ],
              [
                score('USUL_BILGISI', -40),
                mark('BAD', 'İlliyet iddiası ispatlanmamış dayanaklara kuruldu; cevap boşlukta kaldı.', 'USUL_BILGISI'),
              ],
            ),
          ],
          responses: says(
            P(
              'Sayın Başkan, savcılığın da kabul ettiği gibi ya da etmediği hâlde: dosyadaki deliller ölümcül çarpmanın sanığın aracından gelmediğini göstermektedir.',
            ),
          ),
        }),
        option('M_KUSUR', 'Cevap: kırmızı ışık, hız ve telefon iddiaları çöktü; kusur ispatlanmadı (CMK 216/2).', {
          effects: [
            ifThen(
              ref('kusur_yok'),
              [
                score('USUL_BILGISI', 100),
                inc('legal_hits'),
                inc('pers', 1),
                mark(
                  'GOOD',
                  'Mütalaaya cevap hakkı (CMK 216/2) kürsüde çöken iddialara dayanarak kullanıldı.',
                  'USUL_BILGISI',
                ),
              ],
              [
                score('USUL_BILGISI', -40),
                mark('BAD', 'Kırmızı ışık iddiası kürsüde çürütülmeden “çöktü” denemez.', 'USUL_BILGISI'),
              ],
            ),
          ],
          responses: says(
            P(
              'Sayın Başkan, iddianamenin üç ayağı vardı: kırmızı ışık, hız, telefon. Üçü de bu salonda tek tek yıkıldı.',
            ),
          ),
        }),
        option('M_BASIT', 'Cevap: en azından bilinçli taksir yok; basit taksir ve TCK 50/4 talep ediyoruz.', {
          score: { HUKUKI_BILGI: 60 },
          effects: [raise('arg_basit')],
          good: 'Bilinçli taksir yoksa taksirli suçtan verilen hapis cezası uzun süreli olsa da adli para cezasına çevrilebilir (TCK 50/4).',
          responses: says(
            P(
              'Sayın Başkan, hiçbir şey olmasa bile: bu dosyada bilinçli taksir yoktur. Mahkemeniz aksi kanaatteyse TCK 50/4’ün uygulanmasını talep ederiz.',
            ),
          ),
        }),
        option('M_CIKAR', 'Mütalaa tutanaktan çıkarılsın.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Mütalaa tutanaktan çıkarılamaz; çare cevap hakkıdır (CMK 216/2).',
          responses: says(L('hakim', 'Böyle bir usul yok müdafi. Cevabınız varsa verin.')),
        }),
      ],
    }),
    choiceNode('T_09P', {
      ...court2.base,
      title: 'Esas savunmanın dayanakları',
      background: 'durusma_salonu',
      hud: ['noktalar', 'pers'],
      prompt: T(
        'Esas savunmada en çok üç dayanak sayabilirim. Her biri bu salonda ispatlanmış olmalı; ispatlanmamış bir dayanak, ispatlanmış iki dayanağı da zayıflatır.',
      ),
      choices: [
        dayanak(
          'D_ISIK',
          'Kırmızı ışık yoktu: kavşak arızalıydı',
          ref('kusur_yok'),
          'Kavşak o gece arızalıydı; sanığa kırmızı ışık ihlali atfedilemez.',
        ),
        dayanak(
          'D_HIZ',
          'Hız 38 km/s; fren 1,2 sn önce',
          has('ev_edr'),
          'Sanık şehir içi sınırın çok altında gidiyordu ve normal sürede frene bastı.',
        ),
        dayanak(
          'D_IZ',
          'Fren izi başka bir aracın',
          has('ded_fren'),
          'On sekiz metrelik kilit izi ABS’li sanık aracından çıkamaz.',
        ),
        dayanak(
          'D_ILK',
          'İlk darbe başka bir araçtan',
          any(has('ded_yukseklik'), has('ded_saat')),
          'Ayaktaki yayaya ilk çarpan, daha yüksek tamponlu başka bir araçtı.',
        ),
        dayanak(
          'D_OLUM',
          'Ölümcül travma ilk darbeden',
          has('ded_olum'),
          'Ölüme yol açan travma birincil çarpmada; sanığın teması ikincil.',
        ),
        dayanak(
          'D_TEL',
          'Görüşme eller serbestti',
          any(flag('contra_n5'), has('ev_multimedya')),
          'Görüşme aracın hoparlöründen yapılıyordu; telefon sanığın elinde değildi.',
        ),
        option('D_PISMAN', 'Sanık pişman, iyi bir aile babası', {
          cost: [{ var: 'noktalar', amount: 1 }],
          score: { SAVUNMA_STRATEJISI: -40 },
          bad: 'Pişmanlık bir dayanak değil; ceza takdirinde (TCK 62) dikkate alınır, kusurun yokluğunu göstermez.',
          responses: says(L('savci', 'Pişmanlık kusuru kaldırmaz Sayın Başkan.')),
        }),
        cont('T09P_BITIR', 'Esas savunmaya geç', 'T_09'),
      ],
    }),
    choiceNode('T_09', {
      ...court2.base,
      title: 'Esas hakkında savunma',
      background: 'durusma_salonu',
      prompt: L('hakim', 'Müdafi, esas hakkındaki savunmanızı yapın.'),
      next: 'T_09R',
      choices: [
        option('T09_B', 'Ölüme yol açan başka bir araç: suç sanık tarafından işlenmedi (CMK 223/2-b).', {
          effects: [
            ifThen(
              all(has('ded_olum'), ref('ikinci_arac'), has('ev_savcilik'), not(flag('etik_garaj'))),
              eff(
                score('SAVUNMA_STRATEJISI', strategyAmount(200, 'MASUMIYET'), 'savunma'),
                inc('pers', 1),
                raise('gercek_neden'),
                mark(
                  'GOOD',
                  'Gerçek neden delillerle gösterildi: ölümcül çarpma başka bir araçtan, sanığın teması ikincil (CMK 223/2-b).',
                  'SAVUNMA_STRATEJISI',
                ),
              ),
              eff(
                score('SAVUNMA_STRATEJISI', -100, 'savunma'),
                dec('pers', 1),
                mark(
                  'BAD',
                  '“Başka bir araç yaptı” iddiası ispatlanmış bir zincire dayanmadı: ölümcül travma, ikinci araç ve o aracın tespiti birlikte gerekir.',
                  'SAVUNMA_STRATEJISI',
                ),
              ),
            ),
          ],
          responses: [
            when(
              not(all(has('ded_olum'), ref('ikinci_arac'), has('ev_savcilik'), not(flag('etik_garaj')))),
              P(
                'Sayın Başkan. Bu dosyada sanıktan başka birinin bu ölüme yol açtığını düşünüyoruz. Olay yerinde başka izler var.',
              ),
              L('hakim', 'Hangi araç, müdafi? Kim? Delil?'),
              P('…Dosyadaki izler başka bir araca işaret ediyor, Sayın Başkan.'),
              L('savci', 'İşaret etmek ispat değildir. Savunma bir hayaletle yargılanmak istiyor.'),
              T('Bir zincir kurmaya çalıştım; halkaların yarısı elimde değildi.'),
            ),
            otherwise(
              P(
                'Sayın Başkan. 14 Kasım gecesi Gökdere kavşağında iki araç vardı. Biri koyu yeşil bir panelvandı; yeşilde karşıya geçen Hatice Hanım’a çarptı ve kaçtı.',
              ),
              P(
                'Yedi saniye sonra sanığın aracı geldi; o da yeşildeydi, çünkü kavşak arızalıydı. Yerde yatan Hatice Hanım’ı son anda gördü, frene bastı ve ona dokundu. Durdu. Ambulans çağırdı. Montunu örttü.',
              ),
              P(
                'Sanık bir ölüme tanık oldu; bir ölüme yol açmadı. Suç sanık tarafından işlenmemiştir. CMK 223/2-b uyarınca beraatini talep ediyoruz.',
              ),
              P(
                'Ve Hatice Hanım’ın ailesine şunu söylemek istiyorum: o gece kırmızıda geçen biri vardı. Bu salonda değil. Adı artık bir dosyada.',
              ),
            ),
          ],
        }),
        option('T09_E', 'Kusur ve illiyet ispatlanamadı; şüpheden sanık yararlanır (CMK 223/2-e).', {
          effects: [
            ifThen(
              all(ref('kusur_yok'), ref('findings')),
              eff(
                score('SAVUNMA_STRATEJISI', strategyAmount(200, 'KUSUR'), 'savunma'),
                inc('pers', 1),
                raise('supheden'),
                mark(
                  'GOOD',
                  'İddianamenin dayanakları kürsüde çöktü; kalan şüphe sanık lehinedir (CMK 223/2-e; Anayasa 38/4).',
                  'SAVUNMA_STRATEJISI',
                ),
              ),
              eff(
                score('SAVUNMA_STRATEJISI', -100, 'savunma'),
                mark(
                  'BAD',
                  'Şüphe savunması kürsüde açılmış çelişkilere dayanmalı; yeterli çelişki ortaya konmadı.',
                  'SAVUNMA_STRATEJISI',
                ),
              ),
            ),
          ],
          responses: [
            when(
              not(all(ref('kusur_yok'), ref('findings'))),
              P('Sayın Başkan. Bu dosyada sanığın kusuru şüphelidir. Tanık emin değil, rapor eksik.'),
              L('hakim', 'Hangi çelişkiyi kastediyorsunuz müdafi? Duruşmada hangisini ortaya koydunuz?'),
              P('…Dosya bir bütün olarak değerlendirilmelidir, Sayın Başkan.'),
              T('Şüphe bir yer değil, bir zemin demek isterdim. Zemini kurmamıştım.'),
            ),
            otherwise(
              P(
                'Sayın Başkan. İddianame üç ayak üzerinde duruyordu: kırmızı ışık, hız, telefon. Kırmızı ışığı bir taksici kendi lambasından gördü; kavşak o gece arızalıydı.',
              ),
              P(
                'Hızı bir fren izinden hesapladılar; iz sanığın aracına ait değil. Telefon aracın hoparlöründeydi. Ve ölümcül darbenin sanığın aracından geldiği hiçbir delille gösterilmedi.',
              ),
              P(
                'Bir insanın ölümü bir dosyada yalnızca bir kişiye yüklenecekse, bunun şüpheye yer bırakmadan ispatlanması gerekir. Bu dosyada şüphe bir yer değil, bir zemin.',
              ),
              P('Şüpheden sanık yararlanır. CMK 223/2-e uyarınca beraatini talep ediyoruz.'),
            ),
          ],
        }),
        option('T09_T', 'Öncelikle beraat; aksi hâlde basit taksir, alt sınır ve TCK 50/4 (terditli).', {
          score: { SAVUNMA_STRATEJISI: strategyAmount(150, 'INDIRIM') },
          effects: [raise('arg_basit')],
          good: 'Terditli savunma meşrudur: asıl talep beraat, olmazsa bilinçli taksirin düşmesi, alt sınır ve TCK 50/4.',
          responses: says(
            P(
              'Sayın Başkan, öncelikle sanığın beraatini talep ediyoruz. Mahkemeniz aksi kanaatteyse: bu dosyada bilinçli taksir yoktur.',
            ),
            P(
              'Sanığın kusuru, varsa, hafiftir. Cezanın alt sınırdan belirlenmesini, TCK 62’nin ve TCK 50/4 uyarınca adli para cezasına çevrilmesinin uygulanmasını talep ediyoruz.',
            ),
          ),
        }),
        option('T09_D', 'Bir kadın öldü, ama müvekkilim de bu gecenin kurbanı.', {
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('pers', 1)],
          bad: 'Duygusal söylem delilin yerini tutmaz; katılanın acısının yanında “o da kurban” demek hâkimi savunmadan uzaklaştırır.',
          responses: says(
            P('Sayın Başkan, bir kadın öldü. Ama bu adam da o gece bir şey kaybetti…'),
            fx(L('serkan', 'Ne kaybetti? Ne kaybetti?', 'kizgin'), 'shake'),
            L('hakim', 'Katılan, lütfen. Müdafi, devam edin.'),
          ),
        }),
      ],
    }),
    story('T_09R', {
      ...court2.base,
      title: 'Cevaplar',
      background: 'durusma_salonu',
      lines: [
        when(
          any(flag('gercek_neden'), flag('supheden')),
          L('hakim', 'Sayın Savcı, savunmaya cevabınız?'),
          L(
            'savci',
            'Mütalaamızı tekrar ederiz Sayın Başkan. Ancak savunmanın ortaya koyduğu delilleri değerlendirmeyi mahkemenin takdirine bırakıyoruz.',
          ),
          T('“Takdirinize bırakıyoruz.” Savcılar teslim olmaz; takdire bırakır. Bu, bir savcının beyaz bayrağıdır.'),
          L('hakim', 'Katılan vekili?'),
          L(
            'vekil',
            'Sayın Başkan, bir anne öldü. Savunma bir hayaletle, bir “başka araç”la bizi oyalıyor. Sanığın cezalandırılmasını talep ederiz.',
          ),
          L('hakim', 'Katılan, sizin bir diyeceğiniz var mı?'),
          N('Serkan kalktı. Vekiline bakmadı. Bir süre kürsüye, sonra Volkan’a baktı.'),
          L('serkan', 'Annem yeşilde geçti. Bunu herkes artık biliyor. Bu adam da yeşilde geçmiş, öyle diyorlar.'),
          L(
            'serkan',
            'Ben ceza istiyorum. Ama kime verildiğini bilmek istiyorum. Yanlış adama verilen ceza annemi bir kere daha öldürür.',
          ),
          N('Oturdu. Vekili ona döndü, bir şey fısıldadı; Serkan başını iki yana salladı.'),
        ),
        otherwise(
          L('hakim', 'Sayın Savcı, savunmaya cevabınız?'),
          L('savci', 'Mütalaamızı tekrar ederiz Sayın Başkan.'),
          L('hakim', 'Katılan vekili?'),
          L(
            'vekil',
            'Sayın Başkan, bir anne yeşil ışıkta, yaya geçidinde öldü. Savunmanın söyledikleri bunu değiştirmiyor. Sanığın cezalandırılmasını talep ederiz.',
          ),
          L('hakim', 'Katılan, sizin bir diyeceğiniz var mı?'),
          L('serkan', 'Annem yeşilde geçti. Başka bir şey demeyeceğim.'),
          N('Oturdu. Çerçeveyi dizlerine koydu, annesinin yüzünü salona çevirdi.'),
        ),
      ],
      choices: [cont('T09R_DEVAM', 'Son söze geç', 'T_10')],
    }),
    choiceNode('T_10', {
      ...court2.base,
      title: 'Son söz',
      background: 'durusma_salonu',
      prompt: L('hakim', 'Sanık, ayağa kalkın. Son sözünüz?'),
      next: 'T_11',
      choices: [
        option(
          'SS_DOGRU',
          '“Hatice Hanım’ın oğlundan özür dilerim. Ben yeşilde geçtim. Bildiğim bu, bilmediğim de bu.”',
          {
            effects: [
              ifThen(
                any(flag('volkan_dogru'), flag('volkan_hazir')),
                [
                  score('SAVUNMA_STRATEJISI', 40, 'savunma'),
                  raise('son_soz_iyi'),
                  mark('GOOD', 'Kendi sözcükleriyle, dürüst ve ölçülü bir son söz.', 'SAVUNMA_STRATEJISI'),
                ],
                [score('SAVUNMA_STRATEJISI', 10, 'savunma')],
              ),
            ],
            responses: [
              when(
                any(flag('volkan_dogru'), flag('volkan_hazir')),
                L(
                  'volkan',
                  'Serkan Bey. Annenizin adını üç aydır her gece söylüyorum. Hatice. Özür dilerim. Orada olduğum için, yetişemediğim için.',
                ),
                L(
                  'volkan',
                  'Ben yeşilde geçtim. Bildiğim bu. Bir kızım var; bir hafta oldu. Ona bir gün bu geceyi anlatacağım. Doğrusunu anlatacağım. Ne karar verirseniz.',
                ),
                N(
                  'Salonun arka sırasında hastane önlüklü kadınlardan biri gözlerini sildi. Necati, dinleyici sırasında, kasketini dizine koydu.',
                ),
                N(
                  'Serkan başını kaldırdı. Uzun bir süre Volkan’a baktı. Sonra başını eğdi. Bir kabul mü, bir yorgunluk mu, bilinmez.',
                ),
              ),
              otherwise(
                L('volkan', 'Özür dilerim. Ben… yeşilde geçtim. Sanırım. Bildiğim bu.'),
                T('“Sanırım.” Doğru cümle, yanlış yerde bir kelime.'),
              ),
            ],
          },
        ),
        option('SS_KABUL', '“Ben öldürdüm. Ne ceza verirseniz razıyım.”', {
          score: { SAVUNMA_STRATEJISI: -40 },
          effects: [dec('pers', 1)],
          bad: 'Son sözde, delillerle çelişen bir ikrar: hâkim bunu sanığın kendi kanaati olarak tartar ve savunmanın kurduğu her şeyi zayıflatır.',
          responses: says(
            L('volkan', 'Ben öldürdüm. Hissettim. Ne ceza verirseniz razıyım.', 'uzgun'),
            N('Gül taşıyıcıyı göğsüne bastırdı. Bebek ağlamaya başladı. Mübaşir kapıyı açtı; Gül çıktı.'),
          ),
        }),
        option('SS_SUS', '“Söyleyecek bir şeyim yok.”', {
          neutral: 'Son söz hakkı kullanılmadı; aleyhe yorumlanmaz ama bir şey de katmaz.',
          responses: says(L('volkan', 'Söyleyecek bir şeyim yok efendim.'), N('Oturdu. Ellerine baktı.')),
        }),
      ],
    }),
    decisionNode('T_11', [{ to: 'R_KARAR' }], {
      ...TRIAL,
      lines: says(
        L('hakim', 'Duruşmaya ara verildi.'),
        N(
          'Kırk dakika. Koridorda kimse oturmadı. Serkan pencereden dışarı baktı, Volkan duvara, Gül bebeğe, ben saatime.',
        ),
        N(
          'Hastane önlüklü kadınlardan biri Serkan’a bir şişe su uzattı. Serkan aldı, açmadı. Gül bebeği emzirmek için boş bir odaya girdi; kapıyı aralık bıraktı.',
        ),
        T('Bir hüküm kırk dakikada yazılır, bir ömür boyu okunur. Bunu Leyla söylerdi. Bugün ilk kez anlıyorum.'),
        L('mubasir', 'Volkan Eren dosyası! Hüküm!'),
        L('hakim', 'Hüküm fıkrası ayakta dinlenir.'),
      ),
    }),
    story('T_COKUS', {
      ...court2.base,
      title: 'Çöküş',
      background: 'durusma_salonu',
      lines: says(
        L(
          'hakim',
          'Müdafi. Bugün sunduğunuz her şey ya ilgisiz çıktı ya da dayanaksız. Mahkemenin sabrı sınırsız değil.',
        ),
        L('hakim', 'Başka talebiniz yoksa dosya esas hakkında karara çıkacak. Sanık, kısaca son sözünüz?'),
        T('Kendi elimle yıktım. Taksici değil, bilirkişi değil. Ben.'),
      ),
      choices: [cont('COKUS_SON', 'Volkan: “Ben… yeşilde geçtim.”', 'T_11')],
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
  discoveryPaths: arrivals.discoveryPaths,
};
