// Frame: viewBox 0 0 1500 300, faces +x, kingpin pivot (1300,150). Swap this whole <g> for the Gemini SVG.
import { Tyre } from "./Tyre";

export function TrailerArt() {
  return (
    <g id="cfl-root">
      <g id="cfl-shadow">
        <rect x={50} y={40} width={1360} height={250} rx={14} fill="#000" opacity={0.2} />
      </g>
      {[190, 290, 390].map((x, i) => (
        <g key={x}>
          <Tyre id={`cfl-wheel-l${i + 1}`} cx={x} cy={33} dual={34} />
          <Tyre id={`cfl-wheel-r${i + 1}`} cx={x} cy={267} dual={-34} />
        </g>
      ))}
      <g id="cfl-deck">
        <rect x={40} y={25} width={1360} height={250} rx={8} fill="#2a3633" />
        <rect x={40} y={25} width={1360} height={8} fill="var(--cf-gold,#D9A441)" />
        <rect x={40} y={267} width={1360} height={8} fill="var(--cf-gold,#D9A441)" />
      </g>
      <g id="cfl-load">
        <rect x={260} y={45} width={940} height={210} rx={18} fill="var(--cf-green,#14392F)" />
        {[330, 460, 590, 720, 850, 980, 1110].map((x) => (
          <rect key={x} x={x} y={45} width={10} height={210} fill="var(--cf-gold,#D9A441)" opacity={0.85} />
        ))}
      </g>
      <g id="cfl-landing-gear-down">
        <rect x={990} y={4} width={24} height={18} fill="#6d767a" />
        <rect x={990} y={278} width={24} height={18} fill="#6d767a" />
      </g>
      <circle id="cfl-pivot" cx={1300} cy={150} r={7} fill="var(--cf-gold,#D9A441)" />
    </g>
  );
}
