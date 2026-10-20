import 'package:flutter/material.dart';

import '../../design_system/tokens/px_colors.dart';
import '../../design_system/tokens/px_text.dart';
import '../../design_system/widgets/px_box.dart';
import '../../design_system/widgets/sprite.dart';

typedef Dispatch = Future<void> Function(Map<String, dynamic> action);

Map<String, dynamic> m(Object? v) => (v as Map?)?.cast<String, dynamic>() ?? <String, dynamic>{};
List<Map<String, dynamic>> ms(Object? v) => ((v as List?) ?? const []).map((e) => m(e)).toList();

/// Konuşma satırları: konuşmacının adı ve sprite'ı kadrodan (cast) gelir; anlatıcı satırları italik kutudur.
class SpeechLines extends StatelessWidget {
  const SpeechLines({super.key, required this.lines, required this.cast});
  final List<Map<String, dynamic>> lines;
  final Map<String, dynamic> cast;

  @override
  Widget build(BuildContext context) {
    if (lines.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        for (final l in lines)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: _Line(line: l, cast: cast),
          ),
      ],
    );
  }
}

class _Line extends StatelessWidget {
  const _Line({required this.line, required this.cast});
  final Map<String, dynamic> line;
  final Map<String, dynamic> cast;

  @override
  Widget build(BuildContext context) {
    final speaker = line['speaker'] as String;
    final text = line['text'] as String;
    if (speaker == 'narrator') {
      return PxBox(color: PxColors.panel, child: Text(text, style: PxText.body(20, color: PxColors.muted).copyWith(fontStyle: FontStyle.italic)));
    }
    if (speaker == 'player') {
      return Align(
        alignment: Alignment.centerRight,
        child: PxBox(color: PxColors.blue, child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text('SEN', style: PxText.label), Text(text, style: PxText.speech)])),
      );
    }
    final who = m(cast[speaker]);
    final name = (who['shortLabel'] ?? who['name'] ?? speaker) as String;
    return Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
      if (who['sprite'] != null)
        Container(color: hexAccent(who['accent']), padding: const EdgeInsets.all(3), margin: const EdgeInsets.only(right: 8), child: PixelSprite(sprite: m(who['sprite']), expression: (line['expression'] ?? who['expression']) as String?, px: 3)),
      Expanded(
        child: PxBox(
          color: PxColors.parchment,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(trUpper(name), style: PxText.pixel(11, color: PxColors.parchmentInk)),
            Text(text, style: PxText.speech.copyWith(color: PxColors.ink)),
          ]),
        ),
      ),
    ]);
  }
}

Color hexAccent(Object? hex) => hex is String ? hexColor(hex) : PxColors.panelHi;

/// Son aksiyonun geri bildirimi (başarılı / hatalı / nötr renkle). Başlık ve metin gövdede; `label` (ör. "−10 SKOR")
/// metne eklenmez, sağda etiket olarak durur.
class FeedbackBanner extends StatelessWidget {
  const FeedbackBanner({super.key, required this.feedback});
  final Map<String, dynamic> feedback;

  static Color colorOf(String? tone) => switch (tone) {
        'success' => PxColors.green,
        'error' => PxColors.red,
        'special' => PxColors.blue,
        _ => PxColors.panelHi,
      };

  @override
  Widget build(BuildContext context) {
    final color = colorOf(feedback['tone'] as String?);
    String? s(Object? v) => v is String && v.isNotEmpty ? v : null;
    final title = s(feedback['title']);
    final text = s(feedback['text']);
    final label = s(feedback['label']);
    if (title == null && text == null && label == null) return const SizedBox.shrink();
    return PxBox(
      color: color,
      padding: const EdgeInsets.fromLTRB(12, 8, 10, 8),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Expanded(
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            if (title != null) Text(trUpper(title), style: PxText.pixel(13, color: PxColors.white)),
            if (text != null) Text(text, style: PxText.body(20)),
          ]),
        ),
        if (label != null)
          Container(
            key: const ValueKey('feedback-tag'),
            margin: const EdgeInsets.only(left: 8, top: 2),
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
            color: PxColors.ink,
            child: Text(label, style: PxText.pixel(11, color: PxColors.gold)),
          ),
      ]),
    );
  }
}

