import {
  all,
  any,
  cmp,
  conversation,
  cont,
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
  not,
  option,
  raise,
  rawChoice,
  recipe,
  row,
  sceneSearch,
  score,
  set,
  story,
  tool,
  v,
  chosen,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef } from '../../../tools/content/src/kit/index.js';
import { B, O, W, retarget } from './dsl.js';
import { INV_POOL, firstTime, invRecipes } from './investigation-1.js';
import { ARA, ARA_AP, ARA_DAYS } from './shared.js';

// 65-ara: 1. ve 2. celse arası (3 gün × 2 EP; yığınsız). Nihai rapor ve mahkemenin müzekkere cevapları gelir; Sevim
// Yavuz ve defter, Tarık'ın gözü (eski tip kilit), araç takip ve zimmet, emanet fotoğrafları, kolluk amiri, suç
// duyurusu, yüzleşme tuzağı, tahta, Leyla.

const HUB = 'ARA_HUB';

const act = (id: string, label: string, to: string, opts: Partial<ChoiceDef> = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { cost: [{ var: 'ara_ap', amount: 1 }], next: to, maxUses: 1, ...opts });
const free = (id: string, label: string, to: string, opts: Partial<ChoiceDef> = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { next: to, ...opts });
const toHub = (id: string, label = 'Büroya dön') => cont(id, label, HUB, { role: 'BACK' });

const giris = deliver('ARA_GIRIS_1', [
  { evidence: 'ev_atk' },
  {
    evidence: 'ev_gps',
    requires: flag('talep_gps'),
    hint: 'İlk celsede servis aracının araç takip ve zimmet kaydını iste.',
  },
  {
    evidence: 'ev_abone',
    requires: flag('talep_abone'),
    hint: 'İlk celsede 23.41’de aranan hattın abone bilgisini iste.',
  },
  { evidence: 'ev_kantin', requires: flag('talep_kantin'), hint: 'Kantin kaydını iste.' },
]);
const gunSonu = deliver('ARA_DAY_END', [
  { evidence: 'ev_gps', requires: flag('ek_gps'), hint: 'Ara evresinde ek talep dilekçesiyle araç kaydını iste.' },
  {
    evidence: 'ev_abone',
    requires: flag('ek_abone'),
    hint: 'Ara evresinde ek talep dilekçesiyle abone bilgisini iste.',
  },
]);
const son = deliver('ARA_SON_1', [
  { evidence: 'ev_gps', requires: flag('ek_gps'), hint: 'Ara evresinde ek talep dilekçesiyle araç kaydını iste.' },
  {
    evidence: 'ev_abone',
    requires: flag('ek_abone'),
    hint: 'Ara evresinde ek talep dilekçesiyle abone bilgisini iste.',
  },
]);

const feedbackNew = (title: string, text: string) => ({
  title,
  text,
  label: 'YENİ DELİL · +300 SKOR',
  tone: 'success' as const,
});

// --- Giriş ---

const girisNodes = [
  decisionNode('ARA_GIRIS_1', [{ to: 'ARA_GIRIS_2' }], {
    ...ARA,
    title: 'Ara',
    onEnter: [set('in_court', false), set('ara_day', 1), set('ara_ap', ARA_AP), ...giris.effects],
    lines: B(`
# ON GÜN SONRA · PERŞEMBE 18.40 — ARSLAN HUKUK [bg:buro_gece]
> Mahkemenin müzekkerelerine cevaplar birer birer geldi. Kurumlar mahkemeye geç kalmayı sevmez; avukata geç kalmayı sever.
`),
  }),
  decisionNode('ARA_GIRIS_2', [{ to: 'ARA_GIRIS' }], {
    lines: [
      W(
        flag('released'),
        `> Tarık on gündür evdeydi. Haftada iki gün karakola imzaya gidiyor, kalan günlerde balkonda oturup denize bakıyormuş. Gülay söyledi: “Konuşmuyor. Ama uyuyor.”`,
      ),
      O(`> Tarık hâlâ içerideydi. Gülay her akşam arıyordu; ben her akşam aynı şeyi söylüyordum: “Cevaplar geliyor.”`),
    ],
  }),
  story('ARA_GIRIS', {
    ...ARA,
    title: 'Cevaplar',
    background: 'buro_gece',
    lines: [
      W(
        has('ev_abone'),
        `
> Leyla odama girdi. Elinde iki zarf ve kalın, mavi kapaklı bir rapor. Raporu masaya bıraktı; zarflardan birini bırakmadı.
leyla: Adli Tıp’ın nihai raporu geldi. Okursun. Önce şu.
> BTK’nın cevabı. Tek sayfa. Bir numara, bir isim.
leyla: 23.41’de Ercan’ın aradığı hat. Abonesi Kenan Aksoy.
> Sandalyeye oturdum. Kalktım. Pencereye yürüdüm.
~ “Kptn.” Rehberde dört harf. Kavgayı ayıran adam. Kürsüde babacan bir sesle “sabaha kadar ofisteydim” diyen adam.
~ Ercan kavgadan otuz yedi dakika sonra onu aramıştı. İki dakika yedi saniye. Kenan bu aramadan hiç söz etmemişti; ne kolluğa, ne mahkemeye.
leyla: Şimdi dikkatli dinle. Bir arama bir cinayet değildir. Bir yalan bile cinayet değildir. Ama bir soru işaretidir; o soru işaretini sen kovalamayacaksın.
leyla: Bulduğunu yaz. Savcıya yaz. Kenan’ın kapısına gitme, telefonunu açma, liman kapısında bekleme. Biz kolluk değiliz Deniz. Bunu bir kere söylüyorum.
> Leyla gitti. Odada mavi kapaklı rapor, tek sayfalık bir cevap ve ben kaldık.
~ Mahkemede Kenan’ın elini Tarık’ın omzuna koyuşunu hatırladım. Bir babanın eli. Bir bez parçası, avucunda sıkılan.
~ Bir an, yalnızca bir an, ondan değil kendimden şüphelendim. Bir isim bulmak kolay. Bir ismi doğru kâğıda bağlamak zor.
> Raporu açtım. Ekinde bir şema: kafatasının kesiti, kırığın profili. Yuvarlak bir çukur, basamaklı kenarlar. Bir şeyin şekli.
`,
      ),
      O(`
> Leyla odama girdi. Elinde kalın, mavi kapaklı bir rapor.
leyla: Adli Tıp’ın nihai raporu. Ekinde bir şema var: kırığın kesiti. Birine göster; ama doğru kişiye.
leyla: İkinci celsede raporu yazan uzman kürsüye çıkacak. Raporun söylemediğini o da söylemez; ancak sorulursa söyler.
leyla: Ve unutma: bir şey bulursan, ve o şey birini gösterirse, peşinden koşma. Yaz. Savcıya yaz. Biz kolluk değiliz.
`),
    ],
    choices: [cont('ARA_GIRIS_DEVAM', 'Panoyu yeniden kur', HUB, { role: 'PRIMARY' })],
  }),
];

// --- Hub ---

