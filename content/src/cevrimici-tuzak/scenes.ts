import { rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 30-scenes: üç aranabilir sahne. Görseller `scenes/<ad>.html`'den `npm run case:scenes -- cevrimici-tuzak` ile üretilir.

export const OB_LAMBA = rect(34, 56, 56, 70);
export const OB_NOT = rect(196, 74, 22, 20);
export const OB_LAPTOP = rect(118, 100, 76, 46);
export const OB_TELEFON = rect(236, 148, 34, 44);
export const OB_CV = rect(16, 126, 62, 22);
export const OB_SERIT = rect(276, 36, 36, 56);

export const OB_PANO = rect(26, 60, 62, 70);
export const OB_KAPI = rect(140, 70, 54, 22);
export const OB_ASANSOR = rect(268, 56, 64, 144);
export const OB_TUP = rect(104, 150, 20, 40);
export const OB_SAKSI = rect(210, 156, 36, 44);

export const OB_YONETIM = rect(256, 110, 72, 40);
export const OB_KAMERA = rect(146, 22, 34, 22);
export const OB_BARIYER = rect(14, 170, 80, 30);
export const OB_BIRIKINTI = rect(130, 240, 80, 24);

const decoy = (text: string, short: string) => ({
  text,
  short,
  score: { ARASTIRMA: -10 },
});

export const scenes: CasePart = {
  scenes: [
    sceneDef('sc_oda', {
      title: 'Ece’nin odası',
      description: 'Yıldırım, yokuşun ortasında iki odalı bir ev. Masa, lamba, şarjdaki eski telefon.',
      width: 344,
      height: 300,
      image: 'img_oda',
      objects: [
        sceneObject('ob_lamba', 'Masa lambası', OB_LAMBA, {
          discovers: 'clue_lamba',
          score: { ARASTIRMA: 40 },
          text: 'Sert, beyaz bir LED. Laptopun kapağına, sarı notun selofanına, oje şişesine aynı yerden bir yıldız konduruyor. Şişe koyu bordo; Ece’nin başparmağındaki oje köşeden kırık.',
          short: 'Lamba ve oje',
        }),
        sceneObject('ob_not', 'Sarı not', OB_NOT, {
          discovers: 'ev_not',
          score: { ARASTIRMA: 60 },
          text: 'Monitörün kenarında bir sarı not: “4471 — SGK”. Altında küçük bir gülen yüz. Bir kodu dikte edilirken yazılmış gibi aceleci rakamlar.',
          short: 'Sarı not',
        }),
        sceneObject('ob_laptop', 'Laptop', OB_LAPTOP, {
          discovers: 'clue_tablo',
          score: { ARASTIRMA: 40 },
          text: 'Açık bir tablo: 143 satır, her başvuru tarihli. 20 Ekim satırında büyük harfler: “NOVA DİJİTAL — OLUMLU!!!” Bir sütunun adı: “Ekran görüntüsü klasörü”.',
          short: 'Başvuru tablosu',
        }),
        sceneObject('ob_telefon', 'Şarjdaki telefon', OB_TELEFON, {
          discovers: 'clue_simyok',
          score: { ARASTIRMA: 60 },
          text: 'Ekranı çatlak bir iPhone 8. Fotoğraflarda 4 Kasım 2025, 10.13 tarihli bir ekran görüntüsü: sol üstte “SIM yok”.',
          short: 'Eski telefon',
        }),
        sceneObject('ob_cv', 'CV yığını', OB_CV, {
          discovers: 'clue_cv',
          ...decoy(
            'Otuz kopya CV. Hepsinde aynı vesikalık, aynı “takım çalışmasına yatkın”. Bir umut yığını; delil değil.',
            'CV yığını',
          ),
        }),
        sceneObject('ob_serit', 'Fotoğraf şeridi', OB_SERIT, {
          discovers: 'clue_vesikalik',
          ...decoy(
            'Fotoğraf kabininden dört kare. Yanındaki genç adamın olduğu yarısı yırtılmış. Kırgınlık her zaman ipucu değildir.',
            'Yırtık şerit',
          ),
        }),
      ],
    }),
    sceneDef('sc_koridor', {
      title: 'OM İş Merkezi · 4. kat',
      description: 'Halı kokulu, sessiz bir koridor. Kapılar, bir pano, bir asansör.',
      width: 344,
      height: 300,
      image: 'img_koridor',
      objects: [
        sceneObject('ob_pano', 'Kat panosu', OB_PANO, {
          discovers: 'clue_kiraci',
          score: { ARASTIRMA: 40 },
          text: 'Kat panosu, 2025 baskısı: 401’den 406’ya firma adları. 407’nin satırı boş. Nova Dijital burada yazmıyor.',
          short: 'Kat panosu',
        }),
        sceneObject('ob_kapi', '407 numaralı kapı', OB_KAPI, {
          discovers: 'clue_levha',
          score: { ARASTIRMA: 60 },
          text: 'Yapıştırma bir “NOVA DİJİTAL” etiketi. Köşesi kalkmış; altındaki pirinç levhada iki kelime okunuyor: “YÖNETİM ARŞİVİ”.',
          short: '407 kapısı',
        }),
        sceneObject('ob_asansor', 'Asansör', OB_ASANSOR, {
          discovers: 'clue_asansor',
          score: { ARASTIRMA: 40 },
          text: 'Kapı açılırken bir sinyal, sonra kayıtlı bir kadın sesi: “Dördüncü kat.” Sesin tonu, kaydı yapanın sıkıldığını belli ediyor.',
          short: 'Asansör',
        }),
        sceneObject('ob_tup', 'Yangın tüpü', OB_TUP, {
          ...decoy(
            'Son kontrol tarihi geçmiş bir yangın tüpü. Binanın bakımı hakkında bir şey söylüyor; davan hakkında değil.',
            'Yangın tüpü',
          ),
        }),
        sceneObject('ob_saksi', 'Saksı', OB_SAKSI, {
          ...decoy(
            'Plastik bir kauçuk ağacı. Yaprakları tozlu. Toprağında üç izmarit. Kimin olduğu bilinmez; önemi de yok.',
            'Saksı',
          ),
        }),
      ],
    }),
    sceneDef('sc_otopark', {
      title: 'OM İş Merkezi · otopark',
      description: 'Eksi birinci kat. Islak beton, sarı çizgiler, bir kamera.',
      width: 344,
      height: 300,
      image: 'img_otopark',
      objects: [
        sceneObject('ob_yonetim', 'Köşedeki tabela', OB_YONETIM, {
          discovers: 'clue_yonetim_park',
          score: { ARASTIRMA: 60 },
          text: 'En köşede tek bir ayrılmış yer. Sarı tabela: “YÖNETİM — 1”. Kameranın açısı tam bu köşeye varmadan bitiyor.',
          short: 'Ayrılmış yer',
        }),
        sceneObject('ob_kamera', 'Kamera', OB_KAMERA, {
          score: { ARASTIRMA: 20 },
          text: 'Bariyere bakan tek kamera. Altında bir etiket: “Kayıtlar 30 gün saklanır.” Bir yıl önceki bir gece çoktan silinmiş.',
          short: 'Kamera',
        }),
        sceneObject('ob_bariyer', 'Bariyer', OB_BARIYER, {
          ...decoy(
            'Plakayı okuyan bir bariyer. Abonelere açılıyor. Kimin girip çıktığını gösterir; ama bir yıl önceyi değil.',
            'Bariyer',
          ),
        }),
        sceneObject('ob_birikinti', 'Su birikintisi', OB_BIRIKINTI, {
          ...decoy(
            'Tavandaki çatlaktan damlayan suyun yaptığı bir birikinti. İçinde kendi yansıman. Başka bir şey yok.',
            'Birikinti',
          ),
        }),
      ],
    }),
  ],
  assets: [
    sceneAsset('img_oda', 'ece-oda'),
    sceneAsset('img_koridor', 'om-koridor'),
    sceneAsset('img_otopark', 'om-otopark'),
  ],
};
