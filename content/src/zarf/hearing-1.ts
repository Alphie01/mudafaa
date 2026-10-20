import {
  all,
  any,
  atLeast,
  choiceNode,
  cont,
  courtSession,
  dec,
  decisionNode,
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
  score,
  statement,
  story,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, Effect } from '../../../tools/content/src/kit/index.js';
import { B, O, S, W } from './dsl.js';
import { HEAR1, court1 } from './shared.js';

// 60-hearing-1: 1. celse. Koridor, açılış, sanığın sorgusu (Halil'in üç hâli), sorular, savcının sorusu, kayıtların
// okunmasına itiraz (CMK 206/2-a), Komiser'in tanıklığı (K1–K5), talepler ve tutukluluk, ara karar.

export const wrongEvidence: Effect[] = [dec('cred'), dec('pers'), inc('wrong'), score('SORGULAMA', -150, 'hatali')];

/** Hukuka aykırı kaydı sunmak: güvenilirlik −2, etik ve ETİK sonucunun bayrağı. */
export const illegalPresented = (by: string): Effect[] => [
  dec('cred', 2),
  inc('wrong'),
  inc('ethics'),
  raise('illegal_used'),
  score('SORGULAMA', -150, 'hatali'),
  score('USUL_BILGISI', -150),
  mark(
    'BAD',
    `Gizli soruşturma kaydı (${by}) yetkisiz yoldan alındı; hukuka aykırı delil hükme esas alınamaz (Anayasa 38/6; CMK 206/2-a, 217/2) ve gizliliğin ihlali suç oluşturabilir (TCK 285).`,
    'USUL_BILGISI',
  ),
];

const savcilikDelili = (id: string, statementId: string | undefined, evidenceIds: string[]) =>
  presentRule(id, statementId, evidenceIds, {
    maxUses: 3,
    effects: [...wrongEvidence, mark('BAD', 'İddianın dayanağı olan belgeyi savunma delili gibi sundun.', 'SORGULAMA')],
    responses: B(S`
      savci: Sayın Başkan, müdafi bizim delilimizi sunuyor. Teşekkür ederiz.
      baskan: Müdafi, bu belge tanığın beyanını destekliyor. Ne göstermek istediniz?
    `),
  });

