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
                  const MotionToggle(),
                  const SizedBox(height: 10),
                  const _SlowMo(),
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
