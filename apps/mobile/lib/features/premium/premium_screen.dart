import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/providers.dart';
import '../../data/store.dart';
import '../../design_system/tokens/px_colors.dart';
import '../../design_system/tokens/px_text.dart';
import '../../design_system/widgets/px_box.dart';
import '../../design_system/widgets/states.dart';

/// Premium aboneliğin kalan seçim hakkı (`GET /me` → premium).
const premiumPicksPerPeriod = 3;

/// `GET /me` yanıtındaki premium durumu.
class PremiumInfo {
  const PremiumInfo({required this.active, this.expiresAt, this.picksLeft = 0});
  factory PremiumInfo.fromMe(Map<String, dynamic>? me) {
    final p = me?['premium'] as Map?;
    if (p == null) return const PremiumInfo(active: false);
    return PremiumInfo(active: p['active'] == true, expiresAt: DateTime.tryParse('${p['expiresAt']}')?.toLocal(), picksLeft: (p['picksLeft'] as int?) ?? 0);
  }
  final bool active;
  final DateTime? expiresAt;
  final int picksLeft;
}

String _date(DateTime d) => '${d.day.toString().padLeft(2, '0')}.${d.month.toString().padLeft(2, '0')}.${d.year}';

/// Premium: avantajlar, abonelik durumu, ABONE OL ve SATIN ALIMLARI GERİ YÜKLE.
class PremiumScreen extends ConsumerWidget {
  const PremiumScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final me = ref.watch(meProvider);
    final store = ref.watch(storeProvider);
    ref.listen(storeProvider.select((s) => s.messageSeq), (_, _) {
      final msg = ref.read(storeProvider).message;
      if (msg != null) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
    });
    return Scaffold(
      body: SafeArea(
        child: Column(children: [
          PxHeader(eyebrow: 'Büro aboneliği', title: 'Premium', onBack: () => context.pop()),
          Expanded(
            child: me.when(
              loading: () => const LoadingView(),
              error: (e, _) => ErrorView(message: '$e', onRetry: () => ref.invalidate(meProvider)),
              data: (m) => _Body(premium: PremiumInfo.fromMe(m), store: store, anonymous: (m['user'] as Map?)?['isAnonymous'] == true),
            ),
          ),
        ]),
      ),
    );
  }
}

class _Body extends ConsumerWidget {
  const _Body({required this.premium, required this.store, required this.anonymous});
  final PremiumInfo premium;
  final StoreState store;
  final bool anonymous;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final canBuy = store.available && !store.busy;
    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 20, 26),
      children: [
        PxBox(
          key: const ValueKey('premium-status'),
          color: premium.active ? PxColors.green : PxColors.panel,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(premium.active ? 'PREMİUM ETKİN' : 'PREMİUM DEĞİLSİN', style: PxText.pixel(16, color: premium.active ? PxColors.white : PxColors.gold)),
            const SizedBox(height: 6),
            if (premium.active) ...[
              if (premium.expiresAt != null) Text('Dönem sonu: ${_date(premium.expiresAt!)}', style: PxText.body(20)),
              Text('Bu dönem kalan dava seçimi: ${premium.picksLeft}/$premiumPicksPerPeriod', style: PxText.body(20)),
            ] else
              Text('Abone ol, reklamsız oyna ve her ay 3 dosyayı kalıcı olarak seç.', style: PxText.body(20, color: PxColors.muted)),
          ]),
        ),
        const SizedBox(height: 18),
        PxCard(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('ABONELİK NELER KAZANDIRIR', style: PxText.pixel(13, color: PxColors.parchmentInk)),
            const SizedBox(height: 8),
            for (final b in const [
              'Reklamsız oyun.',
              'Her fatura döneminde 3 ücretli dava seç; seçtiğin dosyalar abonelik bitse de sende kalır.',
              'Kullanılmayan seçim hakkı sonraki aya devretmez.',
              'İstediğin zaman mağaza hesabından iptal edebilirsin.',
            ])
              Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Container(width: 8, height: 8, margin: const EdgeInsets.only(top: 6, right: 8), color: PxColors.red),
                  Expanded(child: Text(b)),
                ]),
              ),
          ]),
        ),
        const SizedBox(height: 18),
        if (anonymous)
          Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Text('Misafir hesaptasın. Satın almadan önce hesabını e-postaya bağlamanı öneririz; böylece haklarını kaybetmezsin.', style: PxText.body(18, color: PxColors.coral)),
          ),
        PxButton(
          key: const ValueKey('premium-subscribe'),
          label: premium.active ? 'Abonelik etkin' : 'Abone ol · ${pixelPrice(store.premiumPrice)}/ay',
          onTap: canBuy && !premium.active ? () => ref.read(storeProvider.notifier).buyPremium() : null,
        ),
        const SizedBox(height: 12),
        PxButton(
          key: const ValueKey('premium-restore'),
          label: 'Satın alımları geri yükle',
          tone: PxTone.secondary,
          height: 46,
          fontSize: 14,
          onTap: canBuy ? () => ref.read(storeProvider.notifier).restore() : null,
        ),
        if (!store.available && !store.loading)
          Padding(
            key: const ValueKey('store-unavailable'),
            padding: const EdgeInsets.only(top: 12),
            child: Text('Mağaza bu cihazda kullanılamıyor (web ya da emülatör). Satın alma için uygulamayı telefonunda aç.', style: PxText.body(18, color: PxColors.muted)),
          ),
        if (store.busy) Padding(padding: const EdgeInsets.only(top: 12), child: Text('İşlem sürüyor…', style: PxText.pixel(13, color: PxColors.muted))),
        const SizedBox(height: 16),
        Text('Abonelik, mağaza hesabından ücretlendirilir ve dönem sonundan en az 24 saat önce iptal edilmezse kendiliğinden yenilenir.', style: PxText.body(16, color: PxColors.dim)),
      ],
    );
  }
}
