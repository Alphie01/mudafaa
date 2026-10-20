import {
  all,
  any,
  cmp,
  cont,
  decisionNode,
  flag,
  has,
  inc,
  not,
  option,
  raise,
  ref,
  set,
  story,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef, Cost } from '../../../tools/content/src/kit/index.js';
import { B, O, S, W } from './dsl.js';
import { INV, INV_AP, INV_DAYS } from './shared.js';

// 50-investigation: soruşturma hub'ı (3 gün × 3 EP; push/$return), gün sonu (DECISION + akşam sahneleri), Leyla'ya danış,
// duruşmadan önceki gece (koşullu hafıza zinciri).

const AP: Cost[] = [{ var: 'ap', amount: 1 }];
const act = (id: string, label: string, to: string, extra: Partial<ChoiceDef> = {}): ChoiceDef => ({
  id,
  kind: 'NAVIGATE',
  label,
  cost: AP,
  next: { push: to },
  maxUses: 1,
  ...extra,
});
const free = (id: string, label: string, to: string, extra: Partial<ChoiceDef> = {}): ChoiceDef => ({
  id,
  kind: 'NAVIGATE',
  label,
  next: { push: to },
  ...extra,
});

const tabs = {
  yer: [
    act('H_OTOBUS', 'Hat 38’e aynı saatte bin', 'INV_OTOBUS', { description: 'Aynı model araç · büyüteç 6' }),
    act('H_ODA', 'Arda’nın odasına bak', 'INV_ODA', {
      description: 'Görükle · Arda ve Ozan eşliğinde · büyüteç 6',
      visibleWhen: visited('INV_ARDA'),
    }),
    act('H_TERMINAL', 'Kent Ulaşım terminaline git', 'INV_TERMINAL', {
      description: 'Kayıp eşya bürosu · hareket memurluğu',
    }),
    act('H_BUFE', 'Altıparmak’taki büfeye git', 'INV_BUFE', {
      description: '18.49 harcamasının yapıldığı yer · büyüteç 5',
      visibleWhen: has('clue_harcama_saat'),
    }),
  ],
  kisi: [
    act('H_ARDA', 'Arda’yla sahafta konuş', 'INV_ARDA', {
      description: 'Sahafın kapanışına 14 dk',
      maxUses: undefined,
      visibleWhen: not(visited('INV_ARDA')),
      effects: [set('min', 14)],
    }),
    act('H_ARDA2', 'Arda’yla tekrar konuş', 'INV_ARDA', {
      description: 'Öğle arası · 8 dk',
      visibleWhen: visited('INV_ARDA'),
      effects: [set('min', 8)],
    }),
    act('H_HAYRI', 'Tanık Hayri Doğan’ı bul', 'INV_HAYRI', { description: 'Emekli PTT dağıtıcısı · Beşevler' }),
    act('H_RECEP', 'Şoför Recep Ateş’le konuş', 'INV_RECEP', { description: 'Kent Ulaşım garajı · vardiya arası' }),
    act('H_ZEHRA', 'Zehra’yı nöbetinde ziyaret et', 'INV_ZEHRA', { description: 'Devlet hastanesi · gece' }),
  ],
  arsiv: [
    act('H_EMANET', 'Emanetteki eşyalara bak', 'INV_EMANET', {
      description: 'Adliye emaneti · kâtibin önünde · 6 deneme',
    }),
    act('H_KLIP', 'CD’yi ve aktarım formunu incele', 'INV_KLIP', { description: 'Savcılık delili · 6 deneme' }),
    free('H_BANKA', 'Banka dökümünü oku', 'INV_BANKA', { description: '0 EP · dosyada · 4 deneme', maxUses: 1 }),
    act('H_DIL', 'Delil dilekçesi (CMK 177)', 'INV_DIL', {
      description: '3 talep hakkı · duruşmadan en az 5 gün önce',
      maxUses: undefined,
      visibleWhen: not(flag('dil_verildi')),
    }),
    free('H_CIKARIM', 'Çıkarım tahtası', 'INV_CIKARIM', {
      description: '0 EP · ipuçlarını birleştir',
      enabledWhen: ref('kart2'),
      lockedReason: 'En az 2 ipucu gerekli.',
    }),
    free('H_LEYLA', 'Leyla’ya danış', 'INV_LEYLA', {
      description: '0 EP · günde bir kez',
      visibleWhen: cmp(v('leyla_gun'), '<', v('day')),
      effects: [set('leyla_gun', v('day'))],
    }),
  ],
};

