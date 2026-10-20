import {
  all,
  any,
  cmp,
  cont,
  conversation,
  deductionBoard,
  decisionNode,
  deliver,
  documentExam,
  examine,
  fallback,
  flag,
  has,
  ifThen,
  inc,
  met,
  nav,
  not,
  option,
  otherwise,
  raise,
  recipe,
  row,
  says,
  score,
  set,
  story,
  tool,
  v,
  when,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart, ChoiceDef, NodeDef } from '../../../tools/content/src/kit/index.js';
import { INV_POOL, baseRecipes, boardMiss } from './investigation-1.js';
import { ARA, D, Nx, S, T, araAct, card, p2, ph } from './shared.js';

// 70-investigation-2: iki celse arası (2 gün × 4 EP). Yığınsız hub: her etkinlik doğrudan ARA_HUB'a döner
// (motor sınırı; Dava #07 notu 2). Gelen raporlar (ATK, Kriminal, eczane), Ece'nin kararı, polis memuru, masa 7'deki
// video, Bora'yla yüzleşme, ek dilekçe; gün sonunda Onur kapıda.

const HUB = 'ARA_HUB';

/** Kitin `$return` dönüşlerini doğrudan hub'a çevirir. */
function toHub<T extends NodeDef>(node: T): T {
  return {
    ...node,
    choices: node.choices.map((ch: ChoiceDef) => (ch.next === '$return' ? { ...ch, next: HUB } : ch)),
  };
}

const arrivals = deliver('ARA_GIRIS_1', [
  {
    evidence: 'ev_kriminal',
    requires: any(flag('req_kriminal'), flag('h1_kriminal')),
    hint: 'Kırık kadehin Kriminal incelemesini dilekçede ya da duruşmada iste.',
  },
  {
    evidence: 'ev_eczane',
    requires: any(flag('req_eczane'), flag('h1_eczane')),
    hint: 'Eczanenin kaydını eczacı saklarken mahkemeden iste.',
  },
]);

const missExam = (id: string) =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle bu satırda yeni bir şey çıkmadı.',
      label: '−20 SKOR',
      tone: 'error',
    },
  });

const ex = (
  id: string,
  toolId: string,
  target: string,
  pts: number,
  title: string,
  text: string,
  effects: ChoiceDef['effects'] = [],
  discovers?: string,
) =>
  examine(id, toolId, target, {
    ...(discovers === undefined ? {} : { discovers }),
    effects: [score('DELIL_ANALIZI', pts, 'delil'), ...(effects ?? [])],
    feedback: {
      title,
      text,
      label: discovers === undefined ? `+${pts} SKOR` : `+${pts} SKOR · Not defterine eklendi`,
      tone: 'special',
    },
  });

