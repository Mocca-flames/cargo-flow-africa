import { PLACES, CORRIDORS } from "@/data/coverage-corridors-wide";

/**
 * Coverage camera framing — pure functions of the WIDE generated data
 * (`coverage-corridors-wide.ts`, viewBox 6000x3966) plus container size.
 * No hand-typed coordinates here: every number comes from PLACES.
 *
 * OCEAN was sampled from the basemap itself: pixel (10,10) of
 * public/southern-africa-wide.png is rgb(0,9,24).
 */

export const FRAME_W = 6000;
export const FRAME_H = 3966;
export const OCEAN = "#000918";

/** Never zoom in tighter than this box width (SVG units). */
export const MIN_BOX_W = 2200;
/** Horizontal overscan limits: x may range so the box stays in [-1500, 7500]. */
export const X_MIN = -1500;
export const X_MAX = 7500;

export const ORDER = ["A", "B", "C", "D"] as const;
export type CorridorId = (typeof ORDER)[number];
export const STOPS = ["A", "B", "C", "D", "NETWORK"] as const;
export type StopId = (typeof STOPS)[number];

export type VB = { x: number; y: number; w: number; h: number };

/**
 * Places that define the camera target: MAIN-route places only
 * (start hub through Lubumbashi — feeders / the Durban line excluded).
 * NETWORK frames every place, Durban included.
 */
export function framePlaceIds(stop: StopId): string[] {
  if (stop === "NETWORK") {
    return [
      ...new Set(
        ORDER.flatMap((id) => [CORRIDORS[id].main, ...CORRIDORS[id].feeders]).flat()
      ),
    ];
  }
  return [...CORRIDORS[stop as CorridorId].main];
}

/** Start hub(s) of a stop. */
export function startHubs(stop: StopId): string[] {
  if (stop === "NETWORK") return ["jhb", "gbe"];
  if (stop === "A") return ["jhb"];
  return ["gbe"];
}

/** Pins drawn for a stop: main route + feeders + the always-labeled trio. */
export function dotIds(stop: StopId): string[] {
  const lists =
    stop === "NETWORK"
      ? ORDER.flatMap((id) => [CORRIDORS[id].main, ...CORRIDORS[id].feeders])
      : [CORRIDORS[stop as CorridorId].main, ...CORRIDORS[stop as CorridorId].feeders];
  return [...new Set([...lists.flat(), "jhb", "dbn", "gbe"])];
}

/** Backwards-compatible alias (pins drawn for a stop). */
export const stopPlaceIds = dotIds;

/** Constant on-screen pin sizes, in screen px (multiplied by scale). */
export const PIN_PX = { hub: 11, port: 9, border: 7, city: 7 } as const;
/** Constant on-screen label size, in screen px (multiplied by scale). */
export const LABEL_PX = 13;

/**
 * Frame a stop: bbox of its MAIN-route places + 12% padding on every
 * side, plus an EXTRA 10% of box height at the TOP and 6% of box width
 * on the LEFT (header + card) on desktop; on 1024px or narrower an
 * extra 35% of box height at the BOTTOM instead (bottom sheet). Grow
 * to the container aspect ratio, CENTRED on the target-box centre.
 * Then: minimum box width 2200; strict vertical clamp (shift first,
 * shrink only if it still does not fit); horizontal overscan limited
 * to [-1500, 7500]. Pure function of the data file + container size,
 * so ScrollTrigger can invalidateOnRefresh it.
 */
