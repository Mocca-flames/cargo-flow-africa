"use client";

import { useEffect, useState } from "react";

/**
 * One-way entrance gate, shared by Ch5's two renderings.
 *
 * `entered` flips true the first time the section is meaningfully on screen
 * and never goes back — the entrance is a reveal, not an animation that can
 * replay. The 1500ms fallback is Ch3's and Ch4's: if IntersectionObserver is
 * missing, the words arrive on a timer rather than stranding at opacity 0.
 */
export function useReveal(ref: React.RefObject<HTMLElement | null>) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
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
  }, [ref]);

  return entered;
}