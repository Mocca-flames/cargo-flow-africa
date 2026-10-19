"use client";

import { useCallback, useRef, useState } from "react";
import CargoFertiliser from "./CargoFertiliser";
import CargoSteel from "./CargoSteel";
import CargoSulphur from "./CargoSulphur";
import TrailerSide from "./TrailerSide";
import LoadsSheet from "./LoadsSheet";
import { sideBlockStyle } from "./planGeometry";
import { useLoadsMobileProgress } from "./useLoadsMobileProgress";
import { cumulativeTonnes, loadPlan, loadTotals, loadsCopy } from "@/data/loads";
import type { CargoId, LoadUnitId } from "@/data/loads";
import "./LoadPlan.mobile.css";

/**
 * Ch5 mobile — the side-elevation load plan.
 *
 * Mobile reads the trailer from the side, exactly as desktop does; the top
 * view is retired. The mechanic is one sentence long: the loading point is
 * FIXED at the centre of the screen and the trailer slides underneath it
 * between drops. There is no swipe, no horizontal scroller, no scroll-snap
 * and no scroll-jacking — vertical scroll only, and the frame lock itself is
 * pure CSS (a 460svh track plus `position: sticky`).
 *
 * ── One group, positioned in trailer units ──
 * `planGeometry.ts` expresses every side-view position as a PERCENTAGE of a
 * 1200×340 stage: the trailer's 1200×200 drawing anchored to its bottom, and
 * the band above the deck line that freight occupies. `sideBlockStyle()` is
 * exported and returns exactly those percentages. So the rig IS that box: a
 * group 1200·s wide and 340·s tall, with the trailer on its bottom edge and
 * the three cargo drawings standing on the deck line, all positioned by the
 * one geometry module. Only two numbers are needed here — the stage's own
 * width and height, both documented at the top of `planGeometry.ts`.
 *
 * `s` is pixels per trailer unit, computed once on mount and on WIDTH changes
 * only (a height-only resize is ignored: `svh` does not move when the mobile
 * URL bar shows or hides). The group moves as ONE transform — the trailer
 * plus every load — so a slide is a single `translate3d` and the cargo never
 * has to be re-positioned relative to the deck.
 *
 * ── Cargo falls, never fades ──
 * A load is opacity 1 for its whole life. Before its step it sits ABOVE the
 * stage and the stage's `overflow: clip` takes it out of view; its step is one
 * `translateY` from there down to the deck, eased cubic-out. There is no
 * opacity rule, no scale, no blur on any cargo — the hiding is clipping and
 * the arrival is movement.
 *
 * ── Cost model: cheap Android is the baseline ──
 * The handler and the loop read NO layout. `window.scrollY` is a cached scroll
 * offset, not a measurement: there is no `getBoundingClientRect`, no
 * `offsetHeight`, no `getComputedStyle` and no `getBBox` anywhere outside
 * `measure()`, which runs on mount and on WIDTH changes only. One passive
 * scroll listener writes a target into a ref; one rAF loop eases the displayed
 * progress toward it and writes `translate3d` and `opacity` straight to
 * elements. React only hears about landings — a handful of events for the
 * whole chapter, never a per-frame state. An `IntersectionObserver` parks the
 * loop entirely while the chapter is off screen.
 *
 * ── Progressive rendering ──
 * The server (and no-JS, and reduced motion) render the plan already loaded —
 * every load settled, the card reading the run total, the link up — because
 * those are the states where nothing is moving. The scrub only engages in the
 * browser once the section is on screen.
 */

const STAGE_W = 1200;
const STAGE_H = 340;

/** The manifest's wording for each load's commodity, keyed by the plan's own
    ids. Same labels as the desktop manifest, so the two documents cannot
    disagree about what is on the deck. */
const COMMODITY_LABEL: Record<LoadUnitId, string> = {
  "steel-coil": "STEEL COILS",
  sulphur: "SULPHUR",
  fertiliser: "BAGGED FERTILISER",
};

