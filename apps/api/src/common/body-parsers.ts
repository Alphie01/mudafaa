import express, { type NextFunction, type Request, type RequestHandler, type Response } from 'express';

/** İçe aktarma ve paket uçları büyük gövde alır; varlık yükleme ham bayttır; diğer her uç 1 MB JSON. */
const LARGE_JSON = [/^\/v1\/admin\/cases\/import$/, /^\/v1\/admin\/cases\/[^/]+\/versions\/[^/]+\/package$/];
const RAW = [/^\/v1\/admin\/assets$/];

const small = express.json({ limit: '1mb' });
const large = express.json({ limit: '25mb' });
const raw = express.raw({ type: () => true, limit: '15mb' });

export const bodyParser: RequestHandler = (req, res, next) => {
  if (RAW.some((r) => r.test(req.path)) && req.method === 'POST') return raw(req, res, next);
  if (LARGE_JSON.some((r) => r.test(req.path))) return large(req, res, next);
  return small(req, res, next);
};

/** Gövde ayrıştırma hataları da API zarfıyla döner (Express'in HTML hata sayfası yerine). */
export function bodyParserErrors(err: unknown, req: Request, res: Response, next: NextFunction): void {
  const type = typeof err === 'object' && err !== null && 'type' in err ? String(err.type) : '';
  const requestId = String(res.getHeader('X-Request-Id') ?? req.headers['x-request-id'] ?? '');
  if (type === 'entity.too.large') {
    res.status(413).json({ message: 'İstek gövdesi çok büyük.', error: 'validation_error', requestId });
    return;
  }
  if (type === 'entity.parse.failed' || type === 'encoding.unsupported' || type === 'charset.unsupported') {
    res.status(400).json({ message: 'İstek gövdesi ayrıştırılamadı.', error: 'validation_error', requestId });
    return;
  }
  next(err);
}
