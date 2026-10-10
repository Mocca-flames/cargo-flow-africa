"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import css from "./corridor-run.module.css";
import {
  BEATS, DELAY_KEYS, GATES, GATE_OFF, MOBILE_MAX, NIGHT_KEYS, PIN_SCREENS, ROUTE_D, ROUTE_KEYS,
  STRIKE, TINT_KEYS, TOTAL_KM, ZOOM_KEYS, type Beat,
} from "./config";
import { buildRouteTable, computeRig, headingAt, keyed, pointAt, deg, rad } from "./rig";
import { TractorArt } from "./TractorPlaceholder";
import { TrailerArt } from "./TrailerPlaceholder";

gsap.registerPlugin(ScrollTrigger);

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const on = () => setReduced(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return reduced;
}

function BeatCopy({ b }: { b: Beat }) {
  return (
    <>
      <p className={css.kicker}>{b.kicker}</p>
      <h3 className={css.title}>{b.title}</h3>
      <dl className={css.triad}>
        <div><dt>What happened</dt><dd>{b.happened}</dd></div>
        <div><dt>What we did</dt><dd>{b.did}</dd></div>
        <div><dt>What you saw</dt><dd>{b.saw}</dd></div>
      </dl>
    </>
  );
}

function QueueTrucks() {
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={-2000 - i * 2300} y={-125} width={2000} height={250} rx={24} className={css.queueTruck} />
      ))}
    </>
  );
}

