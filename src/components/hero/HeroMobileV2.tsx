"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./HeroMobileV2.css";
import { HERO_PROGRESS_EVENT } from "./useHeroScrollMobile";

type RouteNode = {
  id: string;
  label: string;
  fraction: number;
  side: "left" | "right";
  index: string;
};

const controlRoom = {
  header: {
    label: "CORRIDOR TELEMETRY",
    routeLabel: "DURBAN PORT ➔ LUBUMBASHI / KOLWEZI",
    statement: "Every kilometre, accounted for.",
  },
  route: {
    path: "M 100 34 C 150 110, 64 160, 104 220 S 238 334, 170 400 S 230 512, 180 560",
    totalKm: 3000,
    nodes: [
      { id: "durban", label: "DURBAN PORT", fraction: 0, side: "right", index: "01" },
      { id: "beitbridge", label: "BEITBRIDGE", fraction: 0.3, side: "left", index: "02" },
      { id: "livingstone", label: "LIVINGSTONE", fraction: 0.52, side: "right", index: "03" },
      { id: "kasumbalesa", label: "KASUMBALESA", fraction: 0.75, side: "left", index: "04" },
      { id: "destination", label: "LUBUMBASHI", fraction: 1, side: "right", index: "05" },
    ] satisfies RouteNode[],
  },
  cards: [
    {
      id: "capacity",
      trigger: 0.08,
      title: "CAPACITY & TRANSIT SLA",
      body: "Heavy lowbed and consolidation fleet. Scheduled corridor runs.",
      tag: "CORRIDOR OVERVIEW",
    },
    {
      id: "safety",
      trigger: 0.35,
      title: "ACTIVE CARGO SAFETY",
      body: "Satellite GPS tracking plus multi-camera fleet telemetry.",
      tag: "ROUTE PREVIEW",
    },
    {
      id: "border",
      trigger: 0.7,
      title: "BORDER & CLEARANCE ASSURANCE",
      body: "Kasumbalesa Border Node.",
      tag: "PEAK CHECKPOINT",
    },
  ],
} as const;

const V2_TICK_SPACING = 24;
const V2_SVG_NS = "http://www.w3.org/2000/svg";
const V2_CONFETTI_COUNT = 24;

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

/* x/y in %, size in px, blur in px; static so the layer stays cheap on phones. */
const v2Bokeh = [
  { x: 8, y: 10, s: 14, b: 3, tone: "gold", o: 0.14 },
  { x: 90, y: 14, s: 10, b: 3, tone: "teal", o: 0.16 },
  { x: 5, y: 44, s: 8, b: 2, tone: "teal", o: 0.16 },
  { x: 94, y: 48, s: 16, b: 4, tone: "gold", o: 0.1 },
  { x: 12, y: 74, s: 18, b: 4, tone: "teal", o: 0.1 },
  { x: 86, y: 80, s: 9, b: 2, tone: "gold", o: 0.16 },
  { x: 50, y: 6, s: 7, b: 2, tone: "gold", o: 0.14 },
  { x: 70, y: 92, s: 12, b: 3, tone: "teal", o: 0.12 },
] as const;

const v2Confetti = (() => {
  const rand = mulberry32(0xcf10a);
  return Array.from({ length: V2_CONFETTI_COUNT }, (_, i) => {
    const roll = rand();
    const color = roll < 0.55 ? (rand() < 0.5 ? "#c9a24b" : "#f0d58a") : roll < 0.8 ? "#ede6d6" : "#5ac8d2";
    return {
      id: i,
      color,
      round: rand() < 0.4,
      dx: Math.round((rand() * 2 - 1) * 110),
      dy: -Math.round(80 + rand() * 100),
      rot: Math.round(180 + rand() * 540) * (rand() < 0.5 ? -1 : 1),
      delay: Math.round(rand() * 250),
      dur: Number((1.6 + rand() * 0.8).toFixed(2)),
    };
  });
})();

const readVar = (el: HTMLElement, name: string): number => {
  const parsed = Number.parseFloat(el.style.getPropertyValue(name) || "0");
  return Number.isFinite(parsed) ? parsed : 0;
};

