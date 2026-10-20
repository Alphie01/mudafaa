import {
  any,
  cont,
  decisionNode,
  deliver,
  flag,
  has,
  inc,
  nav,
  option,
  rawChoice,
  raise,
  score,
  set,
  story,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef } from '../../../tools/content/src/kit/index.js';
import { B, O, W } from './dsl.js';
import { ARA2, ARA2_AP } from './shared.js';

// 70-ara-2: 2. ve 3. celse arası (tek gün, 2 EP; yığınsız). Leyla çerçeveyi çevirir; 2004 arşivi; savcılığa bildirim ya da
// yüzleşme; baba ile oğul; son duruşmadan önceki gece.

const HUB = 'ARA2_HUB';
const act = (id: string, label: string, to: string, opts: Partial<ChoiceDef> = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { cost: [{ var: 'ara2_ap', amount: 1 }], next: to, maxUses: 1, ...opts });

const giris = deliver('ARA2_G0', [
  { evidence: 'ev_sesli', requires: flag('ara_dil_sesli'), hint: 'Sesli mesajın bilirkişi incelemesini iste.' },
]);

const cerceveGiris = decisionNode('ARA2_G0', [{ to: 'ARA2_GIRIS' }], {
  ...ARA2,
  title: 'Çerçeve',
  onEnter: [set('in_court', false), set('ara2_ap', ARA2_AP), ...giris.effects],
  lines: [
    W(
      flag('sahte_ikrar'),
      `
# GECE 23.30 — ARSLAN HUKUK [bg:buro_gece]
> Büroda bir tek Leyla’nın ışığı yanıyordu. Kapısı açıktı; beni bekliyordu.
> Masasının köşesindeki çerçeve düz duruyordu. İlk kez. Leyla onu bana çevirmedi; kendine çevirmişti. Bakıyordu.
leyla: Gel. Otur. Bugün bir çocuk salonda “yaptım” dedi. Ben çıktım. Dinleyemedim.
`,
    ),
    O(`
# GECE 23.30 — ARSLAN HUKUK [bg:buro_gece]
> Büroda bir tek Leyla’nın ışığı yanıyordu. Kapısı açıktı; beni bekliyordu.
> Masasının köşesindeki çerçeve düz duruyordu. İlk kez. Leyla onu bana çevirmedi; kendine çevirmişti. Bakıyordu.
leyla: Gel. Otur. Bugün iyi iş çıkardın. Bunu söylemek için çağırmadım ama.
`),
  ],
});

