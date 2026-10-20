import {
  all,
  any,
  cmp,
  cont,
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
  dec,
  not,
  option,
  raise,
  recipe,
  ref,
  row,
  score,
  set,
  story,
  tool,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef, Cost, NodeDef } from '../../../tools/content/src/kit/index.js';
import { B, O, W } from './dsl.js';
import { POOL1, RECIPES1 } from './inv-archive.js';
import { ARA, ARA_AP, ARA_DAYS } from './shared.js';

// 70-ara: birinci ve ikinci celse arası (2 gün × 3 EP). Hub yığınsızdır: her alt ekran doğrudan ARA_HUB'a döner
// (Dava #07 motor notu 2). Ters köşe burada: tam sefer kaydı.

const AP: Cost[] = [{ var: 'ara_ap', amount: 1 }];
const act = (id: string, label: string, to: string, extra: Partial<ChoiceDef> = {}): ChoiceDef => ({
  id,
  kind: 'NAVIGATE',
  label,
  cost: AP,
  next: to,
  maxUses: 1,
  ...extra,
});
const free = (id: string, label: string, to: string, extra: Partial<ChoiceDef> = {}): ChoiceDef => ({
  id,
  kind: 'NAVIGATE',
  label,
  next: to,
  ...extra,
});
const home = (id: string, label: string): ChoiceDef => ({ id, kind: 'CONTINUE', label, role: 'BACK', next: 'ARA_HUB' });

/** Kit ekranlarındaki `$return` dönüşlerini ARA_HUB'a çevirir (yığınsız hub). */
function direct<T extends NodeDef>(n: T): T {
  return {
    ...n,
    choices: n.choices.map((c) =>
      c.next === '$return' ? { ...c, next: c.id === 'KAYIT_BITIR' ? 'ARA_KAYIT_SON' : 'ARA_HUB' } : c,
    ),
  };
}

const deliveries = deliver('ARA_GIRIS_1', [
  {
    evidence: 'ev_tam_kayit',
    requires: any(flag('kayit_istendi'), flag('kayit_istendi_h1')),
    hint: 'Tam sefer kaydını dilekçeyle ya da 1. celsede iste.',
  },
  {
    evidence: 'ev_cagri_kaydi',
    requires: any(flag('cagri_istendi'), flag('cagri_istendi_h1')),
    hint: '153 çağrı kaydını dilekçeyle ya da 1. celsede iste.',
  },
]);

const found = (text: string, label = '+150 SKOR · Not defterine eklendi') => ({
  title: 'YENİ İPUCU',
  text,
  label,
  tone: 'special' as const,
});

export const POOL2 = [
  ...POOL1,
  'clue_kare_bere',
  'clue_kare_parka',
  'clue_kare_birakma',
  'clue_kare_inis',
  'clue_kare_soru',
  'clue_kare_sofor',
  'clue_cagri_notu',
  'clue_mesaj_istegi',
  'clue_cemil_tarif',
];

const RECIPES2: [string, string, string, string, string][] = [
  [
    'CB_BIRAKAN',
    'clue_kare_birakma',
    'clue_kare_inis',
    'ded_birakan',
    '18.36’da cüzdanı koltuğun altına bırakan parkalı adam, bir dakika sonra Altıparmak’ta iniyor. Arda otobüste kalıyor.',
  ],
  [
    'CB_BERE_AYNI',
    'clue_kare_bere',
    'clue_fis_notu',
    'ded_bere_ayni',
    'Orta kapıda şemsiye tutan yeşil bereli kadın 18.37’de Altıparmak’ta iniyor. 18.49’da büfede yeşil bereli biri kartı üçe bölüyor.',
  ],
  [
    'CB_KAPUSON',
    'clue_kare_parka',
    'clue_gri_kapuson',
    'ded_kapuson',
    'Hayri Bey’in arkadan gördüğü gri kapüşon, kapüşonu başında olan parkaydı. Arda’nın kapüşonu sırtındaydı.',
  ],
  [
    'CB_SOFOR',
    'clue_kare_sofor',
    'clue_cikartma',
    'ded_sofor_red',
    'Kural “sürücüye teslim ediniz” diyor. 19.05’te Arda tam bunu yapıyor; şoför elini sallıyor.',
  ],
  [
    'CB_NIYET',
    'clue_cagri_notu',
    'clue_kare_soru',
    'ded_niyet_tam',
    'Yandaki yolcu 18.43, şoför 19.05, 153 19.18, sahibine mesaj 21.14. Dört saatte dört kapı.',
  ],
];

// Aynı tarif iki tahtada da kurulabilir; puan yalnızca ilk kurulumda (Dava #07 motor notu 4).
const araRecipe = ([id, a, b, ded, text]: [string, string, string, string, string], prefix: string): ChoiceDef =>
  recipe(`${prefix}${id}`, a, b, {
    effects: [ifThen(not(has(ded)), [score('DELIL_ANALIZI', 300)]), discover(ded)],
    feedback: { title: 'YENİ ÇIKARIM', text, label: 'ÇIKARIM · +300 SKOR (ilk kurulumda)', tone: 'success' },
  });

const ARA_GIRIS_ORTAK = `
# arac | 3 KASIM · PAZARTESİ 08.10 — ZEHRA’NIN ARABASI
Zehra beni büronun önünden aldı. Gece nöbetinden çıkmıştı; gözleri kıpkırmızı, arabası hastane dezenfektanı ve soğuk kahve kokuyordu.
Silecekler gıcırdıyordu. Radyoda trafik haberleri. Arda arka koltukta, telefonuna bakıyordu.
arda: Staj okulundan e-posta geldi. “Yargılama sonuçlanıncaya kadar uygulama faaliyetlerinize ara verilmesi uygun görülmüştür.” Uygun görülmüş.
zehra.kizgin: Uygun görülmüş! Kim görmüş? Çocuklar seni soruyormuş. Öğretmen arkadaşın söyledi.
arda: Bir kız resim göndermiş, öğretmen arkadaş iletti. Bir otobüs çizmiş, içinde bir adam. Altında “Arda Öğretmenim çabuk gel” yazıyor.
Arda telefonu kapattı ve cama yasladı. Cam buğuluydu. Parmağıyla bir şey çizmedi.
> İki hafta önce bir dosyam vardı. Şimdi bir arabanın içinde üç kişiyiz ve dosya aramızda oturuyor. Yağmur bitmiyor.
`;

