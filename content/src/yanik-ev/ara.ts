import {
  all,
  any,
  cmp,
  conversation,
  cont,
  decisionNode,
  deductionBoard,
  deliver,
  fallback,
  flag,
  has,
  inc,
  met,
  nav,
  not,
  option,
  raise,
  rawChoice,
  recipe,
  ref,
  sceneSearch,
  set,
  story,
  v,
  choiceNode,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import type { ChoiceDef, NodeDef } from '@mudafaa/case-schema';
import { INV2, card, me, n, named, p2, s, th } from './shared.js';

// 70-ara: ara evre (2 gün × 4 EP). Yığın kullanılmaz: her etkinlik doğrudan ARA_HUB'a döner (kaçış uzaklığı sınırı).
// Gelen raporlar, Gülsüm Yaşar ve tahkim kararı, Saadet'in televizyonu, bekçinin tenekeleri, Halil'le ek savunma
// hazırlığı, eksper hakkında suç duyurusu, Onur'un "karşı rapor" teklifi (etik tuzak), kapıdaki eksper.

const HUB = 'ARA_HUB';

/** Kit yardımcılarının `$return` BACK seçeneğini doğrudan ARA_HUB'a çevirir. */
export const toHub = <T extends NodeDef>(node: T): T => ({
  ...node,
  choices: node.choices.map((c) => (c.role === 'BACK' && c.next === '$return' ? { ...c, next: HUB } : c)),
});

const act = (id: string, label: string, to: string, extra: Partial<ChoiceDef> = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { cost: [{ var: 'ap2', amount: 1 }], next: to, maxUses: 1, ...extra });

const free = (id: string, label: string, to: string, extra: Partial<ChoiceDef> = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { next: to, ...extra });

const fresh = (id: string, a: string, b: string, out: string, title: string, text: string) =>
  recipe(id, a, b, {
    discovers: out,
    score: { DELIL_ANALIZI: 300 },
    feedback: { title, text, label: 'YENİ DELİL · +300 SKOR', tone: 'success' },
  });

const teslim = deliver('ARA_GIRIS', [
  { evidence: 'ev_lab', requires: flag('lab_istendi'), hint: 'Laboratuvarın ham verisini isteyebilirdin.' },
  { evidence: 'ev_ariza', requires: flag('ariza_istendi'), hint: 'Dağıtım şirketinin arıza kayıtlarını isteyebilirdin.' },
  { evidence: 'ev_ark', requires: flag('pano_istendi'), hint: 'Panonun elektrik bilirkişisine incelenmesini isteyebilirdin.' },
]);

const back = (id: string, label: string) => rawChoice('CONTINUE', id, label, { role: 'BACK', next: HUB });

export const ara: CasePart = {
  nodes: [
    decisionNode('ARA_GIRIS_1', [{ to: 'ARA_GIRIS' }], {
      ...INV2,
      title: 'Ara',
      onEnter: [set('in_court', false)],
      lines: [
        {
          when: flag('halil_tahliye'),
          lines: [
            card('14 NİSAN · 18.20 — CEZAEVİ KAPISI', 'sokak_yagmur'),
            n('Halil cezaevinden bir naylon torbayla çıktı: bir kazak, bir diş fırçası, koğuş arkadaşlarının ona hediye ettiği tahta bir tespih.'),
            n('Zehra kapının karşısında, şemsiyesiz bekliyordu. Halil durdu. Zehra yürüdü. Bir süre ikisi de bir şey söylemedi.'),
            s('halil', 'Islanıyorsun, kızım.'),
            s('zehra', 'İki aydır ıslanıyorum, baba. Fark etmez.', 'uzgun'),
            n('Halil kızının yüzündeki yağmuru başparmağıyla sildi; bir kumaşın tozunu alır gibi, dikkatle.'),
            th('Tahliye bir beraat değil. Bir kapı. Ama Halil o kapıdan geçerken arkasına bakmadı. Önüne baktı: kızına.'),
          ],
        },
        {
          lines: [
            card('14 NİSAN · 18.20 — ADLİYE ARKA KAPISI', 'sokak_yagmur'),
            n('Ring aracının arka camı buğuluydu. Halil parmağıyla küçük bir pencere açtı; Zehra’yı aradı, buldu.'),
            n('Zehra elini kaldırdı. Halil elini cama koydu. Araç hareket etti; el izi buğuda kaldı, sonra o da silindi.'),
            th('Üç hafta. Bir sonraki celseye kadar Halil koğuşta ayakkabı dikecek. Ben de iplik.'),
          ],
        },
      ],
    }),
    decisionNode('ARA_GIRIS', [{ to: 'ARA_GIRIS_B' }], {
      ...INV2,
      title: 'Ara',
      onEnter: [...teslim.effects, ...p2.start()],
      lines: [
        {
          lines: [
            card('15 NİSAN · 09.40 — ADLİYE KORİDORU', 'adliye'),
            n('Ertesi sabah kalemde bir dilekçe bırakıp çıkarken koridorda biri yanıma geldi. Kusursuz bir takım, kusursuz bir kravat, ıslak bir şemsiye.'),
            s('tarik', 'Av. Arslan. Tarık Sönmez. Dün tanışma fırsatımız olmadı.'),
            n('Kartvizitini uzattı. Kalın, mat bir kâğıt: “Sönmez Ekspertiz — Hasar, Yangın, Sorumluluk.”'),
            s('tarik', 'Dün bilirkişiyi epey sarstınız. Tebrik ederim. Yangın davaları zordur; ateş iz bırakır, ama izleri herkes başka okur.'),
            s('tarik', 'Objektif olmak zor iştir. Benim işim de, sizin işiniz de. Kolay gelsin.'),
            n('Gülümsedi ve gitti. Ayakkabılarının sesi koridorun mermerinde düzenli, acelesiz.'),
            th('Bir tehdit değil. Bir tehdit kadar soğuk. “Objektif.” Bu kelimeyi bir eksperin ağzından bir daha duyarsam kartvizitini ona geri vereceğim.'),
          ],
        },
      ],
    }),
    decisionNode('ARA_GIRIS_B', [{ to: 'ARA_GIRIS_C' }], {
      ...INV2,
      lines: [
        {
          when: any(has('ev_lab'), has('ev_ariza'), has('ev_ark')),
          lines: [
            n('Öğleden sonra kalemden bir telefon: müzekkerelere cevap gelmeye başlamış. Kâtip zarfları masama bıraktı, “bunlar sizin” dedi; benim gibi o da yorgundu.'),
            th('Zarflar. Bir zarf açılmadan önce her şey olabilir. Açıldıktan sonra yalnızca bir şeydir.'),
          ],
        },
      ],
    }),
    story('ARA_GIRIS_C', {
      ...INV2,
      title: 'Ara',
      background: 'buro',
      lines: [
        {
          lines: [
            th('Üç hafta. İki raporu değil, bir adamı okumam gerekiyor artık. Ve bir sokağın elektriğini.'),
          ],
        },
      ],
      choices: [cont('ARAGIRIS_DEVAM', 'Ara evresine başla', HUB, { role: 'PRIMARY' })],
    }),
    {
      id: HUB,
      type: 'INVESTIGATION',
      ...INV2,
      title: 'Ara',
      background: 'buro',
      hud: ['day2', 'ap2'],
      lines: p2.dayLines([
        'GÜN 1/2 · İKİNCİ CELSEYE 20 GÜN. Hedef: gelen kayıtları oku; eksperin kim olduğunu öğren.',
        'GÜN 2/2 · İKİNCİ CELSEYE 13 GÜN. Hedef: tanıklarını hazırla, tahtayı topla, kararını ver.',
      ]),
      tabs: [
        {
          id: 't2_kayit',
          label: 'KAYITLAR',
          kind: 'ARCHIVE',
          choices: ['A2_LAB', 'A2_ARIZA', 'A2_ARK', 'A2_TAHKIM', 'A2_SUC', 'A2_CIKARIM', 'A2_LEYLA'],
        },
        { id: 't2_kisi', label: 'KİŞİLER', kind: 'PEOPLE', choices: ['A2_GULSUM', 'A2_CEVDET', 'A2_HALIL'] },
        { id: 't2_yer', label: 'YERLER', kind: 'SCENE', choices: ['A2_SAADET'] },
      ],
      choices: [
        act('A2_LAB', 'Laboratuvar ham verisini incele', 'ARA_LAB', { visibleWhen: has('ev_lab'), description: 'Kromatogram' }),
        act('A2_ARIZA', 'Dağıtım şirketinin arıza kaydını incele', 'ARA_ARIZA', {
          visibleWhen: has('ev_ariza'),
          description: 'Yangın gecesi hat kaydı',
        }),
        act('A2_ARK', 'Elektrik bilirkişisinin raporunu incele', 'ARA_ARK', {
          visibleWhen: has('ev_ark'),
          description: 'Sigorta panosu ve hat',
        }),
        act('A2_TAHKIM', 'Tahkim kararını incele', 'ARA_TAHKIM', { visibleWhen: has('ev_tahkim'), description: 'Yaşar dosyası' }),
        free('A2_SUC', 'Eksper hakkında ne yapacaksın?', 'ARA_SUC', {
          visibleWhen: any(flag('contra_b2'), has('ded_zincir'), has('ev_tahkim')),
          maxUses: 1,
          description: '0 EP · savcılık',
        }),
        free('A2_CIKARIM', 'Çıkarım tahtası', 'ARA_CIKARIM', {
          description: '0 EP · yeni kartlar',
          enabledWhen: ref('kart_ara'),
          lockedReason: 'En az 2 yeni ipucu gerekli.',
        }),
        free('A2_LEYLA', 'Leyla’ya danış', 'ARA_LEYLA', {
          description: '0 EP · günde bir kez',
          visibleWhen: cmp(v('leyla_ara'), '<', v('day2')),
          effects: [set('leyla_ara', v('day2'))],
        }),
        act('A2_GULSUM', 'Zehra’nın getirdiği kadın', 'ARA_GULSUM', { description: 'Hastaneden bir tanıdık' }),
        act('A2_CEVDET', 'Bekçi Cevdet’le yeniden konuş', 'ARA_CEVDET', {
          visibleWhen: met('cevdet'),
          description: 'Bekçi kulübesi',
        }),
        act('A2_HALIL', 'Halil’le konuş', 'ARA_HALIL', { description: 'Ek savunmaya hazırlık' }),
        act('A2_SAADET', 'Saadet Hanım’ın televizyonuna bak', 'ARA_SAADET', {
          visibleWhen: flag('fact_tv'),
          description: 'Kalem Sokak 7 · büyüteç 4',
        }),
        nav('GO_T', 'DURUŞMAYA GİT · 2. CELSE', 'ARA_KAPI', {
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen ara evresi biter. Emin misin?',
        }),
      ],
    } as NodeDef,
    decisionNode('ARA_DAY_END', [{ to: 'ARA_AKSAM' }], {
      ...INV2,
      title: 'Gün sonu',
      onEnter: [inc('day2', 1), set('ap2', 4)],
    }),
    story('ARA_AKSAM', {
      ...INV2,
      title: 'Teklif',
      background: 'buro_gece',
      lines: [
        {
          lines: [
            card('22 NİSAN · SALI 21.30 — ARSLAN HUKUK', 'buro_gece'),
            n('Zehra yalnız gelmedi. Yanında otuzlarında, kısa sakallı, inşaat botlu bir adam: nişanlısı Onur. Elinde bir dosya, yüzünde bir “çözüm.”'),
            named('ONUR TAŞ', 'Avukat hanım, açık konuşacağım. Bir tanıdığım var, eksper. İşini bilir. Kırk bin liraya bir rapor yazar.'),
            named('ONUR TAŞ', '“Yangın elektrik kaynaklıdır, hızlandırıcı yoktur.” İmzalı, mühürlü. Onlar rapor yazdıysa biz de yazarız. Dünya böyle dönüyor.'),
            n('Zehra yere bakıyordu. Bir şey söylemedi; ama gitmedi de.'),
            s('zehra', 'Ben istemedim. Ama… babam bir gün daha orada kalmasın diye her şeyi düşündüm. Bunu da.', 'uzgun'),
            th('Bu dosya sahte bir raporla açıldı. Şimdi bana bir sahte rapor uzatılıyor; bu sefer benim tarafımdan. Bir aynanın içindeyim.'),
          ],
        },
      ],
      choices: [
        option('ON_RED', 'Hayır. Ve bunu bir daha kimseye teklif etmeyin; babanızı en çok bu batırır.', {
          score: { SAVUNMA_STRATEJISI: 60 },
          effects: [raise('onur_red')],
          good: 'Doğru. Gerçeğe aykırı içerikte bir uzman raporu ısmarlamak, yalan tanıklığa ve delil uydurmaya varan bir yoldur (TCK 272, 38; Av.K. 34). Bir yalan, savunmanın bütün gerçeklerini yanında götürür.',
          responses: [
            {
              lines: [
                named('ONUR TAŞ', 'Ama onlar…'),
                me('Onlar yaptıysa, bunu ben mahkemede göstereceğim. Kendi raporlarıyla. Bizim yalanımız onların yalanını temize çıkarır.'),
                s('zehra', 'Haklısınız. Onur, gidelim.'),
                n('Kapıda Zehra döndü. “Teşekkür ederim” dedi; teşekkürün neye olduğunu ikimiz de biliyorduk.'),
              ],
            },
          ],
          next: 'ARA_SABAH2',
        }),
        option('ON_MUTALAA', 'Ismarlama rapor olmaz. Ama bağımsız bir uzmandan bilimsel mütalaa alabiliriz; sonucu ne çıkarsa.', {
          score: { SAVUNMA_STRATEJISI: 80, USUL_BILGISI: 40 },
          effects: [raise('onur_red'), raise('mutalaa')],
          good: 'Yerinde. Taraflar uzmanından bilimsel mütalaa alabilir (CMK 67/6) ve uzmanın dinlenmesini isteyebilir (CMK 68/3); ama sonucu önceden belirlenmiş, parayla yazılmış bir rapor delil değil, suçtur.',
          responses: [
            {
              lines: [
                me('Üniversitede bir elektrik mühendisi var. Raporları okusun, panonun incelemesine baksın, ne düşünüyorsa yazsın. Lehimize ya da aleyhimize.'),
                named('ONUR TAŞ', 'Ya aleyhimize yazarsa?'),
                me('O zaman bunu mahkemeden önce biz öğrenmiş oluruz. Bu da bir şeydir.'),
                s('zehra', 'Bunu yapalım. Doğrusunu.', 'mutlu'),
              ],
            },
          ],
          next: 'ARA_SABAH2',
        }),
        option('ON_DUSUN', 'Bunu şimdi konuşmayalım; düşüneyim.', {
          effects: [raise('onur_dusun')],
          neutral: 'Bir avukatın bu teklifi “düşünmesi” bile karşı tarafa bir kapı aralar. Hayır, ilk anda söylenir.',
          responses: [
            {
              lines: [
                named('ONUR TAŞ', 'Düşünün. Numaram Zehra’da.'),
                th('Düşüneceğim dedim. Düşünmeyeceğim. Ama bunu söylemedim. Neden söylemedim?'),
              ],
            },
          ],
          next: 'ARA_SABAH2',
        }),
        option('ON_KABUL', 'Yazsın. Onlar oyunu kurallarına göre oynamıyorsa biz de oynamayız.', {
          score: { SAVUNMA_STRATEJISI: -200 },
          effects: [raise('sahte_rapor'), inc('ethics')],
          bad: 'Gerçeğe aykırı, parayla ısmarlanmış bir uzman raporunu mahkemeye sunmak yalan tanıklığa azmettirme ve delil uydurmadır (TCK 272, 38) ve meslekten çıkarmaya varan bir disiplin ihlalidir (Av.K. 34).',
          responses: [
            {
              lines: [
                named('ONUR TAŞ', 'Tamam. İki hafta. Mühürlü, imzalı.'),
                n('Zehra bana baktı. Bir şey bekliyordu; bir “hayır”. Gelmedi.'),
                th('Kendime söylediğim cümle: “Onlar başlattı.” Bir kundakçının da kendine söylediği cümle bu olabilir.'),
              ],
            },
          ],
          next: 'ARA_SABAH2',
        }),
      ],
    }),
    story('ARA_SABAH2', {
      ...INV2,
      title: 'Mektuplar',
      background: 'hastane',
      lines: [
        {
          when: any(flag('mektup'), flag('halil_tahliye')),
          lines: [
            card('23 NİSAN · 07.20 — DEVLET HASTANESİ, ACİL SERVİS ÖNÜ', 'hastane'),
            n('Zehra gece nöbetinden çıkıyordu. Ambulans rampasının yanında bir bankta oturdu; çantasından kurdeleli bir deste çıkardı.'),
            s('zehra', 'Annemin mektupları. Dün gece nöbet arasında birini okudum. Babama yazmış; nişanlıyken. “Halil, sen kumaşa dikkat edersin, kendine etmezsin.”', 'uzgun'),
            s('zehra', 'Otuz yıl önce. Aynı cümle. Babam hâlâ aynı adam. Kendine dikkat etmiyor; evine ediyordu.'),
            n('Mektubu katladı, kurdeleyi bağladı. Bir ambulans siren çalmadan girdi; kimse acele etmedi.'),
            s('zehra', 'Dün geceki teklif için özür dilerim. Onur iyi biri. Korkuyor. Hepimiz korkuyoruz. Siz korkmuyor musunuz?'),
            me('Korkuyorum. Ama korkunun bir raporu olmaz. Benim elimde raporlar var; korkudan daha sağlam.'),
            th('Bir yalan söyledim mi? Bilmiyorum. Raporlar sağlam. Ben o kadar değilim.'),
          ],
        },
        {
          lines: [
            card('23 NİSAN · 07.20 — DEVLET HASTANESİ, ACİL SERVİS ÖNÜ', 'hastane'),
            n('Zehra gece nöbetinden çıkıyordu. Ambulans rampasının yanında, elinde bir karton kahveyle beni bekliyordu.'),
            s('zehra', 'Dün geceki teklif için özür dilerim. Onur iyi biri. Korkuyor. Hepimiz korkuyoruz.'),
            s('zehra', 'Annem burada öldü, biliyor musunuz? Bu hastanede değil; evde. Ama son ayını burada geçirdi, dördüncü katta. Ben de buraya iş başvurusu yaptım. Saçma.'),
            me('Saçma değil. İnsan kaybettiği yere yakın durur.'),
            th('Halil yanık evin önünde sigara yakıp tutardı. Zehra annesinin öldüğü hastanede nöbet tutuyor. Bu ailede herkes bir yasın nöbetini tutuyor.'),
          ],
        },
      ],
      choices: [cont('ARASABAH2_DEVAM', 'Güne başla', HUB, { role: 'PRIMARY' })],
    }),
    choiceNode('ARA_GULSUM', {
      ...INV2,
      title: 'Gülsüm Yaşar',
      background: 'buro',
      lines: [
        {
          lines: [
            card('16 NİSAN · 11.00 — ARSLAN HUKUK', 'buro'),
            n('Zehra’nın arkasından altmışlarında, siyah başörtülü, bir naylon dosya tutan bir kadın girdi. Oturmadan önce koltuğa baktı; oturulup oturulmayacağını sorar gibi.'),
            s('zehra', 'Gülsüm Teyze. Acilde, dün. Torununu getirmişti. Bekleme salonunda haberleri izliyordu; babamın adı geçince yanıma geldi.'),
            named('GÜLSÜM YAŞAR', 'Kızım, ben o adamı tanıyorum. O eksperi. Adı Tarık. İki yıl önce benim evim yandı. Kemerkaya’da. Soba borusundan.'),
            named('GÜLSÜM YAŞAR', 'O adam geldi, baktı, “burada benzin dökülmüş” dedi. Kocam ölmüştü, ben yalnızdım. Benzini ben nereden bulayım?'),
            th('İki yıl önce, başka bir ev, aynı adam, aynı kelime. Bir tesadüf. Ya da bir yöntem.'),
          ],
        },
      ],
      prompt: 'Gülsüm Hanım’a ne soracaksın?',
      choices: [
        option('GL_SONUC', 'Sonra ne oldu? Dosyanız nasıl bitti?', {
          discovers: 'ev_tahkim',
          score: { ARASTIRMA: 80 },
          responses: [
            {
              lines: [
                named('GÜLSÜM YAŞAR', 'Şirket ödemedi. Oğlum bir avukat buldu, Sigorta Tahkim Komisyonu’na gittik. Bir yıl sürdü.'),
                named('GÜLSÜM YAŞAR', 'Hakemler o adamın raporuna “bilimsel dayanağı yok” dediler. Şirketi ödemeye mahkûm ettiler. Kararı getirdim, al kızım.'),
                n('Naylon dosyadan kenarları yıpranmış bir karar çıkardı. Ekinde eski bir ekspertiz raporu ve bir şirket yazısı.'),
                th('Bir karar. Bir ek. Bir yazı. Gülsüm Hanım iki yıldır bu dosyayı taşıyor; bir gün birine lazım olacak diye.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('GL_NEDEN', 'Neden şimdi geldiniz?', {
          score: { SORGULAMA: 10 },
          responses: [
            {
              lines: [
                named('GÜLSÜM YAŞAR', 'Ben kazandım kızım. Ama kimse o adama bir şey demedi. Hâlâ geziyor, hâlâ yazıyor. Benim evimi ateşle değil, kalemle yaktı.'),
                named('GÜLSÜM YAŞAR', 'Halil Bey’in kızının elinde bir kâğıt gördüm, o adamın adı yazıyordu. Kalbim durdu. Allah bir kere daha göstermiş, dedim.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('GL_TANIK', 'Mahkemede anlatır mısınız?', {
          score: { SORGULAMA: 20 },
          responses: [
            {
              lines: [
                named('GÜLSÜM YAŞAR', 'Anlatırım. Ama ben ne bilirim? Kararı okusunlar. Kâğıt benden iyi konuşur.'),
                th('Haklı. Bir hakem heyetinin kararı, bir dulun gözyaşından daha az etkileyici ama daha çok ağırlıklıdır. Mahkemeler ağırlığa bakar.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('GL_BITIR', 'Teşekkür et', {
          responses: [{ lines: [n('Gülsüm Hanım giderken Zehra’nın elini tuttu. “Baban çıkacak” dedi. Bir dilekti; bir tahmin değil.')] }],
          next: HUB,
        }),
      ],
    }),
    toHub(
      sceneSearch('ARA_SAADET', {
        ...INV2,
        title: 'Kalem Sokak 7 · Saadet Hanım',
        hud: ['taps_saadet'],
        exposeCounts: true,
        background: 'ev',
        onFirstEnter: [{ type: 'MEET', character: 'saadet' }],
        lines: [
          {
            lines: [
              card('KALEM SOKAK 7 — 17 NİSAN, 16.20', 'ev'),
              s('saadet', 'Gel kızım. Mahkemede beni kızdırdın ama haklıydın. Cevdet’miş o adam. Utandım.'),
              s('saadet', 'Televizyonu mu soruyorsun? Atmadım. Torunum “tamir olur babaanne” dedi, arkaya koydu. Bak bakalım.'),
              th('Bir televizyonun ölümü. Kimsenin bakmadığı bir şey. Bakalım.'),
            ],
          },
        ],
        scene: 'sc_saadet',
        instruction: 'Odada dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
        costVar: 'taps_saadet',
        miss: fallback('FB_SAADET', 'TAP', {
          score: { ARASTIRMA: -10 },
          feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
        }),
        finish: { id: 'SAADET2_BITIR', label: 'Teşekkür et ve çık' },
      }),
    ),
    toHub(
      conversation('ARA_CEVDET', {
        ...INV2,
        title: 'Bekçi kulübesi',
        background: 'sokak_karanlik',
        room: { label: 'MURADİYE · BEKÇİ KULÜBESİ', character: 'cevdet' },
        lines: [
          {
            when: flag('fact_teneke_saadet'),
            lines: [
              card('MURADİYE MEYDANI — 18 NİSAN, 21.00', 'sokak_karanlik'),
              s('cevdet', 'Avukat hanım. Mahkemeden davetiye geldi. Amirime söyledim. Kızdı, sonra “git, doğruyu söyle” dedi.'),
              th('Saadet Hanım “şık bir adam, iki teneke” demişti. Bir komşunun yan cümlesi. Şimdi bunu, kapıda duran adama soracağım; cevabı ona bırakarak.'),
            ],
          },
          {
            lines: [
              card('MURADİYE MEYDANI — 18 NİSAN, 21.00', 'sokak_karanlik'),
              s('cevdet', 'Avukat hanım. Mahkemeden davetiye geldi. Amirime söyledim. Kızdı, sonra “git, doğruyu söyle” dedi.'),
              n('Termostan iki bardak çay doldurdu; birini bana uzattı. Bu sefer defteri göğsüne bastırmadı.'),
            ],
          },
        ],
        choices: [
          option('CV2_CANTA', 'O sabah eksperin elinde ne vardı? Gördüğünüz kadarını anlatın.', {
            discovers: 'clue_teneke',
            score: { SORGULAMA: 60 },
            responses: [
              {
                lines: [
                  s('cevdet', 'Omzunda bir spor çanta. Kapıda açtı, iki teneke çıkardı. Boya tenekesi gibi, bir litrelik.'),
                  s('cevdet', 'Bir şey dikkatimi çekti ama… önemli mi bilmem. Tenekeleri çantadan çıkarırken ağırdı. Boş teneke öyle tutulmaz.'),
                  me('İçeride ne yaptı, gördünüz mü?'),
                  s('cevdet', 'Görmedim. Kapıdaydım. Kürek sesi geldi, tahta sürükleme sesi. Kırk beş dakika. Çıkınca tenekelerin kapakları kapalıydı.'),
                  th('Ağır tenekeler. Kürek sesi. Görmediğini görmediğini söyledi. İyi bir tanık, gördüğünün sınırını bilen tanıktır.'),
                ],
              },
            ],
            next: '$stay',
          }),
          option('CV2_AMIR', 'Mahkemede yalnızca defterinizi ve gördüğünüzü anlatın. Ne söyleyeceğinizi ben söylemem.', {
            score: { SORGULAMA: 30 },
            effects: [raise('cevdet_hazir')],
            good: 'Doğru sınır: tanığa ne söyleyeceği söylenmez; yalnızca kendi algısını anlatması gerektiği hatırlatılır.',
            responses: [
              {
                lines: [
                  s('cevdet', 'Defter ne diyorsa. Gözüm ne gördüyse. O kadar. Başka türlüsünü bilmem zaten.'),
                ],
              },
            ],
            next: '$stay',
          }),
          rawChoice('CONTINUE', 'CV2_BITIR', 'Teşekkür et ve çık', { role: 'BACK', next: '$return' }),
        ],
      }),
    ),
    toHub(
      conversation('ARA_HALIL', {
        ...INV2,
        title: 'Halil',
        background: 'gorus_odasi',
        room: { label: 'HALİL BOZKURT', character: 'halil' },
        lines: [
          {
            when: flag('halil_tahliye'),
            lines: [
              card('YILDIRIM, ESKİ SANAYİ — BOZKURT DÖŞEME', 'depo'),
              n('Halil atölyedeydi. Otel sandalyelerinin otuz üçüncüsünü kaplıyordu; bıraktığı yerden, otuz ikinciden sonra.'),
              s('halil', 'Otel bekledi. Kırk sandalye. İnsanlar bazen bekler, avukat hanım. Şaşırdım.'),
              n('Çeyiz sandığı köşedeydi, örtüsü açık. Üstünde bir çay bardağı yoktu; kimse üstüne bir şey koymuyordu.'),
            ],
          },
          {
            lines: [
              card('BURSA H TİPİ CEZAEVİ — GÖRÜŞ ODASI', 'gorus_odasi'),
              n('Halil bu sefer bir koğuş arkadaşının ceketini getirmişti; yırtığını dikmiş. “Bitti” dedi, “sahibine vereceğim.”'),
              s('halil', 'Duruşmada bilirkişi “yanılmış olabilirim” dedi. Ben ilk defa birinin yanıldığını söylediğine sevindim.'),
            ],
          },
        ],
        choices: [
          option('HL_GERCEK', 'Size bilirkişinin numunelerinin nereden geldiğini anlatayım.', {
            score: { SAVUNMA_STRATEJISI: 30 },
            responses: [
              {
                lines: [
                  me('Numuneleri şirketin eksperi getirmiş. Olay yeri muhafaza altındayken, tek başına girmiş. Zemini o açmış.'),
                  s('halil', 'Nermin’in evine… biri sabah girip… ', 'kizgin'),
                  n('Cümlesini bitirmedi. Elindeki iğneyi kumaşa batırdı, çekti, bir daha batırdı. Ellerinin titremesi iğneye geçmedi.'),
                  s('halil', 'Ben ona kızmayacağım, avukat hanım. Kızarsam benim yaptığım bir şey olur. Siz söyleyin hâkime. Ben dikeyim.', 'uzgun'),
                ],
              },
            ],
            next: '$stay',
          }),
          option('HL_EK', 'Hâkim size dikkatsizlik sorabilir. Elektrikçiyi ve takvimi, olduğu gibi anlatın; fazlasını değil.', {
            score: { SAVUNMA_STRATEJISI: 40 },
            effects: [raise('halil_ek_hazir')],
            good: 'Doğru hazırlık: müvekkile hakkını ve sürecin olası yönünü (CMK 226 ek savunma) anlatmak, ne söyleyeceğini ezberletmeden doğruyu söylemesini istemek.',
            responses: [
              {
                lines: [
                  s('halil', 'Dikkatsizlik mi? Yani evi yakmadım ama yanmasına göz mü yumdum?'),
                  me('Öyle sorabilirler. Siz ne yaptıysanız onu söyleyin. Usta ne dedi, siz ne yaptınız.'),
                  s('halil', 'Usta “ağır yük çekme” dedi. Çekmedim. Restorasyona koydum. Son hafta evde de değildim. Bu kadar.'),
                  th('Bu kadar. Halil’in en sevdiği iki kelime. Mahkemede de en işe yarayanlar.'),
                ],
              },
            ],
            next: '$stay',
          }),
          option('HL_ZEHRA', 'Zehra’yla konuştunuz mu? Borcu?', {
            effects: [inc('trust', 3)],
            responses: [
              {
                when: any(flag('mektup'), flag('zehra_sor')),
                lines: [
                  s('halil', 'Konuştuk. Her şeyi anlattım. Kızdı. Sonra annesinin mektuplarından birini okudu bana. Nermin bana kızdığı bir mektup.', 'mutlu'),
                  s('halil', '“Kendini germe” diyor. Otuz yıl önce yazmış. Kızım “annem senin huyunu biliyormuş” dedi. Güldük. İlk defa.'),
                ],
              },
              {
                lines: [
                  s('halil', 'Konuşamadım. Ağzım varmıyor. Duruşmada savcı söyledi zaten; kızım orada duydu.', 'uzgun'),
                  th('Bir babanın borcunu kızına bir savcı söyledi. Bazı yaralar mahkemede açılır; mahkemede kapanmaz.'),
                ],
              },
            ],
            next: '$stay',
          }),
          rawChoice('CONTINUE', 'HL_BITIR', 'Görüşmeyi bitir', { role: 'BACK', next: '$return' }),
        ],
      }),
    ),
    choiceNode('ARA_SUC', {
      ...INV2,
      title: 'Eksper',
      background: 'buro_gece',
      lines: [
        {
          lines: [
            n('Masamda bir kartvizit, bir devriye çizelgesi, iki fotoğraf. Hepsi aynı adama çıkıyor.'),
            th('Bir avukatın işi müvekkilini savunmaktır; suçluyu yakalamak değil. Ama bir suçu gördüğünde ne yapacağı da mesleğinin bir parçası.'),
          ],
        },
      ],
      prompt: 'Eksper hakkında ne yapacaksın?',
      choices: [
        option('SC_DUYURU', 'Savcılığa yazılı suç duyurusu: delil uydurarak iftira ve delillerle oynama şüphesi', {
          score: { USUL_BILGISI: 100 },
          effects: [raise('suc_duyurusu'), inc('legal_hits')],
          good: 'Doğru yol. Şüpheli bir delil uydurma (TCK 267/2) ve delilleri değiştirme (TCK 281) için yetkili merci Cumhuriyet savcılığıdır (CMK 158). Delil toplamak, el koymak ve şüpheliyi dinlemek savcılığın işidir; avukat kovalamaz, bildirir.',
          responses: [
            {
              lines: [
                n('Dilekçe dört sayfa oldu. Çizelge, iki fotoğraf, bilirkişinin tutanaktaki sözü, tahkim kararı varsa onun örneği.'),
                th('Gönder tuşuna bastım. Bir avukat bazen en büyük hamlesini, bir dosyayı başkasına teslim ederek yapar.'),
              ],
            },
          ],
          next: HUB,
        }),
        option('SC_KENDIN', 'Eksperin bürosuna git ve onunla yüzleş', {
          score: { USUL_BILGISI: -60 },
          effects: [raise('eksper_uyarildi')],
          bad: 'Şüpheliyi kendin sorgulamaya ya da sıkıştırmaya kalkmak, onu uyarır ve delilleri yok etmesine fırsat verir; avukatın işi değildir. Yetkili merci savcılıktır (CMK 158).',
          responses: [
            {
              lines: [
                card('SÖNMEZ EKSPERTİZ — NİLÜFER, 17.40', 'buro'),
                s('tarik', 'Av. Arslan. Ne hoş bir sürpriz. Çay? Kahve? Bir suçlama?'),
                me('O sabah olay yerinde ne yaptığınızı biliyorum.'),
                s('tarik', 'Ben de sizin ne bildiğinizi sandığınızı biliyorum. Mahkemede görüşürüz. Şimdi izninizle; arabamı yıkatmam lazım.'),
                th('Arabasını yıkatacakmış. Neden bunu söylediğini, kapıdan çıktıktan sonra anladım.'),
              ],
            },
          ],
          next: HUB,
        }),
        option('SC_BASIN', 'Bir gazeteci tanıdığa bilgi ver; kamuoyu baskısı işe yarar', {
          score: { USUL_BILGISI: -40 },
          effects: [raise('basin')],
          bad: 'Devam eden bir yargılamada bir tanığı basın yoluyla suçlamak hem yargılamayı etkilemeye hem de meslek kurallarına aykırılığa varabilir; delil, kamuoyunda değil savcılıkta işe yarar.',
          responses: [
            {
              lines: [
                n('Ertesi gün yerel bir sitede küçük bir haber: “Yanık evde eksper şüphesi.” Altında üç yorum, ikisi küfür.'),
                th('Bir haber bir delil değildir. Bir gürültüdür. Gürültüde en iyi saklanan, en sessiz olandır.'),
              ],
            },
          ],
          next: HUB,
        }),
        back('SC_GERI', 'Sonra karar veririm'),
      ],
    }),
    toHub(deductionBoard('ARA_CIKARIM', {
      ...INV2,
      title: 'Çıkarım Tahtası · Ara',
      background: 'buro_gece',
      lines: [{ lines: [n('Yeni kartlar eskilerin yanında. İki ipucunu birleştir; yanlış çift puan götürür.')] }],
      pool: [
        'clue_piroliz',
        'clue_teneke',
        'clue_ayni',
        'clue_prim',
        'clue_tv',
        'clue_notr',
        'clue_ark',
        'clue_buat',
        'clue_taze',
        'clue_numune',
        'clue_eksper_giris',
        'clue_yan_ev',
        'clue_borc',
      ],
      recipes: [
        fresh(
          'CB2_EKILMIS',
          'clue_piroliz',
          'clue_teneke',
          'ded_ekilmis',
          'Tenekeler önceden doluydu',
          'Numunede yanmış ahşabın izi yok, benzin neredeyse taze; bekçiye göre tenekeler içeri girerken ağırmış. Numune olay yerinden alınmamış; olay yerine getirilmiş.',
        ),
        fresh(
          'CB2_NOTR',
          'clue_notr',
          'clue_tv',
          'ded_notr',
          '02.08 aşırı gerilim',
          'Dağıtım kaydında 02.08 nötr kopması; Saadet Hanım’ın televizyonu yangından önce “pat” dedi. O gece sokağa dışarıdan bir gerilim geldi.',
        ),
        fresh(
          'CB2_ELEKTRIK',
          'clue_ark',
          'clue_buat',
          'ded_elektrik',
          'Yangının sebebi elektrik',
          'Koridor linyesinde birincil ark boncuğu; aynı buatta eriyik bakır. Yangın koridor hattında, elektrikle başladı.',
        ),
        fresh(
          'CB2_KOPYA',
          'clue_ayni',
          'clue_prim',
          'ded_kopya',
          'Eksperin kalıbı',
          'Aynı paragraf iki ayrı yangında; her reddedilen dosyaya bir prim. Rapor bir gözlem değil, bir kalıp.',
        ),
      ],
      miss: fallback('FB_CIKARIM2', 'COMBINE', {
        repeat: 'ONCE_PER_PARAMS',
        score: { DELIL_ANALIZI: -50 },
        feedback: {
          title: 'Bu ikisi birbirini açıklamıyor',
          text: 'Yan yana duruyorlar ama aynı cümleyi kurmuyorlar. Başka bir çift dene.',
          label: 'BAĞLANTI YOK · −50 SKOR',
          tone: 'error',
        },
      }),
      finish: { id: 'CIKARIM2_BITIR' },
    })),
    story('ARA_LEYLA', {
      ...INV2,
      title: 'Leyla’ya danış',
      background: 'buro',
      lines: [
        {
          when: all(flag('onur_red'), not(flag('mutalaa'))),
          lines: [
            n('Leyla kapımın eşiğinde durdu. Zehra’nın nişanlısının teklifini duymuştu; bu büroda duvarlar ince.'),
            s('leyla', 'Hayır demişsin. İlk anda. İyi. Bu meslekte bazı soruların cevabı baştan verilmiştir; sen de baştan verdin.'),
            s('leyla', 'Şimdi işine dön. Onların raporunu kendi raporlarıyla yık; bizimkini yazmadan.'),
          ],
        },
        {
          when: flag('onur_dusun'),
          lines: [
            n('Leyla kapımı kapattı. Ne zaman kapımı kapatsa, söyleyeceği şey koridora sığmazdı.'),
            s('leyla', 'Zehra’nın nişanlısının teklifini duydum. “Düşüneyim” demişsin. Neyi düşüneceksin, Deniz?'),
            s('leyla', 'Bu meslekte bazı sorular düşünülmez. Cevapları baştan verilmiştir. Bir hayır, geç kalınca hayır olmaktan çıkar.'),
          ],
        },
        {
          when: all(has('ev_tahkim'), not(has('ded_kopya'))),
          lines: [
            n('Leyla tahkim kararının ekini okudu, sonra bizim dosyadaki raporu yanına koydu. Gözlüğünü çıkarmadı; çıkarmasına gerek yoktu.'),
            s('leyla', 'İki raporu yan yana okudun mu? Kelime kelime? İnsanlar yalan söylerken yaratıcı olmaz, Deniz. Kendilerini tekrar ederler.'),
          ],
        },
        {
          when: all(any(has('ev_lab'), has('clue_teneke')), not(has('ded_ekilmis'))),
          lines: [
            n('Leyla kromatogramın çıktısını ışığa tuttu; sanki bir röntgen filmi.'),
            s('leyla', 'Laboratuvar sana ne bulduğunu söyler. Bulmadığını da söyler; sen sorarsan. Yanmış bir zeminden ne bulmayı beklersin? O yok mu?'),
          ],
        },
        {
          when: not(flag('suc_duyurusu')),
          lines: [
            n('Leyla pencerenin önünde, kollarını kavuşturmuş duruyordu.'),
            s('leyla', 'Eksper hakkında ne yapacaksın? Ona kızgınsın; görüyorum. Kızgın avukat kovalar. İyi avukat bildirir.'),
            s('leyla', 'Savcılığın yapabileceği bir şeyi sen yapmaya kalkarsan, adam arabasını yıkatır ve sen elinde fotoğraflarla kalırsın.'),
          ],
        },
        {
          lines: [
            n('Leyla dosyamı kapattı ve bana döndü.'),
            s('leyla', 'Hâkim ikinci celsede bir şey soracak, Deniz. “Kasıt yoksa, dikkatsizlik var mı?” O soruya hazır ol. Elektrikçinin notu iki yöne keser; öteki yönü sen kapat.'),
            s('leyla', 'Ve unutma: ortaklık senin adının kapıya yazılması değil. Bir dosyanın bütün ağırlığını tek başına taşıyabilmek.'),
          ],
        },
      ],
      choices: [back('LEYLA2_BITIR', 'Teşekkür et')],
    }),
    story('ARA_KAPI', {
      ...INV2,
      title: 'Kapıdaki adam',
      background: 'sokak_yagmur',
      lines: [
        {
          lines: [
            card('4 MAYIS · PAZAR 22.50 — ARSLAN HUKUK, KAPI', 'sokak_yagmur'),
            n('Büroyu kilitlerken sokak lambasının altında bir şemsiye gördüm. Altında kusursuz bir takım, kusursuz bir sabır.'),
            s('tarik', 'Av. Arslan. Rahatsız etmeyeyim; iki cümle. Yarın kürsüdeyim, biliyorsunuz.'),
            s('tarik', 'Bazen yangın sadece yangındır. Eski bir ev, eski bir adam, eski bir borç. Siz bir hikâye kurdunuz; güzel bir hikâye. Ama hikâyeler yanar.'),
            s('tarik', 'Benim yirmi yılım var. Sizin dört. Yarın kimin sözünün daha ağır olduğunu hâkim tartacak. İyi geceler.'),
            n('Şemsiyesini düzeltti ve yağmurun içine yürüdü. Ayakkabılarının sesi yine düzenli, acelesiz.'),
            th('Bir tehdit mi? Hayır. Bir tehdidin bütün kibarlığıyla bir uyarı. Belki de bir korku: korkmayan adam gece yarısı bir avukatın kapısına gelmez.'),
          ],
        },
      ],
      choices: [
        option('KP_BILDIR', 'Konuşmayı saatiyle not et ve sabah savcılığa ve mahkemeye bildir', {
          score: { USUL_BILGISI: 40 },
          effects: [raise('tehdit_bildirildi')],
          good: 'Doğru: dinlenecek bir tanığın duruşma öncesi karşı tarafın avukatına yaklaşması kayda geçirilir ve yetkili mercie bildirilir.',
          responses: [{ lines: [th('Not defterime yazdım: 22.50, kapı, iki cümle. Sabah yedide savcılığa bir dilekçe. Kızgınlığımı da yazdım; ama ayrı bir kâğıda.')] }],
          next: 'ARA_SON_1',
        }),
        option('KP_TEHDIT', 'Arkasından seslen: “Yarın kürsüde kaçacak yerin olmayacak.”', {
          score: { SAVUNMA_STRATEJISI: -30 },
          effects: [raise('deniz_tehdit')],
          bad: 'Dinlenecek bir tanığa duruşma öncesi gözdağı vermek, ertesi gün katılan vekilinin elinde savunmaya karşı bir koz olur.',
          responses: [
            {
              lines: [
                n('Tarık durdu, yarım döndü, gülümsedi. “Kayda geçti, avukat hanım” dedi. Telefonunu cebine koydu.'),
                th('Kayda geçti. Benim cümlem. Onun telefonunda.'),
              ],
            },
          ],
          next: 'ARA_SON_1',
        }),
        option('KP_GIT', 'Hiçbir şey söyleme; kapıyı kilitle ve eve git', {
          responses: [{ lines: [th('Bir şey söylemedim. Bazen en iyi cevap, ertesi sabah kürsüde verilendir.')] }],
          next: 'ARA_SON_1',
        }),
      ],
    }),
    decisionNode('ARA_SON_1', [{ to: 'ARA_SON_2' }], {
      ...INV2,
      title: 'Duruşmadan önceki gece',
      lines: [
        {
          when: has('ded_ekilmis'),
          lines: [
            card('4 MAYIS · 23.40 — EV', 'buro_gece'),
            th('Tenekeler içeri dolu girdi. Laboratuvar yangını değil, tenekeleri ölçtü. Yarın bunu ona, kendi tenekesiyle soracağım.'),
          ],
        },
        {
          lines: [
            card('4 MAYIS · 23.40 — EV', 'buro_gece'),
            th('Bir eksper, bir sabah, kırk beş dakika. Ne yaptığını tam bilmiyorum. Bildiğim, ne yapmadığı: hiçbir zemini kimse önünde açmadı.'),
          ],
        },
      ],
    }),
    decisionNode('ARA_SON_2', [{ to: 'T_00K' }], {
      ...INV2,
      lines: [
        {
          when: has('ded_notr'),
          lines: [th('02.08. Bir sokak, bir nötr teli, bir televizyon. Yangın bir kibritle değil, bir telin kopmasıyla başladı. Yarın bunu bir elektrik kaydıyla söyleyeceğim.')],
        },
        {
          when: has('ded_onlem'),
          lines: [th('Hâkim dikkatsizliği soracak. Elektrikçi, takvim, sözleşme. Halil uyarıyı duymuş ve takvime koymuş. Yarın bu cümle bir kalkan olacak.')],
        },
        {
          lines: [th('Yarın hâkim “kasıt yoksa dikkatsizlik var mı” diye soracak. Cevabım henüz ince. İnce bir kumaş gibi; gerilince yırtılabilir.')],
        },
      ],
    }),
  ],
  triggers: [
    {
      id: 'tg_ara_day',
      scope: HUB,
      priority: 1,
      when: { all: [cmp(v('ap2'), '<=', 0), cmp(v('day2'), '<', 2)] },
      goto: 'ARA_DAY_END',
    },
  ],
  discoveryPaths: teslim.discoveryPaths,
};

