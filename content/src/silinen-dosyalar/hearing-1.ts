import {
  all,
  any,
  choiceNode,
  cmp,
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
  meet,
  not,
  objectRule,
  option,
  presentRule,
  pressRule,
  raise,
  score,
  set,
  statement,
  story,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, O, T, W } from './dsl.js';
import { H1, court1, wrongMove } from './shared.js';

// 60-hearing-1: 1. celse. Koridor, açılış, sanığa sorular, “uzman raporu” itirazı, Bülent Arıkan’ın tanıklığı
// (B1–B6), katılan vekilinin talebi, savunmanın talepleri, ara karar.

export const hearing1: CasePart = {
  config: {
    objectionGrounds: [
      ground('g_telkin', 'Telkin edici, yönlendirici soru', 'CMK 201/1'),
      ground('g_kanaat', 'Tanığın gözlemi değil kişisel kanaati', 'CMK 217'),
      ground('g_ilgisiz', 'Olayla ilgisiz, ispata etkisi olmayan delil', 'CMK 206/2-b'),
    ],
  },
  court: {
    sessions: [
      courtSession('cs_1', '1. Celse', [
        ['s1_acilis', 'ACILIS', 'H1_00'],
        ['s1_savunma', 'SANIK_SAVUNMASI', 'H1_01'],
        ['s1_tanik', 'TANIK_DINLEME', 'H1_03'],
      ]),
    ],
  },
  nodes: [
    decisionNode('H1_00G_1', [{ to: 'H1_00G_2' }], {
      ...H1,
      title: 'Koridor',
      onEnter: [raise('in_court')],
      lines: B(`
# 9 OCAK · 09.25 — BURSA ADLİYESİ, 2. KAT [bg:adliye]
> Adliye koridoru sabahın erken saatinde bile bir istasyon gibiydi. Cübbeler, dosyalar, bir çocuk ağlaması, nereden geldiği belli olmayan bir sigara kokusu.
> Bursa 9. Asliye Ceza’nın kapısında Gül bekliyordu. Selim yanında; takım elbise giymişti, kravat takmamıştı. “Kravat beni boğuyor” demişti telefonda.
> Koridorun öbür ucunda takım elbiseli iki adam: biri parlak cübbesini koluna atmış genç bir avukat, öbürü elinde bir dosya, kulağında kulaklık. Ozan Tekin ve Bülent Arıkan.
`),
    }),
    decisionNode('H1_00G_2', [{ to: 'H1_00K' }], {
      onEnter: [ifThen(flag('tarik_ziyaret'), [dec('cred'), dec('pers')])],
      lines: [
        W(
          flag('tarik_ziyaret'),
          `
> Ozan Tekin bana doğru yürüdü. Gülümsüyordu; kalabalığa gülümser gibi.
ozan: Meslektaşım, müvekkilimin genel müdürüyle benden habersiz bir çay içmişsiniz. Baroya yazmayacağım; bugünlük. Hâkim beye söyledim ama. Bilsin.
~ Haklıydı. Karşı tarafın avukatı varken onun bilgisi olmadan karşı tarafla konuşulmaz. Bunu stajda öğrenmiştim; çay bardağı ince belliydi diye unuttum.
`,
        ),
        O(`
> Ozan Tekin bana başıyla selam verdi; kibar, kısa, ölçülü. Bülent Arıkan telefonuna gömülmüştü.
~ Karşı tarafın en tehlikeli hâli kibarlığıdır. Kibar insan hata yapmaz; hatayı sana yaptırır.
`),
      ],
    }),
    story('H1_00K', {
      ...H1,
      title: 'Koridor',
      background: 'adliye',
      lines: B(`
> Gül koluma dokundu. Elinde katlanmış bir kâğıt; bir çocuk resmi.
gul: Defne bu sabah bunu verdi. “Babamın mahkemesi” diye. Bir bina, merdivenler, babası merdivenin başında. Güneşi yine içeri çizmiş.
gul: Bugün biter mi avukat hanım? Okuldan izin aldım; müdür “bir gün” dedi. Bir günde biter mi?
selim: Gül, bırak. Avukat hanım ne bilsin.
> Selim cebinden bir sigara çıkardı, koridorda içilmeyeceğini hatırladı, geri koydu. Elleri titriyordu; bunu görmeyeyim diye ceplerine soktu.
`),
      choices: [
        option('H100K_A', '“Bugün bitmeyecek. Ama bugün başlıyor.”', {
          effects: [raise('koridor_durust')],
          responses: B(`
- Bugün bitmeyecek Gül Hanım. Ama bugün başlıyor. Ne olursa olsun, akşam size ben anlatacağım.
gul: Başlasın. Başlasın da… Peki.
~ Bir eşe “belki” demek, “evet” demekten zordur. Ama ertesi gün yüzüne bakabilirsin.
`),
          next: 'H1_00',
        }),
        option('H100K_B', '“Bu iş bugün kapanır, merak etmeyin.”', {
          effects: [raise('koridor_umut')],
          responses: B(`
- Merak etmeyin Gül Hanım. Bu iş bugün kapanır.
> Gül’ün yüzü aydınlandı. Resmi katladı, çantasına koydu. Selim bana baktı; bir şey demedi. Gözleri her şeyi dedi.
~ Bir umut verdim. Umut vermek ucuzdur; ödemesini başkası yapar.
`),
          next: 'H1_00',
        }),
      ],
    }),
    court1.stage('H1_00', {
      title: 'Duruşma · 1. Celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onFirstEnter: [meet('kemal'), meet('ferda'), meet('ozan'), meet('cevdet')],
      lines: B(`
cevdet: Selim Aktaş dosyası! Taraflar salonaaa! Hı-hım.
# BURSA 9. ASLİYE CEZA MAHKEMESİ — 1. CELSE [bg:durusma_salonu]
> Salon küçüktü. Tek bir kürsü, tek bir hâkim. Sağda savcı, solda katılan şirketin vekili. Arkada dört sıra dinleyici; ikisi boş.
> Hâkim Kemal Oran ellilerinde, gözlüklü, sakin. Dosyanın kapağını açarken kâğıtları tek tek düzeltti; bir masa ustası gibi.
kemal: Sanık Selim Aktaş’ın tutuksuz olarak, müdafii Av. Deniz Arslan’ın hazır olduğu görüldü. Katılan şirket vekili Av. Ozan Tekin hazır. Tanık Bülent Arıkan salon dışında bekletiliyor.
kemal: Açık yargılamaya başlandı. Sanığın kimliği tespit edildi. İddianame özetini Cumhuriyet savcısından dinleyelim.
> Savcı Ferda Yalın ayağa kalktı. Kırklarında, kısa saçlı, kâğıda bakmadan okuyan biri.
ferda: Sanık, katılan şirketten 30 Eylül’de işten çıkarıldıktan sonra, 18 Ekim gece 02.14’te kendi kullanıcı adıyla şirketin bilişim sistemine uzaktan girmiş, dosya sunucusundaki verileri yok etmiştir.
ferda: Sanığın aynı akşam saat 21.30’da da sisteme girdiği emniyet raporuyla sabittir. Eylem TCK 243/1 ve 244/2 kapsamındadır.
kemal: Sanığa hakları hatırlatıldı. Sanık, savunmanızı yapın.
selim: Ben verileri silmedim Sayın Hâkim. Ben dokuz yıl o sistemin her gece yedeğini aldım. Kendi elimle kurduğum şeyi neden yakayım?
~ “21.30’da da girdiği sabittir.” Savcı bunu bir ekleme gibi söyledi; ama salondaki herkes iki girişi aynı cümlede duydu.
> Dinleyici sırasında Gül. Öbür uçta, yalnız, bir adam: kır saçlı, takım elbiseli, dizinin üstünde katlanmış bir gazete. Tarık Sezer. Katılan şirketin temsilcisi.
`),
      choices: [cont('H100_DEVAM', 'Sanığa sorular', 'H1_01', { role: 'PRIMARY' })],
    }),
    choiceNode('H1_01', {
      ...H1,
      title: 'Sanığın savunması',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
kemal: Müdafi, sanığa sorularınız varsa doğrudan sorabilirsiniz.
~ Ona soracağım her soru hâkime bir şey anlatır. Doğru sorular onun hikâyesini kurar; yanlış soru savcınınkini.
`),
      choices: [
        option('Q_2130', '“Cuma akşamı 21.30’da ne yaptınız?”', {
          visibleWhen: has('clue_kisisel'),
          score: { SORGULAMA: 40 },
          effects: [inc('pers'), raise('h1_2130')],
          good: 'İddianın elindeki girişi sanığın kendi ağzından ve kendi bağlamıyla tutanağa geçirttin; saklanan bir şey kalmadı.',
          category: 'SORGULAMA',
          responses: B(`
selim: Kendi klasörümü aldım. Kızımın doğum fotoğraflarını, özgeçmişimi. Yirmi dakika. Başka hiçbir dosyaya dokunmadım.
selim: Emniyet raporunda da yazıyor: dört yüz on iki fotoğraf ve bir özgeçmiş. Şirket dosyası yok.
> Hâkim not aldı. Savcı kalemini bıraktı; bir şey bekliyordu, gelmedi.
`),
          next: '$stay',
        }),
        option('Q_IZIN', '“Hesabınızın açık kalacağını size kim söyledi?”', {
          visibleWhen: any(has('ev_eposta'), has('clue_hesap_acik')),
          score: { SORGULAMA: 40 },
          effects: [inc('pers'), raise('h1_riza')],
          good: 'Girişin rızaya dayandığını sanığın anlatımı ve belgeyle ortaya koydun: “hukuka aykırı giriş” unsuru tartışmaya açıldı (TCK 243/1).',
          category: 'SORGULAMA',
          responses: [
            W(
              has('ev_eposta'),
              `
selim: Tarık Bey. Son gün akşamı e-posta attı: “Kişisel dosyalarını 31 Ekim’e kadar uzaktan alabilirsin, hesabın açık kalacak.”
- Sayın Hâkim, söz konusu e-postanın çıktısını dosyaya sunuyorum.
> Hâkim çıktıyı aldı; okudu. Katılan vekiline uzattı. Ozan Tekin okudu, dinleyici sırasındaki Tarık Sezer’e baktı. Tarık Sezer gazetesini katladı.
`,
            ),
            O(`
selim: Tarık Bey. Devir-teslim tutanağına kendi eliyle yazdı: “Kişisel dosyalar için VPN hesabı 31.10’a kadar açık.” Parafı var.
> Hâkim tutanağın fotokopisini istedi. Ozan Tekin bir şey söylemek için ayağa kalktı, sonra oturdu.
`),
          ],
          next: '$stay',
        }),
        option('Q_DEVIR', '“Ayrılırken şifreleri kime teslim ettiniz?”', {
          visibleWhen: any(has('ev_devir'), flag('fact_devir')),
          score: { SORGULAMA: 40 },
          effects: [inc('pers'), raise('h1_devir')],
          good: 'Kayıttaki kullanıcı adının tek bir kişiyi göstermediğini, şifrelerin el değiştirdiğini sanığın anlatımıyla ortaya koydun.',
          category: 'SORGULAMA',
          responses: B(`
selim: Genel müdüre. Tarık Bey’e. Kapalı bir zarfta, tutanakla. Kendisi istedi; “şifreler bende dursun” dedi.
> Salonun arkasında bir gazete hışırdadı. Kimse dönüp bakmadı; ben de.
`),
          next: '$stay',
        }),
        option('Q_YEDEK', '“Yedekleme konusunda şirketle ne tartıştınız?”', {
          visibleWhen: flag('fact_kavga'),
          score: { SORGULAMA: 20 },
          responses: B(`
selim: Yedek cihazının diskleri dolmuştu. Yeni disk istedim; bütçe yok dediler. Toplantıda “Bir gün her şey silinirse beni aramayın” dedim. Uyarıydı.
ferda: Uyarı mı, plan mı?
selim: Uyarı Sayın Savcı. Planlayan adam toplantıda söylemez.
`),
          next: '$stay',
        }),
        option('Q_SIFRE', '“Şifreleri hâlâ biliyor musunuz?”', {
          score: { SORGULAMA: -30 },
          effects: [dec('pers')],
          bad: 'Cevabını bildiğin ve müvekkilin aleyhine işleyecek bir soruyu açık oturumda sordun; savcılığın işini yaptın.',
          category: 'SORGULAMA',
          responses: B(`
selim/saskin: Biliyorum tabii. Dokuz yıl ben koydum. Ama bilmek…
ferda: Teşekkür ederim, tutanağa geçsin: sanık şifreleri hâlâ bildiğini beyan etti.
~ Cevabını bildiğim bir soruyu sordum. Cevabını savcı da biliyordu; ama benden duymak istiyordu.
`),
          next: '$stay',
        }),
        option('Q_KIN', '“Şirkete kızgın mısınız?”', {
          score: { SORGULAMA: -20 },
          neutral: 'Saik sorusunu kendin açtın; dürüst cevap bile savcılığın anlatısına malzeme olur.',
          responses: B(`
selim: Kızgın mıyım? Dokuz yıl verdim, bir koli kablo aldım. Kızgınım tabii. Ama kızgınlık silmek değil.
> Ozan Tekin bir şey yazdı; altını iki kez çizdi.
`),
          next: '$stay',
        }),
        cont('Q_BITIR', 'Sorularım bu kadar', 'H1_02', { role: 'PRIMARY' }),
      ],
    }),
    court1.objection('H1_02', {
      title: 'Katılan vekilinin talebi',
      courtStage: 'SANIK_SAVUNMASI',
      background: 'durusma_salonu',
      say: T(`
ozan: Sayın Hâkim, dosyada DataKale Bilişim’in imaj ve analiz raporu mevcuttur. Raporun bilirkişi raporu olarak okunmasını ve hükme esas alınmasını talep ediyoruz.
ozan: Rapor açıktır: silme işlemi sanığın hesabından yapılmıştır. Ayrıca bir bilirkişi incelemesi, şirketimizi yeniden aylarca bekletmekten başka bir işe yaramaz.
> Ozan raporu havaya kaldırdı; kapaktaki kale logosu salonun florasanında parladı. Dinleyici sırasında Bülent Arıkan dikleşti.
ferda: Savcılık olarak takdiri mahkemenize bırakıyoruz. Ancak raporun hazırlanış biçimi hakkında müdafinin de görüşü alınmalı.
kemal: Müdafi, diyeceğiniz?
~ “Bilirkişi raporu olarak.” Bu iki kelime bu salonda kabul edilirse, şikâyetçinin firması hâkimin gözü olur.
~ Bir rapora ad koymak, ona bir koltuk vermektir. Uzmanın koltuğu tarafların yanındadır; bilirkişininki mahkemenin yanında.
`),
      next: 'H1_03',
      options: [
        option('H102_A', 'Bu bir uzman mütalaasıdır; mahkemece bilirkişi atansın, orijinal diskler muhafaza edilsin', {
          score: { USUL_BILGISI: 100 },
          effects: [raise('bilirkisi_atandi'), inc('legal_hits'), inc('pers')],
          good: 'Şikâyetçinin aldırdığı rapor uzman mütalaasıdır (CMK 67/6); bilirkişiyi mahkeme atar (CMK 63). Orijinal disklerden usulüne uygun imaj ve özet değer (CMK 134) istenmeli.',
          category: 'USUL_BILGISI',
          responses: B(`
- Sayın Hâkim, söz konusu rapor mahkemenizin atadığı bir bilirkişinin değil, şikâyetçi şirketin kendi servis firmasının raporudur. Hukuki niteliği uzman mütalaasıdır.
- Mahkemenizce bağımsız bir bilirkişi atanmasını; şirketteki orijinal disklerin muhafaza altına alınmasını ve bunlardan usulüne uygun, özet değerli yeni imaj alınmasını talep ediyoruz.
> Hâkim savcıya baktı. Savcı başını hafifçe eğdi: itirazı yoktu.
kemal: Talep yerinde görüldü. Ara kararda değerlendirilecek.
> Ozan Tekin oturdu. Bir şey yazdı; bu kez altını çizmedi.
`),
        }),
        option('H102_B', 'Rapor hukuka aykırı delildir; tamamen dışlansın', {
          score: { USUL_BILGISI: -20 },
          neutral: 'Özel uzman raporu kendiliğinden hukuka aykırı delil değildir (CMK 206/2-a, 217/2 için yasak bir yöntem gerekir); hâkim onu takdir eder. Bilirkişi istemedin.',
          responses: B(`
- Sayın Hâkim, rapor hukuka aykırı delildir; tamamen dışlanmasını talep ediyoruz.
kemal: Hangi yasak yöntemle elde edildi müdafi? Bir şirketin kendi sistemine kendi firmasıyla bakması yasak değildir. Raporun değerini takdir ederim. Talep reddedildi.
~ Doğru bir sezgiyi yanlış bir kelimeyle söyledim. Mahkeme kelimeyi reddetti; sezgiyi duymadı.
`),
        }),
        option('H102_C', 'Raporun içeriğine diyeceğimiz yok; tanığı dinleyelim', {
          effects: [dec('pers')],
          neutral: 'Raporun niteliğine itiraz etmedin; şikâyetçinin uzmanı dosyada bilirkişi gibi kalmaya devam ediyor.',
          responses: B(`
- Raporun içeriğine bir diyeceğimiz yok Sayın Hâkim. Tanığı dinlemek istiyoruz.
kemal: Rapor dosyada durur. Tanığı dinleyelim.
~ Rapor dosyada durur. Bir hâkimin masasında, mahkemenin değil bir şirketin mührüyle.
`),
        }),
        option('H102_D', 'Rapor yanıltıcıdır; Bülent Arıkan hakkında suç duyurusunda bulunuyoruz', {
          score: { USUL_BILGISI: -40 },
          effects: [dec('cred'), dec('pers')],
          bad: 'Henüz ortaya konmamış bir kasıt iddiasıyla tanığı duruşmanın başında suçlamak, dayanaksız bir hamle olarak görülür ve tanığı kapatır.',
          category: 'USUL_BILGISI',
          responses: B(`
- Rapor yanıltıcıdır Sayın Hâkim. Tanık hakkında suç duyurusunda bulunuyoruz.
kemal: Henüz tanığı dinlemedik müdafi. Suç duyurusu yapma hakkınız saklı; ama bu salonda önce sorular sorulur.
> Savcı ilk kez bana döndü; kaşları kalkık.
`),
        }),
      ],
    }),
    court1.testimony('H1_03', {
      title: 'Bülent Arıkan’ın dinlenmesi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'bulent',
      witnessLabel: 'TANIK · BÜLENT ARIKAN',
      rulesText: 'İpucu: önce bastır, sonra doğru delille göster. Yanlış delil güvenilirliği ve skoru düşürür.',
      objectionGrounds: ['g_telkin', 'g_kanaat', 'g_ilgisiz'],
      say: T(`
cevdet: Tanık Bülent Arıkaaan! Hı-hım.
> Bülent Arıkan kürsüye geldi. Kulaklığını çıkarıp cebine koydu; sonra yeniden çıkarıp masaya bıraktı, sonra cebe. Yemin etti; sesi yüksek, emin.
kemal: Tanık, olayı ve yaptığınız incelemeyi anlatın.
bulent: Teknik olarak basit bir olay Sayın Hâkim. 18 Ekim sabahı Tarık Bey aradı. Koştuk. İmaj aldık, analiz ettik. Kayıtlar açık: silme, sanığın kullanıcı adıyla açılan bir oturumda yapılmış.
bulent: Biz bu işi on beş yıldır yapıyoruz. Bankalar, fabrikalar. Rapor ortada.
kemal: Müdafi, sorularınız.
~ “Teknik olarak basit.” Basit olan her şey, birinin karmaşık kısmı atladığını gösterir. Önce dinleyeceğim. Sonra bastıracağım. Raporu en son açacağım.
> Ozan Tekin arkasına yaslandı. Tarık Sezer dinleyici sırasında bacak bacak üstüne attı; gazetesi dizinde, hiç açılmamış.
`),
      statements: [
        statement('B1', 1, [
          'Olay sabahı ',
          hl('ilk iş imajı aldık', any(flag('press_b1'), has('clue_imaj_tarih'))),
          '. Bu işin altın kuralı budur.',
        ]),
        statement('B2', 2, [
          hl('İmajdan önce sisteme kimse dokunmadı', any(flag('press_b2'), has('clue_kurtarma'), has('clue_bulent'))),
          '; ne biz, ne şirket.',
        ]),
        statement('B3', 3, [
          'Özet değerler ',
          hl('birebir tuttu', any(flag('press_b3'), has('clue_hash'))),
          '; imaj tertemiz.',
        ]),
        statement('B4', 4, [
          'O kullanıcı adının şifresini ',
          hl('sanıktan başka kimse bilmez', any(flag('press_b4'), has('ev_devir'), has('ded_sifre'))),
          '.',
        ]),
        statement('B5', 5, [
          'Silme ',
          hl('sanığın evinden', any(has('clue_emn_yok'), has('clue_gsm'), has('ded_dizustu'), has('ded_hat'))),
          ' yapıldı; bağlantı oradan geldi.',
        ]),
        statement(
          'B6',
          6,
          ['Teknik olarak söyleyeyim: işten atılan sistemciler bunu hep yapar; intikam.'],
          flag('press_b4'),
        ),
      ],
      rules: [
        pressRule('PR_B1', 'B1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b1')],
          responses: B(`
- Olay sabahı derken? Saat kaçta?
bulent: Sabah. Öğlene doğru. Yani… o gün içinde. Sonra rapor yazıldı.
- İmaj alınan saat raporda yazıyor mu?
bulent: Yazıyor tabii. Her şey yazıyor.
~ “O gün içinde.” Önce “ilk iş,” şimdi “o gün içinde.” Raporun künyesi başka bir gün söylüyor.
`),
        }),
        pressRule('PR_B2', 'B2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b2')],
          responses: B(`
- Şirket ayağa kalkmak istiyordu, değil mi? Siparişler. Kurtarma denemesi yapılmadı mı?
bulent: Yani… müşteri ister. Ama prosedür bellidir. Önce imaj.
> Bir an Ozan Tekin’e baktı. Ozan bakmadı.
`),
        }),
        pressRule('PR_B3', 'B3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b3')],
          responses: B(`
- Özet değeri anlatır mısınız? Hâkim bey için.
bulent: İmajın parmak izi. Alırken bir değer yazarsın, sonra analizde aynı değeri bulursun; demek ki kimse dokunmamış.
- Raporunuzda iki değer var. Aynılar mı?
bulent: Aynı. Olması gerekir. Yani… aynıdır.
`),
        }),
        pressRule('PR_B4', 'B4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b4')],
          responses: B(`
- Şifre nerede tutuluyordu? Selim Bey ayrıldıktan sonra kimdeydi?
bulent: Bilmiyorum. Biz şifreleri sistem yöneticisinden alırız. O da gitti. Değiştirilmesi gerekirdi; değiştirilmemiş.
bulent: Teknik olarak söyleyeyim: işten atılan sistemciler bunu hep yapar; intikam.
~ Yeni bir cümle. Bir uzmanın ağzından bir kanaat. Tutanağa geçmemeli.
`),
        }),
        pressRule('PR_B5', 'B5', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b5')],
          responses: B(`
- Bağlantının sanığın evinden geldiğini nereden biliyorsunuz?
bulent: Kullanıcı adı onun. Başka nereden gelecek?
~ Kullanıcı adı bir ev adresi değildir.
`),
        }),
        presentRule('PS_B1', 'B1', ['ev_imaj_rapor', 'ded_zincir'], {
          enabledWhen: any(has('clue_imaj_tarih'), has('ded_zincir')),
          visibleWhen: any(has('clue_imaj_tarih'), has('ded_zincir')),
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_b1')],
          good: 'İmaj olaydan iki gün sonra alınmış: delilin elde edilme zinciri başından kırık (CMK 134; CMK 217 takdiri).',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Hâkim, tanığın kendi raporunun künyesi: “İmaj alma: 20.10, 15.40.” Silme 18 Ekim gecesi.
- Bay Arıkan, “olay sabahı ilk iş” dediniz. Raporunuz iki gün sonrasını söylüyor.
bulent: Şey… Pazartesi resmî imajı aldık. Cumartesi sabahı… ön inceleme yaptık.
kemal: Tutanağa geçsin: tanık, imajın 20 Ekim’de alındığını kabul etti.
`),
        }),
        presentRule('PS_B2', 'B2', ['ev_imaj_rapor', 'ded_zincir', 'ded_ozet'], {
          enabledWhen: any(has('clue_kurtarma'), has('ded_zincir'), has('ded_ozet')),
          visibleWhen: any(has('clue_kurtarma'), has('ded_zincir'), has('ded_ozet')),
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_b2')],
          good: 'Raporun kendi eki, imajdan önce canlı sistemde kurtarma yazılımları çalıştırıldığını gösteriyor: imajdaki izler olay gecesine ait olmayabilir.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Hâkim, raporun on üçüncü sayfası, Ek-3: “Müşteri talebiyle veri kurtarma yazılımları canlı sistem üzerinde denenmiştir. 18–19.10.”
- Bay Arıkan, imajdan önce kimse dokunmadı dediniz. Kendi ekiniz iki gün dokunduğunuzu söylüyor.
> Bülent Arıkan dosyayı önüne çekti. Sayfayı buldu. Uzun uzun baktı; kendi yazdığı bir sayfayı ilk kez okuyormuş gibi.
bulent: Bu… standart prosedür. Kurtarma yazılımı okur, yazmaz. Genelde.
- Genelde?
bulent: Yani… bazıları geçici dosya yazar. Ama önemsiz.
`),
        }),
        presentRule('PS_B3', 'B3', ['ev_imaj_rapor', 'ded_ozet'], {
          enabledWhen: any(has('clue_hash'), has('ded_ozet')),
          visibleWhen: any(has('clue_hash'), has('ded_ozet')),
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_b3'), { type: 'GOTO', node: 'H1_03K' }],
          good: 'Raporun iki özet değeri birbirini tutmuyor: imajın bütünlüğü kanıtlanamıyor (CMK 134).',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Hâkim, raporun üçüncü sayfasında imaj alınırken yazılan özet değer “…71c2” ile bitiyor. On birinci sayfada, analizde, aynı imajın değeri “…08be.”
- Bay Arıkan, birebir tuttu dediniz. Tutmuyor.
`),
        }),
        presentRule('PS_B4', 'B4', ['ev_devir', 'ded_sifre'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_b4')],
          good: 'Devir-teslim tutanağı: yönetici şifreleri 30 Eylül’de kapalı zarfla genel müdüre teslim edilmiş. Kullanıcı adı tek bir kişiyi göstermiyor.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Hâkim, 30 Eylül tarihli devir-teslim tutanağı, dördüncü madde: “Sunucu, güvenlik duvarı ve VPN yönetici şifreleri kapalı zarf içinde teslim edilmiştir.” Teslim alan: Genel Müdür T. Sezer.
- Bay Arıkan, o zarfın içinde ne olduğunu biliyor muydunuz?
bulent: Hayır… Yani, zarfı bilmiyordum. Tarık Bey bize şifre vermedi. Biz… biz yeni şifre koymadık; vakit olmadı.
> Kâtip yazmayı bıraktı; hâkimin başını kaldırmasını bekledi. Salonda bir sandalye gıcırdadı.
kemal: Tutanağa geçsin: tanık, şifrelerin sanığın ayrılışından sonra değiştirilmediğini ve genel müdüre teslim edildiğini bilmediğini beyan etti.
`),
        }),
        presentRule('PS_B5', 'B5', ['ev_emniyet', 'ded_dizustu', 'ded_hat'], {
          enabledWhen: any(has('clue_emn_yok'), has('ded_dizustu'), has('ded_hat')),
          visibleWhen: any(has('clue_emn_yok'), has('ded_dizustu'), has('ded_hat')),
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_b5')],
          good: 'Emniyetin usulüne uygun incelemesi: sanığın bilgisayarında 02.14 bağlantısı yok; oturum bir cep hattından açılmış.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Hâkim, emniyetin usulüne uygun inceleme raporu: sanığın bilgisayarında o gece tek bağlantı var, 21.30. 02.00 ile 03.00 arasında cihaz kapalı.
- Sizin kendi özetinizde silme oturumunun kaynağı “GSM” yazıyor. Sanığın evi sabit bir hattan bağlanır. Bağlantı oradan gelmedi.
bulent: Bir telefonla da bağlanabilir…
- Hangi telefonla? Raporunuzda bir telefon var mı?
bulent: Yok. Bakmadık. Bize kullanıcı adı yetti.
`),
        }),
        objectRule('OB_B6', 'B6', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [inc('pers'), inc('legal_hits')],
          good: 'İtiraz yerinde: “işten atılan sistemciler hep yapar” bir bulgu değil, tanığın kanaatidir.',
          category: 'SORGULAMA',
          responses: B(`
- İtiraz ediyorum Sayın Hâkim. “İşten atılan sistemciler bunu hep yapar” bir bulgu değil; tanığın kanaatidir.
kemal: Yerinde. Tanık, yalnızca yaptığınız incelemeyi anlatın. Bu cümle tutanağa geçmeyecek.
bulent: Özür dilerim. Ağzımdan çıktı. Tecrübe.
`),
        }),
        presentRule('PS_SAVCILIK', undefined, ['ev_sikayet', 'ev_log_ozet', 'ev_zarar'], {
          maxUses: 10,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'İddianın kâğıdını iddianın tanığına gösterdin; hiçbir çelişkiyi ortaya koymadı. −1 güvenilirlik, −150 skor.',
          category: 'SORGULAMA',
          responses: B(`
ozan: Sayın Hâkim, müdafi bizim delilimizi bizim tanığımıza okuyor. Teşekkür ederiz.
~ Kendi kalemime kendim mürekkep döktüm.
`),
        }),
      ],
      presentMiss: fallback('FB_H1_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil: −1 güvenilirlik, −150 skor.', category: 'SORGULAMA' },
        responses: B(`
kemal: Bu delilin beyanla ilgisini göremedim müdafi.
~ Yanlış kapıya vurdum. Ses salonda yankılandı.
`),
      }),
      objectMiss: fallback('FB_H1_OBJECT', 'OBJECT', {
        effects: [dec('cred'), inc('wrong'), score('SORGULAMA', -50, 'hatali')],
        quality: { q: 'BAD', feedback: 'Dayanaksız itiraz.', category: 'SORGULAMA' },
        responses: B(`
kemal: İtiraz reddedildi. Dayanağı yok.
`),
      }),
      finish: { id: 'H103_BITIR', next: 'H1_04' },
    }),
    court1.stage('H1_03K', {
      title: 'Çatlak',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'bulent',
      onEnter: [raise('bulent_coktu')],
      lines: B(`
> Salon sustu. Kâtibin klavyesi durdu. Koridordan bir kapı sesi geldi ve o da sustu.
> Bülent Arıkan raporu iki eliyle tuttu. Üçüncü sayfayı açtı, on birinci sayfayı açtı. Gözlüğü yoktu; gözlerini kıstı.
bulent/saskin: Bu… olmaz. Bunlar aynı olmalıydı.
> Kulaklığını cebinden çıkardı, masaya koydu, bir daha cebine koydu. Sesi ilk kez alçaldı.
bulent/uzgun: Biz… cumartesi biraz kurcaladık. Tarık Bey “ne kurtarırsak kârdır” dedi; siparişler, müşteriler… Kurtarma yazılımları çalıştırdık. Sonra pazartesi imaj aldık.
bulent: Özet değer… analizden önce bir dosyayı açmış olabiliriz. Bilmiyorum. Bilmiyorum Sayın Hâkim.
kemal: Tutanağa geçsin: tanık, raporda yer alan iki özet değerin farklı olduğunu ve imajdan önce sistem üzerinde kurtarma çalışması yapıldığını kabul etti.
> Ozan Tekin uzun bir süre konuşmadı. Sonra kalemini masaya bıraktı; yavaşça, ses çıkarmadan. Dinleyici sırasında Tarık Sezer gazetesini katlayıp koltuğunun altına aldı.
~ Bir uzmanı yenmedim. Kendi raporunu ona okuttum. Bu ikisinin farkını yalnızca o ve ben biliyoruz.
`),
      choices: [cont('H103K_DEVAM', 'Devam', 'H1_04', { role: 'PRIMARY' })],
    }),
    court1.objection('H1_04', {
      title: 'Katılan vekilinin ikinci talebi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('bulent_coktu'),
          `
ozan: Sayın Hâkim, tanığın teknik bir yanlışlığı olabilir. Ancak sanığın kişiliği ortadadır.
ozan: Sanığa 2019’da verilmiş bir disiplin ihtarını ve “Sistem çökünce beni ararsınız” paylaşımını dosyaya sunuyoruz; okunmasını talep ediyoruz.
~ Rapor çatladı. Şimdi adamı çatlatmak istiyorlar.
`,
        ),
        O(`
ozan: Sayın Hâkim, sanığın kişiliği de ortadadır. Sanığa 2019’da verilmiş bir disiplin ihtarını ve sosyal medyada paylaştığı “Sistem çökünce beni ararsınız” cümlesini dosyaya sunuyoruz; okunmasını talep ediyoruz.
~ Bir ihtar, bir cümle. Delil değil; bir portre. Kötü bir ışıkta çekilmiş bir portre.
`),
      ],
      next: 'H1_05',
      options: [
        option('H104_A', 'İtiraz: olayla ilgisiz; ispata etkisi yok', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers'), raise('h104_itiraz')],
          good: 'İspatı istenen olayın çözümüne etkisi olmayan delil reddedilir (CMK 206/2-b). Altı yıl önceki bir geç kalma ihtarı ve bir esprinin silme eylemiyle bağı yok.',
          category: 'USUL_BILGISI',
          responses: B(`
- İtiraz ediyorum Sayın Hâkim. 2019’daki ihtar bir mesai gecikmesine ilişkin; paylaşım bir sistem yöneticisinin mesleki esprisidir. İkisinin de 18 Ekim gecesiyle bir bağı yok. İspata etkisi olmayan delil reddedilir.
kemal: Kabul. Talep olayla ilgisi bulunmadığından reddedildi.
> Ozan Tekin omuz silkti; denemişti. Selim’in omuzları bir santim indi.
`),
        }),
        option('H104_B', 'Diyeceğimiz yok', {
          effects: [dec('pers')],
          neutral: 'İlgisiz bir portrenin dosyaya girmesine izin verdin; hâkimin kafasında bir gölge kaldı.',
          responses: B(`
kemal: Belgeler dosyaya alındı.
> Ozan Tekin ihtarı yüksek sesle okudu: “Mesaiye geç kalma.” Paylaşımı da. Salonda biri güldü. Selim gülmedi.
`),
        }),
        option('H104_C', 'İtiraz: sosyal medya paylaşımı özel hayattır', {
          score: { USUL_BILGISI: -20 },
          neutral: 'Herkese açık paylaşım özel hayatın gizliliği kapsamında korunmaz; doğru itiraz ilgisizlikti.',
          responses: B(`
kemal: Herkese açık paylaşılmış bir cümle özel hayat değildir müdafi. Ama ilgisini ben de göremiyorum. Takdirimde kalacak.
`),
        }),
        option('H104_D', 'İtiraz: belgeler sahte olabilir', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred'), dec('pers')],
          bad: 'Dayanaksız sahtelik iddiası; müvekkilin kendi ihtarını ve kendi paylaşımını inkâr ettirmeye kalktın.',
          category: 'USUL_BILGISI',
          responses: B(`
selim: Sahte değil. Ben yazdım onu. Espriydi.
kemal: Sanık kabul ediyor müdafi. İtiraz reddedildi.
~ Kendi müvekkilim beni düzeltti. Salonda.
`),
        }),
      ],
    }),
    choiceNode('H1_05', {
      ...H1,
      title: 'Talepler',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
kemal: Taraflara delil talepleri soruldu. Müdafi, talepleriniz?
~ Bir sonraki celseye ne getireceğim, bugün burada istediğim kadardır. İstemediğim kâğıt gelmez.
`),
      choices: [
        option('R_KART', 'Şirketten kart geçiş kayıtları ve demirbaş zimmet listesi', {
          visibleWhen: any(flag('fact_turnike'), has('clue_kartli_kapi'), flag('fact_kart_iade'), flag('dil_kart')),
          maxUses: 1,
          score: { USUL_BILGISI: 60 },
          effects: [raise('kart_istendi'), inc('legal_hits')],
          good: 'Yedeğin elle devre dışı bırakıldığı odaya giriş kaydı ve cihaz zimmetleri: olayla sınırlı, somut talep (CMK 177; CMK 332).',
          category: 'USUL_BILGISI',
          responses: B(`
- Sayın Hâkim, katılan şirketten 17–18 Ekim tarihli personel kartı geçiş kayıtlarının ve şirket bilgisayarlarının demirbaş zimmet listesinin istenmesini talep ediyoruz.
ozan: Ticari sır…
kemal: İki günlük kart kaydı ve bir zimmet listesi ticari sır değildir vekil bey. Not edildi.
`),
          next: '$stay',
        }),
        option('R_TAM', 'Şirketten ham VPN kaydı', {
          visibleWhen: all(not(has('ev_tam_log')), any(has('clue_gsm'), flag('fact_cihaz_eksik'))),
          maxUses: 1,
          score: { USUL_BILGISI: 50 },
          effects: [raise('tam_istendi')],
          good: 'Özetin yerine ham kaydı istemek; delilin bütünü olmadan takdir yapılamaz (CMK 177).',
          category: 'USUL_BILGISI',
          responses: B(`
- Dosyadaki oturum dökümü bir özettir. Şirketin güvenlik duvarından ham kaydın bütün sütunlarıyla istenmesini talep ediyoruz.
kemal: Not edildi.
`),
          next: '$stay',
        }),
        option('R_OPR', '02.14 oturumunun geldiği GSM hattının abone ve adres atama kaydı', {
          visibleWhen: has('clue_gsm'),
          maxUses: 1,
          score: { USUL_BILGISI: 80 },
          effects: [raise('opr_istendi'), inc('legal_hits')],
          good: 'Kaynağı “GSM” görünen oturumun hangi hatta ait olduğunun operatörden istenmesi; tek bir oturum ve tek bir saatle sınırlı, ölçülü talep (CMK 332).',
          category: 'USUL_BILGISI',
          responses: B(`
- Silme oturumunun kaynağı kayıtta “GSM” görünüyor. 18 Ekim 02.14 itibarıyla o bağlantıya atanan adresin hangi hatta ait olduğunun operatörden sorulmasını talep ediyoruz. Yalnızca o oturum, yalnızca o saat.
ferda: Savcılık olarak katılıyoruz.
kemal: Not edildi.
`),
          next: '$stay',
        }),
        option('R_ZEYIL', 'Sigorta şirketinden siber poliçe ve zeyilnameleri', {
          visibleWhen: flag('nalan_ipucu'),
          maxUses: 1,
          score: { USUL_BILGISI: 50 },
          effects: [raise('zeyil_istendi')],
          good: 'Zarar beyanının dayandığı poliçenin geçmişi, saik ve zarar tartışması bakımından olayla ilgilidir (CMK 177; CMK 332).',
          category: 'USUL_BILGISI',
          responses: B(`
- Katılan şirketin zarar beyanı bir sigorta poliçesine dayanıyor. Sigorta şirketinden poliçenin ve zeyilnamelerinin istenmesini talep ediyoruz.
ozan: Bunun davayla ne ilgisi var?
kemal: Zararı siz beyan ettiniz vekil bey. Zararın dayanağı ilgilidir. Not edildi.
`),
          next: '$stay',
        }),
        option('R_HEPSI', 'Şirketin son bir yıllık bütün yazışmaları', {
          maxUses: 1,
          score: { USUL_BILGISI: -40 },
          effects: [dec('pers')],
          bad: 'Kapsamsız, olayla ilişkisi gösterilmemiş bir talep reddedilir ve mahkemenin diğer taleplere bakışını da zayıflatır.',
          category: 'USUL_BILGISI',
          responses: B(`
kemal: Bir yıllık bütün yazışmalar mı müdafi? Neyi arıyorsunuz, önce onu söyleyin. Talep reddedildi.
`),
          next: '$stay',
        }),
        cont('R_BITIR', 'Taleplerimiz bu kadar', 'H1_05B', { role: 'PRIMARY' }),
      ],
    }),
    court1.stage('H1_05B', {
      title: 'Ara karar',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      lines: [
        W(
          any(flag('bilirkisi_atandi'), flag('dil_bilirkisi')),
          `
kemal: Ara karar: Katılan şirketteki orijinal disklerin muhafaza altına alınmasına; dosyanın bilişim alanında uzman bir bilirkişiye tevdiine; bilirkişinin orijinal disklerden usulüne uygun imaj alarak inceleme yapmasına.
kemal: Savunmanın diğer talepleri yönünden ilgili kurumlara müzekkere yazılmasına. Duruşmanın üç hafta sonraya ertelenmesine.
~ Bir bilirkişi. Bu dosyanın ilk tarafsız gözü.
`,
        ),
        O(`
kemal: Ara karar: Savunmanın talepleri yönünden ilgili kurumlara müzekkere yazılmasına. DataKale raporunun değerinin hükümle birlikte takdirine. Duruşmanın üç hafta sonraya ertelenmesine.
~ Hükümle birlikte takdir. Rapor dosyada kalıyor; bir şirketin mührüyle.
`),
      ],
      choices: [cont('H105B_DEVAM', 'Salondan çık', 'H1_06', { role: 'PRIMARY' })],
    }),
    story('H1_06', {
      ...H1,
      title: 'Koridor',
      background: 'adliye',
      lines: [
        W(
          flag('bulent_coktu'),
          `
# ADLİYE KORİDORU · ÖĞLEDEN ÖNCE [bg:adliye]
> Koridorda Bülent Arıkan, Ozan Tekin’in yanından geçip merdivenlere yürüdü; kimseyle konuşmadan. Ozan Tekin arkasından baktı, sonra telefonunu çıkarıp bir numara aradı; açılmadı.
> Gül, Selim’in koluna girmişti. Selim bana döndü.
selim: İki özet değer. İki. Ben bunu raporu okuduğum ilk gün görmeliydim. Okuyamadım; elim titriyordu.
gul: Bugün bitti mi avukat hanım?
- Bugün bir şey çatladı. Bitmedi.
~ Bir uzman kendi raporunu ilk kez okudu. Bir hâkim bir parmak izinin tutmadığını gördü. Ama bir isim yok. Silmeyi biri yaptı ve o biri hâlâ bir kayıtta “Selim” diye yazıyor.
`,
        ),
        W(
          flag('koridor_umut'),
          `
# ADLİYE KORİDORU · ÖĞLEDEN ÖNCE [bg:adliye]
> Gül çantasından Defne’nin resmini çıkardı, açtı, yeniden katladı.
gul: Bugün kapanır demiştiniz.
> Söylemiştim. Selim karısının elini tuttu ve merdivenlere yürüdüler. Gül bir kez dönüp baktı; kızgın değildi. Yorgundu.
~ Umut vermek ucuzdur. Ödemesini başkası yapar. Bugün o başkası bir öğretmendi.
`,
        ),
        O(`
# ADLİYE KORİDORU · ÖĞLEDEN ÖNCE [bg:adliye]
> Selim pencerenin önünde durdu. Aşağıda adliyenin otoparkı; arabalar birer birer çıkıyordu; sileceklerin ritmi bir saat gibi. Selim hiçbirine bakmadı.
selim: Üç hafta. Üç hafta daha herkes bana “sildin mi” diye bakacak. Komşular, Defne’nin öğretmeni, bakkal.
- Üç hafta sonra kâğıtlar konuşacak.
~ Bunu söylerken sesim benimkinden daha emin çıktı. Avukatlıkta buna “mesleki ses” denir. Ben ona “yalan değil ama” derim.
`),
      ],
      choices: [cont('H106_DEVAM', 'Üç hafta', 'ARA_GIRIS_1', { role: 'PRIMARY' })],
    }),
  ],
  triggers: [
    {
      id: 'tg_cokus',
      priority: 0,
      once: true,
      when: all(flag('in_court'), cmp(v('cred'), '<=', 0)),
      effects: [set('cokus', true)],
      goto: 'T_INT_COKUS',
    },
  ],
};
