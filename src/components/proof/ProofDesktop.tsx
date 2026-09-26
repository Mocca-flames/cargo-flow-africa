"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ProofCommon.css";
import "./ProofDesktop.css";

gsap.registerPlugin(ScrollTrigger);

export default function ProofDesktop() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    let ctx: gsap.Context | undefined;
    const frame = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
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
    <section id="proof-section" ref={sectionRef} className="proof proof--desktop">
      <div className="proof__grid">
        <div className="proof__column proof__column--1" />
        <div className="proof__column proof__column--2" />
        <div className="proof__column proof__column--3" />
      </div>
    </section>
  );
}
