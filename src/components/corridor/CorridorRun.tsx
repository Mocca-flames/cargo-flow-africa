"use client";

import { BOOTH, GATES, GATE_OFF, ROAD_HALF, ROUTE_D, TRACTOR, TRAILER } from "./config";
import { cameraFor, type CorridorVariant } from "./camera";
import { useCorridorAnimation } from "./useCorridorAnimation";
import { useReducedMotion } from "./useReducedMotion";
import { TractorArt } from "./art/TractorPlaceholder";
import { TrailerArt } from "./art/TrailerPlaceholder";
import { BeatPanels } from "./view/BeatPanels";
import { Hud } from "./view/Hud";
import { KickerPlate } from "./view/KickerPlate";
import { NightLights } from "./view/NightLights";
import { ProgressBar } from "./view/ProgressBar";
import { StaticCorridor } from "./view/StaticCorridor";
import "./CorridorCommon.css";

/** Boom arm and road marker share the carriageway width (2 × ROAD_HALF). */
const BOOM = { w: 44, h: ROAD_HALF * 2 };

/**
 * COMMON SCENE — markup + scroll wiring, shared by both variants.
 * CorridorSection renders <CorridorDesktop/> (≥768px) or <CorridorMobile/>
 * (≤767px); each of those picks up its CSS file and passes `variant` down
 * here. `variant` does two things: the `.corridor--x` root class the variant
 * CSS is scoped to, and the camera framing numbers (camera.ts).
 */
export default function CorridorRun({ variant }: { variant: CorridorVariant }) {
  const reduced = useReducedMotion();
  const camera = cameraFor(variant);
  const { rootRef, svgRef, worldRef, routeRef, horseRef, trailerRef, nightCameraRef, tractorLightsRef, trailerLightsRef } =
    useCorridorAnimation({ reduced, camera });

  if (reduced) return <StaticCorridor />;

  return (
    <section ref={rootRef} id="corridor-section" className={`corridor corridor--${variant}`} aria-labelledby="ch6-title" data-chapter="6">
      <h2 id="ch6-title" className="corridor__sr-only">Corridor &amp; Clearance</h2>
      <div className="corridor__stage">
        <svg ref={svgRef} className="corridor__world" aria-hidden="true" focusable="false">
          <g ref={worldRef}>
            <rect x={-40000} y={-40000} width={160000} height={90000} className="corridor__land" />
            <path ref={routeRef} d={ROUTE_D} className="corridor__road-bed" />
            <path d={ROUTE_D} className="corridor__road-line" />

            {/* Express Border Gateway — High visibility, grand gantry, clear status */}
            {GATES.map((g) => (
              <g key={g.id} className="corridor__gate" data-gate={g.id} data-state="ahead" data-at={g.at} data-off={GATE_OFF}>
                {/* Road surface stop bar & green proceed arrows */}
                <rect x={-30} y={-ROAD_HALF} width={60} height={ROAD_HALF * 2} className="corridor__stop-line" />
                <g className="corridor__pass-arrows">
                  <polygon points="120,-120 200,0 120,120 150,0" fill="#22c55e" />
                  <polygon points="280,-120 360,0 280,120 310,0" fill="#22c55e" />
                </g>

                {/* Roadside Control Booths on both sides */}
                <rect className="corridor__booth corridor__booth--left" x={-140} y={-(ROAD_HALF + 160)} width={280} height={140} rx={16} />
                <rect className="corridor__booth corridor__booth--right" x={-140} y={ROAD_HALF + 20} width={280} height={140} rx={16} />

                {/* Overhead Highway Gantry spanning both lanes */}
                <rect className="corridor__gantry-truss" x={-45} y={-(ROAD_HALF + 170)} width={90} height={(ROAD_HALF + 170) * 2} rx={10} />

                {/* Prominent Barrier Boom Arm with Warning Stripes */}
                <g className="corridor__boom">
                  <rect className="corridor__boom-bar" x={-35} y={-ROAD_HALF} width={70} height={ROAD_HALF * 2} rx={10} />
                  {[-300, -180, -60, 60, 180, 300].map((sy) => (
                    <rect key={sy} className="corridor__boom-stripe" x={-32} y={sy - 35} width={64} height={35} rx={4} />
                  ))}
                  <circle className="corridor__boom-light" cx={0} cy={ROAD_HALF - 30} r={24} />
                </g>

                {/* Overhead Sign & Status Badges */}
                <g data-upright>
                  {/* Overhead Gateway Plate */}
                  <rect className="corridor__gantry-plate" x={-580} y={-(ROAD_HALF + 240)} width={1160} height={110} rx={18} />
                  <text className="corridor__gantry-title" x={0} y={-(ROAD_HALF + 170)} textAnchor="middle">
                    BEITBRIDGE BORDER CONTROL · FAST-TRACK
                  </text>

                  {/* Verifying Tag */}
                  <g className="corridor__tag-hold">
                    <rect x={-360} y={ROAD_HALF + 50} width={720} height={140} rx={22} />
                    <text x={0} y={ROAD_HALF + 145} textAnchor="middle">CHECKPOINT · SCANNING</text>
                  </g>

                  {/* Cleared Tag */}
                  <g className="corridor__tag-clear">
                    <rect x={-520} y={ROAD_HALF + 40} width={1040} height={160} rx={24} />
                    <text x={0} y={ROAD_HALF + 148} textAnchor="middle">PRE-CLEARED · ALWAYS GREEN</text>
                  </g>
                </g>
              </g>
            ))}

            <g data-at={1} data-off={1600}>
              <rect x={-20} y={-ROAD_HALF} width={40} height={ROAD_HALF * 2} className="corridor__finish" />
              <g data-upright><text className="corridor__label" x={0} y={-480} textAnchor="middle">LUBUMBASHI</text></g>
            </g>

            {/* Both rigs hang off the kingpin pivot: the inner translate puts
                the art's pivot marker (cft-pivot / cfl-pivot) on that pivot. */}
            <g ref={horseRef}><g transform={`translate(${-TRACTOR.pivotX} ${-TRACTOR.pivotY})`}><TractorArt /></g></g>
            <g ref={trailerRef}><g transform={`translate(${-TRAILER.pivotX} ${-TRAILER.pivotY})`}><TrailerArt /></g></g>
          </g>
        </svg>

        <div className="corridor__tint" data-hud="tint" />
        <div className="corridor__night-tint" data-night-tint />
        <NightLights nightCameraRef={nightCameraRef} tractorLightsRef={tractorLightsRef} trailerLightsRef={trailerLightsRef} />
        <KickerPlate />

        <Hud />
        <BeatPanels />
        <ProgressBar />
      </div>
    </section>
  );
}
