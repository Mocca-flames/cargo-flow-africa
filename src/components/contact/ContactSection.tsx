"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import ContactDesktop from "./ContactDesktop";
import ContactMobile from "./ContactMobile";
import { useReveal } from "./useReveal";

/**
 * Contact — "Talk to Dispatch, or Visit Us" (LANDING_LAYOUT.md §13).
 *
 * Post-Verdict utility close: ready-strip → direct channels → branch
 * cards. No second geographic map (Coverage owns the page's one map) —
 * branches get photo placeholders + "Get directions" links instead.
 *
 * Same progressive contract as Process/Portfolio: SSR paints settled,
 * JS only arms the entrance and completes it once. Reduced motion →
 * static final paint.
 */
export default function ContactSection() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const armed = useSyncExternalStore(subscribeNoop, getArmed, getArmedServer);
  const entered = useReveal(rootRef, { enabled: armed });

  const className = [
    "contact",
    armed ? "contact--armed" : "",
    entered ? "contact--entered" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (isMobile === null) return null;

  return isMobile ? (
    <ContactMobile innerRef={rootRef} className={className} />
  ) : (
    <ContactDesktop innerRef={rootRef} className={className} />
  );
}

function subscribeNoop() {
  return () => {};
}

function getArmed() {
  return true;
}

function getArmedServer() {
  return false;
}
