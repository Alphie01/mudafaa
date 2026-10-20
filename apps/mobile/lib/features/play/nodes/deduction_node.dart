import 'package:flutter/material.dart';

import '../../../design_system/tokens/px_colors.dart';
import '../../../design_system/tokens/px_text.dart';
import '../../../design_system/widgets/px_box.dart';
import '../common.dart';

/// Çıkarım tahtası: iki kart seçilince otomatik COMBINE (tasarımdaki gibi).
class DeductionNode extends StatefulWidget {
  const DeductionNode({super.key, required this.view, required this.dispatch, required this.busy});
  final Map<String, dynamic> view;
  final Dispatch dispatch;
  final bool busy;
  @override
  State<DeductionNode> createState() => _DeductionNodeState();
}

class _DeductionNodeState extends State<DeductionNode> {
  String? _first;

  Future<void> _pick(String id) async {
    if (_first == null) {
      setState(() => _first = id);
      return;
    }
    if (_first == id) {
      setState(() => _first = null);
      return;
    }
    final a = _first!;
    setState(() => _first = null);
    await widget.dispatch({'kind': 'COMBINE', 'a': a, 'b': id});
  }

  @override
  Widget build(BuildContext context) {
    final node = m(widget.view['node']);
    final cards = ms(node['cards']);
    final solved = ms(node['solved']);
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Text('İki ipucunu seç; birbirini açıklıyorsa yeni bir çıkarım doğar.', style: PxText.body(19, color: PxColors.muted)),
      const SizedBox(height: 10),
      GridView.count(
        crossAxisCount: 2,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        mainAxisSpacing: 10,
        crossAxisSpacing: 10,
        childAspectRatio: 1.3,
        children: [
          for (final c in cards)
            GestureDetector(
              onTap: widget.busy ? null : () => _pick(c['id'] as String),
              child: PxBox(
                color: _first == c['id'] ? PxColors.gold : PxColors.parchment,
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(trUpper(c['source'] as String), style: PxText.pixel(9, color: PxColors.parchmentInk)),
                  const SizedBox(height: 4),
                  Expanded(child: Text(c['text'] as String, style: PxText.body(18, color: PxColors.ink), overflow: TextOverflow.fade)),
                ]),
              ),
            ),
        ],
      ),
      if (solved.isNotEmpty) ...[
        const SizedBox(height: 12),
        Text('ÇIKARIMLAR${node['recipesTotal'] != null ? ' · ${solved.length} / ${node['recipesTotal']}' : ''}', style: PxText.eyebrow),
        for (final s in solved) Padding(padding: const EdgeInsets.only(top: 6), child: PxBox(color: PxColors.green, child: Text('${s['title']}\n${s['hits']}', style: PxText.body(18)))),
      ],
      const SizedBox(height: 12),
      ChoiceList(choices: ms(widget.view['choices']), dispatch: widget.dispatch, busy: widget.busy),
    ]);
  }
}
