import { back, cont, conversation, dec, has, inc, meet, option, raise } from '../../../tools/content/src/kit/index.js';
import type { NodeDef } from '../../../tools/content/src/kit/index.js';
import { B } from './lib.js';
import { INV } from './shared.js';

// 1. evre kişileri: Tarık, Emre (matbaa), Nermin (Mudanya), Erol (emlak bürosu), Hayriye (huzurevi), noter başkâtibi,
// tapu müdür yardımcısı, Hisar'daki komşu. Etik tuzaklar: Hayriye'ye imza/ifade, Nermin'e şikâyet baskısı.

const tarik = conversation('INV_TARIK', {
  ...INV,
  title: 'Tarık',
  eyebrow: 'KİŞİLER',
  background: 'depo',
  room: { label: 'MATBAA · DİJİTAL BASKI ODASI', character: 'tarik' },
  lines: B(`
C#depo: ATEŞ MATBAASI — DİJİTAL BASKI ODASI
N: Camla ayrılmış küçük bir oda. Bir bilgisayar, bir plotter, duvarda renk kartelaları. Masada üç ayrı kahve lekesi ve bir hesap makinesi.
tarik: Gelin avukat hanım, oturun. Burası benim mağaram derler; aslında herkesin mağarası. Bilgisayarın şifresi bile yok.
tarik: Amcam size her şeyi anlattı mı? Anlatmaz o. Utanır. Bir ömür “Ateş Matbaası” dedi, şimdi adı bir dosyada.
N: Konuşurken sesini hiç yükseltmedi. Bir kalemi parmaklarının arasında çeviriyordu; durmadan, ses çıkarmadan.
tarik: Ne lazımsa. Fatura, irsaliye, müşteri listesi. Ben bulurum.
T: “Ne lazımsa.” İkinci kez söylüyor. Yardımsever insanlar bu dosyanın en yorgun insanları gibi.
`),
  choices: [
    option('TQ_GUN', '“18 Şubat sabahı neredeydin?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('fact_tarik_inegol')],
      responses: B(`
tarik: İnegöl’de. Kâğıtçı Rıza’nın deposunda. Sabah sekizde çıktım, öğlene kadar oradaydım; 70 gramlık bir parti vardı, fiyatı düşmüştü.
tarik: Dönünce amcam bir şey demedi. Kimliğini bulamadığını sonra duydum. Ben olsam ilk iş karakola giderdim; o gitmedi. İnatçıdır.
T: Düzgün bir cevap. Saatleri olan bir cevap. Not aldım.
`),
    }),
    option('TQ_ODA', '“Bu bilgisayarı kim kullanır?”', {
      score: { SORGULAMA: 20 },
      responses: B(`
tarik: Herkes. Dosya gelir, ben hazırlarım, amcam onaylar. Emre bazen kendi işlerini basar; ben görmezden gelirim. Genç, para lazım.
tarik: Geceleri de geldiğini sanıyorum. Sabah kâğıt eksik oluyor. Amcama söylemedim. Söylerseniz, benden duymuş olmasın.
T: İki kişi aynı çırağı işaret etti. Birbirlerinden habersiz mi, bilmiyorum.
`),
    }),
    option('TQ_HALA', '“Nermin Hanım’la aranız nasıl?”', {
      score: { SORGULAMA: 10 },
      responses: B(`
tarik: Halam iyi kadındır. Babam ölünce beni o da büyüttü sayılır. Ama ev konusunda… Evi hep istedi. “Annemin evi bana kalır” derdi.
tarik: Bir emlakçı da dolanıyordu geçen kış. Halamla konuşmuş diye duydum. Ben karışmam o işlere.
T: Bir yeğen, halasını hem severek hem şüpheyle anlatıyor. Aileler böyledir; her cümlenin iki yüzü vardır.
`),
    }),
    option('TQ_POLIS', '“Polis mukayese için belge istediğinde kim verdi?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('fact_tarik_polis')],
      responses: B(`
tarik: O işlerle amcam ilgilendi herhalde. Ben o hafta çok gidip geldim; annem… yani babaannem hastanedeydi, düşmüştü.
tarik: Ne verdilerse amcamın imzalı kâğıtlarıdır. İrsaliyeleri hep o imzalar. Hepsini.
T: “Hepsini.” Vedat “çoğunu” demişti. Küçük bir fark. Küçük farklar, büyük kâğıtlara sığar.
`),
    }),
    option('TQ_AMCA', '“Amcan nasıl biri?”', {
      score: { SORGULAMA: 15 },
      responses: B(`
tarik: Amcam mı? Babam öldüğünde on dokuz yaşındaydım. Ertesi hafta amcam beni bu dükkâna getirdi, “burada kâğıt kokusu var, ağlarsan kimse anlamaz” dedi.
tarik: On dört yıl. Bana makineyi öğretti, dijitali ben ona öğrettim. Maaşımı bazen geç verir, ama hiç eksik vermez. Herkese öyledir.
N: Kalemi çevirmeyi bıraktı. Masadaki kahve lekelerinden birine baktı.
tarik: O imzayı atmaz avukat hanım. Bunu bilin. Ne olursa olsun.
T: “Ne olursa olsun.” Sevgi’nin, Vedat’ın, şimdi de yeğenin ağzından aynı güven. Bir aile güveni; kâğıttan daha sağlam görünür, kâğıttan daha çabuk yırtılır.
`),
    }),
    back('TARIK_BITIR', 'Teşekkür et, çık'),
  ],
});

