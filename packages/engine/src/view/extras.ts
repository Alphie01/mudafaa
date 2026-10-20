import type { CharactersResponse, EvidenceListResponse, ScenesResponse } from '@mudafaa/case-schema';
import { evalCond } from '../expr/eval.js';
import { getOwn } from '../own.js';
import { objectRect } from '../resolve/hit-test.js';
import type { CompiledCase, SessionState } from '../types.js';
import { clueCard, evidenceCard } from './common.js';
import type { ViewMeta } from './common.js';

// Oturum okuma uçlarının (delil çantası, olay yerleri, kadro) saf görünümleri. `view()` ile aynı sızıntı kuralları:
// yalnızca bulunmuş deliller ve nesneler, tanışılmış karakterler; koşul ve yazar notu gitmez.

/** Delil çantası ve not defteri: `view()`'in `bag`/`notebook` kurallarıyla, toplam sayılar olmadan. */
export function sessionEvidence(c: CompiledCase, s: SessionState): EvidenceListResponse {
  const found = (id: string): boolean => getOwn(s.evidence, id) !== undefined;
  const all = [...c.evidence.values()];
  return {
    bag: all.filter((ev) => ev.kind !== 'CLUE' && ev.countsInBag && found(ev.id)).map(evidenceCard),
    notebook: all.filter((ev) => ev.kind === 'CLUE' && found(ev.id)).map(clueCard),
  };
}

/** `unlockWhen` koşulu tutan olay yerleri; her birinde yalnızca bulunan nesneler (sınır dikdörtgeniyle). */
export function sessionScenes(c: CompiledCase, s: SessionState, assetUrl?: ViewMeta['assetUrl']): ScenesResponse {
  const ctx = { c, s };
  return {
    scenes: c.pkg.scenes
      .filter((scene) => scene.unlockWhen === undefined || evalCond(scene.unlockWhen, ctx))
      .map((scene) => {
        const asset = c.pkg.assets.find((a) => a.id === scene.image);
        const path = asset?.path ?? scene.image;
        return {
          id: scene.id,
          title: scene.title,
          ...(scene.description === undefined ? {} : { description: scene.description }),
          imageUrl: assetUrl === undefined ? path : assetUrl({ id: scene.image, path }),
          width: scene.width,
          height: scene.height,
          found: scene.objects
            .filter((o) => getOwn(s.found, o.id) !== undefined)
            .map((o) => ({
              objectId: o.id,
              rect: objectRect(scene, o),
              label: o.feedback.short,
              ...(o.badge === undefined ? {} : { badge: o.badge }),
            })),
        };
      }),
  };
}

/** Tanışılan karakterler (`s.characters`), paket sırasıyla. */
export function sessionCharacters(c: CompiledCase, s: SessionState): CharactersResponse {
  return {
    characters: c.pkg.characters.flatMap((ch) => {
      const sp = c.sprites.get(ch.spriteId);
      if (getOwn(s.characters, ch.id) === undefined || sp === undefined) return [];
      return [
        {
          id: ch.id,
          name: ch.name,
          shortLabel: ch.shortLabel,
          role: ch.role,
          accent: ch.accent,
          sprite: {
            rows: [...sp.rows],
            ...(sp.skin === undefined ? {} : { skin: sp.skin }),
            ...(sp.noEyes === undefined ? {} : { noEyes: sp.noEyes }),
            ...(sp.noMouth === undefined ? {} : { noMouth: sp.noMouth }),
          },
        },
      ];
    }),
  };
}
