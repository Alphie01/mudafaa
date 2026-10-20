import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:mudafaa/design_system/motion/retro_motion.dart';
import 'package:mudafaa/features/play/common.dart';

/// `test/fixtures/<id>.json` (dev galerisiyle aynı dosyalar).
Map<String, dynamic> fixture(String id) => m(jsonDecode(File('test/fixtures/$id.json').readAsStringSync()));
List<Map<String, dynamic>> steps(String id) => ms(fixture(id)['steps']);

/// Test çerçevesi: telefon boyutu, hareket düzeyi.
Widget harness(Widget child, {RetroMotion motion = RetroMotion.full, bool accessible = false}) {
  return MaterialApp(
    home: Builder(
      builder: (context) => MediaQuery(
        data: MediaQuery.of(context).copyWith(size: const Size(390, 844), accessibleNavigation: accessible),
        child: MotionScope(motion: motion, child: child),
      ),
    ),
  );
}
