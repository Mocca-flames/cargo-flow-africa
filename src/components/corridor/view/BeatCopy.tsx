import type { Beat } from "../config";

/**
 * The story copy for one beat: kicker (e.g. "02 · Strike / blockade"),
 * title, and the three-column "what happened / what we did / what you saw"
 * triad. Used by BOTH the animated panels (BeatPanels) and the reduced-motion
 * fallback (StaticCorridor), so copy changes here apply everywhere.
 *
 * To change a beat's wording, edit BEATS in config.ts — not this file.
 * The dark-mode text tint is driven by the shared `--n` night variable set
 * on the section root each frame (see useCorridorAnimation).
 */
export function BeatCopy({ b }: { b: Beat }) {
  return (
    <>
      <p className="corridor__kicker">{b.kicker}</p>
      <h3 className="corridor__title">{b.title}</h3>
      <dl className="corridor__triad">
        <div><dt>What happened</dt><dd>{b.happened}</dd></div>
        <div><dt>What we did</dt><dd>{b.did}</dd></div>
        <div><dt>What you saw</dt><dd>{b.saw}</dd></div>
      </dl>
    </>
  );
}
