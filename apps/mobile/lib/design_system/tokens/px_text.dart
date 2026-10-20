import 'package:flutter/painting.dart';

import 'px_colors.dart';

/// Yazı stilleri: başlık ve düğmeler Pixelify Sans, gövde VT323.
abstract final class PxText {
  static TextStyle pixel(double size, {FontWeight weight = FontWeight.w700, Color color = PxColors.text, double spacing = 0}) =>
      TextStyle(fontFamily: 'PixelifySans', fontSize: size, fontWeight: weight, color: color, letterSpacing: spacing, height: 1.15);

  static TextStyle body(double size, {Color color = PxColors.text}) =>
      TextStyle(fontFamily: 'VT323', fontSize: size, color: color, height: 1.1);

  static final eyebrow = pixel(13, weight: FontWeight.w600, color: PxColors.muted, spacing: 2);
  static final title = pixel(22, color: PxColors.gold);
  static final label = pixel(11, weight: FontWeight.w600);
  static final speech = body(21);
}

/// Türkçe büyük harf (i → İ, ı → I).
String trUpper(String s) => s.replaceAll('i', 'İ').replaceAll('ı', 'I').toUpperCase();
