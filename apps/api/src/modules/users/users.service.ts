import { Injectable } from '@nestjs/common';
import type { DecodedIdToken } from 'firebase-admin/auth';
import { ApiError } from '../../common/api-error.js';
import { PrismaService } from '../../database/prisma.service.js';
import type { AuthUser } from '../auth/decorators.js';

const DEFAULT_NAME = 'Deniz Arslan';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Token'dan kullanıcıyı bulur ya da oluşturur (profil ve istatistik satırlarıyla). */
  async upsertFromToken(t: DecodedIdToken): Promise<AuthUser> {
    const provider = t.firebase.sign_in_provider;
    const user = await this.prisma.user.upsert({
      where: { firebaseUid: t.uid },
      update: { lastSeenAt: new Date(), email: t.email ?? null, provider, isAnonymous: provider === 'anonymous' },
      create: {
        firebaseUid: t.uid,
        email: t.email ?? null,
        displayName: typeof t.name === 'string' && t.name.trim() !== '' ? t.name : DEFAULT_NAME,
        provider,
        isAnonymous: provider === 'anonymous',
        lastSeenAt: new Date(),
        profile: { create: {} },
        statistics: { create: {} },
      },
    });
    if (user.status !== 'ACTIVE') throw new ApiError(403, 'forbidden', 'Hesap etkin değil.');
    return {
      id: user.id,
      firebaseUid: user.firebaseUid,
      role: user.role,
      isAnonymous: user.isAnonymous,
      displayName: user.displayName,
      email: user.email,
    };
  }
}
