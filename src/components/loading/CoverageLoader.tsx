"use client";

import { useEffect, useState, useMemo } from "react";
import { TERRITORIES } from "@/data/coverage-territories";
import "./CoverageLoader.css";

type CoverageLoaderProps = {
  /** Called when the loader has finished exiting. */
  onComplete?: () => void;
  /** Whether to show the loader (controlled by parent). */
  isLoading?: boolean;
};

const LOADER_VIEWBOX = {
  x: 150,
  y: -2910,
  w: 6160,
  h: 8790,
} as const;

/** Time each country stays highlighted, in ms. */
const STEP_MS = 450;

/**
 * CoverageLoader — full-screen loading animation.
 *
 * The country loop and progress bar are pure CSS animations, so they run
 * from the first paint of the server-rendered HTML — no hydration needed.
 */
export default function CoverageLoader({
  onComplete,
  isLoading = true,
}: CoverageLoaderProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(isLoading);

  const railCountries = useMemo(() => TERRITORIES.filter((t) => t.rail), []);
  const contextCountries = useMemo(() => TERRITORIES.filter((t) => !t.rail), []);

  const count = railCountries.length;
  const cycleMs = Math.max(count, 1) * STEP_MS;

  // Keyframes generated from the country count so the timing stays correct
  // if countries are added/removed. Identical on server and client.
  const keyframesCss = useMemo(() => {
    const n = Math.max(count, 1);
    const w = 100 / n;
    const a = w * 0.2;
    const pct = (v: number) => `${Math.min(100, v).toFixed(3)}%`;

    const base =
      "fill:rgba(212,164,76,0.1);stroke:rgba(180,120,40,0.35);stroke-width:8;filter:drop-shadow(0 0 0 rgba(212,164,76,0));";
    const active =
      "fill:rgba(212,164,76,0.55);stroke:var(--color-accent-gold);stroke-width:14;filter:drop-shadow(0 0 16px rgba(212,164,76,0.7));";
    const prev =
      "fill:rgba(212,164,76,0.28);stroke:rgba(180,120,40,0.65);stroke-width:10;filter:drop-shadow(0 0 6px rgba(212,164,76,0.25));";

    return `@keyframes loader-rail-cycle{
0%{${base}}
${pct(a)}{${active}}
${pct(w)}{${active}}
${pct(w + a)}{${prev}}
${pct(2 * w)}{${prev}}
${pct(2 * w + a)}{${base}}
100%{${base}}
}`;
  }, [count]);

  // Exit transition when isLoading becomes false
  useEffect(() => {
    if (!isLoading) {
      setIsExiting(true);
      const timer = setTimeout(() => {
        setIsMounted(false);
        onComplete?.();
      }, 150);
      return () => clearTimeout(timer);
    }
    setIsMounted(true);
    setIsExiting(false);
  }, [isLoading, onComplete]);

  if (!isMounted) return null;

  return (
    <div
      className={`coverage-loader${isExiting ? " is-exiting" : ""}`}
      role="status"
      aria-label="Loading Cargo Flow Africa"
    >
      <style>{keyframesCss}</style>

      <div className="coverage-loader__backdrop" />

      <div className="coverage-loader__content">
        <div className="coverage-loader__brand">
          <img
            src="/logo-desktop.avif"
            alt="Cargo Flow Africa"
            className="coverage-loader__brand-logo"
            width={495}
            height={172}
          />
        </div>

        <div className="coverage-loader__map-wrap">
          <svg
            className="coverage-loader__map"
            viewBox={`${LOADER_VIEWBOX.x} ${LOADER_VIEWBOX.y} ${LOADER_VIEWBOX.w} ${LOADER_VIEWBOX.h}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <g className="coverage-loader__context">
              {contextCountries.map((country) => (
                <path
                  key={country.id}
                  d={country.d}
                  className="coverage-loader__country coverage-loader__country--context"
                />
              ))}
            </g>

            <g
              className="coverage-loader__rail"
              style={{ ["--loader-cycle" as string]: `${cycleMs}ms` }}
            >
              {railCountries.map((country, index) => (
                <path
                  key={country.id}
                  d={country.d}
                  className="coverage-loader__country coverage-loader__country--rail"
                  style={{ animationDelay: `${index * STEP_MS}ms` }}
                />
              ))}
            </g>
          </svg>
        </div>

        <div className="coverage-loader__status">
          <div className="coverage-loader__spinner" aria-hidden="true">
            <span className="coverage-loader__spinner-dot" />
            <span className="coverage-loader__spinner-dot" />
            <span className="coverage-loader__spinner-dot" />
          </div>
          <p className="coverage-loader__text">Loading Cargo Flow Africa…</p>
          <p className="coverage-loader__subtext">Connecting Regional Corridors</p>
        </div>

        <div className="coverage-loader__progress" aria-hidden="true">
          <div className="coverage-loader__progress-bar" />
        </div>
      </div>
    </div>
  );
}