import { Injectable, type PipeTransform } from '@nestjs/common';
import { formatPath } from '@mudafaa/engine';
import type { z } from 'zod';
import { ApiError } from './api-error.js';

/** Gövdeyi ya da sorguyu bir Zod şemasıyla doğrular; hata → 400 `validation_error` ve alan yolları. */
@Injectable()
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: z.ZodType<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (result.success) return result.data;
    throw new ApiError(400, 'validation_error', 'İstek geçersiz.', {
      errors: result.error.issues.map((i) => ({ path: formatPath(i.path), message: i.message })),
    });
  }
}
