import { cont, meet, option, set, story } from '../../../tools/content/src/kit/index.js';
import type { CasePart } from '../../../tools/content/src/kit/index.js';
import { B, O, W } from './dsl.js';
import { C0, C1, C2, p1 } from './shared.js';

// 40-briefing: soğuk açılış (alıcının gözünden; gönderen hiç görünmez), 12 Kasım öğleden sonrası, büroda Tarık,
// Leyla'nın dosya devri, dosyadaki kâğıtlar, dosya ekranı ve strateji, soruşturmanın ilk sabahı.

export const briefing: CasePart = {
  nodes: [
    story('PR_00', {
      ...C0,
      title: 'Soğuk açılış',
      background: 'sokak_karanlik',
      lines: B(`
        # 6 KASIM · GECE 02.11 — NİLÜFER, BURSA |bg=sokak_karanlik
        > Lodos üç gündür camları zorluyordu. Sokak lambalarının ışığı ıslak asfaltta titriyor, bir çöp kovası rüzgârla kaldırımda yuvarlanıyordu.
        > Beşinci kattaki pencere karanlıktı. İçeride bir telefon, komodinin camında, kısa ve inatçı bir sesle titredi. |bg=ev |fx=flash
        ?BİR KADIN: …Saat kaç?
        > Ekranın ışığı bir yüzü aydınlattı. Gözler, uykunun içinden, bir ismi seçti.
        ?EKRAN: TARIK AKSOY · 1 yeni mesaj
        ?BİR KADIN: Bu saatte mi? Daha dün akşam… neyse.
        ?EKRAN: “Sn. Karaca, ihaleden çekilmeniz herkes için en iyisi olur... Aksi hâlde bazı kâğıtlarınızın kimlerin eline geçeceğini düşünün. Saygılar.”
        > Mesajın altında bir fotoğraf yükleniyordu. Önce gri bir kare, sonra bir kâğıdın köşesi, sonra bir hastane logosu, sonra bir tarih. Dört yıl öncesi.
        ?BİR KADIN: Hayır. Hayır, hayır.
        > Yatağında doğruldu. Kalbi, göğsünde, mesajın geldiği telefondan daha hızlı atıyordu. Pencereden gelen sokak lambası ışığı, elindeki ekranın soğuk parıltısıyla yarışıyordu.
        > Kâğıdı tanıdı. Dört yıl önce bir kliniğin kapısında eline tutuşturulan, bir çekmecenin dibine koyduğu, bir kez de birine, yalnızca güvendiği birine, “bunu nasıl anlatsam” diye fotoğrafını çektiği kâğıt.
        > Yazmaya başladı. Sildi. Bir daha yazdı. Sildi. Parmakları, cümlenin ilk harfinde donup kaldı.
        > Dışarıda rüzgâr bir tabelayı söktü; bir yerde metal, taşa çarptı.
        # 9 KASIM · GECE 02.14 |bg=ev
        > Bu kez uyumuyordu. Üç gündür uyumuyordu zaten. Telefon titrediğinde elindeydi.
        ?EKRAN: TARIK AKSOY · “Hatırlatma: süre işliyor... Saygılar.”
        ?EKRAN: Bir sesli mesaj iletildi · Alıcı: Hayri Sezer
        ?BİR KADIN: Ne… Neyi iletti? Kime?
        > Oynat düğmesine bastı. Hoparlörden, yıllar önceki bir gecenin içinden, ağlayan bir kadın sesi geldi. Kardeşine bir şeyler anlatıyordu.
        > Kendi sesiydi.
        ?BİR KADIN: Kapat. Kapat şunu.
        > Kapattı. Ama ses odada kaldı. Ses hep kalır.
        # 12 KASIM · GECE 02.19 |bg=sokak_yagmur
        > Yağmur başlamıştı. Lodos, yerini Uludağ’dan inen soğuğa bırakmıştı.
        ?EKRAN: TARIK AKSOY · “Son mesajım. Cuma’ya kadar dosyadan imzanızı çekin. Yoksa sesiniz herkesin telefonunda. Saygılar.” |bg=ev
        > “Saygılar.” Bir tehdidin sonuna “Saygılar” yazan biri. Kadın bu kelimeye takıldı. Tarık ona hayatında bir kez bile “Saygılar” dememişti.
        > Pencereye gitti. Aşağıda ıslak sokak, bir taksi, bir kedi. Dünya dönüyordu, kimse bir şey bilmiyordu. Yalnız o ve ekranındaki isim.
        > Telefonu yatağın üstüne bıraktı. Bir süre tavana baktı. Sonra telefonu yeniden aldı ve bir numara aradı. Karşı taraf yedinci çalışta açtı.
        ?BİR KADIN: Sinan Bey. Uyandırdım, biliyorum. Bir avukata ihtiyacım var.
        ?UYKULU BİR ERKEK SESİ: Melis Hanım? Ne oldu?
        ?BİR KADIN: Biri bana mesaj atıyor. Biri değil. Ortağım.
        > Ekranda bir isim yazıyordu. Bütün dava, o ismin üstüne kuruldu. |fx=fade
      `),
      choices: [cont('PR00_DEVAM', 'Devam', 'PR_01', { role: 'PRIMARY' })],
    }),
    story('PR_01', {
      ...C0,
      title: '12 Kasım',
      background: 'buro',
      lines: B(`
        # 12 KASIM · 14.30 — AKSOY MİMARLIK, TOPHANE |bg=buro
        > Eski Pirinç Han’ın üst katı. Taş merdivenler, yüz elli yıllık kemerler, kemerlerin altında iki çizim masası, bir plotter, bir kahve makinesi.
        > Çizim masasının başında bir adam, elinde mekanik bir kurşun kalem. Tık. Tık. Uç her basışta bir milimetre çıkıyor.
        ?SİVİL POLİS: Tarık Aksoy siz misiniz? Siber Şube’den geliyoruz. Bir şikâyet var. İfadenizi almamız gerekiyor.
        tarik/saskin: Şikâyet? Kimden?
        ?SİVİL POLİS: Melis Karaca. Telefonunuzu da yanınıza alın lütfen.
        > Adam bir an kurşun kalemin ucuna baktı. Sonra telefonu cebinden çıkardı ve masanın üstünden uzattı.
        tarik: Alın. Bakın. Saklayacak bir şeyim yok.
        # SİBER SUÇLARLA MÜCADELE ŞUBE · 15.40 |bg=karakol
        > Florasan ışığı, titrek. Bir masa, iki sandalye, duvarda bir saat; saatin camında bir çatlak, akrebin ucunu ikiye bölüyor.
        hakan: Kilidi açar mısınız Tarık Bey? Şöyle bir bakacağız, o kadar. Saklayacak bir şeyiniz yoksa sizin de işinize gelir.
        tarik: Açayım. Saklayacak bir şeyim yok.
        > Parmağını ekrana koydu, komiser yardımcısı telefonu aldı. Parmağı ekranda yukarı aşağı gezindi. Bir menü. Bir başka menü. En altta, gözden uzak bir “arşivlenmiş sohbetler” klasörü.
        hakan: Burada işte. Melis Karaca. Bakın: “Sn. Karaca, ihaleden çekilin…” Bu sizin hesabınız değil mi?
        tarik/saskin: Bu… Ben bunu yazmadım. Ben bu sohbeti hiç açmadım bile. Arşiv mi? Ben arşiv diye bir şeyi hayatımda kullanmadım.
        hakan: Herkes öyle der Tarık Bey. On yıldır buradayım, hepsi aynı şeyi söyler.
        tarik: Ama ben gerçekten…
        hakan: İmzayı sonra alırız. Şimdi görüntüleri alalım.
        > Ekran görüntüsü sesleri. Bir, iki, on dört. Sonra komiser yardımcısı kendi telefonunu çıkardı ve ekranın fotoğrafını çekti. Bir flaş. |fx=flash
        > Telefon kapatıldı, kahverengi bir zarfa kondu, zarfın ağzı bantlandı. Masanın çekmecesi açıldı ve kapandı.
        tarik: Bir şey imzalamam gerekiyor mu?
        hakan: Sonra. Önce ifadenizi alalım.
        > Üç ay sonra bir iddianame geldi. İlk celseye iki hafta kala, avukatı dosyadan çekildi.
        > Bir şubat akşamı, yağmurda, bir rulo çizimin altına sığınmış bir adam Arslan Hukuk’un kapısını çaldı. |fx=fade
      `),
      choices: [cont('PR01_DEVAM', 'Devam', 'BR_00', { role: 'PRIMARY' })],
    }),
    story('BR_00', {
      ...C1,
      title: 'Tarık Bey',
      background: 'buro_gece',
      onFirstEnter: [meet('deniz'), meet('tarik')],
      lines: B(`
        # ŞUBAT · SALI 20.50 — ARSLAN HUKUK, BURSA |bg=buro_gece
        ~ Kasımda mesaj gelir. Şubatta avukat.
        > Kapının camında yağmur. Koridorda ıslak ayak izleri. İçeri giren adam, şemsiyesini değil, bir rulo çizimi koruyordu.
        tarik: Av. Deniz Arslan? Tarık Aksoy. Randevum yok. Kırk dakikadır aşağıda, arabada bekliyordum.
        P: Oturun. Çizimi şuraya bırakabilirsiniz.
        tarik: Bırakmayayım. Vakfa perşembe teslim. Eski Pirinç Han’ın restorasyonu. Ortağım yok artık. Yani… ortağım beni şikâyet etti.
        > Oturdu. Ceketinin iç cebinden mekanik bir kurşun kalem çıkardı. Tık. Bir milimetre.
        tarik: Önceki avukatım çekildi. “Mesajlar telefonunda Tarık Bey, ben ne yapayım” dedi. On iki gün sonra duruşma.
        P: Mesajları siz yazdınız mı?
        tarik: Hayır.
        > Cevap çabuk geldi. Ne fazla çabuk, ne de geç. Bir ölçüyü okur gibi.
        tarik: Ben mimarım avukat hanım. Bir duvarın nereye geleceğini bilirim, bir kirişin ne kadar yük taşıyacağını. Bir mesajın telefonuma nasıl girdiğini bilmiyorum.
        tarik/uzgun: Kızım dokuz yaşında. Ece. Okulda bir arkadaşının annesinden duymuş. Akşam yemekte bana sordu: “Baba, sen kötü mesaj mı attın?”
        tarik: Ne cevap vereceğimi bilemedim. Mimarlar cevabı olmayan soruları sevmez. Bir kirişin yükünü hesaplarım; bir çocuğun sorusunu hesaplayamadım.
        tarik: “Hayır” dedim. Ama “hayır” demek yetmiyor. O da biliyor, ben de. Kanıt lazım. Her şeye kanıt lazım artık.
        > Çizimi dizine dayadı, iki eliyle sıktı. Rulonun kenarı buruştu.
        tarik: Bakın, ben zengin bir adam değilim. Ama bu dava için ne gerekiyorsa. Ev var, araba var. Ece’nin gözüne bakabilmek için hepsini veririm.
        ~ Masanın üstünde bir kurşun kalem. Tık. Tık. Ritmi hiç bozulmuyor. Bir insan bu kadar sakin yalan söyleyebilir mi? Ya da bu kadar sakin, sadece doğruyu söyleyen biri olabilir mi?
        ~ Bir yıl önce bir davayı kaybetmiştim. Müvekkilim suçsuzdu, ben beceriksizdim. O yüzü hâlâ görüyorum. Bu adamın yüzüne bakınca o yüzü görüyorum.
        tarik: Ücretinizi söyleyin. Ve bana bir şey söyleyin. Bir tek şey. Kazanabilir miyiz?
      `),
      choices: [
        option('BR00_OKU', 'Önce dosyayı okuyayım; cevabı sonra veririm.', {
          effects: [{ type: 'VAR', var: 'trust', op: 'inc', value: 4 }],
          responses: B(`
            tarik: Dürüst cevap. Peki. Mimarlıkta da öyledir: önce zemin etüdü, sonra proje.
            > Kalemi cebine koydu. İlk kez omuzları biraz indi.
          `),
          next: 'BR_01',
        }),
        option('BR00_SOZ', 'Merak etmeyin Tarık Bey. Bu dosyadan beraat çıkar, size söz veriyorum.', {
          effects: [{ type: 'VAR', var: 'trust', op: 'inc', value: 6 }, set('soz_verildi', true)],
          responses: B(`
            tarik/mutlu: Bunu duymak istiyordum.
            > Gülümsedi. Sonra gülümsemesi, kızının sorusunu hatırlamış gibi, yavaşça yerine oturdu.
            ~ Söyledim. Söylenmiş bir söz geri alınmaz.
          `),
          next: 'BR_01',
        }),
        option('BR00_TARIFE', 'Önce ücret tarifemizi ve çalışma biçimimizi anlatayım.', {
          effects: [],
          responses: B(`
            tarik: Anlatın. Rakamları severim. Rakamlar yalan söylemez.
            > Anlattım. Sözleşmeyi okudu, iki maddenin altını kurşun kalemle çizdi, imzaladı.
          `),
          next: 'BR_01',
        }),
      ],
    }),
    story('BR_01', {
      ...C1,
      title: 'Dosya devri',
      background: 'buro_gece',
      onFirstEnter: [meet('leyla')],
      lines: [
        W(
          { flag: 'soz_verildi' },
          `
          > Tarık gittikten sonra Leyla kapının eşiğinde belirdi. Elinde dosyanın UYAP çıktısı, gözlüğü alnında.
          leyla: “Beraat ettiririz.” Koridordan duydum.
          leyla: Annelerin, babaların gözüne bakarak söz verme Deniz. Dosyaya bakarak ver. Dosya sana bir şey söylemeden sen dosyaya bir şey söyleme.
          ~ Haklıydı. Haklı olduğunu bildiği için sesini yükseltmedi bile.
          leyla: Otur. Neyle karşı karşıyayız, önce onu konuşalım.
          leyla: İddianame iki suçtan. Üç gece, aynı kişiye, aynı amaçla gönderilmiş tehditler. Bir de bir ses kaydının üçüncü bir kişiye iletilmesi.
          leyla: Dijital bir dava bu Deniz. Bizim kuşağın korktuğu türden. Ama korkma: ekran da bir delildir, deliller de kuralları olan şeylerdir. Kuralı bilen kazanır.
          leyla: Mahkeme ve ceza aralığı? Kısaca söyle, sonra derine ineriz.
        `,
        ),
        O(`
          > Tarık gittikten sonra Leyla kapının eşiğinde belirdi. Elinde dosyanın UYAP çıktısı, gözlüğü alnında, dudağında sönük bir çay bardağı.
          leyla: Mimar. Kurşun kalemli. Gözüne baktın mı?
          P: Baktım. Bir şey göremedim.
          leyla: İyi. Bir şey gördüğünü sansaydın endişelenirdim. Biz suçu gözden değil, dosyadan okuruz.
          leyla: Otur. Çay koy kendine. Neyle karşı karşıyayız, önce onu konuşalım.
          leyla: İddianame iki suçtan. Üç gece, aynı kişiye, aynı amaçla gönderilmiş tehditler. Bir de bir ses kaydının üçüncü bir kişiye iletilmesi.
          leyla: Dijital bir dava. Bizim kuşağın korktuğu türden. Ama ekran da bir delildir ve delillerin kuralları vardır. Kuralı bilen kazanır.
          leyla: Mahkeme ve ceza aralığı? Kısaca söyle.
        `),
      ],
      choices: [
        option('BR01_A', 'Şantaj (zincirleme) 1–3 yıl; ifşa 2–5 yıl. Asliye ceza.', {
          score: { HUKUKI_BILGI: 50 },
          good: 'Doğru: TCK 107/2 (1–3 yıl hapis ve adli para; 43/1 ile zincirleme artırım) ve TCK 134/2 (2–5 yıl). Üst sınırlar 10 yılın altında olduğundan görevli mahkeme asliye ceza (5235 s. Kanun md. 11–12).',
          responses: B(`
            leyla: Doğru. Üç mesaj tek bir kararın parçasıysa zincirleme sayılır, ceza dörtte birden dörtte üçe kadar artar.
            leyla: Ama asıl ağır olan ses kaydı. Alt sınırı iki yıl; ertelemenin ve geri bırakmanın tam sınırında. Üstüne çıkan her ay o kapıyı kapatır.
            > Masadaki sigara paketini çevirdi. Sigarayı bırakalı iki yıl oldu; paket hâlâ orada.
          `),
          next: 'BR_01B',
        }),
        option('BR01_B', 'Şantaj değil basit tehdit: altı aydan iki yıla; dosyayı sulh ceza görür.', {
          bad: 'Yarar sağlama amacıyla şeref ve saygınlığa zarar verecek hususların açıklanacağı tehdidi basit tehdit (TCK 106) değil şantajdır (TCK 107/2). Sulh ceza mahkemesi değil, asliye ceza görevlidir.',
          category: 'HUKUKI_BILGI',
          responses: B(`
            leyla: Hayır. “Çekil, yoksa sırlarını yayarım” basit bir tehdit değil. Biri bir şey elde etmek istiyor. Kanun buna şantaj diyor.
            leyla: Ses kaydının iletilmesi de ayrı bir suç: özel hayata ait sesin ifşası. İki yıldan beş yıla. Asliye ceza, tek hâkim.
          `),
          next: 'BR_01B',
        }),
        option('BR01_C', 'Bilişim suçu: sisteme girme ve verileri bozma (TCK 243–244). Ağır ceza.', {
          bad: 'İddianamede sanığa bilişim sistemine girme (TCK 243) ya da verileri bozma (TCK 244) isnat edilmiyor; sanığın kendi hesabını kullandığı iddia ediliyor. Suçlar TCK 107/2 ve 134/2; görevli mahkeme asliye ceza.',
          category: 'HUKUKI_BILGI',
          responses: B(`
            leyla: İddianameyi okumadan cevap verdin. Savcı Tarık’ın kendi hesabını kullandığını söylüyor; bir sisteme girdiğini değil.
            leyla: Şantaj ve ifşa. Asliye ceza. Bir yerden bilişim suçu çıkacaksa, o başka birinin dosyası olur.
            ~ Başka birinin dosyası. Bunu not ettim, neden ettiğimi bilmeden.
          `),
          next: 'BR_01B',
        }),
      ],
    }),
    story('BR_01B', {
      ...C1,
      title: 'Dosyadaki kâğıtlar',
      background: 'buro_gece',
      lines: B(`
        > Leyla dosyadan üç kâğıt çıkardı ve masaya, aralarında birer karış boşluk bırakarak dizdi. Bir cerrah aletlerini dizer gibi.
        leyla: Siber Şube’nin ön inceleme tutanağı. Kolluğun adli kopya raporu. Şikâyet dilekçesi. Üçü de birkaç sayfa. Ama ekleriyle birlikte yüz yirmi sayfa ediyor.
        leyla: Savcı birinciden bir cümle, ikinciden bir cümle almış ve iddianameyi kurmuş: “Mesajlar şüphelinin telefonundaki hesaptan gönderilmiştir.” Zarif bir cümle. Zarif ve yanıltıcı.
        leyla: O cümlenin üç ayrı şeyi tek şey gibi gösterdiğini fark et: telefon, hesap, ve o hesabı kullanan el. Üçü aynı yerde olmak zorunda değil.
        > Ters çevrilmiş bir çerçeve, Leyla’nın masasının köşesinde. Yıllardır orada. Hiç sormadım.
        leyla: Ekran görüntüsü bir fotoğraftır Deniz. Fotoğrafın çerçevesinin dışını sor. Kim çekti, ne zaman çekti, neyle çekti?
        leyla: Hangisinden başlarsın?
      `),
      choices: [
        cont('BR01B_TUTANAK', 'Tutanaktan. Telefon karakolda kimin elindeydi?', 'BR_02', {
          responses: B(`
            leyla: Usulden başlayan avukat, esası unutmamalı. Ama başlangıç doğru.
            ~ Bir telefon. Bir zarf. Bir çekmece. Kim, ne zaman?
          `),
        }),
        cont('BR01B_RAPOR', 'Rapordan. Sonucu değil, eklerini okuyacağım.', 'BR_02', {
          responses: B(`
            leyla: Eklerini. İyi. Raporların sonucu yazanın kanaatidir, ekleri makinenin.
            ~ Yüz yirmi sayfa. Bu gece uyku yok.
          `),
        }),
        cont('BR01B_SIKAYET', 'Şikâyetten. Mesajları bir de alıcının gözüyle okumak istiyorum.', 'BR_02', {
          responses: B(`
            leyla: Alıcının gözü. Çoğu avukat bunu unutur. O kadının gecesini de hesaba kat.
            ~ Üç gece. Saat ikiyi geçerken. Kim saat ikide bir kadını tehdit eder?
          `),
        }),
      ],
    }),
    story('BR_02', {
      ...C1,
      phase: 'BRIEFING',
      title: 'Son Mesaj',
      background: 'buro_gece',
      blocks: [
        {
          type: 'profileCard',
          character: 'tarik',
          label: 'MÜVEKKİL · SANIK',
          lines: ['Tarık Aksoy, 39', 'Mimar · sabıkasız · tutuksuz, yurt dışı çıkış yasağı'],
          charge: 'Şantaj, zincirleme (TCK 107/2, 43/1) · özel hayata ait sesin ifşası (TCK 134/2)',
          demand: 'İddianame: 107/2 (43/1) ve 134/2',
        },
        {
          type: 'sentenceRange',
          segments: ['green', 'gold', 'gold', 'red', 'red', 'red', 'darkred', 'darkred'],
          markerPct: 55,
          labels: ['Beraat', 'HAGB', '3–4 yıl', '8 yıl'],
          demandLabel: 'İSTEM: 107/2 + 134/2',
        },
        {
          type: 'paragraph',
          title: 'OLAY ÖZETİ',
          text: '6, 9 ve 12 Kasım gecelerinde, saat 02.00’yi geçerken, Tarık Aksoy’un PUSULA hesabından ortağı Melis Karaca’ya ihaleden çekilmesini isteyen ve özel belgelerinin yayılacağını bildiren üç mesaj gönderildi. 9 Kasım gecesi, Melis’in dört yıl önceki bir ses kaydı, vakıf yönetim kurulu üyesi Hayri Sezer’e iletildi. Mesajlar Tarık’ın telefonunda, listede görünmeyen arşivlenmiş bir sohbette bulundu. Tarık ile Melis, Eski Pirinç Han restorasyonu ihalesine birlikte girmişti; aralarında 25 Ekim’de pay oranı tartışması yaşanmıştı.',
        },
        {
          type: 'paragraph',
          title: 'MÜVEKKİLİN ANLATIMI',
          text: 'Tarık, o mesajları yazmadığını söylüyor. 6 ve 12 Kasım gecelerinde evinde uyuduğunu, 9 Kasım gecesi ise kalp krizi geçiren babasıyla acil serviste olduğunu belirtiyor. Bütün hesaplarının şifresinin aynı olduğunu — kızının doğum yılı — ve bu şifrenin ofiste bilindiğini kabul ediyor. İlk teorisi, mesajları Melis’in kendisinin düzenlemiş olabileceği; ama bunun bir dayanağı yok.',
        },
        {
          type: 'strengthList',
          title: 'SAVCILIĞIN ELİNDEKİLER',
          items: [
            { label: 'Telefondaki mesajlar (ekran görüntüleri)', strength: 'STRONG' },
            { label: 'Adli kopya raporunun sonucu', strength: 'STRONG' },
            { label: 'Katılanın şikâyeti ve ekran kayıtları', strength: 'STRONG' },
            { label: '25 Ekim pay kavgası (saik olarak)', strength: 'MEDIUM' },
            { label: 'Eski ortak Ozan Tekin’in tanık beyanı', strength: 'MEDIUM' },
          ],
        },
        {
          type: 'strengthList',
          title: 'İLK BAKIŞTA ZAYIF NOKTALAR',
          items: [
            { label: 'Rızanın tutanakta imzasız olması', strength: 'MEDIUM' },
            { label: 'Ekran görüntülerinin karardan önce alınması', strength: 'MEDIUM' },
            { label: 'Raporun yorumlanmamış ekleri (Ek-2, Ek-3)', strength: 'STRONG' },
          ],
        },
        {
          type: 'choiceGroup',
          title: 'SAVUNMA STRATEJİSİ SEÇ',
          group: 'g_strateji',
          hints: {
            STR_MASUMIYET: 'Masumiyet: mesajları kimin yazdığını göstermeyi hedeflersin; uyan esas savunma ×1,5 puan.',
            STR_USUL: 'Usul: hukuka aykırı ve zinciri kopuk delilleri sarsarsın; uyan esas savunma ×1,2 puan.',
            STR_INDIRIM: 'Terditli: önce beraat, aksi hâlde lehe hükümler; uyan esas savunma ×0,8 puan.',
          },
        },
      ],
      choices: [
        option('STR_MASUMIYET', 'Masumiyet', {
          group: 'g_strateji',
          effects: [set('strategy', 'MASUMIYET'), set('strategy_pct', 150), ...p1.start()],
          responses: B(`leyla: Cesur. Mesajları kimin yazdığını göstermen gerekecek. Tarık değilse, biri.`),
          next: 'INV_SABAH',
        }),
        option('STR_USUL', 'Usul', {
          group: 'g_strateji',
          effects: [set('strategy', 'USUL'), set('strategy_pct', 120), ...p1.start()],
          responses: B(
            `leyla: Ekran görüntüleri kararsız alındıysa yarı yoldasın. Yarısı. Mesajlar yine telefonda duruyor.`,
          ),
          next: 'INV_SABAH',
        }),
        option('STR_INDIRIM', 'Terditli savunma', {
          group: 'g_strateji',
          effects: [set('strategy', 'INDIRIM'), set('strategy_pct', 80), ...p1.start()],
          responses: B(
            `leyla: Güvenli. Ama müvekkiline “birini yazmış olabilirsin” mi diyeceksin? O adam kızına ne diyecek?`,
          ),
          next: 'INV_SABAH',
        }),
      ],
    }),
    story('INV_SABAH', {
      ...C2,
      title: 'Tophane, sabah',
      background: 'sokak_sabah',
      lines: B(`
        # ÇARŞAMBA 08.10 — TOPHANE, BURSA |bg=sokak_sabah
        > Yağmur gece yarısı dinmişti. Tophane’nin arnavut kaldırımı ıslak, saat kulesinin gölgesi sabahın içine uzanıyor. Bir simitçi tablasının naylonunu kaldırıyor, buğusu havaya karışıyordu.
        > Eski Pirinç Han’ın kapısı iki yüz yıldır aynı yerde. Avlunun ortasında kurumuş bir şadırvan, kenarında güvercinler. Üst katın pencerelerinden birinde erken bir ışık yanıyordu: Aksoy Mimarlık.
        > Simitçiden bir simit, bir de çay aldım. Han’ın soğuk taşına yaslanıp dosyayı bir kez daha açtım. Gece okumuştum; sabah her şey başka türlü okunur.
        ~ On iki gün. Üç gece. Bir hesap, bir telefon, bir zarf. Ve bir kadının, saat ikide uyandıran bir bildirimi.
        ~ Polis bir telefona baktı ve bir isim gördü: Tarık Aksoy. Dava o kadar. İsim ekrandaydı, mesele kapandı. Herkes için.
        ~ Ama bir ekran görüntüsü bir fotoğraftır. Fotoğraf çerçevenin içini gösterir, dışını değil. Leyla dün gece bunu söyledi; bütün gece kulağımda çınladı.
        > Defterimi açtım ve ilk sayfaya üç soru yazdım. Telefon Şube’de kimin elindeydi? Üç gece Tarık neredeydi? Ve asıl soru: Mesajlar nereden çıktı?
        > Üçüncü sorunun altını iki kez çizdim. Kurşun kalemin ucu kâğıdı deldi. Neden iki kez çizdiğimi o an bilmiyordum. Sonra öğrenecektim.
      `),
      choices: [cont('SABAH_DEVAM', 'Soruşturmaya başla', 'INV_HUB', { role: 'PRIMARY' })],
    }),
  ],
};
