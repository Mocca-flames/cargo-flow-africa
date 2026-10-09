import type { EngineAsset } from "./engineAssets";

/**
 * The fleet has no photography yet, so the image slot is filled by a
 * side-elevation schematic rather than a blank block.
 *
 * Everything is dimensionally real: 28px = 1 metre, every elevation is
 * measured up from the ground line. Trailer length, loading height and
 * axle spread therefore compare honestly between assets — the drawing
 * and the spec panel cannot drift apart, because they share engineAssets.
 *
 * When photography lands, replace the <svg> body with <img src={...}/>
 * and keep the frame; keep `[TBC PHOTO]` until then.
 */
const SCALE = 28; // px per metre
const GROUND = 180; // y of the ground line
const VIEW_W = 760;
const VIEW_H = 220;

const DECK_FRONT = 258; // x where every trailer bed begins
const DECK_THICK = 6;
const WHEEL_R = 14.5;
const WHEEL_CY = GROUND - WHEEL_R;

const CAB_X = 44;
const CAB_W = 104;
const NECK_LEN = 106; // lowbed gooseneck + step length, px
const RAIL_START = 160; // clears the cab, meets the fifth wheel
const COMPACT_VIEW = "20 60 690 130"; // keeps the mirror, drops the dims

const xAt = (metres: number) => 40 + metres * SCALE;
const yAt = (metres: number) => GROUND - metres * SCALE;

export type RigDetail = "full" | "compact";

function Wheel({ cx }: { cx: number }) {
  return (
    <g>
      <circle className="engine-rig__tyre" cx={cx} cy={WHEEL_CY} r={WHEEL_R} />
      <circle className="engine-rig__hub" cx={cx} cy={WHEEL_CY} r={5} />
    </g>
  );
}

function Tractor() {
  const cabTop = yAt(3.7);
  const cabBase = yAt(0.14);
  return (
    <g>
      <rect
        className="engine-rig__body"
        x={CAB_X}
        y={cabTop}
        width={CAB_W}
        height={cabBase - cabTop}
      />
      {/* roof deflector */}
      <path
        className="engine-rig__body"
        d={`M${CAB_X} ${yAt(3.7)} L${CAB_X + CAB_W} ${yAt(3.7)} L${
          CAB_X + CAB_W + 8
        } ${yAt(3.98)} L${CAB_X + 6} ${yAt(3.98)} Z`}
      />
      {/* windscreen */}
      <path
        className="engine-rig__glass"
        d={`M${CAB_X + 8} ${yAt(2.95)} L${CAB_X + 68} ${yAt(2.95)} L${
          CAB_X + 60
        } ${yAt(2.1)} L${CAB_X + 8} ${yAt(2.1)} Z`}
      />
      {/* door seam */}
      <line
        className="engine-rig__line"
        x1={CAB_X + 78}
        y1={yAt(3.55)}
        x2={CAB_X + 78}
        y2={yAt(0.3)}
      />
      {/* mirror */}
      <line className="engine-rig__line" x1={CAB_X + 4} y1={yAt(2.8)} x2={32} y2={yAt(2.8)} />
      <rect className="engine-rig__body" x={24} y={yAt(3.05)} width={9} height={yAt(2.5) - yAt(3.05)} />
      {/* grille / lamp / bumper */}
      <rect
        className="engine-rig__detail-fill"
        x={CAB_X + 2}
        y={yAt(1.85)}
        width={7}
        height={yAt(0.85) - yAt(1.85)}
      />
      <rect className="engine-rig__accent" x={CAB_X + 1} y={yAt(0.78)} width={10} height={9} />
      <rect className="engine-rig__body" x={40} y={yAt(0.32)} width={16} height={yAt(0) - yAt(0.32)} />
      {/* fifth wheel */}
      <rect
        className="engine-rig__detail-fill"
        x={xAt(4.3)}
        y={yAt(1.15)}
        width={xAt(5.7) - xAt(4.3)}
        height={4}
      />
      <Wheel cx={xAt(2)} />
      <Wheel cx={xAt(5.4)} />
      <Wheel cx={xAt(6.5)} />
    </g>
  );
}

