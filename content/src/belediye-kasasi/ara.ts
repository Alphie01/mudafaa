import {
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
  flags,
  has,
  hiddenInt,
  ifThen,
  inc,
  meet,
  nav,
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
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef } from '../../../tools/content/src/kit/index.js';
import { B, O, W, retarget } from './dsl.js';
import { INV_POOL, feedbackNew, firstTime, invRecipes } from './inv-docs.js';
import { ARA, ARA_AP, ARA_DAYS } from './shared.js';

// 70-ara: 1. ve 2. celse arası (2 gün × 4 EP; yığınsız). Bilirkişi çalışıyor, müzekkere cevapları geliyor. Melek,
// Burak, Kılıçların evinde etkin pişmanlık (TCK 248) konuşması, Hayri Bey, suç duyurusu, belgeler, ön odada keşif,
// otoparkta bir teklif.

const HUB = 'ARA_HUB';

const act = (id: string, label: string, to: string, opts: Partial<ChoiceDef> & { once?: boolean } = {}): ChoiceDef => {
  const { once, ...rest } = opts;
  return rawChoice('NAVIGATE', id, label, {
    cost: [{ var: 'ara_ap', amount: 1 }],
    next: to,
    ...(once === true ? { maxUses: 1 } : {}),
    ...rest,
  });
};
const free = (id: string, label: string, to: string, opts: Partial<ChoiceDef> = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { next: to, ...opts });
const toHub = (id: string, label = 'Büroya dön') => cont(id, label, HUB, { role: 'BACK' });

const giris = deliver('ARA_GIRIS_1', [
  {
    evidence: 'ev_bilirkisi',
    requires: flag('bilirkisi_istendi'),
    hint: 'Teftiş raporuna karşı bilişim bilirkişisi iste (CMK 63).',
  },
  { evidence: 'ev_kasa', requires: flag('dil_kasa'), hint: 'Kasa odasının alarm paneli kayıtlarını iste.' },
  { evidence: 'ev_pdks_mud', requires: flag('dil_pdks'), hint: 'Müdürlük personelinin turnike kayıtlarını iste.' },
  { evidence: 'ev_ticket', requires: flag('dil_ticket'), hint: 'Bilgi işlemin şifre sıfırlama taleplerini iste.' },
]);
const gunSonu = deliver('ARA_DAY_END', [
  { evidence: 'ev_kasa', requires: flag('ara_kasa'), hint: 'Kasa odasının alarm paneli kayıtlarını iste.' },
  { evidence: 'ev_pdks_mud', requires: flag('ara_pdks'), hint: 'Müdürlük personelinin turnike kayıtlarını iste.' },
  { evidence: 'ev_ticket', requires: flag('ara_ticket'), hint: 'Bilgi işlemin şifre sıfırlama taleplerini iste.' },
  {
    evidence: 'ev_zarflar',
    requires: flag('suc_duyurusu'),
    hint: 'Somut delillerle savcılığa suç duyurusunda bulun (CMK 158).',
  },
]);
const son = deliver('ARA_SON_1', [
  { evidence: 'ev_kasa', requires: flag('ara_kasa'), hint: 'Kasa odasının alarm paneli kayıtlarını iste.' },
  { evidence: 'ev_pdks_mud', requires: flag('ara_pdks'), hint: 'Müdürlük personelinin turnike kayıtlarını iste.' },
  { evidence: 'ev_ticket', requires: flag('ara_ticket'), hint: 'Bilgi işlemin şifre sıfırlama taleplerini iste.' },
  {
    evidence: 'ev_zarflar',
    requires: flag('suc_duyurusu'),
    hint: 'Somut delillerle savcılığa suç duyurusunda bulun (CMK 158).',
  },
]);

// --- Giriş ---

const girisNodes = [
  decisionNode('ARA_GIRIS_1', [{ to: 'ARA_GIRIS_2' }], {
    ...ARA,
    title: 'Ara',
    onEnter: [set('in_court', false), set('ara_day', 1), set('ara_ap', ARA_AP), ...giris.effects],
    lines: B(`
# ÜÇ HAFTA SONRA · PAZARTESİ 18.30 — ARSLAN HUKUK [bg:buro_gece]
> Müzekkerelerin cevapları birer birer geldi. Kurumlar mahkemeye geç kalmayı sevmez; avukatlara geç kalmayı sever.
`),
  }),
  decisionNode('ARA_GIRIS_2', [{ to: 'ARA_GIRIS' }], {
    lines: [
      W(
        has('ev_bilirkisi'),
        `
> Bilirkişi raporu bir cuma öğleden sonra geldi. On dokuz sayfa, ekleriyle kırk. İlk sayfanın ilk cümlesi: “Vezne programında terminal kısıtlaması bulunmamaktadır.”
~ Bir cümle. Teftiş raporunun kırk sayfasından daha ağır.
`,
      ),
      O(`
> Bilirkişi yok. Teftiş raporu dosyada tek başına duruyor. Elimde ne varsa, onunla gideceğim.
`),
    ],
  }),
  story('ARA_GIRIS', {
    ...ARA,
    title: 'Ara',
    background: 'buro_gece',
    lines: B(`
> Leyla odama girdi. Elinde bir zarf ve bir çay; çayı bana uzattı, zarfı uzatmadı.
leyla: Melek Yavuz iki kez aradı. Mesaj bırakmadı. Bir de bilgi işlemden bir çocuk; Burak. O da mesaj bırakmadı.
leyla: İnsanlar mesaj bırakmadıklarında, söylemek istedikleri şey telefona sığmıyordur.
> Zarfı masaya bıraktı. Üstünde Nazan’ın el yazısı: “Avukat hanıma. Acil.”
leyla: Bu da Nazan Hanım’dan. Kapıya bırakmış. Okumadım; ne yazdığını tahmin ediyorum. Emlakçı.
~ Ev. Satılık. Kırk yedi makbuzun bedelini dört katlı bir apartmanın dördüncü katı ödeyecek.
leyla: Bir ay Deniz. Bu ayın her günü birisi sana bir yol gösterecek. Hangisinin kapısını açtığını bil.
`),
    choices: [cont('ARA_GIRIS_DEVAM', 'Haftaya başla', HUB, { role: 'PRIMARY' })],
  }),
];

// --- Hub ---

const hubTabs = [
  {
    id: 't_ara_kayit',
    label: 'KAYITLAR',
    kind: 'ARCHIVE' as const,
    choices: [
      act('A_KASA', 'Kasa alarm kayıtlarını incele', 'ARA_KASA', {
        once: true,
        description: 'Güvenlik firmasının cevabı',
        visibleWhen: has('ev_kasa'),
      }),
      act('A_PDKS2', 'Müdürlük turnike kayıtlarını incele', 'ARA_PDKS2', {
        once: true,
        description: 'İnsan kaynaklarının cevabı',
        visibleWhen: has('ev_pdks_mud'),
      }),
      act('A_TICKET', 'Destek taleplerini incele', 'ARA_TICKET', {
        once: true,
        description: 'Bilgi işlemin cevabı',
        visibleWhen: has('ev_ticket'),
      }),
      act('A_ZARF', 'Emanetteki zarfları incele', 'ARA_ZARF', {
        once: true,
        description: 'Savcılık emanet bürosu',
        visibleWhen: has('ev_zarflar'),
      }),
      act('A_DIL', 'Ek delil talebi', 'ARA_DIL', {
        description: 'Mahkemeye ek dilekçe · 2 talep',
        visibleWhen: not(flag('ara_dil_verildi')),
      }),
      free('A_CIKARIM', 'Çıkarım tahtası', 'ARA_CIKARIM', {
        description: '0 EP · ipuçlarını birleştir',
        enabledWhen: ref('kart2'),
        lockedReason: 'En az 2 ipucu gerekli.',
      }),
      free('A_LEYLA', 'Leyla’ya danış', 'ARA_LEYLA', {
        description: '0 EP · günde bir kez',
        visibleWhen: cmp(v('leyla_ara'), '<', v('ara_day')),
        effects: [set('leyla_ara', v('ara_day'))],
      }),
    ],
  },
  {
    id: 't_ara_insan',
    label: 'İNSANLAR',
    kind: 'PEOPLE' as const,
    choices: [
      act('A_MELEK', 'Melek’i ara', 'ARA_MELEK', {
        once: true,
        description: 'İki kez aradı, mesaj bırakmadı',
        visibleWhen: not(flag('melek_kirgin')),
      }),
      act('A_BURAK', 'Burak Şen’le buluş', 'ARA_BURAK', { once: true, description: 'Bilgi işlem teknikeri' }),
      act('A_EV', 'Kılıçlara git', 'ARA_EV_G', { once: true, description: 'Nazan’ın zarfı: emlakçı' }),
      act('A_HAYRI', 'Hayri Bey’e uğra', 'ARA_HAYRI', { once: true, description: 'Setbaşı · ayakkabı kutuları' }),
    ],
  },
  {
    id: 't_ara_yer',
    label: 'KEŞİF',
    kind: 'SCENE' as const,
    choices: [
      act('A_KESIF', 'Ön odada bilirkişiyle keşif', 'ARA_KESIF_G', {
        once: true,
        description: 'Mali Hizmetler · MHM-PC03',
        visibleWhen: has('ev_bilirkisi'),
      }),
    ],
  },
  {
    id: 't_ara_karar',
    label: 'KARAR',
    kind: 'ARCHIVE' as const,
    choices: [
      free('A_SUC', 'Savcılığa başvur', 'ARA_SUC', {
        description: '0 EP · somut dayanakla',
        visibleWhen: all(
          any(has('ded_baskasi'), flag('contra_e4'), flag('contra_e2')),
          any(has('ded_zarf'), flag('contra_e3'), flag('fact_zarf')),
          not(flag('suc_karar')),
        ),
      }),
    ],
  },
];

