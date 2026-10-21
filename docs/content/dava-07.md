# Dava #07 "Gece Bekçisinin Sırrı" — İçerik Taslağı v1

> Kaynak: onaylı plan (docs/plan.md) §11 ve Ek A. `content/cases/gece-bekcisinin-sirri/` bu taslaktan yazılır. Hukuki inceleme notları: docs/legal/dava-07.md.

## 11. Dava #07 "Gece Bekçisinin Sırrı" — içerik tasarımı (özet; ayrıntı Ek A)
Hukuk metinleri mevzuat.gov.tr'deki güncel PDF'lerle (TCK 5237, CMK 5271, 5188, Av.K. 1136, Yakalama Yönetmeliği) karşılaştırıldı.

- **Gerçek:**
  - Hırsızlığı Depo 3 işçisi **Murat Koç** yaptı: 42 numara zimmetli iş botu giyiyor, sigara içiyor, tefeciye borçlu.
  - Özel güvenlik görevlisi **Selin Kaya** Murat'ın gizli nişanlısı. 23.05'te Murat'la 6 dk konuştu ve "Kerem'di de" talimatını aldı. Ana kapıdaki kulübeden arka sokağı göremeyeceğini fark edince vardiyasını 18–24'ten 22–06'ya silerek değiştirdi.
  - 14 no'lu sokak lambası 9–14 Mart arasında arızalıydı. Kamera kablosu 22.40'ta kesildi, 23.30'da bantla eklendi.
  - Kerem'in parmak izi, 19.30'da Murat'ın isteğiyle top taşımasından kaldı.
  - Anahtar tüm vardiyada ortak. Ertesi sabah görev süresi dışındaki Selin, Kerem'in çantasını rızası olmadan arayıp anahtarı buldu; ne arama kararı ne arama tutanağı var.
  - Kerem 22.30–23.15 arasında çay ocağında Hüseyin Tan'laydı (22.57 tarihli fiş).
- **Yapı (tasarımdaki akışla aynı):**
  - **Brifing:** mentorun dosyayı devretmesi + ceza aralığı sorusu → Dosya ekranı + strateji seçimi.
  - **Soruşturma:** 3 gün × 3 eylem puanı.
    - OLAY YERİ: 13 Mart fotoğraf albümünde arama.
    - CEZAEVİ: Kerem görüşmesi (14 dk; ikinci ziyarette 8 dk).
    - TANIKLAR: Hüseyin, Selin, Murat.
    - ARŞİV: emanetteki vardiya çizelgesinin incelenmesi (CMK 153/4), belediye arıza kaydı, telefon kayıtları (öğretici yol ayrımı), CMK 177 delil dilekçesi (3 hak), çıkarım tahtası (0 EP).
  - **2. Celse:** tek oturumda tüm aşamalar sırayla:
    1. açılış (CMK 191);
    2. ek savunma hakkı hatırlatması (CMK 226);
    3. sanığın ve avukatın ek savunması (142/2-d);
    4. Selin'in yemini ve ifadesi; telkin edici soruya itiraz (CMK 201);
    5. çapraz sorgu: 4 ifade, BASTIR / DELİL SUN;
    6. Hüseyin'in dinlenmesi;
    7. anahtar ve teslim tutanağı: hukuka aykırı arama (5188 md. 7, 9; CMK 119; Anayasa 38/6; CMK 206/2-a, 217/2);
    8. parmak izi raporu; kolluk ifadesi (CMK 148/4);
    9. mütalaa + cevap hakkı (CMK 216/2);
    10. esas savunma, son söz, hüküm.

    Güvenilirlik 0'a düşerse "çöküş" kesintisi devreye girer.
- **Sonuçlar (öncelik sırasıyla):**
  1. **İKRAR:** müvekkili sahte ikrara yönlendirmek → mahkûmiyet 6 yıl 3 ay + etik kartı (Av.K. md. 34).
  2. **BERAAT — CMK 223/2-b:** gerçek fail gösterildi → tahliye, tazminat hakkı bildirimi, dosyanın Başsavcılığa gönderilmesi. Koşul: TOPLAM ≥3.600, ikna ≥8, HTS çelişkisi + bot izi çıkarımı + mazeret + teşhisin çöküşü.
  3. **BERAAT — CMK 223/2-e:** şüpheden sanık yararlanır. Koşul: ikna ≥6, en az 2 bulgu, TOPLAM ≥3.200 (iki temel dayanak birlikte varsa ≥2.600).
  4. **İNDİRİM:** 142/2-d düşer; 142/2-h + 143 + TCK 62 = 6 yıl 3 ay. Koşul: TOPLAM ≥2.000.
  5. **MAHKÛMİYET** (varsayılan): 7 yıl 6 ay; ayrıca çöküş varyantı.
- **Skor:**
  - Tasarımdaki ekran tutarları korunur (+300/−150, +300/−50, +100/+150/−20, +200).
  - TOPLAM = olay puanları + kalp × 100. Teorik tavan ~5.500; çubuk 5.000'de kırpılır.
  - Karar satırları: Delil toplama (x/6) = AR+DA · Çapraz sorgu = SO · İtiraz isabeti (x/7) = UB+HB · Savunma = SS · Güvenilirlik bonusu · Hatalı delil.
  - XP = ⌊TOPLAM/10 × f⌋ (f: 1,2 / 1,0 / 0,85 / 0,6 / 0,3 / 0); etik ihlali varsa yarıya iner.
- **Golden path'ler:** G1→BERAAT_B (5.130) · G2→BERAAT_E (3.645) · G3→İNDİRİM (2.010) · G4→MAHKÛMİYET (100) · G5→İKRAR · W→ÇÖKÜŞ. Hepsi `tests.goldenPaths`'e girer; sayılar yazım sırasında ince ayarlanır.
- **Tasarımdaki hukuki rakamların düzeltilmesi (UI aynı, veri değişir; tam liste Ek A.9):**
  - Kart: "TCK 142 · 3–7 yıl" → "TCK 142/2-h, 143 · 7,5–15 yıl".
  - "Savcılık talebi 5 yıl" → "İddianame: 142/2-h, 143".
  - Ceza aralığı etiketleri → "Beraat · TCK 62: 6y3a · 7,5 yıl · 15 yıl". HAGB etiketi kaldırıldı, çünkü HAGB ceza ≤2 yıl şartı ister.
  - "Ceza indirimi" ipucunda "etkin pişmanlık" yerine terditli savunma.
  - Karar metinleri 142/2-h + 143 + 62 hesabıyla ve istinaf süresiyle (CMK 273/1) yazılır.
  - HTS kaynağı → "CMK 135/6 hâkim kararı".
  - Kamera → "23.30'da bantla eklenmiş".
  - Görüşme süresi → "görüş salonunun kapanışı" (avukat–müvekkil görüşmesi süresiz ve gizlidir).
  - Arama ekranı → "13 Mart olay yeri fotoğrafları".
  - "Gece bekçisi" başlık olarak kalır; hukuki metinlerde "özel güvenlik görevlisi (5188)" kullanılır.
  - Mahkemeye hitap: "Sayın Başkan".
- **Hub düzeni:** 4 sekme korunur; çıkarım tahtası ARŞİV'de ve İnceleme CTA'sında. Hızlı müvekkil kartı, son görüşmeden bir cümle ve görüşmeye kısa yol seçenekleri gösterir.


## Ek A — Dava #07 içerik taslağı v1 (M1.4'te `case.json`'a dönüştürülecek)
**Kısaltmalar**
- Skor kategorileri: HB = Hukuki bilgi, DA = Delil analizi, AR = Araştırma, SO = Sorgulama, SS = Savunma stratejisi, UB = Usul bilgisi.
- ♥ = güvenilirlik · İk = heyet iknası · G/B/N = iyi/kötü/nötr işaret · "isabet" = İtiraz isabeti sayacına girer.
- Hub'da her eylem −1 EP harcar. `+x` = keşif.

### A.1 Gerçek ve kronoloji
Arka plan:
- 22–06 gece devriye kadrosu Şubat'ta kaldırıldı; geceleri tur atan kimse yok.
- Selin, 5188 sayılı Kanun kapsamında özel güvenlik görevlisi; vardiyası 18–24, görev yeri ana kapı kulübesi (CCTV monitörü burada).
- Murat: Depo 3, vardiyası 16–24; İSG zimmetinde 42 numara bot; sigara içiyor; tefeciye borçlu.
- Turuncu mont tüm çalışanların iş üniforması.

| Zaman | Olay |
|---|---|
| 9 Mart | 14 no'lu direk arızalanır, belediye kaydı açılır. Murat bunu fark edip planı kurar. |
| 12 Mart 19.30 | Murat, Kerem'den (Depo 1, 18–24) 40 top kumaşı Depo 3'e taşımaya yardım ister. Kerem'in izi dış kapı koluna geçer; bunu Murat kurgulamıştır. |
| 22.30 | Kerem çay ocağına geçer, Hüseyin Tan'la oturur. |
| 22.40 | Murat Depo 3 kamera kablosunu temiz keser; DVR "sinyal yok" gösterir. Selin monitörde görür ama kayda geçirmez. |
| 22.45–23.00 | Murat'ın kuzeni karanlık arka sokağa minibüs çeker; toplar arka kapıdan yüklenir; 42 no bot izleri kapıdan sokağa uzanır. |
| 22.57 | Hüseyin fiş keser: 2 çay + tost (fiş no 0412). |
| 23.00 | Minibüs ayrılır; Murat çöp kutusunun yanında sigara içer (taze izmarit). |
| 23.05 | Murat Selin'i arar (6 dk): "Bitti. Sorarlarsa turuncu montlu birini gördün; Kerem'di." |
| 23.15 | Kerem Depo 1'e döner. |
| 23.30 | Murat kesik kabloyu bantla ekler (arıza süsü verir; kayıt boşluğu 22.40–23.30). |
| 24.00 | Murat Depo 3'ü kilitler; Selin'in vardiyası biter. |
| 13 Mart 07.30 | Hırsızlık fark edilir; polis ve gece personeli çağrılır. |
| 08.05 | Görevi bitmiş olan Selin, Kerem'in çantasını zorla alır ve anahtarı çıkarır (anahtar tüm vardiyada aynı). |
| 08.20 | Kom. Yusuf Er teslim tutanağı düzenler; arama kararı, emri ya da tutanağı yok. Murat "Gece Depo 3'te Kerem dolaşıyordu" der; Selin Kerem'i "tanır". |
| 08.40 | Olay yeri fotoğrafları çekilir. İzmarit Emanet No. 3 olarak alınır ama incelemeye gönderilmez; kamera "arızalı" diye kaydedilir. |
| 09.10 | Selin'in kolluk ifadesi: "Uzaktan, karanlıktı, yüzünü tam seçemedim; turuncu iş montu. Sabah Murat 'Kerem'di' deyince…" |
| 09.30 | Kerem'in müdafisiz kolluk ifadesi: "19.30'da Murat abinin isteğiyle Depo 3'e top taşıdım." |
| 13 Mart (sonra) | Selin ana kapıdan arka sokağın görünmediğini fark eder; çizelgedeki "18.00–24.00"ı silip "22.00–06.00" yazar. Kolluk 14 Mart'ta değiştirilmiş asla el koyar. |
| 14 / 15 Mart | Lamba onarılır / Kerem tutuklanır. |
| Sonra | İddianame TCK 142/2-h, 143 ile Ağır Ceza'ya gider. 1. celsede Kerem sorgulandı, Selin gelmedi. Annesi Av. Deniz Arslan'ı tutar; 2. celseye 14 gün var. |

### A.2 Node grafiği
**Brifing**
- **BR_01 · STORY + CHOICE.** Mentor Leyla Erdem dosyayı devreder (UYAP, CMK 153/4).
  - Başlangıç delilleri: ev_anahtar, ev_teslim_tutanagi, ev_parmak_izi_raporu, ev_selin_kolluk, ev_kerem_kolluk, ev_vardiya.
  - Soru: "Olası ceza aralığı?"
    - "142/2-h + 143: 7 yıl 6 ay–15 yıl" → HB+50, G.
    - "142/1: 3–7 yıl" → 0, B: "142/1 bentleri depo içi eşyaya uymaz."
    - "141: 1–3 yıl" → 0, B: "Bina içinde muhafaza nitelikli haldir."
  - Benim kararım: soru Dosya ekranından önce gelir, yoksa cevap ekranda görünürdü.
- **BR_02 · STORY (phase BRIEFING).** Dosya ekranı (düzeltilmiş rakamlarla) + strateji grubu: Masumiyet / Usul hatası / Ceza indirimi. `strategy` ayarlanır, `day=1`, `ap=3` → "SORUŞTURMAYA BAŞLA" → INV_HUB.

