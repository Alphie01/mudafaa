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
  flags,
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
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, Cond } from '../../../tools/content/src/kit/index.js';
import { B, O, T, W } from './dsl.js';
import { H2, court2, wrongMove } from './shared.js';

// 80-trial: 2. celse. Koridor, açılış (müzekkere cevapları), bilirkişi, Hayri Bey, Melek (M1–M4), Ercan (R1–R4;
// suç duyurusu varsa yeminsiz), nitelendirme uyarısı (CMK 226), mütalaa, dayanaklar, esas savunma, son söz, hüküm.
// İkrar yolu (etik ihlali) ayrı bir kısa kol: T_IKRAR.

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

const baskasi: Cond = any(has('ded_baskasi'), flag('contra_e4'), flag('contra_e2'));

export const trial: CasePart = {
  variables: flags(
    'bq_terminal',
    'bq_onay',
    'bq_pc03',
    'bq_yazici',
    'press_m2',
    'press_m3',
    'contra_m2',
    'contra_m3',
    'm4_teyit',
    'press_r1',
    'press_r2',
    'press_r3',
    'contra_r1',
    'contra_r2',
    'contra_r3',
    'contra_r4',
    'ercan_sustu',
    'nitel_uyari',
    'ek_sure',
    'ihmal_kabul',
    'arg_baskasi',
    'arg_zilyet',
    'arg_tutanak',
    'arg_zarf',
    'arg_kasa',
    'arg_kredi',
    'arg_izin',
    'closing_masumiyet',
    'closing_usul',
    'closing_terdit',
    'son_hesap',
  ),
  predicates: [
    {
      id: 'baskasi',
      label: 'İptallerin sanık binadan çıktıktan sonra başka bir bilgisayardan yapıldığı gösterildi',
      when: baskasi,
    },
    {
      id: 'lehe2',
      label: 'En az iki bağımsız lehe bulgu',
      when: atLeast(
        2,
        has('ded_izin'),
        has('ded_teslim'),
        has('ded_sahte_tutanak'),
        has('ded_kasa'),
        flag('contra_r1'),
        flag('contra_r2'),
        flag('contra_r3'),
        flag('contra_m2'),
        flag('contra_e1'),
      ),
    },
    {
      id: 'mutalaa_b',
      label: 'Savcı gerçek faili gösteren delillerle beraat isteyecek',
      when: all(flag('ercan_sustu'), any(has('ded_kasa'), flag('contra_r2')), any(has('ded_sifre'), flag('contra_r3'))),
    },
    {
      id: 'mutalaa_e',
      label: 'Savcı kuşkudan beraat isteyecek',
      when: all(
        baskasi,
        atLeast(
          2,
          has('ded_izin'),
          has('ded_teslim'),
          has('ded_sahte_tutanak'),
          has('ded_kasa'),
          flag('contra_r1'),
          flag('contra_r2'),
          flag('contra_r3'),
          flag('contra_m2'),
          flag('contra_e1'),
        ),
        cmp(v('pers'), '>=', 6),
      ),
    },
  ],
  court: {
    sessions: [
      courtSession('cs_2', '2. Celse', [
        ['s2_acilis', 'ACILIS', 'T_00'],
        ['s2_delil', 'DELIL_TARTISMA', 'T_01'],
        ['s2_tanik', 'TANIK_DINLEME', 'T_02'],
        ['s2_ek', 'EK_SAVUNMA', 'T_04'],
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
# 13 OCAK · 09.10 — BURSA ADLİYESİ, 4. KAT [bg:adliye]
> Yağmur bir aydır dinmemişti. Adliyenin mermerleri ıslak ayak izleriyle desenlenmiş; temizlikçi bir uçtan siliyor, öbür uçtan yeniden kirleniyordu.
> Orhan bu kez gömleğini kendisi ütülemişti; Nazan yine de yakasını düzeltti. Elif okuldaydı; bir mesaj atmış: “Baba, iki kere say.”
`),
    }),
    decisionNode('T_00G_2', [{ to: 'T_00G_3' }], {
      lines: [
        W(
          flag('suc_duyurusu'),
          `
> Ercan Tunalı koridorun ucundaydı; yanında bu kez bir avukat vardı. Lacivert değil, gri bir takım giymişti. Orhan’a doğru yürümedi. Elini kimsenin eline uzatmadı.
~ Bir dilekçe, bir arama, bir emanet tutanağı. Bir adam bir ay önce el sıkıyordu; bugün bir avukatın arkasında duruyor.
`,
        ),
        W(
          flag('teklif_bildirildi'),
          `
> Ercan Tunalı koridorun ucundaydı. Beni görünce başını eğdi; her zamanki gibi. Bu kez gözlerini kaldırmadı.
`,
        ),
        O(`
> Ercan Tunalı koridorun ucunda, telefonunda bir şey okuyordu. Orhan’ın elini yine iki eliyle sıktı. “Geçmiş olsun Orhan Bey.” Bir ay önceki cümle, bir ay önceki ses.
`),
      ],
    }),
    decisionNode('T_00G_3', [{ to: 'T_00G_4' }], {
      lines: [
        W(
          flag('bilgilendirdi'),
          `
> Orhan pencerenin önünde bana döndü. Elinde bir kâğıt: Elif’in sabah mesajının ekran görüntüsü, Nazan bastırmış. “Baba, iki kere say.”
orhan: Ev satılık değil efendim. Nazan emlakçıya “vazgeçtik” dedi. Emlakçı “pişman olursunuz” demiş. Nazan da “pişmanlık bizim işimiz değil” demiş.
orhan: Ne olursa olsun, bugün ne derlerse desinler. Ben kasanın hesabını vermeyeceğim. Zarfın hesabını vereceğim.
~ Bir adam kendi sınırını çizdi. Benim çizmem gereken sınırı, benden önce.
`,
        ),
        W(
          flag('ikrar_yolu'),
          `
> Orhan pencerenin önündeydi. Bana dönmedi. Nazan, elinde bir banka dekontu, dinleyici sırasının ucunda oturuyordu; dekontu katlamıştı, açmıştı, yeniden katlamıştı.
nazan: Ödendi avukat hanım. Hepsi. Ev gitti. Siz dediniz ya, risk almayalım diye.
~ Söyledim. Şimdi o cümle bir dekontun üstünde, bir kadının ellerinde duruyor.
`,
        ),
        O(`
> Orhan pencerenin önündeydi. Nazan emlakçının broşürünü çantasında taşıyordu; kenarı görünüyordu. Kimse ondan söz etmedi.
`),
      ],
    }),
    decisionNode('T_00G_4', [{ to: 'T_00' }], {
      lines: [
        W(
          flag('koridor_durust'),
          `
nazan: Bir ay önce “bugün başlıyor” demiştiniz. Bugün bitiyor mu avukat hanım?
- Bugün karar çıkabilir. Ne çıkacağını bilmiyorum. Ama ne çıkarsa çıksın, akşam size ben anlatacağım.
nazan: Bir ay önce de öyle dediniz. Anlattınız. Bu yüzden soruyorum.
`,
        ),
        W(
          flag('fact_araba_kredi'),
          `
> Melek dinleyici sıralarının önünde, elinde bir dosya, bir avukatla konuşuyordu; kendine bir avukat bulmuştu. Beni görünce başını salladı. Ne bir gülümseme ne bir kaçış.
`,
        ),
        O(`
> Hayri Bey yine ayakkabı kutusuyla gelmişti. Kutunun kapağına bu kez yeni bir etiket yapıştırmıştı: “DAVA — 2. CELSE.”
`),
      ],
    }),
    court2.stage('T_00', {
      title: 'Duruşma · 2. Celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('suc_duyurusu'),
          `
mubasir: Orhan Kılıç dosyası! Taraflar içeri!
# BURSA 6. AĞIR CEZA MAHKEMESİ — 2. CELSE [bg:durusma_salonu]
baskan: Ara karar gereği gelen cevaplar okundu: bilirkişi raporu ve müzekkere cevapları dosyaya girdi.
baskan: Bursa Cumhuriyet Başsavcılığından gelen yazı da okundu: müdafiin suç duyurusu üzerine soruşturma başlatıldığı, Mali Hizmetler Müdür Yardımcılığı odasında yapılan aramada üç şifre zarfının emanete alındığı bildirildi.
> Savcı Gökhan Ersoy yazıyı önceden okumuştu; yüzünde şaşkınlık yoktu. Gözlüğünü çıkardı, sildi, taktı. Orhan’ın hareketiyle aynı hareket.
`,
        ),
        O(`
mubasir: Orhan Kılıç dosyası! Taraflar içeri!
# BURSA 6. AĞIR CEZA MAHKEMESİ — 2. CELSE [bg:durusma_salonu]
baskan: Ara karar gereği gelen cevaplar okundu ve dosyaya girdi. İstenmeyen ya da gelmeyen kayıtlar yönünden dosyada eksik bulunmadığı anlaşıldı.
> Savcı Gökhan Ersoy dosyasını açtı; bir ay önceki sarı kalem bu kez kalemlikteydi.
`),
      ],
      choices: [cont('T00_DEVAM', 'Devam', 'T_00R', { role: 'PRIMARY' })],
    }),
    decisionNode('T_00R', [
      { when: flag('ikrar_yolu'), to: 'T_IKRAR' },
      { when: has('ev_bilirkisi'), to: 'T_01' },
      { to: 'T_01X' },
    ]),
    court2.stage('T_01X', {
      title: 'Bilirkişi yok',
      courtStage: 'DELIL_TARTISMA',
      background: 'durusma_salonu',
      lines: B(`
savci: Sayın Başkan, dosyada teknik bir inceleme talebi olmadığından teftiş raporu ve iptal kayıtları birlikte değerlendirilmelidir. Kayıtlar sanığın kullanıcısını gösteriyor.
~ Bilirkişi istemedim. Teftiş raporu dosyada tek başına; iki sütun ve bir isim. Elimde ne varsa onu kürsüye taşıyacağım.
`),
      choices: [cont('T01X_DEVAM', 'Tanıklar', 'T_01H_G', { role: 'PRIMARY' })],
    }),
    choiceNode('T_01', {
      ...H2,
      title: 'Bilirkişi',

      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: [
        W(
          flag('log_muhafaza'),
          `
mubasir: Bilirkişi Dr. Seda Karaca!
bilirkisi: Raporumu özetliyorum. Vezne programında terminal kısıtlaması yok; vezne kullanıcısı müdürlüğün herhangi bir bilgisayarından oturum açabiliyor. On bin liranın altındaki iptaller ikinci onay istemiyor.
bilirkisi: Kırk yedi iptalin kırk yedisi MHM-PC03’ten. Hiçbiri VZ-02’den değil. Muhafaza altına alınan log yedekleri de bunu doğruluyor; yedeklerde 14 Ocak 17.31’deki geçici şifreyle açılan ilk oturum da PC03’te.
bilirkisi: Log yalan söylemez. Yalnızca eksik söyler: bir kullanıcı adının arkasında kimin oturduğunu söylemez.
baskan: Müdafi, bilirkişiye sorularınız.
`,
        ),
        W(
          flag('yedek_aldi'),
          `
mubasir: Bilirkişi Dr. Seda Karaca!
bilirkisi: Raporumu özetliyorum. Vezne programında terminal kısıtlaması yok; on bin liranın altındaki iptaller ikinci onay istemiyor. Kırk yedi iptalin hepsi MHM-PC03’ten.
bilirkisi: Bir not: dosyaya savunma tarafından bir yedek diskin varlığından söz edildi. Usulüne uygun el konulmamış bir kopyayı incelemedim; zincir dışı veriler değerlendirmeye alınmaz.
> Savcı bana baktı. Üye hâkim de.
~ Bir kopya istedim. Bir delili kendi elimle kirlettim; bilirkişi onu kibarca kenara koydu.
baskan: Müdafi, bilirkişiye sorularınız.
`,
        ),
        O(`
mubasir: Bilirkişi Dr. Seda Karaca!
bilirkisi: Raporumu özetliyorum. Vezne programında terminal kısıtlaması yok; vezne kullanıcısı müdürlüğün herhangi bir bilgisayarından oturum açabiliyor. On bin liranın altındaki iptaller ikinci onay istemiyor.
bilirkisi: Kırk yedi iptalin kırk yedisi MHM-PC03’ten. Hiçbiri VZ-02’den değil.
bilirkisi: Log yalan söylemez. Yalnızca eksik söyler: bir kullanıcı adının arkasında kimin oturduğunu söylemez.
baskan: Müdafi, bilirkişiye sorularınız.
`),
      ],
      choices: [
        option('BQ_TERM', '“Vezne kullanıcısı hangi bilgisayarlardan girebiliyor?”', {
          score: { SORGULAMA: 40 },
          effects: [raise('bq_terminal'), inc('pers')],
          good: 'Teknik bir olguyu bilirkişiye sordun; sistemin herkese açık olduğu tutanağa geçti (CMK 67/3 sınırında doğru soru).',
          category: 'SORGULAMA',
          responses: B(`
bilirkisi: Müdürlükteki yedi bilgisayarın yedisinden. Kullanıcı adı ve şifreyi bilen herkes, herhangi birinden.
savci: Yani şifreyi bilen herkes?
bilirkisi: Şifreyi bilen herkes, Sayın Savcı.
`),
          next: '$stay',
        }),
        option('BQ_ONAY', '“On bin liranın altındaki iptaller nasıl onaylanıyor?”', {
          visibleWhen: flag('fact_10bin'),
          score: { SORGULAMA: 40 },
          effects: [raise('bq_onay'), inc('pers')],
          good: 'İptallerin hepsinin onay sınırının altında kaldığını bilirkişiye doğrulattın: sistemi bilen birinin işi.',
          category: 'SORGULAMA',
          responses: B(`
bilirkisi: Onaylanmıyor. On binin üstü müdürlük onayı ister; altı istemez. Kırk yedi iptalin en büyüğü 9.950.
- Bu sınırı kimler bilir?
bilirkisi: Sistem ayarlarını görebilenler. Bilgi işlem ve müdürlük yöneticileri. Veznedar ekranında bu sınır görünmez.
> Üye hâkim kalemini bıraktı.
`),
          next: '$stay',
        }),
        option('BQ_PC03', '“MHM-PC03 nerede, kimler kullanıyor?”', {
          visibleWhen: flag('fact_pc03'),
          score: { SORGULAMA: 40 },
          effects: [raise('bq_pc03'), inc('pers')],
          good: 'Keşifte tespit edilen bilgisayarın yerini ve erişimini bilirkişiye doğrulattın.',
          category: 'SORGULAMA',
          responses: B(`
bilirkisi: Ön odada; veznelerin arkasında, müdür yardımcılığı odasının kapısının önünde. Keşifte tespit ettik. Kasa odasına açılan iç kapı da aynı odada.
bilirkisi: Vezne salonundan ön odaya buzlu camlı bir kapıyla geçiliyor. Vezne camının arkasından ekran görünmüyor.
`),
          next: '$stay',
        }),
        option('BQ_YAZICI', '“Gün sonu raporları ne zaman basılmış?”', {
          visibleWhen: flag('fact_yazici'),
          score: { SORGULAMA: 40 },
          effects: [raise('bq_yazici'), inc('pers')],
          good: 'Yazıcı günlüğüyle gün sonu raporunun iptallerden sonra yeniden basıldığını bilirkişiye doğrulattın.',
          category: 'SORGULAMA',
          responses: B(`
bilirkisi: Yazıcı günlüğüne göre iptal günlerinin hepsinde iki kez: 16.55–17.00 arası vezneden, 17.50–17.58 arası ön odadan. İkincisi iptallerden sonra.
bilirkisi: Dosyadaki asıl tutanaklara ekli raporlar ikinci basımın raporları.
`),
          next: '$stay',
        }),
        option('BQ_SUCSUZ', '“Bu bulgulara göre sanık suçsuz mudur?”', {
          score: { SORGULAMA: -50 },
          effects: [dec('pers')],
          bad: 'Bilirkişiye hukuki değerlendirme sordun; bilirkişi hâkimin yapacağı hukuki nitelendirmeye ilişkin açıklama yapamaz (CMK 67/3).',
          category: 'SORGULAMA',
          responses: B(`
savci: İtiraz ediyorum Sayın Başkan. Bilirkişiye hukuki değerlendirme soruluyor.
baskan: Yerinde. Bilirkişi bu soruya cevap vermeyecek. Müdafi, bilirkişi hâkim değildir.
bilirkisi: Ben yalnızca makineyi anlatırım.
`),
          next: '$stay',
        }),
        option('BQ_KIM', '“İptalleri kim yaptı?”', {
          score: { SORGULAMA: -10 },
          neutral: 'Log bir kullanıcı adı söyler, kişi söylemez; bilirkişiden kimlik tespiti beklenemez.',
          responses: B(`
bilirkisi: Bilmiyorum avukat hanım. Log bir kullanıcı adı söyler: okilic. Klavyenin başındaki eli söylemez. O eli siz bulacaksınız.
`),
          next: '$stay',
        }),
        cont('BQ_BITIR', 'Sorularım bu kadar', 'T_01H_G', { role: 'PRIMARY' }),
      ],
    }),
    decisionNode('T_01H_G', [{ when: flag('hayri_tanik'), to: 'T_01H' }, { to: 'T_02' }]),
    court2.stage('T_01H', {
      title: 'Tanık Hayri Özdemir',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'hayri',
      lines: B(`
mubasir: Tanık Hayri Özdemir!
> Hayri Bey ayakkabı kutusunu dinleyici sırasına bıraktı; kürsüye eli boş yürüdü. Yemin metnini başkandan önce bitirdi; başkan bir an durdu, sonra devam etti.
hayri: 12 Şubat’ta saat 16.40’ta ödeme yaptım; veznedar parayı iki kez saydı. Saat altıya doğru hırkam için geri döndüm. Bekçi içeri almadı.
hayri: Veznelerin arkasındaki odada ışık yanıyordu. Buzlu camdan mavi bir ışık, bir monitör ışığı. Bir gölge gördüm; kim olduğunu bilmiyorum. Arka kapıda bir şemsiye açıldı.
savci: Tanık, gölgenin kim olduğunu tahmin edebilir misiniz?
hayri: Hayır Sayın Savcı. Tahmin tarihin düşmanıdır. Saat altıya on vardı; bu kadarını biliyorum.
> Üye hâkim saati yazdı ve bilirkişi raporunun ekindeki bir satırın yanına bir işaret koydu.
`),
      choices: [cont('T01H_DEVAM', 'Devam', 'T_02', { role: 'PRIMARY' })],
    }),
    court2.testimony('T_02', {
      title: 'Melek Yavuz’un tanıklığı',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'melek',
      witnessLabel: 'TANIK · MELEK YAVUZ',
      rulesText: 'İpucu: önce bastır, sonra doğru delille göster. Yanlış delil güvenilirliği ve skoru düşürür.',
      objectionGrounds: ['g_telkin', 'g_kanaat', 'g_duyum'],
      say: T(`
mubasir: Tanık Melek Yavuz!
> Melek kürsüye yürüdü. Sakızı yoktu. Çantasını iki eliyle göğsüne bastırmıştı; yemin ederken bile bırakmadı.
baskan: Tanık, bildiklerinizi anlatın.
melek: Orhan abiyle on bir buçuk yıl yan yana çalıştım. İyi adamdır. Ben bir şey görmedim. Savcılıkta da söyledim.
baskan: Müdafi, sorularınız.
~ Korkan bir tanık. Ona ne söyleyeceğini söylemeyeceğim. Yalnızca soracağım; sonra kâğıtları.
`),
      statements: [
        statement('M1', 1, ['Orhan abiyle on bir buçuk yıl yan yana çalıştım; kimseyle bir sorunu yoktu.']),
        statement('M2', 2, [
          hl(
            'Zarf diye bir şey hatırlamıyorum',
            any(flag('press_m2'), has('ev_talimat'), has('ded_zarf'), has('ev_zarflar')),
          ),
          '.',
        ]),
        statement('M3', 3, [
          'Orhan abi bazen akşamları ',
          hl(
            'geç kalırdı; ben çıkarken hâlâ masasındaydı',
            any(flag('press_m3'), has('clue_cikis'), has('ded_baskasi')),
          ),
          '.',
        ]),
        statement('M4', 4, ['Ben ', hl('o ön oda bilgisayarına hiç oturmadım', has('clue_melek_cikis')), '.']),
      ],
      rules: [
        pressRule('PR_M1', 'M1', {
          score: { SORGULAMA: 15 },
          responses: [
            W(
              flag('fact_melek_orhan'),
              `
- Hiç mi sorun olmadı? On bir buçuk yılda?
melek: Orhan abi beni korur hep. Bir keresinde bir mükellef bana bağırdı; Orhan abi camını kapattı, kalktı, adamı kibarca kapıya kadar götürdü. Bir kelime etmeden.
melek: Şimdi ben onu koruyamıyorum. Bunu bilin.
`,
            ),
            O(`
- Hiç mi sorun olmadı? On bir buçuk yılda?
melek: Bir kere. Bir mükellef ona bahşiş bıraktı, adamın peşinden durağa kadar koştu. Ben “abi delirdin mi” dedim. Sorun buydu.
`),
          ],
        }),
        pressRule('PR_M2', 'M2', {
          score: { SORGULAMA: 25 },
          effects: [
            raise('press_m2'),
            ifThen(all(flag('melek_hazir'), not(flag('contra_m2'))), [
              raise('contra_m2'),
              inc('pers', 2),
              score('SORGULAMA', 250),
            ]),
          ],
          responses: [
            W(
              flag('melek_hazir'),
              `
- Müdürlükte şifrelerle ilgili bir uygulama oldu mu Melek Hanım?
> Melek çantasını bıraktı. Kürsünün kenarını tuttu. Bir an dinleyici sıralarına baktı; arka sıraya.
melek: Oldu. Yalan söylemeyeceğim. Söz verdim; kendime.
melek: Eylülde masalarımıza bir not bırakıldı. Kareli kâğıda yazılmış. Şifrelerimizi zarfa koyup müdürlüğe vermemiz istendi. Verdik. Hepimiz verdik. Orhan abi, ben, Selim abi.
melek: Notu kim yazdı bilmiyorum. Zarfları kim topladı biliyorum. Ercan Bey topladı. Kendi eliyle aldı, “devamlılık için” dedi.
> Salon sustu. Arka sırada bir sandalye gıcırdadı.
baskan: Tutanağa geçsin: tanık, veznedarların şifrelerinin müdürlükte zarflarda toplandığını ve zarfları müdür yardımcısının topladığını beyan etti.
~ Ona ne söyleyeceğini söylemedim. Yalnızca sordum. Gerisini o, kendine verdiği bir sözle söyledi.
`,
            ),
            O(`
- Müdürlükte şifrelerle ilgili bir uygulama oldu mu Melek Hanım?
melek: Hatırlamıyorum dedim ya. Zarf, kâğıt… Hatırlamıyorum.
> Gözleri bir an arka sıraya kaydı; sonra kürsünün tahtasına indi.
~ “Hatırlamıyorum” bir cevap değil; bir kapı. Kapıyı açacak bir kâğıt lazım.
`),
          ],
        }),
        pressRule('PR_M3', 'M3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_m3')],
          responses: B(`
- Geç kalırdı derken? Kaça kadar?
melek: Bilmem… Altıya kadar? Ben çıkarken masasındaydı. Yani bazen. Yani… öyle söylemişlerdi.
- Kim söylemişti?
melek: Müdürlükte konuşuluyordu canım. Yani, Sayın Başkan.
`),
        }),
        presentRule('PS_M2', 'M2', ['ev_talimat', 'ded_zarf', 'ev_zarflar'], {
          score: { SORGULAMA: 250 },
          effects: [
            ifThen(
              all(not(flag('melek_kacti')), not(flag('melek_suc'))),
              [raise('contra_m2'), inc('pers', 2)],
              [inc('pers')],
            ),
            ifThen(any(flag('orhan_zarf_sakla'), flag('orhan_yalan')), [dec('cred'), dec('pers')]),
          ],
          good: 'Şifrelerin zarfta toplandığını gösteren belge tanığa gösterildi; “hatırlamıyorum” beyanı belgeyle karşılandı.',
          category: 'SORGULAMA',
          responses: [
            W(
              any(flag('melek_kacti'), flag('melek_suc')),
              `
- Sayın Başkan, şifrelerin zarfta toplandığını gösteren belge. Tanık, bu notu hatırlıyor musunuz?
melek/kizgin: Hatırlamıyorum. Bana bağıran, beni suçlayan bir avukatın kâğıdını hatırlamıyorum.
baskan: Tanık, yalnızca soruyu cevaplayın.
melek: Hatırlamıyorum Sayın Başkan.
~ Belge orada duruyor; tanık onun yanında susuyor. Bu susuşu ben hazırladım.
`,
            ),
            W(
              any(flag('orhan_zarf_sakla'), flag('orhan_yalan')),
              `
- Sayın Başkan, sanığın evrakı arasından çıkan not. Tanık, bunu hatırlıyor musunuz?
> Melek notu gördü. Bir an gözlerini kapadı.
melek: Hatırlıyorum. Hepimiz verdik. Zarfları Ercan Bey topladı.
uye: Sanık ilk celsede şifresini kimseyle paylaşmadığını söylemişti. Şimdi tanık başka bir şey söylüyor.
> Orhan başını eğdi. Heyet bir şey yazdı; ikisi aynı anda.
~ Bir gerçeği sakladırdım; gerçek başka bir ağızdan geldi. Müvekkilimin sözü bu salonda biraz ucuzladı.
`,
            ),
            O(`
- Sayın Başkan, sanığın evrakı arasından çıkan not: “Şifreler zarfta, müdürlükte kalacak.” Tanık, bu notu hatırlıyor musunuz?
> Melek kâğıda baktı. Çantasını kürsünün kenarına bıraktı; ilk kez elleri boştu.
melek: Hatırlıyorum. Masamıza bırakılmıştı. Verdik. Hepimiz verdik. Orhan abi, ben, Selim abi.
melek: Zarfları Ercan Bey topladı. Kendi eliyle. “Devamlılık için” dedi.
baskan: Tutanağa geçsin: tanık, şifrelerin müdürlükte zarflarda toplandığını ve zarfları müdür yardımcısının topladığını beyan etti.
`),
          ],
        }),
        presentRule('PS_M3', 'M3', ['ev_pdks', 'ded_baskasi', 'ev_pdks_mud'], {
          enabledWhen: any(has('clue_cikis'), has('ded_baskasi'), has('clue_melek_cikis')),
          score: { SORGULAMA: 200 },
          effects: [raise('contra_m3'), inc('pers')],
          good: 'Turnike kayıtları: sanık iptal günlerinde tanıktan önce çıkmış. “Ben çıkarken masasındaydı” beyanı duyuma dayanıyor ve kayıtla çelişiyor.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, turnike kayıtları. İptal günlerinde sanık en geç 17.09’da çıkmış; tanık 17.08 ile 17.14 arasında. Sanık her akşam ondan önce ya da onunla birlikte çıkmış.
melek: O zaman… yanlış hatırlıyorum. Servisi kaçırmazdı zaten. Ben öyle duymuştum; görmemiştim.
`),
        }),
        presentRule('PS_M4', 'M4', ['ev_pdks_mud'], {
          enabledWhen: has('clue_melek_cikis'),
          score: { SORGULAMA: 100 },
          effects: [raise('m4_teyit')],
          neutral:
            'Kısmi isabet: kayıt tanığı doğruluyor; bu bir çelişki değil, ama heyetin aklındaki bir şüpheyi kapatıyor.',
          responses: B(`
- Sayın Başkan, kayıtlar tanığın iptallerden önce binadan çıktığını gösteriyor. Tanığın bu beyanı kayıtla örtüşüyor.
melek: Oturmadım. Söyledim. Arabam kredili, yemin ederim.
baskan: Tanık, arabanız sorulmadı.
`),
        }),
        presentRule('PS_M_SAVCILIK', undefined, ['ev_teftis', 'ev_tutanak', 'ev_banka', 'ev_ercan_ifade', 'ev_dokum'], {
          maxUses: 10,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'Savcılık delilinin bu tanığın beyanıyla bir ilgisi yok. −1 güvenilirlik, −150 skor.',
          category: 'SORGULAMA',
          responses: B(`
melek: Bunu ben hiç görmedim canım. Sayın Başkan.
baskan: Müdafi, bu belgenin tanıkla ilgisi?
`),
        }),
      ],
      presentMiss: fallback('FB_M_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil: −1 güvenilirlik, −150 skor.', category: 'SORGULAMA' },
        responses: B(`
baskan: Bu delilin beyanla ilgisini göremedim müdafi.
`),
      }),
      objectMiss: fallback('FB_M_OBJECT', 'OBJECT', {
        effects: [dec('cred'), inc('wrong'), score('SORGULAMA', -50, 'hatali')],
        quality: { q: 'BAD', feedback: 'Dayanaksız itiraz.', category: 'SORGULAMA' },
        responses: B(`
baskan: İtiraz reddedildi. Dayanağı yok.
`),
      }),
      finish: { id: 'T02_BITIR', next: 'T_02K' },
    }),
    court2.stage('T_02K', {
      title: 'Tanık kürsüden iner',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'melek',
      lines: [
        W(
          flag('contra_m2'),
          `
baskan: Tanığın dinlenmesi tamamlandı. Yerinize geçebilirsiniz.
> Melek kürsüden indi. Çantasını unuttu; mübaşir arkasından getirdi. Dinleyici sırasına oturmadı; kapının yanında, ayakta kaldı.
> Arka sıradaki gri takımlı adam ona bakmadı. Melek de ona bakmadı. Aradaki boşluk, salonun bütün sandalyelerinden daha çok yer kaplıyordu.
savci: Sayın Başkan, tanığın beyanı karşısında müdür yardımcısının yeniden dinlenmesini talep ediyorum.
baskan: Zaten çağrılı. Tanık Ercan Tunalı dinlenecek.
~ Melek bir zarfın hikâyesini anlattı. Şimdi o zarfı toplayan adam kürsüye gelecek.
`,
        ),
        W(
          any(flag('contra_m3'), flag('m4_teyit')),
          `
baskan: Tanığın dinlenmesi tamamlandı. Yerinize geçebilirsiniz.
> Melek kürsüden indi, çantasını iki eliyle göğsüne bastırarak oturdu. Kayıtlar onun söylediklerinin bir kısmını düzeltti, bir kısmını doğruladı. Zarf konusunda hâlâ susuyordu.
~ Bir tanığın yarısı. Öbür yarısı korkunun içinde kaldı.
`,
        ),
        O(`
baskan: Tanığın dinlenmesi tamamlandı. Yerinize geçebilirsiniz.
> Melek kürsüden indi. Kimseye bakmadan oturdu. Sakızını çantasından çıkardı, ağzına attı, çiğnemedi.
`),
      ],
      choices: [cont('T02K_DEVAM', 'Devam', 'T_03', { role: 'PRIMARY' })],
    }),
    court2.stage('T_03', {
      title: 'Tanık Ercan Tunalı',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'ercan',
      lines: [
        W(
          flag('suc_duyurusu'),
          `
mubasir: Tanık Ercan Tunalı!
> Ercan kürsüye yürüdü. Ceketinin düğmesini ilikledi. Avukatı dinleyici sırasının en önüne oturdu.
baskan: Tanık, hakkınızda Başsavcılıkta bu dosyayla bağlantılı bir soruşturma bulunduğu anlaşıldığından yemin ettirilmeyecek. Kendinizi suçlayacak sorulara cevap vermekten çekinebilirsiniz.
ercan: Anladım efendim.
~ Yeminsiz bir tanık. Susma hakkı olan bir tanık. Leyla’nın sesi: “Susarsa, susmasını zorlama. Bir salon sessizliği duyar.”
`,
        ),
        O(`
mubasir: Tanık Ercan Tunalı!
> Ercan yeniden kürsüye çağrıldı. Bir ay önceki yemini hatırlatıldı. Dolma kalemi bu kez cebindeydi; ucunu parmağıyla yokladı.
baskan: Tanık, yeminli olarak dinlendiğinizi hatırlatırım. Müdafiin ek soruları var.
`),
      ],
      choices: [cont('T03_DEVAM', 'Sorulara geç', 'T_03T', { role: 'PRIMARY' })],
    }),
    court2.testimony('T_03T', {
      title: 'Ercan Tunalı · ikinci kez',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'ercan',
      witnessLabel: 'TANIK · ERCAN TUNALI',
      rulesText: 'İpucu: dört cümle, dört kapı. Kâğıtlarını doğru cümlede aç.',
      objectionGrounds: ['g_telkin', 'g_kanaat', 'g_duyum'],
      say: T(`
ercan: Efendim, bir ay önce bildiklerimi söyledim. Bugün de aynısını söyleyeceğim. Kâğıt neyse odur.
`),
      statements: [
        statement('R1', 1, [
          hl('Mesai bitince çıkardım; altıyı hiç geçmezdi', any(flag('press_r1'), has('clue_ercan_cikis'))),
          '.',
        ]),
        statement('R2', 2, [
          hl('Kasa odasına akşamları girmem', any(flag('press_r2'), has('clue_kod02'))),
          '; kasanın şifresini müdürümüz bilir.',
        ]),
        statement('R3', 3, [
          hl(
            'Kimsenin şifresini istemedim; kimsenin şifresini sıfırlatmadım',
            any(flag('press_r3'), has('clue_ticket'), has('clue_zarf_uv'), flag('contra_m2')),
          ),
          '.',
        ]),
        statement(
          'R4',
          4,
          ['Ben yalnızca ', hl('usulü uyguladım', has('ded_sahte_tutanak')), ' efendim.'],
          any(flag('contra_r1'), flag('contra_r2'), flag('contra_r3')),
        ),
      ],
      rules: [
        pressRule('PR_R1', 'R1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_r1')],
          responses: B(`
- Hiç mi geçmezdi? İptal günlerinde de mi?
ercan: Hatırladığım kadarıyla efendim. Ailem bekler. Altıda evdeyim, yedide yemek.
`),
        }),
        pressRule('PR_R2', 'R2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_r2')],
          responses: B(`
- Kasa teslimini siz alıyordunuz. Torbaları kasaya nasıl koyuyordunuz?
ercan: Ön odadaki kapıdan efendim. Sabah vezne sorumlusu açar, akşam… akşam torbaları kapının önüne bırakırdım, sabah içeri alınırdı.
uye: Mühürlü torbaları gece boyunca kapının önünde mi bırakırdınız tanık?
ercan: Ön oda kilitlidir efendim.
`),
        }),
        pressRule('PR_R3', 'R3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_r3')],
          responses: B(`
- Hiçbir veznedarın şifresi için bilgi işlemi aramadınız mı?
ercan: Aramadım efendim. Neden arayayım? Şifre kişiye özeldir.
`),
        }),
        presentRule('PS_R1', 'R1', ['ev_pdks_mud', 'ded_kasa'], {
          enabledWhen: any(has('clue_ercan_cikis'), has('ded_kasa')),
          score: { SORGULAMA: 300 },
          effects: [raise('contra_r1'), inc('pers', 2)],
          good: 'Müdürlük turnike kayıtları: iptal günlerinde tanık 18.15–18.40 arasında çıkmış; iptal saatlerinde binada kalan tek müdürlük personeli o.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, Mali Hizmetler personelinin turnike kayıtları. İptal günlerinin yirmi üçünde de tanık 18.15 ile 18.40 arasında çıkmış. İptaller 17.38 ile 17.56 arasında.
- Tanık, o saatlerde müdürlükte sizden başka kim vardı?
> Ercan kâğıda baktı. Bir muhasebecinin bir tabloya baktığı gibi; ama bu kez biraz daha uzun.
ercan: Yoğun günlerdi efendim. Yanlış hatırlamışım. Yıl sonu kapanışı.
uye: Yirmi üç gün mü yıl sonu kapanışıydı tanık?
ercan: …
`),
        }),
        presentRule('PS_R2', 'R2', ['ev_kasa', 'ded_kasa'], {
          enabledWhen: any(has('clue_kod02'), has('ded_kasa')),
          score: { SORGULAMA: 300 },
          effects: [
            raise('contra_r2'),
            inc('pers', 2),
            ifThen(all(flag('suc_duyurusu'), flag('contra_r3')), [
              raise('ercan_sustu'),
              { type: 'GOTO', node: 'T_03S' },
            ]),
          ],
          good: 'Kasa alarm paneli: iptal akşamlarının hepsinde, iptallerden dakikalar sonra kasa odası 02 koduyla açılmış; 02 müdür yardımcılığına tanımlı. Müdürün kodu hiç kullanılmamış.',
          category: 'SORGULAMA',
          responses: [
            W(
              flag('suc_duyurusu'),
              `
- Sayın Başkan, kasa odasının alarm kayıtları. İptal günlerinin hepsinde, iptallerden birkaç dakika sonra kasa odası açılmış. Kod 02. Ekteki listeye göre müdür yardımcılığı.
- Müdürün kodu, 01, ocak ve şubatta hiç kullanılmamış. Müdür raporluydu.
> Ercan’ın avukatı ayağa kalktı, sonra yeniden oturdu. Ercan ona bakmadı.
ercan: Bu soruya… avukatımla görüşmeden cevap vermek istemiyorum efendim.
`,
            ),
            O(`
- Sayın Başkan, kasa odasının alarm kayıtları. İptal günlerinin hepsinde, iptallerden birkaç dakika sonra kasa odası açılmış. Kod 02. Ekteki listeye göre müdür yardımcılığı.
ercan: Kod paylaşılmış olabilir efendim. Bilmiyorum. Ben girmedim. Hatırlamıyorum.
baskan: Tanık, yeminli olduğunuzu hatırlatırım.
ercan: Hatırlamıyorum efendim.
~ Yeminli bir tanık “hatırlamıyorum” diyor. Bu bir yalan mı, bir kapı mı? Bunu heyet tartacak.
`),
          ],
        }),
        presentRule('PS_R3', 'R3', ['ev_ticket', 'ded_sifre', 'ev_zarflar'], {
          enabledWhen: any(has('clue_ticket'), has('ded_sifre'), has('clue_zarf_uv')),
          score: { SORGULAMA: 300 },
          effects: [
            raise('contra_r3'),
            inc('pers', 2),
            ifThen(all(flag('suc_duyurusu'), flag('contra_r2')), [
              raise('ercan_sustu'),
              { type: 'GOTO', node: 'T_03S' },
            ]),
          ],
          good: 'Destek talebi kaydı: 14 Ocak 17.20’de sanığın şifresinin sıfırlanmasını isteyen kullanıcı müdür yardımcısı; geçici şifre 17.31’de verilmiş, 17.44’te iptal yapılmış. Zarf da açılıp kapatılmış.',
          category: 'SORGULAMA',
          responses: [
            W(
              flag('suc_duyurusu'),
              `
- Sayın Başkan, bilgi işlemin destek kaydı. 14 Ocak 17.20: “okilic kilitlendi, acil sıfırlayın.” Talep eden kullanıcı: E. TUNALI, dahili 214. Geçici şifre 17.31’de telefonla verilmiş.
- 17.44’te okilic kullanıcısıyla bir iptal.
- Ertesi sabah sanık kendi şifresinin çalışmadığını bildirmiş.
> Ercan dolma kalemini cebinden çıkardı. Kapağını açtı. Kapattı. Tık.
ercan: Bu konuda… cevap vermekten çekiniyorum.
`,
            ),
            O(`
- Sayın Başkan, bilgi işlemin destek kaydı. 14 Ocak 17.20: “okilic kilitlendi, acil sıfırlayın.” Talep eden kullanıcı: E. TUNALI, dahili 214.
ercan: Kullanıcım başkası tarafından kullanılmış olabilir efendim. Ben öyle bir talep açtığımı hatırlamıyorum.
uye: Sizin kullanıcınız da mı zarftaydı tanık?
ercan: Hayır efendim.
~ Bir zarfı inkâr eden adam, şimdi kendi şifresinin başkasında olabileceğini söylüyor. Kendi cümleleri birbirine çarptı; kimse itmedi.
`),
          ],
        }),
        presentRule('PS_R4', 'R4', ['ded_sahte_tutanak'], {
          score: { SORGULAMA: 200 },
          effects: [raise('contra_r4'), inc('pers')],
          good: 'Teslim tutanaklarının asılları, raporun ikinci basımıyla ve sanığın fotokopi imzasıyla hazırlanmış; “usul” kâğıt üstünde kurulmuş.',
          category: 'SORGULAMA',
          responses: B(`
- Usul. Sayın Başkan, dosyadaki asıl tutanaklara ekli gün sonu raporları 17.56’da basılmış; sanığın nüshasındakiler 16.58’de. Asıllardaki sanık imzası mürekkep değil, toner.
- Tanık, bu tutanakları teslim anında imzaladığınızı söylemiştiniz. Sanık 17.09’da binadan çıkmıştı. Siz kime imzalattınız?
> Ercan cevap vermedi. Kalemi masanın üstüne koydu; yavaşça, sesini çıkarmadan.
`),
        }),
        presentRule('PS_R_BILIRKISI', undefined, ['ev_bilirkisi'], {
          score: { SORGULAMA: 50 },
          neutral:
            'Bilirkişi raporu sistemin açığını anlatır; tanığın hangi cümlesini çürüttüğünü göstermedikçe çelişki doğurmaz.',
          responses: B(`
ercan: Teknik konular efendim. Ben maliyeciyim. Bilirkişi hanım ne diyorsa.
`),
        }),
        presentRule('PS_R_SAVCILIK', undefined, ['ev_teftis', 'ev_tutanak', 'ev_banka', 'ev_ercan_ifade', 'ev_dokum'], {
          maxUses: 10,
          effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
          bad: 'Savcılığın delilini tanığa okudun; hiçbir çelişki ortaya koymadı. −1 güvenilirlik, −150 skor.',
          category: 'SORGULAMA',
          responses: B(`
ercan: Evet efendim. Dosyada olan belgeler. Kâğıt neyse odur.
~ Kâğıt neyse odur. Ve ben ona kendi kâğıdını verdim.
`),
        }),
      ],
      presentMiss: fallback('FB_R_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil: −1 güvenilirlik, −150 skor.', category: 'SORGULAMA' },
        responses: B(`
baskan: Bu delilin beyanla ilgisini göremedim müdafi.
`),
      }),
      objectMiss: fallback('FB_R_OBJECT', 'OBJECT', {
        effects: [dec('cred'), inc('wrong'), score('SORGULAMA', -50, 'hatali')],
        quality: { q: 'BAD', feedback: 'Dayanaksız itiraz.', category: 'SORGULAMA' },
        responses: B(`
baskan: İtiraz reddedildi. Dayanağı yok.
`),
      }),
      finish: { id: 'T03T_BITIR', next: 'T_03K' },
    }),
    court2.stage('T_03K', {
      title: 'Tanık kürsüden iner',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'ercan',
      lines: [
        W(
          atLeast(2, flag('contra_r1'), flag('contra_r2'), flag('contra_r3'), flag('contra_r4')),
          `
baskan: Tanığın dinlenmesi tamamlandı.
> Ercan kürsüden indi. Ceketinin düğmesini çözmedi. Dinleyici sırasına yürürken Orhan’ın önünden geçti; bu kez başıyla selam vermedi. Orhan da vermedi.
uye: Sayın Başkan, tanığın beyanlarıyla kasa, turnike ve destek kayıtları arasındaki çelişkilerin tutanağa ayrıntılı geçirilmesini istiyorum.
baskan: Geçirildi.
savci: Sayın Başkan, tutanağın bir örneğinin değerlendirilmek üzere Başsavcılığa gönderilmesini talep ediyorum.
~ Bir yeminli tanık dört kez “hatırlamıyorum” dedi. Her biri bir kâğıdın karşısında. Bu dosyada hafızanın da bir saati var.
`,
        ),
        O(`
baskan: Tanığın dinlenmesi tamamlandı.
> Ercan kürsüden indi, Orhan’a başıyla selam verdi, yerine oturdu. Dolma kalemini cebine koydu. Yüzü sakindi; bir ay önceki gibi.
~ Kibar bir tanık, eksik kâğıtlar. Bir kapıyı aralayabildim; açamadım.
`),
      ],
      choices: [cont('T03K_DEVAM', 'Devam', 'T_04G', { role: 'PRIMARY' })],
    }),
    court2.stage('T_03S', {
      title: 'Sessizlik',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'ercan',
      lines: B(`
> Ercan Tunalı dolma kalemini kürsünün tahtasına koydu. Kapağı kapalıydı. Ellerini kalemin iki yanına, düz, yerleştirdi.
ercan: Sayın Başkan. Bundan sonraki sorulara cevap vermekten çekiniyorum.
> Salon sustu. Kâtibin klavyesi durdu. Kalorifer peteği bile bir an tıkırdamadı; ya da öyle geldi.
> Dinleyici sırasında Melek ellerini ağzına götürdü. Hayri Bey ayakkabı kutusunun kapağını kapattı. Orhan gözlüğünü çıkardı ve bu kez takmadı.
baskan: Tutanağa geçsin: tanık, kendisini suçlayabilecek sorulara cevap vermekten çekinme hakkını kullandı.
savci: Sayın Başkan, tanık hakkındaki soruşturma dosyasıyla bağlantının kurulması için tutanağın bir örneğinin Başsavcılığa gönderilmesini talep ediyorum.
~ Hiç ağlamadı. Hiç bağırmadı. Yalnızca sustu. Bir müdür yardımcısının sesinden geriye bir kalem kaldı; kapağı kapalı, kürsünün ortasında.
`),
      choices: [cont('T03S_DEVAM', 'Devam', 'T_04G', { role: 'PRIMARY' })],
    }),
    decisionNode('T_04G', [
      { when: any(flag('orhan_zarf_acik'), flag('contra_m2'), flag('contra_e3')), to: 'T_04' },
      { to: 'T_05' },
    ]),
    court2.objection('T_04', {
      title: 'Nitelendirme uyarısı',
      courtStage: 'EK_SAVUNMA',
      background: 'durusma_salonu',
      onEnter: [raise('nitel_uyari')],
      say: T(`
baskan: Sanığa ve müdafiine hatırlatılır: sanığın şifresini, kurum yönergesine aykırı olarak zarf içinde müdürlüğe teslim ettiği anlaşılmıştır.
baskan: Bu durumda eylemin ihmal suretiyle görevi kötüye kullanma suçunu oluşturma ihtimali bulunmaktadır.
baskan: Bu yönden ek savunma hakkınız vardır. Müdafi, diyeceğiniz?
~ Leyla’nın sesi: “Zarf verdi, para almadı” ile “zarf verdi, zarar doğdu” aynı cümle değildir.
`),
      next: 'T_05',
      options: [
        option('T04_A', '“Ek savunma için süre istiyoruz.”', {
          score: { USUL_BILGISI: 80 },
          effects: [raise('ek_sure'), inc('legal_hits')],
          good: 'Nitelendirme değişikliği uyarısı üzerine ek savunma için süre istemek kanuni haktır (CMK 226/1, 3).',
          category: 'USUL_BILGISI',
          responses: B(`
- Sayın Başkan, uyarı üzerine ek savunma için süre talep ediyoruz.
baskan: Kırk beş dakika ara verildi.
# ADLİYE KORİDORU · ARA [bg:adliye]
> Koridorun sonunda Orhan’la oturduk. Bir kâğıda üç satır yazdım: talimat, zarar, bağ.
orhan: Ben ihmal ettim efendim. Biliyorum. Ama ben ihmal ettim diye kasadan para çıkmadı. Para kasadan bir elle çıktı.
- Bunu salonda böyle söyleyeceğiz. Sizin cümlenizle.
# SALON [bg:durusma_salonu]
- Sayın Başkan, sanık şifresini amirinin yazılı talimatıyla verdi. Zarar, sanığın ihmalinden değil, şifreye erişen kişinin kasıtlı eyleminden doğdu. İhmal ile zarar arasındaki bağ, başkasının fiiliyle kesilmiştir.
`),
        }),
        option('T04_B', '“Hazırız; ek savunmamızı şimdi yapıyoruz.”', {
          score: { USUL_BILGISI: 60 },
          effects: [inc('legal_hits')],
          good: 'Ek savunmayı hemen yapmak da meşrudur; önemli olan sanığın uyarıdan haberdar edilmesi ve savunma hakkını kullanmasıdır (CMK 226).',
          category: 'USUL_BILGISI',
          responses: B(`
- Hazırız Sayın Başkan. Sanık şifresini amirinin yazılı talimatıyla verdi. Bu, yönergeye aykırı bir disiplin kusurudur; ama zarar sanığın ihmalinden değil, şifreye erişen kişinin kasıtlı eyleminden doğmuştur.
orhan: Ben ihmal ettim Sayın Başkan. Biliyorum. Ama ben ihmal ettim diye kasadan para çıkmadı. Para kasadan bir elle çıktı.
`),
        }),
        option('T04_C', '“Uyarıya itiraz ediyoruz; iddianamede yok.”', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred'), inc('wrong')],
          bad: 'Mahkeme, sanığı önceden haberdar ederek eylemin hukuki niteliğini değiştirebilir; uyarı tam da bunun için yapılır (CMK 226). İtirazın dayanağı yok.',
          category: 'USUL_BILGISI',
          responses: B(`
baskan: Uyarı, sanığın savunma hakkını güvenceye almak içindir müdafi. İtirazınız yerinde değil. Ek savunma hakkınızı kullanacak mısınız?
- Kullanmıyoruz.
~ Bir hakkı itiraz sandım. Hak kapıda bekledi; ben içeri almadım.
`),
        }),
        option('T04_D', '“Kabul ediyoruz; sanık ihmalini ikrar ediyor.”', {
          effects: [raise('ihmal_kabul')],
          neutral:
            'Şifreyi verdiğini sanık zaten söyledi; ama ihmali “ikrar” etmek, zararla bağ kurulmasını kolaylaştırır. Ek savunmanın asıl konusu o bağdı.',
          responses: B(`
- Sanık şifresini verdiğini kabul ediyor Sayın Başkan. İhmalini ikrar ediyor.
> Savcı bir şey yazdı. Orhan bana baktı; bir şey sormadı.
~ Bir gerçeği teslim ettim. Teslim ederken, arkasındaki soruyu da teslim ettim: o ihmalden zarar doğdu mu?
`),
        }),
      ],
    }),
    court2.stage('T_05', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      background: 'durusma_salonu',
      lines: [
        W(
          ref('mutalaa_b'),
          `
baskan: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
savci: Sayın Başkan, kasa alarm kayıtları, turnike kayıtları, destek talebi kaydı ve tutanakların sonradan düzenlendiğine ilişkin bulgular dosyadadır.
savci: Bunlar tanığın çekinmesiyle birlikte değerlendirildiğinde, iptallerin ve zimmetin sanık tarafından gerçekleştirilmediği sabittir.
savci: Sanığın CMK 223/2-b uyarınca beraatine; tanık Ercan Tunalı hakkında zimmet ve resmî belgede sahtecilik suçlarından yürütülen soruşturmaya duruşma tutanaklarının eklenmesine karar verilmesini talep ederim.
> Savcı oturdu. Bana bakmadı. Sonra baktı; bir saniyeliğine, başını hafifçe eğerek.
~ Rakamlarla konuşan bir savcı. Bugün rakamlar ona doğruyu söyledi; o da söyledi.
`,
        ),
        W(
          ref('mutalaa_e'),
          `
baskan: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
savci: Sayın Başkan, iptallerin sanığın binadan çıkmasından sonra ve vezne terminalinden değil, ortak kullanıma açık bir bilgisayardan yapıldığı anlaşılmıştır.
savci: Sanığın kullanıcı adı başkalarınca kullanılabilir durumdadır.
savci: Bu kuşku giderilememiştir. Sanığın CMK 223/2-e uyarınca beraatine; iptalleri yapan kişi ya da kişiler yönünden suç duyurusunda bulunulmasına karar verilmesini talep ederim.
~ Bir savcının beraat istemesi bir zafer değildir. Bir savcının işini yapmasıdır.
`,
        ),
        W(
          flag('nitel_uyari'),
          `
baskan: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
savci: Sayın Başkan, zimmet suçunun sanık tarafından işlendiği yönünde kuşku oluşmuştur. Ancak sanık, şifresini yönergeye aykırı olarak paylaşmış ve kamu zararının doğmasına imkân vermiştir.
savci: Eylemi TCK 257/2 kapsamında ihmal suretiyle görevi kötüye kullanma olarak değerlendiriyor; sanığın bu suçtan cezalandırılmasını talep ediyorum.
~ Zimmet düştü; bir zarf kaldı. Savcı o zarfın bedelini istiyor.
`,
        ),
        O(`
baskan: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
savci: Sayın Başkan, iptaller sanığın kullanıcı adıyla yapılmış, teslim tutanakları sanığın imzasını taşımakta, teftiş raporu sorumluluğu sanığa yüklemektedir. Sanığın borç durumu da dosyadadır.
savci: Sanığın TCK 247/1-2 ve 43 uyarınca cezalandırılmasına; TCK 53’ün uygulanmasına; kamu zararının tahsiline karar verilmesini talep ederim.
~ Kâğıt neyse odur. Savcı kâğıdı okudu; iki sütununu.
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
baskan: Müdafi, esas hakkındaki savunmanız.
~ Üç dayanak. Leyla’nın sesi: kim, ne zaman, kimin elinde. Her biri dosyada bir kâğıda dayanmalı.
`),
      choices: [
        dayanak(
          'P_BASKASI',
          'İptaller sanık binadan çıktıktan sonra, başka bir bilgisayardan yapıldı',
          baskasi,
          'arg_baskasi',
          `
- Birincisi: kim ve nerede. Kırk yedi iptalin kırk yedisi, sanık turnikeden çıktıktan sonra, vezne terminalinden değil, ön odadaki ortak bilgisayardan yapıldı. Kullanıcı adı sanığın; el, sanığın değil.
`,
        ),
        dayanak(
          'P_ZILYET',
          'Para, teslimden sonra sanığın gözetiminde değildi',
          any(has('ded_teslim'), flag('contra_e1')),
          'arg_zilyet',
          `
- İkincisi: kimin elinde. Sanık her akşam kasayı eksiksiz saydı ve teslim etti; defteri ve karbon nüshası bunu gösteriyor.
- Teslimden sonra para, teslim alanın koruma ve gözetimindeydi. Zimmetin konusu, sanığın zilyetliğinde değildi.
`,
        ),
        dayanak(
          'P_TUTANAK',
          'Tutanaklar sonradan, fotokopi imzayla düzenlendi',
          any(has('ded_sahte_tutanak'), flag('contra_r4'), flag('bq_yazici')),
          'arg_tutanak',
          `
- Dosyadaki asıl tutanaklar iptallerden sonra basılan raporlarla ve sanığın fotokopi imzasıyla hazırlandı. Savcılığın “hileli davranış” dediği şey var; ama o hileyi yapan el, o saatte binada olan eldir.
`,
        ),
        dayanak(
          'P_ZARF',
          'Kullanıcı adı tek kişiyi göstermiyor; şifreler zarftaydı',
          any(has('ded_zarf'), flag('contra_e3'), flag('contra_m2')),
          'arg_zarf',
          `
- Şifreler, amirlerin yazılı talimatıyla, mühürlü zarflarda müdürlükte tutuldu. Bir kullanıcı adı artık bir kişi değildi; bir zarfın içindeki bir satırdı.
`,
        ),
        dayanak(
          'P_KASA',
          'Kasa her iptal akşamı başka bir kodla açıldı',
          any(has('ded_kasa'), flag('contra_r2')),
          'arg_kasa',
          `
- Kasa odası iptallerden dakikalar sonra, her akşam, sanığa ait olmayan bir kodla açıldı. O kodun sahibi o saatlerde binadaydı; sanık değildi.
`,
        ),
        dayanak(
          'P_IZIN',
          'İzinli olduğu gün bile iptal yapıldı',
          has('ded_izin'),
          'arg_izin',
          `
- 9 Ocak’ta sanık yıllık izinde, kızıyla hastanedeydi. O akşam 17.46’da onun kullanıcısıyla iki iptal yapıldı.
`,
        ),
        dayanak(
          'P_KREDI',
          'Kredinin kaynağı belli',
          any(has('ded_kredi'), flag('contra_e5')),
          'arg_kredi',
          `
- Savcılığın “sebep” dediği kredi, babadan kalan tarlanın satış bedeliyle kapandı; tapu senedi ve havale dosyada.
`,
        ),
        cont('P_BITIR', 'Esas savunmaya geç', 'T_06', {
          role: 'PRIMARY',
          enabledWhen: any(cmp(v('noktalar'), '==', 0), flag('arg_baskasi'), flag('arg_zilyet'), flag('arg_zarf')),
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
~ Dayanaklar söylendi. Şimdi hepsini tek bir talepte toplamam gerekiyor. Heyetin kalemine geçecek tek bir cümle.
`),
      next: 'T_07',
      choices: [
        option('S_MASUMIYET', 'Beraat: iptalleri sanık yapmadı; para teslimden sonra başkasının elindeydi', {
          effects: [
            raise('closing_masumiyet'),
            ifThen(
              atLeast(
                2,
                flag('arg_baskasi'),
                flag('arg_zilyet'),
                flag('arg_tutanak'),
                flag('arg_kasa'),
                flag('arg_izin'),
              ),
              [score('SAVUNMA_STRATEJISI', strategyAmount(200, 'MASUMIYET')), inc('pers')],
              [score('SAVUNMA_STRATEJISI', 60)],
            ),
          ],
          good: 'Delillerle desteklenen beraat talebi: suçun sanık tarafından işlenmediği (CMK 223/2-b), olmazsa işlendiğinin sabit olmadığı (223/2-e).',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Başkan, bu dosyada bir kullanıcı adı yargılandı. Ama bir kullanıcı adı zimmet işleyemez; zimmeti bir el işler. O el, sanık binadan çıktıktan sonra, başka bir odada, başka bir bilgisayarın başındaydı.
- Para, sanığın elinden eksiksiz çıktı. Eksilme, paranın başkasının koruması altında olduğu saatlerde doğdu. Zilyetlik sanıkta değildi.
- Müvekkilimin suçu işlemediğinin sabit olduğu kanaatindeyiz; en azından işlediği sabit değildir. Beraatini talep ediyoruz.
`),
        }),
        option('S_USUL', 'Beraat: teftiş raporu ve kullanıcı adı sanığı göstermiyor; kuşku sanık lehine', {
          effects: [
            raise('closing_usul'),
            ifThen(
              any(flag('arg_baskasi'), flag('arg_zarf'), has('ev_bilirkisi')),
              [score('SAVUNMA_STRATEJISI', strategyAmount(200, 'USUL')), inc('pers')],
              [score('SAVUNMA_STRATEJISI', 40)],
            ),
          ],
          good: 'İdari raporun ve tek başına kullanıcı adının mahkûmiyete yetmeyeceğini savundun; giderilemeyen kuşku sanık lehinedir (CMK 223/2-e; Anayasa 38/4).',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Başkan, savcılığın davası bir idari raporun iki sütununa dayanıyor: kullanıcı ve tutar. Bilirkişi incelemesi bu iki sütunun kişi göstermediğini ortaya koydu.
- Şifreler zarftaydı; sistem herkese açıktı; iptaller sanık binadayken yapılmadı. Bu kuşkular giderilemez. Giderilemeyen kuşku sanık lehinedir.
- Müvekkilimin CMK 223/2-e uyarınca beraatini talep ediyoruz.
`),
        }),
        option('S_TERDIT', 'Önce beraat; olmazsa zimmet değil, en fazla ihmal', {
          effects: [raise('closing_terdit'), score('SAVUNMA_STRATEJISI', strategyAmount(150, 'INDIRIM'))],
          good: 'Terditli savunma: önce beraat; mahkeme aksi kanaatteyse eylemin zimmet değil, ihmali görevi kötüye kullanma (TCK 257/2) olarak nitelendirilmesi ve lehe hükümler.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Başkan, öncelikle müvekkilimin beraatini talep ediyoruz.
- Mahkeme aksi kanaatteyse: sanık parayı almamıştır; şifresini amirinin talimatıyla vermiştir. Bu en fazla ihmal suretiyle görevi kötüye kullanmadır.
- Alt sınırdan ceza, takdiri indirim ve hükmün açıklanmasının geri bırakılmasını talep ediyoruz.
~ Bir yandan “yapmadı” diyorum, öbür yandan “yaptıysa da ihmal.” Hukuk bunu ister. Orhan’ın gözlüğünün arkasındaki gözler istemiyor.
`),
        }),
        option('S_DUYGU', 'On dokuz yıllık memuriyete ve kızının kalbine seslen', {
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('pers')],
          bad: 'Esas savunma delil tartışmasıdır; duygusal çağrı heyeti ikna etmez.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Başkan, on dokuz yıl. Bir kızın ameliyatı. Bir babanın defteri…
baskan: Müdafi, esas hakkında.
~ Elif’in “iki kere say” mesajını da kullanacaktım. Kullanmadım. Yine de utandım.
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
baskan: Sanık, ayağa kalkın. Hükümden önce son sözünüz nedir?
> Orhan ayağa kalktı. Bana baktı. Ne söyleyeceğini bilmiyordum; bilmemem gerekiyordu.
~ Son söz. Kanun onu sanığa verir, avukata değil. Burada benim işim bitiyor.
`),
      next: 'T_08',
      choices: [
        option('L_HESAP', '“Kırk yedi makbuz. Hiçbirini ben iptal etmedim. Ama şifremi verdim.”', {
          score: { SAVUNMA_STRATEJISI: 50 },
          effects: [inc('pers'), raise('son_hesap')],
          good: 'Sanığın kendi sesiyle, hatasını saklamadan ve kimseyi suçlamadan kurduğu bir son söz.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
orhan: Kırk yedi makbuz Sayın Başkan. Üç yüz seksen altı bin dört yüz lira. Hiçbirini ben iptal etmedim. Bir kuruşunu almadım.
orhan: Ama şifremi verdim. Bile bile. Amirim istedi, verdim. Onun hesabını veririm. Kuruşu kuruşuna.
> Oturmadı. Hüküm ayakta dinlenir; o, hükümden önce de ayakta kaldı.
`),
        }),
        option('L_SESSIZ', '“Söyleyeceğim bir şey yok.”', {
          neutral: 'Son söz hakkı; susmak da bir hak.',
          responses: B(`
orhan: Söyleyeceğim bir şey yok Sayın Başkan. Avukatım söyledi.
> Söylememiştim. Ama söylemiş gibi oldu.
`),
        }),
        option('L_KIZIM', '“Kızım bana ‘iki kere say’ dedi. Saydım.”', {
          neutral: 'İçten bir son söz; ama delil değil.',
          responses: B(`
orhan: Kızım bu sabah bana “baba, iki kere say” diye yazdı Sayın Başkan. Saydım. Her akşam iki kere saydım. Ben sayarken kimse bana bakmadı. Şimdi herkes bakıyor.
> Nazan dinleyici sırasında başını eğdi.
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
          `
> Heyet müzakereye çekildi. Bir saat. Salondan çıkan kimse geri dönmedi; ben yerimden kalkmadım.
mubasir: Taraflar salona! Hükmü ayakta dinleyin!
`,
        ),
        W(
          all(flag('son_hesap'), any(flag('closing_masumiyet'), flag('closing_usul'))),
          `
> Heyet müzakereye çekildi. Kırk dakika. Orhan’ın son sözü salonda kalmıştı: “Şifremi verdim. Onun hesabını veririm.”
> Koridorda Nazan iğnelerini yakasından tek tek çıkarıp bir kutuya koydu. Hayri Bey ayakkabı kutusunun kapağını açtı, bir makbuzun yerini düzeltti, kapattı.
> Melek kapının yanında duruyordu. Orhan ona bir çay uzattı; makineden, plastik bardakta. Melek aldı, içmedi, elinde tuttu.
mubasir: Taraflar salona! Hükmü ayakta dinleyin!
~ Hüküm ayakta dinlenir. Orhan zaten ayaktaydı; son sözünden beri oturmamıştı.
`,
        ),
        W(
          all(flag('closing_terdit'), flag('ek_sure')),
          `
> Heyet müzakereye çekildi. Bir saat. Terditli bir savunma heyete iki kapı gösterir; hangisinden geçeceğine heyet karar verir.
mubasir: Taraflar salona! Hükmü ayakta dinleyin!
`,
        ),
        W(
          flag('ikrar_yolu'),
          `
> Heyet müzakereye çekildi. Yirmi dakika. Kısa bir müzakere; kabul edilmiş bir suçun müzakeresi kısa sürer.
mubasir: Taraflar salona! Hükmü ayakta dinleyin!
`,
        ),
        O(`
> Heyet müzakereye çekildi. Kırk dakika. Koridorda Nazan’ın iğneleri, Hayri Bey’in kutusu, Melek’in kapalı telefonu.
> Orhan pencereye gitti. Aşağıda belediye otobüsü durağa yanaştı; kapısı açıldı, kimse inmedi, kapandı.
mubasir: Taraflar salona! Hükmü ayakta dinleyin!
~ Hüküm ayakta dinlenir. Kanun böyle der. Ayakta durmak, düşmeye hazır olmaktır belki.
`),
      ],
    }),
    court2.stage('T_IKRAR', {
      title: 'İkrar',
      courtStage: 'SANIK_SAVUNMASI',
      background: 'durusma_salonu',
      lines: B(`
baskan: Sanık, ek savunmanız var mı?
> Orhan ayağa kalktı. Elinde bir dekont; banka kaşeli, belediyenin hesabına, üç yüz seksen altı bin dört yüz lira.
orhan: Zararın tamamını ödedim Sayın Başkan. Dekontu sunuyorum. Ve… kabul ediyorum.
> Sesi düzdü. Rakamları söylemedi; ilk kez.
savci: Sayın Başkan, sanık ilk celsede eylemi inkâr etmişti. Bugün kabul ediyor.
uye: Sanık, iptalleri nasıl yaptığınızı anlatır mısınız? Hangi bilgisayardan?
orhan: Ben… Kabul ediyorum Sayın Hâkim. Başka bir şey söylemeyeceğim.
> Üye hâkim kalemini bıraktı. Dosyada bir sayfayı çevirdi: bilirkişi raporu ya da turnike dökümü, bilmiyorum. Bir şey okudu. Bana baktı.
~ Bir adam yapmadığı bir şeyi kabul ediyor. Nasıl yaptığını bile bilmiyor. Ben de bunu biliyorum.
`),
      choices: [cont('TIKRAR_DEVAM', 'Mütalaa', 'T_IKRAR_M', { role: 'PRIMARY' })],
    }),
    choiceNode('T_IKRAR_M', {
      ...H2,
      title: 'Mütalaa ve savunma',

      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
savci: Sayın Başkan, sanığın ikrarı ve zararın hükümden önce tamamen giderilmesi gözetilerek TCK 247/1-2, 43 ve 248/3 uyarınca cezalandırılmasını talep ederim.
baskan: Müdafi, esas hakkındaki savunmanız.
`),
      next: 'T_IKRAR_S',
      choices: [
        option('IK_A', 'Etkin pişmanlık ve takdiri indirim istiyoruz', {
          neutral: 'Kurduğun yolun sonunu istedin: TCK 248/3 ve 62/1.',
          responses: B(`
- Sayın Başkan, sanık zararın tamamını hükümden önce gönüllü olarak gidermiştir. TCK 248/3 ve 62/1’in uygulanmasını talep ediyoruz.
~ Kendi cümlemi okudum. Kendi cümlemden hiç bu kadar utanmamıştım.
`),
        }),
        option('IK_B', 'Yine de beraat istiyoruz; kayıtlar sanığı göstermiyor', {
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('pers')],
          bad: 'Müvekkilin ikrarıyla çelişen bir talep; heyet iki savunmadan hiçbirine inanmaz.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Başkan, kayıtlar sanığı göstermiyor; beraatini talep ediyoruz.
savci: Müvekkiliniz az önce kabul etti avukat hanım.
~ Bir kapıyı ben kapattım. Şimdi o kapıyı yumrukluyorum.
`),
        }),
      ],
    }),
    story('T_IKRAR_S', {
      ...H2,
      title: 'Son söz',
      background: 'durusma_salonu',
      lines: B(`
baskan: Sanık, son sözünüz?
orhan: Ödedim Sayın Başkan. Kabul ettim. Avukatım böyle dedi.
> Oturdu. Gözlüğünü çıkardı; silmedi, takmadı. Elinde tuttu.
`),
      choices: [cont('TIKRAR_S_DEVAM', 'Hüküm', 'T_08', { role: 'PRIMARY' })],
    }),
    story('T_COKUS', {
      ...H2,
      title: 'Çöküş',
      background: 'durusma_salonu',
      lines: B(`
> Bir yanlış daha. Başkan kalemini bıraktı. Üye hâkim dosyayı kapattı. Savcı bana bakmadı bile; bakmasına gerek yoktu.
baskan: Müdafi, sunduklarınızın dosyayla ilgisi kalmadı. Mahkeme yeterince dinledi. Tarafların son beyanları alındı kabul edilerek hüküm için ara verilecek.
~ Güvenimi tek tek harcadım. Her yanlış kâğıt bir kalp götürdü. Şimdi kalbim yok; yalnızca bir dosyam var ve kırk yedi satır.
`),
      choices: [cont('COKUS_DEVAM', 'Hüküm', 'T_08', { role: 'PRIMARY' })],
    }),
    resultNode('R_KARAR', { ...H2, title: 'Karar', background: 'durusma_salonu' }),
  ],
};
