import 'dart:ui';

import 'px_canvas.dart';

// Noir paleti: mor-lacivert gölgeler, sodyum lamba sarısı, ıslak asfalt yansımaları. `f` 8 fps kare sayacıdır
// (hareket kapalıyken 0). Sahneler oransal yerleşir; ilgi çekici kısım üst %65'tedir (alt kısmı diyalog kutusu örter).

const _ink = Color(0xFF120D1C);
const _sky0 = Color(0xFF0E0B1A);
const _sky1 = Color(0xFF1A1530);
const _bld0 = Color(0xFF1F1934);
const _bld1 = Color(0xFF2B2350);
const _amber = Color(0xFFE8B13C);
const _amberHi = Color(0xFFFFD36B);
const _amberDim = Color(0xFF7A5A22);
const _glow = Color(0x1FFFD36B);
const _glow2 = Color(0x14FFD36B);
const _asphalt = Color(0xFF15121F);
const _wood = Color(0xFF6B4630);
const _woodDk = Color(0xFF3B2419);
const _woodMd = Color(0xFF4A2F24);
const _parch = Color(0xFFF4E7C5);
const _parchDk = Color(0xFFD9C597);
const _steel = Color(0xFF4A4656);
const _steelHi = Color(0xFF6E6394);
const _rain = Color(0x8CB3A8D6);
const _dust = Color(0x55F4E7C5);

typedef ScenePainter = void Function(PxCanvas p, int f);

const Map<String, ScenePainter> scenes = {
  'siyah': _siyah,
  'buro': _buro,
  'buro_gece': _buroGece,
  'gorus_odasi': _gorusOdasi,
  'durusma_salonu': _durusma,
  'adliye': _adliye,
  'karakol': _karakol,
  'sokak_gece': _sokakGece,
  'sokak_yagmur': _sokakYagmur,
  'sokak_karanlik': _sokakKaranlik,
  'sokak_sabah': _sokakSabah,
  'depo': _depo,
  'depo_gece': _depoGece,
  'cay_ocagi': _cayOcagi,
  'ev': _ev,
  'kafe': _kafe,
  'hastane': _hastane,
  'liman_gece': _limanGece,
  'arac': _arac,
};

// ---------- ortak parçalar ----------

void dust(PxCanvas p, int f, {int count = 18, Color color = _dust, double top = 0, double bottom = 0.7}) {
  for (var i = 0; i < count; i++) {
    final span = p.h * (bottom - top);
    final x = (rnd(i) * p.w + f * (0.15 + rnd(i + 7) * 0.2)) % p.w;
    final y = p.h * top + (rnd(i + 3) * span - f * (0.1 + rnd(i + 11) * 0.15)) % span;
    if (((f ~/ 6) + i) % 5 != 0) p.dot(x, y < 0 ? y + span : y, color);
  }
}

void rain(PxCanvas p, int f, {double bottom = 1, int count = 60}) {
  for (var i = 0; i < count; i++) {
    final x = (rnd(i) * (p.w + 20) - (f * 2 + i * 3) % 20).round();
    final y = ((rnd(i + 50) * p.h * bottom) + f * 6) % (p.h * bottom);
    p.r(x, y, 1, 3, _rain);
  }
}

/// Basamaklı duvar saati; yelkovan 8 yönde döner.
void clock(PxCanvas p, num cx, num cy, int f, {Color face = _parch, Color rim = _ink}) {
  p.disc(cx, cy, 5, rim);
  p.disc(cx, cy, 4, face);
  const dirs = [(0, -1), (1, -1), (1, 0), (1, 1), (0, 1), (-1, 1), (-1, 0), (-1, -1)];
  final (mx, my) = dirs[(f ~/ 16) % 8];
  for (var i = 1; i <= 3; i++) {
    p.dot(cx + mx * i, cy + my * i, _ink);
  }
  p.dot(cx - 1, cy, _ink);
  p.dot(cx - 2, cy, _ink);
  p.dot(cx, cy, const Color(0xFFA4321F));
}

/// Tavan vantilatörü: iki kareli kanat dönüşü.
void fan(PxCanvas p, num cx, num top, int f) {
  p.r(cx, top, 1, 4, _ink);
  p.r(cx - 1, top + 4, 3, 2, _steel);
  if ((f ~/ 2) % 2 == 0) {
    p.r(cx - 12, top + 5, 11, 1, _ink);
    p.r(cx + 2, top + 5, 11, 1, _ink);
  } else {
    p.r(cx - 7, top + 4, 6, 1, _ink);
    p.r(cx + 2, top + 6, 6, 1, _ink);
    p.r(cx - 4, top + 6, 3, 1, _ink);
    p.r(cx + 2, top + 4, 3, 1, _ink);
  }
}

