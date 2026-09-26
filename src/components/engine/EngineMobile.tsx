"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./EngineCommon.css";
import "./EngineMobile.css";

gsap.registerPlugin(ScrollTrigger);

export default function EngineMobile() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    let ctx: gsap.Context | undefined;
    const frame = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 0.3,
          anticipatePin: 1,
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
    <section id="engine-section" ref={sectionRef} className="engine engine--mobile">
      <div className="engine__asset-switcher">
        <div className="engine__asset" data-active="true" />
        <div className="engine__asset" />
        <div className="engine__asset" />
      </div>
      <div className="engine__spec-panels">
        <div className="engine__spec-panel" />
        <div className="engine__spec-panel" />
      </div>
    </section>
  );
}
