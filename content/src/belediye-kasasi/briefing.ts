import { cont, flags, inc, dec, meet, option, raise, set, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, T } from './dsl.js';
import { C1, INV, PRO, p1 } from './shared.js';

// 40-briefing: soğuk açılış (12 Şubat 17.51; isimsiz siluet), 4 Mart sabahı (açığın ortaya çıkışı), büroda Nazan ve
// Orhan, Leyla’nın dosya devri (ceza aralığı A–D), dosyanın içi, strateji ve belediye önü sabahı.

const PR00 = T(`
# 12 ŞUBAT · 17.51 — HİSARÖNÜ BELEDİYESİ, MALİ HİZMETLER [bg:sokak_karanlik]
> Lodos, belediye binasının arka cephesindeki bayrak direğini bir kemanın teli gibi inletiyordu. Otoparkta üç araba kalmıştı; üçünün de camı buğuluydu.
> Zemin katta vezne salonunun ışıkları yarı yarıya söndürülmüştü. Sıra makinesinin ekranı karanlıkta tek başına yanıyordu: SON NUMARA 214.
> Koridorun sonunda temizlik arabası duruyordu; kovanın içinde bir paspas, sapına asılı bir radyo. Radyo maç anlatıyordu, kimse dinlemiyordu.
# MALİ HİZMETLER — ÖN ODA [bg:siyah]
> Veznelerin arkasındaki küçük odada tek bir monitör açıktı. Mavi ışığı, masanın başındaki bir siluetin omuzlarını boyuyordu. Yüz yoktu; yalnızca bir yaka, bir el, bir klavye.
> Klavye tıkırdadı. Ekranda gri bir pencere açıldı: “MAKBUZ İPTAL EDİLSİN Mİ?” İmleç “Evet”in üstünde bir an bekledi. Sonra tık.
> Bir pencere daha. Bir tık daha. Ekranın köşesinde saat değişti: 17.52.
> Yazıcı uyandı, homurdandı ve sıcak bir kâğıt kustu. El kâğıdı aldı, katladı, bir dosyanın arasına koydu. Her akşam yapılan bir iş gibi.
> Odanın öbür ucundaki çelik kapının panelinde dört kısa bip. Bir kilit dili geri çekildi. Kapı aralandı; içeriden soğuk, kâğıt kokulu bir hava çıktı.
> Kâğıt para hışırtısı. Birinin parmakları saydı: bir, iki, üç… Saymayı yarıda bıraktı. Tomarın bir kısmı bir zarfa, zarf bir iç cebe girdi.
@BİR SES: Cuma’ya kadar demiştik. [phone]
> Telefonun öbür ucundaki ses boğuktu; arkasında bir televizyon, bir maç, bir kalabalık. Aynı maç, temizlik arabasındaki radyoda da anlatılıyordu.
@İKİNCİ SES: Cuma’ya kadar. Her zamanki gibi. [whisper]
@BİR SES: Her zamanki gibi geç. [phone]
@İKİNCİ SES: Bu kez değil. [whisper]
> Telefon kapandı. Ekran koruyucu açıldı: belediyenin logosu, yavaşça dönen bir kubbe. Kasa kapısı kapandı; panel iki kez öttü.
# HİSARÖNÜ BELEDİYESİ — ARKA KAPI [bg:sokak_karanlik]
> Personel kapısında gece bekçisi termosundan çay dolduruyordu. Koridorda bir ışık söndü; sonra bir adım sesi.
@BEKÇİ: İyi akşamlar.
@SİLUET: İyi akşamlar.
> Bir yaka kaldırıldı, bir kapı itildi. Lodos içeri bir avuç yağmur attı; siluet başını eğdi ve otoparkın karanlığına karıştı.
> Bekçi çayını üfledi. Saatine baktı. Saatini kimse sormayacaktı.
> Ertesi sabah vezne yine açıldı. Para yine sayıldı. Kimse saymadığı parayı aramadı. {fade}
`);