function ChassisRail({ rear, deckY }: { rear: number; deckY: number }) {
  const lowbed = deckY > yAt(1.1);

  /* Frame rail runs behind the wheels, so it is drawn first and reads as
     the thing the axles hang from. Non-lowbed keeps one level; a lowbed
     steps down at the gooseneck rather than floating below it. */
  if (!lowbed) {
    return (
      <rect
        className="engine-rig__detail-fill"
        x={RAIL_START}
        y={yAt(1.1)}
        width={rear + 8 - RAIL_START}
        height={7}
      />
    );
  }

  const step = DECK_FRONT + NECK_LEN;
  return (
    <g>
      <rect className="engine-rig__detail-fill" x={RAIL_START} y={yAt(1.1)} width={step - RAIL_START} height={7} />
      <rect
        className="engine-rig__detail-fill"
        x={step - 10}
        y={deckY + DECK_THICK}
        width={rear - step + 10}
        height={5}
      />
    </g>
  );
}

function Bogie({ rear }: { rear: number }) {
  return (
    <g>
      {[1.05, 1.95, 2.85].map((m) => (
        <Wheel key={m} cx={rear - m * SCALE} />
      ))}
    </g>
  );
}

function RearFace({ rear, deckY }: { rear: number; deckY: number }) {
  return (
    <rect className="engine-rig__accent" x={rear} y={deckY} width={5} height={yAt(0.8) - deckY} />
  );
}

function Trailer({ asset, rear, deckY }: { asset: EngineAsset; rear: number; deckY: number }) {
  const length = rear - DECK_FRONT;

  switch (asset.id) {
    case "side-loader": {
      const postTop = yAt(2.45);
      return (
        <g>
          <rect className="engine-rig__body" x={DECK_FRONT} y={deckY} width={length} height={DECK_THICK} />
          {[0.07, 0.29, 0.51, 0.73].map((f) => (
            <rect
              key={f}
              className="engine-rig__body"
              x={DECK_FRONT + length * f}
              y={postTop}
              width={4}
              height={deckY - postTop}
            />
          ))}
          <rect
            className="engine-rig__detail-fill"
            x={rear - 50}
            y={deckY + DECK_THICK}
            width={50}
            height={7}
          />
          <path
            className="engine-rig__accent"
            d={`M${rear} ${deckY} L${rear + 38} ${yAt(0.5)} L${rear + 38} ${GROUND}`}
          />
          <RearFace rear={rear} deckY={deckY} />
        </g>
      );
    }

    case "flatdeck": {
      return (
        <g>
          <rect className="engine-rig__body" x={DECK_FRONT} y={deckY} width={length} height={DECK_THICK} />
          <rect className="engine-rig__body" x={DECK_FRONT} y={yAt(3)} width={7} height={deckY - yAt(3)} />
          {Array.from({ length: 9 }, (_, i) => DECK_FRONT + (length * (i + 1)) / 10).map((cx) => (
            <circle key={cx} className="engine-rig__accent" cx={cx} cy={deckY - 4} r={2.4} />
          ))}
          <RearFace rear={rear} deckY={deckY} />
        </g>
      );
    }

    case "lowbed": {
      const neckY = yAt(1.5);
      const wellFront = DECK_FRONT + NECK_LEN;
      return (
        <g>
          <rect className="engine-rig__body" x={DECK_FRONT} y={neckY} width={NECK_LEN} height={DECK_THICK} />
          <path
            className="engine-rig__body"
            d={`M${DECK_FRONT + NECK_LEN - 6} ${neckY + DECK_THICK} L${wellFront} ${deckY} L${
              wellFront + 8
            } ${deckY} L${DECK_FRONT + NECK_LEN + 2} ${neckY} Z`}
          />
          <rect className="engine-rig__body" x={wellFront} y={deckY} width={rear - wellFront} height={DECK_THICK} />
          <rect
            className="engine-rig__detail-fill"
            x={rear - 52}
            y={deckY + DECK_THICK}
            width={52}
            height={7}
          />
          {/* gooseneck leg, stowed */}
          <line className="engine-rig__line" x1={DECK_FRONT + 44} y1={neckY + DECK_THICK} x2={DECK_FRONT + 44} y2={yAt(0.9)} />
          <rect className="engine-rig__detail-fill" x={DECK_FRONT + 36} y={yAt(0.9)} width={16} height={4} />
          <RearFace rear={rear} deckY={deckY} />
        </g>
      );
    }

    case "tautliner": {
      const topY = yAt(3.93);
      const shoulder = yAt(3.5);
      return (
        <g>
          <path
            className="engine-rig__body"
            d={`M${DECK_FRONT} ${deckY} L${DECK_FRONT} ${shoulder} Q${DECK_FRONT} ${topY} ${
              DECK_FRONT + 16
            } ${topY} L${rear - 30} ${topY} Q${rear} ${topY} ${rear} ${shoulder} L${rear} ${deckY} Z`}
          />
          {Array.from({ length: 8 }, (_, i) => DECK_FRONT + (length * (i + 1)) / 9).map((x) => (
            <line key={x} className="engine-rig__line" x1={x} y1={topY + 9} x2={x} y2={deckY - 5} />
          ))}
          <line className="engine-rig__line" x1={rear - 8} y1={topY + 7} x2={rear - 8} y2={deckY} />
          <RearFace rear={rear} deckY={deckY} />
        </g>
      );
    }

    default:
      return null;
  }
}

