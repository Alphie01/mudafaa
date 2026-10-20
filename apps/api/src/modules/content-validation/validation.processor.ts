import { Inject, Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import { ENV, type Env } from '../../config/env.js';
import { ValidationService } from '../content/validation.service.js';
import { bullConnection, VALIDATION_QUEUE, type ValidationJob } from './validation.queue.js';

/**
 * İşleyici: `APP_ROLE` `worker` ya da `all` ise kuyruğu dinler ve `ValidationService.execute` ile QUEUED → RUNNING →
 * PASSED | FAILED | ERROR yazar. Doğrulama CPU yoğun olduğundan eşzamanlılık 1'dir.
 */
@Injectable()
export class ValidationWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ValidationWorker.name);
  private worker: Worker<ValidationJob> | undefined;

  constructor(
    @Inject(ENV) private readonly env: Env,
    private readonly validation: ValidationService,
  ) {}

  onModuleInit(): void {
    if (this.env.APP_ROLE === 'api') return;
    this.worker = new Worker<ValidationJob>(
      VALIDATION_QUEUE,
      async (job) => this.validation.execute(job.data.validationId),
      { connection: bullConnection(this.env.REDIS_URL), concurrency: 1 },
    );
    this.worker.on('failed', (job, err) => this.logger.error(`Doğrulama işi ${job?.id ?? '?'} düştü: ${err.message}`));
    this.worker.on('error', (err) => this.logger.error(`Kuyruk işleyicisi hatası: ${err.message}`));
  }

  /** Testler ve kapanış: işleyici çalışıyor mu. */
  get running(): boolean {
    return this.worker !== undefined;
  }

  async onModuleDestroy(): Promise<void> {
    await this.worker?.close();
  }
}
