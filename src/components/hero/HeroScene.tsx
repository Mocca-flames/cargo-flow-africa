"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { heroAssets } from "./heroAssets";
import { useHeroPointer } from "./useHeroPointer";
import { useHeroScroll } from "./useHeroScroll";
import "./HeroScene.css";

type TruckProps = {
  className: string;
  src: string;
  depth: string;
  side?: "left" | "right";
  glow?: "left" | "right" | "both";
};

type RouteNode = {
  id: string;
  label: string;
  shortLabel: string;
  fraction: number;
  side: "left" | "right";
  index: string;
};

const controlRoomConfig = {
  header: {
    label: "CORRIDOR TELEMETRY",
    routeLabel: "DURBAN PORT ➔ LUBUMBASHI / KOLWEZI",
    statement: "Every kilometre, accounted for.",
  },
  route: {
    path: "M 100 34 C 150 110, 64 160, 104 220 S 238 334, 170 400 S 230 512, 180 560",
    totalKm: 3000,
    nodes: [
      { id: "durban", label: "DURBAN PORT", shortLabel: "DURBAN", fraction: 0, side: "right", index: "01" },
      { id: "beitbridge", label: "BEITBRIDGE", shortLabel: "BEITBRIDGE", fraction: 0.3, side: "left", index: "02" },
      { id: "livingstone", label: "LIVINGSTONE", shortLabel: "LIVINGSTONE", fraction: 0.52, side: "right", index: "03" },
      { id: "kasumbalesa", label: "KASUMBALESA", shortLabel: "KASUMBALESA", fraction: 0.75, side: "left", index: "04" },
      { id: "destination", label: "LUBUMBASHI / KOLWEZI", shortLabel: "DESTINATION", fraction: 1, side: "right", index: "05" },
    ] satisfies RouteNode[],
  },
  cards: [
    {
      id: "capacity",
      className: "v2-card v2-card--capacity",
      side: "left",
      trigger: 0.08,
      title: "CAPACITY & TRANSIT SLA",
      body: "Heavy lowbed and consolidation fleet. Scheduled corridor runs.",
      tag: "CORRIDOR OVERVIEW",
    },
    {
      id: "safety",
      className: "v2-card v2-card--safety",
      side: "right",
      trigger: 0.35,
      title: "ACTIVE CARGO SAFETY",
      body: "Satellite GPS tracking plus multi-camera fleet telemetry.",
      tag: "ROUTE PREVIEW",
    },
    {
      id: "border",
      className: "v2-card v2-card--border",
      side: "left",
      trigger: 0.7,
      title: "BORDER & CLEARANCE ASSURANCE",
      body: "Kasumbalesa Border Node.",
      tag: "PEAK CHECKPOINT",
    },
  ],
} as const;

/* V2 decorative scene config (fixed, seeded: SSR-safe, no hydration drift) */

const mulberry32 = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Number of confetti particles in the destination burst (config constant, not CSS). */
const V2_CONFETTI_COUNT = 36;

/** Bokeh specks: x/y in %, size in px, blur in px, tone, opacity, drift duration/delay in s. */
const v2Bokeh = [
  { x: 6, y: 12, s: 18, b: 4, tone: "gold", o: 0.14, d: 9, l: 0 },
  { x: 14, y: 78, s: 12, b: 3, tone: "teal", o: 0.16, d: 7, l: -2 },
  { x: 22, y: 8, s: 8, b: 2, tone: "gold", o: 0.16, d: 11, l: -5 },
  { x: 31, y: 90, s: 20, b: 5, tone: "teal", o: 0.1, d: 10, l: -3 },
  { x: 38, y: 20, s: 10, b: 3, tone: "gold", o: 0.12, d: 8, l: -6 },
  { x: 41, y: 70, s: 6, b: 2, tone: "teal", o: 0.18, d: 6, l: -1 },
  { x: 47, y: 6, s: 14, b: 4, tone: "gold", o: 0.1, d: 12, l: -8 },
  { x: 55, y: 93, s: 9, b: 3, tone: "gold", o: 0.14, d: 9, l: -4 },
  { x: 60, y: 24, s: 7, b: 2, tone: "teal", o: 0.16, d: 7, l: -7 },
  { x: 66, y: 80, s: 22, b: 6, tone: "gold", o: 0.08, d: 11, l: -2 },
  { x: 72, y: 12, s: 11, b: 3, tone: "teal", o: 0.14, d: 10, l: -9 },
  { x: 81, y: 56, s: 8, b: 2, tone: "gold", o: 0.16, d: 8, l: -5 },
  { x: 88, y: 20, s: 16, b: 4, tone: "teal", o: 0.1, d: 12, l: -1 },
  { x: 93, y: 84, s: 13, b: 4, tone: "gold", o: 0.12, d: 9, l: -6 },
  { x: 96, y: 42, s: 7, b: 2, tone: "teal", o: 0.18, d: 6, l: -3 },
  { x: 3, y: 46, s: 10, b: 3, tone: "teal", o: 0.12, d: 10, l: -8 },
] as const;

