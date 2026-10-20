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
import type { CasePart, Cond, ResponseBlock } from '../../../tools/content/src/kit/index.js';
import { O, S, W } from './dsl.js';
import { gercekProven } from './shared.js';

// 90-outcomes: ETİK (tanığı etkileme; sanık nesnel delille beraat eder, müdafi baroya ve savcılığa bildirilir),
// 223/2-b beraat, 223/2-e beraat, görevi kötüye kullanma (farklı nitelendirme, HAGB), mahkûmiyet (varsayılan).
//
// Suçluluk skora bağlanmaz: beraat, savcının beraat mütalaası verdiği koşullarla (`beraat_kosul` ya da gerçek failin
// kanıtlanması) aynı koşula bağlıdır; skor yalnızca XP'yi ve 2-b/2-e derecesini belirler. Mahkûmiyet ve 257'nin gerekçe
// satırları, o oyunda duruşmada gerçekten ortaya konan olgulara göre koşulludur.

export const T_GOREV = 4000;
export const T_BERAAT_B = 12000;

const notCollapsed = not(flag('cokus'));
const temiz = not(flag('tanik_etkileme'));
/** Kayıtlardan en az biri belgeyle kapsam dışı gösterildi. */
const kayitBiri = any(flag('red_14'), flag('contra_k1'), flag('red_9'), flag('contra_k5'), flag('obj_k5'));

/** Müdafiin etik ihlalleri (tanığı etkileme dışında): inkâr tavsiyesi, tanığı izleme. Hüküm hukuki bayraklara göre. */
const etikNot: ResponseBlock[] = [
  W(
    all(cmp(v('ethics'), '>=', 2), temiz),
    S`
      = ARSLAN HUKUK · BİR HAFTA SONRA @buro_gece
      - Leyla beni odasına çağırdı ve kapıyı kapattı. Masasında Avukatlık Kanunu duruyordu; otuz dördüncü madde kurşun kalemle çizilmişti.
      leyla: Hüküm ne olursa olsun, Deniz, dosyada senin de bir satırın var. Kimse yazmadı diye yazılmamış sayılmaz.
    `,
  ),
  W(
    all(cmp(v('ethics'), '>=', 2), temiz, flag('halil_inkar')),
    S`
      leyla: Bir müvekkile yalan söylemesini öğütledin. Halil yirmi yedi yıl yalan söylememişti; ilk yalanını senden öğrendi.
    `,
  ),
  W(
    all(cmp(v('ethics'), '>=', 2), temiz, flag('sinan_izlendi')),
    S`
      leyla: Bir tanığın peşine düştün. Otoparkta, gece, yirmi dakika. Bu meslekte izlenen kişiye değil, izleyene bakılır.
    `,
  ),
  W(
    all(cmp(v('ethics'), '>=', 2), temiz),
    S`
      leyla: Bunu disiplin kuruluna ben bildirmeyeceğim. Sen bildireceksin. Yarın sabah, kendi elinle.
      - Ertesi sabah Bursa Barosuna iki sayfalık bir dilekçe verdim. İlk cümlesi kısaydı: "Hata yaptım." Halil'den öğrenmiştim; ilk cümle kısa olur.
      ~ Bir dosya kapandı. Benim adıma bir dosya açıldı. İkisi de aynı haftada, aynı binada. !fade
    `,
  ),
];

/** Yönlendirilen tanık, hüküm başka bir sonuçla bittiğinde (nesnel delil beraate yetmediğinde). */
const etkiNot: ResponseBlock = W(
  flag('tanik_etkileme'),
  S`
    = ARSLAN HUKUK · O GECE @buro_gece
    - Masamda Başsavcılıktan bir yazı vardı: "Tanığı etkileme (TCK 277) iddiasıyla hakkınızda soruşturma başlatılmıştır." Altında baronun disiplin yazısı.
    - Leyla odasındaydı. Kapısı kapalıydı. Bir kez bile dışarı çıkmadı.
    ~ Bir zarfın hangi elden geldiğini bulmaya çalışırken, bir tanığın ağzına kendi elimle bir cümle koydum. Halil'in çekmecesine konan zarf gibi. !fade
  `,
);

