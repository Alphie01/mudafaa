import 'package:flutter/material.dart';

import '../../../design_system/tokens/px_colors.dart';
import '../../../design_system/tokens/px_text.dart';
import '../../../design_system/widgets/px_box.dart';
import '../common.dart';

/// Belge inceleme: alet seçimi (arayüz durumu; UV koyu zemin), satıra dokunuş → EXAMINE.
class DocumentNode extends StatefulWidget {
  const DocumentNode({super.key, required this.view, required this.dispatch, required this.busy});
  final Map<String, dynamic> view;
  final Dispatch dispatch;
  final bool busy;
  @override
  State<DocumentNode> createState() => _DocumentNodeState();
}

class _DocumentNodeState extends State<DocumentNode> {
  String? _tool;

  @override
  Widget build(BuildContext context) {
    final node = m(widget.view['node']);
    final tools = ms(node['tools']);
    final tool = _tool ?? (tools.isEmpty ? null : tools.first['id'] as String);
    final uv = tools.any((t) => t['id'] == tool && t['visualMode'] == 'UV');
    final columns = ms(node['columns']);
    final solved = ms(node['solved']);
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      Wrap(spacing: 6, runSpacing: 6, children: [
        for (final t in tools) PxButton(label: t['label'] as String, expand: false, height: 38, fontSize: 12, tone: tool == t['id'] ? PxTone.gold : PxTone.secondary, onTap: () => setState(() => _tool = t['id'] as String)),
      ]),
      const SizedBox(height: 10),
      PxBox(
        color: uv ? const Color(0xFF1D1240) : PxColors.parchment,
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Row(children: [
            Expanded(child: Text(m(node['header'])['left'] as String, style: PxText.pixel(11, color: uv ? PxColors.muted : PxColors.parchmentInk))),
            Text(m(node['header'])['right'] as String, style: PxText.pixel(11, color: uv ? PxColors.muted : PxColors.parchmentInk)),
          ]),
          const SizedBox(height: 6),
          Row(children: [for (final c in columns) Expanded(flex: ((c['flex'] as num) * 10).round(), child: Text(trUpper(c['label'] as String), style: PxText.pixel(10, color: uv ? PxColors.muted : PxColors.parchmentInk)))]),
          for (final r in ms(node['rows']))
            Builder(builder: (_) {
              final lens = m(m(r['lens'])[tool]);
              final cells = ((lens['cells'] ?? r['cells']) as List).cast<String>();
              final isSolved = solved.any((s) => s['target'] == r['id'] && s['tool'] == tool);
              return GestureDetector(
                onTap: widget.busy || tool == null ? null : () => widget.dispatch({'kind': 'EXAMINE', 'tool': tool, 'target': r['id']}),
                child: Container(
                  margin: const EdgeInsets.only(top: 4),
                  padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
                  decoration: BoxDecoration(color: isSolved ? PxColors.greenHi.withValues(alpha: 0.25) : null, border: Border(top: BorderSide(color: uv ? PxColors.panelHi : PxColors.parchmentDk, width: 2))),
                  child: Row(children: [
                    for (var i = 0; i < cells.length && i < columns.length; i++)
                      Expanded(
                        flex: ((columns[i]['flex'] as num) * 10).round(),
                        child: Text(cells[i], style: PxText.body(19, color: lens.isNotEmpty ? (uv ? const Color(0xFFD6C2FF) : PxColors.red) : (uv ? PxColors.text : PxColors.ink))),
                      ),
                  ]),
                ),
              );
            }),
        ]),
      ),
      if (node['hiddenRemaining'] != null) Padding(padding: const EdgeInsets.only(top: 6), child: Text('Gizli bulgu: ${node['hiddenRemaining']}', style: PxText.pixel(12, color: PxColors.gold))),
      const SizedBox(height: 12),
      ChoiceList(choices: ms(widget.view['choices']), dispatch: widget.dispatch, busy: widget.busy),
    ]);
  }
}
