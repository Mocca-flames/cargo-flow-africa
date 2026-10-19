"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import "./PremiseCommon.css";
import "./PremiseDesktop.css";
import "./PremiseLift.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function disableSnap() {
  document.documentElement.style.setProperty("scroll-snap-type", "none");
  document.getElementById("engine-section")?.style.setProperty("scroll-snap-align", "none");
}

function restoreSnap() {
  document.documentElement.style.removeProperty("scroll-snap-type");
  document.getElementById("engine-section")?.style.removeProperty("scroll-snap-align");
}

export default function PremiseDesktop() {
  const [ready, setReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 100);
    return () => window.clearTimeout(id);
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.innerWidth < 1024) return;

      const el = sectionRef.current;
      if (!el) return;

      const premiseHeight = el.offsetHeight;
      if (!premiseHeight) return;

      /* The lift scroll distance needs to cover both the Premise
         height (for the door to fully lift) AND give FleetHeading
         enough time to enter the viewport. We use 2x the Premise
         height so the Fleet section is fully visible before the
         lift ends. */
      const liftDistance = premiseHeight * 2;

      const ctx = gsap.context(() => {
        /* Animate Premise yPercent 0 → -100 as the user scrolls
           from the moment the Premise top hits the viewport top,
           for 2x the Premise height of scroll. The door fully
           lifts halfway through this range, and the extra scroll
           gives FleetHeading time to rise into the viewport. */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: `+=${liftDistance}`,
            scrub: 0.3,
            invalidateOnRefresh: true,
            onEnter: disableSnap,
            onEnterBack: disableSnap,
            onLeave: restoreSnap,
            onLeaveBack: restoreSnap,
          },
        });
        tl.fromTo(el, { yPercent: 0 }, { yPercent: -100, ease: "none" });
      });

      const refresh = () => ScrollTrigger.refresh();
      if (document.fonts?.ready) {
        document.fonts.ready.then(refresh);
      }
      window.addEventListener("load", refresh, { once: true });

      return () => {
        ctx.revert();
        restoreSnap();
        window.removeEventListener("load", refresh);
      };
    },
    { scope: sectionRef, dependencies: [] }
  );

  return (
    <section
      id="premise-section"
      ref={sectionRef}
      className={`premise premise--desktop${ready ? " premise--ready" : ""}`}
    >
      <div className="premise-content">
        <h1 className="premise-headline">
          The weight of a deadline,
          <br />
          measured in distance.
        </h1>
      </div>
    </section>
  );
}
