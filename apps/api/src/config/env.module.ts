import { Global, Module } from '@nestjs/common';
import { ENV, loadEnv, type Env } from './env.js';

/** Ortam değişkenlerini açılışta bir kez doğrular ve ENV token'ıyla tüm modüllere sağlar. */
@Global()
@Module({
  providers: [{ provide: ENV, useFactory: (): Env => loadEnv(process.env) }],
  exports: [ENV],
})
export class EnvModule {}
