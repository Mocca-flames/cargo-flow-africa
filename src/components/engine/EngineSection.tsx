"use client";

import { useEffect, useState } from "react";
import EngineDesktop from "./EngineDesktop";
import EngineMobile from "./EngineMobile";

export default function EngineSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (isMobile === null) return null;

  return isMobile ? <EngineMobile key="mobile" /> : <EngineDesktop key="desktop" />;
}