const hubTabs = [
  {
    id: 't2_insanlar',
    label: 'İNSANLAR',
    kind: 'PEOPLE' as const,
    choices: [
      act('A_SEVIM', 'Sevim Yavuz', 'ARA_SEVIM_G', { description: 'Maktulün eşi · Mudanya, Halitpaşa' }),
      act('A_TARIK', 'Tarık', 'ARA_TARIK_G', { description: 'Nihai rapordaki şema' }),
      act('A_NURTEN', 'Bşk. Nurten Aydemir', 'ARA_NURTEN', {
        description: 'Cinayet Büro · dosyayı kapatan amir',
        visibleWhen: any(has('ev_gps'), has('ev_abone'), has('ded_tasima')),
      }),
      act('A_KENAN', 'Kenan Aksoy’la yüzleş', 'ARA_KENAN', {
        description: 'Liman · vardiya ofisi',
        visibleWhen: any(has('ev_abone'), has('ev_gps')),
      }),
    ],
  },
  {
    id: 't2_emanet',
    label: 'EMANET',
    kind: 'SCENE' as const,
    choices: [
      act('A_EMANET', 'Emanet fotoğrafları', 'ARA_EMANET', { description: 'Adliye emanet bürosu · kâtip huzurunda' }),
    ],
  },
  {
    id: 't2_arsiv',
    label: 'ARŞİV',
    kind: 'ARCHIVE' as const,
    choices: [
      act('A_KAYIT', 'Araç takip ve zimmet kaydı', 'ARA_KAYIT', {
        description: 'İşletmenin cevabı',
        visibleWhen: has('ev_gps'),
      }),
      act('A_DEFTER', 'Ercan’ın defteri', 'ARA_DEFTER', {
        description: 'Kareli, yağ lekeli',
        visibleWhen: has('ev_defter'),
      }),
      act('A_TALEP', 'Ek delil talebi', 'ARA_TALEP', {
        description: 'Mahkemeye yazılı talep',
        visibleWhen: any(
          all(has('clue_servis_arac'), not(flag('talep_gps'))),
          all(has('clue_arama2341'), not(flag('talep_abone'))),
        ),
      }),
      free('A_SUC', 'Savcılığa suç duyurusu', 'ARA_SUC', {
        description: '0 EP · yazılı, ekleriyle',
        maxUses: 1,
        visibleWhen: any(has('ev_abone'), has('ev_gps')),
      }),
      free('A_CIKARIM', 'Çıkarım tahtası', 'ARA_CIKARIM', { description: '0 EP · yeni ipuçlarını birleştir' }),
      free('A_LEYLA', 'Leyla’ya danış', 'ARA_LEYLA', {
        description: '0 EP · günde bir kez',
        visibleWhen: cmp(v('leyla_ara'), '<', v('ara_day')),
        effects: [set('leyla_ara', v('ara_day'))],
      }),
    ],
  },
];

const hub = {
  id: HUB,
  type: 'INVESTIGATION' as const,
  ...ARA,
  title: 'Ara',
  background: 'buro' as const,
  hud: ['ara_day', 'ara_ap'],
  lines: [
    W(
      cmp(v('ara_day'), '==', 1),
      `
# ARA · GÜN 1/3 · İKİNCİ CELSEYE 10 GÜN
> Hedef: rapor ne diyor? Ercan’ın son iki dakikası kimeydi ve neden?
~ Tarık on gündür ya evde ya içeride; Gülay her akşam arıyor. Sevim Yavuz duruşma salonunda Kenan’a bakıyordu. Bunu unutmadım.
~ Panoya yeni bir kâğıt iğneledim: “23.41.” Altına üç soru: Kim? Neden? Sonra ne oldu?
`,
    ),
    W(
      cmp(v('ara_day'), '==', 2),
      `
# ARA · GÜN 2/3 · İKİNCİ CELSEYE 7 GÜN
> Hedef: kâğıtlar ve fotoğraflar. Bir alet, bir araç, bir defter.
~ Sabah adliyenin emanet bürosunu aradım; kâtip “salı on” dedi. Bir delile bakmak bile randevulu. Dokunmak ise hiç yok.
`,
    ),
    O(`
# ARA · GÜN 3/3 · İKİNCİ CELSEYE 4 GÜN
> Hedef: son hazırlık. Bulduğun neyse doğru yere götür: mahkemeye, savcılığa. Başka yere değil.
`),
  ],
  tabs: hubTabs.map((t) => ({ id: t.id, label: t.label, kind: t.kind, choices: t.choices.map((c) => c.id) })),
  choices: [
    ...hubTabs.flatMap((t) => t.choices),
    rawChoice('NAVIGATE', 'GO_T2', 'DURUŞMAYA GİT · 2. CELSE', {
      role: 'PRIMARY',
      confirm: 'Duruşmaya gidersen ara biter. Emin misin?',
      next: 'ARA_SON_1',
    }),
  ],
};

// --- Sevim Yavuz ---

const sevimGiris = decisionNode('ARA_SEVIM_G', [{ to: 'ARA_SEVIM' }], {
  ...ARA,
  title: 'Sevim Yavuz',
  lines: B(`
# CUMARTESİ 10.30 — MUDANYA, HALİTPAŞA [bg:sokak_yagmur]
> Yokuşun ortasında iki katlı, sıvası dökük bir ev. Bahçede ıslak çamaşırlar; kimse toplamamış. Kapının üstünde siyah bir kurdele.
> Kapıyı aralık açtı. Zincir takılıydı. Siyah bir hırka, kızarmış gözler, bir elinde kapının kenarı.
sevim/kizgin: Ne istiyorsunuz? Siz onun avukatısınız. Kocamı öldürenin. Gazetede gördüm sizi.
`),
});

