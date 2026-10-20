import {
  all,
  any,
  cmp,
  cont,
  conversation,
  decisionNode,
  deductionBoard,
  deliver,
  documentExam,
  fallback,
  flag,
  has,
  inc,
  nav,
  not,
  option,
  raise,
  ref,
  row,
  sceneSearch,
  set,
  story,
  tool,
  v,
  visited,
  chosen,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, O, W } from './dsl.js';
import { boardMiss, docMiss, hit, rec, toHub } from './helpers.js';
import { BOARD_POOL, baseRecipes, hesapDoc } from './inv-arsiv.js';
import { C4, p2 } from './shared.js';

// 65-ara: birinci celseden sonraki üç hafta. Ara hub'ı yığınsızdır: her etkinlik doğrudan ARA_HUB'a döner.
// Yeni gelişmeler: katılanla (avukatı huzurunda) görüşme, demirbaş listesi, Tarık'ın evi, Ozan'ın ziyareti, suç
// duyurusu, Tarık'ın etik tuzak teklifi, sağlayıcının yanıtı ve savcılığın araması.

const HUB = 'ARA_HUB';

const araDayEnd = deliver('ARA_DAY_END', [
  { evidence: 'ev_isp', requires: flag('isp_istendi'), hint: 'IP adresinin abonesini mahkemeden sorgulat.' },
]);
const araSonDelivery = deliver('ARA_SON_1', [
  {
    evidence: 'ev_laptop',
    requires: all(flag('suc_duyurusu'), not(flag('ozan_uyarildi'))),
    hint: 'Somut dayanaklı bir suç duyurusu ve delili güvenceye almadan önce kimseye haber vermemek.',
  },
  { evidence: 'ev_isp', requires: flag('isp_istendi'), hint: 'IP adresinin abonesini mahkemeden sorgulat.' },
]);

const tapMiss = fallback('FB_EV', 'TAP', {
  score: { ARASTIRMA: -10 },
  feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
});

