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
  deliver,
  fallback,
  flag,
  goto,
  has,
  hl,
  ifThen,
  inc,
  not,
  option,
  presentRule,
  pressRule,
  raise,
  ref,
  resultNode,
  score,
  statement,
  story,
  strategyAmount,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, Cond, Effect } from '../../../tools/content/src/kit/index.js';
import { B, O, T, W } from './dsl.js';
import { H3, court3, wrongMove } from './shared.js';

// 75-trial-3: 3. celse (son duruşma). Koridor, açılış (arşiv teslimi, savcılığın soruşturması), baş tanığın yeniden
// dinlenmesi (R1–R4) ve çöküşü, mütalaa, dayanaklar, esas savunma, son söz, hüküm; çöküş kesintisi.

const arsiv = deliver('T3_00G_1', [
  {
    evidence: 'ev_arsiv',
    requires: flag('arsiv_talep'),
    hint: 'Leyla’nın verdiği esas numarasıyla 2004 dosyasını mahkemeden iste.',
  },
]);

const collapse: Effect = ifThen(
  all(flag('contra_r2'), flag('contra_r3'), any(flag('contra_r1'), flag('contra_r4')), not(visited('T3_01K'))),
  [goto('T3_01K')],
);

const dayanak = (id: string, label: string, backed: Cond, argFlag: string, line: string) =>
  option(id, label, {
    cost: [{ var: 'noktalar', amount: 1 }],
    maxUses: 1,
    effects: [
      ifThen(
        backed,
        [raise(argFlag), score('SAVUNMA_STRATEJISI', 60), inc('pers')],
        [score('SAVUNMA_STRATEJISI', -40), dec('pers')],
      ),
    ],
    responses: [
      W(backed, line),
      O(`
~ Bunu söylemek istedim; ama elimde onu taşıyacak bir kâğıt yoktu. Heyet bunu benden önce fark etti.
uye: Müdafi, bu dayanağı dosyada hangi delil destekliyor?
`),
    ],
    next: '$stay',
  });

const savcilikDelili3 = ['ev_bicak', 'ev_mesaj_pzt', 'ev_suleyman_ifade', 'ev_tas_fis', 'ev_otopsi', 'ev_tarik_ifade'];

