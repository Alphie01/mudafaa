import {
  any,
  back,
  cmp,
  conversation,
  costOf,
  dec,
  decisionNode,
  discover,
  flag,
  flags,
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

// 52-investigation-kisiler: büroda Orhan’la görüşme (konu × ton; bulgularla açılan konular), Hayri Bey, Melek ve
// müdür yardımcısı Ercan Tunalı ziyaretleri.

const toneEffects = {
  soft: [inc('trust', 4), set('tone', 'soft')],
  hard: [dec('trust', 8), set('tone', 'hard')],
};

const lowTrust: Cond = cmp(v('trust'), '<', 40);

const gorusme = interview('INV_GORUSME', {
  ...INV,
  title: 'Müvekkil görüşmesi',
  hud: ['min', 'trust'],
  background: 'buro',
  room: { label: 'ARSLAN HUKUK · TOPLANTI ODASI', character: 'orhan' },
  onEnter: [ifThen(cmp({ visits: 'INV_GORUSME' }, '>', 1), [set('min', 8)])],
  lines: [
    W(
      cmp({ visits: 'INV_GORUSME' }, '==', 1),
      `
> Leyla’nın bir sonraki randevusuna on dört dakika var. Orhan masanın kenarına oturdu; sandalyenin tamamına oturmak bir hak iddia etmekmiş gibi.
`,
    ),
    O(`
> Leyla’nın randevusuna sekiz dakika var. Orhan bu kez hırkasının düğmelerini iliklemişti; hepsini, en üsttekine kadar.
`),
  ],
  tones: [
    { id: 'soft', label: 'Yumuşak', hint: '+4 güven' },
    { id: 'hard', label: 'Sert', hint: '−8 güven · daha kısa, daha keskin' },
  ],
  toneEffects,
  moodRules: [
    mood('Utanıyor', 'neutral', 'uzgun', flag('fact_zarf')),
    mood('Kapanmış', 'error', 'kizgin', lowTrust),
    mood('Gergin', 'neutral', 'kizgin', cmp(v('tone'), '==', 'hard')),
    mood('Resmî', 'neutral', 'normal'),
  ],
  objectives: [
    {
      id: 'obj_aksam',
      when: flag('fact_aksam'),
      known: '17.00’de kasayı sayıp teslim ediyor, 17.10’da çıkıyordu.',
      unknown: 'O akşamlar ne yapıyordu?',
    },
    {
      id: 'obj_sifre',
      when: flag('fact_zarf'),
      known: 'Şifresini mühürlü zarfa koyup müdürlüğe verdi.',
      unknown: 'Şifresini başka biri biliyor muydu?',
    },
    {
      id: 'obj_teslim',
      when: flag('fact_imza_bos'),
      known: '“Teslim alan” kısmı sonradan imzalanıyordu.',
      unknown: 'Para kimin eline geçiyordu?',
    },
    {
      id: 'obj_kredi',
      when: flag('fact_kredi'),
      known: 'Kredi, tarlanın satışıyla kapandı.',
      unknown: 'Kredi nasıl kapandı?',
    },
  ],
  topics: [
    topic('TP_AKSAM', 'O akşamlar', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 20 },
      effects: [raise('fact_aksam')],
      tones: {
        soft: {
          prompt: 'Bir iptal gününü baştan anlatır mısınız? Vezne kapandıktan sonra ne olurdu?',
          responses: [
            W(
              lowTrust,
              `
orhan/kizgin: Anlattım efendim. Müfettişe anlattım, savcıya anlattım. Kimse yazmadı. Siz de yazmayacaksınız.
~ Kapı kapalı. Kapalı kapılar kırılmaz; anahtarı aranır.
`,
            ),
            O(`
orhan: Saat beşte kapı kapanır efendim. Son mükellefi çıkarırım, kasayı sayarım. Banknotları cinsine göre, bozuklukları rulo rulo. Gün sonu raporunu bastırırım.
orhan: Rapordaki rakamla saydığım rakam tutarsa tutanağı doldururum. Torbaları mühürlerim. Bir nüshası bende kalır; karbonlu kâğıt, sarı.
orhan: Sonra deftere yazarım. Kendi defterime. On dokuz yıldır. Nazan güler, “devlet sana yetmiyor mu” der. Yetmiyor efendim. Devletin kâğıdı kaybolur.
- Torbaları kime teslim ederdiniz?
orhan: Müdür Bey’e. Rıfat Bey ocakta rahatsızlandı, raporlu. O zamandan beri müdür yardımcımız alırdı. Kasaya o koyardı.
orhan: Beşi on geçe turnikeden çıkarım. Servis beş on beşte kalkar. Kaçırırsam bir saat beklerim; Elif’in ilacı var, beklemem.
~ Bir adamın akşamı, dakikası dakikasına. Bu kadar düzenli bir hayatın içinde kırk yedi delik var.
`),
          ],
        },
        hard: {
          prompt: 'Saat saat. Beşten sonra neredeydiniz?',
          responses: [
            O(`
orhan/kizgin: Beşte kasa. Beşi on geçe turnike. Beş on beşte servis. Altıda ev. Saat saat istediniz, saat saat söyledim.
orhan: Her akşam aynı efendim. Bir akşam bile değişmedi. Belki de suçum bu; o kadar aynıydım ki, kimse bakmadı.
~ Cevap tam ama kısa. Kasanın kime teslim edildiğini söylemedi; ben de sormadım. Sert sorunun bedeli, sorulmayan ikinci soru.
`),
          ],
        },
      },
    }),
    topic('TP_KREDI', 'Kredi', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 20 },
      effects: [raise('fact_kredi')],
      tones: {
        soft: {
          prompt: 'Savcı krediyi “sebep” sayıyor. Kredinin hikâyesini anlatır mısınız?',
          says: T(`
orhan/uzgun: Elif’in kalbi efendim. Doğuştan bir delik. On yedi yaşına kadar ilaçla idare ettik, geçen bahar ameliyat dediler. Özel hastane; devletin sırası altı ay.
orhan: İki yüz on iki bin lira çektim. Altmış ay vade. Her ay faizini hesapladım; çıkmıyordu, ama çıkacaktı.
orhan: Aralıkta babamdan kalan tarlayı sattım. İnegöl’de, Tahtaköprü’de. Dört dönüm. Kardeşlerim payını bana bıraktı, “Elif için” dediler.
orhan: Parası ertesi gün hesaba geçti, krediyi kapattım. Faiz yemek günahtır efendim; vermek de.
- Tapu belgesi duruyor mu?
orhan: Evde efendim. Çalışma masamda, şeffaf dosyada. Nazan her kâğıdı saklar, ben her kâğıdı dosyalarım. İkimiz bir arşiviz.
~ Savcılığın “kaynağı belirsiz” dediği para, bir tarlanın dört dönümü. Bir belge kadar uzakta.
`),
        },
        hard: {
          prompt: 'Borcunuz vardı, krediyi bir anda kapattınız. Para nereden?',
          says: T(`
orhan/kizgin: Babamın tarlasından efendim! Rahmetlinin alın terinden! Siz de mi savcı gibi soruyorsunuz?
orhan: Belediyede herkes biliyordu kredimi. Ben kimseye söylemedim; ama herkes biliyordu. Kim yaydıysa, o da bilsin: borcumu tarlayla ödedim.
~ Sert soru, sert cevap. Ama içinden bir kırıntı düştü: kimseye söylemediği bir borcu herkes biliyormuş.
`),
          effects: [raise('fact_borc_soylenti')],
        },
      },
    }),
    topic('TP_ERCAN', 'Müdür yardımcısı', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 10 },
      tones: {
        soft: {
          prompt: 'Ercan Bey nasıl bir amirdir?',
          says: T(`
orhan: İyi adamdır efendim. Kibar adamdır. Babası da maliyeciymiş, rahmetli; her fırsatta söyler. Odasında fotoğrafı asılı.
orhan: Bayramlarda veznedarlara çikolata dağıtır. Elif ameliyat olunca hastaneye çiçek gönderdi. Kart da yazdı: “Geçmiş olsun, kızımız.”
orhan: Görevden uzaklaştırma yazısını da o verdi. İki eliyle. Üzgündü. Ben de ona üzüldüm, böyle bir yazıyı vermek zordur.
~ Kendi uzaklaştırma yazısını verene üzülen bir adam. Ya çok iyi bir insan, ya da üzülmeyi kendine yasak saymış biri.
`),
        },
        hard: {
          prompt: 'Amirinizle aranızda bir sorun var mıydı?',
          says: T(`
orhan/kizgin: Amirim hakkında konuşmam efendim. On dokuz yılda bir amirim hakkında konuşmadım; şimdi de konuşmam.
~ Sadakat mı, korku mu, alışkanlık mı? Orhan’da üçü aynı yüzle duruyor.
`),
        },
      },
    }),
    topic('TP_MELEK', 'Yan vezne', {
      cost: costOf('min', 2),
      score: { SORGULAMA: 10 },
      tones: {
        soft: {
          prompt: 'Vezne 1’deki Melek Hanım’ı anlatır mısınız?',
          says: T(`
orhan: Melek Hanım on bir yıldır yanımdadır. İyi kızdır efendim. Ağzı biraz bozuktur, mükellefle kavga eder, sonra ona çay ısmarlar.
orhan: Geçen kış araba aldı, beyaz. Kredisiyle; kendi söyledi. Şimdi herkes ona bakıyor, biliyorum. Bana bakıldığı gibi.
orhan: Savcılıkta “bir şey bilmiyorum” demiş. Haklı. Ne bilecek? Ben bilmiyorum, o mu bilecek?
~ Orhan, kendisine yöneltilen şüphenin bir başkasına kaymasını istemiyor. Bu da bir bilgi.
`),
        },
        hard: {
          prompt: 'Melek Hanım’ın kullanıcı adıyla da iptal yapılmış olabilir mi?',
          says: T(`
orhan/kizgin: Onun kullanıcısıyla iptal yok efendim. Kırk yedisi benimkiyle. Kızcağızı bu işe karıştırmayın.
~ Hızlı bir savunma. Birini korumak için mi, yoksa hepsini?
`),
        },
      },
    }),
    topic('TP_SIFRE', 'Şifre', {
      cost: costOf('min', 2),
      visibleWhen: any(has('ev_talimat'), has('clue_yonerge')),
      score: { SORGULAMA: 40 },
      effects: [raise('fact_zarf'), score('ARASTIRMA', 60)],
      tones: {
        soft: {
          prompt: 'İlk gece “şifre kişiye özeldir” dediniz. Bana yönetmeliği değil, ne olduğunu anlatın.',
          responses: [
            W(
              has('ev_talimat'),
              `
> Kareli kâğıdı masaya koydum. Orhan ona uzun uzun baktı. Sonra gözlüğünü çıkardı ve bu kez silmedi; masanın üstüne, kâğıdın yanına bıraktı.
orhan/uzgun: Bunu nerede buldunuz efendim? Ben… ben bunu bordroların arasına koymuştum. Unutmuşum. Unutmak istemişim.
orhan: Eylülde bir sabah geldi bu not. Masamızın üstüne, her birimize bir tane. “Devamlılık için.” Biri hastalanırsa, izne çıkarsa kasa kilitli kalmasın diye.
orhan: Herkes verdi efendim. Ben de verdim. Şifremi bir kâğıda yazdım, zarfa koydum, mühürledim, imzaladım. Müdürlüğe bıraktım.
orhan: Yönergeyi biliyordum. Panoda asılı; her sabah önünden geçiyordum. Bile bile verdim. Amirim istedi, verdim. On dokuz yılda bir amirime hayır demedim.
~ “Utanıyorum” dediği şey buydu. Kırk yedi iptal değil. Bir zarf.
`,
            ),
            O(`
> Yönergenin fotoğrafını telefonumdan gösterdim. Madde 7. “Zarfa konmaz.” Orhan ekrana baktı, sonra pencereye.
orhan/uzgun: Bu yönergeyi biliyorum efendim. Panoda asılı. Her sabah önünden geçerdim.
orhan: Eylülde bir not geldi. Hepimizden şifremizi istediler. Zarfa koyduk, mühürledik. Müdürlüğe verdik. Devamlılık için dediler.
orhan: Bile bile verdim. Amirim istedi. On dokuz yılda bir amirime hayır demedim. Söyleyemedim size. Utandım.
~ Bir zarf. Kırk yedi iptalin anahtarı bir zarfta olabilir. Ama o zarf kimin elindeydi?
`),
          ],
        },
        hard: {
          prompt: 'Şifrenizi kime verdiniz? Bu sefer yönetmelik okumayın.',
          says: T(`
orhan/kizgin: Verdim! Herkes verdi! Zarfa koyduk, müdürlüğe bıraktık! Not geldi, “devamlılık için” dediler!
orhan: Yönergeyi biliyordum, evet. Bile bile verdim. Şimdi bunu da mı mahkemede söyleyeceğim? Bir de bu mu yazılacak hakkımda?
> Sesi kırıldı. Elleri masanın altına indi.
~ Bilgiyi aldım. Bedelini de ödedim: bu adam bundan sonra bana bir şey anlatırken önce sesimi tartacak.
`),
        },
      },
    }),
    topic('TP_9OCAK', '9 Ocak', {
      cost: costOf('min', 2),
      visibleWhen: any(has('clue_izin'), flag('fact_9ocak')),
      score: { SORGULAMA: 20 },
      effects: [raise('fact_9ocak_orhan')],
      tones: {
        soft: {
          prompt: '9 Ocak’ta neredeydiniz?',
          says: T(`
orhan: Hastanede efendim. Elif’in kontrolü vardı, Uludağ’da, çocuk kardiyolojide. Bir gün izin aldım; yıllık izinden düşüldü.
orhan: Sabah onda girdik, akşam beşte çıktık. Ekokardiyografi, kan, bir de profesör bey geç geldi. Elif sıkıldı, kantinde tost yedik.
orhan: O akşam belediyenin yanından bile geçmedim. Eve gittik, Nazan mantı yapmıştı. Elif “artık koşabilir miyim” diye sordu. Doktor “koşabilirsin” demiş.
~ O akşam saat 17.46’da Orhan’ın kullanıcı adı ön odadaki bilgisayarda çalışıyordu. Orhan bir mantı tabağının başındaydı.
`),
        },
        hard: {
          prompt: '9 Ocak akşamı kullanıcınızla iki iptal var. İzindeydiniz. Açıklayın.',
          says: T(`
orhan/saskin: İki iptal mi? O gün mü? Ben hastanedeydim efendim! Elif’in kontrolü!
orhan: Ben o gün belediyeye girmedim bile. Kartım bende, turnikeye bakın. Bakmamışlar mı? Kimse bakmamış mı?
~ Kimse bakmamış. Bu dosyanın en sık tekrarlanan cümlesi bu olacak.
`),
        },
      },
    }),
    topic('TP_TESLIM', 'Teslim alan', {
      cost: costOf('min', 2),
      visibleWhen: has('ev_karbon'),
      score: { SORGULAMA: 30 },
      effects: [raise('fact_imza_bos'), score('ARASTIRMA', 40)],
      tones: {
        soft: {
          prompt: 'Karbon kopyalarda “teslim alan” kısmı boş. Neden?',
          says: T(`
orhan: Teslim alan sonra imzalardı efendim. Torbaları alır, “siz gidin Orhan Bey, servisi kaçırmayın, ben sonra imzalarım” derdi.
orhan: Ben de giderdim. Sarı nüshayı alır, çantama koyardım. Ertesi sabah asıl tutanak dosyada imzalı dururdu.
- Torbaları alan kimdi?
orhan: Müdür raporluyken Ercan Bey. Ocaktan beri. Kasım ve aralıkta da müdür bey çoğu akşam erken çıkıyordu; yine Ercan Bey alırdı.
orhan: İyilik yapıyordu efendim. Servisi kaçırmayayım diye. Elif’in ilacı var, biliyordu.
~ Torbalar teslim edilirken imza atılmıyor. İmza sonra, kimse yokken atılıyor. O aradaki zaman kime aitti?
`),
        },
        hard: {
          prompt: 'İmzasız bir teslim, teslim değildir. Neden kimseye imzalatmadınız?',
          says: T(`
orhan/kizgin: Amirime “imzala” mı diyecektim efendim? Torbayı elinden çekip “önce imza” mı diyecektim?
orhan: “Sonra imzalarım” dedi. Ben de gittim. Her akşam. Servisi kaçırmamak için. Şimdi bu da mı benim suçum?
~ Belki değil. Ama heyet bunu soracak. Cevabı şimdiden bilmem gerek.
`),
        },
      },
    }),
    topic('TP_14OCAK', '14 Ocak sabahı', {
      cost: costOf('min', 2),
      visibleWhen: flag('fact_zarf'),
      score: { SORGULAMA: 30 },
      effects: [raise('fact_14ocak')],
      tones: {
        soft: {
          prompt: 'Zarftan sonra şifrenizle ilgili tuhaf bir şey oldu mu?',
          says: T(`
orhan: Bir sabah… evet. Ocakta. 15’iydi galiba. Sabah girdim, şifrem çalışmadı. “Hatalı” dedi. Üç kere denedim, kilitlendi.
orhan: Bilgi işleme telefon ettim. Burak Bey geldi, genç bir çocuk, enerji içeceğiyle. Sıfırladı. “Dün akşam da sıfırlamıştık abi” dedi. Ben anlamadım.
orhan: Öğleden sonra yeni şifreyi yine zarfa koydum. “Zarfı yenile” dediler. Yeniledim. Yine bile bile.
~ Bir şifre bir akşam sıfırlanıyor, ertesi sabah sahibi kapıda kalıyor. Arada bir gece var. O gecenin kaydı bir yerde olmalı.
`),
        },
        hard: {
          prompt: 'Şifreniz hiç sıfırlandı mı? Ne zaman, kim yaptı?',
          says: T(`
orhan/kizgin: Sıfırlandı. Ocakta. Bilgi işlemden Burak Bey yaptı. Ben istedim, çünkü çalışmıyordu. Ne var bunda?
orhan: “Dün akşam da sıfırlamıştık” dedi. Kim istediyse onu sorun. Ben istemedim.
~ Sert ton, aynı kırıntı: biri, sahibinden önce, bir akşam o şifreyi sıfırlatmış.
`),
        },
      },
    }),
  ],
  finish: { id: 'G_BITIR' },
});

