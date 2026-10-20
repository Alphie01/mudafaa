import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../../src/app.module.js';
import { configureApp } from '../../src/app.setup.js';
import { ENV, loadEnv } from '../../src/config/env.js';

// Docker "test" profili (npm run db:test:up): postgres-test 5434, redis-test 6380.
const testEnv = loadEnv({
  NODE_ENV: 'test',
  DATABASE_URL: process.env.DATABASE_URL_TEST ?? 'postgresql://mudafaa:mudafaa@localhost:5434/mudafaa_test',
  REDIS_URL: process.env.REDIS_URL_TEST ?? 'redis://localhost:6380',
  FIREBASE_PROJECT_ID: 'demo-mudafaa',
});

describe('GET /v1/health', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(ENV)
      .useValue(testEnv)
      .compile();
    app = configureApp(moduleRef.createNestApplication());
    await app.init();
  });

  afterAll(async () => {
    // beforeAll başarısız olursa app atanmamış olabilir.
    await app?.close();
  });

  it('reports database, redis and content format status', async () => {
    const res = await request(app.getHttpServer()).get('/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', db: 'up', redis: 'up', format: 'mudafaa.case/v1' });
  });
});
