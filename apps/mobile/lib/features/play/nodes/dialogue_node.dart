import 'package:flutter/material.dart';

import '../../../design_system/tokens/px_colors.dart';
import '../../../design_system/tokens/px_text.dart';
import '../../../design_system/widgets/px_box.dart';
import '../../../design_system/widgets/sprite.dart';
import '../common.dart';

/// Görüşme: oda ve müvekkil, ruh hâli, OLAYI ANLA hedefleri; ton (arayüz durumu) × konu → CHOOSE + variant.
class DialogueNode extends StatefulWidget {
  const DialogueNode({super.key, required this.view, required this.dispatch, required this.busy});
  final Map<String, dynamic> view;
  final Dispatch dispatch;
  final bool busy;
  @override
  State<DialogueNode> createState() => _DialogueNodeState();
}

class _DialogueNodeState extends State<DialogueNode> {
  String? _tone;

  @override
  Widget build(BuildContext context) {
    final node = m(widget.view['node']);
    final cast = m(widget.view['cast']);
    final room = m(node['room']);
    final who = m(cast[room['characterKey']]);
    final tones = ms(node['tones']);
    final tone = _tone ?? (tones.isEmpty ? null : tones.first['id'] as String);
    final mood = m(node['mood']);
    final objectives = ms(node['objectives']);
    final choices = ms(widget.view['choices']);
    final topics = choices.where((c) => c['kind'] == 'TOPIC').toList();
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Container(
        height: 150,
        color: const Color(0xFF3A3550),
        child: Stack(children: [
          Positioned(left: 0, right: 0, bottom: 0, height: 40, child: Container(color: PxColors.wood)),
          if (who['sprite'] != null) Positioned(left: 0, right: 0, bottom: 20, child: Center(child: PixelSprite(sprite: m(who['sprite']), expression: room['expression'] as String?, px: 5))),
          Positioned(left: 8, top: 8, child: Text(trUpper(room['label'] as String), style: PxText.pixel(11, color: PxColors.parchment))),
          if (mood.isNotEmpty) Positioned(right: 8, top: 8, child: Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), color: PxColors.ink, child: Text('Ruh hâli: ${mood['label']}', style: PxText.body(17)))),
        ]),
      ),
      const SizedBox(height: 12),
      if (tones.isNotEmpty) ...[
        Row(children: [
          Text('TON', style: PxText.label),
          const SizedBox(width: 10),
          for (final t in tones)
            Padding(
              padding: const EdgeInsets.only(right: 6),
              child: PxButton(label: t['label'] as String, expand: false, height: 34, fontSize: 12, tone: tone == t['id'] ? PxTone.gold : PxTone.secondary, onTap: () => setState(() => _tone = t['id'] as String)),
            ),
        ]),
        const SizedBox(height: 10),
      ],
      for (final c in topics)
        Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: ChoiceTile(
            choice: {...c, 'label': c['label'], 'description': ms(c['variants']).where((v) => v['id'] == tone).map((v) => v['label']).firstOrNull},
            dispatch: widget.dispatch,
            variant: ms(c['variants']).any((v) => v['id'] == tone) ? tone : null,
            busy: widget.busy,
          ),
        ),
      if (node['allowPresent'] == true)
        Padding(
          padding: const EdgeInsets.only(bottom: 10),
          child: PxButton(
            label: 'İpucu göster',
            tone: PxTone.blue,
            height: 46,
            fontSize: 14,
            onTap: widget.busy
                ? null
                : () async {
                    final items = [...ms(m(widget.view['bag'])['items']), ...ms(m(widget.view['notebook'])['items'])];
                    final id = await pickEvidence(context, items, title: 'İpucu göster');
                    if (id != null) await widget.dispatch({'kind': 'PRESENT', 'evidenceId': id});
                  },
          ),
        ),
      ChoiceList(choices: choices, dispatch: widget.dispatch, exclude: {for (final t in topics) t['id'] as String}, busy: widget.busy),
      if (objectives.isNotEmpty) ...[
        const SizedBox(height: 6),
        PxBox(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('OLAYI ANLA · ${objectives.where((o) => o['known'] == true).length} / ${objectives.length}', style: PxText.eyebrow),
            const SizedBox(height: 6),
            for (final o in objectives)
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Row(children: [
                  Container(width: 10, height: 10, color: o['known'] == true ? PxColors.greenHi : PxColors.dim),
                  const SizedBox(width: 8),
                  Expanded(child: Text(o['text'] as String, style: PxText.body(19, color: o['known'] == true ? PxColors.text : PxColors.muted))),
                ]),
              ),
          ]),
        ),
      ],
    ]);
  }
}
