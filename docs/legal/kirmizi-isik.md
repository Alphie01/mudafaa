# Dava #03 "Kırmızı Işık" — Hukuki İnceleme Notları

> Durum: **Onaylandı — Claude (iç inceleme), 2026-10-20.** `meta.legalReview = { status: 'APPROVED', by: 'Claude (iç inceleme)', at: '2026-10-20' }`.
> Dava #07'deki gibi: içerik yazımında hukuki öz-inceleme yapıldı; aşağıdaki yorum noktaları ileride bir avukatın
> incelemesine açıktır. Düzeltmeler yalnızca `content/src/kirmizi-isik/` ve golden path pencerelerini değiştirir.

## 1. Kullanılan maddeler ve doğrulama

TCK ve CMK metinleri mevzuat.gov.tr'deki güncel PDF'lerden (`pdftotext` ile) okunarak karşılaştırıldı (erişim: 2026-10-20).
2918 sayılı KTK'nın PDF'i erişim sırasında zaman aşımına uğradı; md. 84/a ikincil kaynaklardan (avukatlık bürosu yayınları,
KTY md. 157 atfıyla) doğrulandı ve oyunda yalnızca Leyla'nın genel açıklamasında, madde numarası verilmeden ("bazı hâller
sürücüyü asli kusurlu sayar; kırmızıda geçmek bunların başında") kullanıldı.

