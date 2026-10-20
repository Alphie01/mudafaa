import { ActionRequest } from '@mudafaa/case-schema';
import { describe, expect, it } from 'vitest';
import { ApiError } from '../../src/common/api-error.js';
import { ZodValidationPipe } from '../../src/common/zod.pipe.js';

describe('ZodValidationPipe', () => {
  it('maps issues to field paths', () => {
    const pipe = new ZodValidationPipe(ActionRequest);
    try {
      pipe.transform({
        clientActionId: '0190f000-0000-7000-8000-000000000001',
        expectedStateVersion: 0,
        action: { kind: 'CHOOSE' },
      });
      throw new Error('fırlatmalıydı');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      const err = e as ApiError;
      expect(err.status).toBe(400);
      expect(err.code).toBe('validation_error');
      expect(err.errors?.[0]?.path).toBe('action.choiceId');
    }
  });
});