/// Floresan tüp; ara sıra titrer.
void tube(PxCanvas p, num x, num y, num w, int f, {bool flicker = true}) {
  final off = flicker && (f % 53 == 0 || f % 53 == 2 || f % 97 == 5);
  p.r(x, y, w, 2, off ? _steel : const Color(0xFFE6F2EA));
  if (!off) p.r(x - 4, y + 2, w + 8, 10, const Color(0x14E6F2EA));
}

/// Jaluzi: pencereden sızan ışık şeritleri (noir imzası).
void blinds(PxCanvas p, num x, num y, num w, num h, Color sky, Color slat) {
  p.r(x - 1, y - 1, w + 2, h + 2, _ink);
  p.r(x, y, w, h, sky);
  for (var yy = y + 1; yy < y + h; yy += 3) {
    p.r(x, yy, w, 1, slat);
  }
}

/// Işık şeritlerinin yere/duvara düşen izi.
void blindStripes(PxCanvas p, num x, num y, num w, int n, Color c) {
  for (var i = 0; i < n; i++) {
    p.r(x + i * 2, y + i * 4, w, 2, c);
  }
}

/// Sokak lambası ve ışık konisi; `flicker` ise ara sıra söner, `dead` ise hiç yanmaz (kararmış ampul).
void lampPost(PxCanvas p, num x, num ground, int f, {bool flicker = true, bool dead = false, num height = 60}) {
  final top = ground - height;
  p.r(x, top, 2, height, _steel);
  p.r(x, top, 8, 2, _steel);
  p.r(x - 1, ground - 3, 4, 3, _steel);
  p.r(x + 6, top + 2, 4, 2, _steel);
  if (dead) {
    p.r(x + 6, top + 4, 4, 1, const Color(0xFF2A2438));
    return;
  }
  final off = flicker && ((f % 41) == 3 || (f % 41) == 5 || (f % 67) == 10);
  if (!off) {
    p.r(x + 6, top + 4, 4, 1, _amberHi);
    p.cone(x + 8, top + 5, height - 5, 34, _glow2, topW: 4);
    p.r(x - 7, ground, 30, 2, const Color(0x40FFD36B));
  }
}

/// Şehir silueti ve yanan pencereler.
void skyline(PxCanvas p, num horizon, int f, {int seed = 0}) {
  var x = 0;
  var i = seed;
  while (x < p.w) {
    final bw = 10 + (rnd(i) * 14).round();
    final bh = 20 + (rnd(i + 99) * horizon * 0.55).round();
    final c = i % 2 == 0 ? _bld0 : _bld1;
    p.r(x, horizon - bh, bw, bh, c);
    for (var wy = horizon - bh + 3; wy < horizon - 3; wy += 5) {
      for (var wx = x + 2; wx < x + bw - 2; wx += 4) {
        final k = (wx * 31 + wy * 17).toInt();
        final lit = rnd(k) > 0.72 && !(rnd(k + (f ~/ 80)) > 0.97);
        p.r(wx, wy, 2, 2, lit ? (rnd(k + 1) > 0.5 ? _amber : _amberDim) : const Color(0xFF15111F));
      }
    }
    x += bw;
    i++;
  }
}

void stars(PxCanvas p, int f, double bottom) {
  for (var i = 0; i < 20; i++) {
    if ((f ~/ 4 + i) % 9 == 0) continue;
    p.dot(rnd(i + 200) * p.w, rnd(i + 300) * p.h * bottom, i % 3 == 0 ? _parch : const Color(0xFF6E6394));
  }
}

void desk(PxCanvas p, num x, num y, num w, {Color top = _wood, Color body = _woodDk}) {
  p.r(x, y, w, 3, top);
  p.r(x, y + 3, w, 1, _ink);
  p.r(x + 1, y + 4, w - 2, 12, body);
  p.r(x + 3, y + 7, 8, 1, _woodMd);
}

void shelf(PxCanvas p, num x, num y, num w, num h, {int seed = 0}) {
  p.r(x, y, w, h, _woodDk);
  const cols = [Color(0xFFA4321F), Color(0xFF2F6DBB), Color(0xFFE8B13C), Color(0xFF2E7A4C), Color(0xFFD9C597), Color(0xFF7B4FB0)];
  for (var sy = y + 2; sy < y + h - 2; sy += 8) {
    var sx = x + 1;
    var i = seed + sy.toInt();
    while (sx < x + w - 2) {
      final bw = 2 + (rnd(i) * 2).round();
      final bh = 4 + (rnd(i + 5) * 2).round();
      p.r(sx, sy + 6 - bh, bw, bh, cols[i % cols.length]);
      sx += bw + (rnd(i + 9) > 0.8 ? 2 : 0);
      i++;
    }
    p.r(x, sy + 6, w, 1, _wood);
  }
}

