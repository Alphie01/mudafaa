import 'dart:ui' show Color;

/// Tasarım referansındaki (design/reference) renk token'ları, anlamsal adlarla.
abstract final class PxColors {
  /// Ekran arka planı.
  static const bg = Color(0xFF1D1733);

  /// Kenarlık, sert gölge ve altın zemin üstündeki metin rengi.
  static const ink = Color(0xFF120D1C);

  /// Başlık ve birincil vurgu rengi.
  static const gold = Color(0xFFE8B13C);

  /// Koyu zeminler üstündeki birincil metin rengi.
  static const text = Color(0xFFEFE8FF);
}
