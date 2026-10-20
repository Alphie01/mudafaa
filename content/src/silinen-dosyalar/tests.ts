import { TYPICAL_PATH, goldenPath, step } from '../../../tools/content/src/kit/index.js';
import type { Action, CasePart, Rect } from '../../../tools/content/src/kit/index.js';
import * as S from './scenes.js';

// 99-tests: her sonuç için golden path. Adımlar kısa yazımla: "c SEÇENEK [varyant]", "t OB_NESNE", "e alet satır",
// "m kart1 kart2", "p ifade", "s delil [ifade]", "o gerekçe [ifade]".

const RECTS: Record<string, Rect> = Object.fromEntries(
  Object.entries(S)
    .filter(([k]) => k.startsWith('OB_'))
    .map(([k, v]) => [k, (v as { rect: Rect }).rect]),
);

function A(src: string): Action[] {
  return src
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '' && !l.startsWith('//'))
    .map((l) => {
      const [k, a, b] = l.split(/\s+/);
      switch (k) {
        case 'c':
          return step.choose(a as string, b);
        case 't': {
          const r = RECTS[a as string];
          if (r === undefined) throw new Error(`Bilinmeyen nesne: ${a}`);
          return step.tapCenter(r);
        }
        case 'e':
          return step.examine(a as string, b as string);
        case 'm':
          return step.combine(a as string, b as string);
        case 'p':
          return step.press(a as string);
        case 's':
          return step.present(a as string, b);
        case 'o':
          return step.object(a as string, b);
        default:
          throw new Error(`Bilinmeyen adım: ${l}`);
      }
    });
}

export const MEASURED = { G1: 13000, TIPIK: 13000, G3: 9000, G4: 9000, ETIK: 9000, W: 9000 };

const win = (outcome: string, final: number) =>
  final < 0 ? { outcome, finalMax: 0 } : { outcome, finalMin: Math.floor(final * 0.9), finalMax: Math.ceil(final * 1.1) };

// Golden path adımları self-check sonrası doldurulacak.
const STUB = A(`c PR00_DEVAM`);

export const tests: CasePart = {
  tests: {
    goldenPaths: [goldenPath(TYPICAL_PATH, win('BERAAT_E', MEASURED.TIPIK), STUB)],
  },
};
