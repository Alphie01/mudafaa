export const meta = {
  name: 'mudafaa-cases-split',
  description: 'Split run: write/resume the remaining Müdafaa cases to the Dava #07 standard; devil\'s-advocate review and fix each (plus a review of Dava #07)',
  phases: [
    { title: 'Write', detail: 'one writer per case in its own worktree: story bible → content → legal notes → gates' },
    { title: 'Review', detail: 'devil\'s advocate: shortcuts/early solutions, spoilers, missing content, legal, length' },
    { title: 'Fix', detail: 'fix every blocker/major finding, re-run gates and shortcut probes' },
    { title: 'Re-review', detail: 'second adversarial pass only for cases with ≥3 blockers' },
  ],
}

const ROOT = '/Users/onderalpselcuk/works/mudafaa'

const STANDARDS = `
## The standard (binding; Dava #07 v2 is the reference implementation)
Müdafaa is a pixel-art **noir** legal adventure game in Turkish for lawyers and law students (Turkish criminal law: TCK, CMK). The engine is deterministic; all content is pre-written JSON. The player is Av. Deniz Arslan (Arslan Hukuk, Bursa); mentor Av. Leyla Erdem. Read these BEFORE writing, in this order:
1. ${ROOT}/docs/content/authoring-guide.md — the story-first authoring guide and the kit commands (case:new, case:build, case:validate, case:duration, case:scenes, case:sprite-preview).
2. ${ROOT}/docs/content/gece-bekcisinin-sirri-hikaye.md — the reference STORY BIBLE (tone, cast voices table, structure, scene beats). Your bible must match its depth.
3. ${ROOT}/docs/content/dava-07-v2-report.md and ${ROOT}/content/cases/gece-bekcisinin-sirri/ — the reference implementation (how scenes, documents, deduction, interviews with unlocks, two hearings with an adjournment phase, testimony press/present, objections, per-outcome epilogues, report hints are built), plus ${ROOT}/docs/content/dava-07.md and ${ROOT}/docs/legal/dava-07.md for the case design and legal-notes format.
4. ${ROOT}/docs/content/lineup.md — the 15-case series frame (office, ranks, difficulty curve, sensitive-topic limits, outcome classes).
5. Schema: ${ROOT}/packages/case-schema/src/*.ts (Line has name/bg/fx/style; Backdrop enum incl. sokak_karanlik, sokak_sabah; OutcomeDef.epilogue).

Hard requirements:
- Tone: noir drama (dark, atmospheric, rain, secrets, dry sparse humor). Deniz's inner voice uses style "thought". New locations open with a style "card" line + bg. Unknown voices use speaker "narrator" + name (never a character id).
- Legal citations live in Leyla's brief explanations, feedback/report/verdict text and formal courtroom speech — never in everyday dialogue. Legal substance must be correct for current Turkish law (verify articles; note sources and interpretive calls in docs/legal/<slug>.md). Lawyer ethics must be right (no coaching or pressuring witnesses, no chasing suspects — report to the prosecutor; false confession paths are ethics violations).
- Mystery integrity: the true culprit/twist is NEVER stated or strongly hinted before the player has earned it through evidence. Cold opens use anonymous voices/silhouettes. Choice labels must not give away the right answer (vary length/register; wrong options must be plausible to a non-expert).
- Structure: cold open → chapter 1 (client/family + mentor handover) → investigation hub (days × action points) → first hearing → adjournment/ARA phase with new developments → second hearing → verdict with per-outcome epilogue (OutcomeDef.epilogue). At least 4 outcome classes per lineup (two acquittal kinds CMK 223/2-b and 223/2-e, reduction or recharacterization, conviction), plus an ethics/collapse ending where it fits.
- Gameplay carries ~half the time: ≥3 searchable scenes (PNG via case:scenes), ≥3 document puzzles, a deduction board with ≥6 recipes + decoys, interviews whose topics unlock from facts found elsewhere, testimony with press/present across both hearings, objections, a mentor consultation. Wrong moves cost something.
- Size: typical path (the main 223/2-e acquittal golden path) ≈ 13–16k words of lines (hard ceiling ~18k) and ≥200 player actions; \`npm run case:duration -- <slug>\` must report 90–120 min for the typical path and ≥60 min for every other outcome path. Total case text ≥18k words. Max ~220 chars per line.
- Golden paths for every outcome in 90-tests.json. Gates: \`npm run build\` (run \`cd apps/api && npx prisma generate\` first if needed), \`npm run case:validate -- <slug>\` PASSED with full coverage, no softlock/leak; \`npx vitest run --project content-tools --project case-schema --project engine --project validator\`; \`npm run lint\`.
- Known engine limits (work around in content; do NOT modify packages/* or apps/*): node lines show only the FIRST matching response block (chain conditional pieces via DECISION nodes); $return from nodes reachable from several pushing hubs confuses the validator's escape distance — return to the hub directly; repeatable penalty rules need maxUses; the validator doesn't read epilogue conditions.
- Files you may create/modify: content/cases/<slug>/**, content/src/<slug>/** (if the kit uses it), content/shared/sprites/<slug>-*.json (new characters only; reuse shared sprites like mentor.json/avukat.json/hakim.json/savci.json where they fit), docs/content/<slug>.md (case design: truth, chronology, evidence chain, contradictions, node map, outcomes, golden paths, measurements), docs/content/<slug>-hikaye.md (story bible), docs/legal/<slug>.md. Do NOT edit root package.json, docs/plan.md, docs/content/lineup.md or any other case.
- Mark meta legal review as approved by "Claude (iç inceleme)" consistently with Dava #07.
- Do not dispatch subagents. Commit in logical steps on your current branch with Turkish conventional commit messages ending with the line "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".
`

