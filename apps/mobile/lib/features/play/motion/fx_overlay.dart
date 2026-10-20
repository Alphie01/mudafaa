import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../../design_system/motion/retro_motion.dart';
import '../../../design_system/motion/screen_fx.dart';
import '../../../design_system/tokens/px_colors.dart';
import '../../../design_system/tokens/px_text.dart';
import '../../../design_system/widgets/px_box.dart';
import '../common.dart';
import '../dialogue/portrait.dart';
import '../../../design_system/widgets/sprite.dart';

enum FxCardKind { evidence, characters, shout }

/// Engelleyici efekt kartı: YENİ DELİL, YENİ KİŞİ(LER), İTİRAZ!.
class FxCard {
  const FxCard.evidence(this.evidence) : kind = FxCardKind.evidence, people = const [], label = '';
  const FxCard.characters(this.people) : kind = FxCardKind.characters, evidence = const {}, label = '';
  const FxCard.shout(this.label) : kind = FxCardKind.shout, evidence = const {}, people = const [];
  final FxCardKind kind;
  final Map<String, dynamic> evidence;
  final List<({String label, Map<String, dynamic>? who})> people;
  final String label;
}

/// `view.last.fx`'ten engelleyici kartları çıkarır. Delil kartı çantadan (ya da defterden) tamamlanır;
/// birden çok yeni kişi tek kartta toplanır.
List<FxCard> fxCardsOf(Map<String, dynamic> view) {
  final last = view['last'] == null ? null : m(view['last']);
  if (last == null) return const [];
  final fx = ms(last['fx']);
  final bag = [...ms(m(view['bag'])['items']), ...ms(m(view['notebook'])['items'])];
  final cast = m(view['cast']);
  final cards = <FxCard>[];
  for (final f in fx.where((f) => f['kind'] == 'SHOUT')) {
    cards.add(FxCard.shout((f['label'] as String?) ?? 'İtiraz!'));
  }
  for (final f in fx.where((f) => f['kind'] == 'EVIDENCE')) {
    final found = bag.where((e) => e['id'] == f['id']).firstOrNull;
    cards.add(FxCard.evidence(found ?? {'id': f['id'], 'title': f['label']}));
  }
  final people = [
    for (final f in fx.where((f) => f['kind'] == 'CHARACTER'))
      (label: (f['label'] as String?) ?? '', who: cast[f['id']] == null ? null : m(cast[f['id']])),
  ];
  if (people.isNotEmpty) cards.add(FxCard.characters(people));
  return cards;
}

/// Engelleyici olmayan uçan sayılar: SKOR ve değişken farkları.
List<({String text, bool negative})> floatsOf(Map<String, dynamic> view) {
  final last = view['last'] == null ? null : m(view['last']);
  if (last == null) return const [];
  final out = <({String text, bool negative})>[];
  for (final f in ms(last['fx'])) {
    final label = (f['label'] as String?) ?? '';
    final delta = f['delta'] as int?;
    if (f['kind'] == 'SCORE') {
      out.add((text: label, negative: (delta ?? 0) < 0 || label.startsWith('−') || label.startsWith('-')));
    } else if (f['kind'] == 'VAR' && delta != null && delta != 0) {
      out.add((text: '${delta > 0 ? '+' : '−'}${delta.abs()} ${trUpper(label)}', negative: delta < 0));
    }
  }
  return out;
}

/// Tek bir engelleyici kartı oynatır; dokunuşla ya da süre dolunca `onDone`.
class FxCardOverlay extends StatefulWidget {
  const FxCardOverlay({super.key, required this.card, required this.onDone, required this.screenFx});
  final FxCard card;
  final VoidCallback onDone;
  final ScreenFxController screenFx;

  @override
  State<FxCardOverlay> createState() => _FxCardOverlayState();
}

