import {
  all,
  any,
  cmp,
  cont,
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
  ref,
  resultNode,
  score,
  statement,
  story,
  strategyAmount,
  v,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, Cond } from '../../../tools/content/src/kit/index.js';
import { B, O, T, W } from './dsl.js';
import { savcilikRule } from './hearing-1.js';
import { H2, court2, wrongMove } from './shared.js';

// 68-trial-2: 2. celse. Koridor, açılış; ATK bilirkişisi (B1–B4), vardiya şefi yeniden (K5–K8; CMK 48), büfe ve eş
// tanıklığı (etik dalı), ek savunma (CMK 226), mütalaa ve cevap, esas savunma, son söz, hüküm; çöküş kesintisi.
// Karar olgulara bakar (70-outcomes): esas savunmanın adı skoru, iknayı ve kapanış metnini değiştirir, beraati değil.

const GERCEK_FAIL: Cond = all(
  flag('suc_duyurusu'),
  flag('contra_k5'),
  any(flag('contra_k6'), flag('contra_k7')),
  ref('donus_yok'),
  ref('olum_sonra'),
);
const SUPHE: Cond = all(ref('donus_yok'), ref('olum_sonra'));

const presentMiss = (id: string) =>
  fallback(id, 'PRESENT', {
    effects: [
      ...wrongMove,
      score('SORGULAMA', -150, 'hatali'),
      mark('BAD', 'Yanlış delil: ifadeyle ilgisi yok.', 'SORGULAMA'),
    ],
    responses: B(`
baskan: Müdafi, bu belgenin beyanla ilgisini heyet göremedi. Devam edin.
~ Bir saniyelik sessizlik. Bir heyetin sabrı da bir kaynaktır; harcadım.
`),
  });
const objectMiss = (id: string) =>
  fallback(id, 'OBJECT', {
    effects: [dec('cred'), score('USUL_BILGISI', -50, 'hatali'), mark('BAD', 'Dayanaksız itiraz.', 'USUL_BILGISI')],
    responses: B(`baskan: İtiraz yerinde görülmedi.`),
  });

