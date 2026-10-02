"use client";

import { useEffect, type RefObject } from "react";

const EASE_IN_OUT_CUBIC = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const EASE_OUT_CUBIC = (t: number): number => 1 - Math.pow(1 - t, 3);

const EASE_IN_CUBIC = (t: number): number => t * t * t;

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

const clamp = (v: number, min: number, max: number): number =>
  Math.min(Math.max(v, min), max);

const setVar = (stage: HTMLElement, name: string, value: number): void => {
  stage.style.setProperty(name, value.toFixed(4));
};

const setLength = (stage: HTMLElement, name: string, value: number): void => {
  stage.style.setProperty(name, `${value.toFixed(2)}px`);
};

type Bounds = {
  v1End: number;
  gateEnd: number;
  v2End: number;
  latchPx: number;
  latchFrac: number;
};

const DEFAULT_BOUNDS: Bounds = {
  v1End: 120,
  gateEnd: 190,
  v2End: 400,
  latchPx: 6,
  latchFrac: 0.12,
};

const readNumber = (stage: HTMLElement, name: string, fallback: number): number => {
  const raw = window.getComputedStyle(stage).getPropertyValue(name);
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const readBounds = (stage: HTMLElement): Bounds => {
  const v1End = readNumber(stage, "--seg-v1-end", DEFAULT_BOUNDS.v1End);
  const gateEnd = readNumber(stage, "--seg-gate-end", DEFAULT_BOUNDS.gateEnd);
  const v2End = readNumber(stage, "--seg-v2-end", DEFAULT_BOUNDS.v2End);

  return {
    v1End: v1End > 0 ? v1End : DEFAULT_BOUNDS.v1End,
    gateEnd: gateEnd > v1End ? gateEnd : DEFAULT_BOUNDS.gateEnd,
    v2End: v2End > gateEnd ? v2End : DEFAULT_BOUNDS.v2End,
    latchPx: Math.max(
      readNumber(stage, "--gate-latch-px", DEFAULT_BOUNDS.latchPx),
      0,
    ),
    latchFrac: clamp(
      readNumber(stage, "--gate-latch-frac", DEFAULT_BOUNDS.latchFrac),
      0,
      1,
    ),
  };
};

/**
 * Piecewise gate curve: the first `latchFrac` of the segment settles the slab
 * downward to `latchPx` (easeOut), the remainder drives the committed lift to
 * -102% (easeInCubic) starting from that settled position.
 *
 * `latch` is the px half of the translateY; `pg` is the 0-1 half, so the slab
 * reads it as `calc(var(--pg) * -102% + var(--gate-latch))`.
 */
const gateEase = (
  raw: number,
  latchPx: number,
  latchFrac: number,
): { pg: number; latch: number } => {
  if (latchFrac > 0 && raw <= latchFrac) {
    return { pg: 0, latch: latchPx * EASE_OUT_CUBIC(raw / latchFrac) };
  }

  const u = latchFrac < 1 ? (raw - latchFrac) / (1 - latchFrac) : 0;
  const eased = EASE_IN_CUBIC(clamp01(u));

  return { pg: eased, latch: latchPx * (1 - eased) };
};

/**
 * Scroll driver for the desktop hero: three pinned beats measured in vh of
 * scroll distance inside the track.
 *
 *   --p1 / --pe1  0vh    -> 120vh  V1 dolly (pe1 = easeInOutCubic, the old --pe)
 *   --pg          120vh  -> 190vh  gate lift (piecewise, eased in JS)
 *   --p2          190vh  -> 400vh  V2 route (linear, Step 5)
 *
 * Segment bounds come from CSS (--seg-v1-end / --seg-gate-end / --seg-v2-end)
 * so they stay tunable next to --hero-track. Everything is written straight
 * onto the stage with style.setProperty from one rAF-throttled scroll
 * listener — no React state. Below `prefers-reduced-motion: reduce` every
 * segment stays at 0 and the hero rests on its approved static layout.
 */
export function useHeroScroll(stageRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    setVar(stage, "--p1", 0);
    setVar(stage, "--pe1", 0);
    setVar(stage, "--pg", 0);
    setLength(stage, "--gate-latch", 0);
    setVar(stage, "--p2", 0);
    stage.classList.remove("gate-done");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const track = stage.parentElement;
    if (!track) return;

    let rafId = 0;
    let bounds = readBounds(stage);

    const measure = () => {
      rafId = 0;
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const scrolledVh =
        scrollable > 0 ? (clamp(-rect.top, 0, scrollable) / window.innerHeight) * 100 : 0;

      const { v1End, gateEnd, v2End, latchPx, latchFrac } = bounds;

      const p1 = clamp01(scrolledVh / v1End);
      const pe1 = EASE_IN_OUT_CUBIC(p1);
      const gateRaw = clamp01((scrolledVh - v1End) / (gateEnd - v1End));
      const { pg, latch } = gateEase(gateRaw, latchPx, latchFrac);
      const p2 = clamp01((scrolledVh - gateEnd) / (v2End - gateEnd));

      setVar(stage, "--p1", p1);
      setVar(stage, "--pe1", pe1);
      setVar(stage, "--pg", pg);
      setLength(stage, "--gate-latch", latch);
      setVar(stage, "--p2", p2);
      stage.classList.toggle("gate-done", pg >= 1);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(measure);
    };

    const onResize = () => {
      bounds = readBounds(stage);
      onScroll();
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [stageRef]);
}
