import {
  all,
  any,
  back,
  cmp,
  cont,
  decisionNode,
  flag,
  has,
  inc,
  nav,
  not,
  option,
  raise,
  ref,
  set,
  story,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { NodeDef } from '../../../tools/content/src/kit/index.js';
import { B, O, W } from './dsl.js';
import { INV, p1 } from './shared.js';

// 50-investigation (hub): 3 gün × 3 EP. Etkinlikler, Leyla’ya danış, gün sonları ve duruşmadan önceki gece.

export const hubChoices = {
  olay: [
    p1.activity('H_OFIS', 'Olay yeri fotoğraflarını ara', 'INV_OFIS', {
      once: true,
      description: '46 kare · büyüteç 6',
    }),
    p1.activity('H_MUTFAK', 'Toker Balık’ın mutfağına git', 'INV_MUTFAK_G', {
      once: true,
      description: 'Mudanya · servis öncesi',
    }),
    p1.activity('H_EV', 'Yalçınların evine git', 'INV_EV_G', {
      once: true,
      description: 'Hamitler · Meral Hanım',
    }),
  ],
  cezaevi: [
    p1.activity('H_GORUS', 'Emir’le görüş', 'INV_GORUSME_G', {
      description: 'Görüş salonunun kapanışına 14 dk',
      visibleWhen: not(visited('INV_GORUSME')),
    }),
    p1.activity('H_GORUS2', 'Tekrar görüş', 'INV_GORUSME_G', {
      description: 'Görüş salonunun kapanışına 8 dk',
      visibleWhen: visited('INV_GORUSME'),
      maxUses: 1,
    }),
  ],
  tanik: [
    p1.activity('H_SULEYMAN', 'Süleyman Çiftçi', 'INV_SULEYMAN', {
      once: true,
      description: 'Bulaşıkçı · savcılık tanığı',
    }),
    p1.activity('H_KEMAL', 'Kemal Yalçın', 'INV_KEMAL_G', {
      once: true,
      description: 'Baba · Demirtaş, gece vardiyası',
    }),
  ],
  arsiv: [
    p1.activity('H_IFADE', 'Baş tanığın ifadesini incele', 'INV_IFADE', {
      once: true,
      description: 'Tarık Sezer · 15.11 01.30',
    }),
    p1.activity('H_HTS', 'Maktulün arama dökümünü incele', 'INV_HTS', {
      once: true,
      description: 'İddianamede anılmıyor',
    }),
    p1.activity('H_TEL', 'Emir’in telefon raporunu oku', 'INV_TEL', {
      once: true,
      description: 'Bilişim büro raporu',
    }),
    p1.activity('H_DIL', 'Delil talebi dilekçesi', 'INV_DIL', {
      description: '3 talep hakkı',
      visibleWhen: not(flag('dil_verildi')),
    }),
    p1.free('H_CIKARIM', 'Çıkarım tahtası', 'INV_CIKARIM', {
      description: '0 EP · ipuçlarını birleştir',
      enabledWhen: ref('kart2'),
      lockedReason: 'En az 2 ipucu gerekli.',
    }),
    p1.free('H_LEYLA', 'Leyla’ya danış', 'INV_LEYLA', {
      description: '0 EP · günde bir kez',
      visibleWhen: cmp(v('leyla_gun'), '<', v('day')),
      effects: [set('leyla_gun', v('day'))],
    }),
  ],
};

const hubLines = [
  W(
    cmp(v('day'), '==', 1),
    `
# GÜN 1/3 · BİRİNCİ CELSEYE 11 GÜN
> Hedef: savcının tasarlama hikâyesinin üç ayağı var: bir mesaj, bir taş, bir bekleyiş. Her birinin kâğıdını bul.
`,
  ),
  W(
    all(cmp(v('day'), '==', 2), any(has('clue_tarik_saat'), has('clue_tarik_bicak'))),
    `
# GÜN 2/3 · BİRİNCİ CELSEYE 8 GÜN
> Hedef: baş tanığın saatleri ve gördükleri. Olay yeri ve öbür tanık onunla aynı şeyi mi söylüyor?
`,
  ),
  W(
    cmp(v('day'), '==', 2),
    `
# GÜN 2/3 · BİRİNCİ CELSEYE 8 GÜN
> Hedef: dosyanın tek görgü tanığı ne gördüğünü söylüyor? Onun ifadesini henüz satır satır okumadın.
`,
  ),
  O(`
# GÜN 3/3 · BİRİNCİ CELSEYE 5 GÜN
> Hedef: dilekçe bugün çıkmalı. Kürsüde bulaşıkçıya ne soracaksın; hangi kâğıdı göstereceksin?
`),
];

export const hub = p1.hub({
  ...INV,
  title: 'Soruşturma',
  background: 'buro',
  lines: hubLines,
  scenePreview: { scene: 'sc_ofis' },
  tabs: [
    { id: 't_olay', label: 'OLAY YERİ', kind: 'SCENE', choices: hubChoices.olay },
    { id: 't_cezaevi', label: 'CEZAEVİ', kind: 'PEOPLE', choices: hubChoices.cezaevi },
    { id: 't_tanik', label: 'TANIKLAR', kind: 'PEOPLE', choices: hubChoices.tanik },
    { id: 't_arsiv', label: 'ARŞİV', kind: 'ARCHIVE', choices: hubChoices.arsiv },
  ],
  quickTalk: {
    character: 'emir',
    line: '“Bağırdım abla. Bağırdım ve çıktım. O kadar.”',
    choices: ['H_GORUS', 'H_GORUS2'],
  },
  choices: [
    nav('H_DURUSMA', 'DURUŞMAYA GİT · 1. CELSE', 'INV_GECE_1', {
      role: 'PRIMARY',
      confirm: 'Duruşmaya gidersen soruşturma biter. Emin misin?',
    }),
  ],
});

// --- Leyla ---

export const leyla = story('INV_LEYLA', {
  ...INV,
  title: 'Leyla’ya danış',
  background: 'buro',
  lines: [
    W(
      cmp(v('day'), '==', 1),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
> Leyla’nın kapısı aralıktı. İçeri girdiğimde bir dosya kapattı; ters çerçevenin yanına, düz.
leyla: Soruyorsun, ben de cevap veriyorum. Anlaşmamız bu.
leyla: Tasarlama dört şey ister. Bir: suç işleme kararıyla fiil arasında makul bir zaman. İki: o zaman boyunca kararda sebat. Üç: soğukkanlılık. Dört: bir plan, bir hazırlık.
leyla: Yargıtay bunları tek tek arar; biri eksikse tasarlama yoktur, 82 düşer, 81 kalır.
leyla: Savcının elinde bir pazartesi mesajı, bir çarşamba fişi, bir cuma bekleyişi var. Üç gün, üç kâğıt. Kararı pazartesiye, hazırlığı çarşambaya, sebatı cumaya koyuyor.
leyla: Kâğıtları savcının sırasıyla değil, kendi sırasıyla oku. Bir mesajın tamamını. Bir fişin neden kesildiğini. Bir bekleyişin kimin isteği olduğunu.
~ Leyla dört maddeyi parmaklarıyla saydı. Beşinci parmağı havada kaldı; bir şey söyleyecekti, söylemedi.
`,
    ),
    W(
      cmp(v('day'), '==', 2),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Tanıklar. Bu dosyada iki kişi o koridordaydı: bir bulaşıkçı ve bir ortak. Biri bir bağırış duydu, öbürü bir kaçış gördü.
leyla: İki tanığın anlattığı aynı geceyse, saatleri de aynı olmalı. Değilse biri yanılıyor. Hangisinin yanıldığını onlara değil, saatlere sor.
leyla: Bir de şunu unutma: tanığa ne diyeceğini söylediğin an o senin tanığın olur. Senin tanığın da kimsenin tanığı değildir.
leyla: Bulaşıkçı yaşlı bir adammış. Yaşlı insanlar saat sormaz; dolmuş sorar, ezan sorar, bir dizinin başlangıcını sorar. Onun saatini bul.
leyla: Bir de şu: ilk ifadeyi tek başına okuma. Yanına öbür kâğıtları koy; tutanağı, telefon kaydını, olay yeri fotoğraflarını. Kâğıtlar birbirini okur.
> Leyla bir an pencereye baktı. Yağmur Uludağ’ın yamacından aşağı iniyordu.
leyla: Bir saat iki kâğıtta farklı yazıyorsa hangisinin doğru olduğuna sen karar verme. Üçüncü bir kâğıt bul; bir makine, bir fiş, bir sefer çizelgesi.
`,
    ),
    O(`
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Tahrik. Savcı “kin” diyecek, sen de belki “tahrik” demek isteyeceksin. Dikkat et.
leyla: Haksız tahrik bir öfkenin hukukudur: haksız bir fiil, onun yarattığı hiddet ya da şiddetli elem. Kabul edilirse ağırlaştırılmış müebbet on sekiz yirmi dört yıla, müebbet on iki on sekiz yıla iner.
leyla: Ama öfke ile plan aynı odada zor oturur. Tahrik dediğin an savcı “demek öfkelendi” der; sen “demek plan yoktu” dersin. İkisi de doğrudur; biri müvekkilini on iki yıl içeride tutar.
leyla: Müvekkilin “yapmadım” diyorsa, onun hikâyesini önce sen bozma. Terditli savunma bir kapıdır; ama o kapıdan girenin geri dönmesi zordur.
> Sigara paketini avucunda çevirdi. Açmadı.
leyla: Yirmi iki yıl önce bir çocuğa “olmazsa indirim” dedim. Sonra “olmazsa”yı unuttum; yalnızca indirim kaldı.
`),
  ],
  choices: [back('LEYLA_DON', 'Teşekkür et')],
});

// --- Gün sonları ---

export const dayEnd = decisionNode(
  'INV_DAY_END',
  [{ when: cmp(v('day'), '==', 2), to: 'INV_AKSAM1' }, { to: 'INV_AKSAM2' }],
  {
    ...INV,
    title: 'Gün sonu',
    onEnter: [inc('day', 1), set('ap', 3)],
  },
);

export const aksam1 = story('INV_AKSAM1', {
  ...INV,
  title: 'İlk akşam',
  background: 'buro_gece',
  lines: [
    W(
      flag('leyla_kapi'),
      `
# GECE 22.30 — ARSLAN HUKUK [bg:buro_gece]
> Leyla gitmeden kapımda durdu. Paltosu kolunda.
leyla: Kemal’e “Leyla Hanım bu dosyada olmayacak” demişsin. Doğru yaptın. Bir müvekkile verilecek ilk şey, istediği mesafedir.
leyla: Bir şey soracağım, sonra gideceğim. Bu dosyada kimin hikâyesini savunuyorsun?
`,
    ),
    O(`
# GECE 22.30 — ARSLAN HUKUK [bg:buro_gece]
> Leyla gitmeden kapımda durdu. Paltosu kolunda, şemsiyesi elinde.
leyla: Bir şey soracağım, sonra gideceğim. Bu dosyada kimin hikâyesini savunuyorsun?
`),
  ],
  choices: [
    option('AK1_EMIR', '“Emir’in.”', {
      effects: [set('aksam1', 'EMIR')],
      responses: B(`
leyla: Güzel. Unutma: Emir’in hikâyesi o gece saat on bir buçukta başlıyor. Yirmi iki yıl önce değil.
leyla: Babasının hikâyesi bu dosyaya sızmak isteyecek. Savcı da bunu isteyecek. Sen o geceyi savun.
~ Kapı kapandı. Masamda bir dosya, panoda bir saat: 23.55. Benim saatim henüz yoktu.
`),
      next: 'INV_HUB',
    }),
    option('AK1_KEMAL', '“Kemal’in. Yirmi iki yıl önce başlamış bir hikâye bu.”', {
      effects: [set('aksam1', 'KEMAL')],
      responses: B(`
leyla: Yirmi iki yıl önceki hikâyenin avukatı bendim. Onu savunmak senin işin değil, benim borcum.
leyla: Sen o geceyi savun. Kemal’in hikâyesi o geceye bir şey katıyorsa, kâğıtla katsın.
~ Leyla bunu söylerken sesi değişmedi. Ama kapıyı kapatırken bir an durdu; elini kolun üstünde tuttu.
`),
      next: 'INV_HUB',
    }),
    option('AK1_KENDI', '“Belki kendiminkini. On beşinci dava bu.”', {
      effects: [set('aksam1', 'KENDI')],
      responses: B(`
leyla: Her avukat bir gün kendi hikâyesini savunur. Kaybettiği ilk müvekkili, söz verdiği bir anne, yanlış bir rakam.
leyla: O gün geldiğinde masaya bir çerçeve koyarsın ve onu ters çevirirsin. Sonra yıllar geçer.
> Leyla kendi odasının yönüne baktı. Sonra bana.
leyla: Kendi hikâyeni savunma, Deniz. Bende işe yaramadı.
`),
      next: 'INV_HUB',
    }),
  ],
});

export const aksam2 = story('INV_AKSAM2', {
  ...INV,
  title: 'Gece telefonu',
  background: 'buro_gece',
  lines: B(`
# GECE 23.10 — ARSLAN HUKUK [bg:buro_gece]
> Telefon çaldı. Kayıtlı olmayan bir numara. Açtım.
tarik: Avukat hanım? Kusura bakmayın saat geç. Tarık Sezer. Ercan’ın ortağı. [phone]
tarik: Numaranızı karakoldan aldım; Yavuz Bey eski müşterimizdir. Sizi rahatsız etmek istemem. Sadece… bir şey lazım olursa diye. [phone]
tarik: O çocuğa da üzülüyorum, inanın. Ercan çok severdi onu. Çarşamba taş almış, bıçağını bilemiş; kimin aklına gelir böyle bir şey. [phone]
> Bir sessizlik. Hattın öbür ucunda bir televizyon, bir buzdolabının homurtusu.
tarik: Mahkemede görüşeceğiz zaten. Ben ne gördüysem onu söyleyeceğim. Size de kolay gelsin. [phone]
~ Bir tanık, gece yarısına elli dakika kala, bir sanığın avukatını arıyor. Nazik, yardımsever, üzgün.
~ Bir de taşı biliyor. Fiş bir cüzdandan çıktı; o cüzdanı polis açtı.
`),
  choices: [
    option('AK2_KAPAT', '“İyi geceler Tarık Bey. Mahkemede görüşürüz.”', {
      responses: B(`
- Teşekkür ederim Tarık Bey. Mahkemede görüşürüz. İyi geceler.
tarik: İyi geceler avukat hanım. Ercan da size iyi geceler derdi; o kadar kibar bir adamdı. [phone]
> Hat kapandı. Telefonun ekranında numarası bir süre daha kaldı; sonra karardı.
~ Tanıkla dosyayı telefonda konuşmam. Bunu biliyordum. O da biliyordu; o yüzden aradı belki.
`),
      next: 'INV_HUB',
    }),
    option('AK2_TAS', '“Taşı nereden biliyorsunuz?”', {
      effects: [raise('fact_tas_bilgi')],
      responses: B(`
- Bileği taşını nereden biliyorsunuz Tarık Bey?
tarik: Polis söyledi. Yavuz Bey. O gece ifade verirken. Yanlış bir şey mi söyledim? [phone]
- Hayır. Merak ettim.
tarik: Merak iyidir. Ercan da meraklıydı. İyi geceler avukat hanım. [phone]
~ Bir komiser, bir tanığa, ifade verirken bir delil anlatmış. Ya da tanık bunu öyle hatırlıyor. İkisi de bir kâğıda yazılmalı.
`),
      next: 'INV_HUB',
    }),
    option('AK2_ANLAT', '“Kamera kaydını inceleteceğim; arızalı mıydı göreceğiz.”', {
      effects: [raise('tarik_uyarildi')],
      bad: 'Tanığa kürsüde soracağın soruyu telefonda verdin; hazırlıklı gelecek. Tanıkla dosyayı konuşmak meslek açısından da risklidir (Av.K. 34).',
      category: 'SORGULAMA',
      responses: B(`
- Kamera kaydını inceleteceğim Tarık Bey. Arızalı mıydı, değil miydi, göreceğiz.
> Hattın öbür ucunda kısa bir sessizlik. Televizyonun sesi kısıldı.
tarik: Tabii. İnceletin. Ben de merak ediyorum zaten. İyi geceler avukat hanım. [phone]
~ Bir soru verdim; karşılığında bir sessizlik aldım. Kürsüde o sessizliği bir daha duymayacağım.
`),
      next: 'INV_HUB',
    }),
  ],
});

// --- Duruşmadan önceki gece ---

export const gece: NodeDef[] = [
  decisionNode('INV_GECE_1', [{ to: 'INV_GECE_2' }], {
    ...INV,
    title: 'Duruşmadan önceki gece',
    lines: B(`
# PAZARTESİ 23.20 — ARSLAN HUKUK [bg:buro_gece]
> Panoyu son kez topladım. Raptiyeler, kırmızı ipler, bir yığın fotokopi. Ortada bir saat yazılı kâğıt: 23.55.
`),
  }),
  decisionNode('INV_GECE_2', [{ to: 'INV_GECE_3' }], {
    lines: [
      W(
        all(has('ded_davet'), any(has('ded_bileme'), has('ded_niyet'))),
        `~ Savcının masasının iki ayağı sallanıyor: bekleyiş bir davetti, taş bir talimattı ya da mesaj bir soruydu. Tasarlama bir zihin hâliyse, o zihin kâğıtlarda yok.`,
      ),
      W(
        any(has('ded_davet'), has('ded_bileme'), has('ded_niyet')),
        `~ Tasarlamanın bir ayağını kestim. Öbürleri duruyor. Masa sallanıyor ama ayakta.`,
      ),
      O(`~ Bir mesaj, bir taş, bir bekleyiş. Savcının hikâyesi bu gece de kendi sırasıyla duruyor.`),
    ],
  }),
  decisionNode('INV_GECE_3', [{ to: 'INV_GECE_3B' }], {
    lines: [
      W(
        all(has('ded_saat'), any(has('ded_onluk'), has('ded_bicak_yeri'))),
        `~ Baş tanığın gördüğü çocuk ne o saatte çıktı, ne o hâlde. Bulaşıkçı ve kırk altı kare aynı şeyi söylüyor.`,
      ),
      W(
        any(has('ded_saat'), has('ded_onluk'), has('ded_bicak_yeri')),
        `~ Baş tanığın ifadesinde bir çatlak var. Yarın o yokken bulaşıkçı kürsüde olacak; çatlağı orada açabilirim.`,
      ),
      W(
        has('clue_dolmus'),
        `~ Süleyman çocuğu 23.40’ta, elleri boş gördü. Bu cümleyi yarın kürsüde, tutanağa geçecek biçimde duymam lazım.`,
      ),
      O(`~ Baş tanığın 23.55’i hâlâ panonun ortasında. Ona karşı koyacak bir saatim yok.`),
    ],
  }),
  decisionNode('INV_GECE_3B', [{ to: 'INV_GECE_4' }], {
    lines: [
      W(
        all(flag('fact_sessiz'), flag('fact_istasyon')),
        `~ Şef Nuri: “Bütün hafta tek kelime etmedi.” Bir bıçak tezgâhta kaldı; bir çanta açık. Kin anlatan bir çocuk değil, susan bir çocuk.`,
      ),
      W(
        any(flag('fact_dolap'), flag('fact_arka_kapi')),
        `~ Bir mutfağın haritası aklımda: bir arka kapı, bir bulaşıkhane, altı dolap. Herkesin dolabında yedek bir üst. Not aldım; nedenini bilmeden.`,
      ),
      W(
        flag('fact_tas_bilgi'),
        `~ Bir tanık bir delili bir komiserden duymuş. Bu dosyada herkes birbirine bir şey anlatmış; yalnızca sanığa kimse bir şey sormamış.`,
      ),
      W(
        flag('fact_aramalar'),
        `~ Ercan Toker eylülden beri aramış. Bir adam yirmi iki yıl sonra bir telefon numarasını aylarca çevirir mi? Bir borç ödenmek ister.`,
      ),
      O(`~ Dosyanın kenarlarına bakmadım belki. Kenarlar, ortadan daha çok şey söyler.`),
    ],
  }),
  decisionNode('INV_GECE_4', [{ to: 'INV_GECE_5' }], {
    lines: [
      W(
        flag('suleyman_kocluk'),
        `~ Süleyman’a “kesin söyleyin” dedim. Yaşlı bir adamın gözlerindeki korku: kime, neyi kesin?`,
      ),
      W(flag('tarik_uyarildi'), `~ Tarık Sezer’e kamerayı söyledim. Telefondaki sessizlik hâlâ kulağımda.`),
      W(
        flag('sesli_korundu'),
        `~ Kemal’in telefonunda iki aydır dinlenmemiş bir ses vardı. Artık bir bilirkişinin masasına gidecek. Bir ölünün sesi.`,
      ),
      W(
        cmp(v('aksam1'), '==', 'KENDI'),
        `~ “Kendi hikâyeni savunma.” Leyla’nın sesi. Masamda ters çevrilecek bir çerçeve yok; henüz.`,
      ),
      O(`~ Emir’in sesi: “Bağırdım abla. Bağırdım ve çıktım.” Yarın bunu dokuz kişi daha duyacak.`),
    ],
  }),
  decisionNode('INV_GECE_5', [{ to: 'INV_GECE' }], {
    lines: [
      W(
        flag('kemal_durust'),
        `
> Telefon titredi. Kemal. Vardiya arası; arkada bir forkliftin geri vites sinyali.
kemal: Yarın Meral de gelecek. Ben… ben arka sırada otururum. O kadın da gelecek mi? [phone]
- Leyla Hanım dinleyici olarak gelecek.
kemal: Gelsin. Görsün. [phone]
> Kapattı. “Görsün”ün devamını söylemedi.
`,
      ),
      O(`
> Telefon titredi. Meral’den bir mesaj: “Emir’e temiz gömlek götürdüm. Gardiyan aldı. Allah yardımcınız olsun.”
~ Yarın bir çocuk temiz bir gömlekle kürsüye çıkacak. Annesi gece yarısı ütülemiş.
`),
    ],
  }),
];

export const geceSon = story('INV_GECE', {
  ...INV,
  title: 'Duruşmadan önceki gece',
  background: 'sokak_yagmur',
  lines: B(`
> Leyla’dan tek bir mesaj, gece yarısına beş kala.
leyla: Yarın o yaşlı adam kürsüde titrerse ona saati sorma. Dolmuşu sor. [phone]
> Pencereyi açtım. Yağmur Bursa’nın çatılarına, Mudanya’nın iskelesine, cezaevinin avlusuna aynı anda yağıyordu. {flash}
~ Bir bağırış, bir bıçak, bir saat. Yarın sabah dokuzda biri bana soracak: “Müdafi, diyeceğiniz?”
`),
  choices: [cont('GECE_DEVAM', 'Adliyeye git', 'H1_00G_1', { role: 'PRIMARY' })],
});
