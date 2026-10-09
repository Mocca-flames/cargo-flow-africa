import type { FC } from "react";
import type { CommoditySceneId } from "@/data/commodities";

/**
 * Four blueprint micro-scenes — one per commodity card. Cheap SVG in
 * EngineRig's stroke language (1.5px ink, gold accent, dashed guides),
 * one gold accent per scene, no photos. The beating/idle loop names
 * come from `.scene--<id>` in ProofCommon.css; timing lives there too,
 * so the JSX stays free of inline animation.
 */

function PourScene() {
  return (
    <>
      <line className="scene__ground" x1="12" y1="124" x2="248" y2="124" />
      <path className="scene__body" d="M100 14 H152 L143 42 H109 Z" />
      <rect className="scene__line" x="117" y="42" width="16" height="9" />
      <line className="scene__ext" x1="84" y1="90" x2="176" y2="90" />
      <path
        className="scene__accent scene__beat scene__beat--pile"
        d="M92 124 Q130 84 168 124 Z"
      />
      <circle className="scene__dot scene__beat scene__delay-1" cx="124" cy="100" r="4.5" />
      <circle className="scene__dot scene__beat scene__delay-2" cx="137" cy="97" r="4.5" />
      <circle className="scene__dot scene__beat scene__delay-3" cx="130" cy="91" r="4.5" />
      <circle className="scene__dot scene__idle scene__delay-1" cx="116" cy="107" r="3.5" />
      <circle className="scene__dot scene__idle scene__delay-3" cx="146" cy="104" r="3.5" />
    </>
  );
}

function StackScene() {
  return (
    <>
      <line className="scene__ground" x1="12" y1="124" x2="248" y2="124" />
      <rect className="scene__body" x="36" y="104" width="188" height="12" />
      <line className="scene__line" x1="64" y1="116" x2="64" y2="124" />
      <line className="scene__line" x1="196" y1="116" x2="196" y2="124" />
      <rect
        className="scene__body scene__beat scene__delay-1"
        x="80"
        y="95"
        width="88"
        height="9"
        rx="1.5"
      />
      <rect
        className="scene__body scene__beat scene__delay-2"
        x="88"
        y="86"
        width="88"
        height="9"
        rx="1.5"
      />
      <rect
        className="scene__accent scene__beat scene__delay-3"
        x="96"
        y="77"
        width="88"
        height="9"
        rx="1.5"
      />
      <line className="scene__ext scene__idle scene__delay-1" x1="104" y1="74" x2="104" y2="104" />
      <line className="scene__ext scene__idle scene__delay-2" x1="152" y1="74" x2="152" y2="104" />
    </>
  );
}

function DropScene() {
  return (
    <>
      <line className="scene__ground" x1="12" y1="124" x2="248" y2="124" />
      <rect className="scene__body" x="78" y="114" width="104" height="10" />
      <rect
        className="scene__body scene__beat scene__delay-1"
        x="82"
        y="90"
        width="36"
        height="24"
        rx="4"
      />
      <rect
        className="scene__body scene__beat scene__delay-2"
        x="122"
        y="90"
        width="36"
        height="24"
        rx="4"
      />
      <rect
        className="scene__body scene__beat scene__delay-3"
        x="102"
        y="66"
        width="36"
        height="24"
        rx="4"
      />
      <rect
        className="scene__accent scene__idle scene__delay-3"
        x="114"
        y="74"
        width="12"
        height="8"
        rx="1.5"
      />
    </>
  );
}

function RampScene() {
  return (
    <>
      <line className="scene__ground" x1="12" y1="124" x2="248" y2="124" />
      <line className="scene__rail" x1="56" y1="124" x2="110" y2="96" />
      <line className="scene__ext" x1="46" y1="130" x2="112" y2="96" />
      <rect className="scene__body" x="108" y="94" width="116" height="11" />
      <circle className="scene__body" cx="134" cy="116" r="8" />
      <circle className="scene__body" cx="204" cy="116" r="8" />
      <g className="scene__beat">
        <g className="scene__idle">
          <rect className="scene__accent" x="148" y="64" width="46" height="30" rx="2" />
          <line className="scene__line" x1="156" y1="72" x2="186" y2="72" />
        </g>
      </g>
    </>
  );
}

const SCENES: Record<CommoditySceneId, FC> = {
  pour: PourScene,
  stack: StackScene,
  drop: DropScene,
  ramp: RampScene,
};

export default function CommodityScene({ scene }: { scene: CommoditySceneId }) {
  const Scene = SCENES[scene];
  return (
    <svg
      className={`scene scene--${scene}`}
      viewBox="0 0 260 150"
      aria-hidden="true"
      focusable="false"
    >
      <Scene />
    </svg>
  );
}
