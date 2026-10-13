"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BEATS, DELAY_KEYS, GATES, NIGHT_KEYS, PIN_SCREENS, ROUTE_KEYS,
  STRIKE, TINT_KEYS, TOTAL_KM, ZOOM_KEYS,
} from "./config";
import { buildRouteTable, computeRig, headingAt, keyed, pointAt, deg, rad } from "./rig";
import type { CameraLayout } from "./camera";

gsap.registerPlugin(ScrollTrigger);

/**
 * THE ENGINE — all scroll-scrubbed DOM mutation for Ch6 lives here.
 *
 * Mental model:
 *   ScrollTrigger pins the section for PIN_SCREENS viewports and scrubs a
 *   single proxy `state.p` from 0→1 (scrub 0.6 smooths it). Every frame,
 *   render(p) reads keyframed values from config.ts and writes transforms /
 *   opacities / text DIRECTLY onto the DOM (no React re-renders — that's
 *   why it stays at 60fps). React only mounts the markup once.
 *
 * To change behaviour, the knobs are almost always in config.ts:
 *   · where the truck stops / how fast it moves → ROUTE_KEYS
 *   · zoom per beat                            → ZOOM_KEYS
 *   · when gates hold / clear                   → GATES
 *   · night & tint curves                       → NIGHT_KEYS / TINT_KEYS
 *   · which copy windows show                   → BEATS
 * Camera framing per viewport is in camera.ts; layout CSS in CorridorDesktop.css /
 * CorridorMobile.css. This file should rarely need edits.
 *
 * DOM contract (do not rename without updating the view components):
 *   [data-at][data-off][data-dy]  roadside objects placed on the route (once, on mount)
 *   [data-upright]                children kept level while parent rotates
 *   [data-gate] [data-strike]     state machines driven by p (CSS shows/hides)
 *   [data-beat] [data-active]     copy panel visibility
 *   [data-hud]                    HUD text targets (last/next/km/delay/bar/tint)
 *   .tread                        dashed strokes whose offset scrolls with distance
 *   #cft-wheel-fl / #cft-wheel-fr front wheels (steered each frame)
 *   #nl-*                         night-lights ids (see view/NightLights.tsx)
 */

