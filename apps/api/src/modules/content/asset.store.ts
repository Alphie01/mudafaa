import { createHash } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { isAbsolute, join, resolve } from 'node:path';
import type { Readable } from 'node:stream';
import { Inject, Injectable } from '@nestjs/common';
import { ENV, type Env } from '../../config/env.js';

/** İçerik adresli dosya deposu: ASSET_DIR/<sha256>. */
@Injectable()
export class AssetStore {
  readonly dir: string;

  constructor(@Inject(ENV) env: Env) {
    this.dir = isAbsolute(env.ASSET_DIR) ? env.ASSET_DIR : resolve(process.cwd(), env.ASSET_DIR);
  }

  async put(bytes: Buffer): Promise<{ sha256: string; size: number }> {
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    await mkdir(this.dir, { recursive: true });
    const file = join(this.dir, sha256);
    if (!existsSync(file)) await writeFile(file, bytes);
    return { sha256, size: bytes.length };
  }

  open(sha256: string): Readable | null {
    if (!/^[0-9a-f]{64}$/.test(sha256)) return null;
    const file = join(this.dir, sha256);
    return existsSync(file) ? createReadStream(file) : null;
  }
}
