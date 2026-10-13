/**
 * The 3px journey bar pinned to the bottom of the stage. The animation sets
 * `scaleX` on the inner <i> (data-hud="bar") from scroll progress 0..1.
 * Purely decorative — safe to restyle freely.
 */
export function ProgressBar() {
  return (
    <div className="corridor__bar" aria-hidden="true">
      <i data-hud="bar" />
    </div>
  );
}
