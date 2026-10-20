import { Module } from '@nestjs/common';
import { EnvModule } from './config/env.module.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [EnvModule, DatabaseModule, RedisModule, HealthModule],
})
export class AppModule {}
