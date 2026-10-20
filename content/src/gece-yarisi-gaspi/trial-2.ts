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
import type { CasePart, Cond } from '../../../tools/content/src/kit/index.js';
import { B, O, T, W } from './dsl.js';
import { H2, T_DERIN, court2, wrongMove } from './shared.js';

// 68-trial-2: 2. celse. Koridor, açılış (yeni gelişme ya da etik ihlali), HızlıPaket kayıtlarının tartışılması,
// Ferhat Oral’ın tanıklığı (F1–F5), Kadir Usta ve savcının karşı sorusu, Gamze, mütalaa, dayanaklar, esas savunma,
// son söz, hüküm.

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
elif: Müdafi, bu dayanağı dosyada hangi delil destekliyor?
`),
    ],
    next: '$stay',
  });

export const trial2: CasePart = {
  predicates: [
    {
      id: 'teshis_coktu',
      label: 'Teşhisin kirlendiği ya da ilk tarifin sanığa uymadığı gösterildi',
      when: any(
        flag('contra_n3'),
        flag('contra_f2'),
        all(flag('contra_n4'), flag('contra_n5')),
        all(flag('contra_f1'), flag('contra_f3')),
      ),
    },
    {
      id: 'hesap_curudu',
      label: 'Konum kaydı cevaplandı: hesabı o gece başka bir telefon ya da başka bir yüz taşıyordu (kayıtlarla bağlanmış)',
      when: any(has('ded_hesap'), has('ded_baskasi')),
    },
    {
      id: 'mazeret_var',
      label: 'Olay saatinde evde olduğu bağımsız kayıtla destekleniyor (yönlendirilmiş tanık sayılmaz)',
      when: any(all(has('ded_mazeret'), not(flag('kadir_kocluk'))), has('ded_evde')),
    },
    {
      id: 'halka_var',
      label: 'İlk tarifteki halka sanığa uymuyor (aynı 112 beyanı bir kez sayılır)',
      when: any(has('ded_halka'), flag('contra_n5'), flag('contra_f5')),
    },
    {
      id: 'dosya_butun',
      label: 'Savunma dosyası bütün: dokuz çıkarımdan en az yedisi kurulmuş',
      when: atLeast(
        7,
        has('ded_kirlenme'),
        has('ded_usulsuz'),
        has('ded_halka'),
        has('ded_bicak'),
        has('ded_mazeret'),
        has('ded_eski_foto'),
        has('ded_baskasi'),
        has('ded_hesap'),
        has('ded_evde'),
      ),
    },
    {
      id: 'hesap_kayitta',
      label: 'Hesap cevabı duruşma tutanağında: cihaz/mesaj, özçekim/halka ya da kolluk tanığının kabulü',
      when: any(
        all(flag('contra_gps'), has('ded_hesap')),
        all(flag('contra_selfie'), has('ded_baskasi')),
        flag('contra_f7'),
      ),
    },
    {
      id: 'mazeret_kayitta',
      label: 'Mazeret duruşma tutanağında: 186 araması + kesinti, kolluğun araştırmadığını kabulü ya da tanığın kayıtla doğrulanması',
      when: any(
        all(flag('contra_186'), has('ded_evde')),
        all(flag('contra_f6'), ref('mazeret_var')),
        flag('kadir_215'),
      ),
    },
    {
      id: 'beraat_delil',
      label: 'Delil zinciri tam ve tutanakta: teşhis çöktü, konum kaydı cevaplandı, mazeret kayıtla doğrulandı; dosya bütün',
      when: all(ref('teshis_coktu'), ref('hesap_kayitta'), ref('mazeret_kayitta'), ref('dosya_butun')),
    },
    {
      id: 'derin',
      label: `Kayıtlar duruşmada derinlemesine tartışıldı (ham skor en az ${T_DERIN})`,
      when: cmp({ score: 'raw' }, '>=', T_DERIN),
    },
    {
      id: 'mutalaa_beraat',
      label: 'Savcı beraat isteyecek kadar güçlü dosya (delil zinciri + heyetin ikna düzeyi en az 6 + derin tartışma)',
      when: all(ref('beraat_delil'), cmp(v('pers'), '>=', 6), ref('derin')),
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
# ÜÇ HAFTA SONRA · 5 MAYIS 09.15 — BURSA ADLİYESİ [bg:adliye]
> Koridor aynıydı; insanlar değişmişti. Aynı banklar, aynı sigara kokusu, bir başka ağlayan çocuk.
> Pencerenin önünde Ferhat Oral sigara içiyordu; adliyede yasak olduğu hâlde. Beni görünce izmariti pencereden attı. Üniforması ütülüydü, gözleri değildi.
ferhat: Avukat hanım. Bugün ne soracaksınız biliyorum. Ben de ne diyeceğimi biliyorum.
- O zaman ikimiz de hazırız.
> Bir şey söyleyecekti. Sonra mübaşirin sesi koridoru doldurdu ve o, salonun kapısına yürüdü.
`),
    }),
    decisionNode('T_00G_2', [{ to: 'T_00' }], {
      lines: [
        W(
          all(flag('released'), flag('tolga_teslim')),
          `
> Barış ailesiyle birlikte geldi; kelepçesiz, ayakkabıları bağcıklı. Annesinin koluna girmişti. Yüzü bir haftada on yaş yaşlanmıştı.
derya: Tolga dün tutuklandı canım. İkrar etti. Barış bir şey söylemiyor; konuşursa ağlayacak diye.
`,
        ),
        W(
          flag('released'),
          `
> Barış ailesiyle birlikte geldi; kelepçesiz, ayakkabıları bağcıklı. Koridorun öbür ucunda Nermin Hanım’ı görünce durdu, başını eğdi.
`,
        ),
        W(
          flag('tolga_teslim'),
          `
> Derya bankta tek başına oturuyordu. Gözleri şişti. Beni görünce kalktı.
derya: Tolga dün tutuklandı. İkrar etti. Barış’ı jandarma getirecek; ona daha kimse söylemedi mi bilmiyorum.
`,
        ),
        W(
          flag('derya_sus'),
          `
> Derya ve Sevim Hanım aynı bankta. Derya bana başıyla selam verdi; gözlerini kaçırarak. “Sus” dediğim kadın susmaya devam ediyordu.
derya: Tolga’nın telefonu kapalı canım. Bir şey sormadım. Sen öyle dedin.
`,
        ),
        O(`
> Derya ve Sevim Hanım aynı bankta, aynı yerde. Nermin Hanım öbür uçta; kızı yanında, elinde bir termos.
derya: Ne olacak canım? Bugün bitecek mi?
- Bugün bitecek.
`),
      ],
    }),
    court2.stage('T_00', {
      title: 'Duruşma · 2. Celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('etik_kirlik'),
          `
sukru: Barış Kılınç dosyası! Hı-hım.
# BURSA 6. AĞIR CEZA MAHKEMESİ — 2. CELSE [bg:durusma_salonu]
rahmi: Duruşmaya devam olundu. Cumhuriyet savcısı söz istedi.
orhan: Sayın Başkan, mağdur Nermin Aksoy dün Başsavcılığa başvurmuştur. Beyanına göre sanık müdafii evine gelerek kendisine bir fotoğraf göstermiş ve teşhis etmesini istemiştir.
> Salonda bir uğultu. Başkan tokmağa uzandı, vurmadı. Elif Karaca bana baktı; uzun uzun.
`,
        ),
        W(
          flag('tolga_teslim'),
          `
sukru: Barış Kılınç dosyası! Hı-hım.
# BURSA 6. AĞIR CEZA MAHKEMESİ — 2. CELSE [bg:durusma_salonu]
rahmi: Duruşmaya devam olundu. Cumhuriyet savcısı söz istedi.
orhan: Sayın Başkan, dosyaya ilişkin yeni bir gelişme var. Müdafinin bildirimi üzerine Başsavcılığımızca yürütülen soruşturmada Tolga Kılınç dün teslim olmuş ve olayı ikrar etmiştir.
orhan: Mağdura ait köstekli saat şüphelinin odasında ele geçirilmiştir. İfade tutanağı ve el koyma tutanağı dosyaya sunulmuştur.
> Salonun arkasında Nermin Hanım’ın elleri ağzına gitti. Kızı onu omzundan tuttu.
> Barış başını kaldırmadı. Masanın kenarını tuttu; parmak boğumları beyazladı.
~ Bu dosyada ilk kez, kimse bir fotoğrafa bakmadan bir gerçek söylendi.
`,
        ),
        O(`
sukru: Barış Kılınç dosyası! Hı-hım.
# BURSA 6. AĞIR CEZA MAHKEMESİ — 2. CELSE [bg:durusma_salonu]
rahmi: Duruşmaya devam olundu. Ara karar gereği HızlıPaket firmasının cevabı ve telefon inceleme raporu dosyaya girmiştir. Tanık Ferhat Oral hazır.
> Savcı Orhan Bayar dökümün kırmızı çizgili sayfasını önüne açmıştı. Bana baktı; bir satranççının bir sonraki hamleyi bildiğini düşündüğü bakışla.
> Dinleyici sırasında Derya ile Sevim Hanım. Öbür uçta Nermin Hanım ve kızı. Ortada boş sıralar; iki aile arasında bir ırmak gibi.
~ İkinci celse. İlkinde bir kadının hafızasını gördük. Bugün bir kâğıdın hafızasını göreceğiz.
`),
      ],
      choices: [
        cont('T00_ETIK', 'Devam', 'T_ETIK', { role: 'PRIMARY', visibleWhen: flag('etik_kirlik') }),
        cont('T00_DEVAM', 'Kayıtların tartışılması', 'T_01_G', {
          role: 'PRIMARY',
          visibleWhen: not(flag('etik_kirlik')),
        }),
      ],
    }),
    story('T_ETIK', {
      ...H2,
      title: 'Koridor',
      background: 'adliye',
      hud: ['cred', 'pers'],
      lines: B(`
rahmi: Müdafi, bu konuda diyeceğiniz?
- Sayın Başkan… Bir fotoğraf gösterdim. Kayıtlardaki bir özçekimi. Gerçeğe ulaşmak için…
rahmi: Gerçeğe ulaşmak için, bu davanın ilk gününde bir polis memuru da aynısını yaptı müdafi. Bütün duruşmayı bunun üzerine kurdunuz.
rahmi: Mağdurun bundan sonraki her teşhis beyanı değerini yitirmiştir. Durumun Baro Başkanlığına ve Başsavcılığa bildirilmesine. On beş dakika ara.
> Koridorda Barış ablasının yanında duruyordu. Derya bana doğru yürüdü. Durdu. Elindeki kâğıdı uzattı: noterden, bu sabah.
derya: Azilname canım. Barış imzaladı. Ben imzalattım.
derya/kizgin: O kadına bir fotoğraf daha gösterdin. Kardeşimi bir fotoğraf yaktı; sen de bir fotoğraf daha gösterdin.
> Barış bana bakmadı. Merdivenin başında durdu, bir saniyeliğine, sonra indi.
`),
      choices: [cont('TETIK_DEVAM', 'Kapı', 'R_KARAR', { role: 'PRIMARY' })],
    }),
    decisionNode('T_01_G', [{ when: flag('ali_kocluk'), to: 'T_ALI' }, { to: 'T_01' }]),
    story('T_ALI', {
      ...H2,
      title: 'Bakkalın ifadesi',
      background: 'durusma_salonu',
      hud: ['cred', 'pers'],
      lines: B(`
orhan: Sayın Başkan, kayıtlara geçmeden önce bir hususu tutanağa geçirmek isterim.
orhan: Olay yeri tanığı bakkal Ali Rıza Tunç, sanık müdafiinin kendisine “bıçak olmadığını da söylerseniz iyi olur” dediğini kahvehanede anlatmış. Kolluk duymuş; tanığın ifadesi dün Başsavcılığımızca alındı.
orhan: Tanık, “Avukat hanım öyle dedi, ben de söyleyecektim” diyor. Bıçağı görmediğini de söylüyor; görmediğini bilmediğini de.
rahmi: Tutanağa geçsin. Müdafi, diyeceğiniz?
- Sayın Başkan… Tanığa yalnızca duyduğunu söylemesini…
rahmi: Tanık başka bir şey söylüyor müdafi. Bu konuda Başsavcılığın ayrıca değerlendirme yapacağı anlaşılmıştır. Devam ediyoruz.
> Elif Karaca dosyanın kenarına bir not düştü. Kısa. Okumama gerek yoktu.
~ “Tamamdır, ben hallederim.” Halletmiş. Bir bakkal, bir kahvehane ve bir cümle. Bir tanığa söylediğin her söz, sonunda bir tutanağa yazılır.
`),
      choices: [
        cont('TALI_DEVAM', 'Kayıtların tartışılması', 'T_01', {
          role: 'PRIMARY',
          effects: [dec('cred'), dec('pers'), raise('ali_ifsa'), score('SAVUNMA_STRATEJISI', -150)],
        }),
      ],
    }),
    choiceNode('T_01', {
      ...H2,
      title: 'Kayıtların tartışılması',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: [
        W(
          flag('tolga_teslim'),
          `
orhan: HızlıPaket kaydına göre sanık adına açılmış hesap 23.41’de olay yerindedir. Ancak şüpheli Tolga Kılınç bu hesabı o gece kendisinin kullandığını beyan etmiştir.
rahmi: Müdafi, kayıtlara ve rapora diyeceğiniz? CMK 215.
`,
        ),
        W(
          flag('baris_sakla'),
          `
orhan: Sayın Başkan, HızlıPaket kaydı açıktır. Sanığın hesabı 23.41’de Sırmakeş merdivenlerinin dibinde, dört dakika hareketsiz.
orhan: Sanık ilk celsede motorunun ve hesabının kendisinde olduğunu söyledi. Kimseye vermediğini. Kâğıt yalan söylemez.
rahmi: Müdafi, kayıtlara ve rapora diyeceğiniz? CMK 215.
~ Barış’a “şimdilik söz etme” dedim. Şimdi savcı, onun susmasını bir itiraf gibi okuyor.
`,
        ),
        O(`
orhan: Sayın Başkan, HızlıPaket kaydı açıktır. Sanığın hesabı 23.41’de Sırmakeş merdivenlerinin dibinde, dört dakika hareketsiz. Olay saati 23.42.
orhan: Sanık “evdeydim” diyor. Kayıt “oradaydı” diyor. Kâğıt yalan söylemez.
rahmi: Müdafi, kayıtlara ve rapora diyeceğiniz? CMK 215.
~ Kâğıt yalan söylemez. Doğru. Ama kâğıdı okuyan, istediği satırda durabilir.
> Elif Karaca dökümün kendi nüshasını çevirdi. Kırmızı çizgiyi geçti, bir önceki sayfaya döndü, bir satırda durdu. Kalemiyle bir şeyin altını çizdi. Ne olduğunu göremedim.
~ Üye hâkim okuyor. Savcının durduğu yerde durmuyor. Bu bir umut değil; bir fırsat.
`),
      ],
      choices: [
        option('T01_CIHAZ', 'Giriş cihazı müvekkilin değil', {
          visibleWhen: has('clue_cihaz'),
          effects: [
            raise('contra_gps'),
            inc('pers'),
            ifThen(has('ded_hesap'), [score('SORGULAMA', 200), inc('pers')], [score('SORGULAMA', 100)]),
          ],
          good: 'Kayıt hesabın yerini gösterir, kişinin değil: oturum başka bir cihazdan açılmış.',
          category: 'SORGULAMA',
          responses: [
            W(
              has('ded_hesap'),
              `
- Sayın Başkan, aynı kayıt, aynı sayfa: oturum 22.58’de Redmi …7741’den açılmış. Müvekkilin kayıtlı ve el konulan telefonu Samsung …2210.
- Telefon inceleme raporunda 22.31’de gelen mesaj: “Hesabı ben açıyorum bu gece, sen yat.” Kayıt hesabın yerini gösterir; hesabı kimin taşıdığını değil.
> Savcı dökümün bir önceki sayfasına döndü. Okudu. Kalemini bıraktı.
`,
            ),
            O(`
- Sayın Başkan, aynı kayıt: oturum 22.58’de Redmi …7741’den açılmış. Müvekkilin kayıtlı ve el konulan telefonu Samsung …2210. O gece hesap başka bir telefondaydı.
orhan: Başka bir telefon. Kimin telefonu?
~ Bunu sormasını bekliyordum. Cevabın yarısı bende.
`),
          ],
          next: '$stay',
        }),
        option('T01_SELFIE', 'Özçekimdeki kişinin sol kulağında halka var', {
          visibleWhen: has('clue_selfie'),
          effects: [
            raise('contra_selfie'),
            inc('pers'),
            ifThen(has('ded_baskasi'), [score('SORGULAMA', 200), inc('pers')], [score('SORGULAMA', 100)]),
          ],
          good: 'Oturumu açan kişinin özçekimi, mağdurun ilk tarifiyle (sol kulakta halka) örtüşüyor; sanıkla değil.',
          category: 'SORGULAMA',
          responses: [
            W(
              all(has('ded_baskasi'), flag('selfie_sakal')),
              `
- HızlıPaket’in her oturumda zorunlu tuttuğu özçekim. 22.58. Yakınlaştırınca sol kulak memesinde bir halka. Yüz tıraşlı; sanık o gece sakallıydı, gözaltı tutanağında da öyle.
- Mağdur 112’de, olaydan bir dakika sonra: “Sol kulağında halka vardı.” Sanığın kulakları, ilk celsede tutanağa geçtiği gibi, delinmemiş.
> Elif Karaca özçekimin çıktısını istedi. Büyüttü. Başkana uzattı. Başkan gözlüğünü çıkarıp yeniden taktı.
elif: Makine bu yüzü sanıkla eşleştirmiş. Biz eşleştiremiyoruz.
`,
            ),
            W(
              has('ded_baskasi'),
              `
- HızlıPaket’in her oturumda zorunlu tuttuğu özçekim. 22.58. Yakınlaştırınca sol kulak memesinde bir halka.
- Mağdur 112’de, olaydan bir dakika sonra: “Sol kulağında halka vardı.” Sanığın kulakları, ilk celsede tutanağa geçtiği gibi, delinmemiş.
> Elif Karaca özçekimin çıktısını istedi. Büyüttü. Başkana uzattı. Başkan gözlüğünü çıkarıp yeniden taktı.
`,
            ),
            O(`
- HızlıPaket’in zorunlu özçekimi, 22.58. Yakınlaştırınca sol kulakta bir halka görülüyor. Sanığın kulakları delinmemiş.
elif: Bu halka dosyada başka bir yerde geçiyor mu müdafi?
~ Geçiyordu. Ama iki kâğıdı birbirine bağlamamıştım.
`),
          ],
          next: '$stay',
        }),
        option('T01_186', '23.40’ta müvekkilin telefonu evinden 186’yı aradı', {
          visibleWhen: has('clue_186'),
          effects: [
            raise('contra_186'),
            inc('pers'),
            ifThen(has('ded_evde'), [score('SORGULAMA', 200), inc('pers')], [score('SORGULAMA', 100)]),
          ],
          good: 'Savcılığın istediği telefon raporu, sanığın olay saatinde evinde olduğunu gösteriyor.',
          category: 'SORGULAMA',
          responses: [
            W(
              has('ded_evde'),
              `
- Savcılığın istediği telefon raporu. 23.40’ta müvekkilin telefonu 186 elektrik arıza hattını arıyor; 1 dakika 40 saniye. Baz istasyonu Yıldırım.
- UEDAŞ kaydı: Mimar Sinan Mahallesi’nde elektrik 23.36–23.51 arası kesik. Olay 23.42’de, dört kilometre ötede.
orhan: Telefon evde kalmış olabilir.
- Arıza hattını arayıp adresini söyleyen bir telefon mu Sayın Savcım?
`,
            ),
            O(`
- Telefon raporu: 23.40’ta müvekkilin telefonu 186 arıza hattını aramış, baz istasyonu Yıldırım.
orhan: Telefon evde kalmış olabilir. Bir arama, kişinin yerini göstermez; avukat hanım bunu az önce kendisi söyledi.
~ Haklıydı. Kendi silahımı bana çevirdi. Aramayı bir kesintiye bağlamalıydım.
`),
          ],
          next: '$stay',
        }),
        option('T01_BARIS', 'Müvekkil hesabı paylaştığını kendisi anlatsın', {
          visibleWhen: all(flag('fact_tolga'), flag('baris_itiraf'), flag('baris_hazir')),
          score: { SAVUNMA_STRATEJISI: 60 },
          effects: [inc('pers'), raise('baris_anlatti')],
          good: 'Sanığın kendi ağzından, kayıtlarla desteklenen açıklaması (CMK 215).',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Başkan, sanık bu konuda açıklama yapmak istiyor.
baris: Hesabımı amcamın oğluna kullandırıyordum. Tolga. Ehliyeti yok. O gece de o çalıştı; mesaj attı, ben yattım.
baris: Bunu ilk gün söylemedim. İşimden olurum diye. Bir de… Tolga’nın böyle bir şey yapabileceği aklıma gelmedi. Hâlâ gelmiyor.
> Sesi titremedi. Sonuna kadar.
`),
          next: '$stay',
        }),
        option('T01_RED', '“Kayıt hatalıdır; şirket yanılmış olabilir.”', {
          score: { SORGULAMA: -50 },
          effects: [dec('cred'), dec('pers')],
          bad: 'Dayanaksız biçimde kaydın doğruluğuna itiraz ettin; kayıt doğru, yorumu yanlıştı.',
          category: 'SORGULAMA',
          responses: B(`
- Kayıt hatalı olabilir Sayın Başkan. Konum verileri sapabilir.
orhan: Dört dakika boyunca aynı merdivenin dibinde sapan bir konum mu?
~ Kâğıdın doğru olduğunu biliyordum. Ona yanlış dedim. Heyet bunu da biliyordu.
`),
          next: '$stay',
        }),
        cont('T01_BITIR', 'Diyeceklerimiz bu kadar', 'T_02', { role: 'PRIMARY' }),
      ],
    }),
    court2.testimony('T_02', {
      title: 'Kolluk görevlisinin dinlenmesi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'ferhat',
      witnessLabel: 'TANIK · KOM. YRD. FERHAT ORAL',
      rulesText: 'İpucu: bastır, sonra doğru delille göster. Polis yalancı değil; aceleci. Usulü göster.',
      objectionGrounds: ['g_telkin', 'g_kanaat', 'g_duyum'],
      say: T(`
sukru: Tanık Ferhat Oral! Hı-hım.
> Ferhat Oral üniformasıyla gelmişti. Saçı kısaltılmış, tıraşı yeni. Yemin ederken sesi yüksek ve düzdü.
rahmi: Tanık, olayı ve teşhis işlemini anlatın.
ferhat: Bölgede iki ayda dört gasp yaşandı Sayın Başkan. Bu olayda mağdur failin kurye olduğunu söyledi. Bölgedeki kuryeleri taradık; sanık öne çıktı.
ferhat: Ertesi sabah savcılık talimatıyla fotoğrafla teşhis yaptırdık. Mağdur sanığı tereddütsüz teşhis etti. Usulüne uygun bir işlemdi.
rahmi: Müdafi, sorularınız.
~ Yemin etti. Bir polisin yemini, bir kadının yemininden ağır basar mı? Bu salonda belki. Kâğıtların karşısında değil.
> Dinleyici sırasında Nermin Hanım vardı bu kez; tanıklığı bitmişti, kalmak istemişti. Kızının koluna girmiş, Ferhat’ı izliyordu. Ona güvenen bir yüzle.
~ O kadın bu adama güvendi. Bu adam da o kadına bir fotoğraf gösterdi. İkisi de iyi bir şey yaptığını düşündü.
`),
      statements: [
        statement('F1', 1, [
          'Teşhisi ',
          hl('kurallara uygun', any(flag('press_f1'), has('ded_usulsuz'))),
          ' yaptırdım.',
        ]),
        statement('F2', 2, [
          hl('Acilde mağdura kimseyi göstermedim', any(flag('press_f2'), has('ev_gozlem'), has('ded_kirlenme'))),
          '; yalnızca geçmiş olsun dedim.',
        ]),
        statement('F3', 3, [
          'Altı fotoğraf ',
          hl('birbirine benziyordu', any(flag('press_f3'), has('clue_foto_farkli'))),
          '.',
        ]),
        statement('F4', 4, [
          'Sanığın kaydında ',
          hl('bıçaklı yaralama var', any(flag('press_f4'), has('clue_eski_foto'))),
          '; mağdur da bıçak dedi.',
        ]),
        statement('F5', 5, [
          'Bölgedeki kuryeler arasında ',
          hl('tarife uyan tek kişi', any(flag('press_f5'), has('ded_halka'), has('ded_baskasi'))),
          ' sanıktı. Kaydı olan, bir daha yapar.',
        ]),
        statement(
          'F6',
          6,
          [
            'Sanığın o gece evde olduğuna dair ',
            hl('annesinin sözünden başka bir şey yoktu', any(has('ded_mazeret'), has('ded_evde'))),
            '; kimse başka bir şey söylemedi.',
          ],
          flag('press_f5'),
        ),
        statement('F7', 7, [
          'Konum kaydı açık: hesap sanığın, ',
          hl('girişte yüzü de makine onayladı', any(flag('press_f7'), has('clue_cihaz'), has('clue_selfie'))),
          '. Başka birinin olması mümkün değil.',
        ]),
      ],
      rules: [
        pressRule('PR_F1', 'F1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_f1')],
          responses: B(`
- Kurallar derken? Önce tarif mi alındı, sonra teşhis mi?
ferhat: Mağdur olayı anlattı, sonra fotoğraflara baktı. Sıra bu.
- Tutanakta tarifin saati 10.20. Teşhisin saati 10.05.
ferhat: Saat… saat sonradan yazılmış olabilir. Kâtip memur bazen…
`),
        }),
        pressRule('PR_F2', 'F2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_f2'), ifThen(has('clue_ferhat'), [score('SORGULAMA', 25), inc('pers')])],
          responses: [
            W(
              has('clue_ferhat'),
              `
- Karakolun önünde bana “bir baktırdım, ne var” dediniz. Neye baktırdınız?
> Ferhat Oral’ın çenesi gerildi. Başkana baktı, sonra savcıya, sonra yine bana.
ferhat: Ben… sohbet ediyorduk avukat hanım. Sokakta söylenen söz…
rahmi: Tanık, soruya cevap verin. Acilde mağdura bir şey gösterdiniz mi?
ferhat: Telefonuma… bir bakmasını istedim. Belki. Hatırlamıyorum.
`,
            ),
            O(`
- Acilde mağdurla ne kadar konuştunuz?
ferhat: İki dakika. Geçmiş olsun dedim, ifadeye ertesi gün geleceğini söyledim. O kadar.
`),
          ],
        }),
        pressRule('PR_F3', 'F3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_f3')],
          responses: B(`
- Fotoğrafları kim seçti?
ferhat: Arşivden ben seçtim. Elimizde ne varsa. Her zaman altı tane benzer bulamazsınız avukat hanım; burası bir film değil.
`),
        }),
        pressRule('PR_F4', 'F4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_f4')],
          responses: B(`
- Kaydında bıçak var dediniz. Dosyayı okudunuz mu?
ferhat: Yaralama. Kavgada bıçak çıkar avukat hanım, düğünlerde…
- Çıktı mı?
ferhat: Bakmadım. Yaralama yazıyordu.
`),
        }),
        pressRule('PR_F5', 'F5', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_f5')],
          responses: [
            W(
              flag('fact_liste'),
              `
- Karakolun önünde bana “iğne kutusunda ararsın” dediniz. Kutudaki tek iğne, kaydı olan tek kurye. Tarifin geri kalanına baktınız mı?
ferhat: Genç, ince, kurye. Sarı kutu. Uyuyordu.
- Annesi “evdeydi” dediğinde?
ferhat: Anneler hep evdeydi der avukat hanım. Başka kimse bir şey söylemedi.
~ Başka kimseye sormadı. Bir sonraki cümlesini bekliyorum; söyleyecek.
`,
            ),
            O(`
- Tarif neydi? Tam olarak?
ferhat: Genç, ince, kurye. Sarı kutu.
- Başka?
ferhat: Başka… o kadar.
~ O kadar değil. 112 dökümünde bir halka var. Okumamış, ya da okuyup durmamış.
ferhat: Bir de annesi “evdeydi” dedi. Anneler hep evdeydi der.
`),
          ],
        }),
        presentRule('PS_F2', 'F2', ['ev_gozlem', 'ded_kirlenme'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_f2'), { type: 'GOTO', node: 'T_02K' }],
          good: 'Kolluk görevlisinin teşhisten önce mağdura tek fotoğraf gösterdiği belgelendi (PVSK ek md. 6: tek fotoğrafla teşhis yasak).',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, acil servisin hemşire gözlem formu. 00.40: “Polis memuru hastaya telefondan fotoğraf gösterdi; hasta ağladı.”
`),
        }),
        presentRule('PS_F1', 'F1', ['ded_usulsuz'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_f1')],
          good: 'Tutanağın kendisi usulsüzlüğü gösteriyor: tarif sonradan, tek tekrar, uyarı yok (PVSK ek md. 6).',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, tutanak: teşhis 10.05, tarif 10.20. Tekrar sayısı bir. “Aralarında olmayabilir” uyarısı boş. Video yok.
- Kanun teşhisten önce tarifin tutanağa geçmesini, en az iki tekrarı ve uyarıyı açıkça istiyor. Üçü de yok.
ferhat: Mesai saati… dört dosya… Eksik yazılmış olabilir.
rahmi: Eksik yazılmış mı, eksik yapılmış mı tanık?
> Ferhat cevap vermedi.
`),
        }),
        presentRule('PS_F3', 'F3', ['ev_teshis'], {
          visibleWhen: has('clue_foto_farkli'),
          enabledWhen: has('clue_foto_farkli'),
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_f3')],
          good: 'Fotoğrafların benzemediği tutanağın kendisinde: tek renkli, büyük kare; diğerleri 38–52 yaş.',
          category: 'SORGULAMA',
          responses: B(`
- Tutanak. Beş fotoğraf siyah-beyaz, 9×12, otuz sekiz ile elli iki yaş arası. Bir fotoğraf renkli, 13×18, on dokuz yaş. Bunlar mı birbirine benziyordu?
ferhat: Elimizde başka fotoğraf…
elif: Tanık, sanığın fotoğrafı neden renkliydi?
ferhat: Telefonumdaydı. Oradan çıktı aldık.
> Bunu söyler söylemez sustu. Telefonundaydı. Acilde de telefonundaydı.
`),
        }),
        presentRule('PS_F4', 'F4', ['ev_sabika', 'ded_bicak'], {
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_f4')],
          good: '2023 dosyası yumrukla yaralama; bıçak yok. Mağdurun “bıçak” beyanı ilk çağrıda yok.',
          category: 'SORGULAMA',
          responses: B(`
- Sanığın 2023 dosyası: düğünde yumrukla yaralama, TCK 86/2. Bıçak yok. Mağdurun 112 çağrısında da bıçak yok.
- Bıçak, acil serviste sizin ağzınızdan dosyaya girdi Sayın Tanık. “Bıçakla yakalanmıştı” dediniz.
ferhat: Ben… yanlış hatırlamış olabilirim.
~ Yanlış hatırlamak. Bu dosyada herkesin ortak hastalığı.
`),
        }),
        presentRule('PS_F6', 'F6', ['ded_mazeret', 'ded_evde'], {
          score: { SORGULAMA: 250 },
          effects: [inc('pers'), raise('contra_f6')],
          good: 'Kolluk, sanığın mazeretini hiç araştırmamış; bağımsız tanık ve kayıtlar sanığın evde olduğunu gösteriyor.',
          category: 'SORGULAMA',
          responses: B(`
- Annesinden başka bir şey yoktu, diyorsunuz. Üst kat komşusu kesinti sırasında sanıkla balkonda konuştu; UEDAŞ kaydı kesintiyi 23.36–23.51 olarak gösteriyor.
- Siz komşuya sordunuz mu Sayın Tanık? Kapısını çaldınız mı?
ferhat: …Hayır.
rahmi: Tutanağa geçsin: tanık, sanığın mazeretine ilişkin araştırma yapılmadığını beyan etti.
`),
        }),
        presentRule('PS_F6_KAYIT', 'F6', ['ev_uedas', 'ev_tel'], {
          enabledWhen: any(has('clue_kesinti'), has('clue_186')),
          visibleWhen: any(has('clue_kesinti'), has('clue_186')),
          score: { SORGULAMA: 150 },
          effects: [inc('pers'), raise('contra_f6')],
          good: 'Kayıtlar, kolluğun hiç bakmadığı mazereti destekliyor.',
          category: 'SORGULAMA',
          responses: B(`
- Kayıtlar başka bir şey söylüyor Sayın Tanık. Sanığın mahallesinde elektrik kesikti; sanığın telefonu o dakikalarda evinden arıza hattını aradı. Bunlara baktınız mı?
ferhat: Bakmadık. Gerek görmedik.
`),
        }),
        presentRule('PS_F5_SELFIE', 'F5', ['ev_selfie'], {
          enabledWhen: has('clue_selfie'),
          visibleWhen: has('clue_selfie'),
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_f5')],
          good: 'Hesabı o gece kullanan kişinin özçekimi tarife (sol kulakta halka) uyuyor; sanığa değil.',
          category: 'SORGULAMA',
          responses: B(`
- Tarife uyan tek kişi diyorsunuz. Hesabın o gece oturum açılışındaki özçekim: sol kulakta halka. Tarife uyan biri vardı Sayın Tanık; ama o kişi sanık değildi.
ferhat: Bu fotoğrafı… ilk kez görüyorum.
`),
        }),
        presentRule('PS_F5', 'F5', ['ded_halka', 'ded_baskasi', 'ded_hesap'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_f5')],
          good: 'İlk tarif (sol kulakta halka) sanığa uymuyor; kolluk tarifin bu kısmını hiç kullanmamış.',
          category: 'SORGULAMA',
          responses: B(`
- 112 dökümü, 23.44: “Sol kulağında halka vardı.” Tarife uyan tek kişi diyorsunuz; sanığın kulakları delinmemiş.
- Bu tarife uyan birini aradınız mı Sayın Tanık?
ferhat: Halka… Dökümde bu var mıydı?
rahmi: Vardı tanık. Dosyada.
`),
        }),
        pressRule('PR_F7', 'F7', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_f7')],
          responses: B(`
- Makine onayladı diyorsunuz. Onaylanan yüze siz baktınız mı? Oturumun hangi telefondan açıldığına?
ferhat: Şirket “onaylı” yazmış avukat hanım. Yüzde doksan bir. Biz şirketin yazdığına bakarız.
- Yani hayır.
ferhat: Gerek yoktu. Hesap onun, motor onun, bölge onun.
~ Gerek yoktu. Bu dosyanın ikinci adı.
`),
        }),
        presentRule('PS_F7', 'F7', ['ded_hesap', 'ded_baskasi'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_f7')],
          good: 'Konum kaydı hesabın yerini gösterir, kişinin değil: oturum başka bir telefondan açılmış, onaylanan yüz tarife uyan başka biri.',
          category: 'SORGULAMA',
          responses: [
            W(
              has('ded_baskasi'),
              `
- Aynı kaydın bir üst satırı: oturum 22.58’de Redmi …7741’den açıldı. Sanığın el konulan telefonu Samsung …2210.
- Makinenin “onayladığı” özçekimde sol kulakta bir halka var. Mağdurun 112’deki tarifi: “Sol kulağında halka vardı.” Sanığın kulakları delinmemiş.
ferhat: Yüzde doksan bir… Makine…
elif: Makine yüzde dokuz yanılıyor tanık. Bu dosyada o yüzde dokuz bir insan.
`,
            ),
            O(`
- Aynı kaydın bir üst satırı: oturum 22.58’de Redmi …7741’den açıldı. Sanığın el konulan telefonu Samsung …2210.
- Telefon raporunda 22.31: “Hesabı ben açıyorum bu gece, sen yat.” Hesap o gece sanığın değil, başkasının elindeydi.
ferhat: Bunu… şirket yazmamıştı.
rahmi: Şirket yazmış tanık. Bir satır yukarıda.
`),
          ],
        }),
        presentRule('PS_F7_KAYIT', 'F7', ['ev_gps', 'ev_tel', 'ev_selfie'], {
          enabledWhen: any(has('clue_cihaz'), has('clue_mesaj'), has('clue_selfie')),
          score: { SORGULAMA: 150 },
          effects: [inc('pers'), raise('press_f7')],
          good: 'Kayıtların kendisi, hesabı o gece başka bir telefonun ya da başka bir yüzün taşıdığını gösteriyor.',
          category: 'SORGULAMA',
          responses: B(`
- Kayıt sizin dediğinizi söylemiyor Sayın Tanık. Oturum sanığın telefonundan açılmamış; o gece hesap başka bir elde.
ferhat: Biz… o satıra bakmadık.
~ Bakmadılar. Kâğıdın yarısını okumak, bu dosyada bir gelenek.
`),
        }),
        objectRule('OB_F5', 'F5', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [inc('pers')],
          good: 'İtiraz yerinde: “kaydı olan bir daha yapar” bir gözlem değil, kanaat.',
          category: 'SORGULAMA',
          responses: B(`
- İtiraz ediyorum. “Kaydı olan bir daha yapar” tanığın gözlemi değil, kanaatidir.
rahmi: Yerinde. Tanık, olgulara dönün.
`),
        }),
        presentRule(
          'PS_SAVCILIK2',
          undefined,
          ['ev_teshis', 'ev_nermin_kolluk', 'ev_darp', 'ev_gps', 'ev_ihbar', 'ev_sabika', 'ev_tel', 'ev_selfie'],
          {
            maxUses: 10,
            effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
            bad: 'Bu delil bu ifadeyle çelişmiyor. −1 güvenilirlik, −150 skor.',
            category: 'SORGULAMA',
            responses: B(`
orhan: Sayın Başkan, müdafi elindeki her kâğıdı tanığa okutuyor.
~ Kâğıt doğru, ifade yanlıştı.
`),
          },
        ),
      ],
      presentMiss: fallback('FB_T02_PRESENT', 'PRESENT', {
        effects: [...wrongMove, score('SORGULAMA', -150, 'hatali')],
        quality: { q: 'BAD', feedback: 'Yanlış delil: −1 güvenilirlik, −150 skor.', category: 'SORGULAMA' },
        responses: B(`
rahmi: Bu delilin beyanla ilgisini göremedim müdafi.
`),
      }),
      objectMiss: fallback('FB_T02_OBJECT', 'OBJECT', {
        effects: [dec('cred'), inc('wrong'), score('SORGULAMA', -50, 'hatali')],
        quality: { q: 'BAD', feedback: 'Dayanaksız itiraz.', category: 'SORGULAMA' },
        responses: B(`
rahmi: İtiraz reddedildi.
`),
      }),
      finish: { id: 'T02_BITIR', next: 'T_03_G' },
    }),
    court2.stage('T_02K', {
      title: 'Kırılma',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'ferhat',
      lines: B(`
> Ferhat Oral formun fotokopisine baktı. Önce ilk satıra, sonra saatine, sonra el yazısına.
ferhat: Teyze acı içindeydi Sayın Başkan. Dört kadın… iki ay… Müdür her sabah… Bir baktırdım. Telefondan. Bir kere.
ferhat: Prosedür değildi. Biliyorum.
> Salonda bir sessizlik. Başkan kâtibe döndü; yazdırdı, kelimesi kelimesine.
rahmi: Tutanağa geçsin: tanık, teşhisten önce acil serviste mağdura telefonundan sanığın fotoğrafını gösterdiğini beyan etti.
> Savcı Orhan Bayar uzun bir süre önüne baktı. Sonra Ferhat’a döndü; kızgın değildi. Yorgundu.
orhan: Bunu neden tutanağa yazmadın Ferhat?
ferhat: Yazsaydım teşhis olmazdı Sayın Savcım.
~ Bir cümle. Bütün dosya bu cümlenin içinde. Yazsaydım teşhis olmazdı.
`),
      choices: [cont('T02K_DEVAM', 'Devam', 'T_02R', { role: 'PRIMARY' })],
    }),
    story('T_02R', {
      ...H2,
      title: 'Kısa ara',
      background: 'adliye',
      hud: ['cred', 'pers'],
      lines: B(`
rahmi: On dakika ara.
# ADLİYE KORİDORU · KISA ARA [bg:adliye]
> Ferhat Oral koridorun ortasında durdu. Nermin Hanım ile kızı tam karşısındaydı. Bir an kimse kıpırdamadı.
ferhat: Teyze… Nermin Hanım. Ben…
nermin: Sen bana o fotoğrafı gösterdin evladım. Ben sana inandım. Sen polissin diye.
ferhat: Ben sizin için yaptım. Dört kadın için. Bir beşinci olmasın diye.
nermin/uzgun: Ben beşinci olmak istemezdim. Ama bir çocuğu da yerime koymak istemezdim.
> Ferhat başını eğdi. Bir şey söylemeden yürüdü; pencerenin önünde durdu, sigarasını çıkardı, yakmadı.
> Yanına gittim. Neden gittiğimi bilmiyorum.
ferhat: Bana kızıyorsunuz, biliyorum.
- Kızmıyorum. Usulü atlamanızın bir bedeli var, o kadar. Bu bedeli bir çocuk üç ay ödedi.
ferhat: O dört kadının da bir bedeli var avukat hanım. Onu kim ödüyor?
~ Doğru bir soru. Bu salonda cevabı yok. Bu salonun işi, o soruyu başka birinin yerine cevaplamamak.
`),
      choices: [cont('T02R_DEVAM', 'Salona dön', 'T_03_G', { role: 'PRIMARY' })],
    }),
    decisionNode('T_03_G', [
      { when: all(flag('kadir_tanik'), not(flag('kadir_gelmez'))), to: 'T_03' },
      { to: 'T_03Y' },
    ]),
    choiceNode('T_03', {
      ...H2,
      title: 'Kadir Usta',
      hud: ['cred', 'pers'],
      background: 'durusma_salonu',
      lines: B(`
sukru: Tanık Kadir Bayram! Hı-hım.
> Kadir Usta bayramlık ceketini giymişti; kendi diktiği, omuzları tam oturan. Kürsüye yürürken bir kez durdu, gözlüğünü düzeltti.
rahmi: Tanık, sanıkla akrabalığınız yok. Yemininizi edin ve bildiklerinizi anlatın.
kadir: Elli yıl terzilik yaptım Sayın Başkan. Ölçmeden biçmem. O gece elektrik gitti; balkona çıktım. Aşağıda Barış öksürüyordu. Konuştuk. Bu kadar.
> Barış dinleyici sırasından değil, sanık sandalyesinden ona baktı. Kadir Usta bir an ona döndü, başıyla küçük bir selam verdi; terzinin müşterisine verdiği selam gibi.
~ Üç ay önce bir perde çekmişti. Bugün o perdeyi açıyor.
`),
      choices: [
        option('KS_ELEKTRIK', '“Elektrik gelince ne oldu?”', {
          score: { SORGULAMA: 30 },
          effects: [inc('pers')],
          responses: B(`
kadir: Televizyon kendi kendine açıldı, sesinden sıçradım. Barış o zaman çoktan içeri girmişti. Elektrik gelmeden girdi; bunu biliyorum.
`),
          next: '$stay',
        }),
        option('KS_SES', '“Karanlıkta onu nasıl tanıdınız?”', {
          score: { SORGULAMA: 20 },
          responses: B(`
kadir: Sesinden. Öksürüğünden. Yirmi iki yıldır altımda yaşıyor. Bir de o balkon onun balkonu. Başkası niye çıksın?
`),
          next: '$stay',
        }),
        option('KS_GOZ', '“Gözleriniz nasıl görür, söyler misiniz?”', {
          score: { SORGULAMA: 40 },
          effects: [inc('pers'), raise('kadir_goz_once')],
          good: 'Tanığın zayıf yanını savcıdan önce kendi ağzından duyurdun; karşı sorunun etkisini azalttın.',
          category: 'SORGULAMA',
          responses: B(`
kadir: Katarakt. İki gözde. Uzağı bulanık görürüm, karanlıkta yüz seçemem. Ama ben yüz demedim Sayın Başkan; ses dedim.
> Elif Karaca başını kaldırdı. Bir şey not etti.
`),
          next: '$stay',
        }),
        option('KS_SAAT', '“Saat kaçtı?”', {
          score: { SORGULAMA: -10 },
          responses: [
            W(
              flag('kadir_kocluk'),
              `
kadir: 23.40. Elektrik 23.40’ta gitti.
> Savcı başını kaldırdı. Bir şey yazdı. Altını çizdi.
~ Ezberlenmiş bir sayı, ezberlenmiş gibi duyulur. Herkes duydu.
`,
            ),
            O(`
kadir: Bilmiyorum. Saate bakmadım. Elektrik gidince çıktım, gelmeden girdi. Saatini kayıt söyler, ben söyleyemem.
~ Dürüst bir “bilmiyorum”. Kürsüde en sağlam cümlelerden biri.
`),
          ],
          next: '$stay',
        }),
        cont('KS_BITIR', 'Sorularım bu kadar', 'T_03X', {
          role: 'PRIMARY',
          // Yönlendirilmiş tanık: savcının karşı sorusu saati her durumda sınar ve yönlendirmeyi açığa çıkarır.
          effects: [
            ifThen(flag('kadir_kocluk'), [
              dec('cred'),
              dec('pers', 2),
              raise('kadir_ifsa'),
              score('SAVUNMA_STRATEJISI', -200),
            ]),
          ],
        }),
      ],
    }),
    court2.objection('T_03X', {
      title: 'Savcının sorusu',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'kadir',
      lines: [
        W(
          flag('kadir_kocluk'),
          `
orhan: Tanık, olay gecesi elektrik saat kaçta gitti?
kadir: 23.40.
orhan: Kollukta saate bakmadığınızı söylemişsiniz. 23.40’ı nereden biliyorsunuz?
kadir: Ben… avukat hanım söyledi. “Kayıt öyle” dedi. Ben de ezberledim. Ben sayıları iyi ezberlerim.
> Salonda bir uğultu. Başkan tokmağa vurdu. {shake}
rahmi: Tanığın bu beyanı tutanağa geçsin. Tanığın saate ilişkin anlatımının hangi ölçüde değerlendirileceği hükümde takdir edilecektir.
orhan: Müdafiin tanıkla görüşmesine ilişkin Başsavcılığa ayrıca bilgi vereceğim Sayın Başkan.
~ Bir terziye bir sayı ezberlettim. O da dürüst bir adam olduğu için, ezberlettiğimi de söyledi. Sormasam da sorulacaktı; savcılar saati hep sorar.
`,
        ),
        W(
          flag('fact_tolga'),
          `
orhan: Tanık, karanlıkta, kataraktla, balkondan aşağıdaki kişiyi gördünüz mü, yoksa duydunuz mu? Sanığın bir de ona çok benzeyen bir kuzeni varmış; ikisini sesinden ayırabilir misiniz?
~ Meşru bir soru. Acımasız ama meşru.
`,
        ),
        O(`
orhan: Tanık, karanlıkta, kataraktla, balkondan aşağıdaki kişiyi gördünüz mü, yoksa duydunuz mu? Bir sesi başka bir sese benzetmiş olamaz mısınız?
~ Meşru bir soru. Acımasız ama meşru.
`),
      ],
      next: 'T_04_G',
      options: [
        option('X_ITIRAZ', 'İtiraz: soru tanığın sağlığını hedef alıyor, yersiz', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred'), dec('pers')],
          bad: 'Tanığın algı koşullarını sorgulayan soru meşrudur (CMK 201/1); itirazın dayanağı yok.',
          category: 'USUL_BILGISI',
          responses: B(`
rahmi: Soru tanığın algısına yönelik, meşru. Reddedildi. Tanık cevap verin.
kadir: Bilmiyorum Sayın Başkan. Ben ses dedim.
`),
        }),
        option('X_CEVAP', 'Diyeceğimiz yok; tanık cevap versin', {
          effects: [
            ifThen(
              all(flag('kadir_hazir'), not(flag('kadir_kocluk'))),
              [score('SORGULAMA', 100), inc('pers')],
              [ifThen(not(flag('kadir_kocluk')), [score('SORGULAMA', 30)])],
            ),
            ifThen(all(flag('kadir_goz_once'), not(flag('kadir_kocluk'))), [score('SORGULAMA', 30)]),
          ],
          neutral: 'Tanığa güvendin; dürüst bir tanık meşru soruya kendi cevabını verir.',
          responses: [
            W(
              flag('kadir_kocluk'),
              `
kadir: Ne diyeyim… Ben ölçtüğümü söyleyecektim. Biçtiler.
`,
            ),
            W(
              flag('kadir_hazir'),
              `
kadir: Duydum Sayın Savcı. Ben görmedim demiyorum, duydum diyorum. Kuzenini bilmem; Tolga’yı çocukken gördüm, o kadar.
kadir: Ama o balkon Barış’ın balkonu. O öksürük Barış’ın öksürüğü. Ben o öksürüğü yirmi iki yıldır duyarım; sağırlaşmadıysam.
> Salonun arkasında biri güldü; tek, kısa. Başkan bakmadı bile.
`,
            ),
            O(`
kadir: Duydum. Gördüm demedim. Ses… ses benzer mi bilmem Sayın Savcı. Ben Barış’ı tanırım.
`),
          ],
        }),
        option('X_215', 'Diyecek: saati tanık değil, kayıt söylüyor', {
          visibleWhen: not(flag('kadir_kocluk')),
          effects: [
            ifThen(
              any(has('ded_mazeret'), has('ded_evde')),
              [score('USUL_BILGISI', 150), inc('legal_hits'), inc('pers'), raise('kadir_215')],
              [score('USUL_BILGISI', -40), dec('pers')],
            ),
          ],
          good: 'Tanığın beyanına karşı diyecek hakkını (CMK 215) bağımsız kayıtla kullandın.',
          category: 'USUL_BILGISI',
          responses: [
            W(
              any(has('ded_mazeret'), has('ded_evde')),
              `
- Sayın Başkan, tanık saati bilmiyor; bilmediğini de söylüyor. Saati UEDAŞ kaydı söylüyor: elektrik 23.36’da gitti, 23.51’de geldi.
- Tanık bu on beş dakikanın içinde sanıkla balkonda konuştu. Bir tanığın hafızası ile bir şirketin kaydı aynı on beş dakikayı gösteriyor.
> Savcı itiraz etmedi. Kaydın kopyasını istedi, okudu, dosyasına koydu.
kadir: Ben söyledim avukat hanım. Ölçtüm, biçmedim. Kâğıt da aynı ölçüyü söylüyormuş. Ne güzel.
> Salonda kısa bir gülüşme. Başkan bu sefer bakmadı; bakmasına gerek yoktu.
`,
            ),
            O(`
- Sayın Başkan, tanığın anlatısı kayıtla doğrulanıyor.
elif: Hangi kayıtla müdafi? Dosyada göremedim.
~ Kaydı istememiştim. Ya da istemiş ama bağlamamıştım.
`),
          ],
        }),
      ],
    }),
    court2.stage('T_03Y', {
      title: 'Boş kürsü',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('kadir_gelmez'),
          `
sukru: Tanık Kadir Bayram! Tanık Kadir Bayram! Hı-hım. Gelmedi Sayın Başkan. Doktor raporu göndermiş; göz.
rahmi: Tanığın raporu dosyaya alındı. Müdafi, tanıktan vazgeçiyor musunuz?
~ “Gelmek istemezseniz anlarım.” Anladı.
`,
        ),
        O(`
> Tanık kürsüsü boş kaldı. Mazeret için bir anne ve bir ateş vardı; bir komşunun sesi dosyaya hiç girmedi.
~ Kadir Usta’yı bildirmedim. Belki hiç tanımadım. Bu dosyada sorulmayan bir tanık daha.
`),
      ],
      choices: [cont('T03Y_DEVAM', 'Devam', 'T_04_G', { role: 'PRIMARY' })],
    }),
    decisionNode('T_04_G', [
      { when: flag('gamze_tanik'), to: 'T_04' },
      { when: flag('cemal_tanik'), to: 'T_04C' },
      { to: 'T_05' },
    ]),
    decisionNode('T_04C_G', [{ when: flag('cemal_tanik'), to: 'T_04C' }, { to: 'T_05' }]),
    court2.stage('T_04C', {
      title: 'Kebapçı',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'cemal',
      onFirstEnter: [inc('pers')],
      lines: B(`
sukru: Tanık Cemal Usta! Hı-hım.
> Cemal Usta önlüksüz gelmişti; ellerini nereye koyacağını bilemedi, sonunda kürsünün kenarına koydu. Parmaklarında ızgaranın eski yanıkları.
cemal: O gece 23.31’de sipariş aldı bir kurye Sayın Başkan. Bereliydi. Kulağında halka vardı; ızgaranın ışığında parladı. Adını bilmem.
elif: Salonda o kişi var mı?
cemal: Yok. Bu çocuk değil. Bu çocuğun saçı uzun, sakalı var. O tıraşlıydı. Kuryeyi yüzünden değil, halkasından hatırlıyorum hâkim hanım.
~ Bir tanık, salonda birini göstermeyi reddetti. Bu dosyada ilk kez.
`),
      choices: [cont('T04C_DEVAM', 'Devam', 'T_05', { role: 'PRIMARY' })],
    }),
    court2.stage('T_04', {
      title: 'Hemşire',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'gamze',
      onFirstEnter: [inc('pers'), raise('gamze_dinlendi')],
      lines: [
        W(
          flag('contra_f2'),
          `
sukru: Tanık Gamze Ateş! Hı-hım.
> Gamze Ateş nöbetten çıkıp gelmişti; önlüğünün üstüne bir mont geçirmiş. Kürsüde kısa ve düz konuştu.
gamze: Perdenin aralığından gördüm. Telefon, tek fotoğraf, “bu mu, kaydı var, bıçakla yakalanmıştı.” Hasta iki kez “bilmiyorum” dedi, üçüncüde “galiba.” Sonra ağladı. Yazdım.
rahmi: Tanık Ferhat Oral’ın beyanıyla örtüşüyor. Tutanağa geçsin.
`,
        ),
        O(`
sukru: Tanık Gamze Ateş! Hı-hım.
> Gamze Ateş nöbetten çıkıp gelmişti. Ferhat Oral’ın dinleyici sırasında oturduğunu görünce bir an durdu; sonra kürsüye yürüdü.
gamze: Perdenin aralığından gördüm. Telefon, tek fotoğraf, “bu mu, kaydı var, bıçakla yakalanmıştı.” Hasta iki kez “bilmiyorum” dedi, üçüncüde “galiba.” Sonra ağladı. Yazdım; saatiyle.
> Ferhat Oral dinleyici sırasında başını eğdi.
elif: Tanık, gösterilen fotoğrafı gördünüz mü?

gamze: Kazınmış saçlı bir genç. Bir duvar, bir numara. Gözaltı fotoğrafı gibiydi.
`),
      ],
      choices: [cont('T04_DEVAM', 'Devam', 'T_04C_G', { role: 'PRIMARY' })],
    }),
    court2.stage('T_05', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      background: 'durusma_salonu',
      onFirstEnter: [ifThen(all(not(flag('tolga_teslim')), ref('mutalaa_beraat')), [raise('mutalaa_b')])],
      lines: [
        W(
          flag('tolga_teslim'),
          `
rahmi: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
orhan: Sayın Başkan, yapılan yargılama ve Başsavcılığımızca yürütülen soruşturma birlikte değerlendirildiğinde, suçun sanık tarafından işlenmediği sabit olmuştur.
orhan: Sanığın CMK 223/2-b uyarınca beraatine; Tolga Kılınç hakkındaki soruşturmanın ayrıca yürütülmesine; kolluk işlemine ilişkin suç duyurumuzun saklı tutulmasına karar verilmesini talep ederim.
> Savcı oturdu. Bana bakmadı. Sonra baktı; bir saniyeliğine, başını hafifçe eğerek.
`,
        ),
        W(
          ref('mutalaa_beraat'),
          `
rahmi: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
orhan: Sayın Başkan, mağdurun teşhisi, kolluk görevlisinin teşhisten önce tek fotoğraf göstermesi nedeniyle hükme esas alınabilecek nitelikte değildir.
orhan: Dosyada sanığın suçu işlediğine dair başka kesin delil bulunmamaktadır. Sanığın CMK 223/2-e uyarınca beraatine; hesabı kullanan kişi yönünden suç duyurusunda bulunulmasına karar verilmesini talep ederim.
~ Bir savcının beraat istemesi bir zafer değildir. Bir savcının işini yapmasıdır. Bu dosyada ilk kez biri işini sonuna kadar yaptı.
> Nermin Hanım’ın kızı annesinin elini tuttu. Nermin Hanım elini çekmedi; ama ellerine de bakmadı. Savcıya bakıyordu; sanki bir şey daha söylemesini bekliyormuş gibi. Saatini.
~ Saatini kimse söylemedi. Bu dosyada bir beraat var; bir saat yok.
`,
        ),
        O(`
rahmi: Delillerin tartışılması tamamlandı. Esas hakkındaki mütalaa.
orhan: Sayın Başkan, mağdurun teşhisi, sanığın hesabının olay yerindeki konum kaydı ve sanığın bölgede kurye olarak çalışması birlikte değerlendirildiğinde atılı suçun sabit olduğu kanaatindeyiz.
orhan: Sanığın TCK 149/1-a ve h uyarınca, iki nitelikli hâlin birlikte gerçekleşmesi gözetilerek alt sınırdan uzaklaşılarak cezalandırılmasına;
orhan: TCK 53 ve 63’ün uygulanmasına; tutukluluk hâlinin devamına karar verilmesini talep ederim.
~ “Kâğıt yalan söylemez.” Savcı kâğıdı okudu. Kâğıdın yarısını.
> Savcı oturdu. Barış bana döndü; dudakları kıpırdadı ama ses çıkmadı. Sevim Hanım’ın tespihi durdu, sonra yeniden döndü; bu sefer daha hızlı.
~ Mütalaa bir hüküm değil. Bir savcının kanaati. Ama heyetin kalemine ilk düşen kanaat odur; benimki ikinci gelir.
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
rahmi: Müdafi, esas hakkındaki savunmanız.
~ Üç dayanak. Leyla’nın sesi kulağımda: “Fazlası gürültüdür.” Her biri dosyada bir kâğıda dayanmalı.
`),
      choices: [
        dayanak(
          'P_KIRLENME',
          'Teşhis, acilde gösterilen tek kareyle bozuldu',
          any(has('ded_kirlenme'), flag('contra_n3'), flag('contra_f2'), flag('gamze_dinlendi')),
          'arg_kirlenme',
          `
- Birincisi: teşhis. Mağdura, karakoldaki işlemden dokuz saat önce, acil serviste, bir polis telefonundan tek bir fotoğraf gösterildi. Karakoldaki “seçim” bir teşhis değil, bir tanımadır.
`,
        ),
        dayanak(
          'P_HALKA',
          'İlk tarif sanığa uymuyor',
          ref('halka_var'),
          'arg_halka',
          `
- Mağdurun kirlenmeden önceki tek tarifi 112 çağrısında: “Sol kulağında halka vardı.” Sanığın kulakları hiç delinmemiş.
`,
        ),
        dayanak(
          'P_MAZERET',
          'Sanık olay saatinde evindeydi',
          ref('mazeret_var'),
          'arg_mazeret',
          `
- Sanık 23.36–23.51 arasında Yıldırım’daki evindeydi: bağımsız bir tanık balkonda onunla konuştu, telefonu 23.40’ta evinden arıza hattını aradı. Olay yeri dört kilometre ötede.
`,
        ),
        dayanak(
          'P_HESAP',
          'Hesabı o gece başkası kullandı',
          ref('hesap_curudu'),
          'arg_hesap',
          `
- Savcılığın konum kaydı hesabın yerini gösterir, kişinin değil. Oturum başka bir telefondan açıldı; doğrulama özçekimindeki kişinin sol kulağında halka var.
`,
        ),
        dayanak(
          'P_BICAK',
          'Silah unsuru ispatlanmadı',
          any(has('ded_bicak'), flag('contra_n2'), flag('contra_f4')),
          'arg_silah',
          `
- 112 çağrısında bıçak yok: “İtti, düştüm, elim kesildi.” Basamakta kanlı bir şişe kırığı var. Bıçak, ertesi sabah, kolluğun sözünden sonra ifadeye girdi.
`,
        ),
        dayanak(
          'P_ESKI',
          'Polisin karesi bugünkü sanığa benzemiyor',
          any(has('ded_eski_foto'), flag('contra_n1')),
          'arg_eski',
          `
- Mağdura gösterilen fotoğraf üç yıl önceki bir gözaltından. Bugünkü sanık o fotoğrafa benzemiyor. Mağdur bir fotoğrafı tanıdı; sanığı değil.
`,
        ),
        cont('P_BITIR', 'Esas savunmaya geç', 'T_06', {
          role: 'PRIMARY',
          enabledWhen: any(cmp(v('noktalar'), '==', 0), flag('arg_kirlenme'), flag('arg_mazeret'), flag('arg_hesap')),
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
~ Dayanaklar söylendi. Şimdi hepsini bir cümlede toplamam gerekiyor. Bir talep. Heyetin kalemine geçecek tek bir cümle.
`),
      next: 'T_07',
      choices: [
        option('S_MASUMIYET', 'Beraat: teşhis değersiz, sanık evdeydi, hesabı başkası taşıyordu', {
          effects: [
            raise('closing_masumiyet'),
            ifThen(
              atLeast(2, flag('arg_kirlenme'), flag('arg_halka'), flag('arg_mazeret'), flag('arg_hesap')),
              [score('SAVUNMA_STRATEJISI', strategyAmount(200, 'MASUMIYET')), inc('pers')],
              [score('SAVUNMA_STRATEJISI', 60)],
            ),
          ],
          good: 'Delillerle desteklenen beraat talebi; sanığın suçu işlemediği (CMK 223/2-b), olmazsa işlediğinin sabit olmadığı (223/2-e).',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Başkan, bu dosyada kimse yalan söylemedi. Mağdur gördüğünü söyledi; ama gördüğü yüzün üstüne, acil serviste bir fotoğraf yapıştırıldı.
- O fotoğrafı silince geriye bir halka, bir kesinti ve başka bir telefondan açılmış bir hesap kalıyor. Hiçbiri müvekkilimi göstermiyor.
- Müvekkilimin suçu işlemediğinin sabit olduğu kanaatindeyiz; en azından işlediği sabit değildir. Beraatini ve tahliyesini talep ediyoruz.
`),
        }),
        option('S_USUL', 'Beraat: usulsüz teşhis hükme esas alınamaz, başka delil yok', {
          effects: [
            raise('closing_usul'),
            ifThen(
              any(flag('arg_kirlenme'), flag('contra_f1'), flag('arg_eski')),
              [score('SAVUNMA_STRATEJISI', strategyAmount(200, 'USUL')), inc('pers')],
              [score('SAVUNMA_STRATEJISI', 40)],
            ),
          ],
          good: 'Kanuni güvencelere aykırı teşhisin vicdani kanaate esas alınamayacağını savundun (PVSK ek md. 6; CMK 217).',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Başkan, kanun teşhisin nasıl yapılacağını madde madde yazmış: önce tarif, benzer kişiler, iki tekrar, uyarı; tek fotoğraf asla.
- Bu dosyada bunların hiçbiri yok. Usulsüz teşhis, yapılmamış teşhistir. Teşhis düşünce, sanığı olaya bağlayan bir delil kalmıyor.
- Müvekkilimin CMK 223/2-e uyarınca beraatini talep ediyoruz.
- Bu salonda bir kadın üç ay boyunca bir yüz taşıdı. O yüzü ona biz vermedik; ama ondan almak bize düştü. Usul, işte bu yüzden vardır: kimse bir başkasının hafızasına yazmasın diye.
> Elif Karaca kalemini bıraktı. Başkan başını hafifçe eğdi; onay mı, yorgunluk mu, bilmiyorum.
`),
        }),
        option('S_TERDIT', 'Önce beraat; olmazsa silah unsuru düşsün, alt sınır ve takdiri indirim', {
          effects: [raise('closing_terdit'), score('SAVUNMA_STRATEJISI', strategyAmount(150, 'INDIRIM'))],
          good: 'Terditli savunma: önce beraat; aksi hâlde silah unsurunun (TCK 149/1-a) ispatlanmadığı, temel cezanın alt sınırdan belirlenmesi ve TCK 62/1.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Başkan, öncelikle müvekkilimin beraatini talep ediyoruz.
- Mahkeme aksi kanaatteyse: bıçak ilk çağrıda yok, olay yerinde bulunmadı; silah unsuru ispatlanmamıştır. Temel cezanın alt sınırdan belirlenmesini ve TCK 62/1’in uygulanmasını talep ediyoruz.
~ Bir yandan “yapmadı” diyorum, öbür yandan “yaptıysa bile bıçaksız.” Hukuk bunu ister. Barış’ın gözleri istemiyor.
`),
        }),
        option('S_DUYGU', 'Bir annenin gözyaşlarına seslen', {
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('pers')],
          bad: 'Esas savunma delil tartışmasıdır; duygusal çağrı heyeti ikna etmez.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
- Sayın Başkan, salonda bir anne var. Üç aydır oğlunun yatağını her gece yapıyor…
rahmi: Müdafi, esas hakkında.
~ Sevim Hanım’ın tespihi durdu. Onu da kullandım. Utandım.
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
rahmi: Sanık, ayağa kalkın. Hükümden önce son sözünüz nedir?
> Barış ayağa kalktı. Bana baktı. Ne söyleyeceğini bilmiyordum; bilmemem gerekiyordu.
> Salonda bir sessizlik. Sevim Hanım tespihini durdurdu. Derya bacak bacak üstüne atmıştı; ayağını sallamayı kesti.
~ Son söz. Kanun onu sanığa verir; avukata değil. Burada benim işim bitiyor. Bundan sonrası bir çocuğun sesi.
`),
      next: 'T_08',
      choices: [
        option('L_SAAT', '“Ben o kadının saatini almadım. Kim aldıysa, saatini versin.”', {
          score: { SAVUNMA_STRATEJISI: 50 },
          effects: [inc('pers')],
          good: 'Sanığın kendi sesiyle, mağdura dönük, suçlamasız bir son söz.',
          category: 'SAVUNMA_STRATEJISI',
          responses: [
            W(
              flag('tolga_teslim'),
              `
baris: Ben o kadının saatini almadım. Ama saati alan benim kardeşim gibi biriydi. Ben ondan özür dilerim. Onun yerine. Nermin teyzeden.
> Nermin Hanım dinleyici sırasında ayağa kalktı. Bir şey söylemedi. Sonra yeniden oturdu.
`,
            ),
            W(
              flag('baris_anlatti'),
              `
baris: Ben o kadının saatini almadım Sayın Başkan. Hesabımı verdim; onu söyledim. Kim aldıysa… o da bir gün söylesin. Kadının saatini versin.
> Salonun arkasında Nermin Hanım başını eğdi. Derya’nın elleri dizlerinin üstünde kenetlendi.
`,
            ),
            O(`
baris: Ben o kadının saatini almadım Sayın Başkan. Kim aldıysa… ona da söyleyin. Kadının saatini versin. Kocasının saatiymiş.
> Salonun arkasında Nermin Hanım başını eğdi.
`),
          ],
        }),
        option('L_SESSIZ', '“Bir şey söylemeyeceğim.”', {
          neutral: 'Sanığın son söz hakkı; susmak da bir hak.',
          responses: B(`
baris: Bir şey söylemeyeceğim Sayın Başkan. Avukatım söyledi.
> Söylememiştim. Ama söylemiş gibi oldu.
`),
        }),
        option('L_ANNE', '“Beni bırakın; annem hasta.”', {
          neutral: 'Sanığın kişisel durumu takdiri indirimde gözetilebilir; ama son söz delil değildir.',
          responses: B(`
baris: Annem hasta Sayın Başkan. Şekeri var. Ben bakıyorum. Beni bırakın.
> Sevim Hanım tespihini göğsüne bastırdı.
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
`,
        ),
        W(
          flag('closing_terdit'),
          `
> Heyet müzakereye çekildi. Kırk dakika. Barış bana döndü: “Abla, sekiz yıl ne demek?” Cevap vermedim. Terditli bir savunma, müvekkile iki cevap birden verir; ikisi de doğru, ikisi de ağır.
sukru: Taraflar salona! Hükmü ayakta dinleyin. Hı-hım.
`,
        ),
        W(
          any(flag('closing_masumiyet'), flag('closing_usul')),
          `
> Heyet müzakereye çekildi. Kırk dakika. Koridorda Sevim Hanım’ın tespihi, Derya’nın çakmağı, Nermin Hanım’ın kızının termos kapağı.
> Barış ayağa kalkıp pencereye gitti. Aşağıda adliye otoparkı, bir sıra motor, sarı bir kutu. Uzun uzun baktı.
sukru: Taraflar salona! Hükmü ayakta dinleyin. Hı-hım.
~ Hüküm ayakta dinlenir. Kanun böyle der. Ayakta durmak, düşmeye hazır olmaktır belki.
`,
        ),
        O(`
> Heyet müzakereye çekildi. Kırk dakika. Koridorda Sevim Hanım’ın tespihi, Derya’nın çakmağı, Nermin Hanım’ın kızının termos kapağı.
sukru: Taraflar salona! Hükmü ayakta dinleyin. Hı-hım.
~ Hüküm ayakta dinlenir. Kanun böyle der. Ayakta durmak, düşmeye hazır olmaktır belki.
`),
      ],
    }),
    story('T_INT_COKUS', {
      ...H2,
      title: 'Çöküş',
      background: 'durusma_salonu',
      lines: B(`
> Bir yanlış daha. Başkan kalemini bıraktı. Elif Karaca dosyayı kapattı. Savcı bana bakmadı bile; bakmasına gerek yoktu.
rahmi: Müdafi, sunduklarınızın dosyayla ilgisi kalmadı. Mahkeme yeterince dinledi. Tarafların son beyanları alındı kabul edilerek hüküm için ara verilecek.
~ Güvenimi tek tek harcadım. Her yanlış kâğıt bir kalp götürdü. Şimdi kalbim yok, sadece bir dosyam var.
`),
      choices: [cont('COKUS_DEVAM', 'Hüküm', 'T_08', { role: 'PRIMARY' })],
    }),
    resultNode('R_KARAR', { ...H2, title: 'Karar', background: 'durusma_salonu' }),
  ],
};