const etkiGerekce = (when: Cond = always) =>
  because(
    'Tanık beyanının duruşmadan önce müdafi tarafından yönlendirildiği anlaşıldığından bu beyana itibar edilmemiş; durum Başsavcılığa ve Bursa Barosuna bildirilmiştir (CMK 217/1; TCK 277; Av.K. 34).',
    all(flag('tanik_etkileme'), when),
  );

export const outcomes: CasePart = {
  outcomes: [
    outcome('ETIK', {
      class: 'OTHER',
      priority: 1,
      when: all(notCollapsed, flag('tanik_etkileme'), any(ref('beraat_kosul'), gercekProven)),
      stamp: 'BERAAT · BARO',
      stampTone: 'amber',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Sanık beraat etti · müdafi hakkında suç duyurusu',
      verdictText:
        'Sanık Halil Ekinci’nin üzerine atılı rüşvet suçunu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; hakkındaki tutuklama ve adli kontrol tedbirlerinin kaldırılmasına; el konulan 40.000 TL’nin Emniyet Müdürlüğüne iadesine; sanığa tutuklu kaldığı süre için tazminat isteyebileceğinin bildirilmesine (CMK 141/1-e, 142, 231/3); bir tanığın beyanının duruşmadan önce müdafi tarafından yönlendirildiği anlaşıldığından müdafi hakkında TCK 277 yönünden Bursa Cumhuriyet Başsavcılığına suç duyurusunda bulunulmasına ve karar örneğinin Bursa Barosuna gönderilmesine (Av.K. 34); hükmün gerekçesiyle tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Tanık Bayram Öz’ün duruşmadaki beyanının müdafi tarafından yönlendirildiği tanığın kendi ağzından anlaşıldığından bu beyana itibar edilmemiştir (CMK 217/1).',
          flag('etki_bayram'),
        ),
        because(
          'Tanık Muzaffer Kılınç, müdafiin kendisine görmediği bir şeyi söylemesini telkin ettiğini beyan etmiştir; tanığın beyanı yalnızca kendi gördüğü kadarıyla değerlendirilmiştir.',
          flag('etki_muzaffer'),
        ),
        because(
          'Kararın kapsamı dışında alınan 9 ve 14 numaralı kayıtlar hükme esas alınmamış (CMK 135, 206/2-a, 217/2; Anayasa 38/6); hâkim denetiminde yok edilecektir (CMK 137/3).',
          ref('kayit_disi'),
        ),
        because(
          'Yönlendirilen beyandan bağımsız olarak, el koyma tutanağının saatleri ve bilirkişi raporu zarfın sanık odada yokken çekmeceye konduğunu ve kayıt cihazının fiziksel tuşla durdurulduğunu göstermektedir.',
          ref('zarf_suphe'),
        ),
        because(
          'Muhbirin önce icbar, sonra anlaşma anlatan beyanları belgelerle çelişmektedir; dosya sanığın görev alanında değildir.',
          ref('muhbir_coktu'),
        ),
        because(
          'Tanık Sinan Kaplan’ın beyanları çay ocağı kaydı, santral dökümü ve zimmet defteriyle çelişmiş; tanık kendisini suçlayabilecek sorulara cevap vermekten çekinmiştir (CMK 48).',
          flag('sinan_ifsa'),
        ),
        because(
          'Sanığın suçu işlediğine dair kesin ve inandırıcı delil elde edilememiştir; şüpheden sanık yararlanır (Anayasa 38/4; AİHS 6/2). Müdafiin davranışı sanığın aleyhine değerlendirilemez.',
        ),
      ],
      legalBasis: 'CMK 223/2-e, 217/1, 135, 137/3, 141/1-e, 142, 231/3; Anayasa 38/4, 38/6; TCK 277; Av.K. 34; CMK 273/1',
      xp: 0,
      howToReach:
        'Bir tanığa mahkemede ne söyleyeceğini dikte etmek. Sanık nesnel delillerle beraat eder; müdafi savcılığa ve baroya bildirilir. Bu sona ulaşmamak gerekir.',
      ethicsCard:
        'Tanığa ne söyleyeceğini, hele bir isim vererek, dikte etmek tanığı etkilemedir (TCK 277); tanık yalan tanıklığa sürüklenir (TCK 272) ve beyanı hükme esas alınamaz hâle gelir. Müvekkil, avukatının ihlali yüzünden cezalandırılmaz; ama avukat kendi dosyasıyla yüzleşir (Av.K. 34). Doğru yol, tanıkları kendi avukatlarına ve mahkemeye yönlendirmek, delili CMK 177 dilekçesiyle istemekti.',
      epilogue: [
        O(S`
          baskan: …karar örneğinin Bursa Barosuna gönderilmesine.
          - "Beraatine" kelimesinden sonra Başkan bir an durdu, bana baktı; sonra okumaya devam etti. Halil ayakta duruyordu. Beraat kelimesinde değil, baro kelimesinde gözlüğünü çıkardı.
          - Zehra arka sırada bembeyazdı. Babasına değil, bana bakıyordu. Bir hemşirenin, doğru teşhisi koyup yanlış ilacı veren doktora bakışı.
          = ADLİYE MERDİVENLERİ · ÖĞLE @adliye
          - Halil merdivenin başında durdu. Kendi ayaklarıyla, kelepçesiz. Bana elini uzatmadı.
          halil: Avukat hanım. Beni kâğıtlar kurtardı; tutanak, rapor, saatler. Kayda geçsin: sizin o tanığa söylediğiniz cümle beni kurtarmadı. Az kalsın batırıyordu.
          halil: Yirmi yedi yıl bir kez eğildim. Siz bir ayda eğildiniz. Bir daha doğrulmak, eğilmekten zordur. Bunu ben de yeni öğrendim.
        `),
        O(S`
          = ARSLAN HUKUK · O GECE @buro_gece
          - Masamda Başsavcılıktan bir yazı vardı: "Tanığı etkileme iddiasıyla hakkınızda soruşturma başlatılmıştır." Altında baronun disiplin yazısı.
          - Masamda bir kitap duruyordu. Avukatlık Kanunu. Leyla'nın eski, sayfa kenarları kıvrılmış nüshası. Otuz dördüncü madde, kurşun kalemle çizilmiş.
          - Leyla odasındaydı. Kapısı kapalıydı. Bir kez bile dışarı çıkmadı.
          ~ Halil beraat etti. Benim sayemde değil; benim rağmıma. Kâğıtlar doğruydu. Yanlış olan, kâğıtların yanına benim koyduğum cümleydi. !fade
        `),
      ],
    }),
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 2,
      when: all(
        notCollapsed,
        temiz,
        gercekProven,
        flag('gercek_fail'),
        ref('kayit_disi'),
        finalAtLeast(T_BERAAT_B),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · tedbirler kalktı',
      verdictText:
        'Sanık Halil Ekinci’nin üzerine atılı rüşvet suçunu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; hakkındaki tutuklama ve adli kontrol tedbirlerinin kaldırılmasına; el konulan 40.000 TL’nin Emniyet Müdürlüğüne iadesine; hukuka aykırı elde edilen dinleme kayıtlarının hâkim denetiminde yok edilmesine (CMK 137/3); Sinan Kaplan ve Bayram Öz hakkında iftira ve diğer suçlar yönünden işlem yapılmak üzere dosya örneğinin Bursa Cumhuriyet Başsavcılığına gönderilmesine; sanığa tutuklu kaldığı süre için tazminat isteyebileceğinin bildirilmesine (CMK 141/1-e, 142, 231/3); hükmün gerekçesiyle tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'İddianamenin dayandığı 9 ve 14 numaralı kayıtlar, kararda gösterilmeyen bir hattan ve kararın süresi dolduktan sonra alındığından hükme esas alınmamıştır (CMK 135/1, 135/4, 206/2-a, 217/2; Anayasa 38/6).',
        ),
        because(
          'Sanık, dahili 214’ten yapılan ve makamdan geldiği izlenimi verilen bir çağrıyla odasından uzaklaştırılmıştır.',
          any(flag('contra_s2'), flag('q_takvim'), flag('bayram_ifsa')),
        ),
        because('Zarf, çekmeceye sanık odada yokken konulmuştur.', ref('oda_bos')),
        because('Zarf, Devir Servisi-2’ye zimmetlenen destedendir.', has('ded_zarf_kaynagi')),
        because(
          'Tanık Bayram Öz zarfı sanığa değil, koridorda Sinan Kaplan’a verdiğini ve kayıt cihazını onun isteğiyle durdurduğunu beyan etmiştir.',
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
      legalBasis: 'CMK 223/2-b; CMK 135, 137/3, 141/1-e, 142, 206/2-a, 217/2; Anayasa 38/6; AİHS 6; CMK 273/1',
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
        ...etikNot,
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 3,
      when: all(notCollapsed, temiz, any(ref('beraat_kosul'), gercekProven)),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · tedbirler kalktı',
      verdictText:
        'Sanık Halil Ekinci’nin üzerine atılı rüşvet suçunu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; hakkındaki tutuklama ve adli kontrol tedbirlerinin kaldırılmasına; el konulan 40.000 TL’nin Emniyet Müdürlüğüne iadesine; dosyanın bir örneğinin zarfı çekmeceye bırakanın belirlenmesi için Bursa Cumhuriyet Başsavcılığına gönderilmesine; sanığa tutuklu kaldığı süre için tazminat isteyebileceğinin bildirilmesine (CMK 141/1-e, 142, 231/3); hükmün gerekçesiyle tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Kararın süresi dolduktan sonra alınan 14 numaralı kayıt hükme esas alınmamıştır (CMK 135/4, 206/2-a, 217/2; Anayasa 38/6).',
          any(flag('red_14'), flag('contra_k1')),
        ),
        because(
          'Sanığın hattı için verilmiş bir dinleme kararı bulunmadığından 9 numaralı kayıt hükme esas alınmamıştır (CMK 135/1, 135/9).',
          any(flag('red_9'), flag('contra_k5'), flag('obj_k5')),
        ),
        because('Hukuka aykırı elde edilen kayıtlar hâkim denetiminde yok edilecektir (CMK 137/3).', ref('kayit_disi')),
        because(
          'El koyma tutanağının saatlerine göre polis odaya girdiğinde sanık odasında bulunmamaktadır.',
          ref('oda_bos'),
        ),
        because(
          'Sanığın 10.35’te makamdan geldiği izlenimi veren bir çağrıyla odasından ayrıldığı duruşmada gösterilmiştir.',
          ref('ayrilis'),
        ),
        because(
          'Muhbire takılan kayıt cihazının teknik arıza nedeniyle değil, fiziksel tuşla durdurulduğu bilirkişi raporuyla anlaşılmıştır.',
          flag('contra_b4'),
        ),
        because(
          'Muhbirin önce icbar, sonra anlaşma anlatan beyanları birbiriyle çelişmektedir; dosya sanığın görev alanında değildir.',
          ref('muhbir_coktu'),
        ),
        because(
          'Tanık Bayram Öz, zarfı sanığa değil koridorda başka birine verdiğini beyan etmiştir.',
          flag('bayram_ifsa'),
        ),
        because(
          'Tanık Sinan Kaplan, kendisini suçlayabilecek sorulara cevap vermekten çekinmiştir (CMK 48).',
          flag('sinan_ifsa'),
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
      legalBasis: 'CMK 223/2-e; CMK 135, 137/3, 141/1-e, 142, 206/2-a, 217/2; Anayasa 38/4, 38/6; AİHS 6/2; CMK 273/1',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'Kayıtların süre ve hat dışında alındığını göster ve okunmalarına itiraz et; odanın boş olduğunu, Halil’in sahte bir çağrıyla indiğini ve kaydın elle durdurulduğunu tartıştır; muhbirin “bekletti / anlaştık” anlatısını belgeyle çürüt.',
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
          all(any(has('ded_tek_kisi'), has('ded_kameradaki')), not(gercekProven), flag('suc_duyurusu')),
          S`
            - Merdivenlerde, aşağıda, açık renk ceketli bir adam bir nane şekeri açıyordu. Bana dönüp başıyla selam verdi; sıcak, acelesiz.
            ~ Bir dahili, bir saat, bir koku. Suç duyurum bir numara aldı; bir dosyanın altında bekliyor. Belirsiz değil. Sınanmamış.
          `,
        ),
        W(
          all(any(has('ded_tek_kisi'), has('ded_kameradaki')), not(gercekProven), not(flag('suc_duyurusu'))),
          S`
            - Merdivenlerde, aşağıda, açık renk ceketli bir adam bir nane şekeri açıyordu. Bana dönüp başıyla selam verdi; sıcak, acelesiz.
            ~ Bir dahili, bir saat, bir koku. Hepsi elimde. Ama hiçbiri kürsüde onun karşısına konmadı; savcılığa da yazmadım. Belirsiz değil. Sınanmamış.
          `,
        ),
        W(
          gercekProven,
          S`
            - Merdivenlerde Bayram Öz'ü gördüm; yanında adli yardımdan genç meslektaşı. Tespihini cebine koydu ve bana başıyla selam verdi. Konuşmadık; konuşmamamız gerekiyordu.
          `,
        ),
        O(S`
          = EKİNCİLERİN EVİ · O AKŞAM @ev
          - Balkonda yeni sardunya bir hafta içinde bir çiçek açmıştı. Halil saksıyı ortaya, tabağı altına hizaladı. Sonra durdu, saksıyı biraz kaydırdı; hizasız bıraktı.
          halil: Görevime iade için bir yazı yazmam gerekiyor. İki sayfa olur. Ama ilk cümlesi kısa: "Beraat ettim."
          - Zehra içeriden iki bardak çay getirdi; birini babasına, birini bana. Halil bardağını tabağa koymadan önce tabağı tepsinin kenarıyla hizaladı. Sonra vazgeçti; öylece bıraktı.
          zehra: Baba, artık her şeyi sen yapmıyorsun. Kural.
          halil: Kural. Peki, Hâkim Bey.
          - Zehra güldü. Üç aydır ilk kez, yorgunluktan değil.
        `),
        O(S`
          = ARSLAN HUKUK · O GECE @buro_gece
          - Leyla odamın kapısında durdu. Elinde ceketi, ceketinin cebinde bir tren bileti; hafta sonu İzmir'e gidecekti. Yıllardır gitmediği bir yere.
          leyla: Beraat beraattir, Deniz. "Sabit olmadığından" ile "işlemediği sabit olduğundan" arasındaki farkı Halil bilir; heyet de bilir. Sen de bileceksin. Ama bu gece değil.
          - Masamdaki dosyayı kapattı, sırtını dosya dolabının sırasına göre hizaladı. Sonra güldü; Halil'den bulaşmış bir alışkanlık.
        `),
        W(
          gercekProven,
          S`~ Bazen adalet bir kapıyı açar ve kimin kapattığını da gösterir; ama adını hükme yazmaz. O adı artık bir savcı yazacak. !fade`,
        ),
        W(
          not(gercekProven),
          S`~ Bazen adalet bir kapıyı açar, ama kimin kapattığını söylemez. Halil kapıdan geçti. Kapıyı kapatan el hâlâ o binada. !fade`,
        ),
        ...etikNot,
      ],
    }),
    outcome('GOREV', {
      class: 'RECHARACTERIZED',
      priority: 4,
      when: all(
        notCollapsed,
        flag('terditli'),
        any(flag('contra_b1'), flag('contra_b2')),
        any(flag('red_14'), flag('contra_k1'), flag('contra_b3'), flag('contra_k3')),
        finalAtLeast(T_GOREV),
      ),
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
          'Muhbirin, dosyasının sanık tarafından bekletildiği ya da sanıkla anlaştığı yönündeki anlatısı belgelerle sarsılmıştır; onay karşılığında bir menfaat sağlandığı ya da anlaşmaya varıldığı her türlü şüpheden uzak biçimde ispat edilememiş, rüşvet vasfı kurulamamıştır.',
        ),
        because(
          'Kararın kapsamı dışında alındığı gösterilen dinleme kayıtları hükme esas alınmamıştır (CMK 206/2-a, 217/2).',
          kayitBiri,
        ),
        because(
          'Muhbirin zarfı sanığa elden verdiği yönündeki beyanı el koyma tutanağının saatleriyle çelişmiştir.',
          any(flag('contra_b3'), flag('contra_k3')),
        ),
        because(
          'Sanığın ek savunması alınmış (CMK 226/1); icbar ve nüfuz unsurları bulunmadığından irtikap vasfı da kabul edilmemiştir.',
          any(flag('ek_savunma_tam'), flag('ek_savunma_kismi'), flag('ek_sure')),
        ),
        etkiGerekce(),
        because('Sanığın sabıkasızlığı ve uzun meslek hayatı takdiri indirim nedeni sayılmıştır (TCK 62/1).'),
        because(
          'Hükmolunan ceza iki yılı aşmadığından ve sanığın kişiliği olumlu değerlendirildiğinden hükmün açıklanması geri bırakılmıştır (CMK 231/5, 231/6).',
        ),
      ],
      legalBasis: 'TCK 257/1, 62/1; CMK 225/2, 226/1, 231/5, 231/6, 231/8, 231/12; CMK 206/2-a, 217/2',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Beraat için gereken delil zincirini kuramadığında; ama muhbirin “bekletti / anlaştık” anlatısını belgeyle çürütüp kayıtlardan birini ya da tutanağın saatlerini tartıştırdıysan, esas savunmada terditli olarak eylemin en fazla görevi kötüye kullanma olduğunu savun.',
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
        etkiNot,
        ...etikNot,
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
        because('Kontrollü teslimatta kullanılan işaretli paralar sanığın çekmecesinde ele geçirilmiştir.'),
        because(
          'Dinleme kayıtlarının kararın kapsamı dışında alındığı duruşmada belgeyle gösterilmediğinden kayıtlar hükme esas alınmıştır; kayıtlar sanığın muhbirle görüştüğünü ve teslimattan önceki akşam bir üçüncü kişinin “zarf yarın masada” dediğini göstermektedir.',
          not(kayitBiri),
        ),
        because(
          'Kapsam dışı olduğu gösterilen kayıtlar hükme esas alınmamış; kalan deliller birlikte değerlendirilmiştir (CMK 217/2).',
          kayitBiri,
        ),
        because(
          'Muhbirin zarfı sanığa elden verdiği yönündeki beyanı el koyma tutanağıyla çelişmemektedir.',
          not(ref('oda_bos')),
        ),
        because(
          'Polis odaya girdiğinde sanığın odada bulunmadığı tutanakla sabittir; ancak sanığın odasından ne zaman ayrıldığı duruşmada gösterilmediğinden zarfın sanığa daha önce verilmiş olabileceği ihtimali dışlanamamıştır.',
          all(ref('oda_bos'), not(ref('ayrilis'))),
        ),
        because(
          'Muhbirin kayıt cihazını kendisinin durdurduğunun anlaşılması beyanının güvenilirliğini zayıflatmış, ancak teslimin gerçekleşmediğini tek başına göstermemiştir.',
          all(flag('contra_b4'), not(ref('zarf_suphe'))),
        ),
        because(
          'Zarfın sanık odada yokken çekmeceye bırakıldığı anlaşılmışsa da muhbirin sanıkla önceden anlaştığı yönündeki beyanı çürütülmemiştir; rüşvet anlaşmayla tamamlanır ve paranın sanık yokken bırakılması bu sonucu değiştirmez (TCK 252/1).',
          all(ref('zarf_suphe'), not(flag('contra_b2'))),
        ),
        because(
          'Muhbirin anlatıları birbiriyle çelişse de başvurunun sanığın görev alanı dışında olduğu gösterilmemiştir; sanığın muhbire öncelikli randevu onayı verdiği gözetildiğinde iş–menfaat bağı ortadan kalkmamıştır (TCK 252/1).',
          all(ref('zarf_suphe'), flag('contra_b2'), not(flag('contra_b1'))),
        ),
        because(
          'Muhbirin beyanları çelişkili olsa da hükme esas alınan kayıtlar teslimatın önceden kararlaştırıldığını göstermektedir.',
          all(ref('muhbir_coktu'), not(ref('kayit_disi'))),
        ),
        because(
          'Sanığın öncelikli randevu konusundaki inkârı, duruşmaya sunulan müdürlük kaydıyla çelişmiştir.',
          all(flag('halil_inkar'), flag('sira_savcida')),
        ),
        etkiGerekce(),
        because(
          'Savunmanın sunduğu deliller ilgisiz ya da dayanaksız kaldı; heyet iddianamedeki anlatımı esas almıştır.',
          flag('cokus'),
        ),
        because(
          'Temel ceza alt sınırdan belirlenmiş; sanığın sabıkasızlığı takdiri indirim nedeni sayılmıştır (TCK 62/1). Ceza iki yılı aştığından erteleme ve HAGB uygulanamamıştır (TCK 51/1; CMK 231/5).',
        ),
      ],
      legalBasis: 'TCK 252/1, 252/2, 53, 62/1, 63; TCK 51/1; CMK 217, 231/5, 273/1',
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
        etkiNot,
        ...etikNot,
      ],
    }),
  ],
};
