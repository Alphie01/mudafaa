import type { NodeDef, NodeView } from '@mudafaa/case-schema';
import { addCast, discovered, evidenceCard, holds, usedOnce } from './common.js';
import type { ViewCtx } from './common.js';

/**
 * Duruşma: kürsü, görünür ifadeler (vurgu sunucuda çözülür), TESTIMONY'de sunulabilecek bulunmuş deliller, itiraz
 * gerekçeleri ve savcılık delili.
 */
export function courtroomView(vc: ViewCtx, def: Extract<NodeDef, { type: 'COURTROOM' }>): NodeView {
  for (const b of def.stage.bench) addCast(vc, b.character);
  if (def.stage.witness !== undefined) addCast(vc, def.stage.witness);
  addCast(vc, def.stage.counsel);
  const pressed = (statementId: string): boolean =>
    vc.node.rules.PRESS.some(
      (r) => r.match !== undefined && 'statement' in r.match && r.match.statement === statementId && usedOnce(vc, r.id),
    );
  const statements =
    def.statements === undefined
      ? undefined
      : def.statements
          .filter((st) => holds(vc, st.visibleWhen))
          .sort((a, b) => a.order - b.order)
          .map((st) => ({
            id: st.id,
            segments: st.segments.map((sg) => ({
              text: sg.text,
              highlight: sg.highlightWhen !== undefined && holds(vc, sg.highlightWhen),
            })),
            pressed: pressed(st.id),
          }));
  const presentable =
    def.mode === 'TESTIMONY'
      ? [...vc.c.evidence.values()].filter((ev) => ev.presentable && discovered(vc, ev.id)).map(evidenceCard)
      : undefined;
  const grounds = def.objectionGrounds?.flatMap((id) => {
    const g = vc.c.grounds.get(id);
    return g === undefined
      ? []
      : [{ id: g.id, label: g.label, ...(g.legalBasis === undefined ? {} : { legalBasis: g.legalBasis }) }];
  });
  const prosecution = def.prosecutionEvidence === undefined ? undefined : vc.c.evidence.get(def.prosecutionEvidence);
  return {
    type: 'COURTROOM',
    id: def.id,
    mode: def.mode,
    stage: {
      banner: def.stage.banner,
      bench: def.stage.bench.map((b) => ({ characterKey: b.character, label: b.label, xFrac: b.xFrac })),
      ...(def.stage.witness === undefined ? {} : { witness: def.stage.witness }),
      counsel: def.stage.counsel,
    },
    ...(statements === undefined ? {} : { statements }),
    ...(presentable === undefined ? {} : { presentable }),
    ...(grounds === undefined ? {} : { objectionGrounds: grounds }),
    ...(prosecution === undefined ? {} : { prosecutionEvidence: evidenceCard(prosecution) }),
    ...(def.rulesText === undefined ? {} : { rulesText: def.rulesText }),
    ...(def.witnessLabel === undefined ? {} : { witnessLabel: def.witnessLabel }),
  };
}
