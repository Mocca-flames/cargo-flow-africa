import type { RefObject } from "react";
import { BOOTH, GATES, GATE_OFF } from "../config";

/**
 * Night-lights layer: a second, screen-blended SVG that floats ABOVE the
 * multiply tint (see CorridorCommon.css .corridor__night-*). The animation
 * stacks transforms on the three groups in here, so shapes are authored in
 * the coordinate space that is most convenient for them:
 *
 *   [nightCameraRef]   the world camera (identical to the world <g>)
 *     [tractorLightsRef]  tractor chain → tractor viewBox coords (0..1200 × 0..300)
 *     [trailerLightsRef]  trailer chain → trailer viewBox coords (0..1400 × 0..300)
 *     [data-at] groups     route placement → gate-local coords (see config BOOTH)
 *
 * The animation drives opacities by the night scalar `n` (NIGHT_KEYS):
 *
 *   #nl-beam-l/r    headlight cones
 *   #nl-tail-tl/tr  trailer tail lights
 *   #nl-hazard-fl/fr amber flashers (slow blink, never strobe)
 *   #nl-booth-g1..3 gate booth glow, only while that gate is on HOLD
 *
 * Element ids here are a CONTRACT with useCorridorAnimation — rename in
 * both files together.
 */
export function NightLights({
  nightCameraRef,
  tractorLightsRef,
  trailerLightsRef,
}: {
  /** The <g> that receives the world camera transform each frame. */
  nightCameraRef: RefObject<SVGGElement | null>;
  /** The <g> that receives camera + tractor chain (tractor viewBox coords). */
  tractorLightsRef: RefObject<SVGGElement | null>;
  /** The <g> that receives camera + trailer chain (trailer viewBox coords). */
  trailerLightsRef: RefObject<SVGGElement | null>;
}) {
  return (
    <svg className="corridor__night-lights" aria-hidden="true" focusable="false">
      <g ref={nightCameraRef}>
        {/* Tractor — headlight cones + hazard flashers (viewBox 1200×300).
            Its rear lights sit under the trailer, so the trailer group below
            owns everything you can actually see behind the rig. */}
        <g ref={tractorLightsRef}>
          <g id="nl-beam-l" opacity="0">
            <polygon points="676,46 1500,-240 1500,220" fill="url(#nl-headlight)" />
          </g>
          <g id="nl-beam-r" opacity="0">
            <polygon points="676,254 1500,80 1500,540" fill="url(#nl-headlight)" />
          </g>
          <circle id="nl-hazard-fl" cx="677" cy="30" r="7" fill="#F2A91B" opacity="0" />
          <circle id="nl-hazard-fr" cx="677" cy="270" r="7" fill="#F2A91B" opacity="0" />
        </g>

        {/* Trailer — rear/brake lights (viewBox 1400×300). */}
        <g ref={trailerLightsRef}>
          <circle id="nl-tail-tl" cx="32" cy="60" r="13" fill="#FF5A4A" opacity="0" />
          <circle id="nl-tail-tr" cx="32" cy="230" r="13" fill="#FF5A4A" opacity="0" />
        </g>

        {/* Gate booth glow (one per GATES id) — placed on the route like the
            booths themselves, so each glow sits on its own gate. */}
        {GATES.map((g) => (
          <g key={g.id} data-at={g.at} data-off={GATE_OFF}>
            <rect
              id={`nl-booth-${g.id}`}
              x={-BOOTH.glowR}
              y={BOOTH.cy - BOOTH.glowR}
              width={BOOTH.glowR * 2}
              height={BOOTH.glowR * 2}
              rx={BOOTH.glowR}
              fill="url(#nl-booth-glow)"
              opacity="0"
            />
          </g>
        ))}
      </g>
      <defs>
        <radialGradient id="nl-headlight" cx="0" cy="0.5" r="1">
          <stop offset="0%" stopColor="#fffbe6" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#fffbe6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#fffbe6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nl-booth-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fff8e0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#fff8e0" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
