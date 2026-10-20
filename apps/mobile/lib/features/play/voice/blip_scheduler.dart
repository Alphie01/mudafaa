/// Daktilo ilerledikçe hangi harfte blip çalınacağına karar verir (saf mantık, test edilebilir).
///
/// - Yalnızca harf ve rakamlar sayılır; boşluk ve noktalama blip tetiklemez.
/// - Her `every` seslendirilen harfte bir blip (ilk harf dahil).
/// - `.,?!…;:` sonrası `pause` kadar sessizlik ve sayaç sıfırlanır (cümle arası nefes).
/// - `stop()` sonrasında hiçbir zaman blip yoktur (satır tamamlandı ya da atlandı).
class BlipScheduler {
  BlipScheduler(String text, {this.every = 2, this.pause = const Duration(milliseconds: 170)}) : _chars = text.runes.map(String.fromCharCode).toList();

  final List<String> _chars;
  final int every;
  final Duration pause;
  int _revealed = 0;
  int _count = 0;
  Duration? _quietUntil;
  bool _stopped = false;

  static final _voiced = RegExp(r'[\p{L}\p{N}]', unicode: true);
  static const _pauses = {'.', ',', '?', '!', '…', ';', ':'};

  static bool isVoiced(String c) => _voiced.hasMatch(c);
  static bool isPause(String c) => _pauses.contains(c);

  bool get stopped => _stopped;
  int get length => _chars.length;

  /// Daktilo `n` karaktere ulaştı (zaman `now`). Bu adımda blip çalınmalı mı? (Adım başına en çok bir blip.)
  bool advance(int n, Duration now) {
    if (_stopped) return false;
    var blip = false;
    while (_revealed < n && _revealed < _chars.length) {
      final c = _chars[_revealed++];
      if (isPause(c)) {
        _quietUntil = now + pause;
        _count = 0;
        continue;
      }
      if (!isVoiced(c)) continue;
      if (_quietUntil != null && now < _quietUntil!) continue;
      if (_count % every == 0) blip = true;
      _count++;
    }
    if (_revealed >= _chars.length) _stopped = true;
    return blip;
  }

  void stop() => _stopped = true;
}
