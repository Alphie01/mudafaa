import { randomBytes } from 'node:crypto';
import { readdirSync } from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { AssetStore } from '../../src/modules/content/asset.store.js';
import { bootstrapApp, type TestApp } from './support/app.js';

// İçerik adresli varlık deposu ve herkese açık `GET /v1/assets/:sha256`.
describe('assets', () => {
  let t: TestApp;

  beforeAll(async () => {
    t = await bootstrapApp();
  });
  afterAll(() => t?.close());

  it('assets are content addressed', async () => {
    const store = t.app.get(AssetStore);
    const bytes = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47]), randomBytes(64)]);
    const a = await store.put(bytes, 'image/png');
    const b = await store.put(Buffer.from(bytes), 'image/png');
    expect(b).toEqual(a);
    expect(readdirSync(store.dir).filter((f) => f === a.sha256)).toHaveLength(1);

    const res = await t
      .http()
      .get(`/v1/assets/${a.sha256}`)
      .buffer(true)
      .parse((r, cb) => {
        const chunks: Buffer[] = [];
        r.on('data', (c: Buffer) => chunks.push(c));
        r.on('end', () => cb(null, Buffer.concat(chunks)));
      });
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('image/png');
    expect(res.headers['cache-control']).toBe('public, max-age=31536000, immutable');
    expect(Buffer.compare(res.body as Buffer, bytes)).toBe(0);
  });

  it('non-allowlisted types are served as attachments with nosniff and a sandbox CSP', async () => {
    const store = t.app.get(AssetStore);
    // Eski bir depo kaydını taklit eder: yan dosyada text/html yazıyor.
    const { sha256 } = await store.put(Buffer.from(`<script>alert(${Date.now()})</script>`), 'text/html');
    const res = await t.http().get(`/v1/assets/${sha256}`);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('application/octet-stream');
    expect(res.headers['content-disposition']).toBe(`attachment; filename="${sha256}"`);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['content-security-policy']).toBe("default-src 'none'; sandbox");
  });

  it('unknown sha → 404 envelope', async () => {
    const res = await t.http().get(`/v1/assets/${'0'.repeat(64)}`);
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ error: 'not_found' });
    expect((await t.http().get('/v1/assets/../../etc/passwd')).status).toBe(404);
  });
});
