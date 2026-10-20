import type { Rect, SceneDef, SceneObject, Shape } from '@mudafaa/case-schema';

function inPolygon(points: readonly (readonly [number, number])[], x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const pi = points[i];
    const pj = points[j];
    if (pi === undefined || pj === undefined) continue;
    const [xi, yi] = pi;
    const [xj, yj] = pj;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function contains(shape: Shape, x: number, y: number, pad: number): boolean {
  if ('rect' in shape) {
    const r = shape.rect;
    return x >= r.x - pad && x < r.x + r.w + pad && y >= r.y - pad && y < r.y + r.h + pad;
  }
  if ('circle' in shape) {
    const { cx, cy, r } = shape.circle;
    const dx = x - cx;
    const dy = y - cy;
    return dx * dx + dy * dy <= (r + pad) * (r + pad);
  }
  return inPolygon(shape.polygon, x, y);
}

/**
 * Noktadaki en üstteki aktif nesne: z azalan sırada, eşit z'de yazım sırasında ilk gelen kazanır. Dikdörtgen yarı açık
 * (`x ≤ px < x+w`), daire `dx²+dy² ≤ r²`, çokgen çift-tek ışın kuralı; `touchPadding` dikdörtgeni ve daireyi büyütür.
 */
export function hitTest(
  scene: SceneDef,
  x: number,
  y: number,
  isActive: (o: SceneObject) => boolean,
): SceneObject | null {
  const pad = scene.touchPadding ?? 0;
  const hits = scene.objects
    .map((o, i) => ({ o, i }))
    .filter(({ o }) => isActive(o) && o.shapes.some((s) => contains(s, x, y, pad)));
  hits.sort((a, b) => (b.o.z ?? 0) - (a.o.z ?? 0) || a.i - b.i);
  return hits[0]?.o ?? null;
}

/** Şeklin sınır kutusu. */
export function boundingRect(shape: Shape): Rect {
  if ('rect' in shape) return { ...shape.rect };
  if ('circle' in shape) {
    const { cx, cy, r } = shape.circle;
    return { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r };
  }
  const xs = shape.polygon.map((p) => p[0]);
  const ys = shape.polygon.map((p) => p[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, w: Math.max(1, Math.max(...xs) - x), h: Math.max(1, Math.max(...ys) - y) };
}

/** Kutuyu sahne sınırlarına kırpar (görünüm `Rect`'i x,y ≥ 0 ve w,h > 0 ister; Ruling 26). */
export function clampRect(r: Rect, scene: { width: number; height: number }): Rect {
  const x0 = Math.min(Math.max(0, r.x), scene.width - 1);
  const y0 = Math.min(Math.max(0, r.y), scene.height - 1);
  const x1 = Math.min(scene.width, r.x + r.w);
  const y1 = Math.min(scene.height, r.y + r.h);
  return { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
}

/** Nesnenin görünümde ve isabet sonucunda gösterilen dikdörtgeni: ilk şeklin sahneye kırpılmış sınır kutusu. */
export function objectRect(scene: SceneDef, obj: SceneObject): Rect {
  const first = obj.shapes[0];
  return clampRect(first === undefined ? { x: 0, y: 0, w: 1, h: 1 } : boundingRect(first), scene);
}
