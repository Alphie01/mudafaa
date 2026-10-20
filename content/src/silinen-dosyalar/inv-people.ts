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
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, Cond } from '../../../tools/content/src/kit/index.js';
import { B, O, T, W } from './dsl.js';
import { INV } from './shared.js';

// 52-inv-people: müvekkil görüşmesi (balkon) ve tanıklar (bekçi, komiser yardımcısı, DataKale, genel müdür).

const toneEffects = {
  soft: [inc('trust', 4), set('tone', 'soft')],
  hard: [dec('trust', 8), set('tone', 'hard')],
};

const lowTrust: Cond = cmp(v('trust'), '<', 40);
const highTrust: Cond = cmp(v('trust'), '>=', 60);

const gorusmeGiris = decisionNode('INV_GORUSME_G_1', [{ to: 'INV_GORUSME' }], {
  ...INV,
  title: 'Selim',
  onFirstEnter: [meet('selim'), ifThen(flag('deniz_durust'), [inc('trust', 4)])],
  lines: [
    W(
      cmp({ visits: 'INV_GORUSME' }, '==', 0),
      `
# SALI 18.10 — NİLÜFER, AKTAŞLARIN BALKONU [bg:ev]
> Üçüncü kat. Balkon dar; iki plastik sandalye, bir saksıda kurumuş bir fesleğen, kenarı yanık bir kül tablası.
> Selim beni balkonda karşıladı. İçeri davet etmedi. “Defne ödev yapıyor” dedi; sanki ödev yapan bir çocuğun yanında bu dosya konuşulamazmış gibi.
> Otuzlarının ortasında, ince, gözlüklü. Saçları kısa ve düzgün; sakalı üç gündür kesilmemiş. Ellerini nereye koyacağını bilmiyordu; sonunda bir sigara yaktı.
selim: Avukat hanım. Gül anlattı. Önceki avukat da gelmişti; burada oturdu, çay içti, “formalite” dedi. Üç hafta sonra çekildi.
selim: Size baştan söyleyeyim: ben dokuz yıl o şirketin her gece yedeğini aldım. Elektrik kesildiğinde gece ikide fabrikaya giden bendim. Ben veri silmem. Benim dinime aykırı.
~ Bir sistem yöneticisi “dinime aykırı” diyorsa, inandığı şeyi söylüyordur. Ama insanlar inandıkları şeyleri de saklar.
> Saatine baktım. Gül, “Akşam yemeğine kadar” demişti; on dört dakika.
`,
    ),
    O(`
# NİLÜFER — AKTAŞLARIN BALKONU [bg:ev]
> Aynı balkon, aynı iki sandalye. Fesleğen hâlâ kuru. Selim beni görünce sigarasını söndürdü; bu sefer erken.
selim: Yine mi siz? İyi. Bugün daha iyi bir günüm. Yüzde altmış.
`),
  ],
});