function Dimensions({
  asset,
  rear,
  deckY,
}: {
  asset: EngineAsset;
  rear: number;
  deckY: number;
}) {
  const labelY = 204;
  const textY = 199;
  const heightMid = (deckY + GROUND) / 2;
  const heightX = rear + 66;

  return (
    <g className="engine-rig__dims">
      {/* deck length */}
      <line className="engine-rig__ext" x1={DECK_FRONT} y1={deckY + 10} x2={DECK_FRONT} y2={labelY} />
      <line className="engine-rig__ext" x1={rear} y1={deckY + 10} x2={rear} y2={labelY} />
      <line className="engine-rig__dim" x1={DECK_FRONT} y1={labelY} x2={rear} y2={labelY} />
      <line className="engine-rig__tick" x1={DECK_FRONT} y1={labelY - 5} x2={DECK_FRONT} y2={labelY + 5} />
      <line className="engine-rig__tick" x1={rear} y1={labelY - 5} x2={rear} y2={labelY + 5} />
      <text className="engine-rig__label" x={(DECK_FRONT + rear) / 2} y={textY} textAnchor="middle">
        DECK {asset.deckLengthM.toFixed(1)} M
      </text>

      {/* loading height */}
      <line className="engine-rig__ext" x1={rear + 54} y1={deckY} x2={rear + 54} y2={GROUND} />
      <line className="engine-rig__dim" x1={rear + 49} y1={deckY} x2={rear + 59} y2={deckY} />
      <line className="engine-rig__dim" x1={rear + 49} y1={GROUND} x2={rear + 59} y2={GROUND} />
      <text
        className="engine-rig__label"
        x={heightX}
        y={heightMid}
        textAnchor="middle"
        transform={`rotate(-90 ${heightX} ${heightMid})`}
      >
        {asset.loadingHeightM.toFixed(2)} M
      </text>

      <line className="engine-rig__ground" x1={20} y1={GROUND} x2={VIEW_W - 20} y2={GROUND} />
    </g>
  );
}

export default function EngineRig({
  asset,
  detail = "full",
}: {
  asset: EngineAsset;
  detail?: RigDetail;
}) {
  const deckY = yAt(asset.loadingHeightM);
  const rear = DECK_FRONT + asset.deckLengthM * SCALE;
  const full = detail === "full";

  return (
    <svg
      className="engine-rig"
      viewBox={full ? `0 0 ${VIEW_W} ${VIEW_H}` : COMPACT_VIEW}
      fill="none"
      role={full ? "img" : undefined}
      aria-label={full ? `Side elevation schematic of a ${asset.name.toLowerCase()} trailer` : undefined}
      aria-hidden={full ? undefined : true}
      data-detail={detail}
    >
      <ChassisRail rear={rear} deckY={deckY} />
      <Trailer asset={asset} rear={rear} deckY={deckY} />
      <Tractor />
      <Bogie rear={rear} />
      {full && <Dimensions asset={asset} rear={rear} deckY={deckY} />}
    </svg>
  );
}
