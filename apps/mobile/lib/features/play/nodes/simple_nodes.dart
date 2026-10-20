import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../design_system/motion/retro_motion.dart';
import '../../../design_system/motion/screen_fx.dart';
import '../../../design_system/tokens/px_colors.dart';
import '../../../design_system/tokens/px_text.dart';
import '../../../design_system/widgets/px_box.dart';
import '../common.dart';

/// Genel A–D seçimi ve delil kartı + A–D inceleme.
class ChoiceNode extends StatelessWidget {
  const ChoiceNode({super.key, required this.view, required this.dispatch, required this.busy});
  final Map<String, dynamic> view;
  final Dispatch dispatch;
  final bool busy;
  @override
  Widget build(BuildContext context) {
    final node = m(view['node']);
    final prompt = node['prompt'] == null ? null : m(node['prompt']);
    final evidence = node['evidence'] == null ? null : m(node['evidence']);
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      if (evidence != null) ...[EvidenceCardView(card: evidence), const SizedBox(height: 6), if (evidence['description'] != null) Text(evidence['description'] as String, style: PxText.body(19, color: PxColors.muted)), const SizedBox(height: 12)],
      if (prompt != null) ...[SpeechLines(lines: [prompt], cast: m(view['cast'])), const SizedBox(height: 4)],
      ChoiceList(choices: ms(view['choices']), dispatch: dispatch, busy: busy),
    ]);
  }
}

/// Karar ekranı: damga üç basamakta çarpar (sarsıntıyla), toplam skor sayarak yükselir; ardından varsa epilog oynar.
/// Skor dökümü ve rapor epilogdan sonra erişilebilir kalır.
class ResultNode extends StatefulWidget {
  const ResultNode({super.key, required this.view, this.active = true, this.onSlam, this.onIntroDone, this.onReplayEpilogue});
  final Map<String, dynamic> view;

  /// Gövde görünür mü (perde/satırlar bitmeden animasyon başlamaz).
  final bool active;
  final VoidCallback? onSlam;
  final VoidCallback? onIntroDone;
  final VoidCallback? onReplayEpilogue;

  @override
  State<ResultNode> createState() => _ResultNodeState();
}