const gorusme = interview('INV_GORUSME', {
  ...INV,
  title: 'Müvekkil görüşmesi',
  hud: ['min', 'trust'],
  background: 'ev',
  room: { label: 'NİLÜFER · BALKON', character: 'selim' },
  onEnter: [ifThen(cmp({ visits: 'INV_GORUSME' }, '>', 1), [set('min', 8)])],
  lines: [
    W(
      cmp({ visits: 'INV_GORUSME' }, '==', 1),
      `
> İçeriden Defne’nin sesi geliyordu; çarpım tablosunu yüksek sesle okuyordu. Yedi kere sekiz. Elli altı.
`,
    ),
    O(`
> Akşam yemeğine sekiz dakika. Gül mutfaktan seslendi: “Avukat hanım da yesin!” Selim duymazdan geldi.
`),
  ],
  tones: [
    { id: 'soft', label: 'Yumuşak', hint: '+4 güven' },
    { id: 'hard', label: 'Sert', hint: '−8 güven · daha fazla bilgi' },
  ],
  toneEffects,
  moodRules: [
    mood('Açılıyor', 'success', 'saskin', has('clue_kisisel')),
    mood('Kapalı', 'error', 'kizgin', lowTrust),
    mood('Gergin', 'neutral', 'kizgin', cmp(v('tone'), '==', 'hard')),
    mood('Yorgun', 'neutral', 'normal'),
  ],
  objectives: [
    { id: 'obj_gece', when: flag('fact_gece'), known: 'O gece evdeydi; bilgisayar “gece” kapalıydı.', unknown: 'O gece ne yaptı?' },
    { id: 'obj_devir', when: flag('fact_devir'), known: 'Şifreleri zarfla genel müdüre verdi.', unknown: 'Şifreler kimdeydi?' },
    { id: 'obj_2130', when: has('clue_kisisel'), known: '21.30’da kendi klasörünü aldı.', unknown: 'Neden saklıyor?' },
    { id: 'obj_izin', when: flag('fact_izin'), known: 'Hesap izinle açık kalmıştı.', unknown: 'Girmeye yetkisi var mıydı?' },
  ],
  topics: [
    topic('TP_GECE', 'O gece', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 20 },
      effects: [raise('fact_gece')],
      tones: {
        soft: {
          prompt: 'O geceyi anlatır mısın? Cuma akşamından başla.',
          responses: [
            W(
              lowTrust,
              `
selim/kizgin: Anlattım. Polise anlattım, savcıya anlattım, önceki avukata iki kere anlattım. Evdeydim. Uyudum. Bu kadar.
~ Bir duvar. Duvara bağırılmaz; kapısı aranır.
`,
            ),
            O(`
selim: Cuma akşamı evdeydim. Defne’yi yatırdım; masal okudum, aynı masal, üçüncü kez. Gül’le bir dizi izledik; yarısında uyudum.
selim: Gece kalkmadım. Sabah polis değil, Gül uyandırdı; cumartesi pazarına gidecektik.
- Bilgisayarın?
selim: Kapalıydı. Gece kapalıydı. Ben bilgisayarı gece kapatırım; elektrik faturası, fan sesi, Defne uyanır.
> “Gece” kelimesinin üstünde bir an durdu. Sigarasının külünü silkeledi; kül zaten yoktu.
~ “Gece kapalıydı.” Akşam açık mıydı? Sormadım. Henüz.
`),
          ],
        },
        hard: {
          prompt: 'Saat saat. Cuma 21.00 ile cumartesi 03.00 arası.',
          responses: [
            O(`
selim/kizgin: Saat saat mi? Ben makine değilim avukat hanım. Makineler saat tutar; ben uyurum.
selim: Dokuzda Defne yattı. Ondan sonra… ondan sonra masadaydım biraz. Sonra Gül’ün yanına geçtim. Gece ikide uyuyordum. Kanıtlayamam; uyuyan adamın tanığı yastığıdır.
~ “Masadaydım biraz.” Bir masa, bir saat, yarım bir cümle. Not aldım.
`),
          ],
          effects: [raise('fact_masa')],
        },
      },
    }),
    topic('TP_CIKIS', 'İşten çıkarılış', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 15 },
      effects: [raise('fact_kavga')],
      tones: {
        soft: {
          prompt: 'Neden çıkardılar seni? Ne oldu?',
          says: T(`
selim: Yedek cihazının diskleri dolmuştu. Yeni disk istedim; iki bin dolar. Tarık Bey “bütçe yok” dedi. Üçüncü kez istedim; bağırdı.
selim: Ben de toplantıda dedim ki: “Bir gün her şey silinirse, beni aramayın.” Herkesin önünde. Aptalca. Şimdi o cümle iddianamede.
> Gözlüğünü çıkarıp gömleğinin ucuyla sildi. Gözlük temizdi.
selim: Bir hafta sonra İK aradı. “Yeniden yapılanma.” Dokuz yıl. Bir kahve fincanı, bir kaktüs, bir kutu kablo; hepsi bir koliye sığdı.
~ “Bir gün her şey silinirse.” Bir kehanet mi, bir tehdit mi? Savcı ikincisini seçmiş.
`),
        },
        hard: {
          prompt: 'Tehdit ettin mi onları? “Her şey silinirse” dedin mi?',
          says: T(`
selim/kizgin: Dedim! Uyardım! Tehdit etmedim, uyardım. Yangın alarmını takan adam yangını çıkarmış mı oluyor?
selim: Yedek alınmazsa veri gider. Bunu söyledim. Yedek alınmadı mı? Ben gittikten sonra kim baktı yedeğe, onu sorun.
~ Bir soru. Ona değil, bir başkasına sorulacak bir soru.
`),
        },
      },
    }),
    topic('TP_DEVIR', 'Devir-teslim', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 25 },
      effects: [raise('fact_devir')],
      tones: {
        soft: {
          prompt: 'Ayrılırken neyi kime teslim ettin?',
          says: T(`
selim: Her şeyi. Dizüstü, personel kartı, anahtarlar, dokümantasyon. Bir de şifreler.
selim: Şifreleri Tarık Bey kendisi istedi. “Bülent’e değil, bana ver; şifreler bende dursun” dedi. Ben de hepsini bir kâğıda yazdım, zarfa koydum, kapattım, imzaladım. Kendi eliyle aldı.
- Tutanak var mı?
selim: Var tabii. Ben tutanaksız çay bile içmem. Bir nüshası bende, masadaki dosyada. Polis almadı; dizüstüyü aldılar, kâğıda bakmadılar.
~ Bir zarf. Bir genel müdürün elinde. Dosyada bunun bir satırı bile yok.
`),
        },
        hard: {
          prompt: 'Şifreleri değiştirmediler mi? Hâlâ biliyor musun?',
          says: T(`
selim: Değiştirmeleri gerekirdi. İlk iş. Ben olsam değiştirirdim. Değiştirmemişler; kayıtta benim kullanıcı adım çıkıyorsa, değiştirmemişler.
selim: Biliyor muyum? Biliyorum tabii. Dokuz yıl ben koydum o şifreleri. Ama bilmek girmek değil avukat hanım. Bilmek bir şey, kullanmak başka.
selim: Zarfı Tarık Bey’e verdim. Kendi eliyle aldı. Masasının çekmecesine koydu. Gözümün önünde.
~ Biliyor. Bunu kürsüde söylemesin. Ya da söylesin, ama nasıl söyleyeceğini bilsin.
`),
        },
      },
    }),
    topic('TP_YEDEK', 'Yedek cihazı', {
      cost: costOf('min', 2),
      visibleWhen: any(has('clue_son_yedek'), has('clue_bos_yuva')),
      score: { SORGULAMA: 20 },
      tones: {
        soft: {
          prompt: 'Yedek cihazı çalışıyor muydu? Şikâyette “aylardır arızalı” yazıyor.',
          says: T(`
selim/saskin: Arızalı mı? Diskleri dolmak üzereydi, arızalı değildi. Her gece saat onda çalışırdı. Bıraktığım gün çalışıyordu.
selim: Kablosu mu? Kablosu kendiliğinden çıkmaz avukat hanım. O kablo kilitlidir; mandallı. Çekmek için eğilip mandala basman gerekir.
> Sigarasını söndürdü. Bir süre konuşmadı. Sonra çok alçak sesle:
selim: Biri o odaya girmiş. Ben giremem; kartımı teslim ettim. Tutanakta yazar.
~ Bir kablo kendiliğinden çıkmaz. Bunu bir sistemciden duymak, bir fizik kanununu duymak gibiydi.
`),
        },
        hard: {
          prompt: 'Yedeği sen mi devre dışı bıraktın, ayrılmadan önce?',
          says: T(`
selim/kizgin: Ben mi? Ben o cihazı bebek gibi baktım! Bıraktığım gün son yedek tamamdı, tutanağa bile yazdırdım.
selim: Kablo çekilmişse, çeken o odaya girmiş biri. Benim kartım yok. İsteyin kart kayıtlarını; kim girdiyse orada yazar.
~ Kart kayıtları. Bir sunucuda bir yerde. Mahkeme isterse gelir.
`),
        },
      },
    }),
    topic('TP_2130', 'Cuma 21.30', {
      cost: costOf('min', 3),
      visibleWhen: any(has('clue_2130'), has('clue_emn_yok')),
      score: { SORGULAMA: 40 },
      tones: {
        soft: {
          prompt: 'Kayıtta cuma 21.30’da senin evinden bir bağlantı var. Bana anlatmak ister misin?',
          responses: [
            W(
              any(highTrust, flag('gul_resim_verildi')),
              `
> Selim uzun süre sustu. İçeriden Defne’nin sesi: “Dokuz kere dokuz, seksen bir.”
selim/uzgun: Fotoğraflarımı aldım. Defne’nin doğduğu günün fotoğrafları o klasördeydi. Hastanede çektim, şirketin bilgisayarına aktarmıştım; evdeki disk bozulmuştu.
selim: Bir de özgeçmişim. İş arıyorum. Yirmi dakika. Kendi klasörüm. Başka hiçbir şeye dokunmadım. Yemin ederim; Defne’nin üstüne.
- Neden söylemedin?
selim: Çünkü kim inanır? Gece bağlanmış, ertesi sabah her şey silinmiş. Önceki avukata söyledim, yüzü değişti. Ertesi hafta çekildi.
~ İnsanlar inandıkları şeyleri saklar. Bazen de inanılmayacaklarını bildikleri gerçeği.
`,
            ),
            O(`
selim: Kayıt kayıttır. Ben ne diyeyim. Akşam masadaydım dedim ya.
> Gözlerini kaçırdı. Elindeki çakmağı çevirdi, çevirdi.
selim: Peki. Peki. Bağlandım. Kendi klasörüm. Fotoğraflar, özgeçmiş. Yirmi dakika. Başka bir şeye dokunmadım.
~ İtiraf değil; yorgunluk. Ama doğru gibi duruyor. Doğruyu yorgunluk söyletir bazen.
`),
          ],
          effects: [discover('clue_kisisel'), score('ARASTIRMA', 60)],
        },
        hard: {
          prompt: '21.30’da sistemdeydin. Bana yalan söyledin.',
          says: T(`
selim/kizgin: Yalan söylemedim! Söylemedim, o kadar. Bir şeyi söylememek yalan mı?
> Ayağa kalktı. Balkon demirine tutundu. Aşağıda bir otobüs geçti; camları buğulu.
selim/uzgun: Fotoğraflarımı aldım. Kızımın doğum fotoğraflarını. Bir de özgeçmişimi. Yirmi dakika. Başka bir şeye dokunmadım. Dokunsam, iz bırakmadan dokunurdum; dokuz yıl o sistemi ben kurdum.
selim: Bunu da yazın mahkemeye: “İz bırakan adam silmez.” Kim siliyorsa, benim adımı bilerek kullanıyor.
~ Öfkeyle gelen bir doğru, sakin bir yalandan daha çok iz bırakır.
`),
          effects: [discover('clue_kisisel'), score('ARASTIRMA', 60)],
        },
      },
    }),
    topic('TP_IZIN', 'Genel müdürün e-postası', {
      cost: costOf('min', 2),
      visibleWhen: has('ev_eposta'),
      score: { SORGULAMA: 30 },
      effects: [raise('fact_izin')],
      tones: {
        soft: {
          prompt: 'Gül bu e-postayı çekmecede saklamış. Hatırlıyor musun?',
          says: T(`
> Kâğıdı aldı. Okudu. Bir kez daha okudu. Kaşları yavaşça kalktı.
selim/saskin: Bunu Tarık Bey yazmıştı. Son gün akşamı. “Kişisel dosyalarını ay sonuna kadar alabilirsin, hesabın açık kalacak.” Unutmuşum.
selim: Gül basmış mı bunu? Ben ona telefondan göstermiştim; “Bak, adam gibi adam” demiştim. Gül basmış. Gül her şeyi basar.
- Bu e-posta, o akşam girdiğin kapının sana açık bırakıldığını gösteriyor.
selim: Yani… suç değil mi? Kendi klasörümü almam?
~ Bir kapı izinle açık bırakılmışsa, o kapıdan girmek suç olmaz. Ama kapının kime açık bırakıldığı da bir soru.
`),
        },
        hard: {
          prompt: 'Bu e-postayı neden polise vermedin?',
          says: T(`
selim/kizgin: Hatırlamadım! Polis sabah altıda kapıyı çaldı, kızım merdivende ağlıyordu. Bir e-posta mı aklıma gelecekti?
selim: Hem kim sordu? Kimse “girmeye izniniz var mıydı” demedi. Herkes “sildiniz mi” dedi.
~ Herkes yanlış soruyu sordu. Yanlış soruların doğru cevabı olmaz.
`),
        },
      },
    }),
    topic('TP_KIM', 'Kim olabilir?', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 10 },
      tones: {
        soft: {
          prompt: 'Sen değilsen, kim? Bir fikrin var mı?',
          says: T(`
selim: Bilmiyorum. Bülent’in firması dokuz yıl benim yaptığım işi yapmak istiyordu; benim gitmem onların işine geldi. Ama Bülent veri silmez; korkar.
selim: Şifreler bir zarftaydı. Zarf bir çekmecedeydi. Çekmeceyi kim açtıysa.
selim: Ben ağ yöneticisiyim avukat hanım, dedektif değilim. Bana bir kayıt verin; kime ait olduğunu söyleyeyim. İnsanların kalbini okuyamam.
~ Bir çekmece. Bir zarf. Kimseyi suçlamıyor. Bu iyi; suçlayan müvekkil, mahkemede kendine benzer.
`),
        },
        hard: {
          prompt: 'Biri sana kin mi besliyordu? İsim ver.',
          says: T(`
selim/kizgin: İsim mi? Ben kimseyi suçlamam. Bana yaptıkları gibi. Kanıtınız varsa söyleyin, yoksa kimsenin adını ağzıma almam.
~ Haklı. Kanıtsız bir isim, bu dosyada zaten bir kere söylendi: onunki.
`),
        },
      },
    }),
  ],
  choices: [
    option('G_RESIM', 'Defne’nin resmini ver', {
      visibleWhen: flag('gul_resim'),
      maxUses: 1,
      effects: [inc('trust', 10), raise('gul_resim_verildi')],
      responses: B(`
> Katlanmış resmi uzattım. Selim açtı. Bir balkon, bir adam, adamın elinde bir sigara ve kocaman bir “YASAK” işareti.
selim/uzgun: Bunu her akşam çiziyor mu? Gül söyledi; ben bakmadım. Bakamadım.
> Sigarasını kül tablasına bastırdı; daha yarısındaydı. Resmi katladı, gömleğinin cebine koydu.
selim: Peki avukat hanım. Ne sorarsanız. Doğrusunu.
`),
    }),
  ],
  finish: { id: 'G_BITIR' },
});

