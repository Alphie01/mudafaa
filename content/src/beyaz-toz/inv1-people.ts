import { all, any, back, conversation, flag, meet, not, option, raise } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { INV1, card, me, n, s, th } from './shared.js';

// 53-investigation-kisiler: Defne'nin eczanesi ve zemin kattaki ev sahibi Nesrin Uysal.

export const inv1People: CasePart = {
  nodes: [
    conversation('INV_DEFNE', {
      ...INV1,
      title: 'Mudanya · eczane',
      background: 'hastane',
      room: { label: 'MUDANYA · YILDIZ ECZANESİ', character: 'defne' },
      lines: [
        {
          lines: [
            card('MUDANYA — YILDIZ ECZANESİ, 13.20', 'hastane'),
            n(
              'Eczane deniz kokuyordu, bir de alkollü pamuk. Raflarda vitaminler, bebek mamaları, bir köşede tansiyon aleti. Defne beyaz önlüğüyle tezgâhın arkasındaydı.',
            ),
            s('defne', 'Bir dakika. Teyzenin ilacını vereyim. … Günde iki kez, tok karnına. Geçmiş olsun.'),
            n(
              'Kadın çıkınca Defne kapının camındaki “Hemen dönerim” levhasını çevirdi. Sesi eczacının sesinden ablanın sesine indi.',
            ),
            s('defne', 'Buyurun. Ne lazımsa. Ama hızlı olsun; öğleden sonra reçeteler başlar.'),
            n(
              'Arkasındaki rafta kilitli bir dolap vardı; üstünde kırmızı bir etiket: “Kontrollü ilaçlar.” Defne gözümün nereye gittiğini fark etti.',
            ),
            s(
              'defne',
              'Her kutunun bir kaydı var. Her biri sayılır, imzalanır. Kardeşimin kanına giren şeyin ise kaydı yok. Bunu her sabah dolabı açarken düşünüyorum.',
            ),
          ],
        },
      ],
      choices: [
        option('DF_TEDAVI', 'Kaan’ın tedavi kayıtlarını görebilir miyim?', {
          discovers: ['ev_tedavi', 'clue_tedavi'],
          score: { ARASTIRMA: 60 },
          responses: [
            {
              lines: [
                s(
                  'defne',
                  'Hazırladım. Kaan cezaevinden imzalı bir onay yazısı gönderdi; sizin görmeniz için. Başka kimse için değil.',
                ),
                n(
                  'Bir dosya: acil servis epikrizi, 3 Ekim, 02.10. Taşikardi. Madde kullanımı. Altında AMATEM randevu çıktıları; bir de 31 Ekim tarihli bir test: negatif.',
                ),
                s(
                  'defne',
                  'O gece onu ben taşıdım. Arabanın arka koltuğunda titriyordu. “Annem bilmesin” dedi. Kalbi duracaktı, “annem bilmesin” dedi.',
                  'uzgun',
                ),
                th(
                  'Bir satıcı acile kaldırılmaz. Ya da kaldırılır; ama tedaviye kendi ayağıyla gitmez. Bu kâğıtlar Kaan’ın kim olduğunu söylüyor. Kim olmadığını değil.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('DF_GUNLUK', 'Kaan’ın günlük hayatını anlatır mısınız? En sıradan hâliyle.', {
          discovers: 'clue_kaan_olcu',
          score: { ARASTIRMA: 40 },
          responses: [
            {
              lines: [
                s(
                  'defne',
                  'Sıradan hâli mi? Öğlene kadar uyur. Kafeye gider. Kapanışta kasayı kapatır, eve yürür. Ehliyeti yok; bisiklet bile süremez, babam öğretemeden…',
                ),
                s(
                  'defne',
                  'Ayakkabısını ben alırım, 41. Montu M. Geçen kış bir motor sürücüsü montu almak istedi, “havalı” diye. Kollarından taştı. Güldük.',
                ),
                s(
                  'defne',
                  'Bir de şu var: kokuya hassastır. Motor egzozundan midesi bulanır. Kuryelerin durduğu köşeden geçmez, karşıya geçer. Saçma bir ayrıntı, biliyorum.',
                ),
                th(
                  'Ehliyet yok, motor yok, 41 numara. Küçük ayrıntılar. Bu dosyada küçük ayrıntılar büyük kapıları açacak.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('DF_PARA', 'Kaan’ın parası nasıldı? Borcu, birikimi?', {
          effects: [raise('fact_para')],
          score: { ARASTIRMA: 30 },
          responses: [
            {
              lines: [
                s(
                  'defne',
                  'Birikim mi? Kredi kartının asgarisini ben ödüyorum. Geçen ay telefon faturası için benden beş yüz lira istedi.',
                  'kizgin',
                ),
                s(
                  'defne',
                  'Arka odada sekiz bin yedi yüz elli lira bulmuşlar. O para Kaan’da olsa kartını öderdi. Bana borç sormazdı.',
                ),
                s(
                  'defne',
                  'Bir satıcı tanıdım ben, eczanede. Reçetesiz ilaç almaya gelirdi. Saati altın, telefonu yeni, ayakkabısı pahalı. Kaan’ın ayakkabısını ben alıyorum.',
                ),
                th(
                  'Satıcıların parası olur. Kullanıcıların borcu. Basit bir muhasebe; ama mahkemeler muhasebeyi sever.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('DF_BARIS', 'Barış hakkında ne biliyorsunuz?', {
          responses: [
            {
              lines: [
                s(
                  'defne',
                  'Hiç görmedim. Bir kere eve gittiğimde arka odanın kapısı kilitliydi; Kaan “Barış uyuyor, gece çalışıyor” dedi.',
                ),
                s(
                  'defne',
                  'Bir kere de Kaan’ın telefonu çaldı, hoparlördeydi. Kalın bir ses “kardeş, kombiyi hallettim” dedi. Bu kadar.',
                ),
                s(
                  'defne',
                  'Polis “yok” diyor. Ben de bilmiyorum. Bir sesten başka kanıtım yok. Ama bir ses, bir hayalet değildir, değil mi?',
                ),
                th('Bir ses, bir hayalet değildir. Ama mahkemede bir ses, bir delil de değildir.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('DF_HAKIM', 'Sizce Kaan mahkemede kullandığını söylemeli mi?', {
          neutral:
            'Bu soru Defne’nin değil, Kaan’ın kararıdır; yine de ailenin kaygısını bilmek savunmayı hazırlarken işe yarar.',
          responses: [
            {
              lines: [
                s(
                  'defne',
                  'Ben mi? Ben eczacıyım. Bir insanın kimya yüzünden hasta olabileceğini bilirim. Ama annem bilmez.',
                  'uzgun',
                ),
                s(
                  'defne',
                  'Kaan karar versin. Bu sefer ben onun yerine karar vermeyeceğim. Hep ben verdim; bakın nereye geldik.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        back('DF_BITIR', 'Teşekkür et ve çık'),
      ],
    }),
    conversation('INV_NESRIN', {
      ...INV1,
      title: 'Zemin kat · Daire 1',
      background: 'ev',
      room: { label: 'IHLAMUR SOKAK 14 · DAİRE 1', character: 'nesrin' },
      onFirstEnter: [meet('nesrin')],
      lines: [
        {
          lines: [
            card('IHLAMUR SOKAK 14 — DAİRE 1, NESRİN UYSAL', 'ev'),
            n('Kapıyı zincirini çıkarmadan açtı. Gözlüğünün üstünden baktı; aşağıdan iki kedi baktı.'),
            s(
              'nesrin',
              'Avukat mısın evladım? Kaan’ın avukatı? … Gel. Ayakkabılarını çıkarma, yeni sildim ama, neyse, çıkarma.',
            ),
            n(
              'Salonda bir dikiş makinesi, üstünde bir dantel. Duvarda bıyıklı bir adamın fotoğrafı. Çaydanlık zaten ocaktaydı.',
            ),
            s(
              'nesrin',
              'Rahmetli derdi ki: “Nesrin, apartman sahibi olmak kiracıların bütün dertlerini satın almaktır.” Haklıymış. Şekerli mi?',
            ),
            s(
              'nesrin',
              'Polise her şeyi söyledim ben. İmzamı da attım. Ama kimse bana bir şey sormadı ki. Sadece “imzala teyze” dediler.',
            ),
            n('Kedilerden biri kucağıma atladı, beni kokladı, beğenmedi, indi. Nesrin Hanım güldü; ilk kez.'),
            s(
              'nesrin',
              'Pamuk seçicidir. Polisleri hiç sevmedi. Kaan’ı severdi; Barış’ı da severdi. Tolga’yı hiç sevmedi. Kediler bilir evladım.',
            ),
            th(
              'Kedilerin bildiğini mahkemeye anlatamam. Ama bir kadının kedileri kimin sevdiğini bilecek kadar dikkatli olduğunu anlatabilirim.',
            ),
          ],
        },
      ],
      choices: [
        option('NS_ACIK', 'O sabahı sizden dinlemek isterim. Ne gördünüz, ne duydunuz?', {
          visibleWhen: not(any({ chosen: 'NS_YONLENDIR' })),
          discovers: 'clue_nesrin_moto',
          score: { SORGULAMA: 60 },
          effects: [raise('nesrin_saat')],
          good: 'Açık uçlu soru: tanığın kendi gözlemini kendi sözleriyle almak, beyanın değerini korur.',
          responses: [
            {
              lines: [
                s(
                  'nesrin',
                  'Sabah namazına kalkmıştım. Altıyı geçiyordu. Kedilere mama koyarken pencereden baktım; sokakta üç araba, ışıkları sönük.',
                ),
                s(
                  'nesrin',
                  'Sonra yukarıda bir gürültü. Bir “çat”. Ben bir şey olmuş sandım, kalorifer borusu sandım.',
                ),
                s(
                  'nesrin',
                  'Sonra o kurye oğlan geldi motoruyla. Barış. Hep köşeye park eder, zinciri korkuluğa dolar. Bu sefer köşede durdu, arabalara baktı, motoru çevirdi, gitti.',
                ),
                me('Saat kaçtı, hatırlıyor musunuz?'),
                s(
                  'nesrin',
                  'Ezan okunmuş, ben namazı kılmıştım. Altı yirmi, yirmi beş. Ondan sonra polis kapımı çaldı, “teyze, tanık lazım, yukarı gel” dedi.',
                ),
                s(
                  'nesrin',
                  'Ben çıktığımda arka odanın kapısı açıktı zaten. Kilit yerdeydi, ikiye bölünmüş. Bana “imzala” dediler, imzaladım. Saati de ben yazdım: altı kırk. Hep saati yazarım.',
                ),
                th(
                  'Altı kırk. Arama altı beşte başlamış. Tanık geldiğinde kapı çoktan kırılmış. Ve altı yirmide bir kurye köşeden dönmüş.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('NS_YONLENDIR', 'O sabah Barış’ı gördünüz, değil mi? Polisi görünce motoruyla kaçtı.', {
          visibleWhen: not(any({ chosen: 'NS_ACIK' })),
          discovers: 'clue_nesrin_moto',
          score: { SORGULAMA: -40 },
          effects: [raise('nesrin_telkin')],
          bad: 'Yönlendirici soru: cevabı tanığa sen verdin. Tanığın beyanı artık senin sözlerinle kirlendi; karşı taraf bunu duruşmada sorar (CMK 201/1’in ruhu, TBB Meslek Kuralları).',
          responses: [
            {
              lines: [
                s(
                  'nesrin',
                  'Barış mı? Kaçtı mı? … Galiba. Evet, galiba öyleydi evladım. Bir motor vardı. Kaçtı diyorsan kaçmıştır.',
                  'saskin',
                ),
                s('nesrin', 'Ben imzaladım ama. Saati yazdım. Altı kırk. Kapı açıktı ben çıktığımda.'),
                th(
                  '“Galiba.” Bir tanığın en tehlikeli kelimesi. Cevabı ben verdim, o onayladı. Bir mahkeme salonunda bu fark, bir tanığı ikiye böler.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('NS_DEFTER', 'Kirayı nasıl alıyordunuz? Arka odada kimler kaldı?', {
          discovers: 'clue_kira_defteri',
          score: { ARASTIRMA: 60 },
          responses: [
            {
              lines: [
                s(
                  'nesrin',
                  'Kirayı Kaan getirir, elden. Ben deftere yazarım. Vergiden korkuyorum evladım, ama defter tutarım. Rahmetli muhasebeciydi.',
                ),
                n(
                  'Dikiş makinesinin çekmecesinden kareli bir defter çıkardı. Sayfalar el yazısıyla doluydu: tarihler, tutarlar, küçük notlar.',
                ),
                s(
                  'nesrin',
                  'Bak: “Eylül başı, Tolga çıkarıldı, depozito borca sayıldı.” Bir sayfa sonra: “20 Eylül, Barış, kurye oğlan, arka oda, Kaan’la paylaşıyor; kira Kaan’dan.”',
                ),
                s(
                  'nesrin',
                  'Barış iyi çocuktu. Pazar filelerimi yukarı taşırdı. “Teyze, ben İzmirliyim, annem de senin gibi kedi besler” derdi.',
                ),
                s(
                  'nesrin',
                  'Barış elden verirdi kirayı, Kaan’a. Kaan bana getirirdi, yuvarlak hesap. Hep yirmisinde. Bir kere yirmi birinde getirdi; özür diledi. Böyle çocuklar.',
                ),
                th('Bir hayaletin kira kaydı. El yazısıyla, tarihli. Savcılık bu kapıyı hiç çalmamış.'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('NS_TOLGA', 'Tolga kimdi?', {
          visibleWhen: any({ chosen: 'NS_DEFTER' }),
          effects: [raise('fact_tolga_n')],
          score: { SORGULAMA: 30 },
          responses: [
            {
              lines: [
                s(
                  'nesrin',
                  'Ah, o. Kırmızı bereli. Kirayı geciktirirdi, gece yarısı müzik açardı. Kaan çıkardı onu; ben de rahatladım, Allah affetsin.',
                ),
                s(
                  'nesrin',
                  'Anahtarı vermedi. “Kaybettim” dedi. Kayıp anahtar olur mu, olur. Ama bu kaybolmadı bence.',
                ),
                s(
                  'nesrin',
                  'Ekimde, kasımda birkaç kere gördüm onu sokakta. Gece. Kapının önünde birini bekler gibiydi. Kimi beklediğini bilmem; ben perdeyi kapattım.',
                ),
                s(
                  'nesrin',
                  'Bir gece kapıyı çaldı bile. “Teyze, Barış yukarıda mı?” dedi. Gece yarısı. Ben “git oğlum, saat kaç” dedim. Gitti.',
                ),
                th('Çıkarıldığı evin önünde, geceleri, birini bekleyen bir eski kiracı. Kimi bekliyordu?'),
              ],
            },
          ],
          next: '$stay',
        }),
        option('NS_TANIK', 'Bunları mahkemede de anlatır mısınız? Gördüğünüz gibi, olduğu gibi.', {
          visibleWhen: all(not(flag('nesrin_kus')), not(flag('nesrin_razi'))),
          effects: [raise('nesrin_razi')],
          score: { SORGULAMA: 40 },
          responses: [
            {
              lines: [
                s(
                  'nesrin',
                  'Mahkemede mi? Ben hayatımda bir kere mahkemeye gittim, rahmetlinin miras işi. Elim ayağım titredi.',
                  'saskin',
                ),
                s(
                  'nesrin',
                  'Ama Kaan iyi çocuktur. Çayını şekersiz içer, borcunu geciktirmez. Ben gördüğümü söylerim. Gördüğümü, fazlasını değil.',
                ),
                s(
                  'nesrin',
                  'Kediler ne olacak? Komşuya bırakırım. Defterimi de getiririm. Rahmetli “kayıt, insandan uzun yaşar” derdi.',
                ),
              ],
            },
          ],
          next: '$stay',
        }),
        option('NS_BASKI', 'Gelmezseniz mahkeme sizi zorla getirtir, bilin.', {
          visibleWhen: all(not(flag('nesrin_kus')), not(flag('nesrin_razi'))),
          effects: [raise('nesrin_kus')],
          score: { SORGULAMA: -40 },
          bad: 'Tanığı korkutmak, onu karşı tarafa iter. Mahkemenin zorla getirme yetkisi (CMK 44) bir tehdit cümlesi değildir; tanıkla görüşmede baskı kurulmaz.',
          responses: [
            {
              lines: [
                s('nesrin', 'Zorla mı? Ben yetmiş yaşında kadınım evladım. Beni zorla mı getirteceksin?', 'kizgin'),
                s(
                  'nesrin',
                  'Polisler de öyle konuştu. “İmzala teyze.” Herkes bana bir şey yaptırıyor. Kalk git şimdi. Kediler acıktı.',
                  'kizgin',
                ),
                th(
                  'Kapı arkamdan zincirlendi. Bir tanığı kaybetmenin en kısa yolu, ona elinde ne olduğunu hatırlatmaktır.',
                ),
              ],
            },
          ],
          next: '$return',
        }),
        back('NS_BITIR', 'Çay için teşekkür et ve çık'),
      ],
    }),
  ],
};
