import {
  P,
  all,
  any,
  atLeast,
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
  meet,
  met,
  not,
  objectRule,
  option,
  otherwise,
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
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, Cond, Effect } from '../../../tools/content/src/kit/index.js';
import { prosecutionPapers } from './hearing-1.js';
import { D, Nx, S, T, TRIAL, VERDICT, card, court2, fx, wrongEvidence } from './shared.js';

// 80-trial: 2. celse. Koridor, ara karar cevapları, özel rapor (itiraz), Onur'un çapraz sorgusu (O1–O5) ve kırılma,
// Ece (Tolga'nın sorusu, itiraz; yönlendirildiyse çöküş), video, tutanak ve kamera, mütalaa (üç varyant) ve cevap,
// esas savunmanın dayanakları, esas savunma, cevaplar, son söz, hüküm. Çöküş kesintisi (cred 0) → T_COKUS.

const arrivals = deliver('T_00G', [
  {
    evidence: 'ev_video',
    requires: flag('defne_video'),
    hint: 'Masa 7’deki müşteriye ulaş; videoyu mahkemeye göndermesini dürüstçe iste.',
  },
  { evidence: 'ev_kriminal', requires: flag('ara_kriminal'), hint: 'Kriminal incelemeyi ek dilekçeyle iste.' },
]);

const eceCalled: Cond = any(flag('req_ece'), flag('h1_ece'), flag('ara_ece'));
const onurKirilir: Cond = any(
  atLeast(3, flag('contra_o1'), flag('contra_o2'), flag('contra_o3'), flag('contra_o4'), flag('contra_o5')),
  all(
    flag('onur_vicdan'),
    atLeast(2, flag('contra_o1'), flag('contra_o2'), flag('contra_o3'), flag('contra_o4'), flag('contra_o5')),
  ),
);

/** Esas savunmanın dayanağı: ispatlanmışsa +40, değilse −40. */
const dayanak = (id: string, label: string, proven: Cond, okText: string) =>
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
            'Bu dayanak duruşmada ispatlanmadı; ispatlanmamış dayanak savunmanın tamamını zayıflatır.',
            'SAVUNMA_STRATEJISI',
          ),
        ],
      ),
    ],
    responses: [when(proven, P(okText)), otherwise(S('savci', 'Sayın Başkan, bu dosyada buna dair bir delil yok.'))],
    next: '$stay',
  });

const eff = (...e: Effect[]) => e;

