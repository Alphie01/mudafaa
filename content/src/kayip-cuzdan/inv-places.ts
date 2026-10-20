import { fallback, option, raise, sceneSearch, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, O, W } from './dsl.js';
import { INV } from './shared.js';

// 54-investigation-yerler: üç arama sahnesi. Her ıska bir büyüteç hakkı ve −10 skor; nesneler 30-scenes'te.

const miss = (id: string) =>
  fallback(id, 'TAP', {
    score: { ARASTIRMA: -10 },
    feedback: { text: 'Burada dikkat çeken bir şey yok. (−1 büyüteç)', label: '−10 SKOR', tone: 'error' },
  });

const after = <T extends { choices: { id: string; next?: unknown }[] }>(n: T, finishId: string, to: string): T => ({
  ...n,
  choices: n.choices.map((c) => (c.id === finishId ? { ...c, next: to } : c)),
});

export const invPlaces: CasePart = {
  nodes: [
    after(
      sceneSearch('INV_OTOBUS', {
        ...INV,
        title: 'Hat 38 · aynı saat',
        background: 'arac',
        hud: ['taps'],
        exposeCounts: true,
        scene: 'sc_otobus',
        costVar: 'taps',
        instruction:
          'Otobüste dikkatini çeken yere dokun. Her dokunuş bir büyüteç hakkı harcar; boş yere dokunmak skor da götürür.',
        lines: B(`
# arac | 18.20 — HAT 38, ÇARŞI DURAĞI
Aynı saat, aynı hat, aynı model otobüs. Kartımı okuttum. Bip. Validatör benim kim olduğumu biliyordu; nerede ineceğimi bilmiyordu.
Kalabalık bir bedene dönüştü: ıslak paltolar, şemsiyeler, uykulu yüzler. Orta kapının yanında sıkıştım. Biri ayağıma bastı, özür dilemedi.
> Arda burada durdu. Kulaklığıyla, telefonuyla. İki metre ötede yaşlı bir kadın bez çantasını kucaklıyordu. Bugün değil; yedi ay önce.
Altıparmak’ta kalabalık boşaldı. Arka kapının önündeki koltuğa oturdum. 14 numara. Etrafıma baktım.
`),
        miss: miss('FB_OTOBUS'),
        finish: { id: 'OTOBUS_BITIR', label: 'Görükle’ye kadar devam et' },
      }),
      'OTOBUS_BITIR',
      'INV_OTOBUS_SON',
    ),
    after(
      sceneSearch('INV_ODA', {
        ...INV,
        title: 'Görükle · öğrenci evi',
        background: 'ev',
        hud: ['taps2'],
        exposeCounts: true,
        scene: 'sc_oda',
        costVar: 'taps2',
        instruction: 'Odada dikkatini çeken yere dokun. Hiçbir şeye el konmaz; yalnızca bakılır ve fotoğraflanır.',
        lines: [
          W(
            { flag: 'fact_zarf' },
            `
# ev | 19.30 — GÖRÜKLE, ÖĞRENCİ EVİ
Üçüncü kat, asansör yok. Merdiven boşluğunda kızartma ve deterjan kokusu. Kapıyı kırmızı şapkalı, uzun boylu bir genç açtı.
ozan: Avukat abla siz misiniz? Ozan. Geçin, kusura bakmayın, ev bekâr evi. Arda iki gündür bulaşık yıkıyor, sizin için.
Arda koridorda duruyordu. Utanmış bir ev sahibi gibi. “ATM fişi buralarda bir yerde olmalı,” dedi, “kitap ayracı yaparım.”
> Burada bir şeye el koymayacağım, bir şey almayacağım. Bakacağım. Fotoğraf çekeceğim. Arda’nın izniyle. Bu fark, mahkemede fark eder.
`,
          ),
          O(`
# ev | 19.30 — GÖRÜKLE, ÖĞRENCİ EVİ
Üçüncü kat, asansör yok. Merdiven boşluğunda kızartma ve deterjan kokusu. Kapıyı kırmızı şapkalı, uzun boylu bir genç açtı.
ozan: Avukat abla siz misiniz? Ozan. Geçin, kusura bakmayın, ev bekâr evi. Arda iki gündür bulaşık yıkıyor, sizin için.
Arda koridorda duruyordu. Utanmış bir ev sahibi gibi. Odasının kapısını açtı ve kenara çekildi.
> Burada bir şeye el koymayacağım, bir şey almayacağım. Bakacağım. Fotoğraf çekeceğim. Arda’nın izniyle. Bu fark, mahkemede fark eder.
`),
        ],
        miss: miss('FB_ODA'),
        finish: { id: 'ODA_BITIR', label: 'Mutfağa geç' },
      }),
      'ODA_BITIR',
      'INV_ODA_SON',
    ),
    after(
      sceneSearch('INV_BUFE', {
        ...INV,
        title: 'Altıparmak · büfe',
        background: 'sokak_gece',
        hud: ['taps3'],
        exposeCounts: true,
        scene: 'sc_bufe',
        costVar: 'taps3',
        instruction: 'Büfede dikkatini çeken yere dokun. Cemil Usta sabırlı ama müşterisi bekliyor.',
        lines: B(`
# sokak_gece | 18.49 — ALTIPARMAK, TEKEL BÜFE
Durağın kırk adım ötesi. Tentenin kenarından su akıyordu; radyoda yine bir maç. Yedi ay sonra aynı dakika.
Tezgâhın arkasında göbekli, bıyıklı, yeşil yelekli bir adam bir müşteriye para üstü sayıyordu. Gözleri hiç durmuyordu.
cemil: Buyur abla. Sigara? Kontör? Yoksa şu avukat havasıyla bir dert mi getirdin bana?
P: Bir dert, evet. Altı Mart, akşam yediye on kala. Burada bir kartla üç ayrı ödeme yapılmış.
cemil: Altı Mart! Abla ben dün akşam ne yediğimi hatırlamam. Polis sordu mu? Sormadı. Kimse bir şey sormaz bana, ben de kimseye bir şey sormam.
> Kimse ona bir şey sormamış. Yedi aydır kimse bu büfeye gelmemiş. Kartların kullanıldığı yer, dosyada yalnızca bir satır.
`),
        miss: miss('FB_BUFE'),
        finish: { id: 'BUFE_BITIR', label: 'Cemil Usta’yla konuş' },
      }),
      'BUFE_BITIR',
      'INV_BUFE_SON',
    ),
    story('INV_OTOBUS_SON', {
      ...INV,
      title: 'Görükle, son durak',
      background: 'arac',
      lines: B(`
# arac | 19.05 — GÖRÜKLE KAMPÜS, SON DURAK
Otobüs boşaldı. Ön kapıda bir öğrenci kız şoför kabinine eğildi, elinde katlanmış siyah bir şemsiye.
@ÖĞRENCİ: Abi bu arkada kalmış, birinin.
@ŞOFÖR: Bırak oraya kızım. Yarın kayıp eşyaya veririz. Hadi, inelim.
Şoför şemsiyeyi bakmadan torpidonun yanına attı. Bir deftere bir şey yazmadı. Kız indi; ben de indim.
> Kural kapı camında yazıyordu: sürücüye teslim et. Sürücü teslim aldı mı? Aldı sayılır mı? Yazmadıysa, şemsiye hiç verilmemiş gibi olur mu?
> Arda o akşam aynı kapıda durdu. Aynı soruyu sordu. Ona da bir el sallandı mı? Bir kamera bunu görmüş müydü?
`),
      choices: [
        option('OTS_NOT', '“Not aldım: son durak, ön kapı, şoför kabini.”', {
          effects: [raise('sofor_gozlem')],
          next: '$return',
          responses: B(`
> Defterime üç kelime yazdım: son durak, ön kapı, kabin. Bir de soru işareti. Soru işaretleri bu dosyada benim en çok kullandığım noktalama oldu.
`),
        }),
        option('OTS_SOR', 'Şoföre şemsiyeyi deftere yazıp yazmayacağını sor', {
          effects: [raise('sofor_soruldu')],
          next: '$return',
          responses: B(`
@ŞOFÖR: Defter mi? Abla saat yedi, on iki saattir direksiyondayım. Yarın garajda yazarız. Herkes öyle yapar.
> “Herkes öyle yapar.” Bir dosyanın en tehlikeli cümlesi. Çünkü genellikle doğrudur.
`),
        }),
      ],
    }),
    story('INV_ODA_SON', {
      ...INV,
      title: 'Mutfak',
      background: 'ev',
      lines: B(`
Mutfakta Ozan çay demlemişti. Üç bardak, biri çatlak. Çatlağı Arda aldı, sormadan.
ozan: O sabah polis gelince ben açtım kapıyı abla. Sekiz on beşti. Arda diş fırçalıyordu, ağzı köpüklüydü.
ozan: Memur masadaki sarı kâğıdı da aldı. Ben “o ne” dedim, “delil” dedi. Gece görmüştüm o kâğıdı. “Yarın 9 — karakol” yazıyordu.
arda: Ozan sordu o gece, “ne karakolu” diye. Ben de anlattım.
> Bir not, bir tanık, bir saat. Arda’nın hikâyesinde ilk kez başka birinin gözü vardı.
`),
      choices: [
        option('ODS_TANIK', '“Ozan, gerekirse bunu mahkemede anlatır mısın?”', {
          effects: [raise('fact_ozan')],
          next: '$return',
          responses: B(`
ozan: Anlatırım. Ne gördüysem. Ama beni ezbere bir şey söyletmeyin, ben sınavlarda bile ezber yapamam.
P: Söyletmem. Gördüğünü söyleyeceksin, o kadar.
`),
        }),
        option('ODS_SUS', 'Çayını içip teşekkür et', {
          next: '$return',
          responses: B(`
> Çay acıydı. Arda çatlak bardağından içti; sanki o çatlak bir yerde ona aitmiş gibi.
`),
        }),
      ],
    }),
    story('INV_BUFE_SON', {
      ...INV,
      title: 'Cemil Usta',
      background: 'sokak_gece',
      lines: B(`
cemil: Bak abla, ben kart sahibini sormam. Bip dedi mi iş tamamdır. Ama ters ibraz diye bir şey var, bilir misin?
cemil: Biri “kartım çalındı” der, banka parayı benden geri alır. Malı da vermişim, parayı da. Bir kere yandım. Ondan beri tuhafları not ederim.
P: Tuhaf ne demek?
cemil: Şifresini unutanlar. Üçe bölenler. Eldivenle ödeyenler. Kartın üstündeki adla yüzü uymayanlar. Ben polis değilim abla, ama göz var.
> Bir büfecinin hafızası bir ayakkabı kutusunda, lastikle bağlanmış duruyordu. Kimse o kutuyu açmamıştı.
`),
      choices: [
        option('BFS_ISIM', '“Adresinizi ve telefonunuzu alabilir miyim? Belki yeniden gelirim.”', {
          effects: [raise('cemil_tanisti')],
          next: '$return',
          responses: B(`
cemil: Al abla. Ama gelirsen bir şey al, boş gelme. Sigara içmiyorsan çikolata al. Esnafız biz.
`),
        }),
        option('BFS_GIT', 'Teşekkür edip çık', {
          next: '$return',
          responses: B(`
> Tentenin altından çıktım. Durağa kırk adım. Yağmurda otuz. Saydım.
`),
        }),
      ],
    }),
  ],
};
