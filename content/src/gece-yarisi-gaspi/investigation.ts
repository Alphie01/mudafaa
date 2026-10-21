import {
  all,
  any,
  back,
  cmp,
  conversation,
  cont,
  costOf,
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
  interview,
  meet,
  mood,
  nav,
  not,
  option,
  raise,
  recipe,
  ref,
  row,
  sceneSearch,
  score,
  set,
  story,
  tool,
  topic,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef, Cond, Effect } from '../../../tools/content/src/kit/index.js';
import { B, O, T, W, retarget } from './dsl.js';
import { INV, p1 } from './shared.js';

// 50-investigation: 3 gün × 4 EP. Olay yeri (merdiven, ev, acil), cezaevi görüşmesi, tanıklar (bakkal, komşu,
// hemşire, komiser yardımcısı, mağdurun kapısı), arşiv (teşhis tutanağı, 112 dökümü, kesinti kaydı, dilekçe, tahta).

const dayEndDeliveries = deliver('INV_DAY_END', [
  { evidence: 'ev_uedas', requires: flag('dil_uedas'), hint: 'Kesinti kaydını dilekçeyle UEDAŞ’tan iste.' },
  { evidence: 'ev_gozlem', requires: flag('dil_gozlem'), hint: 'Hemşire gözlem formunu dilekçeyle hastaneden iste.' },
]);
const nightDeliveries = deliver('INV_GECE_1', [
  { evidence: 'ev_uedas', requires: flag('dil_uedas'), hint: 'Kesinti kaydını dilekçeyle UEDAŞ’tan iste.' },
  { evidence: 'ev_gozlem', requires: flag('dil_gozlem'), hint: 'Hemşire gözlem formunu dilekçeyle hastaneden iste.' },
]);

/** Tahtada bir çıkarımı yalnızca ilk kurulumda ödüllendirir (alternatif tarifler için). */
const firstTime = (ded: string, amount = 300): Effect[] => [
  ifThen(not(has(ded)), [discover(ded), score('DELIL_ANALIZI', amount)]),
];

const feedbackNew = (title: string, text: string, label = 'YENİ DELİL · +300 SKOR') => ({
  title,
  text,
  label,
  tone: 'success' as const,
});

// --- Hub ---