type NetPoint = { x: number; y: number; hub?: boolean; teal?: boolean };

/**
 * Constellation points in a 1000x600 slice space. Kept out of the central
 * route corridor (x 390-610), the header band (y < 95) and behind-the-card
 * rectangles so text stays clean.
 */
const v2NetPoints: NetPoint[] = [
  { x: 40, y: 130 }, { x: 110, y: 110, teal: true }, { x: 190, y: 118 }, { x: 290, y: 108, hub: true },
  { x: 345, y: 170, teal: true }, { x: 330, y: 260 }, { x: 45, y: 330, teal: true }, { x: 120, y: 350 },
  { x: 60, y: 430, hub: true }, { x: 30, y: 540, teal: true }, { x: 130, y: 570 }, { x: 240, y: 580, teal: true },
  { x: 345, y: 455 }, { x: 350, y: 560 }, { x: 445, y: 585, teal: true }, { x: 370, y: 340, teal: true },
  { x: 655, y: 120 }, { x: 740, y: 108, teal: true }, { x: 830, y: 120, hub: true }, { x: 925, y: 112 },
  { x: 975, y: 195, teal: true }, { x: 660, y: 215 }, { x: 650, y: 330, teal: true }, { x: 700, y: 410 },
  { x: 790, y: 420 }, { x: 905, y: 405, teal: true }, { x: 965, y: 300 }, { x: 960, y: 500, hub: true },
  { x: 860, y: 520 }, { x: 760, y: 560, teal: true }, { x: 660, y: 575 }, { x: 690, y: 480 },
  { x: 600, y: 40, teal: true },
];

const v2NetHubFan = 5;

const v2Network = (() => {
  const seen = new Set<string>();
  const lines: Array<{ x1: number; y1: number; x2: number; y2: number; teal: boolean; o: number; fan: boolean }> = [];
  const push = (a: number, b: number, fan: boolean) => {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (seen.has(key)) return;
    seen.add(key);
    const pa = v2NetPoints[a];
    const pb = v2NetPoints[b];
    const o = 0.08 + ((a * 7 + b * 13) % 17) / 17 * 0.16;
    lines.push({
      x1: pa.x,
      y1: pa.y,
      x2: pb.x,
      y2: pb.y,
      teal: Boolean(pa.teal && pb.teal) || ((a + b) % 4 === 0),
      o: fan ? Math.min(o + 0.04, 0.24) : o,
      fan,
    });
  };
  const byDistance = (i: number) =>
    v2NetPoints
      .map((p, j) => ({ j, d: Math.hypot(p.x - v2NetPoints[i].x, p.y - v2NetPoints[i].y) }))
      .filter((e) => e.j !== i)
      .sort((p, q) => p.d - q.d);

  v2NetPoints.forEach((_, i) => {
    byDistance(i)
      .slice(0, 2)
      .forEach((e) => push(i, e.j, false));
  });
  v2NetPoints.forEach((p, i) => {
    if (!p.hub) return;
    byDistance(i)
      .slice(2, 2 + v2NetHubFan)
      .forEach((e) => push(i, e.j, true));
  });
  return lines;
})();

