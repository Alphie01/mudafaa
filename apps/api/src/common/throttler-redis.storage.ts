import type { ThrottlerStorage } from '@nestjs/throttler';
import type { Redis } from 'ioredis';

interface ThrottlerStorageRecord {
  totalHits: number;
  timeToExpire: number;
  isBlocked: boolean;
  timeToBlockExpire: number;
}

/** Sabit pencereli Redis sayacı: anahtar `thr:<ad>:<anahtar>`, ilk vuruşta pencere süresi kadar ömür. */
export class RedisThrottlerStorage implements ThrottlerStorage {
  constructor(private readonly redis: Redis) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    _blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const k = `thr:${throttlerName}:${key}`;
    const [[, hits], [, pttl]] = (await this.redis.multi().incr(k).pttl(k).exec()) as [[null, number], [null, number]];
    let remaining = pttl;
    if (remaining < 0) {
      await this.redis.pexpire(k, ttl);
      remaining = ttl;
    }
    const timeToExpire = Math.ceil(remaining / 1000);
    const isBlocked = hits > limit;
    return { totalHits: hits, timeToExpire, isBlocked, timeToBlockExpire: isBlocked ? timeToExpire : 0 };
  }
}
