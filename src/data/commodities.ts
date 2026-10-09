/**
 * Ch4's four commodity cards.
 *
 * `fleet` is an array — primary code first; the first entry gets the
 * stamp on the card. `sceneId` is deliberately independent of `fleet`:
 * if a commodity's trailer turns out to be wrong (e.g. sulphur moving
 * from SL-104 to a bulk tipper class), only the code changes and the
 * scene stays. Tag codes are resolved against `data/fleet.ts` at render
 * time — never hardcode SL-104 here or in a component.
 */

import type { FleetCode } from "./fleet";
import type { CorridorId } from "./corridors";

export type CommodityId =
  | "sulphur"
  | "steel"
  | "fertilisers"
  | "machinery";

export type CommoditySceneId = "pour" | "stack" | "drop" | "ramp";

export type CommodityRecord = {
  id: CommodityId;
  /** Ghost number position in the deck, 1-based (rendered `01`). */
  index: number;
  name: string;
  /** Short form for the closing ticker (… · Machinery · + more). */
  tickerName: string;
  hook: string;
  fleet: FleetCode[];
  corridorId: CorridorId;
  sceneId: CommoditySceneId;
};

export const commodities: CommodityRecord[] = [
  {
    id: "sulphur",
    index: 1,
    name: "Sulphur granules",
    tickerName: "Sulphur",
    hook: "Yellow, gritty, and always on schedule.",
    // TBC — containerised only; see the note in data/fleet.ts.
    fleet: ["SL-104"],
    corridorId: "mpumalanga-durban",
    sceneId: "pour",
  },
  {
    id: "steel",
    index: 2,
    name: "Steel",
    tickerName: "Steel",
    hook: "Heavy, blunt, and perfectly balanced.",
    fleet: ["FD-120"],
    corridorId: "durban-gauteng",
    sceneId: "stack",
  },
  {
    id: "fertilisers",
    index: 3,
    name: "Fertilisers",
    tickerName: "Fertilisers",
    hook: "Bagged, palletised, kept dry.",
    fleet: ["TL-13"],
    corridorId: "durban-freestate",
    sceneId: "drop",
  },
  {
    id: "machinery",
    index: 4,
    name: "Mining machinery",
    tickerName: "Machinery",
    hook: "Oversized, overweight, and on the low deck.",
    fleet: ["LB-36"],
    corridorId: "durban-kasumbalesa",
    sceneId: "ramp",
  },
];
