/**
 * Wide-frame corridor geometry — GENERATED, do not hand-edit.
 *
 * Source: `map_build/corridors-input-wide.json` (places and corridors,
 * Durban port included), projected by
 * `map_build/build_corridors_wide.js` through
 * `map_build/projection_wide.js` — the SAME Web-Mercator maths and
 * frame (map_manifest_wide.json, W5/E44/N-8/S-32) that
 * `build_coverage_wide.js` uses — into the pixel space of the wide
 * hillshade basemap. Every coordinate is projected data, not drawing.
 *
 * The viewBox is 6000×3966 — the wide desktop render's pixel space,
 * shared with `coverage-territories-wide.ts`.
 */

export type PlaceType = "hub" | "city" | "border" | "port";

export type Place = {
  /** Display name. */
  name: string;
  /** `hub` = HQ, `city` = waypoint, `border` = border post, `port` = seaport. */
  type: PlaceType;
  /** Projected x in MAP_SPACE pixels. */
  x: number;
  /** Projected y in MAP_SPACE pixels. */
  y: number;
};

/** Every place, by id, projected into the wide basemap's pixel space. */
export const PLACES: Record<string, Place> = {
  "jhb": { name: "Johannesburg HQ", type: "hub", x: 3545.5, y: 2945 },
  "gbe": { name: "Gaborone HQ", type: "hub", x: 3219, y: 2676.5 },
  "wdh": { name: "Windhoek", type: "city", x: 1856.5, y: 2329.5 },
  "hre": { name: "Harare", type: "city", x: 4008, y: 1553.5 },
  "byo": { name: "Bulawayo", type: "city", x: 3635, y: 1928 },
  "lun": { name: "Lusaka", type: "city", x: 3588, y: 1161.5 },
  "lub": { name: "Lubumbashi", type: "city", x: 3458.5, y: 571.5 },
  "beitbridge": { name: "Beitbridge", type: "border", x: 3846, y: 2272.5 },
  "skilpadshek": { name: "Skilpadshek", type: "border", x: 3178.5, y: 2778.5 },
  "ramatlabama": { name: "Ramatlabama", type: "border", x: 3171, y: 2843 },
  "nakop": { name: "Nakop", type: "border", x: 2304.5, y: 3272.5 },
  "kazungula": { name: "Kazungula", type: "border", x: 3118.5, y: 1547 },
  "plumtree": { name: "Plumtree", type: "border", x: 3510.5, y: 1985.5 },
  "buitepos": { name: "Buitepos", type: "border", x: 2307.5, y: 2269.5 },
  "katima": { name: "Katima Mulilo", type: "border", x: 2966, y: 1498.5 },
  "chirundu": { name: "Chirundu", type: "border", x: 3669, y: 1264.5 },
  "kasumbalesa": { name: "Kasumbalesa", type: "border", x: 3507.5, y: 667 },
  "dbn": { name: "Durban", type: "port", x: 4003.5, y: 3582 },
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
      ["dbn", "jhb"],
    ],
    d: "M 3545.5 2945 L 3846 2272.5 L 4008 1553.5 L 3669 1264.5 L 3588 1161.5 L 3507.5 667 L 3458.5 571.5",
    feederD: ["M 4003.5 3582 L 3545.5 2945"],
  },
  "B": {
    name: "Kazungula",
    main: ["gbe", "kazungula", "lun", "kasumbalesa", "lub"],
    feeders: [
      ["jhb", "skilpadshek", "gbe"],
      ["jhb", "ramatlabama", "gbe"],
      ["dbn", "jhb"],
    ],
    d: "M 3219 2676.5 L 3118.5 1547 L 3588 1161.5 L 3507.5 667 L 3458.5 571.5",
    feederD: ["M 3545.5 2945 L 3178.5 2778.5 L 3219 2676.5", "M 3545.5 2945 L 3171 2843 L 3219 2676.5", "M 4003.5 3582 L 3545.5 2945"],
  },
  "C": {
    name: "Trans-Kalahari",
    main: ["gbe", "buitepos", "wdh", "katima", "lun", "kasumbalesa", "lub"],
    feeders: [
      ["jhb", "nakop", "wdh"],
      ["dbn", "jhb"],
    ],
    d: "M 3219 2676.5 L 2307.5 2269.5 L 1856.5 2329.5 L 2966 1498.5 L 3588 1161.5 L 3507.5 667 L 3458.5 571.5",
    feederD: ["M 3545.5 2945 L 2304.5 3272.5 L 1856.5 2329.5", "M 4003.5 3582 L 3545.5 2945"],
  },
  "D": {
    name: "Zimbabwe",
    main: ["gbe", "plumtree", "byo", "chirundu", "lun", "kasumbalesa", "lub"],
    feeders: [
      ["dbn", "jhb"],
    ],
    d: "M 3219 2676.5 L 3510.5 1985.5 L 3635 1928 L 3669 1264.5 L 3588 1161.5 L 3507.5 667 L 3458.5 571.5",
    feederD: ["M 4003.5 3582 L 3545.5 2945"],
  },
};