const hub = {
  id: HUB,
  type: 'INVESTIGATION' as const,
  ...ARA,
  title: 'Ara · bir ay',
  background: 'buro' as const,
  hud: ['ara_day', 'ara_ap'],
  lines: [
    W(
      cmp(v('ara_day'), '==', 1),
      `
# ARA · GÜN 1/2 · İKİNCİ CELSEYE 9 GÜN
> Hedef: kâğıtlar geldi. Para kasadayken kimin elindeydi? Şifre zarftayken kimin elindeydi?
`,
    ),
    O(`
# ARA · GÜN 2/2 · İKİNCİ CELSEYE 3 GÜN
> Hedef: son gün. Tanıklar, talepler, kararlar. İkinci celsede neyi, kimi, hangi sırayla?
`),
  ],
  tabs: hubTabs.map((t) => ({ id: t.id, label: t.label, kind: t.kind, choices: t.choices.map((c) => c.id) })),
  scenePreview: { scene: 'sc_onoda' },
  choices: [
    ...hubTabs.flatMap((t) => t.choices),
    nav('A_DURUSMA', 'DURUŞMAYA GİT · 2. CELSE', 'ARA_SON_1', {
      role: 'PRIMARY',
      confirm: 'Duruşmaya gidersen ara evresi biter. Emin misin?',
    }),
  ],
};

// --- İnsanlar ---

