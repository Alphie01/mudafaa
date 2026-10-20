import {
  all,
  any,
  cmp,
  conversation,
  cont,
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
  met,
  nav,
  not,
  option,
  raise,
  rawChoice,
  recipe,
  row,
  score,
  set,
  story,
  tool,
  v,
  choiceNode,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import type { ChoiceDef, NodeDef } from '@mudafaa/case-schema';
import { INV2, card, me, n, p2, s, th, voice } from './shared.js';

// 70-investigation-2: ara evre (2 gün × 3 EP). Yığın kullanılmaz: her etkinlik doğrudan ARA_HUB'a döner (kaçış
// uzaklığı sınırı). Kurye durağı, GPS kaydı, kafenin kasa kaydı, Kaan'la rıza, Defne'nin sahte tanık teklifi (etik
// tuzak), bodrumdaki çanta (delil zinciri), suç duyurusu, gece gelen telefon.

const HUB = 'ARA_HUB';

/** Kit yardımcılarının `$return` BACK seçeneğini doğrudan ARA_HUB'a çevirir. */
const toHub = <T extends NodeDef>(node: T): T => ({
  ...node,
  choices: node.choices.map((c) => (c.role === 'BACK' && c.next === '$return' ? { ...c, next: HUB } : c)),
});

const act = (id: string, label: string, to: string, extra: Partial<ChoiceDef> = {}): ChoiceDef =>
  rawChoice('NAVIGATE', id, label, { cost: [{ var: 'ap2', amount: 1 }], next: to, maxUses: 1, ...extra });

const lupe = tool('lupe', 'Büyüteç', 'magnifier');
const kars = tool('kars', 'Karşılaştır', 'compare');
const docMiss = (id: string) =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle bu satırda dikkat çeken bir şey bulamadın.',
      label: '−20 SKOR',
      tone: 'error',
    },
  });

const kurye = deliver('ARA_GIRIS', [
  {
    evidence: 'ev_kurye',
    requires: flag('kurye_istendi'),
    hint: 'Kurye şirketinin kayıtlarını delil dilekçesiyle ya da 1. celsede isteyebilirdin.',
  },
]);

const fresh = (id: string, a: string, b: string, out: string, title: string, text: string) =>
  recipe(id, a, b, {
    discovers: out,
    score: { DELIL_ANALIZI: 300 },
    feedback: { title, text, label: 'YENİ DELİL · +300 SKOR', tone: 'success' },
  });

