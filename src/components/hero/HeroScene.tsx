"use client";

import { heroAssets } from "./heroAssets";
import "./HeroScene.css";

type TruckProps = {
  className: string;
  src: string;
  depth: string;
  glow?: "left" | "right" | "both";
};

function Truck({ className, src, depth, glow = "both" }: TruckProps) {
  const showLeft = glow === "left" || glow === "both";
  const showRight = glow === "right" || glow === "both";

  return (
    <div className={`truck-wrap ${className}`} data-depth={depth}>
      <div className="truck-shadow truck-shadow--soft" aria-hidden="true" />
      <div className="truck-shadow truck-shadow--core" aria-hidden="true" />
      <img className="truck-img" src={src} alt="" draggable={false} aria-hidden />
      <img
        className="truck-reflection"
        src={src}
        alt=""
        draggable={false}
        aria-hidden
      />
      {showLeft ? (
        <img
          className="truck-glow truck-glow--left"
          src={heroAssets.fxGlow}
          alt=""
          draggable={false}
          aria-hidden
        />
      ) : null}
      {showRight ? (
        <img
          className="truck-glow truck-glow--right"
          src={heroAssets.fxGlow}
          alt=""
          draggable={false}
          aria-hidden
        />
      ) : null}
    </div>
  );
}

export default function HeroScene() {
  return (
    <section id="hero" className="hero-stage">
      <div className="hero-scene">
        <div className="hero-layer hero-sky" data-depth="0.05">
          <img src={heroAssets.bgSky} alt="" draggable={false} aria-hidden />
        </div>

        <div className="hero-layer hero-road" data-depth="0.12">
          <img src={heroAssets.road} alt="" draggable={false} aria-hidden />
        </div>

        <h1 className="hero-headline" data-depth="0">
          Cross-Haulage, Border to Border
        </h1>

        <div className="hero-layer hero-dust" data-depth="0.3">
          <img src={heroAssets.fxDust} alt="" draggable={false} aria-hidden />
        </div>

        <Truck
          className="truck-wrap--scania"
          src={heroAssets.truckFaw}
          depth="0.5"
          glow="left"
        />
        <Truck
          className="truck-wrap--faw"
          src={heroAssets.truckScania}
          depth="0.5"
          glow="right"
        />
        <Truck
          className="truck-wrap--man"
          src={heroAssets.truckMan}
          depth="0.7"
          glow="both"
        />

        <div className="hero-layer hero-streaks" data-depth="0.9">
          <img src={heroAssets.fxStreaks} alt="" draggable={false} aria-hidden />
        </div>

        <div className="hero-layer hero-grass hero-grass--left" data-depth="1.4">
          <img src={heroAssets.fgGrass} alt="" draggable={false} aria-hidden />
        </div>
        <div className="hero-layer hero-grass hero-grass--right" data-depth="1.4">
          <img src={heroAssets.fgGrass} alt="" draggable={false} aria-hidden />
        </div>

        <div className="hero-tint" aria-hidden="true" />
      </div>
    </section>
  );
}
