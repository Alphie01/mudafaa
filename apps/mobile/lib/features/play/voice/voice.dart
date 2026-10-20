import 'dart:math' as math;

import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'blip_synth.dart';

/// Blip çıkışı (test için sahtesi verilebilir).
abstract class BlipSink {
  /// Satır başında: bu sesi önceden hazırla (ilk blip gecikmesin).
  void prepare(BlipSpec spec) {}
  void blip(BlipSpec spec);
  void stop();
}

/// Bir sesin 3 perde varyantı (±%6), her biri kaynağı önceden yüklenmiş bir oynatıcıda.
class _Voice {
  _Voice(this.players);
  final List<AudioPlayer> players;
  int next = 0;
}

/// audioplayers ile bellekten WAV çalan çıkış. Kaynak her blip'te yeniden yüklenmez: her varyantın oynatıcısı
/// hazır bekler, blip yalnızca baştan oynatır (web'de data-URL yüklemesi gecikme yaratıyordu). En çok 10 ses
/// bellekte tutulur. Web'de ilk kullanıcı dokunuşuna kadar sessizdir (tarayıcı otomatik oynatma kuralı).
class AudioBlipSink implements BlipSink {
  AudioBlipSink._();
  static final instance = AudioBlipSink._();

  static const _maxVoices = 10;
  final _voices = <String, _Voice>{};
  final _loading = <String, Future<void>>{};
  final _rng = math.Random();
  bool _unlocked = !kIsWeb;
  bool _ready = false;

  /// Uygulama açılışında: ses bağlamı ve sık sesler (anlatıcı tıkı, oyuncu) Dart'ta sentezlenip hazırlanır.
  Future<void> warmUp() async {
    if (_ready) return;
    _ready = true;
    try {
      await AudioPlayer.global.setAudioContext(
        AudioContextConfig(focus: AudioContextConfigFocus.mixWithOthers, respectSilence: true).build(),
      );
    } catch (_) {}
    prepare(styledVoice(null, narrator: true)!);
    prepare(voiceForSpeaker('player'));
  }

  /// İlk kullanıcı jestinde çağrılır (web otomatik oynatma kilidi): hazır oynatıcılar sessizce bir kez çalınır.
  void unlock() {
    if (_unlocked) return;
    _unlocked = true;
    for (final v in _voices.values) {
      for (final p in v.players) {
        p.setVolume(0).then((_) => p.resume()).then((_) => p.stop()).then((_) => p.setVolume(1)).catchError((_) {});
      }
    }
  }

  @override
  void prepare(BlipSpec spec) {
    final key = spec.key;
    if (_voices.containsKey(key) || _loading.containsKey(key)) return;
    _loading[key] = _load(spec).whenComplete(() => _loading.remove(key));
  }

  Future<void> _load(BlipSpec s) async {
    final players = <AudioPlayer>[];
    try {
      for (final (k, mul) in const [(1, 0.94), (2, 1.0), (3, 1.06)]) {
        final p = AudioPlayer();
        if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) await p.setPlayerMode(PlayerMode.lowLatency);
        await p.setReleaseMode(ReleaseMode.stop);
        await p.setSource(BytesSource(toWav(synthesize(s.copyWith(freq: s.freq * mul), seed: k)), mimeType: 'audio/wav'));
        players.add(p);
      }
    } catch (_) {
      for (final p in players) {
        p.dispose().catchError((_) {});
      }
      return;
    }
    if (_voices.length >= _maxVoices) {
      final oldest = _voices.keys.first;
      for (final p in _voices.remove(oldest)!.players) {
        p.dispose().catchError((_) {});
      }
    }
    _voices[s.key] = _Voice(players);
  }

  @override
  void blip(BlipSpec spec) {
    if (!_unlocked) return;
    final v = _voices[spec.key];
    if (v == null) {
      prepare(spec);
      return;
    }
    // Varyantlar sırayla ama rastgele başlangıçla: aynı perde art arda gelmez, örtüşme olmaz.
    final p = v.players[(v.next++ + _rng.nextInt(2)) % v.players.length];
    final playing = p.state == PlayerState.playing;
    (playing ? p.seek(Duration.zero) : p.resume()).catchError((_) {});
  }

  @override
  void stop() {
    for (final v in _voices.values) {
      for (final p in v.players) {
        if (p.state == PlayerState.playing) p.stop().catchError((_) {});
      }
    }
  }
}

/// Ağaca blip çıkışını yayar; `sink == null` sessizdir (Ses kapalı ya da test).
class VoiceScope extends InheritedWidget {
  const VoiceScope({super.key, required this.sink, required super.child});
  final BlipSink? sink;

  static BlipSink? of(BuildContext context) => context.dependOnInheritedWidgetOfExactType<VoiceScope>()?.sink;

  @override
  bool updateShouldNotify(VoiceScope old) => old.sink != sink;
}

const _key = 'soundOn';
const _storage = FlutterSecureStorage();

/// Ses açık/kapalı (kalıcı, varsayılan açık).
class SoundController extends Notifier<bool> {
  @override
  bool build() {
    Future.microtask(_load);
    return true;
  }

  Future<void> _load() async {
    try {
      final v = await _storage.read(key: _key);
      if (v != null) state = v == '1';
    } catch (_) {}
  }

  Future<void> set(bool on) async {
    state = on;
    if (!on) AudioBlipSink.instance.stop();
    try {
      await _storage.write(key: _key, value: on ? '1' : '0');
    } catch (_) {}
  }
}

final soundProvider = NotifierProvider<SoundController, bool>(SoundController.new);
