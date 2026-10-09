# Cargo Flow Africa — Landing Design (Visuals · Interactivity · Entertainment)

Companion to `LANDING_LAYOUT.md` (rhythm/arc) and `DESIGN.md` (tokens).
This file specifies **what the user sees and does** from Chapter 2 onward.

**Scope note (important):** The existing site HERO
(`src/components/hero` — V1 pseudo-3D truck scene + V2 corridor
telemetry) and the Value Proposition are COMPLETE and FROZEN.
**Do not touch, replace, or re-derive them from the story.** The
story arc in `LANDING_LAYOUT.md` begins after them; this document
covers the story chapters only. Copy is explicitly deferred —
headlines, kickers, body copy, and stat labels are typed later; this
document governs imagery, motion, interaction, and the *information* each
section surfaces.

**Guiding principle:** freight is boring only when it's static and
anonymous. Information *is* the entertainment — a truck that shows you
its specs, a border marker that tells you its clearance status, a route
that draws itself. Every interaction must answer a real question a
procurement buyer has.

**Audience promise (entertainment register):** serious both hands,
edges showing. Think sci-fi logistics HUD (90s NASA / sci-fi UI), not
game UI. No confetti, no mascots, no cartoon trucks. Earn the tone
through pacing, contrast, and telemetry.

**Asset reality:** no real photography yet — everything is
`[TBC PHOTO]`. Every visual spec below must therefore ship with a
**render-safe fallback** and hold up as a gray placeholder block.

---

## 1 — Asset Strategy (applies to all chapters)

| Asset class | Where | Fallback |
| --- | --- | --- |
| Real fleet/corridor photography | Ch2, Ch3, Ch6 | 3D render / gradient duotone block |
| Blueprint SVG micro-scenes (no photography) | Ch4 | n/a — the scene *is* the asset, ships final |
| Blueprint SVG freight scenes (no photography) | Ch5 | n/a — the scene *is* the asset, ships final |
| 2D animated route map | Ch6 (sci-fi, designed later) | Static SVG route with drawn-on states pre-applied |
| Data/telemetry readouts | Ch3, Ch5, Ch6, Ch7 | Mono-font placeholder telemetry |
| Video/ambient motion | Hero only (exists) | Static image + reduced-motion static |

- All photography treated through DESIGN.md tokens: sepia-warm canvas,
  terracotta duotone overlay for **tension states** (Ch2 left, Ch6
  opening), full color for **resolution states** (Ch2 right, Ch3, Ch4).
- Tension is built via desaturation + tight crop + reduced whitespace +
  slower/heavier timing. Never tilt, never reverse parallax.
- Every image must do double duty: emotional (tone, crop) and
  informational (it shows *something real* — a truck, a container, a
  border post, a load).

## 1a — Mobile Is Designed, Not Derived

We do **not** force responsive scaling. Every chapter ships two
deliberate layouts (`Desktop`/`Mobile` components), which means
assets must be prepared twice where framing differs:

- Any split/wipe chapter (Ch2, Ch6): desktop = left/right split,
  mobile = top/bottom stack or full-height sequential panels.
  Asset framing must survive a **9:16 crop** — keep subjects centered
  vertically and horizontally, no critical detail near edges.
- Spec panels/readouts (Ch3, Ch6) sit **below** the visual on mobile,
  never overlaid.
- Ch5's trailer: side elevation on desktop, vertical top view on
  mobile — the same trailer read two ways, so the plan stays legible
  at either orientation.
- No pinch-hints, no hidden interactions; hover reveals become
  tap-to-expand. (Ch4 exception: its desktop hover beat becomes
  snap-on-arrival, not tap — nothing is hidden behind a tap.)
- Photography: keep master at ≥1600px wide and ≥1600px tall where
  feasible so both crops are cut from the same shot.
- **Ch4 has no photography** — the `[TBC PHOTO]` convention from Ch3
  does **not** get copied over by habit. Its visuals are SVG/CSS
  micro-scenes that ship final. If real photos arrive later they go
  in as a **card layer** (behind/above the tag content), not as a
  redesign.

## 2 — Interactivity Model by Chapter

