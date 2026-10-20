import {
  any,
  back,
  cmp,
  conversation,
  cont,
  costOf,
  dec,
  decisionNode,
  discover,
  flag,
  has,
  ifThen,
  inc,
  interview,
  meet,
  mood,
  option,
  raise,
  score,
  set,
  topic,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { Cond } from '../../../tools/content/src/kit/index.js';
import { B, O, T, W } from './dsl.js';
import { INV } from './shared.js';

// 50-investigation (insanlar): Emir’le cezaevi görüşmesi, bulaşıkçı Süleyman, baba Kemal (gece vardiyası) ve mutfakta
// Şef Nuri ile Tarık Sezer.

// --- Emir ---

const toneEffects = {
  soft: [inc('trust', 4), set('tone', 'soft')],
  hard: [dec('trust', 8), set('tone', 'hard')],
};
const lowTrust: Cond = cmp(v('trust'), '<', 40);

export const gorusmeGiris = decisionNode('INV_GORUSME_G', [{ to: 'INV_GORUSME' }], {
  ...INV,
  title: 'Müvekkil görüşmesi',
  onFirstEnter: [meet('cemil'), ifThen(flag('kemal_durust'), [inc('trust', 4)])],
  lines: [
    W(
      cmp({ visits: 'INV_GORUSME' }, '==', 0),
      `
# BURSA H TİPİ CEZAEVİ — AVUKAT GÖRÜŞ ODASI [bg:gorus_odasi]
> Üç kapı, iki arama, bir imza. Koridor çamaşır suyu ve soğumuş mercimek çorbası kokuyordu. Her kapı arkamdan kilitlendikçe biraz daha ağırlaştım.
> İnfaz koruma memuru Cemil görüş odasının kapısını açtı. Elli yaşlarında, kırçıl bıyıklı, az konuşan biri.
cemil: Yarım saatte bir camdan bakarım; konuşmanızı duymam. Bu çocuk bıçak tutmayı bilir avukat hanım. Ama kime tutacağını bilmez. Bunu yazın bir yere.
> Masa vidalıydı, sandalyeler vidalıydı. Emir içeri girdi, oturdu. İnce, uzun, elleri mutfak yanıklarıyla dolu; sağ bileğinde yağ sıçramasından bir iz.
> Masadaki ziyaretçi formunu imzalaması gerekiyordu. Kalemi sol eline aldı.
emir: Abla… Babam mı gönderdi sizi? Babam bir avukat kapısına gitmez. Gitmezdi.
~ Bir çocuk, bir masa, bir imza. Cinayet dosyalarında katiller hep iri, sanıklar hep ufak görünür. Bu çocuk ufaktı.
`,
    ),
    O(`
# CEZAEVİ — AVUKAT GÖRÜŞ ODASI [bg:gorus_odasi]
> Aynı kapılar, aynı koku. Cemil beni görünce başıyla selam verdi ve kapıyı açtı.
emir: Abla. Annem bir şey gönderdi mi? Babam… babam bir şey dedi mi?
`),
  ],
});

export const gorusme = interview('INV_GORUSME', {
  ...INV,
  title: 'Müvekkil görüşmesi',
  hud: ['min', 'trust'],
  background: 'gorus_odasi',
  room: { label: 'CEZAEVİ · GÖRÜŞ ODASI', character: 'emir' },
  onEnter: [ifThen(cmp({ visits: 'INV_GORUSME' }, '>', 1), [set('min', 8)])],
  lines: [
    W(
      cmp({ visits: 'INV_GORUSME' }, '==', 1),
      `
> Görüş salonunun kapanışına 14 dakika. Cemil camın ardında; görür ama duymaz.
`,
    ),
    O(`
> Görüş salonunun kapanışına 8 dakika. Emir bu kez benden önce konuştu; söyleyeceklerini sırayla dizmişti.
`),
  ],
  tones: [
    { id: 'soft', label: 'Yumuşak', hint: '+4 güven' },
    { id: 'hard', label: 'Sert', hint: '−8 güven · daha kısa cevaplar' },
  ],
  toneEffects,
  moodRules: [
    mood('Çözülüyor', 'success', 'uzgun', flag('fact_mektup_emir')),
    mood('Savunmada', 'error', 'kizgin', lowTrust),
    mood('Gergin', 'neutral', 'kizgin', cmp(v('tone'), '==', 'hard')),
    mood('Yorgun', 'neutral', 'normal'),
  ],
  objectives: [
    {
      id: 'obj_gece',
      when: flag('fact_itiraf'),
      known: 'Ercan ona yirmi iki yıl önceki teraziyi anlattı; bağırıp çıktı.',
      unknown: 'Ofiste ne konuşuldu?',
    },
    {
      id: 'obj_davet',
      when: any(has('clue_davet'), flag('fact_davet_emir')),
      known: 'Kalmasını Ercan istedi.',
      unknown: 'Kapanıştan sonra neden kaldı?',
    },
    {
      id: 'obj_canta',
      when: flag('fact_canta_unuttu'),
      known: 'Bıçak çantasını tezgâhta unuttu.',
      unknown: 'Bıçak ofise nasıl gitti?',
    },
    {
      id: 'obj_mektup',
      when: flag('fact_mektup_emir'),
      known: 'Ercan bir mektup uzattı; Emir almadı.',
      unknown: 'Ercan ona bir şey verdi mi?',
    },
  ],
  topics: [
    topic('TP_GECE', 'O gece', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 20 },
      effects: [raise('fact_itiraf')],
      tones: {
        soft: {
          prompt: 'O geceyi baştan anlatır mısın? Acele yok.',
          responses: [
            W(
              lowTrust,
              `
emir/kizgin: Anlattım abla. Polise anlattım, savcıya anlattım, öbür avukata anlattım. Kimse dinlemedi.
~ Duvar. Duvarlara bağırılmaz; kapısı aranır.
`,
            ),
            O(`
emir: Nişan vardı, yüz yirmi kişi. Ayağımız yerden kesildi. On bir gibi bitti. Ercan abi “kapanıştan sonra ofise uğra” diye yazmıştı.
emir: Gittim. Oturttu. Rakı koydu, kendisi içmedi; üç yıldır içmiyordu. Sonra anlatmaya başladı. O evi. Babamı. Teraziyi.
emir: “Dolap benimdi” dedi. “Baban yattı, ben sustum.” Yirmi iki yıl, abla. Ben yirmi iki yaşındayım.
> Ellerine baktı. Sağ elinin sırtındaki yanık izini sol başparmağıyla ovaladı.
emir: Bağırdım. “Babamın hayatını çaldın” dedim. Masaya vurdum, bardak devrildi. Çıktım. Arka kapıdan. Durağa koştum, otobüse bindim.
emir: Ona dokunmadım. Dokunsam… dokunsam belki daha iyiydi. Bir tokat atsam. Hiçbir şey yapmadım. Çıktım.
~ “Hiçbir şey yapmadım.” Bunu iki anlamda söyledi; biri savunma, öbürü pişmanlık.
`),
          ],
          effects: [raise('fact_otobus_emir')],
        },
        hard: {
          prompt: 'Saat saat. Ofise kaçta girdin, kaçta çıktın?',
          says: T(`
emir/kizgin: Saat mi baktım abla? On bir buçuk gibi girdim. On dakika, on beş dakika. Bağırdım, çıktım!
emir: Bağırdım, evet! Bağırmak suç mu? Yirmi iki yıl babamı hapiste çürüttüğünü söyledi adam! Ne yapsaydım, teşekkür mü etseydim?
~ Öfke. Savcının elindeki en güçlü delil bu öfke. Benim elimdeki en güçlü delil de olabilir; dakikasını bulursam.
`),
        },
      },
    }),
    topic('TP_CANTA', 'Bıçak çantası', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 20 },
      effects: [raise('fact_canta_unuttu')],
      tones: {
        soft: {
          prompt: 'Bıçağın nasıl ofise gitti, biliyor musun?',
          says: T(`
emir: Bilmiyorum abla. Yemin ederim bilmiyorum. Çantam tezgâhtaydı. Fileto bıçağı tahtanın üstünde; servis bitince silecektim.
emir: Ercan abinin mesajını görünce silmeden gittim ofise. Sonra… sonra çıktım, unuttum. Çantamı da unuttum. Bıçaklarımı hiç unutmam.
emir: Babam almıştı o seti. Okulu bitirince. “E.Y.” yazdırmış sapına. Üç ay fazla mesai yaptı.
~ Bir bıçak, bir tezgâh, açık bir mutfak. O bıçağa dokunabilecek herkes, o mutfaktan geçebilecek herkestir.
`),
        },
        hard: {
          prompt: 'Bıçağın üstünde senin izlerin var.',
          says: T(`
emir/kizgin: Benim bıçağım! Benim izim olmayacak da kimin izi olacak? Her gün tutuyorum onu!
emir: Bir aşçının bıçağında aşçının izi olur abla. Bu mu delil?
~ Haklı. Ama savcı bunu böyle sormayacak. “Bıçağınız ofise nasıl gitti?” diye soracak.
`),
        },
      },
    }),
    topic('TP_MESAJ', 'Pazartesi mesajı', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 15 },
      tones: {
        soft: {
          prompt: 'Pazartesi akşamı arkadaşına ne yazdın?',
          responses: [
            W(
              has('clue_mesaj_tam'),
              `
emir: Devamını da okudunuz mu? İddianamede yok. “Neden yaptığını yüzüne soracağım” yazdım. Soracaktım abla. Neden diye.
emir: Babam bana bir şey anlatmadı ki. Sadece bağırdı. Ben de patronuma soracaktım: babama ne yaptın?
~ Bir soru niyetini bir öldürme kararına çeviren tek şey, son cümlesinin kesilmesiydi.
`,
            ),
            O(`
emir: “Hesabını soracağım” yazdım. Biliyorum. Okudular bana karakolda, on kere.
emir: Ama ben… ne demek istediğimi o gece bilmiyordum abla. Kızgındım. Babam bağırmıştı. Bir şey yazdım işte. Devamını hatırlamıyorum.
~ Devamı. Bir mesajın devamı, bir telefonun içinde, bir raporda. Okumam lazım.
`),
          ],
        },
        hard: {
          prompt: '“Hesabını soracağım.” Bunu nasıl açıklayacaksın?',
          says: T(`
emir/kizgin: Açıklamayacağım! Öyle yazdım! Herkes öyle yazar! Siz hiç kızınca bir şey yazmadınız mı?
~ Mahkemede bu cevabı verirse, tasarlamanın kararını kendi ağzıyla imzalar.
`),
        },
      },
    }),
    topic('TP_ERCAN', 'Ercan abi', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 10 },
      tones: {
        soft: {
          prompt: 'Ercan Toker nasıl bir patrondu?',
          says: T(`
emir/uzgun: İyi bir adamdı abla. Bunu söylemem garip mi? Nisanda beni işe aldı. Okuldan yeni çıkmıştım; kimse almıyordu, tecrübe istiyorlardı.
emir: İlk gün bana bir levrek verdi. “Filetosunu çıkar” dedi. Çıkardım. Yarısını berbat ettim. Güldü. “Babana benziyorsun” dedi.
> Durdu. Kaşlarını çattı.
emir: Babama benziyormuşum. Babamı tanıyormuş. Ben o gün anlamadım. Şimdi anlıyorum.
~ Bir adam, bir suçun oğlunu yanına alıp ona balık temizlemeyi öğretmiş. Bir özür mü, bir kefaret mi, bir korku mu?
`),
        },
        hard: {
          prompt: 'Ondan nefret ediyordun, değil mi?',
          says: T(`
emir/kizgin: Hayır! Pazartesiye kadar sevmiştim onu! Sonra… sonra bilmiyorum. Cuma gecesi… bilmiyorum abla.
~ “Bilmiyorum.” Savcı bu kelimeyi sever. Ben sevmem; ama dürüst bir kelime.
`),
        },
      },
    }),
    topic('TP_BABA', 'Babanla kavga', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 20 },
      effects: [discover('clue_kavga'), score('ARASTIRMA', 40)],
      tones: {
        soft: {
          prompt: 'Pazartesi evde ne oldu?',
          says: T(`
emir/uzgun: Akşam yemeğinde patronumdan bahsettim. Ercan abi dedim. Babamın elindeki çatal durdu.
emir: “Ercan Toker mi?” dedi. Sonra bağırmaya başladı. “O adamın yanında çalışmayacaksın. Benim hayatımı o yaktı.” Tabağını itti, kalktı, çıktı.
emir: Başka bir şey söylemedi. Hiç söylemez. Ben cezaevinde doğmuşum sayılır, onu bile annemden öğrendim.
~ Bir baba bir cümle söylemiş, gerisini yirmi iki yıldır yutuyor. Oğlu o cümlenin gerisini patronuna sormaya gitmiş.
`),
        },
        hard: {
          prompt: 'Baban seni kışkırttı mı?',
          says: T(`
emir/kizgin: Babam mı? Babam kimseyi kışkırtmaz! Babam sadece susar! Bir kere bağırdı, o kadar!
emir: “O adam benim hayatımı yaktı” dedi. Başka bir şey demedi. Bunu kışkırtmak mı sayıyorsunuz?
~ Bir babayı suçlamakla bir çocuğu kurtaramazsın. Kemal bunu duysa…
`),
        },
      },
    }),
    topic('TP_DAVET', 'Ercan’ın mesajı', {
      cost: costOf('min', 2),
      visibleWhen: has('clue_davet'),
      score: { SORGULAMA: 30 },
      effects: [raise('fact_davet_emir')],
      tones: {
        soft: {
          prompt: '22.47’de Ercan sana yazmış. Neden kaldın?',
          says: T(`
emir: “Kapanıştan sonra ofise uğra. Baban hakkında konuşmamız lazım.” Evet. O yazdı. Ben kalmak istemedim ki abla.
emir: Pazartesiden beri onun yüzüne bakamıyordum. Ama “baban hakkında” deyince… merak ettim. Babam bana hiçbir şey anlatmıyordu. O anlatacaktı.
~ İddianamenin “kendi isteğiyle kalıp bekledi” dediği şey, maktulün davetiymiş. Bir bekleyiş değil, bir çağrı.
`),
        },
        hard: {
          prompt: 'Savcı “bekledin” diyor. Bekledin mi?',
          says: T(`
emir/kizgin: Beklemedim! O çağırdı! Telefonumda var, alın bakın! Kimse bakmadı mı?
~ Baktım. Kimse bakmamış.
`),
        },
      },
    }),
    topic('TP_MEKTUP', 'Ercan sana bir şey verdi mi?', {
      cost: costOf('min', 2),
      visibleWhen: flag('fact_itiraf'),
      score: { SORGULAMA: 30 },
      effects: [raise('fact_mektup_emir')],
      tones: {
        soft: {
          prompt: 'Ofisten çıkarken Ercan sana bir şey uzattı mı?',
          says: T(`
emir/uzgun: Bir zarf. Kalın bir zarf. “Babana ver” dedi. “Hepsini yazdım.” Almadım abla. “Kendin ver” dedim.
> Sesi kırıldı. Bir süre konuşmadı. Cemil camın arkasından baktı, başka yöne döndü.
emir: Alsaydım… alsaydım belki babam şimdi okuyordu. Ben… ben o kâğıdı yere attım galiba. Masaya. Bilmiyorum. Bıraktım.
emir: Bir adam yirmi iki yıl sonra özür diliyor, ben de “kendin ver” diyorum. Sonra adam ölüyor. Kendin ver… Nasıl versin?
~ Bir zarf. Bir masa. Ve olay yerinde masada kâğıt yok. Bir zarf bir masadan kendi yürüyüp gitmez.
`),
        },
        hard: {
          prompt: 'Masadan bir şey aldın mı? Doğruyu söyle.',
          says: T(`
emir/kizgin: Hiçbir şey almadım! Bir zarf uzattı, almadım! Ne alacağım, para mı? Ben hırsız mıyım şimdi?
~ Bir zarf. Almamış. Kim almış?
`),
        },
      },
    }),
    topic('TP_SOLAK', 'Hangi elini kullanırsın?', {
      cost: costOf('min', 2),
      visibleWhen: flag('fact_solak'),
      score: { SORGULAMA: 20 },
      effects: [raise('fact_solak_emir')],
      tones: {
        soft: {
          prompt: 'Bıçağı hangi elinle tutarsın?',
          says: T(`
emir: Solumla. Her şeyi solumla yaparım; yazı, kepçe, bıçak. Setim de sol ele göre bilenmişti. Babam özel sipariş vermiş.
~ Bir ayrıntı. Belki hiçbir şey. Otopsi yarası kanalının yönünü yazmış; bir adli tıpçıya sorulacak türden bir hiçbir şey.
`),
        },
        hard: {
          prompt: 'Sağ elini de kullanabilir misin?',
          says: T(`
emir/kizgin: Sağımla mı? Sağ elimle yumurta kıramam abla. Okulda dalga geçerlerdi.
~ Belki hiçbir şey. Belki bir adli tıpçının bir cümlesi.
`),
        },
      },
    }),
  ],
  choices: [
    option('G_MERAL', 'Annesinin selamını ilet', {
      visibleWhen: visited('INV_EV_G'),
      effects: [inc('trust', 8)],
      responses: B(`
> Meral Hanım’ın gönderdiği küçük paketi masaya koydum: iki çift yün çorap ve bir kâğıt. Kâğıtta tek satır: “Babanın gözü yolda.”
emir/uzgun: Babamın gözü mü? Annem yazmış bunu. Babam yazmaz.
> Kâğıdı katladı, cebine koydu ve elini üstünden çekmedi.
emir: Sağ ol abla. Ne sorarsan sor.
`),
    }),
  ],
  finish: { id: 'G_BITIR' },
});

