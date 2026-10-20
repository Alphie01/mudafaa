import type { CasePackage } from '@mudafaa/case-schema';
import type { CompiledCase } from '@mudafaa/engine';
import type { Issue } from '../issues.js';
import { consistencyChecks } from './consistency.js';
import { nodeRuleChecks } from './node-rules.js';
import { outcomeChecks } from './outcomes.js';
import { scoringChecks } from './scoring.js';
import { textChecks } from './texts.js';

/**
 * Derlenmiş bir davanın statik kontrolleri (docs/plan.md §9). Şema, yinelenen kimlik, sarkan referans ve yüklem
 * döngüsünü `compile` zaten raporlar; burada içerik kuralları denetlenir. `strict` hukuki incelemeyi zorunlu kılar.
 */
export function staticChecks(pkg: CasePackage, c: CompiledCase, opts: { strict?: boolean } = {}): Issue[] {
  return [
    ...nodeRuleChecks(pkg, c),
    ...textChecks(pkg),
    ...consistencyChecks(pkg, c),
    ...outcomeChecks(pkg, c, opts),
    ...scoringChecks(pkg, c),
  ];
}
