"use client";

import { loadTotals, loadsCopy, loadsDeck } from "@/data/loads";

/**
 * The mono load sheet.
 *
 * The counter is driven by the landing progress, so it ticks as each block
 * settles: `00 / 05 · 0.0 T` → `05 / 05 · 39.2 T`. Under reduced motion (and
 * no-JS/SSR) the scrub never runs, so it renders the settled `05 / 05`
 * figures from the start — the sheet is never stranded mid-count.
 *
 * DESIGN.md is explicit that mono is never used alone — hence the Sora label
 * above it and the coordinate line under it. The whole figure is a live
 * visual readout (no `aria-live`), so it updates silently for assistive tech
 * while `LoadPlan` carries the one spoken description of the load.
 */
export default function LoadsSheet({
  landed,
  tonnes,
}: {
  /** Loads fully landed, 0–3. Drives the `NN / 03` counter. */
  landed: number;
  /** Tonnes on the deck at that step — `data/loads.ts` derives it. */
  tonnes: number;
}) {
  return (
    <div className="loads__sheet">
      <p className="loads__sheet-label">{loadsCopy.readoutLabel}</p>

      <p className="loads__sheet-line">
        <span className="loads__sheet-plate">{loadsDeck.fleetCode}</span>
        <span className="loads__sheet-value">
          {String(landed).padStart(2, "0")} / {String(loadTotals.units).padStart(2, "0")} · {tonnes.toFixed(1)} T
        </span>
      </p>
    </div>
  );
}