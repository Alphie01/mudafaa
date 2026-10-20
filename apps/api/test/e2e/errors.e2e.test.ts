import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../../src/app.module.js';
import { APP_OPTIONS, configureApp } from '../../src/app.setup.js';
import { ENV, loadEnv } from '../../src/config/env.js';

const testEnv = loadEnv({
  NODE_ENV: 'test',
  DATABASE_URL: process.env.DATABASE_URL_TEST ?? 'postgresql://mudafaa:mudafaa@localhost:5434/mudafaa_test',
  REDIS_URL: process.env.REDIS_URL_TEST ?? 'redis://localhost:6380',
  FIREBASE_PROJECT_ID: 'demo-mudafaa',
});

describe('error envelope', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(ENV)
      .useValue(testEnv)
      .compile();
    app = configureApp(moduleRef.createNestApplication(APP_OPTIONS));
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('unknown route → 404 envelope with request id', async () => {
    const res = await request(app.getHttpServer()).get('/v1/yok').set('X-Request-Id', 'abc');
    expect(res.status).toBe(404);
    expect(res.headers['x-request-id']).toBe('abc');
    expect(res.body).toEqual({ message: 'Kayıt bulunamadı.', error: 'not_found', requestId: 'abc' });
  });

  it('generates a request id when missing', async () => {
    const res = await request(app.getHttpServer()).get('/v1/yok');
    expect(res.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('oversized and malformed bodies get the envelope', async () => {
    const big = await request(app.getHttpServer())
      .post('/v1/health')
      .set('Content-Type', 'application/json')
      .send(`{"x":"${'a'.repeat(1_100_000)}"}`);
    expect(big.status).toBe(413);
    expect(big.body.error).toBe('validation_error');
    const bad = await request(app.getHttpServer())
      .post('/v1/health')
      .set('Content-Type', 'application/json')
      .send('{oops');
    expect(bad.status).toBe(400);
    expect(bad.body.error).toBe('validation_error');
  });

  it('health still works', async () => {
    expect((await request(app.getHttpServer()).get('/v1/health')).status).toBe(200);
  });
});
