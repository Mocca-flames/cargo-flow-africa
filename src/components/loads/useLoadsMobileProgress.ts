"use client";

import { useEffect, useRef } from "react";
import { loadPlan } from "@/data/loads";
import { sideBlockStyle } from "./planGeometry";

/**
 * Ch5 mobile — the scroll scrub for the loading point.
 *
 * The mechanic is one sentence long: the loading point is FIXED at the centre
 * of the screen and the trailer slides underneath it between drops. So the only
 * thing scroll position owns is a single 0→1 number, and everything that moves
 * is derived from it here. There is no swipe, no horizontal scroller, no
 * scroll-snap and no scroll-jacking — vertical scroll only, and the frame lock
 * itself is pure CSS (a tall track plus `position: sticky`).
 *
 * ── Why the group is a 1200×340 box ──
 * `planGeometry.ts` expresses every side-view position as a PERCENTAGE of a
 * 1200×340 stage: the trailer's 1200×200 drawing anchored to its bottom, and
 * the band above the deck line that freight occupies. `sideBlockStyle()` is
 * exported and returns exactly those percentages — `left`, `width`, `height`,
 * `bottom` and `--lift-pct`.
 *
 * So the mobile rig IS that box: a group 1200·s wide and 340·s tall, with the
 * trailer sitting on its bottom edge at its own 200 units. The deck line then
 * lands at `200 - 70 = 130` units above the group's bottom, which is precisely
 * where `sideBlockStyle().bottom` (38.235% of 340) already says it is, and
 * every cargo can take its geometry straight from that function with nothing
 * re-derived and nothing re-invented. Only two numbers are needed here — the
 * stage's own width and height, both documented at the top of
 * `planGeometry.ts`.
 *
 * ── Why `s` divides by 340 and not 321 ──
 * `s` is pixels per unit, and the group is 340 units tall, so the group has to
 * be 340·s tall or the percentages stop being exact. A 321-unit group would be
 * 5.9% shorter than the space `sideBlockStyle` is written against, and the only
 * way to use it there would be to re-derive the deck offset and the shared
 * cargo scale by hand — duplicating geometry `planGeometry.ts` already owns.
 * 340 keeps one source of truth; the rig is 5.9% smaller than a 321-unit box
 * would be and is exactly right.
 *
 * ── Cost model: cheap Android is the baseline ──
 * The handler and the loop read NO layout. `window.scrollY` is a cached scroll
 * offset, not a measurement: there is no `getBoundingClientRect`, no
 * `offsetHeight`, no `getComputedStyle` and no `getBBox` anywhere outside
 * `measure()`, which runs on mount and on WIDTH changes only. A height-only
 * resize is deliberately ignored — `svh` units do not move when the mobile URL
 * bar shows or hides, so re-measuring on height would only introduce jumps.
 *
 * One passive scroll listener writes a target into a ref; one rAF loop eases
 * the displayed progress toward it (0.15, snapping within 0.0005) and writes
 * `translate3d` and `opacity` straight to elements. There is no per-frame
 * React state at all — React only hears about landings, which is what the
 * manifest card and the closing link render. The loop stops when the eased
 * value has caught its target and restarts on the next scroll, and an
 * `IntersectionObserver` parks it entirely while the chapter is off screen.
 */

const STAGE_W = 1200;
const STAGE_H = 340;

/** The deck line's height, in trailer units, measured off `TrailerSide`'s own
 *  drawing (`viewBox="0 0 1200 200"`, deck top at y=70) rather than restated:
 *  the deck is 130 units above the bottom of the 200-unit drawing the group
 *  anchors it to — which is precisely where `sideBlockStyle().bottom`
 *  (38.235% of 340) already puts it. The stylesheet does the same subtraction
 *  for the drop line, so the two agree by construction. */
const DECK_UNITS = 200 - 70;

/** Fall windows: one load at a time, each a tenth of the run. */
const FALLS: ReadonlyArray<readonly [number, number]> = [
  [0.05, 0.15],
  [0.38, 0.48],
  [0.71, 0.81],
];

/** Slide windows: `[from, to, fromSlot, toSlot]`. Between them the trailer is
 *  dead still, which is what makes each landing read as one held event. */
const SLIDES: ReadonlyArray<readonly [number, number, number, number]> = [
  [0.27, 0.38, 0, 1],
  [0.6, 0.71, 1, 2],
];

/** Where each landing hands the manifest card its next reading. */
const CARD_LANDED_AT = [0.15, 0.48, 0.81] as const;
/** The card crossfades to the run total here; the link fades in just after. */
const CARD_SUMMARY_AT = 0.9;
const LINK_AT = 0.94;

