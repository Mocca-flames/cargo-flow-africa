"use client";

import { useEffect, useRef } from "react";
import { heroAssets } from "./heroAssets";
import { useHeroPointer } from "./useHeroPointer";
import { useHeroScroll } from "./useHeroScroll";
import "./HeroScene.css";

type TruckProps = {
  className: string;
  src: string;
  depth: string;
  side?: "left" | "right";
  glow?: "left" | "right" | "both";
};

const depthStyle = (depth: string) => ({ ["--depth" as string]: depth });

function Truck({ className, src, depth, side, glow = "both" }: TruckProps) {
  const showLeft = glow === "left" || glow === "both";
  const showRight = glow === "right" || glow === "both";

  return (
    <div
      className={`truck-wrap ${className}`}
      data-depth={depth}
      data-side={side}
      style={depthStyle(depth)}
    >
      <div className="intro intro--reveal intro--truck">
        <div className="dolly">
          <div className="truck-shadow truck-shadow--soft" aria-hidden="true" />
          <div className="truck-shadow truck-shadow--core" aria-hidden="true" />
          <div className="live">
            <div className="truck-bob">
              <img className="truck-img" src={src} alt="" draggable={false} aria-hidden />
              <img
                className="truck-reflection"
                src={src}
                alt=""
                draggable={false}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
      {showLeft || showRight ? (
        <div className="intro intro--reveal intro--glow">
          <div className="dolly">
            <div className="live">
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
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function HeroScene() {
  const stageRef = useRef<HTMLElement | null>(null);
  useHeroScroll(stageRef);
  useHeroPointer(stageRef);

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

    const truckSrcs = [
      heroAssets.truckMan,
      heroAssets.truckScania,
      heroAssets.truckFaw,
    ];
    const decoded = truckSrcs.map((src) => {
      const img = new Image();
      img.src = src;
      return img.decode();
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
    <section className="hero-track">
      <section id="hero" className="hero-stage" ref={stageRef}>
        <div className="v2">
          <span className="v2-label">V2 / CONTROL ROOM</span>
          <div className="v2-shadow" aria-hidden="true" />
        </div>

        <div className="v1-slab">
          <div className="hero-scene dolly dolly--scene">
            <div className="hero-layer hero-sky" data-depth="0.05" style={depthStyle("0.05")}>
              <div className="intro intro--reveal intro--sky">
                <div className="dolly dolly--sky">
                  <div className="live">
                    <img src={heroAssets.bgSky} alt="" draggable={false} aria-hidden />
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-layer hero-road" data-depth="0.12" style={depthStyle("0.12")}>
              <div className="intro intro--reveal intro--road">
                <div className="dolly dolly--road">
                  <div className="live">
                    <img src={heroAssets.road} alt="" draggable={false} aria-hidden />
                  </div>
                </div>
              </div>
            </div>

            <div
              className="hero-copy"
              data-depth="0"
              style={depthStyle("0")}
            >
              <div className="intro intro--reveal intro--headline">
                <div className="dolly dolly--headline">
                  <div className="live">
                    <h1 className="hero-headline">
                      <span className="hero-word">Cross-Border</span>{" "}
                      <span className="hero-word">Heavy</span>{" "}
                      <span className="hero-word">Haulage</span>{" "}
                      <span className="hero-word">&amp;</span>{" "}
                      <span className="hero-word">Corridor</span>{" "}
                      <span className="hero-word">Freight</span>
                    </h1>
                    <p className="hero-sub">Secured from Origin to Destination.</p>
                    <div className="hero-pills">
                      <span className="hero-pill">
                        CORRIDOR: SOUTH AFRICA &#10132; DRC (LUBUMBASHI / KOLWEZI)
                      </span>
                      <span className="hero-pill">
                        <span className="hero-pill-dot" aria-hidden="true" />
                        STATUS: DIRECT FLEET DISPATCH
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-layer hero-dust" data-depth="0.3" style={depthStyle("0.3")}>
              <div className="intro">
                <div className="dolly dolly--dust">
                  <div className="live">
                    <img src={heroAssets.fxDust} alt="" draggable={false} aria-hidden />
                  </div>
                </div>
              </div>
            </div>

            <Truck
              className="truck-wrap--scania"
              src={heroAssets.truckFaw}
              depth="0.5"
              side="left"
              glow="left"
            />
            <Truck
              className="truck-wrap--faw"
              src={heroAssets.truckScania}
              depth="0.5"
              side="right"
              glow="right"
            />
            <Truck
              className="truck-wrap--man"
              src={heroAssets.truckMan}
              depth="0.7"
              glow="both"
            />

            <div className="hero-layer hero-streaks" data-depth="0.9" style={depthStyle("0.9")}>
              <div className="intro">
                <div className="dolly dolly--streaks">
                  <div className="live">
                    <img src={heroAssets.fxStreaks} alt="" draggable={false} aria-hidden />
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-layer hero-grass hero-grass--left" data-depth="1.4" style={depthStyle("1.4")}>
              <div className="intro">
                <div className="dolly dolly--grass">
                  <div className="live">
                    <img src={heroAssets.fgGrass} alt="" draggable={false} aria-hidden />
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-layer hero-grass hero-grass--right" data-depth="1.4" style={depthStyle("1.4")}>
              <div className="intro">
                <div className="dolly dolly--grass">
                  <div className="live">
                    <img src={heroAssets.fgGrass} alt="" draggable={false} aria-hidden />
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-tint" aria-hidden="true" />
          </div>

          <div className="gate-edge" aria-hidden="true" />
        </div>
      </section>
    </section>
  );
}
