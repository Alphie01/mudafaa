import {
  any,
  back,
  chosen,
  cmp,
  conversation,
  costOf,
  dec,
  fallback,
  flag,
  has,
  ifThen,
  inc,
  interview,
  mood,
  objective,
  option,
  raise,
  score,
  set,
  topic,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef } from '../../../tools/content/src/kit/index.js';
import { B, O, S, W } from './dsl.js';
import { INV } from './shared.js';

// 52-investigation-kisiler: Arda (görüşme: konu × ton, konular başka yerde bulunan olgularla açılır, delil sunma), Hayri,
// Recep ve Zehra (serbest konuşma). Hepsi hub'dan push ile açılır, `$return` ile döner.

const present = (id: string, evidence: string, spec: Partial<ChoiceDef>): ChoiceDef => ({
  id,
  kind: 'PRESENT',
  match: { evidence: [evidence] },
  ...spec,
});

const ARDA_ILK = `
# kafe | ESKİ SAYFA — SAHAF, ÇARŞI
İçerisi eski kâğıt, toz ve yağmur kokuyordu. Raflar tavana kadar; aralarından ancak yan yan geçiliyordu. Bir radyo düşük sesle türkü çalıyordu.
Arda tezgâhın arkasında bir koli kitabı etiketliyordu. Fotoğraftakinden zayıftı. Gözlüğünün bir sapı bantlıydı.
arda.saskin: Hocam? Deniz Hanım… Ablam söyledi geleceğinizi. Ben… buyurun. Şuraya oturun, sandalye var. Sallanır ama dayanır.
P: Patronun nerede?
arda: Cemal Amca öğleden sonra gelir. Dükkân bana emanet. Emanet… (kısa bir gülüş) Bu kelimeyle aram pek iyi değil bu aralar.
> Kendi kendine şaka yapan bir müvekkil. Ya çok korkmuş ya çok dürüst. İkisi de olabilir.
P: Arda, burada söylediğin her şey aramızda kalır. Ne söylersen söyle, seni yargılamak için değil, savunmak için soruyorum.
arda: Biliyorum hocam. Ders kitabında okudum. (duraksar) Pardon. Gerginim. Kapanışa on dört dakika var, sonra Cemal Amca’nın torunu gelir.
Görüşmede konu seç, sonra tonu seç. Yumuşak ton güveni artırır; sert ton bazen daha fazlasını söyletir ama güveni düşürür.
`;
const ARDA_TEKRAR = `
# kafe | ESKİ SAYFA — SAHAF, ÖĞLE ARASI
Arda kapıdaki “ÖĞLE ARASI” levhasını çevirdi. Termostan iki bardağa çay koydu; birini bana uzattı.
arda: Yine geldiniz. İyi mi bu, kötü mü?
P: Soracaklarım var. Yeni şeyler buldum.
arda: Yeni şeyler… Yedi aydır kimse yeni bir şey bulmadı hocam. Sekiz dakikam var.
`;

