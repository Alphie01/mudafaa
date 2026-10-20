import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { notFound } from '../../common/api-error.js';
import { PrismaService } from '../../database/prisma.service.js';
import { Public } from '../auth/decorators.js';
import { AssetStore } from './asset.store.js';

/** İçerik adresli varlıklar: kimlik doğrulaması istemez, süresiz önbelleğe alınabilir. */
@Controller('assets')
export class AssetsController {
  constructor(
    private readonly store: AssetStore,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Get(':sha')
  async get(@Param('sha') sha: string, @Res() res: Response): Promise<void> {
    const file = await this.store.open(sha);
    if (file === null) throw notFound();
    // Yan dosyası olmayan (eski) depolarda tür, varlık satırından okunur.
    const mime = file.mime ?? (await this.prisma.asset.findFirst({ where: { sha256: sha } }))?.mime;
    res.setHeader('Content-Type', mime ?? 'application/octet-stream');
    res.setHeader('Content-Length', String(file.size));
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    file.stream.pipe(res);
  }
}
