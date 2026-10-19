/**
 * Single source of truth for the fleet and what it carries.
 *
 * Ch3's spec panel (`components/engine/engineAssets.ts`) and Ch4's
 * commodity cards (`data/commodities.ts`) both read from here, so the
 * trailer a card stamps and the trailer the spec panel shows can never
 * drift apart. Edit the record once; both chapters follow.
 */

export type FleetId = "side-tipper" | "flatdeck" | "lowbed" | "tautliner";

export type FleetCode = "ST-34" | "FD-120" | "LB-36" | "TL-13";

export type FleetClassRecord = {
  id: FleetId;
  code: FleetCode;
  name: string;
  summary: string;
  /** Public photo used by Ch3's frame — the SVG rig stays as the rail thumb. */
  image: string;
  payloadT: number;
  deckLengthM: number;
  loadingHeightM: number;
  axles: string;
  /** Rendered as Ch3's "Typical commodity" row, joined with " · ". */
  commodities: string[];
};

export const fleetClasses: FleetClassRecord[] = [
  {
    id: "side-tipper",
    code: "ST-34",
    name: "Side tipper",
    summary:
      "High-walled bulk body that tips off the flank. Load it from the side, run it long.",
    image: "/fleet/side_tipper.avif",
    payloadT: 34,
    deckLengthM: 13.6,
    loadingHeightM: 1.35,
    axles: "6×4 tractor · tri-axle bogie",
    commodities: [
      "sulphur granules",
      "bagged grain",
      "mining spares",
      "aggregates",
    ],
  },
  {
    id: "flatdeck",
    code: "FD-120",
    name: "Flatdeck",
    summary:
      "Nothing built in. Lash points the length of the bed, for whatever the load turns out to be.",
    image: "/fleet/flatbed.avif",
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
    image: "/fleet/lowbed.avif",
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
    image: "/fleet/tautliner.avif",
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
