import 'package:flutter/material.dart';

import '../../../design_system/tokens/px_colors.dart';
import '../../../design_system/widgets/sprite.dart';
import 'line_info.dart';

/// Konuşmacının büyük portresi: karakter sprite'ı ya da kimliği bilinmeyen ses için "?" işaretli siyah siluet.
class Portrait extends StatelessWidget {
  const Portrait({super.key, required this.info, this.px = 9});
  final LineInfo info;
  final double px;

  @override
  Widget build(BuildContext context) {
    if (info.kind == SpeakerKind.anonymous) return Silhouette(px: px);
    final sprite = info.sprite;
    if (sprite == null) return const SizedBox.shrink();
    return PixelSprite(sprite: sprite, expression: info.expression, px: px);
  }
}

/// 16×20 baş-omuz silueti; ortasında altın "?".
class Silhouette extends StatelessWidget {
  const Silhouette({super.key, this.px = 9});
  final double px;
  @override
  Widget build(BuildContext context) => SizedBox(
        key: const ValueKey('silhouette'),
        width: 16 * px,
        height: 20 * px,
        child: CustomPaint(painter: _SilhouettePainter(px)),
      );
}

class _SilhouettePainter extends CustomPainter {
  _SilhouettePainter(this.px);
  final double px;
  static const _rows = [
    '....kkkkkkk.....',
    '...kkkkkkkkk....',
    '..kkkkkkkkkkk...',
    '..kkkkkkkkkkk...',
    '..kkkkkkkkkkk...',
    '..kkkkkkkkkkk...',
    '..kkkkkkkkkkk...',
    '...kkkkkkkkk....',
    '....kkkkkkk.....',
    '.....kkkkk......',
    '...kkkkkkkkkk...',
    '.kkkkkkkkkkkkkk.',
    'kkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkk',
    'kkkkkkkkkkkkkkkk',
  ];
  static const _q = ['.ggg.', 'g...g', '...g.', '..g..', '.....', '..g..'];

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..isAntiAlias = false;
    for (var y = 0; y < _rows.length; y++) {
      for (var x = 0; x < 16; x++) {
        if (_rows[y][x] != 'k') continue;
        // Kenarlarda hafif mor kontur: siyah zeminde de okunur.
        final edge = x == 0 || x == 15 || _rows[y][x - 1] != 'k' || _rows[y][x + 1] != 'k' || y == 0 || _rows[y - 1][x] != 'k';
        p.color = edge ? PxColors.panelHi : const Color(0xFF07050C);
        canvas.drawRect(Rect.fromLTWH(x * px, y * px, px, px), p);
      }
    }
    p.color = PxColors.gold;
    for (var y = 0; y < _q.length; y++) {
      for (var x = 0; x < 5; x++) {
        if (_q[y][x] == 'g') canvas.drawRect(Rect.fromLTWH((x + 4) * px, (y + 2) * px, px, px), p);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _SilhouettePainter old) => old.px != px;
}