| Chapter | Interaction type | Feel | Reduced motion |
| --- | --- | --- | --- |
| 2 Threat | Scroll-scrubbed wipe | Mechanical, heavy, tied to scroll | Static 50/50 split |
| 3 Engine | Tap/click tabs, hover spec panels | Snappy, responsive, rewarding inspection | Crossfade only |
| 4 Proof | Horizontal snap deck; scene beat + tag stamp on snap (desktop: hover) | Medium, tactile, exploratory | Static scene frame, no stamp, ticker wraps |
| 5 Loads | Scroll-pinned load plan, scroll-linked | Slow, physical, weighted | Fully loaded plan, static |
| 6 Corridor | Scroll-driven map + tap markers | Building tempo → quick dock | Fully-drawn map, static markers |
| 7 Verdict | One fade-in; form + WhatsApp | Minimal, calm | No change |

Persistent systems (WhatsApp, nav) follow `LANDING_LAYOUT.md` and stay
out of the chapter rhythm.

---

## 3 — Chapter Visual Specs

### Ch1 — The Premise (Hero) · START — FROZEN
Already shipped as `src/components/hero` (V1 layered pseudo-3D
truck scene + V2 corridor-telemetry control room). **Frozen — do
not redesign.** The story visuals below start at Ch2.

### Ch2 — The Threat (Fear, met)
**Visual:** mirrored bilateral split, 150vh pinned, scroll-scrub wipe.
- Left: `[TBC PHOTO]` cramped broker scene — desaturated, terracotta
  duotone, tight crop, heavy shadow. Feels like a bad decision.
- Right: `[TBC PHOTO]` Cargo Flow standard — same subject family, full
  color, open crop, more air.
- The wipe is the information: as it crosses, the client sees the
  *same moment* under two regimes. Label side A/side B in mono.

**Informative layer:** side B panel adds a mono stat strip (e.g.
`ON-TIME 98% · TRACKED 100% · INSURANCED`) — first telemetry on the
page, deliberately restrained.

### Ch3 — The Engine / Fleet
**Visual:** left-anchored asset switcher (full-height thumb-rail of
truck cards), right side = the rig frame that swaps + spec panel below.
- Tabs = real assets: `side-loader`, `flatdeck`, `lowbed`,
  `tautliner` (mono codes `SL-104 / FD-120 / LB-36 / TL-13`). Each
  swap re-renders the drawing with a quick snap transition
  (`--ease-snap`, 200ms) and the frame index (`01 / 04`) moves with it.
- The visual is a **render-safe SVG side elevation drawn at true
  scale** (28px = 1m) sitting inside a `[TBC PHOTO]` frame — a
  measurement standing in for a photograph, not a gray block apologizing
  for one.
- Spec panel: payload (t), deck length, loading height — large, counted
  up on entry — plus axle config and typical commodity as mono
  readouts. Sora labels, mono values.
- The chapter heading ("Our Fleet") is a **separate band above the
  section**, not a masthead inside it — see Philosophy below.
- Secondary link: quiet text link to `/fleet`.

**Philosophy — the numbers are the asset:**

This chapter is the proof of the site's guiding principle: information
*is* the entertainment. It is also the chapter that has to survive
having no photography at all, and rather than design a hole and fill it
later, we inverted the problem — the data became the visual.

1. **Ship complete with zero photography.** The test is not *does this
   look finished* but *can a buyer answer "can they carry my load?"
   from this screen alone*. If yes, the missing photograph never
   registers as a gap — it registers as an upgrade that hasn't landed
   yet. When real assets arrive, `[TBC PHOTO]` becomes a photo and
   every other pixel of the chapter stands untouched.

2. **The drawing has to be able to argue with the numbers — and win.**
   Scale is literal: 28px = 1 metre, so the deck on screen *is* the
   deck in the spec panel. Nobody has to take `13.6 m` on faith; they
   can see 13.6 metres of deck. Precision in the schematic reads as
   precision in the yard, and the two never contradict because they're
   generated from the same record.

3. **Every field answers a question the buyer already walked in with.**
   Payload → *can it carry my load.* Deck length and loading height →
   *will it fit, and is it legal under the bridge.* Axle config → *is
   it stable and compliant.* Typical commodity → *have they hauled
   this before.* Nothing on the panel is there for texture. Any field
   that can't be tied to a question comes off.

