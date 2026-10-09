"use client";

import { useRef } from "react";
import LoadScene from "./loadScene";
import LoadsSheet from "./LoadsSheet";
import { useLoadsScroll } from "./useLoadsScroll";
import { useReveal } from "./useReveal";
import { loadsCopy } from "@/data/loads";
import "./LoadsCommon.css";

export type LoadsVariant = "desktop" | "mobile";

/**
 * Ch5's pinned sequence.
 *
 * The viewport lock is CSS, not JS: a 300vh track with a `position: sticky`
 * stage, the same shape Ch2 uses. That means no pin-spacer, so nothing here
 * fights Ch3's `scroll-snap-align: start` or the root's proximity snap, and
 * there is no ScrollTrigger to kill on unmount. The only thing JS supplies is
 * a 0→1 progress number for the scene to read (`useLoadsScroll`).
 *
 * Three movements across the track, per LANDING_LAYOUT.md: an empty deck, a
 * long slow descent of five shippers, and the lashing. Pacing lives in
 * `data/loads.ts`.
 */
export default function LoadsPinned({ variant }: { variant: LoadsVariant }) {
  const trackRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLSpanElement | null>(null);
  const chipRef = useRef<HTMLSpanElement | null>(null);

  const progressRef = useLoadsScroll(trackRef, stageRef, false);
  const entered = useReveal(trackRef);

  return (
    <section
      id="loads-section"
      ref={trackRef}
      className={["loads", "loads--pinned", `loads--${variant}`, entered ? "loads--entered" : ""]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby="loads-heading"
    >
      <div ref={stageRef} className="loads__stage">
        <div className="loads__canvas">
          <LoadScene
            variant={variant}
            progressRef={progressRef}
            readoutRef={readoutRef}
            chipRef={chipRef}
          />
        </div>

        <header className="loads__header">
          <p className="loads__eyebrow">
            <span className="loads__eyebrow-index">05</span> / {loadsCopy.eyebrow}
          </p>
          <h2 className="loads__heading" id="loads-heading">
            {loadsCopy.heading}
          </h2>
          <p className="loads__standfirst">{loadsCopy.standfirst}</p>
        </header>

        <footer className="loads__foot">
          <LoadsSheet kind="live" readoutRef={readoutRef} chipRef={chipRef} />
          <a className="loads__link" href="/loads">
            <span className="loads__link-rule" aria-hidden="true" />
            {loadsCopy.cta}
          </a>
        </footer>
      </div>
    </section>
  );
}