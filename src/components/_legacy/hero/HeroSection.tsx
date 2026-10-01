"use client";

import { useEffect, useState } from "react";
import HeroDesktop from "./HeroDesktop";
import HeroMobile from "./HeroMobile";
import HeroHeadline from "./HeroHeadline";
import "./HeroCommon.css";
import "./HeroDesktop.css";
import "./HeroMobile.css";

/**
 * Viewport 1 — the Hero.
 * <section class="hero"> is the scroll anchor; <div class="hero__gate"> is the
 * root a future scroll handler can translate for the lift-gate reveal, with the
 * thin gold line on its bottom edge. Until hydration the boot state reserves
 * the full viewport and paints the headline, so there is no blank flash.
 */
export default function HeroSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const variantClass =
    isMobile === null ? "" : isMobile ? " hero--mobile" : " hero--desktop";

  return (
    <section id="hero-section" className={`hero${variantClass}`}>
      <div className="hero__gate">
        {isMobile === null ? (
          <div className="hero__boot">
            <HeroHeadline />
          </div>
        ) : isMobile ? (
          <HeroMobile key="mobile" />
        ) : (
          <HeroDesktop key="desktop" />
        )}
      </div>
      <div className="hero__haze" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />
    </section>
  );
}
