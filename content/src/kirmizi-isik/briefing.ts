import {
  L,
  N,
  P,
  cont,
  dec,
  inc,
  meet,
  option,
  raise,
  says,
  set,
  story,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { BRIEF, INV, PRO, T, V, bg, card, fx, p1 } from './shared.js';

// 40-briefing: soğuk açılış (isimsiz sesler), olay gecesinin sonu, Gül büroda, Leyla'nın dosya devri, kâğıtlar, dosya
// ekranı + strateji ve kavşak sabahı.

export const briefing: CasePart = {
  nodes: [
    story('PR_00', {
      ...PRO,
      title: 'Gece 01.09',
      background: 'arac',
      lines: says(
        card('14 KASIM · GECE 01.09 — GÖKDERE BULVARI, BURSA', 'arac'),
        N(
          'Silecekler her geçişte camı temizliyor, yağmur her seferinde geri geliyordu. Isıtıcı toz ve ıslak yün kokuyordu. Radyo kapalıydı.',
        ),
        N(
          'Gösterge panelinin mavi ışığında bir adamın elleri. Direksiyonu saat on ikiden tutuyordu, iki eliyle, sürücü kursunda öğretildiği gibi.',
        ),
        V('TELEFONDAKİ SES', 'Yine mi son vardiya? Saat bir oldu.', 'phone'),
        V('SÜRÜCÜ', 'Ustabaşı gelmedi. Makine durdu. Ne yapayım, bırakıp mı geleyim?'),
        V('TELEFONDAKİ SES', 'Yarın doktor var. Saat dokuzda. Unuttun değil mi?', 'phone'),
        V('SÜRÜCÜ', 'Unutmadım.'),
        V('TELEFONDAKİ SES', 'Unuttun. Bebek bütün akşam tekmeledi. Sen yoktun. Kira da…', 'phone'),
        V('SÜRÜCÜ', 'Kirayı biliyorum. Biliyorum. Lütfen şimdi değil.'),
        N('Bir sessizlik. Hoparlörden onun nefesi geliyordu, bir de mutfakta açık kalmış bir musluğun sesi.'),
        V('TELEFONDAKİ SES', 'Dikkatli gel. Yollar kaygan.', 'phone'),
        V('SÜRÜCÜ', 'Tamam. Kapat artık, geliyorum.'),
        N(
          'Parmağı ekrandaki kırmızı ahizeye dokundu. Ekran karardı. Önünde, iki yüz metre ileride, kavşağın ışığı yeşil yanıyordu.',
        ),
        N('Gökdere’nin bu saatte boş olduğu söylenir. Boş değildir. Sadece kimse kimseyi görmez.'),
        N(
          'Islak asfaltta sodyum lambalarının turuncusu, bir de yeşilin titreyen yansıması. Yaya geçidinin beyaz çizgileri. Yağmur onları siliyordu.',
        ),
        N(
          'Farların ucunda koyu bir şey. Bir poşet mi, bir gölge mi. Yerde mi, değil mi. Göz bunu söyleyemeden ayak frene gitti.',
        ),
        fx(
          N('Pedal titredi. Lastikler çığlık atmadı; tıkırdadı. Sonra sol önde bir tümsek. Yumuşak, kısa, korkunç.'),
          'shake',
        ),
        N(
          'Araba durdu. Silecekler çalışmaya devam etti. Sürücü bir an kıpırdamadı. Sonra kapıyı açtı ve yağmura çıktı.',
        ),
        bg(
          N(
            'Asfaltta bir kadın yatıyordu. Bir ayakkabısı iki metre ötedeydi. Yanında bir naylon poşet; içinde iki simit.',
          ),
          'sokak_yagmur',
        ),
        V('SÜRÜCÜ', 'Hanımefendi… Hanımefendi, duyuyor musunuz?'),
        N(
          'Duymuyordu. Sürücü montunu çıkarıp kadının üstüne örttü. Elleri o kadar titriyordu ki telefonun kilidini üç kere açamadı.',
        ),
        V('SÜRÜCÜ', 'Alo. Bir kadın… bir kadına çarptım. Gökdere kavşağı. Lütfen. Lütfen çabuk.', 'phone'),
        N('Kavşağın ışığı hâlâ yeşil yanıyordu. Kimse bakmıyordu.'),
        fx(
          N('Yeşil yanıyordu. Yeşil yanıyordu. Bunu sonra çok kez söyleyecekti; her seferinde biraz daha az inanarak.'),
          'fade',
        ),
      ),
      choices: [cont('PR00_DEVAM', 'Devam', 'PR_01', { role: 'PRIMARY' })],
    }),
    story('PR_01', {
      ...PRO,
      title: 'Gece 01.24',
      background: 'sokak_yagmur',
      lines: says(
        card('GECE 01.24 — GÖKDERE KAVŞAĞI', 'sokak_yagmur'),
        N(
          'Mavi ışıklar binaların camlarında döndü. Ambulansın kapısı açıldı, kapandı. Biri “nabız yok” dedi, kimse cevap vermedi.',
        ),
        V('BİR POLİS', 'Herkes kaldırıma. Kimse bir şeye dokunmasın. Metreyi verin.'),
        N(
          'Genç bir kadın polis şeridi çekti, yere diz çöktü, ölçtü, yazdı. Bir şeyin fotoğrafını çekti; flaş ıslak asfaltta patladı.',
        ),
        fx(V('BİR ADAM', 'Kırmızıda geçti! Gözümle gördüm! Kırk yıllık şoförüm ben, kırmızıda daldı bu!'), 'flash'),
        N(
          'Adam taksisinin kapısını açık bırakmıştı. Dörtlüleri yanıp sönüyordu. Elinde bir termos, ağzında sönmüş bir sigara.',
        ),
        V('BİR POLİS', 'Beyefendi, ifadenizi alacağız. Lütfen bağırmayın.'),
        V('BİR ADAM', 'Bağırırım! Kadıncağız yerde! Telefonla konuşuyordu bu, ben gördüm!'),
        N(
          'Sürücü kaldırımın kenarında oturuyordu. Montu yoktu. Ellerine bakıyordu, sanki ellerinin ne yaptığını onlardan öğrenecekmiş gibi.',
        ),
        V('BİR POLİS', 'Üfleyin. … Sıfır. Kimliğiniz?'),
        V('SÜRÜCÜ', 'Yeşildi. Ben… yeşildi. Bir şey gördüm, bastım. Hissettim. Tekerleğin altında… hissettim.'),
        card('TRAFİK ŞUBE · 04.40', 'karakol'),
        N('Baro bir avukat gönderdi. Uykulu, iyi niyetli, aceleci. İfade bir buçuk sayfa sürdü.'),
        V(
          'SÜRÜCÜ',
          'Yeşil yanıyordu. Yemin ederim. Ama… çarptım. Durdum. Ambulans çağırdım. Kaçmadım. Başka ne diyebilirim?',
        ),
        N(
          'Sabah sulh ceza hâkimliği: yurt dışına çıkış yasağı, haftada bir imza, araç kullanmama. Tutuklama yok. Hapis değil; sadece her şey.',
        ),
        N('Hatice Durmaz hastaneye vardığında ölmüştü. Elli dört yaşındaydı. Otuz yıl aynı yolu yürümüştü.'),
        N(
          'Ertesi sabah bir gazetenin üçüncü sayfasında iki satır: “Gökdere’de yaya kazası: 54 yaşındaki kadın hayatını kaybetti, sürücü gözaltında.”',
        ),
      ),
      choices: [cont('PR01_DEVAM', 'Devam', 'PR_02', { role: 'PRIMARY' })],
    }),
    story('PR_02', {
      ...PRO,
      title: 'Gece 02.10',
      background: 'ev',
      lines: says(
        card('GECE 02.10 — YILDIRIM, ÜÇÜNCÜ KAT', 'ev'),
        N(
          'Mutfakta bir musluk damlıyordu. Masada iki tabak, biri kullanılmamış. Ocağın üstünde soğumuş bir tencere mercimek.',
        ),
        N(
          'Bir kadın pencerenin önündeydi, bir eli karnında, öbür eli telefonda. Ekranda son arama: 01.09. Süre: 02.30.',
        ),
        V('BİR KADIN', 'Gelmedi. Yirmi dakikalık yol. Bir saat oldu.'),
        N('Dört kez aradı. Dört kez telefon çaldı, kimse açmadı. Beşincide biri açtı. Bir erkek sesi, resmî, yorgun.'),
        V('TELEFONDAKİ SES', 'Hanımefendi, eşiniz trafik şubede. Yaralı değil. Bir kaza oldu. Bir yaya…', 'phone'),
        V('BİR KADIN', 'Yaya mı? Ne demek yaya? O… o çok dikkatli sürer. Çok.'),
        V('TELEFONDAKİ SES', 'Sabah gelirseniz bilgi verilir. İyi geceler.', 'phone'),
        N(
          'Kadın telefonu masaya bıraktı. Sonra mutfağa gitti, tencerenin kapağını kapattı, musluğu sıktı. Damlama durmadı.',
        ),
        N('Pencereye döndü. Aşağıda sokak boştu. Yağmur, sokak lambasının ışığında eğik çizgiler çiziyordu.'),
        V('BİR KADIN', 'Konuşurken… ben konuşturdum onu. Kirayı açtım. Ben…'),
        N('Cümleyi bitirmedi. Bebek tekmeledi. Kadın iki elini karnına koydu ve sabaha kadar öyle oturdu.'),
        fx(N('Üç ay sonra, ilk celsenin ertesi akşamı, aynı kadın bir avukatlık bürosunun kapısını çaldı.'), 'fade'),
      ),
      choices: [cont('PR02_DEVAM', 'Devam', 'BR_00', { role: 'PRIMARY' })],
    }),
    story('BR_00', {
      ...BRIEF,
      title: 'Gül Hanım',
      background: 'buro_gece',
      onFirstEnter: [meet('deniz'), meet('gul'), meet('volkan')],
      lines: says(
        card('PERŞEMBE 21.50 — ARSLAN HUKUK, BURSA', 'buro_gece'),
        T('Kasımda Bursa erken kararır. Bazı dosyalar da öyle. Bu dosya şubat ortasında hâlâ kasımdaydı.'),
        N(
          'Kapı açıldığında yağmur da içeri girdi. Kadın şemsiyesini kapatmadan önce karnını tuttu, sonra içeri adım attı.',
        ),
        N('Kucağında dört renkli klasör vardı: kırmızı, mavi, yeşil, sarı. Hepsinin sırtında el yazısıyla etiketler.'),
        L('gul', 'Kusura bakmayın, randevusuz geldim. Telefonda “mesai bitti” dediler. Benim mesaim bitmiyor artık.'),
        P('Buyurun, oturun lütfen. Su ister misiniz?'),
        L('gul', 'Çay olursa. Hamileyken su içemiyorum, midem bulanıyor. Sekiz ay. Kız.'),
        N('Klasörleri masaya dizdi. Kırmızısını öne itti. “İddianame” yazıyordu sırtında.'),
        L(
          'gul',
          'Ben Gül Eren. Kocam Volkan Eren. Kasımda Gökdere’de bir kadına çarptı. Kadın öldü. Adı Hatice Durmaz.',
        ),
        L('gul', 'Kocam birini öldürdüğünü düşünüyor avukat hanım. Ben düşünmüyorum. Fark bu.'),
        P('Neden düşünmüyorsunuz?'),
        L(
          'gul',
          'Çünkü o gece telefondaydık. Ben konuşuyordum, o dinliyordu. “Yeşil” dedi. Sonra kapattı. Volkan yalan söyleyemez. Denedi, beceremedi.',
        ),
        L(
          'gul',
          'Dün ilk celseydi. Baronun verdiği avukat “kabul edin, indirim alırız” dedi koridorda. Volkan da kabul etmek istiyor.',
        ),
        L(
          'gul',
          'Volkan sorguda tek cümle kurabildi: “Yeşildi ama çarptım.” Hâkim bey savunmasını tamamlaması için iki hafta verdi. Bilirkişi raporu okundu: kırmızıda geçmiş, yüzde yüz kusurluymuş.',
        ),
        N(
          'Mavi klasörden bir zarf çıktı. Zarfın içinden bir ultrason fotoğrafı kaydı, masaya düştü. Gül onu hızla geri aldı.',
        ),
        L('gul', 'Pardon. Her şeyi aynı yere koyuyorum artık. Hayatım tek bir klasör oldu.'),
        T('Siyah beyaz bir kıvrım. Bir kafa, bir el. Henüz doğmamış biri de bu dosyanın tarafıydı.'),
        L(
          'gul',
          'Volkan kendini cezalandırmak istiyor. Bunu anlıyorum. Ama bebeğin babası bir yalan için içeri girerse, ben bunu anlamam.',
        ),
      ),
      choices: [
        option('BR00_A', 'Önce Volkan Bey’i dinlemem gerek. Kabul edip etmemek onun kararı; ama bilerek vermeli.', {
          effects: [inc('trust', 6), raise('gul_dinle')],
          neutral: 'Karar müvekkilindir; avukat onu bilgilendirir, yerine karar vermez.',
          responses: says(
            L('gul', 'Bilerek. Evet. Şu an hiçbir şey bilmiyor; sadece hissediyor.'),
            L('gul', 'Yarın evdeyiz. Araba kullanamıyor, nereye gidecek. Gelin. Ben çay koyarım, o susar.'),
            T('“Bilerek.” Gül bu kelimeye bir can simidi gibi tutundu. Ben de.'),
          ),
          next: 'BR_00B',
        }),
        option('BR00_B', 'Ücreti ve vekâletnameyi konuşalım; sonra dosyaya bakarım.', {
          responses: says(
            L('gul', 'Tabii. Öğretmen maaşı. Taksit olursa…'),
            N('Bir zarf çıkardı. İçinde düzgünce sayılmış banknotlar, üstünde bir not: “Bebek arabası”.'),
            L('gul', 'Bebek arabası beklesin. Kızım yürüyene kadar taşırım.'),
          ),
          next: 'BR_00B',
        }),
        option('BR00_C', 'Kabul etmesi bazen en güvenlisidir. Ceza indirimi küçük bir şey değil.', {
          effects: [dec('trust', 8), raise('gul_kirgin')],
          bad: 'Dosyayı okumadan teslimiyet önermek: savunma, delil görülmeden kararlaştırılmaz.',
          category: 'SAVUNMA_STRATEJISI',
          responses: says(
            L('gul', 'Siz de mi?', 'kizgin'),
            N('Klasörleri toplamaya başladı. Sonra durdu. Kırmızı klasör elinde kaldı.'),
            L('gul', 'Okuyun. Okuyun, sonra söyleyin. Bunu hak ediyoruz.', 'kizgin'),
          ),
          next: 'BR_00B',
        }),
      ],
    }),
    story('BR_00B', {
      ...BRIEF,
      title: 'Kapıda',
      background: 'buro_gece',
      lines: says(
        N(
          'Gül gittiğinde masada dört klasör ve soğumuş bir çay kaldı. Kapıda Leyla duruyordu. Ne zamandan beri orada olduğunu bilmiyordum.',
        ),
        L('leyla', 'Hamile kadın, yağmur, kocası kendini suçluyor. Dosya seni ağlatmadan önce sen dosyayı oku.'),
        P('Kocası birini öldürdüğünü düşünüyormuş. O öyle düşünmüyormuş.'),
        L(
          'leyla',
          'Suçluluk duygusu delil değildir, Deniz. Ama hâkim bazen onu delil gibi okur. Müvekkilin kürsüde “hissettim” derse, o tek kelime üç raporu yener.',
        ),
        L('leyla', 'Otur. Kırmızı klasörü aç.'),
      ),
      choices: [cont('BR00B_DEVAM', 'Kırmızı klasörü aç', 'BR_01', { role: 'PRIMARY' })],
    }),
    story('BR_01', {
      ...BRIEF,
      title: 'Dosya devri',
      background: 'buro_gece',
      onFirstEnter: [meet('leyla')],
      lines: says(
        N(
          'Leyla’nın masasında her zamanki düzen: bir dolma kalem, açılmamış bir sigara paketi, ters çevrilmiş bir çerçeve. Hiç sormadım.',
        ),
        L(
          'leyla',
          'İddianame Bursa 7. Asliye Ceza’da. Taksirle öldürme; savcılık bilinçli taksir diyor. Kırmızı ışık, hız, telefon.',
        ),
        L('leyla', 'Dosyayı açmadan önce şunu bil: neyle karşı karşıyayız? Ceza aralığını söyle bana.'),
      ),
      choices: [
        option('BR01_A', 'TCK 85/1: iki ila altı yıl; bilinçli taksirle üçte birden yarıya kadar artar.', {
          score: { HUKUKI_BILGI: 100 },
          effects: [inc('legal_hits')],
          good: 'Doğru. TCK 85/1 iki–altı yıl; TCK 22/3 bilinçli taksirde cezayı üçte birden yarısına kadar artırır (2 yıl 8 ay–9 yıl). Üst sınır 9 yıl olduğundan dava asliye cezadadır.',
          responses: says(
            L('leyla', 'Doğru. En kötü ihtimalle dokuz yıl. En iyi ihtimalle… o en iyiyi biz kuracağız.', 'mutlu'),
            L(
              'leyla',
              'Bir şey daha: bilinçli taksir düşerse kapı aralanır. Taksirli suçta hapis, uzun da olsa paraya çevrilebilir. Bilinçli taksirde çevrilemez (TCK 50/4).',
            ),
            L('leyla', 'Yani “bilinçli” kelimesi bu dosyada bir hücre ile bir fatura arasındaki fark.'),
            T(
              'Bir hücre ile bir fatura. Leyla hukuku hep böyle anlatır: ağır kelimeleri hafif nesnelere bağlayarak. Unutmamak için.',
            ),
          ),
          next: 'BR_01B',
        }),
        option('BR01_B', 'TCK 85/2: iki ila on beş yıl.', {
          bad: 'TCK 85/2 birden fazla kişinin ölümü ya da ölümle birlikte yaralanma hâlidir. Burada tek ölüm var: TCK 85/1, artı TCK 22/3.',
          category: 'HUKUKI_BILGI',
          responses: says(
            L(
              'leyla',
              'Hayır. İkinci fıkra birden çok ölüm ya da ölümle birlikte yaralanma ister. Bir kadın öldü. Bir.',
            ),
            L(
              'leyla',
              'Birinci fıkra: iki–altı yıl. Bilinçli taksir üçte birden yarıya kadar artırır. Rakamları ezbere bil; hâkim ezbere bilir.',
            ),
          ),
          next: 'BR_01B',
        }),
        option('BR01_C', 'Olası kastla öldürme (TCK 81, 21/2): ağır cezalık bir suç.', {
          bad: 'Olası kast, neticeyi öngörüp “olursa olsun” diye kabullenmektir (TCK 21/2). İddianame bunu değil, bilinçli taksiri (TCK 22/3) iddia ediyor: netice öngörülmüş ama istenmemiş.',
          category: 'HUKUKI_BILGI',
          responses: says(
            L(
              'leyla',
              'Savcı da öyle demiyor, sen hiç deme. Olası kast “olursa olsun”dur. Bilinçli taksir “olmaz, bir şey olmaz”dır.',
            ),
            L('leyla', 'İddianame: TCK 85/1 ve 22/3. İki–altı yıl, üçte birden yarıya kadar artış.'),
          ),
          next: 'BR_01B',
        }),
        option('BR01_D', 'Taksirle yaralama (TCK 89): ölüm ayrıca değerlendirilir.', {
          bad: 'Netice ölümdür; suç tipi taksirle öldürmedir (TCK 85). Taksirle yaralama (TCK 89) ölüm gerçekleşmediğinde uygulanır.',
          category: 'HUKUKI_BILGI',
          responses: says(
            L('leyla', 'Kadın öldü Deniz. Yaralama değil. TCK 85/1, artı bilinçli taksir.'),
            L(
              'leyla',
              'Taksirle yaralama, netice ölüm değilse konuşulur. Burada netice belli; tartışma kusurda olacak.',
            ),
          ),
          next: 'BR_01B',
        }),
      ],
    }),
    story('BR_01B', {
      ...BRIEF,
      title: 'Altı kâğıt',
      background: 'buro_gece',
      lines: says(
        N('Leyla klasörü açtı ve kâğıtları masaya tek tek, iskambil açar gibi dizdi.'),
        L('leyla', 'Bir: iddianame. Kırmızı ışık, hız, telefon. Üç ayak. Bir masa üç ayakla da durur; ikiyle durmaz.'),
        L(
          'leyla',
          'İki: bilirkişi raporu. Müh. Cengiz Ateş. Yüzde yüz asli kusur. Ben bu adamın raporlarını otuz yıldır okurum. Hepsi birbirine benzer.',
        ),
        L(
          'leyla',
          'Üç: kaza tespit tutanağı ve kroki. Olay yerine gelen polisin ölçüleri. Raporu yazan bilirkişi olay yerine hiç gitmedi; bunu okudu.',
        ),
        L(
          'leyla',
          'Dört: otopsi ön raporu. Ölüm sebebi kafa travması. Beş: taksicinin ifadesi. Tek görgü tanığı. Altı: telefon dökümü.',
        ),
        L(
          'leyla',
          'Bu dosyada en tehlikeli tanık kürsüye çıkmayacak, Deniz. Bir rapor olarak gelecek. Raporlar yemin etmez ama hâkimler onlara inanır.',
        ),
        L(
          'leyla',
          'Bilirkişi raporu hâkimi bağlamaz; hâkim delilleri vicdanıyla takdir eder. Ama itiraz etmezsen rapor senin yerine konuşur.',
        ),
        L(
          'leyla',
          'Usulü bil: rapor tamamlanınca taraflara itiraz ve yeni inceleme için süre verilir; ret edilirse gerekçeli karar gerekir (CMK 67/5). Kendi uzmanından bilimsel mütalaa da alabilirsin (CMK 67/6).',
        ),
        L(
          'leyla',
          'Ve bilirkişi hukuki nitelendirme yapamaz (CMK 67/3). “Bilinçli taksirle hareket etmiştir” cümlesi bir mühendisin cümlesi değildir.',
        ),
        L('leyla', 'Şimdi söyle: bu dosyaya nereden başlarsın?'),
      ),
      choices: [
        option('BR01B_A', 'Rapordan. Neye dayandığını bilmeden ona itiraz edemem.', {
          effects: [set('ilk_adim', 'RAPOR')],
          responses: says(
            L('leyla', 'Raporu oku, sonra raporun okuduğu her şeyi oku. Bilirkişinin görmediğini sen gör.'),
          ),
          next: 'BR_01C',
        }),
        option('BR01B_B', 'Kavşaktan. Kâğıtlar yalan söylemez ama her şeyi de söylemez.', {
          effects: [set('ilk_adim', 'KAVSAK')],
          responses: says(
            L('leyla', 'Git bak. Ama orası şimdi şubat sabahı; o gece kasımdı. Polisin fotoğraflarına da bak.'),
          ),
          next: 'BR_01C',
        }),
        option('BR01B_C', 'Müvekkilden. Kabul etmek istiyorsa önce onunla konuşmalıyım.', {
          effects: [set('ilk_adim', 'MUVEKKIL')],
          responses: says(
            L('leyla', 'İyi. Ama dikkat: suçluluk duyan insan hatırladığını değil, hak ettiğini düşündüğünü anlatır.'),
          ),
          next: 'BR_01C',
        }),
      ],
    }),
    story('BR_01C', {
      ...BRIEF,
      title: 'Kusur',
      background: 'buro_gece',
      lines: says(
        N(
          'Leyla kâğıtları toplamadı. Bilirkişi raporunun son sayfasını, sonuç paragrafını, parmağıyla masaya bastırdı.',
        ),
        L(
          'leyla',
          '“Yüzde yüz asli kusur.” Bu yüzde bir hesap değil Deniz, bir kanaat. Ama hâkim cezayı bu kanaatle ölçer.',
        ),
        L(
          'leyla',
          'Trafik mevzuatında bazı hâller sürücüyü asli kusurlu sayar. Kırmızıda geçmek bunların başında. Raporun bütün binası o tek tuğlanın üstünde duruyor.',
        ),
        L(
          'leyla',
          'Soru şu: taksirli bir suçta ceza neye göre belirlenir? Ve aynı olayda başka birinin de kusuru varsa ne olur?',
        ),
      ),
      choices: [
        option(
          'BR01C_A',
          'Ceza failin kusuruna göre belirlenir; birden çok kişinin taksiri varsa herkes kendi kusurundan sorumludur.',
          {
            score: { HUKUKI_BILGI: 100 },
            effects: [inc('legal_hits')],
            good: 'TCK 22/4: taksirle işlenen suçta ceza failin kusuruna göre belirlenir. TCK 22/5: birden fazla kişinin taksiriyle işlenen suçta herkes kendi kusurundan sorumludur.',
            responses: says(
              L(
                'leyla',
                'Doğru. Yani rapordaki yüzde değişirse ceza değişir. Yüzde sıfıra inerse… ne olur, onu sen söyleyeceksin.',
              ),
              L(
                'leyla',
                'Bir de bunu aklının bir köşesine koy: kusur ile netice arasında bir bağ olmalı. Hukukçular buna illiyet der. Ezberle; bir gün işine yarar.',
              ),
              T('Kusur ve illiyet. İki kelime. Leyla bunları masaya bıraktı, ben aldım.'),
            ),
            next: 'BR_02',
          },
        ),
        option('BR01C_B', 'Neticenin ağırlığına göre; ölüm varsa kusur oranı önemli değildir.', {
          bad: 'Taksirli suçta ceza neticenin ağırlığına değil, failin kusuruna göre belirlenir (TCK 22/4).',
          category: 'HUKUKI_BILGI',
          responses: says(
            L(
              'leyla',
              'Hayır. Ölüm suçun tipini belirler; cezanın miktarını kusur belirler. Taksirde kusur her şeydir.',
            ),
            L(
              'leyla',
              'Ve birden çok kişinin kusuru varsa, herkes kendi kusurundan sorumludur. Kimse başkasının kusurunu taşımaz.',
            ),
          ),
          next: 'BR_02',
        }),
        option('BR01C_C', 'Bilirkişinin belirlediği oran mahkemeyi bağlar.', {
          bad: 'Bilirkişi raporu mahkemeyi bağlamaz; deliller hâkimin vicdani kanaatiyle takdir edilir (CMK 217/1). Ceza failin kusuruna göre belirlenir (TCK 22/4).',
          category: 'HUKUKI_BILGI',
          responses: says(
            L(
              'leyla',
              'Bağlasaydı hâkim yerine bilirkişi otururdu. Rapor bir görüştür; hâkim onu tartar. Tartısı da senin itirazındır.',
            ),
            L('leyla', 'Ceza kusura göre belirlenir. Kusuru da en son hâkim belirler.'),
          ),
          next: 'BR_02',
        }),
      ],
    }),
    story('BR_02', {
      ...BRIEF,
      phase: 'BRIEFING',
      title: 'Kırmızı Işık',
      blocks: [
        {
          type: 'profileCard',
          character: 'volkan',
          label: 'MÜVEKKİL',
          lines: ['Volkan Eren, 34', 'Dokuma ustabaşı · sabıkasız · adli kontrol altında'],
          charge: 'Taksirle öldürme (TCK 85/1, 22/3)',
          demand: 'İddianame: bilinçli taksir · 2 yıl 8 ay–9 yıl',
        },
        {
          type: 'sentenceRange',
          segments: ['green', 'gold', 'gold', 'red', 'red', 'red', 'darkred', 'darkred'],
          markerPct: 70,
          labels: ['Beraat', 'Basit taksir · 50/4', '2–6 yıl', '9 yıl'],
          demandLabel: 'İSTEM: TCK 85/1 + 22/3',
        },
        {
          type: 'paragraph',
          title: 'OLAY ÖZETİ',
          text: '14 Kasım gecesi 01.11’de Gökdere–Çınarlı kavşağında, yaya geçidinde Hatice Durmaz (54) hayatını kaybetti. Volkan Eren’in aracı olay yerinde, yayanın yanında durdu; Volkan 112’yi aradı. Taksici Necati Bulut, aracın kırmızıda geçtiğini söylüyor. Bilirkişi Volkan’ı %100 asli kusurlu buldu. Volkan yeşil yandığını söylüyor ama “çarptım, hissettim” diyor.',
        },
        {
          type: 'strengthList',
          title: 'SAVCILIĞIN ELİNDEKİLER',
          items: [
            { label: 'Bilirkişi raporu: kırmızı ışık, 68 km/s, %100 asli kusur', strength: 'STRONG' },
            { label: 'Görgü tanığı: taksici Necati Bulut', strength: 'STRONG' },
            { label: 'HTS: kaza anında telefon görüşmesi', strength: 'MEDIUM' },
            { label: 'Sanığın kendi sözü: “Çarptım. Hissettim.”', strength: 'MEDIUM' },
          ],
        },
        {
          type: 'choiceGroup',
          title: 'SAVUNMA STRATEJİSİ SEÇ',
          group: 'g_strateji',
          hints: {
            STR_MASUMIYET:
              'İlliyet: ölümün gerçek nedeni başka; beraat (223/2-b) hedeflenir. Uyan esas savunma ×1,5 puan.',
            STR_KUSUR:
              'Kusur itirazı: ışık, hız ve rapor çürütülür; şüpheden beraat (223/2-e). Uyan esas savunma ×1,2 puan.',
            STR_INDIRIM:
              'Terditli: önce beraat, olmazsa basit taksir ve alt sınır (TCK 50/4). Uyan esas savunma ×0,8 puan.',
          },
        },
      ],
      choices: [
        option('STR_MASUMIYET', 'İlliyet', {
          group: 'g_strateji',
          effects: [set('strategy', 'MASUMIYET'), set('strategy_pct', 150), ...p1.start()],
          responses: says(
            L('leyla', 'Cesur. “Başkası yaptı” demek kolay; göstermek zor. Göstermezsen hâkim bunu kaçamak sayar.'),
          ),
          next: 'INV_SABAH',
        }),
        option('STR_KUSUR', 'Kusur itirazı', {
          group: 'g_strateji',
          effects: [set('strategy', 'KUSUR'), set('strategy_pct', 120), ...p1.start()],
          responses: says(
            L(
              'leyla',
              'Raporu yıkarsan dosya ayakta kalmaz. Ama raporu yıkmak, bir mühendisi kendi rakamlarıyla yenmek demek.',
            ),
            T(
              'Raporun dayanaklarını bulacağım. Işık, iz, çarpma. Her birinin altında bir varsayım var; varsayımlar yıkılır.',
            ),
          ),
          next: 'INV_SABAH',
        }),
        option('STR_INDIRIM', 'Terditli savunma', {
          group: 'g_strateji',
          effects: [set('strategy', 'INDIRIM'), set('strategy_pct', 80), ...p1.start()],
          responses: says(
            L('leyla', 'Güvenli. Ama müvekkiline “biraz suçlusun” demeye hazır mısın? O zaten bunu düşünüyor.'),
          ),
          next: 'INV_SABAH',
        }),
      ],
    }),
    story('INV_SABAH', {
      ...INV,
      title: 'Kavşak, sabah',
      background: 'sokak_sabah',
      lines: says(
        card('CUMA 08.20 — GÖKDERE–ÇINARLI KAVŞAĞI', 'sokak_sabah'),
        N(
          'Gökdere sabahları başka bir yerdir. Okul servisleri, simitçiler, kornaya basan bir belediye otobüsü. Yağmur dinmiş, bulutlar Uludağ’ın üstüne çekilmişti.',
        ),
        N(
          'Sinyal direğinin dibinde naylona sarılmış karanfiller. Yaprakları kararmıştı. Bir hastane kartı, ıslanıp kurumuş, harfleri dalgalanmış.',
        ),
        N(
          'Okul çantalı bir çocuk yaya butonuna bastı. Araçlar durdu. Yaya ışığı yeşile döndü. Çocuk koşarak karşıya geçti; annesi arkasından bağırdı.',
        ),
        T('Bir şehrin en acımasız yanı: hiçbir şey olmamış gibi devam etmesi. Işık yanar, söner, yanar.'),
        T('On dört gün sonra ikinci celse. Dört günüm var; gerisi dilekçeye, hazırlığa ve uykusuzluğa.'),
        N('Telefonumda Gül’den bir mesaj: “Volkan evde. Çay demlendi. O konuşmaz ama siz sorun.”'),
        N(
          'Eczacı kepengini kaldırıyordu. Büfenin önünde iki işçi çay içiyor, biri gazetenin spor sayfasını katlıyordu. Hiçbiri direğin dibine bakmadı.',
        ),
        T(
          'Bir kavşakta biri öldüğünde kavşak üç gün yas tutar. Sonra trafik geri gelir. Üç ay sonra yalnızca solmuş çiçekler ve bir dosya kalır.',
        ),
      ),
      choices: [cont('SABAH_DEVAM', 'Soruşturmaya başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
  ],
};