const emre = conversation('INV_EMRE', {
  ...INV,
  title: 'Emre',
  eyebrow: 'KİŞİLER',
  background: 'depo',
  room: { label: 'MATBAA · KOLİ MASASI', character: 'emre' },
  lines: B(`
C#depo: ATEŞ MATBAASI — KOLİ MASASI
N: Emre bir koliyi bantlıyordu; bant makinesinin cızırtısı konuşmanın üstüne çıkıyordu. Beni görünce kulaklığını çıkardı ama elindeki bandı bırakmadı.
emre: Abla ben bir şey bilmiyorum valla. Ben öğleden sonra gelirim, okul var. Meslek lisesi, matbaa bölümü. Son sınıf.
emre: Vedat abi iyi adamdır. Yani şey, iyi patron. Maaşı geç verir ama verir. Kimseye bağırmaz. Makinesine bağırır sadece.
T: Hızlı konuşuyor. Sorulmadan cevap veriyor. On dokuz yaşında olmak böyle bir şey; ya da bir şeyden korkmak.
`),
  choices: [
    option('EQ_SABAH', '“18 Şubat sabahı dükkânda mıydın?”', {
      score: { SORGULAMA: 10 },
      responses: B(`
emre: Yok abla, okuldaydım. Salı. Salı sabahları atölye dersi var, devamsızlığım dolmuş zaten. Öğleden sonra geldim.
emre: Vedat abi o gün tuhaftı ama. Kimliğini arıyordu, bütün dükkânı birbirine kattı. Bana bile sordu, “gördün mü” diye.
`),
    }),
    option('EQ_GECE_SOFT', '“Gece dükkâna gelen olur mu? Sana bir şey olmaz; yalnızca ne gördüğünü soruyorum.”', {
      visibleWhen: has('clue_yazici'),
      score: { SORGULAMA: 40 },
      effects: [raise('fact_emre_davetiye')],
      responses: B(`
emre: …Abla, Vedat abiye söyleme. Ben geceleri bazen geliyorum. Pervazdaki anahtarla. Düğün davetiyesi basıyorum; arkadaşların, akrabaların. Az para ama.
emre: Kuşe kâğıt, 300 gram. Gece on gibi gelirim, on ikiden önce çıkarım; annem kızar. İki buçukta mı? Yok abla, o saatte uyurum.
emre: Bir de… ben 90 gram basmam. Davetiye 90 grama basılmaz, ayıp olur.
T: Bir çırağın gizli işi. Saatleri tutmuyor, kâğıdı tutmuyor. Gece yarısından sonraki iş onun değil gibi. Ama “gibi” bir delil değil.
`),
    }),
    option('EQ_GECE_HARD', '“Yazıcıda gece basılmış bir iş var. Sen miydin?”', {
      visibleWhen: has('clue_yazici'),
      effects: [raise('emre_kapandi')],
      responses: B(`
emre.kizgin: Ne? Ben mi? Abla ben hiçbir şey basmadım! Gece mi? Gece ben evdeyim!
N: Bant makinesini masaya bıraktı. Kulaklığını taktı. Konuşma bitmişti.
T: Bir kapıyı çarparak kapattım. Bazı kapılar ikinci kez çalınınca açılmaz.
`),
    }),
    option('EQ_DUKKAN', '“Dükkânda kim ne iş yapar?”', {
      score: { SORGULAMA: 15 },
      responses: B(`
emre: Vedat abi makinede. Kurşun harfler, ofset, hepsi onun. Tarık abi dijitalde; bilgisayar, plotter, kartvizit. Ben koli, kargo, temizlik. Bir de ayak işleri.
emre: Kargo gelince kim yakındaysa o koşar. Kâğıtçı gelince Tarık abi konuşur, pazarlığı o yapar. Müşteri gelince Vedat abi; müşteri onu sever.
emre: Bir de çay. Çayı herkes kendisi koyar. O kural; Vedat abinin babasından kalma.
T: Bir dükkânın haritası. Kim nerede durur, kim neye dokunur. İleride işime yarayacak mı, bilmiyorum; ama kâğıda yazdım.
`),
    }),
    back('EMRE_BITIR', 'Bırak, çık'),
  ],
});