export default function LoadPlanMobile({ reduced }: { reduced: boolean }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const rigRef = useRef<HTMLDivElement | null>(null);
  const cargoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement | null>(null);

  /* Manifest reading. -1 hidden, 0–2 a landed load, 3 the run total. */
  const [cardStep, setCardStep] = useState(-1);
  /* Loads fully landed (0–3). Drives the load sheet counter. */
  const [landed, setLanded] = useState(0);
  const [linkShown, setLinkShown] = useState(false);

  /* The rig's size is written to CSS variables, NOT to a React `style` prop.
     The hook owns the rig's `transform`, and a React-rendered inline style
     that omits `transform` would reset it to none on every re-render — which
     is exactly what happens the moment any state here commits. Custom
     properties are invisible to React's style diffing, so the two never
     collide, and no scale state means no re-render at all per measure. */
  const onScale = useCallback((s: number) => {
    if (rigRef.current) {
      rigRef.current.style.setProperty("--lm-rig-w", `${STAGE_W * s}px`);
      rigRef.current.style.setProperty("--lm-rig-h", `${STAGE_H * s}px`);
    }
  }, []);
  const onCard = useCallback((step: number) => setCardStep(step), []);
  const onLanded = useCallback((n: number) => setLanded(n), []);
  const onLink = useCallback((shown: boolean) => setLinkShown(shown), []);

  useLoadsMobileProgress({
    sectionRef,
    frameRef,
    stageRef,
    rigRef,
    cargoRefs,
    lineRef,
    reduced,
    onScale,
    onCard,
    onLanded,
    onLink,
  });

  /* Reduced motion (and the server snapshot) show the settled plan. */
  const step = reduced ? 3 : cardStep;
  const landedCount = reduced ? loadTotals.units : landed;
  const link = reduced || linkShown;
  const unit = step >= 0 && step < loadPlan.length ? loadPlan[step] : null;

  return (
    <section
      id="loads-section"
      ref={sectionRef}
      className="lm-section"
      aria-labelledby="lm-heading"
    >
      <div className="lm-frame" ref={frameRef}>
        <header className="lm-header">
          <h2 className="lm-heading" id="lm-heading">
            <span className="lm-heading-line">3 Clients.</span>
            <span className="lm-heading-line">1 Truck. 70% Saved.</span>
          </h2>
          <p className="lm-standfirst">{loadsCopy.standfirst}</p>
          <p className="lm-note">{loadsCopy.sharedTrailerNote}</p>
        </header>

        {/* THE CLIP. A load waits for its step ABOVE the stage, fully opaque,
            and is taken out of sight by clipping it here — transform for the
            travel, overflow for the hiding. Never opacity. The drop line is a
            sibling, not a child: it is fixed to the stage (the screen), not to
            the sliding trailer. */}
        <div className="lm-stage" ref={stageRef}>
          <div className="lm-rig" ref={rigRef}>
            <div className="lm-trailer">
              <TrailerSide />
            </div>

            {loadPlan.map((record, index) => (
              <div
                key={record.id}
                ref={(node) => {
                  cargoRefs.current[index] = node;
                }}
                className="lm-cargo"
                style={sideBlockStyle(record)}
              >
                <CargoSvg id={record.cargo.id} />
              </div>
            ))}
          </div>

          <div className="lm-line" ref={lineRef} aria-hidden="true" />
        </div>

        {/* ─── The cargo manifest ───
            A flat plate in normal flow, directly below the stage — under the
            drawing, never over it. Fixed width and height so a longer
            commodity or route cannot resize it. Only the text changes, and only
            when a threshold is crossed; the 150ms crossfade is keyed on the
            load id so React swaps the field as one node. Hidden (opacity 0,
            space reserved) before the first landing. */}
        <div className="lm-card" data-shown={step >= 0 ? "true" : "false"}>
          <div className="lm-card-inner" key={step} aria-live="polite">
            {step === 3 ? (
              <p className="lm-card-summary">
                {loadTotals.tonnes.toFixed(1)} T{" "}
                <span aria-hidden="true">·</span> {loadTotals.units} shippers{" "}
                <span aria-hidden="true">·</span> 1 truck
              </p>
            ) : unit ? (
              <>
                <div className="lm-card-row">
                  <span className="lm-card-name">{COMMODITY_LABEL[unit.id]}</span>
                  <span className="lm-card-tonnes">
                    {unit.tonnes.toFixed(1)} T
                  </span>
                </div>
                <p className="lm-card-route">
                  {unit.yard} → {unit.destination}, {unit.country}
                </p>
              </>
            ) : null}
          </div>
        </div>

        {/* ─── The load sheet ───
            A thin mono line under the manifest card: `FD-120 · 00 / 03 · 0.0 T`
            ticking to `03 / 03 · 34.0 T` as each load lands. Driven by the same
            beats as the card (progress 0.15, 0.48, 0.81). Always visible — it is
            the chapter's telemetry, not a reveal. */}
        <div className="lm-sheet">
          <LoadsSheet landed={landedCount} tonnes={cumulativeTonnes(landedCount)} />
        </div>

        {/* The link. Opacity-only reveal; dropped from the tab order and the
            a11y tree until it is up, so it is never a silent dead end. The row
            is a fixed 32px band; the anchor itself is a 44px tap target that
            overflows it symmetrically. */}
        <div className="lm-link-row">
          <a
            className="lm-link"
            href="/loads"
            data-visible={link ? "true" : "false"}
            tabIndex={link ? undefined : -1}
            aria-hidden={link ? undefined : true}
          >
            <span className="lm-link-rule" aria-hidden="true" />
            See how we load
          </a>
        </div>
      </div>
    </section>
  );
}

/** The freight drawing for a commodity. Every one is drawn in the same ink /
    opacity language as the trailer, so the three read as a set. */
function CargoSvg({ id }: { id: CargoId }) {
  switch (id) {
    case "sulphur":
      return <CargoSulphur />;
    case "steel-coil":
      return <CargoSteel />;
    case "fertiliser":
      return <CargoFertiliser />;
    default:
      return null;
  }
}