class _ResultNodeState extends State<ResultNode> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 2000));
  bool _started = false;
  bool _slammed = false;

  @override
  void initState() {
    super.initState();
    _c.addListener(() {
      if (!_slammed && _c.value >= 0.15) {
        _slammed = true;
        widget.onSlam?.call();
      }
    });
    _c.addStatusListener((s) {
      if (s == AnimationStatus.completed) widget.onIntroDone?.call();
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _maybeStart();
  }

  @override
  void didUpdateWidget(ResultNode old) {
    super.didUpdateWidget(old);
    _maybeStart();
  }

  void _maybeStart() {
    if (_started || !widget.active) return;
    _started = true;
    if (MotionScope.of(context) == RetroMotion.off) {
      _slammed = true;
      _c.value = 1;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) widget.onIntroDone?.call();
      });
    } else {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _c.forward();
      });
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final view = widget.view;
    final node = m(view['node']);
    final outcome = m(node['outcome']);
    final sentence = m(node['sentence']);
    final thresholds = m(node['thresholds']);
    final total = node['total'] as int;
    final scaleMax = thresholds['scaleMax'] as int;
    final stampColor = switch (outcome['tone']) { 'green' => PxColors.green, 'amber' => const Color(0xFFB07A12), _ => PxColors.red };
    final sessionId = m(view['session'])['id'] as String;
    final epilogue = ms(node['epilogue']);
    return AnimatedBuilder(
      animation: _c,
      builder: (context, _) {
        final t = _started ? _c.value : 0.0;
        // Damga: 0–0.15 arası üç basamak (büyük → ezik → yerinde).
        final st = (t / 0.15).clamp(0.0, 1.0);
        final stampStep = st < 1 / 3 ? 0 : (st < 2 / 3 ? 1 : 2);
        final stampScale = t <= 0 ? 2.2 : const [2.2, 1.35, 1.0][stampStep];
        final stampOpacity = t <= 0 ? 0.0 : const [0.5, 0.85, 1.0][stampStep];
        // Skor: 0.2–0.85 arası 20 basamakta sayar.
        final ct = const StepCurve(20).transform(((t - 0.2) / 0.65).clamp(0.0, 1.0));
        final shown = (total * ct).round();
        final rest = t >= 0.9;
        return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          if (node['strategyLabel'] != null) Text('STRATEJİ: ${trUpper(node['strategyLabel'] as String)}', style: PxText.eyebrow),
          const SizedBox(height: 18),
          Center(
            child: Opacity(
              opacity: stampOpacity,
              child: Transform.rotate(
                angle: -0.06,
                child: Transform.scale(
                  scale: stampScale,
                  child: Container(
                    key: const ValueKey('verdict-stamp'),
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                    decoration: BoxDecoration(color: stampColor, border: Border.all(color: PxColors.ink, width: 4), boxShadow: const [BoxShadow(color: PxColors.ink, offset: Offset(5, 5))]),
                    child: Text(trUpper(outcome['stamp'] as String), style: PxText.pixel(32, color: PxColors.white, spacing: 2)),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 18),
          Opacity(opacity: t >= 0.15 ? 1 : 0, child: Text('${sentence['demand']}  ›  ${sentence['result']}', textAlign: TextAlign.center, style: PxText.body(20, color: PxColors.gold))),
          const SizedBox(height: 10),
          Opacity(opacity: t >= 0.18 ? 1 : 0, child: PxCard(child: Text(node['verdictText'] as String))),
          const SizedBox(height: 10),
          for (final r in (node['reasoning'] as List).cast<String>()) Padding(padding: const EdgeInsets.only(bottom: 6), child: Text('· $r', style: PxText.body(19, color: PxColors.muted))),
          const SizedBox(height: 10),
          PxBox(
            child: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Text('SKOR DÖKÜMÜ', style: PxText.eyebrow),
              for (final row in ms(node['breakdown']))
                Row(children: [
                  Expanded(child: Text(row['label'] as String, style: PxText.body(19))),
                  Text(_signed(row['value'] as int), style: PxText.body(20, color: switch (row['tone']) { 'success' => PxColors.greenHi, 'error' => PxColors.coral, _ => PxColors.text })),
                ]),
              const Divider(color: PxColors.panelHi),
              Row(children: [
                Expanded(child: Text('TOPLAM', style: PxText.pixel(14, color: PxColors.gold))),
                Semantics(label: 'Toplam $total', child: ExcludeSemantics(child: Text('$shown', key: const ValueKey('result-total'), style: PxText.pixel(18, color: PxColors.gold)))),
              ]),
              const SizedBox(height: 10),
              LayoutBuilder(builder: (ctx, c) {
                final bands = ms(thresholds['bands']);
                final from = bands.isEmpty ? 0 : bands.first['from'] as int;
                return Stack(clipBehavior: Clip.none, children: [
                  Row(children: [
                    for (var i = 0; i < bands.length; i++)
                      Expanded(
                        flex: (((i + 1 < bands.length ? bands[i + 1]['from'] as int : scaleMax) - (bands[i]['from'] as int)).clamp(1, 1 << 30)),
                        child: Container(height: 14, color: switch (bands[i]['tone']) { 'green' => PxColors.green, 'amber' => const Color(0xFFB07A12), _ => PxColors.red }),
                      ),
                  ]),
                  Positioned(left: ((shown.clamp(0, scaleMax) - from) / scaleMax * c.maxWidth).clamp(0, c.maxWidth - 4), top: -4, child: Container(width: 4, height: 22, color: PxColors.white)),
                ]);
              }),
              const SizedBox(height: 10),
              Opacity(opacity: rest ? 1 : 0, child: Text('Rütbe puanı +${m(node['xp'])['gained']}', style: PxText.pixel(14, color: PxColors.greenHi))),
            ]),
          ),
          const SizedBox(height: 16),
          if (epilogue.isNotEmpty && widget.onReplayEpilogue != null) ...[
            PxButton(label: 'Epiloğu izle', tone: PxTone.blue, onTap: rest ? widget.onReplayEpilogue : null),
            const SizedBox(height: 10),
          ],
          PxButton(label: 'Dava raporu', onTap: rest ? () => context.push('/sessions/$sessionId/report') : null),
          const SizedBox(height: 10),
          PxButton(label: 'Ana menü', tone: PxTone.secondary, onTap: () => context.go('/')),
        ]);
      },
    );
  }

  static String _signed(int v) => v > 0 ? '+$v' : v < 0 ? '−${v.abs()}' : '0';
}
