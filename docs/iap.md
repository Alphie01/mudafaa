# Uygulama içi satın alma (IAP): tasarım

Ödemeler yalnızca **Google Play Billing** ve **App Store** üzerinden alınır; aracı servis (RevenueCat vb.) kullanılmaz. Hak (entitlement) sunucuda, kullanıcı hesabına bağlı tutulur. İstemci mağaza makbuzunu sunucuya gönderir, sunucu bunu mağazanın sunucu API'siyle doğrular. Sunucu istemcinin "satın aldım" demesine asla güvenmez.

## Ürünler

| Ürün kimliği | Tür (Play / App Store) | Fiyat | Ne verir |
|---|---|---|---|
| `dava_kilidi` | Tüketilebilir uygulama içi ürün / Consumable | 10 TL | Satın alma ekranının açıldığı tek bir ücretli davanın kalıcı kilidini açar. |
| `premium_aylik` | Abonelik / Auto-renewable subscription | 50 TL / ay | Abonelik süresince reklamsız kullanım (`adFree`) ve **her fatura döneminde 3 dava seçme hakkı**. |

**Ücretsiz davalar:** #01 ve #02 (`meta.number` 1 ve 2). Diğer tüm davalar ücretlidir. Dava kartının rütbe kilidi ayrıca geçerli kalır.

Premium için verilmiş kararlar:

- Seçilen davalar abonelik normal biçimde bitse (süre dolumu, iptal) bile kalıcı olarak kullanıcının kalır.
- **İade istisnası (bilinen ödünleşim):** abonelik iade edilir ya da geri alınırsa (App Store `REFUND`/`REVOKE`, Play iptal edilen satın alma ya da `SUBSCRIPTION_REVOKED`) iade edilen dönemde yapılan seçimler geri alınır. Dönem başı App Store'da işlemin `purchaseDate`'idir; Play bildiriminde bilinmediği için geri alma anından bir ay öncesi kullanılır. Bu yüzden Play'de dönem başından önceki son günlerde yapılmış bir seçim de geri alınabilir, App Store'da iade edilen dönemden önceki seçimler kalır. Abuse'u (abone ol, 3 dava seç, iade al) kapatmak için kabul edilmiş bir ödünleşimdir.
- Kullanılmayan seçim hakkı sonraki döneme devretmez.
- Dönem, mağazanın bildirdiği bitiş tarihine göre belirlenir.
- Bu kararlar (koordinatörün takdiri) `EntitlementService` içinde tek bir yerde durur, değiştirilmesi kolaydır.

## Akışlar

1. **Dava satın alma:**
   1. Oyuncu kilitli dava kartında "10 ₺ · Satın al"a basar; istemci `dava_kilidi` satın alımını başlatır.
   2. Mağaza başarılı dönünce istemci `POST /v1/purchases` gönderir: `{ platform, productId, token, caseId }`. Android'de `token` = purchaseToken, iOS'ta transactionId.
   3. Sunucu doğrular, aynı token'ı yalnızca bir kez kabul eder ve `caseId` için sahiplik yazar.
   4. Ardından istemci satın alımı tamamlar: Android'de consume, iOS'ta finishTransaction.
   5. Doğrulanmış ama tamamlanmamış satın alımlar uygulama açılışında yeniden gönderilir.
2. **Premium:** Satın alma ve geri yükleme sonrasında `POST /v1/purchases` (`productId: premium_aylik`) gönderilir. Sunucu aboneliğin bitiş tarihini kaydeder; `GET /v1/me` şu alanları döner: `premium: { active, expiresAt, picksLeft }` ve `adFree`.
3. **Premium seçimi:** `POST /v1/me/premium-picks { caseId }` isteği abonelik aktifse ve dönemde hak kaldıysa sahiplik yazar.
4. **Geri yükleme:** Ayarlar'da "Satın alımları geri yükle" (App Store bunu zorunlu tutar).
   - Abonelikler yeniden doğrulanır.
   - Tüketilebilir ürünler mağazadan geri yüklenemez; zaten hesaba yazılmış oldukları için kaybolmazlar.
   - Misafir hesap kullananlara, satın almadan önce hesabını kaydetmesi önerilir.

## Doğrulama