const REVIEW_BRIEF = `
You are the DEVIL'S ADVOCATE reviewer. Your job is to break this case, not to praise it. The user requires: no missing content and NO content that leads to an early/premature solution. Default to suspicion; every claim of "fine" must be backed by a probe you ran.

Probe, with tools (write throwaway scripts under your scratch/temp dir using the built engine at ${ROOT}/packages/engine/dist — compile/start/act/view/enumerateActions — against the case directory):
A) EARLY SOLUTION / SHORTCUTS
 - Find the SHORTEST action sequences reaching each acquittal outcome (BFS/greedy/heuristic search over enumerateActions, prioritising "go to court early" and skipping investigation). Report action counts vs the typical golden path. Flag any acquittal reachable with < 60% of the typical path's actions, or without the key evidence the story says is required, or by going to court on day 1.
 - Check outcome conditions for loopholes (score-only acquittals, conditions satisfiable by spamming cheap points, score farming loops, thresholds reachable without the core contradictions).
 - Can the player brute-force puzzles cheaply (deduction pairs, presents, objections) without real cost? Are wrong presents/objections penalised?
 - TEXT SPOILERS: read ALL lines in order of the typical path (dump them). Flag any line, card, choice label, evidence description, deduction card, mentor hint or chapter title that names/strongly implies the culprit or twist before it is earned; flag choice sets where the right answer is obvious from form (longest, most legal-sounding, only one with an article number).
B) MISSING / THIN CONTENT
 - Characters introduced without payoff; evidence never used or presentable evidence with no use; dangling plot threads; topics/answers that are one-liners; branches with placeholder-ish or repetitive text; outcomes without epilogue/reasoning/howToReach; missable evidence without report hints; hearings where testimony has too few statements/decision points; the ARA phase lacking real developments.
 - Measure: words on typical path and per outcome path, total words, actions per golden path, \`npm run case:duration -- <slug>\` numbers. Flag below-standard numbers as blockers.
C) LEGAL & ETHICS & TONE: wrong articles/procedure, unrealistic verdict math, unethical "good" paths, ethics violations rewarded, citations in everyday dialogue, tone drifting from noir, sensitive-topic violations (no sexual crimes, crimes against children, terrorism).
D) GATES: run case:validate, the vitest projects listed in the standard, lint.

Severity: "blocker" = violates a hard requirement (early solution, spoiler, below length/duration, missing epilogue, failing gate, legal error in verdict); "major" = clearly hurts quality/fairness; "minor" = polish. Each finding must have a precise location (file + node/choice id) and a concrete fix. Do not edit files yourself.
`

