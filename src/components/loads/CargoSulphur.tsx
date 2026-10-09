/**
 * Three jumbo bags (FIBCs) under a tensioned strap — Ch5's freight for
 * `loadPlan`'s S1 (Durban, 8.2 t).
 *
 * The supplied drawing, transcribed to JSX and tokenised: every hardcoded
 * `#12382F` becomes `currentColor`, which `.loads-cargo` sets from
 * `--color-ink`. Fill opacities (0.15 / 0.4 / 1) are the drawing's own tonal
 * steps and stay literal.
 *
 * ViewBox is cropped tight to the freight — x 13..307, y 25..200 — so the box
 * matches the `cargo` extent in `data/loads.ts` exactly and the drawing fills
 * its slot with no letterboxing. The bottom edge (y=200) is the deck contact,
 * where the bags and ratchets rest.
 *
 * No "use client": pure render, no refs, no hooks. Server component.
 */
export default function CargoSulphur() {
  return (
    <svg
      className="loads-cargo"
      viewBox="13 25 294 175"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      {/* ─── Jumbo bags ───
          Two on the deck, one bridging them. */}
      <g
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <path d="M 40 200 L 150 200 C 165 190, 155 130, 145 115 C 120 110, 85 112, 75 115 C 65 130, 45 160, 40 200 Z" />
        <path d="M 170 200 L 280 200 C 275 160, 255 130, 245 115 C 235 112, 200 110, 175 115 C 165 130, 155 190, 170 200 Z" />
        <path d="M 105 115 C 130 125, 190 125, 215 115 C 225 95, 215 50, 205 28 C 185 25, 135 25, 115 28 C 105 50, 95 95, 105 115 Z" />
      </g>

      {/* ─── Creases / bulge folds ─── */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      >
        <path d="M 65 125 C 60 150, 60 180, 65 195" />
        <path d="M 125 118 C 130 150, 125 180, 120 195" />
        <path d="M 75 145 C 90 155, 110 150, 115 135" />
        <path d="M 195 118 C 190 150, 195 180, 200 195" />
        <path d="M 255 125 C 260 150, 260 180, 255 195" />
        <path d="M 205 135 C 210 150, 230 155, 245 145" />
        <path d="M 125 35 C 115 65, 115 95, 130 110" />
        <path d="M 195 35 C 205 65, 205 95, 190 110" />
        <path d="M 140 65 C 150 75, 170 75, 180 60" />
      </g>

      {/* ─── Lifting loops ───
          The top bag's are squashed sideways by the strap. */}
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M 85 114 C 75 95, 55 100, 65 120" />
        <path d="M 135 114 C 145 95, 165 100, 155 120" />
        <path d="M 185 114 C 175 95, 155 100, 165 120" />
        <path d="M 235 114 C 245 95, 265 100, 255 120" />
        <path d="M 125 28 C 115 15, 95 20, 105 35" />
        <path d="M 195 28 C 205 15, 225 20, 215 35" />
      </g>

      {/* ─── Securing strap ───
          Anchored to the deck at y=200, running up and over the stack. */}
      <g>
        <rect x="13" y="188" width="4" height="12" rx="1" fill="currentColor" />
        <rect x="303" y="188" width="4" height="12" rx="1" fill="currentColor" />
        <circle cx="15" cy="194" r="2" fill="currentColor" fillOpacity="0.4" />
        <circle cx="305" cy="194" r="2" fill="currentColor" fillOpacity="0.4" />
        <path
          d="M 15 188 L 105 80 L 115 28 L 205 28 L 215 80 L 305 188"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}