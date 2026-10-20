import 'package:flutter/material.dart';

import '../tokens/px_colors.dart';

const Map<String, List<(int, int, String)>> _faces = {
  'normal': [],
  'mutlu': [(5, 4, '*e****e*'), (7, 4, '*k****k*'), (8, 6, 'kkkk')],
  'kizgin': [(4, 4, '*kk**kk*'), (5, 4, '*e****e*'), (7, 4, '**kkkk**')],
  'saskin': [(4, 4, '*k****k*'), (5, 4, '*ee**ee*'), (7, 4, '***kk***'), (8, 7, 'kk')],
  'uzgun': [(4, 4, '**k**k**'), (5, 4, '*e****e*'), (7, 4, '**kkkk**'), (8, 5, 'k'), (8, 10, 'k')],
};

/// 16×20 piksel karakter (Sprite.dc.html'in portu): satırlar palet harfleri, ifade yüz katmanıdır.
class PixelSprite extends StatelessWidget {
  const PixelSprite({super.key, required this.sprite, this.expression, this.px = 4});

  /// `{rows, skin?, noEyes?, noMouth?}`.
  final Map<String, dynamic> sprite;
  final String? expression;
  final double px;

  @override
  Widget build(BuildContext context) {
    final rows = (sprite['rows'] as List).cast<String>();
    return SizedBox(
      width: 16 * px,
      height: rows.length * px,
      child: CustomPaint(painter: _SpritePainter(sprite, expression ?? 'normal', px)),
    );
  }
}

class _SpritePainter extends CustomPainter {
  _SpritePainter(this.sprite, this.expression, this.px);
  final Map<String, dynamic> sprite;
  final String expression;
  final double px;

  @override
  void paint(Canvas canvas, Size size) {
    final skin = (sprite['skin'] as String?) ?? 's';
    final grid = (sprite['rows'] as List).cast<String>().map((r) => (r.padRight(16, '.')).substring(0, 16).split('')).toList();
    for (final (row, col, str) in _faces[expression] ?? const <(int, int, String)>[]) {
      if (sprite['noEyes'] == true && row == 5) continue;
      if (sprite['noMouth'] == true && (row == 7 || row == 8)) continue;
      if (row >= grid.length) continue;
      for (var i = 0; i < str.length; i++) {
        grid[row][col + i] = str[i] == '*' ? skin : str[i];
      }
    }
    final paint = Paint()..isAntiAlias = false;
    for (var y = 0; y < grid.length; y++) {
      for (var x = 0; x < 16; x++) {
        final c = spritePalette[grid[y][x]];
        if (c == null) continue;
        paint.color = c;
        canvas.drawRect(Rect.fromLTWH(x * px, y * px, px, px), paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _SpritePainter old) => old.expression != expression || old.sprite != sprite || old.px != px;
}
