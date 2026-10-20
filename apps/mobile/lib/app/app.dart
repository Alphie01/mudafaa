import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../design_system/motion/retro_motion.dart';
import '../design_system/tokens/px_colors.dart';
import '../features/dev/dev_gallery.dart';
import '../features/auth/login_screen.dart';
import '../features/cases/cases_screen.dart';
import '../features/home/home_screen.dart';
import '../features/play/play_screen.dart';
import '../features/result/result_screen.dart';

class _AuthListenable extends ChangeNotifier {
  _AuthListenable() {
    _sub = FirebaseAuth.instance.authStateChanges().listen((_) => notifyListeners());
  }
  late final StreamSubscription<User?> _sub;
  @override
  void dispose() {
    _sub.cancel();
    super.dispose();
  }
}

final _auth = _AuthListenable();

final router = GoRouter(
  initialLocation: '/',
  refreshListenable: _auth,
  redirect: (context, state) {
    // Geliştirici galerisi yalnızca debug derlemede vardır ve oturum gerektirmez.
    if (kDebugMode && state.matchedLocation.startsWith('/_dev')) return null;
    final signedIn = FirebaseAuth.instance.currentUser != null;
    final atLogin = state.matchedLocation == '/login';
    if (!signedIn && !atLogin) return '/login';
    if (signedIn && atLogin) return '/';
    return null;
  },
  routes: [
    GoRoute(path: '/login', builder: (_, _) => const LoginScreen()),
    GoRoute(path: '/', builder: (_, _) => const HomeScreen()),
    GoRoute(path: '/cases', builder: (_, _) => const CasesScreen()),
    GoRoute(path: '/play/:id', builder: (_, s) => PlayScreen(sessionId: s.pathParameters['id']!)),
    GoRoute(path: '/sessions/:id/report', builder: (_, s) => ResultScreen(sessionId: s.pathParameters['id']!)),
    if (kDebugMode) ...[
      GoRoute(path: '/_dev/play', builder: (_, _) => const DevGalleryScreen()),
      GoRoute(path: '/_dev/play/:fixture', builder: (_, s) => DevPlayScreen(fixture: s.pathParameters['fixture']!)),
    ],
  ],
);

/// Uygulamanın kökü: tasarım renkleri, gömülü yazı tipleri ve ≥600px'te ortalanmış 430px çerçeve.
class MudafaaApp extends StatelessWidget {
  const MudafaaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'Müdafaa',
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      theme: ThemeData(
        colorScheme: const ColorScheme.dark(primary: PxColors.gold, onPrimary: PxColors.ink, surface: PxColors.bg, onSurface: PxColors.text),
        scaffoldBackgroundColor: PxColors.bg,
        fontFamily: 'VT323',
      ),
      builder: (context, child) {
        final mq = MediaQuery.of(context);
        final framed = Container(
          color: PxColors.ink,
          alignment: Alignment.center,
          child: ConstrainedBox(constraints: const BoxConstraints(maxWidth: 430), child: child),
        );
        return MediaQuery(
          data: mq.copyWith(textScaler: mq.textScaler.clamp(minScaleFactor: 1, maxScaleFactor: 1.3)),
          child: Consumer(
            builder: (context, ref, _) => MotionScope(
              motion: ref.watch(retroMotionProvider),
              child: mq.size.width >= 600 ? framed : (child ?? const SizedBox()),
            ),
          ),
        );
      },
    );
  }
}
