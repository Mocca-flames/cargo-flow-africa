/**
 * A cross-stacked pallet of fertiliser sacks — Ch5's freight for
 * `loadPlan`'s S3 (Newcastle, 6.0 t).
 *
 * The supplied drawing, transcribed to JSX and tokenised: every hardcoded
 * `#12382F` becomes `currentColor`, which `.loads-cargo` sets from
 * `--color-ink`. Fill opacities (0.15 / 0.4 / 1) are the drawing's own tonal
 * steps and stay literal.
 *
 * ViewBox is cropped tight to the freight — x 25..295, y 46..150 — so the box
 * matches the `cargo` extent in `data/loads.ts` exactly and the drawing fills
 * its slot with no letterboxing. The bottom edge (y=150) is the deck contact,
 * where the pallet's bottom boards rest.
 *
 * No "use client": pure render, no refs, no hooks. Server component.
 */
export default function CargoFertiliser() {
  return (
    <svg
      className="loads-cargo"
      viewBox="25 46 270 104"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      {/* ─── Pallet ───
          Top deck board, three blocks, three bottom boards. */}
      <g
        fill="currentColor"
        fillOpacity="0.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <rect x="82" y="136" width="156" height="4" />
        <rect x="87" y="140" width="20" height="6" />
        <rect x="150" y="140" width="20" height="6" />
        <rect x="213" y="140" width="20" height="6" />
        <rect x="82" y="146" width="30" height="4" />
        <rect x="145" y="146" width="30" height="4" />
        <rect x="208" y="146" width="30" height="4" />
      </g>

      {/* ─── Sack stack ───
          Five rows, alternating cross-stacked the way a real stack is built. */}
      <g fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5">
        <rect x="85" y="118" width="50" height="18" rx="4" />
        <rect x="135" y="118" width="50" height="18" rx="4" />
        <rect x="185" y="118" width="50" height="18" rx="4" />

        <rect x="85" y="100" width="25" height="18" rx="4" />
        <rect x="110" y="100" width="50" height="18" rx="4" />
        <rect x="160" y="100" width="50" height="18" rx="4" />
        <rect x="210" y="100" width="25" height="18" rx="4" />

        <rect x="85" y="82" width="50" height="18" rx="4" />
        <rect x="135" y="82" width="50" height="18" rx="4" />
        <rect x="185" y="82" width="50" height="18" rx="4" />

        <rect x="85" y="64" width="25" height="18" rx="4" />
        <rect x="110" y="64" width="50" height="18" rx="4" />
        <rect x="160" y="64" width="50" height="18" rx="4" />
        <rect x="210" y="64" width="25" height="18" rx="4" />

        <rect x="85" y="46" width="50" height="18" rx="4" />
        <rect x="135" y="46" width="50" height="18" rx="4" />
        <rect x="185" y="46" width="50" height="18" rx="4" />
      </g>

      {/* ─── Sack creases ───
          Organic texture over the rigid blocks. */}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.4"
      >
        <path d="M 95 127 C 105 125, 115 129, 125 127" />
        <path d="M 145 127 C 155 129, 165 125, 175 127" />
        <path d="M 195 126 C 205 128, 215 128, 225 126" />
        <path d="M 120 109 C 130 111, 140 107, 150 109" />
        <path d="M 170 109 C 180 107, 190 111, 200 109" />
        <path d="M 95 91 C 105 93, 115 89, 125 91" />
        <path d="M 145 91 C 155 89, 165 93, 175 91" />
        <path d="M 195 91 C 205 93, 215 89, 225 91" />
        <path d="M 120 73 C 130 71, 140 75, 150 73" />
        <path d="M 170 73 C 180 75, 190 71, 200 73" />
        <path d="M 95 55 C 105 53, 115 57, 125 55" />
        <path d="M 145 55 C 155 57, 165 53, 175 55" />
        <path d="M 195 55 C 205 53, 215 57, 225 55" />
      </g>

      {/* ─── Securing strap ───
          Ratcheted to the deck at y=150, wrapped tight over the stack top. */}
      <g>
        <path
          d="M 27 150 L 83 49 C 85 46, 88 46, 90 46 L 230 46 C 232 46, 235 46, 237 49 L 293 150"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <rect x="25" y="138" width="4" height="12" rx="1" fill="currentColor" />
        <rect x="291" y="138" width="4" height="12" rx="1" fill="currentColor" />
        <circle cx="27" cy="144" r="2" fill="currentColor" fillOpacity="0.4" />
        <circle cx="293" cy="144" r="2" fill="currentColor" fillOpacity="0.4" />
      </g>
    </svg>
  );
}