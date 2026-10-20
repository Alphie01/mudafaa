import { Module } from '@nestjs/common';
import { AssetsController } from '../content/assets.controller.js';
import { ContentModule } from '../content/content.module.js';
import { GameController } from './game.controller.js';
import { GameService } from './game.service.js';

/** Oyun API'si: kullanıcı, katalog, oturum, aksiyon, okuma uçları ve varlıklar. */
@Module({
  imports: [ContentModule],
  controllers: [GameController, AssetsController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
