/**
 * Portfolio — previous jobs as rate records. (LANDING_LAYOUT.md section 10.)
 *
 * Client names and logos match the supplied logo files in
 * `/images/portfolio/` (one per job, titles as written on each logo).
 * Job 1 (DMS Powders) is real; jobs 2–8 keep placeholder routes,
 * cargo and figures until replaced with verified records.
 *
 * Logo titles read off the artwork: DMS Powders, Apex Commodities,
 * Consulmet, Malaxino, Surya Mine (tagline cropped, name from file),
 * Eagle African Resources, Rawbank, Bono.
 */

export type Job = {
  id: string;
  /** Full legal name, shown as written. */
  client: string;
  /** Logo path, e.g. "/images/portfolio/dms-powder-logo.avif". */
  logo: string | null;
  /** Origin, e.g. "Mayerton, SA". */
  from: string;
  /** Destination, e.g. "Tenke, DRC". */
  to: string;
  /** Commodity, e.g. "Sulphur granules". */
  cargo: string;
  /** Trailer and capacity, e.g. "Side Tipper: 34 ton". */
  truck: string;
  /** What others quoted. */
  marketRate: number;
  /** Our rate. */
  ourRate: number;
  /** Currency symbol, e.g. "R". */
  currency: string;
  /** Rate basis, e.g. "per load". */
  per: string;
};

/** Backwards-compatible alias. */
export type JobRecord = Job;

export const jobs: Job[] = [
  {
    id: "dms-powders",
    client: "DMS Powders",
    logo: "/images/portfolio/dms-powder-logo.avif",
    from: "Mayerton, SA",
    to: "Tenke, DRC",
    cargo: "Sulphur granules",
    truck: "Side Tipper: 34 ton",
    marketRate: 260000,
    ourRate: 240000,
    currency: "R",
    per: "per load",
  },
  // PLACEHOLDER: replace with real figures
  {
    id: "agri-fertiliser",
    client: "Apex Commodities",
    logo: "/images/portfolio/apex-commodities-logo.avif",
    from: "Durban",
    to: "Lusaka",
    cargo: "Bulk fertiliser",
    truck: "Tautliner: 30 ton",
    marketRate: 198000,
    ourRate: 180000,
    currency: "R",
    per: "per load",
  },
  // PLACEHOLDER: replace with real figures
  {
    id: "cement-spares",
    client: "Consulmet",
    logo: "/images/portfolio/consulmet-logo.avif",
    from: "Durban",
    to: "Kitwe",
    cargo: "Crusher spares",
    truck: "Flat deck: 28 ton",
    marketRate: 165000,
    ourRate: 150000,
    currency: "R",
    per: "per load",
  },
  // PLACEHOLDER: replace with real figures
  {
    id: "solar-panels",
    client: "Malaxino",
    logo: "/images/portfolio/malaxino-logo.avif",
    from: "Maputo",
    to: "Harare",
    cargo: "Solar panels",
    truck: "Tautliner: 30 ton",
    marketRate: 231000,
    ourRate: 210000,
    currency: "R",
    per: "per load",
  },
  // PLACEHOLDER: replace with real figures
  {
    id: "mining-drill",
    client: "Surya Mine",
    logo: "/images/portfolio/surya-mine-logo.avif",
    from: "Walvis Bay",
    to: "Lubumbashi",
    cargo: "Drill rig, oversize",
    truck: "Lowbed: 60 ton",
    marketRate: 352000,
    ourRate: 320000,
    currency: "R",
    per: "per load",
  },
  // PLACEHOLDER: replace with real figures
  {
    id: "food-aid",
    client: "Eagle African Resources",
    logo: "/images/portfolio/eagle-african-resources-logo.avif",
    from: "Beira",
    to: "Lilongwe",
    cargo: "Maize grain, bulk",
    truck: "Side Tipper: 34 ton",
    marketRate: 154000,
    ourRate: 140000,
    currency: "R",
    per: "per load",
  },
  // PLACEHOLDER: replace with real figures
  {
    id: "fuel-tankers",
    client: "Rawbank",
    logo: "/images/portfolio/rawbank-logo.avif",
    from: "Dar es Salaam",
    to: "Lusaka",
    cargo: "Diesel, HAZMAT",
    truck: "Tanker: 40 000 L",
    marketRate: 209000,
    ourRate: 190000,
    currency: "R",
    per: "per load",
  },
  // PLACEHOLDER: replace with real figures
  {
    id: "steel-rebar",
    client: "Bono",
    logo: "/images/portfolio/bono-logistic-logo.avif",
    from: "Durban",
    to: "Gaborone",
    cargo: "Reinforced steel",
    truck: "Flat deck: 28 ton",
    marketRate: 192500,
    ourRate: 175000,
    currency: "R",
    per: "per load",
  },
];

/* ─── Computed rate figures — never typed by hand ─── */

export function jobSaving(job: Job): number {
  return job.marketRate - job.ourRate;
}

export function jobSavingPct(job: Job): number {
  return Math.round((jobSaving(job) / job.marketRate) * 100);
}

/** Thousands separated by a non-breaking space, e.g. `260 000`. */
export function formatRate(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}

/* ─── Copy ─── */

export const portfolioCopy = {
  eyebrow: "PORTFOLIO",
  heading: "Jobs We've Carried",
  standfirst: "A short list of the heavy ones.",
  cta: "Ask dispatch for the full record",
} as const;
