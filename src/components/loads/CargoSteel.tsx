/**
 * Two steel coils in timber cradles, strapped down — Ch5's freight for
 * `loadPlan`'s S2 (Saldanha, 11.5 t).
 *
 * The supplied drawing, transcribed to JSX and tokenised: every hardcoded
 * `#12382F` becomes `currentColor`, which `.loads-cargo` sets from
 * `--color-ink`, so the drawing follows the palette instead of freezing one
 * hex into the markup. Fill opacities (0.15 / 0.4 / 1) are the drawing's own
 * tonal steps and stay literal.
 *
 * ViewBox is cropped tight to the freight — x 8..332, y 20..150 — so the box
 * matches the `cargo` extent in `data/loads.ts` exactly and the drawing fills
 * its slot with no letterboxing. The bottom edge (y=150) is the deck contact:
 * the cradle bases sit at y=140..150 and the ratchets at y=138..150. The
 * `bore-*` masks are namespaced so this can render beside the other cargo
 * drawings without colliding.
 *
 * No "use client": pure render, no refs, no hooks. Server component.
 */
export default function CargoSteel() {
  return (
    <svg
      className="loads-cargo"
      viewBox="8 20 324 130"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Masks to cut the bore out of each coil body. */}
        <mask id="cargo-steel-bore-1">
          <rect width="340" height="150" fill="white" />
          <circle cx="85" cy="80" r="16" fill="black" />
        </mask>
        <mask id="cargo-steel-bore-2">
          <rect width="340" height="150" fill="white" />
          <circle cx="255" cy="80" r="16" fill="black" />
        </mask>
      </defs>

      {/* ─── Coil 1 ─── */}
      <g>
        {/* Timber cradle base */}
        <rect x="25" y="140" width="120" height="10" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        {/* Timber chocks */}
        <path d="M 35 140 L 35 120 L 40 120 L 65 140 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M 135 140 L 135 120 L 130 120 L 105 140 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Coil body, bored */}
        <circle cx="85" cy="80" r="60" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" mask="url(#cargo-steel-bore-1)" />
        <circle cx="85" cy="80" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* Concentric steel wraps */}
        <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
          <circle cx="85" cy="80" r="54" />
          <circle cx="85" cy="80" r="48" />
          <circle cx="85" cy="80" r="42" />
          <circle cx="85" cy="80" r="36" />
          <circle cx="85" cy="80" r="30" />
          <circle cx="85" cy="80" r="24" />
        </g>
        {/* Radial securing bands */}
        <g stroke="currentColor" strokeWidth="2">
          <line x1="85" y1="20" x2="85" y2="64" />
          <line x1="85" y1="96" x2="85" y2="140" />
          <line x1="25" y1="80" x2="69" y2="80" />
          <line x1="101" y1="80" x2="145" y2="80" />
        </g>
      </g>

      {/* ─── Coil 1 tie-down ─── */}
      <g>
        <path d="M 10 150 L 31.3 111 A 62 62 0 0 1 138.7 111 L 160 150" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="138" width="4" height="12" rx="1" fill="currentColor" />
        <rect x="158" y="138" width="4" height="12" rx="1" fill="currentColor" />
        <circle cx="10" cy="144" r="2" fill="currentColor" fillOpacity="0.4" />
        <circle cx="160" cy="144" r="2" fill="currentColor" fillOpacity="0.4" />
      </g>

      {/* ─── Coil 2 ─── */}
      <g>
        <rect x="195" y="140" width="120" height="10" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
        <path d="M 205 140 L 205 120 L 210 120 L 235 140 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M 305 140 L 305 120 L 300 120 L 275 140 Z" fill="currentColor" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="255" cy="80" r="60" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" mask="url(#cargo-steel-bore-2)" />
        <circle cx="255" cy="80" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4">
          <circle cx="255" cy="80" r="54" />
          <circle cx="255" cy="80" r="48" />
          <circle cx="255" cy="80" r="42" />
          <circle cx="255" cy="80" r="36" />
          <circle cx="255" cy="80" r="30" />
          <circle cx="255" cy="80" r="24" />
        </g>
        <g stroke="currentColor" strokeWidth="2">
          <line x1="255" y1="20" x2="255" y2="64" />
          <line x1="255" y1="96" x2="255" y2="140" />
          <line x1="195" y1="80" x2="239" y2="80" />
          <line x1="271" y1="80" x2="315" y2="80" />
        </g>
      </g>

      {/* ─── Coil 2 tie-down ─── */}
      <g>
        <path d="M 180 150 L 201.3 111 A 62 62 0 0 1 308.7 111 L 330 150" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="178" y="138" width="4" height="12" rx="1" fill="currentColor" />
        <rect x="328" y="138" width="4" height="12" rx="1" fill="currentColor" />
        <circle cx="180" cy="144" r="2" fill="currentColor" fillOpacity="0.4" />
        <circle cx="330" cy="144" r="2" fill="currentColor" fillOpacity="0.4" />
      </g>
    </svg>
  );
}