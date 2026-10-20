import 'dart:math' as math;
import 'dart:ui';

/// Izgara hücreleriyle çizim yapan yardımcı: her dikdörtgen hücre sınırına oturur, kenar yumuşatma yoktur.
class PxCanvas {
  PxCanvas(this.canvas, this.cell, this.cols, this.rows);
  final Canvas canvas;
  final double cell;
  final int cols;
  final int rows;
  final Paint _p = Paint()..isAntiAlias = false;

  int get w => cols;
  int get h => rows;

  /// Hücre koordinatlarında dolu dikdörtgen (yuvarlanır).
  void r(num x, num y, num w, num h, Color c) {
    final x0 = x.round(), y0 = y.round();
    final x1 = (x + w).round(), y1 = (y + h).round();
    if (x1 <= x0 || y1 <= y0) return;
    canvas.drawRect(Rect.fromLTRB(x0 * cell, y0 * cell, x1 * cell, y1 * cell), _p..color = c);
  }

  void dot(num x, num y, Color c) => r(x, y, 1, 1, c);
  void fill(Color c) => r(0, 0, cols, rows, c);

  /// Basamaklı üçgen ışık konisi (tepe `cx,top`, taban genişliği `baseW`).
  void cone(num cx, num top, num height, num baseW, Color c, {num topW = 2}) {
    final steps = height.round();
    for (var i = 0; i < steps; i += 2) {
      final ww = topW + (baseW - topW) * i / steps;
      r(cx - ww / 2, top + i, ww, 2, c);
    }
  }

  /// Basamaklı daire (yarıçap hücre).
  void disc(num cx, num cy, num radius, Color c) {
    for (var dy = -radius; dy <= radius; dy++) {
      final half = math.sqrt(math.max(0, radius * radius - dy * dy));
      r(cx - half, cy + dy, half * 2, 1, c);
    }
  }
}

/// Belirlenimci sözde rastgele [0,1).
double rnd(int i) {
  var x = (i * 374761393 + 668265263) & 0x7fffffff;
  x = ((x ^ (x >> 13)) * 1274126177) & 0x7fffffff;
  return (x & 0xffff) / 0x10000;
}
