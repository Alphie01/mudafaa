import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  PremiumPickRequest,
  type PremiumPickResponse,
  PurchaseRequest,
  type PurchaseResponse,
} from '@mudafaa/case-schema';
import { ZodValidationPipe } from '../../common/zod.pipe.js';
import { type AuthUser, CurrentUser } from '../auth/decorators.js';
import { EntitlementService } from './entitlement.service.js';

/** Uygulama içi satın alma uçları (docs/iap.md). */
@Controller()
export class PurchasesController {
  constructor(private readonly entitlements: EntitlementService) {}

  /** Mağaza makbuzunu doğrular ve hakkı yazar; aynı token'ın tekrarı idempotenttir. */
  @Post('purchases')
  @HttpCode(200)
  purchase(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(PurchaseRequest)) body: PurchaseRequest,
  ): Promise<PurchaseResponse> {
    return this.entitlements.recordPurchase(user.id, body);
  }

  /** Premium ile bu dönemin seçim hakkından bir dava açar. */
  @Post('me/premium-picks')
  @HttpCode(200)
  pick(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(PremiumPickRequest)) body: PremiumPickRequest,
  ): Promise<PremiumPickResponse> {
    return this.entitlements.premiumPick(user.id, body.caseId);
  }
}
