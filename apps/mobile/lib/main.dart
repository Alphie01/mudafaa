import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app/app.dart';
import 'core/config.dart';
import 'firebase_options.dart';
import 'features/play/voice/voice.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Gömülü yazı tiplerinin SIL OFL 1.1 lisansları (Lisanslar sayfasında görünür).
  LicenseRegistry.addLicense(() async* {
    for (final (pkg, file) in const [('Pixelify Sans', 'OFL-PixelifySans.txt'), ('VT323', 'OFL-VT323.txt'), ('Jersey 10', 'OFL-Jersey10.txt')]) {
      yield LicenseEntryWithLineBreaks([pkg], await rootBundle.loadString('assets/fonts/$file'));
    }
  });
  // Yerel geliştirme Auth Emulator ile çalışır (proje demo-mudafaa, API'nin FIREBASE_PROJECT_ID'si ile aynı);
  // USE_AUTH_EMULATOR=false derlemeleri gerçek projeye (mudafaa-app, `flutterfire configure`) bağlanır.
  await Firebase.initializeApp(
    options: AppConfig.useEmulator
        ? const FirebaseOptions(apiKey: 'demo-key', appId: '1:1:web:1', messagingSenderId: '1', projectId: 'demo-mudafaa')
        : DefaultFirebaseOptions.currentPlatform,
  );
  if (AppConfig.useEmulator) await FirebaseAuth.instance.useAuthEmulator(AppConfig.emulatorHost, 9099);
  // Blip sesleri açılışta Dart'ta sentezlenir (ses dosyası yok).
  AudioBlipSink.instance.warmUp();
  runApp(const ProviderScope(child: MudafaaApp()));
}
