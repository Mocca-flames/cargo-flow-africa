"use client";

import { useEffect, useRef, useState } from "react";
import { commodities } from "@/data/commodities";
import { corridors } from "@/data/corridors";
import { fleetByCode } from "@/data/fleet";
import CommodityScene from "./CommodityScene";

type ProofVariant = "desktop" | "mobile";

const pad = (n: number) => String(n).padStart(2, "0");

export default function ProofDeck({ variant }: { variant: ProofVariant }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [entered, setEntered] = useState(false);
  /* ProofSection gates on matchMedia, so this component only ever
     renders client-side — the capability check is safe here. */
  const [noIo] = useState(
    () => typeof IntersectionObserver === "undefined"
  );
  const [inView, setInView] = useState(noIo);
  const [active, setActive] = useState(0);
  const [arrive, setArrive] = useState(false);
  /* Client-only (ProofSection gates on matchMedia), so this is safe. */
  const [scrub] = useState(
    () =>
      variant === "mobile" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  /* Reveal on approach + the motion gate. `entered` is one-way (the
     entrance never replays); `inView` toggles both ways so every scene
     and the ticker stop completely once the section scrolls off. The
     1500ms fallback keeps content from stranding, matching Ch3. */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const show = () => setEntered(true);
    const fallback = window.setTimeout(show, 1500);

    if (noIo) {
      show();
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setInView(entry.isIntersecting);
        if (entry.intersectionRatio >= 0.12) setEntered(true);
      },
      { threshold: [0, 0.12] }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [noIo]);

  /* Mobile, scrubbed: scroll progress through the pin drives the deck.
     No React state per frame; only a transform write. `active` updates
     only when the card index actually changes. */
  useEffect(() => {
    if (!scrub) return;
    const pin = pinRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    const deck = deckRef.current;
    if (!pin || !stage || !frame || !deck) return;

    const last = commodities.length - 1;
    const HOLD = 0.06;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));

    let maxX = 0;
    let range = 1;
    let raf = 0;
    let lastP = -1;
    let lastIdx = -1;

    const measure = () => {
      maxX = Math.max(0, deck.scrollWidth - frame.clientWidth);
      range = Math.max(1, pin.offsetHeight - stage.offsetHeight);
    };

    const tick = () => {
      raf = 0;
      const raw = clamp(-pin.getBoundingClientRect().top / range);
      const p = clamp((raw - HOLD) / (1 - HOLD * 2));
      if (p === lastP) return;
      lastP = p;
      deck.style.transform = `translate3d(${-p * maxX}px,0,0)`;
      const idx = Math.round(p * last);
      if (idx !== lastIdx) {
        lastIdx = idx;
        setActive(idx);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      measure();
      lastP = -1;
      schedule();
    };

    measure();
    tick();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(deck);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      deck.style.transform = "";
    };
  }, [scrub]);

  /* Mobile fallback (reduced motion): the original native snap deck. */
  useEffect(() => {
    if (variant !== "mobile" || scrub) return;
    const deck = deckRef.current;
    if (!deck || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIndex = -1;
        let bestRatio = 0;
        for (const entry of entries) {
          const index = Number(
            (entry.target as HTMLElement).dataset.index ?? "-1"
          );
          if (index >= 0 && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIndex = index;
          }
        }
        if (bestIndex >= 0 && bestRatio >= 0.6) setActive(bestIndex);
      },
      { root: deck, threshold: 0.6 }
    );

    deck.querySelectorAll<HTMLElement>("[data-index]").forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, [variant, scrub]);

  /* Desktop without a usable hover pointer (touch laptops): one beat on
     arrival, then idle — hover is never the only way to see the flair.
     Desktops with a fine pointer wait for hover instead. */
  useEffect(() => {
    if (variant !== "desktop" || !entered) return;
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const start = window.setTimeout(() => setArrive(true), 0);
    const stop = window.setTimeout(() => setArrive(false), 1600);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(stop);
      setArrive(false);
    };
  }, [variant, entered]);

  const tickerText = `${commodities
    .map((item) => item.tickerName)
    .join(" · ")} · + more`;

  return (
    <section
      id="proof-section"
      ref={sectionRef}
      className={[
        "proof",
        `proof--${variant}`,
        scrub ? "proof--scrub" : "",
        entered ? "proof--entered" : "",
        inView ? "proof--inview" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby="proof-heading"
    >
      <div
        className="proof__pin"
        ref={pinRef}
        style={{ "--proof-steps": commodities.length - 1 } as React.CSSProperties}
      >
        <div className="proof__stage" ref={stageRef}>
          <header className="proof__header">
            <p className="proof__eyebrow">
              <span className="proof__eyebrow-index">04</span> / PROOF
            </p>
            <h2 className="proof__heading" id="proof-heading">
              What We Move
            </h2>
          </header>

          <div className="proof__deck-frame" ref={frameRef}>
            <span className="proof__counter" aria-hidden="true">
              {pad(active + 1)} / {pad(commodities.length)}
            </span>

            <div className="proof__deck" ref={deckRef}>
          {commodities.map((item, index) => {
            const trailer = fleetByCode(item.fleet[0]);
            const corridor = corridors[item.corridorId];
            if (!trailer || !corridor) return null;
            const live =
              variant === "mobile" && (noIo || index === active);

            return (
              <article
                key={item.id}
                className="proof__card"
                data-index={index}
                data-active={live ? "true" : "false"}
                data-arrive={arrive ? "true" : "false"}
              >
                <span className="proof__card-ghost" aria-hidden="true">
                  {pad(item.index)}
                </span>
                <div className="proof__card-head">
                  <h3 className="proof__card-name">{item.name}</h3>
                  <p className="proof__card-hook">{item.hook}</p>
                </div>
                <div className="proof__card-scene">
                  <CommodityScene scene={item.sceneId} />
                </div>
                <div className="proof__card-foot">
                  <a
                    className="proof__tag"
                    href={`#fleet-${trailer.id}`}
                    aria-label={`Inspect the ${trailer.name} in Our Fleet`}
                  >
                    {trailer.code}
                  </a>
                  {item.fleet.slice(1).map((code) => (
                    <span
                      key={code}
                      className="proof__tag-chip"
                      aria-hidden="true"
                    >
                      {code}
                    </span>
                  ))}
                  <p className="proof__corridor">
                    <span
                      className="proof__corridor-dot"
                      aria-hidden="true"
                    />
                    {corridor.from} <span aria-hidden="true">→</span>{" "}
                    {corridor.to}
                  </p>
                </div>
              </article>
            );
          })}
            </div>
          </div>

          <footer className="proof__closing">
            <div className="proof__ticker" aria-hidden="true">
              <div className="proof__ticker-track">
                <span className="proof__ticker-run">{tickerText}</span>
                <span className="proof__ticker-run">{tickerText}</span>
              </div>
            </div>
            <p className="proof__ticker-static">{tickerText}</p>
            <a className="proof__where" href="#corridor-section">
              Where it goes <span aria-hidden="true">→</span>
            </a>
          </footer>
        </div>
      </div>
    </section>
  );
}
