"use client";

import { useEffect, useRef } from "react";
import { heroAssets, heroMobileAssets } from "./heroAssets";
import { useHeroScrollMobile } from "./useHeroScrollMobile";
import HeroMobileV2 from "./HeroMobileV2";
import "./HeroMobile.css";

const HEADLINE_WORDS = [
  "Cross-Border",
  "Heavy",
  "Haulage",
  
];

export default function HeroMobile() {
  const stageRef = useRef<HTMLElement | null>(null);
  useHeroScrollMobile(stageRef);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let settled = false;
    const markReady = () => {
      if (!settled) {
        settled = true;
        stage.classList.add("is-ready");
      }
    };

    const fallback = window.setTimeout(markReady, 1500);

    const imageSrcs = [
      heroMobileAssets.bgSky,
      heroMobileAssets.road,
      heroMobileAssets.truckMan,
    ];

    const decoded = imageSrcs.map((src) => {
      const img = new Image();
      img.src = src;
      return img.decode().catch(() => undefined);
    });

    Promise.allSettled(decoded).then(() => {
      window.clearTimeout(fallback);
      markReady();
    });

    return () => {
      settled = true;
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <section className="hm-track" aria-label="Hero section">
      <section id="hero" className="hm-stage" ref={stageRef}>
        <HeroMobileV2 />

        <div className="hm-fade" aria-hidden="true" />

        <div className="hm-scene">
          <img
            className="hm-sky"
            src={heroMobileAssets.bgSky}
            alt=""
            draggable={false}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            aria-hidden="true"
          />

          <img
            className="hm-road"
            src={heroMobileAssets.road}
            alt=""
            draggable={false}
            loading="eager"
            decoding="async"
            aria-hidden="true"
          />

          <div className="hm-man-wrap" aria-hidden="true">
            <div className="hm-zoomB">
              <div className="hm-shadow hm-shadow--soft" />
              <div className="hm-shadow hm-shadow--core" />
              <img
                className="hm-man-img"
                src={heroMobileAssets.truckMan}
                alt=""
                draggable={false}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                aria-hidden="true"
              />
              <img
                className="hm-glow hm-glow--left"
                src={heroMobileAssets.fxGlow}
                alt=""
                draggable={false}
                aria-hidden="true"
              />
              <img
                className="hm-glow hm-glow--right"
                src={heroAssets.fxGlow}
                alt=""
                draggable={false}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="hm-copy">
            <div className="hm-copy-inner">
              <h1 className="hm-headline" aria-label="Cross-Border Heavy Haulage & Corridor Freight">
                {HEADLINE_WORDS.map((word, index) => (
                  <span key={`${word}-${index}`} className="hm-word">
                    {index > 0 ? " " : ""}
                    {word}
                  </span>
                ))}
              </h1>
              <p className="hm-sub">Secured from Origin to Destination.</p>
              <div className="hm-cards">
                <div className="hm-card">
                  <span className="hm-card-label">CORRIDOR</span>
                  <span className="hm-card-value">South Africa &#10132; DRC</span>
                </div>
                <div className="hm-card">
                  <span className="hm-card-label">
                    <span className="hm-card-dot" aria-hidden="true" />
                    STATUS
                  </span>
                  <span className="hm-card-value">Direct Fleet Dispatch</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hm-cue" aria-hidden="true">
            <div className="hm-cue-inner">
              <span className="hm-cue-chevron" />
              <span>SCROLL</span>
            </div>
          </div>

          <div className="hm-tint" aria-hidden="true" />
        </div>
      </section>
    </section>
  );
}
