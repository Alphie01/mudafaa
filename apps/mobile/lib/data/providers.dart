import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'api.dart';

/// `GET /me`: ad, rütbe, ilerleme, sonuç sayıları, aktif oturum.
final meProvider = FutureProvider.autoDispose<Map<String, dynamic>>((ref) => ref.read(apiProvider).get('/me'));

/// `GET /cases?tab=`.
final casesProvider = FutureProvider.autoDispose.family<Map<String, dynamic>, String>((ref, tab) => ref.read(apiProvider).get('/cases', query: {'tab': tab}));

/// `GET /sessions/:id/result`: dava sonu raporu.
final reportProvider = FutureProvider.autoDispose.family<Map<String, dynamic>, String>((ref, id) => ref.read(apiProvider).get('/sessions/$id/result'));
