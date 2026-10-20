import { cont, meet, option, raise, set, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, S } from './lib.js';
import { BRIEF, INV, PRO, p1 } from './shared.js';

// 40-briefing: soğuk açılış (tapu gişesi, isimsiz sesler), üç kısa an (19 Şubat, 3 Mart, 7 Mayıs), Sevgi'nin büroya
// gelişi, Leyla'nın dosya devri (iki A–D), dosya ekranı ve strateji, matbaada ilk sabah.

const PROLOG = S(`
C#adliye: 18 ŞUBAT · 11.20 — OSMANGAZİ TAPU MÜDÜRLÜĞÜ
N: Numaratör öttü. Kırk yedi. Bekleme salonunda ıslak şemsiyeler, floresan ışığı ve kimsenin okumadığı bir duyuru panosu.
N: Dışarıda şubat yağmuru, Osmangazi’nin çatılarına inatla vuruyordu. İçeride herkes bir kâğıt tutuyordu: tapu, vekâletname, kimlik fotokopisi. Herkes bir şey satıyor ya da alıyordu.
N: Köşede yaşlı bir adam, torununun hazırladığı dosyayı göğsüne bastırmıştı. Bir kadın telefonda “annemin evi, evet, sonunda” diyordu. Kimse kimsenin yüzüne bakmıyordu.
N: Gişe camının ardında yorgun bir kadın, sabahtan beri aynı cümleyi kuruyordu. Kırk yedi numara yerinden kalktı.
N: Kepli bir adam. Koyu camlı gözlük, boynunda gri bir atkı. Montunun omuzlarında yağmur. Gişeye yürürken başını hiç kaldırmadı.
?GİŞE: Adınız?
?KEPLİ_ADAM: Vedat Ateş.
N: Bir kimlik kartı tezgâhın üstünde kaydı. Arkasından katlanmış bir kâğıt: üstünde mühür, köşesinde “aslı gibidir”.
?GİŞE: Vekâleten satış. Annenizin adına. Yevmiye numarasına bakıyorum, bir dakika.
N: Klavye. Ekranda yeşil bir satır. Kadın kâğıdın ilk satırına baktı, son satırına baktı. Ortasına bakmadı. Arkada otuz kişi vardı.
N: Ortada bir cümle vardı. Diğerlerinden biraz daha sıkışık, biraz daha koyu. Kimsenin okumadığı cümleler, bir kâğıdın en çok konuşan yeridir.
?GİŞE: Kayıt mevcut. İptal yok. Alıcı burada mı?
?ALICI: Buradayım hanımefendi. Hayırlı işlerde gecikmeyelim.
N: İkinci ses pürüzsüzdü; cilalı ayakkabı gibi. Adamın yanında durdu ama ona bakmadı.
?GİŞE: Fotoğraf için kepinizi çıkarır mısınız?
?KEPLİ_ADAM: Soğuk aldım. Başım üşüyor.
?GİŞE: Gözlüğü bari.
?KEPLİ_ADAM: Göz ameliyatı. Işık vuruyor.
N!flash: Flaş patladı. Kadın ekrana baktı, omuz silkti. Sistem fotoğrafı kabul etmişti; sistem her şeyi kabul ediyordu.
N: Senet yazıcıdan çıktı, hâlâ sıcaktı. Kalemlik gişenin sağ köşesindeydi, zincirli.
N: Adam kalemi aldı. Bir an durdu, sanki kalemin ağırlığını tartıyordu. Sonra kalemi öbür eline geçirdi.
N: İmza. Kısa, hızlı, alışık. Islak mürekkep floresanın altında parladı.
?ALICI: Hayırlı olsun.
N!fade: Dışarıda yağmur hızlanmıştı. Tapunun saçağı altında iki adam yan yana durdu; biri sigara yaktı, öbürü atkısını burnuna kadar çekti.
?ALICI: Hesap kapandı. Bir daha karşıma çıkma.
?KEPLİ_ADAM: Çıkmam.
?ALICI: Bir de şu atkıyı çıkar artık. Bahar geliyor.
?KEPLİ_ADAM: Bende kış uzun sürer.
N: Kepli adam yağmura yürüdü. Arkasına bakmadı. Bakmasına gerek yoktu; kâğıt yerine ulaşmıştı.
N: Senette bir isim vardı. İsim doğruydu. İmza, kâğıda düştüğü anda birinin elinden çıkmıştı. Kimin elinden çıktığını o gün kimse sormadı.
`);

