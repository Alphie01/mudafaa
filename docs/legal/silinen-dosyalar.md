# Dava #13 "Silinen Dosyalar" — Hukuki İnceleme Notları

> Durum: **Onaylandı (Claude, iç inceleme), 2026-10-21** (inceleme bulguları sonrası yeniden onay; ilk onay 2026-10-20).
> `meta.legalReview = { status: 'APPROVED', by: 'Claude (iç inceleme)', at: '2026-10-21' }`.
> Madde atıfları karakterlerin gündelik konuşmasında geçmez; Leyla'nın açıklamalarında, seçenek geri bildirimlerinde,
> rapor ipuçlarında, hüküm/gerekçe metinlerinde ve duruşmanın resmî dilinde (hâkim, savcı, Deniz'in talepleri) yer alır.

Metinler güncel mevzuat PDF'leriyle karşılaştırılmıştır (erişim: 2026-10-20; 231. madde için 7589 sayılı Kanunla değişik metin):

- TCK 5237 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5237.pdf
- CMK 5271 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5271.pdf
- 1136 sayılı Avukatlık Kanunu — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.1136.pdf
- TBB Meslek Kuralları — https://www.barobirlik.org.tr/ (md. 38: karşı tarafla ancak vekili aracılığıyla temas)

## 1. Kullanılan maddeler ve doğrulama

| Madde | Kullanıldığı yer | Kontrol edilen metin (kısa) |
|---|---|---|
| TCK 243/1 | İddianame, BR_01, savunma, hükümler | Bir bilişim sisteminin bütününe ya da bir kısmına hukuka aykırı olarak giren: 1 yıla kadar hapis ya da adli para cezası. "Hukuka aykırı" giriş; rıza hukuka aykırılığı kaldırır. |
| TCK 243/3 | BR_01 (C şıkkı, çeldirici) | Fiil nedeniyle sistemdeki veriler yok olur/değişirse 6 ay–2 yıl; kasten yok etme değil, girme sonucu istem dışı. |
| TCK 244/1 | BR_01 (D şıkkı, çeldirici) | Sistemin işleyişini engelleme/bozma: 1–5 yıl. |
| TCK 244/2 | İddianame, BR_01, savunma, hükümler | Verileri bozan, yok eden, değiştiren, erişilmez kılan, sisteme veri yerleştiren, var olanı başka yere gönderen: 6 ay–3 yıl. Dosyanın ana suçu. |
| TCK 244/3 | BR_01 (D şıkkı, çeldirici) | Banka/kredi kurumu ya da kamu kurumu sistemi ise ceza yarı oranında artar; özel şirket kapsam dışı. |
| TCK 244/4 | BR_01 (B şıkkı, çeldirici) | Fiil başka suç oluşturmaksızın bir yarar sağlanmasıyla işlenirse 2–6 yıl; iddianamede yarar iddiası yok. |
| TCK 52/2 | NITELENDIRME, MAHKUMIYET (243/1) | Adli para cezası: gün sayısı × günlük 20–100 TL. Hükümlerde 100 gün × 20 TL = 2.000 TL. |
| TCK 51/1, 51/3 | KISMI (erteleme), MAHKUMIYET (ret) | 2 yıla kadar hapis ertelenebilir; geçmiş, sosyal ilişkiler ve yargılamadaki pişmanlık dolayısıyla yeniden suç işlemeyeceği kanaati gerekir; denetim süresi 1–3 yıl, cezadan az olamaz. |
| TCK 61 | Hükümler | Temel cezanın belirlenmesi ölçütleri. |
| TCK 53, 63 | Mahkûmiyet hükmü | Hak yoksunlukları; gözaltı/tutukluluğun mahsubu (burada adli kontrol; 63 tutukluluk için, mahkûmiyette anılır). |
| CMK 158, 160 | ARA_KARAR (bildir), rapor | Suç duyurusu Cumhuriyet Başsavcılığına; savcının araştırma yükümlülüğü. Avukat faili kovalamaz, bildirir. |
| CMK 63 | H1_02, bilirkişi talebi | Çözümü özel/teknik bilgi gerektiren hâllerde bilirkişiye başvurulur; bilirkişiyi mahkeme (hâkim/savcı) atar. |
| CMK 67/6 | H1_02, INV_IMAJ geri bildirimi | Taraflar, uzmanından rapor (uzman mütalaası) alabilir; bu bilirkişi raporu değildir, takdiri delildir. |
| CMK 134 | Leyla, imaj itirazı, hükümler | Bilgisayarlarda arama, kopyalama, el koyma; imajın bütünlüğü (yedekleme/kopya, taraf huzurunda) güvenceleri. |
| CMK 206/2-a, 217/2 | ETIK, hükümler | Hukuka aykırı yöntemle elde edilen delil reddedilir / hükme esas alınamaz. |
| CMK 217 | Leyla, savunma, hükümler | Hâkim, duruşmaya getirilmiş ve tartışılmış delilleri vicdani kanaatiyle serbestçe takdir eder; hukuka uygun elde edilmiş olma şartı. |
| CMK 177, 178 | INV_DIL, H1_05, tanık bildirimi | Savunmanın delil toplanması talebi; duruşmadan en az beş gün önce; reddedilen tanığın doğrudan getirilmesi. |
| CMK 201/1 | Ozan'ın yönlendirici sorusu, itiraz gerekçesi g_telkin | Doğrudan soru hakkı; yönlendirici/uygunsuz soruda başkan karar verir. |
| CMK 206/2-b | H1_04 itiraz (g_ilgisiz) | İspat edilmek istenen olayla ilgisi olmayan, gereksiz delil reddedilir. |
| CMK 210/1 | YD_YAZILI / KD_YAZILI geri bildirimi | Delil, bir tanığın açıklamasıysa tanık duruşmada dinlenir; yazılı beyan yerine geçmez. |
| CMK 48 | T_02K (Tarık'ın çekinmesi) | Tanık, kendisini ya da yakınlarını ceza kovuşturmasına uğratabilecek sorulara cevaptan çekinebilir; hatırlatılır. |
| CMK 215, 216 | T_01, mütalaa, son söz | Delilden sonra diyecek sorulur; tartışma sırası; son söz sanığındır. |
| CMK 223/2-a | 243/1 beraatleri (BERAAT_B, BERAAT_E, KISMI) | Yüklenen fiilin kanunda suç olarak tanımlanmamış olması; uygulamada "suçun yasal unsurları oluşmadığından" kalıbıyla, tipte yer alan "hukuka aykırı olarak" unsurunun gerçekleşmediği hâller için de kullanılır. |
| CMK 223/2-b, e | 244/2 beraatleri: BERAAT_B (2-b), BERAAT_E ve NITELENDIRME (2-e) | Suçun sanık tarafından işlenmediğinin sabit olması / işlendiğinin sabit olmaması. |
| CMK 231/3, 141 vd. | Beraat hükümleri | Tazminat hakkının bildirimi; koruma tedbiri nedeniyle tazminat. |
| CMK 231/5, 231/6 | NITELENDIRME (HAGB), KISMI ve MAHKUMIYET (ret) | HAGB: hükmolunan ceza ≤ 2 yıl hapis ya da adli para cezası; (a) sabıkasızlık, (b) yeniden suç işlemeyeceği kanaati, (c) suçla doğan zararın tamamen giderilmesi. |
| CMK 231/9 (7589 ile değişik) | KISMI, MAHKUMIYET | Zarar derhal giderilemiyorsa denetim süresi içinde taksitle giderilmesi koşuluyla HAGB verilebilir; sanığın bunu kabul etmesi gerekir. |
| CMK 58/1 | X_ILGISIZ geri bildirimi | Tanığa önce kimliği ve sanıkla ilişkisi sorulur; ilişki sorusu itiraz konusu olmaz. |
| CMK 149/1 | COKUS ara kararı | Sanık her aşamada müdafi seçebilir; vekâleti sona erdiren sanığa yeni müdafi için süre verilir. |
| CMK 63/1, 67 | T_01S, T_01X | Bilirkişi teknik konuda görüş bildirir; hukuki değerlendirme ve "kim kullandı" kanaati hâkime aittir. Teknik olasılık sorusu bilirkişinin alanındadır. |
| CMK 273/1 | Mahkûmiyet/nitelendirme hükmü | İstinaf: gerekçeli hükmün tebliğinden itibaren iki hafta (adli para/az cezalarda istinaf sınırı ayrıca gözetilir). |
| Av.K. 34 | Etik geri bildirimleri | Avukat görevini özen, doğruluk ve onur içinde yapar; tanığı yönlendiremez. |
| TBB Mesl. K. 38 | INV_T_TARIK ziyareti (etik ceza) | Karşı tarafla ancak vekili aracılığıyla görüşülür. |
| TCK 272, 38 | Tanığa söz ezberletme (geri bildirim) | Yalan tanıklık; azmettirme. |
| TCK 277 | Mağdura/tanığa müdahale (geri bildirim) | Yargı görevi yapanı/bilirkişiyi/tanığı hukuka aykırı etkileme. |
| TBK 512/1 | ETIK, COKUS (azil) | Vekâlet her zaman tek taraflı sona erdirilebilir. |
| Anayasa 38/4 | BERAAT_E gerekçesi | Suçluluğu sabit olana kadar masumiyet; şüpheden sanık yararlanır. |

## 2. Ceza hesabı
Hüküm iki ayrı soruya bölünür: **243/1** (17.10 21.30 girişi) ve **244/2** (18.10 02.14 silmesi). Her suç için ayrı
hüküm kurulur; ayrı ayrı belirlenen cezalar hükümde toplanmaz (toplama infaz aşamasının işidir).

| Sonuç | 243/1 (giriş) | 244/2 (silme) | Koşul (90-outcomes) |
|---|---|---|---|
| BERAAT_B | 223/2-a beraat (rıza → hukuka aykırılık yok) | **223/2-b** beraat (başkasının yaptığı kürsüde kanıtlandı) | rıza + başka fail kanıtı (cihaz/hat) + Tarık'ın çözülmesi + masumiyet talebi + ♥/ikna/skor; tanık yönlendirilmemiş |
| BERAAT_E | 223/2-a beraat | **223/2-e** beraat (imaj güvenilmez, silme sanığın cihazından değil) | rıza + imaj çöktü + cihaz bulgusu + ara evresi bulgusu (bilirkişi/zimmet/hat/kart) + ikna/skor |
| NITELENDIRME | **adli para** 100 gün × 20 TL = 2.000 TL (TCK 52/2); **HAGB** (231/5–6), 5 yıl denetim | 223/2-e beraat | rıza KURULAMADI + silme sanıktan koptu |
| KISMI | 223/2-a beraat | **1 yıl 3 ay** hapis (TCK 61); HAGB yok (231/6-c, 231/9: sanık zararı gidermeyi kabul etmedi); **erteleme** (TCK 51/1), 1 yıl 3 ay denetim | rıza kuruldu, silme koparılamadı |
| MAHKUMIYET | adli para 2.000 TL | **1 yıl 8 ay** hapis; HAGB yok (231/6-c, 231/9); erteleme yok (TCK 51/1: planlı işleniş, yargılamada zararı gidermeye yönelik çaba/pişmanlık yok) | varsayılan |
| COKUS | — | — | ♥0: ara karar; sanık vekâleti sona erdirir, yeni müdafi için erteleme (CMK 149/1) |
| ETIK | — | — | müvekkile izinsiz giriş yaptırıldı: delil dışlanır, bildirim, azil |

- 244/2 (6 ay–3 yıl): 1 yıl 3 ay ve 1 yıl 8 ay, zararın ağırlığı ve işleniş biçimiyle (TCK 61/1) alt sınırdan
  uzaklaşma; ikisi de 2 yılın altında olduğundan HAGB ve erteleme **hukuken mümkündür**. Hükümler bunları "cezanın miktarı"
  gerekçesiyle değil, somut nedenlerle değerlendirir: HAGB için 231/6-c (zararın giderilmesi) ve 231/9 (taksitle
  giderme) koşulunu sanığın kabul etmemesi; erteleme için KISMI'de olumlu kanaat (sabıkasız, sosyal ilişkiler),
  MAHKUMIYET'te olumsuz kanaat (yedeğin devre dışı bırakılmasıyla planlı işleniş, pişmanlık yok).
- 243/1'de seçimlik adli para tercih edildi: kişisel klasörle sınırlı erişim, zarar yok. Kısa süreli hapis ve TCK 50
  tartışması bu nedenle doğmaz. 243/1 eylemi nedeniyle giderilecek bir zarar olmadığından NITELENDIRME'de 231/6-c engeli
  yoktur.
- TCK 53 (hak yoksunlukları) yalnızca 244/2 hapis cezası bulunan hükümlerde; TCK 63 mahsup: sanık bir gün gözaltında
  kaldı (adli kontrol mahsuba konu değildir).

## 3. Usul akışı
Bursa 9. Asliye Ceza, tek hâkim (244/2 üst sınır 3 yıl, 243/1 1 yıl → asliye ceza görev alanı, CMK/5235 sayılı Kanun md.
11). Celse aşamaları: açılış ve kimlik (CMK 191), sanık savunması, delil tartışması ve diyecek (CMK 215), tanık dinleme
ve doğrudan soru (CMK 201), delil reddi (CMK 206), mütalaa ve son söz (CMK 216), takdir (CMK 217), hükmün açıklanması.
İki celse arası bilirkişi (CMK 63) ve müzekkerelerle delil toplama (CMK 177, 332).

## 4. Yorum gerektiren noktalar ve verilen kararlar
1. **Rıza ve 243/1 beraatinin bendi (CMK 223/2-a):** 243/1 "hukuka aykırı olarak" girmeyi tipin unsuru olarak sayar.
   İşveren hesabı "kişisel dosyalar için 31 Ekim'e kadar açık" bırakmışsa, bu süre ve amaçla sınırlı erişimde hukuka
   aykırılık unsuru yoktur. Sanık girişi yaptığını kabul ettiği için 223/2-b ("sanık tarafından işlenmediğinin sabit
   olması") yanlış olurdu; uygulamadaki "suçun yasal unsurları oluşmadığından 223/2-a" kalıbı seçildi. Rızayı genel
   hukuka uygunluk nedeni (TCK 26/2, hakkın kullanılması / ilgilinin rızası) olarak görüp 223/2-d'ye dayanmak da
   savunulabilir; oyun tipte açıkça yazılı unsur nedeniyle 2-a'yı kullanır.
2. **İki beraat türünün ayrımı mahkemedeki delile bağlıdır:** 244/2'de 2-b, silmenin başka birinden (cihaz NOS-GM-LT,
   genel müdüre tahsisli hat, kart kaydı) çıktığının kürsüde kanıtlanmasını ve masumiyet talebini ister; savcılığa suç
   duyurusu (CMK 158) hükmü değil, epilogu ve gerçek failin soruşturmasının hızını belirler. 2-e: imaj güvenilmez ve
   silme sanığın cihazından/hattından değil, ama başka bir fail kürsüde kurulmadı.
3. **NITELENDIRME'nin mantığı:** Rıza kanıtlanamadığında 21.30 girişi sabittir (sanık kabul ediyor, işten çıkarılmış);
   243/1 mahkûmiyeti buradan doğar. Silme sanıktan koptuğu için 244/2'den 2-e beraat. Ters durum (rıza var, silme
   kopmadı) ayrı bir sonuçtur: KISMI.
4. **Çöküş bir hüküm değildir:** Müdafiin yanlış sunumları ve tükenen güvenilirliği bir mahkûmiyete gerekçe olamaz
   (CMK 217/1; Anayasa 38/4). Oyunda ♥0, sanığın vekâleti sona erdirmesine ve yeni müdafi için ertelemeye yol açar.
5. **Kullanıcı adı ≠ fail:** Log'daki "S.AKTAS" kimlik değil kimlik doğrulama bilgisidir; şifreler zarfla başkasına
   teslim edilmişse kaydın delil değeri, cihaz/hat/kart gibi bağımsız verilerle desteklenmeden tek başına mahkûmiyete
   yetmez (CMK 217). Mahkûmiyet hükümlerinde (KISMI, MAHKUMIYET) gerekçe, dosyaya giren lehe bulguya göre değişir:
   bilirkişi farklı cihaz adını tespit ettiyse mahkeme bunu, cihazın başkasına ait olduğunun dosyaya kazandırılamaması
   nedeniyle tek başına yeterli görmez (takdir; istinafta tartışılabilir, epilog bunu söyler).
6. **Bilirkişi vs. uzman mütalaası:** Şikâyetçinin firmasının "imaj ve analiz raporu" CMK 67/6 uzman mütalaasıdır;
   bilirkişiyi mahkeme atar (CMK 63). İmajın bütünlüğü (özet değer, kopyalama usulü) CMK 134'e göre tartışılır.
   Katılan vekilinin bilirkişiye "ad değiştirilebilir mi" sorusu teknik bir olasılıktır ve bilirkişinin alanındadır;
   doğru hamle itiraz değil cevabı beklemektir (CMK 63/1, 201/1).
7. **İçtima:** 243 ve 244 ayrı hukuki yararları korur; gerçek içtima kabul edilmiştir, her suça ayrı ceza verilir.
   Girmenin silmenin zorunlu aracı olduğu görüşü de savunulmaktadır; oyun bu tartışmayı açmaz.
8. **Etik sınırlar:** Karşı tarafın genel müdürüyle vekili olmadan görüşme (TBB MK 38) cezalı; müvekkile izinsiz sistem
   girişi yaptırmak (TCK 243, 244; 38) + hukuka aykırı delil (CMK 206/2-a) → azil sonu; tanığa söz ezberletme (TCK 272,
   38; Av.K. 34) duruşmada ortaya çıkar: tanık açıklar, ♥ ve ikna düşer, beyan hükümde değerlendirme dışı kalır ve
   2-b beraati kapanır; faili kovalamak yerine savcılığa bildirme (CMK 158); koridorda sözlü bilgi ihbar sayılmaz
   (CMK 158/1: yazılı ya da tutanağa geçirilerek).

## 5. Hassas konu denetimi
Lineup sınırı: cinsel suçlar, çocuklara yönelik suçlar ve terör davaları yok. Bu davada: yok (bilişim/mal varlığı ve
sigorta sahtekârlığı bağlamı; çocuk karakter Defne yalnızca duygusal çapa, suç konusu değil).

## 6. Öz-inceleme kontrol listesi
- [x] Bütün madde atıfları güncel metinle doğrulandı (tablo dolu).
- [x] Ceza hesapları alt/üst sınırlar içinde; görevli mahkeme (asliye ceza, tek hâkim) doğru.
- [x] Beraat bentleri fiile göre ayrı: 243/1 → 223/2-a; 244/2 → 223/2-b ya da 2-e. Ayrı cezalar hükümde toplanmaz.
- [x] HAGB/erteleme reddi somut gerekçeli (231/6-c, 231/9; TCK 51/1), "cezanın miktarı" gerekçesi yok.
- [x] Hiçbir sonuç müdafiin güvenilirliğine dayanmaz; çöküş ara karardır.
- [x] Mahkemeye hitap "Sayın Hâkim"; savcıya "Sayın Savcı".
- [x] Hüküm metinlerinde istinaf süresi (CMK 273/1) ve tazminat bildirimi (CMK 231/3) var.
- [x] Etik ihlal seçenekleri doğru maddeye bağlı (Av.K. 34; TBB MK 38; TCK 243, 244, 272, 277; CMK 158, 206/2-a).
