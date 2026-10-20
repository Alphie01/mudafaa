import {
  all,
  any,
  back,
  choiceNode,
  cmp,
  conversation,
  cont,
  costOf,
  dec,
  decisionNode,
  deductionBoard,
  documentExam,
  examine,
  fallback,
  flag,
  has,
  ifThen,
  inc,
  interview,
  meet,
  mood,
  nav,
  not,
  objective,
  option,
  otherwise,
  raise,
  recipe,
  ref,
  row,
  says,
  sceneSearch,
  score,
  set,
  story,
  tool,
  topic,
  v,
  visited,
  when,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import type { ChoiceDef } from '@mudafaa/case-schema';
import { D, INV1, Nx, S, T, card, p1, ph, voice } from './shared.js';

// 50-investigation: 1. evre (3 gün × 4 EP). Üç sahne, iki görüşme (Bora, Ece), üç ziyaret (Onur, Tolga, eczane),
// üç belge, delil dilekçesi, çıkarım tahtası, Leyla'ya danışma; gün sonu akşamları ve duruşmadan önceki gece.

const rec = (
  id: string,
  a: string,
  b: string,
  ded: string,
  title: string,
  text: string,
  extra: ChoiceDef['effects'] = [],
): ChoiceDef =>
  recipe(id, a, b, {
    effects: [
      ifThen(not(has(ded)), [score('DELIL_ANALIZI', 300, 'delil')]),
      { type: 'DISCOVER', evidence: ded },
      ...(extra ?? []),
    ],
    feedback: { title, text, label: 'YENİ DELİL · +300 SKOR', tone: 'success' },
  });

/** Tahtanın tarifleri (soruşturma ve ara tahtası aynı tarifleri paylaşır; puan yalnızca ilk kurulumda). */
export const baseRecipes = (prefix: string): ChoiceDef[] => [
  rec(
    `${prefix}_TANIDIK`,
    'clue_adisyon',
    'clue_if_tanimam',
    'ded_tanidik',
    'Tek hesap, iki kişi',
    'Masa 4’te iki kişi, tek hesap; ödeme Onur Kılıç’ın kartından. “Müştekiyi tanımam” diyen adam, müştekinin rakısını ödemiş.',
  ),
  rec(
    `${prefix}_KADEH`,
    'clue_sap',
    'clue_avuc',
    'ded_kadeh_serkan',
    'Sapı tutan el',
    'Sap, yerde yatan adamın sağ elinin yanında; avucunda enine bir kesi. Kırık bir camı sıkıca kavrayan el böyle kesilir.',
  ),
  rec(
    `${prefix}_SAVUNMA`,
    'clue_onkol',
    'clue_kan',
    'ded_savunma',
    'Kolunu kaldıran adam',
    'Önkolun dış kenarında bir kesi ve tezgâhın içinde başlayan kan. İlk kesilen, tezgâhın arkasında sıkışmış olandı.',
  ),
  rec(
    `${prefix}_GORUS`,
    'clue_kolon',
    'clue_if_gordum',
    'ded_gorus',
    'Kolonun gölgesi',
    'Masa 4’ten tezgâhın önündeki zemin görünmüyor. “Her yeri gördüm” diyen tanık, yerde olanı oturduğu yerden göremezdi.',
  ),
  rec(
    `${prefix}_YUMRUK`,
    'clue_anamnez',
    'clue_if_kadeh',
    'ded_yumruk',
    'Yumruk mu, kadeh mi?',
    'Müşteki acilde kendi ağzıyla “yumrukla vuruldum” demiş, yüzünde tek kesi yok. Kadehin yüze vurulduğu anlatımı ayakta durmuyor.',
  ),
  rec(
    `${prefix}_SALDIRGAN`,
    'clue_alkol',
    'clue_kirilma',
    'ded_saldirgan',
    'Dış kenardaki çentik',
    'Kadeh tezgâhın dış kenarına vurularak kırılmış. O tarafta duran, 1,9 promil alkollü bir müşteriydi.',
  ),
  rec(
    `${prefix}_KAMERA`,
    'clue_priz',
    'clue_ruhsat',
    'ded_kamera',
    'Kapanış saati',
    'Kayıt cihazı aylardır her gece 01.00’de kesiliyor; ruhsat saati de 01.00. Görüntünün yokluğu o geceye özgü değil.',
  ),
  rec(
    `${prefix}_VIDEO`,
    'clue_story',
    'clue_masa7',
    'ded_video',
    'Karşı masadaki ışık',
    'Masa 7 tezgâhın tam karşısında; hesabı kavgadan iki dakika sonra D. Yurt ödemiş. Ece’nin gördüğü ışık bir telefonun ışığıydı.',
  ),
];

export const boardMiss = (id: string) =>
  fallback(id, 'COMBINE', {
    repeat: 'ONCE_PER_PARAMS',
    score: { DELIL_ANALIZI: -50 },
    effects: [inc('wrong_pair')],
    feedback: {
      title: 'Bu ikisi birbirini açıklamıyor',
      text: 'İplik gerildi ama hiçbir şey göstermedi. Başka bir eşleşme dene.',
      label: 'BAĞLANTI YOK · −50 SKOR',
      tone: 'error',
    },
  });

export const INV_POOL = [
  'clue_priz',
  'clue_onluk',
  'clue_kolon',
  'clue_adisyon',
  'clue_masa7',
  'clue_boks',
  'clue_sap',
  'clue_kan',
  'clue_kirilma',
  'clue_masa4',
  'clue_eczane_kam',
  'clue_arka_sokak',
  'clue_taksi',
  'clue_alkol',
  'clue_anamnez',
  'clue_avuc',
  'clue_deplasman',
  'clue_onkol',
  'clue_if_tanimam',
  'clue_if_kadeh',
  'clue_if_tekme',
  'clue_if_gordum',
  'clue_ruhsat',
  'clue_story',
];

const docMiss = (id: string) =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle burada dikkat çeken bir şey bulamadın.',
      label: '−20 SKOR',
      tone: 'error',
    },
  });

const ex = (
  id: string,
  toolId: string,
  target: string,
  clueId: string | undefined,
  pts: number,
  title: string,
  text: string,
  extra: ChoiceDef['effects'] = [],
) =>
  examine(id, toolId, target, {
    ...(clueId === undefined ? {} : { discovers: clueId }),
    effects: [score('DELIL_ANALIZI', pts, 'delil'), ...(extra ?? [])],
    feedback: {
      title,
      text,
      label: clueId === undefined ? `+${pts} SKOR` : `+${pts} SKOR · Not defterine eklendi`,
      tone: 'special',
    },
  });

// --- Gün sonu: DECISION (teslimler + gün devri) → akşam sahneleri ---
const dayEndTrigger = {
  id: 'tg_inv_day',
  scope: 'INV_HUB',
  priority: 1,
  when: all(cmp(v('ap'), '<=', 0), cmp(v('day'), '<', 3)),
  goto: 'INV_DAY_END',
};

