/** URL'den sorgu dizesini atar (`/v1/x?a=b` → `/v1/x`); gizli değerler sorguda taşınsa bile loga düşmez. */
export function stripQuery(url: unknown): unknown {
  if (typeof url !== 'string') return url;
  const i = url.indexOf('?');
  return i === -1 ? url : url.slice(0, i);
}

/**
 * pino-http istek serileştiricisi (savunma derinliği): pino'nun standart serileştiricisinden geçmiş isteğin `url`'i
 * sorgusuz yazılır, `query` alanı hiç yazılmaz.
 */
export function reqSerializer<T extends { url?: unknown; query?: unknown }>(req: T): Omit<T, 'query'> {
  const { query: _query, ...rest } = req;
  void _query;
  return { ...rest, url: stripQuery(req.url) } as Omit<T, 'query'>;
}