const UC_AN = S(`
C#depo: 19 ŞUBAT · 08.10 — ATEŞ MATBAASI, KAYHAN
N: Kurşun dizgi makinesi tıkırdıyordu. Mürekkep, toner ve eski kâğıt kokusu. Bir adam, kapının arkasındaki askıdan ceketini aldı, iç cebini yokladı.
?BİR_ADAM: Buradaymış. Dün bütün dükkânı aradım. Sevgi’ye bile yazdım.
N: Kimse cevap vermedi. Makine tıkırdamaya devam etti. Adam kimliği cebine geri koydu ve önlüğünü bağladı.
N: Bir an kimliğin fotoğrafına baktı; kendi yüzüne. Sonra omuz silkti. İnsan kendi eşyasının bir gece nereye gittiğini merak etmez; geri gelmişse.
C#ev: 3 MART · 17.40 — HİSAR
N: Yokuşun başında, ahşap cumbalı bir ev. Bir kadın anahtarı kilide soktu. Çevirdi. Anahtar dönmedi. Kilit yeniydi; parlıyordu.
?BİR_KADIN: Bu kilit… Bu kilidi kim taktı?
N: Telefonunu çıkardı. Parmakları titriyordu. Ekranda bir sayfa açıldı; bir tablo, bir ad, bir tarih.
N: Yan evin penceresi aralandı; bir komşu başını uzattı, bir şey söylemedi, geri çekildi. Yokuştan bir araba indi, sileceği tek tarafta çalışıyordu.
?BİR_KADIN: Satılmış. Annemin evi… satılmış. On sekiz şubatta.
C#siyah: 7 MAYIS
N: Bursa Cumhuriyet Başsavcılığı. İddianame. Sanık: Vedat Ateş. Suç: resmî belgede sahtecilik.
N!fade: Beş ay sonra, sanığın karısı bir avukat aradı.
`);

const SEVGI = S(`
C#buro_gece: 22 EYLÜL · 21.10 — ARSLAN HUKUK, BURSA
T: Bursa’da sonbahar iki şey getirir: yaprak ve dosya. Yaprağı süpürürsün. Dosyayı süpüremezsin; okursun.
N: Yağmur camda ince çizgiler çiziyordu. Büro boşalmıştı. Leyla’nın odasının ışığı yanıyordu, kapısı aralıktı.
N: Zil çaldı. Kapıda kırklı yaşlarında bir kadın: düzgün kesilmiş saçlar, ıslak bir trençkot, göğsüne bastırdığı karton bir klasör.
sevgi: Deniz Hanım? Sevgi Ateş. Telefonda konuşmuştuk. Geç oldu, biliyorum. Okul çıkışı ancak.
N: Klasörü masaya bıraktı ama elini üstünden çekmedi. Bir öğretmenin karne bırakırken yaptığı gibi.
sevgi: Sırayla anlatayım, sınıfta da böyle yaparım. Bir: kocam Vedat. Kırk dokuz yaşında, matbaacı. Babasının dükkânı, Kayhan’da.
sevgi: İki: annesi Hayriye Hanım, seksen iki yaşında. Alzheimer. Geçen eylülden beri Çekirge’de bir huzurevinde.
sevgi: Üç: annesinin Hisar’daki evi şubatta satılmış. Tapuda “Vedat Ateş” imzası var. Annesinin vekili olarak.
sevgi: Dört: Vedat o gün tapuya gitmedi. Matbaadaydı. Kimliğini bile bulamıyordu o sabah; bana mesaj attı.
T: Dört madde. Hepsi düzgün, hepsi numaralı. İnsan korkusunu bazen böyle dizer; sıraya koyunca küçülür sanır.
P: İddianamede ne yazıyor?
sevgi: Sahte bir vekâletname suretiyle evi sattığını. Bir de bilirkişi raporu var; imza onunmuş. “Aynı elin ürünü” diyor.
N: Klasörü açtı. İddianamenin fotokopisi, bir grafolog raporu, bir matbaa kartviziti. Kartvizitin köşesi mürekkepten mosmordu.
sevgi.uzgun: Kocam ömrü boyunca kâğıt bastı avukat hanım. Şimdi bir kâğıt onu basıyor.
N: Sokaktan bir korna sesi geldi. Sevgi pencereye baktı. Aşağıda bir arabanın farları yanıp söndü.
sevgi: Yeğenimiz. Halit ağabeyin oğlu. Getirdi beni; şimdi bekliyor, sağ olsun. O olmasa dükkân dönmezdi bu aylarda.
sevgi: Vedat gelemedi. Gelemiyor, aslında. Adliyenin önünden geçerken bile yolunu değiştiriyor.
T: Bir imza. Bir ev. Seksen iki yaşında, evini kaybettiğini bilmeyen bir kadın. Ve beni aşağıda bekleyen bir çift far.
P: Vedat Bey bu imzayı gördü mü? Kendi gözüyle?
sevgi: Gördü. Savcılıkta gösterdiler. Bir süre baktı, sonra “bu benim adım ama benim elim değil” dedi. Savcı yazdı mı, bilmiyorum.
sevgi: Eve geldi, bir kâğıda yüz kere imza attı. Sabaha kadar. Sonra kâğıtları sobaya attı. “Kendi imzamı unutacağım” dedi.
sevgi.uzgun: Bir adam kendi imzasını unutabilir mi Deniz Hanım? Ben öğretmenim; çocuklara adlarını yazmayı ben öğretirim. Kimse adını unutmaz.
T: Adını unutmaz. Ama birinin onu kendi adına yazdığını görünce, kendi elinden şüphe edebilir. Bu bir imza davası değil; bir el davası.
`);

