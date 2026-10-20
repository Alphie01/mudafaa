import { Category } from '@mudafaa/case-schema';
import { canonicalJson, fnv1a64, getOwn } from '@mudafaa/engine';
import type { CompiledCase, SessionState } from '@mudafaa/engine';
import { analyzeLiveness } from './liveness.js';
import type { LiveSet, Liveness } from './liveness.js';

/**
 * Durum indirgeme anahtarı üretici. Anahtar: node, yığın, durum ve sonuç ile, mevcut node'dan (ve yığındaki dönüş
 * node'larından) itibaren hâlâ okunabilecek parçalar: değişkenler, bulunmuş deliller, tanışılan karakterler, bulunan
 * nesneler, tetikleyici mandalları, sınırına kadar kullanım ve ziyaret sayaçları, parametre başına fallback kayıtları
 * ve — yalnızca gidişatı etkileyen bir koşul okuyorsa — kategori skorları (bkz. `analyzeLiveness`). Ölü parçalar (ör. duruşmada artık okunmayan soruşturma kaynakları) anahtara girmez; skor
 * da girmez, `explore` onu anahtar başına aralık olarak izler. Anahtar, kanonik JSON'un node önekli 64 bit özetidir.
 */
export function reducer(c: CompiledCase, liveness: Liveness = analyzeLiveness(c)): (s: SessionState) => string {
  const cache = new Map<string, LiveSet>();
  const liveFor = (s: SessionState): LiveSet => {
    const id = [s.nodeId, ...s.stack].join('|');
    const hit = cache.get(id);
    if (hit !== undefined) return hit;
    const parts = [s.nodeId, ...s.stack].map((n) => liveness.live.get(n)).filter((l) => l !== undefined);
    const merged: LiveSet =
      parts.length === 1 && parts[0] !== undefined
        ? parts[0]
        : {
            vars: new Set(parts.flatMap((p) => [...p.vars])),
            evidence: new Set(parts.flatMap((p) => [...p.evidence])),
            characters: new Set(parts.flatMap((p) => [...p.characters])),
            found: new Set(parts.flatMap((p) => [...p.found])),
            uses: new Map(parts.flatMap((p) => [...p.uses])),
            visits: new Map(parts.flatMap((p) => [...p.visits])),
            latches: new Set(parts.flatMap((p) => [...p.latches])),
            paramUses: new Set(parts.flatMap((p) => [...p.paramUses])),
            score: parts.some((p) => p.score),
          };
    if (parts.length > 1) {
      for (const p of parts) {
        for (const [k, n] of p.uses) merged.uses.set(k, Math.max(merged.uses.get(k) ?? 0, n));
        for (const [k, n] of p.visits) merged.visits.set(k, Math.max(merged.visits.get(k) ?? 0, n));
      }
    }
    cache.set(id, merged);
    return merged;
  };
  const counts = (rec: Record<string, number>, caps: Map<string, number>): [string, number][] =>
    [...caps]
      .flatMap(([k, cap]): [string, number][] => {
        const n = getOwn(rec, k) ?? 0;
        return n === 0 ? [] : [[k, Math.min(n, cap)]];
      })
      .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const members = (rec: Record<string, unknown>, live: Set<string>): string[] =>
    Object.keys(rec)
      .filter((k) => live.has(k))
      .sort();
  return (s) => {
    const live = liveFor(s);
    const key = canonicalJson({
      n: s.nodeId,
      k: s.stack,
      st: s.status,
      o: s.outcome?.id ?? null,
      v: members(s.vars, live.vars).map((k) => [k, getOwn(s.vars, k)]),
      e: members(s.evidence, live.evidence),
      c: members(s.characters, live.characters),
      f: members(s.found, live.found),
      l: members(s.latches, live.latches).map((k) => [k, getOwn(s.latches, k)]),
      u: counts(s.uses, live.uses),
      vi: counts(s.visits, live.visits),
      p: members(s.paramUses, live.paramUses).map((k) => [k, [...(getOwn(s.paramUses, k) ?? [])].sort()]),
      // Skor yalnızca bir koşul onu okuyorsa anahtara girer (aksi hâlde anahtar başına aralık olarak izlenir).
      sc: live.score ? Category.options.map((k) => s.score.cat[k]) : null,
    });
    return `${s.nodeId}#${fnv1a64(key)}`;
  };
}
