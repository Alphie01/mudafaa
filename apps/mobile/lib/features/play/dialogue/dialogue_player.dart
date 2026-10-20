import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../design_system/motion/retro_motion.dart';
import '../../../design_system/motion/screen_fx.dart';
import '../../../design_system/tokens/px_colors.dart';
import '../../../design_system/tokens/px_text.dart';
import '../../../design_system/widgets/px_box.dart';
import 'line_info.dart';
import 'portrait.dart';

/// Görsel roman oynatıcısı: satırlar tek tek, daktilo hızıyla (~35 harf/sn) yazılır. Dokunuş satırı tamamlar,
/// sonraki dokunuş ilerletir; ATLA hepsini geçer, GEÇMİŞ önceki satırları açar. Ekran okuyucu tam metni hemen alır.
class DialoguePlayer extends StatefulWidget {
  const DialoguePlayer({
    super.key,
    required this.lines,
    required this.cast,
    required this.onDone,
    this.onLine,
    this.history = const [],
    this.charsPerSecond = 35,
  });

  final List<Map<String, dynamic>> lines;
  final Map<String, dynamic> cast;
  final VoidCallback onDone;

  /// Satır başladığında (arka plan / efekt için).
  final void Function(int index, Map<String, dynamic> line)? onLine;

  /// Bu oynatmadan önce oynatılmış satırlar (GEÇMİŞ için).
  final List<Map<String, dynamic>> history;
  final double charsPerSecond;

  @override
  State<DialoguePlayer> createState() => _DialoguePlayerState();
}

class _DialoguePlayerState extends State<DialoguePlayer> with TickerProviderStateMixin {
  late final AnimationController _type = AnimationController(vsync: this);
  late final AnimationController _blink = AnimationController(vsync: this, duration: const Duration(milliseconds: 900));
  final _focus = FocusNode(debugLabel: 'dialogue');
  int _index = 0;
  bool _done = false;
  bool _started = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_started) {
      _started = true;
      _startLine();
    }
  }

  @override
  void dispose() {
    _type.dispose();
    _blink.dispose();
    _focus.dispose();
    super.dispose();
  }

  LineInfo get _info => LineInfo.of(widget.lines[_index], widget.cast);

  bool get _instant => !MotionScope.of(context).typewriter || (MediaQuery.maybeAccessibleNavigationOf(context) ?? false);

  void _startLine() {
    if (widget.lines.isEmpty) {
      _finish();
      return;
    }
    final text = _info.text;
    _type.stop();
    if (_instant || text.isEmpty) {
      _type.value = 1;
    } else {
      final cps = _info.style == 'card' ? widget.charsPerSecond * 0.8 : widget.charsPerSecond;
      _type.duration = Duration(milliseconds: math.max(1, (text.characters.length / cps * 1000).round()));
      _type.forward(from: 0);
    }
    _blink.stop();
    if (MotionScope.of(context).ambient) _blink.repeat();
    final i = _index;
    final line = widget.lines[i];
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted && _index == i && !_done) widget.onLine?.call(i, line);
    });
  }

  bool get _typing => _type.value < 1;

  void _tap() {
    if (_done) return;
    if (_typing) {
      _type.stop();
      _type.value = 1;
      setState(() {});
      return;
    }
    _advance();
  }

  void _advance() {
    if (_index + 1 >= widget.lines.length) {
      _finish();
      return;
    }
    setState(() => _index++);
    _startLine();
  }

  void _skip() {
    // Atlanan satırların arka plan değişikliklerini kaçırmamak için son satırı da bildir.
    for (var i = _index + 1; i < widget.lines.length; i++) {
      final l = widget.lines[i];
      if (l['bg'] != null) widget.onLine?.call(i, {'bg': l['bg'], 'speaker': 'narrator', 'text': ''});
    }
    _finish();
  }

  void _finish() {
    if (_done) return;
    _done = true;
    _type.stop();
    _blink.stop();
    widget.onDone();
  }

  KeyEventResult _key(FocusNode _, KeyEvent e) {
    if (e is! KeyDownEvent) return KeyEventResult.ignored;
    if (e.logicalKey == LogicalKeyboardKey.space || e.logicalKey == LogicalKeyboardKey.enter) {
      _tap();
      return KeyEventResult.handled;
    }
    if (e.logicalKey == LogicalKeyboardKey.escape) {
      _skip();
      return KeyEventResult.handled;
    }
    return KeyEventResult.ignored;
  }

  void _openLog() {
    final shown = [...widget.history, ...widget.lines.take(_index + 1)];
    showLineLog(context, shown, widget.cast);
  }

  @override
  Widget build(BuildContext context) {
    if (widget.lines.isEmpty) return const SizedBox.shrink();
    final info = _info;
    final card = info.kind == SpeakerKind.card;
    return Focus(
      focusNode: _focus,
      autofocus: true,
      onKeyEvent: _key,
      child: Semantics(
        container: true,
        liveRegion: true,
        label: info.spoken,
        hint: 'İlerlemek için dokun',
        onTap: _tap,
        child: GestureDetector(
          key: const ValueKey('dialogue-tap'),
          behavior: HitTestBehavior.opaque,
          onTap: _tap,
          child: Stack(fit: StackFit.expand, children: [
            if (card) _CardLine(info: info, type: _type, blink: _blink) else _SpeechStage(info: info, type: _type, blink: _blink),
            Positioned(
              top: 8,
              right: 12,
              child: Row(children: [
                _Chip(label: 'GEÇMİŞ', onTap: _openLog),
                const SizedBox(width: 6),
                _Chip(label: 'ATLA ››', onTap: _skip),
              ]),
            ),
            Positioned(
              top: 12,
              left: 14,
              child: ExcludeSemantics(child: Text('${_index + 1}/${widget.lines.length}', style: PxText.pixel(11, color: card ? PxColors.dim : PxColors.muted))),
            ),
          ]),
        ),
      ),
    );
  }
}