**Soruşturma**
- **INV_HUB · INVESTIGATION.** Başlık "GÜN d/3 · 2. celseye 14/10/6 gün". Bu takvim, CMK 177'deki "duruşmadan en az 5 gün önce" şartına uyar.

  | Sekme | Eylem | Not |
  |---|---|---|
  | OLAY YERİ | "Olay yeri fotoğraflarını ara" → INV_ARAMA | bir kez |
  | CEZAEVİ | "Kerem'le görüş" → INV_GORUSME | min=14 |
  | CEZAEVİ | "Tekrar görüş" | min=8 |
  | TANIKLAR | Hüseyin → INV_T_HUS · Selin → INV_T_SEL · Murat → INV_T_MUR | her biri bir kez |
  | ARŞİV | Vardiya çizelgesi → INV_INCELEME · Belediye arıza kaydı → INV_BEL · Telefon kayıtları → INV_HTS · Delil dilekçesi → INV_DIL | |
  | ARŞİV | Çıkarım tahtası → INV_CIKARIM | 0 EP, en az 2 kart |

  - "DURUŞMAYA GİT" (0 EP, onay ister) → C_00.
  - Tetikleyici: ap=0 ∧ day<3 → INV_DAY_END (o günün teslimatları gelir, day+1, ap=3).
  - ap=0 ∧ day=3 → yalnızca Çıkarım ve Duruşma kalır.
- **INV_GORUSME · DIALOGUE.**
  - İlk ziyarette kapıda Saniye Aydın: +fact_sigara_yok, +fact_kerem_39.
  - Çerçeve metni: "Görüş salonu 17.00'de kapanıyor; Ali Çetin konuşmaları duyamaz."
  - Ton: Yumuşak güven +4 / Sert güven −8 + ek bilgi.
  - Her konu 3 dk, SO+20:
    - **"O gece":** "19.30'da Murat abi Depo 3'e top taşımaya çağırdı; 22.30 gibi çay ocağına geçtim." → +fact_gece, +fact_19_30. Sert tonla ayrıca +fact_murat_cagirdi.
    - **"Anahtar":** "Bütün vardiyaya aynı anahtar… Selin abla çantamı elimden alıp açtı." → +fact_anahtar_ortak, +fact_rizasiz_arama. Sert tonla ayrıca "Vardiyası gece bitmişti, sabah orada ne işi vardı?" → +hint_selin_offduty.
    - **"Hüseyin abi":** "23.15'e kadar beraberdik; fiş cüzdanımda, cüzdan annemde." → +fact_mazeret, +ev_fis, AR+50.
    - **"Kendisi":** Yumuşak "Sigara bile içmem." (+fact_sigara_yok) / Sert "Annemin ilaç borcu var…" (+fact_borc).
  - PRESENT "Çamurda 42 numara bot izi" {clue_iz42, en az 5 dk}:
    - güven ≥40 → AR+200, güven +6, +fact_murat_reveal, suspect_murat; tasarımdaki "39'um ben… Murat abi o gece Depo 3'teydi…" cevabı; G.
    - güven <40 → 0, B: "Güveni düşük müvekkil sakladığını açmaz."
  - "Görüşmeyi bitir" → INV_HUB.
- **INV_ARAMA · SCENE** ("Depo Sokağı · 13 Mart olay yeri fotoğrafları", büyüteç 6):
  - lamba → AR+40, +clue_ampul.
  - kamera → AR+40, +clue_kablo ("temiz kesilmiş, üstü bantlanmış").
  - iz → AR+60, +clue_iz42 ("ölçekli fotoğrafta 28,5 cm (~42 no)").
  - çöp → AR+40, +clue_izmarit ("Emanet No. 3, incelenmemiş").
  - Boş alan → büyüteç −1, AR−10.
  - Hak bitince veya butonla → INV_HUB.
