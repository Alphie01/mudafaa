import {
  all,
  always,
  any,
  because,
  finalAtLeast,
  flag,
  has,
  not,
  outcome,
  ref,
  xp,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, Cond, Line } from '../../../tools/content/src/kit/index.js';
import { T_BERAAT, T_INDIRIM } from './meta.js';
import { D, Nx, S, T, card } from './shared.js';

// 90-outcomes: ETIK (yönlendirilen tanık çöktü), BERAAT_D (223/2-d, meşru savunma), BERAAT_E (223/2-e),
// CVYO (223/3-c, TCK 27/2), INDIRIM (tahrik + silah artırımının düşmesi, HAGB), MAHKUMIYET (varsayılan; çöküş dahil).
// Epiloglar karar ekranında hükümden sonra oynar; koşulu tutan bütün bloklar sırayla birleşir.

const block = (lines: Line[], when?: Cond) => (when === undefined ? { lines } : { when, lines });

const MAHKUMIYET_HESAP =
  'Sanığın eylemine uyan TCK 86/1 uyarınca, olayın oluş biçimi ve birden fazla hareket gözetilerek alt sınırdan uzaklaşılıp 2 YIL hapis; suçun silahla işlenmesi nedeniyle TCK 86/3-e uyarınca yarı oranında artırılarak 3 YIL; kemik kırığının hayat fonksiyonlarına etkisi hafif (1) derecede olduğundan TCK 87/3 uyarınca 1/6 oranında artırılarak 3 YIL 6 AY; sanığın duruşmadaki tutumu gözetilerek TCK 62/1 uyarınca 1/6 indirimle 2 YIL 11 AY HAPİS cezası ile cezalandırılmasına; cezanın süresi nedeniyle hükmün açıklanmasının geri bırakılmasına (CMK 231/5) ve ertelemeye (TCK 51/1) yer olmadığına; TCK 53 uyarınca belirli hakları kullanmaktan yoksun bırakılmasına';

