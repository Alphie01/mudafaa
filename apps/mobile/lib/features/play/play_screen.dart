import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../design_system/tokens/px_colors.dart';
import '../../design_system/tokens/px_text.dart';
import '../../design_system/widgets/hud.dart';
import '../../design_system/widgets/px_box.dart';
import '../../design_system/widgets/states.dart';
import 'common.dart';
import 'nodes/courtroom_node.dart';
import 'nodes/deduction_node.dart';
import 'nodes/dialogue_node.dart';
import 'nodes/document_node.dart';
import 'nodes/investigation_node.dart';
import 'nodes/scene_node.dart';
import 'nodes/simple_nodes.dart';
import 'nodes/story_node.dart';
import 'session_controller.dart';

/// Oyun ekranı: UI = f(view). Başlık + HUD, node'un anlatısı, son aksiyonun yanıtı, node türüne göre gövde.
class PlayScreen extends ConsumerWidget {
  const PlayScreen({super.key, required this.sessionId});
  final String sessionId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final st = ref.watch(sessionControllerProvider(sessionId));
    final ctrl = ref.read(sessionControllerProvider(sessionId).notifier);
    final view = st.view;
    if (view == null) {
      return Scaffold(body: SafeArea(child: st.error != null ? ErrorView(message: st.error!, onRetry: ctrl.refresh) : const LoadingView()));
    }
    final header = m(view['header']);
    final back = header['back'] == null ? null : m(header['back']);
    final session = m(view['session']);
    final node = st.node;
    final last = st.last;
    final cast = m(view['cast']);
    Future<void> dispatch(Map<String, dynamic> a) => ctrl.dispatch(a);
    final body = switch (node['type']) {
      'STORY' => StoryNode(key: ValueKey(node['id']), view: view, dispatch: dispatch, busy: st.busy),
      'INVESTIGATION' => InvestigationNode(key: ValueKey(node['id']), view: view, dispatch: dispatch, busy: st.busy),
      'DIALOGUE' => DialogueNode(key: ValueKey(node['id']), view: view, dispatch: dispatch, busy: st.busy),
      'SCENE' => SceneNode(key: ValueKey(node['id']), view: view, dispatch: dispatch, busy: st.busy),
      'DOCUMENT' => DocumentNode(key: ValueKey(node['id']), view: view, dispatch: dispatch, busy: st.busy),
      'DEDUCTION' => DeductionNode(key: ValueKey(node['id']), view: view, dispatch: dispatch, busy: st.busy),
      'COURTROOM' => CourtroomNode(key: ValueKey(node['id']), view: view, dispatch: dispatch, busy: st.busy),
      'CHOICE' || 'EVIDENCE' => ChoiceNode(key: ValueKey(node['id']), view: view, dispatch: dispatch, busy: st.busy),
      'RESULT' => ResultNode(view: view),
      _ => Center(child: Text('Bu ekran için uygulamayı güncelleyin.', style: PxText.body(21))),
    };
    final hud = ms(view['hud']);
    return PopScope(
      canPop: back == null,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop && back != null) dispatch({'kind': 'CHOOSE', 'choiceId': back['choiceId']});
      },
      child: Scaffold(
        body: SafeArea(
          child: Column(children: [
            PxHeader(
              eyebrow: header['eyebrow'] as String? ?? 'Dava #${(session['caseNumber'] as int).toString().padLeft(2, '0')}${session['progressLabel'] != null ? ' · ${session['progressLabel']}' : ''}',
              title: header['title'] as String? ?? session['caseTitle'] as String,
              onBack: back != null ? () => dispatch({'kind': 'CHOOSE', 'choiceId': back['choiceId']}) : () => context.pop(),
              trailing: _BagButton(view: view),
            ),
            if (hud.isNotEmpty) Container(color: PxColors.ink, padding: const EdgeInsets.fromLTRB(16, 0, 16, 10), child: Column(children: [for (final h in hud) HudItemView(item: h)])),
            if (st.error != null)
              GestureDetector(onTap: ctrl.clearError, child: Container(width: double.infinity, color: PxColors.red, padding: const EdgeInsets.all(10), child: Text(st.error!, style: PxText.body(19)))),
            Expanded(
              child: Stack(children: [
                ListView(
                  padding: const EdgeInsets.fromLTRB(16, 14, 20, 30),
                  children: [
                    SpeechLines(lines: ms(view['lines']), cast: cast),
                    if (last != null && last['nodeChanged'] != true) ...[
                      FxStrip(fx: ms(last['fx'])),
                      if (last['feedback'] != null) FeedbackBanner(feedback: m(last['feedback'])),
                      SpeechLines(lines: ms(last['lines']), cast: cast),
                    ],
                    if (last != null && last['nodeChanged'] == true) ...[
                      FxStrip(fx: ms(last['fx'])),
                      SpeechLines(lines: ms(last['lines']), cast: cast),
                    ],
                    body,
                  ],
                ),
                if (st.busy) const Positioned(top: 0, left: 0, right: 0, child: LinearProgressIndicator(minHeight: 3, color: PxColors.gold, backgroundColor: Colors.transparent)),
              ]),
            ),
          ]),
        ),
      ),
    );
  }
}

/// Delil çantası ve not defteri: yalnızca bulunanlar.
class _BagButton extends StatelessWidget {
  const _BagButton({required this.view});
  final Map<String, dynamic> view;
  @override
  Widget build(BuildContext context) {
    final bag = ms(m(view['bag'])['items']);
    final notes = ms(m(view['notebook'])['items']);
    return GestureDetector(
      onTap: () => showModalBottomSheet<void>(
        context: context,
        backgroundColor: PxColors.bg,
        isScrollControlled: true,
        builder: (ctx) => SafeArea(
          child: ConstrainedBox(
            constraints: BoxConstraints(maxHeight: MediaQuery.of(ctx).size.height * 0.85),
            child: ListView(padding: const EdgeInsets.fromLTRB(16, 16, 20, 20), children: [
              Text('DELİL ÇANTASI', style: PxText.title),
              const SizedBox(height: 8),
              if (bag.isEmpty) Text('Henüz delil yok.', style: PxText.body(19, color: PxColors.muted)),
              for (final e in bag) Padding(padding: const EdgeInsets.only(bottom: 10), child: EvidenceCardView(card: e)),
              const SizedBox(height: 10),
              Text('NOT DEFTERİ', style: PxText.title),
              const SizedBox(height: 8),
              if (notes.isEmpty) Text('Henüz ipucu yok.', style: PxText.body(19, color: PxColors.muted)),
              for (final n in notes) Padding(padding: const EdgeInsets.only(bottom: 8), child: PxBox(child: Text('${n['title']} · ${n['sourceLabel']}', style: PxText.body(19)))),
            ]),
          ),
        ),
      ),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        decoration: BoxDecoration(color: PxColors.panel, border: Border.all(color: PxColors.panelHi, width: 3)),
        child: Text('ÇANTA ${bag.length + notes.length}', style: PxText.pixel(11, color: PxColors.gold)),
      ),
    );
  }
}
