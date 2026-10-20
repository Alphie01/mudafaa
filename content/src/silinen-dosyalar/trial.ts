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
  resultNode,
  score,
  set,
  statement,
  story,
  strategyAmount,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, Cond } from '../../../tools/content/src/kit/index.js';
import { B, O, T, W } from './dsl.js';
import { H2, court2, wrongMove } from './shared.js';

// 80-trial: 2. celse. Koridor, açılış (yeni gelişme / etik ihlali), bilirkişi raporunun tartışılması, Tarık Sezer’in
// tanıklığı (T1–T5), Yaşar/Nalan, katılan vekilinin sorusu, mütalaa, dayanaklar, esas savunma, son söz, hüküm.

const dayanak = (id: string, label: string, backed: Cond, argFlag: string, line: string) =>
  option(id, label, {
    cost: [{ var: 'noktalar', amount: 1 }],
    maxUses: 1,
    effects: [
      ifThen(backed, [raise(argFlag), score('SAVUNMA_STRATEJISI', 60), inc('pers')], [score('SAVUNMA_STRATEJISI', -40), dec('pers')]),
    ],
    responses: [
      W(backed, line),
      O(`
~ Bunu söylemek istedim; ama elimde onu taşıyacak bir kâğıt yoktu. Hâkim bunu benden önce gördü.
kemal: Müdafi, bu dayanağı dosyada hangi delil destekliyor?
`),
    ],
    next: '$stay',
  });

