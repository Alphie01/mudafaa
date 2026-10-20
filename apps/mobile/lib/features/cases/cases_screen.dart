import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../data/api.dart';
import '../../data/providers.dart';
import '../../data/store.dart';
import '../../design_system/tokens/px_colors.dart';
import '../../design_system/tokens/px_text.dart';
import '../../design_system/widgets/px_box.dart';
import '../../design_system/widgets/sprite.dart';
import '../../design_system/widgets/states.dart';
import 'unlock_sheet.dart';

/// Dava dosyaları: AKTİF / KAPANAN / KİLİTLİ sekmeleri ve dava kartları.
class CasesScreen extends ConsumerStatefulWidget {
  const CasesScreen({super.key});
  @override
  ConsumerState<CasesScreen> createState() => _CasesScreenState();
}

class _CasesScreenState extends ConsumerState<CasesScreen> {
  String _tab = 'active';

  Future<void> _open(Map<String, dynamic> card, {bool restart = false}) async {
    try {
      final res = await ref.read(apiProvider).post('/cases/${card['id']}/start', {if (restart) 'restart': true});
      if (!mounted) return;
      await context.push('/play/${(res['session'] as Map)['id']}');
      ref.invalidate(casesProvider);
    } on ApiException catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.message)));
    }
  }

  @override
  Widget build(BuildContext context) {
    final list = ref.watch(casesProvider(_tab));
    final casePrice = ref.watch(storeProvider.select((s) => s.casePrice));
    // Satın alma sonucu (dava açıldı, ödeme iptal vb.) kısa bir bildirimle gösterilir.
    ref.listen(storeProvider.select((s) => s.messageSeq), (_, _) {
      final msg = ref.read(storeProvider).message;
      if (msg != null) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
    });
    final counts = list.value?['counts'] as Map?;
    return Scaffold(
      body: SafeArea(
        child: Column(children: [
          PxHeader(eyebrow: 'Büro: Arslan Hukuk · Bursa', title: 'Dava Dosyaları', onBack: () => context.pop()),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
            child: Row(children: [
              for (final (id, label) in const [('active', 'Aktif'), ('closed', 'Kapanan'), ('locked', 'Kilitli')])
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(right: 6),
                    child: PxButton(label: '$label ${counts?[id] ?? ''}', tone: _tab == id ? PxTone.gold : PxTone.secondary, height: 44, fontSize: 13, onTap: () => setState(() => _tab = id)),
                  ),
                ),
            ]),
          ),
          Expanded(
            child: list.when(
              loading: () => const LoadingView(),
              error: (e, _) => ErrorView(message: '$e', onRetry: () => ref.invalidate(casesProvider)),
              data: (d) {
                final items = (d['items'] as List).cast<Map<String, dynamic>>();
                if (items.isEmpty) return Center(child: Text('Bu sekmede dava yok.', style: PxText.body(21, color: PxColors.muted)));
                return ListView.separated(
                  padding: const EdgeInsets.fromLTRB(16, 12, 20, 26),
                  itemCount: items.length,
                  separatorBuilder: (_, _) => const SizedBox(height: 16),
                  itemBuilder: (_, i) => CaseCardView(card: items[i], casePrice: casePrice, onOpen: _open, onUnlock: (c) => showUnlockSheet(context, c)),
                );
              },
            ),
          ),
        ]),
      ),
    );
  }
}

/// Dava kartı: rütbe kilidi (KİLİTLİ), erişim etiketi (ÜCRETSİZ / AÇILDI / fiyat) ve eylem düğmesi.
class CaseCardView extends StatelessWidget {
  const CaseCardView({super.key, required this.card, required this.onOpen, required this.onUnlock, this.casePrice = fallbackCasePrice});
  final Map<String, dynamic> card;
  final Future<void> Function(Map<String, dynamic>, {bool restart}) onOpen;
  final void Function(Map<String, dynamic>) onUnlock;

  /// Mağazanın dava kilidi fiyatı (gelmediyse yedek fiyat).
  final String casePrice;

