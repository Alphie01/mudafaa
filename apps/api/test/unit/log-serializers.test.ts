import { describe, expect, it } from 'vitest';
import { reqSerializer, stripQuery } from '../../src/common/log-serializers.js';

describe('log serializers', () => {
  it('strips query strings from logged URLs', () => {
    expect(stripQuery('/v1/store-notifications/google?secret=x')).toBe('/v1/store-notifications/google');
    expect(stripQuery('/v1/me')).toBe('/v1/me');
    expect(reqSerializer({ method: 'POST', url: '/v1/a?token=t', query: { token: 't' } })).toEqual({
      method: 'POST',
      url: '/v1/a',
    });
  });
});