const melek = conversation('ARA_MELEK', {
  ...ARA,
  title: 'Melek Yavuz',
  background: 'kafe',
  room: { label: 'SETBAŞI · KÖŞE KAFE', character: 'melek' },
  lines: B(`
# SALI 21.40 — SETBAŞI, BİR KÖŞE KAFE [bg:kafe]
> Melek en köşedeki masayı seçmişti; sırtı duvara, yüzü kapıya. Önünde soğumuş bir salep. İlk kez sakız çiğnemiyordu.
melek: Geç kaldın canım. Yok, ben erken geldim. Kimse görmesin diye. Bu saatte belediyeden kimse buraya gelmez; herkes maç izler.
> Salebi kaşıkla karıştırdı. Karıştırdı. Bıraktı.
melek: Duruşmada Ercan Bey’i dinledim. Arka sırada oturuyordum. “Zarf, emanet, öyle bir uygulama yok” dedi. Ben o sırada çantamı sıkıyordum. Kolum uyuştu.
melek: Ben de verdim. Zarfı. Hepimiz verdik. Masamıza bir not bırakıldı, kareli kâğıda yazılmış; zarfları müdürlüğün kutusuna attık. Orhan abi, ben, Selim abi.
melek: Kim istediyse, o notu yazan biliyor. Ben adını söylemem canım. Söylersem… O adam benim mesaimi imzalıyor. Görev yerimi o yazıyor. Bir imzayla bodruma inerim.
> Bir an durdu. Sonra çantasından katlanmış bir kâğıt çıkardı, masaya koydu: bir banka kredi sözleşmesi. Araç kredisi, altmış ay.
melek: Bu da araba. Herkes konuşuyor ya. Al, oku. Annemin evini ipotek ettim. Hırsız olsam ipotek mi ederdim?
~ Korkan bir tanık. Doğruyu biliyor; ama doğrunun bir faturası var ve o faturayı o ödeyecek.
`),
  onFirstEnter: [raise('fact_araba_kredi'), raise('fact_melek_korku')],
  choices: [
    option('MK_A', '“Bunu mahkemede söylemelisiniz. İsterseniz bir avukatla da konuşun.”', {
      score: { SAVUNMA_STRATEJISI: 80 },
      effects: [raise('melek_hazir')],
      good: 'Tanığa ne söyleyeceğini söylemedin; gerçeği mahkemede anlatmasının önemini ve kendi haklarını (kendi avukatı, CMK 48 çekinme hakkı) hatırlattın (Av.K. 34).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Bunu mahkemede söylemelisiniz Melek Hanım. Ne gördüyseniz, ne yaptıysanız onu. Fazlasını değil. İsterseniz kendinize bir avukat tutun; benim müvekkilim Orhan Bey, siz değil.
- Bir de şunu bilin: sizi suçlayabilecek bir soruya cevap vermemek hakkınız. Ama yalan söylememek de yükümlülüğünüz.
melek: Hakkım… Yükümlülüğüm… Bunlar bana çok büyük kelimeler canım. Ben vezne memuruyum.
> Salebi bir dikişte içti. Soğuktu; yüzünü buruşturdu.
melek: Söylerim. Sorarlarsa söylerim. Kendim kalkıp söyleyemem ama sorarlarsa yalan söylemem. Bu kadarını yapabilirim.
~ Bu kadarı yeter. Bir tanığın en dürüst cümlesi, “bu kadarını yapabilirim”dir.
`),
      next: HUB,
    }),
    option('MK_B', '“Anlattıklarınızı yazayım; siz de imzalayın.”', {
      score: { SAVUNMA_STRATEJISI: -30 },
      bad: 'Tanıktan beyan yazdırıp imzalatmak avukatın işi değildir; tanık beyanı duruşmada doğrudan alınır (CMK 210/1). Böyle bir kâğıt tanığı korkutur ve değeri tartışmalıdır.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
> Bir kâğıt çıkardım. Melek kâğıda baktı; sonra bana.
melek: İmza mı? Canım, ben bugün bir imzadan korktuğum için buradayım. Bir imza daha mı atacağım?
> Kâğıdı itti. Çantasını aldı.
melek: Mahkemede sorarlarsa söylerim belki. Kâğıda yazmam.
~ Bir imzayla bodruma inen insanlara bir imza uzattım.
`),
      next: HUB,
    }),
    option('MK_C', '“Söylemezseniz ikimiz de yanarız.”', {
      effects: [inc('ethics'), raise('melek_kacti'), score('SAVUNMA_STRATEJISI', -60)],
      bad: 'Tanığa baskı yaptın: tanığı etkileme girişimi (TCK 277) ve meslek kurallarına aykırılık (Av.K. 34). Korkutulan tanık mahkemede susar.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Söylemezseniz ikimiz de yanarız Melek Hanım. Siz de o zarfı verdiniz.
melek/kizgin: Sen de mi? Herkes beni korkutacak mı bu dosyada? Bir o, bir sen!
> Masadan kalktı. Sandalye arkasından devrildi. Garson baktı, bakmadı. {shake}
melek: Mahkemede “hatırlamıyorum” diyeceğim. Duydun mu? Hatırlamıyorum.
~ Bir tanığı kapıya kadar getirdim ve kapıyı yüzüne kapattım. Kendi elimle.
`),
      next: HUB,
    }),
  ],
});

const burak = conversation('ARA_BURAK', {
  ...ARA,
  title: 'Burak Şen',
  background: 'kafe',
  room: { label: 'ADLİYE KARŞISI · KAFE', character: 'burak' },
  onFirstEnter: [meet('burak')],
  lines: B(`
# ÇARŞAMBA 12.30 — ADLİYE KARŞISI, BİR KAFE [bg:kafe]
> Burak Şen yirmi dokuz yaşındaydı ve yirmi dokuz yaşından küçük görünüyordu. Kapüşonlu, boynunda belediye kartının ipi, elinde bir enerji içeceği; kutuyu masaya koymadan konuştu.
burak: Abla, yani, Avukat Hanım, şey. Benim adım geçmesin. Teknik olarak ben bir şey yapmadım. Yani yaptım ama… teknik olarak.
burak: Duruşma tutanağını okudum. Müdür yardımcısı “yalnızca vezne terminalinden girilir” demiş. Öyle değil. Hiç öyle olmadı.
burak: Vezne kullanıcısı müdürlüğün bütün bilgisayarlarından girebiliyor. Kısıt yok. On bin liranın altındaki iptal ikinci onay istemiyor. Ben bunu iki yıl önce rapor ettim; kimse okumadı.
> Kutuyu nihayet bıraktı. Elleri boş kalınca ne yapacağını bilemedi; masanın kenarını tuttu.
burak: Bir de… 14 Ocak. Akşam beşi yirmi geçe dahili hattan aradılar. “Orhan Bey kilitlendi, acil sıfırlayın” dediler. Ben de… kimlik sormadım. Geçici şifreyi telefonda söyledim.
burak: Ertesi sabah Orhan abi kendisi aradı, şifrem çalışmıyor diye. Bir daha sıfırladım. “Dün de sıfırlamıştık abi” dedim; şaşırdı. O an anlamadım. Şimdi anlıyorum galiba.
`),
  choices: [
    option('BK_KIM', '“Akşam arayan kimdi?”', {
      score: { SORGULAMA: 30 },
      discovers: 'clue_burak',
      responses: [
        W(
          has('ev_ticket'),
          `
burak: Kayıtta yazıyor abla; talebi açan kullanıcı. E. TUNALI. Dahili 214. Müdür yardımcılığı.
burak: Ben sesini tanımadım; kibar biriydi, “efendim” dedi. Ama talebi kim açtıysa sistem onu yazar. Sistem yalan söylemez; biz söyleriz.
~ Bir kayıt ve bir ses. Kayıt bir isim söylüyor; ses bir nezaket.
`,
        ),
        O(`
burak: Bilmiyorum abla. Dahili hattan. Kibar biriydi, “efendim” dedi. Müdürlükte herkes “efendim” der.
burak: Ama talebi sisteme kim açtıysa kayıtta yazar. Kullanıcı adıyla, dahili numarasıyla. Mahkeme isterse çıkar.
~ Bir ses yetmez. Bir kayıt lazım. Kayıt da bir müzekkere uzaklıkta.
`),
      ],
      effects: [raise('fact_14ocak')],
    }),
    option('BK_YEDEK', '“Log kayıtları silinebilir mi?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('fact_yedek')],
      responses: B(`
burak: Sunucudaki kayıt doksan günde bir döner, yani eskisinin üstüne yazar. Teknik olarak. Ama ben her ay bir yedek alırım, ayrı diske. Kurumun diski; yani bende değil, kurumda, şeyde, kasada.
burak: Kimse bilmiyor o yedekleri. Bir ben biliyorum, bir de… artık siz.
~ Bir delilin varlığını bilen iki kişi. Birinin ağzından çıkan bir cümle, ötekinin elindeki bir yükümlülük.
`),
    }),
    option('BK_A', '“Yedeklerin korunması için mahkemeye başvuracağım. Sen dokunma.”', {
      visibleWhen: flag('fact_yedek'),
      score: { USUL_BILGISI: 80 },
      effects: [raise('log_muhafaza'), inc('legal_hits')],
      good: 'Delilin bulunduğu yerde, usulüne uygun biçimde korunmasını istedin (CMK 134, 177); zincirin dışına çıkan bir kopya değerini yitirir.',
      category: 'USUL_BILGISI',
      responses: B(`
- Yedeklere sen dokunma Burak. Mahkemeye başvurup muhafaza altına alınmasını isteyeceğim. Kopya istemiyorum; kopyayı ben alırsam, değerini ben öldürürüm.
burak: Peki. Yani… iyi. Teknik olarak en doğrusu bu. Ben de rahatlarım; bir şey olursa “ben dokunmadım” derim.
burak: Abla, bana bir şey olur mu? Şifreyi doğrulamadan sıfırladım.
- Bir ihmal. Doğruyu anlatırsan, ihmal olarak kalır. Saklarsan başka bir şeye dönüşür.
~ Aynı cümleyi Orhan’a da söyleyebilirdim. Bu dosyada herkes küçük bir kapıyı aralık bırakmış.
`),
      next: HUB,
    }),
    option('BK_B', '“Yedeği bana getir; ben saklarım.”', {
      visibleWhen: flag('fact_yedek'),
      effects: [inc('ethics'), raise('yedek_aldi'), score('USUL_BILGISI', -60)],
      bad: 'Kurumun elindeki dijital delili usul dışında teslim almak delil zincirini bozar ve delile müdahale şüphesi doğurur (Av.K. 34; CMK 134 usulü). Böyle bir kopya mahkemede değer taşımaz.',
      category: 'USUL_BILGISI',
      responses: B(`
- Yedeği bana getir Burak. Ben saklarım; kimse dokunamaz.
burak/saskin: Size mi? Kurumun diskini mi? Abla, bu… teknik olarak… bu hırsızlık olmaz mı?
> Bir an düşündü. Sonra kutusunu aldı, kalktı.
burak: Ben getirmeyeyim. Siz mahkemeden isteyin. Ben… ben gideyim.
~ Bir teknikerden bir hukuk dersi aldım. Hak ettim.
`),
      next: HUB,
    }),
    option('BK_C', 'Teşekkür et; yedeklere karışma', {
      responses: B(`
- Sağ ol Burak. Bunları mahkemede de anlatman gerekebilir.
burak: Anlatırım. Sorarlarsa. Kimse sormazsa… kimse sormazsa ben de söylemem herhalde. Hep öyle oldu.
`),
      next: HUB,
    }),
  ],
});

const evGiris = decisionNode('ARA_EV_G', [{ to: 'ARA_EV' }], {
  ...ARA,
  title: 'Kılıçların evi',
  lines: B(`
# PERŞEMBE 19.30 — YILDIRIM, DÖRDÜNCÜ KAT [bg:ev]
> Mankenin üstündeki gelinlik gitmişti; yerine bir damatlık asılmıştı. Masada bir emlakçı broşürü, köşesi kıvrılmış. Üstünde fiyat: dört kat yukarıdan bakan bir rakam.
nazan: Emlakçı geldi avukat hanım. Bir haftada satarım dedi. Açığı kapatır. Üstüne biraz kalır, kirayla otururuz.
nazan: Ercan Bey’in sözü belediyede dolaşıyor: “Öderse cezası hafifler.” Hafifler mi avukat hanım? Bana doğruyu söyleyin. Hafifler mi?
> Orhan salonun öbür ucunda, penceredeydi. Arkası dönüktü. Elif odasının kapısını aralık bırakmıştı; ışığı yanıyordu, müziği kapalıydı.
orhan: Söyleyin efendim. Ben de bilmek istiyorum. Nazan bilsin; ben ne yapacağımı biliyorum ama Nazan bilsin.
~ Bir aile bir yol arıyor. Bir yol var; kanunda yazılı. Ama o yolun ucunda ne olduğunu bilmeden kimse oraya yürümemeli.
`),
});

const ev = story('ARA_EV', {
  ...ARA,
  title: 'Etkin pişmanlık',
  background: 'ev',
  lines: B(`
~ Kanun buna etkin pişmanlık der. Zimmete geçirilen para hüküm verilmeden önce gönüllü olarak geri ödenirse, ceza üçte bir oranında indirilir. Beraat değil; indirim.
~ Kanun ödeyenden “yaptım” demesini istemez. Ama bir mahkeme salonunda, “yapmadım” diyen bir adamın açığı kapatması, birilerinin kulağına “yaptı” diye ulaşır.
~ Ve karar benim değil. Onların.
`),
  choices: [
    option('EV_A', '“Yolu açıkça anlatayım; karar sizin. Ama ödemenin ne anlama gelebileceğini de bilin.”', {
      score: { SAVUNMA_STRATEJISI: 100 },
      effects: [raise('bilgilendirdi')],
      good: 'Müvekkili bütün seçenekler ve sonuçları hakkında dürüstçe bilgilendirdin; kararı ona bıraktın. TCK 248/3: kovuşturma başladıktan sonra gönüllü iade, cezayı üçte bir indirir; beraat değildir ve ikrar şartı aranmaz.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Nazan Hanım, kanunda böyle bir yol var. Para, hüküm verilmeden önce gönüllü olarak ödenirse ceza üçte bir indirilir. Beraat değil; indirim. Dava sürer, karar yine çıkar.
- Kanun ödeyenden “yaptım” demesini istemez. Ama Orhan Bey “yapmadım” derken açığı kapatırsa, salonda bazıları bunu bir kabul gibi okuyabilir. Bunu da bilmeniz gerekiyor.
- Bir de şu var: elimizdeki kâğıtlar iptallerin Orhan Bey binadan çıktıktan sonra yapıldığını gösteriyor. Ödeme, o kâğıtların sesini kısmaz; ama değiştirmez de.
- Karar sizin. Hangisini seçerseniz seçin, ben sizin avukatınızım.
> Nazan broşüre baktı. Orhan pencereden döndü. Gözlüğünü çıkarmadı; ilk kez.
orhan: Ben ödemem efendim. Ödersem yaptım derim. Kanun demese de ben derim. Kızım der. Mahalle der.
orhan: Kırk yedi makbuz. Birini bile ben iptal etmedim. Bir zarf verdim; onun hesabını veririm. Kasanın hesabını, kasayı tutan versin.
nazan: Orhan…
orhan: Emlakçıyı ara Nazan. Teşekkür et. Ev satılık değil.
> Nazan broşürü katladı. Dikkatle, bir kumaşı katlar gibi. Sonra çöpe değil, çekmeceye koydu.
nazan/uzgun: Satılık değil. Peki. Ama bir şey olursa…
orhan: Olursa da satılık değil.
~ Bir adam bir yolu kapattı. Ben kapatmadım; o kapattı. Farkı yalnızca ikimiz biliyoruz.
`),
      next: HUB,
    }),
    option('EV_B', '“Ödeyin ve kabul edin; risk almayalım.”', {
      effects: [inc('ethics'), raise('ikrar_yolu'), score('SAVUNMA_STRATEJISI', -200)],
      bad: 'Masum olduğunu söyleyen müvekkile, işlemediği bir suçu kabul etmesini önerdin. Avukat müvekkilin aleyhine gerçeğe aykırı bir ikrar yolunu kuramaz (Av.K. 34; Avukatlık Meslek Kuralları md. 3–4). Etkin pişmanlık ikrar istemez; sen istedin.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Ödeyin Nazan Hanım. Ve Orhan Bey, mahkemede kabul edin. Ceza üçte bir iner. Kâğıtlarla uğraşırsak her şeyi kaybedebiliriz; risk almayalım.
> Orhan pencereden döndü. Yüzü kâğıt gibiydi.
orhan: Kabul mü edeyim efendim? Yapmadığım bir şeyi mi?
- Bazen en güvenli yol budur.
> Uzun bir sessizlik. Elif’in odasının ışığı söndü; kapı yavaşça kapandı.
orhan/uzgun: Siz avukatsınız. Siz bilirsiniz. Nazan, emlakçıyı ara.
~ Bir adamın on dokuz yılını bir cümleyle sattım. Daha güvenli olduğunu söyleyerek.
`),
      next: HUB,
    }),
    option('EV_C', '“Bu konuyu hiç konuşmayalım.”', {
      score: { SAVUNMA_STRATEJISI: -40 },
      bad: 'Müvekkilin hukuki seçenekleri hakkında bilgilendirilme hakkı vardır; kanuni bir yolu konuşmayı reddetmek onu karanlıkta bırakır. Karar onundur; bilgiyi vermek senin yükümlülüğün.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Bu konuyu konuşmayalım. Biz beraate gidiyoruz.
nazan/kizgin: Konuşmayalım mı? Evimi satacağım, siz konuşmayalım mı diyorsunuz?
orhan: Nazan. Avukat hanım bilir.
> Nazan broşürü masada bıraktı. Bu kez katlamadı.
~ Bir yolu göstermedim. Belki doğru yoldu, belki değildi. Ama yürümeyi onlar seçmeliydi; ben değil.
`),
      next: HUB,
    }),
  ],
});

