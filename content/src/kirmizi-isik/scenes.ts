import { rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 30-scenes: üç olay yeri. Görseller scenes/*.html → `npm run case:scenes -- kirmizi-isik`.
// Şekil sabitleri golden path'te `step.tapCenter(…)` için dışa aktarılır.

// sc_gece — 14 Kasım polis fotoğrafları (gece, yağmur)
export const OB_FREN = rect(40, 214, 150, 14);
export const OB_CAM = rect(214, 236, 46, 20);
export const OB_ARKA = rect(286, 44, 26, 52);
export const OB_POSET = rect(150, 262, 30, 24);
export const OB_ROGAR = rect(60, 262, 40, 20);
export const OB_AFIS = rect(18, 70, 50, 70);

// sc_sabah — kavşak bugün
export const OB_KABIN = rect(250, 150, 48, 70);
export const OB_KAMERA = rect(40, 52, 30, 22);
export const OB_CICEK = rect(160, 170, 30, 40);
export const OB_BUTON = rect(198, 176, 16, 20);
export const OB_PANO = rect(96, 40, 54, 70);

// sc_otopark — yediemin otoparkı, Volkan'ın arabası
export const OB_TAMPON = rect(40, 214, 80, 20);
export const OB_FAR = rect(36, 176, 46, 22);
export const OB_ABS = rect(196, 96, 30, 20);
export const OB_EKRAN = rect(240, 96, 46, 30);
export const OB_BEBEK = rect(250, 150, 50, 46);
export const OB_ONLUK = rect(150, 150, 50, 30);

export const scenes: CasePart = {
  scenes: [
    sceneDef('sc_gece', {
      title: 'Gökdere kavşağı · 14 Kasım 02.10 fotoğrafları',
      description: 'Trafik şubenin çektiği olay yeri fotoğrafları. Yağmur, ıslak asfalt, sodyum lambaların turuncusu.',
      width: 344,
      height: 300,
      image: 'img_gece',
      objects: [
        sceneObject('ob_fren', 'Asfalttaki uzun iz', OB_FREN, {
          discovers: 'clue_fren',
          score: { ARASTIRMA: 60 },
          text: 'Yaya geçidinden önce başlayan, on sekiz metre boyunca hiç kesilmeyen tek bir koyu iz. Kilitlenmiş tekerlek. Islak asfaltta bile bu kadar düzgün bir iz, frenin hiç bırakılmadığını gösterir.',
          short: '18 m fren izi',
        }),
        sceneObject('ob_cam', 'Sol şeritteki parıltı', OB_CAM, {
          discovers: 'clue_cam',
          score: { ARASTIRMA: 60 },
          text: 'Geçidin dokuz metre ilerisinde, sol şeritte saçılmış far camı ve koyu plastik parçalar. Tutanağa göre ilk temasın olduğu yaya geçidinin hemen ötesi. Parçaların bazıları yeşilimsi, bazıları şeffaf. Fotoğrafın köşesinde bir polis eldiveni, yerdeki bir parçayı işaret ediyor.',
          short: 'Far camı kırıkları',
        }),
        sceneObject('ob_arka', 'Direkteki siyah kutu', OB_ARKA, {
          discovers: 'clue_arka',
          score: { ARASTIRMA: 40 },
          text: 'Fotoğraf Çınarlı Sokak köşesinden çekilmiş. Gökdere’ye bakan sinyal başlığının yalnızca siyah sırtı görünüyor. Işık yok, renk yok. Taksici o gece tam bu köşedeydi.',
          short: 'Sinyalin sırtı',
        }),
        sceneObject('ob_poset', 'Kaldırımdaki naylon poşet', OB_POSET, {
          text: 'İçinde iki simit ve bir hastane yemekhanesi fişi. Hatice Durmaz’ın son alışverişi. Delil değil; yine de baktım.',
          short: 'Simit poşeti',
        }),
        sceneObject('ob_rogar', 'Rögar kapağı', OB_ROGAR, {
          score: { ARASTIRMA: -10 },
          text: 'Islak bir rögar kapağı. Kaymak için iyi bir yer, delil için değil.',
          short: 'Rögar',
        }),
        sceneObject('ob_afis', 'Duvardaki afiş', OB_AFIS, {
          score: { ARASTIRMA: -10 },
          text: 'Yırtık bir konser afişi. Gece yarısı herkesin bir yere yetişmesi gerekiyor.',
          short: 'Afiş',
        }),
      ],
    }),
    sceneDef('sc_sabah', {
      title: 'Gökdere kavşağı · bugün',
      description: 'Şubat sabahı. Trafik akıyor, ışıklar düzgün yanıyor, direkte solmuş karanfiller.',
      width: 344,
      height: 300,
      image: 'img_sabah',
      objects: [
        sceneObject('ob_kabin', 'Gri kontrol kabini', OB_KABIN, {
          discovers: 'clue_kabin',
          score: { ARASTIRMA: 60 },
          text: 'Kabinin kapağında parlak, yeni bir etiket: “Kart değişimi · 15.11 · H.K.” Kazadan bir gün sonra. Kabin kilitli; ama etiket kilidin dışında, herkesin göreceği yerde.',
          short: 'Bakım etiketi',
        }),
        sceneObject('ob_kamera', 'Tentenin altındaki kamera', OB_KAMERA, {
          discovers: 'clue_bufe_kamera',
          score: { ARASTIRMA: 40 },
          text: 'Köşedeki büfenin tentesinin altında, kavşağa bakan eski bir kamera. Kablosu büfenin içine giriyor. Lensinin üstünde örümcek ağı. Ama kırmızı ışığı yanıyor; çalışıyor.',
          short: 'Büfe kamerası',
        }),
        sceneObject('ob_cicek', 'Direkteki çiçekler', OB_CICEK, {
          discovers: 'clue_cicek',
          text: 'Naylona sarılı karanfiller ve bir kart: “Hatice ablamıza. Kat 3 temizlik ekibi.” Üç aydır kimse kaldırmamış.',
          short: 'Karanfiller',
        }),
        sceneObject('ob_buton', 'Yaya butonu', OB_BUTON, {
          score: { ARASTIRMA: -10 },
          text: 'Bastım. Yaya ışığı yeşile döndü, araçlar durdu. Bugün her şey kusursuz çalışıyor.',
          short: 'Buton',
        }),
        sceneObject('ob_pano', 'Reklam panosu', OB_PANO, {
          score: { ARASTIRMA: -10 },
          text: 'Bir kredi kartı reklamı: “Hayat beklemez.” Bazen bekler.',
          short: 'Pano',
        }),
      ],
    }),
    sceneDef('sc_otopark', {
      title: 'Yediemin otoparkı · beyaz sedan',
      description: 'Kestel yolunda, tel örgülü bir otopark. Volkan’ın arabası üç aydır burada, örtüsüz.',
      width: 344,
      height: 300,
      image: 'img_otopark',
      objects: [
        sceneObject('ob_tampon', 'Sol ön tampon', OB_TAMPON, {
          discovers: 'clue_tampon44',
          score: { ARASTIRMA: 60 },
          text: 'Sürtünme izi tamponun alt kenarında. Metreyi tuttum: yerden 44 santim. İzler yatay, aşağıya doğru. Bir insanın bacağına çarpan bir tampon bu kadar alçakta iz bırakmaz; ama yerde yatan birine sürtünen bir tampon bırakır.',
          short: 'Tampon 44 cm',
        }),
        sceneObject('ob_far', 'Sol far', OB_FAR, {
          discovers: 'clue_far',
          score: { ARASTIRMA: 40 },
          text: 'Farlar tek parça. Çizik bile yok. Sinyal camları da sağlam. Fabrika çıkışı gibi.',
          short: 'Farlar sağlam',
        }),
        sceneObject('ob_abs', 'Gösterge paneli', OB_ABS, {
          discovers: 'clue_abs',
          score: { ARASTIRMA: 60 },
          text: 'Kontağı açtırdım: ABS lambası yanıp sönüyor, sistem çalışıyor. 2019 model; ABS standart.',
          short: 'ABS',
        }),
        sceneObject('ob_ekran', 'Multimedya ekranı', OB_EKRAN, {
          discovers: 'ev_multimedya',
          score: { ARASTIRMA: 60 },
          text: 'Son aramalar: “Gül · 01.09 · Bluetooth · 02.30”. Telefonla değil, arabanın hoparlöründen konuşmuş. Ekranın kenarında bir çocuk doktorunun randevu hatırlatması: “14 Kasım 09.00.”',
          short: 'Arama kaydı',
        }),
        sceneObject('ob_bebek', 'Arka koltuk', OB_BEBEK, {
          text: 'Etiketi sökülmemiş bir bebek koltuğu. Kurulumu yarım kalmış.',
          short: 'Bebek koltuğu',
        }),
        sceneObject('ob_onluk', 'Koltuktaki önlük', OB_ONLUK, {
          score: { ARASTIRMA: -10 },
          text: 'Fabrika önlüğü, cebinde iplik tozu. O gece yorgun olduğunu zaten biliyorum.',
          short: 'Önlük',
        }),
      ],
    }),
  ],
  assets: [
    sceneAsset('img_gece', 'kavsak-gece'),
    sceneAsset('img_sabah', 'kavsak-sabah'),
    sceneAsset('img_otopark', 'otopark'),
  ],
};
