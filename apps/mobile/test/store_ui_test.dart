import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mudafaa/data/providers.dart';
import 'package:mudafaa/data/store.dart';
import 'package:mudafaa/design_system/widgets/px_box.dart';
import 'package:mudafaa/features/cases/cases_screen.dart';
import 'package:mudafaa/features/cases/unlock_sheet.dart';
import 'package:mudafaa/features/premium/premium_screen.dart';

import 'helpers.dart';

/// Mağazaya dokunmayan, durumu sabit sahte denetleyici.
class FakeStore extends StoreController {
  FakeStore(this.initial);
  final StoreState initial;
  final bought = <String>[];

  @override
  StoreState build() => initial;

  @override
  Future<void> buyCase(String caseId) async => bought.add(caseId);

  @override
  Future<void> buyPremium() async => bought.add(Products.premium);
}

const available = StoreState(available: true, loading: false, prices: {Products.caseUnlock: '₺9,99', Products.premium: '₺49,99'});
const unavailable = StoreState(available: false, loading: false);

Map<String, dynamic> me({bool active = false, int picksLeft = 0}) => {
      'user': {'displayName': 'Deniz', 'isAnonymous': false},
      'premium': {'active': active, 'expiresAt': active ? '2026-11-20T12:00:00.000Z' : null, 'picksLeft': picksLeft},
      'adFree': active,
    };

Map<String, dynamic> card({String access = 'PAID_LOCKED', String status = 'NEW'}) => {
      'id': 'c1',
      'number': 3,
      'title': 'Liman Gecesi',
      'crimeLabel': 'Hırsızlık',
      'lawRef': 'TCK 141',
      'possibleSentence': '1–3 yıl',
      'estimatedMinutes': 20,
      'difficulty': 2,
      'status': status,
      'access': access,
      'cover': {
        'sprite': {'rows': List.filled(20, '................')},
      },
    };

Widget app(Widget child, {StoreState store = available, Map<String, dynamic>? meBody, FakeStore? fake}) {
  // Her çağrı yeni kapsam: aynı testte farklı geçersiz kılmalar eski kapsamı yeniden kullanmasın.
  return ProviderScope(
    key: UniqueKey(),
    overrides: [
      storeProvider.overrideWith(() => fake ?? FakeStore(store)),
      meProvider.overrideWith((ref) async => meBody ?? me()),
    ],
    child: harness(Scaffold(body: child)),
  );
}

PxButton button(WidgetTester tester, String key) => tester.widget<PxButton>(find.byKey(ValueKey(key)));

