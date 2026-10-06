# Cargo Flow Africa — Landing Page Layout & Narrative Arc

**Scope note (important):** The site has TWO different "heroes":
- The **actual site HERO** (`src/components/hero`, V1 pseudo-3D
  truck scene + V2 corridor-telemetry control room) is COMPLETE,
  shipped, and **frozen — do not touch it, do not replace it with
  story-driven layout**. It is not part of this arc.
- The **Value Proposition** section that follows it is likewise
  complete and frozen.
- **This document's story begins AFTER the actual Hero and Value
  Proposition.** Chapter 1 (Premise) below describes that transition
  point conceptually; the built hero stays as-is.

This file governs *rhythm and emotional texture*, not content. DESIGN.md
defines what things look like (color, type, spacing, motion tokens).
This file defines how the page *moves through time and feeling* —
scale, density, tempo, symmetry, emotional beat — so the story is felt
structurally, even with placeholder copy and `[TBC PHOTO]` assets in
every section.

**The test for this document:** strip every word and every image from
the page. Leave only boxes, whitespace, and scroll timing. A reader
should still be able to tell you where the story is calm, where it's
building, where it peaks, and where it resolves — purely from the
shape of the page.

**This version reconciles two prior drafts.** The emotional
rollercoaster (desperation → reassurance → fear → relief → deeper
fear → trust → contact) is real and stays — but it now runs *inside*
our seven content chapters (Premise, Threat, Engine, Proof, Loads,
Corridor & Clearance, Verdict), rather than as a separate,
content-agnostic structure. Every section below still ties to real
fleet, commodity, consolidation, and corridor content, and still links
to its matching sub-page.

---

## The Story Being Told

Desperation (felt, unstated) → Fear named + immediately met →
Building proof → Widening proof → The breath → Deeper fear resolving
into trust → Contact.

This maps directly to real user behavior: a fast first scroll
(scanning), then a scroll back up (reading), and somewhere in that
second pass, a decision to reach for WhatsApp or a sub-page.

---

## The Core Rule: No Two Adjacent Sections Share a Rhythm

Each section is scored against five axes. **Adjacent sections must
differ on at least three of five.**

1. **Density** (1 = vast negative space, 5 = maximum visual/data load)
2. **Symmetry** (centered/mirrored vs. radically off-axis)
3. **Viewport scale** (contained ~100vh vs. extended pinned sequence)
4. **Motion tempo** (slow/lingering vs. quick/snapping)
5. **Visual weight position** (where the heaviest element sits)

**On tension cues (revised):** earlier drafting explored literal
instability — tilted images (2–3°), "reverse parallax" meant to
suggest loss of control, data scattered like debris. Cut. For a
procurement audience evaluating a serious operational partner,
visible disorientation risks reading as a rendering bug, not drama.
Tension is instead built through **desaturation, tighter framing,
reduced whitespace, and slower/heavier motion timing** — it reads as
weight and seriousness without ever looking broken.

---

## The Arc, Section by Section

### 1 — The Premise (Hero) · Desperation, felt not stated · **START**
- **Emotional target:** the world before Cargo Flow. Not explained —
  felt. The weight of a real deadline, real cargo, real distance.
- **Composition:** full-bleed visual, edge to edge, no margin. No
  kicker label — the system hasn't introduced itself yet, the client's
  problem comes first. No data/proof layer at all — proof is earned in
  Chapter 2, not claimed here. Headline sits low, small, understated —
  closer to an internal monologue than a slogan.
- **Density:** 2. **Symmetry:** centered — the only other centered
  section is the Verdict (deliberate bookend).
- **Viewport:** 100vh, no pin.
- **Motion tempo:** slow, ambient. Video/image breathes; nothing
  counts up, nothing arrives yet.
- **Weight position:** centered mass, generous margin.
- **Reduced motion:** static hero image, no ambient drift.

### 2 — The Threat · Fear named, met immediately · **RISING TENSION**
- **Emotional target:** the fear made concrete, and answered in the
  same breath — this is where the system first speaks. Kicker label
  debuts here ("02"), the brand's first appearance, arriving exactly
  when the client needs it, not before.
- **Composition:** mirrored bilateral split. Left: the broker gamble —
  desaturated, tightly framed, cramped composition (the "fear" side,
  built through tone and framing, not tilt). Right: the Cargo Flow
  standard — full color, open framing, more breathing room. The
  contrast in *framing and color*, not distortion, does the emotional
  work.
- **Density:** 3. **Symmetry:** mirrored — symmetry used deliberately
  as two forces in balance.
- **Viewport:** 150vh pinned, scroll-scrubbed wipe, left panel opening
  into right as the user scrolls.
- **Motion tempo:** mechanical, tied directly to scroll position.
- **Weight position:** balanced, shifting right as the wipe resolves.
- **Reduced motion:** static split image, no scroll-scrub; the wipe
  position settles at 50/50.