export const outcomes: CasePart = {
  outcomes: [
    outcome('ETIK', {
      class: 'CONVICTION',
      priority: 0,
      // Yalnızca Ece olayın başlangıcına dair tek bağımsız anlatımken: tanık dışlandığında dosyada iddianın anlatımı kalır.
      when: all(
        flag('ece_coktu'),
        not(ref('saldiri_kanit')),
        not(ref('kadeh_curudu')),
        not(ref('tanik_guvenilmez')),
        not(flag('video_izlendi')),
        not(has('ev_kriminal')),
      ),
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '2 yıl 11 ay hapis',
      verdictText: `${MAHKUMIYET_HESAP}; tanık Ece Tan’ın beyanının, müdafi tarafından yönlendirildiği anlaşıldığından hükme esas alınmamasına; müdafi hakkında suç duyurusunda bulunulmasına ve dosya örneğinin baroya gönderilmesine; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).`,
      reasoning: [
        because(
          'Tanık Ece Tan, duruşmada müdafinin kendisine ne söyleyeceğini önceden söylediğini beyan etmiş; tanığın beyanı bu nedenle güvenilir bulunmamıştır.',
        ),
        because(
          'Savunmanın olayın başlangıcına ilişkin tek bağımsız anlatımı bu tanığa dayanmaktadır; beyan dışlandığında sanığın saldırının katılandan geldiği yönündeki savunması başka bir delille desteklenmemektedir.',
        ),
        because(
          'Kırık kadehin kimin elinde olduğuna dair bilimsel bir inceleme yapılmamış; görgü tanığı Onur Kılıç’ın olayın özüne ilişkin anlatımı duruşmada çürütülmemiştir.',
        ),
        because(
          'Katılan ve tanığın beyanlarındaki bazı çelişkiler tutanağa geçmiş; ancak bu çelişkiler kadehin kullanımına ve yerdeki darbeye ilişkin anlatımı ortadan kaldırmamıştır.',
          ref('findings'),
        ),
      ],
      legalBasis: 'TCK 86/1, 86/3-e, 87/3, 62/1, 53; CMK 231/5, 273/1; TCK 277; Av.K. md. 34',
      xp: xp(0),
      howToReach:
        'Ece’ye mahkemede ne söyleyeceğini söylemek, onu tanık olarak çağırtmak ve davayı ona yaslamak: kadehin kimin elinde olduğu başka bir delille gösterilmezse, yönlendirilen tanık çöktüğünde savunmanın elinde bir şey kalmaz. (Bu bir uyarı sonudur: tanığa yalnızca doğruyu söylemesini öğütle; yönlendirdiysen ara dönemde düzelt. Başka sonuçlarda da yönlendirme disiplin soruşturması getirir.)',
      ethicsCard:
        'Avukat, tanığa ne söyleyeceğini söyleyemez, görmediğini “gördüm” dedirtemez. Bu hem meslek kurallarına aykırıdır (Av.K. md. 34; TBB Meslek Kuralları) hem de tanığı etkileme suçunu oluşturabilir (TCK 277). Tanıkla görüşmek yasak değildir; doğru sınır, “gördüğünü söyle, görmediğini söyleme” demek ve kararı tanığa bırakmaktır. Yönlendirilen tanık kürsüde çöktüğünde yalnızca kendi beyanını değil, gerçeği söylediği kısmı da yanına alır.',
      epilogue: [
        block([
          S('hakim', 'Türk Milleti adına…'),
          Nx(
            'Hüküm okunurken Ece salonun arkasında duruyordu. Çıkmadı. Dinledi. “İki yıl on bir ay” denince arkasını döndü.',
          ),
          card('ADLİYE ÖNÜ — ÖĞLEDEN SONRA', 'adliye'),
          Nx(
            'Merdivenlerde yağmur. Ece’nin babası aşağıda bekliyordu: kır saçlı, kasketli, Kütahya plakalı bir arabanın yanında. Kızına sarılmadı. Kapıyı açtı.',
          ),
          Nx(
            'Bora merdivenin başında durdu. Ece’ye bir şey söylemek istedi. Ece başını salladı: söyleme. Arabaya bindi.',
          ),
          S('bora', 'Kız doğruyu söyledi, avukat hanım. Kadehi o kırdı. Herkes duydu.'),
          S('bora', 'Ama kimse inanmadı. Senin yüzünden.'),
          Nx('Anahtarı cebinden çıkardı, bana uzattı. Gölge’nin anahtarı. Almadım. Merdivene bıraktı.'),
          card('ARSLAN HUKUK — GECE', 'buro_gece'),
          Nx(
            'Leyla odama girdi. Elinde ince, kırmızı kapaklı bir kitapçık: meslek kuralları. Masama bıraktı. Hiçbir şey söylemedi.',
          ),
          T(
            'Ece gördüğünü söyleseydi yeterdi. Ben ona gördüğünden fazlasını söyletmek istedim. Fazlası, azını da götürdü.',
          ),
          Nx(
            'Kitapçığı açtım. Otuz dördüncü madde. Avukat, mesleğini doğruluk içinde yürütür. Bir cümle. Okudum, kapattım, bir daha açtım.',
          ),
          Nx(
            'Telefon titredi. Ece’den bir mesaj: “Babam beni eve götürüyor. Okulu dondurdum. Size kızgın değilim. Kendime kızgınım; ezberlediğim için.”',
          ),
          T(
            'Kendine kızgın. Benim cümlelerimi ezberlediği için. Bir tanığın bana kızmaması, bu gece duyduğum en ağır cezaydı.',
          ),
          card('Av. Deniz Arslan hakkında disiplin soruşturması başlatıldı.', 'buro_gece', 'fade'),
        ]),
      ],
    }),
    outcome('BERAAT_D', {
      class: 'ACQUITTAL',
      priority: 1,
      // Delil kararı belirler: meşru savunmanın bütün şartları kürsüde gösterildiyse mahkeme, müdafinin esas hakkındaki
      // talebiyle bağlı olmadan 223/2-d uyarınca beraat verir (CMK 217/1, 225/2). Kötü bir kapanış yalnızca skor ve ikna yer;
      // skor beraat eşiğinin altında kalırsa sonuç CVYO olur (ceza yok); mm_tam varken çöküş tetikleyicisi çalışmaz ve
      // silah artırımlı mahkûmiyet ya da indirim hiçbir zaman verilmez.
      when: all(not(flag('cokus')), ref('mm_tam'), finalAtLeast(T_BERAAT)),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Meşru savunma',
      verdictText:
        'Sanık Bora Yalçın’ın eyleminin, katılanın kırık kadehle gerçekleştirdiği haksız saldırıyı o an def etmek zorunluluğuyla ve saldırıyla orantılı biçimde işlendiği, TCK 25/1 kapsamında meşru savunma sınırları içinde kaldığı anlaşıldığından, yüklenen suç bakımından hukuka uygunluk nedeninin varlığı sebebiyle CMK 223/2-d uyarınca BERAATİNE; CMK 141/1 ve 142 kapsamındaki tazminat haklarının bildirilmesine (CMK 231/3); karar ve dosya örneklerinin katılan hakkındaki soruşturmaya eklenmek ve tanık Onur Kılıç hakkında yalan tanıklık iddiası yönünden değerlendirilmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; tebliğden itibaren iki hafta içinde istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because(
          'Kriminal incelemeye göre kırık kadehin sapını kavrayan el katılanındır; sanığın izi yalnızca tabanda, servis tutuşuyla uyumludur.',
          all(has('ev_kriminal'), flag('krim_taban')),
        ),
        because(
          'Kriminal incelemeye göre kırık kadehin sapını kavrayan el katılanındır.',
          all(has('ev_kriminal'), not(flag('krim_taban'))),
        ),
        because(
          'Fotoğraf 7 ve katılanın sağ avucundaki enine kesiye göre kırık kadehin sapı katılanın elindedir; saldırı katılandan gelmiştir.',
          all(has('ded_kadeh_serkan'), not(has('ev_kriminal'))),
        ),
        because(
          'Sanığın sol önkolunun ulnar yüzündeki kesi ve tezgâhın iç tarafındaki kan, sanığın kaçma imkânı olmayan bir konumda kolunu siper ettiğini göstermektedir.',
          has('ded_savunma'),
        ),
        because(
          'Adli Tıp raporuna göre katılanın gövdesinde tekme izi bulunmamakta, sağ bileğindeki bası izi elinde cam tutan bileğe basılarak sapın bıraktırıldığını göstermektedir.',
        ),
        because(
          'Görgü tanığı Onur Kılıç’ın katılanın çalışanı olduğu ve katılanla birlikte geldiği anlaşılmıştır.',
          any(flag('contra_o1'), flag('contra_k2')),
        ),
        because('Tanığın oturduğu masadan tezgâhın önündeki zemin görülmemektedir.', flag('contra_o2')),
        because('Tanık duruşmada kolluk beyanının gerçeği yansıtmadığını söylemiştir.', flag('onur_kirildi')),
        because(
          'Bilirkişi incelemesinden geçen kesintisiz video kaydı, saldırının katılandan geldiğini doğrulamaktadır.',
          all(flag('video_izlendi'), flag('video_bilirkisi')),
        ),
        because(
          'Duruşmada izlenen video kaydı, bilirkişi incelemesinden geçmemiş olmakla birlikte diğer delillerle örtüşmektedir.',
          all(flag('video_izlendi'), not(flag('video_bilirkisi'))),
        ),
        because(
          'Tanık Ece Tan’ın yönlendirilmediği anlaşılan beyanı olayın başlangıcını açıklamaktadır.',
          flag('ece_tanikti'),
        ),
        because(
          'Tanık Ece Tan’ın beyanı, müdafi tarafından yönlendirildiği anlaşıldığından hükme esas alınmamış; hüküm diğer delillere dayanmaktadır. Müdafi hakkında baroya bildirim ayrıca yapılacaktır.',
          flag('ece_coktu'),
        ),
        because(
          'Cumhuriyet savcısı da esas hakkındaki mütalaasında sanığın beraatini talep etmiştir.',
          flag('mutalaa_beraat'),
        ),
        because(
          'Müdafi esas hakkında farklı bir talepte bulunmuş olsa da mahkeme, talepler ve iddianamedeki nitelendirmeyle bağlı olmaksızın delilleri birlikte değerlendirmiştir (CMK 217/1, 225/2).',
          not(flag('mm_kabul')),
        ),
        because(
          'Olay yeri tutanağındaki “tezgâh önü” ibaresi, aynı ekibin çektiği fotoğraflarla birlikte değerlendirilmiştir.',
          flag('tutanak_itiraz'),
        ),
        because(
          'Sanık son sözünde olayı kendi sözleriyle, eksiksiz ve kendi aleyhine olan yönleriyle anlatmıştır.',
          flag('son_soz_iyi'),
        ),
      ],
      legalBasis: 'TCK 25/1; CMK 223/2-d, 141/1, 142, 231/3, 273/1',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Meşru savunmanın şartlarını delille kur: saldırının katılandan geldiği (sap + avuç, önkol + kan ya da Kriminal rapor), “tekme”nin bileğe bası olduğu (ara dönemde ATK + tahta), tanığın tarafsızlığının çöktüğü ve bağımsız bir anlatım (video, Ece ya da çözülen tanık). Mahkeme delile bakar; esas savunmada 223/2-d’yi istemek skoru, istememek yalnızca puanı düşürür.',
      epilogue: [
        block([
          S('hakim', 'Türk Milleti adına…'),
          Nx(
            '“Beraatine” kelimesi salona düştüğünde Bora kıpırdamadı. Hâkim gerekçeyi okumaya devam etti; “meşru savunma” dediğinde Bora gözlerini kapadı.',
          ),
          Nx(
            'Ayakta dinlemişti. Oturmasına izin verildiğinde oturmadı. Hâkime başıyla bir selam verdi; bir ringin ortasında, maçtan sonra hakeme verilen türden.',
          ),
          card('SETBAŞI — İKİ HAFTA SONRA, AKŞAM', 'sokak_gece'),
          Nx(
            'Gölge’nin kepengi yarıya kadar açıktı. Tabelada G harfi yanıyordu. Bora yeni bir ampul takmıştı; ilk iş.',
          ),
          Nx(
            'İçeride duvardaki boks fotoğrafı yoktu. Yerinde açık renkli bir dikdörtgen, çerçevenin yıllardır sakladığı boya.',
          ),
          S('bora', 'İndirdim. Artık gerek yok.'),
          T(
            'Neye gerek yoktu, sormadım. Bir adam gençliğini duvardan indirince, yerine bir şey asmak için acele etmez.',
          ),
        ]),
        block(
          [
            Nx('Tezgâhın arkasında Ece vardı. Siyah önlük, iğneli kart: ECE. Masada bir zarf: işe giriş bildirgesi.'),
            S('ece', 'Babam geldi geçen hafta. Oturdu şuraya. Bir çay içti. Hiçbir şey demedi.'),
            S('ece', 'Giderken Bora abinin elini sıktı. Gız, babam kimsenin elini sıkmaz.'),
          ],
          flag('ece_tanikti'),
        ),
        block(
          [
            Nx(
              'Kapının yanındaki masada, köşede, gözlüklü bir adam tek başına su içiyordu. Kol saati yoktu. Bora ona bir şey söylemedi; hesap da kesmedi.',
            ),
            T(
              'Onur Kılıç savcılığa gitmişti. Gideceğim demişti. Kimse ona yardım etmemişti; belki en çok o yüzden gitti.',
            ),
          ],
          flag('onur_kirildi'),
        ),
        block(
          [
            Nx('Koridorda Tolga Şen yanımdan geçerken durdu.'),
            S(
              'tolga',
              'Meslektaşım, mahkeme bugün sizden fazlasını gördü. Bir dahaki sefere hakkınızı kendiniz isteyin.',
            ),
            T(
              'Haklıydı. Kâğıtlar “haklıydı” diyordu; benim son cümlem başka bir şey demişti. Mahkeme benden önce okudu.',
            ),
          ],
          not(flag('mm_kabul')),
        ),
        block([
          card('ARSLAN HUKUK — GECE', 'buro_gece'),
          Nx('Leyla kapıda durdu. Elinde açılmamış sigara paketi.'),
          S(
            'leyla',
            'Meşru müdafaa bir haktır, Deniz. Ama hak, ispat edilene kadar bir hikâyedir. Sen hikâyeyi hakka çevirdin.',
          ),
          Nx('Paketi bir kez çevirdi. Masasındaki ters çerçeveye baktı. Sonra ışığı kapattı.'),
          T('Barlarda iki tür sessizlik vardır. Bu gece üçüncüsünü öğrendim: bir dosya kapandıktan sonraki.'),
        ]),
        block(
          [
            card('İKİ HAFTA SONRA — BURSA BAROSU', 'adliye'),
            Nx(
              'Mahkemenin yazısı baroya ulaşmıştı: “Tanık Ece Tan’ın beyanının müdafi tarafından yönlendirildiği…” Bir koridor, bir kapı, bir sıra sandalye.',
            ),
            T(
              'Hüküm başka bir yerden geldi; kâğıtlar beni değil, Bora’yı kurtardı. Ece’nin kürsüde ağladığı dakika ise benim dosyamdı. O dosya yeni açılıyordu.',
            ),
            card('Av. Deniz Arslan hakkında disiplin soruşturması başlatıldı.', 'buro_gece', 'fade'),
          ],
          flag('ece_coktu'),
        ),
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 2,
      // Eksik delil kapısı: tanığın anlatımı ikinci celsede çöktü, ara dönemden en az bir gelişme kürsüye taşındı, ama meşru
      // savunmanın bütün şartları gösterilmedi (mm_tam yok). Böylece 2-d mütalaası ile 2-e hükmü aynı oyunda buluşamaz.
      // Esas savunmanın düğmesi sınıfı belirlemez (CMK 217/1, 225/2); yalnızca skoru etkiler.
      when: all(
        not(flag('cokus')),
        not(ref('mm_tam')),
        ref('tanik_guvenilmez'),
        ref('ara_gelisme'),
        finalAtLeast(T_BERAAT),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Şüpheden yararlanma',
      verdictText:
        'Sanık Bora Yalçın’ın katılanı kırık kadehle yaraladığına ve yerde tekmelediğine ilişkin iddianame anlatımının, tek görgü tanığının beyanının güvenilirliğini yitirmesi ve adli raporlarla çelişmesi nedeniyle ispatlanamadığı; sanığın kabul ettiği tek darbe ile katılanın yere düşmesinden sonraki hareketin hangi koşullar altında gerçekleştiğinin, sanığın meşru savunma iddiasını dışlayacak biçimde aydınlatılamadığı ve bu şüphenin sanık lehine değerlendirilmesi gerektiği anlaşıldığından, üzerine atılı suçu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; CMK 141/1 ve 142 kapsamındaki tazminat haklarının bildirilmesine (CMK 231/3); tebliğden itibaren iki hafta içinde istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because(
          'Görgü tanığı Onur Kılıç’ın katılanın çalışanı olduğu, katılanla birlikte geldiği ve hesabı kendi kartıyla ödediği anlaşılmıştır.',
          any(flag('contra_o1'), flag('contra_k2')),
        ),
        because('Tanığın oturduğu masadan tezgâhın önündeki zemin görülmemektedir.', flag('contra_o2')),
        because(
          'Tanık duruşmada kolluk beyanının gerçeği yansıtmadığını, yerde ne olduğunu görmediğini söylemiştir.',
          flag('onur_kirildi'),
        ),
        because(
          'Katılan acil serviste “yumrukla vurulduğunu” beyan etmiş, yüzünde kesi bulunmamaktadır; kadehin yüze vurulduğu anlatımı desteklenmemiştir.',
          any(flag('contra_k4'), flag('contra_o3')),
        ),
        because('Adli Tıp raporunda gövdede tekme izi bulunmamaktadır.', any(flag('contra_o4'), flag('atk_govde'))),
        because(
          'Kriminal rapora göre kırık sapı kavrayan el katılanındır; kadehin sanık tarafından kullanıldığı anlatımı çürümüştür.',
          has('ev_kriminal'),
        ),
        because(
          'Kırık sap katılanın elinin yanında bulunmuştur; kadehin sanık tarafından kullanıldığı ispatlanamamıştır.',
          all(flag('contra_k3'), not(has('ev_kriminal'))),
        ),
        because(
          'Saldırının katılandan geldiğine dair güçlü bulgular bulunmakla birlikte, katılan yere düştükten sonra sanığın tezgâhtan çıkarak yaptığı hareketin niteliği duruşmada aydınlatılamamıştır.',
          ref('saldiri_kanit'),
        ),
        because(
          'Eczane kaydında saat 01.52’de arka sokaktan çıkan bir çalışan görülmekte; olayın dosyaya yansımayan bir tanığı bulunduğu anlaşılmaktadır.',
          all(flag('ecz_ece'), not(flag('ece_tanikti'))),
        ),
        because(
          'Tanık Ece Tan’ın beyanı, müdafi tarafından yönlendirildiği anlaşıldığından hükme esas alınmamıştır. Müdafi hakkında baroya bildirim ayrıca yapılacaktır.',
          flag('ece_coktu'),
        ),
        because(
          'Sanığın suçu işlediğine dair kesin ve inandırıcı delil yoktur; şüpheden sanık yararlanır (Anayasa 38/4; AİHS 6/2). Hukuka uygunluk nedeninin varlığına ilişkin giderilemeyen şüphe de sanık lehine değerlendirilir.',
        ),
      ],
      legalBasis: 'CMK 223/2-e; Anayasa 38/4; AİHS 6/2; CMK 141/1, 142, 231/3, 273/1',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'Görgü tanığının anlatımını ikinci celsede çökert (üç çelişki ya da kırılma), ara dönemden en az bir gelişmeyi kürsüye taşı ve beraat eşiğini geç. Meşru savunmanın bütün şartları (bilekteki bası dahil) gösterilmişse mahkeme 223/2-d’ye gider; esas savunmadaki talep sınıfı değil, yalnızca skoru değiştirir.',
      epilogue: [
        block([
          S('hakim', 'Türk Milleti adına…'),
          Nx(
            '“Beraatine.” Bora bir an ne duyduğunu anlamadı. Bana baktı; başımı salladım. Hâkime baktı; hâkim gerekçeyi okuyordu.',
          ),
          Nx(
            '“Sabit olmadığından.” Bora bu iki kelimeyi koridorda üç kez tekrarladı. Her seferinde biraz daha az anladı.',
          ),
          S('bora', 'Sabit değil. Yani… haklı mıyım, değil miyim?'),
          T(
            'Beraat ettin, demek isterdim. Mahkeme haklı olduğunu söylemedi; haksız olduğunun ispatlanamadığını söyledi. Bir avukat için büyük fark değil. Bora için büyük fark.',
          ),
          Nx(
            'Adliyenin önünde yağmur durmuştu. Bora merdivenin başında kasketini cebinden çıkardı, taktı. Bir an göğe baktı; Uludağ bulutun içindeydi.',
          ),
          S('bora', 'Avukat hanım. Teşekkür ederim. Ama bir şey soracağım: sen ne düşünüyorsun? Ben haklı mıyım?'),
          T('Bir avukat bu soruya cevap vermez. Bir avukatın düşüncesi hüküm değildir.'),
          Nx('Cevap vermedim. Bora burnundan nefes verdi; Bora’nın gülmesi buydu. Anladı.'),
        ]),
        block(
          [
            Nx(
              'Koridorun sonunda Serkan vekilinin kolundan tutmuş, bir şey söylüyordu. Sesi yükseldi: “Daha bitmedi!” Tolga Şen kolunu nazikçe çekti ve merdivenlere yürüdü.',
            ),
          ],
          not(flag('onur_kirildi')),
        ),
        block(
          [
            Nx('Merdivenin başında Onur Kılıç. Bize bakmadı. Savcılığın katına çıkan asansörü bekliyordu.'),
            Nx(
              'Asansör geldi. Bindi. Kapı kapanmadan önce kol saatini cebinden çıkardı, bir an baktı, yeniden cebine koydu.',
            ),
            T(
              'Etkin pişmanlık bir kapıdır, demişti Leyla. Onur o kapıya kendi ayağıyla gidiyordu. Kimse ona eşlik etmedi; doğrusu da buydu.',
            ),
          ],
          flag('onur_kirildi'),
        ),
        block(
          [
            Nx('Merdivenin dibinde Ece bekliyordu. Bora’ya yaklaşmadı; Bora da ona. Aralarında üç basamak.'),
            S('ece', 'Abi. Önlüğümü attın mı?'),
            S('bora', 'Atmadım.'),
            S(
              'ece',
              'İyi. Sigortamı yaparsan cumartesi gelirim. Babam da biliyor artık. Bir şey demedi; bu iyi bir şey.',
            ),
          ],
          flag('ece_tanikti'),
        ),
        block(
          [
            Nx(
              'Akşam telefonuma bir mesaj düştü. Defne Yurt: “Haberlerde gördüm. Burcu’ya söyledim, ağladı. Doğum günü videosu bir işe yaradı yani. Annesi hâlâ bilmiyor ama.”',
            ),
            T(
              'Bir doğum günü videosu, iki kadının kahkahası, arka planda on beş saniye. Kimsenin annesi bilmeyecek; mahkeme bildi.',
            ),
          ],
          flag('video_izlendi'),
        ),
        block(
          [
            Nx(
              'Adliyenin önünde, merdivenin altında bir polis aracı. Şoför koltuğunda Sinan Kurt. Bizi görünce camı indirmedi; yalnızca başıyla selam verdi.',
            ),
            T('Kendi tutanağına karşı tanıklık eden bir memur. Komiseri kızmıştır. Kızsın; Sinan bunu da söylemişti.'),
          ],
          flag('ara_sinan'),
        ),
        block([
          card('SETBAŞI — BİR AY SONRA, CUMA GECESİ', 'sokak_yagmur'),
          Nx('Gölge açıktı. Tabelada G yanıyordu. İçeride üç masa doluydu; eskiden on bir dolardı.'),
          S('bora', 'Gelmiyorlar. Gelenler de bakıyor. “Bu o mu?” diye.'),
          Nx('Bir bardağı sildi. Bardak çoktan temizdi.'),
          S('bora', 'Gelirler. Bir gün. Ya da gelmezler. Bar yine açık.'),
          Nx(
            'Kapı açıldı. Simitçi girdi, elinde bir tepsi. Tezgâha bıraktı. “Hayırlı olsun” dedi. Oturmadı; ama gitmedi de.',
          ),
          T('Şüphe bir kapıyı açtı. İçeri girip girmemek Setbaşı’na kaldı. Bir simitçi girdi. Bir başlangıç.'),
        ]),
        block([
          card('ARSLAN HUKUK — GECE', 'buro_gece'),
          S(
            'leyla',
            'Beraat beraattir. Ama Bora’nın yüzüne bak. “Sabit olmadığından” onun için bir yara bandı; kemiği sarmaz.',
          ),
          S('leyla', 'Bir dahaki sefere bandı değil, kemiği sar.'),
          D('Neyi kaçırdım?'),
          S(
            'leyla',
            'Kaçırmadın. Yarım bıraktın. Tanığı çökerttin; iddianın üç kelimesi salonda kırıldı. Ama “haklıydı” demek için dört şartın dördü de kâğıtta olmalıydı.',
          ),
          S(
            'leyla',
            'Katılan yere düştükten sonra Bora tezgâhtan çıktı. O saniyede ne oldu? Mahkeme bilmiyor. Bilmediği için “emin değiliz” dedi.',
          ),
          T(
            'Neyi kaçırdığımı düşündüm. Belki bir bilek. Belki bir rapordaki küçük bir satır. “Şüpheden” değil, “haklıydı” diyebileceğim kâğıdı salona getirmedim.',
          ),
          Nx(
            'Masamda Gölge’nin anahtarı hâlâ duruyordu. Bora geri almayı unutmuştu; ya da unutmamıştı. Ertesi sabah bara götürdüm. Kepenk açıktı. Anahtarı tezgâha bıraktım.',
          ),
          S('bora', 'Çay?'),
          T('Bir bardak çay. Bir davanın sonunda bir avukatın alabileceği en dürüst ücret.'),
          Nx(
            'Çayı tezgâhın müşteri tarafında içtim. Bora arkada, lavabo ile raf arasında duruyordu; o gecenin yerinde. Kepengin aralığından Gökdere’nin sesi geliyordu.',
          ),
          T(
            'Sabit olmadığından. Belki bir gün Bora da bu iki kelimeyi anlayacak. Belki de anlamasına gerek kalmayacak; bar açık.',
          ),
        ]),
        block(
          [
            card('İKİ HAFTA SONRA — BURSA BAROSU', 'adliye'),
            Nx(
              'Mahkemenin yazısı baroya ulaşmıştı: “Tanık Ece Tan’ın beyanının müdafi tarafından yönlendirildiği…” Bir koridor, bir kapı, bir sıra sandalye.',
            ),
            T(
              'Hüküm başka bir yerden geldi; kâğıtlar beni değil, Bora’yı kurtardı. Ece’nin kürsüde ağladığı dakika ise benim dosyamdı. O dosya yeni açılıyordu.',
            ),
            card('Av. Deniz Arslan hakkında disiplin soruşturması başlatıldı.', 'buro_gece', 'fade'),
          ],
          flag('ece_coktu'),
        ),
      ],
    }),
    outcome('CVYO', {
      class: 'OTHER',
      priority: 3,
      // Delil belirler: saldırının katılandan geldiği gösterildi ama tanığın “yerdeki hareket” anlatımı çökmedi ya da ara
      // dönemden yeni bir gelişme gelmedi. Savunmanın talebi (sınır aşımı, terditli, şüphe) sınıfı değiştirmez.
      when: all(not(flag('cokus')), ref('saldiri_kanit'), any(finalAtLeast(T_INDIRIM), ref('mm_tam'))),
      stamp: 'CEZA VERİLMESİNE YER YOK',
      stampTone: 'amber',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza verilmesine yer yok',
      verdictText:
        'Katılanın kırık kadehle gerçekleştirdiği haksız saldırı karşısında sanığın meşru savunma durumunda bulunduğu; ancak katılanın yere düşmesinden sonraki hareketiyle gerekli savunmanın sınırını aştığı, bu aşmanın kolunun kesilmesi ve kaçma imkânı bulunmayan konumu nedeniyle mazur görülebilecek heyecan, korku ve telaştan kaynaklandığı anlaşıldığından, TCK 27/2 uyarınca sanık hakkında CMK 223/3-c gereğince CEZA VERİLMESİNE YER OLMADIĞINA; tebliğden itibaren iki hafta içinde istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because(
          'Kırık kadehin sapının katılanın elinde olduğu ve sanığın kolunu siper ederken yaralandığı anlaşılmıştır; saldırı katılandan gelmiştir.',
        ),
        because(
          'Görgü tanığının, katılan yere düştükten sonraki harekete ilişkin anlatımı duruşmada çürütülmemiştir; mahkeme bu hareketle gerekli savunmanın sınırının aşıldığını kabul etmiştir.',
          not(ref('tekme_yok')),
        ),
        because(
          'Gövdede tekme izi bulunmasa da sanığın tezgâhtan çıkıp yerdeki katılana yönelmesi, saldırının etkisizleştiği ana denk gelen ve sınırı aşan bir hareket olarak değerlendirilmiştir.',
          all(ref('tekme_yok'), not(ref('mm_tam'))),
        ),
        because(
          'Yerdeki hareketin elinde cam bulunan bileğe bası olduğu ileri sürülmüş; mahkeme bu hareketi savunma gereğinin sınırında, heyecan ve korkuyla yapılmış bir hareket olarak kabul etmiştir.',
          ref('mm_tam'),
        ),
        because(
          'Sanığın sınırı aşan hareketi, kolu kesilmiş ve tezgâhın arkasında sıkışmış bir kişinin mazur görülebilecek heyecan ve korkusundan kaynaklanmıştır.',
        ),
        because(
          'Müdafi bu yönde bir talepte bulunmamış olsa da mahkeme, delillerin değerlendirilmesinde taleplerle bağlı değildir (CMK 217/1, 225/2).',
          not(flag('sinir_kabul')),
        ),
        because(
          'Tanık Ece Tan’ın beyanı, müdafi tarafından yönlendirildiği anlaşıldığından hükme esas alınmamıştır. Müdafi hakkında baroya bildirim ayrıca yapılacaktır.',
          flag('ece_coktu'),
        ),
      ],
      legalBasis: 'TCK 25/1, 27/2; CMK 223/3-c, 273/1',
      xp: xp(0.9, { ethicsVar: 'ethics' }),
      howToReach:
        'Saldırının katılandan geldiğini delille göster (sap + avuç ve önkol + kan, ya da video), ama görgü tanığının “yerdeki hareket” anlatımını çökertmeden ya da ara dönemden yeni bir gelişme getirmeden karara git. Mahkeme talebe değil delile bakar: sınırın korku ve heyecanla aşıldığını kabul eder (TCK 27/2).',
      epilogue: [
        block([
          S('hakim', 'Türk Milleti adına…'),
          Nx('“Ceza verilmesine yer olmadığına.” Bora bekledi. Devamı gelecek sandı. Gelmedi.'),
          card('ADLİYE ÖNÜ — ÖĞLEDEN SONRA', 'adliye'),
          S('bora', 'Ceza yok. Ama beraat de değil. Ne bu?'),
          Nx('Anlattım. Meşru savunma, sınır, korku. Uzun anlattım; Bora kısa dinledi.'),
          S('bora', 'Yani korktuğum için affettiler.'),
          S('bora', 'Ben korkmadım avukat hanım.'),
          Nx('Kasketini taktı. Yağmur başlamıştı. Yürüdü; koşmadı.'),
          T('Kanun bazen insanı haklı bulmaz, yalnızca anlar. Bora anlaşılmak istemiyordu. Haklı bulunmak istiyordu.'),
        ]),
        block(
          [
            Nx(
              'Akşam bir mesaj geldi: Ece. “Abiye söyleyin, sigortamı yaptırırsa geri gelirim. Babam da biliyor artık. Bir şey demedi. Bu iyi bir şey.”',
            ),
          ],
          flag('ece_tanikti'),
        ),
        block([
          card('ARSLAN HUKUK — GECE', 'buro_gece'),
          S(
            'leyla',
            'Bileğe basan ayak. Onu gösterseydin, kanun Bora’yı haklı bulurdu. Göstermedin; kanun onu anladı.',
          ),
          S('leyla', 'İkisi aynı şey değil. Ama ikisi de bir adamı eve gönderir.'),
          Nx('Masasındaki ters çerçeveyi düzeltmedi. Sigara paketini çevirdi; bir kez, iki kez.'),
          S(
            'leyla',
            'Bora’ya söyle: mahkeme onu korkak bulmadı. Kanun “korktu” demiyor; “o anda kimse ondan daha soğukkanlı olamazdı” diyor. Kelimeleri doğru seç.',
          ),
          D('Söyledim. “Ben korkmadım” dedi.'),
          S(
            'leyla',
            'Söyleyecek. Bir yıl daha söyleyecek. Sonra bir gün bir müşteriye anlatırken “korkmuştum” diyecek. O gün bitecek.',
          ),
          card('SETBAŞI — BİR AY SONRA', 'sokak_yagmur'),
          Nx(
            'Gölge’nin kepengi açıktı ama tabelada G yine yanmıyordu. Bora içeride, tezgâhın arkasında, aynı yerde duruyordu; lavabo arkada, raflar yanda.',
          ),
          S('bora', 'Tezgâhı değiştirecektim. Daha geniş. Arkasında yer olsun diye.'),
          S('bora', 'Sonra vazgeçtim. Burası benim yerim. Kaçacak yer olmayınca adam kendini bilir.'),
          T(
            'Kanun Bora’yı anladı. Bora kanunu anlamadı. Belki ikisi de yeterince yakındı; aralarında bir tezgâh genişliği.',
          ),
        ]),
        block(
          [
            card('İKİ HAFTA SONRA — BURSA BAROSU', 'adliye'),
            Nx(
              'Mahkemenin yazısı baroya ulaşmıştı: “Tanık Ece Tan’ın beyanının müdafi tarafından yönlendirildiği…” Bir koridor, bir kapı, bir sıra sandalye.',
            ),
            T(
              'Hüküm başka bir yerden geldi; kâğıtlar beni değil, Bora’yı kurtardı. Ece’nin kürsüde ağladığı dakika ise benim dosyamdı. O dosya yeni açılıyordu.',
            ),
            card('Av. Deniz Arslan hakkında disiplin soruşturması başlatıldı.', 'buro_gece', 'fade'),
          ],
          flag('ece_coktu'),
        ),
      ],
    }),
    outcome('INDIRIM', {
      class: 'REDUCED',
      priority: 4,
      // Delil belirler: saldırı gösterilmedi, ama kadehin sanıkça kullanıldığı anlatımı çürüdü ve haksız tahrik soruşturmayla
      // kuruldu. Mahkeme TCK 29’u talep olmasa da re’sen uygular; terditli talep yalnızca skoru etkiler.
      when: all(
        not(flag('cokus')),
        not(ref('saldiri_kanit')),
        ref('tahrik_kanit'),
        ref('kadeh_curudu'),
        finalAtLeast(T_INDIRIM),
      ),
      stamp: 'İNDİRİM · HAGB',
      stampTone: 'amber',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '11 ay 20 gün · HAGB',
      verdictText:
        'Kadehin sanık tarafından kullanıldığı ispatlanamadığından TCK 86/3-e artırımı uygulanmaksızın, sanığın eylemine uyan TCK 86/1 uyarınca alt sınırdan 1 YIL 6 AY hapis; kemik kırığının hayat fonksiyonlarına etkisi hafif (1) derecede olduğundan TCK 87/3 uyarınca 1/6 oranında artırılarak 1 YIL 9 AY; suçun katılanın haksız hareketinin oluşturduğu hiddetin etkisi altında işlendiği anlaşıldığından TCK 29 uyarınca 1/3 oranında indirilerek 1 YIL 2 AY; sanığın duruşmadaki tutumu gözetilerek TCK 62/1 uyarınca 1/6 indirimle 11 AY 20 GÜN HAPİS cezası ile cezalandırılmasına; sanığın sabıkasız olması ve kişiliği gözetilerek CMK 231/5 uyarınca HÜKMÜN AÇIKLANMASININ GERİ BIRAKILMASINA, katılanın zararının denetim süresi içinde giderilmesi koşuluyla (CMK 231/9) beş yıl denetim süresine tabi tutulmasına (CMK 231/8); tebliğden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 231/12, 273/1).',
      reasoning: [
        because(
          'Kırık kadehin sanık tarafından kullanıldığına dair delil bulunmadığından silahla işleme artırımı uygulanmamıştır.',
        ),
        because(
          'Kriminal rapora göre kırık sapı kavrayan el katılanındır; ancak katılanın bu camla sanığa saldırdığı ve sanığın kendini korumak için vurduğu duruşmada delille kurulmamıştır. Katılanın elinde kırık camla tezgâha yönelmesi haksız hareket olarak değerlendirilmiştir.',
          flag('krim_avuc'),
        ),
        because(
          'Olay, katılanın garsona sarkıntılığı ve sanığa yönelik davranışıyla başlamıştır; haksız tahrik hükümleri uygulanmıştır.',
        ),
        because(
          'Cumhuriyet savcısı da silahla işleme artırımının uygulanmamasını ve haksız tahrik hükümlerini talep etmiştir.',
          flag('mutalaa_indirim'),
        ),
        because(
          'Tanık Ece Tan, katılanın daha önce de kendisini rahatsız ettiğini beyan etmiştir.',
          all(flag('fact_taciz'), flag('ece_tanikti')),
        ),
        because(
          'Kemik kırığı Adli Tıp raporuna göre hafif (1) derecededir; özel klinik raporu uzman görüşü olarak değerlendirilmiştir.',
          flag('ozel_rapor_red'),
        ),
        because('Sanığın sabıkasız olduğu ve yeniden suç işlemeyeceği kanaati gözetilmiştir.'),
        because(
          'Tanık Ece Tan’ın beyanı, müdafi tarafından yönlendirildiği anlaşıldığından hükme esas alınmamıştır. Müdafi hakkında baroya bildirim ayrıca yapılacaktır.',
          flag('ece_coktu'),
        ),
      ],
      legalBasis: 'TCK 86/1, 87/3, 29, 62/1; CMK 231/5, 231/6, 231/8, 231/9, 231/12, 273/1',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Katılanın haksız hareketini soruşturmayla göster (Ece’nin tanıklığı, Kriminal raporun avuç bulgusu ya da iki celsede sarkıntılık çelişkisi) ve kadehin sanıkça kullanıldığı anlatımını çürüt; ama saldırının katılandan geldiğini kâğıtla kurma. Mahkeme tahriki re’sen uygular; terditli talep yalnızca skoru artırır.',
      epilogue: [
        block([
          S('hakim', 'Türk Milleti adına…'),
          Nx(
            '“Hükmün açıklanmasının geri bırakılmasına.” Hâkim bunu Bora’ya ayrıca anlattı: beş yıl, bir suç işlemezse hiç olmamış sayılacak.',
          ),
          S('bora', 'Hiç olmamış sayılacak. Ama oldu.'),
          card('SETBAŞI — BİR HAFTA SONRA', 'sokak_sabah'),
          Nx('Bora bir merdivenin tepesinde, tabelanın önündeydi. Elinde bir tornavida, yeni bir ampul. G harfi.'),
          S('bora', 'Üç aydır yanmıyordu. Herkes “ölge” okuyordu. Kimse söylemedi.'),
          Nx('Ampulü taktı. Gündüzdü; yandığını göremedik. Ama yandı.'),
          T('Kazandık mı? Bora “haklıydın ama” cümlesini beş yıl taşıyacak. Belki ömür boyu.'),
          Nx(
            'Merdivenden indi. Tornavidayı cebine koydu, ellerini pantolonuna sildi. Sol kolunda, gömleğin altında, altı dikişin izi.',
          ),
          S('bora', 'Beş yıl. Beş yıl içinde biri bana kafa tutarsa ne yapacağım? Tezgâhın arkasına saklanacak mıyım?'),
          D('Polisi arayacaksın. O gece de aradın.'),
          S('bora', 'Aradım. Önce vurdum, sonra aradım. Sıra önemli mi?'),
          T(
            'Önemliydi. Kanun sırayı sorar; Bora’nın cevabı doğruydu ama dosyada eksik kalmıştı. Eksik bir cevap, beş yıllık bir sessizlikle ödenir.',
          ),
        ]),
        block(
          [
            card('ARSLAN HUKUK — GECE', 'buro_gece'),
            S('leyla', 'İyi bir indirim. Ama dosyada bir bilek, bir video, bir garson vardı. Hangisini getirdin?'),
            T('Hangisini getirmediğimi biliyordum. Leyla da biliyordu.'),
          ],
          not(flag('ece_tanikti')),
        ),
        block(
          [
            card('ARSLAN HUKUK — GECE', 'buro_gece'),
            S(
              'leyla',
              'Ece geldi, konuştu, gördüğünü söyledi. Sen de “haklıydı ama” dedin. Kızın cesaretini yarıya böldün.',
            ),
            S(
              'leyla',
              'Terditli savunma meşrudur. Ama ikinci talep birinci talebin yerine geçmesin. Hâkim hangisini daha yüksek sesle söylediğini duyar.',
            ),
            T('Haklıydı. Beraati istemiştim; indirimi daha uzun anlatmıştım.'),
          ],
          flag('ece_tanikti'),
        ),
        block(
          [
            card('İKİ HAFTA SONRA — BURSA BAROSU', 'adliye'),
            Nx(
              'Mahkemenin yazısı baroya ulaşmıştı: “Tanık Ece Tan’ın beyanının müdafi tarafından yönlendirildiği…” Bir koridor, bir kapı, bir sıra sandalye.',
            ),
            T(
              'Hüküm başka bir yerden geldi; kâğıtlar beni değil, Bora’yı kurtardı. Ece’nin kürsüde ağladığı dakika ise benim dosyamdı. O dosya yeni açılıyordu.',
            ),
            card('Av. Deniz Arslan hakkında disiplin soruşturması başlatıldı.', 'buro_gece', 'fade'),
          ],
          flag('ece_coktu'),
        ),
      ],
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 5,
      when: always,
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '2 yıl 11 ay hapis',
      verdictText: `${MAHKUMIYET_HESAP}; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).`,
      reasoning: [
        because(
          'Tanık beyanı, olay yeri tutanağı ve adli raporlar birlikte değerlendirilerek sanığın kırık kadehle katılanı yaraladığı kabul edilmiştir.',
          all(not(ref('saldiri_kanit')), not(ref('kadeh_curudu'))),
        ),
        because(
          'Tanık beyanı ve olay yeri tutanağı birlikte değerlendirilmiş; savunmanın kadehin kullanımına ilişkin itirazları sanığın eylemini açıklamaya yetmemiştir.',
          all(not(ref('saldiri_kanit')), ref('kadeh_curudu')),
        ),
        because(
          'Savunmanın elindeki bulgular duruşmada hükme esas alınabilecek düzende ortaya konamamış; mahkeme, çöken savunma karşısında iddianamedeki anlatımı esas almıştır.',
          ref('saldiri_kanit'),
        ),
        because(
          'Savunmanın inandırıcılığı duruşmada çöktü; mahkeme iddianamedeki anlatımı esas aldı.',
          all(flag('cokus'), not(ref('saldiri_kanit'))),
        ),
        because(
          'Tanık Ece Tan’ın beyanı, müdafi tarafından yönlendirildiği anlaşıldığından hükme esas alınmamıştır. Müdafi hakkında baroya bildirim ayrıca yapılacaktır.',
          flag('ece_coktu'),
        ),
        because(
          'Özel klinik raporu itirazsız kalmış, kırığın derecesi tartışmalı hâle gelmiştir; mahkeme Adli Tıp raporunu esas almıştır.',
          flag('ozel_kabul'),
        ),
        because(
          'Sanığın barın kayıt cihazı hakkında gerçeğe aykırı beyanda bulunduğu anlaşılmıştır.',
          flag('kamera_ortaya'),
        ),
      ],
      legalBasis: 'TCK 86/1, 86/3-e, 87/3, 62/1, 53; CMK 231/5, 273/1',
      xp: { if: { when: flag('cokus'), then: xp(0.3), else: xp(0.6, { ethicsVar: 'ethics' }) } },
      howToReach:
        'Varsayılan sonuç: saldırının katılandan geldiği gösterilmez ve diğer sonuçların koşulları sağlanmazsa ya da savunma kürsüde çökerse verilir.',
      epilogue: [
        block([
          S('hakim', 'Türk Milleti adına…'),
          Nx(
            '“İki yıl on bir ay.” Bora ayakta dinledi. Kıpırdamadı. Hâkim “istinaf” dediğinde bana baktı; ne olduğunu sormadı.',
          ),
          card('ADLİYE ÖNÜ — ÖĞLEDEN SONRA', 'adliye'),
          Nx('Yağmur. Bora merdivenin altında durdu. Cebinden anahtarı çıkardı: Gölge’nin anahtarı. Bana uzattı.'),
          S('bora', 'Barı sat. Ya da yak. Fark etmez.'),
          Nx('Almadım. Avucuma bıraktı ve yürüdü. Kasketini takmayı unutmuştu.'),
          T('İstinaf var. İki hafta. Ama elimde bir anahtar ve yağmurda yürüyen bir adamın sırtı vardı.'),
        ]),
        block(
          [
            card('ARSLAN HUKUK — GECE', 'buro_gece'),
            S('leyla', 'Salonda kendi delillerinle savaştın Deniz. Kaybedeceğin tek savaş budur.'),
            Nx(
              'Tolga Şen’in koridorda söylediği cümle kulağımdaydı: “Meslektaşım, bir dahaki sefere delilinizi sunmadan önce okuyun.”',
            ),
          ],
          flag('cokus'),
        ),
        block(
          [
            card('ARSLAN HUKUK — GECE', 'buro_gece'),
            S('leyla', 'Dosyada bir kol vardı, Deniz. Altı dikiş. İlk akşam görmüştün.'),
            T('Görmüştüm. Bir kolu görmekle onu bir salona taşımak arasında bir dosya kadar mesafe var.'),
            S('leyla', 'İstinaf dilekçesini yarın sabaha yaz. Bu gece değil. Bu gece yazarsan öfken yazar.'),
            Nx('Kapıyı kapatmadan önce durdu.'),
            S(
              'leyla',
              'Fotoğraf 3. Tezgâhın içindeki kan. Bir de sapın yeri. İstinaf yeni bir delil sevmez ama okunmamış bir fotoğrafı sever.',
            ),
            T('Okunmamış bir fotoğraf. İki ay boyunca dosyanın içindeydi. Ben başka yerlere bakmıştım.'),
          ],
          not(flag('cokus')),
        ),
        block([
          card('SETBAŞI — ÜÇ HAFTA SONRA, GECE', 'sokak_karanlik'),
          Nx(
            'Gölge’nin kepengi inikti. Kapıda bir kâğıt: “KİRALIKTIR.” Yağmur kâğıdın köşesini kaldırmış, mürekkebi akıtmıştı.',
          ),
          Nx(
            'Köprünün altında sarı lamba yanıyordu. Gökdere taşmıştı yine. Biri kepengin önünde durdu, kâğıda baktı, yürüdü. Kasketliydi; belki değildi.',
          ),
          T(
            'İstinaf dilekçesi masamda. Bora imzalamaya gelmedi; “sen bilirsin avukat hanım” diye bir mesaj attı. Bilmiyorum. Ama yazacağım.',
          ),
        ]),
        block(
          [
            card('İKİ HAFTA SONRA — BURSA BAROSU', 'adliye'),
            Nx(
              'Mahkemenin yazısı baroya ulaşmıştı: “Tanık Ece Tan’ın beyanının müdafi tarafından yönlendirildiği…” Bir koridor, bir kapı, bir sıra sandalye.',
            ),
            T(
              'Hüküm başka bir yerden geldi; kâğıtlar beni değil, Bora’yı kurtardı. Ece’nin kürsüde ağladığı dakika ise benim dosyamdı. O dosya yeni açılıyordu.',
            ),
            card('Av. Deniz Arslan hakkında disiplin soruşturması başlatıldı.', 'buro_gece', 'fade'),
          ],
          flag('ece_coktu'),
        ),
      ],
    }),
  ],
};