const hubChoices = {
  olay: [
    p1.activity('H_ARAMA', 'Olay yeri fotoğraflarını ara', 'INV_ARAMA', {
      once: true,
      description: '19 Ocak 01.10 fotoğrafları · büyüteç 6',
    }),
    p1.activity('H_EV', 'Kılınçların evine git', 'INV_EV_G', {
      once: true,
      description: 'Yıldırım · Derya ve Sevim Hanım',
    }),
    p1.activity('H_ACIL', 'Acil servise git', 'INV_ARAMA3', {
      once: true,
      description: 'Devlet Hastanesi · kamuya açık koridor',
    }),
  ],
  cezaevi: [
    p1.activity('H_GORUS', 'Barış’la görüş', 'INV_GORUSME_G_1', {
      description: 'Görüş salonunun kapanışına 14 dk',
      visibleWhen: not(visited('INV_GORUSME')),
    }),
    p1.activity('H_GORUS2', 'Tekrar görüş', 'INV_GORUSME_G_1', {
      description: 'Görüş salonunun kapanışına 8 dk',
      visibleWhen: visited('INV_GORUSME'),
    }),
  ],
  tanik: [
    p1.activity('H_T_ALI', 'Ali Rıza Tunç', 'INV_T_ALI', { once: true, description: 'Bakkal · 112 onun telefonundan' }),
    p1.activity('H_T_KADIR', 'Kadir Bayram', 'INV_T_KADIR', {
      once: true,
      description: 'Üst kat komşusu · emekli terzi',
      visibleWhen: has('clue_balkon'),
    }),
    p1.activity('H_T_GAMZE', 'Gamze Ateş', 'INV_T_GAMZE', {
      once: true,
      description: 'Acil servis hemşiresi',
      visibleWhen: has('clue_gamze'),
    }),
    p1.activity('H_T_FERHAT', 'Kom. Yrd. Ferhat Oral', 'INV_T_FERHAT', {
      once: true,
      description: 'Asayiş Büro · dosyanın polisi',
    }),
    p1.activity('H_T_NERMIN', 'Nermin Aksoy', 'INV_T_NERMIN', { once: true, description: 'Mağdur · Setbaşı' }),
  ],
  arsiv: [
    p1.activity('H_TESHIS', 'Teşhis tutanağını incele', 'INV_TESHIS', { once: true, description: 'Dosyadaki asıl' }),
    p1.activity('H_112', 'İhbar formunu ve çağrı dökümünü oku', 'INV_112', {
      once: true,
      description: 'Kimsenin okumadığı kâğıt',
    }),
    p1.activity('H_UEDAS', 'Kesinti kaydını incele', 'INV_UEDAS', {
      once: true,
      description: 'UEDAŞ cevabı geldi',
      visibleWhen: has('ev_uedas'),
    }),
    p1.activity('H_DIL', 'Delil talebi dilekçesi (CMK 177)', 'INV_DIL', {
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
# GÜN 1/3 · BİRİNCİ CELSEYE 8 GÜN
> Hedef: teşhisin nasıl yapıldığını ve mağdurun o gece ilk ne dediğini bul.
`,
  ),
  W(
    all(cmp(v('day'), '==', 2), any(has('clue_halka'), has('clue_foto_farkli'), has('clue_gamze_beyan'))),
    `
# GÜN 2/3 · BİRİNCİ CELSEYE 6 GÜN
> Hedef: kâğıtlarda bir çatlak var. Şimdi Barış’ın o saatte nerede olduğunu kim gördü, ne kanıtlar?
`,
  ),
  W(
    cmp(v('day'), '==', 2),
    `
# GÜN 2/3 · BİRİNCİ CELSEYE 6 GÜN
> Hedef: Barış o saatte neredeydi? Kim gördü, ne kanıtlar? Kâğıtları da unutma.
`,
  ),
  O(`
# GÜN 3/3 · BİRİNCİ CELSEYE 4 GÜN
> Hedef: dilekçe ve tahta. Kürsüde o kadına ne soracaksın; neyi göstereceksin?
`),
];

// --- Görüşme ---

const toneEffects = {
  soft: [inc('trust', 4), set('tone', 'soft')],
  hard: [dec('trust', 8), set('tone', 'hard')],
};

const lowTrust: Cond = cmp(v('trust'), '<', 40);

const gorusme = interview('INV_GORUSME', {
  ...INV,
  title: 'Müvekkil görüşmesi',
  hud: ['min', 'trust'],
  background: 'gorus_odasi',
  room: { label: 'CEZAEVİ · GÖRÜŞ ODASI', character: 'baris' },
  onEnter: [ifThen(cmp({ visits: 'INV_GORUSME' }, '>', 1), [set('min', 8)])],
  lines: [
    W(
      cmp({ visits: 'INV_GORUSME' }, '==', 1),
      `
> Görüş salonunun kapanışına 14 dakika var. Hasan camın ardında; görür ama duymaz.
`,
    ),
    O(`
> Görüş salonunun kapanışına 8 dakika var. Barış bu kez gözlerini kaldırıp kapıya baktı; gelenin ben olduğumu görünce omuzları indi.
`),
  ],
  tones: [
    { id: 'soft', label: 'Yumuşak', hint: '+4 güven' },
    { id: 'hard', label: 'Sert', hint: '−8 güven · daha fazla bilgi' },
  ],
  toneEffects,
  moodRules: [
    mood('Çözülüyor', 'success', 'saskin', has('clue_kulak')),
    mood('Savunmada', 'error', 'kizgin', lowTrust),
    mood('Gergin', 'neutral', 'kizgin', cmp(v('tone'), '==', 'hard')),
    mood('Yorgun', 'neutral', 'normal'),
  ],
  objectives: [
    {
      id: 'obj_gece',
      when: flag('fact_gece'),
      known: 'Ateşli, evde yatıyordu; motor aşağıdaydı.',
      unknown: 'O gece neredeydi?',
    },
    {
      id: 'obj_foto',
      when: has('clue_eski_foto'),
      known: 'Polisin fotoğrafı üç yıllık.',
      unknown: 'Mağdur hangi yüzü tanıdı?',
    },
    { id: 'obj_kulak', when: has('clue_kulak'), known: 'Kulakları delinmemiş.', unknown: 'İlk tarif ona uyuyor mu?' },
    {
      id: 'obj_balkon',
      when: flag('fact_balkon_baris'),
      known: 'Kesintide balkonda Kadir Usta’yla konuştu.',
      unknown: 'Onu o saatte gören biri var mı?',
    },
  ],
  topics: [
    topic('TP_GECE', 'O gece', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 20 },
      effects: [raise('fact_gece')],
      tones: {
        soft: {
          prompt: 'O geceyi baştan anlatır mısın? Acele yok.',
          responses: [
            W(
              lowTrust,
              `
baris/kizgin: Anlattım abla. Polise anlattım, savcıya anlattım. Evdeydim. Kimse dinlemedi, sen niye dinleyesin?
~ Bir duvar. Duvarlara bağırılmaz; kapısı aranır.
`,
            ),
            O(`
baris: Akşam ateşim çıktı. Aile hekimine gittim, kırk gibi dedi, ilaç yazdı. Eve geldim, yattım. Annem başımda bezle oturdu.
baris: Gece bir ara uyandım, terlemiştim. Sonra yine uyudum. Sabah kapı çaldı; açtım, polis. Bu kadar abla. Bu kadar.
- Motor neredeydi?
baris: Aşağıda. Hep aşağıda durur. Kimse almadı.
> Bunu söylerken gözlerini bir an masanın vidasına indirdi. Sonra yine bana baktı.
~ Ateşten mi, yoksa başka bir şeyden mi? Not aldım ve sormadım. Henüz.
baris: Abla, bir şey soracağım. O kadın… o kadın beni nasıl tanıdı? Ben onu hiç görmedim. Hayatımda bir kere bile Sırmakeş’ten inmedim, kurye olarak bile.
- Bunu bulmak için buradayım.
baris/uzgun: Karakolda bir fotoğraf gösterdiler bana da. “Bu sen misin” dediler. Bendim. Üç yıl önceki ben.
`),
          ],
        },
        hard: {
          prompt: 'Saat saat. 23.42’de neredeydin?',
          responses: [
            O(`
baris/kizgin: Saat saat mi? Yataktaydım! Ateşten yanıyordum, saat mi baktım?
baris: Bir ara… elektrik gitti galiba. Karanlıkta uyandım. Rüya mıydı, bilmiyorum. Balkona çıktım mı? Çıktım galiba. Hava almaya.
baris: Abla, ateşim kırktı. Bana o geceyi saat saat sorma. Ben o geceyi hatırlamıyorum ki.
~ Bir kesinti. Bir balkon. Ateşli bir hafızanın kenarında iki kırıntı. Bunlar bir şey olabilir.
`),
          ],
          effects: [raise('fact_kesinti_soz')],
        },
      },
    }),
    topic('TP_ATES', 'Hastalık', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 10 },
      tones: {
        soft: {
          prompt: 'Ne kadar hastaydın? Doktora gittin mi?',
          says: T(`
baris: Üç gündür kötüydüm. O akşam aile hekimine gittim, beşi kırk gibi. Reçete yazdı; evde bir yerdedir, annem saklar her kâğıdı.
baris: Gece hiç yemek yemedim. Annem çorba yaptı, içemedim. Bir insan bu hâlde merdiven mi koşar abla, kadın mı iter?
~ Bir mazeret değil. Ama bir hikâyenin ilk cümlesi.
baris: Bir de hekim hanım “iki gün evden çıkma” dedi. Çıkmadım. Annem bir yere bırakmadı zaten; kapının önünde nöbet tuttu sanki.
`),
        },
        hard: {
          prompt: 'Ateşli insan suç işlemez mi sanıyorsun?',
          says: T(`
baris/kizgin: İşler belki. Ben işlemedim. Ateşim olmasa da işlemezdim.
baris: Sen de mi onlardansın abla? Önce suçlu, sonra insan?
~ Haklıydı. Soruyu savcı gibi sordum. Savcı olmak için burada değilim.
`),
        },
      },
    }),
    topic('TP_ESKI', 'Eski dosya', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 20 },
      effects: [discover('clue_eski_foto'), score('ARASTIRMA', 40)],
      tones: {
        soft: {
          prompt: 'Üç yıl önceki olayı anlatır mısın?',
          says: T(`
baris/uzgun: Bir akraba düğünüydü. Biri halayda ablama sarkıntılık etti. Bir yumruk attım. Adamın kaşı açıldı. Bir yumruk abla.
baris: Karakola götürdüler, fotoğraf çektiler, parmak izi aldılar. Mahkeme cezayı geri bıraktı. Beş yıl temiz kalırsam silinecekmiş.
- O fotoğrafta nasıldın?
baris: Askerden yeni gelmiştim. Saçım sıfırdı, bir de ince bıyık bırakmıştım; herkes güldü bana. Şimdi beni o fotoğraftan kimse tanımaz.
~ Kimse tanımaz. Ama biri tanıdı. Hangi yüzü?
baris: O düğünden sonra Derya ablam bir hafta konuşmadı benimle. Sonra bir gün salona çağırdı, saçımı kendi kesti. “Bir daha yumruk yok” dedi. Yok abla. O günden beri yok.
`),
        },
        hard: {
          prompt: 'Polise göre bıçakla yakalanmışsın.',
          says: T(`
baris/kizgin: Bıçak mı? Kim dedi? Yumruk attım! Dosyasına bak, yumruk yazar! Bir yumruk yüzünden ömür boyu mu bıçaklı olacağım?
baris: O fotoğraf… askerden yeni gelmiştim, saçım sıfırdı. Şimdi aynaya baksam kendimi o fotoğrafta tanımam.
~ Dosyada bıçak yok. Ama birinin ağzında var. Kimin?
`),
        },
      },
    }),
    topic('TP_AILE', 'Ailen', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 15 },
      tones: {
        soft: {
          prompt: 'Annen, ablan nasıl? Kimler geliyor görüşe?',
          says: T(`
baris/uzgun: Annem her hafta geliyor. Camın arkasından bakıyor, konuşamıyor. Ağlamasın diye ben gülüyorum.
baris: Derya ablam… o bizim babamız gibi. Salonu açtığından beri evi o çeviriyor. Avukata da o koştu, biliyorum.
baris: Amcamın oğlu Tolga da var; kardeş gibi büyüdük. O gelemiyor görüşe; inşaatta çalışıyor, gündüz izin vermiyorlar.
~ Bir aile. Herkesin bir yeri, herkesin bir yükü.
baris: Ben kurye oldum, Tolga inşaata gitti. Ben gece, o gündüz. Bayramlarda bile zor görüşüyoruz artık. Eskiden aynı mahallede top oynardık.
~ Görüş listesinde iki isim, bir de gelemeyen bir kuzen. Camın arkasında bir çocuk; camın önünde, artık, ben.
`),
        },
        hard: {
          prompt: 'Ailen o gece evde olduğunu söylüyor. Mahkeme buna inanmaz.',
          says: T(`
baris/kizgin: Annem yalan söylemez! Annem namaz kılarken bile yalan söylemez abla!
baris: Ama biliyorum. Annenin sözü sayılmazmış. Polis de öyle dedi. “Anneler hep evdeydi der.”
~ Doğru. Aile tanığı yasak değil; ama hâkim onu tartarken elini terazinin bir yanına koyar. Bağımsız biri lazım.
`),
        },
      },
    }),
    topic('TP_KULAK', 'Kulakların', {
      cost: costOf('min', 2),
      visibleWhen: any(has('clue_halka'), has('clue_ali_halka')),
      score: { SORGULAMA: 30 },
      effects: [discover('clue_kulak'), score('ARASTIRMA', 60)],
      tones: {
        soft: {
          prompt: 'Saçını bir kulağının arkasına atar mısın? Bir şeye bakmam lazım.',
          says: T(`
baris/saskin: Kulağıma mı? Niye?
> Saçını iki yana itti. İki kulak memesi; pürüzsüz, delinmemiş, iz yok.
baris: Hiç deldirmedim abla. Annem “erkek kulak deldirmez” der, babam ölünce de hiç tartışmadım. Niye sordun?
- Belki bir gün söylerim.
~ Kadın o gece bir halka gördü. Bu kulaklarda hiç halka olmadı.
baris: Bu iyi bir şey mi abla, kötü mü?
- Şimdilik bir şey. İyi ya da kötü olduğunu kâğıtlar söyleyecek.
baris: Kâğıtlar… Bu dosyada herkes kâğıt diyor. Bir tek bana kimse bir şey sormuyor.
~ Haklı. Bu dosyada ona ilk soruyu soran ben oldum; üç ay sonra.
`),
        },
        hard: {
          prompt: 'Küpe takıyor musun? Doğruyu söyle.',
          says: T(`
baris/kizgin: Küpe mi? Ne alakası var?
> Saçını sertçe arkaya itti, iki kulağını da gösterdi. Delik yok. İz yok.
baris: Al bak. Kulağım da mı suçlu şimdi?
~ Hayır. Kulağın, bu dosyadaki tek masum tanık.
`),
        },
      },
    }),
    topic('TP_BALKON', 'Balkon', {
      cost: costOf('min', 2),
      visibleWhen: any(has('clue_balkon'), has('clue_kadir'), flag('fact_kesinti_soz')),
      score: { SORGULAMA: 20 },
      tones: {
        soft: {
          prompt: 'O gece balkona çıktın mı? Üst katta biri var mıydı?',
          responses: [
            W(
              has('clue_kadir'),
              `
baris/saskin: Kadir Usta mı söyledi? Evet… evet! Elektrik gitmişti. Karanlıkta boğuluyordum, balkona çıktım.
baris: Usta yukarıda mum yakmıştı. “Oğlum gir içeri, hasta hasta” dedi. Ben de “Usta sizde de mi gitti” dedim. Gülmüştü.
baris: Bunu nasıl unuttum ben? Ateş abla… ateş insanın aklını yıkıyor.
~ Unutulan bir cümle, bir tanığın hafızasında saklanmış. Hafıza bu dosyada iki yönde de çalışıyor.
`,
            ),
            O(`
baris: Balkona çıktım galiba. Hava almak için. Yukarıda bir ışık vardı, mum gibi. Kimdi bilmiyorum. Ateşten hatırlamıyorum abla.
~ Yarım bir anı. Yarım anıların öbür yarısı genellikle başka birindedir.
`),
          ],
          effects: [ifThen(has('clue_kadir'), [raise('fact_balkon_baris')])],
        },
        hard: {
          prompt: 'Balkondaysan biri seni görmüştür. Kim?',
          responses: [
            W(
              has('clue_kadir'),
              `
baris/kizgin: Kadir Usta! Yukarıda mumla oturuyordu! Ben… elektrik gitmişti, ben ona seslendim. Bunu neden kimse sormadı?
~ Çünkü kimse sormadı. Bu dosyanın bütün hikâyesi bu cümlede.
`,
            ),
            O(`
baris/kizgin: Bilmiyorum! Karanlıktı! Biri vardı belki yukarıda. Sormak senin işin değil mi?
~ Haklı. Benim işim.
`),
          ],
          effects: [ifThen(has('clue_kadir'), [raise('fact_balkon_baris')])],
        },
      },
    }),
  ],
  choices: [
    option('G_NOT', 'Derya’nın notunu ver', {
      visibleWhen: flag('derya_not'),
      effects: [inc('trust', 8)],
      responses: B(`
> Katlanmış kâğıdı masanın üstünden ittim. Barış açtı. Okudu. Bir kez daha okudu.
baris/uzgun: “Annem iyi. Sen dayan.” Ablamın yazısı bu. Annem kalbi çizmiş ama; ablam kalp çizmez.
> Kâğıdı katladı, eşofmanının cebine koydu ve eliyle üstüne bastırdı. Bir süre konuşmadı.
baris: Sağ ol abla. Ne sorarsan sor.
`),
    }),
  ],
  finish: { id: 'G_BITIR' },
});

const gorusmeGiris = decisionNode('INV_GORUSME_G_1', [{ to: 'INV_GORUSME' }], {
  ...INV,
  title: 'Müvekkil görüşmesi',
  onFirstEnter: [meet('sevim'), meet('hasan'), ifThen(flag('deniz_durust'), [inc('trust', 4)])],
  lines: [
    W(
      cmp({ visits: 'INV_GORUSME' }, '==', 0),
      `
# BURSA H TİPİ CEZAEVİ — AVUKAT GÖRÜŞ ODASI [bg:gorus_odasi]
> Üç kapı, iki arama, bir imza. Koridorlar çamaşır suyu ve soğumuş çorba kokuyordu. Her kapı arkamdan kilitlendikçe biraz daha ağırlaştım.
> Ziyaretçi kapısının önünde başörtülü, ince bir kadın bekliyordu. Elinde bir torba temiz çamaşır. Görüş günü değildi; yine de gelmişti.
sevim/uzgun: Avukat hanım siz misiniz? Derya söyledi. Bunu bırakabildim bari. Yünlü çorabını koydum, üşür o.
sevim: O gece evdeydi kızım. Ben bezle sildim alnını. Saat kaçtı bilmem; saat bakan mı olur o hâlde? Polise de söyledim, yazmadılar.
> İnfaz koruma memuru Hasan görüş odasının kapısını açtı. Kırklı yaşlarında, bıyıklı, az konuşan biri.
hasan: Görüş salonu beşte kapanıyor. Camdan bakarım; konuşmanızı duymam.
> Masa vidalıydı. Sandalyeler vidalıydı. Barış içeri girdi, oturdu. Saçları omuzlarına inmiş, sakalı uzamıştı; kart fotoğrafındaki gençten de yorgundu.
baris: Abla… Derya ablam mı gönderdi? Kusura bakma, görüntüm…
~ Dosyadaki fotoğrafla bu yüzün arasında üç yıl ve bir hayat vardı.
`,
    ),
    O(`
# CEZAEVİ — AVUKAT GÖRÜŞ ODASI [bg:gorus_odasi]
> Aynı kapılar, aynı kokular. Hasan beni görünce başıyla selam verdi ve kapıyı açtı.
baris: Abla, annem nasıl? Bir şey dedi mi?
`),
  ],
});

// --- Sahne aramaları ---

const arama = sceneSearch('INV_ARAMA', {
  ...INV,
  title: 'Sırmakeş merdivenleri · olay yeri fotoğrafları',
  hud: ['taps'],
  exposeCounts: true,
  scene: 'sc_merdiven',
  background: 'sokak_karanlik',
  instruction: 'Fotoğrafta şüpheli gördüğün yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps',
  lines: B(`
# ARŞİV · 19 OCAK 01.10 OLAY YERİ FOTOĞRAFLARI [bg:sokak_karanlik]
> Otuz sekiz fotoğraf. Flaşla, yağmurda, aceleyle çekilmiş. Basamaklar beyaz patlıyor, kenarlar karanlıkta kayboluyor.
~ Olay yerinde bir buçuk saat sonra çekilmiş bir fotoğraf, o gecenin en dürüst tanığıdır. Kimseye bir şey anlatmaz; sadece gösterir.
> Fotoğrafların arkasında olay yeri ekibinin kurşun kalemle düştüğü numaralar: 1’den 38’e. Bazılarının yanında soru işareti. Kimse o soru işaretlerine dönmemiş.
~ Bir fotoğrafçı bir şeyi merak etmiş ve bir soru işareti koymuş. Üç ay sonra o soruyu ben soruyorum.
`),
  miss: fallback('FB_ARAMA', 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  }),
  finish: { id: 'ARAMA_BITIR' },
});

const evGiris = decisionNode('INV_EV_G', [{ to: 'INV_ARAMA2' }], {
  ...INV,
  title: 'Kılınçların evi',
  onFirstEnter: [meet('sevim')],
  lines: B(`
# SALI 11.00 — YILDIRIM, MİMAR SİNAN MAHALLESİ [bg:ev]
> Sıra apartmanların üçüncüsü. Merdiven boşluğunda kızartma kokusu ve bir çocuk ağlaması. Kapıyı Derya açtı; elinde saç kurutma makinesinin kablosu, sarılı.
derya: Gel canım. Salonu kalfaya bıraktım, bir saat. Annem içeride; kusura bakma, ağlarsa.
> İki oda bir salon. Duvarda halı, vitrinde bayramlık bardaklar. Sevim Hanım divanda tespih çekiyordu; beni görünce kalkmaya davrandı, Derya omzuna dokunup oturttu.
sevim/uzgun: Hoş geldin kızım. Barış’ın odası şurası. Ben her gün yatağını yapıyorum. Bir şey bozmadım.
derya: Bak canım, ne istersen. Polis bir kere bile içeri girmedi; kapıdan aldılar, gittiler.
sevim: O sabah ateşten titriyordu kızım. Bir hırka bile giydiremedim. Eşofmanla götürdüler, ayağında terlik. Ayakkabısını ben arkasından karakola götürdüm.
sevim: Gece ben başındaydım. Bir ara uyumuşum, divanda. Uyandığımda karanlıktı, elektrik gitmişti. Barış balkondaydı, öksürüyordu. “Gir içeri oğlum” dedim.
- Saat kaçtı, hatırlıyor musunuz?
sevim/uzgun: Bilmem ki. Saate bakan mı olur? Karanlıkta tespihimi aradım, onu bulamadım, saati mi bulacaktım?
derya: Annemin sözü sayılmıyormuş canım, biliyorum. Polis de öyle dedi: “Anneler hep evdeydi der.”
~ Bir annenin sözü yalan değildir; ama mahkemede bir kanıt da değildir. Annenin anlattığı balkon, başka birinin hafızasında da olmalı.
~ Kimsenin bakmadığı bir ev, kimsenin okumadığı bir kâğıt gibidir. Baktım.
`),
});

const arama2 = sceneSearch('INV_ARAMA2', {
  ...INV,
  title: 'Kılınçların evi',
  hud: ['taps2'],
  exposeCounts: true,
  scene: 'sc_ev',
  background: 'ev',
  instruction: 'Evde dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps2',
  miss: fallback('FB_ARAMA2', 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Sıradan bir köşe. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  }),
  finish: { id: 'ARAMA2_BITIR', label: 'Evden ayrıl' },
});

const arama3 = sceneSearch('INV_ARAMA3', {
  ...INV,
  title: 'Acil servis koridoru',
  hud: ['taps3'],
  exposeCounts: true,
  scene: 'sc_acil',
  background: 'hastane',
  instruction: 'Koridorda dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
  costVar: 'taps3',
  lines: B(`
# ÇARŞAMBA 23.50 — DEVLET HASTANESİ, ACİL SERVİS [bg:hastane]
> Gece yarısına on dakika. Acilin kapısı her açıldığında soğuk bir rüzgâr ve bir sedye giriyordu.
> Bekleme koridoru kamuya açıktı. Kimse kim olduğumu sormadı; acilde kimse kimseye bir şey sormaz, herkes kendi derdinde.
~ Nermin Hanım burada oturdu. Burada dikiş attılar. Ve bir adam, buradan bir yerden içeri girdi.
> Bekleme bankında bir adam başını duvara dayamış uyuyordu. Bir kadın, kucağında ateşli bir çocukla bir aşağı bir yukarı yürüyordu. Görevli kâtip camın ardından herkese aynı yorgun gözle bakıyordu.
~ Acil servis bir şehrin vicdanı gibidir; gece yarısı herkes buraya düşer, sabah herkes unutur.
`),
  miss: fallback('FB_ARAMA3', 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Sadece bir koridor. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  }),
  finish: { id: 'ARAMA3_BITIR', label: 'Koridordan ayrıl' },
});

// --- Tanıklar ---

const tAli = conversation('INV_T_ALI', {
  ...INV,
  title: 'Ali Rıza Tunç',
  eyebrow: 'TANIKLAR',
  background: 'sokak_sabah',
  room: { label: 'BAKKAL · SIRMAKEŞ', character: 'ali' },
  lines: B(`
# SIRMAKEŞ — TUNÇ BAKKALİYESİ [bg:sokak_sabah]
> Raflar tavana kadar: deterjan, makarna, bir köşede yıllanmış oyuncak araba. Tezgâhın arkasında çaydanlık ve radyo.
ali: Gel bakalım avukat. Çay. Şeker kaç? Söyleme, ben bilirim; avukatlar şekersiz içer, acıyı severler.
ali: Nermin abla otuz yıldır bu merdivenden iner. Her gece selam verir, “Ali Rıza, ekmek kaldı mı” der. O gece ekmek sormadı.
ali: Bir gürültü duydum, çıktım. Basamakta oturuyordu, eli kan. Motor aşağıdan geçti; plakasına bakamadım, yağmur gözüme girdi.
ali: Telefonu ben verdim. Onun telefonu çantadaydı. Konuşurken yanında durdum; omzuna montumu koydum.
ali: Bu merdivenlerde kırk yıldır dükkân tutuyorum avukat. Her gece aynı insanlar iner: hemşireler, garsonlar, fırıncının çırağı. Bir de kuryeler, motorla aşağıdan geçen.
ali: O gece de bir motor aşağıda bekliyordu. Farı kapalı. Ben “sipariş bekliyor” dedim, dikkat etmedim. Kırk yıldır dikkat ederim de o gece etmedim.
~ Herkesin bir “o gece etmedim”i var. Bu dosya o gecelerden yapılmış.
`),
  choices: [
    option('AQ_TARIF', '“Polise ne tarif etti, siz duydunuz mu?”', {
      score: { SORGULAMA: 30 },
      discovers: 'clue_ali_halka',
      responses: B(`
ali: Duymaz mıyım? “Kurye” dedi, “sarı kutu” dedi. Bir de halka. “Kulağında halka vardı” dedi, iki kere. Parlamış.
ali: Ben de dedim içimden, bu zamanın gençleri, kulak burun, ne bulsalar delik açıyorlar.
- Bıçak dedi mi?
ali: Bıçak? Yoo. “İtti, düştüm” dedi. Eli camdan kesilmişti; şişe kırığı vardı basamakta, ben sonra süpürdüm.
~ İki tanık, aynı dakika, aynı söz. Biri yorgun bir kadın, biri lafazan bir bakkal. İkisi de bir halka duydu.
`),
    }),
    option('AQ_POLIS', '“Polis sizinle konuştu mu?”', {
      score: { SORGULAMA: 10 },
      responses: B(`
ali: Konuştu mu? Ekip geldi, ablayı aldı, gitti. Bir tanesi ismimi yazdı, telefonumu yazdı. Kimse aramadı.
ali: Ertesi gün de biri geldi, sivil. “Gördün mü” dedi, “görmedim” dedim. “Tamam” dedi. Tamam ne? Ben ne gördüğümü söyleyecektim.
~ Sorulmamış bir tanık. Bu dosyada bir desen var.
`),
    }),
    option('AQ_ISRAR', '“Mahkemede bunları söyler misiniz?”', {
      visibleWhen: has('clue_ali_halka'),
      responses: B(`
ali: Söylerim. Ama bak avukat, sen iste, ben daha da söylerim. “Bıçak mıçak yoktu, ben gördüm” derim. Abla zaten bir şey görmedi ki. İster misin?
~ Lafazan, iyi kalpli, tehlikeli bir teklif. Tanığın ağzına söz koymak, onu tanık olmaktan çıkarır.
`),
      next: 'INV_T_ALI_K',
    }),
    back('ALI_BITIR', 'Teşekkür et, çık'),
  ],
});

const tAliKarar = conversation('INV_T_ALI_K', {
  ...INV,
  title: 'Ali Rıza Tunç',
  eyebrow: 'TANIKLAR',
  background: 'sokak_sabah',
  room: { label: 'BAKKAL · SIRMAKEŞ', character: 'ali' },
  lines: B(`
> Ali Rıza tezgâha yaslandı, bıyığını sıvazladı ve cevabımı bekledi; bir maç sonucunu bekler gibi.
`),
  choices: [
    option('ALI_DOGRU', '“Yalnızca duyduğunuzu. Fazlasını değil.”', {
      score: { SAVUNMA_STRATEJISI: 50 },
      good: 'Tanığa ne söyleyeceğini söylemedin; yalnızca kendi algısını anlatmasını istedin (Av.K. 34).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Ali Bey, siz yalnızca duyduğunuzu söyleyeceksiniz. Görmediğiniz bir şeyi değil. Fazlası, ablaya da Barış’a da zarar verir.
ali: Hı. Peki. Haklısın. Ben de karışırım bazen, laf lafı açar.
ali: Duyduğum: kurye, sarı kutu, halka. Gördüğüm: kan, şişe, motor. Bu kadar.
ali: Bir de Nermin ablanın yüzünü. Onu da gördüm. Kimse ona sormadı ama ben söyleyeyim: o gece o kadının yüzünde korku yoktu avukat. Şaşkınlık vardı. Korku ertesi gün geldi.
~ Bu kadar, yeterince fazla.
`),
      next: '$return',
    }),
    option('ALI_EVET', '“Bıçak olmadığını da söylerseniz iyi olur.”', {
      effects: [inc('ethics'), raise('ali_kocluk'), score('SAVUNMA_STRATEJISI', -50)],
      bad: 'Görmediği bir şeyi söylemesini istedin: tanığı yönlendirmek meslek kurallarına aykırıdır (Av.K. 34), yalan tanıklığa azmettirme riski taşır (TCK 272, 38) ve tanığın değerini yok eder.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Bıçak olmadığını da söylerseniz iyi olur.
ali: Tamamdır! Ben hallederim, sen merak etme.
> Bakkalın gözleri parladı. Bir dava kazanmanın heyecanı. Benim gözlerimde ise bir şey söndü.
~ Az önce bir tanığı bir dekora çevirdim. Bunu kimse görmedi. Ben gördüm.
`),
      next: '$return',
    }),
  ],
});

const tKadir = conversation('INV_T_KADIR', {
  ...INV,
  title: 'Kadir Bayram',
  eyebrow: 'TANIKLAR',
  background: 'ev',
  room: { label: 'ÜST KAT · TERZİ', character: 'kadir' },
  onFirstEnter: [meet('kadir'), discover('clue_kadir'), score('ARASTIRMA', 60), raise('fact_kesinti')],
  lines: B(`
# YILDIRIM — KADİR BAYRAM’IN EVİ, ÜST KAT [bg:ev]
> Salonun yarısı hâlâ bir terzi atölyesiydi: bir dikiş makinesi, bir manken, duvarda kumaş numuneleri. Kapıyı açan adam gözlüğünü burnuna itti.
kadir: Avukat. Kılınçların avukatı. Biliyordum geleceğini; ölçüsü alınmamış ceket gibi dolaşıyordu bu iş ortada.
kadir: Otur. Çay yok, kahve yok; bende sadece ıhlamur var, uykum gelsin diye. Gelmiyor ya.
kadir: Elli yıl terzilik yaptım. Ölçmeden biçmem. O yüzden sana ölçtüğümü söyleyeceğim, biçtiğimi değil.
kadir: O gece elektrik gitti. Ben zaten uyumuyordum. Karanlıkta mum buldum, balkona çıktım; mahallede ışık var mı diye baktım. Yoktu.
kadir: Aşağıda balkon kapısı açıldı. Biri çıktı, öksürüyordu; köpek gibi, göğsünden. Barış. “Usta sizde de mi gitti?” dedi.
kadir: “Gir içeri oğlum, hasta hasta” dedim. “Yanıyorum usta” dedi. Bir iki laf daha. Sonra girdi.
~ Bir mum, bir öksürük, iki cümle. Ve bir saat; ama hangi saat?
`),
  choices: [
    option('KQ_SAAT', '“Saat kaçtı, hatırlıyor musunuz?”', {
      score: { SORGULAMA: 25 },
      responses: B(`
kadir: Saate bakmadım. Karanlıktı. Duvar saatim pilli, o da durmamış, bakmadım işte.
kadir: Ama elektrik gidince çıktım, elektrik gelmeden girdi. Bunu biliyorum. Elektrik gelince televizyon kendi kendine açıldı, sesinden sıçradım.
~ Saati bilmiyor. Ama saatin iki ucunu biliyor: kesinti ve dönüş. Kesintinin saatini biri kaydetmiştir.
`),
    }),
    option('KQ_SES', '“Karanlıkta onu nasıl tanıdınız?”', {
      score: { SORGULAMA: 20 },
      responses: B(`
kadir: Sesinden. Öksürüğünden. Yirmi iki yıldır altımda yaşıyor o çocuk; ağlamasını bilirim, gülmesini bilirim, kapıyı çarpmasını bilirim.
kadir: Hem o balkon onun balkonu. Başkası niye çıksın?
~ Mantıklı. Ama savcı mantıkla değil, kuşkuyla gelecek.
`),
    }),
    option('KQ_GOZ', '“Gözleriniz nasıl görür, Kadir Usta?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('kadir_goz')],
      responses: B(`
kadir: Katarakt. İki gözde. Ameliyat sırası bekliyorum; devlet, sıra, bilirsin.
kadir: Yakını görürüm, iğneye iplik geçiririm hâlâ. Uzağı… uzak bulanık. Karanlıkta yüz seçemem, onu bil. Ama ben yüz demedim; ses dedim.
~ Dürüst bir tanık, zayıf yanını kendi söyler. Bu iyi. Savcı da söyleyecek; o zaman şaşırmayız.
`),
    }),
    cont('KADIR_KARAR', 'Tanıklığını konuş', 'INV_T_KADIR_K', { role: 'PRIMARY' }),
  ],
});

const tKadirKarar = conversation('INV_T_KADIR_K', {
  ...INV,
  title: 'Kadir Bayram',
  eyebrow: 'TANIKLAR',
  background: 'ev',
  room: { label: 'ÜST KAT · TERZİ', character: 'kadir' },
  lines: B(`
kadir: Mahkemeye mi çağıracaksın beni? Ben mahkemeleri sevmem avukat. Oğlumun bir davası vardı; dört yıl sürdü, adam oldu, bitmedi.
kadir: Ama o sabah… polis Barış’ı götürürken balkondaydım. Bir şey diyecektim. Demedim. Perdeyi çektim.
kadir: Üç aydır o perdeyi her sabah açıyorum, her sabah aynı yere bakıyorum. Ölçtüm ama söylemedim. Bu da bir tür biçmektir.
~ Bir perde. Bir adamın üç aylık pişmanlığı.
`),
  choices: [
    option('KD_BILDIR', 'Tanık olarak bildireceğim', {
      score: { USUL_BILGISI: 50 },
      effects: [raise('kadir_tanik')],
      good: 'Mazeret tanığını delil dilekçesinde bildirmek (CMK 177–178) beyanın duruşmada doğrudan dinlenmesini sağlar.',
      category: 'USUL_BILGISI',
      responses: B(`
- Sizi tanık olarak bildireceğim Kadir Usta. Mahkeme sizi çağıracak; ne gördüyseniz, ne duyduysanız onu anlatacaksınız. Bu kadar.
kadir: Bu kadar mı? Peki. Ölçtüğümü söylerim. Biçmem.
> Kapıda elimi sıktı. Eli kuru, sıcak; bir makasın kabzası gibi sertleşmiş.
kadir: Bir de o çocuğa söyle; benim perdeyi çektiğimi. O sabah. Bilsin. Ben söylerim aslında; yüzüne bakamam.
~ Bir tanık, bir özür. İkisini aynı cümleye sığdırmış.
`),
      next: '$return',
    }),
    option('KD_YAZILI', 'Yazılı bir beyan imzalasanız yeter', {
      score: { USUL_BILGISI: -30 },
      bad: 'Duruşmada dinlenebilecek tanığın beyanı yerine yazılı belge okunamaz (CMK 210/1); yazılı beyanın değeri zayıftır.',
      category: 'USUL_BILGISI',
      responses: B(`
- Yazılı bir beyan imzalasanız, mahkemeye sunarım. Gelmenize gerek kalmaz.
kadir: Kâğıda yazarım, imzalarım. Kâğıt yalan söylemez, insan söyler; sen bilirsin.
~ Mahkeme, dinleyebileceği tanığın kâğıdını okumaz. Bunu biliyordum. Korkusunu kolaylaştırmak istedim.
`),
      next: '$return',
    }),
    option('KD_SAAT', '“Elektrik 23.40’ta gitti deseniz, kayıt da öyle”', {
      effects: [inc('ethics'), raise('kadir_kocluk'), raise('kadir_tanik'), score('SAVUNMA_STRATEJISI', -50)],
      bad: 'Tanığa bilmediği bir saati söyletmeye çalıştın: tanığı yönlendirmek meslek kurallarına aykırıdır (Av.K. 34), yalan tanıklığa azmettirme riski taşır (TCK 272, 38).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Mahkemede “elektrik 23.40 gibi gitti” derseniz işimiz kolaylaşır. Kayıt da zaten öyle çıkacak.
kadir: 23.40. Peki. Ezberlerim. Ben sayıları iyi ezberlerim; ölçülerin hepsi aklımdadır.
> Bir an durdu. Gözlüğünün arkasından bana baktı.
kadir: Ama ben saate bakmadım avukat. Biliyorsun, değil mi?
~ Biliyordum. O da biliyordu. Şimdi ikimiz de biliyoruz; yakında bir savcı da bilecek.
`),
      next: '$return',
    }),
  ],
});

