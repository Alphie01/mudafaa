import {
  all,
  any,
  cmp,
  cont,
  conversation,
  decisionNode,
  deductionBoard,
  dec,
  deliver,
  discover,
  documentExam,
  examine,
  fallback,
  flag,
  has,
  ifThen,
  inc,
  mark,
  not,
  option,
  raise,
  rawChoice,
  recipe,
  ref,
  row,
  sceneSearch,
  score,
  set,
  story,
  tool,
  v,
  visited,
  choiceNode,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef, NodeDef } from '../../../tools/content/src/kit/index.js';
import { B, O, S, W, minus } from './dsl.js';
import { INV1_RECIPES } from './inv1-hub.js';
import { ARA, p2 } from './shared.js';

// 70-ara: iki celse arası (2 gün × 3 EP). Yığın kullanılmaz: her etkinlik doğrudan ARA_HUB'a döner (Dava #07 v2 notu 2).

const HUB = 'ARA_HUB';

/** Alt ekranlardaki `$return`'ü doğrudan hub'a çevirir. */
function direct<T extends NodeDef>(node: T): T {
  return {
    ...node,
    choices: node.choices.map((ch) => (ch.next === '$return' ? { ...ch, next: HUB } : ch)),
  };
}

/** Eylem puanı harcayan, yığınsız etkinlik. */
const act = (id: string, label: string, to: string, spec: Partial<ChoiceDef> = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { cost: [{ var: 'ara_ap', amount: 1 }], next: to, maxUses: 1, ...spec });

const free = (id: string, label: string, to: string, spec: Partial<ChoiceDef> = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { next: to, ...spec });

const giris = deliver('ARA_GIRIS_1', [
  { evidence: 'ev_banka_log', requires: flag('rq_log'), hint: 'Banka cihaz kaydını duruşmada da isteyebilirdin.' },
  {
    evidence: 'ev_hts',
    requires: any(flag('dl_hts'), flag('rq_hts')),
    hint: 'Sanığın hattı için iletişim tespitini iste (CMK 135/6).',
  },
  {
    evidence: 'ev_bayi_belge',
    requires: any(flag('dl_bayi'), flag('rq_bayi')),
    hint: 'SIM değişikliği belgelerini operatörden iste.',
  },
  { evidence: 'ev_atm', requires: any(flag('dl_atm'), flag('rq_atm')), hint: 'ATM kamera görüntülerini iste.' },
]);

const imeiDayEnd = deliver('ARA_DAY_END', [
  { evidence: 'ev_imei_rapor', requires: flag('imei_istendi'), hint: 'Suç duyurusunda IMEI sorgusu iste.' },
]);

const dayEnd = p2.dayEnd({ ...ARA, title: 'Gün sonu', continueId: 'ARA_DAY_NEXT', deliveries: [] });

/** Ara tahtasında 1. evre tarifleri: yeniden kurulabilir, puanı yalnızca ilk kurulumda. */
const again = ([id, a, b, ded, title, text]: (typeof INV1_RECIPES)[number]): ChoiceDef =>
  recipe(`${id}_2`, a, b, {
    effects: [ifThen(not(has(ded)), [score('DELIL_ANALIZI', 300)]), discover(ded)],
    feedback: { title, text, label: 'TAHTADA', tone: 'success' },
  });

const fresh = (id: string, a: string, b: string, ded: string, title: string, text: string): ChoiceDef =>
  recipe(id, a, b, {
    discovers: ded,
    score: { DELIL_ANALIZI: 300 },
    feedback: { title, text, label: 'YENİ DELİL · +300 SKOR', tone: 'success' },
  });

