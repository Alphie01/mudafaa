import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/providers.dart';
import '../../design_system/tokens/px_colors.dart';
import '../../design_system/tokens/px_text.dart';
import '../../design_system/widgets/px_box.dart';
import '../../design_system/widgets/states.dart';
import '../play/common.dart';

/// Dava sonu raporu: iyi/kötü hamleler, kaçırılanlar, alternatif yollar ve beceri tavsiyeleri.
class ResultScreen extends ConsumerWidget {
  const ResultScreen({super.key, required this.sessionId});
  final String sessionId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final r = ref.watch(reportProvider(sessionId));
    return Scaffold(
      body: SafeArea(
        child: Column(children: [
          PxHeader(eyebrow: 'Dava raporu', title: 'Değerlendirme', onBack: () => context.pop()),
          Expanded(
            child: r.when(
              loading: () => const LoadingView(),
              error: (e, _) => ErrorView(message: '$e', onRetry: () => ref.invalidate(reportProvider(sessionId))),
              data: (d) {
                Widget section(String title, List<Widget> items) => Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [Text(title, style: PxText.eyebrow), const SizedBox(height: 6), ...items]),
                    );
                Widget item(String text, Color color) => Padding(padding: const EdgeInsets.only(bottom: 6), child: PxBox(color: color, child: Text(text, style: PxText.body(19))));
                return ListView(padding: const EdgeInsets.fromLTRB(16, 14, 20, 30), children: [
                  section('İYİ HAMLELER', [for (final g in ms(d['good'])) item(g['feedback'] as String, PxColors.green)]),
                  section('HATALAR', [for (final b in ms(d['bad'])) item(b['feedback'] as String, PxColors.red)]),
                  section('KAÇIRDIKLARIN', [for (final x in ms(d['missed'])) item(x['text'] as String, PxColors.panelHi)]),
                  section('BECERİLER', [
                    for (final s in ms(d['skills']))
                      Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: PxBox(
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Row(children: [Expanded(child: Text(s['label'] as String, style: PxText.pixel(13, color: PxColors.gold))), Text('${s['earned']} / ${s['max']}', style: PxText.body(18))]),
                            Text(s['advice'] as String, style: PxText.body(18, color: PxColors.muted)),
                          ]),
                        ),
                      ),
                  ]),
                  section('ULAŞILMAYAN SONUÇLAR', [for (final a in ms(d['alternatives'])) item(a['howToReach'] as String, PxColors.panel)]),
                  PxButton(label: 'Ana menü', onTap: () => context.go('/')),
                ]);
              },
            ),
          ),
        ]),
      ),
    );
  }
}
