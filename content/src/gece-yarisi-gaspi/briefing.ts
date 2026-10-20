import { cont, meet, option, raise, set, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, T } from './dsl.js';
import { C1, INV, PRO, p1 } from './shared.js';

// 40-briefing: soğuk açılış, Derya’nın büroya gelişi, Leyla’nın devri, ceza aralığı, dosya ve strateji, ilk sabah.

const PR00 = T(`
# 18 OCAK · GECE 23.42 — TOPHANE, SIRMAKEŞ MERDİVENLERİ [bg:sokak_karanlik]
> Sırmakeş merdivenleri altmış dört basamaktır. Gündüz turistler sayar. Gece kimse saymaz; inen iner, çıkan çıkar.
> Yağmur akşamdan beri inceden yağıyordu. Taş basamaklar ıslaktı; her biri, üstündeki tek sokak lambasının ışığını ayrı ayrı yansıtıyordu.
> Bir kadın iniyordu. Altmışına yakın, omuzları düşük, elinde eski bir deri çanta. Ağzında bir türkünün mırıltısı; sözlerini çoktan unutmuş biri gibi.
> Gece vardiyasından çıkmıştı. Ayakları ağrıyordu. Evine on dakikalık yol vardı ve bu on dakikayı her gece aynı türküyle yürürdü.
> Merdivenin başındaki eczanenin camında nöbet levhası yanıp sönüyordu. Bir kedi bir saçağın altına sığınmıştı. Bakkalın radyosundan bir maç sonucu, sonra reklam.
> Kadın on beşinci basamakta durdu, nefeslendi, çantasını öbür omzuna aldı. Bir alışkanlık; kırk yıldır sol omzunda taşırdı, yorulunca sağa alırdı. O gece almadı.
> Merdivenin dibinde bir motor rölantide homurdanıyordu. Farı kapalıydı. Arkasında sarı bir kurye kutusu, yağmurda parlıyordu.
> Basamakları ikişer ikişer çıkan adımlar. Hızlı, hafif, genç. {shake}
> Kadın döndü. Kapüşon, karanlık bir yüz, yağmurdan ıslanmış bir mont.
@KAPÜŞONLU: Bırak!
> Bir el çantaya yapıştı. Kadın bırakmadı. Kırk yıl hastane koridorlarında hasta taşımış kollar kolay bırakmaz.
> Bir şey parladı. Belki bir bıçak. Belki bir küpe. Belki yalnızca yağmurun sokak lambasında kırılışı. {flash}
> Sonra bir itiş. Kadın sırtüstü basamaklara düştü. Avucu bir şeyin üstüne kapandı; keskin, soğuk, sonra sıcak.
> Askı koptu. Adımlar basamaklardan aşağı indi, motor kükredi, sarı kutu sokağın ucunda bir kez daha parladı ve kayboldu.
> Kadın oturduğu yerden kalkamadı. Avucunu açtı. Kan, yağmur suyuyla karışıp parmaklarının arasından akıyordu.
> Çantada cüzdanı vardı. Telefonu vardı. Bir de eşinin, on iki yıl önce ölen eşinin köstekli saati. Her gece yanında taşırdı; “İsmail benimle eve gelsin” diye.
> Merdivenin dibindeki bakkalın ışığı hâlâ yanıyordu. Bakkal kepengin yarısını indirmiş, kapıdan bakıyordu.
@BAKKAL: Abla! Abla iyi misin? Dur, kalkma, ben geliyorum!
> Telefon. Hat. Bir ses.
@112 ACİL: 112 Acil, dinliyorum. [phone]
@KADIN: Çantamı aldılar… Merdivende… Sırmakeş’te. İtti beni, düştüm, elim kesildi… [phone]
@112 ACİL: Kim aldı hanımefendi? Gördünüz mü? [phone]
@KADIN: Kurye gibiydi… sırtında sarı kutu vardı. Genç. İnce. Kulağında… kulağında bir şey parladı… [phone]
> Kadın ağlamıyordu. Henüz değil. Ağlamak, insanın aklına bir şey geldiğinde başlar; o an aklında hiçbir şey yoktu.
> Kurtarılamayan bir saat vardı. Ve bir yüz. Sadece bir an görülmüş, yağmurla yarı silinmiş bir yüz.
> Ertesi sabah o yüzü ona başka biri hatırlatacaktı. {fade}
`);