// --- Tanıklar ---

const tYasar = conversation('INV_T_YASAR', {
  ...INV,
  title: 'Yaşar Kılıç',
  eyebrow: 'TANIKLAR',
  background: 'depo_gece',
  room: { label: 'FABRİKA KAPISI · KULÜBE', character: 'yasar' },
  lines: B(`
# ÇARŞAMBA 22.40 — NİLÜFER ÖRME, BEKÇİ KULÜBESİ [bg:depo_gece]
> Gece vardiyası. Fabrikanın ışıkları yağmurda bulanık yanıyordu. Kulübede bir elektrikli soba, bir radyo, bir tespih.
yasar: Gel kızım, gel. Islanma. Gündüz konuşamazdık; müdürler var. Gece kimse yok. Bir ben varım, bir de köpek.
yasar: Çay. Şekersiz mi? Avukatlar şekersiz içer, bilirim. Selim de şekersiz içerdi; “şeker beyni yavaşlatır Yaşar Usta” derdi.
yasar: O çocuk gece bilgisayar bozulunca gelirdi. Saat iki, üç. Bana simit getirirdi. Kimse getirmez. Otuz yıldır bu kapıdayım; simit getiren bir o oldu.
yasar: Şimdi diyorlar, o her şeyi silmiş. Ben bilmem kızım. Bilgisayar benim aklımın ermediği iş. Benim aklım kapıya erer: kim girdi, kim çıktı.
~ Kim girdi, kim çıktı. Bu dosyanın sorusunu bir bekçi, bir cümleyle söyledi.
`),
  choices: [
    option('YQ_GECE', '“Cuma gecesi kapıdan kimse girdi mi?”', {
      score: { SORGULAMA: 30 },
      responses: [
        W(
          has('clue_defter'),
          `
- Defterinizde cuma 23.05 için bir araç yazıyor. “GM aracı. Evrak.”
> Yaşar Usta tespihini bıraktı. Sobanın ateşine baktı.
yasar: Yazdım ya. Ben ne gelirse yazarım. Genel müdürün arabası geldi. Siyah. Camı indirdi: “Evrak unuttum Yaşar” dedi. Açtım. Ne diyeyim? Patron.
yasar: İdari binaya girdi. Yarım saat kaldı. Çıktı, el salladı, gitti. Elinde evrak yoktu; ama ben bakmadım, belki cebindeydi.
~ Bir genel müdür, cuma gecesi yarım saat. Evrak unutmak sık olur. Bunu not ediyorum; bir isim değil, bir saat olarak.
`,
        ),
        O(`
yasar: Cuma gecesi mi? Kim girecek kızım? Gece vardiyası, servisler… Kimse girmez. Ben de dalmışımdır belki.
> Gözleri bir an masadaki deftere kaydı. Sonra sobaya.
~ Bir defter. Kulübenin camının önünde. Gündüz okuyamazdım; okumam lazım.
`),
      ],
      effects: [ifThen(has('clue_defter'), [discover('clue_yasar'), score('ARASTIRMA', 40)])],
    }),
    option('YQ_SELIM', '“Selim’i işten çıktıktan sonra gördünüz mü?”', {
      score: { SORGULAMA: 10 },
      responses: B(`
yasar: Görmedim. Kartını bıraktı, bana bir paket simit bıraktı, “Usta hakkını helal et” dedi. Bir daha gelmedi.
yasar: Gelemez de zaten. Kartı yok. Kartı olmayan bu turnikeden geçemez; ben açmazsam.
~ Kartı olmayan geçemez. Kartı olan geçer. Kartlar kimdeyse.
`),
    }),
    option('YQ_KORKU', '“Bunları anlatmaktan çekiniyor musunuz?”', {
      score: { SORGULAMA: 10 },
      responses: B(`
yasar: Çekinmez miyim kızım? İki yıl sonra emekliyim. Kapıdan atarlarsa nereye giderim? Kırk yaşında olsam neyse.
yasar: Ama yalan da söylemem. Otuz yıldır bu deftere ne gördüysem onu yazdım. Defter benim namusum.
`),
    }),
    cont('YASAR_KARAR', 'Tanıklığını konuş', 'INV_T_YASAR_K', {
      role: 'PRIMARY',
      enabledWhen: has('clue_yasar'),
      lockedReason: 'Önce o geceyi sor.',
    }),
    back('YASAR_BITIR', 'Çay için teşekkür et'),
  ],
});

