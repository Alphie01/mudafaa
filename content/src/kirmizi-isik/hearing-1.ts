import {
  L,
  N,
  P,
  all,
  any,
  choiceNode,
  cmp,
  cont,
  courtSession,
  dec,
  fallback,
  flag,
  ground,
  has,
  hl,
  ifThen,
  inc,
  mark,
  meet,
  not,
  objectRule,
  option,
  presentRule,
  pressRule,
  raise,
  ref,
  says,
  score,
  statement,
  story,
  when,
  otherwise,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { HEAR1, T, card, court1, fx, wrongEvidence } from './shared.js';

// 60-hearing-1: 2. celse — koridor, savunmanın tamamlanması, sanığa sorular, katılan vekilinin telkinli sorusu,
// katılanın beyanı, taksicinin çapraz sorgusu, bilirkişi raporuna itiraz ve ara karar.

const prosecutionPapers = ['ev_bilirkisi', 'ev_hts', 'ev_volkan_ifade'];

export const hearing1: CasePart = {
  config: {
    objectionGrounds: [
      ground('g_kanaat', 'Tanık görmediğini kanaatle aktarıyor', 'CMK 217/1 (takdir); CMK 52/1'),
      ground('g_yorum', 'Bilirkişi hukuki nitelendirme yapıyor (CMK 67/3)', 'CMK 67/3'),
    ],
  },
  court: {
    sessions: [
      courtSession('cs_2', '2. Celse', [
        ['s2_acilis', 'ACILIS', 'H1_00'],
        ['s2_savunma', 'SANIK_SAVUNMASI', 'H1_01'],
        ['s2_tanik', 'TANIK_DINLEME', 'H1_05'],
        ['s2_delil', 'DELIL_TARTISMA', 'H1_06'],
      ]),
    ],
  },
  nodes: [
    story('H1_00K', {
      ...HEAR1,
      title: 'Koridor',
      background: 'adliye',
      lines: [
        when(
          flag('volkan_hazir'),
          card('ADLİYE · 3. KAT KORİDORU — 09.40', 'adliye'),
          N(
            'Koridor ıslak montlar ve ucuz kahve kokuyordu. Volkan duvara yaslanmıştı; tıraşlı, ütülü gömlek. Gül bankta, iki elini karnına koymuştu.',
          ),
          L('volkan', 'Ne gördüysem. Söz verdim. Ama avukat hanım… korkuyorum. Ya yanlış hatırlıyorsam?'),
          N(
            'Koridorun duvarında eski bir ilan panosu: “Arabuluculuk bürosu 2. katta.” “Kayıp eşya: siyah şemsiye.” “Sessiz olunuz.” Kimse sessiz değildi.',
          ),
          T(
            'Bugün Volkan’ın hafızası bir rapora karşı yarışacak. Hafıza yorulur, rapor yorulmaz. Ama rapor da yanılır; yalnızca yanıldığını bilmez.',
          ),
          N(
            'Koridorun öbür ucunda Serkan Durmaz. Siyah bir ceket, elinde bir fotoğraf çerçevesi. Bize bakmadı. Bakmamaya çalıştı.',
          ),
          T(
            'Bugün iki işim var: Volkan’ın kendi sesini korumak ve taksicinin dürüstlüğünü onu küçük düşürmeden sınamak. İkisi de bir kişinin onurunu ötekinin önünde tartmak gibi.',
          ),
        ),
        otherwise(
          card('ADLİYE · 3. KAT KORİDORU — 09.40', 'adliye'),
          N(
            'Koridor ıslak montlar ve ucuz kahve kokuyordu. Volkan pencerenin önünde, sırtı bana dönük. Gül bankta, iki elini karnına koymuştu.',
          ),
          L('volkan', 'Avukat hanım. Mesajımı gördünüz. Ben kararımı verdim. Bugün kabul edeceğim.'),
          N(
            'Koridorun öbür ucunda Serkan Durmaz. Siyah bir ceket, elinde bir fotoğraf çerçevesi. Volkan’ın omuzları onu görünce çöktü.',
          ),
        ),
      ],
      choices: [
        option(
          'K_DOGRU',
          '“İçeride ne gördüyseniz onu anlatın. Bilmediğinize ‘bilmiyorum’ deyin. Kabul kararı sizin; ama bilmeden vermeyin.”',
          {
            effects: [raise('volkan_hazir'), inc('trust', 4)],
            good: 'Müvekkili doğruyu anlatmaya teşvik etmek ve kararını bilgilendirerek ona bırakmak: savunmanın ve meslek ahlakının doğrusu.',
            category: 'SAVUNMA_STRATEJISI',
            responses: says(
              L('volkan', 'Bilmiyorum demek… hâkimin önünde ayıp olmaz mı?'),
              P('Ayıp olan, bilmediğinizi biliyormuş gibi söylemek. Bilmiyorum, en dürüst cevaptır.'),
              N('Volkan başını salladı. Gül elini tuttu. Mübaşirin sesi koridorda yankılandı.'),
            ),
            next: 'H1_00',
          },
        ),
        option('K_SUS', '“Bugün susma hakkınızı kullanın. Konuşmayı ben yaparım.”', {
          effects: [raise('susma')],
          neutral:
            'Susma hakkı meşrudur (CMK 147/1-e) ve aleyhe yorumlanamaz; ama hâkim sanığın kendi anlatımını hiç duymamış olur.',
          responses: says(
            L('volkan', 'Susmak mı? Kadının oğlunun önünde susmak mı?'),
            P('Sizi korumak için. Konuşacağınız gün gelecek.'),
            L('volkan', '…Peki.'),
          ),
          next: 'H1_00',
        }),
        option('K_KABUL', '“Madem kararlısınız, kabul edin. İndirimi konuşuruz.”', {
          effects: [raise('kabul_tavsiye'), dec('trust', 4)],
          bad: 'Delil henüz tartışılmadan müvekkili kusuru kabule yönlendirmek: savunma görevini terk etmek. Karar onun olsa da avukat onu bilgisiz bırakmamalı.',
          category: 'SAVUNMA_STRATEJISI',
          responses: says(
            L('volkan', 'Tamam. Teşekkür ederim. Bunu duymaya ihtiyacım vardı.'),
            N('Gül bana baktı. Bir şey demedi. O bakış sonra uzun süre aklımdan çıkmadı.'),
          ),
          next: 'H1_00',
        }),
      ],
    }),
    court1.stage('H1_00', {
      title: '2. Celse · Açılış',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onFirstEnter: [raise('in_court'), meet('hakim'), meet('savci'), meet('vekil'), meet('mubasir'), meet('katip')],
      lines: says(
        card('BURSA 7. ASLİYE CEZA MAHKEMESİ — 2. CELSE', 'durusma_salonu'),
        L('mubasir', 'Volkan Eren dosyası! Taraflar salona!'),
        N(
          'Salon küçük, tavanı yüksek. Radyatörün üstünde kurumaya bırakılmış bir şemsiye. Kürsünün arkasında Atatürk portresi ve yağmurla buğulanmış bir pencere.',
        ),
        L(
          'hakim',
          'Sanık Volkan Eren hazır. Müdafii Av. Deniz Arslan hazır; vekâletnamesi dosyada. Katılan Serkan Durmaz ve vekili Av. Kenan Ilgaz hazır. Cumhuriyet savcısı hazır.',
        ),
        L(
          'hakim',
          'Açık yargılamaya devam olundu. Önceki celsede sanığa savunmasını tamamlaması için süre verilmişti. Sanık, kürsüye.',
        ),
        T(
          'Hâkim Tanrıverdi kâğıtlara değil insanlara bakan biri. Bu iyi. Ama insanlara bakan hâkim, suçluluk da görür.',
        ),
        N(
          'Dinleyici sıralarında hastane önlüklü üç kadın oturuyordu. Ellerinde kâğıt mendil. Arka sırada, kapının yanında, kasketli bir adam: Necati Bulut, sırasını bekleyen tanık.',
        ),
      ),
      choices: [cont('H100_DEVAM', 'Devam', 'H1_00B')],
    }),
    court1.stage('H1_00B', {
      title: 'İddianamenin özeti',
      courtStage: 'ACILIS',
      lines: says(
        L('hakim', 'Yeni müdafi için iddianamenin özetini hatırlatalım. Sayın Savcı?'),
        L(
          'savci',
          'Sanık Volkan Eren, 14 Kasım günü saat 01.11 sıralarında Gökdere Bulvarı’nda seyir hâlindeyken Çınarlı Sokak kavşağında kırmızı ışık ihlali yapmış;',
        ),
        L(
          'savci',
          'hız sınırının üzerinde ve cep telefonuyla görüşme yaparken, yaya geçidinde yeşil ışıkta karşıya geçen maktul Hatice Durmaz’a çarparak ölümüne neden olmuştur.',
        ),
        L(
          'savci',
          'Sanığın kırmızı ışıkta, yüksek hızla ve dikkati dağılmış hâlde kavşağa girmesi neticeyi öngördüğünü gösterir. TCK 85/1 ve 22/3 uyarınca cezalandırılması talep olunmuştur.',
        ),
        L(
          'vekil',
          'Katılan olarak iddianameye aynen katılıyoruz Sayın Başkan. Bir anne, yeşil ışıkta, yaya geçidinde.',
        ),
        T(
          '“Yaya geçidinde yeşil ışıkta karşıya geçen maktul.” Savcı farkında değil ama bir cümleye iki yeşil sığdırdı. Biri yayanın, biri değil.',
        ),
        T(
          'İddianamenin üç ayağı var: kırmızı, hız, telefon. Bir de dördüncüsü, yazılmamış olanı: “çarptım, hissettim.”',
        ),
      ),
      choices: [cont('H100B_DEVAM', 'Devam', 'H1_01')],
    }),
    court1.stage('H1_01', {
      title: 'Sanığın savunması',
      courtStage: 'SANIK_SAVUNMASI',
      witness: 'volkan',
      witnessLabel: 'SANIK · VOLKAN EREN',
      onFirstEnter: [
        ifThen(flag('kabul_tavsiye'), [raise('kabul'), dec('pers', 2)]),
        ifThen(all(not(flag('kabul_tavsiye')), not(flag('volkan_hazir')), not(flag('susma'))), [
          raise('kabul'),
          dec('pers', 1),
        ]),
      ],
      lines: [
        when(
          flag('kabul_tavsiye'),
          L('volkan', 'Sayın hâkim. Ben… kusurluyum. Çarptım. Hissettim. Kabul ediyorum. Ne ceza verirseniz razıyım.'),
          N('Salonda bir kıpırtı. Katılan vekili kalemini bıraktı. Savcı dosyasına bir not aldı; kısa, tek kelimelik.'),
          L('hakim', 'Işığın rengi hakkında ne diyorsunuz?'),
          L('volkan', 'Bilmiyorum artık. Yeşil gördüm sanıyordum. Herkes kırmızı diyor. Kabul ediyorum.'),
          T('“Kabul ediyorum.” İki kelime, üç rapordan ağır. Leyla bunu söylemişti.'),
        ),
        when(
          flag('susma'),
          L(
            'volkan',
            'Sayın hâkim, avukatımın tavsiyesiyle bugün açıklama yapmayacağım. Kolluktaki ifademin arkasındayım.',
          ),
          L('hakim', 'Susma hakkınız var; aleyhinize yorumlanmaz. Tutanağa geçsin.'),
          N('Katılan sırasında Serkan Durmaz çerçeveyi dizlerine bastırdı. Bir şey mırıldandı; duyulmadı.'),
        ),
        when(
          flag('volkan_hazir'),
          L(
            'volkan',
            'Sayın hâkim. Ben o gece fabrikadan çıktım. Eşimle arabanın ekranından konuşuyordum. Kavşağa yaklaşırken ışık yeşildi. Yeşil gördüm.',
          ),
          L(
            'volkan',
            'Önümde, yerde koyu bir şey gördüm. Frene bastım. Sol önde bir şeye değdim. Durdum, ambulansı aradım, montumu örttüm.',
          ),
          L(
            'volkan',
            'Hissettim. Bunu saklamıyorum. Ama ne gördüğümü soruyorsanız: yeşil ışık, yerde koyu bir şey. Fazlasını bilmiyorum.',
          ),
          N('Serkan Durmaz başını kaldırdı. İlk kez Volkan’a değil, kürsüye baktı.'),
          L('hakim', 'Işığın yeşil olduğundan emin misiniz?'),
          L(
            'volkan',
            'Yeşil gördüm efendim. Emin olmak… Üç aydır herkes bana kırmızı diyor. Ama ben yeşil gördüm. Bunu değiştiremem; değiştirirsem yalan olur.',
          ),
          T('Ne gördüyse. Söz verdiği gibi.'),
        ),
        otherwise(
          L(
            'volkan',
            'Sayın hâkim… Ben… Yeşildi sanırım. Ama çarptım. Hissettim. Tekerleğin altında. Ben öldürdüm herhalde.',
          ),
          L('hakim', '“Herhalde” ne demek? Gördüğünüzü anlatın.'),
          L('volkan', 'Bilmiyorum. Bilmiyorum efendim.', 'uzgun'),
          T('Gece aramadığım mesajın cevabı bu. Bir “herhalde”.'),
        ),
      ],
      choices: [cont('H101_DEVAM', 'Sanığa soru sor', 'H1_02Q')],
    }),
    choiceNode('H1_02Q', {
      ...court1.base,
      title: 'Sanığa sorular',
      background: 'durusma_salonu',
      prompt: L('hakim', 'Müdafi, sanığa sorunuz varsa doğrudan sorabilirsiniz.'),
      choices: [
        option('Q_TEL', '“Eşinizle görüşmeyi nasıl yapıyordunuz?”', {
          score: { SAVUNMA_STRATEJISI: 25 },
          responses: [
            when(
              flag('susma'),
              L('volkan', 'Avukatım… peki, bunu söyleyebilirim. Arabanın ekranından. Telefon bardaklıktaydı.'),
            ),
            when(
              flag('fact_ekran'),
              L(
                'volkan',
                'Arabanın ekranından, hoparlörden. Telefon bardaklıktaydı. Kapatmak için ekrana bir saniye dokundum; bunu saklamıyorum.',
              ),
              T('Saklamıyor. İyi. Saklanan bir saniye, söylenen bir saniyeden ağırdır.'),
            ),
            otherwise(
              L(
                'volkan',
                'Arabanın ekranından, hoparlörden. Telefon elimde değildi; bardaklıktaydı. Kapatmak için ekrana dokundum.',
              ),
            ),
          ],
        }),
        option('Q_HIZ', '“Kavşağa yaklaşırken hızınız neydi, hatırlıyor musunuz?”', {
          score: { SAVUNMA_STRATEJISI: 25 },
          effects: [ifThen(any(flag('fact_abs'), flag('fact_darbe')), [inc('pers', 1)])],
          responses: says(
            L('volkan', 'Kırk kadar. Yağmur vardı. O yolda hep kırkla giderim; çukur çok.'),
            T(
              'Kırk. Volkan’ın hafızası ile raporun hesabı arasında yirmi sekiz kilometre. Biri bir insandan, biri bir izden geliyor.',
            ),
            L('savci', 'Bilirkişi altmış sekiz diyor.'),
            L('volkan', 'Bilmiyorum bilirkişi nereden bakmış. Ben kırkla gidiyordum.'),
          ),
        }),
        option('Q_GOLGE', '“Frene basmadan hemen önce, ileride ne gördünüz?”', {
          score: { SAVUNMA_STRATEJISI: 25 },
          effects: [
            ifThen(all(flag('fact_tek_lamba'), not(flag('onunde_telkin'))), [inc('pers', 1)]),
            ifThen(flag('onunde_telkin'), [dec('pers', 1)]),
          ],
          responses: [
            when(
              all(flag('fact_tek_lamba'), not(flag('onunde_telkin'))),
              L(
                'volkan',
                'Yerde koyu bir şey. Ve daha ileride… bir kırmızı lamba. Tek. Uzaklaşıyordu. Bunu ilk kez söylüyorum, çünkü uydurduğumu sanıyordum.',
              ),
              L('savci', 'Bunu kollukta neden söylemediniz?'),
              L('volkan', 'Kendimi kurtarmaya çalışıyorum sanacaklardı. Ben de öyle sandım.'),
              T('Savcı not aldı. Kısa değil bu sefer.'),
            ),
            when(
              flag('onunde_telkin'),
              L('volkan', 'Önümde bir araç vardı… bir kırmızı lamba. Avukatım sorunca hatırladım.'),
              fx(L('savci', 'Avukatınız sorunca. Tutanağa geçsin, Sayın Başkan.'), 'shake'),
              T('Kendi sorumun bedeli. Bir hatırayı yönlendirirsen o artık senin hatıran olur, onun değil.'),
            ),
            otherwise(L('volkan', 'Koyu bir şey. Yerde ya da alçakta. Ayakta biri değildi sanki. Bilmiyorum.')),
          ],
        }),
        option('Q_HIS', '“Kendinizi suçlu hissediyor musunuz?”', {
          score: { SAVUNMA_STRATEJISI: -40 },
          effects: [dec('pers', 1)],
          bad: 'Müvekkili suçluluk duygusunu anlatmaya davet etmek, hâkime “ikrar” gibi okunacak bir cümleyi kendi elinle vermektir.',
          responses: says(
            L('volkan', 'Her gece. Her sabah. Bir kadın öldü ve ben oradaydım.', 'uzgun'),
            L('vekil', 'Sayın Başkan, sanık kendi ağzıyla söylüyor. Tutanağa geçmesini talep ederim.'),
          ),
        }),
        option('Q_ALKOL', '“O gece alkol aldınız mı?”', {
          score: { SAVUNMA_STRATEJISI: -10 },
          neutral: 'Alkol testi zaten dosyada (sıfır). Bilinen bir şeyi sormak süre harcar, ikna kazandırmaz.',
          responses: says(
            L('volkan', 'Hayır. Test sıfırdı. Ben içmem zaten.'),
            L('hakim', 'Dosyada var müdafi. Devam edin.'),
          ),
        }),
        cont('H102_BITIR', 'Sorularım bu kadar', 'H1_03'),
      ],
    }),
    court1.objection('H1_03', {
      title: 'Katılan vekilinin sorusu',
      courtStage: 'SANIK_SAVUNMASI',
      witness: 'volkan',
      witnessLabel: 'SANIK · VOLKAN EREN',
      say: [
        L('vekil', 'Sayın Başkan, sanığa bir sorum var.'),
        L(
          'vekil',
          'Sanık, o gece telefonla konuşuyordunuz, ekrana bakıyordunuz, yolu görmüyordunuz ve kırmızıda geçtiniz. Değil mi?',
        ),
        N('Volkan ağzını açtı. Kapattı. Bana baktı.'),
        T(
          'Dört varsayım, bir “değil mi”. Telefon, ekran, yol, kırmızı. Volkan hangisine “hayır” diyecek? Hangisine diyemeyecek?',
        ),
      ],
      next: 'H1_04',
      options: [
        option('O_TELKIN', 'İtiraz: soru cevabını içinde taşıyor, telkin edici (CMK 201/1).', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers', 1)],
          good: 'Yöneltilen soruya itiraz edilince sorunun gerekip gerekmediğine başkan karar verir (CMK 201/1); dört varsayımı tek “değil mi”ye sıkıştıran soru telkin edicidir.',
          responses: says(
            L('hakim', 'İtiraz yerinde. Soru, cevabı içeriyor. Vekil bey, sorunuzu açık uçlu sorun.'),
            L('vekil', 'Peki. Sanık, kavşağa yaklaşırken neye bakıyordunuz?'),
            L('volkan', 'Yola. Işığa. Bir saniye ekrana; kapatmak için.'),
          ),
        }),
        option('O_SUS', 'Sanık bu soruya cevap vermek istemiyor; susma hakkını kullanıyor.', {
          score: { USUL_BILGISI: 30 },
          neutral: 'Susma hakkı her soru için kullanılabilir (CMK 147/1-e); ama telkinli soru hâlâ tutanakta duruyor.',
          responses: says(
            L('hakim', 'Sanık cevap vermiyor. Tutanağa geçsin.'),
            L('vekil', 'Cevapsızlık da bir cevaptır, Sayın Başkan.'),
          ),
        }),
        option('O_YALAN', 'Vekil bey olayı çarpıtıyor, sanığa tuzak kuruyor!', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Kişisel suçlama bir itiraz dayanağı değildir; dayanak usul kuralıdır (CMK 201/1).',
          responses: says(
            L('hakim', 'Müdafi, itirazınızı hukuki dayanağıyla yapın. Uyarıyorum.'),
            N('Savcı başını hafifçe salladı. Bana değil.'),
          ),
        }),
        option('O_BOS', 'Diyeceğim yok.', {
          effects: [dec('pers', 1)],
          neutral: 'Telkinli soru itirazsız kaldı; sanık dört varsayımın hepsini tek nefeste reddetmek zorunda kaldı.',
          responses: says(L('volkan', 'Hayır… yani… ekrana bir saniye… kırmızı değildi… bilmiyorum.', 'uzgun')),
        }),
      ],
    }),
    story('H1_04', {
      ...court1.base,
      title: 'Katılanın beyanı',
      background: 'durusma_salonu',
      lines: says(
        L('hakim', 'Katılan, söz sizde.'),
        N(
          'Serkan kalktı. Çerçeveyi kürsüye doğru çevirdi: hastane önlüklü, gülümseyen bir kadın. Arkasında bir bayram süslemesi.',
        ),
        L(
          'serkan',
          'Annem Hatice Durmaz. Otuz yıl Devlet Hastanesinde temizlik yaptı. Gece vardiyası. Eve yürüyerek dönerdi.',
        ),
        L('serkan', 'O gece de yürüyordu. Yaya ışığında. Yeşilde. Annem kırmızıda geçmezdi.'),
        L(
          'serkan',
          'Bu adam durmuş, ambulans çağırmış, montunu örtmüş. Biliyorum. Herkes bunu söylüyor. Ama annem öldü. Bir montla geri gelmiyor.',
        ),
        L('serkan', 'Ben ceza istiyorum. Başka bir şey istemiyorum. Para istemiyorum. Ceza.'),
        N('Oturdu. Elleri titriyordu. Volkan başını öne eğdi. Bir an Gül’ün yanından bir hıçkırık geldi; bastırıldı.'),
      ),
      choices: [
        option('S4_SAYGI', 'Söz alma; yalnızca kısa bir başsağlığı ve “Hatice Hanım” adıyla anılmasına dikkat et.', {
          score: { SAVUNMA_STRATEJISI: 30 },
          effects: [ifThen(flag('serkan_saygi'), [inc('pers', 1)])],
          good: 'Katılanın acısına saygı, savunmanın gücünü azaltmaz; hâkim kimin kime nasıl davrandığını görür.',
          responses: says(
            P(
              'Sayın Başkan, savunma olarak Hatice Hanım’ın ailesine başsağlığı dileriz. Söyleyeceklerimizi delillerle söyleyeceğiz.',
            ),
            N('Serkan bana baktı. Bir şey demedi. Ama çerçeveyi indirdi.'),
          ),
          next: 'H1_04V',
        }),
        option('S4_SORU', 'Katılana tek bir soru: “Anneniz o kavşaktan hangi ışıkta geçerdi?”', {
          score: { SORGULAMA: 40 },
          effects: [ifThen(flag('serkan_saygi'), [inc('pers', 1), raise('fact_anne')])],
          responses: [
            when(
              flag('serkan_saygi'),
              L('serkan', 'Yeşilde. Hep yeşilde. O gece de yeşildi, eminim.'),
              P(
                'Teşekkür ederim. Sayın Başkan, katılan yaya ışığının yeşil olduğunu söylüyor; sanık da kendi ışığının yeşil olduğunu.',
              ),
              L('hakim', 'İkisi aynı anda yeşil olamaz, müdafi. Bunu mu söylüyorsunuz?'),
              P('Olmaması gerekir, Sayın Başkan. Olup olmadığını dosya henüz söylemiyor.'),
              T('Hâkim kalemini bıraktı. İlk kez.'),
            ),
            otherwise(
              L('serkan', 'Size cevap vermek zorunda mıyım?', 'kizgin'),
              L('hakim', 'Zorunda değilsiniz. Müdafi, devam edin.'),
            ),
          ],
          next: 'H1_04V',
        }),
        option('S4_ITIRAZ', 'İtiraz: katılanın beyanı duygusal, olaya ilişkin delil değeri yok.', {
          score: { SAVUNMA_STRATEJISI: -40 },
          effects: [dec('pers', 1), raise('serkan_hakaret')],
          bad: 'Katılanın beyanda bulunma ve delillerin tartışılmasında söz alma hakkı vardır (CMK 216/1). Yasın içindeki bir aileye “duygusal” demek hâkimi savunmadan uzaklaştırır.',
          responses: says(
            L('hakim', 'Katılanın beyan hakkı var müdafi. İtirazınızı reddediyorum.'),
            fx(L('serkan', 'Duygusal mı? Annem duygusal mı?', 'kizgin'), 'shake'),
          ),
          next: 'H1_04V',
        }),
      ],
    }),
    court1.stage('H1_04V', {
      title: 'Sanığın diyeceği',
      courtStage: 'SANIK_SAVUNMASI',
      witness: 'volkan',
      witnessLabel: 'SANIK · VOLKAN EREN',
      lines: [
        when(
          flag('kabul'),
          L('hakim', 'Sanık, katılanın beyanına karşı diyeceğiniz?'),
          L('volkan', 'Haklı. Her söylediğinde haklı. Ben… ne desem az.', 'uzgun'),
          N('Serkan başını çevirdi. Pencereye baktı. Yağmur camda, salonun sarı ışığında, eğik çizgiler.'),
          T('“Haklı.” Bir sanığın katılana söyleyebileceği en dürüst ve en tehlikeli kelime.'),
        ),
        when(
          flag('fact_hatice'),
          L('hakim', 'Sanık, katılanın beyanına karşı diyeceğiniz?'),
          L(
            'volkan',
            'Serkan Bey. Cenazeye geldim. Avlunun ucunda, ağacın arkasındaydım. Siz tabutu omuzladınız. Yanınıza gelemedim. Özür dilerim.',
          ),
          L(
            'volkan',
            'Ben yeşil gördüm. Bunu söylemek size hakaret gibi geliyorsa özür dilerim. Ama başka türlü söyleyemem; başka türlüsü yalan olur.',
          ),
          N(
            'Serkan başını kaldırdı. Bir an, sanki o avlunun ucundaki gölgeyi hatırlamaya çalışır gibi, Volkan’a baktı.',
          ),
          L('hakim', 'Tutanağa geçti. Tanığı alalım.'),
          T('İki adam, bir kadının adını aynı cümlede söyledi. Biri öfkeyle, biri utançla. İkisi de doğru söylüyordu.'),
        ),
        otherwise(
          L('hakim', 'Sanık, katılanın beyanına karşı diyeceğiniz?'),
          L('volkan', 'Serkan Bey. Annenizi tanımıyordum. Şimdi adını biliyorum. Hatice. Her gece söylüyorum.'),
          L(
            'volkan',
            'Ben yeşil gördüm. Bunu söylemek size hakaret gibi geliyorsa özür dilerim. Ama başka türlü söyleyemem; başka türlüsü yalan olur.',
          ),
          N('Serkan bir şey söylemedi. Elindeki çerçeveyi kucağına yatırdı, annesinin yüzü tavana baktı.'),
          L('hakim', 'Tutanağa geçti. Tanığı alalım.'),
          T('İki adam, bir kadının adını aynı cümlede söyledi. Biri öfkeyle, biri utançla. İkisi de doğru söylüyordu.'),
        ),
      ],
      choices: [cont('H104V_DEVAM', 'Tanığı dinle', 'H1_05')],
    }),
    court1.testimony('H1_05', {
      title: 'Taksicinin çapraz sorgusu',
      courtStage: 'TANIK_DINLEME',
      witness: 'necati',
      witnessLabel: 'TANIK · NECATİ BULUT',
      onFirstEnter: [ifThen(flag('necati_kizgin'), [dec('pers', 1)])],
      lines: [
        when(
          flag('necati_kizgin'),
          L('mubasir', 'Tanık Necati Bulut!'),
          L('hakim', 'Gerçeği söyleyeceğinize yemin eder misiniz?'),
          L(
            'necati',
            'Ederim. Sayın hâkim, önce bir şey söyleyeyim: bu avukat hanım durağa gelip beni ayarlamaya çalıştı.',
          ),
          L('hakim', 'Tutanağa geçsin. Müdafi, buna ayrıca bakarız. Tanık, ifadenizi verin.'),
          T('Hak ettim. Şimdi bunu kürsüde ödüyorum.'),
        ),
        otherwise(
          L('mubasir', 'Tanık Necati Bulut!'),
          L('hakim', 'Gerçeği söyleyeceğinize yemin eder misiniz?'),
          L('necati', 'Ederim efendim. Kırk yıldır yalan söylemedim, bu yaştan sonra da söylemem.'),
          L('hakim', 'Tanık ifadesini kesintisiz verdi. Müdafi, sorularınız?'),
        ),
      ],
      rulesText:
        'Önce bastır, sonra doğru delili doğru ifadeye sun. Dürüst bir tanık yanılabilir; yalancı gibi gösterme. Yanlış delil güvenilirliği düşürür.',
      objectionGrounds: ['g_kanaat'],
      statements: [
        statement('N1', 1, ['Kırk yıldır direksiyondayım. Gözüm keskindir, gece de gündüz de.']),
        statement('N2', 2, [
          'O gece Çınarlı’dan çıkıyordum. Işık ',
          hl('kırmızıydı; beyaz araba kırmızıda daldı', any(flag('press_n2'), has('ded_goremez'))),
          '.',
        ]),
        statement('N3', 3, [
          hl('Arabanın kadına çarptığını gördüm', any(flag('press_n3'), flag('fact_gumburtu'))),
          '. Kadın arabanın önündeydi.',
        ]),
        statement('N4', 4, [
          hl('Başka araç yoktu', any(flag('press_n4'), flag('fact_minibus'), has('ded_saat'))),
          '. Yol bomboştu, gece biri buçuk.',
        ]),
        statement('N5', 5, [
          'Adam ',
          hl(
            'telefonla konuşuyordu, kafası aşağıdaydı',
            any(flag('press_n5'), flag('fact_kafa'), has('ev_multimedya')),
          ),
          '.',
        ]),
      ],
      rules: [
        presentRule('PS_N_SAVCILIK', undefined, prosecutionPapers, {
          maxUses: 3,
          effects: [
            ...wrongEvidence,
            score('SORGULAMA', -150, 'hatali'),
            mark('BAD', 'Savcılığın kendi delilini tanığa karşı sunmak hiçbir çelişki doğurmaz.', 'SORGULAMA'),
          ],
          responses: says(
            L('savci', 'Sayın Başkan, müdafi bizim delilimizi okuyor.'),
            L('hakim', 'Müdafi, bu tanıkla ilgisi ne?'),
          ),
        }),
        pressRule('PR_N1', 'N1', {
          score: { SORGULAMA: 10 },
          responses: says(
            P('Kırk yıl. Hiç kaza yaptınız mı?'),
            L('necati', 'Bir kere. Seksen dokuzda. O da benim suçum değildi, di mi, karşıdan geldi.'),
            T('Herkesin bir “benim suçum değildi”si var. Bunu kullanmayacağım; onu küçük düşürür, beni değil.'),
          ),
        }),
        pressRule('PR_N2', 'N2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_n2')],
          responses: says(
            P('Hangi ışık? Sizin önünüzdeki mi, Gökdere’dekinin mi?'),
            L('necati', 'Işık ışık! Kırmızıydı! Ben kırmızıda bekliyordum, o geldi geçti!'),
            T('“Ben kırmızıda bekliyordum.” Kendi kırmızısı. Bunu ona kendi gözüyle göstermem gerek.'),
          ),
        }),
        presentRule('PS_N2', 'N2', ['ded_goremez'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_n2'),
            mark('GOOD', 'Tanığın durduğu yerden Gökdere başlığı görülmez; gördüğü kendi kırmızısıydı.', 'SORGULAMA'),
          ],
          responses: says(
            P(
              'Sayın Başkan, polis fotoğrafı tanığın durduğu köşeden çekilmiş. Gökdere’ye bakan sinyal başlığının yalnızca siyah sırtı görünüyor.',
            ),
            P('Tanık, o köşeden Gökdere ışığının rengini görmeniz mümkün mü?'),
            N('Necati fotoğrafa uzun uzun baktı. Gözlüğünü çıkardı, taktı.'),
            L('necati', 'Bu… arkası. Kutunun arkası.', 'saskin'),
            L(
              'necati',
              'Ben… benim önümdeki kırmızıydı. Onunkini görmedim. Görmüş gibi oldum. Kırmızıdaydım, o geçti, demek ki… diye düşündüm.',
              'uzgun',
            ),
            fx(N('Salonda bir uğultu. Hâkim tokmağa dokundu ama vurmadı.'), 'shake'),
            L('hakim', 'Tanık, Gökdere yönündeki ışığı gördünüz mü, görmediniz mi?'),
            L('necati', 'Görmedim efendim. Kırk yıllık şoförüm. Görmedim.', 'uzgun'),
            N('Necati kasketini çıkardı, iki eliyle tuttu. Bir an kürsüde değil, bir cenazedeymiş gibi durdu.'),
            L(
              'necati',
              'O çocuğa… sanığa… haksızlık ettim. Kırmızı dedim, kırmızıyı ben gördüm. Benim kırmızımı.',
              'uzgun',
            ),
            T(
              'Dürüst bir adamın en zor cümlesi. Onu küçük düşürmeden söyletmek istemiştim. Söyledi; küçülmedi, büyüdü.',
            ),
          ),
        }),
        presentRule('PS_N2B', 'N2', ['ev_sinyal_log', 'ded_ariza', 'ev_tutanak'], {
          score: { SORGULAMA: 100 },
          effects: [
            inc('pers', 1),
            mark(
              'GOOD',
              'Kısmi: kayıt ya da tutanak ışıkla ilgili bir soru açar ama tanığın neyi gördüğünü çürütmez.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P(
              'Tanık, bu belge o gece kavşakta bir sorun olduğunu gösteriyor. Hâlâ kırmızı gördüğünüzden emin misiniz?',
            ),
            L('necati', 'Belge belgedir. Ben gözümle gördüm. Kırmızıydı.'),
            T('Bir belge onu sarsmadı. Gözüne, gözüyle bir şey göstermem gerek.'),
          ),
        }),
        pressRule('PR_N3', 'N3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_n3')],
          responses: [
            when(
              flag('necati_kizgin'),
              P('Çarpma anında başınız neredeydi?'),
              L('necati', 'Ne demek neredeydi? Yoldaydı! Beni yine mi ayarlıyorsun?', 'kizgin'),
              L('hakim', 'Tanık, soruyu cevaplayın.'),
              L('necati', '…Radyo açıktı. Bir gümbürtü oldu. Baktım.', 'kizgin'),
            ),
            otherwise(
              P('Çarpma anında başınız neredeydi? Sırasıyla anlatır mısınız?'),
              L('necati', 'Radyoyu kısmıştım… bir gümbürtü oldu. Kafamı kaldırdım. Araba kadının oradaydı.'),
              L('necati', 'Yani… gördüm işte. Gümbürtüden sonra.', 'saskin'),
            ),
          ],
        }),
        presentRule('PS_N3', 'N3', ['ev_necati_ifade'], {
          enabledWhen: any(flag('press_n3'), flag('fact_gumburtu')),
          score: { SORGULAMA: 250 },
          effects: [
            inc('pers', 1),
            raise('contra_n3'),
            mark(
              'GOOD',
              'Kolluk ifadesi “çarptığını gördüm” diyor; tanık başını gümbürtüden sonra kaldırdığını söyledi.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P(
              'Kollukta “arabanın kadına çarptığını gördüm” demişsiniz. Bugün gümbürtüyü duyunca başınızı kaldırdığınızı söylediniz. Hangisi?',
            ),
            L('necati', 'İkisi de… yani… gümbürtü oldu, baktım, araba oradaydı. Çarptı işte.', 'saskin'),
            L('hakim', 'Çarpma anını gördünüz mü, sonrasını mı?'),
            L('necati', 'Sonrasını efendim. Gümbürtüden sonrasını.', 'uzgun'),
            T(
              'Çarpma anını gören bir tanık yok artık. Gören yalnızca bir kamera olabilir, bir de Volkan; ikisi de birer “sonra” biliyor.',
            ),
          ),
        }),
        pressRule('PR_N4', 'N4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_n4')],
          responses: [
            when(
              flag('fact_minibus'),
              P('Gümbürtüden önce, Gökdere’den başka bir araç geçmedi mi? Durakta bana bir minibüsten söz etmiştiniz.'),
              L('necati', 'Bir şey geçti, evet. Kamyonet mi minibüs mü. Hızlıydı. Ama o çok önceydi.'),
              P('Başınızı gümbürtüden sonra kaldırdıysanız, “çok önce”yi neye göre söylüyorsunuz?'),
              L('necati', '…Bilmiyorum. Geçti işte. Ses olarak geçti.', 'saskin'),
            ),
            otherwise(
              P('Gümbürtüden önce yolda hiçbir araç yok muydu?'),
              L('necati', 'Yoktu dedim. … Bir şey geçti belki. Ama bakmadım. Radyodaydım.'),
            ),
          ],
        }),
        presentRule('PS_N4', 'N4', ['ded_saat'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_n4'),
            mark(
              'GOOD',
              'Saati düzeltilmiş büfe kaydı: Volkan’dan yedi saniye önce kavşaktan sert fren yaparak geçen koyu bir araç.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P(
              'Sayın Başkan, köşedeki büfenin kamerası. Saati UEDAŞ’ın gerilim kaydıyla düzeltildiğinde: 01.11.41’de koyu renkli bir hafif ticari araç fren yaparak geçiyor; sağ stop lambası yanmıyor.',
            ),
            P('Yedi saniye sonra, 01.11.48’de sanığın beyaz aracı.'),
            L('necati', 'Yedi saniye… Benim “çok önce” dediğim yedi saniye mi?', 'saskin'),
            L('savci', 'Sayın Başkan, kaydın teslimi ve saat düzeltmesi bilirkişice incelenmeli.'),
            L('hakim', 'Not edildi. Tanık, o aracı gördünüz mü?'),
            L('necati', 'Duydum efendim. Görmedim. Gümbürtü… ondan önce bir fren vardı galiba. Bilmiyorum.', 'uzgun'),
            T('Salonda biri ilk kez “ikinci araç” diye fısıldadı. Ben değildim.'),
          ),
        }),
        presentRule('PS_N4B', 'N4', ['ded_fren', 'ded_cam', 'ded_yukseklik', 'ev_bufe'], {
          score: { SORGULAMA: 100 },
          effects: [
            inc('pers', 1),
            mark(
              'GOOD',
              'Kısmi: o gece başka bir araca işaret eden bir iz; ama tanığın “yol boştu” sözünü tek başına çürütmez.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P('Tanık, olay yerinde sanığın aracına ait olmayan izler var. Yolun boş olduğundan emin misiniz?'),
            L('necati', 'İz izdir. Ben yolu boş gördüm. Baktığım zaman boştu.'),
            T('“Baktığım zaman.” Doğru. Baktığında boştu.'),
          ),
        }),
        pressRule('PR_N5', 'N5', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_n5')],
          responses: says(
            P('Telefonla konuştuğunu araç hareket hâlindeyken mi gördünüz, durduktan sonra mı?'),
            L('necati', 'Durunca… indiğinde. Ama kafası aşağıdaydı, belliydi. Bu devirde herkes telefoncu.'),
          ),
        }),
        presentRule('PS_N5', 'N5', ['ev_multimedya'], {
          score: { SORGULAMA: 200 },
          effects: [
            inc('pers', 1),
            raise('contra_n5'),
            mark(
              'GOOD',
              'Arama aracın multimedya sistemiyle, eller serbest yapılmış; tanığın “telefonla konuşuyordu” sözü bir kanaat.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P('Aracın multimedya kaydı: arama Bluetooth’la, hoparlörden. Telefon bardaklıktaymış.'),
            L('necati', 'Hoparlörden mi? … Ben telefonu elinde sandım. Kafası aşağıdaydı da ondan.', 'saskin'),
            L('hakim', 'Telefonu elinde gördünüz mü?'),
            L('necati', 'Görmedim efendim.', 'uzgun'),
          ),
        }),
        objectRule('OB_N5', 'N5', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('pers', 1),
            inc('legal_hits'),
            mark(
              'GOOD',
              'Tanık gözlemi yerine çıkarımını aktarıyor (“belliydi”, “herkes telefoncu”); hâkim beyanı buna göre takdir eder (CMK 217/1).',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P('Sayın Başkan, tanık gördüğünü değil, “bu devirde herkes telefoncu” kanaatini aktarıyor.'),
            L('hakim', 'Tanık, yalnızca gördüğünüzü anlatın. Kanaatiniz tutanağa geçmeyecek.'),
          ),
        }),
        objectRule('OB_N3', 'N3', 'g_kanaat', {
          enabledWhen: any(flag('press_n3'), flag('fact_gumburtu')),
          score: { SORGULAMA: 50 },
          effects: [
            inc('pers', 1),
            inc('legal_hits'),
            mark(
              'GOOD',
              'Tanık çarpma anını görmediğini söyledikten sonra “çarptı işte” diyor; bu bir sonuç çıkarımı.',
              'SORGULAMA',
            ),
          ],
          responses: says(
            P('Sayın Başkan, tanık gümbürtüden sonra baktığını söyledi. “Çarptı işte” bir gözlem değil, bir çıkarım.'),
            L('hakim', 'Tutanağa “tanık çarpma anını değil, sonrasını gördüğünü beyan etti” diye geçsin.'),
          ),
        }),
      ],
      presentMiss: fallback('FB_H105_PRESENT', 'PRESENT', {
        effects: [
          ...wrongEvidence,
          score('SORGULAMA', -150, 'hatali'),
          mark('BAD', 'Sunulan delil bu ifadeyle çelişmiyor.', 'SORGULAMA'),
        ],
        responses: says(L('hakim', 'Müdafi, bunun ifadeyle ilgisini göremiyorum.'), L('necati', 'Ben anlamadım bunu.')),
      }),
      objectMiss: fallback('FB_H105_OBJECT', 'OBJECT', {
        effects: [
          dec('cred'),
          score('SORGULAMA', -50, 'hatali'),
          mark('BAD', 'Dayanaksız itiraz: tanık burada kendi gözlemini aktarıyor.', 'SORGULAMA'),
        ],
        responses: says(L('hakim', 'İtiraz reddedildi. Tanık gözlemini anlatıyor.')),
      }),
      finish: { id: 'H105_BITIR', next: 'H1_05R' },
    }),
    story('H1_05R', {
      ...court1.base,
      title: 'Kısa ara',
      background: 'adliye',
      lines: [
        when(
          flag('contra_n2'),
          L('hakim', 'Duruşmaya on beş dakika ara verildi.'),
          card('KORİDOR — 11.20', 'adliye'),
          N('Necati koridorda, pencerenin önünde, termosunu açmadan tutuyordu. Bana baktı; kızgın değil, utanmış.'),
          L(
            'necati',
            'Avukat hanım. Ben yalan söylemedim. Gördüğümü sandım. Kırk yıldır… ilk kez gözüm yalan söyledi bana.',
          ),
          N('Volkan, Gül’ün yanında, duvara yaslanmıştı. Necati’yi görünce doğruldu.'),
          L('volkan', 'Ben de bilmiyordum. Siz kırmızı dedikçe ben de inanıyordum.'),
          N('İki adam bir an birbirine baktı. Sonra Necati başını salladı ve merdivenlere yürüdü.'),
          L('gul', 'Bu iyi bir şey mi avukat hanım? Yüzünüzden anlamıyorum.'),
        ),
        otherwise(
          L('hakim', 'Duruşmaya on beş dakika ara verildi.'),
          card('KORİDOR — 11.20', 'adliye'),
          N(
            'Necati koridorda, pencerenin önünde termosundan kahve içiyordu. Yanından geçerken “kırk yıl” dedi, kime söylediği belli değildi.',
          ),
          N('Volkan Gül’ün yanında, duvara yaslanmıştı. Gözleri yerde.'),
          L('gul', 'Taksici hâlâ “kırmızı” diyor. Hâkim de ona bakıyor. Ne yapacağız?'),
        ),
      ],
      choices: [
        option(
          'R5_DURUST',
          '“Bir tanığın emin olması, haklı olduğu anlamına gelmez. Sırada rapor var; asıl iş orada.”',
          {
            effects: [inc('trust', 3)],
            responses: says(
              L(
                'gul',
                'Rapor. Kırmızı klasör. Ezberledim onu. Her gece okuyorum, sanki bir gece başka bir şey yazacak.',
              ),
              T('Bir gece başka bir şey yazmayacak. Ama başka bir şey yazdırabiliriz.'),
            ),
            next: 'H1_06',
          },
        ),
        option('R5_SOZ', '“Merak etmeyin, bu dava bitti sayılır.”', {
          effects: [dec('trust', 3)],
          bad: 'Müvekkile sonuç vaadi vermek: sözün tutulmazsa güven, tutulsa bile meslek ahlakı zarar görür.',
          category: 'SAVUNMA_STRATEJISI',
          responses: says(
            L('gul', 'Bitti mi? Siz öyle diyorsanız…'),
            L('leyla', 'Hiçbir dava, hüküm okunana kadar bitmez.', 'kizgin'),
            N('Leyla koridorun sonundaydı; ne zaman geldiğini görmemiştim. Bir şey demeden döndü, gitti.'),
          ),
          next: 'H1_06',
        }),
        option('R5_VOLKAN', 'Volkan’ın yanına git, bir şey söyleme; yalnızca yanında dur.', {
          effects: [inc('trust', 2)],
          responses: says(
            N('Volkan’ın yanında durdum. Bir dakika, iki dakika. Mübaşir kapıyı açana kadar.'),
            L('volkan', 'Teşekkür ederim. Konuşmadığınız için.'),
          ),
          next: 'H1_06',
        }),
      ],
    }),
    court1.objection('H1_06', {
      title: 'Bilirkişi raporu',
      courtStage: 'DELIL_TARTISMA',
      prosecutionEvidence: 'ev_bilirkisi',
      say: [
        L(
          'hakim',
          'Soruşturma evresinde alınan bilirkişi raporu okundu. Rapor sanığı asli ve tam kusurlu bulmaktadır.',
        ),
        L(
          'savci',
          'Rapor açıktır Sayın Başkan. Kırmızı ışık, 68 km/s, telefon. Sanık neticeyi öngörmüş ama “bir şey olmaz” diye devam etmiştir.',
        ),
        L('vekil', 'Katılan olarak rapora katılıyoruz.'),
        L('hakim', 'Müdafi, rapora karşı diyeceğiniz?'),
      ],
      next: 'H1_07',
      options: [
        option(
          'R_ITIRAZ',
          'Rapora itiraz (CMK 67/5): ışık ölçülmemiş, iz araca bağlanmamış, camlar yok sayılmış. Yeni heyet, ATK ve EDR incelemesi talep ediyoruz.',
          {
            score: { USUL_BILGISI: 120 },
            effects: [
              raise('h1_itiraz'),
              inc('legal_hits'),
              inc('pers', 1),
              ifThen(has('clue_boya'), [raise('h1_boya')]),
              ifThen(
                cmp(
                  {
                    add: ['rapor_plan', 'rapor_iz', 'rapor_kopya', 'rapor_cam', 'rapor_yorum'].map((f) => ({
                      if: { when: flag(f), then: 1, else: 0 },
                    })),
                  },
                  '>=',
                  3,
                ),
                [score('DELIL_ANALIZI', 150), inc('pers', 1)],
              ),
            ],
            good: 'Rapor tamamlandığında taraflar itiraz ve yeni bilirkişi incelemesi isteyebilir; ret gerekçeli olmalıdır (CMK 67/5). Somut eksikleri saymak talebi “davayı uzatma” olmaktan çıkarır (CMK 206/2-c).',
            responses: [
              when(
                cmp(
                  {
                    add: ['rapor_plan', 'rapor_iz', 'rapor_kopya', 'rapor_cam', 'rapor_yorum'].map((f) => ({
                      if: { when: flag(f), then: 1, else: 0 },
                    })),
                  },
                  '>=',
                  3,
                ),
                P(
                  'Sayın Başkan, rapor ışığın o gece ne yaktığını ölçmemiş, kâğıttaki sinyal planını yazmış. Fren izini sanığın aracına bağlamış ama hangi araca ait olduğunu tespit etmemiş.',
                ),
                P(
                  'Sanığın aracındaki hasar sol önde; rapor “sağ ön köşe” diyor. Tutanaktaki far camı kırıklarından hiç söz etmemiş. Ve “bilinçli taksir” bir mühendisin değil, mahkemenin nitelendirmesidir (CMK 67/3).',
                ),
                P(
                  'Üç kişilik bir bilirkişi heyeti, Adli Tıp Kurumu Trafik İhtisas Dairesinden yaralanma mekanizması raporu ve aracın olay veri kaydedicisinin okunmasını talep ediyoruz.',
                ),
                L(
                  'savci',
                  'Sayın Başkan… “sağ ön köşe” konusunda müdafi haklı görünüyor. Talebe katılmıyoruz ama karşı da değiliz.',
                ),
                T('Savcı “karşı değiliz” dedi. Bir savcıdan duyabileceğin en sıcak cümle.'),
                N(
                  'Katılan vekili ayağa kalktı, “süreci uzatma çabası” dedi; hâkim eliyle oturmasını işaret etti. Serkan, vekilinin koluna dokundu; bu sefer onu durduran oydu.',
                ),
              ),
              otherwise(
                P(
                  'Sayın Başkan, rapor olay yeri incelemesi yapılmadan, yalnızca dosya üzerinden hazırlanmıştır. Işığın gerçek durumu ve fren izinin aidiyeti tespit edilmemiştir.',
                ),
                P(
                  'Üç kişilik bir bilirkişi heyeti, Adli Tıp Kurumu Trafik İhtisas Dairesinden yaralanma mekanizması raporu ve aracın olay veri kaydedicisinin okunmasını talep ediyoruz.',
                ),
                L('savci', 'Takdir mahkemenindir.'),
              ),
            ],
          },
        ),
        option('R_DINLE', 'Bilirkişinin duruşmada dinlenmesini talep ediyoruz (CMK 68).', {
          score: { USUL_BILGISI: 50 },
          good: 'Bilirkişinin duruşmada açıklama yapması istenebilir (CMK 68/1); ama rapordaki eksikler yeni bir inceleme olmadan giderilmez.',
          responses: says(
            P('Sayın Başkan, raporun dayanaklarını bilirkişiye doğrudan sormak istiyoruz.'),
            L('hakim', 'Bilirkişi bir sonraki celsede dinlenecek. Başka talebiniz?'),
            P('Şimdilik yok.'),
            T('Şimdilik. Bu kelime bazen bir kapıyı aralık bırakır, bazen kapatır.'),
          ),
        }),
        option('R_CIKAR', 'Rapor hukuka aykırıdır, dosyadan çıkarılmalıdır.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Eksik ya da hatalı bir rapor hukuka aykırı delil değildir; çare itiraz ve yeni incelemedir (CMK 67/5), dosyadan çıkarma değil.',
          responses: says(
            L('hakim', 'Rapor hukuka aykırı yoldan elde edilmemiştir müdafi. İtirazınızı somutlaştırın ya da geçelim.'),
          ),
        }),
        option('R_BOS', 'Diyeceğimiz yok.', {
          effects: [dec('pers', 1)],
          bad: 'Rapora itiraz edilmedi; mahkeme raporu tartışılmamış bir zemin olarak kullanabilir.',
          category: 'USUL_BILGISI',
          responses: says(N('Savcı başını kaldırıp bana baktı. Şaşırmış gibiydi. Sonra not aldı.')),
        }),
      ],
    }),
    court1.stage('H1_07', {
      title: 'Ara karar',
      courtStage: 'DELIL_TARTISMA',
      lines: [
        when(
          flag('h1_itiraz'),
          L(
            'hakim',
            'Ara karar: Müdafiin bilirkişi raporuna itirazı yerinde görüldüğünden, dosyanın trafik, makine ve sinyalizasyon alanlarında uzman üç kişilik bilirkişi heyetine tevdiine;',
          ),
          L(
            'hakim',
            'Adli Tıp Kurumu Trafik İhtisas Dairesinden yaralanma mekanizması ve ölüme etkili yaralanmaya ilişkin rapor alınmasına; sanığa ait aracın olay veri kaydedicisinin bilirkişice okunmasına;',
          ),
          L(
            'hakim',
            'Bilirkişi Müh. Cengiz Ateş’in ve gerekirse heyet başkanının bir sonraki celsede dinlenmesine; belediye sinyalizasyon teknisyeni ile tutanak mümzii polis memurunun tanık olarak çağrılmasına;',
          ),
          L('hakim', 'Duruşmanın üç hafta sonraya bırakılmasına karar verildi.'),
          T('Üç hafta. Bir heyet, bir kurum, bir makine. Üçü de aynı soruyu cevaplayacak: o gece ne oldu?'),
        ),
        otherwise(
          L(
            'hakim',
            'Ara karar: Bilirkişi Müh. Cengiz Ateş’in bir sonraki celsede dinlenmesine; belediye sinyalizasyon teknisyeni ile tutanak mümzii polis memurunun tanık olarak çağrılmasına;',
          ),

          L(
            'hakim',
            'Bekleyen müzekkere cevaplarının beklenmesine; duruşmanın üç hafta sonraya bırakılmasına karar verildi.',
          ),
        ),
      ],
      choices: [
        option('AK_IZIN', 'Adli kontrolde taşıt yasağına, işe gidiş için izin talep ediyoruz (CMK 109/5).', {
          score: { USUL_BILGISI: 40 },
          effects: [inc('legal_hits'), ifThen(ref('tahliye_dayanak'), [raise('ehliyet_izin'), inc('trust', 6)])],
          good: 'Hâkim taşıt yasağında, şüphelinin mesleki uğraşları için araç kullanmasına izin verebilir (CMK 109/5); talep somut ve ölçülüydü.',
          responses: [
            when(
              ref('tahliye_dayanak'),
              L(
                'hakim',
                'Bugünkü tanık beyanları karşısında, sanığın işe gidip gelmesi için taşıt kullanmasına izin verilmesine; diğer adli kontrol tedbirlerinin devamına.',
              ),
              N('Volkan bana baktı. Üç aydır ilk kez bir şey ona geri verilmişti. Küçük bir şey. Bir direksiyon.'),
            ),
            otherwise(
              L('hakim', 'Talep bu aşamada reddedildi. Adli kontrol tedbirlerinin devamına.'),
              T('Erken. Bir sonraki celse.'),
            ),
          ],
          next: 'H1_08',
        }),
        option('AK_BERAAT', 'Adli kontrolün kaldırılmasını ve sanığın hemen beraatini talep ediyoruz.', {
          score: { USUL_BILGISI: -30 },
          bad: 'Delil toplanırken “hemen beraat” talebi erken ve dayanaksızdır; mahkeme bunu ciddiye almaz.',
          responses: says(L('hakim', 'Delil toplanıyor müdafi. Talebiniz reddedildi.')),
          next: 'H1_08',
        }),
        option('AK_YOK', 'Talebimiz yok.', {
          neutral: 'Adli kontrol aynen devam ediyor.',
          responses: says(L('hakim', 'Celse kapandı.')),
          next: 'H1_08',
        }),
      ],
    }),
    story('H1_08', {
      ...HEAR1,
      title: 'Adliye merdivenleri',
      background: 'adliye',
      lines: [
        when(
          any(flag('contra_n2'), flag('contra_n4')),
          card('ADLİYE ÖNÜ — 12.40', 'adliye'),
          N(
            'Merdivenlerde rüzgâr vardı. Gül bir eliyle şemsiyesini, öbür eliyle Volkan’ın kolunu tutuyordu. Volkan merdivenin ortasında durdu.',
          ),
          L(
            'volkan',
            'Taksici “görmedim” dedi. Kırk yıllık şoför. “Görmedim” dedi. Bunu duymak… bilmiyorum. Hafifledim mi, ağırlaştım mı?',
          ),
          L('gul', 'Hafifledin. Yüzünden belli. Üç aydır ilk kez kaşların aşağı indi.'),
          N(
            'Serkan yanımızdan geçti. Durmadı. Ama merdivenin dibinde bir an döndü, Volkan’a baktı. Bu sefer bakışında öfkeden başka bir şey vardı: bir soru.',
          ),
          T('Bir soru, öfkeden iyidir. Öfke bir cevap ister; soru bir gerçek.'),
          N('Telefonum titredi. Leyla: “Duydum. Taksiciyi utandırmadan çözmüşsün. İyi. Rapora itiraz ettin mi?”'),
        ),
        otherwise(
          card('ADLİYE ÖNÜ — 12.40', 'adliye'),
          N(
            'Merdivenlerde rüzgâr vardı. Gül bir eliyle şemsiyesini, öbür eliyle Volkan’ın kolunu tutuyordu. Volkan merdivenin ortasında durdu.',
          ),
          L('volkan', 'Taksici hâlâ “kırmızı” diyor. Hâkim ona bakıyordu. Bana değil.'),
          L('gul', 'Üç hafta daha var. Üç hafta, bir bebek, bir klasör. Yeter mi avukat hanım?'),
          N('Serkan yanımızdan geçti. Durmadı, bakmadı. Merdivenin dibinde bir sigara yaktı ve yağmurda söndürdü.'),
          N('Telefonum titredi. Leyla: “Nasıl geçti? Rapora itiraz ettin mi?”'),
        ),
      ],
      choices: [
        option('H108_LEYLA', 'Leyla’ya kısa ve dürüst bir cevap yaz.', {
          responses: [
            when(
              flag('h1_itiraz'),
              N(
                '“İtiraz ettim. Yeni heyet, ATK, EDR. Üç hafta.” Cevap bir dakika sonra geldi: “Üç hafta bir bilirkişi için kısa, bir avukat için uzun. Uyu biraz.”',
              ),
              T('Leyla “aferin” demez. “Uyu biraz” der. Aynı şey.'),
            ),
            otherwise(
              N(
                '“Raporu tam açamadım.” Cevap bir dakika sonra geldi: “O zaman elindekiyle açacaksın. Raporlar kendiliğinden yırtılmaz.”',
              ),
              T('Bir eksik bir celseyi kaybettirmez. İki eksik kaybettirebilir.'),
            ),
          ],
          next: 'ARA_GIRIS_1',
        }),
        option('H108_VOLKAN', 'Telefonu cebine koy; Volkan ve Gül’ü arabaya kadar geçir.', {
          effects: [inc('trust', 2)],
          responses: says(
            N(
              'Otoparka kadar yürüdük. Kimse konuşmadı. Gül arabanın kapısını açtı, Volkan yolcu tarafına geçti; hâlâ direksiyona oturamıyordu, ya da oturmak istemiyordu.',
            ),
            L('gul', 'Üç hafta sonra. Kızımız o zamana gelmiş olur. Gelirse… adını size söyleriz.'),
          ),
          next: 'ARA_GIRIS_1',
        }),
      ],
    }),
  ],
};

void ref;