  @override
  Widget build(BuildContext context) {
    final status = card['status'] as String;
    final locked = status == 'LOCKED';
    final (chip, chipColor) = switch (status) {
      'IN_PROGRESS' => ('DEVAM EDİYOR', PxColors.blue),
      'COMPLETED' => ('KAPANDI', PxColors.green),
      'LOCKED' => ('KİLİTLİ', PxColors.panelLo),
      _ => ('YENİ', PxColors.red),
    };
    final best = card['best'] as Map?;
    final access = (card['access'] as String?) ?? 'FREE';
    final paidLocked = access == 'PAID_LOCKED';
    final (accessLabel, accessColor) = switch (access) {
      'FREE' => ('ÜCRETSİZ', PxColors.green),
      'OWNED' => ('AÇILDI', PxColors.blue),
      _ => (pixelPrice(casePrice), PxColors.red),
    };
    return Opacity(
      opacity: locked ? 0.6 : 1,
      child: PxBox(
        color: locked ? PxColors.panel : PxColors.parchment,
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Container(color: PxColors.ink, padding: const EdgeInsets.all(4), child: PixelSprite(sprite: (card['cover'] as Map)['sprite'] as Map<String, dynamic>, px: 3)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Row(children: [
                Text('DAVA #${(card['number'] as int).toString().padLeft(2, '0')}', style: PxText.pixel(12, color: locked ? PxColors.muted : PxColors.parchmentInk)),
                const Spacer(),
                Container(
                  key: ValueKey('access-${card['id']}'),
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  margin: const EdgeInsets.only(right: 6),
                  color: accessColor,
                  child: Text(accessLabel, style: PxText.pixel(10, color: PxColors.white)),
                ),
                Container(padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2), color: chipColor, child: Text(chip, style: PxText.pixel(10, color: PxColors.white))),
              ]),
              const SizedBox(height: 4),
              Text(card['title'] as String, style: PxText.pixel(18, color: locked ? PxColors.text : PxColors.ink)),
              Text('${card['crimeLabel']} · ${card['lawRef']}', style: PxText.body(18, color: locked ? PxColors.muted : PxColors.parchmentInk)),
              Text('Olası ceza: ${card['possibleSentence']} · ~${card['estimatedMinutes']} dk', style: PxText.body(17, color: locked ? PxColors.muted : PxColors.parchmentInk)),
              Row(children: [for (var i = 0; i < 5; i++) Container(width: 10, height: 10, margin: const EdgeInsets.only(right: 3, top: 4), color: i < (card['difficulty'] as int) ? PxColors.red : PxColors.parchmentDk)]),
              if (locked) Padding(padding: const EdgeInsets.only(top: 6), child: Text('Açmak için: ${card['lockReason']}', style: PxText.body(17, color: PxColors.gold))),
              if (best != null) Padding(padding: const EdgeInsets.only(top: 6), child: Text('En iyi: ${best['stamp']} · ${best['final']}', style: PxText.pixel(12, color: PxColors.green))),
              if (!locked && paidLocked) ...[
                const SizedBox(height: 10),
                PxButton(key: ValueKey('unlock-${card['id']}'), label: 'Kilidi aç · ${pixelPrice(casePrice)}', tone: PxTone.red, height: 42, fontSize: 14, onTap: () => onUnlock(card)),
              ],
              if (!locked && !paidLocked) ...[
                const SizedBox(height: 10),
                Row(children: [
                  Expanded(child: PxButton(label: status == 'IN_PROGRESS' ? 'Devam et' : (status == 'COMPLETED' ? 'Tekrar oyna' : 'Davayı aç'), height: 42, fontSize: 14, onTap: () => onOpen(card, restart: status == 'COMPLETED'))),
                  if (status == 'IN_PROGRESS') ...[const SizedBox(width: 8), Expanded(child: PxButton(label: 'Baştan', tone: PxTone.secondary, height: 42, fontSize: 14, onTap: () => onOpen(card, restart: true)))],
                ]),
              ],
            ]),
          ),
        ]),
      ),
    );
  }
}
