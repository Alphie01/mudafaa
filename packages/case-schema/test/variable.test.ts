import { describe, expect, it } from 'vitest';
import { VariableDef, VariableWidget } from '@mudafaa/case-schema';

const issuesOf = (value: unknown) => {
  const result = VariableDef.safeParse(value);
  return result.success ? [] : result.error.issues;
};

const validVariables: [name: string, value: unknown][] = [
  [
    'a bounded visible int with a widget',
    {
      id: 'trust',
      type: 'int',
      initial: 50,
      min: 0,
      max: 100,
      visibility: 'VISIBLE',
      display: { label: 'Güven', widget: 'percentBar', max: 100, lowAt: 20, format: '%{v}' },
    },
  ],
  [
    'an analysis resource',
    { id: 'taps', type: 'int', initial: 3, min: 0, max: 3, visibility: 'VISIBLE', analysis: 'resource' },
  ],
  ['an unbounded hidden counter', { id: 'wrong', type: 'int', initial: 0, visibility: 'HIDDEN', analysis: 'counter' }],
  ['an int with only a lower bound', { id: 'visits', type: 'int', initial: 0, min: 0, visibility: 'HIDDEN' }],
  ['an int with only an upper bound', { id: 'pers', type: 'int', initial: 2, max: 10, visibility: 'VISIBLE' }],
  ['a negative int range', { id: 'delta', type: 'int', initial: -5, min: -10, max: -1, visibility: 'HIDDEN' }],
  ['a bool flag', { id: 'cokus', type: 'bool', initial: false, visibility: 'HIDDEN' }],
  [
    'an enum whose initial is listed',
    {
      id: 'strategy',
      type: 'enum',
      initial: 'USUL',
      enumValues: ['MASUMIYET', 'USUL', 'INDIRIM'],
      visibility: 'HIDDEN',
    },
  ],
  ['a single-member enum', { id: 'tone', type: 'enum', initial: 'soft', enumValues: ['soft'], visibility: 'VISIBLE' }],
];

