import {
  all,
  always,
  any,
  because,
  cmp,
  finalAtLeast,
  flag,
  has,
  not,
  outcome,
  ref,
  v,
  xp,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { O, S, W } from './dsl.js';

// 90-outcomes: ETİK (tanığı etkileme / hukuka aykırı kayıt), 223/2-b beraat, 223/2-e beraat, görevi kötüye kullanma
// (farklı nitelendirme, HAGB), mahkûmiyet (varsayılan). Final eşikleri eşik çubuğunun `from` değerleriyle aynıdır.

export const T_GOREV = 3000;
export const T_BERAAT = 10000;
export const T_BERAAT_B = 12000;

const notCollapsed = not(flag('cokus'));
const gercekProven = any(
  flag('sinan_ifsa'),
  all(flag('bayram_ifsa'), any(has('ded_tek_kisi'), has('ded_zarf_kaynagi'))),
);

export const outcomes: CasePart = {
  outcomes: [
    outcome('ETIK', {
      class: 'CONVICTION',
      priority: 1,
      when: any(flag('illegal_used'), flag('tanik_etkileme'), cmp(v('ethics'), '>=', 2)),
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '3 yıl 4 ay hapis · hak yoksunlukları',
      verdictText:
        'Sanık Halil Ekinci’nin TCK 252/2 uyarınca alt sınırdan 4 yıl hapis cezası ile cezalandırılmasına; TCK 62/1 uyarınca 3 yıl 4 ay hapis cezasına; TCK 53/1 ve 53/5’teki hak yoksunluklarına; tutuklulukta geçen sürenin cezadan mahsubuna (TCK 63); el konulan 40.000 TL’nin Emniyet Müdürlüğüne iadesine; tanık beyanlarının müdafi tarafından yönlendirildiğinin anlaşılması nedeniyle karar örneğinin Bursa Barosuna ve Cumhuriyet Başsavcılığına gönderilmesine; hükmün gerekçesiyle tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Tanığın beyanının duruşmadan önce müdafi tarafından yönlendirildiği anlaşıldığından beyana itibar edilmemiştir (CMK 217/1).',
          flag('tanik_etkileme'),
        ),
        because(
          'Savunmanın sunduğu kayıt yetkisiz yoldan elde edildiğinden hükme esas alınmamıştır (Anayasa 38/6; CMK 206/2-a, 217/2).',
          flag('illegal_used'),
        ),
        because(
          'Muhbirin çelişkili beyanı ve el koyma tutanağı birlikte değerlendirilmiş; savunmanın iddiaları güvenilir delille desteklenememiştir.',
        ),
        because('Sanığın sabıkasızlığı ve uzun meslek hayatı takdiri indirim nedeni sayılmıştır (TCK 62/1).'),
      ],
      legalBasis: 'TCK 252/2, 53, 62/1, 63; Anayasa 38/6; CMK 206/2-a, 217, 273/1; TCK 277; Av.K. 34',
      xp: 0,
      howToReach:
        'Bir tanığa mahkemede ne söyleyeceğini dikte etmek ya da müvekkile yalan tavsiye edip başka etik sınırları aşmak. Bu sona ulaşmamak gerekir.',
      ethicsCard:
        'Tanığa ne söyleyeceğini, hele bir isim vererek, dikte etmek tanığı etkilemedir (TCK 277); tanık yalan tanıklığa sürüklenir (TCK 272). Müvekkile gerçeğe aykırı beyan tavsiye etmek ve şüphelileri izlemek de meslek kurallarına aykırıdır (Av.K. 34). Bu davada doğru yol, tanıkları kendi avukatlarına ve mahkemeye yönlendirmek, delili CMK 177 dilekçesiyle istemekti.',
      epilogue: [
        O(S`
          baskan: …karar örneğinin Bursa Barosuna gönderilmesine.
          - Başkan hükmü okurken bir an durdu, bana baktı; sonra okumaya devam etti. Halil ayakta duruyordu. Gözlüğü burnundaydı; çıkarmadı.
          - Zehra arka sırada bembeyazdı. Babasına değil, bana bakıyordu. Bir hemşirenin, yanlış ilacı veren doktora bakışı.
          = ARSLAN HUKUK · O GECE @buro_gece
          - Masamda bir kitap duruyordu. Avukatlık Kanunu. Leyla'nın eski, sayfa kenarları kıvrılmış nüshası. Otuz dördüncü madde, kurşun kalemle çizilmiş.
          - Leyla odasındaydı. Kapısı kapalıydı. Bir kez bile dışarı çıkmadı.
          ~ Bir zarfın hangi elden geldiğini bulmaya çalışırken, bir tanığın ağzına kendi elimle bir cümle koydum. Halil'in çekmecesine konan zarf gibi.
          ~ Yirmi yedi yıllık bir adamı kurallar ayakta tutuyordu. Ben bir kuralı bilerek çiğnedim. Bedelini o ödeyecek. !fade
        `),
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 2,
      when: all(
        notCollapsed,
        gercekProven,
        flag('gercek_fail'),
        ref('kayit_disi'),
        cmp(v('pers'), '>=', 7),
        finalAtLeast(T_BERAAT_B),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · tedbirler kalktı',
      verdictText:
        'Sanık Halil Ekinci’nin üzerine atılı rüşvet suçunu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; hakkındaki tutuklama ve adli kontrol tedbirlerinin kaldırılmasına; el konulan 40.000 TL’nin Emniyet Müdürlüğüne iadesine; hukuka aykırı elde edilen dinleme kayıtlarının hâkim denetiminde yok edilmesine (CMK 137/3); Sinan Kaplan ve Bayram Öz hakkında iftira ve diğer suçlar yönünden işlem yapılmak üzere dosya örneğinin Bursa Cumhuriyet Başsavcılığına gönderilmesine; sanığa tutuklu kaldığı süre için tazminat isteyebileceğinin bildirilmesine (CMK 141/1-a, 231/3); hükmün gerekçesiyle tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'İddianamenin dayandığı 9 ve 14 numaralı kayıtlar, kararda gösterilmeyen bir hattan ve kararın süresi dolduktan sonra alındığından hükme esas alınmamıştır (CMK 135/1, 135/4, 206/2-a, 217/2; Anayasa 38/6).',
        ),
        because(
          'Sanık, dahili 214’ten yapılan ve makamdan geldiği izlenimi verilen bir çağrıyla odasından uzaklaştırılmış; zarf çekmeceye sanık odada yokken konulmuştur.',
        ),
        because('Zarf, Devir Servisi-2’ye zimmetlenen destedendir.', has('ded_zarf_kaynagi')),
        because(
          'Tanık Bayram Öz zarfı sanığa değil, koridorda Sinan Kaplan’a verdiğini ve kayıt cihazını kendisinin durdurduğunu beyan etmiştir.',
          flag('bayram_ifsa'),
        ),
        because(
          'Tanık Sinan Kaplan’ın arşivde olduğu yönündeki beyanı çay ocağı kaydı ve santral dökümüyle çelişmiş; tanık, kendisini suçlayabilecek sorulara cevap vermekten çekinmiştir (CMK 48).',
          flag('sinan_ifsa'),
        ),
        because(
          'Paranın kolluk tarafından temin edildiği ve teslimatın kolluk planıyla kurulduğu anlaşılmış; muhbirin kolluğun talimatıyla hareket ettiği gözetilmiştir (AİHS 6).',
          flag('contra_k2'),
        ),
        because('Bu deliller birlikte değerlendirildiğinde suçun sanık tarafından işlenmediği sabittir.'),
      ],
      legalBasis: 'CMK 223/2-b; CMK 135, 137/3, 206/2-a, 217/2; Anayasa 38/6; AİHS 6; CMK 273/1',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Kayıtları kapsam dışı olarak ayıklat; zarfın sanık yokken çekmeceye girdiğini göster; santral, izin çizelgesi, zimmet defteri ve çay defteriyle Devir-2 memurunu kürsüde çöz; esas savunmada gerçek faili belgeyle göster.',
      epilogue: [
        O(S`
          baskan: Türk Milleti adına…
          - "Beraatine" kelimesi salona düştüğünde Halil hiçbir şey yapmadı. Ayakta durdu; hüküm ayakta dinlenir. Sonra gözlüğünü çıkardı ve ilk kez camlarını silmedi. Öylece tuttu.
          = ADLİYE MERDİVENLERİ · ÖĞLE @adliye
          - Yağmur dinmişti. Zehra babasının yanına geldi, gözlüğü elinden aldı, burnuna yerleştirdi. "Başının üstünde değil, burada" dedi. "Kural."
          - Merdivenin başında Muzaffer Usta iki ince belli bardakla bekliyordu. "Açık demli, şekersiz" dedi. "Saat on bir. Atlamayalım."
          halil: Usta. Yirmi yıl. Bir gün bile atlamadın.
          muzaffer: Sen de bir gün bile "günaydın"ı atlamadın, Halil Bey.
        `),
        W(
          flag('sinan_ifsa'),
          S`
            - Adliyenin önünde açık renk ceketli bir adam, iki sivil polisin arasında bir arabaya biniyordu. Bileğinde bir saat yeşil yandı, söndü. Kimse ona şemsiye tutmadı.
          `,
        ),
        O(S`
          = ARSLAN HUKUK · O GECE @buro_gece
          - Leyla odamın kapısında durdu. Elinde bir dosya vardı; eski, kapağı sararmış. Bir an onu bana uzatacak gibi oldu; sonra koltuğunun altına aldı.
          leyla: Kural adamlarını savunmak zordur, demiştim. Bir de şunu söyleyeyim: kural adamları, birinin onlara inandığını hiç unutmaz.
          - Masasındaki ters çerçeveye baktı. Çevirmedi. Ama bir parmağıyla kenarına dokundu, sanki birine "az kaldı" der gibi.
          ~ Bir zarf bir çekmeceye yirmi saniyede girdi. Çıkması yirmi bir gün sürdü. Ama çıktı. Ve bu sefer, kimin elinden geldiği yazılı.
          ~ Halil Pazartesi görevine dönmeyecek; önce bir ay izin. Sardunyayı sulayacak. Sonra masasına oturacak, takvimini yeni yaprağa çevirecek. !fade
          = Sinan Kaplan hakkında soruşturma başlatıldı. Ateşoğlu İnşaat’ın on bir dosyası yeniden incelemeye alındı.
        `),
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 3,
      when: all(notCollapsed, ref('kayit_disi'), ref('zarf_suphe'), cmp(v('pers'), '>=', 5), finalAtLeast(T_BERAAT)),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · tedbirler kalktı',
      verdictText:
        'Sanık Halil Ekinci’nin üzerine atılı rüşvet suçunu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; hakkındaki tutuklama ve adli kontrol tedbirlerinin kaldırılmasına; el konulan 40.000 TL’nin Emniyet Müdürlüğüne iadesine; hukuka aykırı elde edilen dinleme kayıtlarının hâkim denetiminde yok edilmesine (CMK 137/3); dosyanın bir örneğinin zarfı çekmeceye bırakanın belirlenmesi için Bursa Cumhuriyet Başsavcılığına gönderilmesine; sanığa tutuklu kaldığı süre için tazminat isteyebileceğinin bildirilmesine (CMK 141/1-a, 231/3); hükmün gerekçesiyle tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Kararın süresi dolduktan sonra alınan 14 numaralı kayıt hükme esas alınmamıştır (CMK 135/4, 206/2-a, 217/2; Anayasa 38/6).',
          any(flag('red_14'), flag('contra_k1')),
        ),
        because(
          'Sanığın hattı için verilmiş bir dinleme kararı bulunmadığından 9 numaralı kayıt hükme esas alınmamıştır (CMK 135/1, 135/9).',
          any(flag('red_9'), flag('contra_k5'), flag('obj_k5')),
        ),
        because(
          'El koyma tutanağının saatlerine göre zarf çekmeceye konulduğunda sanık odasında bulunmamaktadır.',
          any(flag('contra_k3'), flag('contra_b3')),
        ),
        because(
          'Muhbire takılan kayıt cihazının teknik arıza nedeniyle değil, fiziksel tuşla durdurulduğu bilirkişi raporuyla anlaşılmıştır.',
          flag('contra_b4'),
        ),
        because(
          'Muhbirin önce icbar, sonra anlaşma anlatan beyanları birbiriyle çelişmektedir; dosya sanığın görev alanında değildir.',
          any(flag('contra_b1'), flag('contra_b2')),
        ),
        because(
          'Paranın kolluk tarafından temin edildiği ve teslimatın kolluk planıyla kurulduğu anlaşılmıştır (AİHS 6).',
          flag('contra_k2'),
        ),
        because(
          'Öncelikli randevu onayı karşılığında sanığa bir menfaat sağlandığına dair delil yoktur; rüşvetin iş–menfaat bağı kurulamamıştır.',
          flag('halil_durust'),
        ),
        because(
          'Tanıkların kanaat ve duyumları hükme esas alınmamıştır (CMK 217).',
          any(flag('obj_k4'), flag('obj_b2'), flag('obj_s4')),
        ),
        because(
          'Sanığın suçu işlediğine dair her türlü şüpheden uzak, kesin ve inandırıcı delil elde edilememiştir; şüpheden sanık yararlanır (Anayasa 38/4; AİHS 6/2).',
        ),
      ],
      legalBasis: 'CMK 223/2-e; CMK 135, 137/3, 206/2-a, 217/2; Anayasa 38/4, 38/6; AİHS 6/2; CMK 273/1',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'Kayıtların süre ve hat dışında alındığını göster ve okunmalarına itiraz et; zarfın sanık yokken çekmeceye girdiğini ve kaydın elle durdurulduğunu tartıştır; esas savunmada şüphenin sanık lehine olduğunu savun.',
      epilogue: [
        O(S`
          baskan: Türk Milleti adına…
          - "Beraatine." Halil ayakta duruyordu; dizleri titredi ama oturmadı. Hüküm ayakta dinlenir. Yirmi yedi yıl boyunca her şeyi ayakta imzalamıştı.
          = ADLİYE KORİDORU · ÖĞLE @adliye
          - Koridorda biri, bir başkasına fısıldadı; duyulmasın diye değil, duyulsun diye: "Kayıt usulsüzmüş, ondan çıktı."
          - Halil duydu. Durdu. Fısıldayana döndü ve kibarca, bir ret gerekçesi okur gibi söyledi: "Kayıt usulsüzdü, evet. Ben de o zarfı almadım. İkisi de doğru, efendim."
          - Zehra babasının koluna girdi. Onu oradan çekip götürdü; bir hemşirenin, hastasını kalabalıktan çıkardığı gibi.
        `),
        W(
          any(has('ded_tek_kisi'), has('ded_kameradaki')),
          S`
            - Merdivenlerde, aşağıda, açık renk ceketli bir adam bir nane şekeri açıyordu. Bana dönüp başıyla selam verdi; sıcak, acelesiz.
            ~ Bir dahili, bir saat, bir koku. Hepsi elimde. Ama hiçbiri kürsüde onun karşısına konmadı. Savcılık "faili belirsiz" diye yazdı. Belirsiz değil. Sınanmamış.
          `,
        ),
        O(S`
          = EKİNCİLERİN EVİ · O AKŞAM @ev
          - Balkonda yeni sardunya bir hafta içinde bir çiçek açmıştı. Halil saksıyı ortaya, tabağı altına hizaladı. Sonra durdu, saksıyı biraz kaydırdı; hizasız bıraktı.
          halil: Görevime iade için bir yazı yazmam gerekiyor. İki sayfa olur. Ama ilk cümlesi kısa: "Beraat ettim."
          ~ Bazen adalet bir kapıyı açar, ama kimin kapattığını söylemez. Halil kapıdan geçti. Kapıyı kapatan el hâlâ o binada, nane şekeri dağıtıyor. !fade
        `),
      ],
    }),
    outcome('GOREV', {
      class: 'RECHARACTERIZED',
      priority: 4,
      when: all(notCollapsed, flag('terditli'), finalAtLeast(T_GOREV)),
      stamp: 'TCK 257/1 · HAGB',
      stampTone: 'amber',
      sentence: '10 ay hapis · hükmün açıklanması geri bırakıldı',
      verdictText:
        'Sanık Halil Ekinci’nin eyleminin, rüşvetin iş–menfaat bağı kurulamadığından TCK 252/2 değil, ek savunması alınarak (CMK 226/1) TCK 257/1 kapsamında görevi kötüye kullanma olduğu kabul edilerek 1 yıl hapis cezası ile cezalandırılmasına; TCK 62/1 uyarınca 10 ay hapis cezasına; sanığın sabıkasız olması ve yeniden suç işlemeyeceği kanaatiyle CMK 231/5 uyarınca HÜKMÜN AÇIKLANMASININ GERİ BIRAKILMASINA ve beş yıl denetim süresine; tutuklama ve adli kontrol tedbirlerinin kaldırılmasına; el konulan 40.000 TL’nin Emniyet Müdürlüğüne iadesine; giderilmesi gereken somut bir zarar bulunmadığının tespitine (CMK 231/6-c); hükmün gerekçesiyle tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 231/12, 273/1).',
      reasoning: [
        because(
          'Sanığın, yetkisi bulunmadığı hâlde muhbirin başvurusuna öncelikli randevu onayı verdiği sabittir; bu davranış görevin gereklerine aykırıdır ve sıradaki başvuru sahiplerini mağdur etmiştir (TCK 257/1).',
        ),
        because(
          'Sanığa bu onay karşılığında bir menfaat sağlandığı ya da anlaşmaya varıldığı her türlü şüpheden uzak biçimde ispat edilememiştir; rüşvet vasfı kurulamamıştır.',
        ),
        because(
          'Kararın kapsamı dışında alınan dinleme kayıtları hükme esas alınmamıştır (CMK 206/2-a, 217/2).',
          ref('kayit_disi'),
        ),
        because(
          'Sanığın ek savunması alınmış (CMK 226/1); icbar ve nüfuz unsurları bulunmadığından irtikap vasfı da kabul edilmemiştir.',
          any(flag('ek_savunma_tam'), flag('ek_savunma_kismi'), flag('ek_sure')),
        ),
        because('Sanığın sabıkasızlığı ve uzun meslek hayatı takdiri indirim nedeni sayılmıştır (TCK 62/1).'),
        because(
          'Hükmolunan ceza iki yılı aşmadığından ve sanığın kişiliği olumlu değerlendirildiğinden hükmün açıklanması geri bırakılmıştır (CMK 231/5, 231/6).',
        ),
      ],
      legalBasis: 'TCK 257/1, 62/1; CMK 225/2, 226/1, 231/5, 231/6, 231/8, 231/12; CMK 206/2-a, 217/2',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Beraat için gereken delil zincirini kuramadığında, esas savunmada terditli olarak eylemin en fazla görevi kötüye kullanma olduğunu savun.',
      epilogue: [
        O(S`
          baskan: …hükmün açıklanmasının geri bırakılmasına.
          - Halil "geri bırakılmasına" kelimesini anladı; yirmi yedi yıllık bir memur, her kelimenin anlamını bilir. Yüzü aydınlanmadı. Kararmadı da.
          = ADLİYE KORİDORU · ÖĞLE @adliye
          halil: Rüşvet düştü. İyilik kaldı. Yirmi yedi yılın bedeli bir iyilikmiş, avukat hanım.
          > Beş yıl içinde başka bir şey olmazsa, bu hüküm hiç kurulmamış sayılacak. Görevinize dönebilirsiniz.
          halil: Dönerim. Ama artık kimseye "sıra sizde" derken yüzüne bakmayacağım. Sıraya bakacağım. Bu daha kötü, değil mi?
        `),
        O(S`
          - Zehra babasının elini tuttu. "Hâkim Bey" dedi; bu sefer takılmak için değil.
          ~ Kazandığımızı söylediler. Leyla bile "fena değil" dedi. Halil çıkarken gözlüğünü başının üstüne itti; unutmadı, bilerek itti.
          ~ Zarfı çekmeceye koyan elin kimin olduğunu kimse sormadı artık. Dosya kapandı; kapı aralık kaldı. Leyla en sona sakla demişti. Ben sona gelmeden açtım. !fade
        `),
      ],
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 5,
      when: always,
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '3 yıl 4 ay hapis · hak yoksunlukları',
      verdictText:
        'Sanık Halil Ekinci’nin TCK 252/2 uyarınca alt sınırdan 4 yıl hapis cezası ile cezalandırılmasına; TCK 62/1 uyarınca 3 yıl 4 ay hapis cezasına; TCK 53/1 ve 53/5’teki hak yoksunluklarına; tutuklulukta geçen sürenin cezadan mahsubuna (TCK 63); el konulan 40.000 TL’nin Emniyet Müdürlüğüne iadesine; cezanın süresi nedeniyle erteleme ve hükmün açıklanmasının geri bırakılması koşulları bulunmadığına; hükmün gerekçesiyle tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because('İşaretli paralar sanığın çekmecesinde ele geçirilmiş; muhbirin beyanı el koyma tutanağıyla desteklenmiştir.'),
        because(
          'Sanığın öncelikli randevu konusundaki inkârı müdürlük kaydıyla çelişmiştir.',
          all(flag('halil_inkar'), has('ev_sira_disi')),
        ),
        because('Savunmanın inandırıcılığı duruşmada çökmüş; heyet iddianamedeki anlatımı esas almıştır.', flag('cokus')),
        because(
          'Temel ceza alt sınırdan belirlenmiş; sanığın sabıkasızlığı takdiri indirim nedeni sayılmıştır (TCK 62/1). Ceza iki yılı aştığından erteleme ve HAGB uygulanamamıştır (TCK 51/1; CMK 231/5).',
        ),
      ],
      legalBasis: 'TCK 252/2, 53, 62/1, 63; TCK 51/1; CMK 231/5, 273/1',
      xp: xp(0.6, { ethicsVar: 'ethics' }),
      howToReach: 'Varsayılan sonuç: diğer sonuçların koşulları sağlanmazsa verilir.',
      epilogue: [
        W(
          flag('cokus'),
          S`
            - Salon boşalırken savcı dosyasını topladı. Yanımdan geçerken durdu.
            savci: İyi bir avukat olacaksınız. Bugün değil.
          `,
        ),
        O(S`
          baskan: …üç yıl dört ay hapis cezası ile cezalandırılmasına.
          - Halil ayakta kaldı. Hüküm ayakta dinlenir. Gözlüğünü çıkardı, camlarını gömleğinin ucuyla sildi, yeniden taktı. Sonra jandarmaya döndü ve kelepçeyi kendisi uzattı.
          = ADLİYE ARKA KAPISI · ÖĞLE @sokak_yagmur
          - Ring aracının arka camı buğuluydu. Zehra elini cama koydu; içeriden bir el, camın öbür yüzüne, aynı yere. Araç kalktı.
          - Yağmur yeniden başlamıştı. Zehra'nın elinde babasının yedek gözlüğü kalmıştı. Kılıfını açtı, kapadı.
          zehra: İstinaf, değil mi? İki hafta. Babam iki haftada bir ret gerekçesi yazardı. Biz de yazarız.
          ~ Kayıt bir anahtar deliğiydi. Ben kapıyı hiç açamadım. Ve bir binanın ikinci katında, bir masanın üçüncü çekmecesi şimdi kilitli. !fade
        `),
      ],
    }),
  ],
};
