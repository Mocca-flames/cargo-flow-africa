"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CorridorCommon.css";
import "./CorridorDesktop.css";

gsap.registerPlugin(ScrollTrigger);

export default function CorridorDesktop() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    let ctx: gsap.Context | undefined;
    const frame = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        });
      }, sectionRef);
    });

    return () => {
      cancelAnimationFrame(frame);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      ctx?.revert();
    };
  }, []);

  return (
    <section id="corridor-section" ref={sectionRef} className="corridor corridor--desktop">
      <div className="corridor__split">
        <div className="corridor__half corridor__half--left" />
        <div className="corridor__gap" />
        <div className="corridor__half corridor__half--right" />
      </div>
      <div className="corridor__map">
        <div className="corridor__route-line" />
        <div className="corridor__border-markers" />
      </div>
    </section>
  );
}
