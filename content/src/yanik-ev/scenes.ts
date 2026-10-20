import { rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 30-scenes: dört arama sahnesi. Görseller scenes/<ad>.html → `npm run case:scenes -- yanik-ev`.
// Şekil sabitleri golden path'te `step.tapCenter(…)` için dışa aktarılır.

// Yanık ev (koridor, mutfak, salon, giriş)
export const OB_BUAT = rect(150, 64, 34, 32);
export const OB_V = rect(226, 56, 64, 112);
export const OB_MOLOZ = rect(18, 204, 96, 60);
export const OB_PANO = rect(116, 140, 28, 38);
export const OB_DIKIS = rect(196, 214, 76, 42);
export const OB_CUMBA = rect(16, 36, 84, 92);
// Olay yeri albümü (04.30)
export const OB_KARE21 = rect(20, 28, 148, 116);
export const OB_KARE9 = rect(184, 28, 140, 116);
export const OB_KARE30 = rect(20, 160, 148, 116);
export const OB_KALABALIK = rect(184, 160, 140, 116);
// Atölye
export const OB_BIDON = rect(268, 196, 42, 54);
export const OB_SANDIK = rect(28, 186, 112, 64);
export const OB_SOZLESME = rect(170, 46, 52, 64);
export const OB_KUMAS = rect(28, 38, 92, 104);
export const OB_TAKVIM = rect(244, 40, 50, 58);
// Saadet Hanım'ın evi
export const OB_TV = rect(196, 104, 96, 74);
export const OB_MODEM = rect(124, 146, 34, 22);
export const OB_KOMBI = rect(30, 54, 56, 84);
export const OB_KEDI = rect(150, 236, 50, 30);
export const OB_RESIM = rect(214, 30, 64, 50);

const decoy = (text: string) => ({ score: { ARASTIRMA: -10 }, text, short: 'Önemsiz', maxUses: 1 });

export const scenes: CasePart = {
  scenes: [
    sceneDef('sc_ev', {
      title: 'Kalem Sokak 9 · yanık ev',
      description: 'Yangından üç ay sonra evin içi: giriş, koridor, mutfak duvarı ve salon.',
      width: 344,
      height: 300,
      image: 'img_ev',
      objects: [
        sceneObject('ob_buat', 'Koridor duvarı', OB_BUAT, {
          discovers: 'clue_buat',
          score: { ARASTIRMA: 60 },
          text: 'Koridor duvarında kömürleşmiş bir buat kutusu. Kapağı erimiş; içinde uçları boncuklanmış bakır teller. Duvarın en derin yanığı tam burada.',
          short: 'Eriyik bakır',
        }),
        sceneObject('ob_v', 'Mutfak lambrisi', OB_V, {
          discovers: 'clue_v_izi',
          score: { ARASTIRMA: 40 },
          text: 'Lambri duvarda yukarı doğru açılan bir V. Dibi koridor tarafında, eski bir priz hizasında. Ateş buradan tırmanmış.',
          short: 'V izi',
        }),
        sceneObject('ob_moloz', 'Salon köşesi', OB_MOLOZ, {
          discovers: 'clue_moloz',
          score: { ARASTIRMA: 40 },
          text: 'Tavan tahtaları ve kül köşeye, düzgün bir yığın hâlinde itilmiş. Kenarında kürek izleri. Yangın bir şeyi böyle toplamaz; bir el toplar.',
          short: 'İtilmiş moloz',
        }),
        sceneObject('ob_pano', 'Giriş duvarı', OB_PANO, {
          discovers: 'clue_pano',
          score: { ARASTIRMA: 60 },
          text: 'Sigorta panosunun yuvası boş. Kablolar bir pense ile düzgünce kesilmiş. Pano yanmadı; biri söküp götürdü.',
          short: 'Boş pano yuvası',
        }),
        sceneObject(
          'ob_dikis',
          'Dikiş masası',
          OB_DIKIS,
          decoy('Kömürleşmiş bir dikiş masası; demir ayakları eğrilmiş. Bir zamanlar bir kadının akşamları. Dosyaya bir şey söylemiyor.'),
        ),
        sceneObject(
          'ob_cumba',
          'Cumba camı',
          OB_CUMBA,
          decoy('Cumbanın camları sıcaktan çatlamış, bir örümcek ağı gibi. Ateşin buraya geldiğini söylüyor; nereden geldiğini değil.'),
        ),
      ],
    }),
    sceneDef('sc_foto', {
      title: 'Olay yeri albümü · 15 Ocak 04.30',
      description: 'Kolluğun itfaiye çalışması sürerken çektiği fotoğraflardan dört kare.',
      width: 344,
      height: 300,
      image: 'img_foto',
      objects: [
        sceneObject('ob_kare21', 'Kare 21 · salon', OB_KARE21, {
          discovers: 'clue_foto_tavan',
          score: { ARASTIRMA: 60 },
          text: 'Kare 21, saat 04.30: salonun tavanı çökmüş. Zemin baştan sona yanık tahtalar ve molozla örtülü. Çıplak zemin yok; bir leke de yok.',
          short: 'Örtülü zemin',
        }),
        sceneObject('ob_kare9', 'Kare 9 · koridor', OB_KARE9, {
          discovers: 'clue_foto_koridor',
          score: { ARASTIRMA: 40 },
          text: 'Kare 9: koridorun mutfak tarafı. Lambri tamamen yanmış, kerpiç dolgu açığa çıkmış. Evin en çok yanan yeri salon değil, bu duvar.',
          short: 'Koridor duvarı',
        }),
        sceneObject('ob_kare30', 'Kare 30 · su', OB_KARE30, {
          discovers: 'clue_su',
          score: { ARASTIRMA: 40 },
          text: 'Kare 30: salonda bilek boyu su ve köpük. Seksen dakikalık söndürmenin artığı. Su, bir zeminin hikâyesini de yıkar.',
          short: 'Su birikintisi',
        }),
        sceneObject(
          'ob_kalabalik',
          'Kare 34 · sokak',
          OB_KALABALIK,
          decoy('Kare 34: şeridin arkasında pijamalı komşular, bir çocuk, bir kedi. Herkes bakıyor; kimse bir şey görmüyor.'),
        ),
      ],
    }),
    sceneDef('sc_atolye', {
      title: 'Halil’in döşeme atölyesi · Yıldırım',
      description: 'Eski sanayide, kumaş topları ve yarım kalmış otel koltukları arasında küçük bir atölye.',
      width: 344,
      height: 300,
      image: 'img_atolye',
      objects: [
        sceneObject('ob_bidon', 'Jeneratörün yanı', OB_BIDON, {
          discovers: 'clue_bidon',
          score: { ARASTIRMA: 60 },
          text: 'Küçük bir jeneratörün yanında kırmızı bir bidon. Kaldırıyorum: ağır. İçinde dört litre kadar benzin çalkalanıyor. Kolluk buraya hiç gelmemiş.',
          short: 'Dolu bidon',
        }),
        sceneObject('ob_sandik', 'Örtülü eşyalar', OB_SANDIK, {
          discovers: 'clue_esyalar',
          score: { ARASTIRMA: 40 },
          text: 'Battaniyelere sarılmış bir ceviz çeyiz sandığı, bir konsol, pedallı bir dikiş makinesi. Örtüye iliştirilmiş kâğıt: “EV — restorasyon bitince geri.”',
          short: 'Etiketli eşyalar',
        }),
        sceneObject('ob_sozlesme', 'Duvardaki kâğıt', OB_SOZLESME, {
          discovers: 'clue_restorasyon',
          score: { ARASTIRMA: 60 },
          text: 'Raptiyeyle tutturulmuş bir sözleşme. Başlangıç 19 Ocak; birinci hafta elektrik tesisatı. Altı çizili bir cümle: “Odalar 15 Ocak’a kadar boşaltılacaktır.”',
          short: 'Restorasyon sözleşmesi',
        }),
        sceneObject(
          'ob_kumas',
          'Kumaş topları',
          OB_KUMAS,
          decoy('Kadife, keten, deri. Bir otelin kırk sandalyesi için kesilmiş parçalar. Halil o gece bunları dikiyormuş; dosya için bir şey değil.'),
        ),
        sceneObject(
          'ob_takvim',
          'Takvim',
          OB_TAKVIM,
          decoy('Bir hırdavatçının hediye takvimi; ocak sayfasında yağlı parmak izleri. Hiçbir güne not düşülmemiş.'),
        ),
      ],
    }),
    sceneDef('sc_saadet', {
      title: 'Kalem Sokak 7 · Saadet Hanım’ın oturma odası',
      description: 'Dantel örtüler, bir soba, iki kedi ve yanık evin tam karşısına bakan bir pencere.',
      width: 344,
      height: 300,
      image: 'img_saadet',
      objects: [
        sceneObject('ob_tv', 'Eski televizyon', OB_TV, {
          discovers: 'clue_tv',
          score: { ARASTIRMA: 60 },
          text: 'Televizyonun arka kapağı gevşek. Güç kartında iki kondansatör patlamış, şişmiş. Saadet Hanım: “Yangından önce gitti bu, kızım. Pat dedi, karardı.”',
          short: 'Yanmış güç kartı',
        }),
        sceneObject('ob_modem', 'Modem', OB_MODEM, {
          score: { ARASTIRMA: 20 },
          maxUses: 1,
          text: 'Modemin adaptörü erimiş, plastiği kabarmış. Torunu yenisini getirmiş; eskisi bir kutunun içinde saklanmış.',
          short: 'Erimiş adaptör',
        }),
        sceneObject('ob_kombi', 'Kombi', OB_KOMBI, {
          score: { ARASTIRMA: 20 },
          maxUses: 1,
          text: 'Kombinin kapağında servis etiketi: “16 Ocak — kart değişimi.” Yangının ertesi günü.',
          short: 'Kombi kartı',
        }),
        sceneObject(
          'ob_kedi',
          'Kedi',
          OB_KEDI,
          decoy('Tekir kedi bir göz açıp kapattı. Bu evde olan biteni her şeyden iyi biliyor; söylemiyor.'),
        ),
        sceneObject(
          'ob_resim',
          'Duvardaki fotoğraf',
          OB_RESIM,
          decoy('Genç bir Saadet, tütün balyalarının önünde, yanında bıyıklı bir adam. Eski bir hayat; bu dosyanın değil.'),
        ),
      ],
    }),
  ],
  assets: [
    sceneAsset('img_ev', 'yanik-ev'),
    sceneAsset('img_foto', 'olay-albumu'),
    sceneAsset('img_atolye', 'atolye'),
    sceneAsset('img_saadet', 'saadet-evi'),
  ],
};
