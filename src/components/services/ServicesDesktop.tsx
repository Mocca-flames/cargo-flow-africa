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

export default function ServicesDesktop() {
  const root = useRef<HTMLElement>(null);
  const count = services.length;

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const track = el.querySelector<HTMLElement>(".services-track")!;
      const panels = q(".services-panel");
      const images = q(".services-image");
      const railDots = q(".services-rail__dot");
      const fill = el.querySelector<HTMLElement>(".services-rail__fill")!;

      let current = -1;
      const activate = (i: number) => {
        if (i === current) return;
        current = i;

        panels.forEach((p, k) => {
          const active = k === i;
          p.classList.toggle("is-active", active);
          p.setAttribute("aria-hidden", String(!active));
        });

        images.forEach((m, k) => m.classList.toggle("is-active", k === i));

        railDots.forEach((d, k) => {
          d.classList.toggle("is-active", k === i);
          d.classList.toggle("is-past", k < i);
        });

        const pct = count > 1 ? (i / (count - 1)) * 100 : 0;
        fill.style.setProperty("--rail-p", String(pct / 100));
      };
      activate(0);

      const st = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) =>
          activate(Math.min(count - 1, Math.floor(self.progress * count))),
      });

      const onDot =
        (i: number) => () => {
          const y =
            st.start + ((i + 0.5) / count) * (st.end - st.start);
          window.scrollTo({ top: y, behavior: "smooth" });
        };
      const handlers = railDots.map((d, i) => {
        const h = onDot(i);
        d.addEventListener("click", h);
        return h;
      });

      return () =>
        railDots.forEach((d, i) =>
          d.removeEventListener("click", handlers[i])
        );
    },
    { scope: root, dependencies: [count] }
  );

  return (
    <section id="services" ref={root} className="services services--desktop">
      <div className="services-track">
        <div className="services-sticky">
          <div className="services-rail">
            <div className="services-rail__fill" aria-hidden="true" />
            <ol className="services-rail__dots">
              {services.map((s, i) => (
                <li key={s.id}>
                  <button
                    className="services-rail__dot"
                    aria-label={`Service ${i + 1}: ${s.title}`}
                  />
                </li>
              ))}
            </ol>
          </div>

          <div className="services-panels">
            {services.map((s, i) => (
              <article
                key={s.id}
                className="services-panel"
                aria-hidden={i !== 0 ? "true" : "false"}
              >
                <span className="services-panel__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="services-panel__title">{s.title}</h3>
                <p className="services-panel__body">{s.body}</p>
              </article>
            ))}
          </div>

          <div className="services-images" aria-hidden="true">
            {services.map((s, i) => (
              <div key={s.id} className="services-image">
                <picture>
                  <source
                    media="(min-width: 1025px)"
                    srcSet={`/images/services/s${i + 1}_desktop.avif`}
                  />
                  <source
                    srcSet={`/images/services/s${i + 1}_mobile.avif`}
                  />
                  <img
                    src={`/images/services/s${i + 1}.webp`}
                    alt=""
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </picture>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