### 3 — The Engine (Fleet) · Reassurance, first proof · **BUILDING**
- **Emotional target:** credibility. "Look closer, we can take it."
- **Composition:** left-anchored asset switcher, spec panels sliding
  in. First section where the client is rewarded for inspecting
  rather than just scrolling past.
- **Density:** 4. **Symmetry:** broken, left-anchored.
- **Viewport:** 120vh contained, user-paced not scroll-forced.
- **Motion tempo:** snappy, responsive to interaction.
- **Weight position:** left-anchored, asymmetric.
- **Secondary link:** quiet text link to `/fleet`, not a button.
- **Reduced motion:** tab switches fade instead of slide.

### 4 — The Proof (Commodities) · Reassurance widening · **BUILDING FURTHER**
- **Emotional target:** breadth. "We handle everything serious."
- **Composition:** staggered diagonal grid, three commodity columns at
  uneven heights.
- **Density:** 3. **Symmetry:** staggered/diagonal.
- **Viewport:** 100vh contained.
- **Motion tempo:** medium, hover-driven.
- **Weight position:** diagonal sweep, top-left heavy.
- **Reduced motion:** hover reveals become tap-to-expand, no
  auto-cycling.

### 5 — The Loads (Consolidation) · Relief, the breath · **THE BREATH**
- **Emotional target:** quiet confidence, the calm beat immediately
  before the climax. This dip is deliberate — it should feel almost
  too quiet on first review. That discomfort is the point.
- **Composition:** vast negative space around a single off-center 3D
  object (the page's one React Three Fiber investment — cargo
  assembling onto a trailer bed, slow and weighted, not snapped).
- **Density:** 1–2, the sparsest section after the hero.
  **Symmetry:** radically off-axis, object low and small relative to
  the canvas around it.
- **Viewport:** 130vh pinned, slow pace.
- **Motion tempo:** slow, physical, weighted.
- **Weight position:** off-center, low, minor relative to whitespace.
- **Secondary link:** quiet text link to `/loads`.
- **Reduced motion:** 3D sequence replaced with a static exploded-view
  image of the load.

### 6 — Corridor & Clearance · Deeper fear → Trust · **CLIMAX**
- **Emotional target:** this is where "deeper fear" belongs — border
  closures, strikes, political risk — and it's the *right* home for
  it, because this chapter's actual content is border risk. The
  section opens with tension, then resolves into the page's largest,
  most confident statement.
- **Composition, two movements within one pinned sequence:**
  - **Opening (fear):** a diagonal-split composition — desaturated,
    tightly cropped border-crossing imagery on one side; the gap
    between the two halves is real (2vw), narrowing as the user
    scrolls, the tension visibly resolving rather than being told to.
    No tilt, no reverse-parallax — tension here comes from
    desaturation and tight cropping alone.
  - **Resolution (trust/climax):** the gap closes into the full route
    map — Durban to the DRC, drawing on scroll, border markers
    surfacing agent/clearance status on tap. This is the single
    largest, most complex composition on the page.
- **Density:** 5, the maximum on the page.
  **Symmetry:** none — organic, geography-driven, not grid-based.
- **Viewport:** 200vh+ pinned, the longest sustained sequence on the
  page, earning its length after the quiet Chapter 5.
- **Motion tempo:** builds from slow (gap narrowing, line drawing) to
  quick (border markers populate) — the only section with its own
  internal tempo arc.
- **Weight position:** full-bleed, environmental, no single focal
  point.
- **Secondary link:** quiet text link to `/corridors`.
- **Reduced motion:** route line appears fully drawn on load, no
  progressive animation; markers are static and tappable immediately.

### 7 — The Verdict · Contact · **DECREASE → CLOSE**
- **Emotional target:** resolution, intimacy. The client has been on
  a journey; the CTA is its natural conclusion, not a demand.
- **Composition:** no dominant image — after six sections of visual
  storytelling, absence is the statement. No kicker label — the
  narrative is complete, the system steps aside, bookending Chapter
  1's own absence of branding. Centered headline, centered form,
  generous padding, one small final stat in mono-font beneath the
  form as quiet confirmation rather than persuasion.
- **Density:** 1, the sparsest section on the page, full stop.
  **Symmetry:** centered — closes the bracket opened by the hero.
- **Viewport:** 80vh, no pin, no scroll-scrub.
- **Motion tempo:** minimal, one fade-in only.
- **Weight position:** centered, small, maximum surrounding whitespace.
- **Reduced motion:** no change needed, already minimal.

---

## Density Curve (for build reference)

```
5 |                                   ●
4 |                 ●
3 |        ●                 ●
2 |   ●                              
1 |                        ●              ●
0 +---+---+---+---+---+---+---+
    Ch1 Ch2 Ch3 Ch4 Ch5 Ch6 Ch7
  DESPAIR FEAR BUILD WIDE BREATH TRUST CLOSE
```

If Ch5 and Ch6's opening movement feel similar in energy during
review, pull Ch5 back further rather than pushing Ch6 harder — the
dip has to be uncomfortable for the climax to land.

