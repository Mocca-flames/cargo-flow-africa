"use client";

import { useEffect, useRef } from "react";
import { loadPlan } from "@/data/loads";
import { sideBlockStyle } from "./planGeometry";

/**
 * Ch5 mobile: scroll scrub for the loading point.
 * Scroll position owns one 0→1 number; everything is derived from it.
 * Rig is a 1200×340 unit box positioned via planGeometry.ts.
 * No layout reads outside measure(). No per-frame React state.
 */

const STAGE_W = 1200;
const STAGE_H = 340;
const DECK_UNITS = 200 - 70;

/** Fall windows: one load at a time. (tightened for faster swipes) */
const FALLS: ReadonlyArray<readonly [number, number]> = [
  [0.05, 0.15],
  [0.34, 0.44],
  [0.63, 0.73],
];

/** Slide windows: [from, to, fromSlot, toSlot]. */
const SLIDES: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.22, 0.34, 0, 1],
  [0.51, 0.63, 1, 2],
];

const CARD_LANDED_AT = [0.15, 0.44, 0.73] as const;
const CARD_SUMMARY_AT = 0.84;
const LINK_AT = 0.9;

const DIP_START = 0.85;

/** Time-based easing constants (ms). Lower = snappier.
 *  Frame-rate independent, so cheap Android feels the same as desktop.
 *  Touch already has native momentum, so it needs very little extra smoothing.
 *  Set TAU_TOUCH = 1 for no smoothing on touch at all. */
const TAU_TOUCH = 28;
const TAU_WHEEL = 90;
const SNAP = 0.0005;

const LINE_MAX = 0.15;
const LINE_IN = 0.04;
const LINE_OUT = 1 - DIP_START;

const DIP_PX = 2;

type Slot = { centre: number };

const SLOTS: Slot[] = loadPlan.map((unit) => {
  const style = sideBlockStyle(unit);
  const left = units(parseFloat(style.left), STAGE_W);
  const width = units(parseFloat(style.width), STAGE_W);
  return { centre: left + width / 2 };
});

function units(percent: number, of: number) {
  return (percent / 100) * of;
}

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

function fallAt(index: number, p: number) {
  const [start, end] = FALLS[index];
  return clamp01((p - start) / (end - start));
}

function activeFall(p: number) {
  for (let i = 0; i < FALLS.length; i += 1) {
    if (p > FALLS[i][0] && p < FALLS[i][1]) return i;
  }
  return -1;
}

function slideAt(p: number): [number, number, number] {
  for (const [start, end, from, to] of SLIDES) {
    if (p <= end) {
      return [from, to, clamp01((p - start) / (end - start))];
    }
  }
  return [2, 2, 0];
}

function cardAt(p: number) {
  if (p >= CARD_SUMMARY_AT) return 3;
  if (p >= CARD_LANDED_AT[2]) return 2;
  if (p >= CARD_LANDED_AT[1]) return 1;
  if (p >= CARD_LANDED_AT[0]) return 0;
  return -1;
}

function landedAt(p: number) {
  if (p >= CARD_LANDED_AT[2]) return 3;
  if (p >= CARD_LANDED_AT[1]) return 2;
  if (p >= CARD_LANDED_AT[0]) return 1;
  return 0;
}

function dipShape(t: number) {
  if (t <= DIP_START || t >= 1) return 0;
  const phase = (t - DIP_START) / (1 - DIP_START);
  return 1 - Math.abs(phase - 0.5) / 0.5;
}

