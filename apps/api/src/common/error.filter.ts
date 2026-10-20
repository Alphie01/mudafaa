import { type ArgumentsHost, Catch, type ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ApiError, type ApiErrorCode } from './api-error.js';

const BY_STATUS: Record<number, ApiErrorCode> = {
  400: 'validation_error',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not_found',
  413: 'validation_error',
  429: 'rate_limited',
};

const DEFAULT_MESSAGE: Partial<Record<ApiErrorCode, string>> = {
  unauthorized: 'Oturum açmanız gerekiyor.',
  forbidden: 'Bu işlem için yetkiniz yok.',
  not_found: 'Kayıt bulunamadı.',
  rate_limited: 'Çok fazla istek gönderildi; biraz sonra tekrar deneyin.',
  internal_error: 'Beklenmeyen bir hata oluştu.',
};

/** Bütün hataları tek zarfa çevirir; 5xx ayrıntısı istemciye gitmez, loga gider. */
@Catch()
export class ApiErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('ApiError');

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const requestId = String(res.getHeader('X-Request-Id') ?? req.headers['x-request-id'] ?? '');
    let status = 500;
    let body: Record<string, unknown>;
    if (exception instanceof ApiError) {
      status = exception.status;
      body = {
        message: exception.message,
        error: exception.code,
        requestId,
        ...(exception.errors === undefined ? {} : { errors: exception.errors }),
        ...(exception.reason === undefined ? {} : { reason: exception.reason }),
      };
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const code = BY_STATUS[status] ?? (status >= 500 ? 'internal_error' : 'validation_error');
      const raw = exception.getResponse();
      const message =
        status >= 500
          ? DEFAULT_MESSAGE.internal_error
          : (DEFAULT_MESSAGE[code] ??
            (typeof raw === 'object' && raw !== null && 'message' in raw ? String(raw.message) : exception.message));
      body = { message, error: code, requestId };
    } else {
      body = { message: DEFAULT_MESSAGE.internal_error, error: 'internal_error', requestId };
    }
    if (status >= 500)
      this.logger.error(exception instanceof Error ? (exception.stack ?? exception.message) : String(exception));
    res.status(status).json(body);
  }
}