void wallFloor(PxCanvas p, Color wall, Color floor, double horizon, {Color? trim}) {
  p.fill(wall);
  p.r(0, p.h * horizon, p.w, p.h, floor);
  if (trim != null) p.r(0, p.h * horizon - 1, p.w, 2, trim);
}

void wetReflections(PxCanvas p, num y0, int f) {
  for (var i = 0; i < 14; i++) {
    final x = rnd(i + 40) * p.w;
    final y = y0 + 4 + rnd(i + 60) * (p.h - y0 - 4);
    final wave = ((f ~/ 3) + i) % 3;
    p.r(x + wave, y, 4 + (rnd(i) * 6).round(), 1, const Color(0x33FFD36B));
  }
}

// ---------- sahneler ----------

void _siyah(PxCanvas p, int f) {
  p.fill(const Color(0xFF07050C));
  dust(p, f, count: 10, color: const Color(0x22B3A8D6), bottom: 1);
}

void _office(PxCanvas p, int f, {required bool night}) {
  final wall = night ? const Color(0xFF1F1A36) : const Color(0xFF5A4A6E);
  final floor = night ? const Color(0xFF15111F) : const Color(0xFF3B2B3A);
  wallFloor(p, wall, floor, 0.58, trim: night ? _ink : _woodDk);
  final wx = p.w * 0.08, wy = p.h * 0.1, ww = p.w * 0.38, wh = p.h * 0.26;
  if (night) {
    blinds(p, wx, wy, ww, wh, const Color(0xFF3A3166), const Color(0xFF120D1C));
    // Sokaktan gelen ışık şeritleri karşı duvara ve yere düşer.
    blindStripes(p, p.w * 0.5, p.h * 0.18, p.w * 0.3, 6, const Color(0x1AE8B13C));
    blindStripes(p, p.w * 0.2, p.h * 0.62, p.w * 0.45, 5, const Color(0x0FE8B13C));
    if (f % 120 < 60) p.r(wx + ww * 0.6, wy + 2, 3, 2, const Color(0xFFEF7A66)); // dışarıda neon
  } else {
    blinds(p, wx, wy, ww, wh, const Color(0xFF9CC3E6), const Color(0xFFD9C597));
    blindStripes(p, p.w * 0.25, p.h * 0.62, p.w * 0.5, 5, const Color(0x12FFF2C0));
  }
  shelf(p, p.w * 0.62, p.h * 0.12, p.w * 0.3, p.h * 0.36, seed: 3);
  clock(p, p.w * 0.53, p.h * 0.1, f, face: night ? _parchDk : _parch);
  if (!night) fan(p, p.w * 0.3, 0, f);
  desk(p, p.w * 0.1, p.h * 0.5, p.w * 0.55);
  // Masa lambası ve dosya yığını.
  p.r(p.w * 0.16, p.h * 0.5 - 3, 7, 3, _parch);
  p.r(p.w * 0.17, p.h * 0.5 - 5, 6, 2, _parchDk);
  p.r(p.w * 0.5, p.h * 0.5 - 7, 1, 7, _ink);
  p.r(p.w * 0.47, p.h * 0.5 - 9, 6, 3, const Color(0xFF2E7A4C));
  if (night) p.cone(p.w * 0.5 + 1, p.h * 0.5 - 6, 8, 16, _glow, topW: 4);
  dust(p, f, count: night ? 8 : 16, top: 0.05, bottom: 0.55);
}

void _buro(PxCanvas p, int f) => _office(p, f, night: false);
void _buroGece(PxCanvas p, int f) => _office(p, f, night: true);

void _gorusOdasi(PxCanvas p, int f) {
  wallFloor(p, const Color(0xFF4A4656), const Color(0xFF6E6394), 0.6, trim: const Color(0xFF8B80B0));
  p.r(0, 0, p.w, p.h * 0.06, const Color(0xFF3A3550));
  tube(p, p.w * 0.35, p.h * 0.06, p.w * 0.3, f);
  // Parmaklıklı küçük pencere.
  final wx = p.w * 0.08, wy = p.h * 0.14;
  p.r(wx - 1, wy - 1, 14, 14, _ink);
  p.r(wx, wy, 12, 12, const Color(0xFF2B2350));
  for (var i = 2; i < 12; i += 3) {
    p.r(wx + i, wy, 1, 12, _ink);
  }
  // Cam bölme ve masa.
  p.r(p.w * 0.25, p.h * 0.08, 2, p.h * 0.52, _steel);
  p.r(p.w * 0.75, p.h * 0.08, 2, p.h * 0.52, _steel);
  p.r(p.w * 0.25, p.h * 0.08, p.w * 0.5 + 2, 2, _steel);
  p.r(p.w * 0.27, p.h * 0.1, p.w * 0.48, p.h * 0.5, const Color(0x149CC3E6));
  p.r(p.w * 0.3, p.h * 0.14, 2, 10, const Color(0x339CC3E6));
  p.r(0, p.h * 0.56, p.w, 4, const Color(0xFF8B80B0));
  p.r(0, p.h * 0.56 + 4, p.w, 2, _ink);
  dust(p, f, count: 10, top: 0.08, bottom: 0.55);
}

