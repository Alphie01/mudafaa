import {
  all,
  any,
  cmp,
  cont,
  courtSession,
  dec,
  decisionNode,
  deliver,
  fallback,
  flag,
  ground,
  has,
  hl,
  ifThen,
  inc,
  mark,
  not,
  objectRule,
  option,
  presentRule,
  pressRule,
  raise,
  ref,
  resultNode,
  score,
  statement,
  story,
  strategyAmount,
  v,
  choiceNode,
  meet,
} from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { TRIAL, VERDICT, card, court2, me, n, s, th, voice } from './shared.js';
import { wrongEvidence } from './hearing-1.js';

// 80-trial: ikinci celse. Ara karar cevapları ve gecikmeli deliller, (sahte tanık çöküşü), Nesrin, Tolga'nın çapraz
// sorgusu, delil tartışması (arama, şekerlik), mütalaa ve CMK 226 ek savunma, esas savunma, son söz, hüküm.

const teslim = deliver('T_00', [
  {
    evidence: 'ev_canta',
    requires: flag('canta_savci'),
    hint: 'Bodrumdaki çantayı savcılığa bildirip el konulmasını sağlayabilirdin.',
  },
  {
    evidence: 'ev_iz_eslesme',
    requires: all(flag('suc_duyurusu'), flag('tehdit_bildirildi')),
    hint: 'Kimlikle suç duyurusu ve gece gelen telefonun bildirimi Barış’ın yakalanmasını sağlayabilirdi.',
  },
]);