// Gün başlıkları: hedef kutusu bulgulara göre değişir (ilk tutan blok).
const hubLines = [
  W(
    cmp(v('day'), '==', 1),
    `
# buro | GÜN 1/3 · İLK CELSEYE 13 GÜN
Hedef: Arda o akşam ne yaptı? Savcılığın kaydı neyi gösteriyor, neyi göstermiyor?
`,
  ),
  W(
    all(cmp(v('day'), '==', 2), any(has('clue_kaynak_dosya'), has('clue_dort_kamera'))),
    `
# buro | GÜN 2/3 · İLK CELSEYE 12 GÜN
Hedef: kayıt eksik görünüyor. Peki kartlar? Kim, nerede, ne zaman? Ve o gece Arda gerçekten kime ulaşmaya çalıştı?
`,
  ),
  W(
    cmp(v('day'), '==', 2),
    `
# buro | GÜN 2/3 · İLK CELSEYE 12 GÜN
Hedef: kartlar kimin elindeydi? Tanık neyi gördü? CD’nin arkasında başka ne var?
`,
  ),
  O(`
# buro | GÜN 3/3 · İLK CELSEYE 11 GÜN
Hedef: dilekçe için son gün. Tahtayı topla. Duruşmada neyi istiyor, kimi dinletiyorsun?
`),
];

const AKSAM1_GIRIS = `
# buro_gece | 14 EKİM · SALI 20.30 — ARSLAN HUKUK
Büroda yalnızca Leyla’nın lambası yanıyordu. Kapısı aralıktı. İçeri girdim, sormadan karşısına oturdum. Sormamı beklemiyordu zaten.
Masasında iki bardak çay vardı. Biri benim içindi. Öbürü yarısına kadar içilmiş, soğumuştu.
`;
const AKSAM1_SORU = `
leyla: Bugün öğrendiğin en önemli şey neydi? Delil sorma. Ne düşündüğünü sor kendine.
`;
const AKSAM2_GIRIS = `
# sokak_yagmur | 15 EKİM · ÇARŞAMBA 22.40 — EVE DÖNÜŞ
Otobüs durağında beklerken kendimi validatörün sesini sayarken buldum. Bip. Bip. Bir şehir eve dönüyordu, yine.
> Hat 38 geçti. Binmedim. Bir sonraki otobüsü bekledim; nedenini bilmeden.
`;
const LEYLA_GIRIS = `
# buro | LEYLA’NIN ODASI
Leyla gözlüğünü çıkarıp masaya bıraktı. Dinlerken gözlüğünü çıkarır; konuşurken takar.
`;
const GECE_ORTAK = `
Saat yarımı geçti. Telefon titredi. Arda.
arda~phone: Hocam yarın kravat takayım mı? Ozan’ınki var. Biraz kısa ama.
> Kravat. Yedi aydır bir dosyanın içinde yaşayan bir çocuk, yarın ne giyeceğini soruyor. Sanki kıyafet doğru olursa hâkim de doğru görür.
P: Tak. Ama Ozan’ınki değil, kendi gömleğinle git. Ne yaşadıysan onu anlat. Fazlasını değil.
`;
const GECE_SON = `
Kapıda Leyla belirdi. Bu saatte burada ne aradığını sormadım; ben de buradaydım.
leyla: Yarın kimseyi ikna etmeye çalışma. Eksik dakikayı göster. İkna, hâkimin işi.
leyla: Bir de… tanık kürsüdeyken onun gözünden bak. O ne gördüyse, önce onu gör. Sonra neyi göremediğini.
> Işıkları kapattım. Panoda kartlar karanlıkta kaldı. Yarın her biri ya bir kanıt olacak ya bir kâğıt parçası.
`;

