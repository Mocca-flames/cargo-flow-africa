# Process Section — Build Spec (v1)

**Status:** built (v1) — components live in `src/components/process/`,
mounted in `src/app/page.tsx` between Corridor and Verdict. Copy in
`src/data/process.ts` still carries `TODO(copy)` markers. Companion to
`LANDING_LAYOUT.md` (section 11 of the buyer-question order) and
`SERVICE.md` (animation/scroll policy).

**Purpose:** answer the buyer's last friction question — *"what actually
happens after I send you my job?"* — in one screen, then hand them to
the quote form with a reason to trust it.

**Hard constraints (from LANDING_LAYOUT.md):**
- ~90svh, contained. **No pin, no scroll-scrub, no scroll-jack.**
- Sits immediately before Verdict (order: Coverage → Portfolio →
  Process → Verdict).
- Zero photography. Vector + type + interaction only — that is the
  point of building this one first.
- Ends with a quiet text link into `#verdict-section` (confirmed id)
  and/or a WhatsApp deep-link. No button-styled CTA — DESIGN.md
  reserves the single primary button for Verdict.

---

## 1. What the buyer sees

Three steps, left to right on desktop, top to bottom on mobile. Each
step is: a mono step number, an animated SVG glyph, one short line of
copy. A dashed gold connector runs between the steps and **draws
itself** as the section scrolls into view — the same flat vector
language as Loads' dashed slots and Engine's blueprint grid, so it
reads as the same instrument.

**Copy home: `src/data/process.ts`** — `processSteps[]` + `processCopy`.
Drafted below; every string carries `TODO(copy)` in the data file and is
the owner's to replace. Structure locked, wording provisional.

| Step | Heading (Sora) | Body (DM Sans, ~2 lines max) | SVG glyph |
|---|---|---|---|
| 01 | Send the spec | "Commodity, tonnage, origin, destination and the date it has to land. One message to dispatch." | Document + node receiving an arrow |
| 02 | We plan the run | "Load plan, trailer selection, route and border clearances — booked before anything moves." | Trailer side elevation + route line with nodes (flat, Loads-style) |
| 03 | Truck rolls, you track | "We roll, you follow the run, and the load lands on the date you gave us." | Truck glyph moving along a line into a gate/check |

Section copy (in `processCopy`): eyebrow `PROCESS`, heading "How a Job
Runs", optional standfirst "One message in, a tracked run out.", CTA
"Start at step 01" → `#verdict-section`, optional WhatsApp alt "Or
message dispatch".

Step headings must stay 2–4 words. Body is one sentence, present
tense, no adjectives. The section's power is its brevity — three
steps, one screen, done.

---

## 2. Visual spec (DESIGN.md tokens — no new tokens)

- **Field:** `--color-canvas` (`#F8F4EB`). This section is light. The
  dark field is reserved for the Corridor moment per DESIGN.md — do
  not introduce a second dark section.
- **Headline & step titles:** `--font-display` (Sora 600/700), Display
  M–L scale.
- **Step numbers (`01 / 02 / 03`):** `--font-mono` (IBM Plex Mono 500),
  `--color-accent-gold`, letter-spacing 0.04em. Per DESIGN.md, every
  mono data readout is paired with a Sora label — the step number sits
  directly above its step title, never alone.
- **Connector:** 1px dashed `--color-accent-gold`, stroke-dasharray
  draw-on. Cards sit on `--color-surface` with a 1px
  `--color-border` — flat, no shadows (DESIGN.md card convention).
  Alternatively steps sit bare on canvas with only the connector; pick
  one at build, not both.
- **Motion:** `--ease-snap` for the glyph idle/hover micro-moments;
  `--ease-cinematic` for the connector draw-on and step reveals.
  Durations: `--duration-base` (500ms) reveal; hover feedback
  `--duration-fast` (200ms). No animation beyond 1200ms anywhere —
  this section is not a performance.
- **Spacing:** 4px base scale only.

---

## 3. Interaction model (deliberately minimal)

1. **Reveal once** when the section enters the viewport (same pattern
   as `loads/useReveal.ts` — IntersectionObserver, one-shot class
   toggle on the section root).
2. **Stagger:** steps fade + rise 16px in sequence, driven by a CSS
   custom property (`--i` per step, transition-delay). The connector
   draws left-to-right timed across the same stagger.
