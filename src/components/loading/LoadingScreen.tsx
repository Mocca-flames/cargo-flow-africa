"use client";

import { useEffect, useState, type ReactNode } from "react";
import CoverageLoader from "@/components/loading/CoverageLoader";
import { heroAssets, heroMobileAssets } from "@/components/hero/heroAssets";

type LoadingScreenProps = {
  children: ReactNode;
};

/**
 * LoadingScreen — Shows the CoverageLoader while hero assets download,
 * then reveals the main content with a smooth transition.
 *
 * Preloads all hero images (desktop + mobile) and waits for them to
 * decode before hiding the loader. Has a minimum display time so the
 * animation is visible even on fast connections.
 */
export default function LoadingScreen({ children }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [assetsReady, setAssetsReady] = useState(false);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Preload hero assets
  useEffect(() => {
    const allAssets = [
      // Desktop assets
      heroAssets.bgSky,
      heroAssets.road,
      heroAssets.fxDust,
      heroAssets.fxGlow,
      heroAssets.fxStreaks,
      heroAssets.fgGrass,
      heroAssets.truckMan,
      heroAssets.truckScania,
      heroAssets.truckFaw,
      // Mobile assets
      heroMobileAssets.bgSky,
      heroMobileAssets.road,
      heroMobileAssets.truckMan,
    ];

    // Remove duplicates
    const uniqueAssets = [...new Set(allAssets)];

    let mounted = true;

    const preloadImages = async () => {
      const promises = uniqueAssets.map((src) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Resolve even on error to not block
          img.src = src;

          // Also try to decode for better readiness
          if (img.decode) {
            img.decode().catch(() => {});
          }
        });
      });

      await Promise.all(promises);
      if (mounted) {
        setAssetsReady(true);
      }
    };

    preloadImages();

    return () => {
      mounted = false;
    };
  }, []);

  // Minimum display time (2.5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Hide loader when both conditions are met
  useEffect(() => {
    if (assetsReady && minTimeElapsed) {
      // Small delay for smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [assetsReady, minTimeElapsed]);

  return (
    <>
      <CoverageLoader
        isLoading={isLoading}
        onComplete={() => {
          // Loader animation completed one cycle
        }}
        minDuration={2500}
      />
      <div
        className="loading-screen__content"
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.6s var(--ease-snap)",
          pointerEvents: isLoading ? "none" : "auto",
        }}
      >
        {children}
      </div>
    </>
  );
}
