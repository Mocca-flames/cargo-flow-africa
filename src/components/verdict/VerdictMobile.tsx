"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./VerdictCommon.css";
import "./VerdictMobile.css";

gsap.registerPlugin(ScrollTrigger);

export default function VerdictMobile() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    let ctx: gsap.Context | undefined;
    const frame = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=80%",
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
    <section id="verdict-section" ref={sectionRef} className="verdict verdict--mobile">
      <div className="verdict__content">
        <h2 className="verdict__headline" />
        <form className="verdict__form">
          <div className="verdict__field" />
          <div className="verdict__field" />
          <div className="verdict__field" />
          <button className="verdict__cta" />
        </form>
        <p className="verdict__stat" />
      </div>
    </section>
  );
}