const LEYLA_KAPI = S(`
N: Leyla odasının kapısında belirdi. Gözlüğü burnunun ucunda, elinde kalemi. Ne zamandır orada olduğunu bilmiyordum.
leyla: İyi akşamlar Sevgi Hanım. Leyla Erdem. Dosyayı Deniz alacak; ben arkasında duracağım.
leyla: Bir imzanın kime ait olduğunu bilmek için önce kimin olmadığını bilmek gerekir. Bu biraz zaman alır.
sevgi: Zamanımız var mı?
leyla: İlk celse on dört ekimde. Üç hafta. Bir imza için az, bir ömür için çok.
leyla: Bir şey rica edeceğim Sevgi Hanım: kimseyle dosyayı konuşmayın. Aileyle bile. Avukatınız Deniz; dosya onunla sizin aranızda.
sevgi: Aileyle bile mi? Biz bir aileyiz Leyla Hanım. Matbaada herkes birbirinin her şeyini bilir.
leyla: O zaman bu dosya o matbaadaki tek sır olsun.
N: Sevgi klasörü bıraktı, kartviziti üstüne koydu ve gitti. Merdivenlerden inen topuk sesleri, sonra bir araba kapısı, sonra yalnızca yağmur.
`);

const LEYLA_DEVIR = S(`
N: Leyla karşıma oturdu. Klasörü kendine çekmedi; parmağının ucuyla bana doğru itti.
leyla: Okudun mu? Okuma. Önce bana suçu söyle. İddianamede ne var, ceza aralığı ne?
T: Leyla’nın soruları sınav değildir. Tuzaktır. Tuzağa düşersen, düştüğün yeri hiç unutmazsın.
N: Pencerenin önünde yağmur sesi. Leyla kalemini parmaklarının arasında çevirdi; bir kez, iki kez. Masasının köşesinde ters duran bir çerçeve. Hiç sormadım.
`);

