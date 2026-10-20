import {
  ifThen,
  L,
  N,
  P,
  all,
  any,
  cmp,
  cont,
  decisionNode,
  deliver,
  flag,
  has,
  inc,
  nav,
  not,
  option,
  raise,
  ref,
  says,
  set,
  story,
  v,
  visited,
  when,
  otherwise,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ResponseBlock } from '../../../tools/content/src/kit/index.js';
import { INV, T, card, fx, p1 } from './shared.js';

// 50-investigation-1: soruşturma hub'ı (3 gün × 5 EP), gün sonu akşamları, Leyla'ya danışma ve duruşmadan önceki gece.

const dayDeliveries = [
  { evidence: 'ev_sinyal_log', requires: flag('dil_sinyal'), hint: 'Belediyeden sinyal kayıtlarını dilekçeyle iste.' },
  { evidence: 'clue_uedas', requires: flag('dil_uedas'), hint: 'UEDAŞ’tan 14 Kasım gerilim kaydını dilekçeyle iste.' },
];
const dayEnd = deliver('INV_DAY_END', dayDeliveries);
const lastDay = deliver('INV_GECE_1', dayDeliveries);

const hubLines: ResponseBlock[] = [
  when(
    cmp(v('day'), '==', 1),
    card('GÜN 1/4 · İKİNCİ CELSEYE 14 GÜN'),
    N(
      'Hedef: Volkan o gece neyi hatırlıyor? Bilirkişi raporu neye dayanıyor? Kavşakta, bilirkişinin hiç gitmediği yerde ne var?',
    ),
    N(
      'Büronun penceresinden Setbaşı köprüsü görünüyordu. Sabah trafiği, kornalar, bir simitçinin sesi. Masamda Gül’ün dört klasörü, renk sırasıyla.',
    ),
    T(
      'Dört gün. Bir raporu, bir tanığı, bir müvekkili ve bir kavşağı tanımak için dört gün. Hangisinden başlarsam başlayayım, öbürleri bekleyecek.',
    ),
  ),
  when(
    all(cmp(v('day'), '==', 2), atLeastOf(2, ['clue_fren', 'clue_cam', 'clue_boya'])),
    card('GÜN 2/4 · İKİNCİ CELSEYE 12 GÜN'),
    N(
      'Hedef: fren izi, cam kırıkları, boya. Kavşakta o gece kaç araç vardı? Ve ışık: taksici durduğu yerden neyi görebilirdi?',
    ),
    N(
      'Gece rüyamda bir fren izi gördüm. On sekiz metre, bitmeyen. Uyandığımda ilk iş krokiye baktım; iz hâlâ oradaydı, kâğıtta, aynı uzunlukta.',
    ),
    T('Bir izin sahibi olur. Bu izin sahibi kim?'),
  ),
  when(
    cmp(v('day'), '==', 2),
    card('GÜN 2/4 · İKİNCİ CELSEYE 12 GÜN'),
    N('Hedef: ışık. Taksici durduğu yerden neyi görebilirdi? Kavşakla ilgili kim, hangi kaydı tutuyor?'),
    N(
      'Gece rüyamda bir trafik lambası gördüm; üç rengi aynı anda yanıyordu. Uyandığımda saçma geldi. Sonra o kadar saçma gelmedi.',
    ),
  ),
  when(
    cmp(v('day'), '==', 3),
    card('GÜN 3/4 · İKİNCİ CELSEYE 10 GÜN'),
    N(
      'Hedef: insanlar. Hatice Hanım’ı tanıyanlar, kavşağın makinesini tanıyanlar, o gece başını kaldıranlar. Kim neyi gördü, kim neyi gördüğünü sanıyor?',
    ),
    N(
      'Pazar sabahı Bursa sessizdir. Kiliseden çevrilme bir cami, bir fırının önünde kuyruk, bir çocuk bisikleti. Kahvemi büfeden aldım; büfeci bana uzun uzun baktı.',
    ),
    T('Mahalle beni tanımaya başladı: “sanığın avukatı”. Bir sıfat. Bir suçlama değil; ama bir suçlamaya yakın.'),
  ),
  otherwise(
    card('GÜN 4/4 · İKİNCİ CELSEYE 8 GÜN'),
    N(
      'Hedef: dilekçe için son gün. Tahtayı topla. Duruşmada kimi dinletmek, neyi okutmak, neye itiraz etmek istiyorsun?',
    ),
    N(
      'Pazartesi. Adliye açık, kurumlar açık, telefonlar çalıyor. Leyla sabah erkenden gelmiş, odasının kapısını kapatmış.',
    ),
    T(
      'Son gün. Yarın dilekçe süresi doluyor; öbür gün duruşmaya hazırlık. Bugün eksik kalan her şey, duruşmada bir sessizlik olarak geri gelecek.',
    ),
  ),
];

