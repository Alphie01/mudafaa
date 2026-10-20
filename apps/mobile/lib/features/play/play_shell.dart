import 'dart:async';

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../design_system/backdrops/backdrop_view.dart';
import '../../design_system/motion/retro_motion.dart';
import '../../design_system/motion/screen_fx.dart';
import '../../design_system/tokens/px_colors.dart';
import '../../design_system/tokens/px_text.dart';
import '../../design_system/widgets/hud.dart';
import '../../design_system/widgets/px_box.dart';
import '../../design_system/widgets/states.dart';
import 'common.dart';
import 'dialogue/dialogue_player.dart';
import 'dialogue/line_info.dart';
import 'dialogue/portrait.dart';
import 'motion/fx_overlay.dart';
import 'nodes/courtroom_node.dart';
import 'nodes/deduction_node.dart';
import 'nodes/dialogue_node.dart';
import 'nodes/document_node.dart';
import 'nodes/investigation_node.dart';
import 'nodes/scene_node.dart';
import 'nodes/simple_nodes.dart';
import 'nodes/story_node.dart';
import 'session_controller.dart';

enum _Stage { intro, lines, done }

int versionOf(Map<String, dynamic> view) => (m(view['session'])['stateVersion'] as int?) ?? 0;
String? nodeIdOf(Map<String, dynamic>? view) => view == null ? null : m(view['node'])['id'] as String?;

/// Bu görünümde oynatılacak satırlar: önce son aksiyonun yanıtı, sonra (node değiştiyse ya da ilk yüklemeyse)
/// node'un giriş satırları. Soruşturma hub'ının giriş satırları oynatılmaz; hub'da durum kutusu olarak durur.
List<Map<String, dynamic>> linesFor(Map<String, dynamic> view) {
  final last = view['last'] == null ? null : m(view['last']);
  final type = m(view['node'])['type'];
  final entry = type == 'INVESTIGATION' ? const <Map<String, dynamic>>[] : ms(view['lines']);
  if (last == null) return entry;
  final reply = ms(last['lines']);
  if (last['nodeChanged'] == true) return [...reply, ...entry];
  return reply;
}

/// Sahnesi arka planın üstünde çizilen node türleri (diğerleri düz zemin).
const _scenic = {'STORY', 'DIALOGUE', 'CHOICE', 'EVIDENCE', 'RESULT'};

/// `header.backdrop` yoksa node türüne göre genel bir illüstrasyon.
String? defaultBackdrop(String? type) => switch (type) {
      'STORY' => 'buro',
      'DIALOGUE' => 'gorus_odasi',
      'COURTROOM' => 'durusma_salonu',
      'RESULT' => 'durusma_salonu',
      'CHOICE' || 'EVIDENCE' => 'buro_gece',
      _ => null,
    };

/// Oyun kabuğu: UI = f(view). Başlık + HUD, arka plan, perde geçişi, bölüm kartı, efekt kartları, görsel roman
/// oynatıcısı ve node gövdesi. Hem canlı oturum (PlayScreen) hem geliştirici galerisi bunu kullanır.
class PlayShell extends StatefulWidget {
  const PlayShell({
    super.key,
    required this.view,
    required this.memory,
    required this.dispatch,
    this.busy = false,
    this.error,
    this.onClearError,
    this.onExit,
  });

  final Map<String, dynamic> view;
  final PlayMemory memory;
  final Dispatch dispatch;
  final bool busy;
  final String? error;
  final VoidCallback? onClearError;
  final VoidCallback? onExit;

  @override
  State<PlayShell> createState() => _PlayShellState();
}

class _PlayShellState extends State<PlayShell> with TickerProviderStateMixin {
  final _fx = ScreenFxController();
  late final AnimationController _curtain = AnimationController(vsync: this, duration: const Duration(milliseconds: 240));
  _Stage _stage = _Stage.done;
  Map<String, dynamic>? _held;
  List<Map<String, dynamic>> _seq = const [];
  bool _epilogue = false;

  /// Giriş yeni bir node için mi (öyleyse gövde perde/kartlar bitene kadar gizli; aynı node'da kartlar gövdenin üstünde).
  bool _freshNode = false;
  String? _chapter;
  FxCard? _card;
  Completer<void>? _wait;
  String? _lineBg;
  int _token = 0;
  int _playKey = 0;

  Map<String, dynamic>? _toast;
  int _toastKey = 0;
  Timer? _toastTimer;
  List<({String text, bool negative})> _floats = const [];
  int _floatKey = 0;

  bool _first = true;