// --- Süleyman ---

export const suleyman = conversation('INV_SULEYMAN', {
  ...INV,
  title: 'Süleyman Çiftçi',
  eyebrow: 'TANIKLAR',
  background: 'cay_ocagi',
  room: { label: 'MUDANYA · İSKELE KAHVESİ', character: 'suleyman' },
  onFirstEnter: [meet('suleyman')],
  lines: B(`
# SALI 16.40 — MUDANYA, İSKELE KAHVESİ [bg:cay_ocagi]
> İskele kahvesinin camları buğuluydu. Dört masa, bir soba, duvarda bir takım takvimi. Süleyman Çiftçi en arkadaki masada tek başına bir çay içiyordu.
> Altmışını geçmiş, iri elli, kambur. Sol kulağına doğru hafifçe eğilmiş; konuşanı hep sağına alıyordu.
suleyman: Avukat. Çocuğun avukatı. Geleceğini Şef söyledi, vallahi. Otur. Çay mı?
suleyman: Ben savcının tanığıyım ama. Biliyor musun? Polis öyle yazdı. Ben bir şey demedim, onlar yazdı.
suleyman: On bir yıl o bulaşıkhanede durdum. Yüz bin tabak yıkadım. O çocuk… o çocuk her gece tabağını kendi getirirdi lavaboya. Kimse getirmez. O getirirdi.
> Çayını karıştırdı. Kaşık bardağa çarptıkça elinin titrediğini gördüm.
suleyman: Ama ben duyduğumu söyledim. Bağırdı. Duydum. Yalan mı söyleyeyim?
~ Korkmuş, dürüst bir adam. Korkmuş dürüst adamlar en zor tanıklardır; ne gördüklerini bilirler, ne kadar söyleyeceklerini bilmezler.
`),
  choices: [
    option('SQ_DUYDU', '“Ne duydunuz, tam olarak?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('fact_kagit')],
      responses: B(`
suleyman: “Babamın hayatını çaldın.” İki kere. Sonra bir şey devrildi. Bir bardak galiba.
suleyman: Ercan Bey de bir şey dedi. Sesi alçaktı. “Otur, al şunu” gibi bir şey. Kâğıt sesi vardı, vallahi. Hışırtı.
- Kâğıt sesi mi?
suleyman: Zarf gibi. Bilmiyorum. Bulaşıkhanede su akarken duyduğun ses de yarım olur.
~ “Al şunu.” Bir zarf. Emir de bir zarftan söz edecek mi, edecek mi bilmiyorum; ama bir bulaşıkçı onu duymuş.
`),
    }),
    option('SQ_SAAT', '“Saat kaçtı, hatırlıyor musunuz?”', {
      score: { SORGULAMA: 25 },
      effects: [raise('fact_dolmus')],
      responses: B(`
suleyman: Saate bakmadım. Ama dolmuşumu bilirim. Güzelyalı dolmuşu, 23.45. On bir yıldır o dolmuşa binerim.
suleyman: Çöpü çıkarırım, elimi yıkarım, dolmuşa koşarım. Bağırış çöpten önceydi. Çöp beş dakika sürer.
~ Saat değil, dolmuş. Leyla haklıydı. Yaşlı insanlar saat sormaz.
`),
    }),
    option('SQ_GORDU', '“Emir’i çıkarken gördünüz mü?”', {
      score: { SORGULAMA: 40 },
      discovers: 'clue_dolmus',
      responses: B(`
suleyman: Gördüm. Ben çöp kovalarının yanındaydım. Arka kapı açıldı, o çıktı. Önümden geçti, iki metre.
suleyman: Ağlıyordu galiba. Ya da yağmurdu. Önlüğü yoktu üstünde. Elleri cebindeydi. Bir şey yoktu elinde, vallahi; olsa görürdüm, ışığın altındaydı.
suleyman: “Abi ben gidiyorum” dedi. “Hayırdır oğlum” dedim. “Sorma” dedi. Koştu. İskeleye doğru.
- Polise bunu anlattınız mı?
suleyman: Sormadılar ki. Sadece bağırışı sordular. “Emir’in sesi mi?” dediler. “Evet” dedim. İmza attım.
~ Kimsenin sormadığı bir cümle. Elleri boş, önlüksüz bir çocuk; dolmuştan beş dakika önce.
`),
    }),
    option('SQ_KULAK', '“Sol kulağınız ağır işitiyor, değil mi?”', {
      visibleWhen: flag('fact_kagit'),
      score: { SORGULAMA: 15 },
      effects: [raise('fact_kulak')],
      responses: B(`
suleyman: Sol kulak. Fabrikada pres makinesinde geçti gençliğim. Ama bağırış sağdan geldi; ofis bulaşıkhanenin sağında. Sağ kulağım tıkır tıkır, vallahi.
~ Savcı bunu soracak. Önceden bilmek iyi; kürsüde şaşırmamak için.
`),
    }),
    cont('SULEYMAN_KARAR', 'Mahkemeyi konuş', 'INV_SULEYMAN_K', {
      role: 'PRIMARY',
      enabledWhen: has('clue_dolmus'),
      lockedReason: 'Önce o geceyi sor.',
    }),
    back('SULEYMAN_BITIR', 'Teşekkür et, çık'),
  ],
});

