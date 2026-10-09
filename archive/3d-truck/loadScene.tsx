"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import {
  lashPlan,
  loadBeats,
  loadPieces,
  loadProgressAt,
  loadTotals,
  loadsDeck,
  unitWindow,
  type LoadPiece,
  type LoadUnitRecord,
} from "@/data/loads";

/**
 * Ch5's one R3F investment: five shippers consolidated onto a single
 * flatdeck, over three movements across a 300vh pinned track.
 *
 * Read the rhythm off LANDING_LAYOUT.md — this chapter is the *breath*
 * between Ch4's deck and Ch6's climax, so almost everything here is
 * deliberately doing nothing. The only motions are: one slow camera breath
 * across the empty deck, five weighted landings, two straps coming tight.
 * No idle drift, no snap, no secondary movement anywhere.
 *
 * `truck.glb` is a bare tractor — no trailer, no cargo — so the flatdeck and
 * every piece on it are built from primitives here. The plan that says what
 * goes on the deck lives in `data/loads.ts` and this file only interprets
 * it, so the geometry and the mono readout cannot drift apart.
 */

const TRUCK_MODEL_URL = "/models/truck.glb";

/* Draco-compressed, so the decoder has to be told where to live. Set once
   at module scope: doing it inside a render would refetch the decoder. */
useGLTF.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

/* Brand tokens, mirrored from DESIGN.md. three.js cannot read CSS custom
   properties, so the palette lives here too — the only values in the
   chapter that are duplicated rather than authored in data. */
const INK = "#12382f";
const SAND = "#e8d8b9";
const PAPER = "#ffffff";
const GOLD = "#d4a44c";
const CANVAS = "#f8f4eb";

/** Visual centre of the assembly; the camera is seated relative to it. */
const OBJECT_CENTRE_Y = 2;

export type LoadSceneProps = {
  variant: "desktop" | "mobile";
  progressRef: React.MutableRefObject<number>;
  /** Live mono readout line — written from useFrame, never re-rendered. */
  readoutRef: React.RefObject<HTMLElement | null>;
  /** The `LASHED` chip that arrives with movement three. */
  chipRef: React.RefObject<HTMLElement | null>;
};

/* ─── Pacing ────────────────────────────────────────────────────────────
   Everything time-based in the chapter reduces to two curves: a piece's
   progress through its own fall, and the height it is still above the deck.
   Both are pure functions of scroll progress, so the sequence scrubs
   backwards and forwards with no state and nothing to unwind. */

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

const smooth = (value: number) => value * value * (3 - 2 * value);

/** A piece's 0→1 fall, staggered behind the pieces before it in its unit. */
function pieceFall(progress: number, unit: LoadUnitRecord, offset: number) {
  const { start, end } = unitWindow(unit);
  const unitU = (progress - start) / (end - start);
  return clamp01((unitU - offset) / (1 - offset));
}

/** 0→1 across movement three, the lashing. */
function lashProgress(progress: number) {
  return clamp01((progress - loadBeats.lashed) / (1 - loadBeats.lashed));
}

/**
 * Metres a piece is still above its resting position.
 *
 * Two curves, deliberately: a smoothstep descent that eases out of the lift
 * and eases into contact — a winch-lowered load, not a dropped one — then
 * one small damped settle once it lands. The settle peaks at 2.2% of the
 * fall: enough to read as weight taking up, small enough never to look like
 * a bounce.
 */
const CONTACT = 0.86;

function airTime(t: number, rise: number) {
  if (t <= 0) return rise;
  if (t >= 1) return 0;
  if (t < CONTACT) {
    const u = t / CONTACT;
    return rise * (1 - smooth(u));
  }
  const u = (t - CONTACT) / (1 - CONTACT);
  return rise * 0.022 * Math.sin(Math.PI * u) * (1 - u);
}

/* ─── Pieces ─────────────────────────────────────────────────────────────
   The list itself comes from `data/loads.ts`, shared with the SVG fallback —
   the flatten lives in the data layer so the two renderings of this chapter
   are guaranteed to be the same 24 pieces. What's added here is motion:
   when each piece is released, and how high it is lifted from. */

