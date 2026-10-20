import { documentExam, examine, raise, row } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { toHub } from './ara.js';
import { docMiss, hit, kars, lupe } from './inv-docs.js';
import { INV2, card, n, th } from './shared.js';

// 71-ara-belgeler: ara evresinde gelen dört belge (laboratuvar ham verisi, tahkim kararı, arıza kaydı, elektrik
// bilirkişisi raporu). Her biri doğrudan ARA_HUB'a döner.

export const araDocs: CasePart = {
  nodes: [
    toHub(
      documentExam('ARA_LAB', {
        ...INV2,
        title: 'Laboratuvar ham verisi',
        hud: ['ex_lab'],
        background: 'adliye',
        lines: [
          {
            lines: [
              card('ADLİYE · MÜZEKKERE CEVABI — KRİMİNAL LABORATUVAR', 'adliye'),
              n('Yirmi iki sayfa. Çoğu dağlar ve vadiler gibi görünen çizgiler: kromatogram. Her tepe bir molekül; her vadi bir sessizlik.'),
              th('Rapor bir sonuç söyler. Ham veri, sonucun nereden geldiğini. Ve bazen nereden gelmediğini.'),
            ],
          },
        ],
        header: { left: 'KRİMİNAL LAB. · HAM VERİ', right: 'Numune 1–2 · 23.01' },
        columns: [
          { label: 'BÖLÜM', flex: 1 },
          { label: 'KAYIT', flex: 3 },
        ],
        rows: [
          row('l_profil', ['Profil', 'Kurşunsuz benzin; hafif bileşenler korunmuş, ağırlaşma yok.']),
          row('l_piroliz', ['Matris', 'Numune matrisi: ahşap talaşı ve kül. Piroliz ürünleri: —'], {
            lupe: {
              cells: ['Matris', 'Numune matrisi: ahşap talaşı ve kül. Piroliz ürünleri (stiren, toluen türevleri, fenoller): TESPİT EDİLMEDİ'],
              tone: 'special',
            },
          }),
          row('l_kabul', ['Kabul', 'Teslim eden: katılan şirket eksperi T.S. · Kap: 1 L metal teneke · Mühür: teslim edenin şahsi mührü']),
          row('l_not', ['Not', 'Numune alma tutanağı ibraz edilmemiştir.']),
        ],
        tools: [lupe, kars],
        costVar: 'ex_lab',
        rules: [
          examine('EX_LAB_PIROLIZ', 'lupe', 'l_piroliz', {
            discovers: 'clue_piroliz',
            score: { DELIL_ANALIZI: 150 },
            feedback: hit(
              'BOŞ SATIR',
              'Yanmış ahşaptan, verniğinden, plastiğinden beklenen yanma ürünleri hiç yok. Bu talaş ve kül yangından geçmemiş gibi. Benzin ise taze.',
            ),
          }),
          examine('EX_LAB_KABUL', 'kars', 'l_kabul', {
            score: { DELIL_ANALIZI: 60 },
            effects: [raise('fact_muhur')],
            feedback: {
              title: 'ŞAHSİ MÜHÜR',
              text: 'Tenekeleri kim mühürlemiş? Eksperin kendisi, kendi mührüyle. Bir delil, onu kuşkuyla bakılan kişinin mührüyle korunmuş.',
              label: '+60 SKOR',
              tone: 'info',
            },
          }),
          examine('EX_LAB_NOT', 'lupe', 'l_not', {
            score: { DELIL_ANALIZI: 40 },
            feedback: {
              title: 'TUTANAK YOK',
              text: '“Numune alma tutanağı ibraz edilmemiştir.” Bir numunenin doğum belgesi yok.',
              label: '+40 SKOR',
              tone: 'info',
            },
          }),
        ],
        miss: docMiss('FB_LAB'),
        finish: { id: 'LAB_BITIR' },
      }),
    ),
    toHub(
      documentExam('ARA_TAHKIM', {
        ...INV2,
        title: 'Sigorta Tahkim Komisyonu kararı',
        hud: ['ex_tah'],
        background: 'buro',
        lines: [
          {
            lines: [
              n('Gülsüm Hanım’ın naylon dosyası: hakem heyeti kararı, ekinde iki yıl önceki ekspertiz raporu ve bir bölge müdürlüğü yazısı.'),
              th('İki rapor, iki ev, bir imza. Yan yana koyacağım. Kelime kelime.'),
            ],
          },
        ],
        header: { left: 'SİGORTA TAHKİM KOMİSYONU · HAKEM HEYETİ', right: 'Yaşar / Kalkan Sigorta' },
        columns: [
          { label: 'BÖLÜM', flex: 1 },
          { label: 'İÇERİK', flex: 3 },
        ],
        rows: [
          row('t_karar', ['Karar', 'Eksper raporundaki hızlandırıcı tespiti bilimsel dayanaktan yoksundur; tazminatın ödenmesine.']),
          row('t_ek', ['Ek-1', 'Ekspertiz raporu: “düzensiz kenarlı, zemine nüfuz etmiş, tipik döküntü izi tespit edilmiştir…”']),
          row('t_yazi', ['Ek-2', 'Bölge müdürlüğü yazısı: hasar dosyalarında eksper ücretlendirmesi hk.'], {
            lupe: {
              cells: ['Ek-2', 'Bölge müdürlüğü yazısı: “Suiistimal tespitiyle reddedilen hasar dosyalarında eksper ücretine ek prim uygulanacaktır.”'],
              tone: 'special',
            },
          }),
          row('t_eksper', ['Eksper', 'Tarık Sönmez · Sönmez Ekspertiz']),
        ],
        tools: [lupe, kars],
        costVar: 'ex_tah',
        rules: [
          examine('EX_TAH_EK', 'kars', 't_ek', {
            discovers: 'clue_ayni',
            score: { DELIL_ANALIZI: 150 },
            feedback: hit(
              'AYNI PARAGRAF',
              'Bozkurt dosyasındaki raporla yan yana: “düzensiz kenarlı, zemine nüfuz etmiş, tipik döküntü izi.” Virgülüne kadar aynı. İki ayrı yangın, tek bir cümle.',
            ),
          }),
          examine('EX_TAH_YAZI', 'lupe', 't_yazi', {
            discovers: 'clue_prim',
            score: { DELIL_ANALIZI: 150 },
            feedback: hit(
              'EK PRİM',
              'Suiistimal tespitiyle reddedilen her hasara eksper ücretine ek prim. Bir eksperin “benzin” demesinin bir fiyatı varmış.',
            ),
          }),
          examine('EX_TAH_KARAR', 'lupe', 't_karar', {
            score: { DELIL_ANALIZI: 40 },
            feedback: {
              title: 'BİLİMSEL DAYANAKTAN YOKSUN',
              text: 'Bir hakem heyeti bu eksperin aynı türden raporunu iki yıl önce reddetmiş. Bu bir hüküm değil bizim dosya için; ama bir emsal gibi ağır.',
              label: '+40 SKOR',
              tone: 'info',
            },
          }),
        ],
        miss: docMiss('FB_TAHKIM'),
        finish: { id: 'TAHKIM_BITIR' },
      }),
    ),
    toHub(
      documentExam('ARA_ARIZA', {
        ...INV2,
        title: 'Dağıtım şirketi arıza kaydı',
        hud: ['ex_ariza'],
        background: 'buro',
        lines: [
          {
            lines: [
              n('İki sayfalık bir döküm: saatler, kodlar, ekip numaraları. Bir sokağın elektriğinin bir gecelik günlüğü.'),
              th('Saadet Hanım’ın televizyonu “pat” dedi. Bir şirket bu “pat”ı bir kod olarak yazmış olabilir mi?'),
            ],
          },
        ],
        header: { left: 'DAĞITIM ŞİRKETİ · ARIZA KAYDI', right: '15.01 · Kalem Sk. AG hattı' },
        columns: [
          { label: 'SAAT', flex: 1 },
          { label: 'KAYIT', flex: 3 },
        ],
        rows: [
          row('a_0208', ['02.08', 'AG şebekesinde nötr iletken kopması (kod N-03). Faz-nötr gerilim yükselmesi.']),
          row('a_abone', ['02.15', 'Abone şikâyetleri: Kalem Sk. No 5 ve No 7 — cihaz arızası, aşırı gerilim.']),
          row('a_mudahale', ['03.40', 'Ekip müdahalesi; nötr bağlantısı yenilendi. No 9: yangın nedeniyle enerji kesik.']),
        ],
        tools: [lupe, kars],
        costVar: 'ex_ariza',
        rules: [
          examine('EX_ARZ_0208', 'lupe', 'a_0208', {
            discovers: 'clue_notr',
            score: { DELIL_ANALIZI: 150 },
            feedback: hit(
              'N-03',
              '02.08: nötr iletken kopması. Gerilim 220 volttan 380’e doğru tırmanır; eski bir tesisatta bu, bir buatın sonudur. Yangın 02.14 sularında başladı.',
            ),
          }),
          examine('EX_ARZ_ABONE', 'kars', 'a_abone', {
            score: { DELIL_ANALIZI: 60 },
            feedback: {
              title: 'KOMŞULAR',
              text: 'Beş ve yedi numarada cihaz arızası, aynı dakikalarda. Yedi numara Saadet Hanım. Televizyonu yalnız değilmiş.',
              label: '+60 SKOR',
              tone: 'info',
            },
          }),
        ],
        miss: docMiss('FB_ARIZA'),
        finish: { id: 'ARIZA_BITIR' },
      }),
    ),
    toHub(
      documentExam('ARA_ARK', {
        ...INV2,
        title: 'Elektrik bilirkişisi raporu',
        hud: ['ex_ark'],
        background: 'buro',
        lines: [
          {
            lines: [
              n('Elektrik mühendisi Dr. Aslı Yurt’un raporu: on sayfa, mikroskop fotoğrafları, bakır tellerin ucundaki küçük, parlak boncuklar.'),
              th('Bir bakır boncuk. Yangının önce mi sonra mı oluştuğunu söyleyebilen bir damla metal.'),
            ],
          },
        ],
        header: { left: 'ELEKTRİK BİLİRKİŞİSİ · DR. A. YURT', right: 'Emanet: pano + koridor linyesi' },
        columns: [
          { label: 'BÖLÜM', flex: 1 },
          { label: 'BULGU', flex: 3 },
        ],
        rows: [
          row('k_linye', ['Linye', 'Koridor buatına giden linyede ark boncuğu; boncuk yüzeyinde oksidasyon ve gözenek yapısı birincil arkla uyumlu.']),
          row('k_pano', ['Pano', 'Porselen sigortalar; koridor hattı sigortası atmamış. Aşırı gerilim izi.']),
          row('k_sonuc', ['Sonuç', 'Yangının koridor hattında elektrik kaynaklı başlamasıyla uyumlu bulgular mevcuttur.']),
        ],
        tools: [lupe, kars],
        costVar: 'ex_ark',
        rules: [
          examine('EX_ARK_LINYE', 'lupe', 'k_linye', {
            discovers: 'clue_ark',
            score: { DELIL_ANALIZI: 150 },
            feedback: hit(
              'BİRİNCİL ARK',
              'İletken yanmadan önce oluşmuş bir ark boncuğu. Yani ateş teli değil, tel ateşi yakmış. Koridor hattında, buatın hemen önünde.',
            ),
          }),
          examine('EX_ARK_PANO', 'kars', 'k_pano', {
            score: { DELIL_ANALIZI: 60 },
            feedback: {
              title: 'ATMAYAN SİGORTA',
              text: 'Porselen sigorta aşırı gerilimde atmaz; aşırı akımda atar. Gerilim yükselince eski tesisat korumasız kalır. Necati Usta’nın “kaçak akım rölesi yok” notu burada bir anlam kazanıyor.',
              label: '+60 SKOR',
              tone: 'info',
            },
          }),
        ],
        miss: docMiss('FB_ARK'),
        finish: { id: 'ARK_BITIR' },
      }),
    ),
  ],
};
