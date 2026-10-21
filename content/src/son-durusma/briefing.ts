import { cont, meet, option, raise, set, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, T } from './dsl.js';
import { C1, INV, PRO, p1 } from './shared.js';

// 40-briefing: soğuk açılış, gözaltı, Kemal’in büroya gelişi, Leyla’nın devri, ceza aralığı, yirmi iki yıl önceki
// dosya, dosya ekranı ve strateji, Mudanya’da ilk sabah.

const PR00 = T(`
# 14 KASIM · GECE — MUDANYA İSKELESİ [bg:liman_gece]
> Mudanya’da deniz gece de çalışır. Dalgalar iskelenin ayaklarına vurur, çekilir, yeniden vurur; kıyıya ne getirdiğini sabah görürsün.
> İskelenin ucundaki lambalardan ikisi yanıyordu. Üçüncüsü rüzgârda sallanıyor, ışığı denize bir düşüp bir kalkıyordu.
> Balıkçı barınağının yanındaki meyhanenin neonu yağmurda kırmızı titriyordu: TOKER BAL K. I harfi aylardır yanmıyordu. Kimse yaptırmamıştı.
> Kapının önünde nişan masasından kalmış balonlar, ıslak bir kaldırıma bağlı. Biri patlamış. Ötekiler rüzgârda birbirine sürtünüyor.
> İçeride son sandalyeler masalara kaldırılmıştı. Mutfakta bulaşık suyu akıyor, bir radyo alçak sesle eski bir şarkı söylüyordu.
> Bir rafın üstünde küçük bir cihazın kırmızı ışığı yanıyordu; yağmurlu camda ikinci bir kırmızı nokta gibi.
> Mutfaktan ofise uzanan dar koridorda bir kapı kapalıydı. Kapının altından sarı bir ışık sızıyordu.
@BİR ADAM: Otur. Lütfen otur. Sana anlatmam gereken bir şey var; yirmi iki yıldır taşıyorum.
> Bir sessizlik. Bir sandalye çekildi. Radyo şarkıyı bitirdi, reklama geçti.
@BİR ADAM: …o gece o dolap benimdi. Babanın hiçbir şeyi yoktu orada. Hiçbir şeyi.
@GENÇ BİR SES: Ne diyorsun sen? Ne diyorsun?
> Bir şey masaya çarptı. Bir bardak devrildi, yuvarlandı, düşmedi.
@GENÇ BİR SES: Babamın hayatını çaldın! Yirmi iki yıl! Babamın hayatını çaldın! {shake}
@BİR ADAM: Haklısın. Haklısın. Al şunu… babana ver. Ben yazdım, hepsini yazdım…
@GENÇ BİR SES: Kendin ver! Kendin ver ona!
> Kapı açıldı ve koridorun duvarına çarptı. Ayak sesleri mutfağın içinden geçti; bir tezgâhın kenarına çarpan bir kalça, düşen bir kepçe.
> Arka kapı. Yağmur. Çöp kovalarının yanında bir sigaranın kor ucu bir an parladı, söndü.
> Biri iskeleye doğru koşuyordu. Elleri ceplerinde, başı önde; yağmurun içinden bir otobüs durağının ışığına doğru.
> Mutfakta radyo yine bir şarkıya başladı. Bulaşık suyu aktı, kesildi.
> Koridorun ucundaki kapının altından sızan sarı ışık bir süre daha yandı.
> Yarım saat sonra biri 112’yi aradı. {fade}
@BİR ERKEK SESİ: Ortağım… bıçaklandı. Ofiste. Aşçı çocuk… kaçtı. Çabuk gelin. [phone]
`);