- **INV_INCELEME · DOCUMENT** (zabıt kâtibi Zeynep Kılıç'ın önünde; 8 deneme hakkı):
  - UV × Selin → DA+150, +clue_uv_silinti.
  - Büyüteç × Kerem → DA+100, +clue_kerem_depo1.
  - Karşılaştır × Murat → DA+150, +clue_murat_42, +ev_isg_zimmet.
  - İz tozu × herhangi bir satır → DA−20, B: "Emanetteki delile toz uygulanmaz; bilirkişi, CMK 63."
  - Diğer tüm eşleşmeler → DA−20.
- **INV_CIKARIM · DEDUCTION** (0 EP): geçerli çiftler DA+300; diğer her çift DA−50 ("Bu ikisi birbirini açıklamıyor.").
- **INV_BEL · CHOICE** (belediye arıza kaydı):
  - "Avukat sıfatıyla belediyeye başvur (Av.K. 2/3)" → AR+20, UB+20; kayıt ertesi günün sonunda gelir (3. gün seçilirse duruşmada); G.
  - "Mahkemeden müzekkere (CMK 177)" → UB+20; kayıt C_00'da gelir, çıkarım tahtasına yetişmez; G.
  - "Bilgi edinme başvurusu (4982)" → 0, N: "15 iş günü; yetişmez."
- **INV_HTS · CHOICE** (telefon kayıtları; öğretici yol ayrımı):
  - "Operatördeki tanıdıktan Selin'in kaydını al" → UB−100, etik +1, +ev_hts_illegal; B: "TCK 136; delil olamaz (Anayasa 38/6, CMK 206/2-a, 217/2); disiplin."
  - "Mahkemeden tanığın HTS'sini iste" → 0, N: "CMK 135/6 yalnızca şüpheli ve sanığın iletişimini kapsar."
  - "Murat hakkında suç duyurusu + iletişim tespiti talebi (CMK 158, 135/6)":
    - {suspect_murat ∨ clue_murat_42} → UB+40, AR+20, sucduyurusu_murat; ev_hts C_00'da gelir; G.
    - Alt seçim "Selin'i de ekle (TCK 272/267, çizelge)" {clue_uv_silinti} → HB+20, sucduyurusu_selin.
    - Dayanak yoksa → UB−40, B: "Somut dayanaksız; iftira riski (TCK 267)."
  - "Kerem'in kendi HTS'si" → 0, N: "Aynı baz istasyonu; ayırt edici değil."
- **INV_DIL · CHOICE** (CMK 177 delil dilekçesi; 3 hak; yararlı her seçim UB+20; seçimler geri alınamaz; "Dilekçeyi ver" en az 1 seçimle döner):
  - Hüseyin'in tanık olarak çağrılması → huseyin_summoned.
  - İzmarit DNA incelemesi (CMK 78–79) {clue_izmarit} → ev_dna C_00'da gelir.
  - Bilirkişinin duruşmada dinlenmesi (CMK 68/1) → bilirkisi_present.
  - Kamera/kablo bilirkişi incelemesi {clue_kablo} → ev_kamera C_00'da gelir.
  - Belediyeye müzekkere {arıza kaydı henüz yoksa}.
  - "Tanık Selin'in HTS'si" ve "Keşif" → 0, N (ikisi de reddedilir).
- **Tanık ziyaretleri:**
  - **INV_T_HUS:** "22.30–23.15 yanımdaydı; rulo kopyası kasada." → AR+40, +clue_huseyin.
    - "Duruşmaya gel; tanık bildir (CMK 179)" → UB+20, huseyin_will_attend, G.
    - "Yazılı beyan yeter" → 0, N: "CMK 210/1: duruşmada dinlenmeli."
  - **INV_T_SEL:**
    - "Görüşme iste" → 0, N: "Tanık mahkeme dışında görüşmeye zorlanamaz."
    - "Baskı yap" → UB−100, etik +1, selin_pressured (duruşmaya ♥4 ile başlanır); B: "TCK 277."
  - **INV_T_MUR:** Murat yalan söyler ("22.30'da kilitledim…") → SS−50, B: "Olası faili, delil güvenceye alınmadan uyardın."

**2. Celse** (başlangıç ♥5, selin_pressured ise ♥4; İk 2)
- **C_00 · STAGE — açılış (CMK 191/1–2):** "Sanık bağsız alındı; tanıklar salondan çıkarıldı; ara karar cevapları okundu: [gelenler / ret gerekçeleri]."
- **C_01 · OBJECTION L1 (CMK 191/3-b, 226/1).** Başkan, eylemin 142/2-d kapsamında da değerlendirilebileceği için ek savunma hakkını hatırlatır.
  - "Ek savunma için süre iste (226/3)" → UB+50, isabet; arada güven <50 ise güven +10; G.
  - "Devam" → 0, N.
  - "İtiraz: iddianameye bağlısınız" → UB−50, ♥−1, İk−1; B: "CMK 225/2."
- **C_02 · DIALOGUE — sanığın ek savunması** (Kerem'e tavsiye):
  - "Reddet; 22.30–23.15 çay ocağı; 19.30 yardım; anahtar herkeste" → SS+100, G. İstisna: güven <40 ve ara verilmediyse Kerem patlar → ♥−1, İk−1.
  - "Susma hakkı (CMK 147/1-e)" → 0, N: "Mazereti kendi ağzından anlatma fırsatı kaçtı."
  - "Murat'ı suçlasın" → {fact_murat_reveal} SS+25, N; değilse SS−50, ♥−1, B: "TCK 267 riski."
  - "Suçu kabul etsin; 168 + 62 isteyelim" → C_02D. Kerem: "Ama ben yapmadım…"
    - "Israr et" → false_confession, SS−300, İk−2, etik +1; B: "Av.K. 34; sahte ikrar TCK 270; 168 tam tazmin ister."
    - "Geri adım at" → SS−50, güven −10; B.
- **C_03 · OBJECTION L2 — avukatın ek savunması:**
  - "142/2-d oluşmadı: işverence verilen anahtar 'haksız yere elde bulundurulan' değil; kullanıldığına delil yok" → HB+150, arg_142_2d, isabet; G.
  - "142/1-e uygulansın" veya "TCK 145" → HB−50, İk−1; B.
  - "Diyecek yok" → 0.
- **C_04 · STAGE — Selin** (kimlik, uyarı, yemin; CMK 58, 53–55):
  - {sucduyurusu_selin} "CMK 50/1-c: yeminsiz dinlensin" → UB+25, G.
  - Ardından Selin dört ifadesini kesintisiz verir (CMK 59/1).
- **C_05 · OBJECTION L3.** Savcı: "Gördüğünüz kişi sanıktı, değil mi?"
  - "İtiraz: telkin edici soru (CMK 201/1)" → UB+100, isabet; G.
  - "Sessiz kal" → İk−1, N.
  - "Tanık yalan söylüyor!" → UB−50, ♥−1; B.
- **C_06 · TESTIMONY** (ayrıntı A.5); "Çapraz sorguyu bitir" → C_07.
  - **C_06H** (doğru HTS sunumundan sonra; başkan CMK 48'i hatırlatır):
    - "TCK 274'ün hatırlatılmasını talep et" → HB+50, selin_cozuldu. Selin: "Murat… nişanlım. 'Kerem'di de' dedi. Çizelgeyi ben düzelttim." G.
    - "Tehdit et" → UB−50, ♥−1; B.
    - "Geri çek" → 0.
- **C_07 · STAGE — Hüseyin** {huseyin_will_attend ∨ huseyin_summoned}:
  - "Fişle sor: kasanızdan mı, saat?" → SO+100 (ded_mazeret varsa +50 daha), İk+1 (ded_mazeret varsa +2), huseyin_testified; G.
  - "İyi çocuk mudur?" → huseyin_testified, N: "Karakter tanıklığı mazereti ispatlamaz."
  - Koşul sağlanmazsa: "Mazeret tanığı dinlenmedi."
- **C_08 · OBJECTION L4 — anahtar + teslim tutanağı** ("Diyeceğiniz?", CMK 215):
  - "Hukuka aykırı arama: görev süresi dışında (5188 md. 9/1), yetki aşımı (md. 7/a yalnızca cihazla giriş kontrolü), karar/emir yok (CMK 119/1), rıza yok → Anayasa 38/6, CMK 206/2-a, 217/2, 230/1-b" → UB+150 (fact_rizasiz_arama yoksa 100), key_excluded, İk+1, isabet; G.
  - "İspat gücü yok" → DA+75; G.
  - "CMK 118 gece araması" → UB−50, ♥−1; B: "Arama 08.05'te."
  - "Yok" → 0; B.
- **C_09 · OBJECTION L5 — parmak izi raporu:**
  - {bilirkisi_present} "Bilirkişiye: iz zamanı belirlenebilir mi?" → SO+50, DA+100, fp_neutralized, İk+1, isabet. Dr. Kaan Öz: "Hayır."
  - {bilirkişi yoksa} "Çalışan; zaman belirsiz; 19.30 taşıma" → DA+100 (fact_19_30 varsa +50), fp_neutralized, İk+1, isabet.
  - "Hukuka aykırı alındı" → UB−50, ♥−1; B: "CMK 81/1 savcı emriyle alındı."
  - "Yeni bilirkişi" → 0, N.
  - "Yok" → 0; B.
- **C_10 · OBJECTION L6 — savcının karşı delili** (Kerem'in müdafisiz kolluk ifadesi):
  - "CMK 148/4 + bağlam (19.30, 23.00 değil)" → UB+100, isabet; G.
  - {fact_19_30} "Kerem 19.30'u açıklasın" → SS+75, isabet; G.
  - "İşkence" → UB−50, ♥−1; B.
  - "Yok" → 0.
  - Ardından otomatik okuma: ev_dna ve ev_kamera her biri İk+1.
- **C_11 · STAGE — mütalaa (CMK 216/1).** Mütalaa iki varyantlıdır: {selin_cozuldu ∧ ded_iz_murat} ise "beraat + suç duyurusu", değilse "142/2-d, h, 143, 53; tutukluluğun devamı". Ardından **OBJECTION L7 — cevap hakkı (216/2):**
  - "Hukuka aykırı delil hükme esas alınamaz (217/2, 230/1-b)" → UB+100, isabet. Beraat varyantında bunun yerine "Katılıyoruz; dayanak 223/2-b olmalı" → HB+100.
  - "Cevap yok" → 0.
  - "Mütalaa tutanaktan çıkarılsın" → −50, ♥−1; B.
- **C_12 · CHOICE — esas savunma.** Taban SS puanı; seçilen savunma stratejiyle uyumluysa çarpan uygulanır (Masumiyet→A, Usul→B, İndirim→C).
  - A "Gerçek fail başkası: 223/2-b + suç duyurusu": {contra_s4_hts ∧ ded_iz_murat ∧ (mazeret ∨ contra_s2)} → +200, İk+1, murat_theory; değilse −100, İk−1.
  - B "Şüpheden sanık yararlanır: 223/2-e": {en az 2 bulgu ∧ (contra_s2 ∨ alibi)} → +200, İk+1; değilse −100.
  - C "Öncelikle beraat; aksi halde 142/2-d düşsün, alt sınır, TCK 62 (terditli)" → +150, closing_lehe.
  - D "Etkin pişmanlık + HAGB" → HB−150, İk−2; B: "168 failin tazminini, HAGB ≤2 yıl ceza ve tam tazmini ister; masumiyetle çelişir."
  - E "Duygusal saldırı" → SS−50, İk−1; B.
- **C_13 · CHOICE — son söz (CMK 216/3):**
  - "Ben yapmadım. Adaletinize güveniyorum." → SS+25; G.
  - "Ağlayarak merhamet" → 0, N: "TCK 62/2: şeklî tutum indirim nedeni değildir."
  - "Selin'e öfke" → SS−25, İk−1; B.
  - {false_confession} ise son söz otomatik "Pişmanım." olur.
- **C_14 · DECISION** ("Hüküm fıkrası ayakta dinlenir", CMK 231/4) → A.6.
- **C_INT_COKUS · STORY** (♥ ≤ 0 olunca global kesinti): "Heyet nezdinde savunmanın inandırıcılığı kalmadı." → cokus → kısa son söz → C_14.

### A.3 Değişkenler

| Anahtar | Tip | Başlangıç | Aralık | Gösterim |
|---|---|---|---|---|
| strategy | enum MASUMIYET/USUL/INDIRIM | – | – | Karar başlığı |
| day / ap | int | 1 / 3 | 1–3 / 0–3 | HUD sayaç + pips |
| trust | int | 62 | 0–100 | percentBar |
| min | int | 14 (ikinci ziyarette 8) | 0–14 | minutes |
| tone | enum | soft | – | UI toggle |
| taps / exam_left / slots | int | 6 / 8 / 3 | 0'a kadar | counter |
| cred | int | 5 | 0–5 | hearts |
| pers | int | 2 | 0–10 | meter10 |
| wrong, legal_hits, ethics, visits | int | 0 | – | gizli |

- **Bayraklar (bool):**
  - Görüşme bilgileri: fact_gece, fact_19_30, fact_murat_cagirdi, fact_anahtar_ortak, fact_rizasiz_arama, hint_selin_offduty, fact_mazeret, fact_sigara_yok, fact_borc, fact_murat_reveal, fact_kerem_39, suspect_murat.
  - Talepler ve tanıklar: huseyin_will_attend, huseyin_summoned, huseyin_testified, bilirkisi_present, sucduyurusu_murat, sucduyurusu_selin, illegal_hts, selin_pressured.
  - Duruşma: arg_142_2d, contra_s1, contra_s2, contra_s4_kolluk, contra_s4_mazeret, contra_s4_hts, press_{s1,s2,s3a,s3b,s4a,s4b}, selin_cozuldu, key_excluded, fp_neutralized, illegal_presented, false_confession, murat_theory, closing_lehe, cokus.
- **Türetilmiş değerler:**
  - `alibi` = ded_mazeret ∧ huseyin_testified.
  - `findings` = şu bulgulardan doğru olanların sayısı: contra_s1, contra_s2, herhangi bir S4 çelişkisi, alibi, key_excluded, fp_neutralized.

### A.4 Delil ve ipucu kataloğu

| id | Ad | Tür / tip | İkon | Keşif | Hukuki not | Sunulabilir |
|---|---|---|---|---|---|---|
| ev_anahtar | Depo anahtarı | EV / FİZİKSEL | key | başlangıç | rızasız, yetkisiz arama → dışlanabilir | evet (ifadede hep yanlış) |
| ev_teslim_tutanagi | Teslim tutanağı 08.20 | EV / BELGE | document | başlangıç | arama kararı/tutanağı yok | hayır |
| ev_parmak_izi_raporu | Parmak izi raporu | EV / ADLİ_RAPOR | fingerprint | başlangıç | CMK 81/1'e uygun; iz zamanlanamaz | evet |
| ev_selin_kolluk | Selin'in kolluk ifadesi | EV / TANIK_İFADESİ | document | başlangıç | CMK 212/2 | S2 ✓, S4 kısmi |
| ev_kerem_kolluk | Kerem'in kolluk ifadesi | EV / BELGE | document | başlangıç | CMK 148/4 | hayır |
| ev_vardiya | Vardiya çizelgesi (aslı) | EV / BELGE | document | başlangıç; UV ile güçlenir | CMK 153/4 | S1 (UV ile) |
| ev_fis | Çay ocağı fişi 22.57 | EV / BELGE | receipt | görüşme: "Hüseyin abi" | Hüseyin doğrular | çıkarım girdisi |
| ev_ariza_kaydi | Belediye arıza kaydı (14 no, 9–14 Mart) | EV / BELGE | bulb | INV_BEL / dilekçe | Av.K. 2/3 | S2 ✓ |
| ev_kamera | DVR + kablo raporu | EV / KAMERA_KAYDI | camera | dilekçe {clue_kablo} | bilirkişi (CMK 63) | duruşmada okunur |
| ev_hts | Murat↔Selin 23.05, 6 dk | EV / TELEFON_KAYDI | phone | suç duyurusu → C_00 | CMK 135/6 hâkim kararı | S4 ✓ (S4b'den sonra) |
| ev_hts_illegal | Gayriresmî döküm | EV / TELEFON_KAYDI | phone (kırmızı) | INV_HTS ilk seçenek | TCK 136; dışlanır | sunulursa ♥−2 |
| ev_dna | İzmarit DNA ≠ Kerem | EV / ADLİ_RAPOR | cigarette | dilekçe {clue_izmarit} | CMK 78–79 | duruşmada okunur |
| ev_isg_zimmet | İSG zimmet listesi (Murat 42, Kerem 39) | EV / BELGE | boot | Karşılaştır × Murat | – | – |
| clue_ampul, clue_kablo, clue_iz42, clue_izmarit | Fotoğraf bulguları | CLUE / FOTOĞRAF | bulb, camera, boot, cigarette | INV_ARAMA | – | hayır |
| clue_uv_silinti, clue_kerem_depo1, clue_murat_42 | Belge bulguları | CLUE / BELGE | document, boot | INV_INCELEME | – | hayır |
| clue_huseyin | "23.15'e kadar yanımdaydı" | CLUE / TANIK_İFADESİ | receipt | INV_T_HUS | duruşmada dinlenmeli | hayır |

Yeni ikonlar (tasarımın stroke stilinde): fingerprint, boot, cigarette, magnifier, uv, dust, compare.

### A.5 Çıkarımlar ve tanık ifadeleri
- **Çıkarımlar** (her biri DA+300; diğer her çift DA−50):
  - ampul + arıza → **ded_lamba** "Lamba o gece yanmıyordu" (teşhisi çürütür).
  - iz42 + murat42 → **ded_iz_murat** "İz Murat Koç'a ait olabilir".
  - fiş + Hüseyin → **ded_mazeret** "Kerem'in mazereti doğrulandı".
  - Çeldirici kartlar: kablo, izmarit, uv_silinti, kerem_depo1.
- **Selin Kaya'nın ifadeleri:**
  - BASTIR SO puanı verir.
  - Doğru sunum: SO+300, İk+2.
  - Yanlış sunum: −150 (HATALI_DELIL), ♥−1, İk−1.
  - Kısmi sunum: SO+100; ifade açık kalır.
  - **S1** "O gece 22.00–06.00 vardiyasındaydım. Depo kapısını her saat kontrol ederim."
    - BASTIR (+25): "23.00'te neredeydiniz?" → "Depo 3'ün arka sokağında, devriyede."
    - Vurgu, bastırıldıysa ya da UV ipucu bulunduysa açılır.
    - ✓ ev_vardiya, yalnızca clue_uv_silinti varsa: "…18–24'teydim, ana kapıda." Ardından üye hâkim (CMK 201/2): "Ana kapıdan arka sokak görünür mü?" → "…Görünmez."
    - UV ipucu olmadan ev_vardiya sunmak yanlış sayılır: "Çizelgede de 22–06 yazıyor."
  - **S2** "Saat 23.00 gibi depodan çıkan birini gördüm. ‹Sokak lambası yanıyordu›, yüzünü net seçtim."
    - Vurgu hep açık. BASTIR (+25): "Yirmi metre; 14 numaralı direk."
    - ✓ ev_ariza_kaydi, ded_lamba ya da ev_selin_kolluk (CMK 212/2 ile okunur): "…Belki yanmıyordu. Ama montunu gördüm!"
  - **S3** "Turuncu bir mont giyiyordu, elinde büyük bir çuval vardı."
    - BASTIR A (+50, İk+1): "Firmanın iş montu; herkes giyer, Murat da Kerem de."
    - BASTIR B (+25): "40 top bir çuvala sığar mı?" → "Belki bir araç vardı."
    - Bu ifadede hiçbir sunum kabul edilmez ("Çelişki yok; bastırmak yeterliydi.").
  - **S4** "Ertesi sabah Kerem'i görünce hemen tanıdım. Aynı adamdı."
    - BASTIR A (+50, İk+1): "Murat Koç 'Kerem'di' dedi; baktım, oydu."
    - BASTIR B (+25, A'dan sonra): "Murat'ı ne kadar tanırsınız?" → "‹Pek tanımam›." Bu yeni ve vurgulu bir satır ekler.
    - Kısmi kabul: ev_selin_kolluk (BASTIR A'dan sonra) veya ded_mazeret.
    - ✓ ev_hts, BASTIR B'den sonra → C_06H.
    - ev_hts_illegal sunulursa: savcı itiraz eder, mahkeme dışlar (CMK 206/2-a) → −150, UB−150, ♥−2, illegal_presented.

### A.6 Sonuçlar (öncelik sırasıyla; İKRAR ve varsayılan dışındakiler ayrıca ¬cokus ister)

> **v2 değişikliği (2026-10-20, Ek B.3):** Sonuç *mantığı* aynı, final eşikleri yeniden ölçeklendi: İNDİRİM ≥2.000 → **≥3.000**;
> BERAAT_E ≥3.200 → **≥7.000** (mazeret + çöken teşhis yolunda ≥2.600 → **≥5.500**); BERAAT_B ≥3.600 → **≥8.000**. Eşik çubuğu
> 0 / 3.000 / 7.000, `scaleMax` 10.000. Mahkûmiyet hükümlerinde "tutukluluğun devamına" → "tutukluluk hâlinin devamına
> (2. celsede adli kontrolle tahliye edilmişse … hükümle birlikte tutuklanmasına, CMK 100–101)". Her sonucun `epilogue`'u var.
> Aşağıdaki metin v1 eşikleriyle bırakıldı; geçerli değerler Ek B.3'tedir.
>
> **v3 değişikliği (2026-10-20, Ek C.3):** BERAAT_E ara evresinden bir bulgu ister (ded_arama ∨ clue_kart_murat) ve ikinci eşik 6.500'dür;
> BERAAT_B Murat'a giden bir ara bulgusu ister (murat_caught ∨ clue_kart_murat ∨ ded_nisan) ve eşiği 8.500'dür.
1. **İKRAR** {false_confession}
   - Damga MAHKÛMİYET, ceza **6 yıl 3 ay**.
   - Hüküm: "…TCK 142/2-h uyarınca alt sınırdan 5 YIL; TCK 143 ile 7 YIL 6 AY; TCK 62/1 ile 6 YIL 3 AY HAPİS; zarar giderilmediğinden TCK 168/2 uygulanmasına yer olmadığına; TCK 53; TCK 63 mahsup; tutukluluğun devamına; gerekçeli kararın tebliğinden itibaren iki hafta içinde istinaf (CMK 273/1)."
   - Etik kartı: "Masum olduğunu söyleyen müvekkili suçu üstlenmeye yönlendirdin (Av.K. md. 34; TBB Meslek Kuralları). Gerçeğe aykırı ikrar TCK 270 kapsamında ayrı suç olabilir."
2. **BERAAT_B — CMK 223/2-b**
   - Koşul: contra_s4_hts ∧ ded_iz_murat ∧ murat_theory ∧ alibi ∧ contra_s2 ∧ ¬illegal_presented ∧ pers ≥8 ∧ TOPLAM ≥3.600.
   - "Ceza yok · Tahliye"; başlık "TÜRK MİLLETİ ADINA" (CMK 232/1).
   - Hüküm: "Sanık Kerem Aydın'ın üzerine atılı suçu işlemediği sabit olduğundan CMK 223/2-b uyarınca BERAATİNE; başka suçtan tutuklu değilse derhal TAHLİYESİNE; CMK 141/1-e uyarınca tazminat hakkının bulunduğunun ve istemin CMK 142/2 ile 6384 sayılı Kanuna göre yapılabileceğinin bildirilmesine (CMK 231/3); karar ve dosya örneklerinin Murat Koç ve Selin Kaya hakkındaki soruşturmaya eklenmek üzere Bursa Cumhuriyet Başsavcılığına gönderilmesine; istinaf yolu açık olmak üzere."
   - Gerekçe: fiş + yeminli tanık ile mazeret; arıza kaydı, değiştirilmiş çizelge ve CMK 135/6 kayıtlarıyla teşhisin çöküşü; bot izinin Murat'ın zimmetli botuyla örtüşmesi; anahtarın hukuka aykırı aramayla elde edilmiş olması (Anayasa 38/6, CMK 206/2-a, 217/2, 230/1-b); parmak izinin 19.30'daki taşıma ile açıklanması → suçun sanık tarafından işlenmediği sabit.
3. **BERAAT_E — CMK 223/2-e**
   - Koşul: pers ≥6 ∧ (contra_s2 ∨ alibi) ∧ findings ≥2 ∧ (TOPLAM ≥3.200 ∨ (alibi ∧ contra_s2 ∧ TOPLAM ≥2.600)).
   - Hüküm: tasarımdaki metin doğru ("…işlediği sabit olmadığından CMK 223/2-e uyarınca BERAATİNE…"), tahliye, tazminat bildirimi ve istinaf eklenir.
   - Gerekçe koşullu parçalardan oluşur: teşhisin [arıza kaydı | önceki beyan] karşısında güvenilirliğini yitirmesi; [mazeretin desteklenmesi]; anahtarın tüm vardiyada bulunması [ve hukuka aykırı aramayla elde edilmesi]; parmak izinin tek başına irtibat kurmaması; kesin ve inandırıcı delil yokluğu; Anayasa 38/4, AİHS 6/2, "şüpheden sanık yararlanır".
4. **İNDİRİM** {arg_142_2d ∧ TOPLAM ≥2.000}
   - Ceza **6 yıl 3 ay**.
   - Hüküm: "TCK 142/2-h uyarınca takdiren alt sınırdan 5 YIL; gece vakti nedeniyle TCK 143 ile 7 YIL 6 AY; … TCK 62/1 ile 6 YIL 3 AY HAPİS; işverence teslim edilen anahtar 'haksız yere elde bulundurulan' nitelikte olmadığından TCK 142/2-d'nin uygulanmasına yer olmadığına; TCK 53; TCK 63; cezanın süresi nedeniyle HAGB (CMK 231/5) ve erteleme (TCK 51/1) koşulları bulunmadığına; tutukluluğun devamına; istinaf."
5. **MAHKÛMİYET** (varsayılan), ceza **7 yıl 6 ay**:
   - Varyant A {¬arg_142_2d}: "142/2-d ve h birlikte, zararın ağırlığı gözetilerek alt sınırdan uzaklaşılarak 6 YIL; TCK 143 ile 9 YIL; TCK 62/1 ile 7 YIL 6 AY HAPİS; TCK 53; TCK 63; tutukluluğun devamına; istinaf."
   - Varyant B {arg_142_2d ∧ TOPLAM <2.000}: yalnızca 142/2-h ile aynı hesap; 142/2-d açıkça düşer.
   - ÇÖKÜŞ varyantı: A metni + çöküş notu.

**XP** = ⌊TOPLAM/10 × f⌋. f: BERAAT_B 1,2 · BERAAT_E 1,0 · İNDİRİM 0,85 · MAHKÛMİYET 0,6 · ÇÖKÜŞ 0,3 · İKRAR 0. Etik > 0 ise XP yarıya iner.

### A.7 Golden path'ler (otomatik testler; H = hub eylemi)

> **v2 değişikliği:** Bütün yollar soğuk açılış, 4 günlük soruşturma (günde 4 EP), 2. celse, 3 günlük ara (günde 3 EP) ve
> 3. celseden geçer; ayrıca tipik yol `TIPIK` (= G2) eklendi. Güncel akış, skor, XP, aksiyon ve süre Ek B.4'tedir; aşağıdaki
> liste v1 kaydıdır.
- **G1 → BERAAT_B** (Masumiyet)
  - Brifing: BR_01 A.
  - Gün 1: Arama (4 nokta, ıska yok) · İnceleme: UV×Selin, Büyüteç×Kerem, Karşılaştır×Murat · Görüşme (yumuşak): Anahtar, Hüseyin, O gece, ardından bot izini göster.
  - Gün 2: Belediye A · Hüseyin + tanık bildir · HTS: suç duyurusu + Selin.
  - Gün 3: Çıkarım (3 tarif) · Dilekçe: DNA, bilirkişi, kamera → duruşma.
  - Duruşma: L1 A · ek savunma A · L2 A · 50/1-c · L3 A · S1 bastır + vardiya · S2 bastır + ded_lamba · S3a, S3b · S4a, S4b + HTS · C_06H A · Hüseyin A · L4 A · L5 bilirkişi · L6 A · L7 A · esas savunma A · son söz A.
  - Beklenen: **TOPLAM 5.130**, delil 6/6, isabet 7/7, ikna 10, **XP 615**.
- **G2 → BERAAT_E** (Usul)
  - Gün 1: Görüşme (yumuşak, 4 konu) · Arama: lamba, kamera, 1 ıska, çöp · İnceleme: UV×Selin, Büyüteç×Kerem, İz tozu×Selin.
  - Gün 2: Belediye A · Hüseyin + bildir · Dilekçe: bilirkişi, DNA, kamera.
  - Gün 3: Çıkarım: lamba + mazeret + 1 yanlış çift.
  - Duruşma: L1–L3 A · S1 vardiya · S2 ded_lamba · S3'te anahtar (yanlış) · S4a + ded_mazeret (kısmi) · Hüseyin A · L4–L7 A · esas savunma B.
  - Beklenen: **TOPLAM 3.645**, ♥4, **XP 364**.
- **G3 → İNDİRİM** (İndirim)
  - Akış: zayıf soruşturma, Murat ziyareti, yanlış sunumlar.
  - Duruşma: L2 A (arg_142_2d) · L3 B · S2'de fiş (yanlış) · S4 kolluk (kısmi) · Hüseyin yok · L4 B · L5 bilirkişi · L6 "Kerem açıklasın" · L7 A · esas savunma C.
  - Beklenen: **TOPLAM 2.010**, ikna 4, **XP 170**.
- **G4 → MAHKÛMİYET A** (Masumiyet)
  - Akış: sert görüşme (güven 38), zayıf arama/inceleme.
  - Duruşma: L1 B · ek savunma B · L2 D · L3 B · iki yanlış sunum · L4 D · L5 D · L6 C · L7 B · desteksiz esas savunma A.
  - Beklenen: **TOPLAM 100**, ♥3, **XP 6**.
- **G5 → İKRAR** (İndirim)
  - Akış: makul soruşturma; ek savunmada D → "ısrar et"; esas savunma C.
  - Beklenen: TOPLAM 2.235 → **İKRAR**, XP 0, etik kartı gösterilir.
- **W → ÇÖKÜŞ**
  - Akış: Selin'e baskı (♥4 ile başlar) · operatördeki tanıdık · sert görüşmeler · çok ıska.
  - Duruşma: L1 C · ek savunma C · L3 C · S4a, S4b + ev_hts_illegal (♥0) → C_INT_COKUS.
  - Beklenen: TOPLAM −635 (0 gösterilir), XP 0.

### A.8 Rapor metinleri
- **Kaçırılanlar** (`report.hints`):
  - clue_iz42: "Arka kapıdan sokağa uzanan çamurlu bot izini kaçırdın; ölçekli fotoğraf numarayı veriyordu."
  - clue_uv_silinti: "Selin satırına UV tutmadın; saat sonradan değiştirilmişti."
  - clue_murat_42: "Çizelgeyi İSG zimmetiyle karşılaştırmadın; Murat'ın botu 42'ydi."
  - ev_ariza_kaydi: "14 no'lu direğin arıza kaydını avukat olarak doğrudan isteyebilirdin (Av.K. 2/3)."
  - ev_fis / huseyin_testified: "Mazeret tanığını dilekçeyle bildirmedin ya da duruşmaya getirmedin (CMK 177–179); yazılı beyan yetmez (CMK 210/1)."
  - ev_hts: "Gerçek faile giden yol: Murat hakkında suç duyurusu ve CMK 135/6 tespit talebi."
  - ev_dna / ev_kamera: "Emanetteki izmarit (CMK 78–79) ve kesik kablo bilirkişiye gönderilmeliydi."
  - fact_rizasiz_arama / fact_19_30: "Aramanın rızasız olduğunu ve parmak izinin masum açıklamasını Kerem anlatacaktı; sormadın."
  - suspect_murat: "Bot izini Kerem'e göstermedin; sakladığı bilgi açığa çıkmadı."
- **Alternatif yollar** (ulaşılamayan her sonuç için):
  - 223/2-b: "Mazeret + çöken teşhis + yasal HTS ile Selin–Murat bağlantısını birleştir; esas savunmada gerçek faili göster."
  - 223/2-e: "S2'yi çürüt ya da mazereti duruşmada ispatla; anahtarın hukuka aykırı aramayla elde edildiğini ileri sür."
  - İNDİRİM: "Ek savunmada 142/2-d'nin unsurlarının oluşmadığını savun."
  - İKRAR: "Terditli savunma (önce beraat, aksi halde lehe hükümler) meşru yoldur; sahte ikrar asla."
  - ÇÖKÜŞ: "Dayanaksız itiraz ve yanlış delil güvenilirliği eritir; hukuka aykırı delil iki kalp götürür."
- **Beceri tavsiyeleri** (kazanılan ÷ maksimum: <%40 zayıf, %40–75 orta, >%75 güçlü):
  - HB: "142/2-d ve h, 143 ve 62 hesabını tekrar et." / güçlüyse: "Vasıf ve ceza hesabında isabetlisin."
  - DA: "Her delilin neyi çürüttüğünü sor; ipuçlarını tahtada birleştir."
  - AR: "Fotoğrafları ve resmî kayıtları sistematik tara."
  - SO: "Önce bastır, sonra sun; S3 ve S4 baskıyla açılır."
  - SS: "Stratejinle uyumlu, delille desteklenen bir esas savunma kur."
  - UB: "Arama yetkisi (CMK 116–119; 5188 md. 7 ve 9), delil yasakları (Anayasa 38/6; CMK 206/2-a, 217/2) ve soru itirazı (CMK 201)."

### A.9 Hukuki inceleme listesi ve tasarım düzeltmeleri
**İnceleme gerektirenler** (önem sırasıyla):
1. Görev süresi dışındaki özel güvenlik görevlisinin rızaya aykırı el aramasında delil yasağının uygulanması (5188 md. 7/a + 9/1).
2. Tanık HTS'sinin CMK 135/6 dışında kalması; Murat'ın şüpheli olduğu ayrı soruşturmadaki HTS'nin bu davada kullanılabilmesi.
3. İşverenin verdiği anahtarın 142/2-d dışında kalması (Yargıtay uygulaması); iki bentle temel cezanın alt sınırdan uzaklaşması.
4. Görevli mahkeme (5235 md. 12; 143 dahil) ve heyetin 3 hâkimden oluşması (tasarımda 1 üye var).
5. 2. celsede 142/2-d için ek savunma (CMK 226/1, 226/3).
6. Sanığın kendi sahte ikrarında TCK 270; avukatın azmettirici olarak sorumluluğu (TCK 38); ikrarın mazeretle çeliştiği durumda mahkûmiyetin gerçekçiliği.
7. Savunmanın talebiyle TCK 274/2 hatırlatması (CMK 48 ile birlikte).
8. İlgili soruşturmada şüpheli hâline gelmiş tanığın CMK 50/1-c ile yeminsiz dinlenmesi.
9. Teşhis usulü: mevzuatta düzenlenmemiş; telkinli yüzleştirme CMK 217 ve içtihat çerçevesinde değerlendirilir.
10. Düşük riskli noktalar:
    - CMK 153/4 ile emanete erişim ve kâtip önünde UV kullanımı;
    - 5275 md. 59/2 (görüş saatleri);
    - "telkin edici soru" itirazı (CMK 201/1);
    - 4982 md. 11'deki 15 iş günü süresi;
    - 2026 tarihli 7589 sayılı Kanun'un CMK 231 metnine etkisi (ceza 2 yılın üstünde olduğu için bu davayı etkilemez).

**Tasarımdaki hukuki rakam/metin düzeltmeleri** (UI aynı kalır, yalnızca veri değişir):

| # | Tasarımda | Sorun | Düzeltme |
|---|---|---|---|
| 1 | Davalar: "TCK 142 · 3–7 yıl" | 3–7 yıl ya bugünkü 142/1'in ya da 2014 öncesi 142/2'nin aralığı | "TCK 142/2-h, 143 · 7,5–15 yıl" |
| 2 | Dosya: "Savcılık talebi 5 yıl" | 143'ten sonraki alt sınırın altında; iddianame süre değil madde belirtir | "İddianame: 142/2-h, 143 (7 yıl 6 ay–15 yıl)" |
| 3 | Ceza aralığı: "TALEP: 5 YIL", "Beraat / İndirim / HAGB / 3 yıl / 7 yıl" | HAGB ve erteleme ≤2 yıl ceza (CMK 231/5, TCK 51/1) ve tam tazmin (231/6-c) ister | "İSTEM: 142/2-h + 143"; etiketler "Beraat · TCK 62: 6y3a · 7,5 yıl · 15 yıl" |
| 4 | İpucu: "etkin pişmanlık ve takdiri indirim" | TCK 168 failin tam tazminini ister; masum müvekkil için bu sahte ikrar demek | "Terditli: önce beraat; aksi halde 142/2-d'nin düşmesi, alt sınır, TCK 62" |
| 5 | Karar İNDİRİM: "142/1 + 62 = 2 yıl 6 ay" | 142/1 bu olaya uymuyor ve 143 unutulmuş | "142/2-h 5 yıl → 143: 7 yıl 6 ay → 62: 6 yıl 3 ay" |
| 6 | Karar MAHKÛMİYET: "142/1, 5 yıl" | Yanlış madde ve aralık; istinaf süresi yok | "142/2-d,h 6 yıl → 9 yıl → 62: 7 yıl 6 ay"; istinaf: tebliğden itibaren iki hafta (CMK 273/1) |
| 7 | Karar BERAAT: "223/2-e" | Şüphe sonucu için doğru | 223/2-b varyantı eklenir; tahliye, tazminat bildirimi (CMK 141/1-e, 142/2–6384, 231/3) ve "TÜRK MİLLETİ ADINA" |
| 8 | "Talep: 5 yıl › …" | 2. maddeyle aynı sorun | "İstem: 7,5–15 yıl › …" |
| 9 | HTS kaynağı: "Operatör kaydı" | Operatör kayıtları yalnızca hâkim kararıyla verir | "Başsavcılık soruşturması, CMK 135/6 hâkim kararı · Murat↔Selin 23.05, 6 dk" |
| 10 | Kamera: "22.40–23.30 kayıt dışı, kablo kesik" | Kesik kabloyla kayıt yeniden başlayamaz | "23.30'da bantla eklenmiş" eklenir |
| 11 | Görüşme: "14 dk", süreyi gardiyan tutuyor | Avukat–müvekkil görüşmesi süresiz ve gizli (CMK 149/3, 154/1) | "Görüş salonunun kapanışına 14 dk" (5275 md. 59/2); gardiyan görür ama duymaz |
| 12 | "Depo Sokağı 23.00": aylar sonra taze izmarit ve çamur izi | Sonraki bir keşifte gerçekçi değil | 13 Mart fotoğraf albümü; izmarit emanetten |
| 13 | İz tozu, el konulmuş delil üzerinde | Avukat inceleyebilir, delile müdahale edemez | Ceza + bilirkişi geri bildirimi |
| 14 | "Gece bekçisi" | Bekçi kamu görevlisidir (7245), yetkileri farklı | Başlık kalır; hukuki metinlerde "özel güvenlik görevlisi (5188)" |
| 15 | İTİRAZ! / "Sayın Hâkim" | Türk usulünde belirli dayanaklar var | İTİRAZ!, CMK 201/1, 192/2, 215, 216/2'ye bağlanır; heyete "Sayın Başkan" |
| 16 | Turuncu mont "eşleşiyor" | Yanıltıcı | Şirketin iş üniforması olduğu açıklanır |
| 17 | ×1,5 tüm skora | Beyan edilen strateji hükmü değiştirirdi | Yalnızca stratejiyle uyumlu esas savunmanın SS puanına |

Ana menüdeki "Müvekkilim masum, Sayın Hâkim!" balonu davadan bağımsız bir tasarım öğesi olduğu için korunur.

---

## Ek B — v2: hikâye ve oyun yüzeyi (2026-10-20)
Kaynak: hikâye kitabı `docs/content/gece-bekcisinin-sirri-hikaye.md` ve kullanıcı geri bildirimi ("hikâye yok", "çok kısa").
Hukuki gerçek, deliller ve sonuç mantığı değişmedi; eşikler yeniden ölçeklendi (B.3). Ayrıntılı rapor:
`docs/content/dava-07-v2-report.md`.

### B.1 Yapı
| Bölüm | Node'lar | Not |
|---|---|---|
| Soğuk açılış | PR_00, PR_01 | İsimsiz sesler (BİR SES / İKİNCİ SES); sabah avlusu, tutanak, karakol |
| Bölüm 1 · Dosya | BR_00, BR_01, BR_01B, BR_02 | Saniye büroda (zarf seçimi), ceza aralığı sorusu, altı kâğıt, strateji |
| Bölüm 2 · Soruşturma | INV_SABAH, INV_HUB + 4 gün × 4 EP | 4 sahne araması, 4 belge, 7 tarifli tahta, fakta bağlı konular, akşamlar, duruşmadan önceki gece |
| Bölüm 3 · Birinci celse (2. celse) | C_00G…C_06H, C_02Q, C_06R, C_ARA | Koridor seçimi, sanığa sorular, Selin'in beş ifadesi, kısa ara, erteleme ve tutukluluk |
| Bölüm 4 · Ara | ARA_GIRIS, ARA_HUB + 3 gün × 3 EP | Selin, Yusuf, Hüseyin, Kerem, Saniye, ekip şefi, kart kayıtları, liman, ikinci tahta |
| Bölüm 5 · İkinci celse (3. celse) | C_07A…C_14 | Hüseyin + savcının karşı sorusu, Kom. Yusuf'un tanıklığı, dayanaklar, esas savunma, son söz |
| Karar | R_KARAR + sonuç başına `epilogue` | Epiloglar sonuca bağlı (OutcomeDef.epilogue) |

### B.2 Yeni mekanikler ve puanlar
| Mekanik | Node | Doğru / yanlış | Puan |
|---|---|---|---|
| Depo 3 içi araması | INV_ARAMA2 | sürgü +60, bant +40, dolap +40, takvim +60 · forklift/levha −10 | ARAŞTIRMA |
| Çay ocağı araması | INV_ARAMA3 | kasa +40, pencere +60, fikstür +40, sandalye 0 · kül/radyo −10 | ARAŞTIRMA |
| Kulübe fotoğrafları | INV_ARAMA4 | monitör +60, olay defteri +40, ilaç 0 · fincan/pano −10 | ARAŞTIRMA |
| DVR günlüğü | INV_DVR | onaysız uyarı +100, “SK” +150, kesik +50 · toz −20, ıska −20 | DELİL ANALİZİ |
| Kasa rulosu | INV_RULO | sıra +100, “D3” +150, 0412 +50 · toz −20, ıska −20 | DELİL ANALİZİ |
| Belediye arıza kaydı | INV_ARIZA | erteleme +150, süre +50 · ıska −20 | DELİL ANALİZİ |
| Kart okuyucu (ara) | ARA_KART | Murat 00.12 +150, Selin 23.29 +100, Kerem +50 · ıska −20 | DELİL ANALİZİ |
| Tahta (2 evre) | INV_CIKARIM, ARA_CIKARIM | 7 + 4 tarif (ded_plan, ded_kulube, ded_depo3, ded_karanlik, ded_arama) +300 · yanlış çift −50 | DELİL ANALİZİ |
| Fakta bağlı konular | INV_GORUSME | TP_ZIYA, TP_ISIK, TP_SELIN, TP_ANNE, TP_DEFTER (2 dk, +20) | SORGULAMA |
| Tanık soruları | INV_T_HUS, INV_T_SEL, INV_T_MUR, ARA_* | +10…+40; telkinli soru −30 | SORGULAMA |
| Leyla'ya danış | INV_LEYLA, ARA_LEYLA | günde bir, 0 EP, puansız | — |
| Duruşmadan önceki gece | INV_GECE | tehdidi bildir +20 | USUL |
| Sanığa sorular | C_02Q | bilgi veren soru +25 · tahmine zorlayan −25 | SAVUNMA |
| Selin S5 | C_06 | ded_kulube +200, ikna +1 | SORGULAMA |
| Tutukluluk | C_ARA | dayanak varsa tahliye +50 · “hemen beraat” −25 | USUL |
| Ara etik seçimleri | ARA_SELIN, ARA_LIMAN | avukat göster +30 / kayda geçir −30 / korkut −50 · savcılığa bildir +50 / kendin git −25 | USUL / SAVUNMA |
| Savcının karşı sorusu | C_07X | rulo sırasıyla itiraz +75, ikna +1 · suçlama −50, ♥−1 | USUL |
| Kom. Yusuf'un tanıklığı | C_08T | 5 ifade; doğru sunum +200, ikna +1; yanlış ♥−1, −150 | SORGULAMA |
| Esas savunma dayanakları | C_12P | en çok 3; ispatlanmış +40 / ispatlanmamış −40 | SAVUNMA |

### B.3 Sonuç değişiklikleri (A.6)
- Eşikler: İNDİRİM `final ≥ 3.000`; BERAAT_E `final ≥ 7.000 ∨ (alibi ∧ contra_s2 ∧ final ≥ 5.500)`; BERAAT_B `final ≥ 8.000`
  (diğer koşullar aynı). Eşik çubuğu 0 / 3.000 / 7.000; `scaleMax` 10.000. Gerekçe: oyun yüzeyi yaklaşık iki katına çıktı;
  tipik yol 8.845 ile beraat bandının ~%26 üstünde, indirim yolu 3.340 ile indirim bandında.
- XP formülü aynı (⌊final/10 × f⌋); uzun dava daha çok XP verir.
- Mahkûmiyet hükümleri: tutukluluk ifadesi tahliye olasılığını kapsar (docs/legal/dava-07.md, v2 #2).
- Her sonuç `epilogue` taşır; karar ekranında koşulu tutan bütün bloklar sırayla oynar (murat_caught, kerem_released,
  hus_gelir, koridor seçimine göre değişir).
- `mutalaa_beraat` aynı; `murat_caught` mütalaada ikna +1 verir. `dayanak_murat` ayrıca fact_cay_selin ∨ ded_depo3 ile tutar.

### B.4 Golden path'ler (v2)
| Yol | Sonuç | Final | XP | Aksiyon | Süre (case:duration) |
|---|---|---|---|---|---|
| G1 (Masumiyet) | BERAAT_B | 9.620 | 1.154 | 145 | 83,8 dk |
| G2 = TIPIK (Usul) | BERAAT_E | 8.845 | 884 | 204 | 97,3 dk |
| G3 (İndirim) | İNDİRİM | 3.340 | 283 | 119 | 67,7 dk |
| G4 (Masumiyet) | MAHKÛMİYET | −125 | 0 | 118 | 60,5 dk |
| G5 (İndirim) | İKRAR | 4.670 | 0 | 121 | 70,9 dk |
| W | MAHKÛMİYET (çöküş, 3. celsede) | −445 | 0 | 104 | 60,7 dk |

Pencereler ölçülen finalin ±%5'i (`tests.goldenPaths[].expect`).


## Ek C — v3: inceleme düzeltmeleri (2026-10-20)

Kaynak: devil's-advocate incelemesi (kısa yoldan beraat, soğuk açılış sızıntıları, seçenek biçimi, İKRAR ve MAHKÛMİYET gerekçeleri, etik
sayımı, kullanılmayan deliller, uzunluk). Hukuki kararlar: `docs/legal/dava-07.md` "v3 — iç inceleme kararları".

### C.1 Yapı ve kapılar
| Değişiklik | Node / seçenek | Gerekçe |
|---|---|---|
| 2. celseye ancak soruşturmanın 4. günü | INV_HUB · H_DURUSMA `enabledWhen day ≥ 4 ∧ visited INV_LEYLA` (v3.1; kilit gerekçesiyle) | 3. günde, EP'ler dururken mahkemeye gidip soruşturmanın yarısını atlamak mümkündü. |
| 3. celseye ancak aranın 3. günü | ARA_HUB · H2_CELSE `enabledWhen ara_day ≥ 3 ∧ visited ARA_KART ∧ visited ARA_LEYLA` (v3.1) | Ara evresi sıfır eylemle atlanabiliyordu. |
| Yeni ara etkinliği (1 EP) | H2_TUTANAK → ARA_TUTANAK_1…4 (DECISION zinciri) → ARA_TUTANAK | 6 koşulsuz etkinlik olsun diye (gün 1–2'de 6 EP harcanmalı; kilitlenme yok). Tutanak sahneleri contra_s2, selin_cozuldu / contra_s1–s5, kerem_released'e göre değişir. |
| Soğuk açılışın sabahı bölündü | PR_01 (avlu) → PR01_DEVAM (çanta) / PR01_KAGIT / PR01_KALABALIK → BR_00; karakol ve Saniye seçimin cevap satırları (v3.1) | 400 sözcük okuma sınırı; seçim `pr_bakis`'e yazılır, INV_SABAH'ta geri döner. |
| Kerem görüşmesinde fotoğraf seçimi | INV_GORUSME · G_IZ (doğru) + G_IZMARIT, G_KABLO (−20/−30, güven −3/−2, 3 dk) | Tek, önceden seçilmiş "ipucu göster" bedava +200 idi. |

### C.2 Gizem ve spoiler düzeltmeleri
- PR_00 telefonu: cinsiyet, meslek, monitör ve defter yok; "Bitti mi? / Bitti. / Ya biri sorarsa? / Kimse sormaz." (hikâye kitabı PR_00).
- PR_01: önce Murat suçlar, sonra Selin çantayı açar; "parmakları bir an fazla uzun kaldı" çıkarıldı.
- BR_01B ve `ev_selin_kolluk`: ifadenin "Sabah Murat 'Kerem'di' deyince…" kısmı yok; bu bilgi S4 bastırmasıyla kürsüde kazanılır.
- INV_T_MUR: "o turuncu noktayı hatırlıyorum" düşüncesi ve giriş geri bildirimindeki "olası fail" ifadesi çıkarıldı; INV_HTS istemi tarafsız.
- Yeni yüklem `murat_iz` = dayanak_murat ∨ contra_s4_hts ∨ selin_cozuldu. ARA_HUB gün 1 hedefi, ARA_GIRIS, ARA_GIRIS_2 (merdivende bekleyen
  adam), ARA_AKSAM (iplerin Depo 3'e gitmesi) ve MAHKÛMİYET epilogundaki Murat satırı bu yükleme bağlı; aksi hâlde tarafsız sürüm oynar.

### C.3 Sonuç koşulları ve puan
| Sonuç | v2 | v3 |
|---|---|---|
| BERAAT_B | contra_s4_hts ∧ ded_iz_murat ∧ murat_theory ∧ alibi ∧ contra_s2 ∧ ¬illegal ∧ pers ≥ 8 ∧ final ≥ 8.000 | + (murat_caught ∨ clue_kart_murat ∨ ded_nisan); final ≥ **8.500** |
| BERAAT_E | pers ≥ 6 ∧ (contra_s2 ∨ alibi) ∧ findings2 ∧ (final ≥ 7.000 ∨ (alibi ∧ contra_s2 ∧ final ≥ 5.500)) | + (ded_arama ∨ clue_kart_murat); v3.1: + (clue_kart_murat ∨ clue_kart_selin) ∧ INSIGHT ≥ 6 ∧ `yusuf2` (komiserin beyanında ≥ 2 çelişki); eşikler **7.500** / **7.000** |
| İNDİRİM, MAHKÛMİYET, İKRAR | — | Koşullar aynı; gerekçeler yeniden yazıldı (delil değerlendirmesi; İKRAR'da mazeretin neden itibar görmediği). |

Diğer mekanik değişiklikler:
- v3.1 rapor ipuçları: h_yusuf (komiser sınanmadı), h_tahta (çıkarım tahtası 6'nın altında).
- C08_A anahtarı yalnızca ded_arama varken dışlatır (+100/150, key_excluded, ikna +1, isabet); yoksa +50 ve "dayanağını gösteremediniz".
- C_08T · PS_Y2 artık clue_kart_murat ile de çürür (Y2 vurgusu da yanar).
- C07X_A: rulo sırası (clue_rulo_sira) tam cevap (+75, ikna +1); yalnızca kasa saati (clue_kasa_saat) orta cevap (+50); hiçbiri +25.
- Yeni tarifler: CB_IZ2 / CB2_IZ2 (clue_iz42 + ev_isg_zimmet), CB_IZ3 / CB2_IZ3 (clue_iz42 + clue_yeni_bot) → ded_iz_murat;
  CB2_NISAN (clue_yuzuk + ev_hts) → **ded_nisan** (+300). ded_nisan, C12_A başarılıysa +100 ve bir savunma cümlesi ekler.
- PS_S2_MON: clue_monitor S2'ye kısmi sunum (+100, çelişki yok). ev_kerem_kolluk savcılık delili olarak PS_SAVCILIK'e eklendi.
- Etik: C06H_B, ASEL_B, ASEL_C, ALIM_KENDIN, AKER_EZBER `ethics +1` ve atıflı kötü işaret; ASEL_B liman ipucu ve yüzük vermez.
- Seçenek biçimi: tek doğru cevaplı 21 seçenek setinin hiçbirinde doğru seçenek en uzun ya da tek atıflı etiket değil (önceden 16/21 ve 3/21).
  Atıflar Deniz'in duruşmadaki cümlesine ve geri bildirime taşındı; çeldiricilere makul atıflar verildi.
- BR_01 artık kartın cevaplamadığı TCK 143 artırımını sorar (4 seçenek); kart aralığı "5–15 yıl (TCK 143 ile)".
- Küçük: üçüncü hâkim Orhan Tekin; Tuncay'a `ekip_sefi` sprite'ı (10-cast `sprites`, gardiyan paletinden: baret, turuncu yelek); INV_SABAH lamba
  sürekliliği; Leyla'nın 4. gün cümlesi; koğuştaki adamın ara Kerem görüşmesinde kapanması.

### C.4 Golden path'ler ve ölçümler (v3.1)
`npm run case:duration -- gece-bekcisinin-sirri` (sözcük = satır + ekran metinleri) ve `node tools/content/word-count.mjs content/cases/gece-bekcisinin-sirri` (yalnızca satırlar):

| Yol | Sonuç | Final | Aksiyon | Satır sözcüğü | Süre sözcüğü | Süre |
|---|---|---|---|---|---|---|
| G1 (Masumiyet) | BERAAT_B | 9.770 | 152 | 11.687 | 13.585 | 90,7 dk |
| G2 = TIPIK (Usul) | BERAAT_E | 8.845 | 204 | 13.263 | 15.294 | 105,4 dk |
| G3 (İndirim) | İNDİRİM | 3.310 | 123 | 9.518 | 11.072 | 73,8 dk |
| G4 (Masumiyet) | MAHKÛMİYET | −125 | 121 | 8.643 | 9.891 | 67,1 dk |
| G5 (İndirim) | İKRAR | 4.620 | 124 | 10.124 | 11.792 | 77,9 dk |
| W | MAHKÛMİYET (çöküş) | −445 | 104 | 8.675 | 9.832 | 65,0 dk |

Paket: 1.893 satır, 24.210 satır sözcüğü; ekran metinleriyle 28.517. En uzun satır 214 karakter.

**Kısa yol sondası** (golden path'ten başlayıp motorla yeniden oynayan, reddedilen eylemi atlayan delta küçültücü, ileri ve geri
tarama; hedef beraat). Tipik yol 204 aksiyon:

| Başlangıç → hedef | v2 | v3.1 | v3.1 süre |
|---|---|---|---|
| G2 / TIPIK → BERAAT_E/B | 92 aksiyon (%45), BERAAT_E 5.500, 59,2 dk | **138** aksiyon (%68), BERAAT_E 7.505 | 84,9 dk |
| G1 → BERAAT_B | 109 (%53) | **134** (%66), 8.515 | 84,6 dk |
| G1 → BERAAT_E/B | — | **125** (%61), BERAAT_E 7.505 | 82,2 dk |

En kısa beraat bile 4 günlük soruşturmayı ve bir Leyla danışmasını, aranın üç gününü (kart kayıtları, Leyla, komiser görüşmesi, tahtada
en az 6 çıkarım ve ded_arama ya da kart kaydı dahil) ve iki celsede komiserin beyanında en az iki çelişkiyi ister.

**Kapılar (2026-10-21):** `npm run build` ✓; `case:validate` PASSED (116/116 node, 229/229 seçenek, 76/76 kural, 50/50 delil, 7/7 golden
path; kaçak, kilitlenme, çıkmaz yok; `--max-ms 3000000`, 122 sn); `npm run lint` ✓. Vitest: `dava07-golden › validator passes Dava #07`
testin içine sabitlenmiş 120 sn sınırına yük altında takılıyor (aynı 8.000/200 bütçe tek başına 96 sn'de PASSED, tam kapsamla);
`extract-sprites` testi bu dalda başka davaların paylaşılan sprite'ları yüzünden kırmızı (dava dışı; ana dalda düzeltilmiş).

## Ek D — v3.2: ikinci inceleme düzeltmeleri (2026-10-21)

Kaynak: ikinci devil's-advocate incelemesi (seçenek konumu, ara evresinde Murat sızıntısı, tahta sayımına bağlı hüküm, Murat'ın erken işaretlenmesi,
küçük hukuki ve sahne düzeltmeleri). Hukuki kararlar: `docs/legal/dava-07.md` madde 10–16.

### D.1 Sonuç koşulları (hüküm kayda dayanır)
| Sonuç | v3.1 | v3.2 |
|---|---|---|
| BERAAT_E | … ∧ INSIGHT ≥ 6 ∧ findings2 ∧ yusuf2 ∧ (final ≥ 7.500 ∨ (alibi ∧ contra_s2 ∧ final ≥ 7.000)) | ¬cokus ∧ ( [pers ≥ 6 ∧ (contra_s2 ∨ alibi) ∧ (ded_arama ∨ clue_kart_murat) ∧ (clue_kart_murat ∨ clue_kart_selin) ∧ yusuf2 ∧ **kayit3** ∧ (final ≥ 7.500 ∨ (alibi ∧ contra_s2 ∧ final ≥ 7.000))] ∨ [**kayit_guclu** ∧ final ≥ **6.500**] ) |
| İNDİRİM, MAHKÛMİYET | gerekçe teşhis + iz (+ anahtar) | Gerekçe tanığın dönüşünü, teşhis çelişkisini, mazereti (fişle eşleşen / eşleşmeyen / hiç dinlenmeyen), izi ve anahtarı ayrı ayrı tartışır. |

- `kayit3` (60-trial yüklemi): contra_s1, contra_s2, S4 çelişkisi (kolluk/mazeret/HTS), alibi, key_excluded, fp_neutralized'den en az üçü.
- `kayit_guclu`: selin_cozuldu ∨ (contra_s2 ∧ key_excluded ∧ pers ≥ 8 ∧ (huseyin_testified ∨ fp_neutralized)).
- Tahta sayımı hiçbir sonuçta yok. Rapor ipucu h_tahta yerine **h_kayit** (¬kayit3): "Heyet dosyada ne bildiğine değil, önünde neyi ispatladığına bakar."
- İnceleme sondası (TIPIK'ten iki birleşim düşür): v3.1'de 45 düşürmenin 15'i İNDİRİM idi (contra_s2 ∧ key_excluded ∧ yeminli mazeret ∧ ikna 10
  iken bile). v3.2'de 45'in 42'si BERAAT_E; kalan 3'ünde contra_s2 yok (teşhis çürütülmemiş), mahkûmiyet gerekçesi mazereti ve dışlanan anahtarı tartışır.
- **Tanığın dönüşü:** PS_S4_HTS yalnızca contra_s1 ∨ contra_s2 tutarken C_06H'ye (TCK 274 hatırlatması → selin_cozuldu) gider. Aksi hâlde
  PS_S4_HTS0: +150, ikna +1, contra_s4_hts, NEUTRAL; Selin CMK 48 çekinme hakkını kullanır, teşhisini korur. Sonradan S1/S2 çürütülüp HTS yeniden
  gösterilirse dönüş gerçekleşir (+150; toplam yine +300). G1 bu sırayı oynar (kural kapsamı 78/78).

### D.2 Seçenek konumu
Tek en iyi seçenekli 23 setin (koşullu seçenekler dahil) 4'ünde (%17) doğru seçenek ilk sırada; önceden 12/15 (koşulsuz ≥ 3 seçenekli
setler). Doğru seçenek 0–3 arasında dağılır (BR_01:2, INV_BEL:1, G_IZ:1, C_01:2, C_03:1, C_05:2, C_ARA:2, ARA_SELIN:2, ARA_LIMAN:1, C_07X:2,
C_08:3, C_09:2, C_10:1, C_12:2 …; ilk sırada kalanlar INV_GECE, C_06H, ARA_HUS, C_13). Golden path'ler choiceId kullanır, değişmedi.

### D.3 Gizem ve spoiler
- PR_01: suçlayan `narrator` "KALABALIKTAN BİR SES" (sesi tarif edilmez); S4 bastırması onun Murat olduğunu açıklar. Selin sundurmadaki
  çantaları yoklar, "Kimin bu?" diye sorar. Karakol satırı "adam lazım dediler"; `ev_kerem_kolluk` "Dün Depo 3'e girdim." (cümlenin devamı yok).
- TP_GECE (ilk serbest konu): "bu hafta hallederim" telefonu ve sigara ikramı TP_ZIYA'ya (clue_takvim ile açılır) taşındı; yerine kırmızı ringa.
- **Kırmızı ringa Cengiz Akın** (Depo 2): PR01_KALABALIK'ta sırıtıp sigarasını ezer; TP_GECE'de maaş kesintisi, açık tehdit, o gece vardiyada,
  tiryaki. ARA_KART'a altıncı satır (Giriş 15.47 · Çıkış 22.06) ve EX_KART_CENGIZ (+50, aklanır).
- INV_AKSAM3: koğuştaki adam "depodakileri" sorar. C02_C etiketi "Aklındaki şüpheyi söylesin".
- ARA_KEREM: AKQ_MURAT üç cevap bloğu (selin_cozuldu / murat_iz / nötr); AKER_OFKE murat_iz ile, aksi hâlde AKER_OFKE0 "“Kime kızgınsan,
  orada söyle.”" (−20, güven −2). ARA_KEREM_2'de "Murat abi beni arıyor mu?" murat_iz bloğunda; nötr blokta anne sorusu.
- ARA_HUS: kırık cam için kesin hüküm yerine şüphe. ARA_EKIP: AEKIP_SUCLA murat_iz ile; AEKIP_SUCLA0 "“Depodan biri miydi, söyleyin.”"; ikisi de
  etik +1, BAD (Av.K. 34; TBB Meslek Kuralları).
- G4 ve W ARA metninde Murat yalnızca sorunun etiketinde ve olaydan önce yazılmış defter satırında geçer.

### D.4 Küçük düzeltmeler
- Üçüncü hâkim Orhan Tekin cast'ta (satır içi `orhan_hakim` sprite'ı: savcının başı + hâkim cübbesi); 16 kürsü dört kişilik
  (Ayşe 0,16 · Nevzat 0,38 · Orhan 0,60 · Cem 0,84).
- INV_DIL: "Duruşmadan önce mahkemeye ulaşırsa celbedilir." (beş gün kuralı kaldırıldı).
- `possibleSentence`: "5–10 yıl + TCK 143 artırımı".

### D.5 Golden path'ler ve ölçümler (v3.2)
| Yol | Sonuç | Final | Aksiyon | Satır sözcüğü | Süre sözcüğü | Süre |
|---|---|---|---|---|---|---|
| G1 (Masumiyet) | BERAAT_B | 9.770 | 153 | 11.805 | 13.709 | 91,5 dk |
| G2 = TIPIK (Usul) | BERAAT_E | 8.845 | 204 | 13.331 | 15.368 | 105,8 dk |
| G3 (İndirim) | İNDİRİM | 3.320 | 123 | 9.596 | 11.207 | 74,6 dk |
| G4 (Masumiyet) | MAHKÛMİYET | −145 | 121 | 8.689 | 9.943 | 67,3 dk |
| G5 (İndirim) | İKRAR | 4.620 | 124 | 10.190 | 11.864 | 78,3 dk |
| W | MAHKÛMİYET (çöküş) | −465 | 104 | 8.698 | 9.861 | 65,2 dk |

Paket: 1.926 satır, 24.659 satır sözcüğü; ekran metinleriyle 29.269. En uzun satır 214 karakter.

**Kısa yol sondası** (motorla yeniden oynayan, reddedilen eylemi atlayan delta küçültücü + çift silme küçültücüsü; tek süreç, sınırlı süre).
Tipik yol 204 aksiyon:

| Başlangıç → hedef | v3.1 | v3.2 | v3.2 süre |
|---|---|---|---|
| G1 → BERAAT_E/B | 125–126 (%61), BERAAT_E 7.505 | **125** (%61,3), BERAAT_E 6.510 (kayit_guclu: tanık döndü), 2-minimal (7.750 çift) | 81,3 dk |
| G1 → BERAAT_B | 134 | **137** (%67), 8.510 | 85,5 dk |
| TIPIK → BERAAT_E/B | 138 | **143** (%70), 6.500 | 87,5 dk |
| Melez tohumlar (U2, U3) | — | 139 / 138 | ~85 dk |

Tasarım notu: `kayit_guclu` puan eşiksiz olsaydı en kısa beraat 103 aksiyon (%50) olurdu: oyunun iskeleti (4 gün × EP, iki celse, ara evresi)
yaklaşık 95 aksiyondur ve tanığı döndüren zincir (bot izi → Murat, suç duyurusu → CMK 135/6, bir çelişki, HTS, TCK 274) o iskeletin içinde
kazanılabiliyor. 6.500 eşiği kısa yol çubuğunu (≥ %60) korur; eşiğin altındaki güçlü kayıtlı oyunlarda gerekçe her unsuru tartışır (hukuki not 11–12).

**Kapılar (2026-10-21):** `npm run build` ✓; `case:validate --max-ms 3000000` PASSED (116/116 node, 231/231 seçenek, 78/78 kural, 50/50 delil,
7/7 golden path; kaçak, kilitlenme yok; yalnızca bütçe kaynaklı SIMULATION_INCOMPLETE uyarısı, 101 sn); `case:duration` ✓ (tipik 105,8 dk; diğer
yollar 65,2–91,5 dk); `npm run lint` ✓; vitest (content-tools, case-schema, engine, validator; `--maxWorkers=2`) 1.884/1.885 — tek kırmızı
`extract-sprites › committed sprite files match the design`: `content/shared/sprites`'ta başka davaların 15 dosyası var (kirik-kadeh-*,
sahte-imza-*, son-mesaj-*); bu dava paylaşılan sprite eklemedi (`git diff c42b102 -- content/shared/sprites` boş). Ana dalda da 36 dosya var;
düzeltme o davaların işidir.

## Ek E — v3.3: hüküm kayda dayanır, zincir soruşturmayı ister (2026-10-21)

Kaynak: üçüncü inceleme. v3.2'de `kayit_guclu` (tanık döndü ya da teşhis çürüdü + anahtar dışlandı) BERAAT_E'ye ancak final ≥ 6.500 ile
götürüyordu; eşik kaldırılınca en kısa beraat 103 aksiyona iniyordu. v3.3 iki talebi birlikte karşılar: **sonuç koşullarında skor ya da ikna
sayacı yok**, ve kısa yol eşikle değil delil zincirinin kendisiyle kapanır. Hukuki dayanak: `docs/legal/dava-07.md` madde 17–24.

### E.1 Sonuç koşulları (yalnızca tutanak)
| Sonuç | v3.3 koşulu |
|---|---|
| İKRAR | false_confession (değişmedi) |
| BERAAT_B | ¬illegal_presented ∧ selin_cozuldu ∧ `teshis_coktu` ∧ `iz_aciklandi` ∧ alibi ∧ contra_y2 ∧ ded_iz_murat ∧ murat_theory |
| BERAAT_E | `teshis_coktu` ∧ `iz_aciklandi` |
| İNDİRİM | arg_142_2d (C03_A ancak fact_anahtar_ortak ile kabul edilir) |
| MAHKÛMİYET | varsayılan |

- `teshis_isik` = contra_s2 (1. celse) ∧ contra_y4 (2. celse). `teshis_yer` = contra_s1 ∧ contra_s5 (1. celse) ∧ contra_y6 (2. celse).
- `teshis_coktu` = selin_cozuldu ∨ (`teshis_isik` ∧ `teshis_yer`). `iz_aciklandi` = fp_neutralized. `tanik_kirilir` = `teshis_isik` ∧ `teshis_yer` ∧ `iz_aciklandi`.
- Çöküş artık sonuç koşulu değil; duruşmayı keser, hüküm o anki kayda göre kurulur. Eşik çubuğu tek bant (“Skor”), scaleMax 11.000.
- Kaldırılan yüklemler: `kayit3`, `kayit_guclu`, `yusuf2`. Rapor ipuçları h_yusuf/h_kayit yerine h_isik, h_yer, h_iz.
- Gerekçeler kaydı izler: İNDİRİM/MAHKÛMİYET'te ışık ayaktaysa 16 numaralı direk ve komiser, yer ayaktaysa tur kaydı, iz açıklanmadıysa
  içeriden açılmış kapının sürgüsü ayrı ayrı tartışılır. Dönmüş tanığa rağmen mahkûmiyet yolu yoktur (dönüş `tanik_kirilir` ister).

### E.2 Zincir (her bulgu bir öncekine bağlı)
| Halka | Önkoşul | Nerede |
|---|---|---|
| Belediye başvurusu (H_BEL, DIL_BEL) | clue_ampul (olay yeri fotoğrafı) | Soruşturma |
| clue_ariza_9 / clue_ariza_onarim | arıza kaydı (ertesi gün gelir); a14a büyüteç, a14c karşılaştır | INV_ARIZA |
| ded_lamba | iki arıza satırı (eskiden ampul + ham kayıt) | Tahta |
| contra_s2 | BASTIR S2, sonra ded_lamba. Ham kayıt/kolluk ifadesi yalnızca kısmi. Savcı 16'yı gösterir → direk16_itiraz | 1. celse |
| AEKIP_16 → ev_direk_plani | clue_erteleme (ekip şefi görünür) ∧ ara günü ≥ 2 ∧ direk16_itiraz; plan ertesi gün gelir | Ara |
| clue_direk_plan | ARA_PLAN: önce 14 (büyüteç), sonra 16 (karşılaştır) | Ara, yeni belge |
| ded_zifiri | ded_lamba + clue_direk_plan | Ara tahtası |
| contra_y4 | BASTIR Y4 (komiser 16'ya yaslanır), sonra ded_zifiri | 2. celse |
| ded_kulube | clue_uv_silinti + clue_dvr_sk, ancak fact_selin_dvr (SQ_DVR: “SK” kodunu tanığın kendi sözü bağlar) | Tahta |
| contra_s1, contra_s5 | BASTIR S1 sonra çizelge/ded_kulube; S5'e ded_kulube. Tanık “devriyedeydim” der | 1. celse |
| ded_tur | clue_tur_kaydi (kulübe fotoğrafı) + clue_kart_selin (kart kaydı) | Ara tahtası |
| contra_y6 (yeni Y6) | BASTIR Y6 (olay defteri), sonra ded_tur | 2. celse |
| fact_surgu | clue_surgu (Depo 3 içi) + Kerem'e sürgü fotoğrafı (G_SURGU) | Soruşturma |
| kerem_1930_kayit | Q_1930, ancak fact_surgu ile | 1. celse |
| clue_defter | ASAN_DEFTER, ancak fact_defter (TP_DEFTER, fiş bulunduktan sonra) | Ara |
| ded_defter | clue_defter + clue_rulo_sira (kesintisiz kasa rulosu) | Ara tahtası |
| fp_neutralized | C09_A/C09_B, ancak kerem_1930_kayit ∧ ded_defter; defter C_09'da dosyaya alınır | 2. celse |
| ev_hts | suç duyurusu (dayanak_murat); aranın 1. günü sonunda gelir | Ara |
| selin_cozuldu | C_10S'de (yeniden dinlenme: ev_hts ∧ press_s4b) R3'e HTS, ancak `tanik_kirilir`; yoksa CMK 48 ile susar | 2. celse |

Aranın bulguları (şebeke planı, kart kaydı, defter) ve ikinci celsenin çelişkileri (Y4, Y6, iz, dönüş) her beraatin zorunlu halkasıdır.
Sürgü (iz Depo 3 arka kapısının iç sürgüsünde, kapı içeriden açılmış) teşhisten bağımsız bir dolaylı delil olduğu için 223/2-e izin
açıklanmasını da ister. Seçenek konumu: koşulsuz, tek en iyi seçenekli 14 setin hiçbirinde doğru seçenek ilk sırada değil (C_10H dahil).
Murat'ın erken işaretleri azaltıldı: 2. gün hedefi “Kim neyi gördü”, INV_T_MUR'da botu gölgeye çekme ve bandı itme jestleri çıkarıldı.

### E.3 Golden path'ler ve ölçümler (v3.3)
`npm run case:duration -- gece-bekcisinin-sirri`:

| Yol | Sonuç | Final | Aksiyon | Süre sözcüğü | Süre |
|---|---|---|---|---|---|
| G1 | BERAAT_B | 11.680 | 176 | 15.189 | 102,0 dk |
| G2 = TIPIK | BERAAT_E | 10.465 | 208 | 16.071 | 110,1 dk |
| G3 | İNDİRİM | 2.665 | 123 | 11.206 | 74,6 dk |
| G4 | MAHKÛMİYET | −145 | 121 | 10.015 | 67,7 dk |
| G5 | İKRAR | 3.880 | 123 | 11.752 | 77,6 dk |
| W | MAHKÛMİYET (çöküş) | −505 | 104 | 9.690 | 64,2 dk |

**Kısa yol sondası (her sonuç).** Tek süreç, sınırlı süre: golden path ve melez tohumlardan (U1–U4: soruşturma/ara/celse parçalarının
birleşimi) başlayıp motorla yeniden oynayan, reddedilen eylemi atlayan delta küçültücü (48→1 blok) + çift silme geçişi.
Tipik yol 208 aksiyon; %60 çizgisi 125.

| Hedef | Tohumlar | En kısa | Oran | Not |
|---|---|---|---|---|
| BERAAT_E/B | TIPIK, G1, U1–U4 | **125** (TIPIK, U2, U4) | %60,1 | v3.2 eşiksiz: 103; bu turun ilk ölçümü (eşiksiz, zincirsiz): 93 |
| BERAAT_B | G1, U1 | **140** | %67,3 | |
| İNDİRİM | G3 | 84 | %40,4 | 142/2-d hukuken yalnızca anahtarın işverence verildiğine bağlı |
| İKRAR | G5 | 85 | %40,9 | etik çöküş sonu (sahte ikrar 1. celsede) |
| MAHKÛMİYET | G4, W | 71 | — | varsayılan sonuç; iskelet |

En kısa beraat (125): dört günün eylem puanları ve iki celse iskeleti üstüne ampul → iki arıza satırı → ded_lamba → BASTIR/SUN S2; UV +
DVR + SQ_DVR → ded_kulube → BASTIR/SUN S1, S5; sürgü fotoğrafı → G_SURGU → Q_1930; TP_HUSEYIN → TP_DEFTER → ASAN_DEFTER + rulo →
ded_defter; ekip şefi (2. gün) → plan (3. gün okunur) → ded_zifiri; kart kaydı + tur fotoğrafı → ded_tur; 2. celsede BASTIR/SUN Y4, Y6 ve C09.

**Kapılar (2026-10-21):** `npm run build` ✓; `case:validate --max-ms 1200000` PASSED (119/119 node, 237/237 seçenek, 98/98 kural,
57/57 delil, 7/7 golden path; kaçak, kilitlenme yok; yalnızca bütçe kaynaklı SIMULATION_INCOMPLETE); `npm run lint` ✓; vitest
(content-tools, case-schema, engine, validator; `--maxWorkers=2`) 1.884/1.885 — tek kırmızı yine `extract-sprites` (başka davaların paylaşılan
sprite'ları; bu dava sprite eklemedi). `dava07-investigation.test.ts`'deki iki test yeni zincire göre güncellendi (ampul → belediye; iki arıza satırı → lamba).

## Ek F — v3.4: zincirin dayanakları, defterin zamanı, celse numarası (2026-10-21)

Kaynak: dördüncü devil's-advocate incelemesi. İki talep birlikte karşılanır: **hüküm yalnızca tutanağa dayanır** (sonuç koşullarında
skor ya da ikna sayacı yok; v3.3 korunur) ve **her beraat gerçek soruşturmayı ister**. Kısa yol eşikle değil, her güçlü bulgunun
dayanağı (belgenin aslı, onu gören tanık, kaydı yapan kişinin kendi sözü) zincire eklenerek kapatıldı. Hukuki kararlar:
`docs/legal/dava-07.md` madde 25–33. Oyundaki numara: soruşturmadan sonraki ilk duruşma **2. celse** (“Bölüm 3 · İkinci Celse”), aradan
sonraki **3. celse** (“Bölüm 5 · Üçüncü Celse”); gerçek 1. celse oyundan önce, tanık gelmeden yapıldı. Ek A–E'deki “1./2. celse”
ifadeleri oyundaki birinci/ikinci duruşmayı anlatır.

### F.1 İnceleme bulguları ve karşılıkları
| Bulgu | Karşılık |
|---|---|
| En kısa beraat 124/208 (%59,6); Yusuf ziyareti zincirin halkası değildi | AYUS_16 (komiser 16'ya dayandığını söyler) → AEKIP_16'nın önkoşulu; ayrıca defter, olay defteri ve yeşil kalem halkaları. En kısa beraat **131/207 (%63,3)** |
| Defter olaydan sonra yazılmış görünüyordu; ded_defter fişle kopyalanabilirdi | TP_DEFTER: 19.30 satırı 20.30 molasında, 22.57 satırı tezgâhta Hüseyin'in yeşil kalemiyle. ded_defter = satırların sırası (ARA_DEFTER) + Hüseyin'in gözü (AHUS_DEFTER); kürsüde H7_DEFTER. “Olaydan önce” → “o gece, suçlamadan önce” |
| İNDİRİM sanığın sözüyle (84 aksiyon) | C03_A ancak Cengiz'in anlatımıyla somut iddia → zimmet kaydı celbedilir → ARA_ZIMMET → C_08Z'de imza. En kısa 89; hukuki gerekçeyle istisna (madde 33) |
| Celse numaraları çelişiyordu | Bölüm adları 2./3. celse; “ilk celse” → “geçen celse”; gerekçe “üçüncü celsede” |
| INV_T_MUR'da dört işaret, gözdağı ona bağlı; Cengiz zayıf | Örtülü tehditler ve bant çıkarıldı; MQ_ZIYA'nın tehdidi murat_iz ister; `murat_tehdit` = suç duyurusu. Cengiz: INV_T_CEN (saik, aynı marka sigara, anahtar bilgisi), tuzak tarif CB_CENGIZ, kart kaydıyla aklanır |
| AKQ_MURAT nötr blokta korku/teşekkür | Nötr blok: “Omzumu sıktı, bir şey demedi.” Korku yalnızca murat_iz bloğunda |
| Test dosyası kapsam dışıydı | `dava07-investigation.test.ts` ana daldaki hâline döndü; içerik eski sözleşmeyi karşılar (ampul + arıza kaydı → ded_lamba; belediye başvurusu 1. gün) |
| Mahkûmiyet 56,4 dk | Varsayılan kayıp sonucu; bilinçli istisna (F.6) |
| Tahtada kaba kuvvet bedelsiz | Her üç boş bağlantı bir eylem puanı (`ded_miss`); son gün kart kaydı için bir eylem puanı ayrılır |
| C_13 ve C_02'de doğru seçenek ilk sırada | C_02: B, C, **A**, D. C_13: C, **A**, B, D; C13_C artık ölçülü ama tanığı itham eden son söz (kötü) |
| Mazeret varken izle mahkûmiyet gerekçesi zayıf | İNDİRİM/MAHKÛMİYET'e pencere satırı: olay saati 22.40–23.30, mazeret 23.15'e kadar, iz açıklanmadı (madde 29) |
| MAHKÛMİYET'te ulaşılamayan 142/2-d satırları | Çıkarıldı; ceza satırı koşulsuz |
| C09 satırları 237 karakter | Bölündü; paketin en uzun satırı 215 karakter |

### F.2 Zincir (Ek E.2'ye göre değişenler)
| Halka | Önkoşul | Nerede |
|---|---|---|
| ded_lamba | clue_ampul (olay yeri) + ev_ariza_kaydi (Av.K. 2/3, ertesi gün) | Tahta (H_BEL artık 1. gün açık) |
| clue_ariza_onarim | INV_ARIZA: önce söndüğü satır (a14a), sonra onarım (a14c) | Soruşturma |
| yusuf_16 | AYUS_BULGU ∧ direk16_itiraz (S2'den sonra savcı 16'yı gösterir) | Ara |
| ev_direk_plani | AEKIP_16: clue_erteleme ∧ yusuf_16 ∧ ara günü ≥ 2; plan ertesi gün | Ara |
| ded_zifiri | clue_ariza_onarim + clue_direk_plan | Ara tahtası |
| olay_istendi | S1 çürüyünce tanık olay defterine dayanır (selin_olay) → C_ARA0 · CT_OLAY | 2. celse sonu |
| clue_olay_toplu | ARA_OLAY: 23.00 satırı (büyüteç), sonra 21.00 ile karşılaştır | Ara |
| ded_tur | clue_olay_toplu + clue_kart_selin (fotoğraf + kart yalnızca kısmi) | Ara tahtası |
| contra_s5 | PR_S5 (bastır), sonra ded_kulube | 2. celse |
| clue_yesil_satir, clue_defter_sira | ASAN_DEFTER → ARA_DEFTER: yeşil satır (büyüteç), sonra 19.30 ile karşılaştır | Ara |
| clue_yesil_kalem | Çay ocağı fotoğrafı, yazar kasa (ob_kasa) | Soruşturma |
| clue_hus_kalem | AHUS_DEFTER: clue_yesil_satir ∧ clue_yesil_kalem | Ara |
| ded_defter | clue_defter_sira + clue_hus_kalem (defter + rulo: tuzak, kısmi) | Ara tahtası |
| defter_tanik | H7_DEFTER (Hüseyin kürsüde; hus_gelir) | 3. celse |
| fp_neutralized | C09_A/C09_B: kerem_1930_kayit ∧ ded_defter ∧ defter_tanik | 3. celse |
| key_excluded | C08_A ancak contra_y1 (komiser kürsüde kabul eder) | 3. celse |
| iddia_142 → arg_142_2d | C03_A: fact_anahtar_ortak ∧ fact_anahtar_vardiya → ARA_ZIMMET (z_ortak, sonra z_imza) → C_08Z · C08Z_A | 2. celse → ara → 3. celse |

Sonuç koşulları değişmedi: BERAAT_E = `teshis_coktu` ∧ `iz_aciklandi`; BERAAT_B, İNDİRİM (arg_142_2d), İKRAR, MAHKÛMİYET (varsayılan)
v3.3'teki gibidir. Değişen, bayrakların hangi tutanak olayına bağlandığıdır. Aranın üç bulgusu (şebeke planı, olay defterinin aslı,
defterin yeşil satırı ve tanığı) ve 3. celsenin üç katkısı (Y4, Y6, H7_DEFTER + C09) her beraatin zorunlu halkasıdır.

### F.3 Golden path'ler ve ölçümler (v3.4)
`npm run case:duration -- gece-bekcisinin-sirri`:

| Yol | Sonuç | Final | Aksiyon | Süre sözcüğü | Süre |
|---|---|---|---|---|---|
| G1 | BERAAT_B | 12.170 | 186 | 15.687 | 105,8 dk |
| G2 = TIPIK | BERAAT_E | 11.370 | 207 | 16.218 | 110,8 dk |
| G3 | İNDİRİM | 3.355 | 130 | 11.575 | 77,3 dk |
| G4 | MAHKÛMİYET | −145 | 123 | 10.089 | 68,4 dk |
| G5 | İKRAR | 4.005 | 124 | 11.855 | 78,3 dk |
| W | MAHKÛMİYET (çöküş) | −505 | 105 | 9.687 | 64,3 dk |

Paket: 126 node, 66 delil, 1.990 satır, 25.762 satır sözcüğü; bütün metinlerle ~39.400 sözcük. En uzun satır 215 karakter.
TIPIK bu turda yalınlaştı (Murat ziyareti, bazı yan sorular ve iki bilinçli hata çıktı; Cengiz görüşmesi ve olay defteri girdi).

### F.4 Kısa yol sondası (her sonuç)
Tek süreç, sınırlı süre. Üç arama: (1) motorla yeniden oynayan, reddedilen eylemi atlayan delta küçültücü (48→1 blok) + çift silme;
(2) değiştir-sil: her aksiyon `enumerateActions` alternatifleriyle değiştirilip ±25 içinde 1–2 aksiyon silinir (incelemenin aracı);
(3) derin arama: 1–5'lik pencere silme + değiştir ve 1–4'lük pencere silme (5–9 dk bütçe). Tohumlar golden path'ler, eski en kısa yollar
ve elle kurulmuş melezler. İncelemenin 124'lük yolu yeni içerikte bitmez (AYUS_VICDAN, ded_defter ve ded_tur halkaları eksik kalır).

| Hedef | Tohumlar | En kısa | Oran (207) | Süre | Not |
|---|---|---|---|---|---|
| BERAAT_E/B | TIPIK, eski min (uyarlanmış), G1 | **131** | %63,3 | 86,2 dk | Küçültücü 134; değiştir-sil 134; elle C09_B + dilekçesiz 131; derin arama 131'in altını bulamadı |
| BERAAT_B | G1 | **149** | %72,0 | 93,6 dk | |
| İNDİRİM | G3 | **89** | %43,0 | 65,5 dk | Bilinçli istisna: nitelendirme hukuken yalnızca anahtarın zimmetine bağlı (madde 33) |
| İKRAR | G5 | **85** | %41,1 | 64,8 dk | Etik çöküş sonu |
| MAHKÛMİYET | W, G4 | **72** | — | 56,5 dk | Varsayılan kayıp sonucu; 60 dk altı bilinçli istisna |

En kısa beraat (131): dört günün eylem puanları ve iki celse iskeleti üstüne ampul + arıza kaydı → ded_lamba → BASTIR/SUN S2;
UV + DVR + SQ_DVR → ded_kulube → BASTIR/SUN S1, S5; sürgü fotoğrafı → G_SURGU → Q_1930; yeşil kalem (çay ocağı); CT_OLAY; ara:
AYUS_BULGU → AYUS_16 → kart → ekip şefi → defter (yeşil satır, sıra) → Hüseyin → plan → olay defteri → ded_zifiri, ded_tur,
ded_defter; 3. celse: H7_DEFTER, BASTIR/SUN Y4, Y6, C09. Kalan dolgu yalnızca gün sonunu getiren üç ziyarettir (her biri 2 aksiyon).

### F.5 Kapılar (2026-10-21)
`case:validate` PASSED (126/126 node, 257/257 seçenek, 116/116 kural, 66/66 delil, 7/7 golden path; kaçak, kilitlenme yok). Uyarılar:
bütçe kaynaklı SIMULATION_INCOMPLETE ve 4–5 SOFTLOCK_UNVERIFIED (çalıştırmaya göre); her tanık durum motorla oynatılıp sona götürüldü (İKRAR/MAHKÛMİYET),
yani gerçek kilitlenme değil. İlk ölçümdeki gerçek kilitlenme (son gün kart kaydı okunmadan eylem puanı bitiyordu) ARA_HUB'daki
yedek kuralıyla kapandı. `case:duration` ✓; `npm run build` ✓; `npm run lint` ✓; vitest (content-tools, case-schema, engine, validator; `--maxWorkers=2`)
1.884/1.885 — tek kırmızı yine `extract-sprites` (başka davaların `content/shared/sprites`'a eklediği dosyalar; bu dal paylaşılan sprite
eklemedi, Cengiz'in sprite'ı `10-cast.json` içinde satır içi).

### F.6 Bilerek bırakılanlar
- İNDİRİM'in en kısa yolu %43: hukuki gerekçe madde 33. Zincir üç evreye yayılır ve dayanak belgedir; daha fazla kapı keyfî olurdu.
- MAHKÛMİYET'in en kısa yolu 56,5 dk: varsayılan kayıp sonucu; iskeletin üstüne yapay sahne eklemek tipik yolu uzatırdı.
- C_ARA0 tek bir talep alır (olay defteri, keşif ya da hiçbiri); DNA ve kamera talepleri dilekçede ve arada kalır.
