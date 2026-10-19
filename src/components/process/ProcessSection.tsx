"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import ProcessDesktop from "./ProcessDesktop";
import ProcessMobile from "./ProcessMobile";
import { useReveal } from "./useReveal";

/**
 * Process — "How a Job Runs" (LANDING_LAYOUT.md section 11).
 *
 * Three steps, one screen, answering the buyer's last friction question
 * — what happens after they send a job — then handing them to the
 * Verdict's quote form. Copy lives in `data/process.ts`; every string
 * there is placeholder marked TODO(copy).
 *
 * Everything renders settled from the server: the JS entrance (armed →
 * entered, via `useReveal`) only adds an animation on top of a section
 * that is already complete without JS. Reduced motion never arms it, so
 * the section is fully static exactly as it renders.
 *
 * Desktop and mobile are genuinely different drawings (a horizontal
 * five-column row vs. a vertical stack), so each is its own component
 * with its own stylesheet, gated by viewport like Corridor — only one
 * is ever in the tree.
 */
export default function ProcessSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  /* Arms the entrance only in the browser: SSR paints the final state.
     An external store rather than an effect setState — the client flag
     is an environment fact, and this reports it without a cascading
     render. Server snapshot `false` matches the server's paint; the
     very next client render reports `true`. */
  const armed = useSyncExternalStore(subscribeNoop, getArmed, getArmedServer);

  const entered = useReveal(rootRef, { enabled: armed });

  const className = [
    "process",
    armed ? "process--armed" : "",
    entered ? "process--entered" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (isMobile === null) return null;

  return isMobile ? (
    <ProcessMobile innerRef={rootRef} className={className} />
  ) : (
    <ProcessDesktop innerRef={rootRef} className={className} />
  );
}

/* ─── Client-only flag as an external store ───
   "Armed" is simply "we're in the browser". The subscribe is inert
   because the answer never changes during a session, which is exactly
   the shape `useSyncExternalStore` wants; the server snapshot is
   `false` so SSR and the first client render agree. */

function subscribeNoop() {
  return () => {};
}

function getArmed() {
  return true;
}

function getArmedServer() {
  return false;
}
