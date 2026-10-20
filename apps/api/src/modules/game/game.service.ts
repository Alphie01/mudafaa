import { Injectable } from '@nestjs/common';
import type {
  ActionRequest,
  CaseCard,
  CaseListResponse,
  CaseReport,
  CharactersResponse,
  ChooseResponse,
  EvidenceListResponse,
  MeResponse,
  OutcomeClass,
  ProgressResponse,
  RankDto,
  ScenesResponse,
  ScoreResponse,
  SessionSummary,
  SessionView,
  StartResponse,
} from '@mudafaa/case-schema';
import {
  act,
  breakdownRows,
  canonicalJson,
  computeScore,
  ENGINE_VERSION,
  fnv1a64,
  migrateState,
  report,
  sessionCharacters,
  sessionEvidence,
  sessionScenes,
  start,
  view,
  type SessionState,
} from '@mudafaa/engine';
import { ApiError, notFound } from '../../common/api-error.js';
import { isUuid } from '../../common/uuid.js';
import { PrismaService } from '../../database/prisma.service.js';
import type { GameSession, Prisma } from '../../generated/prisma/client.js';
import type { AuthUser } from '../auth/decorators.js';
import { CaseLoaderService, type LoadedCase } from '../content/case-loader.service.js';

type Tx = Prisma.TransactionClient;
type Tab = 'active' | 'closed' | 'locked';
type CardTone = NonNullable<CaseCard['best']>['stampTone'];
interface CardArt {
  cover: { name: string; accent: string } | undefined;
  sprite: { rows: string[]; skin?: string } | undefined;
  outcome: { id: string; class: OutcomeClass; stamp: string; stampTone: CardTone } | undefined;
}

const CLASS_FIELD = {
  ACQUITTAL: 'acquittals',
  REDUCED: 'reduced',
  CONVICTION: 'convictions',
  RECHARACTERIZED: 'recharacterized',
  OTHER: 'other',
} as const;

/** Kart durumu: kilit her şeyi ezer; sonra aktif oturum, sonra en iyi sonuç; hiçbiri yoksa yeni. */
export function cardStatus(input: {
  locked: boolean;
  activeSessionId?: string | undefined;
  bestOutcomeKey?: string | null | undefined;
}): CaseCard['status'] {
  if (input.locked) return 'LOCKED';
  if (input.activeSessionId !== undefined) return 'IN_PROGRESS';
  if (input.bestOutcomeKey !== undefined && input.bestOutcomeKey !== null) return 'COMPLETED';
  return 'NEW';
}

