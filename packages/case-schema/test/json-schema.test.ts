import { describe, expect, it } from 'vitest';
import { CASE_FORMAT, CasePackage, casePackageJsonSchema } from '@mudafaa/case-schema';

type JsonObject = Record<string, unknown>;

describe('casePackageJsonSchema', () => {
  it('json schema exports object root', () => {
    expect(casePackageJsonSchema().type).toBe('object');
  });

  it('is a draft 2020-12 schema', () => {
    expect(casePackageJsonSchema().$schema).toBe('https://json-schema.org/draft/2020-12/schema');
  });

  it('pins the content format and closes the root object', () => {
    const schema = casePackageJsonSchema();
    const properties = schema.properties as JsonObject;
    expect((properties.format as JsonObject).const).toBe(CASE_FORMAT);
    expect(schema.additionalProperties).toBe(false);
  });

  it('lists the same top-level properties as the Zod schema, with tests optional', () => {
    const schema = casePackageJsonSchema();
    const keys = Object.keys(CasePackage.shape);
    expect(Object.keys(schema.properties as JsonObject)).toEqual(keys);
    expect(schema.required).toEqual(keys.filter((key) => key !== 'tests'));
  });

  it('keeps recursive expressions as references instead of expanding them', () => {
    const text = JSON.stringify(casePackageJsonSchema());
    expect(text).toContain('"$ref"');
    expect(text.length).toBeLessThan(5_000_000);
  });

  it('is plain JSON and stable across calls', () => {
    const first = casePackageJsonSchema();
    expect(JSON.parse(JSON.stringify(first))).toEqual(first);
    expect(casePackageJsonSchema()).toEqual(first);
  });

  it('returns a fresh object on every call', () => {
    const first = casePackageJsonSchema();
    (first.properties as JsonObject).format = { const: 'tampered' };
    const second = casePackageJsonSchema();
    expect(((second.properties as JsonObject).format as JsonObject).const).toBe(CASE_FORMAT);
  });
});