  PlayMemory get _mem => widget.memory;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_first) {
      _first = false;
      _onNewView(widget.view, null);
    }
  }

  @override
  void didUpdateWidget(PlayShell old) {
    super.didUpdateWidget(old);
    if (identical(old.view, widget.view)) return;
    if (versionOf(old.view) == versionOf(widget.view) && nodeIdOf(old.view) == nodeIdOf(widget.view)) return;
    _onNewView(widget.view, old.view);
  }

  @override
  void dispose() {
    _token++;
    _toastTimer?.cancel();
    _curtain.dispose();
    _fx.dispose();
    super.dispose();
  }

  RetroMotion get _motion => MotionScope.of(context);

  /// Yeni sürüm geldi: oynatılacak bir şey yoksa gövde hiç gizlenmez (sahne görseli yerinden oynamaz).
  void _onNewView(Map<String, dynamic> view, Map<String, dynamic>? prev) {
    final version = versionOf(view);
    final nodeChanged = prev != null && nodeIdOf(prev) != nodeIdOf(view);
    if (nodeChanged) _lineBg = null;
    _token++;
    _wait?.complete();
    _wait = null;
    _card = null;
    _chapter = null;
    _epilogue = false;
    if (_mem.played.contains(version)) {
      _stage = _Stage.done;
      _held = null;
      return;
    }
    final seq = linesFor(view);
    final cards = fxCardsOf(view);
    final chapter = m(view['header'])['chapter'] as String?;
    final chapterChanged = chapter != null && chapter != _mem.chapter;
    final curtain = nodeChanged && _motion != RetroMotion.off;
    _startFeedback(view);
    if (!curtain && !chapterChanged && cards.isEmpty && seq.isEmpty) {
      _mem.played.add(version);
      _stage = _Stage.done;
      return;
    }
    _seq = seq;
    _stage = _Stage.intro;
    _freshNode = prev == null || nodeChanged;
    _held = curtain ? prev : null;
    final token = _token;
    WidgetsBinding.instance.addPostFrameCallback((_) => _direct(view, token, curtain: curtain, chapter: chapterChanged ? chapter : null, cards: cards));
  }

  Future<void> _direct(Map<String, dynamic> view, int token, {required bool curtain, String? chapter, required List<FxCard> cards}) async {
    bool alive() => mounted && token == _token;
    if (!alive()) return;
    if (curtain) {
      await _curtain.animateTo(0.5, duration: const Duration(milliseconds: 120));
      if (!alive()) return;
      setState(() => _held = null);
      _curtain.animateTo(1, duration: const Duration(milliseconds: 120)).whenCompleteOrCancel(() {
        if (mounted) _curtain.value = 0;
      });
    }
    if (chapter != null) {
      _mem.chapter = chapter;
      setState(() => _chapter = chapter);
      await _block();
      if (!alive()) return;
      setState(() => _chapter = null);
    }
    for (final c in cards) {
      setState(() => _card = c);
      await _block();
      if (!alive()) return;
      setState(() => _card = null);
    }
    if (_seq.isNotEmpty) {
      setState(() {
        _stage = _Stage.lines;
        _playKey++;
      });
      await _block();
      if (!alive()) return;
    }
    _finishIntro(view);
  }

  Future<void> _block() {
    _wait = Completer<void>();
    return _wait!.future;
  }

  void _release() {
    final w = _wait;
    _wait = null;
    w?.complete();
  }

  void _finishIntro(Map<String, dynamic> view) {
    final version = versionOf(view);
    _mem.played.add(version);
    if (_seq.isNotEmpty) {
      _mem.lastLines[version] = _seq;
      _mem.history.addAll(_seq);
    }
    setState(() => _stage = _Stage.done);
  }

  void _startFeedback(Map<String, dynamic> view) {
    final last = view['last'] == null ? null : m(view['last']);
    if (last == null) return;
    final fb = last['feedback'] == null ? null : m(last['feedback']);
    if (fb != null && last['nodeChanged'] != true) {
      _toast = fb;
      _toastKey++;
      _toastTimer?.cancel();
      _toastTimer = Timer(const Duration(milliseconds: 3200), () {
        if (mounted) setState(() => _toast = null);
      });
    }
    final floats = floatsOf(view);
    if (floats.isNotEmpty) {
      _floats = floats;
      _floatKey++;
    }
  }

  void _onLine(int i, Map<String, dynamic> line) {
    final bg = line['bg'] as String?;
    final fx = line['fx'] as String?;
    switch (fx) {
      case 'shake':
        _fx.shake();
      case 'flash':
        _fx.flash();
      case 'fade':
        _fx.fade();
    }
    if (bg != null) {
      // Kararma sırasında arka plan, ekran tamamen siyahken değişir.
      if (fx == 'fade' && _motion != RetroMotion.off) {
        Future.delayed(const Duration(milliseconds: 260), () {
          if (mounted) setState(() => _lineBg = bg);
        });
      } else {
        setState(() => _lineBg = bg);
      }
    }
  }

  void _playEpilogue({bool replay = false}) {
    final view = widget.view;
    final version = versionOf(view);
    final epilogue = ms(m(view['node'])['epilogue']);
    if (epilogue.isEmpty || _stage != _Stage.done) return;
    if (!replay && _mem.epilogueDone.contains(version)) return;
    final token = ++_token;
    setState(() {
      _seq = epilogue;
      _epilogue = true;
      _stage = _Stage.lines;
      _playKey++;
    });
    _block().then((_) {
      if (!mounted || token != _token) return;
      _mem.epilogueDone.add(version);
      if (!replay) _mem.history.addAll(epilogue);
      setState(() {
        _stage = _Stage.done;
        _epilogue = false;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final view = _held ?? widget.view;
    final header = m(view['header']);
    final back = header['back'] == null ? null : m(header['back']);
    final session = m(view['session']);
    final node = m(view['node']);
    final type = node['type'] as String?;
    final cast = m(view['cast']);
    final hud = ms(view['hud']);
    final version = versionOf(view);
    final dispatch = widget.dispatch;
    final interactive = _stage == _Stage.done && _held == null;
    final backdrop = _lineBg ?? header['backdrop'] as String? ?? defaultBackdrop(type);
    final showBackdrop = backdrop != null && (_stage == _Stage.lines || _scenic.contains(type));
    final primary = view['primary'] == null ? null : m(view['primary']);
    final primaryChoice = primary == null ? null : ms(view['choices']).where((c) => c['id'] == primary['choiceId']).firstOrNull;
    final bodyView = primaryChoice == null ? view : {...view, 'choices': ms(view['choices']).where((c) => c['id'] != primary!['choiceId']).toList()};
    final busy = widget.busy;

    final nodeBody = switch (type) {
      'STORY' => StoryNode(key: ValueKey(node['id']), view: bodyView, dispatch: dispatch, busy: busy),
      'INVESTIGATION' => InvestigationNode(key: ValueKey(node['id']), view: bodyView, dispatch: dispatch, busy: busy),
      'DIALOGUE' => DialogueNode(key: ValueKey(node['id']), view: bodyView, dispatch: dispatch, busy: busy),
      'SCENE' => SceneNode(key: ValueKey(node['id']), view: bodyView, dispatch: dispatch, busy: busy),
      'DOCUMENT' => DocumentNode(key: ValueKey(node['id']), view: bodyView, dispatch: dispatch, busy: busy),
      'DEDUCTION' => DeductionNode(key: ValueKey(node['id']), view: bodyView, dispatch: dispatch, busy: busy),
      'COURTROOM' => CourtroomNode(key: ValueKey(node['id']), view: bodyView, dispatch: dispatch, busy: busy),
      'CHOICE' || 'EVIDENCE' => ChoiceNode(key: ValueKey(node['id']), view: bodyView, dispatch: dispatch, busy: busy),
      'RESULT' => ResultNode(
          key: ValueKey(node['id']),
          view: bodyView,
          active: interactive,
          onSlam: _fx.shake,
          onIntroDone: _playEpilogue,
          onReplayEpilogue: () => _playEpilogue(replay: true),
        ),
      _ => Center(child: Text('Bu ekran için uygulamayı güncelleyin.', style: PxText.body(21))),
    };
    final lastSeq = _mem.lastLines[version];
    final lastLine = type == 'RESULT' || lastSeq == null || lastSeq.isEmpty ? null : lastSeq.last;

    final body = ListView(
      key: PageStorageKey('body-${node['id']}'),
      padding: const EdgeInsets.fromLTRB(16, 14, 20, 30),
      children: [
        if (lastLine != null) ...[
          LastLineBox(line: lastLine, cast: cast, onTap: () => showLineLog(context, _mem.history, cast)),
          const SizedBox(height: 12),
        ],
        nodeBody,
      ],
    );

    return PopScope(
      canPop: back == null,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop && back != null && !busy) dispatch({'kind': 'CHOOSE', 'choiceId': back['choiceId']});
      },
      child: Scaffold(
        body: SafeArea(
          child: ScreenFx(
            controller: _fx,
            child: Column(children: [
              PxHeader(
                eyebrow: header['eyebrow'] as String? ?? 'Dava #${((session['caseNumber'] as int?) ?? 0).toString().padLeft(2, '0')}${session['progressLabel'] != null ? ' · ${session['progressLabel']}' : ''}',
                title: header['title'] as String? ?? session['caseTitle'] as String?,
                onBack: back != null ? () => busy ? null : dispatch({'kind': 'CHOOSE', 'choiceId': back['choiceId']}) : (widget.onExit ?? () => context.pop()),
                trailing: Row(mainAxisSize: MainAxisSize.min, children: [
                  _HeaderChip(label: 'GEÇMİŞ', onTap: () => showLineLog(context, _mem.history, cast)),
                  const SizedBox(width: 6),
                  BagButton(view: view),
                ]),
              ),
              if (hud.isNotEmpty)
                Container(color: PxColors.ink, padding: const EdgeInsets.fromLTRB(16, 0, 16, 10), child: Column(children: [for (final h in hud) HudItemView(key: ValueKey('hud-${h['id']}'), item: h)])),
              if (widget.error != null)
                GestureDetector(onTap: widget.onClearError, child: Container(width: double.infinity, color: PxColors.red, padding: const EdgeInsets.all(10), child: Text(widget.error!, style: PxText.body(19)))),
              Expanded(
                child: Stack(fit: StackFit.expand, children: [
                  if (showBackdrop) BackdropLayer(key: const ValueKey('backdrop'), name: backdrop) else const ColoredBox(key: ValueKey('plain'), color: PxColors.bg),
                  // Gövde okunur kalsın diye sahne karartılır (anahtarlar, aşama değişince gövdenin durumu korunsun diye).
                  ColoredBox(key: const ValueKey('scrim'), color: showBackdrop && _stage == _Stage.done ? const Color(0x8C120D1C) : const Color(0x00000000)),
                  Offstage(
                    key: const ValueKey('body'),
                    offstage: _held == null && (_stage == _Stage.lines || (_stage == _Stage.intro && _freshNode)),
                    child: IgnorePointer(ignoring: !interactive, child: body),
                  ),
                  if (_stage == _Stage.lines)
                    DialoguePlayer(
                      key: ValueKey('player-$version-$_playKey'),
                      lines: _seq,
                      cast: cast,
                      history: _mem.history,
                      onLine: _onLine,
                      onDone: _release,
                    ),
                  if (_floats.isNotEmpty) Positioned.fill(key: const ValueKey('floats-layer'), child: Align(alignment: const Alignment(0, -0.35), child: FloatingDeltas(key: ValueKey('floats-$_floatKey'), items: _floats))),
                  if (_toast != null)
                    Positioned(
                      key: const ValueKey('toast-layer'),
                      top: 8,
                      left: 12,
                      right: 12,
                      child: Semantics(
                        liveRegion: true,
                        child: GestureDetector(
                          onTap: () => setState(() => _toast = null),
                          child: _ToastIn(key: ValueKey('toast-$_toastKey'), child: FeedbackBanner(feedback: _toast!)),
                        ),
                      ),
                    ),
                  if (_card != null) Positioned.fill(key: const ValueKey('card-layer'), child: FxCardOverlay(key: ValueKey(_card), card: _card!, onDone: _release, screenFx: _fx)),
                  if (busy) const Positioned(key: ValueKey('busy-layer'), top: 0, left: 0, right: 0, child: LinearProgressIndicator(minHeight: 3, color: PxColors.gold, backgroundColor: Colors.transparent)),
                ]),
              ),
              if (primaryChoice != null && interactive && !_epilogue)
                Container(
                  color: PxColors.ink,
                  padding: const EdgeInsets.fromLTRB(16, 10, 20, 12),
                  child: PxButton(
                    key: const ValueKey('primary-cta'),
                    label: primary!['label'] as String,
                    tone: switch (primary['tone']) { 'red' => PxTone.red, 'blue' => PxTone.blue, 'objection' => PxTone.objection, 'secondary' => PxTone.secondary, _ => PxTone.gold },
                    onTap: busy || primaryChoice['available'] != true ? null : () => chooseWithConfirm(context, primaryChoice, dispatch),
                  ),
                ),
            ]),
          ),
        ),
      ),
      // Perde ve bölüm kartı tüm ekranı (başlık dahil) örter.
    ).withOverlay(
      curtain: _curtain,
      chapter: _chapter == null ? null : ChapterCard(key: ValueKey('chapter-$_chapter'), chapter: _chapter!, onDone: _release),
    );
  }
}

extension on Widget {
  Widget withOverlay({required Animation<double> curtain, Widget? chapter}) => Stack(fit: StackFit.expand, children: [
        this,
        IgnorePointer(
          child: AnimatedBuilder(
            animation: curtain,
            builder: (context, _) => curtain.value == 0 || curtain.value == 1 ? const SizedBox.shrink() : CustomPaint(key: const ValueKey('curtain'), painter: CurtainPainter(curtain.value)),
          ),
        ),
        if (chapter != null) Material(type: MaterialType.transparency, child: chapter),
      ]);
}

/// Toast girişi: 3 basamakta yukarıdan iner (yer kaplamaz, altındaki içeriği itmez).
class _ToastIn extends StatefulWidget {
  const _ToastIn({super.key, required this.child});
  final Widget child;
  @override
  State<_ToastIn> createState() => _ToastInState();
}

class _ToastInState extends State<_ToastIn> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 150));
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_c.status == AnimationStatus.dismissed) MotionScope.of(context) == RetroMotion.off ? _c.value = 1 : _c.forward();
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
        animation: _c,
        child: widget.child,
        builder: (context, child) => Transform.translate(offset: Offset(0, -12 * (1 - const StepCurve(3).transform(_c.value))), child: child),
      );
}