- **Google Play:** Android Publisher API v3; `GOOGLE_PLAY_SERVICE_ACCOUNT` (JSON ya da base64) ve paket adı `com.monolithyazilim.mudafaa` kullanılır.
  - Uygulama içi ürün: `purchases.products.get`; `purchaseState=0` olmalı.
  - Abonelik: `purchases.subscriptionsv2.get`; `subscriptionState` ve `lineItems[].expiryTime` okunur.
  - Servis hesabı Play Console → API erişimi'nde yetkilendirilmiş olmalı.
- **App Store:** App Store Server API, `GET /inApps/v1/transactions/{id}`.
  - JWT için `APPLE_ISSUER_ID`, `APPLE_KEY_ID`, `APPLE_PRIVATE_KEY` (.p8, base64) kullanılır; bundle `com.monolithyazilim.mudafaa`.
  - İmzalı işlem (JWS) Apple sertifika zinciriyle doğrulanır; Apple'ın resmî Node kütüphanesi kullanılabilir.
  - Ortam önce production, olmazsa sandbox denenir.
- **Sahte doğrulayıcı:** `PURCHASE_VERIFY_MODE=fake` yalnızca production dışında açılabilir. `test:` önekli token'ları kabul eder; e2e testleri ve yerel geliştirme içindir.
  - Ürün: `test:<herhangi>`. Abonelik: `test:sub:<gün>[:<kimlik>]` (bitiş = şimdi + gün; eksi gün süresi dolmuş abonelik; aynı `<kimlik>` aynı aboneliğin yenilenmesidir).
  - Sahte satın almalar test (sandbox) satın alması sayılır.
- **Sandbox / test satın almaları:** her satın alma ve abonelik ortamıyla (`PRODUCTION` / `SANDBOX`) kaydedilir. App Store sandbox işlemi ve Google Play lisans test kullanıcısı satın alması (`purchaseType=0`, abonelikte `testPurchase`) `SANDBOX`'tır; bunlardan gelen haklar `case_entitlements.sandbox` ile işaretlenir (denetim ve gerekirse toplu geri alma için).
  - Production'da sandbox kapısı kapalıdır: `APPLE_ALLOW_SANDBOX` (iOS) ve `GOOGLE_ALLOW_TEST_PURCHASES` (Android) varsayılan `false`. Kapalıyken sandbox satın alması 400 `purchase_invalid` alır, sandbox App Store bildirimleri yok sayılır (200, loglanır), sandbox abonelikler premium hesabına ve yeniden doğrulamaya, sandbox haklar dava erişimine girmez.
  - App Review (Apple incelemesi sandbox ile satın alır) ve kapalı test süresince ilgili bayrak geçici olarak `true` yapılır; kapatılınca o haklar yeniden sayılmaz.
- **Yeniden doğrulama:** aktif ya da otomatik yenilenen abonelik en fazla 10 dakikada bir (`GET /me` vb. sırasında) mağazaya yeniden sorulur; bildirim kaçsa bile yenileme, iptal ve iade yakalanır.

## Mağaza bildirimleri (iade ve geri alma)

- `POST /v1/store-notifications/apple`: App Store Server Notifications **v2**. `signedPayload` Apple kök sertifikalarıyla (`apps/api/certs/apple/`) `SignedDataVerifier` ile doğrulanır; önce production, sonra sandbox doğrulayıcısı denenir.
  - `REFUND`, `REVOKE`: tüketilebilir üründe satın alma `REVOKED` olur ve verdiği dava hakkı silinir; abonelikte abonelik geri alma anında biter ve iade edilen dönemin seçimleri silinir.
  - `DID_RENEW`: yeni bitiş tarihi (yeni dönem, 3 seçim). `EXPIRED`: bitiş tarihi, yenileme kapalı; seçimler kalır.
  - Diğer türler 200 ile kabul edilir, değişiklik yapılmaz.
- `POST /v1/store-notifications/google`: Play gerçek zamanlı geliştirici bildirimleri (RTDN), Pub/Sub **push** aboneliği.
  - Kimlik: Pub/Sub'ın eklediği `Authorization: Bearer <OIDC token>`. `google-auth-library` `OAuth2Client.verifyIdToken` ile imza ve süre doğrulanır; audience `GOOGLE_RTDN_AUDIENCE`, yayıncı `accounts.google.com`, e-posta `GOOGLE_RTDN_SERVICE_ACCOUNT` ve doğrulanmış olmalı. Servis hesabı denetimi zorunludur (yoksa herkes kendi GCP projesinden doğru audience'lı token üretebilir); iki değişkenden biri eksikse uç 503 `store_not_configured` döner ve API `AUDIENCE` varken `SERVICE_ACCOUNT` olmadan açılmaz.
  - `voidedPurchaseNotification`: satın alma `REVOKED`, hakkı silinir (abonelikse abonelik de geri alınır). `SUBSCRIPTION_REVOKED` (12): abonelik geri alınır. Diğer abonelik bildirimleri: abonelik mağazadan yeniden okunur.
  - Gizli değer sorgu dizesinde taşınmaz; ayrıca pino-http loglarında URL'ler sorgu dizesi olmadan yazılır.

