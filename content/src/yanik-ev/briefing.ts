import { cont, inc, meet, option, raise, set, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { BRIEF, INV1, PRO, card, me, n, named, p1, s, th, voice } from './shared.js';

// 40-briefing: soğuk açılış (15 Ocak gecesi ve sabahı), Zehra'nın büroya gelişi, Leyla'nın dosya devri ve ceza aralığı
// sorusu, halatın üç ipliği, dosya ekranı ve strateji, Kalem Sokak sabahı. Hikâye kitabı §5 PROLOG…INV_SABAH.

export const briefing: CasePart = {
  nodes: [
    story('PROLOG', {
      ...PRO,
      title: '02.08',
      background: 'sokak_karanlik',
      lines: [
        {
          lines: [
            card('15 OCAK · GECE 01.30 — MURADİYE, KALEM SOKAK', 'sokak_karanlik'),
            n(
              'Yağmur akşamdan beri yağıyordu. Cumbaların altından damlayan su, arnavutkaldırımının taşları arasında küçük, siyah dereler açıyordu.',
            ),
            n(
              'Sokağın evleri yüz yaşındaydı. Ahşap, sıva, kerpiç; biri ötekine yaslanmış, yorgun ihtiyarlar gibi. Birinin saçağı ötekinin penceresine değiyordu.',
            ),
            n(
              'Bir el feneri kapıları tek tek yokladı. Bir tokmak, bir kilit, bir düdük. Bir köpek havladı, vazgeçti. Fener sokağın sonunda döndü ve gitti.',
            ),
            voice('BİR KADIN', 'Kim o? … Kim o dedim? … Neyse. Bu saatte kimse kimse değil.', 'whisper'),
            n('Bir perde kapandı. Bir soba borusu tısladı. Sokak yeniden yağmurun oldu.'),
            card('02.08', 'sokak_karanlik'),
            n(
              'Sokak lambaları bir an karardı. Sonra fazla parlak yandı; o kadar parlak ki ıslak taşlar bir saniyeliğine gündüz gibi oldu.',
            ),
            n(
              'Karşı evlerden birinin penceresinde mavi bir ekran “pat” diye söndü. Kimse kalkıp bakmadı. Gece yarısı bozulan şeylere sabah bakılır.',
            ),
            n(
              'Dokuz numaranın içinde bir şey çıtırdadı. Bir böcek gibi küçük, bir saat gibi düzenli. Sonra koridor camında turuncu bir ışık doğdu.',
            ),
            n(
              'Işık büyüdü. Lambri tutuştu, cila kabardı, yüz yıllık ceviz bir iç çeker gibi çatırdadı. Camlar önce terledi, sonra çatladı.',
              { fx: 'flash' },
            ),
            voice(
              'BİR SES',
              'İtfaiye! Kalem Sokak, dokuz numara! Ahşap ev, yanıyor! Çabuk, yanındaki ev de tutuşacak!',
            ),
            n(
              'Sirenler yokuşu tırmandı. Hortumlar açıldı, su ateşe çarpıp buhar oldu. Yan evin saçağı alev aldı; bir anne çocuğunu battaniyeye sarıp merdivenden indirdi.',
              { fx: 'shake' },
            ),
            n(
              'Ev bir fener gibi yandı. Komşular pijamalarıyla, şemsiyesiz, şeridin henüz olmadığı bir sınırın arkasında durup baktılar.',
            ),
            n(
              'Sabaha karşı ateş söndü. Ama bir şey yanmaya devam etti; adı henüz konmamış, dumanı henüz görünmeyen bir şey.',
              { fx: 'fade' },
            ),
          ],
        },
      ],
      choices: [cont('PROLOG_DEVAM', 'Devam', 'PR_02', { role: 'PRIMARY' })],
    }),
    story('PR_02', {
      ...PRO,
      title: '07.40',
      background: 'sokak_sabah',
      lines: [
        {
          lines: [
            card('15 OCAK · 07.40 — KALEM SOKAK 9', 'sokak_sabah'),
            n(
              'Gün ağardığında ev yoktu. Yerinde kararmış dikmeler, eğilmiş bir cumba, gökyüzüne açılmış bir çatı iskeleti vardı. Islak kül, eriyik plastik, kömürleşmiş ceviz kokusu.',
            ),
            n('Bir kırmızı-beyaz şerit, iki direğe bağlanmış. Önünde yorgun bir bekçi, elinde bir defter.'),
            n(
              'Elli yaşlarında bir adam yokuştan koşarak geldi. Ceketi ters giyilmiş, ayakkabılarının bağı çözük. Şeridin önünde durdu; dizleri durmadı.',
            ),
            s('halil', 'Nermin’in evi… Bu… bu Nermin’in evi.', 'uzgun'),
            named('POLİS', 'Halil Bozkurt siz misiniz? Ev sahibi? Kimliğinizi alayım. Gece neredeydiniz?'),
            s(
              'halil',
              'Atölyede. Sanayide. Bir sipariş vardı… Kızım aradı, ben… Biri var mıydı içeride? Söyleyin, biri var mıydı?',
            ),
            named('POLİS', 'Kimse yoktu. Yan evdekiler de kurtuldu. Cüzdanınızı açın, kimliğinizi verin.'),
            n(
              'Halil’in elleri titredi. Cüzdan açıldı, bir fiş ıslak taşın üstüne düştü. Polis eğildi, aldı, ışığa tuttu.',
            ),
            named('POLİS', 'Kurşunsuz benzin. Beş litre. Bidon. On iki ocak.'),
            s('halil', 'Jeneratör için… Atölyede elektrik kesiliyor, jeneratöre…'),
            n(
              'Polis fişi çevirdi, meslektaşına gösterdi. Biri bir şey not etti. Kimse Halil’e bir şey sormadı. Sormaya gerek görmediler.',
            ),
            n(
              'Saat dokuzu yirmi geçe, şeridin altından biri daha geçti. Bekçinin defterine bir satır daha yazıldı. O satırı aylarca kimse okumadı.',
            ),
            n(
              'Öğleden sonra bir hasar ihbarı yapıldı. Üç gün sonra bir rapor yazıldı. Bir ay sonra bir bilirkişi, bir laboratuvar, bir kelime: hızlandırıcı.',
            ),
            card(
              'YİRMİ GÜN SONRA TUTUKLANDI. İDDİANAME MARTTA GELDİ. BİRİNCİ CELSEYE ON BİR GÜN VAR.',
              'siyah',
              'fade',
            ),
          ],
        },
      ],
      choices: [cont('PR02_DEVAM', 'Devam', 'BR_00', { role: 'PRIMARY' })],
    }),
    story('BR_00', {
      ...BRIEF,
      title: 'Zehra',
      background: 'buro_gece',
      onFirstEnter: [meet('deniz'), meet('zehra')],
      lines: [
        {
          lines: [
            card('3 NİSAN · PERŞEMBE 22.15 — ARSLAN HUKUK, BURSA', 'buro_gece'),
            th('Bursa’da nisan yağmuru iki şey getirir: çamur ve geç kalmış vicdanlar. Bu gece kapıyı ikincisi çaldı.'),
            n(
              'Büronun camında yağmur. Masa lambasının altında soğumuş bir çay, ortaklık sözleşmemin hâlâ çerçevelenmemiş bir kopyası. Zil çaldığında saat onu geçiyordu.',
            ),
            n(
              'Gelen kadın yirmilerinin sonundaydı. Montunun altında açık mavi bir hastane forması, ellerinde dezenfektan kokusu, gözlerinin altında iki nöbetin morluğu.',
            ),
            s(
              'zehra',
              'Av. Deniz Arslan? Zehra Bozkurt. Acilden çıktım, kusura bakmayın. Bu saatte açık başka büro bulamadım.',
            ),
            me('Oturun lütfen. Babanız için gelmiştiniz.'),
            s('zehra', 'Halil Bozkurt. Döşemeci. Elli dört yaşında. İki aydır cezaevinde. Evini yakmakla suçlanıyor.'),
            n(
              'Çantasından bir dosya çıkardı. İddianame, bir poliçe fotokopisi, bir bilirkişi raporu. Kâğıtları masaya bir hastanın film zarfı gibi, düzgün ve çabuk dizdi.',
            ),
            s(
              'zehra',
              'Önceki avukat geçen hafta bıraktı. “Dosya kötü” dedi. “Sigorta, benzin, borç; hepsi yan yana. Hâkim bunu görünce gözünü kırpmaz.”',
              'kizgin',
            ),
            th(
              'İddianamenin ilk sayfası: TCK 170/1-a, 158/1-k, 35. Bir ev, bir poliçe, bir bidon. Bir de bir rapor: “hızlandırıcı kullanılmıştır.”',
            ),
            s(
              'zehra',
              'O ev annemin eviydi. Annemin babasından kalma. Annem iki yıl önce orada öldü; kendi yatağında, istediği gibi.',
              'uzgun',
            ),
            s(
              'zehra',
              'Babam o evin her tahtasını kendi eliyle cilaladı. Kapı kollarını söküp tek tek temizlerdi. Restorasyon için kredi çekmişti; evi annemin istediği gibi yapacaktı.',
            ),
            n('Bir süre sustu. Formasının cebindeki kalemi çıkarıp çevirdi, geri koydu.'),
            s(
              'zehra',
              'Bir şey daha söyleyeceğim; siz başkasından duymayın. Babamın borçları varmış. İki icra. Ben iddianameden öğrendim. Bana söylememiş.',
              'uzgun',
            ),
            s(
              'zehra',
              'Acilde yanık hastası gelince önce yanığın derecesine bakarız. Birinci mi, ikinci mi, üçüncü mü. Ben babamın derecesini bilmiyorum artık.',
            ),
            th(
              'Bir kızın babasından kuşku duyması bir iddianameden daha ağırdır. İddianame bir kâğıttır. Kuşku, insanın içinde bir oda tutar.',
            ),
            s(
              'zehra',
              'Bileziklerimi bozdurmama gerek yok, maaşım var. Ama bir daha “dosya kötü” diyecek birini istemiyorum.',
            ),
          ],
        },
      ],
      choices: [
        option('BR00_A', 'Önce bana babanızı anlatın. Dosyayı sonra okurum.', {
          effects: [raise('zehra_durust'), inc('trust', 4)],
          responses: [
            {
              lines: [
                s(
                  'zehra',
                  'Babam mı? Az konuşur. Elleriyle konuşur. Bir koltuğun kumaşını gerdiğinde, bir şeyi düzelttiğini bilirsiniz. Annem öldüğünden beri her şeyi düzeltmeye çalışıyor.',
                ),
                s(
                  'zehra',
                  'O gece atölyedeymiş. Bir otelin kırk sandalyesi. Son haftalarda evde uyumuyordu zaten; ev yarı boştu, soğuktu. Restorasyon diye eşyaları taşımıştı.',
                ),
                th(
                  'Eşyaları taşımış. İddianamede bu cümle başka bir sıfatla geçiyor: “değerli eşyalarını önceden çıkarmış.”',
                ),
                s('zehra', 'Teşekkür ederim. Herkes önce raporu açtı. Siz babamı sordunuz.'),
              ],
            },
          ],
          next: 'BR_00L',
        }),
        option('BR00_B', 'Vekâletname ve ücret konusunu halledelim; sonra dosyaya geçeriz.', {
          responses: [
            {
              lines: [
                s('zehra', 'Tabii. Hastanede de önce onam formu imzalanır. Alışkınım.'),
                n('Vekâletname örneğine bir hemşirenin dikkatiyle baktı, iki yeri sordu, imzaladı.'),
                s('zehra', 'Babam o gece atölyedeymiş. Eşyaları restorasyon diye taşımıştı. Kimse bunu dinlemedi.'),
              ],
            },
          ],
          next: 'BR_00L',
        }),
        option('BR00_C', 'Babanız bunu yapmamış. Bundan eminim; beraat alacağız.', {
          effects: [raise('soz_verdi')],
          responses: [
            {
              lines: [
                s('zehra', 'Nasıl emin olabilirsiniz? Daha dosyayı açmadınız.', 'saskin'),
                n('Kısa bir sessizlik. Zehra kalemini çevirdi.'),
                s('zehra', 'Ama… teşekkür ederim. Birinin emin olmasına ihtiyacım vardı. Ben olamıyorum.'),
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
            n('Zehra gidince Leyla Erdem kendi odasının kapısında belirdi. Ne zamandır orada durduğunu bilmiyordum.'),
            s(
              'leyla',
              'Bir kızın gözüne bakarak söz verme, Deniz. Dosyaya bakarak ver. Ortak oldun diye sözlerin bedava olmadı; daha pahalı oldu.',
            ),
            s(
              'leyla',
              'O kız babasından şüphe ediyor. Senin işin onu ikna etmek değil. Kanıtlamak. Ya da kanıtlayamadığını kabul etmek.',
            ),
          ],
        },
        {
          lines: [
            n(
              'Zehra gidince Leyla Erdem kendi odasının kapısında belirdi. Elinde bir fincan ıhlamur, bakışında bir soru.',
            ),
            s(
              'leyla',
              'Borcu ilk o söyledi, değil mi? İyi. Utanılan şeyi ilk söyleyen, gerisinde yalan söylemez. Ama babası söylememiş. Onu da not et.',
            ),
            s('leyla', 'Yangın dosyaları kötüdür, Deniz. Kanıt yanar, kokusu kalır. Herkes kokuya göre karar verir.'),
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
              'Leyla iddianameyi aldı, gözlüğünü kazağının ucuyla sildi ve sayfaları parmak ucuyla çevirdi. Sigara paketi masada, açılmamış.',
            ),
            s(
              'leyla',
              'Halil Bozkurt. Tutuklu. Asliye ceza; tek hâkim. Katılan bir sigorta şirketi. İki suç: evini yakmak ve o yangının parasını almaya kalkmak.',
            ),
            s(
              'leyla',
              'Poliçe kırk yedi gün önce, teminat artışı on iki gün önce, eşyalar bir hafta önce, benzin üç gün önce. Savcı bunları bir ipe dizmiş; ucunu da bilirkişiye bağlamış.',
            ),
            s('leyla', 'Dosyaya girmeden önce şunu bil: müvekkilin neyle karşı karşıya? İki suçun cezası ne?'),
          ],
        },
      ],
      choices: [
        option(
          'BR01_A',
          'Yangın için bir ila beş yıl; sigorta için dört ila on yıl ve adli para, ama teşebbüs olduğundan indirimli',
          {
            score: { HUKUKI_BILGI: 50 },
            good: 'Doğru. TCK 170/1-a (7571 sayılı Kanunla 2025’te değişik) bir yıldan beş yıla kadar hapis; TCK 158/1-k üç–on yıl, (k) bendinde alt sınır dört yıl ve adli para menfaatin iki katından az olamaz. Bedel ödenmediği için teşebbüs: TCK 35/2 ile dörtte birden dörtte üçe indirim.',
            responses: [
              {
                lines: [
                  s(
                    'leyla',
                    'Doğru. Ve tazminat ödenmedi; sigorta parası hiç ele geçmedi. Teşebbüs. Bunu unutma.',
                    'mutlu',
                  ),
                  n('Leyla sigara paketini çevirdi. Bir şey anlatmak istediğinde hep bunu yapardı.'),
                  s(
                    'leyla',
                    'İkisi yan yana konursa üç dört yıl eder. Ama asıl tehlike rakamda değil. Asıl tehlike, hâkimin bu evi bir kundakçının evi olarak görmesi.',
                  ),
                ],
              },
            ],
            next: 'BR_01B',
          },
        ),
        option('BR01_B', 'Altı ay ila üç yıl; dolandırıcılıkta da üç ila on yıl', {
          bad: 'Eski metin. TCK 170/1’deki “altı aydan üç yıla” ibaresi 24/12/2025 tarihli 7571 sayılı Kanunla “bir yıldan beş yıla” olarak değişti. 158/1-k’de alt sınır dört yıldır; bedel alınmadığı için TCK 35 uyarınca teşebbüs indirimi uygulanır.',
          category: 'HUKUKI_BILGI',
          responses: [
            {
              lines: [
                s(
                  'leyla',
                  'Eski kitaptan okuyorsun. Kanun geçen aralıkta değişti; yangında alt sınır bir yıl, üst sınır beş.',
                ),
                s(
                  'leyla',
                  'Sigortada da (k) bendi ağır: dört yıldan başlar. Ama para alınmadı; teşebbüs. Mevzuatı her dosyada yeniden aç, Deniz.',
                ),
              ],
            },
          ],
          next: 'BR_01B',
        }),
        option('BR01_C', 'On yılın üstü; ağır ceza işi bu', {
          bad: 'Hayır. TCK 170/1-a’nın üst sınırı beş, 158/1’in on yıldır; on yılı aşmadığı için görevli mahkeme ağır ceza değil asliye cezadır (5235 sayılı Kanun md. 12).',
          category: 'HUKUKI_BILGI',
          responses: [
            {
              lines: [
                s('leyla', 'Öyle olsaydı karşında üç hâkim olurdu. Bir tane var. Neden?'),
                s(
                  'leyla',
                  'Çünkü iki suçun da üst sınırı on yılı geçmiyor. Asliye ceza. Hâkim tek; ikna edeceğin vicdan da tek.',
                ),
              ],
            },
          ],
          next: 'BR_01B',
        }),
        option('BR01_D', 'Üç ay ila bir yıl', {
          bad: 'O, taksirle yangına neden olmanın (TCK 171/1-a) cezasıdır; iddianame kastı ileri sürüyor: TCK 170/1-a (bir–beş yıl) ve 158/1-k, 35.',
          category: 'HUKUKI_BILGI',
          responses: [
            {
              lines: [
                s('leyla', 'O dikkatsizliğin cezası. Savcı dikkatsizlik demiyor; kasıt diyor.'),
                s(
                  'leyla',
                  'Ama aklında tut: bir gün bu rakam sana kurtuluş gibi görünebilir. Kurtuluş gibi görünen her kapıdan geçme.',
                ),
              ],
            },
          ],
          next: 'BR_01B',
        }),
      ],
    }),
    story('BR_01B', {
      ...BRIEF,
      title: 'Halatın üç ipliği',
      background: 'buro_gece',
      lines: [
        {
          lines: [
            n('Leyla masadan üç boş kâğıt aldı ve her birine tek bir kelime yazdı: NEREDE. NEYLE. KİM.'),
            s(
              'leyla',
              'Bir yangın dosyası bu üç soruya bakar. Nerede başladı, neyle başladı, kim başlattı. Savcının cevapları hazır: salonda, benzinle, Halil.',
            ),
            s(
              'leyla',
              'Senin işin cevaplara itiraz etmek değil. Soruları yeniden sormak. Her soruyu, kimin cevapladığına bakarak.',
            ),
            n('Kâğıtları yan yana dizdi, sonra bir ipi alıp üçünün üstünden geçirdi.'),
            s(
              'leyla',
              'Dolaylı delil bir halattır. Poliçe bir iplik, eşyalar bir iplik, benzin bir iplik. Tek bir iplik kimseyi asmaz. Halat asar.',
            ),
            s(
              'leyla',
              'İplikleri tek tek ayır. Her birinin masum bir açıklaması varsa söyle. Ama dikkat: masum açıklama, kanıtlanmış açıklama değildir.',
            ),
            th('Masanın köşesinde ters çevrilmiş bir çerçeve. Hiç sormadım. Ortak olduğum gün bile sormadım.'),
            s(
              'leyla',
              'Bir şey daha. Bilirkişi raporu bir hüküm değildir. Bir tanıktır. Tanık da sorgulanır. Ama önce onun ne gördüğünü, ne zaman gördüğünü öğren.',
            ),
          ],
        },
      ],
      choices: [cont('BR01B_DEVAM', 'Dosya ekranına geç', 'BR_02', { role: 'PRIMARY' })],
    }),
    story('BR_02', {
      ...BRIEF,
      phase: 'BRIEFING',
      title: 'Yanık Ev',
      onFirstEnter: [meet('halil')],
      blocks: [
        {
          type: 'profileCard',
          character: 'halil',
          label: 'MÜVEKKİL',
          lines: ['Halil Bozkurt, 54', 'Döşemeci · sabıkasız · tutuklu'],
          charge:
            'Genel güvenliği kasten tehlikeye sokma (TCK 170/1-a); nitelikli dolandırıcılığa teşebbüs (TCK 158/1-k, 35)',
          demand: 'İddianame: 170/1-a ve 158/1-k, 35 uyarınca cezalandırılması',
        },
        {
          type: 'sentenceRange',
          segments: ['green', 'green', 'gold', 'gold', 'red', 'red', 'darkred', 'darkred'],
          markerPct: 60,
          labels: ['Beraat', '171: HAGB', '170 + 158/35', '5 + 7,5 yıl'],
          demandLabel: 'İSTEM: 170/1-a + 158/1-k, 35',
        },
        {
          type: 'paragraph',
          title: 'OLAY ÖZETİ',
          text: '15 Ocak gecesi 02.14 sularında Muradiye Kalem Sokak 9’daki iki katlı ahşap ev yandı; yangın yan binanın saçağına sıçradı. Savcılığa göre ev sahibi Halil Bozkurt, borçları nedeniyle, kırk yedi gün önce yaptırdığı ve on iki gün önce teminatını artırdığı konut sigortasının bedelini almak için evi benzinle yaktı ve ertesi gün hasar ihbarında bulundu. Halil, gece atölyesinde olduğunu söylüyor.',
        },
        {
          type: 'strengthList',
          title: 'SAVCILIĞIN ELİNDEKİLER',
          items: [
            { label: 'Yangın bilirkişi raporu ve laboratuvar', strength: 'STRONG' },
            { label: 'Sigorta ekspertiz raporu', strength: 'MEDIUM' },
            { label: 'Poliçe ve teminat artışı', strength: 'MEDIUM' },
            { label: 'Benzin fişi', strength: 'MEDIUM' },
            { label: 'Komşunun ifadesi', strength: 'MEDIUM' },
            { label: 'İcra kayıtları', strength: 'WEAK' },
          ],
        },
        {
          type: 'choiceGroup',
          title: 'SAVUNMA STRATEJİSİ SEÇ',
          group: 'g_strateji',
          hints: {
            STR_MASUMIYET: 'Masumiyet: beraat hedeflenir; stratejine uyan esas savunma ×1,5 puan.',
            STR_USUL: 'Usul: delillerin elde edilişindeki hataları ortaya koyarsın; uyan esas savunma ×1,2 puan.',
            STR_INDIRIM: 'Terditli: önce beraat, olmazsa daha hafif bir nitelendirme; uyan esas savunma ×0,8 puan.',
          },
        },
      ],
      choices: [
        option('STR_MASUMIYET', 'Masumiyet', {
          group: 'g_strateji',
          effects: [set('strategy', 'MASUMIYET'), set('strategy_pct', 150), ...p1.start()],
          responses: [
            { lines: [s('leyla', 'Cesur. Yangının nereden ve neyle başladığını, savcıdan iyi bilmen gerekecek.')] },
          ],
          next: 'INV_SABAH',
        }),
        option('STR_USUL', 'Usul hatası', {
          group: 'g_strateji',
          effects: [set('strategy', 'USUL'), set('strategy_pct', 120), ...p1.start()],
          responses: [
            {
              lines: [
                s(
                  'leyla',
                  'Bir delil, elde edildiği yol kadar güçlüdür. Yolları yürü. Ama kâğıt tek başına kimseyi tahliye etmez.',
                ),
              ],
            },
          ],
          next: 'INV_SABAH',
        }),
        option('STR_INDIRIM', 'Terditli savunma', {
          group: 'g_strateji',
          effects: [set('strategy', 'INDIRIM'), set('strategy_pct', 80), ...p1.start()],
          responses: [
            { lines: [s('leyla', 'Güvenli. Ama Halil’e “kundakçı değilsin, ama dikkatsizsin” demeye hazır mısın?')] },
          ],
          next: 'INV_SABAH',
        }),
      ],
    }),
    story('INV_SABAH', {
      ...INV1,
      title: 'Kalem Sokak',
      background: 'sokak_sabah',
      lines: [
        {
          lines: [
            card('4 NİSAN · CUMA 08.10 — MURADİYE, KALEM SOKAK', 'sokak_sabah'),
            n(
              'Muradiye sabahları ıslak taş ve simit kokar. Dar sokaklarda emekliler kahvehanelere, çocuklar okula yürüyordu; kimse dokuz numaraya bakmıyordu.',
            ),
            n(
              'Dokuz numara bir yara gibiydi. Kararmış dikmeler, eğilmiş bir cumba, yağmurda parlayan kömür. Yan evin saçağında is, pencerelerinde yeni takılmış naylon.',
            ),
            th('Bir ev. Bir gece. Üç soru: nerede, neyle, kim. Savcının üç cevabı, bir de benim üç kuşkum.'),
            n(
              'Şeridin kalıntısı bir direğe dolanmış, rüzgârda sallanıyordu. Karşı evin perdesi aralandı ve kapanmadı. Bir kadın bana baktı; ben de ona.',
            ),
            th(
              'Büyükbabamın Gemlik’teki evi ben sekiz yaşındayken yanmıştı. Sigorta “kusur” dedi, ödemedi. Dedem o kışı bir akrabanın kilerinde geçirdi. Bu dosyayı o kilerden okumamaya çalışıyorum.',
            ),
            th('Kural: önce bul, sonra inan. Yangında ikisini karıştırmak kolay; ikisi de sıcaktır.'),
          ],
        },
      ],
      choices: [cont('SABAH_DEVAM', 'Soruşturmaya başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
  ],
};
