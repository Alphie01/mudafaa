import { Inject, Injectable, Logger } from '@nestjs/common';
import { validatePackage, type ValidationReport } from '@mudafaa/validator';
import { notFound } from '../../common/api-error.js';
import { isUuid } from '../../common/uuid.js';
import { ENV, type Env } from '../../config/env.js';
import { PrismaService } from '../../database/prisma.service.js';
import type { Prisma } from '../../generated/prisma/client.js';
import type { AuthUser } from '../auth/decorators.js';
import { contentHash, exportPackage } from './mapper/index.js';

export type ValidationOutcome = 'PASSED' | 'FAILED' | 'ERROR';

/**
 * Katı kipte doğrulayıcı onaysız hukuki incelemeyi hata sayar (LEGAL_REVIEW_PENDING). API'de hukuki inceleme ayrı bir
 * yayın kapısıdır (`legal_review_required`) ve içerik hash'ine girmez; bu yüzden kayıtta bilgi düzeyine indirilir.
 * Aksi hâlde üretimde onay, ancak doğrulamadan önce pakete yazılarak verilebilirdi.
 */
export function legalReviewAsInfo(report: ValidationReport): ValidationReport {
  const issues = report.issues.map((i) =>
    i.code === 'LEGAL_REVIEW_PENDING' && i.severity === 'ERROR' ? { ...i, severity: 'INFO' as const } : i,
  );
  const count = (sev: string) => issues.filter((i) => i.severity === sev).length;
  const summary = { errors: count('ERROR'), warnings: count('WARNING'), infos: count('INFO') };
  return { ...report, issues, summary, status: summary.errors === 0 ? 'PASSED' : 'FAILED' };
}

/**
 * Doğrulayıcıyı bir sürüm üzerinde çalıştırır ve sonucu `content_validation_results`'a yazar. Yayın kapısı, kaydın
 * `packageHash`'ini (içerik hash'i, hukuki onay hariç) sürümün güncel içeriğiyle karşılaştırır.
 * - Bütçeler sayımdır (`VALIDATOR_MAX_STATES`, `VALIDATOR_WALKS`); `VALIDATOR_MAX_MS` yalnızca acil durdurmadır
 *   (aşılırsa rapor SIMULATION_ABORTED hatası taşır).
 * - `strict` üretimde açıktır (doğrulanamayan softlock hata sayılır).
 * Doğrulama CPU yoğun ve eşzamanlıdır; HTTP sürecinde değil kuyruk işleyicisinde çalışması beklenir (`execute`).
 */
@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(ENV) private readonly env: Env,
  ) {}

  /** QUEUED doğrulama satırı açar (kuyruk ve `runNow` ortak). */
  async createRow(versionId: string, actor?: AuthUser | null, tx?: Prisma.TransactionClient): Promise<string> {
    const db = tx ?? this.prisma;
    const version = isUuid(versionId) ? await db.caseVersion.findUnique({ where: { id: versionId } }) : null;
    if (version === null) throw notFound('Sürüm bulunamadı.');
    const row = await db.contentValidationResult.create({
      data: {
        caseVersionId: versionId,
        status: 'QUEUED',
        strict: this.env.VALIDATOR_STRICT === undefined ? this.env.NODE_ENV === 'production' : this.env.VALIDATOR_STRICT === 'true',
        requestedById: actor?.id ?? null,
      },
    });
    return row.id;
  }

  /** Sürümü hemen (bu süreçte) doğrular. */
  async runNow(
    versionId: string,
    actor?: AuthUser | null,
  ): Promise<{ validationId: string; status: ValidationOutcome }> {
    const validationId = await this.createRow(versionId, actor);
    return { validationId, status: await this.execute(validationId) };
  }

  /** QUEUED satırı çalıştırır: RUNNING → PASSED | FAILED | ERROR. Satır yoksa ERROR döner (iş düşer). */
  async execute(validationId: string): Promise<ValidationOutcome> {
    const row = await this.prisma.contentValidationResult.findUnique({ where: { id: validationId } });
    if (row === null) return 'ERROR';
    await this.prisma.contentValidationResult.update({
      where: { id: validationId },
      data: { status: 'RUNNING', startedAt: new Date() },
    });
    try {
      const pkg = await this.prisma.$transaction((tx) => exportPackage(tx, row.caseVersionId), { timeout: 30_000 });
      const report = legalReviewAsInfo(
        validatePackage(pkg, {
          strict: row.strict,
          maxStates: this.env.VALIDATOR_MAX_STATES,
          walks: this.env.VALIDATOR_WALKS,
          maxMs: this.env.VALIDATOR_MAX_MS,
        }),
      );
      await this.prisma.contentValidationResult.update({
        where: { id: validationId },
        data: {
          status: report.status,
          packageHash: contentHash(pkg),
          report: JSON.parse(JSON.stringify(report)) as Prisma.InputJsonValue,
          finishedAt: new Date(),
        },
      });
      return report.status;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      this.logger.error(`Doğrulama ${validationId} çalışmadı: ${message}`);
      await this.prisma.contentValidationResult.update({
        where: { id: validationId },
        data: { status: 'ERROR', report: { error: message }, finishedAt: new Date() },
      });
      return 'ERROR';
    }
  }
}
