"use client";

import { useEffect, useState } from "react";

/**
 * One-shot entrance gate for the Portfolio section.
 *
 * Same contract as the Process section's hook: `entered` flips true
 * the first time the section is meaningfully on screen and never
 * reverts. IntersectionObserver with a 1500ms fallback so a missing
 * observer can't leave the cards stranded in their pre-entrance
 * state; `enabled: false` keeps the gate closed (the CSS then shows
 * the settled paint, which is what SSR and reduced motion want).
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
    const fallback = window.setTimeout(show, 600);

    if (typeof IntersectionObserver === "undefined") {
      show();
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.intersectionRatio >= 0.01) setEntered(true);
      },
      { threshold: [0, 0.01], rootMargin: "100px 0px 0px 0px" }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [ref, enabled]);

  return entered;
}
