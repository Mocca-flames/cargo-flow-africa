"use client";

import { useEffect, useState } from "react";
import ThreatDesktop from "./ThreatDesktop";
import ThreatMobile from "./ThreatMobile";

export default function ThreatSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (isMobile === null) return null;

  return isMobile ? <ThreatMobile key="mobile" /> : <ThreatDesktop key="desktop" />;
}
