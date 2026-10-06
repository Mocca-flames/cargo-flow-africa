"use client";

import { useEffect, useState } from "react";
import PremiseDesktop from "./PremiseDesktop";
import PremiseMobile from "./PremiseMobile";

export default function PremiseSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (isMobile === null) return null;

  const variant = isMobile ? <PremiseMobile key="mobile" /> : <PremiseDesktop key="desktop" />;

  return (
    <>
      {variant}
      <PremiseTransition />
    </>
  );
}

function PremiseTransition() {
  useEffect(() => {
    const section = document.getElementById("premise-section");
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const rect = section.getBoundingClientRect();
      const progressed = rect.top < -rect.height * 0.6;
      section.classList.toggle("premise--desaturated", progressed);
    };
    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
