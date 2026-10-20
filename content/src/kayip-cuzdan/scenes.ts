import { rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart, Rect } from '../../../tools/content/src/kit/index.js';

// 30-scenes: üç arama sahnesi. Görseller scenes/<ad>.html → `npm run case:scenes -- kayip-cuzdan`. Dokunma alanları
// golden path için dışa aktarılır (step.tapCenter).

const R = (x: number, y: number, w: number, h: number): Rect => ({ x, y, w, h });

// Hat 38 (344 × 300)
export const OB_KAM = R(10, 6, 324, 26);
export const OB_BOSLUK = R(236, 214, 50, 22);
export const OB_CIKARTMA = R(148, 72, 34, 32);
export const OB_DOKUZ = R(52, 150, 56, 62);
export const OB_VALIDATOR = R(122, 128, 18, 30);
export const OB_EKRAN = R(196, 40, 80, 18);
// Öğrenci evi (344 × 300)
export const OB_CEKMECE = R(36, 200, 80, 26);
export const OB_TELEFON = R(152, 168, 26, 34);
export const OB_LAPTOP = R(196, 134, 74, 44);
export const OB_NOTBLOK = R(122, 186, 24, 18);
export const OB_BUZDOLABI = R(284, 96, 52, 120);
export const OB_KITAPLIK = R(10, 40, 90, 120);
// Altıparmak büfe (344 × 300)
export const OB_FISKUTUSU = R(108, 206, 44, 24);
export const OB_BKAMERA = R(250, 36, 26, 18);
export const OB_POS = R(168, 170, 26, 22);
export const OB_DURAK = R(8, 96, 34, 120);
export const OB_RAF = R(200, 80, 120, 70);

