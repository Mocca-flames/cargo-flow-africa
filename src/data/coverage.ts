/**
 * Coverage — "Where We Operate" (LANDING_LAYOUT.md section 9; spec in
 * COVERAGE.md).
 *
 * The buyer's question is "do you run MY route?", and this section is
 * the answer: an interactive footprint over the hillshade basemap, a
 * rail of countries, and a per-country record — border posts,
 * authority, clearance time, transit, one metric — ending in a CTA.
 * Territory GEOMETRY lives in `coverage-territories.ts` (generated
 * from Natural Earth data, projected into the basemap's pixel space).
 *
 * ALL RECORDS ARE PLACEHOLDER, marked TODO(copy) / TODO(verify): the
 * posts, authorities and clearance times must be confirmed with
 * dispatch before this section tells anyone a number.
 *
 * The two states are load-bearing (see COVERAGE.md): `active` countries
 * get real records and a "run this lane" CTA; `opening` countries get
 * an estimated record and a "plan this lane" CTA. There are no dead
 * ends — every country hands the buyer somewhere.
 */

/** The rail countries: five operating lanes, three opening. */
export type CoverageStatus = "active" | "opening";

export type CoverageCountry = {
  /** Matches `TerritoryId` in `coverage-territories.ts`. */
  id: string;
  name: string;
  status: CoverageStatus;
  /** Border post(s) we run through on this lane. TODO(verify) */
  posts: string[];
  /** The border authority at those posts. TODO(verify) */
  authority: string;
  /** Clearance reality, e.g. "2–4h". TODO(verify) */
  clearance: string;
  /** Door-to-door reality from Gauteng ports. TODO(verify) */
  transit: string;
  /** The one number this lane is known for. TODO(verify) */
  metric: { value: string; label: string };
  /** The CTA under the record. */
  cta: string;
};

export const railCountries: CoverageCountry[] = [
  {
    id: "BWA",
    name: "Botswana",
    status: "active",
    posts: ["Tlokweng", "Kazungula"],
    authority: "BURS",
    clearance: "2–4h — our fastest corridor",
    transit: "2–3 days from Gauteng",
    metric: { value: "120+", label: "Runs cleared, last 12 months" },
    cta: "Run this lane",
  },
  {
    id: "ZAF",
    name: "South Africa",
    status: "active",
    posts: ["Durban", "Richards Bay", "City Deep"],
    authority: "Home network",
    clearance: "Collection within 24h of booking",
    transit: "1–3 days inland",
    metric: { value: "24h", label: "Booking to collection" },
    cta: "Run this lane",
  },
  {
    id: "ZWE",
    name: "Zimbabwe",
    status: "active",
    posts: ["Beitbridge", "Plumtree", "Forbes–Mutare"],
    authority: "ZIMRA",
    clearance: "6–24h",
    transit: "3–5 days to Harare",
    metric: { value: "94%", label: "Clearances first attempt" },
    cta: "Run this lane",
  },
  {
    id: "ZMB",
    name: "Zambia",
    status: "active",
    posts: ["Chirundu", "Kazungula", "Victoria Falls"],
    authority: "ZRA",
    clearance: "4–8h",
    transit: "4–6 days to Lusaka",
    metric: { value: "480t/mo", label: "Consolidated northbound" },
    cta: "Run this lane",
  },
  {
    id: "COD",
    name: "DR Congo",
    status: "active",
    posts: ["Kasumbalesa"],
    authority: "OCC · DGDA",
    clearance: "24–72h",
    transit: "7–10 days to Kolwezi",
    metric: { value: "6", label: "Days saved vs the window (see portfolio)" },
    cta: "Run this lane",
  },
  {
    id: "MWI",
    name: "Malawi",
    status: "opening",
    posts: ["Mchinji"],
    authority: "MRA",
    clearance: "6–12h (estimated)",
    transit: "5–7 days to Lilongwe (estimated)",
    metric: { value: "Q4", label: "Target opening, subject to volume" },
    cta: "Plan this lane",
  },
  {
    id: "TZA",
    name: "Tanzania",
    status: "opening",
    posts: ["Tunduma"],
    authority: "TRA",
    clearance: "8–24h (estimated)",
    transit: "6–9 days to Dar es Salaam (estimated)",
    metric: { value: "Q4", label: "Target opening, subject to volume" },
    cta: "Plan this lane",
  },
  {
    id: "MOZ",
    name: "Mozambique",
    status: "opening",
    posts: ["Ressano Garcia"],
    authority: "AMI",
    clearance: "6–12h (estimated)",
    transit: "4–7 days to Maputo (estimated)",
    metric: { value: "Q4", label: "Target opening, subject to volume" },
    cta: "Plan this lane",
  },
];

/** Selected on first paint, mirroring the approved concept. */
export const DEFAULT_COUNTRY_ID = "BWA";

export function countryById(id: string): CoverageCountry | undefined {
  return railCountries.find((c) => c.id === id);
}

/* ─── Copy ─── */

export const coverageCopy = {
  eyebrow: "COVERAGE",
  heading: "Where We Operate",
  standfirst: "Five corridors running today. Three more opening.",
  /** Footer note under the map. TODO(copy) */
  note: "Posts, authorities and clearance times maintained with dispatch.",
  /** Legend labels. */
  legendActive: "Active lane",
  legendOpening: "Opening lane",
} as const;
