import { has, inc, option, raise, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef } from '../../../tools/content/src/kit/index.js';
import { B } from './dsl.js';
import { ARA } from './shared.js';

// 72-ara-kisiler: ara evresindeki ek görüşmeler — teknisyen, ev arkadaşı (tanık), büroya gelen Hayri Bey — ve ikinci akşam.
// Hepsi doğrudan ARA_HUB'a döner.

const home = (id: string, label: string): ChoiceDef => ({ id, kind: 'CONTINUE', label, role: 'BACK', next: 'ARA_HUB' });

export const araKisiler: CasePart = {
  nodes: [
    {
      id: 'ARA_VOLKAN',
      type: 'DIALOGUE',
      mode: 'CONVERSATION',
      ...ARA,
      title: 'Volkan Sezer',
      background: 'depo',
      room: { label: 'KENT ULAŞIM · KAYIT ODASI', character: 'volkan' },
      lines: B(`
# depo | KENT ULAŞIM TERMİNALİ · TEKNİK ODA
Penceresiz bir oda. Duvar boyu ekranlar, her birinde dört küçük pencere: bir şehrin otobüsleri, canlı, sessiz, gri. Bir klima vızıldıyordu.
Volkan Sezer bir ekranın önünde, kulaklıkları boynunda oturuyordu. Beni görünce kulaklığı çıkardı ama ayağa kalkmadı.
volkan: Avukat hanım. Mahkemeden tanık davetiyesi geldi. Sizin yüzünüzden, sanırım.
P: Mahkeme çağırdı. Ben yalnızca neyi bildiğinizi merak ediyorum. Ne diyeceğinizi değil.
volkan: Fark ne?
P: Birincisi benim işim. İkincisi sizin.
`),
      choices: [
        option('VK_NASIL', '“O gece CD’yi nasıl hazırladınız? Adım adım.”', {
          next: '$stay',
          score: { SORGULAMA: 40 },
          effects: [raise('volkan_anlatti')],
          responses: B(`
volkan: Gece on bir buçukta polis geldi. Bir memur. Sistemi açtım, o seferin bir saatini olay klasörüne aldım. Prosedür.
volkan: Memur ekrana baktı. Orta kamerada çocuğu görünce “işte, bu. Olay anı yeterli” dedi. O iki buçuk dakikayı CD’ye bastım. İmzaladım. Gitti.
volkan: Öbür kameralara bakmadı. Ben de bakmadım. Saat gece yarısıydı. Benim işim istenen kaydı vermek, hikâye kurmak değil.
> “Hikâye kurmak değil.” Bir hikâyeyi bir başkası kurmuştu. Volkan yalnızca ona bir sahne vermişti.
`),
        }),
        option('VK_SEGMENT', '“Formdaki dipnot: bir segment yazma hatası. Ne oldu?”', {
          next: '$stay',
          visibleWhen: has('clue_bozuk_segment'),
          score: { SORGULAMA: 30 },
          effects: [raise('volkan_segment')],
          responses: B(`
Volkan bir an sustu. Sonra ekranlardan birine döndü, bir dosya açtı, kapattı.
volkan: CD yazarken bir dakika hata verdi. Eski bir sürücü. Yeniden denemek on dakika sürerdi, memur bey kapıda bekliyordu. Dipnot düştüm.
volkan: Kimse sormadı. Yedi aydır kimse o dipnotu okumadı. Siz okumuşsunuz.
`),
        }),
        option('VK_DEGISTIR', '“Mahkemede ‘eksik aktardım’ demeniz herkes için iyi olur.”', {
          next: 'ARA_HUB',
          score: { SORGULAMA: -50 },
          effects: [inc('ethics'), raise('volkan_kizgin')],
          bad: 'Tanığa duruşmada ne söylemesi gerektiğini önermek, beyanını etkileme girişimidir ve meslek kurallarına aykırıdır. Tanığın neyi bildiğini sormak meşru; ne diyeceğini söylemek değil.',
          category: 'SORGULAMA',
          responses: B(`
volkan: “Herkes için” kim? Siz mi? Ben mahkemede ne gördüysem onu söylerim avukat hanım. Sizin cümlenizi değil.
Kulaklığını yeniden taktı. Konuşma bitmişti.
> Az önce ona farkın ne olduğunu anlatıyordum. Sonra farkı kendim sildim.
`),
        }),
        home('VK_BITIR', 'Teşekkür edip çık'),
      ],
    },

    {
      id: 'ARA_OZAN',
      type: 'DIALOGUE',
      mode: 'CONVERSATION',
      ...ARA,
      title: 'Ozan Kaplan',
      background: 'ev',
      room: { label: 'GÖRÜKLE · ÖĞRENCİ EVİ, MUTFAK', character: 'ozan' },
      lines: B(`
# ev | GÖRÜKLE · ÖĞRENCİ EVİ, MUTFAK
Mutfakta tencere tencere makarna. Ozan tezgâha yaslanmış, kırmızı şapkası geriye dönük. Arda sahafta, ev boştu.
ozan: Tanık olacakmışım abla. Davetiye geldi. Annem duysa “hayırdır oğlum” der. Hayır mı?
P: Hayır. Gördüğünü anlatacaksın. Ben de neyi gördüğünü merak ediyorum.
`),
      choices: [
        option('OZ_SABAH', '“O geceyi ve sabahı anlatır mısın?”', {
          next: '$stay',
          score: { SORGULAMA: 40 },
          effects: [raise('ozan_anlatti')],
          responses: B(`
ozan: Gece on bir gibi mutfağa su almaya kalktım. Arda’nın kapısı açıktı, masasında sarı bir not: “Yarın 9 — karakol.” Sordum, anlattı.
ozan: Bir de dedi ki, “belediyeyi aradım, yarın terminale götür dediler.” Ben de “git polise ver, kafan rahat etsin” dedim. Sabah gidecekti.
ozan: Sekiz on beşte kapı çaldı. Polis. Notu da aldılar. Ben “o not ne” diye sordum, memur “delil” dedi. Okumadı bile.
`),
        }),
        option('OZ_DOGRU', '“Mahkemede gördüğünü söyle; görmediğini, duyduğunu değil.”', {
          next: '$stay',
          score: { SORGULAMA: 30 },
          effects: [raise('ozan_hazir')],
          good: 'Tanığa ne diyeceği değil, nasıl tanıklık edeceği hatırlatıldı: kendi gözlemi. Bu meşru bir hazırlıktır.',
          category: 'SORGULAMA',
          responses: B(`
ozan: Yani Arda’nın “belediyeyi aradım” demesi… duyduğum mu oluyor?
P: Onu Arda’dan duydun. Notu ise gördün. Gördüğünü söyle. Arda’nın söylediğini “bana şöyle dedi” diye söyle.
ozan: Tamam. Ben mühendisim abla. Ölçtüğümü söylerim.
`),
        }),
        option('OZ_YAZ', '“Mahkemede söyleyeceklerini birlikte yazalım, ezberle.”', {
          next: '$stay',
          score: { SORGULAMA: -40 },
          effects: [raise('ozan_ezber')],
          bad: 'Tanığa ezber metin hazırlamak, beyanını yönlendirmektir; hem meslek kurallarına aykırıdır hem de kürsüde ezber gibi duyulan tanıklık inandırıcılığını yitirir.',
          category: 'SORGULAMA',
          responses: B(`
Ozan bir kâğıda yazdığım üç cümleyi okudu, cebine koydu.
ozan: Tamam abla. Ezberlerim. Sınav gibi.
> Sınav gibi. Bir tanıklığı sınava çevirdim. Hâkimler ezberi, öğretmenlerin kopyayı tanıdığı gibi tanır.
`),
        }),
        home('OZ_BITIR', 'Vedalaş'),
      ],
    },

    {
      id: 'ARA_HAYRI',
      type: 'DIALOGUE',
      mode: 'CONVERSATION',
      ...ARA,
      title: 'Hayri Doğan',
      background: 'buro',
      room: { label: 'ARSLAN HUKUK · BEKLEME SALONU', character: 'hayri' },
      lines: B(`
# buro | ARSLAN HUKUK · BEKLEME SALONU
Sekreter kapıyı araladı: “Bir bey sizi soruyor. Randevusu yok. Ceketi ütülü.”
Hayri Bey bekleme salonunda, şapkası dizlerinin üstünde oturuyordu. Beni görünce ayağa kalktı; eski usul, hafifçe eğilerek.
hayri: Kusura bakma kızım, habersiz geldim. Uyuyamıyorum. Otuz yıl bir adresi şaşırmadım dedim. Mahkemede şaşırdığımı anladım.
> Tanık olarak dinlenmişti. Ama yeniden çağrılabilirdi. Ona hiçbir şey göstermeyecek, hiçbir şey önermeyecektim. Yalnızca dinleyecektim.
`),
      choices: [
        option('HYA_DINLE', '“Dinliyorum, Hayri Bey.”', {
          next: '$stay',
          score: { SORGULAMA: 30 },
          effects: [raise('hayri_ozur')],
          good: 'Daha önce dinlenmiş tanıkla temas yalnızca dinlemekle sınırlı kaldı; beyanını değiştirmeye yönelik bir öneri ya da delil gösterme yok.',
          category: 'SORGULAMA',
          responses: B(`
hayri: O kapüşon… Eve gidince düşündüm. Parlaktı. Yağmurluk gibi, naylon. Sokak lambası vurunca parladı. Çocuğun giydiği pamuklu bir şeydi, mahkemede gördüm.
hayri: Ben o çocuğu görmedim. Bir kapüşon gördüm. Polis “bu mu” deyince… insan polise inanır kızım. Ben postacıydım, devlete inanırım.
hayri.uzgun: O çocuğa söyle, ben yalan söylemedim. Yanıldım. Arası çok ama… ikisi aynı değil.
`),
        }),
        option('HYA_KARE', 'Tam kayıttan bir kare göster: “Bu mu?”', {
          next: '$stay',
          visibleWhen: has('clue_kare_parka'),
          score: { SORGULAMA: -40 },
          effects: [raise('hayri_kare_gosterildi')],
          bad: 'Yeniden çağrılabilecek bir tanığa duruşma dışında delil gösterip “bu mu?” diye sormak, karakolda ona yapılan telkinin aynısıdır. Tanığın belleğini bir kez daha kirletir.',
          category: 'SORGULAMA',
          responses: B(`
Hayri Bey ekrana eğildi. Gözlüğünü taktı, çıkardı, yeniden taktı.
hayri: Bu… olabilir. Bu da olabilir kızım. Bilmiyorum artık. Herkes bana bir şey gösteriyor, “bu mu” diyor.
> Karakolda ona bir kare gösterildi, “bu mu” dendi. Şimdi aynısını ben yaptım. Farkımız yalnızca hangi tarafta durduğumuzdu.
`),
        }),
        option('HYA_TESEKKUR', '“Mahkemede doğruyu söylediniz. Yanıldığınızı da söylediniz. Bu cesaret.”', {
          next: '$stay',
          effects: [inc('trust', 3), raise('hayri_tesekkur')],
          responses: B(`
Hayri Bey şapkasını iki eliyle çevirdi. Bir şey söyleyecekti, vazgeçti.
hayri: Otuz yıl mektup taşıdım. Bir kere yanlış kapıya bıraktım. Bir askerin annesine… başka birinin mektubunu. Kadın ağladı. Sevinçten. Sonra ben ağladım.
hayri: Yanlış kapı insanın içinde kalır kızım. Bunu da bırakmayayım içimde.
`),
        }),
        home('HYA_BITIR', 'Kapıya kadar geçir'),
      ],
    },

    {
      id: 'ARA_KARAKOL',
      type: 'DIALOGUE',
      mode: 'CONVERSATION',
      ...ARA,
      title: 'Pol. Mem. Serkan Ulu',
      background: 'karakol',
      room: { label: 'GÖRÜKLE POLİS MERKEZİ', character: 'serkan' },
      lines: B(`
# karakol | 10.30 — GÖRÜKLE POLİS MERKEZİ
Durağın tam karşısında. Kapıda bir bariyer, bir nöbetçi kulübesi, ıslak bir Türk bayrağı. Arda’nın o gece kapısına kadar gelip döndüğü yer.
> Kırk adım. Bir öğrenci için kırk adım, bir ömürlük bir korkunun önünde duran bir duvar olabilir.
İçeride florasan, kuru kahve kokusu, bir yazıcının hırıltısı. Masada genç bir memur, önünde bir yığın tutanak.
serkan: Avukat hanım? Serkan Ulu. Cüzdan dosyası, değil mi? Davetiye gelmedi bana, tanık değilim. Ama sorun, bildiğimi söylerim. Beş dakika.
`),
      choices: [
        option('KR_SABAH', '“7 Mart sabahını anlatır mısınız?”', {
          next: '$stay',
          score: { SORGULAMA: 30 },
          effects: [raise('serkan_anlatti')],
          responses: B(`
serkan: Gece kaydı izledik, kent kartla adı bulduk, sabah sekiz on beşte kapıdaydık. Çocuk “buldum, bugün teslim edecektim” dedi. Hepsi öyle der.
serkan: Çantada cüzdan, zarfta para, masada bir not. Hepsini poşetledik. Notu okumadım, itiraf edeyim. Delil poşeti açılmaz, açılırsa tutanak bozulur.
> Poşet açılmaz. Açılmayan poşetlerde okunmayan notlar. Bir dosya bazen böyle doğar.
`),
        }),
        option('KR_CD', '“CD’ye neden yalnızca orta kamerayı aldınız?”', {
          next: '$stay',
          score: { SORGULAMA: 30 },
          effects: [raise('serkan_cd')],
          responses: B(`
serkan: Çocuk orta kamerada, net. Cüzdanı alıyor, çantaya koyuyor. Olay anı belliydi. Bir saat izleyecek vaktim yoktu; o gece üç dosyam vardı.
serkan: Klasör duruyor, mahkeme isterse gelir. Biz ne gördüysek onu aldık.
Bir an sustu. Kahvesine baktı.
serkan: Öncesi var mıydı? Varsa… varsa kötü olmuş.
`),
        }),
        option('KR_SUCLA', '“Eksik soruşturma yaptınız. Bunu mahkemede söyleyeceğim.”', {
          next: '$stay',
          score: { SORGULAMA: -30 },
          effects: [raise('serkan_kizgin')],
          bad: 'Bilgi almaya gittiğin bir kolluk görevlisini suçlamak hiçbir şey kazandırmaz; eksikliği mahkemede delille göstermek yeter. Gereksiz çatışma kapıları kapatır.',
          category: 'SORGULAMA',
          responses: B(`
serkan.kizgin: Söyleyin. Ben işimi yaptım. Siz de sizinkini yapın. Kapı orada avukat hanım.
> Kırk adım geri yürüdüm. Arda’nın o gece yürüdüğü kırk adım. Ben kendi elimle kapattım kapıyı.
`),
        }),
        home('KR_BITIR', 'Teşekkür edip çık'),
      ],
    },

    story('ARA_AKSAM2', {
      ...ARA,
      title: 'Zehra’nın telefonu',
      background: 'sokak_yagmur',
      lines: B(`
# sokak_yagmur | 9 KASIM · PAZAR 22.15 — EVE DÖNÜŞ
Yağmur yeniden başlamıştı. Telefon titredi. Zehra.
zehra~phone: Söyledim. Anneme. Arda değil, ben söyledim. Telefonda.
zehra~phone: Bir süre hiç konuşmadı. Sonra “o karakolun önündeki bank hâlâ duruyor mu” dedi. Kars’taki. “Soğuk muydu” dedi, “o sabah.”
zehra~phone: Avukat hanım… Annem gelmek istiyor. Duruşmaya. Gelsin mi?
`),
      choices: [
        option('AK3_GELSIN', '“Gelsin. Arda’nın arkasında bir yüz görmesi iyi olur.”', {
          effects: [raise('anne_gelecek'), inc('trust', 3)],
          responses: B(`
zehra~phone: Gelsin diyorsunuz. Tamam. Otobüs bileti alırım. Gece otobüsü.
> Gece otobüsü. Bir annenin, bir oğlun, bir kayıp cüzdanın etrafında dönen bir şehrin otobüsleri. Hepsi aynı yağmurda.
`),
          next: 'ARA_HUB',
        }),
        option('AK3_GELMESIN', '“Arda’ya sorun. Bu onun kararı.”', {
          effects: [raise('anne_arda_karar')],
          responses: B(`
zehra~phone: Arda’ya mı? Haklısınız. Hep ben karar veriyorum onun yerine. Bu sefer o versin.
> Bazen bir avukatın en iyi cevabı, cevabı sahibine geri vermektir.
`),
          next: 'ARA_HUB',
        }),
      ],
    }),
  ],
};
