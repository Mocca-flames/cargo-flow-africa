"use client";

import { useSyncExternalStore } from "react";

/**
 * Tracks the OS-level `prefers-reduced-motion: reduce` setting.
 *
 * HOW TO USE: any component that scroll-scrubs or pins should read this and
 * fall back to a static layout when `true` (see StaticCorridor for the
 * pattern). Implemented as a media-query external store — the same pattern
 * LoadsSection uses — so there is no setState-in-effect and no `mounted`
 * flag: matchMedia is a subscription, which is exactly what
 * useSyncExternalStore wants.
 *
 * The server snapshot is `false` (motion on): the animated markup is what
 * SSR should ship, and reduced-motion browsers flip to the static article
 * on the first client render.
 */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(REDUCED_MOTION).matches;
}

function getServerSnapshot() {
  return false;
}