export const suleymanKarar = conversation('INV_SULEYMAN_K', {
  ...INV,
  title: 'Süleyman Çiftçi',
  eyebrow: 'TANIKLAR',
  background: 'cay_ocagi',
  room: { label: 'MUDANYA · İSKELE KAHVESİ', character: 'suleyman' },
  lines: B(`
suleyman: Mahkemeye çağıracaklar beni. Savcı çağırdı zaten. Ben ne diyeceğim avukat? Korkuyorum. Tarık Bey de “gördüğünü söyle Süleyman Abi” dedi; ne gördüm ki ben?
~ Tarık Sezer bu kahveye de uğramış. Bir tanık, öbür tanığa “gördüğünü söyle” diyor.
`),
  choices: [
    option('SK_ANLAT', '“Ne gördüyseniz, ne duyduysanız; ne eksik, ne fazla. Gerisi mahkemenin işi.”', {
      score: { SAVUNMA_STRATEJISI: 50 },
      effects: [raise('suleyman_hazir')],
      good: 'Tanığa ne söyleyeceğini söylemedin; yalnızca kendi algısını anlatmasını istedin (Av.K. 34).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Süleyman Bey, mahkemede ne gördüyseniz onu anlatın. Ne duyduysanız onu. Ne eksik, ne fazla. Saat sorulursa dolmuşunuzu söyleyin.
suleyman: Dolmuşu söylerim. Çöpü söylerim. Çocuğun ellerini söylerim. Vallahi bunları söylerim.
> Kapıda elimi sıktı. Islak, iri bir el; yüz bin tabağın eli.
suleyman: O çocuk tabağını kendi getirirdi avukat. Onu da söylerim; sorarlarsa.
`),
      next: '$return',
    }),
    option('SK_BICAK', '“Elinde bıçak olmadığını kesin söyleyin; tereddüt etmeyin.”', {
      effects: [inc('ethics'), raise('suleyman_kocluk'), score('SAVUNMA_STRATEJISI', -50)],
      bad: 'Tanığa nasıl ve ne kesinlikte konuşacağını söyledin: tanığı yönlendirmek meslek kurallarına aykırıdır (Av.K. 34), tanığın değerini düşürür ve yalan tanıklığa azmettirme riski taşır (TCK 272, 38).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Kürsüde “elinde bıçak yoktu” diyeceksiniz. Kesin. “Galiba” yok, “herhalde” yok.
suleyman: Kesin… Peki. Kesin derim.
> Bir an durdu. Çay kaşığını bıraktı.
suleyman: Ama ben ışığın altında gördüm dedim avukat. Kesin gördüm. Sen niye bana kesin de diyorsun?
~ Bir adamın gördüğünü ona kendi ağzımdan geri verdim; şimdi o cümle onun değil, benim.
`),
      next: '$return',
    }),
    option('SK_KORKU', '“Korkmayın; size bir şey olmayacak, söz.”', {
      neutral:
        'Tanığa güvence vermek insani; ama bir avukat bir tanığın güvenliğini vaat edemez, kürsüde onun yerine konuşamaz.',
      responses: B(`
- Korkmayın Süleyman Bey. Size bir şey olmayacak. Söz.
suleyman: Söz mü? Avukat söz verir mi? Peki. Senin sözüne gelirim.
~ Bir söz daha. Bu dosyada sözler birikiyor; ödemesi bana kalacak.
`),
      next: '$return',
    }),
  ],
});

