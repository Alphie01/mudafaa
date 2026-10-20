import {
  all,
  any,
  back,
  cmp,
  cont,
  decisionNode,
  deductionBoard,
  deliver,
  discover,
  documentExam,
  examine,
  fallback,
  flag,
  has,
  ifThen,
  inc,
  nav,
  not,
  option,
  raise,
  recipe,
  ref,
  row,
  sceneSearch,
  score,
  set,
  story,
  tool,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef, Effect } from '../../../tools/content/src/kit/index.js';
import { B, O, W, retarget } from './dsl.js';
import { INV, p1 } from './shared.js';

// 50-investigation: 3 gün × 5 EP. Olay yeri (sunucu odası fotoğrafları, Aktaşların evi, fabrika kapısı), müvekkil,
// tanıklar, arşiv (özet döküm, DataKale raporu, emniyet raporu, devir-teslim tutanağı, ham kayıt), dilekçe, tahta.

const tamDelivery = { evidence: 'ev_tam_log', requires: flag('dil_tam'), hint: 'Şirketten ham VPN kaydını dilekçeyle iste.' };
const dayEndDeliveries = deliver('INV_DAY_END', [tamDelivery]);
const nightDeliveries = deliver('INV_GECE_1', [tamDelivery]);

/** Tahtada bir çıkarımı yalnızca ilk kurulumda ödüllendirir (alternatif tarifler ve ara tahtası için). */
export const firstTime = (ded: string, amount = 300): Effect[] => [
  ifThen(not(has(ded)), [discover(ded), score('DELIL_ANALIZI', amount)]),
];

export const newDed = (title: string, text: string) => ({
  title,
  text,
  label: 'YENİ DELİL · +300 SKOR',
  tone: 'success' as const,
});

// --- Hub ---

const hubChoices = {
  olay: [
    p1.activity('H_ARAMA', 'Sunucu odası fotoğraflarını ara', 'INV_ARAMA', {
      once: true,
      description: 'Şikâyet eki · 24 fotoğraf',
    }),
    p1.activity('H_EV', 'Aktaşların evine git', 'INV_EV_G', { once: true, description: 'Nilüfer · Gül Hanım' }),
    p1.activity('H_KAPI', 'Fabrika kapısına git', 'INV_KAPI_G', {
      once: true,
      description: 'Bekçi kulübesi · dışarıdan',
    }),
  ],
  muvekkil: [
    p1.activity('H_GORUS', 'Selim’le görüş', 'INV_GORUSME_G_1', {
      description: 'Akşam yemeğine 14 dk',
      visibleWhen: not(visited('INV_GORUSME')),
    }),
    p1.activity('H_GORUS2', 'Selim’le yeniden görüş', 'INV_GORUSME_G_1', {
      description: 'Akşam yemeğine 8 dk',
      visibleWhen: visited('INV_GORUSME'),
    }),
  ],
  tanik: [
    p1.activity('H_T_YASAR', 'Yaşar Kılıç', 'INV_T_YASAR', { once: true, description: 'Gece bekçisi · gece vardiyası' }),
    p1.activity('H_T_HAKAN', 'Kom. Yrd. Hakan Ilgaz', 'INV_T_HAKAN', { once: true, description: 'Siber Büro · emniyet' }),
    p1.activity('H_T_BULENT', 'Bülent Arıkan', 'INV_T_BULENT', { once: true, description: 'DataKale · raporu yazan' }),
    p1.activity('H_T_TARIK', 'Tarık Sezer', 'INV_T_TARIK', {
      once: true,
      description: 'Müşteki şirketin genel müdürü',
    }),
  ],
  arsiv: [
    p1.activity('H_LOG', 'Oturum dökümünü incele', 'INV_LOG', { once: true, description: 'Şirketin verdiği özet' }),
    p1.activity('H_IMAJ', 'DataKale raporunu incele', 'INV_IMAJ', { once: true, description: 'İmaj ve analiz' }),
    p1.activity('H_EMN', 'Emniyet raporunu incele', 'INV_EMN', { once: true, description: 'Selim’in dizüstüsü' }),
    p1.activity('H_DEVIR', 'Devir-teslim tutanağını incele', 'INV_DEVIR', {
      once: true,
      description: 'Selim’in nüshası',
      visibleWhen: has('ev_devir'),
    }),
    p1.activity('H_TAM', 'Ham VPN kaydını incele', 'INV_TAM', {
      once: true,
      description: 'Şirketin cevabı geldi',
      visibleWhen: has('ev_tam_log'),
    }),
    p1.activity('H_DIL', 'Delil talebi dilekçesi (CMK 177)', 'INV_DIL', {
      description: '3 talep hakkı',
      visibleWhen: not(flag('dil_verildi')),
    }),
    p1.free('H_CIKARIM', 'Çıkarım tahtası', 'INV_CIKARIM', {
      description: '0 EP · ipuçlarını birleştir',
      enabledWhen: ref('kart2'),
      lockedReason: 'En az 2 ipucu gerekli.',
    }),
    p1.free('H_LEYLA', 'Leyla’ya danış', 'INV_LEYLA', {
      description: '0 EP · günde bir kez',
      visibleWhen: cmp(v('leyla_gun'), '<', v('day')),
      effects: [set('leyla_gun', v('day'))],
    }),
  ],
};

const hubLines = [
  W(
    cmp(v('day'), '==', 1),
    `
# GÜN 1/3 · BİRİNCİ CELSEYE 12 GÜN
> Hedef: kayıt Selim’i gösteriyor. Kaydı kim tuttu, kim özetledi, kim imajladı? Önce kâğıtlar.
`,
  ),
  W(
    all(cmp(v('day'), '==', 2), any(has('clue_gsm'), has('clue_hash'), has('clue_imaj_tarih'))),
    `
# GÜN 2/3 · BİRİNCİ CELSEYE 9 GÜN
> Hedef: kâğıtlarda çatlaklar var. Şimdi o hesabın şifresinin kimde olduğunu ve o gece kimin nerede olduğunu bul.
`,
  ),
  W(
    cmp(v('day'), '==', 2),
    `
# GÜN 2/3 · BİRİNCİ CELSEYE 9 GÜN
> Hedef: o hesap kimin elindeydi? Kâğıtları da unutma; kayıt okunmadan konuşmaz.
`,
  ),
  O(`
# GÜN 3/3 · BİRİNCİ CELSEYE 6 GÜN
> Hedef: dilekçe ve tahta. Kürsüdeki uzmana ne soracaksın; mahkemeden neyi isteyeceksin?
`),
];

// --- Sahne aramaları ---

const arama = sceneSearch('INV_ARAMA', {
  ...INV,
  title: 'Sunucu odası · şikâyet eki fotoğrafları',
  hud: ['taps'],
  exposeCounts: true,
  scene: 'sc_sunucu',
  background: 'buro',
  instruction: 'Fotoğrafta şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps',
  lines: B(`
# BÜRO — ŞİKÂYET EKİ, 24 FOTOĞRAF [bg:buro]
> Şirketin kendi çektiği fotoğraflar. Telefonla, flaşsız, florasan altında. Raf, kablolar, yeşil ve turuncu ışıklar.
~ Şikâyet bu fotoğrafları “zararın kanıtı” diye eklemiş. Kimse bir fotoğrafın kendi sahibinin aleyhine konuşabileceğini düşünmemiş.
> Fotoğrafların altında numaralar. 7’den sonra 9 geliyor; 8 yok. Bir dosyada eksik numara, sorulmamış bir sorudur.
~ Selim bu odada dokuz yıl geçirmiş. Ben ilk kez bakıyorum. Bir yabancı bazen bir evin sahibinden fazlasını görür; çünkü hiçbir şeye alışmamıştır.
`),
  miss: fallback('FB_ARAMA', 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  }),
  finish: { id: 'ARAMA_BITIR' },
});

