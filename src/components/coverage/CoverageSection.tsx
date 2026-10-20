"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PLACES, CORRIDORS } from "@/data/coverage-corridors-wide";
import { MAP_SPACE, TERRITORIES } from "@/data/coverage-territories-wide";
import { coverageCopy } from "@/data/coverage";
import { buildWhatsAppTextLink } from "@/components/verdict/quote-form";
import {
  ORDER,
  STOPS,
  FRAME_W,
  FRAME_H,
  OCEAN,
  PIN_PX,
  dotIds,
  layoutLabels,
  viewBoxFor,
  type CorridorId,
  type StopId,
  type VB,
} from "./framing";
import "./CoverageScroll.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * Coverage — "Where We Operate", scroll-driven version.
 *
 * ONE full-bleed <svg> fills the pinned viewport edge to edge: the wide
 * hillshade basemap as a plain <image>, faint territory shapes, the four
 * corridor paths and their pins. The camera moves ONLY by changing the
 * SVG viewBox (GSAP + ScrollTrigger, scrubbed); framing lives in
 * ./framing.ts and is a pure function of the generated data + size.
 *
 * POSITIONS come only from the *-wide.ts generated files (PLACES /
 * CORRIDORS / TERRITORIES). Nothing geographic is hand-typed here —
 * font sizes, pill padding and icon glyphs below are UI styling, not
 * map positions. The "Kolwezi area" part of the DRC specialty label is
 * TEXT attached to the Lubumbashi coordinate (Kolwezi has no entry in
 * the data file, so no second dot is invented).
 */

const RAIL_LABEL: Record<StopId, string> = {
  A: "North-South",
  B: "Kazungula",
  C: "Trans-Kalahari",
  D: "Zimbabwe",
  NETWORK: "Network",
};

const CORR_COLOR: Record<CorridorId, string> = {
  A: "#E8590C",
  B: "#F2B01E",
  C: "#2BB3C0",
  D: "#D63384",
};

const MAP_SRC = "/southern-africa-wide.avif";

/* ─── Card copy (text only — no coordinates) ─── */

type CardPost = { post: string; time: string; note?: string };

type CardCopy = {
  kind: "corridor" | "network";
  eyebrow: string;
  name: string;
  departs?: string;
  posts?: CardPost[];
  trust?: string;
  cta: string;
  wa: string;
};

const KASU: CardPost = {
  post: "Kasumbalesa",
  time: "104 h avg into DRC (3–7 days at peak)",
  note: "planning window, varies",
};

const DEPARTS_JHB = "Departs Johannesburg and Durban";
const DEPARTS_GBE = "Departs Gaborone, fed from Johannesburg and Durban";

const CARDS: Record<StopId, CardCopy> = {
  A: {
    kind: "corridor",
    eyebrow: "Corridor A",
    name: "North-South",
    departs: DEPARTS_JHB,
    posts: [
      { post: "Beitbridge", time: "8–30 h" },
      { post: "Chirundu", time: "15–33 h" },
      KASU,
    ],
    trust: "Daily cross-border transfers via Beitbridge; Chirundu link to Zambia and DRC.",
    cta: "Get a quote for this corridor",
    wa: "Hi Cargo Flow Africa, I need a quote for Corridor A (North-South, Johannesburg HQ to Lubumbashi) via Beitbridge / Chirundu / Kasumbalesa.",
  },
  B: {
    kind: "corridor",
    eyebrow: "Corridor B",
    name: "Kazungula",
    departs: DEPARTS_GBE,
    posts: [
      { post: "Skilpadshek (Ramatlabama 2–4 h)", time: "2–6 h" },
      { post: "Kazungula", time: "8–24 h" },
      KASU,
    ],
    trust: "Botswana hub feeds Kazungula, Zambia and the DRC.",
    cta: "Get a quote for this corridor",
    wa: "Hi Cargo Flow Africa, I need a quote for Corridor B (Kazungula, Gaborone HQ to Lubumbashi) via Skilpadshek / Kazungula / Kasumbalesa.",
  },
  C: {
    kind: "corridor",
    eyebrow: "Corridor C",
    name: "Trans-Kalahari",
    departs: DEPARTS_GBE,
    posts: [
      { post: "Buitepos", time: "2–6 h" },
      { post: "Katima Mulilo", time: "2–4 h" },
      KASU,
    ],
    trust: "Weekly consolidation via Windhoek to Lusaka and the DRC Copperbelt.",
    cta: "Get a quote for this corridor",
    wa: "Hi Cargo Flow Africa, I need a quote for Corridor C (Trans-Kalahari, Gaborone HQ via Windhoek to Lubumbashi) via Buitepos / Katima Mulilo / Kasumbalesa.",
  },
  D: {
    kind: "corridor",
    eyebrow: "Corridor D",
    name: "Zimbabwe",
    departs: DEPARTS_GBE,
    posts: [
      { post: "Plumtree", time: "4–12 h" },
      { post: "Chirundu", time: "15–33 h" },
      KASU,
    ],
    trust: "Daily cross-border transfers via Plumtree; Chirundu link to Zambia and DRC.",
    cta: "Get a quote for this corridor",
    wa: "Hi Cargo Flow Africa, I need a quote for Corridor D (Zimbabwe, Gaborone HQ to Lubumbashi) via Plumtree / Chirundu / Kasumbalesa.",
  },
  NETWORK: {
    kind: "network",
    eyebrow: "Network",
    name: "Two hubs. Four ways in. One destination: the DRC Copperbelt.",
    departs: "Departs Johannesburg, Durban and Gaborone",
    trust: "Don't see your route? We probably run it. Ask us.",
    cta: "Ask us on WhatsApp",
    wa: "Hi Cargo Flow Africa, I need a quote to the DRC Copperbelt (Lubumbashi / Kolwezi area).",
  },
};