type Moving = LoadPiece & {
  /** Fraction of its unit's beat after which this piece starts falling. */
  offset: number;
  /** Height it is lifted from, metres — deliberately low. This is a yard,
      not a quarry: forklift and crane, never a drop. */
  rise: number;
};

/** One gold accent per unit, matching Ch4's rule: a single band on the first
    piece down, so a landed unit is identifiable without turning the deck
    into a colour-coded diagram. */

function PieceBody({ piece, accent }: { piece: LoadPiece; accent: boolean }) {
  const { size, kind } = piece.unit;

  if (kind === "coil-cradle") {
    return (
      <>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[size.x / 2, size.x / 2, size.z, 40]} />
          <meshStandardMaterial color={SAND} roughness={0.72} metalness={0.18} />
          <Edges color={INK} threshold={18} />
        </mesh>
        {/* Chocks: a coil has to stop rolling before a strap can go on. */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[side * (size.x / 2 + 0.14), -size.y / 2 + 0.09, 0]}
          >
            <boxGeometry args={[0.28, 0.18, size.z]} />
            <meshStandardMaterial color={INK} roughness={0.85} />
          </mesh>
        ))}
        {accent && (
          <mesh position={[0, size.y / 2 - 0.1, size.z / 2 + 0.01]}>
            <boxGeometry args={[size.x * 0.5, 0.07, 0.02]} />
            <meshStandardMaterial color={GOLD} roughness={0.5} />
          </mesh>
        )}
      </>
    );
  }

  if (kind === "drum-cluster") {
    return (
      <>
        <mesh>
          <cylinderGeometry args={[size.x / 2, size.x / 2, size.y, 24]} />
          <meshStandardMaterial color={SAND} roughness={0.6} metalness={0.12} />
          <Edges color={INK} threshold={18} />
        </mesh>
        {/* Rolling hoops — two thin rings read as a drum at any distance. */}
        {[0.3, 0.7].map((at) => (
          <mesh key={at} position={[0, (at - 0.5) * size.y, 0]}>
            <cylinderGeometry
              args={[size.x / 2 + 0.015, size.x / 2 + 0.015, 0.05, 24]}
            />
            <meshStandardMaterial color={INK} roughness={0.7} />
          </mesh>
        ))}
        {accent && (
          <mesh position={[0, size.y / 2 + 0.014, 0]}>
            <cylinderGeometry args={[size.x / 2 - 0.04, size.x / 2 - 0.04, 0.024, 24]} />
            <meshStandardMaterial color={GOLD} roughness={0.5} />
          </mesh>
        )}
      </>
    );
  }

  if (kind === "crate") {
    return (
      <>
        <mesh>
          <boxGeometry args={[size.x, size.y, size.z]} />
          <meshStandardMaterial color={PAPER} roughness={0.85} />
          <Edges color={INK} threshold={15} />
        </mesh>
        {/* Skids — a crated machine is skidded, or it is not being moved. */}
        {[-1, 1].map((side) => (
          <mesh
            key={side}
            position={[0, -size.y / 2 - 0.06, (side * size.z) / 3]}
          >
            <boxGeometry args={[size.x * 0.96, 0.12, 0.16]} />
            <meshStandardMaterial color={INK} roughness={0.9} />
          </mesh>
        ))}
        {accent && (
          <mesh position={[0, size.y * 0.18, size.z / 2 + 0.012]}>
            <boxGeometry args={[size.x * 0.62, 0.09, 0.02]} />
            <meshStandardMaterial color={GOLD} roughness={0.5} />
          </mesh>
        )}
      </>
    );
  }

  if (kind === "bag-stack") {
    return (
      <>
        <mesh>
          <boxGeometry args={[size.x, size.y, size.z]} />
          <meshStandardMaterial color={PAPER} roughness={0.92} />
          <Edges color={INK} threshold={15} />
        </mesh>
        {/* Cinched top face — a big bag is not a cube. */}
        <mesh position={[0, size.y / 2 - 0.05, 0]}>
          <boxGeometry args={[size.x * 0.82, 0.1, size.z * 0.82]} />
          <meshStandardMaterial color={SAND} roughness={0.9} />
        </mesh>
        {accent && (
          <mesh position={[0, size.y / 2 + 0.02, 0]}>
            <boxGeometry args={[size.x * 0.9, 0.035, size.z * 0.9]} />
            <meshStandardMaterial color={GOLD} roughness={0.55} />
          </mesh>
        )}
      </>
    );
  }

  /* pallet-grid — the default, and the only kind carried on a pallet. */
  return (
    <>
      <mesh position={[0, size.y / 2 - 0.07, 0]}>
        <boxGeometry args={[size.x, size.y - 0.14, size.z]} />
        <meshStandardMaterial color={PAPER} roughness={0.88} />
        <Edges color={INK} threshold={15} />
      </mesh>
      <mesh position={[0, -size.y / 2 + 0.07, 0]}>
        <boxGeometry args={[size.x, 0.14, size.z]} />
        <meshStandardMaterial color={SAND} roughness={0.95} />
        <Edges color={INK} threshold={15} />
      </mesh>
      {accent && (
        <mesh position={[0, size.y / 2 - 0.17, size.z / 2 + 0.012]}>
          <boxGeometry args={[size.x * 0.8, 0.06, 0.02]} />
          <meshStandardMaterial color={GOLD} roughness={0.5} />
        </mesh>
      )}
    </>
  );
}