void _durusma(PxCanvas p, int f) {
  wallFloor(p, _woodMd, const Color(0xFF2B1D16), 0.62, trim: _woodDk);
  // Ahşap panel çizgileri.
  for (var x = 4; x < p.w; x += 14) {
    p.r(x, p.h * 0.1, 1, p.h * 0.36, _woodDk);
  }
  p.r(0, 0, p.w, p.h * 0.08, _woodDk);
  p.r(p.w * 0.2, p.h * 0.03, p.w * 0.6, 4, const Color(0xFF2B1D16));
  for (var x = p.w * 0.22; x < p.w * 0.78; x += 3) {
    p.r(x, p.h * 0.03 + 1, 2, 1, _amberDim);
  }
  // Terazi amblemi.
  final cx = p.w / 2, cy = p.h * 0.16;
  p.r(cx, cy - 4, 1, 10, _amber);
  p.r(cx - 7, cy - 3, 15, 1, _amber);
  p.r(cx - 9, cy + 1, 5, 1, _amber);
  p.r(cx + 5, cy + 1, 5, 1, _amber);
  p.r(cx - 7, cy - 2, 1, 3, _amber);
  p.r(cx + 7, cy - 2, 1, 3, _amber);
  p.r(cx - 3, cy + 6, 7, 1, _amber);
  // Kürsü.
  p.r(0, p.h * 0.36, p.w, p.h * 0.1, _wood);
  p.r(0, p.h * 0.36, p.w, 1, const Color(0xFF8A5A3E));
  p.r(0, p.h * 0.46, p.w, 2, _ink);
  fan(p, p.w * 0.18, p.h * 0.08, f);
  fan(p, p.w * 0.82, p.h * 0.08, f + 1);
  dust(p, f, count: 14, top: 0.1, bottom: 0.6);
}

void _adliye(PxCanvas p, int f) {
  p.fill(const Color(0xFF241C40));
  p.r(0, p.h * 0.3, p.w, p.h * 0.2, const Color(0xFF2E2350));
  stars(p, f, 0.3);
  final l = p.w * 0.12, r = p.w * 0.88, top = p.h * 0.16, base = p.h * 0.52;
  // Alınlık.
  for (var i = 0; i < 6; i++) {
    p.r(p.w / 2 - (r - l) / 2 * (i / 6), top - 6 + i, (r - l) * (i / 6), 1, _parchDk);
  }
  p.r(l - 2, top, r - l + 4, 4, _parchDk);
  p.r(l, top + 4, r - l, base - top - 4, const Color(0xFFBFAF86));
  for (var x = l + 3; x < r - 4; x += (r - l) / 6) {
    p.r(x, top + 6, 4, base - top - 8, _parch);
    p.r(x + 4, top + 6, 1, base - top - 8, _parchDk);
  }
  for (var i = 0; i < 4; i++) {
    p.r(l - 4 - i * 3, base + i * 2, r - l + 8 + i * 6, 2, i.isEven ? _parchDk : const Color(0xFFBFAF86));
  }
  p.r(0, base + 8, p.w, p.h, const Color(0xFF1A1428));
  // Kapının ardında yanan ışık.
  p.r(p.w / 2 - 4, base - 12, 8, 12, f % 90 < 88 ? _amberDim : _ink);
  lampPost(p, p.w * 0.04, base + 8, f, flicker: false, height: 30);
}

