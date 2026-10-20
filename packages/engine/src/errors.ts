/** Motorun fırlattığı hata kodları. */
export type EngineErrorCode = 'UNKNOWN_VAR' | 'UNKNOWN_PREDICATE' | 'FINAL_UNAVAILABLE' | 'TYPE';

/**
 * Motorun içerik ya da çağrı hatası bildirimi. Oyuncunun yasal olmayan hamlesi bununla değil, `act` sonucuyla döner.
 * - UNKNOWN_VAR: durumda olmayan (ya da tanımsız) bir değişken okundu.
 * - UNKNOWN_PREDICATE: `{ref}` tanımsız bir yükleme işaret ediyor.
 * - FINAL_UNAVAILABLE: `{score:'final'}` final skor hesaplanmadan (`EvalCtx.final` boşken) kullanıldı.
 * - TYPE: tür ya da biçim hatası (sayı beklenen yerde metin, boş min/max, bilinmeyen ifade biçimi…).
 * `detail` hata mesajına eklenir (ör. eksik değişkenin adı).
 */
export class EngineError extends Error {
  readonly code: EngineErrorCode;

  constructor(code: EngineErrorCode, detail?: string) {
    super(detail === undefined ? code : `${code}: ${detail}`);
    this.name = 'EngineError';
    this.code = code;
  }
}

/**
 * Tipin dışındaki (şemadan geçmemiş) bir ifade ya da etki biçimi: sessizce yutulmaz, TYPE olarak bildirilir.
 * Paket içi yardımcıdır; `index.ts` dışa aktarmaz.
 */
export function malformed(kind: string, x: unknown): never {
  const shape = typeof x === 'object' && x !== null ? `{${Object.keys(x).join(', ')}}` : String(x);
  throw new EngineError('TYPE', `Geçersiz ${kind}: ${shape}`);
}