| Madde | Kullanıldığı yer | Kaynak | Kontrol edilen metin (kısa) |
|---|---|---|---|
| TCK 85/1 | İddianame, BR_01, hükümler | 1.5.5237.pdf | "Taksirle bir insanın ölümüne neden olan kişi, iki yıldan altı yıla kadar hapis" |
| TCK 85/2 | BR01_B (yanlış seçenek) | 1.5.5237.pdf | birden fazla ölüm ya da ölüm + yaralanma: 2–15 yıl |
| TCK 22/2, 22/3 | BR_01, T_07 ARG_EDR, mütalaa, hükümler | 1.5.5237.pdf | taksir tanımı; bilinçli taksirde ceza üçte birden yarısına kadar artırılır |
| TCK 22/4, 22/5 | BR_01C | 1.5.5237.pdf | ceza failin kusuruna göre; birden fazla failde herkes kendi kusurundan |
| TCK 50/1-a, 50/4 | BR_01, M_BASIT, T09_T, INDIRIM hükmü | 1.5.5237.pdf | taksirli suçta uzun süreli hapis de adli para cezasına çevrilebilir; bilinçli taksirde uygulanmaz |
| TCK 51/1 | MAHKUMIYET/ETIK hükmü (uygulanmaz) | 1.5.5237.pdf | 2 yıl veya daha az hapis ertelenebilir |
| TCK 52/2 | INDIRIM hükmü | 1.5.5237.pdf | bir gün karşılığı 100–500 TL |
| TCK 53/1, 53/6 | hükümler | 1.5.5237.pdf | 53/1 yalnızca kasten işlenen suçta; 53/6 trafik düzeninin özen yükümlülüğüne aykırı taksirli suçta 3 ay–3 yıl sürücü belgesinin geri alınması |
| TCK 62/1 | INDIRIM, MAHKUMIYET | 1.5.5237.pdf | takdiri indirim, altıda bir |
| TCK 98 | ARA_SUC, BERAAT_B epilogu | 1.5.5237.pdf | yardım veya bildirim yükümlülüğünün yerine getirilmemesi |
| TCK 116/2 | ARA_SANAYI (SA_GARAJ), ETIK | 1.5.5237.pdf | açık rızaya gerek duyulmaksızın girilmesi mutat olmayan işyerine rızaya aykırı girme, şikâyete bağlı |
| TCK 267, 277 | ARA_SUC (SU_KATILAN), tanık/katılan etik tuzakları | 1.5.5237.pdf | iftira; yargı görevini yapanı, bilirkişi veya tanıkları etkileme teşebbüsü |
| CMK 63, 67/3, 67/5, 67/6 | BR_01B, INV_RAPOR, H1_06, T_05 (g_yorum), T_05N | 1.5.5271.pdf | bilirkişi hukuki nitelendirme yapamaz (67/3); itiraz ve yeni inceleme için süre, ret gerekçeli (67/5); bilimsel mütalaa (67/6) |
| CMK 68, 69 | H1_06 R_DINLE, ARA_NALAN | 1.5.5271.pdf | bilirkişinin duruşmada dinlenmesi; ret sebepleri |
| CMK 109/3-a,b,d; 109/5 | PR_01, H1_07 AK_IZIN | 1.5.5271.pdf | yurt dışı yasağı, imza, taşıt kullanmama; mesleki uğraş için araç kullanma izni |
| CMK 110/2-3 | H1_07 AK_BERAAT (yanlış seçeneğin etiketi) | 1.5.5271.pdf | yükümlülüklerin kaldırılması/değiştirilmesi; kovuşturmada mahkemece de uygulanır |
| CMK 135/6 | ev_hts açıklaması | 1.5.5271.pdf | iletişim tespiti hâkim kararıyla |
| CMK 147/1-e | H1_00K K_SUS, H1_03 O_SUS (etiketlerde) | 1.5.5271.pdf | susma hakkı |
| CMK 158, 160 | ARA_SANAYI (SA_NOT, SA_SOR), ARA_SUC | 1.5.5271.pdf | ihbar; savcılığın araştırma yükümlülüğü (kaportacıların araştırılmasını savcılık ister) |
| CMK 177 | INV_DIL, INV_LEYLA | 1.5.5271.pdf | savunma delillerinin toplanması dilekçesi, duruşmadan en az beş gün önce |
| CMK 201/1 | H1_03, T_02 | 1.5.5271.pdf | doğrudan soru; itiraz edilince başkan karar verir |
| CMK 206/2 | DIL_SABIKA, R_CIKAR, ETIK | 1.5.5271.pdf | kanuna aykırı delil (a), karara etkisiz (b), uzatma (c) |
| TCK 61 | T_07 ARG_DUYGU (yanlış seçeneğin etiketi) | 1.5.5237.pdf | cezanın belirlenmesi; kişisel durum delil tartışmasının değil ceza takdirinin konusu |
| CMK 215, 216/1-3 | T_00S, H1_04, T_08 (M_CIKAR etiketi dahil), T_09R, T_10 |  1.5.5271.pdf | sanığa her delilden sonra diyeceği; delillerin tartışılmasında söz sırası; cevap hakkı; son söz |
| CMK 217/1-2 | bilirkişi raporu, g_kanaat, ETIK | 1.5.5271.pdf | vicdani kanaat; hukuka uygun delille ispat |
| CMK 223/2-b, 223/2-e | BERAAT_B, BERAAT_E | 1.5.5271.pdf | suçun sanık tarafından işlenmediğinin sabit olması / işlendiğinin sabit olmaması |
| CMK 231/3; 141/1, 142 | beraat hükümleri | 1.5.5271.pdf | tazminat hakkının bildirilmesi |
| CMK 273/1 | mahkûmiyet ve indirim hükümleri | 1.5.5271.pdf | istinaf: gerekçeli hükmün tebliğinden itibaren iki hafta |
| Anayasa 38/4, 38/6; AİHS 6/2 | BERAAT_E, ETIK | — | masumiyet karinesi; hukuka aykırı delil yasağı |
| Av.K. md. 34; TBB Meslek Kuralları | etik geri bildirimleri, ETIK sonu | 1136 | mesleğin gerektirdiği saygı ve güven |
| KTK md. 84/a (2918) | BR_01C (madde numarasız) | ikincil kaynak (bkz. yukarı) | kırmızı ışıklı işarette geçme asli kusur sayılır |

## 2. Görevli mahkeme ve heyet