const cerceve = story('ARA2_GIRIS', {
  ...ARA2,
  title: 'Çerçeve',
  background: 'buro_gece',
  lines: [
    O(`
> Çerçeveyi kaldırdı, masanın üstünden bana doğru itti. Eski, renkleri solmuş bir fotoğraf.
> Bir cezaevi kapısı. Demir, gri, bir gardiyan kulübesi. Kapının önünde yirmi beş yaşlarında, saçları kısacık kesilmiş bir adam. Kucağında üç dört yaşlarında bir çocuk; çocuğun elinde bir oyuncak kepçe.
> Adam gülmüyordu. Çocuk gülüyordu.
leyla: 2008. Tahliye günü. Kemal ve oğlu. Emir. Fotoğrafı ben çektim.
leyla: Meral çocuğu getirmişti. Kemal kapıdan çıktı, çocuğu kucağına aldı ve bana baktı. “Bir fotoğraf çekin avukat hanım” dedi. “İçeride kaybettiğim dört yılın ilk günü.”
~ On dört dava boyunca o masanın köşesinde ters duran şey buymuş. Bir çocuk ve bir kepçe. Bir çocuk ki şimdi bir cinayetle yargılanıyor; bir kepçe ki şimdi bir bıçak.
leyla: Bir yıl sonra terazinin Ercan’ın olduğunu öğrendim. Kemal’e söyledim. Bana baktı ve “fotoğrafı sakla” dedi. “Her gün bak ona.”
leyla: Baktım. On yedi yıl. Sonra bakamadım; ters çevirdim. Ters çevirince de baktım aslında.
> Sigara paketini aldı. Bu kez açtı. İçinden bir sigara çıkardı, parmaklarının arasında tuttu. Yakmadı.
leyla: Bir şey daha var Deniz. Bugün o adam kürsüde “Gemlik” dedi. Kemal’in yüzünü gördüm.
leyla: 2004’te arama tutanağında üç ad vardı. Evde o gece üç kişi bulunmuş. Ben ikisini okudum: müvekkilimi ve teraziyi saklayanı. Üçüncüsünü okumadım. Bir “misafir.” Önemsiz bir ad.
leyla: Dosya Bursa 2. Ağır Ceza’nın arşivinde. 2004/311 Esas. Kendi notlarım bende; ama o notlar Kemal’in sırrıdır, benim değil.
~ Yirmi iki yıl önce okunmamış bir ad. Bu dosyada herkes bir satırı atlamış: polis, savcı, Leyla. Belki ben de.
`),
  ],
  choices: [
    option('CR_NEDEN', '“Bunu bana neden şimdi anlatıyorsunuz?”', {
      effects: [raise('leyla_acik')],
      responses: B(`
leyla: Çünkü yarın son duruşma. Ve yarın biri sana kolay bir yol gösterecek; ya bir ikrar, ya bir öfke, ya bir yarım kâğıt.
leyla: Ben yorgunken kolay yolu seçtim. Sen yorgunsun. Bunu bilmeni istedim.
`),
      next: HUB,
    }),
    option('CR_KEMAL', '“Kemal Bey’e bu fotoğrafı göstermeli misiniz?”', {
      effects: [raise('leyla_kemal')],
      responses: B(`
leyla: Kemal bu fotoğrafı ezbere bilir. Ona gösterilecek bir fotoğraf değil, söylenecek bir cümle borçluyum.
leyla: O cümleyi yarından sonra söyleyeceğim. Kazansak da, kaybetsek de.
`),
      next: HUB,
    }),
    option('CR_SUS', 'Fotoğrafa bak, bir şey söyleme', {
      responses: B(`
> Bir şey söylemedim. Fotoğrafı elime aldım; çocuğun kepçesine, adamın gülmeyen yüzüne baktım. Leyla da bir şey söylemedi.
> Radyatör tıkırdadı. Dışarıda yağmur. Bir süre sonra Leyla çerçeveyi geri aldı; ters çevirmedi. Masanın köşesine düz koydu.
`),
      next: HUB,
    }),
  ],
});

const hub = {
  id: HUB,
  type: 'INVESTIGATION' as const,
  ...ARA2,
  title: 'Son duruşmaya üç hafta',
  background: 'buro' as const,
  hud: ['ara2_ap'],
  lines: B(`
# İKİNCİ ARA · SON DURUŞMAYA 18 GÜN
> Hedef: iki eylem puanı, üç hafta. Bir arşiv, bir savcı, bir baba. Neye harcayacaksın?
`),
  tabs: [
    { id: 't_ara2', label: 'KARARLAR', kind: 'ARCHIVE' as const, choices: ['B_ARSIV', 'B_BILDIR', 'B_YUZLES', 'B_AILE'] },
  ],
  choices: [
    act('B_ARSIV', '2004 dosyası', 'ARA2_ARSIV', { description: 'Bursa 2. Ağır Ceza · 2004/311' }),
    act('B_BILDIR', 'Savcılığa yazılı bildirim', 'ARA2_BILDIR', {
      description: 'CMK 158 · bildiklerini yaz',
      visibleWhen: any(has('ded_mektup'), has('ded_gomlek'), has('ded_canli'), has('ded_kasa'), has('ded_kamera')),
    }),
    act('B_YUZLES', 'Toker Balık’a git; Tarık’la konuş', 'ARA2_YUZLES', { description: 'Mudanya · gece' }),
    act('B_AILE', 'Kemal ile Emir', 'ARA2_AILE', { description: 'Baba ile oğul' }),
    nav('B_DURUSMA', 'DURUŞMAYA GİT · SON CELSE', 'ARA2_SON', {
      role: 'PRIMARY',
      confirm: 'Son duruşmaya gidiyorsun. Emin misin?',
    }),
  ],
};

