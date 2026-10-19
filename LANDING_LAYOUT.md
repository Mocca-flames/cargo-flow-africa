# Cargo Flow Africa — Landing Page Layout & Section Order

**Status:** current governing doc for the landing page. This version
replaces the old story-arc draft entirely (see "What changed" below).

**Relationship to other docs:** DESIGN.md is canonical for how things
*look* (color, type, spacing, motion tokens). This file governs
*section order, layout intent, and conversion purpose* — which sections
exist, in what order, what job each one does, and how they hand off to
each other. Where the two disagree on a value, DESIGN.md wins.

**The job of this page:** get clients. Every section earns the scroll
by answering the buyer's next question. If a section answers no
question, it doesn't ship.

---

## What changed from the old draft (read once, then forget it)

- **The emotional-arc spine is retired.** "Desperation → fear → relief
  → climax → close" is gone. It was a useful writing exercise but it
  produced an order that served the story, not the buyer. Replaced by
  the buyer-question sequence below.
- **Chapter numbers are dead.** The old doc's "Ch1–Ch7" numbering
  contradicted the live page (which also runs Services before Premise)
  and every new section would have renumbered everything again.
  Sections are identified by **name only**. Eyebrow labels in the UI
  use section names, never "04 / PROOF" style numbers. Existing
  hardcoded numbers in built components (e.g. the `04 / PROOF` eyebrow
  in `src/components/proof`, `data-chapter="6"` on
  `src/components/corridor/CorridorRun.tsx`) are copy debt to clean up
  opportunistically — they do not re-enter this doc as a system.
- **The build-status table is now part of the doc.** The old version
  described sections that didn't match the DOM, which is what made it
  confusing to build from. This file always states what is shipped vs
  what is planned.

---

## The governing rule: one buyer question per section, in order

The page is a sales conversation. Each section answers exactly one
question the buyer is asking at that moment. The order below is the
order those questions actually get asked.

| # | Section | Buyer's question | The answer it must land |
|---|---|---|---|
| 1 | Hero | Who are you? | We move heavy freight across southern Africa's corridors. *(frozen)* |
| 2 | Services | What do you actually do? | Clearance, consolidation, corridor runs. *(frozen)* |
| 3 | Premise | Is my problem understood? | The world of missed cut-offs and broker roulette. |
| 4 | Threat | Why not just use a broker? | Named risk, side by side with the Cargo Flow standard. |
| 5 | Engine | Can you physically handle it? | The fleet, inspectable, spec by spec. |
| 6 | Proof | Do you handle *my* commodity? | Sulphur, steel, fertiliser, machinery — each tied to the trailer it rides on. |
| 7 | Loads | Is your consolidation real? | A literal load plan filling slot by slot. |
| 8 | Corridor | Can you get it across the border? | One lane, end to end: gates, blockade, clearance, delivery. |
| 9 | **Coverage** | Do you run *my* route? | An interactive footprint: countries, border posts, authorities, clearance times. **(NEW — to build)** |
| 10 | **Portfolio** | Has anyone like me used you? | Previous huge jobs + named testimony. **(NEW — to build)** |
| 11 | **Process** | What happens after I enquire? | Three steps from spec to truck rolling. **(NEW — to build)** |
| 12 | Verdict | How do I start? | The quote form. The quietest section on the page. |
| 13 | **Contact** | What if I just want to talk or visit? | Direct channels (email, WhatsApp, call) + 2 branches (Botswana, Johannesburg). **(NEW — to build, post-Verdict utility close)** |

Sections 1–8 are shipped and frozen/built. Sections 9–11 are the new
work. Section 12 is built and stays as-is. Section 13 is new planned
work — a short utility close after Verdict, not a sales section.

**Final DOM order for `src/app/page.tsx`:**

```
HeroScene
ServicesSection
PremiseSection
ThreatSection
FleetHeading
EngineSection
ProofSection
LoadsSection
CorridorSection
CoverageSection      ← NEW
PortfolioSection     ← NEW
ProcessSection       ← NEW
VerdictSection
ContactSection       ← NEW (post-Verdict utility close)
```

Note the placement logic: the three new sections are appended **after
Corridor**, so nothing existing is renumbered, remounted, or restyled
to make room. Coverage follows Corridor deliberately — Corridor is the
*story* of one flagship lane; Coverage is the *zoom-out* to the whole
footprint. The escalation only works in that order. Contact is appended
**after Verdict** deliberately — Verdict stays the exhale (form only);
Contact is the utility close for buyers who skip the form and want a
human or a door to walk through. It must never pull form, proof, or
sales copy back into Verdict to make room.

