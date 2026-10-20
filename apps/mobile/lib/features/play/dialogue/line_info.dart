import 'dart:ui';

import '../../../design_system/tokens/px_colors.dart';
import '../../../design_system/tokens/px_text.dart';
import '../common.dart';

enum SpeakerKind { character, player, narrator, anonymous, card }

/// Bir satırın sunum bilgisi: kim konuşuyor, hangi ad, renk ve sprite.
class LineInfo {
  LineInfo._(this.line, this.kind, this.name, this.accent, this.sprite, this.expression);

  factory LineInfo.of(Map<String, dynamic> line, Map<String, dynamic> cast) {
    final speaker = line['speaker'] as String? ?? 'narrator';
    final style = line['style'] as String?;
    if (style == 'card') return LineInfo._(line, SpeakerKind.card, null, PxColors.gold, null, null);
    if (speaker == 'narrator') {
      final name = line['name'] as String?;
      return name == null
          ? LineInfo._(line, SpeakerKind.narrator, null, PxColors.dim, null, null)
          : LineInfo._(line, SpeakerKind.anonymous, trUpper(name), PxColors.ink, null, null);
    }
    if (speaker == 'player') {
      final counsel = cast.values.map(m).where((c) => c['role'] == 'COUNSEL').firstOrNull;
      return LineInfo._(
        line,
        SpeakerKind.player,
        trUpper((counsel?['shortLabel'] ?? 'Sen') as String),
        PxColors.blue,
        counsel == null ? null : m(counsel['sprite']),
        (line['expression'] ?? counsel?['expression']) as String?,
      );
    }
    final who = m(cast[speaker]);
    return LineInfo._(
      line,
      SpeakerKind.character,
      trUpper((who['shortLabel'] ?? who['name'] ?? speaker) as String),
      hexAccent(who['accent']),
      who['sprite'] == null ? null : m(who['sprite']),
      (line['expression'] ?? who['expression']) as String?,
    );
  }

  final Map<String, dynamic> line;
  final SpeakerKind kind;
  final String? name;
  final Color accent;
  final Map<String, dynamic>? sprite;
  final String? expression;

  String get text => line['text'] as String? ?? '';
  String? get style => line['style'] as String?;
  String get speakerKey => kind == SpeakerKind.anonymous ? 'anon:$name' : (line['speaker'] as String? ?? 'narrator');

  /// Ekran okuyucu ve geçmiş için tam metin.
  String get spoken => name == null ? text : '$name: $text';
}
