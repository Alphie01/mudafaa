import {
  back,
  choiceNode,
  cmp,
  deductionBoard,
  documentExam,
  flag,
  option,
  raise,
  row,
  story,
  tool,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef, NodeDef } from '../../../tools/content/src/kit/index.js';
import { B } from './dsl.js';
import { boardMiss, docMiss, hit, rec } from './helpers.js';
import { C2 } from './shared.js';

// 54-inv-arsiv: dosyanın kâğıtları. Ön inceleme tutanağı, adli kopya raporu (Ek-3), hesap verisi (indir → ertesi gün),
// hastane kayıtları, talepler ve çıkarım tahtası.

const MAG = tool('mag', 'Büyüteç', 'magnifier');
const CMP = tool('cmp', 'Karşılaştır', 'compare');

/** Hesap verisi raporu: soruşturmada ve arada ayrı node'lar (kimlik öneki ve deneme sayacı farklı). */
export function hesapDoc(id: string, prefix: string, costVar: string, chapterSpread: object): NodeDef {
  return documentExam(id, {
    ...chapterSpread,
    title: 'Hesap verisi raporu',
    hud: [costVar],
    background: 'buro',
    lines: B(`
      > Noterin mühürlü zarfından çıkan dökümün ilk sayfası. Altında SHA-256 değeri ve noterin imzası.
      tarik: Bunları ben mi indirdim? Hesap ayarlarında bir düğme. Yirmi dört saat sonra bir bağlantı geldi. O kadar.
      ~ Sıkıcı bir tablo. Sıkıcı tablolar en çok şey söyleyenlerdir.
    `),
    header: { left: 'PUSULA · HESAP VERİSİ (T. AKSOY)', right: 'NOTER TESPİTİ · SHA-256' },
    columns: [
      { label: 'KAYIT', flex: 0.9 },
      { label: 'CİHAZ / ZAMAN', flex: 1.5 },
      { label: 'AYRINTI', flex: 2 },
    ],
    rows: [
      row(`${prefix}h1`, ['Cihaz 0', 'iPhone · T. Aksoy', 'birincil cihaz']),
      row(`${prefix}h2`, ['Cihaz 2', 'OFIS-TABLET · Tablet', 'bağlandı 02.09 · oturum kapandı 03.11 18.02']),
      row(`${prefix}h3`, ['Cihaz 3', 'OFIS-LAPTOP-07 · Masaüstü', 'bağlandı 14.02 · son etkin 12.11 02.21']),
      row(`${prefix}h4`, ['Oturum', '06.11 02.09', 'cihaz 3 çevrimiçi · IP 85.105.44.17']),
      row(`${prefix}h5`, ['Oturum', '09.11 02.12', 'cihaz 3 çevrimiçi · IP 85.105.44.17']),
      row(`${prefix}h6`, ['Oturum', '12.11 02.17', 'cihaz 3 çevrimiçi · IP 85.105.44.17']),
      row(`${prefix}h7`, ['Olay', '06.11 02.13', 'sohbet arşivlendi: Melis Karaca · cihaz 3']),
      row(`${prefix}h8`, ['Oturum', '12.11 23.10', 'cihaz 0 çevrimiçi · IP 176.88.12.4']),
      row(`${prefix}h9`, ['Cihaz 3', 'kayıt', 'eklenme: 14.02 · “ofisten de yazabilirsin” notuyla masaüstü oturumu']),
      row(`${prefix}h10`, ['Oturum', '25.10 23.48', 'cihaz 0 çevrimiçi · IP 176.88.12.4 · pay yazışması']),
      row(`${prefix}h11`, ['İki adım', 'durum', 'iki adımlı doğrulama: kapalı']),
    ],
    tools: [MAG, CMP],
    costVar,
    rules: [
      hit(
        `${prefix}EX_C3`,
        'mag',
        `${prefix}h3`,
        'clue_bagli_cihaz',
        150,
        'YENİ İPUCU',
        'Cihaz 3: “OFIS-LAPTOP-07 · PUSULA Masaüstü (Windows).” 14 Şubat’tan beri hiç kapatılmamış bir oturum. Son etkinlik 12 Kasım 02.21, son tehditten iki dakika sonra. Telefon değil; bir bilgisayar.',
      ),
      hit(
        `${prefix}EX_C2`,
        'mag',
        `${prefix}h2`,
        'clue_tablet_kapali',
        60,
        'YENİ İPUCU',
        'Cihaz 2, ofisin tableti. Oturum 3 Kasım 18.02’de kapanmış. İlk mesajdan üç gün önce. Bu tablet o gecelerde hiçbir şey göndermedi.',
      ),
      hit(
        `${prefix}EX_IP1`,
        'cmp',
        `${prefix}h4`,
        'clue_ip_ayni',
        150,
        'YENİ İPUCU',
        'Üç gecenin üçünde de cihaz 3 aynı adresten bağlanmış: 85.105.44.17. Tarık’ın telefonu ise ev hattından: 176.88.12.4. Tehdit gecelerinin adresi onun evi değil; sabit, bir iş adresi gibi.',
      ),
      hit(`${prefix}EX_IP2`, 'cmp', `${prefix}h5`, 'clue_ip_ayni', 0, 'AYNI ADRES', '9 Kasım: 85.105.44.17. Yine.'),
      hit(`${prefix}EX_IP3`, 'cmp', `${prefix}h6`, 'clue_ip_ayni', 0, 'AYNI ADRES', '12 Kasım: 85.105.44.17. Üçüncü kez.'),
      hit(
        `${prefix}EX_ARSIV`,
        'mag',
        `${prefix}h7`,
        'clue_arsiv',
        100,
        'YENİ İPUCU',
        '6 Kasım 02.13: ilk tehditten iki dakika sonra sohbet arşivlenmiş, cihaz 3’ten. Arşiv, sohbeti listeden gizler. Sahibi kendi mesajını neden gizlesin? Gizleyen, hesabı kullanan biri.',
      ),
      hit(
        `${prefix}EX_EV`,
        'cmp',
        `${prefix}h8`,
        undefined,
        0,
        'EV HATTI',
        'Cihaz 0, Tarık’ın telefonu, evden bağlanıyor: 176.88.12.4. Kendi telefonu. Kendi evi. Başka bir hat.',
      ),
    ],
    miss: docMiss(`${prefix}FB_HESAP`),
    finish: { id: `${prefix}HESAP_BITIR`, label: 'Raporu kapat' },
  });
}

