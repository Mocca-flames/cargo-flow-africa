/**
 * Where each load sits in each of Ch5's two trailer projections.
 *
 * The load blocks and the trailer SVG share one coordinate space, but the two
 * projections are not the same drawing:
 *
 *   side (desktop)  deck runs left→right as a horizontal beam. Cargo stands
 *                   ON the beam's top edge, so a load's bottom edge sits on the
 *                   deck line and grows upward.
 *   top  (mobile)   deck runs top→bottom as a vertical rectangle. There is no
 *                   "on top" in a plan view, so a load is a FOOTPRINT inside
 *                   the deck rectangle, sized by how much deck it takes.
 *
 * Both views are aspect-matched to their own stage (see LoadsCommon.css), so a
 * stage coordinate maps linearly onto the box and a plain percentage is exact.
 * Each helper therefore converts metres → stage units → percentage.
 *
 * ── Side-view headroom ──
 * The trailer drawing is 1200×200 with its deck line at y=70 — only 70 units of
 * headroom, and the cargo drawings are 104–175 units tall. So the side STAGE is
 * deliberately taller than the trailer: the trailer is anchored to the bottom of
 * a 1200×340 stage, leaving 140 units of empty canvas above it, and the loads
 * stand in that band. Growing the stage vertically is also what lets the
 * desktop layout use the full viewport height.
 *
 * ── How high a load hangs before its step ──
 * A waiting load is lifted by `--lift-pct`, a unitless PERCENTAGE of the stage
 * height, and the stage is a size container — so the block turns it into a
 * translateY with `cqh` units and the lift stays exact at any stage size. The
 * number is chosen per load so that its top edge lands one fifth of its own
 * height ABOVE the stage's top edge: the reader sees the bottom 80% of the
 * freight hanging in mid-air, cut off by the frame (stage `overflow: clip`),
 * which is what makes it read as held by a crane over the deck rather than
 * sitting on it. Nothing is measured in JS — this is geometry, done once here.
 *
 * Every cargo is scaled by ONE shared factor — derived from the tallest
 * drawing in the plan — so a fertiliser pallet still reads as shorter than a
 * stack of jumbo bags. Each dashed slot is then drawn to the box its freight
 * actually occupies, so a slot is exactly the footprint of what lands in it.
 *
 * `metres` are measured from the deck centre, matching `data/loads.ts`.
 */

import { loadPlan, loadsDeck, type LoadUnitRecord } from "@/data/loads";

/* Side view: the stage box, with the 1200×200 trailer anchored to its bottom. */
const SIDE = {
  stageW: 1200,
  stageH: 340,
  trailerH: 200,
  /* The trailer's deck beam spans this, at this deck-line height. */
  deckX0: 20,
  deckX1: 1180,
  deckTopY: 70,
  /* Vertical band above the deck line that cargo may occupy, in stage units.
     The remainder of the stage above this is reserved for the mono labels. */
  cargoBand: 170,
  /* How much of a waiting load hangs ABOVE the stage's top edge, as a
     fraction of its own height: 0.2 → the bottom 80% is what you see. */
  hangOver: 0.2,
} as const;

/* Top view: the deck rectangle inside the 240×1000 stage. Kingpin and landing
   gear at the top (front), bumper at the bottom (rear). Footprints are inset
   from the deck edges so the painted hazard border stays visible. */
const TOP = {
  viewW: 240,
  viewH: 1000,
  deckX0: 40,
  deckX1: 200,
  deckY0: 20,
  deckY1: 960,
  footprintInset: 8,
} as const;

const deckLen = loadsDeck.deckLengthM;

type Style = {
  left: string;
  width: string;
  height: string;
  top?: string;
  bottom?: string;
  /** Side view only: how far a waiting load hangs above its slot, as a
      percentage of the stage height (see the note at the top of the file).
      Unitless, so the block can multiply it by `1cqh`. */
  "--lift-pct"?: number;
};

const pct = (value: number, total: number) => `${(value / total) * 100}%`;

/* One scale for every cargo, from the tallest drawing in the plan. Computed
   once at module load — the plan is static data, so this cannot go stale. */
const cargoScale =
  SIDE.cargoBand / Math.max(...loadPlan.map((unit) => unit.cargo.h));

/** Metres from the deck centre → a stage x along the side-view deck beam.
    MIRRORED: the side elevation is drawn with the kingpin on the RIGHT and the
    tri-axle bogie on the LEFT, so rear (positive metres) has to map to the
    LEFT of the beam. Get this backwards and every load silently sits over the
    wrong axle group. */
function sideX(metres: number) {
  return (
    SIDE.deckX1 -
    ((metres + deckLen / 2) / deckLen) * (SIDE.deckX1 - SIDE.deckX0)
  );
}

/** Where a load's freight stands on the side-view deck: bottom edge on the deck
    line, width from the scaled drawing, height from the scaled drawing. Because
    `sideX` is mirrored, the two edges come back in descending order, so the
    left edge is the min and the width the absolute difference.

    It also returns `--lift-pct`: how far that load hangs above its slot before
    its step, as a percentage of the stage height. Top edge of the resting load
    is `100 - bottom - height` down the stage; add `hangOver x height` and the
    load is lifted until that top edge sits one fifth of its own height past
    the stage's top edge — bottom 80% visible, top 20% clipped by the frame. */
export function sideBlockStyle(unit: LoadUnitRecord): Style {
  const a = sideX(unit.startM);
  const b = sideX(unit.startM + unit.sizeM);

  const heightPct = ((unit.cargo.h * cargoScale) / SIDE.stageH) * 100;
  const bottomPct = ((SIDE.trailerH - SIDE.deckTopY) / SIDE.stageH) * 100;
  const topPct = 100 - bottomPct - heightPct;
  const liftPct = round3(topPct + SIDE.hangOver * heightPct);

  return {
    left: pct(Math.min(a, b), SIDE.stageW),
    width: pct(Math.abs(b - a), SIDE.stageW),
    height: pct(unit.cargo.h * cargoScale, SIDE.stageH),
    bottom: pct(SIDE.trailerH - SIDE.deckTopY, SIDE.stageH),
    "--lift-pct": liftPct,
  };
}

/** Three decimals is sub-pixel at any stage size; keeps the inline style
    readable in devtools. */
function round3(value: number) {
  return Math.round(value * 1000) / 1000;
}

/** Metres from the deck centre → a stage y along the top-view deck. The top
    view is NOT mirrored: its kingpin is drawn at the top, which is already the
    front, so positive metres run down the screen toward the rear. */
function topY(metres: number) {
  return (
    TOP.deckY0 +
    ((metres + deckLen / 2) / deckLen) * (TOP.deckY1 - TOP.deckY0)
  );
}

/** A load's footprint on the top-view deck: a bar inside the deck rectangle,
    length set by how much deck it takes, running down the deck's long axis. */
export function topBlockStyle(unit: LoadUnitRecord): Style {
  const y0 = topY(unit.startM);
  const y1 = topY(unit.startM + unit.sizeM);
  const fx0 = TOP.deckX0 + TOP.footprintInset;
  const fx1 = TOP.deckX1 - TOP.footprintInset;
  return {
    left: pct(fx0, TOP.viewW),
    width: pct(fx1 - fx0, TOP.viewW),
    top: pct(y0, TOP.viewH),
    height: pct(y1 - y0, TOP.viewH),
  };
}