export const trial: CasePart = {
  predicates: [
    {
      id: 'imaj_coktu',
      label: 'DataKale imajının güvenilmez olduğu gösterildi',
      when: any(flag('contra_b2'), flag('contra_b3'), has('ded_zincir'), has('ded_ozet'), flag('sema_dinlendi')),
    },
    {
      id: 'baskasi_kanit',
      label: 'Silmeyi başka birinin yaptığına dair somut delil',
      when: any(has('ded_gm_cihaz'), has('ded_gm_hat'), flag('contra_t_cihaz'), flag('contra_t_hat')),
    },
    {
      id: 'riza_kanit',
      label: '21.30 girişinin izinli olduğu gösterildi',
      when: any(has('ded_riza'), flag('h1_riza'), flag('contra_t_izin')),
    },
    {
      id: 'mutalaa_beraat_b',
      label: 'Savcı gerçek faili işaret edecek kadar güçlü dosya',
      when: all(flag('bildirdi'), any(has('ded_gm_cihaz'), has('ded_gm_hat')), cmp(v('pers'), '>=', 7)),
    },
    {
      id: 'mutalaa_beraat_e',
      label: 'Savcı şüpheden beraat isteyecek',
      when: all(any(flag('contra_b2'), flag('contra_b3'), flag('sema_dinlendi')), cmp(v('pers'), '>=', 5)),
    },
  ],
  court: {
    sessions: [
      courtSession('cs_2', '2. Celse', [
        ['s2_acilis', 'ACILIS', 'T_00'],
        ['s2_delil', 'DELIL_TARTISMA', 'T_01'],
        ['s2_tanik', 'TANIK_DINLEME', 'T_02'],
        ['s2_mutalaa', 'MUTALAA', 'T_05'],
        ['s2_savunma', 'SAVUNMA', 'T_06P'],
        ['s2_son_soz', 'SON_SOZ', 'T_07'],
        ['s2_karar', 'KARAR', 'T_08'],
      ]),
    ],
  },
  nodes: [
    decisionNode('T_00G_1', [{ to: 'T_00G_2' }], {
      ...H2,
      title: 'Koridor',
      onEnter: [raise('in_court')],
      lines: B(`
# ÜÇ HAFTA SONRA · 30 OCAK 09.15 — BURSA ADLİYESİ [bg:adliye]
> Koridor aynıydı; insanlar aynı yorgunlukla farklıydı. Aynı banklar, aynı sigara kokusu, bir başka ağlayan çocuk.
> Pencerenin önünde Bülent Arıkan değil; bu kez bir kadın bekliyordu: iş tulumu değil, ütülü bir ceket. Dr. Sema Uçar, mahkemenin bilirkişisi. Elinde ciltli bir rapor.
`),
    }),
    decisionNode('T_00G_2', [{ to: 'T_00' }], {
      lines: [
        W(
          all(flag('bildirdi'), flag('fact_gm')),
          `
> Selim ailesiyle geldi; takım elbise, yine kravatsız. Gül’ün elinde Defne’nin bir resmi daha.
> Koridorun ucunda Tarık Sezer, Ozan Tekin’le başı önde konuşuyordu. İkisinin de yüzü gergindi; savcılığın soruşturması onlara da ulaşmıştı.
selim: Avukat hanım… Savcı beni bu sabah tanık değil, “mağdur” diye çağırdı koridorda. Ne oldu?
- Dosyaya bir şey eklendi. Dinleyin, göreceksiniz.
`,
        ),
        W(
          flag('tarik_yuzles'),
          `
> Tarık Sezer koridorda bana doğru yürüdü; gülümsüyordu, ama gözleri gülmüyordu.
tarik: Evladım, geçen gün ziyaretiniz güzeldi. Ama o dizüstü… ne yazık ki çalındı. Hırsızlık her yerde.
~ Uyardığım adam. Cihaz “çalındı.” Elimde bir zimmet kaldı, cihaz yok. Kendi hatam; bir sahne için bir sonucu riske attım.
`,
        ),
        O(`
> Selim ailesiyle geldi. Gül bankta oturdu; Defne’nin resmini açıp katladı, açıp katladı.
> Dr. Sema Uçar raporunu dizine koydu, gözlüğünü taktı, bir şey okudu. Tarafsız bir göz; bu dosyada ilk kez.
`),
      ],
    }),
    court2.stage('T_00', {
      title: 'Duruşma · 2. Celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onFirstEnter: [meet('sema')],
      lines: [
        W(
          flag('selim_giris'),
          `
cevdet: Selim Aktaş dosyası! Hı-hım.
# BURSA 9. ASLİYE CEZA MAHKEMESİ — 2. CELSE [bg:durusma_salonu]
kemal: Duruşmaya devam olundu. Söz almadan önce: müdafiin dosyaya sunduğu “sistem kayıtları” hakkında katılan vekilinin bir iddiası var.
ozan: Sayın Hâkim, müdafiin sunduğu kayıtlar, sanığın bu hafta şirketin sistemine yeniden izinsiz girerek indirdiği verilerdir. Bu, hem yeni bir suç hem de hukuka aykırı delildir.
> Salon buz kesti. Elimdeki dosya birden ağırlaştı. Selim’e bakmadım; bakamadım.
`,
        ),
        W(
          flag('bildirdi'),
          `
cevdet: Selim Aktaş dosyası! Hı-hım.
# BURSA 9. ASLİYE CEZA MAHKEMESİ — 2. CELSE [bg:durusma_salonu]
kemal: Duruşmaya devam olundu. Celse arasında bir gelişme oldu; Cumhuriyet savcısı söz istedi.
ferda: Sayın Hâkim, müdafiin suç duyurusu üzerine Başsavcılığımızca bir soruşturma başlatıldı.
ferda: Bilirkişi raporu, kart kayıtları ve operatör cevabı birlikte değerlendirildiğinde, silme oturumunun sanığa ait olmayan bir cihaz ve hattan açıldığı görülmektedir.
ferda: Bu soruşturma bu dosyayla da ilgilidir. Beyanlarımı mütalaada sunacağım.
> Salonun arkasında Tarık Sezer dik oturdu; ama eli, ceketinin iç cebine gitti ve orada kaldı.
~ İlk kez savcı benden önce konuştu ve benim söyleyeceğimi söyledi. Bu, üç haftalık bir dilekçenin sesi.
`,
        ),
        W(
          flag('tarik_yuzles'),
          `
cevdet: Selim Aktaş dosyası! Hı-hım.
# BURSA 9. ASLİYE CEZA MAHKEMESİ — 2. CELSE [bg:durusma_salonu]
kemal: Duruşmaya devam olundu. Bilirkişi raporu geldi. Ayrıca katılan şirket, bir dizüstü bilgisayarının çalındığına dair şikâyette bulunmuş; dosyaya eklendi.
~ Çalınan dizüstü. NOS-GM-LT. Uyardığım adam, en güçlü delilimi bir hırsızlık dosyasına çevirdi.
`,
        ),
        O(`
cevdet: Selim Aktaş dosyası! Hı-hım.
# BURSA 9. ASLİYE CEZA MAHKEMESİ — 2. CELSE [bg:durusma_salonu]
kemal: Duruşmaya devam olundu. Ara karar gereği bilirkişi raporu geldi; orijinal disklerden inceleme yapıldı. Bilirkişi Dr. Sema Uçar hazır.
> Dr. Sema Uçar raporunu önüne koydu. Ozan Tekin arkasına yaslandı; ama rahat değildi. Tarık Sezer gazetesini bu kez hiç çıkarmadı.
~ İkinci celse. İlkinde bir uzmanın kibrini çatlattık. Bugün bir mühendisin tarafsızlığıyla başlıyoruz.
`),
      ],
      choices: [
        cont('T00_ETIK', 'Devam', 'T_ETIK', { role: 'PRIMARY', visibleWhen: flag('selim_giris') }),
        cont('T00_DEVAM', 'Bilirkişi raporu', 'T_01', { role: 'PRIMARY', visibleWhen: not(flag('selim_giris')) }),
      ],
    }),
    story('T_ETIK', {
      ...H2,
      title: 'Hukuka aykırı delil',
      background: 'durusma_salonu',
      hud: ['cred', 'pers'],
      lines: B(`
kemal: Müdafi, bu konuda diyeceğiniz?
- Sayın Hâkim… Kayıtlar gerçeği gösteriyordu. Müvekkilim yalnızca doğruyu ortaya çıkarmak için…
kemal: Gerçeği ortaya çıkarmak için bir sistemi silmekle suçlanan kişiye, aynı sisteme yeniden girdirdiniz. Bu dosyanın başladığı yere döndünüz.
kemal: Bu yolla elde edilen hiçbir kayıt hükme esas alınamaz. Ayrıca durumun Cumhuriyet Başsavcılığına ve Bursa Barosuna bildirilmesine. On beş dakika ara.
> Koridorda Gül önümü kesti; Selim arkasında, başı önde.
gul: Siz ne yaptırdınız ona? O zaten “sisteme girdi” diye yargılanıyordu. Siz bir kere daha mı girdirdiniz?
> Selim bir şey söylemedi. Elinde noterden bir kâğıt vardı; bu sabah hazırlanmış. Azilname.
selim: Üzgünüm avukat hanım. Gül haklı. Başka bir avukat bulacağız.
~ Bir müvekkili suçtan korumak için buradaydım. Onu yeni bir suça ben soktum. Daha iyi bir niyetle; ama niyet, bir kaydı da bir avukatı da temizlemez.
`),
      choices: [cont('TETIK_DEVAM', 'Kapı', 'R_KARAR', { role: 'PRIMARY' })],
    }),
    choiceNode('T_01', {
      ...H2,
      title: 'Bilirkişi raporunun tartışılması',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: [
        W(
          any(has('ev_sema'), flag('bilirkisi_atandi')),
          `
kemal: Bilirkişi raporu okundu. Orijinal diskten alınan imaj, DataKale raporundaki bazı bulguların kurtarma yazılımının izi olduğunu tespit etmiş.
kemal: Rapora göre silme oturumunun cihaz adı da sanığın cihazı değil. Müdafi, diyeceğiniz?
> Dr. Sema Uçar salonun önündeki sandalyede oturuyordu; dizinde bir dosya, elinde bir kalem. Çağrılmadıkça konuşmayacak bir sabırla.
> Ozan Tekin bilirkişi raporunu sayfa sayfa çeviriyordu; her sayfada biraz daha yavaş.
~ Tarafsız bir rapor. Elimdeki en sağlam kâğıt. Şimdi onu doğru kullanmam lazım.
~ İyi bir raporu abartmak, onu zayıflatmanın en kısa yoludur. Raporun söylediğini söyleyeceğim; söylemediğini değil.
`,
        ),
        O(`
kemal: Ara kararda istenen bilgiler kısmen geldi. DataKale raporu dosyada; hükümle birlikte takdir edilecek. Müdafi, diyeceğiniz?
~ Bilirkişi isteyemedim. Elimde yalnızca kendi bulduğum çatlaklar var. Onlarla gideceğim.
`),
      ],
      choices: [
        option('T01_SEMA', 'Bilirkişinin dinlenmesini ve raporun esas alınmasını iste', {
          visibleWhen: any(has('ev_sema'), flag('bilirkisi_atandi')),
          score: { USUL_BILGISI: 80 },
          effects: [raise('sema_dinlendi'), inc('legal_hits'), inc('pers')],
          good: 'Mahkemenin atadığı bilirkişinin raporu, şikâyetçinin uzman mütalaasının önüne geçer (CMK 63, 67); bulgu ile kanaat ayrımını kürsüde kurdurmak lehe.',
          category: 'USUL_BILGISI',
          responses: B(`
- Sayın Hâkim, bilirkişinin duruşmada dinlenmesini ve DataKale raporu yerine bilirkişi raporunun esas alınmasını talep ediyoruz.
> Dr. Sema Uçar kürsüye geldi. Yemin etti; sakin, net.
sema: İki tespitim var. Birincisi: DataKale imajı, olaydan iki gün sonra, üzerinde kurtarma yazılımı çalıştırılmış bir diskten alınmış. O imajdaki bazı “silme izleri” kurtarma yazılımının kendi kayıtları.
sema: İkincisi: orijinal diskte silme oturumunun cihaz adı okunuyor. Bu ad, sanığın el konulan bilgisayarının adı değil.
kemal: Tutanağa geçsin.
`),
        }),
        option('T01_IMAJ', 'DataKale imajının hükme esas alınamayacağını savun', {
          visibleWhen: any(has('ded_zincir'), has('ded_ozet'), flag('contra_b2'), flag('contra_b3')),
          score: { USUL_BILGISI: 60 },
          effects: [raise('imaj_itiraz'), inc('pers')],
          good: 'Elde etme zinciri ve bütünlüğü kanıtlanamayan imajın değeri yoktur (CMK 134, 217); ilk celsede çatlaklar zaten tutanağa geçti.',
          category: 'USUL_BILGISI',
          responses: B(`
- Sayın Hâkim, DataKale imajı iki gün kurcalanmış bir diskten alınmıştır; iki özet değeri birbirini tutmamaktadır. Bütünlüğü kanıtlanamayan bir imaj, hükme esas alınamaz.
kemal: İlk celsede bu hususlar tutanağa geçmişti. Not edildi.
`),
        }),
        option('T01_KABUL', 'Rapora bir diyeceğimiz yok', {
          effects: [dec('pers')],
          neutral: 'Bilirkişinin lehe bulgularını kürsüde kurdurmadın; rapor dosyada kaldı ama vurgulanmadı.',
          responses: B(`
- Rapora bir diyeceğimiz yok Sayın Hâkim.
kemal: Peki. Tanığı dinleyelim.
~ Elimdeki en iyi kâğıdı masada bıraktım. Bazen susmak da bir hatadır.
`),
        }),
        cont('T01_BITIR', 'Tanığa geç', 'T_02', { role: 'PRIMARY' }),
      ],
    }),
    court2.testimony('T_02', {
      title: 'Tarık Sezer’in dinlenmesi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'tarik',
      witnessLabel: 'TANIK · TARIK SEZER',
      rulesText: 'İpucu: önce bastır, sonra doğru delille göster. Yanlış delil güvenilirliği ve skoru düşürür.',
      objectionGrounds: ['g_telkin', 'g_kanaat', 'g_ilgisiz'],
      say: T(`
cevdet: Tanık Tarık Sezeeer! Hı-hım.
> Tarık Sezer kürsüye geldi. Takım elbisesi kusursuzdu; sesi de. Yemin ederken eli hiç titremedi.
tarik: Sayın Hâkim, ben otuz yıldır bu şirketi yönetiyorum. Üç yüz işçinin ekmeği bana emanet. Selim’i de ben işe aldım; oğlum gibiydi. Bu yüzden bu olay beni en çok üzen şey oldu.
kemal: Müdafi, sorularınız.
~ Sıcak, ölçülü, hazırlıklı. Her cümlesini bir iyilikle bitiriyor. Önce konuşsun; sonra kâğıtları açarım. İsmini ben söylemeyeceğim; kayıtlar söyleyecek.
> Dinleyici sırasında Selim öne eğilmiş, elleri kenetli. Gül onun koluna dokundu; bırak, der gibi.
`),
      statements: [
        statement('T1', 1, [
          'O gece ',
          hl('evimdeydim', any(flag('press_t1'), has('clue_hat_gm'), has('clue_turnike_gm'))),
          '; teknik işlerden de hiç anlamam.',
        ]),
        statement('T2', 2, [
          'Şifreleri ben almadım; ',
          hl('o işler Bülent’teydi', any(flag('press_t2'), has('ev_devir'), has('ded_sifre'))),
          '.',
        ]),
        statement('T3', 3, [
          'Yedek sistemi ',
          hl('aylardır arızalıydı', any(flag('press_t3'), has('clue_son_yedek'), has('ded_yedek'))),
          '; Selim ilgilenmemişti.',
        ]),
        statement('T4', 4, [
          'Sigortamız ',
          hl('yıllardır aynı', any(flag('press_t4'), has('clue_limit'), has('ded_motif'))),
          '; bu olayla bir ilgisi yok.',
        ]),
        statement(
          'T5',
          5,
          ['O silme oturumu sanığın hesabından yapıldı; ', hl('başka bir cihaz söz konusu değil', any(has('clue_cihaz_adi'), has('clue_sema_cihaz'), has('clue_zimmet'))), '.'],
          flag('press_t1'),
        ),
      ],
      rules: [
        pressRule('PR_T1', 'T1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_t1')],
          responses: B(`
- Evinizde derken? Görükle’deki eviniz mi?
tarik: Evet, Görükle. Erken yattım; ertesi gün golf vardı.
- Telefonunuz yanınızda mıydı?
tarik: Olur tabii. Herkesin telefonu yanındadır. Ne demek istiyorsunuz evladım?
~ Yeni bir cümle: “Görükle.” Operatör kaydındaki baz istasyonu da Görükle. Bir not daha.
`),
        }),
        pressRule('PR_T2', 'T2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_t2')],
          responses: B(`
- Selim size bir zarf teslim etmedi mi? Şifreler için?
tarik: Zarf mı? Hatırlamıyorum. Bir sürü kâğıt imzalarım ben. Devir işlemleri İK’nındır.
~ “Hatırlamıyorum.” Bir tutanağın altında imzası olan bir adam için ilginç bir hafıza.
`),
        }),
        pressRule('PR_T3', 'T3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_t3')],
          responses: B(`
- Yedek aylardır arızalıysa, 30 Eylül devir tutanağına neden “son yedek başarılı” yazdınız?
tarik: Yazmışsam… bilmem. Teknik detay. Belki o gün çalıştı, sonra bozuldu.
~ “Belki o gün çalıştı.” Aylardır arızalı bir cihaz, bir günlüğüne iyileşmiş. Mucize ya da yanlış bir cümle.
`),
        }),
        pressRule('PR_T4', 'T4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_t4')],
          responses: B(`
- Sigortanız yıllardır aynıysa, ağustosta neden zeyilname imzaladınız?
tarik: Her şirket poliçesini günceller. Rutin bir işlem. Mali işler yürütür.
- Limiti on katına çıkarmak rutin mi?
tarik: Enflasyon var evladım. Her şey on katına çıktı.
~ Enflasyon. Bir teminat cümlesini de enflasyon mu ekletti acaba?
`),
        }),
        presentRule('PS_T_HAT', 'T1', ['ev_operator', 'ded_gm_hat'], {
          enabledWhen: any(has('clue_hat_gm'), has('ded_gm_hat')),
          visibleWhen: any(has('clue_hat_gm'), has('ded_gm_hat')),
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_t_hat'), { type: 'GOTO', node: 'T_02K' }],
          good: 'Silme oturumunun geldiği GSM hattı genel müdüre tahsisli; bağlantı Görükle’den. Tanığın “evimdeydim” beyanı aleyhine döndü.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Hâkim, operatörün cevabı: 18 Ekim 02.14’teki silme oturumu, katılan şirketin kurumsal bir hattından açılmış. O hat tanığa, genel müdüre tahsisli. Bağlantı noktası: Görükle.
- Bay Sezer, az önce o gece Görükle’de, evinizde olduğunuzu söylediniz. Silme de Görükle’den, sizin hattınızdan yapılmış.
`),
        }),
        presentRule('PS_T_CIHAZ', 'T5', ['ev_turnike', 'ded_gm_cihaz'], {
          enabledWhen: any(has('clue_zimmet'), has('ded_gm_cihaz')),
          visibleWhen: any(has('clue_zimmet'), has('ded_gm_cihaz')),
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_t_cihaz'), { type: 'GOTO', node: 'T_02K' }],
          good: 'Silme oturumunun cihazı NOS-GM-LT, demirbaş listesinde genel müdürün zimmetinde. “Başka cihaz söz konusu değil” beyanı çürütüldü.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Hâkim, silme oturumunu açan cihazın adı NOS-GM-LT. Şirketin kendi demirbaş zimmet listesine göre bu cihaz tanığın, genel müdürün zimmetinde.
- Bay Sezer, “başka bir cihaz söz konusu değil” dediniz. Söz konusu olan cihaz sizin bilgisayarınız.
`),
        }),
        presentRule('PS_T_ODA', 'T1', ['ev_turnike', 'ded_gm_oda'], {
          enabledWhen: any(has('clue_turnike_gm'), has('ded_gm_oda')),
          visibleWhen: any(has('clue_turnike_gm'), has('ded_gm_oda')),
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_t_oda')],
          good: 'Kart kaydı: cuma 23.11’de sunucu odasına genel müdürün kartıyla girilmiş; yedek o gece o odada devre dışı bırakıldı.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Hâkim, kart geçiş kaydı: 17 Ekim 23.11’de sunucu odasına girilmiş. Kart: Tarık Sezer. Yedek cihazının kablosu o gece elle çekilmiş; bunun için o odada bulunmak gerekir.
tarik: Kendi şirketimin odasına girmişim; suç mu bu? Evrak almaya gittim.
- Gece on birde, evrak için, sunucu odasına?
`),
        }),
        presentRule('PS_T_MOTIF', 'T4', ['ev_zeyil', 'ded_motif'], {
          enabledWhen: any(has('clue_limit'), has('clue_teminat'), has('ded_motif')),
          visibleWhen: any(has('clue_limit'), has('clue_teminat'), has('ded_motif')),
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_t_motif')],
          good: 'Zeyilname: olaydan iki buçuk ay önce limit on katına çıkarılmış ve “çalışan kötü niyeti” teminatı eklenmiş; saik ortaya kondu.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Hâkim, 3 Ağustos tarihli zeyilname: teminat limiti iki milyondan yirmi milyona çıkarılmış; aynı gün poliçeye “eski ya da mevcut çalışanın kasıtlı eylemleri” teminatı eklenmiş. Zarar beyanınız da tam yirmi milyon.
tarik: Bu bir tesadüf. İftira ediyorsunuz. Avukatım…
kemal: Tanık, yalnızca soruya cevap verin.
`),
        }),
        presentRule('PS_T_IZIN', 'T2', ['ev_eposta', 'ded_riza'], {
          enabledWhen: any(has('ev_eposta'), has('ded_riza'), has('clue_hesap_acik')),
          visibleWhen: any(has('ev_eposta'), has('ded_riza'), has('clue_hesap_acik')),
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_t_izin')],
          good: 'Hesabı açık bırakan ve kişisel dosyalar için izin veren bizzat genel müdür: 21.30 girişi rızaya dayanıyor (TCK 243/1 unsuru yok).',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Hâkim, 30 Eylül tarihli e-posta ve devir tutanağının altıncı maddesi: hesabı “kişisel dosyalar için 31 Ekim’e kadar açık” bırakan, tanığın kendisi. Parafı var.
- Bay Sezer, Selim’in 21.30’da kendi klasörüne erişmesine siz izin verdiniz. Bu giriş izinliydi.
tarik: Ben iyilik yaptım. İyiliğim başıma kaldı.
`),
        }),
        objectRule('OB_T5', 'T5', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [inc('pers'), inc('legal_hits')],
          good: 'İtiraz yerinde: “başka cihaz söz konusu değil” tanığın değerlendirmesidir, teknik bir bulgu değil; bunu bilirkişi söyler.',
          category: 'SORGULAMA',
          responses: B(`
- İtiraz ediyorum Sayın Hâkim. Hangi cihazın söz konusu olduğu teknik bir tespittir; tanığın kanaati değil. Bunu bilirkişi söyler.
kemal: Yerinde. Tanık, teknik değerlendirme yapmayın; gördüklerinizi anlatın.
`),
        }),
        presentRule('PS_SAVCILIK_T', undefined, ['ev_sikayet', 'ev_log_ozet', 'ev_imaj_rapor', 'ev_zarar'], {
          maxUses: 10,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'İddianın ya da katılanın kâğıdını katılanın tanığına gösterdin; çelişki doğmadı. −1 güvenilirlik, −150 skor.',
          category: 'SORGULAMA',
          responses: B(`
ozan: Sayın Hâkim, müdafi bizim delilimizi bizim tanığımıza okuyor.
~ Kendi kalemime kendim mürekkep döktüm.
`),
        }),
      ],
      presentMiss: fallback('FB_T_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil: −1 güvenilirlik, −150 skor.', category: 'SORGULAMA' },
        responses: B(`
kemal: Bu delilin beyanla ilgisini göremedim müdafi.
~ Yanlış kapıya vurdum. Ses salonda yankılandı.
`),
      }),
      objectMiss: fallback('FB_T_OBJECT', 'OBJECT', {
        effects: [dec('cred'), inc('wrong'), score('SORGULAMA', -50, 'hatali')],
        quality: { q: 'BAD', feedback: 'Dayanaksız itiraz.', category: 'SORGULAMA' },
        responses: B(`
kemal: İtiraz reddedildi. Dayanağı yok.
`),
      }),
      finish: { id: 'T02_BITIR', next: 'T_03_G' },
    }),
    court2.stage('T_02K', {
      title: 'Çekinme',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'tarik',
      onEnter: [raise('tarik_coktu')],
      lines: B(`
> Salon sustu. Tarık Sezer bir an bana baktı; gülümsemeye çalıştı, beceremedi. Eli yeniden ceketinin iç cebine gitti; orada bir şey vardı, bir kâğıt, hep oradaydı.
tarik: Ben… Sayın Hâkim, ben bu teknik şeyleri bilmem. Bir yanlışlık var. Bir hesap, bir cihaz, bir hat…
> Kemal Oran gözlüğünün üstünden baktı. Sakin, ama artık başka bir sakinlik.
kemal: Tanık Sezer, size bir hatırlatma yapmam gerekiyor. Kendinizi ya da kanunda sayılan yakınlarınızı ceza kovuşturmasına maruz bırakabilecek sorulara cevap vermekten çekinebilirsiniz.
> Tarık Sezer uzun süre konuştu, aslında hiçbir şey söylemedi. Sonra oturduğu yerde dikleşti; ceketinin iç cebindeki kâğıdı bırakmadan.
tarik: O hâlde… avukatımla görüşmeden bu sorulara cevap vermeyeceğim.
> Ozan Tekin ayağa kalktı, bir şey söyleyecekti, oturdu. Dinleyici sırasında Selim başını kaldırdı; ilk kez, doğrudan Tarık Sezer’e baktı. Tarık Sezer o bakışı karşılamadı.
kemal: Tutanağa geçsin: tanık, bu aşamadan sonra cevap vermekten çekinmiştir.
~ Bir adamı yenmedim. Kendi hattını, kendi cihazını, kendi kartını önüne koydum. Gerisini sessizliği söyledi; sessizlik, bu salonda en yüksek ses.
`),
      choices: [cont('T02K_DEVAM', 'Devam', 'T_03_G', { role: 'PRIMARY' })],
    }),
    decisionNode('T_03_G', [
      { when: flag('yasar_hazir'), to: 'T_03' },
      { when: flag('nalan_tanik'), to: 'T_04' },
      { to: 'T_05' },
    ]),
    court2.testimony('T_03', {
      title: 'Yaşar Kılıç’ın dinlenmesi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'yasar',
      witnessLabel: 'TANIK · YAŞAR KILIÇ',
      rulesText: 'İpucu: önce bastır, sonra doğru delille göster.',
      objectionGrounds: ['g_telkin', 'g_kanaat'],
      say: T(`
cevdet: Tanık Yaşar Kılıııç! Hı-hım.
> Yaşar Usta kürsüye geldi; ceketini giymiş, kravat takmış, saçını ıslatıp taramıştı. Elinde kurşun kalemle yazılmış defteri. Yemin ederken sesi titredi; sözleri titremedi.
yasar: Ben kapıdayım Sayın Hâkim. Otuz yıl. Ne gördüysem deftere yazdım. Defter benim namusum.
kemal: Müdafi, sorularınız.
~ Bir bekçi, bir defter, bir namus. Kürsüde bundan sağlam bir şey az bulunur.
`),
      statements: [
        statement('Y1', 1, ['Cuma gecesi kapıya ', hl('genel müdürün arabası geldi', any(flag('press_y1'), has('clue_defter'))), '.']),
        statement('Y2', 2, ['“', hl('Evrak unuttum', any(flag('press_y2'), has('clue_yasar'))), '” dedi, içeri girdi.']),
        statement('Y3', 3, ['Yarım saat sonra çıktı; ', hl('elinde bir şey yoktu', flag('press_y2')), ' ama ben cebine bakmadım.']),
      ],
      rules: [
        pressRule('PR_Y1', 'Y1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_y1')],
          responses: B(`
- Saat kaçtı, defterinizde yazıyor mu?
yasar: Yazıyor. 23.05 giriş, 23.34 çıkış. Ben saati sonra uydurmam; o an yazarım. Kurşun kalemle.
`),
        }),
        pressRule('PR_Y2', 'Y2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_y2')],
          responses: B(`
- “Evrak unuttum” diyen kişinin sesini tanıdınız mı?
yasar: Tanıdım. Genel müdür Tarık Bey. Yirmi yıldır her sabah “Günaydın Yaşar” der; sesini bilmez miyim? Ama yüzünü görmedim; karanlıktı, camı yarım indirdi.
~ Sesi tanıdı; yüzü değil. Dürüst tanık, gördüğüyle duyduğunu ayırır. Savcı bunu zorlayamaz.
`),
        }),
        presentRule('PS_Y_DEFTER', 'Y1', ['ev_turnike'], {
          enabledWhen: has('clue_turnike_gm'),
          visibleWhen: has('clue_turnike_gm'),
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_y1')],
          good: 'Bekçi defteri ile kart kaydı aynı saati gösteriyor: 23.05 kapı, 23.11 sunucu odası. İki bağımsız kayıt birbirini doğruluyor.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Hâkim, Yaşar Usta’nın defteri 23.05 kapı girişini gösteriyor. Kart kaydı da 23.11’de sunucu odası girişini: aynı gece, aynı kişi, altı dakika arayla. Bir kalem, bir makine; aynı şeyi söylüyor.
kemal: Tutanağa geçsin.
`),
        }),
      ],
      presentMiss: fallback('FB_Y_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil.', category: 'SORGULAMA' },
        responses: B(`
kemal: Bu delilin beyanla ilgisini göremedim müdafi.
`),
      }),
      objectMiss: fallback('FB_Y_OBJECT', 'OBJECT', {
        effects: [dec('cred'), inc('wrong'), score('SORGULAMA', -50, 'hatali')],
        quality: { q: 'BAD', feedback: 'Dayanaksız itiraz.', category: 'SORGULAMA' },
        responses: B(`kemal: İtiraz reddedildi.`),
      }),
      finish: { id: 'T03_BITIR', next: 'T_03X' },
    }),
    court2.objection('T_03X', {
      title: 'Katılan vekilinin sorusu',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'yasar',
      say: T(`
ozan: Bir sorum var. Yaşar Bey, siz sanık Selim Aktaş’ın arkadaşısınız, değil mi? Size simit getirirdi. Onun için buradasınız; genel müdürü karalamak için uyduruyorsunuz, öyle değil mi?
~ Yönlendirici bir soru. Tanığın cevabını sorunun içine koymuş. İtiraz edebilirim.
`),
      next: 'T_04C_G',
      options: [
        option('X_ITIRAZ', 'İtiraz: soru yönlendirici ve tanığın beyanını baskılıyor', {
          score: { USUL_BILGISI: 80 },
          effects: [inc('legal_hits'), inc('pers')],
          good: 'Cevabı içine yerleştiren, tanığı suçlayarak baskılayan soru yönlendiricidir (CMK 201/1).',
          category: 'USUL_BILGISI',
          responses: B(`
- İtiraz ediyorum Sayın Hâkim. Soru yönlendirici; tanığa cevabını dayatıyor ve onu suçluyor.
kemal: Kabul. Vekil bey, tanığa görüşünü değil, bildiğini sorun.
yasar: İzninizle cevap vereyim Sayın Hâkim. Ben simidi herkese getiririm; müdüre de getirdim. Ben kimsenin arkadaşı değilim; kapının bekçisiyim. Defter ne diyorsa o.
`),
        }),
        option('X_CEVAP', 'İtiraz etme; tanık cevap versin', {
          neutral: 'Yönlendirici soruya izin verdin; tanık güçlü çıktı ama soru da tutanakta kaldı.',
          responses: B(`
yasar/kizgin: Arkadaşı değilim. Ben simidi müdüre de getirdim, size de getiririm. Namusum defterimdedir; arkadaşlık değil.
> Yaşar Usta’nın sesi yükseldi. Ozan Tekin geri çekildi; bu kez o küçüldü.
`),
        }),
        option('X_KARSI', 'Karşı suçlama: vekil tanığı tehdit ediyor', {
          score: { USUL_BILGISI: -40 },
          effects: [dec('cred'), dec('pers')],
          bad: 'Karşı tarafın sorusuna yerinde itiraz yerine onu “tehditle” suçlamak dayanaksız kalır; hâkim reddeder.',
          category: 'USUL_BILGISI',
          responses: B(`
- Sayın Hâkim, vekil tanığı tehdit ediyor!
kemal: Soru yerinde değil müdafi, ama tehdit de yok. İkiniz de sakin olun.
`),
        }),
      ],
    }),
    decisionNode('T_04C_G', [{ when: flag('nalan_tanik'), to: 'T_04' }, { to: 'T_05' }]),
    court2.testimony('T_04', {
      title: 'Nalan Korkmaz’ın dinlenmesi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'nalan',
      witnessLabel: 'TANIK · NALAN KORKMAZ',
      rulesText: 'İpucu: önce bastır, sonra doğru delille göster.',
      objectionGrounds: ['g_kanaat'],
      say: T(`
cevdet: Tanık Nalan Korkmaaaz! Hı-hım.
> Nalan Korkmaz kürsüye geldi; elinde bir ajanda, ceketi ütülü. Genel müdür dinleyici sırasındaydı; ona bakmadı. Yemin etti, sesi düz.
nalan: Ben mali işler müdürüyüm Sayın Hâkim. On bir yıldır. Ben rakamlarla konuşurum; bugün de rakamlarla konuşacağım.
kemal: Müdafi, sorularınız.
`),
      statements: [
        statement('NL1', 1, ['Ağustosta ', hl('bir zeyilname imzaladım', any(flag('press_nl1'), has('clue_limit'))), '; genel müdür istedi.']),
        statement('NL2', 2, ['Şirket ', hl('temmuzda nakit sıkıntısındaydı', any(flag('press_nl2'), has('clue_nalan'))), '; maaşlar gecikti.']),
      ],
      rules: [
        pressRule('PR_NL1', 'NL1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_nl1')],
          responses: B(`
- O zeyilname neyi değiştirdi?
nalan: Limiti iki milyondan yirmi milyona çıkardı. Bir de bir cümle ekledi: “çalışan kötü niyeti.” Ben sormadan imzaladım; genel müdür “gerekli” dedi.
`),
        }),
        pressRule('PR_NL2', 'NL2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_nl2')],
          responses: B(`
- Yirmi milyon şirket için ne ifade eder?
nalan: Ayakta kalmak. O para gelmezse şirket bir yıl dayanmaz. Ama o para ancak biri suçlanırsa gelir. Poliçeyi öyle yazdık.
~ Bir muhasebeci, bir cümlede hem rakamı hem saiki söyledi. Hesap kapandı.
`),
        }),
        presentRule('PS_NL_ZEYIL', 'NL1', ['ev_zeyil', 'ded_motif'], {
          enabledWhen: any(has('clue_limit'), has('ded_motif')),
          visibleWhen: any(has('clue_limit'), has('ded_motif')),
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_nl')],
          good: 'Tanığın beyanı zeyilnameyle birebir örtüşüyor: olaydan önce yazılmış, zarara ölçülmüş bir poliçe.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Hâkim, tanığın imzaladığı zeyilname: 3 Ağustos, limit yirmi milyon, “çalışan kötü niyeti” teminatı. Olaydan iki buçuk ay önce. Tanığın anlattığı ve belgenin söylediği aynı.
kemal: Tutanağa geçsin.
`),
        }),
      ],
      presentMiss: fallback('FB_NL_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil.', category: 'SORGULAMA' },
        responses: B(`kemal: Bu delilin beyanla ilgisini göremedim müdafi.`),
      }),
      objectMiss: fallback('FB_NL_OBJECT', 'OBJECT', {
        effects: [dec('cred'), inc('wrong'), score('SORGULAMA', -50, 'hatali')],
        quality: { q: 'BAD', feedback: 'Dayanaksız itiraz.', category: 'SORGULAMA' },
        responses: B(`kemal: İtiraz reddedildi.`),
      }),
      finish: { id: 'T04_BITIR', next: 'T_05' },
    }),
    court2.stage('T_05', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      background: 'durusma_salonu',
      lines: [
        W(
          { ref: 'mutalaa_beraat_b' },
          `
kemal: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
ferda: Sayın Hâkim, yargılama ve Başsavcılığımızın soruşturması birlikte değerlendirildiğinde: silme oturumu sanığa ait olmayan bir cihaz ve hattan açılmıştır.
ferda: Sanığın 21.30’daki erişimi ise işveren iznine dayanmaktadır.
ferda: Sanığın üzerine atılı suçları işlemediği sabittir. CMK 223/2-b uyarınca beraatine; fiilin gerçek failine ilişkin soruşturmanın derinleştirilmesine karar verilmesini talep ederim.
> Savcı oturdu. Dinleyici sırasında Tarık Sezer’in yeri boştu; ara verildiğinde çıkmış, dönmemişti.
~ Bir savcının “işlemediği sabittir” demesi bir zafer değil. İşini sonuna kadar yapmasıdır. Bu dosyada ilk kez biri öyle yaptı; ben de ona bir dilekçeyle yardım ettim.
`,
        ),
        W(
          { ref: 'mutalaa_beraat_e' },
          `
> Hâkim saatine baktı; sonra pencereye. Adliyenin camlarında yağmur artık ince bir sis gibiydi. Salonda kimse kıpırdamıyordu.
kemal: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
> Savcı Ferda Yalın ayağa kalkmadan önce dosyasının ilk sayfasını kapattı; iddianameyi. Önünde yalnızca bilirkişi raporu kaldı.
ferda: Sayın Hâkim, dosyadaki esas delil olan DataKale imajı, elde edilme zinciri ve bütünlüğü bakımından güvenilir bulunmamıştır. Bilirkişi, silme oturumunun sanığın cihazından yapıldığının söylenemeyeceğini tespit etmiştir.
ferda: Sanığın suçu işlediği sabit olmadığından CMK 223/2-e uyarınca beraatine; fiili işleyen kişi yönünden soruşturma yapılmasına karar verilmesini talep ederim.
> Katılan vekili Ozan Tekin kalemini masaya bıraktı; sesi çıkmadı, ama kalem masada iki kez yuvarlandı.
ozan: Sayın Hâkim, katılan şirket olarak mütalaaya katılmıyoruz. Zarar ortadadır; zararın bir faili vardır.
kemal: Zararın varlığı tartışmalı değil avukat bey. Tartışılan, failin kim olduğu. Not edildi.
~ Şüpheden beraat. Bir ismi söylemeden, bir çatlaktan geçerek. Sağlam değil; ama yeter.
~ Selim yanımda nefesini tuttu. Ona dönüp “henüz değil” demek istedim. Demedim. Hâkimin önünde bir avukatın yüzü de bir beyan sayılır.
`,
        ),
        O(`
kemal: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
ferda: Sayın Hâkim, oturum dökümü sanığın kullanıcı adını, emniyet raporu sanığın o akşam sisteme eriştiğini göstermektedir. Sanığın işten çıkarılma saiki de dosyadadır.
ferda: Sanığın TCK 244/2 ve 243/1 uyarınca cezalandırılmasına karar verilmesini talep ederim.
~ “Kayıt yalan söylemez.” Savcı kaydı okudu. Kaydın yarısını. Ötekini ben açacaktım; açabildim mi, birazdan belli olacak.
`),
      ],
      choices: [cont('T05_DEVAM', 'Esas hakkında savunma', 'T_06P', { role: 'PRIMARY' })],
    }),
    choiceNode('T_06P', {
      ...H2,
      title: 'Dayanaklar',
      hud: ['noktalar', 'cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
kemal: Müdafi, esas hakkındaki savunmanız.
> Ayağa kalktım. Cübbenin kolu masadaki suyu devirecekti; Selim bardağı son anda tuttu. Salonda biri güldü, sonra sustu.
~ Haftalardır bu dakikayı düşünüyorum. Bir kâğıda yazdım, sildim, yeniden yazdım. Şimdi kâğıda bakmayacağım.
~ Üç dayanak. Leyla’nın sesi: “Fazlası gürültüdür.” Her biri dosyada bir kâğıda dayanmalı.
`),
      choices: [
        dayanak(
          'P_RIZA',
          '21.30 girişi izinliydi; “hukuka aykırı giriş” yok',
          { ref: 'riza_kanit' },
          'arg_riza',
          `
- Birincisi: giriş. Sisteme girme suçu, girmenin hukuka aykırı olmasını ister. Müvekkilim 21.30’da kendi kişisel klasörüne, işverenin yazılı izniyle erişti. İzinli bir giriş suç değildir.
`,
        ),
        dayanak(
          'P_IMAJ',
          'Silmenin esas delili olan imaj güvenilmez',
          { ref: 'imaj_coktu' },
          'arg_imaj',
          `
- İkincisi: imaj. Suçlamanın tek somut dayanağı, iki gün kurcalanmış bir diskten alınan, iki özet değeri tutmayan bir imajdı. Bilirkişi onu güvenilmez buldu. Güvenilmez bir imaj, bir mahkûmiyete temel olamaz.
`,
        ),
        dayanak(
          'P_CIHAZ',
          'Silme başka bir cihaz ve hattan yapıldı',
          { ref: 'baskasi_kanit' },
          'arg_cihaz',
          `
- Üçüncüsü: cihaz. Silme oturumu, kullanıcı adı müvekkilime ait olsa da onun bilgisayarından değil; başka bir cihazdan, başka bir hattan açıldı.
- Kullanıcı adı bir kişi değildir; bir anahtardır. O anahtarın kopyası başkasının elindeydi.
`,
        ),
        dayanak(
          'P_YEDEK',
          'Yedek, silmeden önce odada elle devre dışı bırakıldı',
          any(has('ded_yedek'), has('ded_gm_oda'), flag('contra_t_oda')),
          'arg_yedek',
          `
- Yedek sistemi cuma akşamı çalışıyordu; o gece sunucu odasında elle devre dışı bırakıldı. Uzaktan silen biri, odadaki kabloyu çekemez. Bu, planlı ve içeriden bir eylemdir; müvekkilimin kartı ise aylar önce iade edilmişti.
`,
        ),
        dayanak(
          'P_MOTIF',
          'Zararın dayanağı, olaydan önce büyütülen bir poliçe',
          any(has('ded_motif'), flag('contra_t_motif'), flag('contra_nl')),
          'arg_motif',
          `
- Beyan edilen yirmi milyonluk zarar, olaydan iki buçuk ay önce tam bu tutara çıkarılan, “çalışan kötü niyeti”ni kapsayan bir sigorta poliçesine dayanıyor. Bir çalışanın suçlanması, bu ödemenin ön şartıydı.
`,
        ),
        cont('P_BITIR', 'Esas savunmaya geç', 'T_06', {
          role: 'PRIMARY',
          enabledWhen: any(cmp(v('noktalar'), '==', 0), flag('arg_riza'), flag('arg_imaj'), flag('arg_cihaz')),
          lockedReason: 'En az bir dayanak seç.',
        }),
      ],
    }),
    choiceNode('T_06', {
      ...H2,
      title: 'Esas savunma',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
> Hâkim yazıyordu. Kâtibin parmakları klavyede; her dayanaktan sonra bir duraklama, sonra yeniden tıkırtı.
~ Dayanaklar söylendi. Şimdi hepsini bir talepte toplamam gerekiyor. Hâkimin kalemine geçecek tek bir cümle.
~ Leyla’nın dediği gibi: talep, savunmanın imzasıdır. Ne istediğini bilmeyen avukata mahkeme de bir şey veremez.
`),
      next: 'T_07',
      choices: [
        option('S_MASUMIYET', 'Beraat: giriş izinliydi, silmeyi başkası yaptı', {
          effects: [
            raise('closing_masumiyet'),
            ifThen(
              atLeast(2, flag('arg_riza'), flag('arg_imaj'), flag('arg_cihaz'), flag('arg_yedek'), flag('arg_motif')),
              [score('SAVUNMA_STRATEJISI', strategyAmount(200, 'MASUMIYET')), inc('pers')],
              [score('SAVUNMA_STRATEJISI', 60)],
            ),
          ],
          good: 'Delillerle desteklenen beraat talebi: sanığın suçu işlemediği (CMK 223/2-b), olmazsa işlediğinin sabit olmadığı (223/2-e).',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Hâkim, bu dosyada bir kullanıcı adı vardı; herkes onu bir isim sandı. Oysa o bir anahtardı ve anahtarın kopyası başkasının zarfındaydı.
- O gece müvekkilim kendi fotoğraflarını, izinle aldı. Silme ise başka bir cihazdan, başka bir hattan, odadaki yedek elle susturulduktan sonra yapıldı.
- Müvekkilimin bu suçları işlemediği sabittir; en azından işlediği sabit değildir. Beraatini talep ediyorum.
> Hâkim Kemal Oran gözlüğünü çıkardı. Bana değil, dosyaya baktı; uzun uzun.
`),
        }),
        option('S_USUL', 'Beraat: esas delil hukuken değersiz, geriye delil kalmıyor', {
          effects: [
            raise('closing_usul'),
            ifThen(
              any(flag('arg_imaj'), flag('sema_dinlendi'), flag('contra_b3')),
              [score('SAVUNMA_STRATEJISI', strategyAmount(200, 'USUL')), inc('pers')],
              [score('SAVUNMA_STRATEJISI', 40)],
            ),
          ],
          good: 'Elde etme zinciri ve bütünlüğü bozuk dijital delilin hükme esas alınamayacağını savundun (CMK 134, 217).',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Hâkim, bir dijital delilin tek güvencesi bütünlüğüdür: ne zaman, nereden, hangi özet değerle alındığı. Bu dosyadaki esas delil, iki gün kurcalanmış bir diskten, tutmayan özet değerlerle alınmış bir imajdır.
- Böyle bir imaj hükme esas alınamaz. O çıkınca geriye yalnızca bir kullanıcı adı kalıyor; o da bir kişiyi göstermiyor.
- Müvekkilimin CMK 223/2-e uyarınca beraatini talep ediyorum.
> Dr. Sema Uçar dinleyici sırasından başını salladı; bir mühendisin, doğru kurulmuş bir cümleye verdiği onay.
`),
        }),
        option('S_TERDIT', 'Önce beraat; olmazsa yalnızca izinli giriş, silme sabit değil', {
          effects: [raise('closing_terdit'), score('SAVUNMA_STRATEJISI', strategyAmount(150, 'INDIRIM'))],
          good: 'Terditli savunma: önce beraat; aksi hâlde 244/2’nin sabit olmadığı, kalsa kalsa izinli olduğu için 243’ün de oluşmadığı.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Hâkim, öncelikle müvekkilimin beraatini talep ediyorum.
- Mahkeme aksi kanaatteyse: verileri yok etme eylemi (TCK 244/2) güvenilir hiçbir delille sanığa bağlanamamıştır.
- Geriye yalnızca 21.30’daki erişim kalır; o da işveren iznine dayandığından sisteme hukuka aykırı girme (TCK 243/1) de oluşmaz.
~ Bir yandan “yapmadı,” öbür yandan “yaptıysa bile izinliydi.” Hukuk bunu ister. Selim’in gözleri istemiyor.
`),
        }),
        option('S_DUYGU', 'Bir babanın gözyaşlarına seslen', {
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('pers')],
          bad: 'Esas savunma delil tartışmasıdır; duygusal çağrı tek hâkimi ikna etmez, zayıflık işareti verir.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Hâkim, salonda bir baba var. Küçük bir kızı her akşam bir resim çiziyor…
kemal: Müdafi, esas hakkında. Delilleri konuşalım.
~ Defne’nin resmini de kullandım. Utandım. Hâkim delili bekliyordu; ben duyguyu sundum.
`),
        }),
      ],
    }),
    choiceNode('T_07', {
      ...H2,
      title: 'Son söz',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
kemal: Sanık, son sözünüz nedir?
> Selim ayağa kalktı. Bana baktı; ne söyleyeceğini bilmiyordum, bilmemem gerekiyordu.
~ Son söz kanunen sanığındır. Burada benim işim bitiyor. Bundan sonrası bir adamın sesi.
`),
      next: 'T_08',
      choices: [
        option('L_HAFIZA', '“Ben o şirketin hafızasıydım. Kimse kendi hafızasını silmez.”', {
          score: { SAVUNMA_STRATEJISI: 50 },
          effects: [inc('pers')],
          good: 'Sanığın kendi sesiyle, suçlamasız, delil tartışmasını özetleyen bir son söz.',
          category: 'SAVUNMA_STRATEJISI',
          responses: [
            W(
              flag('selim_hazir'),
              `
selim: Ben dokuz yıl o şirketin hafızasıydım Sayın Hâkim. Her gece yedeğini ben aldım. Kimse bir hafızayı silmek için kendi hafızasını vermez.
selim: Benim adım bir kayıtta kaldı. Ama o kayıt benim değildi; sadece adımı taşıyordu. Ben doğruyu söyledim; kayıt bana yalan söyledi.
> Salon sessizdi. Gül, Defne’nin resmini göğsüne bastırdı.
`,
            ),
            O(`
selim: Ben o şirketin hafızasıydım Sayın Hâkim. Kimse kendi hafızasını silmez. Ben bir şey silmedim; benim adımı sildiler, bir kaydın içine.
> Gül başını eğdi. Salonda kimse konuşmadı.
`),
          ],
        }),
        option('L_SUCLA', '“Asıl silen genel müdürdür!”', {
          visibleWhen: any(flag('fact_gm'), flag('contra_t_cihaz'), flag('contra_t_hat'), has('clue_turnike_gm')),
          score: { SAVUNMA_STRATEJISI: -30 },
          effects: [dec('pers'), raise('selim_suclama')],
          bad: 'Sanığın son sözde bir kişiyi suçlaması iftira riski taşır ve lehe havayı bozar; faili savcılık soruşturur, sanık değil.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
selim/kizgin: Asıl silen Tarık Sezer’dir! O yaptı, sigorta parası için!
kemal: Sanık, bir başkasını suçlamak son sözün konusu değildir. Kendinizi anlatın.
~ Kayıtların sakin sesini, bir öfke bastırdı. Dayanakları ben kurmuştum; son sözde o dağıttı.
`),
        }),
        option('L_SESSIZ', '“Söyleyecek bir şeyim yok. Avukatım söyledi.”', {
          neutral: 'Susmak da bir haktır; ama son söz sanığa kalan son andır.',
          responses: B(`
selim: Söyleyecek bir şeyim yok Sayın Hâkim. Avukatım her şeyi söyledi.
`),
        }),
      ],
    }),
    decisionNode('T_08', [{ to: 'R_KARAR' }], {
      ...H2,
      title: 'Hüküm',
      lines: [
        W(
          flag('cokus'),
          `> Hâkim müzakere için salonu boşalttı. Uzun sürmedi. Ben yerimden kalkmadım.`,
        ),
        W(
          flag('closing_terdit'),
          `
> Hâkim dosyayı topladı. “Karar için saat on dörtte” dedi. Selim bana döndü: “Terditli ne demek avukat hanım? İki ihtimal mi var?” Cevap vermedim; terditli bir savunma, müvekkile iki cevap birden verir, ikisi de ağır.
cevdet: Taraflar salona! Hüküm açıklanacak. Hı-hım.
`,
        ),
        W(
          any(flag('closing_masumiyet'), flag('closing_usul')),
          `
> Hâkim dosyayı topladı, gözlüğünü çıkardı. “Karar için saat on dörtte.” Koridorda Gül’ün nefesi, Selim’in parmaklarının masaya vuruşu, Defne’nin katlanıp açılan resmi.
cevdet: Taraflar salona! Hüküm açıklanacak. Hı-hım.
~ Hüküm. Bir dosyanın son satırı; bir ailenin ilk cümlesi.
`,
        ),
        O(`
> Hâkim dosyayı topladı. “Karar için saat on dörtte.” Koridorda beklerken Selim bir sigara yaktı, yarısında söndürdü.
cevdet: Taraflar salona! Hüküm açıklanacak. Hı-hım.
`),
      ],
    }),
    story('T_INT_COKUS', {
      ...H2,
      title: 'Çöküş',
      background: 'durusma_salonu',
      lines: B(`
> Bir yanlış daha. Hâkim Kemal Oran kalemini bıraktı. Gözlüğünün üstünden baktı; kızgın değil, yorgun.
kemal: Müdafi, sunduklarınızın dosyayla ilgisi kalmadı. Güvenilirliğinizi bu salonda tükettiniz. Mahkeme yeterince dinledi.
~ Güvenimi tek tek harcadım. Her yanlış kâğıt bir kalp götürdü. Şimdi elimde yalnızca bir dosya var; kalbim yok.
`),
      choices: [cont('COKUS_DEVAM', 'Hüküm', 'T_08', { role: 'PRIMARY' })],
    }),
    resultNode('R_KARAR', { ...H2, title: 'Karar', background: 'durusma_salonu' }),
  ],
};
