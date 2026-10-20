import { describe, expect, it } from 'vitest';
import { Category, Expression, Hex, Id, Rect, Tone } from '@mudafaa/case-schema';

describe('primitives', () => {
  it('Id rules', () => {
    expect(Id.safeParse('7x').success).toBe(false);
    expect(Id.safeParse('C_00').success).toBe(true);
    expect(Id.safeParse('ev_fis').success).toBe(true);
  });

  it('Id accepts 1 to 64 characters and nothing else', () => {
    expect(Id.safeParse('a').success).toBe(true);
    expect(Id.safeParse('a'.repeat(64)).success).toBe(true);
    expect(Id.safeParse('a'.repeat(65)).success).toBe(false);
    expect(Id.safeParse('').success).toBe(false);
  });

  it.each([
    ['leading underscore', '_x'],
    ['hyphen', 'ev-fis'],
    ['space', 'ev fis'],
    ['dot', 'ev.fis'],
    ['hash (reserved for variant keys)', 'ch#soft'],
    ['dollar (reserved for $stay/$return)', '$stay'],
    ['Turkish letter', 'şeker'],
    ['trailing newline', 'ev_fis\n'],
    ['number', 7],
    ['null', null],
  ])('Id rejects %s', (_name, value) => {
    expect(Id.safeParse(value).success).toBe(false);
  });

  it('Hex is a #RRGGBB colour', () => {
    expect(Hex.safeParse('#a1B2c3').success).toBe(true);
    expect(Hex.safeParse('#000000').success).toBe(true);
    for (const bad of ['#fff', 'a1b2c3', '#a1b2c3d', '#aabbccdd', '#ggg000', '', '# a1b2c']) {
      expect(Hex.safeParse(bad).success, bad).toBe(false);
    }
  });

  it('Category is exactly the six score categories', () => {
    expect(Category.options).toEqual([
      'HUKUKI_BILGI',
      'DELIL_ANALIZI',
      'ARASTIRMA',
      'SORGULAMA',
      'SAVUNMA_STRATEJISI',
      'USUL_BILGISI',
    ]);
    expect(Category.safeParse('HUKUK').success).toBe(false);
    expect(Category.safeParse('hukuki_bilgi').success).toBe(false);
  });

  it('Expression is exactly the five face expressions', () => {
    expect(Expression.options).toEqual(['normal', 'mutlu', 'kizgin', 'saskin', 'uzgun']);
    expect(Expression.safeParse('kızgın').success).toBe(false);
  });

  it('Tone is exactly the five tones', () => {
    expect(Tone.options).toEqual(['success', 'error', 'neutral', 'special', 'info']);
    expect(Tone.safeParse('warning').success).toBe(false);
  });

  it('Rect needs a non-negative integer origin and a positive integer size', () => {
    expect(Rect.safeParse({ x: 10, y: 10, w: 20, h: 20 }).success).toBe(true);
    expect(Rect.safeParse({ x: 0, y: 0, w: 1, h: 1 }).success).toBe(true);
    for (const bad of [
      { x: -1, y: 0, w: 1, h: 1 },
      { x: 0, y: -1, w: 1, h: 1 },
      { x: 0, y: 0, w: 0, h: 1 },
      { x: 0, y: 0, w: 1, h: 0 },
      { x: 0.5, y: 0, w: 1, h: 1 },
      { x: 0, y: 0, w: 1.5, h: 1 },
      { x: 0, y: 0, w: 1 },
      { x: 0, y: 0, w: 1, h: 1, z: 2 },
    ]) {
      expect(Rect.safeParse(bad).success, JSON.stringify(bad)).toBe(false);
    }
  });
});
