import { describe, expect, it } from 'vitest';
import { loadEnv } from '../../src/config/env.js';

const base = {
  DATABASE_URL: 'postgresql://mudafaa:mudafaa@localhost:5432/mudafaa',
  REDIS_URL: 'redis://localhost:6379',
  FIREBASE_PROJECT_ID: 'demo-mudafaa',
};

describe('loadEnv', () => {
  it('applies defaults for optional keys', () => {
    const env = loadEnv(base);

    expect(env).toMatchObject({ NODE_ENV: 'development', PORT: 3000, APP_ROLE: 'api' });
    expect(env.FIREBASE_AUTH_EMULATOR_HOST).toBeUndefined();
  });

  it('coerces PORT from string', () => {
    expect(loadEnv({ ...base, PORT: '4100' }).PORT).toBe(4100);
  });

  it('rejects a missing DATABASE_URL', () => {
    expect(() => loadEnv({ ...base, DATABASE_URL: undefined })).toThrow(/DATABASE_URL/);
  });

  it('allows the Auth Emulator outside production', () => {
    const env = loadEnv({ ...base, NODE_ENV: 'development', FIREBASE_AUTH_EMULATOR_HOST: 'localhost:9099' });

    expect(env.FIREBASE_AUTH_EMULATOR_HOST).toBe('localhost:9099');
  });

  it('rejects the Auth Emulator in production', () => {
    expect(() => loadEnv({ ...base, NODE_ENV: 'production', FIREBASE_AUTH_EMULATOR_HOST: 'localhost:9099' })).toThrow(
      /FIREBASE_AUTH_EMULATOR_HOST/,
    );
  });
});
