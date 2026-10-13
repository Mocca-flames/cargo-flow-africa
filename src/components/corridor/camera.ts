// Ch6 "The Run" — camera layouts. This is the ONLY place where the numbers
// that differ between desktop and mobile live (layout/CSS lives in
// CorridorDesktop.css / CorridorMobile.css).
//
// The camera is a pure translate+scale on the world <g>: it frames the truck
// slightly ahead of the cab and applies a per-beat zoom (ZOOM_KEYS in config.ts)
// scaled by `zoomMul`. Anchor fractions are of the viewport (stage) size.

export type CameraLayout = {
  /** Multiplies the keyframed zoom — mobile pulls back so the rig fits the narrow frame. */
  zoomMul: number;
  /** Horizontal anchor as a fraction of stage width (0 = left edge, 1 = right). */
  anchorX: number;
  /** Vertical anchor as a fraction of stage height (0 = top, 1 = bottom). */
  anchorY: number;
};

/**
 * Desktop: truck rides right-of-centre, copy panel owns the left column.
 * Matches `.corridor__panels` in CorridorDesktop.css.
 */
export const DESKTOP_CAMERA: CameraLayout = {
  zoomMul: 1,
  anchorX: 0.62,
  anchorY: 0.54,
};

/**
 * Mobile: truck centred and higher up; the copy sheet sits along the bottom
 * so it never covers the rig. Matches `.corridor__panels` in CorridorMobile.css.
 */
export const MOBILE_CAMERA: CameraLayout = {
  zoomMul: 0.62,
  anchorX: 0.5,
  anchorY: 0.34,
};

export type CorridorVariant = "desktop" | "mobile";

/** Pick the camera layout for a variant (wired through CorridorRun's `variant` prop). */
export const cameraFor = (variant: CorridorVariant): CameraLayout =>
  variant === "mobile" ? MOBILE_CAMERA : DESKTOP_CAMERA;
