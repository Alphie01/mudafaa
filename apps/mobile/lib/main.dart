import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app/app.dart';
import 'core/config.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // Yerel geliştirme Auth Emulator ile çalışır (proje demo-mudafaa); gerçek proje `flutterfire configure` ile gelir.
  await Firebase.initializeApp(
    options: const FirebaseOptions(apiKey: 'demo-key', appId: '1:1:web:1', messagingSenderId: '1', projectId: 'demo-mudafaa'),
  );
  if (AppConfig.useEmulator) await FirebaseAuth.instance.useAuthEmulator(AppConfig.emulatorHost, 9099);
  runApp(const ProviderScope(child: MudafaaApp()));
}
