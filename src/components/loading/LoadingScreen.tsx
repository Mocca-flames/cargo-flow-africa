"use client";

import { useEffect, useState, type ReactNode } from "react";
import CoverageLoader from "@/components/loading/CoverageLoader";

type LoadingScreenProps = {
  children: ReactNode;
};

export const servicesAssets = {
  s1: {
    desktop: "/images/services/s1_desktop.avif",
    mobile: "/images/services/s1_mobile.avif",
    fallback: "/images/services/s1.webp",
  },
  s2: {
    desktop: "/images/services/s2_desktop.avif",
    mobile: "/images/services/s2_mobile.avif",
    fallback: "/images/services/s2.webp",
  },
  s3: {
    desktop: "/images/services/s3_desktop.avif",
    mobile: "/images/services/s3_mobile.avif",
    fallback: "/images/services/s3.webp",
  },
  s4: {
    desktop: "/images/services/s4_desktop.avif",
    mobile: "/images/services/s4_mobile.avif",
    fallback: "/images/services/s4.webp",
  },
  s5: {
    desktop: "/images/services/s5_desktop.avif",
    mobile: "/images/services/s5_mobile.avif",
    fallback: "/images/services/s5.webp",
  },
} as const;

/** Keep the splash visible briefly to avoid a flash of unstyled content, but not long enough to feel stuck. */
const MIN_LOADER_MS = 180;

/** Hard cap: the loader never blocks the page longer than this. */
const MAX_LOADER_MS = 1200;

/**
 * Preload the actual first-screen hero assets so the page can settle quickly.
 * Everything below the fold should lazy-load on its own.
 */
const CRITICAL_ASSETS = [
  "/logo-desktop.avif",
  "/images/hero-1/bg-sky.avif",
  "/images/hero-1/road.avif",
  "/images/hero-1/fg-grass.avif",
  "/images/hero-1/truck-scania.avif",
] as const;

function preload(src: string): Promise<void> {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve(); // a failed image must never block the page
    img.src = src;
  });
}

export default function LoadingScreen({ children }: LoadingScreenProps) {
  // Starts true so the server-rendered HTML includes the loader and its
  // CSS animation begins on first paint.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const minWait = new Promise<void>((r) => window.setTimeout(r, MIN_LOADER_MS));
    const cap = new Promise<void>((r) => window.setTimeout(r, MAX_LOADER_MS));
    const critical = Promise.all(CRITICAL_ASSETS.map(preload)).then(() => undefined);

    Promise.all([
      minWait,
      Promise.race([critical, cap]),
    ]).then(() => {
      if (!cancelled) setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <CoverageLoader isLoading={isLoading} />
      <div className="loading-screen__content">{children}</div>
    </>
  );
}