/// Daktilo metni: görünen kısım animasyondan, ekran okuyucuya tam metin üst Semantics'ten gider.
class _Typed extends StatelessWidget {
  const _Typed({required this.text, required this.type, required this.style, this.textAlign = TextAlign.start, this.jitter = false});
  final String text;
  final Animation<double> type;
  final TextStyle style;
  final TextAlign textAlign;
  final bool jitter;

  @override
  Widget build(BuildContext context) {
    return ExcludeSemantics(
      child: AnimatedBuilder(
        animation: type,
        builder: (context, _) {
          final chars = text.characters;
          final n = (type.value * chars.length).floor().clamp(0, chars.length);
          final shown = chars.take(n).toString();
          final rest = chars.skip(n).toString();
          // Görünmeyen kısım saydam yazılır: satır kırılımı baştan sabit kalır, metin kaymaz.
          final rich = Text.rich(
            TextSpan(children: [
              TextSpan(text: shown, style: style),
              TextSpan(text: rest, style: style.copyWith(color: const Color(0x00000000))),
            ]),
            key: const ValueKey('typed'),
            textAlign: textAlign,
          );
          if (!jitter || n >= chars.length) return rich;
          return Transform.translate(offset: Offset(n % 7 == 0 ? 1 : 0, 0), child: rich);
        },
      ),
    );
  }
}

class _Next extends StatelessWidget {
  const _Next({required this.type, required this.blink, required this.color});
  final Animation<double> type;
  final Animation<double> blink;
  final Color color;
  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: Listenable.merge([type, blink]),
        builder: (context, _) => Opacity(opacity: type.value >= 1 && blink.value < 0.6 ? 1 : 0, child: Text('▼', style: PxText.pixel(14, color: color))),
      );
}

class _SpeechStage extends StatelessWidget {
  const _SpeechStage({required this.info, required this.type, required this.blink});
  final LineInfo info;
  final AnimationController type;
  final AnimationController blink;

