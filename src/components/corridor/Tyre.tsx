// Placeholder tyre honouring the art contract: group has data-cx/data-cy, tyre has a `.tread` child
// (dashed stroke) whose stroke-dashoffset the rig animates. Real SVGs only need to keep that shape.
export function Tyre({ id, cx, cy, dual = 0 }: { id: string; cx: number; cy: number; dual?: number }) {
  const rows = dual ? [cy, cy + dual] : [cy];
  return (
    <g id={id} data-cx={cx} data-cy={cy}>
      {rows.map((y) => (
        <rect key={y} x={cx - 52} y={y - 15.5} width={104} height={31} rx={9} fill="var(--cf-tyre,#15171A)" />
      ))}
      <g className="tread" stroke="#3b4247" strokeWidth={20} strokeDasharray="7 9" fill="none">
        {rows.map((y) => (
          <line key={y} x1={cx - 46} y1={y} x2={cx + 46} y2={y} />
        ))}
      </g>
    </g>
  );
}
