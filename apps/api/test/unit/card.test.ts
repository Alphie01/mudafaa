import { describe, expect, it } from 'vitest';
import { cardStatus } from '../../src/modules/game/game.service.js';

describe('cardStatus', () => {
  it('priority: locked > in progress > completed > new', () => {
    expect(cardStatus({ locked: false })).toBe('NEW');
    expect(cardStatus({ locked: false, bestOutcomeKey: 'o_win' })).toBe('COMPLETED');
    expect(cardStatus({ locked: false, activeSessionId: 's', bestOutcomeKey: 'o_win' })).toBe('IN_PROGRESS');
    expect(cardStatus({ locked: true, activeSessionId: 's', bestOutcomeKey: 'o_win' })).toBe('LOCKED');
    expect(cardStatus({ locked: false, bestOutcomeKey: null })).toBe('NEW');
  });
});