const nermin = conversation('INV_NERMIN', {
  ...INV,
  title: 'Nermin Kurt',
  eyebrow: 'KİŞİLER',
  background: 'kafe',
  onFirstEnter: [meet('nermin')],
  room: { label: 'MUDANYA · KURT ECZANESİ', character: 'nermin' },
  lines: B(`
C#kafe: MUDANYA — KURT ECZANESİ
N: Deniz kıyısında küçük bir eczane. Vitrinde güneş kremleri, içeride boş bir sandalye ve tezgâhın arkasında beyaz önlüklü, keskin yüzlü bir kadın.
nermin: Vedat’ın avukatı. Tahmin etmiştim. Oturun; ama kısa olsun. Öğlen bir huzurevi ziyaretim var. Annemin ilaçlarını ben götürürüm, biliyor musunuz?
nermin: Ben şikâyetçiyim avukat hanım. Annemin vasisiyim. Kardeşimin değil, annemin tarafındayım. Bu ikisi şubattan beri aynı taraf değil.
T: “Kardeşim.” Kelimeyi bir bıçağı masaya koyar gibi koydu.
`),
  choices: [
    option('NQ_VEKALET', '“2023’teki vekâletnamede ne vardı?”', {
      score: { SORGULAMA: 30 },
      effects: [raise('fact_nermin_yetki')],
      responses: B(`
nermin: Ben oradaydım. Notere ben götürdüm annemi, Vedat arabayla geldi. Banka, emekli maaşı, kira, elektrik su. Annem artık bankaya gidemiyordu.
nermin: Satış yok. Satış yetkisi yoktu. Noter okudu, annem “ev kalsın” dedi, noter güldü, “ev kalır teyze” dedi. Ben hatırlıyorum.
nermin: Sonra tapuya bir suret gidiyor ve suretin içinde satış var. Kim yazdı onu? Matbaacı bir kardeşim var. Siz söyleyin.
T: Bir öfke ve bir doğru. Asıl vekâletnamede satış yoksa, suretteki satış birinin eliyle eklendi. Kimin eliyle? Nermin bunu bildiğini sanıyor.
`),
    }),
    option('NQ_SEBEP', '“Vedat’ın evi satmak için bir sebebi var mıydı?”', {
      score: { SORGULAMA: 10 },
      effects: [raise('fact_kavga')],
      responses: B(`
nermin: 2024 bayramı. Masada, annemin önünde. “Evi satalım, dükkânın borcu var.” Annem ağladı. Ben masadan kalktım. O da kalktı.
nermin: Bir daha konuşmadık o konuyu. Sonra şubatta ev satılıyor. Ne düşüneyim?
`),
    }),
    option('NQ_EMLAK', '“Evle ilgilenen başka biri oldu mu?”', {
      score: { SORGULAMA: 20 },
      responses: B(`
nermin: Bir emlakçı. Geçen kış. Ben ona ne istediğini söylemedim; o da bana söylemedi. Herkes bir şey söylemiyor bu ailede.
N: Kısa bir sessizlik. Sonra konuyu değiştirdi; sanki fazla konuşmuş gibi.
T: Saklanan bir şey var. Ama bugün değil. Bugün bu kapı aralandı, o kadar.
`),
    }),
    option('NQ_GERI', '“Şikâyetinizi geri çekmeyi düşünür müsünüz? Aile içinde çözülebilir.”', {
      score: { SAVUNMA_STRATEJISI: -50 },
      effects: [inc('ethics'), raise('nermin_baski')],
      bad: 'Resmî belgede sahtecilik şikâyete bağlı değildir; geri çekme davayı düşürmez. Şikâyetçiyi “aile içi çözüm” diye etkilemeye çalışmak meslek kurallarına aykırıdır (Av.K. 34).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
nermin.kizgin: Geri mi çekeyim? Siz kimin avukatısınız? Annemin evi gitti, siz bana aileyi mi anlatıyorsunuz?
nermin: Bu suç şikâyete bağlı değilmiş zaten, savcı söyledi. Çeksem de dava sürer. Bilmiyor musunuz?
T: Biliyordum. Bilmeseydim daha iyi olurdu; o zaman yalnızca cahil olurdum.
`),
      next: 'INV_NERMIN_X',
    }),
    back('NERMIN_BITIR', 'Teşekkür et, çık'),
  ],
});

const nerminX = conversation('INV_NERMIN_X', {
  ...INV,
  title: 'Nermin Kurt',
  eyebrow: 'KİŞİLER',
  background: 'kafe',
  room: { label: 'MUDANYA · KURT ECZANESİ', character: 'nermin' },
  lines: B(`
nermin.kizgin: Kapı orada. Bir dahaki sefere mahkemede görüşürüz.
`),
  choices: [back('NERMINX_BITIR', 'Çık')],
});

const erol = conversation('INV_EROL', {
  ...INV,
  title: 'Erol Kılınç',
  eyebrow: 'KİŞİLER',
  background: 'buro',
  onFirstEnter: [meet('erol'), raise('fact_erol_ziyaret')],
  room: { label: 'KILINÇ GAYRİMENKUL · SETBAŞI', character: 'erol' },
  lines: B(`
C#buro: SETBAŞI — KILINÇ GAYRİMENKUL
N: Vitrinde villa fotoğrafları, içeride deri koltuklar ve bir akvaryum. Akvaryumda tek bir balık; büyük, turuncu, yavaş.
erol: Avukat hanım! Buyurun, buyurun. Çay, kahve? Hacı, iki çay. Ben Erol. Alıcıyım, malum. Mağdurum da sayılırım aslında.
erol: Parayı verdim, evi aldım. Şimdi tapu iptal edilecek diyorlar. Kim ödeyecek benim paramı? Vedat Bey mi? Avukat hanım, para tatlı ama yolu dikenli.
N: Altın bir zincir, cilalı ayakkabılar, bir tespih. Gülümsemesi bir saniye fazla sürüyordu.
`),
  choices: [
    option('RQ_PAZARLIK', '“Pazarlığı kiminle yaptınız?”', {
      score: { SORGULAMA: 20 },
      responses: B(`
erol: Vedat Bey’le. Kim olacak? Telefonla konuştuk, sonra buraya geldi, kapora verdim, makbuzu imzaladı. Sonra tapu. Temiz iş.
P: Telefonla mı? Hangi numaradan?
erol: Hatırlamam avukat hanım. Günde yüz telefon. Numara numaradır.
T: Bir emlakçı numara hatırlamıyor. Belki doğrudur. Belki bir emlakçı neyi hatırlayacağını çok iyi bilir.
`),
    }),
    option('RQ_BEDEL', '“1.600.000 lira. Piyasanın yarısı değil mi?”', {
      score: { SORGULAMA: 15 },
      responses: B(`
erol: Eski ev avukat hanım. Tadilat ister, çatı akıtıyor. Ben riski aldım. Nakit ödedim, peşin. Peşinin adı başka, fiyatı başka.
erol: Nakit. Elden. Bankaya ne gerek var, aramızda güven vardı.
T: Bir milyon altı yüz bin, elden. Bir çantaya sığar mı? Sığar. Kimin çantasına girdi?
`),
    }),
    option('RQ_TAPU', '“Tapuda yanınızdaki adam Vedat Bey miydi? Emin misiniz?”', {
      score: { SORGULAMA: 25 },
      responses: B(`
erol: Kimliği vardı. Gişedeki hanım baktı. Bana ne düşer? Kepliydi, gözlüklüydü; hastaymış, soğuk almış. Ben adamın kepini mi çıkaracağım?
N: Tespihini bir kez çevirdi, durdu. Sonra gülümsedi.
erol: Siz de kimseye kep çıkartmayın avukat hanım. Herkesin kendi soğuğu var.
T: Bir tehdit miydi, bir atasözü mü? Erol gibi adamlarda ikisi aynı kumaştan dikilir.
`),
    }),
    back('EROL_BITIR', 'Kalk, çık'),
  ],
});

const hayriye = conversation('INV_HAYRIYE', {
  ...INV,
  title: 'Hayriye Ateş',
  eyebrow: 'KİŞİLER',
  background: 'hastane',
  onFirstEnter: [meet('hayriye')],
  room: { label: 'ÇEKİRGE · HUZUREVİ', character: 'hayriye' },
  lines: B(`
C#hastane: ÇEKİRGE — GÜNEŞ HUZUREVİ
N: Dezenfektan ve ıhlamur kokusu. Pencerenin önünde, tekerlekli sandalyede ufak tefek bir kadın; kucağında bir dikiş kutusu, içinde düğmeler.
N: Bakıcı kulağıma eğildi: “Bugün iyi günü. Ama uzun tutmayın. Kimi gün herkesi tanır, kimi gün kimseyi.”
hayriye: Gel kızım, gel. Sen Nermin’in arkadaşı mısın? Otur şuraya. Bak, düğme ayırıyorum. Sedefleri bir yana, kemikleri bir yana.
hayriye: Halit bugün gelecek. Her pazar gelir. Çorbasını koydum.
T: Halit on iki yıl önce ölmüş. Kadın onun çorbasını hâlâ koyuyor. Bu odada zaman bir düğme kutusu gibi; her şey karışık, her şey yerinde.
`),
  choices: [
    option('HQ_ESLIK', 'Soru sorma; düğmeleri birlikte ayır', {
      score: { SAVUNMA_STRATEJISI: 50 },
      good: 'Kısıtlı ehliyetli yaşlı bir kişiyle görüşmede bilgi koparmaya değil, onurunu korumaya öncelik verdin. Doğru tutum.',
      category: 'SAVUNMA_STRATEJISI',
      effects: [raise('hayriye_eslik')],
      responses: B(`
N: Bir süre hiçbir şey sormadım. Sedef bir yana, kemik bir yana. Hayriye Hanım eliyle düğmeleri düzeltiyor, benim yanlış koyduklarımı sessizce değiştiriyordu.
hayriye: Sen iyi ayırıyorsun kızım. Vedat’ım da iyi ayırırdı küçükken. Halit sabırsızdı; her şeyi tek kutuya atardı.
hayriye: Ben imzamı kimseye vermem, bilir misin? Annem öyle derdi: “İmzan senin namusun.” Notere gittik bir kere. Bankacı istedi diye. Vedat’ım için.
hayriye.uzgun: Evimi de soruyorlar. Evim yerinde mi kızım? Cumbadaki perdeyi kim yıkayacak?
T: Cevap veremedim. Bir düğmeyi sedeflerin arasına koydum. Doğru yerdi.
N: Çıkarken bakıcı beni kapıya kadar geçirdi. “İyi yaptınız” dedi, “soru sormadınız. Gelenlerin çoğu sorar; o da her soruda biraz daha kaybolur.”
T: Bir kadının hafızası bir delil değildir. Bir kadının onuru ise bir avukatın sınırıdır.
`),
    }),
    option('HQ_IFADE', 'Kısa bir beyan yazıp imzasını al: “Evi satmaya izin vermedim.”', {
      score: { SAVUNMA_STRATEJISI: -100 },
      effects: [inc('ethics'), raise('hayriye_imza'), dec('cred')],
      bad: 'Vasi altındaki, ayırt etme gücü zayıflamış bir kişiye beyan imzalatmak hem hukuken değersizdir hem de meslek kurallarına aykırıdır (Av.K. 34; TMK 462 vd.). Bir imza davasında bir imza daha üretmeye çalıştın.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
N: Bir kâğıt, bir kalem. Hayriye Hanım kalemi aldı, kâğıda baktı, bana baktı.
hayriye.saskin: Bu ne kızım? Bankacı mı istedi? Halit mi istedi? Ben imzamı kimseye vermem…
N: Bakıcı odaya girdi. Kâğıdı gördü, yüzü değişti. “Vasisinin haberi var mı?” diye sordu. Yoktu.
T: Bir imza davasında, bir imza daha istedim. Seksen iki yaşında, düğme ayıran bir kadından. Kâğıdı yırttım. Yırtmak bir şeyi geri getirmedi.
`),
    }),
    option('HQ_FOTO', 'Tapudaki fotoğrafı göster: “Bu kim, tanıyor musunuz?”', {
      score: { SORGULAMA: -30 },
      neutral: 'Demanslı bir kişinin fotoğraf karşısındaki beyanı delil değeri taşımaz; yalnızca kafasını karıştırır.',
      responses: B(`
hayriye.saskin: Bu kim? Halit mi? Halit kep takmazdı… Vedat? Vedat’ım gözlük takmaz. Bu kim kızım? Niye bana yabancı adamların resmini gösteriyorsun?
N: Düğme kutusu kucağından kaydı, düğmeler yere saçıldı. Bakıcı koştu.
T: Bir kadını bir fotoğrafla karşılaştırdım. Kazanan olmadı.
`),
    }),
    back('HAYRIYE_BITIR', 'Vedalaş'),
  ],
});