export const ara: CasePart = {
  nodes: [
    decisionNode('ARA_GIRIS_1', [{ to: 'ARA_GIRIS_2' }], {
      ...ARA,
      onEnter: [...giris.effects, ...p2.start()],
      lines: [
        W(
          has('ev_hts'),
          S`
            = 12 KASIM 2026 · 09.00 — ARSLAN HUKUK @buro
            - Bir hafta sonra ara karar cevapları birer birer dosyaya düştü. İlki operatörden: Ece'nin hattının 3–5 Kasım kayıtları. 4 Kasım 10.12'de bir satır: "IMEI değişikliği."
            - Satırın yanında on beş haneli bir numara: kopya SIM'in takıldığı cihazın kimliği. 35 491207 ile başlıyor. Bir telefonun parmak izi, bir yıl sonra bir kâğıtta.
          `,
        ),
        O(S`
          = 12 KASIM 2026 · 09.00 — ARSLAN HUKUK @buro
          - Bir hafta sonra ara karar cevapları dosyaya düşmeye başladı. Ece'nin hattının kayıtlarını istememiştim; o kutu boştu.
        `),
      ],
    }),
    decisionNode('ARA_GIRIS_2', [{ to: 'ARA_GIRIS_3' }], {
      ...ARA,
      lines: [
        W(
          has('ev_bayi_belge'),
          S`- Sonra bayinin işlem dosyası: bir vekâletname, bir vekilin kimliği, Ece'nin kimlik fotokopisi. Vekilin adı ilk sayfada büyük harflerle yazıyordu.`,
        ),
        O(
          S`- Bayinin o gün hangi belgeyle işlem yaptığını hâlâ bilmiyorum. Onu ancak kürsüdeki genç söyleyebilir; söylerse.`,
        ),
      ],
    }),
    decisionNode('ARA_GIRIS_3', [{ to: 'ARA_GIRIS' }], {
      ...ARA,
      lines: [
        W(
          has('ev_atm'),
          S`- Ve ATM'nin üç karesi. Kapüşonlu bir genç, telefonunu ekrana tutuyor. Sırtında sarı harfler: "HIZLI PAKET." Ece değil. Ece'nin hiçbir yakını da değil.`,
        ),
        W(
          has('ev_banka_log'),
          S`- Banka da cihaz kayıtlarını göndermişti. "Samsung SM-A546E." Duruşmada okunmadı; ama bir sonraki celsede okunacak.`,
        ),
        O(S`- Dosya hâlâ ince. Ama bazen ince bir dosya, kalın bir yalandan daha çok şey söyler.`),
      ],
    }),
    story('ARA_GIRIS', {
      ...ARA,
      title: 'Üç hafta',
      background: 'buro',
      lines: B(S`
        - Büro sabahları başka kokar: toner, ıslak palto, Leyla'nın soğuyan çayı. Masamda dosyanın kalınlığı iki katına çıkmıştı; ağırlığı da.
        leyla: İki günün var, Deniz. Gerisi beklemek. Duruşma salonunun dışındaki her konuşma, salonun içinde yeniden yapılır; bunu unutma.
        leyla: Tanıklara dokunma. Şüphelileri kovalama. Gördüğünü bildir, bildirdiğini belgele.
        leyla: Bir de şu var: bu üç hafta, karşı tarafın da üç haftası. Biri seni izliyorsa, sen de onun izlediğini bil. Ama ona bakma; dosyaya bak.
        leyla: Ve hatırla: bu dosyada bir kurban daha var. Katılan. Onu düşman yapma. Düşman yaparsan, salonda bir ses kaybedersin; kazanabileceğin bir sesi.
        - Masamın köşesinde Ece'nin sarı notunun fotokopisi duruyordu; aslı dosyadaydı artık, mahkemenin. Fotokopide gülen yüz biraz silikti, ama oradaydı.
        - Telefonuma Ece'den bir mesaj düşmüştü: "Annem bugün ilk kez atölyeye geç gitti. Benimle kahvaltı etti. Bir yıl sonra ilk kez." Altında hiçbir şey yoktu; ne teşekkür, ne soru.
        ~ Bir yılda kimsenin sormadığı soruları üç haftada sormam gerekiyor. Ve hiçbirini yanlış kişiye sormamam.
      `),
      choices: [cont('ARA_GIRIS_DEVAM', 'Ara evresine başla', HUB, { role: 'PRIMARY' })],
    }),
    p2.hub({
      ...ARA,
      title: 'Ara',
      background: 'buro',
      lines: p2.dayLines([
        'ARA 1/2 · 2. celseye 13 gün. Telefon o gün Ece’nin elinde değildi. Peki kimin elindeydi?',
        'ARA 2/2 · 2. celseye 6 gün. Yarın akşam dosya kapanıyor.',
      ]),
      tabs: [
        {
          id: 't2_kayit',
          label: 'KAYITLAR',
          kind: 'ARCHIVE',
          choices: [
            act('A2_BELGE', 'Bayi işlem dosyasını incele', 'ARA_BELGE', {
              description: 'Vekâletname ve fotokopi · 6 deneme',
              visibleWhen: has('ev_bayi_belge'),
            }),
            act('A2_SUC', 'Savcılığa suç duyurusu (CMK 158)', 'ARA_SUC', { description: 'Kime, neyle, ne isteyerek?' }),
            free('A2_CIKARIM', 'Çıkarım tahtası', 'ARA_CIKARIM', {
              description: '0 EP · iki kartı birleştir',
              enabledWhen: ref('kart2'),
              lockedReason: 'Tahtada en az iki kart olmalı.',
            }),
            free('A2_LEYLA', 'Leyla’ya danış', 'ARA_LEYLA', {
              description: '0 EP · günde bir kez',
              enabledWhen: cmp(v('leyla_ara'), '<', v('ara_day')),
              lockedReason: 'Leyla bugün başka bir dosyada.',
            }),
          ],
        },
        {
          id: 't2_kisi',
          label: 'KİŞİLER',
          kind: 'PEOPLE',
          choices: [
            act('A2_ARDA', 'Kapıdaki kurye', 'ARA_ARDA', {
              description: 'Büroya kendiliğinden gelen biri',
              visibleWhen: any(has('ev_atm'), has('ev_bayi_belge'), has('ev_sozlesme')),
            }),
            act('A2_GOKHAN', 'Kom. Yrd. Gökhan Ateş', 'ARA_GOKHAN', { description: 'Siber Şube · duruşmadan sonra' }),
            act('A2_NURETTIN', 'Nurettin Aksoy', 'ARA_NURETTIN_0', { description: 'Adliye kantininde' }),
            act('A2_ECE', 'Ece', 'ARA_ECE_0', { description: 'Yıldırım · ikinci celseye hazırlık' }),
            act('A2_BURAK', 'Burak ve Sevim Hanım', 'ARA_BURAK', {
              description: 'Bir özür, belki',
              visibleWhen: visited('INV1_BURAK'),
            }),
          ],
        },
        {
          id: 't2_yer',
          label: 'YERLER',
          kind: 'SCENE',
          choices: [
            act('A2_OTOPARK', 'OM İş Merkezi otoparkı', 'ARA_OTOPARK', {
              description: 'Eksi birinci kat · büyüteç 5',
              visibleWhen: has('clue_arda_otopark'),
            }),
          ],
        },
      ],
      choices: [
        rawChoice('NAVIGATE', 'GO_T', 'DURUŞMAYA GİT · 2. CELSE', {
          role: 'PRIMARY',
          next: 'ARA_SON_1',
          confirm: 'Duruşmaya gidersen ara evresi biter. Emin misin?',
        }),
      ],
    }),
    decisionNode('ARA_DAY_END', [{ when: flag('suc_duyurusu'), to: 'ARA_AKSAM' }, { to: 'ARA_AKSAM2' }], {
      ...ARA,
      onEnter: [...imeiDayEnd.effects, ...(dayEnd.node.onEnter ?? [])],
    }),
    story('ARA_AKSAM', {
      ...ARA,
      title: 'İsimsiz',
      background: 'buro_gece',
      lines: [
        W(
          has('ev_imei_rapor'),
          S`
            = ARA 1. GÜNÜN AKŞAMI · 21.30 — ARSLAN HUKUK @buro_gece
            - Savcılıktan bir yazı gelmişti; hâkim kararı çıkmış, İMEİ sorgusunun cevabı dönmüştü. Üç hat, tek bir cihaz. Üçüncü satırda kurumsal bir hat; abonesi ayrıca sorulmuş, cevap yok.
            - Saat dokuz buçukta büronun sabit telefonu çaldı. Numara gizliydi.
            ?BİR SES{phone}: Avukat hanım. Bazı dosyalar uzarsa, insanın işi de uzar. İyi geceler.
            - Hat kapandı. Bir fısıltı; kadın mı erkek mi, genç mi yaşlı mı, söyleyemezdim. Kızgın değildi; kızgın olmasından daha kötüydü. !shake
            ~ Biri, savcılığa ne yazdığımı biliyor. Ya da tahmin ediyor. İkisi de iyi değil.
            - Büronun ışıklarını söndürmedim. Pencereden sokağa baktım: ıslak asfalt, bir taksi, bir kedi. Kimse yoktu. Kimse olmadığını bilmek, birinin olduğunu bilmekten daha az rahatlatıcıydı.
            ~ Leyla "ona bakma, dosyaya bak" demişti. Dosyaya baktım. Üç hat, bir cihaz. Telefon bir daha çalmadı.
          `,
        ),
        O(S`
          = ARA 1. GÜNÜN AKŞAMI · 21.30 — ARSLAN HUKUK @buro_gece
          - Saat dokuz buçukta büronun sabit telefonu çaldı. Numara gizliydi.
          ?BİR SES{phone}: Avukat hanım. Bazı dosyalar uzarsa, insanın işi de uzar. İyi geceler.
          - Hat kapandı. Bir fısıltı; kadın mı erkek mi, genç mi yaşlı mı, söyleyemezdim. Kızgın değildi; kızgın olmasından daha kötüydü. !shake
          ~ Suç duyurusu bugün verildi. Ve bu akşam biri aradı. Tesadüf, bu meslekte en pahalı kelimedir.
        `),
      ],
      choices: [
        option('ARAK_A', 'Aramayı tutanağa geçir; savcılığa bildir.', {
          score: { USUL_BILGISI: 30 },
          effects: [raise('arama_bildirildi')],
          good: 'Avukata yönelik örtülü tehdit belgelenir ve soruşturma savcısına bildirilir (TCK 106; CMK 158). Faili avukat aramaz.',
          responses: B(S`
            - Saatini, süresini, her kelimeyi yazdım. Sabah ilk iş, savcılığa ek dilekçe.
            ~ Korkuyu kâğıda geçirince küçülmüyor. Ama başkası da okuyabiliyor.
          `),
          next: HUB,
        }),
        option('ARAK_B', 'Gizli numarayı operatörden öğrenip geri ara.', {
          neutral: 'Operatör gizli numarayı avukata vermez; arayanın kimliği ancak savcılığın talebi ve hâkim kararıyla öğrenilir (CMK 135/6). Faili avukat aramaz.',
          responses: B(S`
            - Operatörün çağrı merkezi beni on iki dakika beklettikten sonra kibarca reddetti: "Gizli numara bilgisi yalnızca resmî yazıyla verilir." Ahizeyi yerine koydum. Hiçbir şey.
          `),
          next: HUB,
        }),
      ],
    }),
    story('ARA_AKSAM2', {
      ...ARA,
      title: 'Leyla’nın çayı',
      background: 'buro_gece',
      lines: B(S`
        = ARA 1. GÜNÜN AKŞAMI · 21.30 — ARSLAN HUKUK @buro_gece
        - Leyla iki bardak çay koydu, birini soğumaya bıraktı. Masasındaki ters çerçeveye bir an baktı, sonra bana.
        leyla: Kimse sana teşekkür etmeyecek, Deniz. Ece etmeyecek, çünkü utanıyor. Nurettin etmeyecek, çünkü parası gitti. Hâkim etmeyecek, çünkü işi bu.
        leyla: Kendine de etme. Dosyayı bitir.
      `),
      choices: [cont('ARAK2_DEVAM', 'Yarın', HUB, { role: 'PRIMARY' })],
    }),
    story('ARA_LEYLA', {
      ...ARA,
      title: 'Leyla',
      background: 'buro',
      onEnter: [set('leyla_ara', v('ara_day'))],
      lines: [
        W(
          cmp(v('ara_day'), '==', 1),
          S`
            leyla: Suç duyurusu bir dilekçe değil, bir harita olmalı. "Şu kişi kötü" demek iftira riskidir. "Şu hat, şu saatte, şu cihazda" demek soruşturmadır.
            leyla: Başkasının hattına bakılması için o kişinin şüpheli olması gerekir; şüpheli olması için de somut bir dayanak. Elinde ne varsa, onu yaz. Fazlasını değil.
            leyla: Bir de şu: büroya kendiliğinden gelen biri, senin tanığın değildir. Kendi avukatına gider. Sen dinlersin, yönlendirmezsin.
          `,
        ),
        O(S`
          - Leyla pencerenin önündeydi. Dışarıda yağmur Uludağ'ı silmişti; dağ yoktu, yalnızca bulut vardı.
          leyla: Mahkemede herkes bir şey anlatır. Tanık hatırladığını, savcı düzeni anlatır. Sen yalnızca belgeyi anlat.
          leyla: Kürsüye çıkan kim olursa olsun, sözünü bir belgenin yanına koy. Söz belgeyle çelişiyorsa, sözü bırak, belgeye bak.
          leyla: Ve esas savunmanda, kanıtlayamadığın bir şeyi iddia etme. Gerçek faili göstereceksen, parmağını değil, kâğıdı göster.
          - Bir süre ikimiz de sustuk. Koridordan stajyerlerin sesi geldi; biri bir dilekçenin son sayfasını arıyordu, öbürü fotokopi makinesine sövüyordu.
          leyla: Bir şey daha. Yarından sonra bu dosya bitecek. Ne olursa olsun, Ece'nin hayatı yeniden başlayacak; seninki bir sonraki dosyayla devam edecek.
          leyla: Sakın bu davayı kendi hikâyen yapma. Onun hikâyesi. Sen yalnızca sayfaları doğru sıraya koyan kişisin.
          ~ Leyla bunu söylerken ters çerçeveye bakmadı. Bakmamak için uğraştığını gördüm.
        `),
      ],
      choices: [cont('ARALEYLA_GERI', 'Masana dön', HUB, { role: 'BACK' })],
    }),
    direct(
      documentExam('ARA_BELGE', {
        ...ARA,
        title: 'Bayi işlem dosyası',
        background: 'buro',
        hud: ['exam_b'],
        lines: B(S`
          - Beş sayfa. Bir vekâletname, bir vekilin kimliği, bir abone kimliği "fotokopisi", bir işlem formu. Hepsi taranmış, hepsi biraz eğri.
          - Leyla omzumun üstünden baktı. "Noterler karekod basar" dedi, "sahteciler de basar. Ama sahtecinin karekodu bir yere gitmez." Gitti.
          ~ Bir sahte belge, ilk bakışta değil, ikinci ışıkta ele verir kendini.
          - Sayfaların kenarında bayinin damgası, damganın üstünde bir kahve halkası. Biri bu dosyayı aceleyle taramış; ya da aceleyle taranmasını istemiş.
        `),
        header: { left: 'MAVİ İLETİŞİM · SIM DEĞİŞİKLİĞİ', right: '04.11.2025 10.12' },
        columns: [
          { label: 'BELGE', flex: 1.2 },
          { label: 'İÇERİK', flex: 2.2 },
        ],
        rows: [
          row('b1', ['Vekâletname', 'GEMLİK 2. NOTERLİĞİ · 28.10.2025']),
          row('b2', ['Yevmiye / karekod', '18842 · KAREKOD BASILI']),
          row('b3', ['Vekil', 'ARDA KILIÇ · 19 YAŞ']),
          row('b4', ['Abone kimliği', 'ECE YALIN · FOTOKOPİ']),
          row('b5', ['İşlemi yapan', 'O. DEMİRCİ · 10.12']),
        ],
        tools: [
          tool('mag', 'Büyüteç', 'magnifier'),
          tool('cmp', 'Karşılaştır', 'compare'),
          tool('chk', 'Doğrula', 'check'),
        ],
        costVar: 'exam_b',
        rules: [
          examine('EX_B2', 'chk', 'b2', {
            discovers: 'ev_noter_yok',
            score: { DELIL_ANALIZI: 150 },
            feedback: {
              title: 'YENİ DELİL',
              text: 'Karekodu ve yevmiye numarasını noterlik belge doğrulamasında sorguladım. Ekranda iki kelime: “Belge bulunamadı.” Vekâletname hiç düzenlenmemiş.',
              label: '+150 SKOR · Delil çantasına eklendi',
              tone: 'special',
            },
          }),
          examine('EX_B4', 'mag', 'b4', {
            discovers: 'clue_parlama',
            score: { DELIL_ANALIZI: 150 },
            feedback: {
              title: 'YENİ İPUCU',
              text: '“Fotokopi” bir fotokopi değil; bir fotoğraftan basılmış. Kimlik kartının sol üstünde beyaz bir yıldız gibi bir parlama. Alt köşede bir başparmak; ojesi bordo, köşesi kırık.',
              label: '+150 SKOR · Not defterine eklendi',
              tone: 'special',
            },
          }),
          examine('EX_B3', 'cmp', 'b3', {
            discovers: 'clue_vekil_arda',
            score: { DELIL_ANALIZI: 100 },
            feedback: {
              title: 'YENİ İPUCU',
              text: 'Vekil: Arda Kılıç, on dokuz yaşında. Kimlik fotokopisi ekli. Bu adı ve bu yüzü bir yerden tanıyorum.',
              label: '+100 SKOR · Not defterine eklendi',
              tone: 'special',
            },
          }),
        ],
        miss: fallback('FB_BELGE', 'EXAMINE', {
          score: { DELIL_ANALIZI: -20 },
          feedback: {
            title: 'SONUÇ YOK',
            text: 'Bu aletle bu satırda yeni bir şey görünmüyor.',
            label: `${minus(20)} SKOR`,
            tone: 'error',
          },
        }),
        finish: { id: 'BELGE_BITIR' },
      }),
    ),
    choiceNode('ARA_SUC', {
      ...ARA,
      title: 'Suç duyurusu',
      background: 'buro',
      prompt: 'Bursa Cumhuriyet Başsavcılığına. Kimin hakkında, hangi somut dayanakla, ne isteyerek?',
      choices: [
        option('SUC_A', 'Failleri belirsiz: Nova İK hattı ve cihazı için soruşturma', {
          effects: [
            ifThen(
              has('ded_kaan'),
              [
                raise('suc_duyurusu'),
                score('USUL_BILGISI', 40),
                ifThen(
                  has('ev_hts'),
                  [
                    raise('imei_istendi'),
                    score('USUL_BILGISI', 40),
                    mark(
                      'GOOD',
                      'Somut dayanaklı suç duyurusu (CMK 158) ve şüpheli hat ile IMEI için iletişim tespiti talebi (CMK 135/6). Rapor, hâkim kararıyla gelir.',
                      'USUL_BILGISI',
                    ),
                  ],
                  [
                    mark(
                      'GOOD',
                      'Somut dayanaklı suç duyurusu (CMK 158); ama cihazın IMEI’si elinde olmadığından cihaz sorgusu istenemedi.',
                      'USUL_BILGISI',
                    ),
                  ],
                ),
              ],
              [
                mark(
                  'NEUTRAL',
                  'Dayanaksız bir suç duyurusu kayda girer ama iletişim tespiti istenemez; önce işveren ile satıcının aynı kişi olduğunu göstermelisin.',
                  'USUL_BILGISI',
                ),
              ],
            ),
          ],
          responses: [
            W(
              all(has('ded_kaan'), has('ev_hts')),
              S`
                - Leyla dilekçeyi okudu; bir kelimeyi değiştirdi. "Kesin" yazdığım yere "muhtemel" yazdı. "Savcıya kesin deme" dedi; "kesin olanı o söylesin."
                - Dilekçeyi üç sayfada bitirdim. Birinci sayfada iki numara: işverenin ve satıcının, aynı. İkinci sayfada bir IMEI: kopya SIM'in takıldığı cihaz. Üçüncü sayfada bir talep.
                - IMEI'yi yazarken bir telefonun da bir kimliği olduğunu düşündüm. Kart değişir; telefon değişmez.
                - Savcılık kalemindeki memur dilekçeyi okudu, kaşlarını kaldırdı. "Bu gerçekten bir harita, avukat hanım" dedi. Numara aldı.
                ~ Bir cihazın içinde hangi hatların yaşadığını soruyorum. Cevap bir hâkimin imzasından geçecek.
              `,
            ),
            W(
              has('ded_kaan'),
              S`
                - İki numarayı yan yana koydum: işverenin ve satıcının, aynı. Savcılık bunun üstüne hattın kayıtlarını isteyebilir.
                ~ Ama hattın hangi telefonda yaşadığını bilmeden, telefonu soramadım. Bir kapıyı araladım; anahtarı bende değil.
              `,
            ),
            O(S`
              - Dilekçeyi yazdım, okudum, yeniden okudum. "Bilinmeyen kişi ya da kişiler." Bir somut satır yoktu.
              ~ Kalem memuru numara verdi. Bir yıl sonra bir başka avukata da verecek; aynı dilekçeye.
            `),
          ],
          next: '$stay',
        }),
        option('SUC_B', 'Burak Toprak hakkında: şifreyi biliyordu, ayrılıktan sonra tehdit mesajı attı (TCK 106)', {
          score: { USUL_BILGISI: -40 },
          effects: [raise('suc_burak')],
          bad: 'Somut delile dayanmayan suçlama iftira riskidir (TCK 267); üstelik Burak’ın 4 Kasım sabahı dükkânında olduğu belgeliydi.',
          responses: B(S`
            - Dilekçeyi yazarken elim durdu. "Pişman olacaksın" bir tehdit mi, bir ayrılık cümlesi mi? Ve tehdit mesajı hangi numaradan gelmişti?
            ~ Gönderdim. Gönderdikten sonra bunun bir harita değil, bir öfke olduğunu anladım. Sevim Hanım'ın öfkesi; benim elimden.
          `),
          next: '$stay',
        }),
        option('SUC_C', 'Mahkemeye: vekil gösterilen kişinin tanık olarak dinlenmesi', {
          visibleWhen: any(has('clue_vekil_arda'), has('ev_sozlesme'), has('ev_atm')),
          score: { USUL_BILGISI: 40 },
          effects: [raise('arda_cagrildi')],
          good: 'Kimliği kullanılan kişinin tanık olarak dinlenmesi istenebilir (CMK 177, 178); avukat onu kendisi sorgulamaz, mahkeme dinler.',
          responses: B(S`
            - Mahkemeye kısa bir dilekçe: "Sanal ofis sözleşmesinde ve vekâletnamede adı geçen Arda Kılıç'ın tanık olarak dinlenmesi."
            ~ Onu ben dinlemeyeceğim. Mahkeme dinleyecek. Bu, onun için de benim için de daha güvenli.
          `),
          next: '$stay',
        }),
        cont('SUC_VER', 'Dilekçeleri gönder', HUB, { role: 'PRIMARY' }),
      ],
    }),
    direct(
      conversation('ARA_ARDA', {
        ...ARA,
        title: 'Kapıdaki kurye',
        background: 'buro',
        room: { label: 'ARSLAN HUKUK · BEKLEME', character: 'arda' },
        onFirstEnter: [{ type: 'MEET', character: 'arda' }],
        lines: B(S`
          = ARSLAN HUKUK · 16.40 @buro
          - Kapıda motorlu kurye montlu bir genç duruyordu. Kaskı elinde, saçı terden alnına yapışmış. Montunun sırtında sarı harfler: "HIZLI PAKET."
          arda: Abla… avukat abla siz misiniz? Ece Yalın'ın? Polis beni çağırdı. Kimliğim bir kâğıtta çıkmış. Ben bir şey imzalamadım. Yemin ederim.
          arda: Bir abi bana kurye işi verdi. "Kaan Abi." ATM'den para çektim, QR'la. Şirket tahsilatı dedi. Çekim başı beş yüz lira. Ben… ben suçlu muyum abla?
          arda: Annem bilmiyor. Babam yok. Ben bu parayla motorun taksitini ödüyordum. Beş yüz lira çok para abla, biliyor musun? Bir gecede beş yüz.
          - Sesi çatallaştı. Kaskını iki elinin arasında çeviriyordu; vizöründe bekleme salonunun florasanı küçük bir ay gibi dönüyordu.
          arda: Kaan Abi'nin numarası kapandı. Polis beni aradığında anladım. Ben bir dolandırıcıya kuryelik yapmışım. Beş yüz liraya.
          ~ Bu çocuk benim müvekkilim değil. Bir gün şüpheli olabilir. Bugün ne söylersem, ikimizin dosyasına da yazılır.
        `),
        choices: [
          option('AR_A', 'Sana avukat olamam. Baronun adli yardım bürosuna git; ifadeni orada, avukatınla ver.', {
            discovers: 'clue_arda_otopark',
            score: { USUL_BILGISI: 60 },
            effects: [raise('arda_avukat')],
            next: HUB,
            good: 'Çıkar çatışması olan kişiye hukuki yardım verilmez, ifadesi alınmaz (Av.K. 38/1-b; TBB Meslek Kuralları). Onu kendi avukatına yönlendirmek doğrudur.',
            responses: B(S`
              - Kartvizitimin arkasına baronun adli yardım bürosunun adresini yazdım. Arda kartı iki eliyle aldı; bir sınav kâğıdı gibi.
              arda: Avukatım mı olacak? Benim? Tamam. Tamam abla.
              - Kapıdan çıkarken durdu. Söylemesi için ona hiçbir şey sormamıştım; o yine de söyledi, yük gibi.
              arda: Parayı hep aynı yere götürdüm. OM'nin otoparkı. En köşedeki tabelalı yer. Siyah bir araba. Cam yarım iner, zarfı uzatırım. Yüzünü hiç görmedim.
              ~ OM İş Merkezi. Nova'nın adresi. Bir kâğıt üstündeki adresin bodrumunda, gerçek bir araba.
              arda: Bir de… bir kere parayı geç getirdim, yağmur vardı. Telefonda çok kızdı. Ama kibar kızdı. "Arda kardeşim, zaman paradır" dedi. Kibar kızan insandan korkarım ben.
              - Kaskını takmadan merdivenleri indi. Pencereden baktım: motoruna binmedi, bir süre yanında durdu, sonra iterek yürüdü. Bir kurye, ilk kez acelesi yokmuş gibi.
            `),
          }),
          option('AR_B', 'Otur. Anlat; ben yazayım, sen imzala. Mahkemeye ben sunarım.', {
            discovers: 'clue_arda_otopark',
            score: { USUL_BILGISI: -30 },
            effects: [raise('arda_ifade')],
            next: HUB,
            bad: 'Çıkarı müvekkilinle çatışabilecek birinden yazılı beyan almak meslek kurallarına aykırıdır ve beyanın değerini düşürür; tanık mahkemede dinlenir.',
            responses: B(S`
              - Yazdım. "OM İş Merkezi otoparkı, köşedeki tabelalı yer, siyah araba, cam yarım iner." İmzaladı; eli titriyordu.
              ~ Elimde imzalı bir kâğıt var. Savcı bu kâğıdı "avukatın yazdırdığı beyan" diye okuyacak. Haklı da olacak.
            `),
          }),
          option('AR_C', 'Mahkemede yalnızca şunu söyle: Ece’yi tanımazsın, her şeyi Kaan yaptı. Fazlasını söyleme.', {
            score: { USUL_BILGISI: -150 },
            effects: [inc('ethics', 2), dec('cred'), raise('tanik_etkileme'), raise('arda_etkileme')],
            next: HUB,
            bad: 'Tanığa ne söyleyeceğini dikte etmek tanığı etkilemedir (TCK 277) ve ağır meslek ihlalidir (Av.K. 34).',
            responses: B(S`
              arda: Tamam abla. Ece'yi tanımam. Kaan yaptı. Başka bir şey söylemem.
              - Gitti. Kapı kapandı. Masamın üstünde kaskının bıraktığı yağmur halkası kaldı.
              ~ Bir tanığa cümle verdim. O cümle kürsüde benim sesimle konuşacak.
            `),
          }),
        ],
      }),
    ),
    direct(
      sceneSearch('ARA_OTOPARK', {
        ...ARA,
        title: 'Otopark',
        background: 'sokak_karanlik',
        hud: ['taps_o'],
        exposeCounts: true,
        scene: 'sc_otopark',
        lines: B(S`
          = OM İŞ MERKEZİ · OTOPARK · 19.10 @sokak_karanlik
          - Eksi birinci kat. Islak beton, sarı çizgiler, bir kolondan öbürüne yankılanan damla sesi. Bariyer bana açılmadı; yürüyerek girdim.
          ~ Arda her seferinde buraya gelmiş. Kimseyi görmemiş, bir camın yarısını görmüş. Camın arkasını göremiyorum; ama camın durduğu yeri görebilirim.
          - Köşeye yaklaştıkça ışık azaldı. Kameranın kırmızı noktası arkamda kaldı. Burada, bu köşede, bir araba kimseye görünmeden bekleyebilirdi.
          - Bir arabanın alarmı çaldı, sonra sustu. Duvarlarda boya kokusu, köşelerde örümcek ağları. Kapalı otoparklar bir şehrin bilinçaltıdır; herkes kullanır, kimse bakmaz.
          ~ Burada kimseyi beklemiyorum, kimseyi takip etmiyorum. Yalnızca bir kuryenin anlattığı yere bakıyorum. Gördüğümü yazacağım; gerisini mahkeme soracak.
        `),
        instruction: 'Dikkat çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
        costVar: 'taps_o',
        miss: fallback('FB_OTOPARK', 'TAP', {
          score: { ARASTIRMA: -10 },
          feedback: { text: 'Islak beton. Bir yağ lekesi. (−1 büyüteç)', label: `${minus(10)} SKOR`, tone: 'error' },
        }),
        finish: { id: 'OTOPARK_BITIR', label: 'Otoparktan çık' },
      }),
    ),
    direct(
      conversation('ARA_GOKHAN', {
        ...ARA,
        title: 'Siber Şube',
        background: 'karakol',
        room: { label: 'EMNİYET · SİBER ŞUBE', character: 'gokhan' },
        lines: [
          W(
            flag('contra_g1'),
            S`
              = EMNİYET · SİBER ŞUBE · 10.30 @karakol
              - Gökhan beni görünce ekranı kapattı. Bu sefer kapattı.
              gokhan: Avukat hanım. Duruşmadan sonra bankanın cihaz kaydını kendim istedim. Samsung. Haklıydınız. Dört yüz dosya, bir tanesi yanlış. Belki daha fazlası.
              - Masasındaki ölü sukulentin yerinde yeni bir saksı vardı; küçük, yeşil, kendinden emin. "Kızım getirdi" dedi, sormadan. "Bunu da öldürürsem bir daha getirmeyecekmiş."
            `,
          ),
          O(S`
            = EMNİYET · SİBER ŞUBE · 10.30 @karakol
            - Gökhan ekranı kapatmadan bana döndü. Duruşmadan sonra biraz daha yorgundu; ya da bana öyle geldi.
            gokhan: Avukat hanım. Dosyanız hâlâ bende değil, mahkemede. Ama merak ettim. Buyurun.
          `),
        ],
        choices: [
          option('GK2_ZINCIR', 'Avansı gönderen MEHMET DEMİR kim?', {
            score: { SORGULAMA: 30 },
            effects: [raise('fact_zincir')],
            responses: B(S`
              - Duvardaki panodan bir dekontu çıkardı, bana gösterdi. Gönderen: MEHMET DEMİR. Altında kırmızı kalemle yazılmış bir soru işareti.
              gokhan: Manisa'da yetmiş bir yaşında bir adam. Kimliği iki yıl önce bir "emekli kredisi" ilanıyla alınmış. Hesabı açılmış, kullanılmış. Onun da haberi yok.
              gokhan: Bu bir zincir, avukat hanım. Her halkası bir kurban. Ortada bir el var; o el hiçbir hesabı kendi adına açmaz.
              gokhan: Kripto platformuna giden kırk bin? O hesap da başka bir kurbanın kimliğiyle açılmış. Bir ev hanımı, Eskişehir'de. Her yer kurban, avukat hanım. Bir tek ortadaki el yok.
              ~ Her halkası bir kurban. Ece bir halka. Arda bir halka. Mehmet Demir bir halka. Ve el.
            `),
            next: '$stay',
          }),
          option('GK2_IMEI', 'Bir cihazda hangi hatların kullanıldığını öğrenmenin yolu ne?', {
            score: { HUKUKI_BILGI: 30 },
            effects: [raise('fact_imei_yol')],
            responses: B(S`
              gokhan: IMEI sorgusu. Cihazın kimliğiyle operatörlere sorulur; o cihaza hangi kartlar takılmış, söyler. Ama bu bir iletişim tespiti; hâkim kararı ister.
              gokhan: Sanığın hattı değil artık, bilinmeyen birinin cihazı. Yani bir soruşturma lazım. Suç duyurusu verin; IMEI'yi yazın. Gerisini savcı ister, hâkim verir.
              gokhan: Bir cihaz bir insan gibidir avukat hanım. Adını değiştirebilirsin, kartını değiştirebilirsin. Parmak izini değiştiremezsin. IMEI onun parmak izi.
            `),
            next: '$stay',
          }),
          option('GK2_KAYIT', 'Bankanın cihaz kaydına bakınca ne gördünüz?', {
            visibleWhen: any(flag('contra_g1'), has('ev_banka_log')),
            score: { SORGULAMA: 30 },
            responses: B(S`
              - Gökhan ekranını bana çevirdi. Bir tablo: tarih, saat, cihaz modeli. Kırmızıyla işaretlenmiş tek bir satır.
              gokhan: Samsung, orta segment. Bu tür işlerde hep aynı model çıkıyor; ucuz, kutusu atılır, kimseye sorulmaz. Bir haftalığına alınır.
              gokhan: Cihazı tanımladıkları an 14.29. Kod 14.26'da gelmiş. Üç dakika. Sanığın kodu okumasıyla cihazın tanımlanması arasında üç dakika var, avukat hanım.
              gokhan: Ben o üç dakikayı bir yıl önce görseydim, sanığa "kimle konuştun" diye sorardım. "Kod verdin mi" diye değil.
              - Sesi alçaldı. Bardağı aldı; bu sefer içinde kahve vardı.
              gokhan: Dört yüz dosya dedim size. Bu hafta otuzunu açtım. Üçünde aynı model, aynı saat aralığı. Bir şey var. Ne olduğunu bilmiyorum.
              ~ Yorgun bir polis, uyanınca tehlikeli olur. Dolandırıcılar için.
            `),
            next: '$stay',
          }),
          option('GK2_ATM', 'ATM’deki kapüşonlu genci buldunuz mu?', {
            visibleWhen: has('ev_atm'),
            score: { SORGULAMA: 20 },
            responses: B(S`
              gokhan: Montun sırtındaki yazıdan kurye şirketine ulaştık. Arda Kılıç. On dokuz yaşında. Ayrı bir dosyada ifadesini alacağız.
              gokhan: O da bir ilanla işe girmiş. "Kurye aranıyor." Bu işte herkes bir ilanla başlıyor, avukat hanım. Bir tek ilanı veren hariç.
            `),
            next: '$stay',
          }),
          cont('GK2_GERI', 'Teşekkür et, çık', HUB, { role: 'BACK' }),
        ],
      }),
    ),
    decisionNode('ARA_NURETTIN_0', [{ to: 'ARA_NURETTIN' }], {
      ...ARA,
      lines: [
        W(
          flag('nurettin_saygi'),
          S`- Telefondaki konuşmamızı hatırlıyordu. "Dürüst bir cevap; hoşuma gitmemişti" dedi. "Ama hatırladım."`,
        ),
        W(
          flag('nurettin_soz'),
          S`- Beni görünce dudaklarını büzdü. "Paramı geri alacak avukat" dedi. Alay etmiyordu; yorgundu.`,
        ),
      ],
    }),
    decisionNode('ARA_ECE_0', [{ to: 'ARA_ECE' }], {
      ...ARA,
      lines: [
        W(
          flag('fact_anne'),
          S`- Kapıyı Sevim Hanım açtı. Parmağında bir yara bandı vardı; Ece'nin anlattığı iğne. "Bir şey yok" dedi, sormadan.`,
        ),
        W(
          flag('fact_ekran'),
          S`- Ece masada laptopuyla oturuyordu. Ekran görüntüsü klasörünü açmış, tarihe göre sıralamıştı. "Başka bir şey lazım olur diye" dedi.`,
        ),
        W(
          flag('fact_burak_ece'),
          S`- Masada yırtık fotoğraf şeridinin yarısı duruyordu; bant ile öbür yarısına yapıştırılmıştı. Ece bakışımı yakaladı, şeridi ters çevirdi.`,
        ),
      ],
    }),
    direct(
      conversation('ARA_NURETTIN', {
        ...ARA,
        title: 'Kantin',
        background: 'adliye',
        room: { label: 'ADLİYE KANTİNİ', character: 'nurettin' },
        lines: B(S`
          = ADLİYE KANTİNİ · 13.15 @adliye
          - Nurettin Aksoy köşedeki masada, bir simit ve bir çayla oturuyordu. Beni görünce kalkmadı; ama karşısındaki sandalyeyi ayağıyla biraz itti.
          nurettin: Oturun. Avukatım yok; bilmediğim bir şeyi bilmem gerekiyorsa, söyleyin. Bilmemem gerekiyorsa da söyleyin.
          > Ben sanığın avukatıyım, Nurettin Bey. Sizin değil. Bunu bilerek konuşun.
          nurettin: Biliyorum. Kırk yıl öğretmenlik yaptım; kimin hangi sırada oturduğunu bilirim.
          - Simidinin susamlarını parmağıyla masanın kenarına topluyordu; bir sınıfın tebeşir tozunu toplar gibi. Kantinin televizyonunda hava durumu: Bursa, yağmurlu, haftanın geri kalanı da.
          nurettin: Duruşmadan sonra eve gidip eşime anlattım. "Avukatı bana kapıyı açtı" dedim. "Katılmama itiraz etmedi." Eşim "o kız masumsa?" dedi. Ben cevap veremedim.
        `),
        choices: [
          option('NU_FOTO', 'İlanın fotoğrafları sizde duruyor mu?', {
            discovers: 'ev_ilan_foto',
            score: { ARASTIRMA: 50 },
            responses: B(S`
              - Çayından bir yudum aldı. Simidini ikiye böldü, yarısını bana uzattı. Almadım; aldım. Bir öğretmenin simidi reddedilmez.
              nurettin: Duruyor. Hepsini yazdırdım. Ben her şeyi yazdırırım.
              - Cebinden katlanmış üç kâğıt çıkardı. Bir Clio, gri, temiz. Üçüncü karede arabanın arkasında bir cam cephe; camda ters yansımış iki harf: "OM."
              nurettin: Bunları mahkemeye ben veririm. Siz değil. Siz verirseniz, "avukat hazırlamış" derler.
              ~ Haklı. Ve bir öğretmen, delilin kimin elinden geldiğini benden iyi biliyor.
            `),
            next: '$stay',
          }),
          option('NU_ES', 'Eşiniz nasıl? Diyaliz günleri hâlâ aynı mı?', {
            effects: [raise('nurettin_yumusadi')],
            responses: B(S`
              nurettin/uzgun: Salı, perşembe, cumartesi. Belediyenin servisiyle gidiyor şimdi. Ben yanında oturuyorum. Arabam olsaydı, dönüşte simit alırdık. Ufak bir şey.
              nurettin: Kırk yıl öğrencilerime "kimseye körü körüne inanmayın" dedim. Sonra bir sese inandım. Hocam dedi diye. Babam öğretmendi dedi diye. Yaşlandım, avukat hanım.
              nurettin: Sizin müvekkiliniz… o da bir ilana inanmış, öyle mi? Ben de bir ilana inandım.
              ~ İki kişi, aynı numaraya inanmış. Birinin parası gitti, öbürünün adı.
            `),
            next: '$stay',
          }),
          option('NU_VAZGEC', 'Şikâyetinizden vazgeçerseniz Ece’nin işi kolaylaşır.', {
            score: { USUL_BILGISI: -60 },
            effects: [inc('ethics'), dec('cred'), raise('nurettin_baski')],
            bad: 'Nitelikli dolandırıcılık şikâyete bağlı değildir; vazgeçme davayı düşürmez. Üstelik katılanı yönlendirmeye çalışmak meslek kurallarına aykırıdır.',
            responses: B(S`
              nurettin/kizgin: Vazgeçmek mi? Siz bana bunu söylemek için mi oturdunuz? Ben bu sandalyeyi size boşuna itmişim.
              - Kalktı. Simit masada kaldı.
            `),
            next: HUB,
          }),
          cont('NU_GERI', 'Teşekkür et, kalk', HUB, { role: 'BACK' }),
        ],
      }),
    ),
    direct(
      conversation('ARA_ECE', {
        ...ARA,
        title: 'Ece',
        background: 'ev',
        room: { label: 'YALINLARIN SALONU', character: 'ece' },
        lines: [
          W(
            flag('yasak_kalkti'),
            S`
              = YILDIRIM · YALINLARIN SALONU · 18.20 @ev
              - Ece'nin pasaportu sehpanın üstündeydi; hiç kullanılmamış, yeni. "Çıkarttım" dedi. "Gitmek için değil. Gidebilmek için."
              ece/uzgun: Bir bankadan iş teklifi gelmişti, biliyor musunuz? Geçen ay. Adli sicil kaydı sordular. "Dava sürüyor" dedim. "Sonra görüşelim" dediler.
              - Pasaportun kapağını açtı, kapattı. Fotoğrafta saçları kısaydı; bir yıl önce, her şeyden önce çekilmiş. "Bu kızı tanımıyorum artık" dedi. "Ama ona borçluyum. Onu geri getireceğim."
            `,
          ),
          O(S`
            = YILDIRIM · YALINLARIN SALONU · 18.20 @ev
            - Ece mezuniyet fotoğrafını duvardan indirmişti. Yerinde açık renk bir dikdörtgen kalmıştı.
            ece/uzgun: Bir bankadan iş teklifi gelmişti, biliyor musunuz? Geçen ay. Adli sicil kaydı sordular. "Dava sürüyor" dedim. "Sonra görüşelim" dediler.
          `),
        ],
        choices: [
          option('EC_HATIRLA', 'Mülakatı bir daha düşün. Kaan Bey’in kamerası hiç açılmadı mı?', {
            discovers: 'clue_yuzuk_ece',
            score: { SORGULAMA: 40 },
            responses: B(S`
              - Ece gözlerini kapadı. Bir süre öyle kaldı.
              ece: Bir kere. İki saniye. "Ay pardon" dedi, hemen kapattı. Yüzünü görmedim; bir masa, bir el. Parmağında bir yüzük vardı galiba; ışıkta bir an parladı. O kadar.
              - Odadan dikiş makinesinin sesi geliyordu. Ece bir an onu dinledi, sonra gözlerini açmadan konuşmaya devam etti.
              ece: Neden önemli? Herkesin yüzüğü var.
              - Bir süre sustu. Sonra parmaklarına baktı; kendi parmaklarına, kırık ojesine.
              ece: Ben ona kimliğimi gönderirken başparmağım karedeydi. O da bir an elini göstermiş. Komik. İkimiz de elimizi göstermişiz; ben bilerek, o bilmeden.
              ~ Herkesin yüzüğü var. Bir yüzük kimseyi göstermez. Ama bir gün bir başkasının anlattığını doğrulayabilir.
            `),
            next: '$stay',
          }),
          option('EC_SALON', 'Nurettin Bey de salonda olacak. Onu görünce ne hissediyorsun?', {
            score: { SAVUNMA_STRATEJISI: 20 },
            responses: B(S`
              - Ece bir süre cevap vermedi. Sehpanın üstündeki çay bardağını çevirdi; bir tur, bir tur daha.
              ece: Utanıyorum. Benim hesabıma girdi o para. Benim adım onun cüzdanında bir yıl durdu. Ben görmedim bile o parayı, ama adım gördü.
              ece/uzgun: İlk celsede bana hiç bakmadı. Bakmasın diye uğraştı; ben de gördüm uğraştığını. İnsan birine bakmamak için de yorulurmuş.
              > Ona bir şey söylemek zorunda değilsin. Salonda kimse kimseden özür dilemek zorunda değil.
              ece: Biliyorum. Ama dilemek istersem? Son sözde?
              > Son söz senin. Ne söyleyeceğini ben yazmam. Sadece şunu bil: orada söylediğin her şey tutanağa geçer.
              - Ece başını salladı. Mutfaktan Sevim'in sesi geldi: "Çaylar soğudu." Kimse kalkmadı.
            `),
            next: '$stay',
          }),
          option('EC_HAZIR', 'Ezber yapma; sorarlarsa hatırladığını söyle.', {
            score: { SAVUNMA_STRATEJISI: 40 },
            effects: [raise('ece_hazir')],
            good: 'Avukat müvekkili hazırlar ama cümle yazdırmaz; hatırladığını, hatırladığı kadar söylemesini öğütler.',
            responses: [
              W(
                flag('ece_inkar'),
                S`
                  ece: Ya bana yine kodu sorarlarsa? Siz "inkâr et" dediniz.
                  ~ Dedim. Ve şimdi o cümle, ikimizin arasında bir taş gibi duruyor.
                  > Sorarlarsa… doğruyu söyle, Ece. Önceki tavsiyem yanlıştı. Bedelini ben öderim.
                  ece/saskin: Siz mi? Peki. Doğruyu.
                `,
              ),
              O(S`
                ece: Hatırladığımı. Hatırladığım kadar. Tamam. Ezber yapmam; zaten ezberlediklerim hep yanlış çıktı.
                ece: Bir şey soracağım. Nurettin Bey… ona ne olacak? Parası. Ben ona her ay bir şey göndersem? Benim borcum değil, biliyorum. Ama onun da borcu değildi.
                > Bunu dava bittikten sonra konuşalım, Ece. Şimdi bir şey göndermek, kabul gibi okunur. Ama sorman güzel.
              `),
            ],
            next: '$stay',
          }),
          cont('EC_GERI', 'Kalk', HUB, { role: 'BACK' }),
        ],
      }),
    ),
    story('ARA_BURAK', {
      ...ARA,
      title: 'Özür',
      background: 'sokak_gece',
      lines: [
        W(
          flag('fact_burak_temiz'),
          S`
            = YILDIRIM · TAMİRCİ · 19.40 @sokak_gece
            - Sevim Hanım'ı tamircinin önüne kadar götürdüm. Yağmur yine başlamıştı; merdiven altındaki dükkânın camında lehim makinesinin kırmızı ışığı.
            - Yolda Sevim hiç konuşmadı. Plastik dosyasını göğsüne bastırmıştı; içinde Burak'a ait hiçbir kâğıt yoktu ama yine de onu taşıyordu.
            > Kayıtlar temiz, Sevim Hanım. 4 Kasım sabahı Burak dükkânındaymış. Üç ödeme, kendi kamerası, hiçbir şey silinmemiş.
            - Sevim bir süre kapıda durdu. Elini kapı koluna koydu, çekti, yine koydu.
            sevim: Burak oğlum. Ben… sana haksızlık ettim. Ben kutu atmam, fatura atmam. Ama kafamdakini atmayı bilmiyormuşum.
            burak: Teyze… Önemli değil. Ece nasıl?
            sevim/uzgun: Odasında. Tabloyu açıp kapatıyor. Bir de sizin fotoğrafınız varmış; yırtık. Yarısını atmış, yarısını saklıyor.
            - Burak bir şey demedi. Tezgâhın çekmecesini açtı, içinden ters çevrilmiş çerçeveyi çıkardı, bir an baktı, geri koydu.
          `,
        ),
        O(S`
          = YILDIRIM · TAMİRCİ · 19.40 @sokak_gece
          - Sevim Hanım'ı tamircinin önüne kadar götürdüm. Burak'ın 4 Kasım sabahı nerede olduğunu sormamıştım; elimde temiz bir kayıt yoktu.
          sevim: Siz bilmiyorsanız ben de bilmem. Ama ben ondan şüphelenmeye devam ederim.
          - Burak dükkânın içinden bize baktı. Kapıyı açmadı. Biz de çalmadık.
          ~ Bir şüpheyi kaldırmanın tek yolu, onu bir belgeyle değiştirmek. Ben değiştirmedim.
        `),
      ],
      choices: [
        option('ABUR_A', 'Burak’a bir şey sor: duruşmaya gelir mi, Ece için?', {
          visibleWhen: flag('fact_burak_temiz'),
          effects: [raise('burak_gelecek')],
          responses: [
            W(
              flag('burak_red'),
              S`
                burak: Duruşmaya mı? Ben tanık değilim ki. Hem o şifreyi kapattım, biliyorsun. Temizim artık.
                > Tanık olarak değil. Arka sırada bir yüz olarak.
                burak: …Gelirim. Arka sıra. Ece görmesin ama.
              `,
            ),
            O(S`
            burak: Duruşmaya mı? Ben tanık değilim ki.
            > Tanık olarak değil. Arka sırada bir yüz olarak. Bazen bir salonda kimin oturduğu, kimin konuştuğundan önemlidir.
            burak: …Gelirim. Arka sıra. Ece görmesin ama.
            ~ Görecek. Herkes görür. Ama bazı şeyler görülmek için yapılmaz.
          `),
          ],
          next: HUB,
        }),
        cont('ARABURAK_GERI', 'Büroya dön', HUB, { role: 'BACK' }),
      ],
    }),
    direct(
      deductionBoard('ARA_CIKARIM', {
        ...ARA,
        title: 'Çıkarım Tahtası',
        background: 'buro_gece',
        lines: B(S`
        - Pano kalabalıklaşmıştı. Kırmızı ipler birbirinin üstünden geçiyor, bir yerde düğümleniyordu. Leyla geçerken durdu, hiçbir şey söylemeden bir iğneyi düzeltti.
        - Yeni kartlar eskilerin arasına sıkışmıştı: bir rapor, bir fotokopi, bir otopark köşesi. Bir yıl önce bu panoda tek bir kart olurdu: "Hesap sanığın." Şimdi o kart bir köşede, iğnesi gevşemiş.
        ~ Her yeni kâğıt bir soruyu kapatıyor, bir başkasını açıyor. Doğru iki kartı yan yana koyabilirsem, yarın salonda bir kapı daha kapanır; ya da açılır.
      `),
        pool: [
          'clue_hr_no',
          'clue_satici_no',
          'clue_avans',
          'clue_mdemir_cikis',
          'clue_sgk_mesaj',
          'ev_not',
          'clue_kvkk_mesaj',
          'ev_sim_dokum',
          'clue_ding_ece',
          'clue_ding_nurettin',
          'clue_simyok',
          'clue_iphone_imei',
          'ev_banka_log',
          'ev_hts',
          'clue_parlama',
          'clue_lamba',
          'clue_arda_otopark',
          'clue_yonetim_park',
          'ev_imei_rapor',
          'clue_kartvizit',
          'clue_vekil_arda',
          'ev_sozlesme',
          'clue_qr_atm',
          'clue_asansor',
          'clue_levha',
          'clue_kiraci',
          'clue_cv',
          'clue_vesikalik',
        ],
        recipes: [
          fresh(
            'CB_IMEI',
            'clue_iphone_imei',
            'ev_hts',
            'ded_imei',
            'İki ayrı cihaz',
            'Kutudaki IMEI 35 391508…; kopya SIM’in takıldığı cihaz 35 491207… Banka SMS’lerini alan telefon Ece’nin telefonu değil.',
          ),
          fresh(
            'CB_CIHAZ',
            'ev_banka_log',
            'clue_iphone_imei',
            'ded_cihaz',
            'Samsung, iPhone değil',
            'Bankaya 3 Kasım 14.29’da tanımlanan cihaz bir Samsung; Ece’nin kutusundaki telefon bir iPhone 8. Hesaba o gün giren el, Ece’nin eli değildi.',
          ),
          fresh(
            'CB_KOPYA',
            'clue_parlama',
            'clue_lamba',
            'ded_kopya',
            'Aynı lamba, aynı oje',
            'Fotokopideki yıldız ve kırık oje Ece’nin masasından. Bayiye verilen kimlik, Ece’nin Nova’ya gönderdiği fotoğraftan basılmış.',
          ),
          fresh(
            'CB_OTOPARK',
            'clue_arda_otopark',
            'clue_yonetim_park',
            'ded_otopark',
            'Tabelalı köşe',
            'Arda’nın parayı uzattığı araba, otoparkın kameranın görmediği tek yerinde duruyordu: “YÖNETİM — 1”.',
          ),
          fresh(
            'CB_NECDET',
            'ev_imei_rapor',
            'clue_kartvizit',
            'ded_necdet',
            'Altı dakika',
            'Raporun üçüncü satırı: 0533 287 19 90, 2 Kasım 23.48, altı dakika. Kartvizit: Necdet Sarı, 0533 287 19 90. Kaan’ın telefonuna bir gece, kendi hattını takmış.',
          ),
          fresh(
            'CB_ARDA',
            'clue_vekil_arda',
            'ev_sozlesme',
            'ded_arda_kimlik',
            'Bir kimlik, iki kâğıt',
            'Arda Kılıç hem sanal ofis sözleşmesinde kiracı hem vekâletnamede vekil. On dokuz yaşında bir kurye, iki sahte belgenin yüzü.',
          ),
          ...INV1_RECIPES.map(again),
        ],
        miss: fallback('FB_ARA_CIKARIM', 'COMBINE', {
          repeat: 'ONCE_PER_PARAMS',
          score: { DELIL_ANALIZI: -50 },
          feedback: {
            title: 'Bu ikisi birbirini açıklamıyor',
            text: 'İp gerildi ama bir şey bağlanmadı.',
            label: `BAĞLANTI YOK · ${minus(50)} SKOR`,
            tone: 'error',
          },
        }),
        finish: { id: 'ARA_CIKARIM_BITIR' },
      }),
    ),
    decisionNode('ARA_SON_1', [{ to: 'ARA_SON_2' }], {
      ...ARA,
      lines: [
        W(
          has('ded_necdet'),
          S`
            = 24 KASIM 2026 · 23.30 — ARSLAN HUKUK @buro_gece
            - Duruşmadan önceki gece. Panonun ortasında bir kartvizit ve bir rapor, aynı numarayla. Altı dakika. Bir yılın bütün yalanı, altı dakikalık bir şarj meselesine sığıyordu.
          `,
        ),
        W(
          has('ev_imei_rapor'),
          S`
            = 24 KASIM 2026 · 23.30 — ARSLAN HUKUK @buro_gece
            - Duruşmadan önceki gece. İMEİ raporu masamda. Üç hat. Üçüncüsü kurumsal bir hat, abonesi yazmıyor. On haneli bir numara; sanki bir yerde görmüşüm. Nerede?
          `,
        ),
        O(S`
          = 24 KASIM 2026 · 23.30 — ARSLAN HUKUK @buro_gece
          - Duruşmadan önceki gece. Panoda bir boşluk hâlâ duruyor: Kaan. Bir ses, bir yüzük, bir asansör. Bir isim değil.
        `),
      ],
    }),
    decisionNode('ARA_SON_2', [{ to: 'ARA_SON_3' }], {
      ...ARA,
      lines: [
        W(
          any(has('ded_kopya'), has('ev_noter_yok')),
          S`- Bayinin dosyası artık bir sahtekârlığın dosyası: hiç düzenlenmemiş bir vekâletname, Ece'nin masasından çalınmış bir fotoğraf.`,
        ),
        O(
          S`- Bayideki genç yarın kürsüde ne söyleyecek? "Yüz yüze kontrol ettim" diyecek. Elimde onu durduracak bir kâğıt var mı?`,
        ),
      ],
    }),
    decisionNode('ARA_SON_3', [{ to: 'ARA_SON' }], {
      ...ARA,
      lines: [
        W(
          all(flag('fact_imei_yol'), not(has('ev_imei_rapor'))),
          S`- Gökhan bir cihazın içinde hangi hatların yaşadığını öğrenmenin yolunu anlatmıştı. O yola girmedim. Yarın, girmediğim yolun ucunda kim durduğunu bilmeden kürsüye çıkacağım.`,
        ),
        W(
          flag('fact_zincir'),
          S`- Mehmet Demir, Manisa'da yetmiş bir yaşında. Eskişehir'de bir ev hanımı. Arda. Ece. Nurettin. Bir zincirin halkaları; hepsi kurban. Ortadaki el hâlâ eldivenli.`,
        ),
      ],
    }),
    story('ARA_SON', {
      ...ARA,
      title: 'Son gece',
      background: 'buro_gece',
      lines: B(S`
        - Leyla kapıda durdu, ceketi kolunda. Yağmur dinmişti; ilk kez üç haftadır.
        - Ece akşam bir mesaj atmıştı: "Yarın kendim gibi geleceğim. Bu sefer kim olduğumu biliyorum." Bir gülen yüz yoktu bu sefer. Gerek de yoktu.
        leyla: Yarın herkes sana bir hikâye anlatacak. Hikâyeyi dinle. Sonra kâğıda bak; kâğıt hikâye anlatmaz.
        - Kapıyı kapatmadan durdu, bir şey unutmuş gibi. Geri dönüp masamdaki kalemi aldı, kapağını taktı, bıraktı.
        leyla: Yarın kalemin ucunu açık bırakma. Kurur. Ben otuz yıldır her duruşmada bir kalem kaybederim; ucu açık olanları.
        - Gitti. Merdivenlerde ayak sesleri, sonra sokak kapısı, sonra yalnızca yağmurun dinmiş olmasının sesi: bir oluktan son damlalar.
        - Panoya son bir kez baktım. Kırmızı ipler, iğneler, kartlar. Ortada bir boşluk ya da bir isim; hangisi olduğuna yarın salon karar verecek.
      `),
      choices: [cont('ARASON_DEVAM', 'Sabah', 'T_KORIDOR', { role: 'PRIMARY' })],
    }),
  ],
  triggers: [dayEnd.trigger],
  discoveryPaths: [...giris.discoveryPaths, ...imeiDayEnd.discoveryPaths],
};