class _HeaderChip extends StatelessWidget {
  const _HeaderChip({required this.label, required this.onTap});
  final String label;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) => Semantics(
        button: true,
        label: label,
        child: GestureDetector(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
            decoration: BoxDecoration(color: PxColors.panel, border: Border.all(color: PxColors.panelHi, width: 3)),
            child: ExcludeSemantics(child: Text(label, style: PxText.pixel(11, color: PxColors.muted))),
          ),
        ),
      );
}

/// Satırlar bitince son satır seçeneklerin üstünde kalır (soru kaybolmasın); dokunuş geçmişi açar.
class LastLineBox extends StatelessWidget {
  const LastLineBox({super.key, required this.line, required this.cast, this.onTap});
  final Map<String, dynamic> line;
  final Map<String, dynamic> cast;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final info = LineInfo.of(line, cast);
    final character = info.kind == SpeakerKind.character;
    final italic = info.kind == SpeakerKind.narrator || info.style == 'thought';
    return GestureDetector(
      key: const ValueKey('last-line'),
      onTap: onTap,
      child: PxBox(
        color: character ? PxColors.parchment : (info.kind == SpeakerKind.player ? const Color(0xFF1D3A66) : PxColors.panel),
        padding: const EdgeInsets.all(10),
        child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
          if (info.sprite != null && info.kind != SpeakerKind.player)
            Container(color: info.accent, padding: const EdgeInsets.all(3), margin: const EdgeInsets.only(right: 10), child: Portrait(info: info, px: 3))
          else if (info.kind == SpeakerKind.anonymous)
            Container(color: PxColors.ink, padding: const EdgeInsets.all(3), margin: const EdgeInsets.only(right: 10), child: const Silhouette(px: 3)),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              if (info.name != null && info.kind != SpeakerKind.card) Text(info.name!, style: PxText.pixel(11, color: character ? PxColors.parchmentInk : PxColors.gold)),
              Text(
                info.kind == SpeakerKind.card ? trUpper(info.text) : info.text,
                style: PxText.body(20, color: character ? PxColors.ink : (italic ? PxColors.muted : PxColors.text)).copyWith(fontStyle: italic ? FontStyle.italic : null),
              ),
            ]),
          ),
        ]),
      ),
    );
  }
}