export function useLoadsMobileProgress({
  sectionRef,
  frameRef,
  stageRef,
  rigRef,
  cargoRefs,
  lineRef,
  reduced,
  onScale,
  onCard,
  onLanded,
  onLink,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  frameRef: React.RefObject<HTMLDivElement | null>;
  stageRef: React.RefObject<HTMLDivElement | null>;
  rigRef: React.RefObject<HTMLDivElement | null>;
  cargoRefs: React.RefObject<(HTMLDivElement | null)[]>;
  lineRef: React.RefObject<HTMLDivElement | null>;
  reduced: boolean;
  onScale: (scale: number) => void;
  onCard: (step: number) => void;
  onLanded: (landed: number) => void;
  onLink: (shown: boolean) => void;
}) {
  const target = useRef(0);
  const shown = useRef(0);
  const tx = useRef<number[]>([0, 0, 0]);
  const lift = useRef<number[]>([0, 0, 0]);
  const painted = useRef({
    rig: "",
    cargo: ["", "", ""],
    line: -1,
    card: -2,
    landed: -1,
    link: false,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const stage = stageRef.current;
    if (!section || !frame || !stage) return;

    /* ─── Reduced motion: static, no loop ─── */
    if (reduced) {
      const fit = () => {
        const s = stage.getBoundingClientRect().width / STAGE_W;
        tx.current = [0, 0, 0];
        onScale(s);
      };
      fit();
      onCard(3);
      onLanded(3);
      onLink(true);
      window.addEventListener("resize", fit);
      return () => window.removeEventListener("resize", fit);
    }

    /* Touch devices get a much shorter smoothing time. */
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const tau = coarse ? TAU_TOUCH : TAU_WHEEL;

    /* ─── Measure: the ONLY place layout is read ─── */
    let lastWidth = -1;
    let span = 1;
    let startY = 0;

    const measure = () => {
      const stageRect = stage.getBoundingClientRect();
      if (stageRect.width <= 0 || stageRect.height <= 0) return;

      const s = Math.min(
        (stageRect.width * 3) / STAGE_W,
        stageRect.height / STAGE_H
      );
      onScale(s);

      const groupTop = Math.max(0, (stageRect.height - STAGE_H * s) / 2);
      const deckY = groupTop + (STAGE_H - DECK_UNITS) * s;
      for (let i = 0; i < SLOTS.length; i += 1) {
        tx.current[i] = (STAGE_W / 2 - SLOTS[i].centre) * s;
        lift.current[i] = deckY + 1;
      }

      if (lineRef.current) lineRef.current.style.height = `${deckY}px`;

      const navHeight = Number.parseFloat(getComputedStyle(frame).top);
      const sectionHeight = section.getBoundingClientRect().height;
      const frameHeight = frame.getBoundingClientRect().height;
      span = Math.max(1, sectionHeight - frameHeight);
      startY =
        section.getBoundingClientRect().top + window.scrollY - navHeight;
      lastWidth = window.innerWidth;

      read();
    };

    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      measure();
      read();
      wake();
    };

    const onScroll = () => {
      read();
      wake();
    };

    /* ─── Per-frame paint. No reads, no state, no React. ─── */
    const paint = (p: number) => {
      const last = painted.current;
      const [from, to, t] = slideAt(p);
      const x =
        tx.current[from] + (tx.current[to] - tx.current[from]) * easeInOut(t);

      let dip = 0;
      let lineOpacity = 0;
      const air = activeFall(p);

      if (air >= 0) {
        const f = fallAt(air, p);
        dip = dipShape(f);
        lineOpacity =
          LINE_MAX *
          Math.min(clamp01(f / LINE_IN), clamp01((1 - f) / LINE_OUT));
      }

      const rig = rigRef.current;
      const rigTransform = `translate3d(${x}px, ${dip * DIP_PX}px, 0)`;
      if (rig && rigTransform !== last.rig) {
        rig.style.transform = rigTransform;
        last.rig = rigTransform;
      }

      for (let i = 0; i < cargoRefs.current.length; i += 1) {
        const cargo = cargoRefs.current[i];
        if (!cargo) continue;
        const transform = `translate3d(0, ${
          (easeOut(fallAt(i, p)) - 1) * lift.current[i]
        }px, 0)`;
        if (transform !== last.cargo[i]) {
          cargo.style.transform = transform;
          last.cargo[i] = transform;
        }
      }

      const line = lineRef.current;
      if (line && lineOpacity !== last.line) {
        line.style.opacity = String(lineOpacity);
        last.line = lineOpacity;
      }

      const step = cardAt(p);
      if (step !== last.card) {
        last.card = step;
        onCard(step);
      }
      const landed = landedAt(p);
      if (landed !== last.landed) {
        last.landed = landed;
        onLanded(landed);
      }
      const showLink = p >= LINK_AT;
      if (showLink !== last.link) {
        last.link = showLink;
        onLink(showLink);
      }
    };

    const read = () => {
      target.current = clamp01((window.scrollY - startY) / span);
    };

    let raf = 0;
    let visible = true;
    let lastT = 0;

    /* Time-based easing: same feel at 30, 60 or 120 fps. */
    const tick = (now: number) => {
      raf = 0;
      if (!visible) return;

      const dt = lastT ? Math.min(now - lastT, 50) : 16;
      lastT = now;

      const a = 1 - Math.exp(-dt / tau);
      const diff = target.current - shown.current;
      shown.current =
        Math.abs(diff) < SNAP ? target.current : shown.current + diff * a;

      paint(shown.current);

      if (shown.current !== target.current) {
        raf = requestAnimationFrame(tick);
      } else {
        lastT = 0;
      }
    };

    const wake = () => {
      if (visible && !raf) raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          measure();
          wake();
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
          lastT = 0;
        }
      },
      { rootMargin: "10% 0px" }
    );
    observer.observe(section);

    const bodyObserver = new ResizeObserver(() => {
      measure();
      wake();
    });
    bodyObserver.observe(document.body);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    measure();
    read();
    wake();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      bodyObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [
    sectionRef,
    frameRef,
    stageRef,
    rigRef,
    cargoRefs,
    lineRef,
    reduced,
    onScale,
    onCard,
    onLanded,
    onLink,
  ]);
}