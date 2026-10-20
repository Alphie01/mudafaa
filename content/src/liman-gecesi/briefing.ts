import { cont, inc, meet, option, raise, set, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B } from './dsl.js';
import { C1, INV, PRO, p1 } from './shared.js';

// 40-briefing: soğuk açılış (isimsiz sesler), sabah, gözaltı; Bölüm 1: Gülay büroda, Leyla'nın ceza aralığı sorusu,
// dosyadaki kâğıtlar, dosya ekranı ve strateji; Mudanya sabahı.

const strategyNext = 'INV_SABAH';

export const briefing: CasePart = {
  nodes: [
    story('PR_00', {
      ...PRO,
      title: 'Gece 23.02',
      background: 'liman_gece',
      lines: B(`
# 14 KASIM · GECE 23.02 — MUDANYA LİMANI, 4 NO’LU RIHTIM [bg:liman_gece]
> Poyraz konteynerlerin arasında ıslık çalıyordu. Yağmur yatay geliyordu; denizden mi gökten mi, belli değildi.
> Rıhtımın ucunda bir gemi yükleniyordu. Vinçlerin uyarı düdüğü, çeliğe çarpan çelik, bir yerde motoru rölantide bir forklift.
> Konteynerler üst üste, sokak sokak, bir şehrin bloklarına benziyordu. Aralarındaki dar koridorlarda sodyum lambalarının turuncusu ve ıslak gölgeler.
> Bir yerde bir telsiz cızırdadı, sonra sustu. Gece vardiyası kahvesini termostan içiyor, saatine bakıyordu. Herkes biraz yorgun, herkes biraz ıslak.
> Uzaktaki bir forkliftin farı iki silueti yakaladı. Biri iri, biri ince. İkisi de turuncu yelekli.
@SARHOŞ SES: Ne bakıyorsun öyle? Kafanı kaldır, kafanı. Senin soyunuz hep yere bakar zaten.
@GENÇ SES: Git işine abi. Vardiya bitiyor.
@SARHOŞ SES: Kardeşin de senin gibiydi. Ayağına bakmazdı. O yüzden ezildi ya, konteynerin altında. Kurbağa gibi.
> Bir sessizlik. Vinç düdüğü. Sonra ince siluet bir adım geri çekildi.
@GENÇ SES: Ağzına alma onu.
> İri olan güldü. Tükürdü. Tükürük, ince siluetin yeleğinin üstünde, farın ışığında parladı.
> Bir itiş. Çelik bir babaya çarpan bir omuz, metalin derinden inleyişi. {shake}
> Sonra bir yumruk. Kısa, düz, bir kere. Islak bir ses.
> İri siluet geriye sendeledi ve bir babanın dibine oturdu, bir çuval gibi. Elleri yüzünde.
@SARHOŞ SES: Burnum… Burnumu kırdın lan! Seni gebertirim! Duydun mu? Seni gebertirim!
> Bağıran sesin hangi ağızdan çıktığını rüzgâr söylemedi. Rüzgâr böyle şeyleri söylemez.
> İnce siluet olduğu yerde duruyordu. Yumruğunu açıp kapadı, açıp kapadı. Sanki elinin ne yaptığını anlamaya çalışıyordu.
> Konteynerlerin arasından bir fener belirdi. Sallanan, sarı bir ışık. Arkasından ağır, acelesiz adımlar.
@FENERLİ SES: Ne oluyor burada? Ayrılın! Sen, eve git. Hemen. Sen de kalk, yürü kantine. Yüzünü yıka.
@GENÇ SES: Abi ben…
@FENERLİ SES: Eve git dedim evlat.
> İnce siluet yürüdü. Arkasına bir kez baktı; babanın dibinde oturan adam hâlâ küfrediyordu. Küfreden adam ölmez. Öyle düşündü.
> Fener bir süre olduğu yerde kaldı. Sonra o da karanlığa döndü.
> Rıhtımda yalnızca yağmur, bir matara ve bir babanın gövdesinden aşağı süzülen birkaç damla kan kaldı.
> Saat 23.10’du. Ercan Yavuz’un hayatının son saatinin başı.
> Ya da sonu. Dosya buna henüz karar vermemişti. {fade}
`),
      choices: [cont('PR00_DEVAM', 'Devam', 'PR_01', { role: 'PRIMARY' })],
    }),
    story('PR_01', {
      ...PRO,
      title: 'Sabah 06.10',
      background: 'depo_gece',
      lines: B(`
# 15 KASIM · 06.10 — MUDANYA LİMANI, B SAHASI [bg:depo_gece]
> Sabah vardiyası kartlarını okuttu, termoslarını açtı, sigaralarını yaktı. Birisi B sahasına bir istif için yürüdü.
> İki konteynerin arasında, yarı yarıya karanlığın içinde, bir ayakkabı gördü. Sonra ayakkabının bağlı olduğu bacağı.
> Martılar polis şeridinin üstünde dönüyordu. Sodyum lambaları birer birer söndü; gün, gri ve ağır, denizin üstünden geldi. [bg:sokak_sabah]
> Cinayet Büro’dan bir kadın amir, eldivenlerini takarken cesede uzun uzun baktı. Ağzında yakılmamış bir sigara.
nurten: Kafanın arkası. Biri ya da bir şey. Dün gece burada ne oldu?
@BİR LİMANCI: Kavga oldu amirim. Rıhtımda. On bir gibi.
nurten: Kiminle?
> Kalabalığın içinden biri cevap verdi. Kimse dönüp bakmadı; herkes zaten biliyordu.
@BİR LİMANCI: Tarık’la. Laşingci Tarık.
nurten: Adresi?
> Amir sigarasını cebine koydu. Yakmadı. Hiç yakmazdı.
> Bir olay yeri teknisyeni, beyaz tulumuyla iki konteynerin arasından çıktı. Elinde naylon bir poşet; poşetin içinde hiçbir şey yoktu.
@TEKNİSYEN: Alet yok amirim. Etrafta da yok. Rıhtımdaki kafeste yüzlerce kilit var ama, ağır şeyler. Biri olabilir.
nurten: “Biri olabilir.” Hepsini mi toplayalım?
@TEKNİSYEN: Kavganın olduğu yere en yakın kafes. Oradan bir tane alırız, izine bakarız.
> Amir cevap vermedi. Cesede bir kez daha baktı: yüzüstü, başı içeri doğru, iki kolu yanlarında. Kimse böyle düşmez.
nurten: Kamera?
@BİR LİMANCI: B sahasında kamera yok amirim. İstif sahası. Gece kimse gelmez buraya.
> Amir başını kaldırıp projektör direğine baktı. Bir şey not aldı. Sonra not defterini kapattı, sanki not almamış gibi.
`),
      onFirstEnter: [meet('nurten')],
      choices: [cont('PR01_DEVAM', 'Devam', 'PR_02', { role: 'PRIMARY' })],
    }),
    story('PR_02', {
      ...PRO,
      title: 'Güzelyalı 08.00',
      background: 'ev',
      lines: B(`
# 15 KASIM · 08.00 — GÜZELYALI [bg:ev]
> Kapı çalındı. İki kez, sonra üçüncüsünde sert. {shake}
> Tarık kapıyı açtığında üstünde dünkü tişört vardı. Sağ elinin boğumlarında kabuk bağlamış, morarmış bir yara.
> İçeride altı yaşında bir kız uyuyordu. Masada yarım kalmış bir gemi resmi; mavi kalemle çizilmiş, bacasından duman çıkan.
@KADIN SESİ: Tarık? Kim gelmiş? Ne oldu?
> Kapıdaki adamlardan biri bir kâğıt gösterdi. Diğeri Tarık’ın sağ eline baktı, uzun uzun.
@SİVİL POLİS: Elinize ne oldu?
> Tarık elini çevirdi, boğumlara baktı. Sanki ilk kez görüyordu.
@SİVİL POLİS: Ercan Yavuz’u tanır mısınız? Dün gece öldü. Bizimle gelin.
> Bir an, kapı aralığında, Tarık’ın yüzünden bir şey geçti. Korku değildi. Şaşkınlık da değil. Bir adamın kendi eline inanamaması.
> Tarık cevap vermedi. Elini arkasına sakladı. Sonra, çocuk uyanmasın diye, kapıyı yavaşça arkasından çekti.
> Dört gün sonra tutuklandı. İki ay sonra iddianame düzenlendi: kasten öldürme.
> İlk celseye on altı gün kala, yağmurlu bir perşembe akşamı, bir kadın Bursa’da bir avukatın kapısını çaldı. {fade}
`),
      choices: [cont('PR02_DEVAM', 'Dosyayı aç', 'BR_00', { role: 'PRIMARY' })],
    }),
    story('BR_00', {
      ...C1,
      title: 'Gülay Hanım',
      background: 'buro_gece',
      onFirstEnter: [meet('leyla'), meet('deniz'), meet('gulay')],
      lines: B(`
# PERŞEMBE 21.15 — ARSLAN HUKUK, BURSA [bg:buro_gece]
~ Kasımda yağmur dikiş tutmaz. Her yeri söker. Pencerenin pervazından, şemsiyenin telinden, insanın sabrından.
> Büroda benden ve Leyla’nın odasındaki tek lambadan başka kimse yoktu. Kapı çalındığında saatin dokuzu geçtiğini fark ettim.
> Otuzlarında bir kadın. Islak bir kumaş çanta, yakasına takılı bir iğne, ipliği hâlâ sarkan. Kapıda durdu, içeri girmedi.
gulay: Avukat hanım? Arslan Hukuk burası mı? Telefonda kadın biri söyledi… Leyla Hanım. Bana sizi söyledi.
- Buyurun. Islanmışsınız, oturun.
> Oturmadı. Çantasını masanın üstüne boşalttı, sırayla: bir liman kartı, bir bordro, bir kira sözleşmesi ve katlanmış bir resim kâğıdı.
gulay: Bunlar Tarık’ın. Kocamın. Polis evden ne aldıysa aldı, bunlar kaldı. Bu da… bu da Elif’in. Kızımın. Babasına çizdi, gemi.
> Resmi açtı. Mavi bir gemi, bacasından duman, güvertesinde çöp adam gibi iki kişi. Birinin elinde kocaman bir şey; vinç olabilir, kalp olabilir.
gulay: Cezaevine götüremedim. Resim almıyorlarmış. Size bırakayım dedim. Bir gün görürse…
~ İnsanlar avukata para getirir, belge getirir, öfke getirir. Bu kadın bir çocuk resmi getirmişti.
gulay: Baro bir avukat vermiş. Bir kere geldi. Bir kere! İki ay oldu, bir daha gelmedi. Telefonumu açmıyor.
gulay: İddianameyi okudum avukat hanım. Kasten öldürme yazıyor. Müebbet diyorlar. Elif altı yaşında. Müebbet ne demek, bilmiyor bile.
- Gülay Hanım, o gece ne olduğunu biliyor musunuz?
> Bir an sustu. İğneyi yakasından çıkardı, sonra yeniden taktı.
gulay: Vurmuş. Biliyorum, vurmuş. Eli öyle geldi, yarası öyleydi. Bana söylemedi ama ben bilirim, on yıllık kocam.
gulay: Ama benim kocam adam öldürmez avukat hanım. Vurur belki. Öldürmez. O adam kalktı, yürüdü diyorlar, kantine gitti diyorlar. Sonra nasıl ölü buldular?
gulay/uzgun: Param az. Bir bileziğim var, bir de makinem. Makineyi satamam, ekmeğimiz o. Bileziği getirdim.
> Pencereden bir sokak lambası yanıp söndü. Gülay’ın yüzü bir an aydınlandı, bir an karanlıkta kaldı. İki ay uykusuz bir yüz.
gulay: Gece yatağa giriyorum, kapı çalınacak sanıyorum. Sabah oluyor, kapı çalınmıyor. Elif’i okula götürüyorum, öğretmen bana öyle bakıyor ki…
gulay: Mahallede herkes biliyor. Bakkal veresiye defterimi kapattı. “Katilin karısına veresiye yok” demedi; demesine gerek yoktu.
> Çantanın dibinden bir mendil çıkardı. Mendilin içinde ince bir altın bilezik.
`),
      choices: [
        option('BR00_A', '“Bileziği kaldırın. Ücreti dosyayı okuduktan sonra konuşuruz.”', {
          next: 'BR_01',
          effects: [inc('trust', 6), raise('gulay_minnet')],
          responses: B(`
- Bileziği kaldırın, Gülay Hanım. Önce dosyayı okuyayım. Ücreti sonra konuşuruz; makineniz yerinde kalsın.
> Mendili yavaşça katladı. Elleri titremiyordu; yüzü titriyordu.
gulay: Allah razı olsun. Ben… ben her şeyi yaparım avukat hanım. Ne derseniz. Ne lazımsa.
~ “Ne derseniz.” Bir avukatın duymak istemeyeceği cümlelerden biri. Bir kenara yazdım.
`),
        }),
        option('BR00_B', 'Vekâlet ücretini ve sözleşmeyi açıkça anlat', {
          next: 'BR_01',
          effects: [raise('gulay_sozlesme')],
          responses: B(`
- Size ücreti, avansı ve masrafları yazılı anlatacağım; asgari ücret tarifesinin altına inemem, ama taksit yaparız. Bir sözleşme imzalarız, kopyası sizde kalır.
gulay: Yazılı mı? İyi. Yazılı iyi. Önceki avukat hiçbir şey yazmadı, bir şey de yapmadı.
~ Kâğıt, korkan insana bazen bir sözden daha çok güven verir. Kâğıt geri alınmaz.
`),
        }),
        option('BR00_C', '“Size söz veremem. Ama ne olduysa onu bulacağım.”', {
          next: 'BR_01',
          effects: [raise('deniz_durust')],
          responses: B(`
- Gülay Hanım, size “kurtaracağım” diyemem. Kimse diyemez. Ama o gece ne olduysa onu bulacağım. Tarık’ın yaptığını da, yapmadığını da.
> Bana uzun uzun baktı. Gözleri kurudu; ağlamaktan sonra gelen o kuruluk.
gulay: Yaptığını da… Peki. Peki avukat hanım. Doğrusu bu.
~ Ona yalan söylemedim. Bu dosyada bunu kaç kez söyleyebileceğimi bilmiyordum.
`),
        }),
      ],
    }),
    story('BR_01', {
      ...C1,
      title: 'Leyla',
      background: 'buro_gece',
      lines: B(`
> Gülay gittiğinde saat onu geçiyordu. Leyla kapımda belirdi. Paltosu koluna atılı, elinde kapalı bir sigara paketi.
leyla: Kapıdan duydum. Mudanya limanı, bir yumruk, bir ölü.
- Dosyayı yarın UYAP’tan indiririm. Annesi değil, karısı tuttu; baro görevlisi bir kez gitmiş.
leyla: Bir kez. Bazen bir kez fazla bile. Otur.
> Paketi masanın üstünde çevirdi. Bir tur. İki tur. Sigarayı on yıl önce bırakmıştı; paketi bırakmamıştı.
leyla: Bir yumruğun bedeli ile bir ölümün bedeli aynı değil Deniz. Ama bunu mahkemeye sen tarttıracaksın. Teraziyi tanıyor musun?
leyla: İddianame kasten öldürme diyor. Savcı bu kavgayı kaybederse geri çekileceği bir hat var. Bizim de düşmeyeceğimiz bir taban.
leyla: Söyle bakalım: üç hat. Savcının iddiası, savcının yedeği, bizim tabanımız. Rakamlarıyla.
`),
      choices: [
        option('BR01_A', 'Müebbet · olası kastla 20–25 yıl · yaralama sonucu ölümde 10–14 yıl', {
          next: 'BR_01B',
          score: { HUKUKI_BILGI: 150 },
          good: 'TCK 81/1 müebbet; olası kastta (TCK 21/2) müebbet yerine 20–25 yıl; kast yaralamaya yönelikse ölüm neticesinden TCK 87/4 ile sorumluluk: 86/1 hâlinde 10–14 yıl (7550 sayılı Kanunla güncel aralık).',
          responses: B(`
leyla/mutlu: Güzel. Aralık yeni, değişikliği kaçırmamışsın. Çoğu hâlâ sekiz–on iki der.
leyla: Şimdi şunu unutma: 87/4 bir taban değil, bir tavan da değil. Kastın yaralamaya yönelik olduğunu ve ölümün o yaralamadan geldiğini kabul etmek demek.
leyla: Ölüm o yumruktan gelmediyse, o tabana bile inmemek gerekir. Teraziyi sen kur; ama hangi kefeye ne koyduğunu bil.
`),
        }),
        option('BR01_B', 'Müebbet · olası kastla 15–20 yıl · yaralama sonucu ölümde 8–12 yıl', {
          next: 'BR_01B',
          bad: 'Eski ve yanlış rakamlar: olası kastta müebbet yerine 20–25 yıl (TCK 21/2); TCK 87/4’te 86/1 hâli 7550 sayılı Kanunla 10–14 yıldır.',
          category: 'HUKUKI_BILGI',
          responses: B(`
leyla: Hayır. Kitabın eski baskısını okumuşsun. Olası kastta yirmi–yirmi beş. Yaralama sonucu ölümde artık on–on dört; geçen yıl değişti.
leyla: Rakamı yanlış bilen avukat, müvekkiline yanlış umut verir. Yanlış umut, yanlış korkudan daha pahalıdır.
`),
        }),
        option('BR01_C', 'Ağırlaştırılmış müebbet · olası kastla müebbet · taksirle öldürmede 2–6 yıl', {
          next: 'BR_01B',
          bad: 'Ağırlaştırılmış müebbet TCK 82’nin cezasıdır; iddianame 81/1. Kasten vurulan yumrukta taban taksirle öldürme (TCK 85) değil, neticesi sebebiyle ağırlaşmış yaralamadır (TCK 87/4, 23).',
          category: 'HUKUKI_BILGI',
          responses: B(`
leyla: Hayır. Ağırlaştırılmış müebbet nitelikli hâllerin cezası; burada tasarlama yok, eziyet yok. İddianame düz 81/1.
leyla: Taksir de değil. Yumruk kasten atıldı. Kasten atılan bir yumruktan ölüm çıkarsa kanun ona başka bir ad verir.
`),
        }),
        option('BR01_D', 'Müebbet · olası kastla 20–25 yıl · taban taksirle öldürme, 2–6 yıl', {
          next: 'BR_01B',
          bad: 'Yumruk kasten atıldığı için taban TCK 85 (taksirle öldürme) değil; kasten yaralamadan doğan ölümde TCK 87/4 uygulanır (TCK 23: ağır netice bakımından en az taksir).',
          category: 'HUKUKI_BILGI',
          responses: B(`
leyla: İlk ikisi doğru. Üçüncüsü bir dilek. Taksir, dikkatsizce yapılan şey içindir; yumruk dikkatsizlik değildir.
leyla: Kasten yaralayıp ölüme sebep olursan kanun bunu ayrıca düzenler. Tabanını yanlış yere koyarsan duvar senin üstüne çöker.
`),
        }),
      ],
    }),
    story('BR_01B', {
      ...C1,
      title: 'Dosyadaki kâğıtlar',
      background: 'buro',
      lines: B(`
# CUMA 09.30 — ARSLAN HUKUK [bg:buro]
> Sabah dosya UYAP’tan indi. Üç yüz on iki sayfa. Leyla’nın odasında, büyük masanın üstünde yan yana dizdik.
leyla: Kâğıtları say. Savcının dosyası neye dayanıyor?
- İddianame. Ön otopsi raporu. Vardiya şefinin ifadesi. Forkliftçinin ifadesi. Tarık’ın kolluk ifadesi. Emanetteki twistlock ve kriminal rapor. Bir de maktulün telefonunun tutanağı.
leyla: Yedi kâğıt. Hangisi en ağır?
- Vardiya şefi. Kavgadan yarım saat sonra Tarık’ı cesedin bulunduğu yerin ağzında, elinde bir demirle görmüş.
leyla: Peki en hafif hangisi?
- Telefon tutanağı. Kimse dokunmamış; altında bir imza, bir tarih, o kadar.
leyla: Kimsenin dokunmadığı kâğıt, ya boştur ya da kimsenin görmek istemediği bir şeyi taşır. İkisini de okuyacaksın.
- Ya forkliftçi? “Seni gebertirim” diye bağırmış.
leyla: Kim bağırmış? Kâğıtta “sanık bağırdı” yazıyor. Tanık bunu mu gördü, yoksa duydu mu? Duymakla görmek arasında bir dava kaybedilir.
leyla: Twistlock? Üstünde iz var. Kan var mı?
- Yok. Kriminal rapor biyolojik iz bulamamış.
leyla: Bir kafatasını kıran demir tertemiz çıkmış. Bunu not et ve şimdilik unut. Unutmadığın şeyi kürsüde fazla erken söylersin.
> Tarık’ın ifadesini önüme itti. Kısa bir metin. “Ağzını bozdu, ittim, düştü. Sonra eve gittim.”
leyla: Karısı “vurmuş” diyor. Kocası “ittim” diyor. Birinin sözü bir kadının korkusu, öbürü bir erkeğin utancı. İkisini de tart.
leyla: Bir şey daha. Ölüm saati raporda iki saatlik bir aralık: on birle bir arası. İki saat, bir limanda çok uzun bir zaman.
~ İki saat. Bir yumruk on birde. Bir ceset altıda. Arada bir şehrin uykusu kadar boşluk.
> Leyla kalkıp pencereyi araladı. Dışarıda yağmur, Uludağ’ın eteklerine asılı bir bulut. Masasında ters çevrilmiş bir çerçeve; hep öyle durur.
~ O çerçeveyi on yıldır kimse düzeltmedi. Ben de sormadım. Bu büroda bazı sorular dosyalarda, bazıları masalarda bekler.
leyla: Bir şey daha Deniz. Bu dosyada herkes sana Tarık’ı anlatacak. Karısı, ustası, şefi. Kimse sana Ercan’ı anlatmayacak.
leyla: Ölen adam da bir dosyadır. O gece ne yaptı, kimi aradı, ne yedi, kime borçluydu. Maktulü tanımayan avukat, sanığı da tanımaz.
`),
      choices: [cont('BR01B_DEVAM', 'Dosya özetini aç', 'BR_02', { role: 'PRIMARY' })],
    }),
    story('BR_02', {
      ...C1,
      phase: 'BRIEFING',
      title: 'Liman Gecesi',
      onFirstEnter: [meet('tarik')],
      blocks: [
        {
          type: 'profileCard',
          character: 'tarik',
          label: 'MÜVEKKİL',
          lines: ['Tarık Demirel, 33', 'Laşing işçisi · sabıkasız · tutuklu (Bursa H Tipi)'],
          charge: 'Kasten öldürme (TCK 81/1)',
          demand: 'İddianame: TCK 81/1 · müebbet hapis',
        },
        {
          type: 'sentenceRange',
          segments: ['green', 'gold', 'gold', 'red', 'red', 'red', 'darkred', 'darkred'],
          markerPct: 92,
          labels: ['Beraat', '87/4: 10–14 yıl', '21/2: 20–25 yıl', 'Müebbet'],
          demandLabel: 'İSTEM: TCK 81/1 · MÜEBBET',
        },
        {
          type: 'paragraph',
          title: 'OLAY ÖZETİ',
          text: '14 Kasım 23.04’te Mudanya Limanı 4 no’lu rıhtımda laşing işçisi Tarık Demirel ile puantör Ercan Yavuz kavga etti. Ercan Yavuz 15 Kasım 06.10’da B sahasında, iki konteynerin arasında başının arkasından aldığı darbeyle ölü bulundu. Savcılığa göre Tarık kavgadan sonra geri dönüp onu bir twistlock’la öldürdü.',
        },
        {
          type: 'strengthList',
          title: 'SAVCILIĞIN ELİNDEKİLER',
          items: [
            { label: 'Vardiya şefi: 23.40’ta B sahasında gördüm', strength: 'STRONG' },
            { label: 'Forkliftçi: “Seni gebertirim” diye bağırdı', strength: 'MEDIUM' },
            { label: 'Twistlock üzerinde sanığın kısmi izi', strength: 'MEDIUM' },
            { label: 'Ön otopsi: künt kafa travması', strength: 'MEDIUM' },
            { label: 'Sanık kavgayı kabul ediyor', strength: 'WEAK' },
          ],
        },
        {
          type: 'choiceGroup',
          title: 'SAVUNMA STRATEJİSİ SEÇ',
          group: 'g_strateji',
          hints: {
            STR_MASUMIYET: 'Masumiyet: ölümün Tarık’ın eylemiyle ilgisi yok; uyan esas savunma ×1,5 puan.',
            STR_USUL: 'İspat: savcının zinciri kopuk, şüphe sanık lehine; uyan esas savunma ×1,2 puan.',
            STR_INDIRIM:
              'Terditli: önce beraat, aksi hâlde kastın yokluğu (87/4) ve tahrik; uyan esas savunma ×0,8 puan.',
          },
        },
      ],
      choices: [
        option('STR_MASUMIYET', 'Masumiyet', {
          group: 'g_strateji',
          effects: [set('strategy', 'MASUMIYET'), set('strategy_pct', 150), ...p1.start()],
          responses: B(`
leyla: Masumiyet. Tarık vurdu, Deniz. Masumiyet derken neyi kastediyorsun?
- Ölümü. Yumruğu değil.
leyla: O zaman ölümün nereden geldiğini bulman gerekecek. Masumiyet, en pahalı stratejidir; parasını delille ödersin.
`),
          next: strategyNext,
        }),
        option('STR_USUL', 'İspat ve şüphe', {
          group: 'g_strateji',
          effects: [set('strategy', 'USUL'), set('strategy_pct', 120), ...p1.start()],
          responses: B(`
leyla: Dosyanın en zayıf yeri, en çok güvendiği yerdir. Vardiya şefini ve otopsiyi sına.
leyla: Şüphe bir boşluk değildir Deniz. Şüphe, kanıtlanmış bir başka ihtimaldir. Onu kur.
`),
          next: strategyNext,
        }),
        option('STR_INDIRIM', 'Terditli savunma', {
          group: 'g_strateji',
          effects: [set('strategy', 'INDIRIM'), set('strategy_pct', 80), ...p1.start()],
          responses: B(`
leyla: Önce beraat, olmazsa ölçü. Akıllıca. Ama ölçüyü erken söylersen beraati kendin bırakırsın.
leyla: Kürsüde “bir yumruktu” demeden önce, o yumruğun neye mal olduğunu gerçekten bil.
`),
          next: strategyNext,
        }),
      ],
    }),
    story('INV_SABAH', {
      ...INV,
      title: 'Mudanya',
      background: 'liman_gece',
      lines: B(`
# PAZARTESİ 07.40 — MUDANYA YOLU [bg:sokak_yagmur]
> Bursa’dan Mudanya’ya giden yol sisin içinden geçiyordu. Zeytinlikler, tek tük bir benzinlik, sonra birden deniz: gri, kurşun gibi, kıyıya vuran.
> Liman vinçleri sisin içinde zürafa boyunları gibi yükseliyordu. Kontağı kapattığımda poyrazın arabayı hafifçe salladığını hissettim.
# MUDANYA LİMANI — PERSONEL KAPISI [bg:liman_gece]
> Kapıdaki güvenlik görevlisi kimliğime, sonra baroya, sonra yine yüzüme baktı.
@GÜVENLİK: Avukatsanız içeri giremezsiniz hanımefendi. Liman alanı. İzin vardiya şefinden. Ofisi şurada, prefabrik.
> Prefabriğin camında buğu, içeride bir termos, bir radyo. Bir adam pencereden el salladı; içeri gel der gibi.
~ Bir limanda her şey saatle işler. Gemi saatiyle, vardiya saatiyle, gelgit saatiyle. İnsanlar o saatlerin arasında kaybolur.
~ Dört günüm vardı. Günde üç adım. Rıhtım, büfe, cezaevi, kâğıtlar. Hepsine yetmeyecekti; seçmek zorundaydım.
> Kapıdan geri döndüm. Rıhtımın yürüyüş yolundan denize baktım: bir römorkör, iki martı, bir yük gemisinin paslı gövdesi. Gemiler kimseyi beklemiyordu.
~ Bir limanda tanık aramak, bir denizde balık aramak gibi. Balıklar oradadır; ama sen yanlış saatte gelmişsindir. Ben iki ay geç gelmiştim.
`),
      choices: [cont('SABAH_DEVAM', 'Panoya iğnele', 'INV_HUB', { role: 'PRIMARY' })],
    }),
  ],
};
