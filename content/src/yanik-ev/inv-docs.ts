import { documentExam, examine, fallback, row, tool } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { INV1, card, n, th } from './shared.js';

// 53-inv-belgeler: üç belge incelemesi (bilirkişi raporu, itfaiye raporu, poliçe). Alet + satır = ipucu.
// Yanlış alet ya da boş satır −20.

export const lupe = tool('lupe', 'Büyüteç', 'magnifier');
export const kars = tool('kars', 'Karşılaştır', 'compare');

export const docMiss = (id: string) =>
  fallback(id, 'EXAMINE', {
    score: { DELIL_ANALIZI: -20 },
    feedback: {
      title: 'SONUÇ YOK',
      text: 'Bu aletle bu satırda dikkat çeken bir şey bulamadın.',
      label: '−20 SKOR',
      tone: 'error',
    },
  });

export const hit = (title: string, text: string, amount = 150) => ({
  title,
  text,
  label: `+${amount} SKOR · Not defterine eklendi`,
  tone: 'special' as const,
});

export const invDocs: CasePart = {
  nodes: [
    documentExam('INV_BILIRKISI', {
      ...INV1,
      title: 'Yangın bilirkişi raporu',
      hud: ['ex_bil'],
      background: 'adliye',
      lines: [
        {
          lines: [
            card('ADLİYE · SAVCILIK DOSYASI — YANGIN BİLİRKİŞİ RAPORU', 'adliye'),
            n(
              'On dört sayfa, üç ek. Kapakta bir üniversite logosu, bir unvan, bir imza. Sonuç sayfası kalın harflerle: “hızlandırıcı kullanılarak çıkarılmıştır.”',
            ),
            th(
              'Bir rapor bir sonuçla biter. Ama sonuca giden yol ortadaki sayfalardadır. Ortadaki sayfaları kimse okumaz; ben okuyacağım.',
            ),
            th(
              'Bir alet seç, sonra şüpheli satıra dokun. Büyüteç yazıya, karşılaştırma satırlar arasındaki çelişkiye bakar.',
            ),
          ],
        },
      ],
      header: { left: 'YANGIN BİLİRKİŞİ RAPORU · DR. O. TEZEL', right: '21.01 keşif · 02.02 rapor' },
      columns: [
        { label: 'BÖLÜM', flex: 1 },
        { label: 'İÇERİK', flex: 3 },
      ],
      rows: [
        row('b_kesif', [
          'Keşif',
          'Olay yeri 21 Ocak tarihinde incelenmiştir. Yağışlar nedeniyle olay yeri kısmen bozulmuştur.',
        ]),
        row('b_materyal', [
          'Materyal',
          'İncelenen materyal: olay yerinden alınmış iki adet metal teneke numune (laboratuvara gönderilmiştir).',
        ]),
        row('b_lab', ['Laboratuvar', 'Her iki numunede kurşunsuz benzin tespit edilmiştir.'], {
          lupe: {
            cells: [
              'Laboratuvar',
              'Her iki numunede kurşunsuz benzin tespit edilmiştir. [dipnot 4: düşük buharlaşma derecesinde]',
            ],
            tone: 'special',
          },
        }),
        row('b_elektrik', [
          'Elektrik',
          'Olay yerinde elektrik kaynaklı bir iz tespit edilmemiştir. Sigorta panosu kolluk emanetinde bulunduğundan incelenmemiştir.',
        ]),
        row('b_ek3', ['Ek-3', 'Salon zemini; döküntü izi (fotoğraf: katılan şirket eksperi, 15.01 09.40).']),
        row('b_sonuc', ['Sonuç', 'Yangın salon zemininde, hızlandırıcı kullanılarak çıkarılmıştır.']),
      ],
      tools: [lupe, kars],
      costVar: 'ex_bil',
      rules: [
        examine('EX_BIL_MATERYAL', 'kars', 'b_materyal', {
          discovers: 'clue_numune',
          score: { DELIL_ANALIZI: 150 },
          feedback: hit(
            'NUMUNELERİN KAYNAĞI',
            '“Olay yerinden alınmış” kim tarafından? Ekteki teslim tutanağıyla karşılaştırınca: numuneleri kolluk değil, katılan şirketin eksperi teslim etmiş. Kolluk hiç numune almamış.',
          ),
        }),
        examine('EX_BIL_LAB', 'lupe', 'b_lab', {
          discovers: 'clue_taze',
          score: { DELIL_ANALIZI: 100 },
          feedback: hit(
            'DİPNOT 4',
            'Küçük puntoyla: “düşük buharlaşma derecesinde.” Saatlerce yanmış, seksen dakika sulanmış bir zeminde benzin neden bu kadar taze kalsın?',
            100,
          ),
        }),
        examine('EX_BIL_ELEKTRIK', 'lupe', 'b_elektrik', {
          discovers: 'clue_pano_yok',
          score: { DELIL_ANALIZI: 100 },
          feedback: hit(
            '“İNCELENMEMİŞTİR”',
            'İki cümle yan yana: “elektrik kaynaklı iz tespit edilmemiştir” ve “pano incelenmemiştir.” Bakılmayan bir şeyin yokluğu tespit edilmiş.',
            100,
          ),
        }),
        examine('EX_BIL_EK3', 'lupe', 'b_ek3', {
          discovers: 'clue_eksper_foto',
          score: { DELIL_ANALIZI: 100 },
          feedback: hit(
            'EKSPERİN FOTOĞRAFI',
            'Bilirkişinin “döküntü izi” dediği fotoğrafı bilirkişi çekmemiş. Eksper çekmiş: 15 Ocak 09.40. Zemin tertemiz; ortada ıslak, düzensiz bir leke.',
            100,
          ),
        }),
        examine('EX_BIL_KESIF', 'kars', 'b_kesif', {
          discovers: 'clue_gec',
          score: { DELIL_ANALIZI: 30 },
          feedback: {
            title: 'ALTI GÜN SONRA',
            text: 'Bilirkişi evi yangından altı gün sonra, yağmurdan sonra görmüş. Gördüğü zemin, gecenin zemini değil.',
            label: '+30 SKOR · Not defterine eklendi',
            tone: 'info',
          },
        }),
      ],
      miss: docMiss('FB_BILIRKISI'),
      finish: { id: 'BILIRKISI_BITIR' },
    }),
    documentExam('INV_ITFAIYE', {
      ...INV1,
      title: 'İtfaiye yangın raporu',
      hud: ['ex_itf'],
      background: 'adliye',
      lines: [
        {
          lines: [
            n(
              'İki sayfa, matbu bir form; kutucuklar tükenmezle doldurulmuş. Ekip amirinin el yazısı yer yer bir doktor reçetesi kadar okunaksız.',
            ),
            th(
              'İtfaiyeciler yangını en sıcak anında görür. Yazdıklarını kimse okumaz, çünkü form sıkıcıdır. Sıkıcı formlar dürüst olur.',
            ),
          ],
        },
      ],
      header: { left: 'BURSA İTFAİYESİ · OLAY RAPORU', right: '15.01 · 02.21–04.10' },
      columns: [
        { label: 'KUTU', flex: 1 },
        { label: 'KAYIT', flex: 3 },
      ],
      rows: [
        row('i_zaman', ['Zaman', 'İhbar 02.21 · Varış 02.29 · Kontrol 03.50 · Söndürme suyu: 80 dk']),
        row('i_baslangic', [
          'Başlangıç',
          'Yangının mutfak ile koridor arasındaki bölgede başladığı, elektrik kaynaklı olabileceği değerlendirilmiştir.',
        ]),
        row('i_gozlem', [
          'Gözlem',
          'Müdahale sırasında akaryakıt kokusu alınmamıştır. Yoğun plastik ve kablo yanığı kokusu.',
        ]),
        row('i_sirama', ['Sıçrama', 'Yan bina (No: 11) saçağı tutuşmuş, iki aile tahliye edilmiştir.']),
        row('i_teslim', ['Teslim', 'Sigorta panosu sökülerek kolluğa teslim edilmiştir.']),
      ],
      tools: [lupe, kars],
      costVar: 'ex_itf',
      rules: [
        examine('EX_ITF_GOZLEM', 'lupe', 'i_gozlem', {
          discovers: 'clue_koku_yok',
          score: { DELIL_ANALIZI: 150 },
          feedback: hit(
            'KOKU',
            '“Akaryakıt kokusu alınmamıştır.” Yangının içine giren, kokuyu en yakından alan insanlar benzin kokusu almamış. Plastik ve kablo yanığı.',
          ),
        }),
        examine('EX_ITF_BASLANGIC', 'kars', 'i_baslangic', {
          discovers: 'clue_baslangic',
          score: { DELIL_ANALIZI: 150 },
          feedback: hit(
            'İKİ BAŞLANGIÇ',
            'Bilirkişi “salon zemini” diyor; itfaiye “mutfak ile koridor arası, elektrik kaynaklı olabilir.” Biri yangını söndürürken görmüş, biri altı gün sonra.',
          ),
        }),
        examine('EX_ITF_SICRAMA', 'lupe', 'i_sirama', {
          discovers: 'clue_yan_ev',
          score: { DELIL_ANALIZI: 20 },
          feedback: {
            title: 'GENEL TEHLİKE',
            text: 'Yangın yan binaya sıçramış. Bu, yangının genel güvenlik bakımından tehlikeli olduğunu gösterir; savcının işine yarar, bizim değil. Ama bilmek gerekir.',
            label: '+20 SKOR · doğru okuma',
            tone: 'info',
          },
        }),
      ],
      miss: docMiss('FB_ITFAIYE'),
      finish: { id: 'ITFAIYE_BITIR' },
    }),
    documentExam('INV_POLICE', {
      ...INV1,
      title: 'Konut sigortası poliçesi ve zeyilname',
      hud: ['ex_pol'],
      background: 'buro',
      lines: [
        {
          lines: [
            n(
              'Poliçe dört sayfa, zeyilname bir sayfa. Genel şartlar ince bir kitapçık; özel şartlar iki paragraf, en küçük puntoyla.',
            ),
            th('Sigortacılar en önemli cümleyi en küçük puntoyla yazar. Gözlüğümü taktım.'),
          ],
        },
      ],
      header: { left: 'KALKAN SİGORTA · KONUT POLİÇESİ', right: 'Başlangıç 30.11 · Zeyil 03.01' },
      columns: [
        { label: 'ALAN', flex: 1 },
        { label: 'İÇERİK', flex: 3 },
      ],
      rows: [
        row('p_teminat', ['Teminat', 'Bina 1.200.000 TL · eşya 150.000 TL · yangın, yıldırım, infilak']),
        row('p_ozel', [
          'Özel şart',
          'Hasar tazminatı, kredi bakiyesi tutarında öncelikle dain-i mürtehin sıfatıyla bankaya ödenir.',
        ]),
        row('p_ek', [
          'Ek',
          'Banka yazısı: Kredi kullandırımı için taşınmazın konut sigortası ile sigortalanması şarttır.',
        ]),
        row('p_zeyil', ['Zeyilname', '03.01 · Bina teminatı 1.800.000 TL'], {
          lupe: {
            cells: [
              'Zeyilname',
              '03.01 · Bina teminatı 1.800.000 TL · [açıklama, en küçük puntoyla: KMP-RST · acente teklifi]',
            ],
            tone: 'special',
          },
        }),
        row('p_ihbar', ['Hasar ihbarı', '15.01 · 14.00 · acente aracılığıyla']),
      ],
      tools: [lupe, kars],
      costVar: 'ex_pol',
      rules: [
        examine('EX_POL_OZEL', 'lupe', 'p_ozel', {
          discovers: 'clue_dain',
          score: { DELIL_ANALIZI: 100 },
          feedback: hit(
            'DAİN-İ MÜRTEHİN',
            'Tazminat önce bankaya. Kredi bakiyesi kadarını Halil hiç görmeyecek. Evi yakan birinin parası bankanın kasasına gidecekti.',
            100,
          ),
        }),
        examine('EX_POL_EK', 'lupe', 'p_ek', {
          discovers: 'clue_banka',
          score: { DELIL_ANALIZI: 100 },
          feedback: hit(
            'BANKANIN ŞARTI',
            'Poliçeyi Halil aramamış; banka şart koşmuş. Kırk yedi gün, bir kredinin yaşı.',
            100,
          ),
        }),
        examine('EX_POL_ZEYIL', 'lupe', 'p_zeyil', {
          discovers: 'clue_kampanya',
          score: { DELIL_ANALIZI: 150 },
          feedback: hit(
            'KÜÇÜK PUNTO',
            'Zeyilnamenin açıklama alanı, en küçük puntoyla: “KMP-RST · acente teklifi.” Artış bir kampanyanın parçası.',
          ),
        }),
      ],
      miss: docMiss('FB_POLICE'),
      finish: { id: 'POLICE_BITIR' },
    }),
  ],
};