4. **Reward for inspecting, zero commitment.** One click reorients the
   whole section — drawing, frame code, index, three numbers, two meta
   rows — with no modal, no route change, no loading state. A buyer
   can click all four classes in eight seconds and leave with the
   fleet in their head. Making a fleet feel *knowable* is the fastest
   credibility move available to us, and it costs nothing but honest
   fields.

5. **User-paced, never scroll-forced.** No pin, no scrub, no timeline
   the reader is racing. The section fills the viewport and the page's
   only scroll-snap point lives here — `proximity`, so it *invites* a
   rest rather than demanding one. You can stop a third of the way in
   and read at your own speed; the section stays put. Ch2 scrubs, Ch6
   pins, Ch3 hands over control — that contrast is the "no two adjacent
   sections share a rhythm" rule doing its job.

6. **The heading is a chapter card, not a masthead.** "Our Fleet" gets
   its own 56svh band of canvas *above* the configurator, so Ch3 opens
   directly on the instrument. No eyebrow, no kicker, no headline, no
   sub-paragraph stacked over the switcher competing with the numbers —
   context is supplied once, then the section gets out of the way. It
   also keeps the snap target clean: scrolling stops on the
   configurator, never on a title you have already read.

7. **Accessibility is craft here, not a patch.** The rail is a real
   roving-tabindex tablist — one tab stop, arrow keys move between
   classes, `aria-selected`/`aria-controls` wired to the panel. Numbers
   count up once on entry and then settle for good, with a hard
   fallback timer so a backgrounded tab can never strand a spec at `0`.

8. **This is a resolution state.** No terracotta, no tension duotone,
   no desaturation. Ink, gold, and canvas — the same palette Ch2's
   right-hand panel earns by comparison. The section should feel *lit*.

**Entertainment:** feels like a configurator without the
app-chrome. The reward for inspecting is immediate — click a truck,
the whole section reorients to it. The absence of scroll-forcing is
part of the pleasure: this is the one chapter where the page stops
moving so the reader can think.

### Ch4 — The Proof / Commodities
**Visual:** a deck of cargo tags — four commodity cards, one idea
each — replacing the old three-column photo grid. **No photography,
no `[TBC PHOTO]` frames** (see §1a). Ch3's 28px blueprint grid carries
in through the top bleed zone only and fades to zero **before the end
of the Ch4 header** — below the header there is no grid, and the card
area is flat "paperwork": the Ch3→Ch4 soft bleed made literal and
strictly bounded.

**Layout:**
- **Mobile (the designed form):** horizontal scroll-snap deck, native
  `scroll-snap-type: x mandatory` on the inner scroller, no
  scroll-jacking. One card per screen; the next card peeks in from
  the right (~14vw) to invite the swipe. `overscroll-behavior-x:
  contain`, `touch-action: pan-x pan-y`. Ch3 remains the page's only
  *root* snap point — this snap lives on the deck container.
- **Desktop:** the same four cards re-laid with CSS as the staggered
  diagonal columns. Hover-replay is gated behind `@media (hover:
  hover) and (pointer: fine)` — touch devices and touch laptops
  never rely on hover; they get snap-on-arrival like mobile.
- **Header:** mono eyebrow `04 / PROOF` + h2 "What We Move" in the
  same display style as Ch3's "Our Fleet", left-aligned directly
  above the deck. Compact inside the section — no standalone band.
- **Counter:** `01 / 04`, mono, `--color-ink-muted`, top-right of the
  deck frame — the same pattern as Ch3's frame index.
  **Mobile-only:** it belongs to the swipe deck, and is hidden on
  desktop, where all four cards are visible.
- **Section sizing:** `min-height: 100svh`, cards carry a `min-height`
  — on short screens (landscape phones) the section grows rather than
  clipping header, card, counter, and ticker. Nothing is absolutely
  positioned over a card that can grow.

