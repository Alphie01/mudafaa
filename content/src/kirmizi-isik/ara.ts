import {
  L,
  N,
  P,
  all,
  any,
  cmp,
  cont,
  conversation,
  dec,
  decisionNode,
  deductionBoard,
  deliver,
  discover,
  documentExam,
  examine,
  fallback,
  flag,
  has,
  ifThen,
  inc,
  met,
  nav,
  not,
  option,
  raise,
  recipe,
  ref,
  row,
  says,
  set,
  story,
  tool,
  v,
  visited,
  when,
  otherwise,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef, NodeDef } from '../../../tools/content/src/kit/index.js';
import { baseRecipes, boardMiss, invPool } from './inv-work.js';
import { ARA, T, araAct, card, fx, p2 } from './shared.js';

// 65-ara: 2. ile 3. celse arası (2 gün × 3 EP). Yığınsız hub: her etkinlik doğrudan ARA_HUB'a döner.

const HUB = 'ARA_HUB';

/** Kitin `$return` dönüşlerini doğrudan hub'a çevirir (yığınsız evre). */
function toHub<T extends NodeDef>(node: T): T {
  return {
    ...node,
    choices: node.choices.map((ch: ChoiceDef) => (ch.next === '$return' ? { ...ch, next: HUB } : ch)),
  };
}

const entry = deliver('ARA_GIRIS_1', [
  {
    evidence: 'ev_edr',
    requires: any(flag('dil_edr'), flag('h1_itiraz')),
    hint: 'EDR’nin okunmasını dilekçeyle ya da rapora itirazla iste.',
  },
  { evidence: 'ev_atk', requires: any(flag('dil_atk'), flag('h1_itiraz')), hint: 'ATK Trafik İhtisas raporunu iste.' },
  {
    evidence: 'ev_boya',
    requires: any(flag('dil_boya'), flag('h1_boya')),
    hint: 'Montta bulunan boya parçasının incelenmesini iste.',
  },
]);
const dayEnd = deliver('ARA_DAY_END', [
  {
    evidence: 'ev_heyet',
    requires: flag('h1_itiraz'),
    hint: 'Bilirkişi raporuna CMK 67/5 ile itiraz edip yeni heyet iste.',
  },
]);

const missExam = (id: string) =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle bu satırda yeni bir şey çıkmadı.',
      label: '−20 SKOR · −1 deneme',
      tone: 'error',
    },
  });