export const trial: CasePart = {
  config: {
    objectionGrounds: [
      ground('g_kanaat', 'Tanığın kişisel kanaati', 'CMK 217'),
      ground('g_telkin', 'Telkin edici soru', 'CMK 201/1'),
      ground('g_duyum', 'Görmediğini duyuma dayanarak aktarma', 'CMK 210, 217'),
    ],
  },
  court: {
    sessions: [
      courtSession('cs_2', '2. Celse', [
        ['s2_acilis', 'ACILIS', 'T_00'],
        ['s2_tanik', 'TANIK_DINLEME', 'T_02'],
        ['s2_delil', 'DELIL_TARTISMA', 'T_04'],
        ['s2_mutalaa', 'MUTALAA', 'T_05'],
        ['s2_savunma', 'SAVUNMA', 'T_06'],
        ['s2_son_soz', 'SON_SOZ', 'T_07'],
        ['s2_karar', 'KARAR', 'T_08'],
      ]),
    ],
  },
  nodes: [
    story('T_00K', {
      ...TRIAL,
      title: 'Koridor',
      background: 'adliye',
      lines: [
        {
          lines: [
            card('16 ŞUBAT · 09.45 — ADLİYE, İKİNCİ KAT KORİDORU', 'adliye'),
            n(
              'Koridorun bankları yine doluydu. Bir köşede Defne, elinde iki karton bardak çay. Yanında Nesrin Hanım; kucağında kareli defteri, çantasının sapına iliştirilmiş bir kedi tüyü.',
            ),
            s(
              'nesrin',
              'Evladım, sabah kedileri komşuya bıraktım. Beşi birden. Komşu “Nesrin abla, bu ne hâl” dedi. Mahkeme dedim. Sustu.',
            ),
            s('defne', 'Kaan aşağıda. Bu sabah aradı; “ablacım, avucuma yazdım” dedi. Ne yazdı bilmiyorum. Sormadım.'),
            n(
              'Koridorun öbür ucunda iki polisin arasında kırmızı bereli bir adam duvara yaslanmıştı. Zorla getirilmişti. Gözleri yerdeydi; arada bir merdivene bakıyordu, bir kapı arar gibi.',
            ),
            th('Tolga. Bu dosyanın ilk cümlesini yazan adam. Bugün son cümlesini de o yazabilir. Ya da ben.'),
            n(
              'Kaan’ı aşağıdan getirdiler. Koridora girince Tolga’yı gördü. Durdu. Tolga yere baktı. Kaan bir an yürümeyi unuttu; sonra jandarma koluna dokundu, yürüdü.',
            ),
            s('kaan', 'Tolga. … Neyse.', 'uzgun'),
            n(
              'Nesrin Hanım çayını üfledi, bana döndü. Gözlüğünün üstünden, ilk gün kapıyı zincirini çıkarmadan açtığı bakışla.',
            ),
            s('nesrin', 'Ne diyeyim içeride? Söyle bana, ezberleyeyim. Yaşlıyım, karıştırırım.'),
          ],
        },
      ],
      choices: [
        option('TK_A', 'Ezberlemeyin. Ne gördüyseniz onu anlatın; hatırlamadığınızı “hatırlamıyorum” deyin.', {
          score: { SORGULAMA: 50 },
          good: 'Tanığa ne söyleyeceğini söylemedin: tanığın beyanı onun kendi algısı olarak kalmalıdır (TBB Meslek Kuralları; TCK 277’nin koruduğu yargı görevi).',
          responses: [
            {
              lines: [
                s('nesrin', 'Hatırlamıyorum demek ayıp değil mi?'),
                me('Hayır. Uydurmak ayıp. Hatırlamamak insanlık.'),
                s(
                  'nesrin',
                  'Rahmetli de öyle derdi. “Nesrin, bilmediğin yerde sus.” Ben hiç susmadım ama. Bugün susarım.',
                  'mutlu',
                ),
              ],
            },
          ],
          next: 'T_00',
        }),
        option('TK_B', 'Motoru kullananın Barış olduğunu mutlaka söyleyin; gerisini ben hallederim.', {
          score: { SORGULAMA: -60 },
          effects: [raise('nesrin_telkin'), inc('ethics')],
          bad: 'Tanığa duruşmadan önce ne söyleyeceğini dikte etmek tanığı etkilemektir; beyanın değerini yok eder ve meslek kurallarına aykırıdır (TCK 277, TBB Meslek Kuralları).',
          responses: [
            {
              lines: [
                s(
                  'nesrin',
                  'Barış’tı demek lazım, tamam. Barış’tı. … Yüzünü görmedim ama evladım. Motorunu gördüm. Barış’tı derim, tamam.',
                  'saskin',
                ),
                th('Bir tanığın ağzına bir isim koydum. Kendi ağzımdan. Şimdi o isim onun değil, benim.'),
              ],
            },
          ],
          next: 'T_00',
        }),
        option('TK_C', 'Ben size bir şey söyleyemem, Nesrin Hanım. Sadece yemin ettiğinizi unutmayın.', {
          neutral:
            'Doğru bir sınır; ama tanığı kaygısıyla yalnız bıraktın. Hatırlamadığını söyleyebileceğini bilmek tanığın hakkıdır.',
          responses: [
            {
              lines: [
                s(
                  'nesrin',
                  'Yemin. Tabii. Yeminin ne olduğunu bilirim evladım. Rahmetliye de yemin etmiştim. Kırk iki yıl tuttum.',
                ),
              ],
            },
          ],
          next: 'T_00',
        }),
      ],
    }),
    decisionNode('T_00', [{ to: 'T_00A' }], {
      ...court2.base,
      title: 'İkinci celse',
      background: 'durusma_salonu',
      onEnter: [
        ...teslim.effects,
        ifThen(all(flag('suc_duyurusu'), flag('tehdit_bildirildi')), [raise('baris_yakalandi')]),
        ifThen(flag('canta_deniz'), [dec('cred'), score('USUL_BILGISI', -50, 'hatali')]),
      ],
      lines: [
        {
          lines: [
            card('16 ŞUBAT · PAZARTESİ 10.05 — BURSA 5. AĞIR CEZA MAHKEMESİ', 'durusma_salonu'),
            s('mubasir', 'Kaan Yıldız! Kaan Yıldız! Taraflar salona!'),
          ],
        },
        {
          when: flag('kaan_tahliye'),
          lines: [
            n(
              'Dinleyici sırasında Defne, yanında beyaz saçlı bir kadın. Kadın bir tespih çeviriyordu; tespihin her tanesinde bir an duruyor, sonra bırakıyordu.',
            ),
            n(
              'Kaan bu sefer jandarmasız girdi. Kendi ceketiyle; kolları yine kısa. Ablasının yanına oturmadı; sanık sırasına kendisi yürüdü.',
            ),
          ],
        },
        {
          lines: [
            n(
              'Kaan iki jandarmanın arasında girdi. Gözlükteki bant yenilenmişti. Kırk yedi gün; parmaklarıyla saydığını biliyordum.',
            ),
          ],
        },
      ],
    }),
    decisionNode('T_00A', [{ to: 'T_00B' }], {
      ...court2.base,
      lines: [
        {
          when: has('ev_canta'),
          lines: [
            s(
              'baskan',
              'Ara karar cevapları: Savcılığın el koyduğu kurye çantasına ilişkin laboratuvar ön raporu geldi. Çantanın astarındaki gizli bölmede kokain bulaşığı ve kilitli poşet artıkları tespit edilmiş.',
            ),
            th(
              'Bir çanta. Doğru saatte, doğru elle, doğru tutanakla. Bu sefer delil kendi ayağıyla gelmedi; usulle geldi.',
            ),
          ],
        },
        {
          when: flag('canta_deniz'),
          lines: [
            me('Sayın Başkan, binanın bodrumunda bulunan bir kurye çantasını mahkemenize sunmak istiyoruz.'),
            s(
              'savci',
              'İtiraz ediyorum. Bu çanta kimin elinden geçti, kim taşıdı, kim açtı? El koyma tutanağı yok. Müdafi delil toplamaz, Sayın Başkan.',
            ),
            s(
              'baskan',
              'İtiraz yerinde. Çanta hukuka uygun yolla elde edilmediğinden delil olarak kabul edilmedi. Müdafi, bu konuda baroya bildirim yapılması değerlendirilecek.',
            ),
            th(
              'Bir çantayı taşıdım ve bir davayı ağırlaştırdım. Delil gerçek olabilir; ama ben onu yanlış elle getirdim.',
            ),
          ],
        },
        {
          when: flag('canta_foto'),
          lines: [
            s(
              'baskan',
              'Ara karar cevapları okundu. Müdafiin sözünü ettiği bodrumdaki çanta kolluk tarafından yerinde bulunamamıştır.',
            ),
            th('Bir fotoğraf, bir kedinin kuyruğu, boş bir kömürlük. Sonra bakarız demiştim.'),
          ],
        },
        {
          lines: [s('baskan', 'Ara karar cevapları okundu.')],
        },
      ],
    }),
    decisionNode(
      'T_00B',
      [
        { when: flag('okan_tanik'), to: 'T_OKAN' },
        { when: all(flag('nesrin_istendi'), not(flag('nesrin_kus'))), to: 'T_01' },
        { to: 'T_02' },
      ],
      {
        ...court2.base,
        lines: [
          {
            when: flag('baris_yakalandi'),
            lines: [
              s(
                'baskan',
                'Bursa Cumhuriyet Başsavcılığının yazısı: Barış Demirel adlı şahıs İzmir Karşıyaka’da yakalanmış, ifadesi alınmış. Parmak izi karşılaştırma raporu dosyaya girdi.',
              ),
              s(
                'baskan',
                'Rapora göre terazinin kefesindeki iz, Barış Demirel’in sağ başparmağıyla on iki noktada uyumlu.',
              ),
              n('Salonda bir uğultu. Kaan başını kaldırdı, ablasına baktı. Defne gözlerini kapattı.', { fx: 'shake' }),
              th('Hayaletin bir parmağı vardı. O parmak terazideydi.'),
            ],
          },
          {
            when: all(flag('iz_istendi'), not(flag('baris_yakalandi'))),
            lines: [
              s(
                'baskan',
                'Terazideki izin karşılaştırılması talebine ilişkin kolluk yazısı: karşılaştırma için kişinin izinin alınması gerektiği, şahsın henüz bulunamadığı bildirilmiştir.',
              ),
              th('Bir iz, bir soyadı, bir adres. Eksik olan tek şey bir parmak.'),
            ],
          },
          {
            when: flag('suc_duyurusu'),
            lines: [
              s(
                'savci',
                'Bilgi olarak: müdafinin suç duyurusu üzerine Barış Demirel hakkında yakalama kararı çıkarıldı. Henüz yakalanamadı.',
              ),
              th('Bir dosyanın kapağında bir isim. Henüz bir yüz yok.'),
            ],
          },
          { lines: [s('baskan', 'Tanıkları alalım.')] },
        ],
      },
    ),
    story('T_OKAN', {
      ...court2.base,
      title: 'Tanık Okan',
      background: 'durusma_salonu',
      lines: [
        {
          lines: [
            s('mubasir', 'Savunma tanığı Okan Er! Okan Er!'),
            n('Okan yeni gömleğiyle kürsüye çıktı. Yemin ederken sesi çatladı; ikinci denemede düzeldi.'),
            voice('OKAN', 'Barış bana söyledi. “Mallar benimdi, Kaan’ın haberi yok” dedi. Kasımda, bir kafede.'),
            s('savci', 'Hangi kafede, tanık? Hangi gün? Saat kaçta?'),
            voice('OKAN', 'Bir kafede… Kahve Durağı’nda. Kasımın… ortası. Akşam.'),
            s(
              'savci',
              'Barış Demirel 12 Kasım’da Bursa’dan ayrıldı. Kayıtlar dosyada. Kasımın ortasında kiminle kahve içtiniz?',
            ),
            n('Okan sustu. Gözleri dinleyici sıralarında Defne’yi buldu. Defne başını eğdi.'),
            s(
              'savci',
              'Tanık, size bu ifade için bir şey teklif edildi mi? Yemin altındasınız. Yalan tanıklığın cezası size okundu.',
            ),
            voice(
              'OKAN',
              '…Beş bin lira. Abla verdi. Avukat hanım ne diyeceğimi yazdı. Ben… ben bir şey bilmiyorum. Barış bana hiçbir şey söylemedi.',
            ),
            n('Salon sustu. Sonra uğuldadı. Başkan tokmağa vurdu, bir kez daha vurdu.', { fx: 'shake' }),
            s(
              'baskan',
              'Tanık hakkında yalan tanıklık, tanığa ifade yazdıranlar hakkında azmettirme yönünden suç duyurusunda bulunulmasına. Müdafi hakkında baroya bildirim yapılmasına.',
            ),
            th(
              'Bir yalan, gerçeğin yanına oturdu ve gerçeği de alıp götürdü. Kilit, kroki, randevu kartı: hepsi şimdi bir yalanın gölgesinde.',
            ),
            s(
              'savci',
              'Sayın Başkan, savunmanın “ev arkadaşı” hikâyesi bugün para karşılığı bir tanıkla desteklenmek istendi.',
            ),
            s(
              'savci',
              'Bu hikâyeye hangi ağırlığı vereceğinizi takdirinize bırakıyorum. Esas hakkındaki görüşümüz iddianamedeki gibidir.',
            ),
          ],
        },
      ],
      choices: [cont('OKAN_DEVAM', 'Son söz', 'T_08', { role: 'PRIMARY' })],
    }),
    court2.stage('T_01', {
      title: 'Tanık Nesrin Uysal',
      courtStage: 'TANIK_DINLEME',
      witness: 'nesrin',
      witnessLabel: 'TANIK · NESRİN UYSAL',
      onFirstEnter: [meet('nesrin')],
      lines: [
        {
          when: flag('nesrin_telkin'),
          lines: [
            s('mubasir', 'Tanık Nesrin Uysal! Tanık Nesrin Uysal!'),
            n(
              'Nesrin Hanım kürsüye bir el çantası ve kareli bir defterle çıktı. Gözlüğünü taktı, yemini bir kez okuyarak, bir kez ezbere tekrar etti.',
            ),
            s(
              'nesrin',
              'Sabah altı yirmide kurye oğlanın motoru köşeye geldi, döndü. Altı kırkta beni yukarı çağırdılar; kapı açıktı, kilit yerdeydi.',
            ),
            s(
              'savci',
              'Tanık, bu duruşmadan önce sanığın avukatı sizinle görüştü mü? Size “Barış’ı gördünüz, değil mi” diye sordu mu?',
            ),
            s(
              'nesrin',
              'Sordu… Öyle sordu, evet. Ben de “galiba” dedim. Ama motoru gördüm, yemin ederim gördüm.',
              'saskin',
            ),
            s(
              'savci',
              'Galiba. Teşekkür ederim. Kayda geçsin, Sayın Başkan: tanığın motor sürücüsüne ilişkin teşhisi müdafiin sorusuyla şekillenmiştir.',
            ),
            th('O “galiba”yı ben söyletmiştim. Şimdi savcının ağzında bir silah oldu.'),
          ],
        },
        {
          lines: [
            s('mubasir', 'Tanık Nesrin Uysal! Tanık Nesrin Uysal!'),
            n(
              'Nesrin Hanım kürsüye bir el çantası ve kareli bir defterle çıktı. Gözlüğünü taktı, yemini bir kez okuyarak, bir kez ezbere tekrar etti.',
            ),
            s(
              'nesrin',
              'Sabah altı yirmide kurye oğlanın motoru köşeye geldi. Arabaları gördü, döndü gitti. Hep köşeye park ederdi, zinciri korkuluğa dolardı.',
            ),
            s(
              'nesrin',
              'Altı kırkta beni yukarı çağırdılar. Arka odanın kapısı açıktı, kilit yerdeydi. İmzala dediler; saati ben yazdım.',
            ),
            s('uye', 'Saati neden yazdınız, tanık?'),
            s(
              'nesrin',
              'Hep yazarım, Sayın Hâkim. Rahmetli muhasebeciydi. “Saatsiz imza, tarihsiz çek gibidir” derdi. Ben de o günden beri her imzanın yanına saat yazarım.',
            ),
            n('Salonda biri gülümsedi. Başkan bile. Nesrin Hanım fark etmedi; gözlüğünü düzeltti ve bekledi.'),
            s('savci', 'Tanık, avukat hanım sizinle görüştü mü? Size ne sordu?'),
            s('nesrin', 'Görüştü. “Ne gördünüz?” dedi. Ben de anlattım. Çay içtik. Kediler de oradaydı.'),
            s('savci', 'Teşekkür ederim.'),
            th('Bir tanığa cevap vermemek, onu korumaktır. Savcı sorusunu sordu ve elinde hiçbir şey kalmadı.'),
          ],
        },
      ],
      choices: [cont('T01_DEVAM', 'Tanığa soru sor', 'T_01Q')],
    }),
    court2.objection('T_01Q', {
      title: 'Müdafiin sorusu',
      courtStage: 'TANIK_DINLEME',
      witness: 'nesrin',
      witnessLabel: 'TANIK · NESRİN UYSAL',
      say: [s('baskan', 'Müdafi, tanığa sorunuz?')],
      next: 'T_02',
      options: [
        option('T01_A', 'Arka odada kimlerin kaldığını kaydettiniz mi? Defterinizi gösterir misiniz?', {
          visibleWhen: has('clue_kira_defteri'),
          score: { SORGULAMA: 100 },
          effects: [inc('pers'), raise('defter_sunuldu')],
          good: 'Tanığın olay zamanında tuttuğu kayıt, belleğinden daha güçlüdür: defter dosyaya girdi.',
          responses: [
            {
              lines: [
                s(
                  'nesrin',
                  '“20 Eylül, Barış, kurye oğlan, arka oda, Kaan’la paylaşıyor.” Bir sayfa önce: “Tolga çıkarıldı.” Rahmetli muhasebeciydi; ben de defter tutarım.',
                ),
                s('uye', 'Bu kaydı ne zaman yazdınız?'),
                s('nesrin', 'O gün, Sayın Hâkim. Kirayı aldığım gün. Her ayın yirmisi.'),
              ],
            },
          ],
        }),
        option('T01_B', 'Siz yukarı çıktığınızda arka odanın kapısı nasıldı?', {
          score: { SORGULAMA: 60 },
          effects: [inc('pers')],
          good: 'Tanığın doğrudan gözlemi aramanın seyrini ortaya koydu (CMK 119/4).',
          responses: [
            {
              lines: [
                s(
                  'nesrin',
                  'Açıktı. Kilit yerdeydi, ikiye bölünmüş. Ben çıkmadan açmışlardı. Bana sadece imza attırdılar.',
                ),
              ],
            },
          ],
        }),
        option('T01_C', 'Barış’ın uyuşturucu sattığını biliyor muydunuz?', {
          score: { SORGULAMA: -50 },
          effects: [dec('cred')],
          bad: 'Tanığa bilmediği bir şeyi sormak: savcının itirazı yerinde; tanık gördüğünü anlatır, tahmin etmez.',
          responses: [
            {
              lines: [
                s('savci', 'İtiraz. Tanık tahmine zorlanıyor.'),
                s('baskan', 'Yerinde. Tanık, bilmediğiniz konuda cevap vermeyin.'),
                s('nesrin', 'Bilmem ki. Pazar filemi taşırdı. O kadar.'),
              ],
            },
          ],
        }),
        option('T01_D', 'Sorum yok', { neutral: 'Tanığın defteri ve gözlemi sorulmadan kaldı.' }),
      ],
    }),
    court2.objection('T_02', {
      title: 'Muhbir tanık',
      courtStage: 'TANIK_DINLEME',
      witness: 'tolga',
      witnessLabel: 'TANIK · TOLGA KAPLAN',
      onFirstEnter: [meet('tolga')],
      lines: [
        {
          lines: [
            n(
              'Nesrin Hanım kürsüden indi, dinleyici sırasına oturdu, defterini kucağına koydu. Kaan’a gülümsedi; Kaan gözlerini indirdi, sonra kaldırdı, gülümsedi.',
            ),
            s('mubasir', 'Tanık Tolga Kaplan! Tanık Tolga Kaplan!'),
            n(
              'İki polisin arasında geldi; zorla getirilmişti. Kırmızı bere elinde, saçları dağınık. Kürsüye çıkarken sanık sırasına bakmadı.',
            ),
            n(
              'Yirmi dokuz yaşındaydı ama kırkında gibi görünüyordu. Tırnaklarının etleri Kaan’ınkiler gibi yenmişti. İki kullanıcı, aynı salonda, iki ayrı sırada.',
            ),
            th(
              'Ona öfkelenmem gerekirdi. Öfkelenemedim. Gece yarısı bir karakolda bir isim vermek zorunda kalan bir adam. Ama verdiği isim yanlış isimdi; bunu ona kendi sözleriyle göstereceğim.',
            ),
            s(
              'baskan',
              'Kimliğiniz tespit edildi. Gerçeği söylemekle yükümlüsünüz; yalan tanıklığın cezası size hatırlatıldı. Kendinizi suçlama tehlikesi olan sorulara cevap vermeyebilirsiniz.',
            ),
            s('tolga', 'Yemin ederim. Yani… bildiğimi söyleyeceğim.'),
            s('savci', 'Tanık, 9 Kasım gecesi üzerinizde bulunan paketi sanık Kaan Yıldız’dan aldınız, değil mi?'),
          ],
        },
      ],
      next: 'T_03',
      options: [
        option('T02_A', 'İtiraz: soru tanığa cevabı veriyor; açık sorulsun', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits'), inc('pers')],
          good: 'Telkin edici soru (CMK 201/1’in ruhu, CMK 192): muhbirin tek dayanağı onun kendi anlatımıdır; anlatımı savcının cümlesi olmamalı.',
          responses: [
            {
              lines: [
                s('baskan', 'Yerinde. Sayın Savcı, açık sorun.'),
                s('savci', 'Tanık, paketi kimden aldınız?'),
                s('tolga', 'Kaan’dan. Daire yedi. Yani… Kaan’dan.'),
              ],
            },
          ],
        }),
        option('T02_B', 'Sessiz kal', {
          effects: [dec('pers')],
          neutral: 'Telkin edici soru cevaplandı.',
          responses: [{ lines: [s('tolga', 'Evet. Kaan’dan aldım.')] }],
        }),
        option('T02_C', 'İtiraz: tanık bağımlıdır, dinlenemez', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Madde kullanımı tanıklığa engel değildir; beyanın güvenilirliği CMK 217 çerçevesinde değerlendirilir. Üstelik kendi müvekkilin de bir kullanıcıdır.',
          responses: [
            {
              lines: [
                s(
                  'baskan',
                  'Reddedildi. Tanıklık ehliyeti böyle sınırlanmaz, müdafi. Müvekkilinizin de bir kullanıcı olduğunu dosyadan biliyoruz.',
                ),
                s('tolga', 'Evet. Kaan’dan aldım.'),
              ],
            },
          ],
        }),
        option('T02_D', 'Bir dakika, Sayın Başkan; sanıkla görüşmek istiyorum', {
          neutral: 'Duruşma sırası buna uygun değildi; fırsat kaçtı.',
          responses: [{ lines: [s('baskan', 'Şimdi değil, müdafi.'), s('tolga', 'Kaan’dan aldım.')] }],
        }),
      ],
    }),
    court2.testimony('T_03', {
      title: 'Çapraz sorgu · Tolga Kaplan',
      courtStage: 'TANIK_DINLEME',
      witness: 'tolga',
      witnessLabel: 'TANIK · TOLGA KAPLAN',
      lines: [
        {
          lines: [
            s('tolga', 'Paketi o evden aldım. Kaan sattı. Herkes biliyordu zaten. Ben sadece… yakalandım, yani.'),
            n(
              'Bereyi dizinde ezip duruyordu. Arada bir savcıya bakıyordu, sanki bir sonraki cümleyi oradan okuyacakmış gibi.',
            ),
            th(
              'Bir muhbirin beyanı tek bir ayağa dayanır: kendi sözüne. O ayağı sallamak için ona yeni bir şey söylemem gerekmiyor. Kendi eski sözünü hatırlatmam yeter.',
            ),
            s('baskan', 'Tanık ifadesini verdi. Müdafi, sorularınız?'),
          ],
        },
      ],
      rulesText:
        'İpucu: Muhbirin anlatısı tek kişiye dayanıyor. Ayrıntısını, saatini ve nedenini sına; çözülme ancak çelişkiden sonra gelir.',
      objectionGrounds: ['g_kanaat', 'g_telkin', 'g_duyum'],
      statements: [
        statement('T1', 1, [
          'Paketi Daire 7’den aldım; ',
          hl('satan Kaan’dı', any(flag('contra_t3'), flag('contra_t4'))),
          '.',
        ]),
        statement('T2', 2, [
          'Kaan’ı tanırım; o evde o otururdu. ',
          hl('Herkes bilir ne iş yaptığını', any(flag('press_t2'), flag('fact_tolga_kin'))),
          '.',
        ]),
        statement('T3', 3, [
          'Kapıyı ',
          hl('o açtı', any(flag('press_t3'), has('ded_kask'))),
          ', paketi elime o verdi.',
        ]),
        statement('T4', 4, [
          'Saat ',
          hl('23.00 gibiydi', any(flag('press_t4'), has('ded_alibi'))),
          '; devriye beni hemen aşağıda durdurdu.',
        ]),
        statement('T5', 5, ['Paketi içeriden getirdi; ', hl('kasksız, terlikliydi'), '.'], flag('press_t3')),
      ],
      rules: [
        presentRule('PS_T_SAVCILIK', undefined, ['ev_kira', 'ev_sac', 'ev_mesaj'], {
          maxUses: 3,
          effects: [
            ...wrongEvidence,
            score('SORGULAMA', -150, 'hatali'),
            mark(
              'BAD',
              'Savcılığın delilini muhbire karşı sundun; bu belgeler onun anlatımını çürütmez, aksine destekler.',
              'SORGULAMA',
            ),
          ],
          responses: [
            { lines: [s('savci', 'Müdafi yine bizim delilimizi sunuyor, Sayın Başkan.'), s('baskan', 'Devam edin.')] },
          ],
        }),
        pressRule('PR_T1', 'T1', {
          score: { SORGULAMA: 25 },
          responses: [
            {
              lines: [
                me('Kaan olduğundan nasıl eminsiniz?'),
                s('tolga', 'Eminim. Kaç kere söyleyeyim. Kaan’dı. Yani… o evdeydi.'),
              ],
            },
          ],
        }),
        presentRule('PS_T1', 'T1', ['ev_iz_eslesme', 'ded_tolga_baris'], {
          enabledWhen: any(flag('contra_t3'), flag('contra_t4')),
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('tolga_kirildi'),
            raise('jar_cleared'),
            mark(
              'GOOD',
              'Muhbir çözüldü: paketi Barış Demirel’den aldığını ve korkudan ve kinden sanığın adını verdiğini kabul etti. Teşhisin tek dayanağı çöktü.',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              when: has('ev_iz_eslesme'),
              lines: [
                me('Terazideki iz Barış Demirel’in, tanık. Bu sabah dosyaya girdi. Barış İzmir’de yakalandı.'),
                n('Tolga bereyi iki eliyle sıktı. Bir süre kimseye bakmadı.', { fx: 'shake' }),
                s('tolga', 'Yakalandı mı? … Barış’tı. Barış’tan aldım. Hep ondan alırdım. Ekimden beri.', 'uzgun'),
                s(
                  'tolga',
                  '“Beni söylersen biterim seni” dedi. Arkasında İzmir’den adamlar var. Korktum. Kaan’ı söyledim çünkü Kaan beni sokağa atmıştı. Depozitomu kesti.',
                  'uzgun',
                ),
                s(
                  'tolga',
                  'O gece kapıyı Barış açtı. Koridordaki şekerlikten iki paket aldı, birini bana verdi. Kask elindeydi; çıkacaktı.',
                ),
                n('Salon uğuldadı. Başkan tokmağa vurdu. Kaan ilk kez Tolga’ya baktı; öfkeyle değil, yorgunlukla.', {
                  fx: 'shake',
                }),
                th('Muhbir kendi yalanının altında kaldı. Ve bir cümleyle şekerliği de arka odaya geri taşıdı.'),
              ],
            },
            {
              lines: [
                me(
                  'Tanık, ekimden beri Paketçi’nin Görükle durağına gidip Barış’ı soruyordunuz. Köşede konuşuyordunuz. Siz “param yarın gelecek” dediniz; o “yarın yok” dedi.',
                ),
                me(
                  'Ve ifadenizde kapıyı açanın elinde kask vardı. Kask taşıyan, motorlu kurye Barış Demirel’di. Kimden aldınız?',
                ),
                n('Tolga bereyi iki eliyle sıktı. Bir süre kimseye bakmadı.', { fx: 'shake' }),
                s(
                  'baskan',
                  'Tanık, size kendinizi suçlama tehlikesi olan sorulara cevap vermeyebileceğinizi hatırlatmıştım. Ama verdiğiniz cevaplar doğru olmak zorunda. Kimden aldınız?',
                ),
                n(
                  'Salonda bir sandalye gıcırdadı. Defne’nin elindeki poşet. Kaan başını kaldırdı ve Tolga’ya baktı; ilk kez, uzun uzun.',
                ),
                s('tolga', '…Barış’tı. Barış’tan aldım. Hep ondan alırdım.', 'uzgun'),
                s(
                  'tolga',
                  '“Beni söylersen biterim seni” dedi. Korktum. Kaan’ı söyledim çünkü Kaan beni sokağa atmıştı. Depozitomu kesti.',
                  'uzgun',
                ),
                s(
                  'tolga',
                  'O gece kapıyı Barış açtı. Koridordaki şekerlikten iki paket aldı, birini bana verdi. Kask elindeydi; çıkacaktı.',
                ),
                n('Salon uğuldadı. Başkan tokmağa vurdu. Kaan ilk kez Tolga’ya baktı; öfkeyle değil, yorgunlukla.', {
                  fx: 'shake',
                }),
                th('Muhbir kendi yalanının altında kaldı. Ve bir cümleyle şekerliği de arka odaya geri taşıdı.'),
              ],
            },
          ],
        }),
        presentRule(
          'PS_T1_ERKEN',
          'T1',
          ['ev_iz_eslesme', 'ded_tolga_baris', 'ded_kacis', 'ev_canta', 'ded_baris', 'ded_demirel'],
          {
            score: { SORGULAMA: 100 },
            effects: [
              inc('pers'),
              mark(
                'GOOD',
                'Arka odanın gerçek sahibine işaret ettin; ama muhbir henüz kendi anlatımında çelişkiye düşmeden geri adım atmaz.',
                'SORGULAMA',
              ),
            ],
            responses: [
              {
                lines: [
                  s('tolga', 'Barış mı? Kim Barış? Ben Kaan’dan aldım. Yani… o evde kim varsa. Kaan’dı.', 'kizgin'),
                  th('Erken. Önce onun kendi hikâyesini çatlatmam lazım: kask, saat. Sonra adı sor.'),
                ],
              },
            ],
          },
        ),
        pressRule('PR_T2', 'T2', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_t2')],
          responses: [
            {
              when: all(
                flag('fact_tolga_192'),
                any(flag('fact_tolga_kin'), flag('fact_tolga_n'), flag('fact_tolga_eski')),
              ),
              lines: [
                me('O evde siz de oturdunuz, değil mi? Arka odada. Neden ayrıldınız?'),
                s(
                  'tolga',
                  'Ayrıldım işte. … Beni çıkardı. Kira yüzünden. Depozitomu kesti, eşyalarımı kapının önüne koydu.',
                  'kizgin',
                ),
                me(
                  'Gece yarısı karakolda size satıcıyı söylerseniz cezanızın düşebileceği hatırlatılmış. “Yararlanmak istiyorum” demişsiniz. Bir isim vermeniz gerekiyordu.',
                ),
                me('Ve sizi sokağa atan adamın adını verdiniz.'),
                s('tolga', 'Bunun onunla ne ilgisi var? Yani… yok. Hiç ilgisi yok.', 'saskin'),
                s(
                  'savci',
                  'Sayın Başkan, tanığın etkin pişmanlıktan yararlanma isteği kayıtlıdır; bu, beyanının değerini kendiliğinden düşürmez.',
                ),
                s('baskan', 'Not edildi. Ama heyet beyanın neden verildiğini de değerlendirir.'),
                th(
                  '“Hiç ilgisi yok” diyen insanların cümleleri hep bir ilginin etrafında döner. Ve bir isim vermek zorunda olan bir adam, en kolay ismi verir.',
                ),
              ],
            },
            {
              when: any(flag('fact_tolga_kin'), flag('fact_tolga_n'), flag('fact_tolga_eski')),
              lines: [
                me('O evde siz de oturdunuz, değil mi? Arka odada. Neden ayrıldınız?'),
                s(
                  'tolga',
                  'Ayrıldım işte. … Beni çıkardı. Kira yüzünden. Depozitomu kesti, eşyalarımı kapının önüne koydu.',
                  'kizgin',
                ),
                me('Ve şimdi onun adını veriyorsunuz.'),
                s('tolga', 'Bunun onunla ne ilgisi var? Yani… yok. Hiç ilgisi yok.'),
                th('“Hiç ilgisi yok” diyen insanların cümleleri hep bir ilginin etrafında döner.'),
              ],
            },
            {
              lines: [
                me('“Herkes bilir” dediniz. Kim, neyi bilir?'),
                s('tolga', 'Herkes. Mahalle. Yani… duyuyorsun işte.'),
              ],
            },
          ],
        }),
        objectRule('OB_T2', 'T2', 'g_duyum', {
          score: { SORGULAMA: 50 },
          effects: [
            inc('pers'),
            mark(
              'GOOD',
              'İtiraz yerinde: “herkes bilir” tanığın kendi gözlemi değil, duyum. Mahkeme yalnızca tanığın doğrudan algıladığını esas alır (CMK 210, 217).',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              lines: [
                me('İtiraz, Sayın Başkan. Tanık görmediğini duyuma dayanarak anlatıyor.'),
                s('baskan', 'Yerinde. Tanık, “herkes” değil, siz ne gördünüz?'),
              ],
            },
          ],
        }),
        pressRule('PR_T3', 'T3', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_t3')],
          responses: [
            {
              lines: [
                me('Kapıyı açan kişiyi tarif eder misiniz? Ne giyiyordu, elinde ne vardı?'),
                s('tolga', 'Kaan. Normal. Eşofman. Paketi içeriden getirdi. Kasksız, terlikliydi.', 'saskin'),
                th('Kasksız. İfadesinde “elinde kask vardı” demişti. Gece yarısı karakolda söylediğini bugün unutmuş.'),
              ],
            },
          ],
        }),
        presentRule('PS_T3', 'T3', ['ded_kask', 'ded_kurye', 'ev_kurye'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_t3'),
            mark(
              'GOOD',
              'Muhbirin kendi ifadesindeki kask ayrıntısı, ehliyeti ve motosikleti olmayan sanıkla bağdaşmıyor; kapıyı açan, arka odadaki motorlu kuryeydi.',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              lines: [
                me(
                  'Gece 01.30’da verdiğiniz ifade: “Kapıyı açanın elinde kask vardı, aceleyle çıkacaktı.” Sanığın ehliyeti yok, motosikleti yok, kaskı yok. Arka odada ise bir kurye montu, bir zincir kilit, bir kask askısı.',
                ),
                me('Elinde kaskla kapıyı açan kimdi, tanık?'),
                s('tolga', 'Ben… kask demiş miyim? Gece yarısıydı. Kafam… yani…', 'saskin'),
                s('uye', 'Demişsiniz. İmzanız var.'),
                n('Tolga dudaklarını ısırdı. Elindeki bere bir bez parçası gibi buruşmuştu.'),
                th('Kendi cümlesi, kendi imzası. Bir yalanın en büyük düşmanı, ilk anlatılışıdır.'),
                s(
                  'savci',
                  'Sayın Başkan, tanığın gece yarısı verdiği ifadedeki ayrıntıların kesinliği tartışılabilir.',
                ),
                s('baskan', 'Tartışılabilir, Sayın Savcı. Ama tartışmayı tanığın kendi imzası başlattı.'),
              ],
            },
          ],
        }),
        presentRule('PS_T5', 'T5', ['ev_tolga_ifade'], {
          score: { SORGULAMA: 100 },
          effects: [
            inc('pers'),
            raise('contra_t5'),
            mark(
              'GOOD',
              'Tanığın duruşmadaki anlatımı kolluktaki ifadesiyle çelişiyor: kask vardı / kasksızdı.',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              lines: [
                me(
                  'Kolluk ifadeniz, Sayın Başkan, ikinci sayfa. “Elinde kask vardı.” Bugün “kasksız, terlikliydi.” Hangisi?',
                ),
                s('tolga', 'Hatırlamıyorum. Yani… kask olabilir. Olmayabilir.'),
              ],
            },
          ],
        }),
        pressRule('PR_T5', 'T5', {
          score: { SORGULAMA: 25 },
          responses: [
            {
              lines: [
                me('Kasksız, terlikli. Emin misiniz?'),
                s('tolga', 'Eminim. Yani… gece yarısıydı. Kapı aralıktı. Işık yoktu, otomatik sönmüştü.'),
                th(
                  'Işık yoktu ama terliği gördü. Kaskı ise ifadesinde gördü, bugün görmedi. Bellek seçici bir tanıktır.',
                ),
              ],
            },
          ],
        }),
        pressRule('PR_T4', 'T4', {
          score: { SORGULAMA: 25 },
          effects: [raise('press_t4')],
          responses: [
            {
              lines: [
                me('23.00’ten emin misiniz?'),
                s('tolga', 'Eminim. 23.09’da devriye durdurdu. On dakika önce aldım. Saat bende, yani… telefonda.'),
              ],
            },
          ],
        }),
        presentRule('PS_T4', 'T4', ['ded_alibi', 'ev_zrapor'], {
          score: { SORGULAMA: 300 },
          effects: [
            inc('pers', 2),
            raise('contra_t4'),
            mark(
              'GOOD',
              'Kafenin kasa kaydı sanığı satış saatinde on beş dakika uzakta, kasa başında gösteriyor: muhbirin anlatısı zaman bakımından imkânsız.',
              'SORGULAMA',
            ),
          ],
          responses: [
            {
              when: flag('fact_gps9'),
              lines: [
                me(
                  '9 Kasım, Kahve Durağı Z raporu: son satış 23.18, kasa kapanışı 23.41, kullanıcı kodu Kaan. Kafe Ihlamur Sokak’a yürüyerek on beş dakika.',
                ),
                me(
                  'Ve Paketçi’nin GPS kaydı: 22.58 ile 23.04 arasında binanın kapısında, siparişsiz bekleyen bir kurye cihazı. Barış Demirel’in.',
                ),
                s('tolga', 'Ben… saat yanlış olabilir. Yani belki on bir buçuk…', 'saskin'),
                s('uye', 'Devriye sizi 23.09’da yakalamış, tanık. Tutanak var.'),
                th('Saat, bir yalanın en inatçı tanığıdır. Kimse onu ikna edemez.'),
              ],
            },
            {
              lines: [
                me(
                  '9 Kasım, Kahve Durağı Z raporu: son satış 23.18, kasa kapanışı 23.41, kullanıcı kodu Kaan. Kafe Ihlamur Sokak’a yürüyerek on beş dakika.',
                ),
                me('Saat 23.00’te sanık kasa başında kahve satıyordu. Sizin kapınızda kim vardı?'),
                s('tolga', 'Ben… saat yanlış olabilir. Yani belki on bir buçuk…', 'saskin'),
                s('uye', 'Devriye sizi 23.09’da yakalamış, tanık. Tutanak var.'),
                th('Saat, bir yalanın en inatçı tanığıdır. Kimse onu ikna edemez.'),
              ],
            },
          ],
        }),
      ],
      presentMiss: fallback('FB_T03_PRESENT', 'PRESENT', {
        effects: [
          ...wrongEvidence,
          score('SORGULAMA', -150, 'hatali'),
          mark('BAD', 'Yanlış delil: sunduğun belge bu ifadeyle çelişmiyor.', 'SORGULAMA'),
        ],
        responses: [{ lines: [s('baskan', 'Bu delilin tanığın ifadesiyle ilgisini göremedik, müdafi.')] }],
      }),
      objectMiss: fallback('FB_T03_OBJECT', 'OBJECT', {
        effects: [
          dec('cred'),
          inc('wrong'),
          score('SORGULAMA', -50, 'hatali'),
          mark('BAD', 'Dayanaksız itiraz.', 'SORGULAMA'),
        ],
        responses: [{ lines: [s('baskan', 'İtiraz reddedildi.')] }],
      }),
      finish: { id: 'T03_BITIR', next: 'T_03S' },
    }),
    decisionNode('T_03S', [{ to: 'T_04' }], {
      ...court2.base,
      lines: [
        {
          when: flag('tolga_kirildi'),
          lines: [
            n(
              'Tolga kürsüden indirildi. Polislerden biri koluna girdi; bu sefer onu getirmek için değil, götürmek için. Savcı bir not yazıp altını iki kez çizdi.',
            ),
            n(
              'Kapıya varmadan Tolga durdu, sanık sırasına döndü. Bir şey söyleyecekti. Söylemedi. Bereyi başına geçirdi ve çıktı.',
            ),
            th(
              'Bir muhbirin dönüşü bir zafer gibi görünür. Değildir. Bir adam korkusunu söyledi; korktuğu adam hâlâ bir yerde.',
            ),
          ],
        },
        {
          when: any(flag('contra_t3'), flag('contra_t4')),
          lines: [
            n(
              'Tolga kürsüden indi. Bereyi başına geçirdi, çıkardı, yine geçirdi. Kapıya yürürken sanık sırasının önünden geçti; Kaan başını kaldırmadı.',
            ),
            voice('TOLGA', 'Ben… yani… ben söyledim işte.', 'whisper'),
            n(
              'Kimse ona cevap vermedi. Başkan tanığın serbest bırakılmasını tutanağa geçirdi; savcı kalemini bir süre havada tuttu.',
            ),
            th(
              'Satıcının adını söylemedi. Ama kendi hikâyesini taşıyamadı. Bazen bir yalan çökmez; sadece ağırlaşır ve sahibi onu kapıda bırakır.',
            ),
          ],
        },
        {
          lines: [
            n('Tolga kürsüden indi; sanık sırasına bakmadan, bereyi elinde ezerek. Savcı onaylar gibi başını salladı.'),
            th('Hikâyesi ayakta kaldı. Elimde onu çatlatacak bir ayrıntı ya yoktu ya da doğru anda çıkaramadım.'),
          ],
        },
      ],
    }),
    court2.objection('T_04', {
      title: 'Delillerin tartışılması · arama',
      courtStage: 'DELIL_TARTISMA',
      prosecutionEvidence: 'ev_tutanak',
      say: [
        s(
          'savci',
          'Sayın Başkan, arama hâkim kararıyla yapılmıştır. Arka odada ele geçen materyal dosyanın temel delilidir.',
        ),
        s('baskan', 'Müdafi, arama tutanağı ve ele geçen materyale karşı diyeceğiniz?'),
      ],
      next: 'T_04R',
      options: [
        option(
          'T04_A',
          'Arka oda kararın kapsamı dışında, kilit kırılarak arandı: hükme esas alınamaz (Anayasa 38/6, CMK 206/2-a, 217/2)',
          {
            effects: [
              ifThen(
                any(flag('contra_s1'), flag('contra_s3')),
                [
                  score('USUL_BILGISI', 150),
                  raise('key_excluded'),
                  inc('legal_hits'),
                  inc('pers'),
                  mark(
                    'GOOD',
                    'Arama kararı “şüphelinin kullanımındaki oda ve ortak alanlar” ile sınırlıydı; üçüncü kişinin kilitli odası zorla açıldı (CMK 119/1–2). Kapsam dışı aramayla elde edilen delil hukuka aykırıdır ve hükme esas alınamaz (Anayasa 38/6, CMK 206/2-a, 217/2, 230/1-b).',
                    'USUL_BILGISI',
                  ),
                ],
                [
                  score('USUL_BILGISI', -40),
                  mark(
                    'BAD',
                    'Kapsam dışı arama iddiası duruşmada ispatlanmadı: kilidin kırıldığını ve kararın kapsamını tanığa kabul ettirmedin.',
                    'USUL_BILGISI',
                  ),
                ],
              ),
            ],
            responses: [
              {
                when: any(flag('contra_s1'), flag('contra_s3')),
                lines: [
                  me(
                    'Sayın Başkan, karar arka odayı kapsamıyordu. Tanık kilidin keskiyle kesildiğini, odanın sanığa ait olduğunu “sandığını” birinci celsede kabul etti.',
                  ),
                  me(
                    'Hâkim, talep yazısında bir ev arkadaşı olduğunu bile bile sınırı çizmişti. Kolluk o sınırı bir keskiyle geçti. Kapsam dışı bir aramanın meyvesi, ne kadar ağır olursa olsun, hükmün kefesine konamaz.',
                  ),
                  s('savci', 'Sayın Başkan, kolluğun iyi niyetle hareket ettiği açıktır.'),
                  me('İyi niyet bir kilidi açmaz, Sayın Savcı. Bir karar açar.'),
                  s('baskan', 'Kayıtlara geçti. Heyet hükümde değerlendirecek.'),
                ],
              },
              {
                lines: [
                  me('Sayın Başkan, arama kapsamı aştı.'),
                  s('baskan', 'Bunu gösteren bir tespit dosyada yok, müdafi.'),
                ],
              },
            ],
          },
        ),
        option('T04_B', 'Materyal sanığa ait değil; arka oda üçüncü kişinin zilyetliğindeydi', {
          score: { DELIL_ANALIZI: 75 },
          good: 'Zilyetlik itirazı yerinde ama usul boyutu eksik kaldı: kapsam dışı arama ayrıca ileri sürülmeliydi.',
          responses: [{ lines: [s('baskan', 'Kayda geçti.')] }],
        }),
        option('T04_C', 'Arama gece vakti yapıldı (CMK 118)', {
          score: { USUL_BILGISI: -50 },
          effects: [dec('cred')],
          bad: 'Gece vakti, güneş batışından bir saat sonra başlayıp doğuşundan bir saat öncesine kadar süren zamandır (TCK 6/1-e). 11 Kasım’da Bursa’da güneş saat yediden sonra doğar; 06.05’te gece sona ermişti. Dayanaksız itiraz.',
          responses: [
            {
              lines: [
                s('savci', 'Saat altıyı geçmişti, güneşin doğuşuna bir saatten az vardı. Gece değil.'),
                s('baskan', 'Reddedildi.'),
              ],
            },
          ],
        }),
        option('T04_D', 'Diyeceğimiz yok', {
          bad: 'Kapsam dışı aramaya itiraz edilmedi; delil yasağı ileri sürülmedi.',
          category: 'USUL_BILGISI',
        }),
      ],
    }),
    decisionNode('T_04R', [{ when: flag('jar_cleared'), to: 'T_05' }, { to: 'T_04B' }], { ...court2.base }),
    court2.objection('T_04B', {
      title: 'Delillerin tartışılması · şekerlik',
      courtStage: 'DELIL_TARTISMA',
      say: [
        s(
          'savci',
          'Arka oda ne olursa olsun, Sayın Başkan: şekerlik ortak alandaydı. Kavanozun üzerinde sanığın izi var. En azından o iki paket sanığın zilyetliğindeydi.',
        ),
        s('baskan', 'Müdafi?'),
      ],
      next: 'T_05',
      options: [
        option(
          'T04B_A',
          'Şekerlik arka oda kapısının dibindeydi; paketler arka odanın stoğundan. Kavanozdaki iz, kavanozu kullananı gösterir',
          {
            visibleWhen: has('ded_sekerlik'),
            score: { DELIL_ANALIZI: 150 },
            effects: [
              raise('jar_cleared'),
              inc('pers'),
              mark(
                'GOOD',
                'Aynı poşet, aynı kesim, aynı gramaj ve şekerliğin arka oda kapısındaki yeri: “ortak alan” tezi düştü. Kavanozdaki iz bir alışkanlığı gösterir, zilyetliği değil.',
                'DELIL_ANALIZI',
              ),
            ],
            responses: [
              {
                when: flag('fact_seker_k'),
                lines: [
                  me(
                    'Fotoğraf albümü, 23 numaralı kare: şekerlik koridordaki rafta, arka oda kapısına iki adım. Sanık şekerliğin mutfaktan oraya kiracı tarafından taşındığını anlattı.',
                  ),
                  me(
                    'Kriminal rapor: iki paket, arka odadaki kırk altı paketle aynı poşet, aynı kesim, aynı gramaj. Paketlerde sanığın izi yok; kavanozda var, çünkü sanık günde beş çay içiyor.',
                  ),
                  s('uye', 'Sayın Savcı, paketlerde iz var mı?'),
                  s('savci', 'Yok, Sayın Hâkim.'),
                ],
              },
              {
                lines: [
                  me('Fotoğraf albümü, 23 numaralı kare: şekerlik koridordaki rafta, arka oda kapısına iki adım.'),
                  me(
                    'Kriminal rapor: iki paket, arka odadaki kırk altı paketle aynı poşet, aynı kesim, aynı gramaj. Paketlerde sanığın izi yok; kavanozda var, çünkü sanık oradan şeker alıyor.',
                  ),
                  s('uye', 'Sayın Savcı, paketlerde iz var mı?'),
                  s('savci', 'Yok, Sayın Hâkim.'),
                ],
              },
            ],
          },
        ),
        option('T04B_B', 'Kavanozdaki iz sanığın çay içtiğini gösterir; paketleri koyduğunu değil', {
          score: { DELIL_ANALIZI: 50 },
          good: 'Doğru bir itiraz; ama paketlerin hangi stoktan geldiğini göstermeden “ortak zilyetlik” tezi tamamen düşmez.',
          responses: [
            {
              lines: [
                s(
                  'savci',
                  'Kavanoz ortak alandaydı ve sanık onu kullanıyordu. İçinde ne olduğunu bilmemesi mümkün değil.',
                ),
              ],
            },
          ],
        }),
        option('T04B_C', 'Ortak alanda bulunan madde ev sahibine aittir', {
          score: { DELIL_ANALIZI: -50 },
          effects: [dec('cred')],
          bad: 'Ortak alandaki eşya kendiliğinden ev sahibine ait sayılmaz; zilyetlik fiilî hâkimiyete bakar. Dayanaksız ve tanığı (ev sahibi) zor durumda bırakan bir iddia.',
          responses: [{ lines: [s('baskan', 'Müdafi, bu iddianın bir dayanağı var mı? Kayda geçmedi.')] }],
        }),
        option('T04B_D', 'Diyeceğimiz yok', {
          bad: 'Savcılığın “ortak alan” tezi cevapsız kaldı.',
          category: 'DELIL_ANALIZI',
        }),
      ],
    }),
    decisionNode(
      'T_05',
      [
        { when: all(flag('tolga_kirildi'), has('ev_iz_eslesme')), to: 'T_05B' },
        { when: ref('beraat_e'), to: 'T_05E' },
        { when: flag('contra_s2'), to: 'T_05N' },
        { to: 'T_05M' },
      ],
      { ...court2.base },
    ),
    court2.objection('T_05B', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      say: [
        s(
          'savci',
          'Sayın Başkan. Dosyaya giren parmak izi raporu, kurye kayıtları ve muhbirin bugünkü beyanı birlikte değerlendirildiğinde, arka odadaki materyalin Barış Demirel’e ait olduğu anlaşılmıştır.',
        ),
        s(
          'savci',
          'Sanığın atılı suçu işlediğine dair delil kalmamıştır. Beraatine; Barış Demirel hakkında soruşturmanın sürdürülmesi için dosya örneğinin Başsavcılığa gönderilmesine karar verilmesini talep ederim.',
        ),
        n('Serap Akın oturdu. Bana bakmadı; ama kalemini masaya yavaşça, bir teslimiyet gibi bıraktı.'),
        s('baskan', 'Müdafi, mütalaaya karşı diyeceğiniz?'),
      ],
      next: 'T_06P',
      options: [
        option(
          'T05B_A',
          'Mütalaaya katılıyoruz; beraatin “suçun sanık tarafından işlenmediği” gerekçesiyle kurulmasını talep ediyoruz',
          {
            score: { USUL_BILGISI: 100 },
            effects: [inc('legal_hits')],
            good: 'Beraatin dayanağı önemlidir: CMK 223/2-b (işlenmediği sabit) ile 223/2-e (işlendiği sabit değil) farklı sonuçlar doğurur; tazminat ve sicil bakımından da.',
          },
        ),
        option('T05B_B', 'Diyeceğimiz yok', {
          neutral: 'Lehe mütalaa karşısında beraatin dayanağını tartışma fırsatı kullanılmadı.',
        }),
      ],
    }),
    court2.objection('T_05E', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      say: [
        s(
          'savci',
          'Sayın Başkan. Arka odanın sanığın kullanımında olduğu kanıtlanamamıştır; kolluk bunu varsaydığını beyan etmiştir. Şekerlikteki paketlerin de aynı stoktan geldiği anlaşılmaktadır.',
        ),
        s(
          'savci',
          'Muhbir beyanı çelişkilidir: kask, saat ve tanığın sanıkla olan geçmişi beyanın güvenilirliğini zayıflatmaktadır.',
        ),
        s(
          'savci',
          'Sanığın madde kullanıcısı olduğu sabittir; ancak kullanım bu davanın konusu değildir. Ticaret kastına dair kesin ve inandırıcı delil yoktur.',
        ),
        s(
          'savci',
          'Sanığın atılı suçu işlediği sabit olmadığından beraatine; arka odanın kiracısı hakkında suç duyurusunda bulunulmasına karar verilmesini talep ederim.',
        ),
        n(
          'Serap Akın oturdu. Kalemini masanın kenarına paralel bıraktı; her zamanki gibi. Bana bakmadı. Bakmasına gerek yoktu.',
        ),
        s('baskan', 'Müdafi, mütalaaya karşı diyeceğiniz?'),
      ],
      next: 'T_06P',
      options: [
        option('T05E_A', 'Mütalaaya katılıyoruz; sanığın kullanıcılığı ticaret kastının kanıtı değildir', {
          score: { USUL_BILGISI: 100 },
          effects: [inc('legal_hits')],
          good: 'Cevap hakkı yerinde kullanıldı (CMK 216/2): kullanım ile ticaret ayrımı hükmün gerekçesine taşındı.',
          responses: [
            {
              lines: [
                me(
                  'Sayın Başkan, mütalaaya katılıyoruz. Yalnızca bir şeyin gerekçeye girmesini istiyoruz: müvekkilim kullanıcı olduğunu bu salonda kendisi söyledi.',
                ),
                me(
                  'Bir insanın hastalığını kendi ağzıyla söylemesi, ona karşı bir delil değil; dürüstlüğüne bir delildir.',
                ),
              ],
            },
          ],
        }),
        option('T05E_B', 'Diyeceğimiz yok', { neutral: 'Lehe mütalaa karşısında söz kullanılmadı.' }),
        option('T05E_C', 'Polis hakkında da suç duyurusu talep ediyoruz', {
          score: { USUL_BILGISI: -30 },
          bad: 'Kolluğun kapsam dışı araması delil yasağı doğurur; ama mütalaaya cevap, bir tanık hakkında suç duyurusu talep etmenin yeri değildir.',
        }),
      ],
    }),
    court2.objection('T_05N', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      say: [
        s('savci', 'Sayın Başkan. Arka odanın sanığa ait olduğu tartışmalı hâle gelmiştir; ticaret kastı şüphelidir.'),
        s(
          'savci',
          'Ancak sanığın kullanıcı olduğu saç analiziyle sabittir ve şekerlikteki iki paket ortak alanda, sanığın erişimindedir. Eylemin TCK 191/1 kapsamında kullanmak için bulundurma olarak değerlendirilmesini talep ederim.',
        ),
        s(
          'baskan',
          'Sanık ve müdafi: eylemin TCK 191/1 kapsamında değerlendirilebileceği hususu ek savunmanız için hatırlatıldı.',
        ),
      ],
      next: 'T_06P',
      options: [
        option('T05N_A', 'Ek savunma için süre talep ediyoruz; şekerliğin kime ait olduğu tartışılmadı', {
          score: { USUL_BILGISI: 100 },
          effects: [raise('ek_savunma'), inc('legal_hits')],
          good: 'Suçun hukuki niteliğinin değişmesi hâlinde sanığa haber verilir ve istemi üzerine ek savunma süresi tanınır (CMK 226/1, 226/3).',
          responses: [
            { lines: [s('baskan', 'Talep kabul. Kısa bir ara veriliyor; ek savunmanızı aynı celsede alacağız.')] },
          ],
        }),
        option('T05N_B', 'Ek savunmamız hazır: sanık kullanıcıdır ama o paketler onun değildir', {
          score: { USUL_BILGISI: 50 },
          effects: [raise('ek_savunma')],
          good: 'Ek savunma yapıldı (CMK 226/1); ama paketlerin hangi stoktan geldiği delille gösterilmedi.',
        }),
        option('T05N_C', 'Nitelik değişikliğine itiraz ediyoruz: iddianame 188 diyor, mahkeme bununla bağlı', {
          score: { USUL_BILGISI: -50 },
          effects: [raise('ek_savunma'), dec('cred')],
          bad: 'Mahkeme fiilin nitelendirilmesinde iddia ve savunmayla bağlı değildir (CMK 225/2); yalnızca iddianamedeki fiil ve failden ayrılamaz. Doğrusu ek savunma hakkını kullanmaktır (CMK 226).',
          responses: [
            {
              lines: [s('baskan', 'Mahkeme fiille bağlıdır, nitelendirmeyle değil, müdafi. Ek savunmanızı alıyoruz.')],
            },
          ],
        }),
      ],
    }),
    court2.objection('T_05M', {
      title: 'Mütalaa',
      courtStage: 'MUTALAA',
      say: [
        s(
          'savci',
          'Sayın Başkan. Kira sözleşmesi sanık adına; arka odada ve ortak alanda ele geçen kırk sekiz paket, hassas terazi ve kilitli poşetler ticaret kastını açıkça göstermektedir.',
        ),
        s(
          'savci',
          'Muhbir beyanı da bu yöndedir. Sanığın TCK 188/3 ve 188/4-a uyarınca cezalandırılmasını, tutukluluğunun devamını talep ederim.',
        ),
        s('baskan', 'Müdafi, mütalaaya karşı diyeceğiniz?'),
      ],
      next: 'T_06P',
      options: [
        option('T05M_A', 'Cevap: kira sözleşmesi bir odanın zilyetliğini göstermez; ticaret kastı ispat edilmedi', {
          score: { USUL_BILGISI: 60 },
          good: 'Cevap hakkı (CMK 216/2) kullanıldı.',
        }),
        option('T05M_B', 'Cevap yok', { neutral: 'Mütalaa cevapsız kaldı.' }),
      ],
    }),
    choiceNode('T_06P', {
      ...court2.base,
      title: 'Esas savunmanın dayanakları',
      background: 'durusma_salonu',
      hud: ['dayanak', 'cred', 'pers'],
      lines: [
        {
          lines: [
            n(
              'Başkan esas hakkındaki savunma için söz vermeden önce dosyasını kapattı ve bekledi. Bir dakika. Belki iki. Salonda yalnızca kaloriferin tıkırtısı.',
            ),
            th(
              'Notlarım önümde. Dört haftanın notları: kilit, kroki, şekerlik, kask, saat, bir defter, bir randevu kartı. Hepsini söyleyemem. Heyet en çok üç şeyi hatırlar.',
            ),
            th(
              'Leyla’nın kuralı: ispatlayamadığın bir cümleyi esas savunmaya koyma. Bir boş cümle, dolu üç cümleyi de götürür.',
            ),
          ],
        },
      ],
      prompt:
        'Esas savunmadan önce notlarına bak: en çok üç dayanak seç. Duruşmada ispatlanmış dayanak heyeti ikna eder; ispatlanmamış dayanak seni zayıflatır.',
      choices: [
        option('D_ODA', 'Arka oda sanığın değil: kroki bir varsayım', {
          cost: [{ var: 'dayanak', amount: 1 }],
          effects: [
            ifThen(
              flag('contra_s2'),
              [score('SAVUNMA_STRATEJISI', 40), inc('pers')],
              [score('SAVUNMA_STRATEJISI', -40)],
            ),
          ],
          responses: [
            { when: flag('contra_s2'), lines: [th('Kolluk tanığı “varsaydım” dedi. Tutanakta, kendi sesiyle.')] },
            { lines: [th('Odayı kimin kullandığını tanığa söyletemedim. Bu not kâğıtta kalacak.')] },
          ],
          next: '$stay',
        }),
        option('D_KILIT', 'Arama kararın kapsamı dışında, kilit kırılarak yapıldı', {
          cost: [{ var: 'dayanak', amount: 1 }],
          effects: [
            ifThen(
              flag('key_excluded'),
              [score('SAVUNMA_STRATEJISI', 40), inc('pers')],
              [score('SAVUNMA_STRATEJISI', -40)],
            ),
          ],
          responses: [
            {
              when: flag('key_excluded'),
              lines: [th('Kesik kilit, kapsam satırı, “sandık.” Delil yasağı kayda geçti.')],
            },
            { lines: [th('Kapsam dışı aramayı ileri sürdüm mü? Sürdüysem bile kabul ettirmedim.')] },
          ],
          next: '$stay',
        }),
        option('D_SEKER', 'Şekerlikteki paketler arka odanın stoğundan', {
          cost: [{ var: 'dayanak', amount: 1 }],
          effects: [
            ifThen(
              flag('jar_cleared'),
              [score('SAVUNMA_STRATEJISI', 40), inc('pers')],
              [score('SAVUNMA_STRATEJISI', -40)],
            ),
          ],
          responses: [
            {
              when: flag('jar_cleared'),
              lines: [th('Aynı poşet, aynı gramaj, aynı kapının dibi. Savcının yedek planı da kapandı.')],
            },
            { lines: [th('Şekerlik hâlâ ortada duruyor. Kavanozda Kaan’ın izi, paketlerde kimsenin.')] },
          ],
          next: '$stay',
        }),
        option('D_MUHBIR', 'Muhbirin anlatısı kendi ifadesiyle ve kayıtlarla çelişiyor', {
          cost: [{ var: 'dayanak', amount: 1 }],
          effects: [
            ifThen(
              any(flag('contra_t3'), flag('contra_t4')),
              [score('SAVUNMA_STRATEJISI', 40), inc('pers')],
              [score('SAVUNMA_STRATEJISI', -40)],
            ),
          ],
          responses: [
            {
              when: any(flag('contra_t3'), flag('contra_t4')),
              lines: [th('Kask, saat, kasa. Muhbirin hikâyesi kendi ayrıntısında boğuldu.')],
            },
            { lines: [th('Tolga’nın hikâyesi kürsüde ayakta kaldı. Bu dayanak boşlukta.')] },
          ],
          next: '$stay',
        }),
        option('D_KULLANICI', 'Sanık kullanıcıdır, satıcı değil: tedavi süreci', {
          cost: [{ var: 'dayanak', amount: 1 }],
          effects: [
            ifThen(
              any(flag('contra_s5'), flag('kaan_durust')),
              [score('SAVUNMA_STRATEJISI', 40), inc('pers')],
              [score('SAVUNMA_STRATEJISI', -40)],
            ),
          ],
          responses: [
            {
              when: any(flag('contra_s5'), flag('kaan_durust')),
              lines: [th('Kaan kendi sesiyle söyledi: kullandım, satmadım. Bir randevu kartı da onu doğruluyor.')],
            },
            { lines: [th('Kaan’ın tedavisini mahkemede kimse duymadı. Bir dayanak, bir boş sandalye gibi.')] },
          ],
          next: '$stay',
        }),
        option('D_GERCEK', 'Gerçek fail Barış Demirel’dir', {
          cost: [{ var: 'dayanak', amount: 1 }],
          effects: [
            ifThen(
              all(flag('tolga_kirildi'), has('ev_iz_eslesme')),
              [score('SAVUNMA_STRATEJISI', 40), inc('pers')],
              [score('SAVUNMA_STRATEJISI', -60), dec('pers')],
            ),
          ],
          responses: [
            {
              when: all(flag('tolga_kirildi'), has('ev_iz_eslesme')),
              lines: [th('Bir parmak izi ve bir muhbirin dönüşü. Bir isim artık bir delil.')],
            },
            { lines: [th('Bir isim söylemek kolay. İspatlamak başka. Bu dayanağın ayakları yok.')] },
          ],
          next: '$stay',
        }),
        option('D_BITIR', 'Dayanaklar bu kadar; savunmaya geç', { next: 'T_06' }),
      ],
    }),
    choiceNode('T_06', {
      ...court2.base,
      title: 'Esas hakkında savunma',
      background: 'durusma_salonu',
      prompt: s('baskan', 'Müdafi, esas hakkındaki savunmanızı yapın.'),
      next: 'T_07',
      choices: [
        option(
          'T06_B',
          'Yüklenen suç sanık tarafından işlenmemiştir; gerçek fail arka odanın kiracısıdır (CMK 223/2-b)',
          {
            effects: [
              ifThen(
                all(flag('tolga_kirildi'), has('ev_iz_eslesme')),
                [
                  score('SAVUNMA_STRATEJISI', strategyAmount(200, 'MASUMIYET')),
                  inc('pers'),
                  raise('gercek_fail'),
                  raise('beraat_savunma'),
                  mark(
                    'GOOD',
                    'Gerçek fail iddiası delillerle örtüşüyor: terazideki iz, muhbirin dönüşü, kurye kayıtları.',
                    'SAVUNMA_STRATEJISI',
                  ),
                ],
                [
                  score('SAVUNMA_STRATEJISI', -100),
                  dec('pers'),
                  mark(
                    'BAD',
                    'Gerçek fail iddiası duruşmada ispatlanmadı: suçun sanık tarafından işlenmediği “sabit” değil.',
                    'SAVUNMA_STRATEJISI',
                  ),
                ],
              ),
            ],
            responses: [
              {
                lines: [
                  me('Sayın Başkan, Sayın Üye. Bu dosya bir varsayımla başladı: ev onun, oda onun, toz onun.'),
                  me(
                    'Bugün o varsayımın yerinde bir parmak izi var. Terazide. Barış Demirel’in. Bir muhbir var; kimden aldığını sonunda söyledi. Bir kurye kaydı var; baskın sabahı köşeden dönen bir motor.',
                  ),
                  me(
                    'Kaan Yıldız kullanıcıydı. Bunu kendi söyledi; kimse ona söyletmedi. Ama kullanan ile satan arasındaki çizgi burada, bu salonda, delillerle çizildi. Kaan o çizginin bu tarafında.',
                  ),
                  me('Suç işlenmiştir; ama müvekkilim tarafından değil. Beraatini talep ediyorum.'),
                ],
              },
            ],
          },
        ),
        option('T06_E', 'Suçun sanık tarafından işlendiği sabit değildir; şüpheden sanık yararlanır (CMK 223/2-e)', {
          effects: [
            ifThen(
              all(flag('contra_s2'), any(flag('contra_t3'), flag('contra_t4'), flag('tolga_kirildi'))),
              [
                score('SAVUNMA_STRATEJISI', strategyAmount(200, 'USUL')),
                inc('pers'),
                raise('beraat_savunma'),
                mark(
                  'GOOD',
                  'Odanın sanığa ait olduğu varsayımı çöktü, muhbirin anlatısı çelişkili: kalan şüphe sanık lehine (Anayasa 38/4).',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
              [
                score('SAVUNMA_STRATEJISI', -100),
                mark(
                  'BAD',
                  'Şüphe savunması için yeterli bulgu ortaya konmadı: oda ya da muhbir anlatısı ayakta kaldı.',
                  'SAVUNMA_STRATEJISI',
                ),
              ],
            ),
          ],
          responses: [
            {
              lines: [
                me(
                  'Sayın Başkan. Savcılığın bütün hikâyesi tek bir kelimeye dayanıyordu ve o kelimeyi tanık bu salonda söyledi: varsaydım.',
                ),
                me(
                  'Bir ev, iki oda. Kira sözleşmesi bir evin kime kiralandığını söyler; bir odanın kimin hâkimiyetinde olduğunu söylemez. O odanın kilidi, anahtarı, botu, montu başka birinindi.',
                ),
                me(
                  'Şekerlik mutfakta değil, o odanın kapısının dibindeydi. İçindeki paketler o odanın stoğundandı. Kavanozdaki parmak izi bir çay alışkanlığıdır; bir ticaret değil.',
                ),
                me(
                  'Arka oda kilitliydi; anahtarı müvekkilimde değildi; kapı keskiyle açıldı. Kroki, tutanağın kendisiyle çelişiyor. Muhbirin satıcısı elinde kaskla kapıyı açtı; müvekkilimin ne kaskı var ne ehliyeti.',
                ),
                me(
                  'Kaan Yıldız kullanıcıydı ve tedaviye kendi ayağıyla gitti. Kullanmak, satmak değildir. Kuşku varsa, o kuşku onundur.',
                ),
                me(
                  'Sanığın beraatini talep ediyorum. Ve bir şey daha: bu salondan çıktığında perşembe günü bir doktoru var. Onu oraya gönderin; buraya değil.',
                ),
              ],
            },
          ],
        }),
        option('T06_T', 'Öncelikle beraat; aksi hâlde eylem en fazla kullanmak için bulundurmadır (TCK 191, 191/8)', {
          score: { SAVUNMA_STRATEJISI: strategyAmount(150, 'INDIRIM') },
          effects: [raise('terditli'), raise('ek_savunma')],
          good: 'Terditli savunma meşrudur: önce beraat, olmazsa 191; kovuşturmada 191/8 uyarınca hükmün açıklanmasının geri bırakılması. Başkan nitelik değişikliğini ayrıca hatırlattı (CMK 226).',
          responses: [
            {
              lines: [
                me(
                  'Sayın Başkan. Öncelikle müvekkilimin beraatini talep ediyorum: arka odanın ona ait olduğu ispat edilemedi.',
                ),
                me(
                  'Mahkemeniz aksi kanaatteyse, müvekkilim kullanıcıdır; satıcı değildir. Eylem en fazla kullanmak için bulundurmadır ve kanun bu durumda hükmün açıklanmasının geri bırakılmasını emreder.',
                ),
                s(
                  'baskan',
                  'Sanığa, eylemin TCK 191/1 kapsamında değerlendirilebileceği ek savunması için hatırlatıldı. Sanık?',
                ),
                s('kaan', 'Kullandım, Sayın Başkan. Satmadım. Ek bir şey söylemeyeceğim.'),
              ],
            },
          ],
        }),
        option('T06_D', 'Yirmi dört yaşında bir genç; hayatını karartmayın', {
          score: { SAVUNMA_STRATEJISI: -50 },
          effects: [dec('pers')],
          bad: 'Duygusal söylem delilin yerini tutmaz; esas savunma delillerin tartışılmasıdır.',
          responses: [
            {
              lines: [
                me(
                  'Sayın Başkan, karşınızda yirmi dört yaşında bir genç var. Babasını kaybetmiş, yolunu kaybetmiş, şimdi bulmaya çalışıyor.',
                ),
                s('savci', 'Herkesin bir hikâyesi var, Sayın Başkan. Dosyada bir terazi var.'),
              ],
            },
          ],
        }),
      ],
    }),
    choiceNode('T_07', {
      ...court2.base,
      title: 'Son söz',
      background: 'durusma_salonu',
      prompt: s('baskan', 'Sanık, son sözünüz?'),
      next: 'T_08',
      choices: [
        option('T07_A', '“Kullandım. Satmadım. Perşembe randevum var; gitmek istiyorum.”', {
          score: { SAVUNMA_STRATEJISI: 50 },
          effects: [ifThen(any(flag('kaan_hazir'), flag('kaan_durust')), [inc('pers')])],
          good: 'Kısa, doğru, kendi sesiyle bir son söz (CMK 216/3).',
          responses: [
            {
              lines: [
                n('Başkan gözlüğünü çıkardı. “Sanık, son sözünüz” dedi; bu sefer sesi daha alçaktı.'),
                n('Kaan ayağa kalktı. Avucuna bir şey yazmıştı; baktı, sonra bakmadan söyledi.'),
                s('kaan', 'Kullandım. Satmadım. Perşembe randevum var. Gitmek istiyorum. Bu kadar.'),
                n('Salon bir an sustu. Defne’nin elindeki poşet bu sefer hışırdamadı.'),
                n('Kaan oturdu. Avucunu kapattı. İki kelime, mürekkebi terden dağılmış, avucunun içinde kaldı.'),
              ],
            },
          ],
        }),
        option('T07_B', '“Sayın Başkan, hayatım sizin elinizde. Merhamet edin.”', {
          neutral: 'Şeklî tutum ve merhamet talebi tek başına indirim nedeni değildir (TCK 62/2).',
          responses: [{ lines: [s('kaan', 'Hayatım sizin elinizde, Sayın Başkan. Merhamet edin.', 'uzgun')] }],
        }),
        option('T07_C', '“Barış’ı yakalayın. O sattı, ben değil.”', {
          score: { SAVUNMA_STRATEJISI: -25 },
          bad: 'Son söz, bir başkasını suçlamanın değil kendini anlatmanın yeridir; heyet bunu öfke olarak okudu.',
          responses: [
            { lines: [s('kaan', 'Barış’ı yakalayın. O sattı. Ben değil.', 'kizgin'), s('baskan', 'Kayda geçti.')] },
          ],
        }),
      ],
    }),
    decisionNode('T_08', [{ to: 'R_KARAR' }], {
      ...TRIAL,
      lines: [
        {
          lines: [
            s('baskan', 'Heyet müzakereye çekiliyor.'),
            n(
              'Kırk dakika. Koridorda bir çaycı, bir avukat, bir anne gibi bekleyen bir abla. Pencerenin dışında güneş, ocaktan beri ilk kez bulutların arasından çıktı; kimse fark etmedi.',
            ),
            n(
              'Kaan bankın ucunda oturuyordu. Avucunu açıp kapatıyordu. Bir kere bana döndü, bir şey sormak üzereydi; sormadı. Ben de cevap vermedim; zaten yoktu.',
            ),
            th(
              'Müzakere odasının kapısı kapalıyken bir avukatın elinde hiçbir şey yoktur. Bütün dosya artık başkalarının vicdanında. En dürüst kırk dakika.',
            ),
            s('mubasir', 'Ayağa kalkın!'),
            s('baskan', 'Hüküm fıkrası ayakta dinlenir.'),
          ],
        },
      ],
    }),
    story('T_COKUS', {
      ...court2.base,
      title: 'Çöküş',
      background: 'durusma_salonu',
      lines: [
        {
          lines: [
            n(
              'Başkan gözlüğünü çıkardı ve masaya bıraktı. Bir başkan gözlüğünü çıkardığında, artık okuyacak bir şey kalmamıştır.',
            ),
            s(
              'baskan',
              'Müdafi, sunduğunuz delillerin hiçbiri iddia ettiğiniz şeyi göstermedi. Heyetin sabrının bir sınırı var. Sanığın son sözünü alıp müzakereye çekileceğiz.',
            ),
            th(
              'Kilidi bulmuştum. Krokiyi bulmuştum. Ama bunları yanlış kapılara taşıdım; her yanlış kapı biraz daha güven götürdü.',
            ),
          ],
        },
      ],
      choices: [cont('COKUS_SON', 'Son söz: “Ben satmadım.”', 'T_08')],
    }),
    resultNode('R_KARAR', { ...VERDICT, title: 'Karar' }),
  ],
  triggers: [
    {
      id: 'tg_cokus',
      priority: 0,
      once: true,
      when: all(flag('in_court'), cmp(v('cred'), '<=', 0)),
      effects: [raise('cokus')],
      goto: 'T_COKUS',
    },
  ],
  discoveryPaths: teslim.discoveryPaths,
};
