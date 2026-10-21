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
      choices: [cont('ARA_BASLA', 'Arayı planla', HUB, { role: 'PRIMARY', effects: [...p2.start()] })],
    }),
    p2.hub({
      ...C4,
      title: 'Ara',
      background: 'buro',
      onEnter: [set('taps3', 6), set('ex3b', 9), set('ex5', 5), set('ex6', 5), set('ex7', 4), set('ex8', 4)],
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
              description: 'Noter tespitli döküm · 9 deneme',
            }),
            p2.activity('A_RAPOR', 'Bilirkişi raporu', 'ARA_RAPOR', {
              once: true,
              next: 'ARA_RAPOR',
              visibleWhen: all(flag('bilirkisi_istendi'), cmp(v('ara_day'), '==', 2)),
              description: 'Dr. Uçar · imaj incelemesi · 5 deneme',
            }),
            p2.activity('A_HRESMI', 'Hastanenin resmî yazısı', 'ARA_HRESMI_GIRIS', {
              once: true,
              next: 'ARA_HRESMI_GIRIS',
              visibleWhen: flag('hastane_istendi'),
              description: 'Mahkemenin müzekkeresine cevap · 4 deneme',
            }),
            p2.activity('A_VAKIF', 'Vakfın ihale dosyası', 'ARA_VAKIF_GIRIS', {
              once: true,
              next: 'ARA_VAKIF_GIRIS',
              visibleWhen: visited('INV_T_HAYRI'),
              description: 'Hayri Bey’in izniyle · gelen evrak defteri',
            }),
            p2.activity('A_SUC', 'Savcılığa suç duyurusu', 'ARA_SUC', {
              next: 'ARA_SUC',
              visibleWhen: all(has('ded_bagli'), not(flag('suc_duyurusu')), not(flag('suc_mechul'))),
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
        {
          id: 'A_BEKLE',
          kind: 'NAVIGATE',
          label: 'Haftayı kapat',
          description: 'Kalan eylem puanlarını bırak',
          // İlk hafta en az iki iş yapılmadan kapatılamaz (ara boş geçirilemez; Nurten ve ev her zaman açıktır).
          // İkinci hafta her zaman kapatılabilir: duruşma günü gelir.
          visibleWhen: all(cmp(v('ara_ap'), '>', 0), any(cmp(v('ara_ap'), '<=', 1), cmp(v('ara_day'), '==', 2))),
          confirm: 'Haftanın kalan eylem puanları yanar. Emin misin?',
          effects: [set('ara_ap', 0)],
          next: '$stay',
        },
        nav(
          'GO_T',
          'DURUŞMADAN ÖNCEKİ AKŞAM',
          {
            routes: [
              // Tarık'ın teklifi ancak dava güçlendiğinde gelir: sütun ve 9 Kasım salonda kurulmuş, bilirkişi raporu
              // okunmuş, hesap dökümü elde, 07'nin izi sürülmüş. Saik olarak elde kalan tek kâğıt 25 Ekim mesajlarıdır.
              {
                when: all(
                  has('ev_hesap'),
                  flag('contra_s3'),
                  flag('kilit_mahkemede'),
                  visited('ARA_RAPOR'),
                  // Somut dayanaklı suç duyurusu verilmiş: Tarık, savcılığın yavaşlığına kendi yoluyla karşılık vermek ister.
                  flag('suc_duyurusu'),
                ),
                to: 'ARA_TEKLIF',
              },
              { to: 'ARA_SON_1' },
            ],
          },
          {
            role: 'PRIMARY',
            confirm: 'Ara evresi biter. Emin misin?',
            enabledWhen: all(cmp(v('ara_day'), '==', 2), any(ref('ara_ilerleme'), cmp(v('ara_ap'), '<=', 0))),
            lockedReason: 'Duruşmaya iki gün var. Önce arayı kullan: en az üç iş ya da bütün eylem puanları.',
          },
        ),
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
          > “85.105.44.17 numaralı sabit IP adresi, sorulan tarih ve saatlerde Tekin Yapı Danışmanlık Ltd. Şti. adına kayıtlı iş hattına atanmıştır. Tesis adresi: Nilüfer.”
          ~ 85.105.44.17. Üç gece. Bir abone adı. Okudum. Bir daha okudum. Tahtaya iğneledim.
          ~ Bir abone adı bir suçlama değildir. Ama bir soruyu bir adrese bağlar; ve o adresin bir kapısı, bir anahtarı, bir sahibi vardır. Bundan sonrasını yine kâğıtlar söyleyecek.
        `,
        ),
        O(`
          # İKİNCİ HAFTA — ARSLAN HUKUK |bg=buro_gece
          > Bir hafta geçti. Bilirkişi imajı aldı; rapor yazıyor. Kalemde başka bir şey yok.
          > Panoya her sabah aynı soruyla baktım: bu kâğıtlardan hangisi salonda konuşacak, hangisi yalnızca benim duvarımda kalacak? Bir kâğıdı delil yapan şey, onu kimin yazdığı ve kimin tanıyacağıdır.
          ~ Leyla bir keresinde demişti: “Dosya bir bina gibidir; taşıyıcı duvarı bul, gerisi süs.” Benim taşıyıcı duvarım hâlâ yarım.
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
        > Kutuyu masanın köşesine bıraktı; kurdelesi özenle bağlanmıştı. Dışarıda yağmur yeniden başlamıştı, cama ince ince vuruyordu. Bir tanığın, bir avukatın bürosunda işi yoktur; bunu ikimiz de biliyorduk.
      `),
      choices: [
        option('ARA_OZ_KAPA', 'Teşekkür et; dosyayı tanıkla konuşmayacağını kibarca söyle.', {
          score: { SAVUNMA_STRATEJISI: 50 },
          good: 'Dosyanın bir tanığıyla savunmanın değerlendirmelerini paylaşmamak hem meslek kuralı hem stratejidir.',
          responses: B(`
            P: Teşekkür ederim Ozan Bey. Siz dosyanın tanığısınız. Bilirkişiyi de, dosyayı da duruşmada konuşalım.
            ozan: Tabii, tabii. Haklısınız üstat. Usul. Ben de öyle derim hep.
            > Kalktı. Kapıda durdu, döndü, gülümsedi.
            ozan: Kestaneyi soğutmayın ama. Hayırlı akşamlar.
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
            ozan/mutlu: Merak iyidir üstat. Hayırlı akşamlar.
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
            melis: Ortaklığa başlamadan önce, geçen kış ofise gittiğimde ben de oradan bir iki kere yazmıştım. Mart’tan sonra o dizüstü yoktu. Ortak gidince gitti sandım.
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
          effects: [raise('melis_kapandi')],
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
        nurten: Aksoy Tekin. Üç yıl defterlerini ben tuttum. Demirbaş numaralarını ezbere bilirim kızım: plotter 01, ofis tableti 03, Tarık Bey’in dizüstüsü 05, Ozan Bey’inki 07. Yedi ve sonrası Ozan Bey’in zimmetindeydi.
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
          effects: [{ type: 'DISCOVER', evidence: 'clue_uslup_ozan' }],
          responses: B(`
            nurten: “Bozuldu, attım” dedi. Ben “Tutanak tutalım, demirbaştan düşelim” dedim. “Gerek yok Nurten Hanım” diye bir e-posta yazdı.
            nurten: Kırk yıllık muhasebeciyim. “Gerek yok” denen yere not düşerim. Düştüm; e-postayı da bastım, protokolün arkasına zımbaladım.
            > Çıktıyı önüme koydu. Gönderen: o.tekin. “Sn. Sarı, 07 için tutanağa gerek görmüyorum... Saygılar.”
            ~ Büyük harf, üç nokta, noktalı bir “Saygılar.” Bir e-posta. Panoya iğnelenecek bir kâğıt daha; neyle yan yana duracağına tahta karar verecek.
          `),
        }),
        { id: 'NUR_BITIR', kind: 'CONTINUE', label: 'Teşekkür et', role: 'BACK', next: HUB },
      ],
    }),
    toHub(
      documentExam('ARA_DEMIRBAS', {
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
            '“07 · Dizüstü + dok · Zimmet: O. Tekin.” İade hanesi boş; kenarda “O.T. bozuldu dedi.” Bütün demirbaşların iadesi işaretli, yalnız 07 değil. Dok ofiste kaldı; dizüstü tutanaksız kayboldu.',
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
      }),
      HUB,
    ),
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
        > Masanın üstünde bir modem, ışıkları yeşil yanıp sönüyor; yanında Ece’nin bir resmi, bantla duvara tutturulmuş. Bir evin bütün hattı bu küçük kutudan geçiyor; kim, ne zaman, nereden bağlandı, hepsi orada yazılı.
        ~ Bir ev, bir hat. Polis buraya hiç gelmemiş; çünkü polis bir adresi değil, bir telefonu aramış.
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
    toHub(
      documentExam('ARA_RAPOR', {
        ...C4,
        title: 'Bilirkişi raporu',
        hud: ['ex6'],
        background: 'buro',
        lines: B(`
        # ARSLAN HUKUK · ARŞİV MASASI — 09.40 |bg=buro
        > Kalemden UYAP’a düşen rapor: on bir sayfa, iki ek. Dr. Nazlı Uçar’ın imzası her sayfanın altında, aynı açıyla, aynı mürekkeple.
        > Leyla raporu masama bıraktı ama elini üstünden çekmedi.
        leyla: Bilirkişi senin tanığın değil Deniz. Mahkemenin gözü. Lehine olanı da, aleyhine olanı da aynı soğukkanlılıkla yazar. İkisini de oku.
        leyla: Duruşmada ona soracağın her soru bu raporun bir satırına dayanmalı. Okumadığın bir rapora soru sorarsan, bilirkişi sana değil, hâkime cevap verir; hâkim de sana bakar.
        ~ Bir rapor, bir sonuç cümlesi ve onu taşıyan satırlar. Polisin raporunda satırlar sonuçla kavga ediyordu. Bakalım bu kez nasıl.
        > Bir alet seç, sonra satıra dokun.
      `),
        header: { left: 'ADLİ BİLİŞİM BİLİRKİŞİ RAPORU · DR. N. UÇAR', right: 'İMAJ: 9f3a…c41e' },
        columns: [
          { label: 'BAŞLIK', flex: 0.8 },
          { label: 'TESPİT', flex: 3 },
        ],
        rows: [
          row('r1', ['Yöntem', 'İmaj hash’i yeniden hesaplandı: SHA-256 9f3a…c41e · 14.11 değeriyle eşleşti']),
          row('r2', [
            'Bulgu 1',
            'Ek-3 sender_device = 3 → bağlı cihaz kaydı: “OFIS-LAPTOP-07 · PUSULA Masaüstü (Windows)”',
          ]),
          row('r3', ['Bulgu 2', '09.11 01.40–06.10: ekran kilitli; kilit açma ya da dokunma olayı yok']),
          row('r4', [
            'Bulgu 3',
            '12.11 15.40–15.52: kilit açma, uygulama gezinmesi; cihazda 14 yeni ekran görüntüsü dosyası',
          ]),
          row('r5', ['Bulgu 4', '06.11 02.13 sohbet arşivleme olayı · kaynak cihaz: 3']),
          row('r6', ['Sınır', 'Cihaz 3’ün kendisi incelenmemiştir; onu kullanan kişi bu imajdan belirlenemez.']),
          row('r7', [
            'Kanaat',
            'Mesajların telefondan gönderildiği yönündeki kolluk değerlendirmesi teknik verilerle desteklenmemektedir.',
          ]),
        ],
        tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
        costVar: 'ex6',
        rules: [
          hit(
            'EX_R_CIHAZ',
            'mag',
            'r2',
            'clue_rapor_cihaz',
            80,
            'BULGU 1',
            'Büyüteci ilk bulguya tuttum. Bilirkişi aynı sonuca hiçbir dış kayda bakmadan, imajın kendisinden varmış. Gönderen cihaz 3, bir masaüstü uygulaması, bir Windows makinesi. İki ayrı yol, aynı kapıya çıkıyor.',
          ),
          hit(
            'EX_R_KILIT',
            'mag',
            'r3',
            'clue_rapor_kilit',
            80,
            'BULGU 2',
            '9 Kasım gecesi dört buçuk saat telefona tek parmak değmemiş: “dokunma olayı yok.” Hemşirenin bandı, onam formu, şimdi de makinenin günlüğü. Üç tanık; hiçbiri yalan söylemeyi bilmiyor.',
          ),
          hit(
            'EX_R_SS',
            'cmp',
            'r4',
            undefined,
            100,
            'BULGU 3 · DELİLİN İÇİNE YAZILAN',
            'Bulgu 3 ile Yöntem yan yana: on dört ekran görüntüsü telefonun hafızasına yazılmış, imaj iki gün sonra alınmış. Delil, kopyası alınmadan değiştirilmiş. Hash 14 Kasım’ı korur; 12’sini değil.',
            'USUL_BILGISI',
          ),
          hit(
            'EX_R_SINIR',
            'mag',
            'r6',
            undefined,
            60,
            'SINIR',
            'İyi bilirkişi bilmediğini de yazar: imaj, cihaz 3’ün başında kimin oturduğunu söyleyemez. Duruşmada bunu soracaklar. Cevap bir dizüstünde, bir hatta, bir demirbaş listesinde.',
            'SAVUNMA_STRATEJISI',
          ),
          hit(
            'EX_R_KANAAT',
            'mag',
            'r7',
            undefined,
            0,
            'KANAAT',
            'Kanaat cümlesi temkinli: “desteklenmemektedir.” Bilirkişiler “kesinlikle” demez. Ama bu temkinli cümle, polisin kesin cümlesini yerinden söküyor.',
          ),
        ],
        miss: docMiss('FB_RAPOR'),
        finish: { id: 'RAPOR_BITIR', label: 'Raporu kapat' },
      }),
      HUB,
    ),
    story('ARA_HRESMI_GIRIS', {
      ...C4,
      title: 'Hastanenin resmî yazısı',
      background: 'adliye',
      lines: B(`
        # ADLİYE · KALEM ODASI — 14.20 |bg=adliye
        > Mahkemenin müzekkeresine hastaneden cevap gelmiş: bir üst yazı, “aslı gibidir” damgalı birkaç sayfa. Kâtip dosyayı önüme koydu, kahvesine döndü.
        ?KALEMDEKİ KÂTİP: Hastane bir de defter sayfası göndermiş avukat hanım. Nöbet defteri. Kim istedi bilmem; siz istediyseniz, işte.
        ~ Babasının muvafakatiyle aldığımız kâğıtlar bir fotokopiydi. Bunlar mahkemenin istediği, hastanenin gönderdiği kâğıtlar. Aynı gece, bu kez resmî ağızdan.
        > Üst yazının altında başhekim yardımcısının imzası, köşesinde bir evrak numarası. Sayfaların her birinde mavi bir damga: “Aslı gibidir.” Bir fotokopiyle bir belge arasındaki fark, o mavi mürekkepte.
      `),
      choices: [{ id: 'HRESMI_BASLA', kind: 'CONTINUE', label: 'Yazıyı incele', next: 'ARA_HRESMI' }],
    }),
    toHub(
      documentExam('ARA_HRESMI', {
        ...C4,
        title: 'Hastanenin resmî yazısı',
        hud: ['ex8'],
        background: 'adliye',
        lines: B(`> Üst yazı ve ekleri. Bir alet seç, sonra satıra dokun.`),
        header: { left: 'DEVLET HASTANESİ BAŞHEKİMLİĞİ · MAHKEMEYE CEVAP', right: 'EK: 4 SAYFA' },
        columns: [
          { label: 'EK', flex: 0.8 },
          { label: 'KAYIT', flex: 3 },
        ],
        rows: [
          row('y1', [
            'Üst yazı',
            'Müzekkerenize istinaden Necati Aksoy’a ait 09.11 acil servis kayıtları ekte sunulmuştur.',
          ]),
          row('y2', ['Ek-1', 'Epikriz ve girişim onam formu (aslı gibidir) · onam 02.10 · saati yazan: Hmş. G. Tunç']),
          row('y3', [
            'Ek-2',
            'Nöbet defteri 09.11 · 01.40 · refakatçi Aksoy · telefon şarj istasyonunda emanet · paraf: G.T.',
          ]),
          row('y4', ['Ek-2', 'Nöbet defteri 09.11 · 06.05 · emanet telefon sahibine teslim · paraf: G.T.']),
          row('y5', ['Ek-3', 'Kamera kayıtları: otuz günlük saklama süresi dolduğundan mevcut değildir.']),
        ],
        tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
        costVar: 'ex8',
        rules: [
          hit(
            'EX_Y_NOBET',
            'mag',
            'y3',
            'clue_nobet',
            150,
            'YENİ İPUCU',
            'Nöbet defteri: “01.40 · refakatçi Aksoy · telefon şarj istasyonunda emanet.” Hemşire masasındaki bandın defterdeki karşılığı; aynı dakika, aynı paraf. Bant atılır, defter kalır. Bu sayfayı kürsüde, onu yazan ele göstermeliyim.',
            'ARASTIRMA',
          ),
          hit(
            'EX_Y_TESLIM',
            'cmp',
            'y4',
            undefined,
            40,
            'TESLİM',
            '06.05: telefon sahibine teslim. Kilit kaydındaki 06.10 açılışından beş dakika önce. Telefon dört buçuk saat bir hemşire masasındaydı; sahibine döndüğü an, ekran da uyandı.',
            'ARASTIRMA',
          ),
          hit(
            'EX_Y_KAMERA',
            'mag',
            'y5',
            undefined,
            0,
            'KAMERA',
            'Kamera yok. Kasım çoktan silinmiş. Görüntü olmayan yerde kâğıt konuşur.',
          ),
        ],
        miss: docMiss('FB_HRESMI'),
        finish: { id: 'HRESMI_BITIR', label: 'Yazıyı kapat' },
      }),
      HUB,
    ),
    story('ARA_VAKIF_GIRIS', {
      ...C4,
      title: 'Vakıf odası',
      background: 'buro',
      lines: B(`
        # KOZA HAN · VAKIF ODASI — 15.00 |bg=buro
        > Koza Han’ın avlusunda şadırvan yine kurumuş, ipek tezgâhları yağmura karşı naylonla örtülmüş. Vakıf odasında aynı kitap kokusu, aynı ince belli bardaklar.
        hayri: Gene geldin evladım. Duruşmayı duydum; bir sütunmuş, bir cihazmış. Ben anlamam. Ama bir şey anladım: sen dosyanın kenarını okuyorsun.
        P: İhale dosyasını görmem mümkün mü Hayri Bey? Gelen evrakı, teklifleri. Bir şey almayacağım; yalnızca bakacağım.
        hayri: Dosya vakfındır, sana veremem. Mahkeme isterse gönderirim, kanun neyse o. Ama gözünle bakmana kimse bir şey demez. Ben de buradayım zaten.
        hayri: Gelen evrakı sekreterlik kaydeder; ben imzalarım, okumam. Yaşlandıkça insan imzayı okumaktan daha kolay bulur. Kötü bir alışkanlık.
        > Önüme kalın, sırtı yıpranmış bir klasör koydu. Üstünde mürekkeple: “Eski Pirinç Han Restorasyonu · 2. kısım.”
      `),
      choices: [{ id: 'VAKIF_BASLA', kind: 'CONTINUE', label: 'Klasörü aç', next: 'ARA_VAKIF' }],
    }),
    toHub(
      documentExam('ARA_VAKIF', {
        ...C4,
        title: 'İhale dosyası',
        hud: ['ex7'],
        background: 'buro',
        lines: B(`> Gelen evrak defterinin ihaleyle ilgili sayfası. Bir alet seç, sonra satıra dokun.`),
        header: { left: 'BURSA KÜLTÜR VAKFI · GELEN EVRAK', right: 'ESKİ PİRİNÇ HAN' },
        columns: [
          { label: 'TARİH', flex: 0.9 },
          { label: 'TÜR', flex: 0.9 },
          { label: 'KONU', flex: 2.6 },
        ],
        rows: [
          row('v1', ['02.10', 'İlan', 'Eski Pirinç Han restorasyonu · son teklif 30.10']),
          row('v2', ['28.10', 'Teklif', 'Aksoy–Karaca Ortak Girişimi · restorasyon belgesi: M. Karaca']),
          row('v3', ['29.10', 'Teklif', 'Tekin Yapı Danışmanlık Ltd. Şti.']),
          row('v4', ['30.10', 'Teklif', 'Marmara Restorasyon A.Ş.']),
          row('v5', [
            '10.11 · 09.12',
            'E-posta',
            'Tekin Yapı: “Sn. Kurul, ortak girişimin bir üyesine ilişkin özel kayıtların dolaşımda olduğu... Saygılar.”',
          ]),
          row('v6', ['19.11', 'Kurul kararı', 'Değerlendirme askıya alındı']),
        ],
        tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
        costVar: 'ex7',
        rules: [
          hit(
            'EX_V_YAZI',
            'mag',
            'v5',
            'clue_vakif_yazi',
            150,
            'YENİ İPUCU',
            '10 Kasım 09.12. Ses kaydı yedi saat önce gitmiş; Hayri Bey kimseye söylememiş, dedikodu ertesi hafta yayılmış. Ama bu e-posta kaydı şimdiden biliyor. “Sn.” ile açılıyor, “Saygılar.” ile kapanıyor.',
            'ARASTIRMA',
          ),
          hit(
            'EX_V_TEKLIF',
            'cmp',
            'v3',
            undefined,
            60,
            'ÜÇ TEKLİF',
            'Ortak girişimin teklifi Melis’in belgesine yaslanıyor; o çekilirse teklif düşer, geriye büyük bir şirket ve Tekin Yapı kalır. Kimin işine yarar? Bu bir delil değil; bir soru. Ama doğru soru.',
            'ARASTIRMA',
          ),
          hit(
            'EX_V_KARAR',
            'mag',
            'v6',
            undefined,
            0,
            'KURUL KARARI',
            'Kurul 19 Kasım’da değerlendirmeyi askıya almış; gerekçede “kamuoyuna yansıyan soruşturma” yazıyor. Bir dedikodu bir ihaleyi durdurmuş.',
          ),
        ],
        miss: docMiss('FB_VAKIF'),
        finish: { id: 'VAKIF_BITIR', label: 'Klasörü kapat' },
      }),
      HUB,
    ),
    choiceNodeSuc(),
    toHub(
      deductionBoard('ARA_CIKARIM', {
        ...C4,
        title: 'Çıkarım tahtası',
        background: 'buro_gece',
        lines: B(`
          > İki kart seç. Yeni kartlar tahtada: demirbaş, koli, sağlayıcının yanıtı.
          ~ Üç hafta önce bu pano bir soru işaretiydi. Şimdi iplikler bir yere doğru gerilmeye başladı; ama bir ipliği ben gererim, bir ipliği kâğıt. İkisini karıştırmamalıyım.
        `),
        pool: [...BOARD_POOL, 'clue_koli', 'clue_envanter', 'ev_isp', 'clue_vakif_yazi', 'clue_ev_hat'],
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
            'Üç gecenin oturumu 85.105.44.17’den. Sağlayıcıya göre o adres Tekin Yapı Danışmanlık’ın iş hattı. Müvekkilin evi değil, ofis değil; bir başka firmanın, sabit bir hattı.',
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
          rec(
            'CB_A_VAKIF',
            'clue_vakif_yazi',
            'clue_uslup_tehdit',
            'ded_uslup_ozan',
            200,
            'Aynı imza, aynı sabah',
            'Vakfa giden yazı “Sn. Kurul” diye açılıyor, üç noktayla duruyor, “Saygılar.” ile kapanıyor. Tehditlerle aynı el. Ve bu el, kaydın varlığını herkesten bir hafta önce biliyordu.',
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
        > Büro boşalmıştı. Yağmur yeniden başlamış, oluklardan taşan su kaldırıma vuruyordu. Panoda üç haftanın kâğıtları; ortada, kırmızı bir raptiyeyle, bir demirbaş listesi.
        > Tarık geç saatte geldi, ıslanmıştı. Elinde kendi dizüstüsü. Masanın üstüne koydu, kapağını açtı; ekranın ışığı yüzüne vurdu.
        tarik: Bir şey düşündüm. İki şey. Üç haftadır uyumuyorum, kafam çalışıyor. Dinleyin önce, sonra beni durdurun; durdurmanız için anlatıyorum zaten.
        tarik: Çünkü tek başıma kalınca bu iki şey bana çok mantıklı geliyor. Ve mantıklı gelmesi beni korkutuyor.
        tarik: Birincisi: Ozan’ın e-postası. Ortakken şifresini biliyordum. Hâlâ aynıdır; o hiçbir şeyi değiştirmez. Girer bakarız. Bir dakika.
        tarik: İkincisi: noterden aldığımız hesap dökümü. Yarın bir kopyasını daha vereceğiz; 25 Ekim’de Melis’e yazdıklarım orada. Onlar olmasa, savcının elinde saik de kalmaz. Kopyadan silerim, kimse bilmez.
        > Kurşun kalem masada. Tıkırdamıyor.
        ~ İki kapı. İkisi de açık. İkisi de bir uçuruma açılıyor.
      `),
      choices: [
        option('TK_RED', 'Hayır. İkisini de yapmayacağız.', {
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
        option('TK_SIL', '25 Ekim mesajlarını kopyadan çıkaralım; saik ortadan kalkar, kimse fark etmez.', {
          score: { SAVUNMA_STRATEJISI: -200 },
          effects: [inc('ethics'), raise('karartma')],
          bad: 'Mahkemeye sunulacak dijital veriyi ayıklamak delil karartmadır (TCK 281); avukatın buna katılması meslekten çıkarmayı gerektirebilecek bir ihlaldir (Av.K. 34). Üstelik hash değeri değişir; fark edilir.',
          responses: B(`
            > Tarık birkaç dakika klavyede bir şeyler yaptı. Ekranda satırlar birer birer kayboldu; 25 Ekim, 23.48, “bu şartlarla devam edemeyiz melis”. Sonra dizüstüyü bana çevirdi. “Tamam.”
            > Yeni kopyayı bir flaş belleğe aldım, zarfa koydum, zarfı çantama. Ellerim titremiyordu. Titremesi gerekirdi.
            ~ Bir şey kırıldı. Sesini duymadım. Sonra duyacağım. Polisin iki gün mühürsüz bıraktığı bir telefonu üç hafta eleştirdim; şimdi kendi elimle bir dökümü değiştirdim.
          `),
          next: 'ARA_SON_1',
        }),
        option('TK_GIRIS', 'E-postasına bir bakalım; bir şey bulursak doğrudan savcılığa iletiriz.', {
          score: { SAVUNMA_STRATEJISI: -200 },
          effects: [inc('ethics'), raise('karartma')],
          bad: 'Başkasının hesabına izinsiz girmek bilişim sistemine girme suçudur (TCK 243); bu yolla elde edilen hiçbir şey delil olamaz (CMK 206/2-a) ve avukat suça iştirak etmiş olur (Av.K. 34).',
          responses: B(`
            > Tarık bir şifre yazdı. Ekran açıldı. Gelen kutusu: ihale yazışmaları, faturalar, bir sürü resmî selamlama.
            > Ekranın köşesinde, bağlantının nereden kurulduğunu gösteren küçük bir simge yanıp sönüyordu: bu büronun hattı. Kimse ona bakmadı.
            ~ Ne bulursak bulalım, artık hiçbiri delil değil. Ve biz, onun yaptığını yaptık: başkasının kapısını, başkasının anahtarıyla açtık.
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
      lines: [
        W(
          visited('ARA_TEKLIF'),
          `
          # DURUŞMADAN ÖNCEKİ GECE |bg=buro_gece
          > Tarık gittikten sonra büroda yalnız kaldım. Panoda üç haftanın kâğıtları.
        `,
        ),
        O(`
          # DURUŞMADAN ÖNCEKİ GECE |bg=buro_gece
          > Büro boşalmıştı. Tarık akşam bir kez aradı, yalnızca “yarın dokuzda kapıdayım” dedi. Panoda üç haftanın kâğıtları.
        `),
      ],
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
          > Telefonu kapattım. Bir süre karanlıkta oturdum. Kalbim, o kadının kasımdaki kalbi gibi çarpıyordu.
          ~ Açıkmış. Aylardır açık bir ekran. Kimse kapatmamış; belki kapatmaya gerek görmemiş, belki unutmuş. O açık ekran, üç gece bir kadının hayatını yaktı. Ve yarın, o ekran konuşacak.
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
          ~ Ve yarın o adresin sahibi, o dizüstünün zimmetlisi, tanık kürsüsüne çıkacak. Bildiğini dosdoğru söyleyecek mi, göreceğiz.
          ~ İsmi ben koymadım. Bir zimmet listesi, bir sağlayıcı yazısı ve bir e-posta çıktısı koydu. Ben yalnızca onları aynı masaya dizdim.
        `,
        ),
        W(has('ded_laptop_ozan'), `~ 07 ofise dönmedi. Bunu biliyorum. O gecelerde nerede olduğunu bilmiyorum.`),
        W(
          all(has('ded_hastane'), flag('gulay_istendi')),
          `
          ~ Yarın bir hemşire kürsüye çıkacak. Bir bant, bir saat, bir imza. Bir de bilirkişinin “dokunma olayı yok” satırı. 9 Kasım gecesini kâğıtlar anlatacak; ben yalnızca sırayı tutacağım.
          ~ Öbür iki gece? Bir sütun, bir rakam. Kimin elinde olduğunu bilmeden bir rakamla bir insanı aklamak, bir rakamla mahkûm etmek kadar zor.
        `,
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
        W(
          not(has('ded_ip_tekin')),
          `
          > Işığı söndürdüm. Panoya son kez baktım: üç haftanın emeği, iplerle birbirine bağlı. Ortada hâlâ bir boşluk vardı; bir iplik, bir yere bağlanmadan sallanıyordu. |bg=sokak_yagmur
          > Merdivenden indim. Dışarıda yağmur incelmişti; Tophane’nin saat kulesi on biri vurdu, sesi ıslak sokaklarda uzadı.
          ~ Yarın elimdeki kâğıtlar ne kadar ses çıkarırsa, o kadarı salona girecek. Fazlasını ben söyleyemem; söylersem, o artık delil değil, bir avukatın umududur.
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
      option('SUC_OZAN', 'Ozan Tekin hakkında; 07’nin aranması ve el konulması talebiyle', {
        enabledWhen: ref('ozan_dayanak'),
        lockedReason:
          'Somut dayanak gerekli: cihaz 3’ün ne olduğu, 07’nin kimde kaldığı ve tehdit hattının kime ait olduğu.',
        score: { USUL_BILGISI: 80 },
        effects: [raise('suc_duyurusu')],
        good: 'Somut dayanaklı suç duyurusu (CMK 158): cihaz 3 = OFIS-LAPTOP-07, 07’nin zimmeti ve iadesizliği. Arama ve el koyma savcılığın ve hâkimin işidir (CMK 116 vd., 127); avukat kendisi kovalamaz.',
        responses: B(`
          > Dilekçeyi dört sayfada yazdım. Ekleri kalınca: Ek-3’ün bir kopyası, demirbaş listesi, sağlayıcının mahkemeye yazısı.
          > Sonuna somut bir talep koydum: “07 numaralı dizüstünün bulunması, aranması ve el konulması; hesabı ele geçiren kişi hakkında soruşturma açılması.”
          leyla: Avukat dedektif değildir Deniz. Biz kovalamayız, savcılığa yazarız. Arama kararı hâkimin, infaz savcınındır. Bizim işimiz dayanağı kusursuz koymak.
          P: Dayanak kusursuz. Bir zimmet, bir hat, bir oturum. İsmi ben koymuyorum; kâğıtlar koyuyor.
          ~ On yıllık bir dostluğun sonunu bir dilekçeyle yazdım. Ama o dostluğu bitiren ben değilim; üç gece, saat ikide, o bitirdi.
        `),
        next: HUB,
      }),
      option('SUC_MECHUL', 'Kimliği belirsiz kişiler hakkında; hesabın başka cihazdan kullanılması', {
        enabledWhen: has('ded_bagli'),
        lockedReason: 'Önce mesajların başka bir cihazdan çıktığını göstermelisin.',
        score: { USUL_BILGISI: 40 },
        effects: [raise('suc_mechul')],
        neutral:
          'Hukuken doğru ama genel bir suç duyurusu; savcılık soruşturma açar, ama kimseyi aramak için somut bir dayanak yoktur.',
        responses: B(`> Dilekçe iki sayfa. Kimseyi göstermiyor. Yalnızca bir kapının açık kaldığını.`),
        next: HUB,
      }),
      option('SUC_MELIS', 'Katılan hakkında; mesajları kendisinin kurguladığı iddiasıyla suç uydurma', {
        score: { USUL_BILGISI: -80 },
        bad: 'Suç uydurma (TCK 271) iddiasının hiçbir dayanağı yok; dayanaksız bir suç duyurusu iftira (TCK 267) riski taşır ve savunmanın güvenilirliğini düşürür.',
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