// --- Kemal ---

const ktone = {
  soft: [inc('ktrust', 5), set('tone', 'soft')],
  hard: [dec('ktrust', 10), set('tone', 'hard')],
};
const kLow: Cond = cmp(v('ktrust'), '<', 30);

export const kemalGiris = decisionNode('INV_KEMAL_G', [{ to: 'INV_KEMAL' }], {
  ...INV,
  title: 'Kemal Yalçın',
  onFirstEnter: [ifThen(flag('kemal_durust'), [inc('ktrust', 15)])],
  lines: B(`
# GECE 01.10 — DEMİRTAŞ OSB, BİR LOJİSTİK DEPOSU [bg:depo_gece]
> Rampalarda tırlar, çatıda sarı ışıklar. Bir forklift geri geri gelirken öttü: bip, bip, bip. Kemal kabinden indi, eldivenlerini çıkardı.
kemal: Mola on beş dakika. Çay yok; makineden bir şey var, adına çay diyorlar.
> Plastik bardakları paletlerin üstüne koydu. Oturmadı. Rampanın kenarına yaslandı; arkasında bir koli dağı, önünde karanlık otopark.
kemal: Sor ne soracaksan. Yirmi iki yıldır kimse bana bir şey sormadı. Bir sen sor.
`),
});

