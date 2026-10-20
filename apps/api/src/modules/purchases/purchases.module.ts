import { Module } from '@nestjs/common';
import { CLOCK, type Clock } from './clock.js';
import { EntitlementService } from './entitlement.service.js';
import { PurchasesController } from './purchases.controller.js';
import { PurchaseVerifier } from './store/purchase-verifier.service.js';

const systemClock: Clock = () => new Date();

/** Uygulama içi satın alma: mağaza doğrulayıcıları, hak kuralları ve uçlar. */
@Module({
  controllers: [PurchasesController],
  providers: [PurchaseVerifier, EntitlementService, { provide: CLOCK, useValue: systemClock }],
  exports: [EntitlementService],
})
export class PurchasesModule {}