class _FxCardOverlayState extends State<FxCardOverlay> with SingleTickerProviderStateMixin {
  late final AnimationController _in = AnimationController(vsync: this, duration: const Duration(milliseconds: 360));
  Timer? _auto;
  bool _closed = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_auto != null) return;
    final motion = MotionScope.of(context);
    if (motion == RetroMotion.off) {
      _in.value = 1;
    } else {
      _in.forward();
    }
    if (widget.card.kind == FxCardKind.shout) {
      widget.screenFx.flash();
      Future.delayed(const Duration(milliseconds: 260), () {
        if (mounted) widget.screenFx.shake();
      });
    }
    final int ms = switch (widget.card.kind) {
      FxCardKind.shout => 1100,
      FxCardKind.evidence => 2600,
      FxCardKind.characters => 2000 + 400 * math.min(widget.card.people.length - 1, 3),
    };
    _auto = Timer(Duration(milliseconds: ms), _close);
  }

  void _close() {
    if (_closed) return;
    _closed = true;
    _auto?.cancel();
    widget.onDone();
  }

  @override
  void dispose() {
    _auto?.cancel();
    _in.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final card = widget.card;
    final label = switch (card.kind) {
      FxCardKind.evidence => 'Yeni delil: ${card.evidence['title']}',
      FxCardKind.characters => 'Yeni kişi: ${card.people.map((p) => p.label).join(', ')}',
      FxCardKind.shout => card.label,
    };
    return Semantics(
      liveRegion: true,
      label: label,
      button: true,
      onTap: _close,
      child: GestureDetector(
        key: ValueKey('fx-${card.kind.name}'),
        behavior: HitTestBehavior.opaque,
        onTap: _close,
        child: ExcludeSemantics(
          child: ColoredBox(
            color: card.kind == FxCardKind.shout ? const Color(0x00000000) : const Color(0xB3120D1C),
            child: Center(
              child: AnimatedBuilder(
                animation: _in,
                builder: (context, _) => switch (card.kind) {
                  FxCardKind.evidence => _evidence(card, _in.value),
                  FxCardKind.characters => _people(card, _in.value),
                  FxCardKind.shout => _shout(card, _in.value),
                },
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _banner(String text, Color color, {Color fg = PxColors.ink}) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
        decoration: BoxDecoration(color: color, border: Border.all(color: PxColors.ink, width: 3), boxShadow: const [BoxShadow(color: PxColors.ink, offset: Offset(4, 4))]),
        child: Text(text, style: PxText.pixel(16, color: fg, spacing: 2)),
      );

  /// Kart önce küçükten büyür (pop), sonra arkadan öne döner (flip) — 4'er basamak.
  Widget _evidence(FxCard card, double t) {
    final pop = const StepCurve(3).transform((t / 0.4).clamp(0, 1));
    final flip = const StepCurve(4).transform(((t - 0.35) / 0.65).clamp(0, 1));
    final scale = pop < 1 ? 0.6 + 0.5 * pop : 1.0 + 0.1 * (1 - flip);
    final angle = (1 - flip) * math.pi / 2;
    final e = card.evidence;
    final front = PxBox(
      color: PxColors.parchment,
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [
        Row(children: [
          Expanded(child: Text((e['title'] ?? '') as String, style: PxText.pixel(17, color: PxColors.ink))),
          if (e['kindLabel'] != null) Text(trUpper(e['kindLabel'] as String), style: PxText.pixel(9, color: PxColors.parchmentInk)),
        ]),
        if (e['shortText'] != null) ...[const SizedBox(height: 6), Text(e['shortText'] as String, style: PxText.body(19, color: PxColors.ink))],
        if (e['sourceLabel'] != null) ...[const SizedBox(height: 6), Text(e['sourceLabel'] as String, style: PxText.body(16, color: PxColors.parchmentInk))],
      ]),
    );
    final back = PxBox(color: PxColors.panelHi, child: SizedBox(height: 90, child: Center(child: Text('?', style: PxText.pixel(40, color: PxColors.gold)))));
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 28),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        Opacity(opacity: t > 0.15 ? 1 : 0, child: _banner('YENİ DELİL', PxColors.gold)),
        const SizedBox(height: 16),
        Transform(
          alignment: Alignment.center,
          transform: Matrix4.identity()
            ..setEntry(3, 2, 0.002)
            ..rotateY(angle)
            ..scaleByDouble(scale, scale, 1, 1),
          child: flip < 0.5 ? back : front,
        ),
        const SizedBox(height: 14),
        Text(e.containsKey('kindLabel') ? 'Çantaya eklendi' : 'Not defterine eklendi', style: PxText.body(18, color: PxColors.muted)),
      ]),
    );
  }

  Widget _people(FxCard card, double t) {
    final step = const StepCurve(3).transform(t);
    final multi = card.people.length > 1;
    final px = multi ? (card.people.length > 2 ? 4.0 : 5.0) : 7.0;
    return Transform.translate(
      offset: Offset(0, (1 - step) * 24),
      child: Opacity(
        opacity: step == 0 ? 0 : 1,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            _banner(multi ? 'YENİ KİŞİLER' : 'YENİ KİŞİ', PxColors.blueHi, fg: PxColors.white),
            const SizedBox(height: 16),
            Wrap(alignment: WrapAlignment.center, spacing: 12, runSpacing: 12, children: [
              for (final p in card.people)
                Column(mainAxisSize: MainAxisSize.min, children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(color: hexAccent(p.who?['accent']), border: Border.all(color: PxColors.ink, width: 3)),
                    child: p.who?['sprite'] != null ? PixelSprite(sprite: m(p.who!['sprite']), expression: p.who!['expression'] as String?, px: px) : Silhouette(px: px),
                  ),
                  const SizedBox(height: 6),
                  ConstrainedBox(
                    constraints: BoxConstraints(maxWidth: math.max(16 * px + 24, 110)),
                    child: Column(children: [
                      Text(trUpper(p.label), textAlign: TextAlign.center, style: PxText.pixel(12, color: PxColors.text)),
                      if (p.who?['shortLabel'] != null && p.who!['shortLabel'] != p.label) Text(p.who!['shortLabel'] as String, textAlign: TextAlign.center, style: PxText.body(16, color: PxColors.muted)),
                    ]),
                  ),
                ]),
            ]),
          ]),
        ),
      ),
    );
  }

  /// İTİRAZ!: 3 basamaklı büyüyen-oturan pankart (flaş ve sarsıntı ScreenFx'ten).
  Widget _shout(FxCard card, double t) {
    final s = const StepCurve(3).transform(t);
    final scale = s < 0.34 ? 1.7 : (s < 0.67 ? 0.85 : 1.0);
    return Transform.rotate(
      angle: -0.08,
      child: Transform.scale(
        scale: t == 0 ? 1.7 : scale,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 10),
          decoration: BoxDecoration(color: PxColors.redHi, border: Border.all(color: PxColors.ink, width: 5), boxShadow: const [BoxShadow(color: PxColors.ink, offset: Offset(6, 6))]),
          child: Text(trUpper(card.label), style: PxText.pixel(44, color: PxColors.white, spacing: 2).copyWith(shadows: const [Shadow(color: PxColors.ink, offset: Offset(3, 3))])),
        ),
      ),
    );
  }
}

