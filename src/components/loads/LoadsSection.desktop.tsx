"use client";

import { useCallback, useRef, useState } from "react";
import LoadPlanDesktop from "./LoadPlan.desktop";
import { useLoadsProgress } from "./useLoadsProgress";
import { useReveal } from "./useReveal";
import { loadTotals, loadsCopy } from "@/data/loads";
import "./LoadsCommon.css";

/**
 * Ch5 desktop — the full section.
 *
 * Extracted from `LoadsSection.tsx` so the mobile branch can own its own
 * section element, sticky frame and hooks without any of this running on
 * mobile. The viewport switch lives in `LoadsSection.tsx`; this component
 * only mounts on `min-width: 768px`.
 *
 * Behaviour is unchanged from the original `LoadsSection`: a 284.5svh track
 * with a sticky inner frame, `useLoadsProgress` driving the load falls, and
 * `useReveal` gating the entrance animation.
 */
export default function LoadsSectionDesktop({ reduced }: { reduced: boolean }) {
  const trackRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const blockRefs = useRef<(HTMLElement | null)[]>([]);

  const [landed, setLanded] = useState(loadTotals.units);
  const entered = useReveal(trackRef);

  const onStep = useCallback((next: number) => setLanded(next), []);

  useLoadsProgress({
    trackRef,
    frameRef,
    blockRefs,
    onStep,
    enabled: !reduced,
  });

  return (
    <section
      id="loads-section"
      ref={trackRef}
      className={["loads", entered ? "loads--entered" : ""].filter(Boolean).join(" ")}
      aria-labelledby="loads-heading"
    >
      <div className="loads__frame" ref={frameRef}>
        <header className="loads__header">
          <h2 className="loads__heading" id="loads-heading">
            {loadsCopy.heading}
          </h2>
          <p className="loads__standfirst">{loadsCopy.standfirst}</p>
          <p className="loads__note">{loadsCopy.sharedTrailerNote}</p>
        </header>

        <LoadPlanDesktop blockRefs={blockRefs} landed={landed} />
      </div>
    </section>
  );
}
