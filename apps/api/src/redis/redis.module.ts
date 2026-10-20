import { Global, Inject, Logger, Module, type OnApplicationShutdown } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ENV, type Env } from '../config/env.js';

/** Paylaşılan ioredis istemcisinin enjeksiyon token'ı. */
export const REDIS = Symbol('REDIS');

@Global()
@Module({
  providers: [
    {
      provide: REDIS,
      inject: [ENV],
      useFactory: (env: Env): Redis => {
        const logger = new Logger('Redis');
        const client = new Redis(env.REDIS_URL);
        // Dinleyici yoksa ioredis bağlantı hatalarını "Unhandled error event" olarak basar; yeniden bağlanmayı kendisi dener.
        client.on('error', (error: Error) => logger.error(describeError(error)));
        return client;
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async onApplicationShutdown(): Promise<void> {
    // QUIT bekleyen yanıtları tamamlar. Bağlantı yokken çevrimdışı kuyruktaki komutların arkasında beklediği için
    // (ör. health ping'i) SIGTERM sonrası süreç kapanmaz; o durumda bağlantı hemen kesilir.
    if (this.redis.status === 'ready') {
      await this.redis.quit();
    } else {
      this.redis.disconnect();
    }
  }
}

/** Node "localhost" için IPv6 ve IPv4'ü dener; ikisi de reddedilirse mesajı boş bir AggregateError döner. */
function describeError(error: Error): string {
  if (error instanceof AggregateError && error.errors.length > 0) {
    return error.errors.map((inner: unknown) => (inner instanceof Error ? inner.message : String(inner))).join('; ');
  }
  return error.message;
}
