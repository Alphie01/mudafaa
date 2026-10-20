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
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, O, S, W } from './dsl.js';
import { wrongEvidence } from './hearing-1.js';
import { TRIAL, VERDICT, court2, gercekProven } from './shared.js';

// 80-trial: 2. celse. Açılış (gelen raporlar), Bayram'ın tanıklığı (B1–B5), Sinan (S1–S4) ya da boş kürsü, Muzaffer,
// ek savunma bildirimi (CMK 226), mütalaa ve cevap, esas savunma, son söz, hüküm.

const bekleyenler = S`
  - Pencereden soluk bir güneş giriyordu; yağmur gece dinmiş, Uludağ'ın üstünde bir bulut kalmıştı. Tozun içinde ışıktan bir sütun.
  - Savcı Kenan Yavuz salona girerken dosyasını iki eliyle taşıyordu; geçen celse tek eliyle taşımıştı. Komiser izleyici sıralarında, en arkada oturdu. Ferda Yalçın da gelmişti; bordo ceketiyle, kurumun yüzü.
`;

const savcilik = (id: string, statementId: string | undefined) =>
  presentRule(id, statementId, ['ev_tutanak', 'ev_dinleme', 'ev_ihbar', 'ev_halil_ifade', 'ev_para'], {
    maxUses: 3,
    effects: [...wrongEvidence, mark('BAD', 'İddianın dayanağı olan belgeyi savunma delili gibi sundun.', 'SORGULAMA')],
    responses: B(S`
      savci: Sayın Başkan, müdafi yine bizim delilimizi sunuyor.
      baskan: Müdafi, bu belge tanığın beyanını destekliyor. Ne göstermek istediniz?
    `),
  });

