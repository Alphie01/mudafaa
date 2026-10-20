import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UserThrottlerGuard } from '../../common/user-throttler.guard.js';
import { UsersService } from '../users/users.service.js';
import { AuthCache } from './auth-cache.js';
import { AuthGuard } from './auth.guard.js';
import { FirebaseService } from './firebase.service.js';

/**
 * Kimlik: Firebase doğrulama, JIT kullanıcı ve global guard'lar. Kimlik guard'ı hız sınırından önce çalışır (hız sınırı
 * kullanıcı başına).
 */
@Global()
@Module({
  providers: [
    AuthCache,
    FirebaseService,
    UsersService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: UserThrottlerGuard },
  ],
  exports: [AuthCache, FirebaseService, UsersService],
})
export class AuthModule {}