export const investigation1: CasePart = {
  nodes: [
    story('INV_SABAH', {
      ...INV1,
      title: 'Setbaşı, sabah',
      background: 'sokak_sabah',
      lines: says(
        card('CUMA 08.40 — SETBAŞI, GÖKDERE SOKAĞI', 'sokak_sabah'),
        Nx('Yağmur gece dinmiş, sabah yeniden başlamaya hazırlanıyordu. Dere köprünün ayaklarını dövüyordu.'),
        Nx(
          'Gölge’nin kepengi inikti. Üstünde bantla yapıştırılmış bir kâğıt: “KAPALI”. El yazısı büyük, harfler birbirine değmiyor.',
        ),
        T('Bir barın kapalı olduğunu ilan etmek için bile kendine bir kâğıt yazdırmamış. Kendi eliyle yazmış.'),
        Nx('Telefon titredi. Leyla’dan tek satırlık bir mesaj.'),
        ph('leyla', 'Önce yere bak. İnsanlar sonra.'),
        T('On gün. Üç günüm var gerçekten; geri kalanı dilekçe, kalem ve uykusuzluk.'),
        Nx(
          'Cebimde Bora’nın anahtarı ağırlaşıyordu. Bir barın anahtarı, bir insanın hayatı kadar ağır olabilir mi? Olabilir.',
        ),
        Nx(
          'Karşıda nöbetçi eczanenin ışığı hâlâ yanıyordu; gece vardiyası bitmemişti. Köşedeki taksi durağında bir şoför gazetesini katlıyordu.',
        ),
        T(
          'Bir sokak. Bir eczane, bir durak, bir köprü, bir bar. Dört pencere, dört göz. O gece en az birinin açık olduğunu biliyorum; hangisinin olduğunu bilmiyorum.',
        ),
      ),
      choices: [cont('SABAH_DEVAM', 'Soruşturmaya başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
    p1.hub({
      ...INV1,
      title: 'Soruşturma',
      background: 'sokak_gece',
      lines: [
        when(
          all(cmp(v('ap'), '<=', 0), cmp(v('day'), '<', 3)),
          Nx('Akşam oldu. Defteri kapattım; Setbaşı’nda sokak lambaları birer birer yandı.'),
        ),
        when(
          cmp(v('day'), '==', 1),
          card('GÜN 1/3 · BİRİNCİ CELSEYE 10 GÜN', 'sokak_gece'),
          Nx('Setbaşı’nda öğleden sonra yağmur yine başladı. Gökdere’nin sesi bütün sokakların altından geçiyordu.'),
          Nx('Hedef: Kim kimin yanında oturuyordu? Kırık kadeh kimin elindeydi?'),
        ),
        when(
          cmp(v('day'), '==', 2),
          card('GÜN 2/3 · BİRİNCİ CELSEYE 9 GÜN', 'sokak_gece'),
          Nx('Cumartesi. Adliye kapalı, hastane açık, insanlar evde. Kâğıtlar ve tanıklar için iyi bir gün.'),
          Nx('Hedef: Tanığın gözü nereye bakıyordu? Kayıtlar ve kâğıtlar, insanlar unutmadan önce.'),
        ),
        otherwise(
          card('GÜN 3/3 · BİRİNCİ CELSEYE 8 GÜN', 'sokak_gece'),
          Nx(
            'Pazar. Dilekçe pazartesi sabah dokuzda kalemde olmalı. Bir avukatın en uzun günü, dilekçeden önceki pazardır.',
          ),
          Nx('Hedef: Delil dilekçesi için son gün. Duruşmada kimi dinletmek, neyi okutmak istiyorsun?'),
        ),
      ],
      scenePreview: { scene: 'sc_bar' },
      tabs: [
        {
          id: 't_olay',
          label: 'OLAY YERİ',
          kind: 'SCENE',
          choices: [
            p1.activity('A_ARAMA', 'Gölge’nin içi', 'INV_ARAMA', {
              once: true,
              description: 'Kapalı bar · büyüteç 6',
            }),
            p1.activity('A_ARAMA2', 'Kolluk fotoğrafları', 'INV_ARAMA2', {
              once: true,
              description: '3 Kasım 02.10 · büyüteç 5',
            }),
            p1.activity('A_ARAMA3', 'Gökdere Sokağı', 'INV_ARAMA3', {
              once: true,
              description: 'Barın dışı · büyüteç 4',
            }),
          ],
        },
        {
          id: 't_kisi',
          label: 'KİŞİLER',
          kind: 'PEOPLE',
          choices: [
            p1.activity('A_BORA', 'Bora ile görüş', 'INV_BORA', {
              once: true,
              description: 'Gölge’de, tezgâhın başında · 18 dk',
            }),
            p1.activity('A_BORA2', 'Bora’yla yeniden konuş', 'INV_BORA2', {
              once: true,
              visibleWhen: visited('INV_BORA'),
              description: 'Akşamüstü, kapalı barda',
            }),
            p1.activity('A_ONUR', 'Onur Kılıç', 'INV_ONUR', { once: true, description: 'Tanık · iş yeri' }),
            p1.free('A_TOLGA', 'Av. Tolga Şen', 'INV_TOLGA', {
              once: true,
              description: '0 EP · randevu · katılan vekili',
            }),
            p1.activity('A_ECE', 'Önlükteki isim: Ece', 'INV_ECE', {
              once: true,
              visibleWhen: any(has('clue_onluk'), flag('ece_itiraf')),
              description: 'Kampüs kantini',
            }),
            p1.activity('A_ECZANE', 'Nöbetçi eczane', 'INV_ECZANE', {
              once: true,
              visibleWhen: has('clue_eczane_kam'),
              description: 'Kapıya bakan kamera',
            }),
          ],
        },
        {
          id: 't_arsiv',
          label: 'ARŞİV',
          kind: 'ARCHIVE',
          choices: [
            p1.activity('A_HASTANE', 'Dosya ekleri: acil kaydı', 'INV_HASTANE', {
              once: true,
              description: 'Müştekinin hastane evrakı · 6 deneme',
            }),
            p1.activity('A_DARP', 'Dosya ekleri: sanığın raporu', 'INV_DARP', {
              once: true,
              description: 'Aynı gece, aynı hastane · 4 deneme',
            }),
            p1.activity('A_IFADE', 'Tanık ifadesini satır satır oku', 'INV_IFADE', {
              once: true,
              description: 'Kolluk ifadesi · 6 deneme',
            }),
            p1.activity('A_DIL', 'Delil dilekçesi', 'INV_DIL', {
              once: true,
              description: 'Üç talep hakkı · tek dilekçe',
            }),
            p1.free('A_CIKARIM', 'Çıkarım tahtası', 'INV_CIKARIM', {
              description: '0 EP · ipuçlarını birleştir',
              enabledWhen: ref('kart2'),
              lockedReason: 'En az 2 ipucu gerekli.',
            }),
            p1.free('A_LEYLA1', 'Leyla’ya danış', 'INV_LEYLA1', {
              once: true,
              visibleWhen: cmp(v('day'), '==', 1),
              description: '0 EP · günde bir kez',
            }),
            p1.free('A_LEYLA2', 'Leyla’ya danış', 'INV_LEYLA2', {
              once: true,
              visibleWhen: cmp(v('day'), '==', 2),
              description: '0 EP · günde bir kez',
            }),
            p1.free('A_LEYLA3', 'Leyla’ya danış', 'INV_LEYLA3', {
              once: true,
              visibleWhen: cmp(v('day'), '==', 3),
              description: '0 EP · günde bir kez',
            }),
          ],
        },
      ],
      quickTalk: { character: 'bora', line: '“Vurdum. Bir kere. Gerisi saçma.”', choices: ['A_BORA', 'A_BORA2'] },
      choices: [
        nav('GO_H1', 'DURUŞMAYA GİT · 1. CELSE', 'INV_GECE_1', {
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen soruşturma biter. Emin misin?',
        }),
      ],
    }),

    // --- Gün sonu ---
    decisionNode('INV_DAY_END', [{ when: cmp(v('day'), '==', 2), to: 'INV_AKSAM1' }, { to: 'INV_AKSAM2' }], {
      ...INV1,
      title: 'Gün sonu',
      onEnter: [inc('day', 1), set('ap', 4)],
    }),
    story('INV_AKSAM1', {
      ...INV1,
      title: 'Bir teklif',
      background: 'buro_gece',
      lines: says(
        card('CUMA 21.15 — ARSLAN HUKUK', 'buro_gece'),
        Nx('Büroda tek lamba. Masada soğumuş bir simit, açık bir dosya. Telefon çaldı; numara kayıtlı değildi.'),
        ph('tolga', 'Meslektaşım, iyi akşamlar. Tolga Şen. Rahatsız etmiyorumdur umarım.'),
        ph(
          'tolga',
          'Kısa keseceğim. Müvekkilim yorgun. Mahkemelerle, gazetecilerle uğraşmak istemiyor. Medeni insanlarız.',
        ),
        ph(
          'tolga',
          'Yetmiş bin lira. Tedavi masrafı, manevi zarar. Müvekkiliniz öder, biz şikâyetimizden vazgeçeriz. Herkes evine.',
        ),
        T('Yetmiş bin. Bir burun için mi, bir sessizlik için mi?'),
        ph('tolga', 'Yarın öğlene kadar cevabınızı beklerim. İyi geceler.'),
      ),
      choices: [
        option('AKSAM1_RED', '“Bu dava şikâyetle düşmez. Teklifinizi reddediyoruz.”', {
          score: { HUKUKI_BILGI: 60 },
          effects: [raise('teklif_red')],
          good: 'Silahla yaralama (TCK 86/3) şikâyet aranmaksızın kovuşturulur; şikâyetten vazgeçme kamu davasını düşürmez. Para ödemek yalnızca bir ikrar görüntüsü yaratırdı.',
          responses: says(
            D(
              'Sayın meslektaşım, silah iddiası olan bir dosyada şikâyetten vazgeçmenin bir hükmü yok. Bunu siz de biliyorsunuz.',
            ),
            ph('tolga', 'Biliyorum. Sizin bilip bilmediğinizi merak ettim. İyi geceler, meslektaşım.'),
            T('Bir sınavdı. Geçtim. Ama sınavı yapanın bir sonraki sorusu daha zor olacak.'),
          ),
          next: 'INV_SABAH2',
        }),
        option('AKSAM1_KABUL', '“Müvekkilime ileteceğim; anlaşmaya açığız.”', {
          score: { HUKUKI_BILGI: -40 },
          effects: [raise('teklif_kabul'), inc('trust', -6)],
          bad: 'Şikâyetten vazgeçme silahla yaralamada davayı düşürmez (TCK 86/3: şikâyet aranmaksızın). Ödeme, karşı tarafa “sanık suçunu kabul ediyor” argümanı verirdi.',
          category: 'HUKUKI_BILGI',
          responses: says(
            ph('tolga', 'Harika. Yarın görüşürüz.'),
            Nx('Ertesi sabah Bora’yı aradım. Uzun bir sessizlik oldu.'),
            ph('bora', 'Para verirsem vurduğumu satın almış olurum. Vurdum zaten. Ama haksız yere değil. Vermem.'),
            T('Müvekkilim hukuku benden iyi biliyordu. Utanç verici bir sabahtı.'),
          ),
          next: 'INV_SABAH2',
        }),
        option('AKSAM1_DUSUN', '“Düşünüp döneceğim.”', {
          neutral: 'Karar ertelendi. Teklifin hukuki değeri yok; silahla yaralamada şikâyet aranmaz.',
          responses: says(
            ph('tolga', 'Tabii. Düşünün. Ama çok düşünmeyin.'),
            Nx('Leyla’nın odasının ışığı yanıyordu. Kapıdan başımı uzattım; anlattım.'),
            S('leyla', 'Silah iddiası varken şikâyetin bir hükmü yok. O seni değil, Bora’nın cebini yokluyor.'),
          ),
          next: 'INV_SABAH2',
        }),
      ],
    }),
    story('INV_AKSAM2', {
      ...INV1,
      title: 'Gece telefonu',
      background: 'buro_gece',
      lines: [
        when(
          visited('INV_ONUR'),
          card('CUMARTESİ 02.05 — EV', 'buro_gece'),
          Nx('Telefonun ışığı tavanı boyadı. Arayan: Bora.'),
          ph('bora', 'Uyandırdım. Kusura bakma.'),
          ph(
            'bora',
            'Barın önünde biri dikiliyordu. Yarım saat. Kepenge baktı, gitti. Gözlüklüydü. Kol saatine bakıp duruyordu.',
          ),
          T('Kol saati. Onur Kılıç kol saatini düzeltmeden konuşamıyordu.'),
          ph('bora', 'Ne yapayım? Çıkıp konuşayım mı?'),
        ),
        otherwise(
          card('CUMARTESİ 02.05 — EV', 'buro_gece'),
          Nx('Telefonun ışığı tavanı boyadı. Arayan: Bora.'),
          ph('bora', 'Uyandırdım. Kusura bakma.'),
          ph('bora', 'Barın önünde biri dikiliyordu. Yarım saat. Kepenge baktı, gitti. Yüzünü görmedim. Yağmur.'),
          T('Kapalı bir barın önünde gece yarısı dikilen biri. Ya bir müşteri, ya da bir mesaj.'),
          ph('bora', 'Ne yapayım? Çıkıp bakayım mı?'),
        ),
      ],
      choices: [
        option('AKSAM2_BILDIR', '“Kapını kilitle. Sabah karakola birlikte gidip tutanak tutturalım.”', {
          score: { USUL_BILGISI: 40 },
          effects: [raise('tehdit_bildirildi'), inc('trust', 4)],
          good: 'Doğru: kolluğa bildirim kayıt yaratır. Müvekkilin tanık olabilecek biriyle yüzleşmesi tanığı etkileme (TCK 277) şüphesi doğururdu.',
          responses: says(
            ph('bora', 'Peki. Kilitlerim.'),
            Nx('Sabah karakolda yarım sayfalık bir tutanak. Memur esnedi, imzaladı. Ama bir kâğıt vardı artık.'),
            Nx(
              'Karakoldan çıkarken Bora durdu. “Ben buraya üçüncü kez geliyorum” dedi. “Birinde ifade verdim, birinde kolumu sardılar. Bu sefer kâğıdı ben verdim.” Nedense bu onu biraz rahatlatmıştı.',
            ),
          ),
          next: 'INV_SABAH3',
        }),
        option('AKSAM2_GIT', '“Çık, konuş. Ne istediğini öğren.”', {
          score: { USUL_BILGISI: -60 },
          effects: [raise('bora_yuzlesti'), inc('ethics')],
          bad: 'Sanığın tanıkla gece yüzleşmesini önermek, tanığı etkilemeye teşebbüs (TCK 277) riskini doğurur; avukat buna aracılık edemez.',
          category: 'USUL_BILGISI',
          responses: says(
            ph('bora', 'Çıktım. Gitmiş.'),
            Nx(
              'Ertesi gün Tolga Şen’in dilekçesi mahkemeye girdi: “Sanığın tanığı gece barın önüne çağırdığı” iddiası. Kimin kimi çağırdığını kimse sormadı.',
            ),
            T('Bir telefon cümlesiyle Tolga’ya bir silah verdim.'),
          ),
          next: 'INV_SABAH3',
        }),
        option('AKSAM2_UYU', '“Bir şey yapma. Sabah konuşuruz.”', {
          neutral: 'Bir şey yapılmadı; kayıt da yok.',
          responses: says(ph('bora', 'Tamam.'), T('Tamam dedi. Uyumadı. Ben de uyumadım.')),
          next: 'INV_SABAH3',
        }),
      ],
    }),

    // --- Sabahlar (gün başı sahneleri; koşullu hafıza zinciri) ---
    decisionNode('INV_SABAH2', [{ to: 'INV_SABAH2B' }], {
      ...INV1,
      title: 'Cumartesi sabahı',
      lines: says(
        card('CUMARTESİ 07.50 — ARSLAN HUKUK', 'buro'),
        Nx(
          'Büroya herkesten önce geldim; Leyla’dan önce gelmek imkânsızdı ama denemek bir alışkanlık olmuştu. Leyla oradaydı. Masamda bir simit, bir de katlanmış gazete.',
        ),
        S(
          'leyla',
          'Üçüncü sayfa. Küçük bir haber: “Setbaşı’nda bar kavgası, eski boksör yargılanıyor.” İsim yok. Ama Setbaşı küçük; herkes kim olduğunu biliyor.',
        ),
        T(
          'Eski boksör. Gazete bile tutanağın dilini konuşuyor. Bir etiket, bir kez basılınca, insanın adından önce gelir.',
        ),
      ),
    }),
    decisionNode('INV_SABAH2B', [{ to: 'INV_SABAH2C' }], {
      ...INV1,
      lines: [
        when(
          all(flag('fact_kol'), flag('fact_siper')),
          T(
            'Dün Bora kolunu tezgâhın üstünde kaldırıp gösterdi: “Böyle geldi, böyle kaldırdım.” Aynı gece, aynı hastane, iki rapor. Biri hiç okunmamış.',
          ),
        ),
        when(
          flag('fact_siper'),
          T(
            'Dün Bora kolunu tezgâhın üstünde kaldırıp gösterdi: “Böyle geldi, böyle kaldırdım.” Bir hareketin kendisi bir delil değil. Ama nereye bakacağımı söylüyor.',
          ),
        ),
        when(
          flag('fact_kol'),
          T('Bora’nın raporu dosyada olmalı, demişti. “Kimse okumadı galiba.” Galiba değil. Kesin.'),
        ),
        otherwise(
          T(
            'Bora’nın kolundaki dikişler. İlk akşam gördüm ya da görmedim; ama dosyada bir yerde, bir rapor olarak duruyor olmalı.',
          ),
        ),
      ],
    }),
    decisionNode('INV_SABAH2C', [{ to: 'INV_SABAH2D' }], {
      ...INV1,
      lines: [
        when(
          flag('deniz_sert'),
          S('leyla', 'Bora’ya ilk akşam “vurdunuz, değil mi” diye sormuşsun. Bana söyledi. Kızmamış. Ama hatırlıyor.'),
          T('Hatırlıyor. Az konuşan adamlar her şeyi hatırlar; o yüzden az konuşurlar.'),
        ),
        when(
          flag('fact_gecmis'),
          S('leyla', 'Boks fotoğrafını sordun mu? Savcı soracak. Tolga daha da çok.'),
          T(
            'Sordum. Doksan altı, kaybettiği bir maç. Yirmi beş yıl. Bir etiketin arkasında yirmi beş yıllık bir boşluk.',
          ),
        ),
        otherwise(
          S('leyla', 'Boks fotoğrafı duvarda mı hâlâ? Savcı onu sorar. Tolga daha da çok.'),
          T('Duvarda. Bir fotoğraf, bir adamın bütün geçmişi gibi kullanılabilir. Ya da bir maç kadar küçük.'),
        ),
      ],
    }),
    decisionNode('INV_SABAH2D', [{ to: 'INV_SABAH2E' }], {
      ...INV1,
      lines: [
        when(
          flag('teklif_red'),
          S(
            'leyla',
            'Tolga dün gece seni aramış. Teklifi reddetmişsin; nedenini de söylemişsin. İyi. Bir dahaki sefere daha zor bir soru soracak.',
          ),
        ),
        when(
          flag('teklif_kabul'),
          S('leyla', 'Tolga’ya “anlaşmaya açığız” demişsin. Bora sabah beni aradı, Deniz. Bana. Seni değil.'),
          T('Bunu hak ettim. Bir müvekkil avukatının üstünden bir başkasını aradığında, bir şey kırılmıştır.'),
        ),
        otherwise(
          S(
            'leyla',
            'Tolga’nın teklifi hâlâ masada mı? Silah iddiası olan bir dosyada şikâyet bir şey değiştirmez. Unutma.',
          ),
        ),
      ],
    }),
    story('INV_SABAH2E', {
      ...INV1,
      title: 'Cumartesi sabahı',
      background: 'buro',
      lines: says(
        Nx('Leyla gazeteyi katlayıp çöpe attı. Sonra çöpten geri alıp çekmecesine koydu. Neden yaptığını sormadım.'),
        T(
          'Bir bar kavgası. Babam da bir gece bir bar kavgasından hastanelik olmuştu; ben dokuz yaşındaydım. Kimin önce vurduğunu hiç öğrenmedim. Kimse sormadı.',
        ),
        T('Kimse sormadı. Bu dosyanın da adı bu olabilirdi.'),
        S(
          'leyla',
          'Bugün ikinci gün. Yere bakmaya devam et. Ama artık kâğıtlara da bak; kimsenin açmadığı ekler bir dosyanın bodrumudur.',
        ),
      ),
      choices: [cont('SABAH2_DEVAM', 'Güne başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
    decisionNode('INV_SABAH3', [{ to: 'INV_SABAH3B' }], {
      ...INV1,
      title: 'Pazar sabahı',
      lines: says(
        card('PAZAR 08.15 — SETBAŞI KÖPRÜSÜ', 'sokak_sabah'),
        Nx(
          'Yağmur gece durmuş, dere hâlâ gürlüyordu. Köprünün başında bir simitçi tezgâhını kuruyordu; tezgâhın camı buğulu, simitler sıcak.',
        ),
        Nx('Bir simit aldım. Simitçi parayı alırken Gölge’nin kepengine baktı, sonra bana.'),
        {
          speaker: 'narrator',
          name: 'SİMİTÇİ',
          text: 'Bora’nın avukatı mısın, abla? Yüzünden belli. Avukatlar sabah simit alırken bile dosya okur gibi bakar.',
        },
      ),
    }),
    decisionNode('INV_SABAH3B', [{ to: 'INV_SABAH3C' }], {
      ...INV1,
      lines: [
        when(
          any(flag('tehdit_bildirildi'), flag('bora_yuzlesti')),
          {
            speaker: 'narrator',
            name: 'SİMİTÇİ',
            text: 'Gece yarısı karakoldan bir ekip geçti buradan. Kepengin önünde durdu, baktı, gitti. Bora mı çağırdı? Bora kimseyi çağırmaz.',
          },
          T('Çağırdı. Ya da ben çağırttım. Bir kâğıt var artık; ne işe yarayacağı belli değil.'),
        ),
        otherwise(
          {
            speaker: 'narrator',
            name: 'SİMİTÇİ',
            text: 'Gece biri dikiliyordu kepengin önünde. Gözlüklü. Ben fırından dönüyordum. Bakıp bakıp gitti.',
          },
          T('Gözlüklü. Bir tanığın kapalı bir barın önünde gece yarısı ne işi olur?'),
        ),
      ],
    }),
    decisionNode('INV_SABAH3C', [{ to: 'INV_SABAH3D' }], {
      ...INV1,
      lines: [
        when(
          any(flag('onur_kacti'), flag('onur_pencere')),
          T(
            'Onur Kılıç. Kahvesini yarım bırakıp döner kapıdan giren adam. Üçüncü kattaki pencereye bakan adam. Gece de buraya gelmiş olabilir. Olabilir; bilmiyorum.',
          ),
        ),
        when(
          flag('onur_masa4'),
          T('Onur “masa dört, sanırım” demişti. Sanırım. Bir şeyi net gören adam masasını tahmin etmez.'),
        ),
        otherwise(T('Tanıkla henüz konuşmadım. Konuşmalı mıyım? Leyla “konuşabilirsin, şekillendiremezsin” demişti.')),
      ],
    }),
    decisionNode('INV_SABAH3D', [{ to: 'INV_SABAH3E' }], {
      ...INV1,
      lines: [
        when(
          flag('fact_hakaret'),
          {
            speaker: 'narrator',
            name: 'SİMİTÇİ',
            text: 'Bora iyi adamdır. Az konuşur ama. Biri ona “kafa travmalı” demiş o gece, öyle duydum. Bora güler geçer öyle lafa. Kıza dokununca gülmemiş.',
          },
          T(
            'Aynı cümleyi Bora’dan da duymuştum. Bir sokakta bir cümle iki ağızdan dolaşınca, ya dedikodudur ya da doğru.',
          ),
        ),
        otherwise(
          {
            speaker: 'narrator',
            name: 'SİMİTÇİ',
            text: 'Bora iyi adamdır. Az konuşur ama. On beş yıldır bu köşede, bir kere kavga ettiğini görmedim. Bir kere bile.',
          },
          T(
            'Bir simitçinin sözü bir mahkemede bir şey ifade etmez. Ama bir avukata kimin için çalıştığını hatırlatır.',
          ),
        ),
      ],
    }),
    story('INV_SABAH3E', {
      ...INV1,
      title: 'Pazar sabahı',
      background: 'sokak_sabah',
      lines: says(
        Nx('Simitçi bir simit daha uzattı. “Bora’ya götür. Para istemem. Söyleme benden olduğunu; utanır.”'),
        Nx(
          'Kepenge yaklaştım. Kâğıttaki “KAPALI” yazısı yağmurda biraz akmıştı; harfler birbirine değmeye başlamıştı.',
        ),
        T('Son gün. Dilekçe bugün çıkmalı. Ne istemediğimi bilmeden ne istediğimi bilemem.'),
      ),
      choices: [cont('SABAH3_DEVAM', 'Son güne başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),

    // --- Olay yeri ---
    sceneSearch('INV_ARAMA', {
      ...INV1,
      title: 'Gölge · bir hafta sonra',
      hud: ['taps'],
      exposeCounts: true,
      background: 'depo_gece',
      scene: 'sc_bar',
      instruction: 'Kapalı barda dolaş. Şüpheli gördüğün yere dokun; boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps',
      lines: says(
        card('GÖLGE · KEPENK YARIYA KADAR AÇIK', 'depo_gece'),
        Nx(
          'Anahtar kilitte iki tur döndü. İçeride anason, çamaşır suyu ve eski ahşap kokusu. Biri yerleri silmiş, iyi silmiş.',
        ),
        T('Bir hafta sonra bir olay yeri, olay yeri değildir. Ama barlar unutmaz; sadece susarlar.'),
        Nx(
          'Sandalyeler masaların üstüne ters çevrilmiş, bacakları tavana bakıyor. Tezgâhın üstünde bir sıra temiz bardak, bir de boş bir rakı şişesi; mantarı yok.',
        ),
        Nx(
          'Tezgâhın dış kenarında, müşterinin durduğu tarafta, ahşapta taze bir çentik. Biri zımparalamaya başlamış, yarıda bırakmış.',
        ),
      ),
      miss: fallback('FB_ARAMA', 'TAP', {
        score: { ARASTIRMA: -10 },
        feedback: { text: 'Burada bir şey yok. Toz ve gölge. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
      }),
      finish: { id: 'ARAMA_BITIR' },
    }),
    sceneSearch('INV_ARAMA2', {
      ...INV1,
      title: 'Kolluk fotoğrafları',
      hud: ['taps2'],
      exposeCounts: true,
      background: 'buro_gece',
      scene: 'sc_foto',
      instruction:
        'Fotoğrafları panoya iğneledin. Dikkat çeken ayrıntıya dokun; boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps2',
      lines: says(
        card('ARSLAN HUKUK · PANO', 'buro_gece'),
        Nx('On iki fotoğraf. Flaş her şeyi aynı beyazlıkta düzleştirmiş: kanı, camı, ahşabı.'),
        T('Tutanak “tezgâh önü” diyor. Fotoğraflar ne diyor? Fotoğraflar acele etmez.'),
        Nx(
          'Her fotoğrafın arkasında kurşun kalemle bir numara. Biri dikkatli numaralamış; tutanağı yazan kadar aceleci değilmiş.',
        ),
      ),
      miss: fallback('FB_ARAMA2', 'TAP', {
        score: { ARASTIRMA: -10 },
        feedback: { text: 'Bu karede bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
      }),
      finish: { id: 'ARAMA2_BITIR', label: 'Panodan ayrıl' },
    }),
    sceneSearch('INV_ARAMA3', {
      ...INV1,
      title: 'Gökdere Sokağı',
      hud: ['taps3'],
      exposeCounts: true,
      background: 'sokak_yagmur',
      scene: 'sc_sokak',
      instruction:
        'Barın dışına bak. Kim girdi, kim çıktı, kim görmüş olabilir? Boş yere dokunmak bir büyüteç hakkı yer.',
      costVar: 'taps3',
      lines: says(
        card('GÖKDERE SOKAĞI · YAĞMUR', 'sokak_yagmur'),
        Nx('Dere gürlüyordu. Sokakta bir eczane, bir taksi durağı, köprünün altında sarı bir lamba.'),
        T('İçeride kamera yoktu. Ama dışarıda, Bursa’da, her köşe birilerinin gözü.'),
        Nx(
          'Gölge’nin arka tarafına dar bir sokak iniyor; çöp konteynerleri, ıslak karton, bir kedi. Mutfak kapısı oraya açılıyor olmalı.',
        ),
      ),
      miss: fallback('FB_ARAMA3', 'TAP', {
        score: { ARASTIRMA: -10 },
        feedback: { text: 'Yağmur ve ıslak asfalt. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
      }),
      finish: { id: 'ARAMA3_BITIR', label: 'Sokaktan ayrıl' },
    }),

    // --- Bora görüşmesi ---
    interview('INV_BORA', {
      ...INV1,
      title: 'Bora ile görüşme',
      hud: ['min', 'trust'],
      background: 'depo_gece',
      room: { label: 'GÖLGE · TEZGÂHIN BAŞI', character: 'bora' },
      lines: says(
        card('GÖLGE · ÖĞLEDEN SONRA', 'depo_gece'),
        Nx(
          'Bora tezgâhın arkasındaydı; bar kapalıydı ama orası onun yeriydi. Bir bardağı siliyordu. Bardak çoktan temizdi.',
        ),
        S('bora', 'Çay yok. Rakı da yok. Su var.'),
        T(
          'On sekiz dakikam var; sonra Tolga Şen’in bürosunda bir randevu. Az konuşan bir adamdan çok şey çıkarmam lazım.',
        ),
      ),
      tones: [
        { id: 'soft', label: 'Yumuşak', hint: '+5 güven' },
        { id: 'hard', label: 'Sert', hint: '−8 güven · daha fazla bilgi' },
      ],
      toneEffects: {
        soft: [inc('trust', 5), set('tone', 'soft')],
        hard: [dec('trust', 8), set('tone', 'hard')],
      },
      moodRules: [
        mood('Açılıyor', 'success', 'normal', flag('ece_itiraf')),
        mood('Kapanıyor', 'error', 'kizgin', cmp(v('trust'), '<', 40)),
        mood('Gergin', 'neutral', 'kizgin', cmp(v('tone'), '==', 'hard')),
        mood('Suskun', 'neutral', 'normal'),
      ],
      objectives: [
        objective(
          'obj_saldiri',
          flag('fact_gece'),
          'Bora kadehi kıranın müşteri olduğunu söylüyor.',
          'Kavgayı kim, nasıl başlattı?',
        ),
        objective(
          'obj_kamera',
          has('clue_ruhsat'),
          'Kamera her gece 01.00’de kesiliyor; ruhsat saati.',
          'O saatin görüntüsü neden yok?',
        ),
        objective('obj_ece', flag('ece_itiraf'), 'Bir garson vardı; Bora onu gönderdi.', 'Bora birini koruyor mu?'),
      ],
      topics: [
        topic('TB_GECE', 'O gece', {
          cost: costOf('min', 3),
          effects: [raise('fact_gece'), score('SORGULAMA', 20, 'capraz')],
          tones: {
            soft: {
              prompt: 'Baştan anlatır mısın? Acele etme.',
              says: [
                S('bora', 'Masa dörttekiler altı duble içti. Biri tezgâha geldi. Kızın bileğini tuttu.'),
                S('bora', '“Bırak” dedim. “Hesabını öde, çık.” Bırakmadı. Kadehi tezgâha vurdu. Kırık tarafı bana.'),
                S('bora', 'Kolumu kaldırdım. Kesildi. Bileğini tuttum, vurdum. Bir kere. Düştü.'),
                Nx(
                  'Bardağı bıraktı. Tezgâhın kenarına, kadehin kırıldığı yere elini koydu. Ahşapta taze bir çentik vardı; parmağı onu buldu.',
                ),
                S(
                  'bora',
                  'Sonra polisi aradım. Ambulansı da. Kapıda bekledim. Kaçacak olsam kaçardım; arka kapı orada.',
                ),
                T(
                  '“Kızın bileğini.” Hangi kız? Dosyada kız yok. Ve arka kapıdan söz eden bir adam, o kapıyı bir kez kullanmış olabilir.',
                ),
              ],
            },
            hard: {
              prompt: 'Saat saat. Kim, ne zaman, nerede durdu?',
              says: [
                S(
                  'bora',
                  'Bir otuz beş. Tezgâhın önüne geldi. Ben arkadaydım. Tezgâh dar, arkada lavabo, kaçacak yer yok.',
                  'kizgin',
                ),
                S('bora', 'Kadehi dış kenara vurdu. Ben içerideydim. Kan önce benden aktı. Sonra ondan.'),
                S(
                  'bora',
                  'Yere düşünce sap hâlâ elindeydi. Tekrar kaldırdı. Ayağımla bileğine bastım. Bıraktı. Tekme dedikleri o.',
                ),
                T(
                  'Ayağıyla bileğine. Bunu kanıtlayabilirsem Onur’un en ağır cümlesi bir hiçe döner. Kanıtlayabilirsem.',
                ),
              ],
              effects: [raise('fact_bilek_anlati')],
            },
          },
        }),
        topic('TB_KOL', 'Kolun', {
          cost: costOf('min', 3),
          effects: [raise('fact_kol'), score('SORGULAMA', 15, 'capraz')],
          tones: {
            soft: {
              prompt: 'Kolun nasıl? Doktora gittin mi?',
              says: [
                S('bora', 'Aynı gece. Aynı hastane. Onu bir odaya, beni öbür odaya koydular. Polis bekledi.'),
                S('bora', 'Raporu dosyada olmalı. Kimse okumadı galiba.'),
                S(
                  'bora',
                  'Hemşire kız dikerken “kim yaptı bunu” dedi. “Bir müşteri” dedim. “Müşteri kadeh mi atıyor size?” dedi. Güldüm. Acıdı.',
                ),
                T('Bir hemşire sordu. Polis sormadı. Savcı sormadı. Bazen gerçek, sorulmadığı için yalan gibi durur.'),
              ],
            },
            hard: {
              prompt: 'O kesik sonradan olmuş olamaz mı? Kavga bitince?',
              says: [
                S('bora', 'Sonradan mı?', 'kizgin'),
                Nx(
                  'Bardağı bıraktı. Sol kolunu tezgâhın üstüne koydu, kolunu yüzüne siper eder gibi kaldırdı, sonra indirdi.',
                ),
                S(
                  'bora',
                  'Böyle geldi. Böyle kaldırdım. Kadeh buradan geçti. Kavga bitince kimse kendi koluna kadeh sürtmez avukat hanım.',
                ),
              ],
              effects: [raise('fact_siper')],
            },
          },
        }),
        topic('TB_SERKAN', 'Serkan Aydemir', {
          cost: costOf('min', 3),
          effects: [score('SORGULAMA', 15, 'capraz')],
          tones: {
            soft: {
              prompt: 'Onu daha önce tanıyor muydun?',
              says: [
                S('bora', 'Üç dört kere geldi. Her seferinde fazla içer. Bir kere hesabı açık kaldı, sonra ödedi.'),
                S('bora', 'Kızlara laf atar. Bir kere uyardım. O gece ikinci kezdi.'),
                S(
                  'bora',
                  'Gözlüklü biriyle gelir hep. Hesabı o öder, Serkan konuşur. Gözlüklü hiç içmez fazla; kim olduğunu bilmem.',
                ),
                T(
                  'Gözlüklü. Hesabı ödeyen. Bir ayrıntı; şimdilik yalnızca bir ayrıntı. Ayrıntılar kâğıda dönüşmeden hiçbir şeydir.',
                ),
              ],
              effects: [raise('fact_serkan_taciz')],
            },
            hard: {
              prompt: 'Ondan hoşlanmıyordun, değil mi? Bir hesabın vardı.',
              says: [
                S('bora', 'Hesap mı? Müşteri o. Sevmem, sevmem. Barda herkesi sevseydim bar açmazdım.', 'kizgin'),
                S(
                  'bora',
                  'Bir şey söyledi o gece. “Kafana çok yumruk yemişsin, eski şampiyon.” Güldüm. Kıza dokununca gülmedim.',
                ),
              ],
              effects: [raise('fact_serkan_taciz'), raise('fact_hakaret')],
            },
          },
        }),
        topic('TB_GECMIS', 'Boks', {
          cost: costOf('min', 3),
          tones: {
            soft: {
              prompt: 'Duvardaki fotoğraf. Boks mu yaptın?',
              says: [
                S('bora', 'Doksan altı. Genç milli kamp. Bir maç kaybettim, bıraktım.'),
                S('bora', 'Yirmi beş yıldır kimseye vurmadım. O geceye kadar.'),
                T('Savcı bunu sevecek. Yirmi beş yıl vurmamış bir adam değil, yumruğu bilen bir adam.'),
              ],
              effects: [raise('fact_gecmis')],
            },
            hard: {
              prompt: 'Yumruğun ne kadar ağır olduğunu biliyordun. Yine de vurdun.',
              says: [
                S('bora', 'Biliyordum. O yüzden bir kere vurdum.', 'kizgin'),
                S('bora', 'Bilmeyen beş kere vurur. Ben bir kere vurdum, bıraktım.'),
                S('bora', 'Ringde hakem durdurur. Barda hakem yok. Kendini kendin durduracaksın. Ben durdum.'),
                T('İlginç bir savunma. Belki de tek dürüst savunma: orantıyı bilen bir el.'),
              ],
              effects: [raise('fact_gecmis'), raise('fact_oranti')],
            },
          },
        }),
        topic('TB_ANAHTAR', 'Anahtar', {
          cost: costOf('min', 3),
          effects: [inc('trust', 3)],
          tones: {
            soft: {
              prompt: 'Neden bana barın anahtarını verdin? İlk akşam.',
              says: [
                Nx(
                  'Bora bardağı bıraktı. Uzun süre cevap vermedi. Tezgâhın arkasındaki rafa, şişelerin arasına baktı.',
                ),
                S(
                  'bora',
                  'Babamdan kaldı bu bar. Adı “Gölge” değildi o zaman; “Yalçın Birahanesi”. Ben değiştirdim. Babam kızdı. Sonra alıştı.',
                ),
                S(
                  'bora',
                  'Anahtarı sana verdim, çünkü bende durursa açarım. Açarsam herkes bakar. Sende durursa… bekler.',
                ),
                S('bora', 'Bir de şu: sen bakarsın içeri. Polis bakmadı. Sen bakarsın diye düşündüm.'),
                T('Bir anahtar, bir güven. Bir avukata verilebilecek en ağır şey para değil; bir kapıdır.'),
              ],
            },
            hard: {
              prompt: 'Anahtar bir jest mi, yoksa barı kapatmanın bahanesi mi?',
              says: [
                S('bora', 'Bahane mi? Bar kapalı, avukat hanım. Kira işliyor. Bahane pahalı bir şey.', 'kizgin'),
                S('bora', 'Sende dursun dedim. Bakarsın dedim. Baktın mı?'),
                T('Baktım. Ya da bakıyorum. Bir anahtarı taşımak ile kullanmak aynı şey değil.'),
              ],
            },
          },
        }),
        topic('TB_KAMERA', 'Kayıt cihazı', {
          visibleWhen: has('clue_priz'),
          cost: costOf('min', 3),
          discovers: 'clue_ruhsat',
          effects: [score('SORGULAMA', 30, 'capraz')],
          tones: {
            soft: {
              prompt: 'Tezgâhın altındaki prizi gördüm. Anlatır mısın?',
              says: [
                S('bora', 'Ruhsatım bire kadar. İkiye kadar açığım. Bire kadar kayıt var, sonra yok.'),
                S('bora', 'Belediye gelir, kaydı ister, ceza keser. O yüzden.'),
                S('bora', 'O gece de bire kadar kayıt var. Sonra… işte.'),
                S(
                  'bora',
                  'Polis kaydı sordu. “Yok” dedim. Neden yok, sormadı. Ben de söylemedim. Ruhsat giderse bar gider.',
                ),
                T(
                  'Sormadılar, söylemedi. Bu dosyada sorulmamış soruların bir listesini tutsam, iddianameden uzun olurdu.',
                ),
              ],
            },
            hard: {
              prompt: 'Polis “görüntüyü sildin” diyecek. Sildin mi?',
              says: [
                S('bora', 'Silmedim. Zaten yoktu. Priz keser. Her gece.', 'kizgin'),
                S(
                  'bora',
                  'Ruhsat bire kadar. Ben ikiye kadar açığım. Suçsa bu, onun cezasını öderim. Başka suç değil.',
                ),
              ],
            },
          },
        }),
        topic('TB_ONLUK', 'Askıdaki önlük', {
          visibleWhen: has('clue_onluk'),
          cost: costOf('min', 3),
          tones: {
            soft: {
              prompt: 'Askıda bir önlük var. Ece kim?',
              says: [
                S('bora', 'Garson. Bıraktı.'),
                Nx('Bardağı bir daha sildi. Bir daha.'),
                T('Bıraktı. Ne zaman bıraktı diye sormadım. Cevabı yüzünde yazıyordu.'),
              ],
              effects: [raise('ece_ad')],
            },
            hard: {
              prompt: 'O gece barda bir garson vardı. Dosyada yok. Neden?',
              says: [
                S('bora', '…', 'uzgun'),
                S('bora', 'Bir kız vardı. Ece. Öğrenci. Sigortasız çalışıyordu. Babası bilmiyor barda olduğunu.'),
                S('bora', 'Polis gelmeden arka kapıdan gönderdim. “Seni burada görmedim” dedim.'),
                S(
                  'bora',
                  'Onu bu işe karıştırma avukat hanım. O kız benim yüzümden işini kaybetmesin, babasını kaybetmesin.',
                ),
                Nx(
                  'Bardağı öyle sıkı tuttu ki bir an kırılacak sandım. Kırılmadı. Bora bardakları kırmazdı; bunu artık biliyordum.',
                ),
                T('Dosyanın tek tarafsız gözü. Ve müvekkilim onu kendi eliyle kapının dışına koymuş.'),
              ],
              effects: [raise('ece_itiraf'), raise('ece_ad'), score('SORGULAMA', 50, 'capraz')],
            },
          },
        }),
      ],
      finish: { id: 'BORA_BITIR' },
    }),
    conversation('INV_BORA2', {
      ...INV1,
      title: 'Kapalı bar',
      background: 'depo_gece',
      room: { label: 'GÖLGE · AKŞAMÜSTÜ', character: 'bora' },
      lines: [
        when(
          flag('ece_itiraf'),
          card('GÖLGE · AKŞAMÜSTÜ', 'depo_gece'),
          Nx('Bora masaları ters çevirip sandalyeleri üstlerine dizmişti. Yapacak başka işi yoktu.'),
          S('bora', 'Kızı aradın mı?'),
          D('Henüz değil.'),
          S('bora', 'Arama. Ya da ara. Bilmiyorum.'),
          Nx('Bir sandalyeyi indirdi, oturdu. Masaya iki bardak koydu, birine su doldurdu, öbürünü boş bıraktı.'),
          S(
            'bora',
            'O boş bardak onun. Ece’nin. Her akşam kapanışta ikimiz bir bardak su içerdik. Sonra o otobüse koşardı.',
          ),
          S('bora', 'Bir şey daha var. Mahkemede kamera sorulursa “bozuktu” desek? Ruhsat işi açılmasın.'),
        ),
        otherwise(
          card('GÖLGE · AKŞAMÜSTÜ', 'depo_gece'),
          Nx('Bora masaları ters çevirip sandalyeleri üstlerine dizmişti. Yapacak başka işi yoktu.'),
          S('bora', 'Ne buldun?'),
          D('Henüz yeterince değil.'),
          S('bora', 'Bir şey diyeceğim. Mahkemede kamera sorulursa “bozuktu” desek? Ruhsat işi açılmasın.'),
        ),
      ],
      choices: [
        option('BORA2_DURUST', '“Hayır. Sorulursa doğrusunu söyleriz; bedeli idari ceza.”', {
          score: { SAVUNMA_STRATEJISI: 60 },
          effects: [raise('kamera_durust'), inc('trust', 4)],
          good: 'Doğru: avukat gerçeğe aykırı beyan kurgulayamaz (Av.K. md. 34, TBB Meslek Kuralları). Ruhsat saatine aykırılık bir kabahattir; yalan ise savunmanın bütün güvenilirliğini yakar.',
          responses: says(
            S('bora', 'İdari ceza. Ödenir.'),
            S('bora', 'Ruhsatı alırlarsa?'),
            D('Alırlarsa yeniden başvurursun. Hapisten yeniden başvurulmaz.'),
            Nx('Bir süre sustu. Sonra burnundan nefes verdi; Bora’nın gülmesi buydu.'),
            S('bora', 'Peki. Doğrusu.'),
          ),
          next: '$stay',
        }),
        option('BORA2_YALAN', '“Tamam. Bozuktu deriz; ruhsat işi açılmaz, kimse cihaza bakmaz.”', {
          score: { SAVUNMA_STRATEJISI: -80 },
          effects: [raise('kamera_yalan'), inc('ethics')],
          bad: 'Avukat gerçeğe aykırı beyanı kurgulayamaz ve buna aracılık edemez (Av.K. md. 34; TBB Meslek Kuralları). Zaman ayarlı priz ortaya çıkarsa savunmanın bütün sözleri şüpheli hâle gelir.',
          category: 'SAVUNMA_STRATEJISI',
          responses: says(
            S('bora', 'Tamam.'),
            T('Tamam dedi. Kolay oldu. Kolay olan şeyler bu meslekte genellikle pahalıya patlar.'),
          ),
          next: '$stay',
        }),
        option('BORA2_SUS', '“Sorulmadıkça konuşmayız. Sorulursa ben cevaplarım.”', {
          neutral: 'Kaçamak ama yalan değil. Soru gelirse doğruyu söylemek zorunda kalacaksın.',
          responses: says(S('bora', 'Sen bilirsin.'), T('Ben bilirim. Bilmiyorum ama.')),
          next: '$stay',
        }),
        option('BORA2_ECE', '“Ece’yi neden gönderdin? Gerçek nedeni.”', {
          visibleWhen: flag('ece_itiraf'),
          effects: [raise('fact_ece_neden'), inc('trust', 3)],
          responses: says(
            S('bora', 'Babası. Kütahya’da. Kızını kütüphanede çalışıyor sanıyor. Barda görse…'),
            S('bora', 'Bir de sigorta. Müfettiş gelir, bana ceza. Ona hiçbir şey. Ama asıl babası.'),
            S('bora', 'Onu korudum sandım. Kendimi korumuşum. Bunu şimdi anlıyorum.'),
          ),
          next: '$stay',
        }),
        back('BORA2_BITIR', 'Ayrıl'),
      ],
    }),

    // --- Tanık ve karşı taraf ---
    conversation('INV_ONUR', {
      ...INV1,
      title: 'Onur Kılıç',
      background: 'kafe',
      room: { label: 'SİGORTA ACENTESİNİN ÖNÜ · ÖĞLE', character: 'onur' },
      onFirstEnter: [meet('onur')],
      lines: says(
        card('NİLÜFER · BİR SİGORTA ACENTESİNİN ÖNÜ', 'kafe'),
        Nx(
          'Öğle arası. Cam bir binanın önünde takım elbiseli bir adam, kâğıt bardakta kahve, sol elinde bir kol saati.',
        ),
        S('onur', 'Avukat hanım? Açıkçası sizinle konuşmam doğru mu, bilmiyorum.'),
        D('Konuşmak zorunda değilsiniz. Mahkemede zaten konuşacaksınız. Ben sadece anlamak istiyorum.'),
        S('onur', 'Anlatacak bir şey yok. Net olarak gördüm. İfademde ne varsa o.'),
        Nx('Kol saatini düzeltti. Saat zaten düzdü.'),
        T(
          'Gözlüklü, takım elbiseli, kibar. Bir tanık kendini anlatmaz; kendini nasıl gördürmek istediğini anlatır. Bu adam görünmemek istiyordu.',
        ),
        Nx('Binanın camında şirketin adı: AYDEMİR SİGORTA ARACILIK. Harfler altın sarısı, biraz fazla büyük.'),
      ),
      choices: [
        option('ONUR_MASA', '“O gece hangi masadaydınız?”', {
          score: { SORGULAMA: 30 },
          effects: [raise('onur_masa4')],
          responses: says(
            S('onur', 'Dört… sanırım. Kolonun yanındaki. Açıkçası tam hatırlamıyorum, kalabalıktı.'),
            T('“Sanırım.” “Açıkçası.” “Tam hatırlamıyorum.” Net olarak gören bir adam için çok fazla sis.'),
          ),
          next: '$stay',
        }),
        option('ONUR_KART', '“Hesabı kim ödedi o gece?”', {
          visibleWhen: has('clue_adisyon'),
          score: { SORGULAMA: 40 },
          effects: [raise('onur_kacti')],
          responses: says(
            S('onur', 'Hesabı mı? Ben… kendi hesabımı ödedim tabii.', 'saskin'),
            S('onur', 'Bakın, öğle arası bitiyor. Mahkemede görüşürüz.'),
            Nx('Kahvesini çöpe attı, yarısı doluydu. Döner kapıdan içeri girdi, bir kez bile dönüp bakmadı.'),
            T('Kendi hesabını ödemiş. Adisyonda tek bir hesap vardı.'),
          ),
          next: '$stay',
        }),
        option('ONUR_ISTE', '“Şirketinizin adı ne? Kaç yıldır çalışıyorsunuz?”', {
          score: { SORGULAMA: 20 },
          responses: says(
            S('onur', 'Sigorta aracılığı. Beş yıl. Neden sordunuz?'),
            D('Merak. Bir tanığın ne iş yaptığını bilmek isterim.'),
            S(
              'onur',
              'Satış. Poliçe satarım. İnsanlara başlarına gelmeyecek şeyleri anlatırım, onlar da öder.',
              'saskin',
            ),
            Nx('Güldü; kendi şakasına, kısa. Sonra binanın camına, altın sarısı harflere baktı ve gülmesi bitti.'),
            T('Beş yıl. Bir şirket. Bir patron. Henüz adını bilmiyorum; ama camdaki harfleri okuyabiliyorum.'),
          ),
          next: '$stay',
        }),
        option('ONUR_TEHDIT', '“Yalan tanıklığın cezası ağırdır. Bunu bilerek mi konuşuyorsunuz?”', {
          score: { USUL_BILGISI: -60 },
          effects: [raise('onur_tehdit'), inc('ethics')],
          bad: 'Tanığa ceza tehdidiyle baskı yapmak, beyanını etkilemeye teşebbüstür (TCK 277). Yalan tanıklık şüphesi varsa yeri mahkeme ve savcılıktır, kaldırım değil.',
          category: 'USUL_BILGISI',
          responses: says(
            S('onur', 'Beni tehdit mi ediyorsunuz?', 'kizgin'),
            S('onur', 'Bunu Tolga Bey’e anlatacağım. Hem de kelimesi kelimesine.'),
            T('Anlatacak. Kelimesi kelimesine. Ve haklı olacak.'),
          ),
          next: '$stay',
        }),
        option('ONUR_SERKAN', '“Serkan Bey’i daha önce hiç görmediniz mi?”', {
          score: { SORGULAMA: 20 },
          responses: says(
            S('onur', 'Hayır. Yani… barda belki görmüşümdür. Tanımam.'),
            Nx('Gözlerini binanın camına kaldırdı. Üçüncü kattaki bir pencereye. Sonra hemen indirdi.'),
            T('Üçüncü kat. Neye baktı?'),
          ),
          effects: [raise('onur_pencere')],
          next: '$stay',
        }),
        back('ONUR_BITIR', 'Ayrıl'),
      ],
    }),
    conversation('INV_TOLGA', {
      ...INV1,
      title: 'Av. Tolga Şen',
      background: 'buro',
      room: { label: 'ŞEN HUKUK · ÇEKİRGE', character: 'tolga' },
      onFirstEnter: [meet('tolga')],
      lines: says(
        card('ŞEN HUKUK BÜROSU · ÇEKİRGE', 'buro'),
        Nx(
          'Cam masa, deri koltuk, duvarda çerçeveli bir Yargıtay kararı. Tolga Şen kahve ikram etti; fincanlar porselendi.',
        ),
        S(
          'tolga',
          'Meslektaşım! Hoş geldiniz. Leyla Hanım’ın yanında yetişmek ayrıcalıktır. Ben de bir zamanlar öyle isterdim.',
        ),
        S(
          'tolga',
          'Dosya basit, biliyorsunuz. Eski bir boksör, bir kadeh, bir burun. Ben sadece müvekkilimin hakkını istiyorum.',
        ),
        T('“Basit” diyen avukat, karmaşık bir şeyi saklıyordur. Ya da saklanacak bir şeyi.'),
        S(
          'tolga',
          'Bakın, size bir iyilik yapayım. Bu tür dosyalar iki türlü biter: ya sanık “haklıydım” diye bağırır ve üç yıl alır, ya da biz medeni insanlar gibi konuşuruz.',
        ),
        S(
          'tolga',
          'Siz gençsiniz. Leyla Hanım yaşlı ve inatçı. Bu dosyada onun inadını değil, sizin aklınızı görmek isterim.',
        ),
        T('Bir iltifat ve bir tehdit, aynı porselen fincanda. Kahvenin tadı çok iyiydi; ona da kızdım.'),
      ),
      choices: [
        option('TOLGA_KARSI', '“Müvekkilinizin hakkında da bir soruşturma var, değil mi? Bora’nın kolu için.”', {
          score: { USUL_BILGISI: 40 },
          effects: [raise('fact_karsi_sorusturma')],
          responses: says(
            S('tolga', 'Var. Takipsizlikle bitecek. Kendini savunan bir adamın elinde cam olur, olur.'),
            T(
              '“Kendini savunan.” Kendi müvekkili için de meşru müdafaa diyor. Aynı gece, iki meşru müdafaa. Biri yalan.',
            ),
            S(
              'tolga',
              'Şunu da söyleyeyim: o soruşturma bu davanın sonucunu bekliyor. Siz kazanırsanız, savcılık müvekkilimin camını yeniden okur. Ben de kazanmak zorundayım. Anlıyorsunuz.',
            ),
            S('tolga', 'Ama siz o dosyaya bakamazsınız, taraf değilsiniz. Merak etmeyin, ben bakıyorum.'),
          ),
          next: '$stay',
        }),
        option('TOLGA_TANIK', '“Tanığınız Onur Kılıç’ı tanıyor musunuz?”', {
          score: { SORGULAMA: 20 },
          responses: says(
            S('tolga', 'Bağımsız bir tanık. Barda tesadüfen bulunan bir vatandaş. İfadesi açık, net.'),
            S('tolga', 'Açık ve net tanıklar, meslektaşım, bizim gibi avukatların en sevmediği şeydir. Değil mi?'),
            Nx('Gülümsedi. Dişleri çok beyazdı.'),
            T(
              'Bağımsız bir tanık. Barda tesadüfen. Tolga Şen bu kelimeleri bir dilekçeden okur gibi söyledi; belki gerçekten okumuştur, kendi yazdığı bir dilekçeden.',
            ),
          ),
          next: '$stay',
        }),
        option('TOLGA_KORIDOR', 'Çıkışta koridorda bekleyen Serkan’a yaklaş, iki çift laf et', {
          score: { USUL_BILGISI: -60 },
          effects: [raise('serkan_temas'), inc('ethics')],
          bad: 'Avukatla temsil edilen karşı tarafla, avukatı dışında doğrudan görüşmek meslek kurallarına aykırıdır (TBB Meslek Kuralları). Tolga Şen bunu duruşmada kullanır.',
          category: 'USUL_BILGISI',
          responses: says(
            Nx('Koridorda burnunda bantla, elinde telefonla Serkan Aydemir. Yanına gittim.'),
            S('serkan', 'Ne? Avukatı mısınız? Tolga Bey! Tolga Bey, bu kadın benimle konuşuyor!', 'kizgin'),
            S(
              'tolga',
              'Meslektaşım. Müvekkilimle benim üzerimden konuşursunuz. Bunu tutanağa da, baroya da yazdırabilirim. Bu sefer yazdırmayacağım.',
            ),
            T('“Bu sefer.” Bir borç defteri açıldı ve adıma yazıldı.'),
          ),
          next: '$stay',
        }),
        back('TOLGA_BITIR', 'Ayrıl'),
      ],
    }),

    // --- Ece ---
    interview('INV_ECE', {
      ...INV1,
      title: 'Ece',
      hud: ['min_ece'],
      background: 'kafe',
      room: { label: 'KAMPÜS KANTİNİ · ÖĞLEDEN SONRA', character: 'ece' },
      onFirstEnter: [meet('ece')],
      lines: [
        when(
          flag('ece_itiraf'),
          card('GÖRÜKLE KAMPÜSÜ · KANTİN', 'kafe'),
          Nx(
            'Önlükteki öğrenci kartı yırtığı ve Bora’nın verdiği bir isim yeterliydi. Kantinin köşesinde, elinde bir fotokopi destesiyle.',
          ),
          Nx(
            'Kantinde çay kokusu, bir masada tavla, bir köşede ders çalışan iki kız. Ece fotokopilerini kenarlarından hizalıyordu; bir kez, bir daha.',
          ),
          S('ece', 'Bora abi mi gönderdi sizi? He ya, göndermiştir. Gız, bu adam…', 'saskin'),
          S('ece', 'Ben bir şey görmedim. Yani… ben orada değildim. Bora abi öyle dedi. Seni burada görmedim, dedi.'),
          T('Tanık olmak istemeyen bir tanık. Ve onu ben yönlendirirsem, artık tanık değil, benim sesim olur.'),
        ),
        otherwise(
          card('GÖRÜKLE KAMPÜSÜ · KANTİN', 'kafe'),
          Nx(
            'Önlükteki öğrenci kartı yırtığından bir fakülte adı, kantinde iki soru, bir garsonun tarifi. Köşede, elinde bir fotokopi destesiyle.',
          ),
          S('ece', 'Gölge mi? Ben orada… kim söyledi size? Bora abi mi?', 'saskin'),
          S('ece', 'Ben bir şey görmedim. Ben o gece orada değildim. Değildim, tamam mı?'),
          T('“Değildim” diyen biri, gece hiç sorulmadan kendi kendine iki kez söylemez.'),
        ),
      ],
      tones: [
        { id: 'soft', label: 'Yumuşak', hint: 'güven +' },
        { id: 'hard', label: 'Sert', hint: 'güven − · hızlı' },
      ],
      toneEffects: {
        soft: [inc('ece_guven', 2), set('tone', 'soft')],
        hard: [dec('ece_guven', 2), set('tone', 'hard')],
      },
      moodRules: [
        mood('Karar veriyor', 'success', 'normal', flag('fact_ece_gordu')),
        mood('Korkuyor', 'error', 'uzgun', cmp(v('ece_guven'), '<', 2)),
        mood('Temkinli', 'neutral', 'saskin'),
      ],
      objectives: [
        objective('obj_ece_gece', flag('fact_ece_gordu'), 'Ece kadehi kıranı gördü.', 'Ece o gece ne gördü?'),
        objective('obj_ece_korku', flag('fact_baba'), 'Babası barda çalıştığını bilmiyor.', 'Ece neden korkuyor?'),
      ],
      topics: [
        topic('TE_KORKU', 'Neden korkuyorsun?', {
          cost: costOf('min_ece', 3),
          effects: [raise('fact_baba')],
          tones: {
            soft: {
              prompt: 'Seni ele vermeye gelmedim. Neden bu kadar korkuyorsun?',
              says: [
                S('ece', 'Babam. Kütahya’da. Kütüphanede çalışıyorum sanıyor. Burs yetmiyor, kira var.'),
                S(
                  'ece',
                  'Mahkemeye çıkarsam adım yazılır: Ece Tan, garson. Bar yazılır. Babam duyar. Duyarsa okul biter, ben biterim.',
                ),
              ],
            },
            hard: {
              prompt: 'Saklanmak kimseyi korumaz. Neyden kaçıyorsun?',
              says: [
                S('ece', 'Siz ne bilirsiniz? Babanız size hiç “eve dön” dedi mi? Bir telefonla?', 'kizgin'),
                S('ece', 'Ece Tan diye bir garson hiçbir kayıtta yok. Sigortam yok. Mahkemeye çıkarsam babam da yok.'),
              ],
            },
          },
        }),
        topic('TE_GECE', 'O gece', {
          cost: costOf('min_ece', 3),
          effects: [raise('fact_ece_gordu'), score('SORGULAMA', 40, 'capraz')],
          tones: {
            soft: {
              prompt: 'Anlatmak zorunda değilsin. Ama anlatırsan, sadece gördüğünü anlat.',
              says: [
                S(
                  'ece',
                  'Serkan… o adam. Tezgâha geldi, bileğimi tuttu. “Bir kadeh benimle” dedi. Bora abi “bırak” dedi.',
                ),
                S('ece', 'Kadehi tezgâha vurdu. Böyle. Kırıldı. Sapı elinde kaldı, Bora abiye savurdu. Abinin kolu…'),
                S(
                  'ece',
                  'Abi bir kere vurdu. Adam düştü. Sonra… sonra ben mutfak kapısına koştum. Gerisini tam görmedim.',
                ),
                S('ece', 'Arka kapıda tokam düştü. Eğilip almadım bile. Bir tokayı almaya dönsem, dönmezdim belki.'),
                T('“Gerisini tam görmedim.” İyi. Görmediğini söylemesi, gördüğünü söylemesinden daha değerli.'),
              ],
            },
            hard: {
              prompt: 'Kadehi kim kırdı? Kısa cevap.',
              says: [
                S('ece', 'O kırdı! Serkan. Bora abi değil. Kırık tarafıyla abiye saldırdı.', 'kizgin'),
                S(
                  'ece',
                  'Yerde ne oldu bilmiyorum, kaçıyordum. Tokamı bile arka kapıda bıraktım. Tamam mı? Bilmiyorum.',
                ),
              ],
            },
          },
        }),
        topic('TE_SERKAN', 'Serkan Aydemir', {
          cost: costOf('min_ece', 3),
          visibleWhen: flag('fact_ece_gordu'),
          effects: [raise('fact_taciz')],
          tones: {
            soft: {
              prompt: 'Daha önce de rahatsız etmiş miydi seni?',
              says: [
                S('ece', 'İki kere geldi. Hep “gız, gel otur” der. Bir kere bahşişi önlüğümün cebine koydu, eli…'),
                S('ece', 'Bora abi o gün de uyarmıştı. “Bir daha olursa kapıdan girmezsin” demişti.'),
              ],
            },
            hard: {
              prompt: 'Abartıyor olabilir misin? Sarhoş bir müşteri işte.',
              says: [
                S('ece', 'Abartıyor muyum? Bileğim üç gün mor kaldı. Fotoğrafını çektim, bakın.', 'kizgin'),
                Nx('Telefonunu uzattı. Bir bilek, sararmış bir morluk, tarih: 3 Kasım.'),
              ],
              effects: [raise('ece_bilek_foto')],
            },
          },
        }),
        topic('TE_BORA', 'Bora nasıl biri?', {
          cost: costOf('min_ece', 3),
          visibleWhen: flag('fact_ece_gordu'),
          tones: {
            soft: {
              prompt: 'Bora’yla çalışmak nasıldı? Nasıl biridir?',
              says: [
                S(
                  'ece',
                  'Az konuşur. Çok az. İlk hafta beni sevmiyor sandım. Sonra bir gece kira param eksik kaldı, kasadan verdi, “sonra” dedi. Hiç sormadı.',
                ),
                S(
                  'ece',
                  'Bir kere bir müşteri bardak fırlattı, abi tezgâhtan çıkmadı bile. “Hesabını öde, çık” dedi. Adam çıktı. Kavga sevmez, gız. Ben hiç görmedim.',
                ),
                S('ece', 'O gece ilk defa çıktı tezgâhtan. İlk defa.'),
                T(
                  'Kavga sevmeyen bir barmen. Bunu bir mahkemeye söyletmem anlamsız; karakter tanıklığı. Ama bilmem lazımdı.',
                ),
              ],
              effects: [inc('ece_guven', 1)],
            },
            hard: {
              prompt: 'Bora öfkeli bir adam mı? Dürüst ol.',
              says: [
                S(
                  'ece',
                  'Öfkeli mi? Abinin öfkesini bir kere gördüm, o da o geceydi. Kızın bileğini tuttular, ne yapsın?',
                  'kizgin',
                ),
                S('ece', 'Siz onun avukatı değil misiniz? Niye bana onu kötü göstermeye çalışıyorsunuz?'),
              ],
            },
          },
        }),
        topic('TE_MASA', 'Kimler vardı?', {
          cost: costOf('min_ece', 3),
          visibleWhen: flag('fact_ece_gordu'),
          discovers: 'clue_story',
          effects: [score('ARASTIRMA', 40, 'delil')],
          tones: {
            soft: {
              prompt: 'Salonda başka kimler vardı? Kim görmüş olabilir?',
              says: [
                S(
                  'ece',
                  'Masa dörtte o ve gözlüklü arkadaşı. Hep beraber gelirler, iş arkadaşı galiba. Gözlüklü hesabı öder hep.',
                ),
                S(
                  'ece',
                  'Masa yedide iki kız. Biri telefonunu kaldırmış, hikâye çekiyordu. Işığı yüzüme geldi, o yüzden hatırlıyorum.',
                ),
                T(
                  '“Hep beraber gelirler.” Onur Kılıç “tanımam” diyordu. Bir tanığın sözü, bir başka tanığın kanıtı olmaz. Ama nereye bakacağımı söyler.',
                ),
              ],
              effects: [raise('fact_beraber_gelir')],
            },
            hard: {
              prompt: 'İsim ver. Kim gördü?',
              says: [
                S('ece', 'İsim bilmem! Masa yedide bir kız video çekiyordu, o kadar.', 'kizgin'),
                T('Masa yedi. Bir telefon. Bir ışık.'),
              ],
            },
          },
        }),
      ],
      choices: [
        option('ECE_DOGRU', '“Tanık olursan sadece gördüğünü anlat. Görmediğin hiçbir şeyi söyleme.”', {
          visibleWhen: flag('fact_ece_gordu'),
          score: { SAVUNMA_STRATEJISI: 80 },
          effects: [
            ifThen(
              any(cmp(v('ece_guven'), '>=', 2), flag('ece_itiraf')),
              [raise('ece_tanik_olur')],
              [raise('ece_dusunecek')],
            ),
          ],
          good: 'Doğru sınır: avukat tanığa ne söyleyeceğini söyleyemez, yalnızca doğruyu söylemenin önemini ve tanıklık yükümlülüğünü anlatabilir (CMK 43 vd., TCK 277).',
          responses: [
            when(
              any(cmp(v('ece_guven'), '>=', 2), flag('ece_itiraf')),
              S('ece', 'Gördüğümü… Kadehi o kırdı. Abi bir kere vurdu. Gerisini görmedim. Bu kadar.'),
              S('ece', 'Babam duyacak. Biliyorum. Ama Bora abi benim yüzümden…'),
              S('ece', 'Adımı yazın. Çağırırlarsa gelirim.'),
              Nx('Fotokopi destesini çantasına koydu. Kalktı. Kantinin kapısında durdu, döndü.'),
              S('ece', 'Bora abiye söyleyin: önlüğümü atmasın. Belki geri gelirim. Belki gelmem. Ama atmasın.'),
              T('Bir karar verdi. Benim değil, onun kararı. Böyle olmalıydı.'),
            ),
            otherwise(S('ece', 'Düşüneceğim. Söz vermiyorum.'), T('Düşünecek. Belki gelir. Belki babası önce arar.')),
          ],
          next: '$return',
        }),
        option(
          'ECE_YONLENDIR',
          '“Mahkemede kadehi önce onun kaldırdığını ve yerde tekme olmadığını kesin gördüğünü söylemelisin.”',
          {
            visibleWhen: flag('fact_ece_gordu'),
            score: { SAVUNMA_STRATEJISI: 40 },
            effects: [raise('ece_yonlendirildi'), raise('ece_tanik_olur'), inc('ethics')],
            responses: says(
              S('ece', 'Tekme… ben yeri görmedim ama. Kaçıyordum.', 'saskin'),
              D('Gördün. Sen tezgâhın yanındaydın. Gördün.'),
              S('ece', '…Peki. Gördüm. Tamam.'),
              T('Tamam dedi. Ve o an, ikimiz de yalan bir şeyi doğruymuş gibi taşımaya başladık.'),
            ),
            next: '$return',
          },
        ),
        option('ECE_ZORUNLU', '“Tanıklık zorunlu değil; istemezsen kimse seni çağıramaz.”', {
          visibleWhen: flag('fact_ece_gordu'),
          score: { HUKUKI_BILGI: -40 },
          effects: [raise('ece_cekildi')],
          bad: 'Yanlış bilgi: mahkemece çağrılan tanık gelmek ve tanıklık etmekle yükümlüdür; gelmezse zorla getirilebilir (CMK 43, 44). Tanığa yanlış bilgi vermek de onu etkilemenin bir yoludur.',
          category: 'HUKUKI_BILGI',
          responses: says(
            S('ece', 'Gerçekten mi? O zaman… o zaman istemiyorum. Kusura bakmayın.'),
            T('Kapıyı ben açtım. Kendi elimle. Bora gibi.'),
          ),
          next: '$return',
        }),
      ],
      finish: { id: 'ECE_BITIR', label: 'Kantinden ayrıl' },
    }),

    // --- Eczane ---
    choiceNode('INV_ECZANE', {
      ...INV1,
      title: 'Nöbetçi eczane',
      background: 'sokak_yagmur',
      lines: says(
        card('GÖKDERE ECZANESİ', 'sokak_yagmur'),
        Nx('Eczacı altmışlarında, gözlüğü burnunun ucunda, bir kadın. Raflarda öksürük şurupları dizili.'),
        voice('ECZACI', 'Kamera mı? On beş gün tutar, kendi kendine siler. İki buçuk ay olmuş, kızım.'),
        T('İki buçuk ay. Geç kaldım. Bir kez daha.'),
        voice('ECZACI', 'Ama…'),
        Nx('Çekmecesini açtı. Bir USB bellek, üstünde kurşun kalemle yazılmış bir tarih: 3.11.'),
        voice(
          'ECZACI',
          'O gece ambulans kapımın önünde durdu. “Polis gelir sorar” dedim, o saati kaydettim. Kimse sormadı.',
        ),
        voice('ECZACI', 'Size veremem ama. Kişisel veri, şu bu. Mahkeme isterse yarım saatte getiririm.'),
        voice(
          'ECZACI',
          'Kırk yıldır bu köşedeyim kızım. Bora’nın babasını da bilirim. O da az konuşurdu. Bu sokakta az konuşanlar hep yanlış anlaşılır.',
        ),
        T(
          'Bir eczacının çekmecesinde, kurşun kalemle tarihlenmiş bir bellek. Bazen bir dosyanın en sağlam delili, birinin “polis gelir sorar” diye düşünüp kimsenin sormamasıdır.',
        ),
      ),
      prompt: 'Eczacıya ne diyeceksin?',
      choices: [
        option('ECZ_MAHKEME', '“Mahkeme isteyecek. Belleği saklayın, lütfen.”', {
          score: { USUL_BILGISI: 60 },
          effects: [raise('eczane_usb')],
          good: 'Doğru yol: delil mahkemeden istenir (CMK 177, 206). Özel kişiden doğrudan alınan kayıt hem kişisel veri sorununa hem de bütünlük tartışmasına yol açardı.',
          responses: says(
            voice('ECZACI', 'Saklarım. Dükkânı ay sonunda devrediyorum ama; sonrası Allah kerim.'),
            voice('ECZACI', 'Bir şey daha: o gece arka sokaktan önlüklü bir kız koştu. Ağlıyordu. Ekranda gördüm.'),
            T('Önlüklü bir kız. Kimse sormadığı için kimse bilmiyordu.'),
            voice(
              'ECZACI',
              'Bir de o iki adam. Akşam kol kola girdiler bara, gülüşerek. Ben kepenk indirirken gördüm; biri öbürüne “müdürüm” diye takılıyordu.',
            ),
            T(
              '“Müdürüm.” Bir eczacının kulağına takılmış bir kelime. Kanıt değil; ama kaydın neyi gösterdiğini tahmin etmeme yetiyor.',
            ),
          ),
          next: '$return',
        }),
        option('ECZ_KOPYA', '“Telefonuma bir kopyasını atsanız? Kimse bilmez.”', {
          score: { USUL_BILGISI: -40 },
          effects: [raise('eczane_kopya_istendi'), raise('eczane_usb')],
          bad: 'Delil, kişisel veri ve bütünlük kuralları gözetilerek mahkeme kanalıyla celbedilmelidir; gizlice alınan kopya hem tartışmalı olur hem eczacıyı zor durumda bırakır.',
          category: 'USUL_BILGISI',
          responses: says(
            voice('ECZACI', 'Olmaz kızım. Benim başım belaya girer. Mahkeme isterse veririm, dedim.'),
            Nx('Çekmeceyi kapattı. Sert değil, ama kesin.'),
          ),
          next: '$return',
        }),
      ],
    }),

    // --- Belgeler ---
    documentExam('INV_HASTANE', {
      ...INV1,
      title: 'Müştekinin acil servis kaydı',
      hud: ['exam1'],
      background: 'hastane',
      onFirstEnter: [{ type: 'DISCOVER', evidence: 'ev_hastane' }],
      lines: says(
        card('DOSYA EKLERİ · 4. KLASÖR', 'hastane'),
        Nx(
          'Kimsenin açmadığı bir klasör. Zımbası paslanmamış, sayfaları birbirine yapışık. Acil servis, 3 Kasım 02.25.',
        ),
        T(
          'Kimse okumamış. Okusaydı iddianame başka yazılırdı. Ya da hiç yazılmazdı. Bir alet seç, sonra satıra dokun.',
        ),
        Nx(
          'Sayfaların kenarında bir triyaj hemşiresinin el yazısı: küçük, yuvarlak, aceleci. Gece ikide yazılmış her şey biraz aceleci olur; ama hemşireler doktorlardan daha az yalan yazar.',
        ),
      ),
      header: { left: 'ACİL SERVİS · HASTA DOSYASI', right: '3 KASIM · 02.25' },
      columns: [
        { label: 'BÖLÜM', flex: 1 },
        { label: 'KAYIT', flex: 2.6 },
      ],
      rows: [
        row('h_gelis', ['Geliş', '02.25 · 112 ambulansı · bilinci açık']),
        row('h_anamnez', ['Anamnez', 'Kavgada darp (hasta beyanı) · el yazısı'], {
          mag: { cells: ['Anamnez', '“Kavgada yumrukla vuruldum” — hasta beyanı'], tone: 'special' },
        }),
        row('h_lab', ['Laboratuvar', 'Ek sayfada'], {
          mag: { cells: ['Laboratuvar', 'Kan alkol: 190 mg/dL (1,9 ‰)'], tone: 'special' },
        }),
        row('h_yara', ['Yara', 'Sağ elde 4 cm kesi, sütur'], {
          mag: { cells: ['Yara', 'Sağ el AYASI iç yüz, transvers 4 cm kesi · yüzde kesi yok'], tone: 'special' },
        }),
        row('h_grafi', ['Grafi', 'Nazal kemikte kırık'], {
          mag: { cells: ['Grafi', 'Deplasmansız lineer kırık · septum normal'], tone: 'special' },
        }),
        row('h_taburcu', ['Taburcu', '06.10 · kontrol önerildi']),
      ],
      tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Tutanakla karşılaştır', 'compare')],
      costVar: 'exam1',
      rules: [
        ex(
          'EX_H_ANAMNEZ',
          'mag',
          'h_anamnez',
          'clue_anamnez',
          150,
          'YUMRUK',
          'Triyaj hemşiresinin el yazısı: “Kavgada yumrukla vuruldum.” Kadeh yok, cam yok. Müştekinin kendi ilk sözü.',
        ),
        ex(
          'EX_H_LAB',
          'mag',
          'h_lab',
          'clue_alkol',
          100,
          'EK SAYFA',
          'Kan alkolü 1,9 promil. Ayakta duran bir adam için çok; kadeh kıran bir adam için yeterli.',
        ),
        ex(
          'EX_H_YARA',
          'mag',
          'h_yara',
          'clue_avuc',
          150,
          'AVUÇ İÇİ',
          'Kesi elin üstünde değil, avucun içinde; enine. Yüzde tek çizik yok. Yüzüne kırık kadeh yiyen bir adamın yüzü bu değil.',
        ),
        ex(
          'EX_H_GRAFI',
          'mag',
          'h_grafi',
          'clue_deplasman',
          100,
          'SEPTUM NORMAL',
          'Deplasmansız lineer kırık, septum normal. Küçük puntoyla. Derece tartışmasında önemli olacak bir satır.',
        ),
        ex(
          'EX_H_GELIS',
          'cmp',
          'h_gelis',
          undefined,
          40,
          'SAAT',
          'Olay 01.40, 112 çağrısı 01.50, acil 02.25. Tutanakla tutarlı. Çağrıyı yapan sanıktı; tutanakta yazıyor.',
          [raise('fact_112')],
        ),
      ],
      miss: docMiss('FB_HASTANE'),
      finish: { id: 'HASTANE_BITIR' },
    }),
    documentExam('INV_DARP', {
      ...INV1,
      title: 'Sanığın darp raporu',
      hud: ['exam2'],
      background: 'hastane',
      onFirstEnter: [{ type: 'DISCOVER', evidence: 'ev_darp' }],
      lines: says(
        Nx('Aynı klasörün arka cebinde, iki sayfa. Aynı hastane, aynı gece, on beş dakika arayla.'),
        T('İki adam, iki oda, iki rapor. Biri iddianameye girmiş. Biri girmemiş.'),
        Nx(
          'Raporun köşesinde bir not: “Hasta yarasını polisin ısrarıyla gösterdi.” Bora kolunu kimseye göstermek istememiş; ona benziyor.',
        ),
      ),
      header: { left: 'ADLİ MUAYENE · DARP RAPORU', right: '3 KASIM · 02.40' },
      columns: [
        { label: 'BÖLÜM', flex: 1 },
        { label: 'KAYIT', flex: 2.6 },
      ],
      rows: [
        row('d_yer', ['Lokalizasyon', 'Sol önkolda 6 cm kesi'], {
          mag: { cells: ['Lokalizasyon', 'Sol önkol ULNAR yüz, dirsekten bileğe 6 cm · 6 sütur'], tone: 'special' },
        }),
        row('d_el', ['Diğer', 'Sağ elde ödem'], {
          mag: { cells: ['Diğer', 'Sağ el 2–3. MKP eklemlerinde ödem (yumruk darbesiyle uyumlu)'], tone: 'special' },
        }),
        row('d_alkol', ['Alkol', 'Negatif']),
      ],
      tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Tutanakla karşılaştır', 'compare')],
      costVar: 'exam2',
      rules: [
        ex(
          'EX_D_YER',
          'mag',
          'd_yer',
          'clue_onkol',
          150,
          'ULNAR YÜZ',
          'Önkolun dış kenarı. Yüzüne gelen bir darbeye kolunu siper eden birinin açıkta kalan yeri. Kitaplarda bir adı var: savunma yarası.',
        ),
        ex(
          'EX_D_EL',
          'mag',
          'd_el',
          undefined,
          60,
          'TEK EL',
          'Sağ elde yumruk darbesiyle uyumlu ödem. Bora vurduğunu saklamıyor; raporu da saklamıyor. Dürüst bir yara.',
          [raise('fact_tek_yumruk')],
        ),
        ex(
          'EX_D_ALKOL',
          'cmp',
          'd_alkol',
          undefined,
          40,
          'AYIK',
          'Sanığın alkolü negatif. Barmen ayıktı; müşteri 1,9 promil. Tutanakta ikisinden de söz yok.',
          [raise('fact_bora_ayik')],
        ),
      ],
      miss: docMiss('FB_DARP'),
      finish: { id: 'DARP_BITIR' },
    }),
    documentExam('INV_IFADE', {
      ...INV1,
      title: 'Onur Kılıç’ın ifadesi',
      hud: ['exam3'],
      background: 'buro_gece',
      lines: says(
        Nx(
          'Tek sayfa. 03.30’da başlıyor, 03.52’de imzalanmış. Yirmi iki dakikada bir tanık, bir gece, bir adamın geleceği.',
        ),
        T('Her cümlesini ayrı bir karta yazacağım. Yalan, tek cümlede değil, cümlelerin arasındaki boşlukta durur.'),
        Nx(
          'İmza düzgün, harfler eğimsiz. Bir sigortacının imzası: binlerce poliçenin altına atılmış, hiç titremeyen bir el.',
        ),
      ),
      header: { left: 'KOLLUK · TANIK İFADE TUTANAĞI', right: '3 KASIM · 03.30' },
      columns: [
        { label: '#', flex: 0.4 },
        { label: 'BEYAN', flex: 3 },
      ],
      rows: [
        row('i_1', ['1', 'Kimliğim tespit edildi. Satış uzmanıyım.']),
        row('i_2', ['2', 'Bara tek başıma gittim. Müştekiyi daha önce hiç görmedim, tanımam.']),
        row('i_3', ['3', 'Oturduğum yerden barın her yerini net olarak görüyordum.']),
        row('i_4', ['4', 'Sanık tezgâhtaki kadehi kırdı, kırık tarafıyla müştekinin yüzüne vurdu.']),
        row('i_5', ['5', 'Müşteki yere düşünce sanık tezgâhtan çıktı, yerde yatan adamı tekmeledi.']),
        row('i_6', ['6', 'Ben ayırmaya çalıştım. Söyleyeceklerim bundan ibarettir.']),
      ],
      tools: [tool('mark', 'Karta yaz', 'check'), tool('mag', 'Büyüteç', 'magnifier')],
      costVar: 'exam3',
      rules: [
        ex(
          'EX_I_2',
          'mark',
          'i_2',
          'clue_if_tanimam',
          60,
          'KART: TANIMAM',
          '“Müştekiyi daha önce hiç görmedim.” Kesin, temiz bir cümle. Kesin cümleler kontrol edilebilir.',
        ),
        ex(
          'EX_I_3',
          'mark',
          'i_3',
          'clue_if_gordum',
          60,
          'KART: HER YERİ GÖRDÜM',
          '“Barın her yerini net olarak görüyordum.” Nereden? Hangi masadan?',
        ),
        ex(
          'EX_I_4',
          'mark',
          'i_4',
          'clue_if_kadeh',
          60,
          'KART: KADEHLE YÜZE',
          '“Kırık tarafıyla yüzüne vurdu.” Kırık bir kadeh yüze vurulursa iz bırakır.',
        ),
        ex(
          'EX_I_5',
          'mark',
          'i_5',
          'clue_if_tekme',
          60,
          'KART: TEKME',
          '“Yerde yatan adamı tekmeledi.” Doğruysa meşru müdafaa biter. Tekme, iz bırakır.',
        ),
        ex(
          'EX_I_6',
          'mag',
          'i_6',
          undefined,
          40,
          'AYIRMAYA ÇALIŞTIM',
          '“Ayırmaya çalıştım.” Kimi tuttu? Hangi kolundan? Ayırmaya çalışan biri kolonun arkasından kalkmış olmalı.',
          [raise('fact_onur_tuttu')],
        ),
      ],
      miss: docMiss('FB_IFADE'),
      finish: { id: 'IFADE_BITIR' },
    }),

    // --- Delil dilekçesi ---
    choiceNode('INV_DIL', {
      ...INV1,
      title: 'Delil dilekçesi',
      hud: ['dil_hak'],
      background: 'buro_gece',
      lines: says(
        Nx(
          'Boş bir sayfa, bir başlık: “BURSA 7. ASLİYE CEZA MAHKEMESİNE”. Talep sayısı az, her biri gerekçeli olmalı.',
        ),
        T('Hâkim on talebi okumaz, üçünü okur. Hangisi üç?'),
        Nx(
          'Masada üç yığın: dosyanın kendisi, panodan indirdiğim kartlar, bir de soğumuş bir çay. Leyla bir keresinde “dilekçe, avukatın mahkemeye yazdığı mektup değildir; mahkemenin yapacağı işin listesidir” demişti.',
        ),
      ),
      prompt: 'Dilekçeye ne yazacaksın? (Üç talep hakkı)',
      choices: [
        option('DIL_KRIMINAL', 'Emanetteki kırık kadehin Kriminal incelemesi (sap üzerindeki izler)', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 80 },
          effects: [raise('req_kriminal')],
          good: 'Yerinde: savunma delil toplanmasını isteyebilir (CMK 177; duruşmada CMK 206). Sapı kimin, nasıl tuttuğu izlerden anlaşılır.',
          next: '$stay',
        }),
        option('DIL_ECZANE', 'Gökdere Eczanesi’ndeki 3 Kasım kaydının celbi', {
          visibleWhen: flag('eczane_usb'),
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 80 },
          effects: [raise('req_eczane')],
          good: 'Yerinde: kayıt silinmek üzere; delilin kaybolma tehlikesi gerekçe olarak yazıldı (CMK 177).',
          next: '$stay',
        }),
        option('DIL_ECE', 'Ece Tan’ın tanık olarak dinlenmesi', {
          visibleWhen: flag('ece_tanik_olur'),
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 60 },
          effects: [raise('req_ece')],
          good: 'Yerinde: olayı gören ve dosyada adı geçmeyen tanığın dinlenmesi istendi (CMK 177/1).',
          next: '$stay',
        }),
        option('DIL_ATK', 'Kırığın derecesi için Adli Tıp’tan kesin rapor alınması', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: 40 },
          good: 'Yerinde ama mahkeme bunu zaten re’sen isteyecekti: geçici raporla 87/3 derecesi belirlenemez.',
          next: '$stay',
        }),
        option('DIL_KARAKTER', 'Mahalle esnafının sanığın karakterine dair tanık olarak dinlenmesi', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: -20 },
          bad: 'Olayı görmemiş kişilerin “iyi adamdır” beyanı ispat değeri taşımaz; talep hakkı boşa gitti.',
          category: 'USUL_BILGISI',
          next: '$stay',
        }),
        option('DIL_ONUR', 'Tanık Onur Kılıç’ın dinlenmemesi', {
          cost: [{ var: 'dil_hak', amount: 1 }],
          score: { USUL_BILGISI: -40 },
          bad: 'Dayanaksız: iddianamede gösterilen tanığın dinlenmemesi istenemez; çelişkiler çapraz sorguda ortaya konur (CMK 201).',
          category: 'USUL_BILGISI',
          next: '$stay',
        }),
        back('DIL_GONDER', 'Dilekçeyi gönder'),
      ],
    }),

    // --- Çıkarım tahtası ---
    deductionBoard('INV_CIKARIM', {
      ...INV1,
      title: 'Çıkarım Tahtası',
      background: 'buro_gece',
      lines: says(
        Nx(
          'İki kartı seç. Birbirini açıklıyorsa ip gerilir ve duruşmada kullanabileceğin bir DELİL doğar. Yanlış eşleşme zaman ve puan yer.',
        ),
      ),
      pool: INV_POOL,
      recipes: baseRecipes('CB'),
      miss: boardMiss('FB_CIKARIM'),
      finish: { id: 'CIKARIM_BITIR' },
    }),

    // --- Leyla ---
    story('INV_LEYLA1', {
      ...INV1,
      title: 'Leyla',
      background: 'buro',
      lines: says(
        Nx('Leyla bir dilekçenin kenarına kurşun kalemle not alıyordu. Başını kaldırmadan konuştu.'),
        S('leyla', 'Meşru müdafaa beyan edilmez, gösterilir. Saldırı kimden geldi? Kâğıtla göster.'),
        S(
          'leyla',
          'Orantı “aynı silah” demek değildir. Kırık camla gelen birine yumrukla karşılık vermek orantısız değildir. Ama yere düşmüş birine vurmak başka.',
        ),
        S(
          'leyla',
          'Bir şey daha: tanıkla konuşabilirsin, ifadesini şekillendiremezsin. Karşı tarafla da avukatı üzerinden konuşursun. İkisini karıştırma.',
        ),
        D('Ya Bora haklıysa ama ispatlayamazsam?'),
        Nx('Kalemi bıraktı. İlk kez başını kaldırdı.'),
        S(
          'leyla',
          'O zaman iki kapı var. Saldırıyı gösterirsin ama orantıyı gösteremezsin: sınırın aşılması. Korkudan, heyecandan aşıldıysa ceza verilmez; ama fiil hukuka uygun da sayılmaz.',
        ),
        S(
          'leyla',
          'Ya da saldırıyı bile gösteremezsin: haksız tahrik. Ceza azalır, kaybolmaz. Bora için ikisi de “haklıydın ama” demektir.',
        ),
        S(
          'leyla',
          'Bir de üçüncü kapı var, Deniz: iddianın anlatımını çürütürsün, hâkim kimin ne yaptığından emin olamaz. Şüphe. O da beraattir; ama Setbaşı’nda kimse “şüpheden” diye bara gelmez.',
        ),
        T('Üç kapı. Hiçbiri tam olarak Bora’nın istediği kapı değil. Bora’nın istediği tek bir cümle: “Haklıydın.”'),
      ),
      choices: [back('LEYLA1_DON', 'Teşekkürler')],
    }),
    story('INV_LEYLA2', {
      ...INV1,
      title: 'Leyla',
      background: 'buro',
      lines: [
        when(
          flag('ece_itiraf'),
          Nx('Leyla’ya Ece’yi anlattım. Gözlüğünü çıkardı.'),
          S(
            'leyla',
            'Müvekkilin tanığı kapıdan göndermiş. Bunu Tolga öğrenirse “tanık kaçırdı” der. Sen önce öğrendin; iyi.',
          ),
          S(
            'leyla',
            'Kıza ne diyeceğini düşünme. Ne demeyeceğini düşün. Kendi kararını verecek. Sen sadece kapıyı göster.',
          ),
          S(
            'leyla',
            'Ve kırığın derecesi. Geçici rapor bir şey söylemez. Kesin raporu bekle; karşı taraf özel bir rapor getirirse resmî rapora dayan.',
          ),
          D('Bora onu korumak istiyor. Ben de mi korumalıyım?'),
          S(
            'leyla',
            'Sen Bora’yı korursun. Ece’yi Ece korur. Onun yerine karar verirsen, Bora’nın yaptığını yapmış olursun: onu kapının dışına koyarsın, bu sefer kibarca.',
          ),
        ),
        when(
          flag('ece_ad'),
          Nx('Leyla’ya önlüğü ve Bora’nın tek kelimelik cevabını anlattım: “Garson. Bıraktı.”'),
          S('leyla', 'Bıraktı. Ne zaman bıraktı? O geceden önce mi, sonra mı? Bunu sormadın, değil mi?'),
          S(
            'leyla',
            'Adını bildiğin bir garson, adını bilmediğin bir tanıktır. Bul onu. Ama bulunca ne diyeceğini değil, ne demeyeceğini düşün.',
          ),
          S('leyla', 'Ve kırığın derecesi. Geçici rapor bir şey söylemez. Kesin raporu bekle.'),
        ),
        otherwise(
          Nx('Leyla çayını karıştırıyordu, kaşık bardağa hiç değmeden.'),
          S('leyla', 'Az konuşan müvekkil, demiştim. Neyi saklıyor, buldun mu?'),
          S('leyla', 'Bul. Barda o saatte bir barmen yalnız çalışmaz. Tepsiyi kim taşıyordu?'),
          S('leyla', 'Ve kırığın derecesi. Geçici rapor bir şey söylemez. Kesin raporu bekle.'),
        ),
      ],
      choices: [back('LEYLA2_DON', 'Teşekkürler')],
    }),
    story('INV_LEYLA3', {
      ...INV1,
      title: 'Leyla',
      background: 'buro',
      lines: says(
        S('leyla', 'Son gün. Dilekçeni gösterme bana; ne istediğini söyle yeter.'),
        S(
          'leyla',
          'Delili iste, tanığı iste, ama her talebin bir nedeni olsun. Hâkim “neden” diye sormadan önce sen cevap ver.',
        ),
        S(
          'leyla',
          'Yarın Bora konuşacak. Ona ne diyeceğini söyleme. Doğruyu söylemesinin bedelini söyle; kararı ona bırak.',
        ),
        Nx('Ters çerçeveye uzandı. Bir an, çevirecek gibi oldu. Çevirmedi. Parmağıyla kenarındaki tozu sildi.'),
        S(
          'leyla',
          'Yıllar önce bir müvekkilime ne diyeceğini söyledim. Doğruydu da. Hâkim yine de onun sesini değil, benim sesimi duydu.',
        ),
        T('Sormadım. Sormamam gerektiğini biliyordum. Ama o cümle, dosyanın bütün sayfalarından daha ağırdı.'),
      ),
      choices: [back('LEYLA3_DON', 'Teşekkürler')],
    }),

    // --- Duruşmadan önceki gece (koşullu hafıza zinciri) ---
    decisionNode('INV_GECE_1', [{ to: 'INV_GECE_2' }], {
      ...INV1,
      title: 'Duruşmadan önceki gece',
      lines: says(
        card('DURUŞMADAN ÖNCEKİ GECE — ARSLAN HUKUK', 'buro_gece'),
        Nx('Gece yarısına yakın. Panoda fotoğraflar, iplikler, kartlar. Sabah hepsi bir salonda sınanacak.'),
        T('Elimde ne var? Saydım. Bir kez, bir daha.'),
      ),
    }),
    decisionNode('INV_GECE_2', [{ to: 'INV_GECE_3' }], {
      ...INV1,
      lines: [
        when(
          all(has('ded_kadeh_serkan'), has('ded_savunma')),
          T('Kırık sap Serkan’ın elindeydi; ilk kesilen tezgâhın arkasındaki adamdı. Saldırı kâğıtta ayakta.'),
        ),
        when(
          any(has('ded_kadeh_serkan'), has('ded_savunma')),
          T('Saldırının bir yarısı kâğıtta. Öbür yarısı Bora’nın sözünde. Yarım bir saldırı, tam bir savunma kurmaz.'),
        ),
        otherwise(T('Saldırı… Bora “o başlattı” diyor. Elimde onun sözünden başka bir şey yok.')),
      ],
    }),
    decisionNode('INV_GECE_3', [{ to: 'INV_GECE_4' }], {
      ...INV1,
      lines: [
        when(
          all(has('ded_tanidik'), flag('fact_beraber_gelir')),
          T(
            'Onur Kılıç “tanımam” dedi. Tanıdığı adamın rakısını ödemiş; Ece’ye göre hep beraber gelirlermiş. Bir garsonun sözü kanıt değil, ama adisyon kanıt.',
          ),
        ),
        when(
          has('ded_tanidik'),
          T('Onur Kılıç “tanımam” dedi. Tanıdığı adamın rakısını ödemiş. Tanığın tarafsızlığı yarın ilk soru olacak.'),
        ),
        otherwise(
          T(
            'Onur Kılıç. Kibar, net, kol saatli. Kim olduğunu bilmiyorum. Bilmediğim bir tanığa soru sormak, karanlıkta tezgâh aramak gibi.',
          ),
        ),
      ],
    }),
    decisionNode('INV_GECE_4', [{ to: 'INV_GECE' }], {
      ...INV1,
      lines: [
        when(
          flag('ece_tanik_olur'),
          T('Ece gelecek. Ya da gelmeyecek. Adını yazdırdım; kararı onun. Babası henüz bilmiyor.'),
        ),
        when(
          flag('ece_itiraf'),
          T('Bir garson vardı. Bora onu gönderdi. Ben onu bulamadım ya da ikna edemedim. Bir boşluk.'),
        ),
        otherwise(T('Bir şey eksik. Bora bir şey saklıyor. Ne olduğunu bilmeden salona giriyorum.')),
      ],
    }),
    story('INV_GECE', {
      ...INV1,
      title: 'Duruşmadan önceki gece',
      background: 'sokak_yagmur',
      lines: says(
        Nx('Bir şimşek camı bembeyaz yaptı. Işıklar bir an titredi.', { fx: 'flash' }),
        Nx('Cübbemi askıdan indirdim. Yakası kırışıktı; elimle düzelttim.'),
        Nx('Telefonuma bir mesaj düştü. Bora: “Yarın geleceğim. Kasketi çıkarırım.”'),
        Nx(
          'Bir mesaj daha, iki dakika sonra: “Simitçi Ramazan selam söyledi. Sen mi gönderdin simidi?” Cevap yazmadım. Bazı soruların cevabı yazılınca küçülür.',
        ),
        T('Kasketi çıkaracak. Bora Yalçın’ın bir mahkemeye gösterebileceği en büyük saygı bu.'),
        Nx(
          'Panoya son bir kez baktım. Bir kadeh, bir kol, bir önlük, bir masa numarası. İplikler yer yer kopuktu; bazıları hiç bağlanmamıştı.',
        ),
        T(
          'Yarın bir salonda Bora kendi gecesini anlatacak. Ben dinleyeceğim, savcı dinleyecek, Tolga Şen not alacak. Ve bir hâkim, hepimizin anlattığından bir gece kuracak.',
        ),
        Nx('Leyla merdivenin başında durdu, gitmek üzereydi.'),
        S('leyla', 'Yarın tanık ne görürse sen de onu gör, Deniz. Ne istediğini değil.'),
        S('leyla', 'Ve Tolga’ya kızma. Kızan avukat, karşı tarafın avukatı olur.'),
      ),
      choices: [cont('GECE_DEVAM', 'Adliyeye git', 'H1_00G', { role: 'PRIMARY' })],
    }),
  ],
  triggers: [dayEndTrigger],
};
