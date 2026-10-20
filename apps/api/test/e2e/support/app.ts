import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../src/app.module.js';
import { APP_OPTIONS, configureApp } from '../../../src/app.setup.js';
import { ENV, type Env } from '../../../src/config/env.js';
import { PrismaService } from '../../../src/database/prisma.service.js';
import { AuthCache } from '../../../src/modules/auth/auth-cache.js';
import { testEnv } from './env.js';

export interface TestApp {
  app: INestApplication;
  env: Env;
  prisma: PrismaService;
  /** Kimliksiz istek. */
  http: () => ReturnType<typeof request>;
  close: () => Promise<void>;
}

/** Üretimle aynı ayarlarla (`/v1`, hata zarfı, gövde ayrıştırıcı) test uygulaması; ortam `testEnv` + `overrides`. */
export async function bootstrapApp(overrides: Record<string, string | undefined> = {}): Promise<TestApp> {
  const env = testEnv(overrides);
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(ENV)
    .useValue(env)
    .compile();
  const app = configureApp(moduleRef.createNestApplication(APP_OPTIONS));
  await app.init();
  const prisma = app.get(PrismaService);
  return { app, env, prisma, http: () => request(app.getHttpServer()), close: () => app.close() };
}

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

/** Bearer token'lı istemci: yollar `/v1` önekisiz verilir. */
export function client(app: INestApplication, token: string) {
  const server = app.getHttpServer();
  const call = (method: Method, path: string) =>
    request(server)[method](`/v1${path}`).set('Authorization', `Bearer ${token}`);
  return {
    get: (path: string) => call('get', path),
    delete: (path: string) => call('delete', path),
    post: (path: string, body: unknown = {}) => call('post', path).send(body as object),
    put: (path: string, body: unknown = {}) => call('put', path).send(body as object),
    patch: (path: string, body: unknown = {}) => call('patch', path).send(body as object),
    /** Ham gövdeli POST (varlık yükleme). */
    raw: (path: string, bytes: Buffer) =>
      call('post', path).set('Content-Type', 'application/octet-stream').send(bytes),
  };
}
export type Client = ReturnType<typeof client>;

/** Aksiyon isteği gövdesi (yeni idempotency anahtarıyla). */
export const actionBody = (expectedStateVersion: number, action: unknown, clientActionId = randomUUID()) => ({
  clientActionId,
  expectedStateVersion,
  action,
});

/** Kullanıcının rolünü doğrudan değiştirir ve kimlik önbelleğini boşaltır. */
export async function setRole(t: TestApp, uid: string, role: 'PLAYER' | 'EDITOR' | 'ADMIN'): Promise<string> {
  const u = await t.prisma.user.update({ where: { firebaseUid: uid }, data: { role } });
  t.app.get(AuthCache).evict(uid);
  return u.id;
}
