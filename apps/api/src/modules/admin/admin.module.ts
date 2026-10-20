import { Module } from '@nestjs/common';
import { ContentValidationModule } from '../content-validation/content-validation.module.js';
import { ContentModule } from '../content/content.module.js';
import { GameModule } from '../game/game.module.js';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';

/** İnce yönetim API'si (`/v1/admin/*`). */
@Module({
  imports: [ContentModule, ContentValidationModule, GameModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