/** The dip owns the last 15% of a fall: 0 at its start, 1 at its midpoint, 0 at
 *  touch-down. */
const DIP_START = 0.85;

/** Easing of the displayed progress toward the scroll target. */
const EASE = 0.15;
const SNAP = 0.0005;

/** The drop line is a guide, not a cable: 15% ink, and it pays out over the
 *  first 4% of a fall and is gone before contact. */
const LINE_MAX = 0.15;
const LINE_IN = 0.04;
const LINE_OUT = 1 - DIP_START;

/** How far the rig sinks under a landing, in px. */
const DIP_PX = 2;

type Slot = {
  /** Centre of the load along the deck, in trailer units. */
  centre: number;
};

/* `sideBlockStyle` answers in percentages of the 1200×340 stage, so every
   number is turned back into units exactly once, here, on module load. This is
   a format conversion, not a second source of geometry: the positions and the
   shared cargo scale all come out of `planGeometry.ts`. */
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

/** Cubic ease-out — quick off the mark, long settle. The fall's tempo. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Cubic ease-in-out — the slide is a shift, not a snap. */
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;

/** How far a fall at progress `p` has run, 0→1. Windows never overlap. */
function fallAt(index: number, p: number) {
  const [start, end] = FALLS[index];
  return clamp01((p - start) / (end - start));
}

/** The fall currently in the air, or -1. At most one is ever airborne. */
function activeFall(p: number) {
  for (let i = 0; i < FALLS.length; i += 1) {
    if (p > FALLS[i][0] && p < FALLS[i][1]) return i;
  }
  return -1;
}

/** Which slot the trailer is parked under, and how far through a slide it is:
 * a continuous `0 → 2` position, so the translation never jumps between
 * beats. Returns `[fromSlot, toSlot, t]`. */
function slideAt(p: number): [number, number, number] {
  for (const [start, end, from, to] of SLIDES) {
    if (p <= end) {
      return [from, to, clamp01((p - start) / (end - start))];
    }
  }
  return [2, 2, 0];
}

/** Which reading the manifest card holds: -1 hidden, 0–2 a landed load, 3 the
 *  run total. */
function cardAt(p: number) {
  if (p >= CARD_SUMMARY_AT) return 3;
  if (p >= CARD_LANDED_AT[2]) return 2;
  if (p >= CARD_LANDED_AT[1]) return 1;
  if (p >= CARD_LANDED_AT[0]) return 0;
  return -1;
}

