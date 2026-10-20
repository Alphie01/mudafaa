import type { INestApplication, NestApplicationOptions } from '@nestjs/common';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { bodyParser, bodyParserErrors } from './common/body-parsers.js';
import { requestId } from './common/request-id.js';
import { ENV, type Env } from './config/env.js';

/** Uygulama oluşturma seçenekleri: gövde ayrıştırıcıyı `configureApp` kurar; loglar pino'ya aktarılır. */
export const APP_OPTIONS: NestApplicationOptions = { bodyParser: false, bufferLogs: true };

const LOCAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

function corsOrigin(env: Env): (origin: string | undefined, cb: (err: Error | null, ok?: boolean) => void) => void {
  const allowed = env.CORS_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter((o) => o !== '');
  return (origin, cb) => {
    if (origin === undefined) return cb(null, true); // tarayıcı dışı istemciler (mobil uygulama, curl)
    if (allowed.length > 0) return cb(null, allowed.includes(origin));
    cb(null, env.NODE_ENV !== 'production' && LOCAL_ORIGIN.test(origin));
  };
}

/**
 * main.ts ile e2e testlerinin paylaştığı uygulama ayarları; testler üretimdeki yolları (`/v1/...`) kullanır. Uygulama
 * `APP_OPTIONS` ile oluşturulmalıdır.
 */
export function configureApp<T extends INestApplication>(app: T): T {
  const env = app.get<Env>(ENV);
  app.useLogger(app.get(Logger));
  app.use(requestId);
  app.use(helmet());
  app.enableCors({ origin: corsOrigin(env), exposedHeaders: ['X-Request-Id', 'ETag', 'X-Idempotent-Replay'] });
  app.use(bodyParser);
  app.use(bodyParserErrors);
  app.setGlobalPrefix('v1');
  return app;
}