/** Walks a piece's meshes and makes them fade in as it enters the yard. */
function setPieceAlpha(node: THREE.Object3D, opacity: number) {
  node.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const material = child.material;
    if (!(material instanceof THREE.MeshStandardMaterial)) return;
    /* Only pay for transparency while a piece is arriving; a landed deck
       renders in the opaque pass with no sorting cost. */
    material.transparent = opacity < 1;
    material.opacity = opacity;
  });
}

function Cargo({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const pieces = useMemo<Moving[]>(
    () =>
      loadPieces.map((piece) => ({
        ...piece,
        offset: piece.unit.layout.stagger * piece.index,
        rise: 1.45 + piece.layer * 1.5 + (piece.unit.order - 1) * 0.16,
      })),
    []
  );
  const nodes = useRef<(THREE.Group | null)[]>([]);
  const faded = useRef<boolean[]>(pieces.map(() => false));

  /* One subscription for the whole load: 24 pieces at 60fps is not a reason
     to open 24 listeners. */
  useFrame(() => {
    const progress = progressRef.current;

    for (const piece of pieces) {
      const node = nodes.current[piece.seq];
      if (!node) continue;

      const t = pieceFall(progress, piece.unit, piece.offset);
      if (t <= 0) {
        if (node.visible) node.visible = false;
        continue;
      }

      node.visible = true;
      node.position.y = piece.y + airTime(t, piece.rise);

      const settled = t >= 1;
      if (settled !== faded.current[piece.seq]) {
        faded.current[piece.seq] = settled;
        setPieceAlpha(node, settled ? 1 : clamp01(t / 0.1));
      }
    }
  });

  return (
    <group>
      {pieces.map((piece) => (
        <group
          key={`${piece.unit.id}-${piece.index}`}
          ref={(node) => {
            nodes.current[piece.seq] = node;
          }}
          position={[piece.x, piece.y, piece.z]}
          visible={false}
        >
          <PieceBody piece={piece} accent={piece.index === 0} />
        </group>
      ))}
    </group>
  );
}

/* ─── The flatdeck ───────────────────────────────────────────────────────
   FD-120: a 12 m deck at a 1.4 m loading height, kingpin forward, twin-axle
   bogie aft, landing legs up. Proportions come from `loadsDeck`; nothing
   here invents a dimension. */

function Flatdeck() {
  const halfLength = loadsDeck.deckLengthM / 2;
  const halfWidth = loadsDeck.deckWidthM / 2;
  const top = loadsDeck.loadingHeightM;
  const slab = 0.16;

  return (
    <group>
      <mesh position={[0, top - slab / 2, 0]}>
        <boxGeometry args={[loadsDeck.deckLengthM, slab, loadsDeck.deckWidthM]} />
        <meshStandardMaterial color={SAND} roughness={0.9} />
        <Edges color={INK} threshold={15} />
      </mesh>

      {/* Side rails — the low kerb that keeps the load on the deck. */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, top + 0.13, side * (halfWidth + 0.04)]}>
          <boxGeometry args={[loadsDeck.deckLengthM, 0.26, 0.08]} />
          <meshStandardMaterial color={INK} roughness={0.7} metalness={0.15} />
        </mesh>
      ))}

      {/* Headboards: taller forward, where a shifted load arrives first. */}
      <mesh position={[-halfLength, top + 0.6, 0]}>
        <boxGeometry args={[0.08, 1.2, loadsDeck.deckWidthM]} />
        <meshStandardMaterial color={INK} roughness={0.75} />
      </mesh>
      <mesh position={[halfLength, top + 0.44, 0]}>
        <boxGeometry args={[0.08, 0.88, loadsDeck.deckWidthM]} />
        <meshStandardMaterial color={INK} roughness={0.75} />
      </mesh>

      {/* Kingpin plate — the whole trailer turns on this. */}
      <mesh position={[loadsDeck.kingpinX, top - slab - 0.06, 0]}>
        <boxGeometry args={[1.7, 0.12, 1.3]} />
        <meshStandardMaterial color={INK} roughness={0.8} />
      </mesh>

      {/* Bogie: two axles, four wheels. */}
      {loadsDeck.bogieX.map((axleX) => (
        <group key={axleX}>
          <mesh position={[axleX, loadsDeck.wheelRadiusM, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 2.1, 12]} />
            <meshStandardMaterial color={INK} roughness={0.85} />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[axleX, loadsDeck.wheelRadiusM, side * 1.02]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <cylinderGeometry
                args={[loadsDeck.wheelRadiusM, loadsDeck.wheelRadiusM, 0.32, 28]}
              />
              <meshStandardMaterial color={INK} roughness={0.95} />
              <Edges color={SAND} threshold={20} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Landing legs, pulled up for the road. */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[halfLength - 0.6, 0.72, side * 0.95]}>
          <boxGeometry args={[0.13, 0.9, 0.13]} />
          <meshStandardMaterial color={INK} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── The tractor ─────────────────────────────────────────────────────────
   `truck.glb` is authored facing an unknown axis, so orientation is measured
   rather than assumed: the long axis is whichever of x/z is longer, and the
   cab is whichever end the head node sits on. It is then scaled to a real
   6.4 m prime mover and set down with its tyres on y=0, coupling face just
   short of the headboard. Swap in a properly scaled export and none of this
   has to change.

   Every transform is written as an absolute `.set()`, never accumulated onto
   the cached scene — the variant switch unmounts and remounts this, and an
   accumulating `position.sub(centre)` would drift a little further each time. */

const TRACTOR_LENGTH_M = 6.4;
const HEAD_NODE = "Truck_head_Truck_head.L";
const COUPLING_GAP_M = 0.25;

function Tractor() {
  const { scene, nodes } = useGLTF(TRUCK_MODEL_URL);
  const pivot = useRef<THREE.Group>(null);

  /* The GLB ships one shared material for the whole vehicle, so it reads as a
     solid Deep Forest silhouette against the ivory canvas — the brand
     register, and it keeps the load the only detailed thing on the deck.
     Wheels get a rougher material so they don't dissolve into the bodywork
     at this distance. */
  const bodyMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: INK, roughness: 0.55, metalness: 0.2 }),
    []
  );
  const wheelMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: INK, roughness: 0.95, metalness: 0.05 }),
    []
  );

  useEffect(() => {
    const group = pivot.current;
    if (!group) return;
    const body = scene as THREE.Object3D;

    body.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = /wheel/i.test(mesh.name) ? wheelMaterial : bodyMaterial;
    });

    /* Measure from an identity pivot so a remount starts from the same place. */
    group.position.set(0, 0, 0);
    group.rotation.set(0, 0, 0);
    group.scale.setScalar(1);
    group.updateMatrixWorld(true);

    const raw = new THREE.Box3().setFromObject(body);
    const rawSize = raw.getSize(new THREE.Vector3());
    if (!Number.isFinite(rawSize.x) || rawSize.x <= 0) return;

    const alongX = rawSize.x >= rawSize.z;
    const head = (nodes as Record<string, THREE.Object3D> | undefined)?.[HEAD_NODE];
    const headCentre = head
      ? body.worldToLocal(head.getWorldPosition(new THREE.Vector3()))
      : new THREE.Vector3();
    const rawCentre = raw.getCenter(new THREE.Vector3());
    const cabSign =
      Math.sign(
        (alongX ? headCentre.x - rawCentre.x : headCentre.z - rawCentre.z) || 1
      ) || 1;

    /* Map the asset's long axis onto world x with the cab facing -x, which is
       the front of the trailer. */
    group.rotation.set(
      0,
      alongX ? (cabSign > 0 ? Math.PI : 0) : cabSign > 0 ? -Math.PI / 2 : Math.PI / 2,
      0
    );
    group.updateMatrixWorld(true);

    const turned = new THREE.Box3().setFromObject(group).getSize(new THREE.Vector3());
    const length = Math.max(turned.x, turned.z);
    if (!Number.isFinite(length) || length <= 0) return;
    group.scale.setScalar(TRACTOR_LENGTH_M / length);
    group.updateMatrixWorld(true);

    /* Tyres on the ground, coupling face a hand's width off the headboard. */
    const placed = new THREE.Box3().setFromObject(group);
    group.position.set(
      -loadsDeck.deckLengthM / 2 - COUPLING_GAP_M - placed.max.x,
      -placed.min.y,
      0
    );
    group.updateMatrixWorld(true);
  }, [scene, nodes, bodyMaterial, wheelMaterial]);

  return (
    <group ref={pivot}>
      <primitive object={scene} />
    </group>
  );
}