---

## Build status of every section

| Section | Component | Status | Notes |
|---|---|---|---|
| Hero | `src/components/hero` | Shipped, **frozen** | Do not touch. |
| Services | `src/components/services` | Shipped, **frozen** | |
| Premise | `src/components/premise` | Shipped | |
| Threat | `src/components/threat` | Shipped | Mirrored split, pinned wipe. |
| Fleet band | `src/components/fleet` | Shipped | Standalone title band between Threat and Engine. |
| Engine | `src/components/engine` | Shipped | Holds the page's only root scroll-snap point. |
| Proof | `src/components/proof` | Shipped | Closing "Where it goes →" link must be retargeted to Coverage when Coverage mounts (see Open Questions). |
| Loads | `src/components/loads` | Shipped | Contains an explicitly **unmounted** geographic map component (`CorridorMap.tsx`). It stays unmounted — see Coverage. |
| Corridor | `src/components/corridor` | Shipped | Symbolic route scene, longest pinned sequence. |
| Coverage | — | **To build** | Spec below. |
| Portfolio | — | **To build** | Spec below. |
| Process | — | **To build** | Spec below. |
| Verdict | `src/components/verdict` | Shipped | Form + WhatsApp; mono stat placeholder stays empty until Portfolio data exists. |
| Contact | `src/components/contact` | **Shipped (v1)** | Post-Verdict utility close. Data in `src/data/contact.ts` all `[TODO owner]`. |
| WhatsApp FAB | system-level | Shipped | Rules below. |

---

## Pacing rules (the honest version)

The old doc had a density curve tied to the retired story arc. What's
still true, and still enforced:

- **Pinned sequences are capped at two: Loads and Corridor.** No new
  section may pin. The page is already long — appending three more
  sections is only acceptable because they're contained and short.
- **Everything else is contained, ~90–130svh.** No scroll-jacking, no
  scrub on mobile (see SERVICE.md for the mobile scroll policy that
  governs here too).
- **Verdict stays the shortest and emptiest *sales* section on the page.** It
  is the exhale, not a sales wall. Contact (Section 13) sits after it
  as a post-conversion utility close — short, dense, footer-adjacent —
  and is exempt from the "Verdict is shortest" comparison. Nothing
  moves from Contact back into Verdict.
- **Adjacent sections must not repeat the same layout shape.** If two
  neighbours could be mistaken for each other, change one of them —
  this rule is what the Corridor → Coverage seam needs most (see
  Transitions).
- **Reduced motion:** every pinned/scrubbed/pinned sequence needs a
  static fallback state that shows the final composition on load.
  Already implemented per section; keep it that way when editing.

---

## Section specs — existing sections (condensed, for reference)

**Premise.** Full-bleed, no kicker, no proof layer. Headline low and
understated. The problem stated before the brand speaks.

**Threat.** Mirrored bilateral split — desaturated broker gamble
(desaturated, tight framing) vs. the Cargo Flow standard (full color,
open framing). Pinned ~150vh, scroll-scrubbed wipe. Tension comes from
color and framing, never from tilt or disorientation.

**Engine.** Left-anchored fleet switcher with spec panel. The page's
only root `scroll-snap-align` point (proximity). Snappy, interaction-
paced. Quiet text link to `/fleet`.

**Proof.** Commodity deck — mobile horizontal snap deck (inner
container), desktop staggered diagonal. Each card tags back to the
trailer from Engine. Ends on a commodity ticker + "Where it goes →"
link. **Link retarget: to Coverage (not Corridor) once Coverage
mounts.**

**Loads.** The breath: vast whitespace, one flat load plan on the
flatdeck, slots S1–S3 filling counter-driven. Pinned ~130vh, slow and
weighted. Quiet link to `/loads`.

**Corridor & Clearance.** The climax of the shipped page, and the
emotional peak of the whole site. Symbolic route scene — diagonal-split
fear opening (border queues, blockade) resolving into the full route
draw with gates and clearance markers, ending at Lubumbashi. ~200vh
pinned. Quiet link to `/corridors`. **This is not a geographic map and
must never be redrawn as one — that's Coverage's job.**

---

## Section specs — new sections (to build)

### 9 — Coverage / "Where We Operate"

**STATUS: built (v1 skeleton)** — spec and build map in `COVERAGE.md`.
Components in `src/components/coverage/`, records in `src/data/coverage.ts`
(all TODO). The basemap and country geometry are real, not drawn:
hillshade from `map_build/`, Natural Earth outlines projected into the
basemap's pixel space by `map_build/build_coverage.js` (regenerate with
`node map_build/build_coverage.js`).

