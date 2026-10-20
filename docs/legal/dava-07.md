# Dava #07 — Hukuki İnceleme Notları

> Durum: **İnceleme bekliyor.** Dava geliştirme ortamında "hukuki inceleme bekliyor" işaretiyle yayınlanır; üretimde yayın hukuki onay ister (docs/plan.md §2, §15).
> İnceleme, içerik taslağı (M1.4) hazır olunca siz veya ekibinizden bir avukat tarafından, API ve ekran geliştirmesiyle paralel yapılır. Düzeltmeler yalnızca `content/` verisini ve golden path testlerini değiştirir.

Metinler aşağıdaki güncel mevzuat PDF'leriyle karşılaştırılmıştır (erişim: 2026-10-20):

- TCK 5237 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5237.pdf
- CMK 5271 — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5271.pdf
- 5188 sayılı Özel Güvenlik Hizmetlerine Dair Kanun — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.5188.pdf
- 1136 sayılı Avukatlık Kanunu — https://www.mevzuat.gov.tr/MevzuatMetin/1.5.1136.pdf
- Yakalama, Gözaltına Alma ve İfade Alma Yönetmeliği — https://cigm.adalet.gov.tr/
- 5275 md. 59 (hükümlü/tutuklunun avukatıyla görüşmesi) yorumu ve Bursa 12 Mart gün doğumu/batımı saatleri (TCK 6/1-e "gece vakti" hesabı)

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


## Plan A sırasında eklenenler (incelemeye dahil)
- Duruşmadaki İTİRAZ! butonu için tanık ifadesine yönelik itiraz gerekçeleri: `g_duyum` (tanığın kendi gözlemi yerine başkasının söylediğini aktarması), `g_kanaat` (kişisel kanaat), `g_telkin` (telkin edici soru, CMK 201/1). S4 × g_duyum doğru kabul edilir; dayanaksız itiraz ♥−1. (Plan A Task 20)