const PR01 = T(`
# 19 OCAK · 00.40 — DEVLET HASTANESİ, ACİL SERVİS [bg:hastane]
> Yeşil alanın florasanı vızıldıyordu. Bir monitör bipliyordu; kimse ona bakmıyordu.
> Kadın sedyenin kenarında oturuyordu. Sol avucunda iki dikiş, gazlı bez, bir bandaj. Hemşire sargıyı sararken kadın gözlerini duvardaki saate dikmişti.
> Kapı açıldı. Islak montlu, kırk yaşlarında bir adam girdi. Saçından su damlıyordu; yürürken bir yandan telefonuna bakıyordu.
@BİR POLİS: Teyze, geçmiş olsun. İki dakika. Çok yorulmayacaksın.
> Sedyenin yanına çöktü. Hemşire bir şey söyleyecek oldu; adam elini kaldırdı, “iki dakika” dedi. Perde yarıya kadar çekildi.
> Perdenin arkasından sesler geldi. Kelimeler monitörün bipine karışıyordu.
@BİR POLİS: …iyice… acele etme… kaydı var… bıçak…
@KADIN: …karanlıktı… kapüşonu vardı… bilmiyorum…
> Bir sessizlik. Monitör üç kez öttü. Sonra kadının sesi, daha ince, daha uzaktan.
@KADIN: Galiba… Evet. Galiba.
> Sonra ağlamaya başladı. Hemşire perdeyi açtı ve adamı kolundan tutup kapıya kadar götürdü. Masasına döndü, bir forma bir şey yazdı.
> Kimse ne yazdığını sormadı. Kimse perdenin arkasında ne olduğunu da sormadı.
# 19 OCAK · SABAH 08.10 — YILDIRIM, MİMAR SİNAN MAHALLESİ [bg:sokak_sabah]
> Sıra apartmanların arasında bir ekip aracı. Üçüncü katta bir kapı çalındı. Sonra bir kez daha, daha sert.
> Kapıyı ateşten kızarmış yüzlü bir genç açtı. Üstünde eşofman, boynunda bir havlu. Sesi kısıktı.
@GENÇ: Buyurun? Ne oldu?
@BİR POLİS: Gaspa karışmaktan gözaltındasın. Giyin.
> Arkadan bir kadın sesi yükseldi. Tespihli bir el kapının kenarına tutundu.
@ANNE: Ne gaspı? Evdeydi! Bütün gece evdeydi, ateşi var, ben bezle sildim alnını!
> Kimse yazmadı. Gencin telefonu şeffaf bir poşete girdi. Merdivenlerde kelepçe şıkırdadı. {shake}
> Üst kattaki balkonda yaşlı bir adam, gözlüğünü burnuna itti ve aşağı baktı. Bir şey söyleyecek gibi oldu. Sonra perdeyi çekti.
> İki gün sonra genç tutuklandı. İki ay sonra iddianame geldi: nitelikli yağma, Ağır Ceza.
> Birinci celseye on iki gün kala, ablası bir avukat aradı.
`);