const CASES = args.items

const WRITE = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    worktreePath: { type: 'string' },
    branch: { type: 'string' },
    status: { type: 'string', enum: ['done', 'partial', 'failed'] },
    wordsTypical: { type: 'number' },
    wordsTotal: { type: 'number' },
    actionsTypical: { type: 'number' },
    durationTypicalMin: { type: 'number' },
    outcomes: { type: 'array', items: { type: 'string' } },
    gatesPassed: { type: 'boolean' },
    concerns: { type: 'array', items: { type: 'string' } },
  },
  required: ['slug', 'worktreePath', 'branch', 'status', 'gatesPassed', 'concerns'],
}

const REVIEW = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    verdict: { type: 'string', enum: ['pass', 'fail'] },
    shortestAcquittalActions: { type: 'number' },
    typicalActions: { type: 'number' },
    durationTypicalMin: { type: 'number' },
    wordsTypical: { type: 'number' },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          severity: { type: 'string', enum: ['blocker', 'major', 'minor'] },
          category: { type: 'string' },
          location: { type: 'string' },
          problem: { type: 'string' },
          fix: { type: 'string' },
        },
        required: ['severity', 'category', 'location', 'problem', 'fix'],
      },
    },
  },
  required: ['slug', 'verdict', 'findings'],
}

const FIX = {
  type: 'object',
  properties: {
    slug: { type: 'string' },
    branch: { type: 'string' },
    status: { type: 'string', enum: ['done', 'partial', 'failed'] },
    fixedCount: { type: 'number' },
    notFixed: { type: 'array', items: { type: 'object', properties: { finding: { type: 'string' }, reason: { type: 'string' } }, required: ['finding', 'reason'] } },
    shortestAcquittalActions: { type: 'number' },
    durationTypicalMin: { type: 'number' },
    gatesPassed: { type: 'boolean' },
  },
  required: ['slug', 'status', 'gatesPassed', 'notFixed'],
}

const writePrompt = (c) => `You are a lead narrative designer writing case #${String(c.number).padStart(2, '0')} "${c.title}" (slug: ${c.slug}) for Müdafaa. You are in your own git worktree (a copy of ${ROOT}); work and commit there. First run \`git rev-parse --show-toplevel\` and \`git branch --show-current\` and remember them for your return value. Run \`npm ci --ignore-scripts\` if node_modules is missing, then \`cd apps/api && npx prisma generate && cd -\`, then \`npm run build\`.

Case brief from the lineup:
- Crime/articles: ${c.crime}
- Legal core (axis of the defence): ${c.core}
- Truth / twist: ${c.truth}
- Rank requirement: ${c.rank}; difficulty ${c.difficulty}/5.
${c.extra ? '- Extra: ' + c.extra : ''}
${STANDARDS}
Process: (1) scaffold with \`npm run case:new\` (see the guide); (2) write the story bible docs/content/${c.slug}-hikaye.md FIRST (truth & chronology, cast table with voices/secrets/arcs, structure, scene-by-scene beats with word budgets, epilogues); (3) write docs/content/${c.slug}.md (evidence chain, contradictions, outcome conditions, scoring); (4) build the content chapter by chapter, committing per chapter; (5) scenes via case:scenes, new sprites; (6) golden paths for every outcome; (7) legal notes docs/legal/${c.slug}.md; (8) self-check for early solutions: find the shortest action path to each acquittal with a quick search over enumerateActions and make sure acquittals require the real evidence chain (target: shortest acquittal ≥ 60% of the typical path's actions); dump the typical path's lines and remove anything that spoils the culprit early; (9) all gates green.

Return the structured result (worktreePath and branch from step 0; numbers from case:duration and your word count).`

