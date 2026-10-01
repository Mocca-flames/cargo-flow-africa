"use client";

import { useRef } from "react";
import HeroTile from "./HeroTile";
import HeroHeadline from "./HeroHeadline";
import HeroPill from "./HeroPill";
import HeroScrollCue from "./HeroScrollCue";
import useHeroParallax from "./useHeroParallax";
import { heroImages } from "./heroImages";
import "./HeroCommon.css";
import "./HeroMobile.css";

export default function HeroMobile() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  useHeroParallax(sceneRef, "scroll");

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

      <div className="hero__tile-row">
        <HeroTile variant="a" image={heroImages.manMobile} sweep glow />
        <HeroTile variant="b" image={heroImages.lowbedMobile} road />
        <HeroTile variant="c" image={heroImages.wheelsMobile} road />
        <div className="hero__cue-block">
          <HeroScrollCue />
        </div>
      </div>

      <p className="hero__bodyline">
        Heavy haulage, lowbeds and flatbed freight, dispatched directly across
        Africa&rsquo;s southern corridors.
      </p>
    </div>
  );
}
