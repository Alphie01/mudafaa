import { Module } from '@nestjs/common';
import { AuditService } from '../admin/audit.service.js';
import { AssetStore } from './asset.store.js';
import { CaseLoaderService } from './case-loader.service.js';
import { ContentService } from './content.service.js';
import { ValidationService } from './validation.service.js';

/** İçerik hattı servisleri (HTTP'siz): API, kuyruk işleyicisi ve CLI ortak kullanır. */
@Module({
  providers: [AssetStore, AuditService, ValidationService, ContentService, CaseLoaderService],
  exports: [AssetStore, AuditService, ValidationService, ContentService, CaseLoaderService],
})
export class ContentModule {}
