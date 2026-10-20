import { cont, meet, option, raise, set, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, T } from './dsl.js';
import { C1, INV, PRO, p1 } from './shared.js';

// 40-briefing: soğuk açılış, sabah ve arama, Gül’ün büroya gelişi, Leyla’nın devri, ceza aralığı, dosya ve strateji.

const PR00 = T(`
# 18 EKİM · GECE 02.14 — BİR ÇALIŞMA ODASI [bg:siyah]
> Perdeler kapalıydı. Odadaki tek ışık bir ekrandan geliyordu; mavi, soğuk, bir akvaryumun ışığı gibi.
> Masada bir fincan çay. Çoktan soğumuş. Kenarında bir dudak izi yok; içilmemiş, sadece konmuş.
> Bir el klavyenin üstünde durdu. Işık yalnızca parmak uçlarına düşüyordu; gerisi karanlıktı.
> El bir an bekledi. Hatırlamaya çalışan biri gibi; ya da hatırladığından emin olmak isteyen biri gibi.
> Klavyede on iki tuş. Sonra bir tane daha. Ekran bir an karardı, yeniden aydınlandı.
@BİR ADAM: Tamam.
> Sesi alçaktı. Kendine konuşan biri gibi; ya da bir başkasına “sakin ol” diyen biri gibi.
> Ekranda klasörler belirdi. Siparişler. Tasarımlar. Muhasebe. Yıllar. Her biri bir isim, bir tarih, bir şirketin hafızası.
> Telefon masada titredi. Ekranında bir isim yerine bir kalp vardı. Adam açtı; ekrandan gözünü ayırmadan.
@BİR KADIN: Uyumadın mı? [phone]
@BİR ADAM: Bir iş bitiriyorum. Yat sen. [phone]
@BİR KADIN: Yine o iş mi? Doktor ne dedi, unuttun mu? [phone]
@BİR ADAM: Unutmadım. Az kaldı. [phone]
> Hat kapandı. Adam telefonu ters çevirdi; ekranı masaya baksın diye.
> Bir pencere açıldı. Bir soru: “Emin misiniz?” Altında iki düğme.
> El, düğmenin üstünde durdu. Dışarıda bir köpek havladı, sustu. Kalorifer peteğinden bir tık sesi geldi.
> Sonra tık.
> İlerleme çubuğu dolmaya başladı. Yeşil, yavaş, sabırlı. Yüzde bir. Yüzde dört. Yüzde on bir.
> Adam arkasına yaslandı; yüzü ekranın ışığından çıktı, karanlığa karıştı. Masada yalnızca iki el kaldı, birbirine kenetli.
> Parmaklardan biri masaya vurdu. Bir kez, iki kez. Sabırsız değil; sayan biri gibi.
> Yüzde altmış. Yüzde seksen.
> Çay soğumaya devam ediyordu. Çubuk doldu. Ekranda tek bir satır kaldı: “İşlem tamamlandı.”
> Adam ekranı kapattı. Oda karardı. Karanlıkta bir süre kıpırdamadan oturdu.
> Bir şirketin on iki yıllık hafızası, bir çay soğuyana kadar sürmüştü. {fade}
`);

