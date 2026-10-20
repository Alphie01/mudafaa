import { mark, raise, rect, sceneAsset, sceneDef, sceneObject } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';

// 30-scenes: dört aranabilir sahne. Görseller `scenes/<ad>.html`'den `npm run case:scenes -- son-durusma`.
// Şekil sabitleri golden path'te `step.tapCenter(…)` için dışa aktarılır.

// Ofis · olay yeri fotoğrafları (00.40)
export const OB_BICAK = rect(150, 270, 70, 40);
export const OB_ONLUK = rect(14, 90, 50, 120);
export const OB_BLOK = rect(170, 150, 56, 40);
export const OB_BEYAZ = rect(272, 60, 60, 130);
export const OB_RAKI = rect(240, 150, 26, 40);
export const OB_DVR = rect(90, 24, 60, 34);
export const OB_AKVARYUM = rect(80, 300, 60, 50);
// Toker Balık mutfağı
export const OB_TAHTA = rect(20, 30, 120, 80);
export const OB_ISTASYON = rect(160, 170, 90, 50);
export const OB_KAPI = rect(270, 60, 60, 150);
export const OB_KASA = rect(20, 250, 80, 60);
export const OB_DOLAP = rect(150, 30, 100, 90);
export const OB_BUZ = rect(150, 300, 100, 60);
// Yalçınların evi · Emir'in odası
export const OB_TAS = rect(40, 240, 70, 40);
export const OB_SAAT = rect(200, 40, 70, 90);
export const OB_SET = rect(140, 230, 80, 40);
export const OB_BOKS = rect(290, 150, 40, 70);
export const OB_DIPLOMA = rect(40, 50, 80, 60);
// İskele durağı · gece
export const OB_TABELA = rect(20, 80, 70, 110);
export const OB_CIZELGE = rect(140, 100, 80, 90);
export const OB_KAMERA = rect(260, 20, 50, 40);
export const OB_BANK = rect(110, 260, 140, 40);

