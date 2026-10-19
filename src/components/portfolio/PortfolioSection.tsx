"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import PortfolioDesktop from "./PortfolioDesktop";
import PortfolioMobile from "./PortfolioMobile";
import { useReveal } from "./useReveal";

/**
 * Portfolio — "Jobs We've Carried" (LANDING_LAYOUT.md section 10).
 *
 * The buyer's question here is "has anyone like me used you?", answered
 * by records and one attributed testimony. Copy lives in
 * `data/portfolio.ts`; every string there is placeholder marked
 * TODO(copy)/TODO(verify).
 *
 * Everything renders settled from the server: the JS entrance (armed →
 * entered, via `useReveal`) only adds an animation on top of a section
 * that is already complete without JS. Reduced motion never animates.
 *
 * Desktop and mobile are different drawings (a flagship card with a
 * side photo frame vs. a stacked column), so each is its own component
 * with its own stylesheet, gated by viewport like Corridor and Process.
 */
export default function PortfolioSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 700px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  /* Arms the entrance only in the browser: SSR paints the final state.
     An external store rather than an effect setState — the client flag
     is an environment fact; the server snapshot `false` matches the
     server's paint and the first client render agrees with it. */
  const armed = useSyncExternalStore(subscribeNoop, getArmed, getArmedServer);

  const entered = useReveal(rootRef, { enabled: armed });

  const className = [
    "portfolio",
    armed ? "portfolio--armed" : "",
    entered ? "portfolio--entered" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (isMobile === null) return null;

  return isMobile ? (
    <PortfolioMobile innerRef={rootRef} className={className} />
  ) : (
    <PortfolioDesktop innerRef={rootRef} className={className} />
  );
}

/* ─── Client-only flag as an external store ─── */

function subscribeNoop() {
  return () => {};
}

function getArmed() {
  return true;
}

function getArmedServer() {
  return false;
}
