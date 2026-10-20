import {
  L,
  N,
  P,
  any,
  back,
  cmp,
  conversation,
  costOf,
  dec,
  flag,
  has,
  ifThen,
  inc,
  interview,
  mood,
  not,
  objective,
  option,
  raise,
  says,
  set,
  topic,
  v,
  when,
  otherwise,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { INV, T, card, fx } from './shared.js';

// 50-investigation-3: Volkan görüşmesi (konu × ton, fakta bağlı konular) ve tanık ziyaretleri.

const trustOk = cmp(v('trust'), '>=', 50);

export const invPeople: CasePart = {
  nodes: [
    interview('INV_GORUSME', {
      ...INV,
      title: 'Volkan Eren',
      background: 'ev',
      hud: ['min', 'trust'],
      room: { label: 'EV · MUTFAK', character: 'volkan' },
      lines: [
        when(
          cmp({ visits: 'INV_GORUSME' }, '>=', 2),
          card('VOLKAN’IN EVİ — AKŞAM', 'ev'),
          N('Bu sefer kapıyı Volkan açtı. Tıraş olmuştu. Gül mutfakta değil, salondaydı; televizyon sessizde.'),
          L('volkan', 'Yine geldiniz. Bir şey mi buldunuz? Yüzünüzden anlaşılıyor.'),
          T('Yüzümden bir şey anlaşılmasın. Önce o anlatsın.'),
          N(
            'Masada bu sefer katalog yoktu. Bir fincan, bir paket sigara, açılmamış. Volkan paketi elinde çevirdi; Leyla’yı hatırladım.',
          ),
          N(
            'Gül salondan çıktı, kapının eşiğinde durdu. Elinde bir dosya: bebek için hastane evrakı. Yorgun, sekizinci ayın sonunda, ayakta duramayacak kadar ağır.',
          ),
          L(
            'gul',
            'Bugün doktor “her an” dedi. Her an. Ben de “mahkemeden önce olmasın” dedim. Doktor güldü. Ben gülmedim.',
          ),
          L('volkan', 'Gül, otur. Lütfen.'),
          L('gul', 'Oturursam kalkamam. Siz konuşun. Ben buradayım.'),
          T('Bir evin içinde iki saat işliyor: biri bir bebeğin, biri bir duruşmanın. İkisi de geri sayıyor.'),
        ),
        otherwise(
          card('VOLKAN’IN EVİ — ÖĞLEDEN SONRA', 'ev'),
          N(
            'Üçüncü kat, kombi sesi, balkonda kurumayan çamaşırlar. Gül kapıyı açtı, mutfağı gösterdi, çay koydu ve salona geçti. Kapıyı tam kapatmadı.',
          ),
          N(
            'Volkan masanın başında oturuyordu. İri elleri, kısa kesilmiş tırnaklar, parmak boğumlarında iplik yanıkları. Ellerine bakıyordu.',
          ),
          L('volkan', 'Hoş geldiniz avukat hanım. Gül anlattı. Ama ben… ne söyleyeceğimi bilmiyorum.'),
          L(
            'volkan',
            'Hissettim avukat hanım. Tekerleğin altında. Bunu bir hâkime nasıl anlatırsınız? Ben kendime anlatamıyorum.',
          ),
          N(
            'Mutfak masasında bir bebek kataloğu, açık bir sayfada bir beşik. Kenarında Gül’ün el yazısıyla fiyatlar, üstleri çizilmiş, yenileri yazılmış.',
          ),
          T(
            'Leyla haklıydı. Suçluluk duyan insan hatırladığını değil, hak ettiğini düşündüğünü anlatır. Önce hatırladığını çıkarmam gerek.',
          ),
          N(
            'Gül salondan seslendi, kapıyı açmadan: “Çaylar soğumasın. Bir de… kocama ‘yeşil miydi’ diye sormayın. Herkes soruyor. Bir kere de başka bir şey sorun.”',
          ),
          T('Başka bir şey. İyi bir tavsiye. Tanıkları sorgulamak, onlara herkesin sorduğunu sormamaktır.'),
        ),
      ],
      tones: [
        { id: 'soft', label: 'Yumuşak', hint: '+4 güven' },
        { id: 'hard', label: 'Sert', hint: '−8 güven · daha çok ayrıntı' },
      ],
      toneEffects: {
        soft: [inc('trust', 4), set('tone', 'soft')],
        hard: [dec('trust', 8), set('tone', 'hard')],
      },
      moodRules: [
        mood('Kapanmış', 'error', 'uzgun', cmp(v('trust'), '<', 40)),
        mood('Gergin', 'neutral', 'kizgin', cmp(v('tone'), '==', 'hard')),
        mood('Ağır', 'neutral', 'uzgun'),
      ],
      objectives: [
        objective(
          'obj_gece',
          flag('fact_gece'),
          'Vardiya dönüşü, eşiyle eller serbest konuşma, 19 saat uykusuz.',
          'O gece nereden geliyordu, ne durumdaydı?',
        ),
        objective(
          'obj_isik',
          flag('fact_isik'),
          'Işığı yeşil gördüğünden emin; ama herkes kırmızı dediği için kendinden şüphe ediyor.',
          'Işığı ne renk gördü?',
        ),
        objective(
          'obj_carpma',
          flag('fact_carpma'),
          'Koyu bir şekil gördü, frene bastı, sol altta bir tümsek hissetti.',
          'Çarpma anında ne gördü, ne hissetti?',
        ),
        objective(
          'obj_kabul',
          flag('fact_kabul'),
          'Katılanın bakışına dayanamadığı için kabul etmek istiyor.',
          'Neden kabul etmek istiyor?',
        ),
      ],
      topics: [
        topic('TP_GECE', 'O gece', {
          cost: costOf('min', 3),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_gece')],
          discovers: 'clue_yorgun',
          tones: {
            soft: {
              prompt: 'O geceyi baştan anlatır mısınız? Fabrikadan çıktığınız andan.',
              says: [
                L(
                  'volkan',
                  'Vardiya on birde bitiyordu. Makine durdu, ustabaşı gelmedi, kaldım. On iki kırkta çıktım.',
                ),
                L(
                  'volkan',
                  'Sabah dokuzda Gül’le doktordaydık. Kızın kalbini dinlettiler. Sonra akşam vardiya. Uyumadım. On dokuz saat.',
                ),
                L(
                  'volkan',
                  'Gül aradı. Arabanın ekranından açtım. Konuştuk. Tartıştık biraz. Kira, doktor… Sonra “kapat, geliyorum” dedim.',
                ),
                L('volkan', 'Kapattım. Yol boştu. Yağmur vardı ama sağanak değil. Radyoyu açmadım; kafam doluydu.'),
              ],
            },
            hard: {
              prompt: 'Saat saat anlatın. Kaçta uyandınız, kaçta çıktınız, kaç saattir ayaktaydınız?',
              says: [
                L(
                  'volkan',
                  'Sabah yedide kalktım. Doktor dokuzda. İkide eve geldim, yatamadım. Üçte vardiya. On iki kırkta çıktım.',
                  'kizgin',
                ),
                L(
                  'volkan',
                  'On dokuz saat. Biliyorum ne demek istediğinizi. Yorgundum. Gözlerim yanıyordu. Bunu da söyleyin hâkime, söyleyin.',
                  'kizgin',
                ),
                T('Yorgunluğu ondan önce savcı bulacaktı. En azından ben de biliyorum.'),
              ],
            },
          },
        }),
        topic('TP_ISIK', 'Işık', {
          cost: costOf('min', 3),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_isik')],
          tones: {
            soft: {
              prompt: 'Kavşağa yaklaşırken ışık ne renkti?',
              responses: [
                when(
                  trustOk,
                  L(
                    'volkan',
                    'Yeşildi. İki yüz metreden yeşil gördüm. Yaklaştım, hâlâ yeşildi. Yavaşlamadım; yeşilde neden yavaşlayayım?',
                  ),
                  L(
                    'volkan',
                    'Ama taksici kırmızı diyor. Bilirkişi kırmızı diyor. Herkes kırmızı diyor. Bir noktadan sonra insan kendi gözüne inanmıyor.',
                  ),
                  L(
                    'volkan',
                    'Belki göz kırptım. Belki yorgunluktan… Bilmiyorum avukat hanım. Yeşildi. Yeşil olmalıydı.',
                  ),
                  T(
                    '“Yeşil olmalıydı.” Bir insan kendi gözüne bu kadar az inanınca, onun yerine inanacak bir kâğıt bulmam gerek.',
                  ),
                ),
                otherwise(
                  L('volkan', 'Yeşil… dedim ya. Polise de dedim. Kimse inanmadı.'),
                  L('volkan', 'Ne fark eder? Kadın öldü.', 'uzgun'),
                ),
              ],
            },
            hard: {
              prompt: 'Emin misiniz? Tanık ve bilirkişi kırmızı diyor. Yanılıyor olabilir misiniz?',
              says: [
                L('volkan', 'Yanılıyor olabilirim! Bunu her gece kendime soruyorum!', 'kizgin'),
                L(
                  'volkan',
                  'Yeşil gördüm. Ama yeşil gördüğümü hatırlamak ile yeşil olması aynı şey mi? Siz söyleyin, siz avukatsınız.',
                  'kizgin',
                ),
              ],
            },
          },
        }),
        topic('TP_TELEFON', 'Telefon', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_ekran')],
          tones: {
            soft: {
              prompt: 'Telefonla nasıl konuşuyordunuz?',
              says: [
                L(
                  'volkan',
                  'Arabanın kendi ekranından. Bluetooth. Telefon bardaklıktaydı, hiç elime almadım. Araba yeni, Gül ısrar etti, “bebek gelecek, güvenli olsun” dedi.',
                ),
                L('volkan', 'Kapatırken ekrana dokundum. Kırmızı tuşa. Bir saniye. Belki iki.'),
                T(
                  'Bir saniye. Ya da iki. Savcı bunu “dikkati dağıldı” diye okuyacak. Bunun bir de makinedeki kaydı olmalı.',
                ),
              ],
            },
            hard: {
              prompt: 'Ekrana baktınız mı? Bakmadınız mı? Net olun.',
              says: [
                L('volkan', 'Baktım. Kapatmak için. Bir saniye. Sonra yola baktım, yol boştu, yeşildi.', 'kizgin'),
                L('volkan', 'O bir saniyeyi her gece yeniden yaşıyorum. Belki o bir saniye olmasaydı…', 'uzgun'),
              ],
            },
          },
        }),
        topic('TP_CARPMA', 'Çarpma anı', {
          cost: costOf('min', 3),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_carpma')],
          tones: {
            soft: {
              prompt: 'Çarptığınız anı anlatabilir misiniz? Ne gördünüz?',
              responses: [
                when(
                  trustOk,
                  L('volkan', 'Koyu bir şey. Farların ucunda. Bir poşet sandım önce. Alçaktı… bilmiyorum.'),
                  L('volkan', 'Frene bastım. Pedal titredi, o titreme hep olur. Sonra sol önde… bir tümsek. Yumuşak.'),
                  L(
                    'volkan',
                    'Hissettim. İşte bunu hissettim. Sonra durdum. Montumu örttüm. Yüzü yağmurdaydı. Gözleri açıktı.',
                    'uzgun',
                  ),
                  N('Sustu. Gül salonda televizyonun sesini açtı; bir yarışma programı, alkışlar. Sonra kıstı.'),
                ),
                otherwise(
                  L('volkan', 'Çarptım işte. Hissettim. Başka ne anlatayım?', 'uzgun'),
                  N('Ellerini masanın altına çekti.'),
                ),
              ],
            },
            hard: {
              prompt: 'Kadını ne zaman gördünüz? Ayakta mıydı, yürüyor muydu, koşuyor muydu?',
              says: [
                L(
                  'volkan',
                  'Bilmiyorum! Görmedim! Bir gölge gördüm! Yürümüyordu, koşmuyordu. Alçaktı. Yerdeydi belki, eğilmişti belki!',
                  'kizgin',
                ),
                L(
                  'volkan',
                  'Ben bunu polise de söyleyemedim. Söylesem “kendini kurtarmaya çalışıyor” derler diye.',
                  'uzgun',
                ),
                T('“Alçaktı.” Sonra üstünde duracağım. Şimdi değil.'),
              ],
            },
          },
        }),
        topic('TP_GUL', 'Gül ve bebek', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 10 },
          effects: [raise('fact_gul')],
          tones: {
            soft: {
              prompt: 'Gül Hanım nasıl? Bu süreç ikinizi nasıl etkiliyor?',
              says: [
                L(
                  'volkan',
                  'Gül benden güçlü. Her şeyi klasöre koyuyor. Ben koyamıyorum. Benim klasörüm bir tane: o gece.',
                ),
                fx(L('gul', 'Duyuyorum, biliyorsun değil mi? Kapı açık.'), 'shake'),
                L(
                  'volkan',
                  'Biliyorum. … Gül o gece telefonda kendini suçluyor. “Ben uzattım” diyor. Kimse kimseyi suçlamasın istiyorum.',
                ),
                T(
                  'Bu evde iki insan aynı geceden iki ayrı suç çıkarıyor. Biri direksiyondan, biri telefondan. Ben üçüncü bir şey arıyorum: olanı.',
                ),
              ],
            },
            hard: {
              prompt: 'Telefondaki tartışma sizi ne kadar dağıttı?',
              says: [
                L(
                  'volkan',
                  'Dağıttı mı? Dağıttı. Kira, doktor, para. Bir adam gece yarısı başka ne düşünür?',
                  'kizgin',
                ),
                L('gul', 'Yeter. Onu suçlamayın, beni suçlayın. Ben aradım.', 'kizgin'),
                N('Gül mutfağın kapısında duruyordu, elinde bir bardak, ağlamıyordu.'),
              ],
            },
          },
        }),
        topic('TP_KABUL', 'Kabul etmek', {
          cost: costOf('min', 2),
          score: { SAVUNMA_STRATEJISI: 20 },
          effects: [raise('fact_kabul')],
          tones: {
            soft: {
              prompt: 'Gül Hanım kabul etmek istediğinizi söyledi. Neden?',
              says: [
                L(
                  'volkan',
                  'Kadının oğlu her celse bana bakıyor. Hiçbir şey söylemiyor, sadece bakıyor. Ben de bakıyorum. Bir şey ödemem lazım avukat hanım.',
                ),
                P('Ödemek için önce borcun ne olduğunu bilmek gerekir. Şu an bilmiyoruz.'),
                L('volkan', '…Bilmiyoruz.'),
              ],
            },
            hard: {
              prompt: 'Kabul ederseniz bir daha geri dönüşü yok. Bunu biliyor musunuz?',
              says: [
                L(
                  'volkan',
                  'Biliyorum. İstediğim de bu belki. Geri dönüşü olmayan bir şey. Onun için de yok.',
                  'uzgun',
                ),
                T('Kendini cezalandırmak isteyen bir müvekkili savunmak, iki kişiye karşı savunma yapmaktır.'),
              ],
            },
          },
        }),
        topic('TP_HATICE', 'Hatice Hanım', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 10 },
          effects: [raise('fact_hatice')],
          tones: {
            soft: {
              prompt: 'Hatice Hanım’ın ailesiyle hiç karşılaştınız mı?',
              says: [
                L(
                  'volkan',
                  'Cenazeye gittim. İçeri girmedim. Caminin avlusunda, ağacın arkasında durdum. Oğlunu gördüm. Tabutu omuzladı. Ağlamadı.',
                ),
                L(
                  'volkan',
                  'Kimse beni tanımadı. Bir kadın “siz de mi hastaneden?” dedi. “Evet” dedim. İlk yalanım. Sonra gittim.',
                  'uzgun',
                ),
                T(
                  'İlk yalanı bir cenazede, bir yabancıya söylemiş. Kendini oraya ait hissetmediği için. Ya da fazla ait hissettiği için.',
                ),
              ],
            },
            hard: {
              prompt: 'Katılanla temas etmeye çalıştınız mı? Bu dosyaya zarar verebilir.',
              says: [
                L('volkan', 'Temas mı? Cenazeye gittim, uzaktan baktım. Konuşmadım. Konuşsam ne diyecektim?', 'kizgin'),
                L('volkan', '“Özür dilerim” mi? Bir annenin karşılığı bir özür mü?', 'uzgun'),
              ],
            },
          },
        }),
        topic('TP_ONUNDE', 'Önünüzde bir şey var mıydı?', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 40 },
          visibleWhen: any(has('clue_fren'), has('clue_cam'), has('clue_tek_stop')),
          tones: {
            soft: {
              prompt: 'Kavşağa girmeden önce, önünüzde, ileride bir şey gördünüz mü? Bir araç, bir ışık?',
              effects: [ifThen(trustOk, [raise('fact_tek_lamba')])],
              responses: [
                when(
                  trustOk,
                  N('Volkan uzun süre sustu. Çayının kaşığını çevirdi. Sonra, sanki bir sırrı bırakır gibi:'),
                  L(
                    'volkan',
                    'Bir kırmızı vardı. Uzakta. Tek bir kırmızı lamba. Uzaklaşıyordu. Bir araba stopu gibi ama tek.',
                  ),
                  L(
                    'volkan',
                    'Kimseye söylemedim. Kafamın uydurduğunu sandım. Kendimi kurtarmak için uyduruyorum sandım.',
                  ),
                  T('Tek bir kırmızı lamba. Bu davanın adı da bu. Yeter ki bu bir hatıra olsun, bir umut değil.'),
                ),
                otherwise(
                  L('volkan', 'Hayır. Bilmiyorum. Bir şey hatırlamıyorum.'),
                  T('Bir şey var. Ama bana henüz söylemiyor.'),
                ),
              ],
            },
            hard: {
              prompt: 'Düşünün. Önünüzde başka bir araç vardı, değil mi?',
              effects: [raise('fact_tek_lamba'), raise('onunde_telkin')],
              quality: {
                q: 'BAD',
                feedback:
                  'Cevabı soruya koymak: müvekkilin hatırasını yönlendirmek, sonra kürsüde çöken bir “hatıra” üretir.',
                category: 'SORGULAMA',
              },
              says: [
                L('volkan', 'Vardı… vardı galiba. Bir kırmızı lamba. Siz öyle deyince… vardı.', 'saskin'),
                T(
                  'Cevabı ben verdim, o tekrar etti. Bu bir hatıra mı, benim cümlem mi? Artık ikimiz de bilemeyeceğiz.',
                ),
              ],
            },
          },
        }),
        topic('TP_DARBE', 'Darbenin yeri', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 30 },
          visibleWhen: has('clue_kirik56'),
          effects: [raise('fact_darbe')],
          tones: {
            soft: {
              prompt: 'Darbe arabanın neresine geldi? Ön cama, kaputa, tampona?',
              says: [
                L(
                  'volkan',
                  'Önden değil. Cam bile çatlamadı. Kaput düz. Sol alttan bir şey… tekerleğin önü, tamponun altı.',
                ),
                L(
                  'volkan',
                  'Hep düşündüm: bir insana çarpsam ön cam kırılmaz mı? Filmlerde kırılıyor. Benimki kırılmadı.',
                ),
              ],
            },
            hard: {
              prompt: 'Ön cam neden sağlam? Bir yetişkine çarptınız ve ön cam sağlam mı?',
              says: [
                L('volkan', 'Bilmiyorum! Sağlam. Bir çizik yok. Sol alttan, tekerleğin önünden.', 'kizgin'),
                L('volkan', 'Bunu bir anlamı var mı? Söyleyin, bir anlamı var mı?', 'saskin'),
              ],
            },
          },
        }),
        topic('TP_ABS', 'Pedal titredi mi?', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          visibleWhen: has('clue_abs'),
          effects: [raise('fact_abs')],
          tones: {
            soft: {
              prompt: 'Frene bastığınızda pedal nasıl tepki verdi?',
              says: [
                L('volkan', 'Titredi. Tık tık tık. Bu araba hep öyle yapar ıslakta. Kayma olmadı. Lastik bağırmadı.'),
                T('Lastik bağırmadı. Kilitlenen tekerlek bağırır; ABS tıkırdar.'),
              ],
            },
            hard: {
              prompt: 'Lastikler kaydı mı, kilitlendi mi? Net olun.',
              says: [
                L('volkan', 'Kaymadı. Kilitlenmedi. Pedal tıkırdadı. Bunu herkes bilir, ABS’li araba böyle.', 'kizgin'),
              ],
            },
          },
        }),
      ],
      finish: { id: 'G_BITIR' },
    }),

    // --- Taksici ---
    conversation('INV_T_NEC', {
      ...INV,
      title: 'Necati Bulut',
      background: 'sokak_gece',
      onFirstEnter: [{ type: 'MEET', character: 'necati' }],
      room: { label: 'TAKSİ DURAĞI', character: 'necati' },
      lines: says(
        card('ÇINARLI TAKSİ DURAĞI — 23.10', 'sokak_gece'),
        N(
          'Durağın kulübesinde bir soba, bir tavla, duvarda bir takım bayrağı. Necati Bulut termosundan kahve koyuyordu. Bana da koydu, sormadan.',
        ),
        L(
          'necati',
          'Avukatı mısın? Sanığın? Hm. Otur bakalım. Kırk yıllık şoförüm ben, di mi, her şeyi gördüm bu yollarda.',
        ),
        L(
          'necati',
          'O gece de gördüm. Kırmızıda daldı. Kadıncağız… Allah rahmet eylesin. Benim de annem öyle gitti, bir otobüs. Bilirim ben o acıyı.',
        ),
        P('Başınız sağ olsun. Ben sadece o geceyi sizin gözünüzden anlamak istiyorum.'),
        L(
          'necati',
          'Anlayacak ne var? Kırmızıydı. Ama sor bakalım, sor. Hiçbir avukat bana bir şey sormadı daha. Polis bile üç soru sordu.',
        ),
        T('Yalancı değil. Önemli olmayı seviyor. İnsanlar önemli olduklarında, gördüklerinden fazlasını hatırlar.'),
        N(
          'Duvarda, takım bayrağının yanında, çerçeveli bir gazete kupürü: “Taksici yolda bulduğu çantayı sahibine teslim etti.” Fotoğrafta genç bir Necati, aynı kasket.',
        ),
        L(
          'necati',
          'O benim. Doksan üç. Çantada dolar vardı, bir tomar. Bir kuruşuna dokunmadım. Gazeteye çıktım. O gün bugündür doğruyu söylerim.',
        ),
      ),
      choices: [
        option('NQ_YER', '“O gece tam olarak nerede bekliyordunuz?”', {
          discovers: 'clue_necati_yer',
          score: { SORGULAMA: 30 },
          responses: says(
            L(
              'necati',
              'Çınarlı’dan çıkıyordum. Işıkta ilk sıradaydım. Kırmızıdaydım, di mi, bekliyordum. Kuralcı adamım ben.',
            ),
            L('necati', 'Önümde ışık, sağımda Gökdere. Yağmur. Radyoda maç tekrarı.'),
            T('Çınarlı’dan çıkış. Kavşağa dik. Kendi kırmızısında.'),
            L(
              'necati',
              'Her gece o ışıkta beklerim. Uzun bir ışıktır o, iki dakika. Termosu açarım, bir yudum, radyoyu kısarım. Sonra yeşil yanar, giderim.',
            ),
          ),
        }),
        option('NQ_GORDUN', '“Çarpmayı nasıl gördünüz? Baştan, sırasıyla anlatın.”', {
          score: { SORGULAMA: 40 },
          effects: [raise('fact_gumburtu')],
          good: 'Açık uçlu, yönlendirmesiz soru: tanığın kendi sırasıyla anlatması çelişkiyi kendiliğinden doğurur.',
          responses: says(
            L(
              'necati',
              'Sırasıyla… Radyoyu kısmıştım. Bir gümbürtü oldu. Kafamı kaldırdım. Beyaz araba kadının orada duruyordu. Kadın yerde.',
            ),
            L('necati', 'Sonra adam indi. Ben de indim. Bağırdım. Işık kırmızıydı, di mi, kırmızıda daldı bu.'),
            P('Gümbürtüyü duyduğunuzda başınız neredeydi?'),
            L('necati', 'Ne bileyim, radyodaydı. Ama sonra baktım işte. Kırk yıl… gözüm keskindir.', 'saskin'),
            T(
              'Önce ses, sonra baş. Çarpmayı görmemiş; çarpmanın sonrasını görmüş. Kolluk ifadesinde “çarptığını gördüm” yazıyor.',
            ),
            L(
              'necati',
              'Bak avukat hanım, ben kötü adam değilim. O çocuk da kötü değil, belli. Ama kadın öldü. Biri suçlu olmalı, di mi? Biri.',
            ),
            T('“Biri suçlu olmalı.” Bu dosyanın bütün yükü bu üç kelimede. Herkes birini arıyor; en yakındaki Volkan.'),
          ),
        }),
        option('NQ_ARAC', '“Siz ışıkta beklerken Gökdere’den başka araç geçti mi?”', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_minibus')],
          responses: says(
            L(
              'necati',
              'Yoktu. Boştu yol. … Bir şey geçti mi? Bir minibüs mü ne, bir kamyonet. Ama o çok önceydi. Ne bileyim, çok önce.',
            ),
            L(
              'necati',
              'Minibüsler hep hızlı gider bu saatte, ekmek dağıtırlar, gazete dağıtırlar. Kimse bakmaz onlara.',
            ),
            T('“Çok önce.” Gümbürtüden önce başını kaldırmadıysa, “çok önce”yi neyle ölçüyor?'),
            L(
              'necati',
              'Ekmekçiler, gazeteciler, pazarcılar. Gecenin bir yarısı yolu onlar doldurur. Biz taksiciler onlara “gece kuşları” deriz. Hızlı, dikkatsiz.',
            ),
          ),
        }),
        option('NQ_TEL', '“Sürücünün telefonla konuştuğunu nasıl gördünüz?”', {
          score: { SORGULAMA: 20 },
          effects: [raise('fact_kafa')],
          responses: says(
            L(
              'necati',
              'Kafası aşağıdaydı. Herkes telefona bakıyor bu devirde. Gençler hele. Ben bakmam, kırk yıldır.',
            ),
            P('Kafasının aşağıda olduğunu, araba hareket hâlindeyken mi gördünüz?'),
            L('necati', 'Yok… durunca. Arabadan inerken. Ama belliydi işte. Telefoncuydu.', 'saskin'),
          ),
        }),
        option(
          'NQ_TELKIN',
          '“Belki ışığı yanlış görmüşsünüzdür. Mahkemede biraz daha temkinli olsanız herkes için iyi olur.”',
          {
            score: { USUL_BILGISI: -40 },
            effects: [inc('ethics', 1), raise('necati_kizgin')],
            bad: 'Tanığa ne söyleyeceğini telkin etmek: tanığı etkilemeye teşebbüs ve meslek kurallarına aykırılık (TCK 277; Av.K. md. 34).',
            category: 'USUL_BILGISI',
            responses: says(
              L('necati', 'Ne demek temkinli? Beni mi yalancı çıkaracaksın?', 'kizgin'),
              fx(
                L('necati', 'Kalk git! Mahkemede de söylerim, avukatı beni ayarlamaya geldi diye!', 'kizgin'),
                'shake',
              ),
              T('Yanlış kapıya yanlış anahtar. Hem de en kötüsü: tanık artık benden nefret ediyor ve haklı.'),
            ),
            next: 'INV_T_NEC_OUT',
          },
        ),
        back('NQ_BITIR', 'Teşekkür et ve çık'),
      ],
    }),
    conversation('INV_T_NEC_OUT', {
      ...INV,
      title: 'Durak',
      background: 'sokak_gece',
      room: { label: 'TAKSİ DURAĞI', character: 'necati' },
      lines: says(N('Necati kulübenin kapısını açık tuttu. Soğuk içeri doldu. Başka bir soru soramazdım.')),
      choices: [back('NQ_OUT', 'Çık')],
    }),

    // --- Serkan ---
    conversation('INV_T_SER', {
      ...INV,
      title: 'Serkan Durmaz',
      background: 'ev',
      onFirstEnter: [{ type: 'MEET', character: 'serkan' }],
      room: { label: 'KAPI ARALIĞI', character: 'serkan' },
      lines: says(
        card('YILDIRIM, BİR APARTMAN KAPISI — 19.00', 'ev'),
        N('Kapı zincirle aralandı. İçeriden kızarmış soğan ve sigara kokusu. Bir televizyonda haber bülteni.'),
        L('serkan', 'Sanığın avukatı. Hm. Ne istiyorsunuz? Annem öldü, katili serbest, siz de kapıma geldiniz.'),
        L(
          'serkan',
          'Siz avukatlar ne yapıyorsunuz biliyor musunuz? Ölüye bir daha ölüm veriyorsunuz. Dosyada. Kâğıtta.',
        ),
        T('Haklı olmadığı tek bir cümle bulamıyorum. Bu yüzden ilk cümlem önemli.'),
        N(
          'Kapının iç yüzünde, zincirin hemen yanında, bantla yapıştırılmış bir vesikalık: hastane kimlik kartından kesilmiş, kenarları düzensiz.',
        ),
      ),
      choices: [
        option('SQ_SAYGI', '“Başınız sağ olsun. Anneniz hakkında dinlemeye geldim.”', {
          score: { SORGULAMA: 20 },
          effects: [raise('serkan_saygi')],
          visibleWhen: not(flag('serkan_kirgin')),
          good: 'Katılanla görüşmede ölçü: talep yok, telkin yok, saygı var.',
          responses: says(
            N('Zincir bir süre takılı kaldı. Sonra çözüldü. Kapı açılmadı ama aralık büyüdü.'),
            L(
              'serkan',
              'Annem. Hatice. Hastanede temizlikçiydi. Otuz yıl. Gece vardiyası, gündüz vardiyası, bayram vardiyası.',
            ),
            L(
              'serkan',
              'Eve hep yürüyerek gelirdi. Otobüs parası biriktirirdi. Benim inşaat ayakkabılarımı o aldı, ilk işime girdiğimde.',
            ),
          ),
        }),
        option('SQ_ANNE', '“Anneniz o kavşaktan nasıl geçerdi?”', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_anne')],
          visibleWhen: flag('serkan_saygi'),
          responses: says(
            L(
              'serkan',
              'Yeşilde. Hep yeşilde. Gece üçte bile, araba yokken bile beklerdi. Beni de öyle büyüttü: “Işık senin için yanar, sen onun için değil.”',
            ),
            L(
              'serkan',
              'Eve gelince çayı demlerdi, beni beklerdi. Ben gece mesaisinden döndüğümde sofrada çay olurdu, iki simit. Üç aydır kimse çay demlemiyor.',
            ),
            L('serkan', 'Otuz yıl o yoldan geçti. Kırmızıda bir kere bile geçmedi. Bunu mahkemede söyleyeceğim.'),
            L(
              'serkan',
              'Bir keresinde, ben on yaşındayken, kırmızıda karşıya koştum. Beni kolumdan tutup geri çekti, bir hafta konuşmadı benimle. Bir hafta.',
            ),
            T('Ben de söyletmek isterim. Çünkü o gece yaya ışığı yeşilse, birinin daha yeşili vardı.'),
          ),
        }),
        option('SQ_GECE', '“O gece sizinle konuştu mu?”', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_mesaj')],
          visibleWhen: flag('serkan_saygi'),
          responses: says(
            L('serkan', 'Aradı. Açamadım. Şantiyedeydim, gece mesaisi. Mesaj bırakmış. Sesli.', 'uzgun'),
            L(
              'serkan',
              'Dinleyemedim. Üç aydır duruyor telefonda. Açsam sesi gelecek. Kapatsam bir daha gelmeyecek.',
              'uzgun',
            ),
            T('Bir mesaj. Bir ölünün sesi. Bunu ondan isteyemem. Ama bir gün kendisi dinlerse…'),
            L('serkan', 'Siz gidin artık. Ama… geldiğiniz için. Bilmiyorum. Gidin.'),
          ),
        }),
        option('SQ_SIKAYET', '“Şikâyetinizden vazgeçerseniz dava düşer. Bunu bir düşünür müsünüz?”', {
          score: { HUKUKI_BILGI: -40 },
          effects: [raise('serkan_kirgin')],
          visibleWhen: not(flag('serkan_saygi')),
          bad: 'Taksirle öldürme şikâyete bağlı değildir; kovuşturma re’sen sürer. Katılanın vazgeçmesi davayı düşürmez; teklif yalnızca kırar.',
          category: 'HUKUKI_BILGI',
          responses: says(
            L('serkan', 'Şikâyet mi? Annem bir şikâyet mi? Bir dilekçe mi?', 'kizgin'),
            fx(L('serkan', 'Bir daha bu kapıya gelmeyin.', 'kizgin'), 'shake'),
          ),
          next: 'INV_T_SER_OUT',
        }),
        option('SQ_PARA', '“Müvekkilim manevi olarak bir şey yapmak istiyor. Mahkemedeki beyanınız yumuşarsa…”', {
          score: { USUL_BILGISI: -60 },
          effects: [raise('serkan_kirgin'), inc('ethics', 1)],
          visibleWhen: not(flag('serkan_saygi')),
          bad: 'Beyanı değiştirmesi karşılığında maddi teklif: tanığı ve katılanı etkileme (TCK 277), meslek onuruna aykırılık (Av.K. md. 34). Tazminat ayrı bir hukuki yoldur.',
          category: 'USUL_BILGISI',
          responses: says(
            L('serkan', 'Annemi satın mı alıyorsunuz?', 'kizgin'),
            fx(
              N('Kapı yüzüme çarptı. Zincirin şıkırtısı merdiven boşluğunda iki kat aşağı kadar yankılandı.'),
              'shake',
            ),
            T('Bu cümleyi kurduğum için utanmam gerek. Utanıyorum.'),
          ),
          next: 'INV_T_SER_OUT',
        }),
        back('SQ_BITIR', 'Teşekkür et ve git'),
      ],
    }),
    conversation('INV_T_SER_OUT', {
      ...INV,
      title: 'Merdiven boşluğu',
      background: 'ev',
      room: { label: 'MERDİVEN', character: 'serkan' },
      lines: says(N('Kapalı bir kapı. Merdivende otomatik lamba söndü. Karanlıkta düğmeyi aradım.')),
      choices: [back('SQ_OUT', 'Çık')],
    }),

    // --- Hamdi ---
    conversation('INV_T_HAM', {
      ...INV,
      title: 'Hamdi Kocabaş',
      background: 'depo',
      onFirstEnter: [{ type: 'MEET', character: 'hamdi' }],
      room: { label: 'BELEDİYE SİNYAL DEPOSU', character: 'hamdi' },
      lines: says(
        card('BÜYÜKŞEHİR BELEDİYESİ · SİNYALİZASYON DEPOSU', 'depo'),
        N(
          'Raflarda sökülmüş trafik lambaları, kırmızı, sarı, yeşil camlar üst üste. Bir köşede lehim kokusu. Hamdi Kocabaş elindeki tornavidayı bırakmadı.',
        ),
        L('hamdi', 'Avukat ha. Abla, ben teknisyenim. Ben vida sıkarım, kart takarım. Mahkeme işi benim işim değil.'),
        L('hamdi', 'Müdür bey “kimseyle konuşmayın” dedi. Ben de konuşmuyorum. Çay içersen içeriz, o kadar.'),
        T('Korkuyor. İki yıl sonra emekli. Korkan adama korkutarak gidilmez.'),
        N(
          'Masasının camının altında bir fotoğraf: baretli genç bir Hamdi, yeni dikilmiş bir trafik lambasının dibinde. Altında tarih: 1994. Gökdere’nin ilk lambası.',
        ),
        L(
          'hamdi',
          'O lambayı ben diktim abla. Gökdere’nin ilk lambası. O zaman köydü burası. Şimdi her köşede bir lamba, her lambanın bir derdi var.',
        ),
      ),
      choices: [
        option('HQ_KABIN', '“Kabindeki 15 Kasım etiketi sizin mi? H.K.”', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_kart')],
          visibleWhen: has('clue_kabin'),
          responses: says(
            L('hamdi', 'H.K. benim. Hamdi Kocabaş. Kart değiştirdim. Sabah gittim, taktım, döndüm.'),
            P('Kazadan bir gün sonra.'),
            L('hamdi', 'Bir gün sonra. Malzeme o gün geldi. Ben malzeme gelince takarım, abla. Gelmeyince takamam.'),
            T('“Malzeme o gün geldi.” Yani daha önce isteniyordu.'),
            L(
              'hamdi',
              'Bakın abla, ben makineyi severim. Makine yalan söylemez. İnsanlar söyler. Makineye “sus” derler, susar. Ama kaydı tutar.',
            ),
          ),
        }),
        option('HQ_ARIZA', '“O gece kavşakta bir arıza var mıydı?”', {
          score: { SORGULAMA: 10 },
          responses: says(
            L('hamdi', 'Ben ne bileyim abla, gece benim değil. Makine kayıt tutar. Kayda bakın.'),
            L(
              'hamdi',
              'Yazıyla isteyin. Yazıyla isterseniz ben de yazıyla veririm. Benim imzam olmaz, kurumun imzası olur.',
            ),
          ),
        }),
        option('HQ_ISEMRI', '“Kazadan önce o kavşak için açılmış bir iş emri var mıydı?”', {
          discovers: 'clue_is_emri',
          score: { SORGULAMA: 40 },
          visibleWhen: any(flag('fact_kart'), has('ev_sinyal_log')),
          responses: says(
            N(
              'Hamdi tornavidayı ilk kez bıraktı. Masanın çekmecesinden bir defter çıkardı, sayfaları parmağıyla saydı.',
            ),
            L(
              'hamdi',
              '9’unda akşam Beyaz Masa’ya ihbar gelmiş. 10’unda sabah bana düştü. İş emri dört bin dört yüz yetmiş bir. Çatışma kartı.',
            ),
            L('hamdi', 'Gittim baktım. Kart yorgun. Yenisini istedim. “Malzeme yok, bekleyecek” dediler. Bekledi.'),
            L('hamdi', 'Ben söyledim. Yazdım. Kimse okumadı.', 'uzgun'),
          ),
        }),
        option(
          'HQ_FOTOKOPI',
          '“Kayıtların bir kopyasını şimdi bana verin; mahkemeye ben sunarım, sizin adınız hiç geçmez.”',
          {
            score: { USUL_BILGISI: -30 },
            effects: [raise('hamdi_kizgin')],
            bad: 'Kayıt dışı belge almak, delilin kaynağını ve kullanılabilirliğini tartışmalı kılar; yol dilekçe ve mahkeme müzekkeresidir (CMK 177).',
            category: 'USUL_BILGISI',
            responses: says(
              L(
                'hamdi',
                'Kimse bilmez mi? Herkes bilir abla. Burada duvarların kulağı var, müdürün iki kulağı var.',
                'kizgin',
              ),
              L('hamdi', 'Yazıyla. Ben yazıdan başka bir şey vermem. Gidin artık.', 'kizgin'),
            ),
          },
        ),
        option('HQ_TANIK', '“Mahkeme sizi tanık olarak çağırabilir. Gördüğünüzü anlatmanız yeter; fazlası değil.”', {
          score: { SORGULAMA: 20 },
          effects: [raise('hamdi_bilgi')],
          visibleWhen: not(flag('hamdi_kizgin')),
          responses: says(
            L('hamdi', 'Gördüğümü. Hm. Ben bir kart gördüm abla. Yorgun bir kart.'),
            L(
              'hamdi',
              'Çağırırlarsa gelirim. Yalan söylemem. Ama gönüllü de gelmem. Müdürüm bilsin, beni mahkeme çağırdı.',
            ),
          ),
        }),
        back('HQ_BITIR', 'Teşekkür et ve çık'),
      ],
    }),

    // --- Sevim ---
    conversation('INV_T_SEV', {
      ...INV,
      title: 'Sevim Akgül',
      background: 'kafe',
      onFirstEnter: [{ type: 'MEET', character: 'sevim' }],
      room: { label: 'KÖŞEDEKİ BÜFE', character: 'sevim' },
      lines: says(
        card('GÖKDERE KÖŞESİ · 24 SAAT BÜFE', 'kafe'),
        N(
          'Gazeteler, sakızlar, sigara rafı, bir semaver. Tezgâhın arkasında, örgü örerken televizyon izleyen bir kadın. Beni görünce örgüyü bırakmadı.',
        ),
        L('sevim', 'Buyur kuzum. Çay? Taze demledim. Sen o avukatsın, değil mi? Mahalle konuşuyor.'),
        L(
          'sevim',
          'Hatice’yi tanırdım. Her gece buradan geçerdi, bir simit alırdı, bazen iki. “Oğlana” derdi. Oğlan yemezdi, biliyorum ama.',
        ),
        T('Burada herkes herkesi tanıyor. Kamera hariç; o kimseyi tanımıyor, sadece kaydediyor.'),
        L(
          'sevim',
          'Sabahları ilk o geçerdi, akşamları son o. Bu kavşakta otuz yıl. Benden eski. Ben yirmi yıldır buradayım.',
        ),
      ),
      choices: [
        option('VQ_KAYIT', '“Tentenin altındaki kamera kayıt yapıyor mu?”', {
          score: { SORGULAMA: 20 },
          effects: [raise('fact_kayit')],
          responses: says(
            L(
              'sevim',
              'Yapıyor kuzum. Oğlum taktı, hırsız girdi diye. Otuz gün tutuyormuş, sonra siliyormuş kendi kendine.',
            ),
            L('sevim', 'Ama o geceyi ben ayırdım. Oğluma dedim, “bunu sakla, biri sorar”. Kimse sormadı. Polis bile.'),
            L('sevim', 'Saati ileridir haa. Hep ileri. Ayarlamayı bilmiyorum. Yaz saati kış saati, kafam karışıyor.'),
          ),
        }),
        option(
          'VQ_TESLIM',
          '“Kaydı gönüllü olarak verir misiniz? Tutanakla teslim alayım; savcılığa ve mahkemeye sunulacak.”',
          {
            discovers: 'ev_bufe',
            effects: [ifThen(flag('fact_kayit'), [{ type: 'SCORE', category: 'ARASTIRMA', amount: 20 }])],
            score: { ARASTIRMA: 60 },
            good: 'Kaydı sahibinin rızasıyla, teslim tutanağıyla almak; zinciri koruyan ve sonradan tartışılmayacak bir yol.',
            category: 'ARASTIRMA',
            responses: says(
              L('sevim', 'Veririm tabii. Bir USB’ye attı oğlum. Al. Ama bir imza at, oğlum kızar yoksa.'),
              N(
                'Bir okul defterinden koparılmış sayfaya iki satırlık bir tutanak yazdık. Sevim imzaladı, ben imzaladım. Örgü şişini kalem gibi tuttu.',
              ),
              L('sevim', 'Hatice için. Bir şey çıkarsa… Hatice için çıksın.'),
              T(
                'Bir okul defterinin sayfası, iki imza, bir USB. Delil zincirinin ilk halkası bazen bir örgü şişiyle yazılır.',
              ),
            ),
          },
        ),
        option('VQ_GECE', '“O gece bir şey duydunuz mu?”', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_iki_ses')],
          responses: says(
            L(
              'sevim',
              'Tezgâhtaydım, örgü örüyordum. Bir fren sesi… sonra bir gümbürtü. Sonra bir fren daha. Ya da yankı. Bu kavşak yankı yapar.',
            ),
            L(
              'sevim',
              'Kafamı kaldırdığımda beyaz araba duruyordu. Adam iniyordu. Sonra taksici bağırdı. Ben 112’yi aradım ama zaten aranmış.',
            ),
            T('Bir fren, bir gümbürtü, bir fren daha. Ya da yankı. Kavşaklar yankı yapar; tanıklar da.'),
          ),
        }),
        option('VQ_IZLE', '“Kaydı burada birlikte izleyelim; kopya almaya gerek yok.”', {
          neutral: 'İzlemek bir şey gösterir ama dosyaya hiçbir şey koymaz. Delil, dosyaya girdiğinde delildir.',
          responses: says(
            N('Küçük ekranda siyah beyaz, kumlu görüntü. Yağmur damlaları lensin üstünde. Farlar, gölgeler.'),
            T('Göz bir şey görüyor gibi. Ama bunu mahkemeye “ben gördüm” diye anlatamam.'),
          ),
        }),
        back('VQ_BITIR', 'Çayın parasını bırak ve çık'),
      ],
    }),

    // --- Hastane ---
    conversation('INV_T_HAS', {
      ...INV,
      title: 'Fadime Öztürk',
      background: 'hastane',
      onFirstEnter: [{ type: 'MEET', character: 'fadime' }],
      room: { label: 'DEVLET HASTANESİ · KAT 3 · TEMİZLİK ODASI', character: 'fadime' },
      lines: says(
        card('DEVLET HASTANESİ — KAT 3, TEMİZLİK ODASI', 'hastane'),
        N(
          'Paspas kovaları, deterjan bidonları, duvarda bir vardiya çizelgesi. Bir köşede küçük bir masa, masada bir çaydanlık ve çerçevesiz bir fotoğraf: önlüklü altı kadın, bir doğum günü pastası.',
        ),
        L('fadime', 'Sanığın avukatı mısınız? Hm. Oturun. Burada herkes oturur, kimse sormaz kimin nesi olduğunu.'),
        L(
          'fadime',
          'Hatice yirmi yıl benim ekibimdeydi. Pastadaki o. Ellisinde. Mum üflerken gözlerini kapatmış, ne diledi bilmiyoruz.',
        ),

        T('Ölülerin kim olduğunu dosyalar söylemez. Temizlik odaları söyler.'),
        L('fadime', 'Çay koyayım. Hatice çaysız konuşmazdı. Biz de onun usulüyle devam ediyoruz.'),
      ),
      choices: [
        option('FQ_GECE', '“O gece Hatice Hanım kaçta çıktı?”', {
          score: { SORGULAMA: 20 },
          effects: [raise('fact_rota')],
          responses: says(
            L(
              'fadime',
              'Yarımda kartını bastı. Kırkta kapıdan çıktı; simitçiye uğradı, oğluna simit aldı. Oğlu yemez ama alırdı.',
            ),
            L(
              'fadime',
              'O gece son konuştuğum bendim. “Fadime, yarın ben erken gelirim, sen yat” dedi. Erken gelecekti. Gelmedi.',
            ),
            L(
              'fadime',
              'Hep Gökdere’den yürürdü. Kırk dakika. Otobüs parasını biriktirirdi; torun için diyordu, daha torun yok.',
            ),
          ),
        }),
        option('FQ_ISIK', '“O kavşaktan hiç şikâyet ettiğini duydunuz mu?”', {
          score: { SORGULAMA: 40 },
          effects: [raise('fact_hastane_isik')],
          responses: says(
            L(
              'fadime',
              'Etti ya! Geçen hafta çay içerken. “O ışıklar delirdi” dedi. “Yeşil yanıyor, ben geçiyorum, bir araba da geçiyor, az kalsın.”',
            ),
            L(
              'fadime',
              '“Belediyeye söyleyin” dedik. “Söylemişler zaten” dedi. “Biri söylemiş, gazetede yazdı.” Ne gazetesi bilmiyorum.',
            ),
            T('“Geçen hafta.” Kazadan önce. Bir temizlikçinin çay sohbeti bir iş emrinden önce gelmiş olabilir.'),
          ),
        }),
        option('FQ_SUCLU', '“Sizce Hatice Hanım o gece dikkatsiz miydi? Belki yorgundu, belki kırmızıda geçti.”', {
          score: { SORGULAMA: -40 },
          effects: [raise('fadime_kirgin')],
          bad: 'Maktulü kusurlu göstermeye yönelik yönlendirici soru: hem delil değeri yok hem tanığı kapatır. Yaya ışığının durumu kayıtlarla gösterilir, ölünün itibarıyla değil.',
          category: 'SORGULAMA',
          responses: says(
            L('fadime', 'Hatice mi? Kırmızıda mı? Siz kalkın gidin hanım. Siz bizim Hatice’yi bilmezsiniz.', 'kizgin'),
            N('Kovayı yerden aldı, kapıyı gösterdi.'),
          ),
          next: 'INV_T_HAS_OUT',
        }),
        option('FQ_SERKAN', '“Oğlu nasıl?”', {
          score: { SORGULAMA: 10 },
          visibleWhen: not(flag('fadime_kirgin')),
          responses: says(
            L(
              'fadime',
              'Serkan mı? Kaskatı. Cenazede ağlamadı. Annesinin telefonunu cebinde taşıyor, kendi telefonu ayrı. İki telefon.',
            ),
            L(
              'fadime',
              'Kızgın. Kime kızacağını bilse rahatlayacak. Şimdi herkese kızıyor; size de, bize de, kendine de.',
            ),
          ),
        }),
        back('FQ_BITIR', 'Çayı bitir ve teşekkür et'),
      ],
    }),
    conversation('INV_T_HAS_OUT', {
      ...INV,
      title: 'Koridor',
      background: 'hastane',
      room: { label: 'KAT 3 · KORİDOR', character: 'fadime' },
      lines: says(
        N('Kapı arkamdan kapandı. Koridorda ıslak zemin uyarı levhası. Üstünde “Dikkat, kaygan zemin.” Haklıydı.'),
      ),
      choices: [back('FQ_OUT', 'Çık')],
    }),

    // --- Ayten ---
    conversation('INV_T_AYT', {
      ...INV,
      title: 'Pol. Mem. Ayten Yurt',
      background: 'karakol',
      onFirstEnter: [{ type: 'MEET', character: 'ayten' }],
      room: { label: 'TRAFİK ŞUBE · KORİDOR', character: 'ayten' },
      lines: says(
        card('TRAFİK DENETLEME ŞUBE — KORİDOR', 'karakol'),
        N(
          'Floresan, linolyum, bir su sebili. Ayten Yurt üniformasının kollarını düzeltti, saatine baktı. Beş dakikası vardı, bunu da söyledi.',
        ),
        L('ayten', 'Avukat hanım. Tutanak ortada. Ne yazdıysam o. Fazlasını söyleyemem, eksiğini de.'),
        T(
          'Bir polisin “fazlasını söyleyemem” demesi, fazlası olduğunu söylemesidir. Ama onu zorlayamam. Tanıklar zorla değil, zamanla konuşur.',
        ),
      ),
      choices: [
        option('AQ_CAM', '“Geçidin ilerisindeki cam kırıkları neden emanete alınmadı?”', {
          score: { SORGULAMA: 40 },
          effects: [raise('fact_emanet_yok')],
          visibleWhen: has('clue_cam'),
          responses: says(
            L('ayten', 'Tutanağa yazdım. Fotoğrafını çektim.'),
            L('ayten', 'Gece iki buçukta, yağmurun altında, bir el feneriyle. Kırk iki fotoğraf. Hepsini ben çektim.'),
            N('Bir süre sustu. Sebilden bir bardak su doldurdu, içmedi.'),
            L(
              'ayten',
              'Ekip amirim eski bir kazanın kalıntısı olabileceğini söyledi. Tek araçlı bir kaza diye kayda geçti. Karar onun.',
            ),
            T('“Karar onun.” Kendi kararı olsaydı farklı olacağını söylemiyor; ama söylemiyor da değil.'),
          ),
        }),
        option('AQ_IZ', '“Fren izinin hangi araca ait olduğunu tespit ettiniz mi?”', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_iz_belirsiz')],
          responses: says(
            L('ayten', 'Hayır. İz ölçüldü, fotoğraflandı. Hangi araca ait olduğu tutanakta yazmaz; ben yazmadım.'),
            L(
              'ayten',
              'Bir izi bir araca bağlamak için izin bittiği yere bakarsınız. İz sağ şeritte başlıyor, sağ şeritte bitiyor. Volkan Bey’in aracı sol şeritte durmuştu.',
            ),
            T('İz sağda, araç solda. Bunu bir polis söylüyor; tutanağına yazmamış, ama söylüyor.'),
            L('ayten', 'Bilirkişi o izi araca bağlamış. Onu ben bağlamadım.'),
          ),
        }),
        option('AQ_AMIR', '“Amirinizin o gece delili emanete almamasını, hatasını mahkemede açıkça anlatır mısınız?”', {
          score: { SORGULAMA: -20 },
          effects: [raise('ayten_kapali')],
          bad: 'Tanığı amirine karşı konumlandırmak onu kapatır; tanıktan beklenen gözlemidir, başkalarını suçlaması değil.',
          category: 'SORGULAMA',
          responses: says(
            L(
              'ayten',
              'Ben tutanağımın arkasındayım avukat hanım. Başka birinin hatası benim konum değil. İyi günler.',
              'kizgin',
            ),
          ),
          next: 'INV_T_AYT_OUT',
        }),
        option('AQ_TANIK', '“Mahkeme sizi dinlemek isterse, tutanağınızı anlatmanız yeter.”', {
          score: { SORGULAMA: 20 },
          effects: [raise('ayten_bilgi')],
          visibleWhen: not(flag('ayten_kapali')),
          responses: says(
            L('ayten', 'Çağrılırsam gelirim. Tutanağı anlatırım. Bu benim işim.'),
            L('ayten', 'Bir şey daha… Hayır. Önemli değil. İyi günler.'),
            T('“Önemli değil” diyen biri, önemli bir şeyi tartıyordur.'),
          ),
        }),
        back('AQ_BITIR', 'Teşekkür et ve çık'),
      ],
    }),
    conversation('INV_T_AYT_OUT', {
      ...INV,
      title: 'Koridor',
      background: 'karakol',
      room: { label: 'TRAFİK ŞUBE · KORİDOR', character: 'ayten' },
      lines: says(
        N('Ayten koridorun sonundaki kapıdan girdi ve kapıyı kapattı. Sebilin içinde bir hava kabarcığı yükseldi.'),
      ),
      choices: [back('AQ_OUT', 'Çık')],
    }),
  ],
};
