import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../design_system/tokens/px_colors.dart';
import '../../../design_system/tokens/px_text.dart';
import '../../../design_system/widgets/px_box.dart';
import '../common.dart';

/// Genel A–D seçimi ve delil kartı + A–D inceleme.
class ChoiceNode extends StatelessWidget {
  const ChoiceNode({super.key, required this.view, required this.dispatch, required this.busy});
  final Map<String, dynamic> view;
  final Dispatch dispatch;
  final bool busy;
  @override
  Widget build(BuildContext context) {
    final node = m(view['node']);
    final prompt = node['prompt'] == null ? null : m(node['prompt']);
    final evidence = node['evidence'] == null ? null : m(node['evidence']);
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      if (evidence != null) ...[EvidenceCardView(card: evidence), const SizedBox(height: 6), if (evidence['description'] != null) Text(evidence['description'] as String, style: PxText.body(19, color: PxColors.muted)), const SizedBox(height: 12)],
      if (prompt != null) ...[SpeechLines(lines: [prompt], cast: m(view['cast'])), const SizedBox(height: 4)],
      ChoiceList(choices: ms(view['choices']), dispatch: dispatch, busy: busy),
    ]);
  }
}

/// Karar ekranı: damga, ceza, hüküm metni, skor dökümü, eşik çubuğu ve XP.
class ResultNode extends StatelessWidget {
  const ResultNode({super.key, required this.view});
  final Map<String, dynamic> view;
  @override
  Widget build(BuildContext context) {
    final node = m(view['node']);
    final outcome = m(node['outcome']);
    final sentence = m(node['sentence']);
    final thresholds = m(node['thresholds']);
    final total = node['total'] as int;
    final scaleMax = thresholds['scaleMax'] as int;
    final stampColor = switch (outcome['tone']) { 'green' => PxColors.green, 'amber' => const Color(0xFFB07A12), _ => PxColors.red };
    final sessionId = m(view['session'])['id'] as String;
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      if (node['strategyLabel'] != null) Text('STRATEJİ: ${trUpper(node['strategyLabel'] as String)}', style: PxText.eyebrow),
      const SizedBox(height: 10),
      Center(child: Transform.rotate(angle: -0.06, child: Container(padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8), decoration: BoxDecoration(color: stampColor, border: Border.all(color: PxColors.ink, width: 4)), child: Text(trUpper(outcome['stamp'] as String), style: PxText.pixel(32, color: PxColors.white, spacing: 2))))),
      const SizedBox(height: 12),
      Text('${sentence['demand']}  ›  ${sentence['result']}', textAlign: TextAlign.center, style: PxText.body(20, color: PxColors.gold)),
      const SizedBox(height: 10),
      PxCard(child: Text(node['verdictText'] as String)),
      const SizedBox(height: 10),
      for (final r in (node['reasoning'] as List).cast<String>()) Padding(padding: const EdgeInsets.only(bottom: 6), child: Text('· $r', style: PxText.body(19, color: PxColors.muted))),
      const SizedBox(height: 10),
      PxBox(
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Text('SKOR DÖKÜMÜ', style: PxText.eyebrow),
          for (final row in ms(node['breakdown']))
            Row(children: [
              Expanded(child: Text(row['label'] as String, style: PxText.body(19))),
              Text(_signed(row['value'] as int), style: PxText.body(20, color: switch (row['tone']) { 'success' => PxColors.greenHi, 'error' => PxColors.coral, _ => PxColors.text })),
            ]),
          const Divider(color: PxColors.panelHi),
          Row(children: [Expanded(child: Text('TOPLAM', style: PxText.pixel(14, color: PxColors.gold))), Text('$total', style: PxText.pixel(18, color: PxColors.gold))]),
          const SizedBox(height: 10),
          LayoutBuilder(builder: (ctx, c) {
            final bands = ms(thresholds['bands']);
            return Stack(clipBehavior: Clip.none, children: [
              Row(children: [
                for (var i = 0; i < bands.length; i++)
                  Expanded(
                    flex: (((i + 1 < bands.length ? bands[i + 1]['from'] as int : scaleMax) - (bands[i]['from'] as int)).clamp(1, 1 << 30)),
                    child: Container(height: 14, color: switch (bands[i]['tone']) { 'green' => PxColors.green, 'amber' => const Color(0xFFB07A12), _ => PxColors.red }),
                  ),
              ]),
              Positioned(left: ((total.clamp(0, scaleMax) - (bands.isEmpty ? 0 : bands.first['from'] as int)) / scaleMax * c.maxWidth).clamp(0, c.maxWidth - 4), top: -4, child: Container(width: 4, height: 22, color: PxColors.white)),
            ]);
          }),
          const SizedBox(height: 10),
          Text('Rütbe puanı +${m(node['xp'])['gained']}', style: PxText.pixel(14, color: PxColors.greenHi)),
        ]),
      ),
      const SizedBox(height: 16),
      PxButton(label: 'Dava raporu', onTap: () => context.push('/sessions/$sessionId/report')),
      const SizedBox(height: 10),
      PxButton(label: 'Ana menü', tone: PxTone.secondary, onTap: () => context.go('/')),
    ]);
  }

  static String _signed(int v) => v > 0 ? '+$v' : v < 0 ? '−${v.abs()}' : '0';
}