const PR01 = T(`
# 4 MART · 09.10 — HİSARÖNÜ BELEDİYESİ, VEZNE SALONU [bg:siyah]
> Vezne salonu sabahın ilk saatinde bir otogar bekleme salonu gibiydi: ıslak şemsiyeler, sıra fişleri, kalorifer peteklerinin tıkırtısı.
> Kuyruğun ortasında, ütülü pardösülü, yaşlı bir adam elinde bir ayakkabı kutusu tutuyordu. Kutunun kapağına keçeli kalemle “MAKBUZLAR 2024–” yazılmıştı.
melek: Amca sıra numaran? Numarasız alamam.
hayri: Numara değil kızım, numaram var: makbuz numarası. Sıfır sıfır iki yedi yedi bir dokuz. Bir de bu borç bildirimi.
melek: Ne bildirimi? Ödenmemiş diyor burada, amca.
hayri: Ödenmiş diyor şurada, kızım. Biri yalan söylüyor; ben yetmiş bir yaşındayım, ben söylemem.
> Vezne 2’nin camının arkasındaki adam gözlüğünü taktı. Ellilerine yakın, kırlaşmış saçlı, gri hırkalı. Makbuzu iki parmağıyla, bir tabloyu tutar gibi aldı.
orhan: Bu makbuz benim kestiğim makbuz efendim. 12 Şubat, saat 16.40. Altı bin sekiz yüz elli lira. İki kez saydım, hatırlıyorum.
> Ekrana döndü, makbuz numarasını yazdı. Bir an hiçbir şey olmadı. Sonra yüzündeki kan çekildi.
orhan/saskin: İptal. İptal edilmiş… saat 17.47’de.
hayri: Ben 17.47’de evde çorbamı içiyordum evladım.
orhan: Ben de efendim. Ben de evdeydim.
> Salonun arkasındaki kapı açıldı. Lacivert takım elbiseli, gümüş saçlı bir adam, elinde ince belli bir çay bardağıyla kuyruğun başına geldi.
ercan: Hayri Bey, değil mi? Buyurun odama, orada bakalım; burada herkes bekliyor. Size bir çay söyleyeyim.
hayri: Çayınızı içerim ama makbuzumu bırakmam, müdür bey.
ercan: Müdür yardımcısı efendim. Makbuzunuz sizde kalsın, biz fotokopisini alırız.
> Melek sakızını patlatmayı bıraktı. Orhan ekrandaki satıra bakmaya devam etti, sanki bakarsa satır değişecekmiş gibi.
# ÜÇ HAFTA SONRA [bg:siyah]
> Müfettiş iki gün boyunca vezne salonunu koliler içinde taşıdı. Klasörler, dökümler, makbuz koçanları. Orhan’ın masasındaki kalemlik bile bir poşete girdi.
> Görevden uzaklaştırma yazısını Ercan Tunalı uzattı, iki eliyle, bir taziye kartı verir gibi.
ercan: Usul böyle Orhan Bey. Ben de üzgünüm. İnşallah bir yanlışlık çıkar.
orhan: Kırk yedi makbuz efendim. Kırk yedisini de ben iptal etmedim.
ercan: Biliyorum efendim. Biliyorum.
> Teftiş raporu bir hafta sonra yazıldı. Tek cümlesi bütün dosyayı taşıyordu: “Sorumluluk kullanıcı hesabının sahibine aittir.”
> Kırk yedi makbuz. Üç yüz seksen altı bin dört yüz lira. Hepsi Orhan Kılıç’ın kullanıcı adıyla.
# SEKİZ AY SONRA [bg:sokak_yagmur]
> İddianame temmuzda geldi. Adli kontrol, yurt dışı yasağı, maaşın üçte biri. Kasımda, ilk celseden iki hafta önce, bir kadın bir avukatın kapısını çaldı.
`);