/** Triangle over the last 15% of a fall — the deck taking the weight. */
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
  onLink,
}: {
  sectionRef: React.RefObject<HTMLElement | null>;
  frameRef: React.RefObject<HTMLDivElement | null>;
  stageRef: React.RefObject<HTMLDivElement | null>;
  rigRef: React.RefObject<HTMLDivElement | null>;
  cargoRefs: React.RefObject<(HTMLDivElement | null)[]>;
  lineRef: React.RefObject<HTMLDivElement | null>;
  /** Reduced motion: fit the whole rig to the stage and never scrub. */
  reduced: boolean;
  /** Pixels per trailer unit. Fires on mount and on WIDTH changes only. */
  onScale: (scale: number) => void;
  /** Manifest reading. Fires only when a threshold is crossed. */
  onCard: (step: number) => void;
  /** Closing link visibility. Fires only when its threshold is crossed. */
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
    link: false,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const stage = stageRef.current;
    if (!section || !frame || !stage) return;

    /* ─── Reduced motion ───
       No timeline at all: the whole rig is fitted to the stage width, every
       load is already on the deck (no transform is ever written, so the CSS
       default — resting — stands), the card reads the run total and the link
       is up. The static markup is already in that state, so nothing to write
       beyond the one measurement that fits the drawing. A resize listener
       keeps the fit correct through rotation without ever starting a loop. */
    if (reduced) {
      const fit = () => {
        const s = stage.getBoundingClientRect().width / STAGE_W;
        tx.current = [0, 0, 0];
        onScale(s);
      };
      fit();
      window.addEventListener("resize", fit);
      return () => window.removeEventListener("resize", fit);
    }

    /* ─── Measure: the ONLY place layout is read ─── */
    let lastWidth = -1;
    let span = 1;
    let startY = 0;

    const measure = () => {
      const stageRect = stage.getBoundingClientRect();
      if (stageRect.width <= 0 || stageRect.height <= 0) return;

      /* The rig is 1200 units wide, so the group is three screen-widths across
         and roughly a third of it is on screen at rest. The height term only
         binds on short viewports. */
      const s = Math.min(
        (stageRect.width * 3) / STAGE_W,
        stageRect.height / STAGE_H
      );
      onScale(s);

      /* The group is vertically centred in the stage, so its top edge sits
         (stageH − 340·s)/2 down. A waiting load has to clear the STAGE's top
         edge — the stage is what clips, not the group — so it is lifted by the
         distance from the stage top to the deck line (group top + the 210
         units between the group top and the deck), plus a 1px margin so its
         bottom edge is strictly outside. `planGeometry`'s `--lift-pct` is
         written against a 340-unit-tall stage equal to the group itself; here
         the stage is taller than the group, so that percentage would leave a
         waiting load hanging visible inside the stage. This is a placement of
         the same rest geometry, not a second source of it. */
      const groupTop = Math.max(0, (stageRect.height - STAGE_H * s) / 2);
      const deckY = groupTop + (STAGE_H - DECK_UNITS) * s;
      for (let i = 0; i < SLOTS.length; i += 1) {
        /* Centre the current slot on the drop line, which is the stage's own
           middle. The stage is `justify-content: center`, so at tx = 0 the
           rig's own midpoint (unit 600) already sits on the stage's middle —
           the offset is therefore how far the slot's centre is from the
           rig's centre, NOT from the stage's left edge. Precomputed once per
           measure: three numbers, no per-frame arithmetic. */
        tx.current[i] = (STAGE_W / 2 - SLOTS[i].centre) * s;
        lift.current[i] = deckY + 1;
      }

      /* The drop line pays out from the stage top to the deck. Its height is
         fixed for a given layout, so it is written here, never per frame —
         only its opacity is painted live. */
      if (lineRef.current) lineRef.current.style.height = `${deckY}px`;

      /* The frame is sticky at `--nav-height`, so the rig starts being pinned
         the moment the section's top reaches the nav's bottom, and is released
         once the sticky offset it can absorb (section - frame) is used up.
         The scrub span is therefore section - frame, and progress 0 sits
         exactly at `sectionTop - navHeight`. */
      const navHeight = Number.parseFloat(getComputedStyle(frame).top);
      const sectionHeight = section.getBoundingClientRect().height;
      const frameHeight = frame.getBoundingClientRect().height;
      span = Math.max(1, sectionHeight - frameHeight);
      startY =
        section.getBoundingClientRect().top + window.scrollY - navHeight;
      lastWidth = window.innerWidth;

      read();
    };

    /* Height is deliberately not part of this. `svh` does not move when the
       mobile URL bar shows or hides, and `dvh` units are not used anywhere in
       the section, so a height-only resize has nothing to re-fit. */
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
      const x = tx.current[from] + (tx.current[to] - tx.current[from]) * easeInOut(t);

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
        /* A load is opacity 1 for its whole life and is moved, never faded:
           before its step it hangs above the stage and the stage's
           `overflow: clip` takes it out of view. */
        const transform = `translate3d(0, ${(easeOut(fallAt(i, p)) - 1) * lift.current[i]}px, 0)`;
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

      /* React hears about landings and nothing else — five events for the
         whole chapter, never a per-frame setState. */
      const step = cardAt(p);
      if (step !== last.card) {
        last.card = step;
        onCard(step);
      }
      const showLink = p >= LINK_AT;
      if (showLink !== last.link) {
        last.link = showLink;
        onLink(showLink);
      }
    };

    /* Target only. `window.scrollY` is a cached offset, not a measurement, so
       this stays off the layout path entirely. */
    const read = () => {
      target.current = clamp01((window.scrollY - startY) / span);
    };

    let raf = 0;
    let visible = true;

    const tick = () => {
      raf = 0;
      if (!visible) return;
      const diff = target.current - shown.current;
      shown.current =
        Math.abs(diff) < SNAP ? target.current : shown.current + diff * EASE;
      paint(shown.current);
      /* Still chasing: keep going. Caught up: park the loop until the next
         scroll event or the observer wakes it. */
      if (shown.current !== target.current) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (visible && !raf) raf = requestAnimationFrame(tick);
    };

    /* Off screen, the loop is stopped outright — no rAF, no writes. Re-fitting
       on entry is cheap insurance: by the time the user reaches this chapter,
       everything above it has long settled. */
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          measure();
          wake();
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "10% 0px" }
    );
    observer.observe(section);

    /* Content ABOVE this section can still change height after we measure —
       late fonts, hydration, a sibling section's own reveal — which moves the
       section's absolute top and would leave `startY` stale, offsetting the
       whole scrub against the (CSS-sticky, always correct) frame. This
       section's height is viewport-relative and constant, so any such shift
       moves the body's height with it. One ResizeObserver on the body
       re-fits on exactly those events; scrolling never resizes the body, so
       this stays entirely off the scroll path. */
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
    onLink,
  ]);
}