İddianamedeki nitelendirme TCK 85/1 + 22/3: üst sınır 6 yıl × 1,5 = 9 yıl. 5235 s. Kanun md. 12'ye göre ağır ceza mahkemesi
üst sınırı on yıldan fazla hapis gerektiren suçlara bakar; bu nedenle dava **asliye ceza**dadır ve **tek hâkim**le görülür
(Dava #07'deki üç kişilik heyetten farklı). Cumhuriyet savcısı duruşmada hazır bulunur. Kürsüde zabıt kâtibi vardır;
katılan vekili kürsüde değil, taraf sırasındadır (stage düzeninde kürsüye konmadı).

## 3. Ceza hesabı

- **BERAAT_B (CMK 223/2-b):** Ölüme yol açan birincil çarpmanın başka bir araca ait olduğu; sanığın aracının yerde yatan
  maktule ikincil temasının ölümle illiyet bağı taşımadığı sabit. Ceza yok; adli kontrolün kaldırılması; tazminat hakkının
  bildirilmesi (CMK 141/1, 142, 231/3); dosya örneğinin ayrı soruşturmaya gönderilmesi.
- **BERAAT_E (CMK 223/2-e):** Kırmızı ışık, hız ve telefon iddiaları çöktü; ölümcül çarpmanın sanığın aracından geldiği
  şüpheye yer bırakmayacak biçimde ispatlanamadı. Ceza yok; aynı bildirimler.
- **INDIRIM (farklı nitelendirme: basit taksir):** TCK 85/1 alt sınır **2 yıl** (kusurun hafifliği; TCK 22/4) → TCK 62/1
  (1/6) **1 yıl 8 ay** → TCK 50/1-a ve 50/4 ile **600 gün** adli para cezası (1 yıl 8 ay = 20 ay × 30 gün) × 100 TL
  (TCK 52/2 alt sınırı) = **60.000 TL** → TCK 53/6 sürücü belgesinin **6 ay** geri alınması. 22/3 uygulanmadığı için 50/4
  kapısı açıktır. Sınıf: `RECHARACTERIZED`.
- **ETIK (müdafiin etik ihlali + hukuka uygun delillerle mahkûmiyet):** Garaj fotoğrafları hükme esas alınmaz (Anayasa 38/6,
  CMK 206/2-a, 217/2); mahkeme dosyadaki **hukuka uygun** delilleri ayrıca tartar. ETIK yalnızca `etik_garaj` ∧ ¬`kusur_yok`
  hâlinde, yani kırmızı ışık iddiası hukuka uygun delillerle kürsüde çürütülmediğinde verilir; ceza MAHKUMIYET ile aynıdır.
  Müdafiin ihlali sanık aleyhine delil sayılmaz; tutanak örneği savcılığa ve baroya gönderilir. Garaja girilip dava hukuka
  uygun delillerle kazanılırsa (BERAAT_E) ya da indirim alınırsa hüküm değişmez; gerekçeye "fotoğraflar hükme esas
  alınmamıştır" eklenir ve epilogda disiplin soruşturması oynar.
- **MAHKUMIYET / ETIK:** TCK 85/1 temel **3 yıl** (asli kusur kabulüyle alt sınırdan uzaklaşma) → TCK 22/3 ile yarı oranında
  artırım **4 yıl 6 ay** → TCK 62/1 **3 yıl 9 ay**. Bilinçli taksir nedeniyle TCK 50/4 uygulanmaz; 2 yılı aştığı için
  TCK 51/1 erteleme ve CMK 231/5 HAGB yoktur. TCK 53/1 hak yoksunlukları kasten işlenen suçlara özgü olduğundan
  uygulanmaz; TCK 53/6 ile sürücü belgesi **2 yıl** geri alınır. Sanık tutuklu değildir; hükmün kesinleşmesine kadar adli
  kontrolün devamı.

## 4. Usul akışı

- **1. celse (oyun öncesi):** kimlik, iddianamenin okunması, sanığın sorgusu (CMK 191); sanığa savunmasını tamamlaması
  için süre; bilirkişi raporu okunur.
- **2. celse (H1_*):** iddianamenin özeti (yeni müdafi için), savunmanın tamamlanması, sanığa müdafiin doğrudan soruları
  (CMK 201/1), katılan vekilinin telkinli sorusuna itiraz (CMK 201/1, başkan karar verir), katılanın beyanı ve sanığın
  diyeceği (CMK 215, 216/1), görgü tanığı (yeminli; CMK 54 vd.), bilirkişi raporuna itiraz ve yeni heyet/ATK/EDR talebi
  (CMK 67/5; CMK 206/2-c "uzatma" sayılmaması için somut eksikler), ara karar ve adli kontrol talebi (CMK 109/5), erteleme.
- **Ara:** delil ve raporların gelişi; suç duyurusu (CMK 158); delil zinciri (polisin sakladığı parçanın savcılığa
  tutanakla teslimi); bilirkişiyle mahkeme dışı görüşmenin reddi (CMK 68/69).
- **3. celse (T_*):** yeni raporlar ve savcılık yazısı okunur; sanığa yeni deliller hakkında diyeceği sorulur (CMK 215);
  teknisyen ve polis tanık, bilirkişi ile heyet başkanı açıklama (CMK 68); delillerin tartışılması; mütalaa (CMK 216/1),
  cevap (CMK 216/2), esas savunma, savcı ve katılan vekilinin cevabı, katılanın sözü, son söz (CMK 216/3), hükmün ayakta
  dinlenmesi (CMK 231/4 kapsamındaki uygulama), istinaf bildirimi (CMK 273/1).

## 5. Yorum gerektiren noktalar ve verilen kararlar

1. **223/2-b mi, 223/2-a/c mi?** Sanığın aracı maktule temas etmiştir; ancak ölüme yol açan birincil çarpma başka bir
   araçtandır ve sanığın teması ölümle illiyet taşımaz. "Taksirle öldürme" suçunun sanık tarafından işlenmediği sabit
   olduğundan 223/2-b seçildi (lineup'taki "gerçek fail" sınıfı). Olası alternatif: illiyet yokluğunda eylemin suç tipini
   oluşturmadığı gerekçesiyle 223/2-a; ya da kusursuzluk için 223/2-c. Oyunda 223/2-b'nin şartı yalnızca illiyetin
   kopması değil, ikinci aracın da tespit edilmesidir (savcılık yazısı); tespit yoksa sonuç 223/2-e kalır.
2. **Yerde yatan yayaya ikincil temas için TCK 89 (taksirle yaralama):** Adli Tıp'a göre ikincil sıyrıklar kanaması az,
   ölümle eşzamanlı/ölüme yakın; maktul ölmüş ya da ölmek üzere olduğu ve ayrıca sanığın yeşilde, sınırın altında, normal
   tepki süresiyle frenlediği kabul edildiğinden ayrı bir taksirli yaralama değerlendirilmedi. İnceleme sorusu: uygulamada
   bu ikincil temas için ayrı bir nitelendirme tartışılır mı?
3. **Telefon görüşmesi:** Eller serbest görüşme tek başına bilinçli taksir göstergesi sayılmadı; trafik mevzuatındaki cep
   telefonu yasağına madde numarası verilmeden değinildi (oyunda "eller serbest" vurgusu). İnceleme sorusu: kapatmak için
   ekrana bir saniye dokunmanın kusur değerlendirmesindeki yeri.
4. **Kırmızı ışık ihlali ve bilinçli taksir:** Yargıtay uygulamasında kırmızı ışık ihlali tek başına her zaman bilinçli
   taksir sayılmaz; somut olayda hız, yoğunluk ve öngörü birlikte değerlendirilir. İddianame bilinçli taksiri kırmızı ışık +
   hız + telefon üçlüsüne dayandırır; savunma bu üç ayağı ayrı ayrı çürütür. INDIRIM sonucu mahkemenin basit taksir kabulüdür.
5. **Bilirkişi raporuna "itiraz" kurumu:** CMK 67/5 itiraz ve yeni bilirkişi incelemesi için süre verilmesini ve reddin
   gerekçeli olmasını düzenler; oyunda bu, 2. celsede ara karar talebi olarak sunuldu. "Rapor hukuka aykırıdır, çıkarılsın"
   seçeneği yanlış kabul edildi: eksik/hatalı rapor hukuka aykırı delil değildir.
6. **İtiraz gerekçeleri (g_kanaat, g_yorum):** Türk usulünde tanığın kanaatine özgü bir "itiraz" kurumu yoktur (Dava #07'deki
   inceleme sorusu burada da geçerli); oyunda bu, tanığın gözlemiyle çıkarımını ayırma talebi olarak (takdir: CMK 217/1)
   işlendi. `g_yorum` ise CMK 67/3'e dayanır ve doğrudan kanun metnine bağlıdır.
7. **Bilinçli taksirin hükümdeki etkisi ve TCK 50/4:** INDIRIM hükmünde 50/4 ile adli para cezasına çevirme uygulandı;
   alternatif olarak TCK 51 ertelemesi ya da CMK 231/5 HAGB de mümkündür. 2026 tarihli 7589 sayılı Kanunla değişen
   CMK 231/6'da sanığın kabulü şartı aranmamakta, zararın giderilmesi şartı (231/6-c) ölüm neticeli suçlarda tartışmalıdır;
   bu yüzden 50/4 seçildi.
8. **Adli kontrol:** Taksirle öldürmede tutuklama oyunda yoktur; CMK 109/3-a, b, d tedbirleri uygulanmıştır. H1_07'de
   taşıt kullanma yasağına mesleki izin (CMK 109/5) yalnızca kürsüde lehe bulgu varsa kabul edilir.
9. **Delil zinciri:** Polis memurunun olay yerinden aldığı ve dolabında sakladığı cam parçasının savcılığa tutanakla
   teslimi doğru yol olarak kurgulandı; avukatın delili kendi eline alması (AY_BANA) ve saklaması (AY_SAKLA) cezalıdır.
   İnceleme sorusu: üç ay sonra teslim edilen parçanın delil değeri (zincirdeki boşluk) — oyunda parça, kriminal ön
   incelemeyle model aralığına bağlanır ve C3'te "tutanaktaki cam"ı destekleyen delil olarak kabul edilir.
10. **Avukatın suç duyurusu ve kovalamama:** Kaçan sürücü için CMK 158 ihbarı; avukat kaportacının işyerine girmez, kamuya
    açık yerden gördüğünü not alır. İzinsiz garaja giriş TCK 116/2 (şikâyete bağlı) ve hukuka aykırı delil (CMK 206/2-a,
    217/2); ETIK sonunda baroya bildirim (Av.K. md. 34).
11. **Katılanla görüşme:** Avukatın karşı taraf katılanıyla görüşmesi yasak değildir; talep, telkin ve teklif içermemelidir.
    "Şikâyetten vazgeç" seçeneği hukuken yanlıştır (taksirle öldürme şikâyete bağlı değil; kovuşturma re'sen); beyanını
    yumuşatması karşılığında maddi teklif TCK 277 ve meslek kuralları ihlali olarak etik sayaca yazılır.
12. **Bilirkişiyle mahkeme dışı görüşme (ARA_NALAN):** Taraf avukatının bilirkişiyle raporu mahkeme dışında görüşmesi
    tarafsızlığı zedeler ve CMK 69 kapsamında ret tartışması doğurabilir; doğru seçenek reddetmektir.
13. **Sanığın son sözü:** Delillerle çelişen bir "ben öldürdüm" son sözü ikrar değil, sanığın kanaatidir; oyunda ikna puanını
    düşürür, sonuç koşullarını doğrudan değiştirmez. Sanığın kürsüde kusuru kabul etmesi (`kabul`) mahkûmiyet ve indirim
    gerekçelerinde ayrıca anılır.
14. **Rapora itirazın kabulü (H1_06):** CMK 67/5 itirazı ancak raporun hangi tespitine, hangi somut gerekçeyle yöneldiği
    gösterilirse yeni incelemeye yol açar. Oyunda itiraz, en az üç somut eksik (rapor satırlarındaki bulgular ve saha
    çıkarımları; en az biri sahadan: fren izi, camlar, kırık yüksekliği ya da arıza) varsa kabul edilir ve gerekçe yalnızca
    bulunan eksikleri sayar. Soyut itiraz ("rapor haksız") gerekçeyle reddedilir; heyet, ATK ve EDR gelmez, yalnızca
    bilirkişi dinlenir. Yorum: uygulamada mahkemeler somut olmayan itirazı da kimi zaman yeni raporla karşılar; oyun
    öğretici olarak somutlaştırma yükünü vurgular.
15. **İNDİRİM gerekçesi ve illiyet:** Mahkûmiyet için illiyetin şüpheden uzak ispatı gerekir (Anayasa 38/4; CMK 223/2-e
    karşıtı). INDIRIM gerekçesi bu nedenle pozitif tespittir ("özen yükümlülüğüne aykırı davrandığı ve bu davranışla ölüm
    arasında illiyet bağının bulunduğu kanaatine varılmıştır"); "illiyetin bulunmadığı ispatlanamadı" biçimindeki ispat
    yükünü tersine çeviren ifade kaldırıldı. Savunma Adli Tıp raporuyla illiyeti tartışmışsa (`arg_atk`) INDIRIM
    verilmez; o durumda kusur iddiası da çökmüşse BERAAT_E, çökmemişse MAHKUMIYET gerekçesine ATK raporunun neden yeterli
    görülmediği (başka aracın varlığının ispatlanamaması) yazılır. INDIRIM ayrıca kürsüde hız iddiasının çürütülmesini
    (EDR ya da fren izi) ve soruşturmada en az iki saha çıkarımını ister; bilinçli taksirin düşmesi bir dayanağa bağlanır.
16. **Sanayi sitesi ve kovalamama:** Avukat yedek parçacıda bir model aralığının tampon ölçüsünü öğrenir (bilirkişiye
    soracağı soru için genel bilgi); dönüşte kaldırımdan, kamuya açık yerden gördüklerini not alır. Kaportacıyı
    sorgulamak (SA_SOR) etik hata sayılır: soruşturmayı savcılık yürütür (CMK 160) ve soru delilin yok edilmesine yol
    açabilir. Suç duyurusu (SU_DAYANAKLI) renk, model, kırık stop ve düzeltilmiş saate dayanır; kaporta işyerlerinin
    araştırılmasını savcılıktan ister.
17. **Saatler:** Gün doğumu/batımı hesabı gerektiren bir nitelik (TCK 6/1-e gece vakti) bu suç tipinde ceza artırımı
    doğurmaz; saatler yalnızca olay örgüsü içindir.

## 6. Hassas konu denetimi

Lineup sınırı: cinsel suçlar, çocuklara yönelik suçlar ve terör davaları yok. Bu davada yok. Maktul yetişkin bir yayadır;
yenidoğan bebek yalnızca aile dramının parçasıdır, hiçbir suçun mağduru değildir.

## 7. Öz-inceleme kontrol listesi

- [x] Madde atıfları güncel metinle doğrulandı (TCK, CMK mevzuat.gov.tr; KTK ikincil kaynak, oyunda numarasız).
- [x] Ceza hesapları alt/üst sınırlar içinde ve aritmetik doğru (2 yıl → 1 yıl 8 ay → 600 gün; 3 yıl → 4 yıl 6 ay → 3 yıl 9 ay).
- [x] Mahkemeye hitap "Sayın Başkan"; görevli mahkeme asliye ceza, tek hâkim.
- [x] Hüküm metinlerinde istinaf süresi (CMK 273/1) ve beraatte tazminat bildirimi (CMK 141/1, 142, 231/3) var.
- [x] Etik ihlal seçenekleri doğru maddeye bağlı (Av.K. md. 34, TCK 116/2, 267, 277; CMK 69, 160).
- [x] Hukuka aykırı delil yalnızca kendisi dışlanır; hukuka uygun deliller ayrıca tartılır (ETIK ve disiplin epilogları).
- [x] Mahkûmiyet gerekçeleri illiyeti pozitif tespit olarak kurar; ispat yükü tersine çevrilmez.
- [x] Madde numaraları gündelik konuşmada geçmiyor; yalnızca Leyla'nın kısa açıklamalarında, geri bildirimde, rapor ve
      hüküm metninde ve resmî duruşma dilinde.
