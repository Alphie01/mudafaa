import {
  all,
  any,
  back,
  cmp,
  cont,
  decisionNode,
  deliver,
  flag,
  has,
  ifThen,
  inc,
  nav,
  not,
  option,
  raise,
  ref,
  set,
  story,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ResponseBlock } from '../../../tools/content/src/kit/index.js';
import { B, O, W } from './dsl.js';
import { C2, p1 } from './shared.js';

// 50-inv-hub: soruşturma hub'ı (3 gün × 4 EP), gün sonu (teslimler) ve akşam sahneleri, Leyla'ya danışma ve
// duruşmadan önceki gece (koşullu hafıza zinciri: her DECISION kendi koşullu satırını akıtır).

const dayEndDelivery = deliver('INV_DAY_END', []);
const nightDelivery = deliver('INV_GECE_1', []);

const hubLines: ResponseBlock[] = [
  W(
    cmp(v('day'), '==', 1),
    `
    # GÜN 1/3 · BİRİNCİ CELSEYE 12 GÜN
    > Masamda dosyanın bir kopyası, duvarda boş bir pano, elimde bir kutu raptiye. Bir davayı çözmek, bir binayı çizmek gibidir: önce zemini bilirsin, sonra duvarı çıkarsın.
    > Hedef: telefon Şube’de kimin elindeydi? O mesajlar, bir sanığın telefonunun içinde nasıl olup da öyle rahat duruyor? Önce kolluğun kâğıtlarını oku, sonra müvekkili dinle.
    ~ Herkes telefona baktı. Ben telefonun etrafına bakacağım.
  `,
  ),
  W(
    all(cmp(v('day'), '==', 2), has('clue_cihaz3')),
    `
    # GÜN 2/3 · BİRİNCİ CELSEYE 9 GÜN
    > Pano dolmaya başladı. Bir iplik “cihaz 3” yazan bir karttan çıkıp boşlukta sallanıyor; henüz bir yere bağlanmıyor.
    > Hedef: o “cihaz 3” nedir? Tarık’ın bir telefonu var. Peki bir hesabın kaç kapısı olur? Ve o üç gece, saat ikide, Tarık tam olarak neredeydi?
    ~ Bir hesap bir eve benzer. Kaç kapısı olduğunu bilmeden içeride kimin olduğunu söyleyemezsin.
  `,
  ),
  W(
    cmp(v('day'), '==', 2),
    `
    # GÜN 2/3 · BİRİNCİ CELSEYE 9 GÜN
    > Pano yarı dolu, ama ortadaki boşluk büyük. Bir şeyi atladığımı hissediyorum; raporun eklerinde, kimsenin bakmadığı bir sütunda.
    > Hedef: üç gece. Saat ikiyi geçerken Tarık neredeydi, telefonu neredeydi? Kolluk raporunun eklerini sonuna kadar okudun mu, yoksa sonucuyla mı yetindin?
  `,
  ),
  O(`
    # GÜN 3/3 · BİRİNCİ CELSEYE 6 GÜN
    > Son gün. Yarın dilekçe kapanıyor; mahkemeden isteyeceklerimi bugün yazmazsam, duruşmada elim boş kalır.
    > Hedef: talepler. Duruşmada kimi dinletmek, neyi inceletmek istiyorsun? Panodaki iplikleri topla; dağınık bir pano, dağınık bir savunmadır.
    ~ Bir bilirkişi, bir tanık, bir kayıt. Doğru üç talep, on iki günlük emeğin tamamını taşıyabilir.
  `),
];