void _karakol(PxCanvas p, int f) {
  wallFloor(p, const Color(0xFF3D5A80), const Color(0xFF2A3F5C), 0.6, trim: _ink);
  p.r(0, p.h * 0.36, p.w, p.h * 0.24, const Color(0xFF2A3F5C));
  for (var x = 0; x < p.w; x += 6) {
    p.r(x, p.h * 0.36, 1, p.h * 0.24, const Color(0xFF223450));
  }
  tube(p, p.w * 0.15, p.h * 0.04, p.w * 0.25, f);
  tube(p, p.w * 0.6, p.h * 0.04, p.w * 0.25, f + 17);
  // İlan panosu.
  p.r(p.w * 0.08, p.h * 0.12, p.w * 0.34, p.h * 0.18, _woodMd);
  for (var i = 0; i < 5; i++) {
    p.r(p.w * 0.1 + i * 6, p.h * 0.14 + (i % 2) * 6, 5, 6, i == 2 ? const Color(0xFFEF7A66) : _parch);
  }
  // Nezarethane parmaklığı.
  final bx = p.w * 0.6, by = p.h * 0.14;
  p.r(bx, by, p.w * 0.32, p.h * 0.46, const Color(0xFF15111F));
  for (var x = bx; x < bx + p.w * 0.32; x += 4) {
    p.r(x, by, 1, p.h * 0.46, _steelHi);
  }
  p.r(bx, by, p.w * 0.32, 2, _steelHi);
  desk(p, p.w * 0.06, p.h * 0.48, p.w * 0.44, top: const Color(0xFF7D8590), body: const Color(0xFF4F5560));
  dust(p, f, count: 8, top: 0.06, bottom: 0.55);
}

void _street(PxCanvas p, int f, {required bool wet, bool deadLamp = false, bool morning = false}) {
  p.fill(morning ? const Color(0xFF5A5672) : _sky0);
  p.r(0, p.h * 0.2, p.w, p.h * 0.25, morning ? const Color(0xFF6E6A86) : _sky1);
  if (!morning) stars(p, f, 0.2);
  final horizon = p.h * 0.5;
  skyline(p, horizon, f);
  p.r(0, horizon, p.w, p.h, _asphalt);
  p.r(0, horizon, p.w, 2, const Color(0xFF2B2350));
  // Kaldırım ve yol çizgisi.
  for (var x = 2; x < p.w; x += 16) {
    p.r(x, horizon + p.h * 0.12, 8, 1, const Color(0xFF3A2F66));
  }
  lampPost(p, p.w * 0.66, horizon + 4, f, height: p.h * 0.32, dead: deadLamp || morning);
  if (wet) {
    wetReflections(p, horizon, f);
    rain(p, f);
    // Su birikintisinde halkalar.
    for (var i = 0; i < 5; i++) {
      final ph = (f + i * 5) % 16;
      final x = rnd(i + 70) * p.w, y = horizon + 6 + rnd(i + 80) * p.h * 0.2;
      if (ph < 8) p.r(x - ph / 2, y, ph + 1, 1, const Color(0x40B3A8D6));
    }
  } else {
    dust(p, f, count: 10, color: const Color(0x33B3A8D6), top: 0.2, bottom: 0.6);
  }
}

void _sokakGece(PxCanvas p, int f) => _street(p, f, wet: false);
void _sokakYagmur(PxCanvas p, int f) => _street(p, f, wet: true);

/// Lambası kararmış, çiseleyen gece sokağı (ışığın olmadığı sahneler).
void _sokakKaranlik(PxCanvas p, int f) => _street(p, f, wet: true, deadLamp: true);

/// Gri sabah ışığında ıslak sokak; lamba sönük.
void _sokakSabah(PxCanvas p, int f) => _street(p, f, wet: false, morning: true);

void _warehouseInterior(PxCanvas p, int f, {required bool night}) {
  final wall = night ? const Color(0xFF1A1630) : const Color(0xFF4F5560);
  wallFloor(p, wall, night ? const Color(0xFF110E1A) : const Color(0xFF2E2B33), 0.6);
  // Oluklu sac.
  for (var x = 0; x < p.w; x += 3) {
    p.r(x, 0, 1, p.h * 0.6, night ? const Color(0xFF15122A) : const Color(0xFF454A55));
  }
  // Yüksek pencereler ve ışık huzmeleri.
  for (var i = 0; i < 3; i++) {
    final x = p.w * (0.12 + i * 0.3);
    p.r(x, p.h * 0.05, 14, 6, _ink);
    p.r(x + 1, p.h * 0.05 + 1, 12, 4, night ? const Color(0xFF2B2350) : const Color(0xFFCFE0F0));
    if (!night) {
      for (var k = 0; k < 30; k += 2) {
        p.r(x + 1 + k * 0.6, p.h * 0.05 + 6 + k, 12, 2, const Color(0x12FFF2C0));
      }
    }
  }
  // Kumaş topu rafları.
  const rolls = [Color(0xFFA4321F), Color(0xFF2F6DBB), Color(0xFFD9C597), Color(0xFF7B4FB0), Color(0xFF2E7A4C)];
  for (var s = 0; s < 3; s++) {
    final y = p.h * 0.24 + s * 10;
    p.r(p.w * 0.05, y + 7, p.w * 0.9, 1, _woodDk);
    for (var x = p.w * 0.06; x < p.w * 0.93; x += 5) {
      final c = rolls[((x * 7).toInt() + s) % rolls.length];
      p.r(x, y + 1, 4, 6, night ? Color.lerp(c, _ink, 0.6)! : c);
      p.dot(x + 1, y + 3, _ink);
    }
  }
  if (night) {
    // Tek çıplak ampul.
    final cx = p.w * 0.5;
    p.r(cx, 0, 1, p.h * 0.1, _ink);
    final on = !(f % 37 == 4 || f % 59 == 9);
    p.r(cx - 1, p.h * 0.1, 3, 2, on ? _amberHi : _steel);
    if (on) p.cone(cx, p.h * 0.1 + 2, p.h * 0.5, 50, _glow2, topW: 4);
  }
  dust(p, f, count: night ? 10 : 24, top: 0.05, bottom: 0.6, color: night ? const Color(0x33F4E7C5) : _dust);
}

