/**
 * Coverage framing verification — run with:
 *   npx tsx src/components/coverage/framing.check.ts
 * Pure numbers from the GENERATED data files + framing.ts. No browser.
 */
import { PLACES } from "../../data/coverage-corridors-wide";
import {
  STOPS,
  FRAME_H,
  X_MIN,
  X_MAX,
  framePlaceIds,
  startHubs,
  labelCandidates,
  layoutLabels,
  viewBoxFor,
  type StopId,
} from "./framing";

const SIZES: [number, number][] = [
  [2560, 1080],
  [1920, 1080],
  [1440, 900],
  [1024, 768],
  [390, 844],
];

const r = (n: number) => (Math.round(n * 10) / 10).toFixed(1);
let fails = 0;
const FAIL = (msg: string) => {
  fails++;
  console.log(`  FAIL ${msg}`);
};

for (const [cw, ch] of SIZES) {
  console.log(`--- container ${cw}x${ch} (aspect ${(cw / ch).toFixed(4)}) ---`);
  for (const stop of STOPS) {
    const v = viewBoxFor(stop, cw, ch);
    const aspectOK = Math.abs(v.w / v.h - cw / ch) < 1e-6;
    console.log(
      `${stop}: viewBox=${r(v.x)} ${r(v.y)} ${r(v.w)} ${r(v.h)} aspectExact=${aspectOK}`
    );
    if (!aspectOK) FAIL(`${stop}: viewBox aspect != container aspect`);
    if (v.y < -1e-9 || v.y + v.h > FRAME_H + 1e-9)
      FAIL(`${stop}: vertical out of frame (y=${r(v.y)} h=${r(v.h)})`);
    if (v.x < X_MIN - 1e-9 || v.x + v.w > X_MAX + 1e-9)
      FAIL(`${stop}: horizontal out of band (x=${r(v.x)} w=${r(v.w)})`);
    const need = [...new Set([...framePlaceIds(stop), ...startHubs(stop as StopId)])];
    for (const id of need) {
      const p = PLACES[id];
      const mx = Math.min(p.x - v.x, v.x + v.w - p.x);
      const my = Math.min(p.y - v.y, v.y + v.h - p.y);
      const ok = mx >= 0.03 * v.w - 1e-9 && my >= 0.03 * v.h - 1e-9;
      if (!ok) FAIL(`${stop}: ${id} margin x=${r(mx)} (need ${r(0.03 * v.w)}) y=${r(my)} (need ${r(0.03 * v.h)})`);
    }
    const headroom = ((PLACES["lub"].y - v.y) / v.h) * 100;
    console.log(`  headroom above Lubumbashi: ${headroom.toFixed(1)}% of box height`);
  }
}

for (const [cw, ch] of [[1440, 900], [1920, 1080]] as [number, number][]) {
  console.log(`--- distinctness ${cw}x${ch} ---`);
  const boxes = (["A", "B", "C", "D"] as StopId[]).map((s) => {
    const v = viewBoxFor(s, cw, ch);
    return `${r(v.x)},${r(v.y)},${r(v.w)},${r(v.h)}`;
  });
  boxes.forEach((b, i) => console.log(`  ${"ABCD"[i]}: ${b}`));
  if (new Set(boxes).size !== 4) FAIL(`stops A-D viewBoxes not all different at ${cw}x${ch}`);
  else console.log("  A, B, C, D all DIFFERENT");
}

console.log("--- hidden labels at 1440x900 ---");
for (const stop of STOPS) {
  const l = layoutLabels(stop, 1440, 900);
  const cands = labelCandidates(stop);
  console.log(
    `${stop}: candidates=[${cands.join(",")}] placed=[${l.placed.map((p) => p.id).join(",")}] hidden=[${l.hidden.join(",") || "none"}] scale=${l.scale.toFixed(3)}`
  );
}

console.log(fails === 0 ? "RESULT: ALL CHECKS PASS" : `RESULT: ${fails} FAILURES`);
process.exit(fails === 0 ? 0 : 1);