const reviewPrompt = (c, w) => `${REVIEW_BRIEF}
Case under review: #${String(c.number).padStart(2, '0')} "${c.title}" (slug ${c.slug}).
The case lives in the git worktree at: ${w.worktreePath} (branch ${w.branch}). Work inside that directory for all reads and probes (cd there; run \`npm run build\` there if dist is missing). Do NOT modify or commit any file in it.
Case brief: crime ${c.crime}; legal core: ${c.core}; truth: ${c.truth}.
Writer's own claims (verify, don't trust): ${JSON.stringify({ wordsTypical: w.wordsTypical, actionsTypical: w.actionsTypical, durationTypicalMin: w.durationTypicalMin, outcomes: w.outcomes, concerns: w.concerns })}
The binding standard the case must meet:
${STANDARDS}
Return verdict "pass" only if there are zero blockers.`

const fixPrompt = (c, w, r) => `You are fixing case #${String(c.number).padStart(2, '0')} "${c.title}" (slug ${c.slug}) after a devil's-advocate review. Work in the existing git worktree ${w.worktreePath} (branch ${w.branch}): cd there for everything and commit there. Do not create a new worktree or branch.
${STANDARDS}
Review findings (fix EVERY blocker and major; fix minors when cheap):
${JSON.stringify(r.findings, null, 1)}
Reviewer measurements: shortest acquittal ${r.shortestAcquittalActions ?? '?'} actions vs typical ${r.typicalActions ?? '?'}; duration ${r.durationTypicalMin ?? '?'} min; typical words ${r.wordsTypical ?? '?'}.
After fixing: re-run the reviewer's kind of shortcut probe (shortest action path to each acquittal via search over enumerateActions) and confirm acquittals now need the real evidence chain (≥ 60% of typical actions); re-dump the typical path lines and re-check spoilers; update golden paths and docs (docs/content/${c.slug}.md, docs/legal/${c.slug}.md) for any changed condition/score; all gates green; commit. Report anything you deliberately did not fix with a reason.`

const SEVEN = { number: 7, slug: 'gece-bekcisinin-sirri', title: 'Gece Bekçisinin Sırrı', crime: 'Nitelikli hırsızlık (TCK 142/2-h, 143)', core: 'Teşhis, mazeret, hukuka aykırı arama', truth: 'Murat Koç gerçek fail; Selin Kaya gizli nişanlısı, vardiya saatini değiştirdi', reviewOnly: true }

const items = CASES.map(c => c.mode === 'review7' ? { ...SEVEN, mode: 'review7' } : c)