void _depo(PxCanvas p, int f) => _warehouseInterior(p, f, night: false);
void _depoGece(PxCanvas p, int f) => _warehouseInterior(p, f, night: true);

void _cayOcagi(PxCanvas p, int f) {
  wallFloor(p, const Color(0xFF5B4A2A), const Color(0xFF3B2419), 0.6, trim: _ink);
  for (var y = 0; y < p.h * 0.6; y += 5) {
    for (var x = (y ~/ 5).isEven ? 0 : 3; x < p.w; x += 6) {
      p.r(x, y, 5, 4, const Color(0xFF66543A));
    }
  }
  // Tezgâh.
  desk(p, p.w * 0.05, p.h * 0.44, p.w * 0.9, top: const Color(0xFF7D8590), body: _woodMd);
  // Semaver / çaydanlık.
  final cx = p.w * 0.3, base = p.h * 0.44;
  p.r(cx - 5, base - 12, 10, 12, const Color(0xFFB0496B));
  p.r(cx - 3, base - 16, 6, 4, const Color(0xFFC96F2A));
  p.r(cx - 4, base - 12, 1, 12, const Color(0xFFF2B38A));
  for (var i = 0; i < 4; i++) {
    final yy = base - 18 - i * 3 - (f % 6);
    p.r(cx - 1 + ((f ~/ 3 + i) % 3) - 1, yy, 2, 2, const Color(0x40FFFFFF));
  }
  // İnce belli bardaklar.
  for (var i = 0; i < 4; i++) {
    final x = p.w * 0.5 + i * 7;
    p.r(x, base - 5, 3, 5, const Color(0x99E8B13C));
    p.r(x, base - 5, 3, 1, const Color(0xFFA4321F));
  }
  // Askıda radyo ve ampul.
  p.r(p.w * 0.75, p.h * 0.18, 12, 7, _woodDk);
  p.r(p.w * 0.75 + 2, p.h * 0.18 + 2, 4, 3, _steelHi);
  p.r(p.w * 0.55, 0, 1, p.h * 0.12, _ink);
  p.r(p.w * 0.55 - 1, p.h * 0.12, 3, 2, _amberHi);
  p.cone(p.w * 0.55, p.h * 0.12 + 2, p.h * 0.3, 40, _glow2);
  clock(p, p.w * 0.12, p.h * 0.14, f);
}

void _ev(PxCanvas p, int f) {
  wallFloor(p, const Color(0xFF4A3F5C), const Color(0xFF3B2419), 0.62, trim: _woodDk);
  for (var x = 2; x < p.w; x += 8) {
    for (var y = 3; y < p.h * 0.6; y += 8) {
      p.dot(x + ((y ~/ 8).isEven ? 0 : 4), y, const Color(0xFF5A4E6E));
    }
  }
  // Perdeli pencere.
  final wx = p.w * 0.58, wy = p.h * 0.1;
  p.r(wx, wy, p.w * 0.3, p.h * 0.22, _ink);
  p.r(wx + 1, wy + 1, p.w * 0.3 - 2, p.h * 0.22 - 2, _sky1);
  stars(p, f, 0.0);
  p.r(wx - 3, wy - 2, 6, p.h * 0.26, const Color(0xFF7D2E48));
  p.r(wx + p.w * 0.3 - 3, wy - 2, 6, p.h * 0.26, const Color(0xFF7D2E48));
  // Kanepe.
  p.r(p.w * 0.06, p.h * 0.46, p.w * 0.46, p.h * 0.1, const Color(0xFF2C3E66));
  p.r(p.w * 0.06, p.h * 0.42, p.w * 0.46, 5, const Color(0xFF1C2846));
  p.r(p.w * 0.04, p.h * 0.44, 4, p.h * 0.12, const Color(0xFF1C2846));
  p.r(p.w * 0.52, p.h * 0.44, 4, p.h * 0.12, const Color(0xFF1C2846));
  // Televizyon ışığı titrer.
  final tv = [const Color(0x223B6BC0), const Color(0x2A6FA0E0), const Color(0x1A9CC3E6)][(f ~/ 3) % 3];
  p.r(0, 0, p.w, p.h, tv);
  // Abajur.
  p.r(p.w * 0.66, p.h * 0.4, 1, p.h * 0.18, _ink);
  p.r(p.w * 0.66 - 4, p.h * 0.36, 9, 4, _parchDk);
  p.cone(p.w * 0.66, p.h * 0.4, 14, 22, _glow);
  // Duvarda çerçeveli fotoğraf.
  p.r(p.w * 0.16, p.h * 0.16, 12, 10, _woodDk);
  p.r(p.w * 0.16 + 2, p.h * 0.16 + 2, 8, 6, _parchDk);
}