const PR01 = T(`
# 18 EKİM · SABAH 08.30 — NİLÜFER ÖRME TEKSTİL, SUNUCU ODASI [bg:depo]
> Organize sanayide cumartesi sabahı. Dokuma makinelerinin uğultusu duvarların içinden geliyordu; bir kalbin, başka bir odadan duyulan atışı gibi.
> Sunucu odasının kapısında üç kişi vardı. Biri, muhasebeden genç bir kadın, elinde bir çıktıyla ağlıyordu.
@GENÇ KADIN: Siparişler yok. Hepsi. Tasarım arşivi de yok. Klasörleri açıyorum, boş. Ben… ben bir şeye mi bastım?
> Masadaki sabit telefon hoparlöre alınmıştı. Hattın öbür ucunda arabada olduğu belli bir ses; sinyal lambası tıkırdıyordu.
@HOPARLÖRDEKİ SES: Panik yok. Kimse bir şeye dokunmasın; ben yoldayım. Önce kurtarmayı deneriz. [phone]
> Biri “polisi de arayalım mı” diye sordu. Hat bir an sustu; yalnızca sinyal lambasının tıkırtısı.
@HOPARLÖRDEKİ SES: Önce ne olduğunu bilelim. Polis gelince her şeyi mühürler; sonra siparişleri kim kurtarır? [phone]
> Genç kadın çıktıyı katladı, yeniden açtı. Dokuma makineleri bir an bile durmadı.
# 22 EKİM · ŞAFAK 06.40 — NİLÜFER, BİR APARTMAN [bg:ev]
> Dört gün sonra, şafakta, üçüncü katta bir kapı çalındı. Önce bir kez. Sonra uzun uzun.
> Kapıyı otuzlarında, uykulu bir adam açtı. Üstünde bir tişört, elinde gözlüğü.
@ADAM: Buyurun?
@BİR POLİS: Selim Aktaş? Bilişim sistemine girme ve verileri yok etme. Arama kararımız var.
> Arkada, merdiven boşluğunda pijamalı küçük bir kız belirdi. Elinde bir peluş tavşan. Annesi onu kucağına aldı, “Odana, Defne” dedi; Defne gitmedi.
> Polisler salona girdi. Masadaki dizüstü bilgisayar şeffaf bir poşete kondu; poşetin ağzı bir etiketle kapatıldı.
@ADAM: Ben bir şey silmedim. Ben ömrüm boyunca yedek aldım. Ömrüm boyunca!
> Kimse cevap vermedi. Biri tutanağı imzalaması için kalemi uzattı.
> Kadın kızının kulağını avucuyla kapadı. Kız tavşanın kulağını kapadı.
> Adam gözaltına alındı, ertesi gün adli kontrolle serbest bırakıldı: yurt dışına çıkış yasağı, haftada bir imza.
> İki ay sonra iddianame geldi. Tensip zaptından birkaç gün sonra avukatı “mesleki nedenlerle” çekildi.
> Duruşmaya on iki gün kala, eşi bir avukat aradı.
`);

