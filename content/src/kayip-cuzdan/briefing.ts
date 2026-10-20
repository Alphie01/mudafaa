import { cont, inc, meet, option, raise, set, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, S } from './dsl.js';
import { BRIEF, COLD, INV, INV_AP } from './shared.js';

const BR01_VAAT = `
Zehra gittikten sonra Leyla masamın kenarına oturdu. Paltosunu çıkarmadı.
leyla: Annelerin, ablaların gözüne bakıp söz verme. Dosyaya bakıp ver. Dosya sana yalan söylemez; sen dosyaya söylersen, o seni bırakmaz.
P: Haklısın.
leyla: Haklı olmam bir şey değiştirmez. Yarın o kadın seni “beraat sözü veren avukat” diye hatırlayacak. Ya tutarsın ya taşırsın.
`;
const BR01_NORMAL = `
Zehra gittikten sonra koridorda topuk sesleri duyuldu. Leyla paltosunu koluna almış, kapıda duruyordu. Her şeyi duymuştu; Leyla her şeyi duyar.
leyla: Kırk dakikası olan biri, otuz beşini sana ayırdı. Bu iyiye işaret.
`;
const BR01_ORTAK = `
Masaya iddianameyi bıraktı. Altını kurşun kalemle çizdiği tek bir satır vardı.
leyla: Bu dosya senin, Deniz. Baştan sona. Ben arkandayım ama önünde değilim.
> Otuz yıl ceza avukatlığı yapmış biri “arkandayım” deyince, sırtında bir el hissedersin. Bir de bir bıçak ucu.
leyla: Arda Çınar. Bursa 9. Asliye Ceza. İlk celse yirmi yedisinde. Önce şunu söyle bana: iddianamede yazan suç ne, karşılığı ne?
`;

// 40-briefing: soğuk açılış (isimsiz), Zehra büroda, Leyla'nın devri ve ceza aralığı sorusu, dosya ekranı, strateji.