/** Indices (into v2Network) of the few lines that carry a slow data pulse. */
const v2PulseLines = (() => {
  const picks: number[] = [];
  v2Network.forEach((l, i) => {
    if (picks.length < 4 && l.fan && i % 3 === 0) picks.push(i);
  });
  v2Network.forEach((l, i) => {
    if (picks.length < 4 && !picks.includes(i) && !l.fan && i % 11 === 0) picks.push(i);
  });
  return picks.slice(0, 4);
})();

const v2Confetti = (() => {
  const rand = mulberry32(0xcf10a);
  return Array.from({ length: V2_CONFETTI_COUNT }, (_, i) => {
    const roll = rand();
    const color = roll < 0.55 ? (rand() < 0.5 ? "#c9a24b" : "#f0d58a") : roll < 0.8 ? "#ede6d6" : "#5ac8d2";
    const round = rand() < 0.4;
    return {
      id: i,
      color,
      round,
      dx: Math.round((rand() * 2 - 1) * 160),
      dy: -Math.round(120 + rand() * 140),
      rot: Math.round(180 + rand() * 540) * (rand() < 0.5 ? -1 : 1),
      delay: Math.round(rand() * 250),
      dur: Number((1.6 + rand() * 0.8).toFixed(2)),
    };
  });
})();

/** Spacing (in route-path user units) between ruler ticks on the unprogressed path. */
const V2_TICK_SPACING = 24;
const V2_SVG_NS = "http://www.w3.org/2000/svg";

const depthStyle = (depth: string) => ({ ["--depth" as string]: depth });

