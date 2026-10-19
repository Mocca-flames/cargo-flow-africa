import { fleetClasses, type FleetClassRecord } from "@/data/fleet";

export type EngineStat = {
  label: string;
  value: number;
  decimals: number;
  unit: string;
};

export type EngineMeta = {
  label: string;
  value: string;
};

export type EngineAsset = {
  id: string;
  code: string;
  name: string;
  summary: string;
  image: string;
  deckLengthM: number;
  loadingHeightM: number;
  stats: EngineStat[];
  meta: EngineMeta[];
};

/**
 * The spec readout and the blueprint are two views of the same numbers,
 * so the three counted stats are derived from one source. Edit the
 * record in data/fleet.ts, never this file — otherwise the drawing and
 * the panel disagree. Ch4's commodity cards read that same record, so
 * a stamped fleet tag always names a trailer this panel can show.
 */
function asset(record: FleetClassRecord): EngineAsset {
  const {
    payloadT,
    deckLengthM,
    loadingHeightM,
    axles,
    commodities,
    ...rest
  } = record;
  return {
    ...rest,
    deckLengthM,
    loadingHeightM,
    stats: [
      { label: "Payload", value: payloadT, decimals: 0, unit: "t" },
      { label: "Deck length", value: deckLengthM, decimals: 1, unit: "m" },
      { label: "Loading height", value: loadingHeightM, decimals: 2, unit: "m" },
    ],
    meta: [
      { label: "Axle config", value: axles },
      { label: "Typical commodity", value: commodities.join(" · ") },
    ],
  };
}

export const engineAssets: EngineAsset[] = fleetClasses.map(asset);