const tYasarKarar = conversation('INV_T_YASAR_K', {
  ...INV,
  title: 'Yaşar Kılıç',
  eyebrow: 'TANIKLAR',
  background: 'depo_gece',
  room: { label: 'FABRİKA KAPISI · KULÜBE', character: 'yasar' },
  lines: B(`
yasar: Mahkemeye mi çağıracaksın beni? Ben mahkemeye bir kere gittim; tarla davası. Kırk yıl sürdü, tarla kaldı, adam kalmadı.
`),
  choices: [
    option('YD_BILDIR', 'Sizi tanık olarak bildireceğim', {
      score: { USUL_BILGISI: 50 },
      effects: [raise('yasar_tanik')],
      good: 'Saat ve giriş bilgisi veren tanığı delil dilekçesiyle bildirmek, beyanın duruşmada doğrudan dinlenmesini sağlar (CMK 177–178).',
      category: 'USUL_BILGISI',
      responses: B(`
- Sizi tanık olarak bildireceğim Yaşar Usta. Mahkeme çağıracak. Defterinize ne yazdıysanız, ne gördüyseniz onu anlatacaksınız. Fazlasını değil.
yasar: Fazlasını değil. Peki. Defter ne diyorsa o.
> Kapıya kadar geçirdi beni. Yağmur durmuştu; asfalt fabrika ışıklarını yansıtıyordu.
yasar: Bir de… Selim’e selam söyle. Simit borcum var ona.
`),
      next: '$return',
    }),
    option('YD_SAAT', '“Saati sorarlarsa tam 23.05 deyin; şaşmayın.”', {
      effects: [inc('ethics'), raise('yasar_kocluk'), raise('yasar_tanik'), score('SAVUNMA_STRATEJISI', -50)],
      bad: 'Tanığa ne söyleyeceğini ezberletmek tanığı yönlendirmektir (Av.K. 34) ve beyanın değerini yok eder; yalan tanıklığa azmettirme riski taşır (TCK 272, 38).',
      category: 'SAVUNMA_STRATEJISI',
      responses: B(`
- Saati sorarlarsa tam 23.05 deyin. Şaşmayın. Savcı sizi şaşırtmaya çalışır.
yasar: 23.05. Peki kızım. Ezberlerim.
> Bir an durdu. Deftere baktı.
yasar: Ama defterde zaten yazıyor. Niye ezberleteyim? Ben gördüğümü söylerim.
~ Haklıydı. Benim söylediğim, onun gördüğünün üstüne yazılan bir cümleydi. Bir savcı bunu kolayca kazır.
`),
      next: '$return',
    }),
    option('YD_YAZILI', 'Yazılı bir beyan yeter', {
      score: { USUL_BILGISI: -30 },
      bad: 'Duruşmada dinlenebilecek tanığın beyanı yerine yazılı belge okunamaz (CMK 210/1).',
      category: 'USUL_BILGISI',
      responses: B(`
- Bir kâğıda yazıp imzalasanız yeter Yaşar Usta. Gelmenize gerek kalmaz.
yasar: Yazarım. Ama kâğıt soru sorulunca cevap vermez kızım; sen bilirsin.
~ Mahkeme, dinleyebileceği tanığın kâğıdını okumaz. Bunu biliyordum. Onun korkusunu kolaylaştırdım.
`),
      next: '$return',
    }),
  ],
});

