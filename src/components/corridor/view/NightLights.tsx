import type { RefObject } from "react";

/**
 * Night-lights layer: a second, screen-blended SVG that floats ABOVE the
 * multiply tint (see CorridorCommon.css .corridor__night-*). The animation
 * copies the world camera transform onto it every frame and then drives
 * opacities by the night scalar `n` (NIGHT_KEYS in config.ts):
 *
 *   #nl-beam-l/r    headlight cones
 *   #nl-tail-l/r    tail lights (brighter when stopped)
 *   #nl-hazard-fl/fr amber flashers (slow blink, never strobe)
 *   #nl-booth-g1..3 gate booth glow, only while that gate is on HOLD
 *
 * Element ids here are a CONTRACT with useCorridorAnimation — rename in
 * both files together. Positions are in tractor-local coordinates because
 * the parent <g> carries the rig's camera; the light shapes themselves
 * live at the origin and are invisible until opacity > 0.
 */
export function NightLights({ nightLightsRef }: {
  /** The inner <g> that receives the camera transform each frame. */
  nightLightsRef: RefObject<SVGGElement | null>;
}) {
  return (
    <svg className="corridor__night-lights" aria-hidden="true" focusable="false">
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
        {/* Gate booth glow (one per GATES id) */}
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
  );
}
