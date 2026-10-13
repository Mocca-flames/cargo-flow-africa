/**
 * The live stats card. Positioned by CSS only:
 *   desktop → right rail (CorridorDesktop.css)
 *   mobile  → full-width strip under the header, 2-column (CorridorMobile.css)
 *
 * The animation updates the VALUES via data-hud attributes — no React
 * re-renders happen during scroll. To add a new stat:
 *   1. add a <div> below with a `data-hud="yourkey"` on the <b>
 *   2. in useCorridorAnimation, query `[data-hud="yourkey"]` and setText it
 */
export function Hud() {
  return (
    <aside className="corridor__hud" aria-hidden="true">
      <div><span>Cargo on the line</span><b>R 2,000,000</b></div>
      <div><span>Last checkpoint</span><b data-hud="last">Durban</b></div>
      <div><span>Next gate</span><b data-hud="next">Beitbridge</b></div>
      <div><span>Remaining</span><b data-hud="km">2,900 km</b></div>
      <div><span>Delay exposure</span><b data-hud="delay">0 h</b></div>
    </aside>
  );
}
