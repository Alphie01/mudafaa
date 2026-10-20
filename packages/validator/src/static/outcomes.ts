import type { CasePackage } from '@mudafaa/case-schema';
import { canonicalJson } from '@mudafaa/engine';
import type { CompiledCase } from '@mudafaa/engine';
import { error, info } from '../issues.js';
import type { Issue } from '../issues.js';

/** Sonuçlar: benzersiz öncelik, en sonda koşulsuz varsayılan; hukuki inceleme durumu. */
export function outcomeChecks(pkg: CasePackage, c: CompiledCase, opts: { strict?: boolean }): Issue[] {
  const out: Issue[] = [];
  const byPriority = new Map<number, string>();
  pkg.outcomes.forEach((o, i) => {
    const twin = byPriority.get(o.priority);
    if (twin !== undefined) {
      out.push(
        error('OUTCOME_PRIORITY_DUP', `outcomes[${i}].priority`, `${o.id} ile ${twin} aynı öncelikte (${o.priority})`),
      );
    } else byPriority.set(o.priority, o.id);
  });
  const last = c.outcomes[c.outcomes.length - 1];
  if (last !== undefined && canonicalJson(last.when) !== canonicalJson({ all: [] })) {
    const i = pkg.outcomes.findIndex((o) => o.id === last.id);
    out.push(
      error('OUTCOME_DEFAULT_MISSING', `outcomes[${i}].when`, `Son sonuç (${last.id}) koşulsuz ({all: []}) olmalı`),
    );
  }
  if (pkg.meta.legalReview.status !== 'APPROVED') {
    const make = opts.strict === true ? error : info;
    out.push(make('LEGAL_REVIEW_PENDING', 'meta.legalReview.status', 'Hukuki inceleme onaylanmadı'));
  }
  return out;
}
