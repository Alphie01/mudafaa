import 'package:flutter/material.dart';

import '../design_system/tokens/px_colors.dart';

/// Uygulamanın kökü: tasarım renkleri ve gömülü yazı tipleriyle temalanmış boş iskelet.
class MudafaaApp extends StatelessWidget {
  const MudafaaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Müdafaa',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: const ColorScheme.dark(
          primary: PxColors.gold,
          onPrimary: PxColors.ink,
          surface: PxColors.bg,
          onSurface: PxColors.text,
        ),
        // Gövde metni: VT323. Başlık ve düğmeler PixelifySans kullanır.
        fontFamily: 'VT323',
      ),
      home: const Scaffold(
        backgroundColor: PxColors.bg,
        body: Center(
          child: Text(
            'MÜDAFAA',
            style: TextStyle(
              fontFamily: 'PixelifySans',
              fontWeight: FontWeight.w700,
              fontSize: 62,
              color: PxColors.gold,
            ),
          ),
        ),
      ),
    );
  }
}
