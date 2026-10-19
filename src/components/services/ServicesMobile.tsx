"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const services = [
  {
    id: "border-customs",
    title: "Clearance",
    body: "Kasumbalesa sorted. Papers done. Agents on site. No queue sitting.",
  },
  {
    id: "live-tracking",
    title: "Live Tracking",
    body: "Durban to drop-off. Every border. Straight to WhatsApp.",
  },
  {
    id: "cargo-security",
    title: "Cargo Security",
    body: "Sealed. Escorted. Covered. High-value cargo safe by default.",
  },
  {
    id: "accountable-contact",
    title: "One Contact",
    body: "One person. Anytime. We tell you first. We own it.",
  },
  {
    id: "digital-paperwork",
    title: "Digital Paperwork",
    body: "Border fees included. No surprises. POD and invoice same day.",
  },
];

export default function ServicesMobile() {
  const root = useRef<HTMLElement>(null);
  const count = services.length;

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const panels = q(".services-panel");
      const images = q(".services-image");

      let current = -1;
      const activate = (i: number) => {
        if (i === current) return;
        current = i;
        panels.forEach((p, k) => p.classList.toggle("is-active", k === i));
        images.forEach((m, k) => m.classList.toggle("is-active", k === i));
      };
      activate(0);

      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && activate(i),
        });
      });
    },
    { scope: root, dependencies: [count] }
  );

  return (
    <section id="services" ref={root} className="services services--mobile">
      <div className="services-track">
        <div className="services-sticky">
          <div className="services-images" aria-hidden="true">
            {services.map((s, i) => (
              <div key={s.id} className="services-image">
                <picture>
                  <source
                    media="(max-width: 1024px)"
                    srcSet={`/images/services/s${i + 1}_mobile.avif`}
                  />
                  <img
                    src={`/images/services/s${i + 1}_desktop.avif`}
                    alt=""
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </picture>
              </div>
            ))}
          </div>

          <div className="services-panels">
            {services.map((s, i) => (
              <article key={s.id} className="services-panel">
                <span className="services-panel__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="services-panel__title">{s.title}</h3>
                <p className="services-panel__body">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
