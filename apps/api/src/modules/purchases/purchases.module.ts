import { Module } from '@nestjs/common';
import { ENV, type Env } from '../../config/env.js';
import { CLOCK, type Clock } from './clock.js';
import { EntitlementService } from './entitlement.service.js';
import { PurchasesController } from './purchases.controller.js';
import { StoreNotificationsController } from './store-notifications.controller.js';
import {
  APPLE_NOTIFICATIONS,
  type AppleNotifications,
  StoreNotificationsService,
} from './store-notifications.service.js';
import { AppleNotificationDecoder } from './store/apple.verifier.js';
import { PurchaseVerifier } from './store/purchase-verifier.service.js';

const systemClock: Clock = () => new Date();

/** Uygulama içi satın alma: mağaza doğrulayıcıları, hak kuralları, satın alma uçları ve mağaza bildirimleri. */
@Module({
  controllers: [PurchasesController, StoreNotificationsController],
  providers: [
    PurchaseVerifier,
    EntitlementService,
    StoreNotificationsService,
    { provide: CLOCK, useValue: systemClock },
    {
      provide: APPLE_NOTIFICATIONS,
      inject: [ENV],
      useFactory: (env: Env): AppleNotifications =>
        AppleNotificationDecoder.create(env.APPLE_BUNDLE_ID, env.APPLE_APP_ID),
    },
  ],
  exports: [EntitlementService],
})
export class PurchasesModule {}
