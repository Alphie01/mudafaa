import { rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 30-scenes: üç arama sahnesi. Görseller scenes/<ad>.html → `npm run case:scenes -- beyaz-toz`.
// Şekil sabitleri golden path'te `step.tapCenter(…)` için dışa aktarılır.

// Arka oda (olay yeri fotoğrafları)
export const OB_KILIT = rect(272, 236, 40, 26);
export const OB_MONT = rect(146, 118, 56, 74);
export const OB_ZINCIR = rect(196, 266, 70, 20);
export const OB_DOLAP = rect(20, 40, 90, 150);
export const OB_POSTER = rect(126, 36, 60, 50);
// Ön oda + koridor
export const OB_YATAK = rect(16, 196, 124, 64);
export const OB_RANDEVU = rect(176, 136, 30, 16);
export const OB_SEKERLIK = rect(262, 104, 34, 34);
export const OB_AYAKKABI = rect(246, 232, 84, 48);
export const OB_GITAR = rect(100, 56, 30, 110);
export const OB_KULTABLA = rect(150, 160, 22, 14);
// Bina girişi
export const OB_POSTA = rect(30, 124, 26, 26);
export const OB_YAG = rect(220, 250, 92, 30);
export const OB_SALTER = rect(150, 100, 18, 22);
export const OB_IZMARIT = rect(136, 262, 44, 20);

const decoy = (text: string) => ({ score: { ARASTIRMA: -10 }, text, short: 'Önemsiz', maxUses: 1 });

export const scenes: CasePart = {
  scenes: [
    sceneDef('sc_arka', {
      title: 'Arka oda · 11 Kasım olay yeri fotoğrafları',
      description: 'Kolluğun arama sırasında çektiği fotoğraflar: arka odanın içi ve kapı eşiği.',
      width: 344,
      height: 300,
      image: 'img_arka',
      objects: [
        sceneObject('ob_kilit', 'Kapı eşiği', OB_KILIT, {
          discovers: 'clue_kilit',
          score: { ARASTIRMA: 60 },
          text: 'Eşiğin dibinde çelik halkası kesilmiş bir asma kilit. Kesik kilit, kilitli bir kapı demektir. Kilitli kapı, başkasının odası.',
          short: 'Kesik asma kilit',
        }),
        sceneObject('ob_mont', 'Sandalye', OB_MONT, {
          discovers: 'clue_mont',
          score: { ARASTIRMA: 40 },
          text: 'Sandalyenin sırtında reflektörlü, logolu bir kurye montu. Etiket: XL. Kaan’ın montu olsa içinde kaybolurdu.',
          short: 'XL kurye montu',
        }),
        sceneObject('ob_zincir', 'Yatağın altı', OB_ZINCIR, {
          discovers: 'clue_zincir',
          score: { ARASTIRMA: 60 },
          text: 'Flaşın yakaladığı bir parıltı: yatağın altında kalın bir motosiklet zincir kilidi. Duvarda boş bir kask askısı.',
          short: 'Zincir kilit, kask askısı',
        }),
        sceneObject(
          'ob_dolap',
          'Dolap',
          OB_DOLAP,
          decoy(
            'Dolabın kapakları açık, rafları boş. Ayakkabı kutusu çoktan emanete gitmiş. Fotoğraf sadece yokluğu gösteriyor.',
          ),
        ),
        sceneObject(
          'ob_poster',
          'Duvardaki poster',
          OB_POSTER,
          decoy(
            'Bir futbol takımının eski sezon posteri. Köşesi bantla tutturulmuş. Bir zevki gösteriyor, bir kimliği değil.',
          ),
        ),
      ],
    }),
    sceneDef('sc_on', {
      title: 'Ön oda ve koridor · 11 Kasım olay yeri fotoğrafları',
      description: 'Kaan’ın uyandırıldığı ön oda, giriş ve koridor.',
      width: 344,
      height: 300,
      image: 'img_on',
      objects: [
        sceneObject('ob_yatak', 'Dağınık yatak', OB_YATAK, {
          discovers: 'clue_on_oda',
          score: { ARASTIRMA: 60 },
          text: 'Dağınık bir yatak, yarı açık bir iktisat kitabı, kulaklık, gözlük kılıfı ve bir öğrenci kartı: Kaan Yıldız. Tutanak da onu burada uyurken bulduklarını yazıyor.',
          short: 'Kaan’ın yatağı',
        }),
        sceneObject('ob_randevu', 'Masadaki kart', OB_RANDEVU, {
          discovers: 'clue_randevu',
          score: { ARASTIRMA: 40 },
          text: 'Bardak altlığının yanında bir randevu kartı. AMATEM, ayaktan tedavi, 13 Kasım Perşembe 10.30. Baskından iki gün sonrası.',
          short: 'Randevu kartı',
        }),
        sceneObject('ob_sekerlik', 'Koridor rafı', OB_SEKERLIK, {
          discovers: 'clue_sekerlik',
          score: { ARASTIRMA: 60 },
          text: 'Şekerlik. Ama mutfakta değil; koridordaki küçük rafta, arka oda kapısına iki adım. Tutanak “mutfakta şekerlikte” diyor. Fotoğraf başka bir yer gösteriyor.',
          short: 'Şekerliğin yeri',
        }),
        sceneObject('ob_ayakkabi', 'Ayakkabılık', OB_AYAKKABI, {
          discovers: 'clue_ayakkabi',
          score: { ARASTIRMA: 40 },
          text: 'Ayakkabılıkta iki dünya: temiz, 41 numara bir spor ayakkabı ve çamurlu, 45 numara, burnu çelik bir kurye botu.',
          short: '41 ve 45 numara',
        }),
        sceneObject(
          'ob_gitar',
          'Duvardaki gitar',
          OB_GITAR,
          decoy(
            'Teli kopmuş bir gitar. Bir zamanlar çalınmış, sonra unutulmuş. Kaan hakkında bir şey söylüyor, dosya hakkında değil.',
          ),
        ),
        sceneObject(
          'ob_kultabla',
          'Kül tablası',
          OB_KULTABLA,
          decoy('Masada boş bir kül tablası. Bazen bir kül tablası sadece bir kül tablasıdır.'),
        ),
      ],
    }),
    sceneDef('sc_bina', {
      title: 'Ihlamur Sokak 14 · bina girişi',
      description: 'Binanın girişi, posta kutuları ve köşedeki park yeri; bizzat, ocak sabahı.',
      width: 344,
      height: 300,
      image: 'img_bina',
      objects: [
        sceneObject('ob_posta', 'Posta kutuları', OB_POSTA, {
          discovers: 'clue_posta',
          score: { ARASTIRMA: 60 },
          text: 'Daire 7’nin posta kutusu. Matbu etikette “YILDIZ”. Altına keçeli kalemle, eğri harflerle bir soyadı daha eklenmiş: “DEMİREL”.',
          short: 'İki soyadı',
        }),
        sceneObject('ob_yag', 'Bina köşesi', OB_YAG, {
          discovers: 'clue_yag',
          score: { ARASTIRMA: 40 },
          text: 'Köşede, yağmura direnen koyu bir yağ lekesi; demir korkulukta zincir sürtmesinden parlamış bir halka izi. Burada uzun süre bir motosiklet park edilmiş.',
          short: 'Motor park izi',
        }),
        sceneObject(
          'ob_salter',
          'Merdiven otomatiği',
          OB_SALTER,
          decoy(
            'Merdiven ışığının otomatiği. Basınca on beş saniye yanıyor. Bir bina hakkında çok şey söyler; bu dava hakkında değil.',
          ),
        ),
        sceneObject(
          'ob_izmarit',
          'İzmaritler',
          OB_IZMARIT,
          decoy('Kapının önünde ıslak izmaritler. Görükle’nin her kapısında var. İki ay sonra kimseye ait değiller.'),
        ),
      ],
    }),
  ],
  assets: [sceneAsset('img_arka', 'arka-oda'), sceneAsset('img_on', 'on-oda'), sceneAsset('img_bina', 'bina')],
};