/* ─── SVG helpers (styling only — geography stays in the data files) ─── */

function Pill({
  x,
  y,
  text,
  fs,
  className,
}: {
  x: number;
  y: number;
  text: string;
  fs: number;
  className: string;
}) {
  const w = text.length * fs * 0.62 + fs * 1.2;
  const h = fs * 1.9;
  return (
    <g transform={`translate(${x} ${y})`} className={className}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} />
      <text textAnchor="middle" dominantBaseline="central" fontSize={fs}>
        {text}
      </text>
    </g>
  );
}

/**
 * Tiny anchor glyph for the Durban port diamond, drawn at unit scale
 * (caller wraps it in scale(s)). UI icon, not geography.
 */
function AnchorIcon() {
  return (
    <g className="cov2-ico" fill="none" strokeWidth={1.4} strokeLinecap="round">
      <circle cx={0} cy={-3.4} r={1.3} />
      <path d="M0 -2.1 V4.6 M-3 1 H3 M-3 1 Q-3 4 0 4.6 Q3 4 3 1" />
    </g>
  );
}

/**
 * Tiny boom-gate glyph for border posts, drawn at unit scale (caller
 * wraps it in scale(s)). UI icon, not geography.
 */
function BoomIcon() {
  return (
    <g className="cov2-ico cov2-ico--dark">
      <rect x={-1.1} y={-1} width={2.2} height={5.6} rx={0.8} />
      <rect x={0.4} y={-5.6} width={11} height={2.2} rx={1.1} transform="rotate(-16)" />
    </g>
  );
}

