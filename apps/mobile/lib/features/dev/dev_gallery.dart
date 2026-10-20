import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';

import '../../design_system/backdrops/backdrop_view.dart';
import '../../design_system/motion/motion_toggle.dart';
import '../../design_system/tokens/px_colors.dart';
import '../../design_system/tokens/px_text.dart';
import '../../design_system/widgets/px_box.dart';
import '../../design_system/widgets/states.dart';
import '../play/common.dart';
import '../play/play_shell.dart';
import '../play/session_controller.dart';

/// Örnek görünümlerin yolu (pubspec'te varlık olarak tanımlı; testler de aynı dosyaları okur).
const fixturesDir = 'test/fixtures';

Future<Map<String, dynamic>> loadFixture(String id) async => m(jsonDecode(await rootBundle.loadString('$fixturesDir/$id.json')));

/// `/_dev/play` (yalnızca debug): el yazımı örnek görünümleri gerçek node bileşenlerinden geçirir.
class DevGalleryScreen extends StatelessWidget {
  const DevGalleryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(children: [
          PxHeader(eyebrow: 'Geliştirici', title: 'Oyun galerisi', onBack: () => context.canPop() ? context.pop() : context.go('/')),
          Expanded(
            child: FutureBuilder<String>(
              future: rootBundle.loadString('$fixturesDir/index.json'),
              builder: (context, snap) {
                if (!snap.hasData) return const LoadingView(label: 'Örnekler yükleniyor…');
                final items = ms(jsonDecode(snap.data!));
                return ListView(padding: const EdgeInsets.fromLTRB(16, 14, 20, 30), children: [
                  const Row(children: [Expanded(child: MotionToggle(fontSize: 12)), SizedBox(width: 10), Expanded(child: SoundToggle(fontSize: 12))]),
                  const SizedBox(height: 10),
                  const _SlowMo(),
                  const SizedBox(height: 10),
                  PxButton(label: 'Yazı tipi denetimi', tone: PxTone.secondary, height: 46, fontSize: 14, onTap: () => context.push('/_dev/glyphs')),
                  const SizedBox(height: 16),
                  Text('AKIŞLAR', style: PxText.eyebrow),
                  const SizedBox(height: 8),
                  for (final it in items)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 10),
                      child: GestureDetector(
                        onTap: () => context.push('/_dev/play/${it['id']}'),
                        child: PxBox(
                          color: PxColors.parchment,
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Text(trUpper(it['title'] as String), style: PxText.pixel(15, color: PxColors.ink)),
                            Text(it['description'] as String, style: PxText.body(18, color: PxColors.parchmentInk)),
                          ]),
                        ),
                      ),
                    ),
                  const SizedBox(height: 10),
                  Text('ARKA PLANLAR', style: PxText.eyebrow),
                  const SizedBox(height: 8),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    mainAxisSpacing: 10,
                    crossAxisSpacing: 10,
                    childAspectRatio: 0.75,
                    children: [
                      for (final b in backdropNames)
                        GestureDetector(
                          onTap: () => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => _BackdropPreview(name: b))),
                          child: Container(
                            decoration: BoxDecoration(border: Border.all(color: PxColors.ink, width: 3)),
                            child: Stack(fit: StackFit.expand, children: [
                              BackdropView(name: b, cell: 2),
                              Positioned(left: 0, bottom: 0, child: Container(color: PxColors.ink, padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), child: Text(b, style: PxText.pixel(11, color: PxColors.gold)))),
                            ]),
                          ),
                        ),
                    ],
                  ),
                ]);
              },
            ),
          ),
        ]),
      ),
    );
  }
}

/// Yavaş çekim (timeDilation ×5): perde ve kart geçişlerini kare kare görmek için.
class _SlowMo extends StatefulWidget {
  const _SlowMo();
  @override
  State<_SlowMo> createState() => _SlowMoState();
}

class _SlowMoState extends State<_SlowMo> {
  @override
  Widget build(BuildContext context) => PxButton(
        label: 'Yavaş çekim: ${timeDilation > 1 ? 'Açık' : 'Kapalı'}',
        tone: PxTone.secondary,
        height: 46,
        fontSize: 14,
        onTap: () => setState(() => timeDilation = timeDilation > 1 ? 1 : 5),
      );
}

