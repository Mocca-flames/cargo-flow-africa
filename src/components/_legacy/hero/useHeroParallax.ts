import { useEffect, type RefObject } from "react";

/**
 * Writes parallax input into CSS custom properties on the target element.
 * - mode "pointer": fine-pointer devices only, mouse position -> --hero-px / --hero-py in [-1, 1]
 * - mode "scroll":  touch devices, scroll progress -> --hero-py in [0, 1]
 * Both are rAF-throttled and fully disabled under prefers-reduced-motion.
 */
export default function useHeroParallax(
  targetRef: RefObject<HTMLElement | null>,
  mode: "pointer" | "scroll"
) {
  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (mode === "pointer" && !window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    let px = 0;
    let py = 0;

    const apply = () => {
      frame = 0;
      el.style.setProperty("--hero-px", px.toFixed(4));
      el.style.setProperty("--hero-py", py.toFixed(4));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    if (mode === "pointer") {
      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width) * 2 - 1;
        py = ((e.clientY - r.top) / r.height) * 2 - 1;
        schedule();
      };
      el.addEventListener("pointermove", onMove, { passive: true });
      return () => {
        el.removeEventListener("pointermove", onMove);
        if (frame) cancelAnimationFrame(frame);
      };
    }

    const onScroll = () => {
      px = 0;
      py = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
      schedule();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [targetRef, mode]);
}
