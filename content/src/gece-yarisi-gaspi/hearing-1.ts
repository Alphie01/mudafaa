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
  ground,
  has,
  hl,
  ifThen,
  inc,
  meet,
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

// 60-trial: 1. celse. Koridor, açılış, sanığın savunması, savcının kayıt talebi, mağdurun tanıklığı (N1–N5),
// salonda teşhis isteği, ara karar ve tutukluluk.

export const hearing1: CasePart = {
  config: {
    objectionGrounds: [
      ground('g_telkin', 'Telkin edici, yönlendirici soru', 'CMK 201/1'),
      ground('g_kanaat', 'Tanığın gözlemi değil kişisel kanaati', 'CMK 217'),
      ground('g_duyum', 'Tanık başkasından duyduğunu aktarıyor', 'CMK 210'),
    ],
  },
  predicates: [
    {
      id: 'tahliye_dayanak',
      label: 'Teşhisi sarsan bir bulgu var',
      when: any(flag('contra_n3'), flag('contra_n5'), all(flag('contra_n4'), flag('contra_n2'))),
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
# 14 NİSAN · 09.20 — BURSA ADLİYESİ, 3. KAT [bg:adliye]
> Adliye koridoru sabahın erken saatinde bile bir istasyon gibiydi. Cübbeler, dosyalar, ağlayan bir çocuk, bir sigara kokusu ki kimse nereden geldiğini söyleyemezdi.
> Bursa 6. Ağır Ceza’nın kapısında Sevim Hanım ve Derya bekliyordu. Sevim Hanım tespihini, Derya telefonunu sıkıyordu.
`),
    }),
    decisionNode('H1_00G_2', [{ to: 'H1_00G_3' }], {
      onEnter: [ifThen(flag('nermin_baski'), [dec('cred'), dec('pers')])],
      lines: [
        W(
          flag('nermin_baski'),
          `
> Koridorun öbür ucunda Nermin Hanım, kızının koluna girmiş, bir bankta oturuyordu. Beni görünce yüzünü çevirdi. Kızı ayağa kalktı, bana doğru iki adım attı, sonra vazgeçti.
~ Kapısını çaldığım kadın. Zinciri hâlâ aramızda.
> Mübaşir yanıma geldi. “Başkan sizi bekliyor avukat hanım; duruşmadan önce.” Odada Başkan tek bir cümle kurdu: “Mağdurun kapısına bir daha gitmeyin.” Dilekçe dosyadaydı.
`,
        ),
        O(`
> Koridorun öbür ucunda Nermin Hanım, kızının koluna girmiş, bir bankta oturuyordu. Sol elinde ince bir yara izi. Barış’ın getirileceği kapıya hiç bakmıyordu.
~ Ona bakmamak için çok uğraşıyordu. Ben de.
`),
      ],
    }),
    decisionNode('H1_00G_3', [{ to: 'H1_00K' }], {
      lines: [
        W(
          flag('zarf_aldi'),
          `
derya: Annem sabah ezanından beri burada. Ben salonu kapattım, kepenge “Duruşma” yazdım.
~ Masamda kuzenin zarfı duruyor. Derya’nın haberi yok.
`,
        ),
        O(`
derya: Salonu kapattım canım. Kepenge “Duruşma” yazdım. Bu ailede herkes bir kapısını kapattı; Barış’ınki zaten kapalı.
`),
      ],
    }),
    story('H1_00K', {
      ...H1,
      title: 'Koridor',
      background: 'adliye',
      lines: B(`
> Sevim Hanım koluma dokundu. Tespihin taneleri parmaklarının arasında durmuştu.
sevim/uzgun: Kızım… Bugün bırakırlar mı? Ben yatağını yaptım. Yine.
derya: Anne, bırak avukatı. Daha içeri girmedik.
sevim: Sormak da mı yasak kızım? Üç aydır kimse bir şey söylemiyor bana. Polis söylemedi, savcı söylemedi. Bari bu kız söylesin.
> Koridorun ucunda jandarma bir kapıyı açtı. Kelepçeli bir genç, iki asker arasında, bir başka salona götürüldü. Barış değildi. Sevim Hanım yine de ayağa kalktı.
`),
      choices: [
        option('H100K_A', '“Bugün bitmeyecek. Ama bugün başlıyor.”', {
          effects: [raise('koridor_durust')],
          responses: B(`
- Bugün bitmeyecek Sevim Hanım. Ama bugün başlıyor. Ne olursa olsun, akşam size ben anlatacağım.
sevim: Başlasın kızım. Başlasın da… Allah’ım.
~ Bir anneye “belki” demek, “evet” demekten zordur. Ama ertesi gün yüzüne bakabilirsin.
`),
          next: 'H1_00',
        }),
        option('H100K_B', '“İnşallah bu akşam evde olur.”', {
          effects: [raise('koridor_umut')],
          responses: B(`
- İnşallah bu akşam evde olur Sevim Hanım.
> Kadının yüzü aydınlandı. Tespih yeniden dönmeye başladı. Derya bana baktı; bir şey demedi. Gözleri her şeyi dedi.
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
      onFirstEnter: [meet('rahmi'), meet('elif'), meet('orhan'), meet('sukru')],
      lines: B(`
sukru: Barış Kılınç dosyası! Taraflar salona! Hı-hım.
# BURSA 6. AĞIR CEZA MAHKEMESİ — 1. CELSE [bg:durusma_salonu]
> Salon küçüktü; yüksek tavan, solgun perdeler, Atatürk portresinin altında yazı: ADALET MÜLKÜN TEMELİDİR. Kürsüde üç hâkim, sağda savcı.
> Jandarma Barış’ı getirdi. Kelepçesi kapıda çözüldü. Salona girerken gözleri annesini aradı; buldu, gülümsemeye çalıştı, beceremedi.
rahmi: Sanık Barış Kılınç’ın tutuklu olarak, müdafii Av. Deniz Arslan’ın hazır olduğu görüldü. Mağdur Nermin Aksoy hazır; tanık olarak dinlenmek üzere salon dışında bekletiliyor.
rahmi: Açık yargılamaya başlandı. Sanığın kimliği tespit edildi. İddianame özetini Cumhuriyet savcısından dinleyelim.
> Savcı Orhan Bayar ayağa kalktı. Ellilerinde, ağır, kır bıyıklı. Kâğıda bakmadan konuştu; bu iddianameyi kendisi yazmıştı.
orhan: Sanık 18 Ocak gece 23.42 sıralarında Tophane Sırmakeş merdivenlerinde mağdur Nermin Aksoy’u bıçak göstererek ve iterek çantasını almıştır.
orhan: Mağdur, olaydan saatler sonra usulüne uygun yapılan fotoğrafla teşhiste sanığı tereddütsüz teşhis etmiştir. Eylem TCK 149/1-a ve h kapsamındadır.
rahmi: Sanığa hakları hatırlatıldı. Sanık, savunmanızı yapın.
~ “Usulüne uygun.” Savcı bu iki kelimeyi o kadar rahat söyledi ki, bir an ben de inanacaktım.
> Dinleyici sırasında Derya ile Sevim Hanım, öbür uçta Nermin Hanım’ın kızı. Nermin Hanım salonda değildi; tanıklar dışarıda bekletilir. Kızı bir kere bana baktı; bir avukata değil, bir düşmana bakar gibi.
~ Bu salonda kimse kötü değil. Bunu bilmek işimi kolaylaştırmıyor; zorlaştırıyor.
`),
      choices: [cont('H100_DEVAM', 'Sanığın savunması', 'H1_01', { role: 'PRIMARY' })],
    }),
    choiceNode('H1_01', {
      ...H1,
      title: 'Sanığın savunması',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
baris: Ben o gece evdeydim Sayın Başkan. Ateşim vardı, kırk. Akşam doktora gittim. Eve geldim, yattım. Sabah polis kapıyı çaldı.
baris: Ben kimsenin çantasını almadım. O kadını hiç görmedim. Allah’ımı severim, görmedim.
rahmi: Müdafi, sanığa sorularınız varsa sorabilirsiniz.
~ Ona soracağım her soru heyete bir şey anlatır. Doğru sorular onun hikâyesini kurar; yanlış soru, savcının hikâyesini.
`),
      choices: [
        option('Q_ATES', '“O akşam doktora gittiniz mi?”', {
          score: { SORGULAMA: 20 },
          responses: B(`
baris: Gittim. Beşi kırk gibi. Aile hekimi kırk dedi, otuz dokuz bir. Reçete yazdı. Evde reçetesi var.
> Elif Karaca not aldı. Başkan başını salladı.
`),
          next: '$stay',
        }),
        option('Q_BALKON', '“Elektrik kesildiğinde ne yaptınız?”', {
          visibleWhen: any(flag('fact_balkon_baris'), has('clue_kadir')),
          score: { SORGULAMA: 40 },
          effects: [inc('pers')],
          good: 'Sanığın kendi anlatısını bağımsız bir olaya (kesinti) bağlayan açık uçlu soru.',
          category: 'SORGULAMA',
          responses: B(`
baris: Elektrik gitti. Karanlıkta boğuldum, balkona çıktım. Üst kattaki Kadir Usta mum yakmıştı. “Usta sizde de mi gitti” dedim.
baris: “Gir içeri oğlum, hasta hasta” dedi. Girdim. Sonra elektrik geldi, televizyon kendi kendine açıldı.
> Savcı ilk kez başını kâğıdından kaldırdı. Bir şey yazdı.
`),
          next: '$stay',
        }),
        option('Q_FOTO', '“Üç yıl önce nasıl görünüyordunuz?”', {
          visibleWhen: has('clue_eski_foto'),
          score: { SORGULAMA: 40 },
          effects: [inc('pers')],
          good: 'Teşhiste kullanılan fotoğrafın güncel olmadığını sanığın ağzından heyete duyurdun.',
          category: 'SORGULAMA',
          responses: B(`
baris: Askerden yeni gelmiştim. Saçım sıfırdı, ince bir bıyığım vardı. O fotoğrafı karakolda çektiler, bir düğün kavgasından.
baris: Şimdi… böyleyim. Annem bile o fotoğrafı görünce “bu kim” dedi.
> Elif Karaca dosyadan gözaltı fotoğrafını çıkardı, sanığa baktı, yeniden fotoğrafa baktı.
`),
          next: '$stay',
        }),
        option('Q_KULAK', '“Hiç küpe taktınız mı?”', {
          visibleWhen: has('clue_kulak'),
          score: { SORGULAMA: 40 },
          effects: [inc('pers')],
          good: 'Sanığın fiziksel bir özelliğini, ilk tarifle karşılaştırılabilecek biçimde tutanağa geçirttin.',
          category: 'SORGULAMA',
          responses: B(`
baris: Hayır. Kulağım hiç delinmedi. İsterseniz bakın.
rahmi: Tutanağa geçsin: sanığın iki kulağında da delik ya da iz görülmedi.
> Savcı kaşını kaldırdı. Neden sorduğumu anlamamıştı. Henüz.
`),
          next: '$stay',
        }),
        option('Q_MOTOR', '“Motorunuz o gece neredeydi?”', {
          score: { SORGULAMA: -20 },
          effects: [raise('motor_soruldu')],
          neutral: 'Sanığın emin olmadığı bir konuyu açık oturumda sordun; cevabı savcılığın notuna girdi.',
          responses: B(`
baris: Aşağıda. Sokakta. Hep orada durur.
> Bir saniye fazla düşündü. Savcı bunu gördü. Ben de gördüm.
orhan: Anahtarı kimde olur motorun?
baris: Bende… Bir de yedeği var, evde. Çivide.
~ Bu soruyu neden sordum? Cevabını bilmediğim soruyu kürsüde sormamalıydım.
`),
          next: '$stay',
        }),
        option('Q_EMIN', '“Ateşliyken olanları hatırladığınızdan emin misiniz?”', {
          score: { SORGULAMA: -30 },
          effects: [dec('pers')],
          bad: 'Kendi müvekkilinin hafızasını sorguladın; savcılığın işini yaptın.',
          category: 'SORGULAMA',
          responses: B(`
baris/saskin: Emin… Eminim. Yani… Ateşim vardı ama… Evdeydim.
> Savcının yüzünde küçük bir gülümseme. Elif Karaca kalemini bıraktı.
~ Bir avukat müvekkilini savcıdan önce kuşkuya düşürürse, heyete savcıdan güçlü bir argüman vermiş olur.
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
orhan: Sayın Başkan, sanığın kurye olarak çalıştığı HızlıPaket firmasından olay gecesine ait hesap, sipariş ve konum kayıtlarının istenmesini talep ediyoruz.
orhan: Ayrıca sanığın el konulan telefonunun incelenmesini; olası suç ortaklarının tespiti için.
rahmi: Müdafi, talebe diyeceğiniz?
~ Konum kaydı. Barış’ın hesabı o gece kapalıysa bu bizim lehimize. Açıksa… Barış motorun yerini söylerken bir saniye fazla düşünmüştü.
`),
      next: 'H1_03',
      options: [
        option('H102_A', '“Katılıyoruz; cihaz ve doğrulama kaydı da gelsin.”', {
          score: { USUL_BILGISI: 100 },
          effects: [raise('selfie_istendi'), inc('legal_hits'), inc('pers')],
          good: 'Kayıtların bütünüyle (giriş cihazı, kimlik doğrulama özçekimi) istenmesi, hesabı kimin kullandığı sorusunu baştan açar (CMK 177, 332).',
          category: 'USUL_BILGISI',
          responses: B(`
- Talebe katılıyoruz Sayın Başkan. Yalnızca konum değil; hesabın hangi cihazdan açıldığı ve firmanın oturum açılışında istediği kimlik doğrulama özçekimleri de istensin.
- Bir hesabın yeri, o hesabı taşıyan kişinin yeri değildir.
> Başkan savcıya baktı. Savcı omuz silkti: itirazı yoktu. Elif Karaca “özçekim” kelimesinin altını çizdi.
`),
        }),
        option('H102_B', '“Katılıyoruz; kayıtlar müvekkilin evde olduğunu gösterir.”', {
          neutral: 'Talebe katıldın; ama kaydın kapsamını genişletmedin.',
          responses: B(`
- Talebe katılıyoruz Sayın Başkan. Kayıtlar müvekkilin o gece evde olduğunu gösterecektir.
rahmi: Kabul.
~ Gösterecektir. Bir kaydın ne göstereceğini, onu okumadan söyledim. Umarım.
`),
        }),
        option('H102_C', '“Karşı çıkıyoruz; kayıtlar ilgisiz ve talep çok geniş.”', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred'), dec('pers')],
          bad: 'Maddi gerçeğe ilişkin delilin toplanmasına gerekçesiz karşı çıkmak “saklanacak bir şey var” izlenimi verir; mahkeme yine de toplar.',
          category: 'USUL_BILGISI',
          responses: B(`
- Karşı çıkıyoruz Sayın Başkan. Kayıtlar olayla ilgisiz.
rahmi: Sanığın kurye olarak olay yerine yakın bölgede çalıştığı iddia ediliyor müdafi. İlgisiz değil. Talep kabul edildi.
> Savcı bana baktı; ilk kez merakla.
~ Bir avukatın korkusu, savcının en iyi tanığıdır.
`),
        }),
        option('H102_D', '“Telefon incelemesine karşı çıkıyoruz: özel hayat.”', {
          score: { USUL_BILGISI: -20 },
          neutral:
            'El konulan cihazın incelenmesine mahkeme CMK 134 çerçevesinde karar verir; genel bir özel hayat itirazı bu aşamada sonuç vermez.',
          responses: B(`
- Telefonun incelenmesine karşı çıkıyoruz; müvekkilin özel hayatına ilişkin veriler içeriyor.
rahmi: Cihaz zaten el konulmuş. İnceleme kapsamını mahkeme belirler; yalnızca olay gecesiyle sınırlı tutulur. Talep bu kapsamda kabul edildi.
`),
        }),
      ],
    }),
    court1.testimony('H1_03', {
      title: 'Mağdurun dinlenmesi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'nermin',
      witnessLabel: 'MAĞDUR · NERMİN AKSOY',
      rulesText: 'İpucu: önce bastır, sonra doğru delille göster. Yanlış delil güvenilirliği ve skoru düşürür.',
      objectionGrounds: ['g_telkin', 'g_kanaat', 'g_duyum'],
      say: T(`
sukru: Mağdur Nermin Aksoy! Hı-hım.
> Nermin Hanım kızının kolundan ayrılıp salona girdi. Küçük, dik, gri bir hırka. Kürsüye tutunduğunda sol elindeki yara izi göründü.
rahmi: Mağdur hanım, kimliğiniz tespit edildi. Mağdur olarak yemin ettirilmeyeceksiniz; ama gerçeği söylemekle yükümlüsünüz. Olayı anlatın.
nermin: O gece vardiyadan çıktım. Merdivenden iniyordum. Biri arkamdan geldi, çantama yapıştı. Bıraktırmadım. Sonra… ben düştüm. Elim…
> Bir an durdu. Kürsünün kenarını sıktı. Sonra yeniden başladı; daha düz, daha ezberlenmiş.
nermin: Ertesi gün karakolda fotoğraflara baktım. Onu tanıdım. Bu çocuk.
> Barış’a bakmadı. “Bu çocuk” derken parmağı kürsünün üstünde kaldı.
rahmi: Müdafi, sorularınız.
~ Beş cümle. Hiçbirinde yalan yok. Hepsinde birinin parmak izi var.
> Savcı sorusunu sordu: “Teşhiste tereddüt ettiniz mi?” Nermin Hanım başını iki yana salladı. Savcı oturdu; işini bitirmişti.
~ Leyla’nın mesajı: “Onun ilk sözlerini göster; gerisini o kendisi görecek.” Önce dinleyeceğim. Sonra bastıracağım. Kâğıtları en son açacağım.
> Nermin Hanım kürsüde ellerini birleştirdi. Sol avucundaki iz, ince beyaz bir çizgi, florasanın altında parladı. Bir an ona baktı; sonra elini çevirip gizledi.
~ Her tanığın kürsüde sakladığı bir şey vardır. Bu kadının sakladığı tek şey bir yara izi. Ve bir şüphe; henüz kendisinin bile bilmediği.
`),
      statements: [
        statement('N1', 1, [
          'O gece ',
          hl('yüzünü çok yakından gördüm', any(flag('press_n1'), has('ded_eski_foto'))),
          '. O yüzü unutmam.',
        ]),
        statement('N2', 2, [
          'Elinde ',
          hl('bıçak vardı, parladı', any(flag('press_n2'), has('clue_bicak_yok'))),
          '; elimi o kesti.',
        ]),
        statement('N3', 3, [
          hl('Polis bana kimseyi göstermedi', any(flag('press_n3'), has('ev_gozlem'), has('ded_kirlenme'))),
          '; karakolda fotoğrafların arasından kendim seçtim.',
        ]),
        statement('N4', 4, [
          'Altı fotoğrafa baktım, ',
          hl('tereddüt etmedim', any(flag('press_n4'), has('clue_foto_farkli'))),
          '. Zaten böyle çocuklar hep gece dolaşır.',
        ]),
        statement(
          'N5',
          5,
          [
            'Düz, temiz bir çocuktu; ',
            hl('kulağında, burnunda bir şey yoktu', any(has('clue_halka'), has('clue_ali_halka'))),
            '.',
          ],
          flag('press_n1'),
        ),
      ],
      rules: [
        pressRule('PR_N1', 'N1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_n1')],
          responses: B(`
- Yakından derken? Ne kadar yakından?
nermin: Bir kol boyu. Kapüşonu vardı ama yüzü göründü. Gençti. İnce.
- Başka bir şey? Saçı, kulağı, bir iz?
nermin: Düz bir çocuktu. Temiz. Kulağında, burnunda bir şey yoktu. Şimdiki gençler gibi değil.
~ Az önce bir cümle daha kurdu. Beşinci cümle. Bunu ilk kez söylüyor; kolluk ifadesinde bile yok.
`),
        }),
        pressRule('PR_N2', 'N2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_n2')],
          responses: B(`
- Bıçağı nasıl gördünüz? Hangi elinde?
nermin: Bir şey parladı. Elinde… Herhalde elinde. Bıçak olmasa elim nasıl kesilsin evladım?
~ “Herhalde.” Bir kelime. Kürsüde en ağır kelimelerden biri.
`),
        }),
        pressRule('PR_N3', 'N3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_n3')],
          responses: B(`
- Acil serviste sizinle konuşan bir polis oldu mu?
nermin: Biri geldi. Geçmiş olsun dedi. Ben… çok ağrım vardı. Hatırlamıyorum ne konuştuğumuzu.
- Size bir şey gösterdi mi?
nermin: Hatırlamıyorum dedim ya. Karakolda gösterdiler. Ben orada seçtim.
`),
        }),
        pressRule('PR_N4', 'N4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_n4')],
          responses: B(`
- Fotoğraflara ne kadar baktınız?
nermin: Bakmadım bile. Hemen gördüm. Gözüm direkt ona gitti.
- Neden ona gitti sizce?
nermin: Çünkü oydu.
> Savcı başını salladı. Ben de salladım; başka bir nedenle.
`),
        }),
        presentRule('PS_N3', 'N3', ['ev_gozlem', 'ded_kirlenme'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_n3')],
          good: 'Teşhisten dokuz saat önce acilde gösterilen tek fotoğraf ortaya kondu: teşhis kirlenmiş (PVSK ek md. 6; CMK 217).',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, acil servisin hemşire gözlem formu. 19 Ocak, saat 00.40: “Polis memuru hastaya telefondan fotoğraf gösterdi; hasta ağladı.”
- Nermin Hanım, o gece size telefonda bir fotoğraf gösterildi mi?
> Kadın formun fotokopisine baktı. Uzun uzun. Sonra gözlerini kapadı.
nermin/uzgun: Bir fotoğraf… Evet. Telefon. “Bu mu teyze” dedi. Ben… ben ağrıdan… “Galiba” dedim.
nermin: Ertesi gün karakolda aynı yüzü görünce… ben… tanıdım sandım. Tanıdım. Bilmiyorum.
rahmi: Tutanağa geçsin: mağdur, teşhisten önce acil serviste kendisine bir kolluk görevlisince telefondan fotoğraf gösterildiğini beyan etti.
> Savcı Orhan Bayar dosyasında bir sayfayı çevirdi, sonra bir daha, sonra bıraktı. Bir şey arıyordu; bulamadı.
`),
        }),
        presentRule('PS_N2_IHBAR', 'N2', ['ev_ihbar'], {
          visibleWhen: has('clue_bicak_yok'),
          enabledWhen: has('clue_bicak_yok'),
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_n2')],
          good: '112 dökümünde bıçak yok: “itti, düştüm, elim kesildi.” Silah unsuru (TCK 149/1-a) ilk beyanla çelişiyor.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, olaydan bir dakika sonra yapılan 112 çağrısının dökümü. Mağdur şöyle diyor: “İtti beni, düştüm, elim kesildi.” Bıçak yok.
nermin/saskin: Ben… öyle mi dedim? Düştüm, evet. Elim… camın üstüne düştüm galiba. Şişe vardı.
nermin: Bıçağı… polis bey sordu, “bıçak var mıydı” dedi. Bir şey parlamıştı. Ben de… evet dedim.
> Elif Karaca ilk kez sorusunu doğrudan tanığa yöneltti.
elif: Parlayan şeyi elinde mi gördünüz, yoksa başka bir yerde mi?
nermin: Bilmiyorum hâkim hanım. Bir şey parladı. Nerede olduğunu bilmiyorum.
`),
        }),
        presentRule('PS_N2_DED', 'N2', ['ded_bicak'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_n2')],
          good: 'Bıçağın ilk beyanda olmadığı ve kesinin cam kırığından olabileceği gösterildi; silah unsuru şüpheli.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, 112 çağrısında bıçak geçmiyor. Olay yeri fotoğrafı 14’te mağdurun düştüğü basamakta kanlı bir şişe kırığı var. Adli rapor da kesinin camla oluşabileceğini söylüyor.
nermin/uzgun: Şişe… Evet, şişe vardı. Ben elimi oraya koydum. Sonra… bıçak dediler, ben de bıçak sandım.
`),
        }),
        presentRule('PS_N4_TESHIS', 'N4', ['ev_teshis'], {
          visibleWhen: has('clue_foto_farkli'),
          enabledWhen: has('clue_foto_farkli'),
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_n4')],
          good: 'Tutanaktaki tek renkli, büyük fotoğraf: benzer kişiler arasından teşhis kuralı (PVSK ek md. 6) çiğnenmiş.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, teşhis tutanağı. Beş fotoğraf siyah-beyaz, küçük, otuz sekiz ile elli iki yaş arası. Biri renkli, büyük, on dokuz yaşında bir genç. Gözünüz neden ona gitti Nermin Hanım?
nermin: Çünkü… çünkü onu biliyordum. Gece görmüştüm.
- Gece mi, yoksa acilde mi?
> Kadın cevap vermedi. Başkan bir süre bekledi, sonra kâtibe bir işaret yaptı.
`),
        }),
        presentRule('PS_N4_DED', 'N4', ['ded_usulsuz'], {
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_n4')],
          good: 'Tarif sonradan yazıldı, işlem bir kez ve uyarısız yapıldı: teşhis tutanağı usulsüz (PVSK ek md. 6).',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, tutanakta teşhis 10.05’te, tarif 10.20’de. İşlem bir kez yapılmış; “aralarında olmayabilir” uyarısı yok.
- Nermin Hanım, fotoğraflardan önce size failin nasıl biri olduğu soruldu mu?
nermin: Sonra sordular. Seçtikten sonra. “Nasıl biriydi” dediler, ben de… fotoğraftakini anlattım.
`),
        }),
        presentRule('PS_N1_ESKI', 'N1', ['ded_eski_foto'], {
          score: { SORGULAMA: 100 },
          effects: [inc('pers'), raise('contra_n1')],
          neutral: 'Kısmi isabet: gösterilen fotoğraf eskiydi; ama tanık hâlâ aynı yüzü gördüğünü söylüyor.',
          responses: B(`
- Size gösterilen fotoğraf üç yıl önce çekilmiş. Kazınmış saç, ince bıyık. Bugün sanığa bakın: uzun saç, sakal. Gördüğünüz yüz hangisi?
nermin: Fotoğraftaki. Gece gördüğüm… fotoğraftaki gibiydi.
~ Fotoğraftaki gibi. Sanık gibi değil. Kendisi farkında değil; heyet farkında.
`),
        }),
        presentRule('PS_N5', 'N5', ['ev_ihbar', 'ded_halka'], {
          enabledWhen: any(has('clue_halka'), has('ded_halka')),
          visibleWhen: any(has('clue_halka'), has('ded_halka')),
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_n5'), { type: 'GOTO', node: 'H1_03K' }],
          good: 'Mağdurun kirlenmeden önceki ilk tarifi (sol kulakta halka) sanığa uymuyor.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, 112 çağrısının ses kaydı, saat 23.44.02. Mağdur diyor ki: “Kulağında halka vardı, parladı. Sol kulağında.”
- Sanığın kulakları, az önce tutanağa geçtiği gibi, hiç delinmemiş.
`),
        }),
        objectRule('OB_N4', 'N4', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [inc('pers')],
          good: 'İtiraz yerinde: “böyle çocuklar” bir gözlem değil, kanaat.',
          category: 'SORGULAMA',
          responses: B(`
- İtiraz ediyorum Sayın Başkan. “Böyle çocuklar hep gece dolaşır” bir gözlem değil, kanaattir.
rahmi: Yerinde. Mağdur hanım, yalnızca gördüklerinizi anlatın. Bu cümle tutanağa geçmeyecek.
nermin: Özür dilerim. Ağzımdan çıktı.
`),
        }),
        presentRule('PS_SAVCILIK', undefined, ['ev_teshis', 'ev_nermin_kolluk', 'ev_darp', 'ev_sabika'], {
          maxUses: 10,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'Savcılığın delilini kendi tanığına gösterdin; hiçbir çelişkiyi ortaya koymadı. −1 güvenilirlik, −150 skor.',
          category: 'SORGULAMA',
          responses: B(`
orhan: Sayın Başkan, müdafi bizim delilimizi bizim tanığımıza okuyor. Teşekkür ederiz.
~ Kendi kalemime kendim mürekkep döktüm.
`),
        }),
        presentRule('PS_IHBAR_X', undefined, ['ev_ihbar'], {
          maxUses: 5,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'Dökümü okudun ama içinde neyi göstereceğini bilmiyordun; çelişkiyi önce dökümde bul.',
          category: 'SORGULAMA',
          responses: B(`
nermin: Ben polisi aradım, evet. Ne olmuş?
rahmi: Müdafi, dökümün hangi kısmı bu beyanla çelişiyor?
~ Bilmiyordum. Okuduğum bir kâğıdı, okumadığım bir yerden açmıştım.
`),
        }),
      ],
      presentMiss: fallback('FB_H1_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil: −1 güvenilirlik, −150 skor.', category: 'SORGULAMA' },
        responses: B(`
rahmi: Bu delilin beyanla ilgisini göremedim müdafi.
~ Yanlış kapıya vurdum. Ses salonda yankılandı.
`),
      }),
      objectMiss: fallback('FB_H1_OBJECT', 'OBJECT', {
        effects: [dec('cred'), inc('wrong'), score('SORGULAMA', -50, 'hatali')],
        quality: { q: 'BAD', feedback: 'Dayanaksız itiraz.', category: 'SORGULAMA' },
        responses: B(`
rahmi: İtiraz reddedildi. Dayanağı yok.
`),
      }),
      finish: { id: 'H103_BITIR', next: 'H1_04' },
    }),
    court1.stage('H1_03K', {
      title: 'Kırılma',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'nermin',
      lines: B(`
> Salon sustu. Kâtibin klavyesi durdu. Koridordan bir kapı sesi geldi ve o da sustu.
nermin/saskin: Halka mı? Ben… öyle mi demişim?
> Kürsünün kenarını iki eliyle tuttu. Gözlerini Barış’a çevirdi; ilk kez. Uzun uzun baktı. Saçlarına, sakalına, kulaklarına.
nermin/uzgun: Ben o gece… bir şey parladı. Ben onu bıçak sandım. Sonra… acilde o fotoğrafı gösterdiler. Sonra karakolda yine o fotoğraf.
nermin: Ben yalan söylemem evladım. Ben gördüğümü söyledim. Ama… ama hangisini gördüğümü artık bilmiyorum.
> Ağlamadı. Yorgun bir sesle, kendi kendine konuşur gibi söyledi. Kızı dinleyici sırasında elini ağzına götürdü.
rahmi: Tutanağa geçsin: mağdur, 112 çağrısında failin sol kulağında halka olduğunu söylediğini; bugün bunu hatırlamadığını beyan etti.
> Savcı Orhan Bayar uzun bir süre konuşmadı. Sonra kalemini masaya bıraktı; yavaşça, sesini çıkarmadan.
~ Bir kadını yenmedim. Onun ilk sözlerini ona geri verdim. Bu ikisinin farkını yalnızca o ve ben biliyoruz.
`),
      choices: [cont('H103K_DEVAM', 'Devam', 'H1_04', { role: 'PRIMARY' })],
    }),
    court1.objection('H1_04', {
      title: 'Salonda teşhis',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'nermin',
      lines: [
        W(
          flag('contra_n5'),
          `
orhan: Sayın Başkan, bir sorum var. Mağdur hanım, salonda bulunan sanığa bakınız. O gece gördüğünüz kişi bu mu?
~ Az önce “hangisini gördüğümü bilmiyorum” diyen bir kadına, sanık sandalyesindeki tek genci gösteriyor.
`,
        ),
        O(`
orhan: Sayın Başkan, bir sorum var. Mağdur hanım, salonda bulunan sanığa bakınız. O gece gördüğünüz kişi bu mu?
~ Salonda yirmi iki yaşında tek bir genç var; jandarmanın yanında, sanık sandalyesinde. Bu bir soru değil, bir cevap.
`),
      ],
      next: 'H1_04B',
      options: [
        option('H104_A', 'İtiraz: soru telkinli, salonda başka genç yok', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers'), raise('h104_itiraz')],
          good: 'Salonda, sanık sandalyesindeki tek kişiye yöneltilen teşhis sorusu telkindir (CMK 201/1); bu “teşhis” PVSK ek md. 6 güvencelerinin hiçbirini taşımaz.',
          category: 'USUL_BILGISI',
          responses: B(`
- İtiraz ediyorum Sayın Başkan. Salonda sanık sandalyesinde oturan tek kişiyi göstermek teşhis değil, telkindir. Benzer kişi yok, uyarı yok, tekrar yok.
rahmi: Kabul. Soru yöneltilmeyecek. Mahkeme salonda yapılan teşhise ayrıca değer vermez.
> Savcı oturdu. Kızgın değildi. Biraz yorgundu. Belki biraz da rahatlamıştı.
`),
        }),
        option('H104_B', 'Diyeceğimiz yok; tanık cevap versin', {
          effects: [dec('pers')],
          neutral: 'Telkinli bir salon teşhisine izin verdin; mağdur, sandalyedeki tek gence baktı.',
          responses: B(`
nermin: Bilmiyorum… Galiba. O fotoğraftaki… Galiba bu.
~ “Galiba.” Bir kelime. Bu dosyada bir kaderi değiştirecek kadar ağır.
`),
        }),
        option('H104_C', 'İtiraz: tanık yorgun, beyanı artık güvenilmez', {
          score: { USUL_BILGISI: -20 },
          neutral: 'Tanığın yorgunluğu bir dayanaktır ama sorunun kendisine itiraz etmedin.',
          responses: B(`
rahmi: On dakika ara verilmeyecek; mağdur hanım oturarak cevap verebilir. Soru yöneltilsin.
nermin: Galiba… Bu.
`),
        }),
        option('H104_D', 'İtiraz: soru iddianamenin kapsamı dışında', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred'), dec('pers')],
          bad: 'Savcı CMK 201/1 uyarınca tanığa soru yöneltebilir; “iddianamede yok” bir itiraz dayanağı değildir.',
          category: 'USUL_BILGISI',
          responses: B(`
rahmi: Savcı tanığa soru yöneltebilir müdafi. İtiraz reddedildi.
nermin: Galiba… Bu.
`),
        }),
      ],
    }),
    story('H1_04B', {
      ...H1,
      title: 'Kısa ara',
      background: 'adliye',
      hud: ['cred', 'pers'],
      lines: [
        W(
          any(flag('contra_n3'), flag('contra_n5')),
          `
rahmi: Ara karar için on beş dakika ara.
# ADLİYE KORİDORU · KISA ARA [bg:adliye]
> Koridorda Nermin Hanım’ın kızı önümü kesti. Otuzlarında, annesinin gözleri, annesinin dik duruşu. Elinde annesinin hırkası.
@NERMİN HANIM’IN KIZI: Annemi yalancı çıkardınız. Altmış yaşında bir kadını. Kürsüde.
- Anneniz yalan söylemedi. Bunu salonda da söyledim, burada da söylüyorum.
@NERMİN HANIM’IN KIZI: O zaman ne oldu? Annem gördüğünü söyledi. Siz de “görmedin” dediniz.
- Hayır. Annenize bir fotoğraf gösterdiler. O fotoğraf annenizin gördüğü yüzün üstüne yapıştı. Ben o fotoğrafı kaldırmaya çalışıyorum; annenizi değil.
> Kız bir şey söyleyecekti. Sustu. Annesinin hırkasını iki eliyle göğsüne bastırdı.
@NERMİN HANIM’IN KIZI: Annem üç aydır uyumuyor. Her gece merdiveni anlatıyor. Şimdi bir de bu. Hangi yüzü gördüğünü bilmiyormuş.
~ Bir hafızayı kurtarmak için o hafızayı yaraladım. Hukuk buna “çapraz sorgu” der. Bir kızın gözünde başka bir adı var.
> Koridorun ucunda Nermin Hanım bir bankta oturuyordu; tek başına, ellerini dizlerinin üstünde birleştirmiş. Bana bakmadı. Duvardaki bir şeye bakıyordu; duvarda hiçbir şey yoktu.
`,
        ),
        O(`
rahmi: Ara karar için on beş dakika ara.
# ADLİYE KORİDORU · KISA ARA [bg:adliye]
> Koridorda Nermin Hanım kızının koluna girmiş, çıkışa yürüyordu. Yanımdan geçerken durmadı. Kızı bana bir an baktı; zafer değildi, yorgunluktu.
> Derya pencerenin önünde bir sigara yaktı, görevli uyarınca söndürdü, bir tane daha yaktı.
derya: Bu kadar mı canım? Bir kadın “bu çocuk” dedi, bitti mi?
- Bitmedi. Ama bugün bir şey başlatamadım.
~ Leyla’nın sesi: “Kâğıtlarla göster.” Kâğıtlarım eksikti. Ya da onları doğru yerde açmadım.
`),
      ],
      choices: [cont('H104B_DEVAM', 'Salona dön', 'H1_05', { role: 'PRIMARY' })],
    }),
    court1.objection('H1_05', {
      title: 'Ara karar',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      lines: [
        W(
          ref('tahliye_dayanak'),
          `
rahmi: Taraflara diyecekleri soruldu. Ara karar: HızlıPaket firmasından kayıtların ve sanığın telefonuna ilişkin inceleme raporunun istenmesine; teşhisi yapan kolluk görevlisi Ferhat Oral’ın tanık olarak çağrılmasına.
rahmi: Müdafi, tutukluluk hâline ilişkin diyeceğiniz?
~ Ferhat Oral kürsüye gelecek. Teşhisin kendisi sanık sandalyesine oturuyor.
`,
        ),
        O(`
rahmi: Taraflara diyecekleri soruldu. Ara karar: HızlıPaket firmasından kayıtların ve sanığın telefonuna ilişkin inceleme raporunun istenmesine; teşhisi yapan kolluk görevlisi Ferhat Oral’ın tanık olarak çağrılmasına.
rahmi: Müdafi, tutukluluk hâline ilişkin diyeceğiniz?
`),
      ],
      next: 'H1_06',
      options: [
        option('H105_A', 'Tahliye: teşhis sarsıldı, adli kontrol yeterli', {
          effects: [
            ifThen(
              ref('tahliye_dayanak'),
              [raise('released'), score('USUL_BILGISI', 100), inc('legal_hits'), inc('trust', 10)],
              [score('USUL_BILGISI', 20)],
            ),
          ],
          good: 'Kuvvetli suç şüphesini sarsan somut bulguya dayanarak tutukluluğun gözden geçirilmesini ve adli kontrolü istedin (CMK 100, 101, 108, 109).',
          category: 'USUL_BILGISI',
          responses: [
            W(
              all(flag('contra_n3'), flag('contra_n5')),
              `
- Sayın Başkan, mağdur bugün, karakoldaki teşhisten önce acil serviste kendisine telefondan tek bir fotoğraf gösterildiğini söyledi.
- Mağdurun kirlenmeden önceki ilk tarifi, 112 çağrısında, sol kulakta bir halkadan söz ediyor; sanığın kulakları delinmemiş.
- Kuvvetli suç şüphesi sarsılmıştır.
- Sanığın sabit adresi var, kaçma şüphesi yok. Adli kontrol yeterlidir.
> Heyet kısa bir müzakere için ayağa kalktı. Dört dakika. Sevim Hanım’ın tespihi bu dört dakikayı saydı.
rahmi: Sanığın imza yükümlülüğü ve yurt dışına çıkış yasağı şeklinde adli kontrol tedbiri uygulanarak tahliyesine; başka suçtan tutuklu değilse derhâl salıverilmesine.
> Barış başını iki elinin arasına aldı. Jandarma, kelepçeyi taşıdığı eli bir an havada tuttu; sonra cebine koydu.
`,
            ),
            W(
              flag('contra_n3'),
              `
- Sayın Başkan, mağdur bugün, karakoldaki teşhisten önce acil serviste kendisine telefondan tek bir fotoğraf gösterildiğini söyledi.
- Kuvvetli suç şüphesi sarsılmıştır.
- Sanığın sabit adresi var, kaçma şüphesi yok. Adli kontrol yeterlidir.
> Heyet kısa bir müzakere için ayağa kalktı. Dört dakika. Sevim Hanım’ın tespihi bu dört dakikayı saydı.
rahmi: Sanığın imza yükümlülüğü ve yurt dışına çıkış yasağı şeklinde adli kontrol tedbiri uygulanarak tahliyesine; başka suçtan tutuklu değilse derhâl salıverilmesine.
> Barış başını iki elinin arasına aldı. Jandarma, kelepçeyi taşıdığı eli bir an havada tuttu; sonra cebine koydu.
`,
            ),
            W(
              flag('contra_n5'),
              `
- Sayın Başkan, mağdurun kirlenmeden önceki ilk tarifi, 112 çağrısında, sol kulakta bir halkadan söz ediyor; sanığın kulakları delinmemiş.
- Kuvvetli suç şüphesi sarsılmıştır.
- Sanığın sabit adresi var, kaçma şüphesi yok. Adli kontrol yeterlidir.
> Heyet kısa bir müzakere için ayağa kalktı. Dört dakika. Sevim Hanım’ın tespihi bu dört dakikayı saydı.
rahmi: Sanığın imza yükümlülüğü ve yurt dışına çıkış yasağı şeklinde adli kontrol tedbiri uygulanarak tahliyesine; başka suçtan tutuklu değilse derhâl salıverilmesine.
> Barış başını iki elinin arasına aldı. Jandarma, kelepçeyi taşıdığı eli bir an havada tuttu; sonra cebine koydu.
`,
            ),
            W(
              ref('tahliye_dayanak'),
              `
- Sayın Başkan, bıçak ilk çağrıda yok; teşhisteki altı fotoğraftan yalnızca sanığınki renkli ve ötekilerden büyük.
- Kuvvetli suç şüphesi sarsılmıştır.
- Sanığın sabit adresi var, kaçma şüphesi yok. Adli kontrol yeterlidir.
> Heyet kısa bir müzakere için ayağa kalktı. Dört dakika. Sevim Hanım’ın tespihi bu dört dakikayı saydı.
rahmi: Sanığın imza yükümlülüğü ve yurt dışına çıkış yasağı şeklinde adli kontrol tedbiri uygulanarak tahliyesine; başka suçtan tutuklu değilse derhâl salıverilmesine.
> Barış başını iki elinin arasına aldı. Jandarma, kelepçeyi taşıdığı eli bir an havada tuttu; sonra cebine koydu.
`,
            ),
            O(`
- Sayın Başkan, sanığın tahliyesini ve adli kontrol uygulanmasını talep ediyoruz.
rahmi: Delillerin henüz toplanmamış olması, suçun niteliği ve mevcut delil durumu gözetilerek tutukluluk hâlinin devamına.
~ Henüz bir çatlak gösteremedim. Tutukluluk bir çatlakla sarsılır; bir dilekle değil.
`),
          ],
        }),
        option('H105_B', 'Tahliye: müvekkil masumdur', {
          score: { USUL_BILGISI: -20 },
          neutral: 'Tahliye talebi bir dayanak ister; “masumdur” demek talebin gerekçesi değildir.',
          responses: B(`
- Müvekkil masumdur Sayın Başkan, tahliyesini istiyoruz.
rahmi: Masumiyet karinesi zaten herkes için geçerli müdafi. Somut bir gerekçe göremedim. Tutukluluk hâlinin devamına.
`),
        }),
        option('H105_C', 'Talebimiz yok', {
          neutral: 'Tutukluluk hakkında bir talepte bulunmadın.',
          responses: B(`
- Bu aşamada bir talebimiz yok Sayın Başkan.
rahmi: Tutukluluk hâlinin devamına. Duruşma üç hafta sonraya ertelendi.
> Barış bana baktı. Neden bir şey söylemediğimi soran bir bakış.
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
          flag('released'),
          `
# ADLİYE KORİDORU · ÖĞLEDEN SONRA [bg:adliye]
> Barış adliyenin arka kapısından, bir zarfın içinde eşyalarıyla çıktı. Ayakkabılarının bağcıkları yoktu; cezaevinde alınmışlardı.
> Sevim Hanım ona koştu. Sarıldılar. Kimse bir şey söylemedi; Derya bile. Derya sigarasını yaktı ve yarısına kadar içmeden yere attı.
derya: Canım… sağ ol. Bitmedi biliyorum. Ama bugün… sağ ol.
baris: Abla… O kadın… Halka mı dedi? Kulağında halka mı vardı?
- Öyle dedi. O gece.
baris: Benim kulağım delik değil ki. Söyledim ya.
> Sevim Hanım oğlunun yüzünü iki eliyle tuttu. Bir şey sormadı; sormak için zamanı vardı artık.
~ Bugün bir kadının ilk sözleri kürsüye geri döndü. Yarın ne döneceğini bilmiyorum.
> Sevim Hanım oğlunun bağcıksız ayakkabılarına baktı. Çantasından iki bağcık çıkardı; evden getirmişti, “belki” diye. Diz çöktü, koridorun ortasında, bağladı.
sevim: Ben biliyordum kızım. Bağcık getirdim. Biliyordum.
~ Bir anne bir bağcık getirmişti. Bir umut değil; bir hazırlık. Annelerin hukuku böyledir.
`,
        ),
        W(
          flag('koridor_umut'),
          `
# ADLİYE ARKA KAPISI · RİNG ARACI [bg:adliye]
> Ring aracının camı buğuluydu. Barış elini cama koydu. Sevim Hanım dışarıdan elini onun elinin üstüne koydu.
sevim/uzgun: Akşam gelir dedin kızım. Akşam gelir dedin.
> Söylemiştim. Araç hareket etti. Sevim Hanım birkaç adım yürüdü, sonra durdu. Derya annesinin koluna girdi ve bana bakmadı.
~ Umut vermek ucuzdur. Ödemesini başkası yapar. Bugün o başkası bir anneydi.
`,
        ),
        O(`
# ADLİYE ARKA KAPISI · RİNG ARACI [bg:adliye]
> Ring aracının camı buğuluydu. Barış elini cama koydu. Sevim Hanım dışarıdan elini onun elinin üstüne koydu.
derya: Üç hafta. Üç hafta daha. Ne yapacaksın canım?
- Kayıtlar gelecek. Kâğıtlar konuşacak.
~ Bunu söylerken sesim benimkinden daha emin çıktı. Avukatlıkta buna “mesleki ses” denir. Ben ona “yalan değil ama” derim.
> Sevim Hanım’ın elinde, evden getirdiği iki ayakkabı bağcığı vardı. Ring aracı köşeyi dönünce onları çantasına geri koydu; dikkatle, katlayarak.
~ Bir anne bağcık getirmişti, “belki” diye. Bugün “belki” olmadı. Bağcıklar çantada bekleyecek.
`),
      ],
      choices: [cont('H106_DEVAM', 'Üç hafta', 'ARA_GIRIS_1', { role: 'PRIMARY' })],
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
