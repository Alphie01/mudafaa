import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UserThrottlerGuard } from '../../common/user-throttler.guard.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { FirebaseService } from '../auth/firebase.service.js';
import { AssetsController } from '../content/assets.controller.js';
import { AssetStore } from '../content/asset.store.js';
import { CaseLoaderService } from '../content/case-loader.service.js';
import { ContentService } from '../content/content.service.js';
import { UsersService } from '../users/users.service.js';
import { GameController } from './game.controller.js';
import { GameService } from './game.service.js';

/** Oyun API'si; kimlik guard'ı hız sınırından önce çalışır (hız sınırı kullanıcı başına). */
@Module({
  controllers: [GameController, AssetsController],
  providers: [
    FirebaseService,
    UsersService,
    AssetStore,
    ContentService,
    CaseLoaderService,
    GameService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: UserThrottlerGuard },
  ],
  exports: [ContentService],
})
export class GameModule {}
