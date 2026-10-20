import {
  all,
  any,
  atLeast,
  choiceNode,
  cmp,
  cont,
  courtSession,
  dec,
  decisionNode,
  fallback,
  flag,
  goto,
  has,
  hl,
  ifThen,
  inc,
  meet,
  not,
  objectRule,
  option,
  presentRule,
  pressRule,
  raise,
  ref,
  score,
  statement,
  story,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, Effect } from '../../../tools/content/src/kit/index.js';
import { B, O, T, W } from './dsl.js';
import { H2, court2, wrongMove } from './shared.js';

// 68-trial-2: 2. celse. Koridor, açılış (sahte ikrar yolunda sanığın beyanı), adli tıp uzmanı, baş tanık Tarık Sezer
// (T0–T6), garson Cansu, savcının Leyla’yı tanık olarak çağırma talebi (CMK 46), ara karar ve tahliye, koridor.

const breakIfShaken: Effect = ifThen(all(ref('tarik_sarsildi'), not(visited('T2_02K'))), [goto('T2_02K')]);

const savcilikDelili2 = ['ev_bicak', 'ev_mesaj_pzt', 'ev_suleyman_ifade', 'ev_tas_fis', 'ev_otopsi', 'ev_tarik_ifade'];

export const trial2: CasePart = {
  predicates: [
    {
      id: 'tarik_sarsildi',
      label: 'Baş tanığın anlatımı en az üç noktada çöktü',
      when: atLeast(
        3,
        flag('contra_t0'),
        flag('contra_t1'),
        flag('contra_t2'),
        flag('contra_t3'),
        flag('contra_t4'),
        flag('contra_t5'),
        flag('contra_t6'),
      ),
    },
  ],
  court: {
    sessions: [
      courtSession('cs_2', '2. Celse', [
        ['s2_acilis', 'ACILIS', 'T2_00'],
        ['s2_bilirkisi', 'DELIL_TARTISMA', 'T2_01'],
        ['s2_tanik', 'TANIK_DINLEME', 'T2_02'],
      ]),
    ],
  },
  nodes: [
    decisionNode('T2_00G_1', [{ to: 'T2_00G_2' }], {
      ...H2,
      title: 'Koridor',
      onEnter: [raise('in_court'), ifThen(any(flag('tarik_uyarildi'), flag('tarik_uyarildi2')), [dec('pers')])],
      lines: B(`
# 10 MART · 09.20 — BURSA ADLİYESİ, 4. KAT [bg:adliye]
> Koridorda bir ses yoktu; herkes alçak sesle konuşuyordu. Ağır Ceza koridorlarında bir duruşma büyüdükçe sesler küçülür.
`),
    }),
    decisionNode('T2_00G_2', [{ to: 'T2_00' }], {
      onFirstEnter: [meet('sema')],
      lines: [
        W(
          any(flag('tarik_uyarildi'), flag('tarik_uyarildi2')),
          `
> Tarık Sezer, koyu bir takım elbiseyle, katılan sırasının yanında durmuş Gülay Toker’in elini tutuyordu. Bir ara bana döndü, başını hafifçe eğdi. Hazırlıklı bir adamın selamı.
~ Ona bir soru vermiştim. O soruyu bir gece boyunca çevirdi, cevabını cilaladı. Bugün o cilayı göreceğim.
`,
        ),
        O(`
> Tarık Sezer, koyu bir takım elbiseyle, katılan sırasının yanında durmuş Gülay Toker’in elini tutuyordu. Herkesin adını biliyordu: kâtibin, mübaşirin, jandarmanın. Bana döndü, başını eğdi.
`),
      ],
    }),
    court2.stage('T2_00', {
      title: 'Duruşma · 2. Celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      lines: [
        W(
          any(has('ev_kentkart'), has('ev_dvr'), has('ev_z'), has('ev_sesli')),
          `
recep: Emir Yalçın dosyası! Hım-hım.
# BURSA 3. AĞIR CEZA MAHKEMESİ — 2. CELSE [bg:durusma_salonu]
baskan: Duruşmaya devam olundu. Tutuklu sanık, müdafii, katılan hazır. Tanık Tarık Sezer ve adli tıp uzmanı Dr. Sema Ilgaz hazır.
baskan: Önceki celsede istenen kayıtların geldiği görüldü, okundu, dosyaya konuldu. Taraflara örnekleri verildi.
> Savcı Karaman önündeki kayıtları tek tek çevirdi. Bir sayfada durdu; uzun süre.
`,
        ),
        O(`
recep: Emir Yalçın dosyası! Hım-hım.
# BURSA 3. AĞIR CEZA MAHKEMESİ — 2. CELSE [bg:durusma_salonu]
baskan: Duruşmaya devam olundu. Tutuklu sanık, müdafii, katılan hazır. Tanık Tarık Sezer ve adli tıp uzmanı Dr. Sema Ilgaz hazır.
~ Dosyaya yeni bir kâğıt girmedi. Elimde savcının kâğıtları ve kendi aklım var.
`),
      ],
      choices: [cont('T200_DEVAM', 'Devam', 'T2_00R', { role: 'PRIMARY' })],
    }),
    decisionNode('T2_00R', [{ when: flag('ikrar_onerisi'), to: 'T2_IKRAR' }, { to: 'T2_01' }]),
    story('T2_IKRAR', {
      ...H2,
      title: 'Sanığın beyanı',
      background: 'durusma_salonu',
      hud: ['cred', 'pers'],
      onEnter: [raise('sahte_ikrar')],
      lines: B(`
baskan: Sanık söz istiyormuş. Buyurun.
> Emir ayağa kalktı. Bana bakmadı. Babasına baktı; Kemal başını eğdi. Meral’in elindeki dikiş iğnesi durdu.
emir: Ben… ben yaptım Sayın Başkan. Babamı yaktığını söyledi. Delirdim. Bıçağı aldım. Hatırlamıyorum. Planlamadım. Delirdim.
> Salon sustu. Savcı Karaman kalemini bıraktı. Gülay Toker iki elini yüzüne kapadı.
baskan: Sanık, bunu kendi isteğinizle mi söylüyorsunuz? Bıçağı nereden aldınız? Kaç kez vurdunuz?
emir: Tezgâhtan… Bir kere. Hatırlamıyorum. Yaptım.
> Üye Pınar Yener sanığa uzun uzun baktı; sonra bana. Bir soru soran bir bakış.
> Salonun arkasında bir kapı açıldı, kapandı. Leyla çıkmıştı.
~ “Hatırlamıyorum.” Yapmadığı bir şeyi anlatamayan bir çocuk, onu ikrar etti. Benim cümlemle.
`),
      choices: [cont('T2IKRAR_DEVAM', 'Devam', 'T2_01', { role: 'PRIMARY' })],
    }),
    choiceNode('T2_01', {
      ...H2,
      title: 'Adli tıp uzmanı',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
> Dr. Sema Ilgaz kürsüye bir dosyayla çıktı; gözlüğünü burnunun ucuna indirdi. Yemin etti; raporunu özetledi: tek darbe, sol göğüs, ölüm zamanı geniş bir aralık.
sema: Ben bir yarayı anlatırım Sayın Başkan. Bir insanı değil. Lütfen bana insan sormayın; yara sorun.
baskan: Müdafi, uzmana sorularınız.
`),
      choices: [
        option('AQ_SAAT', '“Ölüm zamanını daraltabilir misiniz?”', {
          score: { SORGULAMA: 20 },
          responses: B(`
sema: Vücut ısısıyla 23.30 ile 01.00 arası. Daha dar söylersem bilim değil tahmin olur. Saat sizin kayıtlarınızda; benim termometremde değil.
`),
          next: '$stay',
        }),
        option('AQ_EL', '“Yara kanalı saldırganın hangi eliyle uyumlu?”', {
          visibleWhen: any(flag('fact_solak'), flag('fact_solak_emir')),
          score: { SORGULAMA: 40 },
          effects: [inc('pers'), raise('arg_el')],
          good: 'Uzmanın raporundaki yönü sanığın solaklığıyla karşılaştırdın; kesin olmayan ama dürüst bir “muhtemel” aldın (CMK 67: bilirkişi görüşünün sınırları).',
          category: 'SORGULAMA',
          responses: B(`
sema: Kanal soldan sağa ve aşağı doğru. Karşıdan gelen, sağ elle tutulan bir bıçakla en uyumlu yön bu. Sol elle de olabilir; daha zorlayıcı bir açı ister.
sema: “Muhtemel” diyorum avukat hanım. Bunun altını çizin; üstünü değil.
> Üye Pınar Yener sanığa baktı. Emir, farkında olmadan, sol eliyle su bardağını aldı.
`),
          next: '$stay',
        }),
        option('AQ_KAN', '“Tek darbede saldırgana kan bulaşır mı?”', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_kan_beklenir')],
          responses: B(`
sema: Tek darbede sıçrama sınırlı olabilir. Ama bıçağı tutan elin, bileğin, çoğunlukla kolun yeni kanla teması beklenir. Sanığın giysilerinde kan yok; bu bir bulgudur, bir hüküm değil.
sema: Maktule sonradan sarılan biri ise… ön yüzünde, göğsünde ve kollarında belirgin bir kan izi taşır. Bunu da söyleyeyim, soran olursa.
`),
          next: '$stay',
        }),
        option('AQ_KESIN', '“Sanığın yapmadığını söyleyebilir misiniz?”', {
          score: { SORGULAMA: -30 },
          effects: [dec('pers')],
          bad: 'Bilirkişiye hukuki bir değerlendirme sordun; uzman yalnızca teknik konuda görüş bildirir (CMK 63/1, 67). Cevap aleyhine döndü.',
          category: 'SORGULAMA',
          responses: B(`
sema: Hayır. Ben bir yarayı anlatırım, bir insanı değil. Yapmadığını söyleyemem; yaptığını da.
> Savcı başını salladı; memnun.
`),
          next: '$stay',
        }),
        cont('AQ_BITIR', 'Sorularım bu kadar', 'T2_02', { role: 'PRIMARY' }),
      ],
    }),
    court2.testimony('T2_02', {
      title: 'Baş tanığın dinlenmesi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'tarik',
      witnessLabel: 'TANIK · TARIK SEZER',
      rulesText: 'İpucu: önce bastır, sonra doğru delille göster. Yanlış delil güvenilirliği ve skoru düşürür.',
      objectionGrounds: ['g_telkin', 'g_kanaat', 'g_duyum'],
      say: T(`
recep: Tanık Tarık Sezer! Hım-hım.
> Tarık Sezer kürsüye yürüdü; adımları ölçülü, ceketinin düğmesini kürsüye varınca ilikledi. Yemin ederken sesi titremedi.
baskan: Tanık, kimliğinizi söyleyin.
tarik: Tarık Sezer. Kırk beş yaşındayım. Gemlik doğumluyum, Mudanya’da oturuyorum. Toker Balık’ın ortağıyım; ortağıydım.
baskan: Sanıkla akrabalığınız, husumetiniz var mı?
tarik: Yok efendim. Çalışanımızdı. Severdim.
> Savcı sorularını sordu; Tarık hepsini kolluk ifadesiyle aynı cümlelerle, aynı sırayla cevapladı. Ezber değil; ama eksiksiz.
baskan: Müdafi, sorularınız.
~ Leyla’nın sesi: “Yalan söyleyen tanık ayrıntı ekler.” Bu adam hiçbir şey eklemiyor. Hiçbir şey eksiltmiyor da.
`),
      statements: [
        statement('T0', 0, [
          'Emir bütün hafta kin güdüyordu; çarşamba bıçağını bileyledi, cuma kapanışta gitmeyip bekledi. ',
          hl('Ercan da bana “bu çocuk bir şey yapacak” demişti', any(flag('fact_duyum'), flag('press_t0'))),
          '.',
        ]),
        statement('T1', 1, [
          'O gece 23.30’dan itibaren kasadaydım; ',
          hl('23.55 gibi ofisten bağırış duydum', any(flag('press_t1'), has('ded_saat'), has('ded_yol'), has('clue_kent'), flag('contra_s2'))),
          '.',
        ]),
        statement('T2', 2, [
          'Emir ofisten koşarak çıktı; ',
          hl('elinde bıçak, önlüğünde kan vardı', any(flag('press_t2'), has('ded_onluk'), has('ded_bicak_yeri'), flag('contra_s4'), has('ded_canli'))),
          '.',
        ]),
        statement('T3', 3, [
          'Korktum. ',
          hl('00.15’e kadar sayımı bitirdim', any(flag('press_t3'), has('clue_z'), has('ded_kasa'))),
          '; sonra ofise girip Ercan’ı yerde buldum.',
        ]),
        statement('T4', 4, [hl('Kamera sistemi üç gündür arızalıydı', any(flag('press_t4'), has('clue_dvr'), has('ded_kamera'))), '; servis çağırmıştık.']),
        statement('T5', 5, [hl('Sanığın ailesini tanımam', any(flag('press_t5'), has('ded_mektup'))), '; Ercan’ın eski meselelerinden haberim yoktu.']),
        statement(
          'T6',
          6,
          ['Ercan’ı yerde görünce ona sarıldım; ', hl('üstüm başım kan oldu', any(has('ded_gomlek'), has('clue_lacivert'), flag('fact_kan_beklenir'))), '. Polise öyle anlattım.'],
          flag('press_t3'),
        ),
      ],
      rules: [
        pressRule('PR_T0', 'T0', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_t0')],
          responses: B(`
- Bileme ve bekleme. Bunları siz mi gördünüz?
tarik: Şef söyledi taşı. Beklemeyi ben gördüm; kapanışta ofisin önünde dolanıyordu. Ercan da bana söylemişti zaten: “Bu çocuk bir şey yapacak.”
`),
        }),
        pressRule('PR_T1', 'T1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_t1')],
          responses: B(`
- 23.55. Saate baktınız mı?
tarik: Kasanın ekranında saat yazar avukat hanım. Baktım. 23.55. Bir de… bir de telefonuma baktım galiba. Kesin 23.55.
~ İki saat kaynağı, bir kesinlik. İfadede yoktu bu. Ayrıntı ekliyor.
`),
        }),
        pressRule('PR_T2', 'T2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_t2')],
          responses: B(`
- Bıçağı hangi elinde gördünüz? Önlükteki kan neredeydi?
tarik: Sağ elinde. Yok, sol… Sol elinde. Önlüğün göğsünde. Kocaman bir leke. Koridor karanlıktı ama gördüm; mutfaktan ışık geliyordu.
`),
        }),
        pressRule('PR_T3', 'T3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_t3')],
          responses: B(`
- Bağırıştan sonra yirmi dakika sayım yaptınız. Korktuğunuz hâlde?
tarik: Şoktaydım. Ne yapacağımı bilmiyordum; elim parayı saydı. Sonra gittim, kapıyı açtım… Ercan yerdeydi. Sarıldım ona. Üstüm başım kan oldu.
> Bir an durdu. Ceketinin düğmesine dokundu.
`),
        }),
        pressRule('PR_T4', 'T4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_t4')],
          responses: B(`
- Servis ne zaman çağrıldı?
tarik: Salı. Pazartesi… Hafta başı. Servis firması gelmedi; Mudanya’ya gelmezler kolay kolay. Telefonla aradım.
`),
        }),
        pressRule('PR_T5', 'T5', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_t5'), raise('fact_tarik_gemlik')],
          responses: B(`
- Ercan Bey’in yirmi iki yıl önceki öğrenci evini hiç duymadınız mı?
tarik: Duydum… yani Ercan anlatırdı. Görükle’deki ev. Bir kere gitmişimdir belki, misafir. Ben öğrenci değildim. Gemlik’ten gelir giderdim.
> Salonun arkasında biri doğruldu. Kemal. Yüzü bembeyazdı.
~ Gemlik’ten gelir giderdi. Bir bodrum katında, hafta sonları. Kemal’in sesi kulağımda: “Gemlikli derdik.”
`),
        }),
        objectRule('OB_T0', 'T0', 'g_duyum', {
          score: { SORGULAMA: 50 },
          effects: [inc('pers'), inc('legal_hits')],
          good: 'İtiraz yerinde: tanık ölmüş birinden duyduğunu aktarıyor; bir tanık gördüğünü anlatır (CMK 210 ruhu; değerlendirme CMK 217).',
          category: 'SORGULAMA',
          responses: B(`
- İtiraz ediyorum Sayın Başkan. Tanık ölen birinden duyduğunu aktarıyor; kendi gözlemi değil.
baskan: Tutanağa tanığın kendi gözlemi olmadığı notuyla geçsin. Tanık, gördüklerinizi anlatın.
tarik: Tabii efendim. Özür dilerim.
`),
        }),
        presentRule('PS_T0', 'T0', ['ded_davet', 'ded_bileme'], {
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_t0'), breakIfShaken],
          good: 'Tanığın “kin, bileme, bekleme” anlatımını kâğıtlarla karşıladın: bekleme maktulün davetiydi, bileme şefin talimatı. Tasarlamanın iki ayağı çöktü.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, sanığın telefonunda 22.47’de maktulden gelen bir mesaj: “Kapanıştan sonra ofise uğra.” Çarşamba sabahı ise şefin bütün mutfağa mesajı: “Herkes taşını alsın.”
- Tanık, sanık kapanışta “bekledi” mi, yoksa çağrıldığı yere mi gitti?
tarik: Ben… mesajı bilmiyordum. Ben ofisin önünde gördüm onu, o kadar.
> Savcı Karaman dosyasında tasarlama bölümünü açtı. Bir şeyin altını çizdi; sonra çizgiyi bir soru işaretine çevirdi.
`),
        }),
        presentRule('PS_T1', 'T1', ['ded_yol', 'ev_kentkart', 'ded_saat'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_t1'), breakIfShaken],
          good: 'Baş tanığın 23.55’ini bağımsız kayıtla (Kentkart 23.52) ya da bağımsız tanıkla (23.40) çürüttün: tanıkların birbirini çürüten anlatımları.',
          category: 'SORGULAMA',
          responses: [
            W(
              any(has('ded_yol'), has('ev_kentkart')),
              `
- Sayın Başkan, BURULAŞ kaydı: sanığın kişisel kartı 23.52.40’ta, meyhaneye dokuz dakika yürüme mesafesindeki İskele durağında, son 1/M otobüsünde okutulmuş.
- Tanık, 23.55’te ofisten koşarak çıkan kimdi? Sanık o saatte otobüsteydi.
tarik: Ben… saat belki… kasanın saati ileriydi belki. Bilmiyorum. Ben onu gördüm.
> Üye Pınar Yener bir şey yazdı ve altını iki kez çizdi.
`,
            ),
            O(`
- Sayın Başkan, bulaşıkçı Süleyman Çiftçi önceki celsede sanığı 23.45 dolmuşundan önce, 23.40 sularında arka kapıdan çıkarken gördüğünü söyledi.
- Tanık, 23.55’te kimi gördünüz?
tarik: Süleyman Abi’nin bir kulağı duymaz. Saat de bilmez. Ben kasanın saatine baktım.
`),
          ],
        }),
        presentRule('PS_T2', 'T2', ['ded_onluk', 'ded_bicak_yeri', 'ded_canli', 'ev_sesli'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_t2'), breakIfShaken],
          good: 'Tanığın “elinde bıçak, önlüğünde kan” anlatımı olay yeri tutanağıyla ya da maktulün 23.58’deki sesiyle çelişti.',
          category: 'SORGULAMA',
          responses: [
            W(
              any(has('ded_canli'), has('ev_sesli')),
              `
- Sayın Başkan, maktul 23.58’de sanığın babasına bir sesli mesaj bırakmış; bilirkişi raporu dosyada. “Oğlun buradaydı az önce… Kapıda biri var. Gel, otur.”
- Tanık, sanığın elinde bıçak, önlüğünde kanla kaçtığını söylediğiniz andan üç dakika sonra Ercan Toker konuşuyordu. Kimin kanını gördünüz?
> Tarık Sezer ilk kez cevap vermeden önce durdu. Bir saniye; iki.
tarik: Ben… karanlıktı. Bir leke gördüm. Domates sosu… bilmiyorum. Mutfak önlüğü.
> Salonun arkasında Kemal’in eli sandalyenin arkalığını sıktı.
`,
            ),
            O(`
- Sayın Başkan, olay yeri albümü: bıçak ofiste, cesedin yanında; önlük koridordaki askıda ve laboratuvara göre kansız.
- Tanık, elinde bıçakla kaçan biri bıçağı nasıl ofiste bıraktı? Kanlı önlüğü nasıl temiz olarak askıya astı?
tarik: Belki… geri döndü. Ben görmedim. Ben bir an gördüm. Bir an.
> Savcı başını kaldırdı ve tanığa baktı; ilk kez bir avukatın tanığına bakar gibi.
`),
          ],
        }),
        presentRule('PS_T2_FOTO', 'T2', ['ev_olay_foto'], {
          enabledWhen: any(has('clue_onluk'), has('clue_bicak_ofiste')),
          visibleWhen: any(has('clue_onluk'), has('clue_bicak_ofiste')),
          score: { SORGULAMA: 150 },
          effects: [inc('pers')],
          neutral: 'Kısmi isabet: olay yeri karesini gösterdin; çelişkiyi tanığın sözüyle birleştiren çıkarımı kurmadın.',
          responses: B(`
- Olay yeri albümü kare 17: bıçak ofiste. Kare 31: önlük askıda.
tarik: Fotoğraf sonra çekilmiş avukat hanım. Ben o anı anlatıyorum.
`),
        }),
        presentRule('PS_T3', 'T3', ['ev_z', 'ded_kasa'], {
          score: { SORGULAMA: 300 },
          effects: [
            raise('contra_t3'),
            ifThen(flag('tarik_uyarildi2'), [inc('pers')], [inc('pers', 2)]),
            breakIfShaken,
          ],
          good: 'Mali hafıza kaydı (Z raporu 23.48) tanığın “00.15’e kadar sayım” anlatımını çürüttü; tanığın yirmi sekiz dakikası açıklanmadı.',
          category: 'SORGULAMA',
          responses: [
            W(
              flag('tarik_uyarildi2'),
              `
- Sayın Başkan, kasanın mali hafızası: gün sonu raporu 23.48.11’de basılmış.
tarik: Biliyorum. Raporu bastım, sonra parayı elle saydım; Ercan’la anlaşmamız öyleydi. Rapor makinenin işi, sayım benim.
~ Hazırlanmış bir cevap. Dün gece kapımda verdiğim soru, bugün cilalı bir cevap olarak döndü. Yine de bir çatlak: rapordan sonra çekmece 23.48.14’te açılmış.
`,
            ),
            O(`
- Sayın Başkan, kasanın mali hafızası: gün sonu raporu 23.48.11’de basılmış, çekmece üç saniye sonra açılmış.
- Tanık, 23.55’ten 00.15’e kadar hangi parayı saydınız? Kasa 23.48’de kapanmıştı.
tarik: Ben… raporu bastım, parayı… Paraları çantaya koydum, öyle demek istedim. Sayım dedim, toparlama…
> Başkan kâtibe döndü: “Tanığın beyanı aynen yazılsın.”
`),
          ],
        }),
        presentRule('PS_T4', 'T4', ['ev_dvr', 'ded_kamera'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_t4'), breakIfShaken],
          good: 'Bilirkişi raporu “üç gündür arızalı” anlatımını çürüttü: cihaz kesintisiz kayıttaydı ve sanık çıktıktan sonra, 23.44.10’da elektriği kesildi.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, kayıt cihazının bilirkişi raporu: cihaz olaydan önceki yetmiş iki saat boyunca kesintisiz kayıt yapmış. 23.44.10’da elektriği harici olarak kesilmiş. Kasımda servis çağrısı yok.
- Tanık, arızalı dediğiniz cihazın fişini kim çekti?
tarik: Bilmiyorum. Ben… arızalı sanıyordum. Işığı yanıp sönüyordu. Belki elektrik gitti. Mudanya’da elektrik gider.
baskan: O gece Mudanya’da elektrik kesintisi var mıydı müdafi?
- Raporda harici kesinti yazıyor Sayın Başkan; yalnızca o fişte.
`),
        }),
        presentRule('PS_T5', 'T5', ['ded_mektup', 'ev_iz_yazisi'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_t5'), breakIfShaken],
          good: 'Maktulün not bloğundaki iz yazısı tanığın “eski meselelerden haberim yoktu” beyanıyla çelişti; mektup olay yerinden alınmıştı.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, maktulün not bloğunda koparılmış sayfanın izi; emanette kâtip huzurunda okundu: “Kemal… o terazi senin değildi… dolap benimdi, mal T…ık’ın… susan bendim.”
- Eşi, maktulün haftalardır bu mektubu yazdığını söylüyor. Mektup olay yerinde yok. Tanık, mektubu gördünüz mü?
tarik: Görmedim. “T…ık” mı? Tarık mı yazıyor orada? Türkiye’de kaç Tarık var avukat hanım? Bir harf, bir boşluk…
> Gülay Toker katılan sırasında başını çevirdi; Tarık’a baktı. Uzun uzun.
`),
        }),
        presentRule('PS_T6', 'T6', ['ded_gomlek', 'ev_cansu_foto'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_t6'), breakIfShaken],
          good: '23.12’de lacivert, 00.52’de ütülü ve temiz beyaz bir gömlek: “üstüm başım kan oldu” diyen tanığın kanlı giysisi dosyada yok.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, nişan masasının 23.12 tarihli fotoğrafı: tanık lacivert bir gömlek giyiyor. Olay yeri albümü kare 44, saat 00.52: tanık ütülü, temiz, beyaz bir gömlekle.
- Tanık, “sarıldım, üstüm başım kan oldu” diyorsunuz. Kanlı gömlek nerede? Polis geldiğinde neden üstünüzde değildi?
tarik: Ben… değiştirdim. Üstüm kan içindeydi, dayanamadım. Dolabımda yedek vardı. Attım onu. Ne yapsaydım?
baskan: Polise kanlı gömleğinizi teslim ettiniz mi?
tarik: Hayır efendim. Aklıma gelmedi. Şoktaydım.
> Salonda bir uğultu. Başkan tokmağa uzandı; vurmadı. {shake}
`),
        }),
        presentRule('PS_SAVCILIK2', undefined, savcilikDelili2, {
          maxUses: 10,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'Savcılığın delilini savcılığın tanığına gösterdin; tanığın anlatımını yalnızca tekrarlattın. −1 güvenilirlik, −150 skor.',
          category: 'SORGULAMA',
          responses: B(`
tarik: Evet, bu benim ifadem. Bu da bıçak. Ne soruyorsunuz avukat hanım?
savci: Sayın Başkan, müdafi tanığa tanığın kendi anlattığını teyit ettiriyor.
~ Kendi kalemime kendim mürekkep döktüm.
`),
        }),
      ],
      presentMiss: fallback('FB_T2_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil: −1 güvenilirlik, −150 skor.', category: 'SORGULAMA' },
        responses: B(`
baskan: Bu delilin beyanla ilgisini göremedim müdafi.
tarik: Ben anlamadım avukat hanım; ne göstermek istediniz?
`),
      }),
      objectMiss: fallback('FB_T2_OBJECT', 'OBJECT', {
        effects: [dec('cred'), inc('wrong'), score('SORGULAMA', -50, 'hatali')],
        quality: { q: 'BAD', feedback: 'Dayanaksız itiraz.', category: 'SORGULAMA' },
        responses: B(`
baskan: İtiraz reddedildi. Dayanağı yok.
`),
      }),
      finish: { id: 'T202_BITIR', next: 'T2_02C_G' },
    }),
    court2.stage('T2_02K', {
      title: 'Çatlak',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'tarik',
      lines: B(`
> Tarık Sezer kürsünün kenarına tutundu. İlk kez. Ceketinin düğmesini çözdü, yeniden ilikledi.
tarik: Sayın Başkan… O gece bir sarsıldım. Ortağım yerde yatıyordu. Saatler… saatler karışmış olabilir. Ben ne gördüysem…
baskan: Ne gördünüz tanık? Saatleri bırakın. Ne gördünüz?
tarik: Emir’i gördüm. Koridorda. Kaçıyordu.
> Bir sessizlik. Savcı Karaman ayağa kalktı; bir şey söyleyecekti. Söylemedi. Oturdu.
baskan: Tutanağa geçsin: tanık saatler konusundaki beyanlarının karışmış olabileceğini ifade etti.
~ Bir tanığı kırmadım. Ona kendi kâğıtlarını okuttum. Kâğıtlar onu kendi ifadesinin dışına itti; gerisini o yaptı.
> Gülay Toker katılan sırasında Tarık’a bakıyordu. Gözlerini ondan ayırmadı.
`),
      choices: [cont('T202K_DEVAM', 'Sorgulamaya dön', 'T2_02', { role: 'PRIMARY' })],
    }),
    decisionNode('T2_02C_G', [{ when: flag('cansu_tanik'), to: 'T2_02C' }, { to: 'T2_03' }]),
    court2.stage('T2_02C', {
      title: 'Garsonun dinlenmesi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'cansu',
      onEnter: [ifThen(flag('cansu_vaat'), [dec('pers', 2), dec('cred')], [inc('pers')])],
      lines: [
        W(
          flag('cansu_vaat'),
          `
recep: Tanık Cansu Güler! Hım-hım.
> Cansu kürsüye çıktı, telefonunu elinden bırakmadan. Fotoğrafı, saati, erken çıkışını anlattı.
savci: Tanık, bugün buraya gelmeniz için size bir şey vaat edildi mi?
cansu: Avukat hanım… iş bulurum dedi. Kaybedersem diye. Yanlış mı?
> Savcı başkana döndü; bir şey demedi. Demesine gerek yoktu. Başkan bir şey yazdı.
~ Bir tanığa bir iş vaat ettim. Şimdi o tanığın her cümlesi bir maaş bordrosu gibi okunuyor.
`,
        ),
        O(`
recep: Tanık Cansu Güler! Hım-hım.
> Cansu kürsüye çıktı; elleri titriyordu, sesi titremiyordu.
cansu: 23.25’te çıktım. Normalde kasayı ben kapatırım; Tarık abi “sen çık” dedi. Fotoğrafı ben çektim, 23.12’de. Pastayı keserlerken.
cansu: Tarık abinin üstünde lacivert gömlek vardı. Akşam boyunca o vardı. Beyaz gömleğini o gece hiç görmedim.
> Tarık dinleyici sırasında oturuyordu. Cansu ona bakmadı. Cümlesini bitirdi, başkana baktı.
`),
      ],
      choices: [cont('T202C_DEVAM', 'Devam', 'T2_03', { role: 'PRIMARY' })],
    }),
    court2.objection('T2_03', {
      title: 'Savcının talebi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      say: T(`
savci: Sayın Başkan, husumetin derecesi bakımından bir talebimiz var. Sanığın babası Kemal Yalçın’ın 2004 yılındaki müdafii Av. Leyla Erdem bugün salonda. Tanık olarak dinlenmesini talep ediyoruz.
> Salon dinleyici sırasına döndü. Leyla kıpırdamadı. Kemal, birkaç sıra önde, başını çevirmedi.
baskan: Müdafi, talebe diyeceğiniz?
`),
      next: 'T2_04',
      options: [
        option('L_SIR', '“Av. Erdem, avukatlığı sırasında öğrendikleri hakkında tanıklıktan çekinebilir; sır müvekkilinindir.”', {
          score: { USUL_BILGISI: 120 },
          effects: [inc('legal_hits'), inc('pers'), raise('leyla_korundu')],
          good: 'Doğru dayanak: avukat, meslek sıfatıyla öğrendiği bilgiler hakkında tanıklıktan çekinebilir (CMK 46/1-a) ve sır saklamakla yükümlüdür (Av.K. 36); sırrın sahibi müvekkildir. Husumet zaten dosyadaki hükümle sabit.',
          category: 'USUL_BILGISI',
          responses: B(`
- Sayın Başkan, Av. Leyla Erdem’in bilgisi Kemal Yalçın’ın avukatı olarak öğrendiği bilgilerdir. Meslek sırrıdır ve bu sırrın sahibi müvekkildir; tanıklıktan çekinme hakkı vardır.
- Husumetin varlığı zaten getirtilen hükümle sabittir. Bir avukatı eski müvekkilinin aleyhine kürsüye çıkarmanın bu dosyaya katacağı bir şey yoktur.
baskan: Talep reddedildi. Av. Erdem’in meslek sırrı gözetilerek.
> Leyla dinleyici sırasında başını bir santim eğdi. Kemal döndü; Leyla’ya değil, bana baktı.
`),
        }),
        option('L_KATIL', '“Katılıyoruz; dinlensin.”', {
          effects: [dec('pers')],
          neutral: 'Avukatın meslek sırrı nedeniyle çekinme hakkını gözetmedin; Leyla kürsüye çıkıp çekindi, yalnızca zaman ve güven kaybettin.',
          responses: B(`
- Katılıyoruz Sayın Başkan.
> Leyla kürsüye geldi. Yemin etmeden önce tek bir cümle kurdu: “Meslek sırrım nedeniyle tanıklıktan çekiniyorum.” Başkan kabul etti.
> Kemal başını iki elinin arasına aldı. Leyla kürsüden inerken bana bakmadı.
~ Bir avukatı, eski müvekkilinin önünde kürsüye çıkardım. Ona çekinme hakkını kendisi hatırlatmak zorunda kaldı.
`),
        }),
        option('L_ORTAK', '“Av. Erdem savunma ekibinden; tanık olamaz.”', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred'), dec('pers')],
          bad: 'Yanlış dayanak: Av. Erdem bu davada müdafi değil. Engel savunma ekibinde olmak değil, meslek sırrıdır (CMK 46/1-a; Av.K. 36).',
          category: 'USUL_BILGISI',
          responses: B(`
- Sayın Başkan, Av. Erdem savunma ekibindendir; tanık olamaz.
baskan: Vekâletnamede adı yok müdafi. Bu davada müdafi değil. Bu gerekçe kabul edilemez.
> Savcı hafifçe gülümsedi. Leyla’nın kendisi ayağa kalkıp meslek sırrını hatırlattı; talep ancak öyle reddedildi.
`),
        }),
        option('L_ILGISIZ', '“Yirmi iki yıllık bir husumet bu davayla ilgisiz.”', {
          score: { USUL_BILGISI: -30 },
          effects: [dec('pers')],
          bad: 'Husumet saik bakımından ilgilidir; doğru itiraz konunun ilgisizliği değil, avukatın çekinme hakkıydı (CMK 46/1-a).',
          category: 'USUL_BILGISI',
          responses: B(`
baskan: Saik bakımından ilgisiz değil müdafi. Ancak Av. Erdem’in meslek sırrı… Av. Erdem, çekinme hakkınızı kullanıyor musunuz?
leyla: Kullanıyorum Sayın Başkan.
> Leyla oturdu. Kemal hiç kıpırdamadı.
`),
        }),
      ],
    }),
    court2.objection('T2_04', {
      title: 'Ara karar · tutukluluk',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('ara_dil_sesli'),
          `
baskan: Taraflara diyecekleri soruldu. Ara karar: müdafiin talebi üzerine sesli mesajın bilirkişi incelemesinin beklenmesine. Duruşma üç hafta sonraya bırakıldı.
baskan: Müdafi, tutukluluğa ilişkin diyeceğiniz?
`,
        ),
        O(`
baskan: Taraflara diyecekleri soruldu. Toplanacak başka delil kalmadıysa bir sonraki celsede esas hakkındaki mütalaa alınacak. Duruşma üç hafta sonraya bırakıldı.
baskan: Müdafi, tutukluluğa ilişkin diyeceğiniz?
`),
      ],
      next: 'T2_05',
      options: [
        option('TH_A', 'Tahliye: baş tanığın anlatımı kayıtlarla çöktü, tasarlama dayanakları kalmadı; adli kontrol', {
          effects: [
            ifThen(
              all(ref('tarik_sarsildi'), ref('tasarlama_sarsildi')),
              [raise('released'), score('USUL_BILGISI', 120), inc('legal_hits'), inc('trust', 10)],
              [score('USUL_BILGISI', 20)],
            ),
          ],
          good: 'Kuvvetli suç şüphesinin dayanağı olan tek görgü tanığının anlatımı ve tasarlama delilleri sarsıldığında tutukluluğun devamı orantısızdır; adli kontrol yeterlidir (CMK 100, 101/1, 109).',
          category: 'USUL_BILGISI',
          responses: [
            W(
              all(ref('tarik_sarsildi'), ref('tasarlama_sarsildi')),
              `
- Sayın Başkan, kuvvetli suç şüphesinin dayanağı olan tek görgü tanığının saatleri makine kayıtlarıyla çelişti; tasarlamanın dayanakları kâğıtlarla çürüdü. Tutukluluğun devamı orantısızdır.
- Sanığın sabit adresi, ailesi var. Konutu terk etmeme ve imza yükümlülüğü yeterlidir.
> Heyet müzakereye çekildi. On iki dakika. Meral’in iğnesi on iki dakika boyunca bir kumaşa girip çıktı; kumaş yoktu.
baskan: Sanığın konutunu terk etmeme ve haftada iki gün imza yükümlülüğü şeklinde adli kontrol tedbiri uygulanarak tahliyesine; başka suçtan tutuklu değilse derhâl salıverilmesine.
> Emir başını iki elinin arasına aldı. Jandarma, kelepçeyi taşıdığı eli bir an havada tuttu; sonra cebine koydu.
`,
            ),
            O(`
- Sayın Başkan, sanığın tahliyesini ve adli kontrol uygulanmasını talep ediyoruz.
baskan: Mevcut delil durumu, suçun niteliği ve öngörülen ceza miktarı gözetilerek tutukluluk hâlinin devamına.
`),
          ],
        }),
        option('TH_B', 'Tahliye: tutukluluk uzadı', {
          score: { USUL_BILGISI: -20 },
          neutral: 'Sürenin uzaması tek başına tahliye gerekçesi değildir; kuvvetli şüpheyi sarsan somut bulgu göstermedin.',
          responses: B(`
- Sanık dört aydır tutuklu Sayın Başkan.
baskan: Ağır ceza dosyası için makul sürenin içinde müdafi. Tutukluluk hâlinin devamına.
`),
        }),
        option('TH_C', 'Talebimiz yok', {
          neutral: 'Tutukluluk hakkında bir talepte bulunmadın.',
          responses: B(`
- Talebimiz yok Sayın Başkan.
baskan: Tutukluluk hâlinin devamına.
> Emir bana baktı; bir şey sormadı. Sormaktan vazgeçmiş bir bakış.
`),
        }),
      ],
    }),
    story('T2_05', {
      ...H2,
      title: 'Koridor',
      background: 'adliye',
      lines: [
        W(
          flag('released'),
          `
# ADLİYE ARKA KAPISI · AKŞAMÜSTÜ [bg:adliye]
> Emir adliyenin arka kapısından, bir naylon poşetle çıktı. Ayakkabılarının bağcıkları yoktu.
> Meral ona koştu. Kemal koşmadı; durduğu yerde kaldı, ellerini montunun cebine soktu. Emir annesine sarıldı, sonra babasına baktı.
emir: Baba.
kemal: Oğlum.
> Başka bir şey söylemediler. Kemal oğlunun omzuna elini koydu; bir paletin üstündeki koliyi düzeltir gibi, dikkatle.
`,
        ),
        O(`
# ADLİYE KORİDORU · AKŞAMÜSTÜ [bg:adliye]
> Ring aracı gitti. Meral poşetini bu kez gardiyana veremedi; gömlek yine onunla eve dönüyordu.
> Kemal koridorun duvarına yaslanmıştı. Gözleri tanık odasının kapısındaydı.
`),
      ],
      choices: [cont('T205_DEVAM', 'Devam', 'T2_06', { role: 'PRIMARY' })],
    }),
    story('T2_06', {
      ...H2,
      title: 'Gemlikli',
      background: 'adliye',
      lines: [
        W(
          flag('press_t5'),
          `
> Tarık Sezer tanık odasından çıktı; ceketini koluna almış. Yanımdan geçerken durdu.
tarik: Ercan sizi severdi avukat hanım. Böyle inatçı birini. Severdi.
> Yürüdü. Kemal duvardan ayrıldı; arkasından baktı, adam merdivenlerde kaybolana kadar.
kemal: O adam… Gemlik dedi kürsüde. Görükle’ye “misafir” gelirmiş.
kemal: Gemlikli. Yirmi iki yıl. Saçı vardı o zaman, şimdi yok; ama yürüyüşü aynı. Arabanın anahtarını parmağında çevirirdi; şimdi de çeviriyor.
~ Bir ad yok. Bir yürüyüş, bir anahtar, bir kasaba adı. Bir mahkeme yürüyüşleri kabul etmez; bir arşiv belki eder.
`,
        ),
        O(`
> Tarık Sezer tanık odasından çıktı; ceketini koluna almış. Yanımdan geçerken durdu.
tarik: Ercan sizi severdi avukat hanım. Böyle inatçı birini. Severdi.
> Yürüdü. Arabasının anahtarını parmağında çeviriyordu. Kemal arkasından baktı; bir şey söylemedi, ama bakışı merdivenlere kadar adamı izledi.
`),
      ],
      choices: [cont('T206_DEVAM', 'Gece', 'ARA2_G0', { role: 'PRIMARY' })],
    }),
  ],
};
