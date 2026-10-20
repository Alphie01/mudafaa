import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { mergeCaseParts } from '@mudafaa/case-schema';

/** Dosya bulunamadı / okunamadı (CLI çıkış kodu 2). */
export class LoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LoadError';
  }
}

/** İçerik ayrıştırılamadı ya da parçalar birleştirilemedi (doğrulama hatası sayılır). */
export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

const PART = /^\d+-.*\.json$/;

async function readJson(path: string): Promise<unknown> {
  let text: string;
  try {
    text = await readFile(path, 'utf8');
  } catch (e) {
    throw new LoadError(`${path} okunamadı: ${e instanceof Error ? e.message : String(e)}`);
  }
  try {
    return JSON.parse(text) as unknown;
  } catch (e) {
    throw new ParseError(`${path} geçerli JSON değil: ${e instanceof Error ? e.message : String(e)}`);
  }
}

/**
 * Dava içeriğini yükler: dosya ise JSON olarak okur; dizin ise ada göre sıralı `NN-*.json` parçalarını (yoksa bütün
 * `.json` dosyalarını) `mergeCaseParts` ile birleştirir.
 */
export async function loadCase(path: string): Promise<unknown> {
  let info;
  try {
    info = await stat(path);
  } catch (e) {
    throw new LoadError(`${path} bulunamadı: ${e instanceof Error ? e.message : String(e)}`);
  }
  if (!info.isDirectory()) return readJson(path);
  const all = (await readdir(path)).filter((f) => f.endsWith('.json')).sort();
  const parts = all.some((f) => PART.test(f)) ? all.filter((f) => PART.test(f)) : all;
  if (parts.length === 0) throw new LoadError(`${path} dizininde JSON parçası yok`);
  const values = await Promise.all(parts.map((f) => readJson(join(path, f))));
  try {
    return mergeCaseParts(values);
  } catch (e) {
    throw new ParseError(`${path} parçaları birleştirilemedi: ${e instanceof Error ? e.message : String(e)}`);
  }
}