const arsiv = story('ARA2_ARSIV', {
  ...ARA2,
  title: '2004/311',
  background: 'buro',
  lines: B(`
> Yirmi iki yıllık bir dosya. Bir arşivin bodrumunda, bir rafta, toz ve ip arasında. İki yol var.
~ Leyla’nın çekmecesindeki notlar bir kat yukarıda. Arşivdeki dosya bir mahkeme yazısı uzaklıkta.
`),
  choices: [
    option('AR_MAHKEME', 'Mahkemeden 2004/311 dosyasının getirtilmesini iste', {
      score: { USUL_BILGISI: 100 },
      effects: [raise('arsiv_talep'), inc('legal_hits')],
      good: 'Kesinleşmiş bir dosyanın arama tutanağı resmî belgedir; mahkeme kanalıyla getirtilir (CMK 206, 209). Avukatın müvekkil notlarına dokunmadan aynı bilgiye ulaştın.',
      category: 'USUL_BILGISI',
      responses: B(`
> Dilekçe kısa: “Bursa 2. Ağır Ceza Mahkemesi’nin 2004/311 Esas sayılı dosyasındaki arama ve el koyma tutanağının getirtilmesi.” Gerekçe: baş tanığın kürsüdeki beyanı.
> Kâtip dilekçeyi aldı, mühürledi. “Arşiv iki hafta sürer” dedi. “Ama sürer.”
~ Yirmi iki yıllık bir ad, iki haftalık bir yolculuğa çıktı.
`),
      next: HUB,
    }),
    option('AR_NOT', 'Leyla’nın notlarını fotokopiyle dosyaya koy', {
      effects: [inc('ethics'), raise('leyla_not'), score('SAVUNMA_STRATEJISI', -60)],
      bad: 'Leyla’nın 2004 notları müvekkil Kemal Yalçın’ın sırrıdır; onun açık rızası olmadan istemek ve kullanmak meslek sırrına aykırıdır (Av.K. 36). Üstelik aynı bilgi arşivde resmî bir tutanak olarak duruyor.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
> Leyla’nın odasına girdim. Çekmeceyi açmasını istedim.
leyla: Hayır. Bu notlar Kemal’in. Kemal’in avukatıyla konuşmalarının notları. Ben bile onlara dokunamam; sen hiç dokunamazsın.
leyla: Arşive yaz. Aynı ad orada resmî bir tutanakta duruyor. Sır değil; kimse okumamış, o kadar.
~ Bir kolay yol vardı; Leyla onu bir çekmeceyle kapattı. Bir dilekçe yazmam gerekiyor.
`),
      next: 'ARA2_ARSIV',
    }),
  ],
});

const bildir = story('ARA2_BILDIR', {
  ...ARA2,
  title: 'Savcılık',
  background: 'adliye',
  onEnter: [raise('bildirdi')],
  lines: [
    W(
      any(has('ded_canli'), has('ded_mektup')),
      `
# PERŞEMBE 09.30 — BURSA CUMHURİYET BAŞSAVCILIĞI [bg:adliye]
> Savcı Selim Karaman’ın odası küçüktü: dosya yığınları, bir saksı, sararmış bir takvim. Dilekçemi okudu. İki kez. Ekleri tek tek çevirdi.
savci: Sesli mesaj. Bir not bloğunun izi. Bir gömlek. Bir kasa raporu. Ve bir ad; daha doğrusu iki harf.
savci: Bunu bana getirdiniz. Duruşmada sürpriz yapmak yerine.
- Bu bir sürpriz değil Sayın Savcım. Bir suç duyurusu. Birini bulmak benim işim değil.
> Savcı gözlüğünü çıkardı. İlk kez gülümsediğini gördüm; yorgun, kısa.
savci: Değil. Benim işim. Kayıtları ben isterim, aramayı hâkim kararıyla ben yaptırırım. Siz müvekkilinizi savunun avukat hanım; ben de gerçeği. Bazen aynı yere çıkar bu iki yol.
savci: Bir şey daha. İddianameyi yazarken o mesajın devamını okumamıştım. Bir polis “tasarlama açık” dedi, ben de yazdım. Bunu size söylememem gerekir; söylüyorum.
`,
    ),
    O(`
# PERŞEMBE 09.30 — BURSA CUMHURİYET BAŞSAVCILIĞI [bg:adliye]
> Savcı Karaman dilekçemi okudu. Bir kasa raporu, bir kamera, bir gömlek; ama bir mektup yok, bir ses yok.
savci: Bir tanığın saatleri tutmuyor. Bir tanık gömlek değiştirmiş. Avukat hanım, bunlar bir yalan tanıklığın işaretleri olabilir; bir cinayetin değil.
- Bir suç duyurusu Sayın Savcım. Araştırılmasını talep ediyorum.
savci: Araştırırım. Ama mahkemede bana bundan fazlasını getirmeniz gerekecek.
`),
  ],
  choices: [cont('BILDIR_DON', 'Büroya dön', HUB, { role: 'PRIMARY' })],
});

const yuzles = story('ARA2_YUZLES', {
  ...ARA2,
  title: 'Mudanya',
  background: 'kafe',
  onEnter: [raise('tarik_yuzlesme')],
  lines: B(`
# CUMA 23.10 — TOKER BALIK [bg:kafe]
> Meyhane kapanmak üzereydi. Neonun I’sı yine yanmıyordu. Tarık Sezer kasanın başındaydı; beni görünce gülümsedi, bir bardak çay koydu.
tarik: Avukat hanım. Hoş geldiniz. Bir şey mi lazım?
- Lacivert gömleğiniz nerede Tarık Bey?
> Gülümseme yerinde kaldı; gözleri değil. Çayı tezgâha koydu.
tarik: Gömlek mi? Ben… avukat hanım, siz beni mi suçluyorsunuz? Bir tanığı? İş yerinde, gece yarısı?
tarik: Yarın sabah Baro’ya yazarım. Savcıya da yazarım. Siz de o zaman anlatırsınız, gece yarısı neden bir tanığın kapısına geldiğinizi.
> Kasayı kapattı. Z raporu tıkırdayarak çıktı; saatine bakmadım bile. Kapıyı arkamdan kilitledi. {shake}
~ Avukat kovalamaz. Bunu Leyla yüz kere söyledi. Bir adamı bir soruyla uyardım; şimdi o soru ona bir gece kazandırdı. O gece ne yapacağını bilmiyorum.
`),
  choices: [cont('YUZLES_DON', 'Büroya dön', HUB, { role: 'PRIMARY' })],
});

const aile = story('ARA2_AILE', {
  ...ARA2,
  title: 'Baba ile oğul',
  background: 'gorus_odasi',
  onEnter: [raise('aile_baris'), inc('trust', 10)],
  lines: [
    W(
      flag('released'),
      `
# CUMARTESİ 17.00 — HAMİTLER [bg:ev]
> Mutfak masası. Emir bir yanda, Kemal öbür yanda; aralarında bir demlik. Meral salonda dikiş dikiyordu; makinenin sesi yavaşladı, durdu.
- Kemal Bey, Emir sizden bir şey duymak istiyor. Benden değil.
> Kemal ellerine baktı. Sonra konuştu; yirmi iki yıl sonra, ilk kez, baştan sona.
kemal: Bir bodrum katı vardı. Üç yatak. Bir dolap. Bir gece kapı kırıldı. Dolapta bir terazi.
kemal: Benim değildi. Avukatım bana inanmadı. “İkrar et” dedi. Ettim. Sen doğdun; ben içerideydim. İlk adımını bir görüş odasında attın. Bunun gibi bir odada.
emir/uzgun: Neden anlatmadın baba? Yirmi iki yıl…
kemal: Utandım. Yapmadığım bir şeyi yaptım dedim. Bunu sana nasıl anlatırdım? “Baban bir yalan söyledi ve dört yıl ona yattı” mı?
> Emir elini cama koydu. Kemal bir süre baktı; sonra kendi elini camın öbür tarafına, aynı yere koydu.
emir: Ben yapmadım baba.
kemal: Biliyorum. Yaptım deme. Ne olursa olsun deme.
~ Bir baba yirmi iki yıl sonra oğluna bir cümle söyledi. Leyla’nın o gün söylemediği cümle.
`,
    ),
    O(`
# CUMARTESİ 10.00 — CEZAEVİ GÖRÜŞ SALONU [bg:gorus_odasi]
> Kemal’i görüşe ben getirdim. Camın bir tarafında baba, öbür tarafında oğul. Telefon ahizeleri.
- Kemal Bey, Emir sizden bir şey duymak istiyor. Benden değil.
> Kemal ahizeyi kulağına götürdü. Bir süre konuşmadı. Sonra konuştu; yirmi iki yıl sonra, ilk kez, baştan sona.
kemal: Bir bodrum katı vardı. Üç yatak. Bir dolap. Bir gece kapı kırıldı. Dolapta bir terazi.
kemal: Benim değildi. Avukatım bana inanmadı. “İkrar et” dedi. Ettim. Sen doğdun; ben içerideydim. İlk adımını bir görüş odasında attın. Bunun gibi bir odada.
emir/uzgun: Neden anlatmadın baba? Yirmi iki yıl…
kemal: Utandım. Yapmadığım bir şeyi yaptım dedim. Bunu sana nasıl anlatırdım? “Baban bir yalan söyledi ve dört yıl ona yattı” mı?
> Emir elini cama koydu. Kemal bir süre baktı; sonra kendi elini camın öbür tarafına, aynı yere koydu.
emir: Ben yapmadım baba.
kemal: Biliyorum. Yaptım deme. Ne olursa olsun deme.
~ Bir baba yirmi iki yıl sonra oğluna bir cümle söyledi. Leyla’nın o gün söylemediği cümle.
`),
  ],
  choices: [cont('AILE_DON', 'Büroya dön', HUB, { role: 'PRIMARY' })],
});

const son = story('ARA2_SON', {
  ...ARA2,
  title: 'Son gece',
  background: 'sokak_yagmur',
  lines: [
    W(
      flag('tarik_yuzlesme'),
      `
# PAZARTESİ 23.50 — ARSLAN HUKUK [bg:buro_gece]
> Baro’dan bir yazı geldi: “Hakkınızda yapılan şikâyet hakkında savunmanız.” Tarık Sezer yazmış. Masamın köşesine koydum.
leyla: Yarın son duruşma. Benim için değil; onun için. Bir de: yarın bir adam kürsüde sana bakacak. Ona bir kez baktığın için seni şikâyet etti. İkinci kez bakma; kâğıtlarını göster. [phone]
> Pencereyi açtım. Yağmur dinmek üzereydi. Uludağ’ın üstünde bulutlar yırtılmış, arasından bir yıldız görünüyordu. Bursa’da nadir bir şey. {flash}
~ On beş dava. Hepsinde bir kapı çalındı. Yarın son kez bir salonun kapısı açılacak; arkasında bir çocuk, bir baba, bir kadın ve bir fotoğraf.
`,
    ),
    O(`
# PAZARTESİ 23.50 — ARSLAN HUKUK [bg:buro_gece]
> Panoyu son kez topladım. Raptiyeleri tek tek çıkardım, kırmızı ipi sardım. Ortadaki boşluğa bir şey yazmadım.
leyla: Yarın son duruşma. Benim için değil; onun için. Uyu. [phone]
> Pencereyi açtım. Yağmur dinmek üzereydi. Uludağ’ın üstünde bulutlar yırtılmış, arasından bir yıldız görünüyordu. Bursa’da nadir bir şey. {flash}
~ On beş dava. Hepsinde bir kapı çalındı. Yarın son kez bir salonun kapısı açılacak; arkasında bir çocuk, bir baba, bir kadın ve bir fotoğraf.
`),
  ],
  choices: [cont('ARA2_SON_DEVAM', 'Adliyeye git', 'T3_00G_1', { role: 'PRIMARY' })],
});

export const ara2: CasePart = {
  nodes: [cerceveGiris, cerceve, hub, arsiv, bildir, yuzles, aile, son],
  discoveryPaths: [...giris.discoveryPaths],
};