const hayri = conversation('ARA_HAYRI', {
  ...ARA,
  title: 'Hayri Özdemir',
  background: 'ev',
  room: { label: 'SETBAŞI · HAYRİ BEY’İN SALONU', character: 'hayri' },
  lines: B(`
# PERŞEMBE 11.00 — SETBAŞI, HAYRİ ÖZDEMİR’İN EVİ [bg:ev]
> Hayri Bey bu kez kravatsızdı; hırkasının cebinde bir kurşun kalem. Masada açık bir defter: 12 Şubat’ın, kendi el yazısıyla yeniden kurulmuş saatleri.
hayri: Duruşmadan sonra eve geldim, oturdum, o günü yeniden yazdım. Tarihçi alışkanlığı. Unuttuğumu sandığım bir şey çıktı; size söylemem gerekiyor.
hayri: O akşam hırkamı unutmuştum. Bu hırkayı. Vezneye ödeme yaparken sandalyenin arkasına asmışım. Eve varınca fark ettim; geri döndüm. Saat altıya doğru.
hayri: Personel kapısından seslendim. Bekçi bırakmadı; “mesai bitti amca, yarın gel” dedi. Ama içeride bir ışık yanıyordu. Veznelerin arkasındaki odada. Buzlu camın ardında, mavi bir ışık.
hayri: Kimseyi görmedim. Bir gölge, belki. Bir şemsiye açıldığını duydum, arka kapıda. Ben yürüdüm; yağmur başlamıştı.
~ Saat altıya doğru, ön odada bir monitörün ışığı. Bir gölge, bir şemsiye. Bir isim değil; bir saat.
`),
  onFirstEnter: [raise('fact_isik')],
  choices: [
    option('HY_TANIK', '“Bunu mahkemede anlatır mısınız? Tanık olarak bildireceğim.”', {
      score: { USUL_BILGISI: 40 },
      effects: [raise('hayri_tanik')],
      good: 'Saat ve yer bildiren bağımsız bir tanığı, beyanı duruşmada doğrudan alınmak üzere bildirdin (CMK 177–178).',
      category: 'USUL_BILGISI',
      responses: B(`
hayri: Anlatırım. Gördüğümü; görmediğimi değil. Bir ışık, bir saat, bir şemsiye sesi. İsim sorarlarsa “bilmiyorum” derim. Tarihçi bilmediğini söyler; şarlatan her şeyi bilir.
~ Leyla bu adamı sevecek.
`),
      next: HUB,
    }),
    option('HY_ISIM', '“O gölge kim olabilir, bir tahmininiz var mı?”', {
      score: { SORGULAMA: -20 },
      bad: 'Tanığı tahmine yönlendirdin; görmediği bir kişiyi “tahmin” etmesi beyanını değersizleştirir.',
      category: 'SORGULAMA',
      responses: B(`
hayri: Tahmin mi? Hanımefendi, tahmin tarihin düşmanıdır. Ben size bir ışık söyledim. Siz benden bir yüz istiyorsunuz. Yüz yok.
> Defterini kapattı.
hayri: Mahkemeye çağırırsanız gelirim; ama orada da bir ışık söylerim. Yüz değil.
`),
      next: HUB,
    }),
    toHub('HAYRI2_BITIR', 'Teşekkür et, ayrıl'),
  ],
});

// --- Suç duyurusu ---

const suc = story('ARA_SUC', {
  ...ARA,
  title: 'Savcılığa başvuru',
  background: 'buro',
  lines: B(`
# BÜRO — DİLEKÇE [bg:buro]
> Leyla kapımda durdu, elinde kalem. Dilekçenin ilk satırını okudu: “Bursa Cumhuriyet Başsavcılığına.”
leyla: Kimin hakkında yazıyorsun?
leyla: Bir avukat failin peşinden koşmaz Deniz. Yazar. Elindekini, olduğu gibi. Bir isim biliyorsan delille yaz; bilmiyorsan fiili yaz. Bilmediğin bir ismi yazarsan, kendi hakkında dilekçe yazdırırsın.
`),
  choices: [
    option('SUC_A', 'Fiil hakkında: zarfları toplayan ve ön oda bilgisayarını kullananlar; ekleriyle', {
      score: { USUL_BILGISI: 100 },
      effects: [raise('suc_duyurusu'), raise('suc_karar'), inc('legal_hits')],
      good: 'Somut delillerle (talimat notu, terminal kayıtları, turnike) fiil hakkında suç duyurusunda bulundun (CMK 158). Arama ve el koyma savcılığın işidir; avukat bilgiyi yetkili mercie taşır.',
      category: 'USUL_BILGISI',
      responses: B(`
> Dilekçeyi yazdım: el yazısı not, terminal sütunu, turnike dökümü, ilk celse tutanağı. “Veznedarların şifrelerini mühürlü zarflarda toplayan ve iptallerin yapıldığı MHM-PC03’ü kullanan kişi ya da kişiler hakkında.”
> Leyla okudu. Bir kelimeyi değiştirdi: “kişi” yerine “kişi ya da kişiler.” Sonra parafını attı.
leyla: Savcı bir zarfı arayabilir. Sen arayamazsın. Bu farkı hiç unutma.
~ Ertesi sabah dilekçe Başsavcılığın gelen evrak defterine girdi. Bir numara aldı. Bir numara, bir kapıdır.
`),
      next: HUB,
    }),
    option('SUC_B', 'Melek Yavuz hakkında: yeni araba, monitördeki not', {
      score: { USUL_BILGISI: -80 },
      effects: [raise('melek_suc'), raise('suc_karar'), dec('cred')],
      bad: 'Bir arabaya ve bir not kâğıdına dayanan isnat somut delil değildir; bir kişiyi dayanaksız suçlamak iftira riskini doğurur (TCK 267) ve tanığı sana düşman eder.',
      category: 'USUL_BILGISI',
      responses: B(`
leyla: Bir araba ve bir not kâğıdı. Deniz, bu bir dedikodu. Dedikoduya dilekçe yazılmaz; yazılırsa, yazana dava açılır.
> Dilekçeyi yazdım yine de. Leyla parafını atmadı. Odasına döndü; kapısını kapatmadı ama açık da bırakmadı.
~ Bir tanığı bir dilekçeyle düşmana çevirdim. Sözüm geçmez; kâğıt geçer. Yanlış kâğıt.
`),
      next: HUB,
    }),
    option('SUC_C', '“Henüz değil.”', {
      responses: B(`
leyla: Henüz değil. Peki. Ama “henüz” bir tarih değildir. Delillerin ne zaman yeteceğine sen karar vereceksin; savcı değil.
`),
      next: HUB,
    }),
  ],
});

// --- Belgeler ---

const missDoc = (id: string) =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle bu satırda bir şey görünmüyor.',
      label: '−20 SKOR',
      tone: 'error',
    },
  });

