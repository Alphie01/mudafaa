import { Inject, Injectable, type OnModuleDestroy } from '@nestjs/common';
import { Queue, type ConnectionOptions } from 'bullmq';
import { ENV, type Env } from '../../config/env.js';

/** BullMQ kuyruğunun adı. */
export const VALIDATION_QUEUE = 'content-validation';

export interface ValidationJob {
  validationId: string;
}

/** `REDIS_URL`'den BullMQ bağlantı seçenekleri (işleyici engelleyici komutlar için `maxRetriesPerRequest: null` ister). */
export function bullConnection(url: string): ConnectionOptions {
  const u = new URL(url);
  const db = u.pathname.length > 1 ? Number(u.pathname.slice(1)) : 0;
  return {
    host: u.hostname,
    port: u.port === '' ? 6379 : Number(u.port),
    ...(u.username === '' ? {} : { username: decodeURIComponent(u.username) }),
    ...(u.password === '' ? {} : { password: decodeURIComponent(u.password) }),
    db: Number.isInteger(db) ? db : 0,
    maxRetriesPerRequest: null,
    ...(u.protocol === 'rediss:' ? { tls: {} } : {}),
  };
}

/**
 * Üretici: doğrulama satırını açan çağıranın ardından işi kuyruğa koyar. Kuyruk ilk kullanımda bağlanır (yalnızca
 * işleyici rolündeki süreç üretici bağlantısı açmaz).
 */
@Injectable()
export class ValidationQueue implements OnModuleDestroy {
  private queue: Queue<ValidationJob> | undefined;

  constructor(@Inject(ENV) private readonly env: Env) {}

  async add(validationId: string): Promise<void> {
    this.queue ??= new Queue<ValidationJob>(VALIDATION_QUEUE, { connection: bullConnection(this.env.REDIS_URL) });
    await this.queue.add(
      'validate',
      { validationId },
      { jobId: validationId, removeOnComplete: 1000, removeOnFail: 1000 },
    );
  }

  async onModuleDestroy(): Promise<void> {
    await this.queue?.close();
  }
}