export const ara: CasePart = {
  nodes: [
    decisionNode('ARA_GIRIS_1', [{ to: 'ARA_GIRIS' }], {
      ...C4,
      title: 'Adliye merdivenleri',
      lines: [
        W(
          flag('contra_s3'),
          `
          # ADLİYE MERDİVENLERİ — 13.20 |bg=adliye
          > Yağmur yeniden başlamıştı. Merdivenlerin başında Av. Sinan Bulut, şemsiyesini açmadan bekliyordu.
          sinan: Meslektaşım. O sütun… Müvekkilem sizinle konuşmak istiyor. Benim bürom, benim huzurumda. Uygunsa bu hafta.
          P: Uygun.
          sinan: Bir şey daha. Bu bir uzlaşma teklifi değil. Müvekkilem yalnızca anlamak istiyor.
        `,
        ),
        W(
          flag('fact_sinan_kapi'),
          `
          # ADLİYE MERDİVENLERİ — 13.20 |bg=adliye
          > Yağmur yeniden başlamıştı. Merdivenlerin başında Av. Sinan Bulut.
          sinan: Kantinde bir şey istemiştin. Müvekkilem kabul etti. Benim bürom, benim huzurumda. Kısa tutalım.
        `,
        ),
        O(`
          # ADLİYE MERDİVENLERİ — 13.20 |bg=adliye
          > Yağmur yeniden başlamıştı. Merdivenlerden inerken Melis Karaca yanımdan geçti. Durmadı. Avukatı bir adım arkasındaydı.
          ~ Üç hafta. Elimde ne var, neyi bilmiyorum?
        `),
      ],
    }),
    story('ARA_GIRIS', {
      ...C4,
      title: 'Üç hafta',
      background: 'buro_gece',
      lines: [
        W(
          flag('adli_kontrol_kalkti'),
          `
          # PERŞEMBE 20.00 — ARSLAN HUKUK |bg=buro_gece
          > Tarık büroya geldiğinde pasaportunu masaya koydu. Açtı, kapadı, yine açtı. Bir mimarın bir çizimi incelemesi gibi.
          tarik: Yurt dışı yasağı kalktı. Gideceğim bir yer yok aslında, Ece burada. Ama bir kapının açık olduğunu bilmek başka bir şey. Üç aydır bütün kapılar kapalıydı.
          tarik: Salonda o sütunu gösterdiğinizde hâkimin yüzü değişti. İlk kez biri beni dinledi. Ama bu yetmez, değil mi? Bir sütun bir insanı aklamaz.
          leyla: Yetmez. Hâkim bir sütun gördü, bir şüphe duydu, yurt dışı yasağını kaldırdı. İyi bir işaret. Ama şimdi o sütunun ucunda bir el görmek isteyecek.
          leyla: Üç haftan var Deniz. Bir dizüstü, bir internet hattı, bir demirbaş kaydı. Bunları bul, o eli göster. Yoksa beraat gelse bile “şüpheden” gelir; ve şüphe, bir çocuğa anlatılmaz.
        `,
        ),
        O(`
          # PERŞEMBE 20.00 — ARSLAN HUKUK |bg=buro_gece
          > Tarık büroya geldiğinde paltosunu çıkarmadı. Kurşun kalem yine elinde. Tık. Tık. Ama bu kez ritimde bir şey değişmişti; daha yavaş, daha düşünceli.
          tarik: Üç hafta daha. Vakıf ihaleyi askıya aldı. Bir askı. Mimarlıkta askı geçici bir şeydir; sonra ya yük taşır ya çöker. İnsan hayatı da öyle galiba.
          tarik: Salonda o sütunu gösterdiğinizde, ilk kez nefes aldım. Üç aydır ilk kez. Ama sonra düşündüm: bir sütun yetmez, değil mi?
          leyla: Yetmez. Hâkim bir şüphe duydu, o kadar. Şüphe güzel bir şeydir, bir kapıyı aralar. Ama şüphe beraat değildir Deniz.
          leyla: Üç haftan var. Bu üç haftada şüpheye bir ad koyacaksın. O cihazın kime ait olduğunu, o hattın kimin olduğunu, o dizüstünün nereye gittiğini bulacaksın.
          leyla: Çünkü “bilmiyoruz” ile “biliyoruz ama söyleyemiyoruz” arasında, bir çocuğun babasına bakışı vardır.
          > Tarık başını kaldırdı. Leyla’nın ne demek istediğini anlamıştı; ikisi de anlamıştı. Ben de.
        `),
      ],
      choices: [
        cont('ARA_BASLA', 'Arayı planla', HUB, { role: 'PRIMARY', effects: [...p2.start()] }),
      ],
    }),
    p2.hub({
      ...C4,
      title: 'Ara',
      background: 'buro',
      lines: [
        W(
          cmp(v('ara_day'), '==', 1),
          `
          # ARA · 1. HAFTA
          > Hedef: dizüstü. Cihaz 3’ün bir sahibi, bir masası, bir hattı olmalı. Bir de katılan: o ne biliyor?
        `,
        ),
        O(`
          # ARA · 3. HAFTA · DURUŞMAYA 2 GÜN
          > Hedef: dayanakları topla. Suç duyurusu, tahta, son sorular. Bir isim koyacaksan, onu kâğıtlar koysun.
        `),
      ],
      tabs: [
        {
          id: 'ta_insan',
          label: 'İNSANLAR',
          kind: 'PEOPLE',
          choices: [
            p2.activity('A_MELIS', 'Melis Karaca (avukatının bürosunda)', 'ARA_MELIS', {
              once: true,
              next: 'ARA_MELIS',
              visibleWhen: all(any(flag('fact_sinan_kapi'), flag('contra_s3')), not(flag('melis_dogrudan'))),
              description: 'Av. Sinan Bulut’un huzurunda',
            }),
            p2.activity('A_NURTEN', 'Mali müşavir Nurten Sarı', 'ARA_NURTEN', {
              once: true,
              next: 'ARA_NURTEN',
              description: 'Ayrılık protokolü · demirbaş',
            }),
          ],
        },
        {
          id: 'ta_olay',
          label: 'OLAY YERİ',
          kind: 'SCENE',
          choices: [
            p2.activity('A_EV', 'Tarık’ın evi', 'ARA_EV_GIRIS', {
              once: true,
              next: 'ARA_EV_GIRIS',
              description: 'Çalışma odası · büyüteç 6',
            }),
          ],
        },
        {
          id: 'ta_arsiv',
          label: 'ARŞİV',
          kind: 'ARCHIVE',
          choices: [
            p2.activity('A_HESAP', 'Hesap verisi raporu', 'ARA_HESAP', {
              once: true,
              next: 'ARA_HESAP',
              visibleWhen: all(has('ev_hesap'), not(visited('INV_HESAP'))),
              description: 'Noter tespitli döküm · 6 deneme',
            }),
            p2.activity('A_SUC', 'Savcılığa suç duyurusu', 'ARA_SUC', {
              next: 'ARA_SUC',
              visibleWhen: has('ded_bagli'),
              description: 'Kimin hakkında, hangi dayanakla?',
            }),
            p2.free('A_CIKARIM', 'Çıkarım tahtası', 'ARA_CIKARIM', {
              next: 'ARA_CIKARIM',
              description: '0 EP',
              enabledWhen: ref('kart2'),
              lockedReason: 'En az 2 kart gerekli.',
            }),
            p2.free('A_LEYLA', 'Leyla’ya danış', 'ARA_LEYLA', {
              next: 'ARA_LEYLA',
              description: '0 EP · haftada bir kez',
              visibleWhen: cmp(v('leyla_ara'), '<', v('ara_day')),
            }),
          ],
        },
      ],
      choices: [
        nav('GO_T', 'DURUŞMADAN ÖNCEKİ AKŞAM', 'ARA_TEKLIF', {
          role: 'PRIMARY',
          confirm: 'Ara evresi biter. Emin misin?',
        }),
      ],
    }),
    decisionNode('ARA_DAY_END', [{ to: 'ARA_AKSAM' }], {
      ...C4,
      title: 'Hafta sonu',
      onEnter: [...araDayEnd.effects, inc('ara_day', 1), set('ara_ap', 3)],
      lines: [
        W(
          has('ev_isp'),
          `
          # İKİNCİ HAFTA — ARSLAN HUKUK |bg=buro_gece
          > Kalemden bir zarf geldi: mahkemenin müzekkeresine internet servis sağlayıcısının yanıtı. Tek sayfa. Tek satır. |fx=flash
          ~ 85.105.44.17. Üç gece. Bir abone adı. Okudum. Bir daha okudum. Tahtaya iğneledim.
        `,
        ),
        O(`
          # İKİNCİ HAFTA — ARSLAN HUKUK |bg=buro_gece
          > Bir hafta geçti. Bilirkişi imajı aldı; rapor yazıyor. Kalemde başka bir şey yok.
        `),
      ],
    }),
    story('ARA_AKSAM', {
      ...C4,
      title: 'Bir ziyaret',
      background: 'buro_gece',
      lines: B(`
        > Akşam yediyi geçiyordu. Kapı çalındı. Kapıda Ozan Tekin, elinde bir kutu Kestane şekeri.
        ozan/mutlu: Üstat! Rahatsız etmiyorum, değil mi? Geçiyordum. Bursa’ya gelen kestane şekeri almadan gitmez derler, ben de size getirdim.
        > Oturdu. Ceketini çıkarmadı. Büroya bir kez baktı; panoya, iğnelenmiş kâğıtlara. Ben panonun önüne geçtim.
        ozan: Duruşmayı duydum. Bir bilirkişi atanmış. Şu telefon işleri. Valla ben anlamam o işlerden. Bilirkişi ne diyecek sizce? Merak ettim, Tarık için.
        ~ Merak. On yıllık arkadaşının avukatına kestane şekeri getiren bir merak.
      `),
      choices: [
        option('ARA_OZ_KAPA', 'Teşekkür et; dosyayı tanıkla konuşmayacağını kibarca söyle.', {
          score: { SAVUNMA_STRATEJISI: 50 },
          good: 'Dosyanın bir tanığıyla savunmanın değerlendirmelerini paylaşmamak hem meslek kuralı hem stratejidir.',
          responses: B(`
            P: Teşekkür ederim Ozan Bey. Siz dosyanın tanığısınız. Bilirkişiyi de, dosyayı da duruşmada konuşalım.
            ozan: Tabii, tabii. Haklısınız üstat. Usul. Ben de öyle derim hep.
            > Kalktı. Kapıda durdu, döndü, gülümsedi.
            ozan: Saygılar.
          `),
          next: HUB,
        }),
        option('ARA_OZ_ANLAT', 'Bilirkişinin “cihaz 3”e ve bağlı cihazlara bakacağını söyle.', {
          visibleWhen: any(flag('contra_s3'), flag('partial_s3'), has('ded_bagli')),
          score: { SAVUNMA_STRATEJISI: -80 },
          effects: [raise('ozan_uyarildi')],
          bad: 'Savunmanın teknik teorisini dosyanın bir tanığına açtın; delil güvenceye alınmadan önce. Bir dizüstü bir gecede kaybolabilir.',
          responses: B(`
            ozan: Bağlı cihaz… Ha. Şu bilgisayardan açma meselesi. Anladım.
            > Bir saniye. Gülüşü yerinden oynadı, sonra yerine oturdu, aynı yerden.
            ozan: İyi, iyi. Tarık’ın lehine olur inşallah. Hadi ben kaçayım üstat.
          `),
          next: HUB,
        }),
        option('ARA_OZ_SOR', 'Ona doğrudan 07 numaralı dizüstüyü sor.', {
          score: { SAVUNMA_STRATEJISI: -60 },
          effects: [raise('ozan_uyarildi')],
          bad: 'Delil güvenceye alınmadan olası bir ilgiliye sorulan soru, delili tehlikeye atar. Bu soruyu duruşmada, tanığa yemin altında sormak gerekirdi.',
          responses: B(`
            ozan: 07 mi? Ofisin eski laptopu mu? Bozuldu üstat, söyledim ya herkese. Ekranı gitmişti. Attım.
            ozan: Neden sordunuz?
            P: Merak ettim.
            ozan/mutlu: Merak iyidir. Saygılar.
          `),
          next: HUB,
        }),
      ],
    }),
    conversation('ARA_MELIS', {
      ...C4,
      title: 'Melis Karaca',
      background: 'buro',
      room: { label: 'AV. SİNAN BULUT’UN BÜROSU · SETBAŞI', character: 'melis' },
      lines: B(`
        # SETBAŞI · AV. SİNAN BULUT’UN BÜROSU — 17.30 |bg=buro
        > Setbaşı’nda, Gök Dere’nin üstündeki köprüye bakan bir büro. Suyun sesi pencereden içeri doluyor. Duvarlarda diplomalar, bir de eski bir Bursa gravürü.
        > Sinan masasının başında, önünde iki bardak su. Melis karşısındaki koltukta, paltosu yine dizlerinde; bu kadın paltosunu hiç çıkarmıyor, hep gitmeye hazır.
        sinan: Kurallar basit meslektaşım: soru sorabilirsin, müvekkilem dilediğine cevap verir, dilemediğine vermez. Kayıt yok, tutanak yok. Ben buradayım, bir usulsüzlük olursa keserim.
        sinan: Bunu niye kabul ettim, biliyor musun? Çünkü müvekkilem “o sütun doğruysa, ben de bilmek istiyorum” dedi. İyi bir mağdur, gerçeği cezadan çok ister.
        melis: Size bir şey söyleyeyim. Ben Tarık’ı tanıyorum. Pay için kavga ettik, evet. Ama ben onu… Neyse.
        melis: O sütun. Cihaz 3. Ne demek bu? Basit söyleyin. Mimarım, bilgisayarcı değil.
        P: Mesajlar Tarık’ın telefonundan değil, hesabına bağlı başka bir bilgisayardan gönderilmiş.
        > Melis bir süre pencereye baktı.
      `),
      choices: [
        option('MEL_SN', 'Mesajların dili size bir şey hatırlattı mı?', {
          score: { SORGULAMA: 50 },
          effects: [raise('fact_melis_sn')],
          good: 'Yönlendirmeyen, katılanın kendi gözlemine yönelik bir soru.',
          responses: B(`
            melis: “Sn. Karaca.” Bana öyle hitap eden bir tek ihale yazışmaları vardı. Vakıfla, danışmanlarla, rakip firmalarla. Resmî, soğuk, mesafeli.
            melis: Tarık bana hiç öyle yazmadı. “melis” derdi, küçük harfle, noktasız. Kavga ederken bile küçük harf. O gece gelen mesajlar bir yabancının ağzıydı.
            melis: Bir de o “Saygılar.” Sonunda nokta ile. Bunu yazan birini tanıyorum gibi geliyor, bir yüz beliriyor ama... Emin değilim. Emin olmadığım bir şeyi söylemem, mahkemede de söylemem.
            sinan: Kayıt dışı demiştik Melis Hanım.
            melis: Biliyorum Sinan Bey. İsim vermedim. Ama avukat hanım isterse, o ismi kendisi bulur. Zaten yarı yolda, gözlerinden belli.
          `),
        }),
        option('MEL_SES', 'Ses kaydını gönderdiğinizde Tarık Bey’in hesabı nerelerde açıktı, biliyor musunuz?', {
          score: { SORGULAMA: 40 },
          responses: B(`
            melis: Ofiste, eski ortağın masasındaki dizüstüde PUSULA hep açık dururdu. Tarık’ın hesabı. Müşteriler oradan yazılırdı, herkes bakardı.
            melis: Eylülde ben de oradan bir iki kere yazmıştım. Sonra o dizüstü yoktu. Ortak gidince gitti sandım.
            ~ Hep açık duran bir hesap. Bir masadan kalkıp giden bir dizüstü.
          `),
        }),
        option('MEL_OZUR', 'Birinci celsedeki sözlerim için özür dilerim.', {
          visibleWhen: any(chosen('H103_D'), chosen('H102_C'), chosen('H103_C')),
          effects: [inc('pers')],
          good: 'Hatayı kabul etmek, karşı tarafla iletişimi yeniden kurar.',
          responses: B(`
            melis: Kabul ediyorum. Ama unutmuyorum. Bu ikisi farklı şeyler.
            sinan: Not edildi meslektaşım. Kayıt dışı.
          `),
        }),
        option('MEL_VAZGEC', 'Şikâyetinizden vazgeçmeyi düşünür müsünüz?', {
          score: { SAVUNMA_STRATEJISI: -40 },
          bad: 'Görüşmenin amacı anlamaktı; vazgeçme talebi katılanı baskı altında hissettirir ve görüşmeyi bitirir. Üstelik şantaj suçu şikâyete bağlı değildir.',
          responses: B(`
            sinan: Görüşme burada bitti meslektaşım.
            melis/kizgin: Siz de mi? Herkes benden bir şeyden çekilmemi istiyor.
            > Melis kalktı ve odadan çıktı.
          `),
          next: HUB,
        }),
        { id: 'MEL_BITIR', kind: 'CONTINUE', label: 'Teşekkür et ve çık', role: 'BACK', next: HUB },
      ],
    }),
    conversation('ARA_NURTEN', {
      ...C4,
      title: 'Nurten Sarı',
      background: 'buro',
      room: { label: 'SARI MALİ MÜŞAVİRLİK · ALTIPARMAK', character: 'nurten' },
      onFirstEnter: [{ type: 'MEET', character: 'nurten' }],
      lines: B(`
        # ALTIPARMAK · SARI MALİ MÜŞAVİRLİK — 10.30 |bg=buro
        > Altıparmak’ta eski bir iş hanı. Dosya dolapları tavana kadar, hesap makinesinin kâğıt şeridi yere sarkıyor.
        > Duvarda geçen yıldan kalma bir takvim. Nurten Hanım gözlüğünün üstünden, bir öğretmen edasıyla baktı.
        nurten: Aksoy Tekin. Üç yıl defterlerini ben tuttum. Demirbaş numaralarını ezbere bilirim kızım: plotter 01, ofis tableti 03, Tarık Bey’in dizüstüsü 05, Ozan Bey’inki 07. Çift sayılar Ozan’ın, tek sayılar ortak.
        nurten: Ayrılık kolay olmadı. İki inatçı adam, bir avukat, bir de ben. Bir protokol yaptık, ekinde demirbaş listesi; kim neyi aldı, kim neyi iade etti, hepsi yazılı.
        nurten: Benim mesleğimde bir kural var: “gerek yok” denen yere not düşersin. Çünkü “gerek yok” denen şeyler, bir gün mahkemede gerek olur. Ne istiyorsunuz kızım?
      `),
      choices: [
        option('NUR_DEMIRBAS', 'Demirbaş listesini görebilir miyim?', {
          score: { ARASTIRMA: 30 },
          responses: B(`nurten: Görürsünüz. Fotokopi yok ama, gözünüzle bakın.`),
          next: 'ARA_DEMIRBAS',
        }),
        option('NUR_LAPTOP', '07 numaralı dizüstü için Ozan Bey ne dedi?', {
          score: { ARASTIRMA: 30 },
          responses: B(`
            nurten: “Bozuldu, attım” dedi. Ben “Tutanak tutalım, demirbaştan düşelim” dedim. “Gerek yok Nurten Hanım” dedi.
            nurten: Kırk yıllık muhasebeciyim. “Gerek yok” denen yere not düşerim. Düştüm.
          `),
        }),
        { id: 'NUR_BITIR', kind: 'CONTINUE', label: 'Teşekkür et', role: 'BACK', next: HUB },
      ],
    }),
    toHub(documentExam('ARA_DEMIRBAS', {
      ...C4,
      title: 'Demirbaş listesi',
      hud: ['ex5'],
      background: 'buro',
      lines: B(`> Ayrılık protokolünün ekindeki liste. Bir alet seç, sonra satıra dokun.`),
      header: { left: 'AKSOY TEKİN MİMARLIK · DEMİRBAŞ LİSTESİ (PROTOKOL EKİ)', right: '15.03' },
      columns: [
        { label: 'NO', flex: 0.5 },
        { label: 'DEMİRBAŞ', flex: 1.4 },
        { label: 'ZİMMET', flex: 1 },
        { label: 'İADE', flex: 1.6 },
      ],
      rows: [
        row('d1', ['01', 'Plotter', 'Ofis', 'ofiste']),
        row('d2', ['03', 'Tablet', 'Stajyer', 'iade · sıfırlandı (03.11)']),
        row('d3', ['05', 'Dizüstü', 'T. Aksoy', 'ofiste']),
        row('d4', ['07', 'Dizüstü + dok', 'O. Tekin', '— · not: “O.T. bozuldu dedi”']),
        row('d5', ['09', 'Lazer metre', 'O. Tekin', 'iade (koli)']),
        row('d6', ['11', 'Ofis anahtarları (2)', 'O. Tekin', 'iade (koli)']),
      ],
      tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
      costVar: 'ex5',
      rules: [
        hit(
          'EX_D_07',
          'mag',
          'd4',
          'clue_envanter',
          150,
          'YENİ İPUCU',
          'Büyüteci 07 numaralı satıra tuttum. “Dizüstü + dok istasyonu. Zimmet: O. Tekin.” İade hanesi bomboş. Kenarda Nurten Hanım’ın kırk yıllık muhasebeci el yazısı: “O.T. bozuldu dedi.” Diğer bütün demirbaşların iadesi işaretli; yalnız 07 boşta. Dok ofiste, tozlu yuvasında kaldı; ama dizüstü, “bozuldu” denip tutanaksız, demirbaştan düşülmeden kayıplara karıştı.',
          'ARASTIRMA',
        ),
        hit(
          'EX_D_03',
          'mag',
          'd2',
          undefined,
          0,
          'TABLET',
          'Tablet iade edilmiş, 3 Kasım’da sıfırlanmış. Hesap verisindeki tarihle aynı gün.',
        ),
        hit(
          'EX_D_KOLI',
          'cmp',
          'd6',
          undefined,
          0,
          'KOLİ',
          'Anahtarlar ve lazer metre kargoyla iade edilmiş. Koliyle gelenler listede tek tek işaretli. 07 işaretsiz.',
        ),
      ],
      miss: docMiss('FB_DEMIRBAS'),
      finish: { id: 'DEMIRBAS_BITIR', label: 'Listeyi kapat' },
    }), HUB),
    story('ARA_EV_GIRIS', {
      ...C4,
      title: 'Tarık’ın evi',
      background: 'ev',
      lines: B(`
        # HÜDAVENDİGAR · TARIK’IN EVİ — 18.00 |bg=ev
        > Eski bir apartmanın üçüncü katı; merdivende lahana ve çocuk maması kokusu. Salonda bir çocuk masası, üstünde boya kalemleri, yarım kalmış bir resim: bir ev, iki figür.
        tarik: Ece annesinde bu hafta. Polis buraya hiç gelmedi, kimse gelmedi. Siz ilk misafirsiniz; kusura bakmayın, dağınık. Yalnız yaşayan bir adamın dağınıklığı.
        tarik: Çalışma odam şurası. Geceleri orada çalışırım, Ece uyurken. Artık geceleri çalışmıyorum; geceler bu dava yüzünden lekelendi.
        > Çalışma odasının kapısını açtı. İçerisi çizimlerle, maketlerle dolu. Köşede, kapağı açık bir kargo kolisi.
        tarik: Şu koli mart’tan beri orada duruyor. Ozan ayrılırken kargoyla yolladı. Açtım, bir baktım, kapattım. İçine bakmak istemedim; on yıllık bir dostluğun iade edilmiş hâli.
        > Sahnede dikkatini çeken yerlere dokun.
      `),
      choices: [{ id: 'EV_BASLA', kind: 'CONTINUE', label: 'Odaya bak', next: 'ARA_ARAMA_EV' }],
    }),
    toHub(
      sceneSearch('ARA_ARAMA_EV', {
        ...C4,
        title: 'Çalışma odası',
        hud: ['taps3'],
        exposeCounts: true,
        background: 'ev',
        scene: 'sc_ev',
        instruction: 'Odada dikkatini çeken yere dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
        costVar: 'taps3',
        miss: tapMiss,
        finish: { id: 'EV_BITIR' },
      }),
      HUB,
    ),
    toHub(hesapDoc('ARA_HESAP', 'A', 'ex3b', C4), HUB),
    choiceNodeSuc(),
    toHub(
      deductionBoard('ARA_CIKARIM', {
        ...C4,
        title: 'Çıkarım tahtası',
        background: 'buro_gece',
        lines: B(`> İki kart seç. Yeni kartlar tahtada: demirbaş, koli, sağlayıcının yanıtı.`),
        pool: [...BOARD_POOL, 'clue_koli', 'clue_envanter', 'ev_isp'],
        recipes: [
          ...baseRecipes('A'),
          rec(
            'CB_A_LAP1',
            'clue_envanter',
            'clue_dock',
            'ded_laptop_ozan',
            300,
            '07 ofise dönmedi',
            'Dok istasyonu ofiste, kablosu prizde. Dizüstü eski ortağın zimmetinde ve iade hanesi boş.',
          ),
          rec(
            'CB_A_LAP2',
            'clue_envanter',
            'clue_koli',
            'ded_laptop_ozan',
            300,
            '07 kolide yoktu',
            'Koli her şeyi getirmiş: anahtar, metre, şarj aleti. Listede işaretli olanlar kolide. 07 ne listede işaretli ne kolide.',
          ),
          rec(
            'CB_A_IP',
            'ev_isp',
            'clue_ip_ayni',
            'ded_ip_tekin',
            300,
            'Tehdit hattının adresi',
            'Üç gecenin oturumu 85.105.44.17’den. Sağlayıcıya göre o adres Tekin Yapı Danışmanlık’ın iş hattı.',
          ),
          rec(
            'CB_A_USLUP',
            'clue_uslup_ozan',
            'clue_uslup_tehdit',
            'ded_uslup_ozan',
            200,
            'Aynı imza',
            '“Sn.”, üç nokta, “Saygılar.” Eski ortağın e-postası ile tehditler aynı elden çıkmış gibi. Tek başına ispat değil; ama artık yalnız değil.',
          ),
        ],
        miss: boardMiss('FB_A_CIKARIM'),
        finish: { id: 'A_CIKARIM_BITIR' },
      }),
      HUB,
    ),
    story('ARA_LEYLA', {
      ...C4,
      title: 'Leyla’ya danış',
      background: 'buro',
      onEnter: [set('leyla_ara', v('ara_day'))],
      lines: [
        W(
          all(ref('ozan_dayanak'), not(flag('suc_duyurusu'))),
          `
          leyla: Bir dizüstü, bir zimmet, bir oturum. Bunları kendin kovalama Deniz. Avukat dedektif değildir.
          leyla: Somut dayanakla savcılığa yaz. Arama kararı savcının işi. Senin işin, dayanağı eksiksiz koymak.
        `,
        ),
        W(
          all(has('ded_bagli'), not(has('clue_envanter'))),
          `
          leyla: Cihaz 3 bir dizüstü. Dizüstüler demirbaştır, demirbaşlar listelenir, listeleri muhasebeciler tutar.
          leyla: Sıkıcı kâğıtlar Deniz. Sıkıcı kâğıtlar.
        `,
        ),
        W(
          flag('ozan_uyarildi'),
          `
          leyla: Bir tanığa savunmanın teorisini anlattın. Bunun bedeli olur. Bundan sonra kâğıtlarla konuş, insanlarla değil.
        `,
        ),
        O(`
          leyla: Şüphe beraat ettirir Deniz. Ama bir adamın kızına “kanıtlayamadılar” demesi ile “yapmadı” demesi aynı şey değil.
          leyla: Hangisini istediğine karar ver. Sonra elindekine bak.
        `),
      ],
      choices: [{ id: 'ALEY_BITIR', kind: 'CONTINUE', label: 'Teşekkür et', role: 'BACK', next: HUB }],
    }),
    story('ARA_TEKLIF', {
      ...C4,
      title: 'Bir teklif',
      background: 'buro_gece',
      lines: B(`
        # DURUŞMADAN ÖNCEKİ AKŞAM — ARSLAN HUKUK |bg=buro_gece
        > Büro boşalmıştı. Yağmur yeniden başlamış, oluklardan taşan su kaldırıma vuruyordu. Panoda üç haftanın bütün kâğıtları: bir demirbaş listesi, bir sağlayıcı yazısı, bir hesap dökümü, bir hastane formu.
        > Tarık geç saatte geldi, ıslanmıştı. Elinde kendi dizüstüsü. Masanın üstüne koydu, kapağını açtı; ekranın ışığı yüzüne vurdu.
        tarik: Bir şey düşündüm. İki şey. Üç haftadır uyumuyorum, kafam çalışıyor. Dinleyin önce, sonra beni durdurun; durdurmanız için anlatıyorum zaten.
        tarik: Çünkü tek başıma kalınca bu iki şey bana çok mantıklı geliyor. Ve mantıklı gelmesi beni korkutuyor.
        tarik: Birincisi: Ozan’ın e-postası. Ortakken şifresini biliyordum. Hâlâ aynıdır; o hiçbir şeyi değiştirmez. Girer bakarız. Bir dakika.
        tarik: İkincisi: bilirkişiye vereceğimiz yedek. 25 Ekim’de Melis’e yazdıklarım orada. Onlar olmasa, savcının elinde saik de kalmaz. Yedekten silerim, kimse bilmez.
        > Kurşun kalem masada. Tıkırdamıyor.
        ~ İki kapı. İkisi de açık. İkisi de bir uçuruma açılıyor.
      `),
      choices: [
        option('TK_RED', 'Hayır. İkisini de yapmayacağız. Ne biliyorsak, kâğıda ve savcılığa.', {
          score: { SAVUNMA_STRATEJISI: 50 },
          effects: [raise('tarik_red')],
          good: 'Başkasının hesabına izinsiz girmek suçtur (TCK 243); dosyaya sunulacak veriyi ayıklamak delil karartmadır (TCK 281) ve avukatı da sorumlu kılar (Av.K. 34). Doğru cevap.',
          responses: B(`
            P: Tarık Bey. Biri sizin hesabınıza girdi ve bütün hayatınızı altüst etti. Şimdi aynısını mı yapacağız?
            P: 25 Ekim mesajlarınız kalacak. Onlar sizin dilinizle yazılmış. Tehditler değil. Bu fark bizim lehimize.
            > Tarık bir süre ekrana baktı. Sonra dizüstüyü kapattı.
            tarik: Haklısınız. Ben… bir duvar ıslak diye üstüne boya sürmeye kalktım. Mimar olarak bundan nefret ederim.
          `),
          next: 'ARA_SON_1',
        }),
        option('TK_SIL', '25 Ekim mesajlarını yedekten silelim. Kimse fark etmez.', {
          score: { SAVUNMA_STRATEJISI: -200 },
          effects: [inc('ethics'), raise('karartma')],
          bad: 'Mahkemeye sunulacak dijital veriyi ayıklamak delil karartmadır (TCK 281); avukatın buna katılması meslekten çıkarmayı gerektirebilecek bir ihlaldir (Av.K. 34). Üstelik hash değeri değişir; fark edilir.',
          responses: B(`
            > Tarık birkaç dakika klavyede bir şeyler yaptı. Sonra dizüstüyü bana çevirdi. “Tamam.”
            ~ Bir şey kırıldı. Sesini duymadım. Sonra duyacağım.
          `),
          next: 'ARA_SON_1',
        }),
        option('TK_GIRIS', 'Eski ortağın e-postasına girip bir bakalım. Bir dakika.', {
          score: { SAVUNMA_STRATEJISI: -200 },
          effects: [inc('ethics'), raise('karartma')],
          bad: 'Başkasının hesabına izinsiz girmek bilişim sistemine girme suçudur (TCK 243); bu yolla elde edilen hiçbir şey delil olamaz (CMK 206/2-a) ve avukat suça iştirak etmiş olur (Av.K. 34).',
          responses: B(`
            > Tarık bir şifre yazdı. Ekran açıldı. Gelen kutusu. Bir sürü “Saygılar.”
            ~ Ne bulursak bulalım, artık hiçbiri delil değil. Ve biz, onun yaptığını yaptık.
          `),
          next: 'ARA_SON_1',
        }),
      ],
    }),
    decisionNode('ARA_SON_1', [{ to: 'ARA_SON_2' }], {
      ...C4,
      title: 'Son gece',
      onEnter: [
        ...araSonDelivery.effects,
        { type: 'IF', when: all(flag('suc_duyurusu'), flag('ozan_uyarildi')), then: [raise('laptop_kayip')] },
      ],
      lines: B(`
        # DURUŞMADAN ÖNCEKİ GECE |bg=buro_gece
        > Tarık gittikten sonra büroda yalnız kaldım. Panoda üç haftanın kâğıtları.
      `),
    }),
    decisionNode('ARA_SON_2', [{ to: 'ARA_SON_3' }], {
      ...C4,
      title: 'Son gece',
      lines: [
        W(
          has('ev_laptop'),
          `
          > Gece on birde telefon çaldı. Ekranda bilinmeyen bir numara. Açtım; savcılığın kalemi, nöbetçi bir kâtip. |fx=flash
          ?NÖBETÇİ KÂTİP: Avukat hanım, suç duyurunuz üzerine bugün Tekin Yapı Danışmanlık’ta arama yapıldı. Arşiv dolabında bir dizüstü bulundu. Arkasında bir etiket var: “Aksoy Tekin Demirbaş 07.”
          ?NÖBETÇİ KÂTİP: Açıkmış. Ekranda bir mesajlaşma uygulaması açık duruyormuş; bir hesap oturumu. El konuldu, mühürlendi. Yarın duruşmada Savcı Bey bilgi verecek.
          P: Teşekkür ederim. Gerçekten teşekkür ederim.
          > Telefonu kapattım. Bir süre karanlıkta oturdum. Kalbim, o kadının altı ay önceki kalbi gibi çarpıyordu.
          ~ Açıkmış. Altı aydır açık bir ekran. Kimse kapatmamış; belki kapatmaya gerek görmemiş, belki unutmuş. O açık ekran, üç gece bir kadının hayatını yaktı. Ve yarın, o ekran konuşacak.
        `,
        ),
        W(
          flag('laptop_kayip'),
          `
          > Gece on birde telefon çaldı. Savcılığın kalemi.
          ?NÖBETÇİ KÂTİP: Suç duyurunuz üzerine bugün Tekin Yapı’da arama yapıldı. Aranan dizüstü bulunamadı. Şüpheli “yıllar önce attım” demiş.
          ~ Yıllar önce değil. Üç hafta önce, belki. Bir ziyaretten sonra. Bir kestane şekeri kutusundan sonra.
        `,
        ),
        W(
          flag('suc_mechul'),
          `~ Suç duyurusu kimliği belirsiz kişiler hakkında. Savcılık bir dosya açtı. Dosyalar yavaş yürür.`,
        ),
        O(`~ Savcılığa bir şey yazmadım. Yarın her şeyi salonda söyleyeceğim. Belki de söyleyemeyeceğim.`),
      ],
    }),
    decisionNode('ARA_SON_3', [{ to: 'ARA_SON' }], {
      ...C4,
      title: 'Son gece',
      lines: [
        W(
          has('ded_ip_tekin'),
          `
          ~ Panoda üç iplik artık tek bir yere bağlanıyor. Bir dizüstü: ofise dönmeyen 07. Bir hat: 85.105.44.17, Tekin Yapı Danışmanlık. Bir üslup: “Sn.”, üç nokta, “Saygılar.”
          ~ Ve yarın o adresin sahibi, o dizüstünün zimmetlisi, tanık kürsüsünde yemin edecek. “Bildiğimi dosdoğru söyleyeceğime” diyecek. Bakalım söyleyebilecek mi.
          ~ İsmi ben koymadım. Bir zimmet listesi, bir sağlayıcı yazısı ve bir e-posta çıktısı koydu. Ben yalnızca onları aynı masaya dizdim.
        `,
        ),
        W(
          has('ded_laptop_ozan'),
          `~ 07 ofise dönmedi. Bunu biliyorum. O gecelerde nerede olduğunu bilmiyorum.`,
        ),
        W(has('ded_bagli'), `~ Cihaz 3. Bir dizüstü. Kimin elinde? Hâlâ bilmiyorum. Belki bilmem gerekmiyor.`),
        O(`~ Bir sütun, bir şüphe. Yarın bunun yetip yetmediğini göreceğim.`),
      ],
    }),
    story('ARA_SON', {
      ...C4,
      title: 'Son gece',
      background: 'sokak_yagmur',
      lines: [
        W(
          flag('karartma'),
          `
          > Işığı söndürdüm. Merdivenden inerken elim tırabzana yapıştı. |bg=sokak_yagmur
          ~ Yarın bir salona gireceğim. İçimde bir şey, o salona ait değil.
        `,
        ),
        O(`
          > Işığı söndürdüm. Panoya son kez baktım: üç haftanın emeği, iplerle birbirine bağlı. Bu kez ortadaki boşluk dolmuştu.
          > Bir demirbaş listesi, bir sağlayıcı yazısı, bir hesap dökümü, bir hastane formu, bir e-posta çıktısı. Hepsi aynı yöne bakıyordu; aynı masaya, aynı boş dok istasyonuna.
          > Merdivenden indim. Dışarıda yağmur dinmişti; kaldırımlar sokak lambalarının altında parlıyordu. Tophane uyuyordu. |bg=sokak_sabah
          ~ Üç hafta önce elimde bir sütun vardı; bir tablonun kimsenin okumadığı son sütunu. Yarın elimde bir insan olacak: bir cihaz, bir hat, bir imza.
          ~ Kâğıtlar konuşacak. Ben yalnızca onların sesini salona taşıyacağım. İsmi ben koymayacağım; onlar koyacak.
        `),
      ],
      choices: [cont('ARA_SON_DEVAM', 'Duruşmaya git', 'T_00', { role: 'PRIMARY' })],
    }),
  ],
  triggers: [
    {
      id: 'tg_ara_day',
      scope: HUB,
      priority: 1,
      when: all(cmp(v('ara_ap'), '<=', 0), cmp(v('ara_day'), '<', 2)),
      goto: 'ARA_DAY_END',
    },
  ],
  discoveryPaths: [...araDayEnd.discoveryPaths, ...araSonDelivery.discoveryPaths],
};