  @override
  Widget build(BuildContext context) {
    final kind = info.kind;
    final thought = info.style == 'thought';
    final whisper = info.style == 'whisper';
    final phone = info.style == 'phone';
    final right = kind == SpeakerKind.player;
    final hasPortrait = !thought && (kind == SpeakerKind.anonymous || info.sprite != null) && kind != SpeakerKind.narrator;

    final (Color boxColor, Color textColor) = switch (kind) {
      _ when thought => (const Color(0xE6120D1C), PxColors.muted),
      _ when phone => (const Color(0xFF0F1A16), const Color(0xFFB8E6C4)),
      SpeakerKind.character => (PxColors.parchment, PxColors.ink),
      SpeakerKind.player => (const Color(0xFF1D3A66), PxColors.text),
      SpeakerKind.anonymous => (const Color(0xFF1A1428), PxColors.text),
      _ => (const Color(0xE62B2350), PxColors.text),
    };
    var style = PxText.body(whisper ? 19 : 22, color: whisper ? textColor.withValues(alpha: 0.75) : textColor);
    if (thought || kind == SpeakerKind.narrator) style = style.copyWith(fontStyle: FontStyle.italic);
    final text = thought ? '( ${info.text} )' : info.text;

    final plate = info.name == null || thought
        ? (thought ? _Plate(label: 'İÇ SES', color: PxColors.panel, textColor: PxColors.muted) : null)
        : _Plate(
            label: '${info.name}${whisper ? ' · FISILTI' : ''}${phone ? ' · TELEFON' : ''}',
            color: info.accent,
            textColor: info.kind == SpeakerKind.anonymous ? PxColors.gold : PxColors.white,
          );

    Widget box = Container(
      constraints: const BoxConstraints(minHeight: 132),
      child: PxBox(
        color: boxColor,
        padding: const EdgeInsets.fromLTRB(14, 16, 14, 12),
        child: Stack(children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: _Typed(text: text, type: type, style: style, textAlign: kind == SpeakerKind.narrator && !thought ? TextAlign.center : TextAlign.start, jitter: phone),
          ),
          Positioned(right: 0, bottom: -4, child: _Next(type: type, blink: blink, color: textColor)),
        ]),
      ),
    );
    if (phone) box = _PhoneFrame(blink: blink, child: box);

    final stepped = MotionScope.of(context) == RetroMotion.off ? Duration.zero : const Duration(milliseconds: 200);
    return LayoutBuilder(builder: (context, c) {
      final px = (c.maxHeight * 0.42 / 20).clamp(5.0, 10.0).floorToDouble();
      return Stack(fit: StackFit.expand, children: [
        Positioned(
          left: right ? null : 18,
          right: right ? 18 : null,
          bottom: 128,
          child: AnimatedSwitcher(
            duration: stepped,
            switchInCurve: const StepCurve(3),
            switchOutCurve: const StepCurve(2),
            transitionBuilder: (child, a) => FadeTransition(
              opacity: a,
              child: SlideTransition(position: Tween(begin: Offset(right ? 0.15 : -0.15, 0), end: Offset.zero).animate(a), child: child),
            ),
            child: hasPortrait
                ? KeyedSubtree(key: ValueKey('${info.speakerKey}/${info.expression}'), child: _Pedestal(color: info.accent, child: Portrait(info: info, px: px)))
                : const SizedBox.shrink(key: ValueKey('none')),
          ),
        ),
        Positioned(
          left: 12,
          right: 12,
          bottom: 12,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            children: [
              if (plate != null) Align(alignment: right ? Alignment.centerRight : Alignment.centerLeft, child: Padding(padding: const EdgeInsets.symmetric(horizontal: 10), child: plate)),
              box,
            ],
          ),
        ),
      ]);
    });
  }
}

/// Portrenin altındaki vurgu rengi zemin (karakter rengi).
class _Pedestal extends StatelessWidget {
  const _Pedestal({required this.color, required this.child});
  final Color color;
  final Widget child;
  @override
  Widget build(BuildContext context) => Column(mainAxisSize: MainAxisSize.min, children: [
        child,
        Container(height: 6, width: 120, color: color.withValues(alpha: 0.7)),
      ]);
}

class _Plate extends StatelessWidget {
  const _Plate({required this.label, required this.color, required this.textColor});
  final String label;
  final Color color;
  final Color textColor;
  @override
  Widget build(BuildContext context) => Container(
        key: const ValueKey('nameplate'),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(color: color, border: Border.all(color: PxColors.ink, width: 3)),
        child: Text(label, style: PxText.pixel(13, color: textColor, spacing: 1)),
      );
}

/// Telefon / hoparlör çerçevesi: ızgara deliği ve cızırtı çizgileri.
class _PhoneFrame extends StatelessWidget {
  const _PhoneFrame({required this.child, required this.blink});
  final Widget child;
  final Animation<double> blink;
  @override
  Widget build(BuildContext context) => Stack(clipBehavior: Clip.none, children: [
        child,
        Positioned(
          left: 6,
          right: 10,
          top: 4,
          height: 6,
          child: IgnorePointer(child: AnimatedBuilder(animation: blink, builder: (context, _) => CustomPaint(painter: _CracklePainter((blink.value * 8).floor())))),
        ),
      ]);
}

