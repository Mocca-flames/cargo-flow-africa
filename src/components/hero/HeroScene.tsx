"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import HeroDesktop from "./HeroDesktop";
import HeroMobile from "./HeroMobile";

const QUERY = "(min-width: 1024px)";

type Match = boolean | null;

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

const getSnapshot = (): Match => window.matchMedia(QUERY).matches;

const getServerSnapshot = (): Match => null;

export default function HeroScene() {
  const isDesktop = useSyncExternalStore<Match>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [mounted, setMounted] = useState(false);

  // Defer the variant render until after hydration so the skeleton
  // (server/hydration snapshot = null) does not conflict with the
  // client-only media query result during React's commit phase.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted || isDesktop === null) {
    return (
      <section
        id="hero"
        className="hero-skeleton"
        style={{ minHeight: "100svh", background: "#F5F0E8" }}
      />
    );
  }

  return isDesktop ? <HeroDesktop /> : <HeroMobile />;
}