export const trial: CasePart = {
  court: {
    sessions: [
      courtSession('cs_2', '2. Celse', [
        ['s2_acilis', 'ACILIS', 'T_00'],
        ['s2_tanik', 'TANIK_DINLEME', 'T_01'],
        ['s2_delil', 'DELIL_TARTISMA', 'T_04'],
        ['s2_mutalaa', 'MUTALAA', 'T_05'],
        ['s2_savunma', 'SAVUNMA', 'T_07'],
        ['s2_son_soz', 'SON_SOZ', 'T_08'],
        ['s2_karar', 'KARAR', 'T_09'],
      ]),
    ],
  },
  nodes: [
    story('T_KORIDOR', {
      ...TRIAL,
      title: 'Koridor',
      background: 'adliye',
      lines: [
        W(
          flag('halil_tahliye'),
          S`
            = 31 MAYIS 2027 · 09.20 — BURSA ADLİYESİ, 4. KAT @adliye
            - Halil koridorun başında, pencerenin önünde duruyordu. Annesinin aldığı kravat. Elinde bir dosya; kendi dosyası değil, bir boş dosya. "Elim boş durmasın diye" dedi. "Yirmi yedi yıl hiç boş durmadı."
            - Zehra yanında, gece nöbetinden çıkmış; elinde iki karton bardak çay. Birini babasına uzattı. Halil çayı aldı, kapağının yazısını düzeltti, içmedi.
            halil: Avukat hanım. Bugün o adam da gelecek, değil mi? Muhbir. Bir de... diğerleri. Bakmayacağım. Kural gereği değil; bakarsam bir şey söylerim diye.
            - Merdivenden Muzaffer Usta çıktı; elinde bir tepsi, tepside tek bir ince belli bardak. Halil'in önünde durdu. "Dokuz yirmi" dedi. "Geç kaldım, kusura bakma Halil Bey." Halil bardağı aldı; bu sefer içti.
          `,
        ),
        O(S`
          = 31 MAYIS 2027 · 09.20 — BURSA ADLİYESİ, 4. KAT @adliye
          - Koridorda Zehra bekliyordu. Gece nöbetinden çıkmış; elinde iki karton bardak çay. "Biri babama" dedi. "Ring gelince veremezler, biliyorum. Ama yine de aldım."
          - Asansör açıldı; jandarmalar Halil'i getirdi. Halil kızını gördü, kelepçeli elleriyle ceketinin önünü düzeltmeye çalıştı, beceremedi.
          halil: Avukat hanım. Bugün o adam da gelecek, değil mi? Bakmayacağım. Bakarsam bir şey söylerim.
        `),
      ],
      choices: [
        option('TK_A', '“Bakmayın. Kâğıtlar bakacak.”', {
          effects: [inc('trust', 2), raise('tk_kagit')],
          responses: B(S`
            halil: Kâğıtlar. Evet. Ben kâğıtlara güvenirim. İnsanlara... artık daha az.
            - Leyla merdivenden çıktı, bize doğru yürüdü, bir şey söylemeden Halil'in elini sıktı. Kısa, sert, yirmi yıllık bir avukatın el sıkışı.
            leyla: Halil Bey. Bugün çok konuşmayın. Bugün başkaları konuşacak.
          `),
          next: 'T_00',
        }),
        option('TK_B', '“Bugün ne olursa olsun, sonuna kadar buradayım.”', {
          effects: [raise('tk_soz')],
          responses: B(S`
            halil: Söz vermeyin, avukat hanım. Söz, kayda geçmeyen bir taahhüttür. Siz kayda geçeni yapın.
            - Zehra güldü; nöbetten çıkmış birinin, yorgunluktan gelen kısa gülüşü.
            zehra: Gördünüz mü? Hâkim Bey. Her zaman.
          `),
          next: 'T_00',
        }),
      ],
    }),
    court2.stage('T_00', {
      title: 'Duruşma · 2. Celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('halil_tahliye'),
          S`
            = 31 MAYIS 2027 · 10.00 — BURSA 5. AĞIR CEZA MAHKEMESİ · 2. CELSE @durusma_salonu
            mubasir: Halil Ekinci dosyası! Sanık, müdafi, tanıklar! Halil Ekinci!
            - Halil bu sefer salona kapıdan, kendi ayaklarıyla girdi. Annesinin aldığı kravat, burnunda gözlük. Sanık sırasına oturmadan önce sıranın kenarını avucuyla sildi.
            - Arka sırada Zehra; yanında, elinde bir saksı tutan bir kadın gibi, ama saksı yoktu. Yalnızca elleri.
          `,
        ),
        O(S`
          = 31 MAYIS 2027 · 10.00 — BURSA 5. AĞIR CEZA MAHKEMESİ · 2. CELSE @durusma_salonu
          mubasir: Halil Ekinci dosyası! Sanık, müdafi, tanıklar! Halil Ekinci!
          - Halil'i yine iki jandarma getirdi. Kelepçe çözüldüğünde bileklerini ovmadı; ceketinin kollarını düzeltti. Gözlüğü burnundaydı.
          - Arka sırada Zehra. Bu sefer ceket yok; forması üstünde, nöbetten doğruca gelmiş.
        `),
      ],
      onFirstEnter: [raise('in_court2')],
      choices: [cont('T00_DEVAM', 'Raporlar', 'T_00R')],
    }),
    decisionNode('T_00R', [{ to: 'T_00E' }], {
      ...TRIAL,
      lines: [
        W(
          any(has('ev_santral'), has('ev_cihaz'), has('ev_kamera'), has('ev_sonlandirma')),
          S`
            baskan: Ara karar cevapları dosyaya girdi; taraflara tebliğ edildi. Santral dökümü, kamera görüntüsü, bilirkişi raporu, ne geldiyse okundu sayıldı. Taraflar biliyor.
            - Savcı Kenan Yavuz dosyasını açtı. Bu sefer bir sayfayı uzun uzun okudu; geçen celse okumadan konuşmuştu.
          `,
        ),
        O(S`
          baskan: Ara karar cevapları dosyaya girdi. Tanıkların dinlenmesine geçiyoruz.
          - Savcı dosyasını açmadı. Bazı savcılar dosyayı ezberler; bazıları dosyanın onları ezberlediğine inanır.
        `),
      ],
    }),
    decisionNode('T_00E', [{ to: 'T_00Q' }], {
      ...TRIAL,
      lines: [
        W(
          flag('etki_muzaffer'),
          S`
            - Savcı dosyaya yeni bir sayfa ekletti: Muzaffer Kılınç'ın Başsavcılığa verdiği dilekçe. "Avukat hanım bana adamın yüzünü de gördüğümü söylememi istedi. Ben görmedim. Yazılsın."
            - Savcı o sayfayı okurken bana bakmadı. Bakmasına gerek yoktu.
            ~ Bir çaycı yirmi yıllık "günaydın"ını korudu. Benim yerime.
          `,
        ),
      ],
    }),
    decisionNode('T_00Q', [{ to: 'T_00S' }], {
      ...TRIAL,
      lines: [
        W(
          all(flag('suc_duyurusu'), flag('halil_sinan')),
          S`- Savcılık kalemi suç duyurumun numarasını dosyaya eklemişti. Halil'in "kâğıtlarınız söylesin" cümlesi aklımdaydı; kâğıtlar artık hem bu dosyada hem başka bir dosyada konuşuyordu.`,
        ),
        W(
          flag('suc_duyurusu'),
          S`- Savcılık kalemi suç duyurumun numarasını dosyaya eklemişti. Savcı Kenan Yavuz o numaraya bir kez baktı, sonra bana; bir şey söylemedi.`,
        ),
        W(
          flag('suc_cengiz'),
          S`- Müteahhit hakkındaki dilekçem dosyaya "ayrıca değerlendirilmek üzere" diye girmişti. Savcı sayfayı çevirirken dudaklarını büzdü. Öfke, bir dilekçede iz bırakır.`,
        ),
        W(
          flag('sinan_uyarildi'),
          S`- Otoparkta sorduğum soru aklımdaydı. "Biri, avukat hanım. Bir kişi." Bugün o kişi hazırlıklı gelecek; ona hazırlanma fırsatını ben verdim.`,
        ),
        W(
          flag('son_mesaj'),
          S`- Zehra sabah bir mesaj daha atmıştı: "Babam uyumadı. Kravatını dört kez bağladı. Sonunda annemin aldığında karar kıldı."`,
        ),
      ],
    }),
    story('T_00S', {
      ...court2.base,
      title: 'Koridorda bekleyenler',
      background: 'durusma_salonu',
      lines: [
        W(
          all(flag('sinan_cagrildi'), flag('muzaffer_cagrildi')),
          [
            ...S`- Salonun dışında bekleyen tanıklar sıraya girmişti: tespihini kucağında tutan bir takipçi, ütülü açık renk ceketiyle bir memur ve önlüğünün cebinde bir defterle yaşlı bir çaycı.`,
            ...bekleyenler,
            ...S`~ Üç tanık, bir zarf, on dakika. Bugün o on dakika bir kez daha yaşanacak; bu sefer yüksek sesle.`,
          ],
        ),
        W(flag('sinan_cagrildi'), [
          ...S`- Salonun dışında bekleyen tanıklar sıraya girmişti: tespihini kucağında tutan bir takipçi ve ütülü açık renk ceketiyle bir memur.`,
          ...bekleyenler,
          ...S`~ İki tanık, bir zarf, on dakika. Bugün o on dakika bir kez daha yaşanacak; bu sefer yüksek sesle.`,
        ]),
        W(flag('muzaffer_cagrildi'), [
          ...S`- Salonun dışında bekleyen tanıklar sıraya girmişti: tespihini kucağında tutan bir takipçi ve önlüğünün cebinde bir defterle yaşlı bir çaycı.`,
          ...bekleyenler,
          ...S`~ İki tanık, bir zarf, on dakika. Bugün o on dakika bir kez daha yaşanacak; bu sefer yüksek sesle.`,
        ]),
        O([
          ...S`- Salonun dışındaki bankta tek bir tanık bekliyordu: tespihini kucağında tutan bir takipçi. Yanındaki yer boştu.`,
          ...bekleyenler,
          ...S`~ Bir tanık, bir zarf, on dakika. Bugün o on dakika bir kez daha yaşanacak; bu sefer yüksek sesle.`,
        ]),
      ],
      choices: [cont('T00S_DEVAM', 'Tanık: Bayram Öz', 'T_01')],
    }),
    court2.stage('T_01', {
      title: 'Tanık: muhbir',
      courtStage: 'TANIK_DINLEME',
      witness: 'bayram',
      witnessLabel: 'TANIK · BAYRAM ÖZ',
      onFirstEnter: [meet('bayram')],
      lines: [
        W(
          flag('etki_bayram'),
          S`
            mubasir: Tanık Bayram Öz!
            - Bayram yalnız girdi. Tespihini cebine koydu, sonra çıkardı. Kürsüye geçmeden önce bana baktı; bir talimat bekler gibi.
            baskan: Tanık, yemin edeceksiniz. Ancak sizi veya yakınlarınızı ceza kovuşturmasına uğratabilecek sorulara cevap vermekten çekinebilirsiniz. Anladınız mı?
            bayram: Anladım, efendim. Ben... avukat abla ne diyeceğimi söyledi. "Odaya girmedim de, başka bir şey deme" dedi. Ben de onu diyeceğim.
            - Salon bir an dondu. Savcı Kenan Yavuz yavaşça ayağa kalktı.
            savci: Sayın Başkan, tanığın bu sözlerinin tutanağa aynen geçirilmesini talep ediyorum.
            baskan: Geçirilsin. Müdafi, bunu ayrıca konuşacağız.
            ~ Bir cümle verdim. Sahibine geri döndü; salonun ortasında, herkesin önünde.
          `,
        ),
        W(
          flag('bayram_avukat'),
          S`
            mubasir: Tanık Bayram Öz!
            - Bayram yanında genç bir avukatla girdi; adli yardım bürosundan. Tespihini cebine koydu, sonra çıkardı, sonra yine koydu.
            baskan: Tanık, yemin edeceksiniz. Ancak sizi veya yakınlarınızı ceza kovuşturmasına uğratabilecek sorulara cevap vermekten çekinebilirsiniz. Anladınız mı?
            bayram: Anladım, efendim. Avukatım da anlattı. Ben... konuşacağım.
          `,
        ),
        O(S`
          mubasir: Tanık Bayram Öz!
          - Bayram yalnız girdi. Tespihini cebine koydu, sonra çıkardı, sonra yine koydu. Komiser'in oturduğu sıraya baktı; komiser başını çevirdi.
          baskan: Tanık, yemin edeceksiniz. Ancak sizi veya yakınlarınızı ceza kovuşturmasına uğratabilecek sorulara cevap vermekten çekinebilirsiniz. Anladınız mı?
          bayram: Anladım, efendim. Ben ihbarcıyım zaten.
        `),
      ],
      choices: [cont('T01_DEVAM', 'Tanığı dinle', 'T_01T')],
    }),
    court2.testimony('T_01T', {
      title: 'Çapraz sorgu: Bayram Öz',
      courtStage: 'TANIK_DINLEME',
      witness: 'bayram',
      witnessLabel: 'TANIK · BAYRAM ÖZ',
      say: S`
        baskan: Tanık, olayı anlatın. Sonra müdafi sorularını soracak.
        - Bayram anlattı. İki ifadesini birden; aralarındaki duvarı görmeden. Her cümlenin sonunda tespihin bir boncuğunu çekti.
      `,
      rulesText:
        'Önce bastır, sonra doğru delille vur. Muhbirin iki hikâyesi var; hangisinin hangi kâğıtla çöktüğünü bul.',
      objectionGrounds: ['g_kanaat', 'g_duyum'],
      statements: [
        statement('B1', 1, [
          'Halil Bey dosyamı bekletti. ',
          hl('“Kırk bin getirmezsen bu dosya bu masadan çıkmaz” dedi', any(flag('press_b1'), has('ded_yetkisiz'))),
          '.',
        ]),
        statement('B2', 2, [
          'Sonra konuştuk, anlaştık. ',
          hl('Halil Bey’in herkesten aldığı bilinir zaten'),
          '; ben de kabul ettim.',
        ]),
        statement('B3', 3, [
          'O sabah ',
          hl('zarfı kendi elimle Halil Bey’e verdim', any(flag('press_b3'), has('ded_bos_oda'))),
          '; o da çekmeceye koydu.',
        ]),
        statement('B4', 4, [
          'Kayıt cihazı ',
          hl('kendiliğinden kapandı; cızırdadı, sustu', any(flag('press_b4'), has('clue_manuel'))),
          '. Ben elimi sürmedim.',
        ]),
        statement(
          'B5',
          5,
          [
            '…Tamam. Odaya girmedim. ',
            hl('Koridorda birine verdim; “Halil Bey’e ben iletirim” dedi', any(flag('press_b5'), has('ded_tek_kisi'))),
            '.',
          ],
          all(flag('contra_b3'), any(flag('contra_b4'), has('clue_fisilti'))),
        ),
      ],
      rules: [
        presentRule('PS_B_SIRA', undefined, ['ev_sira_disi'], {
          maxUses: 1,
          effects: [
            ...wrongEvidence,
            raise('sira_savcida'),
            mark(
              'BAD',
              'Randevu kaydını muhbire karşı sunmak, onun “iş karşılığı” anlatısını güçlendirdi.',
              'SAVUNMA_STRATEJISI',
            ),
          ],
          responses: B(S`
            bayram: Evet! İşte! Halil Bey bana iyilik yaptı, sırayı öne aldı! Ben de... ben de karşılığını...
            savci: Teşekkürler, müdafi.
            ~ Halil'in tek eğilişini, muhbirin ağzına bir kanıt gibi koydum.
          `),
        }),
        savcilik('PS_B_SAVCILIK', undefined),
        pressRule('PR_B1', 'B1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b1')],
          responses: B(S`
            > Dosyanız hangi serviste bekliyordu?
            bayram: Halil Bey'in masasında... yani, kontrolde. Her dosya kontrolden geçer abla, herkes bilir.
            > Sizin dosyanız kontrole sevk edilmiş miydi?
            bayram: Bilmem ki. Ben takipçiyim; dosya nerede, onu Sinan Bey... yani memurlar bilir.
          `),
        }),
        presentRule('PS_B1', 'B1', ['ded_yetkisiz'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_b1'),
            mark(
              'GOOD',
              'İrtikap anlatısının çekirdeği çöktü: dosya Devir-2’deydi, kontrol servisine hiç gelmemişti; memurun bekletebileceği bir iş yoktu (TCK 250/1: nüfuz ve icbar).',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > İş dağıtım kaydı, Sayın Başkan. Başvuru 2027/3318, Devir Servisi-2'ye atanmış, şerh nedeniyle orada beklemede. Kontrol servisine hiç sevk edilmemiş.
            > Sanığın masasında olmayan bir dosyayı sanık bekletemez. "Bu masadan çıkmaz" denen masa, sanığın masası değil.
            bayram/saskin: Ama... bana Halil Bey bekletiyor dediler. Ben de öyle bildim.
            baskan: Kim dedi, tanık?
            bayram: ...Herkes, efendim. Koridorda.
            - Defne Sezer bir şey yazdı. "Herkes" kelimesinin altını çizdiğini gördüm.
          `),
        }),
        pressRule('PR_B2', 'B2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b2')],
          responses: B(S`
            > "Anlaştık." Nerede, ne zaman anlaştınız?
            bayram: Telefonda. Yani... yüz yüze. Koridorda. Bir kere çayda. Tam hatırlamıyorum abla, babam ölüyordu.
            > On bir Mart gecesi Emniyet'te "zorla istedi" demişsiniz. İki gün sonra savcılıkta "anlaştık".
          `),
        }),
        presentRule('PS_B2', 'B2', ['ded_iki_hikaye'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_b2'),
            mark(
              'GOOD',
              'Muhbirin iki anlatısı birbirini dışlıyor: önce icbar (irtikap, muhbir mağdur), sonra anlaşma (rüşvet, muhbir suç ortağı; TCK 254/2 ile korunuyor).',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Sayın Başkan, iki ifade. On bir Mart: "Kırk bin getirmezsen bu dosya çıkmaz dedi, mecbur kaldım." On üç Mart: "Anlaştık, ben de kabul ettim."
            > Birinde muhbir zorlanmış bir mağdur. Öbüründe pazarlık eden bir ortak; ve ancak önceden haber verdiği için cezadan kurtulan biri. İkisi aynı anda doğru olamaz.
            bayram: Ben... ikisi de doğru abla. Önce zorladı, sonra anlaştık. Yani...
            savci: Sayın Başkan, tanık heyecanlı.
            baskan: Not edildi, savcı bey. Heyecan da, çelişki de.
          `),
        }),
        objectRule('OB_B2', 'B2', 'g_duyum', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('pers'),
            inc('legal_hits'),
            raise('obj_b2'),
            mark(
              'GOOD',
              'İtiraz yerinde: “herkesten aldığı bilinir” bir söylentidir; tanık bilmediği bir şeyi aktarıyor.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > İtiraz, Sayın Başkan. "Bilinir" bir tanıklık değil, bir söylenti. Tanık kimden, ne zaman duyduğunu söylemiyor.
            baskan: Kabul. Tanık, bildiğinizi anlatın; koridorda konuşulanları değil.
          `),
        }),
        pressRule('PR_B3', 'B3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b3')],
          responses: B(S`
            > Zarfı verdiğinizde Halil Bey ne dedi? Odada başka kim vardı?
            bayram: Bir şey demedi. Aldı. Koydu. Kimse yoktu. Yani... ben verdim, çıktım.
            > Saat kaçtı?
            bayram: On kırk gibi. Tam bilmem. Saatim yok; telefona bakmadım.
          `),
        }),
        presentRule('PS_B3', 'B3', ['ded_bos_oda', 'ev_kamera'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_b3'),
            ifThen(has('clue_kare_saat'), [raise('kamera_b3')]),
            mark(
              'GOOD',
              'Muhbirin “kendi elimle verdim”i tutanağın saatleriyle ve kamerayla çöktü: sanık o dakikalarda odasında değildi.',
              'SORGULAMA',
            ),
          ],
          responses: [
            W(
              has('clue_kare_saat'),
              S`
                > Koridor kamerası, Sayın Başkan. 10.36'da sanık merdivenden iniyor. 10.41.07'de kontrol odasının kapısı açılıyor; açık renk ceketli biri giriyor, yirmi saniye sonra çıkıyor. Sanık o sırada bir alt katta.
                > Tutanak da aynı şeyi söylüyor: 10.44'te oda boş, 10.46'da sanık geliyor. Tanık "elden verdim" diyor. Hangi ele?
                bayram/uzgun: Ben... ben odaya girmedim, efendim. Görüntüde ben yokum, değil mi? Ben yokum.
                - Salonda bir uğultu. Başkan tokmağa uzanmadı; uğultu kendiliğinden söndü.
              `,
            ),
            O(S`
              > Tutanak, Sayın Başkan. 10.39 kayıt kesiliyor; 10.44'te ekip odaya giriyor ve "şüpheli odada bulunmamaktadır." 10.46'da sanık geliyor.
              > Tanık zarfı "kendi elimle Halil Bey'e verdim" diyor. Halil Bey o dakikalarda bir alt katta, kimsenin çağırmadığı bir randevuyu bekliyordu.
              bayram/uzgun: Ben... belki odada değildi. Belki ben masaya bıraktım. Bilmiyorum, efendim. Karışık bir sabahtı.
            `),
          ],
        }),
        pressRule('PR_B4', 'B4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b4')],
          responses: B(S`
            > Cihazın bir tuşu var mıydı?
            bayram: Vardı. Komiser bey gösterdi: "Buna basma" dedi. Ben basmadım. Kendiliğinden sustu.
          `),
        }),
        presentRule('PS_B4', 'B4', ['ev_cihaz'], {
          visibleWhen: has('clue_manuel'),
          enabledWhen: has('clue_manuel'),
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_b4'),
            mark(
              'GOOD',
              'Bilirkişi raporu: kayıt 10.39.12’de fiziksel tuşla durdurulmuş, pil %68, arıza yok. “Teknik arıza” çöktü.',
              'SORGULAMA',
            ),
          ],
          responses: [
            W(
              has('clue_fisilti'),
              S`
                > Bilirkişi raporu, Sayın Başkan. "10.39.12 — STOP — fiziksel tuş." Pil yüzde altmış sekiz, arıza kaydı yok. Cihaz susmamış; susturulmuş.
                > Ve susturulmadan önceki son otuz saniye. Kolluğun "anlaşılmayan konuşmalar" dediği kısım. Bilirkişi açmış: muhbirin yanında ikinci bir ses. "Burada değil. Bana ver. Ben bırakırım. Üçüncü çekmece."
                - Salon dondu. Bayram tespihini bıraktı; tespih kürsünün tahtasına çarptı, sesi bütün salonda duyuldu.
                bayram/uzgun: Ben bastım. Ben bastım, efendim. O... "kapat şunu" dedi. Ben de kapattım.
              `,
            ),
            O(S`
              > Bilirkişi raporu, Sayın Başkan. "10.39.12 — STOP — fiziksel tuş." Pil yüzde altmış sekiz, arıza kaydı yok. Cihaz susmamış; susturulmuş.
              bayram/uzgun: Ben... ben bastım. Korktum. Bir şey söyleyecektim, kaydedilmesin istedim.
              baskan: Ne söyleyecektiniz, tanık?
              bayram: ...Hatırlamıyorum, efendim.
            `),
          ],
        }),
        objectRule('OB_B4', 'B4', 'g_kanaat', {
          score: { SORGULAMA: -20 },
          effects: [
            dec('cred'),
            mark(
              'BAD',
              'Tanık kendi gözlemini anlatıyor; kanaat itirazı yerinde değil. Belgeyle çürütmek gerekiyordu.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`baskan: Tanık gördüğünü anlatıyor, müdafi. Reddedildi. Belgeniz varsa gösterin.`),
        }),
        pressRule('PR_B5', 'B5', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b5')],
          responses: B(S`
            > Kime verdiniz?
            bayram/uzgun: Söylersem... söylersem bu binada bir daha iş bulamam, abla. Takipçiyim ben. O bina benim ekmeğim.
            baskan: Tanık, cevap vermeyebilirsiniz; hakkınız. Ama verirseniz doğrusunu verin.
            - Bayram avukatına baktı. Sonra bana. Sonra yere.
          `),
        }),
        presentRule('PS_B5', 'B5', ['ded_tek_kisi', 'ded_zarf_kaynagi', 'ded_kameradaki'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_b5'),
            raise('bayram_ifsa'),
            mark(
              'GOOD',
              'Zarfın kaynağı ve sahte çağrının tek masası muhbirin karşısına kondu; muhbir zarfı kime verdiğini söyledi.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Sayın Başkan, sanığı odasından indiren çağrı Devir Servisi-2'nin dahilisinden yapıldı. O sabah o odada tek bir memur vardı. Zarf da o servisin destesinden.
            > Tanığa soruyorum: zarfı koridorda kime verdiniz?
            - Bayram uzun süre sustu. Salonun arkasında, tanık bekleme kapısının camında bir gölge kıpırdadı.
            bayram/uzgun: Sinan Bey'e. Arşivin kapısında. "Halil Bey odasında yok, bana ver, ben bırakırım" dedi. Kaydı kapat dedi. Ben kapattım. Sonra "tamam" yazdım komisere.
            bayram: Sinan Bey dedi polise git, "kontrolcü para istiyor" de. Borcumu silecekti. Ateşoğlu'na olan borcumu. Babam ölüyordu, abla. Ben... ben kötü biri değilim.
            - Salon uğuldadı. Başkan tokmağı vurdu. Savcı ayağa kalkmadı; ama kalemi elinden düştü, almadı. !shake
          `),
        }),
      ],
      presentMiss: fallback('FB_B_PRESENT', 'PRESENT', {
        effects: [...wrongEvidence, mark('BAD', 'Sunulan delil ifadeyle ilgisiz; güvenilirlik düştü.', 'SORGULAMA')],
        responses: B(S`
          baskan: Müdafi, bu belgenin bu beyanla ilgisini göremiyorum.
          bayram: Ben de göremiyorum, efendim.
        `),
      }),
      objectMiss: fallback('FB_B_OBJECT', 'OBJECT', {
        effects: [dec('cred'), score('SORGULAMA', -50, 'hatali'), mark('BAD', 'Dayanaksız itiraz.', 'SORGULAMA')],
        responses: B(S`baskan: İtiraz reddedildi. Devam edin.`),
      }),
      finish: { id: 'T01T_BITIR', label: 'Çapraz sorguyu bitir', next: 'T_02R' },
    }),
    decisionNode(
      'T_02R',
      [{ when: flag('sinan_cagrildi'), to: 'T_02' }, { when: flag('bayram_ifsa'), to: 'T_02B' }, { to: 'T_02N' }],
      {
        ...TRIAL,
        lines: [
          W(
            all(flag('press_b2'), not(flag('contra_b2'))),
            S`- Bayram kürsüden inerken "anlaştık" ile "zorladı" arasındaki boşluk salonda asılı kaldı. Onu bir kâğıtla doldurmadım; heyet kendi doldurur.`,
          ),
        ],
      },
    ),
    story('T_02B', {
      ...court2.base,
      title: 'Boş sandalye',
      background: 'durusma_salonu',
      lines: B(S`
        savci: Sayın Başkan, tanığın beyanı karşısında Sinan Kaplan hakkında suç duyurusunda bulunacağımızı bildiririz. Tanık olarak dinlenmesini de talep ederiz.
        baskan: Sinan Kaplan bu duruşmaya çağrılmamıştı. Beyan tutanağa geçti; dosyanın bir örneği Başsavcılığa gönderilecek.
        ~ Bir isim salona girdi. Sahibi girmedi. Mahkeme o ismi kendi kürsüsünde sınamayacak; ama savcılık sınayacak.
      `),
      choices: [cont('T02B_DEVAM', 'Devam', 'T_03R')],
    }),
    story('T_02N', {
      ...court2.base,
      title: 'Kürsü',
      background: 'durusma_salonu',
      lines: B(S`
        baskan: Başka tanık çağrılmamıştır. Tanık Bayram Öz'ün beyanı tutanağa geçti.
        - Tanık kürsüsü boşaldı. Bekleme kapısının camında bir gölge, bir süre durdu, sonra uzaklaştı. Kimin olduğunu kimse sormadı.
        - Savcı dosyasında bir sayfa çevirdi; iki yüz on dört numarası geçen sayfayı. Bir şey yazmadı. Başkan da sormadı; mahkeme, kimsenin istemediği tanığı kendiliğinden çağırmaz her zaman.
        ~ Bir kapıyı aralık bıraktım. İçeri girecek kişiyi salona çağırmadım. Bugün o kapıdan girmesi gereken soru, bir suç duyurusunun numarasında bekleyecek.
      `),
      choices: [cont('T02N_DEVAM', 'Devam', 'T_03R')],
    }),
    court2.stage('T_02', {
      title: 'Tanık: Devir Servisi-2',
      courtStage: 'TANIK_DINLEME',
      witness: 'sinan',
      witnessLabel: 'TANIK · SİNAN KAPLAN',
      onFirstEnter: [meet('sinan')],
      lines: B(S`
        mubasir: Tanık Sinan Kaplan!
        - Sinan açık renk ceketiyle girdi. Kürsüye geçerken Halil'e başıyla selam verdi; "abi" der gibi. Halil karşılık vermedi; gözlüğünü düzeltti.
        baskan: Kimliğiniz tespit edildi. Yemin edeceksiniz. Sizi ceza kovuşturmasına uğratabilecek sorulara cevap vermekten çekinebilirsiniz.
        sinan: Anladım, Sayın Başkan. Saklayacak bir şeyim yok. Halil abi bizim büyüğümüzdür; ne gerekiyorsa söylerim.
        - Bileğine baktı. Saat yeşil yandı, söndü.
      `),
      choices: [cont('T02_DEVAM', 'Tanığı dinle', 'T_02T')],
    }),
    court2.testimony('T_02T', {
      title: 'Çapraz sorgu: Sinan Kaplan',
      courtStage: 'TANIK_DINLEME',
      witness: 'sinan',
      witnessLabel: 'TANIK · SİNAN KAPLAN',
      say: S`
        baskan: Tanık, 12 Mart sabahını anlatın.
        - Sinan anlattı. Sıcak, akıcı, her ayrıntısı yerinde bir anlatı; bir parsel geçmişi gibi düzenli.
      `,
      rulesText: 'Tanığın her cümlesinin yanına bir kâğıt koy. Kanaatlerine itiraz edebilirsin.',
      objectionGrounds: ['g_kanaat', 'g_duyum'],
      statements: [
        statement('S1', 1, [
          'O sabah ',
          hl('10.30’dan 10.50’ye kadar arşivdeydim', any(flag('press_s1'), has('ded_alibi'))),
          '; kadastro paftalarıyla uğraşıyordum.',
        ]),
        statement('S2', 2, [
          hl('Halil abiyi o sabah hiç aramadım', any(flag('press_s2'), has('clue_214_cagri'))),
          '; aramam için bir sebep yoktu.',
        ]),
        statement('S3', 3, [
          'Zarflar koridordaki dolaptan; ',
          hl('herkes alır, kimin zarfı olduğu belli olmaz', any(flag('press_s3'), has('ded_zarf_kaynagi'))),
          '.',
        ]),
        statement('S4', 4, [
          'Halil abiyle bir sorunum yoktu; benim ne çıkarım olur? ',
          hl('Yorgun insanlar hata yapar; abi de yorgundu'),
          '.',
        ]),
      ],
      rules: [
        savcilik('PS_S_SAVCILIK', undefined),
        pressRule('PR_S1', 'S1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s1')],
          responses: B(S`
            > Arşivde yalnız mıydınız? Sizi gören oldu mu?
            sinan: Yalnızdım. Arşive kimse gelmez ki. Ben bile zor giderim.
            > Arşive çay ısmarladınız mı?
            sinan: ...Ismarlamış olabilirim. Her gün ısmarlarım. Hatırlamıyorum.
          `),
        }),
        presentRule('PS_S1', 'S1', ['ded_alibi', 'ded_kameradaki'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_s1'),
            mark('GOOD', 'Tanığın alibisi çöktü: arşive ısmarladığı çay boş bir odaya götürülmüştü.', 'SORGULAMA'),
          ],
          responses: B(S`
            > Çay ocağının defteri, Sayın Başkan. "10.40 — arşiv — bir çay — S." Santral de aynı dakikayı gösteriyor: 214'ten çay ocağına dokuz saniyelik bir arama.
            > Çay 10.42'de götürülmüş. Defterin kenarında çaycının notu: "boş, masaya bıraktım." Tanık arşivde değildi.
            sinan: Ben... belki tuvalete çıkmışımdır. İki dakika. İnsan tuvalete çıkar.
            baskan: Tanık, az önce "on buçuktan on bire kadar arşivdeydim" dediniz.
            sinan: Kabaca dedim, Sayın Başkan. Kabaca.
            - Saat yeşil yandı. Sinan bileğini kürsünün altına çekti.
          `),
        }),
        pressRule('PR_S2', 'S2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s2')],
          responses: B(S`
            > Sizin odanızın dahilisi kaç?
            sinan: İki yüz on dört. Gülay Hanım'la ortak.
            > O hafta Gülay Hanım neredeydi?
            sinan: ...İzindeydi.
          `),
        }),
        presentRule('PS_S2', 'S2', ['ev_santral', 'ded_tek_kisi', 'ded_sahte_cagri'], {
          enabledWhen: any(has('clue_214_cagri'), has('ded_tek_kisi')),
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_s2'),
            mark(
              'GOOD',
              'Santral: 10.35.08’de 214’ten sanığın hattına 41 saniyelik arama; o hafta 214’te tek memur tanıktı.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Santral dökümü, Sayın Başkan. 10.35.08: iki yüz on dörtten iki yüz otuz bire, kırk bir saniye. Makamın hattı o saatte telekonferansta. İzin çizelgesi: Gülay Erdem izinde.
            > Sanığı "Müdür Hanım çağırıyor" diye odasından indiren arama, o sabah o odadaki tek masadan yapıldı. Tanığın masasından.
            sinan/kizgin: Biri benim telefonumu kullanmış olabilir! Oda açık, herkes girer!
            baskan: Tanık, az önce arşivdeydiniz. Şimdi odanızın açık olduğunu söylüyorsunuz. Hangisi?
            - Sinan cevap vermedi. Avucunun içinde bir nane şekeri kâğıdını katlayıp duruyordu.
          `),
        }),
        pressRule('PR_S3', 'S3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s3')],
          responses: B(S`
            > Zarflar servislere zimmetle mi veriliyor?
            sinan: Veriliyor ama... herkes herkesten alır. Bir zarf için kimse zimmet sormaz.
          `),
        }),
        presentRule('PS_S3', 'S3', ['ded_zarf_kaynagi'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_s3'),
            mark(
              'GOOD',
              'Zarfın barkodu, tanığın servisine zimmetlenen destedendi; zimmet defterinde tanığın parafı var.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Çekmecedeki zarfın barkodu 0417. Zimmet defteri: 0401'den 0450'ye kadar olan deste, 1 Mart'ta Devir Servisi-2'ye teslim edilmiş. Teslim alanın parafı: S.K.
            sinan: Ben... evet, desteyi ben aldım. Ama oradan herkes zarf alır.
            baskan: Kontrol servisinden de mi, tanık?
            sinan: ...Halil abi bizden zarf istemezdi. Kendi zarfları vardı.
          `),
        }),
        objectRule('OB_S4', 'S4', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('pers'),
            inc('legal_hits'),
            raise('obj_s4'),
            mark('GOOD', 'İtiraz yerinde: tanık sanığın ruh hâli hakkında kanaat bildiriyor.', 'SORGULAMA'),
          ],
          responses: B(S`
            > İtiraz. Tanık sanığın yorgunluğu hakkında kanaat bildiriyor. Tanık bir doktor değil; bir mesai arkadaşı.
            baskan: Kabul. Tanık, gördüğünüzü anlatın; yorumunuzu değil.
          `),
        }),
        pressRule('PR_S4', 'S4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s4')],
          responses: B(S`
            > Sanık sizin dosyalarınızdan kaç tanesini geri çevirdi?
            sinan: Birkaç tane. Herkesinkini çevirir. Ben müdür yardımcısı olacağım; birkaç dosya beni ilgilendirmez.
          `),
        }),
        presentRule('PS_S4', 'S4', ['ev_kirmizi_defter', 'ded_hedef'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_s4'),
            mark(
              'GOOD',
              'Kırmızı defter: on bir durdurulmuş dosya, her birinde tanığın parafı; son satır “Müdüre yazılacak.” Tanığın çıkarı ortadaydı.',
              'SORGULAMA',
            ),
          ],
          responses: B(S`
            > Sanığın kırmızı defteri, Sayın Başkan. Ekimden şubata, Ateşoğlu İnşaat'ın on bir dosyası. Her biri şerhli ya da eksik. Her birinin hazırlık parafı: S.K.
            > Son sayfa, iki Mart: "Hepsi aynı elden. Kanıt topla. Müdüre yazılacak." Bu defter on gün sonra müdürün masasına gidecekti. Gitmedi; çünkü yazanı çekmecesiyle birlikte masadan kaldırdılar.
            - Sinan deftere baktı. Bir şey söyleyecek gibi oldu; söylemedi.
            sinan: Ben... bu soruya cevap vermek istemiyorum, Sayın Başkan.
          `),
        }),
      ],
      presentMiss: fallback('FB_S_PRESENT', 'PRESENT', {
        effects: [...wrongEvidence, mark('BAD', 'Sunulan delil ifadeyle ilgisiz; güvenilirlik düştü.', 'SORGULAMA')],
        responses: B(S`
          baskan: Müdafi, bu belgenin bu beyanla ilgisini göremiyorum.
          sinan: Ben de göremiyorum, Sayın Başkan.
        `),
      }),
      objectMiss: fallback('FB_S_OBJECT', 'OBJECT', {
        effects: [dec('cred'), score('SORGULAMA', -50, 'hatali'), mark('BAD', 'Dayanaksız itiraz.', 'SORGULAMA')],
        responses: B(S`baskan: İtiraz reddedildi. Devam edin.`),
      }),
      finish: { id: 'T02T_BITIR', label: 'Çapraz sorguyu bitir', next: 'T_02X' },
    }),
    decisionNode(
      'T_02X',
      [
        {
          when: atLeast(3, flag('contra_s1'), flag('contra_s2'), flag('contra_s3'), flag('contra_s4')),
          to: 'T_02Y',
        },
        { to: 'T_02Z' },
      ],
      {
        ...TRIAL,
        lines: [
          W(
            all(flag('press_s4'), not(flag('contra_s4'))),
            S`- "Benim ne çıkarım olur?" Soru cevapsız kaldı. Cevabı bir defterdeydi; defteri salona getirmemiştim.`,
          ),
        ],
      },
    ),
    story('T_02Y', {
      ...court2.base,
      title: 'Kürsüde',
      background: 'durusma_salonu',
      onEnter: [raise('sinan_ifsa')],
      lines: B(S`
        - Defne Sezer ilk kez doğrudan tanığa döndü. Sesi alçaktı, soruları kısa.
        uye: Tanık. 10.41'de kontrol odasına giren açık renk ceketli kişi siz miydiniz?
        - Sinan bileğindeki saate baktı. Saat yeşil yandı. Bir an, salondaki herkes o yeşil ışığa baktı.
        sinan: Avukatımla görüşmeden bu soruya cevap vermeyeceğim, Sayın Başkan. Hakkımı kullanıyorum.
        baskan: Hakkınız. Tutanağa geçsin: tanık kendisini suçlayabilecek soruya cevap vermekten çekindi.
        savci: Sayın Başkan, tanık hakkında iftira ve diğer suçlar yönünden Başsavcılığa suç duyurusunda bulunacağımızı bildiririz.
        - Halil yerinden kıpırdamadı. Gözlüğünü çıkardı, camlarını gömleğinin ucuyla sildi, yeniden taktı. Sonra önündeki kâğıdın kenarını bir kez hizaladı. Yirmi yedi yıllık bir hareket; bu sefer biraz titrek.
      `),
      choices: [cont('T02Y_DEVAM', 'Devam', 'T_03R')],
    }),
    story('T_02Z', {
      ...court2.base,
      title: 'Kürsüde',
      background: 'durusma_salonu',
      lines: B(S`
        baskan: Tanığın beyanı tutanağa geçti. Tanık, salonda kalabilirsiniz.
        - Sinan kürsüden indi, dinleyici sırasına oturdu. Bacak bacak üstüne attı; sonra indirdi. Bir nane şekeri açtı.
        ~ Duvarda çatlaklar var. Ama duvar hâlâ ayakta. Bir duvarı yıkmak için bir kâğıt daha gerekiyordu.
      `),
      choices: [cont('T02Z_DEVAM', 'Devam', 'T_03R')],
    }),
    decisionNode('T_03R', [{ when: flag('muzaffer_cagrildi'), to: 'T_03' }, { to: 'T_035' }], { ...TRIAL }),
    story('T_03', {
      ...court2.base,
      title: 'Tanık: çaycı',
      background: 'durusma_salonu',
      onFirstEnter: [meet('muzaffer')],
      lines: [
        W(
          flag('etki_muzaffer'),
          S`
            mubasir: Tanık Muzaffer Kılınç!
            - Muzaffer Usta önlüğünü çıkarmamıştı. Kürsüye geçerken bana bakmadı; defterini iki eliyle tuttu.
            baskan: Usta, yemininizi ettiniz. Gördüğünüzü anlatın; görmediğinizi anlatmayın.
            muzaffer: Anlatacağım, efendim. Ama önce bir şey: avukat hanım bana yüzünü de gördüğümü söylememi istedi. Görmedim. Dilekçemi verdim. Çaycı gördüğünü anlatır.
            baskan: Tutanağa geçti, usta. Devam edin.
          `,
        ),
        O(S`
        mubasir: Tanık Muzaffer Kılınç!
        - Muzaffer Usta önlüğünü çıkarmamıştı. Kürsüye geçerken defterini iki eliyle tuttu; bir kutsal kitap gibi değil, bir hesap defteri gibi: önemli, ama kendine göre.
        baskan: Usta, yemininizi ettiniz. Gördüğünüzü anlatın; görmediğinizi anlatmayın.
        muzaffer: Anlarım, efendim. Çaycı gördüğünü anlatır; görmediğini demler.
      `),
      ],
      choices: [cont('T03_DEVAM', 'Tanığa soru sor', 'T_03Q')],
    }),
    choiceNode('T_03Q', {
      ...court2.base,
      title: 'Çaycıya sorular',
      prompt: { speaker: 'baskan', text: 'Müdafi, tanığa sorularınız?' },
      choices: [
        option('T03Q_A', 'Defterinizdeki 12 Mart 10.40 satırını okur musunuz?', {
          visibleWhen: has('clue_cay_defteri'),
          score: { SORGULAMA: 50 },
          effects: [inc('pers'), raise('muzaffer_defter')],
          good: 'Tanığın kendi kaydını kendi ağzından tutanağa geçirdin; açık ve telkinsiz.',
          responses: B(S`
            muzaffer: "On kırk, arşiv, bir çay, S." Sinan Bey telefonla istedi. On kırk ikide götürdüm. Arşiv boştu. Bardağı masaya bıraktım. Kenara "boş" yazdım.
            baskan: Neden "boş" yazdınız, usta?
            muzaffer: Parayı kimden alacağımı bileyim diye, efendim. Boş odaya çay bırakırsan, sonra kimse "ben içmedim" demesin.
          `),
          next: '$stay',
        }),
        option('T03Q_B', 'O sabah kontrol odasının kapısında birini gördünüz mü?', {
          visibleWhen: flag('muzaffer_gordu'),
          score: { SORGULAMA: 40 },
          effects: [inc('pers'), raise('muzaffer_sirt')],
          good: 'Tanık gördüğü kadarını anlattı: bir sırt ve bir ceket. Yüzü görmediğini söylemesi, beyanını güvenilir kıldı.',
          responses: B(S`
            muzaffer: Gördüm. Sırtını. Açık renk bir ceket. Kim olduğunu görmedim, efendim; yemin ettim, görmediğimi demlemem.
          `),
          next: '$stay',
        }),
        option('T03Q_C', 'Gördüğünüz kişi Sinan Kaplan’dı, değil mi?', {
          score: { SORGULAMA: -50 },
          effects: [dec('pers'), dec('cred')],
          bad: 'Cevabı içinde taşıyan, tanığa bir isim veren soru telkindir (CMK 201); tanık görmediği yüzü söyleyemez.',
          responses: B(S`
            savci: İtiraz, Sayın Başkan! Müdafi tanığa isim veriyor.
            baskan: Kabul. Müdafi, soruyu geri alın.
            muzaffer: Ben yüzünü görmedim, efendim. Avukat hanım kızmasın.
          `),
          next: '$stay',
        }),
        option('T03Q_D', 'Halil Bey o sabah on birdeki çayını içti mi?', {
          score: { SORGULAMA: 20 },
          good: 'Tanığın gündelik alışkanlığı, sanığın o sabahki düzenini kendi ağzından ve telkinsiz tutanağa geçirdi.',
          responses: B(S`
            muzaffer: İçemedi, efendim. Dokuzdakini içti; açık demli, şekersiz. On birdekini demledim, tepsiye koydum. Kapısına vardığımda polis vardı.
            muzaffer: Bardağı geri götürdüm. Yirmi yılda ilk kez Halil Bey'in çayı ocakta soğudu. Kimse içmedi; dökemedim de. Akşama kadar orada durdu.
            - Halil başını eğdi. Bir an. Sonra gözlüğünü düzeltti.
          `),
          next: '$stay',
        }),
        cont('T03Q_BITTI', 'Başka sorum yok', 'T_03S', { role: 'PRIMARY' }),
      ],
    }),
    story('T_03S', {
      ...court2.base,
      title: 'Savcının sorusu',
      background: 'durusma_salonu',
      lines: B(S`
        savci: Usta, bir şey soracağım. Halil Bey'e hiç zarf getirdiniz mi? Çayın yanında, tepsinin altında?
        muzaffer: Zarf mı? Ben çay getiririm, efendim. Zarf getiren olsa tepsiye koymaz; tepsi herkesin önünden geçer.
        savci: O sabah kontrol odasının kapısından çıkan kişinin yüzünü görmediniz. Doğru mu?
        muzaffer: Doğru. Sırtını gördüm. Görmediğimi demlemem, demiştim. Yine demlemem.
        - Savcı başını salladı ve oturdu. Bir tanığı yıkmaya çalışmadı; sınadı. Defne Sezer bir şey yazdı; kısa, tek satır.
        ~ Muzaffer Usta bildiği kadarını söyledi, fazlasını değil. Bu salonda en sağlam tanıklık, bir çaycının sınırlarını bilmesiydi.
      `),
      choices: [cont('T03S_DEVAM', 'Kısa ara', 'T_035')],
    }),
    story('T_035', {
      ...court2.base,
      title: 'Kısa ara',
      background: 'adliye',
      lines: [
        W(
          all(any(flag('contra_k1'), flag('contra_k2'), flag('contra_k3')), has('ev_kamera')),
          S`
            baskan: Duruşmaya on beş dakika ara verildi.
            = ADLİYE KORİDORU · 11.40 @adliye
            - Koridorun ucunda, yangın merdiveninin kapısında Komiser Levent Arı duruyordu. İzleyici olarak gelmişti; tanıklığı bitmişti, ama gitmemişti.
            - Beni görünce bir adım attı, sonra durdu. Bir polisin bir avukata yaklaşması, bir tanığın bir avukata yaklaşmasından farklıdır; ama koridor ikisini de aynı tonda kaydeder.
            komiser: Avukat hanım. Tanıklığım bitti; size bir şey sormayacağım. Bir şey söyleyeceğim, o kadar.
            komiser: O sonlandırma yazısını ben yazmalıydım. Dört Mart'ta. Yazmadım; sistem kaydetmeye devam etti, ben de gelen her şeyi dosyaya koydum. Oğluma "ne gördüysen yaz" diyorum. Ben gördüğümü yazmışım; görmem gerekeni değil.
            komiser: Muhbiri de sorgulamadım. Zarf çekmecedeydi, seri numaraları tutuyordu. Ders kitabı gibi dedim. Ders kitapları da bazen yanlış basılır.
            komiser: Kamera kaydını da izledim; dosyaya geldiğinde. 10.41'de o kapıdan biri girip çıkıyor. Biz o sırada aşağıda, araçtaydık; muhbirin "tamam"ını bekliyorduk.
            komiser: Tutanağa "10.44" yazdım. Ondan önceki dakikalarda ne olduğunu yazmadım; çünkü görmedim. Görmediğimi de yazmalıydım.
            - Cevap vermedim. Bir tanığın vicdanı tutanağa geçmez; ama bir koridorda duyulur ve unutulmaz.
            ~ Bu adam kötü bir polis değil. Acele eden bir polis. Bu dosyada herkes biraz acele etti; bir tek Halil, aşağıda, usulüne uygun beş dakika bekledi.
          `,
        ),
        W(
          any(flag('contra_k1'), flag('contra_k2'), flag('contra_k3')),
          S`
            baskan: Duruşmaya on beş dakika ara verildi.
            = ADLİYE KORİDORU · 11.40 @adliye
            - Koridorun ucunda, yangın merdiveninin kapısında Komiser Levent Arı duruyordu. İzleyici olarak gelmişti; tanıklığı bitmişti, ama gitmemişti.
            - Beni görünce bir adım attı, sonra durdu. Bir polisin bir avukata yaklaşması, bir tanığın bir avukata yaklaşmasından farklıdır; ama koridor ikisini de aynı tonda kaydeder.
            komiser: Avukat hanım. Tanıklığım bitti; size bir şey sormayacağım. Bir şey söyleyeceğim, o kadar.
            komiser: O sonlandırma yazısını ben yazmalıydım. Dört Mart'ta. Yazmadım; sistem kaydetmeye devam etti, ben de gelen her şeyi dosyaya koydum. Oğluma "ne gördüysen yaz" diyorum. Ben gördüğümü yazmışım; görmem gerekeni değil.
            komiser: Muhbiri de sorgulamadım. Zarf çekmecedeydi, seri numaraları tutuyordu. Ders kitabı gibi dedim. Ders kitapları da bazen yanlış basılır.
            - Cevap vermedim. Bir tanığın vicdanı tutanağa geçmez; ama bir koridorda duyulur ve unutulmaz.
            ~ Bu adam kötü bir polis değil. Acele eden bir polis. Bu dosyada herkes biraz acele etti; bir tek Halil, aşağıda, usulüne uygun beş dakika bekledi.
          `,
        ),
        O(S`
          baskan: Duruşmaya on beş dakika ara verildi.
          = ADLİYE KORİDORU · 11.40 @adliye
          - Koridorun ucunda, yangın merdiveninin kapısında Komiser Levent Arı duruyordu. İzleyici olarak gelmişti; tanıklığı bitmişti, ama gitmemişti.
          - Beni görünce başıyla selam verdi. Yüzünde bir şey vardı; tutanağa geçmeyen türden bir şey. Sonra merdivenden indi.
          ~ Bu dosyada herkes biraz acele etti. Bir tek Halil, aşağıda, usulüne uygun beş dakika bekledi. Ben de acele ettim mi? Bunu hükümden sonra soracağım.
        `),
      ],
      choices: [
        option('T035_A', 'Komiserle konuşma; Halil’in yanına dön.', {
          effects: [raise('ara_mesafe')],
          responses: B(S`
            - Halil koridordaki sıraya oturmuş, elindeki boş dosyanın kenarını hizalıyordu. Yanına oturdum. Bir şey söylemedik. Zehra iki bardak su getirdi; birini bana uzattı.
            zehra: Hemşire tavsiyesi: duruşmada su için. Ağız kurursa cümle kurumaz.
          `),
          next: 'T_04',
        }),
        option('T035_B', 'Leyla’yı ara; kısa bir akıl danış.', {
          effects: [raise('ara_leyla_tel')],
          responses: B(S`
            leyla{phone}: Ara mı verdiler? İyi. Şimdi vasfı değiştirmeyi deneyecekler; savcının yüzü bunu söylüyordur. İrtikap ya da görevi kötüye kullanma.
            leyla{phone}: İrtikabın kalbi zorlamadır, Deniz. Zorlayacak yetkisi olmayan zorlayamaz. Görevi kötüye kullanmanın kalbi zarardır ya da haksız menfaat. İkisini de belgeyle karşıla; sesle değil.
            - Hat kapandı. Leyla "hoşça kal" demez; bitirir.
          `),
          next: 'T_04',
        }),
      ],
    }),
    court2.objection('T_04', {
      title: 'Ek savunma bildirimi',
      courtStage: 'DELIL_TARTISMA',
      say: S`
        - Başkan üyelerle kısa bir süre fısıldaştı. Sonra kâtibe döndü; dikte eder gibi, yavaş.
        baskan: Sanığa ve müdafiine hatırlatılır: sanığın eylemi, iddianamedeki rüşvet suçu dışında, irtikap ya da görevi kötüye kullanma olarak da nitelendirilebilir. Ek savunmanız sorulur.
        - Savcı başını salladı. Bu, onun için bir emniyet supabıydı; Leyla'nın dediği gibi.
        baskan: Müdafi?
      `,
      next: 'T_045',
      options: [
        option(
          'T04_A',
          'İrtikap icbar ister; dosya sanığın masasında değildi, muhbir de iki ayrı hikâye anlattı.',
          {
            effects: [
              ifThen(
                all(has('ded_yetkisiz'), has('ded_iki_hikaye')),
                [
                  score('HUKUKI_BILGI', 150),
                  inc('legal_hits'),
                  inc('pers'),
                  raise('ek_savunma_tam'),
                  mark(
                    'GOOD',
                    'İrtikap, görevin sağladığı nüfuzu kötüye kullanarak icbarı gerektirir (TCK 250/1); dosya Devir-2’deydi ve muhbir iki gün sonra “anlaştık” dedi. Ek savunma belgeye dayandı (CMK 226/1).',
                    'HUKUKI_BILGI',
                  ),
                ],
                [
                  ifThen(
                    any(has('ded_yetkisiz'), has('ded_iki_hikaye')),
                    [
                      score('HUKUKI_BILGI', 60),
                      raise('ek_savunma_kismi'),
                      mark(
                        'NEUTRAL',
                        'Ek savunma doğru ama yarımdı; nüfuzun yokluğunu ve muhbirin çelişkisini birlikte göstermek gerekirdi.',
                        'HUKUKI_BILGI',
                      ),
                    ],
                    [
                      score('HUKUKI_BILGI', -30),
                      mark('BAD', 'Hukuki cevap doğru, ama dosyada dayanağını göstermedin.', 'HUKUKI_BILGI'),
                    ],
                  ),
                ],
              ),
            ],
            responses: [
              W(
                all(has('ded_yetkisiz'), has('ded_iki_hikaye')),
                S`
                > Sayın Başkan, irtikap bir zorlamadır: memur görevinin nüfuzuyla birini mecbur bırakır. Burada sanığın nüfuzu yoktu; başvuru Devir-2'deydi, kontrole hiç gelmemişti.
                > Muhbirin kendisi de iki gün sonra "zorladı" demekten vazgeçip "anlaştık" demiştir. Zorlanan biri iki gün sonra ortak olmaz.
                > Görevi kötüye kullanmaya gelince: öncelikli randevu kimseye bir menfaat sağlamadı; şerh kalkmadığı için imza çıkmadı. Bu bir iyilik denemesiydi, bir kazanç değil.
                baskan: Not edildi.
              `,
              ),
              O(S`
              > Sayın Başkan, irtikap bir zorlamadır; sanığın zorlayabileceği bir şey yoktu.
              savci: Muhbir zorlandığını söylüyor, müdafi.
              ~ Haklı. Bir hukuk cümlesi, altında bir kâğıt yoksa havada kalır.
            `),
            ],
          },
        ),
        option('T04_B', 'Vasıf değişikliği yeni bir savunma gerektirir; ek savunma için süre istiyoruz.', {
          score: { USUL_BILGISI: 30 },
          effects: [raise('ek_sure')],
          good: 'Ek savunma gereken hâllerde istem üzerine süre verilir (CMK 226/3). Mahkeme kısa bir ara verdi.',
          responses: B(S`
            baskan: Yarım saat ara veriyoruz. Ek savunmanızı ara sonrası alacağız.
            - Koridorda yarım saat. Halil bir bardak su içti, bardağı pervaza bıraktı, kenarını pervazın kenarıyla hizaladı.
            halil: İrtikap mı? Ben kimseyi zorlayamam ki, avukat hanım. Ben kendimi bile zorlayamam; sabahları geç kalkarım.
            - Ara sonrası kısa bir ek savunma yaptım. Yarım saat, bir hafta değildi.
          `),
        }),
        option('T04_C', 'İtiraz: vasıf ancak savcının ek iddianamesiyle değişir; mahkeme iddianameyle bağlıdır.', {
          score: { HUKUKI_BILGI: -50 },
          effects: [dec('cred')],
          bad: 'Ek iddianame gerekmez: mahkeme eylemin nitelendirilmesinde iddianameyle bağlı değildir (CMK 225/2); vasıf değişecekse sanığa önceden haber verilir ve ek savunması alınır (CMK 226/1).',
          responses: B(S`baskan: Ek iddianame gerekmez, müdafi; bağlı değiliz, bu yüzden size soruyoruz. Ek savunmanız?`),
        }),
        option('T04_D', 'İrtikap da görevi kötüye kullanma da rüşvetten hafiftir; değişikliğe karşı çıkmıyoruz.', {
          effects: [dec('pers')],
          bad: 'Daha hafif bir vasfa savunmasız razı olmak, sanığın bir suç işlediğini dolaylı kabul etmektir; ek savunma hakkı kullanılmadı.',
          category: 'HUKUKI_BILGI',
          responses: B(S`
            savci: Not edelim, Sayın Başkan: müdafi daha hafif vasıflara karşı çıkmıyor.
            ~ Bir kapıyı kapatmak isterken bir başkasını ardına kadar açtım.
          `),
        }),
      ],
    }),
    story('T_045', {
      ...court2.base,
      title: 'Sanığın ek beyanı',
      background: 'durusma_salonu',
      lines: [
        W(
          all(flag('halil_durust'), flag('halil_hazir')),
          S`
            baskan: Sanık, ek savunmanız?
            halil: Yirmi yedi yılda bir kez kuralı esnettim; o bir iyilikti, bir pazarlık değil. Kimseyi zorlamadım. Zorlayacak bir şeyim yoktu; dosya benim masamda değildi.
            halil: O zarf benim değil. İlk cümle bu, Sayın Başkan. Gerisi, kâğıtlarda.
            halil: Bir de şunu eklerim: o randevu yüzünden sırası geriye kayan kim varsa, onlardan özür dilerim. Kayda geçsin.
            - Defne Sezer kalemini bıraktı ve Halil'e uzun uzun baktı. Bir hâkimin bakışı; bir şey tartıyordu.
          `,
        ),
        W(
          flag('halil_ezber'),
          S`
            baskan: Sanık, ek savunmanız?
            halil: Atılı suçun unsurları oluşmamıştır. İcbar ve nüfuz bulunmamaktadır. Takdir yüksek heyetinizindir.
            - Bir yönetmelik maddesi gibi okudu. Başkan bir şey yazmadı. Bazen bir cümle, doğru olduğu hâlde, kimse tarafından duyulmaz.
          `,
        ),
        O(S`
          baskan: Sanık, ek savunmanız?
          halil: Ben kimseyi zorlamadım, Sayın Başkan. Para almadım. O zarf benim değil. Başka söyleyeceğim yok.
        `),
      ],
      choices: [cont('T045_DEVAM', 'Mütalaa', 'T_05E', { role: 'PRIMARY' })],
    }),
    decisionNode('T_05E', [{ to: 'T_05' }], {
      ...TRIAL,
      lines: [
        W(
          flag('tanik_etkileme'),
          S`
            savci: Sayın Başkan, mütalaamdan önce bir hususu kayda geçirmek isterim: müdafiin bir tanığın beyanını duruşmadan önce yönlendirmeye çalıştığı anlaşılmıştır. Bu konuda TCK 277 yönünden ayrıca suç duyurusunda bulunacağız.
            baskan: Not edildi. Heyet, yönlendirilen beyanı hükümde ayrıca değerlendirecek.
          `,
        ),
      ],
    }),
    court2.objection('T_05', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      lines: [
        W(
          gercekProven,
          S`
            - Savcı Kenan Yavuz ayağa kalktı; bu kez dosyayı açık tuttu. Konuşmaya başlamadan önce Halil'e bir an baktı.
            savci: Sayın Başkan. Geçen celse "zarf çekmecede, para işaretli, kayıt ortada" dedim. Zarf çekmecedeydi; ama oraya kimin koyduğu bugün ortaya çıktı.
            savci: Mütalaamdır: sanığın atılı suçu işlemediği sabittir; beraatine. Muhbir Bayram Öz ve tanık Sinan Kaplan hakkında suç duyurusu için dosyanın bir örneğinin Başsavcılığa gönderilmesine karar verilmesini talep ederim.
            baskan: Müdafi, mütalaaya karşı diyeceğiniz?
          `,
        ),
        W(
          ref('beraat_kosul'),
          S`
            - Savcı ayağa kalktı; dosyayı açtı, bir sayfayı uzun uzun okudu, kapattı.
            savci: Sayın Başkan, iddianamenin dayandığı kayıtların hukuka aykırı elde edildiği anlaşılmıştır. Zarfın çekmeceye sanık odadayken konduğu da kanıtlanamamıştır.
            savci: Mütalaamdır: sanığın atılı suçu işlediğine dair kesin ve inandırıcı delil elde edilememiştir. Beraatine karar verilmesini takdirlerinize bırakırım.
            baskan: Müdafi, mütalaaya karşı diyeceğiniz?
          `,
        ),
        W(
          any(flag('halil_durust'), flag('sira_savcida')),
          S`
            savci: Sayın Başkan, rüşvet anlaşması kesin olarak kanıtlanamamış olsa da sanık, yetkisi olmadığı hâlde muhbire öncelikli randevu vermiştir. Bu görevin gereklerine aykırıdır.
            savci: Mütalaamdır: sanığın asıl olarak rüşvetten, olmadığı takdirde görevi kötüye kullanmadan cezalandırılmasını talep ederim.
            baskan: Müdafi, mütalaaya karşı diyeceğiniz?
          `,
        ),
        O(S`
          savci: Sanık çekmecesinde bulunan işaretli paraları açıklayamamıştır. Muhbirin beyanı ve el koyma tutanağı birbirini desteklemektedir.
          savci: Mütalaamdır: sanığın TCK 252/2 uyarınca cezalandırılmasını talep ederim.
          baskan: Müdafi, mütalaaya karşı diyeceğiniz?
        `),
      ],
      next: 'T_07',
      options: [
        option(
          'T05_A',
          'Zarf çekmeceye sanık odasında değilken girdi; bu bir varsayım değil, tutanağın kendi saatleri.',
          {
            effects: [
              ifThen(
                ref('zarf_suphe'),
                [
                  score('USUL_BILGISI', 100),
                  inc('legal_hits'),
                  mark(
                    'GOOD',
                    'Cevap hakkı yerinde kullanıldı (CMK 216/2) ve dosyadaki belgelere dayandı.',
                    'USUL_BILGISI',
                  ),
                ],
                [
                  score('USUL_BILGISI', -40),
                  dec('pers'),
                  mark(
                    'BAD',
                    '“Belgelerle sabit” dedin; ama zarfın sanık yokken girdiğini duruşmada tartıştırmamıştın.',
                    'USUL_BILGISI',
                  ),
                ],
              ),
            ],
            responses: B(S`
            > Sayın Başkan, bu dosyada bir zarf var, ama bir el yok. 10.39'da kayıt susturuluyor; 10.44'te polis boş bir odaya giriyor; 10.46'da sanık dönüyor.
            > Zarf o çekmeceye girdiğinde, çekmecenin sahibi bir alt katta, kimsenin çağırmadığı bir randevuyu usulüne uygun bekliyordu.
          `),
          },
        ),
        option('T05_B', 'Hukuka aykırı kayıtlar ayıklandığında geriye yalnızca muhbirin çelişen beyanı kalır.', {
          effects: [
            ifThen(
              ref('kayit_disi'),
              [
                score('USUL_BILGISI', 80),
                inc('legal_hits'),
                mark(
                  'GOOD',
                  'Hukuka aykırı delil hükme esas alınamaz (CMK 217/2; Anayasa 38/6); kalan tek dayanak çelişkili muhbir beyanıdır.',
                  'USUL_BILGISI',
                ),
              ],
              [
                score('USUL_BILGISI', -40),
                mark('BAD', 'Kayıtları duruşmada ayıklatmamıştın; cevabın dayanağı yoktu.', 'USUL_BILGISI'),
              ],
            ),
          ],
          responses: B(S`
            > İddianamenin iki cümlesi var, Sayın Başkan: "Dosyana bakarım" ve "Zarf yarın masada." Biri kararsız bir hattan, öbürü süresi bitmiş bir karardan.
            > Onları çıkardığınızda geriye ne kalıyor? İki ayrı hikâye anlatan, cihazını kendi eliyle susturan bir muhbir.
          `),
        }),
        option('T05_C', 'Mütalaa delile değil kanaate dayanıyor; tutanaktan çıkarılmasını talep ediyoruz.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Mütalaa tutanaktan çıkarılmaz; müdafi ona cevap verir (CMK 216/2).',
          responses: B(S`baskan: Reddedildi. Cevap verecekseniz verin.`),
        }),
        option('T05_D', 'Mütalaaya katılıyoruz; beraatin gerekçesini heyetin takdirine bırakıyoruz.', {
          visibleWhen: any(gercekProven, ref('beraat_kosul')),
          neutral:
            'Beraat mütalaasına katılmak meşrudur; ama esas savunmada hangi beraat nedeninin uygulanacağını ayrıca göstermelisin.',
        }),
      ],
    }),
    choiceNode('T_07', {
      ...court2.base,
      title: 'Esas hakkında savunma',
      prompt: { speaker: 'baskan', text: 'Müdafi, esas hakkındaki savunmanızı yapın.' },
      next: 'T_07P1',
      choices: [
        option('T07_A', 'Suç sanık tarafından işlenmemiştir; zarfı çekmeceye koyan el dosyadadır.', {
          effects: [
            ifThen(
              all(gercekProven, ref('kayit_disi')),
              [
                score('SAVUNMA_STRATEJISI', strategyAmount(200, 'MASUMIYET')),
                inc('pers'),
                raise('gercek_fail'),
                mark(
                  'GOOD',
                  'CMK 223/2-b: suçun sanık tarafından işlenmediği sabit; zarfı bırakan el belgelerle gösterildi.',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
              [
                score('SAVUNMA_STRATEJISI', -100),
                dec('pers'),
                mark(
                  'BAD',
                  'Gerçek fail iddiası belgeyle desteklenmedi; heyet bir isim değil, bir kanıt bekler.',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
            ),
          ],
          responses: [
            W(
              all(gercekProven, flag('sinan_ifsa')),
              S`
                > Sayın Başkan. Mart'ta bir dahili çaldı: "Müdür Hanım çağırıyor." Çağırmamıştı. Memur indi. Zarf, sahibi yokken çekmeceye girdi.
                > Onu oraya bırakabilecek tek kişi bu kürsüde oturdu ve kendisini suçlayacak soruya cevap vermemeyi seçti. Bu onun hakkı; ama o sessizliğin etrafındaki kâğıtlar konuşuyor.
              `,
            ),
            W(
              gercekProven,
              S`
                > Sayın Başkan. Mart'ta bir dahili çaldı: "Müdür Hanım çağırıyor." Çağırmamıştı. Memur indi. Zarf, sahibi yokken çekmeceye girdi.
                > Muhbir, zarfı kime verdiğini bu kürsüde söyledi. Söylediği isim bir masanın, bir destenin, bir dahilinin sahibiyle aynı.
              `,
            ),
            O(S`
              > Sayın Başkan, bu zarfı müvekkilim koymadı. Başka biri koydu. Kim olduğunu... dosya henüz söylemiyor.
              ~ "Henüz." Mahkeme "henüz"le hüküm kurmaz.
            `),
          ],
        }),
        option(
          'T07_B',
          'Sanığın suçu işlediği sabit değildir; hukuka aykırı delil ayıklanınca kalan şüphe sanık lehinedir.',
          {
            effects: [
              ifThen(
                ref('beraat_kosul'),
                [
                  score('SAVUNMA_STRATEJISI', strategyAmount(200, 'USUL')),
                  inc('pers'),
                  mark(
                    'GOOD',
                    'CMK 223/2-e: kayıtlar hükme esas alınamaz, zarfın sanık yokken girdiği gösterildi; şüphe sanık lehine.',
                    'SAVUNMA_STRATEJISI',
                  ),
                ],
                [
                  score('SAVUNMA_STRATEJISI', -100),
                  mark(
                    'BAD',
                    'Şüphe savunması için kayıtları ayıklatmak ve zarfın nasıl girdiğini tartıştırmak gerekiyordu.',
                    'SAVUNMA_STRATEJISI',
                  ),
                ],
              ),
            ],
            responses: [
              W(
                ref('kayit_disi'),
                S`
                  > Sayın Başkan. Bu dosya bir anahtar deliğinden başladı. Kapısı kapanmış bir deliğinden: süresi dolmuş bir karar, kararda olmayan bir hat.
                  > O delikten duyulan cümleler bu salonda okunamaz. Kanun böyle der; Anayasa böyle der. Delil, nasıl elde edildiğiyle birlikte delildir.
                `,
              ),
              W(
                any(flag('red_14'), flag('contra_k1')),
                S`
                  > Sayın Başkan. "Zarf yarın masada" cümlesi, süresi dolmuş bir kararla kaydedildi. O cümle bu salonda okunamaz; geriye kalan kaydı da aynı dikkatle tartmanızı isterim.
                `,
              ),
              W(
                any(flag('red_9'), flag('contra_k5'), flag('obj_k5')),
                S`
                  > Sayın Başkan. Sanığın kendi telefonundan alınan cümle, hiçbir hâkimin izin vermediği bir hattan geliyor. O cümle bu salonda okunamaz; geriye kalan kaydı da aynı dikkatle tartmanızı isterim.
                `,
              ),
              O(S`
                > Sayın Başkan. Bu dosyada savcılığın elinde üç şey var: bir kayıt, bir muhbir, bir zarf. Üçünü de sırayla tartmanızı istiyorum; hiçbirini ötekinin gölgesinde değil.
              `),
            ],
          },
        ),
        option(
          'T07_C',
          'Öncelikle beraat; aksi hâlde eylem rüşvet değil, en fazla görevi kötüye kullanmadır; lehe hükümler uygulansın.',
          {
            visibleWhen: has('ev_sira_disi'),
            score: { SAVUNMA_STRATEJISI: strategyAmount(150, 'INDIRIM') },
            effects: [raise('terditli')],
            good: 'Terditli savunma meşrudur: önce beraat; olmazsa rüşvetin iş–menfaat bağı kurulamadığından eylem en fazla görevi kötüye kullanmadır (TCK 257/1); TCK 62 ve CMK 231.',
            responses: B(S`
            > Sayın Başkan, öncelikle beraat. Heyetiniz aksi kanaatteyse: sanık bir kez yetkisini aştı ve bir vatandaşa öncelikli randevu verdi. Karşılığında hiçbir menfaat yok.
            > Bu, rüşvet değil; en fazla görevi kötüye kullanmadır. Sanığın yirmi yedi yıllık sicili temiz. Lehe bütün hükümlerin uygulanmasını talep ederiz.
            ~ Kapıyı açtım. Leyla "erken açma" demişti. Halil bana baktı; kızgın değil, yorgun.
          `),
          },
        ),
        option('T07_D', 'Yirmi yedi yıllık bir memura bakın. Bir rüşvetçi bu kadar düzgün kravat bağlar mı?', {
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('pers')],
          bad: 'Duygusal söylem delilin yerini tutmaz; heyet kravata değil, dosyaya bakar.',
          responses: B(S`
            > Sayın Başkan, bu adama bakın.
            savci: Sayın Başkan, ben dosyaya bakmayı tercih ederim.
            baskan: Ben de, savcı bey.
          `),
        }),
      ],
    }),
    // Esas savunmanın parçaları: her biri o oyunda duruşmada gerçekten kurulan olguya bağlı (node başına ilk eşleşen blok).
    decisionNode('T_07P1', [{ to: 'T_07P2' }], {
      ...TRIAL,
      lines: [
        W(
          all({ chosen: 'T07_B' }, ref('zarf_suphe')),
          S`> Geriye bir zarf kalıyor. Zarf çekmeceye 10.39 ile 10.43 arasında girdi. O dakikalarda sanık odasında değildi; makamdan geldiği izlenimi veren bir çağrıyla bir alt kata indirilmişti.`,
        ),
        W(
          all({ chosen: 'T07_B' }, ref('oda_bos')),
          S`> Geriye bir zarf kalıyor. Polis 10.44'te odaya girdiğinde oda boştu; sanık iki dakika sonra geldi. Bunu savunma değil, savcılığın kendi tutanağı yazıyor.`,
        ),
        W({ chosen: 'T07_B' }, S`> Geriye bir zarf kalıyor. Bir zarfın bir çekmecede bulunması, onu oraya kimin koyduğunu söylemez.`),
        W(
          all({ chosen: 'T07_A' }, gercekProven, has('ded_zarf_kaynagi')),
          S`> Zarf, kontrol servisinin değil, Devir Servisi-2'nin destesinden. Zimmet defterinde teslim alanın parafı duruyor.`,
        ),
      ],
    }),
    decisionNode('T_07P2', [{ to: 'T_07P3' }], {
      ...TRIAL,
      lines: [
        W(
          all({ chosen: 'T07_B' }, flag('contra_b4')),
          S`> Muhbirin cihazı ise arızalanmadı. Bilirkişi raporuna göre 10.39.12'de fiziksel tuşla susturuldu; muhbir de bunu bu kürsüde kabul etti.`,
        ),
        W(
          all({ chosen: 'T07_B' }, flag('press_b4')),
          S`> Muhbirin cihazı 10.39'da sustu. Neden sustuğunu kolluk incelemedi; "kendiliğinden" denildi ve öyle yazıldı.`,
        ),
        W(
          all({ chosen: 'T07_A' }, gercekProven, flag('contra_s4')),
          S`> Bir kontrol memuru on bir dosya durdurdu ve bir deftere yazdı: "Hepsi aynı elden. Müdüre yazılacak." Defter müdüre gitmedi; çünkü yazanı çekmecesiyle birlikte masadan kaldırdılar.`,
        ),
      ],
    }),
    decisionNode('T_07P3', [{ to: 'T_07P4' }], {
      ...TRIAL,
      lines: [
        W(
          all({ chosen: 'T07_B' }, flag('contra_b3'), any(flag('contra_b4'), has('clue_fisilti'))),
          S`> Ve bir muhbir kalıyor: önce "zorladı", sonra "anlaştık", sonra "elden verdim", sonra "odaya girmedim" diyen. Bu dört cümleden hangisine bir insanın özgürlüğünü bağlayacağız?`,
        ),
        W(
          all({ chosen: 'T07_B' }, any(flag('contra_b1'), flag('contra_b2'))),
          S`> Ve bir muhbir kalıyor: iki gün arayla önce "zorladı", sonra "anlaştık" diyen. İki ayrı hikâye; ikisi aynı anda doğru olamaz.`,
        ),
        W({ chosen: 'T07_B' }, S`> Ve bir muhbir kalıyor. Onun sözünden başka, zarfı sanığın eline koyan hiçbir kâğıt yok.`),
      ],
    }),
    decisionNode('T_07P4', [{ to: 'T_07S1' }], {
      ...TRIAL,
      lines: [
        W(
          all({ chosen: 'T07_B' }, flag('halil_durust')),
          S`> Yirmi yedi yıllık bir memur bir kez kuralı esnetti ve bunu bu salonda kendisi söyledi. Bir iyilik, bir pazarlık değildir. Mahkûmiyet şüphenin üstüne kurulamaz. Beraatini talep ederiz.`,
        ),
        W(
          { chosen: 'T07_B' },
          S`> Yirmi yedi yıllık bir memur bu salonda "o zarf benim değil" dedi. Mahkûmiyet şüphenin üstüne kurulamaz. Beraatini talep ederiz.`,
        ),
        W(
          all({ chosen: 'T07_A' }, gercekProven),
          S`> Halil Ekinci bu dosyada fail değil; bu dosyanın hedefi. Suçun sanık tarafından işlenmediği sabittir. Beraatini talep ederiz.`,
        ),
      ],
    }),
    decisionNode('T_07S1', [{ to: 'T_07S2' }], {
      ...TRIAL,
      lines: [
        W(
          all(any({ chosen: 'T07_A' }, { chosen: 'T07_B' }), flag('contra_k2')),
          S`> Bir de şunu kayda geçirmek isterim: para Emniyet'ten çıktı, plan Emniyet'ten çıktı, cihaz Emniyet'ten çıktı. Devlet bir suçu ortaya çıkarabilir; yaratamaz. Burada yaratmaya çok yaklaşmıştır.`,
        ),
        W(
          all(any({ chosen: 'T07_A' }, { chosen: 'T07_B' }), flag('muzaffer_defter'), flag('muzaffer_sirt')),
          S`> Bir çaycının defteri ve bir sırt. Yüz değil; ama bir alibinin soğumuş çayı ve kontrol odasından çıkan açık renk bir ceket. Tanık görmediği yüzü söylemedi; bu yüzden gördüğüne inanılır.`,
        ),
        W(
          all(any({ chosen: 'T07_A' }, { chosen: 'T07_B' }), has('ded_hedef')),
          S`> Ve kararın içindeki tek hukuka uygun kayıt, on dokuz Şubat'ta, sanığın aleyhine değil, lehine konuşuyor: "Kontrolcü yine imzalamadı. Masasından kaldırırız onu."`,
        ),
      ],
    }),
    decisionNode('T_07S2', [{ to: 'T_07S3' }], {
      ...TRIAL,
      lines: [
        W(
          all(any({ chosen: 'T07_B' }, { chosen: 'T07_C' }), flag('q_karsilik')),
          S`> Sanık bu salonda açık bir soruya cevap verdi: öncelikli randevu için ne bir şey istendi ne bir şey verildi. Karşılıksız bir iyilik, rüşvetin "işi" olamaz.`,
        ),
        W(
          all(any({ chosen: 'T07_A' }, { chosen: 'T07_B' }, { chosen: 'T07_C' }), flag('q_tam_cumle')),
          S`> Sanığın cümlesi de yarım alıntılanmıştı: "Dosyana bakarım Bayram, ama şerh kalkmadan imza yok." Bir rüşvetçi, parayı alacağı dosyayı reddettiğini telefonda söylemez.`,
        ),
      ],
    }),
    decisionNode('T_07S3', [{ to: 'T_08' }], {
      ...TRIAL,
      lines: [
        W(
          flag('tk_kagit'),
          S`- Halil sabah koridorda "kâğıtlar bakacak" sözümü duymuştu. Savunmam bittiğinde bana bakmadı; önündeki dosyanın kenarını hizaladı. Bir onay.`,
        ),
        W(
          flag('tk_soz'),
          S`- Halil sabah "söz vermeyin" demişti. Savunmam bittiğinde bana bir kez baktı; kayda geçmeyen bir bakış.`,
        ),
        W(
          flag('ara_leyla_tel'),
          S`- Leyla'nın aradaki cümlesi kulağımdaydı: "Belgeyle karşıla; sesle değil." Sesimi alçalttım, kâğıtları yükselttim.`,
        ),
        W(
          flag('ara_mesafe'),
          S`- Arada Halil'in yanında, sessizce, su içerek oturmuştum. Şimdi salonda da aynı sessizlik vardı; ama bu sefer onun lehine.`,
        ),
        W(
          flag('fact_kariyer'),
          S`- Halil'in hikâyesi aklımdaydı: lokumu iade eden adam. Heyete söylemedim; ama Defne Sezer onun sicilini okumuş olmalıydı, çünkü bir an Halil'e baktı ve kalemini bıraktı.`,
        ),
      ],
    }),
    choiceNode('T_08', {
      ...court2.base,
      title: 'Son söz',
      prompt: { speaker: 'baskan', text: 'Sanık, ayağa kalkın. Son sözünüz?' },
      next: 'T_09',
      choices: [
        option('T08_A', '“Bir kez eğildim; bir iyilik için. O zarf benim değil. Kayda geçsin.”', {
          score: { SAVUNMA_STRATEJISI: 25 },
          good: 'Kısa, dürüst ve kendi eğilişini de gören bir son söz.',
          responses: B(S`
            halil: Sayın Başkan. Yirmi yedi yıl bu masada oturdum. Bir kez eğildim; bir adam ağlıyordu, ben de sırayı öne aldım. O eğilişin hesabını veririm.
            halil: Ama o zarf benim değil. Kızım buradaydı; her celse geldi, nöbetten nöbete. Ona bir şey söylemek isterim: sardunyayı sen sula; ben artık eskisini onarmayacağım.
            halil: Kayda geçsin. Saygılarımla.
            - Zehra arka sırada gözlerini sildi. Hemşireler ağlarken bile yüzlerini düz tutmayı bilir; bu sefer tutmadı.
          `),
        }),
        option('T08_B', '“Ben suçsuzum. Yirmi yedi yıl hizmet ettim; bırakın beni artık.”', {
          neutral: 'Son söz sanığın hakkıdır (CMK 216/3); içeriği hükmü kendiliğinden değiştirmez.',
          responses: B(S`halil/uzgun: Ben suçsuzum, Sayın Başkan. Yirmi yedi yıl hizmet ettim... Bırakın beni artık. Lütfen.`),
        }),
        option('T08_C', '“Ne ceza verirseniz razıyım; yeter ki bu dosya bir an önce bitsin.”', {
          effects: [dec('pers')],
          neutral: 'Son sözde cezaya razı olmak, suçu kabul gibi okunabilir; heyet bunu dikkate alabilir.',
          responses: B(S`
            halil/uzgun: Ne ceza verirseniz razıyım. Yeter ki bu dosya bir an önce bitsin.
            ~ "Yeter ki bitsin." Yirmi yedi yılın sonunda, kurallı bir adamın söylediği ilk kuralsız cümle.
          `),
        }),
      ],
    }),
    decisionNode('T_09', [{ to: 'R_KARAR' }], {
      ...TRIAL,
      lines: B(S`
        baskan: Heyet müzakereye çekiliyor.
        - Yarım saat. Koridorda kimse konuşmadı. Zehra pencerenin önünde, elleri önlüğünün ceplerinde. Halil bir sandalyenin kenarına oturdu; sandalyenin kenarı duvarla hizalı değildi, düzeltmedi.
        - Leyla yanıma geldi, bir şey söylemedi. Sadece elimdeki kalemi aldı ve kapağını taktı. Ucu açık kalmıştı; bir saattir.
        - Pencerenin önünde Muzaffer Usta, önlüğünün cebinden defterini çıkarmış, bir şey yazıyordu. Merak edip sordum. "Bugünün siparişlerini" dedi. "Mahkemede de insanlar çay içer. Kimse yazmaz; ben yazarım."
        - Halil bir an gözlerini kapadı. Sonra açtı ve kızına döndü: "Kararı ne olursa olsun, sardunyayı sen sula. Ben artık her şeyi kendim yapmayacağım."
        ~ Yarım saatte yirmi yedi yıl geçmez. Ama yirmi yedi yıl, yarım saatte bir kez daha düşünülür.
        mubasir: Halil Ekinci dosyası! Hüküm!
        baskan: Hüküm fıkrası ayakta dinlenir.
      `),
    }),
    story('T_COKUS', {
      ...court2.base,
      title: 'Çöküş',
      background: 'durusma_salonu',
      lines: B(S`
        - Başkan gözlüğünü çıkardı. Savcı kalemini bıraktı. Salonda kimse bana bakmıyordu; bakmamak, bakmaktan daha ağırdı.
        baskan: Müdafi, sunduğunuz her şey ya ilgisiz ya dayanaksız çıktı. Savunmanın güvenilirliği kalmadı. Sanık, kısaca son sözünüz?
        ~ Bir zarfın hangi elden geldiğini bulamadım. Ben kendi elimdekini de düşürdüm.
      `),
      choices: [cont('COKUS_SON', 'Son söz: “O zarf benim değil.”', 'T_09')],
    }),
    resultNode('R_KARAR', { ...VERDICT, title: 'Karar Açıklandı', background: 'durusma_salonu' }),
  ],
  triggers: [
    {
      id: 'tg_cokus',
      priority: 0,
      once: true,
      when: all(any(flag('in_court'), flag('in_court2')), cmp(v('cred'), '<=', 0)),
      effects: [raise('cokus')],
      goto: 'T_COKUS',
    },
  ],
};
