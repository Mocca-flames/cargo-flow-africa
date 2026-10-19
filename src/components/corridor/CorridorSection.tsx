"use client";

import { useEffect, useState } from "react";
import CorridorDesktop from "./CorridorDesktop";
import CorridorMobile from "./CorridorMobile";
import { MOBILE_MAX } from "./config";

export default function CorridorSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_MAX}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (isMobile === null) return null;

  // Each variant owns its CSS file (Corridor{Desktop,Mobile}.css) and passes
  // `variant` down, which drives both the `.corridor--x` root class those
  // files are scoped to AND the camera framing (camera.ts).
  return isMobile ? (
    <CorridorMobile key="mobile" />
  ) : (
    <CorridorDesktop key="desktop" />
  );
}