function choiceNodeSuc() {
  return {
    id: 'ARA_SUC',
    type: 'CHOICE' as const,
    ...C4,
    title: 'Suç duyurusu',
    background: 'buro' as const,
    lines: B(`
      > Savcılığa bir dilekçe. Kimin hakkında, hangi suçtan, hangi dayanakla? Bir isim yazarsan, o ismin altını kâğıtlar doldurmalı.
      leyla: İsim yazmak kolay Deniz. Yazdığın ismin altında ne var, onu göster.
    `),
    prompt: { speaker: 'narrator' as const, text: 'Dilekçeye ne yazacaksın?' },
    choices: [
      option('SUC_OZAN', 'Ozan Tekin hakkında: hesabın 07’den kullanılması; dizüstünün aranması ve el konulması talebiyle', {
        enabledWhen: ref('ozan_dayanak'),
        lockedReason: 'Somut dayanak gerekli: cihaz 3’ün ne olduğu ve 07’nin kimde kaldığı.',
        score: { USUL_BILGISI: 80 },
        effects: [raise('suc_duyurusu')],
        good: 'Somut dayanaklı suç duyurusu (CMK 158): cihaz 3 = OFIS-LAPTOP-07, 07’nin zimmeti ve iadesizliği. Arama ve el koyma savcılığın ve hâkimin işidir (CMK 116 vd., 127); avukat kendisi kovalamaz.',
        responses: B(`
          > Dilekçeyi dört sayfada yazdım. Ekleri kalınca: noter tespitli hesap verisi, demirbaş listesi, sağlayıcının yazısı, Ek-3’ün bir kopyası.
          > Sonuna somut bir talep koydum: “07 numaralı dizüstünün bulunması, aranması ve el konulması; hesabı ele geçiren kişi hakkında soruşturma açılması.”
          leyla: Avukat dedektif değildir Deniz. Biz kovalamayız, savcılığa yazarız. Arama kararı hâkimin, infaz savcınındır. Bizim işimiz dayanağı kusursuz koymak.
          P: Dayanak kusursuz. Bir zimmet, bir hat, bir oturum. İsmi ben koymuyorum; kâğıtlar koyuyor.
          ~ On yıllık bir dostluğun sonunu bir dilekçeyle yazdım. Ama o dostluğu bitiren ben değilim; üç gece, saat ikide, o bitirdi.
        `),
        next: HUB,
      }),
      option('SUC_MECHUL', 'Kimliği belirsiz kişi(ler) hakkında: hesabın başka bir cihazdan kullanılması', {
        enabledWhen: has('ded_bagli'),
        lockedReason: 'Önce mesajların başka bir cihazdan çıktığını göstermelisin.',
        score: { USUL_BILGISI: 40 },
        effects: [raise('suc_mechul')],
        neutral: 'Hukuken doğru ama genel bir suç duyurusu; savcılık soruşturma açar, ama kimseyi aramak için somut bir dayanak yoktur.',
        responses: B(`> Dilekçe iki sayfa. Kimseyi göstermiyor. Yalnızca bir kapının açık kaldığını.`),
        next: HUB,
      }),
      option('SUC_MELIS', 'Katılan hakkında: suç uydurma', {
        score: { USUL_BILGISI: -80 },
        bad: 'Hiçbir dayanağı olmayan bir suç duyurusu iftira (TCK 267) riski taşır ve duruşmada savunmanın güvenilirliğini düşürür.',
        responses: B(`
          leyla: Dur. Elinde ne var? Bir müvekkilin öfkesi mi? Bunu gönderirsen ben imzalamam.
          ~ Göndermedim. Ama yazdığım için bile utandım.
        `),
        next: HUB,
      }),
      { id: 'SUC_GERI', kind: 'CONTINUE' as const, label: 'Şimdilik yazma', role: 'BACK' as const, next: HUB },
    ],
  };
}
