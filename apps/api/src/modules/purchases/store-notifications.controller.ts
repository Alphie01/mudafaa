import { Body, Controller, Headers, HttpCode, Post } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/zod.pipe.js';
import { Public } from '../auth/decorators.js';
import { type NotificationResult, PubSubPush, StoreNotificationsService } from './store-notifications.service.js';

const AppleBody = z.object({ signedPayload: z.string().min(1) });

/**
 * Mağaza sunucu bildirimleri (Firebase kimliği yok; kimlik Apple imzası ya da Google OIDC token'ıdır):
 * App Store Connect → App Store Server Notifications (v2) ve Play Console → RTDN Pub/Sub push aboneliği (OIDC).
 */
@Public()
@Controller('store-notifications')
export class StoreNotificationsController {
  constructor(private readonly notifications: StoreNotificationsService) {}

  @Post('apple')
  @HttpCode(200)
  async apple(@Body(new ZodValidationPipe(AppleBody)) body: z.infer<typeof AppleBody>): Promise<NotificationResult> {
    const r = await this.notifications.handleApple(body.signedPayload);
    this.notifications.log('App Store', r);
    return r;
  }

  @Post('google')
  @HttpCode(200)
  async google(
    @Headers('authorization') authorization: string | undefined,
    @Body() body: unknown,
  ): Promise<NotificationResult> {
    // Kimlik gövdeden önce denetlenir (yetkisiz istek gövde hatası bile öğrenmesin).
    await this.notifications.authenticateGoogle(authorization);
    const push = new ZodValidationPipe(PubSubPush).transform(body);
    const r = await this.notifications.handleGoogle(StoreNotificationsService.decodeGoogle(push));
    this.notifications.log('Google Play', r);
    return r;
  }
}
