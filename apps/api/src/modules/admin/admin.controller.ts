import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { z } from 'zod';
import { RequestId } from '../../common/request-id.js';
import { ZodValidationPipe } from '../../common/zod.pipe.js';
import { type AuthUser, CurrentUser, Roles } from '../auth/decorators.js';
import { AdminService } from './admin.service.js';

const CreateCase = z.strictObject({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'yalnızca küçük harf, rakam ve -'),
  number: z.int().min(0),
  difficulty: z.int().min(1).max(5).optional(),
});
const PatchCase = z.strictObject({
  requiredRankKey: z.string().nullable().optional(),
  archived: z.boolean().optional(),
});
const VersionRef = z.strictObject({ versionId: z.uuid() });
const Publish = z.strictObject({ versionId: z.uuid(), legalReviewConfirmed: z.boolean().default(false) });
const AssetQuery = z.object({
  mime: z
    .string()
    .regex(/^[a-z]+\/[a-z0-9.+-]+$/i, 'geçersiz dosya türü')
    .default('application/octet-stream'),
});
const AuditQuery = z.object({ limit: z.coerce.number().int().min(1).max(500).default(50) });
const RoleBody = z.strictObject({ role: z.enum(['PLAYER', 'EDITOR', 'ADMIN']) });

/** İnce yönetim API'si: EDITOR ve ADMIN; rol yönetimi yalnızca ADMIN. */
@Controller('admin')
@Roles('ADMIN', 'EDITOR')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Post('cases')
  createCase(
    @CurrentUser() actor: AuthUser,
    @RequestId() requestId: string,
    @Body(new ZodValidationPipe(CreateCase)) body: z.infer<typeof CreateCase>,
  ) {
    return this.admin.createCase(body, { actor, requestId });
  }

  @Get('cases')
  listCases() {
    return this.admin.listCases();
  }

  @Post('cases/import')
  importCase(@CurrentUser() actor: AuthUser, @RequestId() requestId: string, @Body() body: unknown) {
    return this.admin.importPackage(body, { actor, requestId });
  }

  @Get('cases/:id')
  getCase(@Param('id') id: string) {
    return this.admin.getCase(id);
  }

  @Patch('cases/:id')
  patchCase(
    @CurrentUser() actor: AuthUser,
    @RequestId() requestId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(PatchCase)) body: z.infer<typeof PatchCase>,
  ) {
    return this.admin.updateCase(id, body, { actor, requestId });
  }

  @Delete('cases/:id')
  @HttpCode(204)
  async archiveCase(@CurrentUser() actor: AuthUser, @RequestId() requestId: string, @Param('id') id: string) {
    await this.admin.updateCase(id, { archived: true }, { actor, requestId });
  }

  @Get('cases/:id/versions')
  versions(@Param('id') id: string) {
    return this.admin.listVersions(id);
  }

  @Post('cases/:id/versions')
  cloneVersion(@CurrentUser() actor: AuthUser, @RequestId() requestId: string, @Param('id') id: string) {
    return this.admin.cloneVersion(id, { actor, requestId });
  }

  @Get('cases/:id/versions/:vid/package')
  getPackage(@Param('id') id: string, @Param('vid') vid: string) {
    return this.admin.exportVersion(id, vid);
  }

  @Put('cases/:id/versions/:vid/package')
  @HttpCode(204)
  async putPackage(
    @CurrentUser() actor: AuthUser,
    @RequestId() requestId: string,
    @Param('id') id: string,
    @Param('vid') vid: string,
    @Body() body: unknown,
  ) {
    await this.admin.replaceVersion(id, vid, body, { actor, requestId });
  }

  @Get('cases/:id/export')
  exportPublished(@Param('id') id: string) {
    return this.admin.exportPublished(id);
  }

  @Post('cases/:id/validate')
  @HttpCode(202)
  validate(
    @CurrentUser() actor: AuthUser,
    @RequestId() requestId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(VersionRef)) body: z.infer<typeof VersionRef>,
  ) {
    return this.admin.enqueueValidation(id, body.versionId, { actor, requestId });
  }

  @Get('validations/:id')
  validation(@Param('id') id: string) {
    return this.admin.getValidation(id);
  }

  @Post('cases/:id/publish')
  @HttpCode(200)
  publish(
    @CurrentUser() actor: AuthUser,
    @RequestId() requestId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(Publish)) body: z.infer<typeof Publish>,
  ) {
    return this.admin.publish(id, body.versionId, body.legalReviewConfirmed, { actor, requestId });
  }

  @Post('cases/:id/test-sessions')
  testSession(
    @CurrentUser() actor: AuthUser,
    @RequestId() requestId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(VersionRef)) body: z.infer<typeof VersionRef>,
  ) {
    return this.admin.startTestSession(id, body.versionId, actor, requestId);
  }

  @Post('assets')
  uploadAsset(
    @CurrentUser() actor: AuthUser,
    @RequestId() requestId: string,
    @Query(new ZodValidationPipe(AssetQuery)) q: z.infer<typeof AssetQuery>,
    @Req() req: Request,
  ) {
    return this.admin.uploadAsset(req.body as Buffer, q.mime, { actor, requestId });
  }

  @Get('audit-logs')
  auditLogs(@Query(new ZodValidationPipe(AuditQuery)) q: z.infer<typeof AuditQuery>) {
    return this.admin.auditLogs(q.limit);
  }

  @Patch('users/:id/role')
  @Roles('ADMIN')
  setRole(
    @CurrentUser() actor: AuthUser,
    @RequestId() requestId: string,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(RoleBody)) body: z.infer<typeof RoleBody>,
  ) {
    return this.admin.setRole(id, body.role, { actor, requestId });
  }
}
