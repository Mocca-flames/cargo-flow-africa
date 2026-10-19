# Portfolio Section — Build Spec (v1)

**Status:** built (v1) — components in `src/components/portfolio/`, mounted
in `src/app/page.tsx` between Corridor and Process (its final neighbour
order minus Coverage, which slots into that seam later when built).
Copy in `src/data/portfolio.ts` carries `TODO(copy)` / `TODO(verify)`
markers. Companion to `LANDING_LAYOUT.md` section 10.

**Purpose (the buyer's question):** *"has anyone like me used you?"* —
answered with records and one named testimony, not adjectives.

**Hard constraints (from LANDING_LAYOUT.md):**
- ~130svh max, contained. **No pin, no scroll-scrub, no scroll-jack.**
- 2–3 jobs, **exactly one flagship** — the job the testimony belongs to.
- One metric per job. No stats wall.
- Testimony is attributed: real person, real role, real company, tied to
  the flagship record. Anonymous = does not ship.
- Credentials strip folds in here (permits, abnormal-load escort,
  cross-border docs, insurance) — not its own section, never inside
  Verdict.
- No button-styled CTA; the quiet text link scrolls to `#verdict-section`.
- No photos in v1: `[TBC PHOTO]` frames per job, matching the Engine
  section's placeholder convention. The layout must survive real photos
  arriving later without a rework.
- Photography/dark modes: this is a light section — the dark field stays
  reserved for Corridor (DESIGN.md).

## What's built

| File | Role |
|---|---|
| `src/data/portfolio.ts` | Jobs, testimony, credentials, copy — the one file to edit |
| `PortfolioSection.tsx` | Client root: viewport gate (767px), entrance arming |
| `PortfolioDesktop.tsx` / `PortfolioMobile.tsx` | Flagship + standard card layout, per-viewport |
| `JobCard.tsx` | The one job record — used by both viewports so copy can't drift |
| `useReveal.ts` | One-shot IntersectionObserver reveal (Loads pattern) |
| `PortfolioCommon/Desktop/Mobile.css` | Tokens-only styling |

**Entrance:** same contract as Process — the server paints the section
complete and visible; JS only arms the entrance (`portfolio--armed`) and
completes it once (`portfolio--entered`), cards staggering on `--i`.
No JS → nothing hides. Reduced motion → static, final paint.

**Job record shape** (all from `portfolio.ts`): client + role → route
line (mono, `FROM → TO · BORDER`) → meta grid (commodity, tonnage,
window) → one metric (mono gold number under a Sora label, DESIGN.md
data-readout rule) → flagship only: the attributed testimony.

## `[TBC]` before sign-off

1. All copy in `portfolio.ts` — real client names/roles, real routes,
   real windows. TODO(copy) strings are illustrative only.
2. Border posts and routes — TODO(verify) with dispatch.
3. Testimony — real person, real quote, written permission to publish.
4. Credentials — which of the four strip items actually apply.
5. Photos — real job photography replacing each `[TBC PHOTO]` frame.
6. Coverage, once built, mounts into the seam between Corridor and this
   section — no rework expected here.
