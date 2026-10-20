import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mudafaa/design_system/motion/retro_motion.dart';
import 'package:mudafaa/features/play/common.dart';
import 'package:mudafaa/features/play/dialogue/dialogue_player.dart';
import 'package:mudafaa/features/play/voice/blip_scheduler.dart';
import 'package:mudafaa/features/play/voice/blip_synth.dart';
import 'package:mudafaa/features/play/voice/voice.dart';

import 'helpers.dart';

class FakeSink implements BlipSink {
  final blips = <BlipSpec>[];
  int stops = 0;
  final prepared = <BlipSpec>[];
  @override
  void prepare(BlipSpec spec) => prepared.add(spec);
  @override
  void blip(BlipSpec spec) => blips.add(spec);
  @override
  void stop() => stops++;
}

/// Metni harf harf açar; blip çalan karakterlerin indekslerini döndürür.
List<int> blipIndices(String text, {int every = 2, int msPerChar = 30}) {
  final s = BlipScheduler(text, every: every);
  final out = <int>[];
  for (var i = 1; i <= text.length; i++) {
    if (s.advance(i, Duration(milliseconds: i * msPerChar))) out.add(i - 1);
  }
  return out;
}

void main() {
  group('BlipScheduler', () {
    test('her 2. seslendirilen harfte blip; boşluk ve noktalama tetiklemez', () {
      // indeks: A0 b1 _2 c3 d4 _5 e6
      expect(blipIndices('Ab cd e'), [0, 3, 6]);
      expect(blipIndices('Ab cd e', every: 3), [0, 4]);
      for (final i in blipIndices('a - b — c … d')) {
        expect(BlipScheduler.isVoiced('a - b — c … d'[i]), isTrue);
      }
    });

    test('Türkçe harfler ve rakamlar seslendirilir', () {
      expect(BlipScheduler.isVoiced('ğ'), isTrue);
      expect(BlipScheduler.isVoiced('İ'), isTrue);
      expect(BlipScheduler.isVoiced('7'), isTrue);
      expect(BlipScheduler.isVoiced(' '), isFalse);
      expect(BlipScheduler.isVoiced('“'), isFalse);
    });

    test('.,?! sonrası kısa sessizlik: sonraki harfler bekler', () {
      // "Evet. Hayır": nokta 4. indekste; 30 ms/harf ile 170 ms ≈ 5–6 harf sessiz.
      final idx = blipIndices('Evet. Hayır olmaz');
      expect(idx.first, 0);
      expect(idx.where((i) => i > 4 && i < 10), isEmpty, reason: 'noktadan sonra nefes');
      expect(idx.any((i) => i >= 10), isTrue, reason: 'sonra yeniden başlar');
    });

    test('stop() sonrası hiç blip yok; metin bitince kendiliğinden durur', () {
      final s = BlipScheduler('merhaba dünya');
      expect(s.advance(1, Duration.zero), isTrue);
      s.stop();
      for (var i = 2; i <= 13; i++) {
        expect(s.advance(i, Duration(milliseconds: i * 30)), isFalse);
      }
      final t = BlipScheduler('ab');
      t.advance(2, Duration.zero);
      expect(t.stopped, isTrue);
    });
  });

  group('ses tarifi', () {
    test('konuşmacı sesi kararlı ve hoş aralıkta; biçimler sesi değiştirir', () {
      final a = voiceForSpeaker('leyla');
      expect(voiceForSpeaker('leyla').key, a.key);
      for (final id in ['leyla', 'kerem', 'nevzat', 'cem', 'player', 'x']) {
        final v = voiceForSpeaker(id);
        expect(v.freq, inInclusiveRange(150, 560));
        expect(v.ms, inInclusiveRange(40, 70));
      }
      expect(styledVoice(a, card: true), isNull);
      expect(styledVoice(null, narrator: true)!.volume, lessThan(0.2));
      expect(styledVoice(a, style: 'whisper')!.wave, BlipWave.noise);
      expect(styledVoice(a, style: 'phone')!.bandLimited, isTrue);
      expect(styledVoice(a, style: 'thought')!.volume, lessThan(a.volume));
    });

    test('WAV başlığı ve uzunluğu', () {
      final wav = toWav(synthesize(voiceForSpeaker('leyla')));
      expect(String.fromCharCodes(wav.sublist(0, 4)), 'RIFF');
      expect(String.fromCharCodes(wav.sublist(8, 12)), 'WAVE');
      final ms = (wav.length - 44) / 2 / sampleRate * 1000;
      expect(ms, inInclusiveRange(40, 70));
    });
  });

  group('DialoguePlayer sesi', () {
    final cast = m(fixture('cold_open')['steps'][0]['cast']);
    Future<FakeSink> pump(WidgetTester tester, Map<String, dynamic> line) async {
      final sink = FakeSink();
      await tester.pumpWidget(harness(
        VoiceScope(sink: sink, child: Scaffold(body: DialoguePlayer(key: UniqueKey(), lines: [line], cast: cast, onDone: () {}))),
        motion: RetroMotion.reduced,
      ));
      await tester.pump();
      return sink;
    }

    testWidgets('daktilo sürerken blip çalar; dokunuşla tamamlanınca durur', (tester) async {
      final sink = await pump(tester, {'speaker': 'ece', 'text': 'Günaydın! Masanda yeni bir dosya var, hemen bak.'});
      for (var i = 0; i < 40; i++) {
        await tester.pump(const Duration(milliseconds: 16));
      }
      final during = sink.blips.length;
      expect(during, greaterThan(2));
      await tester.tap(find.byKey(const ValueKey('dialogue-tap')));
      await tester.pump();
      expect(sink.stops, greaterThan(0), reason: 'tamamlanınca kesilir');
      await tester.pump(const Duration(seconds: 2));
      expect(sink.blips.length, during, reason: 'tamamlandıktan sonra blip yok');
    });

    testWidgets('ATLA sesi keser; kart satırı sessiz', (tester) async {
      var sink = await pump(tester, {'speaker': 'ece', 'text': 'Uzun bir cümle, bitmeden atlanacak.'});
      await tester.pump(const Duration(milliseconds: 200));
      await tester.tap(find.text('ATLA ››'));
      await tester.pump();
      final n = sink.blips.length;
      await tester.pump(const Duration(seconds: 2));
      expect(sink.blips.length, n);
      expect(sink.stops, greaterThan(0));

      sink = await pump(tester, {'speaker': 'narrator', 'style': 'card', 'text': 'Gece 23.04 — depo sokağı'});
      await tester.pump(const Duration(seconds: 2));
      expect(sink.blips, isEmpty);
    });
  });
}