const gorusmeGiris = decisionNode('INV_GORUSME_G', [{ to: 'INV_GORUSME' }], {
  ...INV,
  title: 'Müvekkil görüşmesi',
  lines: [
    W(
      cmp({ visits: 'INV_GORUSME' }, '==', 0),
      `
# ARSLAN HUKUK — TOPLANTI ODASI [bg:buro]
> Orhan randevu saatinden yirmi dakika önce gelmiş, merdivenin başında beklemişti. Asistanın uzattığı çayı “zahmet olmasın” diye geri çevirmiş, sonra ayıp olmasın diye almıştı.
> Masanın üstünde bir dosya açtı: kendi hazırladığı, sekmeli, renkli. “Belgeler 1–14.” Her sayfa naylon poşette.
orhan: Ne lazımsa efendim. Hepsini sırayla getirdim. Bir tek… bir tek bazı şeyler evde kaldı.
~ “Bazı şeyler.” Hangileri, diye sormadım. Orhan Kılıç’a soru sormanın bir sırası var; o sırayı bulmam lazım.
`,
    ),
    O(`
# ARSLAN HUKUK — TOPLANTI ODASI [bg:buro]
> Orhan aynı sandalyenin aynı kenarına oturdu. Dosyası yine yanında, bu kez bir sayfa fazla.
orhan: Bir şey mi buldunuz efendim? Nazan “avukat bir şey bulmuş” dedi; yüzünüzden anlamış, kapıda.
`),
  ],
});

