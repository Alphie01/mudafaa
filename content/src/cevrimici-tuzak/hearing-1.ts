import {
  all,
  any,
  atLeast,
  choiceNode,
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

// 60-hearing-1: 1. celse. Koridor (banka kaydı teslimi), açılış, katılma talebi, sanığın sorgusu (Ece'nin üç hâli),
// savcının sorusu, katılanın beyanı ve soruları, Gökhan'ın tanıklığı (G1–G5), talepler, ara karar ve erteleme.

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
    `Hukuka aykırı yoldan elde edilen kayıt (${by}) hükme esas alınamaz (Anayasa 38/6; CMK 206/2-a, 217/2); yetkisiz erişim TCK 243 ve 136 kapsamındadır.`,
    'USUL_BILGISI',
  ),
];

const banka = deliver('H1_KORIDOR', [
  {
    evidence: 'ev_banka_log',
    requires: flag('dl_log'),
    hint: 'Banka cihaz ve oturum kayıtlarını delil dilekçesiyle iste.',
  },
]);

export const hearing1: CasePart = {
  court: {
    sessions: [
      courtSession('cs_1', '1. Celse', [
        ['s1_acilis', 'ACILIS', 'H1_00'],
        ['s1_sorgu', 'SANIK_SAVUNMASI', 'H1_02'],
        ['s1_tanik', 'TANIK_DINLEME', 'H1_04'],
        ['s1_delil', 'DELIL_TARTISMA', 'H1_06'],
      ]),
    ],
  },
  nodes: [
    story('H1_KORIDOR', {
      ...HEAR1,
      title: 'Koridor',
      background: 'adliye',
      onEnter: banka.effects,
      lines: [
        W(
          flag('dl_log'),
          S`
            = 4 KASIM 2026 · 09.40 — BURSA ADLİYESİ, 3. KAT @adliye
            - Koridor ıslak şemsiyeler ve ucuz kahve kokuyordu. Telefonuma bir bildirim düştü: banka cevabı dosyaya girmiş. Açtım. Bir satırda durdum.
            - "03.11.2025 14.29 — Mobil şube yeni cihaz tanımlama: Samsung SM-A546E." Ece'nin telefonu bir iPhone 8. !flash
            ~ Bir yıl boyunca kimse bu satırı sormamış. Bugün bu salonda bir kez okunacak; yeter de artar da.
            - Telefonu cebime koydum, sonra yeniden çıkardım, satırı bir daha okudum. Samsung. Değişmemişti. Bazı kelimeler ikinci okumada da aynı kalır; insan yine de kontrol eder.
          `,
        ),
        O(S`
          = 4 KASIM 2026 · 09.40 — BURSA ADLİYESİ, 3. KAT @adliye
          - Koridor ıslak şemsiyeler ve ucuz kahve kokuyordu. Dosyaya yeni bir şey girmemişti. Savcının elindekiler, benim elimdekilerden kalındı.
        `),
      ],
      choices: [cont('HK_DEVAM', 'Ece’nin yanına git', 'H1_KORIDOR2')],
    }),
    story('H1_KORIDOR2', {
      ...HEAR1,
      title: 'Bekleyiş',
      background: 'adliye',
      lines: [
        W(
          flag('gece_mesaj'),
          S`
            - Ece bankta oturuyordu; mezuniyet fotoğrafındaki ceketi giymişti. "Kendim gibi geldim" dedi, gülümsemeye çalıştı. Sevim yanında, plastik dosyası dizlerinde.
            - Sevim Hanım sabah beşte kalkıp kızının ceketini ütülemişti; kumaşın üstünde ütünün izi, bir yıl önceki iş görüşmesinin izi gibi duruyordu.
            - Ece beni görünce ayağa kalktı, sonra ne yapacağını bilemeden yeniden oturdu. "Kendim gibi geldim" diye tekrarladı. "Ama kendim gibi olmak bu kadar zor muydu?"
            - Koridorun öbür ucundan Nurettin Aksoy geçti. Ütülü bir ceket, kravat, elinde bir dosya. Ece'ye bakmadı. Bakmamak için çok çaba harcadı.
          `,
        ),
        O(S`
          - Ece bankta oturuyordu; koyu renk bir ceket, sıkılmış yumruklar. Sevim yanında, plastik dosyası dizlerinde.
          - Sevim Hanım sabah beşte kalkıp kızının ceketini ütülemişti. Ece ceketin düğmesini bir açıyor, bir kapatıyordu.
          - Koridorun öbür ucundan Nurettin Aksoy geçti. Ütülü bir ceket, kravat, elinde bir dosya. Ece'ye bakmadı. Bakmamak için çok çaba harcadı.
        `),
      ],
      choices: [cont('HK2_DEVAM', 'Salona gir', 'H1_K3', { role: 'PRIMARY' })],
    }),
    decisionNode('H1_K3', [{ to: 'H1_00' }], {
      ...HEAR1,
      lines: [
        W(
          flag('ucret_sonra'),
          S`- Sevim Hanım beni görünce çantasının fermuarını açtı, zarfın köşesini gösterdi, yeniden kapattı. "Sonra konuşuruz demiştiniz" dedi. "Ben unutmam."`,
        ),
        W(
          flag('deniz_durust'),
          S`- Sevim Hanım beni görünce başını salladı. "Söz vermemiştiniz" dedi. "Ama okumuşsunuz. Kızım söyledi; her satırı sormuşsunuz."`,
        ),
      ],
    }),
    court1.stage('H1_00', {
      title: 'Duruşma · 1. Celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onFirstEnter: [raise('in_court'), meet('hakim'), meet('savci'), meet('mubasir'), meet('nurettin')],
      lines: B(S`
        = BURSA 7. ASLİYE CEZA MAHKEMESİ · 1. CELSE @durusma_salonu
        mubasir: Ece Yalın dosyası! Sanık, müdafi, şikâyetçi, salona! Ece Yalın dosyası!
        - Salon küçüktü; kürsü, iki sıra tahta sıra, bir pencere. Yağmur camı dövüyordu. Hâkim Orhan Bilgiç dosyayı açtı, gözlüğünü taktı.
        hakim: Sanığın kimliği tespit edildi. Tutuksuz. İddianame özetlendi: nitelikli dolandırıcılık. Şikâyetçi Nurettin Aksoy hazır.
        - Savcı Tarık Özen ayağa kalkmadan konuştu; dosyayı açmadan. Bazı savcılar dosyayı ezberler, bazıları dosyanın onları ezberlediğine inanır.
        savci: Sayın Hâkim, olay basit. Hesap sanığın. Para sanığın hesabına geldi, sanığın hesabından çıktı. Gerisi hikâye.
        ~ "Gerisi hikâye." Benim işim, hikâyenin geri kalanını okutmak.
        - Arka sırada Sevim Hanım plastik dosyasını dizlerine bastırdı. Nurettin Aksoy öbür uçta, kollarını kavuşturmuş, tavana bakıyordu. İkisi arasında üç sıra boşluk vardı.
        - Kâtip ekranına eğildi; klavyesinin sesi, yağmurun sesine karıştı. Duvardaki saat on biri iki geçiyordu ve iki dakika ileriydi; bu salonda zaman bile biraz acele ediyordu.
      `),
      choices: [cont('H100_DEVAM', 'Devam', 'H1_01')],
    }),
    court1.objection('H1_01', {
      title: 'Katılma talebi',
      courtStage: 'ACILIS',
      say: S`
        nurettin: Sayın Hâkim, davaya katılmak istiyorum. Param gitti. Hakkım varsa kullanmak isterim.
        - Savcı başını hafifçe bana çevirdi. Bir müdafinin katılana nasıl davrandığı, dosyanın geri kalanını nasıl okuyacağının ilk işaretidir.
        hakim: Müdafi, katılma talebine diyeceğiniz?
      `,
      next: 'H1_02',
      options: [
        option('H101_A', 'Doğrudan zarar gören odur; katılmasına itirazımız yok.', {
          score: { USUL_BILGISI: 50 },
          effects: [inc('legal_hits'), raise('katilma_ok')],
          good: 'Suçtan zarar gören, hüküm verilinceye kadar kamu davasına katılabilir (CMK 237/1); katılan, kendisini zarara uğratan suçta doğrudan zarar görendir. Burada itiraz dayanaksızdır.',
          responses: B(S`
            hakim: Şikâyetçinin katılan olarak davaya kabulüne. Nurettin Bey, buyurun, şuraya oturun.
            - Nurettin şaşkınlıkla bana baktı. Bir avukatın kendisine kapıyı açmasını beklemiyordu.
          `),
        }),
        option('H101_B', 'İtiraz: parayı müvekkilim almadı; ondan zarar görmüş sayılmaz.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Katılma hakkı, zararın sanıktan geldiğinin ispatına bağlı değildir; suçtan doğrudan zarar görmek yeter (CMK 237/1). Bu, esası katılma aşamasında tartışmaktır.',
          responses: B(S`
            hakim: Müdafi, kimin aldığını hüküm gösterir; katılmayı zarar gösterir. Katılan olarak kabulüne.
            - Nurettin bana döndü. Gözlerinde bir şey sertleşti.
          `),
        }),
        option('H101_C', 'İtiraz: kovuşturma evresinde katılma talep edilemez.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Katılma, ilk derece mahkemesinde hüküm verilinceye kadar mümkündür (CMK 237/1).',
          responses: B(S`
            hakim: Edilir, müdafi. Hükme kadar edilir. Katılan olarak kabulüne.
          `),
        }),
        option('H101_D', 'Takdir mahkemenizdedir; ayrıca diyeceğimiz yok.', {
          neutral: 'Usulen hatalı değil; ama katılma açıkça kabul edilecek bir talepti.',
          responses: B(S`hakim: Katılan olarak kabulüne.`),
        }),
      ],
    }),
    court1.stage('H1_02', {
      title: 'Sanığın sorgusu',
      courtStage: 'SANIK_SAVUNMASI',
      witness: 'ece',
      witnessLabel: 'SANIK · ECE YALIN',
      lines: B(S`
        hakim: Sanık, ayağa kalkın. Size yüklenen suçu anladınız mı? Susma hakkınız var; bir avukattan yardım alma hakkınız var, avukatınız yanınızda. Lehinize delilleri isteyebilirsiniz.
        ece: Anladım, efendim.
        hakim: Anlatın. Baştan.
        - Ece bir an bana baktı. Sonra pencereye. Sonra hâkime.
      `),
      choices: [cont('H102_DEVAM', 'Ece anlatıyor', 'H1_02R')],
    }),
    decisionNode(
      'H1_02R',
      [{ when: flag('ece_durust'), to: 'H1_02D' }, { when: flag('ece_sus'), to: 'H1_02S' }, { to: 'H1_02I' }],
      { ...HEAR1 },
    ),
    story('H1_02D', {
      ...court1.base,
      title: 'Ece’nin anlatımı',
      background: 'durusma_salonu',
      lines: B(S`
        ece: Bir iş ilanına başvurdum. Nova Dijital. Kaan Bey diye biri. Kimliğimi, IBAN'ımı istedi; verdim. Eğitim avansı diye dört bin beş yüz lira geldi.
        ece: Üç Kasım'da "SGK işe giriş için kod gelecek, okuyun" dedi. Okudum. Dört, dört, yedi, bir. Kâğıda yazdım, "SGK" diye. Mesajın gerisini okumadım.
        - Salonda biri öksürdü. Savcı kalemini bıraktı.
        ece/uzgun: Polise "kimseyle kod paylaşmadım" dedim. Yalan söyledim. Utandım. Aptal görünmektense yalancı görünmek daha kolay geldi. Bugün düzeltiyorum.
        ece: Ertesi sabah telefonum sustu. "SIM yok." Kaan Bey'i annemin telefonundan aradım; "kurumsal hatta geçiyoruz" dedi. Bir gece önce de "yarın hattınız kesilebilir" yazmıştı.
        ece: Akşam operatöre gittim, "işlemi ben yapmadım" diye imza attım. Ben o parayı görmedim bile.
        > Sayın Hâkim, sanığın sözünü ettiği notu ve yazışmaların ekran görüntülerini dosyaya sunuyoruz.
        hakim: Alınsın. Tutanağa geçirin: sanık kolluk ifadesinin bir kısmını düzeltiyor.
        - Kâtip yazarken klavyenin sesi salonu doldurdu. Ece gözlerini kapadı; kendi cümlesinin harf harf tutanağa girişini dinliyordu.
        savci: Sayın Hâkim, sanığın beyanını not ediyoruz. Kodu okuduğunu kabul ediyor. Bunun ne anlama geldiğini mütalaada değerlendireceğiz.
        ~ Bir yıl sonra, aynı cümle. Ama bu sefer yanında bir kâğıt var. Ve bir kız, kendi sesiyle.
      `),
      choices: [cont('H102D_DEVAM', 'Müvekkile soru sor', 'H1_02Q')],
    }),
    story('H1_02S', {
      ...court1.base,
      title: 'Ece’nin anlatımı',
      background: 'durusma_salonu',
      lines: B(S`
        ece: Bir iş ilanına başvurdum. Nova Dijital. Kimliğimi, IBAN'ımı istediler; verdim. Eğitim avansı diye para geldi. Ertesi hafta telefonum sustu.
        ece: Akşam operatöre gittim; hattım başka bir bayide değiştirilmiş. Ben değiştirmedim. "İşlemi ben yapmadım" diye imza attım.
        hakim: Bir kod verdiniz mi birine?
        ece: O konuda… avukatımla konuştum. Susma hakkımı kullanıyorum.
        - Savcı başını kaldırdı. Gözlerinde, kumarda bir kart açılmış gibi bir ışık.
        ~ Hakkı. Ve bu salonda herkes, o hakkın bir şeyi sakladığını düşündü.
      `),
      choices: [cont('H102S_DEVAM', 'Müvekkile soru sor', 'H1_02Q')],
    }),
    story('H1_02I', {
      ...court1.base,
      title: 'Ece’nin anlatımı',
      background: 'durusma_salonu',
      lines: B(S`
        ece: Bir iş ilanına başvurdum. Nova Dijital. Kimliğimi, IBAN'ımı istediler; verdim. Eğitim avansı diye para geldi. Ertesi hafta telefonum sustu.
        ece: Akşam operatöre gittim; hattım başka bir bayide değiştirilmiş. Ben değiştirmedim.
        hakim: Bir kod verdiniz mi birine?
        ece: Hayır, efendim. Kimseyle kod paylaşmadım.
        - Sesi düzdü. Fazla düz. Bir yıl önce bir ifade odasında söylenmiş bir cümlenin, bir yıl boyunca cilalanmış hâli.
        ~ Bu cümle bugün tutanağa ikinci kez giriyor. Bir gün biri onu bankanın saatiyle yan yana koyacak.
      `),
      choices: [cont('H102I_DEVAM', 'Müvekkile soru sor', 'H1_02Q')],
    }),
    choiceNode('H1_02Q', {
      ...court1.base,
      title: 'Sanığa sorular',
      background: 'durusma_salonu',
      prompt: { speaker: 'hakim', text: 'Müdafi, sanığa sorularınız?' },
      choices: [
        option('H102Q_A', 'Kaan Bey’le nasıl tanıştın? Yüzünü hiç gördün mü?', {
          score: { SORGULAMA: 30 },
          good: 'Açık uçlu soru; sanığın kendi anlatımı tutanağa geçti (CMK 201/1).',
          responses: B(S`
            ece: Bir iş sitesinde ilan. Görüntülü mülakat yaptık ama onun kamerası bozukmuş. Ben görünüyordum, o görünmüyordu. Sesini biliyorum, yüzünü bilmiyorum.
            ece: Arkasından bir asansör sesi geldi: "Dördüncü kat." İş merkezindeyiz dedi.
            - Katılan sırasında Nurettin Aksoy başını kaldırdı. Bir şey yazdı; dilekçesine bir dipnot daha ekler gibi.
          `),
          next: '$stay',
        }),
        option('H102Q_B', 'O notu ne zaman, neden yazdın?', {
          visibleWhen: flag('ece_durust'),
          score: { SORGULAMA: 40 },
          effects: [inc('pers')],
          good: 'Belgeyi sanığın kendi ağzından bağlamına oturttun; not, kodun ne sanılarak okunduğunu gösteriyor.',
          responses: B(S`
            ece: Telefondayken. O "kodu okur musunuz" dedi; ben kâğıda yazdım, unutmayayım diye. "SGK" diye yazdım, çünkü öyle dedi. Bir de gülen yüz çizdim. İşe girdim sandım.
            savci: Sanık, mesajın tamamını okudunuz mu?
            ece/uzgun: Hayır. "Kodunuz: 4471" kısmını okudum. Gerisini okusaydım… burada olmazdım.
          `),
          next: '$stay',
        }),
        option('H102Q_C', '4 Kasım akşamı nereye gittin, ne yaptın?', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_itiraz_tutanak')],
          good: 'Sanığın aynı gün operatöre itiraz ettiği tutanağa geçti; davranışı, kastın yokluğuyla tutarlı.',
          responses: B(S`
            ece: Operatörün mağazasına. Hattım başka bir bayide değiştirilmiş. "İşlemi ben yapmadım" diye bir kâğıt imzaladım. Yeni kart aldım.
            hakim: Bunu neden polise bildirmediniz?
            ece/uzgun: Korktum, efendim. Polise gidersem bana inanmazlar sandım. Haklı çıktım da; ben gitmedim, onlar geldi.
          `),
          next: '$stay',
        }),
        cont('H102Q_BITTI', 'Başka sorum yok', 'H1_03', { role: 'PRIMARY' }),
      ],
    }),
    court1.objection('H1_03', {
      title: 'Savcının sorusu',
      courtStage: 'SANIK_SAVUNMASI',
      witness: 'ece',
      witnessLabel: 'SANIK · ECE YALIN',
      say: S`
        - Savcı ayağa kalktı. Bu sefer sesi yumuşaktı; sertlikten daha tehlikeli bir yumuşaklık.
        savci: Sanık, size bir soru. 1 Kasım'da hesabınıza dört bin beş yüz lira geldi; o parayı hesabınızı kullandırmanın karşılığı olarak aldınız, değil mi?
      `,
      next: 'H1_03R',
      options: [
        option('H103_A', 'İtiraz: soru yönlendirici, cevabı içinde taşıyor.', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits')],
          good: 'Savcı sanığa doğrudan soru sorabilir (CMK 201/1); ancak cevabı içinde taşıyan, yönlendirici soru reddedilir. Hâkim soruyu yeniden kurdurur.',
          responses: B(S`
            hakim: Kabul. Savcı bey, soruyu açık sorun.
            savci: Peki. Sanık, o dört bin beş yüz lira neyin karşılığıydı?
            ece: Eğitim avansı. Açıklamasında da öyle yazıyor.
          `),
        }),
        option('H103_B', 'İtiraz: sanığa soruyu ancak mahkeme aracılığıyla savcı yöneltebilir.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Savcı ve müdafi, sanığa doğrudan soru yöneltebilir (CMK 201/1). İtiraz, sorunun biçimine yapılmalıydı.',
          responses: B(S`
            hakim: Sorabilir, müdafi. Reddedildi. Sanık, cevap verin.
            ece/saskin: Ben… hayır. Avans dediler.
          `),
        }),
        option('H103_C', 'Müvekkilim bu soruya cevap vermeyecek.', {
          neutral: 'Susma hakkı meşrudur; ama burada sorunun biçimine itiraz edilebilirdi ve cevap Ece’nin lehineydi.',
          responses: B(S`
            savci: Not edelim. Sanık para konusunda susuyor.
            ~ Susmaması gereken yerde susturdum. Bir cevabın lehte olduğu yerde, sessizlik aleyhe okunur.
          `),
        }),
        option('H103_D', 'Bir şey söyleme; sorunun cevabını Ece versin.', {
          effects: [dec('pers')],
          neutral: 'Yönlendirici soru cevapsız itirazsız geçti; Ece’nin “hayır”ı savcının cümlesinin içinde kayboldu.',
          responses: B(S`
            ece/saskin: Hayır! Yani… o bir avanstı. Hesabımı kimseye kiralamadım.
            savci: "Hayır" dediniz. Not edelim. Para geldi ve "hayır" dediniz.
          `),
        }),
      ],
    }),
    decisionNode('H1_03R', [{ to: 'H1_04' }], {
      ...HEAR1,
      lines: [
        W(
          flag('katilma_ok'),
          S`- Nurettin Aksoy artık katılan sırasında oturuyordu; avukatsız, ama bir sandalyesi vardı. Dosyasını dizlerine koymuş, kalemini hazır tutuyordu.`,
        ),
      ],
    }),
    story('H1_04', {
      ...court1.base,
      title: 'Katılanın beyanı',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('nurettin_soz'),
          S`
            hakim: Katılan, olayı anlatın.
            nurettin: Sayın Hâkim, ilanı gördüm, aradım, para gönderdim. Araba yoktu. Hesap bu hanımın adınaydı. Avukatı da bana telefonda "paranızı geri alacağız" dedi.
            - Savcı başını bana çevirdi. Kaşları yukarıdaydı.
            nurettin: Yani kabul ediyorlar. Ben öğretmendim; söylenen sözün ne demek olduğunu bilirim.
            ~ Bir telefon, bir cümle. Duruşma, telefonun öbür ucundaki her şeyi hatırlar.
          `,
        ),
        O(S`
          hakim: Katılan, olayı anlatın.
          nurettin: Sayın Hâkim, eşim haftada üç gün diyalize giriyor. Ona bir araba lazımdı. İlanı gördüm, aradım. Satıcı çok kibardı; "hocam" dedi, "kardeşimin hesabına yatırın" dedi.
          nurettin: Hesap bu hanımın adınaydı. Ece Yalın. Kâğıda yazdım. Gönderdim. Sonra hiçbir şey. Telefon kapalı, adres boş.
          nurettin/kizgin: Ben bu kızı tanımam. Ama adı benim cüzdanımda bir yıldır duruyor. Cezasını istiyorum.
          nurettin: Eşim her duruşmayı soruyor. "Bugün ne oldu?" Ben "bir şey olmadı" diyorum. Bir yıldır hiçbir şey olmadı, Sayın Hâkim. Bugün bir şey olsun istiyorum.
        `),
      ],
      choices: [cont('H104_DEVAM', 'Katılana soru sor', 'H1_04Q')],
    }),
    choiceNode('H1_04Q', {
      ...court1.base,
      title: 'Katılana sorular',
      prompt: { speaker: 'hakim', text: 'Müdafi, katılana sorunuz var mı?' },
      choices: [
        option('H104Q_A', 'Satıcıyla telefonda konuştunuz. Ses bir kadın sesi miydi, erkek mi?', {
          score: { SORGULAMA: 50 },
          effects: [inc('pers'), raise('fact_kaan_erkek')],
          good: 'Katılanın kendi gözlemi soruldu; telkinsiz, açık bir soru (CMK 201). Satıcının bir erkek olduğu tutanağa geçti.',
          responses: B(S`
            nurettin: Erkekti. Genç mi yaşlı mı, telefonda kestiremedim. Kendini Kaan diye tanıttı. Kadın değildi; bundan eminim.
            nurettin: Bir de… çok emindi. Hiç acele etmiyordu. Dolandırıcılar acele eder sanırdım; bu etmedi. "Siz bilirsiniz hocam" diyordu. Bana karar verdiriyormuş gibi.
            > Telefonda konuştuğunuz kişi, şu an sanık sandalyesinde oturan kişi miydi?
            nurettin: …Hayır. O bir erkekti.
            - Salonda bir şey kıpırdadı. Hâkim kâtibe bir şey dikte etti.
          `),
          next: '$stay',
        }),
        option('H104Q_B', 'Dilekçenizde bir dipnot var: arkadan bir anons duymuşsunuz. Anlatır mısınız?', {
          visibleWhen: has('clue_ding_nurettin'),
          score: { SORGULAMA: 50 },
          effects: [inc('pers'), raise('fact_nurettin_anons')],
          good: 'Belgede bulduğun ayrıntıyı katılanın kendi ağzından tutanağa geçirdin; telkinsiz.',
          responses: B(S`
            nurettin: Evet. Bir sinyal, sonra kayıtlı bir kadın sesi: "Dördüncü kat." Asansör. Satıcı bir binadaydı; ben de "galeride çalışıyor" sanmıştım.
            ~ Dördüncü kat. Ece de aynı sesi duymuştu. İki kurban, bir asansör.
          `),
          next: '$stay',
        }),
        option('H104Q_C', 'Hiç görmediğiniz bir satıcıya, tanımadığınız bir hesaba parayı neden gönderdiniz?', {
          score: { SORGULAMA: -50 },
          effects: [dec('pers')],
          bad: 'Mağduru suçlayan soru, savunmaya hiçbir şey kazandırmaz ve heyetin gözünde müdafiyi küçültür.',
          responses: B(S`
            nurettin/kizgin: Çünkü insanlara inanırım, hanımefendi! Kırk yıl inandım! Siz de mi beni suçluyorsunuz?
            hakim: Müdafi, soruyu geri alın. Katılanı suçlamak sanığı aklamaz.
          `),
          next: '$stay',
        }),
        cont('H104Q_BITTI', 'Başka sorum yok', 'H1_05', { role: 'PRIMARY' }),
      ],
    }),
    court1.stage('H1_05', {
      title: 'Tanık: Siber Şube',
      courtStage: 'TANIK_DINLEME',
      witness: 'gokhan',
      witnessLabel: 'TANIK · KOM. YRD. GÖKHAN ATEŞ',
      lines: B(S`
        mubasir: Tanık Gökhan Ateş!
        - Gökhan üniformasız, gri bir ceketle girdi. Tanık kürsüsüne geçti, ellerini nereye koyacağını bilemedi, sonunda kürsünün kenarına koydu.
        hakim: Kimliğiniz tespit edildi. Gerçeği söyleyeceğinize yemin ettiniz. Raporunuzu özetleyin.
        gokhan: Sayın Hâkim, dosya standart. Ben anlatayım, avukat hanım sorar.
        gokhan: Bir şikâyet geldi, bankaya yazı yazdık. Banka hesabın sanığa ait olduğunu, paranın gelip gittiğini bildirdi. Sanığı çağırdık, ifadesini aldık. Raporu yazdık.
        gokhan: Bu tür dosyalarda hesap sahipleri genelde ya hesabını kiraya verir ya da bizzat işlem yapar. İkisinin de cezası var.
        - Savcı başıyla onayladı. Hâkim not aldı. Gökhan'ın sesi, aynı cümleyi dört yüz kez kurmuş birinin sesiydi; düz, yorgun, ama kendinden emin.
        ~ "Genelde." Bu dosyada bir yıldır hiçbir şey genel değil. Her şey tek bir telefona, tek bir sabaha, tek bir koda dayanıyor.
      `),
      choices: [cont('H105_DEVAM', 'Tanığı dinle', 'H1_05T')],
    }),
    court1.testimony('H1_05T', {
      title: 'Çapraz sorgu: Gökhan Ateş',
      courtStage: 'TANIK_DINLEME',
      witness: 'gokhan',
      witnessLabel: 'TANIK · KOM. YRD. GÖKHAN ATEŞ',
      say: S`
        hakim: Tanık beyanını verdi. Müdafi, sorularınız?
        - Gökhan kürsünün kenarını tuttu. Raporunu ezbere biliyordu; ama raporunun neyi içermediğini ilk kez bu salonda düşünecekti.
      `,
      rulesText:
        'Önce bastır, sonra doğru delille vur. Yanlış delil güvenilirliği ve skoru düşürür; kanaate itiraz edilebilir.',
      objectionGrounds: ['g_kanaat', 'g_duyum', 'g_telkin'],
      statements: [
        statement('G1', 1, [
          'İnceleme sonucunda hesabın sanığa ait olduğu ve 4 Kasım işlemlerinin ',
          hl('sanığın kendi telefonundan, mobil şubesinden', any(flag('press_g1'), has('ev_banka_log'))),
          ' yapıldığı tespit edildi.',
        ]),
        statement('G2', 2, [
          '1 Kasım’da hesaba gelen 4.500 TL, ',
          hl('hesabın kiralanmasının bedelidir', any(flag('press_g2'), has('ded_dongu'))),
          '. Bu tür dosyalarda bu tutarlar olağandır.',
        ]),
        statement('G3', 3, [
          'İşlemlerin onay SMS’leri ',
          hl('sanığın kendi hattına gitmiştir', any(flag('press_g3'), has('ev_sim_dokum'))),
          '; hat o gün sanığın elindeydi.',
        ]),
        statement('G4', 4, [
          'ATM’den kartsız çekim yapıldı. Görüntü gelmedi, ama ',
          hl('çeken muhtemelen sanığın bir yakınıdır'),
          '.',
        ]),
        statement(
          'G5',
          5,
          [
            'Sanık ifadesinde kimseyle kod paylaşmadığını söyledi. ',
            hl('O hâlde yeni cihazı kendisi tanımlamıştır'),
            '.',
          ],
          flag('press_g1'),
        ),
      ],
      rules: [
        presentRule('PS_G_ILLEGAL', undefined, ['ev_bayi_ekran'], {
          effects: illegalPresented('bayi sistemi ekran görüntüsü'),
          responses: B(S`
            savci/kizgin: Sayın Hâkim! Bu ekran görüntüsü nereden geliyor? Operatör sistemine kim girdi? Müdafi açıklasın!
            hakim: Müdafi? … Cevap yok. Belge hükme esas alınmayacaktır. Tutanağa geçirin. Ayrıca değerlendirilecektir.
            ~ Elimde altın sandığım şey, avucumda pas. Ve pas bulaşıcı.
          `),
        }),
        presentRule('PS_G_SAVCILIK', undefined, ['ev_siber_rapor', 'ev_ece_ifade', 'ev_sikayet'], {
          maxUses: 3,
          effects: [
            ...wrongEvidence,
            mark('BAD', 'İddianın dayanağı olan belgeyi savunma delili gibi sundun.', 'SORGULAMA'),
          ],
          responses: B(S`
            savci: Sayın Hâkim, müdafi bizim delilimizi sunuyor. Teşekkür ederiz.
            hakim: Müdafi, bu belge tanığın beyanını destekliyor. Ne göstermek istediniz?
          `),
        }),
        pressRule('PR_G1', 'G1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_g1')],
          responses: B(S`
            > "Sanığın kendi telefonundan." Hangi telefon? Marka, model?
            gokhan: Banka "mobil kanal" yazdı. Mobil kanal, sanığın mobil şubesi demek. Hesap onun, şifre onun.
            > Cihaz kaydını istediniz mi?
            gokhan: …Hayır. Gerek görmedik. Sanık zaten ifadesinde kimseyle kod paylaşmadığını söyledi.
          `),
        }),
        presentRule('PS_G1', 'G1', ['ev_banka_log'], {
          enabledWhen: flag('press_g1'),
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_g1'),
            mark('GOOD', 'Banka cihaz kaydı, işlemlerin sanığın telefonundan yapılmadığını gösterdi.', 'SORGULAMA'),
          ],
          responses: B(S`
            > Sayın Hâkim, banka cevabı dosyada. 3 Kasım 14.29: mobil şubeye yeni bir cihaz tanımlanmış, Samsung. 4 Kasım işlemlerinin hepsi o cihazdan.
            > Cihaz tanımlaması bir SMS koduyla yapılmış. Kod 14.29'da gelmiş, aynı dakika kullanılmış. Bu kaydı tanığın raporunda bulamazsınız; çünkü istenmemiş.
            > Sanığın kayıtlı telefonu bir iPhone 8; son oturumu 2 Kasım akşamı.
            gokhan/saskin: Samsung mu? Ben… bu yazı bana gelmedi. Bana yalnızca özet gelmişti.
            hakim: Tanık, işlemler sanığın telefonundan yapılmış mı, yapılmamış mı?
            gokhan/uzgun: Bu kayda göre… sanığın telefonundan değil, Sayın Hâkim.
            - Savcı dosyasını bir sayfa geri çevirdi, bir sayfa ileri. Aradığı sayfa yoktu.
            hakim: Tanık, bu kaydı neden istemediniz?
            gokhan/uzgun: Bende dört yüz dosya var, Sayın Hâkim. Bu bir mazeret değil. Ama bir açıklama.
          `),
        }),
        pressRule('PR_G2', 'G2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_g2')],
          responses: B(S`
            > "Kiralama bedeli." Bunu neye dayanarak söylüyorsunuz?
            gokhan: Tecrübeye. Bu dosyalarda hep böyle küçük bir para gelir, sonra büyüğü geçer.
            > Gönderen hesabı incelediniz mi?
            gokhan: Gönderen başka bir dosyanın konusu.
          `),
        }),
        presentRule('PS_G2', 'G2', ['ded_dongu'], {
          enabledWhen: flag('press_g2'),
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_g2'),
            mark(
              'GOOD',
              'Avansı gönderen hesabın kaporadan pay aldığı gösterildi: ödeme, kiralama bedeli değil, tuzağın yemi.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > 1 Kasım'daki dört bin beş yüz lirayı gönderen IBAN …0418. 4 Kasım 13.58'de kaporadan on beş bin lira aynı IBAN'a geri gitmiş.
            > Kira bedelini ödeyen, kirayı geri mi alır? Bu bir bedel değil, Sayın Hâkim. Bir yem. Ve oltaya geri sarılmış.
            > Bir kiracı ev sahibine kira öder. Ev sahibi, kirayı bir hafta sonra kiracının cebinden geri almaz. Bu bir kira değil; bir oltanın ucundaki yem.
            - Gökhan dosyasını karıştırdı; aradığı şey orada değildi. Bir yıl önce sormadığı soru, bugün bir boşluk olarak duruyordu.
            gokhan: …O hesabı sormadık. Haklısınız, aynı hesap.
            savci: Sayın Hâkim, bu yalnızca paranın bir kısmı.
            hakim: Bir kısmı, savcı bey. Ama "kira bedeli" denen kısmı.
          `),
        }),
        presentRule('PS_G2_P', 'G2', ['ev_hesap'], {
          visibleWhen: has('clue_avans'),
          enabledWhen: all(has('clue_avans'), flag('press_g2')),
          score: { SORGULAMA: 100 },
          effects: [
            inc('pers'),
            raise('g2_kismi'),
            mark(
              'GOOD',
              'EFT açıklaması “eğitim avansı” diyor; tam çürütme için paranın döngüsünü göstermek gerekirdi.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > EFT'nin açıklama alanı: "Nova Dijital eğitim avansı." Gönderen ona kira bedeli dememiş.
            gokhan: Açıklama alanına herkes her şeyi yazar.
            ~ Haklı. Bir açıklama, bir iddiadır. Paranın nereye döndüğü ise bir olgu.
          `),
        }),
        presentRule('PS_G2_K', 'G2', ['ded_kaan'], {
          enabledWhen: flag('press_g2'),
          score: { SORGULAMA: 100 },
          effects: [
            inc('pers'),
            raise('g2_kaan'),
            mark(
              'GOOD',
              'İşveren ile sahte satıcının aynı hat olduğu gösterildi; avansın kaynağını da gösterseydin “kira bedeli” tamamen çökerdi.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Avansı gönderen "işveren" ile katılana araba satan "satıcı" aynı numarayı kullanıyor. İş ilanı, kimlik ve hesap toplamak için kurulmuş bir tuzak.
            gokhan: Aynı numara mı? Bu… bunu bilmiyordum. Ama yine de para sanığın hesabına girdi.
          `),
        }),
        pressRule('PR_G3', 'G3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_g3')],
          responses: B(S`
            > "Hat o gün sanığın elindeydi." Hattın değiştirilip değiştirilmediğine baktınız mı?
            gokhan: Hayır. Hat sanığın adına. SMS hatta gider, hat sanığın.
            > Ya hat o sabah başka bir karta geçirildiyse?
            gokhan: O zaman… o zaman SMS yeni karta gider. Ama böyle bir bilgi bende yok.
          `),
        }),
        presentRule('PS_G3', 'G3', ['ev_sim_dokum', 'ded_sim', 'ded_kesinti'], {
          enabledWhen: flag('press_g3'),
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_g3'),
            mark(
              'GOOD',
              'Operatör dökümü, hattın 4 Kasım 10.12’de başka bir bayide vekille değiştirildiğini gösterdi.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Operatör dökümü, Sayın Hâkim. 4 Kasım 10.12: Kent Meydanı'nda bir bayide, vekil aracılığıyla SIM değişikliği. Kaporanın gelişinden üç buçuk saat önce.
            > Aynı akşam 19.20: abonenin kendi itirazı. "İşlemi ben yapmadım." Bir yıl önce, kimse sormadan.
            gokhan/saskin: Vekil mi? Sanık vekâlet vermiş mi?
            ece: Vermedim!
            hakim: Sanık, söz size verilmedi. … Ama not edildi.
            - Savcı ilk kez bir şey yazdı. Uzun bir şey. Sonra kalemini bıraktı ve bana baktı; kızgın değil, dikkatli.
          `),
        }),
        pressRule('PR_G4', 'G4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_g4')],
          responses: B(S`
            > Görüntü gelmedi, ama çekeni tahmin ediyorsunuz. Neye dayanarak?
            gokhan: Bu dosyalarda genelde bir yakını çeker. Kardeş, sevgili.
            > Genelde.
            gokhan: …Genelde.
          `),
        }),
        objectRule('OB_G4', 'G4', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('legal_hits'),
            raise('obj_g4'),
            mark('GOOD', 'İtiraz yerinde: tanık görmediği bir görüntü hakkında kanaat bildiriyor.', 'SORGULAMA'),
          ],
          responses: B(S`
            > İtiraz, Sayın Hâkim. Tanık görmediği bir görüntüyü tahminle dolduruyor.
            hakim: Kabul. Tanık, görmediğiniz şeyi anlatmayın. Tutanağa "görüntü dosyada yoktur" diye geçirin.
            gokhan: Haklısınız. Görmedim. Görüntü istendi, gelmedi.
          `),
        }),
        pressRule('PR_G5', 'G5', {
          score: { SORGULAMA: 25 },
          responses: B(S`
            > "O hâlde." Yani kodun paylaşılmadığı doğruysa, cihazı sanık tanımlamıştır. Ya kod paylaşıldıysa?
            gokhan: O zaman… kodu kime verdiyse o tanımlamıştır. Ama sanık vermediğini söyledi.
            > Söyledi. Bir yıl önce. Avukatsız.
          `),
        }),
        objectRule('OB_G5', 'G5', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('legal_hits'),
            raise('obj_g5'),
            mark('GOOD', 'İtiraz yerinde: “o hâlde” bir olgu değil, tanığın çıkarımıdır.', 'SORGULAMA'),
          ],
          responses: B(S`
            > İtiraz. "O hâlde" bir olgu değil, tanığın çıkarımı.
            hakim: Kabul. Tanık, tespitlerinizi anlatın; sonuç çıkarmayı mahkemeye bırakın.
          `),
        }),
        presentRule('PS_G1_ERKEN', 'G1', ['ev_banka_log'], {
          enabledWhen: not(flag('press_g1')),
          maxUses: 3,
          responses: B(S`
            hakim: Müdafi, belgeyi sunmadan önce tanığa sorun. Neyin çeliştiğini önce tanığın ağzından duyalım.
            ~ Önce soru, sonra kâğıt. Belge bir cevabı çürütür; henüz sorulmamış bir cevabı değil.
          `),
        }),
        presentRule('PS_G2_ERKEN', 'G2', ['ded_dongu', 'ded_kaan', 'ev_hesap'], {
          enabledWhen: not(flag('press_g2')),
          maxUses: 3,
          responses: B(S`
            hakim: Müdafi, belgeyi sunmadan önce tanığa sorun. Neyin çeliştiğini önce tanığın ağzından duyalım.
            ~ Önce soru, sonra kâğıt. Belge bir cevabı çürütür; henüz sorulmamış bir cevabı değil.
          `),
        }),
        presentRule('PS_G3_ERKEN', 'G3', ['ev_sim_dokum', 'ded_sim', 'ded_kesinti'], {
          enabledWhen: not(flag('press_g3')),
          maxUses: 3,
          responses: B(S`
            hakim: Müdafi, belgeyi sunmadan önce tanığa sorun. Neyin çeliştiğini önce tanığın ağzından duyalım.
            ~ Önce soru, sonra kâğıt. Belge bir cevabı çürütür; henüz sorulmamış bir cevabı değil.
          `),
        }),
        presentRule('PS_G5', 'G5', ['ded_aldatma', 'ev_not'], {
          visibleWhen: flag('ece_durust'),
          enabledWhen: flag('ece_durust'),
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_g5'),
            mark(
              'GOOD',
              'Tanığın öncülü (kod paylaşılmadı) sanığın düzelttiği beyan ve notla çöktü; kod aldatılarak okunmuştu.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Tanığın mantığı bir öncüle dayanıyor: kod paylaşılmadı. Sanık bugün bu öncülü kendisi düzeltti.
            > Kod okundu, evet. Ama "SGK işe giriş kodu" diye istendi. Mesaj 14.26'da geldi; not aynı dakikada yazıldı: "4471 — SGK."
            gokhan: Yani sanık… bankanın kodunu okuduğunu bilmiyordu.
            hakim: Tanık, bunu siz değil, mahkeme takdir eder. Ama sorunun cevabını verdiniz.
            ~ Bir yıl önce tek bir cümle bir dosyayı kurdu. Bugün aynı cümlenin düzeltilmiş hâli, o dosyanın bir duvarını yıktı.
          `),
        }),
        presentRule('PS_G5_X', 'G5', ['ded_aldatma', 'ev_not'], {
          visibleWhen: all(not(flag('ece_durust')), not(flag('ece_sus'))),
          enabledWhen: all(not(flag('ece_durust')), not(flag('ece_sus'))),
          effects: [
            dec('cred'),
            dec('pers', 2),
            inc('wrong'),
            raise('kod_ortaya'),
            score('SORGULAMA', -150, 'hatali'),
            mark(
              'BAD',
              'Müvekkilin az önceki “kimseyle kod paylaşmadım” beyanını kendi delilinle yalanladın; savunmanın tutarlılığı çöktü.',
              'SAVUNMA_STRATEJISI',
            ),
          ],
          responses: B(S`
            savci: Sayın Hâkim, müdafi sanığın beş dakika önceki beyanını yalanlayan bir not sunuyor. Biz de teşekkür ederiz.
            ece/saskin: Avukat hanım?
            - Ece'nin yüzü bembeyazdı. Hâkim gözlüğünü çıkardı.
            ~ Kendi müvekkilimi kendi elimle kürsüde yalancı çıkardım. Doğru delil, yanlış zamanda, düşmandır.
          `),
        }),
        presentRule('PS_G5_S', 'G5', ['ded_aldatma', 'ev_not'], {
          visibleWhen: flag('ece_sus'),
          enabledWhen: flag('ece_sus'),
          score: { SORGULAMA: 100 },
          effects: [
            inc('pers'),
            raise('kod_ortaya'),
            mark(
              'NEUTRAL',
              'Not, kodun aldatılarak okunduğunu gösteriyor; ama sanığın sessizliği bu açıklamayı onun ağzından almadı.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Sanık susma hakkını kullandı. Ama bu not konuşuyor: "4471 — SGK." Kod SGK diye istendi.
            savci: O hâlde sanık kodu okudu. Susarak değil, notla itiraf etti.
            hakim: Müdafi, bunu sanık mı anlatacak, not mu?
            ~ İkisi birden anlatmalıydı. Ben yalnızca birini getirdim.
          `),
        }),
      ],
      presentMiss: fallback('FB_G_PRESENT', 'PRESENT', {
        effects: [...wrongEvidence, mark('BAD', 'Sunulan delil ifadeyle ilgisiz; güvenilirlik düştü.', 'SORGULAMA')],
        responses: B(S`
          hakim: Müdafi, bu belgenin bu beyanla ilgisini göremiyorum.
          gokhan: Ben de göremiyorum, Sayın Hâkim.
        `),
      }),
      objectMiss: fallback('FB_G_OBJECT', 'OBJECT', {
        effects: [dec('cred'), score('SORGULAMA', -50, 'hatali'), mark('BAD', 'Dayanaksız itiraz.', 'SORGULAMA')],
        responses: B(S`hakim: İtiraz reddedildi. Devam edin.`),
      }),
      finish: { id: 'H105_BITIR', label: 'Çapraz sorguyu bitir', next: 'H1_06' },
    }),
    choiceNode('H1_06', {
      ...court1.base,
      title: 'Talepler',
      background: 'durusma_salonu',
      prompt: { speaker: 'hakim', text: 'Müdafi, delillere ve dosyanın eksiklerine ilişkin talepleriniz?' },
      hud: ['dil_hak'],
      lines: B(S`
        ~ Hâkim her talebi dinler; ama dayanağı olmayan talep, dosyanın eksiğini değil, avukatın eksiğini gösterir. Yalnızca araştırmamın gösterdiği eksikleri isteyebilirim.
      `),
      choices: [
        option('RQ_LOG', 'Bankadan mobil şube cihaz ve oturum kayıtlarının istenmesi', {
          visibleWhen: all(not(flag('dl_log')), flag('fact_polis_eksik')),
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 30 },
          effects: [raise('rq_log')],
          good: 'Eksik delilin toplanması istenebilir; mahkeme maddi gerçeği araştırır (CMK 206, 225 vd.). Kayıt ara karar cevabıyla gelir.',
          next: '$stay',
        }),
        option('RQ_HTS', 'Sanığın hattı için 3–5 Kasım 2025 iletişim tespiti (IMEI dahil)', {
          visibleWhen: all(not(flag('dl_hts')), any(has('clue_simyok'), has('clue_iphone_imei'))),
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 30 },
          effects: [raise('rq_hts')],
          good: 'Kovuşturma evresinde sanığın hattı için iletişimin tespitine mahkeme karar verir (CMK 135/6).',
          next: '$stay',
        }),
        option('RQ_BAYI', 'Operatörden SIM değişikliği işlem belgelerinin istenmesi', {
          visibleWhen: all(not(flag('dl_bayi')), has('ev_sim_dokum')),
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 30 },
          effects: [raise('rq_bayi')],
          good: 'Bayinin yüklediği kimlik ve vekâletname, kimin işlem yaptığını gösterir.',
          next: '$stay',
        }),
        option('RQ_ATM', 'ATM kamera görüntülerinin istenmesi', {
          visibleWhen: all(not(flag('dl_atm')), has('clue_qr_atm')),
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 20 },
          effects: [raise('rq_atm')],
          good: 'Kartsız çekimi yapanın görüntüsü istenebilir; tanığın kanaati yerine görüntü konuşur.',
          next: '$stay',
        }),
        option('RQ_YASAK', 'Yurt dışı çıkış yasağının kaldırılması', {
          effects: [
            ifThen(
              atLeast(2, flag('contra_g1'), flag('contra_g2'), flag('contra_g3'), flag('contra_g5')),
              [
                raise('yasak_kalkti'),
                score('USUL_BILGISI', 40),
                mark(
                  'GOOD',
                  'Adli kontrolün devamı için kuvvetli şüphe zayıfladı (CMK 109, 110); tedbir kaldırıldı.',
                  'USUL_BILGISI',
                ),
              ],
              [
                mark(
                  'NEUTRAL',
                  'Delil durumu henüz değişmediği için adli kontrolün devamına karar verildi (CMK 110).',
                  'USUL_BILGISI',
                ),
              ],
            ),
          ],
          next: '$stay',
        }),
        option('RQ_BERAAT', 'Delil yetersizliğinden sanığın bu celsede, hemen bugün beraatine karar verilmesi', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Eksik deliller toplanmadan ve mütalaa alınmadan hüküm kurulmaz; erken beraat talebi heyeti ikna etmez.',
          responses: B(S`hakim: Müdafi, daha talepleri konuşuyoruz. Hükmü sonra konuşuruz.`),
          next: '$stay',
        }),
        option('RQ_TUTANAK', 'Tanık beyanının tutanaktan çıkarılması', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Tanık beyanı tutanaktan çıkarılmaz; değerlendirmesi hükümde yapılır (CMK 217).',
          responses: B(S`hakim: Tutanak tutanaktır, müdafi. Değerini ben takdir ederim.`),
          next: '$stay',
        }),
        cont('RQ_BITTI', 'Taleplerimiz bu kadar', 'H1_07', { role: 'PRIMARY' }),
      ],
    }),
    court1.stage('H1_07', {
      title: 'Ara karar',
      courtStage: 'DELIL_TARTISMA',
      lines: [
        W(
          any(has('ev_sim_dokum'), flag('dl_bayi'), flag('rq_bayi')),
          S`
            - Hâkim bir süre not aldı. Salon bekledi. Pencerenin dışında bir martı, yanlış şehre gelmiş gibi, kurşuni gökyüzünde bir daire çizdi.
            hakim: Ara karar. Eksik delillerin toplanmasına; SIM değişikliğini yapan bayi personelinin ve Nova Dijital'in adres gösterdiği iş merkezinin yetkilisinin tanık olarak çağrılmasına.
            hakim: Taleplerin cevabı geldiğinde dosyaya konulmasına. Duruşmanın 25 Kasım 2026 saat 10.00'a ertelenmesine.
            ~ İki tanık daha. Bayideki genç ve iş merkezinin müdürü. Kimin ne söyleyeceğini kimse bilmiyor; ben de.
            - Savcı dosyasını kapattı, bana doğru yarım bir baş selamı verdi. İlk celsede vermemişti. Kâtip ara kararı yazarken ekrana bakan Ece, her kelimeyi dudaklarıyla tekrarlıyordu.
          `,
        ),
        O(S`
          - Hâkim bir süre not aldı. Salon bekledi. Pencerenin dışında bir martı, yanlış şehre gelmiş gibi, kurşuni gökyüzünde bir daire çizdi.
          hakim: Ara karar. Eksik delillerin toplanmasına; Nova Dijital'in adres gösterdiği iş merkezinin yetkilisinin tanık olarak çağrılmasına.
          hakim: Taleplerin cevabı geldiğinde dosyaya konulmasına. Duruşmanın 25 Kasım 2026 saat 10.00'a ertelenmesine.
        `),
      ],
      onEnter: [ifThen(any(has('ev_sim_dokum'), flag('dl_bayi'), flag('rq_bayi')), [raise('onur_cagrildi')])],
      choices: [cont('H107_DEVAM', 'Salondan çık', 'H1_08', { role: 'PRIMARY' })],
    }),
    story('H1_08', {
      ...HEAR1,
      title: 'Merdivenler',
      background: 'adliye',
      lines: [
        W(
          flag('yasak_kalkti'),
          S`
            = ADLİYE MERDİVENLERİ · 12.20 @adliye
            - Ece merdivenin başında durdu. "Yurt dışı yasağı kalktı" dedi, sanki başka bir dil konuşuyormuş gibi. "Hiçbir yere gitmeyeceğim. Ama gidebilirim."
            - Ece ağlamadı. Bir yıl boyunca ağlamıştı; bugün, salondan çıkarken, yalnızca derin bir nefes aldı. Bir yüzücünün su üstüne ilk çıkışı gibi.
            - Sevim kızının elini tuttu. Nurettin onların yanından geçerken bir an durdu, bir şey söyleyecek gibi oldu; sonra şemsiyesini açtı ve gitti.
            leyla: Bugün bir kapı araladın. Üç hafta var. Kapıyı kimin açık tuttuğunu bul.
            - Leyla bunu söyleyip merdivenlerden inmeye başladı; iki basamak sonra durdu, dönmeden ekledi: "Ve kimin kapatmaya çalışacağını." Sonra yürüdü.
            - Merdivenin dibinde Gökhan Ateş bir sigara yakmıştı. Beni görünce söndürdü, sonra yeniden yaktı. Bir şey söylemedi; ama başıyla selam verdi.
          `,
        ),
        O(S`
          = ADLİYE MERDİVENLERİ · 12.20 @adliye
          - Ece merdivenin başında durdu. Yağmur dinmemişti. Sevim şemsiyeyi ikisinin üstüne tuttu; ikisine de yetmedi.
          - Ece ağlamadı. Bir yıl boyunca ağlamıştı; bugün, salondan çıkarken, yalnızca derin bir nefes aldı. Bir yüzücünün su üstüne ilk çıkışı gibi.
          - Nurettin onların yanından geçerken bir an durdu, bir şey söyleyecek gibi oldu; sonra şemsiyesini açtı ve gitti.
          leyla: Üç hafta var. Dosyada boşluklar var. Boşluk kimin işine yarıyor, onu bul.
          - Merdivenin dibinde Gökhan Ateş bir sigara yakmıştı. Beni görünce söndürdü. Bir şey söylemedi.
        `),
      ],
      choices: [cont('H108_DEVAM', 'Merdivenleri in', 'H1_09', { role: 'PRIMARY' })],
    }),
    story('H1_09', {
      ...HEAR1,
      title: 'Sigara',
      background: 'sokak_yagmur',
      lines: B(S`
        = ADLİYE ÖNÜ · 12.35 @sokak_yagmur
        - Adliyenin önü şemsiyelerle doluydu; kimse kimsenin yüzünü görmüyordu. Gökhan Ateş merdivenin dibinde, saçağın altında duruyordu. Sigarası ıslanmış, sönmüştü; yine de dudağındaydı.
        - Beni görünce sigarayı paketine geri koydu. Kibrit kutusunu iki parmağının arasında çevirdi, bir şey söylemek ister gibi.
        gokhan: Avukat hanım. Bir dakika. Mahkemede söyleyemediğim bir şey var. Kayıt dışı. Bir kahve içelim mi? Karşıda bir yer var; kimse bizi görmez.
        ~ Tanık. İfadesi bitti ama dosya bitmedi; ikinci celsede yeniden çağrılabilir. "Kayıt dışı" bir avukatın en sevdiği, en tehlikeli iki kelime.
      `),
      choices: [
        option('H109_A', 'Ne varsa savcıya ya da mahkemeye söyleyin.', {
          score: { USUL_BILGISI: 30 },
          good: 'Dinlenmiş ve yeniden çağrılabilecek kolluk tanığıyla kayıt dışı görüşmek, beyanını etkileme şüphesi doğurur; bilgi resmî yoldan, savcılık ya da mahkeme aracılığıyla gelmelidir (TBB Meslek Kuralları).',
          responses: B(S`
            gokhan: Savcıya. Haklısınız. Öyle yaparım.
            - Kibrit kutusunu cebine koydu. Yağmura doğru bir adım attı, sonra döndü.
            gokhan: Bankaya bir yazı daha yazacağım. Bu sefer cihazı soracağım. Sizin için değil. Kendim için.
            ~ Bir polis, bir yıl sonra, kendi raporunun eksik sayfasını yazmaya gidiyor. Ben ona bir kahve ısmarlasaydım, o sayfa benim olurdu; şimdi onun.
          `),
          next: 'ARA_GIRIS_1',
        }),
        option('H109_B', 'Peki, bir kahve. Ama beş dakika.', {
          score: { USUL_BILGISI: -30 },
          bad: 'Dinlenmiş bir tanıkla kayıt dışı görüşmek, söyledikleri ne olursa olsun, ikinci celsede savunmanın aleyhine okunur; bilgi resmî yoldan istenir.',
          responses: B(S`
            - Karşıdaki kahvecinin camı buğuluydu. Gökhan bir şey söyleyecekti; ağzını açtı, sonra kapının açıldığını gördü. İçeri savcılık kaleminden iki memur girdi, bize baktı.
            gokhan: Neyse. Başka zaman. Bu… doğru olmaz.
            - Kahvesini bitirmeden kalktı, parasını masaya bıraktı. Bir şey öğrenmedim. Ama iki memur, bir müdafiyle bir tanığı aynı masada gördü.
          `),
          next: 'ARA_GIRIS_1',
        }),
        option('H109_C', 'Başınla selam ver, hiçbir şey söylemeden yürü.', {
          neutral: 'Konuşmamak doğrudur; ama tanığa bilgisini resmî yoldan iletebileceğini söylemek kapıyı açık tutardı.',
          responses: B(S`
            - Başımla selam verip geçtim. Arkamda kibrit sesi duydum; bu sefer yandı.
          `),
          next: 'ARA_GIRIS_1',
        }),
      ],
    }),
  ],
  discoveryPaths: banka.discoveryPaths,
};
