# Coverage Section — Build Spec (v1)

**Status:** built (v1, skeleton) — components in `src/components/coverage/`,
mounted in `src/app/page.tsx` between Corridor and Portfolio. All
records in `src/data/coverage.ts` are placeholders marked TODO(copy) /
TODO(verify). Companion to `LANDING_LAYOUT.md` section 9.

**Purpose (the buyer's question):** *"do you run MY route?"* — answered
by an interactive footprint and a per-country record that always ends
somewhere.

## What's real (no hallucination anywhere)

| Asset | Where from |
|---|---|
| Basemap terrain | `public/southern-africa-hillshade-{5000,1600}.webp` — built by your `map_build/build_map.js` from SRTM terrarium tiles, Web Mercator, city-verified (Johannesburg, Gaborone, Beitbridge, Lusaka, Windhoek — err 0.0 m per `map_manifest.json`) |
| Country outlines | Natural Earth 110m admin-0 (public domain), downloaded to `map_build/ne_110m_countries.geojson` |
| Projection | `map_build/build_coverage.js` projects the Natural Earth rings into the basemap's exact pixel space (same Mercator maths, same corner coordinates as the manifest) → `src/data/coverage-territories.ts` (GENERATED, do not hand-edit) |

The outlines and the terrain share one georeferenced space, so every
country sits on its real geography. Regenerate with:

```
node map_build/build_coverage.js
```

## What's built

| File | Role |
|---|---|
| `coverage-territories.ts` | Generated territory paths + label anchors in map pixel space (viewBox 5000×6111) |
| `coverage.ts` | The 8 rail countries + records (all TODO), copy, legend |
| `CoverageSection.tsx` | Client root: viewport gate, **one selection state shared by rail + map paths + card** |
| `TerritoryMap.tsx` | The SVG: basemap `<image>` + interactive rail paths (selected renders last, never covered) + stroked labels |
| `CountryCard.tsx` | The record: status, metric, posts/authority/clearance/transit rows, lane CTA |
| `CoverageDesktop/Mobile.tsx` + CSS | Floating layout over the field / chip row + in-flow card |
| `useReveal.ts` | One-shot IntersectionObserver reveal (same contract as Process/Portfolio) |

**Interaction model:** hover/click a country on the map OR use the rail
(keyboard-accessible, real text — the map is `aria-hidden` because the
rail is its accessible twin, per LANDING_LAYOUT). The card follows the
selection; the map paints the selected country in gold.

**No dead ends:** every country's CTA is a prefilled WhatsApp deep link
(`buildWhatsAppTextLink` in `verdict/quote-form.ts` — the shared number
gate, returns null without the env var) that falls back to
`#verdict-section` when unset. `opening` countries say "Plan this
lane" — an opening lane is a lead, not a rejection.

## Open decisions (need your call before this is anything but a skeleton)

1. **The dark field.** The basemap is a dark terrain ramp, so this
   section sits on `--color-ink` with ivory text — a second dark
   section, which DESIGN.md currently reserves for Corridor alone.
   Your call: keep it (and I add a documented palette exception to
   DESIGN.md, the same treatment the WhatsApp green has) or fight the
   basemap light and lose the asset you built.
2. **The records themselves.** Posts, authorities, clearance times and
   metrics in `coverage.ts` are TODOs — they need a dispatch pass
   before the section says any number out loud.
3. **Frame.** The basemap covers lon 9.84–35.16, lat −36.6 to −8.4:
   Tanzania and the northern DRC are cropped at the top (as in the
   approved concept). The build script can regenerate a taller frame
   if you want those whole.
4. **Rail vs. floating.** Desktop floats rail + card over the field
   (per concept). If they crowd at short viewports, the fallback is a
   two-column light layout instead.
5. **All-SADC.** The rail is the 8 approved countries; the map also
   draws Namibia, Angola, Lesotho and Eswatini as quiet context. Add
   the rest of SADC to `WANTED` in the build script when ready.