const sevim = conversation('ARA_SEVIM', {
  ...ARA,
  title: 'Sevim Yavuz',
  background: 'ev',
  room: { label: 'HALİTPAŞA · KAPI ARALIĞI', character: 'sevim' },
  choices: [
    option('SV_TAZIYE', '“Başınız sağ olsun. Kapıyı kapatabilirsiniz; hakkınız.”', {
      visibleWhen: not(chosen('SV_ISRAR')),
      score: { SORGULAMA: 30 },
      effects: [raise('sevim_acti')],
      responses: B(`
- Başınız sağ olsun, Sevim Hanım. Ben Tarık’ın avukatıyım; benimle konuşmak zorunda değilsiniz. Kapıyı kapatabilirsiniz.
> Kapı kapanmadı. Bir süre ikimiz de zincirin iki yanında durduk.
sevim/uzgun: Kimse “başınız sağ olsun” demedi bana. Polis bile. Savcı “taraf mısınız” dedi. Taraf mıyım? Kocam öldü.
> Zinciri çıkardı. Kapıyı açmadı; yalnızca aralığı biraz genişletti.
sevim: Mahkemede o adama baktım. Kenan Bey’e. Herkes çocuğa bakarken ben ona baktım. Ercan ona “Kaptan” derdi, bilir misiniz? Eskiden römorkör kaptanıymış.
~ “Kaptan.” Rehberde dört harf: “Kptn.” Bir lakap, bir dulun ağzından.
sevim: O gece dokuz buçukta aradı beni. Sesi neşeliydi; içmişti ama neşeliydi. “Bu gece bir işi bitireceğim Sevim, yarın sana bir şey alacağım” dedi.
sevim/uzgun: Ne alacaktın Ercan? Ne bitirecektin? Gece yarısı aradım, açmadı. Sabaha karşı yine aradım. Sabah polis geldi.
`),
    }),
    option('SV_ISRAR', '“Konuşmanız lazım. Yoksa sizi tanık olarak çağırırım.”', {
      visibleWhen: not(chosen('SV_TAZIYE')),
      score: { SORGULAMA: -40 },
      effects: [raise('sevim_kapandi')],
      bad: 'Yas tutan bir mağdur yakınını tehditle konuşturmaya çalıştın; kapı kapandı. Tanık çağırmak mahkemenin işidir, bir baskı aracı değil.',
      category: 'SORGULAMA',
      responses: B(`
sevim/kizgin: Çağırın! Çağırın da gelip kocamın katilinin avukatına bir de mahkemede mi yardım edeyim?
> Kapı kapandı. Zincirin şıkırtısı, sonra bir sürgü sesi. {shake}
~ Kapıyı ben kapattım. Onun eliyle.
`),
    }),
    option('SV_HAFTA', '“Ercan son haftalarda bir şeyden söz etti mi?”', {
      visibleWhen: flag('sevim_acti'),
      score: { SORGULAMA: 40 },
      effects: [raise('sevim_defter')],
      responses: B(`
sevim: Son haftalarda… Bir rahatlık vardı üstünde. “Yakında rahatlayacağız Sevim” dedi. “Kaptan bize borçlu.” Ne borcu dedim, güldü.
sevim: Bir defteri vardı. Kareli. Gece yüklemelerinde bir şeyler yazardı. Buzdolabının üstünde saklardı, ben görmeyeyim diye; ben boyum yetmez sanardı.
sevim/uzgun: Ölmeden üç gün önce “Kaptan’la konuşacağım, ya ödeyecek ya anlatacağım” dedi. Ben de “karışma” dedim. Karışmasaydı…
> Sustu. Kapının kenarını tutan eli beyazlamıştı.
sevim: Defter hâlâ orada. Polis eve hiç girmedi. Çocuğu yakaladılar, dosyayı kapattılar.
`),
    }),
    option('SV_TUTANAK', '“Defteri birlikte, tutanakla mahkemeye sunalım. Bir kopyası sizde kalsın.”', {
      visibleWhen: all(flag('sevim_defter'), not(chosen('SV_AL'))),
      discovers: 'ev_defter',
      score: { USUL_BILGISI: 60 },
      effects: [raise('defter_usul')],
      good: 'Delili tutanakla teslim alıp mahkemeye sunmak, zincirin kopmamasını ve ileride “avukat getirdi” itirazının önünü keser (CMK 206, 217).',
      category: 'USUL_BILGISI',
      responses: B(`
- Defteri ben almayayım, Sevim Hanım; birlikte bir tutanak yazalım, sayfa sayısıyla. Mahkemeye dilekçeyle sunarım; aslı mahkemede, kopyası sizde.
> İçeri girdi. Bir süre sonra kareli, köşeleri yağlanmış bir defterle döndü. Tutanağı imzaladı; elleri titremiyordu artık.
sevim: Bunu o çocuk için yapmıyorum. Ercan için yapıyorum. Ercan saymayı severdi. Yanlış sayılmak istemezdi.
`),
    }),
    option('SV_AL', '“Defteri bana verin, ben bakarım.”', {
      visibleWhen: all(flag('sevim_defter'), not(chosen('SV_TUTANAK'))),
      discovers: 'ev_defter',
      score: { USUL_BILGISI: -20 },
      neutral:
        'Defteri tutanaksız aldın; ileride savcı defterin nereden geldiğini sorgulayabilir. Teslimi belgelemek gerekirdi.',
      responses: B(`
> İçeri girdi, defterle döndü, uzattı. Aldım. Bir tutanak, bir imza, bir sayfa sayısı yok.
sevim: Kaybetmeyin. Ercan’ın tek bıraktığı şey bu.
`),
    }),
    toHub('SV_BITIR', 'Teşekkür et ve ayrıl'),
  ],
});

// --- Tarık ---

const tarikGiris = decisionNode('ARA_TARIK_G', [{ to: 'ARA_TARIK' }], {
  ...ARA,
  title: 'Tarık',
  onFirstEnter: [inc('trust', 4)],
  lines: [
    W(
      flag('released'),
      `
# PAZAR 16.00 — GÜZELYALI [bg:ev]
> Balkonda iki tabure, bir küllük, denize bakan bir korkuluk. Tarık bir taburede, Elif dizinde. Elif bir gemi çiziyordu; babası yelkenleri tutuyordu.
tarik: Elif, abla geldi. İçeri git, annene yardım et.
> Elif gitmeden önce resmi bana uzattı. Bir gemi, iki çöp adam. Bu kez ikisinin de elinde bir şey yoktu.
tarik: On gündür uyuyorum abla. İçeride uyuyamazdım; burada uyuyorum. Ama her sabah kalkınca ellerime bakıyorum.
tarik: Gülay diyor ki “bitti.” Bitmedi biliyorum. Ama Elif’in odasındaki haritada iğne artık evde. Onu oynatmasın diye bantladım.
`,
    ),
    O(`
# PAZARTESİ 14.00 — CEZAEVİ, AVUKAT GÖRÜŞ ODASI [bg:gorus_odasi]
> Cevdet kapıyı açtı. “Hâlâ resme bakıyor” dedi, başka bir şey demedi.
> Tarık daha zayıftı. Ama gözleri bu kez masada değil, bendeydi.
tarik: Gülay söyledi, Kenan abi geçen celsede “belki yanıldım” demiş. Ben de ona kızmadım abla. İnsan yanılır.
`),
  ],
});

const tarik = conversation('ARA_TARIK', {
  ...ARA,
  title: 'Tarık',
  background: 'ev',
  room: { label: 'TARIK', character: 'tarik' },
  choices: [
    option('TR_SEMA', 'Nihai rapordaki kırık şemasını göster', {
      discovers: 'clue_tarik_koni',
      score: { SORGULAMA: 60 },
      responses: B(`
> Raporun ekindeki şemayı açtım: kafatasının kesiti, kırığın profili. Yuvarlak bir çukur, ortası derin, kenarları basamaklı.
> Tarık şemaya baktı. Önce anlamadı. Sonra parmağını kırığın profiline koydu; yavaşça, bir şeyi ölçer gibi.
tarik/saskin: Bu… bunu bilirim abla. Bu kilit konisi. Twistlock’un altındaki koni. Ama bizimkiler değil.
tarik: Bizim dört numaradakiler yeni tip, sarı, ince konili. Bu eski tip. Manuel olan. Kalın konili, üç santim küsur.
tarik: Eski tipler rıhtımdan kalktı, iki yıl oldu. Ağabeyimden sonra. Bir tek servis kitlerinde kaldı; acil durum için, kamyonetlerde.
~ Bir laşing işçisinin gözü. Bir otopsi şemasında bir kilidin konisini görmek için dört yüz kilit takıp sökmüş olmak gerekiyordu.
`),
    }),
    option('TR_SONSOZ', '“Son sözünde ne söyleyeceğini düşündün mü?”', {
      score: { SAVUNMA_STRATEJISI: 20 },
      effects: [raise('sonsoz_hazir')],
      responses: B(`
tarik: Düşündüm. Çok düşündüm. Ne diyeyim abla? “Ben yapmadım” mı? Bir şey yaptım ama.
- Ne yaptıysan onu söyle. Ne yapmadıysan onu. Kısa.
tarik: Kısa… Tamam. Ben laf bilmem zaten. Kısa söylerim.
`),
    }),
    option('TR_GECE', '“Gece yüklemeleri hakkında bildiğin bir şey var mı?”', {
      visibleWhen: any(has('ev_abone'), has('ev_defter')),
      score: { SORGULAMA: 30 },
      effects: [raise('fact_gece_yukleme')],
      responses: B(`
tarik: Gece yüklemeleri… Bazen bir kamyon gelir, iki üç kutu ekletirler. Kâğıdı sonradan yazılır derler. Biz bağlarız, karışmayız.
tarik: Ercan sayardı. Puantör. Saydığını yazardı. Bir keresinde Kenan abiyle bağrıştıklarını duydum, “eksik sayma” diyordu Kenan abi.
- Bunu ilk kez mi söylüyorsun?
tarik/uzgun: Kimse sormadı abla. Bir de… Kenan abi bana iş verdi. Ağabeyim ölünce. İnsan iş verene laf söylemez.
~ Bir borç. Müvekkilim bile bir borcun altında. Bu limanda herkes birine borçlu.
`),
    }),
    toHub('TR_BITIR', 'Vedalaş'),
  ],
});

