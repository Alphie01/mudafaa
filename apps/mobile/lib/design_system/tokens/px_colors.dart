import 'dart:ui' show Color;

/// Tasarım referansındaki (design/reference) renk token'ları, anlamsal adlarla.
abstract final class PxColors {
  static const bg = Color(0xFF1D1733);
  static const ink = Color(0xFF120D1C);
  static const panel = Color(0xFF2B2350);
  static const panelHi = Color(0xFF3A2F66);
  static const panelLo = Color(0xFF4A3F7A);
  static const gold = Color(0xFFE8B13C);
  static const goldHi = Color(0xFFFFD36B);
  static const text = Color(0xFFEFE8FF);
  static const muted = Color(0xFFB3A8D6);
  static const dim = Color(0xFF6E6394);
  static const parchment = Color(0xFFF4E7C5);
  static const parchmentDk = Color(0xFFD9C597);
  static const parchmentInk = Color(0xFF5B4A2A);
  static const red = Color(0xFFA4321F);
  static const redHi = Color(0xFFE8503C);
  static const coral = Color(0xFFEF7A66);
  static const green = Color(0xFF2E7A4C);
  static const greenHi = Color(0xFF6FD08D);
  static const blue = Color(0xFF2F6DBB);
  static const blueHi = Color(0xFF4B8FE0);
  static const wood = Color(0xFF6B4630);
  static const woodDk = Color(0xFF3B2419);
  static const white = Color(0xFFFFFFFF);
}

/// Sprite paleti (Sprite.dc.html ile aynı harfler).
const Map<String, Color> spritePalette = {
  'k': Color(0xFF120D1C), 'e': Color(0xFF120D1C), 's': Color(0xFFF2B38A), 'S': Color(0xFFC9805E),
  'Q': Color(0xFFA86D45), 'J': Color(0xFF7C4C2C), 'h': Color(0xFF3A2A24), 'H': Color(0xFF7A4A2A),
  'y': Color(0xFFCFC9C1), 'Y': Color(0xFFE6C46A), 'q': Color(0xFFC96F2A), 'w': Color(0xFFF4EFE6),
  'b': Color(0xFF2F5A96), 'B': Color(0xFF1D3A66), 'r': Color(0xFFC4413A), 'R': Color(0xFFC0392B),
  'g': Color(0xFFE8B13C), 'm': Color(0xFF7B4FB0), 'n': Color(0xFF25222E), 'N': Color(0xFF4A4656),
  'p': Color(0xFF7A2F45), 'P': Color(0xFF4A1A2B), 'o': Color(0xFFE2802F), 'O': Color(0xFFA8521B),
  'c': Color(0xFF2C3E66), 'A': Color(0xFF1C2846), 'C': Color(0xFF9CC3E6), 'v': Color(0xFF5C5A66),
  'x': Color(0xFFB08463), 'z': Color(0xFF7D8590), 'Z': Color(0xFF4F5560), 'u': Color(0xFF6A4A9C),
  'U': Color(0xFF45306A), 'f': Color(0xFFB0496B), 'F': Color(0xFF7D2E48), 'j': Color(0xFF3B2F2A),
  'd': Color(0xFF3D5A80), 'D': Color(0xFF2A3F5C), 'i': Color(0xFF6A8A3E), 'I': Color(0xFF4A6428),
  't': Color(0xFF3F8A62), 'T': Color(0xFF2A5E44),
};

Color hexColor(String hex) => Color(int.parse('FF${hex.replaceFirst('#', '')}', radix: 16));
