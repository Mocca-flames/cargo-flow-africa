"use client";

import { useEffect, useState } from "react";

/**
 * One-shot entrance gate for the Process section.
 *
 * `entered` flips true the first time the section is meaningfully on
 * screen and never reverts — the entrance is a reveal, not a replay.
 * Same shape as `loads/useReveal.ts`: IntersectionObserver with a
 * 1500ms fallback so a missing observer can't leave the section
 * stranded in its pre-entrance state.
 *
 * `enabled: false` keeps the section permanently "not entered" — used
 * for reduced motion and the pre-arming frame, so the CSS can render
 * the settled state without the entrance timing ever running.
 */
export function useReveal(
  ref: React.RefObject<HTMLElement | null>,
  { enabled = true }: { enabled?: boolean } = {}
) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    if (!node) return;

    const show = () => setEntered(true);
    const fallback = window.setTimeout(show, 1500);

    if (typeof IntersectionObserver === "undefined") {
      show();
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.intersectionRatio >= 0.05) setEntered(true);
      },
      { threshold: [0, 0.05] }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [ref, enabled]);

  return entered;
}
