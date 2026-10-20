import { Redis } from 'ioredis';
import { afterAll, describe, expect, it } from 'vitest';
import { RedisThrottlerStorage } from '../../src/common/throttler-redis.storage.js';

const redis = new Redis(process.env.REDIS_URL_TEST ?? 'redis://localhost:6380', {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
});

afterAll(async () => {
  await redis.quit();
});

describe('RedisThrottlerStorage', () => {
  it('counts hits in a fixed window and blocks over the limit', async () => {
    const storage = new RedisThrottlerStorage(redis);
    const key = `k${Date.now()}${Math.random()}`;
    const hits = [];
    for (let i = 0; i < 3; i++) hits.push(await storage.increment(key, 200, 2, 0, 'test'));
    expect(hits.map((h) => h.totalHits)).toEqual([1, 2, 3]);
    expect(hits.map((h) => h.isBlocked)).toEqual([false, false, true]);
    await new Promise((r) => setTimeout(r, 300));
    expect((await storage.increment(key, 200, 2, 0, 'test')).totalHits).toBe(1);
  });
});
