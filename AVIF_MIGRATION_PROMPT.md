TASK: Update this codebase after a bulk PNG -> AVIF image migration.

CONTEXT
- Images under `C:/Users/MauriX/Documents/DEVS/cargo_flow/cargo-flow-africa/public` (web root `C:/Users/MauriX/Documents/DEVS/cargo_flow/cargo-flow-africa/public` is served as `/`, so paths below are web paths like `/images/hero/a.png`) were converted from .png to .avif.
- Each converted file is in the SAME folder with the SAME base name; ONLY the extension changed (a.png -> a.avif).
- The original PNGs were moved to `C:/Users/MauriX/Documents/DEVS/cargo_flow/cargo-flow-africa/png_archive` (outside the web root). Never reference, modify or re-add files from that folder.
- ONLY the files listed under CONVERTED changed. Every other image, including those under KEPT AS PNG, must keep its current reference.

RULES
1. Search the whole project (exclude node_modules, .git, build/dist/.next/.dart_tool output, lockfiles and the archive folder) for every reference to each converted file. Match all forms: full path, root-relative ("/images/x.png"), relative ("./x.png", "../images/x.png"), and bare filename.
2. Replace `.png` with `.avif` for converted files only. Preserve case, query strings and hash fragments. Do not touch unrelated code or formatting (minimal diff).
3. Check all file types: html, css/scss/sass/less, js/jsx/ts/tsx, vue/svelte/astro, md/mdx, json, yaml/yml, php, blade/twig/ejs/hbs, dart + pubspec.yaml asset entries, xml, service-worker precache lists, sitemaps, framework configs (next/vite/webpack/nuxt/astro), and any data files or seed content that stores image paths.
4. Dynamic references: look for template strings, concatenation (`${name}.png`, "img/" + id + ".png"), arrays/maps of filenames, and DB/CMS/JSON content. Fix when the pattern is clear; if uncertain, do NOT guess, list it in the report.
5. Keep as PNG (do not switch to AVIF), and tell me if any of these point to a converted file so I can copy the PNG back from the archive: og:image, twitter:image, schema.org/JSON-LD image, favicons, apple-touch-icon, PWA manifest icons, email templates, RSS/feeds, native app icons, and anything consumed by platforms or tools without AVIF support (WhatsApp/Facebook/LinkedIn previews, many email clients).
6. Update MIME/type hints: `type="image/png"` -> `type="image/avif"` on <source>, <link rel="preload" as="image"> and similar, for converted files only. Confirm the server/CDN serves .avif as `image/avif` (nginx mime.types, Apache AddType, Netlify/Vercel/Cloudflare headers).
7. Framework image optimizers (next/image, etc.): make sure config allows AVIF and static imports still resolve.
8. Browser support: AVIF is fine for all current browsers. If the project targets older ones (e.g. Safari < 16), do not add fallbacks silently, flag it in the report.
9. Verify when done:
   a. grep for any remaining reference to a converted `.png` path -> should be zero except intentional cases from rule 5.
   b. every `.avif` path referenced in the code exists on disk.
   c. run the project's build/lint/tests and report the result.

DELIVERABLE
- Files changed + number of replacements per file.
- Dynamic/uncertain references that need my decision.
- References intentionally left as PNG, and which archive files I need to copy back.
- References to files that do not exist on disk.

