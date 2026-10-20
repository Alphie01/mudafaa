import type { Redis } from 'ioredis';
import { describe, expect, it, vi } from 'vitest';
import { RedisModule } from '../../src/redis/redis.module.js';

const fakeRedis = (status: Redis['status']) => {
  const quit = vi.fn(() => Promise.resolve('OK' as const));
  const disconnect = vi.fn();
  return { client: { status, quit, disconnect } as unknown as Redis, quit, disconnect };
};

describe('RedisModule shutdown', () => {
  it('quits gracefully when the connection is ready', async () => {
    const { client, quit, disconnect } = fakeRedis('ready');

    await new RedisModule(client).onApplicationShutdown();

    expect(quit).toHaveBeenCalledOnce();
    expect(disconnect).not.toHaveBeenCalled();
  });

  it('disconnects immediately while reconnecting, so a queued QUIT cannot block shutdown', async () => {
    const { client, quit, disconnect } = fakeRedis('reconnecting');

    await new RedisModule(client).onApplicationShutdown();

    expect(disconnect).toHaveBeenCalledOnce();
    expect(quit).not.toHaveBeenCalled();
  });
});
