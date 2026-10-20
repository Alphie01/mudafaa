import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:in_app_purchase_android/in_app_purchase_android.dart';

import 'api.dart';
import 'providers.dart';

/// Mağaza ürün kimlikleri (docs/iap.md; Play Console ve App Store Connect'te aynı).
abstract final class Products {
  static const caseUnlock = 'dava_kilidi';
  static const premium = 'premium_aylik';
  static const all = {caseUnlock, premium};
}

/// Mağaza fiyatı gelmezse gösterilen yedek fiyatlar.
const fallbackCasePrice = '10 ₺';
const fallbackPremiumPrice = '50 ₺';

/// Başlık/düğme yazı tipinde (Jersey 10) ₺ glifi yoktur: piksel yazıda fiyat "TL" ile yazılır.
String pixelPrice(String price) => price.contains('₺') ? '${price.replaceAll('₺', '').trim()} TL' : price;

/// Mağaza durumu: kullanılabilirlik, ürün fiyatları, süren işlem ve kullanıcıya gösterilecek son mesaj.
@immutable
class StoreState {
  const StoreState({this.available = false, this.loading = true, this.prices = const {}, this.busy = false, this.message, this.messageSeq = 0});

  /// Mağaza bu cihazda kullanılabilir mi (web, Play/App Store hesabı olmayan emülatör: hayır).
  final bool available;
  final bool loading;

  /// Ürün kimliği → mağazanın yerelleştirilmiş fiyatı (ör. "₺10,00").
  final Map<String, String> prices;

  /// Satın alma sürüyor (ödeme ekranı açık ya da makbuz sunucuda doğrulanıyor).
  final bool busy;
  final String? message;

  /// Aynı mesajın tekrarı da gösterilsin diye artan sayaç.
  final int messageSeq;

  String get casePrice => prices[Products.caseUnlock] ?? fallbackCasePrice;
  String get premiumPrice => prices[Products.premium] ?? fallbackPremiumPrice;

  StoreState copyWith({bool? available, bool? loading, Map<String, String>? prices, bool? busy, String? message}) => StoreState(
        available: available ?? this.available,
        loading: loading ?? this.loading,
        prices: prices ?? this.prices,
        busy: busy ?? this.busy,
        message: message ?? this.message,
        messageSeq: message == null ? messageSeq : messageSeq + 1,
      );
}

/// Uygulama içi satın alma (Google Play Billing / App Store; aracı servis yok). Mağazanın verdiği makbuz
/// `POST /purchases` ile sunucuda doğrulanır; satın alma ancak sunucu kabul ettikten sonra tamamlanır (Android
/// tüketilebilir ürün: consume, iOS: finishTransaction). Tamamlanmamış satın almalar açılışta yeniden gönderilir.
class StoreController extends Notifier<StoreState> {
  static const _pendingCaseKey = 'iap.pendingCaseId';
  final _storage = const FlutterSecureStorage();
  final _details = <String, ProductDetails>{};
  StreamSubscription<List<PurchaseDetails>>? _sub;

  /// Web'de eklenti yoktur; mağazaya hiç dokunulmaz.
  bool get _supported => !kIsWeb && (defaultTargetPlatform == TargetPlatform.android || defaultTargetPlatform == TargetPlatform.iOS);
  bool get _android => defaultTargetPlatform == TargetPlatform.android;

  @override
  StoreState build() {
    ref.onDispose(() => _sub?.cancel());
    if (!_supported) return const StoreState(loading: false);
    Future.microtask(_init);
    return const StoreState();
  }

  Future<void> _init() async {
    final iap = InAppPurchase.instance;
    // Akış önce dinlenir: iOS bitirilmemiş işlemleri dinleyici bağlanınca yeniden teslim eder.
    _sub = iap.purchaseStream.listen(_onPurchases, onError: (Object e) => _say('Mağaza hatası: $e'));
    final available = await iap.isAvailable();
    if (!available) {
      state = state.copyWith(available: false, loading: false);
      return;
    }
    final res = await iap.queryProductDetails(Products.all);
    for (final d in res.productDetails) {
      // Android aboneliğinde her teklif ayrı kayıttır; ilk gelen (temel plan) kullanılır.
      _details.putIfAbsent(d.id, () => d);
    }
    state = state.copyWith(available: true, loading: false, prices: {for (final d in _details.values) d.id: d.price});
    // Android tamamlanmamış satın almaları akışa kendisi koymaz: tüketilmemiş/onaylanmamış olanlar sorulur.
    if (_android) {
      try {
        await iap.restorePurchases();
      } on Object catch (e) {
        debugPrint('Bekleyen satın almalar sorgulanamadı: $e');
      }
    }
  }

  void _say(String message, {bool busy = false}) => state = state.copyWith(message: message, busy: busy);

