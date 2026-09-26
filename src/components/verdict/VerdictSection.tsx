"use client";

import { useEffect, useState } from "react";
import VerdictDesktop from "./VerdictDesktop";
import VerdictMobile from "./VerdictMobile";

export default function VerdictSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (isMobile === null) return null;

  return isMobile ? <VerdictMobile key="mobile" /> : <VerdictDesktop key="desktop" />;
}
