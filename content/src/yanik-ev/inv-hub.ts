import {
  all,
  any,
  back,
  cmp,
  cont,
  decisionNode,
  deductionBoard,
  fallback,
  flag,
  has,
  inc,
  met,
  nav,
  not,
  option,
  raise,
  recipe,
  ref,
  set,
  story,
  v,
  visited,
  chosen,
  choiceNode,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import type { ChoiceDef } from '@mudafaa/case-schema';
import { INV1, card, n, named, p1, s, th } from './shared.js';
import { sabahKapisi } from './inv-people.js';

/** Bekçiye ikinci ziyaret: ilk ziyarette sabah sorulamadıysa (zincirdeki boşluk henüz görülmemişse), bir EP daha. */
const cevdet2Gorunur = all(visited('INV_CEVDET'), not(chosen('CV_SABAH')), sabahKapisi);

// 50-inv-hub: 1. evre hub'ı (3 gün × 4 EP), gün sonu ve akşam sahneleri, Leyla'ya danış, delil dilekçesi (CMK 177),
// çıkarım tahtası ve duruşmadan önceki gece.

const deduce = (id: string, a: string, b: string, out: string, title: string, text: string): ChoiceDef =>
  recipe(id, a, b, {
    discovers: out,
    score: { DELIL_ANALIZI: 300 },
    feedback: { title, text, label: 'YENİ DELİL · +300 SKOR', tone: 'success' },
  });

const hubChoices = {
  // Büro sekmesi ilk sırada: ücretsiz seçenekler (Leyla, tahtalar, dilekçe). Etkinlikler sonra gelir; böylece doğrulayıcının
  // kaçış araması da hub'da önce eylem puanı harcayan bir etkinliği dener (kova içinde son eklenen önce).
  buro: [
    p1.free('A_DIL', 'Delil dilekçesi (CMK 177)', 'INV_DIL', {
      description: '0 EP · üç talep hakkı · son gün, Leyla okuduktan sonra',
      visibleWhen: not(any({ chosen: 'DIL_VER' }, { chosen: 'DIL_VAZGEC' })),
      enabledWhen: cmp(v('leyla_gun'), '>=', 3),
      lockedReason: 'Dilekçe son gün yazılır; taslağı önce Leyla okur.',
    }),
    p1.free('A_CIKARIM', 'Yangın tahtası: nerede, neyle', 'INV_CIKARIM', {
      description: '0 EP · ipuçlarını birleştir',
      enabledWhen: ref('kart2'),
      lockedReason: 'En az 2 ipucu gerekli.',
    }),
    p1.free('A_IPLIK', 'İplik tahtası: dolaylı deliller', 'INV_IPLIK', {
      description: '0 EP · ipuçlarını birleştir',
      enabledWhen: ref('kart2'),
      lockedReason: 'En az 2 ipucu gerekli.',
    }),
    p1.free('A_LEYLA', 'Leyla’ya danış', 'INV_LEYLA', {
      description: '0 EP · günde bir kez',
      visibleWhen: cmp(v('leyla_gun'), '<', v('day')),
      effects: [set('leyla_gun', v('day'))],
    }),
  ],
  olay: [
    p1.activity('A_EV', 'Yanık evi ara', 'INV_EV', { once: true, description: 'Kalem Sokak 9 · büyüteç 6' }),
    p1.activity('A_FOTO', 'Olay yeri albümünü ara (04.30)', 'INV_FOTO', {
      once: true,
      description: 'Kolluk fotoğrafları · büyüteç 4',
    }),
    p1.activity('A_ATOLYE', 'Halil’in atölyesine git', 'INV_ATOLYE_G', {
      once: true,
      description: 'Yıldırım, eski sanayi · büyüteç 5',
    }),
  ],
  cezaevi: [
    p1.activity('A_GORUS', 'Halil’le görüş', 'INV_GORUS_G_1', {
      description: 'Görüş salonunun kapanışına 14 dk',
      visibleWhen: not(visited('INV_GORUSME')),
    }),
    p1.activity('A_GORUS2', 'Tekrar görüş', 'INV_GORUS_G_1', {
      description: 'Görüş salonunun kapanışına 8 dk',
      visibleWhen: visited('INV_GORUSME'),
      maxUses: 1,
    }),
  ],
  kisi: [
    p1.activity('A_SAADET', 'Karşı komşu Saadet Hanım', 'INV_SAADET', {
      once: true,
      description: 'Kalem Sokak 7 · savcılık tanığı',
    }),
    p1.activity('A_CEVDET', 'Mahallenin bekçisi', 'INV_CEVDET', {
      once: true,
      description: 'Bekçi kulübesi · olay yerini o bekledi',
      visibleWhen: any(visited('INV_SAADET'), has('clue_numune'), visited('INV_EV')),
    }),
    p1.activity('A_CEVDET2', 'Bekçiye yeniden uğra', 'INV_CEVDET', {
      once: true,
      description: 'Bekçi kulübesi · sabahı sor',
      visibleWhen: cevdet2Gorunur,
    }),
    p1.activity('A_NECATI', 'Elektrikçi Necati Usta', 'INV_NECATI', {
      once: true,
      description: 'Restorasyon ekibi · tesisat keşfi',
      visibleWhen: any(has('clue_restorasyon'), has('clue_buat'), flag('fact_elektrikci')),
    }),
    p1.activity('A_KADER', 'Sigorta acentesi', 'INV_KADER', {
      once: true,
      description: 'Poliçeyi düzenleyen acente',
      visibleWhen: any(has('clue_kampanya'), flag('fact_artis')),
    }),
  ],
  arsiv: [
    p1.activity('A_BILIRKISI', 'Yangın bilirkişi raporunu incele', 'INV_BILIRKISI', {
      once: true,
      description: 'Dr. Orhan Tezel · laboratuvar ve ekler',
    }),
    p1.activity('A_ITFAIYE', 'İtfaiye raporunu incele', 'INV_ITFAIYE', { once: true, description: 'Olay raporu' }),
    p1.activity('A_POLICE', 'Poliçeyi ve zeyilnameyi incele', 'INV_POLICE', {
      once: true,
      description: 'Kalkan Sigorta · ekler',
    }),
  ],
};

/**
 * Son günün işleri bitti: eylem puanı kalmadı ya da harcanacak etkinlik kalmadı (her etkinlik ya yapıldı ya görünmüyor).
 * Duruşma tarihi sabittir (14 Nisan); hub'dan duruşmaya ancak son günün sonunda gidilir.
 */
const sonGunBitti = any(
  all(cmp(v('day'), '==', 3), cmp(v('ap'), '<=', 0)),
  // Harcanacak etkinlik kalmadıysa gün beklemeden duruşmaya gidilir; aksi hâlde hub kilitlenirdi.
  all(
    chosen('A_EV'),
    chosen('A_FOTO'),
    chosen('A_ATOLYE'),
    chosen('A_GORUS'),
    chosen('A_GORUS2'),
    chosen('A_SAADET'),
    chosen('A_BILIRKISI'),
    chosen('A_ITFAIYE'),
    chosen('A_POLICE'),
    any(chosen('A_CEVDET'), not(any(visited('INV_SAADET'), has('clue_numune'), visited('INV_EV')))),
    any(chosen('A_CEVDET2'), not(cevdet2Gorunur)),
    any(chosen('A_NECATI'), not(any(has('clue_restorasyon'), has('clue_buat'), flag('fact_elektrikci')))),
    any(chosen('A_KADER'), not(any(has('clue_kampanya'), flag('fact_artis')))),
  ),
);

export const invHub: CasePart = {
  nodes: [
    p1.hub({
      ...INV1,
      title: 'Soruşturma',
      background: 'buro',
      lines: [
        {
          when: cmp(v('day'), '==', 1),
          lines: [
            card('GÜN 1/3 · BİRİNCİ CELSEYE 10 GÜN', 'buro'),
            n(
              'Masamda savcılık dosyasının fotokopisi: üç yüz seksen sayfa. Bir rapor, bir poliçe, bir fiş, bir ifade. Hepsi aynı yöne bakıyor; bu beni en çok rahatsız eden şey.',
            ),
            th('Leyla’nın üç kâğıdı masamda: nerede, neyle, kim. Önce “nerede”. Bir yangın, başladığı yeri unutmaz.'),
            n('Hedef: yangın nerede başladı? Evi, fotoğrafları ve bilirkişi raporunu gör; Halil’i dinle.'),
          ],
        },
        {
          when: all(cmp(v('day'), '==', 2), any(has('clue_numune'), has('clue_foto_tavan'), has('clue_buat'))),
          lines: [
            card('GÜN 2/3 · BİRİNCİ CELSEYE 9 GÜN', 'buro'),
            th('Dün bir yangının yerini aradım. Bugün halatın ipliklerine bakacağım: poliçe, eşyalar, benzin.'),
            n('Hedef: savcının ipliklerini tek tek ayır. Her birinin bir kâğıdı, bir tanığı, bir açıklaması var mı?'),
          ],
        },
        {
          when: cmp(v('day'), '==', 2),
          lines: [
            card('GÜN 2/3 · BİRİNCİ CELSEYE 9 GÜN', 'buro'),
            n('Hedef: rapor neye dayanıyor? Fotoğraflar ne gösteriyor? Savcının ipliklerini tek tek ayır.'),
          ],
        },
        {
          lines: [
            card('GÜN 3/3 · BİRİNCİ CELSEYE 8 GÜN', 'buro'),
            n(
              'Sabah erkenden geldiğimde Leyla masama bir not bırakmıştı: “Dilekçe bugün yazılır, yarın sabah kaleme verilir. Müzekkereye, davetiyeye gün lazım.” Altına küçük bir çizgi.',
            ),
            n('Hedef: delil dilekçesini yazmak için son gün. Tahtayı topla; duruşmada neyi istediğini bil.'),
          ],
        },
      ],
      scenePreview: { scene: 'sc_ev' },
      tabs: [
        { id: 't_buro', label: 'BÜRO', kind: 'ARCHIVE', choices: hubChoices.buro },
        { id: 't_olay', label: 'OLAY YERİ', kind: 'SCENE', choices: hubChoices.olay },
        { id: 't_cezaevi', label: 'CEZAEVİ', kind: 'PEOPLE', choices: hubChoices.cezaevi },
        { id: 't_kisi', label: 'KİŞİLER', kind: 'PEOPLE', choices: hubChoices.kisi },
        { id: 't_arsiv', label: 'ARŞİV', kind: 'ARCHIVE', choices: hubChoices.arsiv },
      ],
      quickTalk: {
        character: 'halil',
        line: '“O evin her tahtasını ben cilaladım, avukat hanım.”',
        choices: ['A_GORUS', 'A_GORUS2'],
      },
      choices: [
        nav('GO_H1', 'DURUŞMAYA GİT · 1. CELSE', 'INV_GECE_1', {
          role: 'PRIMARY',
          enabledWhen: sonGunBitti,
          lockedReason: 'Duruşma 14 Nisan’da. Önce son günün işlerini bitir.',
          confirm: 'Duruşmaya gidersen soruşturma biter. Emin misin?',
        }),
      ],
    }),
    decisionNode('INV_DAY_END', [{ when: cmp(v('day'), '==', 2), to: 'INV_AKSAM1' }, { to: 'INV_AKSAM2' }], {
      ...INV1,
      title: 'Gün sonu',
      onEnter: [inc('day', 1), set('ap', 4)],
    }),
    story('INV_AKSAM1', {
      ...INV1,
      title: 'Akşam',
      background: 'buro_gece',
      lines: [
        {
          lines: [
            card('CUMARTESİ 23.40 — ARSLAN HUKUK', 'buro_gece'),
            n(
              'Telefon titredi. Zehra. Arkasında bir hastane koridorunun sesleri: tekerlekli bir sedye, bir anons, bir monitörün bip’i.',
            ),
            s(
              'zehra',
              'Nöbetteyim, beş dakikam var. Bugün cezaevine gittim. Babam bana baktı, ben ona. İkimiz de bir şey soramadık.',
              'uzgun',
            ),
            s(
              'zehra',
              'Size bir şey soracağım ve dürüst cevap vermenizi istiyorum. Hastaya da hep dürüst söylerim; yalan söylenen hasta iyileşmez.',
            ),
            s(
              'zehra',
              'Acilde bir kural var: hasta “düştüm” der, morluk “dövüldüm” der. Biz morluğa inanırız. Babam “yapmadım” diyor. Peki morluk ne diyor?',
            ),
            s('zehra', 'Sizce babam yaptı mı?'),
            th(
              'Bir kızın babası hakkında sorduğu en ağır soru. Cevabı benim değil. Ama sustuğum her saniye, onun kafasında bir cevap oluyor.',
            ),
          ],
        },
      ],
      choices: [
        option('AK1_A', 'Bilmiyorum. Ama bugüne kadar bulduğum hiçbir şey onun yaptığını göstermiyor.', {
          effects: [raise('zehra_guven'), inc('trust', 2)],
          responses: [
            {
              lines: [
                s(
                  'zehra',
                  'Bilmiyorum. Doğru cevap. Acilde de öyle deriz: “Henüz bilmiyoruz, bakıyoruz.” İnsan buna inanır.',
                ),
                s('zehra', 'Bakmaya devam edin. Ben de… ben de babama bakmaya devam edeceğim. Gözünün içine.'),
                th('Henüz bilmiyorum. Bir avukatın söyleyebileceği en dürüst cümle, en az satan cümledir.'),
              ],
            },
          ],
          next: 'INV_SABAH2',
        }),
        option('AK1_B', 'Yapmadı. İçin rahat olsun; gerisini bana bırak.', {
          responses: [
            {
              lines: [
                s('zehra', 'İçim rahat olsun. Peki.', 'uzgun'),
                n('Hat bir süre sessiz kaldı. Sonra bir anons, bir kapı, bir “hemşire hanım” sesi.'),
                s('zehra', 'Gitmem lazım. Teşekkürler.'),
                th('Teşekkür etti. İnanmadı. Benim sesimde onun sesindeki kuşkuyu duydu.'),
              ],
            },
          ],
          next: 'INV_SABAH2',
        }),
        option('AK1_C', 'Bu soruyu bana değil, ona sor. Cevabını ancak o verebilir.', {
          effects: [raise('zehra_sor')],
          responses: [
            {
              lines: [
                s('zehra', 'Ona mı? Babama “evi sen mi yaktın” mı diyeyim?', 'kizgin'),
                n('Uzun bir sessizlik. Bir monitör bip’ledi, sustu.'),
                s('zehra', '… Belki de demeliyim. İki aydır sormadığım için ikimiz de hasta olduk.'),
                th('Bir aileyi bir soru böler. Bazen de aynı soru birleştirir. Hangisi olacağını bilmiyorum.'),
              ],
            },
          ],
          next: 'INV_SABAH2',
        }),
      ],
    }),
    story('INV_AKSAM2', {
      ...INV1,
      title: 'Akşam',
      background: 'buro_gece',
      lines: [
        {
          lines: [
            card('PAZAR 18.05 — ARSLAN HUKUK', 'buro_gece'),
            n('Bilinmeyen bir numara. Açtım. Bir kayıt anonsu: “Bu görüşme bir ceza infaz kurumundan yapılmaktadır.”'),
            s('halil', 'Avukat hanım? Halil. On dakikam var. Kusura bakmayın, haftada bir hakkım var, sizi aradım.'),
            s(
              'halil',
              'Atölyede, örtülü eşyaların içinde ceviz bir sandık var. Nermin’in çeyiz sandığı. İçinde mektuplar var; nişanlıyken yazdıklarımız.',
            ),
            s(
              'halil',
              'Zehra’ya verin onları. Ben çıkamazsam… yani, uzun sürerse. Annesinin el yazısını görsün. Benim ağzımdan duymadığı şeyleri ondan duysun.',
              'uzgun',
            ),
            th(
              'Bir döşemeci, bir sandık, bir yığın mektup. İnsan bir evi yakmaya karar verirse, önce mektupları mı kurtarır? Yoksa mektupları kurtaran, evi yakmaz mı?',
            ),
            th('İkisi de olabilir. Bu yüzden bu bir delil değil. Bu bir insan.'),
            s(
              'halil',
              'Bir de… koğuşta bir çocuk var, on dokuz yaşında. Ayakkabısının tabanı açılmış. Diktim. “Abi sen ne yaptın da buradasın” dedi. Bilmiyorum dedim. Gerçekten bilmiyorum, avukat hanım.',
              'uzgun',
            ),
            n('Anons araya girdi: “Görüşmenizin bitmesine bir dakika.” Halil bir şey söyleyecekti; söylemedi.'),
          ],
        },
      ],
      choices: [
        option('AK2_A', 'Mektupları Zehra’ya götürürüm. Ama siz de ona kendiniz anlatacaksınız.', {
          effects: [raise('mektup'), inc('trust', 3)],
          responses: [
            {
              lines: [
                s('halil', 'Anlatırım. Borcu da anlatırım. Utanırım ama anlatırım.'),
                s('halil', 'Nermin “sen kumaşı gerersin ama kendini germezsin” derdi. Haklıymış.'),
              ],
            },
          ],
          next: 'INV_SABAH3',
        }),
        option('AK2_B', 'Mektupları sonra konuşuruz. Şimdi duruşmaya odaklanalım.', {
          responses: [
            {
              lines: [
                s('halil', 'Haklısınız. Duruşma. Peki.'),
                n(
                  'Kayıt anonsu araya girdi: “Görüşmenizin bitmesine bir dakika.” Halil bir şey daha söyleyecekti; söylemedi.',
                ),
              ],
            },
          ],
          next: 'INV_SABAH3',
        }),
        option('AK2_C', 'Halil Bey, bu hattan dava konuşmayalım; görüşe geldiğimde anlatın.', {
          effects: [inc('trust', 1)],
          neutral:
            'Cezaevi telefon görüşmeleri kayda alınabilir; dava stratejisi yüz yüze, avukat görüşünde konuşulur.',
          responses: [
            {
              lines: [
                s('halil', 'Tamam. Doğru. Sandığı yine de bir açın. Sadece açın.'),
                th('Haklıydı. Sandığı açacağım. Delil için değil.'),
              ],
            },
          ],
          next: 'INV_SABAH3',
        }),
      ],
    }),
    story('INV_SABAH2', {
      ...INV1,
      title: 'Muradiye kahvehanesi',
      background: 'kafe',
      lines: [
        {
          lines: [
            card('PAZAR 08.30 — MURADİYE, ÇINARALTI KAHVESİ', 'kafe'),
            n(
              'Kahvehane, Kalem Sokak’ın yokuşunun dibinde, bir çınarın altındaydı. İçeride sobanın üstünde bir çaydanlık, duvarda eski bir Bursaspor takvimi, köşede tavla şakırtısı.',
            ),
            n(
              'Çaycı beni görünce bir bardak koydu; sormadan. Muradiye’de bir yabancıya önce çay verilir, sonra kim olduğu sorulur.',
            ),
            named(
              'ÇAYCI',
              'Halil Abi’nin avukatısınız. Belli. Bu mahallede takım giyen ya cenazeye gider ya adliyeye.',
            ),
            named(
              'YAŞLI BİR ADAM',
              'Halil yakmaz o evi. Kırk yıldır tanırım. Nermin Hanım ölünce her akşam o evin önünde bir sigara içerdi; içmezdi aslında, yakardı, tutardı.',
            ),
            named('BAŞKA BİR ADAM', 'Borcu varmış ama. Borç insana neler yaptırır. Benim bacanak da…'),
            named('YAŞLI BİR ADAM', 'Senin bacanak dükkânını yakmadı, kumarda kaybetti. Karıştırma.'),
            n('Tavla zarları masaya düştü. Biri “şeş beş” dedi; kimse sevinmedi.'),
            named(
              'ÇAYCI',
              'O gece itfaiye gelince bütün mahalle buraya doldu, abla. Ocağı ben yaktım, sabaha kadar çay. Herkes bir şey gördüğünü söyledi; kimse bir şey görmedi.',
            ),
            th(
              'Bir mahalle bir mahkemeden önce karar verir. Burada iki karar var: Halil yakmaz, borç yaktırır. İkisi de kanıt değil. İkisi de hâkimin kulağına bir yoldan ulaşır.',
            ),
            th('Herkes bir şey gördü, kimse bir şey görmedi. Muradiye’de tanıklık böyle başlar.'),
          ],
        },
      ],
      choices: [cont('SABAH2_DEVAM', 'Çayı bitir ve güne başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
    story('INV_SABAH3', {
      ...INV1,
      title: 'Leyla’nın dosyası',
      background: 'buro',
      lines: [
        {
          lines: [
            card('PAZARTESİ 07.40 — ARSLAN HUKUK', 'buro'),
            n(
              'Pazartesi, mesai başlamadan; büroda Leyla’dan başka kimse yoktu. Masasında eski, sararmış bir dosya; kapağında el yazısıyla bir yıl: 1996.',
            ),
            s('leyla', 'Otur. Sana bir yangın anlatacağım. Benim ilk yangınım. Gemlik’te bir tekstil deposu.'),
            s(
              'leyla',
              'Sahibi borçluydu, depo sigortalıydı, bir gece yandı. Bilirkişi “kasten” dedi. Herkes inandı. Ben de inandım; müvekkilime “ikrar et, indirim alırsın” dedim.',
              'uzgun',
            ),
            s(
              'leyla',
              'Etmedi. Dört yıl yattı. Sonra bir başka bilirkişi raporu baştan okudu ve ilk bilirkişinin depoya hiç gitmediğini, raporu fotoğraflardan yazdığını gösterdi. Dört yıl, Deniz. Kimse “ne gördün” diye sormadığı için.',
            ),
            n('Dosyayı kapattı. Sigara paketini çevirdi; bir kere, iki kere.'),
            s(
              'leyla',
              'O gün bir şey öğrendim: bilirkişiye inanmak avukatın işi değil. Onu sınamak avukatın işi. Bakmadığı yere bak. Sormadığı soruyu sor.',
            ),
            th(
              'Gemlik. Büyükbabamın evi. Sigortanın “kusur” dediği o kış. Leyla bunu biliyor mu? Sormadım. Bazı tesadüfler, sorulunca tesadüf olmaktan çıkar.',
            ),
            s(
              'leyla',
              'O adam çıktığında kırk yaşındaydı. Bir daha iş kuramadı; elleri titriyordu. Tazminat aldı. Para dört yılı geri getirmedi. Bir mahkeme yanıldığını yazdı; o yazı benim masamda, bu dosyanın içinde.',
              'uzgun',
            ),
            n('Leyla dosyayı rafa kaldırmadı. Masasının köşesinde, ters çevrilmiş çerçevenin yanında bıraktı.'),
            s('leyla', 'Bugün son gün. Dilekçeni yaz. Ve kimsenin bakmadığı şeyi iste.'),
          ],
        },
      ],
      choices: [cont('SABAH3_DEVAM', 'Son güne başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
    story('INV_LEYLA', {
      ...INV1,
      title: 'Leyla’ya danış',
      background: 'buro',
      lines: [
        {
          when: not(any(visited('INV_EV'), visited('INV_FOTO'), visited('INV_BILIRKISI'))),
          lines: [
            n('Leyla bir dilekçe okuyordu. Kâğıdı indirmeden konuştu.'),
            s(
              'leyla',
              'Bilirkişi evi yangından kaç gün sonra gördü? Polis kaç saat sonra? Sen üç ay sonra göreceksin. Her birinin gördüğü ev başka evdir.',
            ),
            s('leyla', 'Önce en eski fotoğrafa bak. En eski fotoğraf, en az dokunulmuş olandır.'),
          ],
        },
        {
          when: all(cmp(v('day'), '==', 3), has('clue_numune')),
          lines: [
            n(
              'Pazartesi öğlesi. Leyla dilekçe taslağımı kırmızı kalemle okuyordu; kırmızı kalemi yalnızca önemli dosyalarda kullanırdı.',
            ),
            s(
              'leyla',
              'Üç talep hakkın var, üç kapı. Bir kapı ne bulunduğunu sorar, bir kapı kimin bulduğunu, bir kapı da kimsenin bakmadığı yeri. Hangisi hangisi, sen bilirsin.',
            ),
            s(
              'leyla',
              'Ve şunu unutma: dilekçede istediğin her şey savcının da önüne gelir. Bir rapor senin lehine çıkmazsa, onu sen istemiş olursun. Bu yüzden ne istediğini değil, neden istediğini bil.',
            ),
            s(
              'leyla',
              'Bir de Halil. Celseden önce ona salonda neler olacağını anlat. Kürsüde şaşıran sanık, hâkimin gözünde saklanan sanıktır. Ona cevap ezberletme; doğruyu kendi sözleriyle söylemeyi öğret.',
            ),
            th(
              'Leyla’nın kırmızı kalemi üç cümlenin altını çizdi, birinin üstünü. Üstü çizilen cümle benim en sevdiğimdi: “Rapor baştan sona çürüktür.” Haklıydı. Çürük bir rapor sökülür, bağırılmaz.',
            ),
          ],
        },
        {
          when: all(has('clue_numune'), not(has('ded_zincir'))),
          lines: [
            n('Leyla gözlüğünü çıkardı, kazağının ucuyla sildi. Önemli bir şey söyleyecekse hep böyle yapardı.'),
            s(
              'leyla',
              'Numuneleri kim getirmiş? Bunu yazmışlar ama kimse üstünde durmamış. Bir numune, onu kimin, ne zaman, nasıl aldığı kadar konuşur.',
            ),
            s(
              'leyla',
              'Olay yeri o sabah kimin gözetimindeydi? Gözetimi tutan biri, kapıdan kimin girdiğini de bilir.',
            ),
          ],
        },
        {
          when: all(any(has('clue_foto_tavan'), has('clue_eksper_foto')), not(has('ded_temizlenmis'))),
          lines: [
            n('Leyla fotoğraf albümünü açtı, bir kareye uzun uzun baktı, sonra raporun ekini yanına koydu.'),
            s(
              'leyla',
              'Aynı odanın iki fotoğrafı. Biri 04.30, biri 09.40. Arada beş saat var. Beş saatte bir zemin kendi kendine temizlenmez.',
            ),
          ],
        },
        {
          when: all(has('clue_necati'), not(has('ded_onlem'))),
          lines: [
            n('Leyla elektrikçinin notunu okudu ve dudaklarını büzdü.'),
            s(
              'leyla',
              'Bu not iki yöne keser, Deniz. “Tesisat eski, buat ısınmış.” Elektrik kaynağı için güzel bir cümle. Ama savcının eline geçerse başka bir cümle olur: “Biliyordu, yaptırmadı.”',
            ),
            s(
              'leyla',
              'Kasıttan kurtarıp dikkatsizliğe teslim etme müvekkilini. Uyarıyı duyduysa ne yaptı? Onu da bul.',
            ),
          ],
        },
        {
          when: all(has('clue_bidon'), not(has('ded_bidon'))),
          lines: [
            n('Leyla fişin fotokopisini kalemiyle iki kez tıklattı.'),
            s(
              'leyla',
              'Fiş bir şey alındığını gösterir. Nereye gittiğini göstermez. Benzini kimse aramamış; sen bulmuşsun. Ona bir isim ver.',
            ),
          ],
        },
        {
          when: not(any(visited('INV_POLICE'), has('clue_kampanya'))),
          lines: [
            n('Leyla poliçenin fotokopisini masaya, benim tarafıma itti.'),
            s(
              'leyla',
              'Poliçeyi oku; özel şartlarını da. Sigortacılar en önemli cümleyi en küçük puntoyla yazar. Kim istedi, kime ödenir, kim artırdı.',
            ),
          ],
        },
        {
          lines: [
            n('Leyla pencerenin önünde duruyordu. Dışarıda yağmur; içeride radyatörün tıkırtısı.'),
            s(
              'leyla',
              'Delil dilekçesini geciktirme. Neyi incelemediklerini bul, onu iste. Bir dosyada en güçlü delil bazen hiç bakılmamış olandır.',
            ),
            s('leyla', 'Ve tanıklara cevap verme. Soruyu sor, sus. Sessizlik iyi bir tanığın en iyi dostudur.'),
          ],
        },
      ],
      choices: [back('LEYLA_BITIR', 'Teşekkür et')],
    }),
    choiceNode('INV_DIL', {
      ...INV1,
      title: 'Delil dilekçesi (CMK 177)',
      hud: ['dil_hak'],
      lines: [
        {
          lines: [
            n(
              'Boş bir dilekçe şablonu ekranda. İmleç yanıp sönüyordu. Bir avukatın en güçlü silahı da en sıkıcı belgesidir: “Sayın Hâkimliğinize…”',
            ),
            th('Üç talep. Her biri bir kapı. Yanlış kapıyı çalarsam, doğru kapıya vaktim kalmayabilir.'),
          ],
        },
      ],
      prompt:
        'Mahkemeye delil dilekçesi (CMK 177). Müzekkereye, davetiyeye gün lazım; dilekçe bugün verilmeli. Üç talep hakkın var; neyi isteyeceksin?',
      choices: [
        option('DIL_PANO', 'Emanetteki sigorta panosu ve koridor hattının elektrik bilirkişisince incelenmesi', {
          visibleWhen: any(has('clue_pano'), has('clue_pano_yok'), has('clue_baslangic')),
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 60 },
          effects: [raise('pano_istendi')],
          good: 'Yerinde: emanetteki materyalin incelenmesi, bilirkişinin hiç bakmadığı alternatif sebebi araştırır (CMK 63, 177/1). Rapor ara evresinde gelir.',
          next: '$stay',
        }),
        option('DIL_ARIZA', 'Dağıtım şirketinden 15 Ocak gecesinin sokak hattı arıza kayıtlarının istenmesi', {
          visibleWhen: flag('fact_tv'),
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 60 },
          effects: [raise('ariza_istendi')],
          good: 'Kabul: özel şirket kayıtları mahkemenin müzekkeresiyle istenir (CMK 177/1, 206/1). Kayıtlar ara evresinde gelir.',
          next: '$stay',
        }),
        option('DIL_LAB', 'Laboratuvarın ham verilerinin ve numune kabul tutanağının istenmesi', {
          visibleWhen: has('clue_taze'),
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 40 },
          effects: [raise('lab_istendi')],
          good: 'Yerinde: rapordaki sonucun dayandığı ham veri, sonucun kendisinden çok şey söyler. Kromatogram ara evresinde gelir.',
          next: '$stay',
        }),
        option('DIL_CEVDET', 'Bekçi Cevdet Alkan’ın tanık olarak dinlenmesi', {
          visibleWhen: met('cevdet'),
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 40 },
          effects: [raise('cevdet_istendi')],
          good: 'Kabul: olay yerinin muhafazasını yapan kişi, kimin girip çıktığına doğrudan tanıktır (CMK 177/1).',
          next: '$stay',
        }),
        option('DIL_TARIK', 'Sigorta eksperi Tarık Sönmez’in tanık olarak dinlenmesi', {
          visibleWhen: has('clue_numune'),
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 40 },
          effects: [raise('tarik_istendi')],
          good: 'Yerinde: numuneleri getiren ve raporu yazan kişi; raporunun dayanağı ancak kendisi dinlenerek sınanır (CMK 177, 210/1).',
          next: '$stay',
        }),
        option('DIL_RET', 'Bilirkişi raporunun hukuka aykırı delil olarak dosyadan çıkarılması', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: -30 },
          bad: 'Bilirkişi raporu hukuka aykırı yöntemle elde edilmiş bir delil değildir; aleyhe olması onu dosyadan çıkarmaz (CMK 206/2-a, 217/2 hukuka aykırı delil içindir). Rapor serbestçe takdir edilir; itiraz, yeni bilirkişi ya da bilimsel mütalaa ile sınanır (CMK 67/5–6).',
          next: '$stay',
        }),
        option('DIL_KESIF', 'Yanık evde hâkim ve bilirkişi huzurunda keşif ve olay yerinin yeniden fotoğraflanması', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          neutral:
            'Üç ay ve birkaç yağmur sonra keşif, yangın gecesinin zeminini göstermez; ev zaten senin gözünün önünde. Fotoğraflar ve emanetteki materyal daha iyi bir tanık.',
          next: '$stay',
        }),
        option('DIL_VER', 'Dilekçeyi ver', {
          enabledWhen: cmp(v('dil_hak'), '<', 3),
          lockedReason: 'En az bir talep seç.',
          responses: [
            {
              lines: [
                n('Dilekçe UYAP’tan gönderildi. Ekran bir onay numarası verdi; bir umut vermedi.'),
                th('Talepler hâkimin masasında. Cevapları duruşmada duyacağım.'),
              ],
            },
          ],
          next: '$return',
        }),
        option('DIL_VAZGEC', 'Dilekçe vermekten vazgeç', {
          neutral:
            'Delil dilekçesi verilmedi; taleplerini duruşmada (CMK 206/1) dile getirebilirsin ama zaman kaybedersin.',
          next: '$return',
        }),
        back('DIL_GERI', 'Sonra dönerim'),
      ],
    }),
    deductionBoard('INV_CIKARIM', {
      ...INV1,
      title: 'Çıkarım Tahtası · Nerede, neyle',
      background: 'buro_gece',
      lines: [
        {
          lines: [
            n(
              'Yangın tahtası: nerede başladı, neyle başladı? İki ipucunu seç; birbirini tamamlıyorsa duruşmada kullanabileceğin bir DELİL doğar. Yanlış çift puan götürür.',
            ),
          ],
        },
      ],
      pool: [
        'clue_foto_tavan',
        'clue_eksper_foto',
        'clue_numune',
        'clue_eksper_giris',
        'clue_pano',
        'clue_pano_yok',
        'clue_v_izi',
        'clue_baslangic',
        'clue_buat',
        'clue_necati',
        'clue_taze',
        'clue_su',
        'clue_moloz',
        'clue_gec',
      ],
      recipes: [
        deduce(
          'CB_TEMIZ',
          'clue_foto_tavan',
          'clue_eksper_foto',
          'ded_temizlenmis',
          'Temizlenmiş zemin',
          '04.30’da zemin tavan tahtalarının altındaydı. 09.40’ta çıplak ve ıslaktı. Arada biri molozu kaldırmış ve “izi” ondan sonra fotoğraflamış.',
        ),
        deduce(
          'CB_ZINCIR',
          'clue_numune',
          'clue_eksper_giris',
          'ded_zincir',
          'Kopuk numune zinciri',
          'Numuneleri kolluk almamış. Muhafaza altındaki olay yerine 09.20’de tek başına giren eksper getirmiş. Kimin, nereden, nasıl aldığını gösteren resmî bir tutanak yok.',
        ),
        deduce(
          'CB_PANO',
          'clue_pano',
          'clue_pano_yok',
          'ded_pano',
          'Elektrik hiç incelenmedi',
          'Pano söküldü, emanete kondu ve orada kaldı. “Elektrik izi yok” cümlesi, kimsenin bakmadığı bir şeyin yokluğunu ilan ediyor.',
        ),
        deduce(
          'CB_KOKEN',
          'clue_v_izi',
          'clue_baslangic',
          'ded_koken',
          'Başlangıç: mutfak–koridor duvarı',
          'Lambrideki V koridora bakıyor; itfaiye de başlangıcı mutfak–koridor bölgesine koyuyor. Salonun ortası değil.',
        ),
        deduce(
          'CB_BUAT',
          'clue_buat',
          'clue_necati',
          'ded_buat',
          'Isınan buat',
          'Necati Usta bir ay önce koridor buatının ısındığını yazmış. Yangından sonra aynı buatta bakır erimiş, boncuklanmış.',
        ),
        deduce(
          'CB_TAZE',
          'clue_taze',
          'clue_su',
          'ded_taze',
          'Söndürmeden sağ çıkan benzin',
          'Saatlerce ateş, seksen dakika su. Böyle bir zeminden neredeyse taze bir benzin çıkması beklenmez. Benzin yangından sonra gelmiş olabilir.',
        ),
      ],
      miss: fallback('FB_CIKARIM', 'COMBINE', {
        repeat: 'ONCE_PER_PARAMS',
        score: { DELIL_ANALIZI: -50 },
        feedback: {
          title: 'Bu ikisi birbirini açıklamıyor',
          text: 'Yan yana duruyorlar ama aynı cümleyi kurmuyorlar. Başka bir çift dene.',
          label: 'BAĞLANTI YOK · −50 SKOR',
          tone: 'error',
        },
      }),
      finish: { id: 'CIKARIM_BITIR' },
    }),
    deductionBoard('INV_IPLIK', {
      ...INV1,
      title: 'Çıkarım Tahtası · Halatın iplikleri',
      background: 'buro_gece',
      lines: [
        {
          lines: [
            n(
              'İplik tahtası: savcının halatını oluşturan dolaylı deliller. Her ipliğin masum ve belgeli bir açıklaması var mı? Yanlış çift puan götürür.',
            ),
          ],
        },
      ],
      pool: [
        'clue_esyalar',
        'clue_restorasyon',
        'clue_bidon',
        'clue_jenerator',
        'clue_banka',
        'clue_dain',
        'clue_kampanya',
        'clue_cagri',
        'clue_saadet_fener',
        'clue_devriye',
        'clue_necati',
        'clue_borc',
        'clue_yan_ev',
      ],
      recipes: [
        deduce(
          'CB_TASIMA',
          'clue_esyalar',
          'clue_restorasyon',
          'ded_tasima',
          'Eşyalar restorasyon için taşındı',
          'Sözleşme odaların 15 Ocak’a kadar boşaltılmasını istiyor; eşyalar “restorasyon bitince geri” etiketli. Bu bir kaçış değil, bir takvim.',
        ),
        deduce(
          'CB_BIDON',
          'clue_bidon',
          'clue_jenerator',
          'ded_bidon',
          'Bidon hâlâ dolu',
          'Beş litrenin dört litresi atölyede, jeneratörün yanında. Fiş bir alımı gösteriyordu; bidon nereye gittiğini.',
        ),
        deduce(
          'CB_BANKA',
          'clue_banka',
          'clue_dain',
          'ded_banka',
          'Poliçe kredinin şartıydı',
          'Sigortayı banka şart koşmuş; tazminat kredi bakiyesi kadar önce bankaya gidecek. Kırk yedi gün, bir kredinin yaşı.',
        ),
        deduce(
          'CB_ARTIS',
          'clue_kampanya',
          'clue_cagri',
          'ded_artis',
          'Artışı acente teklif etti',
          'Kampanya kodu ve giden arama: teminatı artıran telefonu Halil açmamış; acente açmış.',
        ),
        deduce(
          'CB_ONLEM',
          'clue_restorasyon',
          'clue_necati',
          'ded_onlem',
          'Yenileme takvimdeydi',
          'Elektrikçi yenilemeyi restorasyona bağlamış; sözleşme 19 Ocak’ta tesisatla başlıyor. Halil uyarıyı duymuş ve takvime koymuş.',
        ),
        deduce(
          'CB_FENER',
          'clue_saadet_fener',
          'clue_devriye',
          'ded_fener',
          'El fenerli adam bekçiydi',
          'Saadet Hanım’ın gece bir sularında gördüğü el fenerli adam, çizelgesine 01.30 kapı kontrolü yazan bekçi.',
        ),
      ],
      miss: fallback('FB_IPLIK', 'COMBINE', {
        repeat: 'ONCE_PER_PARAMS',
        score: { DELIL_ANALIZI: -50 },
        feedback: {
          title: 'Bu ikisi birbirini açıklamıyor',
          text: 'Yan yana duruyorlar ama aynı cümleyi kurmuyorlar. Başka bir çift dene.',
          label: 'BAĞLANTI YOK · −50 SKOR',
          tone: 'error',
        },
      }),
      finish: { id: 'IPLIK_BITIR' },
    }),
    // --- Duruşmadan önceki gece: koşullu hafıza zinciri ---
    decisionNode('INV_GECE_1', [{ to: 'INV_GECE_2' }], {
      ...INV1,
      title: 'Duruşmadan önceki gece',
      lines: [
        {
          lines: [
            card('13 NİSAN · PAZARTESİ 23.30 — ARSLAN HUKUK', 'buro_gece'),
            n(
              'Panoya iğnelediğim fotoğraflar masa lambasının ışığında birer pencere gibiydi. Hepsi aynı eve açılıyordu; hiçbiri aynı saati göstermiyordu.',
            ),
          ],
        },
      ],
    }),
    decisionNode('INV_GECE_2', [{ to: 'INV_GECE_3' }], {
      ...INV1,
      lines: [
        {
          when: all(has('ded_zincir'), has('ded_temizlenmis')),
          lines: [
            th(
              'Zemin 04.30’da örtülüydü. 09.20’de biri şeridin altından girdi. 09.40’ta zemin çıplaktı. Numuneler o elden geldi. Yarın bunu bilirkişiye kendi raporundan okutacağım.',
            ),
          ],
        },
        {
          when: has('ded_zincir'),
          lines: [
            th(
              'Numuneleri kolluk almamış. Eksper getirmiş. Bunu raporun içinde, kimsenin okumadığı bir satırda buldum.',
            ),
          ],
        },
        {
          when: has('clue_numune'),
          lines: [
            th(
              'Numuneler eksperden gelmiş. Ama olay yerine ne zaman, kimin gözetiminde girdi? Bilmiyorum. Yarın bilmediğim bir şeyi soracağım.',
            ),
          ],
        },
        {
          lines: [
            th('Laboratuvar “benzin” diyor. Benzin nereden geldi? Rapor bir cevap veriyor; ben soruyu hiç sormadım.'),
          ],
        },
      ],
    }),
    decisionNode('INV_GECE_3', [{ to: 'INV_GECE_4' }], {
      ...INV1,
      lines: [
        {
          when: any(has('ded_tasima'), has('ded_bidon')),
          lines: [
            th(
              'İplikler. Eşyalar bir takvimin, benzin bir jeneratörün. Savcı ipi bir bütün olarak gösterecek; ben her ipliği ayrı ayrı gösterip yere koyacağım.',
            ),
          ],
        },
        {
          lines: [
            th(
              'Poliçe, eşyalar, benzin. Üç iplik. Henüz hiçbirini koparamadım. Yarın savcı onları bir halat gibi sallayacak.',
            ),
          ],
        },
      ],
    }),
    decisionNode('INV_GECE_4', [{ to: 'INV_GECE' }], {
      ...INV1,
      lines: [
        {
          when: flag('zehra_sor'),
          lines: [th('Zehra babasına sordu mu? Bilmiyorum. Yarın koridorda ikisinin yüzüne bakınca anlayacağım.')],
        },
        {
          when: flag('zehra_guven'),
          lines: [
            th('“Henüz bilmiyoruz, bakıyoruz.” Zehra bu cümleye tutundu. Yarın ona tutunacak bir şey daha vermeliyim.'),
          ],
        },
        {
          when: all(flag('fact_ev'), not(flag('mektup'))),
          lines: [
            th(
              'Yüz yirmi yıllık bir ev. Tavanlarda göbek, kapılarda ceviz. Halil “ahşabı Nermin bilirdi” dedi. Yarın o evin ahşabını bir bilirkişi okuyacak.',
            ),
          ],
        },
        {
          when: flag('mektup'),
          lines: [
            th(
              'Sandığı açtım. Mektuplar bir kurdeleyle bağlıydı. Birini okudum; sonra utandım ve geri koydum. Yarın Zehra’ya vereceğim.',
            ),
          ],
        },
        {
          lines: [
            th(
              'Yarın Halil’i ilk kez takım elbiseyle göreceğim. Zehra bir ceket almış; omuzları dar. Babasının bedenini iki ayda unutmuş.',
            ),
          ],
        },
      ],
    }),
    story('INV_GECE', {
      ...INV1,
      title: 'Duruşmadan önceki gece',
      background: 'buro_gece',
      lines: [
        {
          lines: [
            n('Kapı çaldı. Leyla, elinde iki bardak çayla. Saat gece yarısına yaklaşıyordu.'),
            s(
              'leyla',
              'Yarın bilirkişi kürsüde olacak. Raporunu ezbere bilecek. Sen ondan daha iyi bil: hangi sayfada neyi yazmadığını.',
            ),
            s(
              'leyla',
              'Onu küçük düşürme. Bir bilirkişi yanıldığını kabul edebilir; aşağılandığını asla. Sayfalarını say. Eksik sayfayı ona sen gösterme; kendisi bulsun.',
            ),
            s(
              'leyla',
              'Ve komşu. Yaşlı bir kadın, keskin bir burun, bir polis sorusu. Onu yalancı çıkarma. Hatırladığı şeyi kimin ona hatırlattığını göster.',
            ),
            s(
              'leyla',
              'Bir de şunu bil: yarın kaybedebilirsin. İlk celsede kimse kazanmaz zaten; ama kaybedilebilir. Sakin ol, yazdır, iste. Bir celse bir dosyanın bitişi değil, bir ara kararın başlangıcıdır.',
            ),
            n('Pencerenin dışında şimşek çaktı; bir an bütün fotoğraflar beyaza kesti.', { fx: 'flash' }),
            th('Bir ev, iki fotoğraf, beş saat. Yarın sabah dokuz buçukta.'),
          ],
        },
      ],
      choices: [
        option('GECE_A', 'Bilirkişiye sorulacak soruları gözden geçir', {
          score: { SORGULAMA: 20 },
          responses: [
            {
              lines: [
                th(
                  'Dört soru yazdım; birini sildim. Bir bilirkişiye sorulmaması gereken soru, ona ders verir gibi duran sorudur.',
                ),
              ],
            },
          ],
          next: 'H1_00K',
        }),
        option('GECE_B', 'Raporu son bir kez oku', {
          score: { DELIL_ANALIZI: 20 },
          responses: [
            {
              lines: [
                th(
                  'Raporu bir kez daha okudum. Kelimeler aynıydı. Ama bu sefer ekleri okuyordum. Ekler, raporun itiraf ettiği yerlerdir.',
                ),
              ],
            },
          ],
          next: 'H1_00K',
        }),
        option('GECE_C', 'Işığı kapat ve uyumaya çalış', {
          responses: [
            {
              lines: [
                th(
                  'Uyumadım. Ama ışığı kapattım. Karanlıkta bir evin yanışını düşündüm; turuncu bir pencere, yağmurda bir fener.',
                ),
              ],
            },
          ],
          next: 'H1_00K',
        }),
      ],
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
};
