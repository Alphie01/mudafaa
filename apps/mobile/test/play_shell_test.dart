import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mudafaa/design_system/backdrops/backdrop_view.dart';
import 'package:mudafaa/design_system/motion/retro_motion.dart';
import 'package:mudafaa/features/play/common.dart';
import 'package:mudafaa/features/play/dialogue/dialogue_player.dart';
import 'package:mudafaa/features/play/nodes/scene_image.dart';
import 'package:mudafaa/features/play/play_shell.dart';
import 'package:mudafaa/features/play/session_controller.dart';

import 'helpers.dart';

/// Görünümü dışarıdan değiştirilebilen kabuk.
class Host {
  Host(Map<String, dynamic> view) : view = ValueNotifier(view);
  final ValueNotifier<Map<String, dynamic>> view;
  final memory = PlayMemory();
  final actions = <Map<String, dynamic>>[];

  Widget build() => ValueListenableBuilder(
        valueListenable: view,
        builder: (_, v, _) => PlayShell(view: v, memory: memory, dispatch: (a) async => actions.add(a)),
      );
}

Future<void> skipCards(WidgetTester tester) async {
  for (var i = 0; i < 6; i++) {
    final chapter = find.byKey(const ValueKey('chapter-card'));
    final fx = find.byWidgetPredicate((w) => w.key is ValueKey<String> && (w.key! as ValueKey<String>).value.startsWith('fx-'));
    if (chapter.evaluate().isNotEmpty) {
      await tester.tap(chapter);
    } else if (fx.evaluate().isNotEmpty) {
      await tester.tap(fx.first);
    } else {
      return;
    }
    await tester.pump();
    await tester.pump();
  }
}