// --- Tanıklar ---

const tHayri = conversation('INV_T_HAYRI', {
  ...INV,
  title: 'Hayri Özdemir',
  eyebrow: 'TANIKLAR',
  background: 'ev',
  room: { label: 'SETBAŞI · HAYRİ BEY’İN SALONU', character: 'hayri' },
  lines: B(`
# CUMA 15.30 — SETBAŞI, HAYRİ ÖZDEMİR’İN EVİ [bg:ev]
> Salonun duvarları kitapla örülmüştü; kitaplar duvar değil, duvar kitap gibiydi. Pencerenin önünde bir Osmanlı haritası, köşede üst üste on iki ayakkabı kutusu.
> Hayri Bey kapıyı kravatla açtı. Evinde. Cuma öğleden sonrası.
hayri: Avukat hanım. Buyurun. Ayakkabılarınızı çıkarmayın, halı Türk malı değil, İran. Dayanıklıdır.
hayri: Önce bir şey söyleyeyim, sonra sorun. Ben bu adamı suçlamak için gelmedim. Hesabımı sormaya geldim. Bu ikisi aynı şey değildir; Türkçede de değildir, hukukta da.
hayri: Kırk yıl tarih öğrettim. Tarih nedir? Makbuzu saklayanların yazdığı şeydir. Ben makbuzumu sakladım; tarih benim lehime.
~ Ukala, titiz, sevimli. Böyle tanıklar kürsüde ya altın olur ya baş ağrısı.
`),
  choices: [
    option('HQ_ODEME', '“12 Şubat’ı anlatır mısınız?”', {
      score: { SORGULAMA: 30 },
      discovers: 'ev_makbuz',
      responses: B(`
hayri: Saat 16.40. Biliyorum, çünkü vezneye girerken saatime baktım; kapanmadan yetişeyim diye. Emlak vergisi, ikinci taksit. Altı bin sekiz yüz elli lira.
> Kutulardan birini açtı. Makbuzlar tarih sırasıyla, lastikle gruplanmış. Birini, bir kâğıt para gibi iki parmağıyla çekti.
hayri: Buyurun. Sıfır sıfır iki yedi yedi bir dokuz. Vezne 2. Kaşe, imza, saat. Bu devirde makbuz basan makine bile saat yazıyor; insanlar yazmıyor.
~ 16.40’ta ödeme. 17.47’de iptal. Arada bir saat yedi dakika ve bir kapanmış vezne.
`),
    }),
    option('HQ_VEZNEDAR', '“Veznedar parayı nasıl aldı?”', {
      score: { SORGULAMA: 20 },
      responses: B(`
hayri: İki kez saydı. Önce eliyle, sonra makineyle. Sonra bana “bir de siz sayın efendim” dedi. Bu devirde iki kez sayan adam az.
hayri: Bir de makbuzu verirken kalktı. Ayağa. Bir memur ayağa kalktı, yetmiş bir yaşında bir adama makbuz verirken. Bunu unutmam.
~ Hırsızlar genellikle parayı iki kez saymaz. Ama bu bir delil değil; bir karakter tanıklığı. Heyet ikisini ayırır.
`),
    }),
    option('HQ_ERTESI', '“4 Mart’ta, itirazınızdan sonra ne oldu?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('fact_hayri_dosya')],
      responses: B(`
hayri: Müdür yardımcısı bey çok kibardı. Çay söyledi, odasına aldı. Dosyamı kendisi aldı, fotokopimi kendisi çekti. “Siz yorulmayın” dedi.
hayri: Ertesi gün aradılar, “haklısınız Hayri Bey, sistem hatası” dediler. Bir hafta sonra gazetede okudum: zimmet, veznedar, gözaltı.
hayri: Sistem hatası mı, zimmet mi? İkisi aynı anda olamaz. Ya biri yanlış söyledi ya ikisi. Tarihte böyle anlar çoktur; herkes doğruyu söyler, sonuç yanlış çıkar.
~ İlk gün “sistem hatası”, bir hafta sonra “zimmet”. Bir dosyanın adı bir haftada değişmiş.
`),
    }),
    option('HQ_KANAAT', '“Sizce Orhan Bey suçlu mu?”', {
      score: { SORGULAMA: -20 },
      bad: 'Tanığa kanaatini sordun; tanık gördüğünü anlatır, hüküm kurmaz. Bu cevap mahkemede bir şey ifade etmez (CMK 217 takdiri heyetindir).',
      category: 'SORGULAMA',
      responses: B(`
hayri: Hanımefendi, siz avukatsınız. Ben tanığım. Bana kanaat sormayın; bana saat sorun, para sorun, makbuz sorun.
hayri: Kanaat sorarsanız, size bir kanaat söylerim, ertesi gün başka bir kanaat söylerim. Tarih böyle bozulur. Belge sorun.
~ Bir emekli öğretmenden ders yedim. Hak ettim.
`),
    }),
    back('HAYRI_BITIR', 'Teşekkür et, ayrıl'),
  ],
});

