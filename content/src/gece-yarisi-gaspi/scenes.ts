import { mark, rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 30-scenes: dört aranabilir sahne. Görseller `scenes/<ad>.html`'den `npm run case:scenes -- gece-yarisi-gaspi`.
// Şekil sabitleri golden path'te `step.tapCenter(…)` için dışa aktarılır.

// Sırmakeş merdivenleri · 19 Ocak 01.10 olay yeri fotoğrafları
export const OB_CAM = rect(150, 210, 50, 36);
export const OB_ASKI = rect(84, 150, 44, 30);
export const OB_MOTOR = rect(240, 320, 80, 44);
export const OB_ECZANE = rect(250, 60, 70, 60);
export const OB_KEDI = rect(20, 300, 40, 30);
// Kılınçların evi
export const OB_ILAC = rect(40, 250, 56, 40);
export const OB_BALKON = rect(230, 40, 90, 110);
export const OB_AILE = rect(130, 90, 60, 50);
export const OB_VESIKALIK = rect(40, 120, 40, 50);
export const OB_SAAT = rect(150, 20, 40, 40);
// Acil servis koridoru
export const OB_TRIYAJ = rect(20, 40, 110, 70);
export const OB_CIZELGE = rect(200, 170, 80, 50);
export const OB_KAMERA = rect(290, 20, 40, 36);
export const OB_BANK = rect(30, 290, 140, 50);
// Tophane Kebap Salonu arka kapısı
export const OB_FIS = rect(60, 200, 60, 40);
export const OB_TEZGAH = rect(150, 120, 120, 70);
export const OB_PANO = rect(270, 220, 60, 90);
export const OB_AYNA = rect(20, 60, 60, 90);
export const OB_KAMERA2 = rect(290, 20, 40, 36);

const decoy = (category: 'ARASTIRMA', amount: number) => ({ score: { [category]: amount } });

export const scenes: CasePart = {
  scenes: [
    sceneDef('sc_merdiven', {
      title: 'Sırmakeş merdivenleri · 19 Ocak 01.10 fotoğrafları',
      description: 'Olaydan bir buçuk saat sonra çekilen olay yeri fotoğrafları.',
      width: 344,
      height: 380,
      image: 'img_merdiven',
      objects: [
        sceneObject('ob_cam', 'Kırık şişe', OB_CAM, {
          discovers: 'clue_cam',
          score: { ARASTIRMA: 60 },
          text: 'Otuz birinci basamakta kırık bir bira şişesi. Keskin kenarında koyu bir leke; yanında üç kan damlası. Bir avuç bu camın üstüne düşerse kesilir. Bıçak gerekmez.',
          short: 'Kanlı şişe camı',
        }),
        sceneObject('ob_aski', 'Çanta askısı', OB_ASKI, {
          discovers: 'clue_aski',
          score: { ARASTIRMA: 40 },
          text: 'Koparılmış deri askı, delil numarası 2. Sol halka kopmuş, sağdaki sağlam. Çanta soldan çekilmiş. Kadın, failin sol yanını görmüş olmalı.',
          short: 'Askı soldan kopmuş',
        }),
        sceneObject('ob_motor', 'Merdiven dibi', OB_MOTOR, {
          discovers: 'clue_motor',
          score: { ARASTIRMA: 40 },
          text: 'Alt başta, bakkalın önünde taze bir yağ lekesi. Yağmur suyunda gökkuşağı gibi yayılmış. Bir motor burada birkaç dakika rölantide beklemiş.',
          short: 'Motor yağı lekesi',
        }),
        sceneObject('ob_eczane', 'Eczane kamerası', OB_ECZANE, {
          ...decoy('ARASTIRMA', -10),
          effects: [mark('NEUTRAL', 'Kayıt hiç alınmamış; artık geri getirilemez. Burada harcanan zaman kayıptır.')],
          text: 'Nöbetçi eczanenin kubbe kamerası merdivenin üst başına bakıyor. Tutanakta tek satır: “Kayıt alınamadı.” Kimse ikinci kez sormamış. On beş gün sonra kayıt kendiliğinden silinmiş.',
          short: 'Kayıt yok',
        }),
        sceneObject('ob_kedi', 'Kedi', OB_KEDI, {
          ...decoy('ARASTIRMA', -10),
          text: 'Islak bir kedi, flaşa gözlerini kırpmış. Tophane’nin tek tarafsız tanığı. Ne yazık ki ifade vermiyor.',
          short: 'Kedi',
        }),
      ],
    }),
    sceneDef('sc_ev', {
      title: 'Kılınçların evi · Yıldırım',
      description: 'Barış’ın annesiyle yaşadığı iki oda bir salon.',
      width: 344,
      height: 380,
      image: 'img_ev',
      objects: [
        sceneObject('ob_ilac', 'Komodin', OB_ILAC, {
          discovers: 'clue_ates',
          score: { ARASTIRMA: 40 },
          text: 'Komodinde yarım kutu ateş düşürücü ve katlanmış bir e-reçete çıktısı: 18 Ocak, 17.40, aile hekimi. “Ateş 39,1.” Hasta bir çocuk. Bu bir mazeret değil; ama bir başlangıç.',
          short: 'E-reçete: ateş 39,1',
        }),
        sceneObject('ob_balkon', 'Balkon kapısı', OB_BALKON, {
          discovers: 'clue_balkon',
          score: { ARASTIRMA: 60 },
          text: 'Balkon dar, bir sandalye sığıyor. Başımı kaldırınca üst kattaki balkon demirinde erimiş mum damlaları gördüm. Biri orada, karanlıkta, mum yakmış.',
          short: 'Üst katta mum izi',
        }),
        sceneObject('ob_aile', 'Vitrin fotoğrafı', OB_AILE, {
          discovers: 'clue_aile_foto',
          score: { ARASTIRMA: 20 },
          text: 'Vitrinde çerçeveli bir fotoğraf: iki oğlan, eski bir motorun üstünde, on bir on iki yaşlarında. Aynı çene, aynı kaş, aynı dişlek gülüş.',
          short: 'İki çocuk, bir motor',
        }),
        sceneObject('ob_vesikalik', 'Ayna kenarı', OB_VESIKALIK, {
          discovers: 'clue_vesikalik',
          score: { ARASTIRMA: 40 },
          text: 'Aynanın kenarına sıkıştırılmış bir vesikalık: kasım tarihli, kurye kartı yenilemesi. Uzun saç, sakal, yorgun gözler. Dosyadaki kazınmış saçlı gençle aynı kişi olduğunu bilmesem tanımazdım.',
          short: 'Yeni vesikalık',
        }),
        sceneObject('ob_saat', 'Duvar saati', OB_SAAT, {
          ...decoy('ARASTIRMA', -10),
          text: 'Duvar saati beş dakika ileri. Sevim Hanım: “Hep ileri tutarım, geç kalmayalım diye.” Bu ev saatlere güvenmiyor.',
          short: 'İleri saat',
        }),
      ],
    }),
    sceneDef('sc_acil', {
      title: 'Devlet Hastanesi · acil servis koridoru',
      description: 'Kamuya açık bekleme koridoru; yeşil alan girişi.',
      width: 344,
      height: 380,
      image: 'img_acil',
      objects: [
        sceneObject('ob_triyaj', 'Triyaj panosu', OB_TRIYAJ, {
          discovers: 'clue_triyaj',
          score: { ARASTIRMA: 40 },
          text: 'Duvardaki triyaj panosu her gece silinir; ama görevli kâtip eski çıktıları bir klasörde tutuyor. 19 Ocak: “N. A., yeşil alan, geliş 00.21, el yaralanması, adli vaka.”',
          short: 'Geliş 00.21',
        }),
        sceneObject('ob_cizelge', 'Hemşire masası', OB_CIZELGE, {
          discovers: 'clue_gamze',
          score: { ARASTIRMA: 40 },
          text: 'Hemşire masasının arkasında ocak nöbet çizelgesi asılı. 18/19 Ocak gecesi yeşil alan sorumlu hemşiresi: G. Ateş. Gözlem formlarını sorumlu hemşire doldurur.',
          short: 'Sorumlu: G. Ateş',
        }),
        sceneObject('ob_kamera', 'Koridor kamerası', OB_KAMERA, {
          ...decoy('ARASTIRMA', -10),
          text: 'Tavanda bir kamera ve altında bir levha: “Görüntüler 30 gün saklanır.” Olay üç ay önceydi. Kamera o geceyi gördü ve unuttu.',
          short: '30 gün',
        }),
        sceneObject('ob_bank', 'Bekleme bankı', OB_BANK, {
          ...decoy('ARASTIRMA', -10),
          text: 'Plastik bekleme bankı. Birinin bıraktığı yarım simit, birinin unuttuğu tespih. Burada bekleyenlerin hepsi bir şeyi kaybetmiş.',
          short: 'Bank',
        }),
      ],
    }),
    sceneDef('sc_kebap', {
      title: 'Tophane Kebap Salonu · arka kapı',
      description: 'Kuryelerin sipariş aldığı arka kapı ve bekleme köşesi.',
      width: 344,
      height: 380,
      image: 'img_kebap',
      objects: [
        sceneObject('ob_fis', 'Sipariş fişleri', OB_FIS, {
          discovers: 'clue_siparis',
          score: { ARASTIRMA: 60 },
          text: 'Kasanın yanında ocak ayına ait fiş koçanı. 18 Ocak 23.31: “Kurye: Barış K.” Fişin arkasında kasiyerin tükenmez kalemle düştüğü not: “bereli, acele.”',
          short: 'Fiş 23.31 · “bereli”',
        }),
        sceneObject('ob_tezgah', 'Izgara tezgâhı', OB_TEZGAH, {
          discovers: 'clue_cemal',
          score: { ARASTIRMA: 60 },
          text: 'Cemal Usta şişleri çevirirken başını kaldırmadan konuştu: “O geceyi hatırlarım, yağmurdan. Kurye geç geldi, bereliydi. Kulağında halka vardı; ışıkta parladı. Adını bilmem. Kuryenin adı olmaz.”',
          short: 'Cemal Usta: “halka”',
        }),
        sceneObject('ob_pano', 'Kuryelerin panosu', OB_PANO, {
          discovers: 'clue_bahis',
          score: { ARASTIRMA: 40 },
          text: 'Mantar panoda maç fikstürü, kurye telefonları, bir kira ilanı. Bulaşıkçı çocuk yanıma geldi: “Ocakta buraya iki adam geldi abla. Bir kuryenin bahis borcunu sordular. Bereli olanın.” Adını bilmiyor.',
          short: 'Bahis borcu',
        }),
        sceneObject('ob_ayna', 'Kurye aynası', OB_AYNA, {
          ...decoy('ARASTIRMA', -10),
          text: 'Kapının yanındaki boy aynası. Kuryeler oturum açmadan önce burada özçekim yapıyormuş. Aynada yalnızca ben varım ve yağmur.',
          short: 'Boş ayna',
        }),
        sceneObject('ob_kamera2', 'Arka kapı kamerası', OB_KAMERA2, {
          ...decoy('ARASTIRMA', -10),
          text: 'Arka kapı kamerası. Cemal Usta omuz silkiyor: “Yirmi gün tutar, üstüne yazar.” O gece çoktan üstüne yazılmış.',
          short: 'Kayıt yok',
        }),
      ],
    }),
  ],
  assets: [
    sceneAsset('img_merdiven', 'sirmakes-merdiven'),
    sceneAsset('img_ev', 'kilinc-evi'),
    sceneAsset('img_acil', 'acil-koridor'),
    sceneAsset('img_kebap', 'kebap-arka-kapi'),
  ],
};
