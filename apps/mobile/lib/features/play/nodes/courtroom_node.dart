import 'package:flutter/material.dart';

import '../../../design_system/tokens/px_colors.dart';
import '../../../design_system/tokens/px_text.dart';
import '../../../design_system/widgets/px_box.dart';
import '../../../design_system/widgets/sprite.dart';
import '../common.dart';

/// Duruşma: salon (kürsü, tanık, avukat), ifadeler (imleç arayüz durumu) + BASTIR / DELİL SUN / İTİRAZ!,
/// savcılık delili ve A–D seçenekleri.
class CourtroomNode extends StatefulWidget {
  const CourtroomNode({super.key, required this.view, required this.dispatch, required this.busy});
  final Map<String, dynamic> view;
  final Dispatch dispatch;
  final bool busy;
  @override
  State<CourtroomNode> createState() => _CourtroomNodeState();
}

class _CourtroomNodeState extends State<CourtroomNode> {
  int _cursor = 0;

  @override
  Widget build(BuildContext context) {
    final node = m(widget.view['node']);
    final cast = m(widget.view['cast']);
    final stage = m(node['stage']);
    final statements = ms(node['statements']);
    final cursor = statements.isEmpty ? 0 : _cursor.clamp(0, statements.length - 1);
    final current = statements.isEmpty ? null : statements[cursor];
    final grounds = ms(node['objectionGrounds']);
    final prosecution = node['prosecutionEvidence'] == null ? null : m(node['prosecutionEvidence']);
    Widget person(String? key, double px) {
      final who = m(cast[key]);
      return who['sprite'] == null ? const SizedBox.shrink() : PixelSprite(sprite: m(who['sprite']), expression: who['expression'] as String?, px: px);
    }

    return Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
      SizedBox(
        height: 240,
        child: LayoutBuilder(builder: (ctx, c) {
          return Stack(children: [
            Positioned.fill(child: Container(color: const Color(0xFF4A2F24))),
            Positioned(left: 0, right: 0, top: 0, height: 28, child: Container(color: PxColors.woodDk, alignment: Alignment.center, child: Text(trUpper(stage['banner'] as String), style: PxText.pixel(11, color: PxColors.gold, spacing: 2)))),
            for (final b in ms(stage['bench'])) Positioned(left: (b['xFrac'] as num) * c.maxWidth - 24, top: 40, child: person(b['characterKey'] as String, 3)),
            Positioned(left: 0, right: 0, top: 100, height: 40, child: Container(color: PxColors.wood, child: Row(mainAxisAlignment: MainAxisAlignment.spaceAround, children: [for (final b in ms(stage['bench'])) Text(trUpper(b['label'] as String), style: PxText.pixel(9, color: PxColors.parchment))]))),
            Positioned(left: 0, right: 0, top: 140, bottom: 0, child: Container(color: const Color(0xFF2B1D16))),
            if (stage['witness'] != null) Positioned(left: c.maxWidth / 2 - 32, top: 150, child: person(stage['witness'] as String, 4)),
            if (stage['witness'] != null)
              Positioned(left: c.maxWidth / 2 - 50, bottom: 0, width: 100, height: 28, child: Container(color: PxColors.wood, alignment: Alignment.center, child: Text(trUpper((node['witnessLabel'] ?? 'Tanık kürsüsü') as String), style: PxText.pixel(9, color: PxColors.parchment)))),
            Positioned(left: 10, bottom: 4, child: person(stage['counsel'] as String, 4)),
          ]);
        }),
      ),
      const SizedBox(height: 12),
      if (prosecution != null) ...[Text('SAVCILIK DELİLİ', style: PxText.eyebrow), const SizedBox(height: 6), EvidenceCardView(card: prosecution), const SizedBox(height: 12)],
      if (node['rulesText'] != null) ...[Text(node['rulesText'] as String, style: PxText.body(19, color: PxColors.muted)), const SizedBox(height: 10)],
      if (current != null) ...[
        PxBox(
          color: PxColors.parchment,
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text('İFADE ${cursor + 1} / ${statements.length}${current['pressed'] == true ? ' · BASTIRILDI' : ''}', style: PxText.pixel(11, color: PxColors.parchmentInk)),
            const SizedBox(height: 4),
            Text.rich(TextSpan(children: [
              for (final s in ms(current['segments']))
                TextSpan(text: s['text'] as String, style: PxText.speech.copyWith(color: s['highlight'] == true ? PxColors.red : PxColors.ink, decoration: s['highlight'] == true ? TextDecoration.underline : null)),
            ])),
          ]),
        ),
        const SizedBox(height: 8),
        Row(children: [
          PxButton(label: '‹', expand: false, height: 44, tone: PxTone.secondary, onTap: cursor > 0 ? () => setState(() => _cursor = cursor - 1) : null),
          const SizedBox(width: 6),
          Expanded(child: PxButton(label: 'Bastır', height: 44, fontSize: 13, tone: PxTone.secondary, onTap: widget.busy ? null : () => widget.dispatch({'kind': 'PRESS', 'statementId': current['id']}))),
          const SizedBox(width: 6),
          Expanded(
            child: PxButton(
              label: 'Delil sun',
              height: 44,
              fontSize: 13,
              tone: PxTone.blue,
              onTap: widget.busy
                  ? null
                  : () async {
                      final id = await pickEvidence(context, ms(node['presentable']));
                      if (id != null) await widget.dispatch({'kind': 'PRESENT', 'evidenceId': id, 'statementId': current['id']});
                    },
            ),
          ),
          const SizedBox(width: 6),
          PxButton(label: '›', expand: false, height: 44, tone: PxTone.secondary, onTap: cursor < statements.length - 1 ? () => setState(() => _cursor = cursor + 1) : null),
        ]),
        if (grounds.isNotEmpty) ...[
          const SizedBox(height: 8),
          PxButton(
            label: 'İtiraz!',
            tone: PxTone.objection,
            onTap: widget.busy
                ? null
                : () async {
                    final g = await showModalBottomSheet<String>(
                      context: context,
                      backgroundColor: PxColors.bg,
                      builder: (ctx) => SafeArea(
                        child: ListView(padding: const EdgeInsets.all(16), shrinkWrap: true, children: [
                          Text('İTİRAZ GEREKÇESİ', style: PxText.title),
                          const SizedBox(height: 10),
                          for (final gr in grounds)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 10),
                              child: PxButton(label: '${gr['label']}${gr['legalBasis'] != null ? ' (${gr['legalBasis']})' : ''}', tone: PxTone.secondary, fontSize: 13, onTap: () => Navigator.pop(ctx, gr['id'] as String)),
                            ),
                        ]),
                      ),
                    );
                    if (g != null) await widget.dispatch({'kind': 'OBJECT', 'groundId': g, 'statementId': current['id']});
                  },
          ),
        ],
        const SizedBox(height: 12),
      ],
      ChoiceList(choices: ms(widget.view['choices']), dispatch: widget.dispatch, busy: widget.busy),
    ]);
  }
}
