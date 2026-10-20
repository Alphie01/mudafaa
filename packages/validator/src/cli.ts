#!/usr/bin/env node
import { realpathSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { LoadError, ParseError, loadCase } from './load.js';
import { validatePackage } from './report.js';
import type { ValidateOptions, ValidationReport } from './report.js';

const USAGE =
  'Kullanım: mudafaa-validate <case.json | dava dizini>... [--json] [--strict] [--max-states N] [--max-ms N] [--walks N] [--walk-steps N]';

export interface Io {
  out: (text: string) => void;
  err: (text: string) => void;
}

const defaultIo: Io = {
  out: (t) => void process.stdout.write(t),
  err: (t) => void process.stderr.write(t),
};

function human(path: string, r: ValidationReport): string {
  const lines = [
    `${path}: ${r.status} — ${r.summary.errors} hata, ${r.summary.warnings} uyarı, ${r.summary.infos} bilgi`,
  ];
  const sim = r.simulation;
  if (sim !== undefined) {
    const outcomes = Object.entries(sim.outcomes)
      .map(([id, o]) => `${id} ${o.reached ? '✓' : '✗'}`)
      .join(', ');
    lines.push(
      `  simülasyon: ${sim.states} durum, ${sim.edges} geçiş, ${sim.walks} yürüyüş, BFS ${sim.complete ? 'tam' : 'kesildi'}; sonuçlar: ${outcomes}`,
    );
    const cov = sim.coverage;
    lines.push(
      `  kapsam: node ${cov.nodes.reached}/${cov.nodes.total}, seçenek ${cov.choices.reached}/${cov.choices.total}, kural ${cov.rules.reached}/${cov.rules.total}, delil ${cov.evidence.reached}/${cov.evidence.total}`,
    );
  }
  if (r.goldenPaths !== undefined) {
    lines.push(`  golden path: ${r.goldenPaths.filter((g) => g.passed).length}/${r.goldenPaths.length}`);
  }
  for (const i of r.issues) lines.push(`  ${i.severity} ${i.code} ${i.path}: ${i.message}`);
  return `${lines.join('\n')}\n`;
}

/** CLI: 0 hepsi PASSED, 1 en az biri FAILED, 2 kullanım ya da dosya hatası. */
export async function main(argv: readonly string[], io: Io = defaultIo): Promise<number> {
  const paths: string[] = [];
  const opts: ValidateOptions = {};
  let json = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i] ?? '';
    if (arg === '--json') json = true;
    else if (arg === '--strict') opts.strict = true;
    else if (arg === '--max-states' || arg === '--max-ms' || arg === '--walks' || arg === '--walk-steps') {
      const n = Number(argv[++i]);
      if (!Number.isInteger(n) || n <= 0) {
        io.err(`${arg} pozitif tamsayı ister\n${USAGE}\n`);
        return 2;
      }
      if (arg === '--max-states') opts.maxStates = n;
      else if (arg === '--walks') opts.walks = n;
      else if (arg === '--walk-steps') opts.walkSteps = n;
      else opts.maxMs = n;
    } else if (arg.startsWith('--')) {
      io.err(`Bilinmeyen seçenek: ${arg}\n${USAGE}\n`);
      return 2;
    } else paths.push(arg);
  }
  if (paths.length === 0) {
    io.err(`${USAGE}\n`);
    return 2;
  }
  const reports: { path: string; report: ValidationReport }[] = [];
  for (const path of paths) {
    let report: ValidationReport;
    try {
      report = validatePackage(await loadCase(path), opts);
    } catch (e) {
      if (e instanceof LoadError) {
        io.err(`${e.message}\n`);
        return 2;
      }
      // Ayrıştırma hatası içerik hatasıdır; beklenmeyen bir iç hata da rapora girer (çıkış 1, yığın izi yok).
      const code = e instanceof ParseError ? 'SCHEMA' : 'INTERNAL_ERROR';
      report = {
        status: 'FAILED',
        engineVersion: 0,
        summary: { errors: 1, warnings: 0, infos: 0 },
        issues: [{ severity: 'ERROR', code, path: '', message: e instanceof Error ? e.message : String(e) }],
      };
    }
    reports.push({ path, report });
  }
  if (json) io.out(`${JSON.stringify(reports.length === 1 ? reports[0]?.report : reports, null, 2)}\n`);
  else for (const { path, report } of reports) io.out(human(path, report));
  return reports.every((r) => r.report.status === 'PASSED') ? 0 : 1;
}

const entry = process.argv[1];
if (entry !== undefined && import.meta.url === pathToFileURL(realpathSync(entry)).href) {
  main(process.argv.slice(2)).then(
    (code) => {
      process.exitCode = code;
    },
    (e: unknown) => {
      process.stderr.write(`${e instanceof Error ? (e.stack ?? e.message) : String(e)}\n`);
      process.exitCode = 2;
    },
  );
}
