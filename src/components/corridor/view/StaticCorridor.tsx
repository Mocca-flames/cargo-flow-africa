import { BEATS } from "../config";
import { BeatCopy } from "./BeatCopy";

/**
 * Reduced-motion fallback: no pin, no scrub, no SVG — just the beats stacked
 * as a readable article. Shown when prefers-reduced-motion is on (see
 * useReducedMotion + the branch in CorridorRun).
 *
 * Keep this in sync with the animated experience at a content level: if you
 * add a HUD stat or a new visual beat, consider whether the static list
 * needs a matching line. Styles live in CorridorCommon.css (.corridor__static*).
 */
export function StaticCorridor() {
  return (
    <section id="corridor-section" className="corridor__static" aria-labelledby="ch6-title" data-chapter="6">
      <h2 id="ch6-title" className="corridor__static-head">Corridor &amp; Clearance</h2>
      {BEATS.map((b) => (
        <article key={b.id} className="corridor__static-beat"><BeatCopy b={b} /></article>
      ))}
    </section>
  );
}
