"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import LoadPlanDesktop from "./LoadPlan.desktop";
import LoadPlanMobile from "./LoadPlan";
import LoadsSheet from "./LoadsSheet";
import { useLoadsProgress } from "./useLoadsProgress";
import { useReveal } from "./useReveal";
import { cumulativeTonnes, loadTotals, loadsCopy } from "@/data/loads";
import "./LoadsCommon.css";

/**
 * Ch5 — The Loads. The breath.
 *
 * A 284.5vh track with a sticky inner frame, in FOUR steps of ~45vh of
 * scroll: three landings and then a dwell. Scroll position drives the plan —
 * each load falls into the deck's dashed footprint, turns its slot solid and
 * ticks the load sheet (00 / 03 · 0.0 T → 03 / 03 · 34.0 T). The dwell that
 * follows has no new landing: the finale is already up — counter at 03 / 03,
 * the manifest card reading "34.0 T · 3 loads · 1 truck", the "See how we
 * load" link faded in — and the section just stays pinned while it reads.
 *
 * ── Two components, one per viewport ──
 * Desktop and mobile are genuinely different drawings, not one drawing
 * responsive: the side elevation is a wide stage with the freight standing ON a
 * deck line, while the top view is a tall narrow stage with the freight laid
 * INSIDE the deck as footprints. So each is its own component with its own
 * geometry and stylesheet, and this section picks one by viewport — only one
 * projection is ever in the tree, which is what lets each own its own ids,
 * refs and CSS without either reaching into the other.
 *
 * `CorridorMap` is built and ready but deliberately NOT mounted; see the note
 * in `LoadPlan.desktop.tsx` for where to reintroduce it.
 *
 * No scroll-jacking, no ScrollControls, no 3D — the frame lock is pure CSS
 * (a tall track plus `position: sticky`, the shape Ch2 uses), and the only
 * thing JS supplies is a 0→1 progress number. There is no section-level
 * `scroll-snap-align` here: Ch3 owns the page's only root snap.
 *
 * Rendering is progressive. The server (and no-JS, and reduced motion) render
 * the plan already loaded — every load settled, the counter at 03 / 03, the
 * finale up — because those are the states where nothing is moving. The scrub
 * only engages in the browser once the section is on screen.
 */
export default function LoadsSection() {
  const trackRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const blockRefs = useRef<(HTMLElement | null)[]>([]);

  const desktop = useIsDesktop();

  /* Reduced motion: render the fully loaded state and never scrub. The
     server snapshot is `true` so SSR/CSR agree on the settled plan. */
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer
  );

  const [landed, setLanded] = useState(loadTotals.units);
  const entered = useReveal(trackRef);

  const onStep = useCallback((next: number) => setLanded(next), []);

  useLoadsProgress({
    trackRef,
    frameRef,
    blockRefs,
    onStep,
    enabled: !reducedMotion,
  });

  return (
    <section
      id="loads-section"
      ref={trackRef}
      className={["loads", entered ? "loads--entered" : ""].filter(Boolean).join(" ")}
      aria-labelledby="loads-heading"
    >
      <div className="loads__frame" ref={frameRef}>
        {/* h2 only. The eyebrow, the standfirst and the origin chips are gone:
            the manifest card and the load sheet carry the chapter's information
            now, and the plan is the picture. */}
        <header className="loads__header">
          <h2 className="loads__heading" id="loads-heading">
            {loadsCopy.heading}
          </h2>
        </header>

        {desktop ? (
          <LoadPlanDesktop blockRefs={blockRefs} landed={landed} />
        ) : (
          <LoadPlanMobile blockRefs={blockRefs} landed={landed} />
        )}

        {/* The load sheet is mobile's readout; desktop's link lives below the
            trailer inside its own component. */}
        {desktop ? null : (
          <footer className="loads__foot">
            <LoadsSheet landed={landed} tonnes={cumulativeTonnes(landed)} />
          </footer>
        )}
      </div>
    </section>
  );
}

/* ─── Viewport ───
   The two projections are different components, so the choice cannot be left to
   a CSS media query the way it was when both projections shared one component.
   This is the same `useSyncExternalStore` pattern Ch1's `HeroScene` uses to
   gate its variants, for the same reason: matchMedia is a subscription, which
   is exactly what the hook wants.

   There is no correct answer before hydration — the server has no viewport —
   so the server snapshot is `false` (mobile) and the first client render agrees
   with it. The store then reports the real value on the very next render, which
   is why `getIsDesktop` is safe to read directly: `useSyncExternalStore`
   returns the SERVER snapshot during hydration and the client snapshot
   immediately after, with no `mounted` flag and no cascading setState. */

function useIsDesktop() {
  return useSyncExternalStore(subscribeDesktop, getIsDesktop, getIsDesktopServer);
}

function subscribeDesktop(onChange: () => void) {
  const mql = window.matchMedia("(min-width: 768px)");
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getIsDesktop() {
  return window.matchMedia("(min-width: 768px)").matches;
}

function getIsDesktopServer() {
  return false;
}

/* ─── Reduced-motion media query as an external store ───
   matchMedia is a subscription, which is exactly what useSyncExternalStore
   wants. The server snapshot returns `true`, so SSR, the first client render
   and reduced-motion browsers all agree on the settled (loaded) plan and the
   frame never flashes an empty deck. */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

function getReducedMotionServer() {
  return true;
}