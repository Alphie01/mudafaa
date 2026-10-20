import {
  all,
  always,
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
import type { CasePart, ChoiceDef } from '../../../tools/content/src/kit/index.js';
import { B, O, S, W } from './dsl.js';
import { HEAR1, court1 } from './shared.js';

// 60-hearing-1: birinci celse. Açılış → sanığın sorgusu (müdafiin soruları) → müştekinin beyanı → Hayri (telkinli soruya
// itiraz + tanık ifadesi) → CD (savcılık delili) → duruşmada delil talepleri (CMK 206) → nitelendirme uyarısı (CMK 226) →
// ara karar ve erteleme.

const wrong = (amount = -150): ChoiceDef['effects'] => [
  dec('cred'),
  dec('pers'),
  inc('wrong'),
  score('SORGULAMA', amount, 'hatali'),
];

const legal = (amount: number) => [score('USUL_BILGISI', amount), inc('legal_hits')];

const H103_GIRIS = `
mubasir: Tanık Hayri Doğan!
Hayri Bey salona girdi. Ceketi ütülüydü, kravatı eski ama düzgündü. Kürsüye geçmeden önce hâkime hafifçe eğildi; eski usul bir selam.
hakim: Kimliğiniz tespit edildi. Sanıkla akrabalığınız yok. Gerçeği söylemenin önemini, gerçeğe aykırı tanıklığın suç olduğunu biliyorsunuz.
hayri: Bilirim Sayın Hâkim. Bildiğimi dosdoğru söyleyeceğime namusum ve vicdanım üzerine yemin ederim.
`;
const H103_SORU = `
savci: Tanık, o akşam müştekinin arkasında duran ve cüzdanı alan genç, şu an sanık sandalyesinde oturan kişiydi, değil mi?
`;
const H109_ORTAK = `
hakim: Duruşma 17 Kasım saat 10.15’e ertelendi.
# adliye | 11.50 — ADLİYE KORİDORU
Koridor yine ıslak şemsiyelerle doluydu. Arda kravatını çıkarıp cebine tıktı. Elleri titriyordu; fark ettiğimi görünce cebine soktu.
arda: Beş yıl mı hocam? O dediği… beş yıl mı?
P: Bir hatırlatma. Bir ihtimal. Her ihtimale bir cevabımız olacak. Üç haftamız var.
`;
const H109_SON = `
Leyla koridorun sonunda paltosunu giyiyordu. Yanından geçerken durdu.
leyla: Bugün tanığa saldırmadın. Bunu hâkim de gördü. Savcı da. Üç hafta sonra o salona aynı kişi olarak gir.
> Üç hafta. Bir kaydın gelmesi, bir şoförün uyuması, bir yaşlı kadının fikrini değiştirmesi için ne kadar kısa. Ya da ne kadar uzun.
`;

export const hearing1: CasePart = {
  config: {
    objectionGrounds: [
      ground('g_kanaat', 'Tanık gözlemini değil kanaatini aktarıyor', 'CMK 59/1, 217'),
      ground('g_duyum', 'Tanık başkasından duyduğunu aktarıyor', 'CMK 210, 217'),
      ground('g_telkin', 'Soru cevabı içeriyor (telkin)', 'CMK 201/1'),
    ],
  },
  court: {
    sessions: [
      courtSession('cs_1', '1. Celse', [
        ['s1_acilis', 'ACILIS', 'H1_00'],
        ['s1_sorgu', 'SANIK_SAVUNMASI', 'H1_01'],
        ['s1_tanik', 'TANIK_DINLEME', 'H1_03'],
        ['s1_delil', 'DELIL_TARTISMA', 'H1_05'],
      ]),
    ],
  },
  nodes: [
    court1.stage('H1_00', {
      title: 'Birinci celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onFirstEnter: [raise('in_court'), meet('hakim'), meet('savci'), meet('katip'), meet('mubasir'), meet('gulten')],
      lines: B(`
# durusma_salonu | 27 EKİM · SALI 10.40 — BURSA 9. ASLİYE CEZA MAHKEMESİ
Koridor ıslak şemsiyelerle doluydu. Duvardaki ekranda dosya numaraları kayıyordu; bizimki iki kez ertelenmiş bir dosyanın arkasındaydı.
Arda kravat takmıştı. Kendi gömleği, Ozan’ın kravatı. Düğümü fazla sıkıydı; parmağıyla gevşetip duruyordu.
mubasir: Arda Çınar! Arda Çınar dosyası, taraflar salona!
Salon küçüktü. Tek hâkim kürsüsü, sağda savcının masası, solda kâtibin ekranı. Dinleyici sıralarında üç kişi.
Ön sırada, kucağında bez bir çanta, gri başörtülü yaşlı bir kadın oturuyordu. Çantayı iki eliyle göğsüne bastırmıştı. Gülten Sarı.
> Yedi ay önce o çantadan bir cüzdan çıktı. Bugün çantayı bırakmıyordu. İnsan kaybettiği şeyden sonra elindekini sıkar.
Dinleyici sıralarının en arkasında, kapının yanında Leyla oturuyordu. Bana bakmıyordu; kürsüye bakıyordu. “Arkandayım” demişti. Tam olarak orada.
hakim: Sanığın kimliği tespit edildi; müdafii hazır. Müşteki hazır. Tanık Hayri Doğan hazır, salon dışına alındı.
hakim: İddianame özetlendi: sanığın 6 Mart akşamı Hat 38 otobüsünde müştekinin cüzdanını aldığı iddiasıyla TCK 141/1 uyarınca cezalandırılması isteniyor.
savci: Sayın Hâkim, dosya basittir. Kamera kaydı sanığı cüzdanı alırken gösteriyor. Tanık sanığı müştekinin arkasında görmüş. Cüzdan ertesi sabah sanığın çantasında.
savci: Sanığın “buldum, teslim edecektim” savunması, on beş saat boyunca kimseye bir şey bildirmemesiyle çelişmektedir. Bu kadar.
> “Dosya basittir.” Savcıların en sevdiği iki kelime. Basit dosyalar yoktur; okunmamış sayfalar vardır.
hakim: Sanık, susma hakkınız var. Söyleyeceklerinizin aleyhinize kullanılabileceğini biliyorsunuz. Anlatmak ister misiniz?
arda: İsterim, Sayın Hâkim.
`),
      choices: [cont('H100_DEVAM', 'Arda anlatsın', 'H1_01')],
    }),

    {
      id: 'H1_01',
      type: 'CHOICE',
      ...court1.base,
      title: 'Sanığın sorgusu',
      background: 'durusma_salonu',
      prompt: { speaker: 'hakim', text: 'Müdafi, sanığa sorularınız varsa doğrudan sorabilirsiniz.' },
      lines: B(`
arda: 6 Mart akşamı sahaftan çıktım, Çarşı’dan Hat 38’e bindim. Kalabalıktı, ayaktaydım. Altıparmak’tan sonra boşalan bir koltuğa oturdum.
arda: Ayağım bir şeye takıldı. Eğildim, bir cüzdan. Açtım; kimlik vardı, para yoktu, kart yoktu. Teslim etmek için yanımda tuttum.
arda: Sabah karakola gidecektim. Gidemeden polis geldi. Ben o cüzdanı çalmadım, Sayın Hâkim. Buldum.
savci: Sayın Hâkim, sanık on beş saat boyunca kimseye bildirmemiştir. “Bulmak” bu sürede “sahiplenmeye” dönüşür.
> Savcı Tolga Uçar. Kırklı yaşlar, gözlüklerinin üstünden bakan biri. Yorgun ama dikkatli. Yorgun dikkatliler en tehlikelisidir.
Soru seç; sorulmayan soru tutanağa geçmez. Bitince “Sorularım bu kadar” de.
`),
      choices: [
        option('H101_NIYET', '“O gece cüzdanın sahibine ya da yetkililere ulaşmak için ne yaptın?”', {
          visibleWhen: any(flag('fact_153_anlatti'), flag('fact_sofor'), flag('fact_mesaj_anlatti')),
          next: '$stay',
          effects: [
            score('SAVUNMA_STRATEJISI', 80),
            inc('pers'),
            raise('arda_niyet_mahkemede'),
            ifThen(any(has('clue_fb_mesaj'), flag('fact_mesaj_anlatti')), [raise('arda_mesaj_mahkemede')]),
          ],
          good: 'Açık uçlu soru sanığın kendi sözleriyle teslim girişimlerini tutanağa geçirtti (CMK 201/1). İddianın “on beş saat bildirmedi” savına doğrudan cevap.',
          category: 'SAVUNMA_STRATEJISI',
          responses: [
            W(
              all(flag('fact_153_anlatti'), flag('fact_sofor')),
              `
arda: Önce yanımdakine sordum, “sizin mi” diye. Görükle’de inerken şoföre uzattım; “yarın kayıp eşyaya götür” dedi, almadı.
arda: Eve yürürken belediyenin 153 hattını aradım. Bir abla “yarın terminale götürün” dedi. Gece kimlikteki adla Facebook’ta arayıp yazdım. Cevap gelmedi.
savci: Bunların hiçbiri kolluk ifadesinde yok.
arda: Söyledim. Yazmadılar.
Hâkim kâtibe döndü, bir şey söyledi. Kâtibin parmakları klavyede hızlandı.
`,
            ),
            W(
              flag('fact_153_anlatti'),
              `
arda: Eve yürürken belediyenin 153 hattını aradım. Bir abla “yarın terminaldeki kayıp eşya bürosuna götürün” dedi. Gece de Facebook’tan sahibine yazdım.
savci: Bunlar kolluk ifadesinde yok.
arda: Söyledim. Yazmadılar.
`,
            ),
            O(`
arda: Şoföre uzattım, almadı. Gece Facebook’tan kimlikteki ada yazdım. Cevap gelmedi. Sabah dokuzda karakola gidecektim.
savci: Bunlar kolluk ifadesinde yok.
arda: Söyledim. Yazmadılar.
`),
          ],
        }),
        option('H101_NEDEN', '“O gece neden karakola gitmedin?”', {
          visibleWhen: flag('fact_polis_neden'),
          next: '$stay',
          effects: [score('SAVUNMA_STRATEJISI', 60), inc('pers'), raise('arda_utanc_mahkemede')],
          good: 'Sanığın açıklaması “neden bildirmedi” sorusuna insani bir cevap verdi. Hâkim, sanığın tutum ve davranışını doğrudan dinledi.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
Arda bir an bana baktı. Ona “istersen anlat” demiştim. İstemezse de anlarım demiştim.
arda: Lisedeyken bir gece yapmadığım bir şey için nezarette kaldım. Annem sabah karakolun önünde ağlıyordu. O günden beri… gidemiyorum.
arda.uzgun: O gece karakolun kapısına kadar gittim. Geri döndüm. Sabaha not yazdım. Korktum, Sayın Hâkim. Utanıyorum. Ama çalmadım.
Salonda bir sessizlik oldu. Ön sırada Gülten Hanım’ın elleri çantanın üstünde bir an gevşedi.
`),
        }),
        option('H101_ACMADIN', '“Cüzdanı açıp karıştırmadın, değil mi?”', {
          next: '$stay',
          effects: [dec('cred'), dec('pers'), score('USUL_BILGISI', -50, 'hatali')],
          bad: 'Cevabı içinde taşıyan, telkinli bir soru; üstelik CD’de cüzdanın açıldığı görülüyor. Savcının itirazı yerinde ve müvekkil yalancı gibi görünme riskine girdi.',
          category: 'USUL_BILGISI',
          responses: B(`
savci: İtiraz! Müdafi cevabı sanığın ağzına veriyor. Kendi kayıtlarında da sanık cüzdanı açıyor.
hakim: İtiraz yerinde. Müdafi, sorunuzu açık uçlu sorun.
arda.saskin: Açtım ama… kimliğe baktım sadece. Hocam, açmadım demedim ki.
> Ağzına bir yalan koymaya çalıştım. Kendisi tükürdü. Doğru olan oydu; ben değil.
`),
        }),
        option('H101_PISMAN', '“Pişman mısın?”', {
          next: '$stay',
          effects: [dec('pers'), raise('pisman_soruldu')],
          bad: 'Belirsiz bir “pişmanlık” sorusu, inkâr eden sanığa ikrar gölgesi düşürür. Savcı bunu mütalaada “sanık da pişmanlığını dile getirdi” diye kullanabilir.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
arda: Pişmanım… Yani, sabah erken gitmediğime pişmanım. Şoföre ısrar etmediğime.
savci: Not alınsın Sayın Hâkim: sanık pişmanlığını beyan etti.
P: Sanık hangi konuda pişman olduğunu açıkça söyledi; tutanağa öyle geçsin.
hakim: Tutanağa sanığın kendi cümlesi aynen geçirilsin.
`),
        }),
        cont('H101_BITIR', 'Sorularım bu kadar', 'H1_01S1'),
      ],
    },

    {
      id: 'H1_01S1',
      type: 'CHOICE',
      ...court1.base,
      title: 'Savcının soruları',
      background: 'durusma_salonu',
      prompt: { speaker: 'savci', text: 'Sanık, kira borcunuz var mı? Kaç aylık?' },
      lines: B(`
hakim: Sayın Savcı, sorularınız?
Savcı Tolga Uçar gözlüğünü çıkardı, camını kravatının ucuyla sildi, yeniden taktı. Acele etmeyen bir adamın acele etmeyen hareketleri.
> Savcının soruları müvekkile sorulur ama müdafie atılır. Hangisine itiraz edeceğini, hangisini müvekkilin karşılayacağını seçmek gerekir.
`),
      choices: [
        option('H101S1_CEVAP', 'Arda cevap versin', {
          next: 'H1_01S1B',
          effects: [ifThen(any(flag('fact_kira_konustu'), flag('fact_zehra_kira'), flag('fact_staj')), [inc('pers')])],
          neutral:
            'Güdüye dair soru meşrudur; ilgisiz değildir. Müvekkilin dürüst cevabı, hazırlıklıysa savcının elindeki “motivi” zayıflatır.',
          responses: [
            W(
              any(flag('fact_kira_konustu'), flag('fact_zehra_kira'), flag('fact_staj')),
              `
arda: Var. İki aylık. Ablam yardım ediyor, sahaftan harçlık alıyorum. O gün kira payımı çektim; çantadaki zarf o.
arda: Borcum var, Sayın Savcı. Ama borcumu bir yaşlı kadının cüzdanıyla ödemem. O cüzdanda para da yoktu zaten.
savci: Bunu ben değerlendireceğim.
> Arda bu soruya hazırdı. Kendi cümlesiyle hazırdı. Benim ona öğrettiğim bir cümle değildi bu; sahafta bana söylediğiydi.
`,
            ),
            O(`
arda.saskin: Kira… Var. İki ay. Ama ben… Bunun ne ilgisi var?
savci: İlgisini mahkeme değerlendirir. Teşekkür ederim.
> Arda bocaladı. Bocalamak, bir hâkimin gözünde bazen yalan söylemekten kötü görünür. Bu soruyu onunla önceden konuşmalıydım.
`),
          ],
        }),
        option('H101S1_ITIRAZ', 'İtiraz: soru davayla ilgisiz', {
          next: 'H1_01S1B',
          effects: [dec('cred'), score('USUL_BILGISI', -50, 'hatali')],
          bad: 'Sanığın ekonomik durumu güdü bakımından iddiayla ilgilidir; soru yöneltilebilir (CMK 201/1). Dayanaksız itiraz, savcının sorusunu daha önemli gösterdi.',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Soru güdüyle ilgili, müdafi. Reddedildi. Sanık, cevap verin.
arda: Var. İki ay.
> İtirazım soruyu küçültmek yerine büyüttü. Salondaki herkes artık “kira borcu” kelimesini hatırlayacaktı.
`),
        }),
      ],
    },
    {
      id: 'H1_01S1B',
      type: 'CHOICE',
      ...court1.base,
      title: 'Savcının soruları',
      background: 'durusma_salonu',
      prompt: {
        speaker: 'savci',
        text: 'Çantanızdaki zarftan 600 TL çıktı. Müştekinin cüzdanında 1.200 TL vardı; tam yarısı. Bu para nereden geldi?',
      },
      lines: B(`
Savcı el koyma tutanağının fotokopisini kaldırdı, ikinci satırın altını kalemiyle çizdi. “Zarf içinde 600 TL.”
> Savcının hikâyesinde bu satır bir köprü: bin iki yüzün yarısı Arda’nın çantasında, yarısı kartlarla birlikte bir ortakta.
`),
      choices: [
        option('H101S1B_CEVAP', 'Arda cevap versin', {
          next: 'H1_01S2',
          neutral:
            'Paranın kaynağına dair soru meşrudur. Sanığın kendi açıklaması değerlidir; ama bir kâğıtla desteklenmezse savcının köprüsü ayakta kalır.',
          responses: [
            W(
              flag('fact_zarf'),
              `
arda: Bursumdan, Sayın Savcı. O gün sahaftan çıkınca Çarşı’daki ATM’den çektim. Kira payım. Zarfın üstüne kendi adımı yazdım.
savci: Bunu gösteren bir belge?
arda: Fişi… bir kitabın arasına koymuştum. Bilmiyorum, şimdi nerede.
> Doğru cevap, eksik kâğıt. Savcı başını salladı; inanmadığını değil, beklediğini gösteren bir baş sallayışı.
`,
            ),
            O(`
arda.saskin: Benim param o. Benim. Bankadan çektim.
savci: Ne zaman, hangi bankadan?
arda: O gün… akşamüstü. Hatırlamıyorum tam.
> “Hatırlamıyorum tam.” Bir hâkimin defterine düşen en ağır üç kelime. Bu soruyu onunla önceden konuşmalıydım.
`),
          ],
        }),
        option('H101S1B_FIS', 'Arda anlatsın; ardından ATM fişini ve zarfı göster', {
          visibleWhen: any(has('clue_atm_fisi'), has('ded_zarf')),
          next: 'H1_01S2',
          effects: [
            ifThen(
              has('ded_zarf'),
              [score('SORGULAMA', 150), inc('pers'), raise('zarf_mahkemede')],
              [score('SORGULAMA', 50)],
            ),
          ],
          responses: [
            W(
              has('ded_zarf'),
              `
arda: Bursumdan. Sahaftan çıkınca Çarşı’daki ATM’den çektim, zarfa koydum, üstüne “kira” yazdım.
P: Sayın Hâkim, sanığın masa çekmecesindeki ATM fişini sunuyoruz: 6 Mart, 17.52, Çarşı şubesi, 600 TL. Kartın son dört hanesi sanığın burs hesabının.
P: Emanetteki zarf bantlı bir banka zarfı; üstünde sanığın el yazısıyla “ARDA – kira”. Cüzdan çalınmadan kırk dakika önce çekilmiş bir para, cüzdandan çıkmış olamaz.
Hâkim fişi aldı, saate baktı, tutanağın fotokopisiyle yan yana koydu. Kâtibe döndü: “Fişin bir örneği dosyaya.”
savci: Paranın kaynağı yönünden diyeceğim yok, Sayın Hâkim.
> Köprünün bir ayağı çöktü. Savcı bunu bir cümleyle kabul etti. İyi savcılar kaybettikleri yerde uzun konuşmaz.
`,
            ),
            O(`
arda: Bursumdan. ATM’den çektim.
P: Sayın Hâkim, sanığın çekmecesinde bulunan ATM fişini sunuyoruz: 6 Mart, 17.52, 600 TL.
savci: Fiş bir para çekildiğini gösterir. Zarftaki paranın o para olduğunu göstermez.
> Fişi zarfla birlikte okumamıştım. Elimde iki ayrı kâğıt vardı; savcı aralarındaki boşluğa bir cümle sığdırdı.
`),
          ],
        }),
        option('H101S1B_ITIRAZ', 'İtiraz: paranın kaynağı davanın konusu değil', {
          next: 'H1_01S2',
          effects: [dec('cred'), score('USUL_BILGISI', -50, 'hatali')],
          bad: 'Çantada bulunan paranın kaynağı, iddianın “cüzdandan alındı” savıyla doğrudan ilgilidir; soru yöneltilebilir (CMK 201/1). Dayanaksız itiraz, savcının köprüsünü daha görünür yaptı.',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Para, iddianın parçası, müdafi. Reddedildi. Sanık, cevap verin.
arda: Benim param. Bursumdan çektim.
`),
        }),
      ],
    },
    {
      id: 'H1_01S2',
      type: 'CHOICE',
      ...court1.base,
      title: 'Savcının soruları',
      background: 'durusma_salonu',
      prompt: { speaker: 'savci', text: 'Cüzdanı neden elinizde tutmadınız da hemen çantanıza koydunuz?' },
      choices: [
        option('H101S2_CEVAP', 'Arda cevap versin', {
          next: 'H1_01S3',
          neutral: 'Açık bir soru; müvekkilin kendi açıklaması en iyi cevaptır.',
          responses: B(`
arda: Islanmasın diye. Kimlik vardı, bir fotoğraf vardı. Otobüs ıslaktı, herkes ıslaktı. Elimde tutsam kime gösterecektim?
arda: Yanımdakine sordum ama. “Sizin mi” diye. O başını salladı.
savci: Bu kayıtta yok.
arda: Kayıtta yok, ama ben sordum.
> “Kayıtta yok.” Savcı farkında olmadan en doğru cümleyi kurdu. Kayıtta olmayan çok şey vardı.
`),
        }),
        option('H101S2_ITIRAZ', 'İtiraz: sanık bu soruyu zaten cevapladı', {
          next: 'H1_01S3',
          effects: [score('USUL_BILGISI', -20)],
          neutral: 'Sanık bu ayrıntıyı henüz anlatmamıştı; itiraz zayıf. Hâkim soruya izin verdi.',
          responses: B(`
hakim: Sanık bu ayrıntıyı anlatmadı, müdafi. Devam edin.
arda: Islanmasın diye. Kimlik vardı, fotoğraf vardı.
`),
        }),
      ],
    },
    {
      id: 'H1_01S3',
      type: 'CHOICE',
      ...court1.base,
      title: 'Savcının soruları',
      background: 'durusma_salonu',
      prompt: {
        speaker: 'savci',
        text: 'Sabah dokuzda karakola gidecektiniz. Polis sekiz on beşte geldi. Yani dokuzu bekleyerek cüzdanı saklamaya devam ettiğinizi kabul ediyorsunuz, değil mi?',
      },
      choices: [
        option('H101S3_ITIRAZ', 'İtiraz: soru bir sonucu sanığa kabul ettirmeye çalışıyor', {
          next: 'H1_02',
          effects: [...legal(80), inc('pers')],
          good: 'Soru bir değerlendirmeyi (“saklamaya devam ettiğinizi kabul ediyorsunuz”) sanığın ağzına veriyordu. Soruya itiraz edildiğinde hâkim sorunun yöneltilip yöneltilmeyeceğine karar verir (CMK 201/1).',
          category: 'USUL_BILGISI',
          responses: [
            W(
              flag('fact_buro_dokuz'),
              `
P: İtiraz ediyorum Sayın Hâkim. Soru bir sonucu sanığa kabul ettirmeye çalışıyor. Ayrıca kayıp eşya bürosu cumartesi sabahı dokuzda açılıyor.
hakim: İtiraz yerinde. Sayın Savcı, soruyu sade sorun.
savci: Neden dokuz?
arda: Belediye “yarın terminale götürün” dedi. Terminaldeki büro dokuzda açılıyor. Önce karakola uğrayayım, sonra büroya dedim.
`,
            ),
            O(`
P: İtiraz ediyorum Sayın Hâkim. Soru bir sonucu sanığa kabul ettirmeye çalışıyor.
hakim: İtiraz yerinde. Sayın Savcı, soruyu sade sorun.
savci: Neden dokuz?
arda: Sabah erken… Bilmiyorum. Dokuz iyi bir saat gibi geldi.
`),
          ],
        }),
        option('H101S3_TEKRAR', 'İtiraz: sanık dokuz saatini ilk anlatımında açıkladı', {
          next: 'H1_02',
          effects: [dec('pers'), score('USUL_BILGISI', -30, 'hatali')],
          bad: 'Sanık “dokuzda gidecektim” demişti ama nedenini açıklamamıştı; “cevaplandı” itirazı tutmadı. Sorunun asıl kusuru, bir değerlendirmeyi (“saklamaya devam ettiğinizi kabul ediyorsunuz”) sanığa kabul ettirmeye çalışmasıydı (CMK 201/1).',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Sanık saati söyledi, nedenini söylemedi, müdafi. Reddedildi. Sanık, cevap verin.
arda.saskin: Saklamak değil… Dokuzda gidecektim. Kabul etmiyorum.
savci: Sorum bu kadar.
`),
        }),
        option('H101S3_CEVAP', 'Arda cevap versin; söyleyecekleri var', {
          next: 'H1_02',
          effects: [dec('pers')],
          neutral:
            'Tartışmacı soru cevaplandı; sanığın “hayır” demesi bile savcının çerçevesini tutanağa geçirdi. Soruya itiraz edilebilirdi (CMK 201/1).',
          responses: B(`
arda.saskin: Saklamak değil… Ben… Hayır. Kabul etmiyorum. Dokuzda gidecektim.
savci: Sorum bu kadar.
> Savcının cümlesi tutanağa geçti; Arda’nın “hayır”ı da. Hâkimin aklında hangisi kalacak, bilmiyorum.
`),
        }),
      ],
    },
    {
      id: 'H1_02',
      type: 'CHOICE',
      ...court1.base,
      title: 'Müştekinin beyanı',
      background: 'durusma_salonu',
      prompt: { speaker: 'hakim', text: 'Müdafi, müştekiye sorunuz var mı?' },
      lines: B(`
hakim: Müşteki Gülten Sarı. Olayı anlatın lütfen.
Gülten Hanım ayağa kalktı. Çantasını bırakmadı. Sesi ilk cümlede titredi, ikincide sertleşti.
gulten: Hastaneden dönüyordum, Heykel’den bindim. Kalabalıktı. Çantam kolumdaydı. Eve gelince telefona mesajlar düştü: kartımdan para çekilmiş.
gulten: Bin iki yüz lira vardı. İlaç parasıydı. Kartlarım… Bir de İsmail’imin fotoğrafı. Rahmetli eşim. Kırk yıllık fotoğraf.
gulten.kizgin: Paranın da kartın da helal olsun dedim karakolda. Fotoğrafımı geri isterim dedim. Bir de… bu çocuk cezasını çeksin.
gulten.uzgun: Uzlaşma için çağırdılar, gitmedim. Ben terziyim. Söküğü olan işi düzeltirim. Ama sökülen bir şeyi kimse benim yerime dikmez.
> “Bu çocuk cezasını çeksin.” Sözcükler Arda’ya değil, yedi ay önceki o akşama söyleniyordu. Ama Arda’nın sırtına çarptı.
Arda başını kaldırıp Gülten Hanım’a baktı. Bir şey söyleyecekti; ağzını açtı, kapattı. Sanığın müştekiye doğrudan konuşma hakkı yoktu. Biliyordu. Sahafta okumuştu.
`),
      choices: [
        option('H102_FOTO', '“Cüzdanınızı geri aldığınızda fotoğraf yerinde miydi?”', {
          next: '$stay',
          effects: [inc('pers'), raise('foto_yerinde'), score('SORGULAMA', 60)],
          good: 'Tek, kısa ve saygılı bir soru: fotoğrafın yerinde ve sağlam olması, cüzdanın içeriğine sanığın dokunmadığını destekledi. Müştekiyi karşına almadan.',
          category: 'SORGULAMA',
          responses: B(`
gulten: Yerindeydi.
Bir an durdu. Çantanın fermuarını açtı, kahverengi cüzdanı çıkardı, içinden sararmış fotoğrafı aldı ve baktı.
gulten.uzgun: Buruşmamıştı bile. Kimliğimin arkasına sıkıştırmışım yıllar önce. Öyle duruyordu. Kimse… kimse çıkarmamış.
Fotoğrafı yerine koydu. Arda’ya baktı. Yedi aydır ilk kez.
`),
        }),
        option('H102_PARA', '“Paranın sanıkta bulunduğunu size kim söyledi?”', {
          next: '$stay',
          effects: [raise('gulten_polis_dedi'), score('SORGULAMA', 30)],
          neutral:
            'Müştekinin bilgisinin kaynağını sormak meşru; ama müşteki kendi gördüğünü değil polisin söylediğini aktarıyor. Bu konuyu el koyma tutanağıyla çözmek daha güçlüdür.',
          responses: B(`
gulten: Polis söyledi. Çantasında para çıktı dediler. Altı yüz lira mı, ne.
gulten: Benimki bin iki yüzdü. Gerisini harcamış dediler.
`),
        }),
        option('H102_CANTA', '“Çantanız açık mıydı? Dikkatsiz davranmış olabilir misiniz?”', {
          next: 'H1_03',
          effects: [dec('pers'), dec('cred'), score('SORGULAMA', -60, 'hatali')],
          bad: 'Müştekiyi suçlayan bir soru hem gereksiz hem zararlı: davanın konusu müştekinin dikkatsizliği değil, sanığın eylemi. Hâkimin gözünde savunma güven kaybetti.',
          category: 'SORGULAMA',
          responses: B(`
gulten.kizgin: Ne demek dikkatsiz? Kırk yıl terzilik yaptım, iğneyi bile yere düşürmem!
hakim: Müdafi, soru davayla ilgili değil. Geçiyoruz.
> Ön sıradaki yaşlı kadın çantasını yeniden göğsüne bastırdı. Bu kez benden korumak için.
`),
        }),
        cont('H102_BITIR', 'Sorum yok', 'H1_03'),
      ],
    },

    court1.objection('H1_03', {
      title: 'Tanık Hayri Doğan',
      courtStage: 'TANIK_DINLEME',
      witness: 'hayri',
      witnessLabel: 'TANIK · HAYRİ DOĞAN',
      onFirstEnter: [meet('hayri'), ifThen(flag('hayri_kizgin'), [dec('pers')])],
      lines: [
        W(
          flag('hayri_kizgin'),
          H103_GIRIS +
            `
hayri.kizgin: Bir de şunu söyleyeyim Sayın Hâkim: bu avukat hanım geçen hafta kahveye geldi, bana “yanılmış olabilirsiniz” dedi. Ben yanılmam.
hakim: Not alındı. Müdafi, tanıkla duruşma dışında temasınızın sınırlarını bildiğinizi varsayıyorum.
> Başımı eğdim. Söyleyecek bir şey yoktu. Hayri Bey şimdi kendi gördüğünü değil, kendi onurunu savunacaktı.
` +
            H103_SORU,
        ),
        O(H103_GIRIS + H103_SORU),
      ],
      next: 'H1_04',
      options: [
        option('H103_A', 'İtiraz: soru cevabı içinde taşıyor; tanık kendisi anlatsın', {
          effects: [...legal(100), inc('pers')],
          good: 'Savcının sorusu cevabı içeriyordu. Soruya itiraz edildiğinde hâkim sorunun sorulup sorulmayacağına karar verir (CMK 201/1); telkinli soru tanığın kendi gözlemini kirletir.',
          category: 'USUL_BILGISI',
          responses: B(`
P: İtiraz ediyorum Sayın Hâkim. Soru cevabı içeriyor. Tanık ne gördüğünü kendi cümlesiyle anlatmalı.
hakim: İtiraz yerinde. Sayın Savcı, soruyu açık sorun.
savci: Tanık, otobüste ne gördünüz?
`),
        }),
        option('H103_B', 'İtiraz etme; cevabı çapraz sorguda sarsarsın', {
          effects: [dec('pers')],
          neutral:
            'Telkinli soru cevaplandı; tanığın “evet”i artık onun gözlemi değil, savcının cümlesi oldu. Çapraz sorgu sonradan sarsabilir, ama böyle bir soruya o anda itiraz edilebilirdi (CMK 201/1).',
          responses: B(`
hayri: Evet. O çocuktu.
> Bir “evet” ile tanık, savcının cümlesini kendi cümlesi yaptı. Sustum. Susmak bazen en pahalı cevaptır.
`),
        }),
        option('H103_C', 'İtiraz: kolluk beyanı dosyada; tanığı yeniden dinlemeye gerek yok', {
          effects: [dec('cred'), score('USUL_BILGISI', -50, 'hatali')],
          bad: 'Doğrudan doğruyalık ilkesi gereği tanık duruşmada dinlenir; kolluk beyanının okunmasıyla yetinilemez (CMK 210). Üstelik savunmanın en çok ihtiyaç duyduğu şey, bu tanığı kürsüde soru sorarak dinlemekti.',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Tanık duruşmada dinlenir, müdafi. Kolluk beyanı onun yerini tutmaz. Reddedildi. Sayın Savcı, devam edin.
> Kendi elimle kendi çapraz sorgumu engellemeye çalıştım. Hâkim beni benden korudu.
`),
        }),
        option('H103_D', 'İtiraz: tanık sanığı karakolda gördü, tarafsız değil', {
          effects: [dec('cred'), dec('pers'), score('USUL_BILGISI', -50, 'hatali')],
          bad: 'Tanığın sanıkla akrabalığı ya da husumeti yoktur; karakolda görüntü gösterilmesi tanığı tanıklıktan yasaklamaz. Bu, dinlendikten sonra teşhisin değerine dair çapraz sorguda ve delillerin takdirinde (CMK 217) tartışılır.',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Tanığın neyi nasıl gördüğünü dinledikten sonra değerlendiririz, müdafi. Reddedildi.
> Doğru soruyu yanlış anda, yanlış kılıfla sordum. Karakoldaki görüntüyü çapraz sorguya saklamalıydım.
`),
        }),
      ],
    }),

    court1.testimony('H1_04', {
      title: 'Hayri Doğan · çapraz sorgu',
      courtStage: 'TANIK_DINLEME',
      witness: 'hayri',
      witnessLabel: 'TANIK · HAYRİ DOĞAN',
      say: S(`
hakim: Tanık ifadesini kesintisiz verdi. Müdafi, sorularınız?
Bir ifadeyi BASTIR: tanık ayrıntı verir, yeni bir satır açılabilir. Çelişkiyi bulunca DELİL SUN. Kanaat ya da duyumsa İTİRAZ et.
`),
      rulesText:
        'Önce bastır, sonra sun. Yanlış delil güvenilirliği ve skoru düşürür. Dürüst tanığa saldırma; sınırını göster.',
      objectionGrounds: ['g_kanaat', 'g_duyum'],
      statements: [
        statement('HS1', 1, [
          'Dokuz numarada, arkaya bakan koltukta oturuyordum. Orta kapı tam karşımdaydı; ',
          hl('her şeyi gördüm', any(flag('press_hs1'), has('ded_hayri_gormedi'))),
          '.',
        ]),
        statement(
          'HS1B',
          2,
          [hl('Gazetemi okuyordum', always), ' tabii. Her akşam okurum. Ama başımı kaldırınca gördüm.'],
          flag('press_hs1'),
        ),
        statement('HS2', 3, [
          'Teyzenin hemen arkasında ',
          hl('gri kapüşonlu bir genç', any(flag('press_hs2'), has('clue_gri_kapuson'))),
          ' duruyordu. Sıkışık.',
        ]),
        statement(
          'HS2B',
          4,
          ['Yüzünü o an görmedim, sırtı bana dönüktü. Ama ', hl('o çocuktu, eminim', always), '.'],
          flag('press_hs2'),
        ),
        statement('HS3', 5, [
          hl('Eli teyzenin çantasının hizasındaydı', flag('press_hs3')),
          '. Kalabalıkta öyle durulmaz.',
        ]),
        statement(
          'HS3B',
          6,
          ['Polis de söyledi; ', hl('kamerada görmüşler', always), ', çantadan almış.'],
          flag('press_hs3'),
        ),
        statement('HS4', 7, [
          'Sonra boşalan koltuğa oturdu ve ',
          hl('cüzdanı çantasına koydu', any(flag('press_hs4'), has('ded_buldu'))),
          '.',
        ]),
      ],
      rules: [
        pressRule('PR_HS1', 'HS1', {
          effects: [score('SORGULAMA', 25), raise('press_hs1')],
          responses: B(`
P: Başınızı kaldırmadan önce ne yapıyordunuz, Hayri Bey?
hayri: Gazetemi okuyordum. Her akşam okurum, otobüste de okurum.
`),
        }),
        presentRule('PS_HS1B', 'HS1B', ['ded_hayri_gormedi'], {
          effects: [
            score('SORGULAMA', 300),
            inc('pers', 2),
            raise('contra_h1'),
            mark(
              'GOOD',
              'Tanığın görme koşulları ortaya kondu: miyop, gözlüksüz okuyor, başını kaldırınca üç metre öteye bakıyor. Tanık dürüst; ama teşhisi zayıf.',
              'SORGULAMA',
            ),
          ],
          responses: B(`
P: Hayri Bey, geçen hafta kahvede bana miyop olduğunuzu, yakını gözlüksüz gördüğünüzü söylediniz. Gazeteyi gözlüksüz okursunuz.
P: O akşam da gözlüksüz okuyordunuz. Başınızı kaldırdığınızda gözlüğünüz alnınızdaydı. Orta kapı üç metre ötede. Ne kadar net görüyordunuz?
Hayri Bey elini alnına götürdü. Gözlüğü orada değildi; burnundaydı. Yine de dokundu.
hayri.saskin: Ben… gözlüğü takmadım tabii. Okurken takmam. Başımı kaldırdım, gri bir şey… bir kapüşon. Yüzünü… yüzünü görmedim.
hayri.uzgun: Karakolda CD’yi gösterdiler. “Bu mu” dediler. Kapüşon griydi. Ben de “bu” dedim.
Savcı kalemini masaya bıraktı. Hâkim tanığa uzun uzun baktı ve kâtibe bir şey yazdırdı.
hakim: Tanık, karakolda size kaç kişinin görüntüsü gösterildi?
hayri: Bir. Bir tane, Sayın Hâkim. Bu çocuğunki.
> Hâkimin kendi sorusu. Bir hâkim soru sormaya başladıysa, dinlemeye de başlamıştır.
`),
        }),
        presentRule('PS_HS1B_IFADE', 'HS1B', ['ev_hayri_ifade'], {
          effects: [score('SORGULAMA', 100), inc('pers'), raise('contra_h1_kismi')],
          responses: B(`
P: Kolluk beyanınızda da “gazetemi okurken başımı kaldırdım” diyorsunuz. Yani olayın başını görmediniz.
hayri: Görmedim tabii, okuyordum. Başımı kaldırınca gördüm ne gördüysem.
> Kısmi bir geri adım. Ne kadar net gördüğünü hâlâ sormadım.
`),
        }),
        presentRule('PS_HS1_ERKEN', 'HS1', ['ded_hayri_gormedi', 'ev_hayri_ifade'], {
          maxUses: 3,
          responses: B(`
> Tanık “her şeyi gördüm” diyor. Neye bakarken başını kaldırdığını önce ona söyletmeliyim. Kâğıdı indirdim.
`),
        }),
        pressRule('PR_HS2', 'HS2', {
          effects: [score('SORGULAMA', 25), raise('press_hs2')],
          responses: B(`
P: Bu genci önden mi gördünüz, arkadan mı? Yüzünü gördünüz mü?
hayri: Sırtı bana dönüktü. Ama gri kapüşon… o çocuktu, eminim.
`),
        }),
        objectRule('OB_HS2B', 'HS2B', 'g_kanaat', {
          effects: [
            score('SORGULAMA', 50),
            inc('pers'),
            raise('ob_kanaat'),
            mark(
              'GOOD',
              'Tanık yüzü görmediğini söyleyip “eminim” diyor: bu bir gözlem değil, kanaat. Hâkim tanığı kendi gözlemiyle sınırladı.',
              'SORGULAMA',
            ),
          ],
          responses: B(`
P: İtiraz ediyorum Sayın Hâkim. Tanık yüzü görmediğini söylüyor; “eminim” bir gözlem değil, kanaat.
hakim: Tanık, yalnızca gördüğünüzü anlatın. “Eminim” kısmı tutanağa tanığın kanaati olarak geçsin.
`),
        }),
        pressRule('PR_HS3', 'HS3', {
          effects: [score('SORGULAMA', 25), raise('press_hs3')],
          responses: B(`
P: Elinin çantanın içinde olduğunu gördünüz mü, yoksa hizasında mı?
hayri: Hizasında. Kalabalıktı, herkesin eli bir yerdeydi. Ama polis de söyledi zaten, kamerada görmüşler.
`),
        }),
        objectRule('OB_HS3B', 'HS3B', 'g_duyum', {
          effects: [
            score('SORGULAMA', 50),
            inc('pers'),
            raise('ob_duyum'),
            mark(
              'GOOD',
              'Tanığın “polis söyledi, kamerada görmüşler” cümlesi kendi gözlemi değil, duyum. Hâkim bu kısmı tanığın gözlemi saymadı.',
              'SORGULAMA',
            ),
          ],
          responses: B(`
P: İtiraz ediyorum. Tanık polisten duyduğunu aktarıyor. Kayıt zaten dosyada; tanığın ağzından ikinci kez delil olamaz.
hakim: Yerinde. Tanığın polisten duyduğu kısım gözlem olarak değerlendirilmez. Tanık, kendi gördüğünüz.
`),
        }),
        pressRule('PR_HS4', 'HS4', {
          effects: [score('SORGULAMA', 25), raise('press_hs4')],
          responses: B(`
P: Cüzdanı nereden aldığını gördünüz mü? Kadının çantasından mı, başka bir yerden mi?
hayri: Aldı işte… Eğildi, aldı. Çantasına koydu. Ben indim sonra, Beşevler’de.
`),
        }),
        presentRule('PS_HS4', 'HS4', ['ded_buldu'], {
          effects: [
            score('SORGULAMA', 300),
            inc('pers', 2),
            raise('contra_h4'),
            mark(
              'GOOD',
              'Tanığın da gördüğü “eğilip alma” anı, kayıtta koltuk altındaki boşluktan bir bulma olarak görünüyor. Kayıt bir hırsızlık değil, bir bulma gösteriyor.',
              'SORGULAMA',
            ),
          ],
          responses: B(`
P: “Eğildi, aldı.” Doğru. Savcılığın kendi kaydında 18.42.05’te sanık oturuyor, ayağı bir şeye takılıyor, eğiliyor ve koltuğun altından alıyor.
P: O koltuğun altında, ısıtıcı kapağının yanında bir avuç genişliğinde bir boşluk var. Oturan biri göremez. Ayağı takılınca anlar.
P: Kadının çantasından değil, yerden. Bunu siz de gördünüz, değil mi Hayri Bey? Eğildiğini.
hayri.saskin: Eğildi… evet. Yerden aldı. Ben… çantadan aldı sanıyordum. Ama eğildi.
`),
        }),
        presentRule('PS_HS4_KLIP', 'HS4', ['ev_klip'], {
          enabledWhen: has('clue_ilk_kare'),
          effects: [
            score('SORGULAMA', 150),
            inc('pers'),
            raise('contra_h4'),
            mark(
              'GOOD',
              'Savcılığın kendi delili, tanığın “çantasına koydu” anlatımının öncesini gösterdi: sanık cüzdanı yerden alıyor.',
              'SORGULAMA',
            ),
          ],
          responses: B(`
P: Sayın Hâkim, savcılığın kaydını tanığa göstermek istiyorum: 18.42.05.
Ekranda gri kareler. Arda oturuyor, ayağı takılıyor, eğiliyor.
hayri: Eğiliyor… yerden alıyor. Ben bunu çantadan sanıyordum. Doğru, eğildi.
`),
        }),
        presentRule('PS_HS4_KLIP_ERKEN', 'HS4', ['ev_klip'], {
          maxUses: 2,
          responses: B(`
> Kaydı tanığa göstermeden önce ilk saniyelerini kendim kare kare izlemeliydim. Neyi göstereceğimi bilmeden ekranı açamam. Kâğıdı indirdim.
`),
        }),
        presentRule(
          'PS_HAYRI_ILGISIZ',
          undefined,
          [
            'ded_zarf',
            'ded_teslim',
            'ded_eksik_kayit',
            'ded_kart_baskasi',
            'ded_bereli',
            'ev_recep_ifade',
            'ev_aktarim_formu',
            'ev_tutanak',
            'ev_kentkart',
          ],
          {
            maxUses: 4,
            effects: [
              inc('wrong'),
              score('SORGULAMA', -50, 'hatali'),
              mark(
                'BAD',
                'Delil doğru, tanık yanlış. Bu bulgunun Hayri Doğan’ın gözlemiyle ilgisi yok; doğru tanığa ya da esas savunmaya saklanmalıydı.',
                'SORGULAMA',
              ),
            ],
            responses: B(`
hakim: Müdafi, bu belgenin tanığın anlattıklarıyla ilgisini kuramadım. Ayrıca tartışırız.
> Doğru kâğıt, yanlış an. Kâğıdı dosyaya geri koydum.
`),
          },
        ),
      ],
      presentMiss: fallback('FB_H104_PRESENT', 'PRESENT', {
        effects: [
          ...(wrong() ?? []),
          mark('BAD', 'Bu delil tanığın ifadesindeki hiçbir şeyi çürütmüyor.', 'SORGULAMA'),
        ],
        responses: B(`
hakim: Bu delilin tanığın ifadesiyle ilgisi görülmedi, müdafi.
savci: Sayın Hâkim, savunma dosyada rastgele dolaşıyor.
`),
      }),
      objectMiss: fallback('FB_H104_OBJECT', 'OBJECT', {
        effects: [
          dec('cred'),
          score('SORGULAMA', -50, 'hatali'),
          mark('BAD', 'Dayanaksız itiraz: bu ifade kanaat ya da duyum değil.', 'SORGULAMA'),
        ],
        responses: B(`
hakim: İtiraz reddedildi. Tanık kendi gözlemini anlatıyor.
`),
      }),
      finish: { id: 'H104_BITIR', label: 'Çapraz sorguyu bitir', next: 'H1_05' },
    }),

    {
      id: 'H1_05',
      type: 'CHOICE',
      ...court1.base,
      title: 'Savcılık delili: CD',
      background: 'durusma_salonu',
      prompt: { speaker: 'hakim', text: 'Kayda karşı diyeceğiniz? Birden fazla husus varsa sırayla söyleyin.' },
      lines: [
        W(
          any(flag('contra_h1'), flag('contra_h4')),
          `
hakim: Tanık serbest. CD duruşmada izlendi.
Ekranda gri kareler yeniden döndü. Bu kez salonda kimse aynı şeyi görmüyordu. Savcı bile.
savci: Sayın Hâkim, tanığın görme koşulları tartışılabilir. Ama kayıt ortada: sanık cüzdanı alıyor ve çantasına koyuyor.
`,
        ),
        O(`
hakim: Tanık serbest. CD duruşmada izlendi.
Ekranda gri kareler yeniden döndü: oturuyor, eğiliyor, alıyor, açıyor, kapatıyor, çantaya koyuyor. Salondaki herkes aynı şeyi gördü.
savci: Kayıt ortada, Sayın Hâkim. Sanık cüzdanı alıyor ve çantasına koyuyor. Kimseye göstermiyor, kimseye sormuyor.
`),
      ],
      choices: [
        option('H105_EKSIK', 'Kayıt eksik: dört kanallı tam sefer kaydı getirtilsin', {
          visibleWhen: any(
            has('clue_kaynak_dosya'),
            has('clue_dort_kamera'),
            has('clue_olay_klasoru'),
            has('ded_eksik_kayit'),
          ),
          next: '$stay',
          effects: [...legal(100), inc('pers'), raise('kayit_istendi_h1')],
          good: 'Delilin bütünlüğü tartışıldı: CD, dört kanallı ve bir saatlik bir kaynaktan seçilmiş 2,5 dakika. Tam kaydın getirtilmesi ispat edilecek olayla doğrudan ilgili (CMK 206/1); hâkim kararını tam kayıt olmadan veremez (CMK 217/1).',
          category: 'USUL_BILGISI',
          responses: [
            W(
              flag('kayit_istendi'),
              `
P: Sayın Hâkim, delil dilekçemizde de belirttiğimiz gibi: bu CD, Kent Ulaşım arşivindeki bir saatlik, dört kanallı bir kaydın tek kanalından alınmış iki buçuk dakika.
P: Cüzdanın sanığın eline geçmeden önce kimde olduğu ve sanığın sonra ne yaptığı, aynı kaydın öbür kanallarında. Tam kaydın getirtilmesini yineliyoruz.
hakim: Dilekçeniz dosyada. Ara kararda değerlendireceğim.
`,
            ),
            O(`
P: Sayın Hâkim, aktarım formuna göre bu CD bir saatlik, dört kanallı bir sefer kaydından alınmış tek kanal ve iki buçuk dakika. Tam kayıt olay klasöründe duruyor.
P: Cüzdanın sanıktan önce kimde olduğu ve sanığın sonra ne yaptığı aynı kaydın öbür kanallarında. Tam kaydın getirtilmesini talep ediyoruz.
savci: Talebin süresinde yapılmadığını belirtirim.
P: Delil talebi geç bildirildi diye reddedilemez, Sayın Savcı.
hakim: Talep ara kararda değerlendirilecek.
`),
          ],
        }),
        option('H105_SEGMENT', 'CD bütün değil: bir dakika yazılamamış; teknisyen dinlensin', {
          visibleWhen: has('clue_bozuk_segment'),
          next: '$stay',
          effects: [...legal(80), raise('volkan_cagrildi')],
          good: 'Delilin bütünlüğüne somut bir itiraz: aktarım formunun kendi dipnotu bir dakikanın eksik olduğunu söylüyor. Kaydı aktaran teknisyenin dinlenmesi bu eksikliği açıklamanın doğru yolu.',
          category: 'USUL_BILGISI',
          responses: B(`
P: Ayrıca: aktarım formunun dipnotuna göre 18.43’ün tamamı CD’ye yazılamamış. Kayıtta 18.42.59’dan 18.44.00’e atlanıyor. Kaydı aktaran teknisyen Volkan Sezer’in dinlenmesini istiyoruz.
hakim: Kâtip hanım, formu bana uzatır mısınız?
Hâkim dipnotu okudu. Kaşları bir milim kalktı.
`),
        }),
        option('H105_HUKUKA', 'Kayıt hukuka aykırı alındı; delil olarak dışlansın', {
          next: '$stay',
          effects: [dec('cred'), score('USUL_BILGISI', -50, 'hatali')],
          bad: 'Toplu taşıma aracındaki güvenlik kamerası kaydının polis talebiyle işletmeden alınması hukuka aykırı bir elde etme değildir. Sorun kaydın hukuka uygunluğu değil, eksik olmasıdır.',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Kaydın hukuka aykırı elde edildiğine dair bir husus göremiyorum, müdafi. Talep reddedildi.
savci: Teşekkürler Sayın Hâkim.
`),
        }),
        option('H105_BILIRKISI', 'CD bilirkişiye gönderilsin; oynanmış olabilir', {
          next: '$stay',
          maxUses: 1,
          effects: [score('USUL_BILGISI', -20)],
          neutral:
            'Bilirkişi CD’nin üzerinde oynanıp oynanmadığını söyleyebilir; ama eksik kameraları ve dakikaları tamamlayamaz. Somut bir oynama iddiası da yoktu. Asıl delil kaynaktaki tam kayıttır.',
          responses: B(`
hakim: CD’nin üzerinde oynandığına dair somut bir husus ileri sürmediniz, müdafi. Şimdilik gerek görmüyorum.
savci: Savunma kayda güvenmiyorsa, neye güveniyor, merak ediyorum.
`),
        }),
        cont('H105_BITIR', 'Başka diyeceğimiz yok', 'H1_06'),
      ],
    },

    {
      id: 'H1_06',
      type: 'CHOICE',
      ...court1.base,
      title: 'Delil talepleri',
      background: 'durusma_salonu',
      prompt: { speaker: 'hakim', text: 'Taraflar, toplanmasını istediğiniz başka delil var mı?' },
      lines: B(`
> Duruşmada delil talebi de olur. Ama her talep, hâkimin önüne bir soru koyar: bu, ispat edilecek olayla ne kadar ilgili?
`),
      choices: [
        option('H106_RECEP', 'Şoför Recep Ateş’in tanık olarak dinlenmesi', {
          next: '$stay',
          effects: [score('USUL_BILGISI', 40), raise('recep_cagrildi')],
          good: 'Şoför, sanığın teslim girişiminin muhatabı. Kolluk beyanı dosyada; duruşmada dinlenmesi doğrudan doğruyalık ilkesinin (CMK 210) gereği.',
          category: 'USUL_BILGISI',
          responses: B(`
P: Şoför Recep Ateş’in tanık olarak dinlenmesini istiyoruz. Kolluk beyanı var, ama sorularımızı duruşmada sormak istiyoruz.
hakim: Kabul.
`),
        }),
        option('H106_VOLKAN', 'Kaydı aktaran teknisyen Volkan Sezer’in dinlenmesi', {
          visibleWhen: all(any(has('clue_kaynak_dosya'), has('clue_bozuk_segment')), not(flag('volkan_cagrildi'))),
          next: '$stay',
          effects: [score('USUL_BILGISI', 40), raise('volkan_cagrildi')],
          good: 'Delilin nasıl ve ne kadar aktarıldığını bilen kişi teknisyendir; bütünlük tartışmasının doğru tanığı.',
          category: 'USUL_BILGISI',
          responses: B(`
P: Kaydı aktaran Kent Ulaşım teknisyeni Volkan Sezer’in dinlenmesini istiyoruz.
hakim: Kabul.
`),
        }),
        option('H106_153', '153 Çözüm Merkezi’nin 6 Mart 19.18 çağrı kaydı', {
          visibleWhen: all(any(has('clue_153_arama'), flag('fact_153_anlatti')), not(flag('cagri_istendi'))),
          next: '$stay',
          effects: [score('USUL_BILGISI', 60), raise('cagri_istendi_h1')],
          good: 'Teslim niyetini gösteren tarafsız bir kayıt; saati ve numarası belli (CMK 206/1).',
          category: 'USUL_BILGISI',
          responses: B(`
P: Sanığın 6 Mart 19.18’de 153 Çözüm Merkezi’ni aradığını ve bulduğu cüzdanı bildirdiğini ileri sürüyoruz. Çağrı kaydının getirtilmesini istiyoruz.
savci: Sanığın kendi beyanı dışında…
P: İşte o yüzden istiyoruz, Sayın Savcı. Beyan değil, kayıt.
hakim: Kabul.
`),
        }),
        option('H106_OZAN', 'Tanık: ev arkadaşı Ozan Kaplan', {
          visibleWhen: all(any(flag('fact_ozan'), has('clue_sari_not')), not(flag('ozan_istendi'))),
          next: '$stay',
          effects: [score('USUL_BILGISI', 30), raise('ozan_istendi')],
          good: 'Sarı notun ne zaman yazıldığını ve sabah ne olduğunu gören tanık.',
          category: 'USUL_BILGISI',
          responses: B(`
P: Sanığın ev arkadaşı Ozan Kaplan’ın, el konulan notun yazılışına ve olay sabahına dair dinlenmesini istiyoruz.
hakim: Kabul.
`),
        }),
        option('H106_GULTEN_FB', 'Müştekinin telefonunun incelenmesi', {
          next: '$stay',
          effects: [dec('pers'), score('USUL_BILGISI', -40, 'hatali')],
          bad: 'Müştekinin telefonunun bütünüyle incelenmesi ölçüsüz ve özel hayata dokunan bir talep; neyi ispat edeceği gösterilmedi (CMK 206/2-b). Mağduru şüpheli gibi gösteren talepler hâkimin güvenini azaltır.',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Müştekinin telefonunun neyi ispat edeceğini göstermediniz. Reddedildi.
gulten.kizgin: Benim telefonumu mu? Ben ne yaptım?
`),
        }),
        cont('H106_BITIR', 'Başka talebimiz yok', 'H1_07'),
      ],
    },

    court1.objection('H1_07', {
      title: 'Nitelendirme',
      courtStage: 'DELIL_TARTISMA',
      say: S(`
savci: Sayın Hâkim, bir hususa dikkat çekmek isterim. Tanık beyanına göre cüzdan, kalabalıkta, yaşlı müştekinin üstündeki çantadan alınmıştır.
savci: Bu eylem, iddianamedeki basit hırsızlığı aşar. Elde ya da üstte taşınan eşyanın özel beceriyle alınması, TCK 142/2-b’dir. Değerlendirilmesini talep ederim.
> Leyla’nın sesi: “Biri ‘özel beceri’ derse beş yıldan başlarız.” Biri dedi.
Arda bana döndü. Rakamı bilmiyordu; ama yüzümden okudu.
Ön sırada Gülten Hanım’ın torunu Elif telefonuna bir şey yazdı, sonra babaannesinin kulağına eğildi. Gülten Hanım başını salladı. Ne konuştuklarını duymadım.
hakim: Sanık ve müdafiine, eylemin TCK 142/2-b kapsamında değerlendirilebileceği hatırlatıldı. Müdafi, diyeceğiniz?
`),
      next: 'H1_08',
      options: [
        option('H107_SURE', 'Ek savunmamızı hazırlamak için süre istiyoruz', {
          effects: [...legal(80), raise('ek_sure')],
          good: 'Suçun hukuki niteliği değişebilecekse sanığa haber verilir ve ek savunma imkânı tanınır (CMK 226/1); istem üzerine ek savunmayı hazırlamak için süre verilir (CMK 226/3).',
          category: 'USUL_BILGISI',
          responses: B(`
P: Sayın Hâkim, ek savunmamızı hazırlamak için süre istiyoruz. Bu aşamada şunu belirtmekle yetinirim: tanığın kendisi bugün “eğildi, aldı” dedi.
hakim: Süre verildi. Ek savunma bir sonraki celsede alınacak.
`),
        }),
        option('H107_BAGLI', 'İtiraz: mahkeme iddianamedeki nitelendirmeyle bağlıdır', {
          effects: [dec('cred'), score('USUL_BILGISI', -50, 'hatali')],
          bad: 'Mahkeme fiilin nitelendirilmesinde iddia ve savunmalarla bağlı değildir (CMK 225/2); bağlı olduğu şey iddianamede anlatılan fiil ve faildir. Doğru hamle ek savunma süresi istemekti (CMK 226/3).',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Mahkeme fiilin nitelendirilmesinde bağlı değildir, müdafi. Hatırlatma yapıldı. Ek savunma hakkınız saklı.
> Yanlış kapıyı çaldım. Kapı açılmadı; ama ses salonda kaldı.
`),
        }),
        option('H107_SIMDI', 'Ek savunmayı hemen yapalım: beceri de alma da yok', {
          effects: [score('HUKUKI_BILGI', 30), raise('ek_simdi')],
          neutral:
            'Hemen cevap vermek mümkündür; ama tam kayıt ve yeni deliller gelmeden yapılan ek savunma eksik kalır. Süre istemek (CMK 226/3) daha güçlü bir zemin bırakırdı.',
          responses: B(`
P: Özel beceri bir yana, ortada bir alma eylemi yok Sayın Hâkim. Sanık cüzdanı kimseden almadı; yerden buldu.
hakim: Beyanınız tutanağa geçti. Ek savunmanızı genişletmek isterseniz bir sonraki celsede de alınır.
`),
        }),
        option('H107_YOK', 'Uyarıya diyeceğimiz yok; esasta cevap veririz', {
          effects: [dec('pers')],
          neutral:
            'Nitelendirme uyarısı karşılıksız kaldı. Ek savunma hakkı (CMK 226) bir sonraki celsede yine kullanılabilir; ama bugün hâkimin önünde savcının cümlesi tek başına kaldı.',
          responses: B(`
hakim: Peki.
> Savcının cümlesi salonda tek başına asılı kaldı. Beş yıl, on yıl. Arda’nın kravatı yine fazla sıkıydı.
`),
        }),
      ],
    }),

    // Ara karar: koşullu satır zinciri.
    decisionNode('H1_08', [{ to: 'H1_08B' }], {
      ...HEAR1,
      lines: [
        W(
          any(flag('kayit_istendi'), flag('kayit_istendi_h1')),
          `
hakim: Ara karar. Bir: Kent Ulaşım A.Ş.’ye müzekkere yazılarak 6 Mart tarihli Hat 38 seferine ait dört kanallı tam kaydın, aktarım bilgileriyle birlikte gönderilmesine.
`,
        ),
        O(`
hakim: Ara karar. Bir: dosyadaki kayıt yeterli görüldüğünden ayrıca kayıt getirtilmesine yer olmadığına.
`),
      ],
    }),
    decisionNode('H1_08B', [{ to: 'H1_08C' }], {
      lines: [
        W(
          any(flag('cagri_istendi'), flag('cagri_istendi_h1')),
          `
hakim: İki: Büyükşehir Belediyesi 153 Çözüm Merkezi’nden 6 Mart 19.18 tarihli çağrının kaydı ve operatör notunun istenmesine.
`,
        ),
      ],
    }),
    decisionNode('H1_08C', [{ to: 'H1_09' }], {
      lines: [
        W(
          any(flag('recep_cagrildi'), flag('volkan_cagrildi'), flag('ozan_istendi')),
          `
hakim: Talep edilen tanıkların bir sonraki celsede dinlenmek üzere davetiyle çağrılmasına.
`,
        ),
      ],
    }),
    story('H1_09', {
      ...HEAR1,
      title: 'Erteleme',
      background: 'adliye',
      lines: [
        W(
          flag('foto_yerinde'),
          H109_ORTAK +
            `
Gülten Hanım asansörün önünde duruyordu. Arda’yı görünce bir şey söyleyecek gibi oldu. Söylemedi. Kapı açıldı, bindi.
Kapı kapanırken bir an bana baktı. Öfke yoktu o bakışta. Bir soru vardı.
` +
            H109_SON,
        ),
        O(
          H109_ORTAK +
            `
Gülten Hanım torunuyla asansöre bindi. Arda’ya bakmadı. Asansörün kapısı aralarında bir duvar gibi kapandı.
` +
            H109_SON,
        ),
      ],
      choices: [cont('H109_DEVAM', 'Üç hafta', 'ARA_GIRIS_0', { role: 'PRIMARY' })],
    }),
  ],
};
