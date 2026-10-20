import 'package:flutter/material.dart';

import '../tokens/px_colors.dart';
import '../tokens/px_text.dart';

/// Sunucunun gönderdiği HUD öğesi (`{id,label,widget,value,max?,low?}`).
class HudItemView extends StatelessWidget {
  const HudItemView({super.key, required this.item});
  final Map<String, dynamic> item;

  @override
  Widget build(BuildContext context) {
    final widget = item['widget'] as String;
    final value = item['value'];
    final max = item['max'] as int?;
    final low = item['low'] == true;
    final label = trUpper(item['label'] as String);
    Widget gauge;
    switch (widget) {
      case 'meter10':
        final v = (value as num).toInt();
        final total = max ?? 10;
        gauge = Expanded(
          child: Container(
            height: 18,
            color: PxColors.panel,
            padding: const EdgeInsets.all(2),
            child: Row(children: [for (var i = 0; i < total; i++) Expanded(child: Container(margin: const EdgeInsets.symmetric(horizontal: 1), color: i < v ? PxColors.blueHi : const Color(0xFF8A3B30)))]),
          ),
        );
      case 'hearts':
        final v = (value as num).toInt();
        gauge = Row(children: [for (var i = 0; i < (max ?? 5); i++) Padding(padding: const EdgeInsets.only(right: 6), child: _Heart(on: i < v))]);
      case 'percentBar':
        final v = (value as num).toInt();
        gauge = Expanded(
          child: Row(children: [
            Expanded(
              child: Container(
                height: 14,
                color: PxColors.panel,
                alignment: Alignment.centerLeft,
                child: FractionallySizedBox(widthFactor: (v / (max ?? 100)).clamp(0, 1).toDouble(), child: Container(color: low ? PxColors.coral : PxColors.greenHi)),
              ),
            ),
            const SizedBox(width: 6),
            Text('%$v', style: PxText.body(18)),
          ]),
        );
      case 'pips':
        final v = (value as num).toInt();
        gauge = Row(children: [for (var i = 0; i < (max ?? v); i++) Container(width: 14, height: 14, margin: const EdgeInsets.only(right: 4), decoration: BoxDecoration(color: i < v ? PxColors.gold : PxColors.panel, border: Border.all(color: PxColors.ink, width: 2)))]);
      case 'minutes':
        gauge = Text('$value dk', style: PxText.body(20, color: low ? PxColors.coral : PxColors.text));
      default:
        gauge = Text(max == null ? '$value' : '$value/$max', style: PxText.body(20, color: low ? PxColors.coral : PxColors.text));
    }
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(children: [SizedBox(width: 92, child: Text(label, style: PxText.label)), gauge]),
    );
  }
}

class _Heart extends StatelessWidget {
  const _Heart({required this.on});
  final bool on;
  @override
  Widget build(BuildContext context) => CustomPaint(size: const Size(20, 18), painter: _HeartPainter(on ? PxColors.redHi : PxColors.panelHi));
}

class _HeartPainter extends CustomPainter {
  _HeartPainter(this.color);
  final Color color;
  static const _rows = ['.XX.XX.', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'];
  @override
  void paint(Canvas canvas, Size size) {
    final cw = size.width / 7, ch = size.height / 6;
    final p = Paint()..color = color..isAntiAlias = false;
    for (var y = 0; y < 6; y++) {
      for (var x = 0; x < 7; x++) {
        if (_rows[y][x] == 'X') canvas.drawRect(Rect.fromLTWH(x * cw, y * ch, cw, ch), p);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _HeartPainter old) => old.color != color;
}
