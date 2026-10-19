"use client";

import { useEffect, useState } from "react";
import { useQuoteForm } from "./useQuoteForm";
import VerdictDesktop from "./VerdictDesktop";
import VerdictMobile from "./VerdictMobile";

export default function VerdictSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const form = useQuoteForm();

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (isMobile === null) return null;

  return isMobile ? (
    <VerdictMobile key="mobile" {...form} />
  ) : (
    <VerdictDesktop key="desktop" {...form} />
  );
}
