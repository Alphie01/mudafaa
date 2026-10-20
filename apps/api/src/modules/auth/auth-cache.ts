import { Injectable } from '@nestjs/common';
import { LRUCache } from 'lru-cache';
import type { AuthUser } from './decorators.js';

/** uid → kullanıcı önbelleği (60 sn); hesap silme ve rol değişiminde boşaltılır. */
@Injectable()
export class AuthCache {
  readonly users = new LRUCache<string, AuthUser>({ max: 10_000, ttl: 60_000 });

  evict(uid: string): void {
    this.users.delete(uid);
  }
}