export function viewBoxFor(stop: StopId, cw: number, ch: number): VB {
  const ids = framePlaceIds(stop);
  const xs = ids.map((id) => PLACES[id].x);
  const ys = ids.map((id) => PLACES[id].y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const w = Math.max(Math.max(...xs) - Math.min(...xs), 1);
  const h = Math.max(Math.max(...ys) - Math.min(...ys), 1);

  let bw = w * 1.24;
  let bh = h * 1.24;
  // Asymmetric extras shift the padded-box centre away from the bbox centre.
  let pcx = cx;
  let pcy = cy;
  const narrow = cw <= 1024;
  if (narrow) {
    // Mobile: card sits at the bottom, so add bottom padding to make room.
    // The DRC (top/north) area stays visible above the card.
    // Slight top bias to clear the floating nav and show DRC labels.
    bh *= 1.22; // bottom padding for card
    pcy = cy + (0.18 * h * 1.24) / 2 - (0.04 * h * 1.24) / 2;
  } else {
    bh *= 1.1; // header clearance, added at the top
    bw *= 1.06; // card clearance, added on the left
    pcy = cy - (0.1 * h * 1.24) / 2;
    pcx = cx - (0.06 * w * 1.24) / 2;
  }

  // Grow to the container aspect ratio, centred on the padded-box centre.
  const aspect = cw / Math.max(ch, 1);
  if (bw / bh < aspect) {
    bw = bh * aspect;
  } else {
    bh = bw / aspect;
  }

  // Never zoom in tighter than MIN_BOX_W.
  if (bw < MIN_BOX_W) {
    bw = MIN_BOX_W;
    bh = MIN_BOX_W / aspect;
  }

  let x0 = pcx - bw / 2;
  let y0 = pcy - bh / 2;

  // Strict vertical clamp: shift first, shrink only if it still fits nowhere.
  if (bh >= FRAME_H) {
    bh = FRAME_H;
    bw = FRAME_H * aspect;
    x0 = pcx - bw / 2;
    y0 = 0;
  } else {
    if (y0 < 0) y0 = 0;
    if (y0 + bh > FRAME_H) y0 = FRAME_H - bh;
  }

  // Horizontal overscan: shift, shrink only if wider than the band.
  if (bw >= X_MAX - X_MIN) {
    bw = X_MAX - X_MIN;
    bh = bw / aspect;
    x0 = X_MIN;
    y0 = pcy - bh / 2;
    if (y0 < 0) y0 = 0;
    if (y0 + bh > FRAME_H) y0 = Math.max(0, FRAME_H - bh);
  } else {
    if (x0 < X_MIN) x0 = X_MIN;
    if (x0 + bw > X_MAX) x0 = X_MAX - bw;
  }

  return { x: x0, y: y0, w: bw, h: bh };
}

/* ─── Label layout (pure; UI offsets only, positions from PLACES) ─── */

export type PlacedLabel = {
  id: string;
  x: number;
  y: number;
  anchor: "start" | "middle" | "end";
  hidden: false;
};

export type LabelLayout = {
  /** SVG units per screen px (box.width / containerPixelWidth). */
  scale: number;
  /** Label font size in SVG units (13 screen px × scale). */
  fs: number;
  placed: PlacedLabel[];
  hidden: string[];
};

type Rect = { x0: number; y0: number; x1: number; y1: number };

function overlaps(a: Rect, b: Rect): boolean {
  return a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
}

/** The six NETWORK border posts, in spec order. */
const NETWORK_BORDERS = ["beitbridge", "chirundu", "kazungula", "katima", "plumtree", "kasumbalesa"];

/**
 * Which places may carry a label at a stop, in placement-priority
 * order: hubs, Durban, active-corridor borders (main order), then
 * cities (main order). NETWORK: hubs, Durban, the six border posts.
 * Lubumbashi carries the Specialist badge instead of a name label.
 */
export function labelCandidates(stop: StopId): string[] {
  if (stop === "NETWORK") return ["jhb", "gbe", "dbn", ...NETWORK_BORDERS];
  const main = CORRIDORS[stop as CorridorId].main;
  const seen = new Set(["jhb", "gbe", "dbn"]);
  const borders = main.filter((id) => {
    if (PLACES[id].type !== "border" || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  const cities = main.filter((id) => {
    if (PLACES[id].type !== "city" || id === "lub" || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
  return ["jhb", "gbe", "dbn", ...borders, ...cities];
}

/**
 * Place labels so each stays touching its OWN pin. Slots are tried in
 * order right, left, above, below; the first whose estimated rectangle
 * (name length × 0.6 × fs, fs high) overlaps neither an already-placed
 * label nor any pin wins. If no slot is free the label is HIDDEN —
 * labels are never moved away from their pin.
 */
export function layoutLabels(stop: StopId, cw: number, ch: number): LabelLayout {
  const vb = viewBoxFor(stop, cw, ch);
  const scale = vb.w / Math.max(cw, 1);
  const fs = LABEL_PX * scale;
  const gap = 0.35 * fs;

  const pinR = (id: string): number => {
    const t = PLACES[id].type;
    return (t === "hub" ? PIN_PX.hub : t === "port" ? PIN_PX.port : t === "border" ? PIN_PX.border : PIN_PX.city) * scale;
  };
  const pins: Rect[] = dotIds(stop).map((id) => {
    const p = PLACES[id];
    const r = pinR(id);
    return { x0: p.x - r, y0: p.y - r, x1: p.x + r, y1: p.y + r };
  });

  const placed: PlacedLabel[] = [];
  const placedRects: Rect[] = [];
  const hidden: string[] = [];

  for (const id of labelCandidates(stop)) {
    const p = PLACES[id];
    const pr = pinR(id);
    const lw = p.name.length * 0.6 * fs;
    const lh = fs;
    const slots: { x: number; y: number; anchor: PlacedLabel["anchor"]; rect: Rect }[] = [
      { x: p.x + pr + gap, y: p.y, anchor: "start", rect: { x0: p.x + pr + gap, y0: p.y - lh / 2, x1: p.x + pr + gap + lw, y1: p.y + lh / 2 } },
      { x: p.x - pr - gap, y: p.y, anchor: "end", rect: { x0: p.x - pr - gap - lw, y0: p.y - lh / 2, x1: p.x - pr - gap, y1: p.y + lh / 2 } },
      { x: p.x, y: p.y - pr - gap, anchor: "middle", rect: { x0: p.x - lw / 2, y0: p.y - pr - gap - lh, x1: p.x + lw / 2, y1: p.y - pr - gap } },
      { x: p.x, y: p.y + pr + gap, anchor: "middle", rect: { x0: p.x - lw / 2, y0: p.y + pr + gap, x1: p.x + lw / 2, y1: p.y + pr + gap + lh } },
    ];
    let done = false;
    for (const s of slots) {
      if (placedRects.some((r) => overlaps(r, s.rect))) continue;
      if (pins.some((r) => overlaps(r, s.rect))) continue;
      placed.push({ id, x: s.x, y: s.y, anchor: s.anchor, hidden: false });
      placedRects.push(s.rect);
      done = true;
      break;
    }
    if (!done) hidden.push(id);
  }

  return { scale, fs, placed, hidden };
}