const PR01 = T(`
# 15 KASIM · GECE 02.30 — HAMİTLER [bg:sokak_karanlik]
> Sıra apartmanların arasında iki ekip aracı. Mavi ışık ıslak duvarlarda dönüyor, perdelerin arkasında yüzler beliriyordu.
> Üçüncü katta bir kapı çalındı. İçeride bir dikiş makinesinin pedalı durdu.
> Kapıyı kırk yaşlarında bir kadın açtı. Elinde bir iğne, ipliği hâlâ bir kumaşa bağlı.
@KADIN: Buyurun? Ne oldu? Kemal işte, gece vardiyasında…
@BİR POLİS: Emir Yalçın burada mı? Cinayet Büro.
> Mutfakta yirmi iki yaşında bir genç, musluğun başında su içiyordu. Gözleri şişti; ağlamaktan mı, uykudan mı, belli değildi.
@GENÇ: Cinayet mi? Kim… kim öldü?
@BİR POLİS: Ercan Toker. Patronun.
> Bardak gencin elinden kaydı, lavabonun içinde kırılmadan döndü. Gencin yüzünden önce bir şaşkınlık, sonra bir şey daha geçti; polis onu not etti.
@GENÇ: Ercan abi mi? Ben… ben sadece bağırdım. Bağırıp çıktım. Ben bir şey yapmadım.
> Telefonu şeffaf bir poşete girdi. Merdivenlerde kelepçe şıkırdadı. {shake}
> Kadın kapıda kaldı. İğne parmaklarının arasındaydı; ipliğin ucunda bir kumaş parçası sallanıyordu.
> Üç gün sonra genç tutuklandı. İki ay sonra iddianame geldi: tasarlayarak kasten öldürme. Ağır Ceza.
> Birinci celseye on bir gün kala, bir baba hiç girmeyeceğine yemin ettiği bir büronun kapısını çaldı.
`);

const BR00 = T(`
# CUMA 22.10 — ARSLAN HUKUK, BURSA [bg:buro_gece]
~ Bursa’da şubat, yağmurla kar arasında kararsız bir aydır. Avukatlar da öyledir; müvekkil kapıdan girene kadar.
> Büroda yalnızca iki lamba yanıyordu: benimki ve Leyla’nınki. Kahve makinesi soğumuş, radyatör tıkırdıyordu.
~ On dört dava. On dördünde de o kapı çalındı ve biri bana bir yük bıraktı. On beşinci kez çalındığında kim olduğunu bilmeden ayağa kalktım.
> Kapı çalınmadı. Açıldı. İçeri kırk yaşlarında, kırlaşmış sakallı bir adam girdi; turuncu, reflektörlü bir iş montu, çamurlu botlar.
> Eldivenlerinin birini çıkarmış, öbürünü unutmuştu. Bakışı önce bana, sonra koridorun ucundaki ışığı yanan kapıya gitti. Orada kaldı.
kemal: Kemal Yalçın. Oğlum içeride. Emir.
- Buyurun, oturun. Ben Deniz Arslan.
kemal: Biliyorum kim olduğunu. Oturmayacağım. Vardiyam başlıyor; Demirtaş’ta bir depoda forklift kullanıyorum, gece.
> Montunun cebinden katlanmış bir kâğıt çıkardı: iddianamenin ilk sayfası, kenarları terden yumuşamış.
kemal: Tasarlayarak öldürme diyorlar. Ağırlaştırılmış müebbet. Yirmi iki yaşında bir çocuk. Benim oğlum.
> Bir an durdu. Koridordaki kapıya bir kez daha baktı.
kemal/kizgin: Şunu baştan söyleyeyim: Leyla Hanım’la değil. Seninle konuşacağım. Onun bu dosyaya eli değmeyecek.
~ Leyla’nın adını bu büroda böyle söyleyen kimseyi duymadım. Bir müvekkil, bir düşman ya da ikisi birden.
- Leyla Hanım’ı tanıyor musunuz?
kemal: Tanırım. Yirmi iki yıl önce benim avukatımdı. Bir öğrenci evi, bir terazi. Bana “ikrar et” dedi. Ettim. Dört yıl yattım.
> Kâğıdı masama bıraktı. Eli titremiyordu; titremeyi yıllar önce bitirmiş bir el.
kemal: Oğlum cezaevinde doğdu sayılır. Ben içerideyken. İlk adımını bir görüş odasında attı.
kemal: Şimdi o da içeride. Aynı şehirde, aynı mahkemede. Bu sefer bir adam öldü diye.
- Ölen kim?
kemal: Ercan Toker. Mudanya’da meyhanesi var… vardı. Emir’in patronu. Yirmi iki yıl önce o evde benimle oturan adam.
kemal: Terazinin sahibi. Ben yattım, o meyhane açtı.
~ Bir terazi, bir meyhane, bir cinayet. Bu dosyanın ilk sayfası yirmi iki yıl önce yazılmış.
kemal: Oğlum onun yanında çalışıyormuş. Haberim yoktu. Öğrendiğim gün bağırdım. O hafta da… o hafta adam öldü.
kemal: Emir’in zorunlu müdafisi iki kere geldi görüşe. İkisinde de saatine baktı. Meral dedi ki “o büroya git. O kadın bize borçlu.”
> Sesi yükselmedi. Sadece her kelimeyi ötekinden ayrı koydu; bir paletin üstüne kolileri dizer gibi.
kemal: Ben borç istemeye gelmedim. Oğlum için geldim. Ama bu büro bana bir şey borçlu, onu da bil.
> Koridorun ucunda bir kapı aralandı. Leyla eşikte belirdi. Gözlüğü elinde. Bir şey söylemedi.
> Kemal ona dönmedi. Yalnızca omuzları bir santim yükseldi, sonra indi. Leyla bir an bekledi; kapıyı yavaşça kapattı.
~ İki insan yirmi iki yıl boyunca birbirine bir cümle borçlu kalmış. O cümle şimdi benim masamda duruyordu.
`);

