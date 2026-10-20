import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/providers.dart';
import '../../data/store.dart';
import '../../design_system/tokens/px_colors.dart';
import '../../design_system/tokens/px_text.dart';
import '../../design_system/widgets/px_box.dart';
import '../premium/premium_screen.dart';

/// Ücretli ve kilitli dava kartının satın alma sayfası.
Future<void> showUnlockSheet(BuildContext context, Map<String, dynamic> card) {
  return showModalBottomSheet<void>(
    context: context,
    backgroundColor: PxColors.bg,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(),
    builder: (_) => UnlockSheet(card: card),
  );
}

/// SATIN AL (dava kilidi) ve, premium etkin ve hak varsa, PREMİUM İLE AÇ (x/3).
class UnlockSheet extends ConsumerWidget {
  const UnlockSheet({super.key, required this.card});
  final Map<String, dynamic> card;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final store = ref.watch(storeProvider);
    final premium = PremiumInfo.fromMe(ref.watch(meProvider).value);
    final caseId = card['id'] as String;
    final canBuy = store.available && !store.busy;
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 16, 20, 20),
        child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Text('DAVA #${(card['number'] as int).toString().padLeft(2, '0')}', style: PxText.eyebrow),
          const SizedBox(height: 4),
          Text(card['title'] as String, style: PxText.title),
          const SizedBox(height: 10),
          Text('Bu dosya ücretli. Bir kez aç, hep sende kalsın.', style: PxText.body(20)),
          Text('Fiyat: ${store.casePrice}', style: PxText.body(20, color: PxColors.gold)),
          const SizedBox(height: 16),
          PxButton(
            key: const ValueKey('unlock-buy'),
            label: 'Satın al · ${pixelPrice(store.casePrice)}',
            onTap: canBuy
                ? () {
                    ref.read(storeProvider.notifier).buyCase(caseId);
                    Navigator.pop(context);
                  }
                : null,
          ),
          if (premium.active && premium.picksLeft > 0) ...[
            const SizedBox(height: 12),
            PxButton(
              key: const ValueKey('unlock-premium'),
              label: 'Premium ile aç (${premium.picksLeft}/$premiumPicksPerPeriod)',
              tone: PxTone.green,
              onTap: () async {
                final ok = await ref.read(storeProvider.notifier).premiumPick(caseId);
                if (ok && context.mounted) Navigator.pop(context);
              },
            ),
          ] else if (!premium.active) ...[
            const SizedBox(height: 12),
            PxButton(
              key: const ValueKey('unlock-go-premium'),
              label: 'Premium ile her ay 3 dava',
              tone: PxTone.secondary,
              height: 46,
              fontSize: 14,
              onTap: () {
                Navigator.pop(context);
                context.push('/premium');
              },
            ),
          ] else
            Padding(
              padding: const EdgeInsets.only(top: 12),
              child: Text('Bu dönemki premium seçim hakların bitti.', style: PxText.body(18, color: PxColors.muted)),
            ),
          if (!store.available && !store.loading)
            Padding(
              key: const ValueKey('store-unavailable'),
              padding: const EdgeInsets.only(top: 12),
              child: Text('Mağaza bu cihazda kullanılamıyor (web ya da emülatör).', style: PxText.body(18, color: PxColors.muted)),
            ),
        ]),
      ),
    );
  }
}