export default function CorridorRun() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const worldRef = useRef<SVGGElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const horseRef = useRef<SVGGElement>(null);
  const trailerRef = useRef<SVGGElement>(null);
  const nightLightsRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current, svg = svgRef.current, world = worldRef.current;
    const route = routeRef.current, horse = horseRef.current, trailer = trailerRef.current;
    if (!root || !svg || !world || !route || !horse || !trailer) return;

    const table = buildRouteTable(route);
    const size = { w: 1, h: 1 };
    const state = { p: 0 };
    const cache = new Map<Element, string>();
    const setText = (el: Element | null, v: string) => {
      if (el && cache.get(el) !== v) { cache.set(el, v); el.textContent = v; }
    };
    const setData = (el: Element | null, k: string, v: string) => {
      if (el && (el as HTMLElement | SVGElement as HTMLElement).dataset[k] !== v) (el as HTMLElement).dataset[k] = v;
    };

    // Place every [data-at] object on the route (position + heading), keep [data-upright] children level.
    root.querySelectorAll<SVGGElement>("[data-at]").forEach((el) => {
      const s = parseFloat(el.dataset.at!) * table.length + parseFloat(el.dataset.off ?? "0");
      const pt = pointAt(table, s);
      const a = deg(headingAt(table, s));
      el.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${a}) translate(0 ${el.dataset.dy ?? 0})`);
      el.querySelectorAll("[data-upright]").forEach((t) => t.setAttribute("transform", `rotate(${-a})`));
    });

    const steerEls = Array.from(root.querySelectorAll<SVGGElement>("#cft-wheel-fl, #cft-wheel-fr"));
    const treads = Array.from(root.querySelectorAll<SVGElement>(".tread"));
    const gateEls = GATES.map((g) => root.querySelector(`[data-gate="${g.id}"]`));
    const strikeEl = root.querySelector("[data-strike]");
    const nightLights = nightLightsRef.current;
    const nightTintEl = root.querySelector<HTMLElement>("[data-night-tint]");
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-beat]"));
    const hud = (k: string) => root.querySelector<HTMLElement>(`[data-hud="${k}"]`);
    const [hLast, hNext, hKm, hDelay, hBar, hTint] = ["last", "next", "km", "delay", "bar", "tint"].map(hud);

    const render = (p: number) => {
      const mobile = size.w <= MOBILE_MAX;
      const rig = computeRig(table, keyed(ROUTE_KEYS, p));

      horse.setAttribute("transform", `translate(${rig.pivot.x} ${rig.pivot.y}) rotate(${rig.tractor})`);
      trailer.setAttribute("transform", `translate(${rig.pivot.x} ${rig.pivot.y}) rotate(${rig.trailer})`);
      steerEls.forEach((el) =>
        el.setAttribute("transform", `rotate(${rig.steer} ${el.dataset.cx} ${el.dataset.cy})`));
      treads.forEach((el) => { el.style.strokeDashoffset = String(-rig.s); });

      // camera: follow the truck's middle, zoom per beat; text left (desktop) / sheet bottom (mobile)
      const z = keyed(ZOOM_KEYS, p) * (mobile ? 0.62 : 1);
      const ah = rad(rig.tractor);
      const fx = rig.pivot.x - Math.cos(ah) * 350;
      const fy = rig.pivot.y - Math.sin(ah) * 350;
      const ax = size.w * (mobile ? 0.5 : 0.62);
      const ay = size.h * (mobile ? 0.34 : 0.54);
      world.setAttribute("transform", `translate(${ax - fx * z} ${ay - fy * z}) scale(${z})`);

      GATES.forEach((g, i) =>
        setData(gateEls[i], "state", p < g.queueFrom ? "ahead" : p < g.clearedAt ? "hold" : "cleared"));
      setData(strikeEl, "state", p < STRIKE.from ? "ahead" : p < STRIKE.until ? "active" : "lifted");
      BEATS.forEach((b, i) => setData(panels[i], "active", String(p >= b.from && p < b.to)));

      const cleared = GATES.filter((g) => p >= g.clearedAt);
      setText(hLast, cleared.length ? cleared[cleared.length - 1].name : "Durban");
      setText(hNext, GATES.find((g) => p < g.clearedAt)?.name ?? "Lubumbashi");
      setText(hKm, `${Math.round(TOTAL_KM * (1 - keyed(ROUTE_KEYS, p))).toLocaleString("en-ZA")} km`);
      setText(hDelay, `${Math.round(keyed(DELAY_KEYS, p))} h`);
      if (hBar) hBar.style.transform = `scaleX(${p})`;
      if (hTint) hTint.style.opacity = String(keyed(TINT_KEYS, p));

      // --- night / day ---
      const n = keyed(NIGHT_KEYS, p);
      root.style.setProperty("--n", String(n));

      // night-lights SVG shares the same camera transform as the world
      if (nightLights) {
        nightLights.setAttribute("transform", world.getAttribute("transform")!);

        // headlight beams — opacity from n
        const beamL = root.getElementById("nl-beam-l");
        const beamR = root.getElementById("nl-beam-r");
        if (beamL) beamL.setAttribute("opacity", String(n * 0.7));
        if (beamR) beamR.setAttribute("opacity", String(n * 0.7));

        // tail / brake lights — dim tail always on at night, brighter when stopped
        const isStopped = p < STRIKE.until || GATES.some((g) => p >= g.queueFrom && p < g.clearedAt);
        const tailOp = n * (isStopped ? 0.9 : 0.5);
        const tailL = root.getElementById("nl-tail-l");
        const tailR = root.getElementById("nl-tail-r");
        if (tailL) tailL.setAttribute("opacity", String(tailOp));
        if (tailR) tailR.setAttribute("opacity", String(tailOp));

        // hazard flashers — slow blink, ≤ 1.5 Hz (no strobe)
        const flash = n > 0.1 ? (Math.floor(Date.now() / 600) % 2) : 0;
        const hazFL = root.getElementById("nl-hazard-fl");
        const hazFR = root.getElementById("nl-hazard-fr");
        if (hazFL) hazFL.setAttribute("opacity", String(n * flash * 0.8));
        if (hazFR) hazFR.setAttribute("opacity", String(n * flash * 0.8));

        // booth glow for each gate
        GATES.forEach((g, i) => {
          const el = gateEls[i];
          if (el && el.getAttribute("data-state") === "hold" && nightLights) {
            // find booth glow inside nightLights
            const boothGlow = root.getElementById(`nl-booth-${g.id}`);
            if (boothGlow) boothGlow.setAttribute("opacity", String(n * 0.5));
          }
        });
      }

      // screen-space tint layer — multiply blend over trucks at night
      if (nightTintEl) nightTintEl.style.opacity = String(n * 0.5);
    };

    const measure = () => {
      const r = svg.getBoundingClientRect();
      size.w = r.width; size.h = r.height;
    };
    measure();

    const ctx = gsap.context(() => {
      // proxy tween: ScrollTrigger's scrub smoothing (0.6) applies to state.p, render reads it.
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root, start: "top top", end: () => `+=${window.innerHeight * PIN_SCREENS}`,
          pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
          refreshPriority: 0,
        },
      }).to(state, { p: 1, duration: 1, onUpdate: () => render(state.p) });
    }, root);

    const ro = new ResizeObserver(() => { measure(); render(state.p); });
    ro.observe(svg);
    render(0);

    return () => { ro.disconnect(); ctx.revert(); };
  }, [reduced]);

  if (reduced) {
    return (
      <section className={css.static} aria-labelledby="ch6-title" data-chapter="6">
        <h2 id="ch6-title" className={css.staticHead}>Corridor &amp; Clearance</h2>
        {BEATS.map((b) => (
          <article key={b.id} className={css.staticBeat}><BeatCopy b={b} /></article>
        ))}
      </section>
    );
  }

  return (
    <section ref={rootRef} className={css.root} aria-labelledby="ch6-title" data-chapter="6">
      <h2 id="ch6-title" className={css.srOnly}>Corridor &amp; Clearance</h2>
      <div className={css.stage}>
        <svg ref={svgRef} className={css.world} aria-hidden="true" focusable="false">
          <g ref={worldRef}>
            <rect x={-40000} y={-40000} width={160000} height={90000} className={css.land} />
            <path ref={routeRef} d={ROUTE_D} className={css.roadBed} />
            <path d={ROUTE_D} className={css.roadLine} />

            <g className={css.strike} data-strike data-state="ahead" data-at={STRIKE.at} data-off={GATE_OFF}>
              {[-420, -140, 140, 420].map((y) => (
                <rect key={y} x={-30} y={y - 110} width={60} height={220} rx={8} className={css.barricade} />
              ))}
              <g data-upright><text className={css.label} x={0} y={-720} textAnchor="middle">BLOCKADE</text></g>
            </g>

            {GATES.map((g) => (
              <g key={g.id} className={css.gate} data-gate={g.id} data-state="ahead" data-at={g.at} data-off={GATE_OFF}>
                <rect className={css.booth} x={-120} y={-760} width={240} height={200} rx={20} />
                <rect className={css.boom} x={-25} y={-550} width={50} height={1100} rx={10} />
                <g data-upright>
                  <text className={css.label} x={0} y={-950} textAnchor="middle">{g.name.toUpperCase()}</text>
                  <g className={css.tagHold}>
                    <rect x={-300} y={640} width={600} height={240} rx={20} />
                    <text x={0} y={815} textAnchor="middle">HOLD</text>
                  </g>
                  <g className={css.tagClear}>
                    <rect x={-420} y={640} width={840} height={240} rx={20} />
                    <text x={0} y={815} textAnchor="middle">CLEARED</text>
                  </g>
                </g>
              </g>
            ))}
            {GATES.filter((g) => g.queue).map((g) => (
              <g key={`q-${g.id}`} data-at={g.at} data-off={GATE_OFF - 300} data-dy={480}><QueueTrucks /></g>
            ))}
            <g data-at={1} data-off={1600}>
              <rect x={-20} y={-550} width={40} height={1100} className={css.finish} />
              <g data-upright><text className={css.label} x={0} y={-720} textAnchor="middle">LUBUMBASHI</text></g>
            </g>

            <g ref={horseRef}><g transform="translate(-275 -150)"><TractorArt /></g></g>
            <g ref={trailerRef}><g transform="translate(-1300 -150)"><TrailerArt /></g></g>
          </g>
        </svg>

        <div className={css.tint} data-hud="tint" />
        <div className={css.nightTint} data-night-tint />
        <svg className={css.nightLights} aria-hidden="true" focusable="false">
          <g ref={nightLightsRef}>
            {/* Tractor headlight beams */}
            <g opacity="0" id="nl-beam-l"><polygon points="0,0 400,-100 400,80" fill="url(#nl-headlight)" /></g>
            <g opacity="0" id="nl-beam-r"><polygon points="0,0 400,-80 400,100" fill="url(#nl-headlight)" /></g>
            {/* Tractor hazard flashers */}
            <circle id="nl-hazard-fl" cx="405" cy="14" r="6" fill="#F2A91B" opacity="0" />
            <circle id="nl-hazard-fr" cx="405" cy="286" r="6" fill="#F2A91B" opacity="0" />
            {/* Tractor tail/brake lights */}
            <circle id="nl-tail-l" cx="-215" cy="116" r="8" fill="#C8352B" opacity="0.6" />
            <circle id="nl-tail-r" cx="-215" cy="184" r="8" fill="#C8352B" opacity="0.6" />
            {/* Gate booth glow */}
            <rect id="nl-booth-g1" x="-60" y="-700" width="120" height="120" rx="60" fill="url(#nl-booth-glow)" opacity="0" />
            <rect id="nl-booth-g2" x="-60" y="-700" width="120" height="120" rx="60" fill="url(#nl-booth-glow)" opacity="0" />
            <rect id="nl-booth-g3" x="-60" y="-700" width="120" height="120" rx="60" fill="url(#nl-booth-glow)" opacity="0" />
          </g>
          <defs>
            <radialGradient id="nl-headlight" cx="0" cy="0.5" r="1">
              <stop offset="0%" stopColor="#fffbe6" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#fffbe6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#fffbe6" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="nl-booth-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#fff8e0" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#fff8e0" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
        <div className={css.kickerPlate}><span>06</span> Corridor &amp; Clearance</div>

        <aside className={css.hud} aria-hidden="true">
          <div><span>Cargo on the line</span><b>R 2,000,000</b></div>
          <div><span>Last checkpoint</span><b data-hud="last">Durban</b></div>
          <div><span>Next gate</span><b data-hud="next">Beitbridge</b></div>
          <div><span>Remaining</span><b data-hud="km">2,900 km</b></div>
          <div><span>Delay exposure</span><b data-hud="delay">0 h</b></div>
        </aside>

        <div className={css.panels}>
          {BEATS.map((b) => (
            <article key={b.id} className={css.panel} data-beat={b.id} data-active="false"><BeatCopy b={b} /></article>
          ))}
        </div>
        <div className={css.bar}><i data-hud="bar" /></div>
      </div>
    </section>
  );
}