const BR00 = T(`
# PERŞEMBE 21.20 — ARSLAN HUKUK, BURSA [bg:buro_gece]
> Lodos camı titretiyordu. Büronun bütün ışıklarını söndürmüştüm, yalnızca masa lambası kalmıştı. Kapı çalındığında saatin dokuzu geçtiğini fark ettim.
~ Bursa’da kasımda iki şey bitmez: yağmur ve borç. Bu saatte kapı çalan biri ikisinden birini getirir.
> Önden kısa boylu, kırk beş yaşlarında bir kadın girdi; elinde kumaş bir alışveriş çantası, ağzında iki toplu iğne. İğneleri çıkarmadan konuştu.
nazan: Avukat hanım siz misiniz? Nazan Kılıç. Telefonda konuşmuştuk. Bu da Orhan. Eşim.
> Arkasındaki adam şemsiyesini kapattı, kapının yanına dayadı. Sonra damlamasın diye çantasından bir gazete çıkarıp şemsiyenin altına serdi. Gazete dün günündü.
orhan: İyi akşamlar efendim. Kusura bakmayın, bu saatte. Mesai saatinde gelemedik; adli kontrol imzası, sonra Nazan’ın provası.
nazan: Prova değil, terzilik. Kadın sorsa rakam söylemesin diye ben geldim, yoksa bu adam rakamla konuşur.
> Çantadan bir iddianame, bir dosya dolusu banka dökümü ve katlanmış bir hastane faturası çıktı. Faturanın üstünde bir çocuk adı: Elif Kılıç.
orhan: Kırk yedi makbuz efendim. Üç yüz seksen altı bin dört yüz lira. Yirmi üç ayrı günde.
nazan: Rakam söyleme Orhan, kadın rakam sormadı.
orhan: Kendisi sormadan söylemem gerekir Nazan. Rakam benim mesleğim. Kırk yedisinin hiçbirini ben iptal etmedim.
> Gözlüğünü çıkardı, mendiliyle sildi, yeniden taktı. Sanki temiz bir camdan bakarsa dünya daha düzgün görünecekmiş gibi.
- Sistemde sizin kullanıcı adınız var. Şifrenizi sizden başka biri biliyor muydu, Orhan Bey?
> Bir an sustu. Gözlüğü yeniden çıkardı. Bu kez silmedi; yalnızca elinde tuttu.
orhan: Şifre kişiye özeldir efendim.
~ Bu bir cevap değildi. Bir yönetmelik maddesiydi. İnsanlar bazen kendilerini kuralın arkasına saklar.
nazan: On dokuz yıl avukat hanım. On dokuz yılda bir kuruş eksiği çıkmadı bu adamın. Akşam yemeğinde ekmeği bile tartarak keser.
nazan: Kızımızın ameliyatı oldu geçen yıl. Kalp. Kredi çektik, sonra kapattık. Savcı “borçluydu, kasadan aldı” diyor. Borçlu olan herkes hırsız mı?
`);

const BR00_AFTER = T(`
> Nazan çantasını toplarken durdu; iğnelerin birini yakasına iliştirdi.
nazan: Bir şey daha. Evi satarım. Öderiz, biter. Duydum ki ödeyene ceza az veriyorlarmış.
orhan/kizgin: Nazan.
nazan: Ne Nazan? Belediyede herkes söylüyor. Ercan Bey bile dedi, “öderseniz hafifler” diye. Kızın okulu var Orhan.
orhan: Ödersem yaptım derim. Ben yapmadım.
> Kapı kapandı. Merdivenden ikisinin ayak sesleri indi; biri hızlı, biri ağır.
> Leyla koridordaki karanlıktan çıktı. Ne zamandır orada olduğunu bilmiyordum. Elinde sigara paketi; açılmamış, her zamanki gibi.
leyla: Ödemekle bitmez Deniz. Ödemek bir şeyi kabul etmektir. Sen o kapıyı açmadan önce, kapının arkasında ne olduğunu bil.
`);

const BR01 = T(`
> Leyla iddianameyi masama bıraktı. Lambanın ışığında kapağındaki mühür bir yara izi gibi duruyordu.
leyla: Sevk maddelerini sen oku. Savcıya göre: kasadaki parayı almış, gün sonu raporlarıyla oynayıp üstünü örtmüş, bunu yirmi üç ayrı günde yapmış.
leyla: Yarın Nazan Hanım sana bir rakam soracak. Doğru rakamı. Neyle karşı karşıyayız?
~ Rakam. Hukuk fakültesine sayısalcılar gelmez. Bu dosya bana bunu hatırlatmak için gelmiş.
`);

const BR01B = T(`
> Dosya altı klasördü. Leyla gittikten sonra lambayı kendime çevirdim ve sırayla açtım.
> Birinci klasör: teftiş raporu. Kırk sayfa, tablolar, bir sonuç cümlesi. Kullanıcı adı ve tutar. Başka sütun yok.
> İkincisi: iptal dökümü. Teftiş raporunun özetlediği listenin kendisi. Kimse sütunlarını tek tek okumamış; altı çizili tek kelime “okilic”.
> Üçüncüsü: kasa teslim tutanakları. Her biri imzalı, her biri düzgün, her biri gün sonu raporuyla kuruşu kuruşuna uyuşuyor. Fazla düzgün.
> Dördüncüsü: banka dökümü ve MASAK yazısı. Kredinin erken kapanışı sarıyla işaretlenmiş.
> Beşincisi: Ercan Tunalı’nın tanık ifadesi. Kibar, eksiksiz, dört sayfa. “Orhan Bey’i on dokuz yıldır tanırım.”
> Altıncısı: Melek Yavuz’un ifadesi. Tek sayfa, üç cümle. “Bir şey bilmiyorum. Görmedim. Orhan abi iyi insandır.”
~ Savcılığın elinde bir isim var. Benim elimde bir adam. Arada kırk yedi satır.
`);

