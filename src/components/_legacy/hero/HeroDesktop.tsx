"use client";

import { useRef } from "react";
import HeroTile from "./HeroTile";
import HeroHeadline from "./HeroHeadline";
import HeroPill from "./HeroPill";
import HeroScrollCue from "./HeroScrollCue";
import useHeroParallax from "./useHeroParallax";
import { heroImages } from "./heroImages";
import "./HeroCommon.css";
import "./HeroDesktop.css";

export default function HeroDesktop() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  useHeroParallax(sceneRef, "pointer");

  return (
    <div className="hero__scene" ref={sceneRef}>
      <div className="hero__pills">
        <HeroPill
          label="CORRIDOR: SOUTH AFRICA → DRC (LUBUMBASHI / KOLWEZI)"
          dot="green"
        />
        <HeroPill label="STATUS: DIRECT FLEET DISPATCH" dot="amber" />
      </div>

      <HeroHeadline />

      <HeroTile
        variant="a"
        image={heroImages.trucksDesktop}
        sweep
        glow
        caption="Secured from Origin to Destination."
      />
      <HeroTile variant="b" image={heroImages.lowbedDesktop} road />
      <HeroTile variant="c" image={heroImages.triDesktop} road />

      <p className="hero__bodyline">
        Heavy haulage, lowbeds and flatbed freight, dispatched directly across
        Africa&rsquo;s southern corridors.
      </p>
      <HeroScrollCue />
    </div>
  );
}
