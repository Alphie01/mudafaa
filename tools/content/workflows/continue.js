export const meta = {
  name: 'mudafaa-cases-continue',
  description: 'Continue Müdafaa case production after a restart: finish fixes, run pending reviews and second reviews (state in tools/content/workflows/state)',
  phases: [
    { title: 'Fix', detail: 'finish interrupted fixes from saved review findings' },
    { title: 'Review', detail: 'pending first reviews (#13) and gate re-checks (#01)' },
    { title: 'Re-review', detail: 'second devil\'s-advocate pass for cases with ≥3 blockers, then one more fix if needed' },
  ],
}

const ROOT = (args && args.root) || '/Users/onderalpselcuk/works/mudafaa'
const NO_BROWSER = !!(args && args.noBrowser)

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
- Gameplay carries ~half the time: ≥3 searchable scenes (scene HTML in content/src/<slug>/scenes/*.html; PNG rendering per the browser rule below), ≥3 document puzzles, a deduction board with ≥6 recipes + decoys, interviews whose topics unlock from facts found elsewhere, testimony with press/present across both hearings, objections, a mentor consultation. Wrong moves cost something.
- Size: typical path (the main 223/2-e acquittal golden path) ≈ 13–16k words of lines (hard ceiling ~18k) and ≥200 player actions; \`npm run case:duration -- <slug>\` must report 90–120 min for the typical path and ≥60 min for every other outcome path. Total case text ≥18k words. Max ~220 chars per line.
- Golden paths for every outcome in 90-tests.json. Gates: \`npm run build\` (run \`cd apps/api && npx prisma generate\` first if needed), \`npm run case:validate -- <slug>\` PASSED with full coverage, no softlock/leak; \`npx vitest run --project content-tools --project case-schema --project engine --project validator\`; \`npm run lint\`.
- Known engine limits (work around in content; do NOT modify packages/* or apps/*): node lines show only the FIRST matching response block (chain conditional pieces via DECISION nodes); $return from nodes reachable from several pushing hubs confuses the validator's escape distance — return to the hub directly; repeatable penalty rules need maxUses; the validator doesn't read epilogue conditions.
- Files you may create/modify: content/cases/<slug>/**, content/src/<slug>/** (if the kit uses it), content/shared/sprites/<slug>-*.json (new characters only; reuse shared sprites like mentor.json/avukat.json/hakim.json/savci.json where they fit), docs/content/<slug>.md (case design: truth, chronology, evidence chain, contradictions, node map, outcomes, golden paths, measurements), docs/content/<slug>-hikaye.md (story bible), docs/legal/<slug>.md. Do NOT edit root package.json, docs/plan.md, docs/content/lineup.md or any other case.
${NO_BROWSER ? `- BROWSER RULE (server mode): this machine is a headless Debian server where Playwright/Chromium does not work reliably. Do NOT run \`npm run case:scenes\`, \`npm run case:sprite-preview\`, \`npx playwright install\` or anything that launches a browser, and do not try to work around it. Write scene HTML (content/src/<slug>/scenes/*.html, exact SceneDef width×height, design palette) and sprite JSON only; leave assets/scenes/*.png missing. The coordinator renders PNGs and does all visual/browser checks later on another machine — list every scene/sprite you created in your final concerns so they can be checked. All other gates (build, case:validate, case:duration, vitest, lint) must still pass.\n` : ''}- New character sprites: define them inline in content/src/<slug>/sprites.ts (as #01–#05 do). content/shared/sprites/ must hold only the 21 design sprites; tools/content/test/extract-sprites.test.ts enforces this.
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

const abs = (p) => (p && !p.startsWith('/') ? ROOT + '/' + p : p)
const CASES = args.items.map(c => ({ ...c, worktreePath: abs(c.worktreePath), w: c.w ? { ...c.w, worktreePath: abs(c.w.worktreePath) } : c.w }))

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


const STATE = ROOT + '/tools/content/workflows/state/review-state.json'
const LOAD_NOTE = `
Machine note: other agents run validators in parallel. If case:validate fails ONLY with SIMULATION_ABORTED / time limits, or a vitest test times out, re-run it alone with a larger budget (e.g. \`npm run case:validate -- <slug> --max-ms 3000000\`, \`npx vitest run <file> --testTimeout 600000\`) and report it as load-related; do not change content to dodge a time limit.`

const continueFixPrompt = (c, w) => `You are finishing the devil's-advocate fixes for case #${String(c.number).padStart(2, '0')} "${c.title}" (slug ${c.slug}). A previous fixer was interrupted by a machine restart; its partial work is committed (last commits may be "wip(...)" snapshots). Work in the existing git worktree ${w.worktreePath} (branch ${w.branch}): cd there for everything and commit there. Do not create a new worktree or branch.
The review findings are in ${STATE} under key "${c.slug}" → review.findings (also review.shortestAcquittalActions / typicalActions). If a "fix" entry exists there, it is the previous fixer's report.
First inspect \`git log --oneline -25\` and \`git diff\` of recent commits to see which findings are already handled; then fix EVERY remaining blocker and major (minors when cheap), and verify the ones already done really are done.
${STANDARDS}
After fixing: re-run a shortcut probe (shortest action path to each acquittal via search over enumerateActions) and confirm acquittals need the real evidence chain (≥ 60% of typical actions); re-dump the typical path lines and re-check spoilers; update golden paths and docs (docs/content/${c.slug}.md, docs/legal/${c.slug}.md); all gates green (build, case:validate PASSED, case:duration targets, the vitest projects, lint).
${LOAD_NOTE}
Return the structured result (notFixed lists every blocker/major you could not fix, with the reason).`

const reReviewPrompt = (c, w) => reviewPrompt(c, w) + `

This is a SECOND review after fixes. The first review's findings are in ${STATE} under key "${c.slug}" → review.findings. Check each blocker/major was really fixed (cite the probe or line you checked), then hunt for new problems, especially new shortcuts and spoilers introduced by the fixes.
${LOAD_NOTE}`

const verifyPrompt = (c, w) => `Verify case #${String(c.number).padStart(2, '0')} "${c.title}" (slug ${c.slug}) after its fixes. Work in ${w.worktreePath} (branch ${w.branch}); cd there. The fixer reported that gates failed ONLY because of machine load (see ${STATE} key "${c.slug}" → fix.notFixed). Run: \`npm run build\`, \`npm run case:validate -- ${c.slug} --max-ms 3000000\`, \`npm run case:duration -- ${c.slug}\`, \`npx vitest run --project content-tools --project case-schema --project engine --project validator --testTimeout 600000\`, \`npm run lint\`. If something fails for a real (non-load) reason, fix it, commit, and re-run. Also re-run a quick shortcut probe to confirm the shortest acquittal is ≥ 60% of the typical path's actions.
${STANDARDS}
Return the structured result.`

const st = (s) => s.findings ? s : null
const blockers = (r) => (r && r.findings ? r.findings.filter((x) => x.severity === 'blocker').length : 0)

const results = await pipeline(
  CASES,
  async (c) => {
    const w = { worktreePath: c.worktreePath, branch: c.branch, wordsTypical: c.wordsTypical, actionsTypical: c.actionsTypical, durationTypicalMin: c.durationTypicalMin, outcomes: [], concerns: [`Writer/fixer history: ${STATE} key "${c.slug}"`] }
    let f = null, r = null
    if (c.stage === 'verify') {
      f = await agent(verifyPrompt(c, w), { label: `verify:${c.slug}`, phase: 'Review', schema: FIX })
      return { c, w, r: null, f, needRe: false }
    }
    if (c.stage === 'review') {
      r = await agent(reviewPrompt(c, w), { label: `review:${c.slug}`, phase: 'Review', schema: REVIEW, effort: 'high' })
      if (r) log(`${c.slug}: review ${r.verdict} — ${blockers(r)} blocker`)
      if (r && (r.verdict === 'fail' || r.findings.some((x) => x.severity !== 'minor'))) f = await agent(fixPrompt(c, w, r), { label: `fix:${c.slug}`, phase: 'Fix', schema: FIX })
      return { c, w, r, f, needRe: blockers(r) >= 3 }
    }
    if (c.stage === 'fix') {
      f = await agent(continueFixPrompt(c, w), { label: `fix:${c.slug}`, phase: 'Fix', schema: FIX })
      return { c, w, r: null, f, needRe: c.blockers >= 3 }
    }
    return { c, w, r: null, f: null, needRe: true } // stage 're-review'
  },
  async (x) => {
    if (!x || !x.needRe) return x
    const r2 = await agent(reReviewPrompt(x.c, x.w), { label: `re-review:${x.c.slug}`, phase: 'Re-review', schema: REVIEW, effort: 'high' })
    if (r2) log(`${x.c.slug}: re-review ${r2.verdict} — ${blockers(r2)} blocker`)
    let f2 = null
    if (r2 && r2.verdict === 'fail') f2 = await agent(fixPrompt(x.c, x.w, r2), { label: `fix2:${x.c.slug}`, phase: 'Re-review', schema: FIX })
    return { ...x, r2, f2 }
  },
)

return results.filter(Boolean).map((x) => ({
  slug: x.c.slug,
  branch: x.w.branch,
  review: x.r && { verdict: x.r.verdict, blockers: blockers(x.r), majors: x.r.findings.filter((f) => f.severity === 'major').length, shortest: x.r.shortestAcquittalActions, typical: x.r.typicalActions },
  fix: x.f && { status: x.f.status, gates: x.f.gatesPassed, notFixed: x.f.notFixed, shortest: x.f.shortestAcquittalActions, min: x.f.durationTypicalMin },
  review2: x.r2 && { verdict: x.r2.verdict, blockers: blockers(x.r2), majors: x.r2.findings.filter((f) => f.severity === 'major').length, shortest: x.r2.shortestAcquittalActions, typical: x.r2.typicalActions, findings: x.r2.findings.filter((f) => f.severity !== 'minor').map((f) => f.severity + ': ' + f.problem) },
  fix2: x.f2 && { status: x.f2.status, gates: x.f2.gatesPassed, notFixed: x.f2.notFixed, shortest: x.f2.shortestAcquittalActions },
}))
