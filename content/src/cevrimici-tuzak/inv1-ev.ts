import {
  all,
  any,
  back,
  choiceNode,
  cmp,
  conversation,
  costOf,
  dec,
  discover,
  fallback,
  flag,
  has,
  inc,
  interview,
  mark,
  mood,
  not,
  objective,
  option,
  raise,
  sceneSearch,
  set,
  story,
  topic,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, S, minus } from './dsl.js';
import { INV1 } from './shared.js';

// 51-inv1-ev: Ece ile görüşme (konu × ton; ekran görüntüleri ve Burak konuları başka yerde bulunan bilgilerle açılır),
// sarı notla yüzleşme ve tavsiye kararı, Ece'nin odası (sahne), Sevim'in atölyesi, operatör mağazası.

const trustOk = cmp(v('trust'), '>=', 40);

export const inv1Ev: CasePart = {
  nodes: [
    interview('INV1_ECE', {
      ...INV1,
      title: 'Ece ile görüşme',
      background: 'ev',
      hud: ['min', 'trust'],
      room: { label: 'YALINLARIN SALONU · YILDIRIM', character: 'ece' },
      lines: [
        {
          when: cmp({ visits: 'INV1_ECE' }, '==', 1),
          lines: S`
            = YALINLARIN SALONU · 09.20 @ev
            - Dantel örtülü bir sehpa, üstünde iki çay bardağı. Duvarda Ece'nin mezuniyet fotoğrafı; kepini havaya atmış, gülerken gözleri kapalı.
            - Sevim Hanım'ın atölyeden öğle arasına dönmesine on altı dakika vardı. Ece annesinin yanında konuşmak istemiyordu; bunu söylemedi, ama saate bakışından belliydi.
            ece: Nereden başlayayım? Ben… baştan anlatırsam her şey çok aptalca görünecek. Ortadan anlatırsam da yalan söylüyormuşum gibi.
            - Çayını iki eliyle tuttu. Tırnaklarına baktım: koyu bordo bir oje, sol başparmakta köşeden kırık. Bir yıldır yenilenmemiş gibi değil; her gün aynı yerden kırılıyormuş gibi.
            > Baştan anlat. Aptalca görünmesi umurumda değil. Eksik görünmesi umurumda.
          `,
        },
        {
          lines: S`
            - Ece aynı koltukta, aynı yerde oturuyordu. Arada çayı tazelemiş, ama içmemişti.
            ece: Yine mi? Tamam. Annemin dönmesine sekiz dakika var. Sorun.
          `,
        },
      ],
      tones: [
        { id: 'soft', label: 'Yumuşak', hint: '+4 güven' },
        { id: 'hard', label: 'Sert', hint: '−8 güven · daha fazla ayrıntı' },
      ],
      toneEffects: {
        soft: [inc('trust', 4), set('tone', 'soft')],
        hard: [dec('trust', 8), set('tone', 'hard')],
      },
      moodRules: [
        mood('Çözülüyor', 'success', 'uzgun', flag('fact_kod_itiraf')),
        mood('Kapanmış', 'error', 'kizgin', cmp(v('trust'), '<', 40)),
        mood('Gergin', 'neutral', 'kizgin', cmp(v('tone'), '==', 'hard')),
        mood('Utangaç', 'neutral', 'normal'),
      ],
      objectives: [
        objective('obj_nova', flag('fact_nova'), 'İşveren: “Nova Dijital”, Kaan Bey. Adres bir iş merkezi.', 'Ece kim için çalıştığını sanıyordu?'),
        objective('obj_para', flag('fact_avans'), '4.500 TL: “eğitim avansı”.', '4.500 lira neyin parasıydı?'),
        objective('obj_tel', flag('fact_simyok'), 'Telefon 4 Kasım sabahı sustu; akşam operatöre gitti.', '4 Kasım’da telefonuna ne oldu?'),
        objective('obj_kod', flag('fact_kod_itiraf'), 'Ece kodu “SGK kodu” sanıp okudu.', 'Ece bir şey saklıyor mu?'),
      ],
      topics: [
        topic('TP_ILAN', 'İş ilanı', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_nova'), discover('clue_ding_ece')],
          tones: {
            soft: {
              prompt: 'O işi nasıl buldun? En başından anlat.',
              says: S`
                ece: Bir iş sitesinde. "Uzaktan Müşteri Temsilcisi. Esnek saat. Deneyim aranmaz." Yüz kırk üçüncü başvurumdu. Yarım saat sonra aradılar.
                ece/mutlu: Kaan Bey. Nova Dijital'in İK'sı. Çok kibardı. "Ece Hanım" diyordu. Kimse bana sekiz aydır "hanım" dememişti.
                ece: Sesini hâlâ hatırlıyorum. Yumuşak, ağır. "Ece Hanım, sizin gibi gençlere bu ülkenin ihtiyacı var" dedi. Biliyorum, şimdi söyleyince klişe. O gün klişe değildi.
                ece: Görüntülü mülakat yaptık. Onun kamerası bozukmuş; ben görünüyordum, o görünmüyordu. "İş merkezindeyiz, kusura bakmayın, gürültülü" dedi.
                ece: Konuşurken arkadan bir sinyal geldi, sonra bir kadın sesi: "Dördüncü kat." Asansör herhalde. Gülmüştü; "bizim binanın sesi" demişti.
                ece: Bir de uzaktan bir yazıcı sesi vardı, bir de telefon zili. Gerçek bir ofis gibiydi. O yüzden hiç şüphelenmedim. Gerçek bir ofis gibiydi.
                ~ Kamerası olmayan bir işveren. Arkasında bir asansör. Kendi yüzünü saklayan, adayın yüzünü kaydeden biri.
              `,
            },
            hard: {
              prompt: 'Sana bir iş teklif ediyorlar, kimliğini istiyorlar, sen de veriyorsun. Neden?',
              says: S`
                ece/kizgin: Çünkü herkes istiyor! SGK girişi için kimlik lazım, maaş için IBAN lazım. Bunu her şirket ister. Ben aptal değilim!
                ece: Adı Kaan'dı. Nova Dijital. Kamerası bozuktu, ben görünüyordum. Arkadan "Dördüncü kat" diye bir anons geldi, iş merkezindeydi.
                ece/uzgun: Kimliğimin önünü arkasını çektim, bir de elimde kimlikle özçekim. "Kimlik doğrulama" dedi. Lambanın altında çektim, parlıyordu, iki kere çektim.
                ~ İki kere. Lambanın altında. Bir fotoğrafın parlaması bazen parmak izinden iyi tanıktır.
              `,
            },
          },
        }),
        topic('TP_PARA', '4.500 lira', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_avans')],
          tones: {
            soft: {
              prompt: '1 Kasım’da hesabına 4.500 lira gelmiş. Neydi o?',
              says: S`
                ece: Eğitim avansı. Kaan Bey "ilk hafta eğitim var, bu da yol ve internet parası" dedi. Açıklamada da öyle yazıyordu, bakabilirsiniz.
                ece/uzgun: Bin beşini anneme verdim. Faturalar. Geri kalanıyla bir kulaklık aldım; müşteri temsilcisi olacağım ya.
                ece: Kaan Bey "ilk maaş ayın on beşinde" dedi. On beşini bekledim. On beşi gelmeden banka hesabımı dondurdu. Maaş değil, bir yazı geldi: “Hesabınız tedbirli.”
                ~ Savcı bunun adını "kira bedeli" koymuş. Bir kulaklık. Kira bedeli diye bir kulaklık.
              `,
            },
            hard: {
              prompt: 'Savcı o parayı hesabını kiralamanın bedeli sayıyor. Biri sana hesabın için para verdi mi?',
              says: S`
                ece/kizgin: Kimse bana hesabım için para vermedi! Avans dedi, avans! Bir yerden ilk kez para geldi, ben ona sevindim!
                ece: Gönderen birinin adı vardı, Mehmet bir şey. "Muhasebemiz" dedi Kaan Bey. Ben muhasebeyi tanımam ki.
                ~ Avansı kim gönderdi? Muhasebe değilse, kim? Bir ismin peşine düşmek yerine, o hesabın başka nereye uğradığına bakmalıyım.
              `,
            },
          },
        }),
        topic('TP_TELEFON', 'Telefonun sustuğu gün', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_simyok'), raise('fact_operator')],
          tones: {
            soft: {
              prompt: '4 Kasım sabahı telefonuna ne oldu?',
              says: S`
                ece: Sabah onu on geçe "SIM yok" yazdı. Kapattım, açtım. Ekran görüntüsü aldım; her şeyin ekran görüntüsünü alırım, huyum.
                ece: Annemin telefonundan Kaan Bey'i aradım, on biri beş geçe. "Hattınızı kurumsal tarifeye taşıyoruz, akşama düzelir" dedi. Rahatladım. Rahatladım!
                ece: Telefonu açtı, hemen açtı. Sanki bekliyormuş gibi. Sesi yine yumuşaktı. "Merak etmeyin Ece Hanım, sistem göçü. Bu işte her şey bir göç."
                ece/uzgun: Akşam düzelmedi. Yedi gibi kendi operatörümün mağazasına gittim. "Hattınız bu sabah başka bir bayide yeni karta geçirilmiş" dediler.
                ece: Bir kâğıt imzaladım, "işlemi ben yapmadım" diye. Yeni kart verdiler. Sonra eve gelip ağladım. Polise gitmedim. Korktum.
                ece: Mağazadaki kız bana su verdi. "Sizden önce bugün biri daha geldi" dedi, "aynı şey." Aynı şey. Ben o zaman bunun ne demek olduğunu anlamadım.
                ~ Aynı gün akşam, kendi ayağıyla operatöre gidip itiraz etmiş biri. Bir dolandırıcı bunu yapar mı? Belki. Ama kâğıdı mağazada duruyor olmalı.
              `,
            },
            hard: {
              prompt: 'Telefonun kapalıydı, hesabından para çıkıyordu. Tesadüf mü?',
              says: S`
                ece/kizgin: Kapalı değildi, SIM yoktu! Onu on üçte! Ekran görüntüsü var! Ben kapatmadım, kendisi gitti!
                ece: Annemin telefonundan Kaan Bey'i aradım. "Kurumsal hatta geçiyoruz" dedi. Bir gece önce de yazmıştı zaten, "yarın hattınız kesilebilir" diye.
                ece/uzgun: Akşam operatöre gittim. Başka bir bayide yeni kart çıkarılmış. Ben çıkarmadım. Bir kâğıt imzaladım. O kâğıt nerede, bilmiyorum.
                ~ "Yarın hattınız kesilebilir." Kesintiyi bir gün önceden bilen biri. Ya kâhin, ya da kesen.
              `,
            },
          },
        }),
        topic('TP_KOD', 'Kod', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_kod_inkar')],
          tones: {
            soft: {
              prompt: 'Bankadan bir kod geldi mi hiç? Birine okudun mu?',
              says: S`
                ece: Hayır. Yani… bankamın kodunu kimseye vermem. Bunu herkes bilir. Reklamlarda bile söylüyorlar.
                - Ece çay bardağını iki eliyle tuttu. Bardak boştu.
                ece: Hem… neden bir şirkete banka kodu vereyim ki? SGK'ya bir şey verdim, o kadar. Yani… kimlik, IBAN. Kod değil.
                ~ Cevap hızlı geldi. Fazla hızlı. Ezberlenmiş bir cümle gibi; bir yıl önce bir ifade odasında ilk kez söylenmiş, o günden beri tekrarlanmış.
              `,
            },
            hard: {
              prompt: 'Banka yeni bir cihazın SMS koduyla tanımlandığını söyleyecek. O kod sana geldi. Kime okudun?',
              says: S`
                ece/kizgin: Kimseye! Kimseye okumadım! Siz de mi? Polis de böyle sordu, savcı da yazmış! Ben aptal değilim!
                - Sesi kırıldı. Kalktı, pencereye gitti, sırtını döndü.
                ece/uzgun: Bankamın kodunu kimseye vermedim. Tamam mı? Vermedim.
                ~ "Bankamın kodunu." Soru bu değildi. Bir kod verdiyse, onu bankanın kodu sanmıyordu belki. İnsan bazen doğruyu, yalanın içine saklar.
              `,
            },
          },
        }),
        topic('TP_ANNE', 'Annen', {
          cost: costOf('min', 2),
          score: { SORGULAMA: 10 },
          effects: [raise('fact_anne')],
          tones: {
            soft: {
              prompt: 'Annen bütün bunları nasıl karşılıyor?',
              says: S`
                ece/uzgun: Gece vardiyasına kaldı. Benim yüzümden. Bana bir şey demiyor; o daha kötü. Makinenin başında saatlerce oturuyor, sesini duyuyorum.
                ece: Bir akşam dikerken parmağına iğne batırdı. Kanadı. "Bir şey yok" dedi. Ben odama gidip ağladım. Yirmi üç yaşındayım, annemin parmağına bakamıyorum.
                ~ Bu dosyada iki kadın var, ikisi de birbirini korumaya çalışıyor. Biri susarak, öbürü dikerek.
              `,
            },
            hard: {
              prompt: 'Annen her şeyi biliyor mu? Ona her şeyi anlattın mı?',
              says: S`
                ece/kizgin: Anneme her şeyi anlatacak hâlim yok! O zaten benim yüzümden gece vardiyasında!
                ece/uzgun: Her şeyi bilmiyor. Bilmesin de. Bazı şeyleri bilmesi onu daha çok yorar.
                ~ "Bazı şeyler." Bu evde bir şey saklanıyor; anneden de, avukattan da.
              `,
            },
          },
        }),
        topic('TP_EKRAN', 'Ekran görüntüleri', {
          visibleWhen: has('clue_tablo'),
          cost: costOf('min', 2),
          score: { ARASTIRMA: 40 },
          effects: [discover('clue_sgk_mesaj'), discover('clue_kvkk_mesaj'), discover('clue_hr_no'), raise('fact_ekran')],
          tones: {
            soft: {
              prompt: 'Tablonda bir sütun var: “Ekran görüntüsü klasörü”. Nova’nın klasörü duruyor mu?',
              says: S`
                - Ece bir an donakaldı. Sonra telefonunu açtı, uzun uzun kaydırdı.
                ece: Kaan Bey "KVKK gereği yazışmaları silin" demişti. Sildim. Ama silmeden önce… her şeyin görüntüsünü alırım. Huyum. Annem kızar.
                ece: Bakın. Profilde numarası var. Burada maaş günü, burada "kimlik doğrulama". Burası da… 3 Kasım.
                ece: Burada da kimliğimin fotoğrafı. Lambanın altında çektim, iki kere; ilkinde parladı. Bakın, köşede başparmağım. Ojem kırık, utandım, yine de gönderdim.
                - Ekranı bana çevirdi, sonra bir an geri çekti. Sonra yine çevirdi. 14.26: "SGK işe giriş için size bir kod gelecek, beni arayıp okur musunuz?"
                ~ Kod. "Kimseyle kod paylaşmadım" diyen bir kızın telefonunda, kod isteyen bir mesaj. Ve akşam 21.10'da: "Yarın hattınız kesilebilir."
              `,
            },
            hard: {
              prompt: 'Yazışmaları sildin, değil mi? Kanıtları ortadan kaldırdın.',
              says: S`
                ece/kizgin: Kaldırmadım! O sil dedi! KVKK dedi! Ama ben… ekran görüntüsü aldım. Hepsinin. Al, bak, ne istiyorsan bak!
                - Telefonu neredeyse fırlatır gibi uzattı. 14.26: "SGK işe giriş için size bir kod gelecek, beni arayıp okur musunuz?" 21.10: "Yarın hattınız kesilebilir."
                ece/uzgun: Şimdi bana yalancı diyeceksiniz.
                ~ Demeyeceğim. Ama birinin bu ekran görüntülerini yan yana koyması lazım. Önce benim.
              `,
            },
          },
        }),
        topic('TP_BURAK', 'Burak', {
          visibleWhen: flag('fact_burak'),
          cost: costOf('min', 2),
          score: { SORGULAMA: 20 },
          effects: [raise('fact_burak_ece')],
          tones: {
            soft: {
              prompt: 'Annen Burak’tan şüpheleniyor. Sen ne düşünüyorsun?',
              says: S`
                ece/uzgun: Annem herkesten şüphelenir; Burak'tan biraz daha fazla. Ayrıldık, evet. Kızgındı. "Pişman olacaksın" yazdı. Ben de ona daha kötülerini yazdım.
                ece: Şifremi biliyordu. Ama telefonum benim elimdeydi o gün. SIM gitti, telefon gitmedi. Burak telefoncu; bir şey yapsa telefona yapardı.
                ece: Bir de… o gece mesaj attığında ben de ona bir şey yazdım. Çok kötü bir şey. Ben de pişman oldum. "Pişman olacaksın" diyen haklı çıktı; ama başka sebepten.
                ~ Bir tamircinin bildiğini sanmak kolay. Bir tamircinin bildiğini sormak daha yararlı.
              `,
            },
            hard: {
              prompt: 'Burak senin şifreni biliyordu ve sana kızgındı. Onu koruyor musun?',
              says: S`
                ece/kizgin: Korumuyorum! Ama suçlamıyorum da. Ben bir yıldır suçlanıyorum, ne demek olduğunu biliyorum.
                ece: Burak öyle şeyler yapmaz. Kötü bir sevgiliydi, kötü bir insan değil. Gidip sorun. Alt sokakta dükkânı var.
              `,
            },
          },
        }),
      ],
      choices: [
        option('G_YUZLES', 'Sarı notu ve 14.26 mesajını yan yana koy', {
          prompt: 'Ece. “4471 — SGK.” Ve 14.26’daki mesaj. Bana anlatmak istediğin bir şey var mı?',
          visibleWhen: all(any(has('ev_not'), has('clue_sgk_mesaj')), flag('fact_kod_inkar'), trustOk),
          cost: costOf('min', 3),
          score: { SORGULAMA: 150 },
          effects: [
            raise('fact_kod_itiraf'),
            inc('trust', 6),
            mark('GOOD', 'Saklanan bilgi açığa çıktı: Ece kodu “SGK kodu” sanarak telefonda okumuş.', 'SORGULAMA'),
          ],
          responses: B(S`
            - Ece uzun süre bir şey söylemedi. Saat duvarda tıkırdadı; dikiş makinesinin olmadığı bir sessizlikti bu.
            ece/uzgun: Okudum. Telefonda. Dört, dört, yedi, bir. SGK dedi. Ben de SGK sandım. Mesajın gerisini okumadım; "kodunuz" yazıyordu, gerisi kaydı.
            ece/uzgun: Sonra "Ailemize hoş geldiniz" dedi. Sekiz aydır ilk kez biri bana hoş geldin dedi. Nota bir gülen yüz çizdim.
            ece: Polise söyleyemedim. Söylesem, "kodu verdin, o hâlde sen de onlardansın" diyeceklerdi. Aptal görünmektense yalancı olmak daha kolay geldi.
            ~ Bir yıldır taşıdığı şey bu. Bir yalan değil; bir utanç. Ama mahkeme için ikisinin farkı, ne zaman söylendiğindedir.
          `),
          next: 'INV1_ECE_TAVSIYE',
        }),
        option('G_YUZLES_X', 'Sarı notu ve 14.26 mesajını yan yana koy', {
          prompt: 'Ece. “4471 — SGK.” Ve 14.26’daki mesaj. Bana anlatmak istediğin bir şey var mı?',
          visibleWhen: all(any(has('ev_not'), has('clue_sgk_mesaj')), flag('fact_kod_inkar'), not(trustOk)),
          cost: costOf('min', 3),
          effects: [
            dec('trust', 4),
            mark('BAD', 'Güveni düşük müvekkil sakladığını açmaz; önce güven kur, sonra yüzleştir.', 'SORGULAMA'),
          ],
          responses: B(S`
            ece/kizgin: Odamı mı karıştırdınız? Siz de mi bana inanmıyorsunuz? Herkes gibi?
            - Kalktı. Mutfağa gitti; musluğu açtı, kapamadı.
            ~ Kapıyı çok sert çaldım. Bazı kapılar ancak içeriden açılır.
          `),
        }),
      ],
      finish: { id: 'G_BITIR' },
    }),
    choiceNode('INV1_ECE_TAVSIYE', {
      ...INV1,
      title: 'Ne yapacağız?',
      background: 'ev',
      prompt: {
        speaker: 'ece',
        expression: 'uzgun',
        text: 'Şimdi ne olacak? Mahkemede bunu söylersem… Siz ne derseniz onu yapacağım.',
      },
      choices: [
        option('TAV_A', 'Doğruyu anlatmanı öneririm. Notu ve mesajı biz sunarız; neyi okuduğunu bilmediğini sen anlatırsın.', {
          score: { SAVUNMA_STRATEJISI: 100 },
          effects: [raise('ece_durust'), inc('trust', 4)],
          good: 'Avukat müvekkile yalan söyletmez; aldatılarak verilen kod kast göstermez (TCK 21/1). Doğrunun erken ve belgeyle anlatılması inkârın çökmesinden iyidir.',
          responses: B(S`
            ece/uzgun: Herkesin önünde mi? Annemin önünde?
            > Herkesin önünde. Ama yalnız değil. Not ve mesaj seninle aynı anda konuşacak. Kararı sen veriyorsun; ben yalnızca bedelini ve faydasını anlattım.
            - Ece başını salladı. Bir kez. Sonra notu cebimden alıp avucunda tuttu, bir süre öyle baktı.
            ece: Bir yıl önce bu notu yazarken mutluydum. Biliyor musunuz, ilk kez bir işe girdim sandım. Gülen yüzü o yüzden çizdim.
            ece: Şimdi bakınca o gülen yüz bana gülüyor gibi geliyor. Benimle dalga geçer gibi.
            > Mahkemede o gülen yüz senin lehine konuşacak, Ece. Bir dolandırıcı kendi suçunun altına gülen yüz çizmez.
          `),
          next: 'INV1_ECE',
        }),
        option('TAV_B', 'Bunu kimse bilmiyor. İfadendeki gibi devam et: kod vermedin.', {
          score: { SAVUNMA_STRATEJISI: -100 },
          effects: [raise('ece_inkar'), inc('ethics')],
          bad: 'Avukat müvekkiline gerçeğe aykırı beyanda bulunmasını öğütleyemez (Av.K. 34; TBB Meslek Kuralları). Banka kaydı ortaya çıkınca inkâr, savunmanın en büyük yükü olur.',
          responses: B(S`
            ece: Emin misiniz? Yani… peki. Siz avukatsınız.
            - Rahatladı. Rahatlaması, benim midemdeki taşı daha da ağırlaştırdı.
            ~ "Siz avukatsınız." Evet. Bu yüzden söylememem gerekirdi.
          `),
          next: 'INV1_ECE',
        }),
        option('TAV_C', 'Bu konuda susma hakkın var. Sorulursa cevap vermeyebilirsin.', {
          neutral: 'Susma hakkı meşrudur (CMK 147/1-e); ama sessizlik, savcının anlatısına boşluk bırakır.',
          effects: [raise('ece_sus')],
          responses: B(S`
            ece: Susmak. Bir yıldır susuyorum zaten. Bir gün daha susarım.
            ~ Haklı. Ve bu yüzden susması, kimseye bir şey anlatmayacak.
          `),
          next: 'INV1_ECE',
        }),
      ],
    }),
    sceneSearch('INV1_ODA', {
      ...INV1,
      title: 'Ece’nin odası',
      background: 'ev',
      hud: ['taps'],
      exposeCounts: true,
      scene: 'sc_oda',
      lines: B(S`
        - Ece kapının eşiğinde durdu, içeri girmedi. "Dağınık" dedi yine. Dağınık değildi; bir işe hazırlanan birinin odasıydı: masa, lamba, şarjda eski bir telefon.
        - Duvarda bir pano: kesilmiş iş ilanları, renkli raptiyeler, bir köşede bir slogan: "Bir gün evet diyecekler." Pencerenin dışında yağmur, iplere asılı çamaşırları ağırlaştırıyordu.
        ~ Odalar yalan söylemez. Sadece sorulmayan soruları cevaplamaz.
      `),
      instruction: 'Dikkat çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps',
      miss: fallback('FB_ODA', 'TAP', {
        score: { ARASTIRMA: -10 },
        feedback: { text: 'Burada bir şey yok. Bir duvar, bir halı. (−1 büyüteç)', label: `${minus(10)} SKOR`, tone: 'error' },
      }),
      finish: { id: 'ODA_BITIR', label: 'Odadan çık' },
    }),
    conversation('INV1_SEVIM', {
      ...INV1,
      title: 'Atölye',
      background: 'depo',
      room: { label: 'KONFEKSİYON ATÖLYESİ · DEMİRTAŞ', character: 'sevim' },
      lines: B(S`
        = DEMİRTAŞ · KONFEKSİYON ATÖLYESİ · 12.30 @depo
        - Kırk dikiş makinesi aynı anda susmuştu; öğle arası. Havada kumaş tozu ve kızarmış ekmek kokusu. Sevim Hanım makinesinin başında, iplik bobinini değiştiriyordu.
        - Duvarda bir pano: "GÜNLÜK HEDEF 1200 ADET." Altında tebeşirle yazılmış bir rakam: 980. Kimse panoya bakmıyordu; herkes yine de biliyordu.
        sevim: Gelin. Oturacak yer yok ama ayakta konuşmayı bilirim. Ne lazım?
      `),
      choices: [
        option('SEV_BURAK', 'Burak’ı anlatın. Neden ondan şüpheleniyorsunuz?', {
          effects: [raise('fact_burak')],
          score: { SORGULAMA: 20 },
          responses: B(S`
            - Bobini yerine taktı, ipliği iğnenin deliğinden tek seferde geçirdi. Otuz yıllık bir el; titremez.
            sevim/kizgin: Çünkü telefonu bilir. Tamirci. Ece'nin şifresini bilirdi; telefonunu her bozulduğunda o açardı. Ayrılınca da "pişman olacaksın" yazdı.
            sevim: Ekimde ayrıldılar, kasımda bu iş oldu. Ben dikişçiyim; iki ucu yan yana gelen kumaşı tanırım.
            sevim: Bir de şu var: o çocuk tamirci. Telefonun içini bilir. Ben telefonun dışını bilirim, o kadar. Sizin gibi okumuşlar bilir; siz bakın.
            ~ İki uç yan yana gelince her zaman aynı kumaş olmuyor. Ama bir tamirciyle konuşmak, bir tamirciden şüphelenmekten daha ucuz.
          `),
          next: '$stay',
        }),
        option('SEV_KUTU', 'Ece’nin telefonunun kutusu duruyor mu?', {
          discovers: 'clue_iphone_imei',
          score: { ARASTIRMA: 40 },
          responses: B(S`
            sevim: Duruyor tabii. Ben kutu atmam. Ne garanti belgesi atarım ne fatura. Bir dolap dolusu kutu var evde.
            - Akşam eve uğradığımda kutuyu bir naylon poşette uzattı. Altında barkodlu bir etiket: telefonun kendi kimlik numarası, on beş hane.
            ~ Bir hattın adı vardır. Bir telefonun da. Bunu birine sormam lazım; ama önce saklamam lazım.
          `),
          next: '$stay',
        }),
        option('SEV_ECE', 'Ece size ne anlattı o gün?', {
          score: { SORGULAMA: 10 },
          effects: [raise('fact_sevim_arama')],
          responses: B(S`
            sevim: Telefonum benden alındı sabah. "Anne, şirketi arayacağım." On bire doğru. Konuştu, güldü. "Hattımı kurumsala taşıyorlarmış" dedi.
            sevim/uzgun: Kurumsal. Ben o kelimeyi ilk kez kızımın ağzından duydum. Gururlandım. Sonra polis geldi.
            sevim: Akşam yemekte bir şey yemedi. "Anne, yarın her şey düzelir" dedi. Ben de düzelir dedim. Ertesi gün banka hesabını dondurdu. Düzelmedi.
            ~ Annenin telefonu 11.05'te bir numarayı aramış. O numaranın kime ait olduğunu bulmak, bu davadaki her şeyden önemli olabilir.
          `),
          next: '$stay',
        }),
        back('SEV_GERI', 'Teşekkür et, çık'),
      ],
    }),
    story('INV1_OPERATOR', {
      ...INV1,
      title: 'Operatör mağazası',
      background: 'sokak_gece',
      lines: B(S`
        = YILDIRIM · OPERATÖR MAĞAZASI · 17.40 @sokak_gece
        - Mağaza bir akvaryum gibiydi: mavi ışık, cam, sessizce yüzen insanlar. Ece bir yıl önce aynı kapıdan, aynı saatte, ağlayarak girmişti.
        - Duvarda dev bir ekran, ekranda gülümseyen bir aile: "Hattınız, güvenliğiniz." Ece reklama bakmadı. Bir yıl önce de bakmamıştı herhalde.
        - Sıra numarası: 47. Ekranda 39 yazıyordu. Ece numarayı iki eliyle tutuyordu, sanki kaybolacakmış gibi.
        ece: Geçen sefer de bu kız vardı. Bana su vermişti.
        - Sıramız geldiğinde aynı kız masadaydı. Ece'yi tanıdı; tanıdığını belli etmedi. Sadece "Hoş geldiniz" dedi, bir yıl öncekinden daha yavaş.
        ~ Avukat olarak isteyebileceğim bir şey yok burada; kayıt Ece'nin. Ama Ece'nin bunu nasıl isteyeceğini ben seçebilirim.
      `),
      choices: [
        option('OP_A', 'Ece kendi kaydını istesin; ben yalnızca yanında dururum.', {
          discovers: 'ev_sim_dokum',
          score: { ARASTIRMA: 60, USUL_BILGISI: 20 },
          good: 'Abone kendi kişisel verisini (işlem dökümü) kendisi talep edebilir (KVKK md. 11). Avukatın yetkisi olmayan bir kaydı zorlamak gerekmez.',
          responses: B(S`
            - Ece masaya oturdu, kimliğini uzattı. Sesi titremedi. "Kendi hattımın 4 Kasım 2025 işlemlerini istiyorum. Yazılı."
            - Görevli bir şey yazdı, bir şeye tıkladı, yazıcı homurdandı. Tek sayfa.
            ece: 10.12. Mavi İletişim. Kent Meydanı. "Vekil aracılığıyla." Vekil? Ben kimseye vekâlet vermedim.
            - Sayfanın en altında, aynı günün akşamı: 19.20, "Abone itirazı: İşlemi ben yapmadım." Altında Ece'nin bir yıllık imzası.
            ~ Bir yıl önceki Ece, bugünkü Ece'ye bir kâğıt bırakmış. Kimse okumamış.
            - Ece sayfayı iki eliyle tuttu, bir süre yalnızca imzasına baktı. Sonra kâğıdı bana uzattı; ellerinden çıkmasından korkar gibi yavaşça.
            ece: Polise bunu göstermeyi düşünmedim bile. Kimse sormadı. Ben de söylemedim. Herkes hesabı sordu; telefonu kimse sormadı.
          `),
          next: '$return',
        }),
        option('OP_B', 'Avukat kimliğimi göstereyim; müvekkilimin kaydını bana versinler.', {
          discovers: 'ev_sim_dokum',
          score: { ARASTIRMA: 30 },
          neutral: 'Operatör abone verisini avukata vermez; abone kendisi ister. Sonuç aynı, yol uzun.',
          responses: B(S`
            - Görevli kartıma baktı, kibarca geri itti. "Hanımefendi, abone kendisi isterse veririz. Size veremeyiz."
            - Ece bana baktı, sonra görevliye. "Ben istiyorum." Yazıcı homurdandı. Tek sayfa: 10.12, Mavi İletişim, vekil aracılığıyla. 19.20, abone itirazı.
            ~ Avukat kartı her kapıyı açmıyor. Bazen müvekkilin kendi kimliği daha ağır bir anahtar.
          `),
          next: '$return',
        }),
      ],
    }),
  ],
};