const tMelek = conversation('INV_T_MELEK', {
  ...INV,
  title: 'Melek Yavuz',
  eyebrow: 'TANIKLAR',
  background: 'cay_ocagi',
  room: { label: 'BELEDİYE · ÇAY OCAĞI', character: 'melek' },
  onFirstEnter: [meet('melek')],
  lines: B(`
# CUMARTESİ 12.15 — HİSARÖNÜ BELEDİYESİ, ÇAY OCAĞI [bg:cay_ocagi]
> Çay ocağı merdiven altına sıkıştırılmış bir oda: iki tüp, bir semaver, duvarda bir takvim, bir de tuzluk gibi duran küçük bir televizyon.
> Melek Yavuz sakız çiğneyerek telefonuna bakıyordu. Beni görünce telefonu kapatmadı; ekranı aşağı çevirdi.
melek: Avukat mısın canım? Orhan abinin? Ben savcılığa her şeyi söyledim. Yani hiçbir şeyi; çünkü bir şey bilmiyorum.
melek: Çay? Ocakçı Rıza abi yok, ben demlerim. Demim acıdır, ona göre.
> Çayı iki bardağa doldurdu, birini bana itti, ötekini avucunun içinde tuttu; içmedi.
~ Her soruya soruyla cevap verecek. Böylelerine cevaptan çok, soruları dinlemek gerekir.
`),
  choices: [
    option('MQ_ORHAN', '“Orhan Bey’le on bir yıl yan yana çalıştınız.”', {
      score: { SORGULAMA: 20 },
      responses: B(`
melek: On bir buçuk. Ne olmuş? Orhan abi iyi adam. Herkes biliyor. Bir kuruş eksik vermez, bir kuruş fazla almaz. Sıkıcı derecede dürüst.
melek: Bir keresinde bir mükellef ona yüz lira bahşiş bıraktı; adamın peşinden otobüs durağına kadar koştu. Rezil oldu mahalleye.
melek: Şimdi herkes “ne kadar da sessizdi, belli değil miydi” diyor. Sessizdi çünkü sessiz. Ne belli olacak?
`),
    }),
    option('MQ_ZARF', '“Müdürlükte şifreler zarfta mı duruyordu?”', {
      visibleWhen: any(has('ev_talimat'), has('clue_yonerge'), flag('fact_zarf')),
      score: { SORGULAMA: 20 },
      effects: [raise('melek_zarf_inkar')],
      responses: B(`
> Sakız durdu. Bir saniye. Sonra yeniden başladı; biraz daha hızlı.
melek: Ne zarfı canım? Biz düğün mü yapıyoruz, zarf zarf? Şifre kişiye özeldir. Panoda yazıyor, okumadın mı?
melek: Bak, ben kimsenin şifresini bilmem. Benimkini de kimse bilmez. Bu kadar.
> Bardağı tezgâha bıraktı. Bırakırken çay taştı; silmedi.
~ Çok hızlı bir “hayır”. Hızlı “hayır”lar genellikle uzun bir “evet”in üstüne örtülmüş bir çarşaftır.
`),
    }),
    option('MQ_AMIR', '“Fazla mesainizi kim onaylıyor?”', {
      score: { SORGULAMA: 30 },
      effects: [raise('fact_melek_korku')],
      responses: B(`
melek: Ne alaka? Müdür yardımcısı. Ercan Bey. Müdür raporlu, her şeyi o imzalıyor. Mesaiyi, izni, görev yerini.
melek: Geçen yıl arşive bir kızı sürdüler, bodruma. Rutubetten astım oldu. Bir imzayla olur o iş canım.
> Bunu söylerken kapıya baktı. Kapı kapalıydı.
~ Bir imzayla bodruma. Melek’in korkusunun bir adresi var; adresi söylemedi, kapıya baktı.
`),
    }),
    option('MQ_BASKI', '“Doğruyu söylemezseniz siz de içeri girersiniz.”', {
      score: { SORGULAMA: -40 },
      effects: [inc('ethics'), raise('melek_kirgin')],
      bad: 'Tanık olacak birini tehdit ettin: tanığı etkileme girişimi (TCK 277) ve meslek kurallarına aykırılık (Av.K. 34). Melek bundan sonra sana kapalı.',
      category: 'SORGULAMA',
      responses: B(`
- Doğruyu söylemezseniz siz de içeri girersiniz Melek Hanım. Bu dosyada sizin de adınız var.
melek/kizgin: Beni mi tehdit ediyorsun? Sen kimsin? Savcı mısın? Avukat değil misin sen?
> Çay bardağını lavaboya bıraktı; bardak kırılmadı ama ses çıkardı. {shake}
melek: Bir daha gelirsen güvenlik çağırırım. Bir de savcılığa yazarım, avukat beni tehdit etti diye. Yazarım canım, bilirim yazmayı.
~ Bir tanığı kapıdan kovdurmanın en kısa yolu. Ve bir dilekçenin konusu olmanın.
`),
      next: '$return',
    }),
    option('MQ_BITIR', 'Kartını bırak, ayrıl', {
      effects: [discover('clue_araba'), score('ARASTIRMA', 10)],
      responses: B(`
- Kartımı bırakıyorum Melek Hanım. Bir şey hatırlarsanız, ya da konuşmak isterseniz.
melek: Hatırlayacak bir şey yok canım. Ama bırak, dursun.
> Merdivenlerden birlikte çıktık. Otoparkta Melek anahtarını çıkardı; beyaz, yeni, kapı kenarlarındaki naylonları bile sökülmemiş bir araba iki kez öttü.
melek: Kredisiyle aldım, merak ettiysen. Altmış ay. Herkes merak ediyor, sen de et.
~ Kimse sormadan cevap veriyor. Bu dosyada herkes, sorulmayan bir soruya cevap hazırlamış.
`),
      next: '$return',
    }),
  ],
});