class _CracklePainter extends CustomPainter {
  _CracklePainter(this.frame);
  final int frame;
  @override
  void paint(Canvas canvas, Size size) {
    final p = Paint()..isAntiAlias = false;
    // Hoparlör ızgarası (sol) + rastgele cızırtı çubukları.
    for (var i = 0; i < 4; i++) {
      p.color = const Color(0xFF3F8A62);
      canvas.drawRect(Rect.fromLTWH(i * 4.0, 0, 2, 2), p);
      canvas.drawRect(Rect.fromLTWH(i * 4.0 + 2, 3, 2, 2), p);
    }
    final rng = math.Random(frame);
    for (var x = 24.0; x < size.width; x += 6) {
      final h = rng.nextInt(4).toDouble();
      if (h == 0) continue;
      p.color = const Color(0x996FD08D);
      canvas.drawRect(Rect.fromLTWH(x, 4 - h, 3, h), p);
    }
  }

  @override
  bool shouldRepaint(covariant _CracklePainter old) => old.frame != frame;
}

/// Tam ekran başlık kartı ("GECE 23.04 — NİLÜFER, DEPO SOKAĞI").
class _CardLine extends StatelessWidget {
  const _CardLine({required this.info, required this.type, required this.blink});
  final LineInfo info;
  final AnimationController type;
  final AnimationController blink;
  @override
  Widget build(BuildContext context) => ColoredBox(
        key: const ValueKey('card-line'),
        color: const Color(0xEB07050C),
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 28),
            child: Column(mainAxisSize: MainAxisSize.min, children: [
              Container(height: 3, width: 64, color: PxColors.gold),
              const SizedBox(height: 18),
              _Typed(text: trUpper(info.text), type: type, style: PxText.pixel(22, color: PxColors.parchment, spacing: 2).copyWith(height: 1.35), textAlign: TextAlign.center),
              const SizedBox(height: 18),
              Container(height: 3, width: 64, color: PxColors.gold),
              const SizedBox(height: 14),
              _Next(type: type, blink: blink, color: PxColors.gold),
            ]),
          ),
        ),
      );
}

class _Chip extends StatelessWidget {
  const _Chip({required this.label, required this.onTap});
  final String label;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Semantics(
        button: true,
        label: label,
        child: GestureDetector(
          onTap: onTap,
          behavior: HitTestBehavior.opaque,
          child: Container(
            constraints: const BoxConstraints(minHeight: 36, minWidth: 44),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
            decoration: BoxDecoration(color: const Color(0xE6120D1C), border: Border.all(color: PxColors.panelHi, width: 2)),
            child: ExcludeSemantics(child: Text(label, style: PxText.pixel(11, color: PxColors.gold, spacing: 1))),
          ),
        ),
      );
}

/// Konuşma geçmişi: kaydırılabilir satır listesi.
Future<void> showLineLog(BuildContext context, List<Map<String, dynamic>> lines, Map<String, dynamic> cast) {
  return showModalBottomSheet<void>(
    context: context,
    backgroundColor: PxColors.bg,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(),
    builder: (ctx) => SafeArea(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxHeight: MediaQuery.of(ctx).size.height * 0.8),
        child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, mainAxisSize: MainAxisSize.min, children: [
          Padding(padding: const EdgeInsets.fromLTRB(16, 16, 16, 8), child: Text('GEÇMİŞ', style: PxText.title)),
          if (lines.isEmpty) Padding(padding: const EdgeInsets.all(16), child: Text('Henüz konuşma yok.', style: PxText.body(19, color: PxColors.muted))),
          Flexible(
            child: ListView.builder(
              key: const ValueKey('line-log'),
              reverse: true,
              shrinkWrap: true,
              padding: const EdgeInsets.fromLTRB(16, 4, 20, 16),
              itemCount: lines.length,
              itemBuilder: (_, i) {
                final info = LineInfo.of(lines[lines.length - 1 - i], cast);
                final italic = info.kind == SpeakerKind.narrator || info.style == 'thought';
                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                    Container(width: 4, height: 18, margin: const EdgeInsets.only(right: 8, top: 2), color: info.kind == SpeakerKind.character ? info.accent : PxColors.panelHi),
                    Expanded(
                      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        if (info.name != null && info.kind != SpeakerKind.card) Text(info.name!, style: PxText.pixel(11, color: PxColors.gold)),
                        Text(
                          info.kind == SpeakerKind.card ? trUpper(info.text) : info.text,
                          style: info.kind == SpeakerKind.card ? PxText.pixel(13, color: PxColors.parchment) : PxText.body(20, color: italic ? PxColors.muted : PxColors.text).copyWith(fontStyle: italic ? FontStyle.italic : null),
                        ),
                      ]),
                    ),
                  ]),
                );
              },
            ),
          ),
        ]),
      ),
    ),
  );
}