**Purpose:** answer "do you run my route?" in one glance, and end with
a WhatsApp lead for every country — active or not.

**Concept (approved):** an interactive map of southern Africa.

- **The map:** terrain map of the region covering South Africa,
  Zimbabwe, Zambia, DRC, Botswana, Malawi, Tanzania, Mozambique.
  Countries are stroked paths over the terrain; the **selected country
  outline glows** (accent orange for active, hollow/muted for
  expanding).
- **The country rail:** left-side list of country names as **real
  text** (not SVG-only labels) — required for SEO and screen readers.
  Hover or click selects that country; the map outline follows.
- **The country card** (bottom-left): fixed schema —
  `Country → border post(s) → authority → clearance/transit time →
  status`. Format follows the approved example: *"Active — Tlokweng &
  Kazungula, BURS clearance, 2–4h fastest corridor."*

**Two states, no dead ends:**

- **Active** (orange): real operational data, full card, ends with a
  **"Run this lane" WhatsApp deep-link** prefilled with the country
  name and lane.
- **Expanding** (muted, hollow outline): card reads as a lane opening,
  not a rejection — *"This lane is opening. Tell us your volume."* —
  with the same WhatsApp deep-link. A planned lane is still a lead.

**What this section must NOT do:**
- Must not become a second geography of Corridor. Corridor is one
  symbolic lane; this is the footprint. Different treatment, different
  content.
- The existing unmounted `loads/CorridorMap.tsx` is the only other
  geographic map component in the repo — it **stays unmounted**.
  Coverage owns the page's one map.
- The card answers WHERE only. Fleet class, tonnage, past jobs → that's
  Portfolio's job. No card creep.

**Layout/rhythm:** contained, ~110svh, no pin. Left rail + map + card,
desktop. Mobile: rail becomes horizontal scroll chips, map becomes the
backdrop, card becomes a bottom sheet. Adjacent to Corridor (full-bleed
dark, organic) — Coverage must change shape treatment on purpose so the
two map-adjacent sections never blur together (see Transitions).

**Assets:** basemap is the user-built hillshade
(`public/southern-africa-hillshade-{5000,1600}.webp`, SRTM via
terrarium tiles, Web Mercator, city-verified in `map_manifest.json`).
Country data (posts, authorities, clearance times, active/expanding
status) `[TBC dispatch]`. **Open palette decision:** the dark terrain
field makes this the page's second dark section — either document a
DESIGN.md exception (like the WhatsApp green) or decide the field is
light; see COVERAGE.md "Open decisions".

### 10 — Portfolio / "Previous Huge Jobs"

**Purpose:** prove someone like the buyer already ships with us —
with names and numbers, not adjectives.

- **2–3 jobs maximum. One flagship.** A wall of logos is noise.
- **Every job carries the same record:** client (company **and**
  named role), commodity + tonnage, route + border posts crossed,
  dates, and **one outcome metric** (delay avoided, cost variance,
  uptime). One number per job, not a stats wall.
- **Testimony rule:** quotes are attributed — real person, real role,
  real company, tied to the job record above. Anonymous testimonial =
  fabricated testimonial; does not ship.
- **Credentials strip, folded in:** permits, abnormal-load escort,
  cross-border documentation, insurance — one quiet strip alongside
  the jobs. Which apply `[TBC]`. It lives here, not as its own orphan
  section and never inside Verdict.
- **Rhythm:** editorial card layout, ~130svh max, contained, no pin.
  Medium density — it sits between a map and a 3-step strip, so it
  must feel like paper, not screen.
- **Optional:** quiet link to a fuller portfolio sub-page if/when one
  exists `[TBC]`.

### 11 — Process / "How a Job Runs"

**Purpose:** answer the last friction question before the CTA — "what
actually happens after I hit send?"

- **Three steps, one screen, contained (~90svh), no pin.** Numbered
  horizontal or vertical strip.
- **Skeleton (copy `[TBC]` later):** 01 Send the spec → 02 We plan the
  load, route and clearances → 03 Truck rolls, you track, it lands.
- **Hand-off into Verdict:** the section's own link/CTA points at the
  quote form — "Start at step 01". The CTA is now an invitation, not a
  demand, because the buyer has seen exactly what it starts.

### 13 — Contact / "Talk to Dispatch — or Visit Us"

**STATUS: built (v1)** — components in `src/components/contact/`
(`ContactSection` + Desktop/Mobile + shared cards + glyphs), records in
`src/data/contact.ts` (all TODO(owner)). Mounted in `src/app/page.tsx`
after Verdict.