CONVERTED (54):
- /fleet/flatbed.png -> /fleet/flatbed.avif  (1.5MB -> 146.8KB)
- /fleet/lowbed.png -> /fleet/lowbed.avif  (1.2MB -> 159.7KB)
- /fleet/side_tipper.png -> /fleet/side_tipper.avif  (1.5MB -> 194.6KB)
- /fleet/side_tipper_cinnematic.png -> /fleet/side_tipper_cinnematic.avif  (2.6MB -> 295.6KB)
- /fleet/tautliner.png -> /fleet/tautliner.avif  (1.8MB -> 150.4KB)
- /images/branch/gaborone_office.png -> /images/branch/gaborone_office.avif  (2.3MB -> 220.6KB)
- /images/branch/google-maps.png -> /images/branch/google-maps.avif  (26.8KB -> 10.1KB)
- /images/branch/johannesburg_office.png -> /images/branch/johannesburg_office.avif  (2.3MB -> 220.6KB)
- /images/hero/a-man-mobile.png -> /images/hero/a-man-mobile.avif  (902.6KB -> 87.3KB)
- /images/hero/a-trucks-desktop.png -> /images/hero/a-trucks-desktop.avif  (2.1MB -> 162.7KB)
- /images/hero/b-lowbed-desktop.png -> /images/hero/b-lowbed-desktop.avif  (666.0KB -> 82.3KB)
- /images/hero/b-lowbed-mobile.png -> /images/hero/b-lowbed-mobile.avif  (173.3KB -> 26.3KB)
- /images/hero/c-tri-desktop.png -> /images/hero/c-tri-desktop.avif  (897.8KB -> 97.2KB)
- /images/hero/c-wheels-mobile.png -> /images/hero/c-wheels-mobile.avif  (488.8KB -> 52.1KB)
- /images/hero-1/bg-sky-mobile.png -> /images/hero-1/bg-sky-mobile.avif  (906.0KB -> 50.4KB)
- /images/hero-1/bg-sky.png -> /images/hero-1/bg-sky.avif  (1.4MB -> 56.9KB)
- /images/hero-1/fg-grass.png -> /images/hero-1/fg-grass.avif  (940.5KB -> 112.1KB)
- /images/hero-1/fg-weeds.png -> /images/hero-1/fg-weeds.avif  (1.9MB -> 470.7KB)
- /images/hero-1/fg-weeds.png.png -> /images/hero-1/fg-weeds.png.avif  (1.9MB -> 470.7KB)
- /images/hero-1/fx-dust.png -> /images/hero-1/fx-dust.avif  (1.2MB -> 177.9KB)
- /images/hero-1/fx-glow.png -> /images/hero-1/fx-glow.avif  (185.1KB -> 29.1KB)
- /images/hero-1/fx-streaks.png -> /images/hero-1/fx-streaks.avif  (253.4KB -> 55.3KB)
- /images/hero-1/road-mobile.png -> /images/hero-1/road-mobile.avif  (2.0MB -> 120.8KB)
- /images/hero-1/road.png -> /images/hero-1/road.avif  (2.0MB -> 193.3KB)
- /images/hero-1/truck-faw.png -> /images/hero-1/truck-faw.avif  (1.7MB -> 126.5KB)
- /images/hero-1/truck-man.png -> /images/hero-1/truck-man.avif  (1.2MB -> 119.7KB)
- /images/hero-1/truck-scania.png -> /images/hero-1/truck-scania.avif  (1.5MB -> 127.0KB)
- /images/portfolio/apex-commodities-logo.png -> /images/portfolio/apex-commodities-logo.avif  (21.1KB -> 7.4KB)
- /images/portfolio/bono-logistic-logo.png -> /images/portfolio/bono-logistic-logo.avif  (12.4KB -> 7.2KB)
- /images/portfolio/consulmet-logo.png -> /images/portfolio/consulmet-logo.avif  (9.5KB -> 4.8KB)
- /images/portfolio/dms-powder-logo.png -> /images/portfolio/dms-powder-logo.avif  (13.1KB -> 5.0KB)
- /images/portfolio/eagle-african-resources-logo.png -> /images/portfolio/eagle-african-resources-logo.avif  (10.2KB -> 5.8KB)
- /images/portfolio/malaxino-logo.png -> /images/portfolio/malaxino-logo.avif  (29.4KB -> 10.4KB)
- /images/portfolio/rawbank-logo.png -> /images/portfolio/rawbank-logo.avif  (14.5KB -> 6.1KB)
- /images/portfolio/surya-mine-logo.png -> /images/portfolio/surya-mine-logo.avif  (19.8KB -> 6.2KB)
- /images/premise/desktop_left_panel.png -> /images/premise/desktop_left_panel.avif  (1.8MB -> 138.8KB)
- /images/premise/desktop_right_panel.png -> /images/premise/desktop_right_panel.avif  (2.2MB -> 174.2KB)
- /images/premise/mobile_left_panel.png -> /images/premise/mobile_left_panel.avif  (2.1MB -> 192.0KB)
- /images/premise/mobile_right_panel.png -> /images/premise/mobile_right_panel.avif  (1.9MB -> 137.4KB)
- /images/services/s1_desktop.png -> /images/services/s1_desktop.avif  (2.2MB -> 205.4KB)
- /images/services/s1_mobile.png -> /images/services/s1_mobile.avif  (2.1MB -> 180.0KB)
- /images/services/s2_desktop.png -> /images/services/s2_desktop.avif  (2.3MB -> 201.4KB)
- /images/services/s2_mobile.png -> /images/services/s2_mobile.avif  (2.1MB -> 176.3KB)
- /images/services/s3_desktop.png -> /images/services/s3_desktop.avif  (2.3MB -> 197.6KB)
- /images/services/s3_mobile.png -> /images/services/s3_mobile.avif  (2.4MB -> 193.8KB)
- /images/services/s4_desktop.png -> /images/services/s4_desktop.avif  (2.3MB -> 189.5KB)
- /images/services/s4_mobile.png -> /images/services/s4_mobile.avif  (2.1MB -> 158.0KB)
- /images/services/s5_desktop.png -> /images/services/s5_desktop.avif  (1.7MB -> 82.9KB)
- /images/services/s5_mobile.png -> /images/services/s5_mobile.avif  (1.8MB -> 118.6KB)
- /logo-desktop.png -> /logo-desktop.avif  (61.1KB -> 24.3KB)
- /logo-mobile.png -> /logo-mobile.avif  (61.1KB -> 24.3KB)
- /logo-mobile1.png -> /logo-mobile1.avif  (10.0KB -> 4.9KB)
- /southern-africa-wide.png -> /southern-africa-wide.avif  (2.4MB -> 259.7KB)
- /southern-africa.png -> /southern-africa.avif  (2.7MB -> 304.0KB)

KEPT AS PNG / NOT CONVERTED (4):
- /android-chrome-192x192.png  [protected name, keep PNG]
- /android-chrome-512x512.png  [protected name, keep PNG]
- /favicon-16x16.png  [protected name, keep PNG]
- /images/section_2_poster.png  [conversion failed, keep PNG]