const BR01 = T(`
> Kemal gitti. Merdivenlerde ağır botlar, sokak kapısı, sonra bir motorun öksürüğü. Yağmur camda.
> Leyla bir süre sonra geldi. Elinde kalın bir klasör; kapağında kırmızı kalemle bir esas numarası ve tek bir ad: YALÇIN.
leyla: Dosyanın tamamı. Zorunlu müdafiden aldım; vekâletnameyi babası yarın getirir. On bir gün sonra birinci celse.
- Kemal Bey sizin bu dosyada olmamanızı istiyor.
leyla: Duydum. Haklı. Dosya senin.
> Karşıma oturdu. Sigara paketini masaya koydu, bir kez çevirdi. Dört yıldır bıraktığı sigaranın paketi; hâlâ dolu.
leyla: Ben salonda dinleyici sırasında olacağım. Bir şey sorarsan cevap veririm. Sormazsan susarım. Bu kadar.
leyla: Dosyayı açmadan önce bir şey bil: neyle karşı karşıyayız? İddianamedeki suçun cezası ne?
~ Kapakta “82/1-a” yazıyordu. Leyla’nın kalemiyle, altı iki kez çizilmiş.
`);

const BR01B = T(`
> Leyla klasörü açmadı. Pencereye baktı. Yağmur, Uludağ’ın karanlık yamacından şehre doğru iniyordu.
leyla: Sana bir hikâye anlatmıştım. Bir öğrenci evi, bir terazi, bir çocuk. “Benim değil” diyordu. Ben ona inanmadım.
- Hatırlıyorum. “İkrar et, indirim alırsın” demiştiniz.
leyla: Adını söylememiştim.
> Bir süre konuşmadı. Paketi bir kez daha çevirdi.
leyla: Kemal Yalçın. Yirmi bir yaşındaydı. Ercan Toker o evin öbür kiracısıydı. Beş yıl sonra Ercan başka bir dosyada aynı terazilerle yakalandı. Ben de anladım.
leyla: Kemal’e söyledim. Yüzüme baktı ve gitti. Yirmi iki yıl. Bu akşam yeniden geldi; benim kapıma değil, seninkine.
~ Leyla bunu anlatırken masasının köşesine bakmadı. On dört davadır o köşede ters bir çerçeve duruyor. Hiç sormadım.
~ Bu gece sormak istedim. Sormadım. Bazı soruların cevabı, sorulmadan önce gelmek ister.
leyla: Şimdi oğlu içeride. Bir adamı öldürmekle suçlanıyor. Öldürülen adam da o teraziyi saklayan adam.
leyla: Savcı bunu bir hikâyeye çevirecek, Deniz. Kin, plan, intikam. İyi bir hikâye. Mahkemeler iyi hikâyeleri sever.
- Siz ne düşünüyorsunuz?
leyla: Ben yirmi iki yıl önce ne düşündüğümü düşünüyorum. Bu dosyada benim düşüncem tehlikelidir. Seninki lazım.
> Ayağa kalktı. Kapıda durdu, döndü.
leyla: Bir şey daha. Kemal sana kızacak. Bana kızdığı için sana kızacak. Bunu kişisel alma; kişisel olan benim.
`);

