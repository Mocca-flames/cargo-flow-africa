"use client";

import { corridorLanes } from "@/data/corridors-ch5";
import type { MapPoint } from "@/data/corridors-ch5";
import "./CorridorMap.css";

/**
 * The SADC corridor map — Ch5's map asset.
 *
 * Currently unmounted from the chapter (the load plan doesn't need it), but
 * built to be dropped anywhere: it takes its own variant and its own progress,
 * describes itself to assistive tech, and holds no state or hooks. Nothing
 * about it is specific to the load plan it grew up next to.
 *
 * ── Progress ──
 * Routes draw on as `progress[i]` goes 0 -> 1, and each destination lights as its
 * own route completes. `pathLength={1}` normalises every route, so one dash
 * spec covers all three regardless of their real lengths. Pass `undefined` (the
 * default) and every route is simply drawn — which is the correct static
 * state for reduced motion, for SSR, and for anywhere the map is used as a
 * plain illustration rather than a scrub target.
 *
 * ── Variants ──
 * `panel` is the full SADC outline. `strip` is the same drawing cropped
 * declaratively by `viewBox` to the latitude band the routes actually occupy
 * (y 196–424 of the source artwork), for placing the map above a tall narrow
 * element — a top-view trailer, say. The crop is expressed in the coordinate
 * space rather than by scaling or translating a full-size render, so the
 * geometry stays exactly the authored geometry at any size.
 *
 * ── Colour ──
 * Every hardcoded `#12382F` in the source drawing is `currentColor`, which
 * `.loads-map` sets from `--color-ink`. Country outlines are flat and quiet; the
 * DRC is the one hero country. The three routes are the only thing on the map
 * with weight.
 *
 * PLACEHOLDER OUTLINE: the country paths are the supplied schematic, not survey
 * data. Swap the `<g>` of standard countries and the DRC path for the Gemini
 * SVG and nothing else changes — the routes, dots and labels all read their
 * coordinates from `data/corridors-ch5.ts`.
 */

/** Source artwork: 600×520. */
const SOURCE = { w: 600, h: 520 } as const;

/** The band the three routes occupy, cropped for the `strip` variant. The
    origins sit at y≈426–478 and the destinations at y≈220–265, so this keeps
    both ends of every lane in frame and discards the empty north. */
const STRIP_CROP = { x: 0, y: 196, w: 600, h: 228 } as const;

/** A gently bowed route, so three lines out of the same coast stay legible. */
function routePath(from: MapPoint, to: MapPoint, bow: number) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  /* Offset the control point perpendicular to the chord. */
  const cx = mx - dy * bow;
  const cy = my + dx * bow;
  return `M ${from.x} ${from.y} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${to.x} ${to.y}`;
}

