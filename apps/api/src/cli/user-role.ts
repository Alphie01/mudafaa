// Rol yönetimi:
//   npm run user:role -- <firebaseUid | kullanıcı uuid> <PLAYER|EDITOR|ADMIN> [--yes]
//   npm run user:role -- --email <e-posta> <PLAYER|EDITOR|ADMIN> [--yes]
// Hedef yalnızca firebaseUid ya da iç kimlikle çözülür; e-posta (doğrulanmamış ya da yinelenen olabilir) yalnızca açık
// `--email` bayrağıyla ve tam bir eşleşme varsa kullanılır. Çözülen kullanıcı (uid, e-posta, güncel rol) her zaman
// yazdırılır; değişiklik yalnızca `--yes` ile uygulanır. Yazım admin_audit_logs'a actorId=null, action='user.role.cli'
// olarak düşer. Çalışan API'nin kimlik önbelleği en geç 60 sn içinde yeni rolü görür.
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApiError, notFound } from '../common/api-error.js';
import { isUuid } from '../common/uuid.js';
import { PrismaService } from '../database/prisma.service.js';
import { AuditService } from '../modules/admin/audit.service.js';
import { CliModule } from './cli.module.js';

const ROLES = ['PLAYER', 'EDITOR', 'ADMIN'] as const;
export type Role = (typeof ROLES)[number];

export type UserRef = { by: 'uid'; value: string } | { by: 'email'; value: string };

export interface ResolvedUser {
  id: string;
  firebaseUid: string;
  email: string | null;
  role: Role;
}

/** Hedefi çözer: firebaseUid ya da iç uuid; e-posta yalnızca açıkça istenirse ve tam bir eşleşmeyle. */
export async function resolveUser(app: INestApplicationContext, ref: UserRef): Promise<ResolvedUser> {
  const prisma = app.get(PrismaService);
  const select = { id: true, firebaseUid: true, email: true, role: true } as const;
  if (ref.by === 'email') {
    const matches = await prisma.user.findMany({ where: { email: ref.value }, select, take: 2 });
    if (matches.length === 0) throw notFound(`Bu e-postayla kullanıcı yok: ${ref.value}`);
    if (matches.length > 1) {
      throw new ApiError(
        400,
        'validation_error',
        `E-posta birden çok hesapla eşleşiyor; firebaseUid kullanın: ${ref.value}`,
      );
    }
    return matches[0] as ResolvedUser;
  }
  const user =
    (await prisma.user.findUnique({ where: { firebaseUid: ref.value }, select })) ??
    (isUuid(ref.value) ? await prisma.user.findUnique({ where: { id: ref.value }, select }) : null);
  if (user === null) throw notFound(`Kullanıcı bulunamadı: ${ref.value}`);
  return user;
}

/** Rolü yazar ve denetim kaydı ekler (çözülmüş kullanıcı üzerinde). */
export async function applyRole(app: INestApplicationContext, user: ResolvedUser, role: Role): Promise<void> {
  const prisma = app.get(PrismaService);
  const audit = app.get(AuditService);
  await prisma.$transaction(async (tx) => {
    await tx.user.update({ where: { id: user.id }, data: { role } });
    await audit.record(tx, {
      actor: null,
      action: 'user.role.cli',
      targetType: 'user',
      targetId: user.id,
      payload: { from: user.role, to: role, firebaseUid: user.firebaseUid },
    });
  });
}

/** Argümanları ayrıştırır; geçersizse null. */
export function parseArgs(argv: string[]): { ref: UserRef; role: Role; yes: boolean } | null {
  const yes = argv.includes('--yes');
  const rest = argv.filter((a) => a !== '--yes');
  let ref: UserRef | undefined;
  const at = rest.indexOf('--email');
  if (at >= 0) {
    const email = rest[at + 1];
    if (email === undefined || email.startsWith('--')) return null;
    ref = { by: 'email', value: email };
    rest.splice(at, 2);
  }
  if (rest.some((a) => a.startsWith('--'))) return null;
  if (ref === undefined) {
    const uid = rest.shift();
    if (uid === undefined) return null;
    ref = { by: 'uid', value: uid };
  }
  const role = rest.shift();
  if (rest.length > 0 || !ROLES.includes(role as Role)) return null;
  return { ref, role: role as Role, yes };
}

if (process.argv[1] !== undefined && import.meta.filename === resolve(process.argv[1])) {
  const envFile = join(import.meta.dirname, '..', '..', '.env');
  if (existsSync(envFile)) process.loadEnvFile(envFile);
  const args = parseArgs(process.argv.slice(2));
  if (args === null) {
    console.error('Kullanım: user:role <firebaseUid | kullanıcı uuid> <PLAYER|EDITOR|ADMIN> [--yes]');
    console.error('         user:role --email <e-posta> <PLAYER|EDITOR|ADMIN> [--yes]');
    process.exit(2);
  }
  const app = await NestFactory.createApplicationContext(CliModule, { logger: ['error', 'warn'] });
  try {
    const user = await resolveUser(app, args.ref);
    console.log(`kullanıcı: ${user.id} · uid ${user.firebaseUid} · e-posta ${user.email ?? '—'} · rol ${user.role}`);
    if (!args.yes) {
      console.log(`Değişiklik uygulanmadı: ${user.role} → ${args.role} için komutu --yes ile yeniden çalıştırın.`);
    } else {
      await applyRole(app, user, args.role);
      console.log(`rol güncellendi: ${user.role} → ${args.role}`);
    }
  } catch (e) {
    console.error(e instanceof Error ? e.message : String(e));
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}