const BR00 = T(`
# CUMA 21.15 — ARSLAN HUKUK, BURSA [bg:buro_gece]
~ Bursa’da gece yarısından önce iki şey açık kalır: fırınlar ve kötü haberler.
> Büro boşalmıştı. Stajyerler gitmiş, kimse kahve makinesini kapatmamıştı. Camın üstünden yağmur damlaları birbirini kovalıyordu.
~ Bir yüzü hatırlamak, onu yeniden çizmektir. Bunu bir hukuk kitabında okumadım. Bir müvekkilim öğretti; ben onu kaybettikten sonra.
~ O gün de bir tanık “eminim” demişti. Ben de onun eminliğine inanmıştım. Hâkim de.
> Kapı çaldı. Bir kez, sertçe. Beklemeden bir kez daha.
> İçeri otuzuna yakın bir kadın girdi. Kapıda sigarasını söndürdü, izmariti avucunda tuttu; kül tablası aradı, bulamadı, cebine koydu.
derya: Kusura bakma canım, bu saatte. Salonu ancak kapattım. Derya. Derya Kılınç. Kardeşim için geldim.
- Buyurun, oturun. Çay?
derya: Çay içersem ağlarım. Kahve varsa.
> Kahve vardı. Soğuktu. İçti. Masaya bir salon randevu defteri, kalın bir zarf ve bir kurye kimlik kartı koydu.
derya: Barış Kılınç. Yirmi iki yaşında. Motokurye. Bir kadının çantasını kapmış diyorlar. Bıçakla.
derya: Kardeşim kimseyi soymaz. Kendi motorunu yıkatamayacak kadar tembeldir. Bıçak mı? Ekmek keserken parmağını keser o.
> Kartı bana doğru itti. Fotoğrafta uzun saçlı, sakallı, gülümsemeye çalışan bir genç. Kartın köşesi aşınmıştı.
derya: Bu kartı cebinde taşırdı. Polis telefonuyla birlikte almış, sonra kapıda anneme geri vermiş. “Bu lazım olmaz” demiş. Lazım oldu işte; sana getirdim.
~ Bir yüz. Kasımda çekilmiş, bir kurye kartında. Dosyada başka bir yüz var; üç yıl önce, bir karakol duvarının önünde. Aynı insan mı? Kâğıtta aynı ad.
- Dosyada ne olduğunu biliyor musunuz?
derya: Kadın onu fotoğraftan tanımış. Karakolda. Altı fotoğrafın arasından seçmiş.
derya: Bir de… dur, ben söyleyeyim, sonra başkasından duyma. Üç yıl önce bir düğünde kavgaya karıştı. Birine yumruk attı. Mahkeme cezayı geri bıraktı mı, ne dediler.
derya/kizgin: Polisin elinde o günün fotoğrafı var. Bütün mesele bu. Bir kere fotoğrafın çekildi mi, bu şehirde ömür boyu şüphelisin.
> Sesi yükselmedi. Sadece kelimeleri daha kısa kesti; bir makasın uçları gibi.
derya: Annem perişan. Kırk gündür ağzına doğru dürüst bir şey koymuyor. Her gece Barış’ın yatağını yapıyor. Sabah bozuyor. Akşam yine yapıyor.
derya: Ben salonun kirasını biriktiriyordum. Dükkânı büyütecektim, iki koltuk daha. İşte.
> Zarfı masanın ortasına koydu ve elini üstünden çekmedi. Tırnaklarında kurumuş saç boyası vardı; bordo.
derya: Yetmezse söyle. Bir yolunu bulurum. Ne olursa.
~ Zarfın içinde iki koltuk vardı. Bir salonun geleceği. Ve benden bir cümle bekleniyordu.
> Derya bir an pencereye baktı. Yağmur, Uludağ’ın yamacından aşağı, şehrin bütün çatılarına aynı anda yağıyordu.
`);

