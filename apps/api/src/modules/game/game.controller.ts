import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Req, Res } from '@nestjs/common';
import {
  ActionRequest,
  type CaseListResponse,
  type CaseReport,
  type MeResponse,
  ProfilePatch,
  type RankDto,
  type SessionSummary,
} from '@mudafaa/case-schema';
import type { Request, Response } from 'express';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/zod.pipe.js';
import { PrismaService } from '../../database/prisma.service.js';
import { type AuthUser, CurrentUser, Public } from '../auth/decorators.js';
import { AuthCache } from '../auth/auth-cache.js';
import { FirebaseService } from '../auth/firebase.service.js';
import { GameService } from './game.service.js';

const Tab = z.object({ tab: z.enum(['active', 'closed', 'locked']).default('active') });
const StartBody = z.object({ restart: z.boolean().optional() }).default({});

@Controller()
export class GameController {
  constructor(
    private readonly game: GameService,
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseService,
    private readonly authCache: AuthCache,
  ) {}

  @Get('me')
  me(@CurrentUser() user: AuthUser): Promise<MeResponse> {
    return this.game.me(user);
  }

  @Patch('me/profile')
  profile(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(ProfilePatch)) body: ProfilePatch,
  ): Promise<MeResponse> {
    return this.game.updateProfile(user, body);
  }

  @Delete('me')
  @HttpCode(204)
  async deleteMe(@CurrentUser() user: AuthUser): Promise<void> {
    await this.prisma.user.delete({ where: { id: user.id } });
    this.authCache.evict(user.firebaseUid);
    await this.firebase.deleteUser(user.firebaseUid);
  }

  @Get('me/sessions')
  sessions(@CurrentUser() user: AuthUser): Promise<SessionSummary[]> {
    return this.game.listMine(user);
  }

  @Public()
  @Get('ranks')
  async ranks(): Promise<RankDto[]> {
    const rows = await this.prisma.rank.findMany({ orderBy: { sortOrder: 'asc' } });
    return rows.map((r) => ({ key: r.key, label: r.label, shortLabel: r.shortLabel, minXp: r.minXp }));
  }

  @Get('cases')
  cases(
    @CurrentUser() user: AuthUser,
    @Query(new ZodValidationPipe(Tab)) q: z.infer<typeof Tab>,
  ): Promise<CaseListResponse> {
    return this.game.listCases(user, q.tab);
  }

  @Get('cases/:id')
  caseDetail(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.game.caseDetail(user, id);
  }

  @Post('cases/:id/start')
  async start(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(StartBody)) body: z.infer<typeof StartBody>,
    @Res({ passthrough: true }) res: Response,
  ) {
    const r = await this.game.start(user, id, body.restart === true);
    res.status(r.created ? 201 : 200);
    return r.body;
  }

  @Get('sessions/:id')
  summary(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<SessionSummary> {
    return this.game.summary(user, id);
  }

  @Get('sessions/:id/current-node')
  async current(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const r = await this.game.currentView(user, id);
    const etag = `"${id}:${r.stateVersion}"`;
    res.setHeader('ETag', etag);
    if (req.headers['if-none-match'] === etag) {
      res.status(304);
      return undefined;
    }
    return r.view;
  }

  @Post('sessions/:id/choose')
  @HttpCode(200)
  async choose(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(ActionRequest)) body: ActionRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const r = await this.game.choose(user, id, body);
    if (r.replay) res.setHeader('X-Idempotent-Replay', 'true');
    return r.body;
  }

  @Post('sessions/:id/abandon')
  @HttpCode(204)
  abandon(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<void> {
    return this.game.abandon(user, id);
  }

  @Get('sessions/:id/result')
  result(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<CaseReport> {
    return this.game.result(user, id);
  }
}