export default function CorridorMap({
  variant = "panel",
  progress,
  className,
}: {
  /** `panel` = full outline. `strip` = cropped to the route band. */
  variant?: "panel" | "strip";
  /** Per-route draw-on, 0–1 in `corridorLanes` order. Defaults to all drawn. */
  progress?: number[];
  className?: string;
}) {
  const crop = variant === "strip" ? STRIP_CROP : { x: 0, y: 0, ...SOURCE };
  const viewBox = `${crop.x} ${crop.y} ${crop.w} ${crop.h}`;
  const draw = (index: number) => progress?.[index] ?? 1;

  /* React's style typing doesn't know about custom properties, but they're
     valid on SVG elements and are how the progress reaches the CSS below. */
  const custom = (name: string, value: string | number) =>
    ({ [name]: value }) as React.CSSProperties;

  const lanes = corridorLanes;
  const caption = lanes
    .map(
      (lane) =>
        `${lane.origin} to ${lane.destination}, ${lane.country}`
    )
    .join("; ");

  return (
    <svg
      className={className ? `loads-map ${className}` : "loads-map"}
      viewBox={viewBox}
      /* `slice` would crop; `meet` letterboxes. With the strip crop already
         narrowing the viewBox, `meet` keeps the whole band visible and the
         container's aspect-ratio decides the letterboxing. */
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`Map of three freight corridors across southern Africa: ${caption}.`}
      style={custom("--map-aspect", `${crop.w} / ${crop.h}`)}
    >
      {/* ─── Standard countries ───
          Flat, quiet outlines. Lesotho and Eswatini are cut out of the South
          Africa path with opposite winding, so the nonzero fill-rule leaves
          holes without needing a clip path. */}
      <g
        fill="currentColor"
        fillOpacity="0.08"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.3"
        strokeLinejoin="round"
      >
        {/* ZAF, with holes for LSO and SWZ */}
        <path d="M 148,422 L 179,476 L 210,500 L 304,488 L 382,440 L 397,428 L 413,404 L 397,392 L 382,344 L 350,344 L 304,380 L 210,380 Z M 335,422 L 348,434 L 330,446 L 318,434 Z M 397,392 L 413,398 L 402,410 L 384,398 Z" />
        {/* LSO */}
        <path d="M 335,422 L 348,434 L 330,446 L 318,434 Z" />
        {/* SWZ */}
        <path d="M 397,392 L 413,398 L 402,410 L 384,398 Z" />
        {/* NAM */}
        <path d="M 148,422 L 210,380 L 210,344 L 257,302 L 288,296 L 257,290 L 179,290 L 85,284 L 116,356 Z" />
        {/* BWA */}
        <path d="M 210,380 L 304,380 L 350,344 L 288,296 L 257,302 L 210,344 Z" />
        {/* ZWE */}
        <path d="M 350,344 L 382,344 L 413,290 L 366,266 L 350,272 L 304,296 L 288,296 Z" />
        {/* MOZ */}
        <path d="M 413,404 L 413,398 L 397,392 L 382,344 L 413,290 L 366,266 L 413,248 L 444,284 L 460,248 L 444,218 L 530,206 L 530,254 L 444,320 Z" />
        {/* MWI */}
        <path d="M 428,194 L 444,218 L 460,248 L 444,284 L 413,248 L 420,206 Z" />
        {/* ZMB */}
        <path d="M 288,296 L 304,296 L 350,272 L 366,266 L 413,248 L 420,206 L 428,194 L 382,182 L 350,188 L 350,224 L 343,236 L 328,224 L 272,212 L 241,236 L 257,290 Z" />
        {/* AGO */}
        <path d="M 85,284 L 179,290 L 257,290 L 241,236 L 272,212 L 241,200 L 179,170 L 132,152 L 85,152 L 101,188 Z M 85,146 L 101,146 L 101,134 L 85,134 Z" />
        {/* TZA */}
        <path d="M 530,206 L 444,218 L 428,194 L 382,182 L 350,116 L 413,92 L 506,134 L 506,164 Z" />
        {/* COG */}
        <path d="M 85,146 L 85,134 L 70,116 L 116,68 L 148,44 L 179,44 L 163,92 L 132,128 Z" />
      </g>

      {/* ─── The DRC: the hero country ───
          Heavier fill and stroke. This is where two of the three loads are
          bound, so it carries the most weight on the map. */}
      <path
        d="M 85,152 L 85,146 L 132,128 L 163,92 L 179,44 L 226,32 L 288,20 L 335,32 L 366,26 L 374,62 L 359,80 L 350,104 L 350,116 L 382,182 L 350,188 L 350,224 L 343,236 L 328,224 L 272,212 L 241,200 L 179,170 L 132,152 Z"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.6"
        strokeLinejoin="round"
      />

      {/* ---- Routes ----
          Drawn before the dots so the dots sit on top of their own route ends. */}
      <g className="loads-map__routes">
        {lanes.map((lane, index) => (
          <path
            key={lane.loadId}
            className="loads-map__route"
            data-index={index}
            d={routePath(lane.from, lane.to, lane.bow)}
            pathLength={1}
            style={custom("--land-t", draw(index))}
          />
        ))}
      </g>

      {/* ─── Origin dots ───
          Where the freight comes from. Always on: that part of the lane is
          known before a single tonne moves, so there is nothing to animate. */}
      <g className="loads-map__origins">
        {lanes.map((lane, index) => (
          <circle
            key={lane.loadId}
            className="loads-map__origin"
            data-index={index}
            cx={lane.from.x}
            cy={lane.from.y}
            r={3.5}
          />
        ))}
      </g>

      {/* ─── Destination dots ───
          Each lights in gold as its own route completes. */}
      <g className="loads-map__destinations">
        {lanes.map((lane, index) => (
          <g
            key={lane.loadId}
            className="loads-map__destination"
            data-index={index}
            style={custom("--land-t", draw(index))}
          >
            <circle
              className="loads-map__dest-halo"
              cx={lane.to.x}
              cy={lane.to.y}
              r={7}
            />
            <circle
              className="loads-map__dest-dot"
              cx={lane.to.x}
              cy={lane.to.y}
              r={4}
            />
          </g>
        ))}
      </g>

      {/* ─── Destination labels ───
          Delivery towns only. The origins are already named wherever the map
          sits alongside them (on Ch5 that was the chip row), and labelling both
          ends would double the words on a map this small. */}
      <g className="loads-map__labels">
        {lanes.map((lane, index) => (
          <text
            key={lane.loadId}
            className="loads-map__label"
            data-index={index}
            x={lane.to.x}
            y={lane.to.y}
            dx={lane.label.dx}
            dy={lane.label.dy}
            textAnchor={lane.label.anchor}
            style={custom("--land-t", draw(index))}
          >
            {lane.destination.toUpperCase()}
          </text>
        ))}
      </g>
    </svg>
  );
}