3. **Hover (desktop, affordance only):** step card lifts 2px or the
   glyph plays one beat — never required to understand the section.
4. **No pinning. No scrub. No parallax.** Everything finishes in
   under 1.2s and the section then sits still.

The "send the spec" glyph may animate its arrow once on reveal (a
single 500ms beat, then idle). The "truck rolls" glyph may idle-loop
slowly along its line — the only ambient motion allowed, and it stops
under reduced motion.

---

## 4. Component architecture (repo conventions)

Follow the established pattern exactly — `LoadsSection` +
`LoadPlan.{desktop,mobile}` + `LoadsCommon.css` is the reference.

| File | Role |
|---|---|
| `src/components/process/ProcessSection.tsx` | `"use client"` section root; viewport gate (matchMedia ~768px, `useState<boolean \| null>` pattern like `CorridorSection`); reveal hook; renders all steps in final state for SSR |
| `src/components/process/ProcessDesktop.tsx` | 3-step horizontal layout + connector |
| `src/components/process/ProcessMobile.tsx` | 3-step vertical stack, smaller glyphs, vertical connector |
| `src/components/process/ProcessCommon.css` | Tokens/typography/reveal/stagger shared by both |
| `src/components/process/ProcessDesktop.css`, `ProcessMobile.css` | Per-variant layout only |
| `src/components/process/StepGlyph.tsx` | The three inline SVG glyphs (no component library, hand-drawn flat strokes matching corridor/loads line weight) |
| `src/components/process/Connector.tsx` | Dashed draw-on connector (desktop horizontal / mobile vertical via prop) |
| `src/components/process/useReveal.ts` | One-shot IntersectionObserver reveal — clone the `loads/useReveal.ts` pattern |
| `src/data/process.ts` | Step records: `{ id, number, title, body }[]` — copy lives here, `[TBC]` until final copy |

**Rendering rules (from Loads' precedent):**
- **SSR renders the settled state** — all three steps visible, final
  copy, connector drawn. No client-only reveal gates first paint.
- **Reduced motion:** render identical to SSR, no draw, no stagger,
  no idle loops. Gate with a `useSyncExternalStore` matchMedia
  subscription whose **server snapshot is `true`** (the Loads pattern)
  so hydration always agrees.
- Section root: `<section id="process-section" className="process
  process--{desktop|mobile}" aria-labelledby="process-heading">` with
  a single `<h2>` heading ("How a Job Runs" — `[TBC]`).
- Steps are an ordered `<ol>`: each `<li>` holds the mono number,
  glyph, title, body. Real text, real headings — no text baked into
  SVG (SEO + a11y).

**CTA at section end:**
- Quiet text link: "Start at step 01 →" scrolling to
  `#verdict-section` (id confirmed in `verdict/VerdictDesktop.tsx`).
- Optional WhatsApp deep-link: reuse the existing
  `buildWhatsAppLink` helper in `src/components/verdict/quote-form.tsx`
  (read its signature during build; do not guess it) with a prefilled
  "I'd like to start a job" payload.

---

## 5. Acceptance checklist

- [ ] ~90svh, contained; zero pinned/scrub/jack in the code path
- [ ] No photography assets; all visuals are inline SVG + CSS
- [ ] SSR and reduced-motion both paint the full three-step settled
      state with no flash of empty section
- [ ] Connector draws once, under 1.2s, `--ease-cinematic`
- [ ] Step numbers in mono paired with Sora titles (DESIGN.md
      data-readout rule)
- [ ] One button-styled link: none. Verdict owns the only primary CTA
- [ ] Glyph strokes match Loads/Corridor line weight and flat style
- [ ] `ol`/`li` semantics, `aria-labelledby`, heading hierarchy
      intact
- [ ] Idle loops (if any) stop under `prefers-reduced-motion`
- [ ] Lint + build clean

---

## 6. `[TBC]` before build

1. ~~Final copy for the three steps~~ — drafted in `src/data/process.ts`
   with `TODO(copy)` markers; owner replaces wording there, one file.
2. Card vs. bare-canvas step treatment — pick one.
3. Whether the WhatsApp deep-link is in v1 or deferred.
4. Glyph line weight: read Loads' truck SVG and match exactly.
5. Mobile connector: vertical dashed line confirmed vs. steps-only.
6. Build phase: per AGENTS.md, read the local Next.js docs in
   `node_modules/next/dist/docs/` before writing any component code —
   this repo runs a modified Next.