/// Delil çantası ve not defteri: yalnızca bulunanlar.
class BagButton extends StatelessWidget {
  const BagButton({super.key, required this.view});
  final Map<String, dynamic> view;
  @override
  Widget build(BuildContext context) {
    final bag = ms(m(view['bag'])['items']);
    final notes = ms(m(view['notebook'])['items']);
    return Semantics(
      button: true,
      label: 'Çanta, ${bag.length + notes.length} öğe',
      child: GestureDetector(
        onTap: () => showModalBottomSheet<void>(
          context: context,
          backgroundColor: PxColors.bg,
          isScrollControlled: true,
          shape: const RoundedRectangleBorder(),
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
          child: ExcludeSemantics(child: Text('ÇANTA ${bag.length + notes.length}', style: PxText.pixel(11, color: PxColors.gold))),
        ),
      ),
    );
  }
}

/// Yükleme / hata kabuğu (görünüm henüz yokken).
class PlayLoading extends StatelessWidget {
  const PlayLoading({super.key, this.error, this.onRetry});
  final String? error;
  final VoidCallback? onRetry;
  @override
  Widget build(BuildContext context) => Scaffold(body: SafeArea(child: error != null ? ErrorView(message: error!, onRetry: onRetry ?? () {}) : const LoadingView()));
}