const KAYIT_GIRIS = `
# buro_gece | GECE 23.40 — ARSLAN HUKUK
Harici disk dizüstünde vızıldıyordu. Ekran dörde bölündü: ön, orta, orta kapı, arka. Dört gri pencere, aynı akşam, aynı yağmur.
Kayıtla birlikte teknik bir kare dökümü gelmişti. Saat saat, kamera kamera. Her satır yedi ay önceki bir saniye.
`;
const KAYIT_SON = `
> İzlemeye 18.10’dan başladım. Kalabalık doldu, boşaldı. Arda’yı Çarşı’da gördüm; kulaklığı, telefonu. Sonra kadını gördüm, bez çantasıyla.
> Sonra başka şeyler gördüm. Satırı seç, aleti seç. Her doğru bakış bir kare açar; her yanlış bakış bir hak götürür.
`;
export const ara: CasePart = {
  nodes: [
    decisionNode('ARA_GIRIS_0', [{ to: 'ARA_GIRIS_1' }], {
      ...ARA,
      lines: [
        W(
          flag('pisman_soruldu'),
          `
> O gece büroda tutanağı yeniden okudum: “Sanık pişmanlığını beyan etti.” Altında Arda’nın kendi cümlesi. Bir “pişman mısın” sorusu, bir ömür taşınan bir satıra dönüşebilirdi.
`,
        ),
        W(
          flag('arda_niyet_mahkemede'),
          `
> O gece büroda tutanağı yeniden okudum. Arda’nın cümleleri ilk kez kâğıttaydı: yanındaki yolcu, şoför, belediye, mesaj. Yedi aydır kimsenin yazmadığı cümleler.
`,
        ),
        W(
          any(flag('gulten_polis_dedi'), flag('ek_simdi')),
          `
> O gece büroda tutanağı yeniden okudum. Bazı cümleler erken söylenmişti; bazıları başkasının ağzından. Üç hafta, onları yerine oturtmak için var.
`,
        ),
      ],
    }),
    decisionNode('ARA_GIRIS_1', [{ to: 'ARA_GIRIS' }], {
      ...ARA,
      onFirstEnter: [...deliveries.effects, set('ara_day', 1), set('ara_ap', ARA_AP)],
      lines: [
        W(
          all(has('ev_tam_kayit'), has('ev_cagri_kaydi')),
          ARA_GIRIS_ORTAK +
            `
Telefonum titredi. Kâtip Melek Hanım: “Avukat hanım, ara kararların cevabı geldi. Kent Ulaşım bir harici disk göndermiş, belediye de bir döküm.”
> Bir disk ve bir döküm. Dört kamera, bir saat. Ve bir çağrı merkezinin, kimsenin bakmadığı hafızası.
`,
        ),
        W(
          has('ev_tam_kayit'),
          ARA_GIRIS_ORTAK +
            `
Telefonum titredi. Kâtip Melek Hanım: “Avukat hanım, Kent Ulaşım ara kararın cevabını göndermiş. Bir harici disk ve kare dökümü.”
> Dört kamera, bir saat. Eksik dakikalar bir diskin içinde bekliyordu.
`,
        ),
        W(
          has('ev_cagri_kaydi'),
          ARA_GIRIS_ORTAK +
            `
Telefonum titredi. Kâtip Melek Hanım: “Avukat hanım, belediyeden çağrı kaydı geldi. Kayıt talebiniz olmadığı için Kent Ulaşım’dan bir şey yok.”
> Dört kamera bir yerde duruyordu ve ben istememiştim. Bir çağrı kaydım vardı. Bir çağrı, bir saatlik kaydın yerini tutmazdı.
`,
        ),
        O(
          ARA_GIRIS_ORTAK +
            `
Telefonum sessizdi. Ara karardan dosyaya yeni bir kâğıt gelmeyecekti. İstemediğim şey gelmezdi.
> Elimde ne varsa o. İki buçuk dakika, bir tanık, bir not. Üç hafta da bu kâğıtları yeniden okumakla geçmeyecekti; insanlarla geçecekti.
`,
        ),
      ],
    }),
    story('ARA_GIRIS', {
      ...ARA,
      title: 'Üç hafta',
      background: 'arac',
      lines: B(`
zehra: Avukat hanım, ben bir şey araştırdım. HAGB diye bir şey varmış. Hükmün açıklanmasının geri… şeyi. Sicile işlemiyormuş.
zehra: Kabul etse, parayı ödese, bitse? Ben öderim. İki maaş. Bitsin artık.
arda.uzgun: Abla…
> Zehra yorgundu. Yorgun insanlar en kestirme yolu sever. Kestirme yollar bazen bir uçurumun kenarından geçer.
P: Bunu Arda’yla ayrıca konuşacağız. Şimdi değil.
Arabadan indim. Adliyenin önünde yağmur, ayakkabımın içine kadar işledi.
`),
      choices: [cont('ARAGIRIS_DEVAM', 'Ara evresine başla', 'ARA_HUB', { role: 'PRIMARY' })],
    }),

    {
      id: 'ARA_HUB',
      type: 'INVESTIGATION',
      ...ARA,
      title: 'Ara',
      background: 'buro',
      hud: ['ara_day', 'ara_ap'],
      lines: [
        W(
          cmp(v('ara_day'), '==', 1),
          `
# buro | ARA · GÜN 1/3 · İKİNCİ CELSEYE 14 GÜN
Hedef: gelen kayıtları oku. Kim, ne zaman, nerede? Dürüst kalanları dürüst bırak; korkanların korkusunu anla.
`,
        ),
        W(
          cmp(v('ara_day'), '==', 2),
          `
# buro | ARA · GÜN 2/3 · İKİNCİ CELSEYE 10 GÜN
Hedef: tanıklar. Kimin neyi bildiğini öğren; kimseye ne diyeceğini söyleme. Bulduğun gölgeler kimin masasına gitmeli?
`,
        ),
        O(`
# buro | ARA · GÜN 3/3 · İKİNCİ CELSEYE 7 GÜN
Hedef: ek savunma. Arda ne söyleyecek? Sen neyi ispat edeceksin? Bulduğun her şey kimin elinde olmalı?
`),
      ],
      tabs: [
        {
          id: 't2_kayit',
          label: 'KAYITLAR',
          kind: 'ARCHIVE',
          choices: ['A2_KAYIT', 'A2_CAGRI', 'A2_CIKARIM', 'A2_LEYLA'],
        },
        {
          id: 't2_kisi',
          label: 'KİŞİLER',
          kind: 'PEOPLE',
          choices: ['A2_GULTEN', 'A2_CEMIL', 'A2_ARDA', 'A2_VOLKAN', 'A2_OZAN', 'A2_HAYRI', 'A2_KARAKOL'],
        },
        { id: 't2_adim', label: 'ADIMLAR', kind: 'SCENE', choices: ['A2_SUC', 'A2_YANLIS'] },
      ],
      choices: [
        act('A2_KAYIT', 'Tam sefer kaydını incele', 'ARA_KAYIT', {
          description: 'Dört kanal · kare dökümü · 8 deneme',
          visibleWhen: has('ev_tam_kayit'),
        }),
        free('A2_CAGRI', '153 çağrı kaydını oku', 'ARA_CAGRI', {
          description: '0 EP · belediye dökümü · 3 deneme',
          maxUses: 1,
          visibleWhen: has('ev_cagri_kaydi'),
        }),
        free('A2_CIKARIM', 'Çıkarım tahtası', 'ARA_CIKARIM', {
          description: '0 EP · yeni kartlar',
          enabledWhen: ref('kart2'),
          lockedReason: 'En az 2 ipucu gerekli.',
        }),
        free('A2_LEYLA', 'Leyla’ya danış', 'ARA_LEYLA', {
          description: '0 EP · günde bir kez',
          visibleWhen: cmp(v('leyla_ara'), '<', v('ara_day')),
          effects: [set('leyla_ara', v('ara_day'))],
        }),
        act('A2_GULTEN', 'Gülten Hanım’ın torununun daveti', 'ARA_GULTEN', {
          description: 'Beşevler · müştekinin evi',
          visibleWhen: flag('arda_mesaj_mahkemede'),
        }),
        act('A2_CEMIL', 'Altıparmak’taki büfeye yeniden git', 'ARA_CEMIL', {
          description: 'Cemil Usta · fiş kutusu',
          visibleWhen: any(visited('INV_BUFE'), has('clue_harcama_saat')),
        }),
        act('A2_ARDA', 'Arda ve Zehra’yla ek savunmayı konuş', 'ARA_ARDA', { description: 'Zehra’nın evi · akşam' }),
        act('A2_VOLKAN', 'Teknisyen Volkan Sezer’le konuş', 'ARA_VOLKAN', {
          description: 'Kent Ulaşım · teknik oda',
          visibleWhen: flag('volkan_cagrildi'),
        }),
        act('A2_OZAN', 'Ozan’la konuş', 'ARA_OZAN', {
          description: 'Tanık · Görükle',
          visibleWhen: flag('ozan_istendi'),
        }),
        act('A2_KARAKOL', 'Görükle Polis Merkezine uğra', 'ARA_KARAKOL', { description: 'Aramayı yapan memur' }),
        act('A2_HAYRI', 'Bekleme salonunda Hayri Bey', 'ARA_HAYRI', {
          description: 'Habersiz gelmiş',
          visibleWhen: any(flag('contra_h1'), flag('contra_h4')),
        }),
        act('A2_SUC', 'Cumhuriyet Başsavcılığına suç duyurusu', 'ARA_SUC', {
          description: 'CMK 158 · somut delille',
          maxUses: undefined,
          visibleWhen: not(flag('suc_verildi')),
        }),
        act('A2_YANLIS', 'Altıparmak durağında aynı saatte bekle', 'ARA_YANLIS', {
          description: 'Belki yine o hattadırlar',
          visibleWhen: any(has('clue_kare_inis'), has('ded_birakan')),
        }),
        {
          id: 'A2_DURUSMA',
          kind: 'NAVIGATE',
          label: 'DURUŞMAYA GİT · 2. CELSE',
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen ara evresi biter. Emin misin?',
          next: 'ARA_SON_1',
        },
      ],
    },

    decisionNode('ARA_DAY_END', [{ when: cmp(v('ara_day'), '==', 2), to: 'ARA_AKSAM' }, { to: 'ARA_AKSAM2' }], {
      onEnter: [inc('ara_day', 1), set('ara_ap', ARA_AP)],
    }),
    story('ARA_AKSAM', {
      ...ARA,
      title: 'Leyla’nın çekmecesi',
      background: 'buro_gece',
      lines: B(`
# buro_gece | 4 KASIM · SALI 21.30 — ARSLAN HUKUK
Leyla masasının alt çekmecesini açmış, içine bakıyordu. Beni görünce kapatmadı ama elini çekmecenin kenarında tuttu.
P: Ne var orada?
leyla: Kayıp eşya. Otuz yılın. Bir eldiven, bir tespih, bir çocuk çorabı, bir çakmak. Müvekkillerin burada unuttukları.
leyla: Bazıları beraat etti, almaya gelmediler. Bazıları gelemedi. Ben de atamadım.
> Leyla’nın bir çekmecesi varmış. Otuz yıldır sahibini bekleyen şeylerle dolu. Bunu bana neden şimdi gösterdiğini sormadım.
leyla: Sen bu dosyada neyi arıyorsun, Deniz? Kazanmayı mı, eksik dakikayı mı?
`),
      choices: [
        option('AA_KAZAN', '“İkisini de.”', {
          effects: [raise('ara_aksam_ikisi')],
          responses: B(`
P: İkisini de.
leyla: Dürüst cevap. Bir gün ikisinin aynı yere gitmediği bir dosyan olacak. O gün ne yapacağını şimdiden düşün.
`),
          next: 'ARA_HUB',
        }),
        option('AA_DAKIKA', '“Eksik dakikayı. Kazanmak onun arkasından gelirse gelir.”', {
          effects: [raise('ara_aksam_dakika')],
          responses: B(`
P: Eksik dakikayı. Kazanmak onun arkasından gelirse gelir.
leyla.mutlu: Bunu duruşmada söyleme. Hâkimler bu cümleyi sever ama savcılar sevmez.
leyla: Ben bu çekmeceyi otuz yıldır kilitlemiyorum, Deniz. Biri bir gün gelip “benim” der diye. Eksik dakika da böyledir: kapıyı kilitlemezsen bir gün biri getirir.
Çekmeceyi kapattı. Anahtarı çevirmedi.
`),
          next: 'ARA_HUB',
        }),
      ],
    }),

    direct(
      documentExam('ARA_KAYIT', {
        ...ARA,
        title: 'Tam sefer kaydı',
        background: 'buro_gece',
        hud: ['kayit_left'],
        lines: [
          W(
            flag('fact_parka_sezgi'),
            KAYIT_GIRIS +
              `
> Arda “birinin ıslak parkası koluma sürtünüp duruyordu” demişti. Saçma bir ayrıntı, demişti. Saçma ayrıntılar en zor uydurulan şeylerdir.
` +
              KAYIT_SON,
          ),
          O(KAYIT_GIRIS + KAYIT_SON),
        ],
        header: { left: 'KENT ULAŞIM · SEFER_0306_1810-1910 · KARE DÖKÜMÜ', right: '4 KANAL · 60 DK' },
        columns: [
          { label: 'SAAT · KAMERA', flex: 1 },
          { label: 'GÖRÜNTÜ', flex: 2.4 },
        ],
        rows: [
          row('f1', ['18.12 · KAM-1', 'Heykel: yaşlı kadın biner; ardından yolcular']),
          row('f2', ['18.31 · KAM-3', 'Orta kapı: kalabalık, içeride açık bir şemsiye'], {
            mag: {
              cells: [
                '18.31 · KAM-3',
                'Şemsiyeyi tutan: yeşil bereli bir kadın; şemsiye yaşlı kadının çantasıyla kamera arasında',
              ],
              tone: 'special',
            },
          }),
          row('f3', ['18.33 · KAM-3', 'Yaşlı kadının arkasında gri kapüşonlu biri'], {
            mag: {
              cells: ['18.33 · KAM-3', 'Koyu gri parka, kapüşonu başında; eli bez çantanın içinde'],
              tone: 'special',
            },
            cmp: {
              cells: [
                '18.33 · KAM-3',
                'Arda iki metre solda; açık gri sweatshirt, kapüşonu sırtında, telefona bakıyor',
              ],
              tone: 'special',
            },
          }),
          row('f4', ['18.36 · KAM-4', 'Arka kapıya ilerleyen yolcular'], {
            mag: {
              cells: ['18.36 · KAM-4', 'Parkalı adam eğiliyor; 14 numaranın altına koyu renk bir cisim bırakıyor'],
              tone: 'special',
            },
          }),
          row('f5', ['18.37 · KAM-1', 'Altıparmak: ön kapıdan inenler'], {
            mag: {
              cells: ['18.37 · KAM-1', 'Parkalı adam ve yeşil bereli kadın; arka arkaya, konuşmadan'],
              tone: 'special',
            },
          }),
          row('f6', ['18.43 · KAM-4', '14 numarada oturan genç, yanındaki yolcuya dönük'], {
            play: {
              cells: ['18.43 · KAM-4', 'Cüzdanı açık tutup yanındakine gösteriyor; yolcu başını iki yana sallıyor'],
              tone: 'special',
            },
          }),
          row('f7', ['19.05 · KAM-1', 'Görükle: son durak, inen yolcular'], {
            play: {
              cells: [
                '19.05 · KAM-1',
                'Genç şoför kabinine bir cüzdan uzatıyor; şoför elini sallayıp kapıyı gösteriyor (11 sn)',
              ],
              tone: 'special',
            },
          }),
        ],
        tools: [
          tool('mag', 'Yakınlaştır', 'magnifier'),
          tool('play', 'Kareleri oynat', 'camera'),
          tool('cmp', 'Karşılaştır', 'compare'),
        ],
        costVar: 'kayit_left',
        rules: [
          examine('EX_R_MAG2', 'mag', 'f2', {
            discovers: 'clue_kare_bere',
            score: { DELIL_ANALIZI: 150 },
            feedback: found(
              'Şemsiyeyi içeride açık tutan yeşil bereli bir kadın. Şemsiye, yaşlı kadının çantasıyla kamera arasında bir perde.',
            ),
          }),
          examine('EX_R_MAG3', 'mag', 'f3', {
            discovers: 'clue_kare_parka',
            score: { DELIL_ANALIZI: 150 },
            feedback: found(
              'Koyu gri bir parka, kapüşonu başında. Eli bez çantanın içinde. Yüzü kameraya hiç dönmüyor.',
            ),
          }),
          examine('EX_R_CMP3', 'cmp', 'f3', {
            discovers: 'clue_kare_parka',
            score: { DELIL_ANALIZI: 150 },
            feedback: found(
              'Aynı kare: parkalı adam kadının arkasında, kapüşonu başında. Arda iki metre solda, kapüşonu sırtında, telefonuna bakıyor.',
            ),
          }),
          examine('EX_R_MAG4', 'mag', 'f4', {
            discovers: 'clue_kare_birakma',
            score: { DELIL_ANALIZI: 150 },
            feedback: found(
              '18.36: parkalı adam arka kapıya yürürken eğiliyor ve 14 numaranın altına koyu renk bir cisim bırakıyor.',
            ),
          }),
          examine('EX_R_MAG5', 'mag', 'f5', {
            discovers: 'clue_kare_inis',
            score: { DELIL_ANALIZI: 150 },
            feedback: found(
              '18.37, Altıparmak: parkalı adam ve yeşil bereli kadın ön kapıdan arka arkaya iniyor. Otobüste hiç oturmamışlar.',
            ),
          }),
          examine('EX_R_PLAY6', 'play', 'f6', {
            discovers: 'clue_kare_soru',
            score: { DELIL_ANALIZI: 150 },
            feedback: found(
              '18.43: CD’ye yazılamayan dakika. Arda cüzdanı açık tutup yanındakine gösteriyor. Yolcu başını sallıyor.',
            ),
          }),
          examine('EX_R_PLAY7', 'play', 'f7', {
            discovers: 'clue_kare_sofor',
            score: { DELIL_ANALIZI: 150 },
            feedback: found(
              '19.05, Görükle: Arda şoför kabinine cüzdanı uzatıyor. Şoför elini sallıyor, kapıyı gösteriyor. On bir saniye.',
            ),
          }),
        ],
        miss: fallback('FB_KAYIT', 'EXAMINE', {
          score: { DELIL_ANALIZI: -20 },
          feedback: {
            title: 'SONUÇ YOK',
            text: 'Bu karede bu aletle yeni bir şey görünmüyor.',
            label: '−20 SKOR',
            tone: 'error',
          },
        }),
        finish: { id: 'KAYIT_BITIR', label: 'Diski çıkar' },
      }),
    ),

    story('ARA_KAYIT_SON', {
      ...ARA,
      title: 'Gece yarısı',
      background: 'buro_gece',
      lines: [
        W(
          all(has('clue_kare_birakma'), has('clue_kare_inis')),
          `
Diski çıkardım. Ekran karardı; ama gözlerimin önünde hâlâ dört gri pencere vardı.
> 18.36: bir parka eğiliyor, koltuğun altına bir şey bırakıyor. 18.37: bir parka ve bir bere Altıparmak’ta iniyor. 18.42: Arda oturuyor.
> Yedi ay boyunca herkes aynı iki buçuk dakikaya baktı. Kimse altı dakika geriye sarmadı. Bir saatlik bir hafıza bir klasörde uyuyordu.
Saat gece yarısını geçmişti. Telefonu elime aldım. Leyla uyumazdı; biliyordum. Yine de iki kere çevirip kapattım.
leyla~phone: Söyle.
P: Buldum. Eksik dakikayı. Arda’nın değil. Başkasının.
leyla~phone: Gördüğün şeyi bana anlatma. Yarın kâğıda yaz. Gece görülen şeyler sabah büyür ya da küçülür. Hangisi olduğunu sabah anlarsın.
leyla~phone: Bir de… kimseyi arama. Ne Arda’yı ne savcılığı. Bu gece değil.
`,
        ),
        O(`
Diski çıkardım. Ekran karardı.
> Bir saatlik bir kaydı izledim ama hepsini görmedim. Bazı karelere doğru aletle bakmadım. Bazıları hâlâ gri bir lekeden ibaret.
> Yine de bir şey biliyorum: CD bir saatin iki buçuk dakikasıydı. Gerisi bu diskte. Yarın hâkimin önünde eksik dakikayı gösterebileceğim kadarını göstereceğim.
Telefonu elime aldım, Leyla’yı aramadım. Gece yarısı kendi eksiklerimi saymak için iyi bir saat değildi.
`),
      ],
      choices: [
        option('KS_ARDA', '“Sabah ilk iş Arda’ya söyleyeceğim.”', {
          effects: [raise('kayit_arda_haber')],
          responses: B(`
> Sabah sahafa gittim. Arda kitap etiketliyordu. “Bir kayıt geldi,” dedim. “Seni gösteriyor. Ama yalnız seni değil.” Etiket elinde kaldı.
arda: Yani… biri mi bırakmış? Ben… ben hep öyle düşündüm hocam. Ama düşünmek başka.
`),
          next: 'ARA_HUB',
        }),
        option('KS_SUS', '“Duruşmaya kadar kimseye söylemeyeceğim. Önce bağlantıları kuracağım.”', {
          effects: [raise('kayit_sakla')],
          responses: B(`
> Bazı haberleri erken vermek, onları taşıyacak kâğıt hazır olmadan bir umut vermektir. Umudun da bir ağırlığı var.
> Panoya yeni kartları iğneledim. Kırmızı iplik bir otobüsün içinden çıkıp Altıparmak’ın ıslak kaldırımına uzandı.
`),
          next: 'ARA_HUB',
        }),
      ],
    }),

    direct(
      documentExam('ARA_CAGRI', {
        ...ARA,
        title: '153 çağrı kaydı',
        background: 'buro',
        hud: ['cagri_left'],
        lines: B(`
# buro | BÜYÜKŞEHİR BELEDİYESİ · 153 ÇÖZÜM MERKEZİ DÖKÜMÜ
Üç sayfa, binlerce satır. Su kesintisi, çukur, sokak lambası, gürültü. Bir şehrin şikâyet defteri. Bir yerinde Arda’nın numarası.
`),
        header: { left: '153 ÇÖZÜM MERKEZİ · ÇAĞRI DÖKÜMÜ', right: '6 MART · 19.00–19.30' },
        columns: [
          { label: 'SAAT', flex: 0.6 },
          { label: 'ARAYAN', flex: 1 },
          { label: 'KONU', flex: 1.6 },
        ],
        rows: [
          row('c1', ['19.12', '0224 *** 18 21', 'Su kesintisi · Nilüfer']),
          row('c2', ['19.18', '05** *** ** 47', 'Ulaşım · kayıp eşya'], {
            mag: {
              cells: [
                '19.18 · 3 dk 12 sn',
                '05** *** ** 47 (sanık hattı)',
                '“Hat 38’de bulunan cüzdan. Yolcuya ertesi gün terminal kayıp eşya bürosuna teslim etmesi söylendi.”',
              ],
              tone: 'special',
            },
          }),
          row('c3', ['19.24', '05** *** ** 03', 'Ulaşım · otobüs gecikmesi']),
        ],
        tools: [tool('mag', 'Büyüteç', 'magnifier')],
        costVar: 'cagri_left',
        rules: [
          examine('EX_C_MAG2', 'mag', 'c2', {
            discovers: 'clue_cagri_notu',
            score: { DELIL_ANALIZI: 150 },
            feedback: found(
              '19.18, üç dakika on iki saniye. Operatör notu: “Hat 38’de bulunan cüzdan. Yolcuya ertesi gün terminal kayıp eşya bürosuna teslim etmesi söylendi.”',
            ),
          }),
        ],
        miss: fallback('FB_CAGRI', 'EXAMINE', {
          score: { DELIL_ANALIZI: -20 },
          feedback: { title: 'SONUÇ YOK', text: 'Bu satır dosyayla ilgili değil.', label: '−20 SKOR', tone: 'error' },
        }),
        finish: { id: 'CAGRI_BITIR', label: 'Dökümü kapat' },
      }),
    ),

    direct(
      deductionBoard('ARA_CIKARIM', {
        ...ARA,
        title: 'Çıkarım tahtası',
        background: 'buro_gece',
        lines: B(`
Panoya yeni kartlar eklendi. Kırmızı iplikler artık bir otobüsün içinden çıkıp Altıparmak’ın ıslak kaldırımına uzanıyor.
İki kart seç. Birinci evrede kurduğun çıkarımları burada yeniden kurmak puan getirmez.
`),
        pool: POOL2,
        recipes: [...RECIPES2.map((r) => araRecipe(r, '')), ...RECIPES1.map((r) => araRecipe(r, 'A'))],
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
    ),

    story('ARA_LEYLA', {
      ...ARA,
      title: 'Leyla’nın odası',
      background: 'buro',
      lines: [
        W(
          all(any(has('ded_birakan'), has('clue_kare_inis')), not(flag('suc_verildi'))),
          `
# buro | LEYLA’NIN ODASI
leyla: İki insan gördün. Biri bırakıyor, biri şemsiye tutuyor. Şimdi içinden onların peşine düşmek geçiyor. Biliyorum, yüzünden.
leyla: Avukat kovalamaz, Deniz. Bildirir. Cumhuriyet Başsavcılığına, somut delille: hangi kare, hangi saat, hangi büfe. Yüz elli sekiz.
leyla: Somut olmayan bir ihbar bir çekmecede ölür. Somut olanı birinin masasına düşer. Ve bir şey daha: kimlik tespiti senin işin değil.
`,
        ),
        W(
          all(has('ev_tam_kayit'), not(has('clue_kare_sofor'))),
          `
# buro | LEYLA’NIN ODASI
leyla: Disk geldi ama hepsini izlemedin. Bir saatlik kaydın en önemli on bir saniyesi bazen en sonda olur. Son durağa kadar izle.
leyla: Bir de şoför var. Korkan biri yalanını kürsüde değiştirir mi? Değiştirir; ama ancak bir kare onu zorlarsa.
`,
        ),
        W(
          not(flag('ek_hazir')),
          `
# buro | LEYLA’NIN ODASI
leyla: Ek savunma iki kişinin işidir: senin ve onun. Ona ne söyleyeceğini yazma. Neyi bildiğini ve neyi bilmediğini ayırmasına yardım et.
leyla: Mahkeme “özel beceri” dedi. Sen de “ne beceri ne alma” diyeceksin. Ama bir de üçüncü kapı var: yüz altmış. Oraya gitmemek için ne göstereceksin?
`,
        ),
        O(`
# buro | LEYLA’NIN ODASI
leyla: Elindekini say, sonra bir kez daha say. İkinci celsede tanık kürsüsüne çıkacak herkesin neyi gördüğünü ve neden öyle söylediğini bil.
leyla: Bir de şunu unutma: tanığı utandırma. Utanan tanık savunmaya geçer. Kendini; gerçeği değil.
`),
      ],
      choices: [home('ARA_LEYLA_DON', 'Teşekkür et')],
    }),

    {
      id: 'ARA_GULTEN',
      type: 'DIALOGUE',
      mode: 'CONVERSATION',
      ...ARA,
      title: 'Gülten Sarı',
      background: 'ev',
      room: { label: 'BEŞEVLER · GÜLTEN HANIM’IN EVİ', character: 'gulten' },
      lines: B(`
# ev | 16.00 — BEŞEVLER
Telefon bir gün önce çalmıştı. Genç bir kız sesi: “Ben Elif, Gülten Sarı’nın torunu. Babaannem sizinle konuşmak istiyor. Avukatı yok.”
> Müştekinin avukatı yok. Konuşmak isteyen o. Yine de bir çizgi var: ben dinlerim; beyanını yönlendirmem, bir şey teklif etmem, şikâyetinden söz etmem.
Küçük, tertemiz bir ev. Pencerenin önünde eski bir dikiş makinesi, üstünde yarım kalmış bir perde. Duvarda üniformalı bir adamın büyütülmüş fotoğrafı.
gulten: Geç kızım, otur. Elif, çay koy. Avukat hanım çay içer mi? İçer. Herkes içer.
Elif, on dokuz yaşlarında, telefonunu sıkıca tutuyordu. Babaannesine baktı; babaannesi başını salladı.
gulten: Mahkemede o çocuk “Facebook’tan yazdım” dedi. Ben Facebook bilmem. Elif bakar benim yerime. Eve gelince “bir de şuraya bakalım” dedi.
`),
      choices: [
        option('GL_DINLE', '“Sizi dinlemeye geldim. Ne anlatmak isterseniz.”', {
          discovers: 'clue_mesaj_istegi',
          score: { SORGULAMA: 60 },
          effects: [raise('gulten_mesaj')],
          good: 'Avukatı olmayan müştekiyle temas, onu dinlemekle sınırlı kaldı: yönlendirme, teklif ya da şikâyete dair bir söz yok. Bilgi kendiliğinden geldi.',
          category: 'SORGULAMA',
          next: '$stay',
          responses: B(`
Elif telefonu uzattı. Mesaj istekleri klasörü. En üstte, gri harflerle, okunmamış bir mesaj: 6 Mart, 21.14.
“Merhaba, 38 numaralı otobüste cüzdanınızı buldum. Size nasıl ulaştırabilirim?”
gulten.uzgun: O akşam ben karakoldaydım. O çocuk bana yazıyormuş. Ben de karakolda “cezasını çeksin” diyormuşum.
gulten: Elif bunu görünce ağladı. Ben ağlamadım. Benim yaşımda insan önce düşünür, sonra ağlar.
gulten: İsmail askerdeyken bana mektup yazardı. Bir keresinde mektubu yanlış eve bırakmışlar; komşu kadın getirdi, açmadan. “Senin bu,” dedi. Elli yıl oldu, unutmadım.
gulten: O çocuk da bana getirmeye çalışmış. Ben kapımı açmamışım. Kapıyı açmayan ben olunca, kime kızacağım şimdi?
`),
        }),
        option('GL_MAHKEME', '“Bunu mahkemeye kendiniz anlatmak ister misiniz? Size ne diyeceğinizi söylemem.”', {
          visibleWhen: flag('gulten_mesaj'),
          score: { SORGULAMA: 40 },
          effects: [raise('gulten_tanik'), inc('pers')],
          good: 'Müştekiye ne söyleyeceği değil, söyleme hakkı hatırlatıldı. Müşteki duruşmada kendi beyanını verir; avukat onu yönlendirmez.',
          category: 'SORGULAMA',
          next: '$stay',
          responses: B(`
gulten: Söyleyeceğim. Kimse bana ne diyeceğimi söylemesin, onu da söyleyeyim. Sen de söyleme.
P: Söylemem.
gulten: Ben terziyim kızım. Bir kumaşı ters dikersen sökersin, baştan dikersin. Utanılacak bir şey yok. Utanılacak olan, ters dikip giymek.
`),
        }),
        option('GL_FOTO', '“Fotoğrafı bir daha görebilir miyim?”', {
          visibleWhen: flag('foto_yerinde'),
          effects: [raise('gulten_foto')],
          next: '$stay',
          responses: B(`
Gülten Hanım cüzdanı çıkardı. Fotoğrafı kimliğin arkasından çekti, masaya koydu. Üniformalı genç bir adam, bıyıklı, gülümsüyor.
gulten: İsmail. Kırk yıl evli kaldık. Bunu cebinde taşırdı, ben de onun ölümünden sonra kendi cüzdanıma koydum.
gulten: Hırsız fotoğraf almaz, bilirsin. Ama atar. Bu atılmamış. Biri onu kimliğin arkasında bırakmış. Dokunmamış.
`),
        }),
        option('GL_SIKAYET', '“Şikâyetinizi geri alırsanız dava düşer.”', {
          score: { USUL_BILGISI: -60 },
          effects: [inc('ethics'), raise('gulten_kirildi')],
          bad: 'Hem yanlış hem yasak: hırsızlık (TCK 141) şikâyete bağlı değildir, şikâyetten vazgeçme kamu davasını düşürmez. Üstelik müştekiyi şikâyetinden döndürmeye çalışmak onu etkileme girişimidir ve meslek kurallarına aykırıdır.',
          category: 'USUL_BILGISI',
          next: 'ARA_HUB',
          responses: B(`
gulten.kizgin: Sen beni bunun için mi dinledin? Ben seni çocuk için iyi bir şey söylersin diye çağırdım. Sen bana pazarlık getirdin.
gulten: Elif, avukat hanımı geçir.
> Kapı arkamdan kapandı. Merdivenlerde Elif’in “özür dilerim” diye fısıldadığını duydum. Özür dilemesi gereken o değildi. [shake]
`),
        }),
        option('GL_PARA', '“Arda’nın ailesi zararınızı karşılamak istiyor.”', {
          score: { SAVUNMA_STRATEJISI: -60 },
          effects: [raise('gulten_kirildi'), raise('gulten_para')],
          bad: 'İnkâr eden müvekkil adına zarar ödeme teklifi, ikrar gibi okunur ve müştekinin beyanını etkileme girişimi olarak algılanabilir. Hukuken de 141’de kovuşturma bundan etkilenmez.',
          category: 'SAVUNMA_STRATEJISI',
          next: 'ARA_HUB',
          responses: B(`
gulten.kizgin: Ben para mı istedim? Ben mahkemede “paran helal olsun” dedim. Duymadın mı?
gulten: Bu teklif o çocuğun mu, senin mi? Çocuksa, demek ki almış. Sensen, demek ki sen de inanmıyorsun.
> İki yanlış cümle arasında kalan bir doğru. Elif telefonunu cebine koydu. Göstermeyecekti artık.
`),
        }),
        home('GL_BITIR', 'Teşekkür edip kalk'),
      ],
    },

    {
      id: 'ARA_CEMIL',
      type: 'DIALOGUE',
      mode: 'CONVERSATION',
      ...ARA,
      title: 'Cemil Yavuz',
      background: 'sokak_gece',
      room: { label: 'ALTIPARMAK · TEKEL BÜFE', character: 'cemil' },
      lines: [
        W(
          visited('INV_BUFE'),
          `
# sokak_gece | 18.50 — ALTIPARMAK, TEKEL BÜFE
cemil: Yine mi sen abla? Fiş kutumu ezberledin artık. Sana müşteri kartı çıkarayım, onuncu ziyaret bedava.
Radyoda yine maç vardı. Yağmur yine tentenin kenarından akıyordu. Cemil Usta’nın gözleri yine hiç durmuyordu; ama bu kez bana bakıyordu.
`,
        ),
        O(`
# sokak_gece | 18.50 — ALTIPARMAK, TEKEL BÜFE
Durağın kırk adım ötesi. Tentenin kenarından su akıyordu; radyoda bir maç.
cemil: Buyur abla. Sigara? Kontör? Yoksa avukat havasıyla bir dert mi getirdin?
P: Altı Mart, akşam yediye on kala. Burada bir kartla üç ayrı ödeme yapılmış.
cemil: Altı Mart! Abla ben dün ne yediğimi hatırlamam.
`),
      ],
      choices: [
        option('CM_FIS', '“Fişin arkasına yazdığınız notu birlikte okuyabilir miyiz?”', {
          visibleWhen: has('clue_fis_notu'),
          discovers: 'clue_cemil_tarif',
          score: { SORGULAMA: 60 },
          effects: [raise('cemil_hatirladi')],
          next: '$stay',
          responses: B(`
Cemil Usta 6 Mart destesini çıkardı, lastiğini çözdü, fişi buldu, gözlüğünü taktı.
cemil: “Yeşil bere, üç ayrı çek, şifresiz.” Benim yazım. Ters ibrazdan yandım bir kere abla, o yüzden yazarım.
cemil: Dur… Hatırladım. Islak eldiven, çıkarmadı. Şifresini unutmuş, “üçe böl” dedi. Ben de “zengin misin” dedim, gülmedi bile.
cemil: Kartın üstünde bir kadın adı vardı ama ben bakmadım. Kim bakar? Bip dedi mi, iş tamam.
`),
        }),
        option('CM_ACIK', '“O akşam aklınızda kalan tuhaf bir ödeme oldu mu?”', {
          visibleWhen: not(has('clue_fis_notu')),
          discovers: ['clue_fis_notu', 'clue_cemil_tarif'],
          score: { SORGULAMA: 60 },
          effects: [raise('cemil_hatirladi')],
          next: '$stay',
          responses: B(`
cemil: Tuhaf… Ters ibrazdan bir kere yandım, ondan beri tuhafları fişin arkasına yazarım. Dur bakayım.
Tezgâhın altından bir ayakkabı kutusu çıktı. Lastikli desteler, aylara göre. 6 Mart. 18.49. Üç fiş.
cemil: Burada. “Yeşil bere, üç ayrı çek, şifresiz.” Islak eldiven, şifresini unutmuş, gülmedi bile. Hatırladım şimdi.
`),
        }),
        option('CM_KARE', 'Tek bir kareyi gösterip “Bu kadın mıydı?” diye sor', {
          visibleWhen: has('clue_kare_bere'),
          score: { SORGULAMA: -40 },
          effects: [raise('cemil_kirli')],
          bad: 'Tanığa tek bir görüntü gösterip “bu mu?” diye sormak, Hayri Bey’e karakolda yapılanın aynısıdır: telkinli tanıma. Bu, ileride Cemil Usta’nın tanıklığını değersizleştirir; kimlik tespiti kolluğun ve savcılığın işidir.',
          category: 'SORGULAMA',
          next: '$stay',
          responses: B(`
cemil: Bere aynı… Olabilir abla. Bilmem. Sen öyle diyorsan öyledir.
> “Sen öyle diyorsan öyledir.” Karakolda Hayri Bey’e de böyle bir kare gösterilmişti. Şimdi aynı şeyi ben yaptım.
`),
        }),
        option('CM_SAVCI', '“Bunu savcılığa da anlatır mısınız? Fişlerle birlikte.”', {
          visibleWhen: flag('cemil_hatirladi'),
          score: { USUL_BILGISI: 40 },
          effects: [raise('cemil_ifade')],
          good: 'Bilgi sahibi kişiyi delille birlikte savcılığa yönlendirmek doğru yol: ifadeyi avukat değil, yetkili makam alır (CMK 158, 160).',
          category: 'USUL_BILGISI',
          next: '$stay',
          responses: B(`
cemil: Savcılık mı? Abla benim dükkânı kim bekleyecek?
Bir süre radyoyu dinledi. Maçta bir gol oldu; sevinmedi.
cemil: Yaşlı bir kadının kartıymış, değil mi? Annem de yaşlı. Tamam. Fişleri de götürürüm. Ama sabah erken, öğleden sonra müşteri çok.
`),
        }),
        home('CM_BITIR', 'Teşekkür et'),
      ],
    },

    {
      id: 'ARA_SUC',
      type: 'CHOICE',
      ...ARA,
      title: 'Suç duyurusu (CMK 158)',
      background: 'buro',
      prompt: { speaker: 'narrator', text: 'Kim hakkında, hangi somut delille? Suç duyurusu bir kez verilir.' },
      lines: B(`
> Bir dilekçe daha. Bu kez mahkemeye değil, Cumhuriyet Başsavcılığına. Başkası hakkında, başkasının dosyasına.
> Somut olmayan bir ihbar bir çekmecede ölür. Somut olanı birinin masasına düşer.
`),
      choices: [
        option('SUC_DAYANAKLI', 'Kare dökümü, büfe fişi ve banka saatleriyle, kimliği belirsiz iki kişi hakkında', {
          visibleWhen: has('ded_birakan'),
          score: { USUL_BILGISI: 80 },
          effects: [raise('suc_duyurusu'), raise('suc_verildi')],
          good: 'İhbar somut: hangi kamera, hangi saat, hangi işyeri, hangi tutar. Kimlik tespiti ve yakalama kolluğun işi; avukat bilgiyi yetkili makama iletir (CMK 158).',
          category: 'USUL_BILGISI',
          next: 'ARA_HUB',
          responses: B(`
> Dilekçeye kare numaralarını, saatleri, büfenin adresini ve fişin fotoğrafını ekledim. Kimseye isim vermedim; isim bilmiyordum.
Nöbetçi savcılığın kalemi dilekçeyi aldı, damgaladı. “Hırsızlık bürosuna gider,” dedi memur. “Orada bir başkomiser var, bu işlere bakar.”
`),
        }),
        option('SUC_GENEL', '“Bursa’daki yankesici şebekesi” hakkında genel bir suç duyurusu', {
          score: { USUL_BILGISI: -30 },
          effects: [raise('suc_verildi')],
          bad: 'Kimin, ne zaman, neyi yaptığını göstermeyen bir ihbar somut değildir; işlem görmeden kalır. Elindeki kareleri ve saatleri eklemeden verilen dilekçe bir hak harcamaktır.',
          category: 'USUL_BILGISI',
          next: 'ARA_HUB',
          responses: B(`
Nöbetçi savcılığın memuru dilekçeyi okudu, bana baktı.
@MEMUR: Şebeke… Hangi şebeke abla? Bursa’da kaç şebeke var biliyor musun? Ekle bir şey, kim, ne zaman. Yoksa bu dosya rafta yaşlanır.
`),
        }),
        option('SUC_SOFOR', 'Şoför Recep Ateş hakkında yalan beyandan suç duyurusu', {
          score: { SAVUNMA_STRATEJISI: -40 },
          effects: [raise('recep_sucduyurusu'), raise('suc_verildi')],
          bad: 'Tanık henüz duruşmada dinlenmeden onun hakkında suç duyurusunda bulunmak, onu kendini koruyan bir şüpheliye dönüştürür: kürsüde kendisini suçlayabilecek sorulara cevap vermekten çekinebilir (CMK 48). Gerçeği kürsüde, kayıtla göstermek daha güçlüydü.',
          category: 'SAVUNMA_STRATEJISI',
          next: 'ARA_HUB',
          responses: B(`
Dilekçe damgalandı. İki gün sonra Kent Ulaşım’ın hukuk müşavirliğinden bir telefon geldi: “Sürücümüz bir avukatla temsil edilecektir.”
> Bir tanığı bir şüpheliye çevirdim. Şüpheliler konuşmaz; avukatları konuşur.
`),
        }),
        home('SUC_VAZGEC', 'Şimdilik verme'),
      ],
    },

    story('ARA_YANLIS', {
      ...ARA,
      title: 'Altıparmak, 18.37',
      background: 'sokak_yagmur',
      onFirstEnter: [score('SAVUNMA_STRATEJISI', -40), raise('yanlis_gitti'), dec('trust', 5)],
      lines: B(`
# sokak_yagmur | 18.30 — ALTIPARMAK DURAĞI
Durağın camlı sığınağında, yağmurun altında bekledim. Her Hat 38 geldiğinde inenlere baktım. Parka. Bere. Şemsiye.
Kırk dakikada on bir otobüs. Yüzlerce yüz. Gri parkalı otuz adam. Biri bana dönüp “bir sorun mu var?” diye sordu. Yoktu. Ben vardım.
Telefon çaldı. Leyla.
leyla~phone: Neredesin? Melek Hanım seni Altıparmak’ta görmüş, adliye otobüsünden. Ne yapıyorsun orada?
P: Bekliyorum. Belki yine o hattadırlar.
leyla~phone: Bulursan ne yapacaksın, Deniz? Yakalayacak mısın? Kolundan tutup “siz misiniz” mi diyeceksin? Ya bıçakları varsa? Ya yanlış kişiyse?
leyla~phone: Avukat kovalamaz. Bildirir. Kâğıdını yaz, savcılığa ver, bir başkomiserin masasına koy. Sonra işine dön: müvekkiline.
> Kapattı. Islak bankta bir süre daha oturdum. Bir saatimi ve yarım günümü yağmura verdim. Karşılığında bir ders aldım. Pahalı bir ders.
`),
      choices: [
        cont('YANLIS_DON', 'Büroya dön', 'ARA_HUB', {
          role: 'PRIMARY',
          quality: {
            q: 'BAD',
            feedback:
              'Şüphelileri aramak, izlemek ya da yakalamaya çalışmak avukatın görevi değildir ve hem kendini hem soruşturmayı tehlikeye atar. Bilgiyi Cumhuriyet Başsavcılığına iletmek gerekir (CMK 158).',
            category: 'SAVUNMA_STRATEJISI',
          },
        }),
      ],
    }),

    {
      id: 'ARA_ARDA',
      type: 'DIALOGUE',
      mode: 'CONVERSATION',
      ...ARA,
      title: 'Ek savunma',
      background: 'ev',
      room: { label: 'ZEHRA’NIN EVİ · HASTANE LOJMANI', character: 'arda' },
      lines: B(`
# ev | 20.00 — HASTANE LOJMANI
Zehra’nın evi küçüktü: bir oda, bir mutfak, kapı arkasında asılı iki hemşire forması. Masada mercimek çorbası, üç kaşık, bir dosya.
Arda çorbasına dokunmamıştı. Zehra iki gecelik uykusuzlukla bir sandalyede oturuyordu.
zehra: Söyleyin avukat hanım. Ne diyecek? Ben bilmem, siz bilirsiniz.
P: Ek savunma, savcının “özel beceri” cümlesine cevap. Arda, sana ne diyeceğini yazmayacağım. Ne yaşadıysan onu söyleyeceksin.
`),
      choices: [
        option('AA_DOGRU', '“Bildiğini söyle, bilmediğini söyleme. ‘Hatırlamıyorum’ da bir cevaptır.”', {
          score: { SAVUNMA_STRATEJISI: 60 },
          effects: [raise('ek_hazir'), inc('trust', 5)],
          good: 'Sanığa doğruyu söylemesi ve bilmediğini uydurmaması öğütlendi. Avukat sanığın beyanını hazırlayabilir ama içeriğini yazamaz; yalana yönlendirmek meslek kurallarına aykırıdır.',
          category: 'SAVUNMA_STRATEJISI',
          next: '$stay',
          responses: B(`
arda: Bildiğimi söyleyeyim. Bilmediğimi söylemeyeyim. (yavaşça tekrar eder) Bu iyi. Bunu çocuklara da söylerdim.
zehra: Ya hâkim inanmazsa?
P: O zaman inanması için başka bir şey göstereceğiz. Arda’nın işi doğruyu söylemek. Benim işim onun doğrusunu kayıtla göstermek.
arda: Hocam, bir şey sorabilir miyim? Siz bana inanıyor musunuz?
> Bir müvekkilin avukatına sorabileceği en zor soru. Cevabın ne olduğu değil, ne zaman verildiği önemlidir.
P: Ben kayda inanıyorum, Arda. Kayıt da sana inanıyor.
`),
        }),
        option('AA_LISE', '“Lisedeki geceyi mahkemede anlatmak ister misin? Zorunda değilsin.”', {
          visibleWhen: all(flag('fact_polis_neden'), not(flag('arda_utanc_mahkemede'))),
          effects: [raise('arda_lise_hazir'), inc('trust', 3)],
          next: '$stay',
          responses: B(`
Arda kaşığını bıraktı. Zehra ona baktı; ilk defa ablası gibi değil, bir yabancı gibi. Sonra yine ablası gibi.
arda: Anlatırım. Utanıyorum ama anlatırım. Bir sınıfa girip “korkma” diyeceksem, önce kendim korkmamalıyım.
zehra.uzgun: Annem o sabahı hâlâ anlatır. Karakolun önündeki bankı. Soğuktu, der.
`),
        }),
        option('AA_CERCEVE', 'Zehra’ya ek savunmanın hukuki çerçevesini anlat', {
          score: { HUKUKI_BILGI: 40 },
          effects: [raise('ek_cerceve')],
          next: '$stay',
          responses: B(`
P: Üç kapı var. Savcı en büyüğünü istiyor: özel beceriyle hırsızlık. İddianame ortadakini: basit hırsızlık. Bir de en küçüğü: kaybolmuş eşyayı teslim etmemek.
P: Bizim derdimiz hiçbir kapıdan girmemek. Hırsızlık için birinin elinden bir şey almak gerekir. Arda kimsenin elinden almadı.
P: Küçük kapı için de “sahibi gibi davranmak” gerekir: harcamak, saklamak, kullanmak. Arda şoföre uzattı, aradı, yazdı. Sahibi gibi değil; sahibini arayan biri gibi.
zehra: Yani… o küçük kapı da kapalı mı?
P: Kapalı olduğunu göstermemiz lazım. Göstereceğiz.
`),
        }),
        option(
          'AA_IKRAR',
          '“Zehra haklı olabilir. Kabul eder, zararı öder, hükmün açıklanmasının geri bırakılmasını isteriz.”',
          {
            next: 'ARA_ARDA_IKRAR',
            responses: B(`
Odada bir sessizlik oldu. Zehra’nın yüzünde bir rahatlama belirdi; Arda’nın yüzünde başka bir şey.
arda.saskin: Kabul mü? Neyi kabul edeceğim hocam? Ben almadım ki.
zehra: Arda, beş yıl diyorlar! Öde, imzala, bitsin. Sicile işlemiyormuş!
`),
          },
        ),
        home('AA_BITIR', 'Vedalaş'),
      ],
    },
    {
      id: 'ARA_ARDA_IKRAR',
      type: 'CHOICE',
      ...ARA,
      title: 'Ek savunma',
      background: 'ev',
      prompt: { speaker: 'arda', expression: 'uzgun', text: 'Siz de mi inanmıyorsunuz bana, hocam?' },
      choices: [
        option('IKRAR_ISRAR', '“İnanmam önemli değil. Önemli olan riski küçültmek. Kabul et.”', {
          score: { SAVUNMA_STRATEJISI: -300 },
          effects: [raise('false_confession'), inc('ethics'), dec('trust', 30)],
          bad: 'İnkâr eden ve suçsuzluğunu söyleyen müvekkili suçu kabule yönlendirmek, avukatın sadakat ve doğruluk yükümlülüğüne aykırıdır (Avukatlık Kanunu md. 34). Gerçeğe aykırı ikrar, suçu üstlenme (TCK 270) kapsamına girebilir. Etkin pişmanlık (TCK 168) gerçek bir pişmanlık ister.',
          category: 'SAVUNMA_STRATEJISI',
          next: 'ARA_HUB',
          responses: B(`
Arda uzun süre bana baktı. Sonra Zehra’ya. Sonra soğumuş çorbasına.
arda: Peki. Siz bilirsiniz hocam. Siz avukatsınız.
> “Siz bilirsiniz.” Bir müvekkilin avukatına söyleyebileceği en ağır cümle. Ve ben onu hak ettim.
Zehra ağlıyordu. Rahatlamadan mı, utançtan mı, bilmiyorum. Kapıdan çıkarken kimse bana iyi geceler demedi.
`),
        }),
        option('IKRAR_GERI', '“Hayır. Haklısın. Yanlış bir cümle kurdum. Doğruyu söyleyeceksin.”', {
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('trust', 10), raise('ek_hazir')],
          bad: 'Geri adım doğru; ama inkâr eden müvekkile ikrar seçeneğini masaya koymak bile güveni sarstı.',
          category: 'SAVUNMA_STRATEJISI',
          next: 'ARA_HUB',
          responses: B(`
P: Hayır. Haklısın Arda. Yanlış bir cümle kurdum. Kabul edecek bir şeyin yok. Doğruyu söyleyeceksin.
zehra.kizgin: Ama…
P: Zehra Hanım, HAGB bir af değil. Arda’nın yapmadığı bir şeyi yaptım demesi demek. Tutanakta kalır. Kendi içinde kalır.
Arda başını salladı. Ama bana bakmadı. Bir süre daha bakmayacaktı.
`),
        }),
      ],
    },

    story('ARA_SON', {
      ...ARA,
      title: 'Duruşmadan önceki gece',
      background: 'buro_gece',
      lines: B(`
Leyla kapımda belirdi. Paltosu kolunda, bir elinde iki bardak çay. Birini masama bıraktı. Öbürünü bıraktığı gibi, yarım içecekti.
leyla: Yarın ilk cümlen ne olacak?
> İlk cümle. Bir duruşmada ilk cümle bir pencere açar; gerisi o pencereden görünür.
`),
      choices: [
        option('AS_EKSIK', '“Kayıt eksikti. Şimdi tam.”', {
          effects: [raise('ilk_cumle_kayit')],
          responses: B(`
leyla: İyi. Kısa. Kimseyi suçlamıyor. Savcıyı bile. Eksik kaydı savcı yapmadı; bir gece yarısı, bir yorgun memur, bir yorgun teknisyen yaptı.
leyla: Yarın kimseyi utandırma. Utanan tanık kendini savunur, gerçeği değil.
`),
          next: 'H2_00',
        }),
        option('AS_MASUM', '“Müvekkilim masum.”', {
          effects: [raise('ilk_cumle_masum')],
          responses: B(`
leyla: Bunu hâkim söyleyecek, sen değil. Sen yalnızca neyin eksik olduğunu, neyin tamamlandığını göster.
leyla: Masumiyet bir sonuçtur, Deniz. Bir açılış cümlesi değil.
`),
          next: 'H2_00',
        }),
      ],
    }),

    decisionNode('ARA_SON_4', [{ to: 'ARA_SON' }], {
      lines: [
        W(
          flag('kayit_arda_haber'),
          `
> Arda’ya kaydı erken söyledim. O günden beri her mesajının sonunda bir soru işareti var. Umut da bir yük; onu da ben verdim.
`,
        ),
        W(
          flag('kayit_sakla'),
          `
> Kaydı Arda’ya söylemedim. Yarın salonda ilk kez görecek. Bir sürprizin iki yüzü vardır: sevindirir ya da sarsar.
`,
        ),
        W(
          any(flag('serkan_anlatti'), flag('serkan_cd'), flag('serkan_kizgin')),
          `
> Görükle karakolunun kapısı durağın tam karşısında. Kırk adım. Arda o kırk adımı yürüdü ve döndü. Ben yürüdüm ve içeri girdim. Fark bir korkudan ibaret.
`,
        ),
        W(
          any(flag('ozan_hazir'), flag('ozan_anlatti')),
          `
> Ozan “ölçtüğümü söylerim” dedi. Bir mühendisten iyi bir tanık çıkar; yeter ki ona ne söyleyeceğini kimse ölçmeye kalkmasın.
`,
        ),
        W(
          any(flag('volkan_segment'), flag('ek_cerceve'), flag('ara_aksam_dakika'), flag('ara_aksam_ikisi')),
          `
> Leyla “kazanmayı mı, eksik dakikayı mı” diye sormuştu. Bu gece ikisinin aynı yere çıkıp çıkmayacağını bilmiyorum. Yarın öğreneceğim.
`,
        ),
      ],
    }),

    // Duruşmadan önce: koşullu hafıza zinciri; suç duyurusunun sonucu burada belirlenir.
    decisionNode('ARA_SON_1', [{ to: 'ARA_SON_2' }], {
      ...ARA,
      onFirstEnter: [
        ifThen(all(flag('suc_duyurusu'), has('ded_bere_ayni'), flag('cemil_ifade')), [raise('sebeke_yakalandi')]),
      ],
      lines: [
        W(
          flag('sebeke_yakalandi'),
          `
# buro_gece | 16 KASIM · PAZAR 22.00 — ARSLAN HUKUK
Telefon akşam yedide çalmıştı. Kendini Başkomiser Orhan Kılınç diye tanıtan ağır, kuru bir ses.
orhan~phone: Avukat hanım, dilekçeniz masama geldi. Karelerinize ve büfecinin ifadesine bakınca bir şey dikkatimi çekti. Bende aynı yöntemle altı dosya var.
orhan~phone: Dün akşam Hat 19’da bir çift yakalandı: bir adam, bir kadın. Üzerlerinden on dört banka kartı çıktı. Birinin üstünde “G. SARI” yazıyor.
orhan~phone: Yarın mahkemeniz var, değil mi? Savcılık beni tanık olarak bildirdi. Orada görüşürüz.
> Eksik dakikanın sahibi bulunmuştu. Ben bulmamıştım. Bir başkomiser, bir büfeci, bir fişin arkasındaki kurşun kalem bulmuştu. Ben yalnızca kâğıdı doğru masaya koymuştum.
`,
        ),
        W(
          flag('suc_duyurusu'),
          `
# buro_gece | 16 KASIM · PAZAR 22.00 — ARSLAN HUKUK
Savcılıktan kısa bir yazı gelmişti: “Kimliği belirsiz şüpheliler hakkında soruşturma başlatılmıştır; kimlik tespiti çalışmaları sürmektedir.”
> Kâğıdı doğru masaya koydum. Ama masada isim yok. Bir karede bir parka, bir karede bir bere. Yarın hâkimin önünde onlar hâlâ birer gölge olacak.
`,
        ),
        O(`
# buro_gece | 16 KASIM · PAZAR 22.00 — ARSLAN HUKUK
Yarın ikinci celse. Panoya bakıyorum. Kartlar yer değiştirdi; bazıları düştü, bazıları kırmızı iplikle birbirine bağlandı.
`),
      ],
    }),
    decisionNode('ARA_SON_2', [{ to: 'ARA_SON_3' }], {
      lines: [
        W(
          any(has('ded_birakan'), has('clue_kare_birakma')),
          `
> Kayıt: cüzdan Arda’ya gelmeden önce başka birinin elindeydi. 18.36’da biri onu koltuğun altına bıraktı. Bu, yarın salonun ortasına koyacağım şey.
`,
        ),
        W(
          has('ev_tam_kayit'),
          `
> Kayıt geldi ama hepsini okuyamadım. Bir saatlik bir hafızanın bir kısmı hâlâ karanlıkta. Yarın elimdekiyle gideceğim.
`,
        ),
        O(`
> Tam kayıt yok. Eksik dakika hâlâ eksik. Yarın bunu kendi cümlemle doldurmaya çalışmayacağım; eksikliğin kendisini göstereceğim.
`),
      ],
    }),
    decisionNode('ARA_SON_3', [{ to: 'ARA_SON_4' }], {
      lines: [
        W(
          flag('false_confession'),
          `
> Arda yarın “kabul ediyorum” diyecek. Benim yüzümden. Panodaki kartlar şimdi bana bakıyor; hepsi aynı soruyu soruyor.
`,
        ),
        W(
          flag('gulten_tanik'),
          `
> Gülten Hanım yarın kendi cümlesini söyleyecek. Ona ne diyeceğini söylemedim. Bu, bu dosyada yaptığım en doğru şeylerden biri olabilir.
`,
        ),
        O(`
> Arda’ya mesaj attım: “Kendi gömleğin, kendi cümlen.” Cevap tek kelimeydi: “Tamam.”
`),
      ],
    }),
  ],
  triggers: [
    {
      id: 'tg_ara_day',
      scope: 'ARA_HUB',
      priority: 1,
      when: all(cmp(v('ara_ap'), '<=', 0), cmp(v('ara_day'), '<', ARA_DAYS)),
      goto: 'ARA_DAY_END',
    },
  ],
  discoveryPaths: deliveries.discoveryPaths,
};
