import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { LRUCache } from 'lru-cache';
import { ApiError } from '../../common/api-error.js';
import { UsersService } from '../users/users.service.js';
import { type AuthUser, IS_PUBLIC, ROLES } from './decorators.js';
import { FirebaseService } from './firebase.service.js';

/**
 * Global kimlik guard'ı: Bearer Firebase ID token → kullanıcı (uid başına 60 sn önbellek). Önbellekte yoksa token
 * iptal/silinme denetimiyle doğrulanır ve kullanıcı JIT oluşturulur. Ardından rol denetimi yapılır.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  private readonly cache = new LRUCache<string, AuthUser>({ max: 10_000, ttl: 60_000 });

  constructor(
    private readonly reflector: Reflector,
    private readonly firebase: FirebaseService,
    private readonly users: UsersService,
  ) {}

  evict(uid: string): void {
    this.cache.delete(uid);
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const targets = [ctx.getHandler(), ctx.getClass()];
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, targets)) return true;
    const req = ctx.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    const header = req.headers.authorization ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (token === '') throw new ApiError(401, 'unauthorized', 'Oturum açmanız gerekiyor.');
    let user: AuthUser | undefined;
    try {
      const decoded = await this.firebase.verify(token, false);
      user = this.cache.get(decoded.uid);
      if (user === undefined) {
        const checked = await this.firebase.verify(token, true);
        user = await this.users.upsertFromToken(checked);
        this.cache.set(checked.uid, user);
      }
    } catch (e) {
      if (e instanceof ApiError) throw e;
      throw new ApiError(401, 'unauthorized', 'Oturum geçersiz; yeniden giriş yapın.');
    }
    req.user = user;
    const roles = this.reflector.getAllAndOverride<AuthUser['role'][] | undefined>(ROLES, targets);
    if (roles !== undefined && !roles.includes(user.role))
      throw new ApiError(403, 'forbidden', 'Bu işlem için yetkiniz yok.');
    return true;
  }
}
