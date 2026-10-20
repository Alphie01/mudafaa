import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module.js';
import { EnvModule } from './config/env.module.js';
import { DatabaseModule } from './database/database.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ContentValidationModule } from './modules/content-validation/content-validation.module.js';
import { GameModule } from './modules/game/game.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [
    EnvModule,
    RedisModule,
    CommonModule,
    DatabaseModule,
    AuthModule,
    HealthModule,
    GameModule,
    AdminModule,
    // İşleyici yalnızca APP_ROLE=all iken bu süreçte çalışır (api: yalnızca üretici; worker: main.ts WorkerModule).
    ContentValidationModule,
  ],
})
export class AppModule {}
