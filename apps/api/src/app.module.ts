import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CommonModule } from './common/common.module.js';
import { UserThrottlerGuard } from './common/user-throttler.guard.js';
import { EnvModule } from './config/env.module.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [EnvModule, RedisModule, CommonModule, DatabaseModule, HealthModule],
  providers: [{ provide: APP_GUARD, useClass: UserThrottlerGuard }],
})
export class AppModule {}
