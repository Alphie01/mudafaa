import {
  all,
  any,
  choiceNode,
  cmp,
  cont,
  courtSession,
  dec,
  decisionNode,
  fallback,
  flag,
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
  resultNode,
  score,
  statement,
  strategyAmount,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, O, W } from './dsl.js';
import { C5, CV, court2 } from './shared.js';
import { wrongEvidence } from './hearing-1.js';

// 80-trial: ikinci celse. Bilirkişi, Hayri Sezer, Ozan Tekin'in çapraz sorgusu (CMK 48), savcının karşı delili,
// mütalaa ve cevap, dayanaklar, esas savunma, son söz, hüküm ve çöküş.

const ozanW = { witness: 'ozan', witnessLabel: 'TANIK · OZAN TEKİN' };

export const trial: CasePart = {
  court: {
    sessions: [
      courtSession('cs_2', '2. Celse', [
        ['s2_acilis', 'ACILIS', 'T_00'],
        ['s2_bilirkisi', 'TANIK_DINLEME', 'T_01'],
        ['s2_hayri', 'TANIK_DINLEME', 'T_02'],
        ['s2_ozan', 'TANIK_DINLEME', 'T_03'],
        ['s2_delil', 'DELIL_TARTISMA', 'T_05'],
        ['s2_mutalaa', 'MUTALAA', 'T_06'],
        ['s2_savunma', 'SAVUNMA', 'T_08'],
        ['s2_son_soz', 'SON_SOZ', 'T_09'],
        ['s2_karar', 'KARAR', 'T_10'],
      ]),
    ],
  },
  nodes: [
    court2.stage('T_00', {
      title: 'İkinci celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      lines: B(`
        # BURSA 7. ASLİYE CEZA MAHKEMESİ — 2. CELSE · ÜÇ HAFTA SONRA |bg=durusma_salonu
        > Üç hafta, bir davada hem çok uzun hem çok kısadır. Koridorda bu kez daha az şemsiye vardı; hava açmıştı. Tarık kravatını kendi bağlamıştı, düzgün değildi; düzeltmedim, öyle daha insandı.
        recep: Tarık Aksoy dosyası! Taraflar ve tanıklar salona.
        > Tanık sırasında yeni bir yüz: Ozan Tekin. Lacivert takım, parlak ayakkabılar, dizinde katlı bir palto. Beni görünce başını eğdi, o bildik gülümsemesiyle. “Üstat,” der gibiydi, ama sustu.
        > Melis yine katılan sırasında. Bu kez paltosu dizlerinde değil, omzunda. Küçük bir fark, ama bir restoratör gibi ben de küçük farkları okumayı öğrenmiştim.
        feride: İkinci celse açıldı. Ara kararların infazı tamamlandı. Servis sağlayıcısının yazısı, hastane kayıtları ve bilirkişi raporu geldiyse okundu, dosyaya kondu. Tanıklar hazır.
      `),
      choices: [
        {
          id: 'T00_DEVAM',
          kind: 'CONTINUE',
          label: 'Devam',
          next: { routes: [{ when: has('ev_laptop'), to: 'T_00L' }, { to: 'T_01' }] },
        },
      ],
    }),

    // --- El konulan dizüstü: imaj ve hash (CMK 134) ---
    choiceNode('T_00L', {
      ...C5,
      title: 'El konulan dizüstü',
      background: 'durusma_salonu',
      lines: B(`
        tolga: Sayın Hâkim, bir bilgi sunmam gerekiyor. Müdafiin suç duyurusu üzerine dün Tekin Yapı Danışmanlık’ın ofisinde, hâkimlik kararıyla arama yapıldı.
        tolga: Arşiv dolabında “Aksoy Tekin Demirbaş 07” etiketli bir dizüstü bulundu. Açıktı; ekranda bir mesajlaşma uygulaması. El konuldu, mühürlü torbada emanette.
        > Tanık sırasında Ozan’ın gülümsemesi yerinde duruyordu. Yalnızca palto, dizinde biraz kaydı.
        feride: Dizüstü, imajı alınmadan incelenmedi mi?
        tolga: İncelenmedi Sayın Hâkim. Torba mühürlü. Talimatınızı bekliyoruz.
        ~ Üç ay önce bir telefon bir çekmecede, bantlı bir zarfta iki gün durdu. Bu kez bir torba, bir mühür. Hata ikinci kez yapılmamalı.
        feride: Müdafi, bu cihazla ilgili talebiniz?
      `),
      prompt: { speaker: 'narrator', text: 'El konulan dizüstü için ne istersin?' },
      choices: [
        option('T00L_IMAJ', 'Mühür tutanakla açılsın; önce imaj ve hash alınsın.', {
          score: { USUL_BILGISI: 120 },
          effects: [
            inc('legal_hits'),
            raise('laptop_imaj'),
            mark(
              'GOOD',
              'Dijital delil önce yedeklenir: birebir kopya (imaj) alınır, hash değeri tutanağa geçer, inceleme kopya üzerinde yapılır (CMK 134/4). Asıl cihaz mühürlü kalır.',
              'USUL_BILGISI',
            ),
          ],
          responses: B(`
            P: Sayın Hâkim, bu dosyanın bütün yarası bir cihazın usulsüz açılmasıydı. Aynı yarayı bu kez savunmanın lehine açmak istemiyorum.
            P: Mühür, tarafların huzurunda tutanakla açılsın. Bilirkişi cihazın birebir kopyasını alsın, hash değerini hesaplasın ve tutanağa geçirsin. İnceleme yalnızca kopya üzerinde yapılsın.
            P: Asıl cihaz yeniden mühürlensin. O dizüstüdeki her kayıt, kimin lehine olursa olsun, sorgulanamaz biçimde korunsun.
            feride: Kabul. Cihaz bu usulle adli bilişim bilirkişisine teslim edilecek; mühür açma, imaj ve hash tutanağa geçecek.
            > Savcı bir an bana baktı; o bakışta bir onay vardı, belki biraz da şaşkınlık. Kendi lehine olan bir delili frenleyen bir savunmaya pek rastlamamıştı.
            ~ Bir delil, ne kadar kuvvetliyse o kadar dikkatli taşınır. Leyla bunu bir kez söylemişti; ben iki kez duydum.
          `),
          next: 'T_01',
        }),
        option('T00L_AC', 'Dizüstü tarafların huzurunda burada açılsın; ekran olduğu gibi tutanağa geçsin.', {
          score: { USUL_BILGISI: -100 },
          effects: [dec('cred')],
          bad: 'Kopyası alınmadan açılan cihazın kayıtları değişir; savunma, polisin yaptığı hatayı kendi delilinde tekrarlamış olur. Önce imaj ve hash (CMK 134/4).',
          responses: B(`
            feride: Müdafi, bu dosyada bir cihazın usulsüz açılmasından şikâyet eden sizdiniz. Talebiniz reddedildi. Cihaz önce kopyalanacak.
            ~ Haklıydı. Bir an için, bir ekranı görme hevesi, bütün dersimi unutturdu.
          `),
          next: 'T_01',
        }),
        option('T00L_YOK', 'Talebimiz yok; elimizdeki deliller yeterli.', {
          neutral: 'Mahkeme cihazı yine de bilirkişiye gönderir; ama savunma, delilin korunmasında söz sahibi olmadı.',
          responses: B(`
            feride: Cihaz, olağan usulle bilirkişiye gönderilecek. Devam ediyoruz.
          `),
          next: 'T_01',
        }),
      ],
    }),

    // --- Bilirkişi ---
    court2.stage('T_01', {
      title: 'Bilirkişi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('bilirkisi_istendi'),
          `
            recep: Bilirkişi Dr. Nazlı Uçar!
            > Kırklı yaşlarda bir kadın. Elinde ince bir rapor, bir de dizüstü. Gözlüğünü taktı.
            feride: Raporunuzu özetleyin.
          `,
        ),
        O(`
            feride: Dosyada ayrıca bir bilirkişi incelemesi talep edilmedi. Kolluğun raporu okundu.
            > Bilirkişi sırası boş kaldı. Savcı rahatladı; onun en zayıf tanığı, orada olmayan tanıktı.
          `),
      ],
      onFirstEnter: [meet('nazli'), meet('ozan'), meet('hayri')],
      choices: [
        {
          id: 'T01_DEVAM',
          kind: 'CONTINUE',
          label: 'Devam',
          next: { routes: [{ when: flag('bilirkisi_istendi'), to: 'T_01T' }, { to: 'T_02' }] },
        },
      ],
    }),
    court2.testimony('T_01T', {
      title: 'Bilirkişi Dr. Uçar',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'nazli',
      witnessLabel: 'BİLİRKİŞİ · DR. NAZLI UÇAR',
      say: [
        {
          speaker: 'nazli',
          text: 'İmaj üzerinde inceleme yaptım. Hash değeri raporla uyumlu. Bulgularımı başlıklar hâlinde sunuyorum.',
        },
        { speaker: 'feride', text: 'Müdafi, bilirkişiye sorularınız?' },
      ],
      rulesText: 'Bilirkişinin bulgularını doğru delille pekiştir; yanlış delil yine güvenilirliği düşürür.',
      statements: [
        statement('B1', 1, [
          'Mesajlar, hesaba bağlı ',
          hl('üç numaralı bir cihazdan', any(flag('press_o1'), has('clue_cihaz3'))),
          ' gönderilmiş görünüyor.',
        ]),
        statement('B2', 2, [
          '9 Kasım gecesi birincil cihaz, yani telefon, ',
          hl('kilitliydi', any(flag('press_o4'), has('clue_kilit'))),
          '; ileti başka bir oturumdan çıkmış.',
        ]),
        statement('B3', 3, ['Ekran görüntüsü teknik olarak bir delil değildir; olsa olsa bir anekdottur.']),
        statement('B4', 4, [
          'Cihaz 3’ün başında kimin oturduğunu imajdan söyleyemem; ',
          hl('teknik olarak sanığın kendisi de olabilir', any(has('ev_isp'), has('ded_hastane'))),
          '.',
        ]),
        statement('B5', 5, [
          'İmajın hash değeri, ',
          hl('telefondaki verilerin el değmeden korunduğunu', has('ded_zincir')),
          ' gösterir; bütünlük sorunu yoktur.',
        ]),
      ],
      rules: [
        pressRule('PR_B1', 'B1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o1')],
          responses: B(`
            P: Üç numaralı cihaz nedir?
            nazli: Hesabın bağlı cihazlar listesinde “OFIS-LAPTOP-07” olarak kayıtlı bir masaüstü oturumu. Bir dizüstü. Telefon değil.
          `),
        }),
        presentRule('PS_B1', 'B1', ['ded_bagli', 'clue_bagli_cihaz'], {
          score: { SORGULAMA: 200 },
          effects: [
            inc('pers'),
            raise('bilirkisi_cihaz'),
            mark(
              'GOOD',
              'Bilirkişi, tehditlerin telefondan değil bağlı bir masaüstü oturumundan çıktığını teyit etti.',
              'SORGULAMA',
            ),
          ],
          responses: B(`
            P: Hesap verisindeki cihaz 3 ile raporun Ek-3’ündeki “gönderen cihaz 3” aynı cihaz mı?
            nazli: Aynı. Tek bir oturum. 14 Şubat’ta hesaba bağlanmış, o günden beri hiç kapatılmamış bir masaüstü oturumu. Üç tehdit mesajı ve iletilen ses kaydı, bu oturumdan gönderilmiş.
            nazli: Bir hesap, birden fazla cihazda aynı anda açık olabilir. Telefon, tablet, bilgisayar. Mesajın hangisinden yazıldığını ancak gönderen cihaz kaydı söyler. Bu kayıt da “3” diyor.
            feride: Yani sanığın telefonu cebindeyken, hatta kilitliyken, mesaj başka bir yerden gönderilebilir.
            nazli: Gönderilebilir, Sayın Hâkim. Daha da ötesi: bu dosyada gönderilmiş. Gönderen cihaz kaydı yalan söylemez; makine, kimin lehine olduğunu bilmez, sadece kaydeder.
            nazli: Bir benzetme yapayım: bir evin birden çok anahtarı olabilir. Kapıyı kimin açtığını, kapının kendisi değil, o gece hangi anahtarın kullanıldığı söyler. Bu dosyada kullanılan anahtar, telefon değil; o masaüstü oturumu.
            > Savcı not aldı, uzun uzun. Tarık’ın elleri dizinde kenetlenmişti; kurşun kalem cebinde, sessiz. Hâkim, bilirkişiye değil, dosyaya bakıyordu artık.
          `),
        }),
        pressRule('PR_B2', 'B2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o4')],
          responses: B(`
            P: Kilitli bir telefondan, sahibinin eli değmeden ileti gönderilebilir mi?
            nazli: Hayır. Ama bağlı bir masaüstü oturumundan gönderilen ileti, telefon kilitliyken de hesapta görünür.
          `),
        }),
        presentRule('PS_B2', 'B2', ['ded_hastane', 'clue_kilit'], {
          score: { SORGULAMA: 200 },
          effects: [
            inc('pers'),
            raise('bilirkisi_kilit'),
            mark(
              'GOOD',
              '9 Kasım gecesi telefon kilitli; ileti başka oturumdan: mazeret teknik olarak doğrulandı.',
              'SORGULAMA',
            ),
          ],
          responses: B(`
            P: 9 Kasım gecesine bakalım. Raporun Ek-2’sine göre telefon 01.40’ta kilitlenmiş, 06.10’a kadar hiç açılmamış. Aynı gece 02.10’da müvekkilim acil serviste bir onam formu imzalıyor; saati hemşire yazmış.
            P: Ama 02.14’te, o telefon kilitliyken, o hesaptan Hayri Sezer’e bir ses kaydı iletiliyor. Bu nasıl olur?
            nazli: Telefondan olmaz. Kilitli bir cihazdan, sahibinin parmağı değmeden ileti gidemez. Bu ileti cihaz 3’ten, o masaüstü oturumundan çıkmış. Kilit kayıtları telefonu kesin olarak dışlıyor.
            feride: Yani o gece, o saatte, iletiyi gönderen her kimse, sanığın telefonunun başında değildi.
            nazli: Değildi Sayın Hâkim. Başka bir yerde, başka bir cihazın başındaydı. Sanık ise, kilit kaydının ve hastane onamının gösterdiği gibi, bir acil servis koridorundaydı.
            P: Bir kişi aynı anda iki yerde olamaz Sayın Hâkim. Ama bir hesap olabilir: biri kilitli bir telefonda uyuyor, biri bir masaüstünde, bir başkasının elinde, çalışıyor.
            nazli: Doğru ifade bu. Hesap bölünebilir; insan bölünemez.
          `),
        }),
        presentRule('PS_B3', 'B3', ['ded_ss', 'ev_ss'], {
          score: { SORGULAMA: 100 },
          effects: [
            raise('bilirkisi_ss'),
            mark('GOOD', 'Bilirkişi, ekran görüntülerinin delil değeri olmadığını söyledi.', 'SORGULAMA'),
          ],
          responses: B(`
            P: Şube’nin aldığı on dört ekran görüntüsü? Savcılık en çok onlara dayanıyor.
            nazli: Bir ekranın fotoğrafı, Sayın Hâkim. Teknik olarak bir delil değil, olsa olsa bir anekdot. Kaynağı denetlenemez, bütünlüğü sağlanamaz. İsteyen istediği ekranı kurgular, fotoğrafını çeker.
            nazli: Adli bilişimde kural şudur: cihazın birebir kopyasını alırsın, hash’ini hesaplarsın, öyle incelersin. Ekranın fotoğrafını çekmek, bir romanın bir sayfasının fotoğrafıyla kitabı yargılamaya benzer.
            nazli: Ben olsam bu görüntüleri hiçbir rapora koymazdım. Koyan meslektaş, acele etmiş.
            > Savcı başını hafifçe öne eğdi. Bu bir kabulden çok, bir teslimdi.
          `),
        }),
        pressRule('PR_B4', 'B4', {
          score: { SORGULAMA: 25 },
          responses: B(`
            P: Sanık da olabilir, dediniz. Neye dayanarak?
            nazli: Hiçbir şeye dayanarak değil, müdafi. Bilmediğim şeyi dışlamıyorum. Hesap onun; bir dizüstüden de girebilirdi. Ben yalnızca cihazı söylerim, eli söyleyemem.
            ~ Bilirkişinin dürüstlüğü, bu dosyada savcının en iyi cümlesi olabilir. Onu daraltmak bana düşüyor; ama kendi kâğıtlarımla.
          `),
        }),
        presentRule('PS_B4', 'B4', ['ded_ip_tekin', 'ev_isp'], {
          score: { SORGULAMA: 150 },
          effects: [
            inc('pers'),
            raise('bilirkisi_el'),
            mark(
              'GOOD',
              'Hat bilgisi bilirkişinin “sanık da olabilir” cümlesini daralttı: cihaz 3 sanığın hattından bağlanmamış.',
              'SORGULAMA',
            ),
          ],
          responses: B(`
            P: Hesap verisine göre cihaz 3, üç gecenin üçünde de 85.105.44.17 adresinden bağlanmış. Servis sağlayıcısının mahkemeye yazısı dosyada.
            P: Müvekkilimin ev hattı 176.88.12.4. O adres, üç gecenin hiçbirinde görünmüyor.
            nazli: Bu bilgiyle cümlemi daraltırım Sayın Hâkim. Cihaz 3, o gecelerde sanığın evinden değil, bir iş hattından bağlanmış. “Sanık da olabilir” demiştim; doğrusu, “sanığın evinden değil.”
            tolga: Sanık o hatta başka bir yoldan erişmiş olamaz mı?
            nazli: Olabilir, Sayın Savcı. Ama bunu gösteren bir veri yok. Benim işim veriyle konuşmak.
          `),
        }),
        presentRule('PS_B4H', 'B4', ['ded_hastane'], {
          score: { SORGULAMA: 80 },
          effects: [
            raise('bilirkisi_el'),
            mark('GOOD', 'En az bir gece için sanık, cihaz 3’ün başında olamazdı.', 'SORGULAMA'),
          ],
          responses: B(`
            P: 9 Kasım gecesi 02.14’te müvekkilim bir acil serviste onam formu imzalıyor; telefonu hemşire masasında, kilitli.
            nazli: O gece için bir dizüstünün başında olması da beklenemez. En azından bir gece için, “sanık da olabilir” cümlemi geri alırım.
          `),
        }),
        pressRule('PR_B5', 'B5', {
          score: { SORGULAMA: 25 },
          responses: B(`
            P: Hash neyi korur, tam olarak?
            nazli: Alındığı andaki hâli. Ondan sonra bir bit bile değişse, değer tutmaz. Ondan önceyi ise… hash bilmez.
            ~ “Ondan önceyi bilmez.” Bir cümle, bir kapı aralığı.
          `),
        }),
        presentRule('PS_B5', 'B5', ['ded_zincir'], {
          score: { SORGULAMA: 150 },
          effects: [
            inc('pers'),
            raise('bilirkisi_zincir'),
            mark(
              'GOOD',
              'Bilirkişi, hash’in yalnızca 14 Kasım sonrasını koruduğunu, 12–14 Kasım arasının belgesiz kaldığını kabul etti.',
              'SORGULAMA',
            ),
          ],
          responses: B(`
            P: Hash 14 Kasım 11.05’te alındı. Telefon ise 12 Kasım’da mühürsüz, bantlı bir zarfta Şube’de açıldı; iki gün bir çekmecede kaldı.
            P: Raporunuzun Bulgu 3’ü: 12 Kasım 15.40–15.52 arası kilit açma, uygulama gezinmesi ve cihaza yazılan on dört yeni dosya.
            nazli: Doğru. Cümlemi düzeltiyorum Sayın Hâkim: hash 14 Kasım’dan sonrasının bütünlüğünü korur. 12 ile 14 Kasım arasını değil; o aralık için elimde bir güvence yok.
            feride: Tutanağa geçirin: el koyma ile kopyalama arasındaki süre için bütünlük güvencesi bulunmamaktadır.
          `),
        }),
      ],
      presentMiss: fallback('FB_B_PRESENT', 'PRESENT', {
        effects: [
          ...wrongEvidence,
          score('SORGULAMA', -120, 'hatali'),
          mark('BAD', 'Bu delil bilirkişinin bu bulgusuyla ilgili değil.', 'SORGULAMA'),
        ],
        responses: B(`nazli: Bu belgenin sorduğunuz bulguyla teknik bir ilgisi yok.`),
      }),
      finish: { id: 'T01T_BITIR', label: 'Bilirkişiyi bırak', next: 'T_02' },
    }),

    // --- Hayri Sezer ---
    court2.stage('T_02', {
      title: 'Hayri Sezer',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('hayri_istendi'),
          `
          recep: Tanık Hayri Sezer!
          > Yaşlı adam ağır ağır kürsüye çıktı, bastonunu yanına dayadı. Takımı eski ama ütülü; bir başka çağın beyefendisi. Cebinden, kadran saati gibi eski bir telefon çıkardı.
          feride: Kimliğiniz tespit edildi. Gerçeği söylemekle yükümlüsünüz. Yemininizi edin.
          hayri: Bildiğimi doğru söyleyeceğime yemin ederim evladım. Pardon, Sayın Hâkim. Alışkanlık; kırk yıldır herkese evladım derim.
          feride: Anlatın.
          hayri: Ben eski bir adamım Sayın Hâkim. Hanlarla büyüdüm, taşla konuşurum. Bu telefon işlerinden anlamam. Ama bir gece bana ait olmayan bir acı geldi, onu anlatayım.
          hayri: 9 Kasım gecesi, saat 02.14. Telefonum çaldı, uyandım. Bizim yaşta gece gelen ses kötü haberdir; açtım. Tarık Bey’in adından bir ses kaydıymış.
          hayri: Oynattım. Bir kadın ağlıyordu. Üç saniye dinledim, kapattım. Başkasının gözyaşını dinlemek ayıptır; hele izni yoksa, günahtır.
          hayri: Ertesi gün Melis Hanım’ı aradım. “Kızım, bir şey gelmiş, dinlemedim, üzülme” dedim. Sesi titredi. İşte bildiğim bu kadar, ne bir eksik ne bir fazla.
        `,
        ),
        O(`
          feride: Tanık Hayri Sezer’in dinlenmesine karar verilmemişti; dosyaya beyanı girmedi.
          > Ses kaydının alıcısı, o koltukta hiç oturmadı. Bir saat, bir telefonun içinde kaldı.
        `),
      ],
      choices: [
        {
          id: 'T02_DEVAM',
          kind: 'CONTINUE',
          label: 'Devam',
          next: { routes: [{ when: flag('hayri_istendi'), to: 'T_02Q' }, { to: 'T_03' }] },
        },
      ],
    }),
    court2.objection('T_02Q', {
      title: 'Hayri Sezer’e sorular',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'hayri',
      witnessLabel: 'TANIK · HAYRİ SEZER',
      say: [{ speaker: 'feride', text: 'Müdafi, tanığa sorularınız?' }],
      next: 'T_03',
      options: [
        option('T02Q_SAAT', 'Bildirimin saatini gösterir misiniz?', {
          score: { SORGULAMA: 60 },
          effects: [inc('pers'), raise('hayri_saat')],
          good: 'Tanığın kendi cihazındaki nesnel kayda dayanan bir soru.',
          responses: B(`
            > Hayri Bey telefonu titreyen eliyle hâkime uzattı. Zabıt kâtibi yanına geldi, ekrana baktı, bir şeyler yazdı.
            derya: Ekranda 9 Kasım, saat 02.14 görünüyor Sayın Hâkim. Gönderen: Tarık Aksoy.
            hayri: Bakın işte. 9 Kasım, 02.14. Silmedim. Ben eski bir adamım, ama bildiğim bir şey var: bir kâğıt, bir saat, yalan söylemez. İnsanlar söyler, saatler söylemez.
            feride: Tutanağa geçirin. Tanığın telefonundaki bildirim saati: 9 Kasım, saat 02.14.
            > Hâkim telefonu geri uzattı. Hayri Bey bir teşekkür mırıldandı, telefonu cebine, kalbinin üstüne koydu.
            ~ 02.14. Tam o dakikada, bir hastane koridorunda, Tarık bir onam formu imzalıyordu. İki ayrı kâğıt, iki ayrı şehir köşesi, aynı dakikayı fısıldıyor.
            ~ Bir adam aynı anda iki yerde olamaz. Ama bir hesap olabilir: biri telefonda kilitli, biri bir masaüstünde açık.
          `),
        }),
        option('T02Q_KIM', 'Bu kayıttan başka kimlerin haberi oldu?', {
          score: { SORGULAMA: 20 },
          responses: B(`
            hayri: Ertesi hafta bütün teklif sahipleri biliyordu. Üç firma. Bursa bir avlu Sayın Hâkim.
          `),
        }),
        option('T02Q_YOK', 'Sorum yok; tanığın beyanı dosyadaki ifadesiyle zaten aynı.', {
          neutral: 'Tanığın telefonundaki saati tutanağa geçirme fırsatı kullanılmadı.',
        }),
      ],
    }),

    // --- Ozan Tekin ---
    court2.stage('T_03', {
      title: 'Ozan Tekin',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      ...ozanW,
      lines: [
        W(
          flag('suc_duyurusu'),
          `
        recep: Tanık Ozan Tekin!
        feride: Tanık, müdafiin suç duyurusu üzerine hakkınızda ayrı bir soruşturma yürütüldüğü anlaşılıyor. Bu nedenle yeminsiz dinleneceksiniz (CMK 50/1-c). Gerçeği söylemeniz yine beklenir.
        > Ozan bir an duraksadı; sonra bana doğru hafifçe başını eğdi, o eski “üstat” selamıyla. Yemin etmeyecekti. Gülümsemesi bunu bir ayrıcalık sayıyordu.
        ozan: Elbette Sayın Hâkim. Saklayacak bir şeyim yok.
        feride: Sanıkla ilişkinizi ve bildiklerinizi anlatın.
        ozan: On yıllık dostum, üç yıllık ortağım. Mart’ta yollarımızı ayırdık; dostça desem yalan olur, ama kan davası da değildi. İş işte, bazen biter.
        ozan: Tarık dâhi bir mimardır. Ama öfkeli bir adamdır, insanları tanımaz. Herkese tek bir anahtarla yaklaşır; sonra o anahtarı birinin kullanmasına şaşırır.
        ozan/uzgun: Ekim ortasında Tophane’de, türbenin altındaki çay bahçesinde oturduk. “Melis’in sırlarını biliyorum, onu pişman edeceğim” dedi. Ben güldüm, ciddiye almadım. Keşke alsaymışım.
        > Anlatışı pürüzsüzdü. Fazla pürüzsüz. İyi yazılmış bir metin gibi. Ve ben, iyi yazılmış metinlerin kimin elinden çıktığını merak eden biriyim.
        `,
        ),
        O(`
        recep: Tanık Ozan Tekin!
        > Ozan kürsüye çıkarken bana doğru hafifçe başını eğdi, o eski “üstat” selamıyla. Yeminini gür bir sesle etti; sanki bir açılış kokteylinde konuşuyordu, sanki salon onu dinlemek için toplanmıştı.
        ozan: Bildiğimi dosdoğru söyleyeceğime namusum ve vicdanım üzerine yemin ederim Sayın Hâkim.
        feride: Sanıkla ilişkinizi ve bildiklerinizi anlatın.
        ozan: On yıllık dostum, üç yıllık ortağım. Mart’ta yollarımızı ayırdık; dostça desem yalan olur, ama kan davası da değildi. İş işte, bazen biter.
        ozan: Tarık dâhi bir mimardır. Ama öfkeli bir adamdır, insanları tanımaz. Herkese tek bir anahtarla yaklaşır; sonra o anahtarı birinin kullanmasına şaşırır.
        ozan/uzgun: Ekim ortasında Tophane’de, türbenin altındaki çay bahçesinde oturduk. “Melis’in sırlarını biliyorum, onu pişman edeceğim” dedi. Ben güldüm, ciddiye almadım. Keşke alsaymışım.
        > Anlatışı pürüzsüzdü. Fazla pürüzsüz. İyi yazılmış bir metin gibi. Ve ben, iyi yazılmış metinlerin kimin elinden çıktığını merak eden biriyim.
        `),
      ],
      choices: [cont('T03_DEVAM', 'Çapraz sorguya başla', 'T_03T')],
    }),
    court2.testimony('T_03T', {
      title: 'Ozan Tekin · çapraz',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      ...ozanW,
      say: [{ speaker: 'feride', text: 'Müdafi, tanığa sorularınız?' }],
      rulesText: 'Önce bastır, sonra çelişkiyi delille göster. Yanlış delil güvenilirliği düşürür.',
      objectionGrounds: ['g_kanaat', 'g_duyum', 'g_telkin'],
      statements: [
        statement('O1', 1, [
          'Tarık, Ekim ortasında “pişman edeceğim” dedi. ',
          hl('Ben de orada olduğum için biliyorum', any(flag('press_o1x'), has('ev_pay'))),
          '.',
        ]),
        statement('O2', 2, [
          'Ofisten ayrılırken ',
          hl('her şeyi teslim ettim', any(flag('press_o2'), has('clue_envanter'), has('clue_koli'))),
          '; tek bir ataç bile bende kalmadı.',
        ]),
        statement('O3', 3, [
          'Ben kendi işimle meşgulüm, yeni bir firma kurdum. PUSULA’yı yalnızca kendi telefonumda kullanırım. ',
          hl(
            'Tarık’ın hesabına nasıl gireyim, ne diye gireyim',
            any(flag('press_o3'), has('clue_ip_ayni'), has('ded_ip_tekin')),
          ),
          '? Benim öyle bir derdim yok.',
        ]),
        statement('O4', 4, [
          'Zaten Tarık’ın şifresini ',
          hl('bilmem mümkün değil', any(flag('press_o4x'), has('ev_not'), has('clue_dock'))),
          '; o şifreler konusunda çok titiz, çok özel bir adamdı. Kimseye söylemezdi.',
        ]),
        statement('O5', 5, [
          'Bana sorarsanız bu mesajlar tam Tarık’ın tarzı; sinirlenince sert olur. ',
          hl('Onu on yıldır tanırım, herkesten iyi tanırım', any(has('ded_uslup_ozan'), has('clue_uslup_ozan'))),
          '.',
        ]),
      ],
      rules: [
        presentRule('PS_T_SAVCILIK', undefined, ['ev_ss', 'ev_sikayet', 'ev_ozan_ifade'], {
          maxUses: 3,
          effects: [
            ...wrongEvidence,
            score('SORGULAMA', -150, 'hatali'),
            mark('BAD', 'Bu delil tanığı çürütmez; savcılığın anlatımını tekrarlar.', 'SORGULAMA'),
          ],
          responses: B(`ozan: Aynen öyle üstat. Teşekkür ederim.`),
        }),
        pressRule('PR_O1', 'O1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o1x')],
          responses: B(`
            P: “Pişman edeceğim.” Tam olarak bu kelimeleri mi kullandı? Nerede, ne zaman?
            ozan: Tophane’de, türbenin altındaki çay bahçesinde. Ekim ortası. Kızgındı, bardakları itti, çay döküldü. Unutmam.
            P: İyi hatırlıyorsunuz. Peki “pişman edeceğim” demek, “gece saat ikide, üç gece üst üste, özel belgelerini yayarım diye mesaj atacağım” demek midir?
            ozan: Yani… öfkeli bir laf işte. Herkes der böyle şeyler.
            P: Herkes der. Ama herkes yapmaz. Bir öfke sözünü, üç gecelik planlı bir şantaja siz mi çevirdiniz Ozan Bey, yoksa duyduğunuz lafı mı aktarıyorsunuz?
            ozan: Ben… duyduğumu söylüyorum.
          `),
        }),
        objectRule('OB_O1', 'O1', 'g_kanaat', {
          score: { USUL_BILGISI: 60 },
          effects: [
            inc('legal_hits'),
            inc('pers'),
            mark(
              'GOOD',
              'Tanık bir sözden kendi sonucunu çıkarıyor; yorumu değil olguyu anlatmalı (CMK 217).',
              'USUL_BILGISI',
            ),
          ],
          responses: B(`
            P: İtiraz. Tanık duyduğu sözü değil, o sözden çıkardığı sonucu anlatıyor.
            feride: Kabul. Tanık, ne duyduğunuzu söyleyin, ne anladığınızı değil.
          `),
        }),
        presentRule('PS_O2', 'O2', ['clue_envanter', 'ded_laptop_ozan', 'ev_laptop'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_o2'),
            mark(
              'GOOD',
              'Demirbaş listesi: 07 numaralı dizüstü iade edilmedi. “Her şeyi teslim ettim” çöktü.',
              'SORGULAMA',
            ),
          ],
          responses: B(`
            P: Her şeyi mi teslim ettiniz? Protokolün ekindeki demirbaş listesi önümde Sayın Hâkim. Plotter iade, tablet iade, Tarık’ın dizüstüsü ofiste. 07 numara: bir dizüstü ve dok istasyonu, zimmet Ozan Tekin. İade hanesi: boş.
            ozan: O dizüstü bozulmuştu üstat. Ekranı gitmişti, açılmıyordu, hurdaya döndü. Attım. Mali müşavire de söyledim zaten, “gerek yok” dedim.
            P: Attınız. Peki tutanak nerede? Bir demirbaş çöpe atılırken tutanak tutulur, demirbaştan düşülür. Siz “gerek yok” demişsiniz.
            ozan: Küçük bir şeydi. Eski bir laptop. Kim tutanak tutar?
            P: Lazer metreyi iade ederken tutanak tuttunuz. Anahtarları kolilediniz. Ama bir dizüstü “küçük bir şey” oldu.
            feride: Küçük bir şey tutanağa geçmez mi tanık? Hele bir başkasının hesabının açık durduğu bir cihazsa.
            ozan: …
          `),
        }),
        presentRule('PS_O2K', 'O2', ['clue_koli'], {
          enabledWhen: flag('press_o2'),
          score: { SORGULAMA: 150 },
          effects: [
            inc('pers'),
            raise('contra_o2'),
            mark('GOOD', 'Koli listesi: dizüstü hariç her şey iade edilmiş.', 'SORGULAMA'),
          ],
          responses: B(`
            P: Gönderdiğiniz koli. İçinde anahtarlar, cetvel, şarj aleti. Dizüstü yok. Şarj aletini saklamaya değer bulmuşsunuz, dizüstüyü atmışsınız.
            ozan: …Öyle oldu işte.
          `),
        }),
        pressRule('PR_O2', 'O2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o2')],
          responses: B(`
            P: Her şeyi teslim ettiniz. 07 numaralı dizüstü dâhil mi?
            ozan: O bozulmuştu. Onu saymıyorum.
          `),
        }),
        presentRule('PS_O3', 'O3', ['ded_ip_tekin', 'ev_isp'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_o3'),
            mark('GOOD', 'Sağlayıcının yanıtı: tehdit oturumlarının IP adresi Tekin Yapı’nın iş hattı.', 'SORGULAMA'),
          ],
          responses: B(`
            P: Üç tehdit gecesinin üçünde de mesajlar tek bir adresten gönderilmiş: 85.105.44.17. Rastlantı değil, aynı adres, üç kez.
            P: Servis sağlayıcısının mahkemeye yazısı elimde. O adres, o tarihlerde Tekin Yapı Danışmanlık Limited Şirketi’nin iş hattına atanmış. Sizin firmanız Ozan Bey.
            > Ozan’ın gülümsemesi bir an dondu. Elindeki paltoyu dizinde düzeltti, sonra bıraktı; nereye koyacağını bilemedi.
            ozan: O… ortak bir internet herhâlde. Plazada herkes aynı ağı kullanıyor olabilir. Benim özel hattım değil, binanın hattı.
            P: Servis sağlayıcısı aboneyi “bina” diye değil, “Tekin Yapı Danışmanlık” diye bildirmiş. Bir şirket, bir vergi numarası, bir imza. Sizin imzanız.
            ozan: …
            feride: Tanık, soruya cevap verecek misiniz?
            ozan: Bir şey söylemeyeceğim şu an.
          `),
        }),
        pressRule('PR_O3', 'O3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o3')],
          responses: B(`
            P: Tarık’ın hesabına giremeyeceğinizi söylüyorsunuz. Ama ofiste, sizin masanızdaki dizüstüde Tarık’ın hesabı hep açık dururdu, değil mi? Müşterilere oradan yazılırdı.
            ozan: Belki. Hatırlamıyorum. Üç yıl önce, çok şey oldu.
            P: Üç yıl önceyi hatırlamıyorsunuz ama “pişman edeceğim” lafını kelime kelime hatırladınız. Hafızanız seçici galiba.
            ozan: İnsan kötü şeyleri hatırlar.
          `),
        }),
        presentRule('PS_O4', 'O4', ['ev_not', 'clue_dock'], {
          score: { SORGULAMA: 200 },
          effects: [
            inc('pers'),
            raise('contra_o4'),
            mark(
              'GOOD',
              'Yapışkan not ve cihazları kuran kişi: şifre herkesin, en çok da onun bildiği bir şeydi.',
              'SORGULAMA',
            ),
          ],
          responses: B(`
            P: Şifresini bilmeniz mümkün değilmiş. Ofisin bütün cihazlarını kim kurdu Ozan Bey?
            ozan: Ben kurdum. Bilgisayar işlerine ben bakardım.
            P: Klavyenin altındaki yapışkan notu da siz mi yazdınız? “Ece2016!” Ofisin wifi şifresi. Tarık’ın bütün şifreleriyle aynı; banka, e-posta, o hesap.
            ozan: Onu… ben yazmış olabilirim. Herkes kullansın diye, pratik olsun diye.
            P: Pratik. Yani bir adamın bütün kapılarının anahtarını bir kâğıda yazıp herkesin eline verdiniz. En çok da kendi elinize.
            ozan: Öyle demeyin. Ben iyilik olsun diye…
            feride: Tanık, soruya cevapla sınırlı kalın.
          `),
        }),
        pressRule('PR_O4', 'O4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_o4x')],
          responses: B(`
            P: Tarık’ın şifresini bilmeniz mümkün değil. Cihazları kim kurdu peki?
            ozan: Ben. Ama şifreleri o koyardı.
          `),
        }),
        presentRule('PS_O5', 'O5', ['ded_uslup_ozan', 'clue_uslup_ozan'], {
          score: { SORGULAMA: 150 },
          effects: [
            inc('pers'),
            raise('contra_o5'),
            mark('GOOD', 'Tehditlerin dili Tarık’ın değil, tanığın e-postalarındaki dildir.', 'SORGULAMA'),
          ],
          responses: B(`
            P: Bu mesajlar Tarık’ın tarzıymış, öyle dediniz. Oysa Tarık hiç büyük harfle başlamaz, hiç nokta koymaz, hiç “Sn.” demez.
            P: Oysa bu üç tehdit “Sn. Karaca” ile başlıyor, üç noktayla duruyor, “Saygılar.” ile bitiyor. Tıpkı mali müşavire yazdığınız “gerek görmüyorum” e-postası gibi. Gönderen: o.tekin.
            ozan/kizgin: Herkes öyle yazar! Resmî yazışma böyle yazılır! Bu bir kanıt değil!
            P: Haklısınız, tek başına kanıt değil. Ama bir dizüstü, bir hat ve bir imza bir araya gelince, üslup da bir parmak izi olur.
            P: Tarık böyle yazmıyor Ozan Bey. Siz yazıyorsunuz. Herkes gibi değil; sizin gibi.
            ozan: …
          `),
        }),
      ],
      presentMiss: fallback('FB_O_PRESENT', 'PRESENT', {
        effects: [
          ...wrongEvidence,
          score('SORGULAMA', -150, 'hatali'),
          mark('BAD', 'Sunduğun delil tanığın bu ifadesiyle çelişmiyor.', 'SORGULAMA'),
        ],
        responses: B(`ozan: Bunun benimle ne ilgisi var üstat? Anlamadım.`),
      }),
      objectMiss: fallback('FB_O_OBJECT', 'OBJECT', {
        effects: [dec('cred'), score('USUL_BILGISI', -50, 'hatali'), mark('BAD', 'Dayanaksız itiraz.', 'USUL_BILGISI')],
        responses: B(`feride: İtiraz reddedildi.`),
      }),
      finish: {
        id: 'T03T_BITIR',
        label: 'Çapraz sorguyu bitir',
        next: {
          routes: [
            {
              when: {
                cmp: [
                  { add: [oneIf('contra_o2'), oneIf('contra_o3'), oneIf('contra_o4'), oneIf('contra_o5')] },
                  '>=',
                  2,
                ],
              },
              to: 'T_04',
            },
            { to: 'T_05' },
          ],
        },
      },
    }),
    court2.stage('T_04', {
      title: 'CMK 48',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      ...ozanW,
      onFirstEnter: [raise('ozan_kirildi')],
      lines: B(`
        > Savcı yavaşça ayağa kalktı. Ozan’a değil, hâkime baktı. Adil bir savcı, kazanmak için her şeyi yapmayan bir savcı.
        tolga: Sayın Hâkim, tanığa bir hususu hatırlatmanızı rica ediyorum. Sorular, tanığı artık farklı bir konuma getiriyor.
        feride: Tanık Ozan Tekin. Kanunumuz, kendinizi ya da bir yakınınızı ceza kovuşturmasına maruz bırakabilecek sorulara cevap vermekten çekinme hakkı tanır. Bu hakkınızı size hatırlatmakla yükümlüyüm.
        > Ozan uzun bir süre sustu. İlk kez sustu. Gülümsemesi gitmiş, yerine bir çatlak gelmişti; bir mimar bir duvardaki çatlağı tanır.
        > Paltosunu dizinden aldı, kucağına koydu, sonra yeniden dizine serdi. Elleri bir yere karar veremiyordu.
        ozan: O hâlde… bu sorulara cevap vermeyeceğim Sayın Hâkim. Hakkımı kullanıyorum.
        > Salonda bir uğultu yükseldi, kemerlerde dolaştı. Melis katılan sırasında elini ağzına götürdü. Hayri Bey başını salladı, yaşlı bir adamın “demek öyle” deyişiyle.
        > Tarık’ın kurşun kalemi, üç haftadır ilk kez, hiç ses çıkarmadı. Elinde donup kalmıştı. |fx=shake
        feride: Tutanağa geçirin. Tanık, kendisini suçlayabilecek sorulara cevap vermekten çekindi. Bu beyan, susma hakkının kullanımıdır; tek başına bir delil değildir, ama mahkeme takdirini kullanır.
        ~ Bir insan, “yapmadım” demek varken susmayı seçtiyse, o suskunluğun bir ağırlığı vardır. Hukuk onu delil saymaz; ama o salonda herkes aynı şeyi duydu: sessizliği.
      `),
      choices: [
        {
          id: 'T04_DEVAM',
          kind: 'CONTINUE',
          label: 'Devam',
          next: {
            routes: [{ when: all(visited('ARA_MELIS'), not(flag('melis_kapandi'))), to: 'T_04K' }, { to: 'T_05' }],
          },
        },
      ],
    }),

    // --- Katılanın beyanı (ara evresindeki görüşme yapıldıysa) ---
    choiceNode('T_04K', {
      ...C5,
      title: 'Katılanın beyanı',
      background: 'durusma_salonu',
      lines: B(`
        sinan: Sayın Hâkim, müvekkilem kısa bir beyanda bulunmak istiyor.
        feride: Buyurun katılan.
        > Melis ayağa kalktı. Paltosu bu kez omzunda değil, sandalyenin arkasındaydı. Elleri cebinde değil, önünde kenetliydi.
        melis: Üç gece boyunca bana yazan kişiyi şikâyet ettim. Ekranda bir isim vardı; o ismi şikâyet ettim. Başka ne yapabilirdim?
        melis: Bugün o ismin, o mesajları yazan kişi olduğundan emin değilim. Bunu söylemek kolay değil. Ama emin olmadığım bir şeyi de söylemem.
        feride: Katılan, şikâyetinizden vazgeçiyor musunuz?
        melis: Hayır Sayın Hâkim. Şikâyetimi geri almıyorum. Yalnızca doğru kişiye yönelsin istiyorum. Neyse. Bu kadar.
        > Oturdu. Tarık başını kaldırmadı; kurşun kalemi parmaklarının arasında, hareketsiz.
        feride: Müdafi, beyana karşı diyeceğiniz?
      `),
      prompt: { speaker: 'narrator', text: 'Katılanın beyanına ne dersin?' },
      choices: [
        option('T04K_SAYGI', 'Beyan olduğu gibi tutanağa geçsin.', {
          score: { SAVUNMA_STRATEJISI: 60 },
          effects: [inc('pers')],
          good: 'Katılanın acısını tanıyıp beyanı olduğu gibi tutanağa geçirtmek; savunmayı mağdurla değil, gerçek kaynakla karşı karşıya getirir.',
          responses: B(`
            P: Sayın Hâkim, katılanın beyanının olduğu gibi tutanağa geçmesini rica ediyorum. Müvekkilim, onun yaşadıklarını bu dosyanın hiçbir aşamasında küçümsemedi; ben de küçümsemedim.
            P: Biz de aynı şeyi istiyoruz: şikâyetin doğru kişiye yönelmesini. Bu salonda katılanla savunma, bugün ilk kez aynı yöne bakıyor.
            > Melis bana bakmadı; ama başını bir kez, belli belirsiz salladı.
          `),
          next: 'T_05',
        }),
        option('T04K_VAZGEC', 'Bu beyanın şikâyetten vazgeçme olarak değerlendirilmesini talep ediyorum.', {
          score: { USUL_BILGISI: -60 },
          effects: [dec('cred')],
          bad: 'Katılan vazgeçmediğini açıkça söyledi; beyanı çarpıtmak güven kaybettirir. Şantaj (TCK 107) şikâyete bağlı değildir; vazgeçme yalnızca şikâyete bağlı suçta (TCK 134, 139) sonuç doğurur ve açık olmalıdır (TCK 73).',
          responses: B(`
            feride: Katılan “vazgeçmiyorum” dedi müdafi. Onun söylemediği bir şeyi tutanağa yazamam.
            > Sinan kaşlarını kaldırdı. Melis bir an bana baktı; o bakışta yeniden bir duvar örülüyordu.
          `),
          next: 'T_05',
        }),
        option('T04K_OZUR', 'Katılan, müvekkilime yönelttiği suçlama için bugün burada özür dilemelidir.', {
          score: { SAVUNMA_STRATEJISI: -50 },
          bad: 'Katılan elindeki tek isme göre şikâyet etti; ondan özür beklemek, savunmayı mağdurla kavgaya sokar.',
          responses: B(`
            sinan: Müvekkilemden kimse özür beklemesin meslektaşım. Ekranda yazan ismi şikâyet etti; başka bir şey yapmadı.
            feride: Devam ediyoruz.
          `),
          next: 'T_05',
        }),
      ],
    }),

    // --- Savcının karşı delili ---
    court2.objection('T_05', {
      title: 'Savcının karşı delili',
      courtStage: 'DELIL_TARTISMA',
      background: 'durusma_salonu',
      prosecutionEvidence: 'ev_pay',
      say: [
        {
          speaker: 'tolga',
          text: '25 Ekim gecesi sanık katılana “bu şartlarla devam edemeyiz” yazmış; sert, tehditkâr bir üslup. Bu, saikin delilidir.',
        },
        { speaker: 'feride', text: 'Müdafi?' },
      ],
      next: 'T_06',
      options: [
        option('T05_A', '25 Ekim mesajları öfkeli ama tehdit değil; dili de cihazı da başka.', {
          effects: [
            raise('pay_cevap'),
            ifThen(
              any(has('clue_uslup_tarik'), has('ded_uslup'), has('ded_uslup_ozan')),
              [
                score('HUKUKI_BILGI', 120, 'itiraz'),
                inc('pers'),
                mark(
                  'GOOD',
                  'Ticari bir tartışmadaki sert söz, şantaj unsuru taşımaz; dahası 25 Ekim mesajları “cihaz 0”dan, Tarık’ın kendi diliyle: tehditlerse “cihaz 3”ten, başka bir dille.',
                  'HUKUKI_BILGI',
                ),
              ],
              [
                score('HUKUKI_BILGI', 60, 'itiraz'),
                mark(
                  'GOOD',
                  'Sert bir ticari tartışma, kişinin bir şey elde etmek için yaptığı tehdit (şantaj) değildir.',
                  'HUKUKI_BILGI',
                ),
              ],
            ),
          ],
          responses: B(`
            P: 25 Ekim mesajları ortada Sayın Hâkim, inkâr etmiyoruz. “Bu şartlarla devam edemeyiz melis.” Sert, öfkeli, evet. Ama bir ortaklık tartışmasının öfkesi bu; bir pay kavgası.
            P: Şantaj, bir yarar sağlamak için yapılan tehdittir. Burada “çekil yoksa sırrını yayarım” yok; “bu oranla olmaz” var. İkisi hukuken bambaşka şeyler.
            P: Dahası, Sayın Hâkim: 25 Ekim mesajları cihaz 0’dan, müvekkilimin kendi telefonundan, onun diliyle; küçük harf, noktasız. Üç tehdit ise cihaz 3’ten, bambaşka bir dille. Saik varsa bile, eli tutan aynı el değil.
            P: Savcılığın saik dediği şey, aslında savunmanın en güçlü deliline dönüşüyor: iki ayrı el, iki ayrı cihaz, iki ayrı insan.
          `),
        }),
        option('T05_B', '25 Ekim mesajlarını da müvekkilim yazmadı; aynı hesaptan aynı kişi göndermiş olabilir.', {
          effects: [score('SAVUNMA_STRATEJISI', -80, 'savunma'), dec('cred')],
          bad: '25 Ekim mesajları gerçek ve cihaz 0’dan gönderildi; bunu inkâr etmek müvekkilin inandırıcılığını yok eder. Doğru olan, o mesajları sahiplenip tehditlerden ayırmaktır.',
          responses: B(`
            tolga: Sayın Hâkim, bu mesajlar da mı sahte? Her şey mi sahte?
            feride: Müdafi, Ek-3’te bu mesajlar sanığın kendi cihazından görünüyor. Dikkatli olun.
          `),
        }),
        option('T05_C', 'Saik tek başına delil değildir; bu konuda ayrıca diyeceğimiz yok.', {
          neutral: 'Savcının saik anlatımı yanıtsız kaldı.',
        }),
      ],
    }),

    // --- Mütalaa ---
    court2.objection('T_06', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('bilirkisi_cihaz'),
          `
          feride: Cumhuriyet savcısı esas hakkındaki mütalaasını versin.
          tolga: Sayın Hâkim. Bir savcının görevi mahkûmiyet almak değil, adaleti sağlamaktır. Bugün dinlediklerimden sonra mütalaamı değiştiriyorum.
          tolga: Mesajların sanığın telefonundan gönderildiği iddiası teknik olarak doğrulanmadı. Aksine, hesaba bağlı başka bir cihazdan, başka bir internet hattından gönderildiği anlaşıldı. 9 Kasım gecesi sanığın telefonu kilitliydi.
          tolga: Bu tabloda, sanık hakkında şüpheden uzak bir mahkûmiyet oluşmamıştır. Dahası, dosyada gerçek failin izleri belirmiştir.
          tolga: Hesabı ele geçiren kişi yönünden ayrıca soruşturulması için suç duyurusunda bulunulmasını talep ederim.
          > Savcının bu sözleri salonda bir dalga gibi yayıldı. Tarık bana döndü; gözleri yaşlıydı, ama ilk kez korkudan değil.
          feride: Müdafi, mütalaaya karşı diyecekleriniz?
        `,
        ),
        W(
          flag('contra_o3'),
          `
          feride: Cumhuriyet savcısı esas hakkındaki mütalaasını versin.
          tolga: Sayın Hâkim. Tanık beyanları ve gelen belgeler, mesajların kaynağı konusunda ciddi tereddütler doğurdu. Mahkûmiyet için gereken kesinlik oluşmadı.
          tolga: Takdiri mahkemeye bırakıyorum; ayrıca gerçek failin tespiti için soruşturma genişletilmelidir.
          feride: Müdafi?
        `,
        ),
        O(`
          feride: Cumhuriyet savcısı esas hakkındaki mütalaasını versin.
          tolga: Sayın Hâkim. Mesajlar sanığa ait hesapta, sanığın telefonunda tespit edilmiştir. Sanığın 107/2 ve 134/2’den cezalandırılmasını talep ederim.
          feride: Müdafi, mütalaaya karşı diyecekleriniz?
        `),
      ],
      next: 'T_07',
      options: [
        option('T06_A', 'Ekran görüntüleri hukuka aykırı, kaynak başka cihaz: delil yetersiz.', {
          score: { USUL_BILGISI: 100 },
          effects: [
            inc('legal_hits'),
            mark(
              'GOOD',
              'Cevap hakkı yerinde kullanıldı: hukuka aykırı delil hükme esas alınamaz (CMK 217/2), kalan deliller mahkûmiyete yetmez.',
              'USUL_BILGISI',
            ),
          ],
          responses: [
            W(
              flag('bilirkisi_cihaz'),
              `
              P: Sayın Savcının mütalaasına katılıyorum Sayın Hâkim; cesareti için de teşekkür ederim. Bir savcının görüşünü delil karşısında değiştirmesi, bu salonun en güzel anıdır.
              P: Ekran görüntüleri hukuka aykırı elde edildiği için hükme esas alınamaz. Mesajların telefondan çıkmadığı bilirkişi raporuyla sabittir. Geriye bir insanı mahkûm etmeye yetecek hiçbir şey kalmıyor.
            `,
            ),
            O(`
              P: Sayın Hâkim, mütalaaya katılmıyoruz. Ekran görüntüleri hukuka aykırı elde edildi; hükme esas alınamaz.
              P: Geriye kalan, bir hesabın bir telefonda açık durmasıdır. Mesajların o telefondan, o elle gönderildiği gösterilmedi. Bu, bir mahkûmiyeti taşımaz.
            `),
          ],
        }),
        option('T06_B', 'Mütalaa ortada; takdiri mahkemeye bırakıyoruz.', { neutral: 'Cevap hakkı kullanılmadı.' }),
        option('T06_C', 'Mütalaa delil değerlendirmesi içerdiğinden tutanaktan çıkarılmasını talep ediyoruz.', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Mütalaa tutanağın bir parçasıdır; çıkarılması istenemez. Cevap hakkı kullanılır (CMK 216/2).',
          responses: B(`feride: Mütalaa tutanaktan çıkarılmaz müdafi. Cevabınız varsa dinlerim.`),
        }),
      ],
    }),
    decisionNode('T_07', [{ to: 'T_08P' }], {
      ...C5,
      lines: B(`feride: Müdafi, esas hakkındaki savunmanıza geçelim.`),
    }),

    // --- Dayanaklar ---
    choiceNode('T_08P', {
      ...C5,
      title: 'Dayanaklar',
      hud: ['noktalar', 'pers'],
      background: 'durusma_salonu',
      prompt: {
        speaker: 'narrator',
        text: 'Esas savunmadan önce üç dayanağını seç. Her biri savunmanı güçlendirir; dayanaksız savunma havada kalır.',
      },
      choices: [
        option('NK_SS', 'Ekran görüntüleri hukuka aykırı; hükme esas alınamaz', {
          cost: [{ var: 'noktalar', amount: 1 }],
          enabledWhen: flag('ss_excluded'),
          lockedReason: 'Önce ekran görüntülerini düşürmelisin.',
          score: { USUL_BILGISI: 40 },
          good: 'Anayasa 38/6, CMK 206/2-a, 217/2.',
          next: '$stay',
        }),
        option('NK_CIHAZ', 'Tehditler telefondan değil, hesaba bağlı bir masaüstü oturumundan gönderildi', {
          cost: [{ var: 'noktalar', amount: 1 }],
          enabledWhen: any(flag('contra_s3'), flag('bilirkisi_cihaz'), has('ded_bagli')),
          lockedReason: 'Önce mesajların kaynağını göstermelisin.',
          score: { DELIL_ANALIZI: 40 },
          good: 'Ek-3’teki cihaz sütunu ve hesap verisi.',
          next: '$stay',
        }),
        option('NK_HASTANE', '9 Kasım gecesi telefon kilitliydi; müvekkil acil serviste', {
          cost: [{ var: 'noktalar', amount: 1 }],
          enabledWhen: any(flag('bilirkisi_kilit'), flag('kilit_mahkemede'), has('ded_hastane')),
          lockedReason: 'Önce hastane mazeretini kurmalısın.',
          score: { DELIL_ANALIZI: 30 },
          good: 'Kilit kayıtları ve onam formu.',
          next: '$stay',
        }),
        option('NK_IP', 'Tehdit oturumlarının adresi Tekin Yapı’nın iş hattı; 07 ofise dönmedi', {
          cost: [{ var: 'noktalar', amount: 1 }],
          enabledWhen: any(flag('contra_o3'), has('ded_ip_tekin'), has('ded_laptop_ozan')),
          lockedReason: 'Önce dizüstü ve hattı göstermelisin.',
          score: { DELIL_ANALIZI: 40 },
          good: 'Sağlayıcının yanıtı ve demirbaş listesi.',
          next: '$stay',
        }),
        option('NK_USLUP', 'Mesajların üslubu Tarık’a ait değil; “Sn.”, “Saygılar.”', {
          cost: [{ var: 'noktalar', amount: 1 }],
          enabledWhen: any(has('ded_uslup'), has('ded_uslup_ozan'), flag('fact_melis_sn')),
          lockedReason: 'Önce üslup farkını göstermelisin.',
          score: { DELIL_ANALIZI: 20 },
          good: 'Üslup tek başına ispat değildir, ama diğer delillerle birleşir.',
          next: '$stay',
        }),
        option('NK_IFTIRA', 'Mesajları Melis kendisi yazdı', {
          cost: [{ var: 'noktalar', amount: 1 }],
          score: { SAVUNMA_STRATEJISI: -60 },
          effects: [dec('pers'), raise('iftira_savunma')],
          bad: 'Dayanaksız bir iftira; heyet nezdinde bütün savunmayı zayıflatır.',
          responses: B(`~ Bunu dayanak diye seçtim. Tarık’ın teorisi. En zayıf teori.`),
          next: '$stay',
        }),
        {
          id: 'NK_VER',
          kind: 'CONTINUE',
          label: 'Savunmaya geç',
          role: 'PRIMARY',
          next: 'T_08',
        },
      ],
    }),
    choiceNode('T_08', {
      ...C5,
      title: 'Esas hakkında savunma',
      background: 'durusma_salonu',
      prompt: { speaker: 'feride', text: 'Müdafi, esas hakkındaki savunmanızı yapın.' },
      next: 'T_09',
      choices: [
        option('T08_A', 'Mesajları başkası yazdı: beraat (CMK 223/2-b) ve suç duyurusu', {
          effects: [
            ifThen(
              all(flag('contra_o3'), any(flag('ozan_kirildi'), flag('contra_o2')), flag('suc_duyurusu')),
              [
                score('SAVUNMA_STRATEJISI', strategyAmount(220, 'MASUMIYET'), 'savunma'),
                inc('pers'),
                raise('gercek_fail'),
                mark(
                  'GOOD',
                  'Gerçek failin cihazı, hattı ve kimliği delillerle ortaya kondu; mesajların sanık tarafından gönderilmediği sabit.',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
              [
                score('SAVUNMA_STRATEJISI', -100, 'savunma'),
                dec('pers'),
                mark(
                  'BAD',
                  'Gerçek fail iddiası için delil zinciri tamamlanmadı (hat, dizüstü ve suç duyurusu birlikte gerekir).',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
            ),
          ],
          responses: [
            W(
              all(flag('contra_o3'), flag('suc_duyurusu')),
              `
              P: Sayın Hâkim. Mesajlar müvekkilimin telefonundan çıkmadı. Hesaba Şubat’ta bağlanmış, hiç kapatılmamış bir masaüstü oturumundan çıktı: OFIS-LAPTOP-07.
              P: O dizüstü eski ortağın zimmetindeydi, iade edilmedi. Tehdit oturumlarının adresi onun firmasının hattı. Tehditlerin dili onun diliydi. Bugün o soruları yanıtlamayı reddetti.
              P: Müvekkilim o mesajları yazmadı. Kim yazdığı artık bir sır değil; dosyadadır. Beraatini ve gerçek fail yönünden suç duyurusunu talep ediyorum.
              > Salon sessizdi. Tarık’ın kızına vereceği cevabı ben vermiştim.
            `,
            ),
            O(`
              P: Sayın Hâkim, mesajları başkası yazdı; gerçek fail ortada.
              feride: “Ortada” diyorsunuz ama dosyada tamamlanmış bir zincir göremiyorum müdafi. Hat, cihaz, kimlik: hangisi kesin?
              ~ Zinciri tamamlayamadım. En güçlü kartı, en zayıf elle oynadım.
            `),
          ],
        }),
        option('T08_B', 'Suçun sanık tarafından işlendiği sabit değil: şüpheden beraat (CMK 223/2-e)', {
          effects: [
            ifThen(
              { ref: 'kaynak_suphesi' },
              [
                score('SAVUNMA_STRATEJISI', strategyAmount(200, 'USUL'), 'savunma'),
                inc('pers'),
                raise('supheden'),
                mark(
                  'GOOD',
                  'Mesajların telefondan çıkmadığı ve delil zincirindeki boşluklar: sanığın fail olduğu kuşkulu; şüpheden sanık yararlanır.',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
              [
                score('SAVUNMA_STRATEJISI', -80, 'savunma'),
                mark(
                  'BAD',
                  'Şüphe savunması için en az mesajların kaynağına dair bir bulgu ortaya konmalıydı.',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
            ),
          ],
          responses: [
            W(
              { ref: 'kaynak_suphesi' },
              `
              P: Sayın Hâkim. İddianamenin tek dayanağı, mesajların sanığın telefonunda, onun hesabında bulunmasıydı. Bugün ikisi de sarsıldı.
              P: Bilirkişi, mesajların telefondan değil, hesaba bağlı başka bir cihazdan çıktığını söyledi. 9 Kasım gecesi telefon kilitliydi; sanık acil servisteydi.
              P: Ekran görüntüleri ise hukuka aykırı elde edilmiş, hükümden dışlanmıştır.
              P: Geriye kalan nedir? Bir hesabın, bir ekranda açık durması. Bu, bir insanı mahkûm etmeye yetmez. Ceza hukukunun temel ilkesi açıktır: mahkûmiyet, ihtimale değil, kesinliğe dayanır.
              P: Her türlü şüpheden uzak, kesin ve inandırıcı bir delil yoktur. Şüpheden sanık yararlanır. Müvekkilimin beraatini talep ediyorum Sayın Hâkim.
            `,
            ),
            O(`
              P: Sayın Hâkim, suçun müvekkilim tarafından işlendiği kesin değil; şüpheden yararlanmalı.
              feride: Hangi şüphe müdafi? Somut bir bulgu gösterin.
              ~ Şüphe için bile bir dayanak gerekiyor. Onu da koyamadım.
            `),
          ],
        }),
        option('T08_C', 'Terditli: öncelikle beraat; aksi hâlde 134’ten beraat, lehe hükümler', {
          effects: [
            score('SAVUNMA_STRATEJISI', strategyAmount(150, 'INDIRIM'), 'savunma'),
            raise('terditli'),
            mark(
              'GOOD',
              'Terditli savunma meşrudur; hiç değilse ifşa suçunun unsurlarını tartışır (134: kaydın bizzat sanıkça ifşası ispatlanmalı).',
              'SAVUNMA_STRATEJISI',
            ),
          ],
          responses: B(`
            P: Öncelikle beraatini talep ediyorum Sayın Hâkim. Kabul görmezse: ses kaydının müvekkilim tarafından iletildiği ispatlanamamıştır; 134’ten beraat gerekir.
            P: Her hâlükârda, lehe olan hükümlerin ve takdiri indirimin uygulanmasını talep ederim.
          `),
        }),
        option('T08_D', 'Müvekkilim pişman; cezada indirim ve hükmün açıklanmasının geri bırakılmasını istiyoruz', {
          effects: [score('SAVUNMA_STRATEJISI', -120, 'savunma'), dec('pers'), dec('trust', 10)],
          bad: '“Yapmadım” diyen bir müvekkil için pişmanlık savunması tezi çökertir; HAGB için de kasıtlı suçtan hükmolunan cezanın iki yıl veya altı olması gerekir (CMK 231/5), ifşa suçu bunu aşabilir.',
          category: 'SAVUNMA_STRATEJISI',
          responses: B(`
            tarik/kizgin: Sayın Hâkim, ben pişman değilim, çünkü bir şey yapmadım! Avukatım…
            > Tarık ayağa kalkmıştı. Hâkim elini kaldırdı. Oturdu. Bana bakmadı.
          `),
        }),
      ],
    }),
    choiceNode('T_09', {
      ...C5,
      title: 'Son söz',
      background: 'durusma_salonu',
      prompt: { speaker: 'feride', text: 'Sanık, son sözünüz?' },
      next: 'T_10',
      choices: [
        option('T09_A', '“Ben yazmadım. Kızıma gerçeği söylemek istiyorum.”', {
          score: { SAVUNMA_STRATEJISI: 25 },
          good: 'Kısa, onurlu, savunmayla tutarlı bir son söz.',
          responses: B(`
            > Tarık ayağa kalktı. Kurşun kalemini masaya bıraktı; ilk kez elinde değildi. Sesi titremiyordu ama yavaştı.
            tarik: Ben o mesajları yazmadım Sayın Hâkim. Üç yıl önce bir arkadaşıma bütün kapılarımın anahtarını verdim; dostluk sandım, aptallıkmış. Bedelini ödüyorum.
            tarik: Ben bir mimarım. Binalar yaparım; yüz yıl ayakta dursunlar diye. Ama kendi hayatımı tek bir çürük temelin üstüne kurmuşum: tek bir şifre, herkese açık.
            tarik: Kızım bana “Baban yalan söyler mi?” diye sordu. Dokuz yaşında. Buradan çıkınca ona gerçeği söyleyebilmek istiyorum; “kanıtlayamadılar” değil, “yapmadı” diyebilmek istiyorum. Hepsi bu. Takdir sizin.
            > Oturdu. Arka sırada, bir an için, Melis’in de başını öne eğdiğini gördüm.
          `),
        }),
        option('T09_B', '“Ozan Tekin’den davacıyım! Bunu hepinizin önünde söylüyorum!”', {
          score: { SAVUNMA_STRATEJISI: -25 },
          effects: [dec('pers')],
          bad: 'Son söz bir öfke anı değildir; suç duyurusu dilekçeyle yapılır. Öfkeli bir çıkış heyette olumsuz izlenim bırakır.',
          responses: B(`
            tarik/kizgin: Ozan! Kardeşim dediğim adam! Senden davacıyım!
            feride: Sanık! Son sözünüz savunmanızdır, bir hesaplaşma değil. Oturun.
          `),
        }),
        option('T09_C', '“Söyleyecek bir şeyim yok.”', {
          neutral:
            'Suskunluk bir haktır; ama tutarlı bir savunmanın ardından bir cümle, heyetin vicdanına dokunabilirdi.',
          responses: B(`tarik: Söyleyecek bir şeyim yok Sayın Hâkim. Her şeyi avukatım söyledi.`),
        }),
      ],
    }),
    decisionNode('T_10', [{ to: 'R_KARAR' }], {
      ...CV,
      background: 'durusma_salonu',
      lines: B(`
        feride: Taraflara son diyecekleri soruldu. Karar için duruşmaya kısa bir ara veriyorum.
        > On dakika. Adliye koridorunda on dakika, bir ömür kadar uzun. Tarık pencereye yaslandı, aşağıda Setbaşı’nın çatılarına baktı. Kurşun kalemini çıkardı, bir kez tıkırdattı, sonra cebine koydu.
        tarik: Ece bugün okulda. Çıkışta onu alacağım. Ne diyeceğimi, buradan çıkınca öğreneceğim.
        > Sinan koridorun öbür ucunda Melis’le alçak sesle konuşuyordu. Melis bir ara bana baktı; kin yoktu bakışında, yorgunluk vardı.
        > Zil çaldı. Salon doldu. Herkes ayağa kalktı; hüküm fıkrası ayakta dinlenir.
        feride: Mahkememiz, Türk Milleti adına aşağıdaki hükmü vermiştir.
      `),
    }),
    court2.stage('T_COKUS', {
      title: 'Çöküş',
      courtStage: 'SON_SOZ',
      background: 'durusma_salonu',
      lines: B(`
        > Hâkim bana baktı. Uzun uzun. Kalemini bıraktı.
        feride: Müdafi. Bu salonda bugün savunmanın güvenilirliği kalmadı. Yanlış delil, dayanaksız suçlama, art arda.
        feride: Sanığa son sözünü soruyorum.
        tarik/uzgun: Ben… yazmadım Sayın Hâkim. Başka ne diyeceğimi bilmiyorum.
      `),
      choices: [cont('COKUS_SON', 'Hükmü bekle', 'T_10')],
    }),
    resultNode('R_KARAR', { ...CV, title: 'Karar Açıklandı', background: 'durusma_salonu' }),
  ],
  triggers: [
    {
      id: 'tg_cokus',
      priority: 0,
      once: true,
      when: all(flag('in_court'), cmp(v('cred'), '<=', 0)),
      effects: [raise('cokus')],
      goto: 'T_COKUS',
    },
  ],
};

function oneIf(f: string) {
  return { if: { when: flag(f), then: 1, else: 0 } };
}

export const _t = [not, has, W, O, strategyAmount];
