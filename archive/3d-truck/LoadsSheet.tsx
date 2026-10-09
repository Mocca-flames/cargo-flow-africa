"use client";

import { loadTotals, loadsCopy, loadsDeck } from "@/data/loads";

/**
 * The mono load sheet, in both of its forms.
 *
 * `live` is the pinned 3D chapter: the two values are empty spans written
 * from `useFrame` as the cargo lands, because re-rendering the section on
 * every frame of a ~200vh scrub would cost more than the whole 3D scene. A
 * visually hidden line carries the settled figures for screen readers — a
 * value changing 60 times a second is noise, not information.
 *
 * `static` is the fallback render: no canvas, no frame loop, so the same
 * markup with the totals written straight in.
 *
 * DESIGN.md is explicit that mono is never used alone — hence the Sora label
 * above it and the shipment line under it.
 */

type LoadsSheetProps =
  | { kind: "live"; readoutRef: React.RefObject<HTMLElement | null>; chipRef: React.RefObject<HTMLElement | null> }
  | { kind: "static" };

export default function LoadsSheet(props: LoadsSheetProps) {
  const live = props.kind === "live";
  const readoutRef = live ? props.readoutRef : undefined;
  const chipRef = live ? props.chipRef : undefined;

  return (
    <div className="loads__sheet">
      <p className="loads__sheet-label">{loadsCopy.readoutLabel}</p>

      <p className="loads__sheet-line">
        <span className="loads__sheet-plate">{loadsDeck.fleetCode}</span>
        {live ? (
          <>
            <span className="loads__sheet-value" ref={readoutRef} />
            <span className="loads__sheet-chip" ref={chipRef} aria-hidden="true">
              LASHED
            </span>
          </>
        ) : (
          <span className="loads__sheet-value">
            {String(loadTotals.units).padStart(2, "0")} / {String(loadTotals.units).padStart(2, "0")} · {loadTotals.tonnes.toFixed(1)} T
          </span>
        )}
      </p>

      {live && (
        <p className="loads__sheet-static">
          {`${loadsDeck.fleetCode} load sheet: ${loadTotals.units} shippers, ${loadTotals.pieces} pieces, ${loadTotals.tonnes.toFixed(1)} tonnes, strapped.`}
        </p>
      )}

      <p className="loads__sheet-site" aria-hidden="true">
        <span className="loads__sheet-dot" />
        {loadsDeck.siteCoords}
      </p>
    </div>
  );
}