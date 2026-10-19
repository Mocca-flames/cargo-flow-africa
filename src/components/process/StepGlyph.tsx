/**
 * The three step glyphs — flat stroke drawings, one per step, no images.
 *
 * Each is a 48×48 viewBox stroked in `currentColor` so the palette
 * comes from CSS (ink on canvas, gold on accent moments). Stroke
 * weight 2 with round caps/joins, matching the flat descriptive
 * register of the Loads drawings.
 *
 * TODO(art): these are schematic placeholders. Before sign-off, read
 * the Loads truck SVG and match its exact line weight/corner treatment
 * so both sections read as one drawing set.
 */

import type { ProcessStepId } from "@/data/process";

export type GlyphId = ProcessStepId;

type Props = {
  id: GlyphId;
  className?: string;
};

export default function StepGlyph({ id, className }: Props) {
  return (
    <svg
      className={["process__glyph", className].filter(Boolean).join(" ")}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {id === "send-spec" && (
        <>
          {/* The spec — a document, folded corner, two lines of copy. */}
          <rect x="13" y="5" width="15" height="20" rx="1.5" />
          <path d="M28 5v6h6" />
          <path d="M17.5 13h7" />
          <path d="M17.5 17.5h5" />
          {/* The hand-off — an arrow down into the slot dispatch reads from. */}
          <path d="M27 31v7" />
          <path d="M23.5 34.5l3.5 3.5 3.5-3.5" />
          <path d="M13 41h24" />
        </>
      )}

      {id === "plan-run" && (
        <>
          {/* The route — three nodes, one line. */}
          <path d="M7 10h34" strokeDasharray="3 3" />
          <circle cx="7" cy="10" r="2.5" />
          <circle cx="24" cy="10" r="2.5" />
          <circle cx="41" cy="10" r="2.5" />
          {/* The load — freight riding a flatdeck. */}
          <rect x="14" y="20" width="16" height="13" rx="1" />
          <path d="M6 33h36" />
          <path d="M8 33v5h4v-5M36 33v5h4v-5" />
        </>
      )}

      {id === "truck-rolls" && (
        <>
          {/* The rig — trailer, cab, wheels, and the road running under it. */}
          <rect x="4" y="22" width="22" height="10" rx="1" />
          <path d="M26 22h7l5 6v4h-12" />
          <circle cx="11" cy="36" r="3" />
          <circle cx="32" cy="36" r="3" />
          <path d="M2 43h44" />
          {/* Delivered — the confirmation tick. */}
          <path d="M31 12l4.5 4.5L43 9" />
        </>
      )}
    </svg>
  );
}
