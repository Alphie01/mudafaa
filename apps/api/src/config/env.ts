import { z } from 'zod';

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    // api: HTTP uçları · worker: yalnızca kuyruk işleyicileri · all: ikisi (geliştirme ve e2e)
    APP_ROLE: z.enum(['api', 'worker', 'all']).default('api'),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    // Virgülle ayrılmış izinli kökenler; boşsa geliştirme ve testte localhost kökenleri kabul edilir.
    CORS_ORIGINS: z.string().default(''),
    ASSET_DIR: z.string().min(1).default('storage/assets'),
    THROTTLE_LIMIT: z.coerce.number().int().positive().default(120),
    THROTTLE_CHOOSE_LIMIT: z.coerce.number().int().positive().default(30),
    VALIDATOR_MAX_MS: z.coerce.number().int().positive().default(300_000),
    VALIDATOR_MAX_STATES: z.coerce.number().int().positive().default(20_000),
    VALIDATOR_WALKS: z.coerce.number().int().positive().default(400),
    DATABASE_URL: z.url(),
    REDIS_URL: z.url(),
    FIREBASE_PROJECT_ID: z.string().min(1),
    FIREBASE_AUTH_EMULATOR_HOST: z.string().min(1).optional(),
    // Firebase servis hesabı anahtarı (konsoldan indirilen JSON); düz JSON ya da base64. Kullanıcı silme gibi yönetim
    // çağrıları için gerekir; yalnızca token doğrulama proje kimliğiyle de çalışır.
    FIREBASE_SERVICE_ACCOUNT: z.string().min(1).optional(),
    // Ters vekil (tünel) atlama sayısı; tanımlıysa Express `trust proxy` ile istemci IP'si X-Forwarded-For'dan okunur.
    TRUST_PROXY: z.coerce.number().int().min(0).max(10).optional(),
  })
  .superRefine((env, ctx) => {
    // docs/plan.md §8: production'da emulator değişkeni yasak (sahte token'larla giriş açılmasın).
    if (env.NODE_ENV === 'production' && env.FIREBASE_AUTH_EMULATOR_HOST !== undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['FIREBASE_AUTH_EMULATOR_HOST'],
        message: 'production ortamında Firebase Auth Emulator kullanılamaz',
      });
    }
    if (env.FIREBASE_SERVICE_ACCOUNT !== undefined && parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT) === null) {
      ctx.addIssue({
        code: 'custom',
        path: ['FIREBASE_SERVICE_ACCOUNT'],
        message: 'servis hesabı anahtarı JSON ya da base64 JSON olmalı (project_id, client_email, private_key)',
      });
    }
  });

export type Env = z.infer<typeof EnvSchema>;

export interface ServiceAccount {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

/** FIREBASE_SERVICE_ACCOUNT değerini (düz JSON ya da base64 JSON) çözer; geçersizse null. */
export function parseServiceAccount(raw: string): ServiceAccount | null {
  const text = raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8');
  try {
    const j = JSON.parse(text) as Record<string, unknown>;
    const { project_id: projectId, client_email: clientEmail, private_key: privateKey } = j;
    if (typeof projectId !== 'string' || typeof clientEmail !== 'string' || typeof privateKey !== 'string') return null;
    return { projectId, clientEmail, privateKey: privateKey.replace(/\\n/g, '\n') };
  } catch {
    return null;
  }
}

/** Doğrulanmış ortam değişkenlerinin (Env) enjeksiyon token'ı. */
export const ENV = Symbol('ENV');

/** Ortam değişkenlerini doğrular; geçersizse tüm sorunları listeleyen bir hata fırlatır. */
export function loadEnv(env: NodeJS.ProcessEnv): Env {
  const result = EnvSchema.safeParse(env);
  if (!result.success) {
    throw new Error(`Geçersiz ortam değişkenleri:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