const evGiris = decisionNode('INV_EV_G', [{ to: 'INV_ARAMA2' }], {
  ...INV,
  title: 'Aktaşların evi',
  lines: B(`
# ÇARŞAMBA 16.30 — NİLÜFER, AKTAŞLARIN EVİ [bg:ev]
> Kapıyı Gül açtı; okul önlüğü hâlâ üstündeydi, cebinde bir tebeşir. İçeriden çizgi film sesi.
gul: Gelin avukat hanım. Selim pazara çıktı; Defne’yle. İyi oldu, belki. Siz rahat bakarsınız.
> İki oda bir salon. Duvarda bir düğün fotoğrafı, vitrinde birkaç kupa, salonun köşesinde bir çalışma masası. Masanın ortası boş: dizüstünün yeri.
gul: Polis dizüstüyü aldı, bir de eski bir harici diski. Başka hiçbir şeye bakmadılar. Kâğıtlara hiç bakmadılar.
gul: Selim kâğıt saklar. Her şeyin tutanağını tutar. Faturaları ben saklarım; mutfak çekmecesinde. İkimiz de saklarız; bu evde kimse bir şey atmaz.
gul: O cuma akşamı da masadaydı biraz. Fotoğraflara bakıyordu galiba; Defne’nin bebeklik fotoğraflarına. Sonra yanıma geldi, dizinin yarısında uyudu.
~ Fotoğraflara bakıyordu. Gül bunu bir mazeret gibi değil, bir anı gibi söyledi.
gul: Bakın avukat hanım. Ne lazımsa. Ben çay koyayım. Elim boş kalınca ağlıyorum, çay koyunca geçiyor.
`),
});

const arama2 = sceneSearch('INV_ARAMA2', {
  ...INV,
  title: 'Aktaşların evi',
  hud: ['taps2'],
  exposeCounts: true,
  scene: 'sc_ev',
  background: 'ev',
  instruction: 'Evde dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps2',
  miss: fallback('FB_ARAMA2', 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Sıradan bir köşe. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  }),
  finish: { id: 'ARAMA2_BITIR', label: 'Evden ayrıl' },
});

const kapiGiris = decisionNode('INV_KAPI_G', [{ to: 'INV_ARAMA3' }], {
  ...INV,
  title: 'Fabrika kapısı',
  lines: B(`
# SALI 23.20 — ORGANİZE SANAYİ, NİLÜFER ÖRME KAPISI [bg:depo_gece]
> Gece vardiyasının son servisi kapıdan çıktı; arka camında “Allah korusun” yazan bir çıkartma. Sonra sokak boşaldı.
> Kulübenin ışığı yanıyordu. Yaşar Usta camı araladı; bu kez daha geniş.
yasar: Geldin mi kızım? Gece gel demiştim, geldin. İçeri alamam; içerisi şirketin. Ama buradan bakabilirsin. Kapı herkesin.
> Kapının önü kamuya açıktı: kaldırım, turnike, bekçi kulübesinin camı, otoparkın girişi. Fabrikanın ışıkları yağmurun içinde titriyordu.
~ Bir avukat bir şirketin içine giremez; ama kapısına bakabilir. Bazen kapı, içeriden fazlasını söyler.
`),
});

const arama3 = sceneSearch('INV_ARAMA3', {
  ...INV,
  title: 'Fabrika kapısı',
  hud: ['taps3'],
  exposeCounts: true,
  scene: 'sc_kapi',
  background: 'depo_gece',
  instruction: 'Kapıda dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps3',
  miss: fallback('FB_ARAMA3', 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Sadece ıslak bir kaldırım. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  }),
  finish: { id: 'ARAMA3_BITIR', label: 'Kapıdan ayrıl' },
});

// --- Belgeler ---

