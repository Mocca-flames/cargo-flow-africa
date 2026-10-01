"use client";

import { useEffect, type RefObject } from "react";

const EASE_IN_OUT_CUBIC = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

const setVar = (stage: HTMLElement, name: string, value: number): void => {
  stage.style.setProperty(name, value.toFixed(4));
};

/**
 * Scroll driver for the desktop hero dolly.
 *
 * Writes `--p` (raw progress) and `--pe` (easeInOutCubic progress) directly
 * onto the stage element from a single passive scroll listener throttled to
 * one rAF tick. No React state. Below `prefers-reduced-motion: reduce` the
 * dolly is frozen at 0 so the hero rests on its approved static layout.
 */
export function useHeroScroll(stageRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    setVar(stage, "--p", 0);
    setVar(stage, "--pe", 0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const track = stage.parentElement;
    if (!track) return;

    let rafId = 0;

    const measure = () => {
      rafId = 0;
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const p =
        scrollable > 0 ? clamp01(-rect.top / scrollable) : 0;
      setVar(stage, "--p", p);
      setVar(stage, "--pe", EASE_IN_OUT_CUBIC(p));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [stageRef]);
}