const results = await pipeline(
  items,
  // Stage 1: write (skipped for Dava #07, which is reviewed on a fresh worktree copy of plan-b)
  async (c) => {
    if (c.mode === 'done') { log(`${c.slug}: write already done — straight to review`); return c.w }
    if (c.mode === 'resume') {
      const note = `CRITICAL WORKSPACE OVERRIDE — read first. A previous writer for this case was interrupted mid-work by an infrastructure restart. Do NOT work in your current directory and do NOT create a new worktree or branch. Your workspace is the EXISTING git worktree ${c.worktreePath} (branch ${c.branch}). Run every command as \`cd ${c.worktreePath} && ...\`, and use absolute paths under ${c.worktreePath} for every file read/edit/write. Never modify files under ${ROOT} outside that worktree path. Start by inspecting \`git log --oneline -10\`, \`git status\`, and every file already written for this case (story bible, docs, content/src, content/cases, sprites). Keep the predecessor's good work and continue from where it stopped until the full process below is complete. In your return value use worktreePath=${c.worktreePath} and branch=${c.branch}. (Where the text below says "you are in your own git worktree" or tells you to run git rev-parse, apply it to ${c.worktreePath}.)\n\n`
      return await agent(note + writePrompt(c), { label: `write-resume:${c.slug}`, phase: 'Write', schema: WRITE })
    }
    if (c.reviewOnly) {
      return await agent(`Prepare a review/fix workspace for case slug ${c.slug}. You are in a fresh git worktree of ${ROOT}. Run \`git rev-parse --show-toplevel\` and \`git branch --show-current\`, run \`npm ci --ignore-scripts\` if node_modules is missing, \`cd apps/api && npx prisma generate && cd -\`, \`npm run build\`, then \`npm run case:duration -- ${c.slug}\`. Make one commit on this branch that adds an empty file docs/content/.review-${c.slug} so the worktree is kept (message: "chore: Dava #07 inceleme çalışma alanı" + the Co-Authored-By line "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"). Return worktreePath, branch, status done, gatesPassed true, duration and word numbers if printed, concerns [].`,
        { label: `prep:${c.slug}`, phase: 'Write', schema: WRITE, isolation: 'worktree', effort: 'low' })
    }
    return await agent(writePrompt(c), { label: `write:${c.slug}`, phase: 'Write', schema: WRITE, isolation: 'worktree' })
  },
  // Stage 2: devil's advocate review
  async (w, c) => {
    if (!w || w.status === 'failed') { log(`${c.slug}: writer failed — skipping review`); return { w, r: null } }
    const r = await agent(reviewPrompt(c, w), { label: `review:${c.slug}`, phase: 'Review', schema: REVIEW, effort: 'high' })
    if (r) log(`${c.slug}: review ${r.verdict} — ${r.findings.filter(f => f.severity === 'blocker').length} blocker, ${r.findings.filter(f => f.severity === 'major').length} major`)
    return { w, r }
  },
  // Stage 3: fix
  async ({ w, r }, c) => {
    if (!w || !r) return { w, r, f: null }
    const needs = r.findings.filter(x => x.severity !== 'minor').length > 0 || r.verdict === 'fail'
    if (!needs && r.findings.length === 0) return { w, r, f: { slug: c.slug, status: 'done', gatesPassed: true, notFixed: [], fixedCount: 0 } }
    const f = await agent(fixPrompt(c, w, r), { label: `fix:${c.slug}`, phase: 'Fix', schema: FIX })
    return { w, r, f }
  },
  // Stage 4: conditional re-review (≥3 blockers originally) → one more fix if it still fails
  async ({ w, r, f }, c) => {
    if (!w || !r || !f) return { slug: c.slug, w, r, f, r2: null, f2: null }
    const blockers = r.findings.filter(x => x.severity === 'blocker').length
    if (blockers < 3) return { slug: c.slug, w, r, f, r2: null, f2: null }
    const r2 = await agent(reviewPrompt(c, w) + `\n\nThis is a SECOND review after fixes. Previous findings were:\n${JSON.stringify(r.findings.map(x => x.severity + ': ' + x.problem))}\nCheck each was really fixed, then hunt for new problems.`,
      { label: `re-review:${c.slug}`, phase: 'Re-review', schema: REVIEW, effort: 'high' })
    let f2 = null
    if (r2 && r2.verdict === 'fail') f2 = await agent(fixPrompt(c, w, r2), { label: `fix2:${c.slug}`, phase: 'Re-review', schema: FIX })
    return { slug: c.slug, w, r, f, r2, f2 }
  },
)

return results.filter(Boolean).map(x => ({
  slug: x.slug,
  branch: x.w && x.w.branch,
  worktree: x.w && x.w.worktreePath,
  write: x.w && { status: x.w.status, words: x.w.wordsTypical, actions: x.w.actionsTypical, min: x.w.durationTypicalMin, gates: x.w.gatesPassed },
  review: x.r && { verdict: x.r.verdict, blockers: x.r.findings.filter(f => f.severity === 'blocker').length, majors: x.r.findings.filter(f => f.severity === 'major').length, shortest: x.r.shortestAcquittalActions, typical: x.r.typicalActions },
  fix: x.f && { status: x.f.status, gates: x.f.gatesPassed, notFixed: x.f.notFixed, shortest: x.f.shortestAcquittalActions, min: x.f.durationTypicalMin },
  review2: x.r2 && { verdict: x.r2.verdict, blockers: x.r2.findings.filter(f => f.severity === 'blocker').length },
  fix2: x.f2 && { status: x.f2.status, gates: x.f2.gatesPassed, notFixed: x.f2.notFixed },
}))