function Truck({ className, src, depth, side, glow = "both" }: TruckProps) {
  const showLeft = glow === "left" || glow === "both";
  const showRight = glow === "right" || glow === "both";

  return (
    <div
      className={`truck-wrap ${className}`}
      data-depth={depth}
      data-side={side}
      style={depthStyle(depth)}
    >
      <div className="intro intro--reveal intro--truck">
        <div className="dolly">
          <div className="truck-shadow truck-shadow--soft" aria-hidden="true" />
          <div className="truck-shadow truck-shadow--core" aria-hidden="true" />
          <div className="live">
            <div className="truck-bob">
              <img className="truck-img" src={src} alt="" draggable={false} aria-hidden />
              <img
                className="truck-reflection"
                src={src}
                alt=""
                draggable={false}
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
      {showLeft || showRight ? (
        <div className="intro intro--reveal intro--glow">
          <div className="dolly">
            <div className="live">
              {showLeft ? (
                <img
                  className="truck-glow truck-glow--left"
                  src={heroAssets.fxGlow}
                  alt=""
                  draggable={false}
                  aria-hidden
                />
              ) : null}
              {showRight ? (
                <img
                  className="truck-glow truck-glow--right"
                  src={heroAssets.fxGlow}
                  alt=""
                  draggable={false}
                  aria-hidden
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function HeroScene() {
  const stageRef = useRef<HTMLElement | null>(null);
  const markerRef = useRef<HTMLDivElement | null>(null);
  const v2RootRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const routeNodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const routeCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const routeReadoutRef = useRef<HTMLDivElement | null>(null);

  const routeNodes = useMemo(() => controlRoomConfig.route.nodes, []);

  useHeroScroll(stageRef);
  useHeroPointer(stageRef);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let settled = false;
    const markReady = () => {
      if (!settled) {
        settled = true;
        stage.classList.add("is-ready");
      }
    };

    const fallback = window.setTimeout(markReady, 1500);

    const truckSrcs = [
      heroAssets.truckMan,
      heroAssets.truckScania,
      heroAssets.truckFaw,
    ];
    const decoded = truckSrcs.map((src) => {
      const img = new Image();
      img.src = src;
      return img.decode();
    });

    Promise.allSettled(decoded).then(() => {
      window.clearTimeout(fallback);
      markReady();
    });

    return () => {
      settled = true;
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const svg = stage?.querySelector(".v2-route-svg");
    const routePath = svg?.querySelector(".v2-route-progress") as SVGPathElement | null;
    const ticksGroup = svg?.querySelector(".v2-route-ticks") as SVGGElement | null;
    const marker = markerRef.current;
    const v2Root = v2RootRef.current;

    if (!stage || !svg || !routePath || !marker || !v2Root) {
      return;
    }

    const routeLength = routePath.getTotalLength();
    let rafId = 0;

    /* Ruler ticks: built once, perpendicular to the path tangent. */
    const ticks: SVGLineElement[] = [];
    const tickFractions: number[] = [];
    if (ticksGroup) {
      ticksGroup.textContent = "";
      const count = Math.floor(routeLength / V2_TICK_SPACING);
      for (let i = 1; i <= count; i += 1) {
        const len = i * V2_TICK_SPACING;
        const p = routePath.getPointAtLength(len);
        const a = routePath.getPointAtLength(Math.max(len - 1, 0));
        const b = routePath.getPointAtLength(Math.min(len + 1, routeLength));
        const tx = b.x - a.x;
        const ty = b.y - a.y;
        const mag = Math.hypot(tx, ty) || 1;
        const nx = -ty / mag;
        const ny = tx / mag;
        const half = i % 5 === 0 ? 4 : 2.5;
        const tick = document.createElementNS(V2_SVG_NS, "line");
        tick.setAttribute("x1", (p.x - nx * half).toFixed(2));
        tick.setAttribute("y1", (p.y - ny * half).toFixed(2));
        tick.setAttribute("x2", (p.x + nx * half).toFixed(2));
        tick.setAttribute("y2", (p.y + ny * half).toFixed(2));
        tick.setAttribute("class", "v2-route-tick");
        ticksGroup.appendChild(tick);
        ticks.push(tick);
        tickFractions.push(len / routeLength);
      }
    }

    let lastTickIndex = -2;
    let arrived = false;

    const syncRoute = () => {
      const rawR = Number.parseFloat(stage.style.getPropertyValue("--r") || "0");
      const r = Number.isFinite(rawR) ? rawR : 0;
      const point = routePath.getPointAtLength(routeLength * r);
      const left = (point.x / 360) * 100;
      const top = (point.y / 560) * 100;
      marker.style.left = `${left}%`;
      marker.style.top = `${top}%`;

      /* Trail dots sit slightly behind the marker along the path. */
      trailRefs.current.forEach((dot, index) => {
        if (!dot) return;
        const back = Math.max(r - (index + 1) * 0.012, 0);
        const tp = routePath.getPointAtLength(routeLength * back);
        dot.style.left = `${(tp.x / 360) * 100}%`;
        dot.style.top = `${(tp.y / 560) * 100}%`;
      });

      /* Ticks behind the marker fade out; toggled only when the index moves. */
      if (ticks.length) {
        let idx = -1;
        for (let i = 0; i < tickFractions.length; i += 1) {
          if (tickFractions[i] <= r) idx = i;
          else break;
        }
        if (idx !== lastTickIndex) {
          const from = Math.max(Math.min(idx, lastTickIndex), 0);
          const to = Math.max(idx, lastTickIndex);
          for (let i = from; i <= Math.min(to, ticks.length - 1); i += 1) {
            ticks[i].classList.toggle("is-behind", i <= idx);
          }
          if (lastTickIndex === -2) {
            ticks.forEach((t, i) => t.classList.toggle("is-behind", i <= idx));
          }
          lastTickIndex = idx;
        }
      }

      /* Destination arrival: replayable (hysteresis 0.995 / 0.97). */
      if (!arrived && r >= 0.995) {
        arrived = true;
        v2Root.classList.add("arrived");
      } else if (arrived && r < 0.97) {
        arrived = false;
        v2Root.classList.remove("arrived");
      }
      v2Root.classList.toggle("is-travelling", r > 0.05);
      const rawP2 = Number.parseFloat(stage.style.getPropertyValue("--p2") || "0");
      const p2 = Number.isFinite(rawP2) ? rawP2 : 0;
      v2Root.classList.toggle("is-hold", p2 >= 0.7 && p2 <= 0.88);

      routeNodeRefs.current.forEach((node, index) => {
        const current = routeNodes[index];
        if (!node || !current) return;
        const currentPoint = routePath.getPointAtLength(routeLength * current.fraction);
        node.style.left = `${(currentPoint.x / 360) * 100}%`;
        node.style.top = `${(currentPoint.y / 560) * 100}%`;
        node.classList.toggle("is-active", r >= current.fraction);
      });

      routeCardRefs.current.forEach((card, index) => {
        const currentCard = controlRoomConfig.cards[index];
        if (!card || !currentCard) return;
        const visible = r >= currentCard.trigger;
        card.classList.toggle("is-visible", visible);
        card.classList.toggle("is-past", r >= currentCard.trigger && visible);
      });

      if (routeReadoutRef.current) {
        const km = Math.round(r * controlRoomConfig.route.totalKm);
        routeReadoutRef.current.textContent = `ROUTE  ${km} / ${controlRoomConfig.route.totalKm} KM`;
      }
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        syncRoute();
      });
    };

    syncRoute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [routeNodes]);

  return (
    <section className="hero-track">
      <section id="hero" className="hero-stage" ref={stageRef}>
        <div className="v2" ref={v2RootRef}>
          <div className="v2-bokeh" aria-hidden="true">
            {v2Bokeh.map((b, i) => (
              <span
                key={i}
                className={`v2-bokeh-dot v2-bokeh-dot--${b.tone}`}
                style={
                  {
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                    width: b.s,
                    height: b.s,
                    marginLeft: -b.s / 2,
                    marginTop: -b.s / 2,
                    filter: `blur(${b.b}px)`,
                    ["--o" as string]: b.o,
                    ["--d" as string]: `${b.d}s`,
                    ["--l" as string]: `${b.l}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>

          <div className="v2-network" aria-hidden="true">
            <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" focusable="false">
              <defs>
                <radialGradient id="v2-hub-halo">
                  <stop offset="0%" stopColor="#e8a24a" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#e8a24a" stopOpacity="0" />
                </radialGradient>
              </defs>
              <g className="v2-network-lines">
                {v2Network.map((l, i) => (
                  <line
                    key={i}
                    x1={l.x1}
                    y1={l.y1}
                    x2={l.x2}
                    y2={l.y2}
                    stroke={l.teal ? "rgb(90,200,210)" : "rgb(201,162,75)"}
                    strokeOpacity={l.o}
                    strokeWidth={l.fan ? 0.8 : 0.65}
                  />
                ))}
              </g>
              <g className="v2-network-pulses">
                {v2PulseLines.map((idx, n) => {
                  const l = v2Network[idx];
                  return (
                    <line
                      key={idx}
                      className="v2-network-pulse"
                      x1={l.x1}
                      y1={l.y1}
                      x2={l.x2}
                      y2={l.y2}
                      pathLength={1}
                      style={{ ["--pd" as string]: `${-n * 4.2}s`, ["--pt" as string]: `${13 + n * 1.7}s` } as CSSProperties}
                    />
                  );
                })}
              </g>
              <g className="v2-network-points">
                {v2NetPoints.map((p, i) =>
                  p.hub ? (
                    <g key={i}>
                      <circle cx={p.x} cy={p.y} r={14} fill="url(#v2-hub-halo)" />
                      <circle cx={p.x} cy={p.y} r={3} fill="#e8a24a" fillOpacity={0.85} />
                    </g>
                  ) : (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={1.4}
                      fill={p.teal ? "rgb(90,200,210)" : "rgb(201,162,75)"}
                      fillOpacity={0.55}
                    />
                  ),
                )}
              </g>
            </svg>
          </div>

          <div className="v2-scanline" aria-hidden="true" />

          <div className="v2-control" aria-live="polite">
            <div className="v2-header">
              <span className="v2-header-label">{controlRoomConfig.header.label}</span>
              <span className="v2-header-statement">{controlRoomConfig.header.statement}</span>
              <span className="v2-header-route">{controlRoomConfig.header.routeLabel}</span>
            </div>

            <div className="v2-map-panel">
              <svg className="v2-route-svg" viewBox="0 0 360 560" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                <defs>
                  <linearGradient
                    id="v2-route-gradient"
                    gradientUnits="userSpaceOnUse"
                    x1="0"
                    y1="34"
                    x2="0"
                    y2="560"
                  >
                    <stop offset="0%" stopColor="#c9a24b" />
                    <stop offset="100%" stopColor="#f0d58a" />
                  </linearGradient>
                </defs>
                <path className="v2-route-base" d={controlRoomConfig.route.path} />
                <g className="v2-route-ticks" />
                <path
                  className="v2-route-telemetry"
                  d={controlRoomConfig.route.path}
                  pathLength={1}
                  transform="translate(14 0)"
                />
                <path className="v2-route-glow" d={controlRoomConfig.route.path} pathLength={1} />
                <path className="v2-route-progress" d={controlRoomConfig.route.path} pathLength={1} />
                <path className="v2-route-hot" d={controlRoomConfig.route.path} pathLength={1} />
                <path className="v2-route-energy" d={controlRoomConfig.route.path} pathLength={1} />
              </svg>

              <div className="v2-route-nodes" aria-hidden="true">
                {routeNodes.map((node, index) => (
                  <div
                    key={node.id}
                    ref={(element) => {
                      routeNodeRefs.current[index] = element;
                    }}
                    className="v2-node"
                    data-side={node.side}
                    data-index={index}
                  >
                    <span className="v2-node-halo" aria-hidden="true" />
                    {node.id === "kasumbalesa" ? (
                      <span className="v2-reticle" aria-hidden="true">
                        <svg viewBox="-17 -17 34 34" focusable="false">
                          <circle className="v2-reticle-circle" r="15" />
                          <path className="v2-reticle-ticks" d="M0 -17 V-11 M17 0 H11 M0 17 V11 M-17 0 H-11" />
                          <circle className="v2-reticle-arc" r="12" />
                        </svg>
                      </span>
                    ) : null}
                    {node.id === "destination" ? (
                      <>
                        <span className="v2-shock v2-shock--a" aria-hidden="true" />
                        <span className="v2-shock v2-shock--b" aria-hidden="true" />
                        <span className="v2-confetti" aria-hidden="true">
                          {v2Confetti.map((c) => (
                            <i
                              key={c.id}
                              className={c.round ? "v2-conf v2-conf--round" : "v2-conf"}
                              style={
                                {
                                  background: c.color,
                                  ["--dx" as string]: `${c.dx}px`,
                                  ["--dy" as string]: `${c.dy}px`,
                                  ["--rot" as string]: `${c.rot}deg`,
                                  ["--delay" as string]: `${c.delay}ms`,
                                  ["--dur" as string]: `${c.dur}s`,
                                } as CSSProperties
                              }
                            />
                          ))}
                        </span>
                      </>
                    ) : null}
                    <span className="v2-node-ring" aria-hidden="true" />
                    <span className="v2-node-meta">
                      <span className="v2-node-index">{node.index}</span>
                      <span className="v2-node-label">{node.label}</span>
                      {node.id === "destination" ? <span className="v2-node-tag">DESTINATION REACHED</span> : null}
                    </span>
                  </div>
                ))}
              </div>

              <div className="v2-route-trail" aria-hidden="true">
                {[0, 1, 2].map((n) => (
                  <span
                    key={n}
                    ref={(element) => {
                      trailRefs.current[n] = element;
                    }}
                    className={`v2-trail-dot v2-trail-dot--${n}`}
                  />
                ))}
              </div>
              <div ref={markerRef} className="v2-route-marker" aria-hidden="true">
                <span className="v2-marker-ring" />
              </div>
            </div>

            <div className="v2-telemetry" aria-hidden="true">
              {controlRoomConfig.cards.map((card, index) => (
                <div
                  key={card.id}
                  ref={(element) => {
                    routeCardRefs.current[index] = element;
                  }}
                  className={card.className}
                  data-side={card.side}
                  data-trigger={String(card.trigger)}
                >
                  <span className="v2-card-tag">{card.tag}</span>
                  <h2>{card.title}</h2>
                  <p>{card.body}</p>
                  {card.id === "safety" ? (
                    <div className="v2-card-readout">
                      <div ref={routeReadoutRef} className="v2-card-line">ROUTE  0 / 3000 KM</div>
                      <div className="v2-card-line">STATUS  MONITORED</div>
                    </div>
                  ) : null}
                  {card.id === "border" ? (
                    <div className="v2-card-checks">
                      <span><i aria-hidden="true">✓</i> Pre-cleared</span>
                      <span><i aria-hidden="true">✓</i> Dedicated clearing agents on site</span>
                      <span><i aria-hidden="true">✓</i> Zero-wait handover</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="v2-shadow" aria-hidden="true" />
        </div>

        <div className="v1-slab">
          <div className="hero-scene dolly dolly--scene">
            <div className="hero-layer hero-sky" data-depth="0.05" style={depthStyle("0.05")}>
              <div className="intro intro--reveal intro--sky">
                <div className="dolly dolly--sky">
                  <div className="live">
                    <img src={heroAssets.bgSky} alt="" draggable={false} aria-hidden />
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-layer hero-road" data-depth="0.12" style={depthStyle("0.12")}>
              <div className="intro intro--reveal intro--road">
                <div className="dolly dolly--road">
                  <div className="live">
                    <img src={heroAssets.road} alt="" draggable={false} aria-hidden />
                  </div>
                </div>
              </div>
            </div>

            <div
              className="hero-copy"
              data-depth="0"
              style={depthStyle("0")}
            >
              <div className="intro intro--reveal intro--headline">
                <div className="dolly dolly--headline">
                  <div className="live">
                    <h1 className="hero-headline">
                      <span className="hero-word">Cross-Border</span>{" "}
                      <span className="hero-word">Heavy</span>{" "}
                      <span className="hero-word">Haulage</span>{" "}
                      <span className="hero-word">&amp;</span>{" "}
                      <span className="hero-word">Corridor</span>{" "}
                      <span className="hero-word">Freight</span>
                    </h1>
                    <p className="hero-sub">Secured from Origin to Destination.</p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="hero-card hero-card--left"
              data-depth="0"
              style={depthStyle("0")}
            >
              <div className="intro intro--reveal intro--card-left">
                <div className="dolly dolly--headline">
                  <div className="live">
                    <div className="hero-card-inner">
                      <span className="hero-card-label">CORRIDOR</span>
                      <span className="hero-card-value">
                        South Africa &#10132; DRC (Lubumbashi / Kolwezi)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="hero-card hero-card--right"
              data-depth="0"
              style={depthStyle("0")}
            >
              <div className="intro intro--reveal intro--card-right">
                <div className="dolly dolly--headline">
                  <div className="live">
                    <div className="hero-card-inner">
                      <span className="hero-card-label">
                        <span className="hero-card-dot" aria-hidden="true" />
                        STATUS
                      </span>
                      <span className="hero-card-value">Direct Fleet Dispatch</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-layer hero-dust" data-depth="0.3" style={depthStyle("0.3")}>
              <div className="intro">
                <div className="dolly dolly--dust">
                  <div className="live">
                    <img src={heroAssets.fxDust} alt="" draggable={false} aria-hidden />
                  </div>
                </div>
              </div>
            </div>

            <Truck
              className="truck-wrap--scania"
              src={heroAssets.truckFaw}
              depth="0.5"
              side="left"
              glow="left"
            />
            <Truck
              className="truck-wrap--faw"
              src={heroAssets.truckScania}
              depth="0.5"
              side="right"
              glow="right"
            />
            <Truck
              className="truck-wrap--man"
              src={heroAssets.truckMan}
              depth="0.7"
              glow="both"
            />

            <div className="hero-layer hero-streaks" data-depth="0.9" style={depthStyle("0.9")}>
              <div className="intro">
                <div className="dolly dolly--streaks">
                  <div className="live">
                    <img src={heroAssets.fxStreaks} alt="" draggable={false} aria-hidden />
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-layer hero-grass hero-grass--left" data-depth="1.4" style={depthStyle("1.4")}>
              <div className="intro">
                <div className="dolly dolly--grass">
                  <div className="live">
                    <img src={heroAssets.fgGrass} alt="" draggable={false} aria-hidden />
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-layer hero-grass hero-grass--right" data-depth="1.4" style={depthStyle("1.4")}>
              <div className="intro">
                <div className="dolly dolly--grass">
                  <div className="live">
                    <img src={heroAssets.fgGrass} alt="" draggable={false} aria-hidden />
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-tint" aria-hidden="true" />
          </div>

          <div className="gate-edge" aria-hidden="true" />
        </div>
      </section>
    </section>
  );
}