export const trial: CasePart = {
  court: {
    sessions: [
      courtSession('cs_2', '2. Celse', [
        ['s2_acilis', 'ACILIS', 'T_00'],
        ['s2_delil1', 'DELIL_TARTISMA', 'T_01'],
        ['s2_tanik', 'TANIK_DINLEME', 'T_02V'],
        ['s2_delil2', 'DELIL_TARTISMA', 'T_04'],
        ['s2_mutalaa', 'MUTALAA', 'T_05R'],
        ['s2_savunma', 'SAVUNMA', 'T_06'],
        ['s2_son_soz', 'SON_SOZ', 'T_07'],
        ['s2_karar', 'KARAR', 'T_08'],
      ]),
    ],
  },
  nodes: [
    // --- Koridor ---
    story('T_00G', {
      ...TRIAL,
      title: 'Bir ay sonra',
      background: 'adliye',
      onEnter: arrivals.effects,
      lines: [
        when(
          eceCalled,
          card('BİR AY SONRA — BURSA ADLİYESİ, 3. KAT', 'adliye'),
          Nx(
            'Koridorun ucunda, pencerenin önünde Ece. Saçını kulağının arkasına atıyor, atıyor, atıyor. Elinde bir çağrı kâğıdı.',
          ),
          Nx(
            'Bora onu gördü. Yanına gitmedi. Başıyla selam verdi; Ece de. İki insan bir koridorun iki ucundan bir teşekkürü ertelediler.',
          ),
          Nx('Onur Kılıç bankın ucunda, tek başına. Serkan yanında değil; vekilinin yanında. İki adım değil, on adım.'),
          S('tolga', 'Meslektaşım! Bugün sizin için küçük bir sürprizim var. Bilimsel bir sürpriz.', 'mutlu'),
          T('Elinde mavi bir dosya. Leyla’nın dediği gibi: bir klinik, bir rapor, bir rakam.'),
        ),
        otherwise(
          card('BİR AY SONRA — BURSA ADLİYESİ, 3. KAT', 'adliye'),
          Nx('Bora bankta, kasketsiz. Saçları ıslak; yağmurda yürüyerek gelmiş.'),
          Nx('Onur Kılıç bankın ucunda, tek başına. Serkan yanında değil; vekilinin yanında. İki adım değil, on adım.'),
          S('tolga', 'Meslektaşım! Bugün sizin için küçük bir sürprizim var. Bilimsel bir sürpriz.', 'mutlu'),
          T('Elinde mavi bir dosya. Leyla’nın dediği gibi: bir klinik, bir rapor, bir rakam.'),
        ),
      ],
      choices: [cont('T00G_DEVAM', 'Salona gir', 'T_00G2', { role: 'PRIMARY' })],
    }),
    decisionNode('T_00G2', [{ to: 'T_00' }], {
      ...TRIAL,
      lines: [
        when(
          flag('fact_karsi_sorusturma'),
          T(
            'Serkan hakkında Bora’nın kolu için açılan soruşturma hâlâ savcılıkta. Tolga “takipsizlikle bitecek” demişti. Bugün bu salonda ne olursa, o dosyanın da kaderi olacak.',
          ),
          Nx('Tolga Şen cübbesini düzeltti. Mavi dosyayı kürsüye, herkesin görebileceği yere koydu.'),
        ),
        otherwise(
          T(
            'Tolga Şen’in mavi dosyası. Serkan’ın burnu. Onur’un kol saati. Bora’nın kasketsiz başı. Bir salonda dört nesne; biri bugün kırılacak.',
          ),
          Nx('Tolga Şen cübbesini düzeltti. Mavi dosyayı kürsüye, herkesin görebileceği yere koydu.'),
        ),
      ],
    }),
    court2.stage('T_00', {
      title: 'Duruşma · 2. Celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      lines: [
        when(
          all(has('ev_kriminal'), has('ev_eczane')),
          card('BURSA 7. ASLİYE CEZA MAHKEMESİ — 2. CELSE', 'durusma_salonu'),
          S('mubasir', 'Bora Yalçııın dosyasııı!'),
          S(
            'hakim',
            'Ara karar cevapları geldi: Adli Tıp kesin raporu, Kriminal Polis Laboratuvarı raporu, eczane kaydı ve bilirkişi notu. Okundu, taraflara verildi.',
          ),
          S('savci', 'Okuduk Sayın Başkan.'),
          Nx('Savcı “okuduk” derken Kriminal raporun ikinci sayfasını parmağıyla işaretli tutuyordu.'),
        ),
        when(
          any(has('ev_kriminal'), has('ev_eczane')),
          card('BURSA 7. ASLİYE CEZA MAHKEMESİ — 2. CELSE', 'durusma_salonu'),
          S('mubasir', 'Bora Yalçııın dosyasııı!'),
          S(
            'hakim',
            'Ara karar cevapları geldi: Adli Tıp kesin raporu ve istenen diğer kayıt. Okundu, taraflara verildi.',
          ),
          S('savci', 'Okuduk Sayın Başkan.'),
        ),
        otherwise(
          card('BURSA 7. ASLİYE CEZA MAHKEMESİ — 2. CELSE', 'durusma_salonu'),
          S('mubasir', 'Bora Yalçııın dosyasııı!'),
          S('hakim', 'Ara karar cevabı geldi: Adli Tıp kesin raporu. Okundu, taraflara verildi.'),
          S('savci', 'Okuduk Sayın Başkan.'),
        ),
      ],
      choices: [cont('T00_DEVAM', 'Devam', 'T_01')],
    }),

    // --- Özel rapor ---
    court2.objection('T_01', {
      title: 'Katılanın özel raporu',
      courtStage: 'DELIL_TARTISMA',
      prosecutionEvidence: 'ev_ozel_rapor',
      onFirstEnter: [{ type: 'DISCOVER', evidence: 'ev_ozel_rapor' }],
      say: [
        S(
          'tolga',
          'Sayın Başkan, katılanın özel bir klinikte yaptırdığı muayenenin raporunu sunuyoruz. Septum deviasyonu ve kırık: hayat fonksiyonlarına etkisi orta, yani üçüncü derece.',
        ),
        S(
          'tolga',
          'Adli Tıp raporu katılanı tek bir kez, olay gecesinin kayıtları üzerinden değerlendirmiştir. Biz canlı bir muayene sunuyoruz.',
        ),
        S('hakim', 'Müdafi, diyeceğiniz?'),
        T('Üçüncü derece. Kırığın cezaya etkisi birden üçe çıkarsa Bora’nın alt sınırı da çıkar. Bilimsel sürpriz bu.'),
      ],
      next: 'T_02V',
      options: [
        option('T01_A', 'Özel rapor uzman görüşüdür; resmî rapor esastır, çelişki varsa Adli Tıp üst kurulu', {
          score: { USUL_BILGISI: 150 },
          effects: [raise('ozel_rapor_red'), inc('legal_hits'), inc('pers')],
          good: 'Yerinde: taraflarca alınan rapor uzman mütalaası niteliğindedir (CMK 67/6), resmî bilirkişi raporunun yerine geçmez. İki ay sonraki muayene kırığın olayla ilişkisini göstermez; çelişki hâlinde mahkeme Adli Tıp Kurumu ilgili kuruluna başvurabilir (2659 s. ATK Kanunu).',
          responses: [
            when(
              has('clue_deplasman'),
              P(
                'Sayın Başkan, bu rapor bir uzman görüşüdür, bilirkişi raporu değildir. Muayene olaydan iki ay sonra yapılmış; septumun o arada ne yaşadığını bilmiyoruz.',
              ),
              P(
                'Acil servisin grafisi olay gecesi çekilmiş: “deplasmansız lineer kırık, septum normal.” Adli Tıp aynı sonuca varmış: septum intakt, birinci derece.',
              ),
              P(
                'Bir çelişki varsa, mahkemeniz Adli Tıp üst kuruluna gidebilir. Ama iki ay sonraki bir muayene olay gecesinin grafisini değiştiremez.',
              ),
              S('hakim', 'Özel rapor uzman görüşü olarak dosyada kalır; Adli Tıp kesin raporu esas alınacaktır.'),
              S('tolga', 'Tabii Sayın Başkan.', 'kizgin'),
              Nx('Mavi dosya kürsünün kenarında, kapağı kapalı. Kimse bir daha ona bakmadı.'),
              T('Tolga’nın “tabii”si bu sefer gülümsemesiz geldi.'),
            ),
            otherwise(
              P(
                'Sayın Başkan, bu rapor bir uzman görüşüdür, bilirkişi raporu değildir. Muayene olaydan iki ay sonra; kırığın olay gecesiyle ilişkisi hiç kurulmamış.',
              ),
              P('Resmî kurumun raporu birinci derece diyor. Mahkemeniz tereddüt ederse Adli Tıp üst kuruluna gidilir.'),
              S('hakim', 'Özel rapor uzman görüşü olarak dosyada kalır; Adli Tıp kesin raporu esas alınacaktır.'),
              S('tolga', 'Tabii Sayın Başkan.'),
            ),
          ],
        }),
        option('T01_B', 'Özel rapor hukuka aykırı delildir; dosyadan çıkarılsın', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Yanlış dayanak: tarafın uzman görüşü alması hukuka aykırı değildir (CMK 67/6). Sorun raporun hukuka uygunluğu değil, değeridir.',
          responses: says(
            P('Sayın Başkan, bu rapor hukuka aykırıdır, dosyadan çıkarılmalıdır.'),
            S(
              'hakim',
              'Neden hukuka aykırı, müdafi? Taraf uzman görüşü alabilir. Değerini ben takdir ederim. Talebiniz reddedildi.',
            ),
          ),
        }),
        option('T01_C', 'Rapor parayla alınmıştır; klinik hakkında suç duyurusunda bulunacağız', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Dayanaksız suçlama: somut bir sahtecilik delili olmadan “parayla alınmış” demek salonda yalnızca güvenilirlik kaybettirir; iftira riski de vardır (TCK 267).',
          responses: says(
            P('Bu rapor parayla alınmış bir rapordur!'),
            S('tolga', 'Sayın Başkan, meslektaşımın bu sözünü tutanağa geçirmenizi rica ediyorum.'),
            S('hakim', 'Geçti. Müdafi, delilinizle konuşun.'),
          ),
        }),
        option('T01_D', 'Diyeceğimiz yok', {
          effects: [raise('ozel_kabul'), dec('pers')],
          neutral:
            'İtiraz edilmedi: mahkeme iki rapor arasında takdir yapacak; özel rapor “üçüncü derece” diyerek cezayı yukarı çekebilir.',
          responses: says(S('hakim', 'Tutanağa geçti.'), T('Bir rakam tutanağa girdi ve kimse ona dokunmadı. Ben de.')),
        }),
      ],
    }),

    // --- Onur ---
    court2.stage('T_02V', {
      title: 'Tanık',
      courtStage: 'TANIK_DINLEME',
      witness: 'onur',
      witnessLabel: 'TANIK · ONUR KILIÇ',
      onFirstEnter: [ifThen(any(flag('onur_kayit'), flag('onur_vaat')), [dec('cred'), dec('pers')])],
      lines: [
        when(
          any(flag('onur_kayit'), flag('onur_vaat')),
          S('mubasir', 'Tanık Onur Kılııç!'),
          S(
            'tolga',
            'Sayın Başkan, tanık dinlenmeden önce: müdafi geçen ay tanığımızla gece bürosunda görüşmüş. Tanığa “bir şey olmayacağı” söylenmiş.',
          ),
          S('hakim', 'Müdafi?'),
          D('Tanık kendisi geldi, Sayın Başkan.'),
          S('hakim', 'Tanık kendisi geldiyse savcılığa gönderilir müdafi. Tutanağa geçsin. Tanık, yemin edin.'),
          T('Leyla’nın sesi kafamda: “İkisini karıştırma.” Karıştırdım.'),
        ),
        when(
          flag('onur_vicdan'),
          S('mubasir', 'Tanık Onur Kılııç!'),
          S(
            'hakim',
            'Gerçeği söyleyeceğinize, bildiğinizi saklamayacağınıza namusunuz ve vicdanınız üzerine yemin eder misiniz?',
          ),
          Nx(
            'Onur yemin metnini okudu. “Vicdanım” kelimesinde sesi bir an düştü, sonra toparlandı. Bir kez bana baktı.',
          ),
          Nx('Kol saati bileğinde değildi. Cebinde bir yer tutuyordu; eli iki kez oraya gitti, iki kez geri geldi.'),
          S('onur', 'Ederim.'),
          T('Yağmurda ona “mahkemede doğruyu söyleyin” dedim. Şimdi mahkemedeyiz.'),
        ),
        otherwise(
          S('mubasir', 'Tanık Onur Kılııç!'),
          S(
            'hakim',
            'Gerçeği söyleyeceğinize, bildiğinizi saklamayacağınıza namusunuz ve vicdanınız üzerine yemin eder misiniz?',
          ),
          S('onur', 'Ederim.'),
          Nx('Kol saatini düzeltti. Yemin ederken bile.'),
          T(
            'Bir ay önce koridorda iki adım arkasındaydı. Bugün on adım. Bir ayda bir tanık sekiz adım uzaklaşabiliyorsa, bir salonda kaç adım uzaklaşır?',
          ),
        ),
      ],
      choices: [cont('T02V_DEVAM', 'Tanık ifadesini versin', 'T_02')],
    }),
    court2.testimony('T_02', {
      title: 'Onur Kılıç’ın çapraz sorgusu',
      courtStage: 'TANIK_DINLEME',
      witness: 'onur',
      witnessLabel: 'TANIK · ONUR KILIÇ',
      say: [S('hakim', 'Tanık ifadesini kesintisiz verdi. Müdafi, sorularınız?')],
      rulesText:
        'Önce bastır, sonra doğru delili doğru ifadeye sun. Leyla: “Onu kurtaracak sorular sor, batıracak değil.” Yanlış delil güvenilirliği düşürür.',
      objectionGrounds: ['g_kanaat', 'g_ilgisiz'],
      statements: [
        statement('O1', 1, [
          'Bara ',
          hl('tesadüfen, tek başıma gittim', any(flag('press_o1'), has('ded_tanidik'), flag('contra_k2'))),
          '. Müştekiyi tanımam.',
        ]),
        statement('O2', 2, [
          'Oturduğum yerden ',
          hl('her şeyi net olarak gördüm', any(flag('press_o2'), has('ded_gorus'))),
          '. ',
          hl('O adam zaten belalı biriydi, belliydi'),
          '.',
        ]),
        statement('O3', 3, [
          'Sanık kadehi kırdı, ',
          hl('kırık tarafıyla müştekinin yüzüne vurdu', any(flag('press_o3'), has('ded_yumruk'), has('ev_kriminal'))),
          '.',
        ]),
        statement('O4', 4, [
          'Müşteki düşünce sanık tezgâhtan çıktı, ',
          hl('yerde yatan adamı tekmeledi', any(flag('press_o4'), has('ded_bilek'), flag('atk_govde'))),
          '.',
        ]),
        statement('O5', 5, [
          'Müşteki ',
          hl('elini hiç kaldırmadı', any(flag('press_o5'), has('ded_savunma'), has('ev_video'))),
          '; sadece hesabını soruyordu.',
        ]),
      ],
      rules: [
        presentRule('PS_O_SAVCILIK', undefined, [...prosecutionPapers, 'ev_ozel_rapor'], {
          maxUses: 3,
          effects: [
            ...wrongEvidence,
            score('SORGULAMA', -150, 'hatali'),
            mark('BAD', 'İddianın kendi belgesini tanığa karşı sunmak bir çelişki doğurmaz.', 'SORGULAMA'),
          ],
          responses: says(
            S('savci', 'Sayın Başkan, müdafi bizim dosyamızı okuyor.'),
            S('hakim', 'Müdafi, bunun tanıkla ilgisi ne?'),
          ),
        }),
        pressRule('PR_O1', 'O1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o1')],
          responses: [
            when(
              flag('contra_k2'),
              P(
                'Geçen celse katılan sizinle aynı şirkette çalıştığını söyledi. Bugün “tanımam” diyorsunuz. Neyi tanımıyorsunuz?',
              ),
              S('onur', 'Ben… şirket büyük. Yani… koridorda görmüşüzdür.', 'saskin'),
              T('Şirket büyük. Adisyon küçük: iki kişi, tek hesap.'),
            ),
            otherwise(
              P('O gece bara kimle gittiniz? Adım adım anlatır mısınız?'),
              S('onur', 'Tek başıma. İşten çıktım, bir kadeh içeyim dedim. Açıkçası bu kadar.'),
              T('“Açıkçası.” Bir cümleye açıklık katmak isteyen kelime, cümleyi hep biraz bulandırır.'),
            ),
          ],
        }),
        presentRule('PS_O1', 'O1', ['ded_tanidik', 'ev_eczane'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_o1'),
            mark('GOOD', 'Tanık katılanla birlikte gelmiş, hesabı kendi kartıyla ödemiş: tarafsız değil.', 'SORGULAMA'),
          ],
          responses: [
            when(
              all(has('ev_eczane'), flag('ecz_birlikte')),
              P(
                'Gökdere Eczanesi’nin kaydı, saat 22.10: katılan ve siz kol kola giriyorsunuz. Kapıyı siz tutuyorsunuz.',
              ),
              P('Ve Gölge’nin adisyonu: masa 4, iki kişi, tek hesap, sizin kartınız. Tesadüfen mi gittiniz?'),
              S('onur', 'Ben… o… kapıda karşılaştık. Yani…', 'saskin'),
              S('hakim', 'Tanık, katılanla nasıl bir ilişkiniz var? Yeminlisiniz.'),
              S('onur', '…Müdürüm. Aydemir Sigorta’da. Beş yıldır.', 'uzgun'),
              fx(
                Nx(
                  'Salonda bir uğultu. Serkan arka sırada doğruldu, bir şey söyleyecekti; Tolga Şen elini koluna koydu.',
                ),
                'shake',
              ),
              S('hakim', 'Kollukta “müştekiyi tanımam” dediniz. Beş yıllık müdürünüzü tanımıyor muydunuz?'),
              S('onur', 'Ben… öyle demem söylendi. Yani… öyle dedim.', 'uzgun'),
              T(
                '“Öyle demem söylendi.” Kimin söylediğini sormadım. Sormam gerekmiyordu; salondaki herkes başını aynı yöne çevirdi.',
              ),
            ),
            otherwise(
              P('Gölge’nin adisyonu, masa 4: iki kişi, açılış 22.10, tek hesap. Ödeme sizin kartınızdan.'),
              P('Tanımadığınız bir adamın altı duble rakısını mı ödediniz?'),
              S('onur', 'Ben… ikram ettim. Barda tanıştık.', 'saskin'),
              S('hakim', 'Tanık, katılan geçen celse sizinle aynı şirkette çalıştığını söyledi. Yeminlisiniz.'),
              S('onur', '…Müdürüm. Beş yıldır.', 'uzgun'),
              fx(Nx('Salonda bir uğultu. Serkan arka sırada doğruldu; Tolga Şen elini koluna koydu.'), 'shake'),
            ),
          ],
        }),
        pressRule('PR_O2', 'O2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o2')],
          responses: says(
            P('Hangi masada oturuyordunuz? Tezgâhın önündeki zemini oradan görüyor muydunuz?'),
            S('onur', 'Dört numara. Kolonun yanı. Görüyordum tabii. Yani… kalkmıştım. Ayaktaydım. Bir ara.', 'saskin'),
            T('Önce oturuyordu, sonra ayaktaydı, sonra bir ara.'),
          ),
        }),
        presentRule('PS_O2', 'O2', ['ded_gorus'], {
          score: { SORGULAMA: 250 },
          effects: [
            inc('pers'),
            raise('contra_o2'),
            mark('GOOD', 'Masa 4’ten tezgâhın önündeki zemin kolonun arkasında kalıyor.', 'SORGULAMA'),
          ],
          responses: says(
            P(
              'Masa 4’e oturdum, Sayın Başkan. Fotoğrafını dosyaya verdim. Tezgâhın üstü görünüyor; önündeki zemin kalın bir taş kolonun gölgesinde.',
            ),
            P('Tanık, “yerde olanı” oturduğunuz yerden nasıl gördünüz?'),
            S('onur', 'Kalkmıştım… kalktığımda… yani sonra kalktım. Ses gelince.', 'uzgun'),
            S('hakim', 'Ses gelince kalktınız. Ses geldiğinde ne olmuştu?'),
            S('onur', '…Bilmiyorum. Bir şey kırılmıştı.', 'uzgun'),
            T(
              '“Bir şey kırılmıştı.” Kadeh kırıldığında o, kolonun arkasında, oturuyordu. Net olarak gördüğü tek şey bir sesti.',
            ),
          ),
        }),
        objectRule('OB_O2', 'O2', 'g_kanaat', {
          maxUses: 1,
          score: { USUL_BILGISI: 50 },
          effects: [
            inc('pers'),
            inc('legal_hits'),
            mark('GOOD', 'İtiraz yerinde: “belliydi” bir gözlem değil, kanaattir.', 'USUL_BILGISI'),
          ],
          responses: says(
            P('İtiraz ediyorum Sayın Başkan. “Belalı biriydi, belliydi” bir gözlem değil; tanığın kanaati.'),
            S('hakim', 'İtiraz yerinde. Tanık, gördüklerinizi anlatın; kanaatlerinizi değil.'),
          ),
        }),
        pressRule('PR_O3', 'O3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o3')],
          responses: says(
            P('Kadeh kimin elindeydi kırılmadan önce? Kimin tarafındaydı?'),
            S('onur', 'Tezgâhtaydı. Sanık aldı… yani tezgâhtaydı işte. Kırıldı. Sonra müştekinin yüzü…', 'saskin'),
            T('“Kırıldı.” Kimin kırdığını söylerken fiil edilgen oldu.'),
          ),
        }),
        presentRule('PS_O3', 'O3', ['ded_yumruk', 'ev_kriminal', 'ded_kadeh_serkan', 'ev_video'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_o3'),
            mark(
              'GOOD',
              'Kadehin yüze vurulduğu anlatımı; katılanın kendi ilk beyanı, yaraların yeri ve sap üzerindeki izlerle çürüdü.',
              'SORGULAMA',
            ),
          ],
          responses: [
            when(
              has('ev_kriminal'),
              P(
                'Kriminal rapor: kırık sapın gövdesinde katılanın kanlı avuç izi, kavrama konumunda. Sanığın izi yalnızca tabanda, servis tutuşuyla.',
              ),
              P('Sapı tutan el katılanın eliydi. Sanık bu kadehle yüze nasıl vurdu, tanık?'),
              S('onur', 'Ben… ben kırıldığını gördüm. Kimin elinde… o an… kolonun arkasındaydım.', 'uzgun'),
              S('savci', 'Sayın Başkan, savcılık bu raporu dikkatle not ediyor.'),
              T('Savcı ilk kez “dikkatle” dedi. Savcılar bu kelimeyi az kullanır.'),
            ),
            when(
              has('ded_yumruk'),
              P('Katılan acilde kendi ağzıyla: “Kavgada yumrukla vuruldum.” Yüzünde tek bir kesi yok.'),
              P('Kırık kadeh yüze vurulup iz bırakmaz mı, tanık?'),
              S('onur', 'Ben… kırık kadehi gördüm. Yüze… belki… yumruk da olabilir. Hızlıydı.', 'uzgun'),
              S('hakim', 'Kollukta “kırık tarafıyla yüzüne vurdu” demişsiniz. Gördünüz mü, görmediniz mi?'),
              S('onur', '…Görmedim. Kadehi gördüm. Yüzü sonra gördüm.', 'uzgun'),
            ),
            otherwise(
              P(
                'Sayın Başkan, sapın yeri ve katılanın elindeki kesi bu anlatımla bağdaşmıyor. Sap katılanın elindeydi.',
              ),
              S('onur', 'Hızlıydı. Ben… kolonun arkasındaydım.', 'uzgun'),
            ),
          ],
        }),
        pressRule('PR_O4', 'O4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o4')],
          responses: says(
            P('Kaç tekme? Nereye? Başına mı, karnına mı?'),
            S('onur', 'Bir… iki. Karnına herhalde. Ya da… aşağıya. Ayağı yerdeydi, onun üstündeydi.', 'saskin'),
            T('“Ayağı onun üstündeydi.” Tekme atan bir ayak üstte durmaz.'),
          ),
        }),
        presentRule('PS_O4', 'O4', ['ded_bilek'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_o4'),
            mark(
              'GOOD',
              'Adli Tıp: gövdede tekme izi yok, yalnızca sağ bilekte bası izi. “Tekme” sapı bıraktırmak için bileğe basmaktı.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P('Adli Tıp kesin raporu: kaburgada, karında, başta travma bulgusu yok. Tek bir tekme izi yok.'),
            P(
              'Yalnızca sağ bileğin üstünde, yukarıdan bastırılmış bir ezilme izi. Sağ el, avucunda kırık camla kesilen el.',
            ),
            P('Tanık, sanığın ayağı katılanın bileğinin üstündeydi, değil mi? Elinde cam olan bileğin.'),
            Nx('Onur uzun süre sustu. Hâkim beklemesine izin verdi.'),
            S('onur', 'Bileğindeydi. Evet. Ayağı… bileğindeydi.', 'uzgun'),
            fx(T('Dosyanın en ağır cümlesi, “yerde tekmeledi”, bir bileğe basan bir ayağa dönüştü.'), 'flash'),
          ),
        }),
        presentRule('PS_O4B', 'O4', ['ev_atk'], {
          maxUses: 1,
          score: { SORGULAMA: 120 },
          effects: [
            inc('pers'),
            mark('GOOD', 'Kısmi: tekme izi yok; ama bilekteki iz tahtada “tekme” anlatımına bağlanmadı.', 'SORGULAMA'),
          ],
          responses: says(
            P('Adli Tıp raporunda gövdede tek bir tekme izi yok.'),
            S('onur', 'İz kalmamıştır. Ben gördüm.'),
            T('İz yok demek yetmiyor. Bilekteki izin ne olduğunu göstermem lazım.'),
          ),
        }),
        pressRule('PR_O5', 'O5', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o5')],
          responses: [
            when(
              any(flag('fact_ece_gordu'), flag('contra_k5')),
              P('Hesabını sorarken garsonun bileğini tutmadı mı? Tezgâhın üstünden uzanmadı mı?'),
              S('onur', 'Garson… bir kız vardı. Serkan Bey şakalaştı. Yani… biraz fazla.', 'saskin'),
              T('Dosyada olmayan bir kız, tanığın ağzından ilk kez.'),
            ),
            otherwise(
              P('Elini hiç kaldırmadı. Hiç mi? Tezgâha yaslanmadı bile mi?'),
              S('onur', 'Yaslandı. Yani… eli tezgâhtaydı. Kaldırmadı.', 'saskin'),
            ),
          ],
        }),
        presentRule('PS_O5', 'O5', ['ded_savunma', 'ev_video', 'ev_darp'], {
          score: { SORGULAMA: 250 },
          effects: [
            inc('pers'),
            raise('contra_o5'),
            mark('GOOD', 'İlk kesilen tezgâhın arkasındaki sanıktı; kolunu siper ederken.', 'SORGULAMA'),
          ],
          responses: says(
            P(
              'Sanığın sol önkolunun dış kenarında altı dikiş. Kolunu yüzüne siper eden birinin yarası. Kan tezgâhın içinde başlıyor.',
            ),
            P('Müşteki elini hiç kaldırmadıysa sanığı kim kesti?'),
            S('onur', 'Bilmiyorum. Ben… kolonun arkasındaydım.', 'uzgun'),
          ),
        }),
      ],
      presentMiss: fallback('FB_T02_PRESENT', 'PRESENT', {
        effects: [
          ...wrongEvidence,
          score('SORGULAMA', -150, 'hatali'),
          mark('BAD', 'Sunulan delil bu ifadeyle çelişmiyor.', 'SORGULAMA'),
        ],
        responses: says(S('hakim', 'Müdafi, bunun ifadeyle ilgisini göremiyorum.'), S('onur', 'Bu ne alaka?')),
      }),
      objectMiss: fallback('FB_T02_OBJECT', 'OBJECT', {
        effects: [
          dec('cred'),
          score('SORGULAMA', -50, 'hatali'),
          mark('BAD', 'Dayanaksız itiraz: tanık burada kendi gözlemini anlatıyor.', 'SORGULAMA'),
        ],
        responses: says(S('hakim', 'İtiraz reddedildi. Tanık kendi gözlemini anlatıyor.')),
      }),
      choices: [
        cont('T02_SON', 'Tanığa son bir soru: “Neden şimdi?”', 'T_02H', { visibleWhen: onurKirilir, maxUses: 1 }),
      ],
      finish: { id: 'T02_BITIR', label: 'Sorularım bu kadar', next: 'T_03D' },
    }),
    story('T_02H', {
      ...court2.base,
      title: 'Tanık',
      background: 'durusma_salonu',
      onFirstEnter: [raise('onur_kirildi'), inc('pers', 2), score('SORGULAMA', 150, 'capraz')],
      lines: [
        when(
          all(flag('fact_onur_tuttu'), not(flag('onur_vicdan'))),
          P(
            'Tanık. Kimse sizi batırmak istemiyor. Kollukta “ayırmaya çalıştım” demişsiniz. Kimi ayırdınız? Kimi tuttunuz?',
          ),
          Nx('Onur kol saatine baktı. Sonra çıkardı, kürsüye koydu.'),
          S('onur', 'Sanığı. Arkadan tuttum. Serkan Bey’i değil. Elinde cam olanı değil… sanığı tuttum.', 'uzgun'),
          S(
            'onur',
            'Müdürüm o. Karakolda “sen gördün” dedi. Sedyeye binerken “Onur, arabayı sen al” dedi; kimse duymadı sandı.',
            'uzgun',
          ),
          S('onur', 'Yerde tekme görmedim. Ayağı bileğindeydi. Elinde cam vardı.', 'uzgun'),
          fx(Nx('Salonda kimse kıpırdamadı.'), 'fade'),
          S(
            'hakim',
            'Tutanağa aynen geçsin. Tanığın beyanı nedeniyle suç duyurusu hususu hükümle birlikte değerlendirilecek.',
          ),
          T('“Ayırmaya çalıştım.” Bir saldırganı değil, saldırıya uğrayanı tutmuş. Bir cümlenin içinde bütün gece.'),
        ),
        when(
          flag('onur_vicdan'),
          P(
            'Tanık. Kimse sizi batırmak istemiyor. Yalnızca o gece ne gördüğünüzü soruyorum. Gördüğünüzü. Bilmediğinizi değil.',
          ),
          Nx('Onur kol saatini çıkardı. Kürsünün üstüne koydu. Bir süre ona baktı.'),
          S(
            'onur',
            'Müdürüm o. Terfim onun elinde. Karakolda “sen gördün” dedi. “Ben yerdeydim, sen gördün.”',
            'uzgun',
          ),
          S(
            'onur',
            'Ben kolonun arkasındaydım. Kadeh kırılınca kalktım. Serkan Bey’in elinde cam vardı. Sanık geri çekildi. Sonra vurdu. Bir kere.',
            'uzgun',
          ),
          S(
            'onur',
            'Yerde… tekme görmedim. Ayağı bileğindeydi. Elinde hâlâ cam vardı. Ben sanığı arkadan tutmaya çalıştım; o yüzden “ayırdım” dedim.',
            'uzgun',
          ),
          S('onur', 'Kollukta yalan söyledim. Avukat hanıma da söyledim: savcılığa gideceğim. Gideceğim.', 'uzgun'),
          S('hakim', 'Avukat hanım size bir şey vaat etti mi? Bir şey söylemenizi istedi mi?'),
          S(
            'onur',
            'Hayır. Kapısına gittim, yağmurdu. “Size yardım edemem” dedi. “Savcılığa gidin, mahkemede doğruyu söyleyin” dedi. Kapıyı kapattı.',
            'uzgun',
          ),
          S('onur', 'Herkes bana bir şey vaat etti. O etmedi. Belki o yüzden.', 'uzgun'),
          fx(Nx('Salonda kimse kıpırdamadı. Rıza Bey bile.'), 'fade'),
          S(
            'hakim',
            'Tutanağa aynen geçsin. Tanığın beyanı nedeniyle suç duyurusu hususu hükümle birlikte değerlendirilecek.',
          ),
          T('Onu batırmadım. Kendi ayağıyla indi. Kimse ona yardım etmedi; ben de. Belki en çok o yüzden.'),
        ),
        otherwise(
          P(
            'Tanık. Kimse sizi batırmak istemiyor. Yalnızca o gece ne gördüğünüzü soruyorum. Neden şimdi bu kadar emin değilsiniz?',
          ),
          Nx('Onur kol saatine baktı. Sonra çıkardı, kürsüye koydu.'),
          S('onur', 'Müdürüm o. Karakolda “sen gördün” dedi. “Ben yerdeydim, sen gördün.”', 'uzgun'),
          S(
            'onur',
            'Ben kolonun arkasındaydım. Kalktığımda Serkan Bey’in elinde cam vardı. Sanık bir kere vurdu.',
            'uzgun',
          ),
          S('onur', 'Yerde tekme görmedim. Ayağı bileğindeydi. Elinde cam vardı.', 'uzgun'),
          fx(Nx('Salonda kimse kıpırdamadı.'), 'fade'),
          S(
            'hakim',
            'Tutanağa aynen geçsin. Tanığın beyanı nedeniyle suç duyurusu hususu hükümle birlikte değerlendirilecek.',
          ),
          T('Bir cümle bir adamı ikiye böldü: kollukta konuşan ve bugün konuşan. İkincisini dinlemek daha zordu.'),
        ),
      ],
      choices: [cont('T02H_DEVAM', 'Devam', 'T_02S')],
    }),

    story('T_02S', {
      ...court2.base,
      title: 'Salonda',
      background: 'durusma_salonu',
      lines: says(
        fx(S('serkan', 'Onur! Ne diyorsun sen? Ne diyorsun?', 'kizgin'), 'shake'),
        Nx(
          'Serkan ayağa kalkmıştı. Burnundaki bant yoktu artık; yerinde ince, pembe bir çizgi. Sesi salonun duvarına çarptı.',
        ),
        S('hakim', 'Katılan! Oturun. Bir kez daha ayağa kalkarsanız sizi salondan çıkarırım.'),
        S('tolga', 'Oturun Serkan Bey. Lütfen. Oturun.'),
        Nx(
          'Tolga Şen müvekkilinin koluna dokundu; bu sefer nazik değil, sıkıca. Serkan oturdu. Elleri titriyordu; bir ay önce kürsünün kenarını tutan eller.',
        ),
        Nx(
          'Onur kürsüden inerken Serkan’a bakmadı. Bora’ya baktı. Bora başını eğdi; bir selam mı, bir kabul mü, kimse bilmeyecekti.',
        ),
        T(
          'Bir patron, bir çalışan, bir kol saati. Kürsüde bırakılan saati mübaşir Rıza Bey aldı, Onur’a uzattı. Onur almadı.',
        ),
        S('hakim', 'Devam ediyoruz.'),
      ),
      choices: [cont('T02S_DEVAM', 'Devam', 'T_03D')],
    }),

    // --- Ece ---
    decisionNode('T_03D', [{ when: eceCalled, to: 'T_03' }, { to: 'T_03X' }], { ...court2.base }),
    story('T_03X', {
      ...court2.base,
      title: 'Boş sandalye',
      background: 'durusma_salonu',
      lines: [
        when(
          met('ece'),
          S('hakim', 'Başka tanık yok. Delillerin tartışmasına geçiyoruz.'),
          T('Başka tanık yok. Ece’nin adı bir dilekçede yazmadı; bir kantinde, bir merdivende kaldı.'),
          Nx('Bora boş tanık kürsüsüne baktı. Ne düşündüğünü biliyordum: rahatlamış mıydı, pişman mı? İkisi.'),
        ),
        otherwise(
          S('hakim', 'Başka tanık yok. Delillerin tartışmasına geçiyoruz.'),
          T('Başka tanık yok. O gece barda on bir müşteri, bir barmen vardı. Bir de kimsenin sormadığı biri.'),
        ),
      ],
      choices: [cont('T03X_DEVAM', 'Delillere geç', 'T_04D')],
    }),
    court2.stage('T_03', {
      title: 'Tanık',
      courtStage: 'TANIK_DINLEME',
      witness: 'ece',
      witnessLabel: 'TANIK · ECE TAN',
      onFirstEnter: [meet('ece')],
      lines: [
        when(
          all(flag('ece_yonlendirildi'), not(flag('ece_duzeltildi'))),
          S('mubasir', 'Tanık Ece Taaan!'),
          Nx('Ece kürsüye geldi. Yemin etti. Sesi ince ama hızlı; çok hızlı.'),
          S(
            'ece',
            'O gece tezgâhın yanındaydım. Kadehi o kırdı. Kırık tarafıyla abiye saldırdı. Abi bir kere vurdu. Yerde tekme yoktu, kesin gördüm. Kesin.',
          ),
          T('“Kesin gördüm.” Benim cümlem. Onun ağzında yabancı bir aksanla duruyordu.'),
        ),
        otherwise(
          S('mubasir', 'Tanık Ece Taaan!'),
          Nx('Ece kürsüye geldi. Saçını kulağının arkasına attı. Yemin etti.'),
          S(
            'ece',
            'Gölge’de garsondum. Sigortasız. O gece Serkan Bey tezgâha geldi, bileğimi tuttu. “Bir kadeh benimle” dedi.',
          ),
          S(
            'ece',
            'Bora abi “bırak” dedi. Bırakmadı. Kadehi tezgâhın kenarına vurdu, kırıldı. Sapı elinde kaldı, tezgâhın üstünden abiye savurdu.',
          ),
          S(
            'ece',
            'Abinin kolu kesildi. Abi bileğini tuttu, bir kere vurdu. Adam düştü. Ben mutfak kapısına koştum. Yerde ne oldu, tam görmedim.',
          ),
          S(
            'ece',
            'Abi beni arka kapıdan gönderdi. “Seni burada görmedim” dedi. Babam bilmiyordu barda çalıştığımı. Artık biliyor.',
          ),
          S('hakim', 'Kadeh kırılmadan önce kimin elindeydi?'),
          S(
            'ece',
            'Serkan Bey’in. Masadan getirdi, rakı kadehiydi. Tezgâha koymadı, elinde tuttu. Bileğimi öbür eliyle tutuyordu.',
          ),
          S('hakim', 'Sanık kadehe dokundu mu?'),
          S('ece', 'O kadehi o gece abi servis etmişti. Masaya. Sonra hayır. Kırıldıktan sonra hiç dokunmadı.'),
          T(
            '“Tam görmedim.” Bir tanığın söyleyebileceği en güvenilir cümlelerden biri. Ve gördüğünü, bir saniye bile düşünmeden, sırasıyla söyledi.',
          ),
        ),
      ],
      choices: [cont('T03_DEVAM', 'Katılan vekili soruyor', 'T_03O')],
    }),
    court2.objection('T_03O', {
      title: 'Katılan vekilinin sorusu',
      courtStage: 'TANIK_DINLEME',
      witness: 'ece',
      witnessLabel: 'TANIK · ECE TAN',
      say: [
        S(
          'tolga',
          'Tanık, babanız gece ikiye kadar bir barda, sigortasız çalıştığınızı biliyor muydu? Ailenize hep böyle şeyler mi saklarsınız?',
        ),
        Nx('Ece’nin yüzü kızardı. Eli kürsünün kenarını buldu.'),
      ],
      next: 'T_03Y',
      options: [
        option('T03O_A', 'İtiraz: soru olayla ilgisiz ve tanığı küçük düşürmeye yönelik', {
          score: { USUL_BILGISI: 100 },
          effects: [raise('baba_itiraz'), inc('legal_hits'), inc('pers')],
          good: 'Yerinde: olayla ilgisi olmayan, tanığı küçük düşürmeye yönelik sorular mahkemece reddedilir (CMK 201/2). Tanığın aile hayatı, gördüğünün doğruluğunu göstermez.',
          responses: says(
            P(
              'İtiraz ediyorum Sayın Başkan. Tanığın babasıyla ilişkisi o gece tezgâhta ne gördüğüyle ilgili değil. Soru tanığı utandırmak için soruldu.',
            ),
            S('hakim', 'İtiraz yerinde. Soru reddedildi. Katılan vekili, olayla ilgili sorun.'),
            S('tolga', 'Özür dilerim Sayın Başkan. Tanık, kadeh kırıldığında tam olarak neredeydiniz?'),
            S('ece', 'Tezgâhın yanında. Bir metre. Bileğim onun elindeydi; nasıl uzakta olayım?'),
          ),
        }),
        option('T03O_B', 'Ece cevap versin; dürüstlüğü kendini korur', {
          effects: [dec('pers')],
          neutral:
            'Tanık cevap verdi ama sarsıldı; ilgisiz ve küçük düşürücü soruya itiraz etmek müdafinin görevidir (CMK 201/2).',
          responses: says(
            S('ece', 'Bilmiyordu. Saklıyordum. Kütüphanede çalışıyorum sanıyordu.', 'uzgun'),
            S('tolga', 'Saklamayı iyi biliyorsunuz yani. Teşekkürler.'),
            T('Bir kızın en zor gerçeğini salona bir silah gibi taşıdı. Durdurabilirdim.'),
          ),
        }),
        option('T03O_C', 'Katılan vekili tanığı tehdit ediyor; suç duyurusunda bulunuyoruz', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Aşırı tepki: soru ilgisiz ve küçük düşürücüydü ama tehdit değildi. Doğru araç sorunun reddini istemektir (CMK 201/2).',
          responses: says(
            P('Bu bir tehdittir! Katılan vekili hakkında suç duyurusunda bulunacağız!'),
            S('hakim', 'Müdafi, sakin olun. Soru reddedildi. Suç duyurusunu da istediğiniz yere yaparsınız.'),
          ),
        }),
      ],
    }),
    decisionNode(
      'T_03Y',
      [
        { when: all(flag('ece_yonlendirildi'), not(flag('ece_duzeltildi'))), to: 'T_03C' },
        { when: flag('ece_yonlendirildi'), to: 'T_03K' },
        { when: flag('ece_baski'), to: 'T_03B' },
        { to: 'T_03E' },
      ],
      { ...court2.base },
    ),
    story('T_03C', {
      ...court2.base,
      title: 'Tanık',
      background: 'durusma_salonu',
      onFirstEnter: [raise('ece_coktu'), dec('cred', 3), dec('pers', 2)],
      lines: says(
        S(
          'tolga',
          'Son bir soru. Tanık, müdafi hanım sizinle mahkemeden önce görüştü mü? Size ne söyleyeceğinizi söyledi mi?',
        ),
        Nx('Ece bana baktı. Sonra hâkime. Sonra yere.'),
        S('ece', '…Evet. “Kesin gördüm de” dedi. “Tekme yoktu de.”', 'uzgun'),
        S(
          'ece',
          'Ben yeri görmedim. Kaçıyordum. Kadehi o kırdı, bunu gördüm. Ama yeri… görmedim. Özür dilerim.',
          'uzgun',
        ),
        fx(Nx('Ece ağlamaya başladı. Rıza Bey bir bardak su getirdi; kimse içmedi.'), 'shake'),
        S(
          'hakim',
          'Tutanağa aynen geçsin. Müdafi hakkında suç duyurusu ve baroya bildirim hususu ayrıca değerlendirilecek.',
        ),
        T('Gördüğü doğruydu. Benim yüzümden artık hiçbirine inanılmayacak.'),
      ),
      choices: [cont('T03C_DEVAM', 'Devam', 'T_04D')],
    }),
    story('T_03K', {
      ...court2.base,
      title: 'Tanık',
      background: 'durusma_salonu',
      onFirstEnter: [raise('ece_tanikti'), dec('cred'), inc('pers')],
      lines: says(
        S('tolga', 'Son bir soru. Tanık, müdafi hanım size ne söyleyeceğinizi söyledi mi?'),
        S(
          'ece',
          'Önce söyledi. “Kesin gördüm de” dedi. Sonra geri geldi, “benim cümlelerimi unut, gördüğünü söyle” dedi.',
          'uzgun',
        ),
        S('ece', 'Ben de gördüğümü söylüyorum. Kadehi o kırdı. Yeri görmedim.'),
        S('hakim', 'Tutanağa geçsin. Müdafi, bunu ayrıca konuşacağız.'),
        T('Hatamı kendi sesiyle anlattı ve kendi sesiyle düzeltti. Bana bir şey borçlu değildi.'),
      ),
      choices: [cont('T03K_DEVAM', 'Devam', 'T_04D')],
    }),
    story('T_03B', {
      ...court2.base,
      title: 'Tanık',
      background: 'durusma_salonu',
      onFirstEnter: [raise('ece_tanikti'), dec('cred')],
      lines: says(
        S('tolga', 'Tanık, buraya neden geldiniz? Biri sizi zorladı mı?'),
        S('ece', 'Avukat hanım “gelmezsen abi içeri girer” dedi. Ondan geldim. Ama söylediklerim doğru.', 'uzgun'),
        S('tolga', 'Sayın Başkan, tanık baskıyla getirilmiş. Beyanının değerini takdirinize bırakıyorum.'),
        T('Söyledikleri doğruydu. Ama onları salona benim baskım taşıdı ve herkes bunu duydu.'),
      ),
      choices: [cont('T03B_DEVAM', 'Devam', 'T_04D')],
    }),
    story('T_03E', {
      ...court2.base,
      title: 'Tanık',
      background: 'durusma_salonu',
      onFirstEnter: [raise('ece_tanikti'), inc('pers', 2), score('SORGULAMA', 100, 'capraz')],
      lines: [
        when(
          all(flag('baba_itiraz'), not(flag('bora_ece_gizli'))),
          S('tolga', 'Son bir soru. Müdafi hanım size ne söyleyeceğinizi söyledi mi?'),
          S(
            'ece',
            'Hayır. “Gördüğünü söyle, görmediğini söyleme” dedi. Bir de… babamla ilgili soruya itiraz etti. Ona teşekkür ederim.',
          ),
          S('tolga', 'Başka sorum yok.'),
          Nx('Ece kürsüden indi. Saçını kulağının arkasına attı; bu sefer bir kez.'),
          T('Bir itiraz, bir tanığın sesini salonda tuttu. Usul bazen yalnızca bir kızın utanmadan konuşabilmesidir.'),
        ),
        when(
          flag('bora_ece_gizli'),
          S('tolga', 'Son bir soru. Sanık geçen celse “yalnızdım” dedi. Siz oradaydınız. Biri yalan söylüyor.'),
          S('ece', 'Abi beni korumak için öyle dedi. Ben oradaydım. Gördüğümü söylüyorum.'),
          S('hakim', 'Tutanağa geçsin.'),
          Nx(
            'Bora başını eğdi. Bir kızı korumak için söylenmiş bir yalanın faturası, salonda, açıkça kesildi. Ödenebilir bir faturaydı.',
          ),
        ),
        otherwise(
          S('tolga', 'Son bir soru. Müdafi hanım size ne söyleyeceğinizi söyledi mi?'),
          S('ece', 'Hayır. “Gördüğünü söyle, görmediğini söyleme” dedi. Ben de onu yapıyorum.'),
          S('tolga', 'Başka sorum yok.'),
          Nx(
            'Ece kürsüden indi. Bora’nın önünden geçerken durmadı; Bora da başını kaldırmadı. Bir anlaşmanın en sessiz hâli.',
          ),
          T('Tolga sordu, çünkü sormak zorundaydı. Ece cevap verdi, çünkü cevap onundu.'),
        ),
      ],
      choices: [cont('T03E_DEVAM', 'Delillere geç', 'T_04D')],
    }),

    // --- Video, memur, kamera ---
    decisionNode('T_04D', [{ when: has('ev_video'), to: 'T_04V' }, { to: 'T_04SD' }], { ...court2.base }),
    story('T_04V', {
      ...court2.base,
      title: 'On beş saniye',
      background: 'durusma_salonu',
      onFirstEnter: [
        raise('video_izlendi'),
        ifThen(flag('video_bilirkisi'), [inc('pers', 2)], [inc('pers')]),
        score('DELIL_ANALIZI', 150, 'delil'),
      ],
      lines: [
        when(
          flag('defne_kirgin'),
          S(
            'hakim',
            'Müdafinin sunduğu kayıt dosyada. Kaydı çeken Defne Yurt’un dilekçesi de geldi: “Adımın geçmeyeceği söylenmişti. Kaydı yine de veriyorum, çünkü barmen hiç bağırmadı.”',
          ),
          Nx('Hâkim gözlüğünün üstünden bana baktı. Bir saniye. Yetti.'),
          Nx(
            'Perdeye yansıdı. Arka planda tezgâh: bir adam kolunu kaldırıyor, bir parıltı, tezgâhın arkasındaki adam geri çekiliyor. Saniye dokuz: bir yumruk. Saniye on beş: kararıyor.',
          ),
          S('tolga', 'Sayın Başkan, bu kayıt müdafinin telefonundan geliyor. Zincir nerede?'),
          T('Video doğruyu gösteriyordu. Ama oraya benim verdiğim bir yalanla gelmişti.'),
        ),
        when(
          flag('video_bilirkisi'),
          S(
            'hakim',
            'Tanık Defne Yurt’un gönüllü teslim ettiği kayıt ve bilirkişi raporu dosyada. Kayıt kesintisiz. İzleyeceğiz.',
          ),
          Nx('Salonun ışıkları kısıldı. Rıza Bey perdeyi indirirken iki kez takıldı; kimse gülmedi.'),
          Nx('Perdeye yansıdı. Ön planda gülen iki kadın, bir doğum günü pastası. Arka planda tezgâh.'),
          Nx(
            'Saniye dört: bir adam tezgâhın önünde kolunu kaldırıyor. Bir parıltı. Tezgâhın arkasındaki adam geri çekiliyor, kolunu yüzüne kaldırıyor.',
          ),
          Nx(
            'Saniye dokuz: tezgâhın arkasındaki kol uzanıyor, bir bilek tutuluyor, bir yumruk. Ön plandaki kadınlardan biri çığlık atıyor; kamera sallanıyor. Saniye on beş: kararıyor.',
          ),
          fx(Nx('Salonda kimse konuşmadı. Savcı videoyu bir kez daha istedi. İzledi. Bir şey not etti.'), 'flash'),
          S('tolga', 'Sayın Başkan… görüntü bulanık.'),
          S(
            'hakim',
            'Bilirkişi kesintisiz olduğunu, saatin 01.41:02 olduğunu tespit etmiş. Bulanıklığı ben takdir ederim.',
          ),
          T('On beş saniye. İki ayın cevabı. Bir doğum günü videosunun arka planında.'),
        ),
        otherwise(
          S('hakim', 'Tanık Defne Yurt’un gönüllü teslim ettiği kayıt dosyada. İzleyeceğiz.'),
          Nx(
            'Perdeye yansıdı. Ön planda gülen iki kadın. Arka planda tezgâh: bir adam kolunu kaldırıyor, bir parıltı, tezgâhın arkasındaki adam geri çekiliyor.',
          ),
          Nx('Saniye dokuz: bir yumruk. Kamera sallanıyor. Saniye on beş: kararıyor.'),
          S(
            'tolga',
            'Sayın Başkan, bu bir sosyal medya kaydı. Kesildi mi, oynandı mı, kim bilir? Bilirkişi incelemesi yok.',
          ),
          S('hakim', 'Haklısınız; değerini ona göre takdir edeceğim.'),
          T('Videoyu buldum ama yolunu açmadım. Bir bilirkişi incelemesi; iki satırlık bir talep.'),
        ),
      ],
      choices: [cont('T04V_DEVAM', 'Devam', 'T_04SD')],
    }),
    decisionNode('T_04SD', [{ when: flag('ara_sinan'), to: 'T_04S' }, { to: 'T_04K' }], { ...court2.base }),
    story('T_04S', {
      ...court2.base,
      title: 'Tutanağı tutan memur',
      background: 'durusma_salonu',
      onFirstEnter: [{ type: 'MEET', character: 'sinan' }, inc('pers')],
      lines: says(
        S('mubasir', 'Tanık Sinan Kuuurt!'),
        Nx(
          'Genç memur üniformasıyla gelmişti. Kürsüye çıkarken şapkasını çıkardı, iki eliyle tuttu. Yemin metnini okurken sesi titremedi.',
        ),
        S('sinan', 'Tutanağı ben yazdım Sayın Hâkim. “Tezgâh önü” yazdım. Gece ikiydi.'),
        S(
          'sinan',
          'Fotoğraf 7’yi de ben çektim. Sap, yerdeki müştekinin sağ elinin hemen yanındaydı. Fotoğraf doğrusunu söylüyor.',
        ),
        S('hakim', 'Tutanakla fotoğraf çelişirse?'),
        S('sinan', 'Fotoğrafa bakın efendim. Ben acele ettim. Fotoğraf etmedi.'),
        T(
          'Bir memur kendi tutanağına karşı tanıklık etti. Bunu yapmak, bir mahkemede söylenebilecek en sade cesaretti.',
        ),
      ),
      choices: [cont('T04S_DEVAM', 'Devam', 'T_04K')],
    }),
    story('T_04K', {
      ...court2.base,
      title: 'Kayıt cihazı',
      background: 'durusma_salonu',
      onFirstEnter: [
        ifThen(all(flag('kamera_yalan'), not(flag('kamera_duzeltildi'))), [
          raise('kamera_ortaya'),
          dec('cred', 2),
          dec('pers'),
        ]),
      ],
      lines: [
        when(
          all(flag('kamera_yalan'), not(flag('kamera_duzeltildi'))),
          S(
            'savci',
            'Bir husus Sayın Başkan: sanık geçen celse “kamera bozuktu” dedi. Kolluk kayıt cihazını inceledi. Cihaz sağlam.',
          ),
          S('savci', 'Bir zaman ayarlı prize bağlı; her gece 01.00’de kapanıyor. Bozuk değil. Ayarlanmış.'),
          S('hakim', 'Müdafi?'),
          Nx('Bora bana baktı. Ben ona bakamadım.'),
          fx(T('Bir “bozuktu” cümlesi. Kolay oldu, demiştim. Kolay olan şeyler bu meslekte pahalıya patlar.'), 'shake'),
        ),
        when(
          any(flag('kamera_durust'), flag('kamera_duzeltildi'), has('ded_kamera')),
          S('savci', 'Bir husus Sayın Başkan: barın kayıt cihazında 01.00’den sonrası yok.'),
          P(
            'Sayın Başkan, cihaz aylardır bir zaman ayarlı prize bağlı; ruhsat saati olan 01.00’de kesiliyor. Sanık bunu ilk görüşmede kendisi söyledi.',
          ),
          P(
            'Bunun bedeli bir idari para cezasıdır. Delil karartma değil: o gece de, bir önceki gece de, bir ay önce de aynı saatte kapanmış.',
          ),
          S('savci', 'Yani her gece. O gece de.'),
          P(
            'Her gece, Sayın Savcı. Bir ay önce de, olaydan önceki gece de. Cihazın kaydı bunu gösteriyor: her gece 00.59’da son kare.',
          ),
          S('hakim', 'Tutanağa geçsin. Ruhsat hususu idari bir mesele.'),
          T('Bora’nın utancı bir kabahatti. Doğru söylenince bir kabahat olarak kaldı.'),
        ),
        otherwise(
          S(
            'savci',
            'Bir husus Sayın Başkan: barın kayıt cihazında 01.00’den sonrası yok. Sanığın aleyhine bir tablo.',
          ),
          S('hakim', 'Müdafi?'),
          P('Sayın Başkan… bunu araştırmadık.'),
          T('Bir soru sorulmadan cevaplanmaz. Ben sormamıştım.'),
        ),
      ],
      choices: [cont('T04K_DEVAM', 'Tutanağın tartışılması', 'T_04')],
    }),
    court2.objection('T_04', {
      title: 'Olay yeri tutanağı',
      courtStage: 'DELIL_TARTISMA',
      prosecutionEvidence: 'ev_tutanak',
      say: [
        S(
          'savci',
          'Olay yeri tutanağına göre kırık kadeh “tezgâh önünde”, yani sanığın uzanabileceği yerde bulunmuştur. Tutanak resmî bir belgedir.',
        ),
        S('hakim', 'Müdafi, tutanağa karşı diyeceğiniz?'),
      ],
      next: 'T_05P',
      options: [
        option('T04_A', 'Tutanak aksi ispatlanabilir; fotoğraf 7 ve memurun beyanı sapın yerini gösteriyor', {
          effects: [
            ifThen(
              any(has('clue_sap'), flag('sinan_aciklama')),
              eff(
                score('USUL_BILGISI', 120),
                raise('tutanak_itiraz'),
                inc('legal_hits'),
                inc('pers'),
                mark(
                  'GOOD',
                  'Tutanak, aynı ekibin çektiği fotoğraflarla birlikte değerlendirilir ve aksi ispatlanabilir; delilleri mahkeme serbestçe takdir eder (CMK 217/1).',
                  'USUL_BILGISI',
                ),
              ),
              eff(
                score('USUL_BILGISI', -40),
                mark('BAD', 'Fotoğraf 7’yi incelemeden tutanağa itiraz etmek dayanaksız kaldı.', 'USUL_BILGISI'),
              ),
            ),
          ],
          responses: [
            when(
              any(has('clue_sap'), flag('sinan_aciklama')),
              P(
                'Sayın Başkan, tutanak resmî bir belgedir ama aksi ispatlanabilir. Aynı ekibin aynı gece çektiği fotoğraf 7: sap, yerde yatan katılanın sağ elinin yanında.',
              ),
              P(
                'Tutanaktaki “tezgâh önü” ile fotoğraf çelişmiyor; tutanak eksik. Delilleri birlikte takdir edeceksiniz.',
              ),
              S('hakim', 'Fotoğraflar tutanağın ekidir. Birlikte değerlendirilecek.'),
            ),
            otherwise(
              P('Sayın Başkan, tutanak yanlıştır.'),
              S('hakim', 'Neye göre müdafi?'),
              P('…Dosyadaki diğer delillere göre.'),
              T('Hangi delil? Kendime sordum. Cevap panoda değildi.'),
            ),
          ],
        }),
        option('T04_B', 'Tutanak hukuka aykırı; dosyadan çıkarılsın', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Yanlış dayanak: acele yazılmış bir tutanak hukuka aykırı delil değildir (CMK 206/2-a, 217/2 yasak yöntemle elde edilen delile ilişkindir). Eksikliği diğer delillerle gösterilir.',
          responses: says(
            P('Tutanak hukuka aykırıdır, çıkarılmalıdır.'),
            S('hakim', 'Neden? Kolluk görevini yaparken tuttu. Eksik olabilir, aykırı değil. Reddedildi.'),
          ),
        }),
        option('T04_C', 'Kriminal rapor tutanağı zaten aşıyor: sapı tutan el katılanın', {
          effects: [
            ifThen(
              has('ev_kriminal'),
              eff(
                score('DELIL_ANALIZI', 100),
                raise('tutanak_itiraz'),
                inc('pers'),
                mark(
                  'GOOD',
                  'Bilimsel inceleme, tutanağın eksik bıraktığını tamamlar: sapta katılanın kavrama izi.',
                  'DELIL_ANALIZI',
                ),
              ),
              eff(
                score('DELIL_ANALIZI', -40),
                dec('cred'),
                mark('BAD', 'Dosyada Kriminal rapor yok; olmayan bir rapora dayanıldı.', 'DELIL_ANALIZI'),
              ),
            ),
          ],
          responses: [
            when(
              has('ev_kriminal'),
              P(
                'Sayın Başkan, sapın nerede bulunduğu tartışması Kriminal raporla aşılmıştır: sapın gövdesinde katılanın kanlı avuç izi var, kavrama konumunda.',
              ),
              S('savci', 'Savcılık bunu kabul ediyor Sayın Başkan.'),
            ),
            otherwise(
              P('Kriminal rapor sapı tutanın katılan olduğunu gösteriyor.'),
              S('hakim', 'Hangi Kriminal rapor, müdafi? Dosyada yok.'),
            ),
          ],
        }),
        option('T04_D', 'Diyeceğimiz yok', {
          effects: [dec('pers')],
          neutral: 'Tutanağın eksikliği tartışılmadı; mahkeme “tezgâh önü” ibaresini olduğu gibi okuyabilir.',
          responses: says(S('hakim', 'Tutanağa geçti.')),
        }),
      ],
    }),

    story('T_05P', {
      ...court2.base,
      title: 'Mütalaa için ara',
      background: 'durusma_salonu',
      lines: says(
        S('hakim', 'Sayın Savcı, mütalaa için süre ister misiniz?'),
        S('savci', 'On beş dakika, Sayın Başkan.'),
        Nx(
          'Savcı Orhan Baysal dosyayı koltuğunun altına aldı, salondan çıktı. Kapının önünde durup bir sigara yaktı; içmeden söndürdü.',
        ),
        Nx(
          'Salon dağıldı. Tolga Şen pencerenin önünde telefonla konuşuyordu; sesi alçak, cümleleri kısa. Serkan sırasında oturuyor, burnundaki pembe çizgiye dokunup duruyordu.',
        ),
        Nx('Bora yerinden kıpırdamadı. Ellerini dizlerine koymuş, karşısındaki boş tanık kürsüsüne bakıyordu.'),
        S('bora', 'Savcı ne diyecek?'),
        D('Bilmiyorum. Yorgun bir adam. Yorgun adamlar ya tutanağa sığınır ya da tutanaktan kurtulmak ister.'),
        S('bora', 'Hangisi o?'),
        D('On beş dakika sonra öğreneceğiz.'),
        T(
          'Bir mütalaa on beş dakikada yazılır. Ama içinde iki ayın bütün kâğıtları vardır: benim getirdiklerim ve getiremediklerim.',
        ),
        Nx(
          'Leyla’dan bir mesaj: “Duydum. Savcı çıkıp sigara mı yaktı? İçti mi? İçmediyse iyi haber.” Leyla bu binayı, binadakilerden iyi tanırdı.',
        ),
        Nx('Kapı açıldı. Savcı içeri girdi, yerine oturdu, dosyayı açmadı.'),
      ),
      choices: [cont('T05P_DEVAM', 'Mütalaayı dinle', 'T_05D')],
    }),

    // --- Mütalaa ---
    decisionNode(
      'T_05D',
      [
        { when: ref('mm_tam'), to: 'T_05A' },
        { when: any(ref('saldiri_kanit'), ref('findings')), to: 'T_05B' },
        { to: 'T_05C' },
      ],
      { ...court2.base },
    ),
    story('T_05A', {
      ...court2.base,
      title: 'Mütalaa',
      background: 'durusma_salonu',
      onFirstEnter: [raise('mutalaa_beraat')],
      lines: says(
        S('hakim', 'Sayın Savcı, esas hakkındaki mütalaanız?'),
        Nx('Savcı Orhan Baysal ayağa kalktı. Dosyayı kapadı. Bir süre kapalı dosyaya baktı.'),
        S(
          'savci',
          'Sayın Başkan. İddianame, tanık Onur Kılıç’ın kolluk beyanına dayanıyordu. Tanık bugün o beyanın gerçeği yansıtmadığını söyledi.',
        ),
        S(
          'savci',
          'Kırık kadehi katılan kırmış ve sanığa saldırmıştır. Sanık kaçma imkânı olmayan tezgâhın arkasında, kolu kesilmişken tek bir yumrukla karşılık vermiş; yerdeki hareket, elinde cam bulunan bileğe basmaktan ibarettir.',
        ),
        S(
          'savci',
          'Tanık Ece Tan ve memur Sinan Kurt’un beyanları, Kriminal rapor ve Adli Tıp raporu bu anlatımı doğrulamaktadır. Kayıt cihazındaki boşluk ise her gece tekrarlanan bir ayardan ibarettir.',
        ),
        S(
          'savci',
          'Sanığın eyleminin TCK 25/1 kapsamında meşru savunma sınırları içinde kaldığı anlaşılmakla, CMK 223/2-d uyarınca beraatine karar verilmesini talep ederim.',
        ),
        fx(Nx('Tolga Şen kalemini bıraktı. Serkan bir şey söylemek için ağzını açtı, kapadı.'), 'shake'),
        T(
          'Savcının beraat istemesi. Bunu ilk kez bir salonda duydum. Yorgun adamlar da adildir; yeter ki önlerine doğru kâğıt konsun.',
        ),
      ),
      choices: [cont('T05A_DEVAM', 'Devam', 'T_05R')],
    }),
    story('T_05B', {
      ...court2.base,
      title: 'Mütalaa',
      background: 'durusma_salonu',
      onFirstEnter: [raise('mutalaa_indirim')],
      lines: says(
        S('hakim', 'Sayın Savcı, esas hakkındaki mütalaanız?'),
        S(
          'savci',
          'Sayın Başkan. Olayın katılanın kışkırtıcı davranışıyla başladığı anlaşılmıştır. Ancak sanığın müştekiyi yere düşürdükten sonraki hareketi tam olarak aydınlanmamıştır.',
        ),
        S(
          'savci',
          'Kadehin sanık tarafından kullanıldığı ispatlanamadığından silahla işleme artırımının uygulanmamasını; sanığın TCK 86/1 ve 87/3 uyarınca cezalandırılmasını, haksız tahrik hükümlerinin (TCK 29) uygulanmasını talep ederim.',
        ),
        T('Silah düştü. Tahrik geldi. Savcı yarı yolda durdu. Kalan yarıyı ben yürüyeceğim.'),
      ),
      choices: [cont('T05B_DEVAM', 'Devam', 'T_05R')],
    }),
    story('T_05C', {
      ...court2.base,
      title: 'Mütalaa',
      background: 'durusma_salonu',
      lines: says(
        S('hakim', 'Sayın Savcı, esas hakkındaki mütalaanız?'),
        S(
          'savci',
          'Sayın Başkan. Tanık beyanı, olay yeri tutanağı ve adli raporlar birlikte değerlendirildiğinde, sanığın kırdığı kadehle müştekiyi yaraladığı ve yerde darp ettiği anlaşılmaktadır.',
        ),
        S('savci', 'Sanığın TCK 86/1, 86/3-e ve 87/3 uyarınca cezalandırılmasını talep ederim.'),
        T('Tutanak böyle diyor. İki aydır kimse ona başka bir şey söyletmedi. Ben de söyletemedim.'),
      ),
      choices: [cont('T05C_DEVAM', 'Devam', 'T_05R')],
    }),
    court2.objection('T_05R', {
      title: 'Mütalaaya cevap',
      courtStage: 'MUTALAA',
      say: [S('hakim', 'Müdafi, mütalaaya karşı diyeceğiniz?')],
      next: 'T_06P',
      options: [
        option('T05R_A', 'Cevap: saldırı katılandan geldi, tek darbe orantılıydı; fiil hukuka uygundur', {
          effects: [
            ifThen(
              ref('saldiri_kanit'),
              eff(
                score('USUL_BILGISI', 100),
                inc('legal_hits'),
                mark(
                  'GOOD',
                  'Cevap hakkı yerinde kullanıldı (CMK 216/2): mütalaanın dayandığı anlatım delillerle karşılandı.',
                  'USUL_BILGISI',
                ),
              ),
              eff(
                score('USUL_BILGISI', -30),
                mark(
                  'BAD',
                  'Saldırının katılandan geldiği duruşmada gösterilmeden bu cevap havada kaldı.',
                  'USUL_BILGISI',
                ),
              ),
            ),
          ],
          responses: [
            when(
              all(flag('mutalaa_beraat'), flag('fact_112')),
              P(
                'Sayın Başkan, Sayın Savcının mütalaasına katılıyoruz. Yalnızca şunu eklemek isterim: 112 kaydı 01.50; sanık polisi ve ambulansı kendisi aradı, kapıda bekledi.',
              ),
            ),
            when(
              flag('mutalaa_beraat'),
              P(
                'Sayın Başkan, Sayın Savcının mütalaasına katılıyoruz. Yalnızca şunu eklemek isterim: sanık polisi ve ambulansı kendisi aradı, kapıda bekledi.',
              ),
            ),
            when(
              ref('saldiri_kanit'),
              P(
                'Sayın Başkan, saldırı katılandan geldi: sap onun elindeydi, ilk kesilen tezgâhın arkasındaki sanıktı. Kaçacak yeri olmayan bir adam tek bir yumrukla karşılık verdi.',
              ),
              P('Bu tahrik değil, savunmadır. Esas hakkındaki savunmamızda ayrıntılandıracağız.'),
            ),
            otherwise(P('Sayın Başkan, saldırı katılandan geldi.'), S('savci', 'Hangi delille, müdafi?')),
          ],
        }),
        option('T05R_B', 'Cevap yok; esas savunmada söyleyeceğiz', {
          neutral: 'Cevap hakkı kullanılmadı (CMK 216/2); esas savunma yine yapılabilir.',
          responses: says(S('hakim', 'Peki.')),
        }),
        option('T05R_C', 'Mütalaa tutanaktan çıkarılsın', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Mütalaa tutanaktan çıkarılamaz; çare cevap hakkıdır (CMK 216/2).',
          responses: says(S('hakim', 'Böyle bir usul yok müdafi. Cevabınız varsa verin.')),
        }),
      ],
    }),

    // --- Esas savunma ---
    choiceNode('T_06P', {
      ...court2.base,
      title: 'Esas savunmanın dayanakları',
      background: 'durusma_salonu',
      hud: ['noktalar', 'pers'],
      prompt: T(
        'En çok üç dayanak. Her biri bu salonda ispatlanmış olmalı; ispatlanmamış bir dayanak, ispatlanmış ikisini de zayıflatır.',
      ),
      choices: [
        dayanak(
          'D_SALDIRI',
          'Saldırı katılandan geldi: sap onun elindeydi',
          ref('saldiri_kanit'),
          'Kırık kadehi katılan kırdı ve sapla sanığa saldırdı; sanığın kolundaki kesi bunun izi.',
        ),
        dayanak(
          'D_KACIS',
          'Sanığın kaçacak yeri yoktu: tezgâhın arkası',
          any(has('ded_savunma'), flag('video_izlendi')),
          'Sanık dar tezgâhın arkasında, lavabo ile raf arasında sıkışmıştı; başka korunma imkânı yoktu.',
        ),
        dayanak(
          'D_TEKME',
          'Yerde tekme yok; bileğe bası',
          ref('tekme_yok'),
          'Yerdeki hareket, hâlâ cam tutan bileğe basıp sapı bıraktırmaktı; gövdede tek bir tekme izi yok.',
        ),
        dayanak(
          'D_TANIK',
          'Görgü tanığı tarafsız değil ve göremezdi',
          ref('tanik_coktu'),
          'Tek görgü tanığı katılanın çalışanı; masasından tezgâhın önündeki zemin görünmüyor.',
        ),
        dayanak(
          'D_ORANTI',
          'Tek darbe: orantılı karşılık',
          any(flag('fact_tek_yumruk'), flag('ece_tanikti'), flag('video_izlendi'), flag('onur_kirildi')),
          'Kırık camla gelen saldırıya tek bir yumrukla karşılık verildi; sanık durdu, polisi kendisi aradı.',
        ),
        dayanak(
          'D_KAMERA',
          'Kayıt yokluğu delil karartma değil',
          any(has('ded_kamera'), flag('kamera_durust'), flag('kamera_duzeltildi')),
          'Kayıt cihazı aylardır her gece 01.00’de kesiliyor; o geceye özgü bir karartma yok.',
        ),
        option('D_KARAKTER', 'Sanık sabıkasız, sevilen bir esnaf', {
          cost: [{ var: 'noktalar', amount: 1 }],
          score: { SAVUNMA_STRATEJISI: -40 },
          bad: 'Kişilik bir dayanak değil; ceza takdirinde (TCK 61, 62) değerlendirilir, olayın nasıl geçtiğini göstermez.',
          responses: says(S('savci', 'İyi esnaf da yumruk atabilir Sayın Başkan.')),
          next: '$stay',
        }),
        option('D_BOKS', 'Eski bir boksör olarak yumruğunu kontrol etti', {
          cost: [{ var: 'noktalar', amount: 1 }],
          score: { SAVUNMA_STRATEJISI: -40 },
          bad: 'Karşı tarafın etiketini savunmaya taşımak riskli: boks geçmişi orantıyı değil, darbenin gücünü hatırlatır.',
          responses: says(S('tolga', 'Teşekkürler meslektaşım. Biz de tam bunu söylüyorduk.', 'mutlu')),
          next: '$stay',
        }),
        cont('T06P_BITIR', 'Esas savunmaya geç', 'T_06'),
      ],
    }),
    choiceNode('T_06', {
      ...court2.base,
      title: 'Esas hakkında savunma',
      background: 'durusma_salonu',
      prompt: S('hakim', 'Müdafi, esas hakkındaki savunmanızı yapın.'),
      next: 'T_06R',
      choices: [
        option('T06_MM', 'Fiil meşru savunmadır; hukuka uygunluk nedeni (CMK 223/2-d)', {
          effects: [
            ifThen(
              ref('mm_tam'),
              eff(
                score('SAVUNMA_STRATEJISI', strategyAmount(250, 'MASUMIYET'), 'savunma'),
                inc('pers'),
                raise('mm_kabul'),
                mark(
                  'GOOD',
                  'Meşru savunmanın bütün şartları gösterildi: haksız saldırı, o an, orantı, başka korunma imkânının yokluğu (TCK 25/1).',
                  'SAVUNMA_STRATEJISI',
                ),
              ),
              [
                ifThen(
                  ref('saldiri_kanit'),
                  eff(
                    score('SAVUNMA_STRATEJISI', 60, 'savunma'),
                    raise('sinir_kabul'),
                    mark(
                      'NEUTRAL',
                      'Saldırı gösterildi ama yerdeki hareket aydınlanmadı; mahkeme sınırın aşıldığı sonucuna varabilir (TCK 27/2).',
                      'SAVUNMA_STRATEJISI',
                    ),
                  ),
                  eff(
                    score('SAVUNMA_STRATEJISI', -100, 'savunma'),
                    dec('pers'),
                    mark(
                      'BAD',
                      'Meşru savunma bir beyanla değil, delille kurulur; saldırının katılandan geldiği gösterilmedi.',
                      'SAVUNMA_STRATEJISI',
                    ),
                  ),
                ),
              ],
            ),
          ],
          responses: [
            when(
              ref('mm_tam'),
              P(
                'Sayın Başkan. 3 Kasım gecesi saat 01.40’ta Gölge’de bir saldırı oldu. Saldıran, 1,9 promil alkollü katılandı. Kadehi tezgâhın dış kenarına vurup kırdı, sapını tezgâhın üstünden sanığa savurdu.',
              ),
              P(
                'Sanık tezgâhın arkasındaydı; arkasında lavabo, yanlarında raf. Kaçacak yeri yoktu. Kolunu kaldırdı; kolu kesildi. Sonra bileği tuttu ve bir kere vurdu.',
              ),
              P(
                'Katılan yerde camı yeniden kavradı. Sanık o bileğe bastı ve camı bıraktırdı. Tekme yok; Adli Tıp söylüyor. Tanık bugün söyledi.',
              ),
              P(
                'Haksız bir saldırı, o anda, orantılı bir karşılık, başka korunma imkânı yok. Fiil hukuka uygundur. TCK 25/1 ve CMK 223/2-d uyarınca beraatini talep ediyoruz.',
              ),
            ),
            when(
              ref('saldiri_kanit'),
              P('Sayın Başkan, saldırı katılandan geldi; sanık kendini savundu. Fiil meşru savunmadır.'),
              S('hakim', 'Yerdeki hareket, müdafi? Katılan düştükten sonra?'),
              P('…Saldırı hâlâ sürüyordu Sayın Başkan.'),
              T('Sürüyordu. Bunu biliyorum; gösteremedim.'),
            ),
            otherwise(
              P('Sayın Başkan, sanık kendini savundu. Fiil meşru savunmadır.'),
              S('hakim', 'Saldırı kimden geldi, müdafi? Hangi delille?'),
              P('…Sanığın beyanıyla, Sayın Başkan.'),
              T('Leyla haklıydı: meşru müdafaa beyan edilmez, gösterilir.'),
            ),
          ],
        }),
        option('T06_E', 'İddianın anlatımı ispatlanamadı; şüpheden sanık yararlanır (CMK 223/2-e)', {
          effects: [
            ifThen(
              ref('findings'),
              eff(
                score('SAVUNMA_STRATEJISI', strategyAmount(200, 'USUL'), 'savunma'),
                inc('pers'),
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
              ref('findings'),
              P('Sayın Başkan. İddianame üç kelimeye dayanıyordu: kadeh, yüz, tekme. Üçünü de tek bir tanık söyledi.'),
              P(
                'O tanık katılanın çalışanı; tesadüfen değil, birlikte gelmişler. Oturduğu yerden tezgâhın önü görünmüyor. Katılan acilde “yumrukla vuruldum” demiş; yüzünde kesi yok.',
              ),
              P(
                'Kadehin sanığın elinde olduğu da, yerde tekme atıldığı da ispatlanmadı. Sanığın tek yumruğunun bir savunma olmadığı da.',
              ),
              P(
                'Ve bir şey daha, Sayın Başkan: sanık o gece polisi kendisi aradı, kapıda bekledi, ilk ifadesinde “vurdum, bir kere” dedi. Saklayan bir adam böyle konuşmaz.',
              ),
              P(
                'Bu dosyada şüphe bir boşluk değil, bir zemin. Şüpheden sanık yararlanır. CMK 223/2-e uyarınca beraatini talep ediyoruz.',
              ),
            ),
            otherwise(
              P('Sayın Başkan, bu dosyada şüphe var. Tanık emin değil.'),
              S('hakim', 'Hangi çelişkiyi kastediyorsunuz müdafi? Duruşmada hangisini ortaya koydunuz?'),
              P('…Dosya bir bütün olarak değerlendirilmelidir.'),
              T('Şüphe bir zemin demek isterdim. Zemini kurmamıştım.'),
            ),
          ],
        }),
        option('T06_SINIR', 'Saldırı katılandan geldi; sınır aşıldıysa korku ve heyecanla (TCK 27/2)', {
          effects: [
            ifThen(
              ref('saldiri_kanit'),
              eff(
                score('SAVUNMA_STRATEJISI', 120, 'savunma'),
                raise('sinir_kabul'),
                mark(
                  'GOOD',
                  'Meşru savunmada sınırın mazur görülebilecek heyecan, korku veya telaşla aşılması hâlinde ceza verilmez (TCK 27/2; CMK 223/3-c).',
                  'SAVUNMA_STRATEJISI',
                ),
              ),
              eff(
                score('SAVUNMA_STRATEJISI', -80, 'savunma'),
                mark(
                  'BAD',
                  'Sınırın aşılması bir meşru savunma durumunu varsayar; önce saldırının katılandan geldiği gösterilmeliydi.',
                  'SAVUNMA_STRATEJISI',
                ),
              ),
            ),
          ],
          responses: [
            when(
              ref('saldiri_kanit'),
              P('Sayın Başkan, saldırı katılandan geldi: kırık cam onun elindeydi, ilk kesilen sanıktı.'),
              P(
                'Mahkemeniz yerdeki hareketi gerekli savunmanın ötesinde görse bile, kolu kesilmiş, tezgâhın arkasında sıkışmış bir adamın o anki korkusu mazur görülmelidir.',
              ),
              P('TCK 27/2 uyarınca sanığa ceza verilmesine yer olmadığına karar verilmesini talep ediyoruz.'),
            ),
            otherwise(
              P('Sayın Başkan, sanık korkmuştu. Sınır aşıldıysa korkudan aşıldı.'),
              S('hakim', 'Neyin sınırı, müdafi? Önce bir savunma durumu göstermeniz gerekir.'),
            ),
          ],
        }),
        option('T06_T', 'Öncelikle beraat; aksi hâlde haksız tahrik ve silah artırımının düşmesi (terditli)', {
          score: { SAVUNMA_STRATEJISI: strategyAmount(150, 'INDIRIM') },
          effects: [raise('terditli')],
          good: 'Terditli savunma meşrudur: asıl talep beraat; olmazsa silah artırımının düşmesi (TCK 86/3-e), haksız tahrik (TCK 29), kırığın birinci derece kabulü (TCK 87/3) ve hükmün açıklanmasının geri bırakılması (CMK 231/5–6).',
          responses: says(
            P(
              'Sayın Başkan, öncelikle sanığın beraatini talep ediyoruz. Mahkemeniz aksi kanaatteyse: kadeh sanığın elinde değildi; silah artırımı uygulanamaz.',
            ),
            P(
              'Olay katılanın garsona sarkıntılığı ve sanığa saldırısıyla başladı; haksız tahrik hükümlerinin üst sınırdan uygulanmasını, kırığın birinci derece kabulünü ve hükmün açıklanmasının geri bırakılmasını talep ediyoruz.',
            ),
            T('“Haklıydın ama.” Bora bu cümleyi bir gün benden duyacak. Bugün değil.'),
          ),
        }),
        option('T06_D', 'Gece ikide barda içen adam, olacaklara razıdır', {
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('pers')],
          bad: 'Katılanı küçümseyen bir söylem delilin yerini tutmaz ve hâkimi savunmadan uzaklaştırır; mağdurun alkollü olması tek başına bir hukuka uygunluk nedeni değildir.',
          responses: says(
            P('Sayın Başkan, gece ikide 1,9 promil içen bir adam, başına geleceklere razı olmuştur.'),
            fx(S('serkan', 'Ne demek razı? Burnum kırıldı!', 'kizgin'), 'shake'),
            S('hakim', 'Katılan, lütfen. Müdafi, devam edin; ama bu dille değil.'),
          ),
        }),
      ],
    }),
    story('T_06R', {
      ...court2.base,
      title: 'Cevaplar',
      background: 'durusma_salonu',
      lines: [
        when(
          any(flag('mm_kabul'), flag('supheden')),
          S('hakim', 'Katılan vekili?'),
          S('tolga', 'Sayın Başkan, müvekkilimin burnu kırıldı. Bu bir gerçek. Ancak…'),
          Nx('Tolga Şen bir an durdu. Dosyasının kapağına baktı.'),
          S('tolga', 'Ancak delillerin takdirini mahkemenize bırakıyoruz.'),
          T(
            'Usul avcısı yayını indirdi. Doğru delil karşısında geri çekilmeyi bilen bir profesyonel. Leyla bunu da söylemişti.',
          ),
          S('serkan', 'Tolga Bey? Tolga Bey, bu ne demek?', 'saskin'),
          S('tolga', 'Sonra konuşuruz Serkan Bey.'),
          Nx('Serkan arkasına yaslandı. Ellerini dizlerine koydu; sağ avucunun içinde, enine, solgun bir çizgi.'),
        ),
        otherwise(
          S('hakim', 'Katılan vekili?'),
          S(
            'tolga',
            'Sayın Başkan, müvekkilimin burnu kırıldı. Sanık eski bir boksör; yumruğunun ağırlığını biliyordu. Cezalandırılmasını talep ediyoruz.',
          ),
          S('serkan', 'Ben medeni bir insanım. Bu adam beni yere serdi.'),
          T('“Medeni bir insan.” Kırık bir kadehin sapını tutan el de medeni olabilir mi? Bunu salona soramadım.'),
        ),
      ],
      choices: [cont('T06R_DEVAM', 'Son söze geç', 'T_07P')],
    }),
    story('T_07P', {
      ...court2.base,
      title: 'Son sözden önce',
      background: 'durusma_salonu',
      lines: says(
        Nx('Hâkim bir şey yazıyordu. Salonda yalnızca kalemin sesi vardı. Bora bana eğildi.'),
        S('bora', 'Ne diyeceğim?'),
        D('Ne düşünüyorsan. Kısa.'),
        S('bora', 'Kısa olur. Ben uzun konuşamam.'),
        Nx(
          'Ellerine baktı. Kalın parmaklar, yamuk eklemler; yıllarca bir şeye vurmuş eller. Sol kolunda, gömleğinin altında, altı dikişin izi.',
        ),
        T(
          'İlk akşam bu adam kapıdan girerken dosyanın yarısını okuduğumu sanmıştım. Eski boksör, bar sahibi, kırık bir burun. Hiçbirini okumamıştım.',
        ),
        T(
          'Okuduğum tek şey, bir adamın ilk sorulan soruya “bir kere” diye cevap verdiğiydi. Gerisini kâğıtlar söyledi.',
        ),
      ),
      choices: [cont('T07P_DEVAM', 'Son söz', 'T_07')],
    }),
    choiceNode('T_07', {
      ...court2.base,
      title: 'Son söz',
      background: 'durusma_salonu',
      prompt: S('hakim', 'Sanık, ayağa kalkın. Son sözünüz?'),
      next: 'T_08',
      choices: [
        option('SS_DOGRU', '“Ben vurdum. Bir kere. Bir daha olsa yine vururum. Ama kızı göndermezdim.”', {
          effects: [
            ifThen(
              any(flag('bora_durust'), flag('bora_ece_kabul')),
              [
                score('SAVUNMA_STRATEJISI', 40, 'savunma'),
                raise('son_soz_iyi'),
                mark('GOOD', 'Kendi sözcükleriyle, dürüst ve kısa bir son söz.', 'SAVUNMA_STRATEJISI'),
              ],
              [score('SAVUNMA_STRATEJISI', 10, 'savunma')],
            ),
          ],
          responses: [
            when(
              any(flag('bora_durust'), flag('bora_ece_kabul')),
              S('bora', 'Ben vurdum. Bir kere. Bir daha olsa yine vururum.'),
              S('bora', 'Ama kızı göndermezdim. “Seni burada görmedim” dedim ona. Görmüştüm. Herkes görsün isterdim.'),
              S('bora', 'Bir de… o gözlüklü çocuk. Ona kızgın değilim. Patronu varmış. Benim de babam vardı. Anlarım.'),
              Nx('Oturdu. Ellerini dizlerine koydu. Arka sırada biri burnunu çekti; Ece’ydi belki, belki değil.'),
            ),
            otherwise(
              S('bora', 'Ben vurdum. Bir kere. Yine olsa yine vururum.'),
              T('Doğru bir cümle. Ama salon onun öbür cümlelerini de hatırlıyordu.'),
            ),
          ],
        }),
        option('SS_PISMAN', '“Pişmanım. Affedin. Bir daha olmaz.”', {
          neutral:
            'Şekli bir pişmanlık beyanı: TCK 62 takdirinde dikkate alınabilir ama meşru savunma iddiasıyla da çelişir.',
          responses: says(
            S('bora', 'Pişmanım. Affedin.'),
            T('Bora’nın ağzında yabancı bir kelime. Pişman değildi; yorgundu.'),
          ),
        }),
        option('SS_INKAR', '“Ben vurmadım. Kendisi düştü.”', {
          score: { SAVUNMA_STRATEJISI: -40 },
          effects: [dec('pers')],
          bad: 'Son sözde, sanığın kendi darp raporu ve ifadesiyle çelişen bir inkâr: savunmanın kurduğu her şeyi zayıflatır.',
          responses: says(S('bora', 'Ben vurmadım. Kendisi düştü.', 'kizgin'), S('hakim', 'Tutanağa geçsin.')),
        }),
      ],
    }),
    decisionNode('T_08', [{ to: 'R_KARAR' }], {
      ...TRIAL,
      lines: says(
        S('hakim', 'Hüküm için ara verildi.'),
        Nx('Otuz beş dakika. Koridorda kimse oturmadı. Bora pencereden Uludağ’a baktı; dağ bulutun içindeydi.'),
        Nx('Serkan telefonla konuşuyordu, alçak sesle. Onur merdivenin başında, tek başına. Kol saati cebindeydi.'),
        Nx('Ece koridorun ucundaydı, babasının yanında değil, tek başına. Telefonunu tutuyordu ama bakmıyordu.'),
        Nx(
          'Tolga Şen bir kez yanıma geldi. “Meslektaşım,” dedi, “hangi sonuç çıkarsa çıksın, iyi bir dosyaydı.” Gülümsemedi. İlk kez.',
        ),
        T('Bir hüküm otuz beş dakikada yazılır, bir ömür boyu okunur. Bunu Leyla söylerdi.'),
        S('mubasir', 'Bora Yalçııın! Hüküm!'),
        S('hakim', 'Hüküm fıkrası ayakta dinlenir.'),
      ),
    }),
    story('T_COKUS', {
      ...court2.base,
      title: 'Çöküş',
      background: 'durusma_salonu',
      lines: says(
        S('hakim', 'Müdafi. Bugün sunduğunuz her şey ya ilgisiz çıktı ya dayanaksız. Mahkemenin sabrı sınırsız değil.'),
        S('hakim', 'Dosya esas hakkında karara çıkacak. Sanık, kısaca son sözünüz?'),
        T('Kendi elimle yıktım. Tanık değil, rapor değil. Ben.'),
      ),
      choices: [cont('COKUS_SON', 'Bora: “Ben vurdum. Bir kere.”', 'T_08')],
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