const BR01 = T(`
> Derya kapıya kadar yürüdü. Elini kapı koluna koydu ve durdu.
derya: Bir şey daha…
> Döndü. Bir şey söyleyecekti; ağzını açtı, kapattı.
derya: Yok. Boş ver. Sonra.
> Gitti. Merdivenlerde topukları, sonra sokak kapısı, sonra yalnızca yağmur.
~ İnsanlar “boş ver” dediklerinde, boş verilmemesi gereken bir şeyi taşıyorlardır. Not aldım.
> Kapının eşiğinde Leyla Erdem belirdi. Ne zamandır orada olduğunu bilmiyordum. Otuz yıldır ağır ceza dosyası taşıyan biri sessiz yürümeyi öğrenir.
leyla: Ağlayan bir ablaya söz verme Deniz. Okunmamış bir dosyaya hiç verme.
- Duydunuz mu?
leyla: Bu binada duvarlar incedir. Ben de inceyimdir.
> Masama bir klasör bıraktı. Kenarları yıpranmış, kapağında kırmızı kalemle bir dosya numarası. UYAP çıktıları, iddianame, tutanaklar.
leyla: Barış Kılınç artık senin. Dosyanın tamamını indirdim. On iki gün sonra birinci celse. Mağdur kürsüye gelecek.
leyla: Kadın yalan söylemiyor. Bunu baştan bil. Bu dosyada senin düşmanın bir yalancı değil.
- O zaman ne?
leyla: Bir hafıza.
> Karşıma oturdu. Masasından getirdiği sigara paketini önüne koydu. Bırakalı dört yıl oldu. Paket hâlâ dolu.
leyla: Dosyayı açmadan önce bir şey bil. Neyle karşı karşıyayız? İddianamedeki suçun cezası ne?
~ Klasörün kapağında “yağma” yazıyordu. Altında iki küçük harf: a ve h. Gerisi bendeydi.
`);

const BR01B = T(`
> Leyla altı kâğıdı tek tek masaya dizdi. Bir falcının kartları gibi; ama bu falın sonu belliydi, değiştirilmesi gerekiyordu.
leyla: İddianame. Mağdurun karakoldaki ifadesi. Fotoğrafla teşhis tutanağı. Adli muayene raporu. Üç yıl önceki gözaltı kaydı.
leyla: Bir de bu.
> Altıncı kâğıdı ötekilerin biraz uzağına koydu. İnce, yarısı boş bir form.
leyla: İhbar formu ve çağrı dökümü. Dosyada var. Savcı okumamış, polis okumamış, önceki avukat okumamış.
- Siz okudunuz mu?
leyla: Ben dosyaları senin için okumam. Okuyup okumadığını görmek için okurum.
~ Kimsenin okumadığı kâğıt, okunmayı bekleyen kâğıttır.
leyla: Bir de önceki avukat. Zorunlu müdafi; karakolda ifadesinde hazır bulunmuş, sonra bir daha görünmemiş. Kötü biri değil. Gece üçte çağrılmış, sabah dokuzda başka bir dosyası varmış.
leyla: Bu meslekte herkesin bir sabah dokuzu var Deniz. Bu dosya, birinin sabah dokuzunda okunmadan geçilmiş bir gece.
> Leyla ayağa kalktı. Masasına döndü. Masanın köşesinde ters çevrilmiş bir çerçeve duruyordu; yıllardır öyle.
~ Hiç sormadım. Sormamam gerektiğini biliyordum.
leyla: Bir şey daha. Teşhis tutanağında sonuca değil, usule bak. Sonuç tek kelimedir; usul bir hikâyedir.
leyla: Bir yüzü tanımak kolaydır. O yüzü nerede, kimin yanında tanıdığını hatırlamak zordur.
`);

const SABAH = T(`
# PAZARTESİ 08.30 — SIRMAKEŞ MERDİVENLERİ [bg:sokak_sabah]
> Merdivenleri saydım. Altmış dört. Otuz birincisinde durdum. Taşta hiçbir şey yoktu; üç ay, binlerce adım, yüzlerce yağmur.
~ Olay yerine bugün gitsem bir şey bulamam. Şişe süpürüldü, kan yıkandı, sokak unuttu. Fotoğraflar unutmaz.
> Aşağıda bakkal kepengini kaldırıyordu. Altmışlarında, göbekli, beyaz bıyıklı. Süpürgesini bıraktı, beni tepeden tırnağa süzdü.
ali: Avukat mısın gazeteci mi? İkisi de soru sorar, biri para ister.
- Avukatım.
ali: O zaman öbürü. Hayırdır?
- Ocak’ta burada bir kadın soyuldu.
ali: Nermin abla. Bilmez miyim. Benim telefonumdan aradı polisi. Sonra gel, çay koyarım; şimdi ekmekçi gelecek.
> Kepengin gıcırtısı merdivenler boyunca yukarı tırmandı. Bir martı, Bursa’nın denize uzak göğünde neden olduğunu bilmeden çığlık attı.
~ Bir dosya, bir şehir ve on iki gün. Nereden başlayacağımı biliyordum: kimsenin okumadığı kâğıttan.
`);

