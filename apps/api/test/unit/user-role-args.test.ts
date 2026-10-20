import { describe, expect, it } from 'vitest';
import { parseArgs } from '../../src/cli/user-role.js';

describe('user:role arguments', () => {
  it('resolves by uid by default and needs --yes to apply', () => {
    expect(parseArgs(['abc123', 'ADMIN'])).toEqual({ ref: { by: 'uid', value: 'abc123' }, role: 'ADMIN', yes: false });
    expect(parseArgs(['abc123', 'EDITOR', '--yes'])).toEqual({
      ref: { by: 'uid', value: 'abc123' },
      role: 'EDITOR',
      yes: true,
    });
  });

  it('uses e-mail only behind an explicit flag', () => {
    expect(parseArgs(['--email', 'a@b.c', 'PLAYER', '--yes'])).toEqual({
      ref: { by: 'email', value: 'a@b.c' },
      role: 'PLAYER',
      yes: true,
    });
  });

  it('rejects malformed input', () => {
    expect(parseArgs([])).toBeNull();
    expect(parseArgs(['abc'])).toBeNull();
    expect(parseArgs(['abc', 'ROOT'])).toBeNull();
    expect(parseArgs(['--email'])).toBeNull();
    expect(parseArgs(['--email', 'a@b.c'])).toBeNull();
    expect(parseArgs(['abc', 'ADMIN', '--force'])).toBeNull();
    expect(parseArgs(['abc', 'ADMIN', 'extra'])).toBeNull();
  });
});
