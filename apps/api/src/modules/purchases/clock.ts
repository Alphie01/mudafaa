/** Saat (testlerde sabitlenebilir): premium dönemi ve yenileme sorgusu buna göre hesaplanır. */
export const CLOCK = Symbol('CLOCK');
export type Clock = () => Date;
