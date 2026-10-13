"use client";

import CorridorRun from "./CorridorRun";
import "./CorridorCommon.css";
import "./CorridorDesktop.css";

/**
 * DESKTOP ENTRY — right-anchored truck, copy panel on the left rail,
 * HUD as a compact card on the right. Framing numbers: DESKTOP_CAMERA
 * in camera.ts. Picked by CorridorSection at ≥768px.
 */
export default function CorridorDesktop() {
  return <CorridorRun variant="desktop" />;
}