export default function HeroMobileV2() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const markerRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const readoutRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = root?.closest<HTMLElement>(".hm-stage");
    const svg = svgRef.current;
    const routePath = svg?.querySelector<SVGPathElement>(".hm-v2-route-progress");
    const ticksGroup = svg?.querySelector<SVGGElement>(".hm-v2-route-ticks");
    const marker = markerRef.current;

    if (!root || !stage || !routePath || !marker) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const routeLength = routePath.getTotalLength();
    const { nodes, totalKm } = controlRoom.route;

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
        const mag = Math.hypot(b.x - a.x, b.y - a.y) || 1;
        const nx = -(b.y - a.y) / mag;
        const ny = (b.x - a.x) / mag;
        const half = i % 5 === 0 ? 4 : 2.5;
        const tick = document.createElementNS(V2_SVG_NS, "line");
        tick.setAttribute("x1", (p.x - nx * half).toFixed(2));
        tick.setAttribute("y1", (p.y - ny * half).toFixed(2));
        tick.setAttribute("x2", (p.x + nx * half).toFixed(2));
        tick.setAttribute("y2", (p.y + ny * half).toFixed(2));
        tick.setAttribute("class", "hm-v2-route-tick");
        ticksGroup.appendChild(tick);
        ticks.push(tick);
        tickFractions.push(len / routeLength);
      }
    }

    let lastTickIndex = -2;
    let arrived = false;

    const place = (el: HTMLElement, fraction: number) => {
      const pt = routePath.getPointAtLength(routeLength * fraction);
      el.style.left = `${(pt.x / 360) * 100}%`;
      el.style.top = `${(pt.y / 560) * 100}%`;
    };

    const syncRoute = () => {
      const r = reduced ? 1 : readVar(stage, "--r");
      const pr = reduced ? 1 : readVar(stage, "--pr");

      place(marker, r);
      trailRefs.current.forEach((dot, index) => {
        if (dot) place(dot, Math.max(r - (index + 1) * 0.012, 0));
      });

      if (ticks.length) {
        let idx = -1;
        for (let i = 0; i < tickFractions.length; i += 1) {
          if (tickFractions[i] <= r) idx = i;
          else break;
        }
        if (idx !== lastTickIndex) {
          if (lastTickIndex === -2) {
            ticks.forEach((t, i) => t.classList.toggle("is-behind", i <= idx));
          } else {
            const from = Math.max(Math.min(idx, lastTickIndex), 0);
            const to = Math.min(Math.max(idx, lastTickIndex), ticks.length - 1);
            for (let i = from; i <= to; i += 1) {
              ticks[i].classList.toggle("is-behind", i <= idx);
            }
          }
          lastTickIndex = idx;
        }
      }

      if (!arrived && r >= 0.995) {
        arrived = true;
        root.classList.add("arrived");
      } else if (arrived && r < 0.97) {
        arrived = false;
        root.classList.remove("arrived");
      }
      root.classList.toggle("is-travelling", r > 0.05);
      root.classList.toggle("is-hold", pr >= 0.7 && pr <= 0.88);

      nodeRefs.current.forEach((node, index) => {
        const current = nodes[index];
        if (!node || !current) return;
        place(node, current.fraction);
        node.classList.toggle("is-active", r >= current.fraction);
      });

      /* One card at a time: the latest checkpoint passed. */
      let currentCard = -1;
      controlRoom.cards.forEach((card, index) => {
        if (r >= card.trigger) currentCard = index;
      });
      cardRefs.current.forEach((card, index) => {
        card?.classList.toggle("is-visible", index === currentCard);
      });

      if (readoutRef.current) {
        readoutRef.current.textContent = `ROUTE  ${Math.round(r * totalKm)} / ${totalKm} KM`;
      }
    };

    syncRoute();
    stage.addEventListener(HERO_PROGRESS_EVENT, syncRoute);

    return () => {
      stage.removeEventListener(HERO_PROGRESS_EVENT, syncRoute);
    };
  }, []);

  return (
    <div className="hm-v2" ref={rootRef}>
      <div className="hm-v2-bokeh" aria-hidden="true">
        {v2Bokeh.map((b, i) => (
          <span
            key={i}
            className={`hm-v2-bokeh-dot hm-v2-bokeh-dot--${b.tone}`}
            style={
              {
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: b.s,
                height: b.s,
                marginLeft: -b.s / 2,
                marginTop: -b.s / 2,
                filter: `blur(${b.b}px)`,
                opacity: b.o,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="hm-v2-control" aria-live="polite">
        <div className="hm-v2-header">
          <span className="hm-v2-header-label">{controlRoom.header.label}</span>
          <span className="hm-v2-header-statement">{controlRoom.header.statement}</span>
          <span className="hm-v2-header-route">{controlRoom.header.routeLabel}</span>
        </div>

        <div className="hm-v2-map">
          <div className="hm-v2-panel">
            <svg
              ref={svgRef}
              className="hm-v2-route-svg"
              viewBox="0 0 360 560"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="hm-v2-route-gradient"
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
              <path className="hm-v2-route-base" d={controlRoom.route.path} />
              <g className="hm-v2-route-ticks" />
              <path
                className="hm-v2-route-telemetry"
                d={controlRoom.route.path}
                pathLength={1}
                transform="translate(14 0)"
              />
              <path className="hm-v2-route-glow" d={controlRoom.route.path} pathLength={1} />
              <path className="hm-v2-route-progress" d={controlRoom.route.path} pathLength={1} />
              <path className="hm-v2-route-hot" d={controlRoom.route.path} pathLength={1} />
              <path className="hm-v2-route-energy" d={controlRoom.route.path} pathLength={1} />
            </svg>

            <div className="hm-v2-nodes" aria-hidden="true">
              {controlRoom.route.nodes.map((node, index) => (
                <div
                  key={node.id}
                  ref={(element) => {
                    nodeRefs.current[index] = element;
                  }}
                  className="hm-v2-node"
                  data-side={node.side}
                >
                  <span className="hm-v2-node-halo" />
                  {node.id === "kasumbalesa" ? (
                    <span className="hm-v2-reticle">
                      <svg viewBox="-17 -17 34 34" focusable="false">
                        <circle className="hm-v2-reticle-circle" r="15" />
                        <path className="hm-v2-reticle-ticks" d="M0 -17 V-11 M17 0 H11 M0 17 V11 M-17 0 H-11" />
                        <circle className="hm-v2-reticle-arc" r="12" />
                      </svg>
                    </span>
                  ) : null}
                  {node.id === "destination" ? (
                    <>
                      <span className="hm-v2-shock hm-v2-shock--a" />
                      <span className="hm-v2-shock hm-v2-shock--b" />
                      <span className="hm-v2-confetti">
                        {v2Confetti.map((c) => (
                          <i
                            key={c.id}
                            className={c.round ? "hm-v2-conf hm-v2-conf--round" : "hm-v2-conf"}
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
                  <span className="hm-v2-node-ring" />
                  <span className="hm-v2-node-meta">
                    <span className="hm-v2-node-index">{node.index}</span>
                    <span className="hm-v2-node-label">{node.label}</span>
                    {node.id === "destination" ? (
                      <span className="hm-v2-node-tag">DESTINATION REACHED</span>
                    ) : null}
                  </span>
                </div>
              ))}
            </div>

            <div className="hm-v2-trail" aria-hidden="true">
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  ref={(element) => {
                    trailRefs.current[n] = element;
                  }}
                  className={`hm-v2-trail-dot hm-v2-trail-dot--${n}`}
                />
              ))}
            </div>
            <div ref={markerRef} className="hm-v2-marker" aria-hidden="true">
              <span className="hm-v2-marker-ring" />
            </div>
          </div>
        </div>

        <div className="hm-v2-cards" aria-hidden="true">
          {controlRoom.cards.map((card, index) => (
            <div
              key={card.id}
              ref={(element) => {
                cardRefs.current[index] = element;
              }}
              className="hm-v2-card"
            >
              <span className="hm-v2-card-tag">{card.tag}</span>
              <h2>{card.title}</h2>
              <p>{card.body}</p>
              {card.id === "safety" ? (
                <div className="hm-v2-card-extra">
                  <div ref={readoutRef}>ROUTE  0 / 3000 KM</div>
                  <div>STATUS  MONITORED</div>
                </div>
              ) : null}
              {card.id === "border" ? (
                <div className="hm-v2-card-extra">
                  <span><i aria-hidden="true">✓</i> Pre-cleared</span>
                  <span><i aria-hidden="true">✓</i> Dedicated clearing agents on site</span>
                  <span><i aria-hidden="true">✓</i> Zero-wait handover</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
