import {
  back,
  decisionNode,
  fallback,
  flags,
  has,
  meet,
  sceneSearch,
  story,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, O, W, retarget } from './dsl.js';
import { INV } from './shared.js';

// 54-investigation-yerler: vezne salonu araması ve Kılıçların evi (Nazan, Elif, Orhan’ın çalışma masası).

const vezne = sceneSearch('INV_VEZNE', {
  ...INV,
  title: 'Vezne salonu',
  hud: ['taps_v'],
  exposeCounts: true,
  scene: 'sc_vezne',
  background: 'buro',
  instruction: 'Salonda dikkatini çeken yere dokun. Her dokunuş bir büyüteç hakkı yer.',
  costVar: 'taps_v',
  lines: B(`
# CUMA 10.40 — HİSARÖNÜ BELEDİYESİ, VEZNE SALONU [bg:buro]
> Vezne salonu gündüz başka bir yerdi: sıra fişi makinesi öttükçe biri kalkıyor, biri oturuyordu. Kalorifer peteklerinin üstünde ıslak eldivenler kuruyordu.
> Vezne 1’de Melek, kulağında telefon, bir eliyle para sayıyordu. Vezne 2’nin camında bir kâğıt: “KAPALI — Lütfen Vezne 1’e başvurunuz.”
> Güvenlik görevlisi kartıma baktı, avukat kimliğime baktı, sonra bana. “Mükellef gibi gezin abla, kimseye bir şey sormayın, ben bir şey görmedim.”
~ Bir suç mahallinde değilim. Bir işyerindeyim. Burada her şey yerinde; tuhaf olan da bu.
`),
  miss: fallback('FB_VEZNE', 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  }),
  finish: { id: 'VEZNE_BITIR', label: 'Salondan çık' },
});

const evGiris = decisionNode('INV_EV_G', [{ to: 'INV_EV' }], {
  ...INV,
  title: 'Kılıçların evi',
  onFirstEnter: [meet('nazan')],
  lines: B(`
# CUMARTESİ 16.00 — YILDIRIM, DÖRDÜNCÜ KAT [bg:ev]
> Asansörsüz bir apartman. Her katta başka bir yemek kokusu: birinci katta kızartma, ikincide pekmez, üçüncüde çamaşır suyu. Dördüncüde dikiş makinesinin tıkırtısı.
> Nazan kapıyı ağzında iğnelerle açtı. Arkasında, salonun ortasında bir manken; üstünde iğnelenmiş bir gelinlik.
nazan: Gel avukat hanım. Kusura bakma, provası yarın. Orhan servisle gelecek, yarım saate. Elif içeride, ders çalışıyor; yani telefon.
> Duvarlarda raptiyeyle tutturulmuş çizimler: kalpler, bir kuş, bir hastane yatağı, bir de kalemle çizilmiş gözlüklü bir adam. Altında: “BABAM — HESAP UZMANI.”
nazan: Elif çizdi. Hastanedeyken. Her gün bir tane. O gözlüklüyü en çok sever.
nazan: Orhan’ın masası şurada. Kimse dokunmaz; ben toz bile almam. Bir kâğıdın yerini değiştirsem üç gün arar, bulunca “burada değildi” der.
nazan: Bak, ne istersen. Bu evde saklanacak bir şey yok. Olsa ben bilirdim; yirmi iki yıldır cebini ben boşaltıyorum çamaşırdan önce.
~ Saklanacak bir şey yok. Ama saklanmış bir şey olabilir. İkisi aynı şey değil.
`),
});

const ev = retarget(
  sceneSearch('INV_EV', {
    ...INV,
    title: 'Orhan’ın çalışma masası',
    hud: ['taps_e'],
    exposeCounts: true,
    scene: 'sc_calisma',
    background: 'ev',
    instruction: 'Masada ve raflarda dikkatini çeken yere dokun. Her dokunuş bir büyüteç hakkı yer.',
    costVar: 'taps_e',
    miss: fallback('FB_EV', 'TAP', {
      score: { ARASTIRMA: -10 },
      feedback: { text: 'Sıradan bir köşe. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
    }),
    finish: { id: 'EV_BITIR', label: 'Masadan kalk' },
  }),
  'INV_EV_SON_1',
);

const evSon1 = decisionNode('INV_EV_SON_1', [{ to: 'INV_EV_SON' }], {
  ...INV,
  title: 'Kılıçların evi',
  lines: [
    W(
      has('ev_talimat'),
      `
> Kapı açıldı. Orhan servisten inmiş, merdivenleri çıkmış, nefes nefese. Masasının başında beni, elimde kareli bir kâğıtla görünce olduğu yerde durdu.
orhan/uzgun: O kâğıt… O kâğıdı nereden… Ben onu bordroların arasına…
nazan: Ne kâğıdı Orhan? Ne var o kâğıtta?
> Orhan cevap vermedi. Paltosunu çıkarmadan sandalyesine oturdu. Gözlüğünü çıkardı, sildi, yeniden taktı. Sonra bir daha çıkardı.
orhan: Herkes verdi efendim. Ben de verdim. Yönergeyi biliyordum.
nazan: Neyi verdin Orhan? Neyi?
~ Mahkemede söylenmesi gereken bir cümle, bir terzinin salonunda, bir gelinliğin önünde yarım kaldı. Gerisini büroda, sakin bir saatte sormalıyım.
`,
    ),
    O(`
> Kapı açıldı. Orhan servisten inmiş, merdivenleri çıkmış. Masasının başında beni görünce bir an durdu, sonra gülümsemeye çalıştı.
orhan: Bir şey buldunuz mu efendim? Her şey yerindedir. Ben her şeyi yerinde tutarım.
nazan: Avukat hanım yorulmuştur Orhan, bir çay koy.
> Çay geldi. Kalkarken raflardaki mavi klasörlere bir kez daha baktım. Bordrolar, makbuz koçanları, yıllar. Hepsine bakmadım.
`),
  ],
});

const evSon = story('INV_EV_SON', {
  ...INV,
  title: 'Kılıçların evi',
  background: 'ev',
  lines: [
    O(`
> Merdivenleri inerken üçüncü kattan bir televizyon sesi geldi; ikincide pekmez kokusu soğumuştu. Sokağa çıktığımda yağmur başlamıştı.
> Dördüncü katın penceresinde bir silüet: Elif, telefonu elinde, aşağı bakıyordu. El salladım. O da salladı; sonra perdeyi çekti.
~ Bir kız, bir “hesap uzmanı” çizimi, bir gelinlik. Bu evde herkes birini bekliyor; kimse ne zaman geleceğini bilmiyor.
`),
  ],
  choices: [back('EV_SON_DON', 'Büroya dön')],
});

export const invPlaces: CasePart = {
  variables: flags('fact_vz02', 'fact_onoda', 'fact_kasa_kod', 'fact_turnike', 'fact_talimat', 'fact_9ocak'),
  nodes: [vezne, evGiris, ev, evSon1, evSon],
};
