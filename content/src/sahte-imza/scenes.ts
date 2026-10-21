import { mark, raise, rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 30-scenes: üç aranabilir sahne. Görseller `scenes/<ad>.html`'den `npm run case:scenes -- sahte-imza`.
// Şekil sabitleri golden path'te `step.tapCenter(…)` için dışa aktarılır.

// Ateş Matbaası
export const OB_LISTE = rect(18, 70, 46, 60);
export const OB_YAZICI = rect(230, 150, 90, 60);
export const OB_TAKVIM = rect(90, 40, 60, 60);
export const OB_MAKAS = rect(150, 250, 60, 40);
export const OB_KASE = rect(250, 260, 70, 50);
export const OB_ASKI = rect(20, 170, 40, 90);
export const OB_KLASOR = rect(170, 40, 50, 70);
export const OB_DIZGI = rect(70, 280, 70, 80);
// Hisar evi
export const OB_DOSYA = rect(230, 230, 80, 50);
export const OB_RUHSAT = rect(20, 60, 50, 70);
export const OB_AILE = rect(140, 60, 60, 50);
export const OB_DEFTER = rect(120, 250, 70, 50);
export const OB_KILIT = rect(30, 200, 30, 40);
export const OB_CUMBA = rect(250, 40, 80, 120);
// Kılınç Gayrimenkul
export const OB_MASATAKVIM = rect(140, 210, 60, 40);
export const OB_KARBON = rect(220, 220, 70, 40);
export const OB_AKVARYUM = rect(20, 100, 100, 80);
export const OB_KASA = rect(250, 60, 70, 90);
export const OB_SENETLER = rect(40, 260, 80, 50);

const decoy = (feedback: string) => ({
  score: { ARASTIRMA: -10 },
  effects: [mark('NEUTRAL', feedback)],
});

export const scenes: CasePart = {
  assets: [
    sceneAsset('img_matbaa', 'matbaa'),
    sceneAsset('img_hisar', 'hisar-evi'),
    sceneAsset('img_emlak', 'emlak-burosu'),
  ],
  scenes: [
    sceneDef('sc_matbaa', {
      title: 'Ateş Matbaası · Kayhan',
      description: 'Kurşun dizgi makinesi, lazer yazıcı, kesim masası ve kapının arkasındaki askı.',
      width: 344,
      height: 380,
      image: 'img_matbaa',
      objects: [
        sceneObject('ob_liste', 'Numara çizelgesi', OB_LISTE, {
          discovers: 'clue_tel_liste',
          score: { ARASTIRMA: 40 },
          text: 'Kapının yanına raptiyelenmiş yağlı bir kâğıt: dükkânın altı numarası. Vedat, Sevgi, Tarık, Emre, kâğıtçı, kargo. Vedat’ın el yazısı; bir numaranın üstü iki kez düzeltilmiş.',
          short: 'Numara çizelgesi',
        }),
        sceneObject('ob_yazici', 'Lazer yazıcı', OB_YAZICI, {
          discovers: 'clue_yazici',
          score: { ARASTIRMA: 60 },
          text: 'Renkli lazer yazıcının ekranında iş günlüğü. Altı ayda gece yarısından sonra tek bir iş: 6 Şubat, 02.14, iki sayfa, 90 gram, renkli. Gönderen: MATBAA-PC.',
          short: 'Gece 02.14 baskısı',
        }),
        sceneObject('ob_takvim', 'Duvar takvimi', OB_TAKVIM, {
          discovers: 'clue_takvim',
          score: { ARASTIRMA: 60 },
          text: 'Bir kâğıtçının promosyon takvimi. Şubat sayfası hâlâ duruyor; kimse çevirmemiş. 18 Şubat kutusunda kurşun kalemle: “Termal broşür · kargo 11.30”.',
          short: 'Kargo 11.30',
        }),
        sceneObject('ob_makas', 'Kesim masası', OB_MAKAS, {
          discovers: 'clue_makas',
          score: { ARASTIRMA: 40 },
          text: 'Ortak kesim masasındaki küçük giyotin makasının kolu sökülüp sol tarafa takılmış. Vidaların yanında taze çizikler. Dükkânda herkes bu masayı kullanıyor.',
          short: 'Kolu solda bir makas',
        }),
        sceneObject('ob_kase', 'Kaşe makinesi', OB_KASE, {
          discovers: 'clue_kase',
          score: { ARASTIRMA: 20 },
          text: 'Polimer kaşe pozlama makinesi. Çekmecede esnaf kaşeleri: “Kayhan Börek”, “Nilüfer Kırtasiye”. Noter mührüne benzeyen bir kalıp yok. Savcının seveceği bir makine.',
          short: 'Kaşe makinesi',
        }),
        sceneObject('ob_aski', 'Kapı arkası', OB_ASKI, {
          discovers: 'clue_aski',
          score: { ARASTIRMA: 40 },
          text: 'Kapının arkasında tek bir askı. Vedat’ın ceketi orada, iç cebi şişkin. Dükkâna giren herkes bu askının önünden geçiyor; ceketin cebi bir kol boyu uzakta.',
          short: 'Ceket askısı',
        }),
        sceneObject('ob_klasor', 'İrsaliye klasörü', OB_KLASOR, {
          score: { ARASTIRMA: 40 },
          effects: [raise('fact_irsaliye')],
          text: 'Rafta “İRSALİYE 2026” yazılı bir klasör. Karbon nüshalar duruyor; polisin götürdüklerinin kopyaları da. Yakından incelenmeye değer. (Arşiv sekmesine eklendi.)',
          short: 'İrsaliye klasörü',
        }),
        sceneObject('ob_dizgi', 'Kurşun dizgi makinesi', OB_DIZGI, {
          ...decoy('Elli yıllık bir makine; davayla ilgisi yok. Ama güzel.'),
          text: '1971 yapımı bir Heidelberg. Kurşun harfler, tıkırtı, yağ kokusu. Davayla ilgisi yok; ama Vedat’ın bütün hayatı bu makinenin sesinde.',
          short: 'Dizgi makinesi',
        }),
      ],
    }),
    sceneDef('sc_hisar', {
      title: 'Hisar · Hayriye Ateş’in evi',
      description: 'Cumbalı, ahşap ev; şubattan beri boş.',
      width: 344,
      height: 380,
      image: 'img_hisar',
      objects: [
        sceneObject('ob_dosya', 'Yazı masası', OB_DOSYA, {
          discovers: 'clue_bos_dosya',
          score: { ARASTIRMA: 40 },
          text: 'Yazı masasının çekmecesinde elle “VEKÂLET” yazılmış bir karton dosya. Boş. Yanında banka dekontları, elektrik faturaları, bir 2023 noter makbuzu.',
          short: 'Boş vekâlet dosyası',
        }),
        sceneObject('ob_ruhsat', 'Kapıdaki kâğıt', OB_RUHSAT, {
          discovers: 'clue_ruhsat',
          score: { ARASTIRMA: 20 },
          text: 'Kapının içine bantlanmış belediye tadilat izni: malik Erol Kılınç, 25 Şubat. Satıştan bir hafta sonra. Alıcı acele etmiş.',
          short: 'Tadilat izni',
        }),
        sceneObject('ob_aile', 'Çerçeveli fotoğraf', OB_AILE, {
          discovers: 'clue_aile_foto',
          score: { ARASTIRMA: 20 },
          text: 'Bahçede bir aile: genç bir Hayriye, iki oğlu, bir kızı ve ön sırada yedi yaşlarında bir çocuk. Arkasında el yazısı: “Bayram 1992”. Herkes gülüyor; çocuk hariç.',
          short: 'Aile fotoğrafı',
        }),
        sceneObject('ob_defter', 'Terzi defteri', OB_DEFTER, {
          score: { ARASTIRMA: 20 },
          effects: [
            mark('NEUTRAL', 'Hayriye Hanım’ın imzası özenli ve düzgün; ama bu dosyada tartışılan onun imzası değil.'),
          ],
          text: 'Hayriye Hanım’ın ölçü defteri: kırk yılın müşterileri, boy, bel, kol. Son sayfalarda titreyen bir el, aynı adı tekrar tekrar yazmış: “Hayriye. Hayriye. Hayriye.”',
          short: 'Ölçü defteri',
        }),
        sceneObject('ob_kilit', 'Yeni kilit', OB_KILIT, {
          ...decoy('Kilidi alıcı değiştirmiş; zaten bilinen bir şey.'),
          text: 'Parlak, yeni bir kilit. İçeriden bakınca vidaları aceleyle sıkılmış. Alıcı değiştirmiş; Nermin Hanım da bundan anlamış satışı.',
          short: 'Yeni kilit',
        }),
        sceneObject('ob_cumba', 'Cumba', OB_CUMBA, {
          ...decoy('Bir dikiş makinesi ve bir perde. Hatıra, delil değil.'),
          text: 'Cumbada üstü örtülü bir dikiş makinesi. Perde yarı açık; aşağıda Hisar’ın yokuşu. Hayriye Hanım kırk yıl buradan dünyayı izlemiş.',
          short: 'Dikiş makinesi',
        }),
      ],
    }),
    sceneDef('sc_emlak', {
      title: 'Kılınç Gayrimenkul · Setbaşı',
      description: 'Erol Kılınç’ın bürosu; o telefondayken masasının üstü.',
      width: 344,
      height: 380,
      image: 'img_emlak',
      objects: [
        sceneObject('ob_masatakvim', 'Masa takvimi', OB_MASATAKVIM, {
          discovers: 'clue_mahsup',
          score: { ARASTIRMA: 60 },
          effects: [raise('fact_mahsup')],
          text: 'Masanın üstünde açık bir masa takvimi, şubat. 18 Şubat: “Hisar tapu 11.15 · T. · mahsup 1.400”. Mürekkep, sanki aceleyle yazılmış gibi bastırılmış.',
          short: '“T. · mahsup 1.400”',
        }),
        sceneObject('ob_karbon', 'Makbuz koçanı', OB_KARBON, {
          score: { ARASTIRMA: 40 },
          effects: [mark('GOOD', 'Kapora makbuzunun karbonunda da aynı yavaş, sola yatık imza var.', 'ARASTIRMA')],
          text: 'Kapora makbuzlarının koçanı. 9 Şubat’taki karbon nüshada “V. Ateş” imzası: yavaş, kalın, harfleri sola yatık. Bu imzayı irsaliyelerde de görmüştüm.',
          short: 'Makbuz karbonu',
        }),
        sceneObject('ob_senetler', 'Senet dosyası', OB_SENETLER, {
          ...decoy('Erol’un başka borçluları; bu dosyanın değil, belki başka bir dosyanın konusu.'),
          text: 'Yarı açık bir dosyada bonolar: isimler, tarihler, faiz yazmayan tutarlar. Erol’un “emlakçılığı” geniş bir iş. Ama bu dosyanın sorusu bu değil.',
          short: 'Bonolar',
        }),
        sceneObject('ob_akvaryum', 'Akvaryum', OB_AKVARYUM, {
          ...decoy('Bir balık. İfade vermiyor.'),
          text: 'Tek bir turuncu balık, büyük ve yavaş. Erol gibi; camın arkasından her şeyi izliyor ve hiçbir şey söylemiyor.',
          short: 'Akvaryum',
        }),
        sceneObject('ob_kasa', 'Çelik kasa', OB_KASA, {
          ...decoy('Kilitli bir kasa. Açmak senin işin değil.'),
          text: 'Duvara gömülü çelik bir kasa. Kilitli. Avukatın elinin değmemesi gereken bir şey varsa, odur.',
          short: 'Kasa',
        }),
      ],
    }),
  ],
};