const tGamze = conversation('INV_T_GAMZE', {
  ...INV,
  title: 'Gamze Ateş',
  eyebrow: 'TANIKLAR',
  background: 'hastane',
  room: { label: 'ACİL SERVİS · KANTİN', character: 'gamze' },
  onFirstEnter: [meet('gamze')],
  lines: B(`
# PERŞEMBE 07.55 — ACİL SERVİS KANTİNİ [bg:hastane]
> Nöbet devrinden beş dakika önce. Kantinde makine kahvesi, yorgun yüzler. Gamze Ateş önlüğünün cebinden üç kalem, bir makas ve bir şeker çıkardı; şekeri yedi.
gamze: Avukat mısınız? Beş dakikam var. Sonra eve gidip on iki saat ölü gibi yatacağım. Hangi vaka?
- 19 Ocak. Nermin Aksoy. El kesisi, adli vaka.
> Kahve bardağını bıraktı. Yüzündeki yorgunluk bir anda başka bir şeye döndü; dikkate.
gamze: Hatırlıyorum. Sol avuç, iki dikiş. Kadın şoktaydı ama dimdikti; hasta bakıcıymış, kendi bandajına talimat verdi bana.
gamze: Otuz yıl hasta taşımış bir kadın. Ellerinden belli; parmak boğumları kalın, tırnakları kısa. “Sıkı sarma kızım, kan durur ama el uyuşur” dedi. Haklıydı.
gamze: O gece acilde on dört adli vaka vardı. Bıçaklanan iki genç, bir trafik kazası, bir de o. En sakini oydu. Sonra… sonra sakin değildi.
`),
  choices: [
    option('GQ_POLIS', '“O gece polis geldi mi?”', {
      score: { SORGULAMA: 40 },
      discovers: 'clue_gamze_beyan',
      responses: B(`
gamze: Geldi. Komiser miydi neydi, sivil. Saçından su damlıyordu. “İki dakika” dedi, perdeyi çekti.
gamze: Ben sargıyı yeni bitirmiştim. Perdenin aralığından gördüm: telefonunu kadının yüzüne tutuyordu. Bir fotoğraf. Tek bir fotoğraf.
gamze: “Bu mu, kaydı var, bıçakla yakalanmıştı” dedi. Kadın “bilmiyorum” dedi, iki kere. Üçüncüde “galiba” dedi. Sonra ağladı.
gamze: Ben adamı dışarı çıkardım. Hasta durumunu değiştiren her şeyi forma yazarız; yazdım. Saatiyle.
~ Perdenin arkasında ne olduğunu kimse sormamıştı. Hemşire sormadan yazmış.
`),
    }),
    option('GQ_KORKU', '“Bunu anlatmak sizi tedirgin ediyor mu?”', {
      score: { SORGULAMA: 10 },
      responses: B(`
gamze: Ediyor tabii. Acil serviste polisle iyi geçinmezseniz geceleriniz uzar. Kavga eden sarhoşu kim tutacak? Kim gelecek?
gamze: Ama ben yazdım. Yazdığımı inkâr etmem. Form orada, arşivde. İsteyen mahkemeyse veririz.
~ Korkuyor ve yine de dimdik. Bu dosyada iki kadın aynı şeyi yapıyor.
`),
    }),
    cont('GAMZE_KARAR', 'Ne yapacağını söyle', 'INV_T_GAMZE_K', {
      role: 'PRIMARY',
      enabledWhen: has('clue_gamze_beyan'),
      lockedReason: 'Önce o geceyi sor.',
    }),
  ],
});

