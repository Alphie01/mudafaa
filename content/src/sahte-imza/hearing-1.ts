import {
  any,
  cont,
  courtSession,
  dec,
  decisionNode,
  fallback,
  flag,
  ground,
  has,
  ifThen,
  inc,
  meet,
  not,
  objectRule,
  option,
  presentRule,
  pressRule,
  raise,
  score,
  statement,
  hl,
  story,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, O, S, W } from './lib.js';
import { HEAR1, court1, wrongMove } from './shared.js';

// 60-hearing-1: koridor, açılış, sanık savunması, savcının sorusu, tapu memurunun çapraz sorgusu, bilirkişi raporuna
// itiraz, delil talepleri ve ara karar (üç hafta erteleme).

const once = (f: string, amount: number, extra: ReturnType<typeof inc>[] = []) => [
  ifThen(not(flag(f)), [raise(f), score('SORGULAMA', amount), ...extra]),
];

export const hearing1: CasePart = {
  config: {
    objectionGrounds: [
      ground('g_telkin', 'Telkin edici, yönlendirici soru', 'CMK 201'),
      ground('g_kanaat', 'Tanığın gözlemi değil kişisel kanaati', 'CMK 52'),
      ground('g_salon', 'Salonda tek kişiyle teşhis', 'CMK 217'),
    ],
  },
  court: {
    sessions: [
      courtSession('cs_1', '1. Celse', [
        ['s1_acilis', 'ACILIS', 'C1_00'],
        ['s1_savunma', 'SANIK_SAVUNMASI', 'C1_01'],
        ['s1_tanik', 'TANIK_DINLEME', 'C1_04'],
        ['s1_delil', 'DELIL_TARTISMA', 'C1_05'],
      ]),
    ],
  },
  nodes: [
    decisionNode('C1_00G', [{ to: 'C1_00G2' }], {
      ...HEAR1,
      title: 'Koridor',
      onEnter: [raise('in_court')],
      lines: B(`
C#adliye: 14 EKİM · 09.20 — BURSA ADLİYESİ, 4. KAT
N: Adliye koridoru sabahın erken saatinde bile bir istasyon gibiydi. Cübbeler, dosyalar, bir sigara kokusu ki kimse nereden geldiğini söyleyemezdi.
N: Bursa 7. Asliye Ceza’nın kapısında Sevgi bekliyordu. Yanında Tarık; Sevgi’nin koluna girmiş, onu bir sandalyeye oturtuyordu.
`),
    }),
    decisionNode('C1_00G2', [{ to: 'C1_00K' }], {
      onEnter: [ifThen(flag('nermin_baski'), [dec('pers')])],
      lines: [
        W(
          flag('nermin_baski'),
          `
N: Koridorun öbür ucunda Nermin Kurt, bir avukatla konuşuyordu. Beni görünce yüksek sesle, herkesin duyacağı biçimde dedi: “Şikâyetimi geri çekmemi isteyen avukat bu.”
N: Kâtip başını kaldırdı. Savcı da.
`,
        ),
        W(
          flag('soz_verdi'),
          `
sevgi: Vedat’a söyledim, “kazanırız” dediniz. Bu sabah ilk kez kahvaltı etti.
T: Bir söz, bir kahvaltı. Söz verdiğim adam, bugün yemek yemiş. Yarın ne yiyecek, bilmiyorum.
`,
        ),
        W(
          flag('tehdit_bildirildi'),
          `
N: Savcı Orhan Bilgiç koridorda yanımdan geçerken durdu. “Tehdit tutanağınızı gördüm avukat hanım. Numara gizliydi. Takip ediyoruz.” Sonra yürüdü.
T: Bir kâğıt, bir savcının aklında bir yer açmıştı. Küçük bir yer; ama bir yer.
`,
        ),
        O(`
N: Koridorun öbür ucunda Nermin Kurt, tek başına bir bankta oturuyordu. Elinde bir ilaç kutusu; açıp kapatıyordu.
T: Annesinin ilaçları. Bugün de götürecek. Duruşmadan sonra.
`),
      ],
    }),
    story('C1_00K', {
      ...HEAR1,
      title: 'Koridor',
      background: 'adliye',
      lines: B(`
N: Vedat merdivenlerden çıktı. Takım elbise, kravat; tırnaklarının dibi hâlâ mavi. Bana elini uzattı, sonra geri çekti.
vedat: Sabah makineye baktım. Elim titremesin diye. Kurşun harf dizdim; kendi adımı. Ters dizilir, bilir misiniz? Ayna gibi.
tarik: Amca, otur biraz. Su getireyim mi?
vedat: Otur oğlum, otur. Sen de yorgunsun. Bu aylarda dükkânı sen çevirdin.
N: Tarık Vedat’ın omzuna dokundu ve koridorun sonundaki su sebiline yürüdü.
vedat: Avukat hanım, içeride ne yapacağım? Ne diyeceğim?
`),
      choices: [
        option('C100K_A', '“Bildiğinizi anlatın. Bilmediğinizi bilmiyorum deyin.”', {
          effects: [raise('vedat_hazir')],
          responses: B(`
P: Bildiğinizi anlatın. Bilmediğinizi “bilmiyorum” deyin. Kimse sizden bir hikâye beklemiyor; doğruyu bekliyor.
vedat: Doğru. Doğru kolay. Ben kâğıt basarım; doğru basmak kolaydır, yanlış basmak zordur.
`),
          next: 'C1_00',
        }),
        option('C100K_B', '“Az konuşun. Gerisini bana bırakın.”', {
          responses: B(`
P: Az konuşun Vedat Bey. Soruları ben sorarım; siz kısa cevap verin.
vedat: Peki. Kısa. Ben zaten uzun konuşamam.
T: Bir adamın kendi sesini kısmasını istedim. Belki doğru, belki değil.
`),
          next: 'C1_00',
        }),
      ],
    }),
    court1.stage('C1_00', {
      title: 'Açılış',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onFirstEnter: [meet('hakim'), meet('savci'), meet('katip'), meet('mubasir')],
      lines: B(`
mubasir: Ateş dosyası! Vedat Ateş! Ateş dosyası, Vedat Ateş!
N: Salon küçüktü. Yüksek bir kürsü, iki sıra sandalye, duvarda “Adalet mülkün temelidir”. Pencereden gri bir ışık.
hakim: Duruşmaya başlandı. Sanık Vedat Ateş hazır, müdafii Av. Deniz Arslan hazır. Şikâyetçi Nermin Kurt hazır. Cumhuriyet Savcısı hazır.
hakim: Sanığın kimlik tespiti yapıldı. İddianame okunsun. Sayın Savcı, özetleyebilirsiniz.
savci: Sanık, annesi Hayriye Ateş’e ait Hisar’daki taşınmazı, gerçekte satış yetkisi içermeyen noter vekâletnamesinden satış yetkili sahte bir suret düzenleyerek
savci: bu sureti 18 Şubat 2026’da tapu müdürlüğünde kullanmış ve taşınmazı Erol Kılınç’a satmıştır. Tapu senedindeki imzanın sanığa ait olduğu bilirkişi raporuyla sabittir.
savci: Sanığın, sahte resmî belge düzenleme ve kullanma suçundan TCK 204/1 uyarınca cezalandırılmasını talep ediyoruz.
N: Savcı Orhan Bilgiç kısa, düz cümlelerle konuştu. Kendinden emin değildi; dosyasından emindi. Bu ikisi farklı şeyler.
hakim: Sanık, hakkınızdaki suçlamayı duydunuz. Susma hakkınız var; müdafi yardımından yararlanabilirsiniz. Savunmanızı alacağım.
`),
      choices: [cont('C100_DEVAM', 'Sanığın savunması', 'C1_01', { role: 'PRIMARY' })],
    }),
    court1.stage('C1_01', {
      title: 'Sanığın savunması',
      courtStage: 'SANIK_SAVUNMASI',
      background: 'durusma_salonu',
      witness: 'vedat',
      lines: [
        W(
          flag('vedat_hazir'),
          `
N: Vedat ayağa kalktı, ceketinin önünü ilikledi. Sesi titremiyordu; bildiğini anlatacaktı, o kadar.
`,
        ),
        O(`
N: Vedat ayağa kalktı. Bana baktı; az konuşacaktı, söz vermişti.
`),
      ],
      choices: [cont('C101_DEVAM', 'Dinle', 'C1_01X', { role: 'PRIMARY' })],
    }),
    court1.stage('C1_01X', {
      title: 'Sanığın savunması',
      courtStage: 'SANIK_SAVUNMASI',
      background: 'durusma_salonu',
      witness: 'vedat',
      lines: B(`
vedat: Sayın Hâkim. Ben o gün tapuya gitmedim. Matbaadaydım. Kimliğimi sabah bulamadım; ertesi sabah buldum. Bu kadar.
vedat: Annemin evini satmadım. Ben annemin evini… 2024’te bir laf ettim, yanlış bir laf. Ondan beri ağzıma almadım.
vedat: Bir imzam var, otuz yıllık. O imza o kâğıtta değil. Ben bilirim; kendi imzamı bilirim.
hakim: Müdafi, sanığa sorularınız?
T: Kısa ve doğru. Şimdi doğruyu kâğıda bağlayacak soruları sormalıyım.
`),
      choices: [
        option('Q_KIMLIK', '“Kimliğinizi nerede taşırsınız; o sabah ne oldu?”', {
          visibleWhen: has('clue_ceket'),
          score: { SORGULAMA: 40 },
          effects: [inc('pers')],
          responses: B(`
vedat: Ceketin iç cebinde. Ceket dükkânda kapının arkasında asılı durur. On sekiz şubat sabahı yoktu; dokuz elli ikide eşime yazdım. Ertesi sabah aynı cepteydi.
N: Hâkim not aldı. Savcı kalemini bıraktı, sonra yeniden aldı.
`),
          next: '$stay',
        }),
        option('Q_EL', '“Bir kâğıda imzanızı atar mısınız? Önce sağ, sonra sol elinizle.”', {
          visibleWhen: has('clue_sag_el'),
          score: { SORGULAMA: 50 },
          effects: [inc('pers'), raise('h1_el')],
          responses: B(`
hakim: Kâtip hanım, sanığa bir kâğıt verin. Tutanağa geçsin: sanık sağ eliyle akıcı bir imza attı.
N: Vedat kalemi sol eline geçirdi. Kâğıtta titrek bir çizgi. Kâtip güldü, sonra güldüğüne utandı.
hakim: Tutanağa geçsin: sanık sol eliyle okunaklı bir imza atamadı.
`),
          next: '$stay',
        }),
        option('Q_KURYE', '“O sabah dükkâna kim geldi?”', {
          visibleWhen: flag('fact_kurye'),
          score: { SORGULAMA: 45 },
          effects: [inc('pers')],
          responses: B(`
vedat: Kurye geldi Sayın Hâkim. Termal otelin broşürleri; beş koli. On bir buçuk dedi, erken geldi. Beraber bantladık. Terminaline imza attım.
savci: Kurye kim, saat kaç? Bunlar soruşturmada neden söylenmedi?
vedat: Kimse sormadı Sayın Savcı.
`),
          next: '$stay',
        }),
        option('Q_ANNE', '“Annenizi en son ne zaman gördünüz?”', {
          score: { SORGULAMA: 10 },
          responses: B(`
vedat.uzgun: Pazar. Her pazar. Bana Halit diyor. Ben de “efendim anne” diyorum. Evini soruyor. “Yerinde” diyorum.
N: Salonda kimse konuşmadı. Nermin Kurt başını önüne eğdi.
`),
          next: '$stay',
        }),
        cont('Q_BITIR', 'Sorularım bu kadar', 'C1_03', { role: 'PRIMARY' }),
      ],
    }),
    court1.objection('C1_03', {
      title: 'Savcının sorusu',
      courtStage: 'SANIK_SAVUNMASI',
      background: 'durusma_salonu',
      witness: 'vedat',
      say: S(`
savci: Sanık, 2024 Kurban Bayramı’nda annenizden bu evi satmasını istediniz, değil mi? Annenizin ve kız kardeşinizin karşı çıkmasına rağmen.
hakim: Müdafi?
T: Sebep. Savcının elinde imzadan başka bir şey varsa, bu.
`),
      next: 'C1_04',
      options: [
        option('C103_A', '“Müvekkil cevap verecek; olanı anlatsın.”', {
          visibleWhen: flag('fact_kavga'),
          score: { SAVUNMA_STRATEJISI: 100 },
          effects: [inc('pers')],
          good: 'Bildiğin bir zaafı saklamadın; müvekkil hazırlıklıydı ve doğruyu kendi ağzından anlattı. Sebep, eylemi ispat etmez.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
vedat: İstedim Sayın Savcı. Dükkânın borcu vardı. Annem ağladı, ablam bağırdı. Ben kalktım, gittim. Bir daha açmadım konuyu.
vedat: Bir laf ettim diye ev mi satılır? Laf ettiysem utanırım. Ama imza atmadım.
savci: Başka sorum yok.
N: Savcı oturdu. Elindeki tek kartı oynamıştı; kart masada açık duruyordu ve kimseyi korkutmuyordu.
`),
        }),
        option('C103_B', '“Müvekkil cevap verecek.”', {
          visibleWhen: not(flag('fact_kavga')),
          effects: [dec('pers')],
          neutral: 'Müvekkilin cevap vermesi doğru; ama bu konuyu önceden bilmediğin için hazırlıksız yakalandın.',
          responses: B(`
vedat.saskin: Ben… Evet. Bir kere. Borç vardı. Annem…
N: Vedat bana baktı; gözlerinde “neden bunu bilmiyordunuz” sorusu. Bilmiyordum çünkü sormamıştım.
savci: Teşekkürler. Sebep tutanağa geçsin.
`),
        }),
        option('C103_C', '“İtiraz: soru suçlamayla ilgisiz.”', {
          score: { USUL_BILGISI: -50 },
          effects: [...wrongMove],
          bad: 'Sanığın eyleme ilişkin olası sebebi suçlamayla ilgilidir; itiraz dayanaksızdı ve saklanacak bir şey var izlenimi verdi.',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Reddedildi. Sebep, suçlamayla ilgilidir. Sanık, cevaplayabilirsiniz.
vedat: İstedim. Bir kere. Sonra vazgeçtim.
T: İtirazım, cevabı daha ağır yaptı.
`),
        }),
        option('C103_D', '“Müvekkil bu soruya cevap vermeyecek.”', {
          effects: [dec('pers')],
          neutral: 'Susma hakkı kullanılabilir (CMK 147/1-e) ve aleyhe yorumlanamaz; ama hâkim yine de insandır.',
          responses: B(`
hakim: Sanık susma hakkını kullanıyor. Tutanağa geçsin.
N: Savcı hafifçe gülümsedi. Gülümsemesi tutanağa geçmedi; hâkimin gözüne geçti.
`),
        }),
      ],
    }),
    court1.testimony('C1_04', {
      title: 'Tapu memurunun dinlenmesi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'gulten',
      witnessLabel: 'TANIK · GÜLTEN YAZICI',
      rulesText: 'İpucu: önce bastır, sonra doğru delille göster. Yanlış delil güvenilirliği ve skoru düşürür.',
      objectionGrounds: ['g_telkin', 'g_kanaat', 'g_salon'],
      onFirstEnter: [meet('gulten')],
      say: S(`
mubasir: Tanık Gülten Yazıcı! Gülten Yazıcı!
N: Kırklı yaşlarında, gri bir hırka, kucağında bir dosya. Kürsüye çıktı, dosyayı kürsüye bıraktı, bir an ona dokundu; bir tılsım gibi.
hakim: Tanık hanım, kimliğiniz tespit edildi. Sanıkla akrabalığınız yok. Yemininizi edin.
gulten: Bildiğimi dosdoğru söyleyeceğime namusum ve vicdanım üzerine yemin ederim.
hakim: Olayı anlatın.
gulten: Sayın Hâkim, ben günde altmış işlem yaparım. O gün de yaptım. Vekâleten satış. Adam kimliğini verdi, sureti verdi. Sistemde sorguladım; kayıt mevcut.
gulten: Fotoğrafını çektim, imzasını aldım, senedi onayladım. Usulüne uygun. Sistem onay verdi.
savci: Sanığa bakın lütfen. O gün gişedeki kişi bu mu?
gulten: Evet. Bu.
hakim: Müdafi, sorularınız.
T: “Sistem onay verdi.” Bu cümle bir kalkan. Kalkanın arkasında dürüst bir kadın ve unutulmuş bir an var.
`),
      statements: [
        statement('G1', 1, [
          'Kimliğini verdi; kimlik onundu, ',
          hl('fotoğraf da kimlikle uyuyordu', any(flag('press_g1'), has('clue_foto_kapali'), has('ded_kimlik'))),
          '.',
        ]),
        statement('G2', 2, [
          'Sureti sistemde sorguladım; ',
          hl('vekâletname geçerliydi', any(flag('press_g2'), has('ded_suret_sahte'))),
          '.',
        ]),
        statement('G3', 3, ['İmzayı önümde attı. ', hl('Sıradan bir imzaydı', flag('press_g3')), ', herkes gibi.']),
        statement(
          'G3B',
          4,
          [
            'Kalemi aldı, bir an durdu; ',
            hl('hangi eliyle yazdığına dikkat etmedim', any(has('ded_solak'), has('clue_sivanma'), flag('h1_el'))),
            '.',
          ],
          flag('press_g3'),
        ),
        statement('G4', 5, [
          hl('Bu salondaki sanık, o gün gişedeki adamdır', any(flag('press_g4'), has('clue_foto_kapali'))),
          '.',
        ]),
        statement('G5', 6, ['Bu aileler hep mülk kavgası yapar zaten; ', hl('belliydi'), '.']),
      ],
      rules: [
        pressRule('PR_G1', 'G1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_g1')],
          responses: B(`
P: Fotoğraf çekerken yüzünü gördünüz mü? Tamamını?
gulten: Kep vardı. Gözlük. Hastaymış; soğuk almış. Çıkartmak istemedi. Sistem fotoğrafı kabul etti.
P: Sistem kabul etti. Siz kabul ettiniz mi?
gulten: Ben… Arkada otuz kişi vardı avukat hanım.
`),
        }),
        pressRule('PR_G2', 'G2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_g2')],
          responses: B(`
P: Sistemde neyi sorguladınız? Vekâletnamenin metnini mi?
gulten: Yevmiye numarasını. Noter ve tarih. Kayıt mevcut, iptal yok. Metni karşılaştırmak… o noterin işi. Biz numaraya bakarız.
T: Numara gerçek. Metin değil. Kimse metne bakmamış.
`),
        }),
        pressRule('PR_G3', 'G3', {
          score: { SORGULAMA: 50 },
          effects: [raise('press_g3')],
          responses: B(`
P: İmzayı atarken neler oldu? Acele etmeyin. Kalem neredeydi?
gulten: Kalemlik sağda durur, zincirli. Hep sağda. Aldı. Sonra… bir an durdu. Kalemi tartar gibi. Sonra yazdı.
gulten: Hangi eliyle… dikkat etmedim. Günde altmış imza avukat hanım. Kimse bana bunu sormadı.
T: Kimse sormadı. Ben soruyorum.
`),
        }),
        pressRule('PR_G4', 'G4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_g4')],
          responses: B(`
P: Gişedeki adamın yüzünü bugün hatırlıyor musunuz, yoksa sanığı salonda gördüğünüz için mi “bu” diyorsunuz?
gulten: Boyu… boyu aynı. Yapısı. Kep vardı ama. Gözlük. Sayın Savcı “bu mu” diye sorunca… Evet dedim.
`),
        }),
        pressRule('PR_G5', 'G5', {
          score: { SORGULAMA: 10 },
          responses: B(`
gulten: Öyle demek istemedim. Yani… tapuda çok görüyoruz. Aileler. Kardeşler.
`),
        }),
        presentRule('PS_G1_KIMLIK', 'G1', ['ded_kimlik'], {
          effects: once('contra_g1', 200, [inc('pers')]),
          good: 'Kimlik gerçekti ama o sabah sahibinde değildi: gişedeki kimlik, gişedeki kişiyi ispat etmez.',
          category: 'SORGULAMA',
          responses: B(`
P: Sayın Hâkim, sanığın 18 Şubat 09.52’de eşine attığı mesaj: “Kimliğimi bulamıyorum.” Tapuda kimlik 11.22’de kullanıldı. Ertesi sabah sanığın ceketindeydi.
P: Tanık hanım, kimliğin kimde olduğunu biliyorsunuz. Kimin elinde olduğunu biliyor musunuz?
gulten: Ben… kimliğe bakarım. Kimlik doğruydu.
hakim: Tutanağa geçsin: sanık kimliğini olay sabahı kaybettiğini o saatte yazılı olarak bildirmiş.
`),
        }),
        presentRule('PS_G1_SENET', 'G1', ['ev_senet'], {
          visibleWhen: has('clue_foto_kapali'),
          enabledWhen: has('clue_foto_kapali'),
          effects: once('contra_g1', 200, [inc('pers')]),
          good: 'Senet fotoğrafında yüzün üst yarısı kep ve gözlükle örtülü: “fotoğraf kimlikle uyuyordu” beyanı dayanaksız.',
          category: 'SORGULAMA',
          responses: B(`
P: Sayın Hâkim, senedin fotoğrafı. Kep siperi alnı, koyu cam gözleri, atkı çeneyi örtüyor. Tanık hanım, bu fotoğraf neyle uyuyor?
gulten: Burun… ağız. Sistem kabul etti.
hakim: Sistem değil tanık hanım, siz. Bu fotoğrafla kimliği karşılaştırdınız mı?
gulten: …Hayır. Karşılaştırdığımı sandım.
`),
        }),
        presentRule('PS_G2', 'G2', ['ded_suret_sahte'], {
          effects: once('contra_g2', 300, [inc('pers', 2)]),
          good: 'Tapu yalnızca yevmiye numarasını sorgulamış; noterin arşiv nüshasında satış yetkisi yok. Suret asıldan kopyalanıp değiştirilmiş.',
          category: 'SORGULAMA',
          responses: B(`
P: Sayın Hâkim, Bursa 14. Noterliği’nin arşiv nüshası. Aynı yevmiye numarası. Yetkiler: banka, maaş, kira, abonelikler. Satış yok.
P: Suretteki mühür ise ıslak değil; toner. Tanık hanım, sistem size numaranın gerçek olduğunu söyledi. Metnin gerçek olduğunu söyledi mi?
gulten.saskin: Hayır. Sistem metni bilmez. Biz… biz numaraya güveniriz.
savci: Sayın Hâkim, suretin sahte olduğu zaten iddianamenin konusu.
P: Sahte olduğu konu Sayın Savcı. Kimin sahtelediği konu değil; henüz.
`),
        }),
        presentRule('PS_G3B', 'G3B', ['ded_solak'], {
          maxUses: 1,
          score: { SORGULAMA: 300 },
          effects: [raise('contra_g3'), inc('pers', 2), { type: 'GOTO', node: 'C1_04K' }],
          good: 'Senetteki mürekkep sol eli gösteriyor; sanık sağlak. Tanık kalemin öbür ele geçtiğini hatırladı.',
          category: 'SORGULAMA',
          responses: B(`
P: Sayın Hâkim, senedin büyütülmüş imzası. Mürekkep sağa doğru sıvanmış; yazan elin kenarı ıslak mürekkebin üstünden geçmiş.
P: Sanık, bu salonda tutanağa geçtiği gibi, sağ eliyle yazıyor. Tanık hanım: kalemi aldı, bir an durdu. Sonra ne yaptı?
`),
        }),
        presentRule('PS_G3_ERKEN', 'G3', ['ded_solak'], {
          effects: once('press_g3x', 100),
          neutral: 'Kısmi: çıkarım doğru ama tanık henüz o anı hatırlamıyor. Önce bastır.',
          responses: B(`
gulten: Sıvanma mı? Ben mürekkebe bakmam avukat hanım. Bilemem.
T: Doğru delil, erken an. Önce tanığın hafızasını açmam gerek.
`),
        }),
        presentRule('PS_G4', 'G4', ['ev_senet'], {
          visibleWhen: has('clue_foto_kapali'),
          enabledWhen: has('clue_foto_kapali'),
          effects: once('contra_g4', 200, [inc('pers')]),
          good: 'Yüzü örtülü bir adamı beş ay sonra salonda tek sanık üzerinden tanımak teşhis değildir.',
          category: 'SORGULAMA',
          responses: B(`
P: Senedin fotoğrafı yine. Bu yüzü beş ay sonra hatırlıyorsunuz. Yüzün yarısını görmediğiniz bir adamı.
gulten: Ben… Savcı bey sorunca… Salonda bir tek o oturuyordu.
`),
        }),
        objectRule('OB_G4', 'G4', 'g_salon', {
          effects: [
            ifThen(not(flag('ob_g4')), [raise('ob_g4'), score('USUL_BILGISI', 100), inc('legal_hits'), inc('pers')]),
          ],
          good: 'İtiraz yerinde: sanık sandalyesindeki tek kişiyi göstererek yapılan salon teşhisi telkin edicidir; ispat değeri zayıftır (CMK 217).',
          category: 'USUL_BILGISI',
          responses: B(`
P: İtiraz ediyorum Sayın Hâkim. Tanığa sanık sandalyesindeki tek kişi gösterilerek “bu mu” diye soruldu. Bu bir teşhis değil, bir telkin.
hakim: Not edildi. Salon teşhisinin değeri takdirde gözetilecek. Tanık hanım, bugün değil o gün ne gördüğünüzü anlatın.
`),
        }),
        objectRule('OB_G5', 'G5', 'g_kanaat', {
          effects: [ifThen(not(flag('ob_g5')), [raise('ob_g5'), score('USUL_BILGISI', 50), inc('legal_hits')])],
          good: 'İtiraz yerinde: “bu aileler hep kavga eder” bir gözlem değil, kanaat.',
          category: 'USUL_BILGISI',
          responses: B(`
P: İtiraz ediyorum. Tanık gözlemini değil, aileler hakkındaki kanaatini anlatıyor.
hakim: Yerinde. Tanık hanım, yalnızca gördüklerinizi. Bu cümle tutanağa geçmeyecek.
`),
        }),
        presentRule('PS_G2_BASKI', 'G2', ['ded_baski'], {
          maxUses: 3,
          effects: [...wrongMove, score('SORGULAMA', -100, 'hatali')],
          bad: 'Suretin müvekkilinin matbaasında basıldığını savcılığa kendi elinle gösterdin; kimin bastığını bilmeden.',
          category: 'SORGULAMA',
          responses: B(`
savci: Sayın Hâkim, müdafi suretin sanığın işyerindeki yazıcıdan çıktığını söylüyor. Teşekkür ederiz; tutanağa geçsin.
T: Leyla uyarmıştı: bilmeden kürsüye götürme. Götürdüm.
`),
        }),
        presentRule('PS_SAVCILIK', undefined, ['ev_rapor1', 'ev_makbuz', 'ev_suret'], {
          maxUses: 10,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'Savcılığın delilini savcılık tanığına gösterdin; hiçbir çelişki ortaya koymadı.',
          category: 'SORGULAMA',
          responses: B(`
savci: Sayın Hâkim, müdafi bizim delilimizi bizim tanığımıza okuyor. Teşekkür ederiz.
T: Kendi kalemime kendim mürekkep döktüm.
`),
        }),
      ],
      presentMiss: fallback('FB_C1_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil: −1 güvenilirlik, −150 skor.', category: 'SORGULAMA' },
        responses: B(`
hakim: Bu delilin beyanla ilgisini göremedim müdafi.
T: Yanlış kapıya vurdum. Ses salonda yankılandı.
`),
      }),
      objectMiss: fallback('FB_C1_OBJECT', 'OBJECT', {
        effects: [dec('cred'), inc('wrong'), score('USUL_BILGISI', -50, 'hatali')],
        quality: { q: 'BAD', feedback: 'Dayanaksız itiraz.', category: 'USUL_BILGISI' },
        responses: B(`
hakim: İtiraz reddedildi. Dayanağı yok.
`),
      }),
      finish: { id: 'C104_BITIR', next: 'C1_05' },
    }),
    court1.stage('C1_04K', {
      title: 'Öbür el',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'gulten',
      lines: B(`
N: Gülten Yazıcı gözlerini kapadı. Bir an. Kâtip yazmayı bıraktı.
gulten: Kalemi aldı. Sağdan. Sonra… durdu. Kalemi öbür eline geçirdi. Sol eline. Ben “zincir kısa gelecek” diye düşündüm. Zincir gerildi.
gulten.saskin: Zincir gerildi Sayın Hâkim. Kalemlik sağda, adam solla yazınca zincir gerilir. Hep gerilir. O gün de gerildi; şimdi hatırladım.
N!shake: Salonda bir uğultu. Hâkim tokmağa dokunmadı; bakmakla yetindi.
N: Vedat sağ elini masanın üstüne koydu. Uzun uzun ona baktı; kendi elini ilk kez görüyormuş gibi.
hakim: Tutanağa geçsin: tanık, işlemi yapan kişinin imzayı sol eliyle attığını, kalemlik zincirinin gerildiğini hatırladığını beyan etti.
savci: Sayın Hâkim, tanığın beş ay sonraki hatırlaması…
hakim: Not edildi Sayın Savcı. Tartışmayı delillerin değerlendirmesine bırakıyorum.
T: Bir zincir. Bir kalemlik. Kimsenin sormadığı bir soru. Bir memurun hafızasında beş ay bekleyen bir gerilme.
`),
      choices: [cont('C104K_DEVAM', 'Devam', 'C1_04', { role: 'PRIMARY' })],
    }),
    court1.objection('C1_05', {
      title: 'Bilirkişi raporu',
      courtStage: 'DELIL_TARTISMA',
      background: 'durusma_salonu',
      prosecutionEvidence: 'ev_rapor1',
      say: S(`
hakim: Dosyadaki grafoloji raporu okundu. Rapora göre senetteki imza, mukayese belgelerindeki imzalarla aynı elin ürünüdür. Müdafi, rapora diyeceğiniz?
T: Rapor kalın harflerle konuşuyor. Ama raporun bir de eki var; eki kimse yüksek sesle okumadı.
`),
      next: 'C1_06',
      options: [
        option(
          'C105_A',
          '“Mukayese belgeleri özel belge ve iki ayrı elden; resmî imzalarla Adli Tıp’tan yeni rapor istiyoruz.”',
          {
            visibleWhen: has('ded_mukayese'),
            score: { USUL_BILGISI: 150 },
            effects: [raise('h1_bilirkisi'), inc('legal_hits'), inc('pers', 2)],
            good: 'Mukayese imzası tartışmasız olmalıdır: resmî makam önünde atılmış ya da sanıkça kabul edilmiş imzalar gerekir. Kaynağı ve sahibi belirsiz özel belgelerle yapılan inceleme yenilenmelidir (CMK 63, 67/5).',
            category: 'USUL_BILGISI',
            responses: B(`
P: Sayın Hâkim, rapor yanlış bir şey söylemiyor; yanlış bir soruya cevap veriyor. Mukayese belgelerinin yirmisi de özel belge: irsaliye ve kargo fişi.
P: Hiçbiri resmî bir makam önünde atılmamış; sanık bu imzaları kabul etmiyor. Üstelik irsaliyelerde iki ayrı el var; karbonları dosyaya sunuyoruz.
P: Senetteki imza, irsaliyeleri imzalayan elle aynı olabilir. O elin sanığın eli olduğu ispat edilmemiştir.
P: Noter imza beyannamesi, banka imza kartonu ve nüfus kaydındaki imzalarla Adli Tıp Kurumu’ndan yeni inceleme talep ediyoruz.
savci: Sayın Hâkim… Talebe karşı bir diyeceğimiz yok. Belgelerin niteliği tartışmaya açık.
hakim: Kabul edildi.
`),
          },
        ),
        option('C105_A2', '“Mukayese belgeleri tartışmalı; resmî imzalarla Adli Tıp’tan yeni rapor istiyoruz.”', {
          visibleWhen: not(has('ded_mukayese')),
          score: { USUL_BILGISI: 60 },
          effects: [raise('h1_bilirkisi'), inc('pers')],
          good: 'Yeni bilirkişi talebi yerinde (CMK 63, 67/5); ama mukayese malzemesinin neden güvenilmez olduğunu somut gösteremedin.',
          category: 'USUL_BILGISI',
          responses: B(`
P: Sayın Hâkim, mukayese belgeleri sanığın kabul ettiği ya da resmî makam önünde attığı imzalar değil. Resmî imzalarla yeni inceleme talep ediyoruz.
hakim: Belgelerin neden güvenilmez olduğuna ilişkin somut bir şey var mı müdafi?
P: Kaynağı belirsiz, Sayın Hâkim.
hakim: Talep, imzanın tek delil olduğu gözetilerek kabul edildi. Ama somut olun; mahkeme her rapora yeni rapor yazdırmaz.
`),
        }),
        option('C105_B', '“Rapor hukuka aykırı delildir; dosyadan çıkarılsın.”', {
          score: { USUL_BILGISI: -50 },
          effects: [...wrongMove],
          bad: 'Rapor hukuka aykırı yöntemle elde edilmiş değildir; güvenilirliği tartışılır, yasak delil sayılmaz (CMK 206/2-a, 217/2 ayrımı).',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Rapor hukuka aykırı bir yöntemle elde edilmemiş müdafi. İçeriğini tartışabilirsiniz; varlığını değil. Talep reddedildi.
`),
        }),
        option('C105_C', '“Bilirkişinin duruşmada dinlenmesini istiyoruz.”', {
          score: { USUL_BILGISI: 20 },
          effects: [raise('h1_bilirkisi_dinle')],
          neutral:
            'Bilirkişi açıklama için dinlenebilir (CMK 67, 68); ama mukayese malzemesi değişmedikçe sonuç da değişmez.',
          responses: B(`
hakim: Bilirkişi bir sonraki celsede dinlenebilir. Ama aynı belgelere bakıp aynı şeyi söyleyecektir müdafi. Bunu biliyorsunuz.
T: Biliyordum. Aynı kâğıt, aynı cevap.
`),
        }),
        option('C105_D', '“Rapora bir diyeceğimiz yok.”', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('pers')],
          bad: 'Davanın tek ağır delili olan rapora hiçbir itiraz etmedin; mahkeme raporu tartışmasız sayar.',
          category: 'USUL_BILGISI',
          responses: B(`
savci: Teşekkür ederiz.
N: Vedat bana döndü. Hiçbir şey söylemedi. Söylemesine gerek yoktu.
`),
        }),
      ],
    }),
    court1.stage('C1_06', {
      title: 'Delil talepleri',
      courtStage: 'DELIL_TARTISMA',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('dil_verildi'),
          `
hakim: Müdafiin duruşmadan önce verdiği delil talebi dilekçesi okundu. Talepler gerekçeli; kabulüne karar verdim. Müzekkereler yazılsın.
hakim: Başka talebiniz var mı müdafi?
`,
        ),
        O(`
hakim: Dosyada müdafiin bir delil talebi dilekçesi yok. Sözlü talepleriniz varsa alalım müdafi.
T: Dilekçeyi vermemiştim. Şimdi her şeyi tek tek, sözlü, sayarak istemem gerekiyor.
`),
      ],
      choices: [
        option('T_BILIRKISI', 'Resmî imzalarla Adli Tıp’tan yeni rapor', {
          visibleWhen: not(any(flag('dil_bilirkisi'), flag('h1_bilirkisi'))),
          score: { USUL_BILGISI: 30 },
          effects: [raise('h1_bilirkisi')],
          neutral: 'Yeni bilirkişi talebi yerinde (CMK 63, 67/5); ama gerekçesiz. Mahkeme yine de kabul etti.',
          responses: B(`
hakim: Kabul. İmza bu dosyanın tek ağır delili; sağlam olsun.
`),
          next: '$stay',
        }),
        option('T_KARGO', 'Kargo şirketinden 18 Şubat teslim kaydı', {
          visibleWhen: all2('clue_takvim', 'dil_kargo'),
          score: { USUL_BILGISI: 30 },
          effects: [raise('h1_kargo')],
          good: 'Mazereti bağımsız bir kayda bağlayan talep (CMK 177, 332).',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Kabul. Kargo şirketine yazı yazılsın; terminal kaydı ve konum dökümü istensin.
`),
          next: '$stay',
        }),
        option('T_RANDEVU', 'Tapu randevu kaydı ve teyit araması', {
          visibleWhen: {
            all: [
              { not: { flag: 'dil_randevu' } },
              { any: [{ flag: 'fact_randevu_tel' }, { hasEvidence: 'clue_senet_saat' }] },
            ],
          },
          score: { USUL_BILGISI: 30 },
          effects: [raise('h1_randevu')],
          good: 'İşlemi kimin yaptırdığının izini süren talep (CMK 177, 332).',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Kabul. Tapu müdürlüğünden randevu kaydı ve arayan numara istensin.
`),
          next: '$stay',
        }),
        option('T_TUTANAK', 'Mukayese belgelerinin asıl teslim tutanağı', {
          visibleWhen: all2('clue_tutanak_ad', 'dil_tutanak'),
          score: { USUL_BILGISI: 30 },
          effects: [raise('h1_tutanak')],
          good: 'Mukayese malzemesinin kaynağını soran talep (CMK 177).',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Kabul. Kolluktan asıl tutanak istensin.
`),
          next: '$stay',
        }),
        option('T_TUTUK', 'Şikâyetçinin yeniden dinlenmesi', {
          score: { USUL_BILGISI: -20 },
          neutral: 'Şikâyetçi işlem anında orada değildi; yeniden dinlenmesi yeni bir şey getirmez.',
          responses: B(`
hakim: Şikâyetçi tapuda değildi müdafi. Neyi anlatacak? Reddedildi.
`),
          next: '$stay',
        }),
        cont('T_BITIR', 'Taleplerimiz bu kadar', 'C1_ARA', { role: 'PRIMARY' }),
      ],
    }),
    decisionNode('C1_ARA', [{ to: 'C1_ARA2' }], {
      ...court1.base,
      title: 'Ara karar',
      lines: B(`
hakim: Ara karar. Bir: istenen kayıt ve belgeler için müzekkereler yazılmasına. İki: sanık hakkındaki adli kontrol tedbirinin devamına.
hakim: Üç: duruşmanın 4 Kasım günü saat 10.00’a ertelenmesine. Taraflar hazır; ayrıca tebligata gerek yok.
`),
    }),
    decisionNode('C1_ARA2', [{ to: 'ARA_GIRIS_1' }], {
      lines: [
        W(
          flag('contra_g3'),
          `
N: Koridorda Vedat duvara yaslandı ve sağ elini havaya kaldırdı, bir öğrencinin parmak kaldırması gibi.
vedat: Sol el. Sol el! Ben sol elimle çatal tutamam avukat hanım. Duydunuz mu? Zincir gerilmiş.
N: Sevgi onun elini indirdi, avucunun içinde tuttu. Tarık koridorun ucunda, telefonuna bakıyordu. Bir an başını kaldırdı, sonra yeniden telefona eğildi.
T: Bir salon, bir zincir, bir sol el. Bugün bir şey değişti. Ne değiştiğini henüz kimse tam bilmiyor; ben de.
`,
        ),
        O(`
N: Koridorda Vedat bir şey söylemedi. Sevgi kolunu tuttu. Tarık su getirdi; Vedat içmedi.
vedat: Üç hafta daha. Üç hafta daha bu adla yaşayacağım. Sahtekâr Vedat.
T: Üç hafta. Bir imzayı sahibinden ayırmak için üç hafta.
`),
      ],
    }),
  ],
};

function all2(clueId: string, dilFlag: string) {
  return { all: [{ hasEvidence: clueId }, { not: { flag: dilFlag } }] };
}
