import { createHash } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { isAbsolute, join, resolve } from 'node:path';
import type { Readable } from 'node:stream';
import { Inject, Injectable } from '@nestjs/common';
import { ENV, type Env } from '../../config/env.js';

const SHA = /^[0-9a-f]{64}$/;

/**
 * İçerik adresli dosya deposu: `ASSET_DIR/<sha256>`; dosya türü yanında `<sha256>.mime` olarak tutulur. Aynı bayt iki
 * kez yazılmaz; dosyalar değişmez olduğu için istemci süresiz önbelleğe alabilir.
 */
@Injectable()
export class AssetStore {
  readonly dir: string;

  constructor(@Inject(ENV) env: Env) {
    this.dir = isAbsolute(env.ASSET_DIR) ? env.ASSET_DIR : resolve(process.cwd(), env.ASSET_DIR);
  }

  async put(bytes: Buffer, mime: string): Promise<{ sha256: string; size: number }> {
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    await mkdir(this.dir, { recursive: true });
    const file = join(this.dir, sha256);
    if (!existsSync(file)) {
      // Yarım yazılmış dosya görünmesin: geçici adla yazılıp yeniden adlandırılır.
      const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
      await writeFile(tmp, bytes);
      await rename(tmp, file);
    }
    if (!existsSync(`${file}.mime`)) await writeFile(`${file}.mime`, mime);
    return { sha256, size: bytes.length };
  }

  /** Depodaki dosyanın türü (yan dosya yoksa null: eski depo) ve boyutu; dosya yoksa null. */
  async stat(sha256: string): Promise<{ mime: string | null; size: number } | null> {
    if (!SHA.test(sha256)) return null;
    const file = join(this.dir, sha256);
    const info = await stat(file).catch(() => null);
    if (info === null) return null;
    const mime = await readFile(`${file}.mime`, 'utf8').catch(() => '');
    return { mime: mime.trim() === '' ? null : mime.trim(), size: info.size };
  }

  async open(sha256: string): Promise<{ stream: Readable; mime: string | null; size: number } | null> {
    const info = await this.stat(sha256);
    if (info === null) return null;
    return { stream: createReadStream(join(this.dir, sha256)), ...info };
  }
}