const noter = conversation('INV_NOTER', {
  ...INV,
  title: 'Bursa 14. Noterliği',
  eyebrow: 'ARŞİV',
  background: 'buro',
  onFirstEnter: [meet('bulent')],
  room: { label: 'BURSA 14. NOTERLİĞİ · ARŞİV', character: 'bulent' },
  lines: B(`
C#buro: HEYKEL — BURSA 14. NOTERLİĞİ
N: Mermer merdivenler, numaratör, bekleyen bir kalabalık. Arka tarafta, dosya dolaplarının arasında, kravatı kusursuz bağlanmış altmışlık bir adam.
bulent: Bülent Sarı, başkâtip. Otuz bir yıldır bu dairedeyim avukat hanım. Usul, usul, usul. Usulsüz bir şey sorarsanız usulle reddederim.
bulent: Vedat Ateş’in vekili olarak geldiğinizi söylediniz. Vekâletname işleminde vekil ilgilidir; ilgilinin avukatı da ilgilidir. Buyurun.
N: Masasında kusursuz dizilmiş üç kalem, bir mühür, bir mürekkep ıstampası. Mürekkep ıstampasının kapağı kapalıydı; her zaman kapalı olduğu belliydi.
bulent: Otuz bir yılda iki sahte suret gördüm avukat hanım. İkisinde de mühür basılmıştı. Islak mühür taklit edilemez; mürekkep kâğıda işler, kâğıt onu emer. Toner emilmez; üstünde durur.
`),
  choices: [
    option('BQ_ARSIV', '“08817 yevmiyeli vekâletnamenin arşiv nüshasını görebilir miyiz?”', {
      discovers: 'clue_noter_arsiv',
      score: { ARASTIRMA: 60 },
      responses: B(`
N: Bülent bir dolabı açtı, bir klasör çıkardı, parmağını ıslatmadan sayfaları çevirdi. Bir sayfada durdu.
bulent: 10 Mayıs 2023. Hayriye Ateş, vekil Vedat Ateş. Yetkiler: bankalar, emekli maaşı, kira tahsili, elektrik, su, doğal gaz abonelikleri.
bulent: Taşınmaz satışı yok. Olsaydı ayrıca yazılırdı, tapu bilgisiyle. Satış yetkisi bir cümleyle verilmez; ada, parsel, açık irade ister.
T: Tapuya giden surette bir satış satırı vardı. Burada yok. Kâğıtlardan biri yalan söylüyor; hangisi olduğunu bu mühür biliyor.
`),
    }),
    option('BQ_KAGIT', '“Suretler hangi kâğıda basılır?”', {
      score: { ARASTIRMA: 30 },
      responses: B(`
bulent: Güvenlikli kâğıt. Filigranlı, UV ışıkta parlayan lifli. Her sayfanın seri numarası var. Bizim mühür ıslaktır; mürekkep kâğıda işler.
bulent: Fotokopiye “aslı gibidir” yazıp bir mühür bastınız mı, bir şey olmaz. Ama mürekkep yoksa, kâğıt güvenlikli değilse, o suret bizden çıkmamıştır.
T: Islak mühür, güvenlikli kâğıt. Bir suretin sahte olup olmadığını anlamak için noterin gözlüğüne değil, bir büyütece ihtiyacım var.
`),
    }),
    option('BQ_SURET', '“Şubat’ta bu vekâletnameden suret verildi mi?”', {
      score: { ARASTIRMA: 25 },
      responses: B(`
bulent: Sisteme bakayım… 2023’ten beri tek suret talebi yok. Şubat’ta hiçbir şey. Biz suret verirsek kayda geçer; kayıt yoksa suret yoktur.
bulent: Tapu yevmiye numarasını sorgular avukat hanım. Numara gerçekse sistem “mevcut” der. İçeriğine bakmaz; o kâğıdı getirenin dürüstlüğüne bakar.
T: Gerçek bir numara, sahte bir metin. Sistem numaraya inanmış.
`),
    }),
    back('NOTER_BITIR', 'Teşekkür et, çık'),
  ],
});