const tErcan = conversation('INV_T_ERCAN', {
  ...INV,
  title: 'Ercan Tunalı',
  eyebrow: 'TANIKLAR',
  background: 'buro',
  room: { label: 'MALİ HİZMETLER · MÜDÜR YARDIMCILIĞI', character: 'ercan' },
  onFirstEnter: [meet('ercan'), raise('ercan_ziyaret')],
  lines: B(`
# PAZARTESİ 10.00 — MALİ HİZMETLER MÜDÜR YARDIMCILIĞI [bg:buro]
> Oda dar ama düzenliydi: dosyalar renk sırasıyla, masada bir dolma kalem, bir ince belli bardak, bir de çerçeve. Çerçevede siyah-beyaz, kravatlı, ciddi bir adam.
> Ercan Tunalı ayağa kalktı, elimi iki eliyle sıktı. Avucu kuru ve sıcaktı.
ercan: Avukat hanım, hoş geldiniz efendim. Buyurun. Çay? Bizim ocağın çayı iyidir; Rize’den bir arkadaş gönderiyor.
ercan: Orhan Bey için ne lazımsa efendim. On dokuz yıldır tanırım. Kızının ameliyatında hastaneye çiçek göndermiştim. Bu iş beni de yıktı, inanın.
> Çerçeveye baktığımı fark etti.
ercan: Rahmetli babam. O da maliyeciydi; kırk yıl. Bana bir şey öğretti: “Kâğıt neyse, odur.” Ben de öyle çalışırım efendim. Mevzuat ne diyorsa.
> Dolma kalemini parmaklarının arasında çevirdi; kapağını açıp kapattı. Tık. Tık.
~ Kusursuz bir nezaket. Bu odada bir tek o kalem sabırsız.
`),
  choices: [
    option('EQ_SISTEM', '“Vezne programına nereden girilebiliyor?”', {
      score: { SORGULAMA: 20 },
      effects: [raise('ercan_sistem')],
      responses: B(`
ercan: Yalnızca vezne terminalinden efendim. Her veznedarın kendi terminali, kendi kullanıcı adı, kendi şifresi. Sistem böyle kurulu.
ercan: Bilgi işlem böyle söyledi bize, mevzuat da böyle. Başka türlüsü güvenlik açığı olurdu; biz de açığa izin vermeyiz.
~ Kendinden emin. Bunu bir uzman da söylese daha rahat ederdim; bir müdür yardımcısı söyleyince bir not düşüyorum.
`),
    }),
    option('EQ_TESLIM', '“Akşamları kasayı kim teslim alıyordu?”', {
      score: { SORGULAMA: 30 },
      effects: [raise('fact_ercan_teslim')],
      responses: B(`
ercan: Müdürümüz Rıfat Bey raporluyken ben efendim. Ocak başından beri. Veznedar sayar, torbaları mühürler, bana verir; ben kasa odasına koyarım.
ercan: Tutanaklar dosyada efendim, hepsi imzalı. Kâğıt neyse odur. Bir eksik olsa ben fark ederdim; mühürlü torba açılmaz.
- Tutanakları teslim anında mı imzalıyordunuz?
ercan: Elbette efendim. Usul böyle.
> Kalem bir kez tıkladı. Sonra durdu.
~ “Elbette.” Bir kelimenin içine ne kadar kesinlik sığarsa, o kadar dikkat ister.
`),
    }),
    option('EQ_ZARF', '“Şifrelerin zarflarda toplandığını duydum.”', {
      visibleWhen: any(has('ev_talimat'), flag('fact_zarf'), has('clue_yonerge')),
      score: { SORGULAMA: 20 },
      effects: [raise('ercan_zarf_inkar')],
      responses: B(`
ercan: Zarf mı efendim? Öyle bir uygulama bizde olmaz. Yönerge ortada; panoda asılı. Şifre kişiye özeldir, paylaşılmaz.
ercan: Biri size yanlış bilgi vermiş. Belki iyi niyetle. İnsanlar böyle zamanlarda bir şeyler hatırladığını sanır.
> Gülümsedi. Kibar, sabırlı, bir öğretmenin yanlış cevap veren öğrenciye gülümsemesi gibi.
~ Cebimde katlanmış bir kâğıt var. Henüz çıkarmadım. Kâğıt, kürsüde daha ağır çeker.
`),
    }),
    option('EQ_ORHAN', '“Orhan Bey’in son aylarda bir sıkıntısı var mıydı?”', {
      score: { SORGULAMA: 10 },
      effects: [discover('clue_araba'), score('ARASTIRMA', 10)],
      responses: B(`
ercan: Söylemek istemezdim efendim. Kredisi vardı; kızının ameliyatı. Biliyorsunuz. Bir anda kapattı, ben de şaşırdım. Ama ben kimsenin cebine bakmam.
ercan: Herkesin bir derdi var efendim. Melek Hanım da yeni araba aldı; söylemek istemezdim, öyle bir ima da yapmam. Ama siz sordunuz, ben de söylüyorum.
~ Söylemek istemediği iki şeyi, sormadığım hâlde söyledi. Nezaket bazen bir işaret parmağı taşır.
`),
    }),
    back('ERCAN_BITIR', 'Teşekkür et, ayrıl'),
  ],
});

export const invPeople: CasePart = {
  variables: flags(
    'fact_aksam',
    'fact_kredi',
    'fact_borc_soylenti',
    'fact_zarf',
    'fact_9ocak_orhan',
    'fact_imza_bos',
    'fact_14ocak',
    'fact_hayri_dosya',
    'melek_zarf_inkar',
    'fact_melek_korku',
    'melek_kirgin',
    'ercan_ziyaret',
    'ercan_sistem',
    'fact_ercan_teslim',
    'ercan_zarf_inkar',
  ),
  nodes: [gorusmeGiris, gorusme, tHayri, tMelek, tErcan],
};
