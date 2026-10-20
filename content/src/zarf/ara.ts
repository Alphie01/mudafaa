import {
  all,
  any,
  choiceNode,
  cmp,
  cont,
  conversation,
  decisionNode,
  deductionBoard,
  deliver,
  discover,
  documentExam,
  examine,
  fallback,
  flag,
  has,
  ifThen,
  inc,
  mark,
  not,
  option,
  raise,
  rawChoice,
  recipe,
  ref,
  row,
  sceneSearch,
  score,
  set,
  story,
  tool,
  v,
  visited,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef, NodeDef } from '../../../tools/content/src/kit/index.js';
import { B, O, S, W, minus } from './dsl.js';
import { INV1_RECIPES, POOL_INV1 } from './inv1-hub.js';
import { ARA, p2 } from './shared.js';

// 70-ara: iki celse arası (2 gün × 4 EP). Yığın kullanılmaz: her etkinlik doğrudan ARA_HUB'a döner (Dava #07 v2 notu 2).

const HUB = 'ARA_HUB';

/** Alt ekranlardaki `$return`'ü doğrudan hub'a çevirir. */
function direct<T extends NodeDef>(node: T): T {
  return {
    ...node,
    choices: node.choices.map((ch) => (ch.next === '$return' ? { ...ch, next: HUB } : ch)),
  };
}

/** Eylem puanı harcayan, yığınsız etkinlik. */
const act = (id: string, label: string, to: string, spec: Partial<ChoiceDef> = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { cost: [{ var: 'ara_ap', amount: 1 }], next: to, maxUses: 1, ...spec });

const free = (id: string, label: string, to: string, spec: Partial<ChoiceDef> = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { next: to, ...spec });

const giris = deliver('ARA_GIRIS_1', [
  {
    evidence: 'ev_kamera',
    requires: any(flag('dl_kamera'), flag('rq_kamera')),
    hint: 'Koridor kamerasının görüntülerini, doksan günlük süre dolmadan iste.',
  },
  {
    evidence: 'ev_santral',
    requires: any(flag('dl_santral'), flag('rq_santral')),
    hint: 'Santral dökümü ve izin çizelgesi, sahte çağrının kaynağını gösterirdi.',
  },
  {
    evidence: 'ev_cihaz',
    requires: any(flag('dl_cihaz'), flag('rq_cihaz')),
    hint: 'Muhbirin kayıt cihazını bilirkişiye incelettir.',
  },
  {
    evidence: 'ev_sonlandirma',
    requires: any(flag('dl_karar'), flag('rq_karar')),
    hint: 'Tedbirin uzatma kararını ve sonlandırma yazısını iste (CMK 137/1).',
  },
]);

const dayEnd = p2.dayEnd({ ...ARA, title: 'Gün sonu', continueId: 'ARA_DAY_NEXT', deliveries: [] });

/** Ara tahtasında 1. evre tarifleri: yeniden kurulabilir, puanı yalnızca ilk kurulumda. */
const again = ([id, a, b, ded, title, text]: (typeof INV1_RECIPES)[number]): ChoiceDef =>
  recipe(`${id}_2`, a, b, {
    effects: [ifThen(not(has(ded)), [score('DELIL_ANALIZI', 300)]), discover(ded)],
    feedback: { title, text, label: 'TAHTADA', tone: 'success' },
  });

const fresh = (id: string, a: string, b: string, ded: string, title: string, text: string): ChoiceDef =>
  recipe(id, a, b, {
    effects: [ifThen(not(has(ded)), [score('DELIL_ANALIZI', 300)]), discover(ded)],
    feedback: { title, text, label: 'YENİ DELİL · +300 SKOR', tone: 'success' },
  });

const examMiss = (id: string) =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle bu satırda yeni bir şey görünmüyor.',
      label: `${minus(20)} SKOR`,
      tone: 'error',
    },
  });

const tapMiss = (id: string) =>
  fallback(id, 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Burada bir şey yok. (−1 büyüteç)', label: `${minus(10)} SKOR`, tone: 'error' },
  });