const tapu = conversation('INV_TAPU', {
  ...INV,
  title: 'Osmangazi Tapu Müdürlüğü',
  eyebrow: 'ARŞİV',
  background: 'adliye',
  onFirstEnter: [meet('recep')],
  room: { label: 'OSMANGAZİ TAPU · MÜDÜR YARDIMCISI', character: 'recep' },
  lines: B(`
C#adliye: OSMANGAZİ TAPU MÜDÜRLÜĞÜ
N: Numaratör öttü. Kırk yedi. Bekleme salonunda ıslak şemsiyeler ve aynı floresan. Beş ay önce bir adam burada kepini çıkarmamıştı.
recep: Recep Şahin, müdür yardımcısı. Avukat hanım, baştan söyleyeyim: işlem dosyası savcılıkta. Size kayıt veremem; mahkeme isterse veririm.
recep: Ama sorun. Usulü anlatmak yasak değil.
`),
  choices: [
    option('PQ_KAMERA', '“Salonda kamera var. Kayıt duruyor mu?”', {
      score: { ARASTIRMA: 20 },
      responses: B(`
recep: Altmış gün tutulur. Şikâyet martta geldi, savcılık nisanda sordu. Silinmişti. Herkes geç kaldı; biz de, siz de.
T: Kamera bir şey görmüş ve unutmuş. Bu dosyada makineler insanlardan daha unutkan.
`),
    }),
    option('PQ_RANDEVU', '“Randevu nasıl alınır? Kim aldı, kayıtlı mı?”', {
      score: { ARASTIRMA: 50 },
      effects: [raise('fact_randevu_tel')],
      responses: B(`
recep: Çoğu randevu ALO 181’den alınır ya da internetten. Telefonla alınırsa arayan numara kayda geçer. İşlem günü çağrı merkezi aynı numarayı arar, teyit eder.
recep: Kim aldı, söyleyemem. Ama kayıt vardır. Mahkeme yazı yazarsa bir günde göndeririz.
T: Bir numara. Bir teyit araması. Randevuyu alan kişi, tapuya gelen kişiyle aynı mı? Bunu yalnızca bir mahkeme yazısı söyler.
`),
    }),
    option('PQ_GULTEN', '“İşlemi yapan memurla konuşabilir miyim?”', {
      score: { SAVUNMA_STRATEJISI: 10 },
      neutral:
        'Savcılık tanığıyla duruşma öncesi görüşmek yasak değildir; ama tanığı etkileme izlenimi doğurur. Sorularını duruşmaya saklamak daha güvenli.',
      responses: B(`
recep: Gülten Hanım tanık avukat hanım. Savcılık dinledi, mahkeme de dinleyecek. Ben olsam şimdi konuşmazdım; siz de istemezsiniz, “avukat tanığa gitti” desinler.
recep: Bir şey söyleyeyim ama: Gülten günde altmış işlem yapar. Altmış kimlik, altmış imza. Kimseyi hatırlamaz. Ya da hatırladığını sanır.
`),
    }),
    back('TAPU_BITIR', 'Teşekkür et, çık'),
  ],
});