export const invHub: CasePart = {
  nodes: [
    p1.hub({
      ...C2,
      title: 'Soruşturma',
      background: 'buro',
      // Etkinliklerin kaynak sayaçları hub'a her dönüşte tazelenir: etkinlikler tek seferlik olduğundan oyunu
      // değiştirmez, ama doğrulayıcının durum uzayında artık değerleri bir daha ayırt edilmez.
      onEnter: [
        set('taps', 7),
        set('taps2', 6),
        set('ex1', 5),
        set('ex2', 10),
        set('ex3', 9),
        set('ex4', 4),
        set('min', 15),
      ],
      lines: hubLines,
      scenePreview: { scene: 'sc_ofis' },
      tabs: [
        {
          id: 't_olay',
          label: 'OLAY YERİ',
          kind: 'SCENE',
          choices: [
            p1.activity('H_OFIS', 'Aksoy Mimarlık ofisi', 'INV_OFIS_GIRIS', {
              once: true,
              description: 'Eski Pirinç Han · büyüteç 7',
            }),
            p1.activity('H_HASTANE', 'Acil servis', 'INV_HASTANE_GIRIS', {
              once: true,
              visibleWhen: flag('fact_hastane'),
              description: '9 Kasım gecesi · büyüteç 6',
            }),
          ],
        },
        {
          id: 't_insan',
          label: 'İNSANLAR',
          kind: 'PEOPLE',
          choices: [
            p1.activity('H_GORUS', 'Tarık’la görüş', 'INV_GORUSME', {
              visibleWhen: not(visited('INV_GORUSME')),
              effects: [set('min', 27)],
              description: 'Kızını okuldan almasına yarım saat',
            }),
            p1.activity('H_GORUS2', 'Tarık’la yeniden görüş', 'INV_GORUSME', {
              visibleWhen: visited('INV_GORUSME'),
              maxUses: 1,
              effects: [set('min', 18)],
              description: '8 dk',
            }),
            p1.activity('H_GULAY', 'Hemşire Gülay Tunç', 'INV_T_GULAY', {
              once: true,
              visibleWhen: visited('INV_ARAMA_HASTANE'),
              description: 'Acil servis · gece nöbeti',
            }),
            p1.activity('H_HAYRI', 'Hayri Sezer', 'INV_T_HAYRI', {
              once: true,
              description: 'Vakıf yönetim kurulu · ses kaydının alıcısı',
            }),
            p1.activity('H_SINAN', 'Av. Sinan Bulut', 'INV_T_SINAN', {
              once: true,
              description: 'Katılan vekili',
            }),
            p1.activity('H_KUBRA', 'Stajyer Kübra Şen', 'INV_T_KUBRA', {
              once: true,
              description: 'Eski stajyer · ofisi içeriden bilir',
            }),
            p1.activity('H_OZAN', 'Ozan Tekin', 'INV_T_OZAN', {
              once: true,
              description: 'Eski ortak · katılan vekilinin bildirdiği tanık',
            }),
          ],
        },
        {
          id: 't_arsiv',
          label: 'ARŞİV',
          kind: 'ARCHIVE',
          choices: [
            p1.activity('H_TUTANAK', 'Ön inceleme tutanağı', 'INV_TUTANAK', {
              once: true,
              description: 'Kalemde asıl evrak · 5 deneme',
            }),
            p1.activity('H_IMAJ', 'Adli kopya raporu ve ekleri', 'INV_IMAJ', {
              once: true,
              description: '114 sayfa ek · 10 deneme',
            }),
            p1.activity('H_HESAP_IND', 'Hesap verisini indirt', 'INV_HESAP_IND', {
              visibleWhen: all(flag('fact_hesap_onay'), not(flag('hesap_istendi'))),
              description: 'Tarık ve noter · yarın akşam hazır',
            }),
            p1.activity('H_HESAP', 'Hesap verisi raporu', 'INV_HESAP', {
              once: true,
              visibleWhen: has('ev_hesap'),
              description: 'Noter tespitli döküm · 9 deneme',
            }),
            p1.activity('H_HKAYIT', 'Hastane kayıtları', 'INV_HKAYIT_GIRIS', {
              once: true,
              visibleWhen: flag('fact_onam_saat'),
              description: 'Babasının muvafakatiyle · 4 deneme',
            }),
            p1.activity('H_DIL', 'Delil ve bilirkişi talepleri', 'INV_DIL', {
              once: true,
              description: '3 talep hakkı',
            }),
            p1.free('H_CIKARIM', 'Çıkarım tahtası', 'INV_CIKARIM', {
              description: '0 EP · kartları birleştir',
              enabledWhen: ref('kart2'),
              lockedReason: 'En az 2 kart gerekli.',
            }),
            p1.free('H_LEYLA', 'Leyla’ya danış', 'INV_LEYLA', {
              description: '0 EP · günde bir kez',
              visibleWhen: cmp(v('leyla_gun'), '<', v('day')),
            }),
          ],
        },
      ],
      quickTalk: {
        character: 'tarik',
        line: '“Ben yazmadım. Bir telefonum var, bir hesabım var. Hepsi bu.”',
        choices: ['H_GORUS', 'H_GORUS2'],
      },
      choices: [
        {
          id: 'I_BEKLE',
          kind: 'NAVIGATE',
          label: 'Günü kapat',
          description: 'Kalan eylem puanlarını bırak',
          visibleWhen: all(cmp(v('ap'), '>', 0), cmp(v('day'), '<', 3)),
          confirm: 'Bugünün kalan eylem puanları yanar. Emin misin?',
          effects: [set('ap', 0)],
          next: '$stay',
        },
        nav('GO_H1', 'DURUŞMADAN ÖNCEKİ GECE', 'INV_GECE_1', {
          role: 'PRIMARY',
          confirm: 'Soruşturma evresi biter. Emin misin?',
          enabledWhen: any(
            cmp(v('day'), '==', 3),
            all(visited('INV_GORUSME'), visited('INV_TUTANAK'), visited('INV_IMAJ'), visited('INV_ARAMA_OFIS')),
          ),
          lockedReason:
            'Dilekçe süresi 3. gün doluyor. Erken gitmek için önce müvekkili dinle, tutanağı ve raporu oku, ofisi ara.',
        }),
      ],
    }),
    decisionNode('INV_DAY_END', [{ when: cmp(v('day'), '==', 2), to: 'INV_AKSAM1' }, { to: 'INV_AKSAM2_1' }], {
      ...C2,
      title: 'Gün sonu',
      onEnter: [...dayEndDelivery.effects, inc('day', 1), set('ap', 6)],
    }),
    story('INV_AKSAM1', {
      ...C2,
      title: 'Akşam',
      background: 'buro_gece',
      lines: [
        W(
          has('ev_hesap'),
          `
          # AKŞAM 21.10 — ARSLAN HUKUK |bg=buro_gece
          > Kapının altından noterin zarfı itilmişti. Mühürlü. Üstünde Tarık’ın el yazısı: “geldi”. Küçük harf. Nokta yok.
          > Leyla’nın odasında ışık yanıyordu. Kapısı aralık.
          leyla: Gel. Bugün ne öğrendin? Bir cümleyle.
        `,
        ),
        O(`
          # AKŞAM 21.10 — ARSLAN HUKUK |bg=buro_gece
          > Büro boşalmış. Yağmur yeniden başlamış; oluklardan taşan su kaldırıma vuruyor.
          > Masamda günün kâğıtları; hiçbiri henüz bir yere iğnelenmemiş. Bir avukatın ilk günü, bir mimarın ilk krokisi gibidir: çizgiler var, bina yok.
          > Leyla’nın odasında ışık yanıyordu. Kapısı aralık.
          leyla: Gel. Bugün ne öğrendin? Bir cümleyle.
        `),
      ],
      choices: [
        option('AK1_SUTUN', 'Bir sütun. Raporun kimsenin okumadığı bir sütunu.', {
          visibleWhen: has('clue_cihaz3'),
          effects: [set('aksam1', 'SUTUN')],
          responses: B(`
            leyla: Sütunlar ilginçtir Deniz. Kimse okumaz, ama hepsi oradadır. Bir tablonun en sağındaki sütun, çoğu zaman davanın kendisidir.
            leyla: Kendine şunu sor: o “cihaz” neyse, o gece kimin elindeydi? Hesap ile cihaz aynı şey değildir. Raporu yazan memur ikisini bir sanmış; iddianame de o yanılgının üstüne kurulmuş.
            leyla: Yarın o cihazın ne olduğunu öğren. Bir telefon mu, bir tablet mi, bir bilgisayar mı? Ve en önemlisi: kime ait?
            > Çayından bir yudum aldı, soğumuştu. Yüzünü buruşturmadı; soğuk çaya alışkındı, soğuk gerçeklere de.
          `),
          next: 'INV_HUB',
        }),
        option('AK1_TUTANAK', 'Polis kararı beklememiş. Ve imza almamış.', {
          visibleWhen: any(has('clue_ss_karar'), has('clue_imza_yok')),
          effects: [set('aksam1', 'TUTANAK')],
          responses: B(`
            leyla: İyi. Ekran görüntülerini düşürebilirsin. Ama dikkat: düşürdüğün şey görüntüler, mesajlar değil.
            leyla: Mesajlar imajda da var. İmaj kararla alındı. Usul sana bir kapı açar; içeride yine bir oda var.
          `),
          next: 'INV_HUB',
        }),
        option('AK1_HASTANE', '9 Kasım gecesi babasıyla hastanedeymiş.', {
          visibleWhen: flag('fact_hastane'),
          effects: [set('aksam1', 'HASTANE')],
          responses: B(`
            leyla: Hastanedeymiş. Telefonu da cebindeymiş, değil mi? Mesaj atmak için masa başında oturmak gerekmez.
            leyla: Bir mazeret, telefonun nerede ve ne hâlde olduğunu söylemiyorsa yarım mazerettir.
          `),
          next: 'INV_HUB',
        }),
        option('AK1_HIC', 'Hiçbir şey. Bir günü harcadım.', {
          effects: [set('aksam1', 'HIC')],
          responses: B(`
            leyla: Harcanmış gün yoktur, okunmamış ek vardır. Yarın eklere bak.
            > Masasındaki sigara paketini bir parmağıyla bana doğru itti, sonra geri çekti. Bir şaka. Ya da bir ders.
          `),
          next: 'INV_HUB',
        }),
      ],
    }),
    decisionNode('INV_AKSAM2_1', [{ to: 'INV_AKSAM2_2' }], {
      ...C2,
      title: 'Akşam',
      lines: [
        W(
          flag('ozan_ziyaret'),
          `
          # AKŞAM 22.30 — ARSLAN HUKUK |bg=buro_gece
          > Masamda Ozan Tekin’in kartviziti: kabartma harfler, cam bir plaza, bir bonsai logosu. Kartı çekmeceye koydum.
          ~ Dosyada bir paragraflık bir tanık; karşımda bir kemer hikâyesi ve bir simit ikramı. İddianame onun tek cümlesine yaslanıyor: “pişman edeceğim.”
        `,
        ),
        O(`
          # AKŞAM 22.30 — ARSLAN HUKUK |bg=buro_gece
          > Büro sessiz. Masadaki lambanın altında yarım kalmış bir çay. Pencerede kendi yansımam ve arkasında Bursa’nın ıslak ışıkları.
        `),
      ],
    }),
    decisionNode('INV_AKSAM2_2', [{ to: 'INV_AKSAM2' }], {
      ...C2,
      title: 'Akşam',
      lines: [
        W(
          flag('fact_ece'),
          `
          ~ 6 Kasım gecesi Ece de evdeymiş. Salonda kanepede uyuyakalmış; babası taşımış. Dokuz yaşında bir tanık. Onu asla kürsüye çıkarmayacağım.
        `,
        ),
        O(`~ Üç gece. Birinde hastane. İkisinde bir ev, bir yatak, bir şarj aleti. Bir mimarın uykusu tanık olmaz.`),
      ],
    }),
    story('INV_AKSAM2', {
      ...C2,
      title: 'Telefon',
      background: 'buro_gece',
      lines: B(`
        > Telefon çaldı. Tarık. Arkadan bir televizyon sesi, bir çizgi film müziği.
        tarik: Kusura bakmayın, geç oldu. Ece uyumuyor. Size bir şey sormak istiyor.
        ?BİR ÇOCUK SESİ: Avukat teyze? Babam yalan söylemez. Bunu hâkime söyler misiniz?
        > Bir an ne diyeceğimi bilemedim. Arkada Tarık’ın “Ece, yeter” deyişi.
        tarik: Özür dilerim. Okulda yine bir şey olmuş. Ne diyeyim ona? Siz söyleyin. Ne diyeyim?
      `),
      choices: [
        option('AK2_DOGRU', 'Doğruyu: “Baban yapmadığını söylüyor, avukatı bunu gösterecek.”', {
          effects: [inc('trust', 5)],
          responses: B(`
            tarik: Doğruyu. Peki. Sekiz yaşında olsa yalan söylerdim. Dokuzda… anlıyor artık.
            > Telefonu kapatmadan önce Ece’nin sesi bir kez daha duyuldu: “Göstersin ama.”
          `),
          next: 'INV_HUB',
        }),
        option('AK2_BEKLE', 'Şimdilik bir şey söylemeyin. Duruşmadan sonra konuşursunuz.', {
          effects: [inc('trust', 1)],
          responses: B(`
            tarik: Susayım. Peki. Ben susmayı iyi bilirim. Ece bilmez.
          `),
          next: 'INV_HUB',
        }),
        option('AK2_SOZ', '“Babana hiçbir şey olmayacak, avukatı söz verdi.” Bunu söyleyin; rahatlasın.', {
          effects: [inc('trust', 3), raise('soz_verildi')],
          responses: B(`
            tarik: Olmayacak mı?
            > Cevap vermedim. Telefonun öbür ucunda bir çocuk, babasının ağzından benim sözümü duyacaktı.
            ~ İkinci kez. Leyla bunu duysa ne derdi, biliyorum.
          `),
          next: 'INV_HUB',
        }),
      ],
    }),
    story('INV_LEYLA', {
      ...C2,
      title: 'Leyla’ya danış',
      background: 'buro',
      onEnter: [set('leyla_gun', v('day'))],
      lines: [
        W(
          all(has('clue_cihaz3'), not(flag('hesap_istendi'))),
          `
          leyla: Cihaz 3. İyi. Şimdi o cihazın ne olduğunu kimden öğreneceksin? Polisten mi, şirketten mi?
          leyla: Hesap Tarık’ın. Hesabın sahibi kendi oturum geçmişini isteyebilir; önce ona sor, o listeyi hiç açmış mı. Ama dikkat: elinden çıkan her kâğıt, polisinki kadar sorgulanacak. Noter. Hash.
        `,
        ),
        W(
          all(flag('fact_hastane'), not(has('ev_hastane'))),
          `
          leyla: Hastane dedin. Hastanede her şeyin saati yazılır. Önce o geceyi kendi saatinde gör; kâğıdı kimin, hangi kuralla yazdığını öğren. Sonra babasının muvafakatiyle kayıtları iste.
          leyla: Saat yazan bir hemşire, saatini bilmeyen on tanıktan iyidir.
        `,
        ),
        W(
          not(visited('INV_TUTANAK')),
          `
          leyla: Önce tutanak. Polis telefona ne zaman dokundu, karar ne zaman verildi? İki tarihi yan yana koy.
          leyla: Bir de imzaya bak. “Rıza” diyorlarsa, rızanın bir izi olmalı.
        `,
        ),
        W(
          not(visited('INV_IMAJ')),
          `
          leyla: Raporun sonucunu okudun mu? Okuma. Eklerini oku. Ek-2, Ek-3. Sonuç bir kanaattir.
        `,
        ),
        W(
          all(has('ded_bagli'), not(flag('bilirkisi_istendi'))),
          `
          leyla: Elinde bir teori var, artık bir uzmana ihtiyacın var. Senin değil, mahkemenin uzmanına. Bilirkişi iste.
          leyla: Avukatın söylediği teoridir. Bilirkişinin söylediği delildir.
        `,
        ),
        O(`
          leyla: Bir mesajın altında bir isim yazar Deniz. Mesajı kimin yazdığını yazmaz.
          leyla: Her gece için üç soru: hangi cihaz, kimin elinde, hangi hattan?
        `),
      ],
      choices: [back('LEY_BITIR', 'Teşekkür et')],
    }),
    decisionNode('INV_GECE_1', [{ to: 'INV_GECE_2' }], {
      ...C2,
      title: 'Duruşmadan önceki gece',
      onEnter: [...nightDelivery.effects],
      lines: B(`
        # DURUŞMADAN ÖNCEKİ GECE — ARSLAN HUKUK |bg=buro_gece
        > Gece yarısına yakın. Büro boşalalı çok oldu; sadece masa lambam ve panonun üstündeki ışık yanıyor. Dışarıda yağmur, camda kendi yansımam.
        > Panoya iğnelediğim kâğıtlar iplerle birbirine bağlı: bir ön inceleme tutanağı, bir mesaj tablosu, bir hastane formu, Tophane’nin bir haritası. Bir örümcek ağı gibi, ama ortasında bir boşluk.
        ~ Elimde ne var? Saydım. Bir kez, bir daha. Yarın sabah bu kâğıtlar bir mahkeme salonunda sınanacak. Eksik bıraktığım her iplik, orada kopacak.
        ~ Bir yıl önce bir duruşmadan önceki gece erkenden uyumuştum. Sabah dosyayı okumadan girmiştim salona. O gün bir insanı yarı yolda bıraktım. Bu gece uyumuyorum.
      `),
    }),
    decisionNode('INV_GECE_2', [{ to: 'INV_GECE_3' }], {
      ...C2,
      title: 'Duruşmadan önceki gece',
      lines: [
        W(
          has('ded_ss'),
          `~ Ekran görüntüleri: kararsız, imzasız. Bunu yarın söyleyeceğim. Salonda biri yüzünü buruşturacak.`,
        ),
        W(
          any(has('clue_ss_karar'), has('clue_imza_yok')),
          `~ Ekran görüntülerinde bir sorun var. Tarihler mi, imza mı? İkisini birden bağlayamadım.`,
        ),
        O(`~ Ekran görüntüleri. Polisin elindeki en güçlü kâğıt. Ona hiç dokunmadım.`),
      ],
    }),
    decisionNode('INV_GECE_3', [{ to: 'INV_GECE_4' }], {
      ...C2,
      title: 'Duruşmadan önceki gece',
      lines: [
        W(
          has('ded_bagli'),
          `~ Cihaz 3. Bir dizüstü. Şubat’ta bağlanmış, hiç kapatılmamış bir oturum. Mesajlar bir telefondan çıkmadı. Bunu bir polis memuruna söyleteceğim.`,
        ),
        W(has('clue_cihaz3'), `~ Cihaz 3. Ne olduğunu bilmiyorum. Bildiğim tek şey: Tarık’ın telefonu değil.`),
        O(`~ Mesajlar telefondaydı. Polis öyle diyor, rapor öyle diyor. Ben de başka bir şey diyemiyorum.`),
      ],
    }),
    decisionNode('INV_GECE_4', [{ to: 'INV_GECE_5' }], {
      ...C2,
      title: 'Duruşmadan önceki gece',
      lines: [
        W(
          has('ded_hastane'),
          `
          ~ 9 Kasım, 02.14. Telefon kilitli, hemşire masasında. Tarık bir form imzalıyor. O gece, o eller değil.
          ~ Ama bu bir çıkarım; benim panomda duruyor. Salonda onu bir makinenin günlüğü, bir hemşirenin imzası ve bir yaşlı adamın telefonu taşımalı. Üçünü de kürsüye getirmenin yolunu bulmalıyım.
        `,
        ),
        W(
          any(flag('fact_gulay'), has('clue_onam'), has('clue_sarj')),
          `~ Acil servis. Bir bant, bir saat. Bir parçası elimde, öbür parçası raporda bir yerde olmalı.`,
        ),
        W(flag('fact_hastane'), `~ Hastane. Tarık o gece hastanedeydi. Ama kâğıda dökemedim.`),
        O(`~ Üç gece. Bir adamın uykusu. Uykunun tanığı olmaz.`),
      ],
    }),
    decisionNode('INV_GECE_5', [{ to: 'INV_GECE' }], {
      ...C2,
      title: 'Duruşmadan önceki gece',
      lines: [
        W(
          cmp(v('ethics'), '>', 0),
          `
          > Leyla kapıda belirdi. Paltosunu giymişti. Bir süre sustu.
          leyla: Bugün biri beni aradı Deniz. Ne dediğini biliyorsun. Bir daha olmasın.
          > Gitti. Kapı yavaşça kapandı.
        `,
        ),
        W(
          cmp(v('aksam1'), '==', 'SUTUN'),
          `
          > Leyla kapıda belirdi. Paltosunu giymişti.
          leyla: Sütun meselesi. Yarın polisin kendi ağzından duymak istiyorum. Kendi tablosunu ona okut.
        `,
        ),
        O(`
          > Leyla kapıda belirdi. Paltosunu giymişti.
          leyla: Yarın tanık kürsüde ne derse desin, tutanağı oku. İnsanlar unutur, kâğıt unutmaz.
        `),
      ],
    }),
    story('INV_GECE', {
      ...C2,
      title: 'Duruşmadan önceki gece',
      background: 'sokak_yagmur',
      lines: B(`
        > Işığı söndürdüm. Panoya son bir kez baktım; karanlıkta iplikler ince gümüş çizgilere döndü.
        > Merdivenden inerken telefonum titredi. Tarık’tan bir mesaj: “yarın 9da kapıdayım”. Küçük harf. Nokta yok. Virgül yok. İşte, bir adamın gerçek sesi böyle yazıyordu. |bg=sokak_yagmur
        > Dışarıda yağmur incelmişti. Tophane’nin saat kulesi on ikiyi vurdu, sesi ıslak sokaklarda uzadı.
        ~ Bir yerde, bir ekran hâlâ yanıyor olabilirdi. Yarın o ekranın kime ait olduğunu bir salon dolusu insana göstereceğim. Yeter ki kâğıtlar beni yarı yolda bırakmasın.
      `),
      choices: [cont('GECE_DEVAM', 'Duruşmaya git', 'H1_00', { role: 'PRIMARY' })],
    }),
  ],
  triggers: [
    {
      id: 'tg_inv_day',
      scope: 'INV_HUB',
      priority: 1,
      when: all(cmp(v('ap'), '<=', 0), cmp(v('day'), '<', 3)),
      goto: 'INV_DAY_END',
    },
  ],
  discoveryPaths: [...dayEndDelivery.discoveryPaths, ...nightDelivery.discoveryPaths],
};
