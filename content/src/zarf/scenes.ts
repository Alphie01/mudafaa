import { flag, not, rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 30-scenes: dört aranabilir sahne. Görseller `scenes/<ad>.html`'den `npm run case:scenes -- zarf` ile üretilir.

// Kontrol odası
export const OB_TAKVIM = rect(196, 120, 40, 26);
export const OB_RAF = rect(24, 40, 80, 50);
export const OB_CEKMECE = rect(150, 168, 50, 22);
export const OB_BARDAK = rect(250, 122, 16, 22);
export const OB_SAKSI = rect(290, 70, 34, 50);
export const OB_DAHILI = rect(120, 120, 34, 24);

// 2. kat koridoru
export const OB_REHBER = rect(30, 70, 50, 60);
export const OB_KAMERA = rect(160, 14, 30, 20);
export const OB_DOLAP = rect(100, 100, 50, 100);
export const OB_OCAK = rect(270, 80, 60, 120);
export const OB_YANGIN = rect(210, 140, 24, 40);
export const OB_SEBIL = rect(176, 150, 24, 50);

// Kamera karesi (10.41.07)
export const OB_DAMGA = rect(220, 10, 110, 18);
export const OB_BILEK = rect(150, 150, 26, 18);
export const OB_KOLTUK = rect(112, 120, 34, 30);
export const OB_MERDIVEN = rect(20, 100, 70, 150);
export const OB_PENCERE = rect(250, 60, 70, 60);

// Arşiv
export const OB_CILTLER = rect(30, 50, 110, 90);
export const OB_ZIMMET = rect(200, 150, 60, 24);
export const OB_MASA = rect(180, 180, 120, 40);
export const OB_PENCERE_A = rect(250, 30, 70, 60);
export const OB_KUTU = rect(40, 200, 70, 50);

const decoy = (text: string, short: string) => ({
  text,
  short,
  score: { ARASTIRMA: -10 },
});

export const scenes: CasePart = {
  scenes: [
    sceneDef('sc_oda', {
      title: 'Kontrol odası',
      description: 'İkinci kat, 231. Halil Ekinci’nin yirmi yıllık masası; eşyaları koliye konmuş, masa hâlâ yerinde.',
      width: 344,
      height: 300,
      image: 'img_oda',
      objects: [
        sceneObject('ob_takvim', 'Masa takvimi', OB_TAKVIM, {
          discovers: 'clue_takvim_214',
          score: { ARASTIRMA: 60 },
          text: 'Masa takvimi 12 Mart’ta kalmış. Dik, kurallı bir el yazısı: “10.35 — 214 — Md. Hn.?” Arayanın dahili numarası ve bir soru işareti.',
          short: 'Takvim',
        }),
        sceneObject('ob_raf', 'Dosya rafı', OB_RAF, {
          discovers: 'clue_toz_izi',
          score: { ARASTIRMA: 40 },
          text: 'Raf tozlu; bir tek dikdörtgen temiz. Defter boyutunda. Bir şey burada yıllarca durmuş, sonra kaldırılmış.',
          short: 'Toz izi',
        }),
        sceneObject('ob_cekmece', 'Üçüncü çekmece', OB_CEKMECE, {
          discovers: 'clue_kilit',
          score: { ARASTIRMA: 40 },
          text: 'Üçüncü çekmece. Kilidinin dili pastan kımıldamıyor; anahtarı hiç olmamış gibi. Bu çekmeceyi isteyen herkes açabilirdi.',
          short: 'Çekmece',
        }),
        sceneObject('ob_dahili', 'Dahili telefon', OB_DAHILI, {
          score: { ARASTIRMA: 20 },
          text: 'Krem rengi, ekranlı bir dahili telefon. Arayanın numarasını gösteriyor ama hafızası her gece siliniyor. Yedi hafta önceki bir sabahı hatırlamaz.',
          short: 'Dahili',
        }),
        sceneObject('ob_bardak', 'Çay bardağı', OB_BARDAK, {
          ...decoy(
            'İnce belli bir bardak, dibinde yedi haftalık kurumuş çay. Kimse yıkamamış. Bir alışkanlığın fosili; delil değil.',
            'Bardak',
          ),
        }),
        sceneObject('ob_saksi', 'Sardunya', OB_SAKSI, {
          ...decoy(
            'Kurumuş bir sardunya. Toprağı çatlamış. Halil her sabah sularmış; yedi haftadır kimse sulamamış.',
            'Saksı',
          ),
        }),
      ],
    }),
    sceneDef('sc_koridor', {
      title: 'İkinci kat koridoru',
      description: 'Florasan, linolyum, sıra fişi makinesinin uzaktan gelen sesi. Bir pano, bir dolap, bir çay ocağı.',
      width: 344,
      height: 300,
      image: 'img_koridor',
      objects: [
        sceneObject('ob_rehber', 'Dahili rehber panosu', OB_REHBER, {
          discovers: 'clue_rehber_214',
          score: { ARASTIRMA: 60 },
          text: 'Camlı panoda dahili liste. “201 — Müdürlük Makamı (Sekr.)”. “214 — Devir Servisi-2 (S. Kaplan, G. Erdem)”. “231 — Kontrol (H. Ekinci)”.',
          short: 'Rehber',
        }),
        sceneObject('ob_kamera', 'Dom kamera', OB_KAMERA, {
          discovers: 'clue_kamera_var',
          score: { ARASTIRMA: 40 },
          text: 'Tavanda bir dom kamera; merdivene dönük, kontrol odasının kapısı kadrajın kenarında. Etiket: “Kayıt süresi 90 gün.” Saat işliyor.',
          short: 'Kamera',
        }),
        sceneObject('ob_dolap', 'Evrak dolabı', OB_DOLAP, {
          discovers: 'clue_zarf_stok',
          score: { ARASTIRMA: 40 },
          text: 'Kahverengi iç yazışma zarfları, lastiklerle bağlı desteler. Her destenin üstünde bir barkod aralığı: “0451–0500”. Zarflar servislere zimmetle veriliyormuş.',
          short: 'Zarflar',
        }),
        sceneObject('ob_ocak', 'Çay ocağı', OB_OCAK, {
          score: { ARASTIRMA: 20 },
          text: 'Çay ocağının kapısı aralık; demlik buharı, bir radyo. İçeride yaşlı bir çaycı, bir deftere bir şey yazıyor. Seni görünce defteri kapatıyor.',
          short: 'Çay ocağı',
        }),
        sceneObject('ob_yangin', 'Yangın dolabı', OB_YANGIN, {
          ...decoy('Kırmızı bir yangın dolabı; camında “Acil durumda kırınız.” Bu dosyada acil olan başka şeyler var.', 'Yangın dolabı'),
        }),
        sceneObject('ob_sebil', 'Su sebili', OB_SEBIL, {
          ...decoy('Bir su sebili, boş damacana, plastik bardaklar. Herkes buradan geçer; kimse bir şey bırakmaz.', 'Sebil'),
        }),
      ],
    }),
    sceneDef('sc_kamera', {
      title: 'Kamera karesi · 10.41.07',
      description: 'Koridor kamerasının dondurulmuş karesi: grenli, mavi, merdivene dönük.',
      width: 344,
      height: 300,
      image: 'img_kamera',
      objects: [
        sceneObject('ob_damga', 'Zaman damgası', OB_DAMGA, {
          discovers: 'clue_kare_saat',
          score: { ARASTIRMA: 60 },
          text: '“12.03.2027 10:41:07.” Kadrajın kenarında kontrol odasının kapısı açılıyor. Bir sonraki karede, 10:41:27, aynı kişi çıkıyor. Halil o sırada aşağıda bekliyordu.',
          short: 'Zaman damgası',
        }),
        sceneObject('ob_bilek', 'Kapı koluna uzanan el', OB_BILEK, {
          discovers: 'clue_kol_saat',
          score: { ARASTIRMA: 60 },
          text: 'Kapı koluna uzanan sol el. Bileğinde küçük, dikdörtgen, yeşil bir ışık: dijital bir saat ekranı. Gren bile o yeşili yutamamış.',
          short: 'Bilek',
        }),
        sceneObject('ob_koltuk', 'Koltuk altı', OB_KOLTUK, {
          discovers: 'clue_kare_zarf',
          score: { ARASTIRMA: 40 },
          text: 'Açık renk bir ceket. Koltuğunun altında kahverengi bir köşe; bir zarfın köşesi. Çıkış karesinde o köşe yok.',
          short: 'Ceket',
        }),
        sceneObject('ob_merdiven', 'Merdiven', OB_MERDIVEN, {
          ...decoy(
            'Merdivende bulanık iki takipçi; ellerinde dosyalar. Biri telefonla konuşuyor. Her sabah oradalar; bu sabah da oradaydılar.',
            'Merdiven',
          ),
        }),
        sceneObject('ob_pencere', 'Koridor penceresi', OB_PENCERE, {
          ...decoy('Pencerede yağmur, gren, bir ışık patlaması. Dışarıdaki bir şey değil; kameranın kendi gürültüsü.', 'Pencere'),
        }),
      ],
    }),
    sceneDef('sc_arsiv', {
      title: 'Arşiv',
      description: 'Bodrum kokulu, dar bir oda: ciltler, raflar, bir masa, tek bir pencere.',
      width: 344,
      height: 300,
      image: 'img_arsiv',
      objects: [
        sceneObject('ob_ciltler_defter', '1987 ciltleri', OB_CILTLER, {
          activeWhen: flag('fact_defter_yeri'),
          discovers: 'ev_kirmizi_defter',
          score: { ARASTIRMA: 80 },
          text: '1987 ciltlerinin arkasında, duvarla raf arasında: kırmızı kaplı bir defter. Ciltler yerinden oynatılmış ama kimse en arkaya uzanmamış.',
          short: 'Defter',
        }),
        sceneObject('ob_ciltler', '1987 ciltleri', OB_CILTLER, {
          activeWhen: not(flag('fact_defter_yeri')),
          score: { ARASTIRMA: 20 },
          text: '1987 ciltleri yerinden oynatılmış; biri sırtlarını tek tek çekip bakmış. Ne aradığını bilmeden aramak, uzun sürer.',
          short: 'Ciltler',
        }),
        sceneObject('ob_zimmet', 'Zimmet defteri', OB_ZIMMET, {
          discovers: 'clue_zimmet',
          score: { ARASTIRMA: 60 },
          text: 'Evrak zimmet defteri. 1 Mart satırı: “İç yazışma zarfı, barkod 0401–0450 — teslim alan: Devir Servisi-2 — paraf: S.K.”',
          short: 'Zimmet',
        }),
        sceneObject('ob_masa', 'Arşiv masası', OB_MASA, {
          ...decoy('Çizik bir masa, bir büyüteç, bir kutu ataç. Arşivciler gibi sabırlı bir masa. Söyleyecek bir şeyi yok.', 'Masa'),
        }),
        sceneObject('ob_pencere_a', 'Tek pencere', OB_PENCERE_A, {
          ...decoy('Avluya bakan tek pencere; parmaklıklı. Yağmur damlaları demirde birikip düşüyor.', 'Pencere'),
        }),
        sceneObject('ob_kutu', 'İmha kutusu', OB_KUTU, {
          ...decoy('“İMHA — 2019” yazılı bir koli. İçinde sararmış dilekçeler. Zamanında bekletilmiş başka işler.', 'Koli'),
        }),
      ],
    }),
  ],
  assets: [
    sceneAsset('img_oda', 'kontrol-odasi'),
    sceneAsset('img_koridor', 'koridor'),
    sceneAsset('img_kamera', 'kamera-karesi'),
    sceneAsset('img_arsiv', 'arsiv'),
  ],
};
