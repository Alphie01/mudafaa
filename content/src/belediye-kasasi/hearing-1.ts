import {
  all,
  any,
  atLeast,
  choiceNode,
  cmp,
  cont,
  courtSession,
  dec,
  decisionNode,
  fallback,
  flag,
  flags,
  ground,
  has,
  hl,
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

// 60-hearing-1: 1. celse. Koridor, açılış, sanığın savunması (A–D) ve soruları, teftiş raporu itirazı, müdür
// yardımcısının tanıklığı (telkinli soru itirazı; E1–E5 bastır/sun/itiraz), duruşma içi talepler, ara karar.

export const hearing1: CasePart = {
  variables: flags(
    'in_court',
    'cokus',
    'koridor_durust',
    'koridor_umut',
    'orhan_zarf_acik',
    'orhan_zarf_sakla',
    'orhan_sustu',
    'orhan_yalan',
    'h1_telkin',
    'press_e1',
    'press_e2',
    'press_e3',
    'press_e4',
    'contra_e1',
    'contra_e2',
    'contra_e3',
    'contra_e4',
    'contra_e5',
    'h1_kasa',
    'h1_pdks',
    'h1_ticket',
    'kesif_istendi',
  ),
  config: {
    objectionGrounds: [
      ground('g_telkin', 'Telkin edici, yönlendirici soru', 'CMK 201'),
      ground('g_kanaat', 'Tanığın gözlemi değil kişisel kanaati', 'CMK 217'),
      ground('g_duyum', 'Tanık başkasından duyduğunu aktarıyor; asıl kaynak dinlenmeli', 'CMK 210'),
    ],
  },
  court: {
    sessions: [
      courtSession('cs_1', '1. Celse', [
        ['s1_acilis', 'ACILIS', 'H1_00'],
        ['s1_savunma', 'SANIK_SAVUNMASI', 'H1_01'],
        ['s1_delil', 'DELIL_TARTISMA', 'H1_02'],
        ['s1_tanik', 'TANIK_DINLEME', 'H1_03'],
      ]),
    ],
  },
  nodes: [
    decisionNode('H1_K', [{ to: 'H1_K2' }], {
      ...H1,
      title: 'Koridor',
      onEnter: [raise('in_court')],
      lines: B(`
# 9 ARALIK · 09.15 — BURSA ADLİYESİ, 4. KAT [bg:adliye]
> Adliye koridoru sabah dokuzda bir istasyon gibiydi: cübbeler, dosyalar, bir çocuğun ağlaması, nereden geldiği bilinmeyen bir sigara kokusu.
> Bursa 6. Ağır Ceza’nın kapısında Nazan, Orhan’ın gömlek yakasını düzeltiyordu. Ütülüydü; Nazan yine de düzeltti. Orhan kıpırdamadan bekledi.
> Dinleyici sıralarının önünde Hayri Bey, dizlerinin üstünde ayakkabı kutusuyla oturuyordu. Beni görünce kutuyu kaldırıp selam verdi.
`),
    }),
    decisionNode('H1_K2', [{ to: 'H1_K3' }], {
      lines: [
        W(
          flag('melek_kirgin'),
          `
> Melek koridorun öbür ucundaydı. Beni görünce telefonunu kulağına götürdü; ekran karanlıktı.
~ Çay ocağındaki sesim hâlâ aramızda. Bugün bana bir kelime bile söylemeyecek.
`,
        ),
        O(`
> Melek koridorun öbür ucunda, duvara yaslanmış sakız çiğniyordu. Orhan’la göz göze geldiler; Melek gözlerini kaçırdı.
`),
      ],
    }),
    decisionNode('H1_K3', [{ to: 'H1_K4' }], {
      lines: B(`
> Asansörün kapısı açıldı. Ercan Tunalı; lacivert takım, ütülü mendil, elinde ince bir dosya. Doğruca Orhan’a yürüdü ve elini iki eliyle sıktı.
ercan: Geçmiş olsun Orhan Bey. Elimden ne gelirse. Nazan Hanım, siz de geçmiş olsun. Elif kızımız nasıl?
nazan: İyi. Sağ olun.
> Ercan bana döndü, başını hafifçe eğdi.
ercan: Avukat hanım. Mahkemede görüşürüz efendim. Ne sorarsanız, bildiğim kadarıyla.
`),
    }),
    story('H1_K4', {
      ...H1,
      title: 'Koridor',
      background: 'adliye',
      lines: B(`
> Ercan uzaklaşınca Nazan koluma girdi; sesini alçalttı.
nazan: Bugün biter mi avukat hanım? Elif’e “akşam babanla yemek yeriz” dedim. Biter mi?
`),
      choices: [
        option('H1K_A', '“Bugün bitmeyecek. Ama bugün başlıyor.”', {
          effects: [raise('koridor_durust')],
          responses: B(`
- Bugün bitmeyecek Nazan Hanım. Büyük ihtimalle bir ara karar çıkacak, bir ay sonraya. Ama bugün başlıyor.
nazan: Başlasın. Ben de Elif’e öyle derim. “Başladı” derim.
~ Bir eşe “belki” demek, “evet” demekten zordur. Ama akşam yüzüne bakabilirsin.
`),
          next: 'H1_00',
        }),
        option('H1K_B', '“İnşallah akşam hep beraber yersiniz.”', {
          effects: [raise('koridor_umut')],
          responses: B(`
- İnşallah akşam hep beraber yersiniz.
> Nazan’ın yüzü aydınlandı. Orhan bana baktı; gözlüğünün arkasından, rakam sorar gibi.
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
      onFirstEnter: [meet('baskan'), meet('uye'), meet('savci'), meet('mubasir')],
      lines: B(`
mubasir: Orhan Kılıç dosyası! Taraflar içeri! Orhan Kılıç!
# BURSA 6. AĞIR CEZA MAHKEMESİ — 1. CELSE [bg:durusma_salonu]
> Yüksek tavan, solgun perdeler, kürsünün üstünde yazı: ADALET MÜLKÜN TEMELİDİR. Kalorifer peteği tıkırdıyordu; kâtibin klavyesi de.
baskan: Sanık Orhan Kılıç’ın tutuksuz olarak, müdafii Av. Deniz Arslan’ın hazır olduğu görüldü. Katılan Hisarönü Belediyesi vekili mazeret bildirmiş.
baskan: Açık yargılamaya başlandı. Sanığın kimliği tespit edildi. İddianameyi Cumhuriyet savcısından dinleyelim.
> Savcı Gökhan Ersoy ayağa kalktı. Kırklarının ortasında, kısa saçlı, gözlüklü. Kâğıda baktı; rakamları kâğıttan okumadı, ezberden söyledi.
savci: Sanık 3 Kasım 2025 ile 27 Şubat 2026 arasında 23 ayrı günde, kendi kullanıcı adıyla 47 tahsilat makbuzunu iptal etmiş, 386.400 lirayı zimmetine geçirmiştir.
savci: İptalleri gizlemek için gün sonu raporlarını ve teslim tutanaklarını buna göre düzenlemiştir. Eylem TCK 247/1-2 ve 43 kapsamındadır.
baskan: Sanığa hakları hatırlatıldı: susma hakkı, müdafi yardımı, lehe delil toplanmasını isteme hakkı. Sanık, savunmanızı yapacaksınız.
> Orhan ayağa kalktı. Bana baktı. Konuşmadan önce bir şey bekliyordu; benden.
~ Ne söyleyeceğini ona ben söylemeyeceğim. Ama neyin önemli olduğunu söyleyeceğim. Bunu da şimdi, burada, tek cümleyle.
`),
      choices: [cont('H100_DEVAM', 'Orhan’a eğil', 'H1_01', { role: 'PRIMARY' })],
    }),
    choiceNode('H1_01', {
      ...H1,
      title: 'Sanığın savunması',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
> Orhan’ın kulağına eğildim. Kâtip yazmayı bıraktı, savcı bekledi. Başkan sabırla kalemini çevirdi; bu sabrın bir süresi vardı.
`),
      next: 'H1_01S',
      choices: [
        option('H101_A', '“Zarfı da anlatın. Utandığınızı da.”', {
          visibleWhen: flag('fact_zarf'),
          score: { SAVUNMA_STRATEJISI: 100 },
          effects: [raise('orhan_zarf_acik'), inc('pers')],
          good: 'Müvekkiline ne söyleyeceğini değil, neyin önemli olduğunu söyledin. Zarfı savcıdan önce sanığın kendisi anlatırsa hem güvenilirliği korunur hem kullanıcı adının tek kişiyi göstermediği tutanağa geçer.',
          category: 'SAVUNMA_STRATEJISI',
        }),
        option('H101_B', '“Yalnızca iptalleri inkâr edin; şifreye girmeyin.”', {
          score: { SAVUNMA_STRATEJISI: -40 },
          effects: [raise('orhan_zarf_sakla'), dec('pers')],
          bad: 'Sanığın susma hakkı vardır; ama bildiğin bir gerçeği müvekkiline sakladırmak savunmayı bir gizlemeye çevirir. O gerçeği başka bir tanık söylediğinde sanığın sözü değer kaybeder; heyet kaçamağı şimdiden sezer.',
          category: 'SAVUNMA_STRATEJISI',
        }),
        option('H101_C', '“Susma hakkınızı kullanın.”', {
          effects: [raise('orhan_sustu')],
          neutral:
            'Susma hakkı meşrudur (CMK 147/1-e); ama kayıtların karşısında susan bir sanık, kayıtları konuşmaya bırakır.',
        }),
        option('H101_D', '“Melek Hanım’ın yeni arabasından söz edin.”', {
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('pers'), dec('cred')],
          bad: 'Hiçbir somut dayanağı olmayan bir şüpheyi başka bir çalışana yöneltmek savunma değildir; heyet soğur, iftira riski doğar (TCK 267).',
          category: 'SAVUNMA_STRATEJISI',
        }),
      ],
    }),
    story('H1_01S', {
      ...H1,
      title: 'Sanığın savunması',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: [
        W(
          flag('orhan_zarf_acik'),
          `
orhan: Sayın Başkan. On dokuz yıl vezne memurluğu yaptım. Kırk yedi makbuzun hiçbirini ben iptal etmedim. Üç yüz seksen altı bin dört yüz liranın bir kuruşunu almadım.
orhan: Bir şey daha söyleyeceğim. Utanarak söyleyeceğim. Eylülde, müdürlükten bir not geldi. Şifrelerimizi mühürlü zarfa koyup müdürlüğe vermemiz istendi.
orhan: Ben de verdim. Yönergeyi biliyordum; şifre paylaşılmaz diye. Bile bile verdim. Amirim istedi. Bunun hesabını veririm.
> Salon bir an sustu. Savcı kalemini bıraktı ve not almadan Orhan’a baktı. Üye hâkim bir şey yazdı, altını çizdi.
baskan: Tutanağa geçsin: sanık, şifresini müdürlüğün talimatıyla mühürlü zarfta müdürlüğe teslim ettiğini beyan etti.
~ Utandığı şeyi kendi sesiyle söyledi. Bundan sonra kimse bunu ona karşı ilk kez söyleyemez.
`,
        ),
        W(
          flag('orhan_sustu'),
          `
orhan: Sayın Başkan… Avukatımın tavsiyesiyle… susma hakkımı kullanıyorum.
> Bunu söylerken sesi titredi; on dokuz yıl her sorulana cevap vermiş bir adamın sesi.
baskan: Tutanağa geçsin. Sanık susma hakkını kullandı.
> Savcı başını salladı; hafifçe, bir şeyi onaylar gibi.
~ Susmak bir haktır. Ama heyet, susan bir adamın karşısında kayıtları dinler. Kayıtlar da bir tek isim söylüyor.
`,
        ),
        O(`
orhan: Sayın Başkan. On dokuz yıl vezne memurluğu yaptım. Kırk yedi makbuzun hiçbirini ben iptal etmedim. Üç yüz seksen altı bin dört yüz liranın bir kuruşunu almadım.
orhan: Saat beşte kasayı sayardım, teslim ederdim, beşi on geçe çıkardım. Her akşam. Ben yapmadım efendim.
> Savcı not aldı. Üye hâkim Orhan’a baktı, sonra dosyaya; bir şey arar gibi.
`),
      ],
      choices: [cont('H101S_DEVAM', 'Sanığa sorularım var', 'H1_01Q', { role: 'PRIMARY' })],
    }),
    choiceNode('H1_01Q', {
      ...H1,
      title: 'Sanığa sorular',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
baskan: Müdafi, sanığa sorularınız varsa doğrudan sorabilirsiniz.
~ Ona soracağım her soru heyete bir şey anlatır. Doğru sorular onun akşamlarını kurar; yanlış soru, savcının hikâyesini.
`),
      choices: [
        option('Q_CIKIS', '“İptal saatlerinde neredeydiniz?”', {
          score: { SORGULAMA: 20 },
          responses: B(`
orhan: Evimde efendim. Ya da servisteydim. Beşi on geçe turnikeden çıkardım, servis beş on beşte kalkar. Kartım her akşam okunur.
> Üye hâkim “turnike” kelimesini yazdı.
`),
          next: '$stay',
        }),
        option('Q_DEFTER', '“Kasayı sayınca ne yapardınız?”', {
          visibleWhen: has('ev_defter'),
          score: { SORGULAMA: 40 },
          effects: [inc('pers')],
          good: 'Sanığın, teslimden önceki kasa tutarını bağımsız olarak kaydettiğini heyete duyurdun.',
          category: 'SORGULAMA',
          responses: B(`
orhan: Saydığımı kendi defterime yazardım efendim. On dokuz yıldır. Yirmi üç cilt. Kurşun kalemle, her akşam.
orhan: 12 Şubat: kırk bir bin iki yüz elli lira. Defterimde öyle yazar. Teslim ettiğim para buydu.
> Savcı dosyasındaki tutanağı çevirdi. Kendi rakamına baktı: otuz iki bin sekiz yüz elli. Kaşları bir kez yukarı kalktı.
`),
          next: '$stay',
        }),
        option('Q_9OCAK', '“9 Ocak’ta neredeydiniz?”', {
          visibleWhen: any(flag('fact_9ocak_orhan'), has('clue_izin')),
          score: { SORGULAMA: 40 },
          effects: [inc('pers')],
          good: 'İzinli olduğu bir günü, kayıtla doğrulanabilecek biçimde sanığın ağzından tutanağa geçirttin.',
          category: 'SORGULAMA',
          responses: B(`
orhan: Hastanede efendim. Kızımın kontrolü vardı, Uludağ’da. Yıllık izin aldım. O gün belediyeye hiç girmedim.
baskan: Tutanağa geçsin. Sanık 9 Ocak’ta yıllık izinde olduğunu beyan etti.
> Savcı iptal dökümünü önüne çekti. Parmağını bir satırda durdurdu.
`),
          next: '$stay',
        }),
        option('Q_TESLIM', '“Teslim tutanağını teslim alan ne zaman imzalardı?”', {
          visibleWhen: flag('fact_imza_bos'),
          score: { SORGULAMA: 40 },
          effects: [inc('pers')],
          good: 'Tutanağın teslim anında imzalanmadığını sanığın ağzından tutanağa geçirttin; teslimden sonraki zaman, paranın kimin gözetiminde olduğu sorusunu açar.',
          category: 'SORGULAMA',
          responses: B(`
orhan: Sonra efendim. Torbaları alır, “siz gidin, servisi kaçırmayın, ben sonra imzalarım” derdi. Ben de giderdim.
- Kim?
orhan: Kim müsaitse efendim. Müdürümüz, müdür yardımcımız, bazen vezne sorumlusu. İyilik yapıyorlardı.
> Üye hâkim kalemini bir an havada tuttu. Sonra yazdı.
`),
          next: '$stay',
        }),
        option('Q_KREDI', '“Krediyi neyle kapattınız?”', {
          effects: [inc('pers')],
          visibleWhen: any(flag('fact_kredi'), has('ev_tapu')),
          score: { SORGULAMA: 20 },
          responses: B(`
orhan: Babamdan kalan tarlayı sattım efendim. İnegöl, Tahtaköprü. Parası ertesi gün hesaba geçti, krediyi kapattım. Tapusu bende.
> Savcı bir şey not etti; ilk kez sarı kalemi değil, mavisini kullandı.
`),
          next: '$stay',
        }),
        option('Q_EMIN', '“Şifrenizi kimseye söylemediğinize emin misiniz?”', {
          score: { SORGULAMA: -40 },
          effects: [dec('pers'), raise('orhan_yalan')],
          bad: 'Cevabı müvekkiline zarar verecek bir soruyu açık oturumda sordun; savcının sorması gereken soruyu sen sordun.',
          category: 'SORGULAMA',
          responses: [
            W(
              flag('orhan_zarf_acik'),
              `
orhan/saskin: Az önce söyledim efendim… Zarfa koydum. Müdürlüğe verdim.
> Savcı gülümsedi. Kendi müvekkilime, az önce anlattığı şeyi yeniden söylettim; bu kez benim sorumla, şüpheli bir tonla.
`,
            ),
            O(`
orhan/saskin: Emin… Şifre kişiye özeldir efendim. Ben… eminim.
> Bunu söylerken gözlüğünü çıkardı. Savcı bunu gördü. Ben de gördüm.
~ Bir yalanı kürsüde, yeminsiz ama tutanağa, ben söylettim. Bunun bedelini biri ödeyecek.
`),
          ],
          next: '$stay',
        }),
        cont('Q_BITIR', 'Sorularım bu kadar', 'H1_02', { role: 'PRIMARY' }),
      ],
    }),
    court1.objection('H1_02', {
      title: 'Teftiş raporu',
      courtStage: 'DELIL_TARTISMA',
      background: 'durusma_salonu',
      say: T(`
savci: Sayın Başkan, teftiş raporunun sonuç bölümünü okuyorum: “Açık, veznedar O. Kılıç’ın kullanıcı adıyla yapılan 47 iptalden doğmuştur. Sorumluluk kullanıcı hesabının sahibine aittir.”
savci: Bu, kurumun uzman müfettişinin tespitidir. Başka bir incelemeye gerek görmüyoruz. Rapor hükme esas alınmalıdır.
baskan: Müdafi, rapora diyeceğiniz?
~ Kırk sayfa, tek bir sonuç cümlesi. Heyetin üç kalemi aynı anda durdu; benden bir cümle bekliyorlar.
`),
      next: 'H1_03',
      options: [
        option('H102_A', '“Rapor teknik sütunları incelememiş; bilişim bilirkişisi atansın.”', {
          score: { USUL_BILGISI: 100 },
          effects: [raise('bilirkisi_istendi'), inc('legal_hits'), inc('pers')],
          good: 'Teftiş raporu idari incelemedir; log, terminal ve kimlik doğrulama özel ve teknik bilgi gerektirir. Bilişim bilirkişisi atanması istenir (CMK 63, 67/3; değerlendirme CMK 217).',
          category: 'USUL_BILGISI',
          responses: [
            W(
              flag('dil_verildi'),
              `
- Sayın Başkan, teftiş raporu bir idari incelemedir; bilirkişi raporu değildir. Müfettiş iki sütun okumuş: kullanıcı ve tutar. Terminal, saat, yetki, kimlik doğrulama incelenmemiş.
- Bunlar özel ve teknik bilgi gerektirir. Bilişim bilirkişisi atanmasını talep ediyoruz.
baskan: Talep değerlendirilecek. Raporun belge olarak okunduğu tutanağa geçsin; değeri ayrıca takdir edilecektir.
> Savcı omuz silkti; itirazı yoktu. Üye hâkim “terminal” kelimesinin altını çizdi.
`,
            ),
            O(`
- Sayın Başkan, teftiş raporu bir idari incelemedir; bilirkişi raporu değildir. Müfettiş iki sütun okumuş: kullanıcı ve tutar. Terminal, saat, yetki, kimlik doğrulama incelenmemiş.
- Bunlar özel ve teknik bilgi gerektirir. Bilişim bilirkişisi atanmasını talep ediyoruz.
baskan: Talep ara kararda değerlendirilecek. Rapor belge olarak okundu; değeri mahkemece takdir edilecektir.
> Savcı bir şey diyecekti; demedi. Üye hâkim “terminal” kelimesinin altını çizdi.
`),
          ],
        }),
        option('H102_B', '“Rapor sanık dinlenmeden yazıldı; hukuka aykırı delil olarak dışlansın.”', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred'), dec('pers'), inc('wrong')],
          bad: 'Sanığın idari incelemede dinlenmemesi raporu hukuka aykırı delil yapmaz; rapor belge olarak okunur (CMK 209), değeri CMK 217 ile takdir edilir. Sorun raporun yasaklığı değil, yetersizliğidir.',
          category: 'USUL_BILGISI',
          responses: B(`
baskan: İdari incelemede dinlenmemek raporu yasak delil yapmaz müdafi. Talep reddedildi; rapor okundu.
~ Doğru kapıyı yanlış anahtarla zorladım. Ses salonda yankılandı.
`),
        }),
        option('H102_C', '“Raporun değeri mahkemenin takdirindedir; şimdilik diyeceğimiz yok.”', {
          neutral:
            'Raporun değerini mahkeme takdir eder; ama teknik bir inceleme istemezsen rapor dosyada tek başına kalır.',
          responses: B(`
baskan: Tutanağa geçsin.
~ Doğru bir cümle. Ama doğru cümleler bazen boş kalan bir sandalyeyi doldurmaz.
`),
        }),
        option('H102_D', '“Raporu düzenleyen müfettiş duruşmada tanık sıfatıyla dinlensin.”', {
          score: { USUL_BILGISI: 10 },
          neutral:
            'Müfettiş raporunu anlatabilir; ama raporda incelenmemiş teknik sütunları anlatamaz. Asıl ihtiyaç bilişim bilirkişisidir.',
          responses: B(`
baskan: Talep ara kararda değerlendirilecek.
~ Müfettiş gelir, raporunu okur. Okumadığı sütunları okuyamaz.
`),
        }),
      ],
    }),
    court1.objection('H1_03', {
      title: 'Tanık Ercan Tunalı',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'ercan',
      say: T(`
mubasir: Tanık Ercan Tunalı!
> Ercan kürsüye yürüdü; ceketinin düğmesini ilikledi, mendilini cebine yerleştirdi. Yemin metnini başkanın ardından tane tane okudu.
baskan: Tanık, sanıkla akrabalığınız ya da husumetiniz var mı?
ercan: Yok efendim. On dokuz yıllık mesai arkadaşımdır. Amiriyim.
savci: Tanık, sanık şifresini kimseyle paylaşmazdı, değil mi? Her veznedar gibi?
~ Ercan ağzını açtı. Cevabı tutanağa geçmeden önce bir saniyem var.
`),
      next: 'H1_04',
      options: [
        option('H103_A', 'İtiraz: soru tanığı belirli bir cevaba yönlendiriyor', {
          score: { USUL_BILGISI: 80 },
          effects: [inc('legal_hits'), raise('h1_telkin'), inc('pers')],
          good: 'Cevabı içinde taşıyan, “değil mi” diye biten soru telkin edicidir; tanığın kendi bilgisini değil, sorulanın kanaatini aktarır (CMK 201; değerlendirme CMK 217).',
          category: 'USUL_BILGISI',
          responses: B(`
- İtiraz ediyorum Sayın Başkan. Soru cevabı içinde taşıyor. Tanık bildiğini anlatsın; savcının kanaatini onaylamasın.
baskan: Yerinde. Sayın Savcı, soruyu açık sorun.
savci: Tanık, müdürlükte şifrelerle ilgili bir uygulama var mıydı?
ercan: Şifreler kişiye özeldir efendim. Her veznedarın kendi şifresi. Mevzuat ne diyorsa.
~ Aynı cevap; ama bu kez kendi ağzından, kendi cümlesiyle. Ve tutanakta.
`),
        }),
        option('H103_B', 'Şimdilik itiraz yok; cevabı dinleyip sonra sorarız', {
          neutral: 'Telkin edici soruya itiraz etmedin; tanık savcının cümlesini onayladı.',
          responses: B(`
ercan: Elbette efendim. Paylaşmazdı. Kimse paylaşmaz; mevzuat ortada.
~ “Elbette.” Savcının cümlesi tanığın cümlesi oldu.
`),
        }),
        option('H103_C', 'İtiraz: tanık sanığın amiri, beyanı tarafsız olamaz', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred'), inc('wrong')],
          bad: 'Amir olmak tanıklığa engel değildir; tanığın tarafsızlığı beyanının değerlendirilmesinde gözetilir (CMK 217). Bu bir itiraz dayanağı değil.',
          category: 'USUL_BILGISI',
          responses: B(`
baskan: Amir olması tanıklığına engel değil müdafi. İtiraz reddedildi. Tanık cevap versin.
ercan: Paylaşmazdı efendim.
`),
        }),
        option('H103_D', 'İtiraz: savcı iddianamede olmayan bir konuyu soruyor', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred'), inc('wrong')],
          bad: 'Savcı tanığa doğrudan soru yöneltebilir (CMK 201); “iddianamede yok” bir itiraz dayanağı değildir.',
          category: 'USUL_BILGISI',
          responses: B(`
baskan: Sayın Savcı tanığa soru yöneltebilir müdafi. İtiraz reddedildi.
ercan: Paylaşmazdı efendim.
`),
        }),
      ],
    }),
    court1.testimony('H1_04', {
      title: 'Ercan Tunalı’nın tanıklığı',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'ercan',
      witnessLabel: 'TANIK · ERCAN TUNALI',
      rulesText: 'İpucu: önce bastır, sonra doğru delille göster. Yanlış delil güvenilirliği ve skoru düşürür.',
      objectionGrounds: ['g_telkin', 'g_kanaat', 'g_duyum'],
      say: T(`
baskan: Tanık, bildiklerinizi anlatın.
ercan: Efendim, Orhan Bey’i on dokuz yıldır tanırım. Çalışkan, titiz bir arkadaşımızdır. Bu olay hepimizi üzdü.
ercan: Müfettiş arkadaş raporunu yazdı; ben de savcılıkta bildiklerimi söyledim. Kâğıt neyse odur. Rahmetli babam öyle derdi.
baskan: Müdafi, tanığa sorularınız.
> Ercan ellerini kürsünün kenarına koydu; parmaklarının arasında dolma kalemi yoktu, ama baş parmağı onu arar gibi işaret parmağına sürtündü.
~ Beş cümle kuracak. Her biri kibar, her biri düzgün. Leyla’nın sesi: “Kibarlık bir delil değildir. Kabalık da değildir.”
`),
      statements: [
        statement('E1', 1, [
          'On dokuz yıllık arkadaşımdır. ',
          hl('Kasayı her akşam o kapatırdı', any(flag('press_e1'), has('ded_teslim'))),
          '.',
        ]),
        statement('E2', 2, [
          hl('Saat altıya kadar çıkmazdı', any(flag('press_e2'), has('clue_cikis'), has('ded_baskasi'))),
          '; titizdi, işini bitirmeden gitmezdi.',
        ]),
        statement('E3', 3, [
          'Şifreler kişiye özeldir; ',
          hl('zarf, emanet, öyle bir uygulama bizde yok', any(flag('press_e3'), has('ev_talimat'))),
          '.',
        ]),
        statement('E4', 4, [
          hl('Bütün iptaller onun vezne bilgisayarından yapılmış', any(flag('press_e4'), has('clue_terminal'))),
          '; bilgi işlem öyle söyledi.',
        ]),
        statement(
          'E5',
          5,
          [
            'Son aylarda ',
            hl('borç sıkıntısı vardı, krediyi bir anda kapattı', has('ded_kredi')),
            '; insan sıkışınca ne yapacağını bilemez.',
          ],
          flag('press_e2'),
        ),
      ],
      rules: [
        pressRule('PR_E1', 'E1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_e1')],
          responses: B(`
- Kasayı “kapatmak” ne demek? Tam olarak ne yapardı?
ercan: Sayar efendim, gün sonu raporunu basar, torbaları mühürler. Tutanağı doldurur. Sonra torbaları müdürlükten kim varsa ona teslim eder; o kasa odasına koyar.
- Siz de teslim alır mıydınız?
ercan: Müsait olduğumda efendim. Selim Bey de alırdı, müdürümüz de. Usul böyle.
~ Usul böyle. Torbaların son durağı kasa odası değil; önce bir insanın elleri. Hangi akşam kimin?
`),
        }),
        pressRule('PR_E2', 'E2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_e2')],
          responses: B(`
- Saat altıya kadar mı? Her akşam?
ercan: Genellikle efendim. Titiz bir arkadaştır; masasını toplamadan, hesabı kapatmadan çıkmazdı. Bir de… söylemek istemezdim ama son aylarda biraz dalgındı.
- Neden dalgındı?
ercan: Borç efendim. Herkes biliyordu.
~ Bir cümle daha geldi. Sorulmadan. Kimin kâğıdını okuyor?
`),
        }),
        pressRule('PR_E3', 'E3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_e3')],
          responses: [
            W(
              has('ev_talimat'),
              `
- Hiçbir veznedar şifresini müdürlüğe bırakmadı mı? Devamlılık için bile?
ercan: Bırakmadı efendim. Yönerge ortada. Ben de bırakılmasına izin vermezdim; biz denetim birimiyiz.
~ “İzin vermezdim.” Bir kural, kendisini koruyan adamın ağzında. Kâğıt cebimde.
`,
            ),
            O(`
- Hiçbir veznedar şifresini müdürlüğe bırakmadı mı? Devamlılık için bile?
ercan: Bırakmadı efendim. Yönerge ortada. Ben de bırakılmasına izin vermezdim; biz denetim birimiyiz.
~ “İzin vermezdim.” Kendinden emin bir ret. Elimde onu sınayacak bir kâğıt yok.
`),
          ],
        }),
        pressRule('PR_E4', 'E4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_e4')],
          responses: B(`
- Vezne bilgisayarından olduğunu nereden biliyorsunuz?
ercan: Bilgi işlem öyle söyledi efendim. Vezne programına yalnızca vezne terminalinden girilir. Bize böyle anlatıldı.
- Kim anlattı?
ercan: Bilgi işlem efendim. Teknik arkadaşlar. Ben teknik adam değilim; maliyeciyim.
`),
        }),
        presentRule('PS_E2', 'E2', ['ded_baskasi', 'ev_pdks'], {
          enabledWhen: any(has('ded_baskasi'), has('clue_cikis')),
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_e2')],
          good: 'Turnike kayıtları: sanık iptal günlerinin hepsinde 17.10’dan önce binadan çıkmış. Tanığın “altıya kadar çıkmazdı” beyanı kayıtla çelişiyor.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, sanığın turnike dökümü. İptal günlerinin yirmi üçünde de en geç 17.09’da çıkış. En erken iptal 17.38’de.
- Tanık, sanık saat altıya kadar çıkmazdı dediniz. Kayıt, beşi on geçmeden çıktığını söylüyor.
> Ercan dökümün fotokopisine baktı. Uzun uzun değil; bir muhasebecinin tabloya baktığı kadar.
ercan: Yanlış hatırlamışım efendim. Kusura bakmayın. Yaş.
> Üye hâkim kalemini bıraktı ve ilk kez tanığa doğrudan baktı.
uye: Tanık, siz kaçta çıkardınız?
ercan: Ben mi efendim? Mesai bitince. Değişirdi.
~ Değişirdi. Bu cevabı not ettim; bir gün o da bir kâğıtla karşılaşacak.
`),
        }),
        presentRule('PS_E3', 'E3', ['ev_talimat', 'ded_zarf'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_e3')],
          good: 'El yazısı not: veznedarlardan şifrelerini mühürlü zarfta müdürlüğe bırakmaları istenmiş. “Öyle bir uygulama yok” beyanı belgeyle çelişiyor; kullanıcı adı tek kişiyi göstermiyor.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, sanığın evrakı arasından çıkan el yazısı bir not. Eylül 2025. “Şifreler zarfta, müdürlükte kalacak. Devamlılık için. — Müdürlük.” İmza yok.
- Tanık, zarf uygulaması yok dediniz.
> Ercan notu iki parmağıyla tuttu; tıpkı Orhan’ın Hayri Bey’in makbuzunu tuttuğu gibi. Okudu. Yüzünde hiçbir şey kıpırdamadı.
ercan: Bu not… Bu benim yazım değil efendim. Müdürlükte bir arkadaş yazmış olabilir. İyi niyetle; devamlılık için.
uye: Tanık, müdürlükte veznedarlara böyle bir talimatı kim verebilir?
ercan: Müdür ya da müdür yardımcısı efendim. Müdürümüz eylülde görevdeydi. Ben böyle bir talimat vermedim. Verilmişse yönergeye aykırıdır.
> Savcı not aldı. Bu kez sarı kalemle değil.
~ Kapıyı kapatmadı. Kapıyı başkasına gösterdi. Kibarca.
`),
        }),
        presentRule('PS_E4', 'E4', ['ded_baskasi', 'ev_dokum'], {
          enabledWhen: any(has('ded_baskasi'), has('clue_terminal')),
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_e4')],
          good: 'İptal kayıtlarının terminal sütunu: 47 iptalin hepsi ön odadaki MHM-PC03’ten; hiçbiri Vezne 2 terminalinden değil. Tanığın beyanı savcılığın kendi delilinin satırlarıyla çelişiyor.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, savcılığın kendi delili: iptal kayıtları. Terminal sütunu. Kırk yedi satırın kırk yedisinde: MHM-PC03. Vezne 2’nin terminali VZ-02.
- Tanık, MHM-PC03 nerededir?
ercan: Ön oda efendim. Ortak bilgisayar. Herkes kullanır; yazıcı ona bağlı.
- Vezne programı o bilgisayarda açık mı?
ercan: Bilmiyorum efendim. Ben teknik adam değilim. Bilgi işlem öyle söylemişti. Yanılmışlarsa… yanılmışlar.
> Savcı iptal dökümünü önüne çekti; sütunları parmağıyla saydı. Teftiş raporunun özetine baktı, sonra yine döküme.
~ Savcı kendi delilini ilk kez okuyor. Bu dosyada herkes bir şeyi ilk kez okuyor.
`),
        }),
        presentRule('PS_E1', 'E1', ['ded_teslim', 'ev_karbon'], {
          enabledWhen: any(has('ded_teslim'), has('clue_tutar_fark')),
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_e1')],
          good: 'Karbon kopya ve defter: sanık kasayı eksiksiz teslim etmiş; dosyadaki asıl, teslimden sonra düşük tutarla düzenlenmiş. Para teslimden sonra teslim alanın gözetimindeydi.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, 12 Şubat teslim tutanağının sanıkta kalan karbon nüshası: 41.250 lira. Sanığın kasa defteri: 41.250 lira. Dosyadaki asıl: 32.850 lira.
- Tanık, kasayı sanık kapatır, size teslim ederdi dediniz. Teslim ettiği tutar hangisi?
ercan: Tutanakta ne yazıyorsa o efendim. Dosyadaki asıl. Karbon kopyalar bazen silik çıkar; yanlış okunur.
uye: Kırk bir bin, otuz iki bin olarak mı yanlış okunur tanık?
ercan: Bilemem efendim. O akşam torbaları kim aldıysa paraf onundur.
- 12 Şubat akşamı torbaları kim aldı?
ercan: Hatırlamıyorum efendim. Ben ya da Selim Bey. Kayıtlara bakmak lazım; kâğıt neyse odur.
~ Karbon nüshada teslim alan kutusu boş; asılda adsız bir paraf. İki isim, bir akşam. Bunu bir insanın hafızası değil, bir kapının kaydı ayıracak.
`),
        }),
        presentRule('PS_E5', 'E5', ['ded_kredi', 'ev_tapu'], {
          enabledWhen: any(has('ded_kredi'), has('clue_tapu')),
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_e5')],
          good: 'Tapu satışı ve havale: kredi miras tarlanın bedeliyle kapandı. Tanığın ima ettiği “sıkışma” belgeyle karşılanmadı.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, tapu satış senedi: 17 Aralık, 215.000 lira. Ertesi sabah aynı tutar sanığın hesabına girmiş, iki saat sonra kredi kapanmış. Kaynak, babadan kalan tarla.
- Tanık, sanığın sıkıştığını söylediniz. Sıkışan bir adam babasının tarlasını satıp borcunu kapatır mı, kasadan mı alır?
ercan: Ben bilmiyordum efendim. Söylemek istemezdim zaten. Herkes konuşuyordu; ben de duyduğumu söyledim.
~ “Herkes konuşuyordu.” Kim başlattı bu konuşmayı?
`),
        }),
        objectRule('OB_E5', 'E5', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [inc('pers'), inc('legal_hits')],
          good: 'İtiraz yerinde: “insan sıkışınca ne yapacağını bilemez” bir gözlem değil, kanaattir; tanık hüküm kuramaz (CMK 217).',
          category: 'SORGULAMA',
          responses: B(`
- İtiraz ediyorum Sayın Başkan. “İnsan sıkışınca ne yapacağını bilemez” bir gözlem değil, kanaat.
baskan: Yerinde. Tanık, yalnızca bildiklerinizi anlatın. Bu cümle tutanağa geçmeyecek.
ercan: Haklısınız efendim. Kusura bakmayın; ağzımdan çıktı.
`),
        }),
        objectRule('OB_E4', 'E4', 'g_duyum', {
          score: { SORGULAMA: 40 },
          effects: [inc('pers')],
          good: 'İtiraz yerinde: tanık teknik bir hususu başkasından duyduğu kadarıyla aktarıyor; asıl kaynağın, gerekirse bilirkişinin dinlenmesi gerekir (CMK 210 doğrudanlık; CMK 63).',
          category: 'SORGULAMA',
          responses: B(`
- İtiraz ediyorum Sayın Başkan. Tanık teknik bir hususu bilgi işlemden duyduğu kadarıyla aktarıyor. Bu, onun gözlemi değil.
baskan: Not edildi. Tanığın bu beyanının duyuma dayandığı tutanağa geçsin. Teknik husus gerekirse uzmanından sorulacak.
`),
        }),
        presentRule('PS_E2_IZIN', 'E2', ['ded_izin'], {
          score: { SORGULAMA: 150 },
          effects: [inc('pers')],
          good: 'İzin günü: sanık 9 Ocak’ta hiç işe gelmemiş; o akşam da kullanıcısıyla iptal var. “Altıya kadar çıkmazdı” beyanı bir günde bile tutmuyor.',
          category: 'SORGULAMA',
          responses: B(`
- Tanık, 9 Ocak’ta sanık yıllık izindeydi; turnikede giriş bile yok. Aynı akşam 17.46’da onun kullanıcısıyla iki iptal yapılmış. O akşam da altıya kadar mı kaldı?
ercan: İzinde olduğunu bilmiyordum efendim. İzinleri müdürlük onaylar; ben onaylamış olabilirim. Hatırlamıyorum.
`),
        }),
        presentRule('PS_E1_DEFTER', 'E1', ['ev_defter'], {
          score: { SORGULAMA: 100 },
          neutral:
            'Kısmi isabet: defter sanığın saydığı tutarı gösterir; ama tutanakla karşılaştırılmadıkça teslimden sonraki eksilmeyi tek başına kanıtlamaz.',
          responses: B(`
- Sanığın kendi kasa defteri. Her akşamın toplamı, kurşun kalemle.
ercan: Kişisel bir defter efendim. Resmî kayıt tutanaktır. Kâğıt neyse odur.
~ Bir defter bir tutanağın karşısında tek başına zayıf durur. İkinci bir nüsha lazımdı.
`),
        }),
        presentRule('PS_E3_YONERGE', 'E3', ['ev_yonerge'], {
          neutral:
            'Yönerge kuralı söyler; kuralın çiğnenip çiğnenmediğini söylemez. Tanığın beyanıyla çelişmiyor, aksine onu destekliyor.',
          responses: B(`
ercan: Evet efendim. Yönerge bu. Ben de bunu söylüyorum. Teşekkür ederim.
~ Tanığa kendi kalkanını uzattım.
`),
        }),
        presentRule('PS_E_MAKBUZ', undefined, ['ev_makbuz'], {
          neutral: 'Makbuz iptalin varlığını gösterir; kimin yaptığını göstermez.',
          responses: B(`
ercan: Hayri Bey’in makbuzu efendim. Ben kendisine çay da ikram etmiştim. Üzücü bir olay.
`),
        }),
        presentRule('PS_SAVCILIK', undefined, ['ev_teftis', 'ev_tutanak', 'ev_banka', 'ev_ercan_ifade'], {
          maxUses: 10,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'Savcılığın delilini savcılığın tanığına gösterdin; hiçbir çelişki ortaya koymadı. −1 güvenilirlik, −150 skor.',
          category: 'SORGULAMA',
          responses: B(`
savci: Sayın Başkan, müdafi bizim delilimizi bizim tanığımıza okuyor. Teşekkür ederiz.
~ Kendi kalemime kendim mürekkep döktüm.
`),
        }),
        presentRule('PS_DOKUM_X', undefined, ['ev_dokum'], {
          maxUses: 5,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'Dökümü gösterdin ama içinde neyi göstereceğini bilmiyordun; çelişkiyi önce dökümde bul.',
          category: 'SORGULAMA',
          responses: B(`
ercan: Evet efendim, iptal kayıtları. Orhan Bey’in kullanıcısı. Ne sormak istersiniz?
baskan: Müdafi, dökümün hangi kısmı bu beyanla çelişiyor?
~ Bilmiyordum. Okuduğum bir kâğıdı, okumadığım bir yerden açmıştım.
`),
        }),
      ],
      presentMiss: fallback('FB_H1_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil: −1 güvenilirlik, −150 skor.', category: 'SORGULAMA' },
        responses: B(`
baskan: Bu delilin beyanla ilgisini göremedim müdafi.
~ Yanlış kapıya vurdum. Ses salonda yankılandı.
`),
      }),
      objectMiss: fallback('FB_H1_OBJECT', 'OBJECT', {
        effects: [dec('cred'), inc('wrong'), score('SORGULAMA', -50, 'hatali')],
        quality: { q: 'BAD', feedback: 'Dayanaksız itiraz.', category: 'SORGULAMA' },
        responses: B(`
baskan: İtiraz reddedildi. Dayanağı yok.
`),
      }),
      finish: { id: 'H104_BITIR', next: 'H1_04K' },
    }),
    story('H1_04K', {
      ...H1,
      title: 'Tanık kürsüden iner',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: [
        W(
          atLeast(2, flag('contra_e2'), flag('contra_e3'), flag('contra_e4')),
          `
baskan: Tanığın dinlenmesi tamamlandı. Tanık, yerinize geçebilirsiniz.
> Ercan kürsüden indi. Ceketinin düğmesini çözdü, dinleyici sırasına oturdu. Yüzünde bir şey yoktu; ne öfke ne utanç. Yalnızca dikkat.
> Salonun arkasında Melek’in sakızı durmuştu. Hayri Bey ayakkabı kutusunun kapağını açıp kapattı.
savci: Sayın Başkan… tanığın beyanlarıyla dosyadaki kayıtlar arasında bazı tutarsızlıklar olduğu anlaşılıyor. Savcılık olarak bunların açıklığa kavuşmasını isteriz.
~ Savcı Gökhan Ersoy rakamlarla konuşur. Bugün rakamlar ona başka bir şey söyledi; o da duydu.
`,
        ),
        O(`
baskan: Tanığın dinlenmesi tamamlandı. Tanık, yerinize geçebilirsiniz.
> Ercan kürsüden indi, Orhan’ın önünden geçerken ona başıyla selam verdi. Orhan da verdi; refleksle, on dokuz yılın alışkanlığıyla.
savci: Sayın Başkan, tanık beyanı teftiş raporuyla örtüşmektedir. Savcılığın ek sorusu yok.
~ Kibar bir tanık, düzgün bir rapor, tek bir isim. Bugün kâğıtlarımı ya bulamadım ya doğru yerde açamadım.
`),
      ],
      choices: [cont('H104K_DEVAM', 'Talepler', 'H1_05', { role: 'PRIMARY' })],
    }),
    choiceNode('H1_05', {
      ...H1,
      title: 'Duruşma içi talepler',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: [
        W(
          flag('dil_verildi'),
          `
baskan: Müdafiin dilekçesindeki talepler değerlendirilecek. Ayrıca bir talebiniz var mı?
~ Dilekçede olmayanları şimdi isteyebilirim. Mahkeme “neden şimdi” diye sorabilir; cevabım hazır olmalı.
`,
        ),
        O(`
baskan: Müdafi, delil talepleriniz?
~ Dilekçe vermedim. Her şeyi şimdi, gerekçesiyle istemeliyim. Mahkeme geç talebi geri çevirmez; ama neyi neden istediğimi sorar.
`),
      ],
      choices: [
        option('H105_BILIRKISI', 'Bilişim bilirkişisi atansın', {
          visibleWhen: not(flag('bilirkisi_istendi')),
          score: { USUL_BILGISI: 40 },
          effects: [raise('bilirkisi_istendi')],
          good: 'Teknik sütunlar (terminal, yetki, kimlik doğrulama) için bilirkişi talebi; geç de olsa ilgili ve elde edilebilir (CMK 63, 206).',
          category: 'USUL_BILGISI',
          responses: B(`
- Sayın Başkan, iptal kayıtlarının terminal, yetki ve kimlik doğrulama yönünden incelenmesi için bilişim bilirkişisi atanmasını talep ediyoruz.
baskan: Not edildi.
`),
          next: '$stay',
        }),
        option('H105_KASA', 'Kasa odası alarm kayıtları istensin', {
          visibleWhen: all(flag('fact_kasa_kod'), not(flag('dil_kasa'))),
          score: { USUL_BILGISI: 40 },
          effects: [raise('dil_kasa'), raise('h1_kasa')],
          good: 'Paranın kasadan hangi kodla, ne zaman alındığını gösterecek kayıt; ilgili ve elde edilebilir (CMK 206).',
          category: 'USUL_BILGISI',
          responses: B(`
- Kasa odasının alarm paneli kayıtlarının güvenlik firmasından istenmesini talep ediyoruz; iptal akşamlarında kasanın hangi kodla açıldığını gösterecektir.
baskan: Not edildi.
`),
          next: '$stay',
        }),
        option('H105_PDKS', 'Müdürlük personelinin turnike kayıtları istensin', {
          visibleWhen: all(any(flag('fact_turnike'), has('clue_cikis')), not(flag('dil_pdks'))),
          score: { USUL_BILGISI: 40 },
          effects: [raise('dil_pdks'), raise('h1_pdks')],
          good: 'İptal saatlerinde binada kimin bulunduğunu gösterecek kayıt (CMK 206).',
          category: 'USUL_BILGISI',
          responses: B(`
- İptal günlerinde Mali Hizmetler personelinin turnike kayıtlarının istenmesini talep ediyoruz.
baskan: Not edildi.
`),
          next: '$stay',
        }),
        option('H105_TICKET', 'Bilgi işlem destek talepleri istensin', {
          visibleWhen: all(flag('fact_14ocak'), not(flag('dil_ticket'))),
          score: { USUL_BILGISI: 40 },
          effects: [raise('dil_ticket'), raise('h1_ticket')],
          good: 'Sanığın şifresinin kimin talebiyle sıfırlandığını gösterecek kayıt (CMK 206).',
          category: 'USUL_BILGISI',
          responses: B(`
- Ocak ayında sanığın kullanıcısına ait şifre sıfırlama taleplerinin bilgi işlemden istenmesini talep ediyoruz.
baskan: Not edildi.
`),
          next: '$stay',
        }),
        option('H105_KESIF', 'Ön odada bilirkişi eşliğinde keşif yapılsın', {
          visibleWhen: all(flag('bilirkisi_istendi'), not(flag('kesif_istendi'))),
          score: { USUL_BILGISI: 40 },
          effects: [raise('kesif_istendi')],
          good: 'İptallerin yapıldığı bilgisayarın yeri, erişimi ve kasa odasıyla ilişkisi ancak yerinde görülebilir; mahkemeden bilirkişi eşliğinde keşif istenir (CMK 83, 63).',
          category: 'USUL_BILGISI',
          responses: B(`
- Sayın Başkan, iptallerin yapıldığı bilgisayarın bulunduğu ön odada, iptal saatinde ve bilirkişi eşliğinde keşif yapılmasını talep ediyoruz. Odanın düzeni ve kasa odasıyla bağlantısı ancak yerinde görülebilir.
baskan: Not edildi.
`),
          next: '$stay',
        }),
        option('H105_TUTUKLA', 'Tanık hakkında işlem yapılsın', {
          visibleWhen: flag('contra_e3'),
          score: { USUL_BILGISI: -40 },
          effects: [dec('pers')],
          bad: 'Tanığın çelişkili beyanı tek başına bir suç isnadı değildir; mahkemeden tanık hakkında işlem istemek yerine somut delillerle savcılığa başvurulur (CMK 158).',
          category: 'USUL_BILGISI',
          responses: B(`
- Sayın Başkan, tanığın gerçeğe aykırı beyanı nedeniyle hakkında işlem yapılmasını talep ediyoruz.
baskan: Tanık beyanının değerlendirmesi hükümde yapılır müdafi. Talebiniz bu aşamada yerinde değil.
~ Bir kibarlığı kürsüden indirmeye çalıştım. Kibarlık kürsüde kaldı; ben düştüm.
`),
          next: '$stay',
        }),
        cont('H105_BITIR', 'Taleplerimiz bu kadar', 'H1_ARA', { role: 'PRIMARY' }),
      ],
    }),
    court1.stage('H1_ARA', {
      title: 'Ara karar',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      lines: [
        W(
          all(flag('bilirkisi_istendi'), flag('kesif_istendi')),
          `
> Heyet kısa bir müzakere için kalktı. Sekiz dakika. Kalorifer peteği tıkırdadı, kâtip parmaklarını ovuşturdu.
baskan: Ara karar: Vezne programının işlem günlüğü, kullanıcı yetkileri, terminal kısıtlamaları ve kimlik doğrulama yönünden incelenmesi için bilişim bilirkişisi Dr. Seda Karaca’nın atanmasına;
baskan: Mali Hizmetler Müdürlüğü ön odasında, iptal saatinde, bilirkişi eşliğinde keşif yapılmasına; kabul edilen delil talepleri yönünden müzekkere yazılmasına;
baskan: Adli kontrolün devamına; duruşmanın bir ay sonraya ertelenmesine.
~ Bir ay. Bir bilirkişi, bir keşif ve birkaç müzekkere. Kâğıtlar yola çıktı; bir gün de ben o odaya gireceğim.
`,
        ),
        W(
          flag('bilirkisi_istendi'),
          `
> Heyet kısa bir müzakere için kalktı. Altı dakika. Kalorifer peteği tıkırdadı, kâtip parmaklarını ovuşturdu.
baskan: Ara karar: Vezne programının işlem günlüğü, kullanıcı yetkileri, terminal kısıtlamaları ve kimlik doğrulama yönünden incelenmesi için bilişim bilirkişisi Dr. Seda Karaca’nın atanmasına;
baskan: Müdafiin kabul edilen delil talepleri yönünden ilgili kurumlara müzekkere yazılmasına; sanık hakkındaki adli kontrolün devamına; duruşmanın bir ay sonraya ertelenmesine.
~ Bir ay. Bir bilirkişi. Ve birkaç müzekkere. Kâğıtlar yola çıktı.
`,
        ),
        O(`
> Heyet kısa bir müzakere için kalktı. Dört dakika.
baskan: Ara karar: Müdafiin kabul edilen delil talepleri yönünden ilgili kurumlara müzekkere yazılmasına; sanık hakkındaki adli kontrolün devamına; duruşmanın bir ay sonraya ertelenmesine.
~ Bilirkişi yok. Teftiş raporu dosyada tek başına duruyor; iki sütun, bir isim.
`),
      ],
      choices: [cont('H1ARA_DEVAM', 'Salondan çık', 'H1_06', { role: 'PRIMARY' })],
    }),
    story('H1_06', {
      ...H1,
      title: 'Koridor',
      background: 'adliye',
      onEnter: [set('in_court', false)],
      lines: [
        W(
          flag('koridor_umut'),
          `
# ADLİYE KORİDORU · ÖĞLEDEN ÖNCE [bg:adliye]
> Nazan koridorda bekliyordu. “Ertelendi” kelimesini benden önce kâtipten duymuştu.
nazan: Akşam beraber yeriz dediniz. Bir ay sonra mı yiyeceğiz?
> Orhan karısının koluna dokundu. “Nazan” dedi; yalnızca bu. Nazan sustu ama bana bakmayı bırakmadı.
~ Umut vermek ucuzdur. Ödemesini başkası yapar. Bugün o başkası Nazan’dı.
`,
        ),
        O(`
# ADLİYE KORİDORU · ÖĞLEDEN ÖNCE [bg:adliye]
> Nazan koridorda bekliyordu. “Başladı mı?” diye sordu. “Başladı” dedim. Başını salladı ve Orhan’ın koluna girdi.
`),
      ],
      choices: [cont('H106_DEVAM', 'Asansöre yürü', 'H1_07', { role: 'PRIMARY' })],
    }),
    decisionNode('H1_08G', [{ to: 'H1_08' }], {
      ...H1,
      title: 'Akşam',
      lines: [
        W(
          atLeast(2, flag('contra_e2'), flag('contra_e3'), flag('contra_e4')),
          `
# AKŞAM 20.10 — ARSLAN HUKUK [bg:buro_gece]
> Leyla tutanağın fotokopisini okuyordu; kırmızı kalemle değil, kurşun kalemle. Kurşun kalem Leyla’da bir övgüdür: silinebilir, demek ki düzeltilecek bir şey yok.
leyla: Üç kâğıt, üç cümle. Adam üçünde de “yanlış hatırlamışım” dedi. Bir insan bir günde üç kez yanlış hatırlarsa, ya çok yorgundur ya çok dikkatlidir.
leyla: Hangisi olduğunu sen söyleme. Kâğıtlar söylesin.
`,
        ),
        W(
          flag('h1_telkin'),
          `
# AKŞAM 20.10 — ARSLAN HUKUK [bg:buro_gece]
> Leyla tutanağı okudu, bir yerde durdu: savcının “değil mi” diye biten sorusu.
leyla: O itiraz iyiydi. Küçük görünür; ama bir tanığın kendi cümlesini kurmasını sağladın. Kendi cümlesini kuran tanık, o cümlenin altında kalır.
`,
        ),
        O(`
# AKŞAM 20.10 — ARSLAN HUKUK [bg:buro_gece]
> Leyla tutanağı okudu, bir şey demeden bıraktı. Pencereden aşağı baktı; yağmur, otobüs, bir simitçinin naylonu.
leyla: Bir celse kaybedilmez Deniz. Bir celse yalnızca bir şey öğretir. Bugün ne öğrendin?
`),
      ],
    }),
    story('H1_08', {
      ...H1,
      title: 'Akşam',
      background: 'buro_gece',
      lines: [
        W(
          any(flag('h1_kasa'), flag('h1_pdks'), flag('h1_ticket')),
          `
leyla: Taleplerin bir kısmını kürsüde, son anda istedin. Mahkeme kabul etti; bu sefer. Her sefer etmez. Dilekçe, kürsüde nefes nefese kalmamak içindir.
leyla: Şimdi bir ay var. Cevaplar gelecek, bilirkişi çalışacak, insanlar seni arayacak. Herkes bir şey söyleyecek; bazıları seni bir yere götürmek için.
~ Leyla’nın her cümlesi bir uyarı. Hangisinin kime dair olduğunu söylemiyor.
`,
        ),
        O(`
leyla: Şimdi bir ay var. Cevaplar gelecek, bilirkişi çalışacak, insanlar seni arayacak. Herkes bir şey söyleyecek; bazıları seni bir yere götürmek için.
leyla: Müvekkilinin karısı evi satmak istiyor. Bir tanığın asansörde sana söylediği bir cümle var. Bir de kasa. Kasanın kendisi. Unutma: para orada bir gece kaldı. O gece kasa kimdeydi?
~ Leyla’nın her cümlesi bir uyarı. Hangisinin kime dair olduğunu söylemiyor.
`),
      ],
      choices: [
        option('H108_A', '“Bugün kayıtların ne söylediğini değil, kimin okumadığını öğrendim.”', {
          responses: B(`
leyla: Güzel. Okumayan çoktur. Savcı okumadı, müfettiş okumadı, sen de ilk gece okumadın. Okumak bir karar meselesidir; korkuyla değil.
> Sigara paketini avucunda çevirdi. Bir kez. Sonra masaya bıraktı; ters çevirmeden.
`),
          next: 'ARA_GIRIS_1',
        }),
        option('H108_B', '“Kibar bir tanığın nasıl sustuğunu öğrendim.”', {
          effects: [inc('trust', 2)],
          responses: B(`
leyla: Henüz susmadı Deniz. Kibar insanlar kolay susmaz; çünkü konuşmayı bir iş gibi yaparlar. Bir iş gibi de bırakırlar: sırası gelince, düzgünce.
leyla: Sen ona sırayı getirmeye çalışma. Kâğıtları getir. Sıra kendiliğinden gelir.
`),
          next: 'ARA_GIRIS_1',
        }),
      ],
    }),
    story('H1_07', {
      ...H1,
      title: 'Asansör',
      background: 'adliye',
      lines: B(`
> Asansörün önünde Ercan Tunalı bekliyordu. Kapı açıldı; bana yol verdi. “Buyurun efendim.”
> İkimiz bindik. Kapı kapandı. Dördüncü kattan zemine kadar ne o konuştu ne ben. Aynada yüzü sakindi; elleri ceplerindeydi.
> Zemin katta kapı açıldı. Önce beni çıkardı. Sonra başını hafifçe eğdi; bir selam, bir teşekkür ya da bir şey daha. Anlamını çıkaramadım.
ercan: İyi günler avukat hanım. Bir ay çabuk geçer.
~ Bir ay çabuk geçer. Bir tehdit değil. Bir hatırlatma bile değil. Bir müdür yardımcısının takvim bilgisi.
~ Yine de bütün gün kulağımda kaldı.
`),
      choices: [cont('H107_DEVAM', 'Büroya dön', 'H1_08G', { role: 'PRIMARY' })],
    }),
  ],
  triggers: [
    {
      id: 'tg_cokus',
      priority: 0,
      once: true,
      when: all(flag('in_court'), cmp(v('cred'), '<=', 0)),
      effects: [set('cokus', true)],
      goto: 'T_COKUS',
    },
  ],
};
