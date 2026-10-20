import type { Action, CasePackage, ChooseResponse, StartResponse } from '@mudafaa/case-schema';
import { actionBody, type Client } from './app.js';

/** Paketteki golden path'in aksiyonları. */
export function goldenPath(pkg: CasePackage, name: string): Action[] {
  const g = pkg.tests?.goldenPaths.find((p) => p.name === name);
  if (g === undefined) throw new Error(`golden path yok: ${name}`);
  return g.actions;
}

/** `POST /cases/:id/start`; durum kodu ve gövde. */
export async function startCase(c: Client, caseId: string, restart?: boolean) {
  const res = await c.post(`/cases/${caseId}/start`, restart === undefined ? {} : { restart });
  return { status: res.status, body: res.body as StartResponse };
}

/** Aksiyonları sırayla HTTP'den oynatır (her adımın `expectedStateVersion`'ı bir önceki yanıttan); hepsi 200 olmalı. */
export async function playActions(
  c: Client,
  sessionId: string,
  stateVersion: number,
  actions: readonly Action[],
): Promise<ChooseResponse> {
  let version = stateVersion;
  let last: ChooseResponse | undefined;
  for (const [i, action] of actions.entries()) {
    const res = await c.post(`/sessions/${sessionId}/choose`, actionBody(version, action));
    if (res.status !== 200) {
      throw new Error(`${i + 1}. aksiyon ${JSON.stringify(action)} → ${res.status} ${JSON.stringify(res.body)}`);
    }
    last = res.body as ChooseResponse;
    version = last.view.session.stateVersion;
  }
  if (last === undefined) throw new Error('aksiyon yok');
  return last;
}

/** Davayı başlatıp bir yolu baştan sona oynatır. */
export async function startAndPlay(c: Client, caseId: string, actions: readonly Action[], restart?: boolean) {
  const started = await startCase(c, caseId, restart);
  const last = await playActions(c, started.body.session.id, started.body.session.stateVersion, actions);
  return { sessionId: started.body.session.id, last };
}
