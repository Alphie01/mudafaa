import 'package:flutter/material.dart';

import '../../../design_system/tokens/px_colors.dart';
import '../../../design_system/tokens/px_text.dart';
import '../../../design_system/widgets/px_box.dart';
import '../../../design_system/widgets/sprite.dart';
import '../common.dart';

/// Brifing / anlatı: profil kartı, ceza aralığı, olay özeti, savcılık delilleri ve strateji grubu.
class StoryNode extends StatefulWidget {
  const StoryNode({super.key, required this.view, required this.dispatch, required this.busy});
  final Map<String, dynamic> view;
  final Dispatch dispatch;
  final bool busy;
  @override
  State<StoryNode> createState() => _StoryNodeState();
}

class _StoryNodeState extends State<StoryNode> {
  String? _picked;

  @override
  Widget build(BuildContext context) {
    final node = m(widget.view['node']);
    final cast = m(widget.view['cast']);
    final choices = ms(widget.view['choices']);
    final grouped = <String>{};
    final children = <Widget>[];
    for (final b in ms(node['blocks'])) {
      switch (b['type']) {
        case 'profileCard':
          final who = m(cast[b['character']]);
          children.add(PxCard(
            child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              if (who['sprite'] != null) Container(color: hexAccent(who['accent']), padding: const EdgeInsets.all(4), child: PixelSprite(sprite: m(who['sprite']), px: 4)),
              const SizedBox(width: 12),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(trUpper(b['label'] as String), style: PxText.pixel(11, color: PxColors.parchmentInk)),
                  Text((who['name'] ?? '') as String, style: PxText.pixel(18, color: PxColors.ink)),
                  for (final l in (b['lines'] as List).cast<String>()) Text(l, style: PxText.body(18, color: PxColors.parchmentInk)),
                  const SizedBox(height: 4),
                  Text('Suçlama: ${b['charge']}', style: PxText.body(18, color: PxColors.ink)),
                  Text(b['demand'] as String, style: PxText.body(18, color: PxColors.red)),
                ]),
              ),
            ]),
          ));
        case 'sentenceRange':
          final segs = (b['segments'] as List).cast<String>();
          final labels = (b['labels'] as List).cast<String>();
          children.add(PxBox(
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Text('OLASI CEZA ARALIĞI', style: PxText.eyebrow),
              const SizedBox(height: 8),
              LayoutBuilder(builder: (ctx, c) {
                final marker = ((b['markerPct'] as num).toDouble() / 100) * c.maxWidth;
                return Stack(clipBehavior: Clip.none, children: [
                  Row(children: [for (final s in segs) Expanded(child: Container(height: 16, color: _seg(s)))]),
                  Positioned(left: marker - 2, top: -4, child: Container(width: 4, height: 24, color: PxColors.white)),
                ]);
              }),
              const SizedBox(height: 6),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [for (final l in labels) Text(l, style: PxText.body(16, color: PxColors.muted))]),
              Text(b['demandLabel'] as String, style: PxText.pixel(11, color: PxColors.gold)),
            ]),
          ));
        case 'paragraph':
          children.add(PxBox(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(trUpper(b['title'] as String), style: PxText.eyebrow), const SizedBox(height: 4), Text(b['text'] as String, style: PxText.body(20))])));
        case 'strengthList':
          children.add(PxBox(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(trUpper(b['title'] as String), style: PxText.eyebrow),
              const SizedBox(height: 6),
              for (final it in ms(b['items']))
                Padding(
                  padding: const EdgeInsets.only(bottom: 4),
                  child: Row(children: [
                    Expanded(child: Text(it['label'] as String, style: PxText.body(19))),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      color: switch (it['strength']) { 'STRONG' => PxColors.red, 'MEDIUM' => const Color(0xFFB07A12), _ => PxColors.green },
                      child: Text(switch (it['strength']) { 'STRONG' => 'GÜÇLÜ', 'MEDIUM' => 'ORTA', _ => 'ZAYIF' }, style: PxText.pixel(10, color: PxColors.white)),
                    ),
                  ]),
                ),
            ]),
          ));
        case 'choiceGroup':
          final group = b['group'] as String;
          final options = choices.where((c) => c['group'] == group).toList();
          grouped.addAll(options.map((c) => c['id'] as String));
          final hints = m(b['hints']);
          final picked = _picked ?? (options.isEmpty ? null : options.first['id'] as String);
          children.add(Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Text(trUpper(b['title'] as String), style: PxText.eyebrow),
            const SizedBox(height: 8),
            Row(children: [
              for (final o in options)
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: PxButton(label: o['label'] as String, height: 48, fontSize: 12, tone: picked == o['id'] ? PxTone.blue : PxTone.secondary, onTap: () => setState(() => _picked = o['id'] as String)),
                  ),
                ),
            ]),
            if (picked != null) ...[
              const SizedBox(height: 8),
              Text((hints[picked] ?? options.firstWhere((o) => o['id'] == picked)['description'] ?? '') as String, style: PxText.body(19, color: PxColors.muted)),
              const SizedBox(height: 12),
              PxButton(label: 'Soruşturmaya başla', onTap: widget.busy ? null : () => widget.dispatch({'kind': 'CHOOSE', 'choiceId': picked})),
            ],
          ]));
      }
      children.add(const SizedBox(height: 14));
    }
    children.add(ChoiceList(choices: choices, dispatch: widget.dispatch, exclude: grouped, busy: widget.busy));
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: children);
  }

  static Color _seg(String s) => switch (s) {
        'green' => PxColors.green,
        'gold' => PxColors.gold,
        'red' => PxColors.red,
        _ => const Color(0xFF6B1F14),
      };
}
