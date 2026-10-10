// Frame: viewBox 0 0 720 300, faces +x, fifth-wheel pivot (275,150). Swap this whole <g> for the Gemini SVG.
import { Tyre } from "./Tyre";

export function TractorArt() {
  return (
    <g id="cft-root">
      <g id="cft-shadow">
        <rect x={70} y={40} width={620} height={250} rx={30} fill="#000" opacity={0.2} />
      </g>
      <Tyre id="cft-wheel-drive-l1" cx={200} cy={41} dual={34} />
      <Tyre id="cft-wheel-drive-l2" cx={320} cy={41} dual={34} />
      <Tyre id="cft-wheel-drive-r1" cx={200} cy={259} dual={-34} />
      <Tyre id="cft-wheel-drive-r2" cx={320} cy={259} dual={-34} />
      <Tyre id="cft-wheel-fl" cx={560} cy={45} />
      <Tyre id="cft-wheel-fr" cx={560} cy={255} />
      <g id="cft-chassis">
        <rect x={60} y={70} width={430} height={160} rx={8} fill="var(--cf-charcoal,#1E2326)" />
      </g>
      <g id="cft-fuel-tanks">
        <rect x={340} y={34} width={110} height={34} rx={17} fill="var(--cf-steel,#9AA3A6)" />
        <rect x={340} y={232} width={110} height={34} rx={17} fill="var(--cf-steel,#9AA3A6)" />
      </g>
      <g id="cft-fifth-wheel">
        <circle cx={275} cy={150} r={52} fill="#2d3438" />
      </g>
      <g id="cft-cab">
        <rect x={470} y={35} width={210} height={230} rx={26} fill="var(--cf-green,#14392F)" />
        <rect x={470} y={146} width={210} height={8} fill="var(--cf-gold,#D9A441)" />
        <rect x={648} y={52} width={26} height={196} rx={10} fill="var(--cf-glass,#5E7479)" />
      </g>
      <circle id="cft-pivot" cx={275} cy={150} r={7} fill="var(--cf-gold,#D9A441)" />
    </g>
  );
}