/** Akşam telefonunda Gül'ün ilk cümlesi (aynı satır her iki seçenekte). */
const gulAcilis = [
  L('gul', 'Bir de… ilk gün size söylediklerim için. Siz sordunuz, ben anlattım. Uzun zamandır kimse sormuyordu.'),
];

export const invHub: CasePart = {
  nodes: [
    p1.hub({
      ...INV,
      title: 'Soruşturma',
      background: 'buro',
      lines: hubLines,
      scenePreview: { scene: 'sc_gece' },
      tabs: [
        {
          id: 't_olay',
          label: 'OLAY YERİ',
          kind: 'SCENE',
          choices: [
            p1.activity('H_ARAMA', 'Polis fotoğraflarını ara', 'INV_ARAMA', {
              once: true,
              description: '14 Kasım 02.10 fotoğrafları · büyüteç 6',
            }),
            p1.activity('H_ARAMA2', 'Kavşağa git', 'INV_ARAMA2', {
              once: true,
              description: 'Gökdere–Çınarlı, bugün · büyüteç 5',
            }),
            p1.activity('H_ARAMA3', 'Yediemin otoparkı', 'INV_ARAMA3', {
              once: true,
              description: 'Volkan’ın arabası · büyüteç 6',
            }),
          ],
        },
        {
          id: 't_kisi',
          label: 'KİŞİLER',
          kind: 'PEOPLE',
          choices: [
            p1.activity('H_GORUS', 'Volkan’la görüş', 'INV_GORUSME', {
              description: 'Evde · görüşme için 16 dk',
              visibleWhen: not(visited('INV_GORUSME')),
              effects: [set('min', 16)],
            }),
            p1.activity('H_GORUS2', 'Volkan’la tekrar görüş', 'INV_GORUSME', {
              description: 'Yeni bulgularla · 8 dk',
              maxUses: 1,
              visibleWhen: visited('INV_GORUSME'),
              effects: [set('min', 8)],
            }),
            p1.activity('H_T_NEC', 'Necati Bulut', 'INV_T_NEC', {
              once: true,
              description: 'Taksici · tek görgü tanığı',
            }),
            p1.activity('H_T_SER', 'Serkan Durmaz', 'INV_T_SER', {
              once: true,
              description: 'Katılan · Hatice Durmaz’ın oğlu',
            }),
            p1.activity('H_T_HAM', 'Belediye sinyal deposu', 'INV_T_HAM', {
              once: true,
              description: 'Kavşağın bakımından sorumlu teknisyen',
              visibleWhen: any(has('clue_kabin'), cmp(v('day'), '>=', 2)),
            }),
            p1.activity('H_T_SEV', 'Köşedeki büfe', 'INV_T_SEV', {
              once: true,
              description: 'Kameranın sahibi',
              visibleWhen: has('clue_bufe_kamera'),
            }),
            p1.activity('H_T_HAS', 'Devlet Hastanesi · Kat 3', 'INV_T_HAS', {
              once: true,
              description: 'Hatice Hanım’ın vardiya arkadaşları',
              visibleWhen: any(has('clue_cicek'), visited('INV_T_SER'), cmp(v('day'), '>=', 2)),
            }),
            p1.activity('H_T_AYT', 'Trafik şube: Ayten Yurt', 'INV_T_AYT', {
              once: true,
              description: 'Tutanağı düzenleyen polis',
              visibleWhen: any(has('clue_cam'), has('clue_far')),
            }),
          ],
        },
        {
          id: 't_arsiv',
          label: 'ARŞİV',
          kind: 'ARCHIVE',
          choices: [
            p1.activity('H_RAPOR', 'Bilirkişi raporunu incele', 'INV_RAPOR', {
              once: true,
              description: 'Müh. Cengiz Ateş · 4 sayfa',
            }),
            p1.activity('H_TUTANAK', 'Tutanağı ve krokiyi incele', 'INV_TUTANAK', {
              once: true,
              description: 'Pol. Mem. A. Yurt',
            }),
            p1.activity('H_OTOPSI', 'Otopsi ön raporunu incele', 'INV_OTOPSI', {
              once: true,
              description: 'Adli Tıp Şube',
            }),
            p1.activity('H_BUFE', 'Büfe kaydını izle', 'INV_BUFE', {
              once: true,
              description: 'USB kopya · kare kare',
              visibleWhen: has('ev_bufe'),
            }),
            p1.activity('H_SINYAL', 'Sinyal olay günlüğünü incele', 'INV_SINYAL', {
              once: true,
              description: 'Belediyenin cevabı',
              visibleWhen: has('ev_sinyal_log'),
            }),
            p1.activity('H_DIL', 'Delil dilekçesi (CMK 177)', 'INV_DIL', {
              description: '3 talep hakkı',
              visibleWhen: not(flag('dil_verildi')),
            }),
            p1.free('H_CIKARIM', 'Çıkarım tahtası', 'INV_CIKARIM', {
              description: '0 EP · ipuçlarını birleştir',
              enabledWhen: ref('kart2'),
              lockedReason: 'En az 2 ipucu gerekli.',
            }),
            p1.free('H_LEYLA', 'Leyla’ya danış', 'INV_LEYLA', {
              description: '0 EP · günde bir kez',
              visibleWhen: cmp(v('leyla_gun'), '<', v('day')),
              effects: [set('leyla_gun', v('day'))],
            }),
          ],
        },
      ],
      quickTalk: {
        character: 'volkan',
        line: '“Yeşil yanıyordu avukat hanım. Ama ben hissettim. Bunu nasıl açıklayacağım?”',
        choices: ['H_GORUS', 'H_GORUS2'],
      },
      choices: [
        nav('H_DURUSMA', 'DURUŞMAYA GİT · 2. CELSE', 'INV_GECE_1', {
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen soruşturma biter. Emin misin?',
        }),
      ],
    }),

    // --- Gün sonu: teslimler, gün + 1, akşam sahnesi ---
    decisionNode(
      'INV_DAY_END',
      [
        { when: cmp(v('day'), '==', 2), to: 'INV_AKSAM1' },
        { when: all(cmp(v('day'), '==', 3), flag('serkan_saygi')), to: 'INV_AKSAM2S' },
        { when: cmp(v('day'), '==', 3), to: 'INV_AKSAM2L' },
        { to: 'INV_AKSAM3' },
      ],
      {
        ...INV,
        onEnter: [...dayEnd.effects, inc('day', 1), set('ap', 4)],
        lines: [
          when(
            all(flag('dil_sinyal'), has('ev_sinyal_log'), not(visited('INV_SINYAL'))),
            N(
              'Akşamüstü belediyeden bir zarf geldi: kavşağın denetleyici kayıtları ve Beyaz Masa dökümü. Kalın, gri, iyi kokmayan bir zarf.',
            ),
          ),
          when(
            all(flag('dil_uedas'), has('clue_uedas')),
            N('UEDAŞ’ın cevabı da düştü: tek sayfa, tek satır. Bazen tek satır yeter.'),
          ),
        ],
      },
    ),
    story('INV_AKSAM1', {
      ...INV,
      title: 'İlk akşam',
      background: 'buro_gece',
      lines: says(
        card('CUMA 22.15 — ARSLAN HUKUK', 'buro_gece'),
        N(
          'Büro boşalmıştı. Kaloriferin tıkırtısı, sokakta bir köpek, bilgisayarın fanı. Masamda gün boyunca topladığım kâğıtlar.',
        ),
        N('Telefon çaldı. Gül.'),
        L(
          'gul',
          'Uyuyor musunuz? Uyumuyorsunuz. Ben de uyumuyorum. Kız tekmeliyor; Volkan balkonda sigara içiyor. Altı yıl önce bırakmıştı.',
        ),
        L(
          'gul',
          'Bir şey soracağım, saçma gelecek. İsim. Volkan “annesinin adını koyalım” diyor. Annesi Hatice değil, Nermin. Ama ben… bilmiyorum, bu ay her isim ağır geliyor.',
        ),
        L('gul', 'Siz olsanız ne koyardınız?'),
      ),
      choices: [
        option('AK1_A', '“Henüz koymayın. Doğduğunda yüzüne bakınca bilirsiniz.”', {
          effects: [
            set('aksam1', 'BEKLE'),
            ifThen(flag('gul_dinle'), [inc('trust', 2)]),
            ifThen(flag('gul_kirgin'), [inc('trust', 2)]),
          ],
          responses: says(
            ...gulAcilis,
            L('gul', 'Yüzüne bakınca. Evet. Babasına benzerse “Sabır” koyarım.'),
            N('Güldü. İlk kez. Sonra sustu.'),
            L('gul', 'İyi geceler avukat hanım. Teşekkür ederim. İsim için değil.'),
            T('Telefonu kapattım. Masada bir kroki, bir otopsi raporu, bir bebeğin adı. Hepsi aynı ağırlıktaydı.'),
          ),
          next: 'INV_HUB',
        }),
        option('AK1_B', '“Ela. Kısa, aydınlık. Bu dosyanın içinden çıkacak bir şey aydınlık olsun.”', {
          effects: [
            set('aksam1', 'ELA'),
            ifThen(flag('gul_dinle'), [inc('trust', 2)]),
            ifThen(flag('gul_kirgin'), [inc('trust', 2)]),
          ],
          responses: says(
            ...gulAcilis,
            L('gul', 'Ela. … Volkan’a söyleyeceğim. Gözleri ela onun, biliyor musunuz?'),
            L('gul', 'İyi geceler. Siz de uyuyun. Bir avukatın uykusuz olması bize iyi gelmez.'),
            T('Uyumadım. Ama denedim; bunu da sayın.'),
            N(
              'Masadaki lambayı kapattım. Karanlıkta krokinin beyaz çizgileri hâlâ seçiliyordu; gözlerimde, kâğıtta değil.',
            ),
          ),
          next: 'INV_HUB',
        }),
      ],
    }),
    story('INV_AKSAM2S', {
      ...INV,
      title: 'Kapıdaki adam',
      background: 'sokak_gece',
      lines: says(
        card('CUMARTESİ 21.40 — BÜRONUN ÖNÜ', 'sokak_gece'),
        N(
          'Büronun kapısında, sokak lambasının altında biri bekliyordu. Kapüşonlu, elleri ceplerinde. Tanıdım: Serkan Durmaz.',
        ),
        L('serkan', 'Korkmayın. Bir şey yapmayacağım. Ne yapacağımı bilseydim çoktan yapmıştım.'),
        L('serkan', 'Bugün bana “başınız sağ olsun” dediniz ve gerçekten dediniz. Avukatlar genelde ezberden der.'),
        L(
          'serkan',
          'Mahkemede annemin adını söylerken düzgün söyleyin. Hatice. “Maktul” değil. Otuz yıl o hastanenin koridorlarını sildi; kimse adını bilmedi.',
        ),
        P('Söz veriyorum.'),
        L('serkan', 'Bir de… o mesaj. Hâlâ dinleyemedim. Belki bir gün.'),
        N('Gitti. Kapüşonunu kaldırmadan, arkasına bakmadan.'),
        T(
          'Karşı tarafın en kızgın adamı bana bir söz verdirdi. Tutacağım. Müvekkilimin aleyhine olsa bile; çünkü bu söz kimsenin aleyhine değil.',
        ),
      ),
      choices: [cont('AK2S_DEVAM', 'Yeni güne başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
    story('INV_AKSAM2L', {
      ...INV,
      title: 'İkinci akşam',
      background: 'buro_gece',
      lines: says(
        card('CUMARTESİ 21.40 — ARSLAN HUKUK', 'buro_gece'),
        N('Leyla’nın odasının ışığı yanıyordu. Kapısını çaldım. Gözlüğünü çıkardı, “otur” demedi; oturdum.'),
        L('leyla', 'Bugün ne öğrendin?'),
        P('Herkesin bir parçayı gördüğünü. Taksici ışığı, polis camları, bilirkişi bir planı. Kimse bütünü görmemiş.'),
        L(
          'leyla',
          'Bütünü gören tanık olmaz Deniz. Bütünü sen kurarsın, hâkim de senin kurduğunu sınar. Bir parça eksikse o parçayı şüphe doldurur.',
        ),
        N(
          'Leyla gözlüğünü masaya bıraktı. Pencerenin camında yağmur, camın arkasında Uludağ’ın karanlık sırtı. Masasındaki ters çerçeveye dokundu; çevirmedi.',
        ),
        L(
          'leyla',
          'Bir parçayı fazla parlatma. Taksicinin yanlışını bulunca sevinirsin; hâkim ise kendine sorar: bu avukat bütünü mü kuruyor, yoksa yalnızca bir tanığı mı yıkıyor?',
        ),
        L(
          'leyla',
          'Şüphe sanık lehinedir. Ama şüpheyi “olabilir” diye değil, “olmadığı gösterilemedi” diye kurarsın. İkisi aynı cümle değil.',
        ),
        N('Sigara paketini parmaklarıyla çevirdi, açmadı.'),
        L(
          'leyla',
          'Bir de şu: bu dosyada herkes bir şeyden suçluluk duyuyor. Müvekkilin direksiyondan, karısı telefondan, taksici gözünden. Suçluluk bulaşıcıdır. Sana bulaşmasın.',
        ),
        P('Bana bulaşırsa ne olur?'),
        L(
          'leyla',
          'Hata yapmaktan korkarsın. Korkan avukat itiraz etmez. İtiraz etmeyen avukat, raporu imzalamış sayılır.',
        ),
        L('leyla', 'Git uyu. İki gün kaldı; iki gün, bir dosya için hem çok hem az.'),
      ),
      choices: [cont('AK2L_DEVAM', 'Yeni güne başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),

    story('INV_AKSAM3', {
      ...INV,
      title: 'Gece 01.11',
      background: 'sokak_karanlik',
      lines: [
        when(
          has('clue_arka'),
          card('PAZARTESİ GECE 01.09 — GÖKDERE–ÇINARLI KAVŞAĞI', 'sokak_karanlik'),
          N(
            'Gece yarısından sonra kavşağa geri döndüm. Aynı saat, aynı yağmur. Bir taksi durağından bir çay aldım ve Çınarlı Sokak’ın köşesinde, taksicinin beklediği yerde durdum.',
          ),
          N(
            'Önümdeki lamba kırmızı yandı. Başımı sağa çevirdim: Gökdere’ye bakan başlık. Siyah bir kutu. Vidalar. Işık yok, renk yok.',
          ),
          T(
            'Fotoğraf yalan söylememiş. Buradan Gökdere’nin rengi görülmüyor. Görülen tek renk, insanın kendi önündeki renk.',
          ),
          N(
            'Bir taksi yanaştı, şoför camı indirdi: “Bir yere mi abla?” Hayır dedim. Baktı, anlamadı, gitti. Gece yarısı bir kavşakta duran bir kadın; herkes bir hikâye uydurur.',
          ),
          T(
            'Necati de o gece burada durdu. Kendi lambasının kırmızısına baktı. Sonra bir gümbürtü duydu ve kırmızıyı karşı yöne taşıdı. Kötü niyetle değil; insan beyni boşlukları sever.',
          ),
          N(
            'Gökdere’den arada bir araç geçiyordu. Islak asfaltta lastik sesi, sonra uzun bir sessizlik. Kimse kimseye bakmadı.',
          ),
        ),
        otherwise(
          card('PAZARTESİ GECE 01.09 — GÖKDERE–ÇINARLI KAVŞAĞI', 'sokak_karanlik'),
          N(
            'Gece yarısından sonra kavşağa geri döndüm. Aynı saat, aynı yağmur. Köşede durup ışıkların değişmesini izledim. Yeşil, sarı, kırmızı. Kusursuz.',
          ),
          N('Gökdere’den bir kamyonet geçti, sonra bir otomobil. Kimse kimseye bakmadı.'),
          T(
            'Bu kavşakta o gece biri bir şey gördü, biri bir şey duydu, biri bir şey hissetti. Ben hâlâ hiçbirini tam bilmiyorum.',
          ),
        ),
      ],
      choices: [
        option('AK3_BEKLE', 'Işıkların bir tur daha dönmesini bekle; saatleri not al.', {
          effects: [raise('gece_nobet')],
          responses: [
            when(
              any(has('ev_sinyal_log'), has('clue_is_emri'), has('clue_kabin'), flag('fact_hastane_isik')),
              N(
                'Bir tur daha. Yaya yeşili ile Gökdere yeşili birbirini hiç görmüyordu; biri yanarken öbürü sönüktü. Bugün.',
              ),
              T(
                'Not defterime yazdım: “Bugün çatışma yok.” Bir yargıç için anlamsız bir cümle. Benim için bir soru: o gece neden vardı?',
              ),
              N(
                'Saat ikiye doğru bir devriye aracı yavaşladı, camı indi. “Hanımefendi, bir sorun mu var?” “Yok,” dedim, “ışıklara bakıyorum.” Polis güldü, gitti.',
              ),
            ),
            otherwise(
              N(
                'Bir tur daha. Yeşil, sarı, kırmızı. Yaya ışığı, araç ışığı. Hepsi sırasıyla, kusursuz. Saatleri not defterime yazdım: her tur doksan saniye.',
              ),
              T('Doksan saniye. Bir yayanın karşıya geçmesine, bir sürücünün yavaşlamasına yeter. Yeter mi?'),
              N(
                'Saat ikiye doğru bir devriye aracı yavaşladı, camı indi. “Hanımefendi, bir sorun mu var?” “Yok,” dedim, “ışıklara bakıyorum.” Polis güldü, gitti.',
              ),
            ),
          ],
          next: 'INV_HUB',
        }),
        option('AK3_EV', 'Eve git. Yarın son gün; uyumak da bir iş.', {
          responses: says(T('Taksiye bindim. Şoför radyoyu açtı. Maç tekrarı. Hiçbir şey sormadım; o da sormadı.')),
          next: 'INV_HUB',
        }),
      ],
    }),

    // --- Leyla'ya danış (günde bir) ---
    story('INV_LEYLA', {
      ...INV,
      title: 'Leyla’ya danış',
      background: 'buro',
      lines: [
        when(
          all(cmp(v('ilk_adim'), '==', 'RAPOR'), not(visited('INV_RAPOR'))),
          L(
            'leyla',
            'Rapordan başlayacağını söylemiştin. Hâlâ açmadın. Bir avukatın ilk sözünü tutması, müvekkilinden önce kendine verdiği bir sözdür.',
          ),
          L(
            'leyla',
            'Raporun her cümlesinin altında bir varsayım var. Varsayımları say: ışık, iz, çarpma. Hangisini ölçmüş, hangisini sanmış?',
          ),
          L(
            'leyla',
            'Ben ilk yıllarımda raporları sondan başa okurdum. Önce sonucu, sonra gerekçeyi. Yanlış. Bilirkişi de öyle yazar; sonucu bilir, gerekçeyi sonradan döşer.',
          ),
          L(
            'leyla',
            'Sen baştan oku. Her cümlenin yanına bir soru işareti koy. Cevabı raporun içinde olmayan soru işaretleri, itirazının iskeletidir.',
          ),
          T(
            'Soru işaretleri. Leyla’nın masasında kırmızı kalemle çizilmiş soru işaretleriyle dolu bir dosya gördüm bir kez; kazanılmış bir dosyaydı.',
          ),
        ),
        when(
          all(cmp(v('ilk_adim'), '==', 'MUVEKKIL'), not(visited('INV_GORUSME'))),
          L(
            'leyla',
            'Müvekkilden başlayacaktın. Gitmedin mi? Gül Hanım her gün çay demliyor; bir gün demlediği çay soğuyacak.',
          ),
        ),
        when(
          not(any(has('clue_fren'), has('clue_cam'), visited('INV_TUTANAK'))),
          N('Leyla bir dosyanın kenarına not alıyordu. Başını kaldırmadı.'),
          L(
            'leyla',
            'Bilirkişi olay yerine gitmedi. Bunu unutma. Onun görmediği yeri sen gör: polisin fotoğrafları ve tutanak.',
          ),
          L(
            'leyla',
            'Taksirde ilk soru “dikkatsiz miydi?” değildir. İlk soru “ne oldu?”dur. Kusur ancak olay belli olunca tartılır.',
          ),
          L(
            'leyla',
            'Bir de şunu bil: bilirkişi raporuna itiraz için önce raporu tanımak gerekir. Neyi ölçmüş, neyi varsaymış, neyi hiç görmemiş. Varsayımı bul; itiraz oradan başlar.',
          ),
          L(
            'leyla',
            'Ve müvekkiline git. Ama onun “hissettim”ine takılma. Ne gördüğünü sor. Hissetmek tanıklık değildir; görmek tanıklıktır.',
          ),
        ),
        when(
          all(has('clue_fren'), not(has('clue_abs'))),
          L(
            'leyla',
            'Bir fren izi buldun. Güzel. Kimin izi? Her araba aynı izi bırakmaz; bunu bir otomobil satıcısına sorsan bile söyler.',
          ),
          L('leyla', 'Raporun hız hesabı o ize dayanıyorsa, iz başkasınınsa hesap da başkasınındır.'),
        ),
        when(
          all(has('clue_cam'), not(has('clue_far'))),
          L(
            'leyla',
            'Yolda cam var. Hangi farın camı? Bunun cevabı yediemin otoparkında ya da tutanağın araç bölümünde.',
          ),
        ),
        when(
          not(flag('dil_verildi')),
          L(
            'leyla',
            'Dilekçeyi unutma. Savunma delillerinin toplanmasını duruşmadan en az beş gün önce istersin (CMK 177). Üç talep hakkın var; boşa harcama.',
          ),
          L(
            'leyla',
            'Kurumlar yavaştır. Ne kadar erken istersen o kadar erken gelir. Bazı şeyler ancak mahkeme ara kararıyla gelir; onları duruşmada iste.',
          ),
        ),
        when(
          all(has('clue_necati_yer'), not(has('ded_goremez'))),
          L(
            'leyla',
            'Tanığın nerede durduğunu biliyorsun. Şimdi oradan ne görüldüğünü düşün. Dürüst tanık, gördüğünü sandığını da anlatır.',
          ),
          L(
            'leyla',
            'Tanığı yalancı ilan etmek kolaydır, hâkim de sevmez. Tanığın neyi görebileceğini göster; gerisini hâkim kendisi düşünür. Kimseyi küçük düşürmeden.',
          ),
          T(
            'Necati yalan söylemiyor. Kırk yıllık bir şoför, kendi önündeki kırmızıya bakıyor. Bunu ona ben değil, durduğu yer söyleyecek.',
          ),
        ),
        when(
          all(has('clue_kirik56'), not(has('ded_yukseklik'))),
          L(
            'leyla',
            'Otopsideki santimleri boş okuma. Bir kırığın yüksekliği, ona çarpan şeyin yüksekliğidir. Arabanın tamponunu ölçtün mü?',
          ),
        ),
        otherwise(
          L('leyla', 'Tahtaya dön. Bir kart tek başına bir şey söylemez; iki kart bir cümle kurar.'),
          L(
            'leyla',
            'Ve şunu ayır: bilinçli taksir, neticeyi öngörüp “bir şey olmaz” demektir (TCK 22/3). Kırmızıda hızla dalmak bunu düşündürebilir; yeşilde, sınırın altında geçmek düşündürmez.',
          ),
          L(
            'leyla',
            'Bir de illiyet. Bir sonuç için ceza vermek, davranış ile sonuç arasındaki bağı göstermeyi gerektirir. O bağı ispat yükü iddiadadır.',
          ),
        ),
      ],
      choices: [cont('LEYLA_GERI', 'Teşekkür et ve dön', '$return', { role: 'BACK' })],
    }),

    // --- Duruşmadan önceki gece (koşullu hafıza zinciri) ---
    decisionNode('INV_GECE_1', [{ to: 'INV_GECE_2' }], {
      ...INV,
      onEnter: [...lastDay.effects],
      lines: [
        when(
          all(flag('dil_verildi'), any(has('ev_sinyal_log'), has('clue_uedas'))),
          card('DURUŞMADAN ÖNCEKİ GECE · 23.30 — ARSLAN HUKUK', 'buro_gece'),
          N(
            'Son evrak bu akşam geldi. Zarfları açtım, masaya dizdim, panoya iğneledim. Duvar bir suç haritasına döndü; ya da bir kaza haritasına. Hangisi olduğunu yarın öğreneceğiz.',
          ),
          N(
            'Bir fincan kahve, soğumuş. Bir paket bisküvi, yarım. Masanın köşesinde Gül’ün kırmızı klasörü; bir şey unutmuş gibi bırakmış, belki de bilerek.',
          ),
        ),
        otherwise(
          card('DURUŞMADAN ÖNCEKİ GECE · 23.30 — ARSLAN HUKUK', 'buro_gece'),
          N(
            'Panoyu topladım. Raptiyeler, kroki, bir otopsi raporunun fotokopisi. Yağmur yine başlamıştı; camda ince çizgiler.',
          ),
          N('Bir fincan kahve, soğumuş. Bir paket bisküvi, yarım. Masanın köşesinde Gül’ün kırmızı klasörü.'),
        ),
      ],
    }),
    decisionNode('INV_GECE_2', [{ to: 'INV_GECE_3' }], {
      ...INV,
      lines: [
        when(
          atLeastOf(2, ['ded_fren', 'ded_cam', 'ded_yukseklik', 'ded_saat']),
          T(
            'Fren izi, camlar, kırığın yüksekliği. Ayrı ayrı her biri bir tesadüf. Birlikte bir soru: o gece kavşakta Volkan’dan başka kim vardı?',
          ),
        ),
        when(
          any(has('ded_fren'), has('ded_cam'), has('ded_yukseklik'), has('ded_saat')),
          T('Bir çatlak buldum. Raporda, tutanakta, bir yerde. Bir çatlak duvarı yıkmaz; ama içeri ışık sızdırır.'),
        ),
        when(
          all(flag('bufe_volkan'), flag('fact_iki_ses')),
          T(
            'Bir kamera kaydı, bir büfecinin kulağı: bir fren, bir gümbürtü, bir fren daha. Volkan’ın beyaz arabası ikinci frende. Birincisi kimin?',
          ),
        ),
        otherwise(
          T(
            'Elimde bir müvekkilin “yeşildi” sözü ve bir raporun “kırmızıydı” sözü var. Yarın ikisi aynı masaya oturacak.',
          ),
        ),
      ],
    }),
    decisionNode('INV_GECE_3', [{ to: 'INV_GECE_4' }], {
      ...INV,
      lines: [
        when(
          any(has('ded_ariza'), has('ev_sinyal_log')),
          T(
            'Ve makine. Kavşağın makinesi o gece doğruyu göstermiyordu. Bunu bir teknisyen biliyordu, bir iş emri biliyordu. Bilirkişi bilmiyordu.',
          ),
        ),
        when(
          has('ded_goremez'),
          T(
            'Taksici yalan söylemiyor. Bir kırmızı gördü. Kendi kırmızısını. Yarın bunu ona nazikçe göstermem gerek; dürüst bir adamı yalancı gibi gösterirsem hâkim bana kızar.',
          ),
        ),
        when(
          flag('fact_hastane_isik'),
          T(
            'Hastanede bir çay sohbeti: “O ışıklar delirdi.” Bir hafta önce. Bir ölünün sözü bir delil değil; ama bir delilin nerede aranacağını söyler.',
          ),
        ),
        when(
          all(flag('gece_nobet'), any(has('ev_sinyal_log'), has('clue_is_emri'), flag('fact_hastane_isik'))),
          T('Gece kavşakta bekledim. Bugün çatışma yok. Bugün her şey kusursuz. Kusursuzluk bazen bir itiraftır.'),
        ),
        when(
          flag('gece_nobet'),
          T(
            'Gece kavşakta bekledim. Doksan saniyelik turlar, kusursuz. O gecenin doksan saniyesini kimse kaydetmedi mi?',
          ),
        ),
        otherwise(T('Işık konusunda elimde sadece Volkan’ın sözü var. Söz, yemin edilse de bir rapordan hafiftir.')),
      ],
    }),
    decisionNode('INV_GECE_4', [{ to: 'INV_GECE' }], {
      ...INV,
      lines: [
        when(
          flag('fact_tek_lamba'),
          T(
            'Volkan’ın uzakta gördüğü tek kırmızı lamba. Bir hayal mi, bir hatıra mı? Hatıralar delil değildir; ama bazen delile giden yolu gösterir.',
          ),
          N(
            'Telefonuma Gül’den bir fotoğraf düştü: masada iki çay bardağı, birinin yanında Volkan’ın eli. Altında yazı yok. Gerek de yoktu.',
          ),
          T(
            'Yarın sabah bir adam bir salona girecek ve oradan ya hafiflemiş ya ağırlaşmış çıkacak. Bu gece ikisinin arasındaki fark bu panodaki kâğıtlar.',
          ),
          N(
            'Saat bire geliyordu. Yağmur camlara vurdu, sonra durdu. Panonun önünde, ayakta, kâğıtları bir kez daha sıraladım: rapor, tutanak, otopsi, kayıtlar.',
          ),
          T(
            'Yarın bir hâkime bir hikâye anlatmayacağım. Bir raporun dayanaklarını tek tek göstereceğim. Hikâyeyi hâkim kendisi kurar; ben yalnızca tuğlaları getiririm.',
          ),
        ),
        when(flag('serkan_saygi'), T('Serkan’a verdiğim söz aklımda. Hatice. Adını düzgün söyleyeceğim.')),
        when(
          flag('fact_rota'),
          T(
            'Kırk dakikalık bir yürüyüş, iki simit, biriktirilen otobüs parası. Hatice Hanım o yolu ezbere biliyordu. Yolun onu ezbere bilmediği tek gece.',
          ),
        ),
        when(
          flag('fact_anne'),
          T(
            '“Işık senin için yanar, sen onun için değil.” Hatice Hanım’ın oğluna öğrettiği cümle. Yarın bunu bir mahkemeye taşıyacağım; kimin ağzından, bilmiyorum.',
          ),
        ),
        otherwise(T('Volkan’ı düşündüm. Balkonda, altı yıl sonra yaktığı ilk sigara.')),
      ],
    }),
    story('INV_GECE', {
      ...INV,
      title: 'Duruşmadan önceki gece',
      background: 'buro_gece',
      lines: says(
        fx(N('Saat yarımı geçerken telefonum titredi. Bir mesaj. Volkan.'), 'flash'),
        L(
          'volkan',
          'Avukat hanım, yarın kabul edeceğim. Kusurluyum diyeceğim. Gül’e söylemeyin. Kadının oğlu her celse bana bakıyor. Bakışına dayanamıyorum.',
        ),
        T('Kabul etmek onun hakkı. Ama bilmeden kabul etmek bir hak değil; bir kaza. Bu dosyada yeterince kaza var.'),
        N(
          'Panoya baktım. İğneler, kâğıtlar, bir kroki. Ortada Volkan’ın vesikalığı; altında Hatice Hanım’ınki, gazeteden kesilmiş. İki yabancı, aynı panoda.',
        ),
      ),
      choices: [
        option('GECE_ARA', 'Hemen ara ve konuş: karar onun, ama elindekileri bilmeden vermesin.', {
          effects: [raise('volkan_hazir'), inc('trust', 6)],
          good: 'Müvekkili bilgilendirmek avukatın borcudur; kararı yine müvekkil verir (Av.K. md. 34; TBB Meslek Kuralları).',
          category: 'SAVUNMA_STRATEJISI',
          responses: says(
            N('Üçüncü çalışta açtı. Arkada bir televizyonun sesi, Gül’ün uykulu bir “kim o” sorusu.'),
            P('Volkan Bey, beni beş dakika dinleyin. Sonra ne derseniz o.'),
            P(
              'Yarın hâkim size ne gördüğünüzü soracak. Hissettiğinizi değil. Ne gördüyseniz onu söyleyin; bilmediğiniz şeye “bilmiyorum” deyin.',
            ),
            P(
              'Kabul etmek isterseniz bunu ben engelleyemem. Ama kabul ettiğiniz şeyin ne olduğunu bilerek kabul edin. Şu an bilmiyorsunuz. Ben de tam bilmiyorum.',
            ),
            L('volkan', '…Siz de bilmiyorsanız, kim biliyor?'),
            P('Kimse. Henüz. Yarın biraz daha bileceğiz.'),
            L('volkan', 'Tamam. Ne gördüysem. Söz.'),
          ),
          next: 'H1_00K',
        }),
        option('GECE_YAZ', 'Kısa bir mesajla cevap ver: “Yarın sabah konuşalım, karar vermeden önce.”', {
          responses: says(
            N('“Sabah 8.30’da adliye kantininde. Karar vermeden önce.” Mavi tik. Cevap yok.'),
            T('Bir mesaj, bir insanın gece yarısı kararını değiştirmez. Belki sabah değiştirir.'),
          ),
          next: 'H1_00K',
        }),
        option('GECE_SUS', 'Cevap verme; yarın koridorda zaten görüşürsünüz.', {
          effects: [inc('trust', -6)],
          bad: 'Müvekkilin kritik bir kararı bildirdiği an sessiz kalmak, onu bilgisiz bırakmaktır.',
          category: 'SAVUNMA_STRATEJISI',
          responses: says(T('Telefonu ters çevirdim. Bazı sesleri susturmak kolaydır; sonra pahalıya gelir.')),
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
      when: all(cmp(v('ap'), '<=', 0), cmp(v('day'), '<', 4)),
      goto: 'INV_DAY_END',
    },
  ],
  discoveryPaths: [...dayEnd.discoveryPaths, ...lastDay.discoveryPaths],
};

/** En az n delil bulunmuş mu. */
function atLeastOf(n: number, ids: string[]) {
  return cmp({ add: ids.map((id) => ({ if: { when: has(id), then: 1, else: 0 } })) }, '>=', n);
}
