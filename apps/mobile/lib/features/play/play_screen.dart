import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'play_shell.dart';
import 'session_controller.dart';

/// Canlı oturum ekranı: sunucu görünümünü oyun kabuğuna verir.
class PlayScreen extends ConsumerWidget {
  const PlayScreen({super.key, required this.sessionId});
  final String sessionId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final st = ref.watch(sessionControllerProvider(sessionId));
    final ctrl = ref.read(sessionControllerProvider(sessionId).notifier);
    final view = st.view;
    if (view == null) return PlayLoading(error: st.error, onRetry: ctrl.refresh);
    return PlayShell(
      view: view,
      memory: ctrl.memory,
      busy: st.busy,
      error: st.error,
      onClearError: ctrl.clearError,
      dispatch: ctrl.dispatch,
    );
  }
}
