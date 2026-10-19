"use client";

import type { ChannelId } from "@/data/contact";

/**
 * Flat line glyphs for the three direct channels — hand-drawn strokes
 * matching the Process/Loads line weight (1.5px, round caps), vector +
 * type only, zero photography. Decorative: cards carry real text.
 */
export default function ChannelGlyph({ id }: { id: ChannelId }) {
  if (id === "email") {
    return (
      <svg
        className="contact__glyph"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="7" y="12" width="34" height="24" rx="2" />
        <path d="M8 14 L24 27 L40 14" />
        <circle cx="38" cy="32" r="6" fill="var(--color-canvas-alt)" />
        <path d="M36 32 h4 M38 30 v4" strokeWidth="1.25" />
      </svg>
    );
  }
  if (id === "whatsapp") {
    return (
      <svg
        className="contact__glyph"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M24 8c-8.8 0-16 7-16 15.7 0 2.9.8 5.6 2.2 8L8 40l8.6-2.2c2.3 1.3 5 2 7.4 2 8.8 0 16-7 16-15.7S32.8 8 24 8Z" />
        <path d="M18.5 18.5c.5 4.5 4.5 9.5 9.5 10.5l2-2.5 3.5 1.5c-.5 2-1.5 3-3 3-6 0-12-6-12.5-12.5 0-1 .5-1.5 1-2.5l2 1.5-1.5 1Z" strokeWidth="1.25" />
      </svg>
    );
  }
  return (
    <svg
      className="contact__glyph"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 8h6l3 8-4 3c1.5 3.5 4 6 7.5 7.5l3-4 8 3v6c0 1-1 2-2 2C22 33.5 14.5 26 14.5 12.5c0-2.5 0-3.5-.5-4.5Z" />
      <path d="M30 8h8M30 13h5" strokeWidth="1.25" />
    </svg>
  );
}