/** Çıkarım tahtası tarifleri (iki tahtada ortak). */
export function baseRecipes(prefix: string): ChoiceDef[] {
  return [
    rec(
      `${prefix}CB_SS`,
      'clue_ss_karar',
      'clue_imza_yok',
      'ded_ss',
      300,
      'Kararsız, imzasız',
      'Görüntüler hâkimlik kararından on sekiz saat önce alınmış; dayandıkları “rıza” tek bir imzayla bile belgelenmemiş.',
    ),
    rec(
      `${prefix}CB_ZINCIR`,
      'clue_son_erisim',
      'clue_muhur_yok',
      'ded_zincir',
      300,
      'Mühürsüz iki gün',
      'Telefon mühürsüz bir zarfta iki gün durdu, Şube’de açıldı; hash ancak 14 Kasım’da alındı. Öncesini kimse belgelemedi.',
    ),
    rec(
      `${prefix}CB_BAGLI`,
      'clue_cihaz3',
      'clue_bagli_cihaz',
      'ded_bagli',
      300,
      'Telefon değil',
      'Ek-3’teki “cihaz 3”, hesaba bağlı OFIS-LAPTOP-07. Tehditler ve iletilen ses kaydı telefondan değil, o masaüstü oturumundan çıktı.',
    ),
    rec(
      `${prefix}CB_HAST1`,
      'clue_kilit',
      'clue_onam',
      'ded_hastane',
      300,
      '02.14’te acil serviste',
      'Telefon 01.40’tan 06.10’a kadar kilitli; Tarık 02.10’da onam formu imzalıyor. Ses kaydını o telefondan, o eller iletmedi.',
    ),
    rec(
      `${prefix}CB_HAST2`,
      'clue_kilit',
      'clue_sarj',
      'ded_hastane',
      300,
      'Şarjdaki telefon',
      'Kilit kaydı ile hemşire masasındaki bant aynı saati söylüyor: 01.40. Telefon gece boyunca şarjda, kilitli.',
    ),
    rec(
      `${prefix}CB_USLUP`,
      'clue_uslup_tehdit',
      'clue_uslup_tarik',
      'ded_uslup',
      200,
      'İki ayrı el',
      'Tarık küçük harfle, noktasız yazar. Tehditler “Sn.” ile başlıyor, üç noktayla duruyor, “Saygılar.” diye bitiyor.',
    ),
    rec(
      `${prefix}CB_TABLET`,
      'clue_tablet_kapali',
      'clue_cihaz3',
      'ded_tablet',
      150,
      'Tablet elenir',
      'Mesajlar cihaz 3’ten. Cihaz 2’nin oturumu üç gün önce kapanmış. Stajyerin tableti bu hikâyede yok.',
    ),
    rec(
      `${prefix}CB_ARSIV`,
      'clue_arsiv',
      'clue_bagli_cihaz',
      'ded_arsiv',
      200,
      'Saklanan sohbet',
      'Mesajları gönderen, sohbeti aynı oturumdan arşivleyerek Tarık’ın gözünden saklamış. Bunu hesabın sahibi yapmaz; hesabı kullanan yapar.',
    ),
  ];
}

