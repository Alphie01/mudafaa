import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { notFound } from '../../common/api-error.js';
import { PrismaService } from '../../database/prisma.service.js';
import { Public } from '../auth/decorators.js';
import { AssetStore } from './asset.store.js';

@Controller('assets')
export class AssetsController {
  constructor(
    private readonly store: AssetStore,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Get(':sha')
  async get(@Param('sha') sha: string, @Res() res: Response): Promise<void> {
    const stream = this.store.open(sha);
    if (stream === null) throw notFound();
    const row = await this.prisma.asset.findFirst({ where: { sha256: sha } });
    res.setHeader('Content-Type', row?.mime ?? 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    stream.pipe(res);
  }
}
