import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module.js';
import { ValidationWorker } from './validation.processor.js';
import { ValidationQueue } from './validation.queue.js';

/** `content-validation` BullMQ kuyruğu: üretici (API) ve işleyici (`APP_ROLE` worker | all). */
@Module({
  imports: [ContentModule],
  providers: [ValidationQueue, ValidationWorker],
  exports: [ValidationQueue],
})
export class ContentValidationModule {}
