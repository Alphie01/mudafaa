import type { ValidationReport } from '@mudafaa/validator';
import { describe, expect, it } from 'vitest';
import { legalReviewAsInfo } from '../../src/modules/content/validation.service.js';

const base = (issues: ValidationReport['issues']): ValidationReport => ({
  status: 'FAILED',
  engineVersion: 1,
  summary: { errors: 0, warnings: 0, infos: 0 },
  issues,
});

describe('legalReviewAsInfo', () => {
  it('downgrades the strict legal review error and recomputes the status', () => {
    const r = legalReviewAsInfo(
      base([{ severity: 'ERROR', code: 'LEGAL_REVIEW_PENDING', path: 'meta.legalReview.status', message: 'x' }]),
    );
    expect(r.status).toBe('PASSED');
    expect(r.summary).toEqual({ errors: 0, warnings: 0, infos: 1 });
    expect(r.issues[0]?.severity).toBe('INFO');
  });

  it('keeps other errors', () => {
    const r = legalReviewAsInfo(
      base([
        { severity: 'ERROR', code: 'LEGAL_REVIEW_PENDING', path: '', message: 'x' },
        { severity: 'ERROR', code: 'SOFTLOCK', path: '', message: 'y' },
      ]),
    );
    expect(r.status).toBe('FAILED');
    expect(r.summary.errors).toBe(1);
  });
});