/* ─── Lashing ───────────────────────────────────────────────────────────
   Movement three: each strap comes down onto the top of the stack it holds
   and ratchets the last 12cm sideways into tension. The handle block only
   appears once the strap has landed, so it reads as the end of the pull. */

const SLACK_M = 0.5;
const RATCHET_M = 0.12;

function Lashing({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const straps = useRef<(THREE.Group | null)[]>([]);
  const handles = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const t = lashProgress(progressRef.current);
    const count = lashPlan.length;
    /* One strap at a time: a ratchet is not a zip tie. The offsets leave
       the last strap finishing exactly on the end of the movement. */
    const perStrap = count > 1 ? (1 - 0.4) / (count - 1) : 1;

    for (let i = 0; i < count; i += 1) {
      const lash = lashPlan[i];
      const local = clamp01((t - i * 0.2) / perStrap);
      const settle = smooth(local);

      const strap = straps.current[i];
      if (strap) {
        strap.position.y = lash.y + SLACK_M * (1 - settle);
        strap.position.x = lash.x - RATCHET_M * (1 - settle);
      }

      const handle = handles.current[i];
      if (handle) handle.visible = local > 0.72;
    }
  });

  return (
    <group>
      {lashPlan.map((lash, i) => (
        <group key={lash.id}>
          <group
            ref={(node) => {
              straps.current[i] = node;
            }}
            position={[lash.x - RATCHET_M, lash.y + SLACK_M, 0]}
            scale={0.001}
          >
            <mesh>
              <boxGeometry args={[0.09, 0.05, lash.span]} />
              <meshStandardMaterial color={GOLD} roughness={0.55} />
            </mesh>
          </group>
          <mesh
            ref={(node) => {
              handles.current[i] = node;
            }}
            position={[lash.x - RATCHET_M, lash.y, (lash.handleZ * lash.span) / 2]}
            visible={false}
          >
            <boxGeometry args={[0.2, 0.16, 0.26]} />
            <meshStandardMaterial color={INK} roughness={0.6} metalness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ─── Camera ────────────────────────────────────────────────────────────
   The composition is the chapter. LANDING_LAYOUT.md scores Ch5 "radically
   off-axis, object low and minor relative to whitespace", and Ch4 already
   owns top-left-heavy — so the load sits low and right of centre and the
   copy takes the empty upper left.

   Framing is solved from the stage's own aspect every frame rather than
   hand-tuned, so the object keeps the same share of the frame on any
   window: fit a target width, back off far enough to fit the height too,
   then aim at a point left of and above the load to push it down-right. */

const CAMERA = {
  desktop: { fov: 20, frameWidth: 34, frameHeight: 13, shiftX: 0.36, shiftY: 0.4 },
  mobile: { fov: 34, frameWidth: 23, frameHeight: 26, shiftX: 0.1, shiftY: 0.3 },
} as const;

/** Three-quarter view from in front of and above the coupling side. */
const VIEW_DIR = new THREE.Vector3(-0.24, 0.26, 1).normalize();

function CameraRig({
  variant,
  progressRef,
}: Pick<LoadSceneProps, "variant" | "progressRef">) {
  const camera = useThree((state) => state.camera);
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const rig = CAMERA[variant];
    const aspect = width / Math.max(1, height);
    const halfFov = Math.tan(THREE.MathUtils.degToRad(rig.fov) / 2);

    const progress = progressRef.current;
    /* A held breath, not a static hold: the camera creeps in across the
       empty deck, holds while the load is going on, then settles once
       everything has stopped moving. */
    const settle = smooth(clamp01((progress - loadBeats.lashed) / (1 - loadBeats.lashed)));
    const dolly = THREE.MathUtils.lerp(1.16, 0.96, settle);

    const distance =
      Math.max(rig.frameWidth / (2 * halfFov * aspect), rig.frameHeight / (2 * halfFov)) *
      dolly;

    const halfHeight = distance * halfFov;
    const halfWidth = halfHeight * aspect;

    target.set(
      -rig.shiftX * halfWidth,
      OBJECT_CENTRE_Y + THREE.MathUtils.lerp(rig.shiftY, rig.shiftY - 0.06, settle) * halfHeight,
      0
    );

    camera.position.copy(target).addScaledVector(VIEW_DIR, distance);
    camera.lookAt(target);
  });

  return null;
}

/* ─── Readout driver ─────────────────────────────────────────────────────
   The mono load sheet is written to the DOM rather than to React state: it
   changes on every frame of a ~200vh scrub, and re-rendering the section to
   move two numbers would cost more than the whole 3D scene. Writes only when
   the string actually changes, so a settled deck costs nothing. */

function ReadoutDriver({
  progressRef,
  readoutRef,
  chipRef,
}: Pick<LoadSceneProps, "progressRef" | "readoutRef" | "chipRef">) {
  useFrame(() => {
    const progress = progressRef.current;
    const { units, tonnes } = loadProgressAt(progress);

    const node = readoutRef.current;
    if (node) {
      const text = `${String(units).padStart(2, "0")} / ${String(loadTotals.units).padStart(2, "0")} · ${tonnes.toFixed(1)} T`;
      if (node.textContent !== text) node.textContent = text;
    }

    const chip = chipRef.current;
    if (chip) {
      /* A confirmation, not an invitation: it arrives once the last strap is
         tight and leaves again before the chapter does. */
      const t = lashProgress(progress);
      const opacity = t > 0.55 && t < 0.94 ? "1" : "0";
      if (chip.style.opacity !== opacity) {
        chip.style.opacity = opacity;
        chip.style.visibility = opacity === "1" ? "visible" : "hidden";
      }
    }
  });

  return null;
}

/* ─── Scene ─────────────────────────────────────────────────────────────*/

export default function LoadScene({
  variant,
  progressRef,
  readoutRef,
  chipRef,
}: LoadSceneProps) {
  return (
    <Canvas
      dpr={variant === "mobile" ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 4, 40], fov: CAMERA[variant].fov, near: 1, far: 400 }}
    >
      <color attach="background" args={[CANVAS]} />
      {/* Two lights, no shadows. There is no key light in a yard at dusk,
          and a shadow map would buy a contact shadow this composition does
          not want — the load is held off the deck, not planted on a floor. */}
      <hemisphereLight args={["#ffffff", "#e8d8b9", 1.15]} />
      <directionalLight position={[6, 11, 9]} intensity={1.35} />
      <directionalLight position={[-8, 5, -6]} intensity={0.3} />

      <CameraRig variant={variant} progressRef={progressRef} />
      <Flatdeck />
      <Tractor />
      <Cargo progressRef={progressRef} />
      <Lashing progressRef={progressRef} />
      <ReadoutDriver progressRef={progressRef} readoutRef={readoutRef} chipRef={chipRef} />
    </Canvas>
  );
}

useGLTF.preload(TRUCK_MODEL_URL);