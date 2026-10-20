import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/** Hız sınırı kullanıcı başınadır (kimlik doğrulanmışsa kullanıcı kimliği, değilse IP). */
@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected override getTracker(req: Record<string, unknown>): Promise<string> {
    const user = req.user as { id?: string } | undefined;
    return Promise.resolve(user?.id ?? String(req.ip ?? 'anon'));
  }
}
