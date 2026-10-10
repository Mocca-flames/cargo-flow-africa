// Pure maths: route sampling, kingpin articulation, steering, keyframes. No DOM except buildRouteTable's path arg.
import { TRACTOR, TRAILER_L, type Key } from "./config";

export type Pt = { x: number; y: number };

export interface RouteTable {
  n: number;
  length: number;
  step: number;
  xs: Float32Array;
  ys: Float32Array;
  d0: Pt; // start direction (route is extended straight behind s=0)
  d1: Pt; // end direction (extended past s=length)
}

export const deg = (r: number) => (r * 180) / Math.PI;
export const rad = (d: number) => (d * Math.PI) / 180;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export function buildRouteTable(path: SVGPathElement, n = 4000): RouteTable {
  const length = path.getTotalLength();
  const xs = new Float32Array(n + 1);
  const ys = new Float32Array(n + 1);
  for (let i = 0; i <= n; i++) {
    const p = path.getPointAtLength((i / n) * length);
    xs[i] = p.x;
    ys[i] = p.y;
  }
  const unit = (ax: number, ay: number, bx: number, by: number): Pt => {
    const dx = bx - ax;
    const dy = by - ay;
    const m = Math.hypot(dx, dy) || 1;
    return { x: dx / m, y: dy / m };
  };
  return {
    n,
    length,
    step: length / n,
    xs,
    ys,
    d0: unit(xs[0], ys[0], xs[3], ys[3]),
    d1: unit(xs[n - 3], ys[n - 3], xs[n], ys[n]),
  };
}

export function pointAt(t: RouteTable, s: number): Pt {
  if (s <= 0) return { x: t.xs[0] + t.d0.x * s, y: t.ys[0] + t.d0.y * s };
  if (s >= t.length) {
    const e = s - t.length;
    return { x: t.xs[t.n] + t.d1.x * e, y: t.ys[t.n] + t.d1.y * e };
  }
  const f = s / t.step;
  const i = Math.min(Math.floor(f), t.n - 1);
  const u = f - i;
  return {
    x: t.xs[i] + (t.xs[i + 1] - t.xs[i]) * u,
    y: t.ys[i] + (t.ys[i + 1] - t.ys[i]) * u,
  };
}

export function headingAt(t: RouteTable, s: number, h = 40): number {
  const a = pointAt(t, s - h);
  const b = pointAt(t, s + h);
  return Math.atan2(b.y - a.y, b.x - a.x);
}

/** Point on the route BEHIND s whose straight-line (chord) distance to s equals L: the trailer's bogie. */
function solveBack(t: RouteTable, s: number, L: number): Pt {
  const p = pointAt(t, s);
  let lo = s - L * 1.5; // far
  let hi = s; // near
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    const q = pointAt(t, mid);
    if (Math.hypot(p.x - q.x, p.y - q.y) > L) lo = mid;
    else hi = mid;
  }
  return pointAt(t, (lo + hi) / 2);
}

export interface Rig {
  s: number;
  pivot: Pt;
  tractor: number; // deg
  trailer: number; // deg
  steer: number; // deg, front wheels
}

export function computeRig(t: RouteTable, sFrac: number): Rig {
  const s = sFrac * t.length;
  const pivot = pointAt(t, s);
  const back = solveBack(t, s, TRAILER_L);
  const kappa = wrap(headingAt(t, s + 60) - headingAt(t, s - 60)) / 120;
  const steer = clamp(Math.atan(TRACTOR.wheelbase * kappa), rad(-32), rad(32));
  return {
    s,
    pivot,
    tractor: deg(headingAt(t, s)),
    trailer: deg(Math.atan2(pivot.y - back.y, pivot.x - back.x)),
    steer: deg(steer),
  };
}

export function keyed(keys: Key[], p: number): number {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [p1, v1, e] = keys[i];
    if (p <= p1) {
      const [p0, v0] = keys[i - 1];
      let u = (p - p0) / (p1 - p0 || 1);
      if (e) u = u * u * (3 - 2 * u);
      return v0 + (v1 - v0) * u;
    }
  }
  return keys[keys.length - 1][1];
}