const log = documentExam('INV_LOG', {
  ...INV,
  title: 'VPN oturum dökümü (özet)',
  hud: ['exam_left'],
  background: 'buro',
  lines: B(`
# BÜRO — OTURUM DÖKÜMÜ [bg:buro]
> Bir sayfa. Altı satır. Başlıkta DataKale’nin logosu. Altında küçük harflerle: “Şirket güvenlik duvarı kayıtlarından derlenmiştir.”
> Kâğıdın kenarında bir kahve halkası. Benim değil; dosyayı benden önce okuyan avukatın. Çekilmeden önce bu sayfada bir yerde durmuş.
~ Altı satır, iki gece, bir kullanıcı adı. Savcılık bu sayfayı bir parmak izi gibi okuyor. Oysa kullanıcı adı bir parmak değil; bir anahtar.
~ Anahtar kimin cebindeyse kapı onu tanır. Kapı, anahtarı tutan eli tanımaz.
~ Derlenmiş. Yani biri seçmiş. Bir alet seç, sonra şüpheli satıra dokun. Doğru alet, doğru yer: yeni bir ipucu.
`),
  header: { left: 'DATAKALE · VPN OTURUM ÖZETİ · KULLANICI S.AKTAS', right: '17–18.10' },
  columns: [
    { label: 'SATIR', flex: 1.1 },
    { label: 'İÇERİK', flex: 2 },
    { label: 'NOT', flex: 1.1 },
  ],
  rows: [
    row('l1', ['Oturum 1', '17.10 21.30–21.52 · kaynak: sabit hat', 'işlem: kopyalama']),
    row('l2', ['Oturum 2', '18.10 02.14–02.41 · kaynak: GSM', 'işlem: silme']),
    row('l3', ['Kullanıcı', 'S.AKTAS (yönetici yetkili)', 'hesap durumu: aktif']),
    row('l4', ['Sütunlar', 'tarih · kullanıcı · kaynak türü · işlem', '—']),
    row('l5', ['Hazırlayan', 'B. Arıkan · DataKale', '20.10']),
  ],
  tools: [
    tool('mag', 'Büyüteç', 'magnifier'),
    tool('compare', 'Karşılaştır', 'compare'),
    tool('law', 'Mevzuat', 'check'),
  ],
  costVar: 'exam_left',
  rules: [
    examine('EX_L_2130', 'mag', 'l1', {
      discovers: 'clue_2130',
      score: { DELIL_ANALIZI: 100 },
      feedback: {
        title: 'YENİ İPUCU · CUMA 21.30',
        text: 'İlk oturum cuma 21.30’da, sabit bir ev hattından; yirmi iki dakika. İşlem: “Selim_kisisel” klasörünün kopyalanması. Selim bana bundan hiç söz etmedi.',
        label: '+100 SKOR · Not defterine eklendi',
        tone: 'special',
      },
      responses: B(`
~ Selim o gece bağlanmış. Bana “gece kapalıydı” demişti. Akşam ile gece arasında bir saat var; o saatte ne olduğunu ondan duymam gerek.
`),
    }),
    examine('EX_L_GSM', 'mag', 'l2', {
      discovers: 'clue_gsm',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · KAYNAK: GSM',
        text: 'Silme oturumu ev hattından değil, bir cep hattından açılmış. Birinci oturum sabit hattan, ikincisi GSM’den. Aynı kullanıcı adı, iki ayrı yol.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_L_SUTUN', 'law', 'l4', {
      score: { DELIL_ANALIZI: 60 },
      effects: [raise('fact_cihaz_eksik')],
      feedback: {
        title: 'EKSİK SÜTUN',
        text: 'Bir VPN kaydı oturumu açan cihazın adını ve kaynak adresini de tutar. Bu özet o sütunları almamış. Ham kayıt şirkette; mahkeme yazısıyla istenebilir.',
        label: '+60 SKOR',
        tone: 'success',
      },
    }),
    examine('EX_L_HESAP', 'compare', 'l3', {
      score: { DELIL_ANALIZI: 40 },
      effects: [raise('fact_hesap_aktif')],
      feedback: {
        title: 'HESAP AKTİF',
        text: 'İşten çıkarılan birinin yönetici hesabı on sekiz gün sonra hâlâ aktif. Ya unutulmuş, ya bilerek açık bırakılmış. İkisi de bir şey söyler.',
        label: '+40 SKOR',
        tone: 'neutral',
      },
    }),
    examine('EX_L_HAZ', 'mag', 'l5', {
      score: { DELIL_ANALIZI: 20 },
      feedback: {
        title: 'HAZIRLAYAN',
        text: 'Özeti şikâyetçinin firması hazırlamış, şikâyetle aynı gün. Ne emniyet ne mahkeme bu kaydın ham hâlini görmüş.',
        label: '+20 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: fallback('FB_LOG', 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: { title: 'SONUÇ YOK', text: 'Bu aletle burada bir şey görünmüyor.', label: '−20 SKOR', tone: 'error' },
  }),
  finish: { id: 'LOG_BITIR' },
});

const imaj = documentExam('INV_IMAJ', {
  ...INV,
  title: 'DataKale imaj ve analiz raporu',
  hud: ['exam2'],
  background: 'buro_gece',
  lines: B(`
# BÜRO — GECE [bg:buro_gece]
> On dört sayfa. Kapakta bir kale logosu ve “GİZLİDİR” damgası. İçeride tablolar, ekran görüntüleri, uzun onaltılık sayılar.
> Dışarıda yağmur hızlandı. Karşı binada tek bir pencere yanıyor; biri benim gibi geç saate kalmış, biri benim gibi bir şeyi anlamaya çalışıyor.
~ Bu raporu bir hâkim okusa “teknik” deyip geçer. Ben teknik değilim; o yüzden geçemem. Her satırı bir hikâye gibi okuyacağım.
~ Her hikâyenin bir anlatıcısı vardır. Bu raporun anlatıcısı, şikâyetçi şirketin her ay fatura kestiği firma. Tarafsız bir göz değil; bir tedarikçi.
~ Bu onu yalancı yapmaz. Ama her cümlesini iki kez okumam için yeterli bir sebep.
`),
  header: { left: 'DATAKALE BİLİŞİM · İMAJ VE ANALİZ RAPORU', right: 'NO: DK-2611' },
  columns: [
    { label: 'BÖLÜM', flex: 1 },
    { label: 'İÇERİK', flex: 2.1 },
    { label: 'SAYFA', flex: 0.6 },
  ],
  rows: [
    row('k1', ['Künye', 'İmaj alma: 20.10, 15.40 · ortam: dosya sunucusu', 's. 1']),
    row('k2', ['Özet değer (alım)', 'a3f9…71c2', 's. 3']),
    row('k3', ['Özet değer (analiz)', 'a3f9…08be', 's. 11']),
    row('k4', ['Ek-3', '18–19.10 müşteri talebiyle kurtarma çalışmaları', 's. 13']),
    row('k5', ['Sonuç', '“Silme işlemi sanığın hesabından yapılmıştır.”', 's. 12']),
    row('k6', ['İmza', 'B. Arıkan · kurucu ortak', 's. 14']),
  ],
  tools: [
    tool('mag', 'Büyüteç', 'magnifier'),
    tool('compare', 'Karşılaştır', 'compare'),
    tool('law', 'Mevzuat', 'check'),
  ],
  costVar: 'exam2',
  rules: [
    examine('EX_I_TARIH', 'mag', 'k1', {
      discovers: 'clue_imaj_tarih',
      score: { DELIL_ANALIZI: 100 },
      feedback: {
        title: 'YENİ İPUCU · İKİ GÜN',
        text: 'İmaj 20 Ekim 15.40’ta alınmış. Silme 18 Ekim gecesi. İki gün boyunca disk canlı sistemde çalışmaya devam etmiş.',
        label: '+100 SKOR · Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_I_HASH', 'compare', 'k3', {
      discovers: 'clue_hash',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · ÖZET DEĞER',
        text: 'Alımdaki özet “…71c2” ile bitiyor, analizdeki “…08be.” İkisi aynı imajın parmak izi olmalıydı. Değil. Raporda tek satır açıklama yok.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
      responses: B(`
~ Bir imajın özet değeri parmak izi gibidir. İki parmak izi tutmuyorsa ya iki ayrı el vardır, ya da biri bir şeye dokunmuştur.
`),
    }),
    examine('EX_I_HASH2', 'compare', 'k2', {
      effects: [ifThen(not(has('clue_hash')), [discover('clue_hash'), score('DELIL_ANALIZI', 150)])],
      feedback: {
        title: 'ÖZET DEĞERLER',
        text: 'Sayfa 3’teki değeri sayfa 11’dekiyle karşılaştırdım: son dört hane farklı.',
        label: 'Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_I_KURTARMA', 'mag', 'k4', {
      discovers: 'clue_kurtarma',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · KURTARMA',
        text: '“Müşteri talebiyle veri kurtarma yazılımları canlı sistem üzerinde denenmiştir.” Yani imajdan önce diske yazılmış. Olay yerinde iki gün dolaşılmış.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_I_SONUC', 'law', 'k5', {
      score: { DELIL_ANALIZI: 60 },
      effects: [raise('fact_uzman')],
      feedback: {
        title: 'KANAAT, BULGU DEĞİL',
        text: 'Bir hesabın kullanıldığı bulgu olabilir; o hesabı sanığın kullandığı bir kanaattir. Üstelik bu rapor mahkemenin atadığı bilirkişinin değil, şikâyetçinin firmasının: uzman mütalaası (CMK 67/6).',
        label: '+60 SKOR',
        tone: 'success',
      },
    }),
  ],
  miss: fallback('FB_IMAJ', 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: { title: 'SONUÇ YOK', text: 'Bu satırda bu aletle bir şey çıkmadı.', label: '−20 SKOR', tone: 'error' },
  }),
  finish: { id: 'IMAJ_BITIR' },
});

const emn = documentExam('INV_EMN', {
  ...INV,
  title: 'Emniyet inceleme raporu',
  hud: ['exam3'],
  background: 'buro',
  lines: B(`
# BÜRO — EMNİYET RAPORU [bg:buro]
> Altı sayfa. Düz, resmî, tarih sırasıyla. İlk sayfada arama kararının sayısı, el koyma tutanağı, imajın özet değeri, iki memurun imzası.
~ Bu rapor sıkıcı. Sıkıcı raporlar genellikle doğru raporlardır.
> İmzalardan biri Hakan Ilgaz. Altında bir not: “İnceleme, el konulan cihazın birebir kopyası üzerinde yapılmıştır; asıl cihaz mühürlüdür.”
~ Kopya üzerinde çalışmak. Aslına dokunmamak. Bir polisin bunu yazma zahmetine girmesi, dosyadaki en dürüst cümle olabilir.
`),
  header: { left: 'SİBER SUÇLARLA MÜCADELE ŞUBE · İNCELEME RAPORU', right: '29.10' },
  columns: [
    { label: 'BÖLÜM', flex: 1 },
    { label: 'BULGU', flex: 2.2 },
  ],
  rows: [
    row('e1', ['Usul', 'Arama kararı · el koyma tutanağı · imaj ve özet değer (tutanakta)']),
    row('e2', ['Cihaz', 'Dizüstü · sistem adı: SELIM-PC']),
    row('e3', ['Bağlantılar', '17.10 21.30–21.52 VPN · ev ağı']),
    row('e4', ['02.00–03.00', 'Cihaz kapalı · olay kaydı yok']),
    row('e5', ['Kopyalanan', 'Selim_kisisel: 412 fotoğraf, 1 özgeçmiş']),
  ],
  tools: [
    tool('mag', 'Büyüteç', 'magnifier'),
    tool('compare', 'Özet dökümle karşılaştır', 'compare'),
    tool('law', 'Mevzuat', 'check'),
  ],
  costVar: 'exam3',
  rules: [
    examine('EX_E_YOK', 'compare', 'e4', {
      discovers: 'clue_emn_yok',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · CİHAZ KAPALI',
        text: 'Özet döküm 02.14’te bir oturum gösteriyor. Selim’in bilgisayarı o saatte kapalı; hiçbir bağlantı izi yok. Bilgisayarındaki tek oturum 21.30.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_E_CIHAZ', 'mag', 'e2', {
      discovers: 'clue_emn_cihaz',
      score: { DELIL_ANALIZI: 60 },
      feedback: {
        title: 'CİHAZ ADI',
        text: 'Selim’in dizüstüsü ağa “SELIM-PC” adıyla bağlanıyor. Her oturum kaydına bu ad düşer; özet dökümde bu sütun yok.',
        label: '+60 SKOR · Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_E_USUL', 'law', 'e1', {
      score: { DELIL_ANALIZI: 60 },
      effects: [raise('fact_emn_usul')],
      feedback: {
        title: 'DOĞRU YAPILMIŞ BİR İMAJ',
        text: 'Karar, tutanak, imaj, özet değer, iki imza: CMK 134’ün istediği güvenceler burada var. Şirket tarafında hiçbiri yok. Karşılaştırma kendiliğinden bir argüman.',
        label: '+60 SKOR',
        tone: 'success',
      },
    }),
    examine('EX_E_KOPYA', 'mag', 'e5', {
      score: { DELIL_ANALIZI: 20 },
      feedback: {
        title: '412 FOTOĞRAF',
        text: 'Kopyalanan klasörde dört yüz on iki fotoğraf ve bir özgeçmiş. Şirket verisi yok. Sipariş, tasarım, muhasebe: hiçbiri.',
        label: '+20 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: fallback('FB_EMN', 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: { title: 'SONUÇ YOK', text: 'Bu satırda bu aletle bir şey çıkmadı.', label: '−20 SKOR', tone: 'error' },
  }),
  finish: { id: 'EMN_BITIR' },
});

const devir = documentExam('INV_DEVIR', {
  ...INV,
  title: 'Devir-teslim tutanağı',
  hud: ['exam4'],
  background: 'buro',
  lines: B(`
# BÜRO — TUTANAK [bg:buro]
> Tek sayfa. Şirketin antetli kâğıdı. Yedi madde, iki imza, bir paraf. Altıncı madde mavi tükenmezle, sonradan eklenmiş.
~ Bir adam işten çıkarken neyi kime teslim etti? Leyla’nın sorusu. Cevabı bu kâğıtta.
> Kâğıdın arkasında, kurşun kalemle, Selim’in el yazısı: “Kartı kapıda bıraktım. Kupamı unuttum.” Altına bir gülen yüz çizmiş, sonra karalamış.
~ İşten çıkarılan bir adamın son notu. Ne öfke ne tehdit; bir kupa. Tutanaklar insanların ne bıraktığını yazar; ne hissettiğini değil.
`),
  header: { left: 'NİLÜFER ÖRME TEKSTİL · DEVİR-TESLİM TUTANAĞI', right: '30.09' },
  columns: [
    { label: 'MADDE', flex: 0.6 },
    { label: 'İÇERİK', flex: 2.4 },
  ],
  rows: [
    row('d1', ['1', 'Teslim eden: S. Aktaş · teslim alan: T. Sezer (Genel Müdür)']),
    row('d2', ['2', 'Dizüstü bilgisayar (demirbaş) iade edilmiştir.']),
    row('d3', ['3', 'Personel kartı ve sunucu odası anahtarı iade edilmiştir.']),
    row('d4', ['4', 'Sunucu, güvenlik duvarı ve VPN yönetici şifreleri kapalı zarf içinde teslim edilmiştir.']),
    row('d5', ['5', 'Son yedekleme 30.09 22.00 · başarılı.']),
    row('d6', ['6', '(el yazısı) Kişisel dosyalar için VPN hesabı 31.10’a kadar açık bırakılmıştır. — T.S.']),
    row('d7', ['İmza', 'S. Aktaş · T. Sezer']),
  ],
  tools: [
    tool('mag', 'Büyüteç', 'magnifier'),
    tool('compare', 'Karşılaştır', 'compare'),
    tool('law', 'Mevzuat', 'check'),
  ],
  costVar: 'exam4',
  rules: [
    examine('EX_D_SIFRE', 'mag', 'd4', {
      discovers: 'clue_sifre_zarf',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · KAPALI ZARF',
        text: 'Bütün yönetici şifreleri 30 Eylül’den beri bir zarfta. Zarfı teslim alan: genel müdür. Kayıttaki kullanıcı adı artık tek bir kişiyi göstermiyor.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_D_ACIK', 'law', 'd6', {
      discovers: 'clue_hesap_acik',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · HESAP AÇIK',
        text: 'El yazısıyla, genel müdürün parafıyla: hesap 31 Ekim’e kadar kişisel dosyalar için açık. 17 Ekim bu sürenin içinde. “Hukuka aykırı giriş” için önce bir yasak gerekir.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
    }),
    examine('EX_D_KART', 'compare', 'd3', {
      score: { DELIL_ANALIZI: 60 },
      effects: [raise('fact_kart_iade')],
      feedback: {
        title: 'KART İADE EDİLMİŞ',
        text: 'Selim’in personel kartı ve sunucu odası anahtarı 30 Eylül’de iade edilmiş. Kartlı bir kapının arkasında olan bir şeye, Selim elini süremez.',
        label: '+60 SKOR',
        tone: 'success',
      },
    }),
    examine('EX_D_YEDEK', 'compare', 'd5', {
      score: { DELIL_ANALIZI: 40 },
      feedback: {
        title: 'YEDEK ÇALIŞIYOR',
        text: 'Selim ayrılırken son yedek başarılı. Şikâyetteki “yedek aylardır arızalıydı” cümlesi bu kâğıtla aynı masaya sığmıyor.',
        label: '+40 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: fallback('FB_DEVIR', 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: { title: 'SONUÇ YOK', text: 'Bu maddede bu aletle bir şey çıkmadı.', label: '−20 SKOR', tone: 'error' },
  }),
  finish: { id: 'DEVIR_BITIR' },
});

/** Ham VPN kaydı: soruşturmada dilekçeyle gelirse burada, gelmezse ara evresinde incelenir. */
export const tamDoc = (id: string, chapterSpread: typeof INV, returnTo?: string) =>
  retarget(
    documentExam(id, {
      ...chapterSpread,
      title: 'Ham VPN kaydı',
      hud: ['tam_left'],
      background: 'buro_gece',
      lines: B(`
> Şirketin avukatının üst yazısıyla gelen dört sayfa: “Mahkemenizin yazısı üzerine ham kayıt ekte sunulmuştur.” Satırlar uzun, sütunlar sık.
~ Özet altı satırdı. Ham kayıt yüz altmış. Arada kaybolan her sütun, birinin önemsiz bulduğu bir gerçek.
> Gözlerim satırlar arasında kayıyor. Saat, kullanıcı, kaynak; bir de özette hiç olmayan bir sütun: cihaz. Her bağlantı kendini bir adla tanıtmış.
~ Bilgisayarlar da insanlar gibi kapıda adını söyler. Kimse sormadığı için kimse duymamış.
`),
      header: { left: 'GÜVENLİK DUVARI · VPN OTURUM KAYDI (HAM)', right: '17–18.10' },
      columns: [
        { label: 'SAAT', flex: 0.9 },
        { label: 'KULLANICI', flex: 0.9 },
        { label: 'KAYNAK', flex: 1 },
        { label: 'CİHAZ', flex: 1.1 },
      ],
      rows: [
        row('t1', ['21.30', 'S.AKTAS', 'sabit hat', 'SELIM-PC']),
        row('t2', ['02.14', 'S.AKTAS', 'GSM (Görükle)', 'NOS-GM-LT']),
        row('t3', ['02.41', 'S.AKTAS', 'GSM (Görükle)', 'oturum kapandı']),
        row('t4', ['03.02', 'sistem', '—', 'yedek görevi: hedef bulunamadı']),
      ],
      tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Emniyet raporuyla karşılaştır', 'compare')],
      costVar: 'tam_left',
      rules: [
        examine(`${id}_EX_T2`, 'compare', 't2', {
          discovers: 'clue_cihaz_adi',
          score: { DELIL_ANALIZI: 150 },
          feedback: {
            title: 'YENİ İPUCU · CİHAZ ADI',
            text: '21.30 oturumu SELIM-PC’den. 02.14 oturumu başka bir cihazdan: NOS-GM-LT. Aynı kullanıcı adı, iki ayrı makine.',
            label: '+150 SKOR · Not defterine eklendi',
            tone: 'special',
          },
          responses: B(`
~ Kullanıcı adı bir isimdir; cihaz adı bir el. Bu iki oturumda iki ayrı el var.
`),
        }),
        examine(`${id}_EX_T4`, 'mag', 't4', {
          score: { DELIL_ANALIZI: 40 },
          effects: [raise('fact_yedek_hedef')],
          feedback: {
            title: 'HEDEF BULUNAMADI',
            text: 'Gece 03.02’de sistem her zamanki yedek görevini başlatmış: “hedef bulunamadı.” Yedek cihazı o saatte bağlı değil.',
            label: '+40 SKOR',
            tone: 'neutral',
          },
        }),
        examine(`${id}_EX_T1`, 'mag', 't1', {
          score: { DELIL_ANALIZI: 20 },
          feedback: {
            title: 'SABİT HAT',
            text: 'Birinci oturum ev hattından ve Selim’in bilgisayarından; emniyet raporuyla birebir aynı.',
            label: '+20 SKOR',
            tone: 'neutral',
          },
        }),
      ],
      miss: fallback(`${id}_FB`, 'EXAMINE', {
        score: { DELIL_ANALIZI: -20 },
        feedback: { title: 'SONUÇ YOK', text: 'Bu satırda bu aletle bir şey yok.', label: '−20 SKOR', tone: 'error' },
      }),
      finish: { id: `${id}_BITIR` },
    }),
    returnTo,
  );

// --- Dilekçe ---

const slotCost = [{ var: 'slots', amount: 1 }];
const dil = story('INV_DIL', {
  ...INV,
  title: 'Delil talebi dilekçesi',
  hud: ['slots'],
  background: 'buro',
  lines: [
    W(
      not(flag('dil_any')),
      `
# BÜRO — DİLEKÇE [bg:buro]
> Boş bir sayfa. “Bursa 9. Asliye Ceza Mahkemesi Hâkimliği’ne.” İmleç yanıp sönüyor.
~ Üç talep. Mahkeme gerekçesiz talebi reddeder; her gereksiz talep, gerçek talebin ağırlığını eksiltir.
> Leyla’nın eski dilekçeleri bir klasörde, rafın en üstünde. Birini açtım: iki sayfa, üç talep, her talebin altında tek bir “çünkü”.
~ “Çünkü” yazamadığın talebi yazma. Leyla bunu ilk haftamda söylemişti. O zaman bir dilekçenin uzun olması gerektiğini sanıyordum.
`,
    ),
    O(`
> Dilekçe uzuyor. İmleç hâlâ yanıp sönüyor.
`),
  ],
  choices: [
    option('DIL_TAM', 'Şirketten ham VPN kaydı (bütün sütunlarıyla)', {
      visibleWhen: any(flag('fact_cihaz_eksik'), has('clue_gsm')),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 50 },
      effects: [raise('dil_tam'), raise('dil_any')],
      good: 'Özet yerine ham kaydı istemek doğru: delilin bütününe ulaşılmadan değeri takdir edilemez (CMK 177; CMK 217).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_BILIRKISI', 'Mahkemece bilirkişi atanması; orijinal disklerin muhafazası', {
      visibleWhen: any(has('clue_hash'), has('clue_kurtarma'), has('clue_hakan'), flag('fact_uzman')),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 50 },
      effects: [raise('dil_bilirkisi'), raise('dil_any')],
      good: 'Şikâyetçinin aldırdığı uzman görüşü bilirkişi raporu değildir; mahkemeden bağımsız bilirkişi (CMK 63) ve orijinal disklerden usulüne uygun imaj (CMK 134) istenir.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_KART', 'Şirketten 17–18 Ekim kart geçiş kayıtları', {
      visibleWhen: any(flag('fact_turnike'), has('clue_kartli_kapi'), flag('fact_kart_iade')),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 50 },
      effects: [raise('dil_kart'), raise('dil_any')],
      good: 'Yedeğin elle devre dışı bırakıldığı odaya kimin girdiğini gösterecek kayıt; somut ve olayla sınırlı talep (CMK 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_EPOSTA', 'Şirketin bütün e-posta sunucusu', {
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: -40 },
      effects: [raise('dil_any')],
      bad: 'Kapsamı belirsiz, olayla ilişkisi gösterilmemiş talep reddedilir; üçüncü kişilerin özel hayatı ve ticari sırlar da gözetilir. Bir talep hakkı boşa gitti.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_KESIF', 'Fabrikada keşif', {
      cost: slotCost,
      maxUses: 1,
      effects: [raise('dil_any')],
      neutral: 'Keşif odayı gösterir; odaya kimin, ne zaman girdiğini göstermez.',
      next: '$stay',
    }),
    cont('DIL_VER', 'Dilekçeyi ver', '$return', {
      role: 'PRIMARY',
      effects: [raise('dil_verildi')],
      enabledWhen: flag('dil_any'),
    }),
    back('DIL_GERI', 'Sonra yazarım'),
  ],
});

// --- Tahta ---

const POOL = [
  'clue_son_yedek',
  'clue_bos_yuva',
  'clue_kartli_kapi',
  'ev_eposta',
  'clue_modem',
  'clue_defter',
  'clue_2130',
  'clue_gsm',
  'clue_imaj_tarih',
  'clue_kurtarma',
  'clue_hash',
  'clue_emn_yok',
  'clue_emn_cihaz',
  'clue_sifre_zarf',
  'clue_hesap_acik',
  'clue_cihaz_adi',
  'clue_kisisel',
  'clue_bulent',
  'clue_hakan',
  'clue_yasar',
];

export const invRecipes = (prefix: string): ChoiceDef[] => [
  recipe(`${prefix}_SIFRE`, 'clue_sifre_zarf', 'clue_gsm', {
    effects: firstTime('ded_sifre'),
    feedback: newDed('Hesap yalnızca Selim’in elinde değildi', 'Şifreler zarfta genel müdüre teslim edilmişti; silme oturumu başka bir yoldan.'),
    responses: B(`
~ Kayıtta “S.AKTAS” yazıyor. Bir isim değil; bir anahtar. O anahtarın kopyası 30 Eylül’den beri bir zarfta.
`),
  }),
  recipe(`${prefix}_ZINCIR`, 'clue_imaj_tarih', 'clue_kurtarma', {
    effects: firstTime('ded_zincir'),
    feedback: newDed('İmaj, kurcalanmış bir diskten alındı', 'İki gün kurtarma denemesi, sonra imaj.'),
    responses: B(`
~ Bir olay yeri iki gün boyunca ayak izleriyle doldurulmuş; sonra fotoğrafı çekilmiş. Hangi iz kimin, artık kimse söyleyemez.
`),
  }),
  recipe(`${prefix}_ZINCIR2`, 'clue_bulent', 'clue_imaj_tarih', {
    effects: firstTime('ded_zincir'),
    feedback: newDed('İmaj, kurcalanmış bir diskten alındı', 'Bülent “cumartesi kurcaladık” dedi; imaj pazartesi.'),
    responses: B(`
~ “Aynı sabah” dedi. Künye iki gün sonrasını söylüyor. Arada “biraz kurcaladık” var.
`),
  }),
  recipe(`${prefix}_OZET`, 'clue_hash', 'clue_kurtarma', {
    effects: firstTime('ded_ozet'),
    feedback: newDed('İmajın bütünlüğü kanıtlanamıyor', 'Özet değerler tutmuyor; disk imajdan önce yazılmış.'),
    responses: B(`
~ Parmak izi tutmuyor. Bunun bir açıklaması olabilir; ama raporda yok. Açıklanmayan bir çatlak, kürsüde açıklanmak zorunda kalır.
`),
  }),
  recipe(`${prefix}_OZET2`, 'clue_hash', 'clue_bulent', {
    effects: firstTime('ded_ozet'),
    feedback: newDed('İmajın bütünlüğü kanıtlanamıyor', 'Özet değerler tutmuyor; firma kurcaladığını kabul ediyor.'),
  }),
  recipe(`${prefix}_DIZUSTU`, 'clue_emn_yok', 'clue_gsm', {
    effects: firstTime('ded_dizustu'),
    feedback: newDed('02.14 bağlantısı Selim’in bilgisayarından yapılmadı', 'Dizüstü kapalı; oturum bir cep hattından.'),
    responses: B(`
~ Savcı “başka bir cihaz kullanmış olabilir” demiş. Olabilir. Ama o cihaz polisin elinde değil; kayıtta da Selim’in değil.
`),
  }),
  recipe(`${prefix}_HAT`, 'clue_modem', 'clue_gsm', {
    effects: firstTime('ded_hat'),
    feedback: newDed('Silme oturumu evden açılmadı', 'Ev hattı sabit; silme oturumu bir cep hattından.'),
  }),
  recipe(`${prefix}_RIZA`, 'ev_eposta', 'clue_2130', {
    effects: firstTime('ded_riza'),
    feedback: newDed('21.30 bağlantısı izinliydi', 'Genel müdür hesabın kişisel dosyalar için açık kalacağını yazmıştı.'),
    responses: B(`
~ Kapı açık bırakılmıştı. Selim o kapıdan girdi, kendi eşyasını aldı, çıktı. Bunun adı hırsızlık değil; taşınmak.
`),
  }),
  recipe(`${prefix}_RIZA2`, 'clue_hesap_acik', 'clue_kisisel', {
    effects: firstTime('ded_riza'),
    feedback: newDed('21.30 bağlantısı izinliydi', 'Tutanağın altıncı maddesi ve Selim’in anlattığı aynı şeyi söylüyor.'),
  }),
  recipe(`${prefix}_RIZA3`, 'ev_eposta', 'clue_kisisel', {
    effects: firstTime('ded_riza'),
    feedback: newDed('21.30 bağlantısı izinliydi', 'E-posta izin veriyor; Selim yalnızca kendi klasörünü aldı.'),
  }),
  recipe(`${prefix}_YEDEK`, 'clue_son_yedek', 'clue_bos_yuva', {
    effects: firstTime('ded_yedek'),
    feedback: newDed('Yedek, silmeden saatler önce elle devre dışı bırakıldı', 'Cuma 22.00’de çalışan cihazın kablosu sabaha sökülmüş.'),
    responses: B(`
~ Silme uzaktan yapılabilir. Bir kabloyu çekmek için ise o odada eğilmek gerekir. Bu dosyanın iki eli var: biri uzakta, biri odada.
`),
  }),
  recipe(`${prefix}_CIHAZ`, 'clue_cihaz_adi', 'clue_emn_cihaz', {
    effects: firstTime('ded_cihaz'),
    feedback: newDed('Silme oturumu başka bir cihazdan açıldı', '21.30: SELIM-PC. 02.14: NOS-GM-LT.'),
    responses: B(`
~ Aynı isim, başka bir el. NOS-GM-LT. Bir şirket demirbaşının adı gibi duruyor. Kimin zimmetinde olduğunu bilmiyorum. Henüz.
`),
  }),
];

const cikarim = deductionBoard('INV_CIKARIM', {
  ...INV,
  title: 'Çıkarım tahtası',
  background: 'buro_gece',
  lines: B(`
> İki ipucunu seç. Birbirini tamamlıyorsa duruşmada kullanabileceğin bir delil doğar.
~ Pano, raptiyeler, kırmızı ip. Leyla bununla dalga geçer. Sonra gelip uzun uzun bakar.
`),
  pool: POOL,
  recipes: [
    ...invRecipes('CB'),
    recipe('CB_X_MODEM', 'clue_modem', 'clue_kartli_kapi', {
      score: { DELIL_ANALIZI: -50 },
      feedback: {
        title: 'Yanlış iz',
        text: 'Bir ev modemi ve bir şirket kapısı. İkisi de bir yere bağlanır; birbirine değil.',
        label: 'BAĞLANTI YOK · −50 SKOR',
        tone: 'error',
      },
    }),
    recipe('CB_X_HAKAN', 'clue_hakan', 'clue_kisisel', {
      score: { DELIL_ANALIZI: -50 },
      feedback: {
        title: 'Yanlış iz',
        text: 'Polisin incelemediği diskler ve Selim’in fotoğrafları. İkisi de doğru; ama birbirini açıklamıyor.',
        label: 'BAĞLANTI YOK · −50 SKOR',
        tone: 'error',
      },
    }),
  ],
  miss: fallback('FB_CIKARIM', 'COMBINE', {
    repeat: 'ONCE_PER_PARAMS',
    score: { DELIL_ANALIZI: -50 },
    feedback: { title: 'Bu ikisi birbirini açıklamıyor', text: 'Başka bir ipucu dene.', label: 'BAĞLANTI YOK · −50 SKOR', tone: 'error' },
  }),
  finish: { id: 'CIKARIM_BITIR' },
});

// --- Leyla ---

const leyla = story('INV_LEYLA', {
  ...INV,
  title: 'Leyla’ya danış',
  background: 'buro',
  lines: [
    W(
      all(cmp(v('day'), '==', 1), not(has('clue_hash'))),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: DataKale raporunu okudun mu? Okumadan bana gelme.
leyla: Kısaca söyleyeyim, sonra kendin bul. Bilgisayarda arama ve el koyma CMK 134’te. Kanun bir şey ister: delilin bütünlüğü. İmaj alınır, özet değeri yazılır, tutanak tutulur.
leyla: Özet değer, imajın parmak izidir. Sonradan aynı imaja bakan herkes aynı izi bulmalı. Bulamıyorsa, imaja biri dokunmuştur.
leyla: Bir de şu: o rapor mahkemenin bilirkişisinin değil. Şikâyetçinin parasıyla yazılmış bir uzman görüşü. Kanun buna izin verir, 67/6; ama adını doğru koy.
~ Parmak izi. Bir makinenin parmak izi. Leyla bilgisayardan anlamadığını söylüyor; ama parmak izinden anlıyor.
`,
    ),
    W(
      cmp(v('day'), '==', 1),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Bir çatlak buldun; yüzünden belli. Sevinme. Usule aykırı toplanmış delil kendiliğinden yok hükmünde değildir; hâkim onu takdir eder, CMK 217.
leyla: Mahkemeye “rapor bozuk” dersen, “peki silmeyi kim yaptı” der. Çatlağın yanına bir de insan koy. O gece kim, nerede?
leyla: Bir de müvekkilin. Kayıtta bir şey var, onda başka bir şey. İkisi aynı hikâyeyi anlatana kadar duruşmaya girme.
`,
    ),
    W(
      all(cmp(v('day'), '==', 2), not(has('ev_devir'))),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Sisteme girme suçu bir kapı suçudur Deniz. 243: “hukuka aykırı olarak giren.” Önce kapının kilitli olduğunu, yani girme yetkisinin olmadığını göstermek gerekir.
leyla: İşten çıkarılan bir adamın yetkisi ne zaman biter? Çıkış gününde mi, hesabı kapatıldığında mı, yoksa biri “açık kalsın” dediğinde mi?
leyla: Rıza, hukuka aykırılığı kaldırır. Ama rızanın bir kâğıdı olmalı. Müvekkilinin evinde kâğıt var mı? Bilgisayarcılar kâğıt saklamaz derler; yanlış. Düzenli olanlar saklar.
`,
    ),
    W(
      cmp(v('day'), '==', 2),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Tutanak iyi. Şifreler bir zarfta. Bu, birinin daha o kapıyı açabileceğini gösterir. Açtığını göstermez.
leyla: Dikkat: bir isim düşünmeye başladıysan, o ismi kâğıt söylemeden ağzına alma. Ne müvekkilinin yanında, ne kürsüde. İsmi ancak kayıt söyler.
leyla: Dilekçeyi gününde ver. Kanun duruşmadan en az beş gün önce ister. Geç kalan dilekçe, hiç yazılmamış dilekçedir.
`,
    ),
    O(`
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Birkaç gün sonra o uzman kürsüde olacak. Onu küçük düşürmeye çalışma. Raporunu ona okut; kendi cümlelerini kendi duysun.
leyla: Bir de karşı taraf: şirketin vekili var, Ozan Tekin. Şirketle ancak onun aracılığıyla konuşursun. Genel müdürün kapısını çalmak istediğinde bunu hatırla.
leyla: Ve hâkim. Tek hâkim, tek vicdan. Heyeti ikna etmek bir tartışmadır; tek hâkimi ikna etmek bir sohbettir. Bağırma.
> Sigara paketini avucunda çevirdi. Açmadı. Dört yıldır açmadığı gibi.
`),
  ],
  choices: [back('LEYLA_DON', 'Teşekkür et')],
});

// --- Gün sonları ---

const dayEnd = decisionNode('INV_DAY_END', [{ when: cmp(v('day'), '==', 2), to: 'INV_AKSAM1' }, { to: 'INV_AKSAM2' }], {
  ...INV,
  title: 'Gün sonu',
  onEnter: [...dayEndDeliveries.effects, inc('day', 1), set('ap', 6)],
});

const aksam1 = story('INV_AKSAM1', {
  ...INV,
  title: 'İlk akşam',
  background: 'buro_gece',
  lines: B(`
# GECE 22.15 — ARSLAN HUKUK [bg:buro_gece]
> Büroda Leyla’yla ikimiz kaldık. Yağmur camda; kalorifer tıkırdıyor. Leyla gözlüğünü çıkardı, burnunun kemerini ovuşturdu.
> Masasının köşesinde açılmamış sigara paketi. Yirmi yıldır orada olduğunu söylerler; her zor dosyada eline alır, çevirir, geri koyar.
> Bu akşam paketi aldı. Çevirdi. Geri koymadı; avucunda tuttu.
leyla: İlk dosyamı hatırlıyorum. Bir hırsızlık. Herkes müvekkilimin parmak izini konuşuyordu; ben pencerenin hangi yöne açıldığını sordum. Kimse sormamıştı.
leyla: Pencere içe açılıyordu. Parmak izi dışarıdaydı. Davayı bir menteşe kazandı.
~ Leyla hikâye anlatmaz. Anlattığında bir ders verir; dersin adını da söylemez.
leyla: Bugün çok kâğıt okudun. Kayıtlar, raporlar, özetler. Bir şey sorayım: bugün neye inandın?
`),
  choices: [
    option('AK1_MAKINE', '“Makineye. Kayıt yalan söylemez.”', {
      effects: [set('aksam1', 'MAKINE')],
      responses: B(`
leyla: Kayıt yalan söylemez. Ama kaydı biri tutar, biri özetler, biri sana verir. Her el bir şey düşürür.
leyla: Makineye inanan avukat insanı unutur. Bu dosyada makinenin başında da bir insan vardı. Hatta iki.
~ İki. Leyla bunu neden söyledi bilmiyorum. Belki sadece bir sayı.
`),
      next: 'INV_HUB',
    }),
    option('AK1_INSAN', '“Selim’e. Ama bir şey saklıyor.”', {
      effects: [set('aksam1', 'INSAN')],
      responses: B(`
leyla: Güzel. İkisi birden doğru olabilir. İnsanlar suçsuz oldukları hâlde saklar; utandıkları için, korktukları için.
leyla: Sakladığı şeyi bul; ama onu bir suç sanma. Önce ne olduğunu öğren.
~ Bir saklanan şey. Belki bir saat; belki bir klasör.
`),
      next: 'INV_HUB',
    }),
    option('AK1_KIMSE', '“Kimseye.”', {
      effects: [set('aksam1', 'KIMSE')],
      responses: B(`
leyla: Avukatlıkta ilk yıl herkese inanırsın, ikinci yıl kimseye. Üçüncü yıl ne zaman kime inanacağını öğrenirsin.
leyla: Sen dördüncü yılını yaşıyorsun. Ve artık ortaksın.
~ Leyla kapıdan çıkarken ışığı kapattı. Kasıtlı mı bilmiyorum.
`),
      next: 'INV_HUB',
    }),
  ],
});

const aksam2 = story('INV_AKSAM2', {
  ...INV,
  title: 'Gizli numara',
  background: 'buro_gece',
  lines: B(`
# GECE 23.40 — ARSLAN HUKUK [bg:buro_gece]
> Büroda yalnızdım. Leyla çoktan gitmişti; koridorun ışığı otomatik, her dört dakikada bir sönüyor, ben her dört dakikada bir elimi sallıyordum.
> Masada üç kâğıt yan yana: özet, rapor, tutanak. Aralarında bir çizgi çekmeye çalışıyordum; çizgi her seferinde bir boşlukta bitiyordu.
~ Bir dosyada boşluklar iki türlüdür: kimsenin bakmadığı yerler ve birinin baktırmak istemediği yerler. İkisini birbirinden ayırmak bütün işim.
> Masamdaki telefon çaldı. Ekranda “Gizli numara.” Üçüncü çalışta açtım.
@BİR KADIN: Avukat Deniz Arslan? [phone]
- Benim. Kimsiniz?
@BİR KADIN: Adım önemli değil. Nilüfer Örme’de çalışıyorum. Bunu konuşmamam lazım. Beni aramayın; numaramı da aramayın. [phone]
> Arkada bir televizyon sesi, sonra kısıldı. Kadın fısıldıyordu; bir evde, bir koridorda, kimse duymasın diye.
@BİR KADIN: Sadece şunu söyleyeceğim: poliçeye bakın. Siber poliçeye. Ne zaman, ne kadar. [phone]
`),
  choices: [
    option('NA_ISIM', '“Adınızı söylemezseniz bir şey yapamam.”', {
      responses: B(`
@BİR KADIN: O zaman bir şey yapmayın. Ben yapacağımı yaptım. [phone]
> Hat kapandı. Bir daha çalmadı.
~ Bir adı zorla almak, bir tanığı kaçırmaktır. Kaçırdım mı? Bilmiyorum. Bir “poliçe” kaldı elimde.
`),
      effects: [raise('nalan_ipucu')],
      next: 'INV_HUB',
    }),
    option('NA_DINLE', 'Sessizce dinle', {
      responses: B(`
- Dinliyorum.
@BİR KADIN: Ağustosta bir şey imzaladım. Ne olduğunu sormadım. Şimdi soruyorum. Kendime. Gece. [phone]
@BİR KADIN: İyi geceler avukat hanım. Selim iyi bir çocuktur. [phone]
> Hat kapandı. Sesi bir hesap makinesinin tuşları gibiydi: kısa, net, sonunda bir toplam.
`),
      effects: [raise('nalan_ipucu')],
      next: 'INV_HUB',
    }),
    option('NA_KANAL', '“Bunu savcılığa ya da mahkemeye tanık olarak söyleyebilirsiniz.”', {
      score: { SAVUNMA_STRATEJISI: 30 },
      good: 'Bilgi veren çalışana belge getirmesini değil, bildiğini resmî kanaldan söylemesini önerdin (CMK 158; Av.K. 34).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Bildiklerinizi savcılığa ya da mahkemeye tanık olarak anlatabilirsiniz. Bana belge getirmenize gerek yok; getirmeyin de.
@BİR KADIN: Tanık. Mahkeme. Hı. [phone]
> Uzun bir sessizlik. Sonra bir nefes.
@BİR KADIN: Düşüneceğim. Ağustosta bir şey imzaladım. Poliçeye bakın. [phone]
~ Düşünecek. İnsanlar gece yarısı düşündüklerini sabah unutur. Ya da unutmaz.
`),
      effects: [raise('nalan_ipucu'), raise('nalan_kanal')],
      next: 'INV_HUB',
    }),
  ],
});

// --- Duruşmadan önceki gece ---

const gece = [
  decisionNode('INV_GECE_1', [{ to: 'INV_GECE_2' }], {
    ...INV,
    title: 'Duruşmadan önceki gece',
    onEnter: [...nightDeliveries.effects],
    lines: B(`
# PAZARTESİ 23.05 — ARSLAN HUKUK [bg:buro_gece]
> Panoyu son kez toparladım. Raptiyeler, ipler, bir yığın çıktı. Bir davanın iskeleti; kemikleri kâğıttan.
`),
  }),
  decisionNode('INV_GECE_2', [{ to: 'INV_GECE_3' }], {
    lines: [
      W(any(has('ded_zincir'), has('ded_ozet')), `~ DataKale’nin imajı bir çatlak vazo. İki gün boyunca elden ele dolaşmış, sonra fotoğrafı çekilmiş.`),
      W(any(has('clue_hash'), has('clue_imaj_tarih')), `~ Raporda bir şey tutmuyor. Bir tarih, bir özet. Nedenini henüz bağlayamadım.`),
      O(`~ DataKale’nin raporu hâlâ bana sırtını dönmüş duruyor. Okudum mu, gerçekten okudum mu?`),
    ],
  }),
  decisionNode('INV_GECE_3', [{ to: 'INV_GECE_4' }], {
    lines: [
      W(any(has('ded_dizustu'), has('ded_cihaz')), `~ Silme oturumu Selim’in bilgisayarından açılmadı. Bunu kâğıtlar söylüyor; ben değil.`),
      W(has('clue_gsm'), `~ Bir cep hattı. Gece 02.14. Selim’in evi sabit bir hattan çıkar. Arada bir boşluk var; doldurmam lazım.`),
      O(`~ 02.14’ün kimin elinden çıktığını hâlâ bilmiyorum. Bu dosyanın kalbi orada.`),
    ],
  }),
  decisionNode('INV_GECE_4', [{ to: 'INV_GECE_5' }], {
    lines: [
      W(has('ded_riza'), `~ Selim o akşam izinle girdi, kendi fotoğraflarını aldı. Bir kapı, bir izin, bir klasör. Suç değil.`),
      W(has('clue_kisisel'), `~ Selim o akşam bağlandığını söyledi. İzni olup olmadığını kanıtlayacak bir kâğıt lazım.`),
      W(has('clue_2130'), `~ 21.30. Selim bunu hâlâ bana anlatmadı. Kürsüde ilk kez duyarsam, ilk kez duyan ben olmam; hâkim olur.`),
      O(`~ Selim’in o geceyi anlatışında bir boşluk var. Boşluklar kürsüde büyür.`),
    ],
  }),
  decisionNode('INV_GECE_5', [{ to: 'INV_GECE_6' }], {
    lines: [
      W(flag('tarik_ziyaret'), `~ Genel müdürün çayını içtim. İnce belli bardak. Ozan Tekin yarın bunu bana hatırlatacak; haklı olarak.`),
      W(flag('yasar_kocluk'), `~ Yaşar Usta’ya bir saat ezberlettim. “Defterde zaten yazıyor” dedi. Ben neden yazdım ki onun cümlesinin üstüne?`),
      W(cmp(v('aksam1'), '==', 'INSAN'), `~ Selim’e inanıyorum. Sakladığı şey bir suç değilse, ne?`),
      O(`~ Leyla’nın sorusu aklımda: neye inanıyorum? Kâğıtlara. Ve kâğıtların arasındaki boşluklara.`),
    ],
  }),
  decisionNode('INV_GECE_6', [{ to: 'INV_GECE' }], {
    lines: [
      W(flag('yasar_tanik'), `~ Bir bekçi, defterine ne yazdıysa onu söyleyecek. Mahkemede bile kurşun kalemle konuşacak sanki.`),
      W(flag('dil_bilirkisi'), `~ Dilekçede bir bilirkişi istedim. Mahkeme kabul ederse, bu dosyanın ilk tarafsız gözü o olacak.`),
      O(`~ Dilekçem kısa. Kısa dilekçeler bazen dürüst dilekçelerdir; bazen de eksik.`),
    ],
  }),
];

const geceSon = story('INV_GECE', {
  ...INV,
  title: 'Duruşmadan önceki gece',
  background: 'sokak_yagmur',
  lines: B(`
> Çıkarken kapının altında bir zarf buldum. Pul yok, adres yok. İçinde tek bir A4; ortasında yazıcıdan çıkmış tek cümle:
@İMZASIZ NOT: Bazı dosyalar silinince herkes için daha iyi olur.
> Zarfı çevirdim. Arkası boş. Kâğıt pahalı; kalın, krem rengi. Bir büronun ya da bir genel müdürlüğün kâğıdı gibi. Ya da bir kırtasiyenin. {flash}
~ Bir tehdit mi, bir tavsiye mi? İkisi de olabilir. İkisi de beni yarın sabah dokuzda o salona sokmaz; ama sokacak.
> Masaya oturdum. Önümde bir yığın kâğıt: bir özet döküm, bir uzman raporu, bir devir tutanağı, bir e-posta çıktısı. Hepsinin ortak bir yeri vardı: “S.AKTAS.” Bir kullanıcı adı. Beş harf, bir nokta.
~ Dokuz yıl bir adam bu beş harfi her sabah yazdı. Sonra işten çıktı. Beş harf masada kaldı; bir zarfın içinde, bir genel müdürün çekmecesinde.
~ Yarın bir uzman kürsüye çıkacak ve “kayıt yalan söylemez” diyecek. Doğru; kayıt yalan söylemez.
~ Ama kaydı tutan, özetleyen, mahkemeye getiren üç ayrı el var. Benim işim o elleri göstermek; kaydı değil, elleri.
> Defne’nin resmini çantamdan çıkardım; Gül vermişti, Selim’e iletecektim, unutmuştum. Bir masa, bir ekran, bir adam ve odanın içinde çizilmiş bir güneş.
~ Bir çocuk babasını bir ekranın başında çizmiş. Yarın o ekranın başına bir başkasını oturtmam gerekiyor; kanıtla, sesle, sırayla.
> Telefon titredi. Leyla’dan tek bir mesaj, gece yarısına beş kala.
leyla: Yarın uzman kürsüde “teknik olarak” derse, sen “insan olarak” diye sor. Ve zarfı bana getir; sabah. Savcılığa birlikte bildiririz. [phone]
> Zarfı çantama koydum. Yağmur organize sanayinin bacalarına, Nilüfer’in balkonlarına, adliyenin taş merdivenlerine aynı anda yağıyordu.
~ Bir dosya silinince gitmez; sadece kimin elinden çıktığını unutursun. Yarın hatırlatacağım. Birine.
`),
  choices: [cont('GECE_DEVAM', 'Adliyeye git', 'H1_00G_1', { role: 'PRIMARY' })],
});

export const investigation1: CasePart = {
  nodes: [
    p1.hub({
      ...INV,
      title: 'Soruşturma',
      background: 'buro',
      lines: hubLines,
      scenePreview: { scene: 'sc_sunucu' },
      tabs: [
        { id: 't_olay', label: 'OLAY YERİ', kind: 'SCENE', choices: hubChoices.olay },
        { id: 't_muvekkil', label: 'MÜVEKKİL', kind: 'PEOPLE', choices: hubChoices.muvekkil },
        { id: 't_tanik', label: 'TANIKLAR', kind: 'PEOPLE', choices: hubChoices.tanik },
        { id: 't_arsiv', label: 'ARŞİV', kind: 'ARCHIVE', choices: hubChoices.arsiv },
      ],
      quickTalk: {
        character: 'selim',
        line: '“Ben ömrüm boyunca yedek aldım avukat hanım. Ömrüm boyunca.”',
        choices: ['H_GORUS', 'H_GORUS2'],
      },
      choices: [
        nav('H_DURUSMA', 'DURUŞMAYA GİT · 1. CELSE', 'INV_GECE_1', {
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen soruşturma biter. Emin misin?',
        }),
      ],
    }),
    dayEnd,
    aksam1,
    aksam2,
    arama,
    evGiris,
    arama2,
    kapiGiris,
    arama3,
    log,
    imaj,
    emn,
    devir,
    tamDoc('INV_TAM', INV),
    dil,
    cikarim,
    leyla,
    ...gece,
    geceSon,
  ],
  triggers: [
    {
      id: 'tg_day_end',
      scope: 'INV_HUB',
      priority: 1,
      when: all(cmp(v('ap'), '<=', 0), cmp(v('day'), '<', 3)),
      goto: 'INV_DAY_END',
    },
  ],
  discoveryPaths: [...dayEndDeliveries.discoveryPaths, ...nightDeliveries.discoveryPaths],
};
