import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app/app.dart';
import 'core/config.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Gömülü yazı tiplerinin SIL OFL 1.1 lisansları (Lisanslar sayfasında görünür).
  LicenseRegistry.addLicense(() async* {
    for (final (pkg, file) in const [('Pixelify Sans', 'OFL-PixelifySans.txt'), ('VT323', 'OFL-VT323.txt')]) {
      yield LicenseEntryWithLineBreaks([pkg], await rootBundle.loadString('assets/fonts/$file'));
    }
  });
  // Yerel geliştirme Auth Emulator ile çalışır (proje demo-mudafaa); gerçek proje `flutterfire configure` ile gelir.
  await Firebase.initializeApp(
    options: const FirebaseOptions(apiKey: 'demo-key', appId: '1:1:web:1', messagingSenderId: '1', projectId: 'demo-mudafaa'),
  );
  if (AppConfig.useEmulator) await FirebaseAuth.instance.useAuthEmulator(AppConfig.emulatorHost, 9099);
  runApp(const ProviderScope(child: MudafaaApp()));
}
