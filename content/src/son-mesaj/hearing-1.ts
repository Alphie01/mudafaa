import {
  all,
  any,
  cmp,
  cont,
  courtSession,
  dec,
  decisionNode,
  deliver,
  fallback,
  flag,
  has,
  hl,
  ifThen,
  inc,
  mark,
  meet,
  objectRule,
  option,
  presentRule,
  pressRule,
  raise,
  score,
  statement,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, Effect } from '../../../tools/content/src/kit/index.js';
import { B, O, W } from './dsl.js';
import { C3, court1 } from './shared.js';

// 60-hearing-1: birinci celse. Açılış, iddianame, sanığın savunması ve savcının sorusu, katılanın beyanı, ekran
// görüntüleri (itiraz), Kom. Yrd. Demirci'nin tanıklığı (S1–S5), talepler, ara karar ve erteleme.

export const wrongEvidence: Effect[] = [dec('cred'), dec('pers'), inc('wrong')];

const h1Delivery = deliver('H1_00', [
  { evidence: 'ev_hastane', requires: flag('hastane_istendi'), hint: 'Hastane kayıtlarını iste.' },
]);

const witness = { witness: 'hakan', witnessLabel: 'TANIK · KOM. YRD. HAKAN DEMİRCİ' };

export const hearing1: CasePart = {
  config: {
    objectionGrounds: [
      { id: 'g_kanaat', label: 'Tanığın kişisel kanaati', legalBasis: 'CMK 217 · tanık olguyu anlatır' },
      { id: 'g_duyum', label: 'Başkasından duyduğunu aktarma', legalBasis: 'CMK 210, 217' },
      { id: 'g_telkin', label: 'Telkin edici soru', legalBasis: 'CMK 201' },
    ],
  },
  court: {
    sessions: [
      courtSession('cs_1', '1. Celse', [
        ['s1_acilis', 'ACILIS', 'H1_00'],
        ['s1_iddia', 'IDDIANAME', 'H1_01'],
        ['s1_sanik', 'SANIK_SAVUNMASI', 'H1_02'],
        ['s1_katilan', 'TANIK_DINLEME', 'H1_03'],
        ['s1_delil', 'DELIL_TARTISMA', 'H1_04'],
        ['s1_tanik', 'TANIK_DINLEME', 'H1_05'],
      ]),
    ],
  },
  nodes: [
    court1.stage('H1_00', {
      title: 'Birinci celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onFirstEnter: [
        raise('in_court'),
        meet('feride'),
        meet('tolga'),
        meet('derya'),
        meet('recep'),
        meet('melis'),
        meet('sinan'),
      ],
      onEnter: [...h1Delivery.effects],
      lines: B(`
        # BURSA 7. ASLİYE CEZA MAHKEMESİ — 1. CELSE |bg=adliye
        > Adliyenin üçüncü katı. Koridorda ıslak şemsiyeler, kâğıt bardaklar, bir avukatın telefonda bağırışı. Tarık kapının yanında, takım elbiseli, kravatsız.
        tarik: Kurşun kalemi ceketin iç cebine koydum. Tıkırdatmayayım diye.
        P: İyi. Bugün konuşmayı ben yaparım. Siz yalnızca doğruyu söyleyin.
        > Karşı köşede bir kadın. Siyah bir palto, saçları topuz. Yanında Av. Sinan Bulut. Kadın bir kez bu tarafa baktı, sonra bakmadı.
        recep: Tarık Aksoy dosyası! Sanık, müdafii, katılan, katılan vekili, salona! |bg=durusma_salonu
        > Küçük bir salon. Tek bir kürsü, arkasında Hâkim Feride Ateş. Sağında Savcı Tolga Ekinci, solunda zabıt kâtibi. Klavye sesi.
        feride: Duruşmaya başlandı. Sanık tutuksuz, müdafiiyle hazır. Katılan vekiliyle hazır. Kimlik tespiti yapıldı.
        feride: Sanık, susma hakkınız var; savunmanızı yapmak zorunda değilsiniz. Bir müdafi ile temsil ediliyorsunuz. Lehinize delillerin toplanmasını isteyebilirsiniz.
        tarik: Anladım Sayın Hâkim.
        ~ Bir salon. Üç kişi karşımda: hâkim, savcı, kâtip. Bir kişi arkamda: bir baba, kızına verecek bir cevap arıyor.
        ~ Bir yıl önce başka bir salonda, başka bir müvekkil, ben hazırlıksız. Bugün hazırım. Elimde bir pano dolusu iplik, bir de üç soru.
        ~ İlk celse bir dava kazanmaz. Ama bir ilk celse, bir davayı kaybettirebilir. Bugün kaybetmeyeceğim; yarını bekleyeceğim.
        > Savcı dosyasını açtı, bir sayfayı işaretledi. Melis katılan sırasında, önüne bakıyordu. Hiç kimseye bakmıyordu.
      `),
      choices: [cont('H100_DEVAM', 'Devam', 'H1_01')],
    }),
    court1.stage('H1_01', {
      title: 'İddianame',
      courtStage: 'IDDIANAME',
      background: 'durusma_salonu',
      lines: B(`
        feride: İddianame özetini Cumhuriyet savcısı okusun.
        tolga: Sanık Tarık Aksoy; 6, 9 ve 12 Kasım gecelerinde kendi hesabından katılan Melis Karaca’ya, ihaleden çekilmesini isteyerek, aksi hâlde özel belge ve seslerinin açıklanacağı tehdidini göndermiştir.
        tolga: 9 Kasım gecesi katılanın özel hayatına ilişkin bir ses kaydını üçüncü bir kişiye iletmiştir. Mesajlar sanığın telefonunda, arşivlenmiş bir sohbette tespit edilmiştir.
        tolga: Sanığın TCK 107/2 delaletiyle 107/1 ve zincirleme hükmü 43/1, ayrıca özel hayatın gizliliğini ihlalden 134/2 uyarınca cezalandırılması talep olunur.
        tolga: Deliller açık Sayın Hâkim: mesajlar sanığın telefonunda, sanığın hesabında. Mağdurun en özel anı, bir yarar sağlamak için silah olarak kullanılmış.
        > Savcı oturdu. Kalemini dosyanın üstüne, düz bir çizgi gibi bıraktı. İyi bir savcı; acele etmiyor, ama bir yere dayanıyor.
        ~ “Kendisine ait hesaptan.” Bu cümle doğru. Tam da bu yüzden tehlikeli. Bütün iddianame, bu doğru cümlenin bir yanlışa dönüşmesine yaslanıyor.
        ~ Hesap Tarık’ın. Telefon Tarık’ın. Ama o hesabı o gece kullanan el? İddianame o eli, sahibinin eli sanıyor. Benim işim, o iki eli ayırmak.
      `),
      choices: [cont('H101_DEVAM', 'Devam', 'H1_02')],
    }),
    court1.objection('H1_02', {
      title: 'Sanığın savunması',
      courtStage: 'SANIK_SAVUNMASI',
      background: 'durusma_salonu',
      say: [
        { speaker: 'feride', text: 'Sanık, savunmanızı alalım. Müdafi, müvekkilinizle son kez görüşmek ister misiniz?' },
        { speaker: 'narrator', text: 'Tarık bana döndü. Gözleri bir şey soruyordu. Eğildim, kulağına fısıldadım.' },
      ],
      next: 'H1_02S',
      options: [
        option('H102_A', 'Anlatsın: o gecelerde ne yaptığını, kendi bildiğini, olduğu gibi.', {
          effects: [
            ifThen(
              flag('fact_hastane'),
              [score('SAVUNMA_STRATEJISI', 100, 'savunma'), inc('pers')],
              [score('SAVUNMA_STRATEJISI', 50, 'savunma')],
            ),
          ],
          good: 'Sanığın kendi ağzından, ayrıntılı ve tutarlı bir savunma mahkemenin vicdani kanaatine doğrudan ulaşır (CMK 191/3, 217). Bilinen olgularla sınırlı kalmak doğrudur.',
          category: 'SAVUNMA_STRATEJISI',
          responses: [
            W(
              all(flag('fact_hastane'), flag('fact_sifre')),
              `
              tarik: Sayın Hâkim, o mesajları ben yazmadım. Ne 6 Kasım’da, ne 9’unda, ne 12’sinde. O saatlerde ya evimde uyuyordum ya da bir hastane koridorunda babamı bekliyordum.
              tarik: 6 ve 12 Kasım gecelerinde evimdeydim, yalnızdım, uyuyordum. Bir uykunun tanığı olmaz, biliyorum. Ama yalan da söyleyemem.
              tarik: 9 Kasım gecesi babamla acil servisteydim. Kalbi tekledi, sabaha kadar oradaydım. Telefonum hemşire masasında şarjdaydı; sabah altıya kadar elime almadım.
              tarik: Şifreme gelince… Utanarak söylüyorum: bütün şifrelerim aynıydı. Kızımın doğum yılı, sonunda bir ünlem. Wifi de oydu, e-posta da, o uygulama da.
              tarik: Ofise gelen herkes o wifi şifresini bilirdi. Bir masanın üstünde, bir kâğıtta yazılıydı. Ben bir mimarım Sayın Hâkim, kasa çilingiri değil. Bir anahtarla bütün kapıları açmışım; hatam bu.
              > Salonda kısa bir sessizlik oldu. Kâtibin klavyesi birkaç saniye durdu. Hâkim bir şey not etti; başını kaldırmadan.
            `,
            ),
            W(
              flag('fact_hastane'),
              `
              tarik: Sayın Hâkim, o mesajları ben yazmadım. 6 ve 12 Kasım gecelerinde evimde uyuyordum.
              tarik: 9 Kasım gecesi babamla acil servisteydim. Telefonum hemşire masasında şarjdaydı. Sabaha kadar elime almadım.
              > Hâkim bir şey not etti. Savcı kaşlarını kaldırdı.
            `,
            ),
            O(`
              tarik: Sayın Hâkim, o mesajları ben yazmadım. O saatlerde uyuyordum. Telefonumda neden durduklarını bilmiyorum.
              > Kısa bir savunma. Doğru, ama kısa. Hâkim başını salladı, hiçbir şey yazmadı.
            `),
          ],
        }),
        option('H102_B', 'Susma hakkını kullansın; savunmayı bilirkişi raporundan sonra yapsın.', {
          neutral: 'Susma hakkı anayasal bir haktır (CMK 147/1-e) ve aleyhe yorumlanamaz; ama mazeretini kendi ağzından anlatma fırsatı bu celsede kullanılmamış oldu.',
          responses: B(`
            tarik: Sayın Hâkim, şu aşamada susma hakkımı kullanıyorum.
            > Savcı hafifçe gülümsedi. Hâkim yüzünü değiştirmedi; hakkın aleyhe yorumlanamayacağını biliyordu. Ben de biliyordum. Salon bilmiyordu.
          `),
        }),
        option('H102_C', 'Mesajları Melis Hanım’ın kendisinin uydurduğunu söylesin.', {
          effects: [score('SAVUNMA_STRATEJISI', -80, 'savunma'), dec('pers'), dec('cred')],
          bad: 'Hiçbir delile dayanmadan katılanı mesajları uydurmakla suçlamak savunmayı çökertir ve iftira (TCK 267) riski doğurur. Mesajlar sanığın hesabında duruyor.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
            tarik/kizgin: Sayın Hâkim… Bence bu mesajları Melis Hanım kendisi ayarladı. İhaleden beni çıkarmak için.
            > Salonun öbür ucunda Melis’in nefesi kesildi. Sinan ayağa kalktı, sonra hâkimin bakışıyla yeniden oturdu.
            feride: Sanık, bu ciddi bir iddia. Dayanağınız var mı?
            tarik: …Yok.
            ~ Yanlış. Kendi elimle müvekkilimin inandırıcılığını kestim.
          `),
        }),
        option('H102_D', 'Pişman olduğunu söylesin; hafifletici sebeplerden yararlanalım.', {
          effects: [score('SAVUNMA_STRATEJISI', -100, 'savunma'), dec('pers'), dec('trust', 15)],
          bad: '“Yapmadım” diyen müvekkile pişmanlık söyletmek, savunmanın bütün tezini çökertir; TCK 62 için samimi olmayan bir pişmanlık da yarar sağlamaz.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
            tarik/saskin: Pişman mı? Neyden pişman olayım? Ben yazmadım!
            > Sesi salonda yankılandı. Hâkim kaşını kaldırdı. Tarık bana, sanki ilk kez görüyormuş gibi baktı.
            tarik: Sayın Hâkim, mesajları ben yazmadım. Avukatım… yanlış anladı.
          `),
        }),
      ],
    }),
    court1.objection('H1_02S', {
      title: 'Savcının sorusu',
      courtStage: 'SANIK_SAVUNMASI',
      background: 'durusma_salonu',
      say: [
        { speaker: 'tolga', text: 'Bir sorum var Sayın Hâkim. Sanık, şifrenizi kimseyle paylaşmadığınıza göre bu mesajları siz gönderdiniz, öyle değil mi?' },
      ],
      next: 'H1_03',
      options: [
        option('H102S_A', 'İtiraz: soru, ispatlanmamış bir olguyu varsayıyor.', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers')],
          good: 'Soru, tartışmalı bir olguyu (şifrenin paylaşılmadığını) kabul edilmiş gibi sunarak cevabı yönlendiriyor. Hâkim uygun olmayan soruları reddeder (CMK 201); itiraz yerinde.',
          responses: B(`
            P: İtiraz ediyorum Sayın Hâkim. Soru, şifrenin paylaşılmadığını kanıtlanmış bir olgu gibi sunuyor. Bu henüz tartışmalı.
            feride: Kabul. Sayın Savcı, sorunuzu ikiye bölün.
            tolga: Peki. Sanık, şifrenizi kimseyle paylaştınız mı?
            tarik: Bütün şifrelerim aynıydı. Ofiste wifi şifresi olarak da kullanılıyordu.
          `),
        }),
        option('H102S_B', 'Müvekkilim bu soruya cevap vermeyecek.', {
          neutral: 'Sanık her soruda susma hakkını kullanabilir (CMK 147/1-e). Ama burada itiraz edilebilir bir soru vardı; susmak, sorunun izlenimini salonda bıraktı.',
          responses: B(`
            tarik: Cevap vermeyeceğim.
            tolga: Not edilsin Sayın Hâkim.
            feride: Not edildi. Aleyhe yorumlanmaz Sayın Savcı, biliyorsunuz.
          `),
        }),
        option('H102S_C', 'İtiraz! Sayın Savcı soruyla müvekkilimi suçlu ilan ediyor; masumiyet karinesi çiğneniyor.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'İtiraz, bir usul kuralına dayanmalıdır. Savcının soru sorması suçlama değil, görevidir; dayanaksız çıkış güvenilirliği düşürür.',
          responses: B(`
            feride: Müdafi, savcının soru sorma hakkı var. Usule ilişkin bir itirazınız varsa söyleyin.
            > Söyleyemedim. Savcı sorusunu yineledi.
          `),
        }),
        option('H102S_D', 'Bırak cevaplasın; saklayacak bir şeyi yok, kendisi anlatsın.', {
          effects: [ifThen(flag('fact_pay_sert'), [], [dec('pers')])],
          neutral: 'Soru yönlendiriciydi; itiraz edilmedi. Hazırlıklı bir sanık bundan zarar görmeyebilir, hazırlıksız biri görür.',
          responses: [
            W(
              flag('fact_pay_sert'),
              `
              tarik: Şifremi ofiste herkes biliyordu Sayın Savcı. Melis’e 25 Ekim’de sert mesajlar yazdım, evet. Kendi telefonumdan, kendi üslubumla. Tehdit etmedim.
              ~ Görüşmede konuşmuştuk. Hazırdı.
            `,
            ),
            O(`
              tarik: Ben… hayır, paylaşmadım. Yani bilerek paylaşmadım. Ama… Kimse bilmez. Yani bilirler. Wifi…
              > Cümle dağıldı. Savcı bir şey yazmadı; gerek yoktu.
            `),
          ],
        }),
      ],
    }),
    court1.objection('H1_03', {
      title: 'Katılanın beyanı',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      lines: B(`
        feride: Katılan Melis Karaca, sizi dinleyelim. Gerçeği anlatmanız gerektiğini hatırlatırım.
        > Melis kürsünün önüne geldi. Paltosunu çıkarmadı; sanki birazdan kalkıp gidecekmiş gibi. Elleri cebinde, sesi düz.
        melis: Üç gece. Üçünde de saat ikiyi geçiyordu. İlkinde bir mesaj ve bir fotoğraf geldi. Dört yıl önce bir kliniğin kapısından çıkarken aldığım bir kâğıdın fotoğrafı.
        melis: O kâğıdı dünyada iki kişi biliyordu: ben ve güvendiğim biri. Onu bir tek ona göstermiştim, “özgeçmişimdeki şu boşluğu nasıl anlatsam” diye.
        melis/uzgun: İkinci gece kendi sesimi duydum. Yıllar önce bir gece kardeşime ağlamışım, o beni kaydetmiş, saklamış. O kaydı da bir tek ona vermiştim. Ve o gece bir başkasına gitti. Hayri Bey’e.
        melis: Hayri Bey aradı. “Bir şey geldi kızım, dinlemedim, merak etme” dedi. İyi bir adam. Ama ben o gün işe gitmedim. Ertesi gün de. Bir hafta boyunca telefonumu elime almaya korktum.
        melis: Üçüncü gece “son mesaj” yazıyordu. Cuma’ya kadar ihaleden çekilmemi istiyordu. Çekilmedim. Bunu da bilin: ben çekilmedim. Hâlâ o dosyadayım.
        melis: Ortağımdı. Pay için kavga etmiştik, doğru. Ama bir insan, bir kavga yüzünden senin en kırılgan yerini gece yarısı eline alır mı? Alıyormuş demek. Neyse.
        > Oturdu. Paltosunun yakasını düzeltti. Salonda kimse kıpırdamadı; kâtibin klavyesi bile sustu.
        feride: Müdafi, katılana sorunuz var mı?
      `),
      next: 'H1_04',
      options: [
        option('H103_A', 'Sorum yok, Sayın Hâkim.', {
          score: { SAVUNMA_STRATEJISI: 30 },
          good: 'Mağdurun acısını sorgulamak savunmaya bir şey kazandırmaz; uyuşmazlık mesajların kaynağındadır. Ölçülü bir tavır.',
          responses: B(`
            P: Sorum yok Sayın Hâkim. Katılanın yaşadıklarını tartışmıyoruz. Mesajların kimden çıktığını tartışıyoruz.
            > Melis bana baktı. İlk kez.
          `),
        }),
        option('H103_B', 'Mesajlar size Tarık Bey’in yazdığı gibi mi yazılmıştı?', {
          visibleWhen: any(has('clue_uslup_tehdit'), flag('fact_sinan_kapi')),
          score: { SORGULAMA: 80 },
          effects: [inc('pers'), raise('fact_melis_sn')],
          good: 'Katılanın kendi gözlemine dayanan, yönlendirmeyen bir soru: mesajların dili.',
          responses: B(`
            melis: Hayır. Tarık hiç büyük harf kullanmaz. Hiç nokta koymaz. Bana bir kere bile “Sn.” demedi.
            melis: Ama hesap onun. Telefon onun. Ses kaydı da yalnızca ondaydı. Ne düşüneyim?
            tolga: Sayın Hâkim, bir yazı üslubu…
            feride: Not edildi. Devam edin.
          `),
        }),
        option('H103_C', 'Ses kaydını başka kimlere gönderdiniz?', {
          score: { SORGULAMA: -40 },
          effects: [dec('pers')],
          bad: 'Mağduru kendi mahremiyetini yaymakla ima eden bir soru; heyette savunmanın aleyhine bir izlenim bırakır. Bilgi başka yoldan alınabilirdi.',
          responses: B(`
            melis/kizgin: Kimseye. Bir tek ona. Bunu ima etmenize gerek yoktu.
            sinan: Sayın Hâkim, soru katılanı aşağılamaya yöneliktir.
            feride: Müdafi, dikkatli olun.
          `),
        }),
        option('H103_D', 'Katılan yalan söylüyor; bu mesajları kendisi yazdı!', {
          score: { SAVUNMA_STRATEJISI: -80 },
          effects: [dec('pers'), dec('cred')],
          bad: 'Delilsiz bir iftira iması; heyet nezdinde savunmanın inandırıcılığını yakar (TCK 267 riski).',
          responses: B(`
            feride: Müdafi! Bu bir soru değil. Bir daha tekrarlarsanız tutanağa geçiririm.
            > Melis’in yüzü bembeyaz oldu. Sinan bir şey yazdı. Muhtemelen benim adımı.
          `),
        }),
      ],
    }),
    court1.objection('H1_04', {
      title: 'Ekran görüntüleri',
      courtStage: 'DELIL_TARTISMA',
      background: 'durusma_salonu',
      prosecutionEvidence: 'ev_ss',
      say: [
        { speaker: 'tolga', text: 'Sayın Hâkim, Şube’nin tespit ettiği on dört ekran görüntüsünün okunmasını ve delil olarak değerlendirilmesini talep ediyorum.' },
        { speaker: 'feride', text: 'Okundu. Müdafi, diyeceğiniz?' },
      ],
      next: 'H1_05',
      options: [
        option('H104_A', 'Kararsız ve belgesiz rızayla alınmışlardır; hükme esas alınamaz.', {
          effects: [
            ifThen(
              has('ded_ss'),
              [
                score('USUL_BILGISI', 150, 'itiraz'),
                inc('pers'),
                inc('legal_hits'),
                raise('ss_excluded'),
                mark(
                  'GOOD',
                  'Bilgisayar ve kütüklerde arama ve kopyalama için hâkim kararı gerekir (CMK 134/1). Karar 13 Kasım’da; görüntüler 12 Kasım’da, imzasız bir “rıza” ile alındı. Hukuka aykırı elde edilen delil hükme esas alınamaz (Anayasa 20/2, 38/6; CMK 206/2-a, 217/2).',
                  'USUL_BILGISI',
                ),
              ],
              [
                ifThen(
                  any(has('clue_ss_karar'), has('clue_imza_yok')),
                  [
                    score('USUL_BILGISI', 80, 'itiraz'),
                    inc('legal_hits'),
                    raise('ss_excluded'),
                    mark(
                      'GOOD',
                      'Dayanak kısmen ortaya kondu (tarih ya da imza); hâkim görüntüleri dışarıda bıraktı. İki dayanağı birlikte sunsaydın itiraz daha güçlü olurdu.',
                      'USUL_BILGISI',
                    ),
                  ],
                  [
                    score('USUL_BILGISI', 20, 'itiraz'),
                    mark(
                      'NEUTRAL',
                      'Hukuki çerçeve doğru (CMK 134/1, 206/2-a, 217/2), ama hangi olguya dayandığını gösteremedin: tutanaktaki tarihler ve imza hanesi.',
                      'USUL_BILGISI',
                    ),
                  ],
                ),
              ],
            ),
          ],
          responses: [
            W(
              any(has('ded_ss'), has('clue_ss_karar'), has('clue_imza_yok')),
              `
              P: Sayın Hâkim, görüntüler 12 Kasım 15.44’te alındı. Arama ve kopyalama kararı 13 Kasım 10.20 tarihli. Tutanakta “rıza” yazıyor; müvekkilimin imzası yok.
              P: Karar olmadan, belgelenmemiş bir rızayla alınan bu görüntüler hukuka aykırıdır. Hükme esas alınmamalarını talep ediyorum.
              tolga: Sanık telefonunu kendisi verdi Sayın Hâkim!
              feride: Telefonu vermek, içinde arama yapılmasına rıza göstermek değildir Sayın Savcı. Görüntüler hükme esas alınmayacak. Değerlendirme imaj üzerinden yapılacak. |fx=shake
              ~ Bir kapı açıldı. Leyla haklıydı: içeride bir oda daha var.
            `,
            ),
            O(`
              P: Sayın Hâkim, görüntüler hukuka aykırı alınmıştır; hükme esas alınamaz.
              feride: Neye dayanarak müdafi? Tarih, imza, karar? Somut bir şey söyleyin.
              > Söyleyemedim. Tutanağı okumamıştım.
              feride: Talep şimdilik reddedildi. Değerlendirmeyi hükümde yaparım.
            `),
          ],
        }),
        option('H104_B', 'Görüntüler mesajları kimin yazdığını göstermez; ispat gücü yoktur.', {
          score: { DELIL_ANALIZI: 60 },
          good: 'Doğru bir değerlendirme: ekran görüntüsü yalnızca bir hesabın ekranını gösterir; yazanı göstermez. Ama hukuka uygunluk itirazı daha güçlüydü.',
          responses: B(`
            P: Görüntüler bir hesabın ekranını gösterir Sayın Hâkim. Hesabı kimin kullandığını göstermez.
            feride: Not edildi. Takdir mahkemeye ait.
          `),
        }),
        option('H104_C', 'Arama kararı yok; konut araması kurallarına aykırıdır.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Telefon içeriğinde arama ve kopyalama, konut ve kişi aramasının (CMK 116–119) değil, bilgisayar ve kütüklerde aramanın (CMK 134) kapsamındadır. Yanlış dayanak.',
          responses: B(`
            tolga: Sayın Hâkim, ortada bir konut araması yok. Müdafi galiba başka bir dosyaya hazırlanmış.
            > Salonda biri güldü. Kâtip bile.
          `),
        }),
        option('H104_D', 'Diyeceğimiz yok.', {
          bad: 'Karardan önce alınmış görüntülere itiraz edilmedi; savunmanın en somut usul kozu kullanılmadı.',
          category: 'USUL_BILGISI',
        }),
      ],
    }),
    court1.stage('H1_05', {
      title: 'Tanık',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      ...witness,
      onFirstEnter: [meet('hakan')],
      lines: B(`
        recep: Tanık Hakan Demirci!
        > Siber Şube’nin komiser yardımcısı. Otuzlarının ortasında, tıraşlı, kendinden fazlasıyla emin. Ceketini ilikledi, kürsüye bir sunum yapmaya çıkar gibi çıktı.
        > Tarık yanımda kıpırdandı. “Bu adam beni açtırdı,” diye fısıldadı. “İmza istemedi.” Elimi onun koluna koydum: sakin.
        feride: Kimliğiniz tespit edildi. Sanıkla akrabalığınız yok. Gerçeği söylemekle yükümlüsünüz; yalan tanıklığın suç olduğunu hatırlatırım. Yemininizi edin.
        hakan: Bildiğimi dosdoğru söyleyeceğime namusum ve vicdanım üzerine yemin ederim.
        feride: Anlatın. Olayı kendi gözlemlerinizle sınırlı tutun.
        ~ Bu tanık raporu yazan adam. Raporun sonucunu ezbere bilir. Ama eklerini okumuş mu? Birazdan göreceğiz.
      `),
      choices: [cont('H105_DEVAM', 'Tanığı dinle', 'H1_05T')],
    }),
    court1.testimony('H1_05T', {
      title: 'Kom. Yrd. Demirci',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      ...witness,
      say: [
        { speaker: 'narrator', text: 'Tanık ifadesini kesintisiz verdi. Hâkim sorular için söz verdi.' },
        { speaker: 'feride', text: 'Müdafi, sorularınız?' },
      ],
      rulesText: 'Bir ifadeyi bastır ya da çelişkiyi gösteren delili sun. Yanlış delil güvenilirliği ve skoru düşürür.',
      objectionGrounds: ['g_kanaat', 'g_duyum', 'g_telkin'],
      statements: [
        statement('S1', 1, [
          'Şüpheli telefonun kilidini ',
          hl('kendi rızasıyla', any(flag('press_s1'), has('clue_imza_yok'))),
          ' açtı. Bunu tutanağa da yazdık.',
        ]),
        statement('S2', 2, [
          'Ekran görüntüleri yalnızca belgeleme içindi, usulüne uygundur. İçeriğe kimse dokunmadı; cihaz ',
          hl('aynı gün güvence altına alındı', any(flag('press_s2'), has('ded_zincir'))),
          ' ve bir daha açılmadı.',
        ]),
        statement('S3', 3, [
          'Mesajların hepsi şüphelinin hesabında, şüphelinin ',
          hl('telefonundan, onun eliyle', any(flag('press_s3'), has('clue_cihaz3'))),
          ' gönderilmiştir. Raporumuz bunu açıkça söylüyor, tartışmaya yer yok.',
        ]),
        statement('S4', 4, [
          'İmaj alınırken SHA-256 hash değeri hesaplandı, doğrulandı. ',
          hl('Delilin bütünlüğü baştan sona tamdır', any(flag('press_s4'), has('clue_son_erisim'))),
          '.',
        ]),
        statement('S5', 5, [
          'On yıllık meslek hayatımda gördüğüm şu: ',
          hl('bu tür mesajları atanlar hep “ben yazmadım” der'),
          '.',
        ]),
      ],
      rules: [
        presentRule('PS_H1_SAVCILIK', undefined, ['ev_ss', 'ev_sikayet', 'ev_pay', 'ev_ozan_ifade'], {
          maxUses: 3,
          effects: [
            ...wrongEvidence,
            score('SORGULAMA', -150, 'hatali'),
            mark('BAD', 'Bu, savcılığın iddiasını taşıyan bir delil; tanığın ifadesini çürütmez, iddiayı tekrarlar.', 'SORGULAMA'),
          ],
          responses: B(`
            tolga: Sayın Hâkim, müdafi bizim delilimizi sunuyor. Teşekkür ederiz.
            feride: Müdafi, bu delilin ifadeyle bağını kuramadınız.
          `),
        }),
        pressRule('PR_S1', 'S1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s1')],
          responses: B(`
            P: “Kendi rızasıyla açtı” diyorsunuz. Rızasını tutanağa yazdınız. Peki o rızanın altına imzasını da aldınız mı?
            hakan: Şüpheli acele ediyordu, ifadesi vardı. İmza işlemi sonraya kalmıştı. Tutanağı ben imzaladım.
            P: Siz imzaladınız. Yani tutanakta onun rızası yazıyor, ama o rızayı yazan da, imzalayan da sizsiniz. Onun eli o kâğıda hiç değmedi.
            hakan: Usule uygun bir tutanaktır. Biz her gün böyle yaparız.
            P: Her gün yapmanız, usule uygun olduğunu göstermez Komiser Bey. Yalnızca alışkanlık olduğunu gösterir.
          `),
        }),
        presentRule('PS_S1A', 'S1', ['ded_ss'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_s1'), mark('GOOD', 'Rıza belgelenmemiş, görüntüler karardan önce: tanığın “rıza” anlatımı çöktü.', 'SORGULAMA')],
          responses: B(`
            P: 15.44. Görüntüler. 13 Kasım 10.20. Karar. İmza hanesi boş. “İmzadan kaçındı” şerhi yok. Bu rızayı kim verdi Komiser Bey?
            hakan/saskin: Şüpheli… telefonu kendisi verdi.
            feride: Telefonu vermek ile içinde arama yapılmasına izin vermek aynı şey değil. Tanık, bunu biliyorsunuz.
            hakan: …Biliyorum Sayın Hâkim.
          `),
        }),
        presentRule('PS_S1B', 'S1', ['ev_tutanak'], {
          enabledWhen: all(flag('press_s1'), has('clue_imza_yok')),
          score: { SORGULAMA: 150 },
          effects: [inc('pers'), raise('contra_s1'), mark('GOOD', 'Tanığın kendi tutanağı rızayı belgelemiyor.', 'SORGULAMA')],
          responses: B(`
            P: Kendi tutanağınız. Son satır. Şüpheli imzası: noktalar. Bu bir rıza mı?
            hakan: Sonradan alınacaktı.
            feride: Alınmadı ama. Not edildi.
          `),
        }),
        presentRule('PS_S1C', 'S1', ['ev_tutanak'], {
          responses: B(`
            hakan: Evet, işte. “Şüphelinin rızasıyla.” Tutanakta yazıyor.
            ~ Onun lehine okudu. Önce sormam gerekirdi: imza nerede?
          `),
        }),
        pressRule('PR_S2', 'S2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s2')],
          responses: B(`
            P: Güvence altına almak. Nasıl? Mühürlü bir torba mı, kayıtlı bir emanet mi?
            hakan: Zarf. Bantlı bir zarf. Benim çekmecemde kilit vardır.
            P: Mühür?
            hakan: O gün mühür… mühür yoktu. Ertesi gün kararla birlikte usule uygun hâle getirildi.
          `),
        }),
        presentRule('PS_S2', 'S2', ['ded_zincir'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_s2'), mark('GOOD', 'Mühürsüz geçen iki gün ve Şube’deki son kilit açılışı: delil zinciri belgesiz.', 'SORGULAMA')],
          responses: B(`
            P: “Güvence altına aldık” diyorsunuz. Nasıl? Mühürlü bir torbayla mı, kayıtlı bir emanet defteriyle mi?
            hakan: Kahverengi bir zarfa koyduk, ağzını bantladık. Benim çekmecem kilitlidir.
            P: Bantlı bir zarf, açılıp kapanabilen bir zarftır Komiser Bey. Mühür hanesi tutanakta boş. Kendi raporunuzun ekinde son kilit açılışı: 12 Kasım 15.52, Şube’de, sizin incelemenizde. İmaj ise 14 Kasım’da.
            P: Arada iki koca gün var. O iki gün telefon nerede durdu, kim açtı, kim baktı? Bunu hangi kâğıt belgeliyor?
            hakan: Telefona kimse dokunmadı. Çekmecemdeydi.
            P: “Dokunulmadı” sizin sözünüz. Ben bir kâğıt soruyorum; bir tutanak, bir emanet kaydı, bir imza.
            > Tanık dosyaya baktı. Sayfaları çevirdi. Dosya bir şey söylemedi; çünkü o iki gün hiç yazılmamıştı.
            feride: Not edildi. 12–14 Kasım arası muhafaza süreci tutanakla belgelenmemiş.
          `),
        }),
        pressRule('PR_S3', 'S3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s3')],
          responses: B(`
            P: Rapor “telefonundan, onun eliyle” mi diyor? Hangi ekte?
            hakan: Ek-3. Gönderen hesap: Tarık Aksoy. Mesajlar telefondaki hesapta duruyor.
            P: Hesap, telefon ve el. Üç ayrı şey söylediniz. Rapor hangisini söylüyor?
            hakan: Hepsi aynı şey avukat hanım.
          `),
        }),
        presentRule('PS_S3A', 'S3', ['ded_bagli'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_s3'),
            mark('GOOD', 'Raporun kendi Ek-3 tablosu ve hesap verisi: tehditler telefondan değil, hesaba bağlı bir masaüstü oturumundan gönderildi.', 'SORGULAMA'),
          ],
          responses: B(`
            P: Kendi raporunuzun Ek-3’ü. En sağdaki sütun: gönderen cihaz numarası. Tarık’ın 25 Ekim’deki kendi mesajları: cihaz 0. Peki ya üç tehdit ve iletilen ses kaydı?
            hakan: …Orada ne yazıyorsa.
            P: Üç. Üçü de cihaz 3. Cihaz 0 değil. Peki cihaz 3 nedir? Hesap verisi diyor ki: OFIS-LAPTOP-07, bir masaüstü oturumu. Şubat’ta bağlanmış, hiç kapatılmamış. Son etkin: 12 Kasım 02.21. Son mesajdan iki dakika sonra.
            > Tanık raporun eklerini açtı. Bir sayfa çevirdi. Bir sayfa daha. Parmağı o sütunda durdu, orada kaldı.
            hakan/saskin: Bu sütun… raporun ekinde. Ham veri bu. Ben değerlendirmeyi hesap üzerinden yaptım. Hesap şüphelinin.
            feride: Hesap şüphelinin olabilir Komiser Bey. Ama soru o değil. Telefondan gönderildiğini nereden çıkardınız?
            hakan: …Hesap telefondaydı Sayın Hâkim. Yani telefonda da vardı.
            feride: “Da vardı” ile “oradan gönderildi” aynı şey değil. Not edildi.
            > Salonda bir uğultu yükseldi, kemerlerde dolaştı. Hâkim tokmağa uzandı, vurmadı; gerek kalmadı. Melis katılan sırasında başını kaldırdı ve ilk kez Tarık’a baktı. |fx=shake
          `),
        }),
        presentRule('PS_S3B', 'S3', ['ev_imaj'], {
          enabledWhen: has('clue_cihaz3'),
          score: { SORGULAMA: 150 },
          effects: [inc('pers'), raise('partial_s3'), mark('GOOD', 'Ek-3’teki cihaz sütununu gösterdin; ama cihaz 3’ün ne olduğunu kuramadın.', 'SORGULAMA')],
          responses: B(`
            P: Kendi raporunuz, Ek-3. Gönderen cihaz: Tarık’ın mesajlarında 0, tehditlerde 3. Cihaz 3 nedir?
            hakan: Teknik bir ayrıntı. Aynı hesap.
            P: Aynı hesap, farklı cihaz.
            feride: Bunu bir bilirkişiye sormak gerekecek gibi.
          `),
        }),
        presentRule('PS_S3C', 'S3', ['ded_hastane'], {
          score: { SORGULAMA: 150 },
          effects: [inc('pers'), raise('partial_s3'), raise('kilit_mahkemede'), mark('GOOD', '9 Kasım gecesi telefon kilitli ve şarjdaydı: “onun eliyle” anlatımı en azından bir gece için çöktü.', 'SORGULAMA')],
          responses: B(`
            P: 9 Kasım, 02.14. Raporunuzun Ek-2’sine göre telefon 01.40’tan 06.10’a kadar kilitli. Müvekkilim 02.10’da acil serviste bir onam formu imzalıyor.
            hakan: Telefon kilitliyken de… bildirimden… yani…
            feride: Kilitli bir telefondan, sahibinin eli değmeden bir ses kaydı nasıl iletilir tanık?
            hakan: Bilemiyorum Sayın Hâkim.
          `),
        }),
        pressRule('PR_S4', 'S4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_s4')],
          responses: B(`
            P: Hash değeri ne zaman hesaplandı?
            hakan: İmajla birlikte. 14 Kasım, 11.05.
            P: Telefon Şube’ye 12 Kasım’da geldi.
            hakan: Doğru.
          `),
        }),
        presentRule('PS_S4A', 'S4', ['ded_zincir'], {
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_s4'), mark('GOOD', 'Hash, alındığı andan sonrasını korur; öncesini değil. İki gün belgesiz.', 'SORGULAMA')],
          responses: B(`
            P: Hash, imajın alındığı anın parmak izidir. 14 Kasım’dan sonrası için “bütünlük tam” diyebilirsiniz. 12 ile 14 arası için hangi parmak izi var?
            hakan: …Yok.
          `),
        }),
        presentRule('PS_S4B', 'S4', ['ev_imaj'], {
          enabledWhen: all(flag('press_s4'), has('clue_son_erisim')),
          score: { SORGULAMA: 150 },
          effects: [inc('pers'), raise('contra_s4'), mark('GOOD', 'Raporun kendi Ek-2’si: son kilit açılışı imajdan iki gün önce.', 'SORGULAMA')],
          responses: B(`
            P: Raporunuzun Ek-2’si. Son kilit açılışı 12 Kasım 15.52. Hash 14 Kasım’da. Arada açılmış bir telefon. “Bütünlük tam” mı?
            hakan: O açılış… bizim incelememizdi.
            feride: Not edildi.
          `),
        }),
        pressRule('PR_S5', 'S5', {
          responses: B(`
            P: Hepsi mi? Kaç dosya?
            hakan: Yeterince. Tecrübe bunu söyler.
          `),
        }),
        objectRule('OB_S5', 'S5', 'g_kanaat', {
          score: { USUL_BILGISI: 80 },
          effects: [inc('legal_hits'), inc('pers'), mark('GOOD', 'Tanık olguyu anlatır; genelleme ve kişisel kanaati delil değildir (CMK 217). İtiraz yerinde.', 'USUL_BILGISI')],
          responses: B(`
            P: İtiraz ediyorum. Tanık gördüğünü değil, kanaatini anlatıyor.
            feride: Kabul. Tanık, yalnızca bu dosyada yaptıklarınızı anlatın.
          `),
        }),
      ],
      presentMiss: fallback('FB_H1_PRESENT', 'PRESENT', {
        effects: [...wrongEvidence, score('SORGULAMA', -150, 'hatali'), mark('BAD', 'Sunduğun delil bu ifadeyle çelişmiyor.', 'SORGULAMA')],
        responses: B(`feride: Müdafi, bu delilin bu ifadeyle ilgisini göremedim.`),
      }),
      objectMiss: fallback('FB_H1_OBJECT', 'OBJECT', {
        effects: [dec('cred'), score('USUL_BILGISI', -50, 'hatali'), mark('BAD', 'Dayanaksız itiraz.', 'USUL_BILGISI')],
        responses: B(`feride: İtiraz reddedildi. Devam edin müdafi.`),
      }),
      finish: {
        id: 'H105T_BITIR',
        label: 'Çapraz sorguyu bitir',
        next: { routes: [{ when: flag('contra_s3'), to: 'H1_05H' }, { to: 'H1_06' }] },
      },
    }),
    court1.stage('H1_05H', {
      title: 'Sütun',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      lines: B(`
        > Tanık kürsüden indi. Yerine oturmadı; salonun arkasında, duvarın dibinde durdu, elinde raporu.
        > Katılan sırasında Sinan, Melis’e eğildi, bir şey fısıldadı. Melis başını iki yana salladı. Sonra durdu. Sonra bir kez salladı, aşağı yukarı.
        tarik: Cihaz 3. Ben bunu bilmiyordum. Hiç bilmiyordum.
        P: Biliyorum. Şimdi hâkim de biliyor.
        ~ Bir sütun. Kimsenin okumadığı bir sütun. Bir dizüstü. Bir oturum. Ama kimin elinde?
      `),
      choices: [cont('H105H_DEVAM', 'Devam', 'H1_06')],
    }),
    court1.objection('H1_06', {
      title: 'Talepler',
      courtStage: 'DELIL_TARTISMA',
      background: 'durusma_salonu',
      hud: ['slots2', 'cred', 'pers'],
      say: [{ speaker: 'feride', text: 'Tarafların delil talepleri? Müdafi, sizi dinliyorum.' }],
      options: [
        option('T1_BILIRKISI', 'Bağımsız adli bilişim bilirkişisi ve imajın bir kopyası', {
          visibleWhen: { not: flag('bilirkisi_istendi') },
          cost: [{ var: 'slots2', amount: 1 }],
          score: { USUL_BILGISI: 30 },
          effects: [raise('bilirkisi_istendi')],
          good: 'Kolluk raporunun eki yorumlanmamış; mahkeme özel ve teknik bilgi gerektiren konuda bilirkişi atar (CMK 63/1). Yedekten bir kopya savunmaya verilir (CMK 134/5).',
          responses: B(`feride: Kabul. Bir adli bilişim bilirkişisi atanacak; imajın kopyası müdafiye verilecek.`),
          next: '$stay',
        }),
        option('T1_ISP', '85.105.44.17’nin üç gecedeki abonesinin sağlayıcıdan sorulması', {
          visibleWhen: has('clue_ip_ayni'),
          cost: [{ var: 'slots2', amount: 1 }],
          score: { USUL_BILGISI: 60 },
          effects: [raise('isp_istendi')],
          good: 'Somut bir IP adresi ve üç somut zaman: talep belirli ve olayla bağlantılı. Mahkeme internet servis sağlayıcısından abone bilgisini isteyebilir.',
          responses: B(`
            tolga: Sayın Hâkim, bu bir balık avı…
            feride: Üç gece, üç saat, bir adres. Balık avı değil Sayın Savcı. Kabul. Sağlayıcıya müzekkere yazılsın.
          `),
          next: '$stay',
        }),
        option('T1_ISP_GENEL', 'Hesaba bağlanan bütün IP adreslerinin araştırılması', {
          visibleWhen: { not: has('clue_ip_ayni') },
          cost: [{ var: 'slots2', amount: 1 }],
          neutral: 'Hangi adres, hangi zaman? Belirsiz talepler reddedilir. Hesap verisindeki oturum kayıtları talebi somutlaştırırdı.',
          responses: B(`feride: Hangi adres müdafi? Hangi saat? Bu hâliyle talep reddedildi.`),
          next: '$stay',
        }),
        option('T1_HAYRI', 'Hayri Sezer’in tanık olarak dinlenmesi', {
          visibleWhen: { not: flag('hayri_istendi') },
          cost: [{ var: 'slots2', amount: 1 }],
          score: { USUL_BILGISI: 20 },
          effects: [raise('hayri_istendi')],
          good: 'Ses kaydının alıcısı, iletinin saatine doğrudan tanıktır.',
          responses: B(`feride: Kabul. Tanık Hayri Sezer gelecek celsede dinlenecek.`),
          next: '$stay',
        }),
        option('T1_HASTANE', 'Hastane kayıtlarının resmî yoldan celbi', {
          visibleWhen: all(flag('fact_hastane'), { not: flag('hastane_istendi') }, { not: has('ev_hastane') }),
          cost: [{ var: 'slots2', amount: 1 }],
          score: { USUL_BILGISI: 20 },
          effects: [raise('hastane_istendi')],
          good: 'Sanığın 9 Kasım gecesi nerede olduğunu gösterecek resmî kayıt.',
          responses: B(`feride: Kabul.`),
          next: '$stay',
        }),
        option('T1_ADLI', 'Adli kontrolün (yurt dışı çıkış yasağı) kaldırılması', {
          cost: [{ var: 'slots2', amount: 1 }],
          effects: [
            ifThen(
              any(flag('contra_s3'), flag('ss_excluded'), flag('contra_s1')),
              [
                raise('adli_kontrol_kalkti'),
                score('USUL_BILGISI', 30),
                mark('GOOD', 'Delil durumu değişti; ölçülülük gereği adli kontrol kaldırılabilir (CMK 109, 110).', 'USUL_BILGISI'),
              ],
              [mark('NEUTRAL', 'Delil durumu değişmeden adli kontrolün kaldırılması talebi kabul görmez.', 'USUL_BILGISI')],
            ),
          ],
          responses: [
            W(
              any(flag('contra_s3'), flag('ss_excluded'), flag('contra_s1')),
              `feride: Bugünkü delil durumu karşısında yurt dışı çıkış yasağının sürdürülmesi ölçülü değil. Kaldırılmasına.`,
            ),
            O(`feride: Şu aşamada delil durumunda değişiklik yok. Reddedildi.`),
          ],
          next: '$stay',
        }),
        {
          id: 'T1_VER',
          kind: 'CONTINUE',
          label: 'Taleplerimiz bu kadar',
          role: 'PRIMARY',
          next: 'H1_07_1',
        },
      ],
    }),
    decisionNode('H1_07_1', [{ to: 'H1_07_2' }], {
      ...C3,
      title: 'Ara karar',
      lines: B(`
        feride: Ara karar. Tarafların talepleri değerlendirildi.
      `),
    }),
    decisionNode('H1_07_2', [{ to: 'H1_07_3' }], {
      ...C3,
      title: 'Ara karar',
      lines: [
        W(
          flag('bilirkisi_istendi'),
          `feride: Bir: imaj üzerinde adli bilişim bilirkişisi incelemesi yapılmasına; bilirkişinin gelecek celsede dinlenmesine; imajın bir kopyasının müdafiye verilmesine.`,
        ),
        O(`feride: Bir: kolluk raporunun dosyada bulunduğu anlaşılmakla ayrıca bilirkişi incelemesine yer olmadığına.`),
      ],
    }),
    decisionNode('H1_07_3', [{ to: 'H1_07' }], {
      ...C3,
      title: 'Ara karar',
      lines: [
        W(isp(), `feride: İki: 85.105.44.17 adresinin belirtilen tarih ve saatlerdeki abone bilgisinin servis sağlayıcıdan sorulmasına.`),
        W(flag('hayri_istendi'), `feride: İki: tanık Hayri Sezer’in gelecek celsede dinlenmesine.`),
        O(`feride: İki: katılan vekilinin bildirdiği tanık Ozan Tekin’in gelecek celsede dinlenmesine.`),
      ],
    }),
    court1.stage('H1_07', {
      title: 'Erteleme',
      courtStage: 'DELIL_TARTISMA',
      background: 'durusma_salonu',
      lines: B(`
        feride: Tanık Ozan Tekin’in dinlenmesi ve ara kararların infazı için duruşma üç hafta sonraya bırakıldı. Taraflara gelecek celse hatırlatıldı.
        > Tokmak. Tek ve kuru. Salonun yankısı bir an kemerlerde dolaştı. |fx=shake
        > Salon boşalırken Melis kapıda bir an durdu. Dönüp bana baktı; dudakları aralandı, sanki bir şey söyleyecekti. Sinan usulca koluna dokundu. Vazgeçti; yürüdüler.
        > Tarık merdivenlerde yanıma geldi. Üç haftadır ilk kez kurşun kalemini tıkırdatmıyordu.
        tarik: Üç hafta. Perşembe teslim günüydü, geçti. Vakıf ihaleyi askıya almış. Bir mimar için askı demek, projenin havada kalması demek.
        P: Askı geçicidir Tarık Bey. Üç hafta bize zaman veriyor.
        tarik: Zamanla ne yapacağız?
        P: O ekranın kime ait olduğunu bulacağız. Siz değilseniz, biri. Ve o biri artık bir sütunda görünmeye başladı.
        ~ Zaman ve bir isim. Ama o ismi ben koymayacağım. Bir dizüstü, bir hat, bir demirbaş listesi koyacak. İsimleri insanlar değil, kâğıtlar söylemeli. |fx=fade
      `),
      choices: [cont('H107_DEVAM', 'Adliyeden çık', 'ARA_GIRIS_1', { role: 'PRIMARY' })],
    }),
  ],
  discoveryPaths: [...h1Delivery.discoveryPaths],
};

function isp() {
  return flag('isp_istendi');
}

export const _h1 = [cmp, v];
