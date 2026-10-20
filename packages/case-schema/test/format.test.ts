import { describe, expect, it } from 'vitest';
import { CASE_FORMAT } from '@mudafaa/case-schema';

describe('CASE_FORMAT', () => {
  it('is the v1 content format id', () => {
    expect(CASE_FORMAT).toBe('mudafaa.case/v1');
  });
});
