import {
  all,
  any,
  atLeast,
  cmp,
  cont,
  courtSession,
  dec,
  decisionNode,
  deliver,
  fallback,
  flag,
  has,
  hl,
  ifThen,
  inc,
  not,
  objectRule,
  option,
  presentRule,
  pressRule,
  raise,
  resultNode,
  score,
  set,
  statement,
  story,
  strategyAmount,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, Cond, Effect } from '../../../tools/content/src/kit/index.js';
import { B, O, S, W } from './lib.js';
import { HEAR2, court2, wrongMove } from './shared.js';

// 80-trial: ikinci celse. Müzekkere cevapları ve Adli Tıp raporu, (etik tuzakta Emre'nin çöküşü), kurye, Erol'un ve
// Tarık'ın çapraz sorgusu, yeni rapor, mütalaa, dayanaklar, esas savunma, son söz ve hüküm. Çöküş kesintisi.

const raporlar = deliver('C2_00', [
  {
    evidence: 'ev_rapor2',
    requires: any(flag('dil_bilirkisi'), flag('h1_bilirkisi')),
    hint: 'Mukayese belgeleri özel belgelerdi; resmî imzalarla Adli Tıp’tan yeni rapor istemek gerekiyordu (CMK 63, 67/5).',
  },
  {
    evidence: 'ev_rapor2_ek',
    requires: all(any(flag('dil_bilirkisi'), flag('h1_bilirkisi')), flag('suc_duyurusu')),
    hint: 'Somut dayanaklı bir suç duyurusu, savcılığın üçüncü kişinin örneklerini Adli Tıp’a göndermesini sağlardı (CMK 158).',
  },
]);

const once = (f: string, cat: 'SORGULAMA' | 'USUL_BILGISI', amount: number, extra: Effect[] = []): Effect[] => [
  ifThen(not(flag(f)), [raise(f), score(cat, amount), ...extra]),
];

/** Tarık'a karşı çelişki: sayaç + bayrak (ilk sunumda). */
const tc = (f: string, amount = 300): Effect[] => once(f, 'SORGULAMA', amount, [inc('pers'), inc('tarik_c')]);

const guclu: Cond = atLeast(
  3,
  flag('contra_g3'),
  has('ev_rapor2'),
  any(has('ded_mazeret'), flag('contra_e4'), flag('mazeret_tanik')),
  flag('contra_e3'),
  flag('tarik_sustu'),
);
const orta: Cond = atLeast(
  2,
  flag('contra_g3'),
  has('ev_rapor2'),
  has('ded_mukayese'),
  flag('contra_e4'),
  flag('contra_e1'),
);

const pointCost = [{ var: 'noktalar', amount: 1 }];

