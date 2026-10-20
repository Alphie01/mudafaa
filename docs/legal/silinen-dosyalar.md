# Dava #13 "Silinen Dosyalar" — Hukuki İnceleme Notları

> Durum: **Onaylandı (Claude, iç inceleme), 2026-10-20.** `meta.legalReview = { status: 'APPROVED', by: 'Claude (iç inceleme)', at: '2026-10-20' }`.
> Madde atıfları karakterlerin gündelik konuşmasında geçmez; Leyla'nın açıklamalarında, seçenek geri bildirimlerinde,
> rapor ipuçlarında, hüküm/gerekçe metinlerinde ve duruşmanın resmî dilinde (hâkim, savcı, Deniz'in talepleri) yer alır.

Metinler güncel mevzuat PDF'leriyle karşılaştırılmıştır (erişim: 2026-10-20):

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
| TCK 52 | NITELENDIRME hükmü | Adli para cezası (gün karşılığı). |
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
| CMK 223/2-b, e | BERAAT_B, BERAAT_E | Suçun sanık tarafından işlenmediğinin sabit olması / işlendiğinin sabit olmaması. |
| CMK 231/3, 141 vd. | Beraat hükümleri | Tazminat hakkının bildirimi; koruma tedbiri nedeniyle tazminat. |
| CMK 231/5 | NITELENDIRME | HAGB: hükmolunan ceza ≤ 2 yıl hapis ya da adli para cezası; sanığın kabulü ve koşulları (adli para cezasında da uygulanabilir). |
| CMK 273/1 | Mahkûmiyet/nitelendirme hükmü | İstinaf: gerekçeli hükmün tebliğinden itibaren iki hafta (adli para/az cezalarda istinaf sınırı ayrıca gözetilir). |
| Av.K. 34 | Etik geri bildirimleri | Avukat görevini özen, doğruluk ve onur içinde yapar; tanığı yönlendiremez. |
| TBB Mesl. K. 38 | INV_T_TARIK ziyareti (etik ceza) | Karşı tarafla ancak vekili aracılığıyla görüşülür. |
| TCK 272, 38 | Tanığa söz ezberletme (geri bildirim) | Yalan tanıklık; azmettirme. |
| TCK 277 | Mağdura/tanığa müdahale (geri bildirim) | Yargı görevi yapanı/bilirkişiyi/tanığı hukuka aykırı etkileme. |
| TBK 512/1 | ETIK (azil) | Vekâlet her zaman tek taraflı sona erdirilebilir. |
| Anayasa 38/4 | BERAAT_E gerekçesi | Suçluluğu sabit olana kadar masumiyet; şüpheden sanık yararlanır. |

## 2. Ceza hesabı
- **BERAAT_B / BERAAT_E:** ceza yok; adli kontrolün kaldırılması; CMK 141 vd. tazminat bildirimi. B'de dosyanın gerçek
  fail (genel müdür) hakkındaki soruşturmaya gönderilmesi.
- **NITELENDIRME:** 244/2'den beraat (silme sabit değil); 243/1 bakımından eylem "izin kapsamını aşan giriş" kabul
  edilirse seçimlik **adli para cezası** (TCK 243/1, 52); ceza 2 yılın altında ve koşullar lehte → **HAGB** (CMK 231/5),
  5 yıl denetim. Gerçekçi alt sınır: 243/1 seçimlik adli para; gün sayısı alt sınırdan (5 gün×…) takdiri.
- **MAHKUMIYET:** gerçek içtima; her suç için ayrı ceza, sonra toplama. TCK 244/2 (6 ay–3 yıl): zararın ağırlığı ve
  işleniş biçimi gözetilerek (TCK 61/1) alt sınırdan uzaklaşılıp **1 yıl 8 ay**; TCK 243/1 (1 yıla kadar hapis ya da
  adli para; seçimlik hapis tercih edilir): **4 ay**. Toplam **2 yıl hapis**. Hükmolunan cezalar 2 yılı aşmadığından HAGB
  (CMK 231/5) ve erteleme (TCK 51/1) hukuken mümkündür; hükümde sanığın olumsuz kişilik değerlendirmesi gerekçesiyle
  uygulanmaz (kurgusal takdir; hüküm ve epilog aynı şeyi söyler: "ne erteleme ne geri bırakma"). TCK 53, 63; istinaf
  CMK 273/1 (iki hafta).
- **Çöküş:** aynı mahkûmiyet; gerekçeye "savunmanın inandırıcılığı çöktü" notu (oyun içi).
- **ETIK:** hüküm yok; hukuka aykırı delilin dışlanması, bildirimler, azil.

## 3. Usul akışı
Bursa 9. Asliye Ceza, tek hâkim (244/2 üst sınır 3 yıl, 243/1 1 yıl → asliye ceza görev alanı, CMK/5235 sayılı Kanun md.
11). Celse aşamaları: açılış ve kimlik (CMK 191), sanık savunması, delil tartışması ve diyecek (CMK 215), tanık dinleme
ve doğrudan soru (CMK 201), delil reddi (CMK 206), mütalaa ve son söz (CMK 216), takdir (CMK 217), hükmün açıklanması.
İki celse arası bilirkişi (CMK 63) ve müzekkerelerle delil toplama (CMK 177, 332).

## 4. Yorum gerektiren noktalar ve verilen kararlar
1. **"Yetkisiz" girişin unsuru ve rıza:** 243/1 "hukuka aykırı giriş" arar. İşten çıkarılan çalışanın hesabı kapatılmamış
   ve işveren "kişisel dosyalar için açık kalsın" demişse, bu süre ve amaçla sınırlı erişim rızaya dayanır; hukuka
   aykırılık yoktur. Karar: 21.30 erişimi beraat (223/2-b) ya da nitelendirmede 243 dışı bırakılır. İzin kapsamının
   aşıldığı değerlendirilirse (NITELENDIRME yolu) 243/1 adli para + HAGB.
2. **Kullanıcı adı ≠ fail:** Log'daki "S.AKTAS" kimlik değil kimlik doğrulama bilgisidir; şifreler zarfla başkasına
   teslim edilmişse kaydın delil değeri, cihaz/hat/kart gibi bağımsız verilerle desteklenmeden tek başına mahkûmiyete
   yetmez (CMK 217).
3. **Bilirkişi vs. uzman mütalaası:** Şikâyetçinin firmasının "imaj ve analiz raporu" CMK 67/6 uzman mütalaasıdır;
   bilirkişiyi mahkeme atar (CMK 63). İmajın bütünlüğü (özet değer, kopyalama usulü, taraf huzuru) CMK 134'e göre
   tartışılır; kurcalanmış diskten alınan imajın değeri düşer.
4. **İçtima:** 243 ve 244 ayrı hukuki yararları korur; gerçek içtima kabul edilmiştir (her suça ayrı ceza, toplanır).
   Girmenin silme için zorunlu bir araç olduğu, bu yüzden yalnızca 244/2'nin uygulanması gerektiği görüşü de
   savunulmaktadır; oyun bu tartışmayı açmaz, mahkûmiyet hükmünde iki ayrı cezayı (1 yıl 8 ay + 4 ay) gösterir.
5. **Etik sınırlar:** Karşı tarafın genel müdürüyle vekili olmadan görüşme (TBB MK 38) cezalı; müvekkile izinsiz sistem
   girişi yaptırmak (TCK 243, 244; 38) + hukuka aykırı delil (CMK 206/2-a) → azil sonu; tanığa söz ezberletme (TCK 272,
   38; Av.K. 34); faili kovalamak yerine savcılığa bildirme (CMK 158).

## 5. Hassas konu denetimi
Lineup sınırı: cinsel suçlar, çocuklara yönelik suçlar ve terör davaları yok. Bu davada: yok (bilişim/mal varlığı ve
sigorta sahtekârlığı bağlamı; çocuk karakter Defne yalnızca duygusal çapa, suç konusu değil).

## 6. Öz-inceleme kontrol listesi
- [x] Bütün madde atıfları güncel metinle doğrulandı (tablo dolu).
- [x] Ceza hesapları alt/üst sınırlar içinde; görevli mahkeme (asliye ceza, tek hâkim) doğru.
- [x] Mahkemeye hitap "Sayın Hâkim"; savcıya "Sayın Savcı".
- [x] Hüküm metinlerinde istinaf süresi (CMK 273/1) ve tazminat bildirimi (CMK 231/3) var.
- [x] Etik ihlal seçenekleri doğru maddeye bağlı (Av.K. 34; TBB MK 38; TCK 243, 244, 272, 277; CMK 158, 206/2-a).
