import 'dart:convert';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:uuid/uuid.dart';

import '../../data/api.dart';

/// Oyun ekranının durumu: sunucunun son görünümü, son aksiyon sonucu, gönderim ve hata durumu.
class PlayState {
  const PlayState({this.view, this.busy = false, this.error});
  final Map<String, dynamic>? view;
  final bool busy;
  final String? error;

  Map<String, dynamic> get node => (view?['node'] as Map?)?.cast<String, dynamic>() ?? const {};
  Map<String, dynamic>? get last => (view?['last'] as Map?)?.cast<String, dynamic>();
  int get stateVersion => ((view?['session'] as Map?)?['stateVersion'] as int?) ?? 0;
  bool get completed => (view?['session'] as Map?)?['status'] == 'COMPLETED';

  PlayState copy({Map<String, dynamic>? view, bool? busy, String? error, bool clearError = false}) =>
      PlayState(view: view ?? this.view, busy: busy ?? this.busy, error: clearError ? null : (error ?? this.error));
}

const _storage = FlutterSecureStorage();

/// Aynı anda tek aksiyon gönderir; aksiyon gönderilmeden önce outbox'a yazılır (aynı clientActionId ile yeniden
/// gönderim çift puan yaratmaz). 409'da görünüm yenilenir, 422'de hata bandı gösterilir.
class SessionController extends Notifier<PlayState> {
  SessionController(this.sessionId);
  final String sessionId;

  @override
  PlayState build() {
    Future.microtask(_load);
    return const PlayState(busy: true);
  }

  Api get _api => ref.read(apiProvider);
  String get _outboxKey => 'outbox:$sessionId';

  Future<void> _load() async {
    try {
      final pending = await _storage.read(key: _outboxKey);
      if (pending != null) {
        await _send(jsonDecode(pending) as Map<String, dynamic>);
        return;
      }
      final view = await _api.get('/sessions/$sessionId/current-node');
      state = PlayState(view: view);
    } on ApiException catch (e) {
      state = state.copy(busy: false, error: e.message);
    }
  }

  Future<void> refresh() async {
    state = state.copy(busy: true, clearError: true);
    await _load();
  }

  Future<void> dispatch(Map<String, dynamic> action) async {
    if (state.busy || state.view == null) return;
    final req = {'clientActionId': const Uuid().v4(), 'expectedStateVersion': state.stateVersion, 'action': action};
    await _storage.write(key: _outboxKey, value: jsonEncode(req));
    await _send(req);
  }

  Future<void> _send(Map<String, dynamic> req, {int attempt = 0}) async {
    state = state.copy(busy: true, clearError: true);
    try {
      final res = await _api.post('/sessions/$sessionId/choose', req);
      await _storage.delete(key: _outboxKey);
      state = PlayState(view: (res['view'] as Map).cast<String, dynamic>());
    } on ApiException catch (e) {
      if (e.isNetwork && attempt < 2) return _send(req, attempt: attempt + 1);
      if (e.isNetwork) {
        state = state.copy(busy: false, error: e.message);
        return;
      }
      await _storage.delete(key: _outboxKey);
      if (e.status == 409) {
        final view = await _api.get('/sessions/$sessionId/current-node');
        state = PlayState(view: view, error: e.code == 'state_version_mismatch' ? null : e.message);
      } else {
        state = state.copy(busy: false, error: e.message);
      }
    }
  }

  void clearError() => state = state.copy(clearError: true);
}

final sessionControllerProvider = NotifierProvider.family<SessionController, PlayState, String>(SessionController.new);
