import {
  all,
  any,
  choiceNode,
  cmp,
  cont,
  courtSession,
  dec,
  decisionNode,
  fallback,
  flag,
  goto,
  ground,
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
  set,
  statement,
  story,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, O, T, W } from './dsl.js';
import { H1, court1, wrongMove } from './shared.js';

// 60-trial: 1. celse. Koridor, açılış, sanığın savunması ve sorular, savcının talebi, bulaşıkçının tanıklığı (S1–S5),
// savcının telkinli sorusu, ek talepler, tutukluluk, koridor.

const savcilikDelili = ['ev_bicak', 'ev_mesaj_pzt', 'ev_suleyman_ifade', 'ev_tas_fis', 'ev_otopsi'];

export const hearing1: CasePart = {
  config: {
    objectionGrounds: [
      ground('g_telkin', 'Telkin edici, yönlendirici soru', 'CMK 201'),
      ground('g_kanaat', 'Tanığın gözlemi değil kişisel kanaati', 'CMK 52/2, 217'),
      ground('g_duyum', 'Tanık başkasından duyduğunu aktarıyor', 'CMK 210, 217'),
    ],
  },
  predicates: [
    {
      id: 'tasarlama_sarsildi',
      label: 'Tasarlamanın en az bir ayağı çöktü',
      when: any(has('ded_davet'), has('ded_bileme'), has('ded_niyet')),
    },
    {
      id: 'tanik_celiski',
      label: 'Bulaşıkçı baş tanıkla çelişti',
      when: any(flag('contra_s2'), flag('contra_s4')),
    },
  ],
  court: {
    sessions: [
      courtSession('cs_1', '1. Celse', [
        ['s1_acilis', 'ACILIS', 'H1_00'],
        ['s1_savunma', 'SANIK_SAVUNMASI', 'H1_01'],
        ['s1_tanik', 'TANIK_DINLEME', 'H1_03'],
      ]),
    ],
  },
  nodes: [
    decisionNode('H1_00G_1', [{ to: 'H1_00G_2' }], {
      ...H1,
      title: 'Koridor',
      onEnter: [raise('in_court')],
      lines: B(`
# 17 ŞUBAT · 09.15 — BURSA ADLİYESİ, 4. KAT [bg:adliye]
> Adliye koridoru sabahın erken saatinde bile bir istasyon gibiydi. Cübbeler, dosyalar, bir ağlayan çocuk, kimsenin nereden geldiğini bilmediği bir sigara kokusu.
> Bursa 3. Ağır Ceza’nın kapısında Meral bekliyordu; elinde bir naylon poşet, poşette ütülü bir gömlek. Kemal pencerenin önünde, sırtı koridora dönük.
`),
    }),
    decisionNode('H1_00G_2', [{ to: 'H1_00K' }], {
      onEnter: [ifThen(flag('suleyman_kocluk'), [dec('pers')])],
      lines: [
        W(
          flag('suleyman_kocluk'),
          `
> Koridorun öbür ucunda Süleyman Çiftçi bir banka ilişmiş, bir kâğıda bakıp dudaklarını oynatıyordu. Beni görünce kâğıdı cebine soktu. Ezberliyordu.
~ Ne ezberlediğini biliyordum. Kendi ağzımdan çıkan bir kelimeyi: “kesin.”
`,
        ),
        O(`
> Koridorun öbür ucunda Süleyman Çiftçi, takım elbisesinin içinde kaybolmuş, bir banka ilişmişti. Elinde bir dolmuş bileti; çevirip duruyordu.
`),
      ],
    }),
    story('H1_00K', {
      ...H1,
      title: 'Koridor',
      background: 'adliye',
      onFirstEnter: [meet('gulay')],
      lines: B(`
> Siyahlar içinde bir kadın, iki genç akrabasının arasında, salonun kapısına en yakın bankta oturuyordu. Gülay Toker. Katılan. Bana bakmadı; baktı ve bakmamış gibi yaptı.
> Leyla merdivenlerden çıktı, kimseye selam vermeden salona girdi, dinleyici sırasının en arkasına oturdu. Kemal pencereden dönmedi; ama camda yansımasını gördüğünü biliyordum.
> Meral poşeti bana uzattı.
meral: Gömleğini getirdim. Gardiyan alır mı dersiniz? Bugün çıkar mı avukat hanım? Kemal sormaz; ben soruyorum.
`),
      choices: [
        option('H100K_A', '“Bugün çıkmaz. Ama bugün başlıyor.”', {
          effects: [raise('koridor_durust')],
          responses: B(`
- Bugün çıkmaz Meral Hanım. Böyle bir dosyada ilk celsede çıkmaz. Ama bugün başlıyor. Akşam size ben anlatacağım.
meral: Çıkmaz. Peki. Ben de öyle düşünmüştüm; gömleği yine de ütüledim.
> Kemal pencerede bir an döndü, bana baktı, yeniden döndü. Bir şey söylemedi. Söylememesi bir şeydi.
`),
          next: 'H1_00',
        }),
        option('H100K_B', '“İnşallah bu akşam evde olur.”', {
          effects: [raise('koridor_umut')],
          responses: B(`
- İnşallah bu akşam evde olur Meral Hanım.
> Meral’in yüzü aydınlandı. Kemal pencereden döndü; yüzünde bir şey vardı. Yirmi iki yıl önce bir avukat da ona bir umut vermişti.
~ Bir umut verdim. Umut vermek ucuzdur; ödemesini başkası yapar.
`),
          next: 'H1_00',
        }),
      ],
    }),
    court1.stage('H1_00', {
      title: 'Duruşma · 1. Celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onFirstEnter: [meet('baskan'), meet('uye'), meet('savci'), meet('recep')],
      lines: B(`
recep: Emir Yalçın dosyası! Taraflar salona! Hım-hım.
# BURSA 3. AĞIR CEZA MAHKEMESİ — 1. CELSE [bg:durusma_salonu]
> Salon yüksek tavanlı, perdeleri solgundu. Atatürk portresinin altında: ADALET MÜLKÜN TEMELİDİR. Kürsüde üç hâkim; sağda savcı.
> Jandarma Emir’i getirdi. Kelepçesi kapıda çözüldü. Salona girerken gözleri önce annesini, sonra babasını aradı. Babasını buldu; Kemal başını eğdi.
baskan: Tutuklu sanık Emir Yalçın’ın, müdafii Av. Deniz Arslan’ın, katılan Gülay Toker’in hazır olduğu görüldü. Tanık Süleyman Çiftçi hazır; salon dışında bekletiliyor.
baskan: Tanık Tarık Sezer’in sağlık raporu gönderdiği anlaşıldı. Açık yargılamaya başlandı. İddianame özetini Cumhuriyet savcısından dinleyelim.
> Savcı Selim Karaman kalktı. Kırklarının sonunda, ince, gözlüklü; önündeki kâğıtları sayfa sayfa çevirerek konuştu. Kâğıtla konuşan bir adam.
savci: Sanık, 10 Kasım’da maktulün, kendi babasının yirmi iki yıl önceki mahkûmiyetinden sorumlu olduğunu öğrenmiş ve aynı gece “bu hafta hesabını soracağım” yazmıştır.
savci: 12 Kasım’da bileği taşı satın almış; 14 Kasım gecesi kapanıştan sonra iş yerinde kalarak maktulü beklemiş, kendisine ait bıçakla tek darbede öldürmüştür.
savci: Görgü tanığı Tarık Sezer sanığı elinde bıçakla ofisten çıkarken görmüştür. Eylem TCK 82/1-a kapsamında, tasarlayarak kasten öldürmedir.
baskan: Sanığa hakları hatırlatıldı. Sanık, savunmanızı yapın.
~ Üç gün, üç kâğıt, bir tanık. Savcı bir hikâye anlattı; düzgün, sıralı, kâğıtlı. Mahkemeler düzgün hikâyeleri sever.
> Katılan sırasında Gülay Toker iddianamenin her cümlesinde başını salladı. “Bıçak” kelimesinde gözlerini kapadı.
> Emir sanık sandalyesinde sol elinin başparmağıyla sağ elinin sırtındaki yanık izini ovuyordu. Mutfakta kazanılmış bir iz; bir fırının kenarı.
~ Bir aşçının elleri. Savcı bu elleri bir katilin elleri diye anlattı. Ben bu ellerin o gece neye dokunduğunu, neye dokunmadığını anlatacağım.
`),
      choices: [cont('H100_DEVAM', 'Sanığın savunması', 'H1_01', { role: 'PRIMARY' })],
    }),
    choiceNode('H1_01', {
      ...H1,
      title: 'Sanığın savunması',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
emir: Ben Ercan abiyi öldürmedim Sayın Başkan. O gece ofise gittim, çünkü o çağırdı. Bana babamı anlattı. Bağırdım. Çıktım. Otobüse bindim.
emir: Bıçağım tezgâhta kalmıştı. Çantam da. Unuttum. Ben… ben hiçbir şeyi unutmam, o gece unuttum.
> Sesi sondaki kelimede kırıldı. Üye Pınar Yener bir şey not etti.
baskan: Müdafi, sanığa sorularınız varsa sorabilirsiniz.
~ Ona soracağım her soru heyete bir şey anlatır. Doğru sorular onun hikâyesini kurar; yanlış soru, savcınınkini.
`),
      choices: [
        option('Q_DAVET', '“Kapanıştan sonra neden kaldınız?”', {
          visibleWhen: any(has('clue_davet'), flag('fact_davet_emir')),
          score: { SORGULAMA: 40 },
          effects: [inc('pers')],
          good: 'Tasarlamanın “bekleyiş” ayağını sanığın ağzından, mesajla doğrulanabilir biçimde çürüttün.',
          category: 'SORGULAMA',
          responses: B(`
emir: Ercan abi yazdı. 22.47’de. “Kapanıştan sonra ofise uğra, baban hakkında konuşmamız lazım.” Telefonumda var; polis aldı.
> Savcı dosyasında bir sayfa aradı. Bulamadı; bir başkasını açtı.
`),
          next: '$stay',
        }),
        option('Q_CANTA', '“Bıçak çantanızı işe her gün getirir misiniz?”', {
          visibleWhen: any(flag('fact_canta_unuttu'), has('clue_canta')),
          score: { SORGULAMA: 40 },
          effects: [inc('pers')],
          good: 'Bıçağın sanığa ait olmasının bir hazırlık değil, mesleğin olağanı olduğunu tutanağa geçirttin.',
          category: 'SORGULAMA',
          responses: B(`
emir: Her gün. Bütün aşçılar öyle. Şefimiz izin vermez bırakmaya. O gece tezgâhta unuttum; fileto bıçağı tahtanın üstündeydi.
baskan: Tutanağa geçsin: sanık bıçak çantasını tezgâhta unuttuğunu beyan etti.
`),
          next: '$stay',
        }),
        option('Q_OTOBUS', '“Meyhaneden çıkınca nereye gittiniz?”', {
          visibleWhen: flag('fact_otobus_emir'),
          score: { SORGULAMA: 40 },
          effects: [inc('pers')],
          good: 'Sanığın çıkış sonrası güzergâhını, doğrulanabilir bir kayda (otobüs, kart) bağlayacak açık uçlu soru.',
          category: 'SORGULAMA',
          responses: B(`
emir: İskele durağına koştum. Son otobüse, 23.52’ye. Kartımı okuttum. Emek’te metroya geçtim. Eve bir buçukta vardım.
> Savcı bir şey yazdı. İlk kez başını kâğıdından kaldırdı.
`),
          next: '$stay',
        }),
        option('Q_MESAJ', '“Pazartesi mesajınızın son cümlesi neydi?”', {
          visibleWhen: has('clue_mesaj_tam'),
          score: { SORGULAMA: 40 },
          effects: [inc('pers')],
          good: 'İddianamenin kestiği cümleyi tamamlattın: “hesap sormak” bir öldürme kararı değil, bir yüzleşme niyeti (tasarlamanın “karar” unsuru).',
          category: 'SORGULAMA',
          responses: B(`
emir: “Neden yaptığını yüzüne soracağım. Babamın yüzüne nasıl baktığını.” Soracaktım. Sordum da. O anlattı.
> Üye Pınar Yener dosyadaki iddianame sayfasını çevirdi; alıntının bittiği yeri parmağıyla buldu.
`),
          next: '$stay',
        }),
        option('Q_NEFRET', '“Ercan Toker’den nefret ediyor muydunuz?”', {
          score: { SORGULAMA: -30 },
          effects: [dec('pers')],
          bad: 'Kendi müvekkiline motivi sordun; savcılığın tasarlama hikâyesine sanığın ağzından bir duygu ekledin.',
          category: 'SORGULAMA',
          responses: B(`
emir/kizgin: Nefret mi? O gece… o gece evet. Evet, nefret ettim. Ama ben…
> Savcının yüzünde küçük bir gülümseme. Katılanın yanındaki akraba bir şey fısıldadı.
~ Bir avukat müvekkilinin öfkesini kendi sorusuyla salona taşırsa, savcıya bir tanık armağan etmiş olur.
`),
          next: '$stay',
        }),
        option('Q_HATIRLA', '“O gece öfkeden ne yaptığınızı tam hatırlıyor musunuz?”', {
          score: { SORGULAMA: -30 },
          effects: [dec('pers')],
          bad: 'Müvekkilinin hafızasını kuşkuya açtın; bir “bilinç bulanıklığı” imasıyla hem kendi beraat savunmanı hem de tasarlamaya karşı duruşunu zayıflattın.',
          category: 'SORGULAMA',
          responses: B(`
emir/saskin: Hatırlıyor muyum? Hatırlıyorum… Bağırdım, çıktım. Yani… öfkeliydim ama…
> Pınar Yener kalemini bıraktı. Savcı başını salladı; benim için değil.
`),
          next: '$stay',
        }),
        cont('Q_BITIR', 'Sorularım bu kadar', 'H1_02', { role: 'PRIMARY' }),
      ],
    }),
    court1.objection('H1_02', {
      title: 'Savcının talebi',
      courtStage: 'SANIK_SAVUNMASI',
      background: 'durusma_salonu',
      say: T(`
savci: Sayın Başkan, sanığın babası Kemal Yalçın hakkındaki 2004 tarihli mahkûmiyet hükmünün getirtilmesini talep ediyoruz. Husumetin kaynağı ve derecesi bakımından.
baskan: Müdafi, talebe diyeceğiniz?
~ Yirmi iki yıl önceki hüküm. Leyla dinleyici sırasında. Kemal pencerenin dibinde değil artık; salonun arkasında, ayakta.
`),
      next: 'H1_03',
      options: [
        option('H102_A', '“Katılıyoruz; ancak husumet sanığın değil, bilgisi pazartesi başladı.”', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers')],
          good: 'Delilin toplanmasına katıldın ama anlamını çerçeveledin: yirmi iki yıllık hüküm sanığın değil babasının; sanığın öğrenmesi dört gün önce. Tasarlamanın “makul süre ve sebat” unsurunu baştan daralttın.',
          category: 'USUL_BILGISI',
          responses: B(`
- Talebe katılıyoruz Sayın Başkan. Yalnızca bir notla: o hüküm sanığın değil, babasının. Sanık bu geçmişi olaydan dört gün önce, tek bir cümleyle öğrenmiştir.
- Yirmi iki yıllık bir husumet varsa, sanığın ondan haberi dört günlüktür.
> Başkan başını salladı. Savcı bir şey yazdı; kaşları kalktı.
baskan: Kabul. Hüküm getirtilecek.
`),
        }),
        option('H102_B', '“Katılıyoruz.”', {
          neutral: 'Talebe katıldın; ama hükmün sanık bakımından anlamını çerçevelemedin.',
          responses: B(`
- Talebe katılıyoruz Sayın Başkan.
baskan: Kabul.
`),
        }),
        option('H102_C', '“Karşı çıkıyoruz; yirmi iki yıllık bir dosya ilgisiz.”', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred'), dec('pers')],
          bad: 'Saik bakımından ilgili bir delilin toplanmasına gerekçesiz karşı çıktın; “saklanacak bir şey var” izlenimi verdin. Mahkeme yine de toplar.',
          category: 'USUL_BILGISI',
          responses: B(`
- Karşı çıkıyoruz Sayın Başkan. Yirmi iki yıl önceki bir dosya bu davayla ilgisizdir.
baskan: Saik bakımından ilgisiz değil müdafi. Kabul edildi.
> Savcı bana baktı; ilk kez merakla.
`),
        }),
        option('H102_D', '“O hüküm yanlıştı; babası masumdu, bunu da tartışalım.”', {
          score: { USUL_BILGISI: -20 },
          effects: [dec('pers')],
          neutral:
            'Kesinleşmiş bir hükmün doğruluğu bu davanın konusu değildir; o yol yargılamanın yenilenmesidir. Heyet, savunmanın davayı başka bir davaya çevirmek istediğini düşündü.',
          responses: B(`
- Talebe katılıyoruz; ancak o hüküm yanlıştı Sayın Başkan. Kemal Yalçın masumdu.
baskan: Kesinleşmiş bir hüküm bu davanın konusu değil müdafi. Kabul edildi.
> Salonun arkasında Kemal başını kaldırdı. Leyla kaldırmadı.
`),
        }),
      ],
    }),
    court1.testimony('H1_03', {
      title: 'Bulaşıkçının dinlenmesi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'suleyman',
      witnessLabel: 'TANIK · SÜLEYMAN ÇİFTÇİ',
      rulesText: 'İpucu: önce bastır, sonra doğru delille göster. Yanlış delil güvenilirliği ve skoru düşürür.',
      objectionGrounds: ['g_telkin', 'g_kanaat', 'g_duyum'],
      say: T(`
recep: Tanık Süleyman Çiftçi! Hım-hım.
> Süleyman Çiftçi salona girdi; takım elbisesi omuzlarından sarkıyordu. Yemin ederken sağ elini kaldırdı, sol eli ceketinin cebinde bir dolmuş biletini sıkıyordu.
baskan: Tanık, olay gecesi ne gördüyseniz ne duyduysanız anlatın.
suleyman: Ben bulaşıkhanedeydim. Su akıyordu. Bir bağırış geldi ofisten. Emir’in sesiydi, vallahi. Sonra çocuk çıktı. Bu kadar.
> Savcı tek bir soru sordu: “Sesin sanığa ait olduğundan emin misiniz?” Süleyman başını salladı. Savcı oturdu.
baskan: Müdafi, sorularınız.
~ Leyla’nın mesajı: “Ona saati sorma. Dolmuşu sor.” Önce dinleyeceğim. Sonra bastıracağım. Kâğıtları en son açacağım.
`),
      statements: [
        statement('S1', 1, [
          'O gece bulaşıkhanedeydim. Ofisten bağırış geldi: ',
          hl('“Babamın hayatını çaldın!”', flag('press_s1')),
          ' Emir’in sesiydi, vallahi.',
        ]),
        statement('S2', 2, [
          'Saat… ',
          hl('on bir buçuğu geçiyordu herhalde', any(flag('press_s2'), has('clue_dolmus'), flag('fact_dolmus'))),
          '.',
        ]),
        statement('S3', 3, ['Sonra çocuk arka kapıdan ', hl('koşarak çıktı', flag('press_s3')), '; çok sinirliydi.']),
        statement(
          'S4',
          4,
          [
            'Önümden geçti. ',
            hl(
              'Elinde bir şey yoktu; önlüğü de üstünde değildi',
              any(has('clue_tarik_bicak'), has('ded_onluk'), has('ded_bicak_yeri')),
            ),
            ', vallahi.',
          ],
          flag('press_s3'),
        ),
        statement('S5', 5, ['O hâliyle bir şey yapar mı? ', hl('Yapar. Gençlik işte'), '.']),
      ],
      rules: [
        pressRule('PR_S1', 'S1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s1'), raise('fact_kagit')],
          responses: B(`
- Bağırıştan sonra ofisten başka bir ses duydunuz mu?
suleyman: Ercan Bey’in sesi. Alçaktı. “Otur, al şunu” gibi bir şey. Kâğıt hışırtısı vardı, vallahi; zarf gibi.
> Katılan sırasında Gülay Toker başını kaldırdı.
`),
        }),
        pressRule('PR_S2', 'S2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s2')],
          responses: B(`
- Saate baktınız mı?
suleyman: Bakmadım. Ama dolmuşum 23.45. On bir yıldır. Bağırış çöpten önceydi; çöp beş dakika sürer. Çocuk çıkarken ben çöpün başındaydım.
~ Saat değil, dolmuş. Bir dolmuş tarifesi, bir tanığın saatinden daha az yalan söyler.
`),
        }),
        pressRule('PR_S3', 'S3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s3')],
          responses: B(`
- Koşarak çıktı dediniz. Ne gördünüz, tarif eder misiniz?
suleyman: Önümden geçti, iki metre. Işığın altında. Ağlıyordu galiba; ya da yağmur. Elleri cebindeydi.
> Bir şey daha söyleyecekti; savcıya baktı, sustu.
`),
        }),
        pressRule('PR_S4', 'S4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s4')],
          responses: B(`
- Emin misiniz? Elinde hiçbir şey yok muydu?
suleyman: Işığın altındaydı avukat hanım. Kapının üstündeki lamba. Elleri cebinde, önlüksüz. Bir şey olsa görürdüm.
`),
        }),
        presentRule('PS_S2', 'S2', ['ev_tarik_ifade', 'ded_saat'], {
          enabledWhen: any(flag('press_s2'), has('clue_dolmus')),
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_s2'), ifThen(flag('contra_s4'), [goto('H1_03K')])],
          good: 'Dosyanın tek “saatli” tanığı (23.55) ile bağımsız tanığın dolmuş saati (23.40) çelişti; tanıkların birbirini çürüten anlatımı tutanakta.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, baş tanık Tarık Sezer kolluk ifadesinde bağırışı 23.55’e koyuyor. Süleyman Bey, 23.55’te neredeydiniz?
suleyman: 23.55 mi? Ben dolmuştaydım vallahi. 23.45 dolmuşu; Güzelyalı’ya. Şoför Hamdi, sorun.
baskan: Tutanağa geçsin: tanık, bağırışı ve sanığın çıkışını 23.45 dolmuşundan önce, çöpü çıkardığı sırada gördüğünü beyan etti.
> Savcı Karaman gözlüğünü çıkardı, camını mendiliyle sildi, geri taktı. Bir şeyi yeniden görmek isteyen bir adam gibi.
`),
        }),
        presentRule('PS_S4', 'S4', ['ev_tarik_ifade', 'ded_onluk', 'ded_bicak_yeri'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_s4'), ifThen(flag('contra_s2'), [goto('H1_03K')])],
          good: 'Baş tanığın “elinde bıçak, önlüğünde kan” anlatımını bağımsız tanığın gözlemiyle ve olay yeri tutanağıyla karşılaştırdın.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, baş tanık sanığın ofisten elinde bıçakla, önlüğünde kanla çıktığını söylüyor. Olay yeri albümünde bıçak ofiste, önlük askıda ve temiz.
- Süleyman Bey, siz ne gördünüz?
suleyman: Ben elleri cebinde gördüm. Önlüksüz. Kan mı? Yoktu vallahi. Kanı görsem bayılırdım, ben tavuk kesemem.
> Salonda bir kıpırtı. Gülay Toker yanındaki akrabaya döndü; bir şey sordu. Akraba omuz silkti.
`),
        }),
        presentRule('PS_S4_FOTO', 'S4', ['ev_olay_foto'], {
          enabledWhen: any(has('clue_onluk'), has('clue_bicak_ofiste')),
          visibleWhen: any(has('clue_onluk'), has('clue_bicak_ofiste')),
          score: { SORGULAMA: 150 },
          effects: [inc('pers')],
          neutral:
            'Kısmi isabet: olay yeri karesi tanığın gözlemini destekliyor; ama çelişkiyi baş tanığın sözüyle yan yana koymadın.',
          responses: B(`
- Sayın Başkan, olay yeri albümü kare 31: önlük koridordaki askıda, lekesiz. Tanık, sanık çıkarken önlüğü üstünde miydi?
suleyman: Değildi. Askıdaydı herhalde; ben görmedim askıyı. Üstünde yoktu.
`),
        }),
        objectRule('OB_S5', 'S5', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [inc('pers'), inc('legal_hits')],
          good: 'İtiraz yerinde: “yapar” bir gözlem değil, kanaat; tanık gördüğünü anlatır (CMK 52/2; değerlendirme mahkemenindir, CMK 217).',
          category: 'SORGULAMA',
          responses: B(`
- İtiraz ediyorum Sayın Başkan. “Yapar, gençlik” bir gözlem değil, tanığın kanaatidir.
baskan: Yerinde. Tanık, yalnızca gördüklerinizi anlatın. Bu cümle tutanağa geçmeyecek.
suleyman: Kusura bakmayın. Ağzımdan çıktı. Ben… ben yapmaz diyecektim aslında; ters söyledim.
`),
        }),
        presentRule('PS_DOSYA', undefined, ['ev_hts', 'ev_tel_rapor'], {
          maxUses: 10,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'Bu kayıtların bulaşıkçının beyanıyla bir ilgisi yok; doğru kâğıdı doğru tanığa göster. −1 güvenilirlik, −150 skor.',
          category: 'SORGULAMA',
          responses: B(`
suleyman: Telefon mu? Ben telefon kullanmam avukat hanım; dolmuşa binerim.
baskan: Müdafi, bu kaydın tanıkla ilgisi nedir?
`),
        }),
        presentRule('PS_SAVCILIK', undefined, savcilikDelili, {
          maxUses: 10,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'Savcılığın delilini savcılığın tanığına gösterdin; hiçbir çelişkiyi ortaya koymadı. −1 güvenilirlik, −150 skor.',
          category: 'SORGULAMA',
          responses: B(`
savci: Sayın Başkan, müdafi bizim delilimizi bizim tanığımıza okuyor. Teşekkür ederiz.
~ Kendi kalemime kendim mürekkep döktüm.
`),
        }),
      ],
      presentMiss: fallback('FB_H1_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil: −1 güvenilirlik, −150 skor.', category: 'SORGULAMA' },
        responses: B(`
baskan: Bu delilin beyanla ilgisini göremedim müdafi.
~ Yanlış kapıya vurdum. Ses salonda yankılandı.
`),
      }),
      objectMiss: fallback('FB_H1_OBJECT', 'OBJECT', {
        effects: [dec('cred'), inc('wrong'), score('SORGULAMA', -50, 'hatali')],
        quality: { q: 'BAD', feedback: 'Dayanaksız itiraz.', category: 'SORGULAMA' },
        responses: B(`
baskan: İtiraz reddedildi. Dayanağı yok.
`),
      }),
      finish: { id: 'H103_BITIR', next: 'H1_03S' },
    }),
    court1.stage('H1_03K', {
      title: 'Kimse sormadı',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'suleyman',
      lines: B(`
> Süleyman Çiftçi kürsünün kenarını iki eliyle tuttu. Başkana döndü; savcıya değil, bana değil.
suleyman: Sayın Başkan… Ben bunları polise de söyleyecektim. Sormadılar. “Emir’in sesi mi?” dediler. “Evet” dedim. İmza at dediler, attım.
suleyman: Çocuğun elleri boştu. Önlüğü yoktu. Ben dolmuşa yetiştim. Bunları kimse sormadı. Vallahi kimse sormadı.
> Salon sustu. Kâtibin klavyesi bir an durdu, sonra yeniden başladı; daha hızlı.
baskan: Tutanağa geçsin: tanık, kollukta kendisine yalnızca bağırışın sorulduğunu, sanığın çıkışına ilişkin soru sorulmadığını beyan etti.
> Üye Pınar Yener dosyadaki Tarık Sezer’in ifadesini çıkardı, yanına bir şey yazdı. Savcı Karaman o sayfaya baktı; uzun uzun.
~ Bir tanığı kırmadım. Bir tanığa, üç ay sonra, ilk kez soru sordum. Bu ikisinin farkı bu dosyanın bütün hikâyesi.
`),
      choices: [cont('H103K_DEVAM', 'Devam', 'H1_03S', { role: 'PRIMARY' })],
    }),
    decisionNode('H1_03S', [{ to: 'H1_03S2' }], {
      lines: [
        W(
          all(flag('fact_kulak'), flag('suleyman_hazir')),
          `
> Savcı yeniden ayağa kalktı. Bu kez sorusu tanığın kulağına dairdi.
savci: Tanık, sol kulağınız ağır işitiyor, değil mi? Bağırışı nasıl duydunuz, saati nasıl bildiniz?
suleyman: Sol kulak, evet. Ama ofis sağımda kalır Savcı Bey; sağ kulağım tıkır tıkır. Saati de dolmuştan bilirim, dedim ya. On bir yıl, aynı dolmuş.
> Savcı başını salladı ve oturdu. Kulağı önceden sormuştum; tanık kürsüde şaşırmadı. Kendi bildiğini, kendi sözleriyle söyledi.
`,
        ),
        W(
          flag('suleyman_kocluk'),
          `
> Savcı yeniden ayağa kalktı.
savci: Tanık, bu sabah koridorda bir kâğıda bakıyordunuz. Ne yazıyordu?
suleyman: Ben… Hiç. Unutmayayım diye. Avukat hanım “kesin söyle” dedi, ben de yazdım…
> Başkan bana baktı. Uzun uzun. Bir şey söylemedi; söylemesine gerek yoktu.
~ Tanığın ağzına bir kelime koydum. Şimdi o kelime bütün tanıklığının üstünde bir leke gibi duruyor.
`,
        ),
        O(`
> Savcı yeniden ayağa kalktı.
savci: Tanık, sol kulağınız ağır işitiyor, değil mi? Bağırışı nasıl duydunuz?
suleyman: Sol kulak… evet. Ama… sağdan geldi galiba. Bilmiyorum, şaşırdım.
> Savcı oturdu; küçük bir kazanç. Bunu önceden sorup tanığın kürsüde şaşırmamasını sağlayabilirdim.
`),
      ],
    }),
    decisionNode('H1_03S2', [{ to: 'H1_04' }], {
      onEnter: [ifThen(flag('suleyman_kocluk'), [dec('cred')])],
      lines: [
        W(
          flag('press_s4'),
          `
~ “Işığın altındaydı.” Kapının üstündeki lamba. Süleyman bunu iki kez söyledi; ikincisinde sesi titremedi. Tutanakta artık bir lamba, bir çocuk ve iki boş el var.
`,
        ),
        O(`
~ Süleyman’ın gördüğü çocuğun elleri: bunu tutanağa daha güçlü geçirebilirdim. Bir soru daha sormalıydım.
`),
      ],
    }),
    court1.objection('H1_04', {
      title: 'Savcının sorusu',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'suleyman',
      lines: [
        W(
          any(flag('contra_s2'), flag('contra_s4')),
          `
> Katılan sırasından bir ses yükseldi. Gülay Toker ayağa kalkmıştı.
gulay/kizgin: Kocam öldü! Bıçak onun, ses onun! Daha ne istiyorsunuz? Saat mi? Dolmuş mu?
baskan: Katılan hanım, oturun lütfen. Söz sırası size gelecek.
> Savcı ayağa kalktı; sesi sakin, sorusu hazırdı.
savci: Tanık, sanık o gece çok öfkeliydi, değil mi? Öfkeli bir genç her şeyi yapabilir, öyle değil mi?
`,
        ),
        O(`
> Savcı ayağa kalktı; sesi sakin, sorusu hazırdı.
savci: Tanık, sanık o gece çok öfkeliydi, değil mi? Öfkeli bir genç her şeyi yapabilir, öyle değil mi?
`),
      ],
      next: 'H1_05',
      options: [
        option('H104_A', 'İtiraz: soru cevabı içinde taşıyor; telkin', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers'), raise('h104_itiraz')],
          good: 'Cevabı kendi içinde taşıyan, tanığı bir kanaate yönlendiren soruya itiraz ettin (CMK 201: soruya itiraz; başkan karar verir).',
          category: 'USUL_BILGISI',
          responses: B(`
- İtiraz ediyorum Sayın Başkan. Soru cevabını içinde taşıyor; tanığı bir kanaate yönlendiriyor.
baskan: Kabul. Savcı bey, soruyu açık sorunuz.
savci: Tanık, sanığın o geceki hâlini anlatır mısınız?
suleyman: Ağlıyordu galiba. Elleri cebindeydi. “Abi ben gidiyorum” dedi. Gitti.
`),
        }),
        option('H104_B', 'İtiraz: tanık kanaat bildiremez', {
          score: { USUL_BILGISI: 40 },
          effects: [inc('pers')],
          neutral: 'Yerinde ama eksik: sorun yalnızca kanaat değil, sorunun yönlendirici yapısıydı (CMK 201).',
          responses: B(`
- İtiraz ediyorum; tanık kanaat bildiremez.
baskan: Tanık gözlemini anlatsın. Devam edin.
suleyman: Öfkeliydi. Ağlıyordu. Her şeyi yapar mı bilmem; ben bir şey görmedim.
`),
        }),
        option('H104_C', 'Diyeceğimiz yok', {
          effects: [dec('pers')],
          neutral: 'Yönlendirici bir soruya izin verdin; tanık savcının cümlesine “evet” dedi.',
          responses: B(`
suleyman: Öfkeliydi… evet. Gençler yapar… yani…
> Savcı oturdu. Gülay Toker başını salladı.
`),
        }),
        option('H104_D', 'İtiraz: tanık yaşlı ve yorgun, ara verilsin', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred'), dec('pers')],
          bad: 'Sorunun kendisine itiraz etmedin; tanığın yaşı bir itiraz dayanağı değil. Heyet itirazı oyalama saydı.',
          category: 'USUL_BILGISI',
          responses: B(`
baskan: Tanık oturarak cevap verebilir müdafi. İtiraz reddedildi.
suleyman: Öfkeliydi… evet.
`),
        }),
      ],
    }),
    court1.objection('H1_05', {
      title: 'Ara karar · talepler',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('dil_verildi'),
          `
baskan: Taraflara diyecekleri soruldu. Müdafiin süresinde verdiği delil talep dilekçesi okundu; talep edilen kayıtların ilgili kurumlardan istenmesine.
baskan: Tanık Tarık Sezer’in bir sonraki celsede hazır edilmesine, gelmezse zorla getirilmesine. Müdafi, ayrıca bir talebiniz var mı?
`,
        ),
        O(`
baskan: Taraflara diyecekleri soruldu. Tanık Tarık Sezer’in bir sonraki celsede hazır edilmesine, gelmezse zorla getirilmesine.
baskan: Müdafi, delil talebiniz var mı? Yazılı dilekçe verilmemiş.
~ Dilekçeyi vermedim. Şimdi bir tek cümleyle istemem gerekiyor; tek bir şey.
`),
      ],
      next: 'H1_05B',
      options: [
        option('H105_KENT', 'Kentkart binişlerinin istenmesi', {
          visibleWhen: all(not(flag('dil_kent')), any(flag('fact_otobus'), flag('fact_otobus_emir'))),
          score: { USUL_BILGISI: 40 },
          effects: [raise('h1_kent')],
          good: 'Duruşmada sözlü delil talebi (CMK 206): sanığın çıkış saatini makine kaydına bağlayacak kayıt.',
          category: 'USUL_BILGISI',
          responses: B(`
- Sanığın Kentkart’ının o geceki biniş kayıtlarının BURULAŞ’tan istenmesini talep ediyoruz.
baskan: Kabul.
`),
        }),
        option('H105_DVR', 'Kayıt cihazının teknik incelemesi', {
          visibleWhen: all(not(flag('dil_dvr')), any(flag('fact_dvr'), has('clue_tarik_ariza'))),
          score: { USUL_BILGISI: 40 },
          effects: [raise('h1_dvr')],
          good: 'İncelenmemiş bir cihazın “arızalı” kabul edilmesine itiraz edip bilirkişi incelemesi istedin (CMK 63, 206).',
          category: 'USUL_BILGISI',
          responses: B(`
- Olay yerinde “çalışmıyor” diye kayda geçen kamera kayıt cihazının bilirkişiye incelettirilmesini talep ediyoruz.
baskan: Kabul.
`),
        }),
        option('H105_Z', 'Kasanın Z raporu ve POS dökümü', {
          visibleWhen: all(not(flag('dil_z')), flag('fact_z')),
          score: { USUL_BILGISI: 40 },
          effects: [raise('h1_z')],
          good: 'Tanığın anlattığı “sayım”ın saatini mali hafızadan isteyen yerinde talep (CMK 206).',
          category: 'USUL_BILGISI',
          responses: B(`
- İşletmenin yazar kasasının 14 Kasım tarihli Z raporunun ve POS dökümünün istenmesini talep ediyoruz.
baskan: Kabul.
`),
        }),
        option('H105_SESLI', 'Sesli mesajın bilirkişi incelemesi', {
          visibleWhen: all(flag('sesli_korundu'), not(flag('dil_sesli'))),
          score: { USUL_BILGISI: 60 },
          effects: [raise('h1_sesli')],
          good: 'Maktulün olay saatindeki sesli mesajının, rıza ve operatör kaydıyla bilirkişiye incelettirilmesini istedin (CMK 63, 206).',
          category: 'USUL_BILGISI',
          responses: B(`
- Maktulün 23.58’de sanığın babasına bıraktığı sesli mesajın, Kemal Yalçın’ın rızasıyla telefonundan ve operatörden alınarak bilirkişiye incelettirilmesini talep ediyoruz.
> Salonun arkasında Kemal başını kaldırdı. Savcı Karaman kalemini bıraktı.
baskan: Sesli mesaj mı? Kabul. Bilirkişi incelemesine.
`),
        }),
        option('H105_YOK', 'Talebimiz yok', {
          neutral: 'Ek talepte bulunmadın.',
          responses: B(`
- Şimdilik bir talebimiz yok Sayın Başkan.
`),
        }),
      ],
    }),
    court1.objection('H1_05B', {
      title: 'Tutukluluk',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      say: T(`
baskan: Müdafi, tutukluluk hâline ilişkin diyeceğiniz?
`),
      next: 'H1_06',
      options: [
        option(
          'H105B_A',
          'Tahliye: tasarlama dayanakları ve tek görgü tanığının anlatımı sarsıldı; adli kontrol yeterli',
          {
            effects: [
              ifThen(
                all(ref('tasarlama_sarsildi'), ref('tanik_celiski')),
                [score('USUL_BILGISI', 100), inc('legal_hits'), raise('h1_tahliye_dayanak')],
                [score('USUL_BILGISI', 20)],
              ),
            ],
            good: 'Kuvvetli suç şüphesini sarsan somut bulgulara dayanarak tutukluluğun gözden geçirilmesini istedin (CMK 100, 101, 108, 109).',
            category: 'USUL_BILGISI',
            responses: [
              W(
                all(ref('tasarlama_sarsildi'), ref('tanik_celiski')),
                `
- Sayın Başkan, tasarlamanın dayanaklarından biri bugün çöktü; tek görgü tanığının anlatımı bağımsız bir tanıkla çelişiyor. Kuvvetli suç şüphesi sarsılmıştır. Adli kontrol yeterlidir.
> Heyet kısa bir müzakere için ayağa kalktı. Üç dakika. Meral’in elindeki poşet hışırdadı.
baskan: Görgü tanığı henüz dinlenmediğinden ve delillerin bir kısmı toplanmadığından tutukluluk hâlinin devamına; tanık dinlendikten sonra yeniden değerlendirilmesine.
~ Hayır, ama “yeniden.” Bir ret içinde bir kapı aralığı. Başkan bu kelimeyi bilerek seçti.
`,
              ),
              O(`
- Sayın Başkan, sanığın tahliyesini ve adli kontrol uygulanmasını talep ediyoruz.
baskan: Suçun niteliği, mevcut delil durumu ve görgü tanığının henüz dinlenmemiş olması gözetilerek tutukluluk hâlinin devamına.
~ Bir çatlak gösteremedim. Tutukluluk bir çatlakla sarsılır; bir dilekle değil.
`),
            ],
          },
        ),
        option('H105B_B', 'Tahliye: müvekkil masumdur', {
          score: { USUL_BILGISI: -20 },
          neutral: 'Tahliye talebi somut bir gerekçe ister; masumiyet karinesi herkes için zaten geçerlidir.',
          responses: B(`
- Müvekkil masumdur Sayın Başkan; tahliyesini istiyoruz.
baskan: Masumiyet karinesi herkes için geçerli müdafi. Somut bir gerekçe göremedim. Tutukluluğun devamına.
`),
        }),
        option('H105B_C', 'Talebimiz yok', {
          neutral: 'Tutukluluk hakkında bir talepte bulunmadın.',
          responses: B(`
- Bu aşamada bir talebimiz yok.
baskan: Tutukluluk hâlinin devamına. Duruşma üç hafta sonraya ertelendi.
> Emir bana baktı. Neden bir şey söylemediğimi soran bir bakış.
`),
        }),
      ],
    }),
    story('H1_06', {
      ...H1,
      title: 'Koridor',
      background: 'adliye',
      lines: [
        W(
          flag('koridor_umut'),
          `
# ADLİYE KORİDORU · ÖĞLEDEN SONRA [bg:adliye]
> Ring aracının kapısı kapandı. Meral poşeti hâlâ elinde tutuyordu; gömlek verilememişti.
meral: Akşam evde olur demiştiniz. Ben gömleği ütüledim.
> Kemal karısının koluna girdi. Bana bakmadı. Yirmi iki yıl önce bir koridorda bir avukat ona da bir akşam vaat etmişti.
~ Umut vermek ucuzdur. Ödemesini başkası yapar. Bugün o başkası bir anneydi.
`,
        ),
        O(`
# ADLİYE KORİDORU · ÖĞLEDEN SONRA [bg:adliye]
> Ring aracının kapısı kapandı. Meral poşeti gardiyana uzatmayı başarmıştı; gömlek içeri gitmişti, oğlu gitmeden önce.
meral: Üç hafta. Üç hafta daha. Ne yapacaksınız?
- Kayıtlar gelecek. Öbür tanık gelecek.
`),
      ],
      choices: [cont('H106_DEVAM', 'Merdivenler', 'H1_07', { role: 'PRIMARY' })],
    }),
    story('H1_07', {
      ...H1,
      title: 'Merdivenler',
      background: 'adliye',
      lines: B(`
> Merdivenlerin başında Leyla duruyordu. Kemal ile Meral yanından geçmek zorundaydı; başka merdiven yoktu.
> Kemal durdu. Yirmi iki yıl sonra ilk kez Leyla’nın yüzüne baktı. Leyla gözlerini kaçırmadı.
kemal: Oğlumun yanında durma.
> Bir cümle. Sesi yükselmedi. Leyla bir şey söylemedi; bir adım geri çekildi, yolu açtı. Kemal ile Meral indiler.
> Leyla bir süre merdivenlerin başında kaldı. Sonra bana döndü.
leyla: Bugün iyi soru sordun. Bir yaşlı adama, üç ay sonra, ilk kez.
- Kemal Bey…
leyla: Kemal Bey haklı. Ben merdivenin başında dururum. Yanında değil.
~ Bir avukat bir müvekkile yirmi iki yıl borçlu kalabilir mi? Bu dosya bunu soruyor. Ben de cevabını bilmiyorum.
`),
      choices: [cont('H107_DEVAM', 'Akşam', 'H1_08', { role: 'PRIMARY' })],
    }),
    story('H1_08', {
      ...H1,
      title: 'Hamitler, akşam',
      background: 'ev',
      lines: [
        W(
          flag('koridor_durust'),
          `
# SALI 20.30 — HAMİTLER [bg:ev]
> Söz vermiştim: akşam ben anlatacaktım. Meral kapıyı açtı; elinde yine bir iğne. Mutfakta Kemal, önünde soğumuş bir çay.
meral: Gelin. Siz söylemiştiniz; bugün çıkmaz diye. Ben yine de yemek yaptım; iki tabak fazla.
> Masaya oturdum. Süleyman’ı, dolmuşu, iki boş eli anlattım. Kemal dinledi; bir kez bile sözümü kesmedi.
kemal: O yaşlı adam… “kimse sormadı” dedi, öyle mi?
- Öyle dedi.
kemal: Benim dosyamda da kimse bir şey sormamıştı. Üç kişi vardı o evde; yalnızca ikimize soru soruldu.
> Bir an durdu, çayını karıştırdı. Kaşık bardağa çarptı; bir, iki.
kemal: Avukat hanım. Bugün o kadın merdivenin başında durdu. Ben ona “yanında durma” dedim. O da durmadı; çekildi. Yirmi iki yıl önce de böyle çekilmişti; ben içeri girerken.
> Meral kocasının omzuna elini koydu. Kemal elini çekmedi.
~ Bir söz tuttum: akşam geldim, anlattım. Küçük sözler daha zor tutulur; çünkü kimse onları tuttuğunu fark etmez. Bu evde ettiler.
`,
        ),
        O(`
# SALI 20.30 — HAMİTLER [bg:ev]
> Meral kapıyı açtı. Yüzünde bir şey vardı; kızgınlık değil, yorgunluk. Gömlek poşeti hâlâ kapının yanındaydı.
meral: Akşam evde olur demiştiniz. Kemal mutfakta. Konuşmaz.
> Mutfağa geçtim. Kemal bana bakmadan konuştu.
kemal: Yirmi iki yıl önce de bir avukat bana “bu akşam evdesin” demişti. İnanmıştım. Bir daha inanmam dedim; Meral inandı.
> Süleyman’ı, dolmuşu, iki boş eli anlattım. Kemal dinledi. Sonunda tek bir şey söyledi.
kemal: Bir daha söz verme. Kâğıt getir.
~ Bir söz yerine bir kâğıt. Bu evde bunun değerini benden iyi bilen yok.
`),
      ],
      choices: [cont('H108_DEVAM', 'Üç hafta', 'ARA_GIRIS_1', { role: 'PRIMARY' })],
    }),
  ],
  triggers: [
    {
      id: 'tg_cokus',
      priority: 0,
      once: true,
      when: all(flag('in_court'), cmp(v('cred'), '<=', 0)),
      effects: [set('cokus', true)],
      goto: 'T_INT_COKUS',
    },
  ],
};
