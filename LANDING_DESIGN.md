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
| Real fleet/corridor photography | Ch2, Ch3, Ch4, Ch6 | 3D render / gradient duotone block |
| R3F 3D scene | Ch5 (Loads assembly) — the page's one heavy investment | Static exploded-view render |
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
- Ch5's 3D object: one camera setup for desktop, a tighter/zoomed
  mobile framing so it stays legible small.
- No pinch-hints, no hidden interactions; hover reveals become
  tap-to-expand.
- Photography: keep master at ≥1600px wide and ≥1600px tall where
  feasible so both crops are cut from the same shot.

## 2 — Interactivity Model by Chapter

| Chapter | Interaction type | Feel | Reduced motion |
| --- | --- | --- | --- |
| 2 Threat | Scroll-scrubbed wipe | Mechanical, heavy, tied to scroll | Static 50/50 split |
| 3 Engine | Tap/click tabs, hover spec panels | Snappy, responsive, rewarding inspection | Crossfade only |
| 4 Proof | Hover reveal / tap to expand | Medium, exploratory | Tap-to-expand, no auto-cycle |
| 5 Loads | Scroll-pinned 3D assembly | Slow, physical, weighted | Static exploded render |
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
**Visual:** left-anchored asset switcher (thumb-rail of truck cards),
right side = big truck image that swaps + spec panel sliding in.
- Tabs = real assets: `side-loader`, `flatdeck`, `lowbed`,
  `tautliner` (mono codes). Each swap re-renders the truck image with
  a quick snap transition (`--ease-snap`, 200ms).
- Spec panel: payload (t), deck length, axle config, typical commodity
  — mono values, Sora labels, animated count-up on numbers.
- Secondary link: quiet text link to `/fleet`.

**Entertainment:** feels like a configurator without the
app-chrome. The reward for inspecting is immediate — click a truck,
the whole section reorients to it.

### Ch4 — The Proof / Commodities
**Visual:** staggered diagonal grid, three columns at uneven heights,
`[TBC PHOTO]` commodity tiles.
- Hover: tile image zooms slightly, duotone lifts to full color, a
  mono tag surfaces (`LOAD TYPE`, `HANDLING`, `MAX`). Desktop hover,
  mobile tap-to-expand.
- Tiles cycle on *user intent only* — no auto-cycling.
- Columns: e.g. `GENERAL FREIGHT / BULK / PROJECT CARGO` — real
  categories, placeholder counts.

**Entertainment:** diagonal rhythm + hover color pop makes scanning
feel alive; information density stays low per tile.

### Ch5 — The Loads (Consolidation) — The Breath
**Visual:** single off-center R3F scene, 130vh pinned, slow weighted
assembly of cargo onto a trailer bed.
- The page's one 3D investment. Tone: heavy, deliberate, *click* of
  the last container landing. No snapping motion.
- Surrounding canvas: vast negative space, maybe one mono coordinate
  readout near the object.
- Reduced motion / mobile fallback: static exploded-view render,
  same composition.

**Entertainment:** the deliberate quiet. This is the dip that makes
Ch6 land. Nothing else moves; the cargo assembles like a held breath.

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
- Ch3: "Can they carry my load?" → configurator specs
- Ch4: "Do they handle my commodity?" → tile categories + hover tags
- Ch5: "How does consolidation look?" → 3D assembly
- Ch6: "Will it clear? Where's it stuck?" → route map + border status
- Ch7: "Who do I talk to?" → WhatsApp + form, nothing else

## 6 — Build Order (when coding starts)

1. Ch2 split + wipe placeholder
2. Ch3 switcher skeleton + spec panel
3. Ch6 map contract (static dark field, draw-on route, marker taps)
4. Ch5 R3F scene (heaviest, most isolated — do it while fresh)
5. Ch4 diagonal grid + hover
6. Ch7 + WhatsApp persistence polish

Each ships as placeholders/gray blocks first — run the
"felt without content" test from `LANDING_LAYOUT.md` before any copy.