const SABAH = T(`
# PAZARTESİ 08.10 — MUDANYA İSKELESİ [bg:liman_gece]
> Sabah olmasına rağmen gökyüzü kalkmamıştı. İskele lambaları hâlâ yanıyordu; biri kimsenin yaptırmadığı bir sallantıyla.
> Toker Balık’ın kepenkleri inikti. Neon sönüktü ama harfler yerindeydi; aradaki boşluk da.
> Martılar balıkçı teknelerinin üstünde kavga ediyordu. Bir dolmuş geçti, durağa yanaştı, kimseyi almadan gitti.
~ Savcının hikâyesinde bir saat var: 23.55. O saatte bir çocuk elinde bıçakla bu kapıdan kaçmış.
~ Benim elimde başka bir saat yok. Henüz. Ama bu kıyıda her şeyin bir saati var: teknelerin, dolmuşların, kasaların.
> Meyhanenin arka sokağına yürüdüm. Çöp kovaları, bir bulaşıkhanenin buğulu penceresi, bir kapı. Kapının üstünde kırmızı ışığı sönük bir kamera.
> Arka kapının yanında bulaşıkhanenin buğulu penceresi; içeride bir radyo, bir musluk sesi. Biri sabahın sekizinde tabak yıkıyordu; ya da dünün tabaklarını.
> Kapının eşiğinde ıslak bir izmarit, yanında bir çakmak kapağı. Polis bandının bir parçası bir çöp kovasının kulpuna takılı kalmış; rüzgârda sallanıyordu.
~ Üç ay. Bir olay yeri üç ayda unutur; ama bir mutfak unutmaz. Her gece aynı saatte aynı tabaklar, aynı dolmuş, aynı kasa.
~ Kapanmış bir meyhane, kimsenin sormadığı bir kamera ve on bir gün. Leyla’nın sesi aklımda: “Seninki lazım.”
`);