const tGamzeKarar = conversation('INV_T_GAMZE_K', {
  ...INV,
  title: 'Gamze Ateş',
  eyebrow: 'TANIKLAR',
  background: 'hastane',
  room: { label: 'ACİL SERVİS · KANTİN', character: 'gamze' },
  lines: B(`
gamze: Ne yapacaksınız şimdi? Beni mahkemeye mi çağıracaksınız?
`),
  choices: [
    option('G_TANIK', 'Sizi tanık olarak bildireceğim', {
      score: { USUL_BILGISI: 50 },
      effects: [raise('gamze_tanik')],
      good: 'Tek fotoğraf gösterimini gören tanığı bildirmek, kolluğun teşhis usulünü (PVSK ek md. 6) duruşmada sınamanı sağlar (CMK 177–178).',
      category: 'USUL_BILGISI',
      responses: B(`
- Sizi tanık olarak bildireceğim Gamze Hanım. Gördüğünüzü mahkemede anlatırsınız; formu da isteyeceğim.
gamze: Polis bana bir şey der mi? Bizim acilde polis her gece var. Kavga, kaza, sarhoş.
- Siz yalnızca gördüğünüzü anlatacaksınız. Kimseyi suçlamayacaksınız; bir saati ve bir telefonu anlatacaksınız.
gamze: Saat 00.40. Telefon siyahtı, kılıfı yoktu. Fotoğraf bir duvar önünde, bir numara tabelasıyla. Bunları söylerim. Gerisini siz söylersiniz.
gamze: Peki. Nöbetim olmayan bir güne denk getirin; yoksa bir adli vakayı daha ben yazarım, sizinkinin yerine.
`),
      next: '$return',
    }),
    option('G_FORM', 'Yalnızca formu mahkemeden isteyeceğim', {
      score: { USUL_BILGISI: 20 },
      neutral:
        'Form tek başına da bir belgedir; ama yazanı dinlenmezse savcılık “ne gösterildi” sorusunu açık bırakır.',
      responses: B(`
- Size yük olmasın. Yalnızca formu mahkemeden isterim.
gamze: Sağ olun. Form bende değil zaten; hastane arşivinde. Müzekkere yazarlarsa bir haftada gider.
`),
      next: '$return',
    }),
  ],
});