export const trial3: CasePart = {
  predicates: [
    {
      id: 'tasarlama_coktu',
      label: 'Tasarlamanın en az iki ayağı çöktü',
      when: atLeast(2, has('ded_davet'), has('ded_bileme'), has('ded_niyet'), flag('contra_t0')),
    },
    {
      id: 'tanik_coktu',
      label: 'Baş tanığın anlatımı çöktü',
      when: any(
        ref('tarik_sarsildi'),
        atLeast(2, flag('contra_s2'), flag('contra_s4'), flag('contra_r1'), flag('contra_r4')),
      ),
    },
    {
      id: 'lehe2',
      label: 'En az iki bağımsız lehe bulgu',
      when: atLeast(
        2,
        has('ded_saat'),
        has('ded_yol'),
        has('ded_canli'),
        has('ded_onluk'),
        has('ded_bicak_yeri'),
        has('ded_kasa'),
        has('ded_kamera'),
        has('ded_gomlek'),
        has('ded_mektup'),
      ),
    },
    {
      id: 'alibi_tam',
      label: 'Maktul sanık giderken yaşıyordu',
      when: all(has('ded_canli'), any(has('ded_yol'), has('ev_kentkart'))),
    },
    {
      id: 'fail_belli',
      label: 'Başsavcılık baş tanık hakkında delil buldu',
      when: all(flag('tarik_ifsa'), flag('bildirdi'), not(flag('tarik_yuzlesme'))),
    },
  ],
  court: {
    sessions: [
      courtSession('cs_3', '3. Celse', [
        ['s3_acilis', 'ACILIS', 'T3_00'],
        ['s3_tanik', 'TANIK_DINLEME', 'T3_01'],
        ['s3_mutalaa', 'MUTALAA', 'T3_02'],
        ['s3_savunma', 'SAVUNMA', 'T3_03P'],
        ['s3_sonsoz', 'SON_SOZ', 'T3_04'],
        ['s3_karar', 'KARAR', 'T3_05'],
      ]),
    ],
  },
  nodes: [
    decisionNode('T3_00G_1', [{ to: 'T3_00G_2' }], {
      ...H3,
      title: 'Koridor',
      onEnter: [raise('in_court'), ...arsiv.effects, ifThen(flag('tarik_yuzlesme'), [dec('pers', 2)])],
      lines: B(`
# 31 MART · 09.10 — BURSA ADLİYESİ, 4. KAT [bg:adliye]
> Yağmur dinmişti. Adliyenin camlarından ilk kez bir güneş giriyordu; soluk, kararsız, mart güneşi. Koridorun mermerinde ışıktan bir şerit.
`),
    }),
    decisionNode('T3_00G_2', [{ to: 'T3_00G_3' }], {
      lines: [
        W(
          flag('released'),
          `
> Emir koridorun ucundan geldi; yanında annesi ve babası. Kelepçesiz. Takım elbise Meral’in dikişi; omuzları biraz geniş. Kemal oğlunun bir adım arkasında yürüyordu; kendi duruşmasına girmez gibi.
`,
        ),
        O(`
> Ring aracı arka kapıya yanaştı. Meral elinde ütülü bir gömlekle bekliyordu; bu sefer gardiyan aldı. Kemal pencerenin önündeydi; bu sefer yüzü koridora dönüktü.
`),
      ],
    }),
    decisionNode('T3_00G_3', [{ to: 'T3_00G_4' }], {
      lines: [
        W(
          flag('bildirdi'),
          `
> Dinleyici sırasının arka tarafında iki sivil polis oturuyordu. Biri Tarık Sezer’in girdiği kapıya baktı; sonra savcıya.
`,
        ),
        O(`
> Leyla dinleyici sırasının en arkasına oturdu. Kemal içeri girerken bir an durdu, Leyla’nın sırasına baktı; geçti, oturdu. İki sıra önüne.
`),
      ],
    }),
    decisionNode('T3_00G_4', [{ to: 'T3_00L' }], {
      lines: [
        W(
          flag('aile_baris'),
          `
> Kemal salona girerken bir an durdu. Leyla’nın oturduğu sıraya baktı. Sonra, yirmi iki yıl sonra ilk kez, başıyla selam verdi. Leyla aynı selamı verdi; o kadar.
`,
        ),
        W(
          any(flag('leyla_kemal'), flag('leyla_acik')),
          `
> Leyla elinde bir zarf tutuyordu; kalın, eski bir zarf. Kimseye vermedi. Dinleyici sırasında dizlerinin üstünde tuttu.
`,
        ),
        O(`
> Leyla’nın elleri boştu. Sigara paketini bu sabah masasında bırakmıştı; ilk kez.
`),
      ],
    }),
    story('T3_00L', {
      ...H3,
      title: 'Kapının önü',
      background: 'adliye',
      lines: B(`
> Salonun kapısı açılmadan önce Leyla yanıma geldi. Cübbemin yakasını düzeltti; bunu hiç yapmazdı.
leyla: On beş dava. Hepsinde ben sana bir şey söyledim, sen de bir şey yaptın. Bugün bir şey söylemeyeceğim.
- Hiçbir şey mi?
leyla: Bir şey. Yirmi iki yıl önce bu koridorda bir çocuğa “olmazsa indirim” dedim. Bugün o koridorda sen varsın; ben değil.
leyla: Kazanırsan benim yerime kazanma. Kaybedersen benim yerime kaybetme. Kendi davanı savun: bir çocuğun o geceki on beş dakikasını.
> Kapı açıldı. Mübaşirin kalın sesi koridora taştı. Leyla geri çekildi; dinleyici sırasına yürüdü, en arkaya oturdu.
~ Bir mentor bir gün susar. Susması, ilk kez sana güvendiği gündür. Ya da ilk kez kendine güvenmediği.
`),
      choices: [cont('T300L_DEVAM', 'Salona gir', 'T3_00', { role: 'PRIMARY' })],
    }),
    court3.stage('T3_00', {
      title: 'Son duruşma',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      lines: [
        W(
          all(has('ev_arsiv'), flag('bildirdi'), not(flag('tarik_yuzlesme'))),
          `
recep: Emir Yalçın dosyası! Hım-hım.
# BURSA 3. AĞIR CEZA MAHKEMESİ — 3. CELSE [bg:durusma_salonu]
baskan: Duruşmaya devam olundu. Bursa 2. Ağır Ceza’nın 2004/311 Esas sayılı dosyasındaki arama tutanağı getirtildi, okundu.
savci: Sayın Başkan, bir bilgi sunmak isterim. Müdafiin yazılı bildirimi üzerine Başsavcılığımızca bir soruşturma başlatılmıştır.
savci: Hâkim kararıyla yapılan aramada tanık Tarık Sezer’in aracının bagajında yıkanmış bir lacivert gömlek ele geçirilmiş; kriminal incelemesi sürmektedir.
> Salon bir an sustu. Gülay Toker başını çevirdi; tanık sırasında oturan Tarık’a baktı. Tarık bakmadı.
baskan: Tanık Tarık Sezer yeniden dinlenecek. Tanık, yemininiz devam ediyor. Kendinizi ya da yakınlarınızı suçlayacak sorulara cevap vermeyebilirsiniz.
`,
        ),
        W(
          has('ev_arsiv'),
          `
recep: Emir Yalçın dosyası! Hım-hım.
# BURSA 3. AĞIR CEZA MAHKEMESİ — 3. CELSE [bg:durusma_salonu]
baskan: Duruşmaya devam olundu. Bursa 2. Ağır Ceza’nın 2004/311 Esas sayılı dosyasındaki arama tutanağı müdafiin talebiyle getirtildi, okundu.
baskan: Tanık Tarık Sezer müdafiin talebi üzerine yeniden dinlenecek. Tanık, yemininiz devam ediyor.
`,
        ),
        O(`
recep: Emir Yalçın dosyası! Hım-hım.
# BURSA 3. AĞIR CEZA MAHKEMESİ — 3. CELSE [bg:durusma_salonu]
baskan: Duruşmaya devam olundu. Tutuklu ya da tutuksuz sanık, müdafii, katılan hazır. Tanık Tarık Sezer müdafiin talebi üzerine yeniden dinlenecek.
`),
      ],
      choices: [cont('T300_DEVAM', 'Tanık kürsüde', 'T3_00I', { role: 'PRIMARY' })],
    }),
    decisionNode('T3_00I', [{ to: 'T3_01' }], {
      lines: [
        W(
          flag('sahte_ikrar'),
          `
baskan: Sanığın önceki celsedeki ikrarı gözetilerek, eylemin TCK 81/1 ve 29. maddeleri kapsamında değerlendirilebileceği ihtar edildi; ek savunması soruldu.
emir: Söylediğim gibi Sayın Başkan. Yaptım.
> Kemal başını öne eğdi. Leyla’nın sırası boştu.
`,
        ),
      ],
    }),
    court3.testimony('T3_01', {
      title: 'Baş tanığın yeniden dinlenmesi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'tarik',
      witnessLabel: 'TANIK · TARIK SEZER',
      rulesText: 'Son kez. Önce bastır, sonra doğru delille göster.',
      say: T(`
> Tarık Sezer kürsüye çıktı. Aynı takım, aynı kravat; ama bu kez ceketinin düğmesini iliklemedi.
tarik: Ben ne gördüysem söyledim Sayın Başkan. Yine söylerim. Ortağımı kaybettim; şimdi de yalancı mı olacağım?
baskan: Müdafi, sorularınız.
~ Son kez. Leyla’nın sesi: “Ona kendi kâğıtlarını okut.” Bugün kâğıtlarım onun kâğıtları değil; yirmi iki yıl öncesinin ve bir ölünün.
`),
      statements: [
        statement('R1', 1, [
          'Önceki ifademin arkasındayım; ',
          hl('ne gördüysem onu söyledim', any(flag('press_r1'), has('ded_gomlek'))),
          '.',
        ]),
        statement('R2', 2, [
          hl(
            'Ofise 00.15’te girdim; ondan önce Ercan’ın yanına giden olmadı',
            any(flag('press_r2'), has('ded_canli'), has('ev_sesli')),
          ),
          '.',
        ]),
        statement('R3', 3, [
          hl(
            'Görükle’deki o evde hiç kalmadım; Kemal Yalçın’ı tanımam',
            any(flag('press_r3'), has('ev_arsiv'), flag('fact_tarik_gemlik')),
          ),
          '.',
        ]),
        statement('R4', 4, [
          hl(
            'Ercan’ın bir mektup yazdığını bilmiyordum',
            any(flag('press_r4'), has('ded_mektup'), has('ev_iz_yazisi')),
          ),
          '.',
        ]),
      ],
      rules: [
        pressRule('PR_R1', 'R1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_r1')],
          responses: B(`
- Gördüğünüzü söylediniz. Saatleri bir “sarsıntı” ile açıkladınız. Bugün de aynı mı?
tarik: Aynı. Saatler karışmış olabilir. Gördüğüm şey karışmadı.
`),
        }),
        pressRule('PR_R2', 'R2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_r2')],
          responses: [
            W(
              flag('fact_fatura'),
              `
- 23.48’de kasayı kapattınız. 00.15’e kadar nerede beklediniz? Bir de: perşembe akşamı Ercan Bey “Sezer Gıda’nın faturaları ne?” diye bağırmış. Sezer Gıda kimin?
tarik: Ben… salonda oturdum. Bir sigara içtim. Sezer Gıda… kuzenimin firması. Balık getirir. Faturalar… muhasebe işi. Ercan bağırırdı, huyuydu.
~ İkinci celsede “sayım” dedi, bugün “sigara.” Her celsede yirmi sekiz dakikanın başka bir adı var. Bir de bir kuzenin firması.
`,
            ),
            O(`
- 23.48’de kasayı kapattınız. 00.15’e kadar nerede beklediniz?
tarik: Salonda. Oturdum. Bir sigara içtim. Ofise gidemedim; korktum. Sonra gittim.
~ İkinci celsede “sayım” dedi, bugün “sigara.” Her celsede yirmi sekiz dakikanın başka bir adı var.
`),
          ],
        }),
        pressRule('PR_R3', 'R3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_r3')],
          responses: B(`
- Görükle’ye “misafir” gittiğinizi söylemiştiniz. Kaç kez?
tarik: Bir iki kez. Yirmi iki yıl önce. Hatırlamıyorum. Kemal’i hiç görmedim; ya da gördüysem de hatırlamam.
> Salonun ortasında Kemal başını kaldırdı ve kürsüye baktı.
`),
        }),
        pressRule('PR_R4', 'R4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_r4')],
          responses: B(`
- Ercan Bey son haftalarında geceleri ofiste ne yapardı?
tarik: Hesap bakardı. Bir şeyler yazardı. Ben karışmazdım; ortaklıkta herkesin kendi işi.
`),
        }),
        presentRule('PS_R1', 'R1', ['ded_gomlek', 'ev_cansu_foto'], {
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_r1'), collapse],
          good: 'Tanığın “gördüğüm şey karışmadı” beyanını, o gece değiştirdiği ve teslim etmediği gömlekle sınadın.',
          category: 'SORGULAMA',
          responses: [
            W(
              all(flag('bildirdi'), not(flag('tarik_yuzlesme'))),
              `
- Tanık, 23.12’de üstünüzdeki lacivert gömlek. Başsavcılık onu dün aracınızın bagajında buldu; yıkanmış hâlde. Neden sakladınız?
tarik: Sak… saklamadım. Attım dedim; atmaya kıyamadım. Pahalı bir gömlekti. Yıkadım.
> Savcı Karaman başkana bir kâğıt uzattı. Başkan okudu; tanığa baktı.
`,
            ),
            O(`
- Tanık, 23.12’de lacivert, 00.52’de ütülü beyaz. “Sarıldım, kan oldu” dediğiniz gömlek nerede?
tarik: Attım dedim. Kaç kere soracaksınız? Ortağımın kanı vardı üstünde; saklayacak mıydım?
`),
          ],
        }),
        presentRule('PS_R2', 'R2', ['ev_sesli', 'ded_canli'], {
          score: { SORGULAMA: 400 },
          effects: [inc('pers', 2), raise('contra_r2'), collapse],
          good: 'Maktulün 23.58’deki sesli mesajı (“Kapıda biri var. Gel, otur.”) tanığın “00.15’ten önce kimse girmedi” beyanını çürüttü; sanık o saatte otobüsteydi.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, bilirkişi raporlu sesli mesajı dinletmek istiyorum. 23.58.07.
> Kâtip düğmeye bastı. Salonun hoparlöründen bir ölünün sesi doldu; yorgun, alçak.
@SESLİ MESAJ · ERCAN TOKER: …Mektup masamda. Yarın sabah sana getiriyorum; bu sefer kaçmayacağım… Bir dakika… Kapıda biri var. Gel, otur. Kapat şu kapıyı… [phone]
> Gülay Toker iki elini ağzına kapadı. Kemal gözlerini kapadı.
- Tanık, sanık 23.52’de otobüsteydi. 23.58’de kapıda kim vardı? “Gel, otur” denen kişi kimdi?
tarik: Ben… bilmiyorum. Ben salondaydım.
`),
        }),
        presentRule('PS_R3', 'R3', ['ev_arsiv'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_r3'), collapse],
          good: '2004 arama tutanağı tanığın “o evde hiç kalmadım, Kemal’i tanımam” beyanını çürüttü: baskın gecesi evde bulunanlar arasında adı ve imzası var.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, 2004/311 Esas dosyasındaki arama ve el koyma tutanağı. Evde bulunanlar: Kemal Yalçın, Ercan Toker ve “misafir” olarak Tarık Sezer, Gemlik nüfuslu. Altında imzası.
- Tanık, bu imza sizin mi?
> Tarık kâğıda baktı. Uzun uzun. Sonra kâğıdı ters çevirdi; bir masanın köşesindeki bir çerçeve gibi.
tarik: Yirmi iki yıl önce… bir imza… Ben hatırlamıyorum.
> Salonun ortasında Kemal ayağa kalktı. Başkan bir eliyle oturmasını işaret etti; Kemal oturmadı, oturamadı.
kemal: Gemlikli. Sendin.
baskan: Dinleyici, lütfen oturun.
`),
        }),
        presentRule('PS_R4', 'R4', ['ded_mektup', 'ev_iz_yazisi'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_r4'), collapse],
          good: 'Not bloğundaki iz yazısı ve eşin beyanı: maktulün haftalarca yazdığı ve adı geçen birini işaret eden mektup olay yerinden götürülmüştü.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, maktulün not bloğundaki iz yazısı: “Kemal… o terazi senin değildi… dolap benimdi, mal T…ık’ın… susan bendim…”
- Mektup masadaydı; maktul 23.58’de “mektup masamda” diyor. Olay yerinde masada kâğıt yok. Tanık, mektubu kim aldı?
tarik: Ben… görmedim. “T…ık.” Bir harf…
gulay: Sen aldın. Tarık. Ercan sana söylemişti, değil mi? Mektubu sana söylemişti.
baskan: Katılan hanım!
`),
        }),
        presentRule('PS_SAVCILIK3', undefined, savcilikDelili3, {
          maxUses: 10,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'Savcılığın delilini tanığa gösterdin; yalnızca kendi anlatımını tekrarlattın. −1 güvenilirlik, −150 skor.',
          category: 'SORGULAMA',
          responses: B(`
tarik: Evet. Bu benim ifadem. Kaç kere okuyacağız?
~ Son celsede bile kendi kalemime mürekkep döktüm.
`),
        }),
      ],
      presentMiss: fallback('FB_T3_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil: −1 güvenilirlik, −150 skor.', category: 'SORGULAMA' },
        responses: B(`
baskan: Bu delilin beyanla ilgisini göremedim müdafi.
`),
      }),
      finish: { id: 'T301_BITIR', next: 'T3_02' },
    }),
    court3.stage('T3_01K', {
      title: 'Susma',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'tarik',
      onEnter: [raise('tarik_ifsa')],
      lines: [
        W(
          all(flag('bildirdi'), not(flag('tarik_yuzlesme'))),
          `
> Tarık Sezer kürsünün kenarını iki eliyle tuttu. Bir şey söyleyecekti. Ağzı açıldı, kapandı.
tarik: Sayın Başkan… Kendimi suçlayacak sorulara cevap vermeyeceğim. Bir avukatla görüşmek istiyorum.
> Salon sustu. Kâtibin klavyesi durdu. Koridordan bir kapı sesi geldi ve o da sustu.
savci: Sayın Başkan, tanık hakkında Başsavcılığımızca yürütülen soruşturmada, kriminal ön raporuna göre gömlekte yıkanmaya rağmen kan izi tespit edilmiştir. Tanığın gözaltına alınması için talimat verilmiştir.
> İki sivil polis dinleyici sırasından kalktı. Tarık Sezer kürsüden indi; ceketini koluna aldı. Kapıya kadar yürüdü, durdu, döndü.
> Kemal’e baktı. Yirmi iki yıl sonra. Kemal başını eğmedi.
> Kapı kapandı. Gülay Toker katılan sırasında, bir düğün fotoğrafındaki sağdıcın arkasından baktı; ağlamadı.
~ Bir tanığı kırmadım. Bir ölünün sesini, yirmi iki yıllık bir imzayı ve bir gömleği kürsüye getirdim. Kırılan şey bir hikâyeydi; çok iyi anlatılmış, kâğıtsız bir hikâye.
`,
        ),
        O(`
> Tarık Sezer kürsünün kenarını iki eliyle tuttu. Bir şey söyleyecekti. Ağzı açıldı, kapandı.
tarik: Sayın Başkan… Kendimi suçlayacak sorulara cevap vermeyeceğim.
> Salon sustu. Savcı Karaman ayağa kalktı, oturdu, yeniden kalktı.
savci: Sayın Başkan, tanık hakkında suç duyurusunda bulunacağımızı tutanağa geçirtmek isterim.
> Tarık tanık sırasına döndü. Kimseye bakmadı. Ceketinin düğmesini ilikledi, çözdü.
~ Susma hakkı bir haktır. Ama bir tanık susunca, salon onun yerine konuşur. Bugün salon konuşuyordu.
`),
      ],
      choices: [cont('T301K_DEVAM', 'Devam', 'T3_02', { role: 'PRIMARY' })],
    }),
    court3.stage('T3_02', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('sahte_ikrar'),
          `
baskan: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
savci: Sayın Başkan, sanık önceki celsede eylemi ikrar etmiştir. Ancak dosya kapsamında tasarlama unsurunun oluştuğuna dair yeterli delil bulunmamaktadır.
savci: Sanığın maktulün o gece açıkladığı haksız fiilin etkisiyle hareket ettiği kabul edilerek TCK 81/1 ve 29 uyarınca cezalandırılmasına karar verilmesini talep ederim.
> Savcı oturdu. Mütalaasını okurken bir kez bile sanığa bakmadı. Bir kez bile bana bakmadı.
`,
        ),
        W(
          ref('fail_belli'),
          `
baskan: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
savci: Sayın Başkan, yapılan yargılama ve Başsavcılığımızca yürütülen soruşturma birlikte değerlendirildiğinde: maktul 23.58’de hayattadır; sanık o saatte toplu taşıma aracındadır.
savci: Suçun sanık tarafından işlenmediği sabit olmuştur. Sanığın CMK 223/2-b uyarınca beraatine; tanık Tarık Sezer hakkındaki soruşturmanın ayrıca yürütülmesine karar verilmesini talep ederim.
> Savcı oturdu. Bana baktı; bir saniyeliğine, başını hafifçe eğerek.
~ Bir savcının beraat istemesi bir zafer değil. Bir savcının işini yapmasıdır. Bu dosyada ilk kez herkes işini sonuna kadar yaptı.
`,
        ),
        W(
          all(ref('tanik_coktu'), any(ref('tasarlama_coktu'), ref('lehe2'))),
          `
baskan: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
savci: Sayın Başkan, tek görgü tanığının beyanları kayıtlarla ve diğer tanıkla çelişmiş, saatler ve olay yeri bulgularıyla bağdaşmamıştır. Tanığın beyanı hükme esas alınamaz.
savci: Sanığın atılı suçu işlediğine dair başka kesin delil bulunmamaktadır. Sanığın CMK 223/2-e uyarınca beraatine; tanık hakkında suç duyurusunda bulunulmasına karar verilmesini talep ederim.
> Gülay Toker başını katılan sırasının arkalığına yasladı; tavana baktı. Kocamı kim öldürdü, diye sormadı. Ama soruyordu.
`,
        ),
        W(
          ref('tasarlama_coktu'),
          `
baskan: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
savci: Sayın Başkan, iddianamede tasarlamaya dayanak gösterilen mesajın tamamı, bileği taşının alınış sebebi ve sanığın iş yerinde kalış nedeni birlikte değerlendirildiğinde tasarlama unsuru sabit değildir.
savci: Ancak tanık beyanı, bıçağın sanığa ait olması ve sanığın maktulle tartışması gözetildiğinde sanığın TCK 81/1 uyarınca cezalandırılmasını talep ederim.
~ Ağırlaştırılmış müebbetten müebbete. Bir ömrün koşulları değişti. Bir ömür değişmedi.
`,
        ),
        O(`
baskan: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
savci: Sayın Başkan, tanık beyanı, bıçağın sanığa ait olması, sanığın olaydan dört gün önceki mesajı ve bileği taşı birlikte değerlendirildiğinde sanığın eylemi tasarlayarak gerçekleştirdiği sabittir.
savci: Sanığın TCK 82/1-a uyarınca ağırlaştırılmış müebbet hapis cezasıyla cezalandırılmasını; TCK 53’ün uygulanmasını talep ederim.
> Meral’in iğnesi elinden kaydı; mermerin üstünde ince bir ses çıkardı. Kimse eğilip almadı.
`),
      ],
      choices: [cont('T302_DEVAM', 'Esas hakkında savunma', 'T3_03P', { role: 'PRIMARY' })],
    }),
    choiceNode('T3_03P', {
      ...H3,
      title: 'Dayanaklar',
      hud: ['noktalar', 'cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
baskan: Müdafi, esas hakkındaki savunmanız.
~ Üç dayanak. Leyla’nın sesi: “Fazlası gürültüdür.” Her biri dosyada bir kâğıda dayanmalı.
`),
      choices: [
        dayanak(
          'P_SAAT',
          'Sanık 23.40’ta çıktı, 23.52’de otobüsteydi',
          any(has('ded_yol'), has('ded_saat'), flag('contra_t1')),
          'arg_saat',
          `
- Birincisi: saat. Sanık 23.40’ta arka kapıdan, elleri boş çıktı; bunu bağımsız bir tanık dolmuş saatiyle söylüyor. 23.52’de bir kart okuyucu onu İskele’deki son otobüste kaydediyor.
`,
        ),
        dayanak(
          'P_CANLI',
          'Maktul 23.58’de yaşıyordu; kapıda başka biri vardı',
          has('ded_canli'),
          'arg_canli',
          `
- Maktul 23.58’de, sanık otobüsteyken, sanığın babasına bir sesli mesaj bıraktı ve “Kapıda biri var. Gel, otur” dedi. Ercan Toker’i öldüren o kapıdan girdi. Sanık o kapıdan değil, bir otobüsün kapısından girmişti.
`,
        ),
        dayanak(
          'P_TANIK',
          'Tek görgü tanığının anlatımı çöktü',
          ref('tanik_coktu'),
          'arg_tanik',
          `
- Dosyanın tek görgü tanığı: saatleri kayıtlarla, gördükleri olay yeriyle, kasası kendi Z raporuyla, kamerası bilirkişiyle, gömleği bir fotoğrafla çelişti. Bu beyan hükme esas alınamaz.
`,
        ),
        dayanak(
          'P_TASARLAMA',
          'Tasarlamanın unsurları yok',
          ref('tasarlama_coktu'),
          'arg_tasarlama',
          `
- Tasarlama bir zihin hâlidir; bu dosyada o zihin yok. Mesajın tamamı bir soru niyetini söylüyor; taş, şefin talimatı; “bekleyiş” maktulün daveti. Karar yok, sebat yok, plan yok.
`,
        ),
        dayanak(
          'P_TAHRIK',
          'Maktulün o gece açıkladığı haksız fiil',
          flag('fact_itiraf'),
          'arg_tahrik',
          `
- Mahkeme aksi kanaatteyse: maktul o gece sanığa, babasının yirmi iki yıl önce kendi suçu yüzünden hapis yattığını söyledi. Bu, ağır bir haksız fiilin açıklanmasıdır; ortaya çıkan hiddet, haksız tahrik hükmünü gerektirir.
`,
        ),
        dayanak(
          'P_FAIL',
          'Mektup alındı; baş tanık o gece gömlek değiştirdi',
          any(has('ded_mektup'), has('ded_gomlek'), flag('contra_r2')),
          'arg_fail',
          `
- Maktulün haftalarca yazdığı mektup olay yerinden götürüldü; izi bir adı gösteriyor.
- Baş tanık o gece gömleğini değiştirdi ve teslim etmedi. Bu bir başka kişinin varlığını gösterir; bulması savunmanın değil, Başsavcılığın işidir.
`,
        ),
        cont('P_BITIR', 'Esas savunmaya geç', 'T3_03', {
          role: 'PRIMARY',
          enabledWhen: any(
            cmp(v('noktalar'), '==', 0),
            flag('arg_saat'),
            flag('arg_canli'),
            flag('arg_tanik'),
            flag('arg_tasarlama'),
            flag('arg_tahrik'),
            flag('arg_fail'),
          ),
          lockedReason: 'En az bir dayanak seç.',
        }),
      ],
    }),
    choiceNode('T3_03', {
      ...H3,
      title: 'Esas savunma',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
~ Dayanaklar söylendi. Şimdi hepsini bir talepte toplamam gerekiyor. Heyetin kalemine geçecek tek bir cümle.
`),
      next: 'T3_04G',
      choices: [
        option('S_MASUMIYET', 'Beraat: Emir öldürmedi; o saatte otobüsteydi, maktul 23.58’de yaşıyordu', {
          effects: [
            raise('closing_masumiyet'),
            ifThen(
              atLeast(2, flag('arg_saat'), flag('arg_canli'), flag('arg_tanik'), flag('arg_fail')),
              [score('SAVUNMA_STRATEJISI', strategyAmount(200, 'MASUMIYET')), inc('pers')],
              [score('SAVUNMA_STRATEJISI', 60)],
            ),
          ],
          good: 'Delillerle desteklenen beraat talebi: suçun sanık tarafından işlenmediğinin sabit olması (CMK 223/2-b), olmazsa işlendiğinin sabit olmaması (223/2-e).',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Başkan, bu dosya bir bağırışla başladı. Bir çocuk, babasının hayatını çalan adama “neden” diye sordu; cevabını duydu, bağırdı ve çıktı.
- O çıktıktan sonra bir kasa kapandı, bir kamera sustu, bir otobüs kalktı, bir ölü konuştu ve bir kapı açıldı. O kapıdan giren müvekkilim değildi.
- Müvekkilimin suçu işlemediğinin sabit olduğu kanaatindeyiz. Beraatini ve tahliyesini talep ediyoruz.
`),
        }),
        option('S_SUPHE', 'Beraat: tek tanık çöktü, tasarlama da fiil de ispatlanamadı', {
          effects: [
            raise('closing_suphe'),
            ifThen(
              any(flag('arg_tanik'), flag('arg_tasarlama')),
              [score('SAVUNMA_STRATEJISI', strategyAmount(200, 'TASARLAMA')), inc('pers')],
              [score('SAVUNMA_STRATEJISI', 40)],
            ),
          ],
          good: 'Tek görgü tanığının beyanı çöktüğünde ve tasarlamanın unsurları kanıtlanamadığında şüpheden sanık yararlanır (CMK 223/2-e; Anayasa 38/4).',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Başkan, iddianame bir hikâye anlattı: bir mesaj, bir taş, bir bekleyiş, bir tanık. Mesajın sonu kesilmişti. Taş bir mutfak talimatıydı. Bekleyiş bir davetti. Tanığın saatleri makinelerle çelişti.
- Geriye bir bıçak kalıyor; sanığın her gün taşıdığı, o gece unuttuğu bir bıçak. Bir bıçak bir eli gösterir; bir zihni göstermez, bir saati de göstermez.
- Müvekkilimin CMK 223/2-e uyarınca beraatini talep ediyoruz.
`),
        }),
        option('S_TERDIT', 'Önce beraat; olmazsa tasarlama yok, haksız tahrik var', {
          effects: [raise('closing_terdit'), score('SAVUNMA_STRATEJISI', strategyAmount(150, 'TERDIT'))],
          good: 'Terditli savunma: önce beraat; aksi hâlde tasarlamanın unsurlarının oluşmadığı (TCK 81/1) ve haksız tahrik (TCK 29), TCK 62/1.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Başkan, öncelikle müvekkilimin beraatini talep ediyoruz.
- Mahkeme aksi kanaatteyse: tasarlamanın unsurları oluşmamıştır; maktulün o gece açıkladığı yirmi iki yıllık haksız fiil nedeniyle haksız tahrik hükümleri uygulanmalı, takdiri indirim yapılmalıdır.
~ Bir yandan “yapmadı” diyorum, öbür yandan “yaptıysa öfkeden.” Hukuk bunu ister. Emir’in gözleri istemiyor. Kemal’in gözleri yirmi iki yıl önceki bir avukatı hatırlıyor.
`),
        }),
        option('S_DUYGU', 'Bir babanın yirmi iki yılına seslen', {
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('pers')],
          bad: 'Esas savunma delil tartışmasıdır; yirmi iki yıl önceki bir haksızlık bu davadaki delillerin yerini tutmaz.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Başkan, salonda bir baba var. Yirmi iki yıl önce yapmadığı bir suçtan…
baskan: Müdafi, esas hakkında. Bu davanın esası hakkında.
~ Kemal başını kaldırdı ve bana baktı. Onu da kullandım. Utandım.
`),
        }),
      ],
    }),
    decisionNode('T3_04G', [{ to: 'T3_04' }], {
      lines: [
        W(
          flag('emir_kararli'),
          `
> Emir dinlerken bir kez babasına döndü. Kemal başını salladı; çok az. Görüş odasındaki konuşmanın devamı bir baş hareketiydi.
`,
        ),
        W(
          flag('teklif_red'),
          `
> Kemal bütün savunma boyunca öne eğik oturdu; bir paletin başında yükü bekleyen bir adam gibi. Bir ikrarın değil, bir kararın yükünü.
`,
        ),
        O(`
> Salonda bir sessizlik. Meral’in iğnesi durdu. Kemal ellerini dizlerinin üstünde birleştirdi.
`),
      ],
    }),
    choiceNode('T3_04', {
      ...H3,
      title: 'Son söz',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
baskan: Sanık, ayağa kalkın. Hükümden önce son sözünüz nedir?
> Emir ayağa kalktı. Bana baktı; ne söyleyeceğini bilmiyordum, bilmemem gerekiyordu. Sonra babasına baktı.
~ Son söz. Kanun onu sanığa verir; avukata değil. Burada benim işim bitiyor. Bundan sonrası bir çocuğun sesi.
`),
      next: 'T3_05',
      choices: [
        option('L_MEKTUP', '“O gece bir mektup vardı. Almadım. Keşke alsaydım.”', {
          score: { SAVUNMA_STRATEJISI: 50 },
          effects: [inc('pers')],
          good: 'Sanığın kendi sesiyle, kimseyi suçlamayan, gerçeğe dönük bir son söz.',
          category: 'SAVUNMA_STRATEJISI',
          responses: [
            W(
              flag('sahte_ikrar'),
              `
emir: Ben… Söylediğim gibi Sayın Başkan.
> Durdu. Babasına baktı. Bir şey daha söyleyecekti; söylemedi. Söylememesi her şeydi.
`,
            ),
            O(`
emir: O gece Ercan abi bana bir mektup uzattı Sayın Başkan. “Babana ver” dedi. Almadım. “Kendin ver” dedim. Sonra… sonra kimse veremedi.
emir: Ben onu öldürmedim. Ama o mektubu almadığım için her gece uyanıyorum. Babamın yirmi iki yılı o kâğıttaydı.
> Salonun ortasında Kemal başını eğdi. Gülay Toker sanığa baktı; ilk kez bir sanığa değil, bir çocuğa bakar gibi.
`),
          ],
        }),
        option('L_SESSIZ', '“Bir şey söylemeyeceğim.”', {
          neutral: 'Sanığın son söz hakkı; susmak da bir hak.',
          responses: B(`
emir: Bir şey söylemeyeceğim Sayın Başkan.
> Oturdu. Salonun ortasında Kemal’in elleri dizlerinin üstünde birleşti.
`),
        }),
        option('L_BABA', '“Babama… babama bir şey söylemek istiyorum.”', {
          neutral: 'Son söz sanığındır; aileye seslenmek insani, ama heyete bir şey anlatmaz.',
          responses: B(`
emir: Baba. Ben yapmadım. Sen de yapmamıştın. Biliyorum artık.
> Kemal ayağa kalktı; başkan bir şey demedi. Bir saniye sonra oturdu.
`),
        }),
      ],
    }),
    decisionNode('T3_05', [{ to: 'R_KARAR' }], {
      ...H3,
      title: 'Hüküm',
      lines: [
        W(
          flag('cokus'),
          `
> Heyet müzakereye çekildi. Bir saat. Salondan çıkan kimse geri dönmedi; ben yerimden kalkmadım.
`,
        ),
        W(
          flag('closing_terdit'),
          `
> Heyet müzakereye çekildi. Elli dakika. Emir bana döndü: “Abla, tahrik ne demek?” Cevap vermedim. Terditli bir savunma müvekkile iki cevap birden verir; ikisi de doğru, ikisi de ağır.
recep: Taraflar salona! Hükmü ayakta dinleyin. Hım-hım.
`,
        ),
        O(`
> Heyet müzakereye çekildi. Elli dakika. Koridorda Meral’in iğnesi, Kemal’in botlarının mermerdeki sesi, Gülay Toker’in sessizliği.
> Leyla dinleyici sırasından kalkmadı. Ellerini dizlerinin üstünde birleştirmişti; sigara paketini getirmemişti.
recep: Taraflar salona! Hükmü ayakta dinleyin. Hım-hım.
~ Hüküm ayakta dinlenir. Kanun böyle der. Ayakta durmak, düşmeye hazır olmaktır belki.
`),
      ],
    }),
    story('T_INT_COKUS', {
      ...H3,
      title: 'Çöküş',
      background: 'durusma_salonu',
      lines: B(`
> Bir yanlış daha. Başkan kalemini bıraktı. Üye Pınar Yener dosyayı kapattı. Savcı bana bakmadı bile; bakmasına gerek yoktu.
baskan: Müdafi, sunduklarınızın dosyayla ilgisi kalmadı. Mahkeme yeterince dinledi. Tarafların son beyanları alınmış kabul edilerek hüküm için ara verilecek.
~ Güvenimi tek tek harcadım. Her yanlış kâğıt bir kalp götürdü. Şimdi kalbim yok; yalnızca bir dosyam var.
`),
      choices: [cont('COKUS_DEVAM', 'Hüküm', 'T3_05', { role: 'PRIMARY' })],
    }),
    resultNode('R_KARAR', { ...H3, title: 'Karar', background: 'durusma_salonu' }),
  ],
  discoveryPaths: [...arsiv.discoveryPaths],
};
