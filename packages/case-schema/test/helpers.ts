import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import type { z } from 'zod';

// package / view testlerinin ortak yardımcıları (entities.test.ts ile aynı kalıplar). Dosya adı `.test.ts` ile
// bitmediği için Vitest bunu test dosyası olarak çalıştırmaz.

export type Case = [name: string, value: unknown];

/** JSON klonu: örnekler yalnızca JSON değerleri içerir. */
export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/** Tablodaki her değer şemadan değişmeden geçmeli: şema alan eklemez, düşürmez, dönüştürmez. */
export const acceptsUnchanged = (schema: z.ZodType, cases: Case[]) =>
  it.each(cases)('accepts %s unchanged', (_name, value) => {
    const result = schema.safeParse(value);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(value);
  });

export const rejects = (schema: z.ZodType, cases: Case[]) =>
  it.each(cases)('rejects %s', (_name, value) => {
    expect(schema.safeParse(value).success).toBe(false);
  });

export const issuesOf = (schema: z.ZodType, value: unknown) => {
  const result = schema.safeParse(value);
  return result.success ? [] : result.error.issues;
};

export const pathsOf = (schema: z.ZodType, value: unknown) =>
  issuesOf(schema, value).map((issue) => issue.path.join('.'));

/** Örneğin kopyasında noktalı yoldaki değeri değiştirir; dizi indisleri de yoldur. */
export const withValueAt = (sample: unknown, path: string, value: unknown) => {
  const copy = clone(sample) as Record<string, unknown>;
  const keys = path.split('.');
  let parent = copy;
  for (const key of keys.slice(0, -1)) parent = parent[key] as Record<string, unknown>;
  parent[keys[keys.length - 1] as string] = value;
  return copy;
};

/**
 * Kimlik tipli alanlar: örnekteki değer geçersiz bir kimlikle değiştirilir ve hata tam o yolda raporlanmalıdır
 * (alan serbest metne gevşetilirse bu testler kırılır).
 */
export const rejectsInvalidIdAt = (schema: z.ZodType, sample: unknown, paths: string[]) =>
  it.each(paths)('rejects an invalid id at %s', (path) => {
    expect(schema.safeParse(sample).success).toBe(true);
    expect(pathsOf(schema, withValueAt(sample, path, 'not an id'))).toContain(path);
  });

export const turkish = '“Sokak lambası yanıyordu” — İ ı ş ğ −150';

/** Depodaki mini-case fikstürü, ham JSON olarak (her çağrıda yeni bir kopya). */
export const loadMiniCase = (): Record<string, unknown> =>
  JSON.parse(readFileSync(join(import.meta.dirname, '..', 'fixtures', 'mini-case.json'), 'utf8')) as Record<
    string,
    unknown
  >;
