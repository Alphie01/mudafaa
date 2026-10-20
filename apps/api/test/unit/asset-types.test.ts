import { describe, expect, it } from 'vitest';
import { isAllowedMime, sniffMime } from '../../src/common/asset-types.js';

describe('asset types', () => {
  it('sniffs PNG, JPEG and WebP by magic bytes', () => {
    expect(sniffMime(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]))).toBe('image/png');
    expect(sniffMime(Buffer.from([0xff, 0xd8, 0xff, 0xdb]))).toBe('image/jpeg');
    expect(sniffMime(Buffer.from('RIFF\0\0\0\0WEBPVP8 '))).toBe('image/webp');
    expect(sniffMime(Buffer.from('RIFF\0\0\0\0WAVE'))).toBeNull();
    expect(sniffMime(Buffer.from('<svg/>'))).toBeNull();
    expect(sniffMime(Buffer.alloc(0))).toBeNull();
  });

  it('allowlist excludes script-capable types', () => {
    expect(isAllowedMime('image/png')).toBe(true);
    for (const m of ['text/html', 'image/svg+xml', 'application/xml', null, undefined]) {
      expect(isAllowedMime(m)).toBe(false);
    }
  });
});
