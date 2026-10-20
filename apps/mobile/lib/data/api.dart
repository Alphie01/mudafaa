import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../core/config.dart';

/// API hatası: sunucunun zarfı (`{message, error, reason?}`) ya da ağ hatası.
class ApiException implements Exception {
  ApiException(this.status, this.code, this.message, {this.reason});
  final int? status;
  final String code;
  final String message;
  final String? reason;

  bool get isNetwork => status == null || status! >= 500;
  @override
  String toString() => message;
}

/// Firebase ID token'ını her isteğe ekleyen, 401'de bir kez yenileyip yeniden deneyen Dio istemcisi.
class Api {
  Api() : _dio = Dio(BaseOptions(baseUrl: '${AppConfig.apiUrl}/v1', connectTimeout: const Duration(seconds: 10), receiveTimeout: const Duration(seconds: 20))) {
    _dio.interceptors.add(QueuedInterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await FirebaseAuth.instance.currentUser?.getIdToken();
        if (token != null) options.headers['Authorization'] = 'Bearer $token';
        handler.next(options);
      },
      onError: (e, handler) async {
        if (e.response?.statusCode == 401 && e.requestOptions.extra['retried'] != true) {
          final token = await FirebaseAuth.instance.currentUser?.getIdToken(true);
          if (token != null) {
            final opts = e.requestOptions..extra['retried'] = true;
            opts.headers['Authorization'] = 'Bearer $token';
            try {
              return handler.resolve(await _dio.fetch(opts));
            } on DioException catch (again) {
              return handler.next(again);
            }
          }
        }
        handler.next(e);
      },
    ));
  }

  final Dio _dio;

  Future<Map<String, dynamic>> get(String path, {Map<String, dynamic>? query}) => _call(() => _dio.get(path, queryParameters: query));
  Future<Map<String, dynamic>> post(String path, [Object? body]) => _call(() => _dio.post(path, data: body ?? {}));
  Future<Map<String, dynamic>> patch(String path, Object body) => _call(() => _dio.patch(path, data: body));
  Future<void> delete(String path) async => _call(() => _dio.delete(path));

  Future<Map<String, dynamic>> _call(Future<Response<dynamic>> Function() run) async {
    try {
      final res = await run();
      final data = res.data;
      return data is Map<String, dynamic> ? data : {'items': data};
    } on DioException catch (e) {
      final body = e.response?.data;
      if (body is Map && body['error'] is String) {
        throw ApiException(e.response?.statusCode, body['error'] as String, (body['message'] ?? 'Hata') as String, reason: body['reason'] as String?);
      }
      throw ApiException(e.response?.statusCode, 'network', 'Sunucuya ulaşılamadı. Bağlantınızı kontrol edin.');
    }
  }
}

final apiProvider = Provider<Api>((ref) => Api());