const BR00 = T(`
# PERŞEMBE 20.50 — ARSLAN HUKUK, BURSA [bg:buro_gece]
~ Bir dosya silinince gitmez. Sadece kimin elinden çıktığını unutursun. Bunu bir müvekkilden değil, bir yazıcıdan öğrendim.
> Büro boşalmıştı. Yağmur, pencerenin camında Uludağ’ın yamaçlarından inen ışıkları dağıtıyordu.
~ Leyla bu sabah kapıma bir dosya bırakıp “Bunu ortak olarak imzalayacaksın” dedi. Ortak. Kelime kulağımda hâlâ ağır duruyordu; yeni bir ceket gibi.
> Kapı çaldı. Bir kez, kibarca. Sonra bir sessizlik; ikinci kez çalmadı.
> Kapıyı açtım. Otuzlarında bir kadın; omzunda bir öğretmen çantası, elinde şeffaf bir dosya. Şemsiyesini kapıda silkeledi, sonra özür diledi.
gul: İyi akşamlar. Gül Aktaş. Randevu almadım, biliyorum. Okul çıkışı geldim; kızımı annemde bıraktım.
- Buyurun Gül Hanım. Oturun. Çay?
gul: Çay olur. Elim üşüdü.
> Oturdu. Dosyayı dizlerinin üstüne koydu, iki eliyle tuttu; bir öğrencinin karnesi gibi.
gul: Eşim Selim. Selim Aktaş. Dokuz yıl Nilüfer Örme’de bilgi işlemdeydi. Eylülün sonunda işten çıkardılar.
gul: Ekimde şirketin bütün dosyaları silinmiş. Kayıtlarda Selim’in adı çıkmış. Şimdi dava var. Bilişim… sisteme girme, verileri yok etme.
> Kelimeleri tek tek söyledi; bir ezberi tekrarlar gibi. Bir öğretmen, anlamadığı bir dersin terimlerini.
gul: Önceki avukatımız çekildi. Telefonla söyledi; “mesleki nedenler” dedi. Ben ne demek olduğunu anlamadım. Siz anlatırsınız belki.
- Dosyada ne olduğunu biliyor musunuz?
gul: Bir rapor var. Şirketin kendi bilgisayarcısının raporu. “Sanığın hesabından silinmiştir” diyor. Bir de polis raporu.
gul: Kocam bir sistemi sabote edecek adam değil avukat hanım. Kocam evdeki modemi bile etiketler. Buzdolabındaki yoğurdun kapağına tarih yazar.
> Bir an güldü. Sonra gülmesini yarıda bıraktı, sanki ayıpmış gibi.
gul/uzgun: Şirket bizden yirmi milyon istiyormuş. Sigortası istiyormuş; önce sigorta ödeyecek, sonra bizden alacakmış. Ben o rakamı tahtaya yazamam bile. Sıfırları sığmaz.
gul: Selim konuşmuyor. Balkonda oturuyor, sigarayı bırakmıştı, yeniden başladı. Defne soruyor: “Babam neden işe gitmiyor?” Ne diyeyim?
> Dosyayı masaya bıraktı. İçinde iddianame, bir tutanak fotokopisi, bir de çocuk resmi; yanlışlıkla girmiş gibi duran.
gul: Bir de bu. Defne’nin. “Avukat teyzeye ver” dedi. Ben de getirdim, ne yapayım.
> Resimde bir masa, bir ekran, ekranın önünde bir adam ve bir güneş. Güneş odanın içindeydi.
gul: Ücret konusunu da konuşmamız lazım. Biriktirdiğimiz bir şey var. Ev için biriktiriyorduk. Kirada oturuyoruz.
~ Bir ev. Kirada oturan bir öğretmen, bir resim ve yirmi milyon. Benden bir cümle bekleniyordu.
`);

const BR01 = T(`
> Gül gittikten sonra resmi masamın kenarına, dosyanın üstüne koydum. Güneşi odanın içinde çizilmiş bir resim.
> Kapının eşiğinde Leyla Erdem duruyordu. Ne zamandır orada olduğunu bilmiyordum; otuz yıl bu koridorlarda yürüyen biri ses çıkarmaz.
leyla: Bir öğretmene söz verme Deniz. Öğretmenler sözleri not eder.
- Duydunuz mu?
leyla: Duvarlar incedir. Ben de inceyimdir.
> Masama bir klasör bıraktı. Kenarları yıpranmamış; yeni bir dosya. Kapağında kırmızı kalemle: “Bursa 9. Asliye Ceza.”
leyla: Selim Aktaş artık senin. İmzanın yanına “ortak” yazacaksın. Bu dosya seni tartacak; ben de teraziye bakacağım.
leyla: Bilgisayardan anlamıyorum demeyeceksin. Ben de anlamıyorum. Anlamayan iki avukat, anlıyormuş gibi yapan bir uzmandan iyidir.
> Sigara paketini masaya koydu. Bırakalı dört yıl oldu. Paket hâlâ dolu.
leyla: Önce şunu bil: neyle karşı karşıyayız? İddianamedeki suçlar ve cezaları ne? Hangi mahkeme?
~ Klasörün kapağında iki madde numarası vardı. Biri bilinen bir kapı, biri bilinen bir yangın.
`);

