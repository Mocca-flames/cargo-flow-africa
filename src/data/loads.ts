/**
 * Ch5's loading plan — three shippers, one flatdeck, one run.
 *
 * The chapter is a LOAD PLAN rather than a 3D assembly: the flatdeck trailer,
 * and one piece of freight per shipper standing on the deck. This file is the
 * single source of truth for what is on the deck, in what order, how heavy it
 * is and where it came from and went to — so the drawing, the map and the mono
 * counter can never disagree with each other.
 *
 * Convention, same as the rest of the data layer: dimensions are metres,
 * authored here and interpreted by the component. `startM` is a load's left
 * edge measured from the deck centre, `sizeM` its extent along the deck,
 * `heightM` its stack height above the deck top. **Positive metres are toward
 * the REAR of the trailer** (over the tri-axle bogie); negative is toward the
 * front (over the kingpin). `order` is the 1-based landing order, which is also
 * the left-to-right position in the side elevation, because that drawing is
 * mirrored — its kingpin is drawn on the right. `planGeometry.ts` owns that
 * flip.
 *
 * `cargoBox` is the commodity drawing's own frame — its natural width and
 * height above the deck contact. `planGeometry.ts` scales every drawing by one
 * shared factor, so the freight is sized by the drawings rather than the other
 * way round, and the dashed slot is cut to whatever width that produces.
 * These are the drawings' intrinsic dimensions; do not "correct" them.
 *
 * Lane geometry — which yard each load came from, which town it is bound for,
 * and where both sit on the map — lives in `data/corridors-ch5.ts`, not here.
 * The deck's physical facts and the map's geographic facts are separate
 * concerns, and only the load `id` joins them.
 */

import type { FleetCode } from "./fleet";

export type LoadUnitId = "steel-coil" | "sulphur" | "fertiliser";

export type CargoId = LoadUnitId;

export type CargoBox = {
  /** Which commodity drawing to stand on the deck. */
  id: CargoId;
  /** Natural width of the drawing, in its own viewBox units. */
  w: number;
  /** Natural height of the drawing above its deck contact, same units. */
  h: number;
};

export type LoadUnitRecord = {
  id: LoadUnitId;
  /** 1-based landing order — also the scroll beat index. */
  order: number;
  /** Shipper code, mono. Printed on the slot. */
  code: string;
  /** Commodity name. Printed on the label. */
  commodity: string;
  /** Origin yard, mono. PLACEHOLDER — the chip the load falls from. */
  yard: string;
  /** Destination town and country. Read by the per-landing caption; the map
      keeps its own copy of the lane in `data/corridors-ch5.ts`, which is where
      the geometry lives. */
  destination: string;
  country: string;
  /** Tonnes this unit adds to the deck. Sums to the plate total. */
  tonnes: number;
  /** Left edge, metres from the deck centre. Positive is toward the rear. */
  startM: number;
  /** Extent along the deck, metres. */
  sizeM: number;
  /** Stack height above the deck top, metres. Drives the mobile top-view
      footprint, which has no drawing of its own yet. */
  heightM: number;
  /** The freight standing on the deck for this unit. */
  cargo: CargoBox;
};

export const loadsDeck = {
  /** Matches the flatdeck in `data/fleet.ts` — Ch4's steel card already
      stamps FD-120, so the trailer here is the trailer just inspected. */
  fleetCode: "FD-120" as FleetCode,
  /** FD-120 is a 12 m deck at a 1.4 m loading height. */
  deckLengthM: 12,
  loadingHeightM: 1.4,
  site: "DURBAN",
  siteCoords: "29°51'11\"S 31°01'57\"E",
} as const;

/* ─── The plan ───
   Deck-space is claimed by the drawings, not by hand. Each `sizeM` below is the
   width its freight occupies once scaled to the band above the deck line (see
   `planGeometry.ts`), so the dashed slot is exactly the footprint of the cargo
   that lands in it.

   Placement follows the real load plan, heaviest forward of the bogie:
   steel coils sit over the rear tri-axle, sulphur is mid-deck, fertiliser
   goes over the kingpin at the front. Landing order is therefore rear → front,
   which is left → right in the (mirrored) side elevation. */

