import { rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 30-scenes: üç olay yeri ekranı. Görseller scenes/*.html → `npm run case:scenes -- kirik-kadeh`.
// Şekil sabitleri golden path'te `step.tapCenter(…)` için dışa aktarılır.

// Gölge'nin içi (bir hafta sonra, kapalı bar)
export const OB_PRIZ = rect(146, 232, 30, 22);
export const OB_ONLUK = rect(296, 64, 34, 70);
export const OB_KOLON = rect(64, 36, 36, 200);
export const OB_ADISYON = rect(258, 146, 26, 34);
export const OB_BOKS = rect(196, 36, 46, 44);
export const OB_AYNA = rect(116, 48, 62, 30);

// Kolluk fotoğrafları (02.10)
export const OB_SAP = rect(26, 168, 76, 62);
export const OB_KAN = rect(128, 56, 64, 54);
export const OB_KIRILMA = rect(218, 168, 66, 54);
export const OB_MASA4 = rect(238, 48, 74, 62);

// Gökdere Sokağı
export const OB_ECZANE = rect(18, 36, 76, 66);
export const OB_ARKA = rect(248, 116, 56, 96);
export const OB_TAKSI = rect(138, 204, 66, 40);

export const scenes: CasePart = {
  scenes: [
    sceneDef('sc_bar', {
      title: 'Gölge · bir hafta sonra',
      description: 'Kepenk yarıya kadar inik. İçeride anason, çamaşır suyu ve eski ahşap kokusu.',
      width: 344,
      height: 300,
      image: 'img_bar',
      objects: [
        sceneObject('ob_priz', 'Tezgâh altındaki priz', OB_PRIZ, {
          discovers: 'clue_priz',
          score: { ARASTIRMA: 60 },
          text: 'Kayıt cihazının fişi mekanik bir zaman ayarlı prizde. Pimler 01.00’de kesik, 09.00’da açık. Tozlu; aylardır kimse dokunmamış.',
          short: 'Zaman ayarlı priz',
        }),
        sceneObject('ob_onluk', 'Askıdaki önlük', OB_ONLUK, {
          discovers: 'clue_onluk',
          score: { ARASTIRMA: 60 },
          text: 'Mutfak kapısının yanında siyah bir garson önlüğü. İğneli kartta el yazısıyla “ECE”. Dosyada hiçbir Ece yok.',
          short: 'İsim kartlı önlük',
        }),
        sceneObject('ob_kolon', 'Masa 4 ve kolon', OB_KOLON, {
          discovers: 'clue_kolon',
          score: { ARASTIRMA: 40 },
          text: 'Masa 4’e oturdun. Tezgâhın üstü görünüyor. Önündeki zemin, kalın taş kolonun gölgesinde kayboluyor.',
          short: 'Kolon görüşü kesiyor',
        }),
        sceneObject('ob_adisyon', 'Adisyon çivisi', OB_ADISYON, {
          discovers: ['clue_adisyon', 'clue_masa7'],
          score: { ARASTIRMA: 60 },
          text: 'Çiviye takılı o gecenin adisyonları. Masa 4: iki kişi, tek hesap, kartla ödenmiş. Masa 7: kavgadan iki dakika sonra kapanmış.',
          short: 'O gecenin adisyonları',
        }),
        sceneObject('ob_boks', 'Boks fotoğrafı', OB_BOKS, {
          discovers: 'clue_boks',
          text: '1996, genç milli takım kampı. Eldivenli bir Bora, kameraya değil kenara bakıyor. Savcılığın seveceği bir fotoğraf.',
          short: 'Eski bir fotoğraf',
        }),
        sceneObject('ob_ayna', 'Çatlak ayna', OB_AYNA, {
          score: { ARASTIRMA: -10 },
          text: 'Aynadaki çatlak eski; kenarında toz birikmiş. O geceyle ilgisi yok.',
          short: 'Eski çatlak',
        }),
      ],
    }),
    sceneDef('sc_foto', {
      title: 'Kolluk fotoğrafları · 3 Kasım 02.10',
      description: 'On iki fotoğraf, flaşın düzleştirdiği bir gece.',
      width: 344,
      height: 300,
      image: 'img_foto',
      objects: [
        sceneObject('ob_sap', 'Fotoğraf 7', OB_SAP, {
          discovers: 'clue_sap',
          score: { ARASTIRMA: 60 },
          text: 'Kırık sap yerde, tezgâhtan bir metre uzakta. Kadrajın kenarında yerde yatan birinin sağ eli; kan izi elden sapa uzanıyor.',
          short: 'Sap, elin yanında',
        }),
        sceneObject('ob_kan', 'Fotoğraf 3', OB_KAN, {
          discovers: 'clue_kan',
          score: { ARASTIRMA: 40 },
          text: 'Kan damlaları tezgâhın iç kenarında, bar tarafında; lavaboya doğru iniyor. Müşteri tarafında tek damla yok.',
          short: 'Kan tezgâhın içinde',
        }),
        sceneObject('ob_kirilma', 'Fotoğraf 5', OB_KIRILMA, {
          discovers: 'clue_kirilma',
          score: { ARASTIRMA: 40 },
          text: 'Cam kırıkları tezgâhın dış kenarında yoğun. Ahşapta taze bir çentik: kadeh buraya vurulmuş. Dış kenar, müşterinin durduğu taraf.',
          short: 'Kırılma noktası',
        }),
        sceneObject('ob_masa4', 'Fotoğraf 9', OB_MASA4, {
          discovers: 'clue_masa4',
          score: { ARASTIRMA: 20 },
          text: 'Masa 4: iki boş kadeh, iki tabak, iki sandalyede iki ceket. Biri ceketini almadan kalkmış.',
          short: 'Masa 4',
        }),
      ],
    }),
    sceneDef('sc_sokak', {
      title: 'Gökdere Sokağı · gece',
      description: 'Dere taşkın, köprünün altında sarı bir lamba.',
      width: 344,
      height: 300,
      image: 'img_sokak',
      objects: [
        sceneObject('ob_eczane', 'Eczane tabelası', OB_ECZANE, {
          discovers: 'clue_eczane_kam',
          score: { ARASTIRMA: 60 },
          text: 'Nöbetçi eczanenin tabelasının altında küçük bir kamera; açısı tam Gölge’nin kapısında. Camda etiket: “Kayıtlar 15 gün saklanır.”',
          short: 'Kapıya bakan kamera',
        }),
        sceneObject('ob_arka', 'Arka sokak', OB_ARKA, {
          discovers: 'clue_arka_sokak',
          score: { ARASTIRMA: 40 },
          text: 'Mutfağın arka kapısı dar bir sokağa çıkıyor. Eşikte yağmura yapışmış ucuz, yeni bir saç tokası.',
          short: 'Arka kapı',
        }),
        sceneObject('ob_taksi', 'Taksi durağı', OB_TAKSI, {
          discovers: 'clue_taksi',
          text: 'Durak defteri: gece ikiden sonra iki çağrı, ikisi de Osmangazi yönüne. İsim yok.',
          short: 'Durak defteri',
        }),
      ],
    }),
  ],
  assets: [
    sceneAsset('img_bar', 'golge-ic'),
    sceneAsset('img_foto', 'kolluk-foto'),
    sceneAsset('img_sokak', 'gokdere-sokak'),
  ],
};
