import { mark, raise, rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 30-scenes: dört aranabilir sahne. Görseller `scenes/<ad>.html`'den `npm run case:scenes -- silinen-dosyalar`.
// Şekil sabitleri golden path'te `step.tapCenter(…)` için dışa aktarılır.

// Sunucu odası · şikâyet ekindeki fotoğraflar
export const OB_YEDEK = rect(30, 150, 90, 50);
export const OB_YUVA = rect(30, 210, 90, 40);
export const OB_OKUYUCU = rect(280, 140, 40, 60);
export const OB_KLIMA = rect(130, 20, 110, 40);
export const OB_TUP = rect(270, 280, 40, 70);
// Aktaşların evi
export const OB_CEKMECE = rect(30, 260, 90, 50);
export const OB_MASA = rect(180, 200, 130, 60);
export const OB_MODEM = rect(250, 110, 60, 40);
export const OB_RESIM = rect(40, 60, 70, 70);
export const OB_SAAT = rect(150, 20, 40, 40);
// Fabrika kapısı · bekçi kulübesi
export const OB_DEFTER = rect(40, 220, 80, 40);
export const OB_TURNIKE = rect(210, 180, 50, 110);
export const OB_PARK = rect(270, 300, 70, 50);
export const OB_SERVIS = rect(150, 40, 80, 50);
// Eksper raporu fotoğrafları
export const OB_DAMGA = rect(240, 20, 90, 30);
export const OB_ZDEFTER = rect(40, 240, 90, 60);
export const OB_RAF = rect(150, 100, 100, 160);
export const OB_KAHVE = rect(270, 300, 50, 40);

const decoy = { score: { ARASTIRMA: -10 } };

export const scenes: CasePart = {
  scenes: [
    sceneDef('sc_sunucu', {
      title: 'Sunucu odası · 18 Ekim fotoğrafları',
      description: 'Şikâyet dilekçesine eklenmiş yirmi dört fotoğraf; şirketin kendi çektikleri.',
      width: 344,
      height: 380,
      image: 'img_sunucu',
      objects: [
        sceneObject('ob_yedek', 'Yedek cihazı', OB_YEDEK, {
          discovers: 'clue_son_yedek',
          score: { ARASTIRMA: 60 },
          text: 'Fotoğraf 7. Rafın altındaki yedek cihazının küçük yeşil ekranı. Büyüttüm: “Son başarılı yedek: 17.10 22.00.” Şikâyette “yedek sistemi aylardır çalışmıyordu” yazıyor.',
          short: 'Son yedek cuma 22.00',
        }),
        sceneObject('ob_yuva', 'Arka panel', OB_YUVA, {
          discovers: 'clue_bos_yuva',
          score: { ARASTIRMA: 60 },
          text: 'Fotoğraf 9, arkadan. Kabloların hepsi yerinde, biri hariç: yedek cihazının bağlantısı. Yuvanın çevresindeki tozda temiz bir dikdörtgen. Kablo aylardır değil, yakın zamanda çekilmiş.',
          short: 'Sökülmüş kablo',
        }),
        sceneObject('ob_okuyucu', 'Kapı', OB_OKUYUCU, {
          discovers: 'clue_kartli_kapi',
          score: { ARASTIRMA: 40 },
          text: 'Kapının yanında kartlı okuyucu. Üstünde boş bir kamera yuvası; vidaları paslanmış. Bu odaya kartsız girilmez. Kart da her girişi bir yere yazar.',
          short: 'Kartlı giriş',
        }),
        sceneObject('ob_klima', 'Klima', OB_KLIMA, {
          ...decoy,
          text: 'Tavana asılı klima, ekranında 18 derece. Sunucular serin sever. Bu fotoğraf bana yalnızca üşüdüğümü hatırlattı.',
          short: 'Klima',
        }),
        sceneObject('ob_tup', 'Yangın tüpü', OB_TUP, {
          ...decoy,
          effects: [mark('NEUTRAL', 'Dosyayla ilgisiz bir ayrıntı; zaman kaybı.')],
          text: 'Kırmızı bir yangın tüpü, son kontrol etiketi geçen yıl. Bu odada yanan bir şey yok. Sadece silinen.',
          short: 'Tüp',
        }),
      ],
    }),
    sceneDef('sc_ev', {
      title: 'Aktaşların evi · Nilüfer',
      description: 'İki oda bir salon; salonun köşesi Selim’in çalışma masası.',
      width: 344,
      height: 380,
      image: 'img_ev',
      objects: [
        sceneObject('ob_cekmece', 'Mutfak çekmecesi', OB_CEKMECE, {
          discovers: 'ev_eposta',
          score: { ARASTIRMA: 60 },
          text: 'Gül çekmeceyi açtı: faturalar, garanti belgeleri, bir zarfın içinde katlanmış bir A4. “Bunu basıp koymuştum, ne olur ne olmaz.” Bir e-posta: 30 Eylül, 18.02, gönderen T. Sezer.',
          short: 'Bir e-posta çıktısı',
        }),
        sceneObject('ob_masa', 'Çalışma masası', OB_MASA, {
          discovers: 'ev_devir',
          score: { ARASTIRMA: 60 },
          text: 'Masada polisin bıraktığı boşluk: dizüstünün yeri. Yanında etiketli karton dosyalar. “İŞ – AYRILIŞ” yazanın içinde iki imzalı bir tutanak. Selim’in nüshası.',
          short: 'İmzalı tutanak',
        }),
        sceneObject('ob_modem', 'Modem', OB_MODEM, {
          discovers: 'clue_modem',
          score: { ARASTIRMA: 40 },
          text: 'Modemin üstünde etiket makinesiyle basılmış bir şerit: “Ev hattı · sabit adres.” Gül güldü, ilk kez: “Her şeyi etiketler. Buzdolabındaki yoğurdu bile.”',
          short: 'Etiketli modem',
        }),
        sceneObject('ob_resim', 'Duvardaki resim', OB_RESIM, {
          ...decoy,
          text: 'Defne’nin pastel resmi: bir masa, bir ekran, ekranın önünde bir adam. Altında yamuk harflerle: “BABAM ÇALIŞIYOR.” Kanıt değil. Ama duvardan indirmedim.',
          short: 'Defne’nin resmi',
        }),
        sceneObject('ob_saat', 'Duvar saati', OB_SAAT, {
          ...decoy,
          text: 'Pilli bir duvar saati, üç dakika geri. Selim’in evinde bile bir şey senkronize değil. Belki de bu evde kimse saate değil, birbirine bakıyor.',
          short: 'Saat',
        }),
      ],
    }),
    sceneDef('sc_kapi', {
      title: 'Nilüfer Örme · fabrika kapısı',
      description: 'Organize sanayideki fabrikanın ana kapısı; bekçi kulübesi ve turnike, dışarıdan.',
      width: 344,
      height: 380,
      image: 'img_kapi',
      objects: [
        sceneObject('ob_defter', 'Kapı defteri', OB_DEFTER, {
          discovers: 'clue_defter',
          score: { ARASTIRMA: 60 },
          text: 'Yaşar Usta defteri camın önüne çevirdi; dokunmama izin vermedi, okumama verdi. Cuma 17 Ekim: “23.05 GM aracı. Evrak.” Çıkış: “23.34.” Kurşun kalem, eğik harfler.',
          short: 'Cuma 23.05 · GM aracı',
        }),
        sceneObject('ob_turnike', 'Turnike', OB_TURNIKE, {
          score: { ARASTIRMA: 40 },
          effects: [raise('fact_turnike')],
          text: 'Kart okutulan paslanmaz bir turnike; üstünde küçük bir ekran: “Geçiş kaydedildi.” Her kart, her saat, bir sunucuda. Bunu isteyebilirim; mahkeme kanalıyla.',
          short: 'Kart kaydı tutuyor',
        }),
        sceneObject('ob_park', 'Park yeri', OB_PARK, {
          ...decoy,
          text: 'Bir park yeri, beyaz boyayla yazılmış: “GENEL MÜDÜR.” Boş. Sabah dokuzdan önce kimse buraya araba koymaz.',
          short: 'Boş park yeri',
        }),
        sceneObject('ob_servis', 'Servis tabelası', OB_SERVIS, {
          ...decoy,
          text: 'Vardiya servislerinin saatleri: 07.30, 15.30, 23.30. Cuma gecesi son servis 23.30’da kalkmış. Bu bilgi kimsenin işine yaramıyor; benimki dahil.',
          short: 'Servis saatleri',
        }),
      ],
    }),
    sceneDef('sc_eksper', {
      title: 'Sigorta eksper raporu · sunucu odası',
      description: 'Sigortacının mahkemeye gönderdiği hasar dosyasındaki fotoğraflar.',
      width: 344,
      height: 380,
      image: 'img_eksper',
      objects: [
        sceneObject('ob_damga', 'Tarih damgası', OB_DAMGA, {
          discovers: 'clue_eksper',
          score: { ARASTIRMA: 60 },
          text: 'Fotoğrafın köşesinde kameranın turuncu damgası: “18.10 11.20.” Eksper odada; cumartesi sabahı. Şikâyet ve imaj iki gün sonra.',
          short: 'Damga 18.10 11.20',
        }),
        sceneObject('ob_zdefter', 'Ziyaretçi defteri', OB_ZDEFTER, {
          discovers: 'clue_ziyaretci',
          score: { ARASTIRMA: 60 },
          text: 'Kapının içinde, raf üstünde açık bir defter. Fotoğrafı büyüttüm: “17.10 · 23.11 · T.S. · kontrol.” Bir paraf. Bir saat. Bir cuma gecesi.',
          short: '23.11 · T.S.',
        }),
        sceneObject('ob_raf', 'Sunucu rafı', OB_RAF, {
          ...decoy,
          text: 'Aynı raf, aynı ışıklar; Selim’in yıllarca baktığı makineler. Fotoğrafta bir şey eksik değil. Eksik olan, içlerindeydi.',
          short: 'Raf',
        }),
        sceneObject('ob_kahve', 'Kahve bardağı', OB_KAHVE, {
          ...decoy,
          text: 'Eksperin unuttuğu bir karton bardak, kapağında ruj izi yok, bir golf kulübünün logosu var. Bursa’da üç golf sahası var; herkes birine gider.',
          short: 'Karton bardak',
        }),
      ],
    }),
  ],
  assets: [
    sceneAsset('img_sunucu', 'sunucu-odasi'),
    sceneAsset('img_ev', 'aktas-evi'),
    sceneAsset('img_kapi', 'fabrika-kapisi'),
    sceneAsset('img_eksper', 'eksper-fotograflari'),
  ],
};