export const scenes: CasePart = {
  assets: [
    sceneAsset('img_ofis', 'ofis'),
    sceneAsset('img_mutfak', 'mutfak'),
    sceneAsset('img_ev', 'emir-oda'),
    sceneAsset('img_durak', 'iskele-durak'),
  ],
  scenes: [
    sceneDef('sc_ofis', {
      title: 'Toker Balık · ofis · olay yeri fotoğrafları',
      description: 'Cinayet Büro’nun 00.40’ta başlayan çekimi; 46 kare.',
      width: 344,
      height: 380,
      image: 'img_ofis',
      objects: [
        sceneObject('ob_bicak', 'Halıdaki bıçak', OB_BICAK, {
          discovers: 'clue_bicak_ofiste',
          score: { ARASTIRMA: 60 },
          text: 'Kare 17. Fileto bıçağı halının üstünde, masanın ayağının dibinde; sapı kapıya dönük. Ofisten koşarak çıkan birinin elinde olsaydı burada olmazdı.',
          short: 'Bıçak ofiste',
        }),
        sceneObject('ob_onluk', 'Koridordaki askı', OB_ONLUK, {
          discovers: 'clue_onluk',
          score: { ARASTIRMA: 60 },
          text: 'Kare 31. Mutfak koridorunda bir askı sırası; birinin üstünde tükenmez kalemle “EMİR”. Beyaz önlük asılı, katlanmamış, lekesiz. Laboratuvar da kan bulmamış.',
          short: 'Önlük askıda, temiz',
        }),
        sceneObject('ob_blok', 'Masadaki not bloğu', OB_BLOK, {
          discovers: 'clue_not_bloku',
          score: { ARASTIRMA: 40 },
          text: 'Kare 22. Spiralli bir not bloğu; üst sayfa koparılmış, spiralde kâğıt kırpıntıları kalmış. Masada başka kâğıt yok. Kalemin kapağı açık.',
          short: 'Koparılmış sayfa',
        }),
        sceneObject('ob_beyaz', 'Şeridin dışı', OB_BEYAZ, {
          discovers: 'clue_beyaz',
          score: { ARASTIRMA: 20 },
          text: 'Kare 44, saat 00.52. Şeridin dışında işletme ortağı; bir polis memuruyla konuşuyor. Beyaz gömleği ütülü, yakası düzgün. Arka planda bir kare, kimsenin bakmadığı türden.',
          short: 'Beyaz gömlekli ortak',
        }),
        sceneObject('ob_raki', 'Rakı kadehi', OB_RAKI, {
          discovers: 'clue_raki',
          text: 'Kare 9. Masada dolu bir rakı kadehi, buzu erimiş. Otopsi: maktulün kanında alkol yok. Üç yıldır içmiyormuş; kadehi kim, kimin için koydu?',
          short: 'Dolu kadeh',
        }),
        sceneObject('ob_dvr', 'Kayıt cihazı', OB_DVR, {
          score: { ARASTIRMA: 20 },
          effects: [raise('fact_dvr')],
          text: 'Kare 6. Rafta kamera kayıt cihazı; ışıkları sönük. Tutanakta tek satır: “Cihaz çalışmıyor, kayıt bulunamadı.” Cihaz açılmamış, incelenmemiş, yalnızca kapalı bulunmuş.',
          short: 'Kapalı DVR',
        }),
        sceneObject('ob_akvaryum', 'Akvaryum', OB_AKVARYUM, {
          score: { ARASTIRMA: -10 },
          effects: [mark('NEUTRAL', 'Akvaryum olayla ilgili bir şey söylemiyor; bir büyüteç hakkı gitti.')],
          text: 'Kare 12. Köşede bir akvaryum; içinde iki çipura, oyuncak bir batık gemi. Balıklar bir şey görmüştür belki. İfade vermiyorlar.',
          short: 'Akvaryum',
        }),
      ],
    }),
    sceneDef('sc_mutfak', {
      title: 'Toker Balık · mutfak',
      description: 'Servis öncesi; kızgın yağ, buz, bağıran bir şef.',
      width: 344,
      height: 380,
      image: 'img_mutfak',
      objects: [
        sceneObject('ob_tahta', 'Beyaz tahta', OB_TAHTA, {
          discovers: 'clue_nisan',
          score: { ARASTIRMA: 60 },
          text: 'Silinmeye yüz tutmuş bir yazı, çarşamba tarihli: “CUMA 120 KİŞİ NİŞAN — HERKES BIÇAĞINI BİLEYLESİN!” Altında yedi ad, yedi tik. Altıncı ad: Emir.',
          short: 'Bileme talimatı',
        }),
        sceneObject('ob_istasyon', 'Emir’in istasyonu', OB_ISTASYON, {
          score: { ARASTIRMA: 40 },
          effects: [raise('fact_istasyon')],
          text: 'Paslanmaz bir tezgâh, bir kesme tahtası, duvarda mıknatıslı bir şerit. Şef: “Çantası burada kalmıştı o gece. Bıçağı tahtanın üstünde. Kim alırsa alır.”',
          short: 'Bıçak tezgâhta kaldı',
        }),
        sceneObject('ob_kapi', 'Arka kapı', OB_KAPI, {
          score: { ARASTIRMA: 40 },
          effects: [raise('fact_arka_kapi')],
          text: 'Arka kapı çöp kovalarına açılıyor; yanında bulaşıkhanenin buğulu penceresi. Koridor ofisin önünden geçiyor. Buradan çıkan, bulaşıkçının iki metre önünden geçer.',
          short: 'Bulaşıkhanenin önü',
        }),
        sceneObject('ob_kasa', 'Kasa', OB_KASA, {
          score: { ARASTIRMA: 40 },
          effects: [raise('fact_z')],
          text: 'Yazar kasa, yanında rulo kâğıt. Şef: “Her gece kapanışta Z raporu basılır; makine saatini kendi yazar. Kasayı Tarık Bey kapatır, başka kimse dokunmaz.”',
          short: 'Z raporu',
        }),
        sceneObject('ob_dolap', 'Personel dolapları', OB_DOLAP, {
          score: { ARASTIRMA: 10 },
          effects: [raise('fact_dolap')],
          text: 'Altı metal dolap, kapılarında adlar. Şef: “Mutfakta leke çıkmaz; herkesin dolabında yedek bir üst olur. Benimkinde üç tane.”',
          short: 'Yedek giysiler',
        }),
        sceneObject('ob_buz', 'Buz makinesi', OB_BUZ, {
          score: { ARASTIRMA: -10 },
          text: 'Buz makinesi homurdanıyor. Şef: “Ona dokunma, bozuk, yarın servis gelecek.” Bu mutfakta bozuk olan her şeye yarın servis gelir.',
          short: 'Buz',
        }),
      ],
    }),
    sceneDef('sc_ev', {
      title: 'Yalçınların evi · Emir’in odası',
      description: 'Hamitler’de üçüncü kat; bir terzi annenin evi.',
      width: 344,
      height: 380,
      image: 'img_ev',
      objects: [
        sceneObject('ob_tas', 'Masadaki bileği taşı', OB_TAS, {
          discovers: 'clue_tas',
          score: { ARASTIRMA: 60 },
          text: 'Yeni bir bileği taşı, kutusunda. Kutunun içine katlanmış bir ekran çıktısı: şefin çarşamba sabahki grup mesajı. “Cuma nişan, 120 kişi. Herkes taşını alsın, bıçaklar bileylensin.”',
          short: 'Taş ve şefin mesajı',
        }),
        sceneObject('ob_saat', 'Duvardaki sefer saatleri', OB_SAAT, {
          score: { ARASTIRMA: 40 },
          effects: [raise('fact_otobus')],
          text: 'Duvara iğnelenmiş bir 1/M sefer çizelgesi: Mudanya İskele – Emek. Son seferin altı kalemle çizilmiş: 23.52. Meral: “Hep o otobüse koşardı. Kartını da hep o okuturdu.”',
          short: 'Son sefer 23.52',
        }),
        sceneObject('ob_set', 'Bıçak seti kutusu', OB_SET, {
          score: { ARASTIRMA: 20 },
          effects: [raise('fact_set')],
          text: 'Ahşap bir kutu, beş yuva; biri boş. Kapağın içinde pirinç bir levha: “E.Y. — Babandan, okul bitti.” Meral: “Kemal üç ay fazla mesai yaptı bunun için.”',
          short: 'Babasının hediyesi',
        }),
        sceneObject('ob_boks', 'Kapı arkası', OB_BOKS, {
          discovers: 'clue_boks',
          text: 'Kapının arkasında bir çift boks eldiveni, derisi çatlamış. Meral: “Lisede iki ay gitti, sonra burnu kanadı, bıraktı. Kan görünce bayılır o.”',
          short: 'Eski eldivenler',
        }),
        sceneObject('ob_diploma', 'Çerçeveli diploma', OB_DIPLOMA, {
          score: { ARASTIRMA: 10 },
          text: 'Aşçılık meslek lisesi diploması; altında bir fotoğraf: önlüklü bir çocuk, sol elinde bir kepçe. Meral: “Solaktır. Bıçakları bile sol ele göre alırdık.”',
          short: 'Solak',
          effects: [raise('fact_solak')],
        }),
      ],
    }),
    sceneDef('sc_durak', {
      title: 'Mudanya İskele durağı · gece',
      description: 'Yağmurda bir otobüs durağı; deniz on adım ötede.',
      width: 344,
      height: 380,
      image: 'img_durak',
      objects: [
        sceneObject('ob_tabela', 'Yönlendirme tabelası', OB_TABELA, {
          discovers: 'clue_mesafe',
          score: { ARASTIRMA: 60 },
          text: 'Belediyenin kahverengi tabelası: “Balıkçı barınağı – Toker Balık 700 m.” Meyhanenin arka kapısından buraya yürüdüm; telefonumun kronometresi dokuz dakika on saniye dedi.',
          short: 'Dokuz dakika',
        }),
        sceneObject('ob_cizelge', 'Sefer çizelgesi', OB_CIZELGE, {
          score: { ARASTIRMA: 40 },
          effects: [raise('fact_sefer')],
          text: 'Camın arkasında sefer çizelgesi: 1/M’nin son kalkışı 23.52. Altında bir not: “Son seferden sonra İskele’den Bursa’ya toplu taşıma yoktur.”',
          short: 'Son 1/M 23.52',
        }),
        sceneObject('ob_kamera', 'Durak kamerası', OB_KAMERA, {
          discovers: 'clue_durak_kamera',
          score: { ARASTIRMA: -10 },
          text: 'Direkte belediyenin kamerası. Bilgi levhası: “Kayıtlar 7 gün saklanır.” Üç ay geçti. Kimse yedi gün içinde istememiş.',
          short: 'Kayıt yok',
        }),
        sceneObject('ob_bank', 'Bank', OB_BANK, {
          score: { ARASTIRMA: -10 },
          text: 'Islak bir bank; üstüne çakıyla kazınmış adlar, kalpler, bir takım arması. Bir gece yarısı burada oturan biri ne düşünür? Otobüsü.',
          short: 'Bank',
        }),
      ],
    }),
  ],
};
