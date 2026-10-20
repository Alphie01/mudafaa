import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../generated/prisma/client.js';
import type { AuthUser } from '../auth/decorators.js';

type Tx = Prisma.TransactionClient;

export interface AuditEntry {
  actor: AuthUser | null | undefined;
  action: string;
  targetType: string;
  targetId?: string;
  payload?: unknown;
  requestId?: string;
}

/** Yönetim işlemlerinin denetim kaydı; çağıranın transaction'ında yazılır (işlem geri alınırsa kayıt da gider). */
@Injectable()
export class AuditService {
  async record(tx: Tx, entry: AuditEntry): Promise<void> {
    await tx.adminAuditLog.create({
      data: {
        actorId: entry.actor?.id ?? null,
        action: entry.action,
        targetType: entry.targetType,
        targetId: entry.targetId ?? null,
        ...(entry.payload === undefined ? {} : { payload: entry.payload as Prisma.InputJsonValue }),
        requestId: entry.requestId ?? null,
      },
    });
  }
}
