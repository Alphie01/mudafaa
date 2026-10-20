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
      description: 'Tophane, hanın üst katı. Kemerlerin altında iki çizim masası; biri altı aydır boş.',
      width: 344,
      height: 300,
      image: 'img_ofis',
      objects: [
        sceneObject('ob_dock', 'Boş masa', OB_DOCK, {
          discovers: 'clue_dock',
          score: { ARASTIRMA: 60 },
          text: 'Eski ortağın masası. Üstünde bir dizüstü dok istasyonu; kablosu hâlâ prizde, usulca bekliyor. Yuvanın kenarında metal bir demirbaş etiketi: “07”. Ama yuva boş. Tozun içinde dikdörtgen, temiz bir iz; bir şeyin aylarca durduğu, sonra alınıp götürüldüğü yer. Dok burada kaldı; üstündeki makine değil.',
          short: 'Boş dok “07”',
        }),
        sceneObject('ob_not', 'Klavye', OB_NOT, {
          discovers: 'ev_not',
          score: { ARASTIRMA: 60 },
          text: 'Klavyeyi kaldırdım. Altında, kenarları sararmış bir yapışkan not: “WIFI: Ece2016!...” Büyük harflerle yazılmış, sonuna üç nokta konmuş. Tarık’ın kızının adı ve doğum yılı. Tarık böyle yazmaz; o küçük harfle, noktasız yazar. Bu notu başka bir el yazmış, “herkes kullansın” diye. Ve o not, aylarca burada, herkesin gözü önünde durmuş.',
          short: 'Yapışkan not',
        }),
        sceneObject('ob_klasor', 'Yazışmalar klasörü', OB_KLASOR, {
          discovers: 'clue_uslup_ozan',
          score: { ARASTIRMA: 40 },
          text: 'Raftaki “Yazışmalar” klasörü. Sayfaları karıştırdım; çoğu sıradan ihale yazışması. Ama bir tanesi dikkatimi çekti: çıktısı alınmış bir e-posta, gönderen o.tekin. “Sn. Aksoy, ekteki keşif özetini gereğini bilgilerinize sunarım... Saygılar.” Büyük harf, üç nokta, “Saygılar.” Bir yerde, çok yakın bir yerde, bu imzayı daha yeni görmüştüm.',
          short: 'Eski bir e-posta',
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
          score: { ARASTIRMA: 10 },
          text: 'Ofisin modemi. Altındaki şifre etiketi tırnakla kazınmış. Kimse şifreyi etikete bakarak öğrenmesin diye. Ama şifre zaten herkesin dilinde.',
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
          text: 'Hemşire masasının köşesinde çoklu bir şarj istasyonu, altı ağızlı. Her kablonun üstünde bir bant, bantlarda tükenmez kalemle isim ve saat yazılı. Duvarda çerçeveli bir kural: “Emanet alınan telefona isim ve saat yazılır.” Bu acil serviste her şeyin bir saati var; insanlar unutur, bantlar unutmaz. O gece de bir banda bir isim ve bir saat yazılmış olmalı.',
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
          text: 'Mart’ta eski ortağın kargoyla gönderdiği koli, kapağı açık. İçinde ofis anahtarları, iki çelik cetvel, bir lazer metre, bir de dizüstü şarj aleti. Her şey tek tek sarılmış, özenle. Ama dizüstünün kendisi yok; yalnızca şarj aleti var. İnsan atacağı bir makinenin şarj aletini saklar da makineyi atar mı? Kapakta el yazısı: “Gerisi sende... Saygılar.” Yine o nokta. Yine o “Saygılar.”',
          short: 'Mart kolisi',
        }),
        sceneObject('ob_evmodem', 'Ev modemi', OB_EVMODEM, {
          score: { ARASTIRMA: 20 },
          text: 'Evin modemi. Yönetim ekranında hattın adresi: 176.88.12.4. Tarık’ın evi. Kasım gecelerinin adresi bu değildi; olsaydı savcı çoktan sorardı.',
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