const tFerhat = conversation('INV_T_FERHAT', {
  ...INV,
  title: 'Kom. Yrd. Ferhat Oral',
  eyebrow: 'TANIKLAR',
  background: 'karakol',
  room: { label: 'KARAKOL ÖNÜ', character: 'ferhat' },
  onFirstEnter: [meet('ferhat')],
  lines: B(`
# OSMANGAZİ — ASAYİŞ BÜRO ÖNÜ [bg:karakol]
> Ferhat Oral merdivenin başında sigara içiyordu. Beni görünce izmariti söndürmedi; bir nefes daha çekti.
ferhat: Avukat hanım. Kılınç dosyası. Hayırdır, ifade mi alacaksınız benden? Mahkemede görüşürüz.
ferhat: Size bir rakam vereyim, ondan sonra konuşalım: iki ayda dört gasp. Tophane, Setbaşı, Kayhan. Hepsi gece, hepsi kadın, hepsi motor.
ferhat: Müdür her sabah tepemde. Mahalle muhtarı her akşam telefonda. Siz o çocuğun avukatısınız; ben de o kadınların.
ferhat: Biliyor musunuz, ikinci kadının bileği kırıldı. Üçüncüsü bir aydır evden çıkamıyor. Dördüncüsü Nermin Hanım. Bir beşinci olmasın diye uyumuyorum.
~ Yorgun bir adam. Kötü değil. Yorgunluk, bir usulü atlamak için en eski gerekçedir.
`),
  choices: [
    option('FQ_LISTE', '“Barış’a nasıl ulaştınız?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('fact_liste')],
      responses: B(`
ferhat: Kurye dedi kadın, sarı kutu dedi. Bölgede çalışan kuryelerin listesini çektim. Kaydı olan bir tek o vardı.
ferhat: Kaydı olan, bölgede çalışan, genç, ince. Prosedür bu avukat hanım; bir iğneyi samanlıkta değil, iğne kutusunda ararsın.
~ İğne kutusunda arayan, kutudaki her iğneyi iğne sanar.
`),
    }),
    option('FQ_ACIL', '“Acil serviste mağdurla konuştunuz mu?”', {
      score: { SORGULAMA: 30 },
      responses: [
        W(
          any(has('clue_gamze_beyan'), has('clue_triyaj')),
          `
- O gece 00.40’ta acildeydiniz. Mağdurla konuştunuz.
ferhat: Konuştum tabii. Geçmiş olsun dedim. Ne var bunda?
- Telefonunuzdan bir şey gösterdiniz mi?
> Sigarayı dudağından aldı. Bir an, çok kısa bir an, gözleri hastanenin olduğu yöne kaydı.
ferhat: Teyze acıdan kıvranıyordu, ben de bir baktırdım, ne var? Ertesi gün usulüne göre teşhis yaptırdık. Altı fotoğraf. Tutanak ortada.
~ “Bir baktırdım.” Bu cümleyi kürsüde bir daha duymak istiyorum. Yeminli.
`,
        ),
        O(`
ferhat: Konuştum. Geçmiş olsun dedim, ekibi yönlendirdim. Ertesi gün usulüne göre teşhis yaptırdık. Tutanak ortada avukat hanım.
~ Duvar. Ama her duvarın bir derzi vardır. Önce derzi bulmam lazım.
`),
      ],
      effects: [ifThen(any(has('clue_gamze_beyan'), has('clue_triyaj')), [discover('clue_ferhat')])],
    }),
    option('FQ_BICAK', '“Barış’ın bıçakla yakalandığını kim söyledi?”', {
      score: { SORGULAMA: 20 },
      visibleWhen: any(has('clue_eski_foto'), has('clue_bicak_yok')),
      responses: B(`
ferhat: Kaydında var. Yaralama.
- Kaydında yumruk var. Bıçak değil.
ferhat: Yumruk, bıçak… Kavgacı bir çocuk avukat hanım. Bunu ben uydurmadım.
~ Uydurmadı belki. Hatırladığını sandı. Bu dosyada herkes bir şeyi hatırladığını sanıyor.
`),
    }),
    back('FERHAT_BITIR', 'Teşekkür et, ayrıl'),
    option('FQ_TEHDIT', '“Sizi Başsavcılığa şikâyet edeceğim.”', {
      score: { SORGULAMA: -80 },
      bad: 'Tanık olacak kolluk görevlisini sokakta tehditle sıkıştırmak ondan bilgi almaz; duruşmada sana karşı kapanır. Usulsüzlük varsa yolu tehdit değil, yazılı suç duyurusudur (CMK 158).',
      category: 'SORGULAMA',
      responses: B(`
ferhat/kizgin: Edin. Bir dilekçe daha, bir soruşturma daha. Ben o dört kadının yüzüne bakıyorum her gün. Siz kime bakıyorsunuz?
> Sigarayı yere attı, ezmedi bile. İçeri girdi. Kapı arkasından sertçe kapandı. {shake}
~ Kazanamayacağım bir kavgaya girdim. Hem de kürsüye çıkacak bir tanıkla.
> Arabaya binmeden telefon titredi. Leyla; karakoldan biri büroyu aramış.
leyla: Bir polisin kapısında “şikâyet ederim” diye bağıran avukat, o polisi kürsüde kaybeder. Şikâyetin varsa yazarsın Deniz. Bağırmazsın. [phone]
`),
      next: '$return',
    }),
  ],
});

const tNermin = conversation('INV_T_NERMIN', {
  ...INV,
  title: 'Nermin Aksoy',
  eyebrow: 'TANIKLAR',
  background: 'sokak_yagmur',
  room: { label: 'SETBAŞI · KAPI', character: 'nermin' },
  lines: B(`
# CUMA 19.10 — SETBAŞI, ESKİ BİR APARTMAN [bg:sokak_yagmur]
> Üçüncü kat. Kapının önünde bir paspas, üstünde “Hoş geldiniz” yazısı neredeyse silinmiş. Zili çaldım. İçeride bir televizyonun sesi kısıldı.
> Kapı zincirli açıldı. Aralıktan bir göz, bir gözlük, bir hırka.
nermin: Kimsiniz?
- Av. Deniz Arslan. Barış Kılınç’ın avukatıyım. Rahatsız etmek istemem.
> Zincir yerinde kaldı. Bir süre hiçbir şey olmadı. Sonra kadının sesi geldi; yorgun, kibar, kararlı.
nermin: Avukat kızım… Ben anlattım. Polise anlattım, savcıya anlattım. Bir daha anlatmam. Mahkemede görürsünüz beni.
nermin: O gece benim saatimi aldılar. İsmail’in saatini. On iki yıldır cebimde taşıyordum. Siz onu bulabilir misiniz?
~ Kapının aralığında bir kadın ve bir saat. Bu kapıdan içeri girmeye hakkım yok. Girmek istemem bile bir şey söylüyor.
`),
  choices: [
    option('N_KART', 'Kartını bırak ve git', {
      score: { SAVUNMA_STRATEJISI: 40 },
      good: 'Mağdurla temas kurmak yasak değildir; ama ısrar etmemek, beyanını etkilemekten kaçınmak doğru meslek davranışıdır (Av.K. 34).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Haklısınız Nermin Hanım. Kartımı bırakıyorum; bir şey söylemek isterseniz savcılık aracılığıyla da ulaşabilirsiniz. Geçmiş olsun.
> Kartı paspasın üstüne bıraktım. Zincirli kapı bir süre aralık kaldı. Sonra yavaşça kapandı; çarpmadan.
nermin: Sağ ol kızım. Sen de… sen de dikkat et. Merdivenler kaygandır.
~ Kazandığım bir şey yok. Kaybetmediğim bir şey var.
`),
      next: '$return',
    }),
    option('N_ISRAR', '“Size gösterilen fotoğrafı soracağım, beş dakika.”', {
      effects: [inc('ethics'), raise('nermin_baski'), score('SAVUNMA_STRATEJISI', -50)],
      bad: 'Tanıklık yapacak mağdurun kapısında ısrar etmek beyanını etkileme girişimi sayılabilir (TCK 277; Av.K. 34). Mağdur savcılığa başvurdu.',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Beş dakika Nermin Hanım. Size acilde bir fotoğraf gösterildi mi? Sadece bunu bilmem lazım. Lütfen.
nermin/kizgin: Ne diyorsun sen? Kim gösterdi? Ne fotoğrafı? Beni mi suçluyorsun şimdi, ben mi yalancıyım?
> Kapı zincirine rağmen sertçe kapandı. İçeriden bir kilit, sonra ikincisi döndü. {shake}
> Merdiven boşluğunda bir komşu kapısı aralandı, kapandı.
~ Ertesi sabah savcılığa bir dilekçe gidecekti: “Sanığın avukatı evime geldi.” Ve haklı olacaktı.
`),
      next: '$return',
    }),
  ],
});

// --- Belgeler ---