export const kemal = interview('INV_KEMAL', {
  ...INV,
  title: 'Kemal Yalçın',
  hud: ['kmin'],
  background: 'depo_gece',
  room: { label: 'DEMİRTAŞ · DEPO RAMPASI', character: 'kemal' },
  onFirstEnter: [meet('meral')],
  lines: B(`
> Molanın bitmesine 10 dakika. Kemal bir gözü kabindeki saatte, konuşuyordu.
`),
  tones: [
    { id: 'soft', label: 'Yumuşak', hint: 'güven +' },
    { id: 'hard', label: 'Sert', hint: 'güven − · daha kısa' },
  ],
  toneEffects: ktone,
  moodRules: [
    mood('Kapalı', 'error', 'kizgin', kLow),
    mood('Gergin', 'neutral', 'kizgin', cmp(v('tone'), '==', 'hard')),
    mood('Yorgun', 'neutral', 'uzgun'),
  ],
  topics: [
    topic('K_2004', '2004', {
      cost: costOf('kmin', 2),
      score: { SORGULAMA: 15 },
      tones: {
        soft: {
          prompt: 'O evi anlatır mısınız?',
          responses: [
            W(
              kLow,
              `
kemal/kizgin: O ev mi? O evi o kadına anlattım. Yirmi iki yıl önce. O da bana “ikrar et” dedi. Başka bir avukata bir daha anlatmam.
`,
            ),
            O(`
kemal: Görükle. Bir apartmanın bodrum katı; nem, küf, üç yatak. İktisat okuyordum. Ercan’la aynı sınıftaydık; o hukuk değil, hiçbir şey okumuyordu aslında.
kemal: Ercan’ın arkadaşları gelir giderdi. Gemlikli biri vardı, hafta sonları kalırdı; adını bile öğrenmedim, “Gemlikli” derdik.
kemal: Bir gece polis kapıyı kırdı. Ortak odadaki dolaptan bir poşet, bir terazi. Ercan “benim değil” dedi. Ben “benim değil” dedim. Gemlikli o gece yoktu herhalde; hatırlamıyorum. Ben içeri girdim.
~ Bir dolap, bir terazi, iki “benim değil.” Biri dört yıl yattı, öbürü bir meyhane açtı.
`),
          ],
          effects: [raise('fact_gemlikli')],
        },
        hard: {
          prompt: 'Neden ikrar ettiniz?',
          says: T(`
kemal/kizgin: Neden mi? Yirmi bir yaşındaydım. Avukatım “ikrar et, indirim alırsın, iki yılda çıkarsın” dedi. Dört yıl yattım.
kemal: Oğlum bir görüş odasında yürümeyi öğrendi. Bunu sor bana. Neden ikrar ettiğimi değil.
~ Kapanan bir kapı. Arkasından bir forkliftin bip sesi.
`),
        },
      },
    }),
    topic('K_ARAMA', 'Ercan’ın aramaları', {
      cost: costOf('kmin', 2),
      score: { SORGULAMA: 15 },
      effects: [raise('fact_aramalar')],
      tones: {
        soft: {
          prompt: 'Ercan sizi hiç aradı mı?',
          says: T(`
kemal: Eylülden beri. Haftada bir, iki. Açmadım. Bir kere açtım; “Kemal, konuşmamız lazım” dedi. Kapattım. Numarasını sildim; yine aradı.
kemal: Ne konuşacaktık? Yirmi iki yıl sonra ne diyecekti? “Kusura bakma” mı?
> Bardağı ezdi. Plastik çatırdadı.
kemal: Oğlumu işe almış. Benim oğlumu. Hiç söylemedi bana. Ben de oğlumun patronunun kim olduğunu bir çatalın ucunda öğrendim.
`),
        },
        hard: {
          prompt: 'Ercan sizi tehdit etti mi?',
          says: T(`
kemal/kizgin: Tehdit mi? Ercan kimseyi tehdit edemezdi; korkaktı. Korkmasa yirmi iki yıl önce konuşurdu.
`),
        },
      },
    }),
    topic('K_KAVGA', 'Emir’le kavga', {
      cost: costOf('kmin', 2),
      score: { SORGULAMA: 15 },
      effects: [discover('clue_kavga')],
      tones: {
        soft: {
          prompt: 'Pazartesi akşamı Emir’e ne söylediniz?',
          says: T(`
kemal/uzgun: “O adamın yanında çalışmayacaksın. Benim hayatımı o yaktı.” Bu kadar. Başka bir şey söylemedim.
kemal: Yirmi iki yıldır söylemedim. Ne diyecektim? Baban hapse girdi çünkü bir dolabın içinde bir terazi vardı ve avukatı ona inanmadı mı?
kemal: O cümleyi söylemeseydim… Oğlum o mesajı yazmazdı. O gece o ofise gitmezdi.
~ Bir baba, oğlunun suçlamasını kendi cümlesine yazıyor. Yirmi iki yıl sonra yine bir ikrar.
`),
        },
        hard: {
          prompt: 'Onu siz mi kışkırttınız?',
          says: T(`
kemal/kizgin: Ben mi? Ben ona hiçbir şey anlatmadım! Bütün mesele bu zaten! Hiçbir şey anlatmadım!
`),
        },
      },
    }),
    topic('K_SET', 'Bıçak seti', {
      cost: costOf('kmin', 2),
      visibleWhen: flag('fact_set'),
      score: { SORGULAMA: 10 },
      tones: {
        soft: {
          prompt: 'Emir’in bıçak setini siz almışsınız.',
          says: T(`
kemal/uzgun: Üç ay fazla mesai. Japon çeliği, sol ele göre. “E.Y.” kazıttım. Okulu bitirdiği gün verdim. Ağladı. Ben de ağladım ama göstermedim.
kemal: Şimdi o harfler bir bıçağın sapında, bir dosyada. Savcı onları okuyacak. “Sanığın bıçağı.” Benim hediyem.
`),
        },
        hard: {
          prompt: 'O bıçak ofise nasıl gitti?',
          says: T(`
kemal/kizgin: Ben nereden bileyim? Ben deponun rampasındaydım! Saat on ikide bir tırı boşaltıyordum! Kamerası var deponun, bakın!
`),
        },
      },
    }),
  ],
  choices: [
    option('K_SON', 'Son arama: 23.58', {
      visibleWhen: has('clue_son_arama'),
      score: { SORGULAMA: 40 },
      responses: B(`
- Kemal Bey, Ercan Toker o gece 23.58’de sizi aramış. Elli iki saniye. Açtınız mı?
> Kemal’in yüzünde bir şey kıpırdadı. Telefonunu cebinden çıkardı; eski, kenarları çatlamış bir telefon. Ekranı uzun uzun kaydırdı.
kemal: Açmadım. Açmam. Elli iki saniye mi? Ben… çalmasını bile duymadım; tırın sesinden.
> Ekranın köşesinde, aylardır orada duran küçük bir simge: bir kaset bandı. Dinlenmemiş bir sesli mesaj.
kemal: Bu ne?
- Sesli mesaj. Hiç dinlemediniz mi?
kemal: Ben sesli mesaj dinlemem. Kimse bana dinlenecek bir şey bırakmaz.
~ Bir ölü, bir baba, elli iki saniye. İki aydır bir telefonun köşesinde, bir simgenin içinde.
`),
      next: 'INV_KEMAL_K',
    }),
  ],
  finish: { id: 'K_BITIR', label: 'Molayı bitir' },
});