export const invPeople: CasePart = {
  nodes: [
    interview('INV_ARDA', {
      ...INV,
      title: 'Arda Çınar',
      background: 'kafe',
      hud: ['min', 'trust'],
      allowPresent: true,
      room: { label: 'ESKİ SAYFA · SAHAF', character: 'arda' },
      lines: [W(cmp({ visits: 'INV_ARDA' }, '<=', 1), ARDA_ILK), O(ARDA_TEKRAR)],
      tones: [
        { id: 'soft', label: 'Yumuşak', hint: '+4 güven' },
        { id: 'hard', label: 'Sert', hint: '−8 güven · daha fazla ayrıntı' },
      ],
      toneEffects: {
        soft: [inc('trust', 4), set('tone', 'soft')],
        hard: [dec('trust', 8), set('tone', 'hard')],
      },
      moodRules: [
        mood('Kapanmış', 'error', 'kizgin', cmp(v('trust'), '<', 40)),
        mood('Gergin', 'neutral', 'kizgin', cmp(v('tone'), '==', 'hard')),
        mood('Açılıyor', 'success', 'mutlu', cmp(v('trust'), '>=', 72)),
        mood('Temkinli', 'neutral', 'normal'),
      ],
      objectives: [
        objective('obj_aksam', flag('fact_aksam'), 'O akşamın saatleri: 18.20 Çarşı, 18.42 koltuk, 19.05 Görükle.', 'O akşam ne oldu, saat saat?'),
        objective('obj_neden', flag('fact_polis_neden'), 'Neden o gece karakola gitmediğini anlattı.', 'Neden o gece polise gitmedi?'),
        objective(
          'obj_niyet',
          any(flag('fact_153_anlatti'), flag('fact_sofor')),
          'Cüzdanı teslim etmek için en az bir somut adım attığını anlattı.',
          'Teslim etmek için ne yaptı?',
        ),
      ],
      topics: [
        topic('TP_AKSAM', 'O akşam', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_aksam')],
          tones: {
            soft: {
              prompt: 'O akşamı baştan anlatır mısın? Acele etme.',
              says: S(`
arda: Altıda sahaftan çıktım. Önce ATM’ye uğradım, kira payını çektim. Sonra Çarşı durağından otobüse bindim; altı yirmi gibi.
arda: Çok kalabalıktı. Orta kapının yanında ayakta kaldım. Kulaklığım vardı, bir dilbilim podcast’i dinliyordum. Kimseye bakmıyordum.
arda: Altıparmak’tan sonra boşaldı. Arka kapının önündeki koltuğa oturdum. Ayağım bir şeye takıldı. Eğildim. Cüzdan.
`),
            },
            hard: {
              prompt: 'Saat saat. Kim neredeydi, sen neredeydin?',
              effects: [raise('fact_parka_sezgi')],
              says: S(`
arda.kizgin: Altı yirmi Çarşı. Altı otuz yedi Altıparmak, bir sürü kişi indi. Altı kırk iki oturdum. Yedi beş Görükle, indim. Saydım hocam. O geceyi kaç kere saydım.
arda: Ayaktayken kimin yanında olduğumu bilmiyorum. Birinin şemsiyesi içeride açıktı, suyu ayakkabıma akıyordu. Onu hatırlıyorum.
arda: Bir de… birinin ıslak parkası koluma sürtünüp duruyordu. Soğuktu. Saçma bir ayrıntı, biliyorum.
> Saçma ayrıntılar en zor uydurulan şeylerdir. Not aldım.
`),
            },
          },
        }),
        topic('TP_CUZDAN', 'Cüzdan', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_cuzdan')],
          tones: {
            soft: {
              prompt: 'Cüzdanı açınca ne gördün?',
              says: S(`
arda: Bir kimlik. Yaşlı bir teyze. Bir sağlık kartı, bir eczane fişi. Bir de fotoğraf: asker kıyafetli bir amca, gülümsüyor.
arda: Para yoktu. Kart yuvaları boştu. “Demek biri almış,” dedim içimden. İlk aklıma gelen buydu.
arda: Yanımdaki adama “sizin mi?” dedim, başını salladı. Kimlikteki teyzeyi gözümle aradım. Bulamadım. Fotoğraf yirmi yıl önceymiş herhalde.
`),
            },
            hard: {
              prompt: 'Neden kapatıp çantana koydun? Elinde tutabilirdin.',
              says: S(`
arda.uzgun: Elinde tutsan ne olacak hocam? Herkes ıslak, herkes yorgun. Kime göstereceksin?
arda: Fotoğrafa uzun baktım. Sonra kapattım. Elimde başkasının hayatı var gibi geldi. Islanmasın diye çantaya koydum. Bu kadar.
arda: Yanımdakine sordum ama. Bunu kimse sormuyor. Polis de sormadı.
`),
            },
          },
        }),
        topic('TP_POLIS', 'Neden o gece polise gitmedin?', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          tones: {
            soft: {
              prompt: 'Neden o gece karakola gitmedin? Kızmıyorum; anlamak istiyorum.',
              effects: [ifThen(cmp(v('trust'), '>=', 66), [raise('fact_polis_neden')])],
              responses: [
                W(
                  flag('fact_polis_neden'),
                  `
Arda uzun süre cevap vermedi. Elindeki etiketi kitabın sırtına yapıştırdı, düzeltti, bir daha düzeltti.
arda.uzgun: Lisedeyken, Kars’ta… bir akşam kimlik kontrolünde beni ve iki arkadaşımı duvara dayadılar. Birinin cebinden bir şey çıktı. Benim değil.
arda.uzgun: Bir gece nezarette kaldım. Annem sabah geldi, karakolun önünde ağlıyordu. O günden beri polis arabası görsem midem kasılır.
arda: O gece… gidemedim hocam. Kapısına kadar gittim aslında, Görükle’deki. Geri döndüm. Sabah dokuza not yazdım. Kendime söz verir gibi.
> Leyla “bekle” demişti. Bekledim. Cevap utançla geldi.
`,
                ),
                O(`
arda: Geç olmuştu hocam. Islaktım. Yarın giderim dedim. Herkes böyle yapmaz mı?
> Cevap çok çabuk geldi. Leyla’nın sesi kulağımda: bazı cevaplar utançla gelir. Bu, utancın önüne çekilmiş bir perdeydi.
`),
              ],
            },
            hard: {
              prompt: 'On beş saat. Bir cüzdanı on beş saat saklamanın açıklaması ne?',
              effects: [raise('fact_polis_neden')],
              says: S(`
arda.kizgin: Saklamadım! Çantamdaydı. Saklamak başka bir şey.
Sonra sustu. Sesini alçalttı; sanki raflar duyacakmış gibi.
arda.uzgun: Lisede bir gece nezarette kaldım. Yapmadığım bir şey yüzünden. Annem sabah karakolun önünde ağlıyordu. O günden beri… gidemiyorum hocam.
arda: Kapısına kadar gittim o gece. Görükle karakolunun. Geri döndüm. Bunu kimseye söylemedim. Polise de. Korkak gibi görünmek istemedim.
`),
            },
          },
        }),
        topic('TP_ZARF', 'Zarftaki 600 lira', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_zarf')],
          tones: {
            soft: {
              prompt: 'Çantanda bir zarf içinde 600 lira bulunmuş. Onun hikâyesi ne?',
              says: S(`
arda: Burs. O gün çektim, kira payım. Ev sahibi iki aydır kızıyor. Zarfın üstüne adımı yazdım, karışmasın diye.
arda: ATM fişi bir yerde olmalı. Kitapların arasına sıkıştırırım fişleri, ayraç diye. Odama bakarsanız bulursunuz belki.
`),
            },
            hard: {
              prompt: 'Savcı o paranın kadının 1.200 lirasının yarısı olduğunu düşünüyor.',
              says: S(`
arda.kizgin: Kadının parasının yarısını alıp yarısını mı bıraktım? Sonra cüzdanı da yanımda mı taşıdım? Bu nasıl bir hırsızlık hocam?
arda: Zarfın üstünde “ARDA – kira” yazıyor. Kendi el yazım. Banka zarfı. Polis bunu da gördü.
`),
            },
          },
        }),
        topic('TP_SAHIBI', 'Sahibine ulaşmaya çalıştın mı?', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_mesaj_anlatti')],
          tones: {
            soft: {
              prompt: 'Cüzdanın sahibine ulaşmak için bir şey denedin mi?',
              says: S(`
arda: Facebook’ta kimlikteki adı aradım. Gülten Sarı. Üç hesap çıktı. Profil fotoğrafı bir dikiş makinesi olana yazdım; teyzenin kimliğinde meslek terziydi.
arda: Cevap gelmedi. “Görüldü” bile olmadı. Belki yanlış kişiye yazdım. Belki kimse bakmıyordur.
`),
            },
            hard: {
              prompt: 'Bir mesaj yazmak bir dakika sürer. Başka?',
              says: S(`
arda: Başka… Başka ne yapabilirdim? Kimlikte adres var ama gece yarısı yaşlı bir kadının kapısını çalamazdım. Korkardı.
arda.uzgun: Mesaj yazdım işte. Dikiş makinesi fotoğraflı hesaba. Cevap gelmedi.
`),
            },
          },
        }),
        topic('TP_TELEFON', '153’ü aramışsın.', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 30 },
          visibleWhen: has('clue_153_arama'),
          effects: [raise('fact_153_anlatti')],
          tones: {
            soft: {
              prompt: 'Arama geçmişinde 19.18’de 153 var. Neden bahsetmedin?',
              says: S(`
arda.saskin: Hı… o. Otobüsten inince aradım. Belediyenin hattı. Bir abla açtı. “Yarın terminaldeki kayıp eşya bürosuna götürün” dedi.
arda: Not aldı mı bilmiyorum. Kimse not almadı ki. Almışlarsa da kim bakar? Önemsiz geldi, o yüzden söylemedim.
> Önemsiz. Bir çağrı merkezi her şeyi kaydeder. Kimse bakmaz; ama kaydeder.
`),
            },
            hard: {
              prompt: 'Bunu polise neden söylemedin?',
              says: S(`
arda: Söyledim! “Belediyeyi aradım” dedim. Memur yazmadı. “Herkes bir yeri aramıştır” dedi.
arda.uzgun: İfademde yok, değil mi? Okumadan imzaladım. Avukat da yorgundu. Herkes yorgundu.
`),
            },
          },
        }),
        topic('TP_SOFOR', 'Şoföre vermeyi denedin mi?', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 30 },
          visibleWhen: has('clue_cikartma'),
          effects: [raise('fact_sofor')],
          tones: {
            soft: {
              prompt: 'Kapıda “eşyayı sürücüye teslim ediniz” yazıyor. Şoföre götürdün mü?',
              says: S(`
arda: Götürdüm. Görükle’de inerken ön kapıya gittim, uzattım. “Ben bakamam, yarın kayıp eşya bürosuna götür” dedi. El salladı.
arda: Arkamda kuyruk vardı, indim. Polise de söyledim bunu. Şoför “kimse getirmedi” demiş. Ben mi yalancıyım şimdi?
`),
            },
            hard: {
              prompt: 'Neden ısrar etmedin?',
              says: S(`
arda.uzgun: Israr etmeliydim. Etmedim. Herkes acele ediyordu, ben de acele ettim. Bir an “boş cüzdan, kime ne” dedim. Utanıyorum bundan.
arda: Ama verdim hocam. Elimi uzattım. Almadı.
`),
            },
          },
        }),
        topic('TP_ILK_AVUKAT', 'İlk avukatın', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_ilk_avukat')],
          tones: {
            soft: {
              prompt: 'Karakolda yanında baronun gönderdiği bir avukat varmış. Ne konuştunuz?',
              says: S(`
arda: Gece yarısından sonra geldi. Yorgundu, ıslaktı. “Ne olduysa anlat, kısa tut” dedi. Anlattım. Memur yazdı, ben imzaladım.
arda: İfadede “buldum, teslim edecektim” yazıyor. Başka bir şey yazmıyor. 153’ü söyledim, şoförü söyledim. Yazmadılar.
arda.uzgun: Sonra avukat bir kere aradı, “duruşma gününü bildiririm” dedi. Bildirmedi. Ablam bulamadı onu.
> Yazılmayan cümleler. Bir ifade tutanağı da bir kamera gibidir: gösterdiği kadar göstermediğiyle konuşur.
`),
            },
            hard: {
              prompt: 'İfadeni okumadan mı imzaladın?',
              says: S(`
arda.kizgin: Saat ikiydi hocam. Uykusuzdum, korkuyordum. Okudum… göz gezdirdim. “Buldum” yazıyordu, yeter sandım.
arda: Şimdi biliyorum ki yetmiyormuş. Bir cümle eksik olunca hikâye başkasının oluyormuş.
`),
            },
          },
        }),
        topic('TP_GULTEN', 'Cüzdanın sahibini düşündün mü?', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          visibleWhen: flag('fact_cuzdan'),
          effects: [raise('fact_arda_gulten')],
          tones: {
            soft: {
              prompt: 'O gece cüzdanın sahibini düşündün mü?',
              says: S(`
arda: Çok düşündüm. Fotoğraftaki asker amcayı. Kimlikteki teyzeyi. Bir kadın, kocasının fotoğrafını cüzdanında taşıyor. Benim annem de taşır babamınkini.
arda.uzgun: Mahkemede “cezasını çeksin” demiş. Haklı. Ben de olsam derdim. Kimse ona “cüzdanın bulundu” dememiş ki. “Çalındı” demişler.
`),
            },
            hard: {
              prompt: 'Sana hırsız diyen bir kadın hakkında ne düşünüyorsun?',
              says: S(`
arda: Kızmıyorum. Kızamıyorum. O fotoğrafı ben de kaybetsem ben de kızardım.
arda: Tek istediğim, bir gün ona “ben buldum” diyebilmek. “Ben çaldım” değil. Arada bir harf yok, koca bir hayat var.
`),
            },
          },
        }),
        topic('TP_HAYRI_TANI', 'Tanık Hayri Doğan', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          visibleWhen: { visited: 'INV_HAYRI' },
          effects: [raise('fact_arda_hayri')],
          tones: {
            soft: {
              prompt: 'Otobüste arkaya bakan koltukta gazete okuyan yaşlı bir adamı hatırlıyor musun?',
              says: S(`
arda: Gazete okuyan… Hatırlıyorum galiba. Gözlüğünü alnına itmişti, gazeteyi burnuna dayamıştı. Dedemi düşündüm, o da öyle okurdu.
arda: O mu beni gördüğünü söylüyor? Ben onun yanına hiç gitmedim ki. Orta kapıdaydım, o dokuzdaydı, aramızda üç kişi vardı.
`),
            },
            hard: {
              prompt: 'Tanık seni kadının arkasında gördüğünü söylüyor.',
              says: S(`
arda.kizgin: Arkasında mı? Kalabalıkta herkes birinin arkasındaydı hocam. Ben teyzenin iki metre solundaydım. Telefonuma bakıyordum.
arda: Benim kapüşonum sırtımdaydı, yağmurda bile. Saçım ıslandı, ablam kızdı. Başımda kapüşon yoktu.
> Kapüşon sırtındaydı. Not aldım. Bir ayrıntı daha. Ayrıntılar biriktikçe ya bir hikâye olur ya bir yalan.
`),
            },
          },
        }),
        topic('TP_KENDI', 'Kendin', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_staj')],
          tones: {
            soft: {
              prompt: 'Biraz da kendinden bahset. Neden öğretmenlik?',
              says: S(`
arda.mutlu: Sarıkamış’ta köy okulunda okudum. Öğretmenimiz kışın sobayı bizden önce yakardı. Ben de öyle biri olmak istedim.
arda: Staj okulunda dördüncü sınıflarım vardı. “Arda Öğretmenim” diyorlardı. İlk defa biri bana öğretmenim dedi.
arda.uzgun: Müdür dava bitene kadar gelmememi istedi. Çocuklar sormuş. Ne cevap vermişler, bilmiyorum.
`),
            },
            hard: {
              prompt: 'Savcı seni paraya sıkışmış bir öğrenci olarak anlatacak. Ne diyeceksin?',
              says: S(`
arda.kizgin: Sıkışmışım, doğru. Kira borcum var. Param yok. Hırsız profili tutuyor mu? Fakir olunca her bulduğun şey çalıntı mı oluyor?
arda: Özür dilerim hocam. Size değil. Yedi aydır herkes bana bakarken bunu düşünüyor, biliyorum.
`),
            },
          },
        }),
      ],
      choices: [
        present('PRA_NOT', 'clue_sari_not', {
          effects: [score('SORGULAMA', 30), raise('fact_ozan'), inc('trust', 4)],
          responses: B(`
arda.saskin: Bu… benim yazım. O gece yazdım, masaya yapıştırdım. Ozan sabah sordu, “karakol ne?” diye. Ben de anlattım.
arda: Polis aldı onu da. Kimse sormadı ne yazdığını. Ozan gördü hocam. Ozan her şeyi gördü.
`),
        }),
        present('PRA_ATM', 'clue_atm_fisi', {
          effects: [inc('trust', 3)],
          responses: B(`
arda.mutlu: İşte! Kitap ayracı yapmışım. 17.52. Otobüse binmeden yarım saat önce.
`),
        }),
        present('PRA_KIRA', 'clue_kira', {
          effects: [dec('trust', 4), raise('fact_kira_konustu')],
          responses: B(`
arda.uzgun: Onu da mı gördünüz… Evet. Borcum var. Ozan’a da borçluyum. Ama borcum var diye…
Cümlesini bitirmedi. Bitirmesine gerek yoktu.
> Savcı bu kâğıdı bulursa ne diyeceğini biliyorum. Ben de biliyorum ki bir kira uyarısı, bir cüzdanı koltuğun altına koymaz.
`),
        }),
        present('PRA_FB', 'clue_fb_mesaj', {
          effects: [inc('trust', 2)],
          responses: B(`
arda: Cevap gelmedi. Belki teyze Facebook kullanmıyordur. Torunu falan bakıyordur. Bilmiyorum.
`),
        }),
        {
          id: 'FB_ARDA_PRESENT',
          kind: 'FALLBACK',
          fallbackFor: 'PRESENT',
          repeat: 'ONCE_PER_PARAMS',
          responses: B(`
arda: Bunu ilk defa görüyorum hocam. Ne diyeyim bilmiyorum.
`),
        },
      ],
      finish: { id: 'ARDA_BITIR' },
    }),

    conversation('INV_HAYRI', {
      ...INV,
      title: 'Hayri Doğan',
      background: 'kafe',
      room: { label: 'ÇINARALTI KIRAATHANESİ · BEŞEVLER', character: 'hayri' },
      lines: B(`
# kafe | 16.30 — ÇINARALTI KIRAATHANESİ, BEŞEVLER
Sobalı, alçak tavanlı bir kıraathane. Okey taşlarının şıkırtısı, çay kaşıklarının bardak kenarına vuruşu, televizyonda kimsenin izlemediği bir haber.
Köşedeki masada yaşlı bir adam gazete okuyordu. Kalın camlı gözlüğünü alnına itmiş, gazeteyi burnuna dayamıştı.
P: Hayri Bey? Ben Avukat Deniz Arslan. Arda Çınar’ın avukatıyım. Birkaç dakikanızı rica etsem.
hayri: Avukat… O çocuğun mu? Otur kızım. Çay söyleyeyim. Ama bilesin, ben gördüğümü söylerim. Kimsenin hatırına söz eğmem.
Gözlüğünü alnından indirip burnuna taktı ve bana baktı. Gözleri gözlüğün ardında birden büyüdü.
hayri: Otuz yıl PTT’de mektup dağıttım. Bursa’nın yarısını kapı kapı bilirim. Yüz unutmam.
> Dürüst tanık en zor tanıktır. Yalancıyı yakalarsın; dürüst olanı ancak gördüğünün sınırına götürebilirsin.
`),
      choices: [
        option('HY_YER', '“Otobüste nerede oturuyordunuz?”', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_hayri_yer')],
          next: '$stay',
          responses: B(`
hayri: Dokuz numara. Arkaya bakan koltuk. Gençler oturmaz oraya, başları döner. Ben severim; gelen gideni görürüm.
hayri: Orta kapı tam karşımda. Kalabalık oradaydı. Teyze de oradaydı, bez çantasıyla.
`),
        }),
        option('HY_GORDU', '“O akşam tam olarak ne gördünüz? Yalnızca gördüğünüz kadarını.”', {
          discovers: 'clue_gri_kapuson',
          score: { SORGULAMA: 40 },
          next: '$stay',
          responses: B(`
hayri: Gazetemi okuyordum. Bir ara başımı kaldırdım. Teyzenin arkasında gri kapüşonlu biri. Sıkışık duruyordu. Eli aşağıdaydı, çantanın oralarda.
P: Yüzünü gördünüz mü?
hayri: Sırtı bana dönüktü. Yüzünü sonra gördüm, karakolda. CD’de. “Bu mu?” dediler. Gri kapüşon, genç. “Bu,” dedim.
> Sırtını gördü. Yüzü sonra, ekranda, “bu mu” sorusuyla geldi. Teşhis bir sorunun içine doğmuş.
`),
        }),
        option('HY_GOZLUK', '“Gözlüğünüzü okurken çıkarıyorsunuz.”', {
          discovers: 'clue_gozluk',
          score: { SORGULAMA: 40 },
          next: '$stay',
          responses: B(`
hayri: Miyobum kızım. Yakını gözlüksüz görürüm, uzağı gözlükle. Otuz yıl adres okudum, mektubu burnuma dayardım. Alışkanlık.
P: O akşam otobüste de öyle mi okuyordunuz?
hayri: Öyle okurum. Başka türlü okuyamam ki. Gözlükle gazete okumak, dürbünle mektup okumak gibi.
Gülümsedi. Sonra gülümsemesi biraz durdu; neden sorduğumu anlamaya çalışır gibi.
`),
        }),
        option('HY_KARAKOL', '“Karakolda size önce CD’yi izletip sonra mı sordular?”', {
          score: { SORGULAMA: 30 },
          visibleWhen: chosen('HY_GORDU'),
          effects: [raise('fact_hayri_cd')],
          good: 'Tanığa tek bir kişinin görüntüsünü gösterip “bu mu?” diye sormak telkine açık bir tanıma yöntemidir; bu tanıma, delillerin takdirinde (CMK 217) zayıf kalır.',
          category: 'SORGULAMA',
          next: '$stay',
          responses: B(`
hayri: İzlettiler. Bir genç, cüzdanı çantasına koyuyor. “Bu çocuk mu?” dediler. Ben de… kapüşon aynıydı. Gri.
hayri: Ne diyecektim? Polis biliyordur dedim. Onlar bilmezse kim bilecek?
`),
        }),
        option('HY_TELKIN', '“Kalabalıktı, gözlüğünüz de yoktu. Yanılmış olabilirsiniz, değil mi?”', {
          score: { SORGULAMA: -30 },
          bad: 'Tanığı duruşmadan önce beyanını değiştirmeye yönlendirmek avukatın görevine aykırıdır (Avukatlık Kanunu md. 34; TBB Meslek Kuralları). Tanığın sınırlarını mahkemede, sorularla göstermek gerekir.',
          category: 'SORGULAMA',
          effects: [raise('hayri_kizgin')],
          next: '$return',
          responses: B(`
hayri.kizgin: Ben yanılmam kızım. Otuz yıl bir adresi şaşırmadım. Sen beni o çocuğu kurtarmak için mi yalancı çıkaracaksın?
Gazetesini katladı, ceketini aldı. Çayının parasını masaya bıraktı; benimkini de.
> Dürüst bir adamı köşeye sıkıştırdım. Şimdi kürsüde savunacağı bir şeref meselesi var. Gördüğünden daha çok emin olacak.
`),
        }),
        option('HY_HAYAT', '“Otuz yıl PTT… En çok neyi özlüyorsunuz?”', {
          effects: [raise('hayri_hayat')],
          next: '$stay',
          responses: B(`
hayri.mutlu: Kapıları. Her kapının bir sesi vardır kızım. Bazısı gıcırdar, bazısı köpek havlatır, bazısı açılmadan önce bir çocuk koşar.
hayri: Bir mektup verirdin, bir yüz değişirdi. Bazen sevinçten, bazen korkudan. Ben yüzleri okurdum. Adresi değil, yüzü.
hayri.uzgun: Şimdi herkes telefona bakıyor. Otobüste kimse kimsenin yüzüne bakmıyor. Ben bakıyorum. Bakınca da… bir şey görüyorum sanıyorum.
> “Bir şey görüyorum sanıyorum.” Kendi ağzından, kendi sınırı. Bunu kürsüde hatırlayacaktım.
`),
        }),
        back('HY_BITIR', 'Teşekkür edip kalk'),
      ],
    }),

    conversation('INV_RECEP', {
      ...INV,
      title: 'Recep Ateş',
      background: 'depo',
      room: { label: 'KENT ULAŞIM GARAJI · KANTİN', character: 'recep' },
      lines: B(`
# depo | 13.10 — KENT ULAŞIM GARAJI, NİLÜFER
Mazot kokusu, ıslak beton, sıra sıra uyuyan otobüsler. Kantinin camı buğuluydu; içeride şoförler sigara içilmeyen bir odada sigara içiyordu.
Recep Ateş masada tek başına oturuyordu. Lacivert yeleği, açık mavi gömleği, avucunda soğumuş bir çay. Gözleri saatteydi.
P: Recep Bey? Avukat Deniz Arslan. Hat 38’deki cüzdan dosyası için geldim. On dakikanızı alacağım.
recep: On dakikam yok hanımefendi. Yedi dakikam var. Sonra seferim.
recep: Polise anlattım ne biliyorsam. Bir şey bilmiyorum.
> “Bir şey bilmiyorum” diye başlayan herkes bir şey bilir. En azından bilmemesi gerektiğini bilir.
`),
      choices: [
        option('RC_SOR', '“O akşam Görükle’de biri size bir cüzdan uzattı mı?”', {
          effects: [raise('fact_recep_inkar')],
          next: '$stay',
          responses: B(`
recep: Hayır. Polise de söyledim. Kimse bir şey getirmedi. Son durakta herkes iner, ben kimseye bakmam. Yirmi iki yıl, kimseye bakmam.
Saatine baktı. Çayından bir yudum aldı; soğuk olduğunu fark etmedi.
`),
        }),
        option('RC_DEFTER', '“Aracın buluntu defterine bakabilir miyim?”', {
          discovers: 'clue_defter',
          score: { ARASTIRMA: 40 },
          next: '$stay',
          responses: B(`
recep: Defter araçta. Araç da şurada, 1147. Bakın, gizlimiz saklımız yok.
Otobüsün torpidosundan kapağı yağlanmış bir defter çıkardı. 6 Mart sayfası boştu. 5 Mart’ta bir şemsiye, 9 Mart’ta bir çocuk eldiveni.
recep: Görüyor musunuz? Boş. Getiren olsa yazardım.
> Boş bir sayfa iki şey söyler: kimse bir şey getirmedi ya da getirileni kimse yazmadı.
`),
        }),
        option('RC_KAMERA', '“Ön kamera kabininizi de görüyor, değil mi?”', {
          score: { SORGULAMA: 40 },
          visibleWhen: has('clue_dort_kamera'),
          effects: [raise('fact_recep_korku')],
          next: '$stay',
          responses: B(`
recep.kizgin: Görsün. Ne olacak.
Bir süre sustu. Sonra sesini alçalttı.
recep: Bakın hanımefendi. Yirmi iki yıldır bu direksiyondayım. Geçen yıl iki tutanak yedim. Bir tutanak daha yersem kapının önüne koyarlar.
recep: Benim de evim var, kiram var. Ben kimseye bir şey yapmadım. Anladınız mı? Kimseye.
> Korkan biri her zaman yalan söylemez. Ama doğruyu da söylemez. Recep’in korkusu bir duvardı; duvarın arkasında bir şey vardı.
`),
        }),
        option('RC_BASKI', '“Yalan söylerseniz mahkemede bunun bedelini ödersiniz, haberiniz olsun.”', {
          score: { SORGULAMA: -50 },
          bad: 'Tanığı korkutarak beyanını değiştirmeye çalışmak meslek kurallarına aykırıdır; cebir ya da tehditle tanığı etkileme girişimi TCK 277 kapsamında suç oluşturabilir. Tanığa yalan tanıklığın sonuçlarını hatırlatmak hâkimin görevidir (CMK 53).',
          category: 'USUL_BILGISI',
          effects: [inc('ethics'), raise('recep_baski')],
          next: '$return',
          responses: B(`
recep.kizgin: Siz beni tehdit mi ediyorsunuz? Avukat hanım, ben size bir şey sormadım. Siz geldiniz.
Ayağa kalktı. Çay bardağı masada devrildi.
recep: Çıkın lütfen. Mahkemede ne soracaksanız orada sorun. Bundan sonra avukatım olmadan konuşmam.
> Kapı arkamdan kapandı. Bir tanığı yitirmek için bir cümle yeterdi. Ben o cümleyi söyledim. [shake]
`),
        }),
        option('RC_EV', '“Kaç yıldır bu hattasınız? Eviniz bu tarafta mı?”', {
          effects: [raise('recep_insan')],
          next: '$stay',
          responses: B(`
recep: Yirmi iki yıl. Önce Hat 3, sonra 19, sonra 38. Ev Hamitler’de. İki çocuk. Büyüğü üniversiteye hazırlanıyor, dershane parası…
Bir an sustu. Sonra saatine baktı, ama bu kez saate bakmadı; saatin camındaki yansımasına baktı.
recep: Çocuğum da bir gün bir otobüste bir şey bulursa ne yapsın diye düşünüyorum bazen. Sonra düşünmüyorum. Direksiyon düşündürmüyor.
`),
        }),
        back('RC_BITIR', 'Teşekkür edip çık'),
      ],
    }),

    conversation('INV_ZEHRA', {
      ...INV,
      title: 'Zehra Çınar',
      background: 'hastane',
      room: { label: 'DEVLET HASTANESİ · DAHİLİYE, GECE', character: 'zehra' },
      lines: B(`
# hastane | GECE 02.10 — DEVLET HASTANESİ, DAHİLİYE KATI
Koridorun florasanı vızıldıyordu. Bir serum pompası düzenli aralıklarla ötüyor, bir yaşlı adam uykusunda birini çağırıyordu.
Zehra hemşire odasının kapısında, elinde bir dosya, beni görünce şaşırdı. Sonra yorgun bir gülümseme.
zehra: Avukat hanım? Bu saatte? Hastalar uyuyor, ben uyumuyorum, siz de uyumuyorsunuz. Güzel bir ekip olduk.
zehra: On dakikam var. Sonra iki numarada ateş ölçeceğim.
`),
      choices: [
        option('ZH_POLIS', '“Arda polisten neden bu kadar korkuyor?”', {
          score: { SORGULAMA: 20 },
          effects: [raise('fact_polis_neden'), raise('zehra_anlatti'), inc('trust', 3)],
          next: '$stay',
          responses: B(`
zehra: Size anlatmadı değil mi? Anlatmaz. Lisedeyken Kars’ta bir kimlik kontrolünde arkadaşının cebinden bir şey çıktı. Hepsini götürdüler.
zehra.uzgun: Bir gece nezarette kaldı. Annem sabah karakolun önünde bekledi. Ben İzmir’deydim, okuldaydım. Gelemedim.
zehra: O günden beri polis görünce yolunu değiştirir. O gece de karakola gitmemiştir, eminim. Gidemezdi. Bu, suç mu?
`),
        }),
        option('ZH_PARA', '“Arda’nın para sıkıntısı var mı? Savcı bunu soracak.”', {
          score: { SORGULAMA: 20 },
          effects: [raise('fact_zehra_kira')],
          next: '$stay',
          responses: B(`
zehra.kizgin: Var. Kira. Ben gönderiyorum, yetmiyor. Bursu var, sahaftan harçlığı var. Ama o çocuk aç kalır, el uzatmaz.
zehra: Bir keresinde markette bozuk para yere düştü, adamın arkasından iki durak koştu. İki lira için. Ben ona deli dedim.
`),
        }),
        option('ZH_ANNE', '“Annenize ne zaman söyleyeceksiniz?”', {
          effects: [raise('zehra_anne')],
          next: '$stay',
          responses: B(`
zehra.uzgun: Bilmiyorum. Bitince söylerim diyorum. İyi biterse söylemeye gerek kalmaz diyorum. Kötü biterse… nasıl söylenir bilmiyorum.
Bir hasta zili çaldı. Zehra refleksle döndü, sonra bana baktı.
zehra: Siz işinizi yapın avukat hanım. Ben kendi işimi yapıyorum. İkimiz de birini ayakta tutmaya çalışıyoruz.
`),
        }),
        back('ZH_BITIR', 'Vedalaş'),
      ],
    }),
  ],
};
