import { describe, expect, it } from 'vitest';
import { bullConnection } from '../../src/modules/content-validation/validation.queue.js';

describe('bullConnection', () => {
  it('parses host, port, db and credentials; workers need maxRetriesPerRequest null', () => {
    expect(bullConnection('redis://localhost:6380')).toEqual({
      host: 'localhost',
      port: 6380,
      db: 0,
      maxRetriesPerRequest: null,
    });
    expect(bullConnection('rediss://u:p%40ss@cache.example:6390/2')).toEqual({
      host: 'cache.example',
      port: 6390,
      username: 'u',
      password: 'p@ss',
      db: 2,
      maxRetriesPerRequest: null,
      tls: {},
    });
    expect(bullConnection('redis://cache')).toMatchObject({ port: 6379 });
  });
});
