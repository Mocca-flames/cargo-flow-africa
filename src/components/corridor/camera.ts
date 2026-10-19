// Ch6 "The Run" — camera layouts. This is the ONLY place where the numbers
// that differ between desktop and mobile live (layout/CSS lives in
// CorridorDesktop.css / CorridorMobile.css).
//
// The camera is a pure translate+scale on the world <g>. It looks at the
// rig's midpoint (RIG_LOOK behind the kingpin pivot, config.ts) so the
// tractor AND the trailer are both in frame, then scales the world so that
// the whole rig (RIG_SPAN) spans `fill` of the stage width. Per-beat punch-ins
// are relative multipliers in ZOOM_KEYS (config.ts): 1 = full rig in frame.
// That makes the framing resolution-independent — a 1440px stage and a
// 390px stage both frame the same rig.

export type CameraLayout = {
  /** Fraction of the stage width the whole rig spans at ZOOM_KEYS = 1. */
  fill: number;
  /** Horizontal anchor as a fraction of stage width (0 = left edge, 1 = right). */
  anchorX: number;
  /** Vertical anchor as a fraction of stage height (0 = top, 1 = bottom). */
  anchorY: number;
  /**
   * Extra rotation of the whole world, in degrees. The route is authored
   * left→right; rotating it -90 turns it into a bottom→top run so a portrait
   * phone scrolls the truck UP the screen instead of across it. Labels are
   * counter-rotated per element (see useCorridorAnimation's [data-at] sweep).
   */
  worldRotate: number;
};

/**
 * Desktop: rig rides right-of-centre, the copy panel owns the left rail,
 * the HUD card sits top-right. Matches `.corridor__panels` / `.corridor__hud`
 * in CorridorDesktop.css — keep the three in sync.
 */
export const DESKTOP_CAMERA: CameraLayout = {
  fill: 0.6,
  anchorX: 0.54,
  anchorY: 0.56,
  worldRotate: 0,
};

/**
 * Mobile: rig centred and raised above the bottom sheet; the HUD becomes a
 * strip under the header. The world is rotated -90° so the corridor runs
 * bottom→top and the truck climbs the screen with the scroll. Matches
 * `.corridor__panels` / `.corridor__hud` in CorridorMobile.css — keep the
 * three in sync.
 */
export const MOBILE_CAMERA: CameraLayout = {
  fill: 0.88,
  anchorX: 0.5,
  anchorY: 0.5,
  worldRotate: -90,
};

export type CorridorVariant = "desktop" | "mobile";

/** Pick the camera layout for a variant (wired through CorridorRun's `variant` prop). */
export const cameraFor = (variant: CorridorVariant): CameraLayout =>
  variant === "mobile" ? MOBILE_CAMERA : DESKTOP_CAMERA;
