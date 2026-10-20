import {
  any,
  cmp,
  conversation,
  costOf,
  dec,
  decisionNode,
  discover,
  flag,
  has,
  ifThen,
  inc,
  interview,
  meet,
  mood,
  objective,
  option,
  raise,
  set,
  topic,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { INV1, card, me, n, s, th } from './shared.js';

// 52-inv-kisiler: cezaevinde müvekkil görüşmesi (konular başka yerlerde öğrenilenlerle açılır), komşu Saadet, bekçi
// Cevdet, elektrikçi Necati, acente Kader.

export const invPeople: CasePart = {
  nodes: [
    decisionNode('INV_GORUS_G_1', [{ to: 'INV_GORUSME' }], {
      ...INV1,
      title: 'Müvekkil görüşmesi',
      lines: [
        {
          when: cmp({ visits: 'INV_GORUSME' }, '==', 0),
          lines: [
            card('BURSA H TİPİ CEZAEVİ — AVUKAT GÖRÜŞ ODASI', 'gorus_odasi'),
            n(
              'Üç kapı, iki arama, bir imza. Koridorlar çamaşır suyu ve demlenmiş çay kokuyordu. Her kapı arkamdan kilitlendikçe dosya çantam biraz daha ağırlaştı.',
            ),
            s('gardiyan', 'Avukat görüşü. Salon beşte kapanır. Camdan bakarım; konuşmanızı duymam.'),
            s(
              'gardiyan',
              'Bu adam koğuşta herkesin ayakkabısını dikiyor, avukat hanım. İplikle, mumla. Kimse istemeden. Elleri boş duramıyor.',
            ),
            n(
              'Halil içeri girdi. Kır saçları kısa kesilmiş, bıyığı özenle düzeltilmiş. Gri bir kazak, temiz ama dirsekleri incelmiş. Oturmadan önce sandalyeyi masaya hizaladı.',
            ),
            s('halil', 'Zehra’nın tuttuğu avukat. Hoş geldiniz. Kusura bakmayın, size bir çay bile ikram edemiyorum.'),
            th(
              'İki aydır cezaevinde olan bir adam, bana çay ikram edemediği için özür diliyor. Not defterime yazmadım. Ama aklıma yazdım.',
            ),
            me(
              'Halil Bey, size sorular soracağım. Bazıları hoşunuza gitmeyecek. Savcı daha kötülerini soracak; önce benden duyun.',
            ),
            s(
              'halil',
              'Sorun. Ben kumaşçıyım. Bir şeyin iyi mi kötü mü olduğunu ters yüzünden anlarım. Sorularınızın da ters yüzüne bakarım.',
            ),
          ],
        },
        {
          lines: [
            card('BURSA H TİPİ CEZAEVİ — GÖRÜŞ ODASI, İKİNCİ ZİYARET', 'gorus_odasi'),
            n(
              'Ömer Çakmak bu sefer başıyla selam verdi. Halil bir koğuş arkadaşının ayakkabısını elinde getirmişti; masaya koymadan önce özür diledi.',
            ),
            s('halil', 'Geldiniz. Bir şey mi buldunuz? Yüzünüzden anlarım; müşteri koltuğu beğenince de böyle bakar.'),
            th('Ben bir şey bulduğumu sanıyorum. O, benim yüzümde bir umut buldu. İkisi aynı şey değil.'),
          ],
        },
      ],
    }),
    interview('INV_GORUSME', {
      ...INV1,
      title: 'Müvekkil görüşmesi',
      hud: ['min', 'trust'],
      room: { label: 'CEZAEVİ · GÖRÜŞ ODASI', character: 'halil' },
      onFirstEnter: [meet('gardiyan'), ifThen(flag('zehra_durust'), [inc('trust', 2)])],
      onEnter: [ifThen(cmp({ visits: 'INV_GORUSME' }, '>', 1), [set('min', 8)])],
      lines: [
        {
          when: cmp({ visits: 'INV_GORUSME' }, '==', 1),
          lines: [
            n('Duvardaki saat iki dakika ileri. Halil saati gördü, bir şey demedi; düzeltmek istediği her şey gibi.'),
            n('Görüş salonunun kapanışına 14 dakika var.'),
          ],
        },
        { lines: [n('Görüş salonunun kapanışına 8 dakika var. Yeni sorular, eski bir ev.')] },
      ],
      tones: [
        { id: 'soft', label: 'Yumuşak', hint: '+4 güven' },
        { id: 'hard', label: 'Sert', hint: '−8 güven · daha az savunma' },
      ],
      toneEffects: {
        soft: [inc('trust', 4), set('tone', 'soft')],
        hard: [dec('trust', 8), set('tone', 'hard')],
      },
      moodRules: [
        mood('Açılıyor', 'success', 'uzgun', flag('halil_acildi')),
        mood('Savunmada', 'error', 'kizgin', cmp(v('trust'), '<', 45)),
        mood('Gergin', 'neutral', 'kizgin', cmp(v('tone'), '==', 'hard')),
        mood('Ölçülü', 'neutral', 'normal'),
      ],
      objectives: [
        objective(
          'obj_gece',
          flag('fact_gece'),
          'Halil o gece atölyede, otel siparişinin başındaydı.',
          'O gece neredeydi?',
        ),
        objective('obj_benzin', has('clue_jenerator'), 'Benzin jeneratör içindi; bidon atölyede.', 'Benzin ne içindi?'),
        objective(
          'obj_esya',
          flag('fact_esya'),
          'Usta odaların boşaltılmasını istemiş; sözleşme atölyede.',
          'Eşyaları neden taşıdı?',
        ),
        objective('obj_borc', has('clue_borc'), 'Borçları var; kızından sakladı.', 'Halil bir şey saklıyor mu?'),
      ],
      topics: [
        topic('TP_GECE', 'O gece', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_gece')],
          tones: {
            soft: {
              prompt: 'O geceyi anlatır mısınız? Acele etmeyin.',
              says: [
                s(
                  'halil',
                  'Atölyedeydim. Bir otelin kırk sandalyesi; pazartesi teslim. Otuz ikincisindeydim, hatırlıyorum.',
                ),
                s(
                  'halil',
                  'Son bir haftadır evde yatmıyordum zaten. Eşyaları taşımıştım; ev soğuktu, yarı boştu. Atölyede kanepe var.',
                ),
                s(
                  'halil',
                  'Sabah beşte bekçi çay getirdi. Yedide Zehra aradı. “Baba ev…” dedi, devamını getiremedi. Ben de getiremedim.',
                  'uzgun',
                ),
                th(
                  'Bir atölye bekçisi, sabah beşte bir çay. Kolluğun hiç sormadığı bir mazeret. Ama mazeret bu dosyanın asıl sorusu değil.',
                ),
              ],
            },
            hard: {
              prompt: 'Gece evden uzaktınız. Savcı soracak: o gece neden tam da orada değildiniz?',
              says: [
                s(
                  'halil',
                  'Neden orada değildim? Çünkü işim vardı! Evimde olsaydım yanacaktım, bu sefer de “neden evdeydi” diyeceklerdi.',
                  'kizgin',
                ),
                s('halil', 'Her şeyin bir “neden”i var bu dosyada. Bir tek yangının yok.', 'kizgin'),
                th('Sert soru, sert cevap. Ama son cümlesi doğruydu: kimse yangının nedenini sormamış.'),
              ],
            },
          },
        }),
        topic('TP_EV', 'Ev ve Nermin', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_ev'), raise('fact_elektrikci')],
          tones: {
            soft: {
              prompt: 'Biraz da evi anlatın. Nermin Hanım’ı.',
              says: [
                s(
                  'halil',
                  'Nermin’in dedesinin eviydi. Yüz yirmi yıllık. Tavanlarda göbek, kapılarda ceviz. Ben kumaşı bilirim; ahşabı Nermin bilirdi.',
                ),
                s(
                  'halil',
                  'Hastalandığında “bu evi bir elden geçir, Halil” dedi. Öldü. Ben de kredi çektim. Restorasyon. Ustasını buldum, elektrikçisini buldum.',
                ),
                s(
                  'halil',
                  'Necati Usta tesisata baktı. “Eski” dedi, “ilk iş bunu yenileyelim.” Ocakta başlayacaktık.',
                  'uzgun',
                ),
                th('Kredi, usta, elektrikçi. Bir kundakçının değil, bir müteahhidin takvimi. Ya da ikisinin birden.'),
              ],
            },
            hard: {
              prompt: 'Eski, bakımsız, pahalı bir ev. Satmak yerine neden kredi çektiniz?',
              says: [
                s('halil', 'Satmak mı? Nermin’in evini mi?', 'kizgin'),
                s(
                  'halil',
                  'Bir adamın karısının mezarını satmasını ister misiniz? O ev mezar değildi ama… Satmak aklımdan geçmedi.',
                  'kizgin',
                ),
                s('halil', 'Kredi çektim, usta buldum. Elektrikçi bile geldi baktı. Necati Usta. Sorun ona.'),
              ],
            },
          },
        }),
        topic('TP_BORC', 'Borç', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [discover('clue_borc')],
          tones: {
            soft: {
              prompt: 'İcra dosyalarını konuşmamız gerekiyor. Zehra iddianameden öğrenmiş.',
              effects: [raise('halil_acildi')],
              says: [
                n('Halil uzun süre ellerine baktı. Döşemecilerin elleri çatlak olur; tutkal, iğne, soğuk.'),
                s(
                  'halil',
                  'Pandemide iki otel siparişi iptal oldu. Kumaşı almıştım. Ödeyemedim. Atölyenin kirası birikti.',
                  'uzgun',
                ),
                s(
                  'halil',
                  'Zehra’ya söylemedim. Babasının borcunu taşımasın istedim. Anası öldü, bir de bunu mu taşısın?',
                  'uzgun',
                ),
                s(
                  'halil',
                  'Evi kredinin teminatı yaptım, borcu değil. Ayrı tuttum. Bir kumaşın iki yüzü gibi. Ama işte… iddianamede yan yana yazmışlar.',
                ),
                th('Utanç insanı susturur. Halil iki aydır susuyor; borcu için değil, kızı için.'),
              ],
            },
            hard: {
              prompt: 'Seksen dört bin lira borç. Savcıya göre evi bunun için yaktınız. Cevabınız?',
              says: [
                s(
                  'halil',
                  'Seksen dört bin. Evi bir milyon sekiz yüze sigortalıymış. Savcının matematiği iyi.',
                  'kizgin',
                ),
                s('halil', 'Borç var, evet. Utandım, saklamadım; söylemedim. İkisi aynı şey değil.', 'kizgin'),
                th('“Saklamadım; söylemedim.” Bir döşemecinin ince ayrımı. Mahkemede bunu anlatmak zor olacak.'),
              ],
            },
          },
        }),
        topic('TP_BENZIN', 'Benzin', {
          visibleWhen: any(has('clue_bidon'), visited('INV_SAADET'), visited('INV_BILIRKISI')),
          cost: costOf('min', 2),
          score: { SORGULAMA: 30 },
          effects: [discover('clue_jenerator')],
          tones: {
            soft: {
              prompt: 'Cüzdanınızdan çıkan fiş. Beş litre benzin. Anlatın.',
              says: [
                s(
                  'halil',
                  'Sanayide elektrik kesiliyor. Haftada iki üç kere. Otel siparişi yetişecek; makine durursa iş durur.',
                ),
                s(
                  'halil',
                  'Jeneratör aldım, küçük bir şey. Benzinle çalışıyor. On ikisinde istasyondan bidonla aldım. Bir litre koydum, gerisi duruyor.',
                ),
                s(
                  'halil',
                  'Bidon atölyede, jeneratörün yanında. Kırmızı. Polis bir kere sorsaydı gösterirdim. Kimse sormadı.',
                ),
                th('Kimse sormadı. Bu dosyanın imzası bu cümle olabilir.'),
              ],
            },
            hard: {
              prompt: 'Yangından üç gün önce bidonla benzin. Tesadüf mü?',
              says: [
                s('halil', 'Tesadüf değil; ihtiyaç. Elektrik kesiliyor, jeneratöre benzin koyuyorum.', 'kizgin'),
                s('halil', 'Bidon atölyede. Gidin bakın. Ölçün. Eksikse beni asın.', 'kizgin'),
              ],
            },
          },
        }),
        topic('TP_ESYA', 'Eşyalar', {
          visibleWhen: any(has('clue_esyalar'), visited('INV_SAADET')),
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_esya')],
          tones: {
            soft: {
              prompt: 'Yangından bir hafta önce eşyaları taşımışsınız. Neden?',
              says: [
                s(
                  'halil',
                  'Usta istedi. “Odaları on beşine kadar boşalt” dedi. Sözleşmede yazıyor; atölyenin duvarına astım.',
                ),
                s(
                  'halil',
                  'Hepsini değil. Nermin’in sandığını, babamın konsolunu, dikiş makinesini. Gerisi kaldı: yataklar, dolaplar, mutfak.',
                ),
                s(
                  'halil',
                  'Kalanların değeri daha çoktu aslında. Yeni koltuklar, televizyon, buzdolabı. Onlar yandı. Sandık kurtuldu.',
                  'uzgun',
                ),
                th(
                  'Değerli olanı değil, sevdiği olanı taşımış. Bir kundakçı bu ikisini karıştırmaz. Ama bunu ispat etmek için bir kâğıt lazım.',
                ),
              ],
            },
            hard: {
              prompt:
                'Değerli eşyaları yangından bir hafta önce çıkarmışsınız. Savcı bunu nasıl okur, biliyor musunuz?',
              says: [
                s('halil', 'Değerli mi? Bir çeyiz sandığı. Bit pazarında üç yüz lira etmez.', 'kizgin'),
                s('halil', 'Usta istedi, taşıdım. Sözleşme atölyede. Okuyun.'),
              ],
            },
          },
        }),
        topic('TP_ARTIS', 'Teminat artışı', {
          visibleWhen: any(has('clue_kampanya'), visited('INV_POLICE')),
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_artis')],
          tones: {
            soft: {
              prompt: 'Teminat yangından on iki gün önce artmış. Bunu siz mi istediniz?',
              says: [
                s(
                  'halil',
                  'Ben mi? Acente aradı. Kader Hanım. “Restorasyondan sonra ev değerlenecek, şimdiden yükseltelim, kampanya var” dedi.',
                ),
                s('halil', 'Prim farkı aylık iki yüz lira bir şey. “Olur” dedim. Sigortacıya “olur” demek suç mu?'),
                th(
                  'Kim aradı? Bu soru, telefon şirketinin değil acentenin kayıtlarında. Acentenin kayıtları, acentenin aleyhine de konuşur mu?',
                ),
              ],
            },
            hard: {
              prompt: 'On iki gün önce artış. Bunu nasıl açıklayacaksınız?',
              says: [
                s(
                  'halil',
                  'Ben açıklamam; acente açıklasın. O aradı. Ben poliçe okumayı bilmem; kumaş okurum.',
                  'kizgin',
                ),
              ],
            },
          },
        }),
        topic('TP_ELEKTRIK', 'Elektrik', {
          visibleWhen: any(has('clue_buat'), has('clue_baslangic')),
          cost: costOf('min', 2),
          score: { SORGULAMA: 30 },
          effects: [raise('fact_elektrikci')],
          tones: {
            soft: {
              prompt: 'Koridordaki buat. Evin elektriğiyle ilgili bir sorun var mıydı?',
              says: [
                s(
                  'halil',
                  'Koridordaki kutu ısınırdı. Kışın sobanın yanında televizyon, su ısıtıcısı bir arada olunca sigorta atardı.',
                ),
                s(
                  'halil',
                  'Necati Usta baktı, “ağır yük çekme, ocakta hepsini yeniliyoruz” dedi. Ben de çekmedim. Zaten evde değildim ki son hafta.',
                ),
                s(
                  'halil',
                  'Bir şey daha… O gece sokağın lambaları gidip geldi diyorlar. Saadet Hanım’ın televizyonu yanmış. Zehra söyledi.',
                ),
                th(
                  'Sokak lambaları gidip gelmiş. Bir televizyon yanmış. Bunlar bir rapor değil; dedikodu. Ama dedikodunun da bir kaydı olur.',
                ),
              ],
            },
            hard: {
              prompt: 'Tesisatın kötü olduğunu biliyordunuz. Bu da sizi suçlu yapmaz mı?',
              says: [
                s('halil', 'Biliyordum. Yaptırıyordum. Usta takvime koydu. Daha ne yapacaktım?', 'kizgin'),
                th(
                  '“Biliyordum.” Savcının ağzında bu kelime başka bir suçun anahtarı olabilir. Halil’in ağzında bir kapı aralığı.',
                ),
              ],
            },
          },
        }),
        topic('TP_SANDIK', 'Çeyiz sandığı', {
          visibleWhen: has('clue_esyalar'),
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          tones: {
            soft: {
              prompt: 'Atölyede Nermin Hanım’ın sandığını gördüm. Zehra da gördü.',
              says: [
                s('halil', 'Gördü mü? Açtı mı?', 'saskin'),
                me('Açmadı. Elini kapağına koydu, bekledi.'),
                s(
                  'halil',
                  'Nermin de öyle yapardı. Açmadan önce bir dakika eli kapakta dururdu. “Sandık sabır ister” derdi.',
                  'uzgun',
                ),
                s(
                  'halil',
                  'Evi boşalttım, ev de gitti. Bazen düşünüyorum: ben taşımasaydım o sandık da yanardı. Yansaydı… belki kimse bana “değerli eşyalarını çıkarmış” demezdi.',
                  'uzgun',
                ),
                th(
                  'Bir adam, kurtardığı tek şey yüzünden suçlanıyor. Savcının dilinde “değerli”; onun dilinde “sevdiği.”',
                ),
              ],
            },
            hard: {
              prompt: 'Savcı o sandığı “değerli eşya” diye yazdı. Değerli mi?',
              says: [s('halil', 'Değerli. Hiçbir sigortanın ödemeyeceği kadar değerli. Yazsınlar.', 'kizgin')],
            },
          },
        }),
        topic('TP_ZEHRA', 'Zehra', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 10 },
          tones: {
            soft: {
              prompt: 'Zehra sizin için çok endişeli. Onunla konuşabiliyor musunuz?',
              says: [
                s('halil', 'Ziyarete geliyor. Oturuyoruz. O bana bakıyor, ben ona. Konuşmuyoruz.', 'uzgun'),
                s(
                  'halil',
                  'Annesi ölünce ben onun babası olmaktan çıktım, avukat hanım. Bir hemşireye dönüştü; bana bakıyor. Ben de bakılmaya alıştım.',
                ),
                s(
                  'halil',
                  'Borcu ona söyleyemedim. Söylesem “baba neden bana söylemedin” diyecek. Söylemesem savcı söyleyecek. Savcı söyledi işte.',
                ),
                th('Bir baba kızına borcunu söyleyemiyor; bir kız babasına kuşkusunu. Aynı masada, iki sessizlik.'),
              ],
            },
            hard: {
              prompt: 'Kızınız iddianameden öğrendi borcunuzu. Bunu neden yaptınız?',
              says: [
                s(
                  'halil',
                  'Utandım. Bu kadar. Bir baba kızına “borçluyum” diyemez. Siz kızınıza diyebilir misiniz?',
                  'kizgin',
                ),
                th('Sert soru bir kapıyı daha kapattı. Ama arkasındaki odayı gösterdi: utanç.'),
              ],
            },
          },
        }),
      ],
      finish: { id: 'G_BITIR' },
    }),
    conversation('INV_SAADET', {
      ...INV1,
      title: 'Kalem Sokak 7',
      background: 'ev',
      room: { label: 'KALEM SOKAK 7 · SAADET KORU', character: 'saadet' },
      onFirstEnter: [meet('saadet')],
      lines: [
        {
          lines: [
            card('KALEM SOKAK 7 — SAADET HANIM', 'ev'),
            n(
              'Kapıyı açmadan önce perdeyi araladı, bana baktı, kapıyı açtı. Ayağının dibinde iki kedi; biri tekir, biri kör.',
            ),
            s(
              'saadet',
              'Halil’in avukatı! Gördüm seni dün, evin önünde. Gel kızım, gel. Ayakkabılarını çıkarma, ben zaten silmedim.',
            ),
            n(
              'Oturma odası dantel, soba ve naftalin kokuyordu. Pencerenin tam karşısında yanık ev; bir tablo gibi çerçevelenmiş.',
            ),
            s(
              'saadet',
              'Kırk yıl tütün ayıkladım ben. Gözlerim gitti, burnum kaldı. Burnum köpek gibidir. Neyse, çay koyayım. Polise her şeyi söyledim ama, onlar yazdı, ben imzaladım.',
            ),
            th('“Onlar yazdı, ben imzaladım.” Bir tanık ifadesinin en dürüst özeti. Ve en tehlikelisi.'),
          ],
        },
      ],
      choices: [
        option('SA_GECE', 'O geceyi baştan anlatır mısınız? Ne gördüyseniz.', {
          discovers: 'clue_saadet_fener',
          score: { SORGULAMA: 40 },
          effects: [raise('fact_tv')],
          responses: [
            {
              lines: [
                s(
                  'saadet',
                  'Uyuyamıyorum ben, kızım. Gece biri sularında pencereden baktım. Halil’in kapısında el fenerli biri. Kapıyı yokladı, gitti.',
                ),
                me('Yüzünü gördünüz mü?'),
                s(
                  'saadet',
                  'Yok. Yağmur, karanlık. Boyu posu Halil gibiydi. Polis “Halil miydi” dedi, “olabilir” dedim. Olabilir yani.',
                ),
                s(
                  'saadet',
                  'Sonra yattım. Bir ara televizyonum “pat” dedi, karardı. Kızdım, fişini çektim. Sonra bir baktım, karşıda turuncu bir ışık…',
                ),
                th(
                  'El fenerli biri, “olabilir.” Bir de bir televizyon, “pat.” İkisi de ifade tutanağına girmemiş; biri girmiş, biri girmemiş.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('SA_KOKU', 'Kokuyu kendi kelimelerinizle tarif eder misiniz?', {
          score: { SORGULAMA: 50 },
          effects: [raise('saadet_koku')],
          good: 'Açık uçlu soru: tanığın kendi algısını, kendi kelimeleriyle aldın; telkin yok.',
          responses: [
            {
              lines: [
                s(
                  'saadet',
                  'Keskindi. Boğaz yakan. Plastik gibi… yanık kablo gibi. Hani eski evlerde sigorta atınca bir koku olur ya.',
                ),
                me('Polise ne dediniz?'),
                s(
                  'saadet',
                  'Polis “teyze benzin kokusu gibi mi” dedi. Ben de “evet, öyle bir şey” dedim. Ne bileyim, keskin işte.',
                ),
                th(
                  'Bir polis bir kelime önerdi; bir tanık o kelimeyi kabul etti. Tutanakta yalnızca kabul eden görünüyor.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('SA_TELKIN', 'Benzin değil de kablo kokusuydu, öyle değil mi Saadet Hanım?', {
          score: { SORGULAMA: -40 },
          effects: [raise('saadet_telkin'), inc('ethics')],
          bad: 'Tanığa cevabı sen verdin. Telkin edici soru, tanığın beyanını avukatın sözüne çevirir; duruşmada savcı bunu ortaya çıkarır ve tanığın güvenilirliğiyle birlikte seninkini de götürür (Av.K. 34, TBB Meslek Kuralları).',
          responses: [
            {
              lines: [
                s('saadet', 'Kablo mu? Olabilir. Sen öyle diyorsan öyledir kızım. Avukat bilir.'),
                th(
                  '“Sen öyle diyorsan.” Tanığa cevabı verdim. Şimdi o cevap benim; onun değil. Savcı bunu bir gün soracak.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('SA_ESYA', 'Halil Bey’in o hafta eşya taşıdığını söylemişsiniz.', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_teneke_saadet')],
          responses: [
            {
              lines: [
                s(
                  'saadet',
                  'Taşıdı. Bir kamyonetle. Sandık, konsol, bir de dikiş makinesi. Nermin’in makinesi. Gözüm doldu.',
                ),
                s(
                  'saadet',
                  'Bir gün de elinde kırmızı bir bidon gördüm, arabasına koydu. Polise söyledim; “benzin bidonu” diye yazdılar.',
                ),
                s(
                  'saadet',
                  'Bir de yangının sabahı, dokuz gibi, şık bir adam geldi. Takım elbiseli. Elinde iki teneke, omzunda bir çanta. Girdi, çıktı. Onu kimse sormadı.',
                ),
                th(
                  'Şık bir adam, iki teneke. Polisin sormadığı bir cümle daha. Saadet Hanım’ın tanıklığı bir çuval gibi: içinden ne çıkacağı, kimin elini soktuğuna bağlı.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('SA_NERMIN', 'Nermin Hanım’ı iyi tanır mıydınız?', {
          score: { SORGULAMA: 10 },
          responses: [
            {
              lines: [
                s(
                  'saadet',
                  'Kırk yıl. Kız kardeşim gibiydi. Son aylarında yanına gitmek istedim; Halil “yorulur” dedi, bırakmadı.',
                  'uzgun',
                ),
                s(
                  'saadet',
                  'Küstüm ona. Cenazede bile konuşmadım. Şimdi adam içeride, ben dışarıda. Kim haklı, bilmiyorum artık.',
                  'uzgun',
                ),
                th('Bir küslük, bir tanıklık. İkisi aynı kadının içinde. Mahkemede hangisi konuşacak?'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('SA_BEKCI', 'Geceleri sokağı kim bekler?', {
          score: { SORGULAMA: 20 },
          responses: [
            {
              lines: [
                s(
                  'saadet',
                  'Cevdet. Bekçimiz. Düdüğünü duyarım her gece. Yangın sabahı da şeridin başında o duruyordu, defteriyle.',
                ),
                th('Bir bekçi, bir defter. Olay yerini o sabah bekleyen biri, kapıdan kimin girdiğini de bilir.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('SA_BITIR', 'Çay için teşekkür et', { next: '$return' }),
      ],
    }),
    conversation('INV_CEVDET', {
      ...INV1,
      title: 'Bekçi kulübesi',
      background: 'sokak_karanlik',
      room: { label: 'MURADİYE · BEKÇİ KULÜBESİ', character: 'cevdet' },
      onFirstEnter: [meet('cevdet')],
      lines: [
        {
          lines: [
            card('MURADİYE MEYDANI — BEKÇİ KULÜBESİ, 20.10', 'sokak_karanlik'),
            n(
              'Kulübe bir telefon kulübesinden biraz büyüktü. İçeride bir soba, bir telsiz, bir defter, bir termos. Cam buğuluydu.',
            ),
            s(
              'cevdet',
              'Avukat hanım. Buyurun. Amirim haberdar mı? … Değil. Peki. Ne soracaksanız sorun, ama ben ne yazdıysam o.',
            ),
            n('Defteri göğsüne bastırdı; bir kalkan gibi.'),
          ],
        },
      ],
      choices: [
        option('CV_GECE', 'O gece devriyenizi anlatır mısınız?', {
          discovers: 'clue_devriye',
          score: { SORGULAMA: 30 },
          responses: [
            {
              lines: [
                s(
                  'cevdet',
                  'Bir buçukta Kalem Sokak’tan geçtim. Dokuz numaranın kapısını yokladım; kilitliydi. Işık yoktu. Fenerle baktım, gittim.',
                ),
                s(
                  'cevdet',
                  'İkiyi çeyrek geçe telsiz: yangın. Koştum. İtfaiye geldi, ben komşuları çıkardım. Saçaktaki aileyi ben indirdim.',
                ),
                th(
                  'El fenerli biri, bir buçukta, kapıyı yoklayan. Saadet Hanım’ın “olabilir”i bir bekçinin rutin turu olabilir.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('CV_SABAH', 'Sabah olay yerini siz beklemişsiniz. Kim girdi, kim çıktı?', {
          discovers: ['clue_eksper_giris', 'ev_cizelge'],
          score: { ARASTIRMA: 60 },
          responses: [
            {
              lines: [
                s(
                  'cevdet',
                  'Beşte polis şeridi çekti, “Cevdet sen bekle” dedi. Bekledim. Onda polis geldi, teslim ettim.',
                ),
                me('Arada kimse girdi mi?'),
                n('Cevdet defteri açtı. Bir sayfada durdu. Parmağıyla bir satırı gösterdi; parmağı titriyordu.'),
                s(
                  'cevdet',
                  '“Dokuz yirmi, sigorta eksperi T.S. olay yerine girdi. On sıfır beş çıktı.” Kartını gösterdi. “Şirket gönderdi, acil” dedi.',
                ),
                s('cevdet', 'Polis yoktu yanında. Ben kapıda kaldım. Yazdım ama. Defter yalan söylemez.'),
                n(
                  'Defterin o sayfasının fotokopisini çekmeme izin verdi. Telefonumun flaşı kulübenin içini bir an beyaza kesti.',
                  { fx: 'flash' },
                ),
                th(
                  '09.20–10.05. Muhafaza altındaki bir olay yeri. Kolluksuz bir eksper. Kırk beş dakika. Bu satırı aylarca kimse okumamış.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('CV_TANIK', 'Bunu mahkemede anlatır mısınız?', {
          responses: [
            {
              lines: [
                s('cevdet', 'Mahkemede mi? Amirim ne der? Şeridin altından adam soktum diye başım yanar.', 'uzgun'),
                s('cevdet', 'Ama çağrılırsam gelirim. Yalan söyleyemem. Defter benim el yazım.'),
                th('Çağrılırsa gelecek. Çağırmak benim işim; ona ne söyleyeceğini söylemek değil.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option(
          'CV_YONLENDIR',
          'Mahkemede, eksperin içeride bir şeyler döktüğünü gördüğünüzü söylerseniz çok işimize yarar.',
          {
            score: { SORGULAMA: -60 },
            effects: [raise('cevdet_telkin'), inc('ethics')],
            bad: 'Tanığa görmediği bir şeyi söylemesini önerdin. Bu, yalan tanıklığa azmettirme sınırıdır (TCK 272, 38) ve meslek kuralının açık ihlalidir (Av.K. 34). Tanığa ne söyleyeceği söylenmez.',
            responses: [
              {
                lines: [
                  s(
                    'cevdet',
                    'Görmediğim bir şeyi mi? Avukat hanım, ben görmedim. İçeri girmedim ki. Ne döktüğünü bilmiyorum.',
                    'kizgin',
                  ),
                  s('cevdet', 'Defterimde ne varsa onu söylerim. Fazlasını değil.'),
                  th(
                    'Bir bekçi bana kendi mesleğimi öğretti. Utandım. Utanç bir şey değil; bunu birinin daha duyması bir şey.',
                  ),
                ],
              },
            ],
            next: '$stay',
          },
        ),
        option('CV_BITIR', 'Teşekkür et ve çık', { next: '$return' }),
      ],
    }),
    conversation('INV_NECATI', {
      ...INV1,
      title: 'Necati Usta',
      background: 'depo',
      room: { label: 'SETBAŞI · ELEKTRİKÇİ DÜKKÂNI', character: 'necati' },
      onFirstEnter: [meet('necati')],
      lines: [
        {
          lines: [
            card('SETBAŞI — NECATİ ELEKTRİK, 11.30', 'depo'),
            n(
              'Dükkân bir kablo mağarası gibiydi. Tavandan sarkan kangallar, raflarda sigortalar, bir köşede yarı sökülmüş bir avize.',
            ),
            s(
              'necati',
              'Halil’in avukatı. Geç kaldınız, kızım. İki aydır biri gelsin diye bekliyorum. Kimse gelmedi; ben de kimseye gitmedim.',
            ),
            n('Ağzında bir kablo parçası çiğniyordu. Sigarayı bırakalı on yıl olmuş; kabloyu bırakamamış.'),
          ],
        },
      ],
      choices: [
        option('NC_KESIF', 'Evin tesisatına keşif yapmışsınız. Ne buldunuz?', {
          discovers: 'clue_necati',
          score: { ARASTIRMA: 60 },
          responses: [
            {
              lines: [
                s(
                  'necati',
                  'Aralıkta baktım. Tesisat yaşlı adam gibidir, kızım. Kendi kendine ölmez; biri omzuna yük bindirirse ölür.',
                ),
                s(
                  'necati',
                  'Bez kaplı kablolar, porselen sigortalar. Koridordaki buat ısınmıştı; kapağı sararmıştı. Kaçak akım rölesi yok.',
                ),
                s(
                  'necati',
                  'Yazdım: “Yenileme restorasyonun ilk haftası. O zamana kadar ağır yük çekmeyin.” Bir kopyası bende.',
                ),
                n('Çekmeceden kareli bir kâğıt çıkardı. El yazısı, bir tarih, bir imza. Fotoğrafını çektim.'),
                th('“Koridordaki buat ısınmıştı.” Bilirkişi raporunda bu buatın adı bile geçmiyor.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('NC_ACIL', 'Acil miydi? Hemen kesilmesi gerekir miydi?', {
          score: { SORGULAMA: 40 },
          effects: [raise('fact_acil_degil')],
          responses: [
            {
              lines: [
                s(
                  'necati',
                  'Acil değildi. Öyle olsaydı elektriği keserdim, giderdim. Bin tane eski ev var Muradiye’de, hepsi böyle.',
                ),
                s(
                  'necati',
                  'Normal kullanımda yıllarca gider. Ama dışarıdan bir şey gelirse, gerilim falan… o zaman bu evler mum gibi yanar.',
                  'uzgun',
                ),
                th(
                  '“Dışarıdan bir şey gelirse.” Bir elektrikçinin varsayımı. Ama bir varsayım, bir kayıtla buluşursa delil olur.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('NC_SUC', 'Halil Bey’e “acil değil” dediğiniz için kendinizi sorumlu hissediyor musunuz?', {
          responses: [
            {
              lines: [
                s('necati', 'Her gece. Her gece düşünüyorum. “Kes elektriği Halil” deseydim…', 'uzgun'),
                s(
                  'necati',
                  'Ama doğrusu buydu. Otuz beş yıldır bu işi yapıyorum. O tesisat o gece kendi kendine yanmaz. Bir şey oldu o gece.',
                ),
                th(
                  'Suçluluk dürüst insanları ya susturur ya fazla konuşturur. Necati Usta’yı tanıklığa hazırlarsam, bu ikisinin arasında yürümesi gerekecek.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('NC_BITIR', 'Teşekkür et ve çık', { next: '$return' }),
      ],
    }),
    conversation('INV_KADER', {
      ...INV1,
      title: 'Sigorta acentesi',
      background: 'buro',
      room: { label: 'ACAR SİGORTA ARACILIK', character: 'kader' },
      onFirstEnter: [meet('kader')],
      lines: [
        {
          lines: [
            card('ALTIPARMAK — ACAR SİGORTA ARACILIK, 15.00', 'buro'),
            n(
              'Cam vitrinde kocaman bir şemsiye logosu: “Güvende olun.” İçeride iki masa, bir yazıcı, bir kahve makinesi, bir saksı plastik çiçek.',
            ),
            s(
              'kader',
              'Avukat hanım, hoş geldiniz! Kahve? Halil Bey’in dosyası değil mi? Çok üzüldük. Şirket de tabii, süreç işliyor…',
            ),
            th('“Süreç işliyor.” Bir insanın iki aydır cezaevinde olmasının sigortacılıktaki adı.'),
          ],
        },
      ],
      choices: [
        option('KD_ARTIS', 'Teminat artışını kim istedi? Kayıtlarınızda ne yazıyor?', {
          discovers: ['clue_cagri', 'ev_cagri'],
          score: { ARASTIRMA: 60 },
          responses: [
            {
              lines: [
                s(
                  'kader',
                  'Savcılıkta söyledim zaten: müşteri talep etti. Yani… şöyle; görüşme oldu, müşteri kabul etti.',
                ),
                me('Görüşmeyi kim başlattı? Sisteminizde arama yönü görünür.'),
                n('Kader’in gülümsemesi bir an sabit kaldı. Sonra ekrana döndü, iki tıklama yaptı.'),
                s(
                  'kader',
                  'Abla bizde her şey sistemde. Üç ocak, on bir on iki, giden arama. Kampanya notu: “restorasyon değer artışı teklif edildi, kabul.”',
                  'saskin',
                ),
                s('kader', 'Kampanyaydı. Bütün portföyü aradık. Prim hedefi… yani, normal şeyler.'),
                n('Çıktıyı yazıcıdan aldı, bir an tuttu, sonra bana uzattı.'),
                th(
                  '“Müşteri talep etti” ile “biz aradık, kabul etti” arasında bir kelime var: kim. Savcılık ifadesinde o kelime eksik.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('KD_POLICE', 'Poliçe neden yapıldı? Halil Bey sigorta mı aradı?', {
          score: { SORGULAMA: 30 },
          responses: [
            {
              lines: [
                s(
                  'kader',
                  'Banka yönlendirdi. Kredi için yangın sigortası şart. Biz bankanın anlaşmalı acentesiyiz, her ay yirmi tane gelir.',
                ),
                s(
                  'kader',
                  'Dain-i mürtehin de banka tabii. Hasar ödenirse önce kredinin kalanı bankaya gider. Standart.',
                ),
                th('Standart. Savcının “kırk yedi gün önce” dediği şey, bir bankanın standart formu.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('KD_EKSPER', 'Hasar ihbarından sonra eksper nasıl atandı?', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_eksper_hizli')],
          responses: [
            {
              lines: [
                s(
                  'kader',
                  'İhbarı öğlen ikide girdim. Ama eksper zaten sabah olay yerindeymiş. Şirket gece haber almış, bölge müdürlüğü göndermiş.',
                ),
                s('kader', 'Tarık Bey. Hızlıdır. Büyük dosyalara o bakar. Şirket onu sever.'),
                th(
                  'İhbar öğlen ikide. Eksper sabah dokuz yirmide. Bir eksper, ihbardan beş saat önce olay yerinde. Hızlı, evet.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('KD_BITIR', 'Teşekkür et ve çık', { next: '$return' }),
      ],
    }),
  ],
};
