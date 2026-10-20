import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mudafaa/design_system/motion/retro_motion.dart';
import 'package:mudafaa/features/play/common.dart';
import 'package:mudafaa/features/play/dialogue/dialogue_player.dart';
import 'package:mudafaa/features/play/dialogue/portrait.dart';

import 'helpers.dart';

/// Daktilo metninde şu an görünen (saydam olmayan) kısım.
String visibleText(WidgetTester tester) {
  final rich = tester.widget<Text>(find.byKey(const ValueKey('typed'))).textSpan! as TextSpan;
  return (rich.children!.first as TextSpan).text ?? '';
}

void main() {
  final cold = steps('cold_open').first;
  final cast = m(cold['cast']);
  final lines = ms(cold['lines']);

  Future<void> pumpPlayer(WidgetTester tester, List<Map<String, dynamic>> ls, {VoidCallback? onDone, RetroMotion motion = RetroMotion.reduced, bool accessible = false, List<int>? started}) async {
    await tester.pumpWidget(harness(
      Scaffold(body: DialoguePlayer(key: UniqueKey(), lines: ls, cast: cast, onDone: onDone ?? () {}, onLine: (i, _) => started?.add(i))),
      motion: motion,
      accessible: accessible,
    ));
    await tester.pump();
  }

  testWidgets('daktilo ~35 harf/sn yazar; dokunuş satırı tamamlar, sonraki dokunuş ilerletir', (tester) async {
    final ls = [lines[1], lines[7]]; // anlatıcı, ardından karakter
    final started = <int>[];
    await pumpPlayer(tester, ls, started: started);
    final full = ls[0]['text'] as String;
    expect(visibleText(tester), isEmpty);

    await tester.pump(const Duration(milliseconds: 400)); // ~14 harf
    final partial = visibleText(tester);
    expect(partial.length, inInclusiveRange(10, 18));
    expect(full.startsWith(partial), isTrue);

    await tester.tap(find.byKey(const ValueKey('dialogue-tap')));
    await tester.pump();
    expect(visibleText(tester), full, reason: 'ilk dokunuş satırı tamamlar');
    expect(find.text('1/2'), findsOneWidget);

    await tester.tap(find.byKey(const ValueKey('dialogue-tap')));
    await tester.pump();
    expect(find.text('2/2'), findsOneWidget, reason: 'ikinci dokunuş ilerletir');
    expect(visibleText(tester), isEmpty);
    expect(find.text('ECE'), findsOneWidget, reason: 'ad plakası kadrodan');
    expect(started, [0, 1]);
  });

  testWidgets('son satırdan sonra onDone; ATLA hepsini geçer', (tester) async {
    var done = 0;
    await pumpPlayer(tester, [lines[1], lines[2]], onDone: () => done++);
    await tester.tap(find.text('ATLA ››'));
    await tester.pump();
    expect(done, 1);

    done = 0;
    await pumpPlayer(tester, [lines[1]], onDone: () => done++, motion: RetroMotion.off);
    expect(visibleText(tester), lines[1]['text'], reason: 'hareket kapalıyken metin anında gelir');
    await tester.tap(find.byKey(const ValueKey('dialogue-tap')));
    await tester.pump();
    expect(done, 1);
  });

  testWidgets('isimsiz ses: siluet portre ve "BİR SES" plakası; karakter sprite\'ı yok', (tester) async {
    final phone = lines[2];
    expect(phone['name'], 'Bir ses');
    await pumpPlayer(tester, [phone]);
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.byType(Silhouette), findsOneWidget);
    expect(find.textContaining('BİR SES'), findsOneWidget);
  });

  testWidgets('kart satırı tam ekran başlık kartı olarak çizilir', (tester) async {
    await pumpPlayer(tester, [lines[0]]);
    expect(find.byKey(const ValueKey('card-line')), findsOneWidget);
  });

  testWidgets('ekran okuyucu tam metni hemen alır', (tester) async {
    final handle = tester.ensureSemantics();
    await pumpPlayer(tester, [lines[7]]);
    expect(visibleText(tester), isEmpty, reason: 'görsel olarak daktilo daha başlamadı');
    expect(find.bySemanticsLabel(RegExp(lines[7]['text'] as String)), findsOneWidget);
    handle.dispose();

    await pumpPlayer(tester, [lines[7]], accessible: true);
    expect(visibleText(tester), lines[7]['text'], reason: 'erişilebilir gezinmede daktilo atlanır');
  });

  testWidgets('GEÇMİŞ önceki satırları kaydırılabilir listede açar', (tester) async {
    await pumpPlayer(tester, [lines[7], lines[8]]);
    await tester.tap(find.byKey(const ValueKey('dialogue-tap')));
    await tester.pump();
    await tester.tap(find.byKey(const ValueKey('dialogue-tap')));
    await tester.pump();
    await tester.tap(find.text('GEÇMİŞ'));
    await tester.pump(const Duration(milliseconds: 400));
    expect(find.byKey(const ValueKey('line-log')), findsOneWidget);
    final log = find.byKey(const ValueKey('line-log'));
    expect(find.descendant(of: log, matching: find.text(lines[7]['text'] as String)), findsOneWidget);
    expect(find.descendant(of: log, matching: find.text(lines[8]['text'] as String)), findsOneWidget);
  });
}