const teshis = documentExam('INV_TESHIS', {
  ...INV,
  title: 'Fotoğrafla teşhis tutanağı',
  hud: ['exam_left'],
  background: 'buro',
  lines: B(`
# BÜRO — DOSYANIN ASLI [bg:buro]
> Tutanak iki sayfa. İlk sayfada altı fotoğrafın fotokopisi, ikincide imzalar ve kutucuklar. Kutucukların yarısı boş.
~ Bir alet seç, sonra belgede şüpheli satıra dokun. Doğru alet, doğru yer: yeni bir ipucu.
`),
  header: { left: 'OSMANGAZİ ASAYİŞ BÜRO · FOTOĞRAFLA TEŞHİS', right: '19.01 · 10.05' },
  columns: [
    { label: 'SATIR', flex: 1.2 },
    { label: 'İÇERİK', flex: 1.6 },
    { label: 'NOT', flex: 1.2 },
  ],
  rows: [
    row('tarif', ['Tarif beyanı', '“Genç, ince, kapüşonlu, kurye.”', 'saat: 10.20']),
    row('f1', ['Foto 1', 'Siyah-beyaz · 9×12', '~45 yaş, bıyıklı']),
    row('f2', ['Foto 2', 'Siyah-beyaz · 9×12', '~52 yaş, kel']),
    row('f3', ['Foto 3', 'Renkli · 13×18', '~19 yaş, kazınmış saç']),
    row('f4', ['Foto 4–6', 'Siyah-beyaz · 9×12', '~38, ~40, ~48 yaş']),
    row('tekrar', ['Tekrar sayısı', '1', '—']),
    row('hatir', ['“Aralarında olmayabilir” uyarısı', 'boş', '—']),
    row('sonuc', ['Sonuç', '3 numara, “hemen”', 'imza: N. Aksoy']),
  ],
  tools: [
    tool('mag', 'Büyüteç', 'magnifier'),
    tool('compare', 'Karşılaştır', 'compare'),
    tool('law', 'Mevzuat', 'check'),
  ],
  costVar: 'exam_left',
  rules: [
    examine('EX_T_F3', 'compare', 'f3', {
      discovers: 'clue_foto_farkli',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · TEK RENKLİ KARE',
        text: 'Beş fotoğraf siyah-beyaz, 9×12, hepsi 38–52 yaş. Biri renkli, 13×18, on dokuz yaşında bir genç. Göz önce onu görür; sonra ötekilerin yaşını.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
      responses: B(`
~ Altı fotoğraf değil bu. Bir fotoğraf ve beş fon.
`),
    }),
    examine('EX_T_TARIF', 'mag', 'tarif', {
      discovers: 'clue_tarif_sonra',
      score: { DELIL_ANALIZI: 100 },
      feedback: {
        title: 'YENİ İPUCU · SAAT',
        text: 'Teşhis 10.05’te. Tarif beyanının yanında başka bir kalemle: “10.20.” Kadın önce seçmiş, sonra tarif etmiş.',
        label: '+100 SKOR · Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_T_TEKRAR', 'law', 'tekrar', {
      discovers: 'clue_tek_tekrar',
      score: { DELIL_ANALIZI: 100 },
      feedback: {
        title: 'YENİ İPUCU · TEKRAR',
        text: 'Teşhis bir kez yapılmış. Kural en az iki kez ister; her seferinde yerler değişir. Video kaydı kutusu da boş.',
        label: '+100 SKOR · Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_T_HATIR', 'law', 'hatir', {
      effects: [ifThen(not(has('clue_tek_tekrar')), [discover('clue_tek_tekrar'), score('DELIL_ANALIZI', 100)])],
      feedback: {
        title: 'UYARI YAPILMAMIŞ',
        text: 'Teşhis edene “aradığınız kişi bunlar arasında olmayabilir” denmesi gerekir. Kutu boş. Tekrar sayısı da bir.',
        label: 'Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_T_F1', 'mag', 'f1', {
      score: { DELIL_ANALIZI: 20 },
      feedback: {
        title: 'DOLGU FOTOĞRAF',
        text: 'Kırk beş yaşında, bıyıklı bir adam. Kadın “genç, ince” demiş. Bu fotoğrafın tek işi, seçilmemek.',
        label: '+20 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: fallback('FB_TESHIS', 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: { title: 'SONUÇ YOK', text: 'Bu aletle burada bir şey görünmüyor.', label: '−20 SKOR', tone: 'error' },
  }),
  finish: { id: 'TESHIS_BITIR' },
});

const ihbar = documentExam('INV_112', {
  ...INV,
  title: 'İhbar formu ve çağrı dökümü',
  hud: ['ex112'],
  background: 'buro_gece',
  lines: B(`
# BÜRO — GECE [bg:buro_gece]
> İnce bir form. Altında üç sayfa döküm; saat damgalı, satır satır. Ses kaydı ayrı bir CD’de, zarfın içinde. Zarfın ağzı hiç açılmamış.
~ Leyla haklıydı. Kimse okumamış. CD’yi bilgisayara taktım. Kulaklığı taktım. Bir kadının en kötü dakikası kulağıma doldu.
`),
  header: { left: '112 ACİL ÇAĞRI MERKEZİ · ÇAĞRI DÖKÜMÜ', right: '18.01 · 23.43' },
  columns: [
    { label: 'SAAT', flex: 0.9 },
    { label: 'KONUŞAN', flex: 0.9 },
    { label: 'METİN', flex: 2.2 },
  ],
  rows: [
    row('c1', ['23.43.08', 'Arayan', 'Çantamı aldılar… merdivende, Sırmakeş’te.']),
    row('c2', ['23.43.21', 'Arayan', 'İtti beni, düştüm, elim kesildi.']),
    row('c3', ['23.43.40', 'Operatör', 'Kim aldı, gördünüz mü?']),
    row('c4', ['23.43.47', 'Arayan', 'Kurye gibiydi, sırtında sarı kutu.']),
    row('c5', ['23.44.02', 'Arayan', 'Genç. İnce. Kulağında… (anlaşılamadı)'], {
      dinle: {
        cells: ['23.44.02', 'Arayan', 'Genç. İnce. Kulağında halka vardı, parladı. Sol kulağında.'],
        tone: 'special',
      },
    }),
    row('c6', ['23.44.15', 'Bakkal', 'Abla otur, ambulans geliyor.']),
    row('c7', ['23.44.30', 'Operatör', 'Ekip yönlendirildi.']),
  ],
  tools: [
    tool('mag', 'Büyüteç', 'magnifier'),
    tool('compare', 'Kolluk ifadesiyle karşılaştır', 'compare'),
    tool('dinle', 'Ses kaydını dinle', 'phone'),
  ],
  costVar: 'ex112',
  rules: [
    examine('EX_112_HALKA', 'dinle', 'c5', {
      discovers: 'clue_halka',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · HALKA',
        text: 'Kâtip “anlaşılamadı” yazmış. Ses kaydında anlaşılıyor: “Kulağında halka vardı, parladı. Sol kulağında.” Ertesi sabahki ifadede halka yok.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'special',
      },
      responses: B(`
~ Bir halka. Parlayan bir şey. Ertesi sabah kadının elinde bir bıçağa dönüşmüş olan parıltı, belki de buydu.
`),
    }),
    examine('EX_112_BICAK', 'compare', 'c2', {
      discovers: 'clue_bicak_yok',
      score: { DELIL_ANALIZI: 150 },
      feedback: {
        title: 'YENİ İPUCU · BIÇAK YOK',
        text: '112’de: “İtti beni, düştüm, elim kesildi.” Kolluk ifadesinde: “Elinde bıçak vardı, elimi kesti.” Aradaki on iki saatte bir bıçak ortaya çıkmış.',
        label: '+150 SKOR · Not defterine eklendi',
        tone: 'success',
      },
    }),
    examine('EX_112_KUTU', 'mag', 'c4', {
      discovers: 'clue_kutu',
      score: { DELIL_ANALIZI: 40 },
      feedback: {
        title: 'SARI KUTU',
        text: 'Polisi kuryelere yönelten ayrıntı bu. Bursa’da gece yarısı yüzlerce sarı kutu dolaşır.',
        label: '+40 SKOR · Not defterine eklendi',
        tone: 'neutral',
      },
    }),
    examine('EX_112_SES', 'dinle', 'c1', {
      score: { DELIL_ANALIZI: 20 },
      feedback: {
        title: 'SES',
        text: 'Ses titremiyor. Şokta olanların sesi titremez; titreme sonra gelir. Bu, kadının o dakikadaki aklının başında olduğunu gösterir.',
        label: '+20 SKOR',
        tone: 'neutral',
      },
    }),
  ],
  miss: fallback('FB_112', 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: { title: 'SONUÇ YOK', text: 'Bu satırda bu aletle bir şey çıkmadı.', label: '−20 SKOR', tone: 'error' },
  }),
  finish: { id: 'IHBAR_BITIR' },
});

export const uedasDoc = (id: string, chapterSpread: typeof INV, returnTo?: string) =>
  retarget(
    documentExam(id, {
      ...chapterSpread,
      title: 'UEDAŞ kesinti kaydı',
      hud: ['ued_left'],
      background: 'buro',
      lines: B(`
> UEDAŞ’ın cevabı iki sayfa. Kurumsal bir dil, tablolar, kısaltmalar. Bir şehrin bir gecesi, kilovatsaat cinsinden.
`),
      header: { left: 'UEDAŞ · ARIZA VE KESİNTİ KAYDI', right: '18.01' },
      columns: [
        { label: 'BÖLGE', flex: 1.5 },
        { label: 'SAAT', flex: 1 },
        { label: 'AÇIKLAMA', flex: 1.5 },
      ],
      rows: [
        row('u1', ['Osmangazi / Tophane', '—', 'Kesinti yok']),
        row('u2', ['Yıldırım / Mimar Sinan', '23.36–23.51', 'Trafo arızası (T-114)']),
        row('u3', ['Yıldırım / Vatan', '22.10–22.25', 'Planlı bakım']),
        row('u4', ['186 çağrıları, T-114', '23.37–23.50', '41 çağrı']),
      ],
      tools: [
        tool('mag', 'Büyüteç', 'magnifier'),
        tool('compare', 'Kadir Usta’nın anlatısıyla karşılaştır', 'compare'),
      ],
      costVar: 'ued_left',
      rules: [
        examine(`${id}_EX_U2`, 'compare', 'u2', {
          discovers: 'clue_kesinti',
          score: { DELIL_ANALIZI: 150 },
          feedback: {
            title: 'YENİ İPUCU · KESİNTİ',
            text: 'Mimar Sinan Mahallesi: 23.36’da kesildi, 23.51’de verildi. Kadir Usta’nın mumu, Barış’ın öksürüğü, televizyonun kendi kendine açılması: hepsi bu on beş dakikanın içinde.',
            label: '+150 SKOR · Not defterine eklendi',
            tone: 'special',
          },
        }),
        examine(`${id}_EX_U4`, 'mag', 'u4', {
          score: { DELIL_ANALIZI: 20 },
          effects: [raise('fact_186')],
          feedback: {
            title: '41 ÇAĞRI',
            text: 'Kesinti sırasında kırk bir kişi arıza hattını aramış. Kim oldukları bu kayıtta yok. Arayanların telefonlarında var.',
            label: '+20 SKOR',
            tone: 'neutral',
          },
        }),
        examine(`${id}_EX_U1`, 'mag', 'u1', {
          score: { DELIL_ANALIZI: 10 },
          feedback: {
            title: 'TOPHANE',
            text: 'Olay yerinde kesinti yok. Merdivenin lambası yanıyordu. Kadının bir yüz görmesi mümkündü; bu dosyanın sorusu görüp görmemesi değil.',
            label: '+10 SKOR',
            tone: 'neutral',
          },
        }),
      ],
      miss: fallback(`${id}_FB`, 'EXAMINE', {
        score: { DELIL_ANALIZI: -20 },
        feedback: { title: 'SONUÇ YOK', text: 'Bu satırda bir şey yok.', label: '−20 SKOR', tone: 'error' },
      }),
      finish: { id: `${id}_BITIR` },
    }),
    returnTo,
  );

// --- Dilekçe ---

const slotCost = [{ var: 'slots', amount: 1 }];
const dil = story('INV_DIL', {
  ...INV,
  title: 'Delil talebi dilekçesi',
  hud: ['slots'],
  background: 'buro',
  lines: [
    W(
      not(flag('dil_any')),
      `
# BÜRO — DİLEKÇE [bg:buro]
> Boş bir dilekçe. “Bursa 6. Ağır Ceza Mahkemesi Başkanlığı’na.” İmleç yanıp sönüyor.
~ Üç talep. Mahkeme her talebi kabul etmez; her gereksiz talep, gerçek talebin ağırlığını eksiltir.
`,
    ),
    O(`
> Dilekçe uzuyor. İmleç hâlâ yanıp sönüyor.
`),
  ],
  choices: [
    option('DIL_UEDAS', 'UEDAŞ’tan 18 Ocak kesinti kaydı', {
      visibleWhen: flag('fact_kesinti'),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 50 },
      effects: [raise('dil_uedas'), raise('dil_any')],
      good: 'Tanığın anlatısını bağımsız bir kayıtla saate bağlamak doğru talep (CMK 177; özel şirket kaydı mahkeme yazısıyla istenir).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_GOZLEM', 'Hastaneden hemşire gözlem formu', {
      visibleWhen: any(has('clue_gamze'), has('clue_triyaj'), has('clue_gamze_beyan')),
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: 50 },
      effects: [raise('dil_gozlem'), raise('dil_any')],
      good: 'Acil servis kayıtları teşhis öncesi temasın belgesidir; mahkeme yazısıyla istenir (CMK 177, 332).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_KAMERA', 'Hastane koridor kamera kaydı', {
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: -20 },
      effects: [raise('dil_any')],
      bad: 'Hastane görüntüleri 30 gün saklanır; üç ay sonra istenen kayıt yoktur. Bir talep hakkı boşa gitti.',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    option('DIL_KESIF', 'Olay yerinde keşif', {
      cost: slotCost,
      maxUses: 1,
      effects: [raise('dil_any')],
      neutral: 'Merdiven yerinde duruyor; keşif mesafeyi gösterir, kimin orada olduğunu göstermez.',
      next: '$stay',
    }),
    option('DIL_YENI_TESHIS', 'Mağdura yeniden teşhis yaptırılması', {
      cost: slotCost,
      maxUses: 1,
      score: { USUL_BILGISI: -40 },
      effects: [raise('dil_any')],
      bad: 'Aynı yüzü ikinci kez gören tanıkta yeni teşhis, kirliliği temizlemez, pekiştirir. Kirlenmiş teşhis tekrarla düzelmez (CMK 217 takdiri; PVSK ek md. 6).',
      category: 'USUL_BILGISI',
      next: '$stay',
    }),
    cont('DIL_VER', 'Dilekçeyi ver', '$return', {
      role: 'PRIMARY',
      effects: [raise('dil_verildi')],
      enabledWhen: flag('dil_any'),
    }),
    back('DIL_GERI', 'Sonra yazarım'),
  ],
});

// --- Tahta ---

const POOL = [
  'clue_cam',
  'clue_aski',
  'clue_motor',
  'clue_ates',
  'clue_balkon',
  'clue_aile_foto',
  'clue_vesikalik',
  'clue_triyaj',
  'clue_gamze_beyan',
  'clue_halka',
  'clue_bicak_yok',
  'clue_kutu',
  'clue_foto_farkli',
  'clue_tarif_sonra',
  'clue_tek_tekrar',
  'clue_kulak',
  'clue_eski_foto',
  'clue_kadir',
  'clue_ali_halka',
  'clue_ferhat',
  'clue_kesinti',
];

export const invRecipes = (prefix: string): ChoiceDef[] => [
  recipe(`${prefix}_KIRLENME`, 'clue_gamze_beyan', 'clue_foto_farkli', {
    effects: firstTime('ded_kirlenme'),
    feedback: feedbackNew(
      'Teşhis acilde kirlendi',
      'Acilde telefonda tek bir kare; ertesi sabah aynı kare, beş soluk fotoğrafın arasında renkli ve büyük.',
    ),
    responses: B(`
~ Kadın karakolda bir yüz seçmedi. Dokuz saat önce gördüğü bir fotoğrafı tanıdı. Kendi hafızası değil, bir polisin telefonu konuşuyordu.
`),
  }),
  recipe(`${prefix}_KIRLENME2`, 'clue_ferhat', 'clue_foto_farkli', {
    effects: firstTime('ded_kirlenme'),
    feedback: feedbackNew(
      'Teşhis acilde kirlendi',
      'Komiser yardımcısı “bir baktırdım” dedi; tutanakta o kare tek başına renkli ve büyük.',
    ),
    responses: B(`
~ “Bir baktırdım.” Bir cümle, bir fotoğraf; ve bir teşhis tutanağı ki aslında bir tekrardan ibaret.
`),
  }),
  recipe(`${prefix}_USULSUZ`, 'clue_tarif_sonra', 'clue_tek_tekrar', {
    effects: firstTime('ded_usulsuz'),
    feedback: feedbackNew('Teşhis usulüne aykırı', 'Tarif sonradan yazıldı; işlem bir kez, uyarısız yapıldı.'),
    responses: B(`
~ Kuralın her güvencesi aynı sabah, aynı odada atlanmış. Acele, bir yöntem değildir.
`),
  }),
  recipe(`${prefix}_HALKA`, 'clue_halka', 'clue_kulak', {
    effects: firstTime('ded_halka'),
    feedback: feedbackNew(
      'İlk tarif müvekkile uymuyor',
      'Failin sol kulağında halka vardı; Barış’ın kulakları hiç delinmemiş.',
    ),
    responses: B(`
~ Kirlenmeden önceki tek tarif. Bir dakika sonra, bir bakkalın telefonundan. Ve o tarif, sanık sandalyesinde oturan çocuğu dışarıda bırakıyor.
`),
  }),
  recipe(`${prefix}_HALKA2`, 'clue_ali_halka', 'clue_kulak', {
    effects: firstTime('ded_halka'),
    feedback: feedbackNew('İlk tarif müvekkile uymuyor', 'Bakkal da halkayı duydu; Barış’ın kulakları delinmemiş.'),
    responses: B(`
~ Bir bakkalın hafızası, bir kadının unuttuğunu saklamış.
`),
  }),
  recipe(`${prefix}_BICAK`, 'clue_bicak_yok', 'clue_cam', {
    effects: firstTime('ded_bicak'),
    feedback: feedbackNew('Bıçak yoktu', '112’de bıçak yok; basamakta kanlı bir şişe kırığı var. Kesi düşüşten.'),
    responses: B(`
~ Parlayan şey bir bıçak değildi. Kesen şey bir bıçak değildi. Bıçak, bir hastane odasında, bir polisin ağzında doğdu.
`),
  }),
  recipe(`${prefix}_MAZERET`, 'clue_kadir', 'clue_kesinti', {
    effects: firstTime('ded_mazeret'),
    feedback: feedbackNew(
      'Barış kesintide evdeydi',
      'Kadir Usta kesinti sırasında onunla balkonda konuştu: 23.36–23.51.',
    ),
    responses: B(`
~ Bir terzinin mumu ve bir şirketin kaydı. Biri hafıza, öbürü makine; ikisi aynı on beş dakikayı söylüyor. Olay yeri dört kilometre ötede.
`),
  }),
  recipe(`${prefix}_ESKI`, 'clue_eski_foto', 'clue_vesikalik', {
    effects: firstTime('ded_eski_foto'),
    feedback: feedbackNew(
      'Gösterilen yüz bugünkü Barış değil',
      'Kazınmış saçlı üç yıllık kare; bugünkü Barış uzun saçlı, sakallı.',
    ),
    responses: B(`
~ Kadın bir yüzü tanıdı. Ama o yüz artık kimseye ait değil; üç yıl önce bir karakol duvarının önünde kalmış bir yüz.
`),
  }),
];

const cikarim = deductionBoard('INV_CIKARIM', {
  ...INV,
  title: 'Çıkarım tahtası',
  background: 'buro_gece',
  lines: B(`
> İki ipucunu seç. Birbirini tamamlıyorsa duruşmada kullanabileceğin bir delil doğar.
~ Pano, iğneler, kırmızı ip. Leyla bununla dalga geçer. Sonra gelip uzun uzun bakar.
`),
  pool: POOL,
  recipes: [
    ...invRecipes('CB'),
    recipe('CB_X_ATES', 'clue_ates', 'clue_kutu', {
      score: { DELIL_ANALIZI: -50 },
      feedback: {
        title: 'Yanlış iz',
        text: 'Ateşli bir kurye ve sarı bir kutu. İkisi de doğru; ama birbirini açıklamıyor.',
        label: 'BAĞLANTI YOK · −50 SKOR',
        tone: 'error',
      },
    }),
    recipe('CB_X_AILE', 'clue_aile_foto', 'clue_aski', {
      score: { DELIL_ANALIZI: -50 },
      feedback: {
        title: 'Yanlış iz',
        text: 'Bir aile fotoğrafı ve kopuk bir askı. Tahtada yan yana iyi duruyorlar; mahkemede hiçbir şey söylemezler.',
        label: 'BAĞLANTI YOK · −50 SKOR',
        tone: 'error',
      },
    }),
  ],
  miss: fallback('FB_CIKARIM', 'COMBINE', {
    repeat: 'ONCE_PER_PARAMS',
    score: { DELIL_ANALIZI: -50 },
    feedback: {
      title: 'Bu ikisi birbirini açıklamıyor',
      text: 'Başka bir ipucu dene.',
      label: 'BAĞLANTI YOK · −50 SKOR',
      tone: 'error',
    },
  }),
  finish: { id: 'CIKARIM_BITIR' },
});

// --- Leyla ---

const leyla = story('INV_LEYLA', {
  ...INV,
  title: 'Leyla’ya danış',
  background: 'buro',
  lines: [
    W(
      all(cmp(v('day'), '==', 1), not(has('clue_foto_farkli'))),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Teşhis tutanağını okudun mu? Okumadan bana gelme.
leyla: Kısaca söyleyeyim, sonra kendin bul: Polis Vazife ve Salahiyet Kanunu ek 6. Önce tarif tutanağa geçer, sonra teşhis.
leyla: Benzer kişiler; birden fazla, aynı büyüklükte fotoğraf; en az iki tekrar; “aralarında olmayabilir” uyarısı. Tek fotoğrafla teşhis yasak.
leyla: Kural bir sınavdır Deniz. Tutanak o sınavın kâğıdı. Kâğıda bak; hangi soru boş bırakılmış?
leyla: Bir de 112. Bir tanığın ilk sözü, en az kirlenmiş sözüdür. Olaydan bir dakika sonra kimse ona bir şey göstermemiştir; kimse ona bir şey söylememiştir.
leyla: Sonraki her ifade bir öncekinin üstüne yazılır. Bir palimpsest gibi. Eski yazıyı görmek istiyorsan, en alttaki kâğıda in.
~ Palimpsest. Leyla bu kelimeyi otuz yıldır kullanıyor; her stajyere bir kere. Sıra bana gelmiş.
`,
    ),
    W(
      cmp(v('day'), '==', 1),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Bir çatlak buldun, yüzünden belli. Sevinme. Usule aykırı teşhis yok hükmünde değildir; hâkim onu takdir eder, CMK 217.
leyla: Mahkemeye “usul bozuk” dersen, “peki kim yaptı” der. Usulün yanına bir de insan koy. Kim gördü, kim bir şey biliyor?
leyla: Bir de şunu unutma: kolluk teşhisi savcının talimatıyla yapar. Tutanağı polis yazar, ama altında savcının imzası yoktur. Savcı tutanağı okumadan iddianameye geçirmiş olabilir.
leyla: Bu iyi haber değil. Kimse okumadıysa, kimse de “ben yanıldım” demek istemez. Onlara kendi kâğıtlarını okutman gerekecek.
`,
    ),
    W(
      all(cmp(v('day'), '==', 2), not(has('clue_kadir'))),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Mazeret. Annesi “evdeydi” diyor. Aile tanığını hâkim dinler ama tartarken elini kefeye koyar.
leyla: Bağımsız biri lazım. Bir komşu, bir kayıt, bir saat. Evine gittin mi? Kimsenin bakmadığı yere bak.
leyla: Mazeret bir hikâyedir Deniz. Hâkim o hikâyeyi dinler ve kendine sorar: bunu anlatanın bir çıkarı var mı? Anne: var. Abla: var. Komşu: belki yok.
leyla: Ve hikâyenin bir saati olmalı. Saati olmayan mazeret, “bir ara evdeydi” demektir. Bir ara her yerde olunabilir.
`,
    ),
    W(
      cmp(v('day'), '==', 2),
      `
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Komşu iyi. Saate bakmamış; daha iyi. Saat söyleyen tanık şüphelidir, saati kaydın söylemesi gerekir.
leyla: Bir de şunu unutma: tanığına ne diyeceğini söylersen o artık senin tanığın olur. Senin tanığın da kimsenin tanığı değildir.
leyla: Bir de kayıt. Elektrik kesintisini bir kurum kaydetmiştir; trafo arızasını, kaç kişinin aradığını. Bu şehirde her şey bir yerde yazılı Deniz. İnsanlar unutur, sunucular unutmaz.
leyla: Dilekçeyi gününde ver. Kanun duruşmadan en az beş gün önce ister. Geç kalan dilekçe, hiç yazılmamış dilekçedir.
`,
    ),
    O(`
# BÜRO — LEYLA’NIN ODASI [bg:buro]
leyla: Yarın değil, birkaç gün sonra o kadın kürsüde olacak. Onu yenmeye çalışma.
leyla: Yalancı olmayan bir tanığı çürütmek kolaydır; kimse ona inanmaz olur, sen de kazanırsın, o da bir daha kimseye bir şey anlatmaz.
leyla: Zor olan, onun hafızasının nasıl değiştirildiğini, ona dokunmadan göstermek. Kâğıtlarla göster. Saatlerle. Onun kendi ilk sözleriyle.
leyla: Bir de salon. Savcı ona “salonda gördüğünüz kişi bu mu” diye soracak; sanık sandalyesinde oturan tek genci göstererek. Bu bir teşhis değildir. Bu bir sahnedir.
leyla: O soruyu duyunca ayağa kalk. Usulle kalk; öfkeyle değil.
> Sigara paketini avucunda çevirdi. Açmadı. Dört yıldır açmadığı gibi.
leyla: Bir şey daha: o kadının kapısını çalma. Çaldıysan bir daha çalma. Tanığın kapısı, avukatın sınırıdır.
`),
  ],
  choices: [back('LEYLA_DON', 'Teşekkür et')],
});

// --- Gün sonları ---

const dayEnd = decisionNode('INV_DAY_END', [{ when: cmp(v('day'), '==', 2), to: 'INV_AKSAM1' }, { to: 'INV_AKSAM2' }], {
  ...INV,
  title: 'Gün sonu',
  onEnter: [...dayEndDeliveries.effects, inc('day', 1), set('ap', 4)],
});

const aksam1 = story('INV_AKSAM1', {
  ...INV,
  title: 'İlk akşam',
  background: 'buro_gece',
  lines: [
    W(
      flag('dil_any'),
      `
# GECE 22.10 — ARSLAN HUKUK [bg:buro_gece]
> Büroda Leyla’yla ikimiz kaldık. Dilekçenin çıktısı masada; imzam henüz kurumadı. Leyla gözlüğünün üstünden baktı.
leyla: Bugün çok şey okudun. Bir şey sorayım: bugün kime inandın?
`,
    ),
    O(`
# GECE 22.10 — ARSLAN HUKUK [bg:buro_gece]
> Büroda Leyla’yla ikimiz kaldık. Yağmur camda. Leyla gözlüğünü çıkardı, burnunun kemerini ovuşturdu.
leyla: Bugün çok şey okudun. Bir şey sorayım: bugün kime inandın?
`),
  ],
  choices: [
    option('AK1_KAGIT', '“Kâğıtlara.”', {
      effects: [set('aksam1', 'KAGIT')],
      responses: B(`
leyla: Kâğıtlar yalan söylemez. Ama kâğıtları insanlar yazar, insanlar boş bırakır. Boş kutulara da inan.
leyla: Bir de şunu bil: kâğıtlara inanan avukat insanları unutur. İnsanlara inanan avukat kâğıtları. İkisini birden tutmaya çalış; zor, ama meslek bu.
~ Boş kutular. Teşhis tutanağında üç tane vardı.
`),
      next: 'INV_HUB',
    }),
    option('AK1_NERMIN', '“Nermin Hanım’a. Yalan söylemiyor.”', {
      effects: [set('aksam1', 'NERMIN')],
      responses: B(`
leyla: Güzel. Bunu unutma. O kadına inanmaya devam edersen, kürsüde onu kırmazsın.
leyla: Ama inanmak, haklı olduğunu düşünmek değildir. İnsanlar dürüstçe yanılır.
leyla: Otuz yıldır bu işi yapıyorum. Yalancı tanık az gördüm. Yanılan tanık çok. Yalancı tanığı çürütürsün; yanılan tanığı anlarsın. Farkı kürsüde görünür.
~ Dürüstçe yanılmak. Bu dosyanın adı bu olmalıydı.
`),
      next: 'INV_HUB',
    }),
    option('AK1_KIMSE', '“Kimseye.”', {
      effects: [set('aksam1', 'KIMSE')],
      responses: B(`
leyla: Avukatlıkta ilk yıl herkese inanırsın, ikinci yıl kimseye. Üçüncü yıl ne zaman kime inanacağını öğrenirsin.
leyla: Sen dördüncü yılını yaşıyorsun. Öğrenmiş olman gerekirdi.
~ Leyla kapıdan çıkarken ışığı kapattı. Kasıtlı mı bilmiyorum.
`),
      next: 'INV_HUB',
    }),
  ],
});

const aksam2 = story('INV_AKSAM2', {
  ...INV,
  title: 'Kapıdaki genç',
  background: 'buro_gece',
  onFirstEnter: [meet('tolga')],
  lines: B(`
# GECE 21.30 — ARSLAN HUKUK [bg:buro_gece]
> Tam ışıkları kapatıyordum ki zil çaldı. Kapıda yirmi beş yaşlarında bir genç; sırılsıklam, iş botları çamurlu, montunun cebinden bir baret çıkartması sarkıyor.
tolga: Abla… kusura bakmayın. Tolga. Barış’ın amcasının oğluyum. Bir dakika. İçeri girmem, ıslağım.
> Kapının eşiğinde durdu. Ellerini cebinden çıkarıp yeniden soktu. Soğuktan mı titriyordu, bilmiyorum.
tolga: Derya abla avukat tuttu, biliyorum. Salonun parası. Ben… bu da benden. Ücrete katkı.
> Bir zarf uzattı. İnce, buruşuk, kenarı ıslanmış. Bir inşaat işçisinin haftalığı kadar.
tolga: Ablaya söylemeyin. Kızar. “Senin paran mı var” der. Var. Biriktirdim. Barış için.
- Barış’ı görmeye gidiyor musun? Cezaevine?
tolga: Gidemiyorum abla. Şantiye sabah altıda başlıyor, akşam yedide bitiyor. Görüş günleri hep mesaiye denk geliyor.
> Zarfın ıslak kenarını parmağıyla düzeltti. Kalfa elleri; tırnak diplerinde çimento.
tolga: O kimseye bir şey yapmaz abla. Biz beraber büyüdük. Bayram sabahları aynı motora binerdik.
~ Bir kuzen ve bir zarf. Bu dosyada herkes Barış için bir şey veriyor: bir abla kirasını, bir anne uykusunu, bir kuzen haftalığını.
> Merdiven boşluğunun lambası söndü; otomatik. Karanlıkta bir süre ikimiz de kıpırdamadık. Sonra düğmeye bastım; lamba yeniden yandı. Tolga hâlâ oradaydı, aynı yerde, aynı duruşla.
`),
  choices: [
    option('ZARF_AL', 'Zarfı al, makbuz ver', {
      effects: [raise('zarf_aldi')],
      neutral:
        'Üçüncü kişinin ücrete katkısı tek başına yasak değildir; ama ilerde çıkar çatışması doğarsa iade ve bildirim gerekir.',
      responses: B(`
- Peki Tolga. Makbuzunu keseyim; adına.
tolga: Adıma olmasın abla… Barış’ın adına yazın. Ben… bir şey değil.
> Makbuzu almadan merdivenleri indi. Zarf masamda kaldı; ıslak bir leke bırakarak.
~ Ücretimi kimin ödediği önemli mi? Şimdilik değil. Avukatlıkta “şimdilik” kelimesinin bir son kullanma tarihi vardır.
`),
      next: 'INV_HUB',
    }),
    option('ZARF_RED', 'Nazikçe geri çevir', {
      responses: B(`
- Sağ ol Tolga. Ücret konuşuldu, Derya Hanım’la. Bu sende kalsın; Barış’a, annesine bir şey lazım olur.
tolga: Ama abla…
- Gerçekten. Bir de görüşe git. Camın arkasından da olsa. Seni görmek ona iyi gelir.
tolga/uzgun: Giderim. Gideceğim. Sağ olun.
> Zarfı cebine soktu. Merdivenleri inerken iki kere durdu; ikisinde de geri dönmedi.
~ Gitmeyecekti. Bunu bilmek için avukat olmak gerekmiyordu.
`),
      next: 'INV_HUB',
    }),
    option('ZARF_DERYA', '“Derya Hanım’la birlikte konuşalım.”', {
      effects: [raise('tolga_derya')],
      responses: B(`
- Derya Hanım’ı arayalım, birlikte konuşalım. Ücret konusunu o yürütüyor.
> Tolga’nın yüzünden bir şey geçti. Utanç mı, korku mu, bilmiyorum.
tolga: Yok abla, yok. Rahatsız etmeyin. Ben… ben giderim. İyi geceler.
> Zarfı cebine tıkıştırdı ve merdivenleri indi. Sokak kapısı arkasından çarptı. {shake}
~ Bir ailede para konuşulunca herkes biraz utanır. Tolga biraz fazla utandı; ya da ben biraz fazla yorgundum.
`),
      next: 'INV_HUB',
    }),
  ],
});

// --- Duruşmadan önceki gece ---

const gece = [
  decisionNode('INV_GECE_1', [{ to: 'INV_GECE_2' }], {
    ...INV,
    title: 'Duruşmadan önceki gece',
    onEnter: [...nightDeliveries.effects],
    lines: B(`
# PAZARTESİ 23.10 — ARSLAN HUKUK [bg:buro_gece]
> Panoyu son kez toparladım. Raptiyeler, ipler, bir yığın fotokopi. Bir davanın iskeleti.
`),
  }),
  decisionNode('INV_GECE_2', [{ to: 'INV_GECE_3' }], {
    lines: [
      W(
        any(has('ded_kirlenme'), has('ev_gozlem')),
        `~ Perdenin arkasında ne olduğunu artık biliyorum. Bir telefon, bir kare, bir “galiba.”`,
      ),
      W(
        has('clue_foto_farkli'),
        `~ Tutanakta bir fotoğraf ötekilerden parlıyor. Neden parladığını henüz kanıtlayamıyorum.`,
      ),
      O(`~ Teşhis tutanağı hâlâ bana sırtını dönmüş duruyor. Okudum mu, gerçekten okudum mu?`),
    ],
  }),
  decisionNode('INV_GECE_3', [{ to: 'INV_GECE_4' }], {
    lines: [
      W(has('ded_halka'), `~ Bir halka. Kirlenmeden önceki tek tarif. Barış’ın kulakları kadar temiz bir gerçek.`),
      W(
        has('clue_halka'),
        `~ “Kulağında halka vardı.” Bunu duyan oldu. Görmeyen biri lazım: halkası olmayan bir kulak.`,
      ),
      O(`~ Kadının o gece ilk ne dediğini hâlâ tam bilmiyorum. Bu bir eksik.`),
    ],
  }),
  decisionNode('INV_GECE_4', [{ to: 'INV_GECE_5' }], {
    lines: [
      W(
        has('ded_mazeret'),
        `~ Bir mum, bir öksürük, bir kesinti kaydı. Barış o on beş dakika evdeydi. Bunu bir şirket ve bir terzi söylüyor.`,
      ),
      W(
        has('clue_kadir'),
        `~ Kadir Usta onu balkonda gördü. Saati bilmiyor. Saati söyleyecek bir kâğıda ihtiyacım var.`,
      ),
      O(`~ Mazeret: bir anne ve bir ateş. Mahkeme anneleri dinler, sonra kenara koyar.`),
    ],
  }),
  decisionNode('INV_GECE_5', [{ to: 'INV_GECE_6' }], {
    lines: [
      W(
        flag('kadir_kocluk'),
        `~ Kadir Usta’ya bir saat ezberlettim. Gözlüğünün arkasından bana bakışını unutamıyorum.`,
      ),
      W(flag('nermin_baski'), `~ Nermin Hanım’ın kapısı. Zincir. İki kilit. Yarın o kadın bana nasıl bakacak?`),
      W(
        flag('zarf_aldi'),
        `~ Masamda bir zarf var; ıslak lekesi kurudu ama izi kaldı. Bir kuzenin haftalığı. Makbuzunu bile almadı.`,
      ),
      W(
        flag('tolga_derya'),
        `~ Ücret konusunu Derya’yla konuşalım dedim; kuzen zarfını alıp gitti. Bu ailede para konuşmak, bir yarayı konuşmak gibi.`,
      ),
      W(
        cmp(v('aksam1'), '==', 'NERMIN'),
        `~ Nermin Hanım yalan söylemiyor. Bunu bir kez daha kendime söyledim. Yarın da söyleyeceğim.`,
      ),
      O(`~ Leyla’nın sorusu aklımda: kime inanıyorum? Kâğıtlara. Ve kâğıtların arasındaki boşluklara.`),
    ],
  }),
  decisionNode('INV_GECE_6', [{ to: 'INV_GECE_7' }], {
    lines: [
      W(flag('gamze_tanik'), `~ Bir hemşire, perdenin aralığından baktı ve yazdı. Mahkemede de bakacak.`),
      W(
        all(flag('kadir_tanik'), flag('kadir_goz')),
        `~ Bir terzi, gözleri bulanık bir terzi, ölçtüğünü söyleyecek. Savcı gözlerini soracak. Terzi “ses” diyecek. Bu yetmeli.`,
      ),
      W(
        flag('kadir_tanik'),
        `~ Bir terzi, mahkemeleri sevmeyen bir terzi, yarın değil ama yakında, ölçtüğünü söyleyecek.`,
      ),
      O(`~ Tanık listem kısa. Kısa listeler bazen dürüst listelerdir; bazen de eksik.
`),
    ],
  }),
];

const gece7 = decisionNode('INV_GECE_7', [{ to: 'INV_GECE' }], {
  lines: [
    W(
      flag('derya_not'),
      `
> Telefon çaldı. Derya. Salonu kapatmış, sesinde makas ve sigara.
derya: Barış notu almış mı canım? Annem soruyor. Bir de… yarın ben de geleceğim. Annemi tek bırakmam.
- Aldı. Cebine koydu.
derya: Cebine koymuştur. Küçükken de öyleydi; sevdiği her şeyi cebine koyardı. Taş, bilye, bir kere bir kurbağa.
> Güldü; kısa, yorgun. Sonra kapattı. “Bir şey daha” demedi bu sefer. Ama dememesi de bir şeydi.
`,
    ),
    O(`
> Telefon çaldı. Derya. Yarın annesiyle geleceğini söyledi; başka bir şey söylemedi. Kapatmadan önce bir an sustu, sonra “İyi geceler canım” dedi.
~ “Bir şey daha… yok.” O cümlenin devamı hâlâ bir yerlerde, Derya’nın ağzında duruyor.
`),
  ],
});

const geceSon = story('INV_GECE', {
  ...INV,
  title: 'Duruşmadan önceki gece',
  background: 'sokak_yagmur',
  lines: B(`
> Telefon titredi. Leyla’dan tek bir mesaj, gece yarısına beş kala.
leyla: Yarın o kadın kürsüde ağlarsa, sakın onu yenmeye çalışma. Onun ilk sözlerini göster; gerisini o kendisi görecek. [phone]
> Pencereyi açtım. Yağmur, Tophane’nin merdivenlerine, Yıldırım’ın balkonlarına, cezaevinin avlusuna, hepsine aynı anda yağıyordu. {flash}
~ Altmış dört basamak. Bir yüz. Bir fotoğraf. Yarın sabah dokuzda biri bana soracak: “Müdafi, diyeceğiniz?”
`),
  choices: [cont('GECE_DEVAM', 'Adliyeye git', 'H1_00G_1', { role: 'PRIMARY' })],
});

export const investigation: CasePart = {
  nodes: [
    p1.hub({
      ...INV,
      title: 'Soruşturma',
      background: 'buro',
      lines: hubLines,
      scenePreview: { scene: 'sc_merdiven' },
      tabs: [
        { id: 't_olay', label: 'OLAY YERİ', kind: 'SCENE', choices: hubChoices.olay },
        { id: 't_cezaevi', label: 'CEZAEVİ', kind: 'PEOPLE', choices: hubChoices.cezaevi },
        { id: 't_tanik', label: 'TANIKLAR', kind: 'PEOPLE', choices: hubChoices.tanik },
        { id: 't_arsiv', label: 'ARŞİV', kind: 'ARCHIVE', choices: hubChoices.arsiv },
      ],
      quickTalk: {
        character: 'baris',
        line: '“Ben o gece yataktan kalkamadım abla. Ateşim kırkı buldu.”',
        choices: ['H_GORUS', 'H_GORUS2'],
      },
      choices: [
        nav('H_DURUSMA', 'DURUŞMAYA GİT · 1. CELSE', 'INV_GECE_1', {
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen soruşturma biter. Emin misin?',
        }),
      ],
    }),
    dayEnd,
    aksam1,
    aksam2,
    gorusmeGiris,
    gorusme,
    arama,
    evGiris,
    arama2,
    arama3,
    tAli,
    tAliKarar,
    tKadir,
    tKadirKarar,
    tGamze,
    tGamzeKarar,
    tFerhat,
    tNermin,
    teshis,
    ihbar,
    uedasDoc('INV_UEDAS', INV),
    dil,
    cikarim,
    leyla,
    ...gece,
    gece7,
    geceSon,
  ],
  triggers: [
    {
      id: 'tg_day_end',
      scope: 'INV_HUB',
      priority: 1,
      when: all(cmp(v('ap'), '<=', 0), cmp(v('day'), '<', 3)),
      goto: 'INV_DAY_END',
    },
  ],
  discoveryPaths: [...dayEndDeliveries.discoveryPaths, ...nightDeliveries.discoveryPaths],
};
