import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Oyun hareket ayarı. `full`: daktilo, perde, sarsıntı, ortam animasyonu. `reduced`: daktilo ve kartlar kalır;
/// sarsıntı, flaş, perde ve sürekli ortam animasyonu kapanır. `off`: hiçbir animasyon yok, metin anında gelir.
enum RetroMotion {
  full('Tam'),
  reduced('Azaltılmış'),
  off('Kapalı');

  const RetroMotion(this.label);
  final String label;

  bool get typewriter => this != RetroMotion.off;
  bool get cards => this != RetroMotion.off;
  bool get violent => this == RetroMotion.full;
  bool get ambient => this == RetroMotion.full;
}

const _key = 'retroMotion';
const _storage = FlutterSecureStorage();

/// Kalıcı ayar (secure storage). Okuma başarısızsa (test, eklentisiz platform) varsayılan `full` kalır.
class RetroMotionController extends Notifier<RetroMotion> {
  @override
  RetroMotion build() {
    Future.microtask(_load);
    return RetroMotion.full;
  }

  Future<void> _load() async {
    try {
      final v = await _storage.read(key: _key);
      final found = RetroMotion.values.where((m) => m.name == v);
      if (found.isNotEmpty) state = found.first;
    } catch (_) {}
  }

  Future<void> set(RetroMotion m) async {
    state = m;
    try {
      await _storage.write(key: _key, value: m.name);
    } catch (_) {}
  }
}

final retroMotionProvider = NotifierProvider<RetroMotionController, RetroMotion>(RetroMotionController.new);

/// Ağaca etkin hareket düzeyini yayar. `MediaQuery.disableAnimations` her zaman `off`'a zorlar.
class MotionScope extends InheritedWidget {
  const MotionScope({super.key, required this.motion, required super.child});
  final RetroMotion motion;

  static RetroMotion of(BuildContext context) {
    if (MediaQuery.maybeDisableAnimationsOf(context) ?? false) return RetroMotion.off;
    return context.dependOnInheritedWidgetOfExactType<MotionScope>()?.motion ?? RetroMotion.full;
  }

  @override
  bool updateShouldNotify(MotionScope old) => old.motion != motion;
}