void main() {
  group('dava kartı', () {
    testWidgets('ücretli ve kilitli kart mağaza fiyatını ve kilit açma düğmesini gösterir', (tester) async {
      Map<String, dynamic>? unlocked;
      await tester.pumpWidget(harness(Scaffold(
        body: CaseCardView(card: card(), casePrice: '₺9,99', onOpen: (_, {restart = false}) async {}, onUnlock: (c) => unlocked = c),
      )));
      // Başlık yazı tipinde ₺ yok: piksel yazıda "TL".
      expect(find.text('9,99 TL'), findsOneWidget);
      expect(find.text('KİLİDİ AÇ · 9,99 TL'), findsOneWidget);
      expect(find.text('DAVAYI AÇ'), findsNothing);
      await tester.tap(find.byKey(const ValueKey('unlock-c1')));
      await tester.pump(const Duration(milliseconds: 100));
      expect(unlocked?['id'], 'c1');
    });

    testWidgets('yedek fiyat 10 ₺ piksel yazıda 10 TL olur', (tester) async {
      await tester.pumpWidget(harness(Scaffold(body: CaseCardView(card: card(), onOpen: (_, {restart = false}) async {}, onUnlock: (_) {}))));
      expect(fallbackCasePrice, '10 ₺');
      expect(find.text('KİLİDİ AÇ · 10 TL'), findsOneWidget);
    });

    testWidgets('ücretsiz ve açılmış kartlar oynanabilir', (tester) async {
      for (final (access, label) in const [('FREE', 'ÜCRETSİZ'), ('OWNED', 'AÇILDI')]) {
        await tester.pumpWidget(harness(Scaffold(body: CaseCardView(card: card(access: access), onOpen: (_, {restart = false}) async {}, onUnlock: (_) {}))));
        expect(find.text(label), findsOneWidget);
        expect(find.text('DAVAYI AÇ'), findsOneWidget);
        expect(find.byKey(const ValueKey('unlock-c1')), findsNothing);
      }
    });
  });

  group('kilit açma sayfası', () {
    testWidgets('premium etkin ve hak varsa PREMİUM İLE AÇ (x/3) görünür; SATIN AL dava kilidini başlatır', (tester) async {
      final fake = FakeStore(available);
      await tester.pumpWidget(app(UnlockSheet(card: card()), fake: fake, meBody: me(active: true, picksLeft: 2)));
      await tester.pump();
      expect(find.text('SATIN AL · 9,99 TL'), findsOneWidget);
      expect(find.text('PREMİUM İLE AÇ (2/3)'), findsOneWidget);
      expect(button(tester, 'unlock-buy').onTap, isNotNull);
      await tester.tap(find.byKey(const ValueKey('unlock-buy')));
      await tester.pump(const Duration(milliseconds: 100));
      expect(fake.bought, ['c1']);
    });

    testWidgets('premium yoksa premium sayfasına yönlendirir; hak bittiyse bunu söyler', (tester) async {
      await tester.pumpWidget(app(UnlockSheet(card: card())));
      await tester.pump();
      expect(find.byKey(const ValueKey('unlock-premium')), findsNothing);
      expect(find.byKey(const ValueKey('unlock-go-premium')), findsOneWidget);

      await tester.pumpWidget(app(UnlockSheet(card: card()), meBody: me(active: true, picksLeft: 0)));
      await tester.pump();
      expect(find.byKey(const ValueKey('unlock-premium')), findsNothing);
      expect(find.text('Bu dönemki premium seçim hakların bitti.'), findsOneWidget);
    });

    testWidgets('mağaza yoksa (web / emülatör) SATIN AL pasif, kısa not ve yedek fiyat', (tester) async {
      await tester.pumpWidget(app(UnlockSheet(card: card()), store: unavailable));
      await tester.pump();
      expect(button(tester, 'unlock-buy').onTap, isNull);
      expect(find.text('SATIN AL · 10 TL'), findsOneWidget);
      expect(find.byKey(const ValueKey('store-unavailable')), findsOneWidget);
    });
  });

  group('premium ekranı', () {
    testWidgets('abone değilken ABONE OL mağaza fiyatıyla etkin', (tester) async {
      final fake = FakeStore(available);
      await tester.pumpWidget(app(const PremiumScreen(), fake: fake));
      await tester.pump();
      expect(find.text('PREMİUM DEĞİLSİN'), findsOneWidget);
      expect(find.text('ABONE OL · 49,99 TL/AY'), findsOneWidget);
      expect(button(tester, 'premium-restore').onTap, isNotNull);
      await tester.tap(find.byKey(const ValueKey('premium-subscribe')));
      await tester.pump(const Duration(milliseconds: 100));
      expect(fake.bought, [Products.premium]);
    });

    testWidgets('abonelik etkinken bitiş tarihi ve kalan seçim hakkı', (tester) async {
      await tester.pumpWidget(app(const PremiumScreen(), meBody: me(active: true, picksLeft: 2)));
      await tester.pump();
      expect(find.text('PREMİUM ETKİN'), findsOneWidget);
      expect(find.text('Bu dönem kalan dava seçimi: 2/3'), findsOneWidget);
      expect(find.textContaining('Dönem sonu: '), findsOneWidget);
      expect(button(tester, 'premium-subscribe').onTap, isNull);
    });

    testWidgets('mağaza yoksa düğmeler pasif ve not görünür', (tester) async {
      await tester.pumpWidget(app(const PremiumScreen(), store: unavailable));
      await tester.pump();
      expect(find.text('ABONE OL · 50 TL/AY'), findsOneWidget);
      expect(button(tester, 'premium-subscribe').onTap, isNull);
      expect(button(tester, 'premium-restore').onTap, isNull);
      expect(find.byKey(const ValueKey('store-unavailable')), findsOneWidget);
    });
  });
}
