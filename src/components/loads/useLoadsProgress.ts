"use client";

import { useEffect, useRef } from "react";
import { loadPlan, unitWindow } from "@/data/loads";

/**
 * Scroll progress for Ch5's load plan.
 *
 * The viewport lock itself is CSS (see LoadsCommon.css): a 130vh track with a
 * `position: sticky` frame, the same shape Ch2 uses — no pin-spacer, so
 * nothing fights Ch3's `scroll-snap-align: start` or the root's proximity
 * snap. What CSS cannot do is hand a *number* to the plan, so this hook
 * measures the track once per animation frame while the user is scrolling and
 * writes one custom property per load straight onto the DOM:
 *
 *   --land-t   0→1 per load, eased. CSS turns it into the fall (translateY).
 *   --land-dip 0→1→0 contact triangle on the frame, so the trailer flexes 2px
 *              under the load over the last 15% of its step.
 *
 * Writes go to the elements, not to React state: the loads move every frame, and re-rendering the
 * chapter at 60fps would cost more than the whole chapter is worth. React only
 * hears about *landings* — `onStep` fires when a block finishes, at most five
 * times, which is what ticks the load sheet.
 *
 * `blockRefs` holds both projections back to back (side loads, then top-view
 * loads), so one eased value per unit drives whichever one is on screen.
 *
 * The easing is the tempo. `--land-t` is a cubic ease-out, so a load falls out
 * of its origin chip and settles onto the deck: quick off the mark, long
 * settle at the bottom. Weighted, never snapped. It is written as a NUMBER,
 * not as an opacity or a position — what the value means (how far the load has
 * fallen, how deep the deck has flexed) is decided in CSS, which is why the
 * load can be made to fall without ever being made to fade.
 */

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

/** Cubic ease-out — quick off the mark, long settle. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** The dip owns the last 15% of a step: 0 at 0.85, 1 at 0.925, 0 at contact. */
const DIP_START = 0.85;

/** Triangle over [DIP_START, 1] — 0 at both ends, 1 at the midpoint. */
function dipShape(raw: number) {
  if (raw <= DIP_START || raw >= 1) return 0;
  const phase = (raw - DIP_START) / (1 - DIP_START);
  return 1 - Math.abs(phase - 0.5) / 0.5;
}

export function useLoadsProgress({
  trackRef,
  frameRef,
  blockRefs,
  onStep,
  enabled,
}: {
  trackRef: React.RefObject<HTMLElement | null>;
  frameRef: React.RefObject<HTMLElement | null>;
  blockRefs: React.RefObject<(HTMLElement | null)[]>;
  /** Fires only when a load finishes landing. Must be referentially stable. */
  onStep: (landed: number) => void;
  /** False under reduced motion — the plan renders settled instead. */
  enabled: boolean;
}) {
  const lastStepRef = useRef(-1);

  useEffect(() => {
    /* Reduced motion (and no-JS, and SSR) never reach here: the blocks keep
       their CSS default of fully landed, the counter renders 05 / 05, and the
       closing link is visible. */
    if (!enabled) return;

    const track = trackRef.current;
    const frame = frameRef.current;
    if (!track || !frame) return;

    let frameId = 0;

    const measure = () => {
      frameId = 0;
      const section = trackRef.current;
      const stage = frameRef.current;
      if (!section || !stage) return;

      /* The nav's height is the frame's own sticky offset. Reading it off the
         computed `top` rather than `--nav-height` avoids converting a rem token
         back to pixels and stays correct if the nav ever changes height. */
      const stickyTop = parseFloat(getComputedStyle(stage).top);
      const navHeight = Number.isFinite(stickyTop) ? stickyTop : 0;

      const span = section.offsetHeight - stage.offsetHeight - navHeight;
      const progress =
        span <= 0
          ? 0
          : clamp01(
              (-section.getBoundingClientRect().top - navHeight) / span
            );

      let landed = 0;
      let dip = 0;

      /* `blockRefs` holds both projections back to back (side loads, then
         top-view loads), so one eased value per unit drives whichever one is
         on screen. */
      for (let i = 0; i < loadPlan.length; i += 1) {
        const unit = loadPlan[i];
        const { start, end } = unitWindow(unit);
        const raw = clamp01((progress - start) / (end - start));
        const value = easeOut(raw).toFixed(4);

        blockRefs.current[i]?.style.setProperty("--land-t", value);
        blockRefs.current[i + loadPlan.length]?.style.setProperty(
          "--land-t",
          value
        );

        if (raw >= 1) landed += 1;

        /* The load's own dip contribution. Windows do not overlap, so at most
           one unit is ever in its last 15% — the max is a formality that
           keeps this correct if the beats are ever re-cut to touch. */
        const shape = dipShape(raw);
        if (shape > dip) dip = shape;
      }

      /* The dip rides on the FRAME rather than on any one load: it belongs to
         the trailer, which is not a child of the block, and the frame is the
         nearest common ancestor the hook already holds a ref for. Custom
         properties inherit, so the trailer drawing reads it for free. */
      frame.style.setProperty("--land-dip", dip.toFixed(4));

      if (landed !== lastStepRef.current) {
        lastStepRef.current = landed;
        onStep(landed);
      }
    };

    const schedule = () => {
      if (frameId) return;
      frameId = requestAnimationFrame(measure);
    };

    /* Re-measure on resize — the track is in vh, so the whole scrub range
       moves with the viewport. The observer also catches the font-load and
       late-decode reflows a resize listener never fires for. */
    const observer = new ResizeObserver(schedule);
    observer.observe(track);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    measure();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
    };
  }, [trackRef, frameRef, blockRefs, onStep, enabled]);
}