const tHakan = conversation('INV_T_HAKAN', {
  ...INV,
  title: 'Kom. Yrd. Hakan Ilgaz',
  eyebrow: 'TANIKLAR',
  background: 'karakol',
  room: { label: 'EMNİYET ÖNÜ', character: 'hakan' },
  onFirstEnter: [meet('hakan')],
  lines: B(`
# PERŞEMBE 12.20 — EMNİYET MÜDÜRLÜĞÜ, SİBER BÜRO ÖNÜ [bg:karakol]
> Hakan Ilgaz merdivende bir simit yiyordu; yarısını güvercinlere atıyordu. Beni görünce simidi kâğıda sardı.
hakan: Avukat hanım. Aktaş dosyası. Öğle arasıyım; on dakika. Mahkemede ne soracaksanız sorun, burada ifade vermem.
hakan: Size bir rakam vereyim: büroda dört kişiyiz, masamızda üç yüz on iki dosya var. Dolandırıcılık, şantaj, çocuk… Bu dosya bizim için “kolay” dosyaydı. Şirket raporu getirdi, isim belliydi.
hakan: Kolay dosyaları severiz avukat hanım. Zor dosyalara vakit kalsın diye.
~ Yorgun bir adam. Kötü değil. Yorgunluk, bir soruyu sormamak için en eski gerekçedir.
`),
  choices: [
    option('HQ_IMAJ', '“Şirketin sunucusunu kim inceledi?”', {
      score: { SORGULAMA: 30 },
      discovers: 'clue_hakan',
      responses: B(`
hakan: Biz incelemedik. Şirket, DataKale’nin aldığı imajı ve raporunu getirdi. Diskler şirkette kaldı; üretim duramaz dediler.
hakan: Biz sanığın bilgisayarına baktık. Kurallara uygun: arama kararı, tutanak, imaj, özet değer. Orada kusur bulamazsınız.
- Peki şirket tarafında?
hakan: Şirket tarafında… elimize ne verdilerse onu inceledik. Bu kadar.
~ “Elimize ne verdilerse.” Bir dosyanın yarısı bir polisin eline hiç geçmemiş.
`),
    }),
    option('HQ_DIZUSTU', '“Selim’in bilgisayarında ne buldunuz?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('fact_emn')],
      responses: B(`
hakan: Cuma akşamı bir bağlantı. 21.30, yirmi dakika. Kendi klasörünü kopyalamış; fotoğraflar, bir özgeçmiş. Rapora yazdık.
hakan: Gece yarısından sonrası? Hiçbir şey. Bilgisayar kapalı. Ama savcı “başka bir cihaz kullanmış olabilir” dedi. Olabilir. Olmayabilir de.
~ Polis, kendi raporunda bir boşluk bırakmış; savcı o boşluğa bir varsayım koymuş.
`),
    }),
    option('HQ_DISK', '“Orijinal diskler şimdi nerede?”', {
      visibleWhen: has('clue_hakan'),
      score: { SORGULAMA: 30 },
      effects: [raise('fact_disk')],
      responses: B(`
hakan: Şirkette. Sunucu odasında, çalışıyor olmalı. Kimse el koymadı.
> Bir an durdu. Simidin kâğıdını katladı.
hakan: Biri isterse, mahkeme bilirkişi atar, gider orijinalden yeni imaj alır. Ama kimse istemedi. Siz isteyecek misiniz?
~ Bir polisin “siz isteyecek misiniz” sorusu bir tavsiye değildir. Ama bir tavsiye kadar ağırdır.
`),
    }),
    back('HAKAN_BITIR', 'Teşekkür et, ayrıl'),
  ],
});

