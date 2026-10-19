"use client";

import "./Services.css";
import { useEffect, useState } from "react";
import ServicesDesktop from "./ServicesDesktop";
import ServicesMobile from "./ServicesMobile";

export default function ServicesSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1024px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (isMobile === null) return null;

  return isMobile ? <ServicesMobile /> : <ServicesDesktop />;
}
