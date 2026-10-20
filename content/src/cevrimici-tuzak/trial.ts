import {
  all,
  any,
  choiceNode,
  cmp,
  cont,
  courtSession,
  dec,
  decisionNode,
  deliver,
  discover,
  fallback,
  flag,
  has,
  hl,
  ifThen,
  inc,
  mark,
  meet,
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
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, O, S, W } from './dsl.js';
import { illegalPresented, wrongEvidence } from './hearing-1.js';
import { TRIAL, VERDICT, court2 } from './shared.js';

// 80-trial: 2. celse. Açılış (gelen raporlar), cihaz kaydının tartışılması, Arda'nın tanıklığı, Onur (O1–O4),
// Necdet (N1–N4), savcının iştirak çıkışı, katılanın beyanı, mütalaa ve cevap, esas savunma, son söz, hüküm.

const imeiT00 = deliver('T_00', [
  { evidence: 'ev_imei_rapor', requires: flag('imei_istendi'), hint: 'Suç duyurusunda IMEI sorgusu iste.' },
]);

const prosecution = presentRule;

export const trial: CasePart = {
  court: {
    sessions: [
      courtSession('cs_2', '2. Celse', [
        ['s2_acilis', 'ACILIS', 'T_00'],
        ['s2_tanik', 'TANIK_DINLEME', 'T_01R'],
        ['s2_delil', 'DELIL_TARTISMA', 'T_04'],
        ['s2_mutalaa', 'MUTALAA', 'T_05'],
        ['s2_savunma', 'SAVUNMA', 'T_07'],
        ['s2_son_soz', 'SON_SOZ', 'T_08'],
        ['s2_karar', 'KARAR', 'T_09'],
      ]),
    ],
  },
  nodes: [
    court2.stage('T_00', {
      title: 'Duruşma · 2. Celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onEnter: imeiT00.effects,
      lines: B(S`
        = 25 KASIM 2026 · 10.00 — BURSA 7. ASLİYE CEZA MAHKEMESİ · 2. CELSE @durusma_salonu
        mubasir: Ece Yalın dosyası! Sanık, müdafi, katılan, tanıklar! Ece Yalın!
        - Koridorda bekleyen tanıklar sıraya girmişti: kaskını kucağında tutan bir kurye, ceketi büyük gelen bir bayi çalışanı ve ütülü takımıyla bir iş merkezi müdürü.
        - Yağmur dinmişti. Pencereden soluk bir güneş giriyor, tozun içinde bir sütun gibi duruyordu. Salonun arka sırasında Sevim Hanım, plastik dosyasıyla.
        hakim: Yoklama yapıldı. Ara karar cevapları dosyaya girdi; okundu. Tanıklar salon dışında.
        - Katılan sırasında Nurettin Aksoy bu sefer kravatsızdı. Elinde aynı dosya; ama dosyanın arasından birkaç fotoğraf taşıyordu. Kimseye göstermedi.
        savci: Sayın Hâkim, dosyaya giren kayıtları inceledik. Savcılık, tanıkların dinlenmesinden sonra görüşünü bildirecek.
        ~ "Görüşünü bildirecek." Geçen celse "gerisi hikâye" demişti. Bir şey değişmiş.
        - Ece sanık sandalyesine oturdu. Bu sefer ellerini dizlerine koymadı; masaya koydu, açık. Bir yıl sonra ilk kez, saklayacak bir şeyi olmayan biri gibi.
      `),
      choices: [cont('T00_DEVAM', 'Devam', 'T_00R')],
    }),
    decisionNode(
      'T_00R',
      [{ when: all(not(flag('contra_g1')), any(has('ev_banka_log'), has('ded_imei'))), to: 'T_00K' }, { to: 'T_01R' }],
      {
        ...TRIAL,
        lines: [
          W(
            flag('burak_gelecek'),
            S`- Arka sırada, Sevim'in iki sıra gerisinde, Burak oturuyordu. Ece onu gördü. Bir şey demedi; ama ellerini masadan çekmedi.`,
          ),
        ],
      },
    ),
    court2.objection('T_00K', {
      title: 'Cihaz kaydı',
      courtStage: 'ACILIS',
      say: S`hakim: Müdafi, yeni gelen kayıtlar hakkında bir diyeceğiniz var mı?`,
      next: 'T_01R',
      options: [
        option('T00K_A', 'Kayıtlara göre 4 Kasım işlemleri sanığın telefonundan değil, başka bir cihazdan yapıldı.', {
          effects: [
            ifThen(any(has('ev_banka_log'), has('ded_imei')), [
              raise('cihaz_t04'),
              inc('pers'),
              score('DELIL_ANALIZI', 200),
              mark(
                'GOOD',
                'Cihaz kaydı tartışıldı: işlemler sanığın telefonundan yapılmadı (CMK 217).',
                'DELIL_ANALIZI',
              ),
            ]),
          ],
          responses: [
            W(
              has('ev_banka_log'),
              S`
                > Banka cevabı: 3 Kasım 14.29'da mobil şubeye bir Samsung tanımlanmış. 4 Kasım'daki bütün işlemler o cihazdan. Sanığın telefonu bir iPhone 8.
                hakim: Tutanağa geçirin. Savcı bey?
                savci: Kayıt dosyada. Değerlendirmemizi mütalaada yapacağız.
              `,
            ),
            O(S`
              > İletişim tespitine göre kopya SIM 4 Kasım'da IMEI'si 35 491207 ile başlayan bir cihazdaydı. Sanığın telefonunun IMEI'si 35 391508. İki ayrı cihaz.
              hakim: Tutanağa geçirin.
            `),
          ],
        }),
        option('T00K_B', 'Diyeceğimiz yok; tanıklara geçilsin.', {
          neutral:
            'Yeni gelen kayıt, tartışılmadan hükme esas alınamaz (CMK 217/1); savunma lehine kaydı konuşmamak bir fırsat kaybıdır.',
        }),
        option('T00K_C', 'Kayıtların tamamının hukuka aykırı olduğunu ileri sürüyoruz.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Mahkeme kararıyla gelen kayıt hukuka uygundur; üstelik savunmanın lehinedir. Kendi delilini dışlatmaya çalıştın.',
          responses: B(S`hakim: Müdafi, kendi talebinizle gelen kaydı mı dışlatıyorsunuz? Reddedildi.`),
        }),
      ],
    }),
    decisionNode('T_01R', [{ when: flag('arda_cagrildi'), to: 'T_01' }, { to: 'T_02R' }], { ...TRIAL }),
    court2.stage('T_01', {
      title: 'Tanık: Arda Kılıç',
      courtStage: 'TANIK_DINLEME',
      witness: 'arda',
      witnessLabel: 'TANIK · ARDA KILIÇ',
      onFirstEnter: [meet('arda'), discover('ev_arda_beyan')],
      lines: [
        W(
          flag('tanik_etkileme'),
          S`
            mubasir: Tanık Arda Kılıç!
            hakim: Tanık, kendinizi ya da yakınlarınızı suçlayabilecek sorulara cevap vermeyebilirsiniz. Anladınız mı?
            arda: Anladım. Ben… Ece Hanım'ı tanımam. Her şeyi Kaan yaptı. Başka bir şey söylemem.
            savci: Sayın Hâkim, tanık ezberlenmiş gibi konuşuyor. Tanık, bu cümleyi size kim söyledi?
            arda/saskin: Ben… avukat abla…
            - Salon sustu. Hâkim kalemini bıraktı ve bana baktı. Uzun uzun. !shake
          `,
        ),
        O(S`
          mubasir: Tanık Arda Kılıç!
          - Arda kaskı olmadan küçük görünüyordu. Yanında baronun gönderdiği genç bir avukat vardı.
          hakim: Tanık, kendinizi ya da yakınlarınızı suçlayabilecek sorulara cevap vermeyebilirsiniz. Anladınız mı?
          - Baronun genç avukatı Arda'nın kulağına bir şey fısıldadı. Arda başını salladı; sonra hâkime döndü.
          arda: Anladım. Anlatırım. Bir ilan gördüm: "Kurye aranıyor, motorlu, esnek saat." Kaan Abi aradı. Kimliğimin fotoğrafını istedi, sigorta için.
          arda: Sonra QR'lar gelmeye başladı. "Şirket tahsilatı" dedi. ATM'ye gidiyorum, telefonumu tutuyorum, para çıkıyor. Çekim başı beş yüz.
          arda: Hiçbir sözleşme imzalamadım. O bayiye hiç gitmedim. Vekâlet ne, onu da polis anlattı.
          arda: Bir gün QR'lar kesildi. Kaan Abi'nin numarası kapandı. Son parayı da almadım. Sonra polis beni aradı. Montumun sırtındaki yazıdan bulmuşlar.
          - Baronun avukatı Arda'nın koluna dokundu. Arda sustu; sonra devam etti, daha alçak sesle.
          arda: Ben kimseyi dolandırmak istemedim. Bir iş istedim. Ece Hanım gibi.
        `),
      ],
      choices: [cont('T01_DEVAM', 'Tanığa soru sor', 'T_01Q')],
    }),
    choiceNode('T_01Q', {
      ...court2.base,
      title: 'Tanığa sorular',
      prompt: { speaker: 'hakim', text: 'Müdafi, tanığa sorularınız?' },
      choices: [
        option('T01Q_A', 'Parayı kime, nerede teslim ettiniz?', {
          score: { SORGULAMA: 40 },
          discovers: 'clue_arda_otopark',
          effects: [inc('pers'), raise('arda_teslim')],
          good: 'Açık, yönlendirmesiz soru; tanığın kendi gözlemi tutanağa geçti (CMK 201).',
          responses: B(S`
            arda: OM İş Merkezi'nin otoparkında. En köşedeki tabelalı yerde siyah bir araba beklerdi. Cam yarım inerdi, zarfı uzatırdım.
            arda: Her seferinde aynı saat, akşam yedi. Otopark boş olurdu o saatte. Bariyer bana açılmazdı; yürüyerek girerdim, motoru dışarıda bırakırdım.
            hakim: Aracı kullanan kişiyi gördünüz mü?
            arda: Yüzünü değil, efendim.
          `),
          next: '$stay',
        }),
        option('T01Q_B', 'Kaan’ı hiç gördünüz mü? Yüzünü, elini, herhangi bir şeyini?', {
          score: { SORGULAMA: 50 },
          effects: [inc('pers'), raise('arda_yuzuk')],
          good: 'Açık uçlu soru; tanığın hatırladığını kendi sözleriyle anlatmasına izin verdin.',
          responses: B(S`
            arda: Bir kere. Cam biraz fazla indi. Elini gördüm, zarfı alırken. Parmağında eski bir yüzük vardı. Yassı. Mühür gibi. Bir de… kolonya kokusu.
            ~ Bir yüzük. Ece de bir yüzük görmüştü; iki saniyelik bir kamerada. İki kurban, bir el.
          `),
          next: '$stay',
        }),
        option('T01Q_C', 'Parayı alan Kaan’dı, değil mi? Yani bu tuzağı o kurdu?', {
          score: { SORGULAMA: -50 },
          effects: [dec('cred'), dec('pers')],
          bad: 'Cevabı içinde taşıyan soru yönlendiricidir; itiraz üzerine hâkim soruyu reddeder (CMK 201/1). Tanığın kendi gözlemi değer taşır, müdafinin sonucu değil.',
          responses: B(S`
            savci: İtiraz, Sayın Hâkim! Müdafi tanığa cevap yazdırıyor.
            hakim: Kabul. Soru reddedildi. Müdafi, tanığa sonucu siz söylemeyin; tanık gördüğünü anlatsın.
            ~ Cevabı soruya ben koydum. Tanığın ağzından çıkacak bir cümleyi kendi ağzımdan söyledim; artık kimse ona inanmaz.
          `),
          next: '$stay',
        }),
        cont('T01Q_BITTI', 'Başka sorum yok', 'T_02R', { role: 'PRIMARY' }),
      ],
    }),
    decisionNode('T_02R', [{ when: flag('onur_cagrildi'), to: 'T_02' }, { to: 'T_03R' }], { ...TRIAL }),
    court2.stage('T_02', {
      title: 'Tanık: Onur Demirci',
      courtStage: 'TANIK_DINLEME',
      witness: 'onur',
      witnessLabel: 'TANIK · ONUR DEMİRCİ',
      onFirstEnter: [meet('onur'), ifThen(flag('onur_baski'), [dec('cred')])],
      lines: [
        W(
          flag('onur_baski'),
          S`
            mubasir: Tanık Onur Demirci!
            onur: Sayın Hâkim, önce bir şey söyleyeyim: bu avukat hanım dükkânıma gelip beni tehdit etti.
            hakim: Not edildi. Müdafi, bunu ayrıca değerlendireceğim. Tanık, yemininizi edin ve anlatın.
            ~ Bir cümle. Dükkânda söylenmiş bir cümle. Şimdi tutanakta.
          `,
        ),
        O(S`
          mubasir: Tanık Onur Demirci!
          - Onur mavi tişörtünün üstüne bir ceket giymişti; ceket ona büyüktü. Elleri cebindeydi; hâkim bakınca çıkardı.
          hakim: Kimliğiniz tespit edildi; yemin ettiniz. Kendinizi suçlayabilecek sorulara cevap vermeyebilirsiniz. Anlatın.
        `),
      ],
      choices: [cont('T02_DEVAM', 'Tanığı dinle', 'T_02P')],
    }),
    court2.objection('T_02P', {
      title: 'Savcının sorusu',
      courtStage: 'TANIK_DINLEME',
      witness: 'onur',
      witnessLabel: 'TANIK · ONUR DEMİRCİ',
      say: S`
        savci: Tanık, o gün dükkânınıza gelen kişi sanığın nişanlısıydı ve sanığın isteğiyle geldi, değil mi?
        - Onur bir an savcıya, bir an bana baktı. "Değil mi" bir soru değil, bir kapıydı; içinden geçmek kolaydı.
      `,
      next: 'T_02T',
      options: [
        option('T02P_A', 'İtiraz: soru cevabını içinde taşıyor; tanığa ne söyleyeceği gösteriliyor.', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers')],
          good: 'Yönlendirici soruya itiraz edildiğinde sorunun yöneltilip yöneltilmeyeceğine hâkim karar verir (CMK 201/1); tanığın kendi gözlemi istenir.',
          responses: B(S`
            hakim: Kabul. Savcı bey, açık sorun.
            savci: Tanık, gelen kişi kimdi, kendini nasıl tanıttı?
            onur: Kendini… nişanlısı diye tanıttı. Kimliğine baktım.
            - Onur'un sesi incelmişti. Savcı sorusunu geri aldı ama ilk hâli salonda asılı kaldı; kimin cümlesi olduğu belli olsun diye.
          `),
        }),
        option('T02P_B', 'İtiraz: savcı tanığa doğrudan soru soramaz.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Savcı tanığa doğrudan soru yöneltebilir (CMK 201/1); itiraz sorunun biçimine yapılmalıydı.',
          responses: B(S`
            hakim: Sorabilir, müdafi. Tanık, cevap verin.
            onur: Evet. Nişanlısıydı. Öyle dedi.
          `),
        }),
        option('T02P_C', 'Sessiz kal; çapraz sorguda düzeltirsin.', {
          effects: [dec('pers')],
          neutral: 'Yönlendirici soru itirazsız geçti; tanığın beyanı savcının cümlesiyle tutanağa girdi.',
          responses: B(S`
            onur: Evet. Öyle. Nişanlısıydı, sanığın isteğiyle geldi.
            ~ Bir "evet." Savcının cümlesi, tanığın ağzından. Şimdi onu tanığın ağzından geri almam gerekecek.
          `),
        }),
        option('T02P_D', 'Tanık yalan söylüyor, Sayın Hâkim!', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'İtiraz bir usul kuralına dayanmalıdır; tanığı suçlamak çapraz sorgunun yerini tutmaz.',
          responses: B(S`hakim: Müdafi, sırası gelince sorarsınız. Tanık, cevap verin.`),
        }),
      ],
    }),
    court2.testimony('T_02T', {
      title: 'Çapraz sorgu: Onur Demirci',
      courtStage: 'TANIK_DINLEME',
      witness: 'onur',
      witnessLabel: 'TANIK · ONUR DEMİRCİ',
      say: S`hakim: Müdafi, sorularınız?`,
      rulesText: 'Önce bastır, sonra doğru delille vur. Yalan bir ifade bastırılınca yerine yenisini koyabilir.',
      objectionGrounds: ['g_kanaat', 'g_duyum', 'g_telkin'],
      statements: [
        statement('O1', 1, [
          'Müşteri kimliğinin aslını gösterdi. ',
          hl('Yüz yüze kontrol ettim, hat sahibi karşımdaydı', any(flag('press_o1'), has('ev_bayi_belge'))),
          '.',
        ]),
        statement('O2', 2, [
          'Vekâletname noterdendi. ',
          hl('Sistemde sorgulattım, geçerliydi', any(flag('press_o2'), has('ev_noter_yok'))),
          '.',
        ]),
        statement('O3', 3, [
          'Gelen kişi Ece Hanım’ın nişanlısıydı; öyle dedi. ',
          hl('Kimliğine baktım: Arda Kılıç', flag('press_o3')),
          '.',
        ]),
        statement(
          'O3_EK',
          4,
          ['Genç bir çocuktu. ', hl('Yirmisinde ya var ya yok, kimlikteki gibi'), '.'],
          flag('press_o3'),
        ),
        statement('O4', 5, ['Prosedüre uydum. ', hl('Kimseden bir şey almadım', flag('press_o4')), '.']),
      ],
      rules: [
        presentRule('PS_O_ILLEGAL', undefined, ['ev_bayi_ekran'], {
          effects: illegalPresented('bayi sistemi ekran görüntüsü'),
          responses: B(S`
            savci/kizgin: Bu ekran görüntüsü operatör sistemine yetkisiz girişle alınmış! Müdafi açıklasın!
            hakim: Belge hükme esas alınmayacak. Tutanağa geçirin; baroya bildirilecek.
          `),
        }),
        prosecution('PS_O_SAVCILIK', undefined, ['ev_siber_rapor', 'ev_ece_ifade', 'ev_sikayet'], {
          maxUses: 3,
          effects: [
            ...wrongEvidence,
            mark('BAD', 'İddianın dayanağı olan belgeyi savunma delili gibi sundun.', 'SORGULAMA'),
          ],
          responses: B(S`hakim: Müdafi, bu belgenin tanığın beyanıyla ilgisi yok.`),
        }),
        pressRule('PR_O1', 'O1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o1')],
          responses: B(S`
            > Hat sahibi bir kadın. Karşınızda bir kadın mı vardı?
            onur: Şey… o gün… yani vekâletle de gelinebiliyor abla. Hanımefendi. Sayın Hâkim.
          `),
        }),
        presentRule('PS_O1', 'O1', ['ev_bayi_belge', 'ded_kopya'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_o1'),
            mark(
              'GOOD',
              'Bayinin kendi yüklediği belgeler: işlem vekille ve fotokopiyle yapılmış, hat sahibi orada değilmiş.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Sayın Hâkim, bayinin kendi operatöre yüklediği dosya. Abone kimliği değil, bir fotokopi. Ve bir vekâletname. Hat sahibi orada değildi.
            onur/saskin: Ben… vekâletle gelinebiliyor. Prosedür…
            hakim: Tanık, az önce "hat sahibi karşımdaydı" dediniz.
            onur/uzgun: …Değildi, efendim.
            - Onur'un elleri yeniden cebine gitti. Hâkim baktı; çıkardı. Bu sefer elleri titriyordu.
          `),
        }),
        presentRule('PS_O1_P', 'O1', ['ev_sim_dokum'], {
          score: { SORGULAMA: 100 },
          effects: [
            inc('pers'),
            raise('o1_kismi'),
            mark(
              'GOOD',
              'Operatör dökümü “vekil aracılığıyla” diyor; bayinin belgeleri tam çürütme olurdu.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Operatörün kaydı: "vekil aracılığıyla." Hat sahibi değil, bir vekil.
            onur: Vekil de yüz yüze gelir abla. Ben vekili kontrol ettim.
          `),
        }),
        pressRule('PR_O2', 'O2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o2')],
          responses: B(S`
            > Hangi sistemde sorgulattınız?
            onur: Noterin… şeyi. Karekodu var ya. Okuttum herhalde. Yani, her zaman okuturum.
          `),
        }),
        presentRule('PS_O2', 'O2', ['ev_noter_yok'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_o2'),
            mark(
              'GOOD',
              'Vekâletnamenin noter kaydında bulunmadığı gösterildi: SIM değişikliği sahte belgeyle yapılmış.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Karekod ve yevmiye numarası noterlik belge doğrulamasında: "Belge bulunamadı." Bu vekâletname hiç düzenlenmemiş.
            onur: Okutmadım. Tamam. Okutmadım. Kuyruk vardı, adam acele ediyordu, kâğıt düzgündü…
            onur: Herkes okutmaz zaten. Kâğıt düzgünse, adam kibarsa, kuyruk uzunsa… Okutmadım. Benim suçum. Bunu yazın.
            savci: Sayın Hâkim, tanık hakkında ayrıca değerlendirme yapılmasını istiyoruz.
          `),
        }),
        pressRule('PR_O3', 'O3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o3')],
          responses: B(S`
            > "Nişanlısıyım" dedi. Siz kimliğine baktınız. Kimlik kimdi, yüz kimdi?
            onur: Kimlik Arda Kılıç. Yüz de… yani kimlikteki gibi. Genç bir çocuktu. Yirmisinde.
          `),
        }),
        presentRule('PS_O3', 'O3_EK', ['ev_arda_beyan', 'ded_arda_kimlik', 'ev_atm'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_o3'),
            raise('tarif_yuzuk'),
            mark('GOOD', 'Tanığın “genç çocuk” beyanı çöktü; gerçek kişiyi tarif etti.', 'SORGULAMA'),
          ],
          responses: B(S`
            > Arda Kılıç bu salonda yemin ederek dinlendi: o bayiye hiç gitmedi. Kimliği, bir kurye ilanıyla alınmıştı. Sizin karşınızdaki kişi kimdi?
            onur/uzgun: …Çocuk değildi. Kırk yaşlarında. Takım elbiseli. Çok kibar. "Efendim" diyordu, sürekli.
            onur: Kolonya kokuyordu, limon. Bir de yüzüğü vardı; eski, yassı, mühür gibi. Kâğıtları uzatırken tezgâha vurdu, tık diye. Unutmadım.
            - Salonda kimse kıpırdamadı. Arka sırada Ece elini ağzına götürdü.
            ~ Bir yüzük. Bir kolonya. Kırk yaşlarında, kibar bir adam. Bir yerden tanıyorum bu tarifi. Ama bir tarif, bir isim değildir.
          `),
        }),
        pressRule('PR_O4', 'O4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o4'), raise('onur_bahsis')],
          responses: B(S`
            > Kimseden bir şey almadınız. Masaya hiçbir şey bırakılmadı mı?
            hakim: Tanık, cevap vermeden önce: kendinizi suçlayacak bir soruya cevap vermek zorunda değilsiniz.
            onur/uzgun: …Bin lira. Masaya bıraktı. "Çay parası" dedi. Ben almasam başkası alırdı. Özür dilerim.
            - Savcı kalemini kaldırdı, sonra indirdi. Hâkim bir şey not etti. Onur'un yüzü kızardı; kulaklarının ucuna kadar.
            ~ Bin lira. Ece'nin bir yılı, bin liraya satılmış bir prosedür.
          `),
        }),
        objectRule('OB_O3', 'O3', 'g_duyum', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('pers'),
            inc('legal_hits'),
            raise('obj_o3'),
            mark('GOOD', 'İtiraz yerinde: “nişanlısıydı” tanığın gözlemi değil, gelen kişinin iddiası.', 'SORGULAMA'),
          ],
          responses: B(S`
            > İtiraz. "Nişanlısıydı" bir gözlem değil; gelen kişinin söylediği.
            hakim: Kabul. Tutanağa "kendini nişanlı olarak tanıttı" diye geçirin.
          `),
        }),
      ],
      presentMiss: fallback('FB_O_PRESENT', 'PRESENT', {
        effects: [...wrongEvidence, mark('BAD', 'Sunulan delil ifadeyle ilgisiz.', 'SORGULAMA')],
        responses: B(S`hakim: Müdafi, bu belgenin bu beyanla ilgisini göremiyorum.`),
      }),
      objectMiss: fallback('FB_O_OBJECT', 'OBJECT', {
        effects: [dec('cred'), score('SORGULAMA', -50, 'hatali'), mark('BAD', 'Dayanaksız itiraz.', 'SORGULAMA')],
        responses: B(S`hakim: İtiraz reddedildi.`),
      }),
      finish: { id: 'T02T_BITIR', label: 'Çapraz sorguyu bitir', next: 'T_03R' },
    }),
    decisionNode('T_03R', [{ to: 'T_03' }], {
      ...TRIAL,
      lines: [
        W(
          flag('onur_bahsis'),
          S`- Onur kürsüden inerken savcının masasının önünde bir an durdu. Kâtip ona bir kâğıt uzattı; ayrı bir tutanak. Bin liranın tutanağı.`,
        ),
        W(
          flag('arda_teslim'),
          S`- Arda kürsüden inerken başını kaldırmadı. "En köşedeki tabelalı yer" demişti. Bir sonraki tanık, o binanın müdürüydü.`,
        ),
        W(
          flag('fact_necdet_hikaye'),
          S`- Bir sonraki tanığın ofisinde bir çay içmiştim. "Gençler ilanlara inanıyor; yazık" demişti. Kürsüye aynı cümleyi getirip getirmeyeceğini merak ediyordum.`,
        ),
      ],
    }),
    court2.stage('T_03', {
      title: 'Tanık: Necdet Sarı',
      courtStage: 'TANIK_DINLEME',
      witness: 'necdet',
      witnessLabel: 'TANIK · NECDET SARI',
      onFirstEnter: [meet('necdet')],
      lines: [
        W(
          flag('tarif_yuzuk'),
          S`
            mubasir: Tanık Necdet Sarı!
            - Necdet ütülü takımıyla, gülümseyerek girdi. Kürsüye geçmeden savcıyı, sonra beni selamladı. Bir limon kolonyası kokusu salona yayıldı.
            - Ellerini kürsünün kenarına koydu. Yüzüğü tahtaya vurdu: tık. !flash
            ~ Tık. Onur'un "unutmadım" dediği ses. Bir tarif, bir kürsü, bir yüzük. Ama bir isim için bir kâğıt gerek.
            hakim: Kimliğiniz tespit edildi; yemin ettiniz. Nova Dijital'i anlatın.
          `,
        ),
        O(S`
          mubasir: Tanık Necdet Sarı!
          - Necdet ütülü takımıyla, gülümseyerek girdi. Kürsüye geçmeden savcıyı, sonra beni selamladı. Bir limon kolonyası kokusu salona yayıldı.
          hakim: Kimliğiniz tespit edildi; yemin ettiniz. Nova Dijital'i anlatın.
          necdet: Memnuniyetle efendim. Biz burada güven satıyoruz. Elimden ne gelirse.
          - Ellerini kürsünün kenarına koydu, sonra kucağında birleştirdi. Yüzüğü ışıkta bir an parladı; kimse dikkat etmedi. Bir müdürün yüzüğüne kim dikkat eder?
          necdet: Nova iki ay kiracımızdı. Sanal ofis. Sözleşmeyi ben yaptım; isteyen herkese örneğini veririm. Kâğıt üstünde ne varsa o, Sayın Hâkim.
        `),
      ],
      choices: [cont('T03_DEVAM', 'Tanığı dinle', 'T_03T')],
    }),
    court2.testimony('T_03T', {
      title: 'Çapraz sorgu: Necdet Sarı',
      courtStage: 'TANIK_DINLEME',
      witness: 'necdet',
      witnessLabel: 'TANIK · NECDET SARI',
      say: S`hakim: Müdafi, sorularınız?`,
      rulesText: 'Bastır, sun. Bir belge ancak onu bir başka belgeyle eşleştirebildiğinde konuşur.',
      objectionGrounds: ['g_kanaat', 'g_duyum', 'g_telkin'],
      statements: [
        statement('N1', 1, [
          'Nova’yı ',
          hl('Arda Kılıç kiraladı; kendisi geldi, imzaladı, nakit ödedi', any(flag('press_n1'), has('ev_arda_beyan'))),
          '.',
        ]),
        statement('N2', 2, [
          '407 numaralı oda iki ay kapalı kaldı. ',
          hl('Nova’dan kimse binaya gelmedi', any(flag('press_n2'), has('ded_bina'))),
          '.',
        ]),
        statement('N3', 3, [
          'Kaan diye birini tanımam. ',
          hl('O telefon numaralarıyla hiçbir ilgim yok', any(flag('press_n3'), has('ev_imei_rapor'))),
          '; ilk kez duyuyorum.',
        ]),
        statement(
          'N4',
          4,
          [
            'Yönetim park yeri benim; ama ',
            hl('o aylarda aracım servisteydi, kimse kullanmadı', has('ded_otopark')),
            '.',
          ],
          flag('press_n1'),
        ),
      ],
      rules: [
        presentRule('PS_N_ILLEGAL', undefined, ['ev_bayi_ekran'], {
          effects: illegalPresented('bayi sistemi ekran görüntüsü'),
          responses: B(S`
            savci/kizgin: Bu belge yetkisiz erişimle alınmış!
            hakim: Hükme esas alınmayacak. Tutanağa geçirin.
            necdet/mutlu: Gençlik, efendim. Hepimiz hata yaparız.
          `),
        }),
        prosecution('PS_N_SAVCILIK', undefined, ['ev_siber_rapor', 'ev_ece_ifade', 'ev_sikayet'], {
          maxUses: 3,
          effects: [
            ...wrongEvidence,
            mark('BAD', 'İddianın dayanağı olan belgeyi savunma delili gibi sundun.', 'SORGULAMA'),
          ],
          responses: B(S`hakim: Müdafi, bu belgenin tanığın beyanıyla ilgisi yok.`),
        }),
        pressRule('PR_N1', 'N1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_n1')],
          responses: B(S`
            > Arda Kılıç'ı kaç kez gördünüz?
            necdet: Bir kez efendim. İmzaya geldi. Genç, çekingen. Sonra bir daha görmedim; ne otoparkta ne başka yerde.
            - Bunu söylerken savcıya baktı; bana değil. Kürsüde konuşan herkes kime anlattığını seçer.
            > Otoparkta?
            necdet: Laf gelişi efendim. Yönetimin bir park yeri var; ben kullanırım. Ama o aylarda aracım servisteydi.
          `),
        }),
        presentRule('PS_N1', 'N1', ['ev_arda_beyan', 'ded_arda_kimlik'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_n1'),
            mark(
              'GOOD',
              'Sözleşmeyi “kendisi imzaladı” denen kişinin hiçbir sözleşme imzalamadığı ve kimliğinin iki sahte belgede kullanıldığı gösterildi.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Arda Kılıç bu salonda yeminle söyledi: hiçbir sözleşme imzalamadı. Kimliğinin fotoğrafını bir "kurye işi" için vermişti. Aynı kimlik, bayideki sahte vekâletnamede de var.
            necdet: Efendim, gençler unutkan olur. İmzasını atar, unutur.
            > Peki ya Arda Kılıç'ın kimliği bayideki vekâletnamede neden var? O vekâletnameyi de mi unuttu?
            necdet: Onu bilemem efendim. Benim işim bina. Bayiyle bir ilgim yok.
            hakim: Tanık, sözleşmeyi imzalatırken kimliğin aslını gördünüz mü?
            necdet: …Fotokopisini gördüm, Sayın Hâkim. Aslını getireceğini söyledi.
          `),
        }),
        pressRule('PR_N2', 'N2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_n2')],
          responses: B(S`
            > Hiç kimse gelmedi. Peki Nova'nın İK'sı telefonda "iş merkezindeyiz" diyordu. Hangi iş merkezinde?
            necdet: Bilemem efendim. Kâğıt üstünde bizdeydiler. Kâğıt başka, hayat başka.
          `),
        }),
        presentRule('PS_N2', 'N2', ['ded_bina'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_n2'),
            mark('GOOD', 'İki ayrı kurbanın görüşmesinde aynı asansör anonsu: “Kaan” fiilen binadaydı.', 'SORGULAMA'),
          ],
          responses: B(S`
            > Sanık, mülakatında Kaan'ın arkasından "Dördüncü kat" anonsunu duydu. Katılan, satıcıyla konuşurken aynı anonsu duydu ve dilekçesine yazdı. Sizin binanızın asansörü.
            > Kimse gelmediyse, Kaan dördüncü katta neyle konuşuyordu?
            necdet: Efendim, dördüncü katta altı ofis var. Kırk kişi çalışır. Asansör herkesindir.
            ~ Haklı. Asansör herkesin. Ama telefonun içinde ne olduğu, herkesin değil.
            hakim: Tanık, Nova'nın ofisi olarak gösterilen 407 numaralı oda boş bir oda mıydı?
            necdet: …Arşiv odasıydı, Sayın Hâkim. Kâğıt üstünde Nova'ya verdik. Fiilen arşiv olarak kaldı. Yönetimin arşivi.
            - Savcı başını kaldırdı ve bir şey yazdı. Kısa bir şey.
          `),
        }),
        presentRule('PS_N2_P', 'N2', ['ev_ilan_foto'], {
          score: { SORGULAMA: 100 },
          effects: [
            inc('pers'),
            raise('n2_kismi'),
            mark(
              'GOOD',
              'Sahte ilanın fotoğrafı binanın önünde çekilmiş; ama bu, binada kimin olduğunu göstermez.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Katılanın sunduğu ilan fotoğrafı. Arabanın arkasındaki cam cephede iki harf: "OM."
            necdet/mutlu: Binamız güzeldir efendim, önünde çok fotoğraf çekilir. Gelinler bile çekilir.
          `),
        }),
        pressRule('PR_N3', 'N3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_n3')],
          responses: [
            W(
              any(flag('tarif_yuzuk'), flag('arda_yuzuk'), has('clue_yuzuk_ece')),
              S`
                > Cep telefonunuzun numarası nedir, Necdet Bey?
                necdet: Kartvizitimde yazıyor efendim, size de vermiştim. Saklayacak bir şeyim yok.
                - Yüzüğünü çevirdi. Mühür, ışıkta bir an parladı.
                ~ Ece'nin iki saniyelik kamerası. Arda'nın yarım inen camı. Onur'un tezgâhı. Üç yüzük mü, bir yüzük mü? Bunu bir yüzük söyleyemez. Bir rapor söyler.
              `,
            ),
            O(S`
              > Cep telefonunuzun numarası nedir, Necdet Bey?
              necdet: Kartvizitimde yazıyor efendim, size de vermiştim. Saklayacak bir şeyim yok.
            `),
          ],
        }),
        presentRule('PS_N3', 'N3', ['ded_necdet'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 3),
            raise('contra_n3'),
            raise('necdet_ifsa'),
            mark(
              'GOOD',
              'İMEİ raporu ile kartvizit: tanığın hattı, “Kaan”ın kullandığı cihaza takılmış. Gerçek fail ortaya çıktı.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Sayın Hâkim, savcılığın İMEİ sorgusu. Kopya SIM'in takıldığı cihaz: aynı cihazda Nova İK'nın hattı ve 2 Kasım 23.48'de, altı dakika, bir şirket hattı: 0533 287 19 90.
            > Tanığın bana kendi eliyle verdiği kartvizit. Cep numarası: 0533 287 19 90.
          `),
          next: 'T_03X',
        }),
        presentRule('PS_N3_K', 'N3', ['ev_imei_rapor'], {
          visibleWhen: has('clue_kartvizit'),
          enabledWhen: has('clue_kartvizit'),
          score: { SORGULAMA: 250 },
          effects: [
            inc('pers', 3),
            raise('contra_n3'),
            raise('necdet_ifsa'),
            mark('GOOD', 'İMEİ raporundaki şirket hattını tanığın kartvizitindeki numarayla eşleştirdin.', 'SORGULAMA'),
          ],
          responses: B(S`
            > Savcılığın İMEİ raporu. "Kaan"ın cihazına 2 Kasım 23.48'de altı dakikalığına takılan hat: 0533 287 19 90. Abone, OM İş Merkezi Yönetim.
            > Ve tanığın kartviziti, Sayın Hâkim. Aynı numara.
          `),
          next: 'T_03X',
        }),
        presentRule('PS_N3_P', 'N3', ['ev_imei_rapor'], {
          visibleWhen: not(has('clue_kartvizit')),
          enabledWhen: not(has('clue_kartvizit')),
          score: { SORGULAMA: 100 },
          effects: [
            inc('pers'),
            raise('n3_kismi'),
            mark(
              'GOOD',
              'Raporda tanığın şirketine ait bir hat var; ama hattı tanığın kendisine bağlayan bir belge sunamadın.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > İMEİ raporu: "Kaan"ın cihazında bir şirket hattı. Abone: OM İş Merkezi Yönetim.
            necdet: Şirketin kırk hattı var efendim. Temizlikçiler, güvenlik, teknik. Hangisi, kim, bilemem. Araştırılsın, ben de isterim.
            savci: Sayın Hâkim, bu hattın kime zimmetli olduğu ayrıca araştırılabilir.
            ~ Kırk hat. Birinin kimde olduğunu gösteren bir kâğıdım olsaydı. Bir kart. Küçük, kabartma bir kart.
          `),
        }),
        pressRule('PR_N4', 'N4', {
          score: { SORGULAMA: 25 },
          responses: B(S`
            > Aracınız serviste. Hangi servis, hangi tarihler?
            necdet: Efendim, bir yıl önce… Hatırlamam. Bir arkadaşın dükkânı. Fatura kesmez, biliyorsunuz.
            ~ Fatura kesmeyen bir servis. Kayıt tutmayan bir otopark köşesi. Bu adamın etrafında kâğıt hep eksik.
          `),
        }),
        presentRule('PS_N3_IMEI', 'N3', ['ded_imei', 'ev_hts'], {
          score: { SORGULAMA: 100 },
          effects: [
            inc('pers'),
            raise('n3_imei'),
            mark(
              'GOOD',
              'Kopya SIM’in başka bir cihazda olduğu gösterildi; ama o cihazı tanığa bağlayan belge sunulmadı.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Kopya SIM, Ece Yalın'ın telefonuna değil, başka bir cihaza takıldı. IMEI 35 491207 ile başlayan bir cihaz.
            necdet: Efendim, bir cihaz numarası. Benim telefonum bu değil; isterseniz bakın, burada. Ben ne bileyim kimin cihazı.
            ~ Bir cihaz numarası. Cihazın içinde başka neler yaşadığını sormadan, bu numara yalnızca bir numara.
          `),
        }),
        presentRule('PS_N1_SOZ', 'N1', ['ev_sozlesme'], {
          score: { SORGULAMA: -50 },
          effects: [
            dec('pers'),
            mark(
              'BAD',
              'Tanığın kendi hazırladığı sözleşme onun beyanını destekler; çelişkiyi başka bir delil göstermeliydi.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            necdet/mutlu: İşte efendim, sözleşme. Ben de onu söylüyorum. İmzası orada.
            hakim: Müdafi, bu belge tanığı doğruluyor.
          `),
        }),
        presentRule('PS_N4', 'N4', ['ded_otopark'], {
          score: { SORGULAMA: 200 },
          effects: [
            inc('pers', 2),
            raise('contra_n4'),
            mark(
              'GOOD',
              'Paranın teslim edildiği yer, tanığın “kimse kullanmadı” dediği yönetim park yeriydi.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Arda Kılıç parayı otoparkın köşesindeki tabelalı yerde bekleyen bir araca verdi. O köşede tek bir tabela var: "YÖNETİM — 1."
            necdet: Efendim, park yerine herkes park eder, ben kızmam.
            hakim: Az önce "kimse kullanmadı" dediniz.
            necdet: …Laf gelişi, Sayın Hâkim.
          `),
        }),
        objectRule('OB_N2', 'N2', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('pers'),
            inc('legal_hits'),
            raise('obj_n2'),
            mark(
              'GOOD',
              'İtiraz yerinde: tanık binaya kimin girip çıktığını bilmediği hâlde kesin konuşuyor.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > İtiraz. Tanık kamerası on beş gün kayıt tutan bir binada, bir yıl önce kimin gelmediğini kesin söylüyor.
            hakim: Kabul. Tanık, bildiğinizi anlatın.
          `),
        }),
      ],
      presentMiss: fallback('FB_N_PRESENT', 'PRESENT', {
        effects: [...wrongEvidence, mark('BAD', 'Sunulan delil ifadeyle ilgisiz.', 'SORGULAMA')],
        responses: B(S`
          hakim: Müdafi, bunun tanığın beyanıyla ilgisi ne?
          necdet/mutlu: Ben de anlamadım efendim, ama memnuniyetle bakarım.
        `),
      }),
      objectMiss: fallback('FB_N_OBJECT', 'OBJECT', {
        effects: [dec('cred'), score('SORGULAMA', -50, 'hatali'), mark('BAD', 'Dayanaksız itiraz.', 'SORGULAMA')],
        responses: B(S`hakim: İtiraz reddedildi.`),
      }),
      finish: { id: 'T03T_BITIR', label: 'Çapraz sorguyu bitir', next: 'T_035' },
    }),
    story('T_03X', {
      ...court2.base,
      title: 'Altı dakika',
      background: 'durusma_salonu',
      lines: B(S`
        - Necdet bir an hiçbir şey söylemedi. Sonra güldü; ama gülüşü yüzüne yetişemedi.
        necdet: O gece… telefonumun şarjı bitmişti. Bir telefon buldum masada, kayıp eşyadan. Eşimi aramak için kartımı taktım. Altı dakika. Bu bir suç mu efendim?
        hakim: O telefonu masada mı buldunuz?
        necdet: …Evet. Kayıp eşya. Kiracılardan biri unutmuştur.
        savci: Sayın Hâkim. Kopya SIM'in takıldığı, Nova İK hattının ve satıcı hattının kullanıldığı cihaz, tanığın "kayıp eşyasından" çıkıyor. Kayıp eşya defterini görmek isteriz.
        - Necdet yüzüğünü çevirdi. Bir kez, iki kez. Kürsüye vurmadı bu sefer. !shake
        savci: Tanık hakkında suç duyurusunda bulunuyorum. Dosyanın bir örneğinin Başsavcılığa gönderilmesini talep ederim.
        hakim: Talep kabul. Tanık, salonu terk etmeyin. Kolluk görevlisi, lütfen.
        - Salonun arka sırasında Ece iki elini yüzüne kapattı. Sevim ona sarıldı.
        ~ "Biz burada güven satıyoruz." Bir yıl boyunca bir binanın dördüncü katında güven satmış. Altı dakikalık bir şarj meselesi, dükkânı kapattı.
      `),
      choices: [cont('T03X_DEVAM', 'Devam', 'T_035', { role: 'PRIMARY' })],
    }),
    choiceNode('T_035', {
      ...court2.base,
      title: 'Sanığın diyeceği',
      background: 'durusma_salonu',
      prompt: { speaker: 'hakim', text: 'Sanık, tanık beyanlarına karşı diyeceğiniz?' },
      next: 'T_04',
      choices: [
        option('T035_A', '“Arda’yı ilk kez görüyorum. Ama onun hikâyesi benim hikâyem.”', {
          score: { SAVUNMA_STRATEJISI: 30 },
          effects: [inc('pers')],
          good: 'Sanığın beyanlara karşı diyeceği (CMK 215) sakin ve tutarlı; başka bir kurbanı suçlamadan kendi durumunu anlattı.',
          responses: B(S`
            ece: Arda'yı ilk kez görüyorum. Ama onun hikâyesi benim hikâyem. Bir ilan, bir kimlik fotoğrafı, bir "abi". Ben de "Kaan Bey" dedim. O da "Kaan Abi."
            ece: Bayideki arkadaş… kızgın değilim. Bin lira. Ben de bir kulaklık aldım dört bin beş yüzle. Hepimiz bir şeyle kandırıldık.
            - Arda başını kaldırıp Ece'ye baktı. Sonra yeniden yere.
          `),
        }),
        option('T035_B', '“Bayideki çocuk yalan söyledi. O da cezalandırılsın.”', {
          effects: [dec('pers')],
          bad: 'Sanığın bir tanığı suçlaması savunmaya bir şey kazandırmaz; tanığın durumu ayrıca değerlendirilir.',
          responses: B(S`
            ece/kizgin: Yalan söyledi! Benim bir yılımı bin liraya sattı! O da cezalandırılsın!
            hakim: Sanık, tanık hakkında karar vermek size düşmez. Not edildi.
          `),
        }),
        option('T035_C', '“Diyeceğim yok, efendim.”', {
          neutral: 'Diyecek hakkı kullanılmadı; hükmü kendiliğinden etkilemez.',
          responses: B(S`ece: Diyeceğim yok, efendim.`),
        }),
      ],
    }),
    court2.objection('T_04', {
      title: 'Savcının çıkışı',
      courtStage: 'DELIL_TARTISMA',
      onFirstEnter: [ifThen(all(flag('ece_inkar'), not(flag('ece_hazir'))), [dec('cred'), dec('pers')])],
      lines: [
        W(
          flag('necdet_ifsa'),
          S`
            savci: Sayın Hâkim, dosyanın ağırlık merkezi değişti. Ama bir soru kalıyor: sanık kodu okudu. Bu, en azından yardım etme değil mi?
            hakim: Müdafi?
          `,
        ),
        W(
          any(flag('ece_durust'), flag('kod_ortaya')),
          S`
            savci: Sayın Hâkim, sanık kodu okuduğunu kabul etti. Kod okunmasaydı cihaz tanımlanamazdı. Bu, suça katılmaktır; olmasa bile yardım etmektir.
            savci: Yardım eden de cezalandırılır; cezası indirilir, ama cezalandırılır. Hesabın anahtarını veren, kapıdan girenin yanında durmuş sayılır.
            ~ Kapıdan girenin yanında. Kapının bir kapı olduğunu bilmiyorsan, yanında mı durursun, önünde mi?
            hakim: Müdafi?
          `,
        ),
        W(
          flag('ece_inkar'),
          S`
            savci: Sayın Hâkim, sanık iki kez "kimseyle kod paylaşmadım" dedi. Banka kaydı 14.29'da yeni bir cihazın kodla tanımlandığını söylüyor. Kod ya sanıktaydı ya paylaşıldı. Sanık yalan söylüyor.
            - Ece bana baktı. Ben ona baktım. İkimiz de aynı taşı taşıyorduk.
            hakim: Müdafi?
          `,
        ),
        O(S`
          savci: Sayın Hâkim, cihaz kodla tanımlandı. Kod sanığın telefonuna geldi. Sanık bunu açıklamadı. Bu suskunluk, katılımın kendisidir.
          hakim: Müdafi?
        `),
      ],
      next: 'T_045',
      options: [
        option('T04_A', 'Aldatılarak verilen bilgi iştirak değildir; katılmak için neye katıldığını bilmek gerekir.', {
          effects: [
            ifThen(
              any(has('ded_aldatma'), flag('ece_durust'), flag('necdet_ifsa')),
              [
                score('HUKUKI_BILGI', 150),
                inc('legal_hits'),
                inc('pers'),
                raise('istirak_cevap'),
                mark(
                  'GOOD',
                  'İştirak kasıtlı bir fiile kasten katılmayı gerektirir (TCK 37, 39, 40/1); aldatılarak bilgi veren kişide kast yoktur (TCK 21/1). Cevap delille desteklendi.',
                  'HUKUKI_BILGI',
                ),
              ],
              [
                score('HUKUKI_BILGI', 50),
                mark(
                  'NEUTRAL',
                  'Hukuki cevap doğru; ama aldatmayı gösteren bir delil ortaya koymadın.',
                  'HUKUKI_BILGI',
                ),
              ],
            ),
          ],
          responses: [
            W(
              any(has('ded_aldatma'), flag('ece_durust')),
              S`
                > Fail de yardım eden de, katıldığı fiili bilmek zorundadır. Sanık bankanın kodunu değil, "SGK işe giriş kodunu" okuduğunu sanıyordu. Mesaj ve not dosyada.
                > Kod okunmadan cihaz tanımlanamazdı, doğru. Ama kod, bir yalanla istendi. Yalanı söyleyen fail; yalana inanan değil.
                > Aldatılan kişi, kendisini aldatanın suçuna ortak olmaz. Olsaydı, bu salondaki katılan da kaporayı göndererek suça katılmış olurdu.
                - Nurettin başını kaldırdı. Bana ilk kez kızgın değil, şaşkın baktı.
                hakim: Not edildi.
              `,
            ),
            O(S`
              > Fail de yardım eden de, katıldığı fiili bilmek zorundadır. Sanığın bildiğine dair tek bir delil yok.
              savci: Bilmediğine dair de yok, müdafi.
              ~ Haklı. Bir hukuk cümlesi, altında bir kâğıt yoksa havada kalır.
            `),
          ],
        }),
        option('T04_B', 'Katkı olsa olsa kodu vermekle sınırlıdır; ceza yarı oranında indirilmelidir.', {
          effects: [raise('terditli_erken'), dec('pers')],
          neutral:
            'TCK 158/4 (7589 s.K., lehe kanun TCK 7/2) katkının hesap bilgisini vermekle sınırlı olmasını şart koşar; bunu delil tartışmasında ileri sürmek, kastı kabul etmek gibi okunur. Yeri esas savunmadır, terditli.',
          responses: B(S`
            savci: Müdafi katkıyı kabul ediyor. Not edelim.
            ece/saskin: Ama ben…
            ~ Leyla'nın kapısını erken açtım. İçeri ilk giren, savcı oldu.
          `),
        }),
        option('T04_C', 'Kod paylaşmak ayrı bir suçtur ve dava zamanaşımına uğramıştır.', {
          score: { HUKUKI_BILGI: -50 },
          effects: [dec('cred')],
          bad: 'Aldatılarak kod okumak ayrı bir suç değildir; bir yıllık süre de zamanaşımına uğratmaz (TCK 66).',
          responses: B(S`hakim: Müdafi, hangi suç, hangi zamanaşımı? Reddedildi.`),
        }),
        option('T04_D', 'Diyeceğimiz yok.', {
          effects: [dec('pers')],
          bad: 'Savcının iştirak iddiasına cevap verilmedi; kast tartışması savunmanın en güçlü alanıydı.',
          category: 'HUKUKI_BILGI',
        }),
      ],
    }),
    story('T_045', {
      ...court2.base,
      title: 'Katılanın beyanı',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('necdet_ifsa'),
          S`
            hakim: Katılan, esas hakkında beyanınız?
            nurettin: Sayın Hâkim, ben bir yıl bu kızın adını cüzdanımda taşıdım. Yanlış adı taşımışım.
            nurettin: Benim şikâyetim, telefondaki sesten. O ses bugün burada konuştu; tanıdım. "Efendim" diyordu. Bu kızdan şikâyetçi değilim.
            - Ece ağlamadı. Ama başını eğdi; bir öğretmenin önünde eğilir gibi.
          `,
        ),
        W(
          flag('nurettin_yumusadi'),
          S`
            hakim: Katılan, esas hakkında beyanınız?
            nurettin: Sayın Hâkim, param gitti; bu kesin. Kimin aldığı… bugün daha az kesin. Takdir mahkemenizin. Ben yalnızca paramı geri istiyorum. Kimden alınacaksa.
            nurettin: Bir şey daha. Bir yıl boyunca bu kızın adını eşime söylemedim. "Bir dolandırıcı" dedim. Bugün eve gidince adını söyleyeceğim. Hangi cümleyle söyleyeceğimi bilmiyorum.
            - Ece başını kaldırdı. Nurettin'e baktı. Nurettin bakışını kaçırmadı; ilk kez.
          `,
        ),
        O(S`
          hakim: Katılan, esas hakkında beyanınız?
          nurettin: Sayın Hâkim, param gitti. Hesap bu kızın. Cezalandırılmasını istiyorum. Başka bir şey bilmem; bilmem de gerekmez.
        `),
      ],
      choices: [cont('T045_DEVAM', 'Mütalaa', 'T_05', { role: 'PRIMARY' })],
    }),
    court2.objection('T_05', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      lines: [
        W(
          flag('necdet_ifsa'),
          S`
            savci: Mütalaamdır: toplanan deliller, cihaz kaydı, iletişim tespiti, sahte vekâletname ve İMEİ raporu birlikte değerlendirildiğinde, suçun sanık tarafından işlenmediği sabittir.
            savci: Sanığın atılı suçtan beraatine; Necdet Sarı hakkında ayrıca işlem yapılmak üzere dosyanın bir örneğinin Başsavcılığa gönderilmesine karar verilmesini talep ederim.
            hakim: Müdafi, mütalaaya karşı diyeceğiniz?
          `,
        ),
        W(
          all(ref('sim_proven'), ref('cihaz_proven')),
          S`
            - Savcı Tarık Özen ayağa kalktı; bu kez dosyayı açtı. Bir sayfayı uzun uzun okudu, sonra kapattı. Konuşmaya başlamadan önce Ece'ye bir an baktı.
            savci: Sayın Hâkim, geçen celse "gerisi hikâye" dedim. Gerisinin hikâye olmadığı anlaşıldı. Bunu söylemek de görevimin parçası.
            savci: Mütalaamdır: hat 4 Kasım sabahı sanığın elinden çıkmış, işlemler başka bir cihazdan yapılmıştır. Sanığın suça katıldığına dair her türlü şüpheden uzak delil elde edilememiştir.
            savci: Sanığın atılı suçtan beraatine karar verilmesini talep ederim.
            hakim: Müdafi, mütalaaya karşı diyeceğiniz?
          `,
        ),
        O(S`
          savci: Sanık bir iş ilanından söz ediyor; ilanı veren kişi bulunamamıştır. Hat değişikliği iddia edilmiş; ancak bu değişikliğin sanığın bilgisi dışında yapıldığı kesin olarak gösterilememiştir.
          savci: Mütalaamdır: hesap sanığa aittir; suçtan elde edilen para sanığın hesabına girmiş ve çıkmıştır. Sanığın üzerine atılı nitelikli dolandırıcılık suçundan cezalandırılmasını talep ederim.
          hakim: Müdafi, mütalaaya karşı diyeceğiniz?
        `),
      ],
      next: 'T_07',
      options: [
        option('T05_A', 'Hesabın o gün sanığın elinde olmadığı belgelerle sabittir; şüphe değil, olgu.', {
          effects: [
            ifThen(
              all(ref('sim_proven'), ref('cihaz_proven')),
              [
                score('USUL_BILGISI', 100),
                inc('legal_hits'),
                mark(
                  'GOOD',
                  'Cevap hakkı yerinde kullanıldı (CMK 216/2) ve dosyadaki belgelere dayandı.',
                  'USUL_BILGISI',
                ),
              ],
              [
                score('USUL_BILGISI', -40),
                dec('pers'),
                mark(
                  'BAD',
                  '“Belgelerle sabit” dedin; ama hattın ve cihazın sanığın elinde olmadığını ortaya koyan belgeleri tartıştırmamıştın.',
                  'USUL_BILGISI',
                ),
              ],
            ),
          ],
          responses: B(S`
            > Sayın Hâkim, bu dosyada bir yıl boyunca tek bir soru sorulmadı: o gün telefon kimin elindeydi? Bugün bu soru, belgelerle cevaplandı.
            > Hat sabah 10.12'de bir başka bayide, sahte bir vekâletnameyle kopyalandı. İşlemler sanığın telefonundan değil, başka bir cihazdan yapıldı. Bunlar varsayım değil, kayıttır.
          `),
        }),
        option('T05_B', 'Kolluk soruşturması eksiktir; eksik soruşturmanın bedelini sanık ödeyemez.', {
          score: { USUL_BILGISI: 60 },
          effects: [inc('legal_hits')],
          good: 'Kolluğun cihaz ve hat kayıtlarını toplamaması eksik soruşturmadır (CMK 160/2); şüphe sanık lehine değerlendirilir.',
          responses: B(S`
            > Bir yıl boyunca kimse cihazı sormadı. Kimse hattı sormadı. Sorulmayan soruların cevabı sanığın aleyhine yazılamaz.
            > Bir kız bir yıl boyunca "kimseyle kod paylaşmadım" cümlesinin içinde yaşadı; çünkü kimse ona "telefonun nerede" diye sormadı. Bugün soruldu.
            - Hâkim kalemini bıraktı ve dinledi. Bazı cümleler tutanağa geçmek için değil, bir salondan geçmek için söylenir.
          `),
        }),
        option('T05_C', 'Mütalaanın tutanaktan çıkarılmasını talep ediyoruz.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Mütalaa tutanaktan çıkarılmaz; müdafi ona cevap verir (CMK 216/2).',
          responses: B(S`hakim: Reddedildi. Cevap verecekseniz verin.`),
        }),
        option('T05_D', 'Mütalaaya katılıyoruz; ayrıca söyleyeceğimiz yok.', {
          visibleWhen: any(flag('necdet_ifsa'), all(ref('sim_proven'), ref('cihaz_proven'))),
          neutral:
            'Beraat mütalaasına katılmak meşrudur; ama esas savunmada hangi beraat nedeninin uygulanacağını ayrıca göstermelisin.',
        }),
      ],
    }),
    choiceNode('T_07', {
      ...court2.base,
      title: 'Esas hakkında savunma',
      prompt: { speaker: 'hakim', text: 'Müdafi, esas hakkındaki savunmanızı yapın.' },
      next: 'T_07S1',
      choices: [
        option('T07_A', 'Suç sanık tarafından işlenmemiştir; gerçek fail dosyadadır.', {
          effects: [
            ifThen(
              all(flag('necdet_ifsa'), ref('sim_proven')),
              [
                score('SAVUNMA_STRATEJISI', strategyAmount(200, 'MASUMIYET')),
                inc('pers'),
                raise('gercek_fail'),
                mark(
                  'GOOD',
                  'CMK 223/2-b: suçun sanık tarafından işlenmediği sabit; gerçek fail belgelerle gösterildi.',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
              [
                score('SAVUNMA_STRATEJISI', -100),
                dec('pers'),
                mark(
                  'BAD',
                  'Gerçek fail iddiası belgeyle desteklenmedi; heyet bir isim değil, bir kanıt bekler.',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
            ),
          ],
          responses: [
            W(
              flag('necdet_ifsa'),
              S`
                > Sayın Hâkim. Bir iş ilanı. Bir kimlik fotoğrafı. Bir "SGK kodu." Bir sahte vekâletname. Bir kopya SIM. Ve bir cihaz.
                > O cihaz bir yıl boyunca bir binanın dördüncü katında yaşadı. Bir gece şarjı biten bir adam, kendi hattını ona taktı. Altı dakika.
                > Ece Yalın bu dosyada fail değil; bu dosyanın ilk kurbanı. İkincisi katılan. Üçüncüsü bir kurye. Suçun sanık tarafından işlenmediği sabittir. Beraatini talep ederiz.
              `,
            ),
            O(S`
              > Sayın Hâkim, bu suçu müvekkilim işlemedi. Başka biri işledi. Kim olduğunu… dosya henüz söylemiyor.
              ~ "Henüz." Mahkeme "henüz"le hüküm kurmaz.
            `),
          ],
        }),
        option('T07_B', 'Sanığın suçu işlediği sabit değildir; kalan şüphe sanık lehinedir.', {
          effects: [
            ifThen(
              all(ref('sim_proven'), ref('cihaz_proven')),
              [
                score('SAVUNMA_STRATEJISI', strategyAmount(200, 'USUL')),
                inc('pers'),
                mark(
                  'GOOD',
                  'CMK 223/2-e: hat ve cihaz sanığın elinde değildi; mahkûmiyete yeter kesin delil yok, şüphe sanık lehine.',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
              [
                score('SAVUNMA_STRATEJISI', -100),
                mark(
                  'BAD',
                  'Şüphe savunması için hattın ve cihazın sanığın elinde olmadığını gösteren deliller ortaya konmadı.',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
            ),
          ],
          responses: B(S`
            > Bir yıl önce bir genç kız bir iş ilanına başvurdu. Yüz kırk üçüncü başvurusuydu. Ona "ailemize hoş geldiniz" dendi. Kimliği, fotoğrafı ve bir kodu istendi; verdi.
            > Ertesi sabah hattı başka bir bayide, sahte bir vekâletnameyle, onun masasında çekilmiş bir fotoğraftan basılmış bir fotokopiyle kopyalandı. Kopya SIM başka bir telefona takıldı.
            > Sayın Hâkim. Hesap Ece Yalın'ın. Ama o gün, o saatte, o hesap onun elinde değildi. Hattı başka bir bayide, başka bir cebe geçirildi; işlemler başka bir telefondan yapıldı.
            > Savcılık bir yıl önce bir soruya cevap aramadı: telefon kimin elindeydi? Bugün cevap dosyada. Telefon, Ece'nin elinde değildi.
            > Bir yıl boyunca bir telefon, bir kızın masumiyetinin önünde duvar oldu. Bugün o telefonun Ece'nin değil, başka birinin cebinde olduğu kayıtlarla ortaya kondu.
            > Ece bir ilana inandı; tıpkı katılanın inandığı gibi. İnanmak suç değil. Mahkûmiyet, şüphenin üstüne kurulamaz. Beraatini talep ederiz.
          `),
        }),
        option(
          'T07_C',
          'Öncelikle beraat; aksi hâlde katkının kodu vermekle sınırlı olduğu kabul edilsin, lehe hükümler uygulansın.',
          {
            score: { SAVUNMA_STRATEJISI: strategyAmount(150, 'INDIRIM') },
            effects: [raise('terditli')],
            good: 'Terditli savunma meşrudur: önce beraat; olmazsa TCK 158/4 (lehe kanun, TCK 7/2), TCK 62 ve CMK 231.',
            responses: B(S`
            > Sayın Hâkim, öncelikle beraat. Mahkemeniz aksi kanaatteyse: sanığın katkısı, aldatılarak okuduğu bir koddan ibarettir. Temmuzdaki değişiklikle bu hâlde ceza yarı oranında indirilir.
            > Sanığın sabıkası yok; pişmanlığı, kodu kendi ağzıyla anlatmasından belli. Lehe bütün hükümlerin uygulanmasını talep ederiz.
            ~ Kapıyı açtım. Leyla en sona sakla demişti. Sonuna geldik mi, bilmiyorum.
          `),
          },
        ),
        option('T07_D', 'Bu kızın gözlerine bakın. Bir dolandırıcı böyle mi bakar?', {
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('pers')],
          bad: 'Duygusal söylem delilin yerini tutmaz; heyet gözlere değil, dosyaya bakar.',
          responses: B(S`
            > Sayın Hâkim, bu kızın gözlerine bakın.
            savci: Sayın Hâkim, ben dosyaya bakmayı tercih ederim.
            hakim: Ben de, savcı bey.
          `),
        }),
      ],
    }),
    decisionNode('T_07S1', [{ to: 'T_07S2' }], {
      ...TRIAL,
      lines: [
        W(
          all(any({ chosen: 'T07_A' }, { chosen: 'T07_B' }), flag('fact_kaan_erkek')),
          S`> Katılan bu salonda söyledi: telefondaki satıcı bir erkekti, kendini Kaan diye tanıttı. Sanık sandalyesinde oturan kişi değil.`,
        ),
        W(
          all(any({ chosen: 'T07_A' }, { chosen: 'T07_B' }), flag('fact_nurettin_anons')),
          S`> Katılan bir ayrıntı daha not etmişti: satıcının arkasında bir asansör, "Dördüncü kat." Sanık aynı sesi mülakatında duydu.`,
        ),
      ],
    }),
    decisionNode('T_07S2', [{ to: 'T_08' }], {
      ...TRIAL,
      lines: [
        W(
          all(any({ chosen: 'T07_A' }, { chosen: 'T07_B' }, { chosen: 'T07_C' }), flag('fact_itiraz_tutanak')),
          S`> Ve sanık, aynı akşam, kimse ona sormadan operatöre gitti ve "işlemi ben yapmadım" diye imza attı. Bir dolandırıcı, ganimetini topladığı gün itiraz dilekçesi vermez.`,
        ),
        W(
          all(any({ chosen: 'T07_A' }, { chosen: 'T07_B' }), flag('fact_zincir')),
          S`> Avansı gönderen hesap da, kripto hesabı da başka kurbanların kimlikleriyle açılmış. Bu bir zincir, Sayın Hâkim. Ece Yalın onun halkalarından biri.`,
        ),
      ],
    }),
    choiceNode('T_08', {
      ...court2.base,
      title: 'Son söz',
      prompt: { speaker: 'hakim', text: 'Sanık, ayağa kalkın. Son sözünüz?' },
      next: 'T_09',
      choices: [
        option('T08_A', '“Bir iş istedim. Kandırıldım. Nurettin Bey’den özür dilerim; onu da aynı ses kandırdı.”', {
          score: { SAVUNMA_STRATEJISI: 25 },
          good: 'Kısa, dürüst ve katılanı da gören bir son söz.',
          responses: B(S`
            ece: Bir iş istedim. Kandırıldım. Kodu ben okudum; neyi okuduğumu bilmiyordum. Nurettin Bey'den özür dilerim. Onu da aynı ses kandırdı.
            ece: Bir yıldır her başvuruda bir kutucuk var: "Adli sicil kaydınız var mı?" Ben hep boş bıraktım. Bugün o kutucuğun ne yazacağını siz söyleyeceksiniz. Saygılarımla.
            ece: Bir yıl önce bir mülakatta biri bana "ailemize hoş geldiniz" dedi. Bugün bu salonda kimse bana bir şey demiyor. Ama burada en azından herkes yüzünü gösteriyor.
            - Nurettin başını salladı. Bir kez.
          `),
        }),
        option('T08_B', '“Ben bir şey yapmadım. Beni bırakın artık.”', {
          neutral: 'Son söz sanığın hakkıdır (CMK 216/3); içeriği hükmü kendiliğinden değiştirmez.',
          responses: B(S`ece/uzgun: Ben bir şey yapmadım. Bir yıldır… beni bırakın artık. Lütfen.`),
        }),
        option('T08_C', '“Parayı ben öderim. Ne kadar sürerse sürsün. Yeter ki bitsin.”', {
          effects: [dec('pers')],
          neutral: 'Son sözde zararı üstlenmek, suçu kabul gibi okunabilir; hüküm bunu dikkate alabilir (TCK 62).',
          responses: B(S`
            ece/uzgun: Parayı ben öderim. Ne kadar sürerse sürsün. Yeter ki bitsin.
            ~ "Yeter ki bitsin." Bir yılın sonunda, masumların en çok söylediği cümle.
          `),
        }),
      ],
    }),
    decisionNode('T_09', [{ to: 'R_KARAR' }], {
      ...TRIAL,
      lines: B(S`
        hakim: Duruşmaya on dakika ara verildi.
        - On dakika. Salonun dışında, koridorda, kimse konuşmadı. Sevim Hanım plastik dosyasını açtı, kapadı, açtı. Ece pencereden Uludağ'a baktı.
        - Nurettin Aksoy koridorun ucunda, pencerenin önünde duruyordu. Bir ara Ece'ye doğru bir adım attı, sonra durdu. Hüküm verilmeden kimse kimseye bir şey diyemezdi.
        - Leyla yanıma geldi, bir şey söylemedi. Sadece elimdeki kalemi aldı ve kapağını taktı. Ucu açık kalmıştı; bir saattir.
        mubasir: Ece Yalın dosyası! Hüküm!
        hakim: Hüküm fıkrası ayakta dinlenir.
      `),
    }),
    story('T_COKUS', {
      ...court2.base,
      title: 'Çöküş',
      background: 'durusma_salonu',
      lines: B(S`
        - Hâkim gözlüğünü çıkardı. Savcı kalemini bıraktı. Salonda kimse bana bakmıyordu; bakmamak, bakmaktan daha ağırdı.
        hakim: Müdafi, sunduğunuz her şey ya ilgisiz ya hukuka aykırı çıktı. Savunmanın güvenilirliği kalmadı. Sanık, kısaca son sözünüz?
        ~ Bir yıl önce bir kız bir kodu yanlış kişiye okudu. Bugün ben, bütün dosyayı yanlış salona okudum.
      `),
      choices: [cont('COKUS_SON', 'Son söz: “Ben bir şey yapmadım.”', 'T_09')],
    }),
    resultNode('R_KARAR', { ...VERDICT, title: 'Karar Açıklandı', background: 'durusma_salonu' }),
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
  discoveryPaths: imeiT00.discoveryPaths,
};