  /// Kilitli dava için `dava_kilidi` satın alımı başlatır.
  Future<void> buyCase(String caseId) async {
    final d = _details[Products.caseUnlock];
    if (!state.available || d == null) return _say('Mağaza şu anda kullanılamıyor.');
    await _storage.write(key: _pendingCaseKey, value: caseId);
    state = state.copyWith(busy: true);
    try {
      // iOS tüketimi kendisi yönetir (autoConsume zorunlu); Android'de tüketim sunucu onayından sonra yapılır.
      await InAppPurchase.instance.buyConsumable(purchaseParam: PurchaseParam(productDetails: d), autoConsume: !_android);
    } on Object catch (e) {
      _say('Satın alma başlatılamadı: $e');
    }
  }

  /// `premium_aylik` aboneliğini başlatır.
  Future<void> buyPremium() async {
    final d = _details[Products.premium];
    if (!state.available || d == null) return _say('Mağaza şu anda kullanılamıyor.');
    state = state.copyWith(busy: true);
    try {
      await InAppPurchase.instance.buyNonConsumable(purchaseParam: PurchaseParam(productDetails: d));
    } on Object catch (e) {
      _say('Abonelik başlatılamadı: $e');
    }
  }

  /// "Satın alımları geri yükle": abonelik mağazadan yeniden okunur ve sunucuda doğrulanır.
  Future<void> restore() async {
    if (!state.available) return _say('Mağaza şu anda kullanılamıyor.');
    state = state.copyWith(busy: true);
    try {
      await InAppPurchase.instance.restorePurchases();
      _say('Satın alımlar mağazadan istendi.');
    } on Object catch (e) {
      _say('Geri yükleme başarısız: $e');
    }
  }

  /// Premium ile bu dönemin seçim hakkından dava açar.
  Future<bool> premiumPick(String caseId) async {
    try {
      await ref.read(apiProvider).post('/me/premium-picks', {'caseId': caseId});
      _refresh();
      _say('Dava premium ile açıldı.');
      return true;
    } on ApiException catch (e) {
      _say(e.message);
      return false;
    }
  }

  void _refresh() {
    ref.invalidate(meProvider);
    ref.invalidate(casesProvider);
  }

  Future<void> _onPurchases(List<PurchaseDetails> purchases) async {
    for (final p in purchases) {
      switch (p.status) {
        case PurchaseStatus.pending:
          _say('Ödeme onay bekliyor…', busy: true);
        case PurchaseStatus.canceled:
          if (p.pendingCompletePurchase) await InAppPurchase.instance.completePurchase(p);
          state = state.copyWith(busy: false);
        case PurchaseStatus.error:
          if (p.pendingCompletePurchase) await InAppPurchase.instance.completePurchase(p);
          _say('Ödeme tamamlanamadı: ${p.error?.message ?? 'bilinmeyen hata'}');
        case PurchaseStatus.purchased || PurchaseStatus.restored:
          await _deliver(p);
      }
    }
  }

  /// Makbuzu sunucuya gönderir; sunucu kabul ederse (ya da makbuzu kesin reddederse) satın almayı tamamlar.
  /// Ağ ya da sunucu hatasında satın alma bekletilir ve sonraki açılışta yeniden gönderilir.
  Future<void> _deliver(PurchaseDetails p) async {
    final consumable = p.productID == Products.caseUnlock;
    String? caseId;
    if (consumable) {
      caseId = await _storage.read(key: _pendingCaseKey);
      if (caseId == null) {
        // Hangi dava için alındığı bilinmiyor: tüketilmez, hak kaybolmaz (destek ile çözülür).
        return _say('Bekleyen bir dava satın alması var; destekle iletişime geçin.');
      }
    }
    final token = _android ? p.verificationData.serverVerificationData : (p.purchaseID ?? '');
    try {
      await ref.read(apiProvider).post('/purchases', {
        'platform': _android ? 'ANDROID' : 'IOS',
        'productId': p.productID,
        'token': token,
        'caseId': ?caseId,
      });
    } on ApiException catch (e) {
      if (e.isNetwork) return _say('Satın alma doğrulanamadı; bağlantı gelince yeniden denenecek.');
      // Kesin ret (geçersiz makbuz) mağazada sonsuza dek beklemesin; başka hesaba ait tüketilebilir ürün tüketilmez.
      if (!(consumable && e.code == 'purchase_token_in_use')) await _finish(p, consume: false);
      return _say(e.message);
    }
    await _finish(p, consume: consumable);
    if (consumable) await _storage.delete(key: _pendingCaseKey);
    _refresh();
    _say(consumable ? 'Dava dosyası açıldı.' : (p.status == PurchaseStatus.restored ? 'Premium geri yüklendi.' : 'Premium etkin. Teşekkürler!'));
  }

  Future<void> _finish(PurchaseDetails p, {required bool consume}) async {
    if (_android && consume) {
      await InAppPurchase.instance.getPlatformAddition<InAppPurchaseAndroidPlatformAddition>().consumePurchase(p);
      return;
    }
    if (p.pendingCompletePurchase) await InAppPurchase.instance.completePurchase(p);
  }
}

final storeProvider = NotifierProvider<StoreController, StoreState>(StoreController.new);