export const trial: CasePart = {
  court: {
    sessions: [
      {
        id: 'cs_2',
        title: '2. Celse',
        stages: [
          { id: 's2_acilis', type: 'ACILIS', entryNode: 'T_00' },
          { id: 's2_tanik', type: 'TANIK_DINLEME', entryNode: 'T_01' },
          { id: 's2_ek', type: 'EK_SAVUNMA', entryNode: 'T_04' },
          { id: 's2_mutalaa', type: 'MUTALAA', entryNode: 'T_05' },
          { id: 's2_savunma', type: 'SAVUNMA', entryNode: 'T_06' },
          { id: 's2_son_soz', type: 'SON_SOZ', entryNode: 'T_07' },
          { id: 's2_karar', type: 'KARAR', entryNode: 'T_08' },
        ],
      },
    ],
  },
  nodes: [
    decisionNode('T_00G', [{ to: 'T_00' }], {
      ...H2,
      title: 'Adliye koridoru',
      onEnter: [raise('in_court')],
      lines: [
        W(
          all(flag('suc_duyurusu'), flag('savci_asil')),
          `
# PAZARTESİ 09.10 — BURSA ADLİYESİ, 6. AĞIR CEZA KORİDORU [bg:adliye]
> Koridorda, pencerenin önünde Amir Aydemir. Yakılmamış sigarası elinde. Beni görünce başını çok hafifçe salladı ve başka yöne baktı.
> Kalem amirinin masasında, tutanakla bıraktığım zarfın üstünde savcılığın kaşesi vardı: “Soruşturma dosyasına eklendi.”
> Sevim Yavuz bu kez Gülay’ın oturduğu banka oturmuştu. Aralarında bir kişilik boşluk. Konuşmuyorlardı; ama ikisi de aynı kapıya bakıyordu.
`,
        ),
        W(
          flag('suc_duyurusu'),
          `
# PAZARTESİ 09.10 — BURSA ADLİYESİ, 6. AĞIR CEZA KORİDORU [bg:adliye]
> Koridorda, pencerenin önünde Amir Aydemir. Yakılmamış sigarası elinde. Beni görünce başını çok hafifçe salladı ve başka yöne baktı.
> Sevim Yavuz bu kez Gülay’ın oturduğu banka oturmuştu. Aralarında bir kişilik boşluk. Konuşmuyorlardı; ama ikisi de aynı kapıya bakıyordu.
`,
        ),
        W(
          flag('released'),
          `
# PAZARTESİ 09.10 — BURSA ADLİYESİ, 6. AĞIR CEZA KORİDORU [bg:adliye]
> Tarık bu kez jandarmasız geldi. Ütülü bir gömlek, Gülay’ın diktiği. Koridorda duvara yaslanmış, ellerini nereye koyacağını bilmiyordu.
> Sevim Yavuz onu gördü. Uzun uzun baktı. Sonra başını çevirdi; bu kez öfkeyle değil.
`,
        ),
        O(`
# PAZARTESİ 09.10 — BURSA ADLİYESİ, 6. AĞIR CEZA KORİDORU [bg:adliye]
> Gülay bankta, Elif’in resim defteri kucağında. Sevim Yavuz koridorun öbür ucunda. İkisinin arasında bir kapı ve üç hafta.

`),
      ],
    }),
    court2.stage('T_00', {
      title: 'Duruşma · 2. Celse',
      courtStage: 'ACILIS',
      background: 'durusma_salonu',
      onFirstEnter: [meet('karaca')],
      lines: B(`
mubasir: Bursa Altıncı Ağır Ceza! Tarık Demirel dosyası! Taraflar, bilirkişi, tanıklar… salona!
baskan: Yoklama yapıldı. Ara karar cevapları okundu: Adli Tıp Kurumu’nun nihai raporu ve kurumların cevapları dosyaya girdi.
baskan: Raporu düzenleyen uzman Doç. Dr. Selma Karaca hazır. Dinleyeceğiz.
savci: Sayın Başkan, kurumların cevaplarını inceledik. Esasa ilişkin görüşümüzü mütalaada bildireceğiz.
> Savcının sesi ilk celsedekinden daha yavaştı. Dosyasının sekmeleri de değişmişti; yeni renkler, yeni sayfalar.
> Kırklarının ortasında, sade, gözlüklü bir kadın kürsüye geçti. Elinde rapor, raporun içinde renkli sekmeler.
~ Bir bilirkişi “olabilir” der. Bir avukatın işi, “olabilir”in yanına “ama” koydurabilmektir. Kâğıtla.
> Tarık sanık sırasında, ellerini dizlerine koymuş, kürsüye bakıyordu. Bu kez ellerini saklamıyordu.
> Yanına eğildim. “Bugün senin konuşman gerekmiyor” dedim. “Kâğıtlar konuşacak. Sen yalnızca son sözde.”
tarik: Kâğıtlar ne diyecek abla?
- Ne olduysa onu. Ne olmadıysa onu.
> Başını salladı. Galeriye döndü; Gülay ona belli belirsiz bir el işareti yaptı. Sevim ikisini de görmezden geldi; gözleri kürsüdeki rapordaydı.
`),
      choices: [cont('T00_DEVAM', 'Bilirkişi dinlensin', 'T_01')],
    }),
    court2.testimony('T_01', {
      title: 'Bilirkişi',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'karaca',
      witnessLabel: 'BİLİRKİŞİ · DOÇ. DR. SELMA KARACA',
      rulesText: 'İpucu: bilirkişiyi zorlama; “olabilir” ile “uyumlu” arasındaki farkı kâğıtla göster.',
      objectionGrounds: ['g_kanaat', 'g_telkin'],
      say: T(`
karaca: Ölüm sebebi, oksipital bölgede 3,2 santimetre çaplı dairesel çökme kırığı ve altındaki kanamadır. Burun ve dudaktaki lezyonlar basit tıbbi müdahaleyle giderilebilir niteliktedir.
savci: Hocam, kırık bir düşmeyle oluşabilir mi?
karaca: Oluşabilir. Ölüm zamanı da 23.00 ile 01.00 arasındadır.
> Savcı oturdu. Bir “oluşabilir” almıştı; ona yetiyordu.
baskan: Müdafi, sorularınız.
`),
      statements: [
        statement('B1', 1, [
          'Kırık, başın ',
          hl('sert bir yüzeye çarpmasıyla da oluşabilir', any(flag('press_b1'), has('ded_darbe'))),
          '.',
        ]),
        statement('B2', 2, [
          'Ölüm ',
          hl('23.00 ile 01.00 arasında', any(flag('press_b2'), has('ded_saat'), has('ded_canli'))),
          '; daha dar bir aralık veremem.',
        ]),
        statement('B3', 3, [
          'Yara, ',
          hl('dosyadaki kilit gibi sert bir cisimle', any(flag('press_b3'), has('ded_silah'))),
          ' oluşmuş olabilir.',
        ]),
        statement(
          'B4',
          4,
          [
            'Ölçüye bakarsak, ',
            hl('kalın konili, eski tip bir kilit', has('clue_tarik_koni')),
            ' bu yarayla uyumlu olur.',
          ],
          flag('press_b3'),
        ),
      ],
      rules: [
        savcilikRule('PS_SAV_B', 'bilirkişinin'),
        pressRule('PR_B1', 'B1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b1')],
          responses: B(`
- Hocam, “oluşabilir” mi, “uyumludur” mu?
karaca: Düşmeyle oluşması mümkündür. Uyumlu demedim. Raporda da “düşme ile uyumlu” ifadesi yoktur.
`),
        }),
        presentRule('PS_B1', 'B1', ['ded_darbe'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_b1')],
          good: 'Küçük dairesel çökme ve karşı darbe lezyonunun yokluğu: düşme değil, sabit başa hareketli cisimle darbe; bilirkişi raporunu daralttı.',
          category: 'SORGULAMA',
          responses: B(`
- Hocam, kırık 3,2 santim, dairesel, kenarları keskin. Ön raporun dipnotunda frontalde karşı darbe lezyonu saptanmadığı yazıyor. Bir düşmede bu tablo beklenir mi?
> Karaca raporunu açtı, bir sayfayı çevirdi, gözlüğünü düzeltti.
karaca: Beklenmez. Hareketli başın sabit zemine çarptığı düşmelerde karşı kutupta da lezyon görürüz; burada yok. Kırığın şekli de geniş bir zemini değil, sınırlı yüzeyli bir cismi düşündürür.
karaca: Düzeltiyorum: tablo, sabit duran başa hareketli bir cisimle vurulmasıyla daha uyumludur.
uye: Hocam, “daha uyumlu” mu, yoksa düşme dışlanıyor mu?
karaca: Tıpta kesinlik nadirdir, Sayın Üye. Ama bu tabloyu bir düşmeyle açıklamam için karşı darbe lezyonu görmem gerekirdi. Görmüyorum.
baskan: Tutanağa geçsin.
> Savcı kalemini bıraktı. Bir “oluşabilir” kaybetmişti.
`),
        }),
        presentRule('PS_B1_ATK', 'B1', ['ev_atk'], {
          score: { SORGULAMA: 100 },
          effects: [inc('pers')],
          neutral:
            'Kısmi isabet: raporun kendisi “sınırlı yüzeyli cisim” diyor; ama karşı darbe bulgusunu göstermeden bilirkişi düşmeyi dışlamadı.',
          responses: B(`
- Raporunuz “sınırlı yüzeyli cisim” diyor.
karaca: Diyor. Ama bir düşmede de sınırlı bir çıkıntıya çarpılabilir. Dışlamıyorum.
`),
        }),
        pressRule('PR_B2', 'B2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b2')],
          responses: B(`
- Mide içeriği raporda var. Ölüm zamanı için kullandınız mı?
karaca: Mide içeriği tarif edildi; son öğünün zamanı bilinmediği için yorumlanmadı.
- Son öğünün zamanı bilinseydi?
karaca: O zaman yorumlardım. Sindirim kişiden kişiye değişir; ama sıralama değişmez. Önce yemek, sonra ölüm.
~ “Bilinmediği için.” Kimse sormadığı için.
`),
        }),
        presentRule('PS_B2', 'B2', ['ded_saat', 'ded_canli'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_b2')],
          good: 'Son öğün (23.34) ve son telefon görüşmesi (23.41) ölüm zamanını sanığın limandan çıkışından (23.18) sonraya taşıdı.',
          category: 'SORGULAMA',
          responses: [
            W(
              has('ded_saat'),
              `
- Hocam, kantin kaydı: maktul 23.34’te tost ve ayran almış. Midede yarı sindirilmiş ekmek, peynir ve süt ürünü var.
karaca: Bu bilgi bana verilmedi. Verilseydi… Midede tanınabilir, yarı sindirilmiş içerik varsa ölüm son öğünden kısa süre sonradır; yarım saat ila bir buçuk saat.
karaca: Son öğün 23.34 ise, ölüm 23.34’ten sonradır. Büyük olasılıkla gece yarısından önce.
uye: Hocam, sanığın 23.18’de limandan çıktığı kayıtlı. Ölüm o saatte gerçekleşmiş olabilir mi?
karaca: Mide içeriğine göre, hayır. 23.34’ten önce değil.
`,
            ),
            O(`
- Hocam, telefon tutanağı: maktul 23.41’de iki dakika yedi saniye bir görüşme yapmış. Sanık 23.18’de limandan çıkmış.
karaca: Konuşabilen bir insan o anda ölümcül kafa travması geçirmemiştir. Bu travmayla bilinç hızla kaybolur.
karaca: Kırık, 23.41’den sonra oluşmuştur.
`),
          ],
        }),
        presentRule('PS_B2_KANTIN', 'B2', ['ev_kantin', 'ev_telefon'], {
          score: { SORGULAMA: 100 },
          effects: [inc('pers')],
          neutral:
            'Kısmi isabet: kantin kaydı maktulün yaşadığını gösterdi; mide içeriğiyle bağlanmadan saat daralmadı.',
          responses: B(`
- Maktul 23.34’te kantindeymiş.
karaca: O saatte yaşıyormuş. Ölüm aralığım yine 23.00–01.00; ama alt sınır 23.34’e çekilebilir.
`),
        }),
        pressRule('PR_B3', 'B3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_b3')],
          responses: [
            W(
              has('clue_tarik_koni'),
              `
- Hocam, dosyadaki kilidin hangi yüzü bu yarayı açabilir?
karaca: Koni kısmı. Ama kırığın çapı 3,2; dosyadaki kilidin konisini ölçmedim, bana ölçü verilmedi.
- Eski tip, manuel kilitlerin konisi kaç santim, biliyor musunuz?
karaca: Bilmiyorum. Ama bana ölçü getirirseniz söylerim: kırık, üç santimden kalın, konik bir uçla uyumlu.
`,
            ),
            O(`
- Hocam, dosyadaki kilidin hangi yüzü bu yarayı açabilir?
karaca: Koni kısmı. Ama kırığın çapı 3,2; kilidin konisini ölçmedim, bana ölçü verilmedi.
`),
          ],
        }),
        presentRule('PS_B3', 'B3', ['ded_silah'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_b3')],
          good: 'Emanetteki SA-2 kilidinin konisi 2,6 cm; kırık 3,2 cm. Savcılığın aleti yarayla uyumlu değil.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, emanet fotoğrafı: dosyadaki kilidin konisi cetvelle 2,6 santim. Kırık 3,2.
karaca: Daha küçük bir koni daha büyük bir çökme açmaz. Kenarlar keskin; aletin profili kırıkta okunuyor.
karaca: Dosyadaki kilit bu yarayı açmış olamaz.
savci: Hocam, kilit yarayı açmasa bile maktulün yere düşerken bir başka çıkıntıya çarpması?
karaca: Sınırlı yüzeyli bir çıkıntı olabilir, evet. Ama o zaman karşı tarafta da lezyon beklerim, Sayın Savcı. Az önce söyledim.
> Mübaşir poşetteki sarı kilidi kürsüden kaldırıp masaya geri götürdü. Savcı ona bakmadı.
`),
        }),
        objectRule('OB_B1', 'B1', 'g_telkin', {
          score: { USUL_BILGISI: 50 },
          effects: [
            inc('pers'),
            inc('legal_hits'),
            mark(
              'GOOD',
              'Savcının “düşmeyle oluşabilir mi” sorusu cevabı telkin ediyordu; itiraz yerinde (CMK 201/1).',
              'USUL_BILGISI',
            ),
          ],
          responses: B(`
- İtiraz, Sayın Başkan. Savcının sorusu cevabı içinde taşıyordu. Bilirkişiye “kırık nasıl oluşmuştur” diye sorulmalı.
baskan: Yerinde. Hocam, kırığın oluş biçimini kendi ifadenizle anlatın.
karaca: Sınırlı yüzeyli, sert bir cisimle. Düşme ihtimalini dışlamıyorum; ama birinci ihtimal o değil.
`),
        }),
      ],
      presentMiss: presentMiss('FB_T01_PRESENT'),
      objectMiss: objectMiss('FB_T01_OBJECT'),
      finish: { id: 'T01_BITIR', next: 'T_01K' },
    }),
    decisionNode('T_01K', [{ to: 'T_02' }], {
      ...court2.base,
      title: 'Bilirkişi',
      lines: [
        W(
          ref('olum_sonra'),
          `
> Karaca raporunu kapattı. Kürsüden inerken bir an bana baktı; ne onay ne kınama. Bir meslektaşın bakışı.
savci: Hocam, son bir soru. Darbe sanığın limandan çıkışından sonra geldiyse, sanığın başka bir yoldan dönmüş olması tıbben dışlanabilir mi?
karaca: O tıbbi bir soru değil, Sayın Savcı. Ben size kırığın ne zaman ve neyle oluştuğunu söylerim. Kimin vurduğunu söyleyemem; söylememeliyim de.
baskan: Turnike ve araç kapısı dökümü dosyada, okundu. Hocam, teşekkür ederiz.
~ Darbe, düşme değil. Saat, kavgadan sonra. Bir uzman bunları kendi ağzıyla söyledi. Şimdi ikinci soru: kim?
> Savcı kısa bir not aldı; sonra kalemini yavaşça masaya bıraktı. Gülay galeride Sevim’e baktı. Sevim bu kez başını çevirmedi.
`,
        ),
        O(`
> Karaca kürsüden indi. Raporunda bir şey değişmedi. Savcı bir “oluşabilir”le salondan çıkacaktı.
~ Bir uzmanı yanlış sorularla bıraktım. Doğru soruların cevapları elimdeydi; ya da elimde olmalıydı.
`),
      ],
    }),
    court2.testimony('T_02', {
      title: 'Vardiya şefi · yeniden',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'kenan',
      witnessLabel: 'TANIK · KENAN AKSOY',
      rulesText: 'İpucu: tanık kendisini suçlayacak sorulara cevap vermeyebilir. Üstüne gitme; kâğıdı göster.',
      objectionGrounds: ['g_kanaat', 'g_telkin'],
      say: [
        ...T(`
mubasir: Tanık Kenan Aksooy!
> Kenan bu kez yanında bir avukatla geldi. Lacivert takım, bu kez kravatlı. Tarık’ın yanından geçerken omzuna dokunmadı.
baskan: Tanık, önceki yemininiz geçerli. Size hatırlatırım: kendinizi ya da yakınlarınızı suçlayacak sorulara cevap vermeyebilirsiniz.
kenan: Biliyorum efendim. Söyleyeceğim bir şey yok aslında. Geçen sefer yanıldım, onu söyledim.
> Avukatı yanına oturdu, önüne bir dosya açtı. Kenan bez parçasını cebinden çıkarmadı; ellerini kürsünün kenarına koydu.
> Galeride Sevim Yavuz doğruldu. Bu kez sanık sırasına değil, kürsüye bakıyordu.
~ Bir tanık avukatıyla geliyorsa, bir şey biliyordur; ya da bir şey bildiğinden korkuyordur. İkisinin farkı kâğıttadır, yüzde değil.
`),
      ],
      statements: [
        statement('K5', 1, [
          'O gece ',
          hl('kamyonete binmedim; ofisteydim', any(flag('press_k5'), has('ded_arac'), has('ev_gps'))),
          '.',
        ]),
        statement('K6', 2, [
          hl('Ercan beni o gece aramadı', any(flag('press_k6'), has('ev_abone'), has('ded_motif'))),
          '. Ne konuşacaktık?',
        ]),
        statement('K7', 3, [
          'Servis kitlerinde ',
          hl('eksik yok, hepsi sayılı', any(flag('press_k7'), has('ded_eksik'), has('clue_envanter'))),
          '.',
        ]),
        statement(
          'K8',
          4,
          ['Bu dosyada herkes biliyor ', hl('kimin yaptığını'), '. Ben babalık yaptım, o kadar.'],
          flag('press_k5'),
        ),
      ],
      rules: [
        savcilikRule('PS_SAV_K2', 'tanığın'),
        pressRule('PR_K5', 'K5', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k5')],
          responses: B(`
- Servis kamyoneti o gece kimdeydi?
kenan: Kimde olacak, ofisin önünde. Anahtarı panoda. Herkes alır.
- Zimmet defteri tutulur mu, Kenan Bey?
kenan: Tutulur. Kâğıt işte. Kim imzalarsa imzalar; gece kimin eli boşsa o kullanır.
- O gece kimin imzası vardı?
> Kenan avukatına baktı. Avukat başını hafifçe iki yana salladı.
kenan: Hatırlamıyorum. Yirmi yıldır her gece bir imza atıyorum.
`),
        }),
        presentRule('PS_K5', 'K5', ['ded_arac', 'ev_gps'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_k5')],
          good: 'Zimmet ve araç takip kaydı: tanığın zimmetindeki kamyonet ölüm saatinde B sahasında on dört dakika durdu.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, işletmenin zimmet defteri: 16 LMN 07, 14 Kasım 22.00, teslim alan K. Aksoy. Araç takip kaydı: 23.52’den 00.06’ya kadar B sahası, üçüncü sıra, motor çalışır.
- Ceset B sahasının üçüncü sırasında bulundu.
> Kenan’ın avukatı eğilip bir şey fısıldadı. Kenan başını salladı.
kenan: Bu soruya cevap vermeyeceğim efendim.
baskan: Tutanağa geçsin: tanık, kendisini suçlayabilecek soruya cevap vermeyeceğini bildirdi.
uye: Tanık, ilk celsede “sabaha kadar ofisteydim” demiştiniz. Bu beyanınızın arkasında mısınız?
kenan: … Ona da cevap vermeyeceğim efendim.
> Salonda bir uğultu. Sevim Yavuz galeride ayağa kalktı, sonra yavaşça oturdu.
`),
        }),
        pressRule('PR_K6', 'K6', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k6')],
          responses: B(`
- Ercan size hiç telefon etmez miydi?
kenan: Ederdi. Sarhoşken herkesi arardı. O gece etmedi.
- Telefonunuz o gece neredeydi?
kenan: Ofiste. Şarjda. Geçen sefer de söyledim.
- Geçen sefer telefonunuzdan hiç söz etmediniz, Kenan Bey.
> Kenan bir an sustu. Bez parçası cebindeydi; eli cebine gitti, boş çıktı.
kenan: Etmişimdir. Etmediysem de şimdi ediyorum.
`),
        }),
        presentRule('PS_K6', 'K6', ['ev_abone', 'ded_motif', 'ev_defter'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_k6')],
          good: '23.41’deki iki dakikalık görüşmenin muhatabı tanıktı; tanığın bunu iki kez gizlediği ortaya kondu.',
          category: 'SORGULAMA',
          responses: [
            W(
              has('ded_motif'),
              `
- Sayın Başkan, maktulün defteri, 13 Kasım: “K. bana 3 kutu borçlu. Ya öder ya anlatırım.” Ertesi gece 23.41’de maktul, rehberinde “Kptn” diye kayıtlı hattı aradı. O hattın abonesi tanık.
kenan: Ben… bu soruya da cevap vermeyeceğim.
> Savcı Bora Kılınç ilk kez dosyasını değil tanığı izliyordu. Bir şey not aldı; altını iki kez çizdi.
> Galeride Sevim Yavuz’un dudakları kıpırdadı. “Kaptan.” Sesi çıkmadı; ama kürsüdeki adam başını o yöne çevirdi, sonra hemen geri.
~ Bir lakap. Bir dulun ağzında, bir tanığın kulağında. Bir mahkeme salonunda bazı kelimeler tutanağa geçmeden de duyulur.
`,
            ),
            O(`
- Sayın Başkan, BTK cevabı: maktulün 23.41’de aradığı hat tanık adına kayıtlı. Görüşme iki dakika yedi saniye.
kenan: Hatırlamıyorum. Belki açtım, belki açmadım. Bu soruya cevap vermeyeceğim.
`),
          ],
        }),
        pressRule('PR_K7', 'K7', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_k7')],
          responses: B(`
- Kitlerde hangi tip kilit var?
kenan: Eski tipler. Acil durum için. Altı tane. Sayılıdır.
- Kim sayar?
kenan: Ben sayarım. Sabah teslimde. Eksik olursa yazarım.
- 15 Kasım sabahı saydınız mı?
kenan: Her sabah sayarım avukat hanım.
~ Her sabah. Bir sabah, bir satır, bir mürekkep. Sayan da yazan da aynı el.
`),
        }),
        presentRule('PS_K7', 'K7', ['ded_eksik', 'clue_envanter'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_k7')],
          good: 'Kamyonetin kitindeki eski tip kilitlerden biri ölümün ertesi sabahı “kayıp” yazılmıştı; yarayla uyumlu alet o kitteydi.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, kamyonetin kit envanteri: altı eski tip manuel kilit, mevcut beş. El yazısıyla: “15/11 kayıp.” Bilirkişi, kırığın kalın konili, eski tip bir kilitle uyumlu olduğunu söyledi.
kenan: Kilit kaybolur efendim. Limanda her gün bir şey kaybolur.
uye: Ölümün ertesi sabahı mı?
kenan: … Cevap vermeyeceğim.
`),
        }),
        pressRule('PR_K8', 'K8', {
          score: { SORGULAMA: 25 },
          responses: B(`
- Babalık ettiniz. Tarık’a o gece “eve git evlat” dediniz. Sonra ne yaptınız?
kenan: Ofise döndüm. Defter yazdım. Bir tur attım; geçen sefer anlattım.
- Turu yürüyerek mi attınız, araçla mı?
kenan: …
> Kenan’ın avukatı ayağa kalktı.
@TANIĞIN AVUKATI: Sayın Başkan, müvekkilim bu yöndeki sorulara CMK 48 kapsamında cevap vermeyecektir.
baskan: Tutanağa geçsin. Müdafi, devam edin.
`),
        }),
        objectRule('OB_K8', 'K8', 'g_kanaat', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('pers'),
            inc('legal_hits'),
            mark('GOOD', 'Tanık bir kez daha görgüsünü değil, sanık hakkındaki kanaatini aktarıyordu.', 'SORGULAMA'),
          ],
          responses: B(`
- İtiraz, Sayın Başkan. Tanık “herkes biliyor” diyerek kanaat aktarıyor.
baskan: Yerinde. Tutanağa geçmeyecek.
`),
        }),
      ],
      presentMiss: presentMiss('FB_T02_PRESENT'),
      objectMiss: objectMiss('FB_T02_OBJECT'),
      finish: { id: 'T02_BITIR', next: 'T_02K' },
    }),
    decisionNode('T_02K', [{ when: flag('etik_gulay'), to: 'T_03E' }, { to: 'T_03P' }], {
      ...court2.base,
      title: 'Vardiya şefi',
      lines: [
        W(
          all(flag('suc_duyurusu'), flag('contra_k5')),
          `
savci: Sayın Başkan, bir açıklama yapmak istiyorum. Müdafiin suç duyurusu üzerine Başsavcılığımızca tanık Kenan Aksoy hakkında soruşturma başlatılmıştır. Servis aracının kitine el konulmuştur.
savci: Tanığın bu davadaki beyanlarının değerlendirilmesini takdirinize bırakıyorum.
> Kenan avukatının koluna dokundu. Kürsüden indi. Kapıya kadar kimseye bakmadı; kapıda durdu, Tarık’a döndü, bir şey söyleyecek gibi oldu. Söylemedi.
> Sevim Yavuz galeride ellerini yüzüne kapadı.
~ Kürsüden bir adam indi. Bir babacan ses, bir bez parçası, bir “evlat.” Kimse bir şey söylemedi; salon zaten söylemişti.
`,
        ),
        W(
          any(flag('contra_k5'), flag('contra_k6'), flag('contra_k7')),
          `
> Kenan kürsüden indi. Avukatı onu kapıya kadar götürdü. Salonda kimse bir şey söylemedi.
> Sevim Yavuz galeride, kocasının amirinin arkasından baktı. Dudakları kıpırdadı; bir şey söyledi, kimse duymadı.
> Savcı Bora Kılınç dosyasında bir sayfayı çevirdi, sonra bir daha. Bir şey arıyordu; aradığı artık dosyada değildi.
~ Susan bir tanık. Susmak bir hak; ama bir heyetin önünde susmak da bir şey söyler.
> Üye hâkim Alkan başkana doğru eğildi, bir şey fısıldadı. Başkan başını salladı ve kâtibe bir not yazdırdı.
baskan: Tanığın beyanları ve cevap vermekten kaçındığı sorular tutanağa geçmiştir. Heyet bunları değerlendirecektir.
~ Bir kâtip bir not yazdı. Bir dosyada bir satır. Bazen bir dava o satırda biter; bazen başka bir dava o satırda başlar.
`,
        ),
        O(`
> Kenan kürsüden indi; bu kez Tarık’a bakmadan. Savcı rahatlamış gibiydi.
~ Elimdeki kâğıtlar yetmedi. Ya da onları hiç bulamadım.
`),
      ],
    }),
    story('T_03E', {
      ...court2.base,
      title: 'Sanığın eşi',
      background: 'durusma_salonu',
      onFirstEnter: [inc('ethics')],
      lines: B(`
mubasir: Tanık Gülay Demireel!
baskan: Sanığın eşisiniz. Tanıklıktan çekinebilirsiniz; anlatmak isterseniz yeminsiz dinlenmeyi de isteyebilirsiniz. Anlatmak istiyor musunuz?
gulay: Anlatacağım efendim.
gulay: Kocam o gece on bir buçukta eve geldi efendim. On bir buçuk.
savci: Tanık, kendi banka hesabınızın dökümü: 23.37’de eşinizin kartıyla iskele büfesine ödeme var. On bir buçukta evde olan biri yedi dakika sonra iskelede çay mı içti?
> Gülay bana baktı. Salonun ortasında, herkesin önünde. Bir an, sonra bir an daha.
gulay/uzgun: Avukat hanım… “öyle deyin” dedi. Kimse bilmez dedi.
> Salon dondu. Başkan kalemini bıraktı. Savcı bana döndü; ilk kez dosyasına değil, bana.
baskan: Tutanağa geçsin. Tanığın beyanı ve müdafie ilişkin iddia hakkında suç duyurusunda bulunulmak üzere tutanak örneğinin Başsavcılığa gönderilmesine. Baroya bildirilmesine.
~ Bir saati sildim, demiştim. Saat geri geldi; benim adımla.
`),
      choices: [cont('T03E_DEVAM', 'Kürsüde kalan sessizlik', 'T_08')],
    }),
    decisionNode('T_03P', [{ to: 'T_03' }], {
      ...court2.base,
      title: 'Büfe',
      onFirstEnter: [meet('nail')],
      lines: [
        W(
          has('clue_nail'),
          `
mubasir: Tanık Nail… Usta! Nail Kocaman!
> Nail Usta kasketini çıkardı, avucunda tuttu. Kürsüye tutunmadı; kırk yıl tezgâha tutunmuş eller kürsüye tutunmaz.
baskan: Tanık, sanıkla akrabalığınız var mı? … Yok. Yemin edeceksiniz; bildiğinizi, gördüğünüzü söyleyeceksiniz.
nail: Efendim, o gece bu çocuk büfeme geldi. İki çay aldı, kartla. Oturdu, ağladı. Elinde bir peçete vardı, kanlı.
nail: “Bir adama vurdum usta” dedi. “Ağabeyime laf etti.” Başka bir şey demedi. Ben de sormadım; sorsaydım keşke.
`,
        ),
        O(`
mubasir: Tanık Nail Kocaman!
> Mahkeme banka kaydı üzerine iskele büfesinin sahibini resen çağırmıştı. Nail Usta kasketini avucunda tuttu, salona bir yabancı gibi baktı.
baskan: Tanık, sanıkla akrabalığınız var mı? … Yok. Yemin edeceksiniz; bildiğinizi söyleyeceksiniz.
nail: Bir çocuk geldi efendim, kartla iki çay aldı. Oturdu. Elinde peçete vardı. Gerisini… o kadar iyi hatırlamıyorum.
`),
      ],
    }),
    court2.testimony('T_03', {
      title: 'Büfe',
      courtStage: 'TANIK_DINLEME',
      background: 'durusma_salonu',
      witness: 'nail',
      witnessLabel: 'TANIK · NAİL KOCAMAN',
      rulesText: 'İpucu: dürüst bir tanığı yalancı çıkarma. Saati ona kâğıt söylesin; radyo söylesin.',
      objectionGrounds: ['g_kanaat', 'g_telkin'],
      say: T(`
savci: Tanık, çocuk ne zaman kalktı? Gece yarısına kadar oturduğundan emin değilsiniz, değil mi? Belki on ikiye çeyrek kala kalkmıştır?
nail: Olabilir efendim… Yaşlıyım. Saate bakmam. Olabilir.
> Savcı oturdu. On beş dakika: iskeleden limana yirmi dakikalık yolu yürümeye yetmezdi; ama bir heyetin aklına bir soru koymaya yeterdi.
baskan: Müdafi, sorularınız.
~ Nail Usta yalan söylemiyor. Yalnızca birinin verdiği saati tekrarlıyor. Benim işim, ona kendi saatini hatırlatmak. Kâğıtla.
`),
      statements: [
        statement('N1', 1, [
          'Çocuk büfeye ',
          hl('on bire doğru, belki daha erken', any(flag('press_n1'), has('ev_hesap'))),
          ' geldi. İki çay aldı.',
        ]),
        statement('N2', 2, [
          'Ne zaman kalktığını bilmem; ',
          hl('on ikiye çeyrek kala kalkmış olabilir', any(flag('press_n2'), has('ded_buf'), has('clue_radyo'))),
          '.',
        ]),
        statement('N3', 3, [
          'Elinde kanlı bir peçete vardı. ',
          hl('“Bir adama vurdum” dedi', flag('press_n3')),
          ', o kadar.',
        ]),
        statement(
          'N4',
          4,
          ['Polis büfeye hiç gelmedi. ', hl('Kimse bana bir şey sormadı'), '; sorsalar söylerdim.'],
          flag('press_n2'),
        ),
      ],
      rules: [
        savcilikRule('PS_SAV_N', 'tanığın'),
        pressRule('PR_N1', 'N1', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_n1')],
          responses: B(`
- Usta, çayları nasıl ödedi?
nail: Kartla. Ben nakit severim ama gençler hep kart. Makineyi o gece iki kere çalıştırdım zaten; biri onunkiydi.
~ Makine. Bir makine saat tutar; usta tutmaz.
`),
        }),
        presentRule('PS_N1', 'N1', ['ev_hesap', 'ded_cikis'], {
          score: { SORGULAMA: 200 },
          effects: [inc('pers'), raise('contra_n1')],
          good: 'Banka kaydı (23.37) tanığın belirsiz saatini kendi büfesinin makinesiyle sabitledi; dürüst tanığı yalancı çıkarmadan düzelttin.',
          category: 'SORGULAMA',
          responses: B(`
- Sayın Başkan, sanığın hesap dökümü: 14 Kasım, 23.37, İskele Büfe Mudanya, iki çay. Kart sanığın.
nail: Demek on biri yarım geçiyordu. Makine benden iyi bilir efendim. On bire doğru değilmiş; ben yanlış söyledim.
uye: Tanık, 23.37’de sanık büfenizde miydi?
nail: Kart oradaysa çocuk da oradaydı efendim. Kartını kimseye vermez o; ağabeyinden kalma bir alışkanlık.
`),
        }),
        pressRule('PR_N2', 'N2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_n2')],
          responses: [
            W(
              has('clue_nail'),
              `
- Usta, büfede radyo açık mıydı o gece?
nail: Açıktı. Hep açıktır. Kırk yıldır aynı istasyon. Gece haberlerini dinlemeden kepenk indirmem.
~ Bir radyo. Bir jenerik. Bir saat.
`,
            ),
            O(`
- Usta, büfede radyo açık mıydı o gece?
nail: Açıktı herhalde. Hep açıktır. Ama ne çalıyordu, şimdi hatırlamam.
`),
          ],
        }),
        presentRule('PS_N2', 'N2', ['ded_buf', 'clue_radyo'], {
          score: { SORGULAMA: 300 },
          effects: [inc('pers', 2), raise('contra_n2')],
          good: 'Radyonun gece yarısı haberleri tanığın kendi saatini geri getirdi: sanık 00.00’a kadar iskelede. Savcının verdiği “on ikiye çeyrek kala” düştü.',
          category: 'SORGULAMA',
          responses: B(`
- Usta, büfede beni ağırladığınız gün bir şey söylemiştiniz: çocuk ne zaman kalktı?
nail: Haberler başlayınca. Jenerik çaldı, çocuk peçeteyi cebine koydu, kalktı. “Sağ ol usta” dedi.
- Gece haberleri saat kaçta başlar?
nail: On ikide efendim. Kırk yıldır on ikide. Radyom yalan söylemez; ben yaşlıyım, o değil.
> Savcı kalemini masaya bıraktı. On beş dakikası radyonun jeneriğinde kaybolmuştu.
baskan: Tutanağa geçsin: tanık, sanığın gece haberlerinin başlamasıyla, saat on ikide büfeden kalktığını beyan etti.
`),
        }),
        pressRule('PR_N3', 'N3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_n3')],
          responses: B(`
- Başka ne söyledi, usta?
nail: “Ağabeyime laf etti” dedi. Sonra bir şey demedi. Ağladı. Bir saat ağladı. Erkek adam ağlar mı demeyin; ben o çocuğun ağabeyini de tanırdım.
nail: Emre de buraya gelirdi. Çayını şekersiz içerdi. Konteynerin altında kaldığı sabah kepengi açmadım.
~ Bir tanığın ağzından bir tahrik. Kimse istemeden; bir peçete ve bir ağabey.
`),
        }),
        pressRule('PR_N4', 'N4', {
          score: { SORGULAMA: 25 },
          responses: B(`
- Kolluk sizden hiç ifade almadı mı, usta?
nail: Almadı efendim. Büfe limanın yirmi dakika ötesinde; kimse yürümemiş. Bir avukat hanım geldi, bir de siz soruyorsunuz. Aynı avukat hanım.
> Galeride biri güldü; kısa, sinirli bir gülüş. Başkan başını kaldırınca sustu.
~ Üç ay. Bir büfe, bir radyo, bir peçete. Yirmi dakikalık bir yürüyüş.
`),
        }),
        objectRule('OB_N2', 'N2', 'g_telkin', {
          score: { USUL_BILGISI: 50 },
          effects: [
            inc('pers'),
            inc('legal_hits'),
            mark(
              'GOOD',
              'Saat tanığın görgüsü değil, savcının sorusuydu; telkin edici soruya dayanan beyan için itiraz yerinde (CMK 201/1).',
              'USUL_BILGISI',
            ),
          ],
          responses: B(`
- Sayın Başkan, bu saat tanığın değil, savcının sorusundan geliyor. Tanık “saate bakmam” dedi; saati soru verdi.
baskan: Yerinde. Tanık, size bir saat söylenmeden hatırladığınızı anlatın.
nail: Bir saat söylemem efendim. Ama çocuk oturdu. Uzun oturdu. Ben kepenk indirirken o da kalktı.
`),
        }),
      ],
      presentMiss: presentMiss('FB_T03_PRESENT'),
      objectMiss: objectMiss('FB_T03_OBJECT'),
      finish: { id: 'T03_BITIR', next: 'T_03K' },
    }),
    decisionNode('T_03K', [{ to: 'T_03G' }], {
      ...court2.base,
      title: 'Büfe',
      lines: [
        W(
          flag('contra_n2'),
          `
> Nail Usta kürsüden indi. Sanık sırasının önünden geçerken durdu, Tarık’ın omzuna elini koydu; bir an, bir babanın eli gibi.
> Jandarma bir adım attı; başkan eliyle durdurdu.
~ Bir dürüst tanık, kendi radyosuyla. Savcının on beş dakikası bir jenerikte kayboldu.
`,
        ),
        W(
          flag('contra_n1'),
          `
> Nail Usta kasketini başına geçirdi, kürsüden indi. Banka kaydı saatini sabitlemişti; ne zaman kalktığı ise salonda bir soru olarak kaldı.
~ Bir saat buldum, bir saat bıraktım. 23.37 kâğıtta; gece yarısı ise yalnızca ustanın aklında.
`,
        ),
        O(`
> Nail Usta kürsüden indi. Savcının verdiği saat tutanağa “olabilir” diye geçmişti.
~ Bir tanığa kendi saatini hatırlatamadım. “Olabilir” bir ceza dosyasında en ağır kelimelerden biri.
`),
      ],
    }),
    story('T_03G', {
      ...court2.base,
      title: 'Büfe ve ev',
      background: 'durusma_salonu',
      lines: [
        W(
          flag('gulay_durust'),
          `
mubasir: Tanık Gülay Demireel!
baskan: Sanığın eşisiniz. Tanıklıktan çekinebilirsiniz; anlatmak isterseniz yeminsiz dinlenmeyi de isteyebilirsiniz. Anlatmak istiyor musunuz?
> Gülay galeriye, Elif’in resim defterine baktı. Sonra başkana.
gulay: Anlatacağım efendim. Yeminle.
gulay: Kocam o gece on ikiyi on geçe eve geldi efendim. Elif’in şurubunu on ikide verdim, sonra saate baktım.
gulay: Eli şişmişti. Ağlamıştı. On yıldır ağladığını görmedim. Bir şey demedi, yattı.
savci: Geç gelmesini neden kolluğa söylemediniz?
gulay: Kimse sormadı efendim. Sorsalar söylerdim. Bugün soruldu; söylüyorum.
savci: Eşiniz eve geldiğinde üstünde kan var mıydı?
gulay: Elinde bir peçete vardı. Kanlıydı. Burnundan değil; elinden. Boğumları açılmıştı. Yıkadım. Başka kan yoktu efendim; ben o gömleği yıkadım, bilirim.
> Savcı not aldı; altını çizmedi.
~ Bir saat, iki tanık, bir banka kaydı. Gülay yalan söyleyebilirdi; söylemedi. Bu salonda en ağır doğruyu o taşıdı.
`,
        ),
        O(`
mubasir: Tanık Gülay Demireel!
baskan: Sanığın eşisiniz. Tanıklıktan çekinebilirsiniz; anlatmak isterseniz yeminsiz dinlenmeyi de isteyebilirsiniz. Anlatmak istiyor musunuz?
> Gülay bir an sustu. Sonra tanık olarak dinlenmek istemediğini söyledi; sanığın eşi olarak tanıklıktan çekinme hakkını kullandı. Başkan tutanağa geçirdi.
~ Çekinme bir hak. Bir saati ondan başka da söyleyen var; bir banka, bir büfeci.
`),
      ],
      choices: [cont('T03G_DEVAM', 'Ek savunma', 'T_04')],
    }),
    court2.objection('T_04', {
      title: 'Ek savunma',
      courtStage: 'EK_SAVUNMA',
      background: 'durusma_salonu',
      say: T(`
baskan: Sanık ve müdafii, dikkat edin. Yapılan yargılama sonucunda, eylemin kasten yaralama sonucu ölüme sebebiyet verme suçunu oluşturabileceği değerlendirilmektedir. Ek savunmanız?
~ Bir kapı açıldı. Savcının yedeği masaya kondu. Şimdi söyleyeceğim şey, terazinin hangi kefesinde durduğumu gösterecek.
> Tarık bana döndü. Fısıldadı: “Abla, bu ne demek?” “Senin yumruğunla onun ölümü arasında bir bağ var mı diye soruyorlar” dedim. “Ben de yok diyeceğim.”
`),
      next: 'T_05',
      options: [
        option('T04_C', 'Yaralama sonucu ölümü kabul ediyoruz; haksız tahrik indirimi isteriz', {
          effects: [raise('kabul87'), dec('pers'), score('SAVUNMA_STRATEJISI', -60)],
          bad: 'Ölümle yumruk arasındaki illiyeti kendin kabul ettin; beraat ihtimalini ek savunmada bıraktın. Terditli savunma ancak “öncelikle beraat” ile kurulur.',
          responses: B(`
> Tarık bana döndü. Gözlerinde bir soru: “Ben öldürdüm mü yani?”
~ Ona cevap veremedim. Az önce mahkemeye verdiğim cevap onun cevabıydı.
`),
        }),
        option('T04_A', 'Ölüm yumruktan doğmadı; ne öldürme ne yaralama sonucu ölüm oluşur', {
          effects: [
            ifThen(
              ref('olum_sonra'),
              [
                score('SAVUNMA_STRATEJISI', 120),
                inc('pers'),
                inc('legal_hits'),
                mark(
                  'GOOD',
                  'Ölümle yumruk arasında illiyet bağı yok: TCK 87/4 de oluşmaz (TCK 23). Ek savunma hakkını yerinde kullandın (CMK 226).',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
              [
                score('SAVUNMA_STRATEJISI', -40),
                mark(
                  'BAD',
                  'İlliyet bağının yokluğunu iddia ettin ama ölüm saatini ve darbe şeklini kanıtlamadın.',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
            ),
          ],
          responses: B(`
- Sayın Başkan, ek savunmamız şudur: yumruk maktulün burnunu kanattı; ölüm o yumruktan gelmedi. Darbe, sanığın limandan çıkmasından sonra ve başka bir cisimle vuruldu.
- Yaralama sonucu ölümden sorumluluk için ölümün o yaralamadan doğması gerekir. Burada doğmamıştır.
> Savcı başını kaldırdı, bir şey söyleyecek gibi oldu, sonra notlarına döndü. Üye hâkim Alkan bir sayfayı işaretledi.
baskan: Ek savunma tutanağa geçti. Sanık, katılıyor musunuz?
tarik: Katılıyorum efendim. Ben bir kere vurdum. Sonrasını ben yapmadım.
uye: Müdafi, sanığın yumruğunun maktulün düşmesine yol açtığını kabul ediyor musunuz?
- Yumruğu kabul ediyoruz, Sayın Üye. Maktul babanın dibine oturdu, kalktı, yürüdü. Ölümcül kırık o oturuştan değil.
> Üye hâkim başını salladı; bir sayfayı daha işaretledi.
`),
        }),
        option('T04_B', 'Nitelik değişti; ek savunmaya hazırlanmak için süre isteriz', {
          neutral:
            'Süre istemek bir haktır (CMK 226/3); ama hazırlığın zaten yapılmıştı, ertelemek bir şey kazandırmadı.',
          responses: B(`
baskan: Ek savunma için süre talebi. … Sanık ve müdafi hazırlıklı görünüyor; kısa bir ara verelim. On beş dakika.
`),
        }),
      ],
    }),
    court2.objection('T_05', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      background: 'durusma_salonu',
      lines: [
        W(
          GERCEK_FAIL,
          `
savci: Sayın Başkan, yargılama sonunda: maktulün ölümüne yol açan darbenin sanığın limandan ayrılmasından sonra vurulduğu, sanığın olay yerine dönmediği anlaşılmıştır.
savci: Sanığın atılı kasten öldürme suçunu işlediği sabit olmadığından beraatine; kavga sırasındaki yumruk eylemi basit yaralama niteliğinde olup şikâyet bulunmadığından bu yönden düşme kararı verilmesini talep ederim.
savci: Başka bir kişi hakkındaki soruşturma Başsavcılığımızca yürütülmektedir.
baskan: Müdafi, mütalaaya karşı diyeceğiniz?
`,
        ),
        W(
          all(ref('donus_yok'), ref('olum_sonra')),
          `
savci: Sayın Başkan, sanığın geri döndüğüne dair teşhis güvenilirliğini yitirmiştir. Bilirkişi beyanını da dinledik; kayıt altındadır.
savci: Ancak sanık maktulü darp etmiş, maktul aynı gece ölmüştür. İddia makamı, bir yumruğun bir ölümle bağını takdirinize sunmakla yükümlüdür.
savci: Sanığın yaralama kastıyla hareket ettiği ve ölüm neticesinden sorumlu olduğu kanaatiyle eylemin TCK 87/4 kapsamında değerlendirilmesini, haksız tahrik hükümlerinin takdirini talep ederim.
baskan: Müdafi, mütalaaya karşı diyeceğiniz?
`,
        ),
        W(
          all(ref('donus_yok'), flag('kabul87')),
          `
savci: Sayın Başkan, teşhis zayıflamıştır. Müdafi de ek savunmasında eylemin yaralama sonucu ölüm kapsamında kaldığını kabul etmiştir.
savci: Sanığın yumruğu maktulü yere düşürmüş, kafatası kırığı bu düşmeyle oluşmuştur. TCK 87/4 uyarınca cezalandırılmasını talep ederim.
> Savcı bunu söylerken bana bakmadı. Bakmasına gerek yoktu; cümlenin yarısını ben kurmuştum.
baskan: Müdafi, mütalaaya karşı diyeceğiniz?
`,
        ),
        W(
          ref('donus_yok'),
          `
savci: Sayın Başkan, teşhis zayıflamıştır; ancak sanığın yumruğu maktulü yere düşürmüş, kafatası kırığı bu düşmeyle oluşmuştur.
savci: Sanığın yaralama kastıyla ölüme sebebiyet verdiği sabittir; TCK 87/4 uyarınca cezalandırılmasını talep ederim.
baskan: Müdafi, mütalaaya karşı diyeceğiniz?
`,
        ),
        O(`
savci: Sayın Başkan, sanık maktulü tehdit etmiş, darp etmiş, yarım saat sonra olay yerine dönmüştür. Öldürme kastı doğrudan olmasa bile, başın arkasına sert cisimle vurulan bir darbede ölüm öngörülmüştür.
savci: Sanığın TCK 81/1 ve 21/2 uyarınca cezalandırılmasını talep ederim.
baskan: Müdafi, mütalaaya karşı diyeceğiniz?
`),
      ],
      next: 'T_06',
      options: [
        option('T05_A', 'Kısa cevap: sanık dönmedi; bunu kanaat değil kayıtlar söylüyor', {
          effects: [
            ifThen(
              ref('donus_yok'),
              [
                score('USUL_BILGISI', 80),
                inc('legal_hits'),
                mark('GOOD', 'Mütalaaya cevap hakkını kayıtlara dayanarak kullandın (CMK 216/2).', 'USUL_BILGISI'),
              ],
              [score('USUL_BILGISI', 20)],
            ),
          ],
          responses: [
            W(
              ref('olum_sonra'),
              `
- Sayın Başkan, kısaca: sanık 23.18’de limandan çıktı ve geri dönmedi. Bunu turnike söylüyor, banka söylüyor, bir büfecinin radyosu söylüyor.
- Savcılık yaralama sonucu ölüm diyor. Bunun için ölümün o yaralamadan doğması gerekir. Bilirkişi bu salonda ölümcül darbenin düşme olmadığını söyledi.
- Bunlar kanaat değil, kayıttır.
> Savcı itiraz etmedi. Kalemiyle mütalaa metninin bir satırının altını çizdi; sonra çizgiyi kendisi karaladı.
`,
            ),
            O(`
- Sayın Başkan, kısaca: sanık 23.18’de limandan çıktı ve geri dönmedi. Bunlar kanaat değil, kayıttır.
`),
          ],
        }),
        option('T05_B', 'Ayrıca cevap vermeyelim; bütün cevabı esas savunmada toplarız', {
          neutral: 'Mütalaaya ayrıca cevap vermedin; hakkın kaybolmadı ama kayıtları savcının sözünün hemen ardına koyma fırsatı geçti.',
        }),
        option('T05_C', 'Mütalaa delillere dayanmıyor; tutanaktan çıkarılmasını isteriz', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Mütalaa savcının hakkıdır; tutanaktan çıkarılamaz. Yapılacak şey cevap vermektir (CMK 216/2).',
          responses: B(`baskan: Böyle bir usul yok, müdafi. Esas hakkındaki savunmanızı alalım.`),
        }),
      ],
    }),
    story('T_06', {
      ...court2.base,
      title: 'Esas hakkında savunma',
      background: 'durusma_salonu',
      lines: B(`
baskan: Müdafi, esas hakkındaki savunmanızı yapın.
> Ayağa kalktım. Cübbenin kolları ağırdı; üç aydır taşıdığım bir dosya kadar.
> Galeride Gülay, arkada Sevim. Savcı kalemini masaya koymuş, kollarını kavuşturmuştu. Heyet bekliyordu.
~ Leyla’nın sesi: “Üçe böl.” Bir yumruk. Bir boşluk. Bir ölüm. Her birinin kendi kâğıdı var.
~ Heyet kararını tutanaktan verecek, benim cümlemden değil. Ama cümlem tutanağı nasıl okuyacaklarını söyler.
`),
      choices: [
        option('T06_D', 'Olası kast kabul edilse bile haksız tahrik ve takdiri indirim uygulanmalı', {
          next: 'T_06S',
          score: { SAVUNMA_STRATEJISI: -80 },
          effects: [dec('pers'), raise('olasi_kabul')],
          bad: 'Olası kastı (TCK 21/2) kendin tartışmaya açtın. Mahkeme kayıtlara göre karar verir; ama müdafiin ağzından çıkan “kabul edilse bile”, savunmanın kendi delillerine güvenmediğini söyler.',
        }),
        option('T06_E', 'Saat ve darbe sanığı dışarıda bırakıyor; şüphe sanık lehine', {
          next: 'T_06S',
          effects: [
            ifThen(
              SUPHE,
              [
                score('SAVUNMA_STRATEJISI', strategyAmount(200, 'USUL')),
                inc('pers'),
                raise('supheli'),
                mark(
                  'GOOD',
                  'Dönüşün olmadığı ve ölümün sonradan, başka bir cisimle geldiği gösterildi; sanığın suçu işlediği sabit değil (CMK 223/2-e).',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
              [
                score('SAVUNMA_STRATEJISI', -100),
                mark(
                  'BAD',
                  'Şüphe savunması için gerekli iki ayak (dönüşün olmadığı ve ölümün sonradan geldiği) birlikte kurulmadı.',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
            ),
          ],
        }),
        option('T06_X', 'Sabıkasız bir işçi, bir çocuk babası, tek bir öfke anı: takdir ve merhamet', {
          next: 'T_06S',
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('pers')],
          bad: 'Duygusal söylem delilin yerini tutmaz; heyet hukuki bir dayanak bekliyordu. Kayıtlar elindeyse onları söylemeliydin.',
        }),
        option('T06_B', 'Ölüm başka bir elin işi: suçu sanığın işlemediği sabit', {
          next: 'T_06S',
          effects: [
            ifThen(
              GERCEK_FAIL,
              [
                score('SAVUNMA_STRATEJISI', strategyAmount(250, 'MASUMIYET')),
                inc('pers'),
                raise('gercek_fail'),
                mark(
                  'GOOD',
                  'Gerçek failin varlığı kayıtlarla gösterildi ve savcılığa bildirildi; suçun sanık tarafından işlenmediği sabit (CMK 223/2-b).',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
              [
                score('SAVUNMA_STRATEJISI', -100),
                dec('pers'),
                raise('b_basarisiz'),
                mark(
                  'BAD',
                  'Başka bir failden söz ettin ama bunu kayıtlarla ve savcılığa bildirimle kurmadın; iddia havada kaldı.',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
            ),
          ],
        }),
        option('T06_T', 'Öncelikle beraat; olmazsa kast yaralamaya yönelikti ve tahrik vardı', {
          next: 'T_06S',
          score: { SAVUNMA_STRATEJISI: strategyAmount(150, 'INDIRIM') },
          effects: [raise('terditli')],
          good: 'Terditli savunma meşrudur: öncelikle beraat, aksi hâlde TCK 87/4 ve haksız tahrik (TCK 29).',
        }),
      ],
    }),
    decisionNode(
      'T_06S',
      [
        { when: flag('gercek_fail'), to: 'T_06S_B' },
        { when: flag('supheli'), to: 'T_06S_E' },
        { when: flag('terditli'), to: 'T_06S_T' },
        { when: flag('olasi_kabul'), to: 'T_06S_D' },
        { when: flag('b_basarisiz'), to: 'T_06S_F' },
        { to: 'T_06S_X' },
      ],
      { ...court2.base, title: 'Esas hakkında savunma' },
    ),
    story('T_06S_B', {
      ...court2.base,
      title: 'Esas hakkında savunma',
      background: 'durusma_salonu',
      lines: B(`
- Sayın Başkan, sayın üye, Tarık Demirel o gece bir yumruk attı. Bunu kendisi söyledi; biz de söylüyoruz.
- Yumruk Ercan Yavuz’un burnunu kanattı. Ercan kalktı, kendi ayağıyla kantine yürüdü. Bu salonda kimse aksini söylemedi.
- Tarık 23.18’de limandan çıktı ve bir daha girmedi. Turnike bunu söylüyor; büfe ve banka kaydı da.
- Ercan’ı öldüren darbe, bilirkişinin bu salonda daralttığı biçimde, yumruk ve düşme değildir; kavgadan sonra gelmiştir.
- O saatte B sahasında duran tek araç tanığın zimmetindeydi. Tanık bu sorulara cevap vermedi. Hakkında soruşturma başladı; bu bizim değil, savcılığın işi.
- Müvekkilim bu suçu işlemedi. Bu bir şüphe değil, kayıtlarla sabit bir gerçektir. Beraatini talep ediyoruz.
`),
      choices: [cont('T06SB_DEVAM', 'Sanığın son sözü', 'T_07')],
    }),
    story('T_06S_E', {
      ...court2.base,
      title: 'Esas hakkında savunma',
      background: 'durusma_salonu',
      lines: B(`
- Sayın Başkan, sayın üye, Tarık Demirel o gece bir yumruk attı. Bunu inkâr etmiyoruz.
- Ama o yumruktan sonra Ercan Yavuz yaşadı: yürüdü, kantine gitti. Sanık ise limandan çıktı ve dönmedi.
- Savcılık, yumruğun Ercan’ı düşürüp başını çarptırdığını söylüyor. Bilirkişi, dosyadaki kâğıtlar önüne konunca raporunu bu salonda daralttı.
- Savcılığın tanığı o saatte o yerde sanığı göremezdi. Savcılığın anlatımı, maktulün kendi son saatleriyle çelişiyor.
- Saatleri bu salonda birlikte okuduk. 23.18: sanığın kartı turnikeden çıkıyor ve bir daha girmiyor. 23.34: maktul kantinde tost ve ayran alıyor.
- 23.37: sanığın kartı iskele büfesinde iki çay ödüyor. 23.41: maktul iki dakika yedi saniye telefonda konuşuyor; sanık o dakikada limanın dışında.
- Bilirkişi mide içeriğini son öğünün saatiyle yorumladı: ölüm 23.34’ten sonra. Kırık 3,2 santim, dairesel; karşı tarafta darbe izi yok.
- Düşen bir baş böyle kırılmaz. Sabit duran bir başa küçük, sert bir cisim böyle vurur.
- Bu kâğıtların hiçbiri savunmanın kanaati değildir. Hepsi dosyada, hepsi bu duruşmada okundu ve tartışıldı. Mahkemeniz hükmünü yalnızca bunlara dayandırabilir.
> Savcı kalemini bir kez masaya vurdu; itiraz etmedi. Kâtibin parmakları klavyede saatleri yazıyordu, birer birer.
- Geriye ne kalıyor? Bir kavga. Bir yumruk. Bir ağabeyin adı ve bir tükürük. Bunlar bir ölümü açıklamaz.
- Ceza yargılamasında sanık masumluğunu ispatlamak zorunda değildir. Suçluluğu kesin ve inandırıcı delille ispatlanmalıdır. Burada ispatlanmamıştır. Beraatini talep ediyoruz.
> Oturdum. Ellerim titremiyordu; şaşırdım. Tarık bana bakmıyordu, heyete bakıyordu. İlk kez bir şey bekler gibi.
~ Bir şüphe iki ayakla durur. Bugün ikisini de kürsüye çıkardım. Gerisi, üç kişinin bir odada vereceği karar.
`),
      choices: [cont('T06SE_DEVAM', 'Sanığın son sözü', 'T_07')],
    }),
    story('T_06S_T', {
      ...court2.base,
      title: 'Esas hakkında savunma',
      background: 'durusma_salonu',
      lines: B(`
- Sayın Başkan, müvekkilim bir kez vurdu. Öncelikle beraatini talep ediyoruz: ölümle o yumruk arasındaki bağ kurulamamıştır.
- Mahkemeniz aksi kanaatteyse: kast öldürmeye değil yaralamaya yönelikti. Yumruktan önce maktul, sanığın ölen ağabeyiyle alay etti, yüzüne tükürdü, onu itti. Haksız tahrik hükümlerinin uygulanmasını talep ediyoruz.
> Savcı başını kaldırdı. Yedek talebi duyan her savcı gibi: bir kapının aralık kaldığını not ederek.
~ Önce beraat. Sonra bir yedek. Yedeği söylemek ilk cümleyi zayıflatır mı? Bazen. Bazen de heyete bir yer gösterir.
`),
      choices: [cont('T06ST_DEVAM', 'Sanığın son sözü', 'T_07')],
    }),
    story('T_06S_D', {
      ...court2.base,
      title: 'Esas hakkında savunma',
      background: 'durusma_salonu',
      lines: B(`
- Sayın Başkan, mahkemeniz olası kastı kabul etse bile maktulün sanığın ölen ağabeyine hakareti, tükürmesi ve itmesi ortadadır. Haksız tahrik ve takdiri indirim uygulanmalıdır.
> Tarık bana döndü. Gözlerinde bir soru vardı: “Kabul mü ediyoruz?”
> Savcı not almadı. Not almasına gerek yoktu; söyleyeceğini ben söylemiştim.
~ “Kabul etse bile.” Bir avukatın ağzında en pahalı üç kelime. Kâğıtlarım masadaydı; ben onların yanına bir kapı bıraktım.
`),
      choices: [cont('T06SD_DEVAM', 'Sanığın son sözü', 'T_07')],
    }),
    story('T_06S_F', {
      ...court2.base,
      title: 'Esas hakkında savunma',
      background: 'durusma_salonu',
      lines: B(`
- Sayın Başkan, Ercan Yavuz’u Tarık Demirel öldürmedi. Onu başka biri öldürdü. Bu salonda o kişinin adı geçti.
savci: Müdafi, o kişi hakkında Başsavcılığa bir bildiriminiz var mı? Dosyaya giren bir kayıt?
> Cevap verecek bir kâğıdım yoktu; ya da kâğıdım vardı ve onu doğru masaya götürmemiştim.
baskan: Devam edin müdafi. Esas hakkında.
~ Bir isim, kâğıdı olmayınca bir isim olarak kalır. Heyet onu duydu; tutanağa yazmadı.
`),
      choices: [cont('T06SF_DEVAM', 'Sanığın son sözü', 'T_07')],
    }),
    story('T_06S_X', {
      ...court2.base,
      title: 'Esas hakkında savunma',
      background: 'durusma_salonu',
      lines: B(`
- Sayın Başkan… müvekkilim sabıkasız bir işçi, bir çocuk babası. Bir anlık öfke. Takdirinize sığınıyoruz.
> Konuşurken heyetin yüzlerine baktım. Hiçbirinde bir şey değişmedi.
~ Hukuk kürsüde duygu dinler; ama duyguyu kâğıda bağlayan cümleyi bekler. O cümleyi kuramadım.
`),
      choices: [cont('T06SX_DEVAM', 'Sanığın son sözü', 'T_07')],
    }),
    story('T_07', {
      ...court2.base,
      title: 'Son söz',
      background: 'durusma_salonu',
      lines: B(`
baskan: Sanık, ayağa kalkın. Son sözünüz?
> Tarık kalktı. Ellerini önünde birleştirdi; sonra çözdü, yanlarına bıraktı. Bana baktı.
~ Son söz onun. Ben yalnızca bir şey söylemiştim: ne yaptıysan onu, ne yapmadıysan onu. Gerisi onun ağzından çıkacak.
`),
      choices: [
        option('T07_B', '“Kızım var efendim. Merhametinize sığınıyorum, affedin beni.”', {
          next: 'T_08',
          neutral:
            'Şekli bir pişmanlık gösterisi tek başına bir hafifletici değildir (TCK 62/2); ama son söz sanığındır.',
          responses: B(`
tarik/uzgun: Efendim… ben… kızım var efendim. Merhamet edin.
> Sesi çatladı. Oturdu. Gülay galeride başını eğdi.
`),
        }),
        option('T07_A', '“Bir kere vurdum, utanıyorum. Ama o adamı ben öldürmedim.”', {
          next: 'T_08',
          score: { SAVUNMA_STRATEJISI: 25 },
          effects: [ifThen(flag('sonsoz_hazir'), [score('SAVUNMA_STRATEJISI', 25)])],
          good: 'Kısa, dürüst bir son söz (CMK 216/3): yumruğu kabul eden, ölümü reddeden.',
          responses: B(`
tarik: Efendim, ben o gece bir kere vurdum. Ondan utanıyorum. Ercan abinin karısından da özür dilerim.
tarik: Ama ben o adamı öldürmedim. Kızım büyüyünce “baba sen ne yaptın” diye sorarsa, ne yaptıysam onu söylemek istiyorum. Bu kadar.
> Oturdu. Başını eğmedi. Gülay galeride gözlerini sildi; Elif’in resim defterini göğsüne bastırdı.
> Savcı kalemini kapattı. Dosyasının üstüne koydu, kapağı kapalı.
> Galeride Sevim Yavuz başını kaldırdı. Tarık’a baktı. Bir şey söylemedi; ama başını da çevirmedi.
`),
        }),
        option('T07_C', '“Kenan abi o gece oradaydı! Herkes biliyor, onu soruşturun!”', {
          next: 'T_08',
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('pers')],
          bad: 'Son sözde kanıtsız bir suçlama, sanığın dürüst anlatımının gölgesinde kaldı; bu iş savcılığındı.',
          responses: B(`
tarik/kizgin: Efendim, o yaptı! Kenan abi! Herkes biliyor!
baskan: Sanık, oturun. Son sözünüz alındı.
~ Ona bunu söylemedim. Ama ona bunun neden söylenmemesi gerektiğini de söylemedim.
`),
        }),
      ],
    }),
    decisionNode('T_08', [{ to: 'R_KARAR' }], {
      ...H2,
      title: 'Hüküm',
      lines: [
        W(
          all(has('ev_defter'), not(flag('etik_gulay'))),
          `
baskan: Heyet müzakereye çekiliyor.
> Kırk dakika. Koridorda Gülay ayakta, Sevim oturuyordu. Aralarında bir kişilik boşluk vardı; sonra yoktu.
> Sevim kalktı, Gülay’ın yanına geldi. Gülay bir adım geri çekildi; Elif’in resim defterini göğsüne bastırdı.
sevim: Korkma. Bir şey yapmaya gelmedim. Kızın mı çizdi onu?
gulay: Gemi. Babası gemide diyoruz ona. Üç aydır.
sevim/uzgun: Bizim çocuğumuz olmadı. Ercan isterdi. Gemilere bakar, “oğlum olsa kaptan olurdu” derdi. Sonra “yok, kaptan olmasın” derdi.
> Defterin açık sayfasına baktı: mavi bir gemi, iki çöp adam. Uzun uzun baktı.
sevim: Kocan vurdu. Bunu unutmayacağım. Ama defteri avukatına ben verdim. Onu da unutmayacağım.
gulay: Neden verdiniz?
sevim: Ercan saymayı severdi. Yanlış sayılmak istemezdi. Ben de istemem.
~ İki kadın, bir koridor, bir kapı. Biri kocasını bekliyor; öbürü artık kimseyi beklemiyor. Aynı kararı bekliyorlar.
> Tarık koridorun sonundaki pencerenin önünde duruyordu. Elini cama koymuştu, sağ elini. Boğumlardaki iz neredeyse geçmişti.
tarik: Abla, ne olursa olsun… teşekkür ederim. Beni dinleyen ilk sen oldun.
- Daha bitmedi.
tarik: Biliyorum. Ama ben bitirdim. Söyleyeceğimi söyledim. Doğrusunu.
mubasir: Heyet geliyor! Ayağa kalkın!
baskan: Hüküm fıkrası ayakta dinlenir.
`,
        ),
        O(`
baskan: Heyet müzakereye çekiliyor.
> Kırk dakika. Koridorda Gülay ayakta, Sevim oturuyordu. Kimse konuşmadı. Pencereden limanın vinçleri görünmüyordu; ama ben onları görüyordum.
> Tarık koridorun sonundaki pencerenin önünde duruyordu. Elini cama koymuştu, sağ elini. Boğumlardaki iz neredeyse geçmişti.
tarik: Abla, ne olursa olsun… teşekkür ederim. Beni dinleyen ilk sen oldun.
- Daha bitmedi.
tarik: Biliyorum. Ama ben bitirdim. Söyleyeceğimi söyledim. Doğrusunu.
mubasir: Heyet geliyor! Ayağa kalkın!
baskan: Hüküm fıkrası ayakta dinlenir.
`),
      ],
    }),
    story('T_COKUS', {
      ...court2.base,
      title: 'Çöküş',
      background: 'durusma_salonu',
      lines: B(`
baskan: Müdafi, heyetin sabrını yeterince denediniz. Savunmanızı tamamlanmış kabul ediyoruz.
> Savcı dosyasını toplarken bana döndü. Sesinde ne zafer vardı ne alay.
savci: Bir yumruğu savunmak zordur avukat hanım. Bir cinayeti savunmaktan zor. Çünkü yarısını kabul ederek başlarsınız.
baskan: Sanık, kısaca son sözünüz?
`),
      choices: [cont('COKUS_SON', 'Son söz: “Ben öldürmedim.”', 'T_08')],
    }),
    resultNode('R_KARAR', { ...H2, title: 'Karar Açıklandı' }),
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
