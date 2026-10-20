import 'package:flutter/material.dart';

import '../../../design_system/tokens/px_colors.dart';
import '../../../design_system/tokens/px_text.dart';
import '../common.dart';
import 'scene_image.dart';

/// Olay yeri araması: görsele dokunuş sunucuya TAP (sahne birimi) olarak gider; isabet sunucuda hesaplanır.
class SceneNode extends StatefulWidget {
  const SceneNode({super.key, required this.view, required this.dispatch, required this.busy});
  final Map<String, dynamic> view;
  final Dispatch dispatch;
  final bool busy;
  @override
  State<SceneNode> createState() => _SceneNodeState();
}

class _SceneNodeState extends State<SceneNode> {
  Offset? _pending;

  @override
  Widget build(BuildContext context) {
    final node = m(widget.view['node']);
    final found = ms(node['found']);
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Text(node['instruction'] as String, style: PxText.body(20, color: PxColors.muted)),
      const SizedBox(height: 8),
      SceneImage(
        scene: node,
        found: found,
        pending: widget.busy ? _pending : null,
        onTap: widget.busy
            ? null
            : (x, y) async {
                setState(() => _pending = Offset(x.toDouble(), y.toDouble()));
                await widget.dispatch({'kind': 'TAP', 'x': x, 'y': y});
              },
      ),
      const SizedBox(height: 6),
      Text('Bulunan: ${found.length}${node['hiddenTotal'] != null ? ' / ${node['hiddenTotal']}' : ''}', style: PxText.pixel(12, color: PxColors.gold)),
      const SizedBox(height: 12),
      ChoiceList(choices: ms(widget.view['choices']), dispatch: widget.dispatch, busy: widget.busy),
    ]);
  }
}
