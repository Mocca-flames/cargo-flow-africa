"use client";

import { useEffect, type RefObject } from "react";

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
};

const DEFAULT_BOUNDS: Bounds = {
  aEnd: 70,
  bEnd: 130,
};

const readNumber = (stage: HTMLElement, name: string, fallback: number): number => {
  const raw = window.getComputedStyle(stage).getPropertyValue(name);
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const readBounds = (stage: HTMLElement): Bounds => {
  const aEnd = readNumber(stage, "--hm-seg-a-end", DEFAULT_BOUNDS.aEnd);
  const bEnd = readNumber(stage, "--hm-seg-b-end", DEFAULT_BOUNDS.bEnd);

  return {
    aEnd: aEnd > 0 ? aEnd : DEFAULT_BOUNDS.aEnd,
    bEnd: bEnd > aEnd ? bEnd : DEFAULT_BOUNDS.bEnd,
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

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

    const segmentPx = (svh: number): number => (svhPx * svh) / 100;

    const measure = () => {
      rafId = 0;
      const rect = track.getBoundingClientRect();
      const scrollTop = clamp(-rect.top, 0, Number.MAX_SAFE_INTEGER);

      const { aEnd, bEnd } = bounds;
      const aPx = segmentPx(aEnd);
      const bPx = segmentPx(bEnd);

      const paRaw = aPx > 0 ? clamp01(scrollTop / aPx) : 0;
      const pbRaw = bPx > aPx ? clamp01((scrollTop - aPx) / (bPx - aPx)) : 0;

      setVar(stage, "--pa", EASE_IN_OUT_CUBIC(paRaw));
      setVar(stage, "--pb", EASE_IN_CUBIC(pbRaw));
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

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
      ruler.remove();
    };
  }, [stageRef]);
}
