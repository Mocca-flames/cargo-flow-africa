"use client";

import { useEffect, type RefObject } from "react";

/* Fired on the stage after the scroll vars are written, so children read fresh values. */
export const HERO_PROGRESS_EVENT = "hm:progress";

const EASE_IN_OUT_CUBIC = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const EASE_IN_CUBIC = (t: number): number => t * t * t;

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

const clamp = (v: number, min: number, max: number): number =>
  Math.min(Math.max(v, min), max);

const setVar = (stage: HTMLElement, name: string, value: number): void => {
  stage.style.setProperty(name, value.toFixed(4));
};

type Bounds = {
  aEnd: number;
  bEnd: number;
  cEnd: number;
};

const DEFAULT_BOUNDS: Bounds = {
  aEnd: 70,
  bEnd: 130,
  cEnd: 530,
};

/* p: route-segment progress; r: fraction of the route covered (holds at each checkpoint). */
const routeProgressSteps = [
  { p: 0, r: 0 },
  { p: 0.08, r: 0 },
  { p: 0.35, r: 0.3 },
  { p: 0.55, r: 0.52 },
  { p: 0.7, r: 0.75 },
  { p: 0.88, r: 0.75 },
  { p: 1, r: 1 },
] as const;

const getRouteProgress = (p: number): number => {
  for (let i = 1; i < routeProgressSteps.length; i += 1) {
    const previous = routeProgressSteps[i - 1];
    const current = routeProgressSteps[i];

    if (p <= current.p) {
      const span = current.p - previous.p || 1;
      return previous.r + ((current.r - previous.r) * (p - previous.p)) / span;
    }
  }

  return 1;
};

const readNumber = (stage: HTMLElement, name: string, fallback: number): number => {
  const raw = window.getComputedStyle(stage).getPropertyValue(name);
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const readBounds = (stage: HTMLElement): Bounds => {
  const aEnd = readNumber(stage, "--hm-seg-a-end", DEFAULT_BOUNDS.aEnd);
  const bEnd = readNumber(stage, "--hm-seg-b-end", DEFAULT_BOUNDS.bEnd);
  const cEnd = readNumber(stage, "--hm-seg-c-end", DEFAULT_BOUNDS.cEnd);

  return {
    aEnd: aEnd > 0 ? aEnd : DEFAULT_BOUNDS.aEnd,
    bEnd: bEnd > aEnd ? bEnd : DEFAULT_BOUNDS.bEnd,
    cEnd: cEnd > bEnd ? cEnd : DEFAULT_BOUNDS.cEnd,
  };
};

const createSvhRuler = (): HTMLElement => {
  const ruler = document.createElement("div");
  ruler.style.cssText =
    "position:fixed;top:-100%;left:0;height:100svh;width:1px;pointer-events:none;opacity:0;z-index:-1;";
  document.body.appendChild(ruler);
  return ruler;
};

export function useHeroScrollMobile(stageRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    setVar(stage, "--pa", 0);
    setVar(stage, "--pb", 0);
    setVar(stage, "--pr", 0);
    setVar(stage, "--r", 0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVar(stage, "--pr", 1);
      setVar(stage, "--r", 1);
      return;
    }

    const track = stage.parentElement;
    if (!track) return;

    let rafId = 0;
    let bounds = readBounds(stage);
    let lastWidth = window.innerWidth;
    let svhPx = 0;

    const ruler = createSvhRuler();
    const measureSvh = () => {
      svhPx = ruler.offsetHeight;
    };
    measureSvh();

    const SWIPE_SPEED = 4; // 1.5–3, higher = more sensitive

    const segmentPx = (svh: number): number => (svhPx * svh) / 100 / SWIPE_SPEED;

    const measure = () => {
      rafId = 0;
      const rect = track.getBoundingClientRect();
      const scrollTop = clamp(-rect.top, 0, Number.MAX_SAFE_INTEGER);

      const { aEnd, bEnd, cEnd } = bounds;
      const aPx = segmentPx(aEnd);
      const bPx = segmentPx(bEnd);
      const cPx = segmentPx(cEnd);

      const paRaw = aPx > 0 ? clamp01(scrollTop / aPx) : 0;
      const pbRaw = bPx > aPx ? clamp01((scrollTop - aPx) / (bPx - aPx)) : 0;
      const prRaw = cPx > bPx ? clamp01((scrollTop - bPx) / (cPx - bPx)) : 0;

      setVar(stage, "--pa", EASE_IN_OUT_CUBIC(paRaw));
      setVar(stage, "--pb", EASE_IN_CUBIC(pbRaw));
      setVar(stage, "--pr", prRaw);
      setVar(stage, "--r", getRouteProgress(prRaw));
      stage.dispatchEvent(new Event(HERO_PROGRESS_EVENT));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(measure);
    };

    const onResize = () => {
      const width = window.innerWidth;
      if (width === lastWidth) return;
      lastWidth = width;
      bounds = readBounds(stage);
      measureSvh();
      onScroll();
    };

    const coarse = window.matchMedia("(hover: none) and (pointer: coarse)");
    const scroller = coarse.matches ? document.getElementById("app-scroller") : null;
    const target: HTMLElement | Window = scroller ?? window;

    measure();
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
      ruler.remove();
    };
  }, [stageRef]);
}