/** Oyun API'sinin çekirdeği: katalog, oturum, görünüm, aksiyon (transaction + idempotency), sonuç ve ilerleme. */
@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly loader: CaseLoaderService,
  ) {}

  // ── Rütbe ──
  private async ranks(): Promise<RankDto[]> {
    const rows = await this.prisma.rank.findMany({ orderBy: { sortOrder: 'asc' } });
    return rows.map((r) => ({ key: r.key, label: r.label, shortLabel: r.shortLabel, minXp: r.minXp }));
  }

  private standing(ranks: RankDto[], xp: number): { rank: RankDto; nextRank?: RankDto; progressPct: number } {
    let i = 0;
    for (let j = 0; j < ranks.length; j++) if ((ranks[j]?.minXp ?? Infinity) <= xp) i = j;
    const rank = ranks[i] as RankDto;
    const next = ranks[i + 1];
    if (next === undefined) return { rank, progressPct: 100 };
    return {
      rank,
      nextRank: next,
      progressPct: Math.max(0, Math.min(100, Math.floor(((xp - rank.minXp) / (next.minXp - rank.minXp)) * 100))),
    };
  }

  // ── Kullanıcı ──
  async me(user: AuthUser): Promise<MeResponse> {
    const [u, ranks, cards] = await Promise.all([
      this.prisma.user.findUniqueOrThrow({ where: { id: user.id }, include: { profile: true, statistics: true } }),
      this.ranks(),
      this.cards(user),
    ]);
    const st = u.statistics;
    const xp = st?.xp ?? 0;
    const active = await this.prisma.gameSession.findFirst({
      where: { userId: user.id, status: 'ACTIVE', mode: 'NORMAL' },
      orderBy: { updatedAt: 'desc' },
    });
    const settings = (u.profile?.settings ?? {}) as Record<string, unknown>;
    return {
      user: {
        id: u.id,
        displayName: u.displayName,
        email: u.email,
        isAnonymous: u.isAnonymous,
        provider: u.provider,
        role: u.role,
      },
      profile: {
        ...(u.profile?.lawyerName ? { lawyerName: u.profile.lawyerName } : {}),
        ...(u.profile?.office ? { office: u.profile.office } : {}),
        ...(u.profile?.city ? { city: u.profile.city } : {}),
        settings,
      },
      stats: {
        xp,
        ...this.standing(ranks, xp),
        closedCases: st?.closedCases ?? 0,
        outcomeCounts: {
          ACQUITTAL: st?.acquittals ?? 0,
          REDUCED: st?.reduced ?? 0,
          CONVICTION: st?.convictions ?? 0,
          RECHARACTERIZED: st?.recharacterized ?? 0,
          OTHER: st?.other ?? 0,
        },
      },
      ...(active === null ? {} : { activeSession: await this.summaryOf(active) }),
      newCases: cards.filter((c) => c.status === 'NEW').length,
    };
  }

  async updateProfile(
    user: AuthUser,
    patch: {
      displayName?: string;
      lawyerName?: string;
      office?: string;
      city?: string;
      settings?: Record<string, unknown>;
    },
  ): Promise<MeResponse> {
    const { displayName, settings, ...profile } = patch;
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...(displayName === undefined ? {} : { displayName }),
        profile: {
          upsert: {
            create: { ...profile, settings: (settings ?? {}) as Prisma.InputJsonValue },
            update: { ...profile, ...(settings === undefined ? {} : { settings: settings as Prisma.InputJsonValue }) },
          },
        },
      },
    });
    return this.me(user);
  }

  // ── Katalog ──
  private async cards(user: AuthUser): Promise<CaseCard[]> {
    const [cases, progress, active, stats, ranks] = await Promise.all([
      this.prisma.case.findMany({
        where: { currentVersionId: { not: null }, archivedAt: null },
        orderBy: { number: 'asc' },
        include: {
          currentVersion: {
            include: { snapshots: { where: { kind: 'PUBLISH_SNAPSHOT' }, orderBy: { createdAt: 'desc' }, take: 1 } },
          },
          category: true,
        },
      }),
      this.prisma.userProgress.findMany({ where: { userId: user.id } }),
      this.prisma.gameSession.findMany({ where: { userId: user.id, status: 'ACTIVE', mode: 'NORMAL' } }),
      this.prisma.userStatistics.findUnique({ where: { userId: user.id } }),
      this.ranks(),
    ]);
    const userRank = this.standing(ranks, stats?.xp ?? 0).rank;
    const order = (key: string | null | undefined): number => ranks.findIndex((r) => r.key === key);
    const art = await this.cardArt(cases, progress);
    const out: CaseCard[] = [];
    for (const c of cases) {
      const v = c.currentVersion;
      const snap = v?.snapshots[0];
      if (v === null || v === undefined || snap === undefined) continue;
      const prog = progress.find((p) => p.caseId === c.id);
      const { cover, sprite, outcome } =
        art.get(v.id) ?? (await this.cardArtFromSnapshot(snap.id, v.coverCharacterKey, prog?.bestOutcomeKey));
      const best = outcome;
      const act = active.find((s) => s.caseId === c.id);
      // Kilit dava satırından okunur (yayında sürümden eşitlenir; yönetici PATCH ile değiştirebilir).
      const required = c.requiredRankKey === null ? undefined : ranks.find((r) => r.key === c.requiredRankKey);
      const locked = required !== undefined && order(userRank.key) < order(required.key);
      out.push({
        id: c.id,
        slug: c.slug,
        number: c.number,
        title: v.title,
        crimeLabel: v.crimeLabel,
        lawRef: v.lawRef,
        possibleSentence: v.possibleSentence,
        difficulty: v.difficulty,
        category: { key: c.category.key, label: c.category.label },
        estimatedMinutes: v.estimatedMinutes,
        summary: v.summary,
        cover: {
          name: cover?.name ?? '',
          accent: cover?.accent ?? '#888888',
          sprite: {
            rows: [...(sprite?.rows ?? Array.from({ length: 20 }, () => '................'))],
            ...(sprite?.skin ? { skin: sprite.skin } : {}),
          },
        },
        status: cardStatus({ locked, activeSessionId: act?.id, bestOutcomeKey: prog?.bestOutcomeKey }),
        ...(locked && required ? { lockReason: `${required.label} rütbesi gerekir`, requiredRank: required } : {}),
        ...(act === undefined ? {} : { activeSessionId: act.id }),
        ...(best === undefined || prog === undefined
          ? {}
          : {
              best: {
                outcomeKey: best.id,
                outcomeClass: best.class,
                stamp: best.stamp,
                stampTone: best.stampTone,
                final: prog.bestFinal ?? 0,
              },
            }),
        legalReviewPending: v.legalReviewStatus === 'PENDING',
      });
    }
    return out;
  }

  /**
   * Kartın kapak karakteri, sprite'ı ve en iyi sonucun damgası yayınlanmış sürümün ilişkisel satırlarından okunur
   * (katalog her dava için paketi derlemez). Satırı olmayan eski sürümler `cardArtFromSnapshot`'a düşer.
   */
  private async cardArt(
    cases: { currentVersion: { id: string; coverCharacterKey: string } | null; id: string }[],
    progress: { caseId: string; bestOutcomeKey: string | null }[],
  ): Promise<Map<string, CardArt>> {
    const versions = cases.flatMap((c) => (c.currentVersion === null ? [] : [{ caseId: c.id, ...c.currentVersion }]));
    if (versions.length === 0) return new Map();
    const characters = await this.prisma.character.findMany({
      where: { OR: versions.map((v) => ({ caseVersionId: v.id, key: v.coverCharacterKey })) },
    });
    const sprites =
      characters.length === 0
        ? []
        : await this.prisma.characterSprite.findMany({
            where: { OR: characters.map((ch) => ({ caseVersionId: ch.caseVersionId, key: ch.spriteKey })) },
          });
    const wanted = versions.flatMap((v) => {
      const key = progress.find((p) => p.caseId === v.caseId)?.bestOutcomeKey;
      return key === null || key === undefined ? [] : [{ caseVersionId: v.id, key }];
    });
    const outcomes = wanted.length === 0 ? [] : await this.prisma.courtOutcome.findMany({ where: { OR: wanted } });
    const out = new Map<string, CardArt>();
    for (const v of versions) {
      const ch = characters.find((x) => x.caseVersionId === v.id);
      if (ch === undefined) continue;
      const sp = sprites.find((x) => x.caseVersionId === v.id && x.key === ch.spriteKey);
      const o = outcomes.find((x) => x.caseVersionId === v.id);
      out.set(v.id, {
        cover: { name: ch.name, accent: ch.accent },
        sprite: sp === undefined ? undefined : { rows: sp.rows as string[], ...(sp.skin ? { skin: sp.skin } : {}) },
        outcome:
          o === undefined
            ? undefined
            : { id: o.key, class: o.class as OutcomeClass, stamp: o.stamp, stampTone: o.stampTone as CardTone },
      });
    }
    return out;
  }

  private async cardArtFromSnapshot(snapshotId: string, coverKey: string, bestKey?: string | null): Promise<CardArt> {
    const loaded = await this.loader.get(snapshotId);
    const ch = loaded.compiled.characters.get(coverKey);
    const sp = ch === undefined ? undefined : loaded.compiled.sprites.get(ch.spriteId);
    const o = bestKey ? loaded.compiled.pkg.outcomes.find((x) => x.id === bestKey) : undefined;
    return {
      cover: ch === undefined ? undefined : { name: ch.name, accent: ch.accent },
      sprite: sp === undefined ? undefined : { rows: [...sp.rows], ...(sp.skin ? { skin: sp.skin } : {}) },
      outcome: o === undefined ? undefined : { id: o.id, class: o.class, stamp: o.stamp, stampTone: o.stampTone },
    };
  }

  async listCases(user: AuthUser, tab: Tab): Promise<CaseListResponse> {
    const all = await this.cards(user);
    const inTab = (c: CaseCard): Tab =>
      c.status === 'LOCKED' ? 'locked' : c.status === 'COMPLETED' ? 'closed' : 'active';
    return {
      items: all.filter((c) => inTab(c) === tab),
      counts: {
        active: all.filter((c) => inTab(c) === 'active').length,
        closed: all.filter((c) => inTab(c) === 'closed').length,
        locked: all.filter((c) => inTab(c) === 'locked').length,
      },
    };
  }

  async caseDetail(user: AuthUser, caseId: string): Promise<CaseCard & { demandText: string; completedCount: number }> {
    const card = (await this.cards(user)).find((c) => c.id === caseId);
    if (card === undefined) throw notFound();
    const v = await this.prisma.case.findUniqueOrThrow({ where: { id: caseId }, include: { currentVersion: true } });
    const prog = await this.prisma.userProgress.findUnique({ where: { userId_caseId: { userId: user.id, caseId } } });
    return { ...card, demandText: v.currentVersion?.demandText ?? '', completedCount: prog?.completedCount ?? 0 };
  }

  // ── Oturum ──
  private async summaryOf(s: GameSession): Promise<SessionSummary> {
    const c = await this.prisma.case.findUniqueOrThrow({ where: { id: s.caseId } });
    const v = await this.prisma.caseVersion.findUniqueOrThrow({ where: { id: s.caseVersionId } });
    return {
      id: s.id,
      caseId: s.caseId,
      caseNumber: c.number,
      caseTitle: v.title,
      mode: s.mode,
      status: s.status,
      stateVersion: s.stateVersion,
      ...(s.progressLabel ? { progressLabel: s.progressLabel } : {}),
      ...(s.outcomeKey ? { outcomeKey: s.outcomeKey } : {}),
      ...(s.finalScore === null ? {} : { finalScore: s.finalScore }),
      ...(s.xpEarned === null ? {} : { xpEarned: s.xpEarned }),
      startedAt: s.startedAt.toISOString(),
      ...(s.completedAt ? { completedAt: s.completedAt.toISOString() } : {}),
    };
  }

  private viewOf(loaded: LoadedCase, s: GameSession, state: SessionState): SessionView {
    return view(loaded.compiled, state, {
      sessionId: s.id,
      caseId: s.caseId,
      stateVersion: s.stateVersion,
      mode: s.mode,
      assetUrl: loaded.assetUrl,
    });
  }

  private async owned(user: AuthUser, sessionId: string): Promise<GameSession> {
    const s = isUuid(sessionId) ? await this.prisma.gameSession.findUnique({ where: { id: sessionId } }) : null;
    if (s === null || s.userId !== user.id) throw notFound();
    return s;
  }

  async start(user: AuthUser, caseId: string, restart: boolean): Promise<{ created: boolean; body: StartResponse }> {
    const card = (await this.cards(user)).find((c) => c.id === caseId);
    if (card === undefined) throw notFound();
    if (card.status === 'LOCKED') throw new ApiError(403, 'case_locked', card.lockReason ?? 'Dava kilitli.');
    const existing = await this.prisma.gameSession.findFirst({
      where: { userId: user.id, caseId, status: 'ACTIVE', mode: 'NORMAL' },
    });
    if (existing !== null && !restart) return { created: false, body: await this.startBody(existing) };
    const c = await this.prisma.case.findUniqueOrThrow({ where: { id: caseId } });
    const snap = await this.prisma.contentVersion.findFirstOrThrow({
      where: { caseVersionId: c.currentVersionId ?? '', kind: 'PUBLISH_SNAPSHOT' },
      orderBy: { createdAt: 'desc' },
    });
    const loaded = await this.loader.get(snap.id);
    const first = start(loaded.compiled).state;
    try {
      const session = await this.prisma.$transaction(async (tx) => {
        if (existing !== null)
          await tx.gameSession.update({ where: { id: existing.id }, data: { status: 'ABANDONED' } });
        const s = await tx.gameSession.create({
          data: {
            userId: user.id,
            caseId,
            caseVersionId: snap.caseVersionId,
            snapshotId: snap.id,
            mode: 'NORMAL',
            engineVersion: ENGINE_VERSION,
            currentNodeKey: first.nodeId,
          },
        });
        await tx.sessionState.create({
          data: { sessionId: s.id, state: first as unknown as Prisma.InputJsonValue, stateVersion: 0 },
        });
        await tx.userProgress.upsert({
          where: { userId_caseId: { userId: user.id, caseId } },
          update: { activeSessionId: s.id, lastPlayedAt: new Date() },
          create: { userId: user.id, caseId, activeSessionId: s.id, lastPlayedAt: new Date() },
        });
        return s;
      });
      return { created: true, body: await this.startBody(session) };
    } catch (e) {
      if ((e as { code?: string }).code === 'P2002') {
        const again = await this.prisma.gameSession.findFirstOrThrow({
          where: { userId: user.id, caseId, status: 'ACTIVE', mode: 'NORMAL' },
        });
        return { created: false, body: await this.startBody(again) };
      }
      throw e;
    }
  }

  private async startBody(s: GameSession): Promise<StartResponse> {
    const { view: v } = await this.viewFor(s);
    return { session: await this.summaryOf(s), view: v };
  }

  private async viewFor(s: GameSession): Promise<{ view: SessionView; state: SessionState; loaded: LoadedCase }> {
    const row = await this.prisma.sessionState.findUniqueOrThrow({ where: { sessionId: s.id } });
    const state = migrateState(row.state);
    const loaded = await this.loader.get(s.snapshotId);
    return { view: this.viewOf(loaded, s, state), state, loaded };
  }

  async summary(user: AuthUser, sessionId: string): Promise<SessionSummary> {
    return this.summaryOf(await this.owned(user, sessionId));
  }

  async currentView(user: AuthUser, sessionId: string): Promise<{ view: SessionView; stateVersion: number }> {
    const s = await this.owned(user, sessionId);
    return { view: (await this.viewFor(s)).view, stateVersion: s.stateVersion };
  }

  async listMine(user: AuthUser): Promise<SessionSummary[]> {
    const rows = await this.prisma.gameSession.findMany({
      where: { userId: user.id, mode: 'NORMAL' },
      orderBy: { startedAt: 'desc' },
      take: 50,
    });
    return Promise.all(rows.map((r) => this.summaryOf(r)));
  }

  async abandon(user: AuthUser, sessionId: string): Promise<void> {
    const s = await this.owned(user, sessionId);
    if (s.status !== 'ACTIVE') throw new ApiError(409, 'session_not_active', 'Oturum aktif değil.');
    await this.prisma.$transaction([
      this.prisma.gameSession.update({ where: { id: s.id }, data: { status: 'ABANDONED' } }),
      this.prisma.userProgress.updateMany({
        where: { userId: user.id, caseId: s.caseId, activeSessionId: s.id },
        data: { activeSessionId: null },
      }),
    ]);
  }

  async result(user: AuthUser, sessionId: string): Promise<CaseReport> {
    const s = await this.owned(user, sessionId);
    if (s.status !== 'COMPLETED') throw new ApiError(409, 'session_not_completed', 'Dava henüz bitmedi.');
    const { state, loaded } = await this.viewFor(s);
    const categoryMax = loaded.analysis?.categoryMax;
    return report(loaded.compiled, state, categoryMax === undefined ? {} : { categoryMax });
  }

  // ── Okuma uçları ──
  private async stateOf(user: AuthUser, sessionId: string) {
    const s = await this.owned(user, sessionId);
    const row = await this.prisma.sessionState.findUniqueOrThrow({ where: { sessionId: s.id } });
    return { session: s, state: migrateState(row.state), loaded: await this.loader.get(s.snapshotId) };
  }

  async evidence(user: AuthUser, sessionId: string): Promise<EvidenceListResponse> {
    const { state, loaded } = await this.stateOf(user, sessionId);
    return sessionEvidence(loaded.compiled, state);
  }

  async scenes(user: AuthUser, sessionId: string): Promise<ScenesResponse> {
    const { state, loaded } = await this.stateOf(user, sessionId);
    return sessionScenes(loaded.compiled, state, loaded.assetUrl);
  }

  async characters(user: AuthUser, sessionId: string): Promise<CharactersResponse> {
    const { state, loaded } = await this.stateOf(user, sessionId);
    return sessionCharacters(loaded.compiled, state);
  }

  /** Oyun sırasında yalnızca ham skor; bitişte final, döküm ve sonuç (motorun hesabı, API skor hesaplamaz). */
  async score(user: AuthUser, sessionId: string): Promise<ScoreResponse> {
    const { session, state, loaded } = await this.stateOf(user, sessionId);
    const summary = computeScore(loaded.compiled, state);
    if (session.status !== 'COMPLETED' || state.outcome === undefined) {
      return { status: session.status, raw: summary.raw };
    }
    return {
      status: session.status,
      raw: summary.raw,
      final: state.outcome.final,
      breakdown: breakdownRows(summary),
      outcomeKey: state.outcome.id,
    };
  }

  // ── İlerleme ──
  async progress(user: AuthUser): Promise<ProgressResponse> {
    const [stats, ranks, rows, active] = await Promise.all([
      this.prisma.userStatistics.findUnique({ where: { userId: user.id } }),
      this.ranks(),
      this.prisma.userProgress.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'asc' } }),
      this.prisma.gameSession.findMany({ where: { userId: user.id, status: 'ACTIVE', mode: 'NORMAL' } }),
    ]);
    const xp = stats?.xp ?? 0;
    return {
      xp,
      ...this.standing(ranks, xp),
      outcomeCounts: {
        ACQUITTAL: stats?.acquittals ?? 0,
        REDUCED: stats?.reduced ?? 0,
        CONVICTION: stats?.convictions ?? 0,
        RECHARACTERIZED: stats?.recharacterized ?? 0,
        OTHER: stats?.other ?? 0,
      },
      cases: rows.map((p) => ({
        caseId: p.caseId,
        status: active.some((s) => s.caseId === p.caseId)
          ? ('IN_PROGRESS' as const)
          : p.bestOutcomeKey !== null
            ? ('COMPLETED' as const)
            : ('NEW' as const),
        ...(p.bestOutcomeKey === null ? {} : { bestOutcomeKey: p.bestOutcomeKey }),
        ...(p.bestOutcomeClass === null ? {} : { bestOutcomeClass: p.bestOutcomeClass as OutcomeClass }),
        ...(p.bestFinal === null ? {} : { bestFinal: p.bestFinal }),
        xpCredited: p.xpCredited,
      })),
    };
  }

  // ── Test oturumu (yönetici) ──
  /** TEST_SNAPSHOT'a sabitlenmiş TEST oturumu: normal `/sessions/*` uçlarıyla oynanır, ilerleme yazılmaz. */
  async startTest(user: AuthUser, snapshotId: string): Promise<StartResponse> {
    const loaded = await this.loader.get(snapshotId);
    const first = start(loaded.compiled).state;
    const session = await this.prisma.$transaction(async (tx) => {
      const s = await tx.gameSession.create({
        data: {
          userId: user.id,
          caseId: loaded.caseId,
          caseVersionId: loaded.caseVersionId,
          snapshotId,
          mode: 'TEST',
          engineVersion: ENGINE_VERSION,
          currentNodeKey: first.nodeId,
        },
      });
      await tx.sessionState.create({
        data: { sessionId: s.id, state: first as unknown as Prisma.InputJsonValue, stateVersion: 0 },
      });
      return s;
    });
    return this.startBody(session);
  }

  // ── Aksiyon ──
  async choose(
    user: AuthUser,
    sessionId: string,
    req: ActionRequest,
  ): Promise<{ body: ChooseResponse; replay: boolean }> {
    const s0 = await this.owned(user, sessionId);
    const hash = fnv1a64(canonicalJson({ expectedStateVersion: req.expectedStateVersion, action: req.action }));
    const replayOf = async (tx: Tx | PrismaService): Promise<ChooseResponse | null> => {
      const prior = await tx.sessionChoice.findUnique({
        where: { sessionId_clientActionId: { sessionId, clientActionId: req.clientActionId } },
      });
      if (prior === null) return null;
      if (prior.requestHash !== hash)
        throw new ApiError(422, 'idempotency_key_reused', 'Bu istek kimliği farklı bir istekle kullanılmış.');
      return prior.response as unknown as ChooseResponse;
    };
    const fast = await replayOf(this.prisma);
    if (fast !== null) return { body: fast, replay: true };
    const loaded = await this.loader.get(s0.snapshotId);
    const run = () =>
      this.prisma.$transaction(
        async (tx) => {
          await tx.$queryRaw`SELECT id FROM game_sessions WHERE id = ${sessionId}::uuid FOR UPDATE`;
          const again = await replayOf(tx);
          if (again !== null) return { body: again, replay: true };
          const s = await tx.gameSession.findUniqueOrThrow({ where: { id: sessionId } });
          if (s.status !== 'ACTIVE') throw new ApiError(409, 'session_not_active', 'Oturum aktif değil.');
          if (s.stateVersion !== req.expectedStateVersion)
            throw new ApiError(409, 'state_version_mismatch', 'Oyun durumu değişmiş; ekranı yenileyin.');
          const row = await tx.sessionState.findUniqueOrThrow({ where: { sessionId } });
          const before = migrateState(row.state);
          const r = act(loaded.compiled, before, req.action);
          if (!r.ok) throw new ApiError(422, 'action_rejected', r.message, { reason: r.code });
          const after = r.state;
          const version = s.stateVersion + 1;
          const done = after.status === 'COMPLETED' && after.outcome !== undefined;
          const outcome = done ? loaded.compiled.outcomes.find((o) => o.id === after.outcome?.id) : undefined;
          const updated = await tx.gameSession.update({
            where: { id: sessionId },
            data: {
              stateVersion: version,
              currentNodeKey: after.nodeId,
              ...(done
                ? {
                    status: 'COMPLETED',
                    outcomeKey: after.outcome?.id ?? null,
                    outcomeClass: outcome?.class ?? null,
                    finalScore: after.outcome?.final ?? null,
                    xpEarned: after.outcome?.xp ?? null,
                    completedAt: new Date(),
                  }
                : {}),
            },
          });
          const v = this.viewOf(loaded, updated, after);
          if (v.session.progressLabel !== undefined && v.session.progressLabel !== s.progressLabel) {
            await tx.gameSession.update({ where: { id: sessionId }, data: { progressLabel: v.session.progressLabel } });
          }
          const body: ChooseResponse = { result: r.result, view: v };
          await tx.sessionState.update({
            where: { sessionId },
            data: { state: after as unknown as Prisma.InputJsonValue, stateVersion: version },
          });
          // Yanıt, veritabanının sakladığı biçimle döner (jsonb anahtar sırası): ilk yanıt ile tekrarlar bayt bayt aynı.
          const stored = await tx.sessionChoice.create({
            select: { response: true },
            data: {
              sessionId,
              seq: after.seq,
              clientActionId: req.clientActionId,
              requestHash: hash,
              action: req.action as Prisma.InputJsonValue,
              response: body as unknown as Prisma.InputJsonValue,
            },
          });
          if (r.events.length > 0) {
            await tx.sessionEvent.createMany({
              data: r.events.map((e, idx) => ({
                sessionId,
                seq: after.seq,
                idx,
                type: e.type,
                payload: e as unknown as Prisma.InputJsonValue,
              })),
            });
          }
          const changed = Object.keys(after.vars).filter(
            (k) => JSON.stringify(after.vars[k]) !== JSON.stringify(before.vars[k]),
          );
          for (const key of changed) {
            const value = after.vars[key] as Prisma.InputJsonValue;
            await tx.sessionVariable.upsert({
              where: { sessionId_key: { sessionId, key } },
              update: { value },
              create: { sessionId, key, value },
            });
          }
          const found = r.events.flatMap((e) =>
            e.type === 'DISCOVER' ? [{ sessionId, evidenceKey: e.evidence, seq: after.seq, via: e.source }] : [],
          );
          if (found.length > 0) await tx.discoveredEvidence.createMany({ data: found, skipDuplicates: true });
          const scores = r.events.flatMap((e) =>
            e.type === 'SCORE'
              ? [
                  {
                    sessionId,
                    seq: after.seq,
                    category: e.category,
                    amount: e.amount,
                    lineKey: e.line ?? null,
                    sourceKey: e.source,
                  },
                ]
              : [],
          );
          if (scores.length > 0) await tx.sessionScore.createMany({ data: scores });
          if (done && s.mode === 'NORMAL' && outcome !== undefined)
            await this.onCompleted(tx, updated, after, outcome.class);
          return { body: stored.response as unknown as ChooseResponse, replay: false };
        },
        { isolationLevel: 'ReadCommitted', timeout: 10_000 },
      );
    try {
      return await run();
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === 'P2034' || code === '40P01' || code === '40001') return run();
      if (code === 'P2002') {
        const replay = await replayOf(this.prisma);
        if (replay !== null) return { body: replay, replay: true };
      }
      throw e;
    }
  }

  /** Bitiş: XP yalnızca önceki en iyiyi aşan kısım için (farm yok); istatistikler ilerlemeden yeniden hesaplanır. */
  private async onCompleted(tx: Tx, s: GameSession, state: SessionState, outcomeClass: string): Promise<void> {
    const o = state.outcome;
    if (o === undefined) return;
    await tx.$queryRaw`SELECT id FROM user_progress WHERE user_id = ${s.userId}::uuid AND case_id = ${s.caseId}::uuid FOR UPDATE`;
    const prog = await tx.userProgress.findUnique({ where: { userId_caseId: { userId: s.userId, caseId: s.caseId } } });
    const better =
      prog?.bestSessionId == null ||
      o.xp > (prog.xpCredited ?? 0) ||
      (o.xp === prog.xpCredited && o.final > (prog.bestFinal ?? -Infinity));
    await tx.userProgress.upsert({
      where: { userId_caseId: { userId: s.userId, caseId: s.caseId } },
      update: {
        activeSessionId: null,
        completedCount: { increment: 1 },
        xpCredited: Math.max(prog?.xpCredited ?? 0, o.xp),
        ...(better
          ? { bestSessionId: s.id, bestOutcomeKey: o.id, bestOutcomeClass: outcomeClass, bestFinal: o.final }
          : {}),
      },
      create: {
        userId: s.userId,
        caseId: s.caseId,
        completedCount: 1,
        xpCredited: o.xp,
        bestSessionId: s.id,
        bestOutcomeKey: o.id,
        bestOutcomeClass: outcomeClass,
        bestFinal: o.final,
      },
    });
    const all = await tx.userProgress.findMany({ where: { userId: s.userId } });
    const xp = all.reduce((n, p) => n + p.xpCredited, 0);
    const counts = { acquittals: 0, reduced: 0, convictions: 0, recharacterized: 0, other: 0 };
    for (const p of all) {
      const f = CLASS_FIELD[(p.bestOutcomeClass ?? '') as keyof typeof CLASS_FIELD];
      if (f !== undefined) counts[f] += 1;
    }
    const ranks = await tx.rank.findMany({ orderBy: { sortOrder: 'asc' } });
    const rankKey = ranks.filter((r) => r.minXp <= xp).at(-1)?.key ?? 'STAJYER';
    await tx.userStatistics.upsert({
      where: { userId: s.userId },
      update: { xp, rankKey, closedCases: all.filter((p) => p.bestOutcomeKey !== null).length, ...counts },
      create: { userId: s.userId, xp, rankKey, closedCases: 1, ...counts },
    });
  }
}
