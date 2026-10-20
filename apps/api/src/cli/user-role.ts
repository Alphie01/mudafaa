// Rol yönetimi: npm run user:role -- <e-posta | firebaseUid> <PLAYER|EDITOR|ADMIN>
// Rolü günceller ve admin_audit_logs'a actorId=null, action='user.role.cli' yazar. Çalışan API'nin kimlik önbelleği
// en geç 60 sn içinde yeni rolü görür.
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { notFound } from '../common/api-error.js';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../modules/admin/audit.service.js';
import { CliModule } from './cli.module.js';

const ROLES = ['PLAYER', 'EDITOR', 'ADMIN'] as const;
export type Role = (typeof ROLES)[number];

/** CLI'nin çekirdeği (testler doğrudan çağırır). */
export async function setRole(
  app: INestApplicationContext,
  who: string,
  role: Role,
): Promise<{ id: string; firebaseUid: string }> {
  const prisma = app.get(PrismaService);
  const audit = app.get(AuditService);
  const user = await prisma.user.findFirst({ where: { OR: [{ email: who }, { firebaseUid: who }] } });
  if (user === null) throw notFound(`Kullanıcı bulunamadı: ${who}`);
  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: user.id }, data: { role } });
    await audit.record(tx, {
      actor: null,
      action: 'user.role.cli',
      targetType: 'user',
      targetId: user.id,
      payload: { from: user.role, to: role },
    });
  });
  return { id: user.id, firebaseUid: user.firebaseUid };
}

if (process.argv[1] !== undefined && import.meta.filename === resolve(process.argv[1])) {
  const envFile = join(import.meta.dirname, '..', '..', '.env');
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  const [who, role] = process.argv.slice(2);
  if (who === undefined || !ROLES.includes(role as Role)) {
    console.error('Kullanım: user:role <e-posta | firebaseUid> <PLAYER|EDITOR|ADMIN>');
    process.exit(2);
  }
  const app = await NestFactory.createApplicationContext(CliModule, { logger: ['error', 'warn'] });
  try {
    const u = await setRole(app, who, role as Role);
    console.log(`${who} (${u.id}) → ${role}`);
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}