**Purpose:** catch the buyer who scrolled past the form — "Ready to
move? Then — or contact us directly. Even better, visit one of our
branches." Three tiers, escalating commitment:

1. **Ready to move** → anchor link back up to the Verdict quote form
   (`#verdict` / `#quote`). One line, no duplicate form here.
2. **Contact us directly** → three channels, each a real link:
   - Email — `mailto:` `[TODO owner: dispatch email address]`
   - WhatsApp — `wa.me` deep-link with prefilled text
     `[TODO owner: WhatsApp number + default message]`
   - Direct call — `tel:` `[TODO owner: dispatch phone number(s),
     per-branch if different + hours to call]`
3. **Even better, visit us** → two branch cards:
   - **Branch 1 — Botswana** `[TODO owner: confirm if HQ, city,
     street address, hours, phone, Google Maps link]`
   - **Branch 2 — Johannesburg** `[TODO owner: city, street address,
     hours, phone, Google Maps link]`
   - Each card: branch label (+ "HQ" tag on whichever is HQ
     `[TODO owner: which branch is HQ?]`), address lines, hours line,
     "Get directions →" maps link, tap-to-call link. Copy tone
     `[TODO owner: final branch welcome copy]`.

**What this section must NOT do:**

- Must not duplicate the Verdict form. One anchor back up, never a
  second form.
- Must not pull proof, stats, testimonials, or credentials down into
  itself — those live in Portfolio. This is utility only.
- Must not pin, scrub, or snap. Static, footer-adjacent close.
- Must not invent contact values. Every number, address, hour, and
  link ships as `[TODO owner]` until the owner supplies real data.

**Layout/rhythm:** contained, short (~60–80svh, shorter than Verdict
in feel but denser), no pin, no snap. Desktop: 3-column or
channels-row-over-branches-2-col; mobile: stacked — anchor line,
channel list, branch cards. Visually distinct from Verdict (Verdict is
empty/exhale; Contact is compact/utility) so the two never blur.
Footer follows Contact, not Verdict.

**Data schema (for build, all `[TODO owner]`):**

```ts
// src/data/contact.ts (planned)
type Branch = {
  label: string;        // e.g. "Gaborone" [TODO owner]
  isHq: boolean;        // [TODO owner: which branch is HQ?]
  address: string[];    // [TODO owner]
  hours: string;        // [TODO owner]
  phone: string;        // tel: link [TODO owner]
  mapsUrl: string;      // Get directions [TODO owner]
};
type ContactInfo = {
  email: string;        // [TODO owner]
  whatsapp: string;     // wa.me number [TODO owner]
  whatsappText: string; // prefilled message [TODO owner]
  phone: string;        // tel: [TODO owner]
  branches: Branch[];   // Botswana + Johannesburg [TODO owner]
};
```

---

## Transitions between sections

- **Hero → Services → Premise → Threat:** built as-is; do not
  re-open these seams.
- **Threat → Fleet band → Engine:** the wipe settles into the title
  band, one beat of calm, then the switcher. Built.
- **Engine → Proof:** soft bleed — Engine's blueprint grid carries into
  Proof's header zone only, fades to zero below it. Built.
- **Proof → Loads:** hard cut into negative space. Built.
- **Loads → Corridor:** slow build-in; Corridor escalates from its own
  quiet fear-opening. Built.
- **Corridor → Coverage: the highest-risk seam on the page.** Two
  map-adjacent sections back to back blur unless the treatment changes
  hard: Corridor is full-bleed dark and symbolic; Coverage must arrive
  as a distinct composed panel (terrain + rail + card), clearly a
  different instrument. Review this seam explicitly at build time.
- **Coverage → Portfolio:** cut from map to editorial cards — the
  visual switch from geography to paper is itself the pacing signal.
- **Portfolio → Process:** cards become a numbered strip; density
  drops.
- **Process → Verdict:** short drop to the emptiest section. Verdict
  stays the exhale. Three new sections must not turn the tail into a
  sales wall — that's the whole reason Process is capped at 3 steps.
- **Verdict → Contact:** hard cut from exhale to utility. Verdict is
  empty and quiet (form only); Contact is compact and dense
  (channels + 2 branch cards). Different shape on purpose — never two
  airy sections in a row. Contact then hands off to the footer.

---

## WhatsApp — system-level persistent element

Not a section. A fixed system component present from first pixel,
outside the section flow entirely.