export const investigation2: CasePart = {
  nodes: [
    // --- Giriş: gelen zarflar ---
    decisionNode('ARA_GIRIS_1', [{ to: 'ARA_GIRIS_2' }], {
      ...ARA,
      title: 'Ara',
      onEnter: [{ type: 'DISCOVER', evidence: 'ev_atk' }, ...arrivals.effects, ...p2.start()],
      lines: says(
        card('ON GÜN SONRA — ARSLAN HUKUK', 'buro'),
        Nx('Adli Tıp’ın zarfı salı sabahı geldi. Kahverengi, mühürlü, köşesinde bir kurum numarası. Ayakta açtım.'),
        T('Mühürlü zarflar ağırdır. İçlerinde bir adamın özgürlüğü ya da bir avukatın yanılgısı vardır.'),
      ),
    }),
    decisionNode('ARA_GIRIS_2', [{ to: 'ARA_GIRIS_3' }], {
      ...ARA,
      lines: [
        when(
          all(has('ev_kriminal'), has('ev_eczane')),
          Nx(
            'Aynı hafta iki zarf daha: Kriminal Polis Laboratuvarının raporu ve eczanenin kaydını taşıyan bir CD, bilirkişi notuyla.',
          ),
          T('Üç zarf. Masamda üç ayrı gece duruyordu ve üçü de aynı geceydi.'),
        ),
        when(
          has('ev_kriminal'),
          Nx('Perşembe Kriminal Polis Laboratuvarının raporu geldi. Kırık bir sapın üç sayfalık hayat hikâyesi.'),
          T('Bir kadeh, kimin elinde kırıldığını unutmaz. İzleri unutmaz.'),
        ),
        when(
          has('ev_eczane'),
          Nx(
            'Perşembe eczanenin kaydı geldi: bir CD, bilirkişinin bir sayfalık notu. Eczacı dükkânı devretmeden göndermiş.',
          ),
          T('Kimse sormadığı için saklanan bir kayıt. Bursa’da bazen insanlar kurumlardan daha iyi hatırlar.'),
        ),
        otherwise(
          Nx('Başka zarf gelmedi. Kadeh emanette, eczanenin kaydı belki silindi, belki bir çekmecede bekliyor.'),
          T('İstemediğim şey gelmez. Kurumlar kendiliğinden cevap vermez; soru bekler.'),
        ),
      ],
    }),
    decisionNode('ARA_GIRIS_3', [{ to: 'ARA_GIRIS' }], {
      ...ARA,
      lines: [
        when(
          flag('eczane_kopya_istendi'),
          Nx(
            'Eczacının mahkemeye yazdığı üst yazının altına el yazısıyla bir not düşülmüştü: “Avukat hanım kopya istemişti, vermedim.”',
          ),
          T('Dürüst bir eczacı, dürüst olmayan bir talebimi tutanağa geçirdi. Hak ettim.'),
        ),
        when(
          flag('teklif_red'),
          Nx(
            'Tolga Şen’den bir kart: “Meslektaşım, teklifimizi reddettiğiniz için teşekkür ederim. Dürüst olmak gerekirse, kabul etseydiniz şaşırırdım.”',
          ),
          T('Bir iltifat mı, bir uyarı mı? Tolga Şen ikisini aynı zarfa koymayı seviyor.'),
        ),
        when(
          flag('teklif_kabul'),
          Nx(
            'Tolga Şen’in bürosundan bir faks: “Teklifimiz geçerliliğini yitirmiştir.” Kimse kabul etmemişti zaten; Bora etmemişti.',
          ),
        ),
        otherwise(
          Nx('Bora her sabah dokuzda arıyor, “bir şey var mı” diyor, cevabı beklemeden “tamam” diyip kapatıyordu.'),
        ),
      ],
    }),
    story('ARA_GIRIS', {
      ...ARA,
      title: 'Bir ay',
      background: 'buro',
      lines: says(
        Nx('Telefon çaldı. Bora. Sesi her zamankinden kısa.'),
        {
          speaker: 'bora',
          style: 'phone',
          text: 'Mal sahibi geldi. Kirayı sordu. Barı açmazsam üç ay sonra kapı onun.',
        },
        { speaker: 'bora', style: 'phone', text: 'Açayım mı? Açarsam herkes bakar. Açmazsam herkes konuşur.' },
        D('Duruşmaya kadar açma. Sonra ne istersen.'),
        { speaker: 'bora', style: 'phone', text: 'Duruşmaya kadar. Peki.' },
        Nx('Kapattı. Bora telefonu hep önce kapatırdı; bir şey söylenmemiş kalsın diye.'),
        Nx('Leyla odama girdi, bir sandalye çekti. Bunu çok nadir yapardı; genelde kapıda dururdu.'),
        S('leyla', 'İlk celse bir tanışmadır. İkincisi bir yüzleşme. Tanık kürsüye çıkınca elinde ne olacak?'),
        S('leyla', 'Bir ayın var ama gerçekte iki günün. Gerisi yazışma ve bekleme.'),
        S('leyla', 'Bir de şu: karşı taraf bu bir ayda boş durmayacak. Tolga Şen boş durmaz.'),
        D('Tolga Şen boş durmaz. Biliyorum.'),
        S(
          'leyla',
          'Bilmen yetmez. Onun ne yapacağını değil, senin ne yapmayacağını bil. Tanığa gitmeyeceksin. Katılana gitmeyeceksin. Kapına gelen olursa kapıyı kapatacaksın; nazikçe.',
        ),
        Nx('Kalktı. Sandalyeyi yerine itti; tam olarak eski yerine, bir santim bile kaydırmadan.'),
        T('İki gün. Raporlar, tanıklar, bir video belki. Her kapıyı açamam; hangisini açacağımı seçmeliyim.'),
      ),
      choices: [cont('ARAGIRIS_DEVAM', 'Ara dönemine başla', HUB, { role: 'PRIMARY' })],
    }),

    // --- Hub ---
    p2.hub({
      ...ARA,
      title: 'Ara dönem',
      background: 'sokak_gece',
      lines: [
        when(
          cmp(v('ara_day'), '==', 1),
          card('ARA GÜN 1/2 · İKİNCİ CELSEYE 12 GÜN', 'sokak_gece'),
          Nx('Hedef: Raporlar ne diyor? Ece gelecek mi? Masa 7’deki ışık bir kayıt mıydı?'),
        ),
        otherwise(
          card('ARA GÜN 2/2 · İKİNCİ CELSEYE 5 GÜN', 'sokak_gece'),
          Nx('Hedef: Kürsüye ne götüreceksin? Tanığa soracağın her soruya bir kâğıt.'),
        ),
      ],
      tabs: [
        {
          id: 't_ara_kisi',
          label: 'KİŞİLER',
          kind: 'PEOPLE',
          choices: [
            araAct('B_ECE', 'Ece', 'ARA_ECE', { visibleWhen: met('ece'), description: 'Kampüs · bir telefon gelmiş' }),
            araAct('B_SINAN', 'Polis memuru Sinan Kurt', 'ARA_SINAN', { description: 'Karakol · tutanağı yazan' }),
            araAct('B_DEFNE', 'Masa 7: D. Yurt', 'ARA_DEFNE', {
              visibleWhen: any(has('ded_video'), has('clue_story'), has('clue_masa7')),
              description: 'Telefon',
            }),
            araAct('B_BORA', 'Bora', 'ARA_BORA', { description: 'Kapalı bar · akşam' }),
          ],
        },
        {
          id: 't_ara_arsiv',
          label: 'ARŞİV',
          kind: 'ARCHIVE',
          choices: [
            araAct('B_ATK', 'Adli Tıp kesin raporu', 'ARA_ATK', { description: '5 deneme' }),
            araAct('B_KRIM', 'Kriminal rapor', 'ARA_KRIM', {
              visibleWhen: has('ev_kriminal'),
              description: '4 deneme',
            }),
            araAct('B_ECZ', 'Eczane kaydı', 'ARA_ECZ', { visibleWhen: has('ev_eczane'), description: '4 deneme' }),
            araAct('B_DIL', 'Ek delil dilekçesi', 'ARA_DIL', { description: 'İki talep hakkı' }),
            nav('B_CIKARIM', 'Çıkarım tahtası', 'ARA_CIKARIM', { description: '0 EP · ipuçlarını birleştir' }),
            nav('B_LEYLA1', 'Leyla’ya danış', 'ARA_LEYLA1', {
              maxUses: 1,
              visibleWhen: cmp(v('ara_day'), '==', 1),
              description: '0 EP · günde bir kez',
            }),
            nav('B_LEYLA2', 'Leyla’ya danış', 'ARA_LEYLA2', {
              maxUses: 1,
              visibleWhen: cmp(v('ara_day'), '==', 2),
              description: '0 EP · günde bir kez',
            }),
          ],
        },
      ],
      quickTalk: { character: 'bora', line: '“Bir şey var mı? … Tamam.”', choices: ['B_BORA'] },
      choices: [
        nav('GO_T', 'DURUŞMAYA GİT · 2. CELSE', 'ARA_SON_1', {
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen ara dönem biter. Emin misin?',
        }),
      ],
    }),

    // --- Gün sonu: Onur kapıda ---
    story('ARA_DAY_END', {
      ...ARA,
      title: 'Kapıdaki adam',
      background: 'sokak_yagmur',
      onEnter: [inc('ara_day', 1), set('ara_ap', 4)],
      lines: [
        when(
          flag('onur_tehdit'),
          card('GECE 22.40 — ARSLAN HUKUK’UN KAPISI', 'sokak_yagmur'),
          Nx(
            'Büroyu kilitliyordum. Merdivenin dibinde, saçağın altında biri. Şemsiyesiz, takım elbiseli, kol saatine bakıyor.',
          ),
          S('onur', 'Beni tehdit etmiştiniz. Biliyorum. Yine de geldim.', 'uzgun'),
          S('onur', 'Konuşmak istiyorum. Ama Tolga Bey bilmesin. Serkan Bey… hiç bilmesin.'),
          T('Kaldırımda bir tanık. Ve ben bu tanığı bir kez yanlış yoldan zorladım. İkinci kez yanlış yapmamalıyım.'),
        ),
        otherwise(
          card('GECE 22.40 — ARSLAN HUKUK’UN KAPISI', 'sokak_yagmur'),
          Nx(
            'Büroyu kilitliyordum. Merdivenin dibinde, saçağın altında biri. Şemsiyesiz, takım elbiseli, kol saatine bakıyor.',
          ),
          S('onur', 'Avukat hanım. Rahatsız ediyorum. Açıkçası… konuşmak istiyorum.', 'uzgun'),
          S(
            'onur',
            'Mahkemede soracağınız şeyler var, biliyorum. Ben… terfi bekliyorum. Anlıyor musunuz? Ama uyuyamıyorum.',
          ),
          T(
            'Karşı tarafın tanığı, gece, yağmurda, kapımda. Ne söylersem söyleyeyim, yarın Tolga Şen’in dilekçesinde okuyabilirim.',
          ),
        ),
      ],
      choices: [
        option('ARAG_DOGRU', '“Size yardım edemem. Bir avukatla savcılığa gidin; mahkemede de doğruyu söyleyin.”', {
          score: { USUL_BILGISI: 80 },
          effects: [raise('onur_vicdan')],
          good: 'Doğru: müdafi karşı tarafın tanığından ifade alamaz, onu yönlendiremez (TCK 277; TBB Meslek Kuralları). İfadesini düzeltmek isteyen tanığın yeri savcılık ya da mahkemedir; yalan tanıklıkta etkin pişmanlık (TCK 274) onun haklarıdır, benim pazarlık konum değil.',
          responses: says(
            S('onur', 'Savcılık mı? O zaman… o zaman herkes bilir.'),
            D('Evet. Herkes bilir. Mahkemede de soracağım; ama yalnızca orada.'),
            Nx('Bir süre yağmura baktı. Sonra başını salladı, bir şey anlamış gibi değil, bir şeyden vazgeçmiş gibi.'),
            S('onur', 'Mahkemede görüşürüz o zaman.'),
            T('Gitti. Ona yardım etmedim. Belki ettim. Bunu kürsüde öğreneceğim.'),
          ),
          next: 'ARA_SABAH2',
        }),
        option('ARAG_KAYIT', '“İçeri gelin. Anlatın, telefonuma kaydedeyim; mahkemeye ben sunarım.”', {
          score: { USUL_BILGISI: -80 },
          effects: [raise('onur_kayit'), inc('ethics')],
          bad: 'Müdafi karşı tarafın tanığından gizlice beyan alıp kayda geçiremez; tanığı etkileme şüphesi doğar (TCK 277), kayıt da tartışmalı bir delil olur. Doğru yol: tanığı savcılığa ve mahkemeye yönlendirmek.',
          responses: says(
            Nx('İçeri girdi. Telefonu masaya koydum, kırmızı düğmeye bastım. Anlatmaya başladı. Sonra durdu.'),
            S('onur', 'Bu… bu kayıt ne olacak? Tolga Bey bunu görecek mi? Ben… vazgeçtim.', 'saskin'),
            Nx('Kalktı, çıktı. Telefonda iki dakikalık bir kayıt kaldı: bir adamın nefesi ve “açıkçası” kelimesi.'),
            T('Elimde bir kayıt var. Ve onu hiçbir mahkemeye gösteremem.'),
          ),
          next: 'ARA_SABAH2',
        }),
        option('ARAG_VAAT', '“Serkan’ın aleyhine konuşursanız size bir şey olmaz. Söz veriyorum.”', {
          score: { USUL_BILGISI: -80 },
          effects: [raise('onur_vaat'), inc('ethics')],
          bad: 'Tanığa beyanına göre sonuç vaat etmek onu etkilemektir (TCK 277) ve verilemeyecek bir sözdür: yalan tanıklığın sonucuna savcılık ve mahkeme karar verir.',
          responses: says(
            S('onur', 'Söz mü? Siz savcı mısınız?', 'kizgin'),
            S('onur', 'Herkes bana bir şey vaat ediyor. Serkan Bey terfi, siz af. Kimse bana doğruyu söylemiyor.'),
            Nx('Yağmura çıktı. Şemsiyesizdi; hiç acele etmedi.'),
            T('Haklıydı. Ben de bir şey vaat ettim. Doğruyu değil.'),
          ),
          next: 'ARA_SABAH2',
        }),
      ],
    }),

    // --- Ara gün 2 sabahı: asansörde savcı ---
    decisionNode('ARA_SABAH2', [{ to: 'ARA_SABAH2B' }], {
      ...ARA,
      title: 'Asansör',
      lines: says(
        card('ERTESİ SABAH 08.40 — ADLİYE ASANSÖRÜ', 'adliye'),
        Nx(
          'Başka bir dosya için adliyedeydim. Asansörün kapısı kapanırken bir el uzandı: Savcı Orhan Baysal. Elinde bir simit, bir çay, kolunun altında dosyalar.',
        ),
        S('savci', 'Bora Yalçın’ın müdafii. Günaydın. Katınız kaç?'),
        D('Üç.'),
        S('savci', 'Benimki de.'),
        Nx(
          'Asansör yavaş yükseliyordu. Adliye asansörleri hep yavaştır; sanki herkese son bir kez düşünme fırsatı verirler.',
        ),
      ),
    }),
    decisionNode('ARA_SABAH2B', [{ to: 'ARA_SABAH2C' }], {
      ...ARA,
      lines: [
        when(
          all(flag('krim_avuc'), flag('atk_derece')),
          S('savci', 'Kriminal raporu okudum. Adli Tıp’ı da. Birinci derece, avuç izi kavrama konumunda.'),
          S('savci', 'Tutanak böyle demiyordu. Ama ben tutanakla yaşamıyorum, müdafi. Dosyayla yaşıyorum.'),
          T(
            'Bir savcının bunu bir asansörde söylemesi. Kürsüde söyleyeceğinin provası mı, yoksa yalnızca yorgunluk mu?',
          ),
        ),
        when(
          flag('krim_avuc'),
          S('savci', 'Kriminal raporu okudum. Avuç izi kavrama konumunda. İlginç.'),
          S('savci', 'Tutanak böyle demiyordu. Ama ben tutanakla yaşamıyorum. Dosyayla yaşıyorum.'),
        ),
        when(
          flag('atk_derece'),
          S(
            'savci',
            'Adli Tıp birinci derece demiş. Katılan vekili bundan memnun olmayacak. Bir rapor daha getirir muhtemelen.',
          ),
          T('Savcı da biliyor. Tolga’nın elindeki mavi dosyayı bütün adliye biliyor.'),
        ),
        otherwise(
          S('savci', 'Dosyanızı okuyorum. Basit bir dosya sanıyordum. Değilmiş galiba.'),
          T('“Galiba.” Savcıların en temkinli kelimesi. Bir kapı aralığı kadar.'),
        ),
      ],
    }),
    decisionNode('ARA_SABAH2C', [{ to: 'ARA_SABAH2D' }], {
      ...ARA,
      lines: [
        when(
          flag('ecz_ece'),
          S('savci', 'Bir de eczane kaydında önlüklü bir kız var. Saat 01.52. Dosyada yok. Kim o?'),
          D('Gelecek celse öğreneceksiniz, Sayın Savcı. Ya da öğrenmeyeceksiniz; kararı ona ait.'),
          S('savci', 'Kararı ona ait. Hm. Doğru cevap.'),
        ),
        when(
          flag('ecz_birlikte'),
          S('savci', 'Eczane kaydı. Saat 22.10. Tanığımız katılanla kol kola. Tanık “tanımam” demişti.'),
          S('savci', 'Bunu kürsüde siz mi soracaksınız, ben mi?'),
          D('Siz sorarsanız daha ağır gelir.'),
          S('savci', 'Ben kimseye ağır gelmek için sormam, müdafi. Merak ettiğim için sorarım.'),
        ),
        otherwise(S('savci', 'Tanığımız Onur Kılıç’ı gelecek celse dinleyeceğiz. Hazır olun. Ben hazırım.')),
      ],
    }),
    story('ARA_SABAH2D', {
      ...ARA,
      title: 'Asansör',
      background: 'adliye',
      lines: says(
        Nx('Kapı açıldı. Savcı çıkarken durdu, döndü.'),
        S(
          'savci',
          'Bir şey söyleyeyim: sanık polisi kendisi aramış. Kırk iki yıldır bu binadayım; bıçaklayan da arar bazen. Ama kapıda bekleyen az olur.',
        ),
        Nx('Koridora yürüdü. Simidinden bir ısırık aldı, dosyalarını kolunun altında düzeltti.'),
        T(
          'Yorgun adamlar tutanağa güvenir, demiştim. Belki yanılmıştım. Belki yorgun adamlar yalnızca önlerine konan kâğıda güvenir; doğru kâğıdı koymak bana kalır.',
        ),
      ),
      choices: [cont('ARASABAH2_DEVAM', 'Ara dönemin ikinci günü', HUB, { role: 'PRIMARY' })],
    }),

    // --- Ece ---
    conversation('ARA_ECE', {
      ...ARA,
      title: 'Ece',
      background: 'kafe',
      room: { label: 'KAMPÜS · KÜTÜPHANE MERDİVENLERİ', character: 'ece' },
      lines: [
        when(
          flag('ece_yonlendirildi'),
          card('GÖRÜKLE KAMPÜSÜ · KÜTÜPHANE MERDİVENLERİ', 'kafe'),
          Nx('Ece merdivenin en üst basamağında oturuyordu. Elinde telefon; ekran kararmış.'),
          S(
            'ece',
            'Babam aradı. Biri ona söylemiş. “Kızın barda çalışıyormuş, mahkemelik olmuş.” Kim söyler bunu? Kim?',
            'uzgun',
          ),
          S(
            'ece',
            'Ben mahkemede sizin dediğinizi diyeceğim. Kesin gördüm, tekme yoktu. Ezberledim. Gece rüyamda söylüyorum.',
          ),
          T('Ezberledi. Benim cümlelerimi. Bir tanığın ağzına koyduğum her kelime, onun değil benim yalanım.'),
        ),
        when(
          flag('ece_cekildi'),
          card('GÖRÜKLE KAMPÜSÜ · KÜTÜPHANE MERDİVENLERİ', 'kafe'),
          Nx('Ece merdivenin en üst basamağında oturuyordu. Beni görünce kalkmadı.'),
          S(
            'ece',
            'Siz demiştiniz ya, zorunlu değil diye. Gelmeyeceğim. Babam da aradı zaten; biri ona söylemiş.',
            'uzgun',
          ),
          T(
            'Ona yanlış bir şey söyledim. Kolay bir yalan değildi; bir bilgi hatasıydı. Ama bir tanığa yanlış bilgi vermek de onu yönlendirmektir.',
          ),
        ),
        otherwise(
          card('GÖRÜKLE KAMPÜSÜ · KÜTÜPHANE MERDİVENLERİ', 'kafe'),
          Nx('Ece merdivenin en üst basamağında oturuyordu. Elinde telefon; ekran kararmış.'),
          S(
            'ece',
            'Babam aradı. Biri ona söylemiş. “Kızın barda çalışıyormuş, mahkemelik olmuş.” Kim söyler bunu? Gız, kim?',
            'uzgun',
          ),
          S('ece', '“Eve dön” dedi. Bir cümle. Sonra kapattı.'),
          T(
            'Biri Kütahya’ya bir telefon açmış. Kimin açtığını tahmin edebiliyorum; kanıtlayamıyorum. Ve bu, şimdi, önemli olan değil.',
          ),
          S(
            'ece',
            'Babam yirmi iki yıldır tek bir kere bana bağırmadı. Dün bağırmadı da. Sadece “eve dön” dedi. Bağırsaydı daha iyiydi.',
          ),
          Nx(
            'Merdivenlerden öğrenciler iniyordu; kitaplar, kahveler, kahkahalar. Ece onlara baktı, sanki başka bir şehirden bakıyormuş gibi.',
          ),
        ),
      ],
      choices: [
        option('ARAE_DUZELT', '“Sana yanlış yaptım. Benim cümlelerimi unut. Gördüğünü söyle, görmediğini söyleme.”', {
          visibleWhen: flag('ece_yonlendirildi'),
          score: { SAVUNMA_STRATEJISI: 60 },
          effects: [raise('ece_duzeltildi'), raise('ece_kesin')],
          good: 'Geç ama doğru: yönlendirmeyi geri almak tanığın kendi anlatımına dönmesini sağlar. İlk hata yine de bir meslek kuralı ihlaliydi (Av.K. md. 34; TCK 277 riski) ve sorulursa tanık bunu anlatacak.',
          responses: says(
            S('ece', 'Unutayım mı? Ama siz… “kesin gördün” dediniz.', 'saskin'),
            D('Yanlış dedim. Yerde ne olduğunu görmediysen “görmedim” de. Kadehi kim kırdıysa onu söyle. Bu kadar.'),
            S('ece', '…Gördüğüm şey az. Ama doğru.'),
            S('ece', 'Gelirim. Babam duysun. Benim gördüğümü duysun, sizinkini değil.'),
            T('Kendi sesine döndü. Benim yüzümden ondan çalınan bir şeyi geri verdim. Hepsini değil.'),
          ),
          next: HUB,
        }),
        option(
          'ARAE_BILGI',
          '“Sana yanlış söyledim: mahkeme çağırırsa gelmek zorundasın. Ama orada sadece gördüğünü sorarlar.”',
          {
            visibleWhen: flag('ece_cekildi'),
            score: { HUKUKI_BILGI: 60 },
            effects: [raise('ece_tanik_olur'), raise('ece_kesin')],
            good: 'Düzeltme yerinde: çağrılan tanık gelmek ve tanıklık etmekle yükümlüdür (CMK 43, 44); tanığa doğru bilgi vermek onu etkilemek değildir.',
            responses: says(
              S('ece', 'Zorunlu mu? Yani… kaçamam.', 'saskin'),
              S('ece', 'Peki. O zaman gelirim. Ama ne gördüysem o. Fazlası yok.'),
              D('Fazlası olmasın zaten.'),
              T('Bir yanlışı düzelttim. Çağrılması için hâlâ bir dilekçe lazım.'),
            ),
            next: HUB,
          },
        ),
        option(
          'ARAE_KARAR',
          '“Kararı sen vereceksin. Çağrılırsan sadece gördüğünü anlatırsın; yanında olurum, ağzına bir şey koymam.”',
          {
            visibleWhen: not(any(flag('ece_yonlendirildi'), flag('ece_cekildi'))),
            score: { SAVUNMA_STRATEJISI: 80 },
            effects: [
              ifThen(
                any(flag('ece_tanik_olur'), cmp(v('ece_guven'), '>=', 2), flag('ece_bilek_foto')),
                [raise('ece_kesin')],
                [raise('ece_dusunecek')],
              ),
            ],
            good: 'Doğru sınır: tanığın kararı kendisinindir; müdafi ancak tanıklığın ne olduğunu ve doğruyu söyleme yükümlülüğünü anlatabilir (CMK 43 vd.; TCK 272 yalan tanıklık).',
            responses: [
              when(
                any(flag('ece_tanik_olur'), cmp(v('ece_guven'), '>=', 2), flag('ece_bilek_foto')),
                S('ece', 'Babam duyunca… önce bağıracak. Sonra susacak. Sonra bir hafta konuşmayacak. Bilirim onu.'),
                S('ece', 'Ama Bora abi benim yüzümden ceza alırsa, ben onu ömür boyu konuşamam. Gelirim.'),
                S(
                  'ece',
                  'Babama da söyleyeceğim. Telefonda değil; gidip söyleyeceğim. Otobüs bileti aldım bile. Hafta sonu Kütahya.',
                ),
                Nx(
                  'Merdivenden kalktı. Elindeki telefonun ekranı aydınlandı: “Baba” yazıyordu. Açmadı. Ama kapatmadı da.',
                ),
                T('Bir karar verdi. Benim değil. Böyle olmalıydı.'),
              ),
              otherwise(
                S('ece', 'Bilmiyorum. Gerçekten bilmiyorum. Çağırırlarsa… bakarız.'),
                T('Bakarız. Tanıkların en dürüst cevabı.'),
              ),
            ],
            next: HUB,
          },
        ),
        option('ARAE_BASKI', '“Gelmezsen Bora içeri girebilir. Bunu taşıyabilir misin?”', {
          score: { SAVUNMA_STRATEJISI: -60 },
          effects: [raise('ece_baski'), raise('ece_kesin'), inc('ethics')],
          bad: 'Tanığa suçluluk duygusuyla baskı yapmak onu etkilemektir (TCK 277 riski; Av.K. md. 34). Gelse bile kürsüde baskıyı anlatabilir.',
          responses: says(
            S('ece', 'Taşıyamam. Biliyorsunuz taşıyamam. O yüzden söylüyorsunuz.', 'kizgin'),
            S('ece', 'Gelirim. Ama sizin için değil.'),
            T('Geldi. Bir tanık kazandım ve bir insanın gözünde bir şey kaybettim.'),
          ),
          next: HUB,
        }),
        option('ARAE_BABA', '“İstersen babanla ben konuşayım.”', {
          neutral:
            'İyi niyetli ama yerinde değil: tanığın ailesiyle avukatın konuşması, tanık üzerinde ayrı bir baskı gibi algılanabilir.',
          responses: says(
            S('ece', 'Siz mi? Babamla? Gız, yok yok. O sizi görürse beni hiç affetmez.'),
            T('Yardım etmek istedim. Bazen yardım, bir kapıyı daha çalmaktır; o kapı açılmamalıydı.'),
          ),
          next: '$stay',
        }),
      ],
    }),

    // --- Polis memuru ---
    conversation('ARA_SINAN', {
      ...ARA,
      title: 'Sinan Kurt',
      background: 'karakol',
      room: { label: 'SETBAŞI KARAKOLU · BEKLEME SALONU', character: 'sinan' },
      onFirstEnter: [{ type: 'MEET', character: 'sinan' }],
      lines: says(
        card('SETBAŞI KARAKOLU — ÖĞLEDEN SONRA', 'karakol'),
        Nx(
          'Florasan vızıldıyordu, o gecenin florasanı. Genç bir memur elinde bir dosyayla bekleme salonuna geldi. Yirmili yaşlarının sonu, yüzü uykusuz.',
        ),
        S('sinan', 'Avukat hanım? Sinan Kurt. O geceki tutanağı ben yazdım. Komiserim izin verdi, beş dakika.'),
        S('sinan', 'Ne soracağınızı biliyorum aslında.', 'uzgun'),
        T('Ne soracağımı biliyor. Bir memurun bunu söylemesi, kendine de aynı soruyu sorduğunu gösterir.'),
        S(
          'sinan',
          'O gece ilk olay yerimdi. Yani… tek başıma tuttuğum ilk tutanak. Komiserim “kısa yaz” dedi. Kısa yazdım.',
        ),
        Nx('Dosyayı açtı, kapadı. Bir şey göstermek istiyordu ama izin almamıştı; göstermedi.'),
      ),
      choices: [
        option('ARAS_FOTO', '“Fotoğraf 7’yi siz mi çektiniz? Sap neredeydi?”', {
          score: { SORGULAMA: 60 },
          discovers: 'clue_sap',
          effects: [raise('sinan_aciklama')],
          responses: says(
            S(
              'sinan',
              'Ben çektim. Sap, yerdeki adamın sağ elinin yanındaydı. Elinin hemen yanında. Kan elden sapa gidiyordu.',
            ),
            S(
              'sinan',
              'Tutanağa “tezgâh önü” yazdım. Gece ikiydi, adam kanıyordu, ambulans bağırıyordu. Yanlış değil ama… eksik.',
            ),
            S('sinan', 'Fotoğraf 7’ye bakın. Fotoğraf doğrusunu söylüyor.'),
            T('“Fotoğraf doğrusunu söylüyor.” Bir polis, kendi tutanağına karşı kendi fotoğrafını öne çıkarıyor.'),
            S('sinan', 'Mahkeme çağırırsa gelirim. Ne gördüysem onu söylerim. Komiserim kızar. Kızsın.'),
          ),
          next: '$stay',
        }),
        option('ARAS_TUTANAK', '“Mahkemede tutanağın yanlış olduğunu söyleyeceksiniz, değil mi? Söylemeniz lazım.”', {
          score: { USUL_BILGISI: -60 },
          effects: [inc('ethics')],
          bad: 'Tanık olabilecek bir memura mahkemede ne söyleyeceğini dikte etmek onu etkilemektir (TCK 277). Sorulursa ne gördüğünü anlatır; avukat bunu önceden kurgulayamaz.',
          responses: says(
            S(
              'sinan',
              'Ben ne gördüysem onu söylerim. Kimse bana ne diyeceğimi söylemesin, avukat hanım. Siz de.',
              'kizgin',
            ),
            T('Haklı. Bir memurun dürüstlüğünü kendi davama koşmaya çalıştım.'),
          ),
          next: '$stay',
        }),
        option('ARAS_ONUR', '“O gece tanık Onur Kılıç’ın ifadesini kim aldı? Nasıldı?”', {
          score: { SORGULAMA: 30 },
          effects: [raise('fact_onur_tuttu')],
          responses: says(
            S(
              'sinan',
              'Komiser yardımcısı aldı. Ben kapıdaydım. Tanık… çok hazırdı. Daha soru sorulmadan anlatıyordu.',
            ),
            S(
              'sinan',
              'Bir de şu: müşteki sedyeye binerken tanığa “Onur, arabayı sen al” dedi. Arabayı. Kimse tutanağa yazmadı; kimse sormadı.',
            ),
            T('“Onur, arabayı sen al.” Hiç tanımadığın birine arabanı bırakır mısın?'),
            S(
              'sinan',
              'Bir de… tanık ifadesini verirken “ayırmaya çalıştım” dedi ya. Ben içeri girdiğimde sanığın kolundan tutuyordu. Müştekinin değil. Sanığın.',
            ),
          ),
          next: '$stay',
        }),
        cont('ARAS_BITIR', 'Teşekkür et ve ayrıl', HUB, { role: 'BACK' }),
      ],
    }),

    // --- Masa 7 ---
    conversation('ARA_DEFNE', {
      ...ARA,
      title: 'Defne Yurt',
      background: 'buro',
      room: { label: 'TELEFON', character: 'defne' },
      onFirstEnter: [{ type: 'MEET', character: 'defne' }],
      lines: says(
        card('ARSLAN HUKUK — TELEFON', 'buro'),
        Nx('Adisyondaki isim, bir kart slipi, bir sosyal medya araması. Üçüncü çalışta açtı; arkada bir kafe sesi.'),
        ph('defne', 'Efendim? Gölge mi? O kavga gecesi mi? Aa, evet, oradaydık. Ne korkunçtu.'),
        ph(
          'defne',
          'Hikâye mi? Evet, çekmiştim, Burcu’nun doğum günüydü. Yirmi dört saatte silindi tabii. Arşivde duruyor sanırım.',
        ),
        T('Arşivde. On beş saniye. İçeride kamera yoktu ama bir telefon tezgâha bakıyordu.'),
        ph(
          'defne',
          'Ama bakın, ben mahkemeye falan gitmem. Sınav haftam var. Burcu’nun annesi de bilmiyor o gece bara gittiğimizi.',
        ),
        T(
          'Herkesin bir babası, bir annesi, birinin bilmediği bir gece. Setbaşı’nda bir bar, bir şehrin sırlarını tutan bir kasaydı.',
        ),
      ),
      choices: [
        option('ARAD_INDIR', '“Hesabınızdan ben kendim indirebilir miyim?”', {
          neutral:
            'Arşivlenmiş bir hikâye yalnızca hesap sahibinde durur; delil sahibinden, onun rızasıyla ve mahkeme kanalıyla gelmelidir.',
          responses: says(
            ph('defne', 'İndirmek mi? Arşiv bende, kimse göremez ki. Siz nasıl indireceksiniz?'),
            T('Doğru. Bir delilin yolunu ben kısaltamam.'),
          ),
          next: '$stay',
        }),
        option(
          'ARAD_DOGRU',
          '“Videoyu bir dilekçeyle mahkemeye gönderebilirsiniz. Adınız geçecek; bilirkişi inceleyecek. Gizleyemem.”',
          {
            score: { USUL_BILGISI: 80 },
            effects: [raise('defne_video')],
            good: 'Doğru: üçüncü kişinin elindeki kayıt, onun gönüllü teslimiyle ya da mahkemenin istemiyle dosyaya girer (CMK 206/1); kimliğinin gizlenemeyeceğini söylemek dürüstlüktür. Bütünlüğü bilirkişi inceler (CMK 63).',
            responses: says(
              ph('defne', 'Adım geçecek mi? Hmm.'),
              ph(
                'defne',
                'O adam çok kötü bağırıyordu. Barmen hiç bağırmadı, biliyor musunuz? Bunu hatırlıyorum. Hiç.',
              ),
              ph(
                'defne',
                'Hatta… o adam masamıza da gelmişti, Burcu’ya “güzel kız” dedi, gözlüklü arkadaşı onu çekti götürdü. “Abi yapma” dedi. Abi, dedi.',
              ),
              ph(
                'defne',
                'Tamam. Gönderin dilekçe örneğini, yarın adliyeye bırakırım. Ama Burcu’nun yüzü bulanık olsun, olur mu?',
              ),
              T('Burcu’nun yüzü bulanık olacak. Tezgâh net olsun yeter.'),
              Nx(
                'Telefonu kapattıktan sonra bir süre ekrana baktım. Bir doğum günü videosu. On beş saniye. İki kadın gülüyor, bir mum sönüyor; arka planda bir adamın hayatı.',
              ),
            ),
            next: HUB,
          },
        ),
        option('ARAD_GIZLI', '“Bana gönderin, ben mahkemeye veririm. Adınız hiç geçmez, söz.”', {
          score: { USUL_BILGISI: -40 },
          effects: [raise('defne_video'), raise('defne_kirgin')],
          bad: 'Verilemeyecek bir söz: kaydın kaynağı ve kimin çektiği bilirkişi incelemesinde ve duruşmada ortaya çıkar. Delili elden almak da bütünlük tartışmasına kapı açar.',
          responses: says(
            ph('defne', 'Söz mü? Peki. WhatsApp’tan atarım.'),
            Nx(
              'Akşam bir video geldi. On beş saniye. Dilekçeye ekledim; dilekçenin ikinci satırında Defne Yurt’un adı yazıyordu. Başka türlü olamazdı.',
            ),
            T('Bir söz verdim ve tutamayacağımı bile bile verdim.'),
          ),
          next: HUB,
        }),
      ],
    }),

    // --- Bora ---
    conversation('ARA_BORA', {
      ...ARA,
      title: 'Kapalı bar',
      background: 'depo_gece',
      room: { label: 'GÖLGE · AKŞAM', character: 'bora' },
      lines: [
        when(
          all(met('ece'), flag('fact_ece_neden')),
          card('GÖLGE — AKŞAM, KEPENK İNİK', 'depo_gece'),
          Nx('Bora tezgâhın arkasında, karanlıkta oturuyordu. Işığı yakmamıştı. Önünde bir bardak su.'),
          S('bora', 'Kızın babası aramış. Kütahya’dan. Sana söylemiştim, korktuğum buydu.'),
          S(
            'bora',
            'Onu korudum sandım, kendimi korumuşum. Sana o gün söyledim. Şimdi bir daha söylüyorum, çünkü hâlâ doğru.',
          ),
          T('Bir adam aynı itirafı ikinci kez yapınca, artık itiraf değil; bir karar oluyor.'),
        ),
        when(
          met('ece'),
          card('GÖLGE — AKŞAM, KEPENK İNİK', 'depo_gece'),
          Nx('Bora tezgâhın arkasında, karanlıkta oturuyordu. Işığı yakmamıştı. Önünde bir bardak su.'),
          S('bora', 'Kızın babası aramış. Ece söyledi. Biri Kütahya’ya telefon açmış.'),
          S('bora', 'Ben gönderdim onu. Benim yüzümden. “Seni burada görmedim” dedim. Şimdi bütün Kütahya görüyor.'),
          T('Kendini koruduğunu sandığı yerde başkasını açıkta bırakmış. Bunu bilmek bir yara gibi; sargı tutmuyor.'),
        ),
        otherwise(
          card('GÖLGE — AKŞAM, KEPENK İNİK', 'depo_gece'),
          Nx('Bora tezgâhın arkasında, karanlıkta oturuyordu. Işığı yakmamıştı. Önünde bir bardak su.'),
          S(
            'bora',
            'Bir ay. Kira iki ay birikti. Mal sahibi “satarsın” diyor. Neyi satayım? Bir tezgâh, bir fotoğraf.',
          ),
          T('Bir barın sahibi değil, bir barın bekçisi gibi oturuyordu.'),
        ),
      ],
      choices: [
        option('ARAB_KAMERA', '“Mahkemede kamera bozuktu dedik. Düzeltelim; ek beyanla doğrusunu yazalım.”', {
          visibleWhen: flag('kamera_yalan'),
          score: { SAVUNMA_STRATEJISI: 80 },
          effects: [raise('kamera_duzeltildi')],
          good: 'Doğru: gerçeğe aykırı bir beyanı müdafi düzeltmekle yükümlüdür (Av.K. md. 34). Ruhsat saatine aykırılık idari bir yaptırımdır; mahkemede ortaya çıkan bir yalan ise bütün savunmayı yakar.',
          responses: says(
            S('bora', 'Ruhsat gider.'),
            D('Belki. Ruhsat geri alınır. Güven geri alınmaz.'),
            Nx('Uzun bir sessizlik. Sonra burnundan nefes verdi.'),
            S('bora', 'Yaz. Ben imzalarım.'),
          ),
          next: '$stay',
        }),
        option('ARAB_ECE', '“Ece tanıklık edip etmeyeceğine kendi karar verecek. Sen de ben de ona saygı duyacağız.”', {
          visibleWhen: met('ece'),
          score: { SAVUNMA_STRATEJISI: 40 },
          effects: [raise('bora_ece_kabul'), inc('trust', 5)],
          responses: says(
            S('bora', 'Gelirse… ben ona ne diyeceğim?'),
            D('Hiçbir şey. Teşekkür bile etme salonda. Bakma bile. Tolga her bakışı bir anlaşma diye okur.'),
            S('bora', 'Bakmayacağım. Zor ama.'),
            S(
              'bora',
              'Sonra. Sonra çok şey var. Sigortasını yaptıracağım. Babası gelirse çay koyacağım. Gelmezse ben gideceğim.',
            ),
            T('Bir adamın “sonra”sı, onun umududur. Bora’nın umudu bir çay bardağı kadar küçük ve sağlamdı.'),
          ),
          next: '$stay',
        }),
        option('ARAB_SOZ', '“Son sözünü sana yazmayacağım. Ne düşünüyorsan onu söyle; kısa olsun.”', {
          effects: [inc('trust', 3)],
          neutral: 'Son söz sanığındır (CMK 216/3); müdafi kısa ve dürüst olmasını öğütleyebilir, metin yazmaz.',
          responses: says(
            S('bora', 'Kısa olur. Ben uzun konuşamam zaten.'),
            S('bora', 'Bir şey diyeceğim ama. Ona sen karışma.'),
          ),
          next: '$stay',
        }),
        cont('ARAB_BITIR', 'Barı karanlığıyla bırak', HUB, { role: 'BACK' }),
      ],
    }),

    // --- Belgeler ---
    toHub(
      documentExam('ARA_ATK', {
        ...ARA,
        title: 'Adli Tıp kesin raporu',
        hud: ['exam4'],
        background: 'buro',
        lines: says(
          Nx('Dört sayfa. Kurum dili: kısa, kuru, kesin. Her cümlenin sonunda bir nokta, bir mühür kadar ağır.'),
          T('Geçici raporun bilmediğini kesin rapor bilir. Ya da bilmediğini kesin bir dille söyler.'),
          Nx(
            'İlk sayfada Serkan’ın bir yakın çekim fotoğrafı: burnu, bandı, gözlerinin altında sararmış morluklar. Son sayfada bir bilek; üstünde, ayakkabı tabanı genişliğinde, soluk bir leke.',
          ),
        ),
        header: { left: 'ADLİ TIP KURUMU · KESİN RAPOR', right: 'MUAYENE: 3 KASIM + DOSYA' },
        columns: [
          { label: 'BULGU', flex: 1 },
          { label: 'SONUÇ', flex: 2.6 },
        ],
        rows: [
          row('a_tani', ['Tanı', 'Nazal kemikte kırık'], {
            mag: { cells: ['Tanı', 'Nazal kemikte deplasmansız lineer kırık · septum intakt'], tone: 'special' },
          }),
          row('a_derece', ['Derece', 'Hayat fonksiyonlarına etkisi'], {
            mag: { cells: ['Derece', 'Kemik kırığının hayat fonksiyonlarına etkisi HAFİF (1)'], tone: 'special' },
          }),
          row('a_el', ['Sağ el', 'Ayada kesi, sütur'], {
            mag: {
              cells: ['Sağ el', 'Ayada transvers 4 cm kesi · kesici-delici değil, kesici kenarla'],
              tone: 'special',
            },
          }),
          row('a_bilek', ['Sağ bilek', 'Ekimoz'], {
            mag: {
              cells: ['Sağ bilek', 'Dorsalde 3×5 cm ekimoz · bası / ezilme ile uyumlu · kırık yok'],
              tone: 'special',
            },
          }),
          row('a_govde', ['Gövde ve baş', 'Muayene: olağan'], {
            cmp: {
              cells: ['Gövde ve baş', 'Kaburga, karın, baş: travma bulgusu YOK (tekme izi yok)'],
              tone: 'special',
            },
          }),
        ],
        tools: [tool('mag', 'Büyüteç', 'magnifier'), tool('cmp', 'İfadeyle karşılaştır', 'compare')],
        costVar: 'exam4',
        rules: [
          ex(
            'EX_A_DERECE',
            'mag',
            'a_derece',
            100,
            'HAFİF (1)',
            'Birinci derece. Kırığın cezaya etkisi en alt basamakta. Karşı taraf bunu sevmeyecek; muhtemelen başka bir rapor arayacak.',
            [raise('atk_derece')],
          ),
          ex(
            'EX_A_BILEK',
            'mag',
            'a_bilek',
            150,
            'BASI İZİ',
            'Sağ bileğin üstünde, yukarıdan bastırılmış bir ezilme izi. Tekme değil; bir ayağın ağırlığı.',
            [],
            'clue_bilek',
          ),
          ex(
            'EX_A_GOVDE',
            'cmp',
            'a_govde',
            100,
            'TEKME İZİ YOK',
            'Onur “yerde yatan adamı tekmeledi” diyor. Kaburgada, karında, başta tek bir iz yok. Tekme iz bırakır.',
            [raise('atk_govde')],
          ),
          ex(
            'EX_A_TANI',
            'mag',
            'a_tani',
            60,
            'SEPTUM İNTAKT',
            'Deplasmansız, septum sağlam. Acilin radyoloji notuyla aynı. Bir “septum deviasyonu” iddiası buraya çarpar.',
            [],
            'clue_deplasman',
          ),
        ],
        miss: missExam('FB_ATK'),
        finish: { id: 'ATK_BITIR' },
      }),
    ),
    toHub(
      documentExam('ARA_KRIM', {
        ...ARA,
        title: 'Kriminal rapor',
        hud: ['exam5'],
        background: 'buro',
        lines: says(
          Nx(
            'Kriminal Polis Laboratuvarı. Üç sayfa, iki fotoğraf: kırık bir sapın yakın çekimi, büyütülmüş bir avuç izi.',
          ),
          T('Bir camın üstünde kalan şey, bir insanın sözünden daha az yalan söyler.'),
          Nx(
            'Raporun sonunda uzmanın el yazısıyla küçük bir not: “İnceleme talebi geç gelmiştir; delil emanette iyi korunmuştur.” Biri emanete iyi bakmış. Kimse sormamış ama iyi bakmış.',
          ),
        ),
        header: { left: 'KRİMİNAL POLİS LABORATUVARI', right: 'EMANET NO: 2025/1187' },
        columns: [
          { label: 'İNCELEME', flex: 1 },
          { label: 'SONUÇ', flex: 2.6 },
        ],
        rows: [
          row('k_sap', ['Sap gövdesi', 'Avuç izi tespit edildi'], {
            mag: {
              cells: ['Sap gövdesi', 'Kanlı avuç izi · KATILANA ait · kavrama konumunda (kırık uç dışa)'],
              tone: 'special',
            },
          }),
          row('k_taban', ['Taban', 'Kısmi parmak izi'], {
            mag: { cells: ['Taban', 'Kısmi parmak izi · SANIĞA ait · servis tutuşu ile uyumlu'], tone: 'special' },
          }),
          row('k_kan', ['Kan', 'İki ayrı profil'], {
            mag: { cells: ['Kan', 'Kırık uçta SANIĞA, sap gövdesinde KATILANA ait kan'], tone: 'special' },
          }),
          row('k_talep', ['Talep', 'Mahkeme ara kararı · emanetten teslim']),
          row('k_kirilma', ['Kırılma', 'Darbe ile kırılma'], {
            mag: {
              cells: ['Kırılma', 'Sert ve keskin bir kenara yandan darbe · bilinçli kırma ile uyumlu'],
              tone: 'special',
            },
          }),
        ],
        tools: [tool('mag', 'Büyüteç', 'magnifier')],
        costVar: 'exam5',
        rules: [
          ex(
            'EX_K_SAP',
            'mag',
            'k_sap',
            150,
            'KAVRAMA',
            'Sapın gövdesinde katılanın kanlı avuç izi, kırık uç dışa bakacak şekilde. Bir silahı tutar gibi.',
            [raise('krim_avuc')],
          ),
          ex(
            'EX_K_TABAN',
            'mag',
            'k_taban',
            100,
            'SERVİS',
            'Bora’nın izi yalnızca tabanda: kadehi masaya koyan bir barmenin izi. Savcılık bunu “sanığın kadehi” diye okuyacaktı.',
            [raise('krim_taban')],
          ),
          ex(
            'EX_K_KAN',
            'mag',
            'k_kan',
            100,
            'İKİ KAN',
            'Kırık uçta Bora’nın kanı. Kadeh Bora’yı kesti; sonra onu tutan eli. Sıra bu.',
          ),
          ex(
            'EX_K_KIRILMA',
            'mag',
            'k_kirilma',
            60,
            'BİLİNÇLİ KIRMA',
            'Kadeh düşüp kırılmamış; bir kenara vurularak kırılmış.',
          ),
        ],
        miss: missExam('FB_KRIM'),
        finish: { id: 'KRIM_BITIR' },
      }),
    ),
    toHub(
      documentExam('ARA_ECZ', {
        ...ARA,
        title: 'Eczane kaydı',
        hud: ['exam6'],
        background: 'buro',
        lines: says(
          Nx(
            'Bilirkişinin notu ve dört ekran görüntüsü. Siyah beyaz, köşede saat. Gölge’nin kapısı, sarı lambanın altında.',
          ),
          T('Bir eczane kamerası ilaç hırsızı bekler. Bu gece başka bir şey görmüş.'),
        ),
        header: { left: 'GÖKDERE ECZANESİ · KAYIT', right: '2–3 KASIM' },
        columns: [
          { label: 'SAAT', flex: 0.8 },
          { label: 'GÖRÜNTÜ', flex: 2.8 },
        ],
        rows: [
          row('e_2210', ['22.10', 'İki erkek bara giriyor'], {
            mag: {
              cells: ['22.10', 'İki erkek kol kola, gülüşerek giriyor · gözlüklü olan kapıyı tutuyor'],
              tone: 'special',
            },
          }),
          row('e_0138', ['01.38–01.50', 'Kapı kapalı']),
          row('e_0152', ['01.52', 'Arka sokaktan bir kadın'], {
            mag: {
              cells: ['01.52', 'Önlüklü genç bir kadın arka sokaktan koşuyor · elini yüzüne kapatmış'],
              tone: 'special',
            },
          }),
          row('e_0205', ['02.05', 'Ambulans ve polis'], {
            mag: { cells: ['02.05', 'Ambulans · polis aracı · kapıda sanık, sol kolunda havlu'], tone: 'special' },
          }),
        ],
        tools: [tool('mag', 'Büyüteç', 'magnifier')],
        costVar: 'exam6',
        rules: [
          ex(
            'EX_E_2210',
            'mag',
            'e_2210',
            150,
            'KOL KOLA',
            'Saat 22.10. Serkan Aydemir ve gözlüklü bir adam kol kola. Gözlüklü olan kapıyı tutuyor. “Bara tek başıma gittim.”',
            [raise('ecz_birlikte')],
          ),
          ex(
            'EX_E_0152',
            'mag',
            'e_0152',
            100,
            'ÖNLÜK',
            'Önlüklü bir kadın, arka sokaktan. Dosyada olmayan biri kayıtta var.',
            [raise('ecz_ece')],
          ),
          ex(
            'EX_E_0205',
            'mag',
            'e_0205',
            60,
            'HAVLU',
            'Polis geldiğinde kapıda Bora. Sol kolunda kanlı bir havlu. Kaçmamış; beklemiş.',
          ),
        ],
        miss: missExam('FB_ECZ'),
        finish: { id: 'ECZ_BITIR' },
      }),
    ),

    // --- Ek dilekçe ---
    story('ARA_DIL', {
      ...ARA,
      title: 'Ek delil dilekçesi',
      background: 'buro_gece',
      hud: ['ara_hak'],
      lines: says(
        Nx('İkinci bir dilekçe. Hâkim ilkini okudu; ikincisini daha kısa okuyacak. İki talep, iki gerekçe.'),
        T('Neyi unuttum? Kimi çağırmadım? Bir ay sonra unuttuğum her şey kürsüde boş bir sandalye olacak.'),
      ),
      choices: [
        option('ARADIL_ECE', 'Ece Tan’ın tanık olarak dinlenmesi', {
          visibleWhen: all(any(flag('ece_kesin'), flag('ece_tanik_olur')), not(any(flag('req_ece'), flag('h1_ece')))),
          cost: [{ var: 'ara_hak', amount: 1 }],
          score: { USUL_BILGISI: 60 },
          effects: [raise('ara_ece')],
          good: 'Yerinde: olayı gören tanığın dinlenmesi duruşmadan önce de yazılı olarak istenebilir (CMK 177/1, 206/1).',
          next: '$stay',
        }),
        option('ARADIL_SINAN', 'Polis memuru Sinan Kurt’un tanık olarak dinlenmesi', {
          visibleWhen: flag('sinan_aciklama'),
          cost: [{ var: 'ara_hak', amount: 1 }],
          score: { USUL_BILGISI: 50 },
          effects: [raise('ara_sinan')],
          good: 'Yerinde: tutanağı tutan memurun dinlenmesi, tutanakla fotoğraflar arasındaki farkı açıklar (CMK 206/1; tutanak aksi ispatlanabilir bir delildir).',
          next: '$stay',
        }),
        option('ARADIL_VIDEO', 'Masa 7’deki videonun bilirkişi incelemesi', {
          visibleWhen: flag('defne_video'),
          cost: [{ var: 'ara_hak', amount: 1 }],
          score: { USUL_BILGISI: 60 },
          effects: [raise('video_bilirkisi')],
          good: 'Yerinde: dijital kaydın bütünlüğü ve kesintisizliği bilirkişiyle tespit edilir (CMK 63); karşı taraf “montaj” diyemez.',
          next: '$stay',
        }),
        option('ARADIL_KRIM', 'Kırık kadehin Kriminal incelemesi', {
          visibleWhen: not(any(flag('req_kriminal'), flag('h1_kriminal'))),
          cost: [{ var: 'ara_hak', amount: 1 }],
          score: { USUL_BILGISI: 40 },
          effects: [raise('ara_kriminal')],
          good: 'Geç ama yerinde: rapor duruşma gününe yetişebilir (CMK 206/1).',
          next: '$stay',
        }),
        option('ARADIL_ONUR', 'Tanık Onur Kılıç hakkında yalan tanıklıktan suç duyurusu', {
          cost: [{ var: 'ara_hak', amount: 1 }],
          score: { USUL_BILGISI: -40 },
          bad: 'Erken ve yersiz: tanık henüz mahkemede yeminli beyan vermedi; yalan tanıklık (TCK 272) beyanın mahkemede verilmesiyle tartışılır. Duruşmadan önce tanığa yönelik suç duyurusu onu yıldırma girişimi gibi görünür.',
          category: 'USUL_BILGISI',
          next: '$stay',
        }),
        cont('ARADIL_GONDER', 'Dilekçeyi gönder', HUB, { role: 'BACK' }),
      ],
    }),

    // --- Tahta ---
    toHub(
      deductionBoard('ARA_CIKARIM', {
        ...ARA,
        title: 'Çıkarım Tahtası',
        background: 'buro_gece',
        lines: says(Nx('Pano bir ay öncekinden kalabalık. Yeni bir kart: bir bilek, bir ezilme izi. İki kart seç.')),
        pool: [...INV_POOL, 'clue_bilek'],
        recipes: [
          ...baseRecipes('AB'),
          recipe('AB_BILEK', 'clue_bilek', 'clue_if_tekme', {
            effects: [
              ifThen(not(has('ded_bilek')), [score('DELIL_ANALIZI', 300, 'delil')]),
              { type: 'DISCOVER', evidence: 'ded_bilek' },
            ],
            feedback: {
              title: 'Ayağın ağırlığı',
              text: 'Gövdede tek tekme izi yok; yalnızca sağ bileğin üstünde bir bası izi. “Yerde tekmeledi” denen an, sapı tutan bileğe basıp camı bıraktırmaktı.',
              label: 'YENİ DELİL · +300 SKOR',
              tone: 'success',
            },
          }),
        ],
        miss: boardMiss('FB_ARA_CIKARIM'),
        finish: { id: 'ARA_CIKARIM_BITIR' },
      }),
    ),

    // --- Leyla ---
    story('ARA_LEYLA1', {
      ...ARA,
      title: 'Leyla',
      background: 'buro',
      lines: [
        when(
          has('clue_bilek'),
          S('leyla', 'Bilek. İyi buldun. Ama dikkat: bileğe basmak bir hareket. Hâkim soracak, “gerekli miydi?”'),
          S(
            'leyla',
            'Meşru müdafaa saldırı sürdüğü sürece geçerlidir. Elinde cam olan, yerde de olsa, saldırmayı sürdürüyor olabilir. Bunu göstermen gerek.',
          ),
          S(
            'leyla',
            'Gösteremezsen ikinci kapı var: sınırın heyecan ve korkuyla aşılması. Ceza verilmez ama fiil hukuka uygun da sayılmaz. Fark ince; Bora için ince değil.',
          ),
          S(
            'leyla',
            'Bu bası izini tahtaya götür. Onur’un “tekme” kartıyla yan yana koy. İki kart aynı anı mı anlatıyor, bak.',
          ),
        ),
        otherwise(
          S('leyla', 'Tekme iddiası duruyor mu? Duruyorsa meşru müdafaa zor. Kesin rapora bak; tekme iz bırakır.'),
          S(
            'leyla',
            'Meşru müdafaa saldırı sürdüğü sürece geçerlidir. Saldırı bittikten sonra vurulan darbe savunma değil, öfkedir.',
          ),
          S(
            'leyla',
            'Arada bir kapı var: sınırın heyecan ve korkuyla aşılması. Ceza verilmez ama fiil hukuka uygun da sayılmaz.',
          ),
        ),
      ],
      choices: [cont('ARALEYLA1_DON', 'Teşekkürler', HUB, { role: 'BACK' })],
    }),
    story('ARA_LEYLA2', {
      ...ARA,
      title: 'Leyla',
      background: 'buro',
      lines: says(
        S('leyla', 'Tolga özel bir klinikten rapor alacak. Hep alır. “Üçüncü derece” yazdırır.'),
        S(
          'leyla',
          'Taraflarca alınan rapor bilirkişi raporu değildir; uzman görüşüdür. Resmî kurumun raporuyla çelişirse mahkeme ya resmî rapora dayanır ya da üst kurula gönderir.',
        ),
        S(
          'leyla',
          'Ve tanık. Onur’a soracakların onu kurtaracak sorular olsun, batıracak değil. Kurtulmak isteyen bir tanık, batırılmak istenen bir tanıktan daha çok konuşur.',
        ),
        S(
          'leyla',
          'Bir de şunu unutma: yalan söyleyen tanık, hüküm verilmeden önce gerçeği söylerse kanun ona bir kapı açar. Bu kapıyı ona sen gösteremezsin; ama mahkemede o kapının önünde durmasına izin verebilirsin.',
        ),
        T('Etkin pişmanlık. Onur için bir kapı. Benim elimde değil, onun ayağında.'),
      ),
      choices: [cont('ARALEYLA2_DON', 'Teşekkürler', HUB, { role: 'BACK' })],
    }),

    // --- Duruşmadan önceki gece ---
    decisionNode('ARA_SON_1', [{ to: 'ARA_SON_2' }], {
      ...ARA,
      title: 'Duruşmadan önceki gece',
      lines: says(
        card('İKİNCİ CELSEDEN ÖNCEKİ GECE — ARSLAN HUKUK', 'buro_gece'),
        Nx('Pano. İplikler artık bir ağ gibi; ortasında bir kadeh, bir kol, bir bilek.'),
      ),
    }),
    decisionNode('ARA_SON_2', [{ to: 'ARA_SON_3' }], {
      ...ARA,
      lines: [
        when(
          all(has('ev_kriminal'), has('ded_bilek')),
          T('Sap Serkan’ın elindeydi; izleri söylüyor. Tekme bir bası izi. Saldırı da, “yerde” denen an da kâğıtta.'),
        ),
        when(has('ded_bilek'), T('Tekme bir bası izi. Ama sapın kimin elinde olduğunu yalnızca fotoğraflar söylüyor.')),
        when(has('ev_kriminal'), T('Sap Serkan’ın elindeydi. Ama “yerde tekme” cümlesi hâlâ ayakta.')),
        otherwise(T('Elimde ne var? Fotoğraflar, bir acil kaydı, bir tanığın kendi cümleleri. Az değil. Yeter mi?')),
      ],
    }),
    decisionNode('ARA_SON_3', [{ to: 'ARA_SON' }], {
      ...ARA,
      lines: [
        when(
          flag('defne_video'),
          T('On beş saniyelik bir video yarın bir salonda oynayacak. On beş saniye, iki ayın cevabı olabilir.'),
        ),
        when(
          any(flag('req_ece'), flag('h1_ece'), flag('ara_ece')),
          T('Ece çağrıldı. Gelecek mi? Gelirse ne diyecek? Bilmiyorum. Bilmemem gerekiyor.'),
        ),
        otherwise(T('Yarın kürsüde Onur olacak, bir de ben. Başka göz yok.')),
      ],
    }),
    story('ARA_SON', {
      ...ARA,
      title: 'Duruşmadan önceki gece',
      background: 'sokak_yagmur',
      lines: says(
        Nx('Gökdere yine taşmıştı. Köprünün altında sarı lamba, suyun üstünde titriyordu; tıpkı o geceki gibi.', {
          fx: 'flash',
        }),
        Nx('Telefona bir mesaj: Bora. “Kasketi evde bırakacağım. Takarsam çıkarmayı unuturum.”'),
        T('Bir adamın bir mahkemeye gösterebileceği en büyük saygı, kasketini evde bırakmaktır.'),
        Nx('Leyla’nın odasının ışığı hâlâ yanıyordu. Kapıyı tıklattım. “Gir” dedi; başını kaldırmadı.'),
        S('leyla', 'Yarın Tolga sert gelecek. Kızma. Kızan avukat, karşı tarafın avukatı olur.'),
        S(
          'leyla',
          'Ve Onur’a ilk sorunu yumuşak sor. Bir tanık, ilk sorudan anlar kendisini batırmaya mı, dinlemeye mi geldiğini.',
        ),
        D('Ya batırmam gerekirse?'),
        S(
          'leyla',
          'Gerekmez. Kâğıtların batırır. Sen yalnızca kâğıtları doğru sırayla koy. Gerisi onun vicdanı; vicdan senin işin değil.',
        ),
        T('Eve yürüdüm. Köprünün altında sarı lamba. Gölge’nin kepengi inik, tabelada G hâlâ yanmıyordu.'),
      ),
      choices: [cont('ARASON_DEVAM', 'Adliyeye git', 'T_00G', { role: 'PRIMARY' })],
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
  discoveryPaths: arrivals.discoveryPaths,
};