export const trial: CasePart = {
  court: {
    sessions: [
      courtSession('cs_2', '2. Celse', [
        ['s2_acilis', 'ACILIS', 'C2_00'],
        ['s2_tanik', 'TANIK_DINLEME', 'C2_02'],
        ['s2_delil', 'DELIL_TARTISMA', 'C2_04G'],
        ['s2_mutalaa', 'MUTALAA', 'C2_05'],
        ['s2_savunma', 'SAVUNMA', 'C2_06'],
        ['s2_sonsoz', 'SON_SOZ', 'C2_07'],
        ['s2_karar', 'KARAR', 'R_KARAR'],
      ]),
    ],
  },
  nodes: [
    decisionNode('C2_00G', [{ to: 'C2_00G2' }], {
      ...HEAR2,
      title: 'Koridor',
      onEnter: [raise('in_court')],
      lines: B(`
C#adliye: 4 KASIM · 09.40 — BURSA ADLİYESİ, 4. KAT
N: Aynı koridor, aynı sigara kokusu. Bu kez yağmur dinmişti; pencerelerden soluk bir kasım güneşi giriyordu.
`),
    }),
    decisionNode('C2_00G2', [{ to: 'C2_00' }], {
      lines: [
        W(
          any(flag('tarik_tanik'), has('ev_tutanak')),
          `
N: Sevgi kapının yanında, tek başına. Tarık koridorun öbür ucunda, pencerenin önünde; elinde bir celpname. Vedat ikisinin arasında durdu, kime gideceğini bilemeden.
vedat: Tarık’ı da çağırmışlar. Tanık olarak. Niye? Belgeleri o vermiş diye mi?
T: Cevap vermedim. Vedat’ın sorusunun cevabını bugün başka biri verecek.
`,
        ),
        O(`
N: Sevgi ve Vedat kapının yanında. Tarık gelmemişti; “dükkânı açık bırakamam” demiş. Vedat bunu üç kez tekrarladı, kendini ikna eder gibi.
`),
      ],
    }),
    court2.stage('C2_00', {
      title: 'Açılış',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onEnter: [...raporlar.effects],
      lines: B(`
mubasir: Ateş dosyası! Vedat Ateş! Ateş dosyası!
hakim: Duruşmaya devam edildi. Sanık ve müdafii hazır, şikâyetçi hazır, Cumhuriyet Savcısı hazır.
hakim: Ara kararlara cevaplar geldi; dosyaya konuldu, okundu. Taraflara örnekleri verildi.
N: Hâkim dosyanın kalınlaştığını gösterir gibi elini üstüne koydu. Üç hafta önce ince bir dosyaydı; şimdi bir matbaanın kâğıt topu gibi.
N: Nermin Kurt ön sırada oturuyordu; bu kez kardeşinin arkasında. Sevgi ikinci sırada. Tanık sırasında bir kurye yeleği, bir altın zincir.
`),
      choices: [cont('C200_DEVAM', 'Gelen cevaplar', 'C2_00A', { role: 'PRIMARY' })],
    }),
    decisionNode('C2_00A', [{ to: 'C2_00B' }], {
      lines: [
        W(
          all(has('ev_rapor2'), has('ev_rapor2_ek')),
          `
hakim: Adli Tıp Kurumu Fizik İhtisas Dairesi raporu geldi. Senet ve kapora makbuzundaki imzalar sanığın resmî mukayese imzalarıyla uyumsuz; sanığın el ürünü değil.
hakim: Rapora göre bu imzalar, irsaliyelerin on birindeki imzalarla aynı elin ürünü ve sol el kullanımıyla uyumlu. Savcılığın ayrıca gönderdiği örneklere ilişkin ek rapor da dosyada.
N: Savcı ek raporu iki kez okudu. Sonra salonun arkasına, tanık sırasına baktı.
`,
        ),
        W(
          has('ev_rapor2'),
          `
hakim: Adli Tıp Kurumu Fizik İhtisas Dairesi raporu geldi. Senet ve kapora makbuzundaki imzalar sanığın resmî mukayese imzalarıyla uyumsuz; sanığın el ürünü değil.
hakim: Rapora göre bu imzalar irsaliyelerin on birindeki imzalarla aynı elin ürünü ve sol el kullanımıyla uyumlu.
N: Vedat bana döndü. Gözleri doluydu. Elini, sağ elini, masanın üstüne koydu ve bıraktı.
`,
        ),
        W(
          flag('h1_bilirkisi_dinle'),
          `
hakim: Bilirkişi Ö. Faruk Demirtaş dinlendi: aynı mukayese belgelerine baktığını ve aynı sonuca vardığını söyledi. “Bana verilen belgeler bunlardı” dedi.
T: Aynı kâğıt, aynı cevap. Bilirkişi dürüsttü; ona verilen kâğıtlar değildi.
`,
        ),
        O(`
hakim: Yeni bir bilirkişi raporu yok. Dosyada tek imza incelemesi, soruşturmadaki grafoloji raporu.
T: Raporun karşısına bir rapor koyamadım. Kürsüdeki insanlarla yetineceğim.
`),
      ],
    }),
    decisionNode(
      'C2_00B',
      [{ when: flag('etik_kirlik'), to: 'C2_E' }, { when: flag('sinan_tanik'), to: 'C2_01' }, { to: 'C2_02' }],
      {
        lines: [
          W(
            has('ev_kargo'),
            `
hakim: Kargo şirketinin cevabı: 18 Şubat günü kurye 11.19’da Ateş Matbaası önüne varmış, gönderi 11.37’de sanık tarafından teslim edilmiş. Konum kaydı ekli.
savci: Sayın Hâkim, kayıt sanığın orada olduğunu değil, terminale birinin imza attığını gösterir.
`,
          ),
          W(
            all(flag('emre_tanik'), not(flag('etik_kirlik'))),
            `
hakim: Müdafiin tanığı Emre Kaya’nın olay günü okulda olduğu anlaşıldığından dinlenmesinden vazgeçildi. Tanıkların dinlenmesine geçiyorum.
`,
          ),
          O(`
hakim: Tanıkların dinlenmesine geçiyorum.
`),
        ],
      },
    ),
    story('C2_E', {
      ...court2.base,
      title: 'Kürsüdeki çocuk',
      background: 'durusma_salonu',
      lines: B(`
mubasir: Tanık Emre Kaya! Emre Kaya!
N: Emre kürsüye çıktı. Okul gömleği, ütüsüz; elleri titriyordu. Yemin etti. Sesi iki kez kırıldı.
emre: O sabah dükkândaydım. Vedat abiyi gördüm. Saat on bir buçuk gibi. Kurye geldi, ben de oradaydım.
savci: Sayın Hâkim, Bursa Mesleki ve Teknik Anadolu Lisesi’nden yazı: tanık 18 Şubat salı günü 08.30–15.20 arasında atölye dersindeymiş. Yoklamada imzası var.
N: Emre kâğıda baktı. Kendi imzasına. Sonra bana.
emre.uzgun: Ben… Avukat abla öyle dedi. “Vedat abin için” dedi. Ben okuldaydım. Özür dilerim.
N!shake: Salon dondu. Hâkim kalemini bıraktı. Vedat bana döndü; yüzünde öfke yoktu. Daha kötüsü vardı.
hakim: Tutanağa geçsin. Müdafi hakkında suç duyurusunda bulunulmak üzere tutanak örneğinin Cumhuriyet Başsavcılığına ve Bursa Barosuna gönderilmesine.
vedat: Sayın Hâkim. Avukatımı azlediyorum. Kendime başka bir avukat bulacağım.
hakim: Duruşma sanığın yeni müdafii için ertelenmiştir.
`),
      choices: [cont('CE_DEVAM', 'Salondan çık', 'R_KARAR', { role: 'PRIMARY' })],
    }),
    court2.objection('C2_01', {
      title: 'Kuryenin dinlenmesi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'sinan',
      say: S(`
mubasir: Tanık Sinan Öztürk! Sinan Öztürk!
N: Sinan sarı yeleğini çıkarmamıştı; kürsüye çıkınca fark etti, çıkarıp katladı, koltuğunun altına sıkıştırdı.
hakim: Yemininizi edin. Müdafi, tanığı siz çağırdınız. Sorunuz?
T: İlk soru en önemlisidir. Ağzına bir saat koyarsam, o saat bütün tanıklığı boğar.
`),
      next: 'C2_01B',
      options: [
        option('C201_A', '“18 Şubat sabahı Ateş Matbaası’nda ne gördüğünüzü anlatır mısınız?”', {
          score: { SORGULAMA: 100 },
          effects: [raise('mazeret_tanik'), inc('pers')],
          good: 'Açık uçlu soru: tanık kendi algısını anlattı; ifade terminal kaydıyla örtüştü (CMK 52, 201).',
          category: 'SORGULAMA',
          responses: B(`
sinan: Erken gittim. Yirmi gibi. Usta tek başınaydı; koliler bantlanmamıştı. Beraber bantladık, on beş yirmi dakika. Çay koydu.
sinan: Terminale parmağıyla imza attı, güldü, “kalem olsa daha güzel atardım” dedi. Ben de çıktım.
hakim: Sanık o süre boyunca yanınızda mıydı?
sinan: Hiç ayrılmadı Sayın Hâkim. Koliyi ben tuttum, o bantladı. İki kişilik iş.
`),
        }),
        option('C201_B', '“Saat 11.24’te sanık sizinle matbaadaydı, değil mi?”', {
          score: { SORGULAMA: -50 },
          effects: [dec('pers')],
          bad: 'Telkin edici soru: cevabı soruda verdin; savcı itiraz etti ve tanığın beyanı değer kaybetti (CMK 201).',
          category: 'SORGULAMA',
          responses: B(`
savci: İtiraz ediyorum Sayın Hâkim; müdafi cevabı tanığın ağzına koyuyor.
hakim: Yerinde. Müdafi, soruyu açık sorun.
sinan: Ben… yani evet, oradaydı. Saat… terminal ne diyorsa.
`),
        }),
      ],
    }),
    decisionNode('C2_01B', [{ to: 'C2_02' }], {
      onEnter: [ifThen(flag('sinan_kocluk'), [dec('pers', 2), dec('cred'), score('SORGULAMA', -100)])],
      lines: [
        W(
          flag('sinan_kocluk'),
          `
savci: Tanık, kaçta vardınız matbaaya?
sinan: On bir yirmi beş gibi.
savci: Terminal 11.19 diyor. Neden 11.25?
sinan: Ben… Avukat hanım “on bir yirmi beş deyin, o saat önemli” dedi. Ben de… Kayıt neyse odur.
N: Hâkim bana uzun uzun baktı. Bir şey yazdı. Ne yazdığını görmedim; görmeme gerek yoktu.
T: Terminal doğruyu söylüyordu. Ben bir doğrunun üstüne bir saat yapıştırdım ve doğruyu kirlettim.
`,
        ),
        O(`
savci: Sorum yok Sayın Hâkim. Kayıt kendi kendini anlatıyor.
`),
      ],
    }),
    court2.testimony('C2_02', {
      title: 'Alıcının dinlenmesi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'erol',
      witnessLabel: 'TANIK · EROL KILINÇ',
      rulesText: 'İpucu: önce bastır, sonra doğru delille göster. Yanlış delil güvenilirliği ve skoru düşürür.',
      objectionGrounds: ['g_telkin', 'g_kanaat', 'g_salon'],
      say: S(`
mubasir: Tanık Erol Kılınç! Erol Kılınç!
N: Erol kürsüye bir düğüne girer gibi girdi. Takım elbise, altın zincir yakanın altına saklanmış, tespih cebinde.
hakim: Yemininizi edin. Olayı anlatın.
erol: Sayın Hâkim, ben emlakçıyım. Ev aldım, parasını verdim, tapusunu aldım. Şimdi mahkemelik oldum. Mağdurum; malum.
erol: Vedat Bey’le konuştuk, anlaştık. Kaporayı verdim, makbuzu imzaladı. Tapuya beraber gittik. Hayırlı olsun dedim. Bu kadar.
savci: Tapudaki kişi sanık mıydı?
erol: Kimliğinde öyle yazıyordu. Ben devlete inanırım Sayın Savcım.
hakim: Müdafi, sorularınız.
T: Kaygan bir adam. Her sorudan bir atasözüyle kaçar. Atasözüne cevap verme; kâğıdını göster.
`),
      statements: [
        statement('E1', 1, [
          hl('Bütün pazarlığı Vedat Bey’le yaptım', any(flag('press_e1'), has('ded_randevu'))),
          '; telefonla, yüz yüze.',
        ]),
        statement(
          'E1B',
          2,
          ['Yeğeni araya girerdi bazen; ', hl('ama asıl muhatabım Vedat Bey’di', has('ded_randevu')), '.'],
          flag('press_e1'),
        ),
        statement('E2', 3, [
          hl('Kapora makbuzunu Vedat Bey önümde imzaladı', any(flag('press_e2'), has('ev_rapor2'))),
          '.',
        ]),
        statement('E3', 4, [
          'Bedelin ',
          hl('tamamını nakit ödedim', any(flag('press_e3'), has('ded_borc'))),
          '; bir milyon altı yüz bin.',
        ]),
        statement('E4', 5, [
          hl('Tapuya gelen adam Vedat Bey’di', any(flag('press_e4'), has('ded_mazeret'), has('ev_kargo'))),
          '; kimliğini gördüm.',
        ]),
        statement('E5', 6, ['Zaten bu matbaacılar hep borç içinde; ', hl('belliydi'), '.']),
      ],
      rules: [
        pressRule('PR_E1', 'E1', {
          score: { SORGULAMA: 40 },
          effects: [raise('press_e1')],
          responses: B(`
P: İlk telefonu kim açtı? Siz mi Vedat Bey’i aradınız, o mu sizi?
erol: Ben aramam avukat hanım; beni ararlar. Bir telefon geldi… Yeğeni. Tarık. “Amcamın bir evi var” dedi. Sonra amcasıyla konuştuk.
P: Amcasıyla telefonda mı konuştunuz?
erol: Telefonda… Tarık konuşurdu çoğu zaman. “Amcam meşgul, makinede” derdi. Matbaacı, malum.
`),
        }),
        pressRule('PR_E2', 'E2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_e2')],
          responses: B(`
erol: Bürodaydık. Kepliydi yine, soğuk almış. Yazdı, imzaladı. Ben makbuza bakarım, imzaya bakmam. Para, kâğıttan önce gelir.
P: Hangi eliyle yazdı?
erol: Avukat hanım, ben adamın eline değil cebine bakarım. Kalem masadaydı; aldı, yazdı.
`),
        }),
        pressRule('PR_E3', 'E3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_e3')],
          responses: B(`
erol: Nakit. Elden. Bir çantayla. Kimin cebine girdiğini sormak bana düşmez avukat hanım. Para, eline geçenindir.
`),
        }),
        pressRule('PR_E4', 'E4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_e4')],
          responses: B(`
erol: Kep, gözlük, atkı. Hastaydı. Ben adamın kepini mi çıkaracağım? Kimlik vardı, memur baktı. Benim işim değil.
P: Daha önce yüz yüze kaç kez gördünüz onu?
erol: Bir kere bürodaydı, bir kere tapuda. İkisinde de kepliydi. Grip uzun sürdü herhalde.
`),
        }),
        pressRule('PR_E5', 'E5', {
          score: { SORGULAMA: 10 },
          responses: B(`
erol: Yani… piyasa böyle. Esnaf hep borçlu. Ben de borçluyum; bankaya.
`),
        }),
        presentRule('PS_E1B', 'E1B', ['ded_randevu'], {
          effects: once('contra_e1', 'SORGULAMA', 300, [inc('pers')]),
          good: 'Tapu randevusunu da teyidi de yeğenin hattı yapmış: “asıl muhatap” Vedat Ateş değil.',
          category: 'SORGULAMA',
          responses: B(`
P: Sayın Hâkim, tapu randevu kaydı. Randevuyu 10 Şubat’ta 0532 418 77 47 almış; işlem günü 11.06’da teyit aramasını da aynı hat yanıtlamış.
P: Matbaanın numara çizelgesinde bu numara Tarık Ateş’in. Tanık bey, Vedat Bey’in sesini hiç duydunuz mu?
erol: …Bürodaki adamı duydum. Kepli olan. Telefonda hep Tarık’tı. Ama ben… ben adamın Vedat olduğunu sanıyordum Sayın Hâkim. Kimliği vardı.
`),
        }),
        presentRule('PS_E2', 'E2', ['ev_rapor2'], {
          effects: once('contra_e2', 'SORGULAMA', 300, [inc('pers')]),
          good: 'Adli Tıp raporu: kapora makbuzundaki imza da sanığın değil.',
          category: 'SORGULAMA',
          responses: B(`
P: Adli Tıp raporu. Makbuzdaki imza sanığın el ürünü değil; senetteki imzayla aynı elden ve sol el kullanımıyla uyumlu.
P: Önünüzde imzalayan adam Vedat Ateş değilse, kimdi?
erol: Kepliydi. Ben… Bilmiyorum Sayın Hâkim. Vallahi bilmiyorum.
`),
        }),
        presentRule('PS_E3', 'E3', ['ded_borc'], {
          maxUses: 1,
          score: { SORGULAMA: 300 },
          effects: [raise('contra_e3'), inc('pers', 2), { type: 'GOTO', node: 'C2_02K' }],
          good: 'Masa takvimindeki “T. · mahsup 1.400” ve yeğenin bahis borcu: bedel nakden ödenmemiş, bir borca mahsup edilmiş.',
          category: 'SORGULAMA',
          responses: B(`
P: Sayın Hâkim, tanığın bürosunda açıkta duran masa takviminin fotoğrafı. 18 Şubat: “Hisar tapu 11.15 · T. · mahsup 1.400.”
P: Ve tanığın adının geçtiği bahis borcu mesajları. Tanık bey, bir milyon altı yüz binin ne kadarı nakit, ne kadarı mahsup?
`),
        }),
        presentRule('PS_E4', 'E4', ['ded_mazeret', 'ev_kargo'], {
          effects: once('contra_e4', 'SORGULAMA', 300, [inc('pers')]),
          good: 'Kargo terminali sanığı 11.19–11.37 arasında matbaanın önünde gösteriyor; senet 11.24’te imzalandı.',
          category: 'SORGULAMA',
          responses: B(`
P: Kargo kaydı. 11.19’dan 11.37’ye kadar sanık Kayhan’da, matbaasının önünde; kuryeyle koli bantlıyor. Senet 11.24’te Osmangazi’de imzalandı.
P: Tanık bey, 11.24’te yanınızdaki adam kimdi?
erol: Kimlik… Kimliği vardı. Ben… Ben ne bileyim Sayın Hâkim, ben kimliğe baktım.
`),
        }),
        presentRule('PS_E4_KURYE', 'E4', ['ded_kurye'], {
          effects: once('press_e4k', 'SORGULAMA', 80),
          neutral: 'Kısmi: takvimdeki kurye notu bir ihtimal; kayıt olmadan bir mazeret değil.',
          responses: B(`
erol: Takvim mi? Avukat hanım, takvime herkes her şeyi yazar. Ben de yazarım: “zengin olacağım.”
`),
        }),
        presentRule('PS_E1B_KAYIT', 'E1B', ['ev_randevu'], {
          effects: once('press_e1k', 'SORGULAMA', 80),
          neutral: 'Kısmi: randevu kaydı bir numara gösteriyor; o numaranın kime ait olduğunu göstermedin.',
          responses: B(`
erol: Bir numara. Benim numaram değil. Kimin numarası, ben ne bileyim?
T: Numara bir isim değil. İsmi göstermek için başka bir kâğıt lazımdı.
`),
        }),
        presentRule('PS_E4_SOLAK', 'E4', ['ded_solak'], {
          effects: once('press_e4x', 'SORGULAMA', 100),
          neutral: 'Kısmi: solak imza tanığın kimlik beyanını sarsar; ama tanık imzaya bakmadığını söylüyor.',
          responses: B(`
erol: Hangi elle yazdı, bakmadım avukat hanım. Ben paraya bakarım.
`),
        }),
        objectRule('OB_E5', 'E5', 'g_kanaat', {
          effects: once('ob_e5', 'USUL_BILGISI', 50, [inc('legal_hits')]),
          good: 'İtiraz yerinde: “matbaacılar hep borçlu” bir gözlem değil, kanaat.',
          category: 'USUL_BILGISI',
          responses: B(`
P: İtiraz ediyorum Sayın Hâkim; tanık gözlemini değil, kanaatini anlatıyor.
hakim: Yerinde. Bu cümle tutanağa geçmeyecek.
`),
        }),
        presentRule('PS_E_SAVCILIK', undefined, ['ev_senet', 'ev_suret', 'ev_rapor1', 'ev_makbuz'], {
          maxUses: 10,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'Savcılığın delilini savcılık tanığına gösterdin; hiçbir çelişki ortaya koymadı.',
          category: 'SORGULAMA',
          responses: B(`
erol: İşte! Tapu! Ben de onu diyorum Sayın Hâkim. Kâğıt ortada.
T: Erol’a tutunacak bir dal uzattım.
`),
        }),
      ],
      presentMiss: fallback('FB_C2E_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil: −1 güvenilirlik, −150 skor.', category: 'SORGULAMA' },
        responses: B(`
hakim: Bu delilin beyanla ilgisini göremedim müdafi.
erol: Avukat hanım kâğıtlarını karıştırdı galiba.
`),
      }),
      objectMiss: fallback('FB_C2E_OBJECT', 'OBJECT', {
        effects: [dec('cred'), inc('wrong'), score('USUL_BILGISI', -50, 'hatali')],
        quality: { q: 'BAD', feedback: 'Dayanaksız itiraz.', category: 'USUL_BILGISI' },
        responses: B(`
hakim: İtiraz reddedildi.
`),
      }),
      finish: { id: 'C202_BITIR', next: 'C2_03G' },
    }),
    court2.stage('C2_02K', {
      title: 'Mahsup',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'erol',
      lines: B(`
N: Erol tespihini cebinden çıkardı, sonra geri koydu. Savcıya baktı; savcı ona bakmadı.
erol: Bir milyon dört yüzü… alacağa sayıldı Sayın Hâkim. Tarık’ın bana borcu vardı. Kumar borcu, ne bileyim; ben sormam. Faizi falan yok, arkadaşlık.
erol: Tarık “amcamın vekâleti var, evi sana veririz, hesap kapanır” dedi. İki yüz bini nakit verdim, kaporayla. Hesap kapandı.
erol: Ben bir şey yapmadım. Ben ev aldım. Tapuda kim imza attıysa…
hakim: Tutanağa geçsin: tanık, satış bedelinin bir milyon dört yüz bin lirasının Tarık Ateş’in tanığa olan borcuna mahsup edildiğini beyan etti.
savci: Sayın Hâkim, tanığın beyanının bir örneğinin ayrıca soruşturma için Başsavcılığa gönderilmesini talep ediyoruz.
hakim: Kabul.
N: Salonun arkasında Tarık ayağa kalktı, sonra yeniden oturdu. Vedat başını çevirip ona baktı. Uzun uzun.
T: “Hesap kapandı.” Bu cümleyi bir yerde duymuştum. Bir tapunun saçağı altında, yağmurda, iki isimsiz sesten.
`),
      choices: [cont('C202K_DEVAM', 'Devam', 'C2_02', { role: 'PRIMARY' })],
    }),
    decisionNode(
      'C2_03G',
      [{ when: any(flag('tarik_tanik'), has('ev_tutanak')), to: 'C2_03C0' }, { to: 'C2_TENEFFUS' }],
      {
        ...court2.base,
        title: 'Tanıklar',
      },
    ),
    decisionNode('C2_03C0', [{ to: 'C2_03C' }], {
      lines: [
        W(
          flag('fact_tarik_inegol'),
          `
T: “İnegöl’de, kâğıtçı Rıza’nın deposunda.” Bana camlı odasında böyle demişti; saatleriyle. Saatleri olan cevaplar, bir kürsüde yeniden sorulmayı bekler.
`,
        ),
        O(`
T: Tarık’a o sabah nerede olduğunu hiç sormadım. Kürsüde ilk kez soracağım.
`),
      ],
    }),
    court2.objection('C2_03C', {
      title: 'Akraba tanık',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'tarik',
      say: S(`
mubasir: Tanık Tarık Ateş! Tarık Ateş!
N: Tarık kürsüye yürüdü. Gri hırka, kısa sakal, alçak ses. Vedat’ın önünden geçerken başını eğdi; bir selam ya da bir özür.
hakim: Tanık, sanıkla akrabalığınız?
tarik: Yeğeniyim Sayın Hâkim. Babam rahmetli, Vedat amcamın ağabeyiydi.
hakim: Müdafi, dinlemeye geçmeden önce bir talebiniz var mı?
T: Bir tanık, bir amca, bir yeğen. Bu kürsüde ona söylenmesi gereken bir şey var; benim değil, hâkimin ağzından.
`),
      next: 'C2_03',
      options: [
        option(
          'C203C_A',
          '“Tanığa tanıklıktan çekinme ve kendini suçlayan sorulara cevap vermeme hakları hatırlatılsın.”',
          {
            score: { USUL_BILGISI: 100 },
            effects: [inc('legal_hits'), raise('hak_hatirlatildi')],
            good: 'Yeğen üçüncü derece kan hısımıdır: tanıklıktan çekinebilir (CMK 45/1-c); kendisini suçlayabilecek sorulara cevap vermeyebilir (CMK 48). Hatırlatılmazsa beyan hukuka aykırı elde edilmiş sayılabilir (CMK 46/2, 206/2-a).',
            category: 'USUL_BILGISI',
            responses: B(`
hakim: Yerinde. Tanık, sanığın yeğeni olarak tanıklıktan çekinme hakkınız var. Ayrıca kendinizi ya da yakınlarınızı ceza soruşturmasına uğratabilecek sorulara cevap vermeyebilirsiniz. Anladınız mı?
tarik: Anladım. Amcam için konuşurum Sayın Hâkim. Saklayacak bir şeyim yok.
T: “Saklayacak bir şeyim yok.” Vedat da aynı cümleyi kurmuştu, ilk sabah. Aynı dükkânda iki ses.
`),
          },
        ),
        option('C203C_B', '“Tanığa yemin ettirilsin; akraba da olsa doğruyu söylesin.”', {
          score: { USUL_BILGISI: -30 },
          neutral:
            'Yemin önemlidir; ama önce çekinme hakkının hatırlatılması gerekir (CMK 45/2). Hâkim bunu kendisi yaptı.',
          responses: B(`
hakim: Önce hakları müdafi. Tanık, yeğen olarak tanıklıktan çekinme hakkınız ve kendinizi suçlayan sorulara cevap vermeme hakkınız var.
tarik: Amcam için konuşurum.
`),
        }),
        option('C203C_C', '“Tanık olarak değil, şüpheli olarak dinlenmesini istiyoruz.”', {
          score: { USUL_BILGISI: -60 },
          effects: [dec('pers')],
          bad: 'Bir kişiyi şüpheli sıfatıyla sorgulamak mahkemenin değil, soruşturmayı yürüten savcılığın işidir (CMK 158 vd.); kürsüde bir suçlama yapmış oldun.',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Bu mahkeme bir soruşturma yürütmüyor müdafi. Bir şüpheniz varsa yolu bellidir. Tanık, haklarınızı hatırlatıyorum: çekinebilirsiniz; kendinizi suçlayan sorulara cevap vermeyebilirsiniz.
savci: Sayın Hâkim, müdafiin talebi bir suçlamadır; tutanağa geçsin.
`),
        }),
      ],
    }),
    court2.testimony('C2_03', {
      title: 'Yeğenin dinlenmesi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'tarik',
      witnessLabel: 'TANIK · TARIK ATEŞ',
      rulesText: 'İpucu: çelişkiyi doğru delille göster. Tanık istediği an susabilir.',
      objectionGrounds: ['g_telkin', 'g_kanaat', 'g_salon'],
      say: S(`
hakim: Anlatın.
tarik: Ben on dört yıldır amcamın yanındayım. Dükkân benim evim. Amcam dürüst adamdır; bir kâğıda bile yanlış tarih atmaz.
tarik: Polis belge istediğinde dükkânda ne varsa verildi. Ben o gün… dükkândaydım, sonra hastaneye gittim. Amcam hastanedeydi, babaannem düşmüştü.
tarik: Benim bu işle bir ilgim yok. Amcam da yapmaz. Kim yaptıysa… bilmiyorum.
N: Vedat yeğenine baktı; gururla. Bir oğula bakar gibi. Sevgi ise bakmadı; ellerine baktı.
hakim: Müdafi, sorularınız.
N: Tarık kürsünün kenarını tuttu. Sol eliyle. Sağ eli cebindeydi.
T: Kimseyi kırmaya çalışma. Kâğıtlarını göster; gerisini o kendisi yapar. Ya da yapmaz.
`),
      statements: [
        statement('T1', 1, [
          hl(
            'İrsaliyeleri hep amcam imzalardı',
            any(has('ded_mukayese'), has('ded_imza_farki'), flag('fact_solak_tarik')),
          ),
          '; ben hiç imzalamadım.',
        ]),
        statement('T2', 2, [
          'Mukayese belgelerini ',
          hl('polise ben vermedim', has('ev_tutanak')),
          '; o işlerle amcam ilgilendi.',
        ]),
        statement(
          'T3',
          3,
          ['18 Şubat sabahı ', hl('İnegöl’de kâğıtçıdaydım', has('ded_randevu')), '; telefonum yanımdaydı.'],
          not(flag('tarik_uyarildi')),
        ),
        statement(
          'T3X',
          3,
          ['Telefonum o hafta ', hl('dükkânda kalmıştı', has('ded_randevu')), '; herkes kullanırdı.'],
          flag('tarik_uyarildi'),
        ),
        statement('T4', 4, ['Amcamın kimliğine ', hl('hiç dokunmadım', has('ded_kimlik')), '; ceketine bile.']),
        statement('T5', 5, [
          'Benim imzam bambaşka; ',
          hl('ben sağ elimle yazarım', any(has('ev_rapor2_ek'), flag('fact_solak_tarik'), has('ded_solak'))),
          '.',
        ]),
      ],
      rules: [
        pressRule('PR_T1', 'T1', {
          score: { SORGULAMA: 25 },
          responses: B(`
P: Hiç mi? Amcanız makinedeyken şoför beklerse?
tarik: Beklerdi. Amcam gelir imzalardı. Benim imzam olmaz o kâğıtlarda.
`),
        }),
        pressRule('PR_T4', 'T4', {
          score: { SORGULAMA: 25 },
          responses: B(`
P: Ceket kapının arkasında asılı durur. Önünden günde kaç kez geçersiniz?
tarik: Herkes geçer. Kurye geçer, Emre geçer. Ben de geçerim; geçmek dokunmak değil.
`),
        }),
        pressRule('PR_T5', 'T5', {
          score: { SORGULAMA: 25 },
          responses: [
            W(
              flag('fact_solak_tarik'),
              `
P: Kesim masasındaki makasın kolunu sol tarafa kim çevirir Tarık Bey?
tarik: …Makas. Herkes kullanır o makası.
N: Elini kürsüden çekti. Cebine soktu. Kürsünün kenarında, terli bir avuç izi kaldı.
`,
            ),
            O(`
P: Sağ elinizle mi? Emin misiniz?
tarik: Eminim. Kalemi sağ elle tutarım. Bakın.
N: Kâtibin uzattığı kâğıda adını yazdı; sağ eliyle. Yavaş, dikkatli, okul defteri gibi.
`),
          ],
        }),
        presentRule('PS_T1', 'T1', ['ded_mukayese', 'ded_imza_farki'], {
          effects: tc('contra_t1'),
          good: 'İrsaliyelerde iki ayrı el var; Vedat’ın akıcı imzası azınlıkta. “Hep amcam imzalardı” beyanı kâğıtla çelişiyor.',
          category: 'SORGULAMA',
          responses: B(`
P: Sayın Hâkim, irsaliye karbonları. İki ayrı el. Akıcı ve sağa yatık olanlar azınlıkta; Vedat Bey’in bu salonda attığı imzaya benziyorlar.
P: Yavaş, kalın, sola yatık olanlar çoğunlukta. Bilirkişiye “Vedat Ateş’in imzası” diye verilenler de bunlar. Tanık bey, bunları kim imzaladı?
tarik: Ben… bilmiyorum. Şoförler bekliyordu. Belki Emre.
P: Emre o aylarda öğleden sonraları geliyordu; irsaliyelerin çoğu sabah tarihli. Tanık bey, sabahları dükkânda kim olurdu?
tarik: Amcam. Ben. …Amcam makinede olurdu.
N: Cümlenin sonunu kendisi duydu. Bir an gözlerini kapadı.
`),
        }),
        presentRule('PS_T2', 'T2', ['ev_tutanak'], {
          effects: tc('contra_t2'),
          good: 'Asıl teslim tutanağı: mukayese belgelerini kolluğa tanık teslim etmiş; sanık hastanedeydi.',
          category: 'SORGULAMA',
          responses: B(`
P: Kolluğun asıl teslim tutanağı, 20 Mart. “On dört irsaliye ve altı kargo fişi, şüphelinin yeğeni Tarık Ateş tarafından teslim edilmiştir. Şüpheli hastanededir.”
P: Bilirkişiye giden kâğıtları siz seçtiniz Tarık Bey.
tarik: Polis istedi. Ben… klasörden aldım. Ne bulduysam. Amcam hastanedeydi; ben ne yapacaktım?
N: Vedat kürsüye döndü. “Sen mi verdin?” dedi, sesini yükseltmeden. Hâkim ona işaret etti; sustu.
T: Bilirkişinin önüne konan kâğıtları, imzası tartışılan adam değil, başka biri seçmişti. Bir rapor böyle kirlenir; sessizce, bir klasörden.
`),
        }),
        presentRule('PS_T3', 'T3', ['ded_randevu'], {
          effects: tc('contra_t3'),
          good: 'Randevuyu da teyit aramasını da tanığın hattı yapmış: İnegöl beyanı ve “telefonum yanımdaydı” sözü birlikte çöküyor.',
          category: 'SORGULAMA',
          responses: B(`
P: Telefonunuz yanınızdaydı. Tapu randevusu 10 Şubat’ta bu telefondan alınmış. İşlem günü 11.06’da tapunun çağrı merkezi aramış; bu telefon kırk bir saniye konuşmuş.
P: “Randevunuz 11.15’te, kimliğinizle gelin.” İnegöl’de kâğıtçıdayken mi?
tarik: Ben… biri aramıştı, evet. Yanlış numara sandım.
P: Kırk bir saniye.
N: Tarık cevap vermedi. Kâtip yazmayı bıraktı ve bekledi.
N: Savcı Orhan Bilgiç kalemini masaya bıraktı ve tanığa döndü. İlk kez. Bir şey sormadı; yalnızca baktı.
`),
        }),
        presentRule('PS_T3X', 'T3X', ['ded_randevu'], {
          effects: once('contra_t3x', 'SORGULAMA', 100),
          neutral:
            'Kısmi: tanık hazırlıklıydı; “telefonu herkes kullanırdı” diyerek çelişkiyi yumuşattı. Gece matbaada sorduğun soru, cevabını getirmişti.',
          responses: B(`
tarik: Dedim ya Sayın Hâkim, telefonum dükkânda kaldı o hafta. Herkes kullandı. Kim randevu aldı, bilmiyorum.
T: Bu cümleyi ona ben öğrettim; bir gece, bir kapının eşiğinde.
`),
        }),
        presentRule('PS_T4', 'T4', ['ded_kimlik'], {
          effects: once('contra_t4', 'SORGULAMA', 100),
          neutral: 'Kısmi: kimliğin o gece cepten çıkıp geri döndüğü belli; kimin aldığı değil.',
          responses: B(`
tarik: Kimlik kaybolmuş, sonra bulunmuş. Bunu herkes biliyor. Ben almadım.
`),
        }),
        presentRule('PS_T5', 'T5', ['ev_rapor2_ek'], {
          effects: tc('contra_t5'),
          good: 'Adli Tıp ek raporu: senet ve makbuzdaki imzalar tanığın resmî imza ve yazı örnekleriyle uyumlu.',
          category: 'SORGULAMA',
          responses: B(`
P: Sayın Hâkim, Adli Tıp ek raporu. Savcılığın gönderdiği tanığa ait noter, banka ve vergi dairesi imzaları ve yazı örnekleri.
P: Sonuç: senet ve makbuzdaki “Vedat Ateş” imzalarının yazılış hızı, basıncı ve bağlantıları bu örneklerle uyumlu. Sol el kullanımıyla uyumlu.
N: Tarık kâğıda bakmadı. Amcasına baktı.
`),
        }),
        presentRule('PS_T5_SOLAK', 'T5', ['ded_solak'], {
          effects: once('contra_t5x', 'SORGULAMA', 100),
          neutral:
            'Kısmi: senedi bir solağın imzaladığını gösterdin; tanığın solak olduğunu gösteren bir belge sunmadın.',
          responses: B(`
tarik: Senedi bir solak imzaladıysa, Bursa’da yüz bin solak var avukat hanım.
`),
        }),
        presentRule('PS_T_SAVCILIK', undefined, ['ev_senet', 'ev_suret', 'ev_rapor1', 'ev_makbuz'], {
          maxUses: 10,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'Savcılığın delilini tanığa göstermek bir çelişki doğurmadı.',
          category: 'SORGULAMA',
          responses: B(`
tarik: Bunu biliyorum avukat hanım. Herkes biliyor.
`),
        }),
      ],
      presentMiss: fallback('FB_C2T_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil: −1 güvenilirlik, −150 skor.', category: 'SORGULAMA' },
        responses: B(`
hakim: İlgisini göremedim müdafi.
`),
      }),
      objectMiss: fallback('FB_C2T_OBJECT', 'OBJECT', {
        effects: [dec('cred'), inc('wrong'), score('USUL_BILGISI', -50, 'hatali')],
        quality: { q: 'BAD', feedback: 'Dayanaksız itiraz.', category: 'USUL_BILGISI' },
        responses: B(`
hakim: İtiraz reddedildi. Kendi tanığınıza mı itiraz ediyorsunuz müdafi?
`),
      }),
      finish: { id: 'C203_BITIR', next: 'C2_03F' },
    }),
    decisionNode('C2_03F', [{ when: cmp(v('tarik_c'), '>=', 3), to: 'C2_03H' }, { to: 'C2_TENEFFUS' }], {
      ...court2.base,
    }),
    court2.stage('C2_03H', {
      title: 'Sessizlik',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'tarik',
      onEnter: [raise('tarik_sustu'), inc('pers')],
      lines: B(`
N: Tarık uzun bir süre hiçbir şey söylemedi. Salon bekledi. Kâtip bekledi. Hâkim bekledi.
tarik: Sayın Hâkim. Hakkımı kullanıyorum. Bundan sonra hiçbir soruya cevap vermeyeceğim.
hakim: Hakkınız. Tutanağa geçsin: tanık, kendisini suçlayabilecek sorulara cevap vermeme hakkını kullandı.
vedat: Tarık?
N: Tarık kürsüden inmeden önce amcasına döndü. Sesi her zamanki gibi alçaktı; kibar, yorgun.
tarik: Sen hep kâğıda inandın amca. Kâğıt kimin elindeyse onun olur.
N: Kürsüden indi. Salonun arka kapısına yürüdü; kimse onu durdurmadı. Kapı arkasından sessizce kapandı.
N: Vedat sağ elini masanın üstüne koydu. Sonra sol elini. İkisine birden baktı.
T: Bir sessizlik bir delil değildir. Ama sorulmuş sorular tutanakta kalır. Ve cevapsız kalan her soru, kendi cevabını bir yere yazar.
`),
      choices: [cont('C203H_DEVAM', 'Devam', 'C2_TENEFFUS', { role: 'PRIMARY' })],
    }),
    story('C2_TENEFFUS', {
      ...court2.base,
      title: 'On beş dakika',
      background: 'adliye',
      lines: B(`
C#adliye: ADLİYE KORİDORU · ON BEŞ DAKİKA ARA
N: Hâkim on beş dakika ara verdi. Koridorda kimse oturmadı. Vedat pencerenin önünde durdu; aşağıda adliyenin otoparkı, bir sıra araba, beyaz bir Doblo.
vedat: Bizim Doblo bu. Tarık’la geldik sabah. Ben şoför koltuğuna oturmadım; o sürdü. On dört yıldır o sürer.
N: Nermin Kurt koridorun öbür ucundan geldi. Kardeşinin yanında durdu. Bir süre ikisi de pencereden aşağı baktı.
nermin: Annem dün seni sordu. “Vedat’ım nerede” dedi. “İşte” dedim. Yalan söyledim.
vedat: Ben de ona her pazar “evin yerinde” diyorum abla. İkimiz de yalan söylüyoruz.
nermin: Bizim ailede herkes birini korumak için yalan söylüyor. Bir tek kâğıtlar söylemiyor.
N: Sevgi elinde üç bardak suyla geldi. Birini Vedat’a, birini Nermin’e verdi. Üçüncüyü kendisi tutmadı; bana uzattı.
sevgi: İçin Deniz Hanım. Sesiniz kısılmış.
T: Bir aile, bir koridorda, bir pencerenin önünde. Kimse kimseyi suçlamıyor. Herkes bir şeyi bekliyor. Ben de.
mubasir: Ateş dosyası! Taraflar salona! Ateş dosyası!
`),
      choices: [cont('TENEFFUS_DEVAM', 'Salona dön', 'C2_04G', { role: 'PRIMARY' })],
    }),
    decisionNode('C2_04G', [{ when: has('ev_rapor2'), to: 'C2_04A' }, { to: 'C2_04B' }], { ...court2.base }),
    court2.objection('C2_04A', {
      title: 'Adli Tıp raporu',
      courtStage: 'DELIL_TARTISMA',
      background: 'durusma_salonu',
      prosecutionEvidence: 'ev_rapor1',
      say: S(`
hakim: Adli Tıp raporu tartışmaya açıldı. Sayın Savcı?
savci: Rapor açık. Ancak sahte suretin sanığın matbaasında basılmış olma ihtimali ortadan kalkmış değildir.
hakim: Müdafi, rapora ve iki rapor arasındaki çelişkiye diyeceğiniz?
`),
      next: 'C2_05',
      options: [
        option(
          'C204A_A',
          '“Adli Tıp resmî imzalarla baktı: imzalar sanığın değil. İlk rapor kirli mukayeseye dayanıyor; hükme esas alınamaz.”',
          {
            score: { USUL_BILGISI: 150 },
            effects: [inc('pers', 2), inc('legal_hits')],
            good: 'İki rapor arasındaki çelişki, mukayese malzemesinin niteliğiyle açıklandı: tartışmasız imzalara dayanan rapor üstündür (CMK 217, 67/5).',
            category: 'USUL_BILGISI',
            responses: B(`
P: Sayın Hâkim, ilk rapor kaynağı belirsiz, iki ayrı elden çıkmış özel belgelerle yapıldı. Adli Tıp ise sanığın noterde, bankada, nüfusta attığı imzalarla.
P: Sonuç: senetteki imza sanığın değil. İlk rapor da aslında yanlış değil; senedi atan elin irsaliyeleri de attığını söylüyor. O el, sanığın eli değil.
P: Suretin matbaada basılmış olması, onu kimin bastığını söylemez. Dükkânın ortak bilgisayarı ve pervazdaki anahtar, herkesin bildiği şeyler.
P: Savcılığın ihtimali bir ihtimaldir Sayın Hâkim. Adli Tıp’ınki bir sonuç.
savci: …Not ediyorum Sayın Hâkim.
`),
          },
        ),
        option('C204A_B', '“Rapor ortada. Başka bir diyeceğimiz yok.”', {
          score: { USUL_BILGISI: 20 },
          neutral:
            'Rapor lehine; ama iki rapor arasındaki çelişkiyi açıklamadın, savcının matbaa ihtimaline cevap vermedin.',
          responses: B(`
hakim: Peki. İki rapor arasındaki çelişkiyi mahkeme takdir edecek.
`),
        }),
        option('C204A_C', '“Suret matbaada basılmış olabilir; ama dükkâna herkes girer.”', {
          score: { USUL_BILGISI: -30 },
          effects: [dec('pers')],
          bad: 'Savcının ihtimalini kanıtsız biçimde kabul ettin; müvekkilin işyerini sahteciliğin yeri olarak kürsüye koydun.',
          category: 'USUL_BILGISI',
          responses: B(`
savci: Müdafi suretin sanığın işyerinde basıldığını kabul ediyor. Tutanağa geçsin.
T: Bir cümle. Savcının tutanağına benim sesimle.
`),
        }),
      ],
    }),
    court2.objection('C2_04B', {
      title: 'Bilirkişi raporu',
      courtStage: 'DELIL_TARTISMA',
      background: 'durusma_salonu',
      prosecutionEvidence: 'ev_rapor1',
      say: S(`
hakim: Dosyada tek imza incelemesi var: soruşturmadaki grafoloji raporu. Müdafi, diyeceğiniz?
T: Rapora rapor koyamadım. Elimde ne varsa onunla.
`),
      next: 'C2_05',
      options: [
        option('C204B_A', '“Mukayese belgeleri özel ve iki ayrı elden; rapor hükme esas alınamaz.”', {
          visibleWhen: has('ded_mukayese'),
          score: { USUL_BILGISI: 100 },
          effects: [inc('pers')],
          good: 'Mukayese malzemesinin güvenilmezliği raporun ispat gücünü düşürür (CMK 217). Yeni rapor alınmadığı için şüphe sanık lehine.',
          category: 'USUL_BILGISI',
          responses: B(`
P: Sayın Hâkim, rapor “aynı el” diyor. Hangi elin? Kaynağı belirsiz, iki ayrı elden çıkmış özel belgelerle yapılmış bir karşılaştırma sanığın elini ispat edemez.
hakim: Not edildi.
`),
        }),
        option('C204B_B', '“Rapor güvenilir değil.”', {
          score: { USUL_BILGISI: 10 },
          neutral: 'Somut bir dayanak göstermedin.',
          responses: B(`
hakim: Neden güvenilir değil müdafi? …Peki. Not edildi.
`),
        }),
        option('C204B_C', '“Raporu kabul ediyoruz; ama sanık iyi niyetliydi.”', {
          score: { USUL_BILGISI: -60 },
          effects: [dec('pers', 2)],
          bad: 'İmzayı kabul eden bir savunma, sahteciliğin kendisini kabul etmektir; “iyi niyet” sahteciliği ortadan kaldırmaz.',
          category: 'USUL_BILGISI',
          responses: B(`
savci: Müdafi imzanın sanığa ait olduğunu kabul ediyor. Teşekkür ederiz.
N: Vedat bana döndü. “Ben imza atmadım” dedi; yalnızca dudaklarıyla.
`),
        }),
      ],
    }),
    decisionNode('C2_05', [{ when: guclu, to: 'C2_05A' }, { when: orta, to: 'C2_05B' }, { to: 'C2_05C' }], {
      ...court2.base,
      title: 'Mütalaa',
    }),
    court2.stage('C2_05A', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      background: 'durusma_salonu',
      onEnter: [set('mutalaa', 'BERAAT')],
      lines: B(`
hakim: Sayın Savcı, esas hakkındaki mütalaanız?
N: Orhan Bilgiç ayağa kalktı. Dosyasına baktı. Kapadı.
savci: Sayın Hâkim. İddianamede sanığın imzasına dayandık. Bugün dosyada, bu imzanın sanığa ait olmadığına ilişkin güçlü deliller var.
savci: Tanık beyanları, kayıtlar ve rapor birlikte değerlendirildiğinde, sanığın üzerine atılı suçu işlediği sabit değildir. Sanığın beraatine karar verilmesini talep ediyorum.
N: Salonda bir kıpırtı. Nermin Kurt mendilini gözlerine bastırdı. Vedat kıpırdamadı; anlamamış gibi.
T: Bir savcı “yanıldık” dedi. Bunu her gün duymazsın. Bunu duymak için kâğıtların ona okuması gerekir; senin değil.
`),
      choices: [cont('C205A_DEVAM', 'Dayanaklarını hazırla', 'C2_06P', { role: 'PRIMARY' })],
    }),
    court2.stage('C2_05B', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      background: 'durusma_salonu',
      onEnter: [set('mutalaa', 'TAKDIR')],
      lines: B(`
hakim: Sayın Savcı, esas hakkındaki mütalaanız?
savci: Sayın Hâkim. Dosyada sanığın imzasına ilişkin çelişkili deliller var. Tapu memurunun beyanı, sonradan gelen kayıtlar…
savci: Ancak sahte suret sanığın matbaasıyla ilişkili ve sanığın taşınmazı satmak için bir sebebi olduğu sabit. Takdiri yüce mahkemeye bırakıyorum.
T: Takdir. Bir savcının “emin değilim” demesinin resmî biçimi. Şimdi o boşluğu ben dolduracağım.
`),
      choices: [cont('C205B_DEVAM', 'Dayanaklarını hazırla', 'C2_06P', { role: 'PRIMARY' })],
    }),
    court2.stage('C2_05C', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      background: 'durusma_salonu',
      onEnter: [set('mutalaa', 'MAHKUMIYET')],
      lines: B(`
hakim: Sayın Savcı, esas hakkındaki mütalaanız?
savci: Sayın Hâkim. Senetteki imza, bilirkişi raporuyla sanığa aittir. Sahte suret sanığın işyerinde basılabilecek niteliktedir. Sanığın 2024’te taşınmazı satmak istediği sabittir.
savci: Sanığın TCK 204/1 uyarınca cezalandırılmasını talep ediyorum.
N: Vedat başını önüne eğdi. Sevgi’nin eli, arkadaki sıradan uzanıp onun omzuna dokundu.
T: Savcının elinde aynı kâğıtlar duruyordu. Ona başka bir şey okutamadım.
`),
      choices: [cont('C205C_DEVAM', 'Dayanaklarını hazırla', 'C2_06P', { role: 'PRIMARY' })],
    }),
    story('C2_06P', {
      ...court2.base,
      title: 'Dayanaklar',
      hud: ['noktalar', 'pers'],
      background: 'durusma_salonu',
      lines: [
        W(
          cmp(v('mutalaa'), '==', 'BERAAT'),
          `
hakim: Müdafi, esas hakkındaki savunmanız. Savcı beraat istedi; yine de söyleyeceklerinizi dinleyeceğim.
T: Savcı beraat istedi. Bu bir hediye değil; hâkim mütalaayla bağlı değil. Üç dayanak. En güçlü üçü.
`,
        ),
        W(
          cmp(v('mutalaa'), '==', 'TAKDIR'),
          `
hakim: Müdafi, esas hakkındaki savunmanız. Hazırsanız.
T: Takdir. Boşluğu doldurmak bana kaldı. Üç dayanak. En güçlü üçü; yoksa boşluk boş kalır.
`,
        ),
        O(`
hakim: Müdafi, esas hakkındaki savunmanız. Hazırsanız.
T: Üç dayanak. En güçlü üçü. Bir savunma, söylediği her şey kadar söylemediği şeylerle de ölçülür.
`),
      ],
      choices: [
        option('ARG_SOLAK', 'Senedi sol elini kullanan biri imzaladı; sanık sağlak', {
          visibleWhen: any(has('ded_solak'), flag('contra_g3')),
          cost: pointCost,
          score: { SAVUNMA_STRATEJISI: 100 },
          effects: [inc('pers'), raise('arg_solak')],
          responses: B(`
P: Bir: senedi sol elini kullanan biri imzaladı. Mürekkep sağa sıvanmış; tapu memuru kalemin sol ele geçtiğini ve zincirin gerildiğini hatırladı. Sanık sağ elini kullanıyor; bu salonda gördük.
`),
          good: 'Tanığın hatırladığı sol el, sıvanmış mürekkep ve sanığın sağ eli: imzanın sanığa ait olmadığına ilişkin üç bağımsız işaret.',
          category: 'SAVUNMA_STRATEJISI',
          next: '$stay',
        }),
        option('ARG_RAPOR', 'Adli Tıp raporu: imza sanığın değil', {
          visibleWhen: has('ev_rapor2'),
          cost: pointCost,
          score: { SAVUNMA_STRATEJISI: 120 },
          effects: [inc('pers'), raise('arg_rapor')],
          responses: B(`
P: İki: Adli Tıp Kurumu, sanığın noterde, bankada ve nüfusta attığı imzalarla karşılaştırdı. Sonuç açık: senet ve makbuzdaki imzalar sanığın el ürünü değil.
`),
          good: 'Tartışmasız mukayese imzalarına dayanan resmî rapor, davanın tek ağır delilini çökertiyor.',
          category: 'SAVUNMA_STRATEJISI',
          next: '$stay',
        }),
        option('ARG_MUKAYESE', 'İlk rapor kirli mukayese malzemesine dayanıyor', {
          visibleWhen: has('ded_mukayese'),
          cost: pointCost,
          score: { SAVUNMA_STRATEJISI: 80 },
          effects: [inc('pers'), raise('arg_mukayese')],
          good: 'Özel belgelerle ve iki ayrı elden yapılan karşılaştırmanın ispat gücü yoktur (CMK 217).',
          category: 'SAVUNMA_STRATEJISI',
          next: '$stay',
        }),
        option('ARG_MAZERET', 'İşlem saatinde sanık matbaada, kuryeyle', {
          visibleWhen: any(has('ded_mazeret'), flag('mazeret_tanik'), flag('contra_e4')),
          cost: pointCost,
          score: { SAVUNMA_STRATEJISI: 100 },
          effects: [inc('pers'), raise('arg_mazeret')],
          responses: B(`
P: Üç: 11.19 ile 11.37 arasında sanık matbaasının önünde, bir kuryeyle koli bantlıyordu. Bunu bir terminal kaydı ve bir tanık söylüyor. Senet 11.24’te, dört kilometre ötede imzalandı.
`),
          good: 'Bağımsız bir kayıt ve tanıkla desteklenen mazeret: sanık 11.24’te tapuda olamaz.',
          category: 'SAVUNMA_STRATEJISI',
          next: '$stay',
        }),
        option('ARG_KIMLIK', 'Kimlik o sabah sanığın elinde değildi', {
          visibleWhen: has('ded_kimlik'),
          cost: pointCost,
          score: { SAVUNMA_STRATEJISI: 50 },
          effects: [raise('arg_kimlik')],
          neutral: 'Doğru ama tek başına zayıf: kimliğin kaybolduğunu yalnızca sanığın mesajı gösteriyor.',
          next: '$stay',
        }),
        option('ARG_FAIL', 'Kayıtlar ve rapor başka bir eli gösteriyor; savcılık soruşturuyor', {
          visibleWhen: any(flag('tarik_sustu'), has('ev_rapor2_ek'), flag('contra_e3')),
          cost: pointCost,
          score: { SAVUNMA_STRATEJISI: 100 },
          effects: [inc('pers'), raise('arg_fail')],
          good: 'Başka bir kişiyi suçlamadan, onu gösteren kayıtları ve savcılığın açtığı soruşturmayı ortaya koydun: suç sanık tarafından işlenmemiştir.',
          category: 'SAVUNMA_STRATEJISI',
          next: '$stay',
        }),
        option('ARG_SURET', 'Suret sahte; noterin arşivinde satış yetkisi yok', {
          visibleWhen: has('ded_suret_sahte'),
          cost: pointCost,
          score: { SAVUNMA_STRATEJISI: 20 },
          effects: [raise('arg_suret')],
          neutral: 'Doğru, ama suretin sahte olduğunu zaten iddianame söylüyor; mesele onu kimin düzenlediği.',
          next: '$stay',
        }),
        option('ARG_NERMIN', 'Şikâyetçinin kendi çıkarı var; evi o istiyordu', {
          cost: pointCost,
          score: { SAVUNMA_STRATEJISI: -60 },
          effects: [dec('pers')],
          bad: 'Delile dayanmayan bir suçlama; şikâyetçiyi hedef almak heyeti savunmadan uzaklaştırır.',
          category: 'SAVUNMA_STRATEJISI',
          next: '$stay',
        }),
        option('ARG_IYI', 'Sanık sabıkasız, saygın bir esnaf', {
          cost: pointCost,
          score: { SAVUNMA_STRATEJISI: 10 },
          neutral:
            'Kişilik özellikleri ancak ceza tayininde (TCK 62) gözetilir; suçun işlenip işlenmediği sorusuna cevap değildir.',
          next: '$stay',
        }),
        cont('ARG_TAMAM', 'Dayanaklar tamam', 'C2_06', { role: 'PRIMARY' }),
      ],
    }),
    court2.objection('C2_06', {
      title: 'Esas hakkında savunma',
      courtStage: 'SAVUNMA',
      background: 'durusma_salonu',
      say: S(`
N: Ayağa kalktım. Cübbemin kolları her zamankinden ağırdı. Salonda bir tek kâtibin klavyesi.
T: Ne istiyorum? Bunu yüksek sesle söylemeden önce kendime söylemeliyim.
`),
      next: 'C2_06R',
      options: [
        option('C206_M', '“Sanık bu suçu işlememiştir. Beraatini talep ediyoruz; olmazsa delil yetersizliğinden.”', {
          score: { SAVUNMA_STRATEJISI: strategyAmount(200, 'MASUMIYET') },
          effects: [raise('closing_masumiyet')],
          good: 'Masumiyet savunması: öncelikle suçun sanık tarafından işlenmediğinin sabit olduğu (CMK 223/2-b), olmadığı takdirde şüpheden yararlanma (223/2-e).',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
P: Sayın Hâkim. Bu dosyada bir ad var, bir de bir el. Ad doğru: Vedat Ateş. El yanlış.
P: Senedi imzalayan el, kalemi sol eline geçirdi ve zinciri gerdi. Vedat Ateş o saatte dört kilometre ötede, bir kuryeyle koli bantlıyordu.
P: Müvekkilim ömrü boyunca kâğıt bastı. Bugün bir kâğıt onu basmak istiyor. Kâğıdı tutan eli gördük. O el onun değil.
P: Savcılık bir sebep gösterdi: bir bayram sofrasında söylenmiş bir cümle. Bir cümle, bir kâğıdı basmaz. Bir kimliği bir ceketten almaz. Bir zinciri germez.
P: Sanığın üzerine atılı suçu işlemediği sabit olduğundan beraatini; mahkeme aksi kanaatteyse, mahkûmiyete yeter delil bulunmadığından beraatini talep ediyoruz.
`),
        }),
        option('C206_U', '“Bilirkişi raporu hükme esas alınamaz; delil yetersizliğinden beraat.”', {
          score: { SAVUNMA_STRATEJISI: strategyAmount(200, 'USUL') },
          effects: [raise('closing_usul')],
          good: 'Usul savunması: tek ağır delilin ispat gücünün çöktüğünü ve mahkûmiyete yeter delil bulunmadığını savundun (CMK 217, 223/2-e).',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
P: Sayın Hâkim, bu dosyanın tek ağır delili bir rapordu. O rapor, kimin attığı belli olmayan kâğıtlara dayanıyordu.
P: İmza sanığa ait değilse geriye bir sebep kalır; 2024’te bir yemek masasında söylenmiş bir cümle. Bir cümle bir sahteciliği ispat etmez.
P: Mahkûmiyete yeter, kesin ve inandırıcı delil yoktur. Şüpheden sanık yararlanır. Beraatini talep ediyoruz.
`),
        }),
        option('C206_T', '“Beraatini; mahkeme aksi kanaatteyse en alt sınırdan, takdiri indirimle ve ertelemeyle.”', {
          score: { SAVUNMA_STRATEJISI: strategyAmount(150, 'INDIRIM') },
          effects: [raise('closing_terdit')],
          neutral: 'Terditli savunma güvenlidir; ama imzasını inkâr eden müvekkilin savunmasını zayıflatır.',
          responses: B(`
P: Sayın Hâkim, müvekkilimin beraatini talep ediyoruz. Mahkeme aksi kanaatteyse cezanın alt sınırdan belirlenmesini, TCK 62 uyarınca indirilmesini ve ertelenmesini.
N: Vedat bana döndü. “Aksi kanaat” kelimelerini dudaklarıyla tekrarladı.
`),
        }),
        option(
          'C206_I',
          '“Sanığın sabıkasızlığı gözetilerek takdiri indirim ve hükmün açıklanmasının geri bırakılması.”',
          {
            score: { SAVUNMA_STRATEJISI: -100 },
            effects: [raise('closing_indirim'), dec('pers', 2)],
            bad: 'Yalnızca lehe hükümleri istemek, imzayı inkâr eden müvekkilin savunmasını terk etmektir. Ayrıca zarar giderilmeden HAGB mümkün değil (CMK 231/6-c).',
            category: 'SAVUNMA_STRATEJISI',
            responses: B(`
P: Sayın Hâkim, müvekkilim sabıkasızdır. Takdiri indirim ve hükmün açıklanmasının geri bırakılmasını talep ediyoruz.
vedat: Ne? Avukat hanım… Ben yapmadım. Ben yapmadım ki!
hakim: Sanık, sırası gelince söz vereceğim.
`),
          },
        ),
      ],
    }),
    decisionNode('C2_06R', [{ to: 'C2_07' }], {
      ...court2.base,
      lines: [
        W(
          all(flag('arg_rapor'), flag('arg_solak')),
          `
N: Hâkim not almayı bıraktı. Bir rapor ve bir zincir; ikisini birbirine bağlayan bir sağ el. Kalemi masaya koydu.
`,
        ),
        W(
          any(flag('arg_fail'), flag('arg_mazeret')),
          `
N: Hâkim iki kez başını kaldırıp sanığa baktı. Bir kez tanık sırasına. Kâtip yazmaya devam etti.
`,
        ),
        W(
          any(flag('arg_mukayese'), flag('arg_rapor'), flag('arg_solak')),
          `
N: Hâkim bir şey not etti; kısa bir şey. Savcı da.
`,
        ),
        W(
          any(flag('arg_kimlik'), flag('arg_suret')),
          `
N: Hâkim dinledi. Not almadı. Söylediklerim doğruydu; ama onun zaten bildiği şeylerdi.
`,
        ),
        O(`
N: Hâkim dinledi. Savunmamın sonunda yalnızca “teşekkürler müdafi” dedi.
`),
      ],
    }),
    court2.objection('C2_07', {
      title: 'Son söz',
      courtStage: 'SON_SOZ',
      background: 'durusma_salonu',
      witness: 'vedat',
      say: S(`
hakim: Sanık, son sözünüz?
N: Vedat ayağa kalktı. Bana baktı; bir şey söylememi bekler gibi.
`),
      next: 'C2_08',
      options: [
        option('C207_A', 'Fısılda: “Kendi sözlerinizle.”', {
          effects: [raise('sonsoz_kendi')],
          responses: B(`
vedat: Sayın Hâkim. Ben matbaacıyım. Babam da matbaacıydı. Bize bir şey öğretti: harfler ters dizilir, kâğıda basınca doğru okunur.
vedat: Benim adım o kâğıtta doğru okunuyor. Ama ben dizmedim. Bir isim, bir imza değildir. İmzam benim; adımı herkes yazabilir.
vedat: Beş ay bir adı taşıdım: sahtekâr. Dükkâna müşteri gelmedi; gelen de kâğıdına bakıp gitti. Benim kâğıdıma bakıp gitti.
vedat: Kimseye kızgın değilim Sayın Hâkim. Bilmediğim birine kızamam. Bildiğim birine… kızmak istemem.
vedat: Annemin evini geri istiyorum. Benim için değil. Annem perdesini soruyor.
`),
        }),
        option('C207_B', 'Fısılda: “Kısa tutun.”', {
          responses: B(`
vedat: Ben yapmadım Sayın Hâkim. Bu kadar.
N: Oturdu. Ellerini masanın altına sakladı; sonra fark edip masanın üstüne koydu.
`),
        }),
      ],
    }),
    decisionNode('C2_08', [{ to: 'R_KARAR' }], {
      ...court2.base,
      title: 'Hüküm',
      lines: [
        W(
          flag('cokus'),
          `
N: Hâkim kararı açıklamak için kısa bir ara verdi. Koridorda kimse benimle konuşmadı.
`,
        ),
        W(
          flag('closing_indirim'),
          `
N: Hâkim kararı açıklamak için ara verdi. Koridorda Vedat bana yaklaşmadı. Sevgi yaklaştı: “Neden?” dedi yalnızca. Cevap veremedim.
mubasir: Taraflar salona! Hükmü ayakta dinleyin!
`,
        ),
        W(
          flag('closing_terdit'),
          `
N: Hâkim kararı açıklamak için yarım saat ara verdi. Vedat koridorda bana döndü: “Aksi kanaat ne demek avukat hanım?” Söyledim. Bir şey demedi.
mubasir: Taraflar salona! Hükmü ayakta dinleyin! Taraflar salona!
`,
        ),
        W(
          flag('sonsoz_kendi'),
          `
N: Hâkim kararı açıklamak için yarım saat ara verdi. Koridorda Sevgi Vedat’ın elini tutuyordu. “Annem perdesini soruyor.” Bu cümle salonda kalmıştı.
mubasir: Taraflar salona! Hükmü ayakta dinleyin! Taraflar salona!
`,
        ),
        W(
          any(flag('closing_masumiyet'), flag('closing_usul')),
          `
N: Hâkim kararı açıklamak için yarım saat ara verdi. Koridorda kimse konuşmadı. Vedat pencereden Uludağ’a baktı.
mubasir: Taraflar salona! Hükmü ayakta dinleyin! Taraflar salona!
`,
        ),
        O(`
N: Hâkim kararı açıklamak için yarım saat ara verdi. Koridorda Sevgi Vedat’ın elini tutuyordu; sağ elini.
mubasir: Taraflar salona! Hükmü ayakta dinleyin! Taraflar salona!
`),
      ],
    }),
    story('C2_COKUS', {
      ...court2.base,
      title: 'Çöküş',
      background: 'durusma_salonu',
      lines: B(`
hakim: Müdafi, bu salonda bugün sunduğunuz delillerin hiçbiri beyanlarla ilgili değildi. İtirazlarınızın dayanağı yoktu.
hakim: Savunma hakkı kutsaldır; ama mahkemenin zamanı da kamunun malıdır. Savunmanızı yazılı olarak verin. Mütalaayı aldım.
N: Savcı bana bakmadı. Kâtip bakmadı. Vedat baktı.
T: Kâğıtlarım masadaydı. Ellerim titredi; kâğıtlar düştü.
`),
      choices: [cont('COKUS_DEVAM', 'Hükmü bekle', 'C2_08', { role: 'PRIMARY' })],
    }),
    resultNode('R_KARAR', { ...court2.base, title: 'Karar', background: 'durusma_salonu' }),
  ],
  triggers: [
    {
      id: 'tg_cokus',
      priority: 0,
      once: true,
      when: all(flag('in_court'), cmp(v('cred'), '<=', 0)),
      effects: [raise('cokus')],
      goto: 'C2_COKUS',
    },
  ],
  discoveryPaths: [...raporlar.discoveryPaths],
};