- **Position:** fixed, bottom-right desktop, bottom-center mobile
  (thumb-reachable).
- **Label:** "Chat with Dispatch — Online Now".
- **Default state:** icon-only, low visual weight.
- **On upward scroll-reversal (any point):** brief pulse/expand to
  icon + text — it responds to the buyer scrolling back to re-check
  something, not to a timer.
- **Through Coverage and Portfolio:** stays icon-only — the map and
  the jobs are the new trust peak, WhatsApp must not compete with
  them.
- **At Verdict:** expands to full icon + text, sitting as a genuine
  equal option beside the form.
- **At Contact:** stays icon-only — the section already has its own
  explicit WhatsApp channel row; the FAB must not double up beside it.
- **Color:** WhatsApp green (`#25D366`), white icon — a documented
  exception to the brand palette (recognition color, not brand color;
  noted in DESIGN.md).
- **Z-index:** above all section content, `9999`.
- **New usage — deep links:** Coverage's per-country "Run this lane"
  links, and Portfolio/Process CTAs, use prefilled WhatsApp links
  (`wa.me` with text payload) so the conversation starts with context.

---

## Z-index tokens

```
1     — Visual layers (images, video, 3D, map basemap)
10    — Data/stat layers (floating proof)
20    — Text layers (headline, kicker, body)
100   — Nav / header
9999  — WhatsApp persistent element (above all, always)
```

## Fluid sizing system

All dimensions use `clamp()`:

- Headlines: `clamp(2rem, 5vw + 1rem, 6rem)`
- Kicker labels: `clamp(0.625rem, 0.5vw + 0.5rem, 0.875rem)`
- Data stats: `clamp(1.5rem, 3vw + 0.5rem, 3.5rem)`
- Body copy: `clamp(0.875rem, 0.5vw + 0.75rem, 1.125rem)`
- Section padding: `clamp(2rem, 5vw, 8rem)`

---

## Explicitly rejected

- **The emotional story-arc as the ordering principle.** Sections are
  ordered by the buyer's question sequence. Emotional pacing still
  matters inside a section, but it never sets the order again.
- **Chapter numbers in copy.** Eyebrows use section names.
- **A second geographic map.** `loads/CorridorMap.tsx` stays
  unmounted; Coverage owns the page's one map.
- **Dead-end states on the Coverage map.** Every country resolves to
  either an active lane or an opening lane with a WhatsApp link.
- **Testimonials, stats walls, or credential strips inside Verdict.**
  Verdict stays the emptiest sales section. (Contact after it is a
  dense utility close — exempt by design, never a back door for sales
  copy into Verdict.)
- **A second quote form inside Contact.** Contact links back up to
  Verdict (`#verdict`); it never hosts its own form.
- **Pinning any new section.** Pins are capped at Loads and Corridor.
- **Redrawing Corridor as a geographic route map.** It is symbolic on
  purpose.
- **Coverage card creep** into fleet/tonnage/jobs detail — that's
  Portfolio's content.

---

## Open questions (resolved during planning, before build)

1. **Coverage basemap:** stylized dark terrain (recommended) vs.
   licensed satellite imagery. → next Coverage planning session.
2. **Country data:** per-country border posts, authorities, clearance
   times, and active/expanding status `[TBC dispatch]`.
3. **Country path extent:** does any reusable geometry cover Tanzania
   and Malawi, or are paths sourced fresh?
4. **Credentials strip:** which of permits / abnormal-load escort /
   cross-border docs / insurance actually apply `[TBC]`.
5. **Portfolio content:** which 2–3 jobs make the cut, and who can
   give a named testimony `[TBC]`.
6. **Process copy:** final three-step wording (skeleton above is a
   placeholder).
7. **Proof's "Where it goes →" anchor:** retarget from
   `#corridor-section` to Coverage at the moment Coverage mounts.
   Until then, leave the existing link as-is rather than pointing at a
   section that doesn't exist.
8. **Real copy and final assets:** all `[TBC]` copy, photos, and the
  verdict mono-stat number are a later pass, after planning locks the
  structure.
9. **Contact values `[TODO owner — fill before build]:** (a) dispatch
   email address; (b) WhatsApp number + prefilled message text;
   (c) direct-call number(s) — one or per-branch — + hours to call;
   (d) Botswana branch: city, street address, hours, phone, Google
   Maps link; (e) Johannesburg branch: same five fields;
   (f) which branch carries the "HQ" tag; (g) final welcome/visit
   copy for both cards + the "Ready to move / contact directly /
   visit us" tier headings. No invented placeholders — build waits
   for these.