export const briefing: CasePart = {
  nodes: [
    story('PR_00', {
      ...PRO,
      title: 'Gece',
      background: 'liman_gece',
      lines: [{ lines: PR00 }],
      choices: [cont('PR00_DEVAM', 'Gece 02.30', 'PR_01', { role: 'PRIMARY' })],
    }),
    story('PR_01', {
      ...PRO,
      title: 'Hamitler 02.30',
      background: 'sokak_karanlik',
      lines: [{ lines: PR01 }],
      choices: [cont('PR01_DEVAM', 'Üç ay sonra', 'BR_00', { role: 'PRIMARY' })],
    }),
    story('BR_00', {
      ...C1,
      title: 'Kemal',
      background: 'buro_gece',
      onFirstEnter: [meet('deniz'), meet('kemal')],
      lines: [{ lines: BR00 }],
      choices: [
        option('BR00_A', '“Borç değil. Dosyayı okuyacağım; her sayfasını.”', {
          effects: [raise('kemal_durust')],
          responses: B(`
- Kemal Bey, ben borç tahsil etmem. Dosyayı okurum. Her sayfasını. Sonra oğlunuzla konuşurum. Size ne bulduğumu söylerim, ne bulmak istediğimi değil.
kemal: Yirmi iki yıl önce de biri bana böyle konuştu. Sonra “ikrar et” dedi.
- O zaman beni o günden değil, bugünden ölçün.
> Kemal uzun uzun yüzüme baktı. Sonra eldivenini çıkarıp masama koydu; neden, bilmiyorum. Bir rehin gibi.
kemal: Yarın vekâletnameyi getiririm. Meral imzalasın diye bekliyorum; bu evde her şeyi o imzalar.
`),
          next: 'BR_01',
        }),
        option('BR00_B', '“Leyla Hanım bu dosyada olmayacak.”', {
          effects: [raise('leyla_kapi')],
          responses: B(`
- Leyla Hanım bu dosyada olmayacak, Kemal Bey. Söz.
> Kemal’in omuzları indi. Koridorun ucunda, kapalı kapının arkasında bir sandalye gıcırdadı.
kemal: İyi. Bunu duymak istiyordum.
~ Bir söz verdim. Bir adamın yirmi iki yıllık öfkesine, bir kadının kapalı kapısının önünde. Leyla duydu. Ben de onun duyduğunu duydum.
`),
          next: 'BR_01',
        }),
        option('BR00_C', '“Önce vekâletname ve ücret.”', {
          responses: B(`
- Önce vekâletnameyi ve ücret sözleşmesini konuşalım; süreci anlatayım.
kemal: Ücret. Tabii. Yirmi iki yıl önce de önce ücret konuşulmuştu.
> Tarifeyi anlattım. Dinledi, başını salladı, bir zarf bıraktı. Kalın değildi; bir forklift operatörünün üç aylık fazla mesaisi.
~ Düzgün bir başlangıç. Kemal düzgün başlangıçlardan nefret ediyordu; sonlarını gördüğü için.
`),
          next: 'BR_01',
        }),
      ],
    }),
    story('BR_01', {
      ...C1,
      title: 'Dosya',
      background: 'buro_gece',
      onFirstEnter: [meet('leyla')],
      lines: [{ lines: BR01 }],
      choices: [
        option('BR01_A', '82/1-a: ağırlaştırılmış müebbet', {
          score: { HUKUKI_BILGI: 50 },
          good: 'Doğru: kasten öldürmenin tasarlanarak işlenmesi TCK 82/1-a’dır; ceza ağırlaştırılmış müebbet hapistir. Tasarlama düşerse fiil TCK 81/1’e (müebbet) iner.',
          responses: B(`
- 82/1-a. Tasarlayarak öldürme. Ağırlaştırılmış müebbet.
leyla/mutlu: Doğru. Tasarlama düşerse 81/1: müebbet. Aradaki fark bir ömrün koşulları. Biri yirmi dört yıl sonra bir kapı açar; öbürü otuz.
> Sigara paketini ters çevirdi. Leyla’nın alkışı budur.
leyla: Tasarlama bir saat değildir Deniz, bir zihin hâlidir. Karar ile fiil arasında geçen zaman, o zamanda kararın sürmesi, soğukkanlılık, bir plan.
leyla: Savcı o zihni kâğıtlardan kuracak: bir mesaj, bir fiş, bir bekleyiş. Sen o kâğıtların her birini tek tek eline al.
`),
          next: 'BR_01B',
        }),
        option('BR01_B', '81/1: müebbet', {
          bad: 'TCK 81/1 kasten öldürmenin temel hâlidir (müebbet). İddianame tasarlamayı yazıyor: TCK 82/1-a, ağırlaştırılmış müebbet.',
          category: 'HUKUKI_BILGI',
          responses: B(`
- Kasten öldürme… 81/1? Müebbet?
leyla: O temel hâl. İddianame tasarlama yazıyor: 82/1-a. Ağırlaştırılmış müebbet. İnfazın koşulları bambaşka.
leyla: Ama aklını oraya koyman fena değil. Bu dosyada savunmanın bir ayağı tam da oraya basacak: tasarlama yoksa 81/1.
~ Paket çevrilmedi. Ama Leyla gülümsedi; neredeyse.
`),
          next: 'BR_01B',
        }),
        option('BR01_C', '82/1-a + haksız tahrik: doğrudan 18–24 yıl', {
          bad: 'Haksız tahrik (TCK 29) iddianamede yoktur; mahkemenin kabulüne bağlı bir indirimdir. İddianamedeki suçun cezası ağırlaştırılmış müebbettir (TCK 82/1-a).',
          category: 'HUKUKI_BILGI',
          responses: B(`
- Tasarlama, ama maktulün yaptığı ortada; haksız tahrikle on sekiz ile yirmi dört yıl?
leyla: Tahrik bir indirimdir; savcı yazmaz, mahkeme kabul ederse uygulanır. İddianamede ağırlaştırılmış müebbet var.
leyla: Bir de şunu düşün: tahrik dediğin an öfkeyi kabul edersin. Öfkeyi kabul eden, bıçağı da tartışır hâle gelir. Önce müvekkilinin ne dediğini duy.
`),
          next: 'BR_01B',
        }),
        option('BR01_D', '20–25 yıl; ilk suç olduğu için', {
          bad: 'Ceza aralığı sabıkaya göre değişmez; tasarlayarak öldürmenin cezası ağırlaştırılmış müebbettir (TCK 82/1-a). Takdiri indirim (TCK 62) ancak hükümde uygulanır.',
          category: 'HUKUKI_BILGI',
          responses: B(`
- Sabıkası yok… yirmi, yirmi beş yıl?
leyla: Sabıka cezanın aralığını değiştirmez. Hükümde takdiri indirim olabilir; o zaman bile ağırlaştırılmış müebbet müebbete iner, o kadar.
leyla: Babasına yanlış rakam söyleme. O adam yirmi iki yıl önce bir avukattan yanlış bir rakam duydu.
`),
          next: 'BR_01B',
        }),
      ],
    }),
    story('BR_01B', {
      ...C1,
      title: 'Yirmi iki yıl',
      background: 'buro_gece',
      lines: [{ lines: BR01B }],
      choices: [cont('BR01B_DEVAM', 'Dosyayı aç', 'BR_02', { role: 'PRIMARY' })],
    }),
    story('BR_02', {
      ...C1,
      phase: 'BRIEFING',
      title: 'Son Duruşma',
      background: 'buro_gece',
      onFirstEnter: [meet('emir'), meet('ercan'), meet('tarik')],
      blocks: [
        {
          type: 'profileCard',
          character: 'emir',
          label: 'MÜVEKKİL',
          lines: ['Emir Yalçın, 22', 'Aşçı yardımcısı · sabıkasız', 'Tutuklu · Bursa H Tipi'],
          charge: 'Tasarlayarak kasten öldürme (TCK 82/1-a)',
          demand: 'İddianame: ağırlaştırılmış müebbet',
        },
        {
          type: 'sentenceRange',
          segments: ['green', 'gold', 'gold', 'red', 'red', 'darkred', 'darkred', 'darkred'],
          markerPct: 88,
          labels: ['Beraat', '81+29: 12–18 y', '81: müebbet', '82: ağ. müebbet'],
          demandLabel: 'İSTEM: 82/1-a',
        },
        {
          type: 'paragraph',
          title: 'OLAY ÖZETİ',
          text: '14 Kasım gecesi Mudanya’daki Toker Balık meyhanesinin ofisinde işletme sahibi Ercan Toker (44) göğsüne tek bıçak darbesiyle öldürüldü. Bıçak, aşçı yardımcısı Emir Yalçın’ın.',
        },
        {
          type: 'paragraph',
          title: 'TANIK VE SANIK',
          text: 'Ortak Tarık Sezer 00.16’da 112’yi aradı; Emir’in elinde bıçakla ofisten kaçtığını söyledi. Emir o gece maktulle tartıştığını kabul ediyor; öldürmediğini söylüyor.',
        },
        {
          type: 'strengthList',
          title: 'SAVCILIĞIN ELİNDEKİLER',
          items: [
            { label: 'Baş tanık Tarık Sezer’in görgü tanıklığı', strength: 'STRONG' },
            { label: 'Sanığın bıçağı, sanığın parmak izleri', strength: 'STRONG' },
            { label: 'Pazartesi mesajı: “hesabını soracağım”', strength: 'MEDIUM' },
            { label: 'Bulaşıkçının duyduğu bağırış', strength: 'MEDIUM' },
            { label: 'Çarşamba alınan bileği taşı', strength: 'WEAK' },
          ],
        },
        {
          type: 'choiceGroup',
          title: 'SAVUNMA STRATEJİSİ SEÇ',
          group: 'g_strateji',
          hints: {
            STR_MASUMIYET: 'Masumiyet: Emir öldürmedi. Uyan esas savunma ×1,5 puan.',
            STR_TASARLAMA:
              'Tasarlamayı çürüt: savcının üç ayağını tek tek yık; şüpheden yararlanma. Uyan esas savunma ×1,2.',
            STR_TERDIT: 'Terditli: önce beraat; olmazsa tasarlama yok, haksız tahrik var. Uyan esas savunma ×0,8.',
          },
        },
      ],
      choices: [
        option('STR_MASUMIYET', 'Masumiyet', {
          group: 'g_strateji',
          effects: [set('strategy', 'MASUMIYET'), set('strategy_pct', 150), ...p1.start()],
          responses: B(`
leyla: Masumiyet. Bıçak onun, ses onun, tanık var. Bunu söylemek kolay; kanıtlamak için o gecenin her dakikasını eline alman gerekecek.
leyla: Dakikalar Deniz. Bu dosyada her şey dakikalarla.
`),
          next: 'INV_SABAH',
        }),
        option('STR_TASARLAMA', 'Tasarlamayı çürüt', {
          group: 'g_strateji',
          effects: [set('strategy', 'TASARLAMA'), set('strategy_pct', 120), ...p1.start()],
          responses: B(`
leyla: Savcının hikâyesinin üç ayağı var: bir mesaj, bir taş, bir bekleyiş. Ayakları tek tek kes; masa kendi düşer.
leyla: Ama masanın altında bir şey var mı, ona da bak. Bazen düşen masa bir şeyi örter.
`),
          next: 'INV_SABAH',
        }),
        option('STR_TERDIT', 'Terditli savunma', {
          group: 'g_strateji',
          effects: [set('strategy', 'TERDIT'), set('strategy_pct', 80), ...p1.start()],
          responses: B(`
leyla: Önce beraat, olmazsa tahrik. Güvenli.
> Leyla paketi çevirmedi. Bir süre baktı.
leyla: Yalnızca bil: “olmazsa” dediğin yerde, müvekkiline “belki yaptın” demiş olursun. Yapmadığını söyleyen birine.
`),
          next: 'INV_SABAH',
        }),
      ],
    }),
    story('INV_SABAH', {
      ...INV,
      title: 'Mudanya, sabah',
      background: 'liman_gece',
      lines: [{ lines: SABAH }],
      choices: [cont('SABAH_DEVAM', 'Soruşturmaya başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
  ],
};