export const ara: CasePart = {
  nodes: [
    decisionNode('ARA_GIRIS_1', [{ to: 'ARA_GIRIS_2' }], {
      ...ARA,
      onEnter: [...entry.effects, ...p2.start()],
      lines: [
        when(
          all(has('ev_edr'), has('ev_atk')),
          card('ERTESİ HAFTA — ARSLAN HUKUK', 'buro'),
          N(
            'Ara karardan dokuz gün sonra iki zarf aynı gün geldi. Biri Adli Tıp Kurumunun mühürlü zarfı, öteki bilirkişinin EDR dökümü. İkisini de ayakta açtım.',
          ),
          T(
            'Mühürlü zarflar ağırdır. İçlerinde ya bir adamın özgürlüğü ya da bir avukatın yanılgısı vardır. Bazen ikisi birden.',
          ),
        ),
        when(
          has('ev_edr'),
          card('ERTESİ HAFTA — ARSLAN HUKUK', 'buro'),
          N('Ara karardan dokuz gün sonra bilirkişinin EDR dökümü geldi. Bir aracın son beş saniyesi, sayılarla.'),
          T('Beş saniye. Bir şarkının nakaratı kadar. Bir insanın hayatı kadar.'),
        ),
        otherwise(
          card('ERTESİ HAFTA — ARSLAN HUKUK', 'buro'),
          N(
            'Ara karardan dokuz gün sonra. Postacı geldi, gitti. Bekleyen zarf yoktu. Bazen beklemek de bir cevaptır; kötü bir cevap.',
          ),
          T(
            'Dilekçede istemediğimi, duruşmada da istemediysem, kimse benim yerime istemez. Kurumlar kendiliğinden cevap vermez; soru bekler.',
          ),
        ),
      ],
    }),
    decisionNode('ARA_GIRIS_2', [{ to: 'ARA_GIRIS' }], {
      ...ARA,
      lines: [
        when(
          has('ev_boya'),
          N(
            'Jandarma Kriminal’den de bir yazı: montta bulunan boya parçası. İki satırlık bir sonuç. Okudum, bir daha okudum.',
          ),
        ),
        when(
          flag('ehliyet_izin'),
          N('Volkan sabah işe kendi arabasıyla gitmiş. Gül yazdı: “Direksiyonu tutarken elleri titredi. Ama tuttu.”'),
        ),
        otherwise(N('Volkan hâlâ servisle işe gidiyor. Gül her sabah onu kapıdan uğurluyor, sekizinci ayın sonunda.')),
      ],
    }),
    story('ARA_GIRIS', {
      ...ARA,
      title: 'Üç hafta',
      background: 'buro',
      lines: says(
        N(
          'Leyla kapıdan başını uzattı. Elinde bir fincan kahve; içmeyecekti, biliyordum. Fincanı tutmak için tutuyordu.',
        ),
        L(
          'leyla',
          'Üç hafta, iki gün senin. Gerisi kurumların. Ne geldiyse oku; gelmeyeni de aklında tut, mahkemede “gelmedi” demek de bir şeydir.',
        ),
        L(
          'leyla',
          'Bir de şunu bil: şüphe ile ispat arasında bir çizgi var. Şüpheyi bir hâkim kurar; ispatı bir savcı. Sen birini seçmek zorunda değilsin ama hangisini yaptığını bilmek zorundasın.',
        ),
        L(
          'leyla',
          'Ve kimseyi kovalamayacaksın. Bir şey bulursan savcıya söylersin. Kahraman avukatlar dizilerde olur; gerçekte dosyaları kaybettirirler.',
        ),
        N(
          'Pencerenin dışında Bursa’nın çatıları, kiremit, çanak anten, bir minare. Yağmur durmuş, bulutlar Uludağ’ın üstünde bekliyordu.',
        ),
        L(
          'leyla',
          'Bir şey daha. Müvekkilin bir bebeği olacak bu hafta. Bunu dosyaya katma ama aklından da çıkarma. İnsanlar bebekleri olunca ya çok cesur ya çok korkak olur.',
        ),
        T('İki gün. Dörder işlik iki gün. Bir yenidoğanın uyku düzeni kadar kısa.'),
        N(
          'Masamda üç rapor için üç boş dosya açtım: EDR, heyet, Adli Tıp. Sırtlarına el yazısıyla etiket yazdım; Gül’den öğrendiğim bir alışkanlık.',
        ),
      ),
      choices: [cont('ARAG_DEVAM', 'Başla', HUB, { role: 'PRIMARY' })],
    }),
    p2.hub({
      ...ARA,
      title: 'Ara',
      background: 'buro',
      lines: [
        when(
          cmp(v('ara_day'), '==', 1),
          card('ARA · GÜN 1/2 — ÜÇÜNCÜ CELSEYE 6 GÜN'),
          N(
            'Hedef: gelen raporları oku. Kimin neyi bildiğini, neyi saklayıp neyi söyleyeceğini tart. Bir şey bulursan doğru kapıya götür.',
          ),
          N(
            'Büronun kapısında bir zarf, bir çiçek: Gül’ün öğrencileri “öğretmenimizin avukatına” diye bir resim göndermiş. Bir kavşak, yeşil bir ışık, bir güneş.',
          ),
          T('Çocuklar ışığı yeşil çizmiş. Kimse onlara bir şey söylememiş. Ya da söylemiş.'),
        ),
        otherwise(
          card('ARA · GÜN 2/2 — ÜÇÜNCÜ CELSEYE 3 GÜN'),
          N(
            'Hedef: üçüncü celseye kimi, neyle götüreceğine karar ver. Tahtayı topla; esas savunmanın dayanakları burada doğar.',
          ),
          N(
            'Yağmur yine başladı. Leyla’nın odasından eski bir plak sesi geliyordu; bir tango, cızırtılı. Leyla müzik dinlemezdi. Bugün dinliyordu.',
          ),
        ),
      ],
      tabs: [
        {
          id: 'ta_belge',
          label: 'RAPORLAR',
          kind: 'ARCHIVE',
          choices: [
            araAct('A_EDR', 'EDR dökümünü incele', 'ARA_EDR', {
              description: 'Son beş saniye',
              visibleWhen: has('ev_edr'),
            }),
            araAct('A_HEYET', 'Heyet raporunu incele', 'ARA_HEYET', {
              description: 'Doç. Dr. N. Güneş',
              visibleWhen: has('ev_heyet'),
            }),
            araAct('A_SUC', 'Savcılığa suç duyurusu', 'ARA_SUC', { description: 'Kimin hakkında, neye dayanarak?' }),
            {
              id: 'A_CIKARIM',
              kind: 'NAVIGATE',
              label: 'Çıkarım tahtası',
              description: '0 EP · yeni raporlarla',
              enabledWhen: ref('kart2'),
              lockedReason: 'En az 2 ipucu gerekli.',
              next: 'ARA_CIKARIM',
            },
            {
              id: 'A_LEYLA',
              kind: 'NAVIGATE',
              label: 'Leyla’ya danış',
              description: '0 EP · günde bir kez',
              visibleWhen: cmp(v('leyla_ara'), '<', v('ara_day')),
              effects: [set('leyla_ara', v('ara_day'))],
              next: 'ARA_LEYLA',
            },
          ],
        },
        {
          id: 'ta_kisi',
          label: 'KİŞİLER',
          kind: 'PEOPLE',
          choices: [
            araAct('A_VOLKAN', 'Volkan ve Gül', 'ARA_VOLKAN', { description: 'Hastane · doğumhane katı' }),
            araAct('A_AYTEN', 'Ayten Yurt aradı', 'ARA_AYTEN', {
              description: '“Bir şey konuşmamız lazım.”',
              visibleWhen: any(met('ayten'), has('clue_cam'), flag('ayten_bilgi')),
            }),
            araAct('A_SERKAN', 'Serkan Durmaz aradı', 'ARA_SERKAN', {
              description: '“Dinledim.”',
              visibleWhen: all(flag('serkan_saygi'), flag('fact_mesaj'), not(flag('serkan_hakaret'))),
            }),
            araAct('A_HAMDI', 'Hamdi Kocabaş', 'ARA_HAMDI', { description: 'Tanık olarak çağrıldı' }),
            araAct('A_NECATI', 'Necati Bulut büroya geldi', 'ARA_NECATI', {
              description: 'Termosuyla, kapıda',
              visibleWhen: any(flag('contra_n2'), flag('contra_n3'), flag('contra_n4')),
            }),
            araAct('A_NALAN', 'Heyetten bir telefon', 'ARA_NALAN', {
              description: '“Doç. Dr. Güneş sizinle görüşmek istiyor.”',
              visibleWhen: all(flag('h1_itiraz'), cmp(v('ara_day'), '==', 2)),
            }),
            araAct('A_SANAYI', 'Kestel sanayi sitesi', 'ARA_SANAYI', {
              description: 'Koyu yeşil bir hafif ticari, sağ ön köşe',
              visibleWhen: has('ded_arac'),
            }),
          ],
        },
      ],
      choices: [
        nav('A_DURUSMA', 'DURUŞMAYA GİT · 3. CELSE', 'ARA_SON_1', {
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen ara biter. Emin misin?',
        }),
      ],
    }),
    decisionNode('ARA_DAY_END', [{ to: 'ARA_AKSAM' }], {
      ...ARA,
      onEnter: [...dayEnd.effects, inc('ara_day', 1), set('ara_ap', 4)],
    }),
    story('ARA_AKSAM', {
      ...ARA,
      title: 'Ara · akşam',
      background: 'buro_gece',
      lines: [
        when(
          has('ev_heyet'),
          card('PERŞEMBE 20.30 — ARSLAN HUKUK', 'buro_gece'),
          N(
            'Akşam UYAP’a heyet raporu düştü. Otuz bir sayfa, üç imza, bir sonuç paragrafı. İlk sayfayı okudum ve oturdum.',
          ),
          N(
            'Raporun ekinde kavşağın bir planı: yaya geçidi, iki sinyal başlığı, okla gösterilmiş bir “çatışma bölgesi.” Kırmızı kalemle taranmış bir dikdörtgen; Hatice Hanım’ın son adımları o dikdörtgenin içinde.',
          ),
          T(
            '“Sanığa kırmızı ışık ihlali atfedilemez.” Bir cümle. Üç aydır bir adamın üstünde duran bir kaya, bir cümleyle kalktı. Ama otuz bir sayfa var.',
          ),
          N('Telefon çaldı. Gül. Sesi başka.'),
          L('gul', 'Avukat hanım… Doğdu. Bu sabah. Üç kilo iki yüz. Volkan ağlıyor, ben gülüyorum. Ya da tersi.'),
        ),
        otherwise(
          card('PERŞEMBE 20.30 — ARSLAN HUKUK', 'buro_gece'),

          N('UYAP sessizdi. Bilirkişi heyeti kurulmamış, yeni bir rapor gelmeyecekti. Elimde olanla gidecektim.'),
          N('Telefon çaldı. Gül. Sesi başka.'),
          L('gul', 'Avukat hanım… Doğdu. Bu sabah. Üç kilo iki yüz. Volkan ağlıyor, ben gülüyorum. Ya da tersi.'),
        ),
      ],
      choices: [
        cont('ARAK_DEVAM', '“Hoş geldi. Yarın uğrarım.”', HUB, {
          role: 'PRIMARY',
          effects: [ifThen(cmp(v('aksam1'), '==', 'ELA'), [raise('bebek_ela')])],
          responses: [
            when(
              cmp(v('aksam1'), '==', 'ELA'),
              L('gul', 'Adını Ela koyduk. Sizin dediğiniz. Volkan “aydınlık olsun” dedi. Siz de öyle demiştiniz.'),
              T('Bir dosyanın içinden aydınlık bir şey. Şimdilik sadece bir isim. Yeter.'),
            ),
            otherwise(
              L('gul', 'Adını henüz koymadık. Yüzüne bakıp karar vereceğiz demiştiniz. Bakıyoruz.'),
              T('Bir dosyanın içinden bir yüz. Şimdilik bu kadar. Yeter.'),
            ),
          ],
        }),
      ],
    }),

    // --- Belgeler ---
    toHub(
      documentExam('ARA_EDR', {
        ...ARA,
        title: 'EDR veri dökümü',
        background: 'buro',
        hud: ['edr_left'],
        lines: says(
          N(
            'Bir tablo, beş satır, saniyenin onda biri hassasiyetinde. Bir aracın hatırladıkları; sürücüsünden daha soğukkanlı.',
          ),
          T(
            'Volkan “kırk kadar” demişti. Rapor “altmış sekiz” diyor. Arada yirmi sekiz kilometre ve bir adamın üç yılı var.',
          ),
        ),
        header: { left: 'OLAY VERİ KAYDEDİCİSİ · 16 AVE 712', right: 'BİLİRKİŞİ DÖKÜMÜ' },
        columns: [
          { label: 'ZAMAN', flex: 1 },
          { label: 'VERİ', flex: 2.6 },
        ],
        rows: [
          row('e_hiz', ['−5,0 → −1,2 sn', 'Hız 39 → 38 km/s']),
          row('e_gaz', ['−3,0 sn', 'Gaz pedalı %8']),
          row('e_fren', ['−1,2 sn', 'Fren: AÇIK · ABS: AKTİF']),
          row('e_dv', ['0,0 sn', 'Delta-V: 4 km/s']),
          row('e_kemer', ['—', 'Emniyet kemeri: takılı']),
        ],
        tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
        costVar: 'edr_left',
        rules: [
          examine('EX_E_HIZ', 'mag', 'e_hiz', {
            score: { DELIL_ANALIZI: 100 },
            effects: [raise('edr_hiz')],
            feedback: {
              title: '38, 68 DEĞİL',
              text: 'Beş saniye boyunca 38–39 km/s. Şehir içi sınır 50. Raporun 68’i bu araçtan gelmiyor.',
              label: '+100 SKOR · Bulgu',
              tone: 'special',
            },
          }),
          examine('EX_E_FREN', 'mag', 'e_fren', {
            score: { DELIL_ANALIZI: 100 },
            effects: [raise('edr_fren')],
            feedback: {
              title: 'TEPKİ SÜRESİ',
              text: 'Fren temastan 1,2 saniye önce. Islak zeminde, gece, ani bir engele normal bir algılama-tepki süresi. ABS aktif: kilit izi yok.',
              label: '+100 SKOR · Bulgu',
              tone: 'special',
            },
          }),
          examine('EX_E_DV', 'cmp', 'e_dv', {
            score: { DELIL_ANALIZI: 150 },
            effects: [raise('edr_dv')],
            feedback: {
              title: 'DÜŞÜK ENERJİ',
              text: 'Delta-V 4 km/s. Ayaktaki bir yetişkine 38’le çarpan bir araçta bu değer ve ön camda hasar beklenirdi. Bu, alçakta bir şeye sürtünmenin izi.',
              label: '+150 SKOR · Bulgu',
              tone: 'special',
            },
          }),
        ],
        miss: missExam('FB_EDR'),
        finish: { id: 'EDR_BITIR' },
      }),
    ),
    toHub(
      documentExam('ARA_HEYET', {
        ...ARA,
        title: 'Bilirkişi heyeti raporu',
        background: 'buro',
        hud: ['heyet_left'],
        lines: says(
          N(
            'Otuz bir sayfa. Doç. Dr. Nalan Güneş’in imzası küçük, düz, kararlı. Raporun dili de öyle: “veri bunu gösteriyor, fazlasını değil.”',
          ),
          T(
            'İyi bir rapor bir avukatın işini kolaylaştırır. Neredeyse iyi bir rapor ise zorlaştırır; çünkü herkes onun tamamen iyi olduğunu sanır.',
          ),
          N(
            'Dördüncü sayfanın kenarına biri kurşun kalemle küçük bir işaret koymuş. Kim koyduysa, benim de bakmamı istemiş gibi.',
          ),
        ),
        header: { left: 'BİLİRKİŞİ HEYETİ RAPORU', right: 'DOÇ. DR. N. GÜNEŞ VE İKİ ÜYE' },
        columns: [
          { label: 'BAŞLIK', flex: 1 },
          { label: 'HEYETİN GÖRÜŞÜ', flex: 2.8 },
        ],
        rows: [
          row('h_isik', ['Işık', 'Denetleyici kaydı ve ihbar karşısında sanığa kırmızı ışık ihlali atfedilemez']),
          row('h_iz', ['Fren izi', '18 m kesintisiz kilit izi, ABS’li sanık aracına ait olamaz']),
          row('h_kusur', [
            'Kusur',
            'Sürücü yağışlı havada kavşağa yaklaşırken hızını yeterince azaltmamıştır: tali kusur',
          ]),
          row('h_ilk', ['İlk temas', 'Yaralanma mekanizması Adli Tıp Kurumunun değerlendirmesine bırakılmıştır']),
          row('h_ek', ['Ekler', 'Kavşak planı, fotoğraflar, hesap tabloları']),
        ],
        tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
        costVar: 'heyet_left',
        rules: [
          examine('EX_H_ISIK', 'mag', 'h_isik', {
            score: { DELIL_ANALIZI: 50 },
            effects: [raise('heyet_isik')],
            feedback: {
              title: 'IŞIK',
              text: 'Heyet kayıtları okumuş. Kırmızı ışık iddiası teknik olarak çöktü.',
              label: '+50 SKOR · Bulgu',
              tone: 'special',
            },
          }),
          examine('EX_H_IZ', 'mag', 'h_iz', {
            score: { DELIL_ANALIZI: 50 },
            effects: [raise('heyet_iz')],
            feedback: {
              title: 'İZ',
              text: 'Heyet de aynı sonuca varmış: iz başka bir aracın.',
              label: '+50 SKOR · Bulgu',
              tone: 'special',
            },
          }),
          examine('EX_H_KUSUR', 'cmp', 'h_kusur', {
            enabledWhen: has('ev_edr'),
            score: { DELIL_ANALIZI: 200 },
            effects: [raise('contra_heyet')],
            feedback: {
              title: 'VERİYE DAYANMAYAN PARAGRAF',
              text: 'EDR: 38 km/s, sınırın çok altında; fren temastan 1,2 sn önce. “Hızını yeterince azaltmamıştır” cümlesi hangi veriye dayanıyor? Raporda hiçbirine.',
              label: '+200 SKOR · Çelişki',
              tone: 'special',
            },
          }),
        ],
        miss: missExam('FB_HEYET'),
        finish: { id: 'HEYET_BITIR' },
      }),
    ),

    // --- Kişiler ---
    conversation('ARA_AYTEN', {
      ...ARA,
      title: 'Ayten Yurt',
      background: 'kafe',
      room: { label: 'ADLİYE KANTİNİ · AKŞAM', character: 'ayten' },
      onFirstEnter: [{ type: 'MEET', character: 'ayten' }],
      lines: says(
        card('ADLİYE KANTİNİ — 18.50', 'kafe'),
        N(
          'Kantin kapanmak üzereydi. Ayten sivil giyinmişti; üniforması olmadan daha genç, daha yorgun görünüyordu. Önünde soğumuş bir çay.',
        ),
        L('ayten', 'Sizi aramamam gerekirdi. Tanık olarak çağrıldım. Biliyorum.'),
        L(
          'ayten',
          'O gece far camlarının fotoğrafını çektim. Amirim “eski kaza” dedi. Ben… bir parçayı aldım. Bir mendile sardım. Dolabımda duruyor. Üç aydır.',
        ),
        L('ayten', 'Neden aldığımı bilmiyorum. Belki bir gün biri sorar diye. Kimse sormadı. Siz sordunuz.'),
        T('Bir delil, yanlış dolapta üç ay. Şimdi doğru yere gitmesi gerek. Ve o doğru yer ben değilim.'),
      ),
      choices: [
        option(
          'AY_SAVCI',
          '“O parçayı bana değil, tutanakla savcılığa teslim edin. Nerede, nasıl bulduğunuzu da yazın.”',
          {
            score: { USUL_BILGISI: 60 },
            effects: [raise('ayten_teslim')],
            good: 'Delilin zinciri korunur: kolluk görevlisi, elindeki eşyayı tutanakla adli makama teslim eder; avukat delili kendi eline almaz.',
            category: 'USUL_BILGISI',
            responses: says(
              L('ayten', 'Amirim kızacak.'),
              P(
                'Amiriniz kızar. Ama yarın birisi o parçanın nereden geldiğini sorarsa cevabı sizin imzanız olur. Benim değil.',
              ),
              L('ayten', 'Tamam. Yarın sabah savcılığa. Tutanakla.'),
              N('Çayını bitirmeden kalktı. Kapıda döndü.'),
              L('ayten', 'Teşekkür ederim. Bana “ver bana” demediğiniz için.'),
            ),
            next: HUB,
          },
        ),
        option('AY_BANA', '“Bana verin, ben mahkemeye sunarım. Daha hızlı olur.”', {
          score: { USUL_BILGISI: -40 },
          effects: [raise('ayten_kayip')],
          bad: 'Avukatın, kolluktaki bir delili kendi eline alması zinciri koparır; delilin kaynağı ve bütünlüğü tartışmalı hâle gelir.',
          category: 'USUL_BILGISI',
          responses: says(
            N('Ayten bir an elini çantasına götürdü. Sonra durdu.'),
            L('ayten', 'Hayır. Böyle olmaz. Bunu… bilmiyorum. Düşüneyim.', 'saskin'),
            T('Düşünecek. Ve düşünürken o parça bir dolabın dibinde kalacak. Benim yüzümden.'),
          ),
          next: HUB,
        }),
        option('AY_SAKLA', '“Şimdilik kimseye söylemeyin. Kürsüde sürpriz olsun.”', {
          score: { USUL_BILGISI: -30 },
          effects: [raise('ayten_kayip')],
          bad: 'Delili saklamak sürpriz değil, kayıptır; kürsüde “dolabımda bir parça vardı” demek, delili değil tanığı tartışmalı kılar.',
          category: 'USUL_BILGISI',
          responses: says(
            L('ayten', 'Sürpriz mi? Ben bir polisim avukat hanım. Sürpriz yapmam.', 'kizgin'),
            N('Kalktı, gitti.'),
          ),
          next: HUB,
        }),
      ],
    }),
    conversation('ARA_SERKAN', {
      ...ARA,
      title: 'Serkan Durmaz',
      background: 'sokak_gece',
      room: { label: 'MEZARLIK ÇIKIŞI', character: 'serkan' },
      lines: says(
        card('EMİRSULTAN MEZARLIĞI — AKŞAMÜSTÜ', 'sokak_gece'),
        N(
          'Serkan mezarlığın kapısında, bir selvinin dibinde bekliyordu. Elinde telefonu. Yüzü ıslaktı; yağmur yağmıyordu.',
        ),
        L('serkan', 'Dinledim. Bu sabah. Mezarının başında. Orada dinleyebildim ancak.'),
        L('serkan', 'Dinlemek ister misiniz? Dinleyin. Sizin için değil. O için.'),
        N('Telefonu uzattı. Hoparlör. Rüzgâr. Uzaktan bir otobüs.'),
        {
          speaker: 'narrator',
          name: 'HATİCE DURMAZ',
          text: 'Serkan, oğlum… Işıklar yine bozuk. Yeşil yanıyor ama arabalar da geçiyor. Ben bekliyorum, sen merak etme.',
          style: 'phone',
        },
        {
          speaker: 'narrator',
          name: 'HATİCE DURMAZ',
          text: 'Az kaldı, geliyorum. Simit aldım. Sen yemezsin biliyorum ama aldım. Hadi.',
          style: 'phone',
        },
        N('Mesaj bitti. Saat damgası: 01.05. Altı dakika sonra.'),
        L('serkan', '“Ben bekliyorum” diyor. Beklemiş. Yeşili beklemiş. Yeşil yanınca geçmiş.', 'uzgun'),
        L(
          'serkan',
          'Bu adamın da yeşili varmış. İkisinin de. Biri yalan söylemiyor demek. İkisi de söylemiyor.',
          'uzgun',
        ),
        T('Serkan bunu benden önce anladı. Bir mesajla. Ben üç haftada, kırk belgeyle.'),
      ),
      choices: [
        option('SE_SAVCI', '“Bu mesajı savcılığa siz teslim edin. Dosyaya girmesini isterim ama kararı sizin.”', {
          score: { USUL_BILGISI: 60 },
          effects: [raise('serkan_teslim'), discover('ev_sesli')],
          good: 'Katılan kendi delilini kendi iradesiyle adli makama sunar; avukat ne telefonu alır ne beyanı yönlendirir.',
          category: 'USUL_BILGISI',
          responses: says(
            L('serkan', 'Annemin sesi bir dosyada. Hm.'),
            L('serkan', 'Götürürüm. Yarın. Ama bilin: ben yine ceza istiyorum. Kime verilecekse ona.'),
            T('“Kime verilecekse.” Üç hafta önce bu cümlede bir isim vardı.'),
            N(
              'Serkan telefonu cebine koydu, selvinin dibinde bir süre durdu. Sonra, bana bakmadan: “Annem sizi severdi. Kimseyi suçlamadan konuşan insanları severdi.”',
            ),
          ),
          next: HUB,
        }),
        option('SE_KOPYA', '“Telefonu bana verin, bir kopyasını alıp mahkemeye ben sunayım.”', {
          score: { USUL_BILGISI: -40 },
          bad: 'Katılanın telefonunu almak, onun yasını savunmanın aracı yapmaktır; delili kendisi sunmalı.',
          category: 'USUL_BILGISI',
          responses: says(
            N('Serkan telefonu geri çekti, cebine koydu.'),
            L('serkan', 'Annemin sesi sizin dosyanız için değil.', 'kizgin'),
            N('Mezarlığın içine yürüdü. Arkasından gidemezdim.'),
          ),
          next: HUB,
        }),
      ],
    }),
    conversation('ARA_HAMDI', {
      ...ARA,
      title: 'Hamdi Kocabaş',
      background: 'depo',
      room: { label: 'SİNYAL DEPOSU · KAPI', character: 'hamdi' },
      lines: says(
        card('SİNYALİZASYON DEPOSU — ÖĞLE ARASI', 'depo'),
        N('Hamdi kapının önünde sigara içiyordu. Beni görünce sigarayı yere attı, ezdi, bir daha ezdi.'),
        L(
          'hamdi',
          'Çağrı kâğıdı geldi abla. Mahkeme. Müdür bey odaya çağırdı. “Hatırlamıyorum de” dedi. “Kayıt makinenin, sen makine değilsin.”',
        ),
        L('hamdi', 'Ben makine değilim, doğru. Ama makineden çok şey hatırlarım.'),
        N(
          'Deponun kapısının yanında sökülmüş eski bir trafik lambası duruyordu. Kırmızı camı çatlak, yeşili sağlam. Hamdi lambaya baktı, sonra bana.',
        ),
        L(
          'hamdi',
          'Bunu o kavşaktan söktük. Eski kafa. Yenisini taktık. Bunu atacaklardı, ben sakladım. Neden sakladığımı bilmiyorum.',
        ),
      ),
      choices: [
        option(
          'HA_BILGI',
          '“Mahkeme sizi çağırdı. Ne gördüyseniz onu anlatın. Ne söyleyeceğinizi ne ben söylerim ne müdürünüz.”',
          {
            score: { USUL_BILGISI: 40 },
            effects: [raise('hamdi_cagrildi')],
            good: 'Tanığa doğruyu söyleme yükümlülüğünü hatırlatmak (CMK 58) ve içeriğe karışmamak: meslek kuralının ta kendisi.',
            category: 'USUL_BILGISI',
            responses: says(
              L('hamdi', 'Ne gördüysem. Hm. Yemin edeceğim değil mi? Yemin ederim. Babam yemin etmeyi bilen adamdı.'),
              L('hamdi', 'Müdür bey kızar. Emekliliğe iki yıl. … Kızsın.'),
              N(
                'Hamdi sökülmüş eski lambanın camını tırnağıyla tıklattı. Kırmızı, sarı, yeşil. Sonra kapıyı açtı, içeri girdi, döndü.',
              ),
              L(
                'hamdi',
                'Bir şey daha: o gece kayıt cihazının dökümünü ben almadım, merkez aldı. Döküm sizin elinizdeyse, benim söyleyeceğimi zaten biliyorsunuz.',
              ),
            ),
            next: HUB,
          },
        ),
        option('HA_PROVA', '“Kürsüde size şunları soracağım; cevaplarınızı birlikte hazırlayalım.”', {
          score: { USUL_BILGISI: -60 },
          effects: [inc('ethics', 1)],
          bad: 'Tanığın cevaplarını birlikte “hazırlamak” beyanı etkilemektir (TCK 277; Av.K. md. 34). Tanık kendi bildiğini anlatmalı.',
          category: 'USUL_BILGISI',
          responses: says(
            L('hamdi', 'Hazırlamak mı? Siz de mi müdür gibisiniz abla?', 'kizgin'),
            T('Aynı cümleyi başka bir ağızdan duymak. En kötüsü bu.'),
          ),
          next: HUB,
        }),
      ],
    }),
    conversation('ARA_VOLKAN', {
      ...ARA,
      title: 'Volkan ve Gül',
      background: 'hastane',
      room: { label: 'DOĞUMHANE · 4. KAT', character: 'volkan' },
      lines: says(
        card('ÇEKİRGE DEVLET HASTANESİ — 4. KAT', 'hastane'),
        N(
          'Koridorda çamaşır suyu ve süt kokusu. Camın arkasında sıra sıra küçük yataklar. Volkan camın önündeydi, alnını cama dayamış.',
        ),
        N(
          'Camın öbür yanında bir hemşire, bir bebeği tartıya koyuyordu. Her bebeğin ayağında bir bilezik, bileziklerde soyadları. “EREN” yazanı uzaktan okudum.',
        ),
        L('volkan', 'Avukat hanım. Bakın. Soldan üçüncü. Pembe battaniye. Yumruklarını sıkıyor; benim gibi.'),
        N('Bir süre sustuk. Bebek esnedi. Volkan güldü; sesi çatladı.'),
        L(
          'volkan',
          'Bir hafta önce “kabul edeceğim” diyordum. Şimdi bakıyorum ona ve… ona bir yalanla bakamam. “Babam bir kadını öldürdü” diyorsa doğru olsun. “Öldürmedi” diyorsa o da doğru olsun.',
        ),
        L('volkan', 'Mahkemede ne diyeyim? Son sözde ne diyeyim?'),
        T(
          'Burası, bir müvekkile ne söyleyeceğini söylemek ile ona doğruyu söylemesini söylemek arasındaki çizgi. İnce bir çizgi. Ama çizgi.',
        ),
      ),
      choices: [
        option(
          'VO_DOGRU',
          '“Bildiğinizi söyleyin, bilmediğinize bilmiyorum deyin. Hatice Hanım’ın oğluna söyleyecekseniz, ona gerçekten söyleyin.”',
          {
            score: { SAVUNMA_STRATEJISI: 40 },
            effects: [raise('volkan_dogru'), inc('trust', 6), ifThen(flag('fact_gul'), [inc('trust', 2)])],
            good: 'Müvekkili kendi anlatımına güvendirmek; metin ezberletmeden, doğruyu söylemeye teşvik etmek.',
            responses: says(
              L('volkan', 'Bilmediğime bilmiyorum. Bildiğime… biliyorum. Tamam.'),
              L('gul', 'Bunu her sabah tekrar ettireceğim ona. Bebek bezi değiştirirken.'),
              N(
                'Volkan camın öbür yanındaki bebeğe döndü. Elini cama koydu; bebek uyuyordu. Bir hemşire gülümsedi, perdeyi biraz araladı.',
              ),
              L(
                'volkan',
                'Avukat hanım. Ne olursa olsun, ona bu gecenin doğrusunu anlatacağım. Siz de bana doğrusunu söylediniz. Bunu unutmayacağım.',
              ),
              N('Gül tekerlekli sandalyede, kapının eşiğindeydi. Yorgun, solgun, gülümsüyordu.'),
            ),
            next: HUB,
          },
        ),
        option('VO_EZBER', '“Size bir son söz metni yazayım; onu ezberleyin.”', {
          score: { SAVUNMA_STRATEJISI: -30 },
          bad: 'Ezber son söz hâkime ezber gibi gelir; sanığın kendi sesi, kendi sözcükleriyle duyulmalı.',
          responses: says(
            L('volkan', 'Ezber… Ben okulda da ezberleyemezdim. Ama siz diyorsanız.'),
            T('Kâğıda yazılan pişmanlık, kâğıt kokar.'),
          ),
          next: HUB,
        }),
      ],
    }),
    conversation('ARA_NECATI', {
      ...ARA,
      title: 'Necati Bulut',
      background: 'buro',
      room: { label: 'ARSLAN HUKUK · BEKLEME', character: 'necati' },
      lines: says(
        card('ARSLAN HUKUK — SABAH', 'buro'),
        N(
          'Sekreterlik “bir taksici sizi bekliyor” dedi. Necati bekleme koltuğunda, termosu dizinde, kasketi elinde. Kasketini ilk kez çıkarmış görüyordum; saçları bembeyazdı.',
        ),
        L('necati', 'Rahatsız etmeyeceğim. İki dakika. Kahvemi de getirdim, sizinkini içmem.'),
        L(
          'necati',
          'Kırk yıl. Kırk yıl “ben gördüm” dedim. Kaza gördüm, kavga gördüm, hırsız gördüm. Hep gördüm. O gece görmemişim. Görmeden “gördüm” demişim.',
        ),
        L(
          'necati',
          'Bir adam benim yüzümden içeri girebilirdi. Bir bebek babasız kalabilirdi. Ben bunu nasıl yaşarım?',
        ),
        T('Burada bir çizgi var. Bir tanık bana geldi. Ne söylersem, onun bir sonraki ifadesine dokunabilir.'),
      ),
      choices: [
        option(
          'NE_DINLE',
          'Dinle; mahkemede ne gördüyse onu söylemeye devam etmesini, gerekirse mahkemeye kendisinin başvurabileceğini söyle.',
          {
            score: { USUL_BILGISI: 40 },
            good: 'Tanıkla görüşmede çizgi: dinlemek, yönlendirmemek; beyanını düzeltmek isterse bunu mahkemeye kendisinin yapabileceğini hatırlatmak.',
            category: 'USUL_BILGISI',
            responses: says(
              P('Necati Bey, mahkemede gördüğünüzü söylediniz; görmediğinizi de söylediniz. Bu cesaret ister.'),
              P(
                'Başka bir şey hatırlarsanız, mahkemeye kendiniz söylersiniz. Bana değil. Ben karşı tarafın avukatı sayılırım.',
              ),
              L('necati', 'Karşı taraf. Hm. Ben hep sizin karşınızda mıydım?'),
              L(
                'necati',
                'Bir şey daha: o gümbürtüden önce bir fren duydum. Uzun bir fren. Lastik bağırıyordu. Sonra gümbürtü. Sonra bir fren daha, kısa. Tıkır tıkır.',
              ),
              T(
                'Uzun bir fren, bir gümbürtü, kısa ve tıkırtılı bir fren. Kilitlenen tekerlek ve ABS. Bunu ona ben söyletmedim; ama bunu mahkemede söylemesi gerekiyor, bana değil.',
              ),
              N('Kasketini taktı, kalktı. Kapıda döndü.'),
              L('necati', 'Hâkime yazacağım. Kızım yazar, ben imzalarım.'),
            ),
            effects: [raise('necati_dilekce')],
            next: HUB,
          },
        ),
        option('NE_YAZ', '“Hatırladıklarınızı şimdi bana anlatın, bir beyan hazırlayalım; siz imzalarsınız.”', {
          score: { USUL_BILGISI: -50 },
          effects: [inc('ethics', 1)],
          bad: 'Karşı tarafın tanığına avukatın hazırladığı bir beyanı imzalatmak, tanığı etkileme riskini doğurur (TCK 277; Av.K. md. 34). Tanık beyanını mahkemeye kendisi yapar.',
          category: 'USUL_BILGISI',
          responses: says(
            L(
              'necati',
              'Siz yazarsınız, ben imzalarım… Bu, durakta bana dediğiniz şeye benziyor avukat hanım.',
              'saskin',
            ),
            N('Termosunu aldı, kalktı. Bir şey demedi. Söylemesine gerek yoktu.'),
          ),
          next: HUB,
        }),
      ],
    }),
    conversation('ARA_NALAN', {
      ...ARA,
      title: 'Heyetten bir telefon',
      background: 'buro',
      room: { label: 'TELEFON', character: 'nalan' },
      lines: says(
        card('ARSLAN HUKUK — ÖĞLEDEN SONRA', 'buro'),
        N('Telefondaki ses genç, kibar ve aceleciydi: Doç. Dr. Nalan Güneş’in asistanı.'),
        {
          speaker: 'narrator',
          name: 'ASİSTAN',
          text: 'Hocam raporla ilgili sorularınız varsa bu akşam fakültede kısa bir görüşme yapabileceğini söyledi. Gayriresmî. Kahve içersiniz.',
          style: 'phone',
        },
        T(
          'Bir bilirkişiyle, duruşmadan önce, gayriresmî bir kahve. Kulağa medeni geliyor. Ama bir bilirkişi bir tarafın kahvesini içerse, öbür taraf o kahvenin içinde ne olduğunu sorar.',
        ),
      ),
      choices: [
        option('NA_RED', '“Teşekkür ederim. Sorularımı duruşmada, mahkeme huzurunda soracağım.”', {
          score: { USUL_BILGISI: 50 },
          good: 'Bilirkişiyle taraflardan biri arasında mahkeme dışı görüşme tarafsızlığı tartışmalı kılar; bilirkişiye soru duruşmada sorulur (CMK 68), gerekirse ret yolu işletilir (CMK 69).',
          category: 'USUL_BILGISI',
          responses: says(
            {
              speaker: 'narrator',
              name: 'ASİSTAN',
              text: 'Anlıyorum. Hocam da öyle diyeceğinizi tahmin etmişti zaten. Bir sınav gibi bir şeydi galiba.',
              style: 'phone',
            },
            T('Bir sınav. Heyet başkanı, avukatın kahve içip içmeyeceğini merak etmiş. İçmedim.'),
            L(
              'leyla',
              'Kahveyi reddettin mi? İyi. Bilirkişilerle kahve içilmez, Deniz. Bir kere içersen, raporu okuyan herkes o kahveyi de okur.',
            ),
          ),
          next: HUB,
        }),
        option('NA_GIT', '“Memnuniyetle gelirim. Raporun dördüncü sayfasını konuşmak isterim.”', {
          score: { USUL_BILGISI: -60 },
          effects: [inc('ethics', 1), dec('pers', 1)],
          bad: 'Bilirkişiyle duruşma dışında, karşı tarafın yokluğunda raporu görüşmek tarafsızlığı zedeler ve bilirkişinin reddi sebebi doğurabilir (CMK 69); meslek kurallarına aykırıdır.',
          category: 'USUL_BILGISI',
          responses: says(
            N(
              'Akşam fakültenin kapısında beni asistan karşıladı. “Hocam vazgeçti” dedi. “Savcılığa da bildirdi, usulen.”',
            ),
            T('Kahve yok. Bir tutanak var. Ve üçüncü celsede savcının bana bakışı.'),
          ),
          next: HUB,
        }),
      ],
    }),
    conversation('ARA_SANAYI', {
      ...ARA,
      title: 'Kestel sanayi sitesi',
      background: 'depo',
      room: { label: 'KAPORTA-BOYA · 3. BLOK', character: 'rustem' },
      onFirstEnter: [{ type: 'MEET', character: 'rustem' }],
      lines: says(
        card('KESTEL SANAYİ SİTESİ · 3. BLOK — 15.00', 'depo'),
        N(
          'Taşlama sesi, tiner kokusu, bir radyoda arabesk. Sıra sıra kaporta dükkânları. “Rüstem Kaporta-Boya” yazan tabelanın altında yağlı tulumlu bir adam.',
        ),
        T(
          'Kriminal raporu bir rengi söyledi; kamera bir kırık stopu. Böyle bir hasar faturasız onarılacaksa, bu sitede onarılır. On iki kaportacıya sordum; on biri “bilmem” dedi. Biri başını çevirdi.',
        ),
        L('rustem', 'Ne lazım abla? Boya mı, kaporta mı? Sigorta işi yapmam, peşin çalışırım.'),
        P('Kasımın ortasında koyu yeşil bir hafif ticari gelmiş olabilir mi? Sağ ön köşesi, sağ stopu.'),
        L('rustem', 'Ne bileyim abla, günde on araba girer çıkar. Hatırlamam.'),
        N(
          'Yerde, kompresörün dibinde koyu yeşil boya tozu. Bir köşede yeni bir sağ stop lambasının kutusu. Arka garajın kapısı aralık; içeride örtülü bir şeyin hatları.',
        ),
        T('Gördüğümü gördüm. Şimdi ne yapacağım, beni bu dosyadan daha uzun süre takip edecek.'),
      ),
      choices: [
        option(
          'SA_NOT',
          'Gördüklerini not al, fotoğrafını dükkânın önünden, kamuya açık yerden çek; tek kelime etmeden çık ve savcılığa bildir.',
          {
            score: { ARASTIRMA: 60 },
            effects: [raise('sanayi_not')],
            good: 'Avukat şüpheliyi kovalamaz, işyerine girmez; kamuya açık yerden gördüğünü not alır ve somut bilgiyi savcılığa bildirir (CMK 158).',
            category: 'ARASTIRMA',
            responses: says(
              P('Teşekkür ederim usta. Kolay gelsin.'),
              N(
                'Tabelanın, kompresörün ve yerdeki tozun fotoğrafını kaldırımdan çektim. Rüstem arkamdan baktı, taşlamayı açmadı.',
              ),
              T(
                'Kovalamak, yakalamak, itiraf ettirmek: dizilerdeki avukat. Ben bir dilekçe yazacağım. Dilekçeler daha az heyecanlı ama daha çok kişiyi yakalar.',
              ),
            ),
            next: HUB,
          },
        ),
        option('SA_GARAJ', 'Rüstem içeri girdiğinde aralık garaj kapısından süzül; örtüyü kaldırıp fotoğraf çek.', {
          score: { ARASTIRMA: -100 },
          effects: [raise('etik_garaj'), inc('ethics', 1), discover('ev_garaj')],
          bad: 'Kapalı bir işyerine rızaya aykırı girmek suçtur (TCK 116/2) ve bu yolla elde edilen fotoğraf hükme esas alınamaz (Anayasa 38/6, CMK 206/2-a, 217/2). Avukatlık meslek kurallarına da açıkça aykırı (Av.K. md. 34).',
          category: 'ARASTIRMA',
          responses: says(
            N(
              'Garajın içi karanlık ve soğuktu. Örtünün altında koyu yeşil bir panelvan. Sağ ön köşesi yeni boyanmış, macun izleri hâlâ belli. Flaşı açtım.',
            ),
            fx(N('Arkamda bir ses: “Ne yapıyorsun sen orada?” Rüstem kapıdaydı, elinde bir anahtar.'), 'flash'),
            L('rustem', 'Polis çağırıyorum! İzinsiz girdin! Hırsız mısın, nesin?', 'kizgin'),
            T('Elimde bir fotoğraf var. Ve bir suç. İkisi de benim.'),
          ),
          next: HUB,
        }),
        option('SA_TEHDIT', '“Usta, bunu savcıya söylersem sen de yanarsın. Şimdi anlatırsan iyi olur.”', {
          score: { ARASTIRMA: -40 },
          bad: 'Tanık olabilecek birini korkutmak bilgi getirmez, uyarı getirir; ilgili kişiler delili ortadan kaldırabilir.',
          category: 'ARASTIRMA',
          responses: says(
            L('rustem', 'Beni mi korkutuyorsun abla? Sanayide büyüdüm ben.', 'kizgin'),
            N('Taşlamayı açtı. Konuşma bitti. Garajın kapısı kapandı.'),
          ),
          next: HUB,
        }),
      ],
    }),
    {
      id: 'ARA_SUC',
      type: 'CHOICE',
      ...ARA,
      title: 'Suç duyurusu',
      background: 'buro',
      prompt: {
        speaker: 'narrator',
        text: 'Bursa Cumhuriyet Başsavcılığına bir dilekçe. Kimin hakkında, hangi somut bilgiye dayanarak?',
      },
      choices: [
        option(
          'SU_DAYANAKLI',
          'Kaçan araç sürücüsü hakkında (TCK 85, 98): boya raporu, saati düzeltilmiş kamera kaydı ve sanayideki onarım bilgisiyle.',
          {
            enabledWhen: has('ded_arac'),
            lockedReason: 'Kaçan aracı tarif edecek somut bir çıkarım gerekli.',
            score: { USUL_BILGISI: 80 },
            effects: [
              raise('suc_dayanakli'),
              ifThen(flag('sanayi_not'), [{ type: 'SCORE', category: 'USUL_BILGISI', amount: 40 }]),
            ],
            good: 'Somut olgulara dayanan bir ihbar savcılığın soruşturma yükümlülüğünü doğurur (CMK 158, 160). Kaçan sürücü için taksirle öldürmenin yanında yardım etmeme (TCK 98) de gündeme gelir.',
            responses: says(
              N(
                'Dilekçe dört sayfa oldu. Renk, model aralığı, kırık stop, saat, sanayinin adresi. İsim yok; isim savcılığın işi.',
              ),
              T('Kimseyi kovalamadım. Bir zarf gönderdim. Zarflar bazen kovalamaktan hızlıdır.'),
            ),
            next: HUB,
          },
        ),
        option('SU_GENEL', 'Faili meçhul: “Olay yerinde başka bir araç olmalı; araştırılsın.”', {
          score: { USUL_BILGISI: 10 },
          effects: [raise('suc_bos')],
          neutral: 'Somut bir tarif olmadan savcılık yalnızca “araştırılıyor” der; ikinci celseye bir yazı yetişmez.',
          responses: says(
            N('İki paragraf. “Başka bir araç olabilir.” Gönderdim.'),
            T('“Olabilir” diye başlayan dilekçeler genelde “araştırılmaktadır” diye biten yazılar alır.'),
          ),
          next: HUB,
        }),
        option('SU_KATILAN', 'Katılan Serkan Durmaz hakkında: “sanığı haksız yere suçluyor”.', {
          score: { USUL_BILGISI: -60 },
          bad: 'Somut dayanağı olmayan, yasın içindeki bir kişiye yönelik suçlama: iftira riski (TCK 267) ve meslek ahlakına aykırılık.',
          category: 'USUL_BILGISI',
          responses: says(N('Yazdım. Okudum. Sildim. Ama bu satırları yazmış olmanın ağırlığı silinmedi.')),
          next: HUB,
        }),
      ],
    },
    toHub(
      deductionBoard('ARA_CIKARIM', {
        ...ARA,
        title: 'Çıkarım tahtası · ara',
        background: 'buro_gece',
        lines: says(N('Yeni raporlar tahtada. Eski kartlarla yan yana koy; bazıları ilk kez bir cümle kuracak.')),
        pool: [...invPool, 'ev_atk', 'ev_boya'],
        recipes: [
          recipe('CA_OLUM', 'ev_atk', 'clue_sirt', {
            score: { DELIL_ANALIZI: 300 },
            discovers: 'ded_olum',
            feedback: {
              title: 'Ölüm ilk darbeden',
              text: 'ATK: ölümcül kafa travması birincil çarpmada. Sırttaki az kanamalı sıyrıklar ikincil temas. Volkan’ın aracı ikinci temastı; ölüme yol açan değil.',
              label: 'YENİ DELİL · +300 SKOR',
              tone: 'success',
            },
          }),
          recipe('CA_ARAC', 'ev_boya', 'clue_tek_stop', {
            score: { DELIL_ANALIZI: 300 },
            discovers: 'ded_arac',
            feedback: {
              title: 'Koyu yeşil hafif ticari',
              text: 'Orman yeşili, 2005–2010 model bir hafif ticari; sağ stop lambası kırık, sağ ön köşesi hasarlı. Böyle bir araç ertesi gün bir kaportacıya gitmiş olmalı.',
              label: 'YENİ DELİL · +300 SKOR',
              tone: 'success',
            },
          }),
          ...baseRecipes('CA_'),
        ],
        miss: boardMiss('FB_CIKARIM2'),
        finish: { id: 'CIKARIM2_BITIR' },
      }),
    ),
    story('ARA_LEYLA', {
      ...ARA,
      title: 'Leyla’ya danış',
      background: 'buro',
      lines: [
        when(
          all(has('ev_atk'), not(has('ded_olum'))),
          L(
            'leyla',
            'Adli Tıp raporunu okudun mu, yoksa baktın mı? Bir yaralanma ile bir ölüm arasında bir köprü vardır. Hangisinin hangi temastan geldiğini kur.',
          ),
          L(
            'leyla',
            'İlliyet bağı kurulmadıysa, müvekkilin oradaydı ama ölüme yol açmadı demektir. Bu “şüphe” değil, başka bir şeydir. Ne olduğunu sen söyle.',
          ),
        ),
        when(
          all(has('ev_boya'), not(has('ded_arac'))),
          L('leyla', 'Bir renk geldi. Renk tek başına bir araç değildir; bir görüntüyle eşleşirse olur.'),
        ),
        when(
          all(has('ded_arac'), not(visited('ARA_SUC'))),
          L(
            'leyla',
            'Bir araç tarifin var. Onu kovalamayacaksın, biliyorsun. Savcıya yaz; somut yaz. Somut olmayan ihbar çekmecede yaşlanır.',
          ),
        ),
        when(
          all(has('ev_heyet'), not(flag('contra_heyet'))),
          L(
            'leyla',
            'Heyet raporu güzel. Fazla güzel. Bir paragrafı var ki seni dördüncü sayfada bekliyor. Ona veriyle bak.',
          ),
        ),
        otherwise(
          L(
            'leyla',
            'İki yolun var: ispat ya da şüphe. İspat daha parlak ama daha ağır; bir halkası kopsa bütün zincir düşer. Şüphe daha mütevazı ama daha sağlam.',
          ),
          L(
            'leyla',
            'Hangisini seçersen seç, esas savunmanda dayanaklarını tek tek say. Hâkimler sayılan şeylere inanır.',
          ),
        ),
      ],
      choices: [cont('ARALEY_GERI', 'Teşekkür et ve dön', HUB, { role: 'BACK' })],
    }),

    // --- Üçüncü celseden önceki gece ---
    decisionNode('ARA_SON_1', [{ to: 'ARA_SON_2' }], {
      ...ARA,
      lines: [
        when(
          flag('suc_dayanakli'),
          card('PAZAR 23.50 — ARSLAN HUKUK', 'buro_gece'),
          N(
            'Savcılıktan bir telefon geldi akşamüstü; adını vermeyen bir kâtip: “Yazınız işleme alındı, bir araç tespit edilmiş. Dosyanıza yazı gidecek.” Fazlasını söylemedi.',
          ),
        ),
        when(
          flag('suc_bos'),
          card('PAZAR 23.50 — ARSLAN HUKUK', 'buro_gece'),
          N(
            'Savcılıktan iki satırlık bir yazı geldi: “İhbarınız üzerine araştırma başlatılmıştır.” Bir araç adı yok, bir sürücü adı yok. Bir dosya numarası var.',
          ),
        ),
        otherwise(
          card('PAZAR 23.50 — ARSLAN HUKUK', 'buro_gece'),
          N('Pano yine dolmuştu. Bu sefer raptiyeler yetmedi; kâğıtları bantla yapıştırdım.'),
        ),
      ],
    }),
    decisionNode('ARA_SON_2', [{ to: 'ARA_SON_3' }], {
      ...ARA,
      lines: [
        when(
          has('ded_olum'),
          T(
            'Ölüm ilk darbedendi. Volkan oradaydı ama ölüme yol açan o değildi. Bunu yarın bir hâkime, bir savcıya ve bir oğula söyleyeceğim.',
          ),
        ),
        when(
          any(has('ev_edr'), has('ev_heyet')),
          T(
            'Kırmızı ışık çöktü. Hız çöktü. Geriye “hissettim” kalıyor. Hissetmek bir suç değil; ama bir hâkimin kulağında yankılanır.',
          ),
        ),
        otherwise(
          T(
            'Elimde bir taksicinin tereddüdü, bir müvekkilin “yeşildi”si var. Yarın bunlarla bir raporun karşısına çıkacağım.',
          ),
        ),
      ],
    }),
    decisionNode('ARA_SON_3', [{ to: 'ARA_SON' }], {
      ...ARA,
      lines: [
        when(
          flag('etik_garaj'),
          T(
            'Telefonumda garajın fotoğrafları. Baroya şikâyet dilekçesi muhtemelen yolda. Leyla henüz bilmiyor. Ya da biliyor ve susuyor.',
          ),
        ),
        when(
          flag('ayten_teslim'),
          T(
            'Ayten parçayı savcılığa teslim etmiş; tutanağın bir örneği dosyaya girecek. Bir dolaptan bir dosyaya üç ay.',
          ),
        ),
        otherwise(T('Volkan’ın kızı bu gece hastanede ikinci gecesini geçiriyor. Babasının üçüncü celsesi yarın.')),
      ],
    }),
    story('ARA_SON', {
      ...ARA,
      title: 'Gece',
      background: 'buro_gece',
      lines: says(
        N('Leyla gece yarısı odasından çıktı. Paltosunu giydi, kapıda durdu.'),
        L(
          'leyla',
          'Yarın iki şeyi kanıtlayacaksın ya da bir şeyi şüpheye düşüreceksin. Hangisini seçtiğini bil. İkisini birden yapmaya çalışan avukat ikisini de yapamaz.',
        ),
        L('leyla', 'Ve o oğlana bak. Mahkemede en çok o dinleyecek.'),
        N(
          'Paltosunun cebinden bir şey çıkardı, masama bıraktı: eski, kenarları yıpranmış bir tükenmez kalem. Gövdesinde altın harflerle bir baro amblemi.',
        ),
        L(
          'leyla',
          'İlk ağır dosyamda bununla yazdım. Kaybettim o dosyayı. Kalem şanslı değil; ama dürüst. Yarın yanında olsun.',
        ),
        T('Leyla bana bir şey verdi. Otuz yılda ilk kez. Ne diyeceğimi bilemedim; o da beklemedi.'),
        fx(N('Kapı kapandı. Yağmur yine başlamıştı. Gökdere’de ışıklar şimdi kusursuz yanıyordu.'), 'fade'),
      ),
      choices: [cont('ARASON_DEVAM', 'Adliyeye git', 'T_00Y', { role: 'PRIMARY' })],
    }),
  ],
  triggers: [
    {
      id: 'tg_ara_day',
      scope: HUB,
      priority: 1,
      when: all(cmp(v('ara_ap'), '<=', 0), cmp(v('ara_day'), '<', 2)),
      goto: 'ARA_DAY_END',
    },
  ],
  discoveryPaths: [...entry.discoveryPaths, ...dayEnd.discoveryPaths],
};