describe('VariableDef', () => {
  it('VariableDef int bounds', () => {
    const result = VariableDef.safeParse({
      id: 'cred',
      type: 'int',
      initial: 6,
      min: 0,
      max: 5,
      visibility: 'VISIBLE',
    });
    expect(result.success).toBe(false);
    const issues = result.error?.issues ?? [];
    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toContain('initial');
    expect(issues[0]?.path).toEqual(['initial']);
  });

  it('VariableDef enum initial must be listed', () => {
    const result = VariableDef.safeParse({
      id: 'strategy',
      type: 'enum',
      initial: 'X',
      enumValues: ['MASUMIYET', 'USUL', 'INDIRIM'],
      visibility: 'HIDDEN',
    });
    expect(result.success).toBe(false);
    const issues = result.error?.issues ?? [];
    expect(issues).toHaveLength(1);
    expect(issues[0]?.message).toContain('initial');
    expect(issues[0]?.path).toEqual(['initial']);
  });

  it.each(validVariables)('accepts %s unchanged', (_name, value) => {
    const result = VariableDef.safeParse(value);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(value);
  });

  it('keeps the bounds inclusive', () => {
    const def = { id: 'cred', type: 'int', min: 0, max: 5, visibility: 'VISIBLE' };
    expect(VariableDef.safeParse({ ...def, initial: 0 }).success).toBe(true);
    expect(VariableDef.safeParse({ ...def, initial: 5 }).success).toBe(true);
    expect(issuesOf({ ...def, initial: -1 })[0]?.message).toContain('initial');
    expect(issuesOf({ ...def, initial: 6 })[0]?.message).toContain('initial');
  });

  it('applies a single bound on its own', () => {
    expect(issuesOf({ id: 'a', type: 'int', initial: -1, min: 0, visibility: 'HIDDEN' })).toHaveLength(1);
    expect(issuesOf({ id: 'a', type: 'int', initial: 11, max: 10, visibility: 'HIDDEN' })).toHaveLength(1);
  });

  it('rejects a lower bound above the upper bound', () => {
    const issues = issuesOf({ id: 'a', type: 'int', initial: 3, min: 5, max: 1, visibility: 'HIDDEN' });
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.some((i) => i.path.join('.') === 'max' || i.path.join('.') === 'min')).toBe(true);
  });

  it.each([
    ['int with a fractional initial', { id: 'a', type: 'int', initial: 2.5, visibility: 'HIDDEN' }],
    ['int with a string initial', { id: 'a', type: 'int', initial: '3', visibility: 'HIDDEN' }],
    ['int with a boolean initial', { id: 'a', type: 'int', initial: true, visibility: 'HIDDEN' }],
    ['bool with a numeric initial', { id: 'a', type: 'bool', initial: 0, visibility: 'HIDDEN' }],
    ['bool with a string initial', { id: 'a', type: 'bool', initial: 'false', visibility: 'HIDDEN' }],
    [
      'enum with a numeric initial',
      { id: 'a', type: 'enum', initial: 1, enumValues: ['a', 'b'], visibility: 'HIDDEN' },
    ],
  ])('rejects %s and blames initial', (_name, value) => {
    const issues = issuesOf(value);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues.every((i) => i.message.includes('initial'))).toBe(true);
    expect(issues.every((i) => i.path.join('.') === 'initial')).toBe(true);
  });

  it.each([
    ['enum without enumValues', { id: 'a', type: 'enum', initial: 'x', visibility: 'HIDDEN' }],
    ['enum with empty enumValues', { id: 'a', type: 'enum', initial: 'x', enumValues: [], visibility: 'HIDDEN' }],
    [
      'enum with duplicate enumValues',
      { id: 'a', type: 'enum', initial: 'x', enumValues: ['x', 'y', 'x'], visibility: 'HIDDEN' },
    ],
    ['enum with an empty member', { id: 'a', type: 'enum', initial: 'x', enumValues: ['x', ''], visibility: 'HIDDEN' }],
    ['enum with min', { id: 'a', type: 'enum', initial: 'x', enumValues: ['x'], min: 0, visibility: 'HIDDEN' }],
    ['int with enumValues', { id: 'a', type: 'int', initial: 1, enumValues: ['x'], visibility: 'HIDDEN' }],
    ['bool with enumValues', { id: 'a', type: 'bool', initial: true, enumValues: ['x'], visibility: 'HIDDEN' }],
    ['bool with min', { id: 'a', type: 'bool', initial: true, min: 0, visibility: 'HIDDEN' }],
    ['bool with max', { id: 'a', type: 'bool', initial: true, max: 1, visibility: 'HIDDEN' }],
  ])('rejects %s', (_name, value) => {
    expect(VariableDef.safeParse(value).success).toBe(false);
  });

  it.each([
    ['missing id', { type: 'int', initial: 0, visibility: 'HIDDEN' }],
    ['invalid id', { id: '7x', type: 'int', initial: 0, visibility: 'HIDDEN' }],
    ['missing type', { id: 'a', initial: 0, visibility: 'HIDDEN' }],
    ['unknown type', { id: 'a', type: 'float', initial: 0, visibility: 'HIDDEN' }],
    ['missing initial', { id: 'a', type: 'int', visibility: 'HIDDEN' }],
    ['missing visibility', { id: 'a', type: 'int', initial: 0 }],
    ['unknown visibility', { id: 'a', type: 'int', initial: 0, visibility: 'SECRET' }],
    ['unknown analysis', { id: 'a', type: 'int', initial: 0, visibility: 'HIDDEN', analysis: 'gauge' }],
    ['fractional min', { id: 'a', type: 'int', initial: 1, min: 0.5, visibility: 'HIDDEN' }],
    ['unknown key', { id: 'a', type: 'int', initial: 0, visibility: 'HIDDEN', extra: 1 }],
    ['null', null],
  ])('rejects %s', (_name, value) => {
    expect(VariableDef.safeParse(value).success).toBe(false);
  });

  describe('display', () => {
    const def = { id: 'cred', type: 'int', initial: 3, min: 0, max: 5, visibility: 'VISIBLE' };

    it('VariableWidget is exactly the eight widgets and display.widget reuses it', () => {
      expect(VariableWidget.options).toEqual([
        'meter10',
        'hearts',
        'percentBar',
        'minutes',
        'pips',
        'counter',
        'score',
        'label',
      ]);
      expect(VariableWidget.safeParse('gauge').success).toBe(false);
      expect(VariableDef.shape.display.unwrap().shape.widget).toBe(VariableWidget);
    });

    it.each(['meter10', 'hearts', 'percentBar', 'minutes', 'pips', 'counter', 'score', 'label'])(
      'accepts the %s widget',
      (widget) => {
        expect(VariableDef.safeParse({ ...def, display: { label: 'Kalp', widget } }).success).toBe(true);
      },
    );

    it.each([
      ['an unknown widget', { label: 'Kalp', widget: 'gauge' }],
      ['no widget', { label: 'Kalp' }],
      ['no label', { widget: 'hearts' }],
      ['a fractional max', { label: 'Kalp', widget: 'hearts', max: 2.5 }],
      ['a zero max', { label: 'Kalp', widget: 'hearts', max: 0 }],
      ['a fractional lowAt', { label: 'Kalp', widget: 'hearts', lowAt: 0.5 }],
      ['a non-string format', { label: 'Kalp', widget: 'hearts', format: 1 }],
      ['an unknown key', { label: 'Kalp', widget: 'hearts', color: '#ff0000' }],
    ])('rejects a display with %s', (_name, display) => {
      expect(VariableDef.safeParse({ ...def, display }).success).toBe(false);
    });

    it('keeps Turkish labels byte for byte', () => {
      const label = 'Güvenilirlik — İnandırıcılık ğ ş ı';
      const result = VariableDef.parse({ ...def, display: { label, widget: 'hearts' } });
      expect(result.display?.label).toBe(label);
    });
  });
});
