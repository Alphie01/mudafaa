import { type ExecutionContext, Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import type { Request } from 'express';
import type { Redis } from 'ioredis';
import { LoggerModule } from 'nestjs-pino';
import { ENV, type Env } from '../config/env.js';
import { REDIS } from '../redis/redis.module.js';
import { ApiErrorFilter } from './error.filter.js';
import { RedisThrottlerStorage } from './throttler-redis.storage.js';

const isChoose = (ctx: ExecutionContext): boolean => ctx.switchToHttp().getRequest<Request>().path.endsWith('/choose');

/**
 * Ortak altyapı:
 * - pino logları (yetki başlıkları maskelenir; testte sessiz);
 * - Redis depolu, kullanıcı başına hız sınırı: genel pencere ve yalnızca `choose` için kısa pencere;
 * - hata zarfı filtresi.
 * Kullanıcı başına guard (`UserThrottlerGuard`) AppModule'de kimlik guard'ından sonra kaydedilir.
 */
@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ENV],
      useFactory: (env: Env) => ({
        pinoHttp: {
          level: env.NODE_ENV === 'test' ? 'silent' : env.LOG_LEVEL,
          genReqId: (req) => String(req.headers['x-request-id'] ?? ''),
          redact: ['req.headers.authorization', 'req.headers.cookie'],
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [ENV, REDIS],
      useFactory: (env: Env, redis: Redis) => ({
        throttlers: [
          { name: 'default', ttl: 60_000, limit: env.THROTTLE_LIMIT },
          { name: 'choose', ttl: 10_000, limit: env.THROTTLE_CHOOSE_LIMIT, skipIf: (ctx) => !isChoose(ctx) },
        ],
        storage: new RedisThrottlerStorage(redis),
      }),
    }),
  ],
  providers: [{ provide: APP_FILTER, useClass: ApiErrorFilter }],
})
export class CommonModule {}