/// Uçan +/− sayıları: 6 basamakta yükselir, sonra kaybolur.
class FloatingDeltas extends StatefulWidget {
  const FloatingDeltas({super.key, required this.items});
  final List<({String text, bool negative})> items;
  @override
  State<FloatingDeltas> createState() => _FloatingDeltasState();
}

class _FloatingDeltasState extends State<FloatingDeltas> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1600));

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_c.status == AnimationStatus.dismissed) {
      if (MotionScope.of(context) == RetroMotion.off) {
        _c.value = 0.5;
        Future.delayed(const Duration(milliseconds: 1400), () {
          if (mounted) _c.value = 1;
        });
      } else {
        _c.forward();
      }
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: AnimatedBuilder(
        animation: _c,
        builder: (context, _) {
          if (_c.value >= 1) return const SizedBox.shrink();
          final rise = const StepCurve(6).transform((_c.value / 0.7).clamp(0, 1));
          final fade = _c.value < 0.75 ? 1.0 : 1 - const StepCurve(3).transform((_c.value - 0.75) / 0.25);
          return Opacity(
            opacity: fade,
            child: Transform.translate(
              offset: Offset(0, -rise * 28),
              child: Column(mainAxisSize: MainAxisSize.min, children: [
                for (final it in widget.items)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Text(
                      it.text,
                      style: PxText.pixel(20, color: it.negative ? PxColors.coral : PxColors.greenHi, spacing: 1).copyWith(shadows: const [Shadow(color: PxColors.ink, offset: Offset(2, 2))]),
                    ),
                  ),
              ]),
            ),
          );
        },
      ),
    );
  }
}

