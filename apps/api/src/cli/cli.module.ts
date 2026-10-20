import { Module } from '@nestjs/common';
import { EnvModule } from '../config/env.module.js';
import { DatabaseModule } from '../database/database.module.js';
import { ContentModule } from '../modules/content/content.module.js';
import { RedisModule } from '../redis/redis.module.js';

/** Komut satırı araçlarının (seed, case:import, user:role) HTTP'siz uygulama bağlamı. */
@Module({ imports: [EnvModule, RedisModule, DatabaseModule, ContentModule] })
export class CliModule {}
