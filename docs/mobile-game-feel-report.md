# Mobil istemci — "oyun hissi" katmanı raporu

Tarih: 2026-10-20 · Dal: `worktree-agent-a6ea21452253f1039` (plan-b birleştirildi; RESULT `epilogue` şeması dahil)

## Özet

İstemci artık görünüm JSON'unu üst üste kartlar olarak dökmüyor. Her yeni `stateVersion` için bir "yönetmen" sırayla şunları oynatıyor:
perde (node değiştiyse) → bölüm kartı (`header.chapter` değiştiyse) → efekt kartları (YENİ DELİL / YENİ KİŞİ / İTİRAZ!) →
görsel roman satırları (`last.lines` + gerekiyorsa `view.lines`) → node gövdesi (seçenekler, sekmeler, birincil düğme).
UI = f(view) korunuyor: istemcide hikâye metni yok; yalnızca genel arayüz metinleri ve genel illüstrasyonlar var.

## Yapılanlar

### 1. DialoguePlayer (görsel roman)
`lib/features/play/dialogue/dialogue_player.dart`, `line_info.dart`, `portrait.dart`
- Satırlar tek tek, daktilo ~35 harf/sn (kart satırı biraz daha yavaş). Görünmeyen kısım saydam çizilir; satır kırılımı baştan sabit, metin kaymaz.
- Dokunuş satırı tamamlar, sonraki dokunuş ilerletir. Boşluk/Enter ilerletir, Esc atlar (web).
- **ATLA** hepsini geçer (atlanan satırlardaki `bg` değişiklikleri yine uygulanır). **GEÇMİŞ** oturumdaki satırların kaydırılabilir listesini açar; başlıkta da GEÇMİŞ düğmesi var.
- Büyük portre (`PixelSprite`, alan yüksekliğine göre 5–10 px), ifade satırdan, ad plakası karakterin vurgu renginde. Konuşmacı değişince portre 3 basamakta kayarak girer.
- `player`: sağdan, mavi kutu; kadroda `COUNSEL` rolü varsa onun sprite'ı ve kısa adı, yoksa "SEN".
- `narrator`: portresiz, ortalanmış italik başlık kutusu.
- `narrator` + `name`: "?" işaretli siyah siluet portre ve isim plakası (karakter kimliği kullanılmaz).
- `style`: `card` tam ekran başlık kartı; `whisper` küçük ve soluk metin, plakada "· FISILTI"; `thought` "İÇ SES" plakası, parantezli soluk italik metin, portresiz; `phone` hoparlör ızgaralı, cızırtılı çerçeve, fosfor yeşili metin, hafif titreme.
- Satırlar bitene kadar seçenekler, sekmeler ve birincil düğme gösterilmez. Bitince son satır, seçeneklerin üstünde küçük bir kutu olarak kalır; böylece soru kaybolmaz. Kutuya dokunmak geçmişi açar.
- Tekrar oynatma: `PlayMemory` (SessionController'da) oynatılmış `stateVersion`'ları tutar; aynı sürüm yeniden çizilince (ör. 409 sonrası yenileme) satırlar tekrar oynamaz. Uygulama yeniden başlarsa bellek sıfırlanır ve satırlar baştan oynar.
- Erişilebilirlik: oynatıcının Semantics etiketi her zaman tam metindir (`AD: metin`, liveRegion). `MediaQuery.accessibleNavigation` açıkken daktilo atlanır.

### 2. Arka planlar
`lib/design_system/backdrops/px_canvas.dart`, `backdrop_scenes.dart`, `backdrop_view.dart`
- 17 Backdrop değerinin hepsi için CustomPainter var: `siyah, buro, buro_gece, gorus_odasi, durusma_salonu, adliye, karakol, sokak_gece, sokak_yagmur, depo, depo_gece, cay_ocagi, ev, kafe, hastane, liman_gece, arac`. 4 px hücreli ızgaraya oturur, kenar yumuşatma yok, noir palet (`PxColors` ile uyumlu).
- 8 fps ortam animasyonu: yağmur ve su birikintisi halkaları, titreyen sokak lambası ve ampul, floresan titremesi, tavan vantilatörü, duvar saati, toz, TV ışığı, semaver buharı, geçen araba farları, liman suyu yansımaları, cam silecekleri. Yalnızca `RetroMotion.full` iken çalışır (TickerMode'a da uyar).
- Arka plan, oynatıcının ve sahne türü node'ların (STORY, DIALOGUE, CHOICE, EVIDENCE, RESULT) arkasında durur. Gövde gösterilirken üstüne okunabilirlik için karartma örtüsü gelir. Seçim sırası: satır `bg` → `header.backdrop` → node türüne göre genel varsayılan (STORY→büro, DIALOGUE→görüş odası, COURTROOM/RESULT→duruşma salonu). Değişimde 520 ms çapraz geçiş yapılır. `fade` + `bg` birlikte gelirse arka plan, ekran tamamen kararınca değişir.

### 3. Geçişler
`lib/features/play/motion/fx_overlay.dart`, `lib/design_system/motion/screen_fx.dart`
- `node.id` değişince 6 bantlı, basamaklı perde (~240 ms): bantlar sırayla kapanır, eski görünüm tutulur, yeni görünüm altta açılır. Kenarda altın şerit var.
- `header.chapter` değişince bölüm kartı ("BÖLÜM 2 · TANIKLAR" biçimi, `·`/`:`/`—` ile bölünür). Dokunuşla geçilebilir.
- Satır `fx`: `shake` ±6/4/2 px, `flash` 60 ms beyaz, `fade` kararıp açılma (basamaklı).

### 4. Geri bildirim hareketi (`view.last.fx`)
- EVIDENCE: "YENİ DELİL" kartı küçükten büyür, sonra arkadan öne döner (4 basamak). Kartın verisi çantadan, yoksa defterden alınır; alttaki etiket "Çantaya eklendi" ya da "Not defterine eklendi" olur.
- CHARACTER: "YENİ KİŞİ" kartında büyük sprite, ad ve kısa etiket var. Aynı yanıttaki birden çok kişi tek kartta toplanır ("YENİ KİŞİLER").
- SCORE ve VAR (delta'lı): uçan +/− yazılar 6 basamakta yükselip söner. HUD ölçerleri hücre hücre dolar/boşalır; yüzde çubuğu 10 basamakta ilerler. Kaybedilen kalp birkaç kez yanıp söner.
- SHOUT: flaş → 3 basamaklı İTİRAZ! pankartı → sarsıntı.
- VERDICT / sonuç ekranı: damga 3 basamakta çarpar ve ekranı sarsar, TOPLAM 20 basamakta sayar, eşik işaretçisi onunla birlikte ilerler. Ardından varsa **epilog** (`node.epilogue`) tam ekran oynatıcıda arka planlarla oynar. Bitince skor dökümü, "Dava raporu" ve "Epiloğu izle" kullanılabilir.
- Aynı node'da gelen efekt kartları gövdenin üstünde, yarı saydam örtüyle gösterilir. Yeni node'da gövde, giriş bitene kadar gizli kalır.

### 5. RetroMotion ayarı
`lib/design_system/motion/retro_motion.dart`, `motion_toggle.dart`
- `full`: her şey açık. `reduced`: daktilo ve kartlar kalır; sarsıntı, flaş ve sürekli ortam animasyonu kapanır. `off`: metin anında gelir, animasyon yoktur (kartlar statik görünür, kendiliğinden kapanır).
- Ayar `flutter_secure_storage` ile kalıcıdır (yeni bağımlılık eklenmedi). Ana menüde ve galeride "HAREKET: …" düğmesi var.
- `MediaQuery.disableAnimations` her zaman `off`'a zorlar; düğmede "Kapalı (sistem)" yazar.

### 6. Hata düzeltmeleri
- SCENE: geri bildirim artık gövdenin üstünde, sabit konumlu bir toast (3,2 sn ya da dokununca kapanır). Görsel yerinden oynamaz; testte `SceneImage` dikdörtgeni değişmiyor.
- `FeedbackBanner`: başlık ve metin gövdede; `label` (ör. "−10 SKOR") sağda ayrı rozet, metne eklenmiyor.
- Soruşturma hub'ı: giriş `lines` kısa bir durum/hedef kutusu olarak çizilir, VN oynatılmaz. Bir aksiyondan `last.lines` gelirse onlar oynar.
- Ek: `view.primary` daha önce hiç çizilmiyordu. Artık satırlar bitince altta sabit birincil düğme olarak çıkıyor (`confirm` soruluyor) ve listede tekrar etmiyor.

### 7. Geliştirici galerisi
`lib/features/dev/dev_gallery.dart`, rota `/_dev/play` (yalnızca `kDebugMode`, oturum gerektirmez)
- Örnek akışlar `apps/mobile/test/fixtures/*.json`'dadır (`index.json` listeyi verir). Gerçek `PlayShell` ve node bileşenlerinden geçerler. Her aksiyon bir sonraki adıma geçer.
  - `cold_open`: kart satırları, isimsiz telefon sesi, iç ses, fısıltı, `bg` geçişleri, shake/flash/fade → görüşme (perde, YENİ KİŞİLER) → YENİ DELİL.
  - `hub`: durum kutusu, birincil düğme; aksiyon yanıtı VN ile.
  - `scene`: ıska toast'u ve rozet, isabet + delil kartı.
  - `courtroom`: bölüm kartı, İTİRAZ!, ölçer, kalp kaybı.
  - `verdict`: damga, sayaç, epilog.
- Tüm adımlar `packages/case-schema`'daki `SessionView` zod şemasıyla doğrulandı.
- Galeride ayrıca hareket ayarı, **yavaş çekim** (timeDilation ×5; perdeyi kare kare görmek için) ve 17 arka planın ızgarası (dokununca tam ekran) var.

### Mimari değişiklik
`PlayScreen` artık ince bir sarmalayıcı. Tüm sunum `PlayShell`'de (`view`, `memory`, `dispatch`, `busy`, `error`); canlı oturum ve galeri aynı kabuğu kullanır. Yığındaki katmanlar anahtarlıdır; aşama değişince gövdenin durumu (ör. sonuç ekranının animasyonu, görüşmede seçili ton) korunur.

## Dosyalar

Yeni:
- `apps/mobile/lib/design_system/backdrops/{px_canvas,backdrop_scenes,backdrop_view}.dart`
- `apps/mobile/lib/design_system/motion/{retro_motion,screen_fx,motion_toggle}.dart`
- `apps/mobile/lib/features/play/dialogue/{dialogue_player,line_info,portrait}.dart`
- `apps/mobile/lib/features/play/motion/fx_overlay.dart`
- `apps/mobile/lib/features/play/play_shell.dart`
- `apps/mobile/lib/features/dev/dev_gallery.dart`
- `apps/mobile/test/{helpers,dialogue_player_test,play_shell_test}.dart`, `apps/mobile/test/fixtures/*.json`

Değişen: `app/app.dart` (MotionScope, debug rotaları), `features/play/{play_screen,session_controller,common}.dart`, `nodes/{simple_nodes,investigation_node}.dart`, `design_system/widgets/hud.dart`, `features/home/home_screen.dart`, `pubspec.yaml` (fixtures varlık olarak).

## Test sonuçları

- `fvm dart analyze`: **No issues found!**
- `fvm flutter test`: **13/13 geçti.**
  - DialoguePlayer: daktilo hızı ve dokunuşla tamamlanma; ilerleme ve ad plakası; ATLA ve `onDone`; hareket kapalıyken anında metin; isimsiz ses için siluet ve "BİR SES" plakası; kart satırı; ekran okuyucunun tam metni hemen alması ve erişilebilir gezinmede daktilonun atlanması; GEÇMİŞ listesi.
  - PlayShell: seçeneklerin satırlar bitene kadar gizli kalması ve aynı sürümün yeniden çiziminde tekrar oynamaması; perde → YENİ KİŞİLER → yanıt + giriş satırları, aynı node'da YENİ DELİL ardından yalnızca yanıt satırları; SCENE görselinin kaymaması ve etiket rozeti; hub durum kutusu ve birincil düğme, aksiyon yanıtının oynaması; karar sayacı → epilog → döküm; 17 arka planın hatasız çizilmesi; FeedbackBanner.
- Canlı yığında (API :3000, auth emülatörü) uçtan uca denendi: MİSAFİR OLARAK OYNA → DAVA DOSYALARI → DAVAYI AÇ. Bölüm kartı, brifing satırları büro arka planında daktiloyla, seçenekler, perde, sonraki node'da yanıt satırı ve brifing gövdesi doğru çalıştı.

## Ekran görüntüleri (`apps/mobile/build/shots/`, gitignore'da)

Galeri / örnek akışlar:
- `00-dev-gallery.png`, `00b-dev-gallery-backdrops.png`: galeri ve arka plan ızgarası
- `01-chapter-card.png`: soğuk açılış bölüm kartı
- `02-card-line-typewriter.png`: kart satırı, daktilo sürüyor
- `03-backdrop-sokak-yagmur.png`: yağmurlu sokak arka planı + anlatıcı kutusu
- `04-anonymous-phone-voice.png`: siluet + "BİR SES · TELEFON"
- `05-thought.png`: iç ses
- `06-dialogue-mid-typewriter.png`: karakter satırı daktilonun ortasında (büro arka planı)
- `07-choices-after-lines.png`: satırlar bitti; son satır kutusu + seçenek
- `60-before-curtain.png`, `61a-curtain-start.png`, `61-curtain-wipe-midframe.png`: perdenin ortasından bir kare (yavaş çekim)
- `70-dialogue-chapter.png`, `71-new-people.png`, `72-dialogue-reply.png`: görüşmeye geçiş, YENİ KİŞİLER, yanıt
- `20-scene-start.png`, `21-scene-miss-toast.png`, `22-evidence-popin-mid.png` (dönüşün ortası), `23-evidence-popin.png`
- `30-court-chapter.png`, `31-court-lines.png`, `33-court-body.png`, `34-shout-banner.png`, `35-shout-shake.png`, `36-after-shout-lines.png`
- `40-hub.png`: durum kutusu + birincil düğme
- `50-verdict-lines.png`, `51-verdict-stamp.png`, `52-verdict-countup.png`, `53-epilogue.png`, `54-verdict-after.png`

Canlı:
- `live-cases.png`, `live-01-brief-typewriter.png` (bölüm kartı), `live-02-brief-q.png`, `live-03-choices.png`, `live-04-after-choice.png` (perde), `live-06.png` (yanıt satırı, büro), `live-08-strategy.png`

## Bilinen eksikler / notlar

- **Fixture'lar sürüm paketine giriyor.** Galeri ve testler aynı JSON'ları kullansın diye `test/fixtures/` pubspec'te varlık olarak tanımlı; rota yalnızca debug'da var ama dosyalar release paketinde de bulunur. Kurgusal örnek metinlerdir, gerçek dava içeriği değildir. İstenirse flavor'a bağlanabilir ya da release derlemesinde betikle çıkarılabilir.
- Galerideki sahne görseli bilerek bulunmayan bir URL (`/_dev/sahne-yok.png`); görsel yerine düz panel çıkar ve konsolda bir 404 görünür.
- Pixelify Sans'ın bazı büyük harfleri (G, E) küçük boyutta tuhaf görünüyor (ör. "GECE"). Bu mevcut yazı tipinden geliyor, bu çalışmada değişmedi.
- Yeni node'a geçerken HUD hücre animasyonu perde/kart sırasında oynar; kullanıcı bir kısmını görmeyebilir.
- Uçan sayılar ve toast, giriş başlarken (kartlardan önce) gösterilir.
- Ses yok (daktilo bip'i, İTİRAZ! sesi); kapsam dışıydı.
- `PlayMemory` yalnızca bellekte. Uygulama yeniden başlayınca son sürümün satırları yeniden oynar (brif gereği kabul edilebilir).
- Duruşma ve görüşme node'larının kendi sahne çizimleri (kürsü, oda) yerinde bırakıldı; yalnızca arka plan ve geçiş katmanı eklendi. Bu ekranları 05/04a çizimlerine daha da yaklaştırmak sonraki iş olabilir.

---

# Ek (2026-10-20, 2. tur): yazı tipi glifleri ve konuşma "mırıltısı"

## 1. Bozuk görünen glifler

**Bulgu: E, G, B, C, Z gibi harflerdeki tuhaf biçimler Pixelify Sans'ın kendi çizimi; render hatası değil.**
- Depodaki `PixelifySans-VariableFont_wght.ttf`, google/fonts'taki güncel `ofl/pixelifysans/PixelifySans[wght].ttf` ile bayt bayt aynı (SHA-256 `9ba86cd0…`, sürüm 1.000).
- Varsayılan ustada (wght 400, sentetik kalınlaştırma yok) glif dış hatları zaten bu biçimde. fontTools ile çıkarılan koordinatlarda E, sağ üst ve sağ alt köşesinde çıkıntısı olan yuvarlak köşeli bir "Є" gibi duruyor. G'de iç kıvrım, B'de orta çentik var.
- Chromium'un kendi metin motoru (Flutter değil, `@font-face` ile) aynı dosyayı aynı biçimde çiziyor. Statik 400/600/700 örneklerine geçince de Flutter çıktısı birebir aynı kalıyor. Kanıtlar `apps/mobile/build/shots/glyphs/`: `before-*.png` (değişken font), `after-*.png` (statik örnekler), `font-candidates.png` (tarayıcı motoru, aday fontlarla yan yana).
- Okunurluk sorunu, küçük boyutta (9–16 px) bu stilize harflerin bir tasarım piksellerinin ekran pikseline denk gelmemesinden geliyor. "LEYLA → EOƏ" algısı da buradan.

**Yapılanlar (istenen düzeltme):**
- `varLib.instancer` (scratch altında tek kullanımlık venv) ile statik `PixelifySans-Regular/SemiBold/Bold.ttf` üretildi; pubspec'te 400/600/700 olarak ayrı ayrı kayıtlı. Değişken dosya kaldırıldı. Ağırlıklar artık gerçek; Flutter'ın wght eşlemesine bağlı değil.
- OFL lisansları: pubspec'te "eklenecek" notu vardı ama kod yoktu. `main.dart` artık `LicenseRegistry.addLicense` ile her iki fontun OFL metnini kaydediyor.
- `/_dev/glyphs` (galeriden "Yazı tipi denetimi"): A–Z + ÇĞİÖŞÜ, 9–36 px; Pixelify 400/600/700 ve VT323.

**Karar gerekiyor (yapılmadı):** Gliflerin okunur olması isteniyorsa başlık yazı tipini değiştirmek gerekiyor. Bu bir tasarım dili kararı olduğu için tek başıma değiştirmedim. `font-candidates.png`'deki OFL adaylar (hepsi google/fonts):
- **Jersey 10**: Pixelify'a en yakın his (dar, kalın piksel), harfler sade, İ/Ğ/Ş doğru. Aynı görünür boy için ~1,3× punto gerekir. Önerim bu.
- **Silkscreen**: çok okunur, ama küçük harfler küçük büyük harf gibi.
- **Press Start 2P**: çok geniş; yerleşimleri bozar.
- **DotGothic16**: "BİR" yazımında İ noktasız görünüyor, Türkçe için uygun değil.
- Değişiklik tek yerde: `PxText.pixel` içindeki `fontFamily` ve pubspec girişi.

## 2. Karakter "mırıltısı" (blip sesi)

Dosyalar: `lib/features/play/voice/{blip_synth,blip_scheduler,voice}.dart`. Değişenler: `dialogue_player.dart`, `app.dart`, `main.dart`, `motion_toggle.dart` (SoundToggle), `home_screen.dart`, `dev_gallery.dart`.

- **Sentez:** PCM Dart'ta üretiliyor (ses dosyası ve lisans yok). 22,05 kHz, 16-bit mono WAV; kare (doluluk %50/25/12,5) ya da üçgen dalga; 3 ms atak, üstel sönüm, sonda tık önleyici kapanış, hece hissi için hafif aşağı kayan perde; blip başına 42–65 ms.
- **Konuşmacı sesi:** karakter kimliğinin FNV-1a özetinden, pentatonik basamaklarla ~165–440 Hz aralığında perde, dalga türü, doluluk ve uzunluk; aynı kimlik hep aynı sesi verir. Her blip 3 perde varyantından (×0,94/1,0/1,06) birini kullanır; böylece küçük perde sapması olur.
- **Biçimler:** `narrator` çok yumuşak alçak bir tık (110 Hz, 18 ms); `card` sessiz; `whisper` filtrelenmiş gürültü, kısık; `phone` 300–3000 Hz bant, 6-bit ezme ve cızırtı tıkırtıları; `thought` üçgen dalga, yarı ses.
- **Zamanlayıcı (`BlipScheduler`):** yalnızca harf ve rakamlar sayılır, boşluk ve noktalama blip tetiklemez. Konuşmacıya göre her 2 ya da 3 harfte bir blip çalar. `.,?!…;:` sonrasında 170 ms sessizlik olur ve sayaç sıfırlanır. Zaman, daktilonun kendi ilerlemesinden hesaplanır (testte ve yavaş çekimde tutarlı).
- **Durma:** satır dokunuşla tamamlanınca, ATLA'da ve widget kapanınca zamanlayıcı durur, çalan ses kesilir. Satır kendiliğinden bitince zamanlayıcı kendini durdurur.
- **Ayar:** "SES: AÇIK/KAPALI" düğmesi ana menüde ve galeride, Hareket düğmesinin yanında. Varsayılan açık; secure storage ile kalıcı. Kapalıyken `VoiceScope` boş verir ve hiç ses çalınmaz.
- **Web otomatik oynatma:** uygulama kökündeki `Listener`, ilk dokunuşta `unlock()` çağırır. O ana kadar blip çalınmaz.
- **Paket:** `audioplayers 6.8.1` (2026-06; Flutter ≥3.44, 3.47.7 ile çözülüyor). Bellekten bayt çalmayı Android'de (SDK ≥23) doğrudan, iOS ve web'de dönüştürerek destekliyor. `flutter_soloud` 5.2.1 daha düşük gecikmeli ama yerel derleme kancaları, codec kütüphaneleri ve web kurulumu gerektiriyor; bu ihtiyaç için ağır buldum.
- **Gecikme düzeltmesi:** ilk sürüm her blip'te kaynağı yeniden yüklüyordu ve web'de çoğu blip düşüyordu (bir koşuda 4 oynatma). Artık her sesin varyant oynatıcıları satır başında `prepare()` ile önceden yükleniyor; blip yalnızca baştan oynatıyor. Bellekte en çok 10 ses tutuluyor (LRU). iOS'ta ses oturumu `mixWithOthers` + `respectSilence` (kullanıcının müziğini kesmez, sessiz anahtara uyar).
- **Web'de elle doğrulama (Playwright, `--autoplay-policy=user-gesture-required`):** dokunuştan önce 0 oynatma. Dokunuştan sonra soğuk açılışta 60 oynatma, hepsinin `play()` sözü başarılı. Aralıklar ~50–80 ms; noktadan sonra ~230 ms boşluk var. Dinlemek için `apps/mobile/build/shots/voice-demo.wav`: 5 konuşmacı + fısıltı, telefon, iç ses, anlatıcı (aynı sentezden üretildi).

## Test sonuçları (2. tur)

- `fvm dart analyze`: No issues found!
- `fvm flutter test`: **21/21 geçti** (önceki 13 + 8 yeni):
  - zamanlayıcı: hangi karakterlerin blip tetiklediği, Türkçe harfler ve rakamlar, noktalama sonrası sessizlik, `stop()` sonrasında blip olmaması;
  - ses tarifinin kararlılığı ve aralığı, biçimlere göre değişimi;
  - WAV başlığı ve süresi;
  - oynatıcı entegrasyonu: daktilo sürerken blip çalması, dokunuşla tamamlanınca ve ATLA'da kesilmesi, kart satırının sessiz kalması.

## Bilinen eksikler (2. tur)

- Başlık yazı tipi kararı yukarıda; kullanıcıya sorulmalı.
- Gerçek iOS/Android cihazda ses denenmedi (yalnızca web + birim testleri). Android'de `PlayerMode.lowLatency` (SoundPool) kullanılıyor; iOS'ta audioplayers baytları dönüştürerek çalıyor ve ilk blip'te biraz gecikme olabilir.
- Blip başına ses düzeyi sapması yok (her blip'te `setVolume` çağrısı gecikme eklediği için); çeşitlilik perde varyantlarından geliyor.