export const scenes: CasePart = {
  scenes: [
    sceneDef('sc_otobus', {
      title: 'Hat 38 · 18.40 seferi',
      description: 'Aynı saatte, aynı model araçta. 14 numara arka kapının önünde, 9 numara orta kapıya dönük.',
      width: 344,
      height: 300,
      image: 'img_otobus',
      objects: [
        sceneObject('ob_kam', 'Tavandaki kamera kubbeleri', rect(OB_KAM.x, OB_KAM.y, OB_KAM.w, OB_KAM.h), {
          discovers: 'clue_dort_kamera',
          score: { ARASTIRMA: 40 },
          text: 'Saydım: ön, orta, orta kapı, arka. Dört siyah kubbe. CD’de bunlardan yalnızca biri var.',
          short: 'Dört kamera',
        }),
        sceneObject('ob_bosluk', '14 numaranın altı', rect(OB_BOSLUK.x, OB_BOSLUK.y, OB_BOSLUK.w, OB_BOSLUK.h), {
          discovers: 'clue_koltuk_boslugu',
          score: { ARASTIRMA: 60 },
          text: 'Isıtıcı kapağının yanında bir avuçluk karanlık. Oturunca göremiyorsun; ancak ayağın takılınca anlıyorsun.',
          short: 'Koltuk altı boşluğu',
        }),
        sceneObject('ob_cikartma', 'Kapı camındaki çıkartma', rect(OB_CIKARTMA.x, OB_CIKARTMA.y, OB_CIKARTMA.w, OB_CIKARTMA.h), {
          discovers: 'clue_cikartma',
          score: { ARASTIRMA: 40 },
          text: '“Araçta bulduğunuz eşyayı sürücüye teslim ediniz.” Kuralı biliyorlar. Peki şoför biliyor mu?',
          short: 'Buluntu çıkartması',
        }),
        sceneObject('ob_dokuz', 'Arkaya bakan koltuk', rect(OB_DOKUZ.x, OB_DOKUZ.y, OB_DOKUZ.w, OB_DOKUZ.h), {
          discovers: 'clue_dokuz_koltuk',
          score: { ARASTIRMA: 40 },
          text: '9 numara. Hayri Bey’in yeri. Oturdum: orta kapı üç metre ötede. Başımı eğip gazete okusam, kalabalık bir leke olurdu.',
          short: '9 numara',
        }),
        sceneObject('ob_validator', 'Validatör', rect(OB_VALIDATOR.x, OB_VALIDATOR.y, OB_VALIDATOR.w, OB_VALIDATOR.h), {
          text: 'Kart okutunca bip. Binişi kaydeder, inişi kaydetmez. Kimin nerede indiğini bu makine bilmez.',
          short: 'Validatör',
        }),
        sceneObject('ob_ekran', 'Durak ekranı', rect(OB_EKRAN.x, OB_EKRAN.y, OB_EKRAN.w, OB_EKRAN.h), {
          text: '“SIRADAKİ DURAK: KÜLTÜRPARK.” Kırmızı harfler. Bir saat sonra kimse bu ekranı hatırlamaz; kamera hatırlar.',
          short: 'Durak ekranı',
        }),
      ],
    }),
    sceneDef('sc_oda', {
      title: 'Görükle · öğrenci evi, Arda’nın odası',
      description: 'Arda ve Ozan’ın rızasıyla, ikisinin gözü önünde. Hiçbir şeye el konmaz; yalnızca bakılır ve fotoğraflanır.',
      width: 344,
      height: 300,
      image: 'img_oda',
      objects: [
        sceneObject('ob_cekmece', 'Masa çekmecesi', rect(OB_CEKMECE.x, OB_CEKMECE.y, OB_CEKMECE.w, OB_CEKMECE.h), {
          discovers: 'clue_atm_fisi',
          score: { ARASTIRMA: 60 },
          text: 'Bir Sait Faik’in arasında buruşuk bir ATM fişi: 6 Mart, 17.52, 600 TL. Arda “kitap ayracı” diyor.',
          short: 'ATM fişi',
        }),
        sceneObject('ob_telefon', 'Arda’nın telefonu', rect(OB_TELEFON.x, OB_TELEFON.y, OB_TELEFON.w, OB_TELEFON.h), {
          discovers: 'clue_153_arama',
          score: { ARASTIRMA: 60 },
          text: 'Arama geçmişini birlikte açtık. 6 Mart 19.18: 153, üç dakika on iki saniye. Arda omuz silkti: “Kimse not almadı ki.”',
          short: '153 araması',
        }),
        sceneObject('ob_laptop', 'Dizüstü bilgisayar', rect(OB_LAPTOP.x, OB_LAPTOP.y, OB_LAPTOP.w, OB_LAPTOP.h), {
          discovers: 'clue_fb_mesaj',
          score: { ARASTIRMA: 40 },
          text: 'Gönderilmiş kutusunda 21.14 tarihli bir mesaj. “Görüldü” yok. Bir ses boşluğa konuşmuş.',
          short: 'Gönderilmiş mesaj',
        }),
        sceneObject('ob_notblok', 'Sarı not bloğu', rect(OB_NOTBLOK.x, OB_NOTBLOK.y, OB_NOTBLOK.w, OB_NOTBLOK.h), {
          text: 'Masada sarı bir yapışkan not bloğu. En üstteki yaprak eksik; altındakinde bastırılmış kalem izi var. Okunmuyor.',
          short: 'Not bloğu',
        }),
        sceneObject('ob_buzdolabi', 'Buzdolabı kapağı', rect(OB_BUZDOLABI.x, OB_BUZDOLABI.y, OB_BUZDOLABI.w, OB_BUZDOLABI.h), {
          discovers: 'clue_kira',
          text: 'Mıknatısla tutturulmuş bir çıktı: ev sahibinin ikinci uyarısı. İki aylık kira payı. Bunu savcı da görmek isterdi.',
          short: 'Kira uyarısı',
        }),
        sceneObject('ob_kitaplik', 'Kitaplık', rect(OB_KITAPLIK.x, OB_KITAPLIK.y, OB_KITAPLIK.w, OB_KITAPLIK.h), {
          text: 'Pedagoji kitapları, sahaftan alınmış yıpranmış romanlar, bir çocuk kitabı yığını. “Staj okulu için,” diyor Arda.',
          short: 'Kitaplık',
        }),
      ],
    }),
    sceneDef('sc_bufe', {
      title: 'Altıparmak · tekel büfesi, gece',
      description: 'Kartlardan biri burada, 18.49’da kullanılmış. Büfe aynı; aylar geçmiş.',
      width: 344,
      height: 300,
      image: 'img_bufe',
      objects: [
        sceneObject('ob_fiskutusu', 'Tezgâhın altındaki ayakkabı kutusu', rect(OB_FISKUTUSU.x, OB_FISKUTUSU.y, OB_FISKUTUSU.w, OB_FISKUTUSU.h), {
          discovers: 'clue_fis_notu',
          score: { ARASTIRMA: 60 },
          text: 'Gün sonu fişleri, lastikle bağlanmış, aylara göre. 6 Mart destesinde 18.49’a ait üç fiş. Birinin arkasında kurşun kalemle bir not.',
          short: 'Fiş kutusu',
        }),
        sceneObject('ob_bkamera', 'Tentenin altındaki kamera', rect(OB_BKAMERA.x, OB_BKAMERA.y, OB_BKAMERA.w, OB_BKAMERA.h), {
          discovers: 'clue_bufe_kamera',
          text: '“Otuz günde kendi üstüne yazar abla. Mart’ı soruyorsan, mart çoktan gitti.”',
          short: 'Büfe kamerası',
        }),
        sceneObject('ob_pos', 'POS cihazı', rect(OB_POS.x, OB_POS.y, OB_POS.w, OB_POS.h), {
          text: 'Temassız çıkartması yarı yarıya kazınmış. Şifresiz sınırın altında kalan her çekim, kimin kartı olduğunu sormaz.',
          short: 'POS cihazı',
        }),
        sceneObject('ob_durak', 'Durak tabelası', rect(OB_DURAK.x, OB_DURAK.y, OB_DURAK.w, OB_DURAK.h), {
          text: '“ALTIPARMAK.” Hat 38 burada duruyor. Büfeye kırk adım. Yağmurda otuz.',
          short: 'Altıparmak durağı',
        }),
        sceneObject('ob_raf', 'Sigara rafı', rect(OB_RAF.x, OB_RAF.y, OB_RAF.w, OB_RAF.h), {
          text: 'Sigara, çakmak, şarj kablosu, piyango bileti. Küçük, hızlı, nakde çevrilebilir şeyler.',
          short: 'Raf',
        }),
      ],
    }),
  ],
  assets: [sceneAsset('img_otobus', 'otobus'), sceneAsset('img_oda', 'oda'), sceneAsset('img_bufe', 'bufe')],
};
