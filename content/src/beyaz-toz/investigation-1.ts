import {
  all,
  any,
  back,
  cmp,
  cont,
  decisionNode,
  deductionBoard,
  dec,
  fallback,
  flag,
  has,
  inc,
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
  met,
  choiceNode,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import type { ChoiceDef } from '@mudafaa/case-schema';
import { INV1, card, n, named, p1, s, th } from './shared.js';

// 50-investigation-hub: 1. evre hub'ı (3 gün × 4 EP), gün sonu ve akşam sahneleri, Leyla'ya danış, delil dilekçesi
// (CMK 177), çıkarım tahtası ve duruşmadan önceki gece.

const deduce = (id: string, a: string, b: string, out: string, title: string, text: string): ChoiceDef =>
  recipe(id, a, b, {
    discovers: out,
    score: { DELIL_ANALIZI: 300 },
    feedback: { title, text, label: 'YENİ DELİL · +300 SKOR', tone: 'success' },
  });

const hubChoices = {
  olay: [
    p1.activity('A_ARKA', 'Arka oda fotoğraflarını ara', 'INV_ARKA', {
      once: true,
      description: 'Olay yeri fotoğrafları · büyüteç 5',
    }),
    p1.activity('A_ON', 'Ön oda ve koridor fotoğraflarını ara', 'INV_ON', {
      once: true,
      description: 'Olay yeri fotoğrafları · büyüteç 6',
    }),
    p1.activity('A_BINA', 'Binaya git', 'INV_BINA', { once: true, description: 'Ihlamur Sokak 14 · bina girişi' }),
  ],
  cezaevi: [
    p1.activity('A_GORUS', 'Kaan’la görüş', 'INV_GORUS_G_1', {
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
    p1.activity('A_DEFNE', 'Defne’nin eczanesi', 'INV_DEFNE', { once: true, description: 'Mudanya · abla' }),
    p1.activity('A_NESRIN', 'Zemin kattaki ev sahibi', 'INV_NESRIN', {
      once: true,
      description: 'Ihlamur Sokak 14 · Daire 1',
      visibleWhen: any(visited('INV_BINA'), visited('INV_TUTANAK')),
    }),
  ],
  arsiv: [
    p1.activity('A_TUTANAK', 'Arama tutanağını ve krokiyi incele', 'INV_TUTANAK', {
      once: true,
      description: 'Savcılık dosyası',
    }),
    p1.activity('A_KARAR', 'Arama kararını incele', 'INV_KARAR', { once: true, description: 'Sulh ceza hâkimliği' }),
    p1.activity('A_MESAJ', 'Mesaj dökümünü incele', 'INV_MESAJ', {
      once: true,
      description: 'Telefon inceleme raporu',
    }),
    p1.activity('A_KRIMINAL', 'Kriminal raporu incele', 'INV_KRIMINAL', {
      once: true,
      description: 'Laboratuvar bulguları',
    }),
    p1.activity('A_TOLGA', 'Muhbirin ifadesini incele', 'INV_TOLGA', { once: true, description: 'Kolluk ifadesi' }),
    p1.activity('A_EMANET', 'Emanet eşya tutanağını incele', 'INV_EMANET', {
      once: true,
      description: 'Kaan’ın üzerinden çıkanlar',
    }),
    p1.activity('A_DIL', 'Delil dilekçesi (CMK 177)', 'INV_DIL', {
      description: 'Üç talep hakkı',
      visibleWhen: not(any({ chosen: 'DIL_VER' }, { chosen: 'DIL_VAZGEC' })),
    }),
    p1.free('A_CIKARIM', 'Çıkarım tahtası', 'INV_CIKARIM', {
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
};

export const investigation1: CasePart = {
  nodes: [
    p1.hub({
      ...INV1,
      title: 'Soruşturma',
      background: 'buro',
      lines: [
        {
          when: cmp(v('day'), '==', 1),
          lines: [
            card('GÜN 1/3 · BİRİNCİ CELSEYE 12 GÜN', 'buro'),
            n(
              'Masamda savcılık dosyasının fotokopisi: dört yüz on iki sayfa. Bir kahve, bir kalem, bir de bir sürü sarı yapışkan not. Henüz hiçbirine bir şey yazmadım.',
            ),
            th(
              'Dosya bir ev gibidir. Önce kapısından girersin, sonra odalarını tek tek dolaşırsın. Bu evin bir odası kilitli. Önce o kilide bakacağım.',
            ),
            n('Hedef: arka oda kimin? Kaan’ı dinle; fotoğraflara ve kâğıtlara bak.'),
          ],
        },
        {
          when: all(cmp(v('day'), '==', 2), any(has('clue_kilit'), has('clue_kira_defteri'), has('clue_odaya_girme'))),
          lines: [
            card('GÜN 2/3 · BİRİNCİ CELSEYE 9 GÜN', 'buro'),
            th('Dün bir hayaletin peşindeydim. Bugün bir mont, bir zincir, bir mesaj. Hayaletler mont giymez.'),
            n('Hedef: arka odada başka biri yaşıyordu. Kim? Ve polis o odaya nasıl girdi?'),
          ],
        },
        {
          when: cmp(v('day'), '==', 2),
          lines: [
            card('GÜN 2/3 · BİRİNCİ CELSEYE 9 GÜN', 'buro'),
            n('Hedef: kâğıtlar ne diyor, fotoğraflar ne gösteriyor? Tutanak ile fotoğraf aynı evi mi anlatıyor?'),
          ],
        },
        {
          lines: [
            card('GÜN 3/3 · BİRİNCİ CELSEYE 6 GÜN', 'buro'),
            n(
              'Sabah erkenden büroya geldiğimde Leyla çoktan oradaydı. Masamın üstüne bir not bırakmıştı: “Beş gün kuralı. Bugün son.” Altına küçük bir çizgi çekmişti.',
            ),
            n('Hedef: delil dilekçesi için son gün. Tahtayı topla; duruşmada kimi dinletmek, neyi okutmak istiyorsun?'),
          ],
        },
      ],
      scenePreview: { scene: 'sc_arka' },
      tabs: [
        { id: 't_olay', label: 'OLAY YERİ', kind: 'SCENE', choices: hubChoices.olay },
        { id: 't_cezaevi', label: 'CEZAEVİ', kind: 'PEOPLE', choices: hubChoices.cezaevi },
        { id: 't_kisi', label: 'KİŞİLER', kind: 'PEOPLE', choices: hubChoices.kisi },
        { id: 't_arsiv', label: 'ARŞİV', kind: 'ARCHIVE', choices: hubChoices.arsiv },
      ],
      quickTalk: {
        character: 'kaan',
        line: '“O oda benim değil, abla. Hiçbir zaman benim olmadı.”',
        choices: ['A_GORUS', 'A_GORUS2'],
      },
      choices: [
        nav('GO_H1', 'DURUŞMAYA GİT · 1. CELSE', 'INV_GECE_1', {
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen soruşturma biter. Emin misin?',
        }),
      ],
    }),
    decisionNode('INV_DAY_END', [{ when: cmp(v('day'), '==', 2), to: 'INV_AKSAM1' }, { to: 'INV_AKSAM2' }], {
      ...INV1,
      title: 'Gün sonu',
      onEnter: [inc('day', 1), set('ap', 5)],
    }),
    story('INV_AKSAM1', {
      ...INV1,
      title: 'Akşam',
      background: 'buro_gece',
      lines: [
        {
          lines: [
            card('CUMA 22.15 — ARSLAN HUKUK', 'buro_gece'),
            n('Leyla paltosunu giymiş, kapının eşiğinde duruyordu. Gitmek üzereydi; gitmedi.'),
            s('leyla', 'Bugün öğrendiğin en önemli şey neydi, Deniz? Delili değil. Şeyi.'),
            th('Masamda fotokopiler, bir kahve, bir de soru. Leyla’nın soruları hep cevaptan uzundur.'),
            n(
              'Pencerenin dışında Bursa’nın ışıkları yağmurda dağılıyordu. Uludağ görünmüyordu; ama oradaydı, her zaman olduğu gibi, kimse bakmasa da.',
            ),
            s(
              'leyla',
              'İlk gün hep aynıdır. Dosya bir duvar gibi gelir. İkinci gün duvarda bir çatlak görürsün. Üçüncü gün çatlağın bir kapı olup olmadığını anlarsın.',
            ),
          ],
        },
      ],
      choices: [
        option('AK1_A', 'Kâğıtların, insanlardan daha az yalan söylediğini.', {
          effects: [set('ders', 'kagit')],
          responses: [
            {
              lines: [
                s(
                  'leyla',
                  'Kâğıtlar yalan söylemez; onları yazanlar söyler. Bir tutanak, yazanın o sabah ne sandığını anlatır. Ne olduğunu değil.',
                ),
                s('leyla', 'Parantezlere dikkat et. İnsanlar emin olmadıkları şeyleri paranteze koyar.'),
              ],
            },
          ],
          next: 'INV_HUB',
        }),
        option('AK1_B', 'Kaan’ın utancının, korkusundan büyük olduğunu.', {
          effects: [set('ders', 'utanc'), inc('trust', 2)],
          responses: [
            {
              lines: [
                s(
                  'leyla',
                  'Evet. Utanç insanı susturur; korku konuşturur. Kaan susuyorsa, bir şeyden utandığı içindir. Bunu ona karşı kullanma.',
                ),
                s('leyla', 'Utancın üstüne yürüme. Yanına otur. Bekle.'),
              ],
            },
          ],
          next: 'INV_HUB',
        }),
        option('AK1_C', 'Bir şey öğrenmediğimi. Her şey hâlâ savcının dediği gibi.', {
          effects: [set('ders', 'hikaye')],
          responses: [
            {
              lines: [
                s(
                  'leyla',
                  'Bu da bir şey. Savcının hikâyesi tutarlı görünüyorsa, onu kimin yazdığına bak. Tutarlılık bazen tek bir kişinin aceleciliğidir.',
                ),
                s('leyla', 'Yarın fotoğraflara bak. Fotoğraf, tutanaktan önce çekilir.'),
              ],
            },
          ],
          next: 'INV_HUB',
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
            card('CUMARTESİ 23.05 — ARSLAN HUKUK', 'buro_gece'),
            n('Telefon titredi. Ekranda: Defne Yıldız. Arkasından eczane kapanırken çekilen kepenk sesi geliyordu.'),
            s(
              'defne',
              'Rahatsız ediyorum, biliyorum. Annem aradı. Kaan’ın sesini duymak istiyormuş. Bir aydır “sınav” diyorum.',
              'uzgun',
            ),
            s(
              'defne',
              'Ne diyeceğimi bilmiyorum, avukat hanım. Ona söylesem mi? Duruşmada her şey konuşulacak, değil mi?',
            ),
            s(
              'defne',
              'Annem emekli öğretmen. Kırk yıl çocuklara “doğruyu söyleyin” dedi. Şimdi iki çocuğu da ona yalan söylüyor. Biri cezaevinden, biri eczaneden.',
              'uzgun',
            ),
            th(
              'Bir sır, bir aileyi bir arada tutan son ip olabilir. Ya da onları boğan ip. Hangisi olduğunu dışarıdan anlamak mümkün değil.',
            ),
          ],
        },
      ],
      choices: [
        option('AK2_A', 'Bunu Kaan’la birlikte karar verin. Kaan’ın hikâyesi, önce Kaan’ın.', {
          effects: [raise('anne_kaan')],
          responses: [
            {
              lines: [
                s('defne', 'Haklısınız. Hep onun yerine karar verdim. Belki bu yüzden bana anlatmadı.'),
                th('Bazı aileler sırlarla ayakta durur. Duruşma salonu sırlara iyi davranmaz.'),
              ],
            },
          ],
          next: 'INV_SABAH3',
        }),
        option('AK2_B', 'Şimdilik söylemeyin. Dosya kapanınca konuşursunuz.', {
          responses: [
            {
              lines: [
                s('defne', 'Peki. Bir hafta daha “sınav”. Yalan söylemekte iyiyim artık. İyi bir şey değil.'),
                th('Kimseye yalan söyle demedim. Ama sustum. Susmak da bir cevap.'),
              ],
            },
          ],
          next: 'INV_SABAH3',
        }),
        option('AK2_C', 'Annenize ben anlatayım; daha sakin olur.', {
          effects: [dec('trust', 5)],
          bad: 'Müvekkilin sağlık bilgisi ve sırrı ona aittir; onun rızası olmadan ailesine bile açıklanamaz (Av.K. 36 sır saklama; KVKK özel nitelikli veri).',
          category: 'SAVUNMA_STRATEJISI',
          responses: [
            {
              lines: [
                s('defne', 'Siz mi? Hayır. Hayır, bu… bu Kaan’ın işi. Ya da benim. Sizin değil.', 'kizgin'),
                th('Haklıydı. Bir sırrı taşımak ile onu dağıtmak arasındaki fark, bir avukatın bütün mesleğidir.'),
              ],
            },
          ],
          next: 'INV_SABAH3',
        }),
      ],
    }),
    story('INV_SABAH3', {
      ...INV1,
      title: 'Kahve Durağı',
      background: 'kafe',
      lines: [
        {
          lines: [
            card('PAZAR 08.10 — GÖRÜKLE, KAHVE DURAĞI', 'kafe'),
            n(
              'Kaan’ın çalıştığı kafe. Küçük, sıcak, tavanına çekilmiş sarı ampuller. Kahve makinesi tıslıyordu; tezgâhın arkasında kırklarında, saçını tokayla toplamış bir kadın.',
            ),
            named('ELİF HANIM', 'Siz Kaan’ın avukatısınız, değil mi? Defne söyledi. Ben Elif. Oturun, kahve benden.'),
            n(
              'Fincanı önüme koydu. Köpüğün üstünde bir yaprak; titrek, yarım. “Kaan’ın yaptığı kadar güzel olmadı” dedi.',
            ),
            named(
              'ELİF HANIM',
              'Üç yıldır burada. Kasayı ona bırakırım; bir kuruş eksik çıkmadı. Pazarları, çarşambaları, cumaları kapanış onda. Müşteriler onu sever; konuşmaz ama dinler.',
            ),
            named(
              'ELİF HANIM',
              'Bir şey olduğunu biliyordum. Ekimde birkaç kere ellerini titrerken gördüm. Sonra bir gün “abla, perşembeleri izin alabilir miyim, doktora gidiyorum” dedi. Sormadım. Verdim.',
            ),
            th(
              'Bir kasiyer kodu, bir kapanış saati, bir izin günü. Bir insanın hayatı çoğu zaman en sıradan kâğıtlarda saklıdır.',
            ),
            n(
              'Kahvemi bitirdim. Fincanın dibinde köpüğün yaprağı yamulmuş, bir kuş gibi duruyordu. Elif Hanım fincanı alırken “Kaan çıkınca yine o yapar” dedi. Bir dilekti; bir tahmin değil.',
            ),
            n('Kapıdan bir kurye girdi; kaskını tezgâha koydu, iki kahve aldı, çıktı. Elif Hanım arkasından baktı.'),
            named(
              'ELİF HANIM',
              'Bunlardan biri de onların evinde kalıyormuş, değil mi? Kaan bir kere “ev arkadaşım gece çalışıyor, sabah uyuyor, ben de sessiz giyiniyorum” demişti. Gülmüştük.',
            ),
          ],
        },
      ],
      choices: [cont('SABAH3_DEVAM', 'Kahveyi bitir ve güne başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
    story('INV_LEYLA', {
      ...INV1,
      title: 'Leyla’ya danış',
      background: 'buro',
      lines: [
        {
          when: not(any(visited('INV_ARKA'), visited('INV_ON'), visited('INV_TUTANAK'))),
          lines: [
            n('Leyla bir dilekçe okuyordu. Kâğıdı indirmeden konuştu.'),
            s(
              'leyla',
              'Savcının dosyası bir odaya dayanıyor. O odayı iki kez gör: polisin yazdığı hâliyle ve fotoğrafın gösterdiği hâliyle. Arasındaki fark, senin davandır.',
            ),
          ],
        },
        {
          when: all(not(has('ded_oda')), any(has('clue_kroki'), has('clue_on_oda'))),
          lines: [
            n(
              'Leyla gözlüğünü çıkardı, camlarını kazağının ucuyla sildi. Ne zaman bir şey söyleyecek olsa önce gözlüğünü silerdi; sanki görmek için değil, düşünmek için.',
            ),
            s(
              'leyla',
              'Kaan nerede uyuyordu? Bu basit soru bazen bütün tutanağı devirir. Kroki ile fotoğrafı yan yana koy.',
            ),
            s('leyla', 'Tahtada iki kartı birleştirmek, mahkemede tek bir cümle kurmaktır. Kartları ona göre seç.'),
          ],
        },
        {
          when: all(has('clue_kilit'), not(has('clue_kapsam'))),
          lines: [
            n('Leyla fotoğraf albümünün 17 numaralı karesine uzun uzun baktı. Parmağını kilidin üstüne koydu, çekti.'),
            s(
              'leyla',
              'Kesik bir kilit gördün. Güzel. Şimdi kararın kendisini oku. Hâkim polise nereyi aramasına izin verdi? Evi mi, odayı mı?',
            ),
            s(
              'leyla',
              'Arama kararı açık çek değildir. Kim, nerede, ne: hepsi yazılı olur. Yazılı olmayan yer, aranmamış sayılır.',
            ),
          ],
        },
        {
          when: all(not(met('nesrin')), cmp(v('day'), '>=', 2)),
          lines: [
            n('Leyla tutanağın son sayfasını çevirdi. İmzaların olduğu sayfa. Üç imza, biri titrek.'),
            s(
              'leyla',
              'Tutanakta bir tanık imzası var. Tanıkları kâğıttan değil, kapısından tanı. Zemin kattaki kadın o sabah ne gördü?',
            ),
            s(
              'leyla',
              'Ama dikkat: tanığa cevabı sen verme. Soruyu sor, sus. Sessizlik, iyi bir tanığın en iyi dostudur.',
            ),
          ],
        },
        {
          when: all(has('clue_ayni_parti'), not(has('ded_sekerlik'))),
          lines: [
            n('Leyla kriminal raporun ikinci sayfasını kalemiyle iki kez tıklattı.'),
            s(
              'leyla',
              'Şekerlik. Savcının yedek planı orası. Arka odayı kaybederse mutfağa sarılır: “ortak alan, ortak zilyetlik.”',
            ),
            s(
              'leyla',
              'O iki paket nereden geldi, şekerlik nerede duruyordu? Kavanozdaki parmak izi, kavanozu kimin açtığını söyler; içine kimin ne koyduğunu değil.',
            ),
          ],
        },
        {
          when: not(any(visited('INV_TOLGA'), has('clue_kira_defteri'))),
          lines: [
            n(
              'Leyla muhbir ifadesinin fotokopisini masaya, benim tarafıma doğru itti. Okumamıştı; okumuş gibi bakıyordu.',
            ),
            s(
              'leyla',
              'Muhbirin ifadesini oku. Kelime kelime. İnsanlar yalan söylerken ayrıntıyı unutur ya da fazla verir. İkisi de iz bırakır.',
            ),
          ],
        },
        {
          lines: [
            n('Leyla pencerenin önünde duruyordu. Dışarıda yağmur; içeride radyatörün tıkırtısı.'),
            s(
              'leyla',
              'Delil dilekçesini geciktirme. Duruşmadan en az beş gün önce verilmeli. Kimi dinletmek istediğini bil; kimin seni yarı yolda bırakacağını da.',
            ),
            s(
              'leyla',
              'Ve Kaan’ın sırrı. Onu ancak o isterse kullanırsın. Rıza bir kez alınmaz; her adımda yeniden sorulur.',
            ),
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
              'Boş bir dilekçe şablonu ekranda. İmleç yanıp sönüyordu. Bir avukatın en güçlü silahı da en sıkıcı belgesidir: “Sayın Başkanlığınıza…”',
            ),
            th('Üç talep. Her biri bir kapı. Yanlış kapıyı çalarsam, doğru kapıya vaktim kalmayabilir.'),
          ],
        },
      ],
      prompt: 'Mahkemeye delil dilekçesi: duruşmadan en az beş gün önce. Üç talep hakkın var; neyi isteyeceksin?',
      choices: [
        option('DIL_KURYE', 'Paketçi kurye şirketinden, adresteki kuryenin personel ve GPS kayıtlarının istenmesi', {
          visibleWhen: any(has('clue_mont'), has('ded_kurye'), has('clue_kira_defteri')),
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 50 },
          effects: [raise('kurye_istendi')],
          good: 'Kabul: özel şirket kayıtları avukatın doğrudan talebiyle değil, mahkemenin ara kararıyla istenir (CMK 177/1). Kayıtlar 1. celseden sonra gelir.',
          next: '$stay',
        }),
        option('DIL_KOLLUK', 'Ev arkadaşı Barış’ın kolluk marifetiyle bulunması', {
          visibleWhen: not(any(has('clue_mont'), has('ded_kurye'), has('clue_kira_defteri'))),
          cost: [{ var: 'dil_hak', amount: 1 }],
          neutral:
            'Soyadı, adresi ya da çalıştığı yer belirtilmeyen bir kişinin “bulunması” istemi karşılıksız kalır; delil dilekçesi ispat edilecek olayı ve delili somut göstermelidir (CMK 177/1).',
          next: '$stay',
        }),
        option('DIL_NESRIN', 'Ev sahibi Nesrin Uysal’ın tanık olarak dinlenmesi', {
          visibleWhen: met('nesrin'),
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 40 },
          effects: [raise('nesrin_istendi')],
          good: 'Kabul: arama tanığı ve ev sahibi; arka odanın kiracısı ve aramanın seyri hakkında doğrudan bilgi sahibi (CMK 177, 210).',
          next: '$stay',
        }),
        option('DIL_IZ', 'Terazideki parmak izinin Demirel soyadlı kiracıyla karşılaştırılması', {
          visibleWhen: has('ded_demirel'),
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 30 },
          effects: [raise('iz_istendi')],
          good: 'Yerinde: mahkeme talebi kolluğa iletir; kişi bulunup izi alındığında karşılaştırma yapılır. Kimliği belirsiz kişi için tek başına sonuç doğurmaz.',
          next: '$stay',
        }),
        option('DIL_SAC', 'Saç analizinin dosyadan çıkarılması', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: -30 },
          bad: 'Saç analizi hukuka uygun alınmış bir bilirkişi raporudur; “aleyhe” olması dosyadan çıkarılma nedeni değildir. Delil dilekçesi delil toplamak içindir.',
          next: '$stay',
        }),
        option('DIL_KESIF', 'Dairede keşif yapılması', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          neutral:
            'Arka oda boşaltılmış, kilit emanette; iki ay sonra keşif, baskın sabahını göstermez. Fotoğraflar daha iyi bir tanık.',
          next: '$stay',
        }),
        option('DIL_VER', 'Dilekçeyi ver', {
          enabledWhen: cmp(v('dil_hak'), '<', 3),
          lockedReason: 'En az bir talep seç.',
          responses: [
            {
              lines: [
                n('Dilekçe UYAP’tan gönderildi. Ekran bir onay numarası verdi; bir umut vermedi.'),
                th('Talepler mahkemenin masasında. Cevaplar duruşmada gelecek.'),
              ],
            },
          ],
          next: '$return',
        }),
        option('DIL_VAZGEC', 'Dilekçe vermekten vazgeç', {
          neutral:
            'Delil dilekçesi verilmedi; savunma delillerini duruşmada CMK 206/1 ile isteyebilirsin, ama süre kaybedersin.',
          next: '$return',
        }),
        back('DIL_GERI', 'Sonra dönerim'),
      ],
    }),
    deductionBoard('INV_CIKARIM', {
      ...INV1,
      title: 'Çıkarım Tahtası',
      background: 'buro_gece',
      lines: [
        {
          lines: [
            n(
              'İki ipucunu seç. Birbirini tamamlıyorsa duruşmada kullanabileceğin bir DELİL doğar. Yanlış çift zaman ve puan götürür.',
            ),
          ],
        },
      ],
      pool: [
        'clue_kilit',
        'clue_mont',
        'clue_zincir',
        'clue_on_oda',
        'clue_randevu',
        'clue_sekerlik',
        'clue_ayakkabi',
        'clue_posta',
        'clue_kroki',
        'clue_kapsam',
        'clue_odaya_girme',
        'clue_iki_tane',
        'clue_hat',
        'clue_ayni_parti',
        'clue_kavanoz_iz',
        'clue_tolga_kask',
        'clue_kaan_olcu',
        'clue_tedavi',
        'clue_kira_defteri',
        'clue_anahtarlik',
      ],
      recipes: [
        deduce(
          'CB_KAPSAM',
          'clue_kilit',
          'clue_kapsam',
          'ded_kapsam',
          'Kapsam dışı arama',
          'Karar Kaan’ın odasını ve ortak alanları kapsıyordu. Kilitli bir kapıyı keskiyle açmak, başka birinin odasına girmektir.',
        ),
        deduce(
          'CB_ODA',
          'clue_on_oda',
          'clue_kroki',
          'ded_oda',
          'Kaan ön odada yaşıyor',
          'Tutanak Kaan’ı ön odada uyurken buluyor; kroki aynı odaya “misafir” diyor. Kroki bir tespit değil, bir varsayım.',
        ),
        deduce(
          'CB_NUMARA',
          'clue_ayakkabi',
          'clue_kaan_olcu',
          'ded_numara',
          'İki ayrı ayak',
          'Kaan 41 giyiyor. Kapının dibindeki 45 numara kurye botu başka birinin.',
        ),
        deduce(
          'CB_KURYE',
          'clue_mont',
          'clue_zincir',
          'ded_kurye',
          'Arka odadaki kurye',
          'XL kurye montu, motosiklet zinciri, kask askısı. Arka odanın sahibi motosikletli bir kurye.',
        ),
        deduce(
          'CB_BARIS',
          'clue_odaya_girme',
          'clue_kira_defteri',
          'ded_baris',
          'Barış gerçek',
          'Ev sahibinin defteri ve baskından önceki gecenin mesajı aynı şeyi söylüyor: arka odada Barış diye biri oturuyordu.',
        ),
        deduce(
          'CB_DEMIREL',
          'clue_hat',
          'clue_posta',
          'ded_demirel',
          'B. = Demirel',
          'Hat İzmir’de bir Demirel adına; posta kutusunda elle yazılmış “DEMİREL”. Hayaletin bir soyadı var.',
        ),
        deduce(
          'CB_SEKER',
          'clue_ayni_parti',
          'clue_sekerlik',
          'ded_sekerlik',
          'Şekerlik arka odanın deposu',
          'Aynı poşet, aynı gramaj; şekerlik de arka oda kapısının dibinde. O iki paket mutfağın değil, arka odanın stoğundan.',
        ),
        deduce(
          'CB_KASK',
          'clue_tolga_kask',
          'clue_kaan_olcu',
          'ded_kask',
          'Kasklı adam Kaan değil',
          'Muhbirin kapıda gördüğü adam elinde kaskla çıkmak üzereydi. Kaan’ın ne ehliyeti var ne kaskı.',
        ),
        deduce(
          'CB_ANAHTAR',
          'clue_anahtarlik',
          'clue_kilit',
          'ded_anahtar',
          'Anahtarsız kiracı',
          'Kilitli bir odanın anahtarı, odanın sahibinde olur. Kaan’ın anahtarlığında üç anahtar var; hiçbiri bir asma kilidi açmaz.',
        ),
        deduce(
          'CB_KULLANICI',
          'clue_randevu',
          'clue_tedavi',
          'ded_kullanici',
          'Kullanıcı, satıcı değil',
          'Randevu kartı, acil kaydı, negatif test. Odasında madde yok, terazi yok, para yok. Bu bir kullanıcının tablosu.',
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
    // --- Duruşmadan önceki gece: koşullu hafıza zinciri ---
    decisionNode('INV_GECE_1', [{ to: 'INV_GECE_1B' }], {
      ...INV1,
      title: 'Duruşmadan önceki gece',
      lines: [
        {
          lines: [
            card('25 OCAK · PAZAR 23.40 — ARSLAN HUKUK', 'buro_gece'),
            n(
              'Panoya iğnelediğim fotoğraflar masa lambasının ışığında birer pencere gibiydi. Her biri aynı eve açılıyordu; hiçbiri aynı şeyi göstermiyordu.',
            ),
          ],
        },
      ],
    }),
    decisionNode('INV_GECE_1B', [{ to: 'INV_GECE_2' }], {
      ...INV1,
      lines: [
        {
          when: cmp(v('ders'), '==', 'kagit'),
          lines: [
            th(
              'Leyla’nın sözü: “Kâğıtlar yalan söylemez; onları yazanlar söyler.” Parantezlere baktım. Bir tanesi bana bakıyordu.',
            ),
          ],
        },
        {
          when: cmp(v('ders'), '==', 'utanc'),
          lines: [
            th('Leyla’nın sözü: “Utancın üstüne yürüme. Yanına otur.” Kaan’ın yanına oturdum mu? Yarın göreceğim.'),
          ],
        },
        {
          when: cmp(v('ders'), '==', 'hikaye'),
          lines: [
            th(
              '“Tutarlılık bazen tek bir kişinin aceleciliğidir.” Savcının hikâyesini kimin yazdığını düşünüyorum: bir komiser yardımcısı, sabah altıda, bir kroki kalemiyle.',
            ),
          ],
        },
        { lines: [th('Leyla’nın dersleri insanın gece yarısı aklına gelir. Gündüz unutulur.')] },
      ],
    }),
    decisionNode('INV_GECE_2', [{ to: 'INV_GECE_3' }], {
      ...INV1,
      lines: [
        {
          when: has('ded_oda'),
          lines: [
            th(
              'Ön odada bir yatak, bir kitap, bir gözlük. Kaan orada yaşıyordu. Kroki ise aksini çizmiş. Yarın o krokiyi çizen adam kürsüde olacak.',
            ),
          ],
        },
        {
          lines: [th('Kaan hangi odada uyuyordu? Bu soruyu kâğıtlara sordum; kâğıtlar birbirine baktı.')],
        },
      ],
    }),
    decisionNode('INV_GECE_3', [{ to: 'INV_GECE_4' }], {
      ...INV1,
      lines: [
        {
          when: has('ded_kapsam'),
          lines: [
            th(
              'Kesik bir kilit ve bir kararın kapsamı. Polis o kapıyı açmaya yetkili değildi. Yarın bunu ona kendi ağzıyla söyleteceğim.',
            ),
          ],
        },
        {
          when: has('clue_kilit'),
          lines: [th('Kesik bir kilit. Kararın neyi kapsadığını okumadım. Belki yarın öğrenirim; belki çok geç.')],
        },
        {
          lines: [
            th(
              'Arka odanın kapısı nasıl açıldı? Tutanak “olağan şekilde” diyor. Olağan, bu dosyada en çok kuşku duyduğum kelime.',
            ),
          ],
        },
      ],
    }),
    decisionNode('INV_GECE_4', [{ to: 'INV_GECE_5' }], {
      ...INV1,
      lines: [
        {
          when: flag('kaan_riza'),
          lines: [
            th(
              'Kaan, kullandığını mahkemede kendisi söyleyecek. Bunu ben istemedim; o istedi. Bu fark yarın her şeyi değiştirebilir.',
            ),
          ],
        },
        {
          when: flag('kaan_itiraf'),
          lines: [
            th(
              'Kaan bana eylülde ne yaptığını anlattı. Mahkemede anlatıp anlatmayacağını henüz bilmiyorum. Bilmeden yürümek, karanlıkta merdiven çıkmak gibi.',
            ),
          ],
        },
        {
          when: flag('fact_birakti'),
          lines: [
            th(
              '“Bıraktın diye sevindim.” Barış Kaan’a böyle yazmış. Kim kimden bir şey isterdi, belli. Kaan bunu bana henüz anlatmadı.',
            ),
          ],
        },
        {
          lines: [
            th(
              'Kaan’ın sakladığı bir şey var. Ne olduğunu bilmiyorum. Bir avukatın en kötü kâbusu, müvekkilinin sırrını kürsüde ilk kez duymaktır.',
            ),
          ],
        },
      ],
    }),
    decisionNode('INV_GECE_5', [{ to: 'INV_GECE' }], {
      ...INV1,
      lines: [
        {
          when: flag('nesrin_telkin'),
          lines: [
            th(
              'Nesrin Hanım’a cevabı ben verdim. “Gördünüz, değil mi?” dedim. O da “galiba” dedi. Savcı bunu bir gün soracak. Bunu biliyorum.',
            ),
          ],
        },
        {
          when: flag('nesrin_razi'),
          lines: [
            th(
              'Nesrin Hanım gelecek. Defterini getirecek. Kedilerinden birini komşuya bırakacak. Bunu bana bir sır gibi söyledi.',
            ),
          ],
        },
        {
          when: flag('fact_para'),
          lines: [
            th(
              'Kaan’ın kredi kartı borcunu ablası ödüyor. Arka odada sekiz bin yedi yüz elli lira vardı. Bir satıcı, borcunu ablasına ödetmez.',
            ),
          ],
        },
        {
          lines: [
            th(
              'Yarın Kaan’ı ilk kez takım elbiseyle göreceğim. Defne bir ceket getirmiş; kolları kısa. Kardeşini en son liseden mezun olurken giydirmiş.',
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
            s('leyla', 'Yarın polis kürsüde olacak. Tutanağını ezbere bilecek. Sen ondan daha iyi bil.'),
            s(
              'leyla',
              'Polisin yazdığını değil, yazamadığını oku. Bir de şunu unutma: bir polisi yalancı çıkarmak zorunda değilsin. Acele ettiğini göstermen yeter.',
            ),
            s(
              'leyla',
              'Polisler kötü insanlar değildir, Deniz. Çoğu yorgun insanlardır. Sabah altıda bir kapıyı kıran adam, akşam altıda kendi kapısını açarken ne düşündüğünü bilmez.',
            ),
            th(
              'Tuncay Sezer. Yirmi yıllık bir komiser yardımcısı. Bir keski, bir kroki, bir parantez. Yarın onu küçük düşürmeyeceğim. Sadece kendi kâğıdını ona okutacağım.',
            ),
            n('Pencerenin dışında şimşek çaktı; bir an bütün fotoğraflar beyaza kesti.', { fx: 'flash' }),
            s(
              'leyla',
              'Bir de şu: yarın Kaan’a bakacaksın. Kürsüye değil, savcıya değil. Ona. Bir müvekkil, avukatının yüzünden dosyayı okur.',
            ),
            th(
              'Leyla çıktı. Çay soğudu. Fotoğraflar duvarda, birer tanık gibi bekliyordu; konuşmayan, ama yalan da söylemeyen tanıklar.',
            ),
            th('Bir oda, iki kapı, bir kilit. Yarın sabah dokuzda.'),
          ],
        },
      ],
      choices: [
        option('GECE_A', 'Kaan’a sorulacak soruları gözden geçir', {
          score: { SORGULAMA: 20 },
          responses: [
            {
              lines: [
                th(
                  'Üç soru yazdım; birini sildim. Bir müvekkile sorulmaması gereken soru, cevabını bilmediğin sorudur.',
                ),
              ],
            },
          ],
          next: 'H1_00K',
        }),
        option('GECE_B', 'Tutanağı son bir kez oku', {
          score: { DELIL_ANALIZI: 20 },
          responses: [
            {
              lines: [
                th('Tutanağı bir kez daha okudum. Kelimeler aynıydı. Ama bu sefer aralarındaki boşlukları okuyordum.'),
              ],
            },
          ],
          next: 'H1_00K',
        }),
        option('GECE_C', 'Işığı kapat ve uyumaya çalış', {
          responses: [
            {
              lines: [
                th('Uyumadım. Ama ışığı kapattım. Bazen karanlık, düşünmeye yardım eder. Bazen de sadece karanlıktır.'),
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

// Kullanılmayan yardımcıların tip denetimini sakin tutmak için (gelecek düzenlemeler).
