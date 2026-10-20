# Uygulama içi satın alma (IAP): tasarım

Ödemeler yalnızca **Google Play Billing** ve **App Store** üzerinden alınır; aracı servis (RevenueCat vb.) kullanılmaz. Hak (entitlement) sunucuda, kullanıcı hesabına bağlı tutulur. İstemci mağaza makbuzunu sunucuya gönderir, sunucu bunu mağazanın sunucu API'siyle doğrular. Sunucu istemcinin "satın aldım" demesine asla güvenmez.

## Ürünler

| Ürün kimliği | Tür (Play / App Store) | Fiyat | Ne verir |
|---|---|---|---|
| `dava_kilidi` | Tüketilebilir uygulama içi ürün / Consumable | 10 TL | Satın alma ekranının açıldığı tek bir ücretli davanın kalıcı kilidini açar. |
| `premium_aylik` | Abonelik / Auto-renewable subscription | 50 TL / ay | Abonelik süresince reklamsız kullanım (`adFree`) ve **her fatura döneminde 3 dava seçme hakkı**. |

**Ücretsiz davalar:** #01 ve #02 (`meta.number` 1 ve 2). Diğer tüm davalar ücretlidir. Dava kartının rütbe kilidi ayrıca geçerli kalır.

Premium için verilmiş kararlar:

- Seçilen davalar abonelik bitse bile kalıcı olarak kullanıcının kalır.
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

## API değişiklikleri

- `GET /v1/cases`: kartlara `access: 'FREE' | 'OWNED' | 'PAID_LOCKED'` alanı eklenir. Mevcut rütbe kilidi aynen kalır.
- `POST /v1/cases/:id/start`: sahiplik yoksa `403 case_not_owned` döner.
- `GET /v1/me`: `premium` ve `adFree` alanları eklenir.
- Yeni uçlar: `POST /v1/purchases` ve `POST /v1/me/premium-picks`.
- Prisma'ya yeni tablolar:
  - `purchases`: platform, ürün, benzersiz token, kullanıcı, dava, durum, ham doğrulama yanıtı.
  - `case_entitlements`: kullanıcı + dava benzersiz; kaynak PURCHASE / PREMIUM_PICK / GRANT.
  - `subscriptions`: kullanıcı, platform, orijinal işlem / token, bitiş tarihi, dönem başına kullanılan seçim sayısı.
