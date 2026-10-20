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
  });

export type Env = z.infer<typeof EnvSchema>;

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
