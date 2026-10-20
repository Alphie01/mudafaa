import 'package:flutter/foundation.dart';

/// Derleme zamanı ayarları (`--dart-define`).
abstract final class AppConfig {
  static const _apiUrl = String.fromEnvironment('API_URL');
  static const useEmulator = bool.fromEnvironment('USE_AUTH_EMULATOR', defaultValue: true);
  static const _emulatorHost = String.fromEnvironment('AUTH_EMULATOR_HOST');

  /// Android emülatöründe makinenin localhost'u 10.0.2.2'dir.
  static String get _host => !kIsWeb && defaultTargetPlatform == TargetPlatform.android ? '10.0.2.2' : 'localhost';

  static String get apiUrl => _apiUrl.isNotEmpty ? _apiUrl : 'http://$_host:3000';
  static String get emulatorHost => _emulatorHost.isNotEmpty ? _emulatorHost : _host;
}