const SABAH = T(`
# CUMA 08.25 — HİSARÖNÜ BELEDİYESİ ÖNÜ [bg:sokak_sabah]
> Yağmur gece dinmiş, sabah yeniden başlamaya hazırlanıyordu. Belediyenin önündeki bayraklar ıslak ve ağırdı; rüzgârda açılmıyor, yalnızca kıpırdıyordu.
> Köşede bir simitçi tezgâhının naylonunu düzeltiyordu. Cam kapının üstünde beyaz harflerle: VEZNE 08.30–17.00.
> Kapı açıldı. İçeri önce memurlar girdi; kartlarını turnikeye okutarak, birbirine selam vermeden. Sonra mükellefler; ellerinde dosyalar, yüzlerinde pazartesi.
~ On dokuz yıl her sabah bu kapıdan girmiş. Kartını okutmuş, camının arkasına oturmuş, parayı iki kez saymış.
~ Şimdi karşı kaldırımdan bakıyorum. Kapı aynı kapı. Kartı artık açmıyor.
> Telefonum titredi. Leyla’dan tek satır: “Kayıtlar bir isim yazar. Sen bir el bulmak zorundasın.”
`);

export const briefing: CasePart = {
  variables: flags('orhan_soz', 'orhan_kirgin'),
  nodes: [
    story('PR_00', {
      ...PRO,
      title: '17.51',
      background: 'sokak_karanlik',
      lines: [{ lines: PR00 }],
      choices: [cont('PR00_DEVAM', 'Devam', 'PR_01', { role: 'PRIMARY' })],
    }),
    story('PR_01', {
      ...PRO,
      title: 'Makbuz',
      background: 'buro',
      onFirstEnter: [meet('hayri'), meet('melek'), meet('orhan'), meet('ercan')],
      lines: [{ lines: PR01 }],
      choices: [cont('PR01_DEVAM', 'Dosyayı aç', 'BR_00', { role: 'PRIMARY' })],
    }),
    story('BR_00', {
      ...C1,
      title: 'Nazan Hanım',
      background: 'buro_gece',
      onFirstEnter: [meet('nazan')],
      lines: [{ lines: BR00 }],
      choices: [
        option('BR00_A', '“Bana her şeyi anlatacaksınız. Utandıklarınızı da.”', {
          effects: [raise('orhan_soz'), inc('trust', 6)],
          responses: B(`
- Bana her şeyi anlatacaksınız Orhan Bey. Rakamları da, utandıklarınızı da. Bilmediğim şeyi savunamam.
> Orhan gözlüğünü taktı. Bir şey diyecekti; demedi. Nazan onun yerine konuştu.
nazan: Anlatır. Ben anlattırırım. Yirmi iki yıldır anlattırıyorum, bir kere bile tam anlatmadı ama.
orhan: Anlatırım efendim. Söz.
~ Sözü verdi. Ne kadarını tutacağını bilmiyordu. Ben de bilmiyordum.
`),
          next: 'BR_00B',
        }),
        option('BR00_B', '“Önce dosyayı okuyayım; sonra konuşuruz.”', {
          responses: B(`
- Önce dosyayı okuyayım. Okumadan konuşursam size umut satarım, okuduktan sonra gerçeği söylerim.
nazan: Gerçeği söyleyin de. Biz de onu istiyoruz.
orhan: Okuyun efendim. Her sayfasını. Ben de okudum, bir şey anlamadım ama okudum.
`),
          next: 'BR_00B',
        }),
        option('BR00_C', '“Masumsanız korkacak bir şey yok.”', {
          effects: [raise('orhan_kirgin'), dec('trust', 4)],
          responses: B(`
- Masumsanız korkacak bir şey yok Orhan Bey.
nazan/kizgin: Masumlar da hapse giriyor avukat hanım. Gazete okumuyor musunuz?
> Orhan karısının koluna dokundu. Bana baktı; kırgın değildi, yorgundu.
orhan: Korkmuyorum efendim. Utanıyorum. Korkmak başka, utanmak başka.
~ Ezberlenmiş bir avukat cümlesi kurdum ve karşılığında dosyanın ilk gerçek cümlesini duydum: “Utanıyorum.” Neden?
`),
          next: 'BR_00B',
        }),
      ],
    }),
    story('BR_00B', {
      ...C1,
      title: 'Kapı',
      background: 'buro_gece',
      onFirstEnter: [meet('leyla')],
      lines: [{ lines: BR00_AFTER }],
      choices: [cont('BR00B_DEVAM', 'Leyla’yı dinle', 'BR_01', { role: 'PRIMARY' })],
    }),
    story('BR_01', {
      ...C1,
      title: 'Dosya devri',
      background: 'buro_gece',
      lines: [{ lines: BR01 }],
      choices: [
        option('BR01_A', '247/1-2 ve 43: 7,5–18 yıl, üstüne ¼–¾', {
          score: { HUKUKI_BILGI: 50 },
          good: 'Doğru: zimmet 5–12 yıl (TCK 247/1); hileli davranışla işlenince yarı oranında artırılır (247/2: 7 yıl 6 ay–18 yıl); zincirleme suçta ¼–¾ artırım (TCK 43/1).',
          responses: B(`
- 247/1 ve 2, artı 43. Temel ceza beş ile on iki yıl; hile yarı oranında artırır, yedi buçuk ile on sekiz. Zincirleme dörtte birden dörtte üçe kadar ekler.
leyla/mutlu: Doğru. Yani en iyi ihtimalle mahkûmiyette dokuz yılın üstünden başlıyoruz. Görevli mahkeme ağır ceza.
> Sigara paketini ters çevirdi. Leyla’nın alkışı budur.
leyla: Bir de şunu bil: zimmetin ilk kelimesi “zilyetlik.” Görevi gereği parayı elinde tutan, onu koruyan kişi. Para o akşam kimin elindeydi? Bunu bul.
`),
          next: 'BR_01B',
        }),
        option('BR01_B', '247/1 ve 43: 5–12 yıl, üstüne ¼–¾', {
          bad: 'Hileli davranış (TCK 247/2) cezayı yarı oranında artırır; iddianame 247/1-2 ve 43 der: 7 yıl 6 ay–18 yıl, üstüne zincirleme artırımı.',
          category: 'HUKUKI_BILGI',
          responses: B(`
- 247/1 ve 43. Beş ile on iki yıl, zincirleme artırımıyla.
leyla: Hileyi unuttun. İddianame “gün sonu raporları yeniden düzenlenmiş” diyor; bu hileli davranıştır, ceza yarı oranında artar. Yedi buçuk ile on sekiz.
leyla: Karısına yanlış rakam söylersen, o rakam o evde yıllarca konuşulur.
`),
          next: 'BR_01B',
        }),
        option('BR01_C', '247/1 ve 247/3: 5–12 yıl, geçici kullanımda yarıya iner', {
          bad: 'TCK 247/3, malı geri vermek amacıyla geçici kullanım içindir; iddianame bunu değil, hileli ve zincirleme zimmeti (247/1-2, 43) suçluyor.',
          category: 'HUKUKI_BILGI',
          responses: B(`
- Geçici kullanım? 247/3, ceza yarıya kadar iner.
leyla: O, parayı kullanıp geri koymak isteyen memur içindir. Müvekkilin bir kuruş almadığını söylüyor. Ona “ödünç aldın” mı diyeceksin?
leyla: İddianame 247/1-2 ve 43. Yedi buçuk ile on sekiz, artı zincirleme.
`),
          next: 'BR_01B',
        }),
        option('BR01_D', '155/2 ve 43: 1–7 yıl, üstüne ¼–¾', {
          bad: 'Kamu görevlisinin görevi nedeniyle zilyetliğindeki kamu malını alması zimmettir (TCK 247); güveni kötüye kullanma (155/2) özel hukuk ilişkileri içindir.',
          category: 'HUKUKI_BILGI',
          responses: B(`
- Hizmet nedeniyle güveni kötüye kullanma? 155/2, bir ile yedi yıl.
leyla: O, bir şirketin kasiyeri için. Belediyenin veznedarı kamu görevlisidir; kamu parası zimmetin konusudur. 247.
leyla: Fiilin adı bazen davanın kendisidir. Ama bu dosyada ad belli. Sorun, adın kime yazıldığı.
`),
          next: 'BR_01B',
        }),
      ],
    }),
    story('BR_01B', {
      ...C1,
      title: 'Altı klasör',
      background: 'buro_gece',
      lines: [{ lines: BR01B }],
      choices: [cont('BR01B_DEVAM', 'Dosya özetine geç', 'BR_02', { role: 'PRIMARY' })],
    }),
    story('BR_02', {
      ...C1,
      phase: 'BRIEFING',
      title: 'Belediye Kasası',
      background: 'buro_gece',
      blocks: [
        {
          type: 'profileCard',
          character: 'orhan',
          label: 'MÜVEKKİL',
          lines: ['Orhan Kılıç, 47', 'Veznedar · 19 yıl, sicili temiz', 'Tutuksuz · adli kontrol'],
          charge: 'Zimmet (TCK 247/1-2, 43)',
          demand: 'İddianame: 7 yıl 6 ay–18 yıl, zincirleme artırımı',
        },
        {
          type: 'sentenceRange',
          segments: ['green', 'green', 'gold', 'gold', 'red', 'red', 'darkred', 'darkred'],
          markerPct: 34,
          labels: ['Beraat', '257/2: 3a–1y', '9y4a', '31y6a'],
          demandLabel: 'İSTEM: 247/1-2, 43',
        },
        {
          type: 'paragraph',
          title: 'OLAY ÖZETİ',
          text: '3 Kasım 2025 ile 27 Şubat 2026 arasında Hisarönü Belediyesi vezne programında, veznedar Orhan Kılıç’ın kullanıcı adıyla 23 günde 47 tahsilat makbuzu iptal edildi; kasada 386.400 TL açık doğdu. Açık, bir mükellefin borç bildirimine itirazıyla ortaya çıktı. Orhan Kılıç iptallerin hiçbirini yapmadığını söylüyor.',
        },
        {
          type: 'strengthList',
          title: 'SAVCILIĞIN ELİNDEKİLER',
          items: [
            { label: 'İptal kayıtları: kullanıcı okilic', strength: 'STRONG' },
            { label: 'Teftiş raporu', strength: 'STRONG' },
            { label: 'İmzalı teslim tutanakları', strength: 'MEDIUM' },
            { label: 'Kredinin erken kapanışı', strength: 'MEDIUM' },
            { label: 'Müdür yardımcısının ifadesi', strength: 'MEDIUM' },
          ],
        },
        {
          type: 'choiceGroup',
          title: 'SAVUNMA STRATEJİSİ SEÇ',
          group: 'g_strateji',
          hints: {
            STR_MASUMIYET: 'Masumiyet: beraat hedeflenir; stratejine uyan esas savunma ×1,5 puan.',
            STR_USUL:
              'Usul: kayıtların sanığı göstermediğini ve teftiş raporunun yetersizliğini savunursun; uyan esas savunma ×1,2 puan.',
            STR_INDIRIM: 'Terditli savunma: önce beraat, aksi hâlde daha hafif bir suç; uyan esas savunma ×0,8 puan.',
          },
        },
      ],
      choices: [
        option('STR_MASUMIYET', 'Masumiyet', {
          group: 'g_strateji',
          effects: [set('strategy', 'MASUMIYET'), set('strategy_pct', 150), ...p1.start()],
          responses: B(`
leyla: Kayıtlar bir isim yazar Deniz. Sen bir el bulmak zorundasın. Eli bulamazsan, isim kazanır.
`),
          next: 'INV_SABAH',
        }),
        option('STR_USUL', 'Usul', {
          group: 'g_strateji',
          effects: [set('strategy', 'USUL'), set('strategy_pct', 120), ...p1.start()],
          responses: B(`
leyla: Teftiş raporu bilirkişi raporu değildir. Bunu unutan çok olur; savcı da, hâkim de. Sen unutma.
`),
          next: 'INV_SABAH',
        }),
        option('STR_INDIRIM', 'Terditli savunma', {
          group: 'g_strateji',
          effects: [set('strategy', 'INDIRIM'), set('strategy_pct', 80), ...p1.start()],
          responses: B(`
leyla: Güvenli. Ama müvekkiline “en azından ihmal” diyeceksin. On dokuz yılı olan bir adama. Dayanabilir mi?
`),
          next: 'INV_SABAH',
        }),
      ],
    }),
    story('INV_SABAH', {
      ...INV,
      title: 'Belediye önü',
      background: 'sokak_sabah',
      lines: [{ lines: SABAH }],
      choices: [cont('SABAH_DEVAM', 'Soruşturmaya başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
  ],
};
