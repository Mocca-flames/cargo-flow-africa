"use client";

import { useEffect, useState, useMemo } from "react";
import { TERRITORIES, MAP_SPACE } from "@/data/coverage-territories";
import "./CoverageLoader.css";

type CoverageLoaderProps = {
  /** Called when the loading animation completes (all countries highlighted once). */
  onComplete?: () => void;
  /** Minimum display time in ms before calling onComplete. */
  minDuration?: number;
  /** Whether to show the loader (controlled by parent). */
  isLoading?: boolean;
};

/**
 * CoverageLoader — A full-screen loading animation that highlights
 * the countries we operate in, one by one, in a satisfying loop.
 *
 * Uses the SVG paths from coverage-territories.ts (MAP_SPACE 5000×6111).
 * The "rail" countries (ZAF, BWA, ZWE, ZMB, COD, MWI, TZA, MOZ) are
 * highlighted sequentially with a glow effect, then the loop repeats.
 */
// Full regional bounding box covering all territories (AGO, COD, TZA, MOZ, ZAF, etc.)
// with comfortable margin so no country edge is clipped.
const LOADER_VIEWBOX = {
  x: 150,
  y: -2910,
  w: 6160,
  h: 8790,
} as const;

export default function CoverageLoader({
  onComplete,
  isLoading = true,
}: CoverageLoaderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(isLoading);
  const [progress, setProgress] = useState(15);

  // Only the countries we operate in (rail: true)
  const railCountries = useMemo(
    () => TERRITORIES.filter((t) => t.rail),
    []
  );

  // All countries for context (rail: false) — drawn faint
  const contextCountries = useMemo(
    () => TERRITORIES.filter((t) => !t.rail),
    []
  );

  // Country highlight loop: starts immediately on mount and loops continuously
  useEffect(() => {
    if (railCountries.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % railCountries.length);
    }, 450);

    return () => clearInterval(interval);
  }, [railCountries.length]);

  // Independent loading progress bar: smoothly moves towards 92% while loading
  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const diff = 92 - prev;
        return prev + Math.max(0.8, diff * 0.12);
      });
    }, 120);

    return () => clearInterval(timer);
  }, [isLoading]);

  // Exit transition when isLoading becomes false
  useEffect(() => {
    if (!isLoading) {
      setProgress(100);
      setIsExiting(true);
      const timer = setTimeout(() => {
        setIsMounted(false);
        onComplete?.();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(true);
      setIsExiting(false);
    }
  }, [isLoading, onComplete]);

  if (!isMounted) return null;

  const activeCountry = railCountries[activeIndex];
  const prevIndex = (activeIndex - 1 + railCountries.length) % railCountries.length;

  return (
    <div
      className={`coverage-loader${isExiting ? " is-exiting" : ""}`}
      role="status"
      aria-label="Loading Cargo Flow Africa"
    >
      <div className="coverage-loader__backdrop" />

      <div className="coverage-loader__content">
        {/* Logo / Brand */}
        <div className="coverage-loader__brand">
          <img
            src="/logo-desktop.avif"
            alt="Cargo Flow Africa"
            className="coverage-loader__brand-logo"
            width={495}
            height={172}
          />
        </div>

        {/* Animated SVG Map showing full Southern & Central Africa */}
        <div className="coverage-loader__map-wrap">
          <svg
            className="coverage-loader__map"
            viewBox={`${LOADER_VIEWBOX.x} ${LOADER_VIEWBOX.y} ${LOADER_VIEWBOX.w} ${LOADER_VIEWBOX.h}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {/* Context countries (faint outlines) */}
            <g className="coverage-loader__context">
              {contextCountries.map((country) => (
                <path
                  key={country.id}
                  d={country.d}
                  className="coverage-loader__country coverage-loader__country--context"
                />
              ))}
            </g>

            {/* Rail countries (continuous animated highlight loop) */}
            <g className="coverage-loader__rail">
              {railCountries.map((country, index) => {
                const isActive = index === activeIndex;
                const isPrev = index === prevIndex;
                return (
                  <path
                    key={country.id}
                    d={country.d}
                    className={`coverage-loader__country coverage-loader__country--rail${
                      isActive ? " is-active" : ""
                    }${isPrev ? " is-prev" : ""}`}
                  />
                );
              })}
            </g>

            {/* Active country glow overlay */}
            {activeCountry && (
              <path
                key={`glow-${activeCountry.id}`}
                d={activeCountry.d}
                className="coverage-loader__glow"
                aria-hidden="true"
              />
            )}
          </svg>
        </div>

        {/* Loading status */}
        <div className="coverage-loader__status">
          <div className="coverage-loader__spinner" aria-hidden="true">
            <span className="coverage-loader__spinner-dot" />
            <span className="coverage-loader__spinner-dot" />
            <span className="coverage-loader__spinner-dot" />
          </div>
          <p className="coverage-loader__text">Loading Cargo Flow Africa…</p>
          <p className="coverage-loader__subtext">Connecting Regional Corridors</p>
        </div>

        {/* Independent progress bar */}
        <div className="coverage-loader__progress" aria-hidden="true">
          <div
            className="coverage-loader__progress-bar"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