## API değişiklikleri

- `GET /v1/cases`: kartlara `access: 'FREE' | 'OWNED' | 'PAID_LOCKED'` alanı eklenir. Mevcut rütbe kilidi aynen kalır.
- `POST /v1/cases/:id/start`: sahiplik yoksa `403 case_not_owned` döner.
- `GET /v1/me`: `premium` ve `adFree` alanları eklenir.
- Yeni uçlar: `POST /v1/purchases`, `POST /v1/me/premium-picks`, `POST /v1/store-notifications/apple`, `POST /v1/store-notifications/google`.
- Prisma'ya yeni tablolar:
  - `purchases`: platform, ürün, benzersiz token, kullanıcı, dava, durum, ham doğrulama yanıtı.
  - `case_entitlements`: kullanıcı + dava benzersiz; kaynak PURCHASE / PREMIUM_PICK / GRANT.
  - `subscriptions`: kullanıcı, platform, orijinal işlem / token, bitiş tarihi, dönem başına kullanılan seçim sayısı.

## Uygulama notları ve tasarımdan sapmalar

- **`PAYWALL_ENABLED`** (varsayılan `true`, production'da `false` yasak): e2e testleri her davayı benzersiz rastgele numarayla açar; #01–#02 dışındaki her dava ücretli olacağı için eski testler ücret kilidini kapatır. Ücret kilidi testleri `PAYWALL_ENABLED=true` ile çalışır. Kapalıyken her dava `FREE` görünür (sözleşme fikstürlerindeki `access: "FREE"` buradan gelir).
- **Eski oturumlar:** ücret kilidinden önce açılmış aktif oturum `POST /cases/:id/start` ile kaldığı yerden sürer; `case_not_owned` yalnızca yeni oturumda (ve `restart`'ta) verilir.
- **Zaten açık dava:** ücretsiz ya da sahip olunan davaya premium seçimi hak harcamaz (200, idempotent). Sahip olunan davaya dava kilidi satın alınırsa satın alma kaydedilir, mevcut hak korunur (istemci bu durumda satın alma düğmesi göstermez).
- **Fiyat yazımı:** başlık/düğme yazı tipi Jersey 10'da ₺ glifi yok (yalnızca gövde yazı tipi VT323'te var). Düğmelerde ve etiketlerde fiyat "10 TL" biçiminde, gövde metninde "10 ₺" (mağaza fiyatı) yazılır.
- **Dava kilidinin hangi dava için alındığı** istemcide güvenli depoda tutulur (tek bekleyen satın alma); açılışta yeniden gönderilen tüketilmemiş satın alma bu kayıtla eşlenir. Kayıt yoksa satın alma tüketilmez (hak kaybolmaz), kullanıcıya destek mesajı gösterilir.

## Kurulum

API uç noktaları: `https://mudafaa.sehirkilavuzu.com/v1/purchases`, `.../v1/store-notifications/apple`, `.../v1/store-notifications/google`. Paket / bundle kimliği: `com.monolithyazilim.mudafaa`.

### Google Play Console

1. **Ödeme profili:** Play Console → Ayarlar → Ödeme profili (satıcı hesabı) tanımlı olmalı; yoksa ürün oluşturulamaz. Uygulamanın `BILLING` izinli bir sürümü (in_app_purchase eklentisi izni ekler) en az bir test kanalına (dahili test) yüklenmiş olmalı.
2. **Uygulama içi ürün:** Para kazanma → Ürünler → Uygulama içi ürünler → Ürün oluştur.
   - Ürün kimliği `dava_kilidi`, ad "Dava kilidi", açıklama "Tek bir ücretli davanın kalıcı kilidini açar."
   - Varsayılan fiyat 10,00 TRY (diğer ülkeler için fiyatları dönüştür), Etkinleştir.
   - Uygulama tüketir: sunucu doğruladıktan sonra istemci `consume` eder; aynı ürün tekrar satın alınabilir.
3. **Abonelik:** Para kazanma → Ürünler → Abonelikler → Abonelik oluştur.
   - Ürün kimliği `premium_aylik`, ad "Müdafaa Premium".
   - Temel plan ekle: kimlik `aylik`, tür "Otomatik yenilenen", faturalandırma dönemi **1 ay**, fiyat 50,00 TRY, yeniden abone olma izni açık; temel planı Etkinleştir.
   - İsteğe bağlı: ödemesiz deneme / tanıtım teklifi (sunucu bitiş tarihini mağazadan okur, ek ayar gerekmez).
4. **Servis hesabı (doğrulama):**
   - Google Cloud Console (Play Console'a bağlı proje) → IAM → Servis hesapları → yeni hesap (ör. `play-verify@...`), JSON anahtar oluştur.
   - "Google Play Android Developer API"yi o projede etkinleştir.
   - Play Console → Kullanıcılar ve izinler → Yeni kullanıcı davet et → servis hesabının e-postası; uygulama izinleri: "Finansal verileri görüntüleme" ve "Siparişleri ve abonelikleri yönetme". (Eski arayüzde: Kurulum → API erişimi → projeyi bağla → hesaba erişim ver.)
   - İzinlerin etkinleşmesi 24 saate kadar sürebilir; bu sürede doğrulama 503 `store_not_configured` (401/403) döner.
   - JSON anahtarı tek satır ya da base64 olarak `GOOGLE_PLAY_SERVICE_ACCOUNT`'a koy.
5. **Gerçek zamanlı geliştirici bildirimleri (RTDN):**
   - Google Cloud → Pub/Sub → Konu oluştur: `play-rtdn`. Konunun izinlerine `google-play-developer-notifications@system.gserviceaccount.com` hesabını **Pub/Sub Publisher** rolüyle ekle.
   - Push aboneliği için ayrı bir servis hesabı oluştur (ör. `rtdn-push@<proje>.iam.gserviceaccount.com`); Pub/Sub hizmet aracısına (`service-<proje-no>@gcp-sa-pubsub.iam.gserviceaccount.com`) bu hesap üzerinde **Service Account Token Creator** rolü ver.
   - Konuda abonelik oluştur: teslim türü **Push**, uç nokta `https://mudafaa.sehirkilavuzu.com/v1/store-notifications/google`, **Kimlik doğrulamayı etkinleştir** → servis hesabı `rtdn-push@...`, audience `https://mudafaa.sehirkilavuzu.com/v1/store-notifications/google`.
   - Play Console → Para kazanma kurulumu → Google Play Faturalandırma → Gerçek zamanlı geliştirici bildirimleri: konu adı `projects/<proje>/topics/play-rtdn`, bildirim içeriği "Abonelikler, iptal edilen satın almalar ve tüm tek seferlik ürünler". "Test bildirimi gönder" ile dene (API 200 `{"action":"test"}` döner).
   - API ortamı: `GOOGLE_RTDN_AUDIENCE` = abonelikteki audience, `GOOGLE_RTDN_SERVICE_ACCOUNT` = `rtdn-push@...` (ikisi birlikte zorunlu).
6. **Lisans test kullanıcıları:** Play Console → Ayarlar → Lisans testi → test hesaplarının Gmail adreslerini ekle, lisans yanıtı `RESPOND_NORMALLY`. Aynı hesapları dahili test kanalına test kullanıcısı olarak ekle; cihazda bu hesapla uygulamayı Play'den (dahili test bağlantısı) kur. Test satın almaları ücret almaz ve abonelikler hızlandırılmış yenilenir (aylık ≈ 5 dk). Production API bu satın almaları `GOOGLE_ALLOW_TEST_PURCHASES=true` olmadan reddeder.

### App Store Connect

1. **Sözleşmeler:** İş → Ücretli Uygulamalar sözleşmesi, vergi ve banka bilgileri tamamlanmış olmalı.
2. **Tüketilebilir ürün:** Uygulama → Para Kazanma → Uygulama İçi Satın Alımlar → + → **Tüketilebilir**.
   - Referans adı "Dava kilidi", ürün kimliği `dava_kilidi`, fiyat 10 TL (Türkiye) / karşılık gelen kademe; Türkçe yerelleştirme (görünen ad, açıklama) ve inceleme ekran görüntüsü ekle.
3. **Abonelik:** Para Kazanma → Abonelikler → abonelik grubu oluştur ("Müdafaa Premium"), grupta **Otomatik yenilenen abonelik**:
   - Referans adı "Premium aylık", ürün kimliği `premium_aylik`, süre **1 ay**, fiyat 50 TL; grup ve abonelik yerelleştirmeleri, inceleme ekran görüntüsü.
   - İlk sürümde ürünler uygulama sürümüyle birlikte incelemeye gönderilir (sürüm sayfası → Uygulama İçi Satın Alımlar ve Abonelikler bölümünden seç).
4. **In-App Purchase anahtarı (App Store Server API):** Kullanıcılar ve Erişim → Entegrasyonlar → **Uygulama İçi Satın Alma** → anahtar oluştur.
   - Sayfadaki **Issuer ID** → `APPLE_ISSUER_ID`; anahtarın **Key ID**'si → `APPLE_KEY_ID`.
   - `SubscriptionKey_<KEYID>.p8` dosyası yalnızca bir kez indirilir: `base64 -i SubscriptionKey_XXXX.p8 | tr -d '\n'` → `APPLE_PRIVATE_KEY`.
   - Uygulama → Uygulama Bilgileri → **Apple Kimliği** (sayısal) → `APPLE_APP_ID` (production imzalı işlem ve bildirim doğrulaması için gerekir).
5. **Sunucu bildirimleri:** Uygulama → Uygulama Bilgileri → App Store Server Notifications:
   - Production sunucu URL'si ve Sandbox sunucu URL'si: `https://mudafaa.sehirkilavuzu.com/v1/store-notifications/apple`, sürüm **Version 2**.
   - "Test bildirimi iste" (App Store Server API `requestTestNotification`) ile denenebilir; `TEST` türü 200 ile yok sayılır.
6. **Sandbox test kullanıcıları:** Kullanıcılar ve Erişim → Sandbox → Test hesapları → + (ülke Türkiye). Cihazda Ayarlar → App Store → Sandbox hesabı ile oturum aç; geliştirme derlemesinde satın al. Sandbox abonelikleri hızlandırılmış yenilenir (1 ay ≈ 5 dk). Production API sandbox satın almalarını `APPLE_ALLOW_SANDBOX=true` olmadan reddeder; **App Review süresince `APPLE_ALLOW_SANDBOX=true`** olmalı (inceleme ekibi sandbox ile satın alır), onaydan sonra kapat.
7. Xcode: Runner hedefinde **In-App Purchase** yeteneği (Signing & Capabilities → + Capability). StoreKit için ek Info.plist anahtarı gerekmez.

### Ortam değişkenleri (API)

| Değişken | Varsayılan | Açıklama |
|---|---|---|
| `PURCHASE_VERIFY_MODE` | `store` | `store` mağaza API'si; `fake` yalnızca production dışında (`test:` token'ları). |
| `PAYWALL_ENABLED` | `true` | Ücret kilidi; `false` production'da yasak (e2e testleri içindir). |
| `GOOGLE_PLAY_SERVICE_ACCOUNT` | — | Play doğrulama servis hesabı JSON'u (düz ya da base64). Yoksa Android satın almaları 503. |
| `GOOGLE_PLAY_PACKAGE` | `com.monolithyazilim.mudafaa` | Paket adı. |
| `GOOGLE_ALLOW_TEST_PURCHASES` | `false` | Production'da lisans test kullanıcısı satın almalarını kabul et. |
| `GOOGLE_RTDN_AUDIENCE` | — | RTDN push aboneliğinin OIDC audience'ı. |
| `GOOGLE_RTDN_SERVICE_ACCOUNT` | — | Push aboneliğinin servis hesabı e-postası; audience varken zorunlu. |
| `APPLE_ISSUER_ID`, `APPLE_KEY_ID` | — | In-App Purchase anahtarı. Yoksa iOS satın almaları 503. |
| `APPLE_PRIVATE_KEY` | — | `.p8` içeriğinin base64'ü (düz PEM de kabul edilir). |
| `APPLE_BUNDLE_ID` | `com.monolithyazilim.mudafaa` | Bundle kimliği. |
| `APPLE_APP_ID` | — | Sayısal Apple Kimliği; production JWS doğrulaması için gerekir. |
| `APPLE_ALLOW_SANDBOX` | `false` | Production'da sandbox satın alma ve bildirimlerini kabul et (App Review). |

Örnek: `apps/api/production.env.example`.