const kasa = retarget(
  documentExam('ARA_KASA', {
    ...ARA,
    title: 'Kasa alarm kayıtları',
    hud: ['ex_kasa'],
    background: 'buro_gece',
    lines: B(`
> Güvenlik firmasının cevabı: bir ön yazı, dört sayfalık döküm ve bir ek. Ekin başlığı: “Panel kullanıcı kodları.”
~ Kasa odası her açılışta bir kod ister. Kod, bir kişiye tanımlıdır. Bir kapı, kimin açtığını unutmaz.
`),
    header: { left: 'KASA ODASI ALARM PANELİ · OLAY DÖKÜMÜ', right: 'KASIM 2025 – ŞUBAT 2026' },
    columns: [
      { label: 'TARİH', flex: 0.8 },
      { label: 'SAAT', flex: 0.8 },
      { label: 'OLAY', flex: 1.2 },
      { label: 'KOD', flex: 1.4 },
    ],
    rows: [
      row('k_sabah', ['her iş günü', '08.20–08.35', 'açılış', '03']),
      row('k_0311', ['03.11', '17.53', 'açılış · 4 dk', '02']),
      row('k_0901', ['09.01', '17.52', 'açılış · 6 dk', '02']),
      row('k_1202', ['12.02', '17.55', 'açılış · 3 dk', '02']),
      row('k_2702', ['27.02', '17.58', 'açılış · 5 dk', '02']),
      row('k_01', ['Oca–Şub', '—', 'kullanım yok', '01']),
      row('k_liste', ['EK', 'kod listesi', '01 Müdür · 02 Müdür Yrd.', '03 Vezne sorumlusu']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('log', 'İptal saatleriyle karşılaştır', 'compare')],
    costVar: 'ex_kasa',
    rules: [
      examine('EX_KASA_02', 'log', 'k_1202', {
        discovers: 'clue_kod02',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · KOD 02',
          text: '12 Şubat: makbuz 17.47’de iptal edildi; 17.55’te kasa odası açıldı, kod 02. Yirmi üç iptal gününün yirmi üçünde aynı desen: iptal, sonra 02. Ekteki listeye göre 02, müdür yardımcılığı.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_KASA_02B', 'log', 'k_0901', {
        effects: [ifThen(not(has('clue_kod02')), [discover('clue_kod02'), score('DELIL_ANALIZI', 150)])],
        feedback: {
          title: 'KOD 02',
          text: '9 Ocak: Orhan izinli. 17.46’da iki iptal, 17.52’de kasa odası açılmış: kod 02.',
          label: 'Not defterine eklendi',
          tone: 'success',
        },
      }),
      examine('EX_KASA_01', 'mag', 'k_01', {
        discovers: 'clue_kod01',
        score: { DELIL_ANALIZI: 20 },
        feedback: {
          title: 'KOD 01',
          text: 'Müdürün kodu ocak ve şubatta hiç kullanılmamış. Müdür raporluydu. “Kasa şifresini müdür bilir” diyen biri, müdürün binada olmadığını da biliyordu.',
          label: '+20 SKOR · Not defterine eklendi',
          tone: 'neutral',
        },
      }),
      examine('EX_KASA_SABAH', 'mag', 'k_sabah', {
        score: { DELIL_ANALIZI: 10 },
        feedback: {
          title: 'SABAHLAR',
          text: 'Her sabah vezne sorumlusu kasayı 03 koduyla açıyor. Akşamları 03 hiç yok. Akşamları kasayı başka biri kapatıyor.',
          label: '+10 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: missDoc('FB_KASA'),
    finish: { id: 'KASA_BITIR' },
  }),
  HUB,
);

const pdks2 = retarget(
  documentExam('ARA_PDKS2', {
    ...ARA,
    title: 'Müdürlük turnike kayıtları',
    hud: ['ex_pdks2'],
    background: 'buro',
    lines: B(`
> İnsan kaynaklarının cevabı: Mali Hizmetler personelinin iptal günlerindeki çıkış saatleri. Kurumsal bir tablo; isimler, aralıklar, bir dipnot.
`),
    header: { left: 'PDKS · MALİ HİZMETLER · İPTAL GÜNLERİ (23)', right: 'ÇIKIŞ ARALIKLARI' },
    columns: [
      { label: 'PERSONEL', flex: 1.6 },
      { label: 'ÇIKIŞ ARALIĞI', flex: 1 },
      { label: 'NOT', flex: 1.2 },
    ],
    rows: [
      row('d_orhan', ['O. Kılıç · Vezne 2', '17.02–17.09', '9 Ocak izin']),
      row('d_melek', ['M. Yavuz · Vezne 1', '17.08–17.14', '—']),
      row('d_selim', ['S. Demir · Vezne sorumlusu', '16.45–17.20', '—']),
      row('d_ercan', ['E. Tunalı · Müdür Yrd.', '18.15–18.40', '—']),
      row('d_rifat', ['R. Yener · Müdür', '—', 'Oca–Şub raporlu']),
      row('d_burak', ['B. Şen · Bilgi İşlem', 'ana bina', 'ayrı turnike']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('log', 'İptal saatleriyle karşılaştır', 'compare')],
    costVar: 'ex_pdks2',
    rules: [
      examine('EX_PDKS2_E', 'log', 'd_ercan', {
        discovers: 'clue_ercan_cikis',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · SON ÇIKAN',
          text: 'İptaller 17.38–17.56 arasında. O saatlerde müdürlükten çıkmamış tek kişi: müdür yardımcısı. İptal günlerinin hepsinde 18.15’ten sonra çıkmış.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_PDKS2_M', 'log', 'd_melek', {
        discovers: 'clue_melek_cikis',
        score: { DELIL_ANALIZI: 60 },
        feedback: {
          title: 'MELEK',
          text: 'Melek her iptal günü 17.14’ten önce çıkmış. Ön oda bilgisayarının başında o değildi.',
          label: '+60 SKOR · Not defterine eklendi',
          tone: 'success',
        },
      }),
      examine('EX_PDKS2_S', 'log', 'd_selim', {
        score: { DELIL_ANALIZI: 20 },
        feedback: {
          title: 'VEZNE SORUMLUSU',
          text: 'Selim Demir de iptallerden önce çıkmış. Onun zarfı da müdürlükteydi; ama onun kullanıcısıyla iptal yok.',
          label: '+20 SKOR',
          tone: 'neutral',
        },
      }),
      examine('EX_PDKS2_R', 'mag', 'd_rifat', {
        score: { DELIL_ANALIZI: 10 },
        feedback: {
          title: 'MÜDÜR',
          text: 'Müdür ocak ve şubatta raporlu. Kasım ve aralıkta da iptal günlerinde 16.30’da çıkmış.',
          label: '+10 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: missDoc('FB_PDKS2'),
    finish: { id: 'PDKS2_BITIR' },
  }),
  HUB,
);

const ticket = retarget(
  documentExam('ARA_TICKET', {
    ...ARA,
    title: 'Destek talepleri',
    hud: ['ex_ticket'],
    background: 'buro',
    lines: B(`
> Bilgi işlemin cevabı: Ocak ayında vezne kullanıcılarına ait şifre talepleri. Beş satır. Her satırda bir saat, bir kullanıcı adı ve talebi açanın adı.
`),
    header: { left: 'BİLGİ İŞLEM · DESTEK TALEPLERİ · VEZNE KULLANICILARI', right: 'OCAK 2026' },
    columns: [
      { label: 'ZAMAN', flex: 0.9 },
      { label: 'KULLANICI', flex: 0.7 },
      { label: 'TALEP / İŞLEM', flex: 1.6 },
      { label: 'TALEP EDEN / YAPAN', flex: 1.3 },
    ],
    rows: [
      row('tk1', [
        '14.01 17.20',
        'okilic',
        '“Kullanıcı kilitlendi, acil sıfırlayın.”',
        'Talep: E. TUNALI · dahili 214',
      ]),
      row('tk2', ['14.01 17.31', 'okilic', 'Geçici şifre verildi (telefonla)', 'İşlem: B. ŞEN']),
      row('tk3', ['15.01 08.35', 'okilic', '“Şifrem çalışmıyor.”', 'Talep: O. KILIÇ · dahili 202']),
      row('tk4', ['15.01 08.41', 'okilic', 'Sıfırlandı', 'İşlem: B. ŞEN']),
      row('tk5', ['22.01 10.05', 'myavuz', 'Şifre değişikliği (süre doldu)', 'Talep: M. YAVUZ']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('log', 'İptal kayıtlarıyla karşılaştır', 'compare')],
    costVar: 'ex_ticket',
    rules: [
      examine('EX_TK_1', 'mag', 'tk1', {
        discovers: 'clue_ticket',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · TALEP EDEN',
          text: '14 Ocak 17.20: okilic için sıfırlama talebi. Talebi açan Orhan değil. Talep eden: E. TUNALI, dahili 214. Orhan’ın kendi talebi ertesi sabah 08.35’te.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_TK_2', 'log', 'tk2', {
        score: { DELIL_ANALIZI: 60 },
        effects: [raise('fact_1744')],
        feedback: {
          title: '17.31 → 17.44',
          text: 'Geçici şifre 17.31’de telefonla verilmiş. On üç dakika sonra, 17.44’te, okilic kullanıcısıyla MHM-PC03’ten bir iptal.',
          label: '+60 SKOR',
          tone: 'success',
        },
      }),
      examine('EX_TK_5', 'mag', 'tk5', {
        score: { DELIL_ANALIZI: 10 },
        feedback: {
          title: 'MELEK',
          text: 'Melek’in şifresi süresi dolduğu için değişmiş. Sıradan bir talep.',
          label: '+10 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: missDoc('FB_TICKET'),
    finish: { id: 'TICKET_BITIR' },
  }),
  HUB,
);

const zarf = retarget(
  documentExam('ARA_ZARF', {
    ...ARA,
    title: 'Emanetteki zarflar',
    hud: ['ex_zarf'],
    background: 'buro',
    lines: B(`
# BAŞSAVCILIK — EMANET BÜROSU [bg:adliye]
> Suç duyurusundan üç gün sonra savcılık müdürlükte arama yapmış. Emanet memuru üç zarfı naylon poşetlerinde masaya dizdi. Eldiven verdi; ben eldivenle bile dokunmadım, yalnızca baktım.
> Üç zarf. Üçünün de kapağında bir mühür, bir imza, bir kullanıcı adı. Emanet tutanağı yanlarında: “Müdür yardımcılığı odası, masanın sağ alt çekmecesi, kilitli.”
`),
    header: { left: 'EMANET · ŞİFRE ZARFLARI (3)', right: 'ARAMA VE EL KOYMA TUTANAĞI EKİ' },
    columns: [
      { label: 'ZARF', flex: 0.8 },
      { label: 'MÜHÜR / İMZA', flex: 1.2 },
      { label: 'KAPAK', flex: 1.4 },
    ],
    rows: [
      row('z_okilic', ['okilic', 'mühür ve imza: O. Kılıç', 'kapalı'], {
        uv: { cells: ['okilic', 'mühür kaymış', 'üst üste iki yapıştırıcı çizgisi'], tone: 'special' },
      }),
      row('z_myavuz', ['myavuz', 'mühür ve imza: M. Yavuz', 'kapalı'], {
        uv: { cells: ['myavuz', 'mühür yerinde', 'tek yapıştırıcı çizgisi'], tone: 'neutral' },
      }),
      row('z_sdemir', ['sdemir', 'mühür ve imza: S. Demir', 'kapalı'], {
        uv: { cells: ['sdemir', 'mühür yerinde', 'tek yapıştırıcı çizgisi'], tone: 'neutral' },
      }),
      row('z_yer', ['TUTANAK', 'Müdür Yrd. odası', 'masanın sağ alt çekmecesi, kilitli']),
    ],
    tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('uv', 'UV lamba', 'uv', 'UV')],
    costVar: 'ex_zarf',
    rules: [
      examine('EX_ZARF_UV', 'uv', 'z_okilic', {
        discovers: 'clue_zarf_uv',
        score: { DELIL_ANALIZI: 150 },
        feedback: {
          title: 'YENİ İPUCU · İKİ ÇİZGİ',
          text: 'UV ışıkta okilic zarfının kapağında iki ayrı yapıştırıcı çizgisi; biri ötekinin üstünde. Mühür kaymış. Zarf en az bir kez açılıp yeniden kapatılmış.',
          label: '+150 SKOR · Not defterine eklendi',
          tone: 'special',
        },
      }),
      examine('EX_ZARF_YER', 'mag', 'z_yer', {
        score: { DELIL_ANALIZI: 40 },
        effects: [raise('fact_cekmece')],
        feedback: {
          title: 'KİLİTLİ ÇEKMECE',
          text: 'Zarflar “müdürlüğün kutusunda” değil, müdür yardımcılığı odasında, kilitli bir çekmecedeymiş. Anahtar tutanağa göre oda sahibinde.',
          label: '+40 SKOR',
          tone: 'success',
        },
      }),
      examine('EX_ZARF_M', 'uv', 'z_myavuz', {
        score: { DELIL_ANALIZI: 10 },
        feedback: {
          title: 'AÇILMAMIŞ',
          text: 'Melek’in zarfı tek çizgi; hiç açılmamış.',
          label: '+10 SKOR',
          tone: 'neutral',
        },
      }),
    ],
    miss: missDoc('FB_ZARF'),
    finish: { id: 'ZARF_BITIR' },
  }),
  HUB,
);

// --- Keşif ---

const kesifGiris = decisionNode('ARA_KESIF_G', [{ to: 'ARA_KESIF' }], {
  ...ARA,
  title: 'Keşif',
  onFirstEnter: [meet('bilirkisi')],
  lines: B(`
# ÇARŞAMBA 17.40 — MALİ HİZMETLER, ÖN ODA [bg:buro]
> Mahkemenin keşif kararıyla; başkan, kâtip, savcı, bilirkişi ve ben. Saat bilerek 17.40 seçilmişti: iptallerin saati.
> Dr. Seda Karaca kırklarının başında, kısa saçlı, sırt çantalı. Elini sıkmadı; başıyla selam verdi.
bilirkisi: Log yalan söylemez avukat hanım. Yalnızca eksik söyler. Eksiği odada ararız.
> Ön oda küçüktü. Bir masa, bir bilgisayar, bir yazıcı, bir takvim; iki kapı. Biri kasa odasına, biri müdür yardımcılığına açılıyordu. Müdür yardımcılığının kapısı kapalıydı; Ercan Tunalı izindeydi.
~ Kırk yedi akşam boyunca birisi burada oturdu. Bu sandalyede. Bu ekranın ışığında.
`),
});

const kesif = retarget(
  sceneSearch('ARA_KESIF', {
    ...ARA,
    title: 'Ön oda · keşif',
    hud: ['taps_o'],
    exposeCounts: true,
    scene: 'sc_onoda',
    background: 'buro',
    instruction: 'Odada dikkatini çeken yere dokun; bilirkişi tutanağa geçirir. Her dokunuş bir büyüteç hakkı yer.',
    costVar: 'taps_o',
    miss: fallback('FB_KESIF', 'TAP', {
      score: { ARASTIRMA: -10 },
      feedback: { text: 'Burada tutanağa geçecek bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
    }),
    finish: { id: 'KESIF_BITIR', label: 'Keşfi bitir' },
  }),
  HUB,
);

// --- Ek dilekçe ---

const slot2 = [{ var: 'slots2', amount: 1 }];

const dil = story('ARA_DIL', {
  ...ARA,
  title: 'Ek delil talebi',
  hud: ['slots2'],
  background: 'buro',
  lines: B(`
> Ek dilekçe. İki talep. Duruşmaya dokuz gün var; cevaplar ancak yetişir.
`),
  choices: [
    option('AD_KASA', 'Kasa odası alarm kayıtları', {
      visibleWhen: all(not(has('ev_kasa')), not(flag('dil_kasa'))),
      cost: slot2,
      maxUses: 1,
      score: { USUL_BILGISI: 40 },
      effects: [raise('ara_kasa')],
      good: 'Kasanın iptal akşamlarında hangi kodla açıldığı; ilgili ve elde edilebilir (CMK 177, 206).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_PDKS', 'Müdürlük personelinin turnike kayıtları', {
      visibleWhen: all(not(has('ev_pdks_mud')), not(flag('dil_pdks'))),
      cost: slot2,
      maxUses: 1,
      score: { USUL_BILGISI: 40 },
      effects: [raise('ara_pdks')],
      good: 'İptal saatlerinde binada kimin bulunduğu (CMK 177, 206).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_TICKET', 'Bilgi işlem destek talepleri', {
      visibleWhen: all(flag('fact_14ocak'), not(has('ev_ticket')), not(flag('dil_ticket'))),
      cost: slot2,
      maxUses: 1,
      score: { USUL_BILGISI: 40 },
      effects: [raise('ara_ticket')],
      good: 'Şifrenin kimin talebiyle sıfırlandığı (CMK 177, 206).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_YEDEK', 'Log yedeklerinin muhafazası ve bilirkişiye verilmesi', {
      visibleWhen: all(flag('fact_yedek'), not(flag('log_muhafaza'))),
      cost: slot2,
      maxUses: 1,
      score: { USUL_BILGISI: 40 },
      effects: [raise('log_muhafaza')],
      good: 'Silinme riski taşıyan dijital delilin usulüne uygun muhafazası (CMK 134, 177).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('AD_MELEK', 'Melek Yavuz’un araç kredisi dosyası', {
      cost: slot2,
      maxUses: 1,
      score: { USUL_BILGISI: -40 },
      bad: 'Hakkında somut bulgu olmayan bir tanığın kredi dosyası ilgisizdir (CMK 206/2-b); talep reddedilir.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    cont('AD_VER', 'Dilekçeyi ver', HUB, {
      role: 'PRIMARY',
      effects: [raise('ara_dil_verildi')],
    }),
    toHub('AD_GERI', 'Vazgeç'),
  ],
});

// --- Tahta ---

const ARA_POOL = [
  ...INV_POOL,
  'clue_kod02',
  'clue_kod01',
  'clue_ercan_cikis',
  'clue_melek_cikis',
  'clue_ticket',
  'clue_burak',
  'clue_zarf_uv',
];

const wrongPair = (title: string, text: string) => ({
  score: { DELIL_ANALIZI: -50 },
  feedback: { title, text, label: 'BAĞLANTI YOK · −50 SKOR', tone: 'error' as const },
});

const cikarim = retarget(
  deductionBoard('ARA_CIKARIM', {
    ...ARA,
    title: 'Çıkarım tahtası',
    background: 'buro_gece',
    lines: B(`
> Pano büyüdü. Yeni kâğıtlar, yeni iğneler. Kırmızı ip artık panonun kenarından taşıyor.
`),
    pool: ARA_POOL,
    recipes: [
      ...invRecipes('AB'),
      recipe('AB_KASA', 'clue_kod02', 'clue_ercan_cikis', {
        effects: firstTime('ded_kasa'),
        feedback: feedbackNew(
          'Kasa her iptal akşamı aynı kodla açıldı',
          'İptallerden dakikalar sonra kasa odası 02 koduyla açılmış; 02’nin sahibi o saatlerde binadan çıkmamış.',
        ),
        responses: B(`
~ Bir kapı, bir kod, bir turnike. Üç makine aynı saatte aynı yeri gösteriyor. Makineler kibar değildir; ama yalan da söylemezler.
`),
      }),
      recipe('AB_SIFRE', 'clue_ticket', 'clue_zarf_uv', {
        effects: firstTime('ded_sifre'),
        feedback: feedbackNew(
          'Şifreyi sıfırlatan ve zarfı açan aynı kişi',
          '14 Ocak’ta sıfırlama talebini müdür yardımcılığı açmış; Orhan’ın zarfı açılıp kapatılmış ve kilitli çekmecede durmuş.',
        ),
        responses: B(`
~ Bir şifre zarfta durur. Zarf bir çekmecede durur. Çekmece bir odada durur. Ve o odanın sahibi, bir akşam, şifrenin sıfırlanmasını ister.
`),
      }),
      recipe(
        'AB_X_KOD01',
        'clue_kod01',
        'clue_ercan_cikis',
        wrongPair('Yanlış iz', 'Müdürün kodu hiç kullanılmamış; müdür raporlu. Bu iki kart birbirini açıklamıyor.'),
      ),
      recipe(
        'AB_X_MELEK',
        'clue_melek_cikis',
        'clue_terminal',
        wrongPair('Yanlış iz', 'Melek iptallerden önce çıkmış; ön oda bilgisayarının başında o değildi.'),
      ),
      recipe(
        'AB_X_BURAK',
        'clue_burak',
        'clue_kod02',
        wrongPair('Yanlış iz', 'Burak ana binada çalışıyor; kasa odasına kodu yok. Bir ihmal bir hırsızlık değildir.'),
      ),
    ],
    miss: fallback('FB_ARA_CIKARIM', 'COMBINE', {
      repeat: 'ONCE_PER_PARAMS',
      score: { DELIL_ANALIZI: -50 },
      feedback: {
        title: 'Bu ikisi birbirini açıklamıyor',
        text: 'Başka bir ipucu dene.',
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
  title: 'Leyla’ya danış',
  background: 'buro',
  lines: [
    W(
      cmp(v('ara_day'), '==', 1),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Etkin pişmanlık. Kanun, zimmete geçirilen parayı geri verene indirim tanır: soruşturmadan önce üçte iki, kovuşturmadan önce yarı, şimdi, hükümden önce, üçte bir.
leyla: Kanun “yaptım” demeni istemez. Ama ödeyen bir adamın yanında “yapmadım” cümlesi zayıf durur. Bunu müvekkiline söylemek senin görevin; seçmek onun.
> Sigara paketini avucunda çevirdi. Bu kez durdu.
leyla: Yıllar önce bir müvekkilime “kabul et, çık” dedim. Kısa bir ceza, bir indirim, bir kapı. Kabul etti. Çıktı.
leyla: Sonra gerçek fail başka bir dosyada çıktı. O adamın sicilinde hâlâ benim tavsiyem duruyor.
~ Leyla bu hikâyeyi hiç anlatmamıştı. Anlatmasının bir sebebi var; ve o sebep, Yıldırım’da, dördüncü katta oturuyor.
leyla: Bir şey daha: biri sana bir “çözüm” teklif ederse, kim olursa olsun, kâğıda yaz. Teklifler, söylendikleri yerde kalmamalı.
`,
    ),
    O(`
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: İkinci celsede iki şey olabilir. Birincisi: tanıklardan birinin hakkında soruşturma açılmışsa, o artık yeminsiz dinlenir; kendisini suçlayacak sorulara cevap vermeyebilir.
leyla: Susarsa, susmasını zorlama. Sessizlik bir delil değildir; ama bir salon sessizliği duyar.
leyla: İkincisi: müvekkilin zarfı verdiğini söyledi. Mahkeme eylemin başka bir suç olabileceğini düşünürse sana söylemek zorundadır; nitelendirme değişikliği uyarısı. Ek savunma hakkın doğar.
leyla: O an panik yapma. “Zarf verdi, para almadı” ile “zarf verdi, zarar doğdu” aynı cümle değildir. Arasındaki farkı sen kuracaksın.
leyla: Ve esas savunmada fazla konuşma. Üç şey yeter: kim, ne zaman, kimin elinde. Gerisi gürültü.
> Bir süre sustu. Pencereye döndü; aşağıda belediye otobüsü, camında buhar, içinde uyuyan yolcular.
leyla: Bir de müvekkilin. Kürsüye bir zarfın utancıyla çıktı; ikinci celseden o utancın hesabını vererek çıkmalı. Bunu ona sen veremezsin. Ama elinden de almamalısın.
leyla: “Hatanı söyleme, kimse bilmesin” demek, bir avukatın en kolay cümlesidir. En pahalısı da odur. Faturası hep müvekkile kesilir.
~ Leyla bir tavsiye vermedi. Bir fatura gösterdi.
`),
  ],
  choices: [toHub('ARA_LEYLA_DON', 'Teşekkür et')],
});

// --- Gün sonu ---

const dayEnd = decisionNode('ARA_DAY_END', [{ to: 'ARA_OTOPARK' }], {
  ...ARA,
  title: 'Gün sonu',
  onEnter: [...gunSonu.effects, inc('ara_day', 1), set('ara_ap', ARA_AP)],
});

const otopark = story('ARA_OTOPARK', {
  ...ARA,
  title: 'Otopark',
  background: 'sokak_karanlik',
  lines: B(`
# GECE 19.50 — ADLİYE OTOPARKI [bg:sokak_karanlik]
> Adliyeden çıktığımda yağmur yeniden başlamıştı; şemsiyemi büroda unutmuştum. Otoparkın girişinde bir adam bekliyordu, siyah bir şemsiyenin altında.
ercan: Avukat hanım. Islanmayın efendim. Buyurun.
> Şemsiyeyi uzattı. Almadım; o da geri çekmedi. İkimizin arasında, havada, bir şemsiye duruyordu.
ercan: Kısa keseceğim. Bu iş uzarsa Orhan Bey yıpranır. Kızı, eşi. Ben de yıpranıyorum; kasa benim müdürlüğümde açık verdi, ben de hesap veriyorum.
ercan: Orhan Bey açığı kapatırsa, ben de ifademi düzeltirim. “İhmal olabilir” derim. Müfettiş arkadaşla da konuşurum; rapor bir ek yazıyla yumuşar. Herkes rahatlar efendim. Belediye de, siz de, Orhan Bey de.
> Şemsiyenin ucundan bir damla süzüldü, ayakkabısına düştü. Bakmadı.
ercan: Düşünün efendim. Acelesi yok. Ama duruşmaya da dokuz gün var.
~ Bir tanık, ifadesini “düzeltmeyi” teklif ediyor. Karşılığında bir para. Bir kurumun zararı, bir adamın kariyeri, bir ailenin evi. Kimin hesabı?
`),
  choices: [
    option('OT_A', 'Teklifi tutanağa geçirip savcılığa bildir', {
      score: { USUL_BILGISI: 80 },
      effects: [raise('teklif_bildirildi'), inc('legal_hits')],
      good: 'Tanığın ifadesini bir ödeme karşılığında değiştirmeyi teklif etmesi savcılığa bildirilir (CMK 158); tanıkla pazarlık edilmez.',
      category: 'USUL_BILGISI',
      responses: B(`
- Ercan Bey, bu konuşmayı yarın savcılığa yazılı olarak bildireceğim. Tanık ifadesi pazarlık konusu olmaz.
ercan: Elbette efendim. Siz bilirsiniz. Ben yalnızca yardım etmek istemiştim.
> Şemsiyeyi kapattı. Yağmurun altında, kibar, ıslak, başını hafifçe eğdi. Arabasına yürüdü.
~ Sabah ilk iş, iki sayfalık bir dilekçe: saat, yer, cümleler. Leyla okudu, parafını attı, bir şey söylemedi. Söylemesine gerek yoktu.
`),
      next: HUB,
    }),
    option('OT_B', 'Teklifi müvekkile ilet', {
      effects: [inc('ethics'), raise('teklif_iletildi'), score('USUL_BILGISI', -60)],
      bad: 'Tanığın ödeme karşılığı ifade değiştirme teklifini müvekkile taşımak, tanıkla pazarlığa aracılıktır (Av.K. 34; TCK 277 riski). Bildirilmesi gereken yer savcılıktır.',
      category: 'USUL_BILGISI',
      responses: B(`
> Orhan’ı aradım. Teklifi anlattım. Telefonun öbür ucunda uzun bir sessizlik.
orhan: Ercan Bey mi dedi efendim? İfadesini mi düzeltecek? [phone]
orhan: Ben ödemem. Ödersem yaptım derim. Siz… siz bunu bana neden söylediniz efendim? [phone]
~ Bir tanığın teklifini bir müvekkile taşıdım. Taşıdığım şey bir teklif değildi; bir yüktü.
`),
      next: HUB,
    }),
    option('OT_C', 'Reddet ve yürü', {
      neutral: 'Teklifi reddettin; ama kayda geçirmedin. Söylenen bir cümle, yazılmadıkça kimsenin işi olmaz.',
      responses: B(`
- İyi akşamlar Ercan Bey.
> Yağmurun altında yürüdüm. Arkamda şemsiyenin kapanma sesini duydum; dönüp bakmadım.
~ Reddettim. Yazmadım. Bir gün biri “bunu neden kimseye söylemediniz” diye soracak.
`),
      next: HUB,
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
# SALI 23.00 — ARSLAN HUKUK [bg:buro_gece]
> Panoyu ikinci kez topluyordum. İlk celseden önce bu bir iskeletti; şimdi bir haritaya dönmüştü. Bir vezneden bir ön odaya, bir ön odadan bir kasa kapısına.
`),
  }),
  decisionNode('ARA_SON_2', [{ to: 'ARA_SON_3' }], {
    lines: [
      W(
        flag('ikrar_yolu'),
        `
> Nazan aradı. Sesi düz; ağlamaktan sonra gelen o düzlük.
nazan: Para yatırıldı avukat hanım. Belediyenin hesabına. Ev satıldı. Orhan yarın “kabul ediyorum” diyecek. Sizin dediğiniz gibi. [phone]
nazan: Elif konuşmuyor. Babasıyla da, benimle de. [phone]
~ Yarın bir adam yapmadığı bir şeyi kabul edecek. Benim tavsiyemle.
`,
      ),
      W(
        all(has('ded_kasa'), any(has('ded_sifre'), has('clue_ticket'))),
        `~ Kasa kodu, turnike, bir sıfırlama talebi. Üç kayıt aynı kapıyı gösteriyor. Yarın o kapının önünde bir tanık oturacak; yeminli ya da yeminsiz.`,
      ),
      W(
        has('ded_kasa'),
        `~ Kasa her iptal akşamı aynı kodla açıldı; kodun sahibi binadaydı. Bu bir delil. Bir isim değil; bir kapı.`,
      ),
      O(
        `~ Kayıtların bir kısmı geldi, bir kısmı gelmedi. Yarın elimdekilerle gideceğim. Elimde olmayanlar için bir dilekçe değil, bir hüküm yazılacak.`,
      ),
    ],
  }),
  decisionNode('ARA_SON_3', [{ to: 'ARA_SON_4' }], {
    lines: [
      W(flag('melek_kacti'), `~ Melek’in devrilen sandalyesi. “Hatırlamıyorum diyeceğim.” Yarın diyecek.`),
      W(flag('melek_hazir'), `~ “Sorarlarsa yalan söylemem.” Yarın soracağım. Yalnızca soracağım.`),
      W(flag('teklif_iletildi'), `~ Orhan’ın telefondaki sesi: “Bunu bana neden söylediniz?” Bir cevabım yok.`),
      W(
        flag('teklif_bildirildi'),
        `~ Bir şemsiye, bir teklif ve iki sayfalık bir dilekçe. Savcı onu okudu mu? Yarın yüzünden anlarım.`,
      ),
      W(
        flag('suc_duyurusu'),
        `~ Dilekçem bir numara aldı; zarflar bir çekmeceden emanete taşındı. Bir avukat arama yapmaz. Yaptırır.`,
      ),
      W(
        flag('bilgilendirdi'),
        `~ “Ev satılık değil.” Nazan broşürü çöpe değil, çekmeceye koydu. Yarın o çekmece açılmasın.`,
      ),
      O(`~ Leyla’nın cümlesi: kim, ne zaman, kimin elinde. Üç soru. Yarın üç cevabım olmalı.`),
    ],
  }),
  decisionNode('ARA_SON_4', [{ to: 'ARA_SON_5' }], {
    lines: [
      W(
        all(flag('fact_tus02'), flag('fact_cuma')),
        `~ Aşınmış iki tuş: 0 ve 2. Takvimde yuvarlak içine alınmış cumalar. Bir odanın alışkanlıkları, sahibinden çok şey anlatır.`,
      ),
      W(
        flag('fact_1744'),
        `~ 17.31’de telefonda bir geçici şifre. 17.44’te bir iptal. On üç dakika. Bir çay demlenmez o sürede.`,
      ),
      W(
        flag('fact_cekmece'),
        `~ Zarflar “müdürlüğün kutusunda” değilmiş. Bir odada, kilitli bir çekmecede. Anahtarı kimdeydi? Tutanak söylüyor.`,
      ),
      W(
        flag('fact_isik'),
        `~ Hayri Bey’in hırkası. Saat altıya on kala, buzlu camın ardında mavi bir ışık. Bir tarihçinin “bilmiyorum”u, bir tanığın en dürüst cümlesi.`,
      ),
      O(
        `~ Kayıtlar bir saat söylüyor, bir kapı söylüyor. Yarın kürsüde biri bu saatlerin içinde nerede olduğunu anlatacak.`,
      ),
    ],
  }),
  decisionNode('ARA_SON_5', [{ to: 'ARA_SON' }], {
    lines: [
      W(
        not(flag('ikrar_yolu')),
        `
> Gece yarısına doğru telefon çaldı. Orhan. Bu saatte hiç aramazdı.
orhan: Kusura bakmayın efendim. Elif bir şey sordu. Akşam yemekte. “Baba, sen hırsız mısın?” dedi. Okulda biri söylemiş. [phone]
orhan: Ne diyeyim efendim? “Değilim” dedim. Ama bir şey daha dedim. “Bir hata yaptım” dedim. “Şifremi verdim. Vermemeliydim.” [phone]
orhan: Elif bir süre sustu. Sonra “o zaman yarın onu söyle” dedi. “Hatayı söyle, hırsızlığı değil.” On yedi yaşında. [phone]
- Elif haklı Orhan Bey.
orhan: Biliyorum efendim. Annesine çekmiş. [phone]
~ Bir kız babasına bir avukatın söyleyemediği şeyi söylemiş. Bu dosyanın en iyi savunma cümlesi bir mutfak masasında kurulmuş.
`,
      ),
      O(`
> Gece yarısına doğru telefon çaldı. Açmadım. Ekranda “Kılıç” yazıyordu. Çalmayı bıraktı; bir mesaj gelmedi.
`),
    ],
  }),
  story('ARA_SON', {
    ...ARA,
    title: 'Duruşmadan önceki gece',
    background: 'sokak_yagmur',
    lines: B(`
> Pencereyi açtım. Yağmur dinmek üzereydi. Uludağ’ın üstünde bulutlar yırtılmış, arasından tek bir yıldız. Bursa’da nadir bir şey.
leyla: Uyu. Yarın kürsüde susan bir adam da konuşur. Sen sesini değil, sessizliğini dinle. [phone]
> Masamın üstünde dosya, dosyanın üstünde bir sarı karbon kopya. Teslim alan kutusu boş. Kapağını kapattım.
~ Kırk yedi makbuz. Bir zarf. Bir kasa kapısı. Yarın biri bana soracak: “Müdafi, esas hakkındaki savunmanız?”
`),
    choices: [cont('ARA_SON_DEVAM', 'Adliyeye git', 'T_00G_1', { role: 'PRIMARY' })],
  }),
];

export const ara: CasePart = {
  variables: [
    hiddenInt('leyla_ara', 0, 0, 2),
    ...flags(
      'fact_araba_kredi',
      'melek_hazir',
      'melek_kacti',
      'fact_yedek',
      'log_muhafaza',
      'yedek_aldi',
      'bilgilendirdi',
      'ikrar_yolu',
      'fact_isik',
      'hayri_tanik',
      'suc_duyurusu',
      'suc_karar',
      'melek_suc',
      'ara_kasa',
      'ara_pdks',
      'ara_ticket',
      'ara_dil_verildi',
      'fact_1744',
      'fact_cekmece',
      'fact_pc03',
      'fact_tus02',
      'fact_cuma',
      'fact_yazici',
      'teklif_bildirildi',
      'teklif_iletildi',
    ),
  ],
  nodes: [
    ...girisNodes,
    hub,
    melek,
    burak,
    evGiris,
    ev,
    hayri,
    suc,
    kasa,
    pdks2,
    ticket,
    zarf,
    kesifGiris,
    kesif,
    dil,
    cikarim,
    leyla,
    dayEnd,
    otopark,
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