export function useCorridorAnimation({
  reduced,
  camera,
}: {
  /** When true the hook does nothing — CorridorRun renders StaticCorridor instead. */
  reduced: boolean;
  /** Desktop vs mobile framing numbers (camera.ts). */
  camera: CameraLayout;
}) {
  // Refs into the markup CorridorRun composes. The hook owns them so the
  // component stays pure JSX.
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

    // ---- one-time setup ----------------------------------------------------

    // Sample the SVG path into a fast lookup table (points + end tangents).
    const table = buildRouteTable(route);
    const size = { w: 1, h: 1 };           // stage px size, kept fresh by ResizeObserver
    const state = { p: 0 };                // scroll progress 0..1 (GSAP tweens this)

    // Tiny write-caches: skip DOM writes when the value didn't change.
    const cache = new Map<Element, string>();
    const setText = (el: Element | null, v: string) => {
      if (el && cache.get(el) !== v) { cache.set(el, v); el.textContent = v; }
    };
    const setData = (el: Element | null, k: string, v: string) => {
      if (el && (el as HTMLElement).dataset[k] !== v) (el as HTMLElement).dataset[k] = v;
    };

    // Place every [data-at] object on the route (position + heading), keep
    // [data-upright] children level. Done once — roadside props never move.
    root.querySelectorAll<SVGGElement>("[data-at]").forEach((el) => {
      const s = parseFloat(el.dataset.at!) * table.length + parseFloat(el.dataset.off ?? "0");
      const pt = pointAt(table, s);
      const a = deg(headingAt(table, s));
      el.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${a}) translate(0 ${el.dataset.dy ?? 0})`);
      el.querySelectorAll("[data-upright]").forEach((t) => t.setAttribute("transform", `rotate(${-a})`));
    });

    // Cache the handful of elements render() touches every frame.
    const steerEls = Array.from(root.querySelectorAll<SVGGElement>("#cft-wheel-fl, #cft-wheel-fr"));
    const treads = Array.from(root.querySelectorAll<SVGElement>(".tread"));
    const gateEls = GATES.map((g) => root.querySelector(`[data-gate="${g.id}"]`));
    const strikeEl = root.querySelector("[data-strike]");
    const nightLights = nightLightsRef.current;
    const nightTintEl = root.querySelector<HTMLElement>("[data-night-tint]");
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-beat]"));
    const hud = (k: string) => root.querySelector<HTMLElement>(`[data-hud="${k}"]`);
    const [hLast, hNext, hKm, hDelay, hBar, hTint] = ["last", "next", "km", "delay", "bar", "tint"].map(hud);

    // ---- per-frame render --------------------------------------------------
    const render = (p: number) => {
      const rig = computeRig(table, keyed(ROUTE_KEYS, p));

      // Rig: tractor + trailer share the kingpin pivot; steer + treads follow.
      horse.setAttribute("transform", `translate(${rig.pivot.x} ${rig.pivot.y}) rotate(${rig.tractor})`);
      trailer.setAttribute("transform", `translate(${rig.pivot.x} ${rig.pivot.y}) rotate(${rig.trailer})`);
      steerEls.forEach((el) =>
        el.setAttribute("transform", `rotate(${rig.steer} ${el.dataset.cx} ${el.dataset.cy})`));
      treads.forEach((el) => { el.style.strokeDashoffset = String(-rig.s); });

      // Camera: look 800 units behind the pivot (shows full trailer), scale by ZOOM_KEYS * layout.
      const z = keyed(ZOOM_KEYS, p) * camera.zoomMul;
      const ah = rad(rig.tractor);
      const fx = rig.pivot.x - Math.cos(ah) * 800;
      const fy = rig.pivot.y - Math.sin(ah) * 800;
      const ax = size.w * camera.anchorX;
      const ay = size.h * camera.anchorY;
      world.setAttribute("transform", `translate(${ax - fx * z} ${ay - fy * z}) scale(${z})`);

      // State machines → data-state / data-active; CSS does the visibility.
      GATES.forEach((g, i) =>
        setData(gateEls[i], "state", p < g.queueFrom ? "ahead" : p < g.clearedAt ? "hold" : "cleared"));
      setData(strikeEl, "state", p < STRIKE.from ? "ahead" : p < STRIKE.until ? "active" : "lifted");
      BEATS.forEach((b, i) => setData(panels[i], "active", String(p >= b.from && p < b.to)));

      // HUD text (write-cached, so mostly free).
      const cleared = GATES.filter((g) => p >= g.clearedAt);
      setText(hLast, cleared.length ? cleared[cleared.length - 1].name : "Durban");
      setText(hNext, GATES.find((g) => p < g.clearedAt)?.name ?? "Lubumbashi");
      setText(hKm, `${Math.round(TOTAL_KM * (1 - keyed(ROUTE_KEYS, p))).toLocaleString("en-ZA")} km`);
      setText(hDelay, `${Math.round(keyed(DELAY_KEYS, p))} h`);
      if (hBar) hBar.style.transform = `scaleX(${p})`;
      if (hTint) hTint.style.opacity = String(keyed(TINT_KEYS, p));

      // Night scalar n (0=day, 1=night) → CSS var --n (colors mix off it)
      // plus the screen-blended light layer above.
      const n = keyed(NIGHT_KEYS, p);
      root.style.setProperty("--n", String(n));

      if (nightLights) {
        // Same camera as the world, so lights track the truck.
        nightLights.setAttribute("transform", world.getAttribute("transform")!);
        const byId = (id: string) => nightLights.querySelector<SVGElement>(`#${id}`);

        // Headlight beams — opacity from n.
        const beamL = byId("nl-beam-l");
        const beamR = byId("nl-beam-r");
        if (beamL) beamL.setAttribute("opacity", String(n * 0.7));
        if (beamR) beamR.setAttribute("opacity", String(n * 0.7));

        // Tail / brake lights — dim tail always on at night, brighter when stopped.
        const isStopped = p < STRIKE.until || GATES.some((g) => p >= g.queueFrom && p < g.clearedAt);
        const tailOp = n * (isStopped ? 0.9 : 0.5);
        const tailL = byId("nl-tail-l");
        const tailR = byId("nl-tail-r");
        if (tailL) tailL.setAttribute("opacity", String(tailOp));
        if (tailR) tailR.setAttribute("opacity", String(tailOp));

        // Hazard flashers — slow blink, ≤ 1.5 Hz (no strobe).
        const flash = n > 0.1 ? (Math.floor(Date.now() / 600) % 2) : 0;
        const hazFL = byId("nl-hazard-fl");
        const hazFR = byId("nl-hazard-fr");
        if (hazFL) hazFL.setAttribute("opacity", String(n * flash * 0.8));
        if (hazFR) hazFR.setAttribute("opacity", String(n * flash * 0.8));

        // Booth glow for each gate while it's holding traffic.
        GATES.forEach((g, i) => {
          const el = gateEls[i];
          if (el && el.getAttribute("data-state") === "hold") {
            const boothGlow = byId(`nl-booth-${g.id}`);
            if (boothGlow) boothGlow.setAttribute("opacity", String(n * 0.5));
          }
        });
      }

      // Screen-space tint layer — multiply blend over trucks at night.
      if (nightTintEl) nightTintEl.style.opacity = String(n * 0.5);
    };

    const measure = () => {
      const r = svg.getBoundingClientRect();
      size.w = r.width; size.h = r.height;
    };
    measure();

    // ---- scroll wiring -----------------------------------------------------
    // Proxy tween: ScrollTrigger's scrub smoothing (0.6) applies to state.p;
    // render reads it. The section is pinned for PIN_SCREENS viewports.
    const ctx = gsap.context(() => {
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root, start: "top top", end: () => `+=${window.innerHeight * PIN_SCREENS}`,
          pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
          refreshPriority: 0,
        },
      }).to(state, { p: 1, duration: 1, onUpdate: () => render(state.p) });
    }, root);

    // Keep size fresh on resize, then draw the opening frame.
    const ro = new ResizeObserver(() => { measure(); render(state.p); });
    ro.observe(svg);
    render(0);

    return () => { ro.disconnect(); ctx.revert(); };
  }, [reduced, camera]);

  return { rootRef, svgRef, worldRef, routeRef, horseRef, trailerRef, nightLightsRef };
}