export const briefing: CasePart = {
  nodes: [
    story('PROLOG', {
      ...COLD,
      title: '18.42',
      background: 'arac',
      lines: [
        {
          lines: S(`
# arac | 6 MART · CUMA 18.42 — HAT 38, HEYKEL–GÖRÜKLE
Yağmur akşamdan beri camlara yan yan vuruyordu. Otobüsün içi ıslak yün, kalorifer tozu ve yorgun insan kokuyordu.
Camlar buğulanmıştı. Biri parmağıyla bir pencere açmış, dışarıda akan sarı ışıkları seyrediyordu. Kimse kimseye bakmıyordu.
Validatör her binişte bip diye öttü. Bip. Bip. Bir şehir eve dönüyordu.
Altıparmak’tan sonra kalabalık seyreldi. Orta kapının önündeki yığın dağıldı; tutunma direkleri yeniden göründü.
Açık gri bir sweatshirt giymiş bir genç, arka kapının önünde boşalan koltuğa oturdu. Kapüşonu sırtındaydı. Kulağında beyaz bir kulaklık.
Buğulu camın yansımasında yalnızca bir siluet kalıyordu: bir omuz, bir kapüşon, öne eğilen bir baş.
Siluet eğildi. Bir süre öyle kaldı. Doğrulduğunda elinde bir şey vardı; avucunun içine sığan, koyu renk bir şey.
Bir an öyle tuttu onu. Sanki elinde canlı bir şey varmış gibi.
Genç başını kaldırdı. Önüne, arkasına baktı. Yanındaki koltukta biri telefonuna eğilmişti. Ön taraf ıslak paltolardan bir duvardı.
Tavanda, arka kapının üstünde küçük siyah bir kubbe vardı. Kubbenin içinde kırmızı bir nokta yanıyordu. [flash]
Kimse bakmıyordu. Kamera bakıyordu.
Bir fermuar sesi. Bir sırt çantası kapandı. Otobüs bir sonraki durağa doğru ağır ağır kıpırdadı.
# sokak_yagmur | 18.49 — ALTIPARMAK
Durağın kırk adım ötesinde bir tekel büfesi. Tentenin kenarından su şakır şakır akıyordu. Radyoda maç anlatıcısı bağırıyordu.
@TEZGÂHTAKİ SES: Sigara, iki şarj kablosu, bir de çakmak. Toplam yedi yüz kırk.
@BİR SES: Üçe böl.
@TEZGÂHTAKİ SES: Hı?
@BİR SES: Ayrı ayrı çek. Üç kere.
Islak bir eldiven tezgâha bir kart koydu. Eldivenin parmak uçlarından cama damlalar düştü.
@TEZGÂHTAKİ SES: Zengin misin, üç ayrı çekiyorsun? Şifreyle tek seferde geçsin işte.
@BİR SES: Şifremi unuttum.
Bip. Bip. Bip. Cihaz her seferinde onay verdi. Kimse kartın üstündeki ada bakmadı.
Eldiven poşeti aldı, yağmura çıktı. Radyoda bir gol oldu; tezgâhtaki ses sevinmedi bile.
# sokak_sabah | 7 MART · CUMARTESİ 08.15 — GÖRÜKLE, BİR ÖĞRENCİ EVİ
Kapı üç kez, sertçe vuruldu. [shake]
Uykulu bir ev arkadaşı kapıyı araladı. Karşısında iki polis memuru vardı. Yağmurluklarından damlayan su paspasa iz yapıyordu.
@POLİS: Arda Çınar burada mı oturuyor?
Koridorun sonundaki odadan gri sweatshirtli genç çıktı. Saçları dağınıktı. Bir elinde diş fırçası vardı.
@POLİS: Çantanı alıp gelir misin? Bir de şu çantaya bakalım, sakıncası yoksa.
Sırt çantasının fermuarı açıldı. Kahverengi cüzdan bir kitabın yanında duruyordu. Memur onu iki parmağıyla, kirli bir şeyi tutar gibi kaldırdı.
@GENÇ: Ben onu buldum. Otobüste. Bugün teslim edecektim. Dokuzda… karakola gidecektim.
@POLİS: Hepsi öyle der.
Masanın kenarında, rüzgârla kıpırdayan sarı bir kâğıt vardı. Memur onu da aldı, bir poşete attı. Okumadı. [fade]
`),
        },
      ],
      choices: [cont('PR_DEVAM', 'Yedi ay sonra', 'BR_00', { role: 'PRIMARY' })],
    }),

    story('BR_00', {
      ...BRIEF,
      title: 'Zehra',
      background: 'buro_gece',
      onFirstEnter: [meet('deniz'), meet('zehra')],
      lines: B(`
# buro_gece | 13 EKİM · PAZARTESİ 21.10 — ARSLAN HUKUK, BURSA
> Bursa’da kayıp eşya iki yere gider: ya sahibine ya dosyaya.
Büro boşalmıştı. Koridorun ışığı yanık kalmıştı; kahve makinesi soğumuş, yağmur camı kendi diliyle dövüyordu.
> İkinci yılım. Leyla bugüne kadar bana dosyaların ortasını verdi: bir dilekçe, bir duruşma, bir itiraz. Baştan sona bir dosya, hiç.
Kapı çalındı. Çekinmeden, hızlı, iki kere. Saatine bakan birinin vuruşu.
Otuzuna yaklaşmış bir kadın girdi. Lacivert hemşire forması, üstünde ıslak bir yağmurluk. Elinde şeffaf bir dosya poşeti.
zehra: İyi akşamlar. Deniz Arslan siz misiniz? Leyla Hanım’la telefonda konuşmuştuk. Vardiya arasındayım, kırk dakikam var.
P: Buyurun, oturun. Çay?
zehra: Çay içersem uyurum, uyursam vardiya kaçar. Sağ olun. Zehra Çınar. Kardeşim Arda için geldim.
Poşeti masaya bıraktı. İddianame, birkaç tutanak fotokopisi ve bir fotoğraf. Fotoğrafta zayıf, gözlüklü bir genç, kucağında bir koli kitap.
zehra: Yedi ay önce otobüste bir cüzdan bulmuş. Boş bir cüzdan. Ertesi sabah polis kapıya dayandı. Şimdi hırsızlıktan yargılanıyor.
zehra: İlk avukatımızı baro atamıştı, ifadede. İyi biriydi. Sonra kayboldu. Telefonlara bakmıyor. Duruşmaya iki hafta kaldı.
> İki hafta. Leyla’nın “işte senin dosyan” diyeceği türden bir takvim.
P: Arda o akşamı size nasıl anlattı?
zehra: Koltuğun altında bulmuş. Açmış, içinde kimlik varmış, para yokmuş. Sahibini aramış, bulamamış. Sabah karakola gidecekmiş.
zehra: Ben ona inanıyorum avukat hanım. Kardeşim olduğu için değil. O çocuk sokakta para bulsa muhtara götürür. Muhtar yoksa camiye.
zehra.kizgin: Cami kapalıysa sabaha kadar kapıda bekler. Öyle biri. Bazen sinir oluyorum ona, bu kadar dürüst olunmaz diye.
zehra: Babamız Arda on iki yaşındayken öldü. Ben İzmir’e okumaya gittim, o annemle kaldı. Kışın sobayı o yakardı, sabah annem kalkmadan.
zehra: Üniversiteyi kazandığında köyde lokum dağıttık. Annem herkese “öğretmen olacak” dedi. Hâlâ öyle diyor. Telefonda, her akşam.
zehra: Öğretmen olacak. Son sınıf. Hırsızlıktan mahkûm olursa atanamaz, biliyor musunuz?
> Biliyordum. Bazı cezalar hapishanede değil, bir başvuru formunun “adli sicil” kutusunda çekilir.
zehra.uzgun: Annemize söylemedim. Kars’ta, tek başına. Duyarsa… Ben iki gece fazla mesai yazdırdım. Ücretiniz ne kadarsa, taksitle…
Cümlesini bitirmedi. Formanın cebinden bir zarf çıkardı, masaya koydu ama elini üstünden çekmedi.
> Zarfın içinde iki gece nöbet vardı. Ve benden bir cümle bekleniyordu.
`),
      choices: [
        option('BR00_A', '“Ücreti sonra konuşuruz. Önce dosyayı okuyayım.”', {
          effects: [inc('trust', 6), raise('zehra_yakin')],
          responses: B(`
P: Zarfı kaldırın Zehra Hanım. Ücreti sonra konuşuruz. Önce dosyayı okuyayım, Arda’yla görüşeyim.
zehra.uzgun: Siz… Tamam. Peki.
Zarfı geri cebine koydu. Elleri bir an ne yapacağını bilemedi; sonra poşetin kenarını düzeltti.
zehra: Arda size “hocam” der, şaşırmayın. Herkese der. Bakkala bile.
`),
          next: 'BR_01',
        }),
        option('BR00_B', '“Söz veremem. Ama her sayfayı okuyacağım.”', {
          effects: [raise('deniz_durust')],
          responses: B(`
P: Size bir şey söz veremem Zehra Hanım. Sonucu bilmiyorum. Ama bu dosyanın her sayfasını okuyacağım. Okunmamış sayfa kalmayacak.
zehra: İlk avukat da “bakarız” demişti.
P: “Bakarız” demiyorum. “Okuyacağım” diyorum.
Zehra bir süre yüzüme baktı. Hemşireler yalanı tansiyon aletinden önce görür.
zehra: Tamam. Bu daha iyi.
`),
          next: 'BR_01',
        }),
        option('BR00_C', '“Merak etmeyin, bu dosyadan beraat çıkar.”', {
          bad: 'Dosyayı okumadan sonuç vaat etmek meslek kurallarına aykırıdır; avukat, iş sahibine gerçeğe aykırı bir başarı güvencesi veremez.',
          category: 'SAVUNMA_STRATEJISI',
          effects: [raise('vaat_verdi')],
          responses: B(`
P: Merak etmeyin. Boş bir cüzdandan hırsızlık çıkmaz. Bu dosyadan beraat çıkar.
zehra: Gerçekten mi?
Zehra’nın yüzü bir anda gevşedi. Gözleri doldu. Ben de bir an kendimi iyi hissettim. Sonra arkamdan bir ses geldi.
leyla: Deniz. Dosyayı okudun mu?
Leyla kapıda duruyordu. Paltosu kolunda, yüzünde hiçbir şey yoktu. Hiçbir şey olmaması en kötüsüydü.
`),
          next: 'BR_01',
        }),
      ],
    }),

    story('BR_01', {
      ...BRIEF,
      title: 'Leyla',
      background: 'buro_gece',
      onFirstEnter: [meet('leyla')],
      lines: [
        { when: { flag: 'vaat_verdi' }, lines: S(BR01_VAAT + BR01_ORTAK) },
        { lines: S(BR01_NORMAL + BR01_ORTAK) },
      ],
      choices: [
        option('BR01_A', 'Basit hırsızlık (TCK 141/1): bir yıldan üç yıla kadar hapis', {
          score: { HUKUKI_BILGI: 50 },
          good: 'Doğru. İddianame TCK 141/1’e dayanıyor: zilyedin rızası olmadan başkasına ait taşınır malı yarar sağlamak maksadıyla bulunduğu yerden almak; bir yıldan üç yıla kadar hapis.',
          responses: B(`
P: Basit hırsızlık. Yüz kırk bir, birinci fıkra. Bir yıldan üç yıla kadar hapis.
leyla.mutlu: Doğru. Ama savcı bu sınırda durmayabilir.
leyla: Toplu taşımada bulunan eşya, kalabalıkta çantadan alınan cüzdan… Duruşmada biri “özel beceri” derse, beş yıldan başlarız.
leyla: Bizim yönümüz öbür taraf. Kaybolmuş eşya üzerinde tasarruf, yüz altmış: bir yıla kadar, şikâyete bağlı. Ya da hiçbiri.
`),
          next: 'BR_01B',
        }),
        option('BR01_B', 'Toplu taşımada nitelikli hırsızlık (TCK 142/1-c): üç yıldan yedi yıla', {
          bad: 'İddianame TCK 141/1’e dayanıyor. 142/1-c (halkın yararlanmasına sunulmuş ulaşım aracında bulunan eşya) savcının ileride isteyebileceği bir nitelendirmedir; şu an dava 141/1 üzerinden açılmıştır.',
          category: 'HUKUKI_BILGI',
          responses: B(`
P: Toplu taşımada hırsızlık. Yüz kırk iki, birinci fıkra (c). Üçten yediye.
leyla: Savcı keşke senin kadar hevesli olmasaydı. Hayır. İddianameye bak: yüz kırk bir. Basit hırsızlık, bir yıldan üç yıla.
leyla: Ama aklında tutman iyi. O kapı aralık duruyor. Biri iterse açılır.
`),
          next: 'BR_01B',
        }),
        option('BR01_C', 'Kaybolmuş eşya üzerinde tasarruf (TCK 160): bir yıla kadar', {
          bad: 'TCK 160 savunmanın varmak isteyebileceği nitelendirmedir; iddianame ise TCK 141/1 (bir yıldan üç yıla kadar hapis) ile açılmıştır. Dosyayı savunma gözlüğüyle değil, önce iddianamenin kendi diliyle okumak gerekir.',
          category: 'HUKUKI_BILGI',
          responses: B(`
P: Kaybolmuş eşya. Yüz altmış. Bir yıla kadar.
leyla: Bu bizim dileğimiz, onların iddiası değil. Önce düşmanın haritasını oku, sonra kendininkini çiz.
leyla: İddianame yüz kırk bir diyor. Bir yıldan üç yıla. Yüz altmışa ancak biz götürürsek varırız.
`),
          next: 'BR_01B',
        }),
        option('BR01_D', 'Banka kartını kötüye kullanma (TCK 245/1): üç yıldan altı yıla', {
          bad: 'Kartların kullanımı iddianamede sanığa yüklenmemiştir; faili belirlenemediği için ayrı soruşturma yürütülmektedir. Dava TCK 141/1 üzerinden açılmıştır.',
          category: 'HUKUKI_BILGI',
          responses: B(`
P: Kartlarla harcama yapılmış. Kart kötüye kullanımı, iki yüz kırk beş.
leyla: Kartları onun kullandığını kim söylüyor?
P: Şey… iddianame?
leyla: İddianame “kartlarla yapılan harcamalar yönünden faili belirlenemediğinden ayrı soruşturma” diyor. Oku. Dava yüz kırk birden açılmış.
leyla: Bu cümleyi unutma. Savcılığın kendi dosyasında, kartları kullananın bilinmediği yazıyor.
`),
          next: 'BR_01B',
        }),
      ],
    }),

    story('BR_01B', {
      ...BRIEF,
      title: 'İki buçuk dakika',
      background: 'buro_gece',
      lines: B(`
Leyla çayını yarısına kadar içti, gerisini bıraktı. Otuz yıldır hiçbir çayı bitirmediğini söylerler.
leyla: Savcılığın elinde ne var, biliyor musun? İki buçuk dakikalık bir CD. Bir çocuğun bir cüzdanı alıp çantasına koyduğu iki buçuk dakika.
leyla: Bir de bir tanık. Bir de çantada bulunan bir cüzdan. Hepsi bu. Ama bir hâkim için bazen bu kadarı yeter.
P: CD neyi göstermiyor?
leyla.mutlu: İşte doğru soru.
leyla: Bir kayıt, gösterdiği şey kadar göstermediği şeyle de konuşur. Kim çekmiş, ne kadarını vermiş, öncesi nerede, sonrası nerede?
leyla: Kaydın öncesine, sonrasına ve köşedeki rakamlara bak. Ne gösterdiğini değil, neyi göstermediğini say. Bir dosya bazen bir dipnotta saklanır.
leyla: Bir de kartlar var. Biri o akşam bir yaşlı kadının kartlarıyla alışveriş yapmış. Dosya “faili belirlenemedi” diyor. Belirlenemeyen bir fail, belirlenmiş bir sanıktan daha hafif değildir.
Ayağa kalktı. Kapıda durdu, dönmeden konuştu.
leyla: Bir de… çocuğa “neden polise gitmedin” diye sorduğunda cevabı hemen gelmezse, bekle. Bazı cevaplar utançla gelir.
> Kapı kapandı. Yağmur sesi büroyu yeniden doldurdu. Masada bir dosya, bir fotoğraf ve iki hafta vardı.
`),
      choices: [cont('BR01B_DEVAM', 'Dosyayı aç', 'BR_02', { role: 'PRIMARY' })],
    }),

    story('BR_02', {
      ...BRIEF,
      phase: 'BRIEFING',
      title: 'Kayıp Cüzdan',
      background: 'buro_gece',
      onFirstEnter: [meet('arda')],
      blocks: [
        {
          type: 'profileCard',
          character: 'arda',
          label: 'MÜVEKKİL',
          lines: ['Arda Çınar, 22', 'Sınıf öğretmenliği son sınıf · sahafta yarı zamanlı · sabıkasız'],
          charge: 'Hırsızlık (TCK 141/1)',
          demand: 'İddianame: TCK 141/1 · Bursa 9. Asliye Ceza',
        },
        {
          type: 'sentenceRange',
          segments: ['green', 'green', 'gold', 'gold', 'red', 'red', 'darkred', 'darkred'],
          markerPct: 50,
          labels: ['Beraat', 'TCK 160: ≤1 yıl', '141/1: 1–3 yıl', '142/2-b: 5–10 yıl'],
          demandLabel: 'İSTEM: TCK 141/1',
        },
        {
          type: 'paragraph',
          title: 'OLAY ÖZETİ',
          text: '6 Mart 18.31–18.46 arasında Hat 38’de Gülten Sarı’nın (67) cüzdanı çalındı; kartlarıyla 18.49–19.06 arasında 2.940 TL harcandı. CD kaydında sanık 18.42’de bir cüzdanı alıp çantasına koyuyor. Cüzdan ertesi sabah sanığın evinde bulundu. Sanık: “Buldum, teslim edecektim.”',
        },
        {
          type: 'strengthList',
          title: 'SAVCILIĞIN ELİNDEKİLER',
          items: [
            { label: 'CD kaydı (2,5 dk, tek kamera)', strength: 'STRONG' },
            { label: 'Cüzdanın sanığın çantasında bulunması', strength: 'STRONG' },
            { label: 'Tanık Hayri Doğan: “kadının arkasındaydı”', strength: 'MEDIUM' },
            { label: 'Çantada zarf içinde 600 TL', strength: 'MEDIUM' },
            { label: 'Şoför: “kimse bir şey getirmedi”', strength: 'WEAK' },
          ],
        },
        {
          type: 'choiceGroup',
          title: 'SAVUNMA STRATEJİSİ SEÇ',
          group: 'g_strateji',
          hints: {
            STR_MASUMIYET:
              'Masumiyet: suçun başkalarınca işlendiğini göstermeyi hedefler; stratejine uyan esas savunma ×1,5 puan.',
            STR_USUL: 'Delil bütünlüğü: eksik kaydın ve zayıf teşhisin üstüne gidersin; uyan esas savunma ×1,2 puan.',
            STR_INDIRIM: 'Terditli: önce beraat, olmazsa TCK 160 ve lehe hükümler; uyan esas savunma ×0,8 puan.',
          },
        },
      ],
      choices: [
        option('STR_MASUMIYET', 'Masumiyet', {
          group: 'g_strateji',
          effects: [set('strategy', 'MASUMIYET'), set('strategy_pct', 150)],
          next: 'INV_SABAH',
        }),
        option('STR_USUL', 'Delil bütünlüğü', {
          group: 'g_strateji',
          effects: [set('strategy', 'USUL'), set('strategy_pct', 120)],
          next: 'INV_SABAH',
        }),
        option('STR_INDIRIM', 'Terditli savunma', {
          group: 'g_strateji',
          effects: [set('strategy', 'INDIRIM'), set('strategy_pct', 80)],
          next: 'INV_SABAH',
        }),
      ],
    }),

    story('INV_SABAH', {
      ...INV,
      title: 'Çarşı',
      background: 'sokak_yagmur',
      onFirstEnter: [set('day', 1), set('ap', INV_AP)],
      lines: B(`
# sokak_yagmur | 14 EKİM · SALI 08.30 — ÇARŞI, BURSA
Kapalıçarşı’nın arkasındaki ara sokakta taşlar kaygandı. Esnaf kepenk açıyor, çaycı tepsiyle koşuyordu.
> Gece dosyayı üç kez okudum. İddianame dört sayfa. CD’nin görüntü dökümü yarım sayfa. Bir çocuğun hayatı, toplam on bir sayfa.
> Savcılığın hikâyesi şöyle: kalabalıkta kadının arkasında durdu, cüzdanı aldı, kartları birine verdi, boş cüzdanı “buldum” demek için sakladı.
> Arda’nın hikâyesi şöyle: buldum, teslim edecektim. Bir cümle. Benim işim o cümlenin arkasına bir dünya kurmak. Ya da kuramadığımı kabul etmek.
Sokağın sonunda, iki han arasında dar bir dükkân: “ESKİ SAYFA — SAHAF”. Vitrinde solmuş Türk klasikleri, bir daktilo, uyuyan bir kedi.
> Üç günüm var. Her gün dört iş sığar. Hepsini yapamam. Neye bakacağımı seçmek, bakmanın kendisi kadar önemli.
> Leyla’nın masasındaki not aklımda: önce müvekkil, sonra kâğıt, sonra yer. Ama bazen yer, kâğıdın söylemediğini söyler.
Sahafın kedisi gözünü açtı, bana baktı, kapattı. Bursa’da kediler avukatlardan daha az şaşırır.
`),
      choices: [cont('SABAH_DEVAM', 'Soruşturmaya başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
  ],
};
