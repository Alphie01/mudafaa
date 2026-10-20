import { cont, meet, option, raise, set, story, inc } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { BRIEF, INV1, PRO, card, me, n, p1, s, th, voice } from './shared.js';

// 40-briefing: soğuk açılış (9 Kasım gecesi ve 11 Kasım şafağı), Defne'nin büroya gelişi, Leyla'nın dosya devri ve ceza
// aralığı sorusu, üç kâğıt, dosya ekranı ve strateji, Ihlamur Sokak sabahı. Hikâye kitabı §5 PROLOG…INV_SABAH.

export const briefing: CasePart = {
  nodes: [
    story('PROLOG', {
      ...PRO,
      title: '23.02',
      background: 'sokak_karanlik',
      lines: [
        {
          lines: [
            card('9 KASIM · GECE 23.02 — GÖRÜKLE, IHLAMUR SOKAK', 'sokak_karanlik'),
            n(
              'Lodos akşamdan beri esiyordu. Öğrenci evlerinin balkonlarında unutulmuş çamaşırlar, ıslak bayraklar gibi sallanıyordu.',
            ),
            n(
              'On dört numaranın kapısı aralıktı. Merdiven ışığının otomatiği yanıp söndü; birinin eli düğmeye bir kez daha bastı, sonra vazgeçti.',
            ),
            n('Karanlıkta iki siluet. Biri basamakta, biri kaldırımda. Yüzleri yok; sadece nefesleri, soğukta beyaz.'),
            voice('BİR SES', 'Bir daha kapıya gelme. Ararım ben seni.', 'whisper'),
            voice('İKİNCİ SES', 'Abi bu son, yemin ederim. Yarın param gelecek, yani…', 'whisper'),
            voice('BİR SES', 'Yarın yok. Kimseye nereden aldığını söylemiyorsun. Anladın mı?', 'whisper'),
            n('Bir avuç bir avuca değdi. Küçük bir şey el değiştirdi; bir kibrit kutusundan küçük, bir sırdan ağır.'),
            n(
              'Kapı kapandı. Merdiven ışığı söndü. Kaldırımdaki siluet ellerini cebine soktu, başını eğdi ve yokuşa yürüdü.',
            ),
          ],
        },
        {
          lines: [
            card('23.09 — IHLAMUR SOKAK, ÜÇ YÜZ METRE AŞAĞIDA', 'sokak_karanlik'),
            n(
              'Mavi ışık önce camlarda yandı, sonra ıslak asfaltta. Bir devriye aracı kaldırıma yanaştı. Kapılar açıldı.',
              { fx: 'flash' },
            ),
            voice('POLİS', 'Dur bakalım. Ellerin cebinden çıksın. Yavaş.'),
            n('Siluet koşmayı düşündü. Bacakları düşündü; vücudu düşünmedi. Duvara yaslandı.'),
            voice('POLİS', 'Bu ne? … Hıh. Bunu nereden aldın?'),
            voice('İKİNCİ SES', 'Buldum abi. Yerde buldum, yani…'),
            voice('POLİS', 'Yerde bulunan şeyler naylonla bu kadar düzgün sarılmaz. Bir daha soracağım. Nereden?'),
            n(
              'Uzun bir sessizlik. Yağmur, devriyenin kaputunda tıkırdadı. Siluet yokuşun yukarısına, dördüncü katın karanlık camlarına baktı.',
            ),
            voice('İKİNCİ SES', 'Ihlamur on dört. Daire yedi.'),
            voice('POLİS', 'Adı?'),
            n('Siluet yutkundu. Bir isim seçti; kimin ismini seçtiğini, neden seçtiğini kimse sormadı.'),
            voice('İKİNCİ SES', 'Kaan. Kaan Yıldız.'),
            n('Telsiz cızırdadı. Biri bir not defterine bir isim yazdı. İsim, yağmurdan önce kurudu.', { fx: 'fade' }),
          ],
        },
      ],
      choices: [cont('PROLOG_DEVAM', 'Devam', 'PR_02', { role: 'PRIMARY' })],
    }),
    story('PR_02', {
      ...PRO,
      title: '06.05',
      background: 'ev',
      lines: [
        {
          lines: [
            card('11 KASIM · 06.05 — IHLAMUR SOKAK 14, DAİRE 7', 'ev'),
            n('Kapı üç kez vuruldu. Üçüncüsünde menteşeler bağırdı.', { fx: 'shake' }),
            n(
              'Ön odada, kulaklığı hâlâ boynunda, yarı açık bir iktisat kitabının üstüne uyuyakalmış bir genç doğruldu. Saat kaç, gün ne, kimin kapısı?',
            ),
            s('tuncay', 'Polis! Kaan Yıldız? Kalk, ellerini göreyim. Hâkim kararı var; evde arama yapacağız.'),
            s('kaan', 'Ne… Ne kararı? Abi bir dakika, ben… Gözlüğüm. Gözlüğümü alabilir miyim?', 'saskin'),
            s('tuncay', 'Gözlüğünü al, telefonunu bırak. Kim var evde başka?'),
            s(
              'kaan',
              'Kimse. Yani… arka odada ev arkadaşım kalıyor ama gece vardiyasında. O oda benim değil.',
              'saskin',
            ),
            s('tuncay', 'Ev senin üstüne değil mi? Kira sözleşmesi senin adına.'),
            s('kaan', 'Evet ama o oda…'),
            s('tuncay', 'Ev senin üstüneyse oda da senin üstüne kardeşim. Hadi.'),
          ],
        },
        {
          lines: [
            n(
              'Arka odanın kapısında bir asma kilit vardı. Bir memur aşağı indi, elinde uzun saplı bir keskiyle döndü.',
            ),
            n('Metal, metale sürtündü. Bir çıt. Kilidin yarısı yere düştü ve parkede bir süre döndü.', { fx: 'flash' }),
            n(
              'Bir fotoğraf makinesi patladı. Bir dolap açıldı. Bir ayakkabı kutusu, içinde düzgün sıralanmış küçük beyaz paketler. Bir terazi. Bir paket kilitli poşet.',
            ),
            n('Mutfakta biri şekerliğin kapağını kaldırdı, içine baktı ve ıslık çaldı.'),
            s('kaan', 'Bunlar benim değil. Barış’a sorun. Barış… Barış nerede?', 'uzgun'),
            s('tuncay', 'Barış kim? Burada senden başka kimse yok.'),
            n(
              'Kelepçenin dişleri birer birer kapandı. Merdivenlerde terlikli bir kadın elinde bir kediyle yukarı bakıyordu.',
              { fx: 'shake' },
            ),
            n(
              'Bir memur ön odadaki masadan bir kartı aldı, çevirdi, baktı, geri koydu. Bir başkası telefonun fotoğrafını çekti. Kimse arka odanın kapı eşiğindeki kırık kilide bir daha bakmadı.',
            ),
            n('Sokağın köşesinde bir motor sesi duyuldu, bir an durdu, sonra uzaklaştı. Kimse dönüp bakmadı.'),
            card('ÜÇ GÜN SONRA TUTUKLANDI. İKİ AY SONRA İDDİANAME GELDİ. İLK CELSEYE ON İKİ GÜN VAR.', 'siyah', 'fade'),
          ],
        },
      ],
      choices: [cont('PR02_DEVAM', 'Devam', 'BR_00', { role: 'PRIMARY' })],
    }),
    story('BR_00', {
      ...BRIEF,
      title: 'Defne Hanım',
      background: 'buro_gece',
      onFirstEnter: [meet('deniz'), meet('defne')],
      lines: [
        {
          lines: [
            card('14 OCAK · PERŞEMBE 21.10 — ARSLAN HUKUK, BURSA', 'buro_gece'),
            th('Bursa’da kış iki şey getirir: lodos ve iddianame. Bu gece ikisi birden geldi.'),
            n(
              'Büronun camında sulu kar eriyordu. Masa lambasının altında bir kahve soğumuştu; kapının zili çaldığında saat dokuzu geçiyordu.',
            ),
            n(
              'İçeri giren kadın otuzlarındaydı. Beyaz bir eczane poşeti, ıslak bir şemsiye, kusursuz düğmelenmiş bir palto. Yorgunluğunu bile düzgün taşıyordu.',
            ),
            s(
              'defne',
              'Av. Deniz Arslan? Defne Yıldız. Telefonda konuşmuştuk. Geç oldu, biliyorum. Eczaneyi kapatmadan çıkamadım.',
            ),
            me('Oturun lütfen. Kardeşiniz için gelmiştiniz.'),
            s(
              'defne',
              'Kaan. Yirmi dört yaşında. İktisat son sınıf; dört yıllık okulu altıda bitiriyor. Bir kafede barista.',
            ),
            n(
              'Poşetten bir dosya çıkardı: iddianamenin fotokopisi, bir hastane epikrizi, ince bir zarf. Hepsini masaya, kenarları hizalı biçimde dizdi.',
            ),
            s(
              'defne',
              'Bir şeyi baştan söyleyeyim ki siz sonra başka birinden duyup şaşırmayın. Kardeşim kullanıyordu. Kokain.',
            ),
            s(
              'defne',
              'Babamız öldükten sonra başladı. Ekimde bir partide fenalaştı; acile ben götürdüm. Kalbi dakikada yüz altmış atıyordu.',
              'uzgun',
            ),
            s(
              'defne',
              'O geceden sonra tedaviye başladı. Kendi isteğiyle. Randevularına gidiyordu. Bir ay sonra da kapıyı polis kırdı.',
            ),
            th(
              'İddianamenin ilk sayfası: TCK 188/3, 188/4-a. Kırk bir gram kokain, bir terazi, bir paket poşet. Bir de bir isim: Kaan Yıldız.',
            ),
            s(
              'defne',
              'Kullanıyordu, evet. Ama satmadı. Satacak kadar düzenli bir insan değil o. Faturasını bile ben ödüyorum.',
              'kizgin',
            ),
            s(
              'defne',
              'Zarfta ücretinizin bir kısmı var. Annem bilmiyor. Bilmeyecek de. Ona Kaan’ın burs sınavına çalıştığını söylüyorum.',
            ),
            n(
              'Defne bir an durdu. Elini zarfın üstünde tuttu; geri çekmedi, uzatmadı da. Eczacıların ilaç verirken yaptığı gibi: dozu tam, eli sabit.',
            ),
            s(
              'defne',
              'Biliyor musunuz, ben her gün insanlara bu maddelerin kimyasını anlatırım. Ne kadarı zehir, ne kadarı ilaç. Kardeşimin hangisi olduğunu anlatamadım.',
              'uzgun',
            ),
            th(
              'Kimya bir terazidir. Hukuk da öyle. İkisinde de mesele, kefeye neyin konduğu değil, kefeyi kimin tuttuğudur.',
            ),
            me('Kardeşiniz bana ne anlatırsa, burada kalacak. Size bile anlatmayabilirim. Bunu baştan söylemeliyim.'),
            s(
              'defne',
              'Biliyorum. Avukat–müvekkil gizliliği. Eczanede de hasta mahremiyeti var. İlk defa karşı taraftayım; tuhafmış.',
            ),
          ],
        },
      ],
      choices: [
        option('BR00_A', 'Zarfı bir kenara koyalım. Önce bana bildiğiniz her şeyi anlatın.', {
          effects: [raise('defne_durust'), inc('trust', 4)],
          responses: [
            {
              lines: [
                s(
                  'defne',
                  'Her şeyi mi? Peki. Kaan’a göre arka odada Barış diye biri kalıyordu. Ben hiç görmedim; eve her gittiğimde o oda kilitliydi.',
                ),
                s(
                  'defne',
                  'Polis “böyle biri yok” diyor. Sözleşme yok, adres kaydı yok, telefonu kapalı. Kaan onu uydurmuş, öyle diyorlar.',
                  'kizgin',
                ),
                th('Bir hayalet ev arkadaşı. Ya bu davanın anahtarı ya da kilidi.'),
                s('defne', 'Teşekkür ederim. Herkes önce zarfı açtı. Siz ilk defa Kaan’ı sordunuz.'),
              ],
            },
          ],
          next: 'BR_00L',
        }),
        option('BR00_B', 'Ücret tarifesini ve vekâletnameyi konuşalım; sonra dosyaya geçeriz.', {
          responses: [
            {
              lines: [
                s('defne', 'Elbette. Makbuz kesersiniz, değil mi? Eczacıyım; her şeyin bir kaydı olsun isterim.'),
                n(
                  'Defne vekâletname örneğini iki kez okudu, bir virgülü sordu, sonra imzaladı. Kalemi kapatırken eli bir an titredi.',
                ),
                s('defne', 'Arka odada biri kalıyordu. Barış. Polis inanmıyor. Belki siz inanırsınız.'),
              ],
            },
          ],
          next: 'BR_00L',
        }),
        option('BR00_C', 'Kazanırız, Defne Hanım. Bu dosyayı beraatle kapatırız.', {
          effects: [raise('soz_verdi')],
          responses: [
            {
              lines: [
                s('defne', 'Bunu bana söyleyen üçüncü avukatsınız. Diğer ikisi zarfa bakarak söylemişti.'),
                n('Kısa bir sessizlik oldu. Defne şemsiyesinin ucundaki suyu izledi.'),
                s(
                  'defne',
                  'Umarım haklısınızdır. Arka odada Barış diye biri vardı. Polis “yok” diyor. Kaan’ı bir hayaletle yalnız bıraktılar.',
                ),
              ],
            },
          ],
          next: 'BR_00L',
        }),
      ],
    }),
    story('BR_00L', {
      ...BRIEF,
      title: 'Leyla',
      background: 'buro_gece',
      onFirstEnter: [meet('leyla')],
      lines: [
        {
          when: { flag: 'soz_verdi' },
          lines: [
            n('Defne gidince Leyla Erdem kendi odasının kapısında belirdi. Ne zamandır orada durduğunu bilmiyordum.'),
            s(
              'leyla',
              'Bir anneye ya da bir ablaya söz verme, Deniz. Dosyaya bakarak ver. Söz bir borçtur; bu borcu müvekkil öder, sen değil.',
            ),
            s(
              'leyla',
              'Bağımlılık bir savunma değildir. Bir gerçektir. Gerçekleri savunmaya çevirmek senin işin; onları saklamak değil.',
            ),
          ],
        },
        {
          lines: [
            n(
              'Defne gidince Leyla Erdem kendi odasının kapısında belirdi. Elinde bir fincan ıhlamur, bakışında bir soru.',
            ),
            s(
              'leyla',
              'Kardeşi kullanıyormuş. Bunu ilk cümlede söyledi, değil mi? İyi. Utanılan şeyi ilk söyleyen insan genellikle gerisinde yalan söylemez.',
            ),
            s(
              'leyla',
              'Bağımlılık bir savunma değildir, Deniz. Bir gerçektir. Gerçekleri savunmaya çevirmek senin işin; onları saklamak değil.',
            ),
          ],
        },
      ],
      choices: [cont('BR00L_DEVAM', 'Dosyayı Leyla’yla aç', 'BR_01', { role: 'PRIMARY' })],
    }),
    story('BR_01', {
      ...BRIEF,
      title: 'Dosya devri',
      background: 'buro_gece',
      lines: [
        {
          lines: [
            n(
              'Leyla iddianameyi aldı, gözlüğünü burnunun ucuna indirdi ve sayfaları parmak ucuyla çevirdi. Sigara paketi masada, açılmamış; on bir yıldır öyle.',
            ),
            s(
              'leyla',
              'Kaan Yıldız. Tutuklu. Ağır ceza. Kırk bir buçuk gram kokain: kırk altı paket arka odada, iki paket mutfakta, şekerliğin içinde.',
            ),
            s(
              'leyla',
              'Terazi, poşet, sekiz bin yedi yüz elli lira. Bir de bir muhbir ifadesi. Savcı bunları yan yana koymuş ve bir cümle kurmuş: satıcı.',
            ),
            s(
              'leyla',
              'Dosyaya girmeden önce şunu bil: neyle karşı karşıyayız? İddianamedeki suçun olası ceza aralığı nedir?',
            ),
          ],
        },
      ],
      choices: [
        option('BR01_A', '15 yıldan 30 yıla kadar hapis ve adli para cezası', {
          score: { HUKUKI_BILGI: 50 },
          good: 'Doğru. TCK 188/3 alt sınırı 10 yıl hapis ve 1.000–20.000 gün adli para cezası; madde kokain olduğu için 188/4-a ile yarı oranında artırılır: 15 yıldan başlar. Üst sınır TCK 49/1’deki 20 yılın yarı artırımıyla 30 yıldır.',
          responses: [
            {
              lines: [
                s('leyla', 'Doğru. On yıl, madde kokain olduğu için on beş olur. Üst sınır otuz.', 'mutlu'),
                n('Leyla sigara paketini çevirdi. Bir şey anlatmak istediğinde hep bunu yapardı.'),
                s('leyla', 'Yirmi dört yaşında bir çocuk. On beş yıl. Sırf bir odanın kimin olduğu yüzünden.'),
              ],
            },
          ],
          next: 'BR_01B',
        }),
        option('BR01_B', '10 yıldan 20 yıla kadar hapis ve adli para cezası', {
          bad: 'Eksik. TCK 188/3 temel ceza 10 yıldan az olmamak üzere hapistir; ama madde kokain olduğu için 188/4-a yarı oranında artırım öngörür. Alt sınır 15 yıl, üst sınır 30 yıldır; adli para cezası da unutulmamalı.',
          category: 'HUKUKI_BILGI',
          responses: [
            {
              lines: [
                s(
                  'leyla',
                  'Yarısı doğru. Maddeye bakmadın. Kokain, eroin, sentetikler: ceza yarı oranında artar. On beşten başlıyoruz, Deniz.',
                ),
                s('leyla', 'Bir dosyada ilk okunan şey isim değil, maddedir. Bunu bir daha unutma.'),
              ],
            },
          ],
          next: 'BR_01B',
        }),
        option('BR01_C', 'Kullanmak için bulundurma: 2 yıldan 5 yıla kadar hapis', {
          bad: 'O, savunmanın hedefi olabilir; iddianamenin suçu değil. İddianame TCK 188/3 ve 188/4-a’dan açılmış: 15–30 yıl. 191 (kullanmak için bulundurma) 2–5 yıldır ve kovuşturmada 191/8 uyarınca hükmün açıklanmasının geri bırakılmasıyla sonuçlanır.',
          category: 'HUKUKI_BILGI',
          responses: [
            {
              lines: [
                s('leyla', 'Keşke. O bizim varmak istediğimiz yer olabilir; savcının oturduğu yer değil.'),
                s(
                  'leyla',
                  'İddianame ticaret diyor, madde kokain diyor. On beş ile otuz arası. Önce düşmanın ne kadar büyük olduğunu bil.',
                ),
              ],
            },
          ],
          next: 'BR_01B',
        }),
        option('BR01_D', '20 yıldan 30 yıla kadar hapis ve adli para cezası', {
          bad: 'TCK 188/1 imal, ithal ve ihracı düzenler; ülke içinde bulundurma ve satış 188/3’tedir. Doğrusu: 188/3 + 188/4-a, 15–30 yıl hapis ve adli para cezası.',
          category: 'HUKUKI_BILGI',
          responses: [
            {
              lines: [
                s(
                  'leyla',
                  'Kimse bu çocuğu Kolombiya’dan uçakla gelmekle suçlamıyor. Fıkrayı karıştırdın: ülke içinde bulundurma ve satış, üçüncü fıkra.',
                ),
                s('leyla', 'Artı kokain artırımı. On beş ile otuz.'),
              ],
            },
          ],
          next: 'BR_01B',
        }),
      ],
    }),
    story('BR_01B', {
      ...BRIEF,
      title: 'Üç kâğıt',
      background: 'buro_gece',
      lines: [
        {
          lines: [
            n(
              'Leyla masadan üç boş kâğıt aldı ve her birine tek bir kelime yazdı. Kâğıtları, bir falcının kartları gibi yan yana dizdi.',
            ),
            s('leyla', 'Miktar. Paketleme. İletişim. Mahkeme, kullanan ile satanı bu üçüne bakarak ayırır.'),
            s(
              'leyla',
              'Kullanan cebinde taşır; az ve dağınık. Satan tartar, böler, konuşur: terazi, poşet, mesaj, para.',
            ),
            s('leyla', 'Bu dosyada üçü de savcının elinde. Terazi var, poşet var, mesaj var. Hepsi tek bir odada.'),
            s(
              'leyla',
              'Kırk altı paket, her biri sıfır virgül seksen beş gram. Bir kullanıcı bu kadar düzgün olmaz; bu, birinin akşamlarını bir terazinin başında geçirdiğini gösterir. Soru şu: kimin akşamlarını?',
            ),
            n('Dördüncü bir kâğıt aldı ve bu sefer bir şey yazmadan bıraktı.'),
            s(
              'leyla',
              'Ama bir dördüncüsü var: kimin odası. Terazi, onu kimin tuttuğunu söylemez. Kapı söyler. Kilit söyler. Komşu söyler.',
            ),
            th('Masanın köşesinde ters çevrilmiş bir çerçeve. Hiç sormadım. Sormamam gerektiğini biliyordum.'),
            s(
              'leyla',
              'Bir şey daha. Kaan kullanıcıysa, bunu mahkemede söylemek onun kararıdır, senin değil. Rızası olmadan onun sırrını delil yapma.',
            ),
          ],
        },
      ],
      choices: [cont('BR01B_DEVAM', 'Dosya ekranına geç', 'BR_02', { role: 'PRIMARY' })],
    }),
    story('BR_02', {
      ...BRIEF,
      phase: 'BRIEFING',
      title: 'Beyaz Toz',
      onFirstEnter: [meet('kaan')],
      blocks: [
        {
          type: 'profileCard',
          character: 'kaan',
          label: 'MÜVEKKİL',
          lines: ['Kaan Yıldız, 24', 'Öğrenci · barista · sabıkasız · tutuklu'],
          charge: 'Uyuşturucu ticareti (TCK 188/3, 188/4-a)',
          demand: 'İddianame: 15–30 yıl hapis ve adli para cezası',
        },
        {
          type: 'sentenceRange',
          segments: ['green', 'gold', 'gold', 'red', 'red', 'red', 'darkred', 'darkred'],
          markerPct: 55,
          labels: ['Beraat', '191: 2 yıl, HAGB', '62: 12y6a', '30 yıl'],
          demandLabel: 'İSTEM: 188/3 + 188/4-a',
        },
        {
          type: 'paragraph',
          title: 'OLAY ÖZETİ',
          text: '11 Kasım 06.05’te Görükle Ihlamur Sokak 14/7’de hâkim kararıyla arama yapıldı. Evin arka odasında 46 paket kokain, hassas terazi, kilitli poşetler ve 8.750 TL; mutfaktaki şekerlikte 2 paket bulundu. Kira sözleşmesi Kaan adına. Kaan, arka odanın ev arkadaşı Barış’a ait olduğunu söylüyor; kolluk Barış diye birini tespit edemedi.',
        },
        {
          type: 'strengthList',
          title: 'SAVCILIĞIN ELİNDEKİLER',
          items: [
            { label: 'Arama tutanağı ve kroki', strength: 'STRONG' },
            { label: 'Kira sözleşmesi (Kaan adına)', strength: 'MEDIUM' },
            { label: 'Kriminal rapor', strength: 'STRONG' },
            { label: 'Muhbirin kolluk ifadesi', strength: 'MEDIUM' },
            { label: 'Mesaj dökümü', strength: 'MEDIUM' },
            { label: 'Saç analizi', strength: 'WEAK' },
          ],
        },
        {
          type: 'choiceGroup',
          title: 'SAVUNMA STRATEJİSİ SEÇ',
          group: 'g_strateji',
          hints: {
            STR_MASUMIYET: 'Masumiyet: beraat hedeflenir; stratejine uyan esas savunma ×1,5 puan.',
            STR_USUL: 'Usul: aramadaki hataları ortaya koyarsın; uyan esas savunma ×1,2 puan.',
            STR_INDIRIM: 'Terditli: önce beraat, olmazsa kullanmak için bulundurma; uyan esas savunma ×0,8 puan.',
          },
        },
      ],
      choices: [
        option('STR_MASUMIYET', 'Masumiyet', {
          group: 'g_strateji',
          effects: [set('strategy', 'MASUMIYET'), set('strategy_pct', 150), ...p1.start()],
          responses: [
            {
              lines: [s('leyla', 'Cesur. O odanın içindeki her şeyin başka birine ait olduğunu göstermen gerekecek.')],
            },
          ],
          next: 'INV_SABAH',
        }),
        option('STR_USUL', 'Usul hatası', {
          group: 'g_strateji',
          effects: [set('strategy', 'USUL'), set('strategy_pct', 120), ...p1.start()],
          responses: [
            {
              lines: [
                s('leyla', 'Polisin aceleciliği bazen en iyi tanığındır. Ama kâğıt tek başına kimseyi tahliye etmez.'),
              ],
            },
          ],
          next: 'INV_SABAH',
        }),
        option('STR_INDIRIM', 'Terditli savunma', {
          group: 'g_strateji',
          effects: [set('strategy', 'INDIRIM'), set('strategy_pct', 80), ...p1.start()],
          responses: [
            { lines: [s('leyla', 'Güvenli. Ama Kaan’a “sen satıcı değilsin ama biraz suçlusun” demeye hazır mısın?')] },
          ],
          next: 'INV_SABAH',
        }),
      ],
    }),
    story('INV_SABAH', {
      ...INV1,
      title: 'Ihlamur Sokak',
      background: 'sokak_sabah',
      lines: [
        {
          lines: [
            card('15 OCAK · CUMA 08.20 — GÖRÜKLE, IHLAMUR SOKAK', 'sokak_sabah'),
            n(
              'Görükle sabahları kızarmış ekmek ve ıslak karton kokar. Öğrenciler kapüşonlarını kafalarına geçirmiş, otobüs durağına koşuyordu.',
            ),
            n(
              'On dört numara dört katlı, sarı boyası dökülmüş bir apartmandı. En üst katın balkonunda, rüzgârın kenara ittiği bir kurye kutusu duruyordu. Logosu yağmurdan silinmişti.',
            ),
            th('Bir ev. İki oda. Bir kilit. Savcılığa göre bir kişi. Kaan’a göre iki.'),
            n(
              'Köşedeki bakkalın önünde bir motosikletli kurye siparişini kontrol ediyordu. Kaskını aynaya asmış, eldivenlerini dişleriyle çıkarıyordu. Görükle’de bir sabah, yüz kurye. Yüz kask.',
            ),
            th(
              'Üniversitedeyken bir arkadaşım vardı. Ece. O da “sadece hafta sonları” derdi. Bir hafta sonu bitmedi. Bu dosyayı Ece’nin gözüyle okumamaya çalışıyorum. Zor.',
            ),
            n(
              'Zemin katın penceresinde bir perde aralandı ve kapandı. Bir kedi pencerenin pervazından bana baktı, esnedi.',
            ),
            th(
              'On iki gün. Kâğıtları okuyacağım, fotoğraflara bakacağım, Kaan’la konuşacağım. Ve bir hayaletin izini süreceğim.',
            ),
            th('Bir kural koydum kendime: önce bul, sonra inan. Bu sefer tersini yapmayacağım.'),
          ],
        },
      ],
      choices: [cont('SABAH_DEVAM', 'Soruşturmaya başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
  ],
};