**Card anatomy — four things, nothing else:**
1. Giant ghost number (`01` — `rgba(18,56,47,.075)`, same watermark
   treatment as Ch3's frame code) + commodity name.
2. One-line hook — short, confident, personality.
3. One small looping scene (below).
4. Fleet-tag stamp + one corridor line (e.g. `Mpumalanga → Durban`).

**Cards** (data in `src/data/commodities.ts`; tag codes resolved from
the shared fleet record — never hardcoded, so Ch3 and Ch4 cannot
drift):

| # | Commodity | Tag | Hook (draft) | Scene |
| --- | --- | --- | --- | --- |
| 01 | Sulphur granules | SL-104 (TBC — containerised only) | "Yellow, gritty, and always on schedule." | `pour` |
| 02 | Steel | FD-120 | "Heavy, blunt, and perfectly balanced." | `stack` |
| 03 | Fertilisers | TL-13 | "Bagged, palletised, kept dry." | `drop` |
| 04 | Mining machinery | LB-36 | "Oversized, overweight, and on the low deck." | `ramp` |

`sceneId` and `fleet` are independent fields: if sulphur turns out to
run in bulk tippers, the tag changes and the `pour` scene stays.

**Scenes — cheap SVG/CSS in Ch3's blueprint line style:**
- **Sulphur:** yellow granules pour in a steady stream, pile up.
- **Steel:** bars slide in and stack on a flat deck.
- **Fertiliser:** sacks drop in one by one, settle with a small bounce.
- **Machinery:** a block rolls up a ramp onto the low deck.
- Stroke language matches `EngineRig`: 1.5px ink body, 1.6 gold
  accent, dashed `3 3` construction lines, round caps, 28px grid
  behind. One accent only — `--color-accent-gold` (there is no amber
  token; gold is the warm accent). No terracotta: that is Ch2's
  tension color and Ch4 is a resolution state.

**Motion model — play on arrival, then idle; only the active card
moves:**
- IntersectionObserver with `root` = the deck (not the viewport),
  `threshold: 0.6`, sets `data-active` on the snapped card; CSS keys
  everything off it via `animation-play-state`. Viewport-rooted IO
  would fire all four at once on desktop — deck-rooted does not.
- On arrival: the scene plays its main beat (~1.4s) and the fleet tag
  stamps — scale down, slight rotate, settle, like a customs stamp
  (`--ease-snap`, ~200ms). The stamp re-triggers on every snap-in, so
  returning to a card replays it.
- Then the scene drops to a subtle idle loop (a few granules still
  falling, a slight sway) — alive, never noisy.
- Off-screen cards pause completely (battery).
- Desktop: all four visible, scenes sit in the idle state, full beat
  replays on hover — behind `@media (hover: hover) and (pointer:
  fine)`; touch-capable hardware never depends on it.

**Fleet tag jump:** the tag is a real link to `#fleet-<id>` — Ch3's
switcher selects that trailer and scrolls to `#engine-section`. The
listener guards three cases: deep link present on mount sets the
active class — the mount-time check exists because `hashchange` does
**not** fire on initial page load; invalid id falls back silently to
current state; already active is a no-op. `#fleet-<id>` values exist
**only in link hrefs** — no element carries that id — and the
listener maps them to `#engine-section`, so the browser's native
anchor scroll never competes with the listener. **Phase 3 has landed:**
the listener lives in `EngineShowcase` (Ch3 owns the selection state).
Scroll uses `scrollIntoView` with `behavior: "auto"` under reduced
motion, `"smooth"` otherwise. This link is what makes the sections
feel connected — the tag you just stamped points at the trailer you
can go inspect.

**Closing:** after card 04, a slow ticker reads `Sulphur · Steel ·
Fertilisers · Machinery · + more`, then a quiet "Where it goes →"
into Ch6 (`#corridor-section`). "+ more" is a closing line, not a
fifth card — the deck stays at four, and so does the counter.

**Ticker accessibility:** the moving marquee is `aria-hidden`; its
static equivalent is visually hidden (`sr-only`) under normal motion —
so screen readers hear it exactly once — and becomes the visible
ticker under reduced motion, replacing the moving one.

**Reduced motion:** scenes render a static final frame, the stamp does
not animate, the ticker becomes a wrapped static line.

**Entertainment:** the snap-and-stamp is the flair moment — swipe,
scene beats, customs stamp — while each card still answers the
chapter's buyer question on its own: *Do they handle my commodity?*
Name, one hook, one tag, one corridor. Nothing on the card is texture.

### Ch5 — The Loads (Consolidation) — The Breath
**Visual:** flat load plan on the flatdeck trailer, 130vh pinned, slow
weighted landing of three loads onto the deck.
- The trailer is a drawn SVG — side elevation on desktop (full
  viewport width), vertical top view on mobile. Each load stands its
  own commodity drawing on the deck; desktop-only for now.
- Tone: heavy, deliberate, *settle* of each load onto the deck. No
  snapping motion. Dashed slots become solid as they fill.
- Surrounding canvas: vast negative space, one mono load sheet.
- Reduced motion / mobile fallback: the fully loaded plan, statically.

**Entertainment:** the deliberate quiet. This is the dip that makes
Ch6 land. Nothing else moves; the loads land one at a time like a held
breath.

### Ch6 — Corridor & Clearance — Climax
**Visual:** two movements in one 200vh+ pinned sequence.
1. **Opening (fear):** diagonal split — desaturated, tight-cropped
   border-crossing imagery on both halves; real 2vw gap between them
   that narrows on scroll. Tension from desaturation + crop only.
2. **Resolution (trust):** gap closes into the **sci-fi route map** —
   the page's largest, darkest composition (Deep Forest field,
   Ivory + Gold line). Route Durban → DRC draws itself on scroll;
   border markers surface agent/clearance status on tap.

