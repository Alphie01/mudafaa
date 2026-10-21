import { documentExam, examine, fallback, row, sceneSearch, tool } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, S, minus } from './dsl.js';
import { INV1 } from './shared.js';

// 52-inv1-docs: kontrol odası ve koridor (sahne aramaları), dinleme kararı, yakalama tutanağı ve muhbirin iki ifadesi
// (belge incelemeleri).

const tapMiss = (id: string) =>
  fallback(id, 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: {
      text: 'Burada bir şey yok. Linolyum, duvar, toz. (−1 büyüteç)',
      label: `${minus(10)} SKOR`,
      tone: 'error',
    },
  });

const examMiss = (id: string) =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle bu satırda yeni bir şey görünmüyor.',
      label: `${minus(20)} SKOR`,
      tone: 'error',
    },
  });

const found = (text: string, n: number, kind = 'İPUCU') => ({
  title: `YENİ ${kind}`,
  text,
  label: `+${n} SKOR · Not defterine eklendi`,
  tone: 'special' as const,
});

export const inv1Docs: CasePart = {
  nodes: [
    sceneSearch('INV1_ODA', {
      ...INV1,
      title: 'Kontrol odası',
      background: 'buro',
      hud: ['taps'],
      exposeCounts: true,
      scene: 'sc_oda',
      lines: B(S`
        = NİLÜFER TAPU MÜDÜRLÜĞÜ · 231 · KONTROL @buro
        - Genç bir memur kapıyı açtı, eşikte durdu. "Müdür Hanım'ın talimatı; ben burada bekleyeceğim." Elinde bir tutanak defteri.
        - Oda küçüktü: bir masa, bir dosya rafı, pencerenin önünde kurumuş bir sardunya. Eşyalar kolilere konmuştu ama masa olduğu gibi duruyordu. Takvim bile.
        ~ Yedi hafta. Bir odanın hafızası bundan uzun sürer; yeter ki kimse silmemiş olsun.
      `),
      instruction: 'Dikkat çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps',
      miss: tapMiss('FB_ODA'),
      finish: { id: 'ODA_BITIR', label: 'Odadan çık' },
    }),
    sceneSearch('INV1_KORIDOR', {
      ...INV1,
      title: 'İkinci kat koridoru',
      background: 'adliye',
      hud: ['taps_k'],
      exposeCounts: true,
      scene: 'sc_koridor',
      lines: B(S`
        = NİLÜFER TAPU MÜDÜRLÜĞÜ · 2. KAT KORİDORU @adliye
        - Koridor, soğuk açılıştaki sabahın aynısıydı; yalnızca yağmur yoktu. Florasan hâlâ titriyordu. Çay ocağından demlik buharı, uzaktan bir radyo.
        - Takipçiler merdivende dosyalarını sallıyordu. Biri beni görünce "abla, sıra fişi aşağıda" dedi; avukat olduğumu anlayınca sustu.
        ~ Halil bu koridordan 10.36'da merdivene yürüdü. 10.46'da döndü. Arada on dakika. Bu koridor o on dakikayı gördü.
      `),
      instruction: 'Dikkat çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps_k',
      miss: tapMiss('FB_KORIDOR'),
      finish: { id: 'KORIDOR_BITIR', label: 'Koridordan çık' },
    }),
    documentExam('INV1_KARAR', {
      ...INV1,
      title: 'Dinleme kararı',
      background: 'buro',
      hud: ['exam_left'],
      lines: B(S`
        - Kararın kendisi bir sayfa; ekleri on dört. Hâkimliğin mührü, bir imza, bir hat numarası, bir süre. Sonra kolluğun çözüm tutanakları: konuşmaların yazıya geçmiş hâli.
        - Leyla'nın sesi kafamda: hangi hat, kimin adına, hangi suç için, hangi tarihten hangi tarihe.
        ~ Bir alet seç, sonra satıra dokun. Bir karar, ne yazdığından çok neyi yazmadığıyla konuşur.
      `),
      header: { left: 'BURSA SULH CEZA HÂKİMLİĞİ · İLETİŞİMİN DENETLENMESİ', right: '04.01.2027' },
      columns: [
        { label: 'KALEM', flex: 1.1 },
        { label: 'İÇERİK', flex: 2.4 },
      ],
      rows: [
        row('k1', ['Suç', 'Rüşvet (TCK 252)']),
        row('k2', ['Tedbir uygulanacak hat', '0532 418 77 20 · C. Ateşoğlu']),
        row('k3', ['Süre', 'İki ay']),
        row('k4', ['Kayıt #6 · 19.02 14.12', 'Hedef hat ↔ tespit edilemeyen hat']),
        row('k5', ['Kayıt #9 · 08.03 19.20', 'Hat 0505 311 46 08 ↔ B. Öz']),
        row('k6', ['Kayıt #14 · 11.03 21.05', 'Hedef hat ↔ tespit edilemeyen hat']),
      ],
      tools: [
        tool('mag', 'Büyüteç', 'magnifier'),
        tool('cmp', 'Karşılaştır', 'compare'),
        tool('chk', 'Doğrula', 'check'),
      ],
      costVar: 'exam_left',
      rules: [
        examine('EX_K2', 'mag', 'k2', {
          discovers: 'clue_hedef_hat',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'Kararın “tedbir uygulanacak kişi ve iletişim aracı” bölümünde tek bir satır var: Cengiz Ateşoğlu, 0532 418 77 20. Başka hat yok. Halil’in adı hiç geçmiyor.',
            100,
          ),
        }),
        examine('EX_K3', 'chk', 'k3', {
          discovers: 'clue_sure',
          score: { DELIL_ANALIZI: 150 },
          feedback: found(
            'İki ay: 4 Ocak’tan 4 Mart’a. Eklerde uzatma kararı yok. Tedbirin bitirildiği tarihi ve saati gösteren tutanak da yok; olması gerekirdi.',
            150,
          ),
        }),
        examine('EX_K4', 'mag', 'k4', {
          discovers: 'clue_inat',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            '19 Şubat, süre içinde. Ateşoğlu: “Kontrolcü yine imzalamadı. On bir dosya, inatçı keçi.” Öbür ses: “Sen merak etme abi. Masasından kaldırırız onu.” Bu kaydı iddianame hiç anmamış.',
            100,
          ),
        }),
        examine('EX_K5', 'mag', 'k5', {
          discovers: 'clue_kayit9',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'Hat 0505 311 46 08: Halil Ekinci. Tam metin: “Dosyana bakarım Bayram, ama şerh kalkmadan imza yok.” İddianame yalnızca ilk yarısını almış.',
            100,
          ),
        }),
        examine('EX_K6', 'mag', 'k6', {
          discovers: 'clue_kayit14',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            '11 Mart, 21.05. Hedef hatta: “Kontrolcüyü hallettik. Zarf yarın masada.” İddianamenin anahtar cümlesi. Tarihe bir kez daha bak.',
            100,
          ),
        }),
      ],
      miss: examMiss('FB_KARAR'),
      finish: { id: 'KARAR_BITIR' },
    }),
    documentExam('INV1_TUTANAK', {
      ...INV1,
      title: 'Yakalama tutanağı',
      background: 'buro',
      hud: ['exam_t'],
      lines: B(S`
        - Üç sayfa, altı imza, iki fotoğraf. Tutanaklar her şeyi yazar; yalnızca neyi yazdıklarını yüksek sesle söylemezler.
        - Fotoğraflardan birinde kahverengi bir zarf, bir cetvelin yanında. Öbüründe açık bir çekmece; mühür yastığı, ataşlar, bir paket bisküvi.
        ~ Saatleri oku. Tutanakta saatler, tanıkların en sessizidir.
      `),
      header: { left: 'MALİ ŞUBE · YAKALAMA, ARAMA VE EL KOYMA', right: '12.03.2027' },
      columns: [
        { label: 'SAAT', flex: 0.8 },
        { label: 'TESPİT', flex: 2.6 },
      ],
      rows: [
        row('t1', ['10.31', 'İhbarcı binaya giriş yaptı (sıra fişi 147)']),
        row('t2', ['10.39', 'Ses kaydı alınamadı (teknik arıza)']),
        row('t3', ['10.43', 'İhbarcıdan “TAMAM” mesajı']),
        row('t4', ['10.44 · 10.46', 'Kontrol odasına giriş · şüphelinin gelişi']),
        row('t5', ['10.47', 'Üçüncü çekmece: barkodlu iç yazışma zarfı']),
      ],
      tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
      costVar: 'exam_t',
      rules: [
        examine('EX_T2', 'mag', 't2', {
          discovers: 'clue_kayit_durdu',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'Dipnot: “İhbarcıya takılan ses kayıt cihazı teknik arıza nedeniyle 10.39’dan itibaren kayıt almamıştır.” Arızayı kim, nasıl tespit etmiş? Yazmıyor.',
            100,
          ),
        }),
        examine('EX_T4', 'cmp', 't4', {
          discovers: 'clue_saat_tutanak',
          score: { DELIL_ANALIZI: 150 },
          feedback: found(
            '“10.44 — Ekip kontrol odasına girmiş, şüpheli odada bulunmamaktadır.” “10.46 — Şüpheli odaya gelmiş.” İki satır, iki dakika. Muhbirin “kendi elimle verdim”i bu iki dakikanın neresine sığıyor?',
            150,
          ),
        }),
        examine('EX_T5', 'mag', 't5', {
          discovers: 'clue_barkod',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            'Fotoğrafta zarfın sağ üst köşesi: müdürlüğün barkod etiketi, 0417. Bir iç yazışma zarfı. Kimin masasından çıkmış bir zarf?',
            100,
          ),
        }),
      ],
      miss: examMiss('FB_TUTANAK'),
      finish: { id: 'TUTANAK_BITIR' },
    }),
    documentExam('INV1_IFADE', {
      ...INV1,
      title: 'Muhbirin ifadeleri',
      background: 'buro',
      hud: ['exam_i'],
      lines: B(S`
        - İki tutanak, iki gün arayla. Birinin başlığında "İhbar", öbüründe "Tanık sıfatıyla ifade". İkisinin altında da aynı imza: titrek, büyük harflerle "BAYRAM".
        - Biri Emniyet'te gece yarısına doğru alınmış; öbürü savcılıkta, sabah. Arada bir operasyon, bir tutuklama, iki gün.
        ~ Bir insan iki gün içinde aynı şeyi iki kez anlatıyorsa, ikinci anlatı birincinin provasıdır. Değilse, iki ayrı hikâyedir.
      `),
      header: { left: 'BAYRAM ÖZ · İHBAR VE İFADE', right: '11.03 · 13.03.2027' },
      columns: [
        { label: 'TARİH', flex: 0.9 },
        { label: 'BEYAN', flex: 2.6 },
      ],
      rows: [
        row('i1', ['11.03 22.30', 'Memur dosyamı bekletiyordu']),
        row('i2', ['11.03 22.30', 'Kırk bin istedi, yarın getir dedi']),
        row('i3', ['13.03 09.15', 'Halil Bey’le kırk bine anlaştık']),
        row('i4', ['13.03 09.15', 'Zarfı kendi elimle verdim']),
        row('i5', ['13.03 09.15', 'Hakkımda etkin pişmanlık uygulanmasını isterim']),
      ],
      tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
      costVar: 'exam_i',
      rules: [
        examine('EX_I1', 'mag', 'i1', {
          discovers: 'clue_ihbar_icbar',
          score: { DELIL_ANALIZI: 100 },
          feedback: found(
            '“Kontrol memuru dosyamı bekletiyor. ‘Kırk bin getirmezsen bu dosya bu masadan çıkmaz’ dedi. Babam ölüyor; mecbur kaldım.” Zorla istenen bir para: mağdur bir muhbir.',
            100,
          ),
        }),
        examine('EX_I3', 'cmp', 'i3', {
          discovers: 'clue_savcilik_anlasma',
          score: { DELIL_ANALIZI: 150 },
          feedback: found(
            '“Halil Bey’le kırk bine anlaştık. Ben teklif etmedim ama kabul ettim. Zarfı kendi elimle masasına koydum; o da çekmeceye koydu.” Artık zorlanmış değil, anlaşmış. Ve zarf onun elinden geçmiş.',
            150,
          ),
        }),
        examine('EX_I5', 'mag', 'i5', {
          score: { HUKUKI_BILGI: 30 },
          feedback: {
            title: 'NOT',
            text: 'Rüşvet veren, durum makamlarca öğrenilmeden önce bildirirse cezaya hükmolunmaz. Bu cümle muhbiri “anlaşan” rolünde korur; “zorlanan” rolünde buna hiç ihtiyacı olmazdı.',
            label: '+30 SKOR',
            tone: 'info',
          },
        }),
      ],
      miss: examMiss('FB_IFADE'),
      finish: { id: 'IFADE_BITIR' },
    }),
  ],
};
