"use client";

import { useRef } from "react";
import LoadsExplodedView from "./LoadsExplodedView";
import LoadsSheet from "./LoadsSheet";
import { useReveal } from "./useReveal";
import { loadsCopy } from "@/data/loads";
import "./LoadsCommon.css";

/**
 * Ch5 as a single contained screen, for the two contexts that cannot run the
 * pinned 3D sequence: `prefers-reduced-motion: reduce`, and any browser
 * without WebGL (`components/loads/webgl.ts`).
 *
 * This is a rendering of the chapter, not a fallback for it — LANDING_LAYOUT
 * asks for "a static exploded-view image of the load" and LANDING_DESIGN for
 * "static exploded-view render, same composition", so the drawing takes the
 * same low-and-off-axis seat the 3D gives the load, and the sheet sits where
 * it sits there.
 *
 * It is also what the server renders, before any capability check has run.
 * That is deliberate: the section must never be absent from the document,
 * and switching into the pinned version must not move anything on screen.
 */

export default function LoadsStatic() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const entered = useReveal(sectionRef);

  return (
    <section
      id="loads-section"
      ref={sectionRef}
      className={["loads", "loads--static", entered ? "loads--entered" : ""].filter(Boolean).join(" ")}
      aria-labelledby="loads-heading"
    >
      <div className="loads__static-inner">
        <header className="loads__header">
          <p className="loads__eyebrow">
            <span className="loads__eyebrow-index">05</span> / {loadsCopy.eyebrow}
          </p>
          <h2 className="loads__heading" id="loads-heading">
            {loadsCopy.heading}
          </h2>
          <p className="loads__standfirst">{loadsCopy.standfirst}</p>
        </header>

        <div className="loads__figure">
          <LoadsExplodedView />
        </div>

        <footer className="loads__foot">
          <LoadsSheet kind="static" />
          <a className="loads__link" href="/loads">
            <span className="loads__link-rule" aria-hidden="true" />
            {loadsCopy.cta}
          </a>
        </footer>
      </div>
    </section>
  );
}