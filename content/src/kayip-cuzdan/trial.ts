import {
  all,
  always,
  any,
  cmp,
  cont,
  courtSession,
  dec,
  decisionNode,
  fallback,
  flag,
  has,
  hl,
  ifThen,
  inc,
  mark,
  meet,
  not,
  objectRule,
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
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef } from '../../../tools/content/src/kit/index.js';
import { B, O, S, W } from './dsl.js';
import { TRIAL, VERDICT, court2 } from './shared.js';

// 80-trial: ikinci celse. Ara karar cevapları → teknisyen (tanık ifadesi) → şoför (telkinli soruya itiraz + tanık ifadesi) →
// müşteki → Ozan → Bşk. Orhan (yalnızca çift yakalandıysa) → ek savunma (CMK 226) → mütalaa ve cevap → esas savunma → son
// söz → hüküm. Tanıklar 1. celsede/ara kararda çağrıldıysa gelir (yönlendirici DECISION'lar).

const wrongPresent: ChoiceDef['effects'] = [dec('cred'), dec('pers'), inc('wrong'), score('SORGULAMA', -150, 'hatali')];
const legal = (amount: number) => [score('USUL_BILGISI', amount), inc('legal_hits')];

const ILGISIZ = [
  'ded_zarf',
  'ded_hayri_gormedi',
  'ded_bereli',
  'ded_kapuson',
  'ded_bere_ayni',
  'ded_birakan',
  'ded_buldu',
  'ded_teslim',
  'ded_kart_baskasi',
  'ev_hayri_ifade',
  'ev_klip',
];

const ilgisiz = (id: string, list: string[], who: string): ChoiceDef =>
  presentRule(id, undefined, list, {
    maxUses: 4,
    effects: [inc('wrong'), score('SORGULAMA', -50, 'hatali'), mark('BAD', `Delil doğru, tanık yanlış: bu bulgunun ${who} anlattıklarıyla ilgisi yok.`, 'SORGULAMA')],
    responses: B(`
hakim: Müdafi, bu belgenin tanığın anlattıklarıyla ilgisini kuramadım.
> Doğru kâğıt, yanlış tanık. Kâğıdı geri koydum.
`),
  });