export const briefing: CasePart = {
  nodes: [
    story('PR_00', {
      ...PRO,
      title: 'Gece 23.42',
      background: 'sokak_karanlik',
      lines: [{ lines: PR00 }],
      choices: [cont('PR00_DEVAM', 'Acil servis', 'PR_01', { role: 'PRIMARY' })],
    }),
    story('PR_01', {
      ...PRO,
      title: 'Acil 00.40',
      background: 'hastane',
      lines: [{ lines: PR01 }],
      choices: [cont('PR01_DEVAM', 'Üç ay sonra', 'BR_00', { role: 'PRIMARY' })],
    }),
    story('BR_00', {
      ...C1,
      title: 'Derya',
      background: 'buro_gece',
      onFirstEnter: [meet('deniz'), meet('derya')],
      lines: [{ lines: BR00 }],
      choices: [
        option('BR00_A', '“Ücreti sonra konuşuruz.”', {
          effects: [raise('derya_not')],
          responses: B(`
- Zarfı şimdilik kaldırın Derya Hanım. Önce dosyayı okuyayım, Barış’la görüşeyim. Ücretin lafı sonra.
derya: Canım… Peki. O zaman bir şey rica edeceğim. Cezaevine gidince bunu verir misin? Annemden.
> Dört kat katlanmış bir kâğıt. Üstünde kurşun kalemle tek satır: “Annem iyi. Sen dayan.” Altında bir kalp, titrek.
- Veririm.
~ Küçük bir söz. Küçük sözler daha zor tutulur; çünkü kimse onları tuttuğunu fark etmez.
`),
          next: 'BR_01',
        }),
        option('BR00_B', '“Önce vekâletname ve ücret.”', {
          responses: B(`
- Önce vekâletnameyi ve ücret sözleşmesini konuşalım; sürecin nasıl işleyeceğini anlatayım.
> Tarifeyi, masrafları, duruşma günlerini anlattım. Derya dinledi, başını salladı, zarftan saydığı parayı masaya koydu.
derya: Tamam. Makbuz kes canım. Ben de salonda keserim, adet.
~ Düzgün bir başlangıç. Düzgün başlangıçlar insanı rahatlatır; ama hiçbir zaman bir dosyayı kazandırmaz.
`),
          next: 'BR_01',
        }),
        option('BR00_C', '“Söz veremem; ama her sayfayı okuyacağım.”', {
          effects: [raise('deniz_durust')],
          responses: B(`
- Size bir sonuç sözü veremem Derya Hanım. Veren avukata da güvenmeyin. Ama dosyanın her sayfasını okuyacağım. Her birini.
> Derya uzun uzun yüzüme baktı. Sonra ilk kez gülümsedi; yorgun, kısa.
derya: Bana “kesin kurtarırım” diyen iki avukata gittim. İkisi de saçımı yapan kadın gibi baktı yüzüme. Sen ilk “bilmiyorum” diyensin.
~ Dürüstlük bazen bir müvekkili kazandırır. Bazen kaybettirir. Hangisi olduğunu hep sonradan öğrenirsin.
`),
          next: 'BR_01',
        }),
      ],
    }),
    story('BR_01', {
      ...C1,
      title: 'Dosya devri',
      background: 'buro_gece',
      onFirstEnter: [meet('leyla')],
      lines: [{ lines: BR01 }],
      choices: [
        option('BR01_A', '149/1-a, h: 10–15 yıl', {
          score: { HUKUKI_BILGI: 50 },
          good: 'Doğru: silahla (TCK 149/1-a) ve gece vaktinde (149/1-h) yağma; on yıldan on beş yıla. İki nitelikli hâl temel cezayı alt sınırdan uzaklaştırabilir (TCK 61/1).',
          responses: B(`
- 149/1-a ve h. Silahla, gece vaktinde. On yıldan on beş yıla.
leyla/mutlu: Doğru. Basit yağma altı ile on yıl. Nitelikli hâllerden biri bile on yıla çıkarır. Burada iki tane var.
leyla: İki nitelikli hâl olunca hâkim alt sınırdan başlamayabilir. Yirmi iki yaşında bir çocuk için on iki yıl demek bu.
> Sigara paketini ters çevirdi. Leyla’nın alkışı budur.
leyla: Bir de şunu bil: “silahla” dedikleri bıçak, dosyada yok. Ne bulunmuş ne görülmüş. Sadece söylenmiş.
~ Söylenmiş. Kim tarafından, ne zaman, kimin yanında? Kâğıtlara döndüm.
`),
          next: 'BR_01B',
        }),
        option('BR01_B', '148/1: 6–10 yıl', {
          bad: 'Basit yağma (TCK 148/1) iddianamedeki nitelikli hâlleri karşılamaz; silah ve gece vakti 149/1-a, h ile 10–15 yıl.',
          category: 'HUKUKI_BILGI',
          responses: B(`
- Yağma… 148/1? Altı ile on yıl?
leyla: Bu basit yağma. İddianame iki nitelikli hâl yazıyor: silah ve gece vakti. 149/1-a ve h. On ile on beş yıl.
leyla: Savcıdan önce müvekkilinin annesine yanlış rakam söylersen, o rakam o evde yıllarca konuşulur.
~ Yanaklarım yandı. Leyla paketi çevirmedi.
`),
          next: 'BR_01B',
        }),
        option('BR01_C', '142/2-a kapkaç: 5–10 yıl', {
          bad: 'Kapkaç nitelikli hırsızlıktır (TCK 142/2-a); cebir ya da tehdit kullanılınca fiil yağmaya dönüşür. İddianame 149/1-a, h: 10–15 yıl.',
          category: 'HUKUKI_BILGI',
          responses: B(`
- Çanta kapma… Kapkaç değil mi? Beş ile on yıl?
leyla: Kapkaç hırsızlıktır. Kadını iten, çantaya karşı koymasını cebirle kıran fail yağma yapmış olur. İddianame de öyle diyor: 149/1-a ve h.
leyla: Ama düşünmen iyi. Fiilin adı bazen davanın kendisidir. Aklında tut.
~ Leyla eleştirirken bile bir kapı aralık bırakır. O kapıdan geçip geçmemek sana kalır.
`),
          next: 'BR_01B',
        }),
        option('BR01_D', '149/1 + gece vakti için ayrıca yarı artırım', {
          bad: 'Gece vakti artırımı (TCK 143) hırsızlığa özgüdür; yağmada gece vakti zaten nitelikli hâldir (149/1-h). Aralık 10–15 yıl.',
          category: 'HUKUKI_BILGI',
          responses: B(`
- Nitelikli yağma, artı gece vakti için ayrıca yarı oranında artırım?
leyla: O artırım hırsızlıkta. Yağmada gece vakti zaten nitelikli hâllerden biri: 149/1-h. Bir hâli iki kere saymazsın.
leyla: On ile on beş yıl. Ve hâkim iki hâl gördüğü için alt sınırda durmayabilir.
`),
          next: 'BR_01B',
        }),
      ],
    }),
    story('BR_01B', {
      ...C1,
      title: 'Altı kâğıt',
      background: 'buro_gece',
      lines: [{ lines: BR01B }],
      choices: [cont('BR01B_DEVAM', 'Dosyayı aç', 'BR_02', { role: 'PRIMARY' })],
    }),
    story('BR_02', {
      ...C1,
      phase: 'BRIEFING',
      title: 'Gece Yarısı Gaspı',
      background: 'buro_gece',
      onFirstEnter: [meet('baris'), meet('nermin')],
      blocks: [
        {
          type: 'profileCard',
          character: 'baris',
          label: 'MÜVEKKİL',
          lines: ['Barış Kılınç, 22', 'Motokurye · 2023’te HAGB’li yaralama', 'Tutuklu · Bursa H Tipi'],
          charge: 'Nitelikli yağma (TCK 149/1-a, h)',
          demand: 'İddianame: 10–15 yıl',
        },
        {
          type: 'sentenceRange',
          segments: ['green', 'gold', 'gold', 'red', 'red', 'red', 'darkred', 'darkred'],
          markerPct: 62,
          labels: ['Beraat', '62: 8y4a', '10 yıl', '15 yıl'],
          demandLabel: 'İSTEM: 149/1-a, h',
        },
        {
          type: 'paragraph',
          title: 'OLAY ÖZETİ',
          text: '18 Ocak 23.42’de Tophane Sırmakeş merdivenlerinde Nermin Aksoy (59) itilerek çantası alındı; sol avucu kesildi. Mağdur 112’yi aradı. Ertesi sabah karakolda altı fotoğraf arasından Barış Kılınç’ı teşhis etti. Barış o gece ateşli olarak evde olduğunu söylüyor. Çanta, cüzdan ve bir köstekli saat bulunamadı.',
        },
        {
          type: 'strengthList',
          title: 'SAVCILIĞIN ELİNDEKİLER',
          items: [
            { label: 'Fotoğrafla teşhis (mağdur, “hemen”)', strength: 'STRONG' },
            { label: 'Mağdurun kolluk ifadesi (bıçak)', strength: 'MEDIUM' },
            { label: 'Kuryelik ve bölgede çalışma', strength: 'MEDIUM' },
            { label: '2023 yaralama kaydı', strength: 'WEAK' },
            { label: 'Adli rapor (kesi)', strength: 'WEAK' },
          ],
        },
        {
          type: 'choiceGroup',
          title: 'SAVUNMA STRATEJİSİ SEÇ',
          group: 'g_strateji',
          hints: {
            STR_MASUMIYET: 'Masumiyet: beraat hedeflenir; stratejine uyan esas savunma ×1,5 puan.',
            STR_USUL: 'Usul: teşhisin hükme esas alınamayacağını savunursun; uyan esas savunma ×1,2 puan.',
            STR_INDIRIM: 'Terditli savunma: önce beraat, aksi hâlde lehe hükümler; uyan esas savunma ×0,8 puan.',
          },
        },
      ],
      choices: [
        option('STR_MASUMIYET', 'Masumiyet', {
          group: 'g_strateji',
          effects: [set('strategy', 'MASUMIYET'), set('strategy_pct', 150), ...p1.start()],
          responses: B(`
leyla: Cesur. Bir kadının bir yüzü hatırladığından emin olduğu dosyada masumiyet, onun hafızasıyla kavga etmek demek.
leyla: Kavga etme. Anla. Kazanırsan, onu anlayarak kazanırsın.
`),
          next: 'INV_SABAH',
        }),
        option('STR_USUL', 'Usul', {
          group: 'g_strateji',
          effects: [set('strategy', 'USUL'), set('strategy_pct', 120), ...p1.start()],
          responses: B(`
leyla: Teşhis bir usuldür. Usulü yanlış yapılmış teşhis, yapılmamış teşhistir.
leyla: Ama heyet usulden önce insana bakar. Kâğıdın yanına bir de hikâye koy.
`),
          next: 'INV_SABAH',
        }),
        option('STR_INDIRIM', 'Terditli savunma', {
          group: 'g_strateji',
          effects: [set('strategy', 'INDIRIM'), set('strategy_pct', 80), ...p1.start()],
          responses: B(`
leyla: Güvenli. Önce beraat, olmazsa lehe hükümler.
leyla: Ama müvekkiline “en kötü ihtimalle sekiz yıl” demeye hazır mısın? Masum olduğunu söyleyen birine?
`),
          next: 'INV_SABAH',
        }),
      ],
    }),
    story('INV_SABAH', {
      ...INV,
      title: 'Sırmakeş, sabah',
      background: 'sokak_sabah',
      onFirstEnter: [meet('ali')],
      lines: [{ lines: SABAH }],
      choices: [cont('SABAH_DEVAM', 'Soruşturmaya başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
  ],
};