// --- Belgeler ---

const kayit = retarget(
  documentExam('ARA_KAYIT', {
    ...ARA,
    title: 'Araç takip ve zimmet kaydı',
    hud: ['kayit_left'],
    background: 'buro',
    lines: B(`
> İşletmenin filo takip sisteminin dökümü ve zimmet defterinin fotokopisi. Kapak yazısında “mahkemenizin ara kararı üzerine.”
~ Bir kamyonetin hafızası. Kim kullandığını bilmez; nerede durduğunu bilir.
> Kâğıdın altına liman işletmesinin hukuk müşaviri bir not düşmüş: “Araç, gece vardiyasında vardiya amirliğinin kullanımındadır.” Bir cümle; kimin olduğunu söylemeyen, söylemekten kaçınan.
`),
    header: { left: 'FİLO TAKİP · 16 LMN 07 / ZİMMET DEFTERİ', right: '14–15.11' },
    columns: [
      { label: 'SAAT', flex: 1 },
      { label: 'KAYIT', flex: 2.4 },
      { label: 'NOT', flex: 1.2 },
    ],
    rows: [
      row('a1', ['23.49', 'Araç kapısı · giriş', 'hız 12 km/s']),
      row('a2', ['23.52–00.06', 'Konum: B sahası, 3. sıra · durdu', 'motor çalışır']),
      row('a3', ['00.14', 'Araç kapısı · çıkış', 'hız 18 km/s']),
      row('z1', ['14.11 · 22.00', 'Zimmet: 16 LMN 07 · teslim alan', 'K. AKSOY (imza)']),
      row('z2', ['15.11 · 06.00', 'Zimmet: teslim', 'kit: eksiksiz (?)']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Karşılaştır', 'compare')],
    costVar: 'kayit_left',
    rules: [
      examine('EX_A2', 'mag', 'a2', {
        discovers: 'clue_gps',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU',
          text: '23.52’den 00.06’ya kadar on dört dakika B sahasında, 3. sırada. Motor çalışır hâlde. Ceset 3. sıranın iki konteynerinin arasında bulundu.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_Z1', 'compare', 'z1', {
        discovers: 'clue_zimmet',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU',
          text: 'Kamyonet 14 Kasım 22.00’de zimmetle teslim alınmış. İmza: K. Aksoy. Sabaha kadar başka teslim yok.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
    ],
    miss: fallback('FB_KAYIT', 'EXAMINE', {
      score: { DELIL_ANALIZI: -20 },
      feedback: {
        title: 'SONUÇ YOK',
        text: 'Bu satırda bu aletle dikkat çeken bir şey yok.',
        label: '−20 SKOR',
        tone: 'error',
      },
    }),
    finish: { id: 'KAYIT_BITIR' },
  }),
  HUB,
);

const defter = retarget(
  documentExam('ARA_DEFTER', {
    ...ARA,
    title: 'Ercan’ın defteri',
    hud: ['defter_left'],
    background: 'buro_gece',
    lines: B(`
> Kareli bir defter. Sayfaların çoğu iş: tarih, gemi, sayı. Arada bir doğum günü, bir borç, bir telefon numarası. Yanına o geceki geminin manifestosunu koydum.
`),
    header: { left: 'E. YAVUZ · DEFTER / MANİFESTO', right: 'KASIM' },
    columns: [
      { label: 'TARİH', flex: 0.8 },
      { label: 'NOT', flex: 2.6 },
    ],
    rows: [
      row('d1', ['03.11', 'Sevim doğum günü · pasta!']),
      row('d2', ['11.11', 'MSKU 447120-3 · MSKU 447121-9 · TGHU 883011-5 · “K.” · yarın konuşulacak']),
      row('d3', ['11.11 · manifesto', 'MV Karadeniz Yıldızı · 412 konteyner (liste ekte)']),
      row('d4', ['13.11', 'K. bana 3 kutu borçlu. Ya öder ya anlatırım.']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('compare', 'Karşılaştır', 'compare')],
    costVar: 'defter_left',
    rules: [
      examine('EX_D4', 'mag', 'd4', {
        discovers: 'clue_defter_satir',
        score: { DELIL_ANALIZI: 100 },
        feedback: {
          title: 'YENİ İPUCU',
          text: '“K. bana 3 kutu borçlu. Ya öder ya anlatırım.” Ölümünden bir gün önce. Kalemle, bastırarak yazılmış.',
          label: '+100 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_D2', 'compare', 'd3', {
        discovers: 'clue_manifesto',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU',
          text: 'Defterdeki üç konteyner numarasını manifestoyla karşılaştırdım: dört yüz on iki satırda hiçbiri yok. Gemiye girmiş ama kâğıda girmemiş üç kutu.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
    ],
    miss: fallback('FB_DEFTER', 'EXAMINE', {
      score: { DELIL_ANALIZI: -20 },
      feedback: { title: 'SONUÇ YOK', text: 'Bu satırda bu aletle bir şey çıkmadı.', label: '−20 SKOR', tone: 'error' },
    }),
    finish: { id: 'DEFTER_BITIR', label: 'Defteri kapat' },
  }),
  HUB,
);

const emanet = retarget(
  sceneSearch('ARA_EMANET', {
    ...ARA,
    title: 'Emanet fotoğrafları',
    hud: ['taps4'],
    exposeCounts: true,
    scene: 'sc_emanet',
    background: 'adliye',
    instruction: 'Fotoğraflarda şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
    costVar: 'taps4',
    lines: B(`
# SALI 10.00 — ADLİYE, EMANET BÜROSU [bg:adliye]
> Bodrum katta, demir raflar arasında bir masa. Kâtip emanet defterini açtı, poşetleri tek tek çıkarıp fotoğraf çekmeme izin verdi. Dokunmak yok.
~ Delile dokunmam. Bakarım. Avukatın eli delilin değil, dosyanın üstündedir.
> Kâtip genç bir adamdı; her poşeti çıkarırken numarasını yüksek sesle okudu, deftere işaret koydu. “Usul” dedi gülümseyerek, “usul olmazsa her şey kaybolur.”
~ Usul olmazsa her şey kaybolur. Bir limanda bir kilit kaybolur; bir emanet bürosunda kaybolmaz. Fark, bir defterdir.
`),
    miss: fallback('FB_EMANET', 'TAP', {
      score: { ARASTIRMA: -10 },
      feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
    }),
    finish: { id: 'EMANET_BITIR' },
  }),
  HUB,
);

// --- Kolluk amiri ---

const nurten = conversation('ARA_NURTEN', {
  ...ARA,
  title: 'Bşk. Nurten Aydemir',
  background: 'karakol',
  room: { label: 'CİNAYET BÜRO · ÇAY OCAĞI', character: 'nurten' },
  lines: B(`
# ÇARŞAMBA 08.30 — BURSA EMNİYET, CİNAYET BÜRO [bg:karakol]
> Çay ocağında, ayakta. Amir Aydemir ağzındaki yakılmamış sigarayı parmaklarının arasında çeviriyordu.
nurten: Beş dakikam var avukat hanım. Dosyam kapandı, iddianame çıktı. Bana ne getirdiniz?
~ Yakılmamış bir sigara. Kapatılmış bir dosya. İkisinin de içinde yanmayan bir şey var.
`),
  choices: [
    option('NU_TWIST', '“Kilidi beğenmediniz, değil mi? Kan yoktu.”', {
      score: { SORGULAMA: 30 },
      effects: [raise('nurten_acti')],
      responses: B(`
> Sigarayı ağzından aldı. Uzun bir süre bana baktı.
nurten: Kan yoktu. Doku yoktu. Bir kafatası kırılır, kilit tertemiz kalır. Beğenmedim, evet. Ama bir tanık vardı, bir kavga vardı, bir parmak izi vardı.
nurten: İki günde dosya kapattım. Yukarısı memnun. Ben memnun değilim. Bunu kimseye söylemedim; size de söylemedim.
nurten: Yirmi iki yıldır cinayet bürosundayım. Bir şey öğrendim: kolay dosya yoktur. Kolay görünen dosya vardır. Kolay görünen dosya, birinin kolay görünmesini istediği dosyadır.
`),
    }),
    option('NU_KIT', '“Servis kamyonetlerinin laşing kitlerine baktınız mı?”', {
      visibleWhen: flag('nurten_acti'),
      score: { SORGULAMA: 40 },
      effects: [
        ifThen(
          not(flag('kenan_uyarildi')),
          [discover('clue_envanter'), score('ARASTIRMA', 60)],
          [raise('envanter_duzeltilmis')],
        ),
      ],
      responses: [
        W(
          not(flag('kenan_uyarildi')),
          `
nurten: Baktım. Kimse istemeden. Kamyonetteki kitte altı eski tip kilit olması gerekiyor. Beş tane var. Envanterde el yazısıyla: “15/11 kayıp.”
nurten: Ölümün ertesi sabahı bir kilit kaybolmuş. Bunu tutanağa geçirdim; kimse okumadı.
> Telefonundan bir fotoğraf gösterdi: çizgili bir form, bir satırın yanında mavi tükenmez.
nurten: Bunu bana değil, savcıya götürün. Benden duyduğunuzu söylemeyin; tutanak dosyada, ek klasörde. Arayan bulur.
`,
        ),
        O(`
nurten: Baktım. Kitte beş eski tip kilit var; envantere göre de beş. “10/11 kayıp” yazılmış, bir satır yukarıda, başka bir mürekkeple.
nurten: İlk baktığımda o satır yoktu diye hatırlıyorum. Ama hatırlamak delil değil avukat hanım. Biri sizden önce davranmış.
~ “Sizden önce.” Ya da benim yüzümden. Bir tanığa yanlış zamanda bir soru sordum.
`),
      ],
    }),
    option('NU_GOZALTI', '“Kenan Aksoy’u gözaltına alın.”', {
      visibleWhen: any(has('ev_abone'), has('ev_gps')),
      score: { USUL_BILGISI: -40 },
      bad: 'Kolluk avukatın talimatıyla gözaltı yapmaz; bir suç şüphesi varsa yol Cumhuriyet Başsavcılığına yazılı suç duyurusudur (CMK 158).',
      category: 'USUL_BILGISI',
      responses: B(`
nurten/kizgin: Siz kimsiniz de bana gözaltı söylüyorsunuz? Savcılık var, hâkim var. Elinizde ne varsa oraya götürün.
nurten: Ben bir şey duymadım. Beş dakikanız doldu.
`),
    }),
    toHub('NU_BITIR', 'Teşekkür et'),
  ],
});

// --- Ek talep ---

const talep = story('ARA_TALEP', {
  ...ARA,
  title: 'Ek delil talebi',
  background: 'buro',
  lines: B(`
> İlk celsede isteyemediğim kayıtlar. Mahkeme ara kararını yazdı; ama yeni bir talep yeni bir gerekçe ister.
`),
  choices: [
    option('EK_GPS', 'Servis kamyonetinin araç takip ve zimmet kaydı', {
      visibleWhen: all(has('clue_servis_arac'), not(flag('talep_gps'))),
      score: { USUL_BILGISI: 40 },
      effects: [raise('ek_gps')],
      good: 'Geç de olsa somut ve ilgili kayıt istendi (CMK 177, 332).',
    }),
    option('EK_ABONE', '23.41 aramasının abone bilgisi', {
      visibleWhen: all(has('clue_arama2341'), not(flag('talep_abone'))),
      score: { USUL_BILGISI: 40 },
      effects: [raise('ek_abone')],
      good: 'Geç de olsa maktulün son görüşmesinin muhatabı soruldu (CMK 135/6 çerçevesinde hâkim kararı).',
    }),
    toHub('EK_GONDER', 'Dilekçeyi gönder'),
  ],
});

// --- Suç duyurusu ---

const suc = story('ARA_SUC', {
  ...ARA,
  title: 'Suç duyurusu',
  background: 'buro_gece',
  lines: B(`
> Boş bir sayfa. Üstte: “Bursa Cumhuriyet Başsavcılığına.” Altına ne yazacağım, ikinci celsenin değil, bu dosyanın sonunu belirleyecek.
~ Bir isim yazmak kolay. Bir ismin altına kâğıt koymak zor. Kâğıtsız isim iftiradır; kâğıtlı isim bir başlangıç.
`),
  choices: [
    option('SUC_A', 'Somut dayanaklı duyuru: abone kaydı, araç takip ve zimmet, B sahasındaki izler, ekleriyle', {
      next: HUB,
      score: { USUL_BILGISI: 100 },
      effects: [raise('suc_duyurusu'), inc('legal_hits')],
      good: 'Suç şüphesini somut belgelere dayanarak yetkili makama bildirdin (CMK 158). Avukat kovalamaz, yazar.',
      responses: B(`
> Dört sayfa yazdım. Her cümlenin yanında bir ek numarası. Ek-1 abone bilgisi, Ek-2 araç takip, Ek-3 zimmet, Ek-4 olay yeri fotoğrafları.
> Sabah adliyenin ön bürosunda evrak numarasını aldım. Memur damgayı vurdu, kâğıdı sepete koydu. Bir dosyanın içinde başka bir dosya başladı.
leyla: Yazdın mı? İyi. Şimdi bekle. Bekleyebilmek de bu mesleğin parçası. [phone]
`),
    }),
    option('SUC_B', 'İsim vermeden genel bir duyuru: “gerçek fail araştırılsın”', {
      next: HUB,
      score: { USUL_BILGISI: -10 },
      neutral:
        'Somut dayanağı ve şüpheliyi göstermeyen bir duyuru savcılık için bir iş yükünden ibarettir; elindeki belgeleri eklemeliydin.',
      responses: B(`
> İki paragraf yazdım. Kimseyi göstermeyen, hiçbir şeyi eklemeyen. Kâğıt ön büroda bir numara aldı ve kayboldu.
`),
    }),
    option('SUC_C', 'Basına bir açıklama: “Gerçek katil limanda”', {
      next: HUB,
      score: { USUL_BILGISI: -80 },
      effects: [inc('ethics'), dec('cred'), raise('basin')],
      bad: 'Soruşturması olmayan bir kişiyi basın önünde suçlamak hakaret ve iftira riskidir (TCK 125, 267) ve avukatlık meslek kurallarına aykırıdır (Av.K. 34); delili de karartmaya davet eder.',
      responses: B(`
> Bir muhabire iki cümle söyledim. Ertesi sabah küçük bir haber: “Avukat: Gerçek katil limanda.”
leyla: Ne yaptın sen? Bir adamı manşette suçladın, delilini de ona duyurdun. Bir daha benim büromdan basına tek cümle çıkmayacak. [phone]
`),
    }),
    toHub('SUC_VAZGEC', 'Vazgeç'),
  ],
});

// --- Yüzleşme tuzağı ---

const kenanYuz = story('ARA_KENAN', {
  ...ARA,
  title: 'Liman · vardiya ofisi',
  background: 'depo',
  lines: B(`
# LİMAN — VARDİYA OFİSİ [bg:depo]
> Prefabriğin kapısı açıktı. Kenan masasında, termosun yanında. Beni görünce gülümsedi; gözleri gülümsemedi.
kenan: Avukat hanım. Yine mi? Gel, kahve var.
~ Buraya neden geldim? Elimde bir kâğıt var. Bu kâğıdı ona göstermek mi, yoksa savcıya götürmek mi?
`),
  choices: [
    option('KY_SOR', '“Ercan 23.41’de sizi aradı. Kamyonetiniz 23.52’de B sahasındaydı.”', {
      score: { SAVUNMA_STRATEJISI: -100 },
      effects: [inc('ethics'), raise('kenan_yuzles')],
      bad: 'Tanıkla duruşma dışında yüzleştin ve elindeki delili ona gösterdin: hem tanığı etkileme riski (TCK 277) hem delilin karartılmasına davet. Doğru yol savcılığa yazılı bildirimdi (CMK 158).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
> Bez parçası durdu. Bu kez yeniden silmeye başlamadı.
kenan: Ercan beni her gece arardı kızım. Sarhoşken. Kamyonet? Kamyonetle tur atarım; yirmi yıldır.
kenan: Sen kimin avukatısın? O çocuğun. Onu savun. Başkasının kapısını çalma. Liman büyük; poyraz sert.
> Kahveyi bana uzatmadı. Kendi bardağına doldurdu ve kapıyı gösterdi.
~ Bir adamı uyardım. Bir savcıya yazmam gereken şeyi bir şüphelinin masasına bıraktım.
`),
      next: HUB,
    }),
    option('KY_VAZGEC', 'Hiçbir şey sormadan geri dön', {
      score: { SAVUNMA_STRATEJISI: 20 },
      good: 'Son anda doğru karar: delili tanığa değil, yetkili makama götürmek.',
      responses: B(`
- Yanlış zamanda geldim, Kenan Bey. Kolay gelsin.
> Kapıdan çıkarken arkamda termosun kapağının çevrildiğini duydum. Bir gıcırtı, sonra sessizlik.
~ Bir adım attım ve geri çektim. Bir eylem puanı gitti; bir dosya gitmedi.
`),
      next: HUB,
    }),
  ],
});

// --- Tahta ---

const ARA_POOL = [
  ...INV_POOL,
  'clue_koni',
  'clue_mont',
  'clue_tarik_koni',
  'clue_gps',
  'clue_zimmet',
  'clue_defter_satir',
  'clue_manifesto',
  'clue_envanter',
];

const cikarim = retarget(
  deductionBoard('ARA_CIKARIM', {
    ...ARA,
    title: 'Çıkarım tahtası',
    background: 'buro_gece',
    lines: B(`
> Panoda yeni kâğıtlar. İki ipucunu seç; birbirini tamamlıyorsa duruşmada kullanabileceğin bir DELİL doğar.
`),
    pool: ARA_POOL,
    recipes: [
      ...invRecipes('CA'),
      recipe('CA_SILAH', 'clue_koni', 'clue_desen', {
        effects: firstTime('ded_silah'),
        feedback: feedbackNew(
          'Emanetteki kilit yarayı açamaz',
          'Kırık 3,2 santim; emanetteki SA-2 kilidinin konisi 2,6. Savcılığın aleti yaranın ölçüsüne uymuyor.',
        ),
      }),
      recipe('CA_ARAC', 'clue_gps', 'clue_zimmet', {
        effects: firstTime('ded_arac'),
        feedback: feedbackNew(
          'Kamyonet ölüm saatinde B sahasında',
          '16 LMN 07, 23.52–00.06 B sahasının 3. sırasında; o gece zimmet K. Aksoy’da. Ölüm saatinde sahada duran tek araç.',
        ),
      }),
      recipe('CA_MOTIF', 'clue_defter_satir', 'clue_arama2341', {
        effects: firstTime('ded_motif'),
        feedback: feedbackNew(
          '23.41’deki konuşmanın sebebi',
          '“Ya öder ya anlatırım.” Bir gün sonra, kavgadan yarım saat sonra, iki dakikalık bir telefon.',
        ),
      }),
      recipe('CA_MOTIF2', 'clue_manifesto', 'clue_arama2341', {
        effects: firstTime('ded_motif'),
        feedback: feedbackNew(
          '23.41’deki konuşmanın sebebi',
          'Manifestoda olmayan üç kutu ve onları sayan bir puantörün son telefonu.',
        ),
      }),
      recipe('CA_EKSIK', 'clue_envanter', 'clue_tarik_koni', {
        effects: firstTime('ded_eksik'),
        feedback: feedbackNew(
          'Kitten eksik eski tip kilit',
          'Yarayı açabilecek eski tip kilitler yalnız servis kitlerinde; kamyonetin kitinden biri ölümün ertesi sabahı “kayıp” yazılmış.',
        ),
      }),
    ],
    miss: fallback('FB_ARA_CIKARIM', 'COMBINE', {
      repeat: 'ONCE_PER_PARAMS',
      score: { DELIL_ANALIZI: -50 },
      feedback: {
        title: 'Bu ikisi birbirini açıklamıyor',
        text: 'Başka bir çift dene.',
        label: 'BAĞLANTI YOK · −50 SKOR',
        tone: 'error',
      },
    }),
    finish: { id: 'ARA_CIKARIM_BITIR' },
  }),
  HUB,
);

// --- Leyla ---

const leyla = story('ARA_LEYLA', {
  ...ARA,
  title: 'Leyla',
  background: 'buro',
  lines: [
    W(
      all(cmp(v('ara_day'), '==', 1), any(has('ev_abone'), has('ded_arac')), not(flag('suc_duyurusu'))),
      `
# LEYLA’NIN ODASI [bg:buro]
leyla: Bir isim var elinde. Bir numara, belki bir araç. Ne yapacaksın?
- Savcılığa yazacağım.
leyla: Ne zaman? Bekledikçe kâğıtlar kaybolur. Kayıtlar silinir, kilitler “kayıp” olur.
leyla: Suç duyurusu herkesin hakkıdır, CMK 158. Ama avukatın duyurusu bir dilekçe değildir; bir dosyadır. Ekleri olur. İsim, saat, belge.
leyla: Ve kürsüde o adam yeniden yemin edecek. Kendisini suçlayacak bir soruya cevap vermeyebilir; CMK 48. Sustuğunda üstüne gitme. Susması da bir cevaptır.
`,
    ),
    W(
      cmp(v('ara_day'), '==', 1),
      `
# LEYLA’NIN ODASI [bg:buro]
leyla: Nihai raporu okudun mu? Dairesel çökme, sınırlı yüzeyli cisim. Uzman bunu yazdı ama ne olduğunu söylemedi.
leyla: Rapor ölüm saatini iki saatlik bir aralık veriyor. Midede ne var, ne zaman yenmiş, sor. Uzmanlar sorulmayanı söylemez.
`,
    ),
    W(
      flag('suc_duyurusu'),
      `
# LEYLA’NIN ODASI [bg:buro]
leyla: Duyuruyu yazdın. Şimdi kendi davana dön. Savcılık o adamı soruşturur; sen müvekkilini savunursun. İkisini karıştırma.
leyla: İkinci celsede savcı ne yapacak, biliyor musun? Bir savcı, kendi tanığının çöktüğünü görürse ya geri çekilir ya da yumruğa sarılır.
leyla: Yumruğa sarılırsa mahkeme suçun vasfının değişebileceğini söyler; ek savunma hakkın doğar, CMK 226. Hazır ol: “Ölüm o yumruktan gelmedi” diyebilecek kadar.
`,
    ),
    W(
      cmp(v('ara_day'), '==', 2),
      `
# LEYLA’NIN ODASI [bg:buro]
leyla: Bilirkişiyi kürsüde zorlamayacaksın. Ona soracaksın: “olabilir” mi, “uyumlu” mu? Bir bilirkişi ikisinin farkını bilir; sen de bil.
leyla: “Olabilir” bir kapıyı açık bırakır. “Uyumlu” bir kapıyı gösterir. “Uyumlu değil” bir kapıyı kapatır. Savcı birinciyle yetinir; sen üçüncüyü ararsın.
leyla: Bir de şunu unutma: bilirkişi hukuki değerlendirme yapmaz, yalnızca teknik görüş verir. “Sanık öldürdü mü” diye sorma; “bu yara bu aletle açılır mı” diye sor.
`,
    ),
    O(`
# LEYLA’NIN ODASI [bg:buro]
leyla: Esas savunmanı düşündün mü? İki tür beraat var, Deniz. Biri “suçu sanık işlemedi, bu sabit.” Öbürü “suçu sanığın işlediği sabit değil.”
leyla: Birincisi daha güçlüdür ama daha pahalıdır; gerçeği göstermeni ister. İkincisi şüpheyle yetinir; ama şüphenin iki ayağı olmalı.
leyla: Hangisini istediğini ancak elindeki kâğıt söyler. Kâğıdın taşıyamayacağı bir yükü ona yükleme; masa devrilir.
`),
  ],
  choices: [toHub('LEYLA2_DON', 'Teşekkür et')],
});

// --- Gün sonları ---

const dayEnd = decisionNode(
  'ARA_DAY_END',
  [{ when: cmp(v('ara_day'), '==', 2), to: 'ARA_AKSAM1' }, { to: 'ARA_AKSAM2' }],
  {
    ...ARA,
    title: 'Gün sonu',
    onEnter: [...gunSonu.effects, inc('ara_day', 1), set('ara_ap', ARA_AP)],
  },
);

const aksam1 = story('ARA_AKSAM1', {
  ...ARA,
  title: 'Akşam',
  background: 'buro_gece',
  lines: [
    W(
      flag('kenan_yuzles'),
      `
# GECE 23.00 — ARSLAN HUKUK [bg:buro_gece]
> Leyla kapımda durdu. Yüzünde bir şey vardı; öfke değil, öfkeden yorgun bir şey.
leyla: Limana gittin.
- Gittim.
leyla: Bir şüpheliye elindeki her şeyi gösterdin. Yarın o kâğıtların yarısı “kayıp” olacak. Bir avukat kovalamaz Deniz. Yazar. Bunu sana söylemiştim.
`,
    ),
    O(`
# GECE 23.00 — ARSLAN HUKUK [bg:buro_gece]
> Leyla gitmeden kapımda durdu. Paltosu koluna atılı.
leyla: Bugün müvekkilinden şüphelendin mi?
- Bir an. Kilit üstünde parmak izi dediklerinde.
leyla: Güzel. Hiç şüphelenmeyen avukat, müvekkilinin hikâyesini değil kendi hikâyesini savunur. Şimdi bir başkasından şüpheleniyorsan aynı kuralı ona da uygula: önce kâğıt.
`),
  ],
  choices: [
    cont('ARA_AKSAM1_DEVAM', 'Yeni gün', HUB, { role: 'PRIMARY', visibleWhen: flag('kenan_yuzles') }),
    option('AA1_A', '“Bir an. Şimdi başka birinden.”', {
      score: { SAVUNMA_STRATEJISI: 10 },
      visibleWhen: not(flag('kenan_yuzles')),
      next: HUB,
      responses: B(`
- Bir an şüphelendim. Şimdi başka birinden şüpheleniyorum.
leyla: O zaman aynı kuralı ona da uygula. Bir an şüphelen; sonra kâğıda bak. Kâğıt seni nereye götürürse oraya git; bir adım ötesine değil.
leyla: Bir de… o adam bir zamanlar senin müvekkiline iş vermiş. Bir babalık yapmış. Bunu unutma. İnsanlar tek bir şey değildir; dosyalar onları tek bir şeye indirir.
> Şemsiyesini açtı, merdivenlere yürüdü. Topuk sesleri, sonra sokak kapısı, sonra yağmur.
`),
    }),
    option('AA1_B', '“Hayır. Hiç.”', {
      visibleWhen: not(flag('kenan_yuzles')),
      next: HUB,
      responses: B(`
- Hayır. Hiç şüphelenmedim.
leyla: O zaman dikkat et. Hiç şüphelenmeyen avukat, gözlerini kapatmış demektir. Gözü kapalı avukatı ilk tökezleten de kendi müvekkilinin bir cümlesi olur.
> Kapıyı arkasından çekti. Bir süre kapalı kapıya baktım.
~ Belki haklıydı. Ama bu gece şüphelenmek istemiyordum; uyumak istiyordum. İkisini aynı anda yapamadım.
`),
    }),
  ],
});

const aksam2 = story('ARA_AKSAM2', {
  ...ARA,
  title: 'Gece',
  background: 'sokak_yagmur',
  lines: [
    W(
      flag('released'),
      `
# GECE 22.30 — GÜZELYALI SAHİLİ [bg:sokak_yagmur]
> Eve dönerken Güzelyalı’dan geçtim. Bir balkonda bir ışık. Bir adam bir taburede, denize bakıyor; dizinde uyuyan bir çocuk.
~ Tahliye bir kapıyı açar. Bir dosyayı kapatmaz. O balkon üç gün sonra boşalabilir de.
`,
    ),
    O(`
# GECE 22.30 — GÜZELYALI SAHİLİ [bg:sokak_yagmur]
> Eve dönerken Güzelyalı’dan geçtim. Bir balkonda boş bir tabure. Mutfakta bir kadın sofraya üç tabak koyuyordu; sonra birini geri kaldırdı.
~ Üç tabak, iki sandalye. Bu dosyanın bütün hesabı bu.
`),
  ],
  choices: [
    option('AA2_A', 'Balkona bakmadan geç', {
      next: HUB,
      responses: B(`
> Başımı çevirmeden geçtim. Bir avukat müvekkilinin balkonuna bakmaz; bakarsa bir şey vaat etmiş olur.
~ Yarın son gün. Elimdeki kâğıtları sayıyorum: bir rapor, bir defter, bir kamyonet, bir koni. Saydıkça çoğalıyorlar; saydıkça yetmiyorlar.
`),
    }),
    option('AA2_B', 'Durup denize bak', {
      score: { DELIL_ANALIZI: 10 },
      next: HUB,
      responses: B(`
> Arabayı sahile çektim, motoru kapattım. Deniz siyahtı; ufukta bir geminin ışıkları, Mudanya’ya doğru yavaşça kayıyordu.
~ Bir gemi. Bir çocuğun resmindeki gibi. Birinin babası o gemide, birinin değil. Ercan’ın gemileri saydığı gibi saydım: biri, ikisi, üçü.
~ Üç kutu. Bir defterde üç numara. Bir puantörün son hesabı.
`),
    }),
  ],
});

// --- Duruşmadan önceki gece ---

const sonNodes = [
  decisionNode('ARA_SON_1', [{ to: 'ARA_SON_2' }], {
    ...ARA,
    title: 'Duruşmadan önceki gece',
    onEnter: [...son.effects],
    lines: B(`
# PAZARTESİ 22.40 — ARSLAN HUKUK [bg:buro_gece]
> Panoyu ikinci kez topluyordum. İlk celseden önce bir iskeletti; şimdi bir haritaydı. Bir rıhtımdan bir iskeleye, bir iskeleden bir kamyonete.
> Kırmızı iplikler artık tek bir noktada düğümleniyordu: 23.41. Bir telefon, iki dakika, bir rehberde dört harf.
> Panonun köşesinde Elif’in gemi resmi. Altına küçük bir kâğıt iliştirdim: “Kaç kutu?” Ercan’ın sorusu. Şimdi benim sorum.
`),
  }),
  decisionNode('ARA_SON_2', [{ to: 'ARA_SON_3' }], {
    lines: [
      W(
        flag('suc_duyurusu'),
        `
> Telefon titredi. Bilinmeyen bir numara; açınca tanıdık, sert bir ses.
nurten: Avukat hanım. Savcılık bugün bir soruşturma numarası aldı. Ben görevlendirildim. Bir kamyonetin kitine el kondu. Başka bir şey söyleyemem. [phone]
nurten: Yarın duruşmada savcınız bunu bilecek. Siz de bilin. [phone]
~ Bir kâğıt bir kapıyı açmadı. Kapıyı açacak kişiye anahtarın nerede olduğunu söyledi.
`,
      ),
      W(
        flag('basin'),
        `> Gazetede küçük bir haber, benim adımla. Kenan Aksoy’un avukatı bir tekzip göndermiş; Leyla haberi masama bıraktı, bir şey söylemedi.`,
      ),
      O(
        `> Telefonum sessizdi. Elimdeki kâğıtların kimseye ulaşmadığını biliyordum; yarın yalnızca bir mahkeme salonuna ulaşacaklardı.`,
      ),
    ],
  }),
  decisionNode('ARA_SON_3B', [{ to: 'ARA_SON' }], {
    lines: [
      W(
        flag('envanter_duzeltilmis'),
        `~ “10/11 kayıp.” Başka bir mürekkep, bir satır yukarıda. Bir soruyu yanlış zamanda sordum; bir kâğıt benden önce davrandı.`,
      ),
      W(
        flag('sevim_kapandi'),
        `~ Halitpaşa’da bir kapı, bir sürgü sesi. Bir dulun kapısını ben kapattım; içeride bir defter kaldı.`,
      ),
      W(
        flag('defter_usul'),
        `~ Bir tutanak, bir imza, bir sayfa sayısı. Defter mahkemede; kimse “avukat getirdi” diyemeyecek.`,
      ),
      W(
        flag('fact_gece_yukleme'),
        `~ “Kâğıdı sonradan yazılır derler.” Gece yüklemeleri. Bir puantörün saydığı ve yazdığı her şey.`,
      ),
      O(`~ Bir defter, bir kamyonet, bir koni. Hepsini bir masaya dizdim; hepsi aynı yöne bakmıyor. Henüz.`),
    ],
  }),
  decisionNode('ARA_SON_3', [{ to: 'ARA_SON_3B' }], {
    lines: [
      W(
        has('ded_arac'),
        `~ 23.52–00.06. On dört dakika, bir kamyonet, motor çalışır hâlde. B sahasının üçüncü sırası. Bir zimmet defterinde bir imza.`,
      ),
      W(has('ded_silah'), `~ 3,2 ile 2,6. Altı milimetre. Bir savcının aletiyle bir yaranın arasındaki mesafe.`),
      W(has('ded_saat'), `~ Bir tost, bir ayran. Ercan son yemeğini 23.34’te yedi. Ölüm ondan sonra geldi.`),
      O(
        `~ Yarın bir bilirkişi “olabilir” diyecek. Benim işim, “olabilir”in ne kadar küçük bir kelime olduğunu göstermek.`,
      ),
    ],
  }),
  story('ARA_SON', {
    ...ARA,
    title: 'Duruşmadan önceki gece',
    background: 'sokak_yagmur',
    lines: B(`
> Pencereyi açtım. Yağmur dinmek üzereydi. Uludağ’ın üstünde bulutlar yırtılmış, arasından tek bir yıldız görünüyordu.
leyla: Uyu. Yarın uyanık olman gerek. Bir de: o adama bakarken öfkeyle bakma. Öfke kürsüde senin değil onun işine yarar. [phone]
> Masamda dosya, dosyanın üstünde Elif’in gemi resmi. Kapağını kapattım.
~ Yarın bir uzman yemin edecek. Bir babacan adam ikinci kez kürsüye çıkacak. Bir savcı mütalaasını okuyacak.
~ Bir yumruk ve bir ölüm. Üç ay boyunca herkes ikisini aynı cümlede söyledi. Yarın onları ayıracağım.
`),
    choices: [cont('ARA_SON_DEVAM', 'Adliyeye git', 'T_00G', { role: 'PRIMARY' })],
  }),
];

export const ara: CasePart = {
  nodes: [
    ...girisNodes,
    hub,
    sevimGiris,
    retarget(sevim, HUB),
    tarikGiris,
    retarget(tarik, HUB),
    kayit,
    defter,
    emanet,
    retarget(nurten, HUB),
    talep,
    suc,
    kenanYuz,
    cikarim,
    leyla,
    dayEnd,
    aksam1,
    aksam2,
    ...sonNodes,
  ],
  triggers: [
    {
      id: 'tg_ara_day',
      scope: HUB,
      priority: 1,
      when: all(cmp(v('ara_ap'), '<=', 0), cmp(v('ara_day'), '<', ARA_DAYS)),
      goto: 'ARA_DAY_END',
    },
  ],
  discoveryPaths: [...giris.discoveryPaths, ...gunSonu.discoveryPaths, ...son.discoveryPaths],
};