void _kafe(PxCanvas p, int f) {
  wallFloor(p, const Color(0xFF3B2F2A), const Color(0xFF241A16), 0.62, trim: _ink);
  // Vitrin camından sokak.
  final wx = p.w * 0.05, wy = p.h * 0.08, ww = p.w * 0.9, wh = p.h * 0.28;
  p.r(wx - 1, wy - 1, ww + 2, wh + 2, _ink);
  p.r(wx, wy, ww, wh, _sky0);
  for (var x = wx; x < wx + ww; x += 9) {
    final bh = 6 + rnd(x.toInt()) * wh * 0.6;
    p.r(x, wy + wh - bh, 8, bh, _bld0);
    if (rnd(x.toInt() + 3) > 0.5) p.r(x + 3, wy + wh - bh + 3, 2, 2, _amberDim);
  }
  p.r(wx + ww / 2, wy, 1, wh, _ink);
  // Geçen araba farı.
  final carX = wx + ((f * 2) % (ww + 40)) - 20;
  if (carX > wx && carX < wx + ww - 4) p.r(carX, wy + wh - 3, 4, 1, _amberHi);
  // Asılı lambalar.
  for (var i = 0; i < 3; i++) {
    final x = p.w * (0.2 + i * 0.3);
    p.r(x, 0, 1, p.h * 0.06, _ink);
    p.r(x - 3, p.h * 0.06, 7, 3, const Color(0xFF2E7A4C));
    p.cone(x, p.h * 0.06 + 3, p.h * 0.18, 18, _glow2);
  }
  // Tezgâh.
  desk(p, p.w * 0.04, p.h * 0.46, p.w * 0.92, top: _wood, body: _woodMd);
  for (var i = 0; i < 3; i++) {
    final x = p.w * 0.2 + i * 14;
    p.r(x, p.h * 0.46 - 3, 3, 3, _parch);
    if ((f ~/ 4 + i) % 3 == 0) p.dot(x + 1, p.h * 0.46 - 5 - (f % 3), const Color(0x40FFFFFF));
  }
}

void _hastane(PxCanvas p, int f) {
  wallFloor(p, const Color(0xFF8FB3A0), const Color(0xFF5E7F70), 0.6, trim: const Color(0xFF3F8A62));
  p.r(0, p.h * 0.4, p.w, p.h * 0.2, const Color(0xFF7FA390));
  for (var x = 0; x < p.w; x += 6) {
    p.r(x, p.h * 0.4, 1, p.h * 0.2, const Color(0xFF6E9280));
  }
  p.r(0, 0, p.w, p.h, const Color(0x55120D1C));
  tube(p, p.w * 0.1, p.h * 0.03, p.w * 0.3, f);
  tube(p, p.w * 0.6, p.h * 0.03, p.w * 0.3, f + 29);
  // Kapılar.
  for (var i = 0; i < 2; i++) {
    final x = p.w * (0.1 + i * 0.55);
    p.r(x, p.h * 0.18, p.w * 0.22, p.h * 0.42, const Color(0xFF4F5560));
    p.r(x + 3, p.h * 0.22, p.w * 0.22 - 6, 6, const Color(0xFF9CC3E6));
    p.r(x + p.w * 0.18, p.h * 0.4, 2, 2, _steel);
  }
  // Çıkış tabelası.
  p.r(p.w * 0.42, p.h * 0.1, 10, 4, const Color(0xFF2E7A4C));
  p.r(p.w * 0.42 + 2, p.h * 0.1 + 1, 6, 2, const Color(0xFF6FD08D));
  // Sedye.
  p.r(p.w * 0.36, p.h * 0.5, p.w * 0.26, 3, const Color(0xFFF4EFE6));
  p.r(p.w * 0.37, p.h * 0.53, 1, 6, _steel);
  p.r(p.w * 0.6, p.h * 0.53, 1, 6, _steel);
}