void main() {
  testWidgets('seçenekler satırlar bitene kadar gizli; aynı sürüm yeniden çizilince satırlar tekrar oynamaz', (tester) async {
    final cold = steps('cold_open');
    final host = Host(cold[0]);
    await tester.pumpWidget(harness(host.build(), motion: RetroMotion.reduced));
    await tester.pump();
    await tester.pump();
    expect(find.byKey(const ValueKey('chapter-card')), findsOneWidget, reason: 'header.chapter bölüm kartını açar');
    expect(find.text('BÖLÜM 1 · GECE'), findsNothing);
    await skipCards(tester);

    expect(find.byType(DialoguePlayer), findsOneWidget);
    expect(find.text('Dosyayı aç'), findsNothing, reason: 'satırlar sürerken seçenek yok');

    await tester.tap(find.text('ATLA ››'));
    await tester.pump();
    expect(find.byType(DialoguePlayer), findsNothing);
    expect(find.text('Dosyayı aç'), findsOneWidget);
    expect(find.byKey(const ValueKey('last-line')), findsOneWidget, reason: 'son satır seçeneklerin üstünde kalır');

    // Aynı stateVersion'un yeni bir kopyası (ör. 409 sonrası yenileme): tekrar oynamaz.
    host.view.value = {...cold[0]};
    await tester.pump();
    await tester.pump();
    expect(find.byType(DialoguePlayer), findsNothing);
    expect(find.text('Dosyayı aç'), findsOneWidget);
    expect(host.memory.played, contains(1));
    expect(host.memory.history.length, ms(cold[0]['lines']).length);
    await tester.pump(const Duration(seconds: 1));
  });

  testWidgets('node değişince perde, YENİ KİŞİLER kartı, sonra yanıt + giriş satırları', (tester) async {
    final cold = steps('cold_open');
    final host = Host(cold[0]);
    host.memory.played.add(1);
    await tester.pumpWidget(harness(host.build(), motion: RetroMotion.full));
    await tester.pump();
    host.view.value = cold[1];
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 16));
    await tester.pump(const Duration(milliseconds: 60));
    expect(find.byKey(const ValueKey('curtain')), findsOneWidget);
    await tester.pump(const Duration(milliseconds: 300));
    await skipCards(tester);
    expect(find.byType(DialoguePlayer), findsOneWidget);
    // last.lines (1) + view.lines (2)
    expect(find.text('1/3'), findsOneWidget);
    await tester.tap(find.text('ATLA ››'));
    await tester.pump();
    expect(find.text('O gece'), findsOneWidget);

    // Aynı node'da aksiyon: yalnızca yanıt satırları; YENİ DELİL kartı önce.
    host.view.value = cold[2];
    await tester.pump();
    await tester.pump();
    expect(find.byKey(const ValueKey('fx-evidence')), findsOneWidget);
    await tester.pump(const Duration(seconds: 3));
    await tester.pump();
    expect(find.text('1/3'), findsOneWidget);
    await tester.tap(find.text('ATLA ››'));
    await tester.pump(const Duration(seconds: 4));
  });

  testWidgets('SCENE: geri bildirim görseli itmez; etiket ayrı rozet, metne eklenmez', (tester) async {
    final sc = steps('scene');
    final host = Host(sc[0]);
    await tester.pumpWidget(harness(host.build(), motion: RetroMotion.reduced));
    await tester.pump();
    final before = tester.getRect(find.byType(SceneImage));

    host.view.value = sc[1];
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    expect(tester.getRect(find.byType(SceneImage)), before, reason: 'görsel yerinde kalır');
    expect(find.byKey(const ValueKey('feedback-tag')), findsOneWidget);
    expect(find.text('−10 SKOR'), findsWidgets);
    expect(find.textContaining('— −10'), findsNothing);
    expect(find.text('Burada dikkat çeken bir şey yok. (−1 büyüteç)'), findsOneWidget);

    host.view.value = sc[2];
    await tester.pump();
    await tester.pump();
    expect(find.byKey(const ValueKey('fx-evidence')), findsOneWidget, reason: 'bulunan ipucu kartla gelir');
    await tester.pump(const Duration(seconds: 3));
    await tester.pump();
    expect(tester.getRect(find.byType(SceneImage)), before);
    await tester.pump(const Duration(seconds: 4));
  });

  testWidgets('hub: giriş satırları durum kutusu, VN oynatılmaz; birincil düğme altta', (tester) async {
    final hub = steps('hub');
    final host = Host(hub[0]);
    await tester.pumpWidget(harness(host.build(), motion: RetroMotion.reduced));
    await tester.pump();
    await tester.pump();
    expect(find.byType(DialoguePlayer), findsNothing);
    expect(find.byKey(const ValueKey('hub-status')), findsOneWidget);
    expect(find.byKey(const ValueKey('primary-cta')), findsOneWidget);
    expect(find.text('DURUŞMAYA GİT'), findsOneWidget, reason: 'birincil seçenek listede tekrar etmez');

    host.view.value = hub[1];
    await tester.pump();
    await tester.pump();
    await skipCards(tester);
    expect(find.byType(DialoguePlayer), findsOneWidget, reason: 'aksiyondan gelen last.lines oynar');
    await tester.tap(find.text('ATLA ››'));
    await tester.pump(const Duration(seconds: 4));
  });

  testWidgets('karar: damga ve sayaç, ardından epilog; sonra döküm erişilebilir', (tester) async {
    final v = steps('verdict');
    final host = Host(v[0]);
    await tester.pumpWidget(harness(host.build(), motion: RetroMotion.reduced));
    await tester.pump();
    await tester.pump();
    // Önce last.lines (hâkim).
    expect(find.byType(DialoguePlayer), findsOneWidget);
    await tester.tap(find.text('ATLA ››'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 16));
    await tester.pump(const Duration(milliseconds: 900));
    final mid = int.parse(tester.widget<Text>(find.byKey(const ValueKey('result-total'))).data!);
    expect(mid, inExclusiveRange(0, 2400), reason: 'skor sayarak yükselir');
    await tester.pump(const Duration(milliseconds: 1200));
    await tester.pump();
    expect(find.byType(DialoguePlayer), findsOneWidget, reason: 'epilog oynar');
    expect(find.byKey(const ValueKey('card-line')), findsOneWidget);
    await tester.tap(find.text('ATLA ››'));
    await tester.pump();
    expect(find.byType(DialoguePlayer), findsNothing);
    expect(tester.widget<Text>(find.byKey(const ValueKey('result-total'))).data, '2400');
    expect(host.memory.epilogueDone, contains(40));
    await tester.pump(const Duration(seconds: 1));
  });

  testWidgets('her arka plan hatasız çizilir', (tester) async {
    for (final b in backdropNames) {
      await tester.pumpWidget(harness(SizedBox(width: 390, height: 700, child: BackdropView(name: b))));
      expect(tester.takeException(), isNull, reason: b);
    }
  });

  testWidgets('FeedbackBanner etiketi rozet olarak gösterir', (tester) async {
    await tester.pumpWidget(harness(const Scaffold(body: FeedbackBanner(feedback: {'text': 'Iska.', 'label': '−10 SKOR', 'tone': 'error'}))));
    expect(find.text('Iska.'), findsOneWidget);
    expect(find.text('−10 SKOR'), findsOneWidget);
  });
}
