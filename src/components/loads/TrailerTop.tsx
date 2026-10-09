/**
 * The flatdeck, top view, rotated vertical — Ch5's mobile trailer.
 *
 * The same trailer read from above, oriented so the deck's long axis runs down
 * the screen: kingpin and landing gear at the top (front), rear bumper at the
 * bottom. It is the same drawing discipline as `TrailerSide` — hardcoded hex
 * replaced with `currentColor`, tonal steps stay literal fill opacities — but
 * a genuinely different projection, so the load plan's blocks have to be laid
 * out as footprints inside the deck rather than stacked on its top edge.
 *
 * ViewBox is 240×1000. The deck rectangle is x=40..200, y=20..960, and it is
 * drawn last so it sits cleanly on top of everything behind it.
 *
 * No "use client": pure render, no refs, no hooks. Server component.
 */
export default function TrailerTop() {
  return (
    <svg
      className="loads-trailer"
      viewBox="0 0 240 1000"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Hazard stripe pattern — the deck's painted edges. */}
        <pattern
          id="haz-top"
          width="16"
          height="16"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <rect width="8" height="16" fill="currentColor" fillOpacity="0.4" />
        </pattern>

        {/* Top-view tire template: body plus three tread grooves. */}
        <g id="tire-top">
          <rect x="0" y="0" width="24" height="60" rx="4" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="15" x2="24" y2="15" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="0" y1="30" x2="24" y2="30" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
          <line x1="0" y1="45" x2="24" y2="45" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.4" />
        </g>
      </defs>

      {/* Drawn before the deck so the deck's rectangle stays pure. */}

      {/* Kingpin assembly & forward parked supports */}
      <g>
        <rect x="80" y="5" width="80" height="30" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <rect x="100" y="8" width="40" height="16" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="120" cy="16" r="4" fill="currentColor" fillOpacity="1" />
      </g>

      {/* Landing gear */}
      <g>
        <rect x="50" y="5" width="16" height="30" rx="2" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="174" y="5" width="16" height="30" rx="2" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* Continuous tri-axle mudguards */}
      <g>
        <path
          d="M 40 650 L 16 650 A 6 6 0 0 0 10 656 L 10 944 A 6 6 0 0 0 16 950 L 40 950 Z"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M 200 650 L 224 650 A 6 6 0 0 1 230 656 L 230 944 A 6 6 0 0 1 224 950 L 200 950 Z"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Rear wheels (tri-axle, both sides) */}
      <g>
        <use href="#tire-top" x="18" y="670" />
        <use href="#tire-top" x="18" y="770" />
        <use href="#tire-top" x="18" y="870" />
        <use href="#tire-top" x="198" y="670" />
        <use href="#tire-top" x="198" y="770" />
        <use href="#tire-top" x="198" y="870" />
      </g>

      {/* Rear bumper & light bar */}
      <g>
        <rect x="44" y="940" width="152" height="36" rx="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <rect x="52" y="964" width="36" height="8" rx="2" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="152" y="964" width="36" height="8" rx="2" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" />
        <rect x="105" y="964" width="30" height="10" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      </g>

      {/* Main flat deck, drawn last to sit perfectly on top */}
      <g>
        <rect x="40" y="20" width="160" height="940" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />

        {/* Subtle deck plank lines */}
        <g stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.15">
          <line x1="56" y1="20" x2="56" y2="960" />
          <line x1="72" y1="20" x2="72" y2="960" />
          <line x1="88" y1="20" x2="88" y2="960" />
          <line x1="104" y1="20" x2="104" y2="960" />
          <line x1="120" y1="20" x2="120" y2="960" />
          <line x1="136" y1="20" x2="136" y2="960" />
          <line x1="152" y1="20" x2="152" y2="960" />
          <line x1="168" y1="20" x2="168" y2="960" />
          <line x1="184" y1="20" x2="184" y2="960" />
        </g>

        {/* Hazard stripe edges */}
        <rect x="40" y="20" width="8" height="940" fill="url(#haz-top)" stroke="currentColor" strokeWidth="1.5" />
        <rect x="192" y="20" width="8" height="940" fill="url(#haz-top)" stroke="currentColor" strokeWidth="1.5" />
        <rect x="48" y="952" width="144" height="8" fill="url(#haz-top)" stroke="currentColor" strokeWidth="1.5" />
      </g>
    </svg>
  );
}