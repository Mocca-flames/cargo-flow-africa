/**
 * The floating "06 · Corridor & Clearance" chapter plate, centred above the
 * stage. Static — the gold tint responds to the shared `--n` night variable
 * via color-mix in CorridorCommon.css.
 */
export function KickerPlate() {
  return (
    <div className="corridor__kicker-plate" aria-hidden="true">
      <span>06</span> Corridor &amp; Clearance
    </div>
  );
}
