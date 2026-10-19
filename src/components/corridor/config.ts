// Ch6 "The Run" — all tunable data lives here. Nothing in this file touches the DOM.

/** [progress 0..1, value, ease?]. ease=1 → smoothstep on the segment ENDING at this key. */
export type Key = [p: number, v: number, ease?: 0 | 1];

export const PIN_SCREENS = 2; // ~200vh pinned — snappy, fast and responsive
export const MOBILE_MAX = 767;

/** World units: 1 unit = 1 cm (100 units = 1 m). Stylised, not geographic. Stops sit on straights; bends between them show the trailer articulating. */
export const ROUTE_D =
  "M -3000 6000 L 8000 6000 C 10500 6000 11500 6000 12500 4500 C 13500 3000 14000 3000 16000 3000 L 24000 3000 " +
  "C 26500 3000 27500 3000 28500 5000 C 29500 7000 30000 7000 32000 7000 L 40000 7000 " +
  "C 42500 7000 43500 7000 44500 5250 C 45500 3500 46000 3500 48000 3500 L 56000 3500 " +
  "C 58500 3500 59500 3500 60500 5000 C 61500 6500 62000 6500 64000 6500 L 77000 6500";

/** Truck art contract — must match the Gemini prompts (cft-* / cfl-*). */
export const TRACTOR = { pivotX: 275, pivotY: 150, wheelbase: 300 };
export const TRAILER = { pivotX: 1300, pivotY: 150, bogieX: 290 };
export const TRAILER_L = TRAILER.pivotX - TRAILER.bogieX; // kingpin → bogie centre

/** Rig extents in world units RELATIVE to the kingpin pivot (see art/* frames).
 *  Tractor faces +x: nose ≈ +410, mirrors ≈ +400, tail of tractor ≈ -217.
 *  Trailer tail is the back of the whole rig. These MUST match the art or the
 *  camera pads the frame with dead space (a too-large front puts the road
 *  between the cab and the boom; a too-small one crops the tractor). */
export const RIG = { back: -1300, front: 440, half: 150 };
/** Nose-to-tail length of the whole rig (tractor nose → trailer tail). */
export const RIG_SPAN = RIG.front - RIG.back;
/** Rig midpoint relative to the pivot (negative = behind it). */
export const RIG_CENTER = (RIG.front + RIG.back) / 2;
/** How far BEHIND the pivot the camera looks — the rig's midpoint, so the
 *  whole truck + trailer stays in frame (RIG_LOOK, see camera maths in
 *  useCorridorAnimation). */
export const RIG_LOOK = -RIG_CENTER;

export const TOTAL_KM = 2900;
/** Boom sits this far ahead of the stopped truck's kingpin — clear of the
 *  tractor nose (+410) with room to stop short of it. */
export const GATE_OFF = 1000;

/** Carriageway half-width in world units (7.6 m road) — the road-bed stroke
 *  width is 2× this. Everything roadside (booms, booths, tags, barricades)
 *  is authored against it, and it deliberately stays in scale with the rig:
 *  the truck is 250 wide / 300 tall, so a boom that spans the whole road is
 *  the tallest thing in the frame — but not a skyscraper. */
export const ROAD_HALF = 380;

/** Gate booth box, shared by CorridorRun (the booth) and NightLights (the glow). */
export const BOOTH = { w: 180, h: 140, cy: -(ROAD_HALF + 95), glowR: 130 };

/** Scroll progress → fraction of route length.
 *  Continuous drive with curve slowdowns and a prominent, clearly visible border clearance at midpoint. */
export const ROUTE_KEYS: Key[] = [
  [0, 0],
  [0.08, 0.14, 1], // Straight 1: Fast departure out of Durban
  [0.22, 0.25, 1], // Curve 1: Turning slowdown (front wheels steer, trailer articulates)
  [0.32, 0.36, 1], // Straight 2: Accelerate forward
  [0.44, 0.46, 1], // Curve 2: Turn & trailer sway
  [0.48, 0.49, 1], // Approaching Beitbridge Gateway in full view ahead
  [0.53, 0.51, 1], // At Checkpoint: Brief verification slowdown
  [0.57, 0.54, 1], // Instant Clearance: Boom up & throttle surge!
  [0.68, 0.67, 1], // Curve 3: Turn onto night highway
  [0.78, 0.78, 1], // Straight 4: Night cruising
  [0.88, 0.88, 1], // Curve 4: Final bend
  [1.00, 1.00, 1], // Final Sprint: Fast delivery to Lubumbashi
];

/** Camera punch-in per beat. Pulls back wide at the border (0.86) so the entire gantry, booth & truck are framed clearly. */
export const ZOOM_KEYS: Key[] = [
  [0, 1],
  [0.20, 1.05, 1],
  [0.42, 0.94, 1], // Pull back during Curve 2
  [0.51, 0.86, 1], // Wide framing at the border so the entire checkpoint structure and truck are visible!
  [0.58, 0.98, 1], // Re-anchor as truck passes through
  [0.72, 1.05, 1],
  [1, 1.05, 1],   // Delivery framing
];

/** Darkness overlay: subtle depth without obscuring the vehicle. */
export const TINT_KEYS: Key[] = [
  [0, 0],
  [0.48, 0],
  [0.65, 0.15],
  [0.80, 0.05],
  [1, 0],
];

/** Day=0 Night=1 scalar per progress. Daytime at departure & border, night on the long haul. */
export const NIGHT_KEYS: Key[] = [
  [0, 0],
  [0.48, 0],    // Bright daylight at border crossing
  [0.66, 0.72], // Night transit with headlights on
  [0.84, 0.25], // Dawn approaching destination
  [1, 0],       // Daylight arrival
];

/** Delay exposure stays at 0 h — brief checkpoint scan then cleared back to 0 h. */
export const DELAY_KEYS: Key[] = [
  [0, 0],
  [0.47, 0],
  [0.51, 0.4], // Brief scan at checkpoint
  [0.54, 0],   // Instant clearance back to 0 h
  [1, 0],
];

export const STRIKE = { at: 0.40, from: 0.32, until: 0.44 };

/** Express border gateway at midpoint (0.50) — visible from afar, clear approach, instant pass. */
export const GATES = [
  { id: "g1", name: "Beitbridge Gateway", at: 0.50, queueFrom: 0.47, clearedAt: 0.54, queue: false },
] as const;

export interface Beat {
  id: string;
  from: number;
  to: number;
  kicker: string;
  title: string;
}

/** 4 streamlined, client-reassuring beats synchronized with the journey */
export const BEATS: Beat[] = [
  { id: "depart", from: 0, to: 0.22, kicker: "01 · Express Dispatch", title: "Out of Durban · Full Throttle" },
  { id: "transit", from: 0.22, to: 0.46, kicker: "02 · Route Agility", title: "Handling Bends & Challenges Safely" },
  { id: "clear", from: 0.46, to: 0.70, kicker: "03 · Priority Border Clearance", title: "Pre-Cleared · Always Green" },
  { id: "delivered", from: 0.70, to: 1.0001, kicker: "04 · Guaranteed Delivery", title: "Lubumbashi · On Time & Intact" },
];