/// `/_dev/glyphs`: iki ailenin bütün büyük harfleri (A–Z + ÇĞİÖŞÜ) 9–36 px ve 400/600/700 ağırlıkta.
class GlyphCheckScreen extends StatelessWidget {
  const GlyphCheckScreen({super.key});
  static const caps = 'ABCÇDEFGĞHIİJKLMNOÖPQRSŞTUÜVWXYZ';
  static const sample = 'LEYLA · GECE 23.04 · BİR SES · Gece Bekçisinin Sırrı';
  static const sizes = [9.0, 11.0, 13.0, 16.0, 20.0, 24.0, 30.0, 36.0];

  @override
  Widget build(BuildContext context) {
    Widget block(String title, TextStyle Function(double) style) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Padding(padding: const EdgeInsets.only(top: 12, bottom: 4), child: Text(title, style: PxText.eyebrow)),
          for (final s in sizes) ...[
            Text('${s.toInt()}px  $caps', style: style(s)),
            Text(sample, style: style(s)),
          ],
        ]);
    return Scaffold(
      body: SafeArea(
        child: Column(children: [
          PxHeader(eyebrow: 'Geliştirici', title: 'Yazı tipi denetimi', onBack: () => context.pop()),
          Expanded(
            child: ListView(padding: const EdgeInsets.fromLTRB(12, 8, 12, 30), children: [
              block('PIXELIFY SANS 400', (s) => PxText.pixel(s, weight: FontWeight.w400)),
              block('PIXELIFY SANS 600', (s) => PxText.pixel(s, weight: FontWeight.w600)),
              block('PIXELIFY SANS 700 (+1 harf aralığı)', (s) => PxText.pixel(s, spacing: 1)),
              block('VT323', (s) => PxText.body(s)),
              Text('abcçdefgğhıijklmnoöprsştuüvyz 0123456789 .,:;!?“”’()—·', style: PxText.body(20)),
              Text('abcçdefgğhıijklmnoöprsştuüvyz 0123456789 .,:;!?“”’()—·', style: PxText.pixel(16, weight: FontWeight.w400)),
            ]),
          ),
        ]),
      ),
    );
  }
}

class _BackdropPreview extends StatelessWidget {
  const _BackdropPreview({required this.name});
  final String name;
  @override
  Widget build(BuildContext context) => Scaffold(
        body: SafeArea(
          child: Column(children: [
            PxHeader(eyebrow: 'Arka plan', title: name, onBack: () => Navigator.pop(context)),
            Expanded(child: BackdropView(name: name)),
          ]),
        ),
      );
}

/// Bir örnek akışı oynatır: her aksiyon bir sonraki adıma geçer (sunucu yerine).
class DevPlayScreen extends StatefulWidget {
  const DevPlayScreen({super.key, required this.fixture});
  final String fixture;
  @override
  State<DevPlayScreen> createState() => _DevPlayScreenState();
}

class _DevPlayScreenState extends State<DevPlayScreen> {
  List<Map<String, dynamic>>? _steps;
  int _i = 0;
  bool _busy = false;
  String? _error;
  PlayMemory _memory = PlayMemory();

  @override
  void initState() {
    super.initState();
    loadFixture(widget.fixture).then((f) {
      if (mounted) setState(() => _steps = ms(f['steps']));
    });
  }

  Future<void> _dispatch(Map<String, dynamic> action) async {
    if (_busy || _steps == null) return;
    if (_i + 1 >= _steps!.length) {
      setState(() => _error = 'Örnek akış bitti — başa dönmek için bu banda dokun.');
      return;
    }
    setState(() => _busy = true);
    await Future<void>.delayed(const Duration(milliseconds: 250));
    if (!mounted) return;
    setState(() {
      _busy = false;
      _i++;
    });
  }

  void _restart() => setState(() {
        _error = null;
        _i = 0;
        _memory = PlayMemory();
      });

  @override
  Widget build(BuildContext context) {
    final steps = _steps;
    if (steps == null) return const PlayLoading();
    return PlayShell(
      key: ValueKey(_memory),
      view: steps[_i],
      memory: _memory,
      busy: _busy,
      error: _error,
      onClearError: _restart,
      dispatch: _dispatch,
      onExit: () => context.canPop() ? context.pop() : context.go('/_dev/play'),
    );
  }
}
