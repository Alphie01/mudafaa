import { mark, raise, rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 30-scenes: üç aranabilir sahne. Görseller `scenes/<ad>.html`'den `npm run case:scenes -- belediye-kasasi`.
// Şekil sabitleri golden path'te `step.tapCenter(…)` için dışa aktarılır.

// Vezne salonu (Hisarönü Belediyesi, zemin kat)
export const OB_YONERGE = rect(18, 40, 70, 84);
export const OB_VZ02 = rect(196, 168, 60, 40);
export const OB_POSTIT = rect(112, 168, 50, 36);
export const OB_KAMERA = rect(150, 6, 44, 30);
export const OB_ONODA = rect(270, 60, 64, 150);
export const OB_TUSTAKIMI = rect(104, 70, 40, 54);
export const OB_TURNIKE = rect(20, 300, 90, 60);
export const OB_SIRA = rect(230, 300, 70, 60);
// Orhan’ın çalışma masası (Kılıçların evi)
export const OB_DEFTER = rect(40, 200, 80, 50);
export const OB_KARBON = rect(140, 210, 70, 40);
export const OB_PDKS = rect(230, 200, 80, 50);
export const OB_KLASOR = rect(30, 60, 90, 100);
export const OB_TAPU = rect(250, 90, 70, 60);
export const OB_SATRANC = rect(140, 290, 70, 50);
export const OB_RANDEVU = rect(150, 70, 60, 50);
// Ön oda (Mali Hizmetler Müdürlüğü; bilirkişiyle keşif)
export const OB_PC03 = rect(120, 120, 100, 70);
export const OB_TUS = rect(290, 110, 40, 60);
export const OB_TAKVIM = rect(20, 40, 70, 80);
export const OB_YAZICI = rect(20, 210, 80, 60);
export const OB_CEKMECE = rect(230, 230, 90, 50);
export const OB_COP = rect(150, 300, 50, 50);

export const scenes: CasePart = {
  scenes: [
    sceneDef('sc_vezne', {
      title: 'Hisarönü Belediyesi · vezne salonu',
      description: 'Zemin kat; iki vezne camı, pano, turnike, ön odanın buzlu camlı kapısı.',
      width: 344,
      height: 380,
      image: 'img_vezne',
      objects: [
        sceneObject('ob_yonerge', 'Duyuru panosu', OB_YONERGE, {
          discovers: ['ev_yonerge', 'clue_yonerge'],
          score: { ARASTIRMA: 60 },
          text: 'Raptiyelerin arasında sararmış bir yönerge. Madde 7, kalın harflerle: “Şifreler hiçbir koşulda paylaşılmaz, yazılmaz, zarfa konmaz.” Zarf kelimesinin altını biri tükenmez kalemle çizmiş.',
          short: 'Yönerge: zarf yasak',
        }),
        sceneObject('ob_vz02', 'Vezne 2 terminali', OB_VZ02, {
          score: { ARASTIRMA: 40 },
          effects: [raise('fact_vz02')],
          text: 'Orhan’ın camının arkasındaki bilgisayar. Kasasının üstünde bir etiket: VZ-02. Ekranın kenarında, kuruşu kuruşuna yazılmış eski bir hesap pusulası hâlâ yapışık.',
          short: 'Etiket: VZ-02',
        }),
        sceneObject('ob_postit', 'Vezne 1 monitörü', OB_POSTIT, {
          discovers: 'clue_postit',
          score: { ARASTIRMA: 10 },
          text: 'Melek’in monitörünün kenarında sarı bir not kâğıdı: “M. y. 1989.” Bir şifre olabilir. Bir doğum yılı da. Bir şeyin ilk harfleri de.',
          short: '“M. y. 1989”',
        }),
        sceneObject('ob_kamera', 'Tavan kamerası', OB_KAMERA, {
          discovers: 'clue_kamera',
          score: { ARASTIRMA: 10 },
          text: 'Tavanda tek bir kubbe kamera. Açısı sıraya, bekleyenlerin başlarına dönük. Vezne camlarının arkası, ekranlar, ön odanın kapısı kör noktada. Güvenlikçi: “Otuz gün tutar, sonra üstüne yazar.”',
          short: 'Kamera sıraya bakıyor',
        }),
        sceneObject('ob_onoda', 'Buzlu camlı kapı', OB_ONODA, {
          score: { ARASTIRMA: 40 },
          effects: [raise('fact_onoda')],
          text: 'Veznelerin arkasında, müdürlüğe açılan bir kapı. Buzlu camın ardında bir monitörün mavi ışığı. Kapıda yazı: “ÖN ODA — Personel dışında girilmez.” Kapı kilitli değil.',
          short: 'Ön odada bir bilgisayar',
        }),
        sceneObject('ob_tustakimi', 'Kasa odası kapısı', OB_TUSTAKIMI, {
          score: { ARASTIRMA: 40 },
          effects: [raise('fact_kasa_kod')],
          text: 'Çelik kapının yanında bir tuş takımı ve küçük bir ekran: “KULLANICI KODU + ŞİFRE.” Altında güvenlik firmasının etiketi ve bir telefon numarası. Her açılış kayda geçiyor olmalı.',
          short: 'Kasa odası kodlu',
        }),
        sceneObject('ob_turnike', 'Personel turnikesi', OB_TURNIKE, {
          score: { ARASTIRMA: 20 },
          effects: [raise('fact_turnike')],
          text: 'Personel girişindeki turnike; kart okutmadan geçilmiyor. Görevli: “Herkes okutur abla, müdür de okutur. İnsan kaynakları her ay döker.”',
          short: 'Herkesin giriş-çıkışı kayıtlı',
        }),
        sceneObject('ob_sira', 'Sıra fişi makinesi', OB_SIRA, {
          score: { ARASTIRMA: -10 },
          effects: [mark('NEUTRAL', 'Sıra makinesi kimin para yatırdığını söyler, kimin iptal ettiğini değil.')],
          text: 'Ekranda “SON NUMARA 214” yazıyor. Biri bekledi, biri saydı, biri unuttu. Makine yalnızca sırayı hatırlar.',
          short: 'Sıra makinesi',
        }),
      ],
    }),
    sceneDef('sc_calisma', {
      title: 'Kılıçların evi · Orhan’ın çalışma masası',
      description: 'Yıldırım’da dördüncü kat; salonun köşesine sıkıştırılmış bir masa ve iki raf klasör.',
      width: 344,
      height: 380,
      image: 'img_calisma',
      objects: [
        sceneObject('ob_defter', 'Kasa defteri', OB_DEFTER, {
          discovers: ['ev_defter', 'clue_defter'],
          score: { ARASTIRMA: 60 },
          text: 'Yirmi üçüncü cilt. Her sayfada bir gün, kurşun kalemle, kuruşu kuruşuna: “12.02 — 41.250,00.” Orhan kasayı saydıktan sonra kendi defterine de yazmış. On dokuz yıl, her akşam.',
          short: 'Günlük kasa toplamları',
        }),
        sceneObject('ob_karbon', 'Sarı kopyalar', OB_KARBON, {
          discovers: 'ev_karbon',
          score: { ARASTIRMA: 60 },
          text: 'Lastikle bağlanmış bir deste sarı kâğıt: teslim tutanaklarının karbon nüshaları. “Teslim eden: O. Kılıç” imzalı. “Teslim alan” kutusu her birinde boş.',
          short: 'Karbon tutanaklar',
        }),
        sceneObject('ob_pdks', 'İnsan kaynakları zarfı', OB_PDKS, {
          discovers: 'ev_pdks',
          score: { ARASTIRMA: 40 },
          text: 'Açılmış bir resmî zarf. İçinde Orhan’ın kendi turnike dökümü; görevden uzaklaştırılmadan bir hafta önce istemiş. Kenarında Nazan’ın el yazısı: “Avukata göster.”',
          short: 'Turnike dökümü',
        }),
        sceneObject('ob_klasor', 'Mavi klasörler', OB_KLASOR, {
          discovers: 'ev_talimat',
          score: { ARASTIRMA: 60 },
          effects: [raise('fact_talimat')],
          text: '“Maaş bordroları 2025” klasörünün arasından katlanmış bir kareli kâğıt kaydı. El yazısı, eğik ve düzgün: “Şifreler zarfta, müdürlükte kalacak. Devamlılık için. — Müdürlük.” İmza yok. Tarih: Eylül 2025.',
          short: 'El yazısı not: Müdürlük',
        }),
        sceneObject('ob_tapu', 'Tapu dosyası', OB_TAPU, {
          discovers: 'ev_tapu',
          score: { ARASTIRMA: 40 },
          text: 'Şeffaf bir dosyada tapu satış senedi: İnegöl, Tahtaköprü, 4 dönüm tarla. 17 Aralık. Satıcı Orhan Kılıç, “intikal”. Bedel: 215.000 TL.',
          short: 'Tarla satış senedi',
        }),
        sceneObject('ob_satranc', 'Satranç tahtası', OB_SATRANC, {
          discovers: 'clue_satranc',
          score: { ARASTIRMA: 10 },
          text: 'Yarım kalmış bir oyun. Beyazlar saldırmış, siyahların hamlesi. Taşların üstünde ince bir toz. Orhan kendi kendine oynuyor; hamle sırası aylardır aynı yerde.',
          short: 'Bekleyen bir oyun',
        }),
        sceneObject('ob_randevu', 'Panodaki kart', OB_RANDEVU, {
          score: { ARASTIRMA: 20 },
          effects: [raise('fact_9ocak')],
          text: 'Mantar panoda bir hastane randevu kartı: “Uludağ Ünv. Çocuk Kardiyoloji — Elif Kılıç — 9 Ocak 10.30.” Yanında Elif’in çizdiği bir kalp; içinde “babam” yazıyor.',
          short: '9 Ocak hastane',
        }),
      ],
    }),
    sceneDef('sc_onoda', {
      title: 'Mali Hizmetler · ön oda (keşif)',
      description:
        'Veznelerin arkasındaki ortak oda: bir bilgisayar, bir yazıcı, bir takvim, müdür yardımcılığına açılan kapı.',
      width: 344,
      height: 380,
      image: 'img_onoda',
      objects: [
        sceneObject('ob_pc03', 'Ortak bilgisayar', OB_PC03, {
          score: { ARASTIRMA: 60 },
          effects: [raise('fact_pc03')],
          text: 'Kasasında bir etiket: MHM-PC03. Bilirkişi oturumu açtırdı; vezne programı simgesi masaüstünde. Kullanıcı adı kutusu boş, imleç yanıp sönüyor. Seda Karaca tek kelime söyledi: “Kısıt yok.”',
          short: 'MHM-PC03',
        }),
        sceneObject('ob_tus', 'Kasa odası tuş takımı (iç)', OB_TUS, {
          score: { ARASTIRMA: 40 },
          effects: [raise('fact_tus02')],
          text: 'Ön odadan kasa odasına açılan ikinci kapı. Tuş takımında iki tuşun boyası aşınmış: 0 ve 2. Diğerleri yeni gibi. Bilirkişi fotoğrafladı, tutanağa yazdırdı.',
          short: 'Aşınmış 0 ve 2',
        }),
        sceneObject('ob_takvim', 'Duvar takvimi', OB_TAKVIM, {
          discovers: 'clue_cuma',
          score: { ARASTIRMA: 40 },
          effects: [raise('fact_cuma')],
          text: 'Bir bankanın promosyon takvimi. Kasım’dan Şubat’a bazı cumalar kurşun kalemle halkalanmış; 13 Şubat da. Rakam yok, isim yok. Bilirkişi iptal listesini yanına tuttu: her halkadan önceki iki iş gününde iptal var.',
          short: 'İşaretli cumalar',
        }),
        sceneObject('ob_yazici', 'Yazıcı', OB_YAZICI, {
          score: { ARASTIRMA: 40 },
          effects: [raise('fact_yazici')],
          text: 'Bilirkişi yazıcının iş günlüğünü bastırdı: iptal günlerinin her birinde 17.50 ile 17.58 arasında iki sayfalık bir “gün sonu raporu”, kullanıcı “okilic”. Aynı gün 16.58’de de bir tane.',
          short: 'Gün sonu raporu iki kez',
        }),
        sceneObject('ob_cekmece', 'Kilitli çekmece', OB_CEKMECE, {
          score: { USUL_BILGISI: 20 },
          effects: [
            mark(
              'GOOD',
              'Kilitli çekmeceyi açmaya kalkmadın; keşif tutanağına yazdırdın. Arama, savcılığın işidir (CMK 116, 119).',
              'USUL_BILGISI',
            ),
          ],
          text: 'Müdür yardımcılığı odasının kapısının yanında, ön odaya taşınmış eski bir dolap. Üst çekmece kilitli. Açmak benim işim değil. Keşif tutanağına “kilitli çekmece mevcut” diye yazdırdım.',
          short: 'Kilitli; tutanağa yazıldı',
        }),
        sceneObject('ob_cop', 'Çöp kutusu', OB_COP, {
          score: { ARASTIRMA: -10 },
          effects: [mark('NEUTRAL', 'Yırtık bir zarf kanıt değildir; kimin olduğu, ne zaman atıldığı belli değil.')],
          text: 'Çöpte yırtılmış boş bir mektup zarfı. Belediye logolu; içi boş. Herhangi bir zarf. Bu odada her gün yüz zarf açılır.',
          short: 'Boş bir zarf',
        }),
      ],
    }),
  ],
  assets: [
    sceneAsset('img_vezne', 'vezne-salonu'),
    sceneAsset('img_calisma', 'calisma-masasi'),
    sceneAsset('img_onoda', 'on-oda'),
  ],
};
