import 'dart:math' as math;
import 'dart:typed_data';

/// Konuşma "mırıltısı" için kısa blip sentezi (Animal Crossing / Undertale tarzı). Ses dosyası yok: PCM Dart'ta
/// üretilir, WAV (16-bit mono) baytı olarak oynatılır.

enum BlipWave { square, triangle, noise }

/// Bir blip'in tarifi.
class BlipSpec {
  const BlipSpec({
    required this.freq,
    this.wave = BlipWave.square,
    this.ms = 55,
    this.volume = 0.32,
    this.duty = 0.5,
    this.noise = 0,
    this.bandLimited = false,
    this.crackle = false,
  });

  final double freq;
  final BlipWave wave;
  final double ms;
  final double volume;

  /// Kare dalga doluluk oranı (tını).
  final double duty;

  /// 0..1 gürültü karışımı (fısıltı için nefes).
  final double noise;

  /// Telefon hattı: 300–3000 Hz bant ve hafif bit ezme.
  final bool bandLimited;

  /// Telefon cızırtısı: rastgele tıkırtılar.
  final bool crackle;

  BlipSpec copyWith({double? freq, double? volume, double? ms}) => BlipSpec(
        freq: freq ?? this.freq,
        wave: wave,
        ms: ms ?? this.ms,
        volume: volume ?? this.volume,
        duty: duty,
        noise: noise,
        bandLimited: bandLimited,
        crackle: crackle,
      );

  String get key => '${wave.name}:${freq.toStringAsFixed(1)}:$ms:$volume:$duty:$noise:$bandLimited:$crackle';
}

const sampleRate = 22050;

/// Blip'i örnekler (−1..1) olarak üretir: 3 ms atak, üstel sönüm, sonda kısa kapanış (tık sesi olmasın).
Float64List synthesize(BlipSpec s, {int seed = 1}) {
  final n = (sampleRate * s.ms / 1000).round();
  final out = Float64List(n);
  final rng = math.Random(seed);
  final attack = (sampleRate * 0.003).round();
  final release = (sampleRate * 0.006).round();
  var phase = 0.0;
  // Hafif aşağı kayan perde: konuşma hecesi hissi.
  for (var i = 0; i < n; i++) {
    final t = i / n;
    final f = s.freq * (1.0 - 0.08 * t);
    phase = (phase + f / sampleRate) % 1.0;
    double v;
    switch (s.wave) {
      case BlipWave.square:
        v = phase < s.duty ? 1 : -1;
      case BlipWave.triangle:
        v = phase < 0.5 ? 4 * phase - 1 : 3 - 4 * phase;
      case BlipWave.noise:
        v = rng.nextDouble() * 2 - 1;
    }
    if (s.noise > 0) v = v * (1 - s.noise) + (rng.nextDouble() * 2 - 1) * s.noise;
    var env = math.exp(-3.2 * t);
    if (i < attack) env *= i / attack;
    if (i > n - release) env *= (n - i) / release;
    out[i] = v * env * s.volume;
  }
  if (s.bandLimited) _band(out, 300, 3000);
  if (s.noise > 0.5) _lowpass(out, 2500);
  if (s.crackle) {
    for (var k = 0; k < n ~/ 180; k++) {
      final at = rng.nextInt(n);
      out[at] = (rng.nextBool() ? 1 : -1) * s.volume * 0.9;
    }
    // Telefon hattı: 6-bit ezme.
    for (var i = 0; i < n; i++) {
      out[i] = (out[i] * 32).roundToDouble() / 32;
    }
  }
  return out;
}

void _lowpass(Float64List x, double cutoff) {
  final a = math.exp(-2 * math.pi * cutoff / sampleRate);
  var y = 0.0;
  for (var i = 0; i < x.length; i++) {
    y = (1 - a) * x[i] + a * y;
    x[i] = y;
  }
}

void _highpass(Float64List x, double cutoff) {
  final a = math.exp(-2 * math.pi * cutoff / sampleRate);
  var prevX = 0.0, y = 0.0;
  for (var i = 0; i < x.length; i++) {
    y = a * (y + x[i] - prevX);
    prevX = x[i];
    x[i] = y;
  }
}

void _band(Float64List x, double lo, double hi) {
  _highpass(x, lo);
  _lowpass(x, hi);
  _lowpass(x, hi);
}

/// 16-bit PCM mono WAV baytları.
Uint8List toWav(Float64List samples) {
  final dataLen = samples.length * 2;
  final b = ByteData(44 + dataLen);
  void str(int o, String s) {
    for (var i = 0; i < s.length; i++) {
      b.setUint8(o + i, s.codeUnitAt(i));
    }
  }

  str(0, 'RIFF');
  b.setUint32(4, 36 + dataLen, Endian.little);
  str(8, 'WAVE');
  str(12, 'fmt ');
  b.setUint32(16, 16, Endian.little);
  b.setUint16(20, 1, Endian.little); // PCM
  b.setUint16(22, 1, Endian.little); // mono
  b.setUint32(24, sampleRate, Endian.little);
  b.setUint32(28, sampleRate * 2, Endian.little);
  b.setUint16(32, 2, Endian.little);
  b.setUint16(34, 16, Endian.little);
  str(36, 'data');
  b.setUint32(40, dataLen, Endian.little);
  for (var i = 0; i < samples.length; i++) {
    b.setInt16(44 + i * 2, (samples[i].clamp(-1.0, 1.0) * 32767).round(), Endian.little);
  }
  return b.buffer.asUint8List();
}

/// Kararlı 32-bit FNV-1a özeti (karakter kimliği → ses).
int stableHash(String s) {
  var h = 0x811c9dc5;
  for (final c in s.codeUnits) {
    h ^= c;
    h = (h * 0x01000193) & 0xffffffff;
  }
  return h;
}

/// Hoş bir aralıkta (pentatonik basamaklar, ~165–440 Hz) konuşmacıya özgü ses.
BlipSpec voiceForSpeaker(String id) {
  final h = stableHash(id);
  const steps = [0, 2, 4, 7, 9, 12, 14, 16]; // pentatonik yarım tonlar
  final base = 165.0 * math.pow(2, steps[h % steps.length] / 12) * (((h >> 8) & 1) == 1 ? 1.25 : 1.0);
  final wave = ((h >> 4) % 3) == 0 ? BlipWave.triangle : BlipWave.square;
  const duties = [0.5, 0.25, 0.125];
  return BlipSpec(
    freq: base.toDouble(),
    wave: wave,
    duty: duties[(h >> 12) % duties.length],
    ms: 42 + ((h >> 16) % 24).toDouble(),
    volume: wave == BlipWave.triangle ? 0.42 : 0.26,
  );
}

/// Satır biçimine göre sesin rengi; `null` = sessiz.
BlipSpec? styledVoice(BlipSpec? base, {String? style, bool narrator = false, bool card = false}) {
  if (card) return null;
  if (narrator) return const BlipSpec(freq: 110, wave: BlipWave.triangle, ms: 18, volume: 0.12); // yumuşak alçak tık
  if (base == null) return null;
  return switch (style) {
    'whisper' => BlipSpec(freq: base.freq, wave: BlipWave.noise, ms: base.ms + 10, volume: 0.16, noise: 0.85),
    'phone' => BlipSpec(freq: base.freq * 1.1, wave: BlipWave.square, duty: base.duty, ms: base.ms, volume: base.volume * 0.9, bandLimited: true, crackle: true),
    'thought' => BlipSpec(freq: base.freq * 0.9, wave: BlipWave.triangle, ms: base.ms + 6, volume: base.volume * 0.45),
    _ => base,
  };
}
