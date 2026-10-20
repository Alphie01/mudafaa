import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';

import '../motion/retro_motion.dart';
import 'backdrop_scenes.dart';
import 'px_canvas.dart';

/// Bilinen arka plan adları (şemadaki Backdrop enum'u).
const backdropNames = <String>[
  'siyah', 'buro', 'buro_gece', 'gorus_odasi', 'durusma_salonu', 'adliye', 'karakol', 'sokak_gece', 'sokak_yagmur',
  'depo', 'depo_gece', 'cay_ocagi', 'ev', 'kafe', 'hastane', 'liman_gece', 'arac',
];

/// Piksel arka plan: 4 px hücreli ızgara, 8 fps ortam animasyonu (yağmur, titreyen lamba, saat, toz).
/// Hareket `full` değilse tek kare çizilir.
class BackdropView extends StatefulWidget {
  const BackdropView({super.key, required this.name, this.cell = 4});
  final String name;
  final double cell;

  @override
  State<BackdropView> createState() => _BackdropViewState();
}

class _BackdropViewState extends State<BackdropView> with SingleTickerProviderStateMixin {
  final _frame = ValueNotifier<int>(0);
  Ticker? _ticker;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final animate = MotionScope.of(context).ambient && TickerMode.valuesOf(context).enabled;
    if (animate && _ticker == null) {
      _ticker = createTicker((d) {
        final f = d.inMilliseconds ~/ 125;
        if (f != _frame.value) _frame.value = f;
      })..start();
    } else if (!animate && _ticker != null) {
      _ticker!.dispose();
      _ticker = null;
      _frame.value = 0;
    }
  }

  @override
  void dispose() {
    _ticker?.dispose();
    _frame.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ExcludeSemantics(
      child: RepaintBoundary(
        child: CustomPaint(painter: _BackdropPainter(widget.name, widget.cell, _frame), size: Size.infinite),
      ),
    );
  }
}

class _BackdropPainter extends CustomPainter {
  _BackdropPainter(this.name, this.cell, this.frame) : super(repaint: frame);
  final String name;
  final double cell;
  final ValueNotifier<int> frame;

  @override
  void paint(Canvas canvas, Size size) {
    final cols = (size.width / cell).ceil();
    final rows = (size.height / cell).ceil();
    if (cols <= 0 || rows <= 0) return;
    canvas.save();
    canvas.clipRect(Offset.zero & size);
    final p = PxCanvas(canvas, cell, cols, rows);
    (scenes[name] ?? scenes['siyah']!)(p, frame.value);
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant _BackdropPainter old) => old.name != name || old.cell != cell;
}

/// Arka plan değişince çapraz geçiş (hareket kapalıyken anında).
class BackdropLayer extends StatelessWidget {
  const BackdropLayer({super.key, required this.name});
  final String? name;

  @override
  Widget build(BuildContext context) {
    final motion = MotionScope.of(context);
    final n = name ?? 'siyah';
    return AnimatedSwitcher(
      duration: Duration(milliseconds: motion == RetroMotion.off ? 0 : 520),
      layoutBuilder: (current, previous) => Stack(fit: StackFit.expand, children: [...previous, ?current]),
      child: BackdropView(key: ValueKey(n), name: n),
    );
  }
}