/// Bölüm başlık kartı ("BÖLÜM 2 · TANIKLAR").
class ChapterCard extends StatefulWidget {
  const ChapterCard({super.key, required this.chapter, required this.onDone});
  final String chapter;
  final VoidCallback onDone;
  @override
  State<ChapterCard> createState() => _ChapterCardState();
}

class _ChapterCardState extends State<ChapterCard> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 1900));
  bool _closed = false;

  @override
  void initState() {
    super.initState();
    _c.addStatusListener((s) {
      if (s == AnimationStatus.completed) _close();
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_c.status == AnimationStatus.dismissed) {
      final off = MotionScope.of(context) == RetroMotion.off;
      _c.duration = Duration(milliseconds: off ? 1200 : 1900);
      _c.forward();
    }
  }

  void _close() {
    if (_closed) return;
    _closed = true;
    widget.onDone();
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final off = MotionScope.of(context) == RetroMotion.off;
    final parts = widget.chapter.split(RegExp(r'\s*[·:—-]\s*'));
    final head = parts.length > 1 ? parts.first : 'BÖLÜM';
    final title = parts.length > 1 ? parts.sublist(1).join(' · ') : widget.chapter;
    return Semantics(
      liveRegion: true,
      label: widget.chapter,
      child: GestureDetector(
        key: const ValueKey('chapter-card'),
        behavior: HitTestBehavior.opaque,
        onTap: _close,
        child: AnimatedBuilder(
          animation: _c,
          builder: (context, _) {
            final t = _c.value;
            final inT = off ? 1.0 : const StepCurve(4).transform((t / 0.2).clamp(0, 1));
            final outT = off ? 0.0 : const StepCurve(4).transform(((t - 0.82) / 0.18).clamp(0, 1));
            final bar = inT * (1 - outT);
            return ColoredBox(
              color: Color.fromRGBO(7, 5, 12, (1 - outT)),
              child: ExcludeSemantics(
                child: Center(
                  child: Column(mainAxisSize: MainAxisSize.min, children: [
                    Opacity(opacity: inT * (1 - outT), child: Text(trUpper(head), style: PxText.pixel(14, color: PxColors.muted, spacing: 4))),
                    const SizedBox(height: 10),
                    Container(height: 4, width: 180 * bar, color: PxColors.gold),
                    const SizedBox(height: 12),
                    Opacity(
                      opacity: inT * (1 - outT),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Text(trUpper(title), textAlign: TextAlign.center, style: PxText.pixel(30, color: PxColors.gold, spacing: 3)),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Container(height: 4, width: 180 * bar, color: PxColors.gold),
                  ]),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

/// Altı bantlı, basamaklı perde: `t` 0→0.5 kapanır (bantlar soldan sırayla), 0.5→1 açılır.
class CurtainPainter extends CustomPainter {
  CurtainPainter(this.t);
  final double t;
  static const bands = 6;

  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()
      ..isAntiAlias = false
      ..color = const Color(0xFF07050C);
    final edge = Paint()
      ..isAntiAlias = false
      ..color = PxColors.gold;
    final bh = size.height / bands;
    for (var i = 0; i < bands; i++) {
      // Her bant bir öncekinden biraz geç başlar; kapsama 4 basamakta artar/azalır.
      final delay = i * 0.04;
      double cover;
      if (t <= 0.5) {
        cover = const StepCurve(4).transform(((t - delay) / (0.5 - 0.2)).clamp(0, 1));
      } else {
        cover = 1 - const StepCurve(4).transform(((t - 0.5 - delay) / (0.5 - 0.2)).clamp(0, 1));
      }
      if (cover <= 0) continue;
      final w = (size.width * cover).ceilToDouble();
      final rtl = t > 0.5; // açılırken sağa doğru çekilir
      final left = rtl ? size.width - w : 0.0;
      final top = (i * bh).floorToDouble();
      final rect = Rect.fromLTWH(left, top, w, ((i + 1) * bh).ceilToDouble() - top);
      canvas.drawRect(rect, p);
      if (cover < 1) canvas.drawRect(Rect.fromLTWH(rtl ? left : left + w - 4, top, 4, rect.height), edge);
    }
  }

  @override
  bool shouldRepaint(covariant CurtainPainter old) => old.t != t;
}
