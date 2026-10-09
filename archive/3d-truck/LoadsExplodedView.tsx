"use client";

import { lashPlan, loadPieces, loadsDeck } from "@/data/loads";

/**
 * Ch5's static stand-in for the 3D sequence.
 *
 * Both landing docs ask for one thing here — "3D sequence replaced with a
 * static exploded-view image of the load" — so this is not a degraded mode,
 * it is a second, deliberate rendering of the same plan. It runs under
 * reduced motion *and* wherever WebGL is unavailable, and it is the reason
 * the chapter needs no `[TBC PHOTO]`: there is nothing to wait for.
 *
 * Built in the same language as Ch3's `EngineRig` and Ch4's `CommodityScene`:
 * 1.25–1.5px ink strokes, one gold accent per unit, dashed leaders, metres.
 * Every coordinate is derived from `data/loads.ts`, so this drawing cannot
 * disagree with the 3D scene about what is on the deck or in what order.
 *
 * The projection is fitted to the drawing's own bounds rather than tuned by
 * hand, so the sheet holds its proportions at any variant width.
 */

const VIEW_W = 420;
const VIEW_H = 300;

/** Explode fan: how far each unit in the sequence steps away from the deck. */
const EXPLODE_X_M = 0.85;
const EXPLODE_Y_M = 0.55;

/** Room above the deck for shipper codes, and below the ground for the datum. */
const PAD_X = 18;
const PAD_TOP = 22;
const PAD_BOTTOM = 26;

export default function LoadsExplodedView() {
  const deckHalf = loadsDeck.deckLengthM / 2;

  /* Every piece is drawn twice: once where it will end up on the deck, and
     once lifted and stepped away by its place in the loading sequence. The
     dashed leader between the two is the whole idea of the chapter — five
     separate loads becoming one deck. */
  const drawn = loadPieces.map((piece) => {
    const step = piece.unit.order - 1;
    const { size } = piece.unit;
    return {
      piece,
      size,
      step,
      /* Exploded position — the piece's own box, shifted. */
      ex: piece.x + step * EXPLODE_X_M,
      ey: piece.y + step * EXPLODE_Y_M,
      /* Rest position — the top face of where it lands. */
      rx: piece.x,
      ry: piece.y - size.y / 2,
    };
  });

  const minX = Math.min(
    -deckHalf - 0.4,
    ...drawn.map((d) => d.ex - d.size.x / 2)
  );
  const maxX = Math.max(
    deckHalf + 0.4,
    ...drawn.map((d) => d.ex + d.size.x / 2),
    ...lashPlan.map((lash) => lash.x + 0.4)
  );
  const maxY =
    Math.max(
      ...drawn.map((d) => d.ey + d.size.y / 2),
      ...lashPlan.map((lash) => lash.y)
    ) + 0.35; /* shipper codes sit above this */
  const minY = -0.55; /* below the ground line, for the datum */

  const worldW = maxX - minX;
  const worldH = maxY - minY;
  const pxPerM = Math.min(
    (VIEW_W - PAD_X * 2) / worldW,
    (VIEW_H - PAD_TOP - PAD_BOTTOM) / worldH
  );
  const originX = (VIEW_W - worldW * pxPerM) / 2 - minX * pxPerM;
  const originY = VIEW_H - PAD_BOTTOM;

  const toX = (metres: number) => originX + metres * pxPerM;
  const toY = (metresAboveGround: number) => originY - metresAboveGround * pxPerM;

  const deckTopY = toY(loadsDeck.loadingHeightM);
  const groundY = toY(0);

  return (
    <svg
      className="loads__drawing"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={`Exploded side elevation of flatdeck ${loadsDeck.fleetCode}: five shippers' loads drawn in loading order above one ${loadsDeck.deckLengthM} metre deck.`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="loads-deck-hatch" width="7" height="7" patternUnits="userSpaceOnUse">
          <path d="M0 7 L7 0" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.16" />
        </pattern>
      </defs>

      {/* ─── Ground ─── */}
      <line className="loads__ground" x1={toX(minX)} y1={groundY} x2={toX(maxX)} y2={groundY} />

      {/* ─── The deck, at true scale ─── */}
      <g>
        <rect
          className="loads__deck"
          x={toX(-deckHalf)}
          y={deckTopY}
          width={loadsDeck.deckLengthM * pxPerM}
          height={loadsDeck.loadingHeightM * pxPerM}
          fill="url(#loads-deck-hatch)"
        />
        {/* Headboards, drawn as they are on the trailer. */}
        <line
          className="loads__deck"
          x1={toX(-deckHalf)}
          y1={deckTopY}
          x2={toX(-deckHalf)}
          y2={deckTopY - 1.2 * pxPerM}
        />
        <line
          className="loads__deck"
          x1={toX(deckHalf)}
          y1={deckTopY}
          x2={toX(deckHalf)}
          y2={deckTopY - 0.88 * pxPerM}
        />
        {/* The deck's three contact points: kingpin, then the bogie. */}
        <circle
          className="loads__mark"
          cx={toX(loadsDeck.kingpinX)}
          cy={groundY}
          r={0.14 * pxPerM}
        />
        {loadsDeck.bogieX.map((axleX) => (
          <circle
            key={axleX}
            className="loads__mark"
            cx={toX(axleX)}
            cy={groundY - loadsDeck.wheelRadiusM * pxPerM}
            r={loadsDeck.wheelRadiusM * pxPerM}
          />
        ))}
      </g>

      {/* ─── Lashings, standing on the deck they hold ─── */}
      {lashPlan.map((lash) => (
        <g key={lash.id}>
          <line className="loads__leader" x1={toX(lash.x)} y1={deckTopY} x2={toX(lash.x)} y2={toY(lash.y)} />
          <rect
            className="loads__accent"
            x={toX(lash.x) - 2}
            y={toY(lash.y) - 2}
            width={4}
            height={4}
          />
        </g>
      ))}

      {/* ─── The load, exploded ─── */}
      {drawn.map(({ piece, size, ex, ey, rx, ry }) => {
        const x = toX(ex - size.x / 2);
        const y = toY(ey + size.y / 2);
        const width = size.x * pxPerM;
        const height = size.y * pxPerM;
        /* One gold accent per unit — the first piece of each, so a landed
           unit is identifiable without colour-coding the whole deck. */
        const accent = piece.index === 0;

        return (
          <g key={piece.seq}>
            {/* Leader back to the deck: where this piece will end up. */}
            <line
              className="loads__leader"
              x1={x}
              y1={y + height}
              x2={toX(rx)}
              y2={toY(ry)}
            />

            {piece.unit.kind === "coil-cradle" ? (
              /* A coil lies across the deck, so in side elevation it reads
                 as its own diameter, not as its width. */
              <circle className="loads__piece" cx={x + width / 2} cy={y + height / 2} r={width / 2} />
            ) : (
              <rect className="loads__piece" x={x} y={y} width={width} height={height} rx={1.5} />
            )}

            {accent && (
              <rect
                className="loads__accent"
                x={x + width * 0.3}
                y={y + height * 0.28}
                width={width * 0.4}
                height={2}
              />
            )}

            <text className="loads__piece-code" x={x} y={y - 5}>
              {piece.unit.code}
            </text>
          </g>
        );
      })}

      {/* ─── Datum ─── */}
      <text className="loads__datum" x={toX(minX) + 2} y={groundY + 15}>
        {`${loadsDeck.fleetCode} · ${loadsDeck.deckLengthM} M DECK · ${loadsDeck.loadingHeightM} M LOADING HEIGHT · ${loadsDeck.site}`}
      </text>
    </svg>
  );
}