const BR01B = T(`
> Leyla altı kâğıdı tek tek masaya dizdi. Bir ölünün eşyalarını sayan biri gibi; dikkatli, saygılı, duygusuz.
leyla: İddianame. Şirketin şikâyeti. Şirketin bilgisayar firmasının raporu; “imaj ve analiz” diyorlar. Emniyetin, müvekkilin dizüstüsünü inceleyen raporu. Bir de oturum dökümünün özeti.
leyla: Beş kâğıt. Altıncısı yok.
- Altıncısı ne?
leyla: Bir adam işten çıkarken neyi kime teslim etti? Her şirkette bunun bir tutanağı olur. Bu dosyada yok. Kimse istememiş.
leyla: Savcı istememiş. Polis istememiş. Önceki avukat istememiş. Şirket de vermemiş; kimse istemeyince kimse vermez.
~ Kimsenin istemediği kâğıt, kimsenin görmek istemediği kâğıttır.
leyla: Bir de şu rapor. Şirketin firması yazmış. Mahkeme atamamış. Kimin parasıyla yazıldığını unutma; ama kötü niyet de arama. Önce dikkatsizlik ara. Dikkatsizlik daha sık görülür.
leyla: Bu dosyada herkes “kayıt” diyecek Deniz. Kayıt yalan söylemez derler. Doğru. Ama kaydı biri tutar, biri saklar, biri sana özetini verir. Her elden geçişte bir şey düşer.
> Ayağa kalktı. Masasına döndü. Masasının köşesinde ters çevrilmiş bir çerçeve duruyordu; yıllardır öyle.
~ Hiç sormadım. Sormamam gerektiğini biliyordum.
leyla: Son bir şey. Müvekkilin bir şey saklıyor olabilir. Herkes saklar. Bilgisayarcılar da saklar; sadece daha düzenli saklarlar.
`);

const SABAH = T(`
# CUMA 07.25 — ORGANİZE SANAYİ, NİLÜFER ÖRME ÖNÜ [bg:sokak_sabah]
> Vardiya değişimi. Servis otobüsleri sırayla duruyor, kapılar açılıyor, mavi önlüklü kadınlar ve erkekler termoslarıyla iniyordu.
> Fabrikanın cephesinde paslanmaz harflerle: NİLÜFER ÖRME TEKSTİL A.Ş. — 1994. Harflerden biri, Ö’nün noktalarından biri düşmüştü.
> Kapının yanında bekçi kulübesi. İçeride, buğulu camın ardında yaşlı bir adam çay demliyordu. Beni görünce camı bir parmak araladı.
yasar: Hayırdır kızım? Servis mi bekliyon? Bu saatte servis yok, gitti.
- Servis beklemiyorum amca. Avukatım.
yasar: Avukat. Hı. Kimin avukatı?
- Selim Aktaş’ın.
> Yaşlı adam bir an durdu. Çaydanlığın kapağını kapattı. Gözleri bir an fabrikanın idari binasına, sıra sıra ışıklı pencerelere kaydı; sonra yine çaydanlığa döndü.
yasar: Selim iyi çocuktur. Gece vardiyasında bilgisayar bozulunca gelirdi, bana da simit getirirdi. Ama ben bir şey bilmem kızım. Ben kapıdayım. Kapıda olan bir şey bilmez.
> Camı kapattı. Sonra yeniden açtı, bir parmak.
yasar: Çay içersen içer. Sonra. Şimdi müdürler gelecek.
> Otoparka siyah, uzun bir araba girdi; plakası 16 NS 001. Park yerine yavaşça yanaştı. İçinden kır saçlı, takım elbiseli bir adam indi ve bana bakmadan binaya yürüdü.
~ Bir fabrika, bir bekçi, bir park yeri. Ve on iki gün. Nereden başlayacağımı biliyordum: kimsenin istemediği kâğıttan.
`);