export const investigation2: CasePart = {
  nodes: [
    decisionNode('ARA_GIRIS_1', [{ to: 'ARA_GIRIS' }], {
      ...INV2,
      title: 'Ara',
      lines: [
        {
          when: flag('kaan_tahliye'),
          lines: [
            card('26 OCAK · 17.30 — ADLİYE MERDİVENLERİ', 'adliye'),
            n(
              'Kaan cezaevinden eşyalarıyla çıkarıldığında hava kararmıştı. Bir naylon torba: iki kitap, bir eşofman, bir gözlük kılıfı.',
            ),
            n(
              'Defne merdivenlerin başında bekliyordu. Kaan durdu. Defne yürüdü. Bir süre ikisi de bir şey söylemedi; sonra Defne kardeşinin yakasını düzeltti.',
            ),
            s('defne', 'Kolları kısa. Söylemiştim.'),
            s('kaan', 'Söylemiştin.', 'mutlu'),
            th('Tahliye bir beraat değil. Ama bir kapı. Kaan o kapıdan geçerken bir kez dönüp adliyeye baktı.'),
            s('kaan', 'Elli bir gün. Saydım. Şimdi neyi sayacağım?'),
            s('defne', 'Perşembeleri. Doktorunu. Bir de bana borcunu.', 'mutlu'),
            n('Kaan güldü. Kısa, şaşkın bir gülüş; uzun zamandır kullanılmamış bir kapının menteşesi gibi.'),
          ],
        },
        {
          lines: [
            card('26 OCAK · 17.30 — ADLİYE ARKA KAPISI', 'adliye'),
            n(
              'Ring aracının arka camı buğuluydu. Kaan parmağıyla camda küçük bir pencere açtı; ablasını aradı, buldu.',
            ),
            n(
              'Defne elini kaldırdı. Kaan elini cama koydu. Araç hareket etti; el izi buğuda kaldı, sonra o da silindi.',
            ),
            th('Üç hafta. Bir sonraki celseye kadar Kaan saymaya devam edecek. Ben de.'),
          ],
        },
      ],
    }),
    story('ARA_GIRIS', {
      ...INV2,
      title: 'Ara',
      background: 'buro_gece',
      onEnter: [...kurye.effects, ...p2.start()],
      lines: [
        {
          when: has('ev_kurye'),
          lines: [
            card('29 OCAK · PERŞEMBE — ARSLAN HUKUK', 'buro_gece'),
            n(
              'UYAP’a bir evrak düştü: Paketçi’nin mahkemeye cevabı. Yirmi iki sayfa. Bir personel dosyası, bir GPS dökümü, bir iş akdi feshi.',
            ),
            th('Bir soyadı. Bir doğum tarihi. Bir İzmir adresi. Hayalet artık bir nüfus kaydı.'),
            n(
              'Personel dosyasında bir vesikalık vardı. Uzun yüzlü, sakallı, gülümsemeye çalışan bir adam. Fotoğrafçının “gülün” dediği anda gülmemiş, bir saniye sonra gülmüş gibi.',
            ),
            th(
              'Polis bu fotoğrafı hiç görmedi. Çünkü kimse kurye şirketine bir soru sormadı. Bazen bir dosyada eksik olan delil değil, merakın kendisidir.',
            ),
            s(
              'leyla',
              'Sana bir isim gerekiyordu. İşte bir isim. Şimdi o ismi mahkemeye taşımanın doğru yolunu bul. Kovalamadan.',
            ),
            th('Kovalamadan. Leyla bunu her söylediğinde, bir zamanlar birini kovaladığını düşünürüm. Sormam.'),
          ],
        },
        {
          lines: [
            card('29 OCAK · PERŞEMBE — ARSLAN HUKUK', 'buro_gece'),
            n('UYAP sessizdi. Kurye şirketinden bir cevap yoktu; çünkü kimse bir soru sormamıştı.'),
            th('Savcı bir isim istedi. Elimde bir ad, bir kask, bir hikâye var. Bir soyadım yok.'),
            s(
              'leyla',
              'Kâğıt gelmiyorsa insanlara git. Ama kovalamadan. Avukat dedektif değildir; delil toplar, adam yakalamaz.',
            ),
          ],
        },
      ],
      choices: [cont('ARA_GIRIS_DEVAM', 'Ara evreye başla', HUB, { role: 'PRIMARY' })],
    }),
    {
      id: HUB,
      type: 'INVESTIGATION',
      ...INV2,
      title: 'Ara',
      background: 'buro',
      hud: ['day2', 'ap2'],
      lines: [
        {
          when: cmp(v('day2'), '==', 1),
          lines: [
            card('ARA · GÜN 1/2 · İKİNCİ CELSEYE 18 GÜN', 'buro'),
            n('Hedef: arka odanın kiracısını bir kâğıda, muhbirin hikâyesini bir saate bağla. Kovalamadan.'),
            th(
              'Üç hafta, iki gün, birkaç kapı. Savcı bir isim istedi. Elimdeki her kâğıt bir ismin gölgesini gösteriyor; ismin kendisini değil.',
            ),
            n(
              'Masada Leyla’nın bıraktığı bir not: “Kovalamadan.” Altına küçük bir kedi çizmiş. Leyla kedi sevmez. Nesrin Hanım’ı duymuş olmalı.',
            ),
          ],
        },
        {
          lines: [
            card('ARA · GÜN 2/2 · İKİNCİ CELSEYE 11 GÜN', 'buro'),
            n('Hedef: ikinci celseye hangi delille gireceğini seç. Tolga kürsüde olacak.'),
            th(
              'Son gün. Bir celsede söylenecek her cümle, bugün toplanan bir kâğıda dayanacak. Kâğıdı olmayan cümleyi söylemeyeceğim.',
            ),
          ],
        },
      ],
      tabs: [
        {
          id: 't2_kisi',
          label: 'KİŞİLER',
          kind: 'PEOPLE',
          choices: ['A2_SELIM', 'A2_KAAN', 'A2_DEFNE', 'A2_BODRUM', 'A2_NESRIN'],
        },
        {
          id: 't2_arsiv',
          label: 'ARŞİV',
          kind: 'ARCHIVE',
          choices: ['A2_GPS', 'A2_ZRAPOR', 'A2_SUC', 'A2_CIKARIM', 'A2_LEYLA'],
        },
      ],
      quickTalk: {
        character: 'leyla',
        line: '“Bir isim getir, ama kovalamadan. Avukat delil toplar, adam yakalamaz.”',
        choices: ['A2_LEYLA'],
      },
      choices: [
        act('A2_SELIM', 'Paketçi Görükle durağı', 'ARA_SELIM', {
          description: 'Kurye durağı · sorumlusu Selim Usta',
          visibleWhen: any(has('ev_kurye'), has('clue_mont'), has('ded_kurye'), has('clue_kira_defteri')),
        }),
        act('A2_KAAN', 'Kaan’la konuş', 'ARA_KAAN', { description: 'Rıza, son söz, bir aile' }),
        act('A2_DEFNE', 'Defne’nin telefonu', 'ARA_DEFNE', { description: 'Abla arıyor; sesi gergin' }),
        act('A2_BODRUM', 'Nesrin Hanım’ın telefonu', 'ARA_BODRUM', {
          description: 'Ev sahibi bir şey bulmuş',
          visibleWhen: all(met('nesrin'), not(flag('nesrin_kus'))),
        }),
        act('A2_NESRIN', 'Nesrin Hanım’a uğra', 'ARA_NESRIN', {
          description: 'Zemin kat · bir teşekkür, bir defter',
          visibleWhen: all(met('nesrin'), not(flag('nesrin_kus'))),
        }),
        act('A2_GPS', 'Paketçi kayıtlarını incele', 'ARA_GPS', {
          description: 'Personel dosyası ve GPS dökümü',
          visibleWhen: has('ev_kurye'),
        }),
        act('A2_ZRAPOR', 'Kafenin kasa kayıtları', 'ARA_ZRAPOR', {
          description: 'Kahve Durağı · 9 Kasım',
          visibleWhen: has('clue_tolga_saat'),
        }),
        act('A2_SUC', 'Savcılığa suç duyurusu', 'ARA_SUC', { description: 'Arka odanın kiracısı hakkında' }),
        rawChoice('NAVIGATE', 'A2_CIKARIM', 'Çıkarım tahtası', {
          description: '0 EP · ipuçlarını birleştir',
          next: 'ARA_CIKARIM',
        }),
        rawChoice('NAVIGATE', 'A2_LEYLA', 'Leyla’ya danış', {
          description: '0 EP · günde bir kez',
          visibleWhen: cmp(v('leyla_ara'), '<', v('day2')),
          effects: [set('leyla_ara', v('day2'))],
          next: 'ARA_LEYLA',
        }),
        nav('GO_T', 'DURUŞMAYA GİT · 2. CELSE', 'ARA_SON_1', {
          role: 'PRIMARY',
          confirm: 'Duruşmaya gidersen ara evre biter. Emin misin?',
        }),
      ],
    },
    decisionNode('ARA_DAY_END', [{ to: 'ARA_AKSAM' }], {
      ...INV2,
      title: 'Gün sonu',
      onEnter: [inc('day2', 1), set('ap2', 4)],
    }),
    story('ARA_AKSAM', {
      ...INV2,
      title: 'Akşam',
      background: 'buro_gece',
      lines: [
        {
          lines: [
            card('PAZAR 22.40 — ARSLAN HUKUK', 'buro_gece'),
            n(
              'Büroda yalnızca iki lamba yanıyordu: benimki ve Leyla’nınki. Kapısı aralıktı. Radyoda bir şarkı, yarısı parazit.',
            ),
            n(
              'Leyla elinde bir dosyayla kapıma geldi. Eski bir dosya; köşeleri yumuşamış, kapağında daktiloyla yazılmış bir isim. İsmi elimle kapattı, sonra elini çekti.',
            ),
            s(
              'leyla',
              'Yirmi iki yıl önce. Bir öğrenci evi, bir terazi, bir çocuk. O da “benim değil” diyordu. Ben ona inanmadım, Deniz.',
            ),
            s(
              'leyla',
              'Ona “ikrar et, indirim alırsın” dedim. İndirim aldı. Dört yıl yattı. Sonra terazinin sahibi başka bir dosyada çıktı. Çok geçti.',
            ),
            n('Masanın üstündeki sigara paketine baktı. Açmadı. Paketi bir kez çevirdi, bir kez daha.'),
            s(
              'leyla',
              'O günden beri müvekkillerime bir şey söylemiyorum. Soruyorum. Sen de sor. Kaan’a, Defne’ye, o yaşlı kadına. Cevabı onlar versin.',
            ),
            th(
              'Ters çerçevenin arkasında ne olduğunu hâlâ bilmiyorum. Ama bu gece bir köşesini gördüm. Bazı hatalar insanın masasında bir sigara paketi gibi durur: hiç açılmadan, hiç atılmadan.',
            ),
          ],
        },
      ],
      choices: [
        option('ARAK_A', 'O çocuk şimdi nerede?', {
          effects: [inc('trust', 2)],
          responses: [
            {
              lines: [
                s(
                  'leyla',
                  'Bilmiyorum. Bir kere aradı, yıllar sonra. “Avukat hanım, ben iyiyim” dedi. İyi olup olmadığını sormadım. Sorsam belki söylerdi.',
                ),
                th('Bazı sorular sorulmadığı için ağırdır.'),
              ],
            },
          ],
          next: 'ARA_TELEFON',
        }),
        option('ARAK_B', 'Bunu bana neden şimdi anlatıyorsunuz?', {
          score: { SAVUNMA_STRATEJISI: 20 },
          responses: [
            {
              lines: [
                s(
                  'leyla',
                  'Çünkü yarın, öbür gün, birisi sana kolay bir yol gösterecek. Bir zarf, bir tanık, bir ikrar. Kolay yollar hep bu dosyalarda açılır.',
                ),
                s('leyla', 'Ve sen yorgun olacaksın. Ben de yorgundum.'),
              ],
            },
          ],
          next: 'ARA_TELEFON',
        }),
        option('ARAK_C', 'Sessizce dosyayı ona geri ver', {
          responses: [
            {
              lines: [
                n('Dosyayı iki elimle uzattım. Leyla aldı, koltuğunun altına sıkıştırdı, kapıda durdu.'),
                s('leyla', 'İyi geceler, Deniz. Telefonunu açık bırak. Bu dosyalarda geceleri telefon çalar.'),
              ],
            },
          ],
          next: 'ARA_TELEFON',
        }),
      ],
    }),
    story('ARA_SABAH', {
      ...INV2,
      title: 'Sabah',
      background: 'sokak_sabah',
      lines: [
        {
          when: flag('kaan_tahliye'),
          lines: [
            card('PERŞEMBE 09.15 — GÖRÜKLE KARAKOLU ÖNÜ', 'sokak_sabah'),
            n(
              'Kaan’ın ilk imza günüydü. Karakolun önünde, bir elinde bir dosya, bir elinde bir simit, sırasını bekliyordu. Beni görünce simidi uzattı; almadım, güldü.',
            ),
            s('kaan', 'İmza atacağım, sonra AMATEM. Aynı gün. Önce devlet, sonra doktor. Perşembeler artık resmî.'),
            s(
              'kaan',
              'Karakoldaki memur “yine mi sen” dedi. İlk defa gelmiştim. Herkes birine benziyor burada, galiba.',
            ),
            n('Kapının yanında, duvara yaslanmış bir motor vardı; kaskı aynasında. Kaan baktı, gözlerini kaçırdı.'),
            th(
              'Bir motor, bir kask. Kaan için artık sıradan bir eşya değiller. Bir odanın, bir kilidin, bir isimsiz korkunun şekli.',
            ),
            s(
              'kaan',
              'Doktor bugün “nasılsın” diye sorduğunda doğru cevap vereceğim. Cezaevinde herkese “iyiyim” dedim. Kimse inanmadı. Ben de inanmadım.',
            ),
          ],
        },
        {
          lines: [
            card('PERŞEMBE 09.15 — BURSA H TİPİ CEZAEVİ ÖNÜ', 'sokak_sabah'),
            n(
              'Görüş günüydü. Cezaevinin önünde uzun bir kuyruk: annenler, eşler, çocuklar, poşetler. Defne en öndeydi; elinde bir torba temiz çamaşır, bir de bir kitap.',
            ),
            s(
              'defne',
              'Roman getirdim. İktisat kitabı istemiyor artık. “Abla, biraz da başkasının hikâyesini okuyayım” dedi.',
              'uzgun',
            ),
            n(
              'Kuyrukta önümüzdeki kadın Defne’ye döndü; oğlu da içerideymiş. Uyuşturucu. Ne kadar, hangisi, nedendi; sormadılar. Birbirlerine sadece başlarını salladılar.',
            ),
            th(
              'Bu kuyrukta kimse kimseye ne yaptığını sormuyor. Sadece ne kadar kaldığını. Bir mahkeme salonunda tersi olur.',
            ),
          ],
        },
      ],
      choices: [cont('ARA_SABAH_DEVAM', 'Güne başla', HUB, { role: 'PRIMARY' })],
    }),
    story('ARA_TELEFON', {
      ...INV2,
      title: 'Gece',
      background: 'buro_gece',
      lines: [
        {
          lines: [
            card('PAZARTESİ 01.12 — DENİZ’İN EVİ', 'sokak_karanlik'),
            n('Telefon karanlıkta titredi. Numara gizli. Bir kez çaldı, sustu. Sonra yeniden.'),
            voice('BİR SES', 'Avukat hanım? Saati bilmiyorum, kusura bakmayın. Burada saat başka işliyor.'),
            voice(
              'BİR SES',
              'Kaan’a söyleyin. Beni karıştırmasın. Ben o odaya bir şey bırakmadım. O odanın anahtarı herkeste vardı.',
            ),
            me('Kimsiniz?'),
            n('Bir motor sesi, uzakta. Bir martı. Denize yakın bir yer.'),
            voice(
              'BARIŞ',
              'Barış. Ben Barış. Tolga’yı sorun. Tolga’nın anahtarı vardı. Ben kimseye bir şey satmadım. Kaan’a da satmadım.',
            ),
            voice('BARIŞ', 'Beni ararlarsa… beni aramasınlar. Annem hasta. Ben bir şey yapmadım.'),
            me('Bunu bana değil, savcılığa anlatın. Bir avukatla gidin. Kaçmak hiçbir şeyi düzeltmez.'),
            voice(
              'BARIŞ',
              'Avukat… Kaan’ın avukatı bana avukat öneriyor. Komik. Siz iyi birisiniz, avukat hanım. Kaan da iyi biri. Ben değilim belki. Ama satıcı değilim.',
            ),
            n('Hat kesildi. Ekranda bir saat: 01.14. İki dakika.'),
            th(
              'Hayalet aradı. Kendi adını söyledi ve başka bir adı işaret etti. Tolga’nın anahtarı. Bu dosyada herkes bir anahtardan söz ediyor; kimse kendi anahtarından.',
            ),
          ],
        },
      ],
      choices: [
        option('TEL_A', 'Saati ve konuşmayı not et; sabah nöbetçi savcılığa bildir', {
          score: { USUL_BILGISI: 50 },
          effects: [raise('tehdit_bildirildi')],
          good: 'Doğru yol: dosyada şüpheli konumundaki bir kişinin temas girişimi ve olası bir tehdit savcılığa bildirilir (CMK 158). Avukat şüpheliyi aramaz, pazarlık etmez; arama kaydının tespiti savcılığın işidir.',
          responses: [
            {
              lines: [
                n('Sabah sekizde nöbetçi savcılığın kapısındaydım. Bir tutanak, bir imza, bir saat: 01.12–01.14.'),
                s(
                  'savci',
                  'Gizli numara, iki dakika. Operatörden baz kaydı isteriz. Hâkim kararıyla. Bir şey çıkarsa bilirsiniz.',
                ),
                th('Serap Akın ilk kez “bilirsiniz” dedi. “Biliriz” değil. Ama bir kapı aralandı.'),
              ],
            },
          ],
          next: 'ARA_SABAH',
        }),
        option('TEL_B', 'Geri ara; teslim olursa Kaan’ın ifadesini yumuşatabileceğini söyle', {
          score: { SAVUNMA_STRATEJISI: -60 },
          effects: [inc('ethics')],
          bad: 'Şüpheliyle müvekkilin beyanı üzerinden pazarlık: avukat, müvekkilin beyanını bir üçüncü kişinin teslimine bağlayamaz; bu hem müvekkilin çıkarına hem meslek kurallarına aykırıdır (Av.K. 34, TBB Meslek Kuralları).',
          responses: [
            {
              lines: [
                n(
                  'Numara gizliydi. Geri arayamadım. Ama bir mesaj yazdım ve gönderemediğim mesajı bir saat elimde tuttum.',
                ),
                th(
                  'Bir avukat müvekkilinin sözünü pazarlık konusu yapmaz. Bunu bilerek düşündüm. Düşünmek de bir şeydir.',
                ),
              ],
            },
          ],
          next: 'ARA_SABAH',
        }),
        option('TEL_C', 'Telefonu kapat ve uyumaya çalış', {
          neutral:
            'Şüphelinin temasını bildirmemek bir hata değil ama kaçırılmış bir fırsattır: kayıt tespit edilemedi.',
          responses: [
            {
              lines: [
                th('Uyumadım. Telefon komodinin üstünde bir taş gibi duruyordu.'),
                th(
                  'Bir hayalet aradı ve ben ona hiçbir şey sormadım. Sabah olunca kendime sordum: neden? Cevabı bilmiyordum. Belki de korkmuştum. Avukatlar da korkar.',
                ),
              ],
            },
          ],
          next: 'ARA_SABAH',
        }),
      ],
    }),
    toHub(
      conversation('ARA_SELIM', {
        ...INV2,
        title: 'Paketçi Görükle durağı',
        background: 'kafe',
        room: { label: 'PAKETÇİ · GÖRÜKLE DURAĞI', character: 'selim' },
        onFirstEnter: [{ type: 'MEET', character: 'selim' }],
        lines: [
          {
            lines: [
              card('PAKETÇİ GÖRÜKLE DURAĞI — 19.40', 'kafe'),
              n(
                'Bir dönerci ile bir kırtasiyenin arasında, camına logolu bir çıkartma yapıştırılmış küçük bir dükkân. İçeride on iki şarj aleti, dört kask, bir semaver.',
              ),
              n(
                'Kapının önünde motorlar rölantideydi. Kuryeler telefonlarına bakıyor, birbirlerine bakmıyordu. Egzoz dumanı soğukta asılı kalmıştı.',
              ),
              s(
                'selim',
                'Abla, sipariş mi, şikâyet mi? Şikâyetse uygulamadan, ben bir şey yapamam. … Avukat mı? Hayırdır?',
              ),
              s(
                'selim',
                'Bir dakika. — Ahmet! Nilüfer’e iki paket, soğumadan! — Buyur abla. Çay? Semaver hep yanar burada.',
              ),
              n(
                'Duvarda bir yağmur takvimi, bir trafik cezası listesi, bir de çerçeveletilmiş “ayın kuryesi” belgesi. Ekim ayı. İsim kısmı tükenmez kalemle karalanmış.',
              ),
              th('Ekim ayının kuryesi. Kimin adının karalandığını sormadım. Henüz.'),
            ],
          },
        ],
        choices: [
          option('SL_BARIS', 'Barış adında bir kuryeniz vardı. Kasımda ayrıldı. Onu anlatır mısınız?', {
            effects: [raise('fact_soyad')],
            score: { SORGULAMA: 50 },
            responses: [
              {
                lines: [
                  s(
                    'selim',
                    'Barış Demirel. İzmirli. İyi çalışırdı; gece vardiyası, hiç şikâyet gelmezdi. Yağmurda bile.',
                  ),
                  s(
                    'selim',
                    'On iki kasım sabahı mesaj attı: “Abi ben bırakıyorum.” Montu, çantayı getirmedi. Depozito kesildi, neyse.',
                  ),
                  s('selim', 'Polis sordu mu? Kimse sormadı abla. Sen ilksin.'),
                  s(
                    'selim',
                    'Ayın kuryesi seçmiştik onu ekimde. Belgesi duvarda. Gitti, adını karaladım. Kızdım çünkü. İyi çocuk sandım.',
                  ),
                  th(
                    'Barış Demirel. Bir soyadı, bir istifa mesajı, iade edilmemiş bir çanta. Ve kimsenin sormadığı bir soru.',
                  ),
                ],
              },
            ],
            next: '$stay',
          }),
          option('SL_CANTA', 'Çantası nasıldı? Hiç dikkatinizi çeken bir şey oldu mu?', {
            discovers: 'clue_selim_astar',
            score: { SORGULAMA: 40 },
            responses: [
              {
                lines: [
                  s(
                    'selim',
                    'Çantası mı? Hepsinde aynı çanta var, şirketin. Ama Barış’ınki… astarını kendisi sökmüş, yeniden dikmişti. “Isıyı tutsun” dedi.',
                  ),
                  s(
                    'selim',
                    'Ben de dedim ki oğlum, şirket çantası, bozarsan ceza. Güldü. “Usta, ben dikiş bilirim, annem terzi” dedi.',
                  ),
                  th(
                    'Bir çantanın astarı. Bir kuryenin, ısıyı tutmak için değil başka bir şeyi tutmak için dikebileceği bir yer.',
                  ),
                ],
              },
            ],
            next: '$stay',
          }),
          option('SL_TOLGA', 'Barış’ı soran, durağa onun için gelen biri olur muydu?', {
            discovers: 'clue_selim_tolga',
            score: { SORGULAMA: 60 },
            responses: [
              {
                lines: [
                  s(
                    'selim',
                    'Olurdu. Bir tane vardı, kırmızı bereli. Ekimden beri sık gelirdi. “Barış var mı?” derdi. Sipariş vermezdi, kurye değildi.',
                  ),
                  s(
                    'selim',
                    'Köşede konuşurlardı. Bir keresinde sesleri yükseldi; bereli “param yarın gelecek” diyordu. Barış “yarın yok” dedi. Hatırlıyorum, tuhafıma gitti.',
                  ),
                  s('selim', 'Adı… Tolga mıydı? Tolga. Barış öyle seslenirdi.'),
                  th(
                    '“Yarın yok.” Bu cümleyi daha önce bir yerde okudum. Ya da duydum. Bir merdiven boşluğunda, bir gece.',
                  ),
                ],
              },
            ],
            next: '$stay',
          }),
          option('SL_ADRES', 'Barış’ın İzmir adresini verin; gidip kendim konuşacağım.', {
            score: { SAVUNMA_STRATEJISI: -40 },
            bad: 'Avukat şüpheli kovalamaz: kişiyi bulmak kolluğun, onu dinlemek savcılığın işidir. Adres ve kimlik bilgisiyle suç duyurusu yapılır (CMK 158); “gidip konuşmak” delili de seni de tehlikeye atar.',
            responses: [
              {
                lines: [
                  s(
                    'selim',
                    'Abla, ben adres veremem. Kişisel veri. Şirket bana kafa keser. Hem… sen avukatsın, polis değilsin.',
                  ),
                  th('Haklıydı. Bir an kendimi bir dedektif sandım. Dedektiflerin müvekkili olmaz.'),
                ],
              },
            ],
            next: '$stay',
          }),
          rawChoice('CONTINUE', 'SL_BITIR', 'Çay için teşekkür et ve çık', { role: 'BACK', next: '$return' }),
        ],
      }),
    ),
    toHub(
      documentExam('ARA_GPS', {
        ...INV2,
        title: 'Paketçi kayıtları',
        hud: ['ex_gps'],
        background: 'buro',
        lines: [
          {
            lines: [
              n('Personel dosyası, iki gecelik GPS dökümü, bir fesih yazısı. Haritada noktalar, noktalarda saatler.'),
              th('Bir GPS cihazı yalan söylemez. Sadece nerede olduğunu söyler. Bazen bu yeter.'),
            ],
          },
        ],
        header: { left: 'PAKETÇİ · PERSONEL VE GPS KAYITLARI', right: 'Kurye: B. Demirel' },
        columns: [
          { label: 'KAYIT', flex: 1 },
          { label: 'İÇERİK', flex: 3 },
        ],
        rows: [
          row('g_personel', [
            'Personel',
            'Barış Demirel · 27 · ikamet: Karşıyaka/İzmir · Bursa adresi: Ihlamur Sok. 14/7',
          ]),
          row('g_9kasim', ['9 Kasım', '22.58–23.04 · Ihlamur Sok. 14 önü · duruş 6 dk · aktif sipariş yok']),
          row('g_11kasim', [
            '11 Kasım',
            '06.21 · Ihlamur Sok. 14 önü · duruş 40 sn · rota ters yön · “teslimat iptal”',
          ]),
          row('g_fesih', ['Fesih', '12 Kasım 08.10 · çalışan mesajla ayrıldı · çanta ve mont iade edilmedi']),
        ],
        tools: [lupe, kars],
        costVar: 'ex_gps',
        rules: [
          examine('EX_GPS_11', 'lupe', 'g_11kasim', {
            discovers: 'clue_gps',
            score: { DELIL_ANALIZI: 150 },
            feedback: {
              title: '06.21',
              text: 'Baskın sabahı 06.21’de Barış’ın cihazı binanın önünde kırk saniye duruyor, sonra ters yöne gidiyor. Polis araçlarını gören biri böyle durur.',
              label: '+150 SKOR · Not defterine eklendi',
              tone: 'special',
            },
          }),
          examine('EX_GPS_9', 'kars', 'g_9kasim', {
            score: { DELIL_ANALIZI: 150 },
            effects: [raise('fact_gps9')],
            feedback: {
              title: '9 KASIM 23.00',
              text: 'Muhbirin paketi aldığını söylediği dakikalarda Barış’ın cihazı binanın kapısında, sipariş yokken altı dakika duruyor.',
              label: '+150 SKOR',
              tone: 'special',
            },
          }),
          examine('EX_GPS_FESIH', 'lupe', 'g_fesih', {
            discovers: 'clue_istifa',
            score: { DELIL_ANALIZI: 50 },
            feedback: {
              title: 'ERTESİ GÜN',
              text: 'Baskından bir gün sonra işi bırakmış; çantayı ve montu iade etmemiş.',
              label: '+50 SKOR',
              tone: 'info',
            },
          }),
          examine('EX_GPS_PERS', 'lupe', 'g_personel', {
            score: { DELIL_ANALIZI: 50 },
            effects: [raise('fact_soyad')],
            feedback: {
              title: 'BURSA ADRESİ',
              text: 'Kurye kendi personel dosyasına Bursa adresi olarak Ihlamur Sokak 14/7’yi yazmış. Hayalet kendi adresini kendi eliyle yazmış.',
              label: '+50 SKOR',
              tone: 'info',
            },
          }),
        ],
        miss: docMiss('FB_GPS'),
        finish: { id: 'GPS_BITIR' },
      }),
    ),
    toHub(
      documentExam('ARA_ZRAPOR', {
        ...INV2,
        title: 'Kahve Durağı kasa kayıtları',
        hud: ['ex_z'],
        background: 'kafe',
        onFirstEnter: [discover('ev_zrapor')],
        lines: [
          {
            when: flag('fact_pazar'),
            lines: [
              card('KAHVE DURAĞI — GÖRÜKLE, 15.00', 'kafe'),
              n(
                'Kaan “kasaya sorun” demişti. Kafenin sahibi Elif Hanım, vardiya çizelgesini ve 9 Kasım Z raporunu imzalı bir yazıyla verdi. “Mahkeme isterse aslı da var” dedi.',
              ),
              s('defne', 'Pazar kapanışı hep onda. Hep. Annemin doğum gününü bile pazar diye kaçırdı.'),
            ],
          },
          {
            lines: [
              card('KAHVE DURAĞI — GÖRÜKLE, 15.00', 'kafe'),
              n(
                'Kafenin sahibi Elif Hanım, Kaan’ın vardiya çizelgesini ve 9 Kasım Z raporunu imzalı bir yazıyla verdi. “Mahkeme isterse aslı da var” dedi.',
              ),
              s('defne', 'Kaan’ın işyeri. Kaan’ın tek düzenli olduğu yer.'),
            ],
          },
        ],
        header: { left: 'KAHVE DURAĞI · Z RAPORU VE VARDİYA', right: '9 Kasım · Pazar' },
        columns: [
          { label: 'KAYIT', flex: 1 },
          { label: 'İÇERİK', flex: 3 },
        ],
        rows: [
          row('z_vardiya', ['Vardiya', 'Kapanış: Kaan Yıldız · 16.00–24.00']),
          row('z_son', ['Son satış', '23.18 · iki filtre kahve']),
          row('z_kapanis', ['Kasa kapanış', '23.41 · kullanıcı kodu: KAAN']),
          row('z_kamera', ['Kamera', 'Kayıt yedi gün saklanır; 9 Kasım kaydı silinmiş']),
        ],
        tools: [lupe, kars],
        costVar: 'ex_z',
        rules: [
          examine('EX_Z_KAPANIS', 'lupe', 'z_kapanis', {
            discovers: 'clue_z_rapor',
            score: { DELIL_ANALIZI: 150 },
            feedback: {
              title: '23.41',
              text: 'Kasa 23.41’de Kaan’ın koduyla kapanmış; son satış 23.18. Muhbire göre satış 23.00’te, on beş dakika uzaklıktaki bir kapıda.',
              label: '+150 SKOR · Not defterine eklendi',
              tone: 'special',
            },
          }),
          examine('EX_Z_SON', 'kars', 'z_son', {
            score: { DELIL_ANALIZI: 50 },
            feedback: {
              title: '23.18',
              text: 'Son satışı yapan kasiyer kodu da Kaan’ın. 23.00 ile 23.18 arasında bir kapıya gidip dönmek mümkün değil.',
              label: '+50 SKOR',
              tone: 'info',
            },
          }),
        ],
        miss: docMiss('FB_Z'),
        finish: { id: 'Z_BITIR' },
      }),
    ),
    toHub(
      conversation('ARA_KAAN', {
        ...INV2,
        title: 'Kaan',
        background: 'gorus_odasi',
        room: { label: 'KAAN', character: 'kaan' },
        lines: [
          {
            when: flag('kaan_tahliye'),
            lines: [
              card('KAHVE DURAĞI — KAPANIŞTAN SONRA', 'kafe'),
              n(
                'Kaan tezgâhı siliyordu. İşe dönmüştü; Elif Hanım “kasayı yine sen kapat” demişti. İmza günü perşembeymiş; AMATEM randevusu da perşembe.',
              ),
              s('kaan', 'Aynı gün. Önce karakol, sonra doktor. Perşembeler artık benim. Neyse. Ne içersiniz?', 'mutlu'),
              n(
                'Fincanı önüme koydu. Köpüğün üstüne bir yaprak çizmişti; titrek ama düzgün. Bunu yapabilmek için ellerinin sakin olması gerekirdi.',
              ),
              s(
                'kaan',
                'Elif Hanım “müşteriler sordu” dedi. “Kaan nerede?” diye. Biri bana kitap bırakmış. İktisat değil, roman. Neyse. Okuyorum.',
              ),
            ],
          },
          {
            lines: [
              card('BURSA H TİPİ CEZAEVİ — GÖRÜŞ ODASI', 'gorus_odasi'),
              n('Hasan Çakır kapıyı açarken başını salladı. “Elli bir gün” dedi, sormadığım hâlde.'),
              s(
                'kaan',
                'Polis kilidi kestiklerini söylemiş. Ablam anlattı. İlk defa biri bana inandı gibi geldi. Ya da bir kâğıda inandı.',
              ),
            ],
          },
        ],
        choices: [
          option('KA_RIZA', 'Mahkemede kullandığını söylemek ister misin? Karar senin; ne istersen öyle yaparız.', {
            visibleWhen: all(flag('kaan_itiraf'), not(flag('kaan_riza'))),
            score: { SAVUNMA_STRATEJISI: 50 },
            effects: [raise('kaan_riza')],
            good: 'Rıza her adımda yeniden sorulur: müvekkili aydınlatıp kararı ona bırakmak savunmanın temelidir.',
            responses: [
              {
                when: flag('anne_kaan'),
                lines: [
                  s(
                    'kaan',
                    'Ablam aradı, annemle beraber konuşalım dedi. Konuştuk. Üçümüz. Annem ağladı, sonra “yemek yiyor musun” dedi.',
                    'uzgun',
                  ),
                  s('kaan', 'Söyleyeceğim. Mahkemede. Annem biliyor artık; saklayacak bir şeyim kalmadı.'),
                  th('Bir aile bir sırrı birlikte taşıyınca sır hafifler. Kaan bunu bana söylemedi; yüzünden okudum.'),
                ],
              },
              {
                lines: [
                  s(
                    'kaan',
                    'Düşündüm. Çok düşündüm. Söyleyeceğim. Annemi aradım dün. Ağladı. Sonra “yemek yiyor musun” dedi. Annem işte.',
                    'uzgun',
                  ),
                  th('Bir annenin “yemek yiyor musun” sorusu, bir mahkemenin bütün kararlarından daha ağır olabilir.'),
                ],
              },
            ],
            next: '$stay',
          }),
          option(
            'KA_ITIRAF',
            'Eylülde Barış’tan bir şey aldın mı? Bilmem gerekiyor; ne duyarsam duyayım burada kalacak.',
            {
              visibleWhen: not(flag('kaan_itiraf')),
              effects: [ifThen(cmp(v('trust'), '>=', 50), [raise('kaan_itiraf'), score('SORGULAMA', 50)])],
              responses: [
                {
                  when: cmp(v('trust'), '>=', 50),
                  lines: [
                    s(
                      'kaan',
                      'Aldım. İki kez. Kullanmak için. Satmadım. Sonra acil, sonra tedavi. Bunu söylemeye utanıyordum. Hâlâ utanıyorum.',
                      'uzgun',
                    ),
                    th('Gerçek bazen ikinci görüşmede gelir. Bazen hiç gelmez. Bugün geldi.'),
                  ],
                },
                {
                  lines: [
                    s('kaan', 'Bunu konuşmak istemiyorum. Siz de herkes gibi bakarsınız sonra.', 'kizgin'),
                    th('Güven bir defada kazanılmaz. Ben onu ilk görüşmede harcadım.'),
                  ],
                },
              ],
              next: '$stay',
            },
          ),
          option('KA_TOLGA', 'Tolga ile Barış birbirini tanıyor muydu?', {
            score: { SORGULAMA: 30 },
            responses: [
              {
                lines: [
                  s(
                    'kaan',
                    'Tanışıyorlar mıydı? … Tolga çıktıktan sonra Barış geldi. Barış’ı ev ilanından bulduğunu söylemişti. İlanı kim verdi, biliyor musunuz?',
                    'saskin',
                  ),
                  s(
                    'kaan',
                    'Ben vermedim. Tolga “bir arkadaşım odayı arıyor” demişti, çıkmadan önce. Ben unutmuşum bunu. Şimdi hatırladım.',
                  ),
                  th(
                    'Tolga çıkarken odayı birine devretmiş. O biri Barış. Bir anahtar elden ele geçmiş; belki bir anahtardan fazlası.',
                  ),
                  s(
                    'kaan',
                    'Ben ne kadar aptalım, değil mi? Hiçbir şeyi sormadım. Kim, neden, nereden. Sormamak rahattı.',
                    'uzgun',
                  ),
                  me('Sormamak bir suç değil, Kaan. Ama bundan sonra sor. En çok da kendine.'),
                ],
              },
            ],
            next: '$stay',
          }),
          option('KA_SONSOZ', 'Duruşmanın sonunda son söz hakkın olacak. Ne söylemek istersin, düşündün mü?', {
            effects: [raise('kaan_hazir')],
            score: { SAVUNMA_STRATEJISI: 30 },
            responses: [
              {
                lines: [
                  s(
                    'kaan',
                    'Son söz mü? Bir cümle mi? … Düşüneceğim. Kısa olsun. Kısa cümleleri severim; uzun cümlelerde kayboluyorum.',
                  ),
                  me('Doğru olsun yeter. Kısa ya da uzun.'),
                  s('kaan', 'Doğru olsun. Tamam. Bunu yazıyorum. Elime.'),
                ],
              },
            ],
            next: '$stay',
          }),
          rawChoice('CONTINUE', 'KA_BITIR', 'Görüşmeyi bitir', { role: 'BACK', next: '$return' }),
        ],
      }),
    ),
    toHub(
      conversation('ARA_DEFNE', {
        ...INV2,
        title: 'Defne',
        background: 'buro_gece',
        room: { label: 'TELEFON · DEFNE YILDIZ', character: 'defne' },
        lines: [
          {
            lines: [
              card('22.30 — TELEFON', 'buro_gece'),
              s('defne', 'Avukat hanım, bir şey var. Telefonda söylemek istemiyorum ama… söyleyeceğim.'),
              s(
                'defne',
                'Barış’ın bir arkadaşı varmış, Okan. Kaan’ın kafesine uğruyormuş. Dün eczaneye geldi. “Biraz para verirseniz mahkemeye gider, ‘Barış bana itiraf etti, mallar onundu’ derim” dedi.',
                'uzgun',
              ),
              s('defne', 'Beş bin lira istiyor. Veririm. Kardeşim için her şeyi veririm. Siz ne dersiniz?'),
              th('Bir anahtar daha. Bu sefer yanlış kapının anahtarı.'),
            ],
          },
        ],
        choices: [
          option(
            'DN_RED',
            'Hayır. Bu yalan tanıklık olur. Okan gerçekten bir şey biliyorsa savcılığa kendisi gitsin; parasız.',
            {
              score: { SAVUNMA_STRATEJISI: 60 },
              effects: [raise('okan_red')],
              good: 'Para karşılığı tanıklık, yalan tanıklığa azmettirmedir (TCK 272, 38) ve savunmayı bütünüyle çökertir. Gerçek bir bilgi varsa yolu savcılıktır (CMK 158).',
              responses: [
                {
                  lines: [
                    s('defne', 'Ama o zaman Kaan…', 'uzgun'),
                    me(
                      'Kaan’ı yalanla kurtaramayız, Defne Hanım. Yalan, onun doğrusunu da yanında götürür. Okan bir gün kürsüde çözülür ve Kaan’ın her sözü onunla birlikte düşer.',
                    ),
                    s('defne', 'Haklısınız. Biliyorum. Bilmek bazen yetmiyor. Gece üçte insan her kapıyı çalıyor.'),
                    th(
                      'Gece üçte herkes her kapıyı çalar. Bir avukatın işi, hangi kapının açılmaması gerektiğini bilmektir.',
                    ),
                    s(
                      'defne',
                      'Zarfı geri koydum. Kaan’ın tedavisine harcarım. Doktor grup terapisi önerdi; ücretli. Bunun için harcarım.',
                    ),
                  ],
                },
              ],
              next: '$stay',
            },
          ),
          option('DN_DINLE', 'Önce Okan’ın gerçekten ne bildiğini öğrenelim. Para konuşmadan.', {
            effects: [raise('okan_red')],
            score: { SAVUNMA_STRATEJISI: 20 },
            neutral: 'Bilgi kaynağını dinlemek meşrudur; ama parayla bağlanan bir bilgi tanık değeri taşımaz.',
            responses: [
              {
                lines: [
                  n(
                    'Ertesi gün Okan’la eczanenin önünde beş dakika konuştum. Defne’nin yanında. Okan sigarasını yere atıp ezdi.',
                  ),
                  voice(
                    'OKAN',
                    'Barış bir şey söylemedi abla. Ben duydum diyeceğim, o kadar. Para yoksa… yok o zaman.',
                    'whisper',
                  ),
                  th('Bir şey bilmiyordu. Satacak bir yalanı vardı, o kadar. Defne zarfını çantasına geri koydu.'),
                ],
              },
            ],
            next: '$stay',
          }),
          option('DN_KABUL', 'Okan’la konuşalım. Ne söyleyeceğini birlikte hazırlarız; tutarlı olsun.', {
            score: { SAVUNMA_STRATEJISI: -100 },
            effects: [raise('okan_tanik'), inc('ethics', 2)],
            bad: 'Tanığı “hazırlamak” ve para karşılığı beyan almak yalan tanıklığa azmettirmedir (TCK 272, 38); avukat için ağır disiplin ihlali (Av.K. 34; TBB Meslek Kuralları). Savunmanın bütün gerçekleri bu yalanla birlikte düşer.',
            responses: [
              {
                lines: [
                  s('defne', 'Tamam. Yarın Okan’ı büroya getiririm. Beş bin lira. Tamam.'),
                  th(
                    '“Tutarlı olsun” dedim. Bir yalanın tutarlı olmasını istedim. Ve bunu bir avukat olarak söyledim.',
                  ),
                ],
              },
            ],
            next: '$stay',
          }),
          rawChoice('CONTINUE', 'DN_BITIR', 'Telefonu kapat', {
            role: 'BACK',
            next: '$return',
            visibleWhen: any(flag('okan_red'), flag('okan_tanik')),
          }),
        ],
      }),
    ),
    toHub(
      conversation('ARA_NESRIN', {
        ...INV2,
        title: 'Zemin kat',
        background: 'ev',
        room: { label: 'IHLAMUR SOKAK 14 · DAİRE 1', character: 'nesrin' },
        lines: [
          {
            lines: [
              card('IHLAMUR SOKAK 14 — DAİRE 1, AKŞAMÜSTÜ', 'ev'),
              n(
                'Bu sefer kapının zinciri takılı değildi. Nesrin Hanım beni görünce mutfağa döndü; çaydanlık zaten ocaktaydı.',
              ),
              s(
                'nesrin',
                'Gel evladım. Duydum, mahkemede kilitten bahsetmişsin. Polis “keskiyle açtık” demiş. Ben söylemiştim.',
              ),
              s(
                'nesrin',
                'Bak, şu kedi var ya, Pamuk. O sabah merdivende o vardı benimle. O da gördü. Ama onu tanık yazmazlar herhalde.',
                'mutlu',
              ),
              th('Bir kedi, bir defter, bir dikiş makinesi. Bu dosyanın en sağlam tanığı belki de bu evde oturuyor.'),
            ],
          },
        ],
        choices: [
          option(
            'NS2_DEFTER',
            'Defterinizin o sayfalarının fotokopisini alabilir miyim? Mahkemede aslını da görmek isteyebilirler.',
            {
              visibleWhen: has('clue_kira_defteri'),
              score: { ARASTIRMA: 40 },
              responses: [
                {
                  lines: [
                    s(
                      'nesrin',
                      'Fotokopi mi? Köşedeki kırtasiyeye gidelim. Aslını mahkemeye kendim getiririm; kimseye vermem. Rahmetli “aslı sende kalsın” derdi.',
                    ),
                    n(
                      'Kırtasiyede fotokopi makinesi iki kez sıkıştı. Nesrin Hanım her sayfayı ayrı ayrı düzeltti, parmağıyla bastırdı.',
                    ),
                    th(
                      'Bir defterin iki sayfası. Bir hayaletin kira makbuzu. Ve bir kadın, aslını kimseye vermeyeceğini söyleyen.',
                    ),
                  ],
                },
              ],
              next: '$stay',
            },
          ),
          option('NS2_BARIS', 'Barış hiç misafir getirir miydi? Ya da biri onu sorar mıydı?', {
            score: { SORGULAMA: 30 },
            responses: [
              {
                lines: [
                  s(
                    'nesrin',
                    'Misafir getirmezdi. Ama gece kapının önünde konuşurdu biriyle. Ben perdeyi kapatırdım. Kırmızı bereli olan… o gelirdi galiba.',
                  ),
                  s('nesrin', 'Galiba diyorum, evladım. Emin değilim. Gece, gözlük yok. Sen bunu yazma.'),
                  th('Yazmadım. Bir tanığın “galiba”sı, onun değil benim kalemimde güçlenir. Onu orada bıraktım.'),
                ],
              },
            ],
            next: '$stay',
          }),
          option('NS2_KEDI', 'Pamuk’a da teşekkür edin benim yerime.', {
            effects: [inc('trust', 2)],
            responses: [
              {
                lines: [
                  s(
                    'nesrin',
                    'Ederim. Pamuk teşekkürden anlamaz ama mamadan anlar. Sen de bir dahaki sefere bir kutu getir.',
                    'mutlu',
                  ),
                  th('Bir davanın ortasında bir kutu kedi maması. Not defterime yazdım; altını çizdim.'),
                ],
              },
            ],
            next: '$stay',
          }),
          rawChoice('CONTINUE', 'NS2_BITIR', 'Teşekkür et ve çık', { role: 'BACK', next: '$return' }),
        ],
      }),
    ),
    choiceNode('ARA_BODRUM', {
      ...INV2,
      title: 'Bodrum',
      background: 'ev',
      lines: [
        {
          lines: [
            card('CUMARTESİ 11.20 — TELEFON', 'ev'),
            s(
              'nesrin',
              'Evladım, sen misin? Nesrin. Bodruma kömürlüğe indim, kediler oraya kaçtı. Yedi numaranın kömürlüğü açık.',
            ),
            s(
              'nesrin',
              'İçinde bir çanta var. Turuncu, kocaman, kuryelerin taşıdığından. Astarı yırtılmış. İçinde bir şey yok gibi ama… kokusu tuhaf.',
              'saskin',
            ),
            s('nesrin', 'Kaan’ın ablası gelip “atalım” der diye korktum. Sana sordum. Ne yapayım?'),
            th(
              'Bir çanta. Astarı yırtık. Arka odanın kiracısının çantası olabilir. Ve şu an bir kömürlükte, bir kedi kadar korumasız.',
            ),
          ],
        },
      ],
      prompt: 'Bodrumdaki çanta: ne yapacaksın?',
      choices: [
        option('BD_SAVCI', 'Dokunmayın, kimse dokunmasın. Savcılığa hemen bildiriyorum; el koysunlar.', {
          score: { USUL_BILGISI: 80 },
          effects: [raise('canta_savci')],
          good: 'Doğru yol: olası delil yerinde korunur, savcılığa bildirilir ve kolluk tutanakla el koyar (CMK 123, 127). Delil zinciri korunur; çanta mahkemede kullanılabilir.',
          responses: [
            {
              lines: [
                n(
                  'Bir saat sonra iki kolluk görevlisi bodrumdaydı; eldivenle, poşetle, tutanakla. Nesrin Hanım merdivenin başında, kucağında kedi.',
                ),
                n(
                  'Görevlilerden biri çantanın astarını el fenerinin ışığında açtı; içinde elle dikilmiş bir bölme. Hiçbir şey söylemedi. Söylemesine gerek yoktu.',
                ),
                s('nesrin', 'Bu sefer bana saat sordular evladım. Saati ben yazdım. On iki on beş.'),
                th('Bu sefer tutanakta doğru saat var. Bazen adalet bir saatin doğru yazılmasıdır.'),
              ],
            },
          ],
          next: HUB,
        }),
        option('BD_AL', 'Geliyorum. Çantayı alıp mahkemeye ben götürürüm.', {
          score: { USUL_BILGISI: -60 },
          effects: [raise('canta_deniz'), inc('ethics')],
          bad: 'Avukat olası bir delile el koyamaz: delil zinciri kopar, çanta hükme esas alınamaz ve sen de delile müdahale kuşkusunun içine girersin. El koyma kolluk ve savcılığın işidir (CMK 123, 127).',
          responses: [
            {
              lines: [
                n(
                  'Kömürlük nem ve kedi kokuyordu. Çantayı bir çöp poşetine koydum. Elimde ağırlığı yoktu; ama taşırken ağırlaştı.',
                ),
                th('Bir çantayı taşıdım. Yanında bir soruyu da taşıdım: bunu mahkemeye kim getirdi, nasıl getirdi?'),
              ],
            },
          ],
          next: HUB,
        }),
        option('BD_FOTO', 'Bir fotoğrafını çekip bana gönderin; sonra bakarız.', {
          effects: [raise('canta_foto')],
          neutral: 'Fotoğraf bir başlangıçtır ama el koyma değildir: çanta yerinde korunmazsa kaybolabilir.',
          responses: [
            {
              lines: [
                n('Bulanık bir fotoğraf geldi: turuncu bir çanta, yırtık bir astar, bir kedinin kuyruğu.'),
                n('Üç gün sonra Nesrin aradı: kömürlük boşalmıştı. Çöp kamyonu mu, biri mi; bilmiyordu.'),
                th('Sonra bakarız dedim. Sonra diye bir şey yokmuş.'),
              ],
            },
          ],
          next: HUB,
        }),
      ],
    }),
    choiceNode('ARA_SUC', {
      ...INV2,
      title: 'Suç duyurusu',
      background: 'adliye',
      lines: [
        {
          lines: [
            card('ADLİYE — NÖBETÇİ CUMHURİYET SAVCILIĞI', 'adliye'),
            n(
              'Nöbetçi savcılığın koridorunda kırık bir floresan, bir su sebili, iki kelepçeli şüpheli ve bir çaycı. Sıramı bekledim. Kırk dakika.',
            ),
            th(
              'Bir avukatın kovalayabileceği tek şey bir dilekçedir. Şüpheliyi aramak, bulmak, yakalamak başkalarının işi. Benim işim onlara doğru adresi vermek.',
            ),
          ],
        },
      ],
      prompt: 'Nöbetçi savcılık. Kim hakkında, hangi somut bilgiyle?',
      choices: [
        option('SC_KIMLIK', 'Barış Demirel hakkında; kimlik, Bursa adresi ve kurye kayıtlarıyla suç duyurusu', {
          visibleWhen: any(has('ev_kurye'), flag('fact_soyad'), has('ded_demirel')),
          score: { USUL_BILGISI: 60 },
          effects: [raise('suc_duyurusu')],
          good: 'Somut kimlik ve delille ihbar (CMK 158): şüpheliyi aramak ve yakalamak kolluğun ve savcılığın işidir. Avukat delili gösterir, kovalamaz.',
          responses: [
            {
              lines: [
                s(
                  'savci',
                  'Barış Demirel. Karşıyaka. Personel kaydı, GPS. … Peki. Bunu bir soruşturma numarasına bağlarım. Yakalama kararı için yeterli olabilir.',
                ),
                s('savci', 'Bir şey soracağım, avukat hanım. Bunu ona gitmeden, onu aramadan mı topladınız?'),
                me('Kâğıtlardan, Sayın Savcı. Kâğıtlardan ve bir ev sahibinin defterinden.'),
                s('savci', 'İyi. Öyle kalsın.'),
                th('Savcı bir isim istemişti. Bir isim götürdüm. İsim artık bir dosyanın kapağında.'),
              ],
            },
          ],
          next: HUB,
        }),
        option('SC_MECHUL', 'Arka odanın kiracısı olan meçhul şahıs hakkında suç duyurusu', {
          visibleWhen: not(any(has('ev_kurye'), flag('fact_soyad'), has('ded_demirel'))),
          neutral: 'Kimliği belirsiz kişi hakkında ihbar alınır ama somut bilgi olmadan sonuç doğurmaz.',
          responses: [
            {
              lines: [
                s(
                  'savci',
                  'Meçhul şahıs. Uzun boylu, sakallı, motorlu. Bursa’da kırk bin kurye var, avukat hanım. Bir soyadı getirin.',
                ),
              ],
            },
          ],
          next: HUB,
        }),
        option('SC_TOLGA', 'Tolga Kaplan hakkında iftira suçundan suç duyurusu', {
          score: { USUL_BILGISI: -40 },
          bad: 'Muhbirin yalan söylediği henüz ispatlanmadı; erken bir iftira isnadı hem tanığı karşı tarafa iter hem de somut dayanak olmadığından geri teper. Çelişki önce duruşmada ortaya konur.',
          responses: [
            {
              lines: [
                s(
                  'savci',
                  'Muhbiri mi şikâyet ediyorsunuz? Duruşmadan önce? Kürsüde çürütün, sonra gelin. Bunu ben de görürüm o zaman.',
                ),
              ],
            },
          ],
          next: HUB,
        }),
        nav('SC_GERI', 'Vazgeç', HUB, { role: 'BACK' }),
      ],
    }),
    toHub(
      deductionBoard('ARA_CIKARIM', {
        ...INV2,
        title: 'Çıkarım Tahtası',
        background: 'buro_gece',
        lines: [{ lines: [n('İki ipucunu seç. Yeni kartlar eskilerle de konuşur.')] }],
        pool: [
          'clue_gps',
          'clue_istifa',
          'clue_selim_tolga',
          'clue_selim_astar',
          'clue_z_rapor',
          'clue_nesrin_moto',
          'clue_tolga_kask',
          'clue_tolga_saat',
          'clue_iki_tane',
        ],
        recipes: [
          fresh(
            'CB_KACIS',
            'clue_gps',
            'clue_nesrin_moto',
            'ded_kacis',
            'Baskını gören kurye',
            'GPS 06.21’de kırk saniyelik bir duruş; Nesrin aynı dakikada dönen motoru gördü. Barış baskını gördü ve gitti.',
          ),
          fresh(
            'CB_TOLGA',
            'clue_selim_tolga',
            'clue_tolga_kask',
            'ded_tolga_baris',
            'Tolga’nın satıcısı',
            'Tolga durağa gelip Barış’ı soruyordu; ifadesinde kapıdaki adamın elinde kask vardı. Muhbir satıcıyı tanıyordu ve adını vermedi.',
          ),
          fresh(
            'CB_ALIBI',
            'clue_z_rapor',
            'clue_tolga_saat',
            'ded_alibi',
            'Satış anında kafede',
            'Satış 23.00’te; Kaan 23.18’de satış yapmış, 23.41’de kasayı kapatmış. Kaan o kapıda olamaz.',
          ),
        ],
        miss: fallback('FB_ARA_CIKARIM', 'COMBINE', {
          repeat: 'ONCE_PER_PARAMS',
          score: { DELIL_ANALIZI: -50 },
          feedback: {
            title: 'Bu ikisi birbirini açıklamıyor',
            text: 'Başka bir çift dene.',
            label: 'BAĞLANTI YOK · −50 SKOR',
            tone: 'error',
          },
        }),
        finish: { id: 'ARA_CIKARIM_BITIR' },
      }),
    ),
    story('ARA_LEYLA', {
      ...INV2,
      title: 'Leyla’ya danış',
      background: 'buro',
      lines: [
        {
          when: flag('okan_tanik'),
          lines: [
            n('Leyla, Defne’nin yarın büroya birini getireceğini duymuştu. Gözlüğünü çıkardı.'),
            s(
              'leyla',
              'Bir tanığı hazırlamak ile bir tanığı uydurmak arasındaki çizgiyi biliyorsun, Deniz. O çizgiyi geçersen geri dönemezsin. Müvekkilin de dönemez.',
            ),
            s('leyla', 'Hâlâ vaktin var. Telefonu aç ve iptal et. Ya da etme. Ama sonra bana sorma.'),
          ],
        },
        {
          when: all(has('ev_kurye'), not(flag('suc_duyurusu'))),
          lines: [
            s(
              'leyla',
              'Elinde bir isim var. Onu bir dosyanın kapağına yazdırmadıkça bir hayalet olarak kalır. Savcılık seni bekliyor; kendine bir “meçhul” daha istemiyor.',
            ),
          ],
        },
        {
          when: all(has('clue_tolga_kask'), not(has('ded_tolga_baris')), not(has('ded_alibi'))),
          lines: [
            n('Leyla bir sandalyeyi masamın yanına çekti ve oturdu. Bunu çok nadir yapardı.'),
            s(
              'leyla',
              'Muhbir kürsüye gelecek. Ondan ne bekliyorsun? Yalanını söylemesini değil; yalanının bir yerinde takılmasını. Saat mi, kask mı, kin mi? Birini seç, ona hazırlan.',
            ),
          ],
        },
        {
          when: not(flag('kaan_riza')),
          lines: [
            s('leyla', 'Kaan’la konuş. Mahkeme onun ağzından ne duyacak, bilmeden kürsüye çıkma. Ama karar onun.'),
          ],
        },
        {
          lines: [
            n('Leyla kapı eşiğinde durdu; paltosu kolunda.'),
            s(
              'leyla',
              'Savcının yedek planı her zaman bir “ortak alan”dır. Şekerlik, mutfak, koridor. Arka odayı kazanıp mutfakta kaybetme.',
            ),
            s(
              'leyla',
              'Ve unutma: beraat iki türlüdür. Biri “yapmadı” der, biri “yaptığı ispatlanamadı.” Hangisini istediğine değil, hangisini ispatlayabildiğine bak.',
            ),
          ],
        },
      ],
      choices: [nav('ARA_LEYLA_BITIR', 'Teşekkür et', HUB, { role: 'BACK' })],
    }),
    // --- İkinci celseye giden yol: koşullu hafıza zinciri ---
    decisionNode('ARA_SON_1', [{ to: 'ARA_SON_2' }], {
      ...INV2,
      title: 'İkinci celseden önce',
      lines: [
        {
          lines: [
            card('16 ŞUBAT · PAZARTESİ 08.30 — ADLİYE ÖNÜ', 'adliye'),
            n(
              'Lodos dinmiş, yerini kuru bir ayaza bırakmıştı. Adliye merdivenlerinde sigara içen avukatlar, ellerinde dosyalar, gözlerinde başka davalar.',
            ),
            th(
              'Üç hafta önce bu merdivenlerden bir hayaletle çıktım. Bugün çantamda bir soyadı, bir saat ve bir kask var. Ve hâlâ bir soru: yeterli mi?',
            ),
          ],
        },
      ],
    }),
    decisionNode('ARA_SON_2', [{ to: 'ARA_SON_3' }], {
      ...INV2,
      lines: [
        {
          when: flag('suc_duyurusu'),
          lines: [
            th(
              'Barış Demirel artık bir soruşturma numarası. Yakalandı mı, bilmiyorum. Savcı bu sabah bana bakıp başını salladı; ne demek olduğunu bilmiyorum.',
            ),
          ],
        },
        {
          lines: [th('Barış hâlâ bir hayalet. Bugün kürsüde onun adını başka birinin ağzından duymam gerekecek.')],
        },
      ],
    }),
    decisionNode('ARA_SON_3', [{ to: 'T_00K' }], {
      ...INV2,
      lines: [
        {
          when: flag('okan_tanik'),
          lines: [th('Okan koridorda, Defne’nin yanında. Yeni bir gömlek giymiş. Elleri titriyor. Benimkiler de.')],
        },
        {
          when: any(has('ded_alibi'), has('ded_tolga_baris'), has('ded_kask')),
          lines: [
            th(
              'Tolga bugün gelecek. Zorla getirilecek. Çantamda onun kendi cümlesi var: kask. Ve belki bir saat. Bir yalan, kendi ayrıntısında boğulur.',
            ),
          ],
        },
        {
          lines: [
            th(
              'Tolga bugün gelecek. Elimde onun hikâyesini çözecek ne var? Yeterince yok. Belki de var; kürsüde göreceğim.',
            ),
          ],
        },
      ],
    }),
  ],
  triggers: [
    {
      id: 'tg_ara_day',
      scope: HUB,
      priority: 1,
      when: all(cmp(v('ap2'), '<=', 0), cmp(v('day2'), '<', 2)),
      goto: 'ARA_DAY_END',
    },
  ],
  discoveryPaths: kurye.discoveryPaths,
};