/// Efekt şeritleri (+300 SKOR, −1 GÜVENİLİRLİK…).
class FxStrip extends StatelessWidget {
  const FxStrip({super.key, required this.fx});
  final List<Map<String, dynamic>> fx;
  @override
  Widget build(BuildContext context) {
    final shown = fx.where((f) => f['kind'] == 'SCORE' || f['kind'] == 'VAR' || f['kind'] == 'EVIDENCE').toList();
    if (shown.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Wrap(spacing: 6, runSpacing: 6, children: [
        for (final f in shown)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
            color: f['kind'] == 'EVIDENCE' ? PxColors.blue : (((f['delta'] as int?) ?? 0) < 0 || (f['label'] as String).startsWith('−') ? PxColors.red : PxColors.green),
            child: Text(f['kind'] == 'VAR' && f['delta'] != null ? '${(f['delta'] as int) > 0 ? '+' : '−'}${(f['delta'] as int).abs()} ${f['label']}' : f['kind'] == 'EVIDENCE' ? 'YENİ DELİL: ${f['label']}' : f['label'] as String, style: PxText.pixel(11, color: PxColors.white)),
          ),
      ]),
    );
  }
}

/// Oyuncu seçenekleri listesi. TOPIC seçenekleri `variant` ister (görüşmede seçili ton).
class ChoiceList extends StatelessWidget {
  const ChoiceList({super.key, required this.choices, required this.dispatch, this.exclude = const {}, this.variant, this.busy = false});
  final List<Map<String, dynamic>> choices;
  final Dispatch dispatch;
  final Set<String> exclude;
  final String? variant;
  final bool busy;

  @override
  Widget build(BuildContext context) {
    final shown = choices.where((c) => !exclude.contains(c['id'])).toList();
    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      for (var i = 0; i < shown.length; i++)
        Padding(padding: const EdgeInsets.only(bottom: 10), child: ChoiceTile(choice: shown[i], index: i, dispatch: dispatch, variant: variant, busy: busy)),
    ]);
  }
}

class ChoiceTile extends StatelessWidget {
  const ChoiceTile({super.key, required this.choice, required this.dispatch, this.index, this.variant, this.busy = false});
  final Map<String, dynamic> choice;
  final Dispatch dispatch;
  final int? index;
  final String? variant;
  final bool busy;

  Future<void> _tap(BuildContext context) => chooseWithConfirm(context, choice, dispatch, variant: variant);

  @override
  Widget build(BuildContext context) {
    final available = choice['available'] == true && !busy;
    final used = choice['used'] == true;
    final tags = ms(choice['tags']);
    final costs = ms(choice['cost']);
    final letter = index == null ? null : String.fromCharCode(65 + index!);
    return Semantics(
      button: true,
      enabled: available,
      child: GestureDetector(
        onTap: available ? () => _tap(context) : null,
        child: Opacity(
          opacity: available ? 1 : 0.55,
          child: Container(
            constraints: const BoxConstraints(minHeight: 48),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(color: used ? PxColors.parchmentDk : const Color(0xFFEAD9AD), border: Border.all(color: PxColors.ink, width: 3), boxShadow: const [BoxShadow(color: PxColors.ink, offset: Offset(3, 3))]),
            child: Row(children: [
              if (letter != null) Container(width: 26, height: 26, margin: const EdgeInsets.only(right: 8), color: PxColors.ink, alignment: Alignment.center, child: Text(letter, style: PxText.pixel(13, color: PxColors.gold))),
              Expanded(
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(choice['label'] as String, style: PxText.body(20, color: PxColors.ink)),
                  if (choice['description'] != null) Text(choice['description'] as String, style: PxText.body(17, color: PxColors.parchmentInk)),
                  if (!available && choice['lockedReason'] != null) Text(choice['lockedReason'] as String, style: PxText.body(16, color: PxColors.red)),
                ]),
              ),
              for (final t in tags) Container(margin: const EdgeInsets.only(left: 6), padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2), color: _tagColor(t['tone'] as String?), child: Text(t['label'] as String, style: PxText.pixel(10, color: PxColors.white))),
              for (final cst in costs) Container(margin: const EdgeInsets.only(left: 6), padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2), color: PxColors.ink, child: Text(cst['label'] as String, style: PxText.pixel(10, color: PxColors.gold))),
            ]),
          ),
        ),
      ),
    );
  }

  static Color _tagColor(String? tone) => switch (tone) {
        'witness' => const Color(0xFF1D5A8A),
        'info' => const Color(0xFF2E6A40),
        'negative' => PxColors.red,
        _ => PxColors.panelHi,
      };
}

