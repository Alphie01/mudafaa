import 'package:flutter/material.dart';

import '../../../design_system/tokens/px_colors.dart';
import '../../../design_system/tokens/px_text.dart';
import '../../../design_system/widgets/px_box.dart';
import '../../../design_system/widgets/sprite.dart';
import '../common.dart';
import 'scene_image.dart';

/// Soruşturma hub'ı: sekmeler (yalnızca arayüz durumu), sahne önizlemesi, hızlı görüşme kartı, kalan seçenekler.
class InvestigationNode extends StatefulWidget {
  const InvestigationNode({super.key, required this.view, required this.dispatch, required this.busy});
  final Map<String, dynamic> view;
  final Dispatch dispatch;
  final bool busy;
  @override
  State<InvestigationNode> createState() => _InvestigationNodeState();
}

class _InvestigationNodeState extends State<InvestigationNode> {
  int _tab = 0;

  @override
  Widget build(BuildContext context) {
    final node = m(widget.view['node']);
    final tabs = ms(node['tabs']);
    final choices = ms(widget.view['choices']);
    final byId = {for (final c in choices) c['id'] as String: c};
    final inTabs = <String>{for (final t in tabs) ...(t['choiceIds'] as List).cast<String>()};
    final quick = m(node['quickTalk']);
    final cast = m(widget.view['cast']);
    final preview = m(node['scenePreview']);
    final current = tabs.isEmpty ? null : tabs[_tab.clamp(0, tabs.length - 1)];
    final status = ms(widget.view['lines']);
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      // Hub bir menüdür: giriş satırları oynatılmaz, kısa durum / hedef kutusu olarak durur.
      if (status.isNotEmpty) ...[
        Container(
          key: const ValueKey('hub-status'),
          padding: const EdgeInsets.fromLTRB(10, 8, 10, 8),
          decoration: BoxDecoration(color: PxColors.ink, border: Border.all(color: PxColors.panelHi, width: 2)),
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(width: 8, height: 8, margin: const EdgeInsets.only(top: 6, right: 8), color: PxColors.gold),
            Expanded(
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                for (final l in status)
                  Text(
                    l['speaker'] == 'narrator' || l['speaker'] == 'player' ? l['text'] as String : '${trUpper((m(cast[l['speaker']])['shortLabel'] ?? l['speaker']) as String)}: ${l['text']}',
                    style: PxText.body(19, color: PxColors.muted),
                  ),
              ]),
            ),
          ]),
        ),
        const SizedBox(height: 12),
      ],
      if (tabs.isNotEmpty)
        Row(children: [
          for (var i = 0; i < tabs.length; i++)
            Expanded(
              child: Padding(
                padding: const EdgeInsets.only(right: 4),
                child: PxButton(label: tabs[i]['label'] as String, height: 44, fontSize: 11, tone: i == _tab ? PxTone.gold : PxTone.secondary, onTap: () => setState(() => _tab = i)),
              ),
            ),
        ]),
      const SizedBox(height: 12),
      if (current?['kind'] == 'SCENE' && preview.isNotEmpty) ...[SceneImage(scene: preview, markers: ms(preview['markers'])), const SizedBox(height: 12)],
      if (current != null)
        for (final id in (current['choiceIds'] as List).cast<String>())
          if (byId[id] != null) Padding(padding: const EdgeInsets.only(bottom: 10), child: ChoiceTile(choice: byId[id]!, dispatch: widget.dispatch, busy: widget.busy)),
      if (quick.isNotEmpty) ...[
        const SizedBox(height: 6),
        PxBox(
          child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
            if (m(cast[quick['characterKey']])['sprite'] != null) Container(color: PxColors.ink, padding: const EdgeInsets.all(3), child: PixelSprite(sprite: m(m(cast[quick['characterKey']])['sprite']), px: 3)),
            const SizedBox(width: 10),
            Expanded(child: Text('“${(quick['line'] as String).replaceAll(RegExp(r'^["“]+|["”]+$'), '')}”', style: PxText.body(19))),
          ]),
        ),
        const SizedBox(height: 10),
        for (final id in (quick['choiceIds'] as List).cast<String>())
          if (byId[id] != null && !inTabs.contains(id)) Padding(padding: const EdgeInsets.only(bottom: 10), child: ChoiceTile(choice: byId[id]!, dispatch: widget.dispatch, busy: widget.busy)),
      ],
      const SizedBox(height: 6),
      ChoiceList(choices: choices, dispatch: widget.dispatch, exclude: {...inTabs, ...((quick['choiceIds'] as List?) ?? const []).cast<String>()}, busy: widget.busy),
    ]);
  }
}
