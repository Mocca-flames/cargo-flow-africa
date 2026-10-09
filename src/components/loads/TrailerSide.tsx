/**
 * The flatdeck, side view — Ch5's desktop trailer.
 *
 * The supplied drawing, transcribed to JSX and tokenised: every hardcoded
 * `#12382F` becomes `currentColor`, which `.loads-trailer` sets from
 * `--color-ink`, so the drawing follows the palette rather than freezing one
 * hex into the markup. Fill opacities (0.15 / 0.4 / 1) are the drawing's own
 * tonal steps and stay literal.
 *
 * ViewBox is 1200×200. The deck beam is the horizontal bar at y=70..82
 * spanning x=20..1180 — the load plan's blocks sit on that edge, so the deck
 * is authored as a perfect rectangle with its top edge dead straight.
 *
 * No "use client": pure render, no refs, no hooks. Server component.
 */
export default function TrailerSide() {
  return (
    <svg
      className="loads-trailer"
      viewBox="0 0 1200 200"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Hazard stripe pattern — the deck's painted edges. */}
        <pattern
          id="haz-side"
          width="12"
          height="12"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <rect width="6" height="12" fill="currentColor" fillOpacity="0.4" />
        </pattern>

        {/* Wheel template: tyre, rim rings, hub, hubcap, 8 bolts. */}
        <g id="whl-side">
          <circle cx="0" cy="0" r="40" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="26" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="0" cy="0" r="20" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="10" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="4" fill="currentColor" fillOpacity="1" stroke="none" />
          <circle cx="14" cy="0" r="1.5" fill="currentColor" />
          <circle cx="-14" cy="0" r="1.5" fill="currentColor" />
          <circle cx="0" cy="14" r="1.5" fill="currentColor" />
          <circle cx="0" cy="-14" r="1.5" fill="currentColor" />
          <circle cx="9.9" cy="9.9" r="1.5" fill="currentColor" />
          <circle cx="-9.9" cy="-9.9" r="1.5" fill="currentColor" />
          <circle cx="9.9" cy="-9.9" r="1.5" fill="currentColor" />
          <circle cx="-9.9" cy="9.9" r="1.5" fill="currentColor" />
        </g>
      </defs>

      {/* Chassis beams & structure */}
      <g>
        <path
          d="M 20 82 L 1180 82 L 1180 95 L 850 95 L 800 115 L 20 115 Z"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M 20 115 L 800 115 L 850 95 L 1180 95"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 80 82 L 80 115 M 150 82 L 150 115 M 250 82 L 250 115 M 350 82 L 350 115 M 450 82 L 450 115 M 550 82 L 550 115 M 650 82 L 650 115 M 750 82 L 750 115 M 950 82 L 950 95 M 1050 82 L 1050 95 M 1150 82 L 1150 95"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
        />
        {/* Side underrun protection */}
        <line x1="380" y1="130" x2="480" y2="130" stroke="currentColor" strokeWidth="1.5" />
        <line x1="380" y1="145" x2="480" y2="145" stroke="currentColor" strokeWidth="1.5" />
        <rect x="390" y="115" width="4" height="30" fill="currentColor" />
        <rect x="466" y="115" width="4" height="30" fill="currentColor" />
      </g>

      {/* Rear bumper & light bar */}
      <g>
        <path d="M 28 82 L 28 145 L 24 145 L 24 82 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="18" y="143" width="16" height="12" rx="2" fill="currentColor" fillOpacity="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="20" y="112" width="6" height="20" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 28 110 L 45 90 M 28 135 L 50 115" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
      </g>

      {/* Continuous tri-axle mudguard */}
      <path
        d="M 70 170 L 70 150 A 50 50 0 0 1 167.5 140 A 50 50 0 0 1 262.5 140 A 50 50 0 0 1 360 150 L 360 170 L 356 170 L 356 150 A 46 46 0 0 0 262.5 136 A 46 46 0 0 0 167.5 136 A 46 46 0 0 0 74 150 L 74 170 Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Under-deck toolbox */}
      <g>
        <rect x="500" y="115" width="120" height="35" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <line x1="500" y1="125" x2="620" y2="125" stroke="currentColor" strokeWidth="1.5" />
        <rect x="530" y="128" width="12" height="6" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="578" y="128" width="12" height="6" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* Main landing gear (extended to ground y=190 for parking) */}
      <g>
        <line x1="704" y1="125" x2="745" y2="115" stroke="currentColor" strokeWidth="1.5" />
        <rect x="690" y="115" width="14" height="40" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="693" y="155" width="8" height="33" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <rect x="686" y="188" width="22" height="4" fill="currentColor" fillOpacity="1" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* Kingpin assembly & forward parked supports */}
      <g>
        <rect x="1040" y="95" width="80" height="4" fill="currentColor" fillOpacity="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1075" y="99" width="10" height="10" rx="1" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1147" y="95" width="10" height="93" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1135" y="95" width="10" height="93" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1130" y="188" width="32" height="4" fill="currentColor" fillOpacity="1" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* Rear wheels (tri-axle) */}
      <use href="#whl-side" x="120" y="150" />
      <use href="#whl-side" x="215" y="150" />
      <use href="#whl-side" x="310" y="150" />

      {/* Flat deck — deck-top edge dead straight at y=70 */}
      <g>
        <rect x="20" y="70" width="1160" height="12" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <rect x="20" y="70" width="1160" height="12" fill="url(#haz-side)" stroke="none" />
        <rect x="100" y="74" width="6" height="4" fill="currentColor" />
        <rect x="300" y="74" width="6" height="4" fill="currentColor" />
        <rect x="500" y="74" width="6" height="4" fill="currentColor" />
        <rect x="700" y="74" width="6" height="4" fill="currentColor" />
        <rect x="900" y="74" width="6" height="4" fill="currentColor" />
        <rect x="1100" y="74" width="6" height="4" fill="currentColor" />
        <line x1="20" y1="70" x2="1180" y2="70" stroke="currentColor" strokeWidth="2" />
      </g>
    </svg>
  );
}