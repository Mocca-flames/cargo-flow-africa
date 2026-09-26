"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ThreatCommon.css";
import "./ThreatMobile.css";

gsap.registerPlugin(ScrollTrigger);

export default function ThreatMobile() {
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
          end: "+=150%",
          pin: true,
          scrub: 0.4,
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
    <section
      id="threat-section"
      ref={sectionRef}
      className="threat threat--mobile"
    >
      <div className="threat__panel threat__panel--left">
        <div className="threat__panel-image" />
      </div>
      <div className="threat__panel threat__panel--right">
        <div className="threat__panel-image" />
      </div>
    </section>
  );
}
