import { rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 30-scenes: üç aranabilir sahne. Görseller scenes/<ad>.html'den `npm run case:scenes -- son-mesaj` ile üretilir.

// Aksoy Mimarlık ofisi
export const OB_DOCK = rect(36, 150, 76, 40);
export const OB_NOT = rect(122, 196, 56, 22);
export const OB_KLASOR = rect(252, 64, 62, 84);
export const OB_FOTO = rect(150, 56, 62, 46);
export const OB_PLAN = rect(196, 176, 96, 50);
export const OB_MODEM = rect(20, 62, 44, 28);
// Acil servis
export const OB_SARJ = rect(28, 150, 96, 40);
export const OB_KAMERA = rect(268, 18, 44, 30);
export const OB_ONAM = rect(150, 86, 64, 74);
export const OB_SAAT = rect(160, 18, 40, 40);
export const OB_OTOMAT = rect(250, 120, 72, 120);
// Tarık'ın evi
export const OB_KOLI = rect(28, 190, 96, 62);
export const OB_EVMODEM = rect(250, 60, 54, 30);
export const OB_TABLET = rect(150, 172, 64, 40);
export const OB_CIZIM = rect(160, 48, 72, 62);

const miss = { score: { ARASTIRMA: -10 } } as const;

export const scenes: CasePart = {
  scenes: [
    sceneDef('sc_ofis', {
      title: 'Aksoy Mimarlık · Eski Pirinç Han',
      description: 'Tophane, hanın üst katı. Kemerlerin altında iki çizim masası; biri on bir aydır boş.',
      width: 344,
      height: 300,
      image: 'img_ofis',
      objects: [
        sceneObject('ob_dock', 'Boş masa', OB_DOCK, {
          discovers: 'clue_dock',
          score: { ARASTIRMA: 60 },
          text: 'Eski ortağın masasında bir dok istasyonu; kablosu hâlâ prizde. Kenarında demirbaş etiketi: “07”. Yuva boş. Tozda dikdörtgen, temiz bir iz: bir şeyin aylarca durup alındığı yer.',
          short: 'Boş dok “07”',
        }),
        sceneObject('ob_not', 'Klavye', OB_NOT, {
          discovers: 'ev_not',
          score: { ARASTIRMA: 60 },
          text: 'Klavyenin altında sararmış bir not: “WIFI: Ece2016!...” Kızının adı ve doğum yılı. Büyük harf, üç nokta; Tarık böyle yazmaz. Başka bir el, “herkes kullansın” diye yazmış.',
          short: 'Yapışkan not',
        }),
        sceneObject('ob_klasor', 'Yazışmalar klasörü', OB_KLASOR, {
          score: { ARASTIRMA: 20 },
          text: 'Raftaki “Yazışmalar” klasörü. Çoğu sıradan ihale yazışması. En arkada ayrılık protokolünün kapak yazısı: “Ek: demirbaş listesi.” Ek yok. Kenarda kurşun kalemle bir not: “Asıl liste N. Sarı’da.”',
          short: 'Protokol kapağı',
        }),
        sceneObject('ob_foto', 'Çerçeveli fotoğraf', OB_FOTO, {
          ...miss,
          text: 'Açılış günü. İki adam bir kurdeleyi birlikte kesiyor; biri gülüyor, öbürü kameraya bakıyor. Bir anı. Delil değil. (−10)',
          short: 'Açılış fotoğrafı',
        }),
        sceneObject('ob_plan', 'Restorasyon planı', OB_PLAN, {
          ...miss,
          text: 'Eski Pirinç Han’ın rölövesi. Kurşun kalemle düzeltilmiş kemer açıklıkları. Güzel bir iş. Bu davayla ilgisi yok. (−10)',
          short: 'Han planı',
        }),
        sceneObject('ob_modem', 'Modem', OB_MODEM, {
          discovers: 'clue_ofis_hat',
          score: { ARASTIRMA: 40 },
          text: 'Ofisin modemi. Şifre etiketi tırnakla kazınmış, ama yanındaki sağlayıcı etiketi duruyor: “Aksoy Tekin Mimarlık · sabit adres 78.186.20.9”. Bir hattın da bir adresi vardır; bu, hanın adresi.',
          short: 'Ofis modemi',
        }),
      ],
    }),
    sceneDef('sc_hastane', {
      title: 'Devlet hastanesi · acil servis',
      description: 'Çekirge. Gece yarısından sonra bekleyenler, florasan ışık, hemşire masası.',
      width: 344,
      height: 300,
      image: 'img_hastane',
      unlockWhen: { flag: 'fact_hastane' },
      objects: [
        sceneObject('ob_sarj', 'Hemşire masası', OB_SARJ, {
          discovers: 'clue_sarj',
          score: { ARASTIRMA: 60 },
          text: 'Hemşire masasında altı ağızlı bir şarj istasyonu; her kabloda isim ve saat yazılı bir bant. Duvarda kural: “Emanet telefona isim ve saat yazılır; deftere işlenir.” İnsanlar unutur, bantlar unutmaz; defterler hiç.',
          short: 'Şarj istasyonu',
        }),
        sceneObject('ob_kamera', 'Koridor kamerası', OB_KAMERA, {
          discovers: 'clue_kamera_h',
          score: { ARASTIRMA: 20 },
          text: 'Tavanda bir kamera. Güvenlik görevlisi omuz silkiyor: “Otuz gün tutuyoruz abla. Kasım mı? Kasım çoktan gitti.”',
          short: 'Kamera',
        }),
        sceneObject('ob_onam', 'Onam formları', OB_ONAM, {
          score: { ARASTIRMA: 20 },
          text: 'Duvarda boş onam formları. Her formun altında iki satır: “Tarih/saat” ve “Saati yazan sağlık personeli”. Burada saatler elle, imzayla yazılıyor.',
          short: 'Onam panosu',
        }),
        sceneObject('ob_saat', 'Duvar saati', OB_SAAT, {
          ...miss,
          text: 'Saat doğru. Burada her şey saatle yazılıyor; saatin kendisi bir şey söylemiyor. (−10)',
          short: 'Duvar saati',
        }),
        sceneObject('ob_otomat', 'Otomat', OB_OTOMAT, {
          ...miss,
          text: 'Çay, kahve, çorba. Bir düğmenin üstünde “ARIZALI” yazıyor. Gece nöbetinin bütün edebiyatı bu kadar. (−10)',
          short: 'Otomat',
        }),
      ],
    }),
    sceneDef('sc_ev', {
      title: 'Tarık’ın evi · çalışma odası',
      description: 'Hüdavendigar’da eski bir apartman. Kitaplık, bir çizim masası, köşede kapağı açık bir koli.',
      width: 344,
      height: 300,
      image: 'img_ev',
      objects: [
        sceneObject('ob_koli', 'Koli', OB_KOLI, {
          discovers: 'clue_koli',
          score: { ARASTIRMA: 60 },
          text: 'Mart kolisi: anahtarlar, iki cetvel, lazer metre, bir dizüstü şarj aleti. Dizüstünün kendisi yok. Şarj aleti saklanır da makine atılır mı? Kapakta: “Gerisi sende... Saygılar.”',
          short: 'Mart kolisi',
        }),
        sceneObject('ob_evmodem', 'Ev modemi', OB_EVMODEM, {
          discovers: 'clue_ev_hat',
          score: { ARASTIRMA: 60 },
          text: 'Evin modemi. Yönetim ekranında abone adı “T. Aksoy” ve hattın adresi: 176.88.12.4. Tarık’ın telefonu evde bu hattan bağlanır. Bir adresin sahibini sözleşme söyler, tahmin değil.',
          short: 'Ev modemi',
        }),
        sceneObject('ob_tablet', 'Eski tablet', OB_TABLET, {
          score: { ARASTIRMA: 10 },
          text: 'Kızının oyun tableti. Çizgi film, boyama, bir hafıza oyunu. Mesajlaşma uygulaması hiç kurulmamış.',
          short: 'Ece’nin tableti',
        }),
        sceneObject('ob_cizim', 'Çocuk çizimi', OB_CIZIM, {
          ...miss,
          text: '“Babamın ofisi.” Kemerler, iki masa, iki adam. Birinin üstü karalanmış. Çocuklar her şeyi görür. Ama bu bir delil değil. (−10)',
          short: 'Ece’nin çizimi',
        }),
      ],
    }),
  ],
  assets: [sceneAsset('img_ofis', 'ofis'), sceneAsset('img_hastane', 'hastane'), sceneAsset('img_ev', 'ev')],
};
