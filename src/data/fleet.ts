/**
 * Single source of truth for the fleet and what it carries.
 *
 * Ch3's spec panel (`components/engine/engineAssets.ts`) and Ch4's
 * commodity cards (`data/commodities.ts`) both read from here, so the
 * trailer a card stamps and the trailer the spec panel shows can never
 * drift apart. Edit the record once; both chapters follow.
 */

export type FleetId = "side-loader" | "flatdeck" | "lowbed" | "tautliner";

export type FleetCode = "SL-104" | "FD-120" | "LB-36" | "TL-13";

export type FleetClassRecord = {
  id: FleetId;
  code: FleetCode;
  name: string;
  summary: string;
  payloadT: number;
  deckLengthM: number;
  loadingHeightM: number;
  axles: string;
  /** Rendered as Ch3's "Typical commodity" row, joined with " · ". */
  commodities: string[];
};

export const fleetClasses: FleetClassRecord[] = [
  {
    id: "side-loader",
    code: "SL-104",
    name: "Side-loader",
    summary:
      "Deck stanchions and a swing ramp. Load it from the side, run it long.",
    payloadT: 26,
    deckLengthM: 13.6,
    loadingHeightM: 1.35,
    axles: "6×4 tractor · tri-axle bogie",
    commodities: [
      "Palletised freight",
      "bagged grain",
      "mining spares",
      // TBC — containerised only. If sulphur runs in bulk tippers,
      // SL-104 is the wrong tag: swap the commodity's fleet code, not
      // the scene (data/commodities.ts keeps sceneId independent).
      "sulphur granules",
    ],
  },
  {
    id: "flatdeck",
    code: "FD-120",
    name: "Flatdeck",
    summary:
      "Nothing built in. Lash points the length of the bed, for whatever the load turns out to be.",
    payloadT: 30,
    deckLengthM: 12,
    loadingHeightM: 1.4,
    axles: "6×4 tractor · tri-axle bogie",
    commodities: ["Steel coil", "structural steel", "timber"],
  },
  {
    id: "lowbed",
    code: "LB-36",
    name: "Lowbed",
    summary:
      "The bed drops under a metre. Everything above that clearance is yours to use.",
    // TBC: needs abnormal load permit above ~34–38 t.
    payloadT: 44,
    deckLengthM: 11,
    loadingHeightM: 0.95,
    axles: "6×6 tractor · detachable gooseneck",
    commodities: ["Plant & machinery", "transformers", "project cargo"],
  },
  {
    id: "tautliner",
    code: "TL-13",
    name: "Tautliner",
    summary:
      "Closed, ribbed and long. Volume that survives the distance and the weather.",
    payloadT: 27,
    deckLengthM: 13.6,
    loadingHeightM: 1.3,
    axles: "6×4 tractor · tri-axle bogie",
    commodities: [
      "Cartons",
      "drums",
      "palletised retail",
      "FMCG",
      "fertiliser",
    ],
  },
];

export function fleetById(id: string): FleetClassRecord | undefined {
  return fleetClasses.find((f) => f.id === id);
}

export function fleetByCode(code: FleetCode): FleetClassRecord | undefined {
  return fleetClasses.find((f) => f.code === code);
}
