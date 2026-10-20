import { CASE_FORMAT } from '@mudafaa/case-schema';
import { Controller, Get, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PrismaService } from '../../database/prisma.service.js';
import { REDIS } from '../../redis/redis.module.js';

/** Bir bağımlılık bu süre içinde yanıt vermezse 'down' sayılır; health ucu asılı kalmaz. */
export const HEALTH_PROBE_TIMEOUT_MS = 1000;

type ProbeStatus = 'up' | 'down';

export interface HealthStatus {
  status: 'ok';
  db: ProbeStatus;
  redis: ProbeStatus;
  format: typeof CASE_FORMAT;
}

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  @Get()
  async check(): Promise<HealthStatus> {
    const [db, redis] = await Promise.all([
      probe(() => this.prisma.$queryRaw`SELECT 1`),
      probe(() => this.redis.ping()),
    ]);
    return { status: 'ok', db, redis, format: CASE_FORMAT };
  }
}

async function probe(check: () => PromiseLike<unknown>): Promise<ProbeStatus> {
  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('health probe timeout')), HEALTH_PROBE_TIMEOUT_MS);
  });
  try {
    await Promise.race([check(), timeout]);
    return 'up';
  } catch {
    return 'down';
  } finally {
    clearTimeout(timer);
  }
}