**Entertainment/info fusion:** the map looks like a sci-fi nav console
(mono coordinates, corridor codes `JHB–LVI`, status pills
`CLEAR / HELD / AGENT ON SITE`) while only ever telling the truth
about borders and clearance. Tempo builds slow (gap narrowing, line
drawing) → quick (markers populate).

**Deferred:** map art direction specified later; structure and
interaction contract fixed here. Reduced motion: route appears
pre-drawn, markers static + tappable.

### Ch7 — The Verdict — Close
**Visual:** no image. Absence is the statement. Centered headline +
centered form, generous padding, one small mono stat beneath
(`LAST UPDATE · <timestamp>` or a single trust line) as quiet
confirmation. WhatsApp expands to icon+text here, equal to the form.

**Entertainment:** the exhale. After Ch6's density, near-empty is the
drama.

---

## 4 — Cross-Chapter Systems

- **WhatsApp persistent element:** per `LANDING_LAYOUT.md` —
  icon-only in Ch1–Ch6, pulses on upward scroll-reversal, full
  icon+text in Ch7. Solid `#25D366`, white icon, `z-index: 9999`.
- **Z-index tokens:** `1 / 10 / 20 / 100 / 9999` as in layout doc.
- **Fluid sizing:** headline/data/body clamps from layout doc.
- **Motion tokens:** `--ease-cinematic` for scroll-pinned,
  `--ease-snap` for interaction, durations 200/500/1200–2000ms.
- **Reduced motion:** every scroll-scrub becomes a fade/settle, every
  3D becomes a static render, every auto-cycle is disabled.

## 5 — "More Informative" Checklist (text lands later, hooks land now)

Each chapter must surface at least one real question answered *by the
visuals or interaction*, not by a paragraph:

- Ch2: "What changes when I use Cargo Flow?" → side-by-side regime + mono stat strip
- Ch3: "Can they carry my load?" → configurator specs (payload, deck,
  loading height answer it without a single photograph)
- Ch4: "Do they handle my commodity?" → each card answers it alone: commodity name + fleet tag + corridor line
- Ch5: "How does consolidation look?" → the load plan on the deck
- Ch6: "Will it clear? Where's it stuck?" → route map + border status
- Ch7: "Who do I talk to?" → WhatsApp + form, nothing else

## 6 — Build Order (when coding starts)

1. Ch2 split + wipe placeholder
2. Ch3 switcher skeleton + spec panel — **shipped**: four classes,
   true-scale schematic, counted-up specs, roving-tabindex rail,
   standalone "Our Fleet" title band, proximity scroll-snap. The
   chapter proves it needs no photography before it has any.
3. Ch4 cargo-tag deck + scenes + fleet-tag jump — **next** (pulled
   ahead of Ch6/Ch5 to keep momentum after Ch3)
4. Ch6 map contract (static dark field, draw-on route, marker taps)
5. Ch5 load plan (SVG trailer + freight, scroll-linked landing)
6. Ch7 + WhatsApp persistence polish

Each ships as placeholders/gray blocks first — run the
"felt without content" test from `LANDING_LAYOUT.md` before any copy.