const V0_GIRIS = `
mubasir: Tanık Volkan Sezer!
Otuzlarında, sakallı, Kent Ulaşım logolu bir polar. Elinde bir dosya; kürsüye bırakmadı, göğsüne bastırdı.
hakim: Kimliğiniz tespit edildi. Gerçeği söylemenin önemini biliyorsunuz. Yemininizi edin.
volkan: Bildiğimi dosdoğru söyleyeceğime namusum ve vicdanım üzerine yemin ederim.
volkan: Ben teknisyenim, Sayın Hâkim. Polis bir kayıt istedi, ben aktardım. Sistem böyle.
`;
const OZAN_GIRIS = `
mubasir: Tanık Ozan Kaplan!
Ozan kırmızı şapkasını çıkarıp cebine tıkmıştı. Saçları dikilmişti; kürsüye çıkarken bir basamağı atladı.
hakim: Sanıkla ilişkiniz?
ozan: Ev arkadaşıyım Sayın Hâkim. İki yıldır. Yemin ederim, bildiğimi dosdoğru söyleyeceğim. Yani… yemin ederim.
`;
const RC0_GIRIS = `
mubasir: Tanık Recep Ateş!
Recep lacivert yeleğiyle geldi; servis kıyafeti. Kürsüye çıkarken bir an durdu, merdivenin basamağını sayar gibi.
hakim: Kimliğiniz tespit edildi. Gerçeği söylemenin önemini, gerçeğe aykırı tanıklığın suç olduğunu biliyorsunuz. Yemin edin.
recep: Bildiğimi dosdoğru söyleyeceğime namusum ve vicdanım üzerine yemin ederim.
`;
const RC0_SORU = `
savci: Tanık, 6 Mart akşamı Görükle’de sanık size hiçbir şey uzatmadı, değil mi?
`;
const EK_GIRIS = `
hakim: Sanık, geçen celse eyleminizin TCK 142/2-b kapsamında değerlendirilebileceği hatırlatıldı. Ek savunmanız?
arda: Ben kimsenin çantasına el sürmedim, Sayın Hâkim. Özel beceri… Benim tek becerim kitap etiketlemek. Cüzdanı koltuğun altında buldum.
arda: Bildiğimi söyleyeyim, bilmediğimi söylemeyeyim: yanımda kim duruyordu, bilmiyorum. Kalabalıktı. Ama ben teyzeye dokunmadım. Bunu biliyorum.
`;
const EK_SON = `
hakim: Müdafi, ek savunmanız?
`;
export const trial: CasePart = {
  court: {
    sessions: [
      courtSession('cs_2', '2. Celse', [
        ['s2_acilis', 'ACILIS', 'H2_00'],
        ['s2_tanik', 'TANIK_DINLEME', 'H2_R1'],
        ['s2_ek', 'EK_SAVUNMA', 'H2_EK'],
        ['s2_mutalaa', 'MUTALAA', 'H2_MUT_1'],
        ['s2_savunma', 'SAVUNMA', 'H2_ESAS'],
        ['s2_son', 'SON_SOZ', 'H2_SON'],
        ['s2_karar', 'KARAR', 'H2_HUKUM'],
      ]),
    ],
  },
  nodes: [
    decisionNode('H2_00B', [{ to: 'H2_00C' }], {
      lines: [
        W(
          flag('anne_gelecek'),
          `
Dinleyici sırasının en arkasında, Kars’tan gece otobüsüyle gelmiş başörtülü bir kadın oturuyordu. Zehra yanındaydı. Kadın Arda’ya el salladı; Arda da ona.
> Kelepçesiz iki el. Yedi yıl önce bir karakolun önünde soğuk bir bankta bekleyen kadın, bugün sıcak bir salonda bekliyordu.
`,
        ),
        W(
          flag('anne_arda_karar'),
          `
Zehra dinleyici sırasındaydı; yanındaki yer boştu. Arda annesine “gelme, ben anlatırım” demişti. Kendi kararıyla.
`,
        ),
      ],
    }),
    decisionNode('H2_00C', [{ to: 'H2_00S' }], {
      lines: [
        W(
          any(flag('hayri_ozur'), flag('hayri_tesekkur')),
          `
Hayri Bey de gelmişti. Tanık olarak değil; dinleyici sırasında, şapkası dizlerinin üstünde. Beni görünce hafifçe başını eğdi.
`,
        ),
      ],
    }),
    decisionNode('H2_00', [{ to: 'H2_00B' }], {
      ...TRIAL,
      lines: [
        W(
          has('ev_tam_kayit'),
          `
# durusma_salonu | 17 KASIM · PAZARTESİ 10.15 — BURSA 9. ASLİYE CEZA, İKİNCİ CELSE
Yağmur dinmişti ama gökyüzü hâlâ ıslak bir battaniye gibi şehrin üstündeydi. Koridorda bu kez şemsiye yoktu; yalnızca bekleyen yüzler.
hakim: Ara karar cevapları okundu. Kent Ulaşım A.Ş.’den dört kanallı sefer kaydı ve kare dökümü geldi; kayıt duruşmada taraflarla birlikte izlendi.
`,
        ),
        O(`
# durusma_salonu | 17 KASIM · PAZARTESİ 10.15 — BURSA 9. ASLİYE CEZA, İKİNCİ CELSE
Yağmur dinmişti ama gökyüzü hâlâ ıslak bir battaniye gibi şehrin üstündeydi. Koridorda bu kez şemsiye yoktu; yalnızca bekleyen yüzler.
hakim: Ara karar cevapları okundu.
`),
      ],
    }),
    court2.stage('H2_00S', {
      title: 'İkinci celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      lines: [
        W(
          has('ev_cagri_kaydi'),
          `
hakim: Büyükşehir Belediyesinden 6 Mart 19.18 tarihli çağrı kaydı geldi; okundu.
savci: Okundu, Sayın Hâkim. Diyeceğim tanıklar dinlendikten sonra.
Arda bu kez kravat takmamıştı. Kendi gömleği, kendi yakası. Elleri dizlerinin üstündeydi; titremiyordu.
`,
        ),
        O(`
Arda bu kez kravat takmamıştı. Kendi gömleği, kendi yakası. Elleri dizlerinin üstündeydi; titremiyordu.
`),
      ],
      choices: [cont('H200_DEVAM', 'Tanıklar', 'H2_IZLE_R')],
    }),

    decisionNode('H2_IZLE_R', [{ when: has('ev_tam_kayit'), to: 'H2_IZLE' }, { to: 'H2_R1' }]),
    {
      id: 'H2_IZLE',
      type: 'CHOICE',
      ...court2.base,
      title: 'Tam kaydın izlenmesi',
      background: 'durusma_salonu',
      prompt: { speaker: 'hakim', text: 'Müdafi, tam kayıttan duruşmada ayrıca göstermek istediğiniz bölüm var mı?' },
      lines: B(`
Salonun duvarına bir perde indirildi. Kâtip ışıkları yarıya kıstı. Dört gri pencere: ön, orta, orta kapı, arka.
> İki buçuk dakika yedi ay boyunca bu dosyanın bütün hafızasıydı. Şimdi bir saatlik bir hafıza vardı ve hangi dakikasının konuşacağını ben seçecektim.
`),
      choices: [
        option('IZ_BIRAKMA', '18.31–18.37: şemsiye, çanta, koltuk altı ve Altıparmak’ta iniş', {
          next: '$stay',
          visibleWhen: any(has('clue_kare_birakma'), has('ded_birakan')),
          effects: [inc('pers'), score('DELIL_ANALIZI', 80), raise('izlendi_birakma')],
          good: 'Kaydın tam da savcılığın görmediği dakikaları seçildi: cüzdanın sanıktan önce başka birinin elinde olduğu ve o kişinin araçtan indiği.',
          category: 'DELIL_ANALIZI',
          responses: B(`
Perdede orta kapı. Açık bir şemsiye, yeşil bir bere. Kadının arkasında kapüşonu başında bir parka. Bir el, bir bez çanta.
18.36: arka kamera. Parkalı adam eğiliyor; 14 numaranın altına koyu bir şey bırakıyor. 18.37: ön kapı. İkisi iniyor. Altıparmak.
Salonda kimse konuşmadı. Ön sırada Gülten Hanım elini ağzına götürdü. Savcı kalemini bıraktı ve perdeye eğildi.
hakim: Kâtip hanım, 18.36 ve 18.37 karelerinin tutanağa ayrıca geçirilmesini istiyorum.
`),
        }),
        option('IZ_SORU', '18.43: CD’de olmayan dakika', {
          next: '$stay',
          visibleWhen: has('clue_kare_soru'),
          effects: [inc('pers'), score('DELIL_ANALIZI', 60), raise('izlendi_soru')],
          good: 'CD’ye yazılamayan dakikanın tam kayıttaki karşılığı gösterildi: sanığın yanındaki yolcuya cüzdanı sorduğu an.',
          category: 'DELIL_ANALIZI',
          responses: B(`
Perdede arka kamera, 18.43. Arda cüzdanı açık tutuyor, yanındaki yolcuya uzatıyor. Yolcu başını iki yana sallıyor.
arda: Yanımdakine sordum demiştim…
Arda bunu kimseye söylemedi aslında; kendine söyledi. Yedi aydır kimsenin inanmadığı bir cümle, perdede on saniye sürdü.
`),
        }),
        option('IZ_HEPSI', 'Bir saatin tamamı baştan sona izlensin', {
          next: '$stay',
          effects: [dec('pers')],
          neutral: 'Kayıt dosyada ve taraflarca izlendi; hangi dakikanın neyi gösterdiğini seçmek müdafiin işi. Bir saati yeniden izletmek hâkimin sabrını sınar, bir şey eklemez.',
          responses: B(`
hakim: Kayıt zaten taraflarla birlikte izlendi, müdafi. Hangi dakikayı göstermek istediğinizi söyleyin.
> Hâkimin sabrı da bir kaynak. Onu boşa harcadım.
`),
        }),
        cont('IZ_BITIR', 'Başka bölüm yok', 'H2_R1'),
      ],
    },

    // Yönlendiriciler: çağrılan tanıklar sırayla.
    decisionNode('H2_R1', [{ when: flag('volkan_cagrildi'), to: 'H2_V0' }, { to: 'H2_R2' }]),
    decisionNode('H2_R2', [{ when: flag('recep_cagrildi'), to: 'H2_RC0' }, { to: 'H2_R3' }]),
    decisionNode('H2_KORIDOR_R', [{ when: flag('contra_r'), to: 'H2_KORIDOR' }, { to: 'H2_R3' }]),
    story('H2_KORIDOR', {
      ...court2.base,
      title: 'Kısa ara',
      background: 'adliye',
      lines: B(`
hakim: On dakika ara.
Koridor sıcaktı, kalabalıktı. Recep Ateş pencerenin önünde duruyordu; elinde bir sigara paketi, yakmıyordu. Arda’yı görünce doğruldu.
recep: Evlat… Kusura bakma. Yedi aydır o on bir saniye gözümün önünde. Bir tutanak yemeyeyim diye seni yaktım.
Arda bir şey söylemedi. Bana baktı. Ne yapmasını istediğimi soruyordu.
> Recep dinlenmiş bir tanık. Arda sanık. Aralarında ne konuşulacağına ben karar veremem; ama Arda’nın neye karar vereceğini ona bırakabilirim.
`),
      choices: [
        option('KR_ARDA', '“Sen bilirsin Arda.”', {
          effects: [raise('arda_recep_affetti'), inc('trust', 3)],
          responses: B(`
arda: Ben de ısrar etmedim abi. İkimiz de acele ettik. Ben bir cüzdan için, sen bir tutanak için.
Recep başını salladı. Sigara paketini cebine koydu. Gitti.
> Arda bir öğretmen gibi konuştu. Kimseyi küçültmeden, kimseyi aklamadan. Bunu bir ders kitabında okumamıştı.
`),
          next: 'H2_R3',
        }),
        option('KR_UZAK', '“Şimdi değil. Duruşma bitmeden konuşmayalım.”', {
          effects: [raise('arda_recep_uzak')],
          responses: B(`
P: Recep Bey, şimdi değil. Duruşma bitsin.
recep: Haklısınız. Haklısınız.
Recep uzaklaştı. Arda onun arkasından baktı.
arda: O da korkmuş hocam. Ben polisten, o patrondan.
`),
          next: 'H2_R3',
        }),
      ],
    }),
    decisionNode('H2_R3', [{ when: flag('gulten_tanik'), to: 'H2_GULTEN' }, { to: 'H2_R4' }]),
    decisionNode('H2_R4', [{ when: flag('ozan_istendi'), to: 'H2_OZAN' }, { to: 'H2_R5' }]),
    decisionNode('H2_R5', [{ when: flag('sebeke_yakalandi'), to: 'H2_ORHAN' }, { to: 'H2_EK' }]),

    court2.stage('H2_V0', {
      title: 'Tanık Volkan Sezer',
      courtStage: 'TANIK_DINLEME',
      witness: 'volkan',
      witnessLabel: 'TANIK · VOLKAN SEZER',
      onFirstEnter: [meet('volkan'), ifThen(flag('volkan_kizgin'), [dec('pers')])],
      lines: [
        W(
          flag('volkan_kizgin'),
          V0_GIRIS +
            `
volkan: Bir de şunu söyleyeyim: savunma avukatı geçen hafta yanıma geldi, mahkemede “eksik aktardım” dememi önerdi. Ben ne gördüysem onu söylerim.
hakim: Not edildi. Müdafi, tanıklarla temasınızın sınırlarını bildiğinizi umuyorum.
> Başımı eğdim. Volkan’ın söyleyeceği doğruyu artık benim telkinimden ayırmak zorundaydı hâkim.
`,
        ),
        W(
          flag('volkan_anlatti'),
          V0_GIRIS +
            `
Volkan kürsüden bana baktı. Teknik odadaki konuşmamızı hatırlıyordu; ne diyeceğini değil, ne bildiğini sormuştum. Bu kez dosyayı göğsünden indirdi.
`,
        ),
        O(V0_GIRIS),
      ],
      choices: [cont('HV0_DEVAM', 'İfadesini dinle', 'H2_V')],
    }),
    court2.testimony('H2_V', {
      title: 'Volkan Sezer · çapraz sorgu',
      courtStage: 'TANIK_DINLEME',
      witness: 'volkan',
      witnessLabel: 'TANIK · VOLKAN SEZER',
      say: S(`
hakim: Müdafi, sorularınız?
`),
      rulesText: 'Önce bastır, sonra sun. Teknik tanık dürüst olabilir ama eksik bırakmış olabilir.',
      objectionGrounds: ['g_kanaat', 'g_duyum'],
      statements: [
        statement('VS1', 1, ['Polisin talep ettiği kaydı ', hl('eksiksiz aktardım', any(flag('press_vs1'), has('ded_eksik_kayit'))), '.']),
        statement('VS1B', 2, ['Talep edilen aralığı ve talep edilen kamerayı. Memur bey ', hl('“olay anı yeterli”', always), ' dedi.'], flag('press_vs1')),
        statement('VS2', 3, ['Olay anı 18.42’ydi. ', hl('Öncesi dosyayı ilgilendirmiyordu', always), '.']),
        statement('VS3', 4, ['CD’deki kayıt bütündür; ', hl('kesinti yoktur', any(flag('press_vs3'), has('clue_bozuk_segment'))), '.']),
        statement('VS3B', 5, ['Sistem bazen segment atlar ama… ', hl('o kayıtta öyle bir şey hatırlamıyorum', always), '.'], flag('press_vs3')),
      ],
      rules: [
        pressRule('PR_VS1', 'VS1', {
          effects: [score('SORGULAMA', 25), raise('press_vs1')],
          responses: B(`
P: Eksiksiz derken: polis hangi kamerayı ve hangi aralığı istedi?
volkan: KAM-2, orta kamera. 18.42’den itibaren iki buçuk dakika. Memur bey ekrana bakıp “olay anı bu, yeterli” dedi.
`),
        }),
        presentRule('PS_VS1B', 'VS1B', ['ded_eksik_kayit', 'ev_tam_kayit'], {
          effects: [score('SORGULAMA', 300), inc('pers', 2), raise('contra_v'), mark('GOOD', 'Teknisyen, CD’nin bir saatlik dört kanallı kaynağın yalnızca tek kanalı ve 2,5 dakikası olduğunu kabul etti. “Eksiksiz” olan aktarım değil, talepti.', 'SORGULAMA')],
          responses: B(`
P: Aktarım formunuza göre kaynak dosya bir saatlik ve dört kanallı: SEFER_0306_1810-1910. Siz bunun tek kanalını ve iki buçuk dakikasını aktardınız.
P: Yani eksiksiz olan aktarım değil, talep. Kaydın kendisi, mahkemenin istemesiyle üç hafta önce geldi; dört kamera, bir saat.
volkan: Doğru. Ben isteneni aktardım. Kaynak olay klasöründeydi. Kimse istemedi… ta ki mahkeme isteyene kadar.
volkan: Olay anı… olay anını polis belirledi. Ben belirlemedim.
`),
        }),
        presentRule('PS_VS1_ERKEN', 'VS1', ['ded_eksik_kayit', 'ev_tam_kayit'], {
          maxUses: 3,
          responses: B(`
> “Eksiksiz.” Neyi eksiksiz aktardığını önce ona söyletmeliyim. Kâğıdı indirdim.
`),
        }),
        objectRule('OB_VS2', 'VS2', 'g_kanaat', {
          effects: [score('SORGULAMA', 50), inc('pers'), raise('ob_vs2'), mark('GOOD', 'Hangi dakikanın dosyayı ilgilendirdiğine teknisyen değil mahkeme karar verir; tanığın bu cümlesi bir değerlendirme.', 'SORGULAMA')],
          responses: B(`
P: İtiraz ediyorum. Neyin dosyayı ilgilendirdiği tanığın değil, mahkemenin takdirindedir.
hakim: Yerinde. Tanık, teknik olarak ne yaptığınızı anlatın.
`),
        }),
        pressRule('PR_VS3', 'VS3', {
          effects: [score('SORGULAMA', 25), raise('press_vs3')],
          responses: B(`
P: CD’deki zaman damgaları kesintisiz mi? 18.42.59’dan sonra hangi saniye geliyor?
volkan: Kesintisiz olması lazım. Sistem bazen segment atlar ama… o kayıtta öyle bir şey hatırlamıyorum.
`),
        }),
        presentRule('PS_VS3B', 'VS3B', ['ev_aktarim_formu'], {
          enabledWhen: has('clue_bozuk_segment'),
          effects: [score('SORGULAMA', 200), inc('pers'), raise('contra_v2'), mark('GOOD', 'Teknisyenin kendi formundaki dipnot, CD’de 18.43’ün tamamının eksik olduğunu gösteriyor. Delilin bütünlüğü çöktü.', 'SORGULAMA')],
          responses: B(`
P: Sizin imzanızı taşıyan aktarım formu, dipnot: “18.43.00–18.43.59 yazma hatası, yeniden denenmedi.” Siz yazmışsınız.
Volkan formu aldı. Gözleri dipnotta durdu. Bir an sustu.
volkan.uzgun: Gece yarısıydı. Yazma hatası verdi, dipnot düştüm. Yeniden denemedim. Memur bey acele ediyordu.
volkan: O dakika olay klasöründeki kayıtta var. CD’de yok. Haklısınız.
`),
        }),
        presentRule('PS_VS3B_BOS', 'VS3B', ['ev_aktarim_formu'], {
          maxUses: 2,
          responses: B(`
> Formu kaldırdım. Neyi göstereceğimi bilmiyordum. Formu yeniden okumadan bu kâğıdı tanığa uzatamazdım.
`),
        }),
        ilgisiz('PS_VOLKAN_ILGISIZ', [...ILGISIZ, 'ded_sofor_red', 'ded_niyet_tam', 'ev_recep_ifade'], 'teknisyenin'),
      ],
      presentMiss: fallback('FB_H2V_PRESENT', 'PRESENT', {
        effects: [...(wrongPresent ?? []), mark('BAD', 'Bu delil tanığın ifadesindeki hiçbir şeyi çürütmüyor.', 'SORGULAMA')],
        responses: B(`
hakim: Bu delilin tanığın beyanıyla ilgisi görülmedi, müdafi.
`),
      }),
      objectMiss: fallback('FB_H2V_OBJECT', 'OBJECT', {
        effects: [dec('cred'), score('SORGULAMA', -50, 'hatali'), mark('BAD', 'Dayanaksız itiraz.', 'SORGULAMA')],
        responses: B(`
hakim: İtiraz reddedildi.
`),
      }),
      finish: { id: 'H2V_BITIR', label: 'Çapraz sorguyu bitir', next: 'H2_R2' },
    }),

    court2.objection('H2_RC0', {
      title: 'Tanık Recep Ateş',
      courtStage: 'TANIK_DINLEME',
      witness: 'recep',
      witnessLabel: 'TANIK · RECEP ATEŞ',
      onFirstEnter: [meet('recep')],
      lines: [
        W(
          flag('recep_sucduyurusu'),
          RC0_GIRIS +
            `
Recep’in yanında bu kez genç bir avukat vardı; Kent Ulaşım’ın. Recep bana bakmıyordu. Avukatı bakıyordu.
` +
            RC0_SORU,
        ),
        O(RC0_GIRIS + RC0_SORU),
      ],
      next: 'H2_RC',
      options: [
        option('HRC0_A', 'İtiraz: soru cevabı içeriyor (CMK 201/1)', {
          effects: [...legal(100), inc('pers')],
          good: 'Savcının sorusu cevabı tanığın ağzına veriyordu; telkinli soruya itiraz edildiğinde hâkim sorunun sorulup sorulmayacağına karar verir (CMK 201/1).',
          category: 'USUL_BILGISI',
          responses: B(`
P: İtiraz. Soru cevabı içeriyor Sayın Hâkim.
hakim: Yerinde. Sayın Savcı, açık sorun.
savci: Tanık, o akşam son durakta ne oldu?
`),
        }),
        option('HRC0_B', 'Sessiz kal', {
          effects: [dec('pers')],
          neutral: 'Telkinli soru cevaplandı; tanığın “hayır”ı savcının cümlesine yaslandı. İtiraz edilebilirdi (CMK 201/1).',
          responses: B(`
recep: Hayır. Kimse bir şey uzatmadı.
`),
        }),
        option('HRC0_C', 'İtiraz: tanık yalan söyleyecek', {
          effects: [dec('cred'), score('USUL_BILGISI', -50, 'hatali')],
          bad: 'Bir tanığın ne söyleyeceğini önceden yalan diye nitelemek dayanaksız bir itirazdır; itiraz bir usul kuralına dayanmalı.',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Tanık henüz konuşmadı. Reddedildi.
`),
        }),
      ],
    }),
    court2.testimony('H2_RC', {
      title: 'Recep Ateş · çapraz sorgu',
      courtStage: 'TANIK_DINLEME',
      witness: 'recep',
      witnessLabel: 'TANIK · RECEP ATEŞ',
      say: S(`
hakim: Müdafi, sorularınız?
`),
      rulesText: 'Korkan tanık yalanını ancak bir kare zorlarsa değiştirir. Tanığı utandırma; kaydı göster.',
      objectionGrounds: ['g_kanaat', 'g_duyum'],
      statements: [
        statement('RS1', 1, ['O akşam bana ', hl('kimse cüzdan falan getirmedi', any(flag('press_rs1'), has('clue_kare_sofor'), has('ded_sofor_red'))), '.']),
        statement('RS2', 2, ['Kural belli: bulunan eşyayı alırım, ', hl('buluntu defterine yazarım', flag('press_rs2')), '.']),
        statement('RS2B', 3, ['O gün defter boş. ', hl('Demek ki getiren olmadı', always), '.'], flag('press_rs2')),
        statement('RS3', 4, ['Görükle son durak. Herkes iner. ', hl('Ben kimseye bakmam', flag('press_rs3')), '.']),
      ],
      rules: [
        pressRule('PR_RS1', 'RS1', {
          effects: [score('SORGULAMA', 25), raise('press_rs1')],
          responses: B(`
P: Hiç kimse? Görükle’de ön kapıya gelip size bir şey uzatan bir genç olmadı mı?
recep: Hatırlamıyorum. Yani… hayır. Olmadı.
`),
        }),
        presentRule('PS_RS1', 'RS1', ['ded_sofor_red', 'ev_tam_kayit'], {
          enabledWhen: all(any(has('ded_sofor_red'), has('clue_kare_sofor')), not(flag('recep_sucduyurusu'))),
          effects: [score('SORGULAMA', 300), inc('pers', 2), raise('contra_r'), mark('GOOD', 'Ön kameranın 19.05 karesi, şoförün “kimse getirmedi” beyanını çürüttü: sanık cüzdanı şoföre uzatıyor, şoför geri çeviriyor.', 'SORGULAMA')],
          responses: B(`
P: Sayın Hâkim, tam kaydın ön kamerası, 19.05, Görükle. İzlettirmek istiyorum.
Ekranda şoför kabini. Bir el kabine uzanıyor; elde kahverengi bir cüzdan. Şoförün eli havada sallanıyor, kapıyı gösteriyor. On bir saniye.
Salonda kimse konuşmadı. Recep ekrana bakmadı. Sonra baktı.
recep.uzgun: Ben… Yorgundum. On iki saattir direksiyondaydım. Çocuk bir şey uzattı. “Ben bakamam, yarın kayıp eşya bürosuna götür” dedim.
recep.uzgun: Deftere yazsam tutanak olur, terminale ben götürürüm, mesai biter… İki tutanağım var. Üçüncüsünde kapı dışarı. Polise “kimse getirmedi” dedim.
hakim: Tanık, kendinizi ceza kovuşturmasına uğratabilecek sorulara cevap vermekten çekinebilirsiniz. Bunu bilerek mi konuşuyorsunuz?
recep: Biliyorum Sayın Hâkim. Yedi aydır uyuyamıyorum. Söyleyeyim de bitsin. Çocuk bana verdi. Ben almadım. [shake]
Arda gözlerini kapadı. Zehra’nın elini sıktığını gördüm; kemikleri beyazlamıştı.
`),
        }),
        presentRule('PS_RS1_CEKINME', 'RS1', ['ded_sofor_red', 'ev_tam_kayit'], {
          enabledWhen: all(any(has('ded_sofor_red'), has('clue_kare_sofor')), flag('recep_sucduyurusu')),
          effects: [score('SORGULAMA', 150), inc('pers'), raise('recep_cekindi'), mark('NEUTRAL', 'Kare ortada; ama hakkında suç duyurusu bulunan tanık, kendisini suçlayabilecek soruya cevap vermekten çekindi (CMK 48). Gerçek tanığın ağzından değil, yalnızca kayıttan çıktı.', 'SORGULAMA')],
          responses: B(`
Ekranda şoför kabini, uzanan bir el, sallanan bir el. On bir saniye.
Recep’in avukatı ayağa kalktı.
@TANIK VEKİLİ: Sayın Hâkim, müvekkilim hakkında savunmanın suç duyurusu var. Kendisini suçlayabilecek sorulara cevap vermekten çekiniyor.
hakim: Çekinme hakkı hatırlatıldı. Kayıt dosyada; değerlendirilecek.
> Kare konuştu. Recep susmayı seçti. Onu susturan bendim.
`),
        }),
        presentRule('PS_RS1_ERKEN', 'RS1', ['ded_sofor_red', 'ev_tam_kayit'], {
          maxUses: 2,
          responses: B(`
> Elimdeki kayıtta o anı henüz görmedim. Görmediğim bir kareyi tanığa gösteremem.
`),
        }),
        pressRule('PR_RS2', 'RS2', {
          effects: [score('SORGULAMA', 25), raise('press_rs2')],
          responses: B(`
P: 6 Mart’ta deftere ne yazdınız?
recep: Hiçbir şey. O gün defter boş. Demek ki getiren olmadı.
`),
        }),
        pressRule('PR_RS3', 'RS3', {
          effects: [score('SORGULAMA', 25), raise('press_rs3')],
          responses: B(`
P: Kimseye bakmıyorsanız, kimsenin bir şey getirmediğini nereden biliyorsunuz?
recep.kizgin: Getirse görürdüm. Yani… görmem lazım. Görürdüm.
`),
        }),
        presentRule('PS_RS3', 'RS3', ['ev_recep_ifade'], {
          enabledWhen: flag('press_rs3'),
          effects: [score('SORGULAMA', 100), inc('pers'), raise('contra_r_kismi')],
          responses: B(`
P: Kolluk beyanınızda da aynı iki cümle var: “Kimse bir şey getirmedi” ve “ben kimseye bakmam.” İkisi aynı anda doğru olabilir mi?
recep: Ben… alışkanlıkla söyledim. Bakmam derken… Son durakta herkes acele eder.
> Kısmi bir çatlak. Duvar duruyor ama sıvası döküldü.
`),
        }),
        ilgisiz('PS_RECEP_ILGISIZ', [...ILGISIZ, 'ded_eksik_kayit', 'ev_aktarim_formu', 'ded_niyet_tam'], 'şoförün'),
      ],
      presentMiss: fallback('FB_H2RC_PRESENT', 'PRESENT', {
        effects: [...(wrongPresent ?? []), mark('BAD', 'Bu delil tanığın ifadesindeki hiçbir şeyi çürütmüyor.', 'SORGULAMA')],
        responses: B(`
hakim: Bu delilin tanığın beyanıyla ilgisi görülmedi, müdafi.
`),
      }),
      objectMiss: fallback('FB_H2RC_OBJECT', 'OBJECT', {
        effects: [dec('cred'), score('SORGULAMA', -50, 'hatali'), mark('BAD', 'Dayanaksız itiraz.', 'SORGULAMA')],
        responses: B(`
hakim: İtiraz reddedildi.
`),
      }),
      finish: { id: 'H2RC_BITIR', label: 'Çapraz sorguyu bitir', next: 'H2_KORIDOR_R' },
    }),

    {
      id: 'H2_GULTEN',
      type: 'CHOICE',
      ...court2.base,
      title: 'Müştekinin beyanı',
      background: 'durusma_salonu',
      prompt: { speaker: 'hakim', text: 'Müdafi, müştekiye sorunuz var mı?' },
      lines: B(`
gulten: Sayın Hâkim, ben bir şey söylemek istiyorum. Kimse bana ne söyleyeceğimi söylemedi. Onu da söyleyeyim.
gulten: Geçen celse bu çocuk “Facebook’tan yazdım” dedi. Ben Facebook bilmem. Torunum baktı. Yazmış. Olay günü, gece dokuzu çeyrek geçe.
gulten: “Cüzdanınızı buldum, size nasıl ulaştırabilirim” diye yazmış. Ben o saatte karakolda “cezasını çeksin” diyordum.
gulten.uzgun: Fotoğrafa dokunmamış. Kimliğin arkasında, nasıl koyduysam öyle. Hırsız fotoğraf almaz ama atar. Bu atmamış.
gulten: Ben şikâyetimi geri alamazmışım, öyle dediler. Ama şunu söyleyebilirim: ben bu çocuğun cüzdanımı çaldığına artık inanmıyorum.
Savcı kalemini bıraktı. Hâkim müştekiye uzun uzun baktı ve kâtibe döndü: “Aynen yazın.”
`),
      choices: [
        cont('HG_YOK', 'Sorum yok', 'H2_R4', {
          effects: [inc('pers'), score('SAVUNMA_STRATEJISI', 60)],
          quality: { q: 'GOOD', feedback: 'Müştekinin kendi cümlesini olduğu gibi bırakmak en güçlü hamleydi; soru onu ancak zayıflatırdı.', category: 'SAVUNMA_STRATEJISI' },
        }),
        option('HG_MESAJ', '“Mesajı mahkemeye gösterebilir misiniz?”', {
          next: 'H2_R4',
          effects: [score('SORGULAMA', 40)],
          neutral: 'Mesajın dosyaya girmesi yararlı; ama müştekinin sözü zaten tutanağa aynen geçti.',
          responses: B(`
gulten: Elif, kızım, telefonu ver. Hâkim hanım baksın.
Hâkim telefona baktı, ekran görüntüsünün dosyaya konmasını istedi.
`),
        }),
        option('HG_GERIAL', '“Şikâyetinizi geri aldığınızı tutanağa geçirelim mi?”', {
          next: 'H2_R4',
          effects: [dec('pers'), score('USUL_BILGISI', -40, 'hatali')],
          bad: 'Hırsızlık şikâyete bağlı değildir; şikâyetten vazgeçme kamu davasını düşürmez. Müştekiye bunu duruşmada sormak, onun güçlü beyanını bir pazarlık gibi gösterdi.',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Müdafi, suç şikâyete bağlı değil, biliyorsunuz. Müştekinin beyanı tutanakta.
gulten: Ben ne dediysem o. Fazlasını istemeyin benden.
`),
        }),
      ],
    },

    court2.stage('H2_OZAN', {
      title: 'Tanık Ozan Kaplan',
      courtStage: 'TANIK_DINLEME',
      witness: 'ozan',
      witnessLabel: 'TANIK · OZAN KAPLAN',
      onFirstEnter: [meet('ozan'), ifThen(flag('ozan_ezber'), [dec('pers')])],
      lines: [
        W(
          flag('ozan_ezber'),
          OZAN_GIRIS +
            `
ozan: O gece on bir sularında, mutfağa giderken, sanığın masasında el yazısıyla yazılmış bir not gördüm, Sayın Hâkim. Notta…
savci: Sayın Hâkim, tanık ezberden okuyor gibi. Tanık, kendi cümlelerinizle anlatın lütfen.
Ozan kızardı. Cebindeki kâğıda dokundu, sonra elini çekti.
`,
        ),
        O(OZAN_GIRIS),
      ],
      choices: [
        option('HO_NOT', '“O gece masadaki sarı notu ne zaman gördün?”', {
          next: 'H2_R5',
          effects: [inc('pers'), score('SORGULAMA', 60), raise('ozan_dinlendi')],
          good: 'Tanığın doğrudan gözlemine dayanan açık bir soru: notun olaydan önce, polis gelmeden yazıldığı tutanağa geçti.',
          category: 'SORGULAMA',
          responses: B(`
ozan: Gece on bir gibi. Mutfağa su almaya kalktım, Arda’nın kapısı açıktı. Masada sarı not: “Yarın 9 — karakol.” Sordum, “ne karakolu” diye.
ozan: “Otobüste cüzdan buldum, sahibine ulaşamadım, yarın götüreceğim” dedi. Sabah polis kapıya geldiğinde saat sekiz çeyrekti. Arda daha diş fırçalıyordu.
savci: Notu kim yazdı, gördünüz mü?
ozan: Arda’nın el yazısı. Benim alışveriş listemi bile o yazar, benim yazım okunmaz.
`),
        }),
        option('HO_KARAKTER', '“Arda nasıl biridir?”', {
          next: 'H2_R5',
          effects: [score('SORGULAMA', 10)],
          neutral: 'Karakter tanıklığı insani ama ispat değeri zayıf; tanığın doğrudan gördüğü notu sormak daha güçlüydü.',
          responses: B(`
ozan: Dürüst biri. Fazla dürüst. Markette fazla verilen para üstünü geri götürür. Ben ona kızarım.
`),
        }),
      ],
    }),

    court2.objection('H2_ORHAN', {
      title: 'Tanık Bşk. Orhan Kılınç',
      courtStage: 'TANIK_DINLEME',
      witness: 'orhan',
      witnessLabel: 'TANIK · BŞK. ORHAN KILINÇ',
      onFirstEnter: [meet('orhan')],
      say: S(`
mubasir: Tanık Orhan Kılınç!
Ellilerinde, ağır adımlı, kır saçlı bir adam. Kürsüye bir dosya bıraktı; dosyanın sırtında altı ayrı numara vardı.
orhan: Asayiş Şube, hırsızlık büro. Hat 38 ve Hat 19’da aynı yöntemle işlenmiş altı yankesicilik dosyası takip ediyorum, Sayın Hâkim.
orhan: Yöntem hep aynı: kalabalıkta biri şemsiyeyle perde yapar, öbürü çantadan cüzdanı alır. Nakit ve kartlar çıkarılır, cüzdan koltuk altına bırakılır.
orhan: Kartlar yarım saat içinde, şifresiz sınırın altında kalınarak, birkaç parça hâlinde harcanır.
orhan: Savunmanın dilekçesindeki kareler ve büfe sahibinin ifadesi üzerine 15 Kasım akşamı Hat 19’da iki kişiyi yakaladık: Kenan ve Sevda T.
orhan: Üzerlerinden on dört banka kartı çıktı. Biri müşteki Gülten Sarı adına. Altıparmak’taki büfenin sahibi kadını yeşil beresinden ve eldiveninden tanıdı; usulüne uygun teşhis tutanağı dosyada.
savci: Sayın Hâkim, bu başka bir soruşturmanın konusu. Bu dosyayla ilgisi tartışmalı.
hakim: Müdafi?
`),
      next: 'H2_EK',
      options: [
        option('HOR_A', '“Aynı cüzdan, aynı akşam, aynı otobüs. Hükme esas alınabilecek her delil duruşmada tartışılmalı (CMK 217/1).”', {
          effects: [...legal(120), inc('pers', 2), raise('orhan_dinlendi')],
          good: 'Hâkim kararını duruşmaya getirilmiş ve tartışılmış delillere dayandırır (CMK 217/1); ispat edilmek istenen olayla doğrudan ilgili delil reddedilemez (CMK 206/2-b karşıtı). Başka soruşturmanın konusu olması, bu dosyadaki ispat değerini ortadan kaldırmaz.',
          category: 'USUL_BILGISI',
          responses: B(`
P: Sayın Hâkim, müştekinin kartı başka bir dosyadaki iki kişinin üzerinden çıktı. Aynı cüzdan, aynı akşam, aynı hat. Bu, bu dosyanın tam kalbi.
P: Karar duruşmada tartışılmış delile dayanacaksa, bu delil bu salonda tartışılmalı.
hakim: Tanığın beyanı ve teşhis tutanağının örneği dosyaya alınsın. Sayın Savcı, değerlendirmenizi mütalaada yaparsınız.
`),
        }),
        option('HOR_B', '“Diyeceğimiz yok.”', {
          effects: [raise('orhan_dinlendi')],
          neutral: 'Beyan dosyaya girdi; ama savcının itirazı karşılıksız kaldı. Delilin bu dosyayla ilgisini göstermek müdafiin işiydi.',
          responses: B(`
hakim: Tanığın beyanı tutanağa geçti; ilgisi hükümde değerlendirilecek.
`),
        }),
        option('HOR_C', '“Sanığı da bu şebekenin kurbanı ilan edelim; tazminat isteriz.”', {
          effects: [dec('pers'), score('SAVUNMA_STRATEJISI', -40)],
          bad: 'Tazminat (CMK 141–142) ayrı bir yoldur ve beraat sonrasında istenir; duruşmanın bu anında konu delilin ilgisini göstermekti.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
hakim: Tazminat ayrı bir yol, müdafi. Şimdi delili tartışıyoruz.
`),
        }),
      ],
    }),

    decisionNode('H2_EK', [{ when: flag('false_confession'), to: 'H2_EK_IKRAR' }, { to: 'H2_EK_S' }]),
    story('H2_EK_IKRAR', {
      ...court2.base,
      title: 'Ek savunma',
      background: 'durusma_salonu',
      onFirstEnter: [dec('pers', 2)],
      lines: B(`
hakim: Sanık, geçen celse eyleminizin TCK 142/2-b kapsamında değerlendirilebileceği hatırlatıldı. Ek savunmanız?
Arda ayağa kalktı. Bana baktı. Ben başımı eğdim.
arda: Suçlamayı… kabul ediyorum. Cüzdanı aldım. Zararı ablam ödedi, makbuzu dosyada. Pişmanım.
Ön sırada Gülten Hanım başını kaldırdı. Torunu Elif’in elindeki telefon yere düştü.
gulten.saskin: Ama… sen bana yazmıştın evladım?
Arda cevap vermedi. Sesi bitmişti.
savci: Sayın Hâkim, sanığın ikrarı ve zararın giderilmesi karşısında etkin pişmanlık değerlendirilmelidir.
> Tutanağa bir yalan geçti. Benim cümlem, Arda’nın sesiyle.
`),
      choices: [cont('HEKI_DEVAM', 'Mütalaa', 'H2_MUT_1')],
    }),
    {
      id: 'H2_EK_Q',
      type: 'CHOICE',
      ...court2.base,
      title: 'Savcının sorusu',
      background: 'durusma_salonu',
      prompt: {
        speaker: 'savci',
        text: 'Sanık, şoför cüzdanı almadıysa neden en yakın polis noktasına gitmediniz? Görükle durağının karşısında bir karakol var.',
      },
      lines: B(`
hakim: Sayın Savcı, ek savunmaya ilişkin sorunuz var mı?
savci: Bir sorum var, Sayın Hâkim.
`),
      choices: [
        option('HEQ_CEVAP', 'Arda cevap versin', {
          next: 'H2_MUT_1',
          effects: [ifThen(any(flag('ek_hazir'), flag('arda_utanc_mahkemede'), flag('arda_lise_hazir')), [inc('pers')], [dec('pers')])],
          neutral: 'Soru meşru; sanığın kendi cümlesiyle verdiği dürüst cevap, ek savunma hazırlığının sınavıdır.',
          responses: [
            W(
              any(flag('ek_hazir'), flag('arda_utanc_mahkemede'), flag('arda_lise_hazir')),
              `
arda: Gittim, Sayın Savcı. Kapısına kadar. Sonra döndüm. Nedenini geçen celse anlattım; bugün tekrar anlatırım. Korktum.
arda: Ama korkup cüzdanı atmadım, saklamadım. Belediyeyi aradım. Sahibine yazdım. Sabaha not yazdım. Korkan biri bunları yapar mı bilmiyorum. Ben yaptım.
savci: Teşekkür ederim.
> Savcı başka soru sormadı. Bazen bir savcının susması, bir hâkimin konuşmasından daha çok şey söyler.
`,
            ),
            O(`
arda.saskin: Ben… gidecektim. Sabah. Geç olmuştu.
savci: Karakollar gece de açıktır, sanık.
> Arda’nın gözleri bana döndü. Bu soruyu onunla önceden konuşmalıydım. Konuşmadım.
`),
          ],
        }),
        option('HEQ_ITIRAZ', 'İtiraz: sanık bu soruyu ilk celsede cevapladı', {
          next: 'H2_MUT_1',
          effects: [score('USUL_BILGISI', -30)],
          neutral: 'Soru yeni bir olguya (durağın karşısındaki karakol) dayanıyordu; itiraz zayıf kaldı ve hâkim soruya izin verdi.',
          responses: B(`
hakim: Soru yeni bir hususa ilişkin, müdafi. Sanık cevap versin.
arda: Kapısına kadar gittim. Döndüm. Korktum.
`),
        }),
      ],
    },
    court2.objection('H2_EK_S', {
      title: 'Ek savunma (CMK 226)',
      courtStage: 'EK_SAVUNMA',
      lines: [
        W(
          any(flag('arda_lise_hazir'), flag('arda_utanc_mahkemede')),
          EK_GIRIS +
            `
arda: Bir şey daha söylemek istiyorum. O gece karakola gitmedim. Kapısına kadar gittim, döndüm. Lisede yapmadığım bir şey için bir gece nezarette kaldım.
arda: Korktum. Bu bir suç değil, biliyorum. Ama ayıp. Ayıbımı söyledim. Suçum yok.
` +
            EK_SON,
        ),
        O(EK_GIRIS + EK_SON),
      ],
      next: 'H2_EK_Q',
      options: [
        option('EK_HICBIRI', 'Ne hırsızlık ne kayıp eşya: alma yok, “malik gibi tasarruf” yok, teslim girişimleri var', {
          effects: [
            ifThen(
              any(has('ded_niyet_tam'), has('ded_teslim'), flag('contra_r'), has('ev_cagri_kaydi')),
              [score('HUKUKI_BILGI', 150), inc('pers'), raise('ek_guclu'), mark('GOOD', 'Ek savunma üç vasfa da cevap verdi: hırsızlık zilyedin elinden almayı ister (TCK 141); kaybolmuş eşya suçu “malik gibi tasarrufu” ister (TCK 160). Teslim girişimleri delille gösterildi.', 'HUKUKI_BILGI')],
              [score('HUKUKI_BILGI', 50), mark('NEUTRAL', 'Hukuki çerçeve doğru; ama teslim girişimleri delille desteklenmedi. Çerçeve, içi dolunca güçlüdür.', 'HUKUKI_BILGI')],
            ),
          ],
          responses: B(`
P: Sayın Hâkim, savcılık üç kapıdan söz ediyor. Hiçbirinden girilmedi.
P: Hırsızlık, birinin zilyetliğinden almayı ister. Sanık kimsenin elinden, kimsenin çantasından almadı; cüzdanı bırakıldığı koltuk altında buldu. Özel beceri ise hiç yok.
P: Kaybolmuş eşya suçu da “malik gibi tasarruf” ister: harcamak, saklamak, kullanmak. Sanık yanındakine sordu, şoföre uzattı, belediyeyi aradı, sahibine yazdı, kendine karakol notu yazdı.
P: Malik gibi değil; sahibini arayan biri gibi davrandı.
`),
        }),
        option('EK_142', 'Yalnızca “özel beceri” yok: TCK 142/2-b uygulanamaz', {
          effects: [score('HUKUKI_BILGI', 60), raise('ek_142')],
          neutral: 'Doğru ama eksik: 142/2-b’ye karşı çıkmak iddianamedeki 141/1’i ve 160 ihtimalini açık bırakır.',
          responses: B(`
P: Sayın Hâkim, özel beceriyle hırsızlık iddiası tanık beyanına dayanıyordu ve tanık “eğildi, yerden aldı” dedi. 142/2-b’nin unsurları yok.
savci: Ya 141?
P: Esas hakkındaki savunmamızda.
`),
        }),
        option('EK_160', 'En fazla TCK 160: sanık bulduğunu zamanında teslim etmedi', {
          effects: [score('HUKUKI_BILGI', 20), raise('ek_160_kabul')],
          neutral: 'Kademeli savunmanın ikinci basamağı olabilir; ama tek başına söylenince sanığın “tasarruf” ettiğini kabul gibi okunur.',
          responses: B(`
P: Sayın Hâkim, olsa olsa bulunan eşyanın geç teslimi söz konusu. Bu da en fazla yüz altmıştır.
Arda bana döndü. “En fazla” sözcüğü ona “demek ki bir şey var” gibi geldi. Yüzünden okudum.
`),
        }),
        option('EK_YOK', 'Ek savunmamız yok', {
          effects: [dec('pers'), score('HUKUKI_BILGI', -50)],
          bad: 'Nitelendirme uyarısı yapılmış bir dosyada ek savunma hakkı kullanılmadı (CMK 226); savcının daha ağır vasıf talebi cevapsız kaldı.',
          category: 'HUKUKI_BILGI',
          responses: B(`
hakim: Peki. Ek savunma alınmadı olarak tutanağa geçsin.
`),
        }),
      ],
    }),

    // Mütalaa: delillere göre değişen metin (ilk tutan blok).
    decisionNode('H2_MUT_1', [{ to: 'H2_MUT' }], {
      ...TRIAL,
      lines: [
        W(
          flag('false_confession'),
          `
savci: Esas hakkındaki mütalaam: sanığın ikrarı ve zararın kovuşturma başladıktan sonra hüküm verilmeden giderilmesi karşısında, TCK 141/1 ve 168/2 uyarınca cezalandırılmasını, lehe hükümlerin uygulanmasını talep ederim.
`,
        ),
        W(
          all(flag('sebeke_yakalandi'), flag('contra_r')),
          `
savci: Esas hakkındaki mütalaam: dört kanallı kayıt, şoförün duruşmadaki beyanı ve kolluğun yakaladığı şüphelilerin üzerinde müştekinin kartının çıkması karşısında,
savci: müştekinin cüzdanının sanık tarafından değil başka kişilerce alındığı anlaşılmaktadır. Sanığın CMK 223/2-b uyarınca beraatine; dosyanın ilgili soruşturmayla irtibatlandırılmasına karar verilmesini talep ederim.
> Savcı Tolga Uçar bunu söylerken bana bakmadı. Hâkime baktı. İyi savcılar yanıldıklarında bile dik dururlar.
`,
        ),
        W(
          ref('beraat_zemini'),
          `
savci: Esas hakkındaki mütalaam: duruşmada dinlenen tanıkların beyanları ve getirtilen kayıtlar karşısında, sanığın üzerine atılı suçu işlediği her türlü şüpheden uzak, kesin ve inandırıcı delillerle ispatlanamamıştır.
savci: Kayıt eksikti; tanığın teşhisi tek bir görüntüye dayanıyordu; kartlar sanığın bulunduğu yerden kilometrelerce uzakta kullanılmıştır. Bunları görmezden gelemem.
savci: Sanığın CMK 223/2-e uyarınca beraatine karar verilmesini talep ederim. Kartları kullananlar yönünden ayrı soruşturmanın sürdürülmesi gerektiği kanaatindeyim.
> Savcı Tolga Uçar bunu söylerken masasındaki dosyayı kapattı. Bir savcının en zor cümlesi “sabit değil”dir. Onu dik durarak söyledi.
`,
        ),
        W(
          ref('buldu_zemini'),
          `
savci: Esas hakkındaki mütalaam: sanığın cüzdanı müştekiden aldığı ispatlanamamıştır. Ancak bulduğu cüzdanı on beş saat boyunca yetkili mercilere teslim etmeyip evinde tuttuğu sabittir.
savci: Eylemin TCK 160 kapsamında kaybolmuş eşya üzerinde tasarruf suçunu oluşturduğu değerlendirilerek bu madde uyarınca cezalandırılmasını talep ederim.
`,
        ),
        O(`
savci: Esas hakkındaki mütalaam: kamera kaydı, tanık beyanı ve cüzdanın sanığın çantasında bulunması birlikte değerlendirildiğinde sanığın eylemi sabittir.
savci: Sanığın TCK 141/1 uyarınca cezalandırılmasını; eylemin TCK 142/2-b kapsamında değerlendirilmesi hususunun takdire bırakılmasını talep ederim.
`),
      ],
    }),
    court2.objection('H2_MUT', {
      title: 'Mütalaaya cevap',
      courtStage: 'MUTALAA',
      say: S(`
hakim: Müdafi, mütalaaya karşı diyeceğiniz?
`),
      next: 'H2_ESAS',
      options: [
        option('MC_A', 'Mütalaaya delillerle cevap ver (CMK 216/2)', {
          effects: [...legal(100), inc('pers')],
          good: 'Cevap hakkı yerinde kullanıldı (CMK 216/2): savcının dayandığı her delil duruşmada ortaya konan bulgularla karşılandı.',
          category: 'USUL_BILGISI',
          responses: [
            W(
              flag('false_confession'),
              `
P: Sayın Hâkim… Mütalaaya karşı söyleyecek bir şey bulamıyorum. Sanığın beyanı ortada.
> Cevap hakkım vardı. Cevabım yoktu. Cevabı ben kendi elimle çöpe atmıştım.
`,
            ),
            O(`
P: Sayın Savcının dayandığı üç delil vardı: kayıt, tanık, çanta. Kayıt eksikti; tamamı geldi. Tanık yüzü görmedi. Çantadaki cüzdan, sahibini arayan birinin çantasındaydı.
P: Eksik dakikalar tamamlanınca geriye bir hırsızlık değil, bir bulma ve dört teslim girişimi kalıyor.
`),
          ],
        }),
        option('MC_B', 'Cevabımız yok; esas savunmada', {
          neutral: 'Cevap hakkı (CMK 216/2) kullanılmadı; esas savunmaya bırakmak meşru ama bir fırsat kaçtı.',
          responses: B(`
hakim: Peki. Esas hakkındaki savunmanızı alalım.
`),
        }),
        option('MC_C', 'Mütalaa tutanaktan çıkarılsın', {
          effects: [dec('cred'), score('USUL_BILGISI', -50, 'hatali')],
          bad: 'Mütalaa savcının hakkıdır ve tutanaktan çıkarılamaz; müdafiin hakkı ona cevap vermektir (CMK 216/2).',
          category: 'USUL_BILGISI',
          responses: B(`
hakim: Mütalaa tutanaktan çıkarılmaz, müdafi. Cevap hakkınız var; kullanmak isterseniz.
`),
        }),
      ],
    }),

    {
      id: 'H2_ESAS',
      type: 'CHOICE',
      ...court2.base,
      title: 'Esas hakkında savunma',
      background: 'durusma_salonu',
      prompt: { speaker: 'hakim', text: 'Müdafi, esas hakkındaki savunmanızı yapın.' },
      lines: B(`
> Ayağa kalktım. Cübbenin kolları bileklerime düştü. Üç hafta önce bu salonda “beş yıl” lafı asılı kalmıştı. Şimdi sıra bendeydi.
`),
      choices: [
        option('SAV_B', 'Suç başkalarınca işlendi; sanık işlemedi (CMK 223/2-b)', {
          next: 'H2_SON',
          effects: [
            raise('beraat_talep'),
            ifThen(
              ref('sav_b_zemin'),
              [
                score('SAVUNMA_STRATEJISI', strategyAmount(200, 'MASUMIYET')),
                inc('pers'),
                raise('sav_b_ok'),
                mark('GOOD', 'Gerçek failler delillerle gösterildi: tam kayıt, büfe tanığı, yakalanan şüphelilerin üzerindeki kart ve şoförün beyanı. Yüklenen suçun sanık tarafından işlenmediği sabit.', 'SAVUNMA_STRATEJISI'),
              ],
              [
                score('SAVUNMA_STRATEJISI', -100),
                dec('pers'),
                mark('BAD', 'Suçun başkalarınca işlendiğini “sabit” kılacak delil zinciri (failler, kart, şoför) duruşmada tamamlanmadı. İddia, ispatından büyük kaldı.', 'SAVUNMA_STRATEJISI'),
              ],
            ),
          ],
          responses: [
            W(
              ref('sav_b_zemin'),
              `
P: Sayın Hâkim. 6 Mart akşamı Hat 38’de bir cüzdan çalındı. Çalanlar bu salonda değil; dün akşamdan beri gözaltında.
P: Kayıt cüzdanı kimin aldığını, kimin bıraktığını, kimin indiğini gösteriyor. Büfe tanığı kartı kimin kullandığını. Kart, onların üzerinden çıktı.
P: Sanık ise o cüzdanı buldu ve dört saatte dört kapı çaldı. Şoför bugün bunu kendi ağzıyla söyledi.
P: Yüklenen suçun sanık tarafından işlenmediği sabittir. Beraatini talep ederim.
`,
            ),
            O(`
P: Sayın Hâkim. Bu cüzdanı başkaları çaldı. Kayıtta bir parka, bir bere var. Kartları onlar kullandı.
P: Sanığın beraatini talep ederim; suç başkalarınca işlenmiştir.
savci: Kim, müdafi? İsim? Kart? Teşhis?
> Savcının üç sorusu vardı. Benim üç gölgem.
`),
          ],
        }),
        option('SAV_E', 'Sanığın suçu işlediği sabit değil; şüpheden sanık yararlanır (CMK 223/2-e)', {
          next: 'H2_SON',
          effects: [
            raise('beraat_talep'),
            ifThen(
              ref('beraat_zemini'),
              [
                score('SAVUNMA_STRATEJISI', strategyAmount(200, 'USUL')),
                inc('pers'),
                mark('GOOD', 'Savcılığın dayandığı her delil duruşmada sarsıldı; kalan şüphe sanık lehine. Bu, delille kurulmuş bir şüphe savunması.', 'SAVUNMA_STRATEJISI'),
              ],
              [
                score('SAVUNMA_STRATEJISI', -50),
                mark('BAD', 'Şüphe savunması için savcılık delillerini sarsan yeterli bulgu ortaya konmadı.', 'SAVUNMA_STRATEJISI'),
              ],
            ),
          ],
          responses: [
            W(
              ref('beraat_zemini'),
              `
P: Sayın Hâkim. Savcılığın üç delili vardı. Bir kayıt: iki buçuk dakikaydı, bir saat çıktı. Bir tanık: yüzü değil, bir kapüşonu gördü. Bir çanta: içinde sahibini arayan birinin cüzdanı vardı.
P: Kartları kullanan sanık değil; o saatte kilometrelerce ilerideki bir otobüsteydi. O gece belediyeyi aradı, şoföre uzattı, sahibine yazdı.
P: Yedi ay boyunca bu dosyanın hafızası iki buçuk dakikaydı. Bugün bir saat. O bir saatte bir parka, bir bere ve koltuğun altına bırakılan bir cüzdan var.
P: Onların kim olduğunu bu salonda bilmiyoruz. Bilmemiz de gerekmiyor. Bilmemiz gereken tek şey var: sanığın suçu işlediği kesin mi?
P: Geriye bir şüphe kalıyorsa, o şüphe sanığındır. Ceza hukuku böyle der; vicdan da böyle der. Beraatini talep ederim.
`,
            ),
            O(`
P: Sayın Hâkim. Delillerin hiçbiri kesin değil. Şüpheden sanık yararlanır. Beraatini talep ederim.
> Cümle doğruydu. Ama salonda havada kaldı. Doğru cümlenin altını dolduramadım.
`),
          ],
        }),
        option('SAV_T', 'Öncelikle beraat; olmazsa TCK 160 ve hükmün açıklanmasının geri bırakılması (terditli)', {
          next: 'H2_SON',
          score: { SAVUNMA_STRATEJISI: strategyAmount(150, 'INDIRIM') },
          effects: [raise('beraat_talep'), raise('terditli')],
          good: 'Terditli (kademeli) savunma meşrudur: önce beraat, mahkeme aksi kanaatteyse daha hafif vasıf ve lehe hükümler (CMK 231/5).',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
P: Sayın Hâkim, öncelikle sanığın beraatini talep ediyorum: alma eylemi yok, kartları o kullanmadı, teslim için çabaladı.
P: Mahkeme aksi kanaatteyse, eylem olsa olsa kaybolmuş eşya üzerinde tasarruftur; bu hâlde sabıkasız sanık hakkında hükmün açıklanmasının geri bırakılmasını talep ederim.
> Arda başını eğdi. Bir merdivenin iki basamağını aynı anda söyledim. Basamaklardan biri aşağı iniyordu.
`),
        }),
        option('SAV_D', '“Bir öğretmen adayının hayatı söz konusu; merhamet istiyorum.”', {
          next: 'H2_SON',
          effects: [dec('pers'), score('SAVUNMA_STRATEJISI', -50)],
          bad: 'Duygusal söylem delilin yerini tutmaz; esas savunma, duruşmada ortaya konan bulgulara dayanmalıydı.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
P: Sayın Hâkim, karşınızda bir öğretmen adayı var. Bir mahkûmiyet onun hayatını bitirir. Merhamet istiyorum.
savci: Merhamet hükmün değil, cezanın konusudur, müdafi.
`),
        }),
      ],
    },

    {
      id: 'H2_SON',
      type: 'CHOICE',
      ...court2.base,
      title: 'Son söz',
      background: 'durusma_salonu',
      prompt: { speaker: 'hakim', text: 'Sanık, son sözünüz?' },
      choices: [
        option('SON_A', '“Bir cüzdan buldum. Sahibine ulaştırmak istedim. Beceremedim; ama çalmadım.”', {
          next: 'H2_HUKUM',
          effects: [score('SAVUNMA_STRATEJISI', 40)],
          good: 'Kısa, doğru ve kendi cümlesiyle bir son söz (CMK 216/3).',
          category: 'SAVUNMA_STRATEJISI',
          responses: [
            W(
              flag('false_confession'),
              `
arda: Ben… bir cüzdan buldum. Sahibine ulaştırmak istedim. Beceremedim.
Durdu. “Ama çalmadım” diyemedi; tutanakta “kabul ediyorum” yazıyordu. Oturdu.
`,
            ),
            O(`
arda: Bir cüzdan buldum, Sayın Hâkim. Sahibine ulaştırmak istedim. Beceremedim; geç kaldım, korktum. Ama çalmadım.
arda: Bir gün bir sınıfa girersem çocuklara bunu anlatacağım. Bir şey bulursanız ne yapacağınızı. Ve bulunca korkmamayı.
arda: Bir de… bir teyzenin kocasının fotoğrafını kimliğinin arkasında taşıdığını. Bazı şeyler para değildir. Onları sahibine götürmek gerekir. Ben geç kaldım.
`),
          ],
        }),
        option('SON_B', 'Ağlayarak af dilesin', {
          next: 'H2_HUKUM',
          neutral: 'İçten bir an; ama inkâr eden sanığın “af” dilemesi, hâkime belirsiz bir ikrar gibi gelebilir. Sanığın tutumu tek başına bir indirim ya da ispat nedeni değildir.',
          responses: B(`
arda.uzgun: Affedin… Herkesten özür dilerim. Teyzeden de. Ben… ben sadece…
Cümlesini bitiremedi. Zehra arkadan elini omzuna koydu.
`),
        }),
        option('SON_C', '“Avukatımın söylediklerine katılıyorum.”', {
          next: 'H2_HUKUM',
          neutral: 'Usule uygun ve güvenli; ama son söz, sanığın kendi sesini hâkime duyurabileceği son andır.',
          responses: B(`
arda: Avukatımın söylediklerine katılıyorum, Sayın Hâkim.
`),
        }),
      ],
    },

    decisionNode('H2_HUKUM', [{ to: 'R_KARAR' }], {
      ...VERDICT,
      lines: B(`
hakim: Duruşmaya on beş dakika ara verildi.
Koridorda kimse konuşmadı. Bir çay ocağından bardak sesi geliyordu. Arda pencereden ıslak avluya bakıyordu. Gülten Hanım torununun koluna girmişti.
mubasir: Arda Çınar dosyası! Taraflar salona!
Salon ayağa kalktı. Sandalyelerin gıcırtısı, bir öksürük, bir telefonun titreşimi. Sonra hiçbir şey.
hakim: Hüküm fıkrası herkes tarafından ayakta dinlenir.
> Bir kâğıdın üstünde birkaç satır. Yedi ayın, bir otobüsün, bir cüzdanın, bir notun, bir dakikanın toplamı.
`),
    }),
    story('H_COKUS', {
      ...court2.base,
      title: 'Çöküş',
      background: 'durusma_salonu',
      lines: B(`
hakim: Müdafi, sunduğunuz belgelerin hiçbiri tanıkların anlattıklarıyla örtüşmüyor. Savunmanın ciddiyetini sorgulamak zorunda bırakmayın beni.
savci: Sayın Hâkim, delil tartışması tamamlanmıştır. Esas hakkındaki mütalaam iddianame doğrultusundadır.
> Kâğıtlarım masanın üstünde dağınıktı. Her biri bir şey söylüyordu; hiçbiri doğru anda söylememişti. Arda bana bakmıyordu.
hakim: Sanık, son sözünüz?
`),
      choices: [cont('COKUS_SON', 'Son söz: “Ben çalmadım.”', 'H2_HUKUM')],
    }),
    resultNode('R_KARAR', { ...VERDICT, title: 'Karar' }),
  ],
  predicates: [
    {
      id: 'beraat_zemini',
      label: 'Savcılık delillerini sarsan en az üç bulgu',
      when: {
        cmp: [
          {
            add: [
              { if: { when: { any: [{ flag: 'contra_h1' }, { flag: 'contra_h4' }] }, then: 1, else: 0 } },
              { if: { when: { any: [{ flag: 'contra_v' }, { flag: 'contra_v2' }] }, then: 1, else: 0 } },
              { if: { when: { flag: 'contra_r' }, then: 1, else: 0 } },
              { if: { when: { hasEvidence: 'ded_kart_baskasi' }, then: 1, else: 0 } },
              { if: { when: { any: [{ hasEvidence: 'ded_teslim' }, { hasEvidence: 'ded_niyet_tam' }] }, then: 1, else: 0 } },
              { if: { when: { flag: 'gulten_tanik' }, then: 1, else: 0 } },
            ],
          },
          '>=',
          3,
        ],
      },
    },
    {
      id: 'buldu_zemini',
      label: 'Cüzdanın bulunduğu gösterildi',
      when: {
        any: [
          { hasEvidence: 'ded_buldu' },
          { flag: 'contra_h4' },
          { hasEvidence: 'ded_kart_baskasi' },
          { flag: 'contra_v' },
          { flag: 'contra_v2' },
        ],
      },
    },
    {
      id: 'sav_b_zemin',
      label: 'Gerçek failler delillerle gösterildi',
      when: { all: [{ flag: 'sebeke_yakalandi' }, { hasEvidence: 'ded_birakan' }, { flag: 'contra_r' }] },
    },
  ],
  triggers: [
    {
      id: 'tg_cokus',
      priority: 0,
      once: true,
      when: all(flag('in_court'), cmp(v('cred'), '<=', 0)),
      effects: [raise('cokus')],
      goto: 'H_COKUS',
    },
  ],
};

