"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  BEATS, DELAY_KEYS, GATES, NIGHT_KEYS, PIN_SCREENS, RIG_LOOK, RIG_SPAN, ROUTE_KEYS,
  TINT_KEYS, TOTAL_KM, TRACTOR, TRAILER, ZOOM_KEYS,
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
  const nightCameraRef = useRef<SVGGElement>(null);
  const tractorLightsRef = useRef<SVGGElement>(null);
  const trailerLightsRef = useRef<SVGGElement>(null);

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
    // The upright counter-rotation also cancels the world rotation
    // (camera.worldRotate), so text stays readable whichever way the road runs.
    root.querySelectorAll<SVGGElement>("[data-at]").forEach((el) => {
      const s = parseFloat(el.dataset.at!) * table.length + parseFloat(el.dataset.off ?? "0");
      const pt = pointAt(table, s);
      const a = deg(headingAt(table, s));
      el.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${a}) translate(0 ${el.dataset.dy ?? 0})`);
      el.querySelectorAll("[data-upright]").forEach((t) => t.setAttribute("transform", `rotate(${-a - camera.worldRotate})`));
    });

    // Cache the handful of elements render() touches every frame.
    const steerEls = Array.from(root.querySelectorAll<SVGGElement>("#cft-wheel-fl, #cft-wheel-fr"));
    const treads = Array.from(root.querySelectorAll<SVGElement>(".tread"));
    const gateEls = GATES.map((g) => root.querySelector(`[data-gate="${g.id}"]`));
    const nightCam = nightCameraRef.current;
    const tractorLights = tractorLightsRef.current;
    const trailerLights = trailerLightsRef.current;
    const nightTintEl = root.querySelector<HTMLElement>("[data-night-tint]");
    const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-beat]"));
    const hud = (k: string) => root.querySelector<HTMLElement>(`[data-hud="${k}"]`);
    const [hNext, hKm, hDelay, hBar, hTint] = ["next", "km", "delay", "bar", "tint"].map(hud);

    // ---- per-frame render --------------------------------------------------
    const render = (p: number) => {
      const rig = computeRig(table, keyed(ROUTE_KEYS, p));

      // Rig: tractor + trailer share the kingpin pivot; steer + treads follow.
      horse.setAttribute("transform", `translate(${rig.pivot.x} ${rig.pivot.y}) rotate(${rig.tractor})`);
      trailer.setAttribute("transform", `translate(${rig.pivot.x} ${rig.pivot.y}) rotate(${rig.trailer})`);
      steerEls.forEach((el) =>
        el.setAttribute("transform", `rotate(${rig.steer} ${el.dataset.cx} ${el.dataset.cy})`));
      treads.forEach((el) => { el.style.strokeDashoffset = String(-rig.s); });

      // Camera: look at the rig's midpoint (RIG_LOOK behind the pivot) so the
      // full tractor + trailer is in frame, then scale the world so the rig
      // spans `camera.fill` of the stage width (resolution-independent).
      // The rotate() is applied to the WORLD (outermost), so the focus point
      // has to be rotated before the translate is computed — mobile uses -90
      // to run the corridor vertically up a portrait screen.
      const base = (size.w * camera.fill) / RIG_SPAN;
      const z = keyed(ZOOM_KEYS, p) * base;
      const rot = rad(camera.worldRotate);
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const ah = rad(rig.tractor);
      const fx = rig.pivot.x - Math.cos(ah) * RIG_LOOK;
      const fy = rig.pivot.y - Math.sin(ah) * RIG_LOOK;
      const ax = size.w * camera.anchorX;
      const ay = size.h * camera.anchorY;
      const cam = `translate(${ax - z * (fx * cosR - fy * sinR)} ${ay - z * (fx * sinR + fy * cosR)}) scale(${z}) rotate(${camera.worldRotate})`;
      world.setAttribute("transform", cam);

      // State machines → data-state / data-active; CSS does the visibility.
      GATES.forEach((g, i) =>
        setData(gateEls[i], "state", p < g.queueFrom ? "ahead" : p < g.clearedAt ? "hold" : "cleared"));
      BEATS.forEach((b, i) => setData(panels[i], "active", String(p >= b.from && p < b.to)));

      // HUD text (write-cached, so mostly free).
      setText(hNext, GATES.find((g) => p < g.clearedAt)?.name ?? "Lubumbashi");
      setText(hKm, `${Math.round(TOTAL_KM * (1 - keyed(ROUTE_KEYS, p))).toLocaleString("en-ZA")} km`);
      setText(hDelay, `${Math.round(keyed(DELAY_KEYS, p))} h`);
      if (hBar) hBar.style.transform = `scaleX(${p})`;
      if (hTint) hTint.style.opacity = String(keyed(TINT_KEYS, p));

      // Night scalar n (0=day, 1=night) → CSS var --n (colors mix off it)
      // plus the screen-blended light layer above.
      const n = keyed(NIGHT_KEYS, p);
      root.style.setProperty("--n", String(n));

      if (nightCam) nightCam.setAttribute("transform", cam);
      if (tractorLights || trailerLights) {
        // The two light groups carry the camera PLUS their own rig chain, so
        // their shapes can be authored in tractor/trailer viewBox coordinates
        // (0..1200/0..1400 × 0..300) and still track the truck exactly.
        const at = `translate(${rig.pivot.x} ${rig.pivot.y}) rotate(${rig.tractor}) translate(${-TRACTOR.pivotX} ${-TRACTOR.pivotY})`;
        const al = `translate(${rig.pivot.x} ${rig.pivot.y}) rotate(${rig.trailer}) translate(${-TRAILER.pivotX} ${-TRAILER.pivotY})`;
        if (tractorLights) tractorLights.setAttribute("transform", at);
        if (trailerLights) trailerLights.setAttribute("transform", al);
        const byId = (id: string) => root.querySelector<SVGElement>(`#${id}`);

        // Headlight beams — opacity from n.
        const beamL = byId("nl-beam-l");
        const beamR = byId("nl-beam-r");
        if (beamL) beamL.setAttribute("opacity", String(n * 0.85));
        if (beamR) beamR.setAttribute("opacity", String(n * 0.85));

        // Tail / brake lights — dim tail always on at night, brighter during gate deceleration.
        const isBraking = GATES.some((g) => p >= g.queueFrom && p < g.clearedAt);
        const tailOp = n * (isBraking ? 1 : 0.55);
        ["nl-tail-tl", "nl-tail-tr"].forEach((id) => {
          const el = byId(id);
          if (el) el.setAttribute("opacity", String(tailOp));
        });

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
            if (boothGlow) boothGlow.setAttribute("opacity", String(n * 0.7));
          }
        });
      }

      // Screen-space tint layer — multiply blend over trucks at night.
      if (nightTintEl) nightTintEl.style.opacity = String(n * 0.34);
    };

    const measure = () => {
      const r = svg.getBoundingClientRect();
      size.w = r.width; size.h = r.height;
    };
    measure();

    // ---- autonomous drive + scroll turbo boost engine ---------------------
    // The truck drives continuously even with zero scroll input.
    // User scroll acts as a turbo accelerator that makes it blazing fast.
    let autoP = 0;
    let currentP = 0;
    let targetP = 0;
    let lastScrollProgress = 0;
    let lastTime = performance.now();

    const st = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: () => `+=${window.innerHeight * PIN_SCREENS}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: 0,
      onUpdate: (self) => {
        const sp = self.progress;
        if (sp > lastScrollProgress) {
          // User scrolled down -> turbo boost forward!
          autoP = Math.max(autoP, sp);
        } else if (sp < lastScrollProgress) {
          // User scrolled up -> allow reverse scrubbing
          autoP = sp;
        }
        lastScrollProgress = sp;
      },
    });

    const tick = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.08);
      lastTime = now;

      const isSectionActive = st.isActive || (st.progress > 0 && st.progress < 1);

      if (isSectionActive) {
        // Continuous autonomous driving: ~25s full journey when idle
        const CRUISE_SPEED = 0.04;
        autoP = Math.min(1, autoP + dt * CRUISE_SPEED);

        // Target progress is accelerated by scroll
        targetP = Math.min(1, Math.max(st.progress, autoP));
      } else if (st.progress >= 1) {
        targetP = 1;
        autoP = 1;
      } else {
        targetP = 0;
        autoP = 0;
      }

      // Responsive interpolation for smooth high-speed acceleration
      currentP += (targetP - currentP) * 0.16;
      if (Math.abs(targetP - currentP) < 0.0001) currentP = targetP;

      render(currentP);
    };

    gsap.ticker.add(tick);

    // Keep size fresh on resize, then draw the opening frame.
    const ro = new ResizeObserver(() => { measure(); render(currentP); });
    ro.observe(svg);
    render(0);

    return () => {
      ro.disconnect();
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, [reduced, camera]);

  return { rootRef, svgRef, worldRef, routeRef, horseRef, trailerRef, nightCameraRef, tractorLightsRef, trailerLightsRef };
}