export const hearing1: CasePart = {
  court: {
    sessions: [
      courtSession('cs_1', '1. Celse', [
        ['s1_acilis', 'ACILIS', 'H1_00'],
        ['s1_sorgu', 'SANIK_SAVUNMASI', 'H1_01'],
        ['s1_delil', 'DELIL_TARTISMA', 'H1_03'],
        ['s1_tanik', 'TANIK_DINLEME', 'H1_04'],
      ]),
    ],
  },
  nodes: [
    story('H1_KORIDOR', {
      ...HEAR1,
      title: 'Koridor',
      background: 'adliye',
      lines: [
        W(
          flag('gece_mektup'),
          S`
            = 10 MAYIS 2027 · 09.30 — BURSA ADLİYESİ, 4. KAT @adliye
            - Koridor ıslak şemsiyeler ve ucuz kahve kokuyordu. Elimde dosya; dosyanın en üstünde, kurallı bir el yazısıyla bir mektup.
            - Zehra bankta oturuyordu, formasının üstüne bir ceket giymişti. Gece nöbetinden çıkmıştı; gözlerinin altı mordu ama sırtı dimdikti. Babası gibi.
            zehra: Getirecekler mi? Kelepçeyle mi? Babam kelepçeyle... Neyse. Hemşireyim, kelepçe gördüm. Babamda görmedim.
          `,
        ),
        W(
          flag('gece_pano'),
          S`
            = 10 MAYIS 2027 · 09.30 — BURSA ADLİYESİ, 4. KAT @adliye
            - Uykusuz bir gecenin ardından koridor fazla aydınlıktı. Kafamda panonun ipleri: 10.35, 10.39, 10.44, 10.46. Gözlerimi kapatınca bile kırmızı.
            - Zehra bankta oturuyordu, formasının üstüne bir ceket giymişti. Bana baktı: "Siz de mi uyumadınız? Hemşire olarak söylüyorum: belli oluyor."
          `,
        ),
        O(S`
          = 10 MAYIS 2027 · 09.30 — BURSA ADLİYESİ, 4. KAT @adliye
          - Koridor ıslak şemsiyeler ve ucuz kahve kokuyordu. Uykusuz bir gecenin ardından kafamda saatler dönüyordu: 10.35, 10.39, 10.44, 10.46.
          - Zehra bankta oturuyordu, formasının üstüne bir ceket giymişti. Gözlerinin altı mordu ama sırtı dimdikti. Babası gibi.
          zehra: Getirecekler mi? Kelepçeyle mi? Hemşireyim, kelepçe gördüm. Babamda görmedim.
        `),
      ],
      choices: [cont('HK_DEVAM', 'Bekle', 'H1_K2')],
    }),
    story('H1_K2', {
      ...HEAR1,
      title: 'Ring',
      background: 'adliye',
      lines: B(S`
        - Asansörün kapısı açıldı. İki jandarma, aralarında Halil. Kelepçeli elleri önündeydi; kelepçenin zincirini, bir dosya taşır gibi düzgün tutuyordu.
        - Zehra ayağa kalktı. Halil kızını gördü, bir an durdu, sonra başıyla selam verdi; resmî, kısa. Gözlüğü burnundaydı. Bu sefer başının üstünde değil.
        - Koridorun öbür ucunda, kahverengi deri montlu bir adam pencereden dışarı bakıyordu. Bir eliyle telefonunu, öbürüyle bir tespihi çeviriyordu. Bize hiç bakmadı.
        ~ Muhbir. Bayram Öz. Bugün dinlenmeyecek; tanık listesinde ikinci celsede. Ama gelmiş. Neden geldiğini merak ediyorum.
      `),
      choices: [
        option('HK2_A', 'Muhbire bakma. Zehra’yı al, salona gir.', {
          effects: [raise('k2_mesafe')],
          good: 'Duruşmadan önce karşı tarafın tanığıyla temas kurulmaz; mesafe, tanığın beyanının da savunmanın da güvencesidir.',
          category: 'USUL_BILGISI',
          score: { USUL_BILGISI: 20 },
          responses: B(S`
            - Zehra'nın koluna dokundum. "İçeri girelim." Muhbirin önünden geçerken başımı çevirmedim. Tespihin boncuklarının sesi, kapı kapanana kadar arkamızdan geldi.
          `),
          next: 'H1_K3',
        }),
        option('HK2_B', 'Muhbirin yanına git; neden geldiğini sor.', {
          effects: [dec('cred'), raise('k2_temas')],
          bad: 'Tanık olarak çağrılacak kişiyle duruşma koridorunda dava hakkında konuşmak, tanığı etkileme şüphesi doğurur; savcı ve heyet bunu görür.',
          category: 'USUL_BILGISI',
          responses: B(S`
            - Yanına gittim. Bayram beni görünce tespihi düşürdü, eğilip aldı, doğrulmadan uzaklaştı.
            - Koridorun öbür ucunda Savcı Kenan Yavuz durmuş, bizi izliyordu. Bir şey söylemedi. Söylemesine gerek yoktu.
            ~ Bir adım. Yanlış bir adım. Duruşma, koridorda atılan adımları da hatırlar.
          `),
          next: 'H1_K3',
        }),
      ],
    }),
    decisionNode('H1_K3', [{ to: 'H1_00' }], {
      ...HEAR1,
      lines: [
        W(
          flag('ucret_sonra'),
          S`- Zehra salona girerken koluma dokundu. "Ücreti sonra konuşuruz demiştiniz" dedi. "Konuşacağız. Ama önce babamı çıkarın."`,
        ),
        W(
          all(flag('k2_mesafe'), flag('fact_zehra')),
          S`- Salona girerken Zehra fısıldadı: "Babam ek nöbet almamı istemiyormuş. Siz söylemişsiniz." Sonra ekledi: "Almayacağım. Bu hafta."`,
        ),
        W(
          flag('deniz_durust'),
          S`- Zehra salona girerken koluma dokundu. "Söz vermemiştiniz" dedi. "Babam söyledi; her satırı sormuşsunuz. Babam buna değer verir."`,
        ),
      ],
    }),
    court1.stage('H1_00', {
      title: 'Duruşma · 1. Celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onFirstEnter: [raise('in_court'), meet('baskan'), meet('uye'), meet('savci'), meet('mubasir')],
      lines: B(S`
        = BURSA 5. AĞIR CEZA MAHKEMESİ · 1. CELSE @durusma_salonu
        mubasir: Halil Ekinci dosyası! Sanık, müdafi, salona! Halil Ekinci dosyası!
        - Salon büyüktü; yüksek tavan, ahşap kürsü, üç koltuk. Ortada Başkan Reşat Akın, solunda Üye Hâkim Defne Sezer, sağda, biraz ayrı, Savcı Kenan Yavuz.
        baskan: Tutuklu sanık Halil Ekinci getirildi; kelepçeleri çözüldü. Müdafi hazır. İddianame okundu sayıldı; özetle rüşvet. Sanık, kimliğinizi teyit edin.
        halil: Halil Ekinci. Nilüfer Tapu Müdürlüğü, kontrol memuru. Sicil numaram on dört bin...
        baskan: Sicil numarası gerekmez, Halil Bey.
        halil: Kayda geçsin diye söyledim, efendim.
        - Arka sıralardan biri güldü; Başkan bakınca sustu. Defne Sezer bir şey not etti. Gülümsemedi; ama kalemi bir an durdu.
        savci: Sayın Başkan, dosya açıktır. Zarf sanığın çekmecesinde, para işaretli, kayıt ortada. Sanığın kendi telefonundaki sözler de ortada. Gerisi, sanığın inkârıdır.
        ~ "Gerisi inkârdır." Savcılar, inkârı bir delil gibi sayar. Ben inkârın arkasındaki on dakikayı saymaya geldim.
      `),
      choices: [cont('H100_DEVAM', 'Devam', 'H1_00B')],
    }),
    story('H1_00B', {
      ...court1.base,
      title: 'İddianame',
      background: 'durusma_salonu',
      lines: B(S`
        - Savcı iddianamenin özetini okudu; ezberden, ama bir kâğıda bakar gibi yaparak. Bazı savcılar kâğıda bakar gibi yapar; heyet, kâğıtsız konuşanı sevmez.
        savci: Sanık, kontrol memuru sıfatıyla, muhbir Bayram Öz'ün başvurusunu bekleterek kırk bin lira talep etmiş, anlaşmaya varmış ve on iki Mart günü parayı makamında almıştır. Para sanığın çekmecesinde ele geçirilmiştir.
        savci: İletişimin denetlenmesi kayıtları, sanığın muhbire "dosyana bakarım" dediğini ve bir üçüncü kişinin "kontrolcüyü hallettik, zarf yarın masada" dediğini göstermektedir.
        - Halil iddianame okunurken başını eğmedi. Gözlüğünü bir kez düzeltti; "makamında" kelimesinde. Odasına makam dendiğini ilk kez duyuyormuş gibi.
        - Dinleyici sıralarında birkaç memur vardı. Tapu müdürlüğünden; mesai saatinde, izin alarak gelmişlerdi. Aralarında Muzaffer Usta'yı gördüm; önlüğünü çıkarmamıştı. Ve kahverengi deri montlu adam, en arkada, kapıya yakın.
        ~ Bir iddianame, bir hikâyenin en kısa hâlidir. Bugün o hikâyenin uzun hâlini anlatacağım; dakika dakika.
        baskan: Savunma? Önce sanığı dinleyeceğiz, müdafi. Sonra delilleri.
      `),
      choices: [cont('H100B_DEVAM', 'Sanığın sorgusu', 'H1_01')],
    }),
    court1.stage('H1_01', {
      title: 'Sanığın sorgusu',
      courtStage: 'SANIK_SAVUNMASI',
      witness: 'halil',
      witnessLabel: 'SANIK · HALİL EKİNCİ',
      lines: B(S`
        baskan: Sanık, size yüklenen suçu anladınız mı? Susma hakkınız var. Avukatınız yanınızda. Lehinize delilleri toplatmayı isteyebilirsiniz.
        halil: Anladım, efendim. Konuşacağım.
        baskan: Anlatın. Baştan.
        - Halil gözlüğünü düzeltti. Önündeki boş kürsünün kenarını iki eliyle hizaladı. Sonra konuşmaya başladı.
      `),
      choices: [cont('H101_DEVAM', 'Halil anlatıyor', 'H1_01R')],
    }),
    decisionNode(
      'H1_01R',
      [{ when: flag('halil_durust'), to: 'H1_01D' }, { when: flag('halil_sus'), to: 'H1_01S' }, { to: 'H1_01I' }],
      { ...HEAR1 },
    ),
    story('H1_01D', {
      ...court1.base,
      title: 'Halil’in anlatımı',
      background: 'durusma_salonu',
      lines: B(S`
        halil: Yirmi yedi yıldır kontrol memuruyum. On iki Mart sabahı on otuz beşte dahili telefonum çaldı. "Müdür Hanım aşağıda bekliyor, acil" dendi. İndim. Müdür Hanım kimseyi çağırmamıştı.
        halil: On kırk altıda döndüğümde odamda polis vardı. Çekmecem açıldı. Zarfı ilk kez orada gördüm.
        halil: Bayram Öz'ü tanırım. Bir şey daha söyleyeceğim; kendim söylemek istiyorum. Üç Mart'ta onun başvurusuna öncelikli randevu onayı verdim. Yetkim yoktu. Babası ölüyordu.
        - Salonda bir kıpırdanma oldu. Savcı başını kaldırdı. Defne Sezer kalemini bıraktı.
        halil/uzgun: Karşılığında hiçbir şey almadım. Şerh kalkmadığı için imza da çıkmadı. Yirmi yedi yılda bir kez eğildim, Sayın Başkan. O eğilişin cezası neyse çekerim. Ama o zarf benim değil.
        > Sayın Başkan, randevu kaydını ve başvurunun Devir-2'ye atandığını gösteren iş dağıtım çıktısını dosyaya sunuyoruz.
        baskan: Alınsın. Tutanağa geçirin: sanık öncelikli randevu onayını kendisi beyan etti.
        savci: Not ediyoruz, Sayın Başkan. Sanık "iş"i kabul ediyor. "Menfaat"i mütalaada değerlendireceğiz.
        ~ Savcı yemi yuttu mu, yoksa ben mi bir kapıyı açtım? Bilmiyorum. Ama Halil'in sesi titremedi. Yirmi yedi yıllık bir memurun sesi, ilk kez kendi lehine değil, doğrunun lehine konuştu.
      `),
      choices: [cont('H101D_DEVAM', 'Müvekkile soru sor', 'H1_01Q')],
    }),
    story('H1_01S', {
      ...court1.base,
      title: 'Halil’in anlatımı',
      background: 'durusma_salonu',
      lines: B(S`
        halil: Yirmi yedi yıldır kontrol memuruyum. On iki Mart sabahı dahili telefonum çaldı; müdür hanımın beklediği söylendi. İndim. Döndüğümde odamda polis vardı.
        halil: Zarfı ilk kez çekmece açılınca gördüm. Bayram Öz'ü tanırım; takipçidir. Para istemedim.
        savci: Sanık, Bayram Öz'ün dosyasıyla ilgili herhangi bir işlem yaptınız mı?
        halil: Bu konuda... susma hakkımı kullanıyorum.
        - Savcı kalemini bıraktı. Gözlerinde, kumarda bir kart açılmış gibi bir ışık.
        ~ Hakkı. Ve bu salonda herkes, o hakkın bir şeyi sakladığını düşündü.
      `),
      choices: [cont('H101S_DEVAM', 'Müvekkile soru sor', 'H1_01Q')],
    }),
    story('H1_01I', {
      ...court1.base,
      title: 'Halil’in anlatımı',
      background: 'durusma_salonu',
      lines: B(S`
        halil: Yirmi yedi yıldır kontrol memuruyum. On iki Mart sabahı dahili telefonum çaldı; müdür hanımın beklediği söylendi. İndim. Döndüğümde odamda polis vardı.
        halil: Zarfı ilk kez çekmece açılınca gördüm. Bayram Öz'ü tanırım; takipçidir. Dosyasıyla bir işim olmadı.
        - Sesi düzdü. Fazla düz. Yirmi yedi yıl boyunca hiç kurmadığı bir cümleyi kuran bir adamın sesi.
        ~ "Dosyasıyla bir işim olmadı." Müdürlükteki bir kâğıt başka bir şey söylüyor. Bir gün biri o kâğıdı bu cümlenin yanına koyacak.
      `),
      choices: [cont('H101I_DEVAM', 'Müvekkile soru sor', 'H1_01Q')],
    }),
    choiceNode('H1_01Q', {
      ...court1.base,
      title: 'Sanığa sorular',
      background: 'durusma_salonu',
      prompt: { speaker: 'baskan', text: 'Müdafi, sanığa sorularınız?' },
      choices: [
        option('H101Q_A', 'O sabah odanızdan çıktığınızda kapıyı kapattınız mı? Çekmeceniz kilitli miydi?', {
          score: { SORGULAMA: 30 },
          good: 'Açık uçlu soru; odanın ve çekmecenin herkese açık olduğu sanığın ağzından tutanağa geçti (CMK 201).',
          responses: B(S`
            halil: Kapıyı çektim, kilitlemedim. Çekmecemi hiç kilitlemem; yirmi yedi yıldır. Kattaki herkes bilir. Çaycı bilir, temizlikçi bilir.
            - Defne Sezer başını kaldırdı, bir şey not etti. Bu sefer kalemi durmadı.
          `),
          next: '$stay',
        }),
        option('H101Q_B', 'Telefonunuz çaldığında takviminize ne yazdınız?', {
          visibleWhen: has('clue_takvim_214'),
          score: { SORGULAMA: 40 },
          effects: [inc('pers'), raise('q_takvim')],
          good: 'Sahnede bulduğun ayrıntıyı sanığın kendi ağzından bağlamına oturttun; telkinsiz.',
          responses: B(S`
            halil: Arayanın dahili numarasını. Her zaman yazarım. "Dahili iki yüz on dört, Müdür Hanım, soru işareti." Soru işareti koydum, çünkü makamın numarası iki yüz birdir.
            savci: Sanık, iki yüz on dört kimin numarası?
            halil: Devir Servisi-2'nin, efendim. İki kişilik bir oda.
            - Savcı bir şey yazdı. Bu sefer uzun bir şey.
          `),
          next: '$stay',
        }),
        option('H101Q_C', '8 Mart akşamı Bayram Öz’e telefonda tam olarak ne dediniz?', {
          visibleWhen: flag('fact_tam_cumle'),
          score: { SORGULAMA: 40 },
          effects: [inc('pers'), raise('q_tam_cumle')],
          good: 'Yarım alıntılanan cümlenin bütününü sanığın ağzından tutanağa geçirdin.',
          responses: B(S`
            halil: "Dosyana bakarım Bayram, ama şerh kalkmadan imza yok." İddianamede yalnızca ilk yarısı var, Sayın Başkan. Ben cümlemi yarım kurmam.
            baskan: Not edildi.
          `),
          next: '$stay',
        }),
        option('H101Q_D', 'Öncelikli randevu onayı karşılığında sizden bir şey istendi mi, size bir şey verildi mi?', {
          visibleWhen: flag('halil_durust'),
          score: { SORGULAMA: 40 },
          effects: [inc('pers'), raise('q_karsilik')],
          good: 'Rüşvetin iş–menfaat bağını sanığın ağzından ve açık soruyla tartıştın; karşılığın olmadığı tutanağa geçti.',
          responses: B(S`
            halil: Hayır. Ne bir şey istendi, ne bir şey verildi. Bayram bana bir çay bile ısmarlamadı; ısmarlasa içmezdim. Ağladı, o kadar.
            - Savcı itiraz edecek gibi oldu, etmedi. Başkan başını salladı.
          `),
          next: '$stay',
        }),
        option('H101Q_E', 'Hayatınızda hiç rüşvet aldınız mı?', {
          neutral: 'Sanığın kendi lehine genel bir cevap vermesi heyete yeni bir şey söylemez; soruyu boşa harcadın.',
          responses: B(S`
            halil: Hayır, efendim. Bir çikolata için bile tutanak tuttum.
            savci: Sayın Başkan, bu bir soru değil, bir reklam.
          `),
          next: '$stay',
        }),
        cont('H101Q_BITTI', 'Başka sorum yok', 'H1_02', { role: 'PRIMARY' }),
      ],
    }),
    court1.objection('H1_02', {
      title: 'Savcının sorusu',
      courtStage: 'SANIK_SAVUNMASI',
      witness: 'halil',
      witnessLabel: 'SANIK · HALİL EKİNCİ',
      say: S`
        - Savcı ayağa kalktı. Sesi yumuşaktı; sertlikten daha tehlikeli bir yumuşaklık.
        savci: Sanık, Bayram Öz'e "dosyana bakarım" dediniz ve dört gün sonra çekmecenizden kırk bin lira çıktı. Bu parayı o dosya için aldınız, değil mi?
      `,
      next: 'H1_02R',
      options: [
        option('H102_A', 'İtiraz: soru cevabını içinde taşıyor ve kanıtlanmamış bir olguyu doğru kabul ediyor.', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers')],
          good: 'Savcı sanığa doğrudan soru sorabilir (CMK 201/1); ama cevabı içinde taşıyan, tartışmalı bir olguyu verili kabul eden yönlendirici soru reddedilir.',
          responses: B(S`
            baskan: Kabul. Savcı bey, soruyu açık sorun.
            savci: Peki. Sanık, çekmecenizdeki para nereden geldi?
            halil: Bilmiyorum, efendim. Bilseydim, bu salonda değil, savcılıkta olurdum; ihbarcı olarak.
          `),
        }),
        option('H102_B', 'İtiraz: savcı sanığa soru soramaz.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Savcı ve müdafi sanığa doğrudan soru yöneltebilir (CMK 201/1). İtiraz, sorunun biçimine yapılmalıydı.',
          responses: B(S`
            baskan: Sorabilir, müdafi. Reddedildi. Sanık, cevap verin.
            halil/saskin: Hayır. Hayır, efendim. Ben o parayı görmedim bile.
          `),
        }),
        option('H102_C', 'Müvekkilim bu soruya cevap vermeyecek.', {
          neutral: 'Susma hakkı meşrudur; ama burada sorunun biçimine itiraz edilebilirdi ve cevap Halil’in lehineydi.',
          responses: B(S`
            savci: Not edelim. Sanık para konusunda susuyor.
            ~ Susmaması gereken yerde susturdum. Bir cevabın lehte olduğu yerde, sessizlik aleyhe okunur.
          `),
        }),
        option('H102_D', 'Bir şey söyleme; cevabı Halil versin.', {
          effects: [dec('pers')],
          neutral: 'Yönlendirici soru itirazsız geçti; Halil’in “hayır”ı savcının cümlesinin içinde kayboldu.',
          responses: B(S`
            halil/kizgin: Hayır! O dosya benim masama hiç gelmedi! Ben...
            savci: "Hayır" dediniz. Ama "dosyana bakarım" da dediniz. Not edelim.
          `),
        }),
      ],
    }),
    decisionNode('H1_02R', [{ to: 'H1_03' }], {
      ...HEAR1,
      lines: [
        W(
          flag('halil_durust'),
          S`- Halil yerine oturdu. Zehra arka sırada gözlerini silmeden duruyordu; hemşireler ağlarken bile yüzlerini düz tutmayı bilir.`,
        ),
      ],
    }),
    court1.objection('H1_03', {
      title: 'Kayıtların okunması',
      courtStage: 'DELIL_TARTISMA',
      say: S`
        baskan: Delillerin ortaya konulmasına geçiyoruz. Savcı bey?
        savci: Sayın Başkan, iletişimin denetlenmesi kayıtlarından, özellikle dokuz ve on dört numaralı kayıtların çözümlerinin okunmasını talep ediyoruz. İddianın dayanağıdır.
        - Kâtip ilgili sayfaları açtı. Leyla'nın sesi kafamda: "Okumadan önce kalk."
        baskan: Müdafi, okunmalarına diyeceğiniz?
      `,
      next: 'H1_03R',
      options: [
        option('H103_A', 'Kayıt 14 kararın süresi dolduktan sonra, kayıt 9 kararda olmayan bir hattan alınmıştır; hukuka aykırı delil olarak reddini talep ediyoruz.', {
          effects: [
            ifThen(
              all(has('ded_sure_disi'), has('ded_hat_disi')),
              [
                raise('red_14'),
                raise('red_9'),
                raise('red_kabul'),
                inc('pers', 2),
                inc('legal_hits'),
                score('USUL_BILGISI', 150),
                mark(
                  'GOOD',
                  'Kanuna aykırı elde edilen delil reddedilir (CMK 206/2-a) ve hükme esas alınamaz (CMK 217/2; Anayasa 38/6): kararın süresi iki aydı (CMK 135/4), hat kararda gösterilmemişti (CMK 135/1, 135/4).',
                  'USUL_BILGISI',
                ),
              ],
              [
                ifThen(
                  has('ded_sure_disi'),
                  [
                    raise('red_14'),
                    inc('pers'),
                    inc('legal_hits'),
                    score('USUL_BILGISI', 80),
                    mark(
                      'GOOD',
                      'Süre dışı kayıt reddedildi (CMK 135/4, 206/2-a). Kayıt 9 için hattın kararda olmadığını gösteremedin.',
                      'USUL_BILGISI',
                    ),
                  ],
                  [
                    ifThen(
                      has('ded_hat_disi'),
                      [
                        raise('red_9'),
                        inc('pers'),
                        inc('legal_hits'),
                        score('USUL_BILGISI', 80),
                        mark(
                          'GOOD',
                          'Kararsız alınan kayıt reddedildi (CMK 135/1, 206/2-a). Kayıt 14’ün süre dışı olduğunu gösteremedin.',
                          'USUL_BILGISI',
                        ),
                      ],
                      [
                        dec('cred'),
                        score('USUL_BILGISI', -40),
                        mark(
                          'BAD',
                          'İtirazın gerekçesi doğruydu ama dayanağını gösteremedin: kararın süresini ve hattını belgeyle eşleştirmemiştin.',
                          'USUL_BILGISI',
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ],
          responses: [
            W(
              all(has('ded_sure_disi'), has('ded_hat_disi')),
              S`
                > Sayın Başkan, karar dört Ocak tarihli ve iki aylık. Dört Mart'ta sona eriyor; dosyada uzatma kararı yok. On dört numaralı kayıt on bir Mart tarihli: süresi bitmiş bir kararla alınmış.
                > Dokuz numaralı kayıt ise sanığın kendi hattından. Karar yalnızca bir müteahhidin hattını gösteriyor. Sanığın hattı için hiçbir hâkim karar vermemiş.
                > Kanuna aykırı elde edilen delil, ne söylerse söylesin, ortaya konulamaz. İkisinin de reddini talep ediyoruz.
                - Başkan kararın fotokopisini istedi, üyelerle başlarını birleştirdi. Bir dakika. Salon, bir dakikanın ne kadar uzun olabileceğini öğrendi.
                baskan: Dokuz ve on dört numaralı kayıtların hukuka aykırı elde edildiği anlaşıldığından ortaya konulmalarına yer olmadığına. Tutanağa geçsin.
                savci/kizgin: Sayın Başkan, rüşvet dinlenebilecek suçlardandır!
                baskan: Doğru, savcı bey. Ama kararın süresi ve hattı içinde. Altı numaralı kayıt süre içinde; isterseniz okunur.
                - Savcı altı numarayı okutmadı. Okutsaydı salon "kontrolcü yine imzalamadı" cümlesini duyacaktı. Bunu biliyordu.
              `,
            ),
            W(
              any(has('ded_sure_disi'), has('ded_hat_disi')),
              S`
                > Sayın Başkan, kayıtlardan biri kararın kapsamı dışında alınmıştır; belgesi dosyada. Reddini talep ediyoruz.
                baskan: Belgeyle gösterilen kayıt yönünden talep kabul edildi. Diğeri için dayanak gösterilmedi; okunsun.
                ~ Bir kapıyı kapattım. Öbürü hâlâ açık; ve oradan bir cümle salona giriyor.
              `,
            ),
            O(S`
              > Sayın Başkan, kayıtların kararın kapsamı dışında alındığını düşünüyoruz.
              baskan: Düşünmek yetmez, müdafi. Kararın neresinde, hangi tarihte, hangi hatta? Gösterin.
              ~ Gösteremedim. Kararın her satırını okumamıştım. Leyla haklıydı: okumadan önce kalkmak yetmez; neden kalktığını da bileceksin.
            `),
          ],
        }),
        option('H103_B', 'Rüşvet dinlemeye elverişli suçlardan değildir; bütün kayıtların reddini talep ediyoruz.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Rüşvet, CMK 135/8-a-13 uyarınca dinleme tedbirinin uygulanabileceği katalog suçlardandır. Hukuka aykırılık suç türünde değil, kararın süresi ve hattındadır.',
          responses: B(S`
            baskan: Müdafi, rüşvet katalogda var. Reddedildi. Kayıtlar okunsun.
            - Kâtip okudu: "Kontrolcüyü hallettik. Zarf yarın masada." Salon bu cümleyi duydu. Bir kez duyulan cümle, tutanaktan silinse de kulaklardan silinmez.
          `),
        }),
        option('H103_C', 'Kayıtlar sanığın yakınlarıyla yapılan görüşmeleri içerdiğinden okunamaz.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Tanıklıktan çekinebilecek kişilerle görüşmeler kayda alınamaz (CMK 135/3); ama Bayram Öz ve Ateşoğlu sanığın yakını değildir.',
          responses: B(S`
            baskan: Hangi yakın, müdafi? Bayram Öz sanığın yakını mı? Reddedildi. Okunsun.
          `),
        }),
        option('H103_D', 'Okunsun; değerlendirmesini esas hakkındaki savunmada yaparız.', {
          effects: [dec('pers')],
          neutral: 'Kanuna aykırı delile ortaya konulurken itiraz edilmeliydi (CMK 206/2-a). Okunan kayıt heyetin zihnine girdi.',
          responses: B(S`
            - Kâtip okudu: "Dosyana bakarım Bayram." "Kontrolcüyü hallettik. Zarf yarın masada." Halil gözlerini kapattı.
            ~ Okumadan önce kalkmadım. Şimdi bu cümleler salonun havasında.
          `),
        }),
      ],
    }),
    decisionNode('H1_03R', [{ to: 'H1_03S' }], {
      ...HEAR1,
      lines: [
        W(
          flag('red_kabul'),
          S`- Halil bana dönmedi. Ama önündeki kâğıdın kenarını bir kez daha hizaladı; bu sefer elleri titremiyordu.`,
        ),
      ],
    }),
    decisionNode('H1_03S', [{ to: 'H1_04' }], {
      ...HEAR1,
      lines: [
        W(
          flag('fact_komiser_ogul'),
          S`- Komiser salona girerken masasındaki fotoğraf aklıma geldi: üniformalı bir genç. "Tutanak senin vicdanındır." Bugün o vicdanın satırlarını birlikte okuyacağız.`,
        ),
        W(
          flag('k2_temas'),
          S`- Savcı, Komiser'i çağırmadan önce bana döndü. "Koridorda tanıklarla sohbet etmeyi severiz demek, müdafi." Tutanağa geçmedi. Ama heyet duydu.`,
        ),
      ],
    }),
    court1.stage('H1_04', {
      title: 'Tanık: Mali Şube',
      courtStage: 'TANIK_DINLEME',
      witness: 'komiser',
      witnessLabel: 'TANIK · KOM. LEVENT ARI',
      lines: B(S`
        mubasir: Tanık Levent Arı!
        - Komiser ütülü bir takım elbiseyle girdi. Tanık kürsüsüne geçti, yemin metnini ezberden okudu; bunu çok kez yapmıştı.
        baskan: Kimliğiniz tespit edildi, yemininizi ettiniz. Olayı anlatın.
        komiser: Sayın Başkan, bir müteahhit hakkındaki soruşturmada tapu müdürlüğünde bir kontrol memurunun adı geçti. On bir Mart gecesi muhbir şubemize geldi, memurun para istediğini bildirdi.
        komiser: Kontrollü teslimat planladık. Ertesi sabah muhbir binaya girdi, zarfı teslim etti, bize haber verdi. Odaya girdik; zarf çekmecede, seri numaraları eşleşti. Ders kitabı gibi bir operasyondu.
      `),
      choices: [cont('H104_DEVAM', 'Tanığı dinle', 'H1_04T')],
    }),
    court1.testimony('H1_04T', {
      title: 'Çapraz sorgu: Kom. Levent Arı',
      courtStage: 'TANIK_DINLEME',
      witness: 'komiser',
      witnessLabel: 'TANIK · KOM. LEVENT ARI',
      say: S`
        baskan: Tanık beyanını verdi. Müdafi, sorularınız?
        - Komiser kürsünün kenarını kavradı. Operasyonunu ezbere biliyordu; ama operasyonunun neyi içermediğini ilk kez bu salonda düşünecekti.
      `,
      rulesText:
        'Önce bastır, sonra doğru delille vur. Yanlış delil güvenilirliği ve skoru düşürür; kanaate ve hukuka aykırı delile dayanmaya itiraz edilebilir.',
      objectionGrounds: ['g_kanaat', 'g_duyum', 'g_aykiri'],
      statements: [
        statement('K1', 1, [
          'Soruşturma, dinleme kayıtlarındaki ',
          hl('kuvvetli delillere dayanıyordu; şüphelinin anlaştığı açıktı', any(flag('press_k1'), has('ded_sure_disi'))),
          '.',
        ]),
        statement('K2', 2, [
          'Muhbir şubemize kendiliğinden geldi. ',
          hl('Parayı da kendisi getirdi; biz yalnızca seri numaralarını kaydettik', any(flag('press_k2'), flag('fact_para_emniyet'))),
          '.',
        ]),
        statement('K3', 3, [
          'Zarf, şüphelinin masasında, ',
          hl('şüpheli başındayken çekmecede bulundu', any(flag('press_k3'), has('ded_bos_oda'))),
          '.',
        ]),
        statement('K4', 4, [
          'Muhbirin kayıt cihazı 10.39’da teknik bir arıza yaptı. ',
          hl('Bu tür cihazlarda olağandır'),
          '.',
        ]),
        statement(
          'K5',
          5,
          [
            'Ayrıca şüphelinin ',
            hl('kendi telefonunda muhbire “dosyana bakarım” dediği tespit edildi', any(flag('press_k5'), has('ded_hat_disi'))),
            '.',
          ],
          flag('press_k1'),
        ),
      ],
      rules: [
        presentRule('PS_K_SIRA', undefined, ['ev_sira_disi'], {
          maxUses: 1,
          effects: [
            ...wrongEvidence,
            raise('sira_savcida'),
            mark('BAD', 'Müvekkilin aleyhine okunabilecek bir belgeyi bağlamsız sundun; savcı “işte iş” dedi.', 'SAVUNMA_STRATEJISI'),
          ],
          responses: B(S`
            savci: Sayın Başkan, müdafi bize bir hediye veriyor: sanık, muhbire öncelikli randevu onayı vermiş! İşte iş.
            baskan: Müdafi, bu belgeyi bu beyana karşı neden sundunuz?
            ~ Doğru belge, yanlış yerde, düşmandır. Halil bana baktı; yirmi yedi yıllık bir bakış.
          `),
        }),
        savcilikDelili('PS_K_SAVCILIK', undefined, ['ev_tutanak', 'ev_dinleme', 'ev_ihbar', 'ev_halil_ifade']),
        pressRule('PR_K1', 'K1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k1')],
          responses: B(S`
            > "Kuvvetli deliller." Hangi kayıtlar? Hangi tarihli?
            komiser: Şubattan beri kayıtlarda "kontrolcü" geçiyordu. On bir Mart gecesi de "zarf yarın masada" kaydı. Bir de şüphelinin kendi telefonundaki görüşme.
            > On bir Mart'ta dinleme kararı hâlâ yürürlükte miydi?
            komiser: Kayıtlar bize geliyordu. Gelmeye devam ediyordu. Kararın takibi savcılığın işidir.
          `),
        }),
        presentRule('PS_K1', 'K1', ['ded_sure_disi'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_k1'),
            mark('GOOD', 'Operasyonun dayanağı olan kayıt, süresi bitmiş bir kararla alınmıştı (CMK 135/4, 137/1).', 'SORGULAMA'),
          ],
          responses: B(S`
            > Kararın süresi dört Mart'ta doldu. Uzatma yok, sonlandırma tutanağı yok. "Zarf yarın masada" on bir Mart'ta kaydedildi: hiçbir kararın kapsamında değil.
            > Yani operasyonunuz, kayıt sisteminin kapatılmayı unutulmuş bir deliğinden duyulan bir cümleye dayanıyor.
            komiser/saskin: Süre mi? Ben... bana gelen kayıtlar tarih sırasıyla geliyordu. Kimse bana "bitti" demedi.
            baskan: Tanık, kayıtları kim kapatmalıydı?
            komiser/uzgun: Tedbir bitince sonlandırma yazısı yazılır, Sayın Başkan. Yazılmamış. Ben de sormadım.
            - Defne Sezer bir şey yazdı, altını iki kez çizdi.
          `),
        }),
        pressRule('PR_K2', 'K2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k2')],
          responses: B(S`
            > "Parayı kendisi getirdi." Muhbirin kırk bin lirası var mıydı?
            komiser: Muhbir... bir takipçi. Kırk bin lirası olacak biri değil. Usul gereği para teslimden önce kayda alındı.
            > Kimin parası kayda alındı?
          `),
        }),
        presentRule('PS_K2', 'K2', ['ev_para'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_k2'),
            mark(
              'GOOD',
              'Para Emniyet’ten çıkmış, teslimat kolluk planıyla kurulmuş: muhbir kolluğun talimatıyla hareket eden bir ajandı (AİHS 6; AİHM Ramanauskas/Litvanya).',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Seri numarası tutanağı, sabah dokuz elli: "Emniyetimizce temin edilen iki yüz adet iki yüz lira... kontrollü teslimat amacıyla ihbarcıya teslim edilmiştir."
            > Muhbir parayı getirmedi; siz verdiniz. Planı siz yaptınız, cihazı siz taktınız, saati siz belirlediniz. Muhbir sizin elinizdi.
            komiser: Usul bu, Sayın Başkan. Her kontrollü teslimatta böyle yapılır.
            > Peki muhbirin iddiasından başka, sanık hakkında önceden elinizde ne vardı? Süresi geçmiş bir kayıt mı?
            - Komiser cevap vermedi. Başkan tutanağa dikte etti: "Tanık, paranın Emniyet tarafından temin edildiğini kabul etti."
          `),
        }),
        pressRule('PR_K3', 'K3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k3')],
          responses: B(S`
            > "Şüpheli başındayken." Odaya girdiğinizde şüpheli odada mıydı?
            komiser: İki dakika sonra geldi. Arama onun huzurunda yapıldı. Bu bir usul meselesi değil.
            > Zarf çekmeceye girdiğinde şüpheli odada mıydı?
            komiser: Muhbir öyle söyledi.
          `),
        }),
        presentRule('PS_K3', 'K3', ['ded_bos_oda'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_k3'),
            mark('GOOD', 'Tutanağın kendi saatleri, zarf çekmeceye girerken sanığın odada olmadığını gösterdi.', 'SORGULAMA'),
          ],
          responses: B(S`
            > Sizin tutanağınız, Sayın Başkan. 10.39: muhbirin kaydı kesiliyor. 10.43: muhbir "tamam" yazıyor. 10.44: ekip odaya giriyor; "şüpheli odada bulunmamaktadır." 10.46: şüpheli geliyor.
            > Zarf çekmeceye 10.39 ile 10.43 arasında girdi. O dakikalarda sanık odada değildi. Müdürlük katında, kimsenin çağırmadığı bir randevuyu bekliyordu.
            komiser: Biz... muhbir zarfı verip çıktı diye değerlendirdik.
            baskan: Tanık, kime verip çıktı? Oda boşmuş.
            komiser/uzgun: Bunu... muhbire sormadık, Sayın Başkan.
          `),
        }),
        presentRule('PS_K3_P', 'K3', ['ev_tutanak'], {
          visibleWhen: has('clue_saat_tutanak'),
          enabledWhen: has('clue_saat_tutanak'),
          score: { SORGULAMA: 100 },
          effects: [
            inc('pers'),
            raise('k3_kismi'),
            mark('GOOD', 'Odanın boş olduğunu gösterdin; kaydın kesildiği dakikayla birleştirseydin tam çürütme olurdu.', 'SORGULAMA'),
          ],
          responses: B(S`
            > Tutanağınız: "10.44, şüpheli odada bulunmamaktadır."
            komiser: Evet, iki dakika sonra geldi. Ama zarf ondan önce verilmiş olabilir.
            ~ Olabilir. Zarfın ne zaman girdiğini göstermeden, odanın boş olduğu yarım bir cevap.
          `),
        }),
        pressRule('PR_K4', 'K4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k4')],
          responses: B(S`
            > "Olağandır." Cihazı incelettiniz mi?
            komiser: Gerek görmedik. Zarf zaten çekmecedeydi. Cihaz emanette.
            > Arızayı kim tespit etti?
            komiser: Muhbir "cızırdadı, sustu" dedi. Biz de öyle yazdık.
          `),
        }),
        objectRule('OB_K4', 'K4', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('pers'),
            inc('legal_hits'),
            raise('obj_k4'),
            mark('GOOD', 'İtiraz yerinde: tanık incelenmemiş bir cihaz hakkında kanaat bildiriyor.', 'SORGULAMA'),
          ],
          responses: B(S`
            > İtiraz, Sayın Başkan. Tanık incelenmemiş bir cihaz hakkında "olağandır" diyor. Bu bir tespit değil, kanaat.
            baskan: Kabul. Tanık, gördüğünüzü anlatın. Tutanağa "cihaz incelenmemiştir" diye geçirin.
          `),
        }),
        pressRule('PR_K5', 'K5', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k5')],
          responses: B(S`
            > "Kendi telefonunda." Sanığın hattı için bir dinleme kararı var mıydı?
            komiser: Savcılığın yazılı talimatı vardı. Müteahhitle bağlantılı numaralar da izlensin diye.
            > Bir hâkim kararı?
            komiser: ...Yazılı talimat vardı, Sayın Başkan.
          `),
        }),
        presentRule('PS_K5', 'K5', ['ded_hat_disi'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_k5'),
            mark('GOOD', 'Sanığın hattı hiçbir hâkim kararında yoktu; savcılık talimatı dinleme için yetmez (CMK 135/1, 135/9).', 'SORGULAMA'),
          ],
          responses: B(S`
            > Karar tek bir hattı gösteriyor: müteahhidin hattını. Sanığın hattı kararda yok. Savcılığın yazılı talimatı, bir hâkim kararının yerini tutmaz.
            > Kanun açık: kanunda belirlenen usul dışında hiç kimse bir başkasının iletişimini dinleyemez. Bu cümle, dinlenmemesi gereken bir telefondan geliyor.
            komiser/uzgun: Bize öyle bildirildi. Ben kararın metnini görmedim.
            baskan: Tanık, bu beyanınızın o kısmı dikkate alınmayacaktır. Tutanağa geçsin.
          `),
        }),
        objectRule('OB_K5', 'K5', 'g_aykiri', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('pers'),
            inc('legal_hits'),
            raise('obj_k5'),
            mark('GOOD', 'İtiraz yerinde: tanık, kararsız alınmış bir kayda dayanıyor (CMK 206/2-a).', 'SORGULAMA'),
          ],
          responses: B(S`
            > İtiraz. Tanık, sanığın hattından alınan bir kayda dayanıyor. O hat için karar yok.
            baskan: Kararın olup olmadığını dosyada göreceğiz. Şimdilik itirazınız tutanağa geçsin; tanık kaydın içeriğini aktarmasın.
          `),
        }),
      ],
      presentMiss: fallback('FB_K_PRESENT', 'PRESENT', {
        effects: [...wrongEvidence, mark('BAD', 'Sunulan delil ifadeyle ilgisiz; güvenilirlik düştü.', 'SORGULAMA')],
        responses: B(S`
          baskan: Müdafi, bu belgenin bu beyanla ilgisini göremiyorum.
          komiser: Ben de göremiyorum, Sayın Başkan.
        `),
      }),
      objectMiss: fallback('FB_K_OBJECT', 'OBJECT', {
        effects: [dec('cred'), score('SORGULAMA', -50, 'hatali'), mark('BAD', 'Dayanaksız itiraz.', 'SORGULAMA')],
        responses: B(S`baskan: İtiraz reddedildi. Devam edin.`),
      }),
      finish: { id: 'H104_BITIR', label: 'Çapraz sorguyu bitir', next: 'H1_04R' },
    }),
    decisionNode('H1_04R', [{ to: 'H1_05' }], {
      ...HEAR1,
      lines: [
        W(
          all(flag('k3_kismi'), not(flag('contra_k3'))),
          S`- Komiser kürsüden inerken "zarf ondan önce verilmiş olabilir" cümlesi havada kaldı. Odanın boş olduğunu gösterdim; ne zaman boş olduğunu göstermedim.`,
        ),
        W(
          all(flag('press_k4'), not(flag('obj_k4'))),
          S`- "Bu tür cihazlarda olağandır." Cümle tutanağa geçti. İtiraz etmedim; bir kanaat, itirazsız kalınca tespit gibi okunur.`,
        ),
        W(
          all(flag('fact_komiser_oda'), flag('contra_k3')),
          S`- Şubede bana "değerlendirdik" demişti. Bugün aynı kelimeyi kürsüde kullanmadı. Tutanağın saatleri, değerlendirmeden ağır geldi.`,
        ),
        W(
          all(flag('fact_kayit_ariza'), flag('fact_komiser_dinleme')),
          S`- Komiser iki kez "teknik" dedi: biri cihaz için, biri kararın süresi için. Bu dosyada "teknik" kelimesi, kimsenin sormadığı soruların adı.`,
        ),
      ],
    }),
    choiceNode('H1_05', {
      ...court1.base,
      title: 'Talepler',
      background: 'durusma_salonu',
      prompt: { speaker: 'baskan', text: 'Müdafi, delillere ve tutukluluk durumuna ilişkin talepleriniz?' },
      choices: [
        option('RQ_KAMERA', 'Koridor kamerasının 12 Mart 10.30–10.50 görüntülerinin istenmesi', {
          visibleWhen: not(flag('dl_kamera')),
          score: { USUL_BILGISI: 30 },
          effects: [raise('rq_kamera')],
          good: 'Eksik delilin toplanması istenebilir; mahkeme maddi gerçeği araştırır. Kayıt süresi dolmadan istenmesi önemlidir.',
          next: '$stay',
        }),
        option('RQ_SANTRAL', 'Müdürlük santral dökümü ve izin çizelgesinin istenmesi', {
          visibleWhen: not(flag('dl_santral')),
          score: { USUL_BILGISI: 30 },
          effects: [raise('rq_santral')],
          good: 'Sanığı odasından uzaklaştıran çağrının kaynağı santral kaydıyla belirlenir.',
          next: '$stay',
        }),
        option('RQ_CIHAZ', 'Ses kayıt cihazının bilirkişiye incelettirilmesi', {
          visibleWhen: not(flag('dl_cihaz')),
          score: { USUL_BILGISI: 30 },
          effects: [raise('rq_cihaz')],
          good: '“Teknik arıza” iddiası bilirkişi incelemesiyle denetlenebilir (CMK 63).',
          next: '$stay',
        }),
        option('RQ_KARAR', 'Tedbirin uzatma kararı ve sonlandırma yazısının istenmesi', {
          visibleWhen: not(flag('dl_karar')),
          score: { USUL_BILGISI: 30 },
          effects: [raise('rq_karar')],
          good: 'Tedbirin bitiş tarihi ve saati tutanakla saptanır (CMK 137/1); yazı süre dışı kaydı belgeler.',
          next: '$stay',
        }),
        option('RQ_SINAN', 'Dahili 214’ün kullanıcısı Devir Servisi-2 memurunun tanık olarak dinlenmesi', {
          visibleWhen: any(has('ded_sahte_cagri'), flag('q_takvim')),
          score: { USUL_BILGISI: 40 },
          effects: [raise('rq_sinan')],
          good: 'Sanığı odasından uzaklaştıran çağrının geldiği dahilinin kullanıcısının dinlenmesi, olayın aydınlatılması için gereklidir (CMK 177, 178).',
          next: '$stay',
        }),
        option('RQ_TAHLIYE', 'Sanığın tahliyesi; gerekirse adli kontrol', {
          effects: [
            ifThen(
              atLeast(2, flag('contra_k1'), flag('contra_k2'), flag('contra_k3'), flag('contra_k5'), flag('red_14')),
              [
                raise('halil_tahliye'),
                score('USUL_BILGISI', 40),
                mark(
                  'GOOD',
                  'Kuvvetli suç şüphesi zayıfladı (CMK 100/1); tutukluluk yerine adli kontrol yeterli görüldü (CMK 109).',
                  'USUL_BILGISI',
                ),
              ],
              [
                mark(
                  'NEUTRAL',
                  'Delil durumu henüz değişmediği için tutukluluğun devamına karar verildi (CMK 100, 108).',
                  'USUL_BILGISI',
                ),
              ],
            ),
          ],
          next: '$stay',
        }),
        option('RQ_BERAAT', 'Sanığın bugün beraatine karar verilmesi', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Talep edilen deliller toplanmadan ve mütalaa alınmadan hüküm kurulmaz.',
          responses: B(S`baskan: Müdafi, daha delilleri konuşuyoruz. Hükmü sonra konuşuruz.`),
          next: '$stay',
        }),
        option('RQ_TUTANAK', 'Tanık beyanının tutanaktan çıkarılması', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Tanık beyanı tutanaktan çıkarılmaz; değerlendirmesi hükümde yapılır (CMK 217).',
          responses: B(S`baskan: Tutanak tutanaktır, müdafi. Değerini heyet takdir eder.`),
          next: '$stay',
        }),
        cont('RQ_BITTI', 'Taleplerimiz bu kadar', 'H1_06', { role: 'PRIMARY' }),
      ],
    }),
    court1.stage('H1_06', {
      title: 'Ara karar',
      courtStage: 'TANIK_DINLEME',
      onEnter: [ifThen(any(flag('rq_sinan')), [raise('sinan_cagrildi')])],
      lines: [
        W(
          all(flag('halil_tahliye'), flag('rq_sinan')),
          S`
            - Heyet beş dakika müzakere etti. Salon bekledi. Pencerenin dışında bir martı, yanlış şehre gelmiş gibi, kurşuni gökyüzünde bir daire çizdi.
            baskan: Ara karar. Talep edilen kayıtların ve belgelerin ilgili kurumlardan istenmesine; muhbir Bayram Öz ile Devir Servisi-2 memuru Sinan Kaplan'ın tanık olarak çağrılmasına.
            baskan: Sanığın atılı suçu işlediğine dair kuvvetli şüphenin zayıfladığı anlaşıldığından, yurt dışına çıkış yasağı ve haftalık imza yükümlülüğü ile tahliyesine. Duruşmanın 31 Mayıs'a ertelenmesine.
            - Zehra'nın elleri ağzına gitti. Halil yerinden kalkmadı; yalnızca gözlüğünü çıkardı, camlarını gömleğinin ucuyla sildi, yeniden taktı.
          `,
        ),
        W(
          flag('halil_tahliye'),
          S`
            - Heyet beş dakika müzakere etti. Salon bekledi. Pencerenin dışında bir martı, yanlış şehre gelmiş gibi, kurşuni gökyüzünde bir daire çizdi.
            baskan: Ara karar. Talep edilen kayıtların ve belgelerin ilgili kurumlardan istenmesine; muhbir Bayram Öz'ün tanık olarak çağrılmasına.
            baskan: Kuvvetli şüphenin zayıfladığı anlaşıldığından sanığın adli kontrolle tahliyesine. Duruşmanın 31 Mayıs'a ertelenmesine.
            - Zehra'nın elleri ağzına gitti. Halil yerinden kalkmadı; yalnızca gözlüğünü çıkardı, camlarını sildi, yeniden taktı.
          `,
        ),
        W(
          flag('rq_sinan'),
          S`
            - Heyet beş dakika müzakere etti. Salon bekledi.
            baskan: Ara karar. Talep edilen kayıtların istenmesine; muhbir Bayram Öz ile Devir Servisi-2 memuru Sinan Kaplan'ın tanık olarak çağrılmasına.
            baskan: Delil durumu henüz değişmediğinden sanığın tutukluluğunun devamına. Duruşmanın 31 Mayıs'a ertelenmesine.
            - Jandarma Halil'in kollarına dokundu. Halil kalktı, kelepçeyi kendisi uzattı. Zehra'ya bakmadı; bakarsa bir şey kırılacakmış gibi.
          `,
        ),
        O(S`
          - Heyet beş dakika müzakere etti. Salon bekledi.
          baskan: Ara karar. Talep edilen kayıtların istenmesine; muhbir Bayram Öz'ün tanık olarak çağrılmasına. Sanığın tutukluluğunun devamına. Duruşmanın 31 Mayıs'a ertelenmesine.
          - Jandarma Halil'in kollarına dokundu. Halil kalktı, kelepçeyi kendisi uzattı. Zehra'ya bakmadı.
        `),
      ],
      choices: [cont('H106_DEVAM', 'Salondan çık', 'H1_06B', { role: 'PRIMARY' })],
    }),
    story('H1_06B', {
      ...HEAR1,
      title: 'Kürsünün önünde',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('halil_tahliye'),
          S`
            - Salon boşalırken Halil yanıma geldi. Elleri serbestti; ne yapacağını bilmiyordu. Sonunda ceketinin önünü ilikledi.
            halil: Avukat hanım. Kayda geçsin: bugün ilk kez biri kâğıtları benim gibi okudu. Satır satır. Teşekkür ederim.
            halil: Bir de... o altı numaralı kayıt. "Kontrolcü yine imzalamadı." Savcı okutmadı. Ben duymak isterdim. Bir kez olsun biri, kayıtta benim için iyi bir şey söylesin.
            > İkinci celsede, Halil Bey. Okutmak isterlerse, okunur. Biz okutmayız; ama okunursa sizin lehinize.
            - Halil başını salladı. Kızının yanına yürüdü; Zehra ona bir şişe su uzattı, Halil şişenin kapağını açmadan önce etiketini düzeltti.
          `,
        ),
        O(S`
          - Jandarma Halil'i kapıya doğru götürürken Halil bir an durdu, bana döndü. Sesi alçaktı; jandarmalar duymasın diye değil, Zehra duymasın diye.
          halil: Avukat hanım. Kızım bana kızgın değil, ama yorgun. Ona söyleyin: ek nöbet almasın. Üç hafta daha kütüphanedeyim. Kütüphane iyi bir yer.
          halil: Ve kayda geçsin: bugün biri kâğıtları benim gibi okudu. Satır satır.
          - Kapı kapandı. Zehra arka sırada oturmaya devam etti; kimse ona kalkmasını söylemedi.
        `),
      ],
      choices: [cont('H106B_DEVAM', 'Dışarı çık', 'H1_07', { role: 'PRIMARY' })],
    }),
    story('H1_07', {
      ...HEAR1,
      title: 'Merdivenler',
      background: 'adliye',
      lines: [
        W(
          flag('halil_tahliye'),
          S`
            = ADLİYE MERDİVENLERİ · 13.10 @adliye
            - İki saat sonra Halil adliyenin kapısından kendi ayaklarıyla çıktı. Elinde cezaevinden verilen bir poşet: üç kitap, bir diş fırçası, Zehra'nın notu.
            - Zehra ona sarılmadı; önce gözlüğünü düzeltti, sonra sarıldı. Halil kollarını nereye koyacağını bilemedi, sonra kızının sırtına koydu. Dik, kurallı bir sarılma.
            halil: Sardunyayı sulayacağım. Önce sardunya. Sonra bir de... odama gidemem, değil mi? Gidemem. Kural.
            leyla: Bugün bir kapı açıldı, Deniz. Üç hafta var. Zarfın hangi elden geldiğini bul; mahkeme o eli görmek isteyecek.
            - Merdivenin dibinde, kahverengi deri montlu adam bir taksiye biniyordu. Telefonla konuşuyordu; sesi duyulmuyordu. Taksi yağmurun içinde kayboldu.
          `,
        ),
        O(S`
          = ADLİYE MERDİVENLERİ · 13.10 @adliye
          - Ring aracı arka kapıdan çıktı. Zehra merdivenin başında durdu, aracın arka camına baktı; cam buğuluydu, içi görünmüyordu.
          zehra: Üç hafta daha. Üç hafta daha kütüphane. Kitapları yeniden mi dizecek, bilmiyorum.
          leyla: Üç hafta var, Deniz. Zarfın hangi elden geldiğini bul. Mahkeme o eli görmek isteyecek.
          - Merdivenin dibinde, kahverengi deri montlu adam bir taksiye biniyordu. Telefonla konuşuyordu; sesi duyulmuyordu.
        `),
      ],
      choices: [cont('H107_DEVAM', 'Üç hafta', 'ARA_GIRIS_1', { role: 'PRIMARY' })],
    }),
  ],
};

