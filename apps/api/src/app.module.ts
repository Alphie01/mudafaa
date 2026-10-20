import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module.js';
import { EnvModule } from './config/env.module.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { GameModule } from './modules/game/game.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { RedisModule } from './redis/redis.module.js';

@Module({
  imports: [EnvModule, RedisModule, CommonModule, DatabaseModule, AuthModule, HealthModule, GameModule],
})
export class AppModule {}
