import { chosen, has, rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 30-scenes: dört olay yeri / inceleme sahnesi. Görseller scenes/<ad>.html'den `npm run case:scenes -- liman-gecesi` ile
// üretilir; #scene boyutu 344 × 300. Şekil sabitleri golden path'te `t OB_…` için dışa aktarılır.

// Rıhtım 4 (olay yeri fotoğrafları)
export const OB_BABA = rect(40, 160, 54, 70);
export const OB_PROJ = rect(256, 24, 40, 96);
export const OB_KAFES = rect(150, 150, 84, 60);
export const OB_MATARA = rect(98, 214, 26, 26);
export const OB_MARTI = rect(196, 56, 34, 24);
export const OB_KAYNAK = rect(8, 252, 64, 32);

// B sahası
export const OB_SURUK = rect(150, 196, 64, 44);
export const OB_LASTIK = rect(30, 236, 96, 40);
export const OB_PAMUK = rect(226, 212, 28, 24);
export const OB_KANYOL = rect(262, 104, 72, 44);
export const OB_KEDI = rect(300, 248, 32, 30);
export const OB_PALET = rect(14, 120, 64, 40);

// İskele büfesi
export const OB_ZRAPOR = rect(204, 150, 56, 32);
export const OB_AKIS = rect(36, 56, 64, 74);
export const OB_KAMERA = rect(282, 16, 32, 26);
export const OB_TABURE = rect(120, 222, 44, 58);

// Emanet fotoğrafları
export const OB_KONI = rect(56, 116, 96, 72);
export const OB_MONT = rect(196, 76, 104, 124);
export const OB_ETIKET = rect(16, 240, 84, 30);
export const OB_ELDIVEN = rect(250, 228, 64, 42);

const decoy = (text: string, short: string) => ({ score: { ARASTIRMA: -10 }, text, short });

export const scenes: CasePart = {
  scenes: [
    sceneDef('sc_rihtim', {
      title: '4 no’lu rıhtım · olay yeri fotoğrafları',
      description: '15 Kasım 06.40, flaşla çekilmiş 41 fotoğraf.',
      width: 344,
      height: 300,
      image: 'img_rihtim',
      objects: [
        sceneObject('ob_baba', 'Baba 7', OB_BABA, {
          discovers: 'clue_baba_kan',
          score: { ARASTIRMA: 60 },
          text: 'Kan, babanın gövdesinde, yerden kırk santim yukarıda; damla damla, aşağı doğru. Tepesinde ne kan ne saç. Oturan birinin burnundan akmış gibi.',
          short: 'Kan oturma hizasında',
        }),
        sceneObject('ob_proj', 'Projektör direği', OB_PROJ, {
          discovers: 'clue_projektor',
          score: { ARASTIRMA: 60 },
          text: 'Direğin dibinde sarı bir etiket, flaşta parlıyor: “14/11 · 23.00–02.00 · BAKIM · ENERJİ YOK.” O gece B sahasının ışıkları sönüktü.',
          short: 'Bakım etiketi',
        }),
        sceneObject('ob_kafes', 'Laşing kafesi', OB_KAFES, {
          discovers: 'clue_kafes',
          score: { ARASTIRMA: 20 },
          text: 'Tel kafeste yığılı yüzlerce kilit. Hepsi aynı: yarı otomatik, sarı boyalı SA-2. Emanetteki kilidin boş yeri kafesin önünde, tebeşirle çizilmiş.',
          short: 'SA-2 kilitleri',
        }),
        sceneObject('ob_matara', 'Matara', OB_MATARA, {
          discovers: 'clue_matara',
          score: { ARASTIRMA: 10 },
          text: 'Babanın dibinde yarısı boş bir matara. Kapağı açık. Fotoğrafçı yanına “anason kokusu” yazmış.',
          short: 'Rakı matarası',
        }),
        sceneObject(
          'ob_marti',
          'Martı tüyü',
          OB_MARTI,
          decoy('Islak bir martı tüyü. Limanda martı tüyü delil değildir; hava durumudur.', 'Martı tüyü'),
        ),
        sceneObject(
          'ob_kaynak',
          'Eski kaynak lekesi',
          OB_KAYNAK,
          decoy(
            'Rıhtımın betonunda paslı kaynak lekeleri. Yıllar önceden kalma; o geceyle ilgisi yok.',
            'Kaynak lekesi',
          ),
        ),
      ],
    }),
    sceneDef('sc_bsaha', {
      title: 'B sahası · cesedin bulunduğu yer',
      description: '15 Kasım 06.55, iki konteynerin arası.',
      width: 344,
      height: 300,
      image: 'img_bsaha',
      objects: [
        sceneObject('ob_suruk', 'İki paralel iz', OB_SURUK, {
          discovers: 'clue_surukleme',
          score: { ARASTIRMA: 60 },
          text: 'Islak tozda iki paralel çizgi, konteynerlerin arasına uzanıyor. Topuk izi. Biri bir bedeni koltuk altlarından tutup geri geri çekmiş.',
          short: 'Sürüklenme izi',
        }),
        sceneObject('ob_lastik', 'Asfalttaki iz', OB_LASTIK, {
          discovers: 'clue_lastik',
          score: { ARASTIRMA: 60 },
          text: 'Taze, çift tekerli bir dönüş izi; çamurlu sırtları henüz yağmurla dağılmamış. Forkliftin tek lastiği var. Bu bir kamyonet.',
          short: 'Çift lastik izi',
        }),
        sceneObject('ob_pamuk', 'Pamuk', OB_PAMUK, {
          discovers: 'clue_pamuk',
          score: { ARASTIRMA: 20 },
          text: 'Cesedin elinin yanında kanlı, buruşmuş bir pamuk tampon. Biri burnuna pamuk tıkamış; kavgadan sonra bir yerde oturup kendine bakmış.',
          short: 'Burun tamponu',
        }),
        sceneObject('ob_kanyol', 'Rıhtıma giden yol', OB_KANYOL, {
          discovers: 'clue_kan_yolu',
          score: { ARASTIRMA: 20 },
          text: 'Ekip rıhtımdan B sahasına kadar her metreyi fotoğraflamış: on dört kare, tek damla kan yok.',
          short: 'Yolda kan yok',
        }),
        sceneObject(
          'ob_kedi',
          'Kedi',
          OB_KEDI,
          decoy(
            'Konteynerin altından bakan bir liman kedisi. Fotoğrafçıya dönmüş; o gece onun da bir ifadesi alınmamış.',
            'Kedi',
          ),
        ),
        sceneObject(
          'ob_palet',
          'Kırık palet',
          OB_PALET,
          decoy('Kırık bir ahşap palet. Haftalardır orada; üstünde yosun.', 'Palet'),
        ),
      ],
    }),
    sceneDef('sc_bufe', {
      title: 'İskele büfesi',
      description: 'Mudanya iskelesi, kırk yıllık büfe.',
      width: 344,
      height: 300,
      image: 'img_bufe',
      objects: [
        sceneObject('ob_zrapor', 'Çekmece', OB_ZRAPOR, {
          // Kırk yıllık fiş yığınında doğru günü ve satırı bulmak için bankanın saati ve tutarı gerekir.
          activeWhen: has('ev_hesap'),
          discovers: 'clue_pos',
          score: { ARASTIRMA: 60 },
          text: 'Bankanın satırını gösterdim: 23.37, otuz lira. Nail Usta lastikli gün sonu fişlerini çözdü. 14 Kasım: “23.37 · KART · 2 ÇAY · 30,00.” Terminal adı: MDN ISKELE GIDA.',
          short: 'Gün sonu fişi',
        }),
        sceneObject('ob_akis', 'Yayın akışı', OB_AKIS, {
          // Akışın anlamı ancak Nail Usta çocuğun ne zaman kalktığını anlattıktan sonra belli olur.
          activeWhen: chosen('NL_SAAT'),
          discovers: 'clue_radyo',
          score: { ARASTIRMA: 40 },
          text: 'Duvarda raptiyeyle tutturulmuş bir radyonun yayın akışı. “00.00 Gece Haberleri.” Nail Usta parmağıyla vurdu: “Haberler başladı, çocuk hâlâ oradaydı.”',
          short: 'Gece haberleri',
        }),
        sceneObject(
          'ob_kamera',
          'Kamera',
          OB_KAMERA,
          decoy(
            '“Kamerayla izlenmektedir.” Kameranın kablosu yok. Nail Usta güldü: “Hırsız okuma bilir, kablo bilmez.”',
            'Sahte kamera',
          ),
        ),
        sceneObject(
          'ob_tabure',
          'Tabure',
          OB_TABURE,
          decoy('İskeleye bakan alçak bir tabure. Kimse oturmuyor. Islak.', 'Tabure'),
        ),
      ],
    }),
    sceneDef('sc_emanet', {
      title: 'Emanet fotoğrafları',
      description: 'Adliye emanet bürosu, kâtip huzurunda.',
      width: 344,
      height: 300,
      image: 'img_emanet',
      objects: [
        sceneObject('ob_koni', 'Kilidin konisi', OB_KONI, {
          discovers: 'clue_koni',
          score: { ARASTIRMA: 60 },
          text: 'Fotoğrafta kilidin yanında bir cetvel. Koninin tabanı 2,6 santim. Nihai rapordaki kırık 3,2.',
          short: 'Koni 2,6 cm',
        }),
        sceneObject('ob_mont', 'Mont', OB_MONT, {
          discovers: 'clue_mont',
          score: { ARASTIRMA: 40 },
          text: 'Tarık’ın lacivert montu. Sağ kolda üç kurumuş damla. Sıçrama yok, sürtünme yok, yaka temiz.',
          short: 'Üç damla',
        }),
        sceneObject(
          'ob_etiket',
          'Emanet etiketi',
          OB_ETIKET,
          decoy('Emanet etiketi: tarih, numara, kâtibin parafı. Usule uygun; sorun yok.', 'Etiket'),
        ),
        sceneObject(
          'ob_eldiven',
          'İş eldiveni',
          OB_ELDIVEN,
          decoy('Tarık’ın iş eldiveni. Yağ ve pas. Laşing işçisinin eldiveni hep böyledir.', 'Eldiven'),
        ),
      ],
    }),
  ],
  assets: [
    sceneAsset('img_rihtim', 'olay-yeri'),
    sceneAsset('img_bsaha', 'b-sahasi'),
    sceneAsset('img_bufe', 'bufe'),
    sceneAsset('img_emanet', 'emanet'),
  ],
};