/** Sesli mesaj kararı; soruşturmada ($return) ve ara evrede (ARA_HUB'a dönüş) ayrı kimliklerle kullanılır. */
export const kemalKararNode = (
  id: string,
  p: string,
  ret: string,
  chap: typeof INV,
  where: { bg: 'depo_gece' | 'ev'; label: string } = { bg: 'depo_gece', label: 'DEMİRTAŞ · DEPO RAMPASI' },
) =>
  conversation(id, {
    ...chap,
    title: 'Kemal Yalçın',
    background: where.bg,
    room: { label: where.label, character: 'kemal' },
    lines: B(`
> Kemal telefonu avucunda tutuyordu. Parmağı simgenin üstünde, basmadan.
kemal: Dinleyeyim mi? Sen söyle avukat hanım. Yirmi iki yıl önce bir avukat bana ne yapacağımı söyledi. Şimdi sen söyle.
`),
    choices: [
      option(`${p}_KORU`, '“Silmeyin. Bu kayıt bilirkişiye gidecek.”', {
        discovers: 'clue_sesli',
        score: { USUL_BILGISI: 100 },
        effects: [raise('sesli_korundu'), inc('legal_hits')],
        good: 'Kaydın aslını korudun ve mahkeme kanalıyla bilirkişi incelemesi (CMK 63, 177) yolunu seçtin; rızaya dayalı inceleme ve operatör kaydıyla delilin bütünlüğü kanıtlanır.',
        category: 'USUL_BILGISI',
        responses: B(`
> Kemal hoparlörü açtı. Önce bir hışırtı. Sonra bir adamın sesi; yorgun, alçak, ağlamamaya çalışan bir ses.
@SESLİ MESAJ · ERCAN TOKER: Kemal… benim. Ercan. Kapatma. Oğlun buradaydı az önce. Söyledim ona. Hepsini. Haklı, bağırdı. Hakkı var. [phone]
@SESLİ MESAJ · ERCAN TOKER: Mektup masamda. Yarın sabah sana getiriyorum; bu sefer kaçmayacağım. Yirmi iki yıl… [phone]
> Bir tıkırtı. Bir kapı mı, bir masa mı.
@SESLİ MESAJ · ERCAN TOKER: Bir dakika… Kapıda biri var. Gel, otur. Kapat şu kapıyı… [phone]
> Hat kesildi. Tarih ve saat ekranda: 14 Kasım, 23.58.
> Kemal telefonu bıraktı. Rampanın kenarına oturdu; ilk kez. Elleri dizlerinin üstünde, avuçları yukarı.
kemal: Oğlun buradaydı… az önce. Az önce. Avukat hanım… az önce.
- Telefonunuza dokunmayın Kemal Bey. Silmeyin, başka yere göndermeyin. Mahkemeden bilirkişi incelemesi isteyeceğim.
kemal: Dokunmam. Yirmi iki yıldır hiçbir şeye dokunmadım zaten.
~ “Az önce.” Emir’in çıktığı saat ile bu ses arasında bir aralık var. O aralıkta bir kapı çalınıyor.
`),
        next: ret,
      }),
      option(`${p}_KOPYA`, '“Dinleyelim; ben de telefonuma kaydedeyim, dosyaya o kayıt yeter.”', {
        discovers: 'clue_sesli',
        score: { USUL_BILGISI: -30 },
        effects: [raise('sesli_korundu'), raise('sesli_kopya')],
        bad: 'Kaydı kendi telefonuna kopyalamak delilin bütünlüğünü tartışmaya açar; aslı korunmalı ve bilirkişiye gitmeli (CMK 63, 134 kıyasen; delil zinciri). Kopya, mahkemede tek başına yetmez.',
        category: 'USUL_BILGISI',
        responses: B(`
> Kemal hoparlörü açtı. Ben telefonumu hoparlöre yaklaştırdım, kayda bastım.
@SESLİ MESAJ · ERCAN TOKER: Kemal… benim. Ercan. Kapatma. Oğlun buradaydı az önce. Söyledim ona. Hepsini. [phone]
@SESLİ MESAJ · ERCAN TOKER: Mektup masamda. Yarın sabah sana getiriyorum… Bir dakika… Kapıda biri var. Gel, otur… [phone]
> Hat kesildi. Kemal hiçbir şey söylemedi. Benim telefonumda bir kaydın kaydı; uğultulu, forklift sesli, bir hoparlörün hoparlörü.
~ Bir bilirkişi bu kopyaya bakıp “bu ne” diyecek. Aslı hâlâ Kemal’in avucunda. Onu istemem gerekecek.
`),
        next: ret,
      }),
      option(`${p}_SONRA`, '“Şimdi değil. Önce dosyayı bitireyim, sonra birlikte dinleriz.”', {
        neutral: 'Bir delili ertelemek bazen gerekir; ama dinlenmemiş bir kayıt, kimsenin bilmediği bir delildir.',
        responses: B(`
- Şimdi değil Kemal Bey. Önce dosyayı bitireyim, sonra birlikte bakarız.
kemal: Nasıl istersen. Yirmi iki yıl bekledi; birkaç gün daha bekler.
> Telefonu cebine koydu. Molanın bittiğini gösteren zil çaldı. Forkliftin kabinine çıktı; bip, bip, bip.
`),
        next: ret,
      }),
    ],
  });