export default function CoverageSection() {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [size, setSize] = useState({ cw: 0, ch: 0 });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1025px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const measure = () => {
      const el = pinRef.current;
      setSize({
        cw: (el?.clientWidth || window.innerWidth) ?? 1440,
        ch: (el?.clientHeight || window.innerHeight) ?? 900,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const mapSrc = MAP_SRC;

  const goTo = useCallback(
    (i: number) => {
      const st = stRef.current;
      if (!st) return;
      const y = st.start + (i / (STOPS.length - 1)) * (st.end - st.start);
      window.scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced]
  );

  const onRailKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        goTo(Math.min(STOPS.length - 1, active + 1));
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(Math.max(0, active - 1));
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(STOPS.length - 1);
      }
    },
    [active, goTo]
  );

  /* Constant-on-screen units for the settled stop (recomputed on resize). */
  const stop = STOPS[active];
  const cw = size.cw || 1440;
  const ch = size.ch || 900;
  const layout = layoutLabels(stop, cw, ch);
  const s = layout.scale;
  const fs = layout.fs;
  const placedById = new Map(layout.placed.map((l) => [l.id, l]));
  const lineW = 4 * s;
  const glowW = 10 * s;
  const feederW = 2.5 * s;
  const feederDash = `${6 * s} ${4 * s}`;

  /* Scrubbed pinned sequence (full motion). */
  useEffect(() => {
    if (reduced) return;
    const pinEl = pinRef.current;
    const svg = svgRef.current;
    if (!pinEl || !svg) return;

    const sizeOf = () => ({
      cw: pinEl.clientWidth || window.innerWidth,
      ch: pinEl.clientHeight || window.innerHeight,
    });
    const apply = (vb: VB) =>
      svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);

    const ctx = gsap.context(() => {
      const sz = sizeOf();
      const vb: VB = viewBoxFor("A", sz.cw, sz.ch);
      apply(vb);
      const q = gsap.utils.selector(pinEl);

      ORDER.forEach((id) => {
        if (id === "A") {
          gsap.set(q(`[data-draw="${id}"]`), { strokeDasharray: 1, strokeDashoffset: 0 });
        } else {
          gsap.set(q(`[data-corr="${id}"]`), { opacity: 0 });
          gsap.set(q(`[data-draw="${id}"]`), { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.set(q(`[data-pins="${id}"]`), { autoAlpha: 0 });
        }
      });

      const isMobile = window.innerWidth <= 1024;
      const scrollDistance = isMobile ? window.innerHeight * 1.8 : window.innerHeight * 3.5;
      const tl = gsap.timeline({
        defaults: { ease: "power1.inOut" },
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            setActive(Math.min(STOPS.length - 1, Math.round(self.progress * (STOPS.length - 1)))),
        },
      });
      stRef.current = tl.scrollTrigger as ScrollTrigger;

      (["B", "C", "D"] as CorridorId[]).forEach((id, k) => {
        const t = k; // segments 0..2, NETWORK at 3
        tl.to(
          vb,
          {
            x: () => viewBoxFor(id, sizeOf().cw, sizeOf().ch).x,
            y: () => viewBoxFor(id, sizeOf().cw, sizeOf().ch).y,
            w: () => viewBoxFor(id, sizeOf().cw, sizeOf().ch).w,
            h: () => viewBoxFor(id, sizeOf().cw, sizeOf().ch).h,
            duration: 1,
            onUpdate: () => apply(vb),
          },
          t
        );
        tl.to(q(`[data-corr="${id}"]`), { opacity: 1, duration: 0.15 }, t);
        tl.fromTo(
          q(`[data-draw="${id}"]`),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.9 },
          t
        );
        tl.fromTo(
          q(`[data-pins="${id}"]`),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5 },
          t + 0.35
        );
        const prev = (["A", "B", "C"] as const)[k];
        tl.to(q(`[data-corr="${prev}"]`), { opacity: 0.25, duration: 0.4 }, t + 0.4);
      });

      // NETWORK: zoom out, all four at full strength.
      tl.to(
        vb,
        {
          x: () => viewBoxFor("NETWORK", sizeOf().cw, sizeOf().ch).x,
          y: () => viewBoxFor("NETWORK", sizeOf().cw, sizeOf().ch).y,
          w: () => viewBoxFor("NETWORK", sizeOf().cw, sizeOf().ch).w,
          h: () => viewBoxFor("NETWORK", sizeOf().cw, sizeOf().ch).h,
          duration: 1,
          onUpdate: () => apply(vb),
        },
        3
      );
      tl.to(q("[data-corr]"), { opacity: 1, duration: 0.5 }, 3.3);
    }, pinEl);

    return () => {
      ctx.revert();
      stRef.current = null;
    };
  }, [reduced]);

  /* Reduced motion: pinned, but no scrub and no drawing — jumps are instant. */
  useEffect(() => {
    if (!reduced) return;
    const pinEl = pinRef.current;
    const svg = svgRef.current;
    if (!pinEl || !svg) return;
    const applyStop = (stp: StopId) => {
      const vb = viewBoxFor(
        stp,
        pinEl.clientWidth || window.innerWidth,
        pinEl.clientHeight || window.innerHeight
      );
      svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
    };
    applyStop(STOPS[active]);
    const isMobile = window.innerWidth <= 1024;
    const scrollDistance = isMobile ? window.innerHeight * 1.8 : window.innerHeight * 3.5;
    const st = ScrollTrigger.create({
      trigger: pinEl,
      start: "top top",
      end: () => `+=${scrollDistance}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const i = Math.min(STOPS.length - 1, Math.round(self.progress * (STOPS.length - 1)));
        setActive(i);
        applyStop(STOPS[i]);
      },
    });
    stRef.current = st;
    return () => {
      st.kill();
      stRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  /* Reduced-motion camera follows the active stop instantly (rail / arrow keys). */
  useEffect(() => {
    if (!reduced) return;
    const pinEl = pinRef.current;
    const svg = svgRef.current;
    if (!pinEl || !svg) return;
    const vb = viewBoxFor(
      STOPS[active],
      pinEl.clientWidth || window.innerWidth,
      pinEl.clientHeight || window.innerHeight
    );
    svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  }, [reduced, active]);

  const lub = PLACES["lub"];

  const corrOpacity = (id: CorridorId): number | undefined => {
    if (!reduced) return undefined; // GSAP owns opacity in full motion
    const idx = ORDER.indexOf(id);
    if (active === STOPS.length - 1) return 1;
    if (idx < active) return 0.25;
    return idx === active ? 1 : 0;
  };

  return (
    <section id="coverage-section" className="cov2" aria-labelledby="coverage-heading">
      <header className="cov2-header">
        <p className="cov2-eyebrow">{coverageCopy.eyebrow}</p>
        <h2 className="cov2-heading" id="coverage-heading">
          {coverageCopy.heading}
        </h2>
        <p className="cov2-standfirst">Four corridors running today.</p>
      </header>

      <div className="cov2-pinned" ref={pinRef}>
        <svg
          ref={svgRef}
          className="cov2-map"
          viewBox={`0 0 ${MAP_SPACE.w} ${MAP_SPACE.h}`}
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <filter id="cov2-glow" filterUnits="userSpaceOnUse" x={0} y={0} width={FRAME_W} height={FRAME_H}>
              <feGaussianBlur stdDeviation={3 * s} />
            </filter>
            <clipPath id="cov2-frame">
              <rect x={0} y={0} width={FRAME_W} height={FRAME_H} />
            </clipPath>
            <linearGradient id="cov2-feather-l" gradientUnits="userSpaceOnUse" x1={0} y1={0} x2={300} y2={0}>
              <stop offset="0" stopColor={OCEAN} />
              <stop offset="1" stopColor={OCEAN} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="cov2-feather-r" gradientUnits="userSpaceOnUse" x1={FRAME_W} y1={0} x2={FRAME_W - 300} y2={0}>
              <stop offset="0" stopColor={OCEAN} />
              <stop offset="1" stopColor={OCEAN} stopOpacity={0} />
            </linearGradient>
          </defs>

          <image
            href={mapSrc}
            x={0}
            y={0}
            width={FRAME_W}
            height={FRAME_H}
            preserveAspectRatio="none"
          />
          {/* Feather the basemap edges into the ocean colour. */}
          <rect x={0} y={0} width={300} height={FRAME_H} fill="url(#cov2-feather-l)" />
          <rect x={FRAME_W - 300} y={0} width={300} height={FRAME_H} fill="url(#cov2-feather-r)" />

          {/* Territories + corridors, clipped to the frame. Camera moves ONLY via viewBox. */}
          <g clipPath="url(#cov2-frame)">
            <g aria-hidden="true">
              {TERRITORIES.map((t) => (
                <path
                  key={t.id}
                  d={t.d}
                  className={t.operated ? "cov2-terr cov2-terr--op" : "cov2-terr cov2-terr--ctx"}
                />
              ))}
            </g>

            {ORDER.map((id) => {
              const color = CORR_COLOR[id];
              return (
                <g
                  key={id}
                  data-corr={id}
                  className="cov2-corr"
                  style={reduced ? { opacity: corrOpacity(id) } : undefined}
                >
                  {/* soft glow under the main line */}
                  <path
                    d={CORRIDORS[id].d}
                    className="cov2-glow"
                    stroke={color}
                    strokeWidth={glowW}
                    filter="url(#cov2-glow)"
                  />
                  <path
                    data-draw={id}
                    d={CORRIDORS[id].d}
                    pathLength={1}
                    className="cov2-line"
                    stroke={color}
                    strokeWidth={lineW}
                  />
                  {/* pulse travels along the active corridor */}
                  <path
                    d={CORRIDORS[id].d}
                    pathLength={1}
                    className={`cov2-pulse${active === ORDER.indexOf(id) ? " is-active" : ""}`}
                    stroke={color}
                    strokeWidth={lineW * 1.8}
                  />
                  {CORRIDORS[id].feederD.map((d, i) => (
                    <path
                      key={i}
                      d={d}
                      className="cov2-line cov2-line--feeder"
                      stroke={color}
                      strokeWidth={feederW}
                      strokeDasharray={feederDash}
                    />
                  ))}
                  <g data-pins={id}>
                    {dotIds(id).map((pid) => {
                      const p = PLACES[pid];
                      const r =
                        (p.type === "hub"
                          ? PIN_PX.hub
                          : p.type === "port"
                            ? PIN_PX.port
                            : p.type === "border"
                              ? PIN_PX.border
                              : PIN_PX.city) * s;
                      return (
                        <g
                          key={pid}
                          transform={`translate(${p.x} ${p.y})`}
                          className="cov2-pin"
                          data-type={p.type}
                        >
                          {p.type === "port" ? (
                            <g>
                              <rect
                                x={-r}
                                y={-r}
                                width={r * 2}
                                height={r * 2}
                                transform="rotate(45)"
                                className="cov2-pin__port"
                              />
                              <g transform={`scale(${s})`}>
                                <AnchorIcon />
                              </g>
                            </g>
                          ) : (
                            <g>
                              <circle r={r} className="cov2-pin__dot" />
                              {p.type === "border" && (
                                <g transform={`scale(${s})`}>
                                  <BoomIcon />
                                </g>
                              )}
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                </g>
              );
            })}
          </g>

          {/* Overlay: settled-stop labels (touching their own pins), one HUB tag per hub, badge. */}
          <g className="cov2-always" aria-hidden="true">
            {layout.placed.map((l) => {
              const p = PLACES[l.id];
              return (
                <text
                  key={l.id}
                  x={l.x}
                  y={l.y}
                  textAnchor={l.anchor}
                  dominantBaseline="central"
                  fontSize={fs}
                  className="cov2-pin__name"
                >
                  {p.name}
                </text>
              );
            })}
            {(["jhb", "gbe"] as const).map((pid) => {
              const p = PLACES[pid];
              const tagFs = 10 * s;
              const tagH = tagFs * 1.9;
              return (
                <Pill
                  key={`hub-${pid}`}
                  x={p.x}
                  y={p.y + PIN_PX.hub * s + tagH / 2 + 0.35 * fs}
                  text="HUB"
                  fs={tagFs}
                  className="cov2-pin__hub"
                />
              );
            })}
            <g transform={`translate(${lub.x} ${lub.y})`} className="cov2-drc">
              <text
                y={-(PIN_PX.city * s + 0.35 * fs + fs / 2)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={fs}
                className="cov2-drc__area"
              >
                Lubumbashi · Kolwezi area
              </text>
              <Pill x={0} y={-(PIN_PX.city * s + 0.35 * fs + fs + 0.35 * fs + (0.78 * fs * 1.9) / 2)} text="Specialist" fs={0.78 * fs} className="cov2-drc__badge" />
            </g>
          </g>
        </svg>

        {isDesktop && (
          <nav
            className="cov2-rail"
            aria-label="Coverage stops"
            onKeyDown={onRailKeyDown}
          >
            <ol className="cov2-rail__list">
              {STOPS.map((st, i) => (
                <li key={st}>
                  <button
                    type="button"
                    className="cov2-rail__item"
                    data-stop={st}
                    aria-current={i === active ? "true" : undefined}
                    aria-label={`Go to stop ${st === "NETWORK" ? "Network" : `${st}, ${RAIL_LABEL[st]}`}`}
                    onClick={() => goTo(i)}
                  >
                    <span className="cov2-rail__letter" aria-hidden="true">
                      {st === "NETWORK" ? "N" : st}
                    </span>
                    <span className="cov2-rail__name">{RAIL_LABEL[st]}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="cov2-cards">
          {STOPS.map((st, i) => {
            if (st !== "NETWORK") return null;
            const card = CARDS[st];
            const waLink = buildWhatsAppTextLink(card.wa);
            const isNetworkActive = STOPS[active] === "NETWORK";
            return (
              <article
                key={st}
                className={`cov2-card${isNetworkActive ? " is-active" : ""}`}
                aria-hidden={!isNetworkActive}
                inert={!isNetworkActive}
                data-stop={st}
              >
                <p className="cov2-card__eyebrow">{card.eyebrow}</p>
                <h3 className="cov2-card__name cov2-card__name--network">{card.name}</h3>
                {card.departs && <p className="cov2-card__departs">{card.departs}</p>}
                {card.posts && (
                  <ul className="cov2-card__posts">
                    {card.posts.map((p) => (
                      <li key={p.post}>
                        <span className="cov2-card__post">{p.post}</span>
                        <span className="cov2-card__time">
                          {p.time} · {p.note ?? "typical, varies"}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {card.trust && <p className="cov2-card__trust">{card.trust}</p>}
                <a
                  className="cov2-card__cta"
                  href={waLink ?? "#verdict-section"}
                  {...(waLink ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className="cov2-card__cta-rule" aria-hidden="true" />
                  {card.cta}
                </a>
              </article>
            );
          })}
        </div>

        <p className="cov2-counter" aria-hidden="true">
          {String(active + 1).padStart(2, "0")} / {String(STOPS.length).padStart(2, "0")}
        </p>
        <p className="cov2-live sr-only" role="status">
          Stop {STOPS[active] === "NETWORK" ? "Network" : `${STOPS[active]}, ${RAIL_LABEL[STOPS[active]]}`} of{" "}
          {STOPS.length}
        </p>
      </div>
    </section>
  );
}
