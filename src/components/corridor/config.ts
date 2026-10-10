// Ch6 "The Run" — all tunable data lives here. Nothing in this file touches the DOM.

/** [progress 0..1, value, ease?]. ease=1 → smoothstep on the segment ENDING at this key. */
export type Key = [p: number, v: number, ease?: 0 | 1];

export const PIN_SCREENS = 5; // ~500vh pinned (LANDING_LAYOUT.md Ch6 must be updated from 200vh)
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

export const TOTAL_KM = 2900; // TODO(verify) placeholder for HUD "Remaining"
export const GATE_OFF = 1300; // boom sits this far ahead of the stopped truck's pivot

/** Scroll progress → fraction of route length. Plateaus = truck stopped while we explain. */
export const ROUTE_KEYS: Key[] = [
  [0, 0],
  [0.12, 0.24, 1], // depart → strike hold
  [0.30, 0.24],
  [0.40, 0.46, 1], // → border 1
  [0.56, 0.46],
  [0.66, 0.68, 1], // → border 2
  [0.70, 0.68],
  [0.80, 0.90, 1], // → border 3
  [0.92, 0.90],
  [1, 1, 1], // → delivered
];

export const ZOOM_KEYS: Key[] = [
  [0, 0.3],
  [0.1, 0.3, 1],
  [0.14, 0.22, 1],
  [0.3, 0.22],
  [0.38, 0.3, 1],
  [0.58, 0.3],
  [0.64, 0.11, 1],
  [0.72, 0.11],
  [0.78, 0.3, 1],
  [0.94, 0.3],
  [1, 0.09, 1],
];

/** Darkness overlay: fear dims the scene, clearance brings the light back. */
export const TINT_KEYS: Key[] = [
  [0, 0],
  [0.12, 0.15],
  [0.3, 0.55],
  [0.4, 0.6],
  [0.54, 0.3],
  [0.8, 0.45],
  [0.92, 0.1],
  [1, 0],
];

/** Day=0 Night=1 scalar per progress. Drives --n on stage each frame. */
export const NIGHT_KEYS: Key[] = [
  [0, 0],
  [0.08, 0],
  [0.22, 0.55], // dusk at strike
  [0.34, 1],
  [0.56, 1],   // night through border 1
  [0.66, 0.35], // dawn after clearance
  [0.80, 0.10],
  [1, 0],
];

/** TODO(copy/data): placeholder "delay exposure" hours. */
export const DELAY_KEYS: Key[] = [
  [0, 0],
  [0.12, 0],
  [0.3, 6],
  [0.36, 3],
  [0.46, 8],
  [0.56, 2],
  [0.72, 2],
  [0.86, 4],
  [0.92, 1],
  [1, 0],
];

export const STRIKE = { at: 0.24, from: 0.12, until: 0.31 };

/** TODO(verify) border names/route with real playbook. queueFrom→clearedAt = HOLD window. */
export const GATES = [
  { id: "g1", name: "Beitbridge", at: 0.46, queueFrom: 0.38, clearedAt: 0.54, queue: true },
  { id: "g2", name: "Chirundu", at: 0.68, queueFrom: 0.64, clearedAt: 0.69, queue: false },
  { id: "g3", name: "Kasumbalesa", at: 0.9, queueFrom: 0.78, clearedAt: 0.9, queue: true },
] as const;

export interface Beat {
  id: string;
  from: number;
  to: number;
  kicker: string;
  title: string;
  happened: string;
  did: string;
  saw: string;
}

export const BEATS: Beat[] = [
  { id: "depart", from: 0, to: 0.12, kicker: "01 · Departure", title: "Rolling out of Durban", happened: "Your cargo leaves Durban sealed, documented and on a planned route.", did: "Route, border sequence and agents are agreed before the wheels turn.", saw: "A live tracking card from the first kilometre." },
  { id: "strike", from: 0.12, to: 0.34, kicker: "02 · Strike / blockade", title: "The road shuts", happened: "A strike blocks the road ahead.", did: "We switch to the pre-planned alternate route, or hold the trailer sealed in a secure yard until the road opens.", saw: "A message from us before you had to ask, with the new plan." },
  { id: "queue", from: 0.34, to: 0.46, kicker: "03 · Border queue", title: "Held at the first border", happened: "The queue builds and the gate slows to a crawl.", did: "Our agent is already on site with documents pre-checked and a plan for the crossing.", saw: "Queue status and a revised ETA on your tracking card." },
  { id: "clear1", from: 0.46, to: 0.58, kicker: "04 · Clearance", title: "Cleared, with a name on it", happened: "Customs inspects the manifest.", did: "A named agent walks the file through: manifest, customs and permits, each checked off.", saw: "HOLD flips to CLEARED and you get the confirmation." },
  { id: "transit", from: 0.58, to: 0.76, kicker: "05 · Long haul", title: "Two more borders, same discipline", happened: "Two more crossings lie ahead.", did: "Same checklist, a named agent at each, staged before we arrive.", saw: "Every checkpoint logged as it clears, and the delay clock stays managed." },
  { id: "final", from: 0.76, to: 0.94, kicker: "06 · Final gate", title: "The last crossing into the DRC", happened: "The final border stands between the cargo and its destination.", did: "Documents re-verified and the load seal checked against the log before the gate.", saw: "The seal number and clearance status, shared the moment they're confirmed." },
  { id: "delivered", from: 0.94, to: 1.0001, kicker: "07 · Delivered", title: "Exposure back to zero", happened: "The truck reaches Lubumbashi.", did: "Seal checked, load handed over, proof of delivery captured.", saw: "R 2,000,000 delivered, with the whole journey on record." },
];
