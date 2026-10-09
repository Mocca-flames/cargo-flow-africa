"use client";

import TrailerTop from "./TrailerTop";
import { topBlockStyle } from "./planGeometry";
import { landingCaption, loadPlan, loadTotals, loadsCopy, loadsDeck } from "@/data/loads";

/**
 * Ch5 MOBILE — the vertical top view.
 *
 * The trailer read from above, rotated so the deck's long axis runs down the
 * screen: kingpin and landing gear at the top (front), rear bumper at the
 * bottom. Cargo is a FOOTPRINT inside the deck rectangle rather than a load
 * stacked on a top edge, because a plan view has no "above" — which is why the
 * two projections need different geometry rather than one drawing rotated.
 *
 * Desktop's side elevation and its manifest card are a separate component
 * (`LoadPlan.desktop.tsx`) with its own stylesheet. They share this file's data
 * and the scrub hook, and nothing else.
 *
 * Desktop is never asked to render this: `LoadsSection` picks the component by
 * viewport, so only one projection is ever in the tree.
 */
export default function LoadPlanMobile({
  blockRefs,
  landed,
}: {
  /** The scrub writes `--land-t` onto these, in `loadPlan` order. */
  blockRefs: React.RefObject<(HTMLElement | null)[]>;
  /** Loads fully landed, 0-3. A slot turns solid at its own step. */
  landed: number;
}) {
  /* One audible description of the whole plan. The drawing is decorative; this
     line is what a screen reader actually hears. */
  const summary = [
    `Load plan on flatdeck ${loadsDeck.fleetCode}, a ${loadsDeck.deckLengthM} metre deck filled from ${loadTotals.units} yards.`,
    ...loadPlan.map(
      (unit) =>
        `${unit.code}, ${unit.yard} - ${unit.commodity}, ${unit.tonnes.toFixed(1)} tonnes, bound for ${unit.destination}, ${unit.country}.`
    ),
    `Total ${loadTotals.tonnes.toFixed(1)} tonnes: ${loadTotals.units} shippers on one truck from ${loadPlan.map((u) => u.yard).join(", ")}.`,
  ].join(" ");

  return (
    <>
      <div className="loads__plan loads__plan--top">
        <div className="loads__grid" aria-hidden="true" />
        <div className="loads__stage">
          <TrailerTop />

          {/* Dashed empty footprints from first paint, labelled S1-S3, so the
              deck is honestly empty until a load arrives. */}
          {loadPlan.map((unit, index) => (
            <span
              key={unit.id}
              className="loads__slot"
              data-index={index}
              data-filled={landed > index ? "true" : "false"}
              style={topBlockStyle(unit)}
            >
              <span className="loads__slot-code">{unit.code}</span>
            </span>
          ))}

          {/* The loads. `--land-t` (0->1) is written per frame by the scrub and
              the footprint settles by scaling into place. */}
          {loadPlan.map((unit, index) => (
            <div
              key={unit.id}
              ref={(node) => {
                blockRefs.current[index] = node;
              }}
              className="loads__block"
              data-index={index}
              style={topBlockStyle(unit)}
            >
              <span className="loads__label">
                <span className="loads__label-name">{unit.commodity}</span>
                <span className="loads__label-mass">
                  {unit.tonnes.toFixed(1)} T
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-landing caption, and the load sheet in the foot. */}
      <p className="loads__caption" aria-live="polite">
        {landed > 0
          ? landingCaption(loadPlan[landed - 1])
          : loadsCopy.captionIdle}
      </p>

      <p className="loads__sr">{summary}</p>
    </>
  );
}