void _limanGece(PxCanvas p, int f) {
  p.fill(_sky0);
  p.r(0, p.h * 0.25, p.w, p.h * 0.2, _sky1);
  stars(p, f, 0.3);
  p.disc(p.w * 0.8, p.h * 0.1, 5, const Color(0xFFD9C597));
  p.disc(p.w * 0.8 + 2, p.h * 0.1 - 1, 4, _sky0);
  final horizon = p.h * 0.45;
  // Vinç silueti.
  p.r(p.w * 0.2, horizon - p.h * 0.3, 2, p.h * 0.3, _bld1);
  p.r(p.w * 0.1, horizon - p.h * 0.3, p.w * 0.4, 2, _bld1);
  p.r(p.w * 0.42, horizon - p.h * 0.3 + 2, 1, 10, _bld1);
  if (f % 16 < 8) p.dot(p.w * 0.5, horizon - p.h * 0.3, const Color(0xFFE8503C));
  // Konteynerler.
  const cols = [Color(0xFF7A2F45), Color(0xFF2C3E66), Color(0xFF3F5A3A), Color(0xFF6B4630)];
  for (var i = 0; i < 6; i++) {
    final x = p.w * 0.45 + i * 9.0;
    final y = horizon - 8 - (i % 2) * 8;
    p.r(x, y, 9, 8, cols[i % 4]);
    for (var k = 1; k < 9; k += 2) {
      p.r(x + k, y + 1, 1, 6, const Color(0x33120D1C));
    }
  }
  // Su ve kıpırdayan yansımalar.
  p.r(0, horizon, p.w, p.h, const Color(0xFF0B0A18));
  for (var y = horizon + 2; y < p.h; y += 3) {
    final shift = ((f ~/ 2) + y.toInt()) % 8;
    p.r(p.w * 0.78 - 4 + shift - 4, y, 6 + (y - horizon) * 0.08, 1, const Color(0x33D9C597));
    p.r(rnd(y.toInt()) * p.w + shift, y, 5, 1, const Color(0x1A6E6394));
  }
  lampPost(p, p.w * 0.06, horizon, f, height: p.h * 0.2);
}

void _arac(PxCanvas p, int f) {
  p.fill(_sky0);
  // Ön camdan geçen sokak lambaları.
  final ws = p.h * 0.08, we = p.h * 0.42;
  p.r(0, ws, p.w, we - ws, const Color(0xFF16122A));
  skyline(p, we, f ~/ 3, seed: 5);
  for (var i = 0; i < 3; i++) {
    final x = (p.w + 20) - ((f * 3 + i * 50) % (p.w + 40));
    p.r(x, ws + 6, 2, we - ws - 6, _bld1);
    p.r(x - 3, ws + 6, 5, 2, _amberHi);
    p.cone(x - 1, ws + 8, 18, 20, _glow);
  }
  // Camda yağmur damlaları.
  for (var i = 0; i < 18; i++) {
    final y = ws + (rnd(i) * (we - ws) + f * (0.5 + rnd(i + 4))) % (we - ws);
    p.r(rnd(i + 9) * p.w, y, 1, 2, _rain);
  }
  // Silecek ve çerçeve.
  final wiper = (f % 24) < 12 ? (f % 12) / 12 : 1 - (f % 12) / 12;
  p.r(p.w * 0.1, we - 2 - wiper * 18, p.w * 0.35, 1, _ink);
  p.r(0, 0, p.w, ws, _ink);
  p.r(0, ws, 4, p.h, _ink);
  p.r(p.w - 4, ws, 4, p.h, _ink);
  // Dikiz aynası.
  p.r(p.w * 0.42, ws, 2, 4, _ink);
  p.r(p.w * 0.36, ws + 4, p.w * 0.14, 4, _steel);
  // Gösterge paneli.
  p.r(0, we, p.w, p.h, const Color(0xFF15111F));
  p.r(0, we, p.w, 3, const Color(0xFF2B2350));
  p.r(p.w * 0.12, we + 6, p.w * 0.26, 10, _ink);
  p.r(p.w * 0.14, we + 8, 4, 4, const Color(0xFF6FD08D));
  p.r(p.w * 0.22, we + 8, 4, 4, _amber);
  p.disc(p.w * 0.25, we + 26, 12, _ink);
  p.disc(p.w * 0.25, we + 26, 10, const Color(0xFF221C38));
  p.r(p.w * 0.6, we + 8, 14, 5, const Color(0xFF2F6DBB));
  if (f % 16 < 8) p.dot(p.w * 0.6 + 2, we + 10, _amberHi);
}
