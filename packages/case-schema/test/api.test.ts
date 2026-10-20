import { describe, expect, it } from 'vitest';
import { ActionRequest, CaseCard, ErrorEnvelope, ProfilePatch, PurchaseRequest, ScoreResponse } from '../src/index.js';

const uuid = '0190f000-0000-7000-8000-000000000001';
const sprite = { rows: Array.from({ length: 20 }, () => '................') };

describe('api DTOs', () => {
  it('parse valid examples', () => {
    expect(ErrorEnvelope.parse({ message: 'x', error: 'not_found', requestId: 'r' })).toBeTruthy();
    expect(
      ActionRequest.parse({ clientActionId: uuid, expectedStateVersion: 0, action: { kind: 'CHOOSE', choiceId: 'c' } }),
    ).toBeTruthy();
    const card = {
      id: uuid,
      slug: 's',
      number: 7,
      title: 'T',
      crimeLabel: 'C',
      lawRef: 'TCK 141',
      possibleSentence: '1–3 yıl',
      difficulty: 3,
      category: { key: 'CEZA', label: 'Ceza Hukuku' },
      estimatedMinutes: 100,
      summary: 'Ö',
      cover: { name: 'K', accent: '#aabbcc', sprite },
      status: 'NEW',
      access: 'PAID_LOCKED',
      legalReviewPending: false,
    };
    expect(CaseCard.parse(card)).toBeTruthy();
    expect(CaseCard.safeParse({ ...card, status: 'DONE' }).success).toBe(false);
    expect(ScoreResponse.parse({ status: 'ACTIVE', raw: 10 })).toBeTruthy();
    expect(ProfilePatch.parse({ displayName: ' Av. Elif ' }).displayName).toBe('Av. Elif');
  });

  it('purchase request: dava_kilidi needs a caseId, premium does not', () => {
    const base = { platform: 'ANDROID', token: 't' };
    expect(PurchaseRequest.safeParse({ ...base, productId: 'dava_kilidi' }).success).toBe(false);
    expect(PurchaseRequest.safeParse({ ...base, productId: 'dava_kilidi', caseId: uuid }).success).toBe(true);
    expect(PurchaseRequest.safeParse({ ...base, productId: 'premium_aylik' }).success).toBe(true);
    expect(PurchaseRequest.safeParse({ ...base, productId: 'baska' }).success).toBe(false);
    expect(PurchaseRequest.safeParse({ ...base, platform: 'WEB', productId: 'premium_aylik' }).success).toBe(false);
  });

  it('reject invalid action requests', () => {
    expect(
      ActionRequest.safeParse({
        clientActionId: 'nope',
        expectedStateVersion: 0,
        action: { kind: 'CHOOSE', choiceId: 'c' },
      }).success,
    ).toBe(false);
    expect(
      ActionRequest.safeParse({
        clientActionId: uuid,
        expectedStateVersion: -1,
        action: { kind: 'CHOOSE', choiceId: 'c' },
      }).success,
    ).toBe(false);
  });
});