export const invHub: CasePart = {
  nodes: [
    {
      id: 'INV_HUB',
      type: 'INVESTIGATION',
      ...INV,
      title: 'Soruşturma',
      background: 'buro',
      hud: ['day', 'ap'],
      lines: hubLines,
      tabs: [
        { id: 't_yer', label: 'YERLER', kind: 'SCENE', choices: tabs.yer.map((c) => c.id) },
        { id: 't_kisi', label: 'KİŞİLER', kind: 'PEOPLE', choices: tabs.kisi.map((c) => c.id) },
        { id: 't_arsiv', label: 'ARŞİV', kind: 'ARCHIVE', choices: tabs.arsiv.map((c) => c.id) },
      ],
      scenePreview: { scene: 'sc_otobus' },
      quickTalk: {
        character: 'arda',
        line: '“Çalmadım hocam. Buldum. Bunu kaç kere söylesem eksik kalıyor.”',
        choices: ['H_ARDA', 'H_ARDA2'],
      },
      choices: [
        ...tabs.yer,
        ...tabs.kisi,
        ...tabs.arsiv,
        {
          id: 'H_DURUSMA',
          kind: 'NAVIGATE',
          label: 'DURUŞMAYA GİT · 1. CELSE',
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen soruşturma biter. Emin misin?',
          next: 'INV_GECE_1',
        },
      ],
    },

    // Gün sonu: gün + 1, eylem puanı tam; akşam sahnesine yönlendirir.
    decisionNode('INV_DAY_END', [{ when: cmp(v('day'), '==', 2), to: 'INV_AKSAM1' }, { to: 'INV_AKSAM2' }], {
      onEnter: [inc('day', 1), set('ap', INV_AP)],
    }),

    story('INV_AKSAM1', {
      ...INV,
      title: 'Akşam',
      background: 'buro_gece',
      lines: [
        W(
          any(has('clue_kaynak_dosya'), has('clue_dort_kamera'), has('clue_son_kare')),
          AKSAM1_GIRIS +
            `
leyla: Yüzünden belli. Bir şey buldun ama ne olduğunu bilmiyorsun. En tehlikeli an budur. İnsan bulduğuna âşık olur.
` +
            AKSAM1_SORU,
        ),
        O(
          AKSAM1_GIRIS +
            `
leyla: Yorgunsun. İlk gün hep böyle olur. İnsan her şeye bakmak ister, hiçbir şeyi görmez.
` +
            AKSAM1_SORU,
        ),
      ],
      choices: [
        option('AK1_KAYIT', '“Kaydın eksik olabileceğini.”', {
          effects: [set('aksam_tema', 'KAYIT')],
          responses: B(`
P: Kaydın eksik olabileceğini. İki buçuk dakika, tek açı. Ama bir otobüs bir saatte kırk durak geçer.
leyla: Eksik olabileceğini düşünmek kolay. Eksik olduğunu göstermek iş. Kimin elinde, hangi kâğıtta, nasıl isteyeceksin?
leyla: Bir de şunu sor kendine: o kaydı kim, hangi saatte, hangi yorgunlukla hazırladı? Kayıtlar insanların elinden geçer. İnsanlar da yorulur.
`),
          next: 'INV_HUB',
        }),
        option('AK1_ARDA', '“Arda’nın susması. Bir şeyden utanıyor.”', {
          effects: [set('aksam_tema', 'ARDA')],
          responses: B(`
P: Arda’nın susması. Her soruya cevap veriyor ama bir yerde duruyor. Bir şeyden utanıyor.
leyla: Utanç ile suçluluk dışarıdan aynı görünür. İçeriden bakınca biri “yaptım” der, öbürü “yapamadım”. Hangisi olduğunu bul.
`),
          next: 'INV_HUB',
        }),
        option('AK1_KART', '“Kartlar. Kim kullandı, neden üçe böldü?”', {
          effects: [set('aksam_tema', 'KART')],
          responses: B(`
P: Kartlar. Biri kartları kullandı ve kim olduğu dosyada yok. Savcı bu boşluğu Arda’yla dolduruyor.
leyla: Savcının boşluğunu doldurma. Göster yeter. Boşluk hâkimin önünde kaldıkça şüphe büyür. Şüphe kimin lehine, biliyorsun.
`),
          next: 'INV_HUB',
        }),
      ],
    }),

    story('INV_AKSAM2', {
      ...INV,
      title: 'Gece',
      background: 'sokak_yagmur',
      lines: [
        W(
          flag('zehra_yakin'),
          AKSAM2_GIRIS +
            `
Telefon titredi. Zehra. Arka planda bir monitörün bipleri.
zehra~phone: Rahatsız etmiyorum değil mi? Nöbetteyim. Arda aradı, sizinle konuşmuş. İlk defa sesi biraz düzgün geliyordu.
zehra~phone: Annem bugün aradı. “Arda neden telefonlara az çıkıyor?” dedi. Sınavları var dedim. Yalan söylemeyi beceremiyorum avukat hanım.
`,
        ),
        O(
          AKSAM2_GIRIS +
            `
Telefon titredi. Bilmediğim bir numaradan, uzun bir mesaj. Arda.
arda~phone: Hocam iyi akşamlar. Ablam numaranızı verdi. Rahatsız ediyorsam affedin. Yarın bir şey lazım olursa sahaftayım.
arda~phone: Bir de… teşekkür ederim. İlk defa biri “anlat” dedi, “açıkla” demedi.
`,
        ),
      ],
      choices: [
        option('AK2_DURUST', '“Dosyada iyi şeyler de var, kötü şeyler de. İkisini de bileceksiniz.”', {
          effects: [inc('trust', 4), raise('aksam2_durust')],
          responses: B(`
P: Dosyada iyi şeyler de var, kötü şeyler de. İkisini de benden duyacaksınız. Başkasından değil.
> Yağmur sesine karışan bir nefes. Sonra kısa bir “tamam”. Bazı insanlar iyi haberden önce dürüst haber ister.
`),
          next: 'INV_HUB',
        }),
        option('AK2_RAHAT', '“Merak etmeyin, her şey yolunda.”', {
          effects: [raise('aksam2_rahat')],
          responses: B(`
P: Merak etmeyin. Her şey yolunda gidiyor.
> Telefonu kapattıktan sonra camdaki yansımama baktım. “Her şey yolunda” avukatların en ucuz cümlesidir. Ve en pahalı.
`),
          next: 'INV_HUB',
        }),
      ],
    }),

    // Leyla'ya danış: ilk tutan blok gösterilir (en özel durumdan en genele).
    story('INV_LEYLA', {
      ...INV,
      title: 'Leyla’nın odası',
      background: 'buro',
      lines: [
        W(
          all(any(has('clue_kaynak_dosya'), has('clue_dort_kamera')), not(flag('dil_verildi'))),
          LEYLA_GIRIS +
            `
leyla: Kayıt eksikse onu sen tamamlayamazsın. Mahkeme tamamlatır. Delil dilekçesi; duruşmadan en az beş gün önce, olayı göstererek.
leyla: Ceza muhakemesinde bunun adı yüz yetmiş yedidir. Hangi olayı, hangi delille ispat edeceğini yaz. “Her şeyi getirin” diyen dilekçe çöpe gider.
leyla: Üç hakkın var. Birini boşa harcarsan, en çok ihtiyacın olanı istemeye yerin kalmaz. Unutma: duruşmada da istenebilir; ama geç istenen delil geç gelir.
`,
        ),
        W(
          all(has('clue_harcama_saat'), not(has('ded_kart_baskasi'))),
          LEYLA_GIRIS +
            `
leyla: Bir saatin yanına başka bir saat koy. Kartlar 18.49’da Altıparmak’ta. Peki Arda 18.49’da neredeydi? Elinde onu gösteren bir kare var mı?
leyla: Tahtada iki kartı yan yana koyunca bazen üçüncüsü kendiliğinden belirir.
`,
        ),
        W(
          all(visited('INV_HAYRI'), not(has('ded_hayri_gormedi'))),
          LEYLA_GIRIS +
            `
leyla: Dürüst tanık en zor tanıktır. Yalancıyı yakalarsın; dürüst olanı ancak gördüğünün sınırına götürürsün. Nereden, neyle, ne kadar gördü?
leyla: Mahkemede ona “yalan söylüyorsunuz” deme. “Neredeydiniz, ne yapıyordunuz” de. Gerisini o söyler.
leyla: Bir de karakolda nasıl tanıdığını öğren. Bir kişiye tek bir görüntü gösterilip “bu mu” dendiyse, o tanıma bir sorudan doğmuştur. Sorudan doğan tanıma zayıftır.
`,
        ),
        W(
          not(visited('INV_ARDA')),
          LEYLA_GIRIS +
            `
leyla: Önce müvekkil. Dosyayı ondan önce okursan onun yerine konuşmaya başlarsın. Dosyayı ondan sonra okursan, onunla birlikte okursun.
leyla: Görüşmede sorunu sor, sonra sus. Susmayı beceremeyen avukat, müvekkilin en önemli cümlesini kendi cümlesiyle örter.
`,
        ),
        O(
          LEYLA_GIRIS +
            `
leyla: Elindekileri say. Her biri neyi gösteriyor, neyi göstermiyor? İkinci sütun birinciden önemli.
leyla: Bir de şunu unutma: duruşmada sunduğun her şey, senin dürüstlüğünü de sunar. Yanlış kâğıdı kaldırırsan, doğru kâğıdın da ağırlığı azalır.
leyla: Kayıp eşya suçu, yüz altmış, “malik gibi tasarruf” ister. Saklamak, harcamak, kullanmak. Arda’nın o gece ne yaptığını say. Malik gibi mi, sahibini arayan biri gibi mi?
`,
        ),
      ],
      choices: [cont('LEYLA_DON', 'Teşekkür et', '$return', { role: 'BACK' })],
    }),

    // Duruşmadan önceki gece: koşullu hafıza zinciri.
    decisionNode('INV_GECE_1', [{ to: 'INV_GECE_2' }], {
      ...INV,
      lines: [
        W(
          has('ded_eksik_kayit'),
          `
# buro_gece | 26 EKİM · PAZAR 23.10 — ARSLAN HUKUK
Panoya son kartları iğneledim. Yağmur, cama birinin parmak uçlarıyla vuruyor gibi.
> Bir: CD bir saatin iki buçuk dakikası. Dört kamera var, tek kanal verilmiş. Tam kayıt bir yerde duruyor.
`,
        ),
        O(`
# buro_gece | 26 EKİM · PAZAR 23.10 — ARSLAN HUKUK
Panoya son kartları iğneledim. Yağmur, cama birinin parmak uçlarıyla vuruyor gibi.
> Bir: savcılığın kaydı. İki buçuk dakika. Hâlâ gösterdiğinden çok göstermediği şeyi düşünüyorum.
`),
      ],
    }),
    decisionNode('INV_GECE_2', [{ to: 'INV_GECE_3' }], {
      lines: [
        W(
          has('ded_kart_baskasi'),
          `
> İki: kartlar. 18.44.30’da Arda Beşevler’e giden otobüsteydi; 18.49’da kartlar Altıparmak’ta. Kartları o kullanmadı. Savcı “ortağı” diyecek.
`,
        ),
        W(
          has('clue_harcama_saat'),
          `
> İki: kartlar 18.49’da Altıparmak’ta kullanıldı. Arda o saatte neredeydi? Cevap elimin altında olmalı ama tutamıyorum.
`,
        ),
        O(`
> İki: kartlar. Dosyada bir satır: “faili belirlenemedi.” Bu satır hâlâ bir boşluk; bir silah değil.
`),
      ],
    }),
    decisionNode('INV_GECE_3', [{ to: 'INV_GECE_4' }], {
      lines: [
        W(
          has('ded_teslim'),
          `
> Üç: bir not ve bir telefon. “Yarın 9 — karakol.” 19.18’de 153. Saklamak isteyen biri kendine hatırlatma yazmaz.
`,
        ),
        W(
          any(has('clue_sari_not'), has('clue_153_arama'), has('clue_fb_mesaj')),
          `
> Üç: Arda o gece birilerine ulaşmaya çalışmış. İzler var ama bir araya gelmiyor. Bir iz tek başına bir tesadüftür.
`,
        ),
        O(`
> Üç: teslim niyeti. Elimde Arda’nın cümlesinden başka bir şey yok. Bir cümle, bir hâkimin önünde ne kadar ağırdır?
`),
      ],
    }),
    decisionNode('INV_GECE_4', [{ to: 'INV_GECE_5' }], {
      lines: [
        W(
          has('ded_hayri_gormedi'),
          `
> Dört: Hayri Bey. Dürüst bir adam. Gözlüksüz gazete okuyan miyop bir adam. Kürsüde ona saldırmayacağım; yalnızca nereye baktığını soracağım.
`,
        ),
        W(
          cmp(v('aksam_tema'), '==', 'ARDA'),
          `
> Dört: Arda’nın utancı. Leyla “bekle” demişti. Bekledim mi? Yarın kürsüde o susarsa, susmasını kim anlatacak?
`,
        ),
        W(
          cmp(v('aksam_tema'), '==', 'KART'),
          `
> Dört: savcının boşluğu. Leyla “doldurma, göster” dedi. Yarın göstereceğim. Doldurmayacağım.
`,
        ),
        O(`
> Dört: tanık. Kürsüde biri “ben gördüm” diyecek. Gördüğünü sandığı şeyle gördüğü şey arasındaki mesafeyi ölçmek benim işim.
`),
      ],
    }),

    decisionNode('INV_GECE_5', [{ to: 'INV_GECE_6' }], {
      lines: [
        W(
          all(flag('fact_recep_tutanak'), flag('fact_recep_korku')),
          `
> Beş: şoför. İki tutanağı var; üçüncüsünde kapı dışarı. Korkan bir adamın “kimse getirmedi” cümlesi, yalan mı, unutkanlık mı, yoksa ikisinin arası mı?
`,
        ),
        W(
          flag('fact_ilk_avukat'),
          `
> Beş: ifade tutanağı. Gece ikide, yorgun bir avukat, yorgun bir memur, okunmadan atılan bir imza. 153 yazılmamış, şoför yazılmamış. Yazılmayan cümleleri yarın ben söyleyeceğim.
`,
        ),
        W(
          flag('hayri_hayat'),
          `
> Beş: Hayri Bey’in cümlesi. “Bakınca bir şey görüyorum sanıyorum.” Bir tanığın en dürüst cümlesi, bazen savunmanın en güçlü cümlesidir.
`,
        ),
      ],
    }),
    decisionNode('INV_GECE_6', [{ to: 'INV_GECE_7' }], {
      lines: [
        W(
          all(flag('fact_hayri_cd'), flag('fact_hayri_yer')),
          `
> Altı: karakolda Hayri Bey’e tek bir görüntü gösterilmiş, “bu mu” diye sorulmuş. Dokuz numaradan, gazetesinin üstünden bakan bir adama.
`,
        ),
        W(
          any(flag('fact_recep_inkar'), flag('recep_insan')),
          `
> Altı: Recep Ateş. Hamitler’de iki çocuklu bir adam. “Kimse getirmedi” derken saatine baktı. Saate bakan adam, zamanın bitmesini bekler.
`,
        ),
        W(
          any(flag('sofor_gozlem'), flag('sofor_soruldu')),
          `
> Altı: son durakta bir şemsiye, bir el, “yarın kayıp eşyaya.” Bir kuralın kapı camında yazması, şoförün onu uygulaması demek değil.
`,
        ),
      ],
    }),
    decisionNode('INV_GECE_7', [{ to: 'INV_GECE' }], {
      lines: [
        W(
          all(flag('deniz_durust'), flag('zehra_anlatti')),
          `
> Yedi: Zehra’ya “her sayfayı okuyacağım” demiştim. Okudum. O da bana Arda’nın karakol korkusunu anlatmıştı, bir hastane koridorunda.
`,
        ),
        W(
          any(flag('zehra_anne'), flag('aksam2_durust')),
          `
> Yedi: Zehra annesine hâlâ söylemedi. Ona dürüst olacağımı söyledim; iyi haberi de kötü haberi de benden duyacaktı.
`,
        ),
        W(
          any(flag('fact_arda_gulten'), flag('fact_arda_hayri')),
          `
> Yedi: Arda, kendisine hırsız diyen kadına kızmıyor. Kendisini gösteren tanığa da. Kızmayan bir müvekkil, kızgın bir hâkimden daha zor savunulur.
`,
        ),
        W(
          any(flag('fact_buro_defter'), flag('fact_volkan_adi'), flag('tutanak_ornek'), flag('cemil_tanisti')),
          `
> Yedi: defterler, formlar, örnekler, bir büfecinin telefon numarası. Bir dosya, sonunda birilerinin hatırlamaya razı olduğu küçük şeylerden oluşur.
`,
        ),
      ],
    }),
    story('INV_GECE', {
      ...INV,
      title: 'Duruşmadan önceki gece',
      background: 'buro_gece',
      lines: [
        W(
          flag('aksam2_rahat'),
          GECE_ORTAK +
            `
> Zehra’ya “her şey yolunda” demiştim. O cümle şimdi masada, dosyanın yanında oturuyor. Yarın onu ya haklı çıkaracağım ya da gömeceğim.
` +
            GECE_SON,
        ),
        O(GECE_ORTAK + GECE_SON),
      ],
      choices: [cont('GECE_DEVAM', 'Sabah oldu', 'H1_00', { role: 'PRIMARY' })],
    }),
  ],
  triggers: [
    {
      id: 'tg_day_end',
      scope: 'INV_HUB',
      priority: 1,
      when: all(cmp(v('ap'), '<=', 0), cmp(v('day'), '<', INV_DAYS)),
      goto: 'INV_DAY_END',
    },
  ],
};

// Kart sayısı yüklemi meta'da (kart2).
export const INV_FLAGS = ['dil_verildi', 'aksam2_durust', 'aksam2_rahat', 'zehra_yakin'];
