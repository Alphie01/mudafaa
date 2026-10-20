import 'package:flutter/material.dart';

import '../tokens/px_colors.dart';
import '../tokens/px_text.dart';
import 'px_box.dart';

class LoadingView extends StatelessWidget {
  const LoadingView({super.key, this.label = 'Dosya açılıyor…'});
  final String label;
  @override
  Widget build(BuildContext context) => Center(child: Text(label, style: PxText.pixel(16, color: PxColors.muted)));
}

class ErrorView extends StatelessWidget {
  const ErrorView({super.key, required this.message, required this.onRetry});
  final String message;
  final VoidCallback onRetry;
  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Text(message, textAlign: TextAlign.center, style: PxText.body(21, color: PxColors.coral)),
            const SizedBox(height: 16),
            PxButton(label: 'Tekrar dene', onTap: onRetry, expand: false),
          ]),
        ),
      );
}

/// Ekran başlığı: geri düğmesi, üst etiket ve başlık.
class PxHeader extends StatelessWidget {
  const PxHeader({super.key, this.eyebrow, this.title, this.onBack, this.trailing});
  final String? eyebrow;
  final String? title;
  final VoidCallback? onBack;
  final Widget? trailing;
  @override
  Widget build(BuildContext context) {
    return Container(
      color: PxColors.ink,
      padding: const EdgeInsets.fromLTRB(12, 10, 16, 10),
      child: Row(children: [
        if (onBack != null)
          Semantics(
            button: true,
            label: 'Geri',
            child: GestureDetector(
              onTap: onBack,
              child: Container(width: 44, height: 44, margin: const EdgeInsets.only(right: 10), decoration: BoxDecoration(color: PxColors.panel, border: Border.all(color: PxColors.panelHi, width: 3)), child: Center(child: Text('<', style: PxText.pixel(20, color: PxColors.gold)))),
            ),
          ),
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            if (eyebrow != null) Text(trUpper(eyebrow!), style: PxText.eyebrow),
            if (title != null) Text(title!, style: PxText.title, maxLines: 2, overflow: TextOverflow.ellipsis),
          ]),
        ),
        ?trailing,
      ]),
    );
  }
}
