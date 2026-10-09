"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll progress for Ch5's pinned stage.
 *
 * The viewport lock itself is CSS (see LoadsCommon.css): a 300vh track with
 * a `position: sticky` stage, the same shape Ch2 uses — no pin-spacer, so
 * nothing fights Ch3's `scroll-snap-align: start` or the root's proximity
 * snap. What CSS cannot do is hand a *number* to the 3D scene, so this hook
 * measures the track once per animation frame while the user is scrolling
 * and writes a 0→1 fraction into a ref. Refs, not state: the scene reads it
 * inside `useFrame` at 60fps and re-rendering React on every frame would
 * cost more than the whole chapter is worth.
 *
 * The math mirrors what the browser does to the sticky element. The stage is
 * pinned from the moment the track's top reaches the nav height until the
 * track's bottom reaches the viewport bottom, so:
 *
 *   travelled = -trackTop - navHeight
 *   span      = trackHeight - stageHeight - navHeight
 */

export function useLoadsScroll(
  trackRef: React.RefObject<HTMLElement | null>,
  stageRef: React.RefObject<HTMLElement | null>,
  disabled: boolean
) {
  const progressRef = useRef(0);

  useEffect(() => {
    if (disabled) {
      progressRef.current = 0;
      return;
    }

    let frame = 0;

    const measure = () => {
      frame = 0;
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;

      /* The nav's height is the stage's own sticky offset. Reading it off
         the computed `top` rather than `--nav-height` avoids converting a
         rem token back to pixels, and stays correct if the nav ever shrinks
         or grows on scroll. */
      const stickyTop = parseFloat(getComputedStyle(stage).top);
      const navHeight = Number.isFinite(stickyTop) ? stickyTop : 0;

      const span =
        track.offsetHeight - stage.offsetHeight - navHeight;
      if (span <= 0) {
        progressRef.current = 0;
        return;
      }

      const travelled = -track.getBoundingClientRect().top - navHeight;
      progressRef.current = Math.min(1, Math.max(0, travelled / span));
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    /* Re-measure on resize — the track is in vh, so the whole scrub range
       moves when the viewport does. The observer catches the font-load and
       late-decode reflows that a resize listener never fires for. */
    const observer = new ResizeObserver(schedule);
    if (trackRef.current) observer.observe(trackRef.current);
    window.addEventListener("resize", schedule);
    window.addEventListener("orientationchange", schedule);
    measure();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("orientationchange", schedule);
    };
  }, [trackRef, stageRef, disabled]);

  return progressRef;
}