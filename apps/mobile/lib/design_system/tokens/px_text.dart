import 'package:flutter/painting.dart';

import 'px_colors.dart';

/// Yazı stilleri: başlık ve düğmeler Jersey 10, logo Pixelify Sans, gövde VT323.
abstract final class PxText {
  /// Jersey 10, Pixelify Sans'tan dar ve küçük çizer; tasarımdaki puntolar 1,3 ile ölçeklenir. Tek ağırlıklı fonttur:
  /// `weight` yalnızca API uyumu için durur, sahte kalınlık uygulanmaz.
  static const _jerseyScale = 1.3;

  static TextStyle pixel(double size, {FontWeight weight = FontWeight.w700, Color color = PxColors.text, double spacing = 0}) =>
      TextStyle(fontFamily: 'Jersey10', fontSize: size * _jerseyScale, fontWeight: FontWeight.w400, color: color, letterSpacing: spacing, height: 1.0);

  /// Oyun logosu (MÜDAFAA): tasarımdaki Pixelify Sans; büyük boyutta harfleri temiz.
  static TextStyle logo(double size, {Color color = PxColors.gold}) =>
      TextStyle(fontFamily: 'PixelifySans', fontSize: size, fontWeight: FontWeight.w700, color: color, letterSpacing: 2, height: 1.15);

  static TextStyle body(double size, {Color color = PxColors.text}) =>
      TextStyle(fontFamily: 'VT323', fontSize: size, color: color, height: 1.1);

  static final eyebrow = pixel(13, weight: FontWeight.w600, color: PxColors.muted, spacing: 2);
  static final title = pixel(22, color: PxColors.gold);
  static final label = pixel(11, weight: FontWeight.w600);
  static final speech = body(21);
}

/// Türkçe büyük harf (i → İ, ı → I).
String trUpper(String s) => s.replaceAll('i', 'İ').replaceAll('ı', 'I').toUpperCase();
