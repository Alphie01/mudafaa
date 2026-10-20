# Sunucu promptu: dava üretimini Debian sunucuda sürdür

Bu dosyanın aşağıdaki "PROMPT" bölümü, Debian sunucuda repo kökünde açılan **Claude Code** oturumuna olduğu gibi yapıştırılır.

---

## PROMPT

Müdafaa projesinin dava içeriği üretimini bu sunucuda sürdüreceksin. Repo: https://github.com/Alphie01/mudafaa.git, çalışma dalı `plan-b`. Önce `docs/DEPLOY.md` dosyasının "Dava durumu" ve §8 bölümlerini oku. Kullanıcı bu işi açıkça çok ajanlı bir iş akışıyla yürütmeni istiyor; Workflow tool'unu kullanma onayın var.

**Bu sunucu headless bir Debian. Playwright/Chromium burada doğru çalışmıyor.** Bu yüzden şu komutları çalıştırma ve tarayıcı kurmaya ya da etrafından dolaşmaya çalışma:

- `npm run case:scenes`
- `npm run case:sprite-preview`
- `npx playwright install`
- tarayıcı açan başka her şey (Playwright MCP dahil)

**Görsel ve tarayıcı kontrollerini koordinatör Claude daha sonra kullanıcının Mac'inde kendisi yapacak:**

- sahne PNG'lerinin render edilmesi;
- sprite önizlemeleri;
- uygulamada uçtan uca oynanış testi;
- son kabul kontrolleri.

Senin işin içeriği yazmak, şeytanın avukatı incelemesini ve düzeltmeleri yapmak, tarayıcı gerektirmeyen tüm kapıları yeşile çekmek ve sonucu push etmek. Sahne PNG'leri eksik kalabilir; doğrulayıcı onları istemez.

### 1. Hazırlık

```bash
git fetch origin '+refs/heads/*:refs/remotes/origin/*'
git checkout plan-b && git pull
for b in son-mesaj kirik-kadeh sahte-imza liman-gecesi belediye-kasasi zarf silinen-dosyalar yanik-ev; do
  git branch -f wip/$b origin/wip/$b
done
npm ci
(cd apps/api && npx prisma generate)
npm run build
npm test            # temel çizgi yeşil olmalı
```

Her davaya ayrı bir worktree aç. İnceleme ve düzeltme ajanları bu dizinlerde çalışır ve commit atar:

```bash
for s in kayip-cuzdan cevrimici-tuzak kirmizi-isik beyaz-toz gece-yarisi-gaspi; do
  git worktree add -b review/$s .claude/worktrees/review-$s plan-b
done
for s in son-mesaj kirik-kadeh sahte-imza liman-gecesi belediye-kasasi zarf silinen-dosyalar yanik-ev; do
  git worktree add .claude/worktrees/wip-$s wip/$s
done
```

`.claude/worktrees/` git tarafından yok sayılmalı; `git check-ignore -q .claude/worktrees` ile kontrol et.

### 2. İş akışını çalıştır

- **Betik:** `tools/content/workflows/cases-split.js`.
- **Argümanlar:** `tools/content/workflows/server-args.json` dosyasını oku ve `"root": "__ROOT__"` değerini repo kökünün mutlak yoluyla değiştir (`pwd`). `noBrowser: true` kalmalı; bu bayrak yazar ajanlarına tarayıcı yasağını iletir.
- **Çağrı:** Workflow tool'unu `scriptPath` ile çağır ve argümanları JSON nesnesi olarak `args`'a ver (string olarak değil).

Argümanlardaki modlar:

| Mod | Davalar | Ne yapar |
|---|---|---|
| `done` | #01–#05 | Yazımları bitti ve PASSED aldılar. Doğrudan şeytanın avukatı incelemesine, ardından düzeltmeye geçerler (`review/<slug>` worktree'sinde). |
| `resume` | #06, #08–#14 | `wip/<slug>` worktree'sinde, yarım kalan yazımı kaldığı yerden sürdürür. |
| `new` | #15 son-durusma | Sıfırdan yazılır (iş akışı kendi worktree'sini açar). |
| `review7` | #07 gece-bekcisinin-sirri | Yalnızca incelenir ve düzeltilir. |

Bir iş akışı aynı anda en çok `min(16, CPU−2)` ajan çalıştırır. 15 iş kalemi var. CPU sayısı 17'den azsa kalemleri iki ayrı iş akışına böl ve ikisini birlikte başlat (aynı betik, farklı `items`). Bölerken yazım işlerini (`resume`/`new`) iki tarafa eşit dağıt.

İş akışları bitene kadar kısa aralıklarla sorgulama (polling) yapma; tamamlanma bildirimi gelir. Bir ajan `null` dönerse ya da `status: failed` olursa sonuçlara bak (`journal.jsonl`). Gerekirse yalnızca o davayı tek kalemli yeni bir iş akışıyla yeniden çalıştır.

### 3. Birleştirme ve kapılar

Her dava için, dalın kendi worktree'sinde şu kapıların hepsi yeşilse dalı `plan-b`'ye birleştir:

- `npm run build`;
- `npm run case:validate -- <slug>`: PASSED, tam kapsam, softlock veya sızıntı yok;
- `npm run case:duration -- <slug>`: tipik yol 90–120 dk, diğer her sonuç ≥60 dk;
- `npx vitest run --project content-tools --project case-schema --project engine --project validator`;
- `npm run lint`.

Ayrıca şunlar sağlanmalı:

- son incelemede açık **blocker** kalmamış olmalı;
- beraate giden en kısa yol, tipik yolun hamle sayısının ≥%60'ı olmalı.

Birleştirilecek dallar ve birleştirme kuralları:

- `review/<slug>`: #01–#05 düzeltmeleri.
- `wip/<slug>`: tamamlanan davalar.
- `new` için iş akışının açtığı dal.
- #07 için `review7` dalı.
- Bir davanın dalı yalnızca kendi dosyalarına dokunmalı: `content/cases/<slug>`, `content/src/<slug>`, `docs/content/<slug>*`, `docs/legal/<slug>.md`. Başka bir dosyaya dokunuyorsa birleştirmeden önce o değişikliği geri al ya da gerekçesini rapora yaz.
- Kapıyı geçemeyen davayı birleştirme. Dalını push et ve nedenini rapora yaz.

Tüm birleştirmelerden sonra `plan-b` üzerinde şunları çalıştır:

```bash
npm run validate:cases && npm test && npm run lint
```

### 4. Rapor ve push

`docs/content/server-run-report.md` dosyasını yaz. Her dava için şunlar olmalı:

- incelemenin sonucu (blocker, major ve minor sayıları);
- düzeltilmeyen bulgular ve gerekçeleri;
- en kısa beraat yolunun hamle sayısı ve tipik yolunkiyle karşılaştırması;
- `case:duration` sonuçları ve kelime sayıları;
- hangi dala birleştirildiği ya da neden birleştirilmediği;
- **koordinatörün görsel olarak kontrol etmesi gereken liste:** her davanın sahne HTML dosyaları (`content/src/<slug>/scenes/*.html`) ve yeni sprite'ları (`content/src/<slug>/sprites.ts`).

Raporu commit et. Sonra `plan-b`'yi ve tüm `review/*` ile `wip/*` dallarını origin'e push et. `main`'e push etme, force-push yapma.

Commit mesajları Türkçe conventional commit biçiminde olmalı ve şu satırla bitmeli:

```
Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
```

Bitince kullanıcıya kısa bir özet ver. Görsel ve tarayıcı kontrollerinin koordinatöre bırakıldığını belirt.