export const ara: CasePart = {
  nodes: [
    decisionNode('ARA_GIRIS_1', [{ to: 'ARA_GIRIS_2' }], {
      ...ARA,
      onEnter: [...giris.effects, ...p2.start()],
      lines: [
        W(
          flag('halil_tahliye'),
          S`
            = 17 MAYIS 2027 · 09.00 — ARSLAN HUKUK @buro
            - Bir hafta sonra Halil büroya kendisi geldi; imzaya giderken uğramış. Takım elbisesini giymişti; kravatı düzgün, gözlüğü burnunda. Kapıda durdu, içeri girmeden önce ayakkabılarını sildi.
            halil: Avukat hanım. Sardunyayı suladım. Yeni olanı. Eskisini de attım; kurumuştu. Kurumuş bir şeyi saklamanın anlamı yok.
          `,
        ),
        O(S`
          = 17 MAYIS 2027 · 09.00 — ARSLAN HUKUK @buro
          - Bir hafta sonra Zehra büroya bir kutu kurabiyeyle geldi. "Babam yolladı" dedi. "Cezaevinin kantininden. Kurallara uygun paketlenmiş, etiketli."
          zehra: Kütüphaneyi yeniden dizmiş. Bu sefer yazarın soyadına göre. "Yayınevine göre dizmek bir hataydı" demiş.
        `),
      ],
    }),
    decisionNode('ARA_GIRIS_2', [{ to: 'ARA_GIRIS_3' }], {
      ...ARA,
      lines: [
        W(
          all(has('ev_kamera'), has('ev_santral')),
          S`- Ara karar cevapları birer birer dosyaya düştü. Müdürlükten bir flaş bellek: koridor kamerasının yirmi dakikası. Ve santralin dökümü, bir izin çizelgesiyle birlikte. Doksan günün yetmiş beşinci gününde.`,
        ),
        W(
          has('ev_kamera'),
          S`- Ara karar cevapları birer birer dosyaya düştü. Müdürlükten bir flaş bellek: koridor kamerasının yirmi dakikası. Doksan günün yetmiş beşinci gününde.`,
        ),
        W(
          has('ev_santral'),
          S`- Ara karar cevapları dosyaya düştü. Müdürlükten santralin dökümü, bir izin çizelgesiyle birlikte. Kamera görüntüsünü istememiştim; o kutu boştu.`,
        ),
        O(
          S`- Ara karar cevapları dosyaya düşmeye başladı. Müdürlükten ne kamera görüntüsü istemiştim ne santral kaydı; o kutular boştu.`,
        ),
      ],
    }),
    decisionNode('ARA_GIRIS_3', [{ to: 'ARA_GIRIS' }], {
      ...ARA,
      lines: [
        W(
          all(has('ev_cihaz'), has('ev_sonlandirma')),
          S`- Bilirkişinin cihaz raporu geldi; kalın değildi, ama son sayfası ağırdı. Bir de kolluğun sonlandırma yazısı: tarihi 12 Mart. Kararın bitişinden sekiz gün sonra.`,
        ),
        W(has('ev_cihaz'), S`- Bilirkişinin cihaz raporu geldi; kalın değildi, ama son sayfası ağırdı.`),
        W(
          has('ev_sonlandirma'),
          S`- Kolluğun sonlandırma yazısı geldi: tarihi 12 Mart. Kararın bitişinden sekiz gün sonra. Anahtar deliği bir hafta fazla açık kalmış.`,
        ),
        O(S`- Dosya hâlâ ince. Ama bazen ince bir dosya, kalın bir yalandan daha çok şey söyler.`),
      ],
    }),
    story('ARA_GIRIS', {
      ...ARA,
      title: 'Üç hafta',
      background: 'buro',
      lines: B(S`
        - Büro sabahları başka kokar: toner, ıslak palto, Leyla'nın soğuyan çayı. Masamda dosyanın kalınlığı iki katına çıkmıştı; ağırlığı da.
        leyla: İki günün var, Deniz. Gerisi beklemek. Duruşma salonunun dışındaki her konuşma, salonun içinde yeniden yapılır; bunu unutma.
        leyla: Tanıklara dokunma. Şüphelileri kovalama. Gördüğünü bildir, bildirdiğini belgele.
        leyla: Muhbir bu dosyada hem tanık hem bir gün sanık olabilir. Ona ne söylersen, iki dosyaya birden yazılır.
        ~ Bir zarf, bir çekmece, on dakika. Üç haftada o on dakikayı geri saracağım. Ve hiçbir kareyi yanlış kişiye göstermeyeceğim.
      `),
      choices: [
        option('ARA_GIRIS_DEVAM', '“Önce zarfın yolunu kuracağım: kayıtlar, kamera, cihaz.”', {
          effects: [raise('ara_odak_kagit')],
          responses: B(S`
            leyla: İyi. Zarf bir yoldan geldi. Yolun her durağında bir kâğıt vardır. Ama yolun sonunda bir insan olduğunu unutma; onu da salona çağırman gerekecek.
          `),
          next: HUB,
        }),
        option('ARA_GIRIS_B', '“Önce insanlar: Halil, çaycı, muhbir. Kâğıtlar bekler.”', {
          effects: [raise('ara_odak_insan')],
          responses: B(S`
            leyla: İnsanlar bekleyemez, doğru. Ama her insan kendi kâğıdını getirmez. Kâğıtsız bir tanık, kürsüde en çok ağlayan olur; en çok inanılan değil.
          `),
          next: HUB,
        }),
      ],
    }),
    p2.hub({
      ...ARA,
      title: 'Ara',
      background: 'buro',
      lines: p2.dayLines([
        'ARA 1/2 · 2. celseye 14 gün. Zarf odaya Halil yokken girdi. Kimin elinden?',
        'ARA 2/2 · 2. celseye 7 gün. Yarın akşam dosya kapanıyor.',
      ]),
      tabs: [
        {
          id: 't2_kayit',
          label: 'KAYITLAR',
          kind: 'ARCHIVE',
          choices: [
            act('A2_SANTRAL', 'Santral dökümünü incele', 'ARA_SANTRAL', {
              description: 'Dahili aramalar ve izin çizelgesi · 5 deneme',
              visibleWhen: has('ev_santral'),
            }),
            act('A2_CIHAZ', 'Cihaz raporunu incele', 'ARA_CIHAZ', {
              description: 'Bilirkişi raporu · 5 deneme',
              visibleWhen: has('ev_cihaz'),
            }),
            act('A2_SUC', 'Savcılığa suç duyurusu (CMK 158)', 'ARA_SUC', { description: 'Kime, neyle, ne isteyerek?' }),
            free('A2_CIKARIM', 'Çıkarım tahtası', 'ARA_CIKARIM', {
              description: '0 EP · iki kartı birleştir',
              enabledWhen: ref('kart2'),
              lockedReason: 'Tahtada en az iki kart olmalı.',
            }),
            free('A2_LEYLA', 'Leyla’ya danış', 'ARA_LEYLA', {
              description: '0 EP · günde bir kez',
              enabledWhen: cmp(v('leyla_ara'), '<', v('ara_day')),
              lockedReason: 'Leyla bugün başka bir dosyada.',
            }),
          ],
        },
        {
          id: 't2_kisi',
          label: 'KİŞİLER',
          kind: 'PEOPLE',
          choices: [
            act('A2_HALIL', 'Halil', 'ARA_HALIL', { description: 'İkinci celseye hazırlık' }),
            act('A2_MUZAFFER', 'Muzaffer Usta', 'ARA_MUZAFFER', {
              description: '2. kat çay ocağı',
              visibleWhen: any(visited('INV1_KORIDOR'), flag('santral_cay')),
            }),
            act('A2_BAYRAM', 'Kapıdaki muhbir', 'ARA_BAYRAM', { description: 'Büroya kendiliğinden gelen biri' }),
          ],
        },
        {
          id: 't2_yer',
          label: 'YERLER',
          kind: 'SCENE',
          choices: [
            act('A2_KAMERA', 'Kamera karesini incele', 'ARA_KAMERA', {
              description: '10.41.07 · büyüteç 4',
              visibleWhen: has('ev_kamera'),
            }),
            act('A2_ARSIV', 'Müdürlük arşivi', 'ARA_ARSIV', {
              description: 'Ciltler, zimmet defteri · büyüteç 4',
              visibleWhen: visited('INV1_MUDUR'),
            }),
          ],
        },
      ],
      choices: [
        rawChoice('NAVIGATE', 'GO_T', 'DURUŞMAYA GİT · 2. CELSE', {
          role: 'PRIMARY',
          next: 'ARA_SON_1',
          confirm: 'Duruşmaya gidersen ara evresi biter. Emin misin?',
        }),
      ],
    }),
    decisionNode('ARA_DAY_END', [{ when: flag('sinan_goruldu'), to: 'ARA_AKSAM' }, { to: 'ARA_AKSAM2' }], {
      ...ARA,
      onEnter: dayEnd.node.onEnter ?? [],
    }),
    story('ARA_AKSAM', {
      ...ARA,
      title: 'Otopark',
      background: 'sokak_yagmur',
      lines: B(S`
        = ARA 1. GÜNÜN AKŞAMI · 21.30 — BÜRONUN OTOPARKI @sokak_yagmur
        - Yağmur otoparkın beton tavanından damlıyordu. Arabamın kapısını açarken arkamda bir şemsiye açıldı.
        sinan: Avukat hanım! Islanmayın, buyurun. Ben de bu tarafa geliyordum; bir arkadaşın bürosu var yukarıda.
        - Şemsiyeyi başımın üstüne tuttu. Açık renk ceketi yağmurda koyulaşmıştı. Bileğinde saat yeşil yandı, söndü.
        sinan: Mahkeme beni de çağırmış diye duydum. Ne lazımsa abim için. Gerçekten. Yalnız... bazı şeyleri karıştırmayın. Binada herkes herkesin numarasını arar. Bir dahili, bir şey kanıtlamaz.
        sinan: Halil abi çok iyi bir insan. Ama yorgundu. Yorgun insanlar bazen hata yapar. Siz bunu da düşünün. Şeker alır mısınız? Nane.
        ~ Bana hiçbir şey sormadı. Ama neyi bildiğimi tahmin ettiğini söyledi. Ve bir şemsiyenin altında durmak, bir tanıkla konuşmak sayılır mı?
      `),
      choices: [
        option('ARAK_A', 'Teşekkür et, şemsiyenin altından çık; karşılaşmayı tutanağa geçir, savcılığa bildir.', {
          score: { USUL_BILGISI: 30 },
          effects: [raise('sinan_bildirildi')],
          good: 'Tanık olarak çağrılmış biriyle dava hakkında konuşulmaz; kendiliğinden gelen yaklaşım belgelenir ve bildirilir. Avukat tanığı ne yönlendirir ne sorgular.',
          responses: B(S`
            > Mahkemede görüşürüz, Sinan Bey. Size bir şey sormayacağım; siz de bana bir şey anlatmayın.
            - Yağmura çıktım. Arabaya binip kapıyı kapattığımda Sinan hâlâ şemsiyesiyle duruyordu; sonra döndü ve merdivenlere yürüdü.
            - O gece saatini, yerini, söylenen her cümleyi yazdım. Sabah ilk iş, savcılığa ek dilekçe.
            ~ Korkuyu kâğıda geçirince küçülmüyor. Ama başkası da okuyabiliyor.
          `),
          next: 'ARA_GECE1',
        }),
        option('ARAK_B', '“Bir dahili bir şey kanıtlamaz, doğru. Ama 214’te o sabah kaç kişi vardı?”', {
          score: { USUL_BILGISI: -40 },
          effects: [raise('sinan_uyarildi')],
          bad: 'Tanığa duruşmadan önce elindeki delili göstermek, onun ifadesini hazırlamasına yol açar; avukat tanıkla dava hakkında tartışmaz.',
          responses: B(S`
            - Sinan'ın yüzünde bir şey kıpırdadı; bir an. Sonra gülümsedi.
            sinan: Biri, avukat hanım. Bir kişi. Telefonlara ben bakıyordum dedim ya. Herkes beni arardı, ben de herkesi.
            ~ Kartımı gösterdim. O da kartını değiştirdi. Mahkemede artık hazırlıklı gelecek.
          `),
          next: 'ARA_GECE1',
        }),
        option('ARAK_C', 'Konuşma; arabaya bin ve onu takip et, kimle buluşuyor gör.', {
          score: { USUL_BILGISI: -40 },
          effects: [inc('ethics')],
          bad: 'Avukat tanıkları ya da şüphelileri izlemez; bu hem etik bir ihlaldir hem de kişisel güvenliği tehlikeye atar. Gördüğünü belgele, savcılığa bildir.',
          responses: B(S`
            - Yirmi dakika boyunca bir otoparkın çıkışını izledim. Sinan çıkmadı. Belki başka bir kapıdan çıktı; belki hiç inmemişti.
            ~ Bir şemsiyenin peşine düşmek, dosyanın peşine düşmek değil. Leyla bunu duysa bana bir hafta konuşmazdı.
          `),
          next: 'ARA_GECE1',
        }),
      ],
    }),
    story('ARA_GECE1', {
      ...ARA,
      title: 'Leyla’nın kapısı',
      background: 'buro_gece',
      lines: B(S`
        = ARA 1. GÜNÜN GECESİ · 22.40 — ARSLAN HUKUK @buro_gece
        - Büroya döndüğümde Leyla'nın odasının ışığı hâlâ yanıyordu. Kapısı aralıktı. Ceketimden damlayan yağmuru görünce bir şey sormadı; havluyu uzattı.
        leyla: Biri seni bekliyordu, değil mi? Yüzünden belli. Avukatlar korkunca saçlarını düzeltir; sen iki kez düzelttin.
        > Devir-2'deki memur. Şemsiye tuttu. Nane şekeri ikram etti. "Bir dahili bir şey kanıtlamaz" dedi.
        leyla: Kanıtlamaz. Ama o bunu senden önce söylediyse, kanıtlayabileceğini düşünüyor demektir. İnsan, korktuğu cümleyi önce kendisi söyler.
        - Leyla masasındaki ters çerçeveye baktı. Bir an elini uzattı; sonra geri çekti.
        leyla: Yıllar önce bir dosyada bir tanık benim de kapımda bekledi. Ona cevap verdim. O cevap, mahkemede benim ağzımdan değil, onun ağzından okundu. Çarpıtılmış olarak.
        leyla: Tanığa cevap verme, Deniz. Hiçbir zaman. Cevabını kürsüde, kâğıtla ver.
        ~ Leyla geçmişinden bir cümle verdi; bir dosya değil, bir cümle. Bu bile, onun için çok.
      `),
      choices: [cont('ARA_GECE1_DEVAM', 'Yarın', 'ARA_SABAH2', { role: 'PRIMARY' })],
    }),
    story('ARA_SABAH2', {
      ...ARA,
      title: 'Sabah',
      background: 'hastane',
      lines: B(S`
        = ARA 2. GÜN · 07.40 — ŞEHİR HASTANESİ, ACİL SERVİS ÇIKIŞI @hastane
        - Zehra nöbetten çıkarken beni kapıda buldu. Kahve almıştım; iki tane. Birini uzattım. Hemşireler kahveyi sormadan alır; zamanları yoktur sormaya.
        zehra: Gece üç trafik kazası, bir bıçaklama, bir de kalbini kalp krizi sanan bir avukat. Siz değildiniz, merak etmeyin. Bir kadın avukattı; yaşlı. Leyla Hanım'a benziyordu.
        - Güldü; sonra gülmeyi bıraktı.
        zehra: Babam dün gece beni aradı. "Kızım, kütüphanede bir kitap buldum: Ceza Muhakemesi" dedi. "Okuyorum. Avukatın her şeyi doğru yapıyor." Babam kimseye "doğru yapıyor" demez. Size söyleyeyim dedim.
        zehra: Bir de şu: dün akşam evin önünde bir araba bekledi. Yarım saat. Sonra gitti. Plakasını yazdım; hemşireyiz, not alırız.
        ~ Bir araba, yarım saat. Kim olduğunu tahmin etmek kolay; kanıtlamak zor. Ve kanıtlamak benim işim değil; bildirmek benim işim.
        zehra: Savcılığa yazdım. Sizin dediğiniz gibi. Saat, plaka, renk. Artık bunu refleksle yapıyorum. Babamın kızıyım; tutanak tutmayı kandan öğrendim.
      `),
      choices: [
        option('SAB2_A', '“İyi yapmışsın. Kapını kimseye açma; bir şey olursa önce polisi, sonra beni ara.”', {
          effects: [raise('sab2_guvenlik'), inc('trust', 2)],
          responses: B(S`
            zehra: Önce polis, sonra siz. Tamam. Acilde de öyle: önce hayati bulgu, sonra hikâye.
            - Kahvesini bitirdi, bardağı çöp kutusuna attı, kutunun kapağını düzgünce kapattı. Babasının kızı.
          `),
          next: HUB,
        }),
        option('SAB2_B', '“Plakayı bana ver; kimin olduğuna bakarım.”', {
          effects: [raise('sab2_plaka')],
          neutral:
            'Avukatın plaka sorgulama yetkisi yoktur; bildirilen kayıt savcılığın işidir. Bu, yalnızca zaman yer.',
          responses: B(S`
            zehra: Siz mi bakacaksınız? Avukat hanım, sizin işiniz babam. Plaka savcılığın işi. Bunu siz bana öğrettiniz.
            ~ Haklı. Bir hemşire bana mesleğimi hatırlattı. Leyla duysa gülümserdi.
          `),
          next: HUB,
        }),
      ],
    }),
    story('ARA_AKSAM2', {
      ...ARA,
      title: 'Leyla’nın çayı',
      background: 'buro_gece',
      lines: B(S`
        = ARA 1. GÜNÜN AKŞAMI · 21.30 — ARSLAN HUKUK @buro_gece
        - Leyla iki bardak çay koydu, birini soğumaya bıraktı. Masasındaki ters çerçeveye bir an baktı, sonra bana.
        leyla: Kimse sana teşekkür etmeyecek, Deniz. Halil etmeyecek; çünkü kurallı adamlar teşekkürü bir borç sayar. Hâkim etmeyecek; çünkü işi bu.
        leyla: Kendine de etme. Dosyayı bitir.
      `),
      choices: [cont('ARAK2_DEVAM', 'Yarın', 'ARA_SABAH2', { role: 'PRIMARY' })],
    }),
    story('ARA_LEYLA', {
      ...ARA,
      title: 'Leyla',
      background: 'buro',
      onEnter: [set('leyla_ara', v('ara_day'))],
      lines: [
        W(
          cmp(v('ara_day'), '==', 1),
          S`
            leyla: Suç duyurusu bir dilekçe değil, bir harita olmalı. "Şu kişi kötü" demek iftira riskidir. "Şu zarf, şu deste, şu dahili, şu saat" demek soruşturmadır.
            leyla: Bir de muhbir var. Büroya kendiliğinden gelirse, o senin tanığın değildir. Kendi avukatına gider. Sen dinlersin, yönlendirmezsin; yazdırmazsın.
            leyla: Ve kürsüde biri kendini suçlayacak bir soruyla karşılaşırsa, susma hakkı vardır. Başkan bunu ona hatırlatır. Sen ona bunu fırsat bilip yüklenme; belgen konuşsun.
          `,
        ),
        O(S`
          - Leyla pencerenin önündeydi. Dışarıda yağmur Uludağ'ı silmişti; dağ yoktu, yalnızca bulut vardı.
          leyla: Savcı ikinci celsede bir şey deneyecek. Rüşveti tutturamazsa, irtikaba ya da görevi kötüye kullanmaya kayacak. Mahkeme vasfı değiştirecekse, önce sanığa haber vermek zorunda.
          leyla: O an geldiğinde iki yolun var: süre istersin ya da hazırsan hemen cevap verirsin. Hazır olmak, irtikabın neden olmadığını bilmektir: zorlama yok, dosya onun masasında değil.
          leyla: Ve esas savunmanda kanıtlayamadığın bir şeyi iddia etme. Bir eli gösterecekseniz, parmağınızı değil, kâğıdı gösterin.
        `),
      ],
      choices: [cont('ARALEYLA_GERI', 'Masana dön', HUB, { role: 'BACK' })],
    }),
    direct(
      documentExam('ARA_SANTRAL', {
        ...ARA,
        title: 'Santral dökümü',
        background: 'buro',
        hud: ['exam_s'],
        lines: B(S`
          - Santral dökümü sade bir tablo: saat, arayan, aranan, süre. Bir binanın bir sabahki bütün fısıltıları, rakamlara dökülmüş.
          - Altında personel izin çizelgesi; mart ayı, bir tabloda kırk iki isim.
          ~ Rakamlar yalan söylemez. Ama sorulmadan da bir şey söylemez.
        `),
        header: { left: 'NİLÜFER TAPU MÜDÜRLÜĞÜ · SANTRAL', right: '12.03.2027 10.00–11.00' },
        columns: [
          { label: 'SAAT', flex: 1 },
          { label: 'ARAYAN → ARANAN', flex: 1.8 },
          { label: 'SÜRE', flex: 0.8 },
        ],
        rows: [
          row('s1', ['10.12.03', '231 → 214', '1 dk 10 sn']),
          row('s2', ['10.35.08', '214 → 231', '41 sn']),
          row('s3', ['10.00–11.00', '201 · harici (telekonferans)', 'meşgul']),
          row('s4', ['10.40.15', '214 → 102 (çay ocağı)', '9 sn']),
          row('s5', ['İzin çizelgesi', 'Devir Servisi-2 · mart', '—']),
        ],
        tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'Karşılaştır', 'compare')],
        costVar: 'exam_s',
        rules: [
          examine('EX_S2', 'cmp', 's2', {
            discovers: 'clue_214_cagri',
            score: { DELIL_ANALIZI: 150 },
            feedback: {
              title: 'YENİ İPUCU',
              text: '10.35.08: 214’ten 231’e, 41 saniye. Makamın hattı 201 o saat boyunca telekonferansta meşgul. Halil’i indiren çağrı Devir-2’nin masasından.',
              label: '+150 SKOR · Not defterine eklendi',
              tone: 'special',
            },
          }),
          examine('EX_S5', 'mag', 's5', {
            discovers: 'clue_izin_gulay',
            score: { DELIL_ANALIZI: 100 },
            feedback: {
              title: 'YENİ İPUCU',
              text: '“Gülay Erdem — Devir Servisi-2 — yıllık izin — 08.03–19.03.” 12 Mart’ta 214’te tek bir masa doluydu.',
              label: '+100 SKOR · Not defterine eklendi',
              tone: 'special',
            },
          }),
          examine('EX_S4', 'mag', 's4', {
            score: { DELIL_ANALIZI: 50 },
            effects: [raise('santral_cay')],
            feedback: {
              title: 'NOT',
              text: '10.40.15: 214’ten çay ocağına, dokuz saniye. Biri çay istemiş. On dakikanın tam ortasında.',
              label: '+50 SKOR',
              tone: 'info',
            },
          }),
        ],
        miss: examMiss('FB_SANTRAL'),
        finish: { id: 'SANTRAL_BITIR' },
      }),
    ),
    direct(
      documentExam('ARA_CIHAZ', {
        ...ARA,
        title: 'Cihaz raporu',
        background: 'buro',
        hud: ['exam_c'],
        lines: B(S`
          - Bilirkişi raporu dört sayfa. İlk üçü cihazı anlatıyor: marka, model, bellek. Dördüncüsü bir günlük: saniye saniye, cihazın kendi hafızası.
          - Leyla omzumun üstünden baktı. "Cihazlar unutmaz" dedi. "Unutturulurlar."
          ~ Bir arıza, bir günlükte iz bırakır. Bir parmak da.
        `),
        header: { left: 'BİLİRKİŞİ RAPORU · SES KAYIT CİHAZI', right: 'İÇ GÜNLÜK · 12.03.2027' },
        columns: [
          { label: 'SAAT', flex: 1 },
          { label: 'KAYIT', flex: 2.4 },
        ],
        rows: [
          row('c1', ['10.29.51', 'REC — kayıt başladı']),
          row('c2', ['10.38.40–10.39.10', 'Ses: “anlaşılmayan konuşmalar” (kolluk çözümü)']),
          row('c3', ['10.39.12', 'STOP']),
          row('c4', ['—', 'Pil durumu · donanım hata kaydı']),
        ],
        tools: [
          tool('mag', 'Büyüteç', 'magnifier'),
          tool('cmp', 'Karşılaştır', 'compare'),
          tool('chk', 'Doğrula', 'check'),
        ],
        costVar: 'exam_c',
        rules: [
          examine('EX_C2', 'mag', 'c2', {
            discovers: 'clue_fisilti',
            score: { DELIL_ANALIZI: 150 },
            feedback: {
              title: 'YENİ İPUCU',
              text: 'Bilirkişi “anlaşılmayan” otuz saniyeyi filtreyle açmış. Muhbirin yanında ikinci bir ses, fısıltıyla: “Burada değil. Bana ver. Ben bırakırım. Üçüncü çekmece…”',
              label: '+150 SKOR · Not defterine eklendi',
              tone: 'special',
            },
          }),
          examine('EX_C3', 'chk', 'c3', {
            discovers: 'clue_manuel',
            score: { DELIL_ANALIZI: 150 },
            feedback: {
              title: 'YENİ İPUCU',
              text: '“10.39.12 — STOP — fiziksel tuş.” Cihaz kendiliğinden durmamış; biri tuşa basmış. Teknik arıza değil, bir parmak.',
              label: '+150 SKOR · Not defterine eklendi',
              tone: 'special',
            },
          }),
          examine('EX_C4', 'mag', 'c4', {
            score: { DELIL_ANALIZI: 50 },
            effects: [raise('pil_dolu')],
            feedback: {
              title: 'NOT',
              text: 'Pil %68. Donanım hata kaydı: yok. Cihaz yorgun değildi; susturulmuştu.',
              label: '+50 SKOR',
              tone: 'info',
            },
          }),
        ],
        miss: examMiss('FB_CIHAZ'),
        finish: { id: 'CIHAZ_BITIR' },
      }),
    ),
    direct(
      sceneSearch('ARA_KAMERA', {
        ...ARA,
        title: 'Kamera karesi',
        background: 'buro_gece',
        hud: ['taps_c'],
        exposeCounts: true,
        scene: 'sc_kamera',
        lines: B(S`
          - Flaş bellekte yirmi dakikalık bir kayıt. Merdivene dönük bir açı: takipçiler iniyor, çıkıyor; bir çaycı tepsiyle geçiyor. 10.36'da Halil merdivenden iniyor, gözlüğü başının üstünde.
          - 10.41.07'de kadrajın kenarında bir kapı açılıyor. Kareyi dondurdum. Grenli, mavi, sessiz.
          ~ Bir kare, bin kelimeye bedel derler. Bu karenin bin kelimesinden hangisi doğru, bulmam gerek.
        `),
        instruction: 'Karedeki ayrıntılara dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
        costVar: 'taps_c',
        miss: tapMiss('FB_KAMERA'),
        finish: { id: 'KAMERA_BITIR', label: 'Kareyi kapat' },
      }),
    ),
    direct(
      sceneSearch('ARA_ARSIV', {
        ...ARA,
        title: 'Arşiv',
        background: 'depo',
        hud: ['taps_a'],
        exposeCounts: true,
        scene: 'sc_arsiv',
        lines: B(S`
          = NİLÜFER TAPU MÜDÜRLÜĞÜ · ARŞİV @depo
          - Ferda Yalçın kapıyı kendi açtı. "Mahkeme zimmet defterini istedi; ben de buradayım. Prosedür." Bir sandalyeye oturdu, okuma gözlüğünü taktı, beni izledi.
          - Arşiv bodrum kokuyordu: nemli karton, eski mürekkep, toz. Raflar tavana kadar; sırtlarında yıllar. 1987'nin cildi en alt raftaydı.
          ~ Yirmi yıldır kimsenin bakmadığı bir raf. Umarım hâlâ öyledir.
        `),
        instruction: 'Raflara ve masaya dokun. Boş yere dokunmak bir büyüteç hakkı yer.',
        costVar: 'taps_a',
        miss: tapMiss('FB_ARSIV'),
        finish: { id: 'ARSIV_BITIR', label: 'Arşivden çık' },
      }),
    ),
    choiceNode('ARA_SUC', {
      ...ARA,
      title: 'Suç duyurusu',
      background: 'buro',
      prompt: 'Bursa Cumhuriyet Başsavcılığına. Kimin hakkında, hangi somut dayanakla, ne isteyerek?',
      choices: [
        option(
          'SUC_A',
          'Zarfın kaynağı ve 214’ten yapılan çağrı: Devir-2 memuru hakkında soruşturma ve iletişim tespiti',
          {
            effects: [
              ifThen(
                all(has('ded_zarf_kaynagi'), has('ded_tek_kisi')),
                [
                  raise('suc_duyurusu'),
                  score('USUL_BILGISI', 80),
                  mark(
                    'GOOD',
                    'Somut dayanaklı suç duyurusu (CMK 158): zarfın zimmet kaydı, santral ve izin çizelgesi. Şüpheli için iletişimin tespiti hâkim kararıyla istenebilir (CMK 135/6); iftira ve kişiyi hürriyetinden yoksun kılma da değerlendirilir (TCK 267).',
                    'USUL_BILGISI',
                  ),
                ],
                [
                  ifThen(
                    any(has('ded_zarf_kaynagi'), has('ded_tek_kisi')),
                    [
                      raise('suc_duyurusu'),
                      score('USUL_BILGISI', 30),
                      mark(
                        'NEUTRAL',
                        'Suç duyurusu kayda girdi; ama dayanaklarından biri eksikti. Zarfın kaynağını ve çağrının tek bir masadan geldiğini birlikte göstermek gerekirdi.',
                        'USUL_BILGISI',
                      ),
                    ],
                    [
                      mark(
                        'BAD',
                        'Somut dayanak olmadan bir memurun adını suç duyurusuna yazmak iftira riskidir (TCK 267). Önce zarfı ve çağrıyı belgele.',
                        'USUL_BILGISI',
                      ),
                      score('USUL_BILGISI', -30),
                    ],
                  ),
                ],
              ),
            ],
            responses: [
              W(
                all(has('ded_zarf_kaynagi'), has('ded_tek_kisi')),
                S`
                - Leyla dilekçeyi okudu; bir kelimeyi değiştirdi. "Kesin" yazdığım yere "muhtemel" yazdı. "Savcıya kesin deme" dedi; "kesin olanı o söylesin."
                - Üç sayfa. Birinci sayfada bir zarf ve bir deste: 0417, 0401–0450, Devir-2. İkinci sayfada bir dahili ve bir izin çizelgesi: 214, tek masa. Üçüncü sayfada bir talep.
                - Savcılık kalemindeki memur dilekçeyi okudu, kaşlarını kaldırdı. "Bu bir harita, avukat hanım" dedi. Numara verdi.
                ~ Bir isim yazdım. Ama isimden önce iki kâğıt yazdım. Leyla'nın dediği gibi: parmak değil, kâğıt.
              `,
              ),
              W(
                any(has('ded_zarf_kaynagi'), has('ded_tek_kisi')),
                S`
                - Dilekçeyi yazdım. Elimde bir kâğıt vardı, iki değil. Savcılık numara verdi; ama memurun yüzünde "bir tane daha" ifadesi vardı.
                ~ Yarım bir harita, yolu gösterir ama kapıyı göstermez.
              `,
              ),
              O(S`
              - Dilekçeyi yazdım, okudum, yeniden okudum. Bir isim vardı, bir şüphe vardı; bir kâğıt yoktu.
              ~ Göndermedim. Leyla'nın sesi: "Tahmin dilekçeye yazılmaz." Bir isim, bir kâğıt değildir.
            `),
            ],
            next: '$stay',
          },
        ),
        option('SUC_B', 'Müteahhit Ateşoğlu hakkında: bütün bu işin arkasında o var', {
          score: { USUL_BILGISI: -40 },
          effects: [raise('suc_cengiz')],
          bad: 'Ateşoğlu hakkında zaten bir soruşturma var; yeni bir somut olgu göstermeden “arkasında o var” demek bir şey eklemez ve iftira riski taşır (TCK 267).',
          responses: B(S`
            - Dilekçeyi yazarken elim durdu. "Arkasında o var." Hangi kâğıtla? Bir dinlemede adı geçen herkes, her zarfın arkasında mıdır?
            ~ Gönderdim. Gönderdikten sonra bunun bir harita değil, bir öfke olduğunu anladım.
          `),
          next: '$stay',
        }),
        option('SUC_C', 'Muhbir Bayram Öz hakkında iftira suç duyurusu', {
          visibleWhen: has('ded_iki_hikaye'),
          neutral:
            'Tanık kürsüye çıkmadan onun hakkında iftiradan suç duyurusu yapmak, tanığa gözdağı gibi okunabilir. Çelişkisini duruşmada göster; iftira değerlendirmesini savcılık hükümden sonra yapar.',
          responses: B(S`
            leyla: Kürsüye çıkacak bir tanığı kürsüden önce şikâyet etmek, onu susturmaya çalışmak gibi görünür. Çelişkisini salonda göster. Gerisi sonra.
            - Dilekçeyi çekmeceye koydum.
          `),
          next: '$stay',
        }),
        cont('SUC_VER', 'Dilekçeleri gönder', HUB, { role: 'PRIMARY' }),
      ],
    }),
    direct(
      conversation('ARA_HALIL', {
        ...ARA,
        title: 'Halil',
        background: 'ev',
        room: { label: 'EKİNCİLERİN EVİ · BALKON', character: 'halil' },
        lines: [
          W(
            flag('halil_tahliye'),
            S`
              = EKİNCİLERİN EVİ · GEMLİK YOLU · 18.20 @ev
              - Balkonda yeni bir sardunya, saksısının altında bir tabak. Halil saksıyı tam ortaya, tabağı tam altına hizalamıştı.
              - İçeride Zehra uyuyordu; nöbetten çıkmıştı. Halil sesini alçalttı, çay koydu, bardakları tepsinin kenarıyla aynı hizaya getirdi.
              halil: Kızım uyuyor. Altı haftadır ilk kez evde uyuyor; ben içerideyken nöbetten nöbete gidiyormuş. Konuşalım, ama alçak sesle.
            `,
          ),
          O(S`
            = BURSA H TİPİ CEZAEVİ · GÖRÜŞ ODASI · 11.00 @gorus_odasi
            - Halil'in yüzü ince düşmüştü, ama gözlüğü yerindeydi. Kütüphaneden bir kitap getirmişti; kapağında "Kamu Hukuku" yazıyordu.
            halil: Okuyorum. Yirmi yedi yıl uyguladım, hiç okumamıştım. Okuyunca bazı maddeler daha az kurallı görünüyor. Garip.
          `),
        ],
        choices: [
          option('AH_DEFTER', 'Defterinizin nerede olduğunu bilmem gerekiyor.', {
            visibleWhen: not(flag('fact_defter_yeri')),
            score: { SORGULAMA: 30 },
            effects: [raise('fact_defter_yeri')],
            responses: B(S`
              halil: Defter mi? Biliyorsunuz demek. Kızım mı söyledi? Yoksa odama mı baktınız?
              - Bir süre sustu. Sonra sesini daha da alçalttı.
              halil: Arşivde. 1987 ciltlerinin arkasında, duvarla rafın arasında. Siz götürün; usulüne uygun, müdür hanımın yanında. Ben kimseyi suçlamadım; defter suçlasın.
            `),
            next: '$stay',
          }),
          option('AH_SINAN', 'O sabah 214’te tek bir masa doluydu. Sizi arayan oradan aradı.', {
            visibleWhen: any(has('ded_tek_kisi'), has('ded_kameradaki')),
            score: { SORGULAMA: 30 },
            effects: [raise('halil_sinan')],
            responses: B(S`
              - Halil bardağını tepsiye bıraktı. Bardak tepsinin kenarıyla hizalı değildi; düzeltmedi.
              halil/uzgun: Sinan. Biliyordum, sanırım. Biliyordum ama söylemedim; kanıtım yoktu. Kanıtsız isim söylemek, bir adamı benim çekmecemdeki zarf gibi bir yere koymaktır.
              halil: Ona "masaya otururken kuralı da yanına al" demiştim. Sınavı kazandığında. Kural yerine beni almış yanına. Ya da beni masadan kaldırmayı.
              halil: Mahkemede bunu ben söylemeyeceğim, avukat hanım. Siz de söylemeyin. Kâğıtlarınız söylesin.
            `),
            next: '$stay',
          }),
          option(
            'AH_HAZIR',
            'İkinci celsede size yeniden söz verilecek. Ne söyleyeceğinizi size ben söylemeyeceğim; doğruyu, kısa söyleyin.',
            {
              score: { SAVUNMA_STRATEJISI: 40 },
              effects: [raise('halil_hazir'), inc('trust', 3)],
              good: 'Avukat müvekkili ek savunmaya ve son söze hazırlar, ama onun yerine metin yazmaz; doğrunun kısa ve sade söylenmesi en güçlü savunmadır.',
              responses: B(S`
              halil: Kısa. Ben kısa konuşamam ki. Yirmi yedi yıl gerekçe yazdım; her ret kararı iki sayfa.
              > O zaman iki sayfanın ilk cümlesini söyleyin. Gerisini heyet okur.
              - Halil güldü. İlk kez. Kısa, kuru, utangaç bir gülüş.
              halil: İlk cümle. Peki. "Yirmi yedi yılda bir kez kuralı esnettim; o bir iyilikti, bir pazarlık değil." İlk cümle bu.
            `),
              next: '$stay',
            },
          ),
          option('AH_EZBER', 'Size bir metin hazırladım; kürsüde bunu ezbere söyleyin, başka bir şey söylemeyin.', {
            score: { SAVUNMA_STRATEJISI: -40 },
            effects: [raise('halil_ezber')],
            bad: 'Sanığın beyanı onun kendi beyanı olmalıdır; avukatın yazdığı metni ezberletmek beyanın inandırıcılığını yok eder ve heyetin gözünden kaçmaz.',
            responses: B(S`
              - Halil kâğıdı aldı, okudu, katladı, gömlek cebine koydu.
              halil: Ezberlerim. Ben ezberlemeyi bilirim; yönetmelikleri ezberledim. Ama yönetmelikler benim sesimle konuşmazdı.
              ~ Haklı. Ve heyet, bir memurun yönetmelik okur gibi konuştuğunu duyacak.
            `),
            next: '$stay',
          }),
          cont('AH_GERI', 'Kalk', HUB, { role: 'BACK' }),
        ],
      }),
    ),
    direct(
      conversation('ARA_MUZAFFER', {
        ...ARA,
        title: 'Çay ocağı',
        background: 'cay_ocagi',
        room: { label: 'NİLÜFER TAPU MÜDÜRLÜĞÜ · 2. KAT ÇAY OCAĞI', character: 'muzaffer' },
        onFirstEnter: [{ type: 'MEET', character: 'muzaffer' }],
        lines: B(S`
          = 2. KAT ÇAY OCAĞI · 15.10 @cay_ocagi
          - Bir buçuk metrekarelik bir oda: iki ocak, üç demlik, bir tepsi dolusu ince belli bardak. Duvarda bir takvim, takvimin yanında ipe asılı bir defter.
          - Muzaffer Usta beni görünce demliği ocaktan aldı, bir bardak doldurdu, tepsinin üstünde bana doğru itti. Soru sormadı.
          muzaffer: Çay demini bekler, avukat hanım; insan da sırasını. Siz Halil Bey'in avukatısınız. Biliyorum. Bu binada herkes herkesi bilir; çaycı herkesten önce bilir.
          muzaffer: Ama ben çaycıyım. Şahit değil. Halil Bey'i severim; açık demli içer, şekersiz, sabah dokuzda bir, on birde bir. Yirmi yıldır. Başka bir şey bilmem.
        `),
        choices: [
          option('MUZ_DEFTER', 'Defterinize siparişleri yazıyor musunuz? 12 Mart sabahına bakabilir miyiz?', {
            discovers: 'clue_cay_defteri',
            score: { ARASTIRMA: 60 },
            responses: B(S`
              muzaffer: Yazarım. Veresiye var, ayın sonunda hesap. Kimin ne içtiğini yazmazsam, para kimin cebinden çıkacak?
              - İpe asılı defteri indirdi, parmağını yalayıp sayfaları çevirdi. 12 Mart. Bir satırda parmağı durdu.
              muzaffer: On kırk. Arşiv, bir çay. "S" yazmışım; Sinan Bey. Telefonla istedi. On kırk ikide götürdüm. Arşiv boştu. Bardağı masaya bıraktım, kâğıda "boş" yazdım. Sonra kıyamet koptu.
              muzaffer: Bardak orada soğudu. Akşam gidip aldım; içilmemişti.
              ~ Arşivde olduğunu söyleyen bir adam, arşive çay ısmarlıyor. Çay gidiyor; adam orada değil. Bir alibi, bir bardağın içinde soğumuş.
            `),
            next: '$stay',
          }),
          option('MUZ_GORDU', 'O sabah koridorda bir şey gördünüz mü?', {
            score: { SORGULAMA: 30 },
            effects: [raise('muzaffer_gordu')],
            responses: B(S`
              - Muzaffer bir süre demliğe baktı. Demlik kaynamıyordu; ama bakılacak bir şey lazımdı.
              muzaffer: Tepsiyle arşive giderken... kontrol odasının kapısından biri çıktı. Sırtını gördüm. Açık renk bir ceket. Kim olduğunu görmedim; yemin ederim görmedim.
              muzaffer: Sonra polisler geldi. Ben tepsimi aldım, ocağıma döndüm. Çaycı ocağına döner, avukat hanım. Başka yere değil.
              ~ Bir sırt, bir ceket. Muzaffer'in gördüğü, bir yüz değil. Ama bir yüz kadar yerinde duruyor.
            `),
            next: '$stay',
          }),
          option(
            'MUZ_TANIK',
            'Mahkemenin sizi tanık olarak dinlemesini isteyeceğim. Ne söyleyeceğinizi ben belirlemem; gördüğünüzü anlatırsınız.',
            {
              visibleWhen: any(has('clue_cay_defteri'), flag('muzaffer_gordu')),
              score: { USUL_BILGISI: 40 },
              effects: [raise('muzaffer_cagrildi')],
              good: 'Tanığın dinlenmesi mahkemeden istenir (CMK 177, 178); avukat tanığa ne söyleyeceğini söylemez. Tanığın korkusu dinlenir ama yönlendirilmez.',
              responses: B(S`
              muzaffer: Mahkeme mi? Ben... ben bir kere trafik için gittim, o kadar. Kürsüde ne denir, bilmem.
              > Gördüğünüz denir. Fazlası değil. Defterinizi de getirin.
              - Muzaffer defteri ipe geri astı. Sonra indirdi, önlüğünün cebine koydu.
              muzaffer: Halil Bey bana yirmi yıl "günaydın usta" dedi. Bir kez bile atlamadı. Ben de bir kez atlamayayım.
            `),
              next: '$stay',
            },
          ),
          option('MUZ_BASKI', 'Mahkemede yüzünü de gördüğünüzü söyleyin; kim olduğunu ikimiz de biliyoruz.', {
            visibleWhen: flag('muzaffer_gordu'),
            score: { USUL_BILGISI: -150 },
            effects: [inc('ethics', 2), raise('tanik_etkileme')],
            bad: 'Tanığa görmediği bir şeyi söylemesini telkin etmek tanığı etkilemedir (TCK 277) ve ağır meslek ihlalidir (Av.K. 34). Tanık yalan beyana sürüklenir (TCK 272).',
            responses: B(S`
              muzaffer: Ama ben görmedim, avukat hanım. Sırtını gördüm. Yüzünü...
              > Kimin olduğunu biliyoruz. Siz sadece söyleyin.
              - Muzaffer'in elindeki bardak tepsiye çarptı. Bir şey kırılmadı; ama ses, kırılmış gibi çıktı.
              ~ Bir çaycıya yalan söylemeyi öğrettim. Kendi davamı kazanmak için, onun yirmi yıllık "günaydın"ını harcadım.
            `),
            next: '$stay',
          }),
          cont('MUZ_GERI', 'Çayını bitir, çık', HUB, { role: 'BACK' }),
        ],
      }),
    ),
    direct(
      conversation('ARA_BAYRAM', {
        ...ARA,
        title: 'Kapıdaki muhbir',
        background: 'buro',
        room: { label: 'ARSLAN HUKUK · BEKLEME', character: 'bayram' },
        onFirstEnter: [{ type: 'MEET', character: 'bayram' }],
        lines: B(S`
          = ARSLAN HUKUK · 17.40 @buro
          - Kapıda kahverengi deri montlu bir adam duruyordu. Bir eliyle tespih çeviriyor, öbürüyle montunun fermuarını açıp kapatıyordu. Islak saçları alnına yapışmıştı.
          bayram: Abla... avukat abla siz misiniz? Halil Bey'in? Ben Bayram. Bayram Öz. Çocuklarımın üstüne yemin ederim, ben kötü biri değilim.
          bayram: Mahkeme beni çağırmış. Komiser bey "rahat ol, sen ihbarcısın" dedi. Ama ben rahat değilim abla. Gece uyuyamıyorum. Babamı yirmisinde gömdüm. Tarla hâlâ devrolmadı.
          bayram: Ben bir şey söylemek istiyorum ama... kime söyleyeceğimi bilmiyorum. Avukatım yok. Param yok. Herkes bana bir şey söyletti; ben kendi şeyimi söyleyemedim.
          - Tespih elinden kaydı, yere düştü. Eğilip almadı.
          ~ Bu adam benim müvekkilim değil. Bir gün şüpheli olabilir. Bugün ne söylersem, ikimizin dosyasına da yazılır.
        `),
        choices: [
          option(
            'BAY_A',
            'Size avukat olamam ve sizi dinleyemem. Baronun adli yardım bürosuna gidin; söyleyeceğinizi avukatınızla savcılığa ya da mahkemeye söyleyin.',
            {
              score: { USUL_BILGISI: 60 },
              effects: [raise('bayram_avukat')],
              next: HUB,
              good: 'Çıkarı müvekkilinle çatışan kişiye hukuki yardım verilmez, ifadesi alınmaz (Av.K. 38/1-b; TBB Meslek Kuralları). Onu kendi avukatına ve yetkili makama yönlendirmek doğrudur.',
              responses: B(S`
              - Kartvizitimin arkasına baronun adli yardım bürosunun adresini yazdım. Bayram kartı iki eliyle aldı; bir tapu senedi gibi.
              bayram: Avukatım mı olacak? Benim? Tamam. Tamam abla.
              - Kapıdan çıkarken durdu. Ona hiçbir şey sormamıştım; o yine de söyledi, bir yük gibi.
              bayram: Ben o zarfı... Halil Bey'in eline vermedim abla. Odasına bile girmedim. Mahkemede söyleyeceğim. Avukatımla. Söz.
              ~ Bir cümle. Sormadan gelen bir cümle. Tutanağa geçmeyecek; ama kürsüde yeniden kurulabilir. Yeter ki ben onun yerine kurmayayım.
            `),
            },
          ),
          option('BAY_B', 'Oturun. Anlatın; ben yazayım, siz imzalayın. Mahkemeye ben sunarım.', {
            score: { USUL_BILGISI: -30 },
            effects: [raise('bayram_yazdirildi')],
            next: HUB,
            bad: 'Çıkarı müvekkilinle çatışan, kendisi de şüpheli olabilecek birinden yazılı beyan almak meslek kurallarına aykırıdır ve beyanın değerini düşürür; tanık mahkemede dinlenir.',
            responses: B(S`
              - Yazdım. Bayram anlattı; ama anlattığı her cümle bir öncekiyle çarpıştı. Önce zarfı Halil'e vermişti, sonra odaya girmemişti, sonra "bir abi" vardı, sonra yoktu.
              - Sonunda imzaladı. Titrek, büyük harflerle: "BAYRAM."
              ~ Elimde imzalı bir kâğıt var. Savcı bu kâğıdı "avukatın yazdırdığı beyan" diye okuyacak. Haklı da olacak.
            `),
          }),
          option(
            'BAY_C',
            'Mahkemede şunu söyleyin: zarfı Halil Bey’e vermediniz, odaya girmediniz. Başka hiçbir şey söylemeyin.',
            {
              score: { USUL_BILGISI: -150 },
              effects: [inc('ethics', 2), raise('tanik_etkileme')],
              next: HUB,
              bad: 'Tanığa mahkemede ne söyleyeceğini ve neyi söylemeyeceğini dikte etmek tanığı etkilemedir (TCK 277) ve ağır meslek ihlalidir (Av.K. 34).',
              responses: B(S`
              bayram: Başka hiçbir şey mi? Ben... tamam abla. Siz bilirsiniz. Siz avukatsınız.
              - Gitti. Kapı kapandı. Yerde, tespihinin bir boncuğu kalmıştı.
              ~ Ona bir cümle verdim. Doğru cümle olabilir; ama artık onun değil, benim ağzımdan çıkmış bir cümle.
            `),
            },
          ),
        ],
      }),
    ),
    direct(
      deductionBoard('ARA_CIKARIM', {
        ...ARA,
        title: 'Çıkarım Tahtası',
        background: 'buro_gece',
        lines: B(S`
        - Panoya yeni kartlar ekledim: bir santral satırı, bir izin çizelgesi, bir kamera karesi, bir çay defteri. Kırmızı ipler artık bir örümcek ağı gibi.
        ~ Bir zarfın yolu, bir zincirdir. Her halka bir öncekine bağlanırsa, sonunda bir el çıkar ortaya.
      `),
        pool: [
          ...POOL_INV1,
          'clue_214_cagri',
          'clue_izin_gulay',
          'clue_manuel',
          'clue_fisilti',
          'clue_kare_saat',
          'clue_kol_saat',
          'clue_kare_zarf',
          'clue_zimmet',
          'clue_cay_defteri',
        ],
        recipes: [
          ...INV1_RECIPES.map(again),
          fresh(
            'CB_ZARF',
            'clue_barkod',
            'clue_zimmet',
            'ded_zarf_kaynagi',
            'Devir-2’nin destesi',
            'Çekmecedeki zarfın barkodu 0417. Zimmet defteri: 0401–0450, 1 Mart’ta Devir Servisi-2’ye teslim edilmiş. Zarf kontrol servisinin değil.',
          ),
          fresh(
            'CB_TEK',
            'clue_214_cagri',
            'clue_izin_gulay',
            'ded_tek_kisi',
            '214’teki tek masa',
            'Halil’i indiren çağrı 214’ten. O hafta Gülay Erdem izindeydi. 214’te tek bir kişi vardı: Sinan Kaplan.',
          ),
          fresh(
            'CB_TEK2',
            'clue_takvim_214',
            'clue_izin_gulay',
            'ded_tek_kisi',
            '214’teki tek masa',
            'Halil takvimine arayan dahiliyi yazmıştı: 214. O hafta Gülay Erdem izindeydi. 214’te tek bir kişi vardı: Sinan Kaplan.',
          ),
          fresh(
            'CB_KAMERA',
            'clue_kol_saat',
            'clue_sinan_saat',
            'ded_kameradaki',
            'Yeşil ekran',
            'Kontrol odasının kapısını açan elin bileğinde yeşil bir ekran. Sinan Kaplan adımlarını sayarken aynı yeşil ışığa bakıyordu.',
          ),
          fresh(
            'CB_ALIBI',
            'clue_cay_defteri',
            'clue_sinan_arsiv',
            'ded_alibi',
            'Soğuyan çay',
            '“10.30’dan 10.50’ye arşivdeydim.” Ama 10.40’ta arşive ısmarladığı çay 10.42’de boş bir odaya bırakıldı. Arşivde değildi.',
          ),
        ],
        miss: fallback('FB_ARA_CIKARIM', 'COMBINE', {
          repeat: 'ONCE_PER_PARAMS',
          score: { DELIL_ANALIZI: -50 },
          feedback: {
            title: 'Bu ikisi birbirini açıklamıyor',
            text: 'İp gerildi, ama bir şey bağlanmadı.',
            label: `BAĞLANTI YOK · ${minus(50)} SKOR`,
            tone: 'error',
          },
        }),
        finish: { id: 'ARA_CIKARIM_BITIR' },
      }),
    ),
    decisionNode('ARA_SON_1', [{ to: 'ARA_SON_2' }], {
      ...ARA,
      lines: [
        W(
          any(has('ded_tek_kisi'), has('ded_zarf_kaynagi')),
          S`
            = 30 MAYIS 2027 · 23.30 — ARSLAN HUKUK @buro_gece
            - İkinci celseden önceki gece. Panoda artık bir isim var; ama ismin yanında kâğıtlar var. Bir deste, bir dahili, bir izin çizelgesi.
          `,
        ),
        O(S`
          = 30 MAYIS 2027 · 23.30 — ARSLAN HUKUK @buro_gece
          - İkinci celseden önceki gece. Panoda zarfın çekmeceye Halil yokken girdiğini gösteren kartlar var. Kimin elinden girdiği hâlâ boş bir kart.
        `),
      ],
    }),
    decisionNode('ARA_SON_2', [{ to: 'ARA_SON_3' }], {
      ...ARA,
      lines: [
        W(
          has('clue_manuel'),
          S`- Cihaz arızalanmamış; susturulmuş. 10.39.12, fiziksel tuş. Muhbir yarın "kendiliğinden kapandı" derse, cihazın kendi hafızası onu yalanlayacak.`,
        ),
        W(
          all(flag('pil_dolu'), not(has('clue_manuel'))),
          S`- Cihazın pili yüzde altmış sekizdi; arıza kaydı yoktu. Tuşa kimin bastığını göremedim, ama pilin bitmediğini biliyorum.`,
        ),
        W(
          has('clue_fisilti'),
          S`- Ve son otuz saniye: "Burada değil. Bana ver." Muhbirin yanında biri vardı. Bir fısıltının sahibi, yarın kürsüde olabilir.`,
        ),
        W(
          has('ev_kirmizi_defter'),
          S`- Kırmızı defter dosyada. On bir dosya, on bir şerh, on bir kez aynı paraf. Bir adamın neden masadan kaldırılması gerektiğinin listesi.`,
        ),
      ],
    }),
    decisionNode('ARA_SON_3', [{ to: 'ARA_SON' }], {
      ...ARA,
      lines: [
        W(
          flag('sab2_plaka'),
          S`- Zehra'nın plakası hâlâ cebimde. Bakmadım; bakmamam gerekiyordu. Savcılık bakacak. Bir hemşire bana mesleğimi hatırlattı.`,
        ),
        W(
          all(flag('sab2_guvenlik'), flag('ara_odak_insan')),
          S`- Zehra'ya "önce polis, sonra ben" dedim. Bu gece telefonum çalmadı. Bazen iyi haber, sessizliktir.`,
        ),
        W(
          all(flag('ara_odak_kagit'), flag('muzaffer_cagrildi')),
          S`- Önce kâğıtlar dedim; sonunda bir çaycıya vardım. Muzaffer Usta yarın kürsüde, defteri önlüğünün cebinde. Ne söyleyeceğini ben bilmiyorum; bilmemem gerekiyor.`,
        ),
        W(
          flag('ara_odak_insan'),
          S`- Önce insanlar dedim. İnsanlar konuştu; şimdi dosyada her birinin bir kâğıdı var. Yarın kâğıtlar, insanlardan önce kürsüye çıkacak.`,
        ),
        W(
          flag('muzaffer_cagrildi'),
          S`- Muzaffer Usta yarın kürsüde olacak. Defterini önlüğünün cebine koymuştu. Ne söyleyeceğini ben bilmiyorum; bilmemem gerekiyor.`,
        ),
        W(
          flag('bayram_avukat'),
          S`- Bayram'ın artık bir avukatı var. Sabah kartvizitimdeki adrese gitmiş; adli yardım bürosundan genç bir meslektaş aradı, kısa ve resmî. Doğru olan buydu.`,
        ),
        W(
          flag('sinan_cagrildi'),
          S`- Sinan Kaplan yarın tanık kürsüsünde. Yemin edecek. Bir alibisi var, bir saati var, bir nane şekeri var. Yarın hangisinin konuşacağını göreceğiz.`,
        ),
      ],
    }),
    story('ARA_SON', {
      ...ARA,
      title: 'Son gece',
      background: 'buro_gece',
      lines: B(S`
        - Leyla ceketini giyerken kapıda durdu. Elinde tuttuğu şemsiyeyi açmadı.
        leyla: Yarın kürsüye çıkan herkes bir şey anlatacak. Muhbir korkusunu, memur alibisini, savcı düzeni. Sen yalnızca kâğıdı anlat.
        leyla: Ve hatırla: bir tanığı yıkmak, bir sanığı kurtarmak değildir. Yıkıntının altından ne çıkacağını bilmeden hiçbir duvarı itme.
        - Gitti. Büroda tek başıma kaldım. Panoya son kez baktım: dört soru. Kayıt hangi kapının deliğinden alındı? Halil neredeydi? Muhbir neyi kime verdi? Zarf kimin işine yarar?
        - Üç sorunun altında artık kâğıtlar vardı. Dördüncüsünün altında bir boşluk ve bir soru işareti; Halil'in takviminde olduğu gibi.
        ~ Leyla dördüncüyü en sona sakla demişti. Yarın son gün.
        - Saat birde telefonum titredi. Zehra.
        zehra{phone}: Babam yarın için kravatını üç kez değiştirdi. Sonunda annemin aldığını taktı. Size söylememi istedi: "Kâğıtlar hazırsa ben hazırım."
      `),
      choices: [
        option('SON_A', '“Kâğıtlar hazır. Ona iyi uyumasını söyle.”', {
          effects: [inc('trust', 2), raise('son_mesaj')],
          responses: B(S`
            zehra{phone}: Uyumaz. Ama söylerim. Siz de uyuyun; acil servis hemşiresi olarak söylüyorum.
          `),
          next: 'T_KORIDOR',
        }),
        option('SON_B', 'Cevap verme. Panoya son bir kez bak.', {
          responses: B(S`
            - Panoya baktım. Bir saat. İplerin hiçbiri yer değiştirmedi. Ama bir kartın köşesinde, kendi el yazımla: 10.41.07.
          `),
          next: 'T_KORIDOR',
        }),
      ],
    }),
  ],
  triggers: [dayEnd.trigger],
  discoveryPaths: [...giris.discoveryPaths, ...dayEnd.discoveryPaths],
};
