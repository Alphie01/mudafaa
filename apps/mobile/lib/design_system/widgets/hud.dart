import 'dart:async';

import 'package:flutter/material.dart';

import '../motion/retro_motion.dart';
import '../tokens/px_colors.dart';
import '../tokens/px_text.dart';

/// Sunucunun gönderdiği HUD öğesi (`{id,label,widget,value,max?,low?}`). Değer değişince göstergeler hücre hücre
/// dolar/boşalır; kaybedilen kalp birkaç kez yanıp söner.
class HudItemView extends StatefulWidget {
  const HudItemView({super.key, required this.item});
  final Map<String, dynamic> item;

  @override
  State<HudItemView> createState() => _HudItemViewState();
}

class _HudItemViewState extends State<HudItemView> {
  num? _shown;
  Timer? _timer;
  int _blinkFrom = -1;
  int _blinkTo = -1;
  int _blinkTick = 0;

  num? get _target => widget.item['value'] is num ? widget.item['value'] as num : null;

  @override
  void initState() {
    super.initState();
    _shown = _target;
  }

  @override
  void didUpdateWidget(HudItemView old) {
    super.didUpdateWidget(old);
    final from = old.item['value'];
    final to = _target;
    if (from is! num || to == null || from == to) {
      if (to != null && _timer == null) _shown = to;
      return;
    }
    if (MotionScope.of(context) == RetroMotion.off) {
      _timer?.cancel();
      _timer = null;
      _shown = to;
      return;
    }
    final kind = widget.item['widget'];
    if (kind == 'hearts' && to < from) {
      _blinkFrom = to.toInt();
      _blinkTo = from.toInt();
      _blinkTick = 0;
    }
    // Yüzdelik çubuk 10 basamakta, diğerleri birer birer ilerler.
    final step = kind == 'percentBar' ? ((to - from).abs() / 10).ceil().clamp(1, 100) : 1;
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(milliseconds: 80), (t) {
      if (!mounted) return t.cancel();
      setState(() {
        _blinkTick++;
        final cur = _shown ?? from;
        final target = _target ?? to;
        if (cur == target && _blinkTick >= 8) {
          _blinkFrom = -1;
          t.cancel();
          _timer = null;
          return;
        }
        if (cur < target) _shown = (cur + step).clamp(cur, target);
        if (cur > target) _shown = (cur - step).clamp(target, cur);
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final item = widget.item;
    final widgetKind = item['widget'] as String;
    final value = _shown ?? item['value'];
    final max = item['max'] as int?;
    final low = item['low'] == true;
    final label = trUpper(item['label'] as String);
    Widget gauge;
    switch (widgetKind) {
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
        gauge = Row(children: [
          for (var i = 0; i < (max ?? 5); i++)
            Padding(padding: const EdgeInsets.only(right: 6), child: _Heart(on: i < v || (i >= _blinkFrom && i < _blinkTo && _blinkTick.isEven))),
        ]);
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
    return Semantics(
      label: '$label: ${item['value']}${max != null ? ' / $max' : ''}',
      child: ExcludeSemantics(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 2),
          child: Row(children: [SizedBox(width: 92, child: Text(label, style: PxText.label)), gauge]),
        ),
      ),
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
