"use client";

import CorridorRun from "./CorridorRun";
import "./CorridorCommon.css";
import "./CorridorMobile.css";

/**
 * MOBILE ENTRY — truck centred and raised; HUD becomes a 2-col strip under
 * the header; copy sits in a bottom sheet. Framing numbers: MOBILE_CAMERA
 * in camera.ts. Picked by CorridorSection at ≤767px.
 */
export default function CorridorMobile() {
  return <CorridorRun variant="mobile" />;
}