/// Delil kartı.
class EvidenceCardView extends StatelessWidget {
  const EvidenceCardView({super.key, required this.card, this.onTap, this.selected = false});
  final Map<String, dynamic> card;
  final VoidCallback? onTap;
  final bool selected;
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: PxBox(
        color: selected ? PxColors.gold : PxColors.parchment,
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(children: [
            Expanded(child: Text(card['title'] as String, style: PxText.pixel(15, color: PxColors.ink))),
            if (card['kindLabel'] != null) Text(trUpper(card['kindLabel'] as String), style: PxText.pixel(9, color: PxColors.parchmentInk)),
          ]),
          if (card['shortText'] != null) Text(card['shortText'] as String, style: PxText.body(18, color: PxColors.ink)),
          if (card['sourceLabel'] != null) Text(card['sourceLabel'] as String, style: PxText.body(16, color: PxColors.parchmentInk)),
        ]),
      ),
    );
  }
}

/// Bulunan delillerden (çanta + defter ya da verilen liste) birini seçtirir.
Future<String?> pickEvidence(BuildContext context, List<Map<String, dynamic>> items, {String title = 'Delil sun'}) {
  return showModalBottomSheet<String>(
    context: context,
    backgroundColor: PxColors.bg,
    isScrollControlled: true,
    shape: const RoundedRectangleBorder(),
    builder: (ctx) => SafeArea(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxHeight: MediaQuery.of(ctx).size.height * 0.8),
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 16, 20, 20),
          children: [
            Text(trUpper(title), style: PxText.title),
            const SizedBox(height: 12),
            if (items.isEmpty) Text('Elinde sunabileceğin bir delil yok.', style: PxText.body(20, color: PxColors.muted)),
            for (final e in items) Padding(padding: const EdgeInsets.only(bottom: 10), child: EvidenceCardView(card: e, onTap: () => Navigator.pop(ctx, e['id'] as String))),
          ],
        ),
      ),
    ),
  );
}

/// Seçeneği gönderir; `confirm` varsa önce onay sorar. TOPIC seçenekleri `variant` ister.
Future<void> chooseWithConfirm(BuildContext context, Map<String, dynamic> choice, Dispatch dispatch, {String? variant}) async {
  final confirm = choice['confirm'] as String?;
  if (confirm != null) {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: PxColors.panel,
        shape: const RoundedRectangleBorder(side: BorderSide(color: PxColors.ink, width: 3)),
        content: Text(confirm, style: PxText.body(21)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: Text('VAZGEÇ', style: PxText.pixel(13, color: PxColors.muted))),
          TextButton(onPressed: () => Navigator.pop(ctx, true), child: Text('EVET', style: PxText.pixel(13, color: PxColors.gold))),
        ],
      ),
    );
    if (ok != true) return;
  }
  final variants = ms(choice['variants']);
  final v = variants.isEmpty ? null : (variant ?? variants.first['id'] as String);
  await dispatch({'kind': 'CHOOSE', 'choiceId': choice['id'], 'variant': ?v});
}
