import type { Beat } from "../config";

/**
 * The story copy for one beat: kicker (e.g. "02 · Blockade") and a title.
 * Used by BOTH the animated panels (BeatPanels) and the reduced-motion
 * fallback (StaticCorridor), so copy changes here apply everywhere.
 *
 * Deliberately two lines and nothing else — the boom lifting, the queue, the
 * seal and the lights tell the rest. The panel is supporting cast, the truck
 * is the subject. To change a beat's wording, edit BEATS in config.ts.
 *
 * The dark-mode text tint is driven by the shared `--n` night variable set
 * on the section root each frame (see useCorridorAnimation).
 */
export function BeatCopy({ b }: { b: Beat }) {
  return (
    <>
      <p className="corridor__kicker">{b.kicker}</p>
      <h3 className="corridor__title">{b.title}</h3>
    </>
  );
}
