import { describe, expect, it } from 'vitest';
import { loadEnv, parseServiceAccount } from '../../src/config/env.js';

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

  it('accepts a service account key as JSON or base64', () => {
    const key = JSON.stringify({ project_id: 'mudafaa-app', client_email: 'sa@x.iam', private_key: 'a\\nb' });

    expect(parseServiceAccount(key)).toEqual({ projectId: 'mudafaa-app', clientEmail: 'sa@x.iam', privateKey: 'a\nb' });
    expect(parseServiceAccount(Buffer.from(key).toString('base64'))?.projectId).toBe('mudafaa-app');
    expect(loadEnv({ ...base, FIREBASE_SERVICE_ACCOUNT: key }).FIREBASE_SERVICE_ACCOUNT).toBe(key);
  });

  it('rejects a malformed service account key', () => {
    expect(parseServiceAccount('{"project_id":1}')).toBeNull();
    expect(() => loadEnv({ ...base, FIREBASE_SERVICE_ACCOUNT: 'not-a-key' })).toThrow(/FIREBASE_SERVICE_ACCOUNT/);
  });

  it('purchase settings default to store verification with the paywall on', () => {
    const env = loadEnv(base);

    expect(env).toMatchObject({
      PURCHASE_VERIFY_MODE: 'store',
      PAYWALL_ENABLED: true,
      GOOGLE_PLAY_PACKAGE: 'com.monolithyazilim.mudafaa',
      APPLE_BUNDLE_ID: 'com.monolithyazilim.mudafaa',
    });
    expect(env.APPLE_APP_ID).toBeUndefined();
  });

  it('allows the fake purchase verifier and a disabled paywall outside production', () => {
    const env = loadEnv({ ...base, NODE_ENV: 'test', PURCHASE_VERIFY_MODE: 'fake', PAYWALL_ENABLED: 'false' });

    expect(env.PURCHASE_VERIFY_MODE).toBe('fake');
    expect(env.PAYWALL_ENABLED).toBe(false);
  });

  it('rejects the fake purchase verifier and a disabled paywall in production', () => {
    expect(() => loadEnv({ ...base, NODE_ENV: 'production', PURCHASE_VERIFY_MODE: 'fake' })).toThrow(
      /PURCHASE_VERIFY_MODE/,
    );
    expect(() => loadEnv({ ...base, NODE_ENV: 'production', PAYWALL_ENABLED: 'false' })).toThrow(/PAYWALL_ENABLED/);
  });

  it('validates the Google Play service account and Apple app id', () => {
    expect(() => loadEnv({ ...base, GOOGLE_PLAY_SERVICE_ACCOUNT: 'x' })).toThrow(/GOOGLE_PLAY_SERVICE_ACCOUNT/);
    expect(loadEnv({ ...base, APPLE_APP_ID: '6740000000' }).APPLE_APP_ID).toBe(6740000000);
    // production.env.example'daki boş anahtarlar tanımsız sayılır.
    const blank = loadEnv({ ...base, APPLE_APP_ID: '', APPLE_ISSUER_ID: '', GOOGLE_PLAY_SERVICE_ACCOUNT: '' });
    expect([blank.APPLE_APP_ID, blank.APPLE_ISSUER_ID, blank.GOOGLE_PLAY_SERVICE_ACCOUNT]).toEqual([
      undefined,
      undefined,
      undefined,
    ]);
  });
});
