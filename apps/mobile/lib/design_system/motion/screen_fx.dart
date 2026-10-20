import 'dart:async';

import 'package:flutter/material.dart';

import 'retro_motion.dart';

/// Basamaklı eğri: `n` kare (piksel sanatına uygun, ara değer yok).
class StepCurve extends Curve {
  const StepCurve(this.n);
  final int n;
  @override
  double transformInternal(double t) => t >= 1 ? 1 : (t * n).floor() / n;
}

enum ScreenFxKind { shake, flash, fade }

/// Ekran efektlerini tetikleyen denetleyici (satır `fx`'i, İTİRAZ!, karar damgası).
class ScreenFxController extends ChangeNotifier {
  ScreenFxKind? _pending;
  int _seq = 0;
  int get seq => _seq;
  ScreenFxKind? get pending => _pending;

  void trigger(ScreenFxKind kind) {
    _pending = kind;
    _seq++;
    notifyListeners();
  }

  void shake() => trigger(ScreenFxKind.shake);
  void flash() => trigger(ScreenFxKind.flash);
  void fade() => trigger(ScreenFxKind.fade);
}

/// Çocuğunu sarsar; üstüne beyaz flaş / karartma katmanı koyar. `reduced`/`off` hareket düzeyinde sarsıntı ve flaş
/// yapılmaz, karartma kısa ve basamaksızdır (`off`'ta hiç yoktur).
class ScreenFx extends StatefulWidget {
  const ScreenFx({super.key, required this.controller, required this.child});
  final ScreenFxController controller;
  final Widget child;

  @override
  State<ScreenFx> createState() => _ScreenFxState();
}

class _ScreenFxState extends State<ScreenFx> with TickerProviderStateMixin {
  late final AnimationController _shake = AnimationController(vsync: this, duration: const Duration(milliseconds: 280));
  late final AnimationController _fade = AnimationController(vsync: this, duration: const Duration(milliseconds: 640));
  bool _flash = false;
  Timer? _flashTimer;

  static const _offsets = [0.0, 6, -6, 4, -4, 2, -2, 0];

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_on);
  }

  @override
  void didUpdateWidget(ScreenFx old) {
    super.didUpdateWidget(old);
    if (old.controller != widget.controller) {
      old.controller.removeListener(_on);
      widget.controller.addListener(_on);
    }
  }

  void _on() {
    final motion = MotionScope.of(context);
    switch (widget.controller.pending) {
      case ScreenFxKind.shake:
        if (motion.violent) _shake.forward(from: 0);
      case ScreenFxKind.flash:
        if (!motion.violent) return;
        setState(() => _flash = true);
        _flashTimer?.cancel();
        _flashTimer = Timer(const Duration(milliseconds: 60), () {
          if (mounted) setState(() => _flash = false);
        });
      case ScreenFxKind.fade:
        if (motion != RetroMotion.off) _fade.forward(from: 0);
      case null:
        break;
    }
  }

  @override
  void dispose() {
    widget.controller.removeListener(_on);
    _flashTimer?.cancel();
    _shake.dispose();
    _fade.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(fit: StackFit.expand, children: [
      AnimatedBuilder(
        animation: _shake,
        child: widget.child,
        builder: (context, child) {
          final i = (_shake.value * (_offsets.length - 1)).floor().clamp(0, _offsets.length - 1);
          final dx = _shake.isAnimating ? _offsets[i].toDouble() : 0.0;
          return Transform.translate(offset: Offset(dx, 0), child: child);
        },
      ),
      IgnorePointer(
        child: AnimatedBuilder(
          animation: _fade,
          builder: (context, _) {
            if (!_fade.isAnimating) return const SizedBox.shrink();
            // 0 → siyah (basamaklı) → bekle → aç.
            final t = _fade.value;
            final a = t < 0.4 ? const StepCurve(4).transform(t / 0.4) : (t < 0.6 ? 1.0 : 1 - const StepCurve(4).transform((t - 0.6) / 0.4));
            return ColoredBox(color: Colors.black.withValues(alpha: a));
          },
        ),
      ),
      if (_flash) const IgnorePointer(child: ColoredBox(color: Colors.white)),
    ]);
  }
}
