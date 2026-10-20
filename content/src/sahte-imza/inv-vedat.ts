import {
  cmp,
  costOf,
  dec,
  decisionNode,
  flag,
  has,
  ifThen,
  inc,
  interview,
  mood,
  raise,
  set,
  topic,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { Cond, NodeDef } from '../../../tools/content/src/kit/index.js';
import { O, S, W } from './lib.js';
import { INV } from './shared.js';

// Müvekkil görüşmesi (konu × ton). Bulguya bağlı konular başka yerlerde bulunan ipuçlarıyla açılır: sıvanmış imza →
// hangi el; takvim → kurye; yazıcı günlüğü → gece; kimlik → Sevgi'ye mesaj.

const lowTrust: Cond = cmp(v('trust'), '<', 40);

const giris = decisionNode('INV_VEDAT_G', [{ to: 'INV_VEDAT' }], {
  ...INV,
  title: 'Müvekkil görüşmesi',
  lines: [
    W(
      cmp({ visits: 'INV_VEDAT' }, '==', 0),
      `
C#depo: ATEŞ MATBAASI — ARKA ODA
N: Arka oda bir depo, bir mutfak ve bir ofisin karışımıydı. Tavana kadar kâğıt topları, bir semaver, bir masa, masanın üstünde bir hesap makinesi.
N: Vedat önlüğünü çıkarmadan oturdu. Ellerini masanın altına sakladı; sonra fark edip masanın üstüne koydu. Tırnaklarının dibi maviydi.
vedat: Yarım saatim var avukat hanım. Sonra bir düğün davetiyesi baskısı. Kusura bakmayın; iş durmuyor, dava da durmuyor.
T: Yarım saat. Bir adamın beş ayını yarım saate sığdırmam gerekiyor. Ne soracağımı seçmeliyim; her şeyi soramam.
`,
    ),
    O(`
C#depo: ATEŞ MATBAASI — ARKA ODA
N: İkinci kez geldiğimde Vedat semaveri yakmıştı. Bana çay koydu; kendine koymadı.
vedat: Yine mi? Bir şey mi buldunuz? Yüzünüzden anlaşılmıyor. Avukatların yüzü matbaa kalıbı gibi; ters basılır.
`),
  ],
  onEnter: [ifThen(cmp({ visits: 'INV_VEDAT' }, '>=', 1), [set('min', 8)])],
});

const gorusme = interview('INV_VEDAT', {
  ...INV,
  title: 'Müvekkil görüşmesi',
  hud: ['min', 'trust'],
  background: 'depo',
  room: { label: 'MATBAA · ARKA ODA', character: 'vedat' },
  tones: [
    { id: 'soft', label: 'Yumuşak', hint: '+4 güven' },
    { id: 'hard', label: 'Sert', hint: '−8 güven · daha fazla bilgi' },
  ],
  toneEffects: {
    soft: [inc('trust', 4), set('tone', 'soft')],
    hard: [dec('trust', 8), set('tone', 'hard')],
  },
  moodRules: [
    mood('Kırılgan', 'error', 'uzgun', lowTrust),
    mood('Umutlu', 'success', 'mutlu', has('clue_sag_el')),
    mood('Gergin', 'neutral', 'kizgin', cmp(v('tone'), '==', 'hard')),
    mood('Yorgun', 'neutral', 'normal'),
  ],
  objectives: [
    { id: 'obj_sabah', when: has('clue_ceket'), known: 'Kimlik o sabah ceketinde yoktu.', unknown: 'O sabah ne oldu?' },
    { id: 'obj_el', when: has('clue_sag_el'), known: 'Vedat sağ eliyle yazıyor.', unknown: 'İmzayı atan el hangisi?' },
    {
      id: 'obj_sebep',
      when: flag('fact_kavga'),
      known: '2024’te evin satılmasını istemiş.',
      unknown: 'Savcının sebep teorisi ne?',
    },
  ],
  topics: [
    topic('TV_SABAH', '18 Şubat sabahı', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 20 },
      tones: {
        soft: {
          prompt: 'O sabahı baştan anlatır mısınız? Ne hatırlıyorsanız.',
          responses: [
            W(
              lowTrust,
              `
vedat.kizgin: Anlattım. Polise, savcıya, karıma, aynaya. Dükkândaydım. Başka ne diyeyim? Yazın, imzalayayım. Aa, imzam geçmiyormuş.
T: Acı bir şaka. Şakanın altında bir yara. Yaraya bastırmadım.
`,
            ),
            O(`
vedat: Sabah yedi buçukta açtım. Her sabah olduğu gibi. Önlüğü giydim, ceketi astım. Dokuzda PTT’ye gidecektim, bir taahhütlü mektup.
vedat: Kimliği aradım. Ceketin iç cebinde olur hep. Yoktu. Bütün dükkânı aradım; çekmeceler, kasalar, kâğıt topları. Yok.
vedat: Sevgi’ye yazdım, “kimliğim evde mi” diye. Evde değilmiş. PTT’ye gidemedim. Dükkânda kaldım. Bir iş vardı, bir broşür; kargoya çıkacaktı galiba.
vedat: Öğlene kadar makinenin başındaydım. Sonra eve gittim. Ertesi sabah ceketi giyerken baktım: kimlik iç cepte. Aynı cepte.
T: Aynı cep. Bir gün yok, ertesi gün var. Kimlikler yürümez.
`),
          ],
        },
        hard: {
          prompt: 'Saat saat. 11.24’te neredeydiniz?',
          responses: [
            O(`
vedat.kizgin: On bir yirmi dört mü? Saatime mi bakıyordum avukat hanım? Makinenin başındaydım! On bir yirmi dörtte de, on ikide de!
vedat: Biri geldi galiba o arada, kapı çaldı. Kim geldi, bilmiyorum. Bir matbaada kapı günde elli kere çalar.
T: Sert soru, kırık cevap. Ama içinde bir şey var: kapı çaldı. Kim çaldı?
`),
          ],
        },
      },
    }),
    topic('TV_KIMLIK', 'Kimlik', {
      cost: costOf('min', 2),
      discovers: 'clue_ceket',
      score: { SORGULAMA: 30 },
      tones: {
        soft: {
          prompt: 'Kimliğinizi nerede taşırsınız? Cüzdanda mı?',
          says: S(`
vedat: Cüzdan arka cepte durur, makinede ezilir. Kimliği ceketin iç cebine koyarım. Yirmi yıldır öyle. Babam da öyle yapardı.
vedat: Ceket sabahtan akşama kapının arkasında asılı. Önlükle çalışırım; ceket kirlenmesin diye.
P: Kapının arkası. Dükkâna giren herkes önünden geçiyor mu?
vedat: Geçer tabii. Kurye geçer, müşteri geçer, çırak geçer. Kimse kimsenin ceketine dokunmaz ama. Bu dükkânda hırsız yok.
T: “Bu dükkânda hırsız yok.” Bunu söylerken sesi titremedi. İnanıyordu.
vedat: Babam derdi ki, bir esnafın kasası açık durur, kimse dokunmaz; çünkü herkes herkesi tanır. Kayhan’da kırk yıl kimse kimsenin kasasına dokunmadı.
T: Tanımak bir kilit değildir. Tanıdığın insan, kilidin nerede olduğunu da bilir.
`),
        },
        hard: {
          prompt: 'Kimliğinizi birine verdiniz mi? Ödünç, bir işlem için?',
          says: S(`
vedat.kizgin: Kimliğimi kimseye vermem! Ne zannediyorsunuz? Benim kimliğimle tapuya gidecek kadar ahmak birine mi vereceğim?
vedat: İç cepte durur. Ceket kapının arkasında. On yedisinde akşam oradaydı herhalde; bakmadım ki. On sekizinde sabah yoktu. On dokuzunda sabah vardı.
T: Öfkesi bir cevap verdi. Kimlik bir gece kayboldu ve bir gece geri döndü. Arada bir tapu işlemi oldu.
`),
        },
      },
    }),
    topic('TV_ANNE', 'Annem ve ev', {
      cost: costOf('min', 3),
      score: { SORGULAMA: 20 },
      tones: {
        soft: {
          prompt: 'Anneniz nasıl biri? Ev onun için ne demek?',
          says: S(`
vedat.uzgun: Terziydi. Kırk yıl. O evin cumbasında oturur, Hisar’ın yokuşuna bakarak dikerdi. Gelinlikler, takım elbiseler. Babamın cenaze takımını o dikti.
vedat: Şimdi beni bazen babam sanıyor. Bazen Halit ağabeyim. Halit on iki yıl önce öldü; kalp. Annem her pazar ona da çorba koyuyor masaya.
vedat: Ev onun her şeyi. Satıldığını bilmiyor. Bilmesin. Bilirse bir daha ayağa kalkmaz.
T: Bir evi satan oğul, annesinin evi satıldığını bilmemesini isteyen oğuldur. İkisi aynı adam olabilir mi? Olabilir. Ama yorgun bir ihtimal.
`),
        },
        hard: {
          prompt: 'Savcı bir sebep arayacak. Evle ilgili bir tartışma oldu mu?',
          effects: [raise('fact_kavga')],
          says: S(`
vedat: …Oldu. 2024 bayramında. Dükkânın borcu vardı; kâğıt fiyatları iki katına çıkmıştı. Anneme dedim ki evi satalım, sen bizde kal.
vedat.uzgun: Annem ağladı. Nermin ablam bağırdı, “annemi sokağa atacaksın” dedi. Ben de kalkıp çıktım. Sonra bir daha açmadım konuyu. Bir daha hiç.
vedat: Bunu söylemedim polise. Sormadılar. Siz de sormasaydınız söylemezdim.
T: Savcının sebebi. Bunu kürsüde ilk kez duymaktansa burada duymak iyi. Acı ama iyi.
vedat: Siz de mi düşünüyorsunuz avukat hanım? Bir laf ettim, sonra gidip sahte kâğıt mı bastım?
P: Ben düşünmüyorum. Savcı düşünecek. Onun düşündüğünü sizin ağzınızdan, hazırlıklı duysun istiyorum.
vedat.uzgun: Hazırlıklı. Bir utancı hazırlıklı anlatmak. Bunu da öğreneceğim demek.
`),
        },
      },
    }),
    topic('TV_IRSALIYE', 'Dükkânın kâğıtları', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 20 },
      tones: {
        soft: {
          prompt: 'İrsaliyeleri, kargo fişlerini kim imzalar?',
          says: S(`
vedat: Ben imzalarım. Benim dükkânım, benim imzam. Çoğunu ben.
P: Çoğunu?
vedat: Çoğunu. Bir matbaa küçük bir aile gibidir avukat hanım. Bazen ben makinedeyim, şoför bekliyor; kim yakındaysa “V. Ateş” yazar geçer. Kimse kimseye kızmaz.
T: “Kim yakındaysa.” Bunu söylerken bana değil, kâğıt topuna baktı.
`),
        },
        hard: {
          prompt: 'Polisin bilirkişiye verdiği irsaliyeleri gerçekten siz mi imzaladınız?',
          effects: [raise('fact_baskasi_imza')],
          says: S(`
vedat.kizgin: Ne bileyim ben hangilerini verdiler! O gün annem hastanedeydi, düşmüştü. Ben başındaydım. Polis dükkâna gelmiş, “imzalı belge” istemiş.
vedat: Biri klasörden çıkarıp vermiş. Hangisini, bilmiyorum. Rapor geldi, “aynı el” diyor. Aynı el! Benim elim mi, kimin eli, kim bilir!
vedat.uzgun: Herkes imzalar o kâğıtları. Ben, Emre bile bazen. Bir dükkânda imza sahibinin değil, kalemin işidir.
T: Bilirkişi “Vedat Ateş’in imzası” diye bir yığın kâğıda bakmış. O kâğıtları kim seçti? Kim verdi?
`),
        },
      },
    }),
    topic('TV_BORC', 'Dükkânın borcu', {
      cost: costOf('min', 1),
      score: { SORGULAMA: 10 },
      tones: {
        soft: {
          prompt: 'Dükkânın borcu ne durumda? Savcı soracak.',
          says: S(`
vedat: Kâğıt fiyatları iki yılda üç katı oldu. Bir ara bankaya borçlandım, ödedim. Şimdi ayakta duruyoruz; zor ama duruyoruz.
vedat: Tarık iyi pazarlık yapar; kâğıtçıyla o konuşur, ben konuşamam. Utanırım. Borç benim için bir lekedir; mürekkep gibi, çıkmaz.
T: Borç bir sebep olabilir. Ama borcunu ödemiş bir adamın sebebi, ödememiş birininkinden zayıftır.
`),
        },
        hard: {
          prompt: 'Bugün kime ne kadar borcunuz var? Rakamla.',
          says: S(`
vedat.kizgin: Kimseye! Bankaya bir taksit, o kadar. Tefeciye gitmedim, kumara gitmedim. Babamdan kalan dükkânı borçla mı batırayım?
T: Bir öfke, bir rakam yokluğu. Belki dürüst, belki gururlu. İkisi aynı sesle konuşur.
`),
        },
      },
    }),
    topic('TV_EL', 'Hangi elle yazıyorsunuz?', {
      visibleWhen: has('clue_sivanma'),
      cost: costOf('min', 2),
      discovers: 'clue_sag_el',
      score: { SORGULAMA: 50 },
      tones: {
        soft: {
          prompt: 'Bir kâğıda adınızı yazar mısınız? Önce bir elinizle, sonra öbürüyle.',
          says: S(`
N: Vedat kalemi sağ eline aldı. İmzası hızlı ve yuvarlaktı; “V” tek hamlede, sona doğru sağa yatan bir kuyruk.
N: Sonra kalemi sol eline geçirdi. Kâğıtta titrek, kırık bir çizgi kaldı. Bir çocuğun ilk harfleri gibi.
vedat.saskin: Bununla mı? Sol elle mi? Ben sol elimle çatal bile tutamam avukat hanım. Askerde bile denemedik.
T: Sıvanmış mürekkep, sağ el. Bu ikisi aynı masaya oturmuyor.
vedat: Neden soruyorsunuz? Ne var sol elde?
P: Henüz bir şey yok. Bir mürekkep izi var. İzi bir ele bağlamadan konuşmayalım.
vedat: Mürekkep izi… Biz matbaacılar mürekkepten iz okuruz avukat hanım. Bir kâğıdın hangi makineden çıktığını, hangi ustanın elinden geçtiğini. Kendi imzama hiç öyle bakmadım.
`),
        },
        hard: {
          prompt: 'Sol elinizle imza atabilir misiniz? Dürüst olun.',
          says: S(`
vedat.kizgin: Deneyeyim de görün! Bakın! Buna imza mı denir?
N: Kâğıtta sol elle atılmış bir çizgi; okunmuyor bile. Sağ elle attığı imza ise hızlı, alışkın, sağa yatık.
T: Öfkeyle atılmış bir imza bile sağ elin imzası. Bir insan sinirlenince hangi eli kullanıyorsa, o eli kullanır.
`),
        },
      },
    }),
    topic('TV_TAKVIM', 'Takvimdeki kargo notu', {
      visibleWhen: has('clue_takvim'),
      cost: costOf('min', 2),
      score: { SORGULAMA: 40 },
      effects: [raise('fact_kurye')],
      tones: {
        soft: {
          prompt: 'Takvimde 18 Şubat’a “Termal broşür, kargo 11.30” yazmışsınız.',
          says: S(`
vedat.saskin: Termal broşür… Çekirge’deki otelin broşürü! Evet! Beş koli. Kurye gelecekti, on bir buçuk dedi; erken geldi.
vedat: Kolileri birlikte bantladık. Genç bir çocuk, konuşkan. Ona çay koydum; içmedi, aceleci. Hayır içti. Ben unutuyorum, o konuşuyordu.
vedat.mutlu: El terminaline imza attım! Parmağımla! O makineler saati yazar, değil mi avukat hanım? Yazar!
T: Kargo terminali saati yazar. Konumu da. Ama terminal bir şirketin elinde; şirket de bir avukata değil, bir mahkemeye cevap verir.
vedat: Bunu polise söylemedim. Neden söylemedim? Kimse “o saatte ne yapıyordunuz” diye sormadı. “İmza sizin mi” dediler; “değil” dedim. Gerisini yazmadılar.
`),
        },
        hard: {
          prompt: 'Takvimdeki kargo notunu neden polise söylemediniz?',
          says: S(`
vedat.kizgin: Hatırlamadım ki! Beş ay sonra kim hatırlar? Bir broşür işi! Günde üç kargo çıkıyor bu dükkândan!
vedat: …Ama o gün kurye geldi, evet. Erken. Beraber bantladık. Terminale imza attım. Şimdi hatırlıyorum.
T: Hafıza bir takvim notuyla açıldı. Şimdi o notu bir kayda bağlamam gerek.
`),
        },
      },
    }),
    topic('TV_GECE', 'Gece basılan iş', {
      visibleWhen: has('clue_yazici'),
      cost: costOf('min', 2),
      score: { SORGULAMA: 30 },
      tones: {
        soft: {
          prompt: 'Yazıcının günlüğünde 6 Şubat gecesi, saat iki buçuğa doğru bir iş var.',
          says: S(`
vedat.saskin: Gece mi? Gece burada kimse olmaz. Ben dokuzda kapatırım. Anahtar bende, bir de Tarık’ta. Bir de…
vedat: Kapının üstündeki pervazda yedek anahtar durur. Babamdan kalma alışkanlık. Mahallede herkes bilir, çırak da bilir.
T: Pervazdaki anahtar. Bir sırrın en kötü saklanma yeri, herkesin bildiği yerdir.
`),
        },
        hard: {
          prompt: 'Gece dükkâna kim girer? Saklamayın.',
          says: S(`
vedat.kizgin: Kim girecek? Hırsız mı girdi diyorsunuz? Hırsız gelip iki sayfa mı basar?
vedat: …Emre geceleri bir şeyler yapıyor olabilir. Bazı sabahlar kâğıt eksik buluyorum, 300 gramlık kuşe. Bir şey demedim. Genç, parası yok.
T: Bir çırak. Bir kuşe kâğıt. Bir gece işi. Bir hikâye kendiliğinden kuruluyor. Kendiliğinden kurulan hikâyelere güvenmem.
`),
        },
      },
    }),
    topic('TV_MESAJ', 'O sabah Sevgi Hanım’a ne yazdınız?', {
      visibleWhen: has('clue_ceket'),
      cost: costOf('min', 2),
      discovers: 'clue_mesaj',
      score: { SORGULAMA: 40 },
      tones: {
        soft: {
          prompt: 'O sabah Sevgi Hanım’a yazdığınız mesaj duruyor mu?',
          says: S(`
N: Vedat telefonunu çıkardı. Ekranı çatlaktı. Bir süre kaydırdı, durdu ve telefonu bana uzattı.
N: 18 Şubat, 09.52. “Kimliğimi bulamıyorum, ceketi de aradım. Evde mi? PTT’ye gidemedim.” Altında Sevgi’nin cevabı: “Evde yok canım.”
vedat: Bunu kimse sormadı. Bir telefonun içinde beş aydır duruyor.
T: Saat 09.52. Tapuda kimlik 11.22’de kullanıldı. Bir adam bir saat yirmi dakika önce kimliğini kaybettiğini yazmış.
P: Bu mesajın ekran görüntüsünü alabilir miyim? Sevgi Hanım’ın telefonundan da.
vedat: Alın. Ne isterseniz alın. Bir telefondan bir şey alınır mı, ben bilmem; Sevgi bilir.
`),
        },
        hard: {
          prompt: 'Kimliği kaybettiğinizi gösteren bir şey var mı? Yoksa bu sadece sizin sözünüz.',
          says: S(`
vedat.kizgin: Sözüm mü? Bakın o zaman!
N: Telefonu masaya sertçe bıraktı. Ekranda bir mesaj: 18 Şubat, 09.52. “Kimliğimi bulamıyorum, ceketi de aradım. Evde mi? PTT’ye gidemedim.”
T: Bir mesaj, bir saat. Öfke bazen en iyi delili masaya atar.
`),
        },
      },
    }),
  ],
  finish: { id: 'GV_BITIR' },
});

export const vedatNodes: NodeDef[] = [giris, gorusme];
