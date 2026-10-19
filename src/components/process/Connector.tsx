/**
 * The connector — the dashed gold rule that draws itself between steps.
 *
 * A plain div, not SVG: the reveal is a CSS `background-size` grow
 * (0 → 100% of a repeating gradient), which draws a DASHED line on
 * truthfully; an SVG stroke-dashoffset on a dash pattern only slides
 * the dashes, never reveals the line.
 *
 * `orientation` flips the direction of the reveal, matching the two
 * drawings: horizontal for the desktop row, vertical for the mobile
 * stack. The line itself never appears without JS-less rendering —
 * both start and end states are a fully drawn line (see
 * ProcessCommon.css: only the `--armed` class introduces the pre-state,
 * and the entrance finishes at a drawn line).
 */

type Props = {
  orientation?: "horizontal" | "vertical";
  className?: string;
};

export default function Connector({
  orientation = "horizontal",
  className,
}: Props) {
  return (
    <span
      aria-hidden="true"
      data-orientation={orientation}
      className={["process__connector", className].filter(Boolean).join(" ")}
    />
  );
}
