import {
  all,
  any,
  cmp,
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
  not,
  objective,
  option,
  raise,
  score,
  set,
  topic,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { INV1, card, me, n, s, th } from './shared.js';

// 52-investigation-kaan: cezaevinde müvekkil görüşmesi. Konular başka yerlerde bulunan bilgilerle açılır (kilit, şekerlik,
// mesaj, Tolga, tedavi). Doruk: Kaan’ın eylüldeki alımları itiraf etmesi ve rıza konuşması.

const trustHigh = cmp(v('trust'), '>=', 60);

export const inv1Kaan: CasePart = {
  nodes: [
    decisionNode('INV_GORUS_G_1', [{ to: 'INV_GORUSME' }], {
      ...INV1,
      title: 'Müvekkil görüşmesi',
      lines: [
        {
          when: cmp({ visits: 'INV_GORUSME' }, '==', 0),
          lines: [
            card('BURSA H TİPİ CEZAEVİ — AVUKAT GÖRÜŞ ODASI', 'gorus_odasi'),
            n(
              'Üç kapı, iki arama, bir imza. Koridorlar çamaşır suyu ve demlenmiş çay kokuyordu. Her kapı arkamdan kilitlendikçe ceketim biraz daha ağırlaştı.',
            ),
            s('gardiyan', 'Avukat görüşü. Görüş salonu beşte kapanır. Camdan bakarım; konuşmanızı duymam.'),
            s(
              'gardiyan',
              'Bu çocuk her akşam sayıyor, avukat hanım. Parmaklarıyla. Kaç gün oldu diye. Hapis gününü değil. Temiz gününü.',
            ),
            n(
              'Kaan içeri girdi. Gri eşofman, yenmiş tırnak etleri, burnunun üstünde bantlı bir gözlük. Oturdu ve gözlerini masanın vidalarına dikti.',
            ),
            s('kaan', 'Ablam mı gönderdi? Tabii ablam gönderdi. Ablam her şeyi gönderir. Neyse.', 'uzgun'),
            th('“Neyse.” Konuyu kapatmak için söylenen kelime. Bu görüşmede onu çok duyacaktım.'),
            me(
              'Ablan beni gönderdi, evet. Ama ben kendi isteğimle buradayım. Sana bir şey soracağım ve cevabını bilmiyorum. Bu yüzden soruyorum.',
            ),
            s('kaan', 'Avukatlar cevabını bildikleri soruyu sorarmış. Dizilerde öyle.', 'saskin'),
            me('Mahkemede öyle. Burada değil.'),
            n(
              'Kaan ilk kez başını kaldırdı. Gözlüğünün arkasında uykusuz, kızarık gözler. Yirmi dört yaşında birinin değil, yorgun bir babanın gözleri.',
            ),
          ],
        },
        {
          lines: [
            card('BURSA H TİPİ CEZAEVİ — GÖRÜŞ ODASI, İKİNCİ ZİYARET', 'gorus_odasi'),
            n('Hasan Çakır bu sefer başıyla selam verdi. Kaan içeri girerken ilk kez gözlerime baktı.'),
            s('kaan', 'Geldiniz. Gelmezsiniz sandım. İnsanlar bir kere gelir; ikincisinde iş olur.'),
            me('İş olduğu için geldim. Ama ikinci kez geldim.'),
            s('kaan', 'Kırk dört gün oldu. Temiz. Burada temiz kalmak kolay sanıyorlar. Değil. Neyse. Sorun.'),
            n(
              'Masanın üstünde, tükenmezle yazılmış bir kâğıt parçası. Kaan fark etti, kâğıdı ters çevirdi. Gördüğüm tek kelime “perşembe”ydi.',
            ),
            th(
              'Bir takvim. Cezaevinde bile. İnsan takvimini kaybedince kendini kaybeder; Kaan kendini kaybetmemek için perşembeleri sayıyor.',
            ),
          ],
        },
      ],
    }),
    interview('INV_GORUSME', {
      ...INV1,
      title: 'Müvekkil görüşmesi',
      hud: ['min', 'trust'],
      room: { label: 'CEZAEVİ · GÖRÜŞ ODASI', character: 'kaan' },
      onFirstEnter: [meet('gardiyan'), ifThen(flag('defne_durust'), [inc('trust', 2)])],
      onEnter: [ifThen(cmp({ visits: 'INV_GORUSME' }, '>', 1), [set('min', 8)])],
      lines: [
        {
          when: cmp({ visits: 'INV_GORUSME' }, '==', 1),
          lines: [
            n(
              'Duvarda bir saat; camının arkasında bir sinek ölüsü. Saat iki dakika ileriydi. Burada herkes zamanın biraz ilerisinde ya da gerisinde yaşıyordu.',
            ),
            n('Görüş salonunun kapanışına 14 dakika var. Hasan Çakır camın ardında; görür ama duymaz.'),
          ],
        },
        { lines: [n('Görüş salonunun kapanışına 8 dakika var. Yeni sorular, eski bir oda.')] },
      ],
      tones: [
        { id: 'soft', label: 'Yumuşak', hint: '+4 güven' },
        { id: 'hard', label: 'Sert', hint: '−8 güven · daha az savunma' },
      ],
      toneEffects: {
        soft: [inc('trust', 4), set('tone', 'soft')],
        hard: [dec('trust', 8), set('tone', 'hard')],
      },
      moodRules: [
        mood('Açılıyor', 'success', 'uzgun', flag('kaan_itiraf')),
        mood('Savunmada', 'error', 'kizgin', cmp(v('trust'), '<', 45)),
        mood('Gergin', 'neutral', 'kizgin', cmp(v('tone'), '==', 'hard')),
        mood('Temkinli', 'neutral', 'normal'),
      ],
      objectives: [
        objective(
          'obj_sabah',
          flag('fact_sabah'),
          'Kaan ön odada uyuyordu; polis arka odanın kilidini kesti.',
          'O sabah ne oldu?',
        ),
        objective('obj_oda', flag('fact_arka'), 'Arka oda Barış’ındı; kilidi o taktı.', 'Arka oda kimindi?'),
        objective('obj_baris', flag('fact_baris'), 'Barış: uzun boylu, sakallı, motorlu kurye, İzmirli.', 'Barış kim?'),
        objective(
          'obj_sir',
          flag('kaan_itiraf'),
          'Kaan eylülde Barış’tan kullanmak için iki kez aldı.',
          'Kaan bir şey saklıyor mu?',
        ),
        objective(
          'obj_riza',
          flag('kaan_riza'),
          'Kaan, kullandığını mahkemede kendisi söyleyecek.',
          'Kaan mahkemede ne anlatmak istiyor?',
        ),
      ],
      topics: [
        topic('TP_SABAH', 'O sabah', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_sabah')],
          tones: {
            soft: {
              prompt: 'O sabahı anlatır mısın? Acele etme.',
              says: [
                s(
                  'kaan',
                  'Kulaklıkla uyuyakalmışım. Ön odada, her zamanki gibi. Kitap göğsümde. Kapı vurulunca rüya sandım.',
                ),
                s(
                  'kaan',
                  'Biri “Kaan Yıldız!” diye bağırdı. Adımı kimse o kadar yüksek sesle söylememişti. Mezuniyette bile söylemezler, ben mezun olamadım ki.',
                ),
                s(
                  'kaan',
                  'Arka odanın kapısını sordular. “Barış’ın” dedim. “Ev senin üstüne” dediler. Sonra bir ses geldi: çıt. Kilidi kestiler.',
                  'uzgun',
                ),
                th('Kilidi kestiler. Tutanakta tek kelime yok: ne kilit, ne keski.'),
              ],
            },
            hard: {
              prompt: 'Polis geldiğinde neredeydin, ne yapıyordun? Kısa.',
              says: [
                s('kaan', 'Uyuyordum. Ön odada. Uyumak da mı suç oldu artık?', 'kizgin'),
                s(
                  'kaan',
                  'Arka odayı kestiler, ben izledim. Kelepçeyi taktılar, ben izledim. İzlemekte iyiyim, abla. Bütün hayatımı izledim.',
                  'kizgin',
                ),
                th(
                  'Sertlik bir kapı açtı, başka birini kapattı. Kaan’ın sesinde artık utanç değil, öfke vardı. Öfke daha kolay taşınır.',
                ),
              ],
            },
          },
        }),
        topic('TP_ARKA', 'Arka oda', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_arka')],
          tones: {
            soft: {
              prompt: 'Arka oda kimindi? Ne zamandan beri?',
              says: [
                s(
                  'kaan',
                  'Ağustosta evi tuttum. Arka odada önce Tolga kaldı. İki ay kirayı ödemedi; çıkardım. Eylülün yirmisinde Barış geldi.',
                ),
                s(
                  'kaan',
                  'Kirayı bana elden verirdi, ben Nesrin Teyze’ye yatırırdım. Sözleşme yok. “Sonra yaparız” dedik. Hiç yapmadık. Neyse.',
                ),
                s(
                  'kaan',
                  'İlk hafta kapıya bir asma kilit taktı. “Kurye malzemem var, çanta, cihaz, pahalı şeyler” dedi. Ben de… sormadım.',
                ),
                th('“Sormadım.” Bu dosyanın belki de en ağır iki kelimesi.'),
                s(
                  'kaan',
                  'Gece eve geldiğinde kapısını kilitlerdi, sabah çıkarken yine. Duşa giderken bile. Ben “kurye işte, pahalı cihazlar” dedim kendime. İnsan kendine iyi yalan söyler.',
                ),
              ],
            },
            hard: {
              prompt: 'Sözleşme senin adına, oda senin evinde. Neden başkasının olsun?',
              effects: [raise('fact_anahtarlik')],
              says: [
                s('kaan', 'Çünkü başkasının! Ev benim üstüme diye her odada ben mi yaşıyorum?', 'kizgin'),
                s(
                  'kaan',
                  'Kilidi o taktı. Anahtarı bende yok. Anahtarlığıma bakın, emanette: kapı, bina, posta kutusu. Üç anahtar. Dördüncüsü yok.',
                  'kizgin',
                ),
                th('Üç anahtar. Kilitli bir odanın sahibi, o odanın anahtarını taşır. Emanet tutanağına bakmam lazım.'),
              ],
            },
          },
        }),
        topic('TP_BARIS', 'Barış', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_baris')],
          tones: {
            soft: {
              prompt: 'Barış nasıl biriydi?',
              says: [
                s(
                  'kaan',
                  'Uzun boylu. Sakallı. Sesi kalın. Gece çalışırdı, sabaha karşı gelirdi. Merdivenlerde botlarının sesini duyardım.',
                ),
                s(
                  'kaan',
                  'İyi biriydi. Kombiyi o tamir etti. Bir keresinde annem gelecek diye mutfağı baştan sona o temizledi. İnsan… karar veremiyor bazen.',
                ),
                s('kaan', 'Soyadını sormadım. Telefonda “B.” diye kayıtlı. Bir keresinde “İzmirliyim” dedi. O kadar.'),
                th(
                  'Uzun boylu, sakallı, gece çalışan, İzmirli. Bir hayalet için fazla ayrıntı. Bir yalancı için de fazla az.',
                ),
                s(
                  'kaan',
                  'Baskından sonra aradım onu. Karakoldan değil; telefonumu almışlardı zaten. Ablamın telefonundan. Kapalıydı. Hâlâ kapalı.',
                  'uzgun',
                ),
              ],
            },
            hard: {
              prompt: 'Barış diye biri var mı, Kaan? Gerçekten?',
              says: [
                s('kaan', 'Var! Uydurmuyorum! Polis inanmadı, savcı inanmadı, siz de mi?', 'kizgin'),
                s(
                  'kaan',
                  'Arka odada yatağı vardı, dolabı vardı, botları vardı. Hepsini fotoğrafladılar. Fotoğraflara bakın, sonra bana sorun.',
                  'kizgin',
                ),
                th(
                  'Haklıydı. Önce fotoğraflara bakmalıydım. Önce bul, sonra inan: kendi kuralımı ilk sorumda çiğnedim.',
                ),
              ],
            },
          },
        }),
        topic('TP_KENDI', 'Kendin', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [discover('clue_kaan_olcu')],
          tones: {
            soft: {
              prompt: 'Biraz da senden bahset. Okul, iş, aile.',
              says: [
                s(
                  'kaan',
                  'İktisat. Altıncı yıl. Babam istedi; sonra öldü. Ben de bırakamadım. İkisi de doğru, ikisi de saçma.',
                ),
                s(
                  'kaan',
                  'Kahve Durağı’nda barista. Pazar, çarşamba, cuma kapanış bende; kasayı ben kapatırım. Bir tek orada düzenliyim. Makineler düzen ister.',
                ),
                s(
                  'kaan',
                  'Ayakkabı 41, beden M. Ehliyetim yok. Bisiklete bile binemem; babam öğretecekti, olmadı.',
                  'uzgun',
                ),
                th(
                  '41 numara. Ehliyet yok. Kafede kapanış. Not defterimde üç satır; üçü de ileride bir yere bağlanacak gibi duruyor.',
                ),
                s(
                  'kaan',
                  'Babam terziydi. Dükkânında bir mezura vardı, hep boynunda. Ölünce mezurayı ben aldım. Cezaevine almadılar; “ip sayılır” dediler. Neyse.',
                  'uzgun',
                ),
              ],
            },
            hard: {
              prompt:
                'Sicilin temiz, işin var, okulun var. Savcı soracak: bu kadar düzenli biri neden bu işe bulaşsın?',
              says: [
                s(
                  'kaan',
                  'Düzenli mi? Kredi kartımı ablam ödüyor. Düzenli biri değilim, abla. Satıcılar düzenli olur. Ben dağınığım.',
                  'kizgin',
                ),
                s(
                  'kaan',
                  'Ayakkabımı bile ablam alır. 41. Ehliyetim yok, motorum yok, hiçbir şeyim yok. Bir tek şu eşofman.',
                  'kizgin',
                ),
                th(
                  'Savcının sorusunu sordum ve savcının alamayacağı bir cevap aldım. Ama bedelini Kaan’ın güveniyle ödedim.',
                ),
              ],
            },
          },
        }),
        topic('TP_DEFNE', 'Ablan', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          tones: {
            soft: {
              prompt: 'Ablan seni çok seviyor. Bunu biliyor musun?',
              says: [
                s('kaan', 'Biliyorum. Bu daha kötü. Sevilmek bazen borç gibi. Ödeyemiyorsun, faizi büyüyor.', 'uzgun'),
                s(
                  'kaan',
                  'Babam ölünce o babam oldu. Otuz yaşında bir eczacı, yirmi üç yaşında bir çocuğun babası. Ben de… ben de ona yük oldum.',
                ),
                s(
                  'kaan',
                  'Acilde yüzüne baktım. Kızgın değildi. Korkmuştu. Ablamı ilk defa korkmuş gördüm. O gece bıraktım. O gece.',
                ),
                th(
                  'Kaan bırakmanın tarihini bir maddeyle değil, ablasının yüzüyle hatırlıyor. Bir mahkeme için bu bir ayrıntı. Kaan için bütün hikâye.',
                ),
              ],
            },
            hard: {
              prompt: 'Ablan her şeyi senin yerine yapmış. Sen ne yaptın?',
              effects: [dec('trust', 4)],
              says: [
                s(
                  'kaan',
                  'Ben mi? Kullandım. Borç yaptım. Acile düştüm. Tedaviye başladım. Bir de hapse girdim. Liste uzun. Neyse.',
                  'kizgin',
                ),
                th(
                  'Kendini cezalandırmaya bu kadar hazır biri, başkasının suçunu da üstlenebilir. Bunu unutmamalıyım.',
                ),
              ],
            },
          },
        }),
        topic('TP_PAZAR', '9 Kasım gecesi', {
          visibleWhen: has('clue_tolga_saat'),
          cost: costOf('min', 2),
          score: { SORGULAMA: 30 },
          effects: [raise('fact_pazar')],
          tones: {
            soft: {
              prompt: '9 Kasım, pazar gecesi. Saat 23.00 sularında neredeydin, hatırlıyor musun?',
              says: [
                s(
                  'kaan',
                  'Pazar mı? Pazar kapanış bende. Kahve Durağı. Pazar akşamları maç olur, kafe dolar. Son müşteri on biri geçe falan çıkar.',
                ),
                s(
                  'kaan',
                  'Kasayı ben kapatırım, kodumla. Makineleri temizlerim, yarım saat sürer. Eve yürürüm. On iki gibi evde olurum.',
                ),
                th('Kasa. Kod. Bir makine, bir saat damgası. İnsanlar unutur; kasalar unutmaz.'),
              ],
            },
            hard: {
              prompt: 'Muhbir 9 Kasım 23.00’te kapıda senden aldığını söylüyor. O saatte neredeydin?',
              says: [
                s(
                  'kaan',
                  'Kafedeydim! Pazar kapanış bende, kasayı ben kapatırım! Kasaya sorun, kasa yalan söylemez.',
                  'kizgin',
                ),
                th('Kasaya sormak. Kaan farkında olmadan bir yol gösterdi. Kafenin kayıtlarına ulaşmam lazım.'),
              ],
            },
          },
        }),
        topic('TP_KILIT', 'Kilit', {
          visibleWhen: has('clue_kilit'),
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_kilit_k')],
          tones: {
            soft: {
              prompt: 'Fotoğraflarda kapının önünde kesik bir asma kilit var.',
              says: [
                s(
                  'kaan',
                  'Barış’ın kilidi. Pirinç, büyük bir şey. Anahtarı boynunda, bir iple taşırdı. Duşa bile onunla girerdi herhalde.',
                ),
                s(
                  'kaan',
                  'Ben o odaya hiç girmedim. Bir kere kapı aralıktı, içine baktım. Yatak, dolap, bir mont. O kadar.',
                ),
                th('Bir anahtar bir ipte, bir boyunda. O boyun şimdi neredeyse, anahtar da orada.'),
                s(
                  'kaan',
                  'Kilidi taktığı gün matkabın sesi bütün binayı inletti. Nesrin Teyze aşağıdan bağırdı. Barış ona da kibar davrandı; pasta götürdü özür için.',
                ),
              ],
            },
            hard: {
              prompt: 'O kilidi sen takmış olamaz mısın? Kendi odanı saklamak için?',
              says: [
                s(
                  'kaan',
                  'Anahtarı nerede o zaman? Bütün eşyam emanette. Cebimi, cüzdanımı, çorabımı saydılar. Bulsunlar anahtarı.',
                  'kizgin',
                ),
                th('Emanet tutanağında bir asma kilit anahtarı olsaydı savcı onu iddianameye yazardı. Yazmamış.'),
              ],
            },
          },
        }),
        topic('TP_SEKER', 'Şekerlik', {
          visibleWhen: any(has('clue_sekerlik'), has('clue_kavanoz_iz')),
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_seker_k')],
          tones: {
            soft: {
              prompt: 'Şekerlik. Neredeydi, kim kullanırdı?',
              says: [
                s(
                  'kaan',
                  'Önce mutfaktaydı. Sonra bir gün koridordaki rafa taşınmış. Barış “mutfakta yer açayım” dedi. Rafın yanı onun kapısı.',
                ),
                s(
                  'kaan',
                  'Ben çayımı oradan alırdım. Elim hep kapağındaydı. İçine bakmazdım ki. Şeker şekerdir.',
                  'saskin',
                ),
                th(
                  'Kavanozdaki parmak izi Kaan’ın, çünkü Kaan çay içiyor. Bir parmak izi bir suçu gösterebilir; bir alışkanlığı da.',
                ),
                s(
                  'kaan',
                  'Şekeri bırakmaya çalışıyordum zaten. Doktor “önce bir bağımlılık, sonra öbürü” dedi. Gülmüştüm. Şimdi gülmüyorum.',
                ),
              ],
            },
            hard: {
              prompt: 'Şekerlikte senin parmak izin var. İçindeki paketleri sen koymadın mı?',
              says: [
                s(
                  'kaan',
                  'Kavanozda izim var çünkü günde beş çay içiyorum! Paketlerde izim var mı? Yok. Sorun bakalım neden yok.',
                  'kizgin',
                ),
                s(
                  'kaan',
                  'O raf Barış’ın kapısının dibinde. Şekerliği oraya o taşıdı. Ben sadece şeker aldım.',
                  'kizgin',
                ),
                th('Paketlerde iz yok. Kavanozda var. Savcı bu farkı görmemiş ya da görmek istememiş.'),
              ],
            },
          },
        }),
        topic('TP_MESAJ', 'Mesajlar', {
          visibleWhen: any(has('clue_odaya_girme'), has('clue_iki_tane')),
          cost: costOf('min', 3),
          effects: [ifThen(trustHigh, [raise('kaan_itiraf'), score('SORGULAMA', 50)], [score('SORGULAMA', 10)])],
          tones: {
            soft: {
              prompt:
                'Mesajlarda Barış sana “odaya girme sakın” yazmış. Bir de eylülde senin “iki tane” mesajın var. Bunları konuşmamız lazım.',
              responses: [
                {
                  when: trustHigh,
                  lines: [
                    n('Kaan uzun süre sustu. Eli masanın vidasına gitti, döndü, döndü.'),
                    s(
                      'kaan',
                      'Eylülde… ondan iki kez aldım. Kullanmak için. “İki tane” dediğim o. Kapının önüne bırakırdı, ben parasını odasının kapısının altından atardım.',
                      'uzgun',
                    ),
                    s(
                      'kaan',
                      'Satmadım. Kimseye. Bir gram bile. Ama aldım. Sonra ekimde acil. Sonra tedavi. Ondan sonra bir daha istemedim; o da “bıraktın diye sevindim” yazdı.',
                      'uzgun',
                    ),
                    s(
                      'kaan',
                      '“Odaya girme” dediği gece… bilmiyorum. Hiçbir zaman girmedim zaten. Neden yazdı, şimdi anlıyorum. O zaman anlamadım.',
                    ),
                    s(
                      'kaan',
                      'Bunu mahkemede söylersem annem duyar. Annem bir fotoğrafımı cüzdanında taşıyor. Liseden. Onu da mı kaybedeceğim?',
                      'uzgun',
                    ),
                    th(
                      'Kaan bana ilk kez gerçeği söyledi. Bu gerçek hem onu kurtarabilir hem de onu yaralayabilir. Hangisi olacağına ben karar veremem. O verecek.',
                    ),
                  ],
                },
                {
                  lines: [
                    s('kaan', 'Mesajlar… Barış’ın mesajları. Ben ne bileyim neden öyle yazdığını.', 'kizgin'),
                    s('kaan', '“İki tane” mi? Çay. Simit. Ne bileyim. Neyse. Başka soru.', 'kizgin'),
                    th(
                      'Duvar. Kaan henüz bana o kadar güvenmiyor. Bu konuya bir daha dönmem gerekecek; ama nasıl döndüğüm önemli.',
                    ),
                  ],
                },
              ],
            },
            hard: {
              prompt: '“İki tane” ne demek, Kaan? Savcı bunu sipariş diye okuyor. Doğruyu söyle.',
              responses: [
                {
                  when: trustHigh,
                  lines: [
                    s('kaan', 'Doğruyu mu? Peki. Ondan aldım. İki kez. Kullanmak için. Mutlu musunuz?', 'kizgin'),
                    s(
                      'kaan',
                      'Satmadım ama! Ekimde acile düştüm, tedaviye başladım, bıraktım. Bunu da yazın defterinize.',
                      'kizgin',
                    ),
                    s('kaan', 'Mahkemede bunu söylersem annem duyar. Siz bunu da yazın.', 'uzgun'),
                    th(
                      'Gerçeği aldım. Ama bir sorgu odasındaki gibi aldım. Kaan’ın gözünde artık biraz polis gibiyim.',
                    ),
                  ],
                },
                {
                  lines: [
                    s('kaan', 'Siz de mi savcı gibi konuşacaksınız? Söyleyecek bir şeyim yok.', 'kizgin'),
                    th('Sertlik bu sefer hiçbir şey açmadı. Sadece bir kapıyı daha kilitledi.'),
                  ],
                },
              ],
            },
          },
        }),
        topic('TP_TOLGA', 'Tolga', {
          visibleWhen: any(flag('fact_arka'), visited('INV_TOLGA'), has('clue_kira_defteri')),
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_tolga_kin')],
          tones: {
            soft: {
              prompt: 'Tolga’yı anlat. Arka odanın ilk kiracısı.',
              says: [
                s(
                  'kaan',
                  'Ağustos, eylül. İki ay kirayı ödemedi. Depozitosunu borca saydım, eşyalarını kapının önüne koydum. Kötü bir şey yaptım herhalde. Para yoktu.',
                ),
                s(
                  'kaan',
                  'Kapıda bağırdı. “Sen görürsün” dedi. Anahtarını “kaybettim” dedi. Kilidi değiştiremedim; ona da param yoktu.',
                ),
                s(
                  'kaan',
                  'Ekimde bir kere aşağıda, binanın önünde gördüm onu. Çıkarıldığı evin önünde ne arıyordu, bilmiyorum. Beni görünce yürüyüp gitti.',
                ),
                th(
                  'Kovulan bir kiracı, kaybolan bir anahtar, “sen görürsün” diye bir cümle. Ve aylar sonra Kaan’ın adını veren bir muhbir.',
                ),
                s(
                  'kaan',
                  'Tolga’nın da durumu iyi değildi aslında. O da kullanıyordu. Ben bunu bildiğim için çıkardım onu, kiradan çok. Evde istemedim. İkiyüzlülük, değil mi?',
                  'uzgun',
                ),
                th(
                  'Kendi bağımlılığından kaçan biri, onu evinde başkasında görmeye dayanamaz. Bu bir ikiyüzlülük mü, bir savunma refleksi mi? İkisi de insanca.',
                ),
              ],
            },
            hard: {
              prompt: 'Muhbir Tolga. Seni neden göstersin?',
              says: [
                s('kaan', 'Tolga mı? Muhbir Tolga mı? … Tabii. Tabii o.', 'saskin'),
                s(
                  'kaan',
                  'Onu sokağa ben attım. İki ay kira, bir depozito. Şimdi o beni on beş yıla atıyor. Hesap tutmuyor ama intikam hesap tutmaz.',
                  'kizgin',
                ),
                th('İntikam hesap tutmaz. Ama muhbirlik tutanağı tutar. Ve tutanakta her kelime bir hesap verir.'),
              ],
            },
          },
        }),
        topic('TP_TEDAVI', 'Tedavi', {
          visibleWhen: any(has('clue_randevu'), has('clue_tedavi')),
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [discover('clue_tedavi')],
          tones: {
            soft: {
              prompt: 'Masandaki randevu kartını gördüm. Tedaviden bahsetmek ister misin?',
              says: [
                s('kaan', 'Ekimde acilde uyandım. Ablam başımdaydı. Ağlamıyordu. Ağlamaması daha kötüydü.', 'uzgun'),
                s(
                  'kaan',
                  'Ertesi hafta AMATEM. Her perşembe. Bir doktor, bir psikolog, bir test. Otuz bir ekimde temizdim. Kasımda da temizdim.',
                ),
                s(
                  'kaan',
                  'On dört kasımda randevum vardı. Cezaevindeydim. Kaçırdığım ilk randevu. Doktor “gelmedi” diye yazmıştır. Doğru da yazmıştır.',
                  'uzgun',
                ),
                th(
                  'Bağımlılık bir zayıflık değilse, tedavi de bir bahane değildir. Bunu mahkemeye anlatmanın bir yolunu bulmalıyım.',
                ),
              ],
            },
            hard: {
              prompt: 'Tedaviye mahkemede işine yarasın diye mi başladın?',
              effects: [dec('trust', 5)],
              says: [
                s('kaan', 'Mahkeme yoktu o zaman! Kalbim dakikada yüz altmış atıyordu! Siz… siz de mi?', 'kizgin'),
                th('Haksız bir soruydu. Savcı soracak diye sordum; ama savcı değilim. Kaan bunu unutmayacak.'),
              ],
            },
          },
        }),
      ],
      choices: [
        option(
          'G_RIZA_C',
          'Bunu mahkemede söylemek senin kararın. Söylersen odanın senin olmadığını anlatmak kolaylaşır; ama karar senin.',
          {
            visibleWhen: all(
              flag('kaan_itiraf'),
              not(any(flag('kaan_riza'), { chosen: 'G_RIZA_A' }, { chosen: 'G_RIZA_B' })),
            ),
            score: { SAVUNMA_STRATEJISI: 50 },
            effects: [raise('kaan_riza'), inc('trust', 6)],
            good: 'Müvekkili bilgilendirip kararı ona bıraktın: savunma stratejisi müvekkille birlikte ve onun aydınlatılmış rızasıyla kurulur (Av.K. 34; TBB Meslek Kuralları).',
            responses: [
              {
                lines: [
                  s('kaan', 'Benim kararım mı? Kimse bana bir şey sormamıştı uzun zamandır.', 'saskin'),
                  n('Kaan gözlüğünü çıkardı, bandı düzeltti, geri taktı. Ellerini masanın üstüne, düz koydu.'),
                  s(
                    'kaan',
                    'Söyleyeceğim. Kullandım, satmadım. Annemi ben arayacağım, sizden önce. Ablamdan önce. Bu sefer ben.',
                  ),
                  th('Kaan bir karar verdi. İlk kez bir başkası onun yerine vermedi.'),
                ],
              },
            ],
            next: '$stay',
          },
        ),
        option('G_RIZA_A', 'Düşün. Acele etme; duruşmadan önce yine konuşuruz.', {
          visibleWhen: all(
            flag('kaan_itiraf'),
            not(any(flag('kaan_riza'), { chosen: 'G_RIZA_C' }, { chosen: 'G_RIZA_B' })),
          ),
          neutral: 'Kararı ertelemek meşrudur; ama 1. celsede bu konu açılırsa Kaan hazırlıksız yakalanabilir.',
          responses: [
            {
              lines: [
                s('kaan', 'Düşünürüm. Burada düşünecek çok vakit var. Fazla.'),
                th('Zaman bıraktım. Zaman bazen bir hediyedir, bazen bir yük.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('G_RIZA_B', 'Bunu söylemek zorundasın. Yoksa batarız.', {
          visibleWhen: all(
            flag('kaan_itiraf'),
            not(any(flag('kaan_riza'), { chosen: 'G_RIZA_C' }, { chosen: 'G_RIZA_A' })),
          ),
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('trust', 15)],
          bad: 'Müvekkili kendi aleyhine beyana zorlamak savunma ilişkisine aykırıdır; kimse kendini suçlayan beyana zorlanamaz (Anayasa 38/5, CMK 147/1-e). Karar onundur.',
          responses: [
            {
              lines: [
                s('kaan', 'Zorunda mıyım? Herkes bana ne yapmak zorunda olduğumu söylüyor. Siz de.', 'kizgin'),
                n('Kaan sandalyesini geri itti. Hasan Çakır camın arkasında bir adım attı, sonra durdu.'),
                th('Doğru şeyi yanlış biçimde istedim. Bir müvekkilin sırrı, avukatın silahı değildir.'),
              ],
            },
          ],
          next: '$stay',
        }),
      ],
      finish: { id: 'G_BITIR' },
    }),
  ],
};
