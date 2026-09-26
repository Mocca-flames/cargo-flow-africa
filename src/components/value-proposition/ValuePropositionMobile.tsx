"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ValuePropositionCommon.css";
import "./ValuePropositionMobile.css";

gsap.registerPlugin(ScrollTrigger);

export default function ValuePropositionMobile() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const labelRef = useRef<HTMLParagraphElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const bodyRef = useRef<HTMLParagraphElement | null>(null);
  const statsRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => setIsVideoReady(true);
    if (video.readyState >= 3) {
      onReady();
    } else {
      video.addEventListener("loadeddata", onReady, { once: true });
    }
    return () => {
      video.removeEventListener("loadeddata", onReady);
    };
  }, []);

  useEffect(() => {
    if (!isVideoReady || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=80%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        0
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.1
        )
        .fromTo(
          bodyRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.25
        )
        .fromTo(
          statsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.45
        )
        .fromTo(
          ".value-prop__stat",
          { opacity: 0, y: 15, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.12, ease: "power2.out" },
          0.55
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [isVideoReady]);

  return (
    <section
      id="value-proposition"
      ref={sectionRef}
      className={`value-prop value-prop--mobile${isVideoReady ? "" : " value-prop--loading"}`}
    >
      <video
        ref={videoRef}
        className="value-prop__video"
        src="/videos/section_2_mobile.webm"
        poster="/images/section_2_poster.png"
        preload="auto"
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
      />
      <div className="value-prop__overlay" />
      <div className="value-prop__content">
        <p ref={labelRef} className="value-prop__label">
          Chapter 2 — The Strength
        </p>
        <h2 ref={headlineRef} className="value-prop__headline">
          The strongest crossborder network in Africa.
        </h2>
        <p ref={bodyRef} className="value-prop__body">
          Cargo Flow Africa moves heavy haulage across 54 corridors and 12
          countries. Every truck is tracked, every border is cleared.
        </p>
        <div ref={statsRef} className="value-prop__stats">
          <div className="value-prop__stat">
            <span className="value-prop__stat-value">54</span>
            <span className="value-prop__stat-label">Corridors</span>
          </div>
          <div className="value-prop__stat">
            <span className="value-prop__stat-value">12</span>
            <span className="value-prop__stat-label">Countries</span>
          </div>
          <div className="value-prop__stat">
            <span className="value-prop__stat-value">1,400+</span>
            <span className="value-prop__stat-label">Trucks</span>
          </div>
          <div className="value-prop__stat">
            <span className="value-prop__stat-value">98%</span>
            <span className="value-prop__stat-label">On-Time</span>
          </div>
        </div>
      </div>
    </section>
  );
}