export const kemalKarar = kemalKararNode('INV_KEMAL_K', 'KS', '$return', INV);

// --- Mutfak: Şef Nuri ve Tarık ---

export const nuri = conversation('INV_NURI', {
  ...INV,
  title: 'Şef Nuri',
  background: 'kafe',
  room: { label: 'TOKER BALIK · MUTFAK', character: 'nuri' },
  onFirstEnter: [meet('nuri')],
  lines: B(`
nuri: Eee? Baktın mı istediğin yere? Benim mutfağım burası avukat hanım; polis üç ay önce girdi, çamurlu botlarla. Hâlâ temizliyorum.
nuri: Sor ne soracaksan. Servise kırk dakika var. Kırk dakika sonra ben kimseyle konuşmam; balıkla bile.
`),
  choices: [
    option('NQ_CANTA', '“Aşçılar bıçaklarını burada mı bırakır?”', {
      score: { SORGULAMA: 25 },
      discovers: 'clue_canta',
      responses: B(`
nuri: Burada mı? Benim mutfağımda mı? Kimse bırakmaz. Bir aşçının bıçağı onun eli gibidir; elini gece işyerinde bırakan mı var?
nuri: Herkes çantasıyla gelir, çantasıyla gider. Emir de öyle. Her gün. O gece unuttu, tezgâhta kaldı; ben kapatırken gördüm, “yarın alır” dedim.
~ Her gün gelen bir bıçak çantası. “Bıçağını getirdi” dediğin şey, bir aşçının her sabahı.
`),
    }),
    option('NQ_EMIR', '“O hafta Emir nasıldı?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('fact_sessiz')],
      responses: B(`
nuri: Sessiz. Zaten konuşkan değildir; pazartesiden sonra hiç konuşmadı. Bir “evet şef”, bir “pas”. O kadar.
nuri: Kimseye bir şey demedi. Kin miydi, dert miydi, bilmem. Benim mutfağımda kimse kinini anlatmaz; balığın gözüne bakar, susar.
`),
    }),
    option('NQ_KASA', '“O gece kasayı kim kapattı?”', {
      visibleWhen: flag('fact_z'),
      score: { SORGULAMA: 20 },
      effects: [raise('fact_cansu_erken')],
      responses: B(`
nuri: Tarık Bey. Her gece o kapatır. O gece de. Cansu’yu erkenden yolladı; “sen çık kızım, ben kapatırım” dedi. Ben de on bir buçuk olmadan çıktım; belim tutuldu.
~ Cansu. Bir garson. Erkenden gönderilmiş; o gece mutfağı en son kimlerin gördüğünü bilen biri.
`),
    }),
    option('NQ_KAMERA', '“Kameralar çalışıyor muydu?”', {
      score: { SORGULAMA: 10 },
      responses: B(`
nuri: Arızalıymış. Tarık Bey öyle dedi. Bana sorarsan ışığı yanıyordu; ama ben kameradan ne anlarım, ben levrekten anlarım.
`),
    }),
    cont('NURI_TARIK', 'Salondan biri geliyor', 'INV_TARIK1', { role: 'PRIMARY' }),
  ],
});