export const briefing: CasePart = {
  nodes: [
    story('PR_00', {
      ...PRO,
      title: 'Gece 02.14',
      background: 'siyah',
      lines: [{ lines: PR00 }],
      choices: [cont('PR00_DEVAM', 'Sabah', 'PR_01', { role: 'PRIMARY' })],
    }),
    story('PR_01', {
      ...PRO,
      title: 'Boş klasörler',
      background: 'depo',
      lines: [{ lines: PR01 }],
      choices: [cont('PR01_DEVAM', 'İki ay sonra', 'BR_00', { role: 'PRIMARY' })],
    }),
    story('BR_00', {
      ...C1,
      title: 'Gül',
      background: 'buro_gece',
      onFirstEnter: [meet('deniz'), meet('gul')],
      lines: [{ lines: BR00 }],
      choices: [
        option('BR00_A', '“Ücreti sonra konuşuruz.”', {
          effects: [raise('gul_resim')],
          responses: B(`
- Biriktirdiğiniz parayı şimdilik çantanızda tutun Gül Hanım. Önce dosyayı okuyayım, Selim Bey’le konuşayım. Ücret sonra.
gul: Ama… Peki. O zaman şunu siz götürün, Selim’e verin. Defne her akşam bir resim çiziyor, babası görsün diye. Babası bakmıyor. Belki sizin elinizden bakar.
> İkinci bir resim uzattı; katlanmış. Bir balkon, bir adam, adamın elinde bir sigara ve kocaman bir “YASAK” işareti.
- Veririm.
~ Küçük bir söz. Küçük sözler daha zor tutulur; çünkü kimse onları tuttuğunu fark etmez.
`),
          next: 'BR_01',
        }),
        option('BR00_B', '“Önce vekâletname ve ücret sözleşmesi.”', {
          responses: B(`
- Önce vekâletnameyi ve ücret sözleşmesini konuşalım; sürecin nasıl işleyeceğini de anlatayım.
> Tarifeyi, masrafları, bilirkişi ücretlerini anlattım. Gül not aldı; düzgün, yuvarlak bir öğretmen yazısıyla.
gul: Bilirkişi ücreti ayrı mı? Peki. Yazdım. Bir de makbuz rica edeceğim; Selim makbuzsuz bir şey yapmaz.
~ Düzgün bir başlangıç. Düzgün başlangıçlar insanı rahatlatır; ama hiçbir zaman bir dosyayı kazandırmaz.
`),
          next: 'BR_01',
        }),
        option('BR00_C', '“Söz veremem; ama her satırı okuyacağım.”', {
          effects: [raise('deniz_durust')],
          responses: B(`
- Size bir sonuç sözü veremem Gül Hanım. Veren avukata da güvenmeyin. Ama dosyanın her satırını okuyacağım. Her kaydı.
> Gül uzun uzun yüzüme baktı. Bir öğrencinin cevabını tartan bir öğretmen gibi.
gul: Önceki avukat “bu işler formalite” demişti. Siz ilk “bilmiyorum” diyensiniz.
gul: Bizim okulda da öyledir. “Bilmiyorum” diyen çocuk öğrenir. “Biliyorum” diyen ezberler.
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
        option('BR01_A', '244/2 ve 243/1: altı ay–üç yıl ve bir yıla kadar; asliye ceza', {
          score: { HUKUKI_BILGI: 50 },
          good: 'Doğru: verileri bozma, yok etme (TCK 244/2) altı aydan üç yıla; sisteme hukuka aykırı girme (TCK 243/1) bir yıla kadar hapis ya da adli para cezası. Üst sınırlar on yılın altında: görevli mahkeme asliye ceza, tek hâkim.',
          responses: B(`
- Verileri yok etmekten altı aydan üç yıla. Sisteme girmekten bir yıla kadar hapis ya da adli para cezası. Asliye ceza; tek hâkim.
leyla/mutlu: Doğru. Ağır ceza değil. Heyet yok, tek bir hâkim ve onun vicdanı.
leyla: Ama rakamlar seni kandırmasın. Üç yıl küçük görünür. Arkasından bir rücu davası gelir: yirmi milyon. Bu dosyada hapis değil, bir ömür tartılıyor.
> Sigara paketini ters çevirdi. Leyla’nın alkışı budur.
leyla: Bir de şunu bil: iki suç arasındaki fark, bir adamın bir kapıdan girmesi ile içerideki her şeyi yakması arasındaki farktır. Kapıdan girdi mi? Girdiyse izinli miydi? Yaktı mı? Bunlar üç ayrı soru.
~ Üç soru. Kâğıtlara döndüm.
`),
          next: 'BR_01B',
        }),
        option('BR01_B', '244/4: iki yıldan altı yıla; ağır ceza', {
          bad: 'TCK 244/4 eylemle kendisine ya da başkasına yarar sağlamayı arar; iddianamede yarar iddiası yok. Üst sınır da ağır cezanın görev alanına girmez: asliye ceza (244/2: 6 ay–3 yıl; 243/1: 1 yıla kadar).',
          category: 'HUKUKI_BILGI',
          responses: B(`
- Yarar sağlama… dördüncü fıkra? İki yıldan altıya, ağır ceza?
leyla: Dördüncü fıkra, eylemle bir çıkar sağlandığında. İddianame Selim’in bir şey kazandığını söylemiyor; intikam diyor. İkinci fıkra: altı ay ile üç yıl. Bir de sisteme girme: bir yıla kadar.
leyla: Mahkeme de ağır ceza değil; asliye. Tek hâkim. Kapağı okumadan dosyayı açma.
~ Yanaklarım yandı. Leyla paketi çevirmedi.
`),
          next: 'BR_01B',
        }),
        option('BR01_C', '243/3: girme yüzünden veriler yok olmuşsa altı ay–iki yıl; tek suç', {
          bad: 'TCK 243/3, girme eylemi nedeniyle verilerin istem dışı yok olmasıdır. İddianame kasten silme diyor: 244/2 (6 ay–3 yıl) ve ayrıca 243/1. Asliye ceza.',
          category: 'HUKUKI_BILGI',
          responses: B(`
- Girme yüzünden veriler yok olduysa… 243’ün üçüncü fıkrası? Altı ay ile iki yıl, tek suç?
leyla: O fıkra, kapıyı açarken içerideki vazoyu yanlışlıkla deviren içindir. İddianame Selim’in vazoyu bilerek kırdığını söylüyor: 244/2. Bir de kapıdan girme: 243/1.
leyla: Ama aklında tut. Kastın ne olduğu, bu dosyanın sonunda belki yeniden sorulur.
~ Leyla eleştirirken bile bir kapı aralık bırakır.
`),
          next: 'BR_01B',
        }),
        option('BR01_D', '244/1 ve 244/3: bir yıldan beş yıla, yarı oranında artırımla', {
          bad: 'TCK 244/3’teki artırım banka, kredi kurumu ya da kamu kurumunun sistemine özgüdür; özel bir tekstil şirketi değildir. İddianame 244/2 ve 243/1.',
          category: 'HUKUKI_BILGI',
          responses: B(`
- Sistemin işleyişini bozmak, birinci fıkra; bir de üçüncü fıkradan yarı oranında artırım?
leyla: Üçüncü fıkra bankalar ve kamu kurumları için. Bir tekstil fabrikası, ne kadar büyük olursa olsun, devlet değildir.
leyla: İddianame iki fıkra yazıyor: 244/2 ve 243/1. Asliye ceza.
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
      title: 'Silinen Dosyalar',
      background: 'buro_gece',
      onFirstEnter: [meet('selim'), meet('tarik')],
      blocks: [
        {
          type: 'profileCard',
          character: 'selim',
          label: 'MÜVEKKİL',
          lines: ['Selim Aktaş, 34', 'Eski sistem yöneticisi · sabıkasız', 'Adli kontrol · yurt dışı yasağı'],
          charge: 'Verileri yok etme (TCK 244/2) · sisteme girme (TCK 243/1)',
          demand: 'İddianame: 6 ay–3 yıl ve 1 yıla kadar',
        },
        {
          type: 'sentenceRange',
          segments: ['green', 'green', 'gold', 'gold', 'red', 'red', 'darkred', 'darkred'],
          markerPct: 55,
          labels: ['Beraat', '243/1', '244/2', '3 yıl'],
          demandLabel: 'İSTEM: 244/2 + 243/1',
        },
        {
          type: 'paragraph',
          title: 'OLAY ÖZETİ',
          text: '18 Ekim gecesi Nilüfer Örme Tekstil’in dosya sunucusundaki sipariş, tasarım ve muhasebe verileri silindi. Şirketin dış servis firması DataKale’nin raporuna göre silme, Eylül sonunda işten çıkarılan sistem yöneticisi Selim Aktaş’ın kullanıcı adıyla açılan bir uzaktan bağlantı oturumunda yapıldı. Şirket zararını yirmi milyon lira olarak beyan etti. Selim Aktaş suçlamayı reddediyor.',
        },
        {
          type: 'strengthList',
          title: 'İDDİANIN ELİNDEKİLER',
          items: [
            { label: 'Oturum dökümü: sanığın kullanıcı adı (özet)', strength: 'STRONG' },
            { label: 'DataKale imaj ve analiz raporu', strength: 'STRONG' },
            { label: 'İşten çıkarılma ve tartışma (saik)', strength: 'MEDIUM' },
            { label: 'Emniyet raporu: sanık o gece bağlanmış', strength: 'MEDIUM' },
            { label: 'Zarar beyanı', strength: 'WEAK' },
          ],
        },
        {
          type: 'choiceGroup',
          title: 'SAVUNMA STRATEJİSİ SEÇ',
          group: 'g_strateji',
          hints: {
            STR_MASUMIYET: 'Masumiyet: beraat hedeflenir; stratejine uyan esas savunma ×1,5 puan.',
            STR_USUL: 'Usul: kaydın ve imajın hükme esas alınamayacağını savunursun; uyan esas savunma ×1,2 puan.',
            STR_INDIRIM: 'Terditli savunma: önce beraat, aksi hâlde lehe nitelendirme; uyan esas savunma ×0,8 puan.',
          },
        },
      ],
      choices: [
        option('STR_MASUMIYET', 'Masumiyet', {
          group: 'g_strateji',
          effects: [set('strategy', 'MASUMIYET'), set('strategy_pct', 150), ...p1.start()],
          responses: B(`
leyla: Cesur. Bir kaydın “bu adam” dediği dosyada masumiyet, makineyle kavga etmek demek.
leyla: Makineyle kavga etme. Makineyi kimin kullandığını sor.
`),
          next: 'INV_SABAH',
        }),
        option('STR_USUL', 'Usul', {
          group: 'g_strateji',
          effects: [set('strategy', 'USUL'), set('strategy_pct', 120), ...p1.start()],
          responses: B(`
leyla: Dijital delil camdan bir vazodur. Bir kere yanlış elden geçti mi, çatlağı görünmez ama vardır.
leyla: Ama hâkim çatlaktan önce insana bakar. Kâğıdın yanına bir de hikâye koy.
`),
          next: 'INV_SABAH',
        }),
        option('STR_INDIRIM', 'Terditli savunma', {
          group: 'g_strateji',
          effects: [set('strategy', 'INDIRIM'), set('strategy_pct', 80), ...p1.start()],
          responses: B(`
leyla: Güvenli. Önce beraat; olmazsa yalnızca kapıdan girdiği.
leyla: Ama müvekkiline “belki sadece girmekten” demeye hazır mısın? Hiçbir şey silmediğini söyleyen birine?
`),
          next: 'INV_SABAH',
        }),
      ],
    }),
    story('INV_SABAH', {
      ...INV,
      title: 'Fabrika önü, sabah',
      background: 'sokak_sabah',
      onFirstEnter: [meet('yasar')],
      lines: [{ lines: SABAH }],
      choices: [cont('SABAH_DEVAM', 'Soruşturmaya başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
  ],
};