const tBulent = conversation('INV_T_BULENT', {
  ...INV,
  title: 'Bülent Arıkan',
  eyebrow: 'TANIKLAR',
  background: 'buro',
  room: { label: 'DATAKALE BİLİŞİM', character: 'bulent' },
  onFirstEnter: [meet('bulent')],
  lines: B(`
# PERŞEMBE 16.00 — DATAKALE BİLİŞİM, FSM BULVARI [bg:buro]
> Cam bir ofis. Duvarlarda “Siber Güvenlik Uzmanı” sertifikaları, çerçeveli. Köşede bir golf çantası; sopaların başlarına örgü kılıflar geçirilmiş.
> Bülent Arıkan kırklarının başında, spor ceketli, kulağında kablosuz bir kulaklık. Elimi sıkarken telefonuna baktı.
bulent: Avukat hanım, hoş geldiniz. Beş dakikam var, sonra bir müşteriye bağlanacağım. Rapor ortada; teknik olarak tartışılacak bir şey yok aslında.
bulent: Selim’i tanırım. Yetenekli çocuktur. Ama biraz… kendini sistemin sahibi sanır. İşten çıkarılınca da şey yaptı işte. Teknik olarak bu tür olaylar yüzde yetmiş içeriden olur.
~ “Teknik olarak” diye başlayan her cümle, teknik olmayan bir şey söyler.
`),
  choices: [
    option('BQ_IMAJ', '“İmajı ne zaman aldınız?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('fact_bulent_sabah')],
      responses: B(`
bulent: Aynı sabah. Tarık Bey aradı, koştuk. Olay yerine ilk biz girdik, her şeyi dondurduk. Altın kural: önce imaj.
bulent: Raporda her şey yazıyor. Tarih, saat, özet değer. Profesyonel iş.
~ “Aynı sabah.” Bu cümleyi bir yere yazdım. Raporun künyesiyle karşılaştıracağım.
`),
    }),
    option('BQ_KURTARMA', '“İmajdan önce sistemde bir şey yaptınız mı?”', {
      score: { SORGULAMA: 30 },
      discovers: 'clue_bulent',
      responses: B(`
bulent: Yani… şirket ayağa kalkmak istiyordu. Siparişler. Tarık Bey “ne kurtarırsak kârdır” dedi.
bulent: Cumartesi sabahı biraz kurcaladık; belki kurtarırız diye. Kurtarma programları, bilirsiniz. Standart prosedür. Sonra imaj aldık.
> Kendi cümlesinin ortasında durdu. Kulaklığını çıkardı.
bulent: Ama bu sonucu değiştirmez. Teknik olarak.
~ Sonucu değiştirmez mi? Bir olay yerinde iki gün dolaşıp sonra fotoğraf çekmek gibi.
`),
    }),
    option('BQ_TARIK', '“Tarık Bey’i ne zamandır tanıyorsunuz?”', {
      score: { SORGULAMA: 15 },
      effects: [raise('fact_golf')],
      responses: B(`
bulent: On beş yıl. Golften. Kulüpte tanıştık; o zaman DataKale iki kişiydi, şimdi otuz. Nilüfer Örme ilk büyük müşterimizdi.
bulent: Arkadaşız, evet. Ama iş iştir. Rapor tarafsız.
~ İlk büyük müşteri. On beş yıl. Golf. Tarafsızlık, bu üç kelimenin yanında biraz zayıf duruyor.
`),
    }),
    option('BQ_TEHDIT', '“Bu raporla meslekten men edilebilirsiniz.”', {
      score: { SORGULAMA: -30 },
      bad: 'Tanık olacak bir uzmanı ofisinde tehdit etmek ondan bilgi almaz; duruşmada sana karşı daha da kapanır.',
      category: 'SORGULAMA',
      responses: B(`
bulent/kizgin: Men mi? Benim meslek odam yok avukat hanım, şirketim var. Avukatımla konuşun. Çıkışı biliyorsunuz.
> Kapıyı açtı. Golf çantasının yanından geçerken sopalardan biri devrildi; kaldırmadı.
~ Kazanamayacağım bir kavgaya girdim. Hem de kürsüye çıkacak bir tanıkla.
`),
      next: '$return',
    }),
    back('BULENT_BITIR', 'Teşekkür et, ayrıl'),
  ],
});

