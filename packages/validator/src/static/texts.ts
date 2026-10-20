import type { CasePackage, Line } from '@mudafaa/case-schema';
import { error } from '../issues.js';
import type { Issue } from '../issues.js';
import { allEffects } from '../walk.js';

/** Boş metinler: etiketler, satırlar, ifade parçaları, sonuç metinleri, geri bildirimler, delil ve karakter adları. */
export function textChecks(pkg: CasePackage): Issue[] {
  const out: Issue[] = [];
  const need = (text: string | undefined, path: string, what: string): void => {
    if (text !== undefined && text.trim() === '') out.push(error('MISSING_TEXT', path, `${what} boş`));
  };
  const lines = (ls: readonly Line[] | undefined, path: string): void =>
    ls?.forEach((l, k) => need(l.text, `${path}[${k}].text`, 'satır metni'));

  pkg.characters.forEach((ch, i) => need(ch.name, `characters[${i}].name`, 'karakter adı'));
  pkg.evidence.forEach((ev, i) => {
    need(ev.title, `evidence[${i}].title`, 'delil başlığı');
    need(ev.shortText, `evidence[${i}].shortText`, 'delil özeti');
    need(ev.description, `evidence[${i}].description`, 'delil açıklaması');
  });
  pkg.nodes.forEach((n, i) => {
    const b = `nodes[${i}]`;
    n.lines?.forEach((blk, k) => lines(blk.lines, `${b}.lines[${k}].lines`));
    if ((n.type === 'CHOICE' || n.type === 'EVIDENCE') && n.prompt !== undefined)
      need(n.prompt.text, `${b}.prompt.text`, 'soru metni');
    n.choices.forEach((ch, j) => {
      const cp = `${b}.choices[${j}]`;
      if (ch.kind === 'OPTION' || ch.kind === 'TOPIC' || ch.kind === 'NAVIGATE' || ch.kind === 'CONTINUE') {
        need(ch.label ?? '', `${cp}.label`, 'seçenek etiketi');
      }
      need(ch.quality?.feedback, `${cp}.quality.feedback`, 'kalite geri bildirimi');
      ch.responses?.forEach((r, k) => lines(r.lines, `${cp}.responses[${k}].lines`));
      ch.variants?.forEach((v, vi) => {
        need(v.label, `${cp}.variants[${vi}].label`, 'varyant etiketi');
        need(v.quality?.feedback, `${cp}.variants[${vi}].quality.feedback`, 'kalite geri bildirimi');
        v.responses?.forEach((r, k) => lines(r.lines, `${cp}.variants[${vi}].responses[${k}].lines`));
      });
    });
    if (n.type === 'COURTROOM') {
      n.statements?.forEach((st, k) =>
        st.segments.forEach((sg, m) => need(sg.text, `${b}.statements[${k}].segments[${m}].text`, 'ifade parçası')),
      );
    }
  });
  pkg.outcomes.forEach((o, i) => {
    const p = `outcomes[${i}]`;
    need(o.stamp, `${p}.stamp`, 'sonuç damgası');
    need(o.sentence, `${p}.sentence`, 'ceza metni');
    need(o.verdictText, `${p}.verdictText`, 'hüküm metni');
    need(o.legalBasis, `${p}.legalBasis`, 'hukuki dayanak');
    need(o.howToReach, `${p}.howToReach`, '"nasıl ulaşılır" metni');
    o.reasoning.forEach((r, k) => need(r.text, `${p}.reasoning[${k}].text`, 'gerekçe'));
  });
  pkg.report.hints.forEach((h, i) => need(h.text, `report.hints[${i}].text`, 'rapor ipucu'));
  for (const { effect, path } of allEffects(pkg)) {
    if (effect.type === 'MARK') need(effect.feedback, `${path}.feedback`, 'MARK geri bildirimi');
  }
  return out;
}
