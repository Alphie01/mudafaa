import type { Redis } from 'ioredis';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../../src/database/prisma.service.js';
import { HEALTH_PROBE_TIMEOUT_MS, HealthController } from '../../src/modules/health/health.controller.js';

const healthyDb = { $queryRaw: () => Promise.resolve([{ '?column?': 1 }]) } as unknown as PrismaService;
const failingDb = { $queryRaw: () => Promise.reject(new Error('ECONNREFUSED')) } as unknown as PrismaService;
const healthyRedis = { ping: () => Promise.resolve('PONG') } as unknown as Redis;
const hangingRedis = { ping: () => new Promise<string>(() => {}) } as unknown as Redis;

describe('HealthController', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('reports up when both probes succeed', async () => {
    await expect(new HealthController(healthyDb, healthyRedis).check()).resolves.toEqual({
      status: 'ok',
      db: 'up',
      redis: 'up',
      format: 'mudafaa.case/v1',
    });
  });

  it('reports db down when the query fails', async () => {
    await expect(new HealthController(failingDb, healthyRedis).check()).resolves.toMatchObject({
      status: 'ok',
      db: 'down',
      redis: 'up',
    });
  });

  it('reports redis down when ping does not answer in time', async () => {
    vi.useFakeTimers();
    const result = new HealthController(healthyDb, hangingRedis).check();

    await vi.advanceTimersByTimeAsync(HEALTH_PROBE_TIMEOUT_MS);

    await expect(result).resolves.toMatchObject({ status: 'ok', db: 'up', redis: 'down' });
  });
});
