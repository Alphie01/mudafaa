import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../widgets/px_box.dart';
import 'retro_motion.dart';

/// Hareket ayarı düğmesi: Tam → Azaltılmış → Kapalı döngüsü (kalıcı).
class MotionToggle extends ConsumerWidget {
  const MotionToggle({super.key, this.height = 46, this.fontSize = 14});
  final double height;
  final double fontSize;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final motion = ref.watch(retroMotionProvider);
    final forced = MediaQuery.maybeDisableAnimationsOf(context) ?? false;
    final next = RetroMotion.values[(motion.index + 1) % RetroMotion.values.length];
    return PxButton(
      label: 'Hareket: ${forced ? 'Kapalı (sistem)' : motion.label}',
      tone: PxTone.secondary,
      height: height,
      fontSize: fontSize,
      onTap: forced ? null : () => ref.read(retroMotionProvider.notifier).set(next),
    );
  }
}
