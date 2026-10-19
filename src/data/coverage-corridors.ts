/**
 * Coverage corridor geometry — GENERATED, do not hand-edit.
 *
 * Source: `map_build/corridors-input.json` (dispatch-approved places
 * and corridors), projected by `map_build/build_corridors.js` through
 * `map_build/projection.js` — the SAME Web-Mercator maths and corner
 * coordinates (map_manifest.json, city-verified) that
 * `build_coverage.js` uses — into the pixel space of the hillshade
 * basemap. Every coordinate is projected data, not drawing.
 *
 * The viewBox is 5000×6111 — the desktop render's pixel space, shared
 * with `coverage-territories.ts`.
 */

export type PlaceType = "hub" | "city" | "border";

export type Place = {
  /** Display name. */
  name: string;
  /** `hub` = HQ, `city` = waypoint, `border` = border post. */
  type: PlaceType;
  /** Projected x in MAP_SPACE pixels. */
  x: number;
  /** Projected y in MAP_SPACE pixels. */
  y: number;
};

/** Every place, by id, projected into the basemap's pixel space. */
export const PLACES: Record<string, Place> = {
  "jhb": { name: "Johannesburg HQ", type: "hub", x: 3596, y: 3700 },
  "gbe": { name: "Gaborone HQ", type: "hub", x: 3176, y: 3355 },
  "wdh": { name: "Windhoek", type: "city", x: 1426.5, y: 2909.5 },
  "hre": { name: "Harare", type: "city", x: 4189.5, y: 1913.5 },
  "byo": { name: "Bulawayo", type: "city", x: 3710, y: 2394.5 },
  "lun": { name: "Lusaka", type: "city", x: 3650, y: 1410 },
  "lub": { name: "Lubumbashi", type: "city", x: 3483.5, y: 653 },
  "beitbridge": { name: "Beitbridge", type: "border", x: 3981.5, y: 2836.5 },
  "skilpadshek": { name: "Skilpadshek", type: "border", x: 3124, y: 3486.5 },
  "ramatlabama": { name: "Ramatlabama", type: "border", x: 3114.5, y: 3569.5 },
  "nakop": { name: "Nakop", type: "border", x: 2002, y: 4121 },
  "kazungula": { name: "Kazungula", type: "border", x: 3047, y: 1905 },
  "plumtree": { name: "Plumtree", type: "border", x: 3550, y: 2468.5 },
  "buitepos": { name: "Buitepos", type: "border", x: 2006, y: 2832.5 },
  "katima": { name: "Katima Mulilo", type: "border", x: 2851.5, y: 1843 },
  "chirundu": { name: "Chirundu", type: "border", x: 3754.5, y: 1542.5 },
  "kasumbalesa": { name: "Kasumbalesa", type: "border", x: 3547, y: 775 },
};

export type Corridor = {
  /** Corridor name. */
  name: string;
  /** The main route: place ids, in order. */
  main: string[];
  /** Feeder routes: each a list of place ids, in order. */
  feeders: string[][];
  /** Straight-segment SVG path of the main route ("M x y L x y …"). */
  d: string;
  /** One straight-segment SVG path per feeder route, in feeder order. */
  feederD: string[];
};

/** The four corridors, by id, with their projected SVG paths. */
export const CORRIDORS: Record<string, Corridor> = {
  "A": {
    name: "North-South",
    main: ["jhb", "beitbridge", "hre", "chirundu", "lun", "kasumbalesa", "lub"],
    feeders: [

    ],
    d: "M 3596 3700 L 3981.5 2836.5 L 4189.5 1913.5 L 3754.5 1542.5 L 3650 1410 L 3547 775 L 3483.5 653",
    feederD: [],
  },
  "B": {
    name: "Kazungula",
    main: ["gbe", "kazungula", "lun", "kasumbalesa", "lub"],
    feeders: [
      ["jhb", "skilpadshek", "gbe"],
      ["jhb", "ramatlabama", "gbe"],
    ],
    d: "M 3176 3355 L 3047 1905 L 3650 1410 L 3547 775 L 3483.5 653",
    feederD: ["M 3596 3700 L 3124 3486.5 L 3176 3355", "M 3596 3700 L 3114.5 3569.5 L 3176 3355"],
  },
  "C": {
    name: "Trans-Kalahari",
    main: ["gbe", "buitepos", "wdh", "katima", "lun", "kasumbalesa", "lub"],
    feeders: [
      ["jhb", "nakop", "wdh"],
    ],
    d: "M 3176 3355 L 2006 2832.5 L 1426.5 2909.5 L 2851.5 1843 L 3650 1410 L 3547 775 L 3483.5 653",
    feederD: ["M 3596 3700 L 2002 4121 L 1426.5 2909.5"],
  },
  "D": {
    name: "Zimbabwe",
    main: ["gbe", "plumtree", "byo", "chirundu", "lun", "kasumbalesa", "lub"],
    feeders: [

    ],
    d: "M 3176 3355 L 3550 2468.5 L 3710 2394.5 L 3754.5 1542.5 L 3650 1410 L 3547 775 L 3483.5 653",
    feederD: [],
  },
};