const POOL = [
  'clue_imza_yok',
  'clue_muhur_yok',
  'clue_ss_karar',
  'clue_son_erisim',
  'clue_cihaz3',
  'clue_uslup_tehdit',
  'clue_uslup_tarik',
  'clue_kilit',
  'clue_bagli_cihaz',
  'clue_tablet_kapali',
  'clue_ip_ayni',
  'clue_arsiv',
  'clue_onam',
  'clue_sarj',
  'clue_kamera_h',
  'clue_dock',
  'ev_not',
  'clue_uslup_ozan',
  'clue_pay',
  'clue_melis_teori',
];
export const BOARD_POOL = POOL;

export const invArsiv: CasePart = {
  nodes: [
    hesapDoc('INV_HESAP', '', 'ex3', C2),
    documentExam('INV_TUTANAK', {
      ...C2,
      title: 'Ön inceleme tutanağı',
      hud: ['ex1'],
      background: 'adliye',
      lines: B(`
        # ADLİYE · KALEM ODASI — 10.20 |bg=adliye
        > Kalemde dosyanın asıl evrakı. Zabıt kâtibi bir dosya kartonunu önüme itti, kahvesini aldı, pencereye döndü.
        ?KALEMDEKİ KÂTİP: Yarım saat avukat hanım. Fotokopi yok, fotoğraf serbest.
        ~ Bir tutanak, bir sayfa. Polisin kendi el yazısıyla “usule uygun” yazdığı bir sayfa.
        > Bir alet seç, sonra şüpheli satıra dokun.
      `),
      header: { left: 'SİBER SUÇLARLA MÜCADELE ŞUBE · ÖN İNCELEME TUTANAĞI', right: '12.11 · 16.10' },
      columns: [
        { label: 'SAAT', flex: 0.9 },
        { label: 'İŞLEM', flex: 0.9 },
        { label: 'AÇIKLAMA', flex: 2.6 },
      ],
      rows: [
        row('t0', ['14.30', 'Davet', 'Şüpheli, ofisinde ifadeye davet edildi; telefonunu kendi rızasıyla teslim etti.']),
        row('t1', ['15.40', 'Kilit', 'Şüphelinin rızasıyla telefon kilidi açıldı.']),
        row('t2', ['15.44–15.51', 'Görüntü', 'PUSULA: Melis Karaca sohbeti (arşiv). 14 ekran görüntüsü alındı; ekranlar ayrıca fotoğraflandı.']),
        row('t3', ['15.52', 'Kapanış', 'Cihaz kapatıldı, kahverengi zarfa konuldu.']),
        row('t4', ['—', 'Mühür', '—']),
        row('t5', ['—', 'Ek', 'Hâkimlik kararı: Bursa 3. Sulh Ceza · 13.11 · 10.20']),
        row('t5b', ['—', 'Muhafaza', 'Cihaz, işlem memurunun kilitli çekmecesinde muhafaza edildi.']),
        row('t6', ['16.10', 'İmzalar', 'Kom. Yrd. H. Demirci (imza) · Şüpheli: ………']),
        row('t7', ['12–14.11', 'Teslim', 'Cihaz, adli kopya için bilişim birimine iki gün sonra teslim edildi.']),
      ],
      tools: [MAG, CMP, tool('uv', 'UV ışık', 'uv', 'UV')],
      costVar: 'ex1',
      rules: [
        hit(
          'EX_T_IMZA',
          'mag',
          't6',
          'clue_imza_yok',
          100,
          'YENİ İPUCU',
          'Şüphelinin imza hanesi boş; ne imza ne paraf, “imzadan imtina etti” şerhi de yok. Oysa ilk satırda “şüphelinin rızasıyla” yazıyor. Rıza, verenin değil, isteyenin kalemiyle yazılmış.',
        ),
        hit(
          'EX_T_MUHUR',
          'mag',
          't4',
          'clue_muhur_yok',
          100,
          'YENİ İPUCU',
          'Mühür hanesinde tek bir çizgi. Zarf bantlanmış, mühürlenmemiş. Bantlı bir zarf, açılıp kapanabilen bir zarftır.',
        ),
        hit(
          'EX_T_SAAT',
          'cmp',
          't2',
          'clue_ss_karar',
          150,
          'YENİ İPUCU',
          'Ekran görüntüleri 12 Kasım 15.44; hâkimlik kararı 13 Kasım 10.20. Görüntüler karardan on sekiz saat önce alınmış. Karar, iş bittikten sonra gelmiş; hukukta sıralama her şeydir.',
          'USUL_BILGISI',
        ),
        hit(
          'EX_T_SAAT2',
          'cmp',
          't5',
          'clue_ss_karar',
          0,
          'KARARIN SAATİ',
          'Karar 13 Kasım sabahı. Tutanağın kendisi bir gün önceye ait. Bu satır, tutanağa sonradan eklenmiş bir not.',
        ),
        hit(
          'EX_T_KAPAT',
          'mag',
          't3',
          undefined,
          0,
          'KAPANIŞ',
          '15.52’de kapatıldı. Zarfa konuldu. Nerede, kimin yanında, kaç gün? Bu satır söylemiyor.',
        ),
      ],
      miss: docMiss('FB_TUTANAK'),
      finish: { id: 'TUTANAK_BITIR', label: 'Tutanağı kapat' },
    }),
    documentExam('INV_IMAJ', {
      ...C2,
      title: 'Adli kopya raporu',
      hud: ['ex2'],
      background: 'buro',
      lines: B(`
        # ARSLAN HUKUK · ARŞİV MASASI — 13.00 |bg=buro
        > Raporun kendisi altı sayfa. Ekleri yüz on dört. Sonuç cümlesi altıncı sayfanın ortasında, kalın harflerle.
        ~ Sonuç bir kanaattir. Ekler makinenin söyledikleridir. Makineyi dinle.
        > Ek-3, bir mesaj tablosu. Son sütunun başlığı kısaltılmış: “GND. C.” Hücrelerde “bkz. ham veri” yazıyor.
      `),
      header: { left: 'KOLLUK BİLİŞİM BİRİMİ · ADLİ KOPYA RAPORU', right: '14.11 · 11.05' },
      columns: [
        { label: 'BÖLÜM', flex: 0.7 },
        { label: 'KAYIT', flex: 1.4 },
        { label: 'DEĞER', flex: 2.4 },
      ],
      rows: [
        row('i1', ['Ek-1', 'Alım · 14.11 11.05', 'SHA-256: 9f3a…c41e']),
        row('i2', ['Ek-1', 'Doğrulama · 14.11 11.48', 'SHA-256: 9f3a…c41e (eşleşti)']),
        row('i3', ['Ek-2', 'Son kilit açılışı', '12.11 15.52']),
        row('i4', ['Ek-2', 'Kilit olayları · 09.11', '01.40 kilitlendi · 06.10 açıldı']),
        row('i5', ['Ek-3', '25.10 23.48 → Melis K.', '“bu şartlarla devam edemeyiz melis” · GND. C.: bkz.'], {
          cmp: { cells: ['Ek-3', '25.10 23.48 → Melis K.', 'ham veri: sender_device = 0'], tone: 'info' },
        }),
        row('i6', ['Ek-3', '06.11 02.11 → Melis K.', '“Sn. Karaca, ihaleden çekilmeniz…” · GND. C.: bkz.'], {
          cmp: { cells: ['Ek-3', '06.11 02.11 → Melis K.', 'ham veri: sender_device = 3'], tone: 'special' },
        }),
        row('i7', ['Ek-3', '09.11 02.14 → H. Sezer', '[iletilen sesli mesaj] · GND. C.: bkz.'], {
          cmp: { cells: ['Ek-3', '09.11 02.14 → H. Sezer', 'ham veri: sender_device = 3'], tone: 'special' },
        }),
        row('i8', ['Ek-3', '12.11 02.19 → Melis K.', '“Son mesajım. Cuma’ya kadar…” · GND. C.: bkz.'], {
          cmp: { cells: ['Ek-3', '12.11 02.19 → Melis K.', 'ham veri: sender_device = 3'], tone: 'special' },
        }),
        row('i9', ['Sonuç', 'Değerlendirme', 'Mesajlar şüpheliye ait cihazdaki hesap üzerinden gönderilmiştir.']),
        row('i10', ['Ek-3', '06.11 02.13 → sistem', '[sohbet arşivlendi: Melis Karaca] · GND. C.: bkz.'], {
          cmp: { cells: ['Ek-3', '06.11 02.13 → sistem', 'ham veri: sender_device = 3'], tone: 'info' },
        }),
        row('i11', ['Ek-4', 'İnceleyen', 'Kolluk bilişim birimi · Kom. Yrd. H. Demirci gözetiminde']),
        row('i12', ['Ek-4', 'Yöntem', 'Fiziksel imaj; yazma korumalı çoğaltıcı kullanıldığı belirtilmiştir.']),
      ],
      tools: [MAG, CMP, tool('hash', 'Hash doğrula', 'check')],
      costVar: 'ex2',
      rules: [
        hit(
          'EX_I_HASH',
          'hash',
          'i2',
          undefined,
          50,
          'HASH EŞLEŞİYOR',
          'Alım ve doğrulama değerleri aynı. 14 Kasım 11.05’ten sonra veri değişmemiş. Peki 11.05’ten önce?',
        ),
        hit(
          'EX_I_HASH1',
          'hash',
          'i1',
          undefined,
          0,
          'ALIM ANI',
          'Hash, imajın alındığı anın parmak izi. Daha önceki bir anın değil.',
        ),
        hit(
          'EX_I_SON',
          'mag',
          'i3',
          'clue_son_erisim',
          100,
          'YENİ İPUCU',
          '“Son kilit açılışı: 12 Kasım 15.52.” Şube’de, bir polisin eli. İmaj ise 14 Kasım’da. Arada iki gün: telefon hangi çekmecede, kimin gözetiminde durdu? Rapor bu iki günü anlatmıyor.',
        ),
        hit(
          'EX_I_KILIT',
          'mag',
          'i4',
          'clue_kilit',
          150,
          'YENİ İPUCU',
          '9 Kasım: telefon 01.40’ta kilitlenmiş, 06.10’a kadar hiç açılmamış. Oysa 02.14’te bu hesaptan Hayri Sezer’e ses kaydı gitmiş. Kilitli telefondan ileti çıkmaz; başka bir cihazdan çıkar.',
        ),
        hit(
          'EX_I_C6',
          'cmp',
          'i6',
          'clue_cihaz3',
          150,
          'YENİ İPUCU',
          '“bkz.” yazan hücre açıldı, ham veri döküldü: sender_device = 3. Tarık’ın 25 Ekim’deki kendi mesajında bu değer 0. Aynı hesap, farklı cihaz. Bütün dava bu tek rakamda saklıymış.',
        ),
        hit('EX_I_C7', 'cmp', 'i7', 'clue_cihaz3', 0, 'CİHAZ 3', 'İletilen ses kaydı da cihaz 3’ten çıkmış. Tarık’ın telefonu değil; başka bir cihaz, aynı hesaba bağlı.'),
        hit('EX_I_C8', 'cmp', 'i8', 'clue_cihaz3', 0, 'CİHAZ 3', '“Son mesajım.” Yine cihaz 3. Üç tehdidin üçü de aynı yerden: bir masaüstü oturumundan, bir telefondan değil.'),
        hit(
          'EX_I_C5',
          'cmp',
          'i5',
          undefined,
          0,
          'CİHAZ 0',
          'Tarık’ın 25 Ekim mesajları: cihaz 0. Telefonun kendisi. Sert sözler, ama kendi elinden.',
        ),
        hit(
          'EX_I_U6',
          'mag',
          'i6',
          'clue_uslup_tehdit',
          100,
          'YENİ İPUCU',
          '“Sn. Karaca.” Büyük harfle başlıyor, üç noktayla duruyor, “Saygılar.” diye bitiyor. Üç mesajda da aynı.',
        ),
        hit(
          'EX_I_U5',
          'mag',
          'i5',
          'clue_uslup_tarik',
          100,
          'YENİ İPUCU',
          '“bu şartlarla devam edemeyiz melis.” Küçük harf. Nokta yok, virgül yok. Tarık bütün mesajlarını böyle yazmış.',
        ),
        hit(
          'EX_I_SONUC',
          'mag',
          'i9',
          undefined,
          0,
          'SONUÇ',
          'Sonuç cümlesi hiçbir eke atıf yapmıyor. “Cihazdaki hesap.” Cihaz ile hesap aynı şey mi?',
        ),
      ],
      miss: docMiss('FB_IMAJ'),
      finish: { id: 'IMAJ_BITIR', label: 'Raporu kapat' },
    }),
    choiceNode('INV_HESAP_IND', {
      ...C2,
      title: 'Hesap verisi',
      background: 'buro',
      lines: B(`
        # NOTERLİK · OSMANGAZİ — 16.30 |bg=buro
        > Tarık’ın telefonu emanette. Ama hesap onun. Hesabın sahibi, uygulamadan kendi oturum geçmişini isteyebilir.
        tarik: Yeni bir telefona hesabı açtım. Ayarlar, hesap, “hesap bilgilerimi iste”. Yirmi dört saat sonra hazır olacakmış.
        tarik: Gelince ekranın fotoğrafını çekip size atayım mı? Hızlı olur.
        ~ Hızlı. Polisin yaptığı da hızlıydı.
      `),
      prompt: 'Savunmanın kendi dijital delilini nasıl koruyacaksın?',
      choices: [
        option('HI_NOTER', 'Noterde indirilsin, hash değeriyle tespit edilsin.', {
          discovers: 'ev_hesap',
          score: { USUL_BILGISI: 30, ARASTIRMA: 20 },
          effects: [raise('hesap_istendi')],
          good: 'Savunmanın elde ettiği dijital veri de bütünlüğüyle korunmalı: noter tespiti ve hash değeri, verinin sonradan değiştirilmediğini gösterir. Hesap sahibinin kendi verisini indirmesi hukuka uygundur.',
          responses: B(`
            tarik: Noter. Hash. Bir mesajı kanıtlamak bir kolon hesabından daha uzun sürüyor.
            P: Polis hızlıydı Tarık Bey. Şimdi o hızın bedelini tartışıyoruz.
            > Yarın akşam hazır olacak. Noterin önünde, mühürlü bir zarfta.
          `),
          next: '$return',
        }),
        option('HI_SS', 'Ekran görüntülerini alıp çıktısını dosyaya sunalım; daha hızlı, bize de yeter.', {
          score: { USUL_BILGISI: -30 },
          bad: 'Savunmanın sunduğu ekran görüntüsü de aynı itiraza açıktır: kim, ne zaman, neyle aldı? Dijital delil kaynağından, bütünlüğü korunarak alınmalıdır.',
          responses: B(`
            ~ Bir dakika. Polisin yaptığını mı yapacağım? Bir ekranın fotoğrafını çekip “işte gerçek” mi diyeceğim?
            P: Hayır. Vazgeçtim. Böyle olmaz.
          `),
          next: '$stay',
        }),
        back('HI_GERI', 'Şimdilik bekle'),
      ],
    }),
    story('INV_HKAYIT_GIRIS', {
      ...C2,
      title: 'Hastane kayıtları',
      background: 'hastane',
      onFirstEnter: [{ type: 'DISCOVER', evidence: 'ev_hastane' }],
      lines: B(`
        # DEVLET HASTANESİ · HASTA HAKLARI BİRİMİ — 11.40 |bg=hastane
        > Necati Aksoy koroner yoğun bakımdan çıkalı iki ay olmuş. Titrek bir imzayla muvafakatname verdi; Tarık evrakı kendisi aldı.
        tarik: Babam “Ne istiyorlarsa verin, oğlum o gece buradaydı” dedi. Hemşireye de selam söyledi.
        > Bir epikriz, bir müdahale çizelgesi, bir onam formu. Hepsinin altında saat.
      `),
      choices: [
        { id: 'HKG_DEVAM', kind: 'CONTINUE', label: 'Kayıtları incele', next: 'INV_HKAYIT' },
      ],
    }),
    documentExam('INV_HKAYIT', {
      ...C2,
      title: 'Epikriz ve onam formu',
      hud: ['ex4'],
      background: 'hastane',
      lines: B(`> Bir alet seç, sonra satıra dokun.`),
      header: { left: 'DEVLET HASTANESİ · ACİL SERVİS KAYDI', right: '09.11' },
      columns: [
        { label: 'SAAT', flex: 0.7 },
        { label: 'İŞLEM', flex: 0.9 },
        { label: 'AÇIKLAMA', flex: 2.8 },
      ],
      rows: [
        row('k1', ['01.20', 'Kabul', 'Necati Aksoy, 71 · ritim bozukluğu · refakatçi: oğlu']),
        row('k2', ['01.55', 'Konsültasyon', 'Kardiyoloji çağrıldı']),
        row('k3', ['02.10', 'Onam', 'Girişim onam formu · imza: Tarık Aksoy · saati yazan: Hmş. G. Tunç']),
        row('k4', ['05.30', 'Yatış', 'Koroner yoğun bakım']),
      ],
      tools: [MAG, CMP],
      costVar: 'ex4',
      rules: [
        hit(
          'EX_K_ONAM',
          'mag',
          'k3',
          'clue_onam',
          100,
          'YENİ İPUCU',
          '“02.10 · Girişim onam formu · imza: Tarık Aksoy · saati yazan: Hmş. G. Tunç.” Dört dakika sonra, 02.14’te, onun hesabından ses kaydı gidiyor. İnsan aynı anda hem orada hem klavye başında olamaz.',
        ),
        hit(
          'EX_K_ONAM2',
          'cmp',
          'k3',
          'clue_onam',
          0,
          'ONAM',
          'Formun saati ile Ek-3’teki ileti arasında dört dakika.',
        ),
        hit(
          'EX_K_KABUL',
          'mag',
          'k1',
          undefined,
          0,
          'KABUL',
          'Refakatçi: oğlu. 01.20’den itibaren buradaydı.',
        ),
      ],
      miss: docMiss('FB_HKAYIT'),
      finish: { id: 'HKAYIT_BITIR', label: 'Kayıtları kapat' },
    }),
    choiceNode('INV_DIL', {
      ...C2,
      title: 'Talepler',
      hud: ['slots'],
      background: 'buro',
      lines: B(`
        > Duruşmadan önce mahkemeye bir dilekçe. Delil ve bilirkişi talepleri; üç başlık, fazlası okunmaz.
        leyla: Hâkim her talebe “neden?” diye bakar Deniz. “Neden”i olmayan talep, olanı da gölgeler.
      `),
      prompt: 'Dilekçeye ne yazacaksın?',
      choices: [
        option('DIL_BILIRKISI', 'Bağımsız adli bilişim bilirkişisi; imajın bir kopyasının bize verilmesi', {
          cost: [{ var: 'slots', amount: 1 }],
          score: { USUL_BILGISI: 30 },
          effects: [raise('bilirkisi_istendi')],
          good: 'Yerinde: kolluk raporunun ekleri yorumlanmamış; mahkeme özel veya teknik bilgiyi gerektiren konularda bilirkişi atar (CMK 63/1), taraflar da bilirkişi incelemesi isteyebilir. Yedekten bir kopya şüpheliye veya vekiline verilir (CMK 134/5).',
          responses: B(`~ Bir bilirkişi. Kimsenin avukatı olmayan biri. İyi. Doğru soruyu soran kazanır.`),
          next: '$stay',
        }),
        option('DIL_HASTANE', 'Hastane kayıtlarının ve kamera görüntüsünün celbi', {
          cost: [{ var: 'slots', amount: 1 }],
          visibleWhen: flag('fact_hastane'),
          score: { USUL_BILGISI: 20 },
          effects: [raise('hastane_istendi')],
          good: 'Kayıtların resmî yoldan dosyaya girmesi yerindedir; kamera görüntüsü otuz günlük saklama süresi nedeniyle gelmeyecektir, ama kayıtlar gelir.',
          responses: B(`~ Kayıtlar resmî yoldan gelecek. Kamera… Kasım çoktan gitti.`),
          next: '$stay',
        }),
        option('DIL_HAYRI', 'Hayri Sezer’in tanık olarak dinlenmesi', {
          cost: [{ var: 'slots', amount: 1 }],
          score: { USUL_BILGISI: 20 },
          effects: [raise('hayri_istendi')],
          good: 'Ses kaydının alıcısı olay saatine dair doğrudan bilgi sahibidir; tanık olarak dinlenmesi istenebilir.',
          responses: B(`~ Hayri Bey. Telefonunda bir bildirim. Bir saat.`),
          next: '$stay',
        }),
        option('DIL_KATILAN', 'Katılanın telefonunun da incelenmesi', {
          cost: [{ var: 'slots', amount: 1 }],
          neutral: 'Somut bir dayanak olmadan mağdurun cihazının incelenmesi istenirse mahkeme reddeder; ilişkiyi de zehirler. Mesajların alıcıda olduğu tartışmasız.',
          responses: B(`leyla: Mesajın geldiği tartışılmıyor ki. Kimden çıktığı tartışılıyor. Kadının telefonunda ne arayacaksın?`),
          next: '$stay',
        }),
        option('DIL_PLATFORM', 'Uygulama şirketinden yazışma ve oturum kayıtları', {
          cost: [{ var: 'slots', amount: 1 }],
          effects: [raise('fact_hesap_fikri')],
          neutral: 'Yurt dışındaki bir şirketten kayıt istemek uluslararası adli yardım ister; aylar sürer. Oysa hesap sahibi kendi oturum geçmişini kendisi indirebilir.',
          responses: B(`leyla: Aylar. Duruşmaya on iki gün var. Hesap kimin Deniz? Sahibi istese?`),
          next: '$stay',
        }),
        option('DIL_KESIF', 'Ofiste keşif yapılması', {
          cost: [{ var: 'slots', amount: 1 }],
          neutral: 'Keşif, olay yerinin bizzat görülmesinin uyuşmazlığı çözeceği durumlar içindir; bir mimarlık ofisini görmek mesajların kaynağını söylemez.',
          responses: B(`~ Hâkim ofise gelip ne görecek? Kemerleri mi?`),
          next: '$stay',
        }),
        {
          id: 'DIL_VER',
          kind: 'CONTINUE',
          label: 'Dilekçeyi ver',
          role: 'PRIMARY',
          enabledWhen: cmp(v('slots'), '<', 3),
          lockedReason: 'En az bir talep seç.',
          responses: B(`> Dilekçe UYAP’tan gönderildi. Kalemde bir kâtip onu yarın sabah okuyacak, belki.`),
          next: '$return',
        },
      ],
    }),
    deductionBoard('INV_CIKARIM', {
      ...C2,
      title: 'Çıkarım tahtası',
      background: 'buro_gece',
      lines: B(`> İki kart seç. Birbirini tamamlıyorsa duruşmada kullanabileceğin bir delil doğar.`),
      pool: POOL,
      recipes: [
        ...baseRecipes(''),
      ],
      miss: boardMiss('FB_CIKARIM'),
      finish: { id: 'CIKARIM_BITIR' },
    }),
  ],
};