export const tarik1 = conversation('INV_TARIK1', {
  ...INV,
  title: 'Tarık Sezer',
  background: 'kafe',
  room: { label: 'TOKER BALIK · SALON', character: 'tarik' },
  lines: B(`
> Salonun kapısında bir adam belirdi: kırklarının ortasında, geriye taranmış saçlar, şakaklarında gri, ütülü bir gömlek. Elinde iki bardak çay.
tarik: Avukat hanım! Şef haber verdi, geldiğinizi. Tarık Sezer. Ercan’ın ortağıyım… ortağıydım. Buyurun, çay.
> Bardağı elime tutuşturdu. Sıcaktı. Bakışı beni baştan ayağa ölçtü, sonra mutfağa kaydı, sonra yeniden bana döndü.
tarik: Ne lazımsa. Mutfak, kasa, defterler; ne isterseniz. Ben mahkemede gördüğümü anlatacağım, başka bir şey değil. O çocuğa da üzülüyorum, inanın.
tarik: Ercan onu çok severdi. “Kemal’in oğlu” derdi, gözleri dolardı. Ben o Kemal’i hiç tanımadım ama.
~ Sıcak, ölçülü, cömert. Bir tanık böyle konuşur; bir ev sahibi de. İkisi aynı adamda.
`),
  choices: [
    option('TQ_KAMERA', '“Kamera kaydı neden yok?”', {
      score: { SORGULAMA: 20 },
      discovers: 'clue_tarik_ariza',
      responses: B(`
tarik: Üç gündür arızalıydı. Servis çağırmıştık, gelmediler. Mudanya’da servis de balık gibidir avukat hanım; mevsiminde gelir.
tarik: Polis de baktı zaten. Kayıt yok. Keşke olsaydı. Her şey ortaya çıkardı.
~ “Keşke olsaydı.” Kayıt cihazı kapalı bulunmuş, açılmamış. Kimse içine bakmamış.
`),
    }),
    option('TQ_SERT', '“Neden 23.55? Bulaşıkçı başka bir saat söylüyor.”', {
      effects: [raise('tarik_uyarildi')],
      score: { SORGULAMA: -30 },
      bad: 'Kürsüde soracağın çelişkiyi baş tanığa sokakta söyledin; artık hazırlıklı gelecek. Çapraz sorgu sürprizini harcadın.',
      category: 'SORGULAMA',
      responses: B(`
- Neden 23.55 Tarık Bey? Başka biri başka bir saat söylüyor.
> Tarık bir an durdu. Çay bardağını tezgâha koydu; ses çıkarmadan.
tarik: Başka biri mi? Süleyman Abi mi? Süleyman Abi’nin bir kulağı duymaz avukat hanım. Saat de bilmez; dolmuşla yaşar.
tarik: Ben ne gördüysem söyledim. Mahkemede de söyleyeceğim. İyi günler.
~ Kürsüde soracağım soruyu bir mutfakta sordum. Cevabını da şimdi biliyorum; o da benim sorumu biliyor.
`),
      next: '$return',
    }),
    back('TARIK_BITIR', 'Çay için teşekkür et, çık'),
  ],
});
