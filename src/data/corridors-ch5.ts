/**
 * Ch5's corridors — the three lanes the load plan runs.
 *
 * Split out from `data/loads.ts` deliberately. The load plan and the map are
 * two views of the same freight, but they are not the same subject: `loads.ts`
 * owns what is physically on the deck (metres, tonnes, stack heights), while
 * this file owns where those loads came from and where they are going (screen
 * positions in the map's coordinate space). Keeping the map's geometry out of
 * the deck's data means the map can be mounted, moved or dropped without
 * touching a single number the trailer drawing depends on.
 *
 * Map coordinates are in `CorridorMap`'s 600×520 viewBox and were read off the
 * supplied outline drawing's own markers, so each dot sits on its country's
 * real edge rather than near it. When the Gemini SVG replaces the outline,
 * these need re-reading — that is the one thing in this file that is coupled to
 * the artwork.
 */

import { loadPlan } from "./loads";

export type MapPoint = { x: number; y: number };

/** Where a destination's label sits relative to its dot.
 *  `anchor` is the SVG `text-anchor`; the deltas nudge it clear of the dot.
 *  Hand-placed rather than collision-solved: three labels is few enough to
 *  place by eye, and an automatic pass would move them between renders. The
 *  three destinations sit close together on this projection (Ndola, Lubumbashi
 *  and Lusaka all fall between x 326 and x 344), so their anchors alternate —
 *  west, east, east — to keep them apart. */
export type LabelPlacement = {
  anchor: "start" | "end";
  dx: number;
  dy: number;
};

export type CorridorLane = {
  /** Matches the load's id, so the deck and the map can't disagree. */
  loadId: string;
  /** Origin yard, as printed on Ch5's chip row. */
  origin: string;
  /** Origin dot, in the map's viewBox. */
  from: MapPoint;
  /** Destination town and country. */
  destination: string;
  country: string;
  /** Destination dot, in the map's viewBox. */
  to: MapPoint;
  /** Label placement, in viewBox units. */
  label: LabelPlacement;
  /**
   * How far to bow the route away from the straight chord, as a fraction of
   * its length. Positive bows one way, negative the other. The three routes
   * leave the south coast within ~40 units of each other, so without this they
   * would run on top of one another for the first third of their length.
   */
  bow: number;
};

export const corridorLanes: CorridorLane[] = [
  {
    loadId: "steel-coil",
    origin: "Saldanha",
    from: { x: 176, y: 478 },
    destination: "Ndola",
    country: "Zambia",
    to: { x: 344, y: 235 },
    label: { anchor: "start", dx: 12, dy: -7 },
    bow: 0.12,
  },
  {
    loadId: "sulphur",
    origin: "Durban",
    from: { x: 382, y: 440 },
    to: { x: 326, y: 220 },
    destination: "Lubumbashi",
    country: "DRC",
    label: { anchor: "end", dx: -12, dy: -7 },
    bow: -0.1,
  },
  {
    loadId: "fertiliser",
    origin: "Richards Bay",
    from: { x: 397, y: 426 },
    destination: "Lusaka",
    country: "Zambia",
    to: { x: 340, y: 265 },
    label: { anchor: "start", dx: 12, dy: 17 },
    bow: 0.06,
  },
];

/**
 * The lane carrying a given load, or undefined if the two files have drifted
 * apart. `CorridorMap` uses this to assert, at render time, that every load on
 * the deck has a lane — so adding a load without a lane fails loudly in
 * development rather than silently dropping freight off the map.
 */
export function laneForLoad(loadId: string): CorridorLane | undefined {
  return corridorLanes.find((lane) => lane.loadId === loadId);
}

/** Lanes missing a counterpart load. Empty when the two files agree. */
export function orphanLanes(): CorridorLane[] {
  return corridorLanes.filter(
    (lane) => !loadPlan.some((unit) => unit.id === lane.loadId)
  );
}