"use client";

import { useSyncExternalStore } from "react";
import LoadsSectionDesktop from "./LoadsSection.desktop";
import LoadPlanMobile from "./LoadPlan.mobile";

/**
 * Ch5 — The Loads. Viewport switch.
 *
 * Two fully separate branches, one per breakpoint:
 *
 *   Desktop (min-width: 768px)  →  `LoadsSectionDesktop`
 *   Mobile  (max-width: 767px)   →  `LoadPlanMobile` (owns the whole section)
 *
 * Only one branch is ever mounted, so each owns its own `id="loads-section"`,
 * its own h2, its own sticky frame and its own scroll hooks — nothing from
 * the inactive branch runs. The server snapshot is mobile-first (`false` for
 * desktop) so SSR and the first client render agree with no hydration
 * mismatch.
 *
 * Reduced-motion is detected here and passed down: both branches need it,
 * and `useSyncExternalStore` is a cheap `matchMedia` subscription — it is
 * not a scroll hook and does not violate the "no hooks for the inactive
 * branch" rule (the heavy hooks live inside each child).
 */
export default function LoadsSection() {
  const desktop = useIsDesktop();
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    getReducedMotionServer
  );

  return desktop ? (
    <LoadsSectionDesktop reduced={reducedMotion} />
  ) : (
    <LoadPlanMobile reduced={reducedMotion} />
  );
}

/* ─── Viewport ───
    `useSyncExternalStore` with `matchMedia` — the same pattern Ch1's
    `HeroScene` uses to gate its variants. The server snapshot is `false`
    (mobile) so SSR renders the mobile branch; the store reports the real
    value on the very next client render with no `mounted` flag and no
    cascading setState. */

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
    The server snapshot returns `true`, so SSR, the first client render and
    reduced-motion browsers all agree on the settled (loaded) plan and the
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