const hisar = conversation('INV_HISAR', {
  ...INV,
  title: 'Hisar',
  eyebrow: 'OLAY YERİ',
  background: 'ev',
  onFirstEnter: [meet('fikriye')],
  room: { label: 'HİSAR · KOMŞU', character: 'fikriye' },
  lines: B(`
C#sokak_sabah: HİSAR — HAYRİYE ATEŞ’İN EVİ
N: Yokuşun başında cumbalı, ahşap bir ev. Kapıda parlak yeni bir kilit ve bir belediye kâğıdı. Pencerelerin perdeleri kapalı.
N: Yan evin penceresi açıldı. Yetmişlik, başörtülü bir kadın, dirseklerini bir yastığa dayamış, sokağı izliyordu. Muhtemelen kırk yıldır.
fikriye: Sen kimsin evladım? Gazeteci mi? Avukat mı? Avukat. Vedat’ın mı? Gel, gel. Anahtarı bende; Hayriye bana bırakmıştı, kilidi değiştirdiler ama arka kapı eski.
fikriye: Hayriye’nin evi bu. Kırk yıl komşuluk. Şimdi bir emlakçı aldı diyorlar. Aldıysa niye gelip oturmuyor? Kapıya kâğıt yapıştırıp gitti.
`),
  choices: [
    option('FQ_ARAC', '“Şubat’ta eve gelen giden oldu mu?”', {
      discovers: 'clue_doblo',
      score: { SORGULAMA: 20 },
      responses: B(`
fikriye: Oldu. Şubatın ortası. Beyaz bir araba, şu minibüs gibi olanlardan. Doblo mu ne. Kapının önünde durdu, biri indi, içeri girdi, bir şeyler aldı çıktı.
fikriye: Vedat’ın arabası değildi; Vedat’ın arabası kırmızı, eski. Bu beyazdı, yanında yazı vardı, okuyamadım. Gözlüğüm yoktu.
fikriye: Yüzünü görmedim evladım. Kepi vardı galiba. Bu soğukta herkes kepli.
T: Beyaz bir Doblo. Matbaanın da beyaz bir Doblo’su var; yanında yazı. Dükkândaki herkes kullanıyor. Bu bir iz mi, bir sis mi?
`),
    }),
    option('FQ_HAYRIYE', '“Hayriye Hanım nasıl biriydi?”', {
      score: { SORGULAMA: 10 },
      responses: B(`
fikriye: Terzi. Kırk yıl. Benim gelinliğimi o dikti, kızımınkini o dikti. Halit’in cenazesinde dikiş makinesini bir hafta açmadı. Sonra açtı, bir daha kapatmadı.
fikriye: Vedat her pazar gelirdi, Nermin ayda bir. Halit’in oğlu da gelirdi eskiden; bankaya götürür getirirdi. Sonra o da seyrekleşti.
T: Bir komşunun hafızası bir aile ağacı gibi. Her dalda bir isim; bazıları sık, bazıları seyrek.
fikriye: Bir de şunu yaz evladım: Hayriye evini kimseye satmazdı. “Bu evden beni tabutla çıkarırsınız” derdi. Huzurevine bile ağlayarak gitti.
fikriye: Şimdi ev satılmış, kendisi bilmiyor. Bilmesin. Bilse… bilse o huzurevinin penceresinden atlar.
`),
    }),
    cont('FQ_EV', 'Evi içeriden gör', 'INV_ARAMA_H', { role: 'PRIMARY' }),
  ],
});

export const peopleNodes: NodeDef[] = [tarik, emre, nermin, nerminX, erol, hayriye, noter, tapu, hisar];
