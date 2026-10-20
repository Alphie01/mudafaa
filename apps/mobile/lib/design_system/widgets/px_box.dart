import 'package:flutter/material.dart';

import '../tokens/px_colors.dart';
import '../tokens/px_text.dart';

/// Tasarımın `.pxbtn` kutusu: 3px mürekkep kenarlık, iç bevel (sol-üst açık, sağ-alt koyu) ve 4px sert gölge.
class PxBox extends StatelessWidget {
  const PxBox({super.key, required this.child, this.color = PxColors.panel, this.padding = const EdgeInsets.all(12), this.shadow = true, this.bevel = true, this.border = 3});

  final Widget child;
  final Color color;
  final EdgeInsetsGeometry padding;
  final bool shadow;
  final bool bevel;
  final double border;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: color,
        border: Border.all(color: PxColors.ink, width: border),
        boxShadow: shadow ? const [BoxShadow(color: PxColors.ink, offset: Offset(4, 4))] : null,
      ),
      child: CustomPaint(
        painter: bevel ? _BevelPainter() : null,
        child: Padding(padding: padding, child: child),
      ),
    );
  }
}

class _BevelPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    const w = 4.0;
    final light = Paint()..color = const Color(0x38FFFFFF);
    final dark = Paint()..color = const Color(0x47000000);
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, w), light);
    canvas.drawRect(Rect.fromLTWH(0, 0, w, size.height), light);
    canvas.drawRect(Rect.fromLTWH(0, size.height - w, size.width, w), dark);
    canvas.drawRect(Rect.fromLTWH(size.width - w, 0, w, size.height), dark);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

enum PxTone { gold, red, blue, objection, secondary, green }

/// Basılınca 4,4 kayan ve gölgesi kalkan piksel düğme.
class PxButton extends StatefulWidget {
  const PxButton({super.key, required this.label, this.onTap, this.tone = PxTone.gold, this.height = 54, this.fontSize = 18, this.expand = true, this.trailing});

  final String label;
  final VoidCallback? onTap;
  final PxTone tone;
  final double height;
  final double fontSize;
  final bool expand;
  final Widget? trailing;

  @override
  State<PxButton> createState() => _PxButtonState();
}

class _PxButtonState extends State<PxButton> {
  bool _down = false;

  (Color, Color) get _colors => switch (widget.tone) {
        PxTone.gold => (PxColors.gold, PxColors.ink),
        PxTone.red => (PxColors.red, PxColors.text),
        PxTone.blue => (PxColors.blue, PxColors.text),
        PxTone.objection => (PxColors.redHi, PxColors.white),
        PxTone.secondary => (PxColors.panelHi, PxColors.text),
        PxTone.green => (PxColors.green, PxColors.text),
      };

  /// Tek kelimelik etiket kelime ortasından kırılmaz, sığmazsa küçülür; çok kelimeli etiket kelime sınırında kırılır.
  Widget _label(Color color) {
    final text = Text(trUpper(widget.label), textAlign: TextAlign.center, style: PxText.pixel(widget.fontSize, color: color, spacing: 1));
    return widget.label.trim().contains(' ') ? text : FittedBox(fit: BoxFit.scaleDown, child: text);
  }

  @override
  Widget build(BuildContext context) {
    final enabled = widget.onTap != null;
    final (bg, fg) = _colors;
    return Semantics(
      button: true,
      enabled: enabled,
      label: widget.label,
      child: GestureDetector(
        onTapDown: enabled ? (_) => setState(() => _down = true) : null,
        onTapCancel: () => setState(() => _down = false),
        onTapUp: enabled
            ? (_) {
                setState(() => _down = false);
                widget.onTap?.call();
              }
            : null,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 60),
          transform: Matrix4.translationValues(_down ? 4 : 0, _down ? 4 : 0, 0),
          height: widget.height,
          width: widget.expand ? double.infinity : null,
          decoration: BoxDecoration(
            color: enabled ? bg : PxColors.panelLo,
            border: Border.all(color: PxColors.ink, width: 3),
            boxShadow: _down ? null : const [BoxShadow(color: PxColors.ink, offset: Offset(4, 4))],
          ),
          child: CustomPaint(
            painter: _BevelPainter(),
            child: Center(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: widget.fontSize <= 12 ? 6 : 14),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Flexible(child: _label(enabled ? fg : PxColors.dim)),
                    if (widget.trailing != null) ...[const SizedBox(width: 8), widget.trailing!],
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

/// Parşömen kart (dosya, delil, tutanak).
class PxCard extends StatelessWidget {
  const PxCard({super.key, required this.child, this.padding = const EdgeInsets.all(12)});
  final Widget child;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) => PxBox(color: PxColors.parchment, padding: padding, child: DefaultTextStyle(style: PxText.body(19, color: PxColors.ink), child: child));
}
