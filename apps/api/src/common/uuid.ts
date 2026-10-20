const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Yol parametresi uuid mi (değilse sorgu yapılmadan 404 verilir; Postgres `::uuid` dönüşüm hatası 500'e düşmez). */
export const isUuid = (s: string): boolean => UUID.test(s);