const tTarik = conversation('INV_T_TARIK', {
  ...INV,
  title: 'Tarık Sezer',
  eyebrow: 'TANIKLAR',
  background: 'buro',
  room: { label: 'GENEL MÜDÜRLÜK', character: 'tarik' },
  onFirstEnter: [
    meet('tarik'),
    raise('tarik_ziyaret'),
    inc('ethics'),
    score('SAVUNMA_STRATEJISI', -40),
    {
      type: 'MARK',
      quality: 'BAD',
      feedback:
        'Katılan şirketin vekili varken onun bilgisi olmadan şirketin genel müdürüyle görüştün; meslek kurallarına aykırı (TBB Meslek Kuralları 38; Av.K. 34).',
      category: 'SAVUNMA_STRATEJISI',
    },
  ],
  lines: B(`
# CUMA 10.30 — NİLÜFER ÖRME, GENEL MÜDÜRLÜK KATI [bg:buro]
> Ceviz bir masa, deri koltuklar, duvarda bir ihracat ödülü ve çerçeveli bir golf turnuvası fotoğrafı. Pencereden dokuma salonunun çatısı.
> Tarık Sezer kapıda karşıladı, elimi iki eliyle sıktı. Sekreterine çay söyledi; “Avukat hanımınkini ince belli getir” dedi.
tarik: Evladım, hoş geldiniz. Bu iş beni de çok üzdü, inanın. Selim’i ben işe aldım. Oğlum gibiydi. Oğullar da bazen babalarına kızar, değil mi?
tarik: Ben bu şirketi otuz yıl önce iki makineyle kurdum. Siparişler, tasarımlar… on iki yılın emeği bir gecede gitti. Ama kin tutmuyorum. Yeter ki gerçek ortaya çıksın.
~ Sıcak bir el, ince belli bir bardak, bir “evladım.” Bu odada herkes misafir; ama kimse rahat değil.
> Telefonu çaldı. “Ozan, avukat hanım burada” dedi. Bir an dinledi; yüzü değişmedi. “Tabii, tabii” dedi ve kapattı.
tarik: Avukatımız biraz kızdı. Siz yine de çayınızı için.
`),
  choices: [
    option('TQ_SIFRE', '“Selim ayrılırken şifreleri kime teslim etti?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('fact_tarik_sifre')],
      responses: B(`
tarik: Şifre mi? Ben teknik adam değilim evladım. Şifre mifre bilmem. O işleri Bülent’e bırakırım; ben telefonumun şifresini bile kızıma sorarım.
> Güldü. Çayını karıştırdı; kaşık bardağa hiç değmedi.
~ “Şifre mifre bilmem.” Bir cümle. Bir gün bir tutanağın yanına koyulabilir.
`),
    }),
    option('TQ_YEDEK', '“Yedek sistemi neden çalışmıyordu?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('fact_tarik_yedek')],
      responses: B(`
tarik: Aylardır arızalıydı. Selim ilgilenmedi; para istedi, “bütçe” dedi. Bir yedek cihazı için iki bin dolar. Ben size söyleyeyim, o cihaz bahaneydi.
tarik: Gitmeden önce de bozup gitmiştir belki. Bilemem. Ben teknik adam değilim.
~ “Aylardır arızalıydı.” Şikâyette de aynı cümle var. Kelimesi kelimesine.
`),
    }),
    option('TQ_SIGORTA', '“Şirketin siber sigortası var mı?”', {
      score: { SORGULAMA: 10 },
      responses: B(`
tarik: Var tabii; her şirketin var. Ama ben o işlerle ilgilenmem; mali işler bakar. Zaten olaydan sonra konuştuk, eksik olmasın.
> Ayağa kalktı. Pencereye yürüdü. Dokuma salonunun çatısına baktı.
tarik: Evladım, sizin de işiniz bu; anlıyorum. Ama o çocuğu savunurken bu şirketin üç yüz işçisini de düşünün. Siparişsiz kalırsak onlar ne yapacak?
~ Üç yüz işçi. Bir tutanak. Bir sigorta “olaydan sonra.” Çayımı bitirmeden kalktım.
`),
    }),
    back('TARIK_BITIR', 'Teşekkür et, ayrıl'),
  ],
});

export const invPeople: CasePart = {
  nodes: [gorusmeGiris, gorusme, tYasar, tYasarKarar, tHakan, tBulent, tTarik],
};
