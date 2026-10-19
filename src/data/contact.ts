/**
 * Contact — "Talk to Dispatch, or Visit Us" (LANDING_LAYOUT.md §13).
 *
 * Post-Verdict utility close, NOT a sales section: Verdict stays the
 * exhale (form only); this is the dense footer-adjacent close for
 * buyers who skip the form and want a human or a door to walk through.
 *
 * Three tiers, escalating commitment:
 *   1. Ready to move → anchor back up to `#verdict-section` (never a
 *      second form here).
 *   2. Contact directly → three people (Evah, Fred, Junior) with
 *      email / WhatsApp / direct call.
 *   3. Visit us → Botswana + Johannesburg branch cards.
 *
 * MAP NOTE: no geographic map here by design (LANDING_LAYOUT rejects
 * a second geography — Coverage owns the page's one map). Branches get
 * photo placeholders + "Get directions" maps links instead.
 */

export type ChannelId = "email" | "whatsapp" | "call";

export type PersonRecord = {
  id: string;
  /** Display name, e.g. "Evah". */
  name: string;
  /** Role, e.g. "Operations". */
  role: string;
  /** Email address. */
  email: string;
  /** Phone number in display form, e.g. "+27 72 937 7143". */
  phone: string;
  /** Phone number in tel: form (digits only, leading +). */
  phoneHref: string;
  /** WhatsApp number in wa.me form (digits only, no +). */
  whatsappNumber: string;
};

export type BranchRecord = {
  id: string;
  /** e.g. "Gaborone" — TODO(owner: city). */
  city: string;
  /** e.g. "Botswana" / "South Africa". */
  country: string;
  /** Exactly one branch carries the HQ tag. TODO(owner: which is HQ?). */
  isHq: boolean;
  /** Street lines. TODO(owner) */
  address: string[];
  /** e.g. "Mon–Fri 08:00–17:00". TODO(owner) */
  hours: string;
  /** Tap-to-call value. TODO(owner) */
  phone: string;
  /** Google Maps link. TODO(owner) */
  mapsUrl: string;
  /**
   * HQ / branch photo captured by the team. Drop the file at the path
   * below and set it here — until then the card renders the
   * `[TBC PHOTO]` placeholder frame (Engine/Portfolio convention).
   * TODO(owner): team capture.
   */
  photoSrc: string | null;
  photoAlt: string;
};

/** Default WhatsApp opener message for all contacts. */
export const WHATSAPP_OPENER =
  "Hi Cargo Flow Africa, I am from your website and was looking for more information.";

export const people: PersonRecord[] = [
  {
    id: "evah",
    name: "Evah",
    role: "Operations",
    email: "evah@cargoflowafrica.co.za",
    phone: "+27 72 937 7143",
    phoneHref: "+27729377143",
    whatsappNumber: "27729377143",
  },
  {
    id: "fred",
    name: "Fred",
    role: "Director",
    email: "fred@cargoflowafrica.co.za",
    phone: "+267 73 002 367",
    phoneHref: "+26773002367",
    whatsappNumber: "26773002367",
  },
  {
    id: "junior",
    name: "Junior",
    role: "Manager",
    email: "junior@cargoflowafrica.co.za",
    phone: "+27 81 758 4591",
    phoneHref: "+27817584591",
    whatsappNumber: "27817584591",
  },
];

export const branches: BranchRecord[] = [
  {
    id: "botswana",
    city: "Gaborone",
    country: "Botswana",
    isHq: true,
    address: ["Plot 0000, Block 0", "Gaborone, Botswana"],
    hours: "Mon–Fri 08:00–17:00",
    phone: "+267 73 002 367",
    // TODO(owner): replace with exact lat,lng once confirmed.
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Gaborone,Botswana",
    photoSrc: "/images/branch/gaborone_office.avif",
    photoAlt: "Cargo Flow Africa Gaborone office exterior",
  },
  {
    id: "johannesburg",
    city: "Johannesburg",
    country: "South Africa",
    isHq: false,
    address: ["00 Example Road, Jet Park", "Johannesburg, South Africa"],
    hours: "Mon–Fri 08:00–17:00",
    phone: "+27 72 937 7143",
    // TODO(owner): replace with exact lat,lng once confirmed.
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Johannesburg,South+Africa",
    photoSrc: "/images/branch/johannesburg_office.avif",
    photoAlt: "Cargo Flow Africa Johannesburg office exterior",
  },
];

/* ─── Copy ─── */

export const contactCopy = {
  eyebrow: "CONTACT",
  heading: "Talk to Dispatch — or Come See Us",
  standfirst: "Skip the form if you prefer. A human answers.",
  /** Tier 1 — anchor back up to the Verdict form. */
  readyLabel: "Ready to move?",
  readyCta: "Start at step 01 — the quote form",
  /** Tier 2 heading. */
  directHeading: "Or reach out directly",
  /** Tier 3 heading. */
  visitHeading: "Visit our offices",
  /** Schematic connector label (not a map). */
  linkLabel: "HQ ↔ JHB · 2 branches",
  /** Branch card overlay CTA. */
  directionsCta: "View on Google Maps",
  callCta: "Call branch",
  tbcPhoto: "[TBC PHOTO]",
  hoursLabel: "Hours",
  /** Person card channel labels. */
  emailLabel: "Email",
  whatsappLabel: "WhatsApp",
  callLabel: "Call",
} as const;
