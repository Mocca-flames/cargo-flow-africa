"use client";

import { useEffect, useState } from "react";
import LoadsDesktop from "./LoadsDesktop";
import LoadsMobile from "./LoadsMobile";

export default function LoadsSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (isMobile === null) return null;

  return isMobile ? <LoadsMobile key="mobile" /> : <LoadsDesktop key="desktop" />;
}
