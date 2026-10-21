import {
  L,
  N,
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
import type { CasePart, Line } from '../../../tools/content/src/kit/index.js';
import { T_BERAAT_B, T_BERAAT_E, T_INDIRIM } from './meta.js';
import { T, card, fx } from './shared.js';

// 90-outcomes: ETIK (garaj), BERAAT_B (223/2-b), BERAAT_E (223/2-e), INDIRIM (basit taksir, TCK 50/4), MAHKUMIYET.
// Epiloglar karar ekranında hükümden sonra oynar; koşulu tutan bütün bloklar sırayla birleşir.

const block = (lines: Line[], when?: Parameters<typeof all>[0]) => (when === undefined ? { lines } : { when, lines });

/** Adli Tıp raporu dosyada ya da tartışılmışken illiyetin neden yine de kabul edildiği (mahkûmiyet gerekçeleri). */
const atkCausation = [
  because(
    'Adli Tıp raporu yaralanmaların “uyumlu” olduğu bir çarpma biçimini tarif etmiş, çarpan aracı belirlememiştir.',
    any(flag('arg_atk'), has('ev_atk')),
  ),
  because(
    'Mahkeme raporu bilirkişi raporu, tutanak ve tanık beyanıyla birlikte değerlendirerek (CMK 217/1) ölümcül çarpmanın sanığın aracıyla gerçekleştiğini kabul etmiştir.',
    any(flag('arg_atk'), has('ev_atk')),
  ),
];

/** Kürsüde ikinci bir araca işaret eden izler açıldıysa mahkûmiyet/indirim gerekçesi bunları tartar. */
const ikinciIz = because(
  'Olay yerinde başka bir araca ait olabilecek izler bulunmuşsa da bu izlerin çarpma anına ait olduğu ve yayaya sanıktan önce çarpıldığı dosyada kesinleşmemiştir.',
  any(flag('contra_n4'), flag('contra_c3'), flag('contra_c4')),
);

/** Garaj epilogu: hangi hüküm olursa olsun disiplin soruşturması gelir. */
const garajEpilog = block(
  [
    card('ARSLAN HUKUK — ERTESİ SABAH', 'buro'),
    N(
      'Masamda bir zarf: Rüstem Usta’nın avukatından şikâyet dilekçesinin örneği. Altında baro disiplin kurulunun bildirimi. Hükmün ne olduğu zarfın umurunda değildi.',
    ),
    N(
      'Leyla odama girdi, masaya ince, kırmızı kapaklı bir kitapçık bıraktı: meslek kuralları. Hiçbir şey söylemedi.',
    ),
    T(
      'Mahkeme o fotoğrafları yok saydı; dosya onlarsız da ayaktaydı ya da değildi. Ama ben o garaja girdim. Bunu hiçbir hüküm silmiyor.',
    ),
    fx(card('Av. Deniz Arslan hakkında disiplin soruşturması başlatıldı.'), 'fade'),
  ],
  flag('etik_garaj'),
);

const garajGerekce = because(
  'Savunmanın sunduğu garaj fotoğrafları hukuka aykırı yoldan elde edildiğinden hükme esas alınmamıştır; karar yalnızca hukuka uygun delillere dayanmaktadır (Anayasa 38/6, CMK 206/2-a, 217/2).',
  flag('etik_garaj'),
);

export const outcomes: CasePart = {
  outcomes: [
    outcome('BERAAT_B', {
      class: 'ACQUITTAL',
      priority: 1,
      when: all(
        not(flag('cokus')),
        flag('gercek_neden'),
        ref('kusur_yok'),
        cmp(v('pers'), '>=', 8),
        finalAtLeast(T_BERAAT_B),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok',
      verdictText:
        'Sanık Volkan Eren’in üzerine atılı taksirle öldürme suçunu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; hakkındaki adli kontrol tedbirlerinin kaldırılmasına; CMK 141/1 ve 142 kapsamındaki tazminat haklarının bildirilmesine (CMK 231/3); karar ve dosya örneklerinin, Tarık Sezer hakkında yürütülen soruşturmaya eklenmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because(
          'Denetleyici kayıtları ve tanık beyanlarına göre kavşakta o gece taşıt ve yaya yeşili birlikte yanmış; sanığa kırmızı ışık ihlali atfedilememiştir.',
        ),
        because(
          'Adli Tıp raporuna göre ölüme yol açan kafa travması ve 56 cm’deki kırık, ayakta duran yayaya yüksek tamponlu bir aracın birincil çarpmasıyla oluşmuştur.',
        ),
        because(
          'Savcılık yazısıyla tespit edilen panelvanın sağ ön köşesi kazanın ertesi günü onarılmış, boya maktulün montundaki parçayla eşleşmiştir.',
        ),
        because(
          'Sanığın aracının yerde yatan maktule teması ikincil olup ölümle illiyet bağı kurulamamıştır; atılı suç sanık tarafından işlenmemiştir.',
        ),
        because(
          'Cumhuriyet savcısı da esas hakkındaki mütalaasında sanığın beraatini talep etmiştir.',
          flag('mutalaa_beraat'),
        ),
        because(
          'Sanık son sözünde katılandan özür dilemiş, gördüğünü ve görmediğini ayırarak anlatmıştır.',
          flag('son_soz_iyi'),
        ),
      ],
      legalBasis: 'CMK 223/2-b; TCK 22/2, 85/1 (illiyet); CMK 141/1, 142, 231/3',
      xp: xp(1.2, { ethicsVar: 'ethics' }),
      howToReach:
        'Ölümcül darbenin başka bir araçtan geldiğini zincirle kur: ATK + sırt sıyrıkları (tahta), ikinci aracın izi (fren/cam/yükseklik/saat), boya + kamera ile aracın tarifi, somut suç duyurusu; kürsüde kırmızı ışık iddiasını çürüt ve esas savunmada 223/2-b’yi iste.',
      epilogue: [
        block([
          L('hakim', 'Türk Milleti adına…'),
          N(
            '“Beraatine” kelimesi salona düştüğünde Volkan’ın dizleri boşaldı. Kürsünün kenarına tutundu. Gözlerini kapadı. Açtığında ilk baktığı yer Serkan’dı.',
          ),
          N(
            'Serkan oturuyordu. Çerçeve dizlerinde. Yüzü taş gibiydi. Sonra, çok yavaş, Volkan’a doğru başını eğdi. Bir kere. Selam mı, kabul mü, yorgunluk mu; kimse bilmeyecekti.',
          ),
          card('ADLİYE ÖNÜ — ÖĞLEDEN SONRA', 'adliye'),
          N('Yağmur durmuştu. Uludağ’ın üstünde bulutlar yırtılmış, soluk bir güneş merdivenlere düşüyordu.'),
          N(
            'Gül bebek taşıyıcısını Volkan’ın kollarına verdi. Volkan bebeği tutmayı bilmiyormuş gibi tuttu; sonra bildi.',
          ),
          L('gul', 'Tut. Ellerin temiz.'),
          L('volkan', 'Hissettim avukat hanım. Hâlâ hissediyorum. Bu geçecek mi?'),
          N('Bir an düşündüm. Yalan söylemek kolaydı.'),
          {
            speaker: 'player',
            text: 'Hayır. Ama artık neyi hissettiğinizi biliyorsunuz. Bir kadının son anına tanık oldunuz. Ona siz yol açmadınız. İkisi aynı yük değil.',
          },
        ]),
        block(
          [
            N('Merdivenlerin dibinde Serkan durdu. Vekili bir şey söyledi; dinlemedi. Bana döndü.'),
            L('serkan', 'Annemin adını düzgün söylediniz. Hatice. Hepsinde.'),
            L('serkan', 'Ceza istiyordum. Hâlâ istiyorum. Doğru adama.'),
          ],
          any(flag('serkan_saygi'), flag('serkan_teslim')),
        ),
        block([
          card('ARSLAN HUKUK — O GECE', 'buro_gece'),
          N('Leyla odasındaydı. Masasında açılmamış sigara paketi. Paketi aldı, çekmecesine koydu, çekmeceyi kapattı.'),
          L(
            'leyla',
            'Bilirkişiyi kendi rakamlarıyla yendin. Bu her avukatın yapabileceği bir şey değil. Ama asıl yaptığın başkaydı: kimseyi kovalamadın.',
          ),
          T(
            'Bir kadın kırmızıda geçmedi. Bir adam kırmızıda geçmedi. Kırmızıda geçen bir panelvan vardı ve şimdi bir adı var.',
          ),
          fx(
            card(
              'Tarık Sezer hakkında taksirle öldürme ve yardım ya da bildirim yükümlülüğünün yerine getirilmemesi suçlarından kamu davası açıldı.',
            ),
            'fade',
          ),
        ]),
      ],
    }),
    outcome('BERAAT_E', {
      class: 'ACQUITTAL',
      priority: 2,
      when: all(
        not(flag('cokus')),
        any(flag('supheden'), flag('gercek_neden'), flag('arg_atk')),
        ref('kusur_yok'),
        ref('findings'),
        cmp(v('pers'), '>=', 6),
        finalAtLeast(T_BERAAT_E),
      ),
      stamp: 'BERAAT',
      stampTone: 'green',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: 'Ceza yok',
      verdictText:
        'Sanık Volkan Eren’in üzerine atılı taksirle öldürme suçunu işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE; hakkındaki adli kontrol tedbirlerinin kaldırılmasına; CMK 141/1 ve 142 kapsamındaki tazminat haklarının bildirilmesine (CMK 231/3); istinaf yolu açık olmak üzere karar verildi.',
      reasoning: [
        because(
          'Görgü tanığı, Gökdere yönündeki ışığı durduğu yerden göremediğini ve çarpma anını değil sonrasını gördüğünü beyan etmiştir.',
          flag('contra_n2'),
        ),
        because(
          'Belediye kayıtları ve teknisyenin beyanına göre kavşak denetleyicisi o gece arızalıdır; çatışan yeşil uyarısı bastırılmıştır.',
          flag('contra_h'),
        ),
        because(
          'Soruşturma evresindeki bilirkişi raporunun hız hesabı sanığın aracına ait olmayan bir ize, ışık tespiti ise kayda değil plana dayanmaktadır.',
          any(flag('contra_c1'), flag('contra_c2')),
        ),
        because('Heyet raporundaki tali kusur değerlendirmesi araç verisiyle desteklenmemiştir.', flag('contra_heyet')),
        because(
          'Adli Tıp raporu karşısında, ölüme yol açan travma ile sanığın aracının teması arasındaki illiyet bağı şüpheye yer bırakmayacak biçimde kurulamamıştır.',
          flag('arg_atk'),
        ),
        because(
          'Ölümcül çarpmanın sanığın aracından kaynaklandığı şüpheye yer bırakmayacak biçimde ispatlanamamıştır; şüpheden sanık yararlanır (Anayasa 38/4, AİHS 6/2).',
        ),
        garajGerekce,
      ],
      legalBasis: 'CMK 223/2-e; Anayasa 38/4; AİHS 6/2; CMK 141/1, 142, 231/3',
      xp: xp(1, { ethicsVar: 'ethics' }),
      howToReach:
        'Kırmızı ışık iddiasını kürsüde çürüt (taksici ya da teknisyen ya da bilirkişi), en az beş çelişki aç, mütalaaya cevap ver ve esas savunmada şüpheden beraati iste.',
      epilogue: [
        block([
          L('hakim', 'Türk Milleti adına…'),
          N(
            '“Sabit olmadığından… beraatine.” Volkan kürsünün kenarını bıraktı. Gül bebeği göğsüne bastırdı ve ilk kez, salonun ortasında, sesli ağladı.',
          ),
          N(
            'Katılan vekili dosyasını kapattı. Koridora çıkarken yanındaki stajyere fısıldadı, ama duyulacak kadar yüksek:',
          ),
          L('vekil', 'Şüpheden. Bunu da yazın bir kenara.'),
          card('ADLİYE ÖNÜ — ÖĞLEDEN SONRA', 'adliye'),
          N('Yağmur incelmişti, dinmemişti. Volkan merdivenin başında durdu, gökyüzüne baktı, sonra bana.'),
          L('volkan', 'Beraat. Ama ben hâlâ hissediyorum avukat hanım.'),
          { speaker: 'player', text: 'Hissettiğiniz, olan değil. Mahkeme olanı tarttı.' },
          L('volkan', 'Ya olan buysa? Ya ben…'),
          {
            speaker: 'player',
            text: 'O zaman da bunu bir delil söyler. Bir his değil. Bugün hiçbir delil bunu söylemedi.',
          },
          N(
            'Volkan bir şey söyleyecekti, vazgeçti. Merdivenin trabzanına dayandı. Islak demir, avucunun altında soğuktu; bir süre öyle durdu, sanki ilk kez bir şeye dokunuyormuş gibi.',
          ),
          N(
            'Volkan başını salladı. Gül’ün elinden bebek taşıyıcısını aldı. İlk kez, sanki ağırlığını ölçer gibi, iki eliyle havaya kaldırdı.',
          ),
          L('volkan', 'Bir gün soracak. “Baba, o gece ne oldu?” diye. Ne diyeceğim?'),
          {
            speaker: 'player',
            text: 'Doğruyu. Yeşil gördüğünüzü. Yerde koyu bir şey gördüğünüzü. Durduğunuzu. Montunuzu örttüğünüzü. Mahkemenin sizi suçlu bulmadığını.',
          },
          L('volkan', 'Ve hissettiğimi.'),
          { speaker: 'player', text: 'Onu da. Ama onu en son söyleyin.' },
        ]),
        block(
          [
            T(
              'Savcılığın yazısı dosyada: bir fırının panelvanı, onarılmış bir köşe, bir sürücünün adı. Mahkeme o adı hükmüne yazmadı; yazması gerekmiyordu.',
            ),
            T('O ad artık başka bir dosyanın kapağında. Benim işim Volkan’dı. Ötesi savcının.'),
          ],
          has('ev_savcilik'),
        ),
        block(
          [
            T(
              'Suç duyurum hâlâ bir savcının masasında. Koyu yeşil bir panelvan, bir sanayi sitesi, bir isim olmayan bir dosya. Belki bir gün bir isim olur.',
            ),
          ],
          all(flag('suc_dayanakli'), flag('sanayi_not'), not(has('ev_savcilik'))),
        ),
        block(
          [
            T(
              'Suç duyurum hâlâ bir savcının masasında. Koyu bir araç, yüksek bir tampon, bir dizi iz. Bir isim değil. Belki bir gün bir isim olur.',
            ),
          ],
          all(flag('suc_dayanakli'), not(flag('sanayi_not')), not(has('ev_savcilik'))),
        ),
        block(
          [
            T(
              'O gece Gökdere’de kim vardı, bilmiyorum. Bir iz, birkaç cam parçası, bir şüphe. Hiçbiri bir isim değil.',
            ),
          ],
          all(not(flag('suc_dayanakli')), not(has('ev_savcilik'))),
        ),
        block(
          [
            N('Serkan merdivenlerin dibinde durdu. Bana değil, Volkan’a baktı. Uzun uzun. Sonra yürüdü gitti.'),
            T(
              'Bir oğul cezasını almadı. Bir adam suçsuzluğunu tam olarak alamadı. Bir şüphe, iki adamın arasında, bir kavşak kadar geniş.',
            ),
          ],
          flag('serkan_saygi'),
        ),
        block([
          card('ARSLAN HUKUK — O GECE', 'buro_gece'),
          N('Gül’den bir mesaj: bir fotoğraf. Ela, babasının parmağını tutuyor. Altında tek kelime: “Teşekkürler.”'),
          N('Leyla odasından çıktı, paltosunu giydi. Kapıda durdu, telefonumdaki fotoğrafa baktı.'),
          L(
            'leyla',
            'Şüpheden beraat. Bazıları bunu yarım zafer sayar. Ben otuz yıldır şunu biliyorum: şüphe, bir insanı yanlış bir kesinlikten korur. Bu az şey değil.',
          ),
        ]),
        block([L('leyla', 'Ama o koyu araç hâlâ orada bir yerde. Bunu da unutma.')], not(has('ev_savcilik'))),
        block(
          [L('leyla', 'O panelvanın sürücüsü artık bir savcının sorunu, senin değil. Ama adını sen buldun. Bunu da unutma.')],
          has('ev_savcilik'),
        ),
        block([
          T('Bazen adalet bir kapıyı açar ama ışığı yakmaz. Bu sefer en azından kırmızı değildi.'),
          N(
            'Telefonu kapattım. Pencereden Gökdere’nin ışıkları görünüyordu, uzakta. Yeşil, sarı, kırmızı; sırayla, kusursuz.',
          ),
          T(
            'Bir gün bir adam o kavşaktan kızını okula götürecek. Işık yeşil yanacak. Geçecek. Belki biraz yavaşlayacak; sebebini kimseye söylemeyecek.',
          ),
        ]),
        garajEpilog,
      ],
    }),
    outcome('INDIRIM', {
      class: 'RECHARACTERIZED',
      priority: 3,
      when: all(
        not(flag('cokus')),
        ref('inv_derin'),
        ref('ara_okuma'),
        any(flag('mutalaa_basit'), all(flag('arg_basit'), any(ref('kusur_yok'), flag('arg_edr'), flag('contra_c2')))),
        finalAtLeast(T_INDIRIM),
      ),
      stamp: 'İNDİRİM',
      stampTone: 'amber',
      sentence: '1 yıl 8 ay hapis → 600 gün adli para cezası',
      verdictText:
        'Sanık Volkan Eren’in eyleminin bilinçli taksir değil basit taksir kapsamında kaldığı kabul edilerek TCK 85/1 uyarınca kusurunun hafifliği gözetilerek alt sınırdan 2 YIL hapis cezası ile cezalandırılmasına; sanığın olay sonrası yardım ve bildirim davranışı ile duruşmadaki tutumu gözetilerek TCK 62/1 uyarınca 1 YIL 8 AY HAPİS cezasına; TCK 50/1-a ve 50/4 uyarınca bu cezanın 600 GÜN adli para cezasına çevrilmesine, TCK 52/2 uyarınca günlüğü 100 TL’den 60.000 TL ADLİ PARA CEZASINA; TCK 53/6 uyarınca sürücü belgesinin 6 AY süreyle geri alınmasına; adli kontrol tedbirlerinin kaldırılmasına; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Araç verisi (EDR) ve çapraz sorgu, bilirkişi raporundaki 68 km/s hız tespitini çürütmüştür.',
          any(flag('contra_c2'), flag('arg_edr')),
        ),
        because(
          'Sanığın neticeyi öngördüğü hâlde davrandığı, yani bilinçli taksirin öngörü unsuru (TCK 22/3) ispatlanamamıştır.',
        ),
        because(
          'Sanığın yağışlı havada yaya geçidine yaklaşırken hızını ve dikkatini koşullara uydurmadığı, böylece özen yükümlülüğüne aykırı davrandığı kabul edilmiştir.',
        ),
        because(
          'Adli Tıp raporu ölümcül travmanın birincil bir çarpmayla oluştuğunu belirtmiş, bu çarpmanın hangi araçla gerçekleştiğini tespit etmemiştir.',
          any(flag('arg_atk'), has('ev_atk')),
        ),
        because(
          'Mahkeme raporu bilirkişi raporu, tutanak ve tanık beyanıyla birlikte değerlendirmiş (CMK 217/1); birincil çarpmanın da sanığın aracıyla gerçekleştiği kanaatine varmıştır.',
          any(flag('arg_atk'), has('ev_atk')),
        ),
        ikinciIz,
        because('Bu davranış ile ölüm arasında illiyet bağının bulunduğu kanaatine varılmıştır.'),
        because(
          'Taksirli suçlarda hükmolunan hapis cezası, bilinçli taksir hâli dışında adli para cezasına çevrilebilir (TCK 50/4).',
        ),
        because('Sanık duruşmada kusurunu kabul etmiştir.', flag('kabul')),
        garajGerekce,
      ],
      legalBasis: 'TCK 85/1, 22/2, 22/4, 62/1, 50/1-a, 50/4, 52/2, 53/6; CMK 273/1',
      xp: xp(0.85, { ethicsVar: 'ethics' }),
      howToReach:
        'Soruşturmada en az iki saha çıkarımı kur, kürsüde hız iddiasını (EDR ya da fren izi) çürüt, bilinçli taksirin düşmesini ve basit taksiri iste (mütalaaya cevapta ya da terditli esas savunmada).',
      epilogue: [
        block([
          L('hakim', 'Türk Milleti adına…'),
          N(
            'Hapis yok. Para cezası, ehliyet. Gül derin bir nefes verdi; uzun zamandır tuttuğu bir nefes. Volkan kıpırdamadı.',
          ),
          card('ADLİYE KORİDORU — ÖĞLEN', 'adliye'),
          L('volkan', 'Demek ki biraz öldürdüm. Altmış bin liralık.'),
          N('Cevap veremedim. Gül klasörü kapattı; kırmızı klasörü. Çantasına koydu.'),
          L('gul', 'Eve gidiyoruz. Ela acıkmıştır.'),
        ]),
        block(
          [
            N(
              'Serkan koridorun sonunda, vekiliyle konuşuyordu. “İstinaf” kelimesini duydum. Sonra “para” kelimesini; tükürür gibi.',
            ),
          ],
          not(flag('serkan_teslim')),
        ),
        block(
          [
            N(
              'Serkan bana doğru yürüdü, durdu, bir şey söyleyecekti. Söylemedi. Annesinin mesajı dosyadaydı; hâkim onu duymuştu. Yetmemişti.',
            ),
          ],
          flag('serkan_teslim'),
        ),
        block([
          card('ARSLAN HUKUK — AKŞAM', 'buro_gece'),
          L('leyla', 'Kazandın mı?'),
          { speaker: 'player', text: 'Bilmiyorum.' },
          L('leyla', 'O zaman doğru bir cevap verdin.'),
          T(
            'Yedi buçuk yıl değil, hapis değil. Kazanmak buysa neden bu kadar ağır? Çünkü o gece kavşakta kim vardı, hâlâ kimse bilmiyor.',
          ),
        ]),
        garajEpilog,
      ],
    }),
    outcome('ETIK', {
      class: 'CONVICTION',
      priority: 4,
      when: all(flag('etik_garaj'), not(ref('kusur_yok')), not(flag('arg_edr')), not(flag('contra_c2'))),
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '3 yıl 9 ay hapis',
      verdictText:
        'Hukuka aykırı yoldan elde edilen garaj fotoğraflarının hükme esas alınmamasına; sanık Volkan Eren’in TCK 85/1 uyarınca kusur durumu gözetilerek 3 YIL hapis cezası ile cezalandırılmasına; eylem bilinçli taksirle işlendiğinden TCK 22/3 uyarınca cezanın yarısı oranında artırılarak 4 YIL 6 AY; sanığın olay sonrası yardım ve bildirim davranışı gözetilerek TCK 62/1 uyarınca 3 YIL 9 AY HAPİS cezası ile cezalandırılmasına; bilinçli taksir nedeniyle TCK 50/4’ün, cezanın süresi nedeniyle TCK 51/1’in uygulanmasına yer olmadığına; TCK 53/6 uyarınca sürücü belgesinin 2 YIL süreyle geri alınmasına; müdafiin işyerine izinsiz girişine ilişkin tutanak örneğinin Cumhuriyet Başsavcılığına ve baroya gönderilmesine; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Savunmanın sunduğu fotoğraflar, rızaya aykırı girilen bir işyerinde çekildiğinden hükme esas alınmamıştır (Anayasa 38/6, CMK 206/2-a, 217/2).',
        ),
        because('Bu fotoğraflar dışarıda bırakılarak dosyadaki hukuka uygun deliller tek tek değerlendirilmiştir.'),
        because(
          'Bilirkişi raporu, görgü tanığının beyanı ve olay tutanağı birbirini doğrulamaktadır; sanığın kavşağa kırmızı ışıkta girdiği kabul edilmiştir.',
          not(has('ev_heyet')),
        ),
        because(
          'Kırmızı ışıkta yaya geçidine giren sürücünün bir yayaya çarpma ihtimalini öngördüğü kabul edilerek eylem bilinçli taksir (TCK 22/3) olarak nitelendirilmiştir.',
        ),
        because(
          'Müdafi bu fotoğrafları duruşmada delil olarak sunmuş; mahkeme sunumu tutanağa geçirmiştir. Müdafiin davranışı sanık aleyhine delil olarak değerlendirilmemiştir.',
          flag('garaj_sunuldu'),
        ),
        because(
          'Dosyada kırmızı ışık tespitiyle çelişen hukuka uygun bir sinyal kaydı, bilirkişi heyeti raporu ya da tanık beyanı bulunmamaktadır.',
          all(not(has('ev_sinyal_log')), not(has('ev_sesli')), not(has('ev_heyet'))),
        ),
        because(
          'Denetleyici günlüğündeki yeniden başlatma ve uyarı kaydı, arızanın kaza anında sanığın geldiği yöndeki ışığı etkilediğini tek başına göstermemektedir.',
          all(has('ev_sinyal_log'), not(has('ev_sesli'))),
        ),
        because(
          'Maktulün sesli mesajı kavşaktaki ışıklara ilişkin genel bir gözlem içermekte, kaza anında sanık yönündeki ışığın rengini tek başına göstermemektedir.',
          all(has('ev_sesli'), not(has('ev_sinyal_log'))),
        ),
        ...atkCausation,
        ikinciIz,
      ],
      legalBasis: 'TCK 85/1, 22/3, 62/1, 53/6; Anayasa 38/6; CMK 206/2-a, 217/2, 273/1; TCK 116/2; Av.K. md. 34',
      xp: xp(0),
      howToReach:
        'Kestel’de kapalı garaja izinsiz girip fotoğraf çekmek ve kırmızı ışık iddiasını hukuka uygun delillerle çürütememek. Garaja girip davayı hukuka uygun delillerle kazanırsan hüküm değişmez ama disiplin soruşturması yine gelir.',
      ethicsCard:
        'Avukat, şüpheli olabilecek birinin işyerine rızası olmadan girerek delil toplayamaz: bu hem suçtur (TCK 116/2) hem de elde edilen delil hukuka aykırıdır (Anayasa 38/6, CMK 206/2-a, 217/2). Doğru yol, kamuya açık yerden gördüğünü not almak ve somut bilgiyi savcılığa bildirmektir (CMK 158). Avukatlık mesleğinin gerektirdiği saygı ve güven (Av.K. md. 34) ile TBB Meslek Kuralları bu çizgiyi açıkça çizer.',
      epilogue: [
        block([
          L('hakim', 'Türk Milleti adına…'),
          N('Hüküm okunurken kimse bana bakmadı. Savcı bile. Bu, bakmaktan daha ağırdı.'),
          card('ARSLAN HUKUK — AYNI AKŞAM', 'buro_gece'),
          N(
            'Masamda bir zarf: Rüstem Usta’nın avukatından şikâyet dilekçesinin örneği. Altında baro disiplin kurulunun bildirimi. Kâğıtlar düzgün, köşeleri hizalı.',
          ),
          N(
            'Leyla odama girdi. Elinde ince, kırmızı kapaklı bir kitapçık: meslek kuralları. Masaya bıraktı. Hiçbir şey söylemedi.',
          ),
          N('Kapıda durdu. Ters çerçeveyi düşündüm; onun masasındaki. Sormadım.'),
          T(
            'Bir garajın kapısı aralıktı. İçeride bir panelvan vardı. Ben de içeri girdim. Panelvan o hafta hurdaya çıkarıldı; Volkan üç yıl dokuz ay aldı.',
          ),
          T(
            'Doğruyu bulmak ile doğru yoldan bulmak arasındaki fark. Bunu bir dosyada değil, bir müvekkilin hayatında öğrendim.',
          ),
        ]),
        block([N('Gül koridorda bebeği göğsüne bastırmış, bana bakmadan yanımdan geçti.')], flag('bebek_ela')),
        block([fx(card('Av. Deniz Arslan hakkında disiplin soruşturması başlatıldı.'), 'fade')]),
      ],
    }),
    outcome('BASIT_HAPIS', {
      class: 'CONVICTION',
      priority: 5,
      when: any(ref('kusur_yok'), flag('arg_edr'), flag('contra_c2')),
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '2 yıl 1 ay hapis',
      verdictText:
        'Sanık Volkan Eren’in eyleminin bilinçli taksir değil basit taksir kapsamında kaldığı kabul edilerek TCK 85/1 ve 22/4 uyarınca kusur durumu gözetilerek 2 YIL 6 AY hapis cezası ile cezalandırılmasına; sanığın olay sonrası yardım ve bildirim davranışı gözetilerek TCK 62/1 uyarınca 2 YIL 1 AY HAPİS cezası ile cezalandırılmasına; TCK 50/4 uyarınca seçenek yaptırıma çevrilmesine takdiren yer olmadığına; cezanın süresi nedeniyle TCK 51/1 ve CMK 231/5’in uygulanmasına yer olmadığına; TCK 53/6 uyarınca sürücü belgesinin 1 YIL süreyle geri alınmasına; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Kırmızı ışık iddiası duruşmada ve dosyadaki hukuka uygun delillerle çürütülmüş; sanığa kırmızı ışık ihlali atfedilememiştir.',
          ref('kusur_yok'),
        ),
        because(
          'Kırmızı ışık tespiti dosyadaki bilirkişi raporu ve tanık beyanıyla desteklenmektedir; ancak bu tespit tek başına neticenin öngörüldüğünü göstermez.',
          not(ref('kusur_yok')),
        ),
        because(
          'Araç verisi (EDR) ve çapraz sorgu, bilirkişi raporundaki 68 km/s hız tespitini çürütmüştür.',
          any(flag('contra_c2'), flag('arg_edr')),
        ),
        because(
          'Cumhuriyet savcısı da esas hakkındaki mütalaasında eylemin basit taksir kapsamında kaldığını belirtmiştir.',
          flag('mutalaa_basit'),
        ),
        because(
          'Sanığın neticeyi öngördüğü hâlde davrandığı (TCK 22/3) sabit olmadığından eylem basit taksir olarak nitelendirilmiştir.',
        ),
        because(
          'Sanığın yağışlı gecede yaya geçidine yaklaşırken hızını ve dikkatini koşullara uydurmadığı, böylece özen yükümlülüğüne aykırı davrandığı kabul edilmiştir.',
        ),
        ...atkCausation,
        ikinciIz,
        because('Bu davranış ile ölüm arasında illiyet bağının bulunduğu kanaatine varılmıştır.'),
        because(
          'TCK 50/4’teki çevirme takdire bağlıdır. Bir insanın yaşamını yitirmesi ve özen yükümlülüğüne aykırılığın niteliği gözetilerek hapis cezası seçenek yaptırıma çevrilmemiştir.',
        ),
        because('Sanık duruşmada kusurunu kabul etmiştir.', flag('kabul')),
        garajGerekce,
      ],
      legalBasis: 'TCK 85/1, 22/2, 22/4, 62/1, 50/4, 51/1, 53/6; CMK 231/5, 273/1',
      xp: xp(0.7, { ethicsVar: 'ethics' }),
      howToReach:
        'Bilinçli taksiri düşür (kırmızı ışık iddiasını çürüt ya da EDR ile hız iddiasını yık) ama soruşturmayı ve arada gelen raporları yarım bırak, ya da basit taksir ve TCK 50/4 talebini savunmaya taşıma.',
      epilogue: [
        block([
          L('hakim', 'Türk Milleti adına…'),
          N(
            '“Basit taksir.” Bir an salonda bir şey gevşedi. Sonra “çevrilmesine yer olmadığına” dendi ve gevşeyen şey yeniden gerildi.',
          ),
          N('İki yıl bir ay. Bilinçli taksir düşmüştü. Hapis düşmemişti.'),
          card('ADLİYE KORİDORU — ÖĞLEN', 'adliye'),
          L('volkan', 'Yeşildi dedim. Kabul ettiler. Yine de içerideyim.'),
          L('gul', 'İstinaf var, değil mi? Deniz Hanım, istinaf var.'),
          { speaker: 'player', text: 'Var. İki hafta içinde.' },
          T(
            'Hâkim ışığı yeşil saydı, hızı düşük saydı. Sonra sordu: başka ne var? Ben ona başka bir şey göstermemiştim.',
          ),
        ]),
        block(
          [N('Serkan koridorun sonunda duruyordu. Bana bakmadı. Annesinin adını kimsenin ağzından duymamıştı bugün.')],
          not(flag('serkan_saygi')),
        ),
        block([
          card('ARSLAN HUKUK — GECE', 'buro_gece'),
          L('leyla', 'Yarısını kazandın. Yarısı da bir adamın iki yılı.'),
          L('leyla', 'Hâkime bir çerçeve verdin, içini doldurmadın. İstinafta o çerçeveyi dolduracaksın.'),
          T('Masama oturdum. Dosyanın içinde açmadığım zarflar vardı. Birini açtım. Sonra ötekini.'),
        ]),
        garajEpilog,
      ],
    }),
    outcome('MAHKUMIYET', {
      class: 'CONVICTION',
      priority: 6,
      when: always,
      stamp: 'MAHKÛMİYET',
      stampTone: 'red',
      header: 'TÜRK MİLLETİ ADINA',
      sentence: '3 yıl 9 ay hapis',
      verdictText:
        'Sanık Volkan Eren’in TCK 85/1 uyarınca kusur durumu gözetilerek 3 YIL hapis cezası ile cezalandırılmasına; eylem bilinçli taksirle işlendiğinden TCK 22/3 uyarınca cezanın yarısı oranında artırılarak 4 YIL 6 AY; sanığın olay sonrası yardım ve bildirim davranışı gözetilerek TCK 62/1 uyarınca 3 YIL 9 AY HAPİS cezası ile cezalandırılmasına; bilinçli taksir nedeniyle TCK 50/4’ün, cezanın süresi nedeniyle TCK 51/1’in uygulanmasına yer olmadığına; TCK 53/6 uyarınca sürücü belgesinin 2 YIL süreyle geri alınmasına; hükmün kesinleşmesine kadar adli kontrol tedbirlerinin devamına; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf yolu açık olmak üzere (CMK 273/1).',
      reasoning: [
        because(
          'Bilirkişi raporu, tanık beyanı ve olay tutanağı birlikte değerlendirilerek sanığın kavşağa kırmızı ışıkta, dikkatsizce girdiği kabul edilmiştir.',
        ),
        because(
          'Kırmızı ışıkta yaya geçidine giren sürücünün bir yayaya çarpma ihtimalini öngördüğü kabul edilerek eylem bilinçli taksir (TCK 22/3) olarak nitelendirilmiştir.',
        ),
        ...atkCausation,
        ikinciIz,
        because('Sanık duruşmada kusurunu kabul etmiştir.', flag('kabul')),
        because(
          'Müdafiin itirazları somut delille desteklenmediğinden, bilirkişi raporu, tutanak ve tanık beyanı birlikte değerlendirilmiş; olay anlatımının dosya kapsamıyla doğrulandığı görülmüştür.',
          flag('cokus'),
        ),
        garajGerekce,
      ],
      legalBasis: 'TCK 85/1, 22/3, 62/1, 53/6; CMK 273/1',
      xp: xp(0.6, { ethicsVar: 'ethics' }),
      howToReach: 'Varsayılan sonuç: diğer sonuçların koşulları sağlanmazsa verilir.',
      epilogue: [
        block([
          L('hakim', 'Türk Milleti adına…'),
          N('Üç yıl dokuz ay. Volkan başını salladı; bunu bekliyormuş gibi. Belki de bekliyordu. Belki de istiyordu.'),
          N('Gül kalkmadı. Bebek taşıyıcısının sapını o kadar sıkı tutuyordu ki parmak boğumları beyazlamıştı.'),
          card('ADLİYE KORİDORU — ÖĞLEN', 'adliye'),
          N('Serkan koridorun sonunda duruyordu. Kazanmış birinin yüzü değildi. Kimse kazanmamıştı.'),
          L('volkan', 'Avukat hanım. Siz elinizden geleni yaptınız. Ben hak ettim.'),
          T(
            'Hak etmediğini kanıtlayamadım. Bu, hak ettiği anlamına gelmiyor. Ama bundan sonra bunu ona kim anlatacak?',
          ),
        ]),
        block(
          [L('savci', 'İyi bir avukat olacaksınız. Bugün değil.'), N('Savcı dosyasını kolunun altına aldı ve gitti.')],
          flag('cokus'),
        ),
        block([
          card('ARSLAN HUKUK — GECE', 'buro_gece'),
          N(
            'Masamda Gül’ün klasörlerinden biri kalmıştı. Sarı olanı. İçinde bir ultrason fotoğrafı ve bir not: “Bebek arabası.”',
          ),
          T(
            'Bir kadın öldü, bir adam ceza aldı. Teraziyi dengeli sanan herkes yanılıyordu; ben de. İstinaf dilekçesini yazmaya oturdum.',
          ),
        ]),
        garajEpilog,
      ],
    }),
  ],
};
