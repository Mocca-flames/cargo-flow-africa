# Cargo Flow Africa - Design System

## Brand Foundation

Palette and type are derived directly from the supplied Cargo Flow Africa
brand assets: a warm, grounded African-earth identity, not a cold
industrial template. Every visual decision should read as premium and
quiet (Forge Automotive reference), not loud and dark.

The supplied asset library is the visual source of truth:

- `Brand Colors/` contains the approved swatches documented below.
- `Brand Fonts/Sora/` contains the display font and weights.
- `Brand Fonts/DM_Sans/` contains the body font and weights.
- `PNG Transparent logo/Full color/` contains the full-color primary, secondary, and icon marks.
- `PNG Transparent logo/White/` contains the white primary, secondary, and icon marks for dark backgrounds.
- `Logo Vector Files/` contains the master PDF and EPS artwork for production output.

## Color Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--color-canvas` | `#F8F4EB` | Warm Ivory: primary background, never pure white |
| `--color-canvas-alt` | `#E8D8B9` | Soft Sand: secondary/section background for subtle contrast |
| `--color-ink` | `#12382F` | Deep Forest: primary text, headlines, and high-contrast UI |
| `--color-ink-muted` | `#3D5449` | Secondary/body text, a restrained tint of Deep Forest |
| `--color-accent-gold` | `#D4A44C` | Heritage Gold: data callouts, active states, corridor line, numbers, CTAs |
| `--color-accent-terracotta` | `#B9623E` | Earth Terracotta: sparing photo duotone overlays and warmth accents; never UI chrome |
| `--color-surface` | `#FFFFFF` | Cards/panels floating on canvas, not the base background |
| `--color-border` | `#DCCBA9` | Sand-derived hairlines and dividers |

Dark sections, such as the Corridor & Clearance map background, use Deep
Forest (`#12382F`) as the field with Warm Ivory (`#F8F4EB`) and Heritage
Gold (`#D4A44C`) for contrast. This is the only place a dark background is
allowed: one narrative-contrast moment, not the site's default mode.

## Typography

| Token | Font | Weights | Use |
| --- | --- | --- | --- |
| `--font-display` | Sora | 600, 700, 800 | Headlines, chapter titles, HUD labels; use the supplied Sora files |
| `--font-body` | DM Sans | 400, 500, 700 | Body copy, navigation, form labels; use the supplied DM Sans files |
| `--font-mono` | IBM Plex Mono | 400, 500 | Telemetry/data only: coordinates, timestamps, HUD numbers, corridor codes. Never body copy or headlines. |

Headlines use Sora in sentence case or selective caps for emphasis, not
blanket all-caps. All-caps is reserved for short HUD and label text such
as `ASSET STATUS` and `CORRIDOR COVERAGE`, matching the Zirka-style
telemetry treatment.

### Logo Usage

- Use `Color Primary.png` for the main horizontal lockup on Warm Ivory or Soft Sand.
- Use `Color Secondary.png` when the lockup needs the compact secondary arrangement.
- Use `Color Icon.png` for the favicon, compact navigation, or icon-only contexts.
- Use `White Primary.png` and `White Secondary.png` only on Deep Forest or another approved dark image field.
- Use `White Icon.png` for icon-only dark-background contexts.
- Prefer the supplied vector PDF/EPS artwork for print or large-format production; do not redraw or recolor the mark.
- Keep the logo clear of surrounding content and never place the full-color marks on a visually busy image without a quiet field behind them.

### Type Scale

- **Display XL (hero headline):** 56-96px Sora 700, fluid via `clamp()`
- **Display L (chapter headline):** 36-56px Sora 700
- **Display M (section subhead):** 20-28px Sora 600
- **Body L:** 18-20px DM Sans 400
- **Body M:** 15-16px DM Sans 400
- **Label/HUD:** 12-14px IBM Plex Mono 500, `letter-spacing: 0.04em`

## Spacing

Use a 4px base unit. The spacing scale is:

`4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192`

Generous whitespace is a feature, not empty space. It supports the Forge
reference's restraint.

## Motion Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--ease-cinematic` | `cubic-bezier(0.65, 0, 0.35, 1)` | Scroll-scrubbed transitions and chapter reveals |
| `--ease-snap` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | UI micro-interactions and hover states |
| `--duration-fast` | `200ms` | Hover and tap feedback |
| `--duration-base` | `500ms` | Standard reveals |
| `--duration-cinematic` | `1200-2000ms` | Scroll-pinned sequences; variable and scroll-linked |

All pinned or scrubbed motion must define a `prefers-reduced-motion`
fallback: replace scroll-scrub with a simple fade or slide reveal, with no
pinning and no scrubbing.

## Component Conventions

- **Buttons:** Use one primary style, a solid ink background with canvas text, exactly once per chapter (Chapter 7, Verdict). Everywhere else, use quiet text links with an underline on hover rather than button-styled links.
- **Data readouts:** Always use `--font-mono`, paired with a Sora label above or beside the value. Never show a data readout standalone.
- **Cards/panels:** Use `--color-surface` on `--color-canvas`, a 1px `--color-border`, and no drop shadows. Keep them flat, precise, and free of soft SaaS styling.
- **Photography:** Prefer real fleet photography. Mark any unsourced placeholder with `[TBC PHOTO]`. Use a 3D-render fallback if real photography is unavailable.

## Explicitly Rejected

- Pure white (`#FFFFFF`) as the primary canvas: too clinical and mismatched to the logo.
- Safety orange or amber as the primary accent: the logo's gold reads more premium.
- Condensed all-caps headline treatment: generic-industrial rather than distinctive.
- Charcoal or navy dark mode by default: reserve dark backgrounds for the Corridor map moment, not the site's base register.
