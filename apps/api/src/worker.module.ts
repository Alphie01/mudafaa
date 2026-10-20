import { Module } from '@nestjs/common';
import { EnvModule } from './config/env.module.js';
import { DatabaseModule } from './database/database.module.js';
import { ContentValidationModule } from './modules/content-validation/content-validation.module.js';
import { RedisModule } from './redis/redis.module.js';

/** `APP_ROLE=worker`: yalnızca kuyruk işleyicileri; HTTP dinlenmez. */
@Module({ imports: [EnvModule, RedisModule, DatabaseModule, ContentValidationModule] })
export class WorkerModule {}