export const loadPlan: LoadUnitRecord[] = [
  {
    id: "steel-coil",
    order: 1,
    code: "S1",
    commodity: "Steel coil",
    yard: "Saldanha",
    destination: "Ndola",
    country: "Zambia",
    tonnes: 13.0,
    startM: 2.3,
    sizeM: 3.26,
    heightM: 1.35,
    /* A pair of coils in timber cradles, 324 × 130 above the deck contact. */
    cargo: { id: "steel-coil", w: 324, h: 130 },
  },
  {
    id: "sulphur",
    order: 2,
    code: "S2",
    commodity: "Sulphur",
    yard: "Durban",
    destination: "Lubumbashi",
    country: "DRC",
    tonnes: 12.0,
    startM: -1.48,
    sizeM: 2.96,
    heightM: 1.6,
    /* Three jumbo bags, 294 × 175 above the deck contact. */
    cargo: { id: "sulphur", w: 294, h: 175 },
  },
  {
    id: "fertiliser",
    order: 3,
    code: "S3",
    commodity: "Fertiliser",
    yard: "Richards Bay",
    destination: "Lusaka",
    country: "Zambia",
    tonnes: 9.0,
    startM: -5.4,
    sizeM: 2.71,
    heightM: 1.1,
    /* A cross-stacked sack pallet, 270 × 104 above the deck contact. */
    cargo: { id: "fertiliser", w: 270, h: 104 },
  },
];

/* ─── Totals, derived — never hand-typed ─── */

export const loadTotals = {
  tonnes: round(
    loadPlan.reduce((sum, unit) => sum + unit.tonnes, 0),
    1
  ),
  units: loadPlan.length,
};

/** Tonnes on the deck once the first `landed` loads have settled — what the
    mono counter reads at each step. */
export function cumulativeTonnes(landed: number): number {
  return round(
    loadPlan
      .slice(0, Math.max(0, Math.min(landed, loadPlan.length)))
      .reduce((sum, unit) => sum + unit.tonnes, 0),
    1
  );
}

function round(value: number, places: number) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

/* ─── Beat windows ───
   Three landings and then a DWELL: pacing lives here and nowhere else. The
   track is divided so the three landings finish at `done`, and the remaining
   `1 - done` is the dwell — the beat where nothing new lands, the section
   stays pinned, and the finale (counter, bracket, link) is already up. The
   dwell is what lets the closing read breathe before the chapter hands off to
   Ch6. Change a number here and the landings, the counter ticks and the map
   routes all move together. */

export const loadBeats = {
  /** Empty deck held before anything lands. */
  hold: 0.06,
  /** Last load touches down here — which is also where the dwell begins. */
  done: 0.75,
} as const;

/** Scroll fraction at which a unit starts and finishes landing. */
export function unitWindow(unit: LoadUnitRecord) {
  const span = loadBeats.done - loadBeats.hold;
  const each = span / loadPlan.length;
  const start = loadBeats.hold + (unit.order - 1) * each;
  return { start, end: start + each };
}

/* ─── Copy ─── */

export const loadsCopy = {
  eyebrow: "LOADS",
  heading: "Three Shippers. One Deck. One Run.",
  standfirst:
    "34 tonnes from three origins, weighed, placed and strapped before the wheels turn.",
  readoutLabel: "Load sheet",
  bracket: "3 shippers → 1 truck",
  cta: "See how we load",
  /** Shown in place of a landing caption while the deck is still empty. */
  captionIdle: "Deck empty · awaiting first load",
} as const;

/** The per-landing caption: `STEEL COIL · 13.0 T → NDOLA, ZAMBIA`. */
export function landingCaption(unit: LoadUnitRecord): string {
  return `${unit.commodity.toUpperCase()} · ${unit.tonnes.toFixed(1)} T → ${unit.destination.toUpperCase()}, ${unit.country.toUpperCase()}`;
}