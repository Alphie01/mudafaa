import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/auth.dart';
import '../../data/providers.dart';
import '../../design_system/motion/motion_toggle.dart';
import '../../design_system/tokens/px_colors.dart';
import '../../design_system/tokens/px_text.dart';
import '../../design_system/widgets/px_box.dart';
import '../../design_system/widgets/states.dart';

/// Ana menü: başlık, adliye illüstrasyonu, DEVAM ET, DAVA DOSYALARI, profil ve sonuç sayıları.
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final me = ref.watch(meProvider);
    return Scaffold(
      body: SafeArea(
        child: me.when(
          loading: () => const LoadingView(),
          error: (e, _) => ErrorView(message: '$e', onRetry: () => ref.invalidate(meProvider)),
          data: (m) {
            final user = m['user'] as Map;
            final stats = m['stats'] as Map;
            final counts = stats['outcomeCounts'] as Map;
            final active = m['activeSession'] as Map?;
            final newCases = m['newCases'] as int;
            return RefreshIndicator(
              onRefresh: () async => ref.invalidate(meProvider),
              child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 28, 20, 26),
                children: [
                  Text('BİR AVUKATIN DAVA DEFTERİ', textAlign: TextAlign.center, style: PxText.eyebrow),
                  const SizedBox(height: 6),
                  Text('MÜDAFAA', textAlign: TextAlign.center, style: PxText.pixel(56, color: PxColors.gold, spacing: 2)),
                  Text('Her dosyanın bir hikâyesi var.', textAlign: TextAlign.center, style: PxText.body(22, color: PxColors.muted)),
                  const SizedBox(height: 18),
                  const _Courthouse(),
                  const SizedBox(height: 20),
                  if (active != null) ...[
                    PxButton(
                      label: 'Devam et',
                      onTap: () async {
                        await context.push('/play/${active['id']}');
                        ref.invalidate(meProvider);
                      },
                    ),
                    Padding(
                      padding: const EdgeInsets.only(top: 6, bottom: 12),
                      child: Text('Dava #${(active['caseNumber'] as int).toString().padLeft(2, '0')} · ${active['progressLabel'] ?? active['caseTitle']}', textAlign: TextAlign.center, style: PxText.body(19, color: PxColors.muted)),
                    ),
                  ],
                  PxButton(
                    label: 'Dava dosyaları',
                    tone: active == null ? PxTone.gold : PxTone.blue,
                    trailing: newCases > 0 ? _Badge('$newCases yeni') : null,
                    onTap: () async {
                      await context.push('/cases');
                      ref.invalidate(meProvider);
                    },
                  ),
                  const SizedBox(height: 14),
                  Row(children: [
                    const Expanded(flex: 3, child: MotionToggle()),
                    const SizedBox(width: 10),
                    Expanded(flex: 2, child: PxButton(label: 'Çıkış', tone: PxTone.secondary, height: 46, fontSize: 14, onTap: AuthActions.signOut)),
                  ]),
                  const SizedBox(height: 22),
                  PxBox(
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(trUpper('Av. ${user['displayName']}'), style: PxText.pixel(16, color: PxColors.gold)),
                      const SizedBox(height: 4),
                      Text('Rütbe: ${(stats['rank'] as Map)['label']} · ${stats['xp']} XP', style: PxText.body(20)),
                      const SizedBox(height: 8),
                      Container(height: 10, color: PxColors.ink, alignment: Alignment.centerLeft, child: FractionallySizedBox(widthFactor: ((stats['progressPct'] as int) / 100).clamp(0, 1).toDouble(), child: Container(color: PxColors.gold))),
                      const SizedBox(height: 10),
                      Wrap(spacing: 14, children: [
                        _Count(color: PxColors.greenHi, label: 'Beraat ${counts['ACQUITTAL']}'),
                        _Count(color: PxColors.gold, label: 'İndirim ${counts['REDUCED']}'),
                        _Count(color: PxColors.coral, label: 'Mahkûmiyet ${counts['CONVICTION']}'),
                      ]),
                    ]),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  const _Badge(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), color: PxColors.redHi, child: Text(text, style: PxText.pixel(11, color: PxColors.white)));
}

class _Count extends StatelessWidget {
  const _Count({required this.color, required this.label});
  final Color color;
  final String label;
  @override
  Widget build(BuildContext context) => Row(mainAxisSize: MainAxisSize.min, children: [Container(width: 10, height: 10, color: color), const SizedBox(width: 6), Text(label, style: PxText.body(19))]);
}

/// Adliye illüstrasyonu (gece gökyüzü + sütunlu bina + konuşma balonu), piksel bloklarla.
class _Courthouse extends StatelessWidget {
  const _Courthouse();
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 190,
      child: Stack(children: [
        Positioned.fill(child: Container(color: const Color(0xFF241C40))),
        for (final (x, y) in const [(20.0, 18.0), (70.0, 40.0), (300.0, 22.0), (250.0, 50.0), (160.0, 12.0), (330.0, 70.0)])
          Positioned(left: x, top: y, child: Container(width: 3, height: 3, color: PxColors.parchment)),
        Positioned(left: 0, right: 0, bottom: 0, height: 120, child: Column(children: [
          Container(height: 18, margin: const EdgeInsets.symmetric(horizontal: 60), color: PxColors.parchmentDk, alignment: Alignment.center, child: Text('ADLİYE', style: PxText.pixel(11, color: PxColors.ink, spacing: 3))),
          Expanded(child: Container(margin: const EdgeInsets.symmetric(horizontal: 70), color: PxColors.parchment, child: Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: List.generate(5, (_) => Container(width: 12, color: PxColors.parchmentDk))))),
          Container(height: 10, color: PxColors.parchmentDk),
        ])),
        Positioned(right: 16, top: 20, child: PxBox(color: PxColors.white, padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4), child: Text('Müvekkilim masum, Sayın Hâkim!', style: PxText.body(16, color: PxColors.ink)))),
      ]),
    );
  }
}
