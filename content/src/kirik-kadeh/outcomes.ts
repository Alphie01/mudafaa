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
import type { CasePart, Cond, Line } from '../../../tools/content/src/kit/index.js';
import { T_BERAAT, T_INDIRIM } from './meta.js';
import { D, Nx, S, T, card, fx } from './shared.js';

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
      when: flag('ece_coktu'),
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '2 yıl 11 ay hapis',
      verdictText: `${MAHKUMIYET_HESAP}; tanık Ece Tan’ın beyanının, müdafi tarafından yönlendirildiği anlaşıldığından hükme esas alınmamasına; müdafi hakkında suç duyurusunda bulunulmasına ve dosya örneğinin baroya gönderilmesine; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).`,
      reasoning: [
        because('Tanık Ece Tan, duruşmada müdafinin kendisine ne söyleyeceğini önceden söylediğini beyan etmiş; tanığın beyanı bu nedenle güvenilir bulunmamıştır.'),
        because('Yönlendirilen tanık beyanı, savunmanın diğer delillerinin de ikna gücünü zayıflatmıştır.'),
        because('Katılanın çelişkili beyanları tutanağa geçmiş olsa da mahkeme iddianamedeki anlatımı esas almıştır.', ref('findings')),
      ],
      legalBasis: 'TCK 86/1, 86/3-e, 87/3, 62/1, 53; CMK 231/5, 273/1; TCK 277; Av.K. md. 34',
      xp: xp(0),
      howToReach:
        'Ece’ye mahkemede ne söyleyeceğini söylemek ve onu tanık olarak çağırtmak. (Bu bir uyarı sonudur: tanığa yalnızca doğruyu söylemesini öğütle; yönlendirdiysen ara dönemde düzelt.)',
      ethicsCard:
        'Avukat, tanığa ne söyleyeceğini söyleyemez, görmediğini “gördüm” dedirtemez. Bu hem meslek kurallarına aykırıdır (Av.K. md. 34; TBB Meslek Kuralları) hem de tanığı etkileme suçunu oluşturabilir (TCK 277). Tanıkla görüşmek yasak değildir; doğru sınır, “gördüğünü söyle, görmediğini söyleme” demek ve kararı tanığa bırakmaktır. Yönlendirilen tanık kürsüde çöktüğünde yalnızca kendi beyanını değil, gerçeği söylediği kısmı da yanına alır.',
      epilogue: [
        block([
          S('hakim', 'Türk Milleti adına…'),
          Nx('Hüküm okunurken Ece salonun arkasında duruyordu. Çıkmadı. Dinledi. “İki yıl on bir ay” denince arkasını döndü.'),
          card('ADLİYE ÖNÜ — ÖĞLEDEN SONRA', 'adliye'),
          Nx('Merdivenlerde yağmur. Ece’nin babası aşağıda bekliyordu: kır saçlı, kasketli, Kütahya plakalı bir arabanın yanında. Kızına sarılmadı. Kapıyı açtı.'),
          Nx('Bora merdivenin başında durdu. Ece’ye bir şey söylemek istedi. Ece başını salladı: söyleme. Arabaya bindi.'),
          S('bora', 'Kız doğruyu söyledi, avukat hanım. Kadehi o kırdı. Herkes duydu.'),
          S('bora', 'Ama kimse inanmadı. Senin yüzünden.'),
          Nx('Anahtarı cebinden çıkardı, bana uzattı. Gölge’nin anahtarı. Almadım. Merdivene bıraktı.'),
          card('ARSLAN HUKUK — GECE', 'buro_gece'),
          Nx('Leyla odama girdi. Elinde ince, kırmızı kapaklı bir kitapçık: meslek kuralları. Masama bıraktı. Hiçbir şey söylemedi.'),
          T('Ece gördüğünü söyleseydi yeterdi. Ben ona gördüğünden fazlasını söyletmek istedim. Fazlası, azını da götürdü.'),
          fx(card('Av. Deniz Arslan hakkında disiplin soruşturması başlatıldı.'), 'fade'),
        ]),
      ],
    }),
    outcome('BERAAT_D', {
      class: 'ACQUITTAL',
      priority: 1,
      when: all(not(flag('cokus')), flag('mm_kabul'), cmp(v('pers'), '>=', 7), finalAtLeast(T_BERAAT)),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Meşru savunma',
      verdictText:
        'Sanık Bora Yalçın’ın eyleminin, katılanın kırık kadehle gerçekleştirdiği haksız saldırıyı o an def etmek zorunluluğuyla ve saldırıyla orantılı biçimde işlendiği, TCK 25/1 kapsamında meşru savunma sınırları içinde kaldığı anlaşıldığından, yüklenen suç bakımından hukuka uygunluk nedeninin varlığı sebebiyle CMK 223/2-d uyarınca BERAATİNE; CMK 141/1 ve 142 kapsamındaki tazminat haklarının bildirilmesine (CMK 231/3); karar ve dosya örneklerinin katılan hakkındaki soruşturmaya eklenmek ve tanık Onur Kılıç hakkında yalan tanıklık iddiası yönünden değerlendirilmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; tebliğden itibaren iki hafta içinde istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because('Kriminal inceleme, fotoğraf 7 ve katılanın sağ avucundaki kesiye göre kırık kadehin sapı katılanın elindedir; saldırı katılandan gelmiştir.'),
        because('Sanığın sol önkolunun ulnar yüzündeki kesi ve tezgâhın iç tarafındaki kan, sanığın kaçma imkânı olmayan bir konumda kolunu siper ettiğini göstermektedir.'),
        because('Adli Tıp raporuna göre katılanın gövdesinde tekme izi bulunmamakta, sağ bileğindeki bası izi elinde cam tutan bileğe basılarak sapın bıraktırıldığını göstermektedir.'),
        because('Görgü tanığı Onur Kılıç’ın katılanın çalışanı olduğu ve oturduğu yerden olay yerini göremediği anlaşılmış; tanık duruşmada kolluk beyanının gerçeği yansıtmadığını söylemiştir.', ref('tanik_coktu')),
        because('Bilirkişi incelemesinden geçen kesintisiz video kaydı, saldırının katılandan geldiğini doğrulamaktadır.', flag('video_izlendi')),
        because('Tanık Ece Tan’ın yönlendirilmediği anlaşılan beyanı olayın başlangıcını açıklamaktadır.', flag('ece_tanikti')),
        because('Cumhuriyet savcısı da esas hakkındaki mütalaasında sanığın beraatini talep etmiştir.', flag('mutalaa_beraat')),
        because('Olay yeri tutanağındaki “tezgâh önü” ibaresi, aynı ekibin çektiği fotoğraflarla birlikte değerlendirilmiştir.', flag('tutanak_itiraz')),
        because('Sanığın parmak izinin yalnızca kadehin tabanında, servis tutuşuyla uyumlu bulunduğu anlaşılmıştır.', flag('krim_taban')),
        because('Sanık son sözünde olayı kendi sözleriyle, eksiksiz ve kendi aleyhine olan yönleriyle anlatmıştır.', flag('son_soz_iyi')),
      ],
      legalBasis: 'TCK 25/1; CMK 223/2-d, 141/1, 142, 231/3, 273/1',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Meşru savunmanın dört şartını delille kur: saldırının katılandan geldiği (sap + avuç, önkol + kan ya da Kriminal rapor), “tekme”nin bileğe bası olduğu (ATK + tahta), tanığın tarafsızlığının çöktüğü ve bağımsız bir anlatım (video, Ece ya da çözülen tanık); esas savunmada 223/2-d’yi iste.',
      epilogue: [
        block([
          S('hakim', 'Türk Milleti adına…'),
          Nx('“Beraatine” kelimesi salona düştüğünde Bora kıpırdamadı. Hâkim gerekçeyi okumaya devam etti; “meşru savunma” dediğinde Bora gözlerini kapadı.'),
          Nx('Ayakta dinlemişti. Oturmasına izin verildiğinde oturmadı. Hâkime başıyla bir selam verdi; bir ringin ortasında, maçtan sonra hakeme verilen türden.'),
          card('SETBAŞI — İKİ HAFTA SONRA, AKŞAM', 'sokak_gece'),
          Nx('Gölge’nin kepengi yarıya kadar açıktı. Tabelada G harfi yanıyordu. Bora yeni bir ampul takmıştı; ilk iş.'),
          Nx('İçeride duvardaki boks fotoğrafı yoktu. Yerinde açık renkli bir dikdörtgen, çerçevenin yıllardır sakladığı boya.'),
          S('bora', 'İndirdim. Artık gerek yok.'),
          T('Neye gerek yoktu, sormadım. Bir adam gençliğini duvardan indirince, yerine bir şey asmak için acele etmez.'),
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
            Nx('Kapının yanındaki masada, köşede, gözlüklü bir adam tek başına su içiyordu. Kol saati yoktu. Bora ona bir şey söylemedi; hesap da kesmedi.'),
            T('Onur Kılıç savcılığa gitmişti. Gideceğim demişti. Kimse ona yardım etmemişti; belki en çok o yüzden gitti.'),
          ],
          flag('onur_kirildi'),
        ),
        block([
          card('ARSLAN HUKUK — GECE', 'buro_gece'),
          Nx('Leyla kapıda durdu. Elinde açılmamış sigara paketi.'),
          S('leyla', 'Meşru müdafaa bir haktır, Deniz. Ama hak, ispat edilene kadar bir hikâyedir. Sen hikâyeyi hakka çevirdin.'),
          Nx('Paketi bir kez çevirdi. Masasındaki ters çerçeveye baktı. Sonra ışığı kapattı.'),
          T('Barlarda iki tür sessizlik vardır. Bu gece üçüncüsünü öğrendim: bir dosya kapandıktan sonraki.'),
        ]),
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 2,
      when: all(not(flag('cokus')), any(flag('supheden'), flag('mm_kabul')), finalAtLeast(T_BERAAT)),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok · Şüpheden yararlanma',
      verdictText:
        'Sanık Bora Yalçın’ın katılanı kırık kadehle yaraladığına ve yerde darp ettiğine ilişkin iddianame anlatımının, tanık beyanının güvenilirliğini yitirmesi ve adli raporlarla çelişmesi nedeniyle ispatlanamadığı; sanığın kabul ettiği tek darbenin ise haksız bir saldırıya karşı yapılmadığının şüpheye yer bırakmayacak biçimde ortaya konamadığı anlaşıldığından, üzerine atılı suçu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; CMK 141/1 ve 142 kapsamındaki tazminat haklarının bildirilmesine (CMK 231/3); tebliğden itibaren iki hafta içinde istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because('Görgü tanığı Onur Kılıç’ın katılanın çalışanı olduğu, katılanla birlikte geldiği ve hesabı kendi kartıyla ödediği anlaşılmıştır.', any(flag('contra_o1'), flag('contra_k2'))),
        because('Tanığın oturduğu masadan tezgâhın önündeki zemin görülmemektedir.', flag('contra_o2')),
        because('Katılan acil serviste “yumrukla vurulduğunu” beyan etmiş, yüzünde kesi bulunmamaktadır; kadehin yüze vurulduğu anlatımı desteklenmemiştir.', any(flag('contra_k4'), flag('contra_o3'))),
        because('Adli Tıp raporunda gövdede tekme izi bulunmamaktadır.', any(flag('contra_o4'), flag('atk_govde'))),
        because('Kırık kadehin sanık tarafından kullanıldığı ispatlanamamış; sap katılanın elinin yanında bulunmuştur.', any(flag('contra_k3'), has('ev_kriminal'))),
        because('Eczane kaydında saat 01.52’de arka sokaktan çıkan bir çalışan görülmekte; olayın dosyaya yansımayan bir tanığı bulunduğu anlaşılmaktadır.', all(flag('ecz_ece'), not(flag('ece_tanikti')))),
        because('Sanığın suçu işlediğine dair kesin ve inandırıcı delil yoktur; şüpheden sanık yararlanır (Anayasa 38/4; AİHS 6/2).'),
      ],
      legalBasis: 'CMK 223/2-e; Anayasa 38/4; AİHS 6/2; CMK 141/1, 142, 231/3, 273/1',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'İki celsede en az dört çelişkiyi delille aç (katılanın alkolü, tanıdıklık, avuçtaki kesi, “yumrukla vuruldum”, tanığın görüşü, tekme izi yok…) ve esas savunmada şüpheden yararlanmayı iste.',
      epilogue: [
        block([
          S('hakim', 'Türk Milleti adına…'),
          Nx('“Beraatine.” Bora bir an ne duyduğunu anlamadı. Bana baktı; başımı salladım. Hâkime baktı; hâkim gerekçeyi okuyordu.'),
          Nx('“Sabit olmadığından.” Bora bu iki kelimeyi koridorda üç kez tekrarladı. Her seferinde biraz daha az anladı.'),
          S('bora', 'Sabit değil. Yani… haklı mıyım, değil miyim?'),
          T('Beraat ettin, demek isterdim. Mahkeme haklı olduğunu söylemedi; haksız olduğunun ispatlanamadığını söyledi. Bir avukat için büyük fark değil. Bora için büyük fark.'),
          Nx('Adliyenin önünde yağmur durmuştu. Bora merdivenin başında kasketini cebinden çıkardı, taktı. Bir an göğe baktı; Uludağ bulutun içindeydi.'),
          S('bora', 'Avukat hanım. Teşekkür ederim. Ama bir şey soracağım: sen ne düşünüyorsun? Ben haklı mıyım?'),
          T('Bir avukat bu soruya cevap vermez. Bir avukatın düşüncesi hüküm değildir.'),
          Nx('Cevap vermedim. Bora burnundan nefes verdi; Bora’nın gülmesi buydu. Anladı.'),
        ]),
        block(
          [
            Nx('Koridorun sonunda Serkan vekilinin kolundan tutmuş, bir şey söylüyordu. Sesi yükseldi: “Daha bitmedi!” Tolga Şen kolunu nazikçe çekti ve merdivenlere yürüdü.'),
          ],
          not(flag('onur_kirildi')),
        ),
        block(
          [
            Nx('Merdivenin başında Onur Kılıç. Bize bakmadı. Savcılığın katına çıkan asansörü bekliyordu.'),
          ],
          flag('onur_kirildi'),
        ),
        block(
          [
            Nx('Merdivenin dibinde Ece bekliyordu. Bora’ya yaklaşmadı; Bora da ona. Aralarında üç basamak.'),
            S('ece', 'Abi. Önlüğümü attın mı?'),
            S('bora', 'Atmadım.'),
            S('ece', 'İyi. Sigortamı yaparsan cumartesi gelirim. Babam da biliyor artık. Bir şey demedi; bu iyi bir şey.'),
          ],
          flag('ece_tanikti'),
        ),
        block([
          card('SETBAŞI — BİR AY SONRA, CUMA GECESİ', 'sokak_yagmur'),
          Nx('Gölge açıktı. Tabelada G yanıyordu. İçeride üç masa doluydu; eskiden on bir dolardı.'),
          S('bora', 'Gelmiyorlar. Gelenler de bakıyor. “Bu o mu?” diye.'),
          Nx('Bir bardağı sildi. Bardak çoktan temizdi.'),
          S('bora', 'Gelirler. Bir gün. Ya da gelmezler. Bar yine açık.'),
          Nx('Kapı açıldı. Simitçi girdi, elinde bir tepsi. Tezgâha bıraktı. “Hayırlı olsun” dedi. Oturmadı; ama gitmedi de.'),
          T('Şüphe bir kapıyı açtı. İçeri girip girmemek Setbaşı’na kaldı. Bir simitçi girdi. Bir başlangıç.'),
        ]),
        block([
          card('ARSLAN HUKUK — GECE', 'buro_gece'),
          S('leyla', 'Beraat beraattir. Ama Bora’nın yüzüne bak. “Sabit olmadığından” onun için bir yara bandı; kemiği sarmaz.'),
          S('leyla', 'Bir dahaki sefere bandı değil, kemiği sar.'),
          D('Neyi kaçırdım?'),
          S('leyla', 'Kaçırmadın. Yarım bıraktın. Saldırıyı gösterdin, belki. Ama “haklıydı” demek için dört şart lazımdı; sen “emin değiliz” dedin. Mahkeme de öyle dedi.'),
          T('Neyi kaçırdığımı düşündüm. Bir kayıt, bir tanık, bir bilek. Bir dahaki sefere.'),
        ]),
      ],
    }),
    outcome('CVYO', {
      class: 'OTHER',
      priority: 3,
      when: all(not(flag('cokus')), flag('sinir_kabul'), finalAtLeast(T_INDIRIM)),
      stamp: 'CEZA VERİLMESİNE YER YOK',
      stampTone: 'amber',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza verilmesine yer yok',
      verdictText:
        'Katılanın kırık kadehle gerçekleştirdiği haksız saldırı karşısında sanığın meşru savunma durumunda bulunduğu; ancak katılanın yere düşmesinden sonraki hareketiyle gerekli savunmanın sınırını aştığı, bu aşmanın kolunun kesilmesi ve kaçma imkânı bulunmayan konumu nedeniyle mazur görülebilecek heyecan, korku ve telaştan kaynaklandığı anlaşıldığından, TCK 27/2 uyarınca sanık hakkında CMK 223/3-c gereğince CEZA VERİLMESİNE YER OLMADIĞINA; tebliğden itibaren iki hafta içinde istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because('Kırık kadehin sapının katılanın elinde olduğu ve sanığın kolunu siper ederken yaralandığı anlaşılmıştır; saldırı katılandan gelmiştir.'),
        because('Katılan yere düştükten sonra sanığın hareketinin gerekli olup olmadığı tam olarak aydınlatılamamıştır.', not(ref('tekme_yok'))),
        because('Sanığın sınırı aşan hareketi, kolu kesilmiş ve tezgâhın arkasında sıkışmış bir kişinin mazur görülebilecek heyecan ve korkusundan kaynaklanmıştır.'),
      ],
      legalBasis: 'TCK 25/1, 27/2; CMK 223/3-c, 273/1',
      xp: xp(0.9, { ethicsVar: 'ethics' }),
      howToReach:
        'Saldırının katılandan geldiğini delille göster; “yerdeki hareket” aydınlanmadığında esas savunmada sınırın korku ve heyecanla aşıldığını (TCK 27/2) iste.',
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
            Nx('Akşam bir mesaj geldi: Ece. “Abiye söyleyin, sigortamı yaptırırsa geri gelirim. Babam da biliyor artık. Bir şey demedi. Bu iyi bir şey.”'),
          ],
          flag('ece_tanikti'),
        ),
        block([
          card('ARSLAN HUKUK — GECE', 'buro_gece'),
          S('leyla', 'Bileğe basan ayak. Onu gösterseydin, kanun Bora’yı haklı bulurdu. Göstermedin; kanun onu anladı.'),
          S('leyla', 'İkisi aynı şey değil. Ama ikisi de bir adamı eve gönderir.'),
        ]),
      ],
    }),
    outcome('INDIRIM', {
      class: 'REDUCED',
      priority: 4,
      when: all(not(flag('cokus')), flag('terditli'), ref('tahrik_kanit'), finalAtLeast(T_INDIRIM)),
      stamp: 'İNDİRİM · HAGB',
      stampTone: 'amber',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '11 ay 20 gün · HAGB',
      verdictText:
        'Kadehin sanık tarafından kullanıldığı ispatlanamadığından TCK 86/3-e artırımı uygulanmaksızın, sanığın eylemine uyan TCK 86/1 uyarınca alt sınırdan 1 YIL 6 AY hapis; kemik kırığının hayat fonksiyonlarına etkisi hafif (1) derecede olduğundan TCK 87/3 uyarınca 1/6 oranında artırılarak 1 YIL 9 AY; suçun katılanın haksız hareketinin oluşturduğu hiddetin etkisi altında işlendiği anlaşıldığından TCK 29 uyarınca 1/3 oranında indirilerek 1 YIL 2 AY; sanığın duruşmadaki tutumu gözetilerek TCK 62/1 uyarınca 1/6 indirimle 11 AY 20 GÜN HAPİS cezası ile cezalandırılmasına; sanığın sabıkasız olması ve kişiliği gözetilerek CMK 231/5 uyarınca HÜKMÜN AÇIKLANMASININ GERİ BIRAKILMASINA ve beş yıl denetim süresine tabi tutulmasına; itiraz yolu açık olmak üzere (CMK 231/12).',
      reasoning: [
        because('Kırık kadehin sanık tarafından kullanıldığına dair delil bulunmadığından silahla işleme artırımı uygulanmamıştır.'),
        because('Olay, katılanın garsona sarkıntılığı ve sanığa yönelik davranışıyla başlamıştır; haksız tahrik hükümleri uygulanmıştır.'),
        because('Cumhuriyet savcısı da silahla işleme artırımının uygulanmamasını ve haksız tahrik hükümlerini talep etmiştir.', flag('mutalaa_indirim')),
        because('Tanık Ece Tan, katılanın daha önce de kendisini rahatsız ettiğini beyan etmiştir.', all(flag('fact_taciz'), flag('ece_tanikti'))),
        because('Kemik kırığı Adli Tıp raporuna göre hafif (1) derecededir; özel klinik raporu uzman görüşü olarak değerlendirilmiştir.', flag('ozel_rapor_red')),
        because('Sanığın sabıkasız olduğu ve yeniden suç işlemeyeceği kanaati gözetilmiştir.'),
      ],
      legalBasis: 'TCK 86/1, 87/3, 29, 62/1; CMK 231/5, 231/12',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach: 'Katılanın haksız hareketini göster ve esas savunmada terditli olarak tahrik ve silah artırımının düşmesini iste.',
      epilogue: [
        block([
          S('hakim', 'Türk Milleti adına…'),
          Nx('“Hükmün açıklanmasının geri bırakılmasına.” Hâkim bunu Bora’ya ayrıca anlattı: beş yıl, bir suç işlemezse hiç olmamış sayılacak.'),
          S('bora', 'Hiç olmamış sayılacak. Ama oldu.'),
          card('SETBAŞI — BİR HAFTA SONRA', 'sokak_sabah'),
          Nx('Bora bir merdivenin tepesinde, tabelanın önündeydi. Elinde bir tornavida, yeni bir ampul. G harfi.'),
          S('bora', 'Üç aydır yanmıyordu. Herkes “ölge” okuyordu. Kimse söylemedi.'),
          Nx('Ampulü taktı. Gündüzdü; yandığını göremedik. Ama yandı.'),
          T('Kazandık mı? Bora “haklıydın ama” cümlesini beş yıl taşıyacak. Belki ömür boyu.'),
        ]),
        block(
          [
            S('leyla', 'İyi bir indirim. Ama dosyada bir bilek, bir video, bir garson vardı. Hangisini getirdin?'),
            T('Hangisini getirmediğimi biliyordum. Leyla da biliyordu.'),
          ],
          not(flag('ece_tanikti')),
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
        because('Tanık beyanı, olay yeri tutanağı ve adli raporlar birlikte değerlendirilerek sanığın kırık kadehle katılanı yaraladığı kabul edilmiştir.'),
        because('Savunmanın inandırıcılığı duruşmada çöktü; mahkeme iddianamedeki anlatımı esas aldı.', flag('cokus')),
        because('Özel klinik raporu itirazsız kalmış, kırığın derecesi tartışmalı hâle gelmiştir; mahkeme Adli Tıp raporunu esas almıştır.', flag('ozel_kabul')),
        because('Sanığın barın kayıt cihazı hakkında gerçeğe aykırı beyanda bulunduğu anlaşılmıştır.', flag('kamera_ortaya')),
      ],
      legalBasis: 'TCK 86/1, 86/3-e, 87/3, 62/1, 53; CMK 231/5, 273/1',
      xp: { if: { when: flag('cokus'), then: xp(0.3), else: xp(0.6, { ethicsVar: 'ethics' }) } },
      howToReach: 'Varsayılan sonuç: diğer sonuçların koşulları sağlanmazsa verilir.',
      epilogue: [
        block([
          S('hakim', 'Türk Milleti adına…'),
          Nx('“İki yıl on bir ay.” Bora ayakta dinledi. Kıpırdamadı. Hâkim “istinaf” dediğinde bana baktı; ne olduğunu sormadı.'),
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
            Nx('Tolga Şen’in koridorda söylediği cümle kulağımdaydı: “Meslektaşım, bir dahaki sefere delilinizi sunmadan önce okuyun.”'),
          ],
          flag('cokus'),
        ),
        block(
          [
            card('ARSLAN HUKUK — GECE', 'buro_gece'),
            S('leyla', 'Dosyada bir kol vardı, Deniz. Altı dikiş. İlk akşam görmüştün.'),
            T('Görmüştüm. Bir kolu görmekle onu bir salona taşımak arasında bir dosya kadar mesafe var.'),
          ],
          not(flag('cokus')),
        ),
      ],
    }),
  ],
};
