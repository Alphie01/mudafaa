// Sözleşme fikstürleri: mini-case'te her node türü için bir SessionView üretir. Flutter sözleşme testleri bu dosyaları
// `fromJson` ile ayrıştırır. Yeniden üretmek için: `npm run build && node packages/engine/scripts/export-view-fixtures.ts`
// (Node tipleri kendisi ayıklar; `@mudafaa/engine` paketin derlenmiş dist'ine çözülür). Testler aynı fonksiyonla
// bellekte üretip dosyalarla karşılaştırır.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Action, SessionView } from '@mudafaa/case-schema';
import mini from '@mudafaa/case-schema/fixtures/mini-case.json' with { type: 'json' };
import { act, compile, start, view } from '@mudafaa/engine';

const choose = (choiceId: string, variant?: string): Action =>
  variant === undefined ? { kind: 'CHOOSE', choiceId } : { kind: 'CHOOSE', choiceId, variant };

/** Fikstür adı → başlangıçtan oynatılacak aksiyonlar. */
function scenarios(win: readonly Action[]): Record<string, readonly Action[]> {
  return {
    story: [],
    investigation: win.slice(0, 1),
    dialogue: [choose('ch_str_a'), choose('ch_go_talk'), choose('tp_night', 'soft')],
    scene: win.slice(0, 3),
    document: [choose('ch_str_a'), choose('ch_go_doc'), { kind: 'EXAMINE', tool: 'uv', target: 'r2' }],
    deduction: win.slice(0, 7),
    'courtroom-testimony': win.slice(0, 10),
    'courtroom-objection': win.slice(0, 11),
    choice: win.slice(0, 12),
    evidence: win.slice(0, 13),
    result: win,
  };
}

export function buildViewFixtures(): Record<string, SessionView> {
  const compiled = compile(mini);
  if (!compiled.ok) throw new Error(`mini-case derlenemedi: ${JSON.stringify(compiled.issues)}`);
  const c = compiled.c;
  const win = c.pkg.tests?.goldenPaths.find((g) => g.name === 'gp_win')?.actions;
  if (win === undefined) throw new Error('mini-case gp_win golden path yok');
  const out: Record<string, SessionView> = {};
  for (const [name, actions] of Object.entries(scenarios(win))) {
    let s = start(c).state;
    for (const a of actions) {
      const r = act(c, s, a);
      if (!r.ok) throw new Error(`${name}: ${JSON.stringify(a)} reddedildi (${r.code})`);
      s = r.state;
    }
    out[name] = view(c, s, { sessionId: 'ses_fixture', caseId: 'case_mini', stateVersion: s.seq, mode: 'NORMAL' });
  }
  return out;
}

export const FIXTURE_DIR = fileURLToPath(new URL('../fixtures/views/', import.meta.url));

if (process.argv[1] !== undefined && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  mkdirSync(FIXTURE_DIR, { recursive: true });
  for (const [name, v] of Object.entries(buildViewFixtures())) {
    writeFileSync(`${FIXTURE_DIR}${name}.json`, `${JSON.stringify(v, null, 2)}\n`);
  }
  console.log(`görünüm fikstürleri yazıldı: ${FIXTURE_DIR}`);
}