export const briefing: CasePart = {
  nodes: [
    story('PR_00', {
      ...PRO,
      title: 'Kırk yedi numara',
      background: 'adliye',
      lines: [{ lines: PROLOG }],
      choices: [cont('PR00_DEVAM', 'Devam', 'PR_01', { role: 'PRIMARY' })],
    }),
    story('PR_01', {
      ...PRO,
      title: 'Üç an',
      background: 'depo',
      lines: [{ lines: UC_AN }],
      choices: [cont('PR01_DEVAM', 'Dosyayı aç', 'BR_00', { role: 'PRIMARY' })],
    }),
    story('BR_00', {
      ...BRIEF,
      title: 'Sevgi Hanım',
      background: 'buro_gece',
      onFirstEnter: [meet('deniz'), meet('sevgi')],
      lines: [{ lines: SEVGI }],
      choices: [
        option('BR00_DINLE', '“Önce Vedat Bey’i dinlemem lazım.”', {
          effects: [set('trust', 70)],
          responses: B(`
P: Önce Vedat Bey’i dinlemem lazım. Kendi ağzından. Sonra kâğıtları.
sevgi: Dinleyin. Kimse dinlemedi. Polis bir kere sordu, savcı bir kere. İkisi de cevabı yazmadan sordu.
T: Söz vermedim. Ama bir kapı açtım. Bazen ikisi aynı şey sanılır.
`),
          next: 'BR_00L',
        }),
        option('BR00_SOZ', '“Merak etmeyin. Kazanırız.”', {
          effects: [raise('soz_verdi')],
          responses: B(`
P: Merak etmeyin Sevgi Hanım. Bu dosyayı kazanırız.
sevgi.mutlu: Allah razı olsun. Bunu Vedat’a söyleyeceğim. Bu gece belki uyur.
T: Bir cümle. Ağzımdan çıktığı anda ağırlaştı. Söz, mürekkep gibidir; kâğıda düşünce silinmez.
`),
          next: 'BR_00L',
        }),
        option('BR00_UCRET', '“Süreci ve ücreti anlatayım.”', {
          responses: B(`
P: Önce süreci anlatayım: dosya incelemesi, delil talepleri, iki celse, belki üç. Ücret sözleşmesini yarın imzalarız.
sevgi: Sözleşme. İmza. Ne komik değil mi? Bir imza yüzünden buradayız, bir imzayla başlıyoruz.
T: Haklıydı. Bu dosyada her şey bir imzayla başlayacaktı.
`),
          next: 'BR_00L',
        }),
      ],
    }),
    story('BR_00L', {
      ...BRIEF,
      title: 'Leyla',
      background: 'buro_gece',
      onFirstEnter: [meet('leyla')],
      lines: [{ lines: LEYLA_KAPI }],
      choices: [cont('BR00L_DEVAM', 'Leyla’yla otur', 'BR_01', { role: 'PRIMARY' })],
    }),
    story('BR_01', {
      ...BRIEF,
      title: 'Dosya devri',
      background: 'buro_gece',
      lines: [{ lines: LEYLA_DEVIR }],
      choices: [
        option('BR01_A', 'Resmî belgede sahtecilik; iki yıldan beş yıla kadar', {
          score: { HUKUKI_BILGI: 50 },
          good: 'Doğru: sahte resmî belge düzenleme ve kullanma, TCK 204/1: iki yıldan beş yıla kadar hapis.',
          responses: B(`
leyla: Doğru. Resmî belgeyi sahte olarak düzenlemek, gerçeğini değiştirmek ya da sahtesini kullanmak. İki yıldan beş yıla.
leyla: Şuna dikkat et: suret, noterin kendi düzenlediği vekâletnamenin aslı değil; ama noter sureti de resmî belgedir.
leyla: Savcı “kanun hükmü gereği sahteliği sabit oluncaya kadar geçerli belge” ağırlaştırmasını, 204/3’ü koymamış. Mütalaada hatırlarsa itiraz edersin.
leyla: Alt sınır iki yıl. Takdiri indirimle bir yıl sekiz aya iner; erteleme mümkün olur. Hükmün açıklanmasının geri bırakılması için ise zararın giderilmesi gerekir. Bir ev, kolay giderilen bir zarar değildir.
leyla: Bunları müvekkiline şimdi söyleme. Önce imzayı konuş. Rakamlar, insanların kulağında kalır; imzayı unuturlar.
`),
          next: 'BR_01B',
        }),
        option('BR01_B', 'Özel belgede sahtecilik; bir yıldan üç yıla kadar', {
          bad: 'Noter sureti ve tapu senedi resmî belgedir; özel belgede sahtecilik (TCK 207) bu iddianamenin suçu değil.',
          category: 'HUKUKI_BILGI',
          responses: B(`
leyla: Hayır. Özel belge, bir kişinin kendi düzenlediği kâğıttır: senet, makbuz, irsaliye. Noterin mührünü taşıyan suret resmîdir.
leyla: Doğrusu 204/1: iki yıldan beş yıla. Bu ayrımı unutma; bu dosyada birden fazla kez karşına çıkacak.
`),
          next: 'BR_01B',
        }),
        option('BR01_C', 'Kamu görevlisinin sahteciliği; üç yıldan sekiz yıla', {
          bad: 'TCK 204/2 belgeyi görevi gereği düzenlemeye yetkili kamu görevlisi içindir; Vedat Ateş matbaacıdır.',
          category: 'HUKUKI_BILGI',
          responses: B(`
leyla: Müvekkilin noter değil, matbaacı. 204/2 belgeyi düzenlemeye yetkili kamu görevlisi içindir.
leyla: Doğrusu 204/1: iki yıldan beş yıla. Yetkisi olmayan herkes için.
`),
          next: 'BR_01B',
        }),
        option('BR01_D', 'Nitelikli dolandırıcılık; üç yıldan on yıla', {
          bad: 'Satış nedeniyle dolandırıcılık ayrı bir soruşturma konusu olabilir; bu iddianame yalnızca TCK 204/1’e dayanıyor.',
          category: 'HUKUKI_BILGI',
          responses: B(`
leyla: İddianameyi okumadan cevap verdin. Dolandırıcılık bu dosyada yok; belki başka bir dosyada vardır, başka bir savcının masasında.
leyla: Burada tek suç var: 204/1, resmî belgede sahtecilik. İki yıldan beş yıla.
`),
          next: 'BR_01B',
        }),
      ],
    }),
    story('BR_01B', {
      ...BRIEF,
      title: 'Dört kâğıt',
      background: 'buro_gece',
      lines: B(`
N: Leyla klasörden dört kâğıt çıkardı ve masaya yan yana dizdi. Bir iskambil falı gibi.
leyla: Noter sureti. Tapu senedi. Erol Kılınç’ın bürosunda doldurulmuş bir kapora makbuzu. Matbaanın bir sevk irsaliyesi.
leyla: Hangileri resmî belge? Acele etme. Bu sorunun cevabı, raporu nasıl okuyacağını belirleyecek.
T: Dört kâğıt. Biri bir mührün, biri bir devletin, biri bir emlakçının, biri bir dükkânın sesi.
`),
      choices: [
        option('BR01B_A', 'Suret ve senet resmî; makbuz ve irsaliye özel', {
          score: { HUKUKI_BILGI: 50 },
          good: 'Doğru: noter sureti ve tapu senedi kamu görevlisince yetkisi dahilinde düzenlenen resmî belgedir; makbuz ve irsaliye özel belgedir (TCK 207 alanı).',
          responses: B(`
leyla: Güzel. Şimdi asıl soruyu sor kendine: bilirkişi senetteki imzayı neyle karşılaştırmış?
leyla: Karşılaştırma imzası, kimin attığı belli olan imzadır. Noterde, bankada, nüfusta, bir memurun önünde atılmış imza. Bir dükkân kâğıdındaki imzayı herkes atabilir.
T: Kimin attığı belli olan imza. Bunu bir kenara yazdım. Altını iki kez çizdim.
`),
          next: 'BR_02',
        }),
        option('BR01B_B', 'Dördü de resmî; hepsi bir işlemin parçası', {
          bad: 'Bir işlemin parçası olmak belgeyi resmî yapmaz; makbuz ve irsaliye özel kişilerce düzenlenir (TCK 207).',
          category: 'HUKUKI_BILGI',
          responses: B(`
leyla: Hayır. Belgeyi resmî yapan işlem değil, düzenleyendir. Makbuzu emlakçı, irsaliyeyi matbaa yazar. Onlar özel belgedir.
leyla: Bunu bil, çünkü bilirkişi senetteki imzayı tam da bu özel kâğıtlarla karşılaştırmış. Kimin attığı belli olmayan imzalarla.
`),
          next: 'BR_02',
        }),
        option('BR01B_C', 'Yalnızca senet resmî; suret bir fotokopi', {
          bad: '“Aslı gibidir” onaylı noter sureti de resmî belgedir; sahte onay şerhi taşıyan suret resmî belgede sahteciliğin konusudur.',
          category: 'HUKUKI_BILGI',
          responses: B(`
leyla: Fotokopi değil; onaylı suret. Noterin “aslı gibidir” dediği kâğıt resmî belgedir. Sahtesi de resmî belgede sahteciliktir.
leyla: Makbuz ve irsaliye özeldir. Bilirkişinin hangi kâğıtlara baktığına dikkat et.
`),
          next: 'BR_02',
        }),
      ],
    }),
    story('BR_02', {
      ...BRIEF,
      phase: 'BRIEFING',
      title: 'Sahte İmza',
      background: 'buro_gece',
      onFirstEnter: [meet('vedat')],
      blocks: [
        {
          type: 'profileCard',
          character: 'vedat',
          label: 'MÜVEKKİL',
          lines: ['Vedat Ateş, 49', 'Matbaacı · Ateş Matbaası, Kayhan', 'Sabıkasız · adli kontrolle serbest'],
          charge: 'Resmî belgede sahtecilik (TCK 204/1)',
          demand: 'İddianame: 2–5 yıl',
        },
        {
          type: 'sentenceRange',
          segments: ['green', 'green', 'gold', 'gold', 'red', 'red', 'darkred', 'darkred'],
          markerPct: 50,
          labels: ['Beraat', '62: 1y8a', '2 yıl', '5 yıl'],
          demandLabel: 'İSTEM: 204/1',
        },
        {
          type: 'paragraph',
          title: 'OLAY ÖZETİ',
          text: '18 Şubat 2026 11.24’te Osmangazi Tapu Müdürlüğü’nde Hayriye Ateş’in (82) Hisar’daki evi, “Vedat Ateş” adına ve satış yetkisi içeren bir noter suretiyle Erol Kılınç’a 1.600.000 TL’ye satıldı. Noterin arşivindeki vekâletname, iddiaya göre, satış yetkisi içermiyor. Grafolog raporu tapudaki imzanın sanığa ait olduğunu söylüyor. Vedat Ateş o sabah matbaada olduğunu ve kimliğini bulamadığını söylüyor.',
        },
        {
          type: 'strengthList',
          title: 'SAVCILIĞIN ELİNDEKİLER',
          items: [
            { label: 'Tapu senedi: ad, kimlik, fotoğraf, imza', strength: 'STRONG' },
            { label: 'Grafolog raporu: “aynı elin ürünü”', strength: 'STRONG' },
            { label: 'Satış yetkili sahte suret', strength: 'STRONG' },
            { label: 'Kapora makbuzu (Erol Kılınç)', strength: 'MEDIUM' },
            { label: 'Sebep: 2024’te evin satılmasını istemesi', strength: 'WEAK' },
          ],
        },
        {
          type: 'choiceGroup',
          title: 'SAVUNMA STRATEJİSİ SEÇ',
          group: 'g_strateji',
          hints: {
            STR_MASUMIYET: 'Masumiyet: imzanın sanığa ait olmadığını savunursun; uyan esas savunma ×1,5 puan.',
            STR_USUL: 'Usul: raporun dayanağını çürütürsün; uyan esas savunma ×1,2 puan.',
            STR_INDIRIM: 'Terditli savunma: önce beraat, olmazsa lehe hükümler; uyan esas savunma ×0,8 puan.',
          },
        },
      ],
      choices: [
        option('STR_MASUMIYET', 'Masumiyet', {
          group: 'g_strateji',
          effects: [set('strategy', 'MASUMIYET'), set('strategy_pct', 150), ...p1.start()],
          responses: B(`
leyla: Cesur. Bir imzayı sahibinden ayırman gerekecek. Bunu yalnızca kâğıtlar yapabilir; sen de, ben de yapamayız.
leyla: Yarın sabah matbaaya git. Dükkânı gör, insanları gör. Bir imza kâğıtta atılır ama bir dükkânda büyür.
`),
          next: 'INV_SABAH',
        }),
        option('STR_USUL', 'Usul', {
          group: 'g_strateji',
          effects: [set('strategy', 'USUL'), set('strategy_pct', 120), ...p1.start()],
          responses: B(`
leyla: Raporun dayandığı kâğıtlar, raporun kendisinden zayıf olabilir. Ama yalnızca usulle gidersen hâkim “peki kim imzaladı” diye sorar.
`),
          next: 'INV_SABAH',
        }),
        option('STR_INDIRIM', 'Terditli savunma', {
          group: 'g_strateji',
          effects: [set('strategy', 'INDIRIM'), set('strategy_pct', 80), ...p1.start()],
          responses: B(`
leyla: Güvenli. Ama Vedat Bey’e “imzan değil ama ceza alabilirsin” demeye hazır mısın? İmzasını inkâr eden bir adama?
`),
          next: 'INV_SABAH',
        }),
      ],
    }),
    story('INV_SABAH', {
      ...INV,
      title: 'Ateş Matbaası, sabah',
      background: 'depo',
      onFirstEnter: [meet('tarik'), meet('emre')],
      lines: B(`
C#depo: 23 EYLÜL · 08.30 — ATEŞ MATBAASI, KAYHAN
N: Kayhan’ın dar sokağında, bir börekçiyle bir bakırcının arasında. Tabelanın harfleri elle boyanmış: ATEŞ MATBAASI · 1971.
N: İçeride kurşun dizgi makinesi tıkırdıyordu; yanında yeni bir renkli lazer yazıcı, uyuyan bir hayvan gibi homurdanıyordu.
vedat: Avukat hanım. Hoş geldiniz. Elimi sıkmayın, mürekkep. Bu makine babamdan kaldı; her sabah biraz çalıştırırım, paslanmasın diye.
vedat: Sevgi anlattı mı? Anlatmıştır. O her şeyi madde madde anlatır. Ben anlatamam. Ben kâğıda basarım, kâğıt anlatır.
N: Arka odadan biri iki ince belli bardakla çıktı. Kırklı yaşlarında, kısa sakallı, gri bir hırka. Sesini neredeyse duyulmayacak kadar alçak tutuyordu.
tarik: Avukat hanım, şekerli mi alırsınız? Tarık. Yeğeniyim. Ne lazımsa söyleyin; dosya, kâğıt, fotokopi. Ne lazımsa.
N: Kapının yanında on dokuz yaşlarında bir çocuk koli bantlıyordu; bir kulağında kulaklık, öbürü boşta. Başını kaldırıp kaldırmamak arasında kaldı.
vedat: Emre. Çırak. Öğleden sonraları gelir normalde; bugün okul tatil. Emre, avukat hanıma selam ver oğlum.
emre: Selam abla. Yani hanım. Abla.
T: Bir matbaa. Üç adam. Bir kurşun makinesi, bir lazer yazıcı. Kâğıt yalan söylemez, derler. Kâğıdı basan söyleyebilir.
N: Duvarlarda eski afişler: bir 1980 seçim bildirisi, bir düğün davetiyesi örneği, bir sirk afişi. Hepsi bu makinelerden çıkmış. Hepsi biraz sararmış.
vedat: Bakın, şu afiş. Babam bastı; ben on yaşındaydım, harfleri ben dizdim. Bir harfi ters koymuşum, kimse fark etmedi. Kırk yıldır duvarda; hâlâ ters.
T: Kırk yıl ters duran bir harf. Kimse fark etmemiş. Bu dükkânda insanlar alışkanlıklarına bakmıyor; alışkanlıkları onlara bakıyor.
vedat: Ne istiyorsanız bakın. Saklayacak bir şeyimiz yok. Bu dükkânda her şey kâğıtta; kâğıtta yoksa olmamıştır.
`),
      choices: [cont('SABAH_DEVAM', 'Soruşturmaya başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
  ],
};
