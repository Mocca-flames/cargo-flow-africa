"use client";

import CargoFertiliser from "./CargoFertiliser";
import CargoSteel from "./CargoSteel";
import CargoSulphur from "./CargoSulphur";
import TrailerSide from "./TrailerSide";
import { sideBlockStyle } from "./planGeometry";
import { loadPlan, loadTotals } from "@/data/loads";
import type { CargoId, LoadUnitId } from "@/data/loads";
import "./LoadPlan.desktop.css";

/**
 * Ch5 desktop — the load plan.
 *
 * The side elevation of the flatdeck with its three loads, and ONE cargo
 * manifest document sitting under the plan.
 *
 * ── The card sits UNDER the trailer ──
 * It used to track horizontally to whichever load was being lowered — a
 * measured `translate3d` that re-placed the card on every landing, floating
 * over the drawing. That was motion competing with the only motion this
 * chapter is allowed to have, and a plate on top of the freight. The card is
 * now a fixed box in normal flow directly BELOW the trailer, left-aligned
 * (the closing link keeps the right side of that same band). Same x, same y,
 * same box for the whole chapter: nothing is measured, nothing is observed,
 * nothing is written per frame — this component renders the drawing and the
 * card, and the scrub owns everything else.
 *
 * The box is a deliberate fixed width (CSS, not inline) so a longer commodity
 * name or route cannot resize it: the card is static in the literal sense.
 *
 * ── What it shows ──
 * The card is a CARGO MANIFEST: a fixed document frame whose figure block
 * (total weight, run summary) is derived from `loadTotals` and never changes.
 * Only the commodity field is dynamic. `landed` is the number of loads that
 * have settled (0–3); the field shows the load at index `landed` (the next to
 * fall), so its CONTENT changes only at a landing — the three beats the
 * chapter has. The field is keyed on the load id so React swaps it as one
 * node and the single row beneath the rules fades in; every other row keeps
 * its height, so nothing around it moves.
 *
 * ── Where the cargo waits ──
 * Before its step a load hangs above its slot, lifted by `--lift-pct` (a
 * percentage of the stage height, from `planGeometry.ts`) chosen so the top
 * 20% of the block is past the stage's top edge: the reader sees the bottom
 * 80% of a load hanging in mid-air, cut off by the frame — a high crane
 * holding it over the deck. The stage's `overflow: clip` does the cutting.
 * There is no opacity on any of it: a waiting load is fully opaque, and the
 * fall is one `translateY` driven by `--land-t`.
 */

export default function LoadPlanDesktop({
  blockRefs,
  landed,
}: {
  /** The scrub writes `--land-t` onto these, side-projection indices only. */
  blockRefs: React.RefObject<(HTMLElement | null)[]>;
  landed: number;
}) {
  const finished = landed >= loadTotals.units;
  const active = loadPlan[Math.min(landed, loadPlan.length - 1)];

  return (
    <div className="loads__plan loads__plan--desktop">
      <div className="loads__grid" aria-hidden="true" />

      <div className="loads__stage">
        <TrailerSide />

        {/* Dashed empty footprints from first paint, labelled S1–S3. */}
        {loadPlan.map((unit, index) => (
          <span
            key={unit.id}
            className="loads__slot"
            data-index={index}
            data-filled={landed > index ? "true" : "false"}
            style={sideBlockStyle(unit)}
          >
            <span className="loads__slot-code">{unit.code}</span>
          </span>
        ))}

        {/* The loads, each with its drop line. `--land-t` is written per frame
            by the scrub; the block turns it into a translateY (the fall) and
            the line — a child of the block — inherits the same value for free:
            no extra ref, no extra write, and it cannot drift out of step with
            the load it is lowering. The block carries NO opacity rule at all:
            a load is opaque for its whole life and is hidden, before its step,
            only by the stage's clip. */}
        {loadPlan.map((unit, index) => (
          <div
            key={unit.id}
            ref={(node) => {
              blockRefs.current[index] = node;
            }}
            className="loads__block"
            data-index={index}
            style={sideBlockStyle(unit)}
          >
            <span className="loads__drop" aria-hidden="true">
              <span className="loads__drop-hook" />
            </span>
            <CargoSvg id={unit.cargo.id} />
          </div>
        ))}
      </div>

      {/* ─── The cargo manifest ───
          In normal flow, directly BELOW the trailer, left-aligned — under the
          drawing, never over it. It does not move: no measured transform, no
          tracking the falling load. Its document frame is fixed; only the
          commodity field changes, and only when a load lands. */}
      <div className="loads__card">
        <div className="loads__card-inner" aria-live="polite">
          <span className="loads__card-doc">Cargo Manifest</span>

          {/* The run figure — derived from `loadTotals`, present for the whole
              chapter, so the document never reflows around it. */}
          <div className="loads__card-measure">
            <span className="loads__card-total">
              {loadTotals.tonnes.toFixed(1)} T
            </span>
            <span className="loads__card-measure-label">Cargo weight</span>
          </div>

          {/* The commodity field — the ONE thing that changes. Keyed on the
              load id: React swaps the whole field as a single node and the
              fade below re-runs, while the ruled rows around it keep their
              exact heights. */}
          <div className="loads__card-field" key={active.id}>
            <div className="loads__card-commodity-row">
              <span className="loads__card-commodity">
                {COMMODITY_LABEL[active.id]}
              </span>
              <span className="loads__card-field-label">Commodity</span>
            </div>
            <span className="loads__card-meta">
              {active.tonnes.toFixed(1)} T <span aria-hidden="true">·</span>{" "}
              {active.yard} <span aria-hidden="true">→</span>{" "}
              {active.destination}, {active.country}
            </span>
          </div>

          <span className="loads__card-summary">
            {loadTotals.units} loads <span aria-hidden="true">·</span> 1 truck
          </span>
        </div>
      </div>

      {/* The link. On desktop it sits BELOW the trailer, right-aligned, and
          fades in after the third landing. */}
      <a
        className="loads__link loads__link--below"
        href="/loads"
        data-visible={finished ? "true" : "false"}
        tabIndex={finished ? undefined : -1}
        aria-hidden={finished ? undefined : true}
      >
        <span className="loads__link-rule" aria-hidden="true" />
        See how we load
      </a>
    </div>
  );
}

/** The manifest's wording for each load's commodity, keyed by the plan's own
    ids. The data (`data/loads.ts`) stays the single source of truth for what
    travels; this is only how the document names it, and it must stay in step
    with the drawings standing on the deck. */
const COMMODITY_LABEL: Record<LoadUnitId, string> = {
  "steel-coil": "STEEL COILS",
  sulphur: "SULPHUR",
  fertiliser: "BAGGED FERTILISER",
};

/** The freight drawing for a commodity. Every one is drawn in the same ink /
    opacity language as the trailer and the blueprint grid, so the three read as
    a set rather than as three separate illustrations. */
function CargoSvg({ id }: { id: CargoId }) {
  switch (id) {
    case "sulphur":
      return <CargoSulphur />;
    case "steel-coil":
      return <CargoSteel />;
    case "fertiliser":
      return <CargoFertiliser />;
    default:
      return null;
  }
}