---

## Transition Rules Between Sections

- **Ch1 → Ch2:** hard cut. Calm hero ends, tension begins abruptly —
  no bleed, no crossfade.
- **Ch2 → Ch3:** the wipe resolves fully before Ch3 begins, a clean
  settle.
- **Ch3 → Ch4:** soft bleed, both are "what we haul" content.
- **Ch4 → Ch5:** hard cut into negative space — the sudden emptiness
  is itself the pacing signal.
- **Ch5 → Ch6:** slow build-in. Ch6 doesn't open at full density, it
  escalates from its own quiet fear-opening into the climax, so the
  transition from Ch5's calm doesn't jar, it *becomes* the climax.
- **Ch6 → Ch7:** hard cut to minimal. After 200vh of maximum density,
  the drop to near-empty is the resolution — it should feel like
  exhaling.

---

## WhatsApp — System-Level Persistent Element

Not a chapter. Not a section. A fixed system component present from
first pixel, outside the chapter flow entirely.

- **Position:** fixed, bottom-right on desktop, bottom-center on
  mobile (thumb-reachable).
- **Label:** "Chat with Dispatch — Online Now" — states what it is,
  doesn't make the user tap to find out.
- **Ch1–Ch4:** icon-only, low visual weight, present but not competing.
- **On upward scroll-reversal (any point):** brief pulse/expand to
  icon+text — responds to the actual behavioral signal (the client
  scrolling back to re-check something), not a timer.
- **Ch6 (climax):** stays icon-only even here — the map/data moment is
  the page's climax, WhatsApp should not compete with it.
- **Ch7 (verdict):** expands to full icon+text by default, sitting as
  a genuine equal option beside the form.
- **Color:** solid WhatsApp green (`#25D366`), white icon. This is a
  deliberate, documented exception to the brand palette — it's a
  recognition color, not a brand color, and should be marked as an
  allowed exception in DESIGN.md so it isn't mistaken for a broken
  token later.
- **Z-index:** above all chapter content, `z-index: 9999`.

---

## Z-Index Tokens

```
z-index: 1    — Visual layers (images, video, 3D)
z-index: 10   — Data/stat layers (floating proof)
z-index: 20   — Text layers (headline, kicker, body)
z-index: 100  — Nav / header
z-index: 9999 — WhatsApp persistent element (above all, always)
```

*(These should also be copied into DESIGN.md as a system-wide
convention — noting here since they're landing-page-critical, but
DESIGN.md is the canonical home.)*

---

## Fluid Sizing System

All dimensions use `clamp()`, no breakpoints, no snap points:

- **Headlines:** `clamp(2rem, 5vw + 1rem, 6rem)`
- **Kicker labels:** `clamp(0.625rem, 0.5vw + 0.5rem, 0.875rem)`
- **Data stats:** `clamp(1.5rem, 3vw + 0.5rem, 3.5rem)`
- **Body copy:** `clamp(0.875rem, 0.5vw + 0.75rem, 1.125rem)`
- **Section padding:** `clamp(2rem, 5vw, 8rem)`

---

## Layout Shape Registry — Zero Repetition

| Section | Shape | Symmetry | Density | Bleed |
|---|---|---|---|---|
| 1 Premise | Full-bleed rect | Centered | 2 | All edges |
| 2 Threat | Mirrored split | Bilateral symmetric | 3 | None |
| 3 Engine | Left-anchored panel | Broken, left-heavy | 4 | None |
| 4 Proof | Staggered diagonal grid | Diagonal stagger | 3 | None |
| 5 Loads | Single off-center object | Radically off-axis | 1–2 | None |
| 6 Corridor & Clearance | Diagonal split → full map | None, organic | 5 | Full-bleed |
| 7 Verdict | None (empty-led) | Centered | 1 | None |

Every section is structurally unique — no symmetry type, density
level, or bleed pattern repeats consecutively.

---

## The "Felt Without Content" Test

Build each section as gray/placeholder blocks at the specified
density, symmetry, and viewport values before any copywriting or
final assets. Scroll through with no text, no images. If the arc
doesn't read — desperation, named fear, building trust, the breath,
deeper fear resolving into climax, quiet close — fix the layout before
adding a single word.

---

## Explicitly Rejected

- Literal tilt/rotation or "reverse parallax" as a fear mechanism —
  replaced with desaturation, tight framing, reduced whitespace,
  slower motion
- A separate, content-agnostic emotional structure running parallel
  to the real chapters — the emotional arc lives *inside* Premise,
  Threat, Engine, Proof, Loads, Corridor & Clearance, and Verdict, not
  alongside them
- Any section reusing another's density + symmetry + tempo
  combination
- Climax placed anywhere but Chapter 6; Verdict stays the quietest
  section on the page
- HUD/data readout in the Hero — all proof is deferred to Chapter 2,
  where the system first speaks
- WhatsApp element treated as static/unchanging — it responds to
  scroll-reversal behavior, matching the rest of the page's
  behavior-driven